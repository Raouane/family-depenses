import express from 'express'
import { param, query, validationResult } from 'express-validator'
import { 
  getUserNotifications, 
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../db/queries.js'
import { authenticate } from '../middleware/auth.js'

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
 * GET /api/notifications
 * Get all notifications for the authenticated user
 */
router.get(
  '/',
  authenticate,
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const userId = req.userId!
      const limit = parseInt(req.query.limit as string) || 50
      
      const notifications = await getUserNotifications(userId, limit)
      
      res.json({ notifications })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * GET /api/notifications/unread-count
 * Get unread notifications count
 */
router.get(
  '/unread-count',
  authenticate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const userId = req.userId!
      const count = await getUnreadNotificationsCount(userId)
      
      res.json({ count })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read
 */
router.put(
  '/:id/read',
  authenticate,
  [param('id').isUUID().withMessage('Invalid notification ID')],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const userId = req.userId!
      const { id } = req.params
      
      await markNotificationAsRead(id, userId)
      
      res.json({ success: true })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 */
router.put(
  '/read-all',
  authenticate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const userId = req.userId!
      
      await markAllNotificationsAsRead(userId)
      
      res.json({ success: true })
    } catch (error: any) {
      next(error)
    }
  }
)

export default router
