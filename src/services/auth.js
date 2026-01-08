import api from './api.js'

/**
 * Register a new user
 */
export async function register(data) {
  return api.post('/auth/register', data)
}

/**
 * Login with email and password
 */
export async function login(email, password) {
  return api.post('/auth/login', { email, password })
}

/**
 * Get current user info (requires token)
 */
export async function getCurrentUser() {
  // Récupérer le token depuis localStorage
  const token = localStorage.getItem('auth_token')
  
  if (!token) {
    throw new Error('No token found')
  }

  // Faire la requête avec le token dans le header
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      // Token invalide, le supprimer
      localStorage.removeItem('auth_token')
      throw new Error('Token invalide')
    }
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || 'Erreur lors de la récupération de l\'utilisateur')
  }

  return await response.json()
}

/**
 * Logout (remove token)
 */
export function logout() {
  localStorage.removeItem('auth_token')
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!localStorage.getItem('auth_token')
}

/**
 * Get auth token
 */
export function getToken() {
  return localStorage.getItem('auth_token')
}

export default {
  register,
  login,
  getCurrentUser,
  logout,
  isAuthenticated,
  getToken,
}
