# Auth Integration — Refresh, Logout, Profile (Beginner-friendly)

## Why
- Secure sessions require short-lived access tokens and a way to renew them without forcing users to log in repeatedly.
- The frontend already implemented automatic token refresh logic; the backend needs endpoints. While backend work progresses, the frontend should gracefully handle refresh, logout, and user profile fetching with fallbacks so the UI remains usable.

## What I implemented
- `fetchProfile` thunk: fetches `/api/auth/profile` and stores the user in Redux. Falls back to dummy profile when backend is unavailable.
- `getProfile` API function in `src/api/authApi.js` and a `mockGetProfile` (uses `src/api/mockData.js`).
- `AppShell` now dispatches `fetchProfile()` on mount so the app knows the current user immediately (Sidebar and Header use that info).
- `authSlice` updated to include `fetchProfile` reducers and to persist the user in `localStorage`.
- Logout already exists as a thunk; clicking Logout triggers the thunk which calls `/api/auth/logout` and clears credentials in all cases.
- The axios response interceptor already attempts `POST /api/auth/refresh` on 401 and updates the Redux store with a new `accessToken` via `setCredentials` when successful.

## How (developer notes)
- Files changed:
  - `src/api/authApi.js` — added `getProfile` and `mockGetProfile`.
  - `src/features/auth/authSlice.js` — added `fetchProfile` thunk and reducers.
  - `src/components/layout/AppShell.jsx` — dispatch `fetchProfile()` on mount.
  - `src/api/mockData.js` — contains `mockUserProfile` used for fallback.

- Behavior:
  - On app load (`AppShell` mount), the app attempts to fetch the current profile. If the backend is down, a `dummy` profile is used so the UI behaves correctly.
  - When a request returns 401, `axiosInstance` tries to call `/api/auth/refresh` using cookies. If refresh succeeds, the new token is stored. If refresh fails, credentials are cleared and the user is redirected to `/login`.
  - Logout calls `/api/auth/logout` and clears local state.

## How to test
1. Start frontend:

```bash
cd CarparkingUi
npm run dev
```

2. Open app and login with demo credentials (or use mock login). The header and sidebar should display user name and admin items if role is `ADMIN`.
3. Stop backend and refresh page — `dummy` profile will be used so the UI still shows a user and admin navigation.
4. Click Logout — it should clear user state and navigate to login (or show unauthenticated UI).

## Next backend work (recommended)
- Implement secure `POST /api/auth/refresh` endpoint that reads a refresh token cookie and returns `{ accessToken }`.
- Implement `POST /api/auth/logout` to clear refresh cookies and revoke tokens server-side.
- Implement `GET /api/auth/profile` to return the authenticated user's profile.

If you want, I can now scaffold the backend endpoints (simple local stubs) so the frontend refresh/logout/profile flows can be tested end-to-end. Would you like me to add backend stubs next?