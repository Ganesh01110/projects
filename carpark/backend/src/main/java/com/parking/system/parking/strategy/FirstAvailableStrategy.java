package com.parking.system.parking.strategy;

import com.parking.system.parking.composite.ParkingSlot;
import com.parking.system.parking.state.SlotState;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class FirstAvailableStrategy implements SlotAllocationStrategy {
    @Override
    public Optional<ParkingSlot> allocateSlot(List<ParkingSlot> slots) {
        return slots.stream()
                .filter(slot -> slot.getState() == SlotState.FREE)
                .findFirst();
    }
}
