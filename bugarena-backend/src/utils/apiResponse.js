/**
 * Standardised API response helpers
 */

const success = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data })
}

const created = (res, data = {}, message = 'Created') => {
  return res.status(201).json({ success: true, message, data })
}

const paginated = (res, data, total, page, limit) => {
  return res.status(200).json({
    success: true,
    data,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  })
}

const error = (res, message = 'Something went wrong', statusCode = 500, code = 'INTERNAL_ERROR') => {
  return res.status(statusCode).json({ success: false, message, code })
}

module.exports = { success, created, paginated, error }
