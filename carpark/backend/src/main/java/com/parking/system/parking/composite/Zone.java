package com.parking.system.parking.composite;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "zones")
public class Zone implements ParkingComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ParkingLot> buildings = new ArrayList<>();

    public Zone() {}

    public Zone(String name) {
        this.name = name;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<ParkingLot> getBuildings() { return buildings; }
    public void setBuildings(List<ParkingLot> buildings) { this.buildings = buildings; }

    @Override
    public void showDetails() {
        System.out.println("Zone: " + name);
        buildings.forEach(ParkingComponent::showDetails);
    }
}
