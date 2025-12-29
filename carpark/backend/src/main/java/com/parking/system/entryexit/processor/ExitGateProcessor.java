package com.parking.system.entryexit.processor;

import com.parking.system.model.ParkingSession;
import com.parking.system.parking.composite.ParkingSlot;
import com.parking.system.parking.state.SlotState;
import com.parking.system.pricing.strategy.PricingStrategy;
import com.parking.system.repository.ParkingSessionRepository;
import com.parking.system.repository.ParkingSlotRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class ExitGateProcessor extends GateProcessor {
    private final ParkingSessionRepository sessionRepository;
    private final ParkingSlotRepository slotRepository;
    private final com.parking.system.billing.BillingService billingService;
    private final com.parking.system.service.BillingRecordService billingRecordService;
    private final com.parking.system.availability.AvailabilityEventPublisher eventPublisher;

    public ExitGateProcessor(ParkingSessionRepository sessionRepository, 
                             ParkingSlotRepository slotRepository, 
                             com.parking.system.billing.BillingService billingService, 
                             com.parking.system.service.BillingRecordService billingRecordService,
                             com.parking.system.availability.AvailabilityEventPublisher eventPublisher) {
        this.sessionRepository = sessionRepository;
        this.slotRepository = slotRepository;
        this.billingService = billingService;
        this.billingRecordService = billingRecordService;
        this.eventPublisher = eventPublisher;
    }

    // Context
    private String vehicleNumber;
    private ParkingSession session;
    private double billAmount;

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    @Override
    protected void validateRequest() {
         session = sessionRepository.findByVehicleNumberAndActiveTrue(vehicleNumber)
                .orElseThrow(() -> new IllegalArgumentException("No active session found for vehicle: " + vehicleNumber));
    }

    @Override
    protected void fetchContext() {
        session.setExitTime(LocalDateTime.now());
    }

    @Override
    @Transactional
    protected void executeCoreLogic() {
        // Calculate Bill via BillingService (Strategy + Chain)
        billAmount = billingService.generateBill(session);
        session.setTotalAmount(billAmount);
        session.setActive(false);
        sessionRepository.save(session);
        // Persist billing record
        try {
            var record = new com.parking.system.model.BillingRecord(session, billAmount);
            billingRecordService.save(record);
        } catch (Exception ex) {
            System.err.println("Failed to save billing record: " + ex.getMessage());
        }
        
        // Free Slot
        ParkingSlot slot = session.getSlot();
        slot.setState(SlotState.FREE);
        slotRepository.save(slot);
        
        // Notify Observers
        eventPublisher.publishAvailabilityChange(slot);
    }

    @Override
    protected void postProcess() {
        System.out.println("Exit Processed. Bill: $" + billAmount);
    }
    
    public double getBillAmount() {
        return billAmount;
    }
}
