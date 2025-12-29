package com.parking.system.pricing.discount;

import com.parking.system.model.ParkingSession;

public abstract class DiscountHandler {
    protected DiscountHandler nextHandler;

    public void setNextHandler(DiscountHandler nextHandler) {
        this.nextHandler = nextHandler;
    }

    public double applyDiscount(double currentBill, ParkingSession session) {
        double discountedBill = calculateDiscount(currentBill, session);
        if (nextHandler != null) {
            return nextHandler.applyDiscount(discountedBill, session);
        }
        return discountedBill;
    }

    protected abstract double calculateDiscount(double currentBill, ParkingSession session);
}
