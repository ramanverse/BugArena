import api from './axios'

export const getPrograms = (params) => api.get('/programs', { params })
export const getProgramBySlug = (slug) => api.get(`/programs/${slug}`)
export const createProgram = (data) => api.post('/programs', data)
export const updateProgram = (id, data) => api.put(`/programs/${id}`, data)
export const deleteProgram = (id) => api.delete(`/programs/${id}`)
export const toggleBookmark = (id) => api.post(`/programs/${id}/bookmark`)
