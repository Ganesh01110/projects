package com.parking.system.availability.observer;

import com.parking.system.parking.composite.ParkingSlot;
import org.springframework.stereotype.Component;

@Component
public class DashboardObserver implements AvailabilityObserver {
    @Override
    public void update(ParkingSlot slot) {
        System.out.println("Dashboard Notified: Slot " + slot.getSlotNumber() + " is now " + slot.getState());
        // Here we would push via WebSocket to frontend
    }
}
