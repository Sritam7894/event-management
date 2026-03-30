import axiosInstance from './axiosInstance'

export const createBookingApi = (data) => axiosInstance.post('/bookings', data)
export const getMyBookingsApi = () => axiosInstance.get('/bookings/my')
export const getAllBookingsApi = () => axiosInstance.get('/bookings/all')
export const cancelBookingApi = (id) => axiosInstance.put(`/bookings/${id}/cancel`)