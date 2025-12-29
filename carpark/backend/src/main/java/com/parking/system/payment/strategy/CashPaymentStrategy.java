package com.parking.system.payment.strategy;

import org.springframework.stereotype.Component;

@Component
public class CashPaymentStrategy implements PaymentStrategy {
    @Override
    public boolean processPayment(double amount) {
        System.out.println("Processing cash payment of $" + amount);
        return true; // Mock success
    }
}
