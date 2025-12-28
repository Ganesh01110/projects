import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as billingApi from '@api/billingApi'
import { mockGetBillingHistory } from '@api/billingApi'

const initialState = {
    currentBill: null,
    history: [],
    loading: false,
    error: null,
}

// Async thunks
export const fetchCurrentBill = createAsyncThunk(
    'billing/fetchCurrent',
    async (sessionId, { rejectWithValue }) => {
        try {
            const response = await billingApi.getCurrentBill(sessionId)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const fetchBillingHistory = createAsyncThunk(
    'billing/fetchHistory',
    async (params, { rejectWithValue }) => {
        try {
            const response = await billingApi.getBillingHistory(params)
            return response.data
        } catch (error) {
            // fallback to mock billing history when backend unavailable
            try {
                const mock = await mockGetBillingHistory()
                return mock.data
            } catch (e) {
                return rejectWithValue(error.response?.data || error.message)
            }
        }
    }
)

export const calculateBill = createAsyncThunk(
    'billing/calculate',
    async (data, { rejectWithValue }) => {
        try {
            const response = await billingApi.calculateBill(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

const billingSlice = createSlice({
    name: 'billing',
    initialState,
    reducers: {
        clearCurrentBill: state => {
            state.currentBill = null
        },
        clearError: state => {
            state.error = null
        },
    },
    extraReducers: builder => {
        builder
            // Fetch current bill
            .addCase(fetchCurrentBill.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCurrentBill.fulfilled, (state, action) => {
                state.loading = false
                state.currentBill = action.payload
            })
            .addCase(fetchCurrentBill.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch history
            .addCase(fetchBillingHistory.pending, state => {
                state.loading = true
            })
            .addCase(fetchBillingHistory.fulfilled, (state, action) => {
                state.loading = false
                state.history = action.payload
            })
            .addCase(fetchBillingHistory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Calculate bill
            .addCase(calculateBill.pending, state => {
                state.loading = true
            })
            .addCase(calculateBill.fulfilled, (state, action) => {
                state.loading = false
                state.currentBill = action.payload
            })
            .addCase(calculateBill.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { clearCurrentBill, clearError } = billingSlice.actions

export default billingSlice.reducer
