import axiosInstance from './axiosInstance'

export const getEventsApi = (params) => axiosInstance.get('/events', { params })
export const getEventByIdApi = (id) => axiosInstance.get(`/events/${id}`)
export const createEventApi = (data) => axiosInstance.post('/events', data)
export const updateEventApi = (id, data) => axiosInstance.put(`/events/${id}`, data)
export const deleteEventApi = (id) => axiosInstance.delete(`/events/${id}`)