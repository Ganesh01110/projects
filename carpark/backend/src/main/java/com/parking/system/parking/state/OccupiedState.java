package com.parking.system.parking.state;

import com.parking.system.parking.composite.ParkingSlot;
import org.springframework.stereotype.Component;

@Component
public class OccupiedState implements ParkingSlotState {
    @Override
    public void occupy(ParkingSlot slot) {
        System.out.println("Slot " + slot.getSlotNumber() + " is already OCCUPIED.");
    }

    @Override
    public void free(ParkingSlot slot) {
        System.out.println("Slot " + slot.getSlotNumber() + " is now FREE.");
        slot.setState(SlotState.FREE);
    }
}
