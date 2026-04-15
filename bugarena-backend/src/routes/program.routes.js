const router = require('express').Router()
const { body } = require('express-validator')
const {
  getPrograms, getProgramBySlug, createProgram,
  updateProgram, deleteProgram, toggleBookmark,
} = require('../controllers/program.controller')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

const createRules = [
  body('name').trim().notEmpty().withMessage('Program name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
]

// Public list + individual (authenticate optional for bookmark status)
router.get('/', (req, res, next) => {
  // Try to authenticate but don't block if no token
  const auth = require('../middleware/authenticate')
  const jwt = require('jsonwebtoken')
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const User = require('../models/User')
      User.findById(decoded.id).then((user) => { if (user) req.user = user; next() }).catch(() => next())
    } catch { next() }
  } else { next() }
}, getPrograms)

router.get('/:slug', (req, res, next) => {
  const jwt = require('jsonwebtoken')
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const User = require('../models/User')
      User.findById(decoded.id).then((user) => { if (user) req.user = user; next() }).catch(() => next())
    } catch { next() }
  } else { next() }
}, getProgramBySlug)

// Authenticated routes
router.post('/', authenticate, authorize('PROGRAM_OWNER', 'ADMIN'), createRules, createProgram)
router.put('/:id', authenticate, authorize('PROGRAM_OWNER', 'ADMIN'), updateProgram)
router.delete('/:id', authenticate, authorize('PROGRAM_OWNER', 'ADMIN'), deleteProgram)
router.post('/:id/bookmark', authenticate, toggleBookmark)

module.exports = router
