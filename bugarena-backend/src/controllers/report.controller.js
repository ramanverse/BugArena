const { validationResult } = require('express-validator')
const Report = require('../models/Report')
const Comment = require('../models/Comment')
const Program = require('../models/Program')
const { processStatusChange } = require('../services/report.service')
const { success, created, error, paginated } = require('../utils/apiResponse')

// GET /api/reports
const getReports = async (req, res, next) => {
  try {
    const { status, severity, programId, page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit
    const query = { isDraft: false }

    // HUNTER sees only own reports; ADMIN sees all
    if (req.user.role === 'HUNTER') query.hunterId = req.user._id
    // PROGRAM_OWNER sees reports for their programs
    if (req.user.role === 'PROGRAM_OWNER') {
      const myPrograms = await Program.find({ ownerId: req.user._id }).select('_id')
      query.programId = { $in: myPrograms.map((p) => p._id) }
    }

    if (status) query.status = status.toUpperCase()
    if (severity) query.severity = severity.toUpperCase()
    if (programId) query.programId = programId

    const [reports, total] = await Promise.all([
      Report.find(query)
        .populate('hunterId', 'fullName email avatarUrl level')
        .populate('programId', 'name slug logoUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Report.countDocuments(query),
    ])

    return paginated(res, reports, total, page, limit)
  } catch (err) {
    next(err)
  }
}

// GET /api/reports/:id
const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('hunterId', 'fullName email avatarUrl level')
      .populate('programId', 'name slug logoUrl companyName')
      .populate('statusHistory.changedBy', 'fullName role')

    if (!report) return error(res, 'Report not found', 404, 'NOT_FOUND')

    // Hunters can only see own reports
    if (req.user.role === 'HUNTER' && report.hunterId._id.toString() !== req.user._id.toString()) {
      return error(res, 'Access denied', 403, 'FORBIDDEN')
    }

    return success(res, { report }, 'Report fetched')
  } catch (err) {
    next(err)
  }
}

// POST /api/reports — supports multipart w/ screenshots
const submitReport = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400, 'VALIDATION_ERROR')

    const {
      programId, title, vulnerabilityType, severity,
      affectedUrl, cvssScore, stepsToReproduce, impactDescription,
      pocVideoUrl, isDraft,
    } = req.body

    const program = await Program.findOne({ _id: programId, isApproved: true, isActive: true })
    if (!program) return error(res, 'Program not found or not accepting reports', 404, 'PROGRAM_NOT_FOUND')

    const screenshotUrls = req.files ? req.files.map((f) => f.path) : []

    const report = await Report.create({
      hunterId: req.user._id,
      programId,
      title,
      vulnerabilityType,
      severity: severity.toUpperCase(),
      affectedUrl,
      cvssScore: Number(cvssScore) || 0,
      stepsToReproduce,
      impactDescription,
      pocVideoUrl: pocVideoUrl || '',
      screenshotUrls,
      isDraft: isDraft === 'true' || isDraft === true,
      statusHistory: [{
        status: 'PENDING',
        changedBy: req.user._id,
        note: 'Report submitted',
        changedAt: new Date(),
      }],
    })

    return created(res, { report }, isDraft ? 'Draft saved' : 'Report submitted successfully')
  } catch (err) {
    next(err)
  }
}

// PUT /api/reports/:id — update own draft only
const updateReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) return error(res, 'Report not found', 404, 'NOT_FOUND')
    if (report.hunterId.toString() !== req.user._id.toString()) return error(res, 'Not authorized', 403, 'FORBIDDEN')
    if (!report.isDraft) return error(res, 'Only drafts can be edited', 400, 'NOT_DRAFT')

    const allowed = ['title', 'vulnerabilityType', 'severity', 'affectedUrl', 'cvssScore', 'stepsToReproduce', 'impactDescription', 'pocVideoUrl', 'isDraft']
    allowed.forEach((f) => { if (req.body[f] !== undefined) report[f] = req.body[f] })
    if (req.files?.length) report.screenshotUrls = [...report.screenshotUrls, ...req.files.map((f) => f.path)]

    await report.save()
    return success(res, { report }, 'Report updated')
  } catch (err) {
    next(err)
  }
}

// PATCH /api/reports/:id/status — ADMIN only
const changeReportStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400, 'VALIDATION_ERROR')

    const { status, note } = req.body
    const report = await Report.findById(req.params.id)
    if (!report) return error(res, 'Report not found', 404, 'NOT_FOUND')

    const VALID_STATUSES = ['PENDING', 'TRIAGING', 'ACCEPTED', 'REJECTED', 'DUPLICATE', 'REWARDED']
    if (!VALID_STATUSES.includes(status.toUpperCase())) {
      return error(res, 'Invalid status', 400, 'INVALID_STATUS')
    }

    const updated = await processStatusChange(report, status.toUpperCase(), req.user._id, note || '')
    await updated.populate('hunterId', 'fullName email')
    await updated.populate('programId', 'name slug')

    return success(res, { report: updated }, `Report status changed to ${status.toUpperCase()}`)
  } catch (err) {
    next(err)
  }
}

// GET /api/reports/:id/comments
const getComments = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) return error(res, 'Report not found', 404, 'NOT_FOUND')

    if (req.user.role === 'HUNTER' && report.hunterId.toString() !== req.user._id.toString()) {
      return error(res, 'Access denied', 403, 'FORBIDDEN')
    }

    const comments = await Comment.find({ reportId: req.params.id })
      .populate('authorId', 'fullName email avatarUrl role')
      .sort({ createdAt: 1 })

    return success(res, { comments }, 'Comments fetched')
  } catch (err) {
    next(err)
  }
}

// POST /api/reports/:id/comments
const addComment = async (req, res, next) => {
  try {
    const { body } = req.body
    if (!body?.trim()) return error(res, 'Comment body is required', 400, 'VALIDATION_ERROR')

    const report = await Report.findById(req.params.id)
    if (!report) return error(res, 'Report not found', 404, 'NOT_FOUND')

    if (req.user.role === 'HUNTER' && report.hunterId.toString() !== req.user._id.toString()) {
      return error(res, 'Access denied', 403, 'FORBIDDEN')
    }

    const comment = await Comment.create({ reportId: req.params.id, authorId: req.user._id, body: body.trim() })
    await comment.populate('authorId', 'fullName email avatarUrl role')

    return created(res, { comment }, 'Comment added')
  } catch (err) {
    next(err)
  }
}

module.exports = { getReports, getReportById, submitReport, updateReport, changeReportStatus, getComments, addComment }
