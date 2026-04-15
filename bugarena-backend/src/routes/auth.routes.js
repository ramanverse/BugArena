const router = require('express').Router()
const { body } = require('express-validator')
const { register, login, logout, refreshToken, forgotPassword, resetPassword, getMe } = require('../controllers/auth.controller')
const authenticate = require('../middleware/authenticate')
const { authLimiter } = require('../middleware/rateLimiter')

const registerRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

router.post('/register', authLimiter, registerRules, register)
router.post('/login', authLimiter, loginRules, login)
router.post('/logout', authenticate, logout)
router.post('/refresh-token', authLimiter, refreshToken)
router.post('/forgot-password', authLimiter, body('email').isEmail(), forgotPassword)
router.post('/reset-password/:token', authLimiter, body('password').isLength({ min: 8 }), resetPassword)
router.get('/me', authenticate, getMe)

module.exports = router
