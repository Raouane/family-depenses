import express from 'express'
import { body, param, validationResult } from 'express-validator'
import { createExpense, getExpenseById } from '../db/queries.js'

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
 * GET /api/expenses/:id
 * Get expense details with shares
 */
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid expense ID')],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { id } = req.params
      const expense = await getExpenseById(id)

      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' })
      }

      res.json({
        id: expense.id,
        groupId: expense.group_id,
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
        shares: expense.shares.map((share) => ({
          userId: share.user_id,
          name: share.user_name,
          initial: share.user_initial,
          amount: share.share_amount,
        })),
        createdAt: expense.created_at.toISOString(),
      })
    } catch (error: unknown) {
      next(error)
    }
  }
)

/**
 * POST /api/expenses
 * Create a new expense
 */
router.post(
  '/',
  [
    body('groupId').isUUID().withMessage('Invalid group ID'),
    body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required (max 255 chars)'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('paidByUserId').isUUID().withMessage('Invalid paid by user ID'),
    body('category').optional({ nullable: true, checkFalsy: true }).isString().trim(),
    body('receiptImageUrl').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('Invalid image URL'),
    body('participantIds').isArray({ min: 1 }).withMessage('At least one participant is required'),
    body('participantIds.*').isUUID().withMessage('Invalid participant ID'),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const {
        groupId,
        title,
        amount,
        date,
        paidByUserId,
        category,
        receiptImageUrl,
        participantIds,
      } = req.body

      const expense = await createExpense({
        groupId,
        title,
        amount: parseFloat(amount),
        date,
        paidByUserId,
        category,
        receiptImageUrl,
        participantIds,
      })

      res.status(201).json({
        id: expense.id,
        groupId: expense.group_id,
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
      })
    } catch (error: unknown) {
      next(error)
    }
  }
)

export default router
