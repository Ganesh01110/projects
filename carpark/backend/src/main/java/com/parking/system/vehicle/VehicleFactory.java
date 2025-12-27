package com.parking.system.vehicle;

public class VehicleFactory {
    public static Vehicle createVehicle(VehicleType type, String vehicleNumber) {
        switch (type) {
            case CAR:
                return new Car(vehicleNumber);
            case BIKE:
                return new Bike(vehicleNumber);
            case TRUCK:
                return new Truck(vehicleNumber);
            case EV:
                return new EV(vehicleNumber);
            default:
                throw new IllegalArgumentException("Unknown vehicle type: " + type);
        }
    }
}
