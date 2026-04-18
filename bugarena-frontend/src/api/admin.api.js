import api from './axios'

export const getStats = () => api.get('/stats')
export const getAdminReports = (params) => api.get('/admin/reports', { params })
export const getAdminUsers = (params) => api.get('/admin/users', { params })
export const banUser = (id) => api.patch(`/admin/users/${id}/ban`)
export const getAdminPrograms = (params) => api.get('/admin/programs', { params })
export const approveProgram = (id) => api.patch(`/admin/programs/${id}/approve`)
export const rejectProgram = (id) => api.patch(`/admin/programs/${id}/reject`)
