import axiosInstance from './axiosInstance'

export const getUsers = () => axiosInstance.get('/auth/users')
export const createUser = (user) => axiosInstance.post('/auth/users', user)
export const updateUser = (id, payload) => axiosInstance.put(`/auth/users/${id}`, payload)
export const deleteUser = (id) => axiosInstance.delete(`/auth/users/${id}`)

export const getRoles = () => axiosInstance.get('/auth/roles')

// Infrastructure Management
export const getZones = () => axiosInstance.get('/structure/zones')
export const createZone = (zone) => axiosInstance.post('/structure/zones', zone)
export const deleteZone = (id) => axiosInstance.delete(`/structure/zones/${id}`)

export const getLots = () => axiosInstance.get('/structure/lots')
export const getLotsByZone = (zoneId) => axiosInstance.get(`/structure/zones/${zoneId}/lots`)
export const createLot = (lot) => axiosInstance.post('/structure/lots', lot)
export const updateLot = (id, payload) => axiosInstance.put(`/structure/lots/${id}`, payload)
export const deleteLot = (id) => axiosInstance.delete(`/structure/lots/${id}`)

export const getFloors = (lotId) => axiosInstance.get(`/structure/lots/${lotId}/floors`)
export const createFloor = (lotId, floor) => axiosInstance.post(`/structure/lots/${lotId}/floors`, floor)
export const updateFloor = (lotId, floorId, payload) => axiosInstance.put(`/structure/lots/${lotId}/floors/${floorId}`, payload)
export const deleteFloor = (lotId, floorId) => axiosInstance.delete(`/structure/lots/${lotId}/floors/${floorId}`)

export const getSlots = (floorId) => axiosInstance.get(`/structure/floors/${floorId}/slots`)
export const createSlot = (floorId, slot) => axiosInstance.post(`/structure/floors/${floorId}/slots`, slot)
export const updateSlot = (floorId, slotId, payload) => axiosInstance.put(`/structure/floors/${floorId}/slots/${slotId}`, payload)
export const deleteSlot = (floorId, slotId) => axiosInstance.delete(`/structure/floors/${floorId}/slots/${slotId}`)

// Billing
export const getBilling = () => axiosInstance.get('/billing/all')
export const createBilling = (record) => axiosInstance.post('/billing', record)

export default {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getRoles,
    getZones,
    createZone,
    deleteZone,
    getLots,
    getLotsByZone,
    createLot,
    updateLot,
    deleteLot,
    getFloors,
    createFloor,
    updateFloor,
    deleteFloor,
    getSlots,
    createSlot,
    updateSlot,
    deleteSlot,
}
