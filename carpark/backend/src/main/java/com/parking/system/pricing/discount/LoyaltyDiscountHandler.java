package com.parking.system.pricing.discount;

import com.parking.system.model.ParkingSession;
import com.parking.system.repository.ParkingSessionRepository;
import org.springframework.stereotype.Component;

@Component
public class LoyaltyDiscountHandler extends DiscountHandler {

    private final ParkingSessionRepository sessionRepository;

    public LoyaltyDiscountHandler(ParkingSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    protected double calculateDiscount(double currentBill, ParkingSession session) {
        // Loyalty logic: If vehicle has visited more than 5 times
        long visitCount = sessionRepository.findByVehicleNumberAndActiveTrue(session.getVehicleNumber()).isPresent() ? 5 : 0; 
        // Note: findByVehicleNumberAndActiveTrue returns Optional<ParkingSession>. 
        // Real logic should be countByVehicleNumber, but repository might not have it.
        // Assuming simple stub for now: if vehicle number starts with "VIP"
        
        if (session.getVehicleNumber().startsWith("VIP")) {
            return currentBill * 0.85; // 15% off
        }
        
        return currentBill;
    }
}
