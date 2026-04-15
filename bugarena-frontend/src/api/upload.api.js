import api from './axios'

export const uploadAvatar = (file) => {
  const formData = new FormData()
  formData.append('avatar', file)
  return api.post('/upload/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const uploadScreenshot = (file) => {
  const formData = new FormData()
  formData.append('screenshot', file)
  return api.post('/upload/screenshot', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
