// API Base URL - can be configured via environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// App Constants
export const APP_NAME = 'DigiPark'
export const APP_VERSION = '1.0.0'

// Parking Slot States
export const SLOT_STATUS = {
    AVAILABLE: 'AVAILABLE',
    RESERVED: 'RESERVED',
    OCCUPIED: 'OCCUPIED',
    OUT_OF_SERVICE: 'OUT_OF_SERVICE',
}

// Slot Status Colors (matching Tailwind config)
export const SLOT_COLORS = {
    [SLOT_STATUS.AVAILABLE]: 'bg-status-available text-dark-bg',
    [SLOT_STATUS.RESERVED]: 'bg-status-reserved text-dark-bg',
    [SLOT_STATUS.OCCUPIED]: 'bg-status-occupied text-white',
    [SLOT_STATUS.OUT_OF_SERVICE]: 'bg-status-outOfService text-white',
}

// User Roles
export const USER_ROLES = {
    ADMIN: 'ADMIN',
    OPERATOR: 'OPERATOR',
    USER: 'USER',
}

// Theme Constants
export const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
}

// Local Storage Keys
export const STORAGE_KEYS = {
    THEME: 'digipark_theme',
    USER: 'digipark_user',
    SIDEBAR_COLLAPSED: 'digipark_sidebar_collapsed',
}

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    // Backend uses /api/auth/signin for login
    LOGIN: '/auth/signin',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',

    // Dashboard
    DASHBOARD_SUMMARY: '/dashboard/summary',
    DASHBOARD_REVENUE: '/dashboard/revenue',
    DASHBOARD_ADMIN: '/dashboard/admin',
    DASHBOARD_USER: '/dashboard/user',

    // Parking
    PARKING_LOTS: '/parking/lots',
    PARKING_FLOORS: '/parking/floors',
    PARKING_SLOTS: '/parking/slots',
    PARKING_AVAILABILITY: '/parking/availability',

    // Billing
    BILLING_CURRENT: '/billing/current',
    BILLING_HISTORY: '/billing/history',
    BILLING_CALCULATE: '/billing/calculate',

    // Bookings
    BOOKINGS_CREATE: '/bookings/create',
    BOOKINGS_CONFIRM: '/bookings/confirm',
    BOOKINGS_CANCEL: '/bookings/cancel',
}

// Polling Intervals (in milliseconds)
export const POLLING_INTERVALS = {
    AVAILABILITY: 5000, // 5 seconds
    DASHBOARD: 10000, // 10 seconds
}

// Validation Rules
export const VALIDATION = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 6,
    PHONE_REGEX: /^[0-9]{10}$/,
}

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    UNAUTHORIZED: 'Your session has expired. Please login again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Welcome back!',
    LOGOUT_SUCCESS: 'You have been logged out successfully.',
    BOOKING_SUCCESS: 'Your parking slot has been booked successfully!',
    BOOKING_CANCELLED: 'Your booking has been cancelled.',
}

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    PARKING_LOTS: '/parking-lots',
    PARKING_SLOTS: '/parking-slots/:lotId',
    BILLING: '/billing',
    BILLING_HISTORY: '/billing/history',
    ADMIN: '/admin',
    NOT_FOUND: '/404',
    OUT_OF_SERVICE: '/out-of-service',
}
