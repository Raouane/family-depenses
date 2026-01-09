import pool from './connection.js'
import { QueryResult } from 'pg'

// Database row types
interface GroupSummaryRow {
  total_balance: string | number
  user_id: string
  user_name: string
  user_email: string | null
  user_initial: string | null
  balance: string | number
  status: string
}

interface ExpenseRow {
  id: string
  group_id: string
  title: string
  amount: string | number
  date: string | Date
  paid_by_user_id: string
  paid_by_name: string
  paid_by_initial: string
  category: string | null
  receipt_image_url: string | null
  created_at: string | Date
  updated_at: string | Date
}

interface NotificationRow {
  id: string
  group_id: string
  user_id: string
  type: string
  title: string
  message: string
  related_entity_id: string | null
  is_read: boolean
  created_at: string | Date
}

export interface GroupSummary {
  total_balance: number
  user_id: string
  user_name: string
  user_initial: string
  balance: number
  status: 'receive' | 'pay' | 'settled'
}

export interface Expense {
  id: string
  group_id: string
  title: string
  amount: number
  date: Date
  paid_by_user_id: string
  paid_by_name: string
  paid_by_initial: string
  category: string | null
  receipt_image_url: string | null
  created_at: Date
  updated_at: Date
}

export interface ExpenseShare {
  user_id: string
  user_name: string
  user_initial: string
  share_amount: number
}

export interface ExpenseWithShares extends Expense {
  shares: ExpenseShare[]
}

/**
 * Get group summary with balances for all users
 */
export async function getGroupSummary(groupId: string): Promise<GroupSummary[]> {
  const result = await pool.query(
    'SELECT * FROM get_group_summary($1)',
    [groupId]
  )
  return result.rows.map((row: GroupSummaryRow) => ({
    total_balance: parseFloat(String(row.total_balance)),
    user_id: row.user_id,
    user_name: row.user_name,
    user_email: row.user_email,
    user_initial: row.user_initial,
    balance: parseFloat(String(row.balance)),
    status: row.status,
  }))
}

/**
 * Get all expenses for a group
 */
export async function getGroupExpenses(
  groupId: string,
  search?: string
): Promise<Expense[]> {
  let query = `
    SELECT 
      e.id,
      e.group_id,
      e.title,
      e.amount,
      e.date,
      e.paid_by_user_id,
      u.name as paid_by_name,
      u.initial as paid_by_initial,
      e.category,
      e.receipt_image_url,
      e.created_at,
      e.updated_at
    FROM expenses e
    JOIN users u ON e.paid_by_user_id = u.id
    WHERE e.group_id = $1
  `
  const params: (string | number)[] = [groupId]

  if (search) {
    query += ' AND e.title ILIKE $2'
    params.push(`%${search}%`)
  }

  query += ' ORDER BY e.date DESC, e.created_at DESC'

  const result = await pool.query(query, params)
  return result.rows.map((row: ExpenseRow) => ({
    id: row.id,
    group_id: row.group_id,
    title: row.title,
    amount: parseFloat(String(row.amount)),
    date: new Date(row.date),
    paid_by_user_id: row.paid_by_user_id,
    paid_by_name: row.paid_by_name,
    paid_by_initial: row.paid_by_initial,
    category: row.category,
    receipt_image_url: row.receipt_image_url,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  }))
}

/**
 * Get expense by ID with shares
 */
export async function getExpenseById(expenseId: string): Promise<ExpenseWithShares | null> {
  // Get expense
  const expenseResult = await pool.query(
    `
    SELECT 
      e.id,
      e.group_id,
      e.title,
      e.amount,
      e.date,
      e.paid_by_user_id,
      u.name as paid_by_name,
      u.initial as paid_by_initial,
      e.category,
      e.receipt_image_url,
      e.created_at,
      e.updated_at
    FROM expenses e
    JOIN users u ON e.paid_by_user_id = u.id
    WHERE e.id = $1
    `,
    [expenseId]
  )

  if (expenseResult.rows.length === 0) {
    return null
  }

  const expense = expenseResult.rows[0]

  // Get shares
  const sharesResult = await pool.query(
    `
    SELECT 
      es.user_id,
      u.name as user_name,
      u.initial as user_initial,
      es.share_amount
    FROM expense_shares es
    JOIN users u ON es.user_id = u.id
    WHERE es.expense_id = $1
    ORDER BY u.name
    `,
    [expenseId]
  )

  return {
    ...expense,
    amount: parseFloat(expense.amount),
    date: new Date(expense.date),
    created_at: new Date(expense.created_at),
    updated_at: new Date(expense.updated_at),
    shares: sharesResult.rows.map((row: any) => ({
      user_id: row.user_id,
      user_name: row.user_name,
      user_initial: row.user_initial,
      share_amount: parseFloat(row.share_amount),
    })),
  }
}

/**
 * Create a new expense and calculate shares
 */
export async function createExpense(data: {
  groupId: string
  title: string
  amount: number
  date: string
  paidByUserId: string
  category?: string
  receiptImageUrl?: string
  participantIds: string[]
}): Promise<Expense> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Insert expense
    const expenseResult = await client.query(
      `
      INSERT INTO expenses (group_id, title, amount, date, paid_by_user_id, category, receipt_image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        data.groupId,
        data.title,
        data.amount,
        data.date,
        data.paidByUserId,
        data.category || null,
        data.receiptImageUrl || null,
      ]
    )

    const expense = expenseResult.rows[0]

    // Calculate and insert shares
    if (data.participantIds.length > 0) {
      await client.query(
        'SELECT calculate_expense_shares($1, $2, $3)',
        [expense.id, data.amount, data.participantIds]
      )
    }

    await client.query('COMMIT')

    // Fetch complete expense with user info
    const completeExpense = await getExpenseById(expense.id)
    return completeExpense as Expense
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Get all users in a group
 */
export async function getGroupUsers(groupId: string) {
  const result = await pool.query(
    `
    SELECT 
      u.id,
      u.name,
      u.initial,
      u.email
    FROM users u
    JOIN user_groups ug ON u.id = ug.user_id
    WHERE ug.group_id = $1
    ORDER BY u.name
    `,
    [groupId]
  )
  return result.rows
}

/**
 * Get all groups for a user
 */
export async function getUserGroups(userId: string) {
  const result = await pool.query(
    `
    SELECT 
      g.id,
      g.name,
      g.description,
      g.created_at,
      COUNT(DISTINCT ug2.user_id) as member_count
    FROM groups g
    JOIN user_groups ug ON g.id = ug.group_id
    LEFT JOIN user_groups ug2 ON g.id = ug2.group_id
    WHERE ug.user_id = $1
    GROUP BY g.id, g.name, g.description, g.created_at
    ORDER BY g.created_at DESC
    `,
    [userId]
  )
  return result.rows.map((row: any) => ({
    ...row,
    created_at: new Date(row.created_at),
    member_count: parseInt(row.member_count),
  }))
}

/**
 * Get group by ID with details
 */
export async function getGroupById(groupId: string) {
  const result = await pool.query(
    `
    SELECT 
      g.id,
      g.name,
      g.description,
      g.created_at,
      g.updated_at
    FROM groups g
    WHERE g.id = $1
    `,
    [groupId]
  )
  
  if (result.rows.length === 0) {
    return null
  }
  
  return {
    ...result.rows[0],
    created_at: new Date(result.rows[0].created_at),
    updated_at: new Date(result.rows[0].updated_at),
  }
}

/**
 * Create a new group
 */
export async function createGroup(data: {
  name: string
  description?: string
  userId: string
}) {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    // Create group
    const groupResult = await client.query(
      `
      INSERT INTO groups (name, description)
      VALUES ($1, $2)
      RETURNING *
      `,
      [data.name, data.description || null]
    )
    
    const group = groupResult.rows[0]
    
    // Add creator to group
    await client.query(
      `
      INSERT INTO user_groups (user_id, group_id)
      VALUES ($1, $2)
      `,
      [data.userId, group.id]
    )
    
    await client.query('COMMIT')
    
    return {
      ...group,
      created_at: new Date(group.created_at),
      updated_at: new Date(group.updated_at),
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Add user to group
 */
export async function addUserToGroup(groupId: string, userId: string) {
  const result = await pool.query(
    `
    INSERT INTO user_groups (user_id, group_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, group_id) DO NOTHING
    RETURNING *
    `,
    [userId, groupId]
  )
  return result.rows[0]
}

/**
 * Remove user from group
 */
export async function removeUserFromGroup(groupId: string, userId: string) {
  const result = await pool.query(
    `
    DELETE FROM user_groups
    WHERE user_id = $1 AND group_id = $2
    RETURNING *
    `,
    [userId, groupId]
  )
  return result.rows[0]
}

/**
 * Update group
 */
export async function updateGroup(groupId: string, data: {
  name?: string
  description?: string
}) {
  const updates: string[] = []
  const values: (string | number | null)[] = []
  let paramIndex = 1
  
  if (data.name !== undefined) {
    updates.push(`name = $${paramIndex++}`)
    values.push(data.name)
  }
  if (data.description !== undefined) {
    updates.push(`description = $${paramIndex++}`)
    values.push(data.description === '' ? null : data.description)
  }
  
  if (updates.length === 0) {
    return getGroupById(groupId)
  }
  
  updates.push(`updated_at = CURRENT_TIMESTAMP`)
  values.push(groupId)
  
  const result = await pool.query(
    `
    UPDATE groups
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
    `,
    values
  )
  
  if (result.rows.length === 0) {
    return null
  }
  
  return {
    ...result.rows[0],
    created_at: new Date(result.rows[0].created_at),
    updated_at: new Date(result.rows[0].updated_at),
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const result = await pool.query(
    `
    SELECT 
      id,
      name,
      email,
      initial,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
    `,
    [userId]
  )
  
  if (result.rows.length === 0) {
    return null
  }
  
  return {
    ...result.rows[0],
    created_at: new Date(result.rows[0].created_at),
    updated_at: new Date(result.rows[0].updated_at),
  }
}

/**
 * Update user
 */
export async function updateUser(userId: string, data: {
  name?: string
  email?: string
  initial?: string
  notifications_enabled?: boolean
}) {
  const updates: string[] = []
  const values: (string | number | null)[] = []
  let paramIndex = 1
  
  if (data.name !== undefined) {
    updates.push(`name = $${paramIndex++}`)
    values.push(data.name)
  }
  if (data.email !== undefined) {
    updates.push(`email = $${paramIndex++}`)
    values.push(data.email)
  }
  if (data.initial !== undefined) {
    updates.push(`initial = $${paramIndex++}`)
    values.push(data.initial)
  }
  if (data.notifications_enabled !== undefined) {
    updates.push(`notifications_enabled = $${paramIndex++}`)
    values.push(data.notifications_enabled)
  }
  
  if (updates.length === 0) {
    return getUserById(userId)
  }
  
  updates.push(`updated_at = CURRENT_TIMESTAMP`)
  values.push(userId)
  
  try {
    const result = await pool.query(
      `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
      `,
      values
    )
    
    if (result.rows.length === 0) {
      throw new Error('User not found')
    }
    
    return {
      ...result.rows[0],
      created_at: new Date(result.rows[0].created_at),
      updated_at: new Date(result.rows[0].updated_at),
    }
  } catch (error: unknown) {
    // Vérifier si l'erreur est due à une colonne manquante
    if (error.message && error.message.includes('notifications_enabled')) {
      throw new Error('La colonne notifications_enabled n\'existe pas. Veuillez exécuter la migration SQL: database/migration_add_notifications_preferences.sql dans Supabase SQL Editor.')
    }
    throw error
  }
}

/**
 * Notification interfaces
 */
export interface Notification {
  id: string
  user_id: string
  group_id: string
  type: 'expense_added' | 'expense_updated' | 'expense_deleted' | 'group_updated' | 'member_added' | 'member_removed'
  title: string
  message: string
  related_expense_id: string | null
  is_read: boolean
  created_at: Date
  group_name?: string
}

/**
 * Create notifications for all group members (except the author)
 */
export async function createGroupNotification(
  groupId: string,
  authorUserId: string,
  type: Notification['type'],
  title: string,
  message: string,
  relatedExpenseId: string | null = null
): Promise<void> {
  try {
    const result = await pool.query(
      `SELECT create_group_notification($1, $2, $3, $4, $5, $6)`,
      [groupId, authorUserId, type, title, message, relatedExpenseId]
    )
    console.log(`Notification créée pour le groupe ${groupId}, auteur: ${authorUserId}`)
  } catch (error: unknown) {
    console.error('Erreur lors de la création de la notification:', error.message)
    // Vérifier si la fonction existe
    if (error.message.includes('function') && error.message.includes('does not exist')) {
      throw new Error('La fonction create_group_notification n\'existe pas dans la base de données. Exécutez database/migration_add_notifications.sql')
    }
    throw error
  }
}

/**
 * Get all notifications for a user
 */
export async function getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
  const result = await pool.query(
    `
    SELECT 
      n.*,
      g.name as group_name
    FROM notifications n
    JOIN groups g ON n.group_id = g.id
    WHERE n.user_id = $1
    ORDER BY n.created_at DESC
    LIMIT $2
    `,
    [userId, limit]
  )
  
  return result.rows.map((row: any) => ({
    id: row.id,
    user_id: row.user_id,
    group_id: row.group_id,
    type: row.type,
    title: row.title,
    message: row.message,
    related_expense_id: row.related_expense_id,
    is_read: row.is_read,
    created_at: new Date(row.created_at),
    group_name: row.group_name,
  }))
}

/**
 * Get unread notifications count for a user
 */
export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  const result = await pool.query(
    `SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
    [userId]
  )
  return parseInt(result.rows[0].count)
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
  await pool.query(
    `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2`,
    [notificationId, userId]
  )
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  await pool.query(
    `UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`,
    [userId]
  )
}

/**
 * Settlement interfaces
 */
export interface Settlement {
  id: string
  group_id: string
  from_user_id: string
  to_user_id: string
  amount: number
  payment_method: string
  notes: string | null
  created_by_user_id: string
  created_at: Date
  from_user_name?: string
  from_user_initial?: string
  to_user_name?: string
  to_user_initial?: string
  created_by_name?: string
}

/**
 * Create a new settlement
 */
export async function createSettlement(data: {
  groupId: string
  fromUserId: string
  toUserId: string
  amount: number
  paymentMethod?: string
  notes?: string
  createdByUserId: string
}): Promise<Settlement> {
  const result = await pool.query(
    `
    INSERT INTO settlements (group_id, from_user_id, to_user_id, amount, payment_method, notes, created_by_user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      data.groupId,
      data.fromUserId,
      data.toUserId,
      data.amount,
      data.paymentMethod || 'cash',
      data.notes || null,
      data.createdByUserId,
    ]
  )

  const settlement = result.rows[0]
  return {
    id: settlement.id,
    group_id: settlement.group_id,
    from_user_id: settlement.from_user_id,
    to_user_id: settlement.to_user_id,
    amount: parseFloat(settlement.amount),
    payment_method: settlement.payment_method,
    notes: settlement.notes,
    created_by_user_id: settlement.created_by_user_id,
    created_at: new Date(settlement.created_at),
  }
}

/**
 * Get all settlements for a group
 */
export async function getGroupSettlements(groupId: string): Promise<Settlement[]> {
  const result = await pool.query(
    `
    SELECT 
      s.*,
      u1.name as from_user_name,
      u1.initial as from_user_initial,
      u2.name as to_user_name,
      u2.initial as to_user_initial,
      u3.name as created_by_name
    FROM settlements s
    JOIN users u1 ON s.from_user_id = u1.id
    JOIN users u2 ON s.to_user_id = u2.id
    JOIN users u3 ON s.created_by_user_id = u3.id
    WHERE s.group_id = $1
    ORDER BY s.created_at DESC
    `,
    [groupId]
  )

  return result.rows.map((row: any) => ({
    id: row.id,
    group_id: row.group_id,
    from_user_id: row.from_user_id,
    to_user_id: row.to_user_id,
    amount: parseFloat(row.amount),
    payment_method: row.payment_method,
    notes: row.notes,
    created_by_user_id: row.created_by_user_id,
    created_at: new Date(row.created_at),
    from_user_name: row.from_user_name,
    from_user_initial: row.from_user_initial,
    to_user_name: row.to_user_name,
    to_user_initial: row.to_user_initial,
    created_by_name: row.created_by_name,
  }))
}

/**
 * Get settlement by ID
 */
export async function getSettlementById(settlementId: string): Promise<Settlement | null> {
  const result = await pool.query(
    `
    SELECT 
      s.*,
      u1.name as from_user_name,
      u1.initial as from_user_initial,
      u2.name as to_user_name,
      u2.initial as to_user_initial,
      u3.name as created_by_name
    FROM settlements s
    JOIN users u1 ON s.from_user_id = u1.id
    JOIN users u2 ON s.to_user_id = u2.id
    JOIN users u3 ON s.created_by_user_id = u3.id
    WHERE s.id = $1
    `,
    [settlementId]
  )

  if (result.rows.length === 0) {
    return null
  }

  const row = result.rows[0]
  return {
    id: row.id,
    group_id: row.group_id,
    from_user_id: row.from_user_id,
    to_user_id: row.to_user_id,
    amount: parseFloat(row.amount),
    payment_method: row.payment_method,
    notes: row.notes,
    created_by_user_id: row.created_by_user_id,
    created_at: new Date(row.created_at),
    from_user_name: row.from_user_name,
    from_user_initial: row.from_user_initial,
    to_user_name: row.to_user_name,
    to_user_initial: row.to_user_initial,
    created_by_name: row.created_by_name,
  }
}

/**
 * Delete a settlement
 */
export async function deleteSettlement(settlementId: string, userId: string): Promise<boolean> {
  const result = await pool.query(
    `
    DELETE FROM settlements
    WHERE id = $1 AND created_by_user_id = $2
    RETURNING *
    `,
    [settlementId, userId]
  )

  return result.rows.length > 0
}

/**
 * Get a setting by key
 */
export async function getSetting(key: string) {
  const result = await pool.query(
    'SELECT * FROM settings WHERE key = $1',
    [key]
  )
  return result.rows[0] || null
}

/**
 * Update a setting value
 */
export async function updateSetting(key: string, value: string) {
  const result = await pool.query(
    `UPDATE settings 
     SET value = $1, updated_at = CURRENT_TIMESTAMP 
     WHERE key = $2 
     RETURNING *`,
    [value, key]
  )
  return result.rows[0]
}