const router = require('express').Router()
const { getLeaderboard } = require('../controllers/leaderboard.controller')

// GET /api/leaderboard?scope=global|monthly|college&collegeName=&page=&limit=
router.get('/', getLeaderboard)

module.exports = router
