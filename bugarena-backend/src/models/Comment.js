const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

commentSchema.index({ reportId: 1, createdAt: 1 })

module.exports = mongoose.model('Comment', commentSchema)
