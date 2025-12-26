import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as adminApi from '@api/adminApi'

const initialState = {
    users: [],
    roles: [],
    lots: [],
    zones: [],
    floors: [],
    slots: [],
    loading: false,
    error: null,
}

export const fetchZones = createAsyncThunk('admin/fetchZones', async (_, { rejectWithValue }) => {
    try {
        const res = await adminApi.getZones()
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const createZone = createAsyncThunk('admin/createZone', async (zone, { rejectWithValue }) => {
    try {
        const res = await adminApi.createZone(zone)
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const res = await adminApi.getUsers()
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const createUser = createAsyncThunk('admin/createUser', async (user, { rejectWithValue }) => {
    try {
        const res = await adminApi.createUser(user)
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const updateUser = createAsyncThunk('admin/updateUser', async ({ id, payload }, { rejectWithValue }) => {
    try {
        const res = await adminApi.updateUser(id, payload)
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const removeUser = createAsyncThunk('admin/removeUser', async (id, { rejectWithValue }) => {
    try {
        await adminApi.deleteUser(id)
        return id
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const fetchRoles = createAsyncThunk('admin/fetchRoles', async (_, { rejectWithValue }) => {
    try {
        const res = await adminApi.getRoles()
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const fetchLots = createAsyncThunk('admin/fetchLots', async (zoneId, { rejectWithValue }) => {
    try {
        const res = zoneId ? await adminApi.getLotsByZone(zoneId) : await adminApi.getLots()
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const createLot = createAsyncThunk('admin/createLot', async (lot, { rejectWithValue }) => {
    try {
        const res = await adminApi.createLot(lot)
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const updateLot = createAsyncThunk('admin/updateLot', async ({ id, payload }, { rejectWithValue }) => {
    try {
        const res = await adminApi.updateLot(id, payload)
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const removeLot = createAsyncThunk('admin/removeLot', async (id, { rejectWithValue }) => {
    try {
        await adminApi.deleteLot(id)
        return id
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const fetchFloors = createAsyncThunk('admin/fetchFloors', async (lotId, { rejectWithValue }) => {
    try {
        const res = await adminApi.getFloors(lotId)
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const createFloor = createAsyncThunk('admin/createFloor', async ({ lotId, payload }, { rejectWithValue }) => {
    try {
        const res = await adminApi.createFloor(lotId, payload)
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const fetchSlots = createAsyncThunk('admin/fetchSlots', async (floorId, { rejectWithValue }) => {
    try {
        const res = await adminApi.getSlots(floorId)
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const createSlot = createAsyncThunk('admin/createSlot', async ({ floorId, payload }, { rejectWithValue }) => {
    try {
        const res = await adminApi.createSlot(floorId, payload)
        return res.data
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

const slice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchUsers.pending, state => { state.loading = true; state.error = null })
            .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = Array.isArray(action.payload) ? action.payload : [] })
            .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload })

            .addCase(createUser.fulfilled, (state, action) => { state.users.push(action.payload) })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.users = state.users.map(u => (u.id === action.payload.id ? action.payload : u))
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u.id !== action.payload)
            })

            .addCase(fetchRoles.fulfilled, (state, action) => { state.roles = Array.isArray(action.payload) ? action.payload : [] })

            .addCase(fetchZones.fulfilled, (state, action) => { state.zones = Array.isArray(action.payload) ? action.payload : [] })
            .addCase(createZone.fulfilled, (state, action) => { if (Array.isArray(state.zones)) state.zones.push(action.payload) })

            .addCase(fetchLots.pending, state => { state.loading = true })
            .addCase(fetchLots.fulfilled, (state, action) => { state.loading = false; state.lots = Array.isArray(action.payload) ? action.payload : [] })
            .addCase(fetchLots.rejected, (state, action) => { state.loading = false; state.error = action.payload })

            .addCase(createLot.fulfilled, (state, action) => { if (Array.isArray(state.lots)) state.lots.push(action.payload) })
            .addCase(updateLot.fulfilled, (state, action) => {
                state.lots = state.lots.map(l => (l.id === action.payload.id ? action.payload : l))
            })
            .addCase(removeLot.fulfilled, (state, action) => { state.lots = state.lots.filter(l => l.id !== action.payload) })

            .addCase(fetchFloors.fulfilled, (state, action) => { state.floors = Array.isArray(action.payload) ? action.payload : [] })
            .addCase(createFloor.fulfilled, (state, action) => { if (Array.isArray(state.floors)) state.floors.push(action.payload) })

            .addCase(fetchSlots.fulfilled, (state, action) => { state.slots = Array.isArray(action.payload) ? action.payload : [] })
            .addCase(createSlot.fulfilled, (state, action) => { if (Array.isArray(state.slots)) state.slots.push(action.payload) })
    }
})

export default slice.reducer
