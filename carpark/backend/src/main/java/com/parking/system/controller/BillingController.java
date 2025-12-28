package com.parking.system.controller;

import com.parking.system.dto.response.MessageResponse;
import com.parking.system.model.BillingRecord;
import com.parking.system.model.ParkingSession;
import com.parking.system.repository.ParkingSessionRepository;
import com.parking.system.service.BillingRecordService;
import com.parking.system.billing.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/billing")
public class BillingController {
    private final BillingService billingService;
    private final BillingRecordService billingRecordService;
    private final ParkingSessionRepository sessionRepository;

    public BillingController(BillingService billingService, BillingRecordService billingRecordService, ParkingSessionRepository sessionRepository) {
        this.billingService = billingService;
        this.billingRecordService = billingRecordService;
        this.sessionRepository = sessionRepository;
    }

    // GET /api/billing/history
    @GetMapping("/history")
    public ResponseEntity<?> history() {
        List<BillingRecord> records = billingRecordService.findAll();
        return ResponseEntity.ok(records);
    }

    // GET /api/billing/current?vehicleNumber=XYZ
    @GetMapping("/current")
    public ResponseEntity<?> current(@RequestParam String vehicleNumber) {
        var sessionOpt = sessionRepository.findByVehicleNumberAndActiveTrue(vehicleNumber);
        if (sessionOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("No active session found"));
        }
        ParkingSession session = sessionOpt.get();
        double amount = billingService.generateBill(session);
        return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
            put("amount", amount);
            put("sessionId", session.getId());
        }});
    }

    // POST /api/billing/calculate - finalize billing for a session and persist record
    @PostMapping("/calculate")
    public ResponseEntity<?> calculate(@RequestBody java.util.Map<String, Object> body) {
        Object sid = body.get("sessionId");
        if (sid == null) return ResponseEntity.badRequest().body(new MessageResponse("sessionId required"));
        Long sessionId = Long.valueOf(String.valueOf(sid));
        var sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) return ResponseEntity.badRequest().body(new MessageResponse("Session not found"));
        ParkingSession session = sessionOpt.get();
        session.setExitTime(LocalDateTime.now());
        double amount = billingService.generateBill(session);
        session.setTotalAmount(amount);
        session.setActive(false);
        sessionRepository.save(session);

        BillingRecord record = new BillingRecord(session, amount);
        billingRecordService.save(record);

        return ResponseEntity.ok(record);
    }
}
