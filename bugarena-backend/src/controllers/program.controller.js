const { validationResult } = require('express-validator')
const Program = require('../models/Program')
const Bookmark = require('../models/Bookmark')
const { slugify } = require('../utils/slugify')
const { success, created, error, paginated } = require('../utils/apiResponse')

// GET /api/programs
const getPrograms = async (req, res, next) => {
  try {
    const {
      search, difficulty, category,
      rewardMin, rewardMax,
      page = 1, limit = 12,
    } = req.query

    const query = { isApproved: true, isActive: true }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ]
    }
    if (difficulty) query.difficulty = difficulty.toUpperCase()
    if (category) query.category = category.toUpperCase()
    if (rewardMin) query['rewards.critical'] = { $gte: Number(rewardMin) }
    if (rewardMax) query['rewards.critical'] = { ...query['rewards.critical'], $lte: Number(rewardMax) }

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

// GET /api/programs/:slug
const getProgramBySlug = async (req, res, next) => {
  try {
    const program = await Program.findOne({ slug: req.params.slug })
      .populate('ownerId', 'fullName email avatarUrl')

    if (!program) return error(res, 'Program not found', 404, 'NOT_FOUND')

    // Attach bookmark status if authenticated
    let bookmarked = false
    if (req.user) {
      const bm = await Bookmark.findOne({ userId: req.user._id, programId: program._id })
      bookmarked = !!bm
    }

    return success(res, { program, bookmarked }, 'Program fetched')
  } catch (err) {
    next(err)
  }
}

// POST /api/programs
const createProgram = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400, 'VALIDATION_ERROR')

    const { name, description, companyName, category, difficulty, rewards, scopeUrls, outOfScopeUrls, tags, deadline } = req.body

    // Generate unique slug
    let slug = slugify(name)
    const existing = await Program.findOne({ slug })
    if (existing) slug = slugify(name, true)

    const program = await Program.create({
      ownerId: req.user._id,
      name,
      slug,
      description,
      companyName,
      category: category?.toUpperCase() || 'WEB',
      difficulty: difficulty?.toUpperCase() || 'MEDIUM',
      rewards: rewards || {},
      scopeUrls: scopeUrls || [],
      outOfScopeUrls: outOfScopeUrls || [],
      tags: tags || [],
      deadline: deadline || null,
    })

    return created(res, { program }, 'Program created and pending approval')
  } catch (err) {
    next(err)
  }
}

// PUT /api/programs/:id
const updateProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id)
    if (!program) return error(res, 'Program not found', 404, 'NOT_FOUND')
    if (program.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return error(res, 'Not authorized', 403, 'FORBIDDEN')
    }

    const allowed = ['name', 'description', 'companyName', 'category', 'difficulty', 'rewards', 'scopeUrls', 'outOfScopeUrls', 'tags', 'deadline', 'isActive']
    allowed.forEach((f) => { if (req.body[f] !== undefined) program[f] = req.body[f] })
    if (req.file) program.logoUrl = req.file.path

    await program.save()
    return success(res, { program }, 'Program updated')
  } catch (err) {
    next(err)
  }
}

// DELETE /api/programs/:id
const deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id)
    if (!program) return error(res, 'Program not found', 404, 'NOT_FOUND')
    if (program.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return error(res, 'Not authorized', 403, 'FORBIDDEN')
    }
    await program.deleteOne()
    return success(res, {}, 'Program deleted')
  } catch (err) {
    next(err)
  }
}

// POST /api/programs/:id/bookmark — toggle
const toggleBookmark = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id)
    if (!program) return error(res, 'Program not found', 404, 'NOT_FOUND')

    const existing = await Bookmark.findOne({ userId: req.user._id, programId: program._id })
    if (existing) {
      await existing.deleteOne()
      return success(res, { bookmarked: false }, 'Bookmark removed')
    }
    await Bookmark.create({ userId: req.user._id, programId: program._id })
    return success(res, { bookmarked: true }, 'Program bookmarked')
  } catch (err) {
    next(err)
  }
}

module.exports = { getPrograms, getProgramBySlug, createProgram, updateProgram, deleteProgram, toggleBookmark }
