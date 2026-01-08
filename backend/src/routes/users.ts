import express from 'express'
import { param, body, validationResult } from 'express-validator'
import { getUserById, updateUser } from '../db/queries.js'
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
 * GET /api/users/:userId
 * Get user profile
 */
router.get(
  '/:userId',
  authenticate,
  [param('userId').isUUID().withMessage('Invalid user ID')],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { userId } = req.params
      const user = await getUserById(userId)
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        initial: user.initial,
        createdAt: user.created_at.toISOString(),
      })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * PUT /api/users/:userId
 * Update user profile
 */
router.put(
  '/:userId',
  authenticate,
  [
    param('userId').isUUID().withMessage('Invalid user ID'),
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('email').optional().isEmail(),
    body('initial').optional().isLength({ min: 1, max: 1 }),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { userId } = req.params
      const { name, email, initial } = req.body
      
      const user = await updateUser(userId, { name, email, initial })
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        initial: user.initial,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString(),
      })
    } catch (error: any) {
      next(error)
    }
  }
)

export default router
