package com.parking.system.repository;

import com.parking.system.parking.composite.ParkingSlot;
import com.parking.system.parking.state.SlotState;
import com.parking.system.vehicle.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    List<ParkingSlot> findByState(SlotState state);
    List<ParkingSlot> findByStateAndSupportedVehicleType(SlotState state, VehicleType type);
}
