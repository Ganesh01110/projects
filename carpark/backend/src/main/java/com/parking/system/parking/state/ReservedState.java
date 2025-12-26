package com.parking.system.parking.state;

import com.parking.system.parking.composite.ParkingSlot;
import org.springframework.stereotype.Component;

@Component
public class ReservedState implements ParkingSlotState {
    @Override
    public void occupy(ParkingSlot slot) {
        System.out.println("Slot " + slot.getSlotNumber() + " is RESERVED and cannot be occupied by general users.");
    }

    @Override
    public void free(ParkingSlot slot) {
        System.out.println("Slot " + slot.getSlotNumber() + " is now FREE (reservation ended).");
        slot.setState(SlotState.FREE);
    }
}
