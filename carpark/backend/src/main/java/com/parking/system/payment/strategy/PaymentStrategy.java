package com.parking.system.payment.strategy;

public interface PaymentStrategy {
    boolean processPayment(double amount);
}
