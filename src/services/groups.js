import api from './api.js'

/**
 * Get group summary with balances
 */
export async function getGroupSummary(groupId) {
  return api.get(`/groups/${groupId}/summary`)
}

/**
 * Get all expenses for a group
 */
export async function getGroupExpenses(groupId, search = '') {
  const params = search ? `?search=${encodeURIComponent(search)}` : ''
  return api.get(`/groups/${groupId}/expenses${params}`)
}

/**
 * Get all groups for current user
 */
export async function getUserGroups() {
  return api.get('/groups')
}

/**
 * Get group details with members
 */
export async function getGroupDetails(groupId) {
  return api.get(`/groups/${groupId}`)
}

/**
 * Get users in a group (alias for getGroupDetails that returns just members)
 */
export async function getGroupUsers(groupId) {
  const data = await api.get(`/groups/${groupId}`)
  return data // Returns { id, name, description, createdAt, members: [...] }
}

/**
 * Create a new group
 */
export async function createGroup(data) {
  return api.post('/groups', data)
}

/**
 * Add user to group
 */
export async function addUserToGroup(groupId, userId) {
  return api.post(`/groups/${groupId}/members`, { userId })
}

/**
 * Remove user from group
 */
export async function removeUserFromGroup(groupId, userId) {
  return api.delete(`/groups/${groupId}/members/${userId}`)
}

export default {
  getGroupSummary,
  getGroupExpenses,
  getUserGroups,
  getGroupDetails,
  getGroupUsers,
  createGroup,
  addUserToGroup,
  removeUserFromGroup,
}
