package com.parking.system.controller;

import com.parking.system.entryexit.command.EntryCommand;
import com.parking.system.entryexit.command.ExitCommand;
import com.parking.system.entryexit.processor.EntryGateProcessor;
import com.parking.system.entryexit.processor.ExitGateProcessor;
import com.parking.system.vehicle.Vehicle;
import com.parking.system.vehicle.VehicleFactory;
import com.parking.system.vehicle.VehicleType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gate")
public class GateController {

    @Autowired
    private EntryGateProcessor entryProcessor;

    @Autowired
    private ExitGateProcessor exitProcessor;

    @PostMapping("/entry")
    public ResponseEntity<String> entry(@RequestParam String vehicleNumber, @RequestParam VehicleType type) {
        Vehicle vehicle = VehicleFactory.createVehicle(type, vehicleNumber);
        EntryCommand command = new EntryCommand(entryProcessor, vehicle);
        command.execute();
        return ResponseEntity.ok("Vehicle entered successfully.");
    }

    @PostMapping("/exit")
    public ResponseEntity<String> exit(@RequestParam String vehicleNumber) {
        ExitCommand command = new ExitCommand(exitProcessor, vehicleNumber);
        command.execute();
        return ResponseEntity.ok("Vehicle exited. Bill Amount: " + exitProcessor.getBillAmount());
    }
}
