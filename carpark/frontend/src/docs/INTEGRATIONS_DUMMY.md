# Integrations — Dummy Data Fallback (Beginner-friendly)

## Why
- The backend is not fully populated yet. If the frontend calls real APIs and they return errors or empty responses, the UI will look broken or empty.
- To keep the app usable and visually informative during development, we provide dummy data (tagged with `dummy`) that the frontend will use when backend requests fail.

## What I implemented
- Central mock data file: `src/api/mockData.js` with `mockDashboardSummary`, `mockRevenueData`, and `mockUserProfile` (all contain `dummy` in text).
- Parking API mock helpers updated: `mockGetParkingLots`, `mockGetSlots`, and new `mockGetFloors`, `mockGetAvailability` include `dummy` tags.
- Billing mock updated: billing history locations now include `dummy` tag.
- Dashboard feature now falls back to `mockDashboardSummary` and `mockRevenueData` when backend is unavailable.
- Parking feature thunks fall back to the parking mock helpers when backend calls fail.

All UI text coming from these mock responses includes the literal word `dummy` so it's always clear which content is placeholder.

## How it works (developer notes)
- When a thunk (dashboard/parking/billing) tries to call a backend API and an exception occurs, it will call the corresponding mock function and return the mock payload as a successful response. This keeps Redux state populated and UI components showing sample data.
- Mock functions simulate a small network delay using `setTimeout` so the loading indicators still appear.

## Files changed (quick links)
- `src/api/mockData.js` — central mock dashboard/user/revenue data
- `src/api/parkingApi.js` — added/updated mock helpers with `dummy` text
- `src/api/billingApi.js` — billing mock entries tagged `dummy`
- `src/features/dashboard/dashboardSlice.js` — fallback to mock data
- `src/features/parking/parkingSlice.js` — fallback to mock data
- `src/docs/AUTH_REFRESH_FIX.md` — earlier auth notes remain

## How to test
1. Run frontend dev server:

```bash
cd CarparkingUi
npm run dev
```

2. If backend is not running, navigate the app. Dashboard, Parking lists, and Billing History pages should show dummy content (with the word `dummy` in titles or descriptions).
3. If backend comes up later, the app will automatically use the real API responses.

## Next steps (recommended)
- Implement full backend endpoints and remove/fallback the mocks when stable.
- Implement a secure refresh token flow (`/api/auth/refresh`) on backend and enable the frontend automatic refresh.
- Add mock data for bookings, admin pages, and user management as needed.

If you'd like, I can now add dummy mock entries for bookings and user lists or implement a feature toggle (`VITE_USE_DUMMY=true`) to force dummy mode. Which would you prefer next?
