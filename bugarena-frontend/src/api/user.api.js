import api from './axios'

export const getProfile = (username) => api.get(`/users/${username}`)
export const updateProfile = (data) => api.put('/users/me', data)
export const updatePassword = (data) => api.put('/users/me/password', data)
export const deleteAccount = () => api.delete('/users/me')
export const getBadges = () => api.get('/users/me/badges')
export const getCertificates = () => api.get('/users/me/certificates')
export const getNotifications = (params) => api.get('/users/me/notifications', { params })
export const markRead = (id) => api.patch(`/users/me/notifications/${id}/read`)
export const markAllRead = () => api.patch('/users/me/notifications/read-all')
