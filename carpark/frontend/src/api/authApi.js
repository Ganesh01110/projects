import axiosInstance from './axiosInstance'
import { API_ENDPOINTS } from '@utils/constants'

/**
 * Login with email and password
 */
export const login = credentials => {
    // Backend expects { username, password } in the request body (Spring Boot controller)
    // Accept either username or email (convert email to username for backend)
    let username = credentials.username
    if (!username && credentials.email) {
        username = credentials.email.includes('@') ? credentials.email.split('@')[0] : credentials.email
    }

    const payload = {
        username,
        password: credentials.password,
    }

    return axiosInstance.post(API_ENDPOINTS.LOGIN, payload)
}

/**
 * Logout current user
 */
export const logout = () => {
    return axiosInstance.post(API_ENDPOINTS.LOGOUT)
}

/**
 * Refresh access token
 */
export const refreshToken = () => {
    return axiosInstance.post(API_ENDPOINTS.REFRESH)
}

/**
 * Get current user profile
 */
export const getProfile = () => {
    // Log calls to profile for debugging repeated requests
    // eslint-disable-next-line no-console
    console.debug('authApi.getProfile: requesting /auth/profile')
    return axiosInstance.get('/auth/profile')
}

/**
 * Mock profile for development
 */
export const mockGetProfile = async () => {
    // lazy-load mock from mockData to avoid circular imports at module init
    const { mockUserProfile } = await import('./mockData')
    const response = await mockUserProfile()
    return { data: response }
}

/**
 * Mock login for development (remove when backend is ready)
 */
export const mockLogin = async credentials => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock validation
    if (credentials.email === 'admin@digipark.com' && credentials.password === 'admin123') {
        return {
            data: {
                user: {
                    id: 1,
                    name: 'Admin User',
                    email: 'admin@digipark.com',
                    role: 'ADMIN',
                },
                accessToken: 'mock_access_token_' + Date.now(),
            },
        }
    } else if (credentials.email === 'user@digipark.com' && credentials.password === 'user123') {
        return {
            data: {
                user: {
                    id: 2,
                    name: 'Regular User',
                    email: 'user@digipark.com',
                    role: 'USER',
                },
                accessToken: 'mock_access_token_' + Date.now(),
            },
        }
    } else {
        throw {
            response: {
                status: 401,
                data: {
                    message: 'Invalid email or password',
                },
            },
        }
    }
}
