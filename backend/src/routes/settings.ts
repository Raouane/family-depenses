import express from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate } from '../middleware/auth.js'
import { getSetting, updateSetting } from '../db/queries.js'

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
 * GET /api/settings/:key
 * Get a setting value (public, no auth required for reading)
 */
router.get(
  '/:key',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { key } = req.params
      const setting = await getSetting(key)

      if (!setting) {
        return res.status(404).json({ error: 'Setting not found' })
      }

      res.json({
        key: setting.key,
        value: setting.value,
        description: setting.description,
      })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * PUT /api/settings/:key
 * Update a setting value
 */
router.put(
  '/:key',
  authenticate,
  [
    body('value').notEmpty().withMessage('Value is required'),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { key } = req.params
      const { value } = req.body

      // Validation spécifique pour le taux de change
      if (key === 'EUR_TO_TND') {
        const rate = parseFloat(value)
        if (isNaN(rate) || rate <= 0) {
          return res.status(400).json({ error: 'Le taux doit être un nombre positif' })
        }
      }

      const setting = await updateSetting(key, value)

      res.json({
        key: setting.key,
        value: setting.value,
        description: setting.description,
        updatedAt: setting.updated_at.toISOString(),
      })
    } catch (error: any) {
      next(error)
    }
  }
)

export default router
