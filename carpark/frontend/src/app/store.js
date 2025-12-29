import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/authSlice'
import uiReducer from '@features/ui/uiSlice'
import parkingReducer from '@features/parking/parkingSlice'
import billingReducer from '@features/billing/billingSlice'
import dashboardReducer from '@features/dashboard/dashboardSlice'
import adminReducer from '@features/admin/adminSlice'
import gateReducer from '@features/gate/gateSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        parking: parkingReducer,
        billing: billingReducer,
        dashboard: dashboardReducer,
        admin: adminReducer,
        gate: gateReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['ui/openModal'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.modalContent'],
                // Ignore these paths in the state
                ignoredPaths: ['ui.modalContent'],
            },
        }),
})

export default store
