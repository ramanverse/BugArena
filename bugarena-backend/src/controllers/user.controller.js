const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const UserBadge = require('../models/UserBadge')
const Certificate = require('../models/Certificate')
const Notification = require('../models/Notification')
const { success, error, paginated } = require('../utils/apiResponse')

// GET /api/users/:username — public profile
const getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params
    // username = email prefix before @
    const user = await User.findOne({ email: { $regex: `^${username}@`, $options: 'i' } })
      .select('-passwordHash -refreshToken -passwordResetToken -passwordResetExpires -isBanned')

    if (!user) return error(res, 'User not found', 404, 'USER_NOT_FOUND')

    const badges = await UserBadge.find({ userId: user._id }).populate('badgeId')
    const recentReports = req.app.locals.Report
      ? [] // filled below
      : []

    // Populate recent accepted reports
    const Report = require('../models/Report')
    const recent = await Report.find({ hunterId: user._id, status: 'ACCEPTED', isDraft: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('programId', 'name slug')

    return success(res, { user, badges, recentReports: recent }, 'Profile fetched')
  } catch (err) {
    next(err)
  }
}

// PUT /api/users/me — update own profile
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400, 'VALIDATION_ERROR')

    const allowed = ['fullName', 'collegeName', 'bio', 'githubUrl', 'linkedinUrl', 'twitterUrl']
    const updates = {}
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f] })

    if (req.file) updates.avatarUrl = req.file.path // Cloudinary URL

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
    return success(res, { user }, 'Profile updated')
  } catch (err) {
    next(err)
  }
}

// PUT /api/users/me/password
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+passwordHash')

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) return error(res, 'Current password is incorrect', 400, 'WRONG_PASSWORD')

    user.passwordHash = await bcrypt.hash(newPassword, 12)
    user.refreshToken = null
    await user.save()

    return success(res, {}, 'Password updated. Please log in again.')
  } catch (err) {
    next(err)
  }
}

// DELETE /api/users/me
const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id)
    return success(res, {}, 'Account deleted')
  } catch (err) {
    next(err)
  }
}

// GET /api/users/me/badges
const getMyBadges = async (req, res, next) => {
  try {
    const badges = await UserBadge.find({ userId: req.user._id })
      .populate('badgeId')
      .sort({ earnedAt: -1 })
    return success(res, { badges }, 'Badges fetched')
  } catch (err) {
    next(err)
  }
}

// GET /api/users/me/certificates
const getMyCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find({ userId: req.user._id })
      .populate('reportId', 'title severity')
      .sort({ issuedAt: -1 })
    return success(res, { certificates: certs }, 'Certificates fetched')
  } catch (err) {
    next(err)
  }
}

// GET /api/users/me/notifications
const getMyNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const [notifications, total] = await Promise.all([
      Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ userId: req.user._id }),
    ])

    return paginated(res, notifications, total, page, limit)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/users/me/notifications/:id/read
const markNotificationRead = async (req, res, next) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    )
    if (!notif) return error(res, 'Notification not found', 404, 'NOT_FOUND')
    return success(res, { notification: notif }, 'Marked as read')
  } catch (err) {
    next(err)
  }
}

// PATCH /api/users/me/notifications/read-all
const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true })
    return success(res, {}, 'All notifications marked as read')
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getPublicProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
  getMyBadges,
  getMyCertificates,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
}
