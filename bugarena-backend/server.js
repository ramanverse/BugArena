require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const connectDB = require('./src/config/db')
const errorHandler = require('./src/middleware/errorHandler')
const { generalLimiter } = require('./src/middleware/rateLimiter')

// Route files
const authRoutes = require('./src/routes/auth.routes')
const userRoutes = require('./src/routes/user.routes')
const programRoutes = require('./src/routes/program.routes')
const reportRoutes = require('./src/routes/report.routes')
const leaderboardRoutes = require('./src/routes/leaderboard.routes')
const uploadRoutes = require('./src/routes/upload.routes')
const adminRoutes = require('./src/routes/admin.routes')

const app = express()

// ── Security headers ─────────────────────────────────────────
app.use(helmet())

// ── CORS ─────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: Origin ${origin} not allowed`))
  },
  credentials: true,
}))

// ── Body parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// ── Logger (dev only) ─────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// ── Global rate limiter ───────────────────────────────────────
app.use(generalLimiter)

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'BugArena API is running', timestamp: new Date().toISOString() })
})

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/programs', programRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/admin', adminRoutes)

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found`, code: 'NOT_FOUND' })
})

// ── Global error handler (MUST be last) ──────────────────────
app.use(errorHandler)

// ── Start server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`[SERVER] BugArena API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`)
  })
}

startServer()

module.exports = app
