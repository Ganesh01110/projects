import axios from 'axios'
import { API_BASE_URL, ERROR_MESSAGES } from '@utils/constants'
import store from '@app/store'
import { setCredentials, clearCredentials } from '@features/auth/authSlice'

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for refresh token cookie
})

// Request interceptor - Add access token to requests
axiosInstance.interceptors.request.use(
    config => {
        const state = store.getState()
        const accessToken = state.auth.accessToken

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// Response interceptor - Handle token refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })

    failedQueue = []
}

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            // eslint-disable-next-line no-console
            console.debug('axios interceptor: 401 received, attempting refresh')
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return axiosInstance(originalRequest)
                    })
                    .catch(err => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                // Attempt to refresh token
                // eslint-disable-next-line no-console
                console.debug('axios interceptor: calling /auth/refresh')
                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                )

                const { token: accessToken, ...user } = response.data

                // Update Redux store with new token and refreshing user info
                store.dispatch(setCredentials({
                    user: user || store.getState().auth.user,
                    accessToken
                }))

                // Update the original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`

                processQueue(null, accessToken)
                isRefreshing = false

                return axiosInstance(originalRequest)
            } catch (refreshError) {
                // eslint-disable-next-line no-console
                console.debug('axios interceptor: refresh failed', refreshError)
                processQueue(refreshError, null)
                isRefreshing = false

                // Clear credentials and redirect to login
                store.dispatch(clearCredentials())

                // Optionally redirect to login page
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login'
                }

                return Promise.reject(refreshError)
            }
        }

        // Normalize error messages
        const normalizedError = normalizeError(error)
        return Promise.reject(normalizedError)
    }
)

/**
 * Normalize error responses to user-friendly messages
 */
const normalizeError = error => {
    if (!error.response) {
        return {
            message: ERROR_MESSAGES.NETWORK_ERROR,
            status: null,
        }
    }

    const { status, data } = error.response

    switch (status) {
        case 401:
            return {
                message: data?.message || ERROR_MESSAGES.UNAUTHORIZED,
                status,
            }
        case 403:
            return {
                message: data?.message || ERROR_MESSAGES.FORBIDDEN,
                status,
            }
        case 404:
            return {
                message: data?.message || ERROR_MESSAGES.NOT_FOUND,
                status,
            }
        case 422:
            return {
                message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
                status,
                errors: data?.errors || {},
            }
        case 500:
        case 502:
        case 503:
            return {
                message: ERROR_MESSAGES.SERVER_ERROR,
                status,
            }
        default:
            return {
                message: data?.message || 'An unexpected error occurred',
                status,
            }
    }
}

export default axiosInstance
