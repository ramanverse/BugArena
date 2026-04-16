const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const { generateAccessToken, generateRefreshToken, setRefreshCookie, clearRefreshCookie } = require('../utils/generateToken')
const { success, created, error } = require('../utils/apiResponse')
const { sendPasswordReset, sendWelcome } = require('../services/email.service')

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400, 'VALIDATION_ERROR')

    const { fullName, email, password, role, collegeName } = req.body

    const exists = await User.findOne({ email })
    if (exists) return error(res, 'Email already registered', 409, 'EMAIL_EXISTS')

    const passwordHash = await bcrypt.hash(password, 8)
    const allowedRoles = ['HUNTER', 'PROGRAM_OWNER']
    const userRole = allowedRoles.includes(role) ? role : 'HUNTER'

    const user = await User.create({ fullName, email, passwordHash, role: userRole, collegeName: collegeName || '' })

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    user.refreshToken = refreshToken
    await user.save()
    setRefreshCookie(res, refreshToken)

    sendWelcome(email, fullName).catch(console.error)

    return created(res, { user, accessToken }, 'Registration successful')
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400, 'VALIDATION_ERROR')

    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user) return error(res, 'Invalid credentials', 401, 'INVALID_CREDENTIALS')

    if (user.isBanned) return error(res, 'Account has been banned', 403, 'ACCOUNT_BANNED')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return error(res, 'Invalid credentials', 401, 'INVALID_CREDENTIALS')

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    user.refreshToken = refreshToken
    await user.save()
    setRefreshCookie(res, refreshToken)

    return success(res, { user, accessToken }, 'Login successful')
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null })
    }
    clearRefreshCookie(res)
    return success(res, {}, 'Logged out successfully')
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/refresh-token
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) return error(res, 'Refresh token required', 401, 'NO_REFRESH_TOKEN')

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch {
      return error(res, 'Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN')
    }

    const user = await User.findById(decoded.id)
    if (!user || user.refreshToken !== token) {
      return error(res, 'Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN')
    }

    const newAccessToken = generateAccessToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)
    user.refreshToken = newRefreshToken
    await user.save()
    setRefreshCookie(res, newRefreshToken)

    return success(res, { accessToken: newAccessToken }, 'Token refreshed')
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    // Always return success to prevent user enumeration
    if (!user) return success(res, {}, 'If that email exists, a reset link was sent')

    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    user.passwordResetToken = hashedToken
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await user.save()

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    await sendPasswordReset(email, resetUrl)

    return success(res, {}, 'If that email exists, a reset link was sent')
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) return error(res, 'Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN')

    user.passwordHash = await bcrypt.hash(password, 8)
    user.passwordResetToken = null
    user.passwordResetExpires = null
    user.refreshToken = null
    await user.save()
    clearRefreshCookie(res)

    return success(res, {}, 'Password reset successful')
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    return success(res, { user }, 'User profile fetched')
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, logout, refreshToken, forgotPassword, resetPassword, getMe }
