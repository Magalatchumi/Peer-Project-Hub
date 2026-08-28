import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import { initializeFirebase } from './config/firebase.js'
import userRoutes from './routes/userRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5000
const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, '')
const isVercelProjectOrigin = (origin) => {
  try {
    const url = new URL(origin)
    return url.protocol === 'https:'
      && /^peer-project-hub(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(url.hostname)
  } catch {
    return false
  }
}
const allowedOrigins = [
  'https://peer-project-hub-git-main-magalatchumis-projects.vercel.app',
  'https://peer-project-hub-six.vercel.app',
  'https://peer-project-hub.vercel.app',
  ...((process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean)),
]

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const normalizedOrigin = origin && normalizeOrigin(origin)
    if (!origin || allowedOrigins.includes(normalizedOrigin) || isVercelProjectOrigin(normalizedOrigin)) {
      callback(null, true)
      return
    }
    callback(new Error('Origin not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Peer Project Hub API is running' })
})

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)

// Error handler
app.use(errorHandler)

// Start server
async function start() {
  await connectDB()
  initializeFirebase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
