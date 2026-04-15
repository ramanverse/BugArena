const { error } = require('../utils/apiResponse')

/**
 * Role-based access control middleware
 * Usage: authorize('ADMIN')  OR  authorize('ADMIN', 'PROGRAM_OWNER')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication required', 401, 'NO_TOKEN')
    }
    if (!roles.includes(req.user.role)) {
      return error(
        res,
        `Access denied. Required roles: ${roles.join(', ')}`,
        403,
        'FORBIDDEN'
      )
    }
    next()
  }
}

module.exports = authorize
