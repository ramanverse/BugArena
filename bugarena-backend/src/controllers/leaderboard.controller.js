const { success } = require('../utils/apiResponse')
const { getGlobalLeaderboard, getMonthlyLeaderboard, getCollegeLeaderboard } = require('../services/leaderboard.service')

// GET /api/leaderboard?scope=global|monthly|college&collegeName=&page=&limit=
const getLeaderboard = async (req, res, next) => {
  try {
    const { scope = 'global', collegeName, page = 1, limit = 20 } = req.query
    let result

    switch (scope.toLowerCase()) {
      case 'monthly':
        result = await getMonthlyLeaderboard(Number(page), Number(limit))
        break
      case 'college':
        result = await getCollegeLeaderboard(collegeName, Number(page), Number(limit))
        break
      default:
        result = await getGlobalLeaderboard(Number(page), Number(limit))
    }

    return res.status(200).json({
      success: true,
      data: result.users,
      total: result.total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(result.total / limit),
      scope: scope.toLowerCase(),
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { getLeaderboard }
