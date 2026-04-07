import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import api, { setAccessToken } from '../api/axiosClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [accessToken, setAccessTokenState] = useState(
    () => localStorage.getItem('access_token') || null,
  )
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('access_token'),
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setAccessToken(accessToken)
  }, [accessToken])

  const clearError = useCallback(() => setError(null), [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAccessTokenState(data.access_token)
      setIsAuthenticated(true)
      navigate('/', { replace: true })
    } catch (err) {
      const message = err.response?.data?.detail || 'Unable to sign in'
      setError(message)
      setIsAuthenticated(false)
      setAccessTokenState(null)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const signup = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      await api.post('/auth/signup', { email, password })
      // Auto-login after signup
      await login(email, password)
    } catch (err) {
      const message = err.response?.data?.detail || 'Unable to sign up'
      setError(message)
      setLoading(false)
    }
  }, [login])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      // Best-effort logout; ignore server errors
    } finally {
      setAccessTokenState(null)
      setIsAuthenticated(false)
      navigate('/signin', { replace: true })
    }
  }, [navigate])

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated,
      loading,
      error,
      login,
      signup,
      logout,
      clearError,
    }),
    [accessToken, isAuthenticated, loading, error, login, signup, logout, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
