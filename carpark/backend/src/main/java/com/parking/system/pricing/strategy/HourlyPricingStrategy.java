package com.parking.system.pricing.strategy;

import com.parking.system.model.ParkingSession;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@Primary
public class HourlyPricingStrategy implements PricingStrategy {
    private static final double RATE_PER_HOUR = 10.0;

    @Override
    public double calculatePrice(ParkingSession session) {
        if (session.getExitTime() == null) return 0.0;
        
        long hours = Duration.between(session.getEntryTime(), session.getExitTime()).toHours();
        if (hours < 1) hours = 1; // Minimum 1 hour
        return hours * RATE_PER_HOUR;
    }
}
