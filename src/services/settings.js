import api from './api.js'

/**
 * Get a setting by key
 */
export async function getSetting(key) {
  return api.get(`/settings/${key}`)
}

/**
 * Update a setting value
 */
export async function updateSetting(key, value) {
  return api.put(`/settings/${key}`, { value })
}

/**
 * Get the EUR to TND exchange rate
 */
export async function getExchangeRate() {
  try {
    const response = await getSetting('EUR_TO_TND')
    return parseFloat(response.value) || 3.45
  } catch (error) {
    // Silently fail and return default rate if not authenticated or setting doesn't exist
    console.warn('Could not fetch exchange rate, using default:', error.message)
    return 3.45 // Default rate
  }
}

/**
 * Update the EUR to TND exchange rate
 */
export async function updateExchangeRate(rate) {
  return updateSetting('EUR_TO_TND', rate.toString())
}

export default {
  getSetting,
  updateSetting,
  getExchangeRate,
  updateExchangeRate,
}
