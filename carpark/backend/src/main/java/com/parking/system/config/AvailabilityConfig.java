package com.parking.system.config;

import com.parking.system.availability.AvailabilityEventPublisher;
import com.parking.system.availability.observer.DashboardObserver;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AvailabilityConfig {

    @Autowired
    private AvailabilityEventPublisher publisher;

    @Autowired
    private DashboardObserver dashboardObserver;

    @PostConstruct
    public void init() {
        publisher.addObserver(dashboardObserver);
    }
}
