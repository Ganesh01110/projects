package com.parking.system.payment.strategy;

import org.springframework.stereotype.Component;

@Component
public class UPIPaymentStrategy implements PaymentStrategy {
    @Override
    public boolean processPayment(double amount) {
        System.out.println("Processing UPI payment of $" + amount);
        return true; // Mock success
    }
}
