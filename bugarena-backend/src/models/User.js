const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['HUNTER', 'PROGRAM_OWNER', 'ADMIN'], default: 'HUNTER' },
    collegeName: { type: String, trim: true, default: '' },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
    level: {
      type: String,
      enum: ['NEWBIE', 'SCOUT', 'HUNTER', 'ELITE', 'LEGEND'],
      default: 'NEWBIE',
    },
    totalPoints: { type: Number, default: 0 },
    rank: { type: Number, default: null },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  { timestamps: true }
)

// Never return passwordHash or refreshToken in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.passwordHash
  delete obj.refreshToken
  delete obj.passwordResetToken
  delete obj.passwordResetExpires
  return obj
}

// Virtual: username derived from email prefix
userSchema.virtual('username').get(function () {
  return this.email.split('@')[0]
})

userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('User', userSchema)
