import api from './api.js'

/**
 * Get all notifications for the current user
 */
export async function getNotifications(limit = 50) {
  const response = await api.get(`/notifications?limit=${limit}`)
  return response.notifications
}

/**
 * Get unread notifications count
 */
export async function getUnreadCount() {
  const response = await api.get('/notifications/unread-count')
  return response.count
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId) {
  return api.put(`/notifications/${notificationId}/read`, {})
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead() {
  return api.put('/notifications/read-all', {})
}

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
}
