import pool from './connection.js'

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
  return result.rows.map((row) => ({
    total_balance: parseFloat(row.total_balance),
    user_id: row.user_id,
    user_name: row.user_name,
    user_initial: row.user_initial,
    balance: parseFloat(row.balance),
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
  const params: any[] = [groupId]

  if (search) {
    query += ' AND e.title ILIKE $2'
    params.push(`%${search}%`)
  }

  query += ' ORDER BY e.date DESC, e.created_at DESC'

  const result = await pool.query(query, params)
  return result.rows.map((row) => ({
    ...row,
    amount: parseFloat(row.amount),
    date: new Date(row.date),
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
    shares: sharesResult.rows.map((row) => ({
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
  return result.rows.map((row) => ({
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
}) {
  const updates: string[] = []
  const values: any[] = []
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
  
  if (updates.length === 0) {
    return getUserById(userId)
  }
  
  updates.push(`updated_at = CURRENT_TIMESTAMP`)
  values.push(userId)
  
  const result = await pool.query(
    `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
    `,
    values
  )
  
  return {
    ...result.rows[0],
    created_at: new Date(result.rows[0].created_at),
    updated_at: new Date(result.rows[0].updated_at),
  }
}
