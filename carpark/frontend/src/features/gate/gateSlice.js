import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as gateApi from '@api/gateApi'

// Thunks
export const enterVehicle = createAsyncThunk(
    'gate/enter',
    async ({ vehicleNumber, type }, { rejectWithValue }) => {
        try {
            const response = await gateApi.entryVehicle(vehicleNumber, type)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const exitVehicle = createAsyncThunk(
    'gate/exit',
    async (vehicleNumber, { rejectWithValue }) => {
        try {
            const response = await gateApi.exitVehicle(vehicleNumber)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

const gateSlice = createSlice({
    name: 'gate',
    initialState: {
        loading: false,
        lastEntryResult: null,
        lastExitResult: null,
        error: null,
    },
    reducers: {
        clearGateState: (state) => {
            state.lastEntryResult = null
            state.lastExitResult = null
            state.error = null
        }
    },
    extraReducers: (builder) => {
        // Entry
        builder.addCase(enterVehicle.pending, (state) => {
            state.loading = true
            state.error = null
            state.lastEntryResult = null
        })
        builder.addCase(enterVehicle.fulfilled, (state, action) => {
            state.loading = false
            state.lastEntryResult = action.payload // "Vehicle entered successfully."
        })
        builder.addCase(enterVehicle.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        // Exit
        builder.addCase(exitVehicle.pending, (state) => {
            state.loading = true
            state.error = null
            state.lastExitResult = null
        })
        builder.addCase(exitVehicle.fulfilled, (state, action) => {
            state.loading = false
            state.lastExitResult = action.payload // "Vehicle exited. Bill Amount: 20.0"
        })
        builder.addCase(exitVehicle.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
    }
})

export const { clearGateState } = gateSlice.actions
export default gateSlice.reducer
