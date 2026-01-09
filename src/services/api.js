// En production, utiliser l'URL relative (même domaine)
// En développement, utiliser l'URL du backend local
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api')

/**
 * Generic API request function
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Récupérer le token JWT depuis localStorage
  const token = localStorage.getItem('auth_token')
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      
      // Si c'est une erreur de validation, afficher les détails
      if (errorData.errors && Array.isArray(errorData.errors)) {
        const errorMessages = errorData.errors.map(err => err.msg || err.message).join(', ')
        throw new Error(errorMessages || `HTTP error! status: ${response.status}`)
      }
      
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    // Ne pas logger les erreurs de connexion (backend non démarré)
    // pour éviter le spam dans la console
    if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED'))) {
      // Créer une erreur personnalisée pour que les composants puissent la détecter
      const connectionError = new Error('Backend non disponible')
      connectionError.isConnectionError = true
      throw connectionError
    }
    
    // Logger uniquement les autres erreurs
    if (!error.message || !error.message.includes('Token manquant')) {
      console.error('API request failed:', error)
    }
    throw error
  }
}

/**
 * GET request
 */
export function get(endpoint) {
  return request(endpoint, { method: 'GET' })
}

/**
 * POST request
 */
export function post(endpoint, data) {
  return request(endpoint, {
    method: 'POST',
    body: data,
  })
}

/**
 * PUT request
 */
export function put(endpoint, data) {
  return request(endpoint, {
    method: 'PUT',
    body: data,
  })
}

/**
 * DELETE request
 */
export function del(endpoint) {
  return request(endpoint, { method: 'DELETE' })
}

export default { get, post, put, delete: del }
