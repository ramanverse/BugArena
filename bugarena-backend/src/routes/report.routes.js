const router = require('express').Router()
const { body } = require('express-validator')
const {
  getReports, getReportById, submitReport, updateReport,
  changeReportStatus, getComments, addComment,
} = require('../controllers/report.controller')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')
const { uploadScreenshots } = require('../middleware/upload')

const submitRules = [
  body('programId').notEmpty().withMessage('Program ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('vulnerabilityType').trim().notEmpty().withMessage('Vulnerability type is required'),
  body('severity').isIn(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']).withMessage('Invalid severity'),
  body('affectedUrl').notEmpty().withMessage('Affected URL is required'),
  body('stepsToReproduce').trim().isLength({ min: 20 }).withMessage('Steps to reproduce must be at least 20 chars'),
  body('impactDescription').trim().notEmpty().withMessage('Impact description is required'),
]

const statusRules = [
  body('status').isIn(['PENDING', 'TRIAGING', 'ACCEPTED', 'REJECTED', 'DUPLICATE', 'REWARDED'])
    .withMessage('Invalid status value'),
]

router.use(authenticate)

router.get('/', getReports)
router.get('/:id', getReportById)
router.post('/', uploadScreenshots.array('screenshots', 10), submitRules, submitReport)
router.put('/:id', uploadScreenshots.array('screenshots', 10), updateReport)
router.patch('/:id/status', authorize('ADMIN'), statusRules, changeReportStatus)
router.get('/:id/comments', getComments)
router.post('/:id/comments', addComment)

module.exports = router
