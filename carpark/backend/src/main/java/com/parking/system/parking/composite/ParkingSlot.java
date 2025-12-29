package com.parking.system.parking.composite;

import com.parking.system.parking.state.SlotState;
import com.parking.system.vehicle.VehicleType;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
public class ParkingSlot implements ParkingComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int slotNumber;

    @Enumerated(EnumType.STRING)
    private VehicleType supportedVehicleType;

    @Enumerated(EnumType.STRING)
    private SlotState state = SlotState.FREE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_floor_id")
    @JsonIgnore
    private ParkingFloor parkingFloor;

    public ParkingSlot() {}

    public ParkingSlot(Long id, int slotNumber, SlotState state, VehicleType supportedVehicleType, ParkingFloor parkingFloor) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.state = state;
        this.supportedVehicleType = supportedVehicleType;
        this.parkingFloor = parkingFloor;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getSlotNumber() { return slotNumber; }
    public void setSlotNumber(int slotNumber) { this.slotNumber = slotNumber; }
    public VehicleType getSupportedVehicleType() { return supportedVehicleType; }
    public void setSupportedVehicleType(VehicleType supportedVehicleType) { this.supportedVehicleType = supportedVehicleType; }
    public SlotState getState() { return state; }
    public void setState(SlotState state) { this.state = state; }
    public ParkingFloor getParkingFloor() { return parkingFloor; }
    public void setParkingFloor(ParkingFloor parkingFloor) { this.parkingFloor = parkingFloor; }

    @Override
    public void showDetails() {
        System.out.println("Slot Number: " + slotNumber + ", Type: " + supportedVehicleType + ", State: " + state);
    }
}
