const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'REPORT_ACCEPTED',
        'REPORT_REJECTED',
        'REPORT_TRIAGING',
        'BADGE_EARNED',
        'POINTS_AWARDED',
        'ANNOUNCEMENT',
      ],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 })

module.exports = mongoose.model('Notification', notificationSchema)
