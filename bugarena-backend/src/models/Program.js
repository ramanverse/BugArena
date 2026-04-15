const mongoose = require('mongoose')

const programSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logoUrl: { type: String, default: '' },
    description: { type: String, required: true },
    companyName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['WEB', 'MOBILE', 'API', 'NETWORK', 'HARDWARE', 'OTHER'],
      default: 'WEB',
    },
    difficulty: {
      type: String,
      enum: ['EASY', 'MEDIUM', 'HARD'],
      default: 'MEDIUM',
    },
    rewards: {
      critical: { type: Number, default: 0 },
      high: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      low: { type: Number, default: 0 },
      info: { type: Number, default: 0 },
    },
    deadline: { type: Date, default: null },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    scopeUrls: [{ type: String }],
    outOfScopeUrls: [{ type: String }],
    tags: [{ type: String }],
    bugsFoundCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Index for search
programSchema.index({ name: 'text', description: 'text', companyName: 'text' })
programSchema.index({ isApproved: 1, isActive: 1 })
// Note: slug already has a unique index from { unique: true } field definition

module.exports = mongoose.model('Program', programSchema)
