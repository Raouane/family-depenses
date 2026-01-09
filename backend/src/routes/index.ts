import express from 'express'
import groupsRouter from './groups.js'
import expensesRouter from './expenses.js'
import usersRouter from './users.js'
import authRouter from './auth.js'
import notificationsRouter from './notifications.js'
import settlementsRouter from './settlements.js'
import settingsRouter from './settings.js'

const router = express.Router()

// Routes
router.use('/auth', authRouter)
router.use('/groups', groupsRouter)
router.use('/expenses', expensesRouter)
router.use('/users', usersRouter)
router.use('/notifications', notificationsRouter)
router.use('/settlements', settlementsRouter)
router.use('/settings', settingsRouter)

export default router
