# Admin CRUD — Users, Roles, Parking Management (Frontend mock)

## Why
The backend endpoints for admin management may not be ready. This frontend implementation provides a simple admin interface that uses mock APIs to CRUD users, roles, and parking lots so you can iterate on UI and flows.

## What
- `src/api/adminApi.js` — mock API (in-memory) for users, roles, and parking lots. All values contain the `dummy` tag where appropriate.
- `src/features/admin/adminSlice.js` — Redux slice with thunks: fetch/create/update/delete for users and lots; fetch roles.
- `src/pages/Admin.jsx` — Admin UI with two tabs: Users and Parking. Supports create/edit/delete operations using the slice thunks.
- `src/app/store.js` — admin reducer registered.
- `src/App.jsx` — `/admin` route now points to the Admin page.

## How to use
1. Start the frontend:
```bash
cd CarparkingUi
npm run dev
```
2. Login (or use dummy profile). Open `/admin`.
3. Use the Users tab to create, edit, and delete users. Use the Parking tab to manage lots.

## Notes
- All operations are local and use in-memory arrays inside `adminApi.js`. They are meant for development and demo purposes only.
- When backend endpoints are ready, replace `adminApi.js` functions to call real APIs (same function signatures) and remove the mock arrays.

## Next steps
- Add admin endpoints on backend and connect frontend admin API to real endpoints.
- Extend parking management with floors and slots management and booking controls.
- Add role-management UI to edit available roles and permissions.

*** End of document ***
