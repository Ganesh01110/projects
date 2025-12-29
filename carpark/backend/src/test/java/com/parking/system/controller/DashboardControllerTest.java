package com.parking.system.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldGetAdminDashboard() throws Exception {
        mockMvc.perform(get("/api/dashboard/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSlots").exists())
                .andExpect(jsonPath("$.freeSlots").exists());
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldGetUserDashboard() throws Exception {
        mockMvc.perform(get("/api/dashboard/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.availableSlots").exists());
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldFailAdminDashboardForRegularUser() throws Exception {
        mockMvc.perform(get("/api/dashboard/admin"))
                .andExpect(status().isForbidden());
    }
}
