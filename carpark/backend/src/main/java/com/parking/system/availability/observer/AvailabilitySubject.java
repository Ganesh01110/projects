package com.parking.system.availability.observer;

public interface AvailabilitySubject {
    void addObserver(AvailabilityObserver observer);
    void removeObserver(AvailabilityObserver observer);
    void notifyObservers();
}
