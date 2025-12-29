import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as parkingApi from '@api/parkingApi'

const initialState = {
    lots: [],
    zones: [],
    selectedLot: null,
    floors: [],
    selectedFloor: null,
    slots: [],
    selectedSlot: null,
    loading: false,
    error: null,
}

// Async thunks
export const fetchZones = createAsyncThunk(
    'parking/fetchZones',
    async (_, { rejectWithValue }) => {
        try {
            const response = await parkingApi.getZones()
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const fetchParkingLots = createAsyncThunk(
    'parking/fetchLots',
    async (_, { rejectWithValue }) => {
        try {
            const response = await parkingApi.getParkingLots()
            return response.data
        } catch (error) {
            // fallback to mock data when backend unavailable
            try {
                const mock = await parkingApi.mockGetParkingLots()
                return mock.data
            } catch (e) {
                return rejectWithValue(error.response?.data || error.message)
            }
        }
    }
)

export const fetchFloors = createAsyncThunk(
    'parking/fetchFloors',
    async (lotId, { rejectWithValue }) => {
        try {
            const response = await parkingApi.getFloors(lotId)
            return response.data
        } catch (error) {
            try {
                const mock = await parkingApi.mockGetFloors(lotId)
                return mock.data
            } catch (e) {
                return rejectWithValue(error.response?.data || error.message)
            }
        }
    }
)

export const fetchSlots = createAsyncThunk(
    'parking/fetchSlots',
    async ({ lotId, floorId }, { rejectWithValue }) => {
        try {
            const response = await parkingApi.getSlots(lotId, floorId)
            return response.data
        } catch (error) {
            try {
                const mock = await parkingApi.mockGetSlots(lotId, floorId)
                return mock.data
            } catch (e) {
                return rejectWithValue(error.response?.data || error.message)
            }
        }
    }
)

export const fetchAvailability = createAsyncThunk(
    'parking/fetchAvailability',
    async (lotId, { rejectWithValue }) => {
        try {
            const response = await parkingApi.getAvailability(lotId)
            return response.data
        } catch (error) {
            try {
                const mock = await parkingApi.mockGetAvailability(lotId)
                return mock.data
            } catch (e) {
                return rejectWithValue(error.response?.data || error.message)
            }
        }
    }
)

const parkingSlice = createSlice({
    name: 'parking',
    initialState,
    reducers: {
        selectLot: (state, action) => {
            state.selectedLot = action.payload
        },
        selectFloor: (state, action) => {
            state.selectedFloor = action.payload
        },
        selectSlot: (state, action) => {
            state.selectedSlot = action.payload
        },
        clearSelection: state => {
            state.selectedSlot = null
        },
        updateSlotStatus: (state, action) => {
            const { slotId, status } = action.payload
            const slot = state.slots.find(s => s.id === slotId)
            if (slot) {
                slot.status = status
            }
        },
    },
    extraReducers: builder => {
        builder
            // Fetch lots
            .addCase(fetchParkingLots.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchParkingLots.fulfilled, (state, action) => {
                state.loading = false
                state.lots = action.payload
            })
            .addCase(fetchParkingLots.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            .addCase(fetchZones.fulfilled, (state, action) => {
                state.zones = action.payload
            })

            // Fetch floors
            .addCase(fetchFloors.pending, state => {
                state.loading = true
            })
            .addCase(fetchFloors.fulfilled, (state, action) => {
                state.loading = false
                state.floors = action.payload
            })
            .addCase(fetchFloors.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch slots
            .addCase(fetchSlots.pending, state => {
                state.loading = true
            })
            .addCase(fetchSlots.fulfilled, (state, action) => {
                state.loading = false
                state.slots = action.payload
            })
            .addCase(fetchSlots.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Fetch availability
            .addCase(fetchAvailability.fulfilled, (state, action) => {
                // Update slot statuses based on availability data
                const availabilityMap = action.payload
                state.slots = state.slots.map(slot => ({
                    ...slot,
                    status: availabilityMap[slot.id] || slot.status,
                }))
            })
    },
})

export const {
    selectLot,
    selectFloor,
    selectSlot,
    clearSelection,
    updateSlotStatus,
} = parkingSlice.actions

export default parkingSlice.reducer
