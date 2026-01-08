import { Request, Response, NextFunction } from 'express'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

// Créer le client Supabase pour vérifier les tokens
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Étendre le type Request pour inclure userId
declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

/**
 * Middleware pour vérifier le token Supabase et extraire l'userId
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' })
    }

    const token = authHeader.substring(7)

    // Si Supabase n'est pas configuré, retourner une erreur
    if (!supabase) {
      console.warn('Supabase non configuré, vérification du token impossible')
      return res.status(500).json({ error: 'Configuration d\'authentification manquante' })
    }

    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Token invalide ou expiré' })
    }

    // Ajouter userId à la requête
    req.userId = user.id

    next()
  } catch (error: any) {
    console.error('Error in authentication middleware:', error)
    return res.status(401).json({ error: 'Erreur d\'authentification' })
  }
}
