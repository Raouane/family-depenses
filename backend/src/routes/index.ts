import express from 'express'
import groupsRouter from './groups.js'
import expensesRouter from './expenses.js'
import usersRouter from './users.js'

const router = express.Router()

// Routes
router.use('/groups', groupsRouter)
router.use('/expenses', expensesRouter)
router.use('/users', usersRouter)

export default router
