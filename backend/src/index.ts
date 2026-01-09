import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import routes from './routes/index.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const isProduction = process.env.NODE_ENV === 'production'

// Middleware
// En développement, accepter tous les ports locaux (5173, 5174, etc.)
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [FRONTEND_URL]
  : [
      FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      /^http:\/\/localhost:\d+$/
    ]

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // En production, si le frontend et le backend sont sur le même domaine,
    // les requêtes same-origin n'ont pas d'header Origin - les autoriser
    if (!origin && isProduction) {
      return callback(null, true)
    }
    
    // En développement, autoriser les requêtes sans origin (Postman, etc.)
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true)
    }
    
    // Vérifier si l'origin est autorisé
    if (origin && allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin)
      }
      return false
    })) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes API
app.use('/api', routes)

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', message: 'FamilySplit API is running' })
})

// En production, servir les fichiers statiques du frontend
if (isProduction) {
  // Chemin vers le dossier dist du frontend (un niveau au-dessus du backend)
  const frontendDistPath = path.join(__dirname, '../../dist')
  
  // Servir les fichiers statiques
  app.use(express.static(frontendDistPath))
  
  // Pour toutes les routes non-API, servir index.html (SPA routing)
  app.get('*', (req: express.Request, res: express.Response) => {
    // Ne pas intercepter les routes API
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Route not found' })
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'))
  })
}

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler pour les routes API (seulement en développement ou si ce n'est pas une route frontend)
if (!isProduction) {
  app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'Route not found' })
  })
}

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
})

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Le port ${PORT} est déjà utilisé.`)
    console.error(`💡 Solutions:`)
    console.error(`   1. Arrêter le processus qui utilise le port: netstat -ano | findstr :${PORT}`)
    console.error(`   2. Utiliser un autre port: définir PORT=3001 dans backend/.env`)
    console.error(`   3. Tuer tous les processus Node: taskkill /F /IM node.exe`)
    process.exit(1)
  } else {
    throw err
  }
})
