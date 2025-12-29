package com.parking.system.parking.composite;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
public class ParkingFloor implements ParkingComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int floorNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_lot_id")
    @JsonIgnore
    private ParkingLot parkingLot;

    @OneToMany(mappedBy = "parkingFloor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ParkingSlot> slots = new ArrayList<>();

    public ParkingFloor() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getFloorNumber() { return floorNumber; }
    public void setFloorNumber(int floorNumber) { this.floorNumber = floorNumber; }
    public ParkingLot getParkingLot() { return parkingLot; }
    public void setParkingLot(ParkingLot parkingLot) { this.parkingLot = parkingLot; }
    public List<ParkingSlot> getSlots() { return slots; }
    public void setSlots(List<ParkingSlot> slots) { this.slots = slots; }

    @Override
    public void showDetails() {
        System.out.println("Partking Floor: " + floorNumber);
        slots.forEach(ParkingComponent::showDetails);
    }
}
