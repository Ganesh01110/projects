package com.parking.system.parking.composite;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ParkingLot implements ParkingComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "zone_id")
    private Zone zone;

    @OneToMany(mappedBy = "parkingLot", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ParkingFloor> floors = new ArrayList<>();

    public ParkingLot() {}

    public Zone getZone() { return zone; }
    public void setZone(Zone zone) { this.zone = zone; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public List<ParkingFloor> getFloors() { return floors; }
    public void setFloors(List<ParkingFloor> floors) { this.floors = floors; }

    @Override
    public void showDetails() {
        System.out.println("Parking Lot: " + name);
        floors.forEach(ParkingComponent::showDetails);
    }
}
