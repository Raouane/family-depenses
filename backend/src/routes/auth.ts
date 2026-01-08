import express from 'express'
import { body, validationResult } from 'express-validator'
import pool from '../db/connection.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Validation middleware
const validate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// JWT Secret (à mettre dans .env en production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * POST /api/auth/register
 * Créer le profil utilisateur après inscription Supabase
 * L'utilisateur doit déjà être créé dans Supabase Auth
 */
router.post(
  '/register',
  [
    body('userId').isUUID().withMessage('userId doit être un UUID valide'),
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('initial').isLength({ min: 1, max: 1 }).withMessage('L\'initiale doit être un seul caractère'),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { userId, name, email, initial } = req.body

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE id = $1 OR email = $2',
        [userId, email]
      )

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Cet utilisateur existe déjà' })
      }

      // Créer le profil utilisateur (l'ID vient de Supabase Auth)
      const result = await pool.query(
        `INSERT INTO users (id, name, email, initial)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, initial, created_at`,
        [userId, name, email, initial.toUpperCase()]
      )

      const user = result.rows[0]

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        initial: user.initial,
        createdAt: user.created_at,
      })
    } catch (error: any) {
      // Si c'est une erreur de contrainte de clé étrangère, l'utilisateur n'existe pas dans auth.users
      if (error.code === '23503') {
        return res.status(400).json({ error: 'L\'utilisateur doit d\'abord être créé dans Supabase Auth' })
      }
      next(error)
    }
  }
)

/**
 * POST /api/auth/login
 * Se connecter avec email et mot de passe
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { email, password } = req.body

      // Trouver l'utilisateur
      const result = await pool.query(
        'SELECT id, name, email, password, initial FROM users WHERE email = $1',
        [email]
      )

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
      }

      const user = result.rows[0]

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
      }

      // Générer un token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          initial: user.initial,
        },
      })
    } catch (error: any) {
      next(error)
    }
  }
)

/**
 * GET /api/auth/me
 * Obtenir les informations de l'utilisateur connecté (nécessite un token valide)
 */
router.get(
  '/me',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      // Récupérer le token depuis le header Authorization
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant' })
      }

      const token = authHeader.substring(7)

      // Vérifier le token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }

      // Récupérer l'utilisateur
      const result = await pool.query(
        'SELECT id, name, email, initial, created_at FROM users WHERE id = $1',
        [decoded.userId]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' })
      }

      const user = result.rows[0]

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        initial: user.initial,
      })
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token invalide ou expiré' })
      }
      next(error)
    }
  }
)

export default router
