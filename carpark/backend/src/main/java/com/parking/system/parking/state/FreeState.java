package com.parking.system.parking.state;

import com.parking.system.parking.composite.ParkingSlot;
import org.springframework.stereotype.Component;

@Component
public class FreeState implements ParkingSlotState {
    @Override
    public void occupy(ParkingSlot slot) {
        System.out.println("Slot " + slot.getSlotNumber() + " is now OCCUPIED.");
        slot.setState(SlotState.OCCUPIED);
    }

    @Override
    public void free(ParkingSlot slot) {
        System.out.println("Slot " + slot.getSlotNumber() + " is already FREE.");
    }
}
