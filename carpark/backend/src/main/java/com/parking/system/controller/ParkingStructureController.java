package com.parking.system.controller;

import com.parking.system.parking.composite.ParkingFloor;
import com.parking.system.parking.composite.ParkingLot;
import com.parking.system.parking.composite.ParkingSlot;
import com.parking.system.repository.ParkingFloorRepository;
import com.parking.system.repository.ParkingLotRepository;
import com.parking.system.repository.ParkingSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/structure", "/api/parking"})
public class ParkingStructureController {

    @Autowired
    private ParkingLotRepository lotRepository;

    @Autowired
    private ParkingFloorRepository floorRepository;

    @Autowired
    private ParkingSlotRepository slotRepository;

    @Autowired
    private com.parking.system.repository.ZoneRepository zoneRepository;

    // --- Zone Management ---
    @GetMapping("/zones")
    public List<com.parking.system.parking.composite.Zone> getAllZones() {
        return zoneRepository.findAll();
    }

    @PostMapping("/zones")
    @PreAuthorize("hasRole('ADMIN')")
    public com.parking.system.parking.composite.Zone createZone(@RequestBody com.parking.system.parking.composite.Zone zone) {
        return zoneRepository.save(zone);
    }

    @DeleteMapping("/zones/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteZone(@PathVariable Long id) {
        zoneRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Building (ParkingLot) Management ---
    @GetMapping("/lots")
    public List<ParkingLot> getAllLots() {
        return lotRepository.findAll();
    }

    @GetMapping("/zones/{zoneId}/lots")
    public List<ParkingLot> getLotsByZone(@PathVariable Long zoneId) {
        return lotRepository.findAll().stream()
                .filter(l -> l.getZone() != null && l.getZone().getId().equals(zoneId))
                .toList();
    }

    @PostMapping("/lots")
    @PreAuthorize("hasRole('ADMIN')")
    public ParkingLot createLot(@RequestBody ParkingLot lot) {
        // Expected lot might have a zone object with ID
        if (lot.getZone() != null && lot.getZone().getId() != null) {
            com.parking.system.parking.composite.Zone zone = zoneRepository.findById(lot.getZone().getId())
                    .orElseThrow(() -> new RuntimeException("Zone not found"));
            lot.setZone(zone);
        }
        return lotRepository.save(lot);
    }

    @DeleteMapping("/lots/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteLot(@PathVariable Long id) {
        lotRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Floor Management ---
    @GetMapping("/lots/{lotId}/floors")
    public List<ParkingFloor> getFloorsByLot(@PathVariable Long lotId) {
        return floorRepository.findAll().stream()
                .filter(f -> f.getParkingLot().getId().equals(lotId))
                .toList();
    }

    @PostMapping("/lots/{lotId}/floors")
    @PreAuthorize("hasRole('ADMIN')")
    public ParkingFloor createFloor(@PathVariable Long lotId, @RequestBody ParkingFloor floor) {
        ParkingLot lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new RuntimeException("Lot not found"));
        floor.setParkingLot(lot);
        return floorRepository.save(floor);
    }

    // --- Slot Management ---
    @GetMapping("/floors/{floorId}/slots")
    public List<ParkingSlot> getSlotsByFloor(@PathVariable Long floorId) {
        return slotRepository.findAll().stream()
                .filter(s -> s.getParkingFloor().getId().equals(floorId))
                .toList();
    }

    @PostMapping("/floors/{floorId}/slots")
    @PreAuthorize("hasRole('ADMIN')")
    public ParkingSlot createSlot(@PathVariable Long floorId, @RequestBody ParkingSlot slot) {
        ParkingFloor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new RuntimeException("Floor not found"));
        slot.setParkingFloor(floor);
        return slotRepository.save(slot);
    }
}
