package com.parking.system.parking.state;

import com.parking.system.parking.composite.ParkingSlot;

public interface ParkingSlotState {
    void occupy(ParkingSlot slot);
    void free(ParkingSlot slot);
}
