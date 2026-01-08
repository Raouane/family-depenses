import { createContext, useContext, useState, useEffect } from 'react'
import api from '@/services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Vérifier si l'utilisateur est déjà connecté au démarrage
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        setUser(null)
        return
      }

      // Vérifier le token avec l'API
      const userData = await api.get('/auth/me')
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        initial: userData.initial,
        ...userData
      })
    } catch (err) {
      console.error('Error checking auth:', err)
      // Token invalide, le supprimer
      localStorage.removeItem('auth_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      if (response.token && response.user) {
        // Sauvegarder le token
        localStorage.setItem('auth_token', response.token)
        setUser(response.user)
        return { user: response.user }
      } else {
        throw new Error('Réponse invalide du serveur')
      }
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la connexion'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password, initial) => {
    try {
      setError(null)
      setLoading(true)
      
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        initial: initial.toUpperCase(),
      })

      if (response.token && response.user) {
        // Sauvegarder le token
        localStorage.setItem('auth_token', response.token)
        setUser(response.user)
        return { user: response.user }
      } else {
        throw new Error('Réponse invalide du serveur')
      }
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'inscription'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem('auth_token')
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Error logging out:', err)
      setUser(null)
      setError(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
