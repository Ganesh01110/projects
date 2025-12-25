package com.parking.system.controller;

import com.parking.system.dto.request.LoginRequest;
import com.parking.system.dto.request.SignupRequest;
import com.parking.system.dto.response.JwtResponse;
import com.parking.system.dto.response.MessageResponse;
import com.parking.system.model.Role;
import com.parking.system.model.User;
import com.parking.system.repository.RoleRepository;
import com.parking.system.repository.UserRepository;
import com.parking.system.security.jwt.JwtUtils;
import com.parking.system.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    com.parking.system.service.RefreshTokenService refreshTokenService;
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Create refresh token and set as HttpOnly cookie
        var userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isPresent()) {
            var refresh = refreshTokenService.createRefreshToken(userOpt.get());
            Cookie cookie = new Cookie("refreshToken", refresh.getToken());
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24 * 7); // 7 days
            response.addCookie(cookie);
            // Use Lax for localhost development to ensure cookie is sent on refresh
            String setCookie = String.format("refreshToken=%s; Max-Age=%d; Path=/; HttpOnly; SameSite=Lax", refresh.getToken(), 60 * 60 * 24 * 7);
            response.addHeader("Set-Cookie", setCookie);
        }

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    // POST /api/auth/refresh - reads refresh token cookie and returns a new access token
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(value = "refreshToken", required = false) String refreshToken,
                                          HttpServletResponse response) {
        if (refreshToken == null) {
            return ResponseEntity.status(401).body(new MessageResponse("Refresh token is missing"));
        }

        var tokenOpt = refreshTokenService.findByToken(refreshToken);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new MessageResponse("Invalid refresh token"));
        }

        try {
            var token = refreshTokenService.verifyExpiration(tokenOpt.get());
            var username = token.getUser().getUsername();
            String newAccess = jwtUtils.generateJwtTokenFromUsername(username);
            return ResponseEntity.ok(new JwtResponse(newAccess,
                    token.getUser().getId(),
                    token.getUser().getUsername(),
                    token.getUser().getEmail(),
                    token.getUser().getRoles().stream().map(r -> r.getName().name()).toList()));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(401).body(new MessageResponse(ex.getMessage()));
        }
    }

    // POST /api/auth/logout - clears refresh token cookie and deletes token server-side
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(value = "refreshToken", required = false) String refreshToken,
                                    HttpServletResponse response) {
        if (refreshToken != null) {
            refreshTokenService.findByToken(refreshToken).ifPresent(rt -> refreshTokenService.deleteByUserId(rt.getUser()));
            // Clear cookie
            Cookie cookie = new Cookie("refreshToken", null);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        }

        return ResponseEntity.ok(new MessageResponse("You've been logged out!"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .build();

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(Role.ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(Role.ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(Role.ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Unauthorized"));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        JwtResponse profile = new JwtResponse(null,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles);

        return ResponseEntity.ok(profile);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream().map(u -> new JwtResponse(null, u.getId(), u.getUsername(), u.getEmail(), u.getRoles().stream().map(r -> r.getName().name()).toList())).toList());
    }

    @GetMapping("/roles")
    public ResponseEntity<?> getRoles() {
        return ResponseEntity.ok(java.util.Arrays.stream(Role.ERole.values()).map(Enum::name).toList());
    }
}
