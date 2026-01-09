import { get, post, del } from './api.js'

/**
 * Get all settlements for a group
 */
export async function getGroupSettlements(groupId) {
  return get(`/settlements/group/${groupId}`)
}

/**
 * Get settlement by ID
 */
export async function getSettlementById(settlementId) {
  return get(`/settlements/${settlementId}`)
}

/**
 * Create a new settlement
 */
export async function createSettlement(data) {
  return post('/settlements', data)
}

/**
 * Delete a settlement
 */
export async function deleteSettlement(settlementId) {
  return del(`/settlements/${settlementId}`)
}

export default {
  getGroupSettlements,
  getSettlementById,
  createSettlement,
  deleteSettlement,
}
