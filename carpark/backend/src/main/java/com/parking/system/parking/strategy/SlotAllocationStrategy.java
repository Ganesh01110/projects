package com.parking.system.parking.strategy;

import com.parking.system.parking.composite.ParkingSlot;
import java.util.List;
import java.util.Optional;

public interface SlotAllocationStrategy {
    Optional<ParkingSlot> allocateSlot(List<ParkingSlot> slots);
}
