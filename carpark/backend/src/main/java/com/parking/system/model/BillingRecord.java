package com.parking.system.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class BillingRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private ParkingSession session;

    private double amount;

    private boolean paid = false;

    private LocalDateTime paidAt;

    private LocalDateTime createdAt = LocalDateTime.now();

    public BillingRecord() {}

    public BillingRecord(ParkingSession session, double amount) {
        this.session = session;
        this.amount = amount;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ParkingSession getSession() { return session; }
    public void setSession(ParkingSession session) { this.session = session; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
