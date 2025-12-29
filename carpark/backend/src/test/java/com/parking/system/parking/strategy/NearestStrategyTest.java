package com.parking.system.parking.strategy;

import com.parking.system.parking.composite.ParkingSlot;
import com.parking.system.parking.state.SlotState;
import com.parking.system.vehicle.VehicleType;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class NearestStrategyTest {

    private final NearestStrategy strategy = new NearestStrategy();

    @Test
    void shouldPickSlotWithLowestNumber() {
        ParkingSlot slot1 = new ParkingSlot(1L, 1, SlotState.FREE, VehicleType.CAR, null);
        ParkingSlot slot2 = new ParkingSlot(2L, 2, SlotState.FREE, VehicleType.CAR, null);
        ParkingSlot slot3 = new ParkingSlot(3L, 3, SlotState.FREE, VehicleType.CAR, null);

        List<ParkingSlot> slots = Arrays.asList(slot2, slot3, slot1);

        Optional<ParkingSlot> result = strategy.allocateSlot(slots);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getSlotNumber());
    }

    @Test
    void shouldIgnoreOccupiedSlots() {
        ParkingSlot slot1 = new ParkingSlot(1L, 1, SlotState.OCCUPIED, VehicleType.CAR, null);
        ParkingSlot slot2 = new ParkingSlot(2L, 2, SlotState.FREE, VehicleType.CAR, null);

        List<ParkingSlot> slots = Arrays.asList(slot1, slot2);

        Optional<ParkingSlot> result = strategy.allocateSlot(slots);

        assertTrue(result.isPresent());
        assertEquals(2, result.get().getSlotNumber());
    }

    @Test
    void shouldReturnEmptyWhenNoSlotsAvailable() {
        ParkingSlot slot1 = new ParkingSlot(1L, 1, SlotState.OCCUPIED, VehicleType.CAR, null);
        
        List<ParkingSlot> slots = Arrays.asList(slot1);

        Optional<ParkingSlot> result = strategy.allocateSlot(slots);

        assertFalse(result.isPresent());
    }
}
