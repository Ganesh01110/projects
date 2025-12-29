package com.parking.system.parking.strategy;

import com.parking.system.parking.composite.ParkingSlot;
import com.parking.system.parking.state.SlotState;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Component
public class DisabledFriendlyStrategy implements SlotAllocationStrategy {
    @Override
    public Optional<ParkingSlot> allocateSlot(List<ParkingSlot> slots) {
        // In a real system, we would filter by a boolean 'isDisabled' field.
        // For this LLD implementation without modifying the schema, 
        // we prioritize slots with specific IDs or pattern (e.g., first 5 slots logic)
        // or simply reuse nearest logic but conceptualized for disabled spots.
        return slots.stream()
                .filter(slot -> slot.getState() == SlotState.FREE)
                // Prioritize lower slot numbers (closest to entrance)
                .min(Comparator.comparing(ParkingSlot::getSlotNumber));
    }
}
