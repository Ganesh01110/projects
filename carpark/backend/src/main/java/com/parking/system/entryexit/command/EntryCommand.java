package com.parking.system.entryexit.command;

import com.parking.system.entryexit.processor.EntryGateProcessor;
import com.parking.system.vehicle.Vehicle;
public class EntryCommand implements ParkingCommand {
    private final EntryGateProcessor processor;
    private final Vehicle vehicle;

    public EntryCommand(EntryGateProcessor processor, Vehicle vehicle) {
        this.processor = processor;
        this.vehicle = vehicle;
    }

    @Override
    public void execute() {
        processor.setVehicle(vehicle);
        processor.process();
    }
}
