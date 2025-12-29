package com.parking.system.pricing.strategy;

import com.parking.system.model.ParkingSession;
import org.springframework.stereotype.Component;

@Component
public class FlatRatePricingStrategy implements PricingStrategy {
    @Override
    public double calculatePrice(ParkingSession session) {
        return 50.0; // Flat rate example
    }
}
