package com.parking.system.pricing.discount;

import com.parking.system.model.ParkingSession;
import org.springframework.stereotype.Component;

@Component
public class PromoCodeDiscountHandler extends DiscountHandler {
    @Override
    protected double calculateDiscount(double currentBill, ParkingSession session) {
        // Mock logic: if vehicle number starts with "PROMO", give 10% off
        if (session.getVehicleNumber().startsWith("PROMO")) {
            return currentBill * 0.90;
        }
        return currentBill;
    }
}
