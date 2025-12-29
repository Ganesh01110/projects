package com.parking.system.service;

import com.parking.system.model.RefreshToken;
import com.parking.system.model.User;
import com.parking.system.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    private final long refreshTokenDurationDays;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
                               @Value("${app.jwtRefreshDays:7}") long refreshTokenDurationDays) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshTokenDurationDays = refreshTokenDurationDays;
    }

    public RefreshToken createRefreshToken(User user) {
        String token = UUID.randomUUID().toString();
        Instant expiry = Instant.now().plus(refreshTokenDurationDays, ChronoUnit.DAYS);
        RefreshToken refreshToken = new RefreshToken(token, user, expiry);
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public int deleteByUserId(User user) {
        return refreshTokenRepository.deleteByUser(user);
    }
}
