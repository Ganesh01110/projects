# Auth / Refresh Fix (Beginner-friendly)

## Why
- The frontend calls `POST /api/auth/refresh` automatically when it receives a `401` response to renew the access token.
- The backend in this project does not implement a `/refresh` endpoint yet and the backend `AuthController` expects `username` (not email) for login.
- Because the frontend was sending the email as the `username` field, login fails with `401`. The frontend's automatic refresh then calls `/api/auth/refresh` and receives `500` (no handler), causing confusing UI errors.

## What I changed (easy, beginner-friendly)
1. Frontend login now accepts either a username or an email in the same input box.
2. If the user provides an email (like `admin@digipark.com`), the frontend converts it to the username part before sending to the backend (for example `admin@digipark.com` -> `admin`). This matches the backend's expected `username` field and fixes failed logins.
3. Updated the login input label and placeholder to say "Username or Email" so it's clearer for beginners.
4. This is a frontend-only fix; backend refresh endpoint is still missing — a proper refresh implementation should be added later for production.

## How (steps to test and notes)
1. Start the backend (Spring Boot) as you normally do.

```powershell
cd Carparking
mvn spring-boot:run
```

2. Start the frontend dev server.

```bash
cd CarparkingUi
npm run dev
```

3. Open the app (usually `http://localhost:5173`) and go to the login page.
4. Use demo credentials shown on the login page:
   - Admin: `admin@digipark.com` / `admin123`
   - User: `user@digipark.com` / `user123`

The frontend will send `username: 'admin'` for `admin@digipark.com`, which matches the backend user and should authenticate successfully.

## Next improvements (recommended)
- Implement a proper `/api/auth/refresh` endpoint on the backend that uses refresh tokens (HttpOnly cookies) and returns a new access token. This will allow secure automatic refresh.
- Alternatively, allow backend authentication by email as well as username (modify `UserDetailsServiceImpl` to support email lookup).
- Add clear UI messages when refresh fails (e.g., "Session expired, please login again").

## Files changed
- `src/api/authApi.js` — convert email to username when needed.
- `src/pages/Login.jsx` — label and placeholder updated for clarity.
- `src/docs/AUTH_REFRESH_FIX.md` — this file (documentation).

If you want, I can implement a simple backend `/refresh` stub for local testing, or update the backend to allow email-based login. Which would you prefer next?
