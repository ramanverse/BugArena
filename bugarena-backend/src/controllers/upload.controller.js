const { success, error } = require('../utils/apiResponse')

// POST /api/uploads/avatar
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400, 'NO_FILE')
    const avatarUrl = req.file.path // Cloudinary secure URL
    return success(res, { avatarUrl }, 'Avatar uploaded')
  } catch (err) {
    next(err)
  }
}

// POST /api/uploads/screenshot
const uploadScreenshot = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400, 'NO_FILE')
    const screenshotUrl = req.file.path
    return success(res, { screenshotUrl }, 'Screenshot uploaded')
  } catch (err) {
    next(err)
  }
}

module.exports = { uploadAvatar, uploadScreenshot }
