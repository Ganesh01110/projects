import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { STORAGE_KEYS } from '@utils/constants'
import * as authApi from '@api/authApi'

// Get initial user from localStorage
const getInitialUser = () => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER)
    return savedUser ? JSON.parse(savedUser) : null
}

const initialState = {
    user: getInitialUser(),
    accessToken: null,
    isAuthenticated: !!getInitialUser(),
    loading: false,
    error: null,
}

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logout()
            return null
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const refreshToken = createAsyncThunk(
    'auth/refresh',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.refreshToken()
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const fetchProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        // Debug logging for investigation of repeated profile fetches
        // eslint-disable-next-line no-console
        console.debug('fetchProfile thunk invoked')

        try {
            const response = await authApi.getProfile()
            // eslint-disable-next-line no-console
            console.debug('fetchProfile: got response', response)
            return response.data
        } catch (error) {
            // Only fallback to mock profile for non-auth errors (like backend down)
            // If it's 401/403, we should let the auth flow handle it
            if (error.response?.status === 401 || error.response?.status === 403) {
                return rejectWithValue(error.response?.data || error.message)
            }

            try {
                const mock = await authApi.mockGetProfile()
                // eslint-disable-next-line no-console
                console.debug('fetchProfile: using mock profile', mock)
                return mock.data
            } catch (e) {
                return rejectWithValue(error.response?.data || error.message)
            }
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload
            state.user = user
            state.accessToken = accessToken
            state.isAuthenticated = true
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
        },
        clearCredentials: state => {
            state.user = null
            state.accessToken = null
            state.isAuthenticated = false
            state.error = null
            localStorage.removeItem(STORAGE_KEYS.USER)
        },
        clearError: state => {
            state.error = null
        },
    },
    extraReducers: builder => {
        builder
            // Login
            .addCase(login.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                const { token, ...user } = action.payload
                state.loading = false
                state.user = user
                state.accessToken = token
                state.isAuthenticated = true
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Logout
            .addCase(logout.pending, state => {
                state.loading = true
            })
            .addCase(logout.fulfilled, state => {
                state.loading = false
                state.user = null
                state.accessToken = null
                state.isAuthenticated = false
                localStorage.removeItem(STORAGE_KEYS.USER)
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                // Clear credentials anyway on logout error
                state.user = null
                state.accessToken = null
                state.isAuthenticated = false
                localStorage.removeItem(STORAGE_KEYS.USER)
            })

            // Refresh token
            .addCase(refreshToken.fulfilled, (state, action) => {
                const { token, ...user } = action.payload
                state.accessToken = token
                state.user = user || state.user
                state.isAuthenticated = true
                if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
            })
            .addCase(refreshToken.rejected, state => {
                // Clear credentials if refresh fails
                state.user = null
                state.accessToken = null
                state.isAuthenticated = false
                localStorage.removeItem(STORAGE_KEYS.USER)
            })
            // Fetch profile
            .addCase(fetchProfile.pending, state => {
                state.loading = true
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                const { token, ...user } = action.payload
                state.loading = false
                state.user = user
                state.isAuthenticated = !!user
                if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { setCredentials, clearCredentials, clearError } = authSlice.actions

export default authSlice.reducer
