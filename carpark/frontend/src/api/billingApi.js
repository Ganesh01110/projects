import axiosInstance from './axiosInstance'
import { API_ENDPOINTS } from '@utils/constants'
import * as adminApi from '@api/adminApi'

/**
 * Get current bill for a session
 */
export const getCurrentBill = ({ vehicleNumber, sessionId } = {}) => {
    // Backend supports query by vehicleNumber; if sessionId provided use calculate endpoint
    if (vehicleNumber) {
        return axiosInstance.get(API_ENDPOINTS.BILLING_CURRENT, { params: { vehicleNumber } })
    }

    if (sessionId) {
        return axiosInstance.post(API_ENDPOINTS.BILLING_CALCULATE, { sessionId })
    }

    return Promise.reject(new Error('vehicleNumber or sessionId required'))
}

/**
 * Get billing history
 */
export const getBillingHistory = async params => {
    try {
        return await axiosInstance.get(API_ENDPOINTS.BILLING_HISTORY, { params })
    } catch (err) {
        // Fallback to mock admin data for dev
        return await mockGetBillingHistory()
    }
}

/**
 * Calculate bill
 */
export const calculateBill = data => {
    return axiosInstance.post(API_ENDPOINTS.BILLING_CALCULATE, data)
}

/**
 * Mock billing history for development
 */
export const mockGetBillingHistory = async () => {
    const res = await adminApi.getBilling()
    return { data: res.data || [] }
}
