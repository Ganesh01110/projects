package com.parking.system.dashboard;

import com.parking.system.parking.state.SlotState;
import com.parking.system.repository.BillingRecordRepository;
import com.parking.system.repository.ParkingSessionRepository;
import com.parking.system.repository.ParkingSlotRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardFacade {
    private final ParkingSlotRepository slotRepository;
    private final ParkingSessionRepository sessionRepository;
    private final BillingRecordRepository billingRecordRepository;

    public DashboardFacade(ParkingSlotRepository slotRepository, 
                           ParkingSessionRepository sessionRepository,
                           BillingRecordRepository billingRecordRepository) {
        this.slotRepository = slotRepository;
        this.sessionRepository = sessionRepository;
        this.billingRecordRepository = billingRecordRepository;
    }

    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalSlots", slotRepository.count());
        data.put("occupiedSlots", slotRepository.findByState(SlotState.OCCUPIED).size());
        data.put("freeSlots", slotRepository.findByState(SlotState.FREE).size());
        data.put("activeSessions", sessionRepository.countByActiveTrue()); 
        
        // Revenue calculation
        double totalRevenue = billingRecordRepository.findAll().stream()
                .mapToDouble(record -> record.getAmount())
                .sum();
        data.put("totalRevenue", totalRevenue);
        
        return data;
    }

    public Map<String, Object> getUserDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("availableSlots", slotRepository.findByState(SlotState.FREE).size());
        return data;
    }
}
