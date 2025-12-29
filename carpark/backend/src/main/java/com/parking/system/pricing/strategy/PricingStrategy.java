package com.parking.system.pricing.strategy;

import com.parking.system.model.ParkingSession;

public interface PricingStrategy {
    double calculatePrice(ParkingSession session);
}
