# Testing Implementation Plan (Automation Tests)

This plan outlines the approach for adding automated tests to the Smart Car Parking System. We will use a combination of **Unit Tests** (Component-based) and **Integration Tests** (Integrated) to ensure full coverage and stability.

## User Review Required

> [!NOTE]
> Testing will be split into two categories:
> 1. **Unit Tests**: Test individual logic (e.g., "Is the nearest slot chosen correctly?") without starting the server.
> 2. **Integration Tests**: Test the full API flow (e.g., "Does the entry API correctly save to the database and return 200 OK?").

## Proposed Changes

### [Testing Infrastructure]
- **[NEW] Directory Structure**: Create `src/test/java/com/parking/system/`.
- **[NEW] Base Test Class**: If needed, a base class for common setup.

### [Component (Unit) Tests]
#### [NEW] [NearestStrategyTest.java](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/Carparking/src/test/java/com/parking/system/parking/strategy/NearestStrategyTest.java)
- Verify that `NearestStrategy` correctly picks the slot with the lowest number.
- Test empty list and full list scenarios.

#### [NEW] [BillingServiceTest.java](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/Carparking/src/test/java/com/parking/system/billing/BillingServiceTest.java)
- Verify calculated bills based on time and rates.

### [Integrated (Integration) Tests]
#### [NEW] [AuthControllerIT.java](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/Carparking/src/test/java/com/parking/system/controller/AuthControllerIT.java)
- Test `/api/auth/signin` and `/api/auth/signup`.
- Verify JWT generation and successful login.

#### [NEW] [GateControllerIT.java](file:///c:/Users/sahug/OneDrive/Desktop/ganeshdocs/antigravity/Carparking/src/test/java/com/parking/system/controller/GateControllerIT.java)
- Test `/api/gate/entry` and `/api/gate/exit`.
- Use `MockMvc` to trigger requests and verify database state changes (e.g., Slot state moving to `OCCUPIED`).

## Verification Plan

### Automated Tests
- Run `mvn test` to execute all tests.
- Check the console for "BUILD SUCCESS".

### Manual Verification
- Review generated test reports in `target/surefire-reports`.
