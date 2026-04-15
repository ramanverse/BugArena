const User = require('../models/User')
const Badge = require('../models/Badge')
const UserBadge = require('../models/UserBadge')
const Notification = require('../models/Notification')
const Report = require('../models/Report')

/** Calculate level string from total points */
const calculateLevel = (points) => {
  if (points >= 5000) return 'LEGEND'
  if (points >= 1500) return 'ELITE'
  if (points >= 500) return 'HUNTER'
  if (points >= 100) return 'SCOUT'
  return 'NEWBIE'
}

/**
 * Award a badge if not already earned. Returns the badge doc or null.
 */
const awardBadgeIfNew = async (userId, badgeName) => {
  const badge = await Badge.findOne({ name: badgeName })
  if (!badge) return null

  const already = await UserBadge.findOne({ userId, badgeId: badge._id })
  if (already) return null

  await UserBadge.create({ userId, badgeId: badge._id })

  await Notification.create({
    userId,
    type: 'BADGE_EARNED',
    message: `🏅 You earned the "${badge.name}" badge!`,
  })

  return badge
}

/**
 * Run all badge checks for a given hunter after a report is accepted.
 * Returns array of newly awarded badge names.
 */
const checkAndAwardBadges = async (userId, user) => {
  const awarded = []

  // "First Blood" — first accepted report ever
  const acceptedCount = await Report.countDocuments({ hunterId: userId, status: 'ACCEPTED' })
  if (acceptedCount === 1) {
    const b = await awardBadgeIfNew(userId, 'First Blood')
    if (b) awarded.push(b.name)
  }

  // "Bug Slayer" — 10 accepted reports
  if (acceptedCount >= 10) {
    const b = await awardBadgeIfNew(userId, 'Bug Slayer')
    if (b) awarded.push(b.name)
  }

  // "Critical Hit" — first accepted CRITICAL
  const criticalCount = await Report.countDocuments({
    hunterId: userId,
    status: 'ACCEPTED',
    severity: 'CRITICAL',
  })
  if (criticalCount === 1) {
    const b = await awardBadgeIfNew(userId, 'Critical Hit')
    if (b) awarded.push(b.name)
  }

  // "Elite Hunter" — level is ELITE
  if (user.level === 'ELITE') {
    const b = await awardBadgeIfNew(userId, 'Elite Hunter')
    if (b) awarded.push(b.name)
  }

  // "Legend" — level is LEGEND
  if (user.level === 'LEGEND') {
    const b = await awardBadgeIfNew(userId, 'Legend')
    if (b) awarded.push(b.name)
  }

  return awarded
}

module.exports = { calculateLevel, awardBadgeIfNew, checkAndAwardBadges }
