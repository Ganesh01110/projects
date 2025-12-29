package com.parking.system.controller;

import com.parking.system.parking.composite.ParkingLot;
import com.parking.system.parking.composite.ParkingSlot;
import com.parking.system.parking.state.SlotState;
import com.parking.system.repository.ParkingSlotRepository;
import com.parking.system.vehicle.VehicleType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class GateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ParkingSlotRepository slotRepository;

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldPerformVehicleEntryAndExit() throws Exception {
        // 1. Entry
        mockMvc.perform(post("/api/gate/entry")
                .param("vehicleNumber", "TEST-123")
                .param("type", "CAR"))
                .andExpect(status().isOk());

        // Verify slot is occupied
        ParkingSlot slot = slotRepository.findAll().stream()
                .filter(s -> s.getState() == SlotState.OCCUPIED)
                .findFirst()
                .orElseThrow();
        assertEquals(SlotState.OCCUPIED, slot.getState());

        // 2. Exit
        mockMvc.perform(post("/api/gate/exit")
                .param("vehicleNumber", "TEST-123"))
                .andExpect(status().isOk());

        // Verify slot is free again
        slot = slotRepository.findById(slot.getId()).orElseThrow();
        assertEquals(SlotState.FREE, slot.getState());
    }
}
