require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const connectDB = require('./src/config/db')
const User = require('./src/models/User')
const Program = require('./src/models/Program')
const Report = require('./src/models/Report')
const Badge = require('./src/models/Badge')
const UserBadge = require('./src/models/UserBadge')
const Certificate = require('./src/models/Certificate')
const Notification = require('./src/models/Notification')
const Comment = require('./src/models/Comment')
const Bookmark = require('./src/models/Bookmark')
const { calculateLevel } = require('./src/services/badge.service')

const SEVERITY_POINTS = { CRITICAL: 500, HIGH: 300, MEDIUM: 150, LOW: 75, INFO: 25 }

const hash = (pw) => bcrypt.hash(pw, 12)

const BADGES = [
  { name: 'First Blood', description: 'Submit your first accepted report', triggerType: 'FIRST_REPORT' },
  { name: 'Critical Hit', description: 'Get your first CRITICAL severity report accepted', triggerType: 'FIRST_CRITICAL' },
  { name: 'Bug Slayer', description: 'Get 10 reports accepted', triggerType: 'POINTS_MILESTONE' },
  { name: 'Elite Hunter', description: 'Reach ELITE level', triggerType: 'POINTS_MILESTONE' },
  { name: 'Legend', description: 'Reach LEGEND level', triggerType: 'POINTS_MILESTONE' },
]

const PROGRAMS_DATA = [
  {
    name: 'PayPal Security',
    companyName: 'PayPal Inc.',
    description: 'Discover vulnerabilities across PayPal payment infrastructure, APIs, and customer-facing products.',
    category: 'WEB',
    difficulty: 'HARD',
    rewards: { critical: 50000, high: 25000, medium: 10000, low: 3000, info: 500 },
    scopeUrls: ['*.paypal.com', 'api.paypal.com', 'developer.paypal.com'],
    outOfScopeUrls: ['sandbox.paypal.com'],
    tags: ['fintech', 'payments', 'oauth'],
  },
  {
    name: 'GitHub Platform',
    companyName: 'GitHub Inc.',
    description: 'Hunt for security vulnerabilities in the GitHub platform, Actions, Packages, and API.',
    category: 'API',
    difficulty: 'MEDIUM',
    rewards: { critical: 30000, high: 15000, medium: 5000, low: 1500, info: 250 },
    scopeUrls: ['*.github.com', 'api.github.com', '*.githubapp.com'],
    outOfScopeUrls: ['education.github.com'],
    tags: ['devtools', 'api', 'git', 'ci-cd'],
  },
  {
    name: 'TechCorp Mobile',
    companyName: 'TechCorp Inc.',
    description: 'Android and iOS mobile applications security research program with high rewards.',
    category: 'MOBILE',
    difficulty: 'HARD',
    rewards: { critical: 40000, high: 20000, medium: 8000, low: 2000, info: 300 },
    scopeUrls: ['com.techcorp.app', 'io.techcorp.*'],
    outOfScopeUrls: [],
    tags: ['mobile', 'android', 'ios', 'fintech'],
  },
  {
    name: 'CloudBase API',
    companyName: 'CloudBase Ltd.',
    description: 'Security testing program for our cloud-native APIs and infrastructure endpoints.',
    category: 'API',
    difficulty: 'EASY',
    rewards: { critical: 10000, high: 5000, medium: 2000, low: 500, info: 100 },
    scopeUrls: ['api.cloudbase.io', 'v2.cloudbase.io'],
    outOfScopeUrls: ['docs.cloudbase.io'],
    tags: ['cloud', 'api', 'rest'],
  },
  {
    name: 'NetSecure Network',
    companyName: 'NetSecure Corp.',
    description: 'Network and infrastructure security program covering firewalls, VPN endpoints, and internal APIs.',
    category: 'NETWORK',
    difficulty: 'HARD',
    rewards: { critical: 60000, high: 30000, medium: 12000, low: 4000, info: 800 },
    scopeUrls: ['*.netsecure.io', '10.0.0.0/8'],
    outOfScopeUrls: ['legacy.netsecure.io'],
    tags: ['network', 'vpn', 'infrastructure'],
  },
]

const VULN_TYPES = ['XSS', 'SQL Injection', 'SSRF', 'RCE', 'IDOR', 'Open Redirect', 'CSRF', 'Auth Bypass', 'Path Traversal', 'XXE']
const SEVERITIES = ['CRITICAL', 'HIGH', 'HIGH', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'LOW', 'LOW', 'INFO', 'INFO']
const STATUSES = ['ACCEPTED', 'ACCEPTED', 'ACCEPTED', 'PENDING', 'TRIAGING', 'REJECTED', 'DUPLICATE', 'PENDING', 'ACCEPTED', 'TRIAGING']

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]

async function seed() {
  await connectDB()
  console.log('🌱 Starting seed...')

  // Clear all collections
  await Promise.all([
    User.deleteMany({}), Program.deleteMany({}), Report.deleteMany({}),
    Badge.deleteMany({}), UserBadge.deleteMany({}), Certificate.deleteMany({}),
    Notification.deleteMany({}), Comment.deleteMany({}), Bookmark.deleteMany({}),
  ])
  console.log('✅ Cleared all collections')

  // ── Badges ──────────────────────────────────────────────────
  const badges = await Badge.insertMany(BADGES)
  console.log(`✅ Seeded ${badges.length} badges`)

  // ── Admin ───────────────────────────────────────────────────
  const admin = await User.create({
    fullName: 'Admin User',
    email: 'admin@bugarena.com',
    passwordHash: await hash('Admin@123'),
    role: 'ADMIN',
    isVerified: true,
    level: 'LEGEND',
    totalPoints: 99999,
  })
  console.log('✅ Admin created:', admin.email)

  // ── Program Owners ──────────────────────────────────────────
  const owners = await User.insertMany([
    { fullName: 'Owner One', email: 'owner1@bugarena.com', passwordHash: await hash('Owner@123'), role: 'PROGRAM_OWNER', isVerified: true },
    { fullName: 'Owner Two', email: 'owner2@bugarena.com', passwordHash: await hash('Owner@123'), role: 'PROGRAM_OWNER', isVerified: true },
  ])
  console.log(`✅ Seeded ${owners.length} program owners`)

  // ── Hunters ─────────────────────────────────────────────────
  const hunterData = Array.from({ length: 5 }, (_, i) => ({
    fullName: `Hunter ${i + 1}`,
    email: `hunter${i + 1}@bugarena.com`,
    passwordHash: null, // filled below
    role: 'HUNTER',
    isVerified: true,
    collegeName: ['MIT', 'Stanford', 'IIT Delhi', 'CMU', 'Oxford'][i],
  }))
  for (const h of hunterData) h.passwordHash = await hash('Hunter@123')
  const hunters = await User.insertMany(hunterData)
  console.log(`✅ Seeded ${hunters.length} hunters`)

  // ── Programs ─────────────────────────────────────────────────
  const programs = []
  for (let i = 0; i < PROGRAMS_DATA.length; i++) {
    const pd = PROGRAMS_DATA[i]
    const { slugify } = require('./src/utils/slugify')
    programs.push(await Program.create({
      ...pd,
      ownerId: owners[i % owners.length]._id,
      slug: slugify(pd.name),
      isApproved: true,
      isActive: true,
    }))
  }
  console.log(`✅ Seeded ${programs.length} programs`)

  // ── Reports (30 total) & business logic ─────────────────────
  const reportDocs = []
  let reportIndex = 0

  for (let i = 0; i < 30; i++) {
    const hunter = hunters[i % hunters.length]
    const program = programs[i % programs.length]
    const severity = SEVERITIES[i % SEVERITIES.length]
    const status = STATUSES[i % STATUSES.length]
    const vulnType = VULN_TYPES[i % VULN_TYPES.length]

    const report = await Report.create({
      hunterId: hunter._id,
      programId: program._id,
      title: `${vulnType} vulnerability in ${program.name} #${i + 1}`,
      vulnerabilityType: vulnType,
      severity,
      status,
      affectedUrl: `https://${program.scopeUrls[0] || 'example.com'}/api/v${(i % 3) + 1}/endpoint`,
      cvssScore: severity === 'CRITICAL' ? 9.8 : severity === 'HIGH' ? 8.1 : severity === 'MEDIUM' ? 5.5 : severity === 'LOW' ? 3.1 : 1.0,
      stepsToReproduce: `1. Navigate to the affected endpoint\n2. Send the following payload: <script>alert(1)</script>\n3. Observe the reflected response\n4. Exploit confirmed.`,
      impactDescription: `This vulnerability allows an attacker to ${severity === 'CRITICAL' || severity === 'HIGH' ? 'gain full remote code execution' : 'conduct cross-site scripting attacks'} affecting all users.`,
      isDraft: false,
      statusHistory: [
        { status: 'PENDING', changedBy: hunter._id, note: 'Report submitted', changedAt: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000) },
        ...(status !== 'PENDING' ? [{ status, changedBy: admin._id, note: `Status updated to ${status}`, changedAt: new Date(Date.now() - (25 - i) * 24 * 60 * 60 * 1000) }] : []),
      ],
    })

    // If accepted — award points, certificate, notifications
    if (status === 'ACCEPTED') {
      const points = SEVERITY_POINTS[severity]
      report.pointsAwarded = points
      await report.save()

      await User.findByIdAndUpdate(hunter._id, { $inc: { totalPoints: points } })

      await Certificate.create({
        userId: hunter._id,
        reportId: report._id,
        title: report.title,
        programName: program.name,
        severity,
      })

      await Notification.insertMany([
        { userId: hunter._id, type: 'REPORT_ACCEPTED', message: `✅ Your report "${report.title}" was accepted!` },
        { userId: hunter._id, type: 'POINTS_AWARDED', message: `🎯 +${points} points awarded for "${report.title}"` },
      ])
    } else if (status === 'REJECTED' || status === 'DUPLICATE') {
      await Notification.create({
        userId: hunter._id,
        type: 'REPORT_REJECTED',
        message: `❌ Your report "${report.title}" was marked as ${status}.`,
      })
    }

    reportDocs.push(report)
    reportIndex++
  }
  console.log(`✅ Seeded ${reportDocs.length} reports`)

  // ── Recalculate hunter levels ───────────────────────────────
  for (const hunter of hunters) {
    const freshHunter = await User.findById(hunter._id)
    freshHunter.level = calculateLevel(freshHunter.totalPoints)
    await freshHunter.save()
  }
  console.log('✅ Hunter levels recalculated')

  // ── Award badges based on actual accepted counts ────────────
  for (const hunter of hunters) {
    const freshHunter = await User.findById(hunter._id)
    const acceptedCount = await Report.countDocuments({ hunterId: hunter._id, status: 'ACCEPTED' })
    const criticalCount = await Report.countDocuments({ hunterId: hunter._id, status: 'ACCEPTED', severity: 'CRITICAL' })

    const awardBadge = async (badgeName) => {
      const badge = badges.find((b) => b.name === badgeName)
      if (!badge) return
      try {
        await UserBadge.create({ userId: hunter._id, badgeId: badge._id })
        await Notification.create({ userId: hunter._id, type: 'BADGE_EARNED', message: `🏅 You earned the "${badgeName}" badge!` })
      } catch {} // Ignore duplicate badge errors
    }

    if (acceptedCount >= 1) await awardBadge('First Blood')
    if (criticalCount >= 1) await awardBadge('Critical Hit')
    if (acceptedCount >= 10) await awardBadge('Bug Slayer')
    if (freshHunter.level === 'ELITE' || freshHunter.level === 'LEGEND') await awardBadge('Elite Hunter')
    if (freshHunter.level === 'LEGEND') await awardBadge('Legend')
  }
  console.log('✅ Badges awarded')

  // ── Add sample comments ─────────────────────────────────────
  const commentReport = reportDocs[0]
  await Comment.insertMany([
    { reportId: commentReport._id, authorId: admin._id, body: 'Thank you for this report. We are triaging now.' },
    { reportId: commentReport._id, authorId: hunters[0]._id, body: 'Happy to help! Let me know if you need any additional info.' },
    { reportId: commentReport._id, authorId: admin._id, body: 'Report confirmed and accepted. Reward will be processed within 14 days.' },
  ])
  console.log('✅ Sample comments added')

  console.log('\n🎉 Seed complete!\n')
  console.log('────────────────────────────────')
  console.log('  Admin:    admin@bugarena.com / Admin@123')
  console.log('  Hunters:  hunter1-5@bugarena.com / Hunter@123')
  console.log('  Owners:   owner1-2@bugarena.com / Owner@123')
  console.log('────────────────────────────────')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
