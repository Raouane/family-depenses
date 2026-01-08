import express from 'express'
import groupsRouter from './groups.js'
import expensesRouter from './expenses.js'
import usersRouter from './users.js'
import authRouter from './auth.js'

const router = express.Router()

// Routes
router.use('/auth', authRouter)
router.use('/groups', groupsRouter)
router.use('/expenses', expensesRouter)
router.use('/users', usersRouter)

export default router
