package com.parking.system.pricing.strategy;

import com.parking.system.model.ParkingSession;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalTime;

@Component
public class PeakHourPricingStrategy implements PricingStrategy {
    private static final double NORMAL_RATE = 10.0;
    private static final double PEAK_RATE = 15.0;

    @Override
    public double calculatePrice(ParkingSession session) {
        if (session.getExitTime() == null) return 0.0;

        long hours = Duration.between(session.getEntryTime(), session.getExitTime()).toHours();
        if (hours < 1) hours = 1;

        // Simple peak hour logic: if entry or exit is between 9 AM and 6 PM
        LocalTime entryTime = session.getEntryTime().toLocalTime();
        boolean isPeak = entryTime.getHour() >= 9 && entryTime.getHour() <= 18;

        return hours * (isPeak ? PEAK_RATE : NORMAL_RATE);
    }
}
