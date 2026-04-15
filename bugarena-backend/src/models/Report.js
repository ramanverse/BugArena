const mongoose = require('mongoose')

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['PENDING', 'TRIAGING', 'ACCEPTED', 'REJECTED', 'DUPLICATE', 'REWARDED'],
      required: true,
    },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const reportSchema = new mongoose.Schema(
  {
    hunterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    title: { type: String, required: true, trim: true },
    vulnerabilityType: { type: String, required: true, trim: true },
    severity: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'TRIAGING', 'ACCEPTED', 'REJECTED', 'DUPLICATE', 'REWARDED'],
      default: 'PENDING',
    },
    affectedUrl: { type: String, required: true },
    cvssScore: { type: Number, min: 0, max: 10, default: 0 },
    stepsToReproduce: { type: String, required: true },
    impactDescription: { type: String, required: true },
    pocVideoUrl: { type: String, default: '' },
    screenshotUrls: [{ type: String }],
    pointsAwarded: { type: Number, default: 0 },
    isDraft: { type: Boolean, default: false },
    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
)

reportSchema.index({ hunterId: 1, status: 1 })
reportSchema.index({ programId: 1, status: 1 })
reportSchema.index({ severity: 1 })
reportSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Report', reportSchema)
