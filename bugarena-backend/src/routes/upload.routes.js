const router = require('express').Router()
const { uploadAvatar, uploadScreenshot } = require('../controllers/upload.controller')
const authenticate = require('../middleware/authenticate')
const { uploadAvatar: avatarMiddleware, uploadScreenshots: screenshotMiddleware } = require('../middleware/upload')

router.use(authenticate)

// POST /api/uploads/avatar
router.post('/avatar', avatarMiddleware.single('avatar'), uploadAvatar)

// POST /api/uploads/screenshot
router.post('/screenshot', screenshotMiddleware.single('screenshot'), uploadScreenshot)

module.exports = router
