package com.parking.system.entryexit.command;

import com.parking.system.entryexit.processor.ExitGateProcessor;

// Plain class, not a bean, created by Invoker/Client
public class ExitCommand implements ParkingCommand {
    private final ExitGateProcessor processor;
    private final String vehicleNumber;

    public ExitCommand(ExitGateProcessor processor, String vehicleNumber) {
        this.processor = processor;
        this.vehicleNumber = vehicleNumber;
    }

    @Override
    public void execute() {
        processor.setVehicleNumber(vehicleNumber);
        processor.process();
    }
}
