import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import api from '@/services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Vérifier si l'utilisateur est déjà connecté au démarrage
  useEffect(() => {
    checkAuth()
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Error getting session:', sessionError)
        setUser(null)
        return
      }

      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Error checking auth:', err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async (userId) => {
    try {
      // Récupérer le profil utilisateur depuis notre API
      const userData = await api.get(`/users/${userId}`)
      setUser({
        id: userId,
        email: userData.email,
        name: userData.name,
        initial: userData.initial,
        ...userData
      })
    } catch (err) {
      console.error('Error loading user profile:', err)
      // Si le profil n'existe pas encore, utiliser les infos de Supabase Auth
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: authUser.email?.split('@')[0] || 'Utilisateur',
          initial: authUser.email?.charAt(0).toUpperCase() || 'U'
        })
      }
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw new Error(authError.message || 'Erreur lors de la connexion')
      }

      if (data.user) {
        await loadUserProfile(data.user.id)
      }

      return { user: data.user }
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
      
      // Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        throw new Error(authError.message || 'Erreur lors de l\'inscription')
      }

      if (!authData.user) {
        throw new Error('Erreur lors de la création du compte')
      }

      // Créer le profil utilisateur dans notre base de données
      try {
        await api.post('/auth/register', {
          userId: authData.user.id,
          name,
          email,
          initial: initial.toUpperCase(),
        })
      } catch (profileError) {
        console.error('Error creating user profile:', profileError)
        // Continuer même si la création du profil échoue
      }

      // Charger le profil
      await loadUserProfile(authData.user.id)

      return { user: authData.user }
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
      await supabase.auth.signOut()
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
