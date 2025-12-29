package com.parking.system.availability.observer;

import com.parking.system.parking.composite.ParkingSlot;
import org.springframework.stereotype.Component;

@Component
public class CacheObserver implements AvailabilityObserver {

    @Override
    public void update(ParkingSlot slot) {
        // In a real system, this would update a Redis cache or similar.
        // For now, we simulate the LLD requirement by logging the cache update.
        System.out.println("CacheObserver: Updating availability cache for slot " + slot.getSlotNumber() + " -> " + slot.getState());
    }
}
