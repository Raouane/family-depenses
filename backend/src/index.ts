import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

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
  origin: (origin, callback) => {
    // En développement, autoriser les requêtes sans origin (Postman, etc.)
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true)
    }
    
    // Vérifier si l'origin est autorisé
    if (allowedOrigins.some(allowed => {
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

// Routes
app.use('/api', routes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FamilySplit API is running' })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
})
