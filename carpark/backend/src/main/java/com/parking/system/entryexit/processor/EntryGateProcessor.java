package com.parking.system.entryexit.processor;

import com.parking.system.model.ParkingSession;
import com.parking.system.parking.composite.ParkingSlot;
import com.parking.system.parking.state.SlotState;
import com.parking.system.parking.strategy.SlotAllocationStrategy;
import com.parking.system.repository.ParkingSessionRepository;
import com.parking.system.repository.ParkingSlotRepository;
import com.parking.system.vehicle.Vehicle;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class EntryGateProcessor extends GateProcessor {
    private final SlotAllocationStrategy allocationStrategy;
    private final ParkingSlotRepository slotRepository;
    private final ParkingSessionRepository sessionRepository;
    private final com.parking.system.availability.AvailabilityEventPublisher eventPublisher;

    public EntryGateProcessor(SlotAllocationStrategy allocationStrategy, 
                              ParkingSlotRepository slotRepository, 
                              ParkingSessionRepository sessionRepository, 
                              com.parking.system.availability.AvailabilityEventPublisher eventPublisher) {
        this.allocationStrategy = allocationStrategy;
        this.slotRepository = slotRepository;
        this.sessionRepository = sessionRepository;
        this.eventPublisher = eventPublisher;
    }
    
    // Context
    private Vehicle vehicle;
    private ParkingSlot allocatedSlot;

    // Setter for context initialization before process()
    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    @Override
    protected void validateRequest() {
        if (vehicle == null) throw new IllegalArgumentException("Vehicle cannot be null");
        // Check if vehicle already inside
        if (sessionRepository.findByVehicleNumberAndActiveTrue(vehicle.getVehicleNumber()).isPresent()) {
             throw new IllegalStateException("Vehicle already parked");
        }
    }

    @Override
    protected void fetchContext() {
        // Prepare data
    }

    @Override
    @Transactional
    protected void executeCoreLogic() {
        // Allocate Slot
        // We need to fetch all slots for strategy? Or repository handles filtering?
        // Strategy interface takes list of slots.
        // Simplified: Fetch all FREE slots matching type
        var matchingSlots = slotRepository.findByStateAndSupportedVehicleType(
                SlotState.FREE, vehicle.vehicleType());
        
        allocatedSlot = allocationStrategy.allocateSlot(matchingSlots)
                .orElseThrow(() -> new RuntimeException("No slots available for type: " + vehicle.vehicleType()));
        
        // Update Slot State
        allocatedSlot.setState(SlotState.OCCUPIED);
        slotRepository.save(allocatedSlot);

        // Create Session
        ParkingSession session = new ParkingSession(vehicle.getVehicleNumber(), vehicle.vehicleType(), allocatedSlot);
        sessionRepository.save(session);
        
        // Notify Observers
        eventPublisher.publishAvailabilityChange(allocatedSlot);
    }

    @Override
    protected void postProcess() {
        System.out.println("Entry Processed for vehicle: " + vehicle.getVehicleNumber() + " at slot: " + allocatedSlot.getSlotNumber());
    }
}
