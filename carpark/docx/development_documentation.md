# Development Documentation: Smart Car Parking Management System

This document provides technical guidance for developers working on the Smart Car Parking Management System backend.

## Project Overview
A production-quality backend system designed to manage car parking operations, including vehicle entry/exit, slot allocation, billing, and real-time availability updates.

## Tech Stack
- **Language**: Java 17+ (Verified for JDK 25)
- **Framework**: Spring Boot 3.2.1
- **Database**: MariaDB 10.x+
- **Security**: Spring Security with JWT (Stateless)
- **Build Tool**: Maven

## Folder Structure & Component Roles

```text
src/main/java/com/parking/system/
├── availability/        # Observer Pattern: Updates and notifies slot availability changes.
├── billing/             # Billing logic: Strategy + Chain of Responsibility for pricing.
├── config/              # Application configuration (Global Exception Handling, Data Seeder).
├── controller/          # REST Controllers (Auth, Gate, Dashboard).
├── dashboard/           # Facade Pattern: Aggregates system stats for UI consumption.
├── dto/                 # Data Transfer Objects for requests and responses.
├── entryexit/           # Core Logic: Template Method (Processors) and Command Pattern.
├── exception/           # Custom exception definitions.
├── model/               # JPA Entities (User, Role, ParkingSession).
├── parking/             # Parking Structure: Composite Pattern (Lot, Floor, Slot) and State Pattern (Abstract State + Concrete States).
├── payment/             # Payment Module: Payment Entity, Repository, and Strategy Pattern (Card, Cash, UPI).
├── pricing/             # Pricing Strategies and Discount Handlers.
├── repository/          # Spring Data JPA Repositories.
├── security/            # Security Configuration, JWT Filters, and UserDetails Service.
├── service/             # Service Layer: PaymentService, RefreshTokenService.
└── vehicle/             # Factory Pattern: Abstract Vehicle and Concrete implementations.
```

### Key Components

- **Processors (`entryexit/processor`)**: Use the **Template Method** pattern to define the skeleton of entry/exit workflows.
- **Commands (`entryexit/command`)**: Encapsulate parking operations as objects, allowing for decoupled execution.
- **Strategies (`parking/strategy`, `pricing/strategy`)**: Algorithms for slot allocation (`Nearest`, `FirstAvailable`, `DisabledFriendly`) and pricing (`Hourly`, `PeakHour`).
- **Composite (`parking/composite`)**: Manages the hierarchy of the parking lot (Lot -> Floor -> Slot).
- **State (`parking/state`)**: Manages slot lifecycle (`FreeState`, `OccupiedState`, `ReservedState`, `OutOfServiceState`).
- **Payment (`payment/strategy`)**: Handles multiple payment methods (`Card`, `Cash`, `UPI`) via `PaymentService`.
- **Facade (`dashboard/DashboardFacade`)**: Simplifies interaction with multiple repositories to provide dashboard data.

## Implemented Design Patterns

| Pattern | Usage Location |
| :--- | :--- |
| **Factory** | `VehicleFactory` for creating different vehicle types. |
| **Composite** | `ParkingLot`, `ParkingFloor`, `ParkingSlot` structure. |
| **Strategy** | `SlotAllocationStrategy` (Nearest, DisabledFriendly) and `PricingStrategy` (Hourly, PeakHour). |
| **State** | `ParkingSlotState` interface with `FreeState`, `OccupiedState`, etc. |
| **Command** | `EntryCommand` and `ExitCommand` for gate operations. |
| **Template Method** | `GateProcessor` defined in `entryexit/processor`. |
| **Chain of Responsibility** | `DiscountHandler` (Loyalty, Weekend, PromoCode). |
| **Observer** | `CacheObserver` updates internal cache on slot changes. |
| **Facade** | `DashboardFacade` for aggregating system statistics. |
| **Strategy (Payment)** | `PaymentStrategy` (Card, Cash, UPI) wired via `PaymentService`. |

## Data Flow: Vehicle Entry

1. **Request**: Client sends a POST request to `/api/gate/entry`.
2. **Controller**: `GateController` receives params, uses `VehicleFactory` to create a `Vehicle` object.
3. **Command**: An `EntryCommand` is instantiated with the `EntryGateProcessor` and the `Vehicle`.
4. **Processing (Template Method)**:
    - `validateRequest()`: Checks if the vehicle is already parked.
    - `executeCoreLogic()`: 
        - Invokes `SlotAllocationStrategy` to find a free slot.
        - Updates `ParkingSlot` state to `OCCUPIED`.
        - Creates and saves a new `ParkingSession`.
    - `postProcess()`: Log completion and notify observers.
5. **Notification**: `AvailabilityEventPublisher` triggers observers to update dashboards or external systems.

## Getting Started

### Database Setup
1. Ensure MariaDB is running on port 3306.
2. The application will automatically create the `parking_system` database if it doesn't exist (configured in `application.yml`).

### Running the Application
Use Maven to start the Spring Boot dev server:
```powershell
mvn spring-boot:run
```

### Troubleshooting Build Issues
If you encounter `java.net.SocksSocketImpl` errors during `mvn clean install`, it indicates a proxy misconfiguration.
**Fix**: A `.mvn/jvm.config` file has been added to the project root with the following settings to force IPv4 and disable system proxies:
```properties
-Djava.net.useSystemProxies=false
-Djava.net.preferIPv4Stack=true
```
Ensure this file exists if you move the project to a new environment.

### API Verification
- **Default Admin**: `admin` / `admin123`
- **Auth Endpoint**: `POST /api/auth/signin`
- **Gate Endpoints**: `POST /api/gate/entry`, `POST /api/gate/exit`

## Maintenance Notes
> [!IMPORTANT]
> This project does **not** use Lombok due to compatibility issues with JDK 25. All getters, setters, and constructors must be implemented manually. Avoid adding Lombok annotations to new classes.
