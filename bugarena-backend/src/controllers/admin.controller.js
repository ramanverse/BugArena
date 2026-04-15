const User = require('../models/User')
const Program = require('../models/Program')
const Report = require('../models/Report')
const { success, error, paginated } = require('../utils/apiResponse')

// GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalReports,
      totalPrograms,
      acceptedReports,
      rejectedReports,
      pendingReports,
      activePrograms,
    ] = await Promise.all([
      User.countDocuments({ role: 'HUNTER' }),
      Report.countDocuments({ isDraft: false }),
      Program.countDocuments(),
      Report.countDocuments({ status: 'ACCEPTED' }),
      Report.countDocuments({ status: 'REJECTED' }),
      Report.countDocuments({ status: 'PENDING' }),
      Program.countDocuments({ isApproved: true, isActive: true }),
    ])

    // Total points given
    const pointsAgg = await Report.aggregate([
      { $match: { status: 'ACCEPTED' } },
      { $group: { _id: null, total: { $sum: '$pointsAwarded' } } },
    ])
    const totalPointsGiven = pointsAgg[0]?.total || 0
    const acceptanceRate = totalReports > 0 ? ((acceptedReports / totalReports) * 100).toFixed(1) : '0.0'

    return success(res, {
      stats: {
        totalUsers,
        totalReports,
        totalPrograms,
        activePrograms,
        acceptedReports,
        rejectedReports,
        pendingReports,
        acceptanceRate: `${acceptanceRate}%`,
        totalPointsGiven,
      },
    }, 'Admin stats fetched')
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/reports
const getAllReports = async (req, res, next) => {
  try {
    const { status, severity, programId, hunterId, sort = 'createdAt', dir = -1, page = 1, limit = 20 } = req.query
    const query = { isDraft: false }

    if (status) query.status = status.toUpperCase()
    if (severity) query.severity = severity.toUpperCase()
    if (programId) query.programId = programId
    if (hunterId) query.hunterId = hunterId

    const skip = (page - 1) * limit
    const sortObj = { [sort]: Number(dir) || -1 }

    const [reports, total] = await Promise.all([
      Report.find(query)
        .populate('hunterId', 'fullName email avatarUrl collegeName')
        .populate('programId', 'name slug')
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit)),
      Report.countDocuments(query),
    ])

    return paginated(res, reports, total, page, limit)
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const { role, isBanned, search, page = 1, limit = 20 } = req.query
    const query = {}

    if (role) query.role = role.toUpperCase()
    if (isBanned !== undefined) query.isBanned = isBanned === 'true'
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { collegeName: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ])

    return paginated(res, users, total, page, limit)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/admin/users/:id/ban — toggle ban
const toggleBanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return error(res, 'User not found', 404, 'NOT_FOUND')
    if (user.role === 'ADMIN') return error(res, 'Cannot ban an admin', 400, 'CANNOT_BAN_ADMIN')

    user.isBanned = !user.isBanned
    if (user.isBanned) user.refreshToken = null // invalidate sessions
    await user.save()

    return success(res, { user }, user.isBanned ? 'User banned' : 'User unbanned')
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/programs
const getAllPrograms = async (req, res, next) => {
  try {
    const { isApproved, page = 1, limit = 20 } = req.query
    const query = {}
    if (isApproved !== undefined) query.isApproved = isApproved === 'true'

    const skip = (page - 1) * limit
    const [programs, total] = await Promise.all([
      Program.find(query)
        .populate('ownerId', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Program.countDocuments(query),
    ])

    return paginated(res, programs, total, page, limit)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/admin/programs/:id/approve
const approveProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true })
    if (!program) return error(res, 'Program not found', 404, 'NOT_FOUND')
    return success(res, { program }, 'Program approved')
  } catch (err) {
    next(err)
  }
}

// PATCH /api/admin/programs/:id/reject
const rejectProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, { isApproved: false, isActive: false }, { new: true })
    if (!program) return error(res, 'Program not found', 404, 'NOT_FOUND')
    return success(res, { program }, 'Program rejected')
  } catch (err) {
    next(err)
  }
}

module.exports = { getStats, getAllReports, getAllUsers, toggleBanUser, getAllPrograms, approveProgram, rejectProgram }
