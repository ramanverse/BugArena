import useAuthStore from '../stores/authStore'

export function useAuth() {
  const { user, accessToken, isAuthenticated, login, logout, updateUser, setToken } = useAuthStore()
  return { user, accessToken, isAuthenticated, login, logout, updateUser, setToken }
}
