package com.parking.system.repository;

import com.parking.system.model.ParkingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParkingSessionRepository extends JpaRepository<ParkingSession, Long> {
    Optional<ParkingSession> findByVehicleNumberAndActiveTrue(String vehicleNumber);
    long countByActiveTrue();
}
