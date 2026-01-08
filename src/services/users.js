import api from './api.js'

/**
 * Get user profile
 */
export async function getUserProfile(userId) {
  return api.get(`/users/${userId}`)
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, data) {
  return api.put(`/users/${userId}`, data)
}

export default {
  getUserProfile,
  updateUserProfile,
}
