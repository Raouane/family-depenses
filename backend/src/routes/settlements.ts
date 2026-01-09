import express from 'express'
import { body, param, validationResult } from 'express-validator'
import {
  createSettlement,
  getGroupSettlements,
  getSettlementById,
  deleteSettlement,
  createGroupNotification,
  getUserById,
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
 * GET /api/settlements/group/:groupId
 * Get all settlements for a group
 */
router.get(
  '/group/:groupId',
  authenticate,
  [param('groupId').isUUID().withMessage('Invalid group ID')],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { groupId } = req.params
      const settlements = await getGroupSettlements(groupId)

      res.json(
        settlements.map((settlement) => ({
          id: settlement.id,
          groupId: settlement.group_id,
          fromUser: {
            userId: settlement.from_user_id,
            name: settlement.from_user_name,
            initial: settlement.from_user_initial,
          },
          toUser: {
            userId: settlement.to_user_id,
            name: settlement.to_user_name,
            initial: settlement.to_user_initial,
          },
          amount: settlement.amount,
          paymentMethod: settlement.payment_method,
          notes: settlement.notes,
          createdBy: {
            userId: settlement.created_by_user_id,
            name: settlement.created_by_name,
          },
          createdAt: settlement.created_at.toISOString(),
        }))
      )
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * GET /api/settlements/:id
 * Get settlement by ID
 */
router.get(
  '/:id',
  authenticate,
  [param('id').isUUID().withMessage('Invalid settlement ID')],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { id } = req.params
      const settlement = await getSettlementById(id)

      if (!settlement) {
        return res.status(404).json({ error: 'Settlement not found' })
      }

      res.json({
        id: settlement.id,
        groupId: settlement.group_id,
        fromUser: {
          userId: settlement.from_user_id,
          name: settlement.from_user_name,
          initial: settlement.from_user_initial,
        },
        toUser: {
          userId: settlement.to_user_id,
          name: settlement.to_user_name,
          initial: settlement.to_user_initial,
        },
        amount: settlement.amount,
        paymentMethod: settlement.payment_method,
        notes: settlement.notes,
        createdBy: {
          userId: settlement.created_by_user_id,
          name: settlement.created_by_name,
        },
        createdAt: settlement.created_at.toISOString(),
      })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * POST /api/settlements
 * Create a new settlement
 */
router.post(
  '/',
  authenticate,
  [
    body('groupId').isUUID().withMessage('Invalid group ID'),
    body('fromUserId').isUUID().withMessage('Invalid from user ID'),
    body('toUserId').isUUID().withMessage('Invalid to user ID'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
    body('paymentMethod').optional({ nullable: true }).isString().trim(),
    body('notes').optional({ nullable: true }).isString().trim(),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const userId = req.userId!
      const { groupId, fromUserId, toUserId, amount, paymentMethod, notes } = req.body

      // Vérifier que fromUserId != toUserId
      if (fromUserId === toUserId) {
        return res.status(400).json({ error: 'Le payeur et le bénéficiaire doivent être différents' })
      }

      const settlement = await createSettlement({
        groupId,
        fromUserId,
        toUserId,
        amount: parseFloat(amount),
        paymentMethod: paymentMethod || 'cash',
        notes: notes || null,
        createdByUserId: userId,
      })

      // Créer une notification pour tous les membres du groupe (sauf l'auteur)
      try {
        const author = await getUserById(userId)
        const amountFormatted = parseFloat(amount).toFixed(2).replace('.', ',')
        const fromUser = await getUserById(fromUserId)
        const toUser = await getUserById(toUserId)

        await createGroupNotification(
          groupId,
          userId,
          'expense_added', // Réutiliser le type existant
          'Nouveau règlement',
          `${author.name} a enregistré un règlement : ${fromUser.name} a payé ${amountFormatted} € à ${toUser.name}`,
          null
        )
        console.log(`✅ Notification créée pour le règlement dans le groupe ${groupId}`)
      } catch (notifError) {
        // Ne pas faire échouer la création de règlement si la notification échoue
        console.error('❌ Erreur lors de la création de la notification:', notifError)
      }

      // Récupérer le règlement complet avec les noms d'utilisateurs
      const completeSettlement = await getSettlementById(settlement.id)

      res.status(201).json({
        id: completeSettlement!.id,
        groupId: completeSettlement!.group_id,
        fromUser: {
          userId: completeSettlement!.from_user_id,
          name: completeSettlement!.from_user_name,
          initial: completeSettlement!.from_user_initial,
        },
        toUser: {
          userId: completeSettlement!.to_user_id,
          name: completeSettlement!.to_user_name,
          initial: completeSettlement!.to_user_initial,
        },
        amount: completeSettlement!.amount,
        paymentMethod: completeSettlement!.payment_method,
        notes: completeSettlement!.notes,
        createdBy: {
          userId: completeSettlement!.created_by_user_id,
          name: completeSettlement!.created_by_name,
        },
        createdAt: completeSettlement!.created_at.toISOString(),
      })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * DELETE /api/settlements/:id
 * Delete a settlement
 */
router.delete(
  '/:id',
  authenticate,
  [param('id').isUUID().withMessage('Invalid settlement ID')],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const userId = req.userId!
      const { id } = req.params

      const deleted = await deleteSettlement(id, userId)

      if (!deleted) {
        return res.status(404).json({ error: 'Settlement not found or you do not have permission to delete it' })
      }

      res.json({ message: 'Settlement deleted successfully' })
    } catch (error: any) {
      next(error)
    }
  }
)

export default router
