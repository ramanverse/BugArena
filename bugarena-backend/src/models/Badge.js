const mongoose = require('mongoose')

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  iconUrl: { type: String, default: '' },
  triggerType: {
    type: String,
    enum: ['FIRST_REPORT', 'FIRST_CRITICAL', 'POINTS_MILESTONE', 'MANUAL'],
    required: true,
  },
})

module.exports = mongoose.model('Badge', badgeSchema)
