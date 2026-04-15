const mongoose = require('mongoose')

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  },
  { timestamps: true }
)

// each user can bookmark a program only once
bookmarkSchema.index({ userId: 1, programId: 1 }, { unique: true })

module.exports = mongoose.model('Bookmark', bookmarkSchema)
