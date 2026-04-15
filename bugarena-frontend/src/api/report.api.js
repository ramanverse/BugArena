import api from './axios'

export const getReports = (params) => api.get('/reports', { params })
export const getReportById = (id) => api.get(`/reports/${id}`)
export const submitReport = (data) => api.post('/reports', data)
export const updateReport = (id, data) => api.put(`/reports/${id}`, data)
export const changeStatus = (id, status) => api.patch(`/reports/${id}/status`, { status })
export const getComments = (id) => api.get(`/reports/${id}/comments`)
export const addComment = (id, content) => api.post(`/reports/${id}/comments`, { content })
