import axiosInstance from './axiosInstance'

const BASE_URL = '/gate'

/**
 * Simulate vehicle entry
 * @param {string} vehicleNumber 
 * @param {string} type - 'CAR', 'BIKE', 'TRUCK'
 */
export const entryVehicle = (vehicleNumber, type) => {
    return axiosInstance.post(`${BASE_URL}/entry`, null, {
        params: {
            vehicleNumber,
            type
        }
    })
}

/**
 * Simulate vehicle exit
 * @param {string} vehicleNumber 
 */
export const exitVehicle = (vehicleNumber) => {
    return axiosInstance.post(`${BASE_URL}/exit`, null, {
        params: {
            vehicleNumber
        }
    })
}
