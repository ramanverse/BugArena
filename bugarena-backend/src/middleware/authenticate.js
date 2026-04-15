const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { error } = require('../utils/apiResponse')

/**
 * Authenticate middleware — verifies JWT from Bearer header OR httpOnly cookie
 */
const authenticate = async (req, res, next) => {
  try {
    let token = null

    // 1. Try Authorization header
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    }

    // 2. Fall back to cookie
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken
    }

    if (!token) {
      return error(res, 'Authentication required', 401, 'NO_TOKEN')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-passwordHash -refreshToken')

    if (!user) {
      return error(res, 'User not found', 401, 'USER_NOT_FOUND')
    }

    if (user.isBanned) {
      return error(res, 'Account has been banned', 403, 'ACCOUNT_BANNED')
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token expired', 401, 'TOKEN_EXPIRED')
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Invalid token', 401, 'INVALID_TOKEN')
    }
    next(err)
  }
}

module.exports = authenticate
