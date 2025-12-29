package com.parking.system.availability;

import com.parking.system.availability.observer.AvailabilityObserver;
import com.parking.system.availability.observer.AvailabilitySubject;
import com.parking.system.parking.composite.ParkingSlot;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AvailabilityEventPublisher implements AvailabilitySubject {

    private List<AvailabilityObserver> observers = new ArrayList<>();
    private ParkingSlot lastChangedSlot;

    @Override
    public void addObserver(AvailabilityObserver observer) {
        observers.add(observer);
    }

    @Override
    public void removeObserver(AvailabilityObserver observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers() {
        for (AvailabilityObserver observer : observers) {
            observer.update(lastChangedSlot);
        }
    }

    public void publishAvailabilityChange(ParkingSlot slot) {
        this.lastChangedSlot = slot;
        notifyObservers();
    }
}
