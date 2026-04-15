const router = require('express').Router()
const {
  getStats, getAllReports, getAllUsers, toggleBanUser,
  getAllPrograms, approveProgram, rejectProgram,
} = require('../controllers/admin.controller')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

router.use(authenticate, authorize('ADMIN'))

router.get('/stats', getStats)
router.get('/reports', getAllReports)
router.get('/users', getAllUsers)
router.patch('/users/:id/ban', toggleBanUser)
router.get('/programs', getAllPrograms)
router.patch('/programs/:id/approve', approveProgram)
router.patch('/programs/:id/reject', rejectProgram)

module.exports = router
