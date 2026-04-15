const rateLimit = require('express-rate-limit')

/**
 * General rate limiter: 100 requests per 15 minutes
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.', code: 'RATE_LIMIT_EXCEEDED' },
})

/**
 * Strict limiter for auth routes: 10 requests per 15 minutes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again later.', code: 'AUTH_RATE_LIMIT_EXCEEDED' },
})

module.exports = { generalLimiter, authLimiter }
