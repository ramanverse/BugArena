const User = require('../models/User')
const Report = require('../models/Report')
const Program = require('../models/Program')
const Certificate = require('../models/Certificate')
const Notification = require('../models/Notification')
const { calculateLevel, checkAndAwardBadges } = require('./badge.service')

/** Points awarded per severity level */
const SEVERITY_POINTS = {
  CRITICAL: 500,
  HIGH: 300,
  MEDIUM: 150,
  LOW: 75,
  INFO: 25,
}

/**
 * Core business logic executed when a report's status is changed by an admin.
 *
 * @param {Object} report    - The Mongoose Report document (not yet saved)
 * @param {string} newStatus - The incoming status string
 * @param {string} adminId   - The admin user's ID
 * @param {string} note      - Optional note from admin
 * @returns {Object} report  - Updated and saved report
 */
const processStatusChange = async (report, newStatus, adminId, note = '') => {
  const oldStatus = report.status

  // Push to statusHistory
  report.statusHistory.push({
    status: newStatus,
    changedBy: adminId,
    note,
    changedAt: new Date(),
  })

  report.status = newStatus

  // ── ACCEPTED ────────────────────────────────────────────────
  if (newStatus === 'ACCEPTED' && oldStatus !== 'ACCEPTED') {
    const points = SEVERITY_POINTS[report.severity] || 0
    report.pointsAwarded = points

    // 1. Award points and recalculate level
    const hunter = await User.findById(report.hunterId)
    if (hunter) {
      hunter.totalPoints += points
      hunter.level = calculateLevel(hunter.totalPoints)
      await hunter.save()

      // 2. Increment program bug count
      await Program.findByIdAndUpdate(report.programId, { $inc: { bugsFoundCount: 1 } })

      // 3. Auto-create Certificate
      const program = await Program.findById(report.programId)
      await Certificate.create({
        userId: hunter._id,
        reportId: report._id,
        title: report.title,
        programName: program ? program.name : 'Unknown Program',
        severity: report.severity,
      })

      // 4. Create REPORT_ACCEPTED + POINTS_AWARDED notifications
      await Notification.insertMany([
        {
          userId: hunter._id,
          type: 'REPORT_ACCEPTED',
          message: `✅ Your report "${report.title}" has been accepted!`,
        },
        {
          userId: hunter._id,
          type: 'POINTS_AWARDED',
          message: `🎯 +${points} points awarded for "${report.title}"`,
        },
      ])

      // 5. Check and auto-award badges
      await checkAndAwardBadges(hunter._id, hunter)
    }
  }

  // ── REJECTED or DUPLICATE ───────────────────────────────────
  if ((newStatus === 'REJECTED' || newStatus === 'DUPLICATE') && oldStatus !== newStatus) {
    await Notification.create({
      userId: report.hunterId,
      type: 'REPORT_REJECTED',
      message: `❌ Your report "${report.title}" was marked as ${newStatus}.${note ? ' Note: ' + note : ''}`,
    })
  }

  // ── TRIAGING ────────────────────────────────────────────────
  if (newStatus === 'TRIAGING' && oldStatus !== 'TRIAGING') {
    await Notification.create({
      userId: report.hunterId,
      type: 'REPORT_TRIAGING',
      message: `🔍 Your report "${report.title}" is now being triaged.`,
    })
  }

  await report.save()
  return report
}

module.exports = { processStatusChange, SEVERITY_POINTS }
