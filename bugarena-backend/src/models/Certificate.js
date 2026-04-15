const mongoose = require('mongoose')

const certificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  title: { type: String, required: true },
  programName: { type: String, required: true },
  severity: {
    type: String,
    enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'],
    required: true,
  },
  issuedAt: { type: Date, default: Date.now },
})

certificateSchema.index({ userId: 1 })

module.exports = mongoose.model('Certificate', certificateSchema)
