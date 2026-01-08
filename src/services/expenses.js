import api from './api.js'

/**
 * Get expense by ID with shares
 */
export async function getExpenseById(expenseId) {
  return api.get(`/expenses/${expenseId}`)
}

/**
 * Create a new expense
 */
export async function createExpense(expenseData) {
  return api.post('/expenses', expenseData)
}

export default {
  getExpenseById,
  createExpense,
}
