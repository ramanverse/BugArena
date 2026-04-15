const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER) {
    console.log(`[EMAIL] Skipping send (SMTP not configured): ${subject} → ${to}`)
    return
  }
  try {
    await transporter.sendMail({
      from: `"BugArena" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })
    console.log(`[EMAIL] Sent: ${subject} → ${to}`)
  } catch (err) {
    console.error(`[EMAIL] Failed to send: ${err.message}`)
  }
}

const sendPasswordReset = async (email, resetUrl) => {
  await sendEmail({
    to: email,
    subject: 'BugArena — Password Reset',
    html: `
      <div style="font-family:monospace;max-width:600px;padding:32px;background:#0e0e13;color:#f9f5fd;">
        <h2 style="color:#a4ffb9;">Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#a4ffb9;color:#0e0e13;font-weight:bold;text-decoration:none;margin:16px 0;">
          RESET PASSWORD
        </a>
        <p style="color:#acaab1;font-size:12px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  })
}

const sendWelcome = async (email, name) => {
  await sendEmail({
    to: email,
    subject: 'Welcome to BugArena',
    html: `
      <div style="font-family:monospace;max-width:600px;padding:32px;background:#0e0e13;color:#f9f5fd;">
        <h2 style="color:#a4ffb9;">Welcome, ${name}!</h2>
        <p>Your operator account has been created. Start hunting bugs and earning rewards.</p>
        <a href="${process.env.CLIENT_URL}/programs" style="display:inline-block;padding:12px 24px;background:#a4ffb9;color:#0e0e13;font-weight:bold;text-decoration:none;margin:16px 0;">
          START HUNTING
        </a>
      </div>
    `,
  })
}

module.exports = { sendEmail, sendPasswordReset, sendWelcome }
