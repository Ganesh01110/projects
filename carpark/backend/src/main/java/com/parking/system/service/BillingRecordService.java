package com.parking.system.service;

import com.parking.system.model.BillingRecord;
import com.parking.system.model.ParkingSession;
import com.parking.system.repository.BillingRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillingRecordService {
    private final BillingRecordRepository billingRecordRepository;

    public BillingRecordService(BillingRecordRepository billingRecordRepository) {
        this.billingRecordRepository = billingRecordRepository;
    }

    public BillingRecord save(BillingRecord record) {
        return billingRecordRepository.save(record);
    }

    public List<BillingRecord> findAll() {
        return billingRecordRepository.findAll();
    }

    public List<BillingRecord> findBySessionId(Long sessionId) {
        return billingRecordRepository.findBySessionId(sessionId);
    }
}
