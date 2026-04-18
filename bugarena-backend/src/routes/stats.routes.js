const router = require('express').Router()
const { getStats } = require('../controllers/admin.controller')

// GET /api/stats (Public)
router.get('/', getStats)

module.exports = router
