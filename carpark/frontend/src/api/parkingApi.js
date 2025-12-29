import axiosInstance from './axiosInstance'
import { API_ENDPOINTS, SLOT_STATUS } from '@utils/constants'
import * as adminApi from '@api/adminApi'

/**
 * Get all parking lots
 */
export const getParkingLots = () => {
    return axiosInstance.get(API_ENDPOINTS.PARKING_LOTS)
}

/**
 * Get floors for a parking lot
 */
export const getFloors = lotId => {
    return axiosInstance.get(`${API_ENDPOINTS.PARKING_FLOORS}/${lotId}`)
}

/**
 * Get slots for a floor
 */
export const getSlots = (lotId, floorId) => {
    return axiosInstance.get(`${API_ENDPOINTS.PARKING_SLOTS}/${lotId}/${floorId}`)
}

/**
 * Get real-time availability for a lot
 */
export const getAvailability = lotId => {
    return axiosInstance.get(`${API_ENDPOINTS.PARKING_AVAILABILITY}/${lotId}`)
}

/**
 * Get all zones
 */
export const getZones = () => {
    return axiosInstance.get('/structure/zones')
}

/**
 * Mock parking lots data for development
 */
export const mockGetParkingLots = async () => {
    // Use persistent lots from adminApi so Data Studio edits reflect here
    const res = await adminApi.getLots()
    const lots = (res.data || []).map(l => ({
        id: l.id,
        name: l.name,
        address: l.address,
        image: l.image || `https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800`,
        totalSlots: 20, // dummy for now
        availableSlots: 15, // dummy for now
        price: l.price || 3.99,
        zone: l.zone,
    }))

    return { data: lots }
}

/**
 * Mock slots data for development
 */
export const mockGetSlots = async (lotId, zone = 'A') => {
    // Use adminApi mock store for slots
    const res = await adminApi.getSlots(lotId, zone)
    return { data: res.data || [] }
}

/**
 * Mock floors
 */
export const mockGetFloors = async lotId => {
    const res = await adminApi.getFloors(lotId)
    return { data: res.data || [] }
}

/**
 * Mock availability map
 */
export const mockGetAvailability = async lotId => {
    const floorsRes = await adminApi.getFloors(lotId)
    const map = {}
        ; (floorsRes.data || []).forEach(f => {
            (f.slots || []).forEach(s => {
                map[s.id] = s.status
            })
        })
    return { data: map }
}
