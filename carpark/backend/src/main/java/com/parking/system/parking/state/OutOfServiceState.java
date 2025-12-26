package com.parking.system.parking.state;

import com.parking.system.parking.composite.ParkingSlot;
import org.springframework.stereotype.Component;

@Component
public class OutOfServiceState implements ParkingSlotState {
    @Override
    public void occupy(ParkingSlot slot) {
        System.out.println("Slot " + slot.getSlotNumber() + " is OUT_OF_SERVICE.");
    }

    @Override
    public void free(ParkingSlot slot) {
        System.out.println("Slot " + slot.getSlotNumber() + " is restored to FREE.");
        slot.setState(SlotState.FREE);
    }
}
