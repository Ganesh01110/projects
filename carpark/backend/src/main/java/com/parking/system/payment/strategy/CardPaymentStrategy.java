package com.parking.system.payment.strategy;

import org.springframework.stereotype.Component;

@Component
public class CardPaymentStrategy implements PaymentStrategy {
    @Override
    public boolean processPayment(double amount) {
        System.out.println("Processing credit/debit card payment of $" + amount);
        return true; // Mock success
    }
}
