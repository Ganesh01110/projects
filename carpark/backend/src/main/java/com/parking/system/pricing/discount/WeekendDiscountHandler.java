package com.parking.system.pricing.discount;

import com.parking.system.model.ParkingSession;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;

@Component
public class WeekendDiscountHandler extends DiscountHandler {
    @Override
    protected double calculateDiscount(double currentBill, ParkingSession session) {
        DayOfWeek day = session.getEntryTime().getDayOfWeek();
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            return currentBill * 0.95; // 5% discount on weekends
        }
        return currentBill;
    }
}
