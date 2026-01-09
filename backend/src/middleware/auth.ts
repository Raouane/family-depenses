import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Étendre le type Request pour inclure userId
declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

/**
 * Middleware pour vérifier le token JWT et extraire l'userId
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' })
    }

    const token = authHeader.substring(7)

    // Vérifier le token JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }

    // Ajouter userId à la requête
    req.userId = decoded.userId

    next()
  } catch (error: unknown) {
    if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
      return res.status(401).json({ error: 'Token invalide ou expiré' })
    }
    console.error('Error in authentication middleware:', error)
    return res.status(401).json({ error: 'Erreur d\'authentification' })
  }
}
