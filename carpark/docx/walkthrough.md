# Walkthrough: Smart Car Parking System Debugging & Verification

I have successfully resolved the compilation and runtime issues in the Smart Car Parking Management System, ensuring compatibility with JDK 25 and verifying core system logic.

## Summary of Changes

### Lombok Removal
- **JDK 25 Compatibility**: Lombok was removed from the entire project to resolve `ExceptionInInitializerError` and `NoSuchFieldException` caused by the latest JDK's internal changes.
- **Manual Implementation**: All Lombok annotations (`@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor`, etc.) were replaced with manual Java code:
  - Getters and Setters
  - Standard and Parameterized Constructors
  - Manual Builder Pattern for `User` entity
  - Explicit Autowired Constructors for Spring Beans

### Runtime Fixes
- **Database Initialization**: Added `createDatabaseIfNotExist=true` to the JDBC URL to automatically handle missing databases.
- **Dependency Injection**: Fixed ambiguity in `SlotAllocationStrategy` by marking `NearestStrategy` as `@Primary`.
- **Autowiring Logic**: Removed `@Component` from `EntryCommand` and `ExitCommand` as they are manually instantiated per-request, resolving circular dependency and parameter missing errors.

## Verification Results

The application was successfully started and tested using the following flow:

### 1. Admin Login
Successfully obtained a JWT token by logging in with default credentials.
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "username": "admin",
    "roles": ["ROLE_ADMIN"]
}
```

### 2. Dashboard - Initial State
Verified the initial parking lot state (Seeded via `DataSeeder`).
- **Free Slots**: 15
- **Occupied Slots**: 0

### 3. Vehicle Entry
Performed a successful entry for vehicle `KA-01-HH-1234` (Type: CAR).
- **Response**: "Vehicle entered successfully."
- **Dashboard Update**: 
  - Free Slots: 14
  - Occupied Slots: 1
  - Active Sessions: 1

### 4. Vehicle Exit & Billing
Performed a successful exit for the same vehicle.
- **Response**: "Vehicle exited. Bill Amount: 10.0"
- **Dashboard Update**:
  - Free Slots: 15
  - Occupied Slots: 0

## Lessons Learned
- **Lombok vs. Latest JDKs**: Lombok often lags behind the latest JDK releases (like JDK 25) due to its reliance on internal compiler APIs. Moving to manual code provides long-term stability in such environments.
- **Spring Autowiring**: Explicit constructors are preferred over Lombok's `@RequiredArgsConstructor` for better clarity and easier debugging of injection failures.

The backend is now fully operational and ready for use.
