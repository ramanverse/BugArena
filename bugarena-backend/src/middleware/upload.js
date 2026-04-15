const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

// ── Avatar storage ─────────────────────────────────────────
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bugarena/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  },
})

// ── Screenshot storage ────────────────────────────────────
const screenshotStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bugarena/screenshots',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1920, crop: 'limit' }],
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /image\/(jpeg|jpg|png|gif|webp)/
  if (allowed.test(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
})

const uploadScreenshots = multer({
  storage: screenshotStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
})

module.exports = { uploadAvatar, uploadScreenshots }
