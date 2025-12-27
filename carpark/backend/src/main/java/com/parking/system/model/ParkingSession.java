package com.parking.system.model;

import com.parking.system.parking.composite.ParkingSlot;
import com.parking.system.vehicle.VehicleType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class ParkingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleNumber;
    
    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    private double totalAmount;
    
    @ManyToOne
    @JoinColumn(name = "slot_id")
    private ParkingSlot slot;

    private boolean active = true;

    public ParkingSession() {}

    public ParkingSession(String vehicleNumber, VehicleType vehicleType, ParkingSlot slot) {
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.slot = slot;
        this.entryTime = LocalDateTime.now();
        this.active = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }
    public LocalDateTime getEntryTime() { return entryTime; }
    public void setEntryTime(LocalDateTime entryTime) { this.entryTime = entryTime; }
    public LocalDateTime getExitTime() { return exitTime; }
    public void setExitTime(LocalDateTime exitTime) { this.exitTime = exitTime; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public ParkingSlot getSlot() { return slot; }
    public void setSlot(ParkingSlot slot) { this.slot = slot; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
