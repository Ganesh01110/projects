package com.parking.system.config;

import com.parking.system.model.Role;
import com.parking.system.model.User;
import com.parking.system.parking.composite.ParkingFloor;
import com.parking.system.parking.composite.ParkingLot;
import com.parking.system.parking.composite.ParkingSlot;
import com.parking.system.parking.state.SlotState;
import com.parking.system.repository.*;
import com.parking.system.vehicle.VehicleType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@org.springframework.transaction.annotation.Transactional
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private ParkingLotRepository parkingLotRepository;
    
    @Autowired
    private ParkingSessionRepository parkingSessionRepository;

    @Autowired
    private com.parking.system.repository.BillingRecordRepository billingRecordRepository;

    @Autowired
    private com.parking.system.repository.ZoneRepository zoneRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            seedRoles();
            seedUsers();
            seedZones();
            seedParkingLot();
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR IN DATA SEEDER:");
            e.printStackTrace();
            throw e;
        }
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(null, Role.ERole.ROLE_USER));
            roleRepository.save(new Role(null, Role.ERole.ROLE_MODERATOR));
            roleRepository.save(new Role(null, Role.ERole.ROLE_ADMIN));
            roleRepository.save(new Role(null, Role.ERole.ROLE_OPERATOR));
        }
    }

    private void seedZones() {
        if (zoneRepository.count() == 0) {
            zoneRepository.save(new com.parking.system.parking.composite.Zone("Zone A"));
            zoneRepository.save(new com.parking.system.parking.composite.Zone("Zone B"));
            zoneRepository.save(new com.parking.system.parking.composite.Zone("Zone C"));
            System.out.println("Seeded Zones: A, B, C");
        }
    }

    private void seedUsers() {
        // Ensure an admin user exists with the requested credentials
        Set<Role> roles = new HashSet<>();
        roleRepository.findByName(Role.ERole.ROLE_ADMIN).ifPresent(roles::add);

        String adminUsername = "admin";
        String adminEmail = "admin@digipark.com";
        String adminPassword = "admin123";

        // Try to find existing admin by username or email
        userRepository.findByUsername(adminUsername).or(() -> userRepository.findByEmail(adminEmail)).ifPresentOrElse(existing -> {
            existing.setEmail(adminEmail);
            existing.setPassword(encoder.encode(adminPassword));
            existing.setRoles(roles);
            userRepository.save(existing);
            System.out.println("Admin user updated: " + adminEmail);
        }, () -> {
            User admin = User.builder()
                    .username(adminUsername)
                    .email(adminEmail)
                    .password(encoder.encode(adminPassword))
                    .roles(roles)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created: " + adminEmail);
        });

        // Create an operator user
        Set<Role> opRoles = new HashSet<>();
        roleRepository.findByName(Role.ERole.ROLE_OPERATOR).ifPresent(opRoles::add);
        String opUsername = "operator";
        String opEmail = "operator@digipark.com";
        String opPassword = "operator123";

        userRepository.findByUsername(opUsername).or(() -> userRepository.findByEmail(opEmail)).ifPresentOrElse(existing -> {
            existing.setEmail(opEmail);
            existing.setPassword(encoder.encode(opPassword));
            existing.setRoles(opRoles);
            userRepository.save(existing);
            System.out.println("Operator user updated: " + opEmail);
        }, () -> {
            User op = User.builder()
                    .username(opUsername)
                    .email(opEmail)
                    .password(encoder.encode(opPassword))
                    .roles(opRoles)
                    .build();
            userRepository.save(op);
            System.out.println("Operator user created: " + opEmail);
        });

        // Create a demo regular user
        Set<Role> userRoles = new HashSet<>();
        roleRepository.findByName(Role.ERole.ROLE_USER).ifPresent(userRoles::add);
        String demoUsername = "demo";
        String demoEmail = "demo@digipark.com";
        String demoPassword = "demo123";

        userRepository.findByUsername(demoUsername).or(() -> userRepository.findByEmail(demoEmail)).ifPresentOrElse(existing -> {
            existing.setEmail(demoEmail);
            existing.setPassword(encoder.encode(demoPassword));
            existing.setRoles(userRoles);
            userRepository.save(existing);
            System.out.println("Demo user updated: " + demoEmail);
        }, () -> {
            User demo = User.builder()
                    .username(demoUsername)
                    .email(demoEmail)
                    .password(encoder.encode(demoPassword))
                    .roles(userRoles)
                    .build();
            userRepository.save(demo);
            System.out.println("Demo user created: " + demoEmail);
        });
    }

    private void seedParkingLot() {
        if (parkingLotRepository.count() == 0) {
            com.parking.system.parking.composite.Zone zoneA = zoneRepository.findAll().stream()
                    .filter(z -> z.getName().equals("Zone A")).findFirst().orElse(null);
            com.parking.system.parking.composite.Zone zoneB = zoneRepository.findAll().stream()
                    .filter(z -> z.getName().equals("Zone B")).findFirst().orElse(null);

            ParkingLot lot1 = new ParkingLot();
            lot1.setName("Dubai Marina Parking");
            lot1.setAddress("Courtyard Marina View Tower");
            lot1.setZone(zoneA);
            
            // Floor 1
            ParkingFloor floor1 = new ParkingFloor();
            floor1.setFloorNumber(1);
            floor1.setParkingLot(lot1);
            
            // Add slots to Floor 1
            for (int i = 1; i <= 6; i++) {
                ParkingSlot slot = new ParkingSlot();
                slot.setSlotNumber(120 + i);
                slot.setSupportedVehicleType(i % 3 == 0 ? VehicleType.TRUCK : VehicleType.CAR);
                slot.setState(SlotState.FREE);
                slot.setParkingFloor(floor1);
                floor1.getSlots().add(slot);
            }

            lot1.getFloors().add(floor1);
            parkingLotRepository.save(lot1);

            // Lot 2 in Zone B
            ParkingLot lot2 = new ParkingLot();
            lot2.setName("Downtown Boulevard");
            lot2.setAddress("Al Ohood St. 87");
            lot2.setZone(zoneB);

            ParkingFloor floor2 = new ParkingFloor();
            floor2.setFloorNumber(1);
            floor2.setParkingLot(lot2);

            for (int i = 1; i <= 4; i++) {
                ParkingSlot slot = new ParkingSlot();
                slot.setSlotNumber(200 + i);
                slot.setSupportedVehicleType(VehicleType.CAR);
                slot.setState(SlotState.FREE);
                slot.setParkingFloor(floor2);
                floor2.getSlots().add(slot);
            }

            lot2.getFloors().add(floor2);
            parkingLotRepository.save(lot2);

            System.out.println("Seeded Parking Lots in Zone A and Zone B.");
        }

        // Seed a sample parking session and billing record for testing
        if (parkingSessionRepository.count() == 0) {
            var floorOpt = parkingLotRepository.findAll().stream().findFirst();
            if (floorOpt.isPresent() && !floorOpt.get().getFloors().isEmpty()) {
                var floor = floorOpt.get().getFloors().get(0);
                var slot = floor.getSlots().stream().filter(s -> s.getState() != null).findFirst().orElse(null);
                if (slot != null) {
                    com.parking.system.model.ParkingSession session = new com.parking.system.model.ParkingSession();
                    session.setVehicleNumber("TEST-1234");
                    session.setVehicleType(com.parking.system.vehicle.VehicleType.CAR);
                    session.setSlot(slot);
                    session.setEntryTime(java.time.LocalDateTime.now().minusHours(2));
                    session.setActive(true);
                    parkingSessionRepository.save(session);

                    com.parking.system.model.BillingRecord record = new com.parking.system.model.BillingRecord(session, 20.0);
                    billingRecordRepository.save(record);
                    System.out.println("Seeded ParkingSession TEST-1234 and BillingRecord.");
                }
            }
        }

        // Seed an additional finished session + billing record for history
        if (billingRecordRepository.count() == 0) {
            // create a completed session
            var floorOpt = parkingLotRepository.findAll().stream().findFirst();
            if (floorOpt.isPresent() && !floorOpt.get().getFloors().isEmpty()) {
                var floor = floorOpt.get().getFloors().get(0);
                var slot2 = floor.getSlots().stream().skip(1).findFirst().orElse(null);
                if (slot2 != null) {
                    com.parking.system.model.ParkingSession finished = new com.parking.system.model.ParkingSession();
                    finished.setVehicleNumber("HIST-5678");
                    finished.setVehicleType(com.parking.system.vehicle.VehicleType.CAR);
                    finished.setSlot(slot2);
                    finished.setEntryTime(java.time.LocalDateTime.now().minusDays(1));
                    finished.setExitTime(java.time.LocalDateTime.now().minusHours(20));
                    finished.setActive(false);
                    finished.setTotalAmount(12.5);
                    parkingSessionRepository.save(finished);

                    com.parking.system.model.BillingRecord hist = new com.parking.system.model.BillingRecord(finished, 12.5);
                    hist.setPaid(true);
                    hist.setPaidAt(java.time.LocalDateTime.now().minusHours(20));
                    billingRecordRepository.save(hist);
                    System.out.println("Seeded historical ParkingSession HIST-5678 and BillingRecord.");
                }
            }
        }
    }
}
