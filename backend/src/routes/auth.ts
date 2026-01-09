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
 * Créer un nouvel utilisateur avec email et mot de passe
 */
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('initial').isLength({ min: 1, max: 1 }).withMessage('L\'initiale doit être un seul caractère'),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { name, email, password, initial } = req.body

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      )

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' })
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10)

      // Générer un UUID pour l'utilisateur
      const userIdResult = await pool.query('SELECT uuid_generate_v4() as id')
      const userId = userIdResult.rows[0].id

      // Créer le profil utilisateur
      const result = await pool.query(
        `INSERT INTO users (id, name, email, password, initial)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, initial, created_at`,
        [userId, name, email, hashedPassword, initial.toUpperCase()]
      )

      const user = result.rows[0]

      // Générer un token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          initial: user.initial,
        },
      })
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token invalide ou expiré' })
      }
      next(error)
    }
  }
)

/**
 * POST /api/auth/forgot-password
 * Demander une réinitialisation de mot de passe
 */
router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { email } = req.body

      // Vérifier si l'utilisateur existe
      const result = await pool.query(
        'SELECT id, email FROM users WHERE email = $1',
        [email]
      )

      // Pour la sécurité, on ne révèle pas si l'email existe ou non
      if (result.rows.length === 0) {
        return res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé' })
      }

      const user = result.rows[0]

      // Générer un token de réinitialisation (valide 1 heure)
      const resetToken = jwt.sign(
        { userId: user.id, email: user.email, type: 'password_reset' },
        JWT_SECRET,
        { expiresIn: '1h' }
      )

      // En production, vous devriez envoyer un email avec ce token
      // Pour l'instant, on le retourne dans la réponse (à retirer en production)
      res.json({
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
        // ⚠️ À retirer en production - seulement pour le développement
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
      })
    } catch (error: unknown) {
      next(error)
    }
  }
)

/**
 * POST /api/auth/reset-password
 * Réinitialiser le mot de passe avec un token
 */
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Le token est requis'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  ],
  validate,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { token, password } = req.body

      // Vérifier le token
      let decoded: { userId: string; email: string; type?: string }
      try {
        decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; type?: string }
      } catch (error: unknown) {
        if (error.name === 'TokenExpiredError') {
          return res.status(400).json({ error: 'Le lien de réinitialisation a expiré' })
        }
        return res.status(400).json({ error: 'Token invalide' })
      }

      // Vérifier que c'est un token de réinitialisation
      if (decoded.type !== 'password_reset') {
        return res.status(400).json({ error: 'Token invalide' })
      }

      // Vérifier que l'utilisateur existe
      const userResult = await pool.query(
        'SELECT id FROM users WHERE id = $1',
        [decoded.userId]
      )

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' })
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 10)

      // Mettre à jour le mot de passe
      await pool.query(
        'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [hashedPassword, decoded.userId]
      )

      res.json({ message: 'Mot de passe réinitialisé avec succès' })
    } catch (error: unknown) {
      next(error)
    }
  }
)

export default router
