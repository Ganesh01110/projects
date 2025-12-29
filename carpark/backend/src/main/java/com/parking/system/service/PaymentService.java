package com.parking.system.service;

import com.parking.system.payment.strategy.PaymentStrategy;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PaymentService {
    private final Map<String, PaymentStrategy> paymentStrategies;

    public PaymentService(Map<String, PaymentStrategy> paymentStrategies) {
        this.paymentStrategies = paymentStrategies;
    }

    public boolean processPayment(String type, double amount) {
        // Strategy bean names are usually camelCase class names, e.g., "cardPaymentStrategy"
        String beanName = type.toLowerCase() + "PaymentStrategy";
        PaymentStrategy strategy = paymentStrategies.get(beanName);
        if (strategy == null) {
            throw new IllegalArgumentException("Invalid payment type: " + type);
        }
        return strategy.processPayment(amount);
    }
}
