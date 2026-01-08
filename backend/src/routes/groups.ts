import express from 'express'
import { param, query, body, validationResult } from 'express-validator'
import { 
  getGroupSummary, 
  getGroupExpenses, 
  getGroupUsers,
  getUserGroups,
  getGroupById,
  createGroup,
  addUserToGroup,
  removeUserFromGroup
} from '../db/queries.js'

const router = express.Router()

// Validation middleware
const validate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

/**
 * GET /api/groups/:groupId/summary
 * Get financial summary for a group
 */
router.get(
  '/:groupId/summary',
  [param('groupId').isUUID().withMessage('Invalid group ID')],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { groupId } = req.params
      const summary = await getGroupSummary(groupId)

      if (summary.length === 0) {
        return res.status(404).json({ error: 'Group not found' })
      }

      res.json({
        groupId,
        totalBalance: summary[0].total_balance,
        users: summary.map((user) => ({
          userId: user.user_id,
          name: user.user_name,
          initial: user.user_initial,
          balance: user.balance,
          status: user.status,
        })),
      })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * GET /api/groups/:groupId/expenses
 * Get all expenses for a group
 */
router.get(
  '/:groupId/expenses',
  [
    param('groupId').isUUID().withMessage('Invalid group ID'),
    query('search').optional().isString().trim(),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { groupId } = req.params
      const search = req.query.search as string | undefined

      const expenses = await getGroupExpenses(groupId, search)

      res.json({
        groupId,
        expenses: expenses.map((expense) => ({
          id: expense.id,
          title: expense.title,
          amount: expense.amount,
          date: expense.date.toISOString().split('T')[0],
          paidBy: {
            userId: expense.paid_by_user_id,
            name: expense.paid_by_name,
            initial: expense.paid_by_initial,
          },
          category: expense.category,
          receiptImageUrl: expense.receipt_image_url,
          createdAt: expense.created_at.toISOString(),
        })),
      })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * GET /api/groups
 * Get all groups for a user (hardcoded userId for now)
 */
router.get(
  '/',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      // TODO: Get userId from auth/session
      const userId = '550e8400-e29b-41d4-a716-446655440000' // Mohamed
      const groups = await getUserGroups(userId)
      
      res.json({
        groups: groups.map((group: any) => ({
          id: group.id,
          name: group.name,
          description: group.description,
          memberCount: group.member_count,
          createdAt: group.created_at.toISOString(),
        })),
      })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * GET /api/groups/:groupId
 * Get group details
 */
router.get(
  '/:groupId',
  [param('groupId').isUUID().withMessage('Invalid group ID')],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { groupId } = req.params
      const group = await getGroupById(groupId)
      
      if (!group) {
        return res.status(404).json({ error: 'Group not found' })
      }
      
      const users = await getGroupUsers(groupId)
      
      res.json({
        id: group.id,
        name: group.name,
        description: group.description,
        createdAt: group.created_at.toISOString(),
        members: users.map((user: any) => ({
          id: user.id,
          name: user.name,
          initial: user.initial,
          email: user.email,
        })),
      })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * POST /api/groups
 * Create a new group
 */
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required (max 100 chars)'),
    body('description').optional().isString().trim(),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      // TODO: Get userId from auth/session
      const userId = '550e8400-e29b-41d4-a716-446655440000' // Mohamed
      
      const group = await createGroup({
        name: req.body.name,
        description: req.body.description,
        userId,
      })
      
      res.status(201).json({
        id: group.id,
        name: group.name,
        description: group.description,
        createdAt: group.created_at.toISOString(),
      })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * POST /api/groups/:groupId/members
 * Add a user to a group
 */
router.post(
  '/:groupId/members',
  [
    param('groupId').isUUID().withMessage('Invalid group ID'),
    body('userId').isUUID().withMessage('Invalid user ID'),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { groupId } = req.params
      const { userId } = req.body
      
      await addUserToGroup(groupId, userId)
      
      res.status(201).json({ message: 'User added to group' })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * DELETE /api/groups/:groupId/members/:userId
 * Remove a user from a group
 */
router.delete(
  '/:groupId/members/:userId',
  [
    param('groupId').isUUID().withMessage('Invalid group ID'),
    param('userId').isUUID().withMessage('Invalid user ID'),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { groupId, userId } = req.params
      
      await removeUserFromGroup(groupId, userId)
      
      res.json({ message: 'User removed from group' })
    } catch (error: any) {
      next(error)
    }
  }
)

export default router
