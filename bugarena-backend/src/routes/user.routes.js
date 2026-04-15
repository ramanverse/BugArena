const router = require('express').Router()
const {
  getPublicProfile, updateProfile, updatePassword, deleteAccount,
  getMyBadges, getMyCertificates, getMyNotifications,
  markNotificationRead, markAllNotificationsRead,
} = require('../controllers/user.controller')
const authenticate = require('../middleware/authenticate')

// Public — profile by username
router.get('/:username', getPublicProfile)

// All below require auth
router.use(authenticate)

router.put('/me', updateProfile)
router.put('/me/password', updatePassword)
router.delete('/me', deleteAccount)
router.get('/me/badges', getMyBadges)
router.get('/me/certificates', getMyCertificates)
router.get('/me/notifications', getMyNotifications)
router.patch('/me/notifications/read-all', markAllNotificationsRead)
router.patch('/me/notifications/:id/read', markNotificationRead)

module.exports = router
