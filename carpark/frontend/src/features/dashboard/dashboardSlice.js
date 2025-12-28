import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '@api/axiosInstance'
import { API_ENDPOINTS } from '@utils/constants'
import { mockDashboardSummary, mockRevenueData } from '@api/mockData'
import * as adminApi from '@api/adminApi'

const initialState = {
    summary: {
        totalRevenue: 0,
        totalSlots: 0,
        occupiedSlots: 0,
        freeSlots: 0,
        activeSessions: 0,
        totalExpenses: 0, // for user dashboard compatibility
        occupancyRate: 0,
    },
    revenueData: [],
    recentActivity: [],
    loading: false,
    error: null,
}

// Async thunks
export const fetchDashboardSummary = createAsyncThunk(
    'dashboard/fetchSummary',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()
            const isAdmin = auth.user?.roles?.some(r => r === 'ADMIN' || r === 'ROLE_ADMIN')
            const endpoint = isAdmin ? API_ENDPOINTS.DASHBOARD_ADMIN : API_ENDPOINTS.DASHBOARD_USER

            const response = await axiosInstance.get(endpoint)
            const data = response.data

            // Map backend keys to summary object
            if (isAdmin) {
                return {
                    summary: {
                        totalRevenue: data.totalRevenue || 0,
                        totalSlots: data.totalSlots || 0,
                        occupiedSlots: data.occupiedSlots || 0,
                        freeSlots: data.freeSlots || 0,
                        activeSessions: data.activeSessions || 0,
                        occupancyRate: data.totalSlots > 0
                            ? Math.round((data.occupiedSlots / data.totalSlots) * 100)
                            : 0
                    },
                    recentActivity: [] // Backend doesn't provide this yet
                }
            } else {
                return {
                    summary: {
                        availableSlots: data.availableSlots || 0,
                        totalExpenses: 0, // User specific
                        activeSessions: 0,
                        occupancyRate: 0
                    },
                    recentActivity: []
                }
            }
        } catch (error) {
            // fallback to mock data if backend fails
            try {
                const mock = await adminApi.getDashboardSummary()
                return mock.data
            } catch (e) {
                const mock = await mockDashboardSummary()
                return mock
            }
        }
    }
)

export const fetchRevenueData = createAsyncThunk(
    'dashboard/fetchRevenue',
    async (period, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.DASHBOARD_REVENUE}?period=${period}`)
            return response.data
        } catch (error) {
            try {
                const mock = await adminApi.getRevenueData(period)
                return mock.data
            } catch (e) {
                try {
                    const mock = await mockRevenueData(period)
                    return mock
                } catch (e2) {
                    return rejectWithValue(error.response?.data || error.message)
                }
            }
        }
    }
)

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearError: state => {
            state.error = null
        },
    },
    extraReducers: builder => {
        builder
            // Fetch summary
            .addCase(fetchDashboardSummary.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
                state.loading = false
                state.summary = action.payload.summary
                state.recentActivity = action.payload.recentActivity || []
            })
            .addCase(fetchDashboardSummary.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch revenue
            .addCase(fetchRevenueData.pending, state => {
                state.loading = true
            })
            .addCase(fetchRevenueData.fulfilled, (state, action) => {
                state.loading = false
                state.revenueData = action.payload
            })
            .addCase(fetchRevenueData.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { clearError } = dashboardSlice.actions

export default dashboardSlice.reducer
