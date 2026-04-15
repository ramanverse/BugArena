const User = require('../models/User')
const Report = require('../models/Report')

/**
 * Global leaderboard — sort users by totalPoints DESC, attach rank position
 */
const getGlobalLeaderboard = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit
  const total = await User.countDocuments({ role: 'HUNTER', isBanned: false })

  const users = await User.find({ role: 'HUNTER', isBanned: false })
    .select('fullName email collegeName avatarUrl totalPoints level rank createdAt')
    .sort({ totalPoints: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  // Attach rank based on position in sorted list
  const ranked = users.map((u, i) => ({
    ...u,
    rank: skip + i + 1,
  }))

  return { users: ranked, total }
}

/**
 * Monthly leaderboard — aggregate reports accepted in current calendar month
 */
const getMonthlyLeaderboard = async (page = 1, limit = 20) => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const skip = (page - 1) * limit

  const pipeline = [
    {
      $match: {
        status: 'ACCEPTED',
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: '$hunterId',
        monthlyPoints: { $sum: '$pointsAwarded' },
        reportsCount: { $sum: 1 },
      },
    },
    { $sort: { monthlyPoints: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    { $match: { 'user.isBanned': false } },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        fullName: '$user.fullName',
        email: '$user.email',
        collegeName: '$user.collegeName',
        avatarUrl: '$user.avatarUrl',
        level: '$user.level',
        monthlyPoints: 1,
        reportsCount: 1,
      },
    },
  ]

  const totalResult = await Report.aggregate([...pipeline.slice(0, 4)])
  const total = totalResult.length

  const results = await Report.aggregate([
    ...pipeline,
    { $skip: skip },
    { $limit: limit },
  ])

  const ranked = results.map((u, i) => ({ ...u, rank: skip + i + 1 }))
  return { users: ranked, total }
}

/**
 * College leaderboard — group hunters by collegeName, sort by sum of totalPoints
 */
const getCollegeLeaderboard = async (collegeName, page = 1, limit = 20) => {
  const skip = (page - 1) * limit

  const matchQuery = { role: 'HUNTER', isBanned: false }
  if (collegeName) matchQuery.collegeName = { $regex: collegeName, $options: 'i' }

  const pipeline = [
    { $match: matchQuery },
    {
      $group: {
        _id: '$collegeName',
        totalPoints: { $sum: '$totalPoints' },
        memberCount: { $sum: 1 },
        topHunter: { $first: '$fullName' },
      },
    },
    { $sort: { totalPoints: -1 } },
  ]

  const totalResult = await User.aggregate(pipeline)
  const total = totalResult.length

  const results = await User.aggregate([
    ...pipeline,
    { $skip: skip },
    { $limit: limit },
  ])

  const ranked = results.map((c, i) => ({ ...c, rank: skip + i + 1, college: c._id }))
  return { users: ranked, total }
}

module.exports = { getGlobalLeaderboard, getMonthlyLeaderboard, getCollegeLeaderboard }
