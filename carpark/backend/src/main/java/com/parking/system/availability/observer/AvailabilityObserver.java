package com.parking.system.availability.observer;

import com.parking.system.parking.composite.ParkingSlot;

public interface AvailabilityObserver {
    void update(ParkingSlot slot);
}
