# BugArena Backend API

REST API for the BugArena bug bounty platform — Node.js + Express + MongoDB.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill environment variables
cp .env.example .env

# 3. Seed the database (requires MongoDB running)
npm run seed

# 4. Start the server
npm run dev      # development (nodemon)
npm start        # production
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for access tokens (15min) |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens (7d) |
| `CLOUDINARY_*` | Cloudinary credentials for file uploads |
| `SMTP_*` | SMTP credentials for email |
| `CLIENT_URL` | Frontend URL for CORS |
| `NODE_ENV` | `development` or `production` |

## Seed Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@bugarena.com | Admin@123 |
| Hunter 1-5 | hunter1-5@bugarena.com | Hunter@123 |
| Owner 1-2 | owner1-2@bugarena.com | Owner@123 |

## API Overview

| Prefix | Description |
|---|---|
| `POST /api/auth/*` | Authentication (register, login, logout, refresh, password reset) |
| `GET /api/auth/me` | Authenticated user profile |
| `GET/PUT/DELETE /api/users/*` | User profiles, badges, certs, notifications |
| `GET/POST/PUT/DELETE /api/programs/*` | Bug bounty programs |
| `GET/POST/PUT/PATCH /api/reports/*` | Vulnerability reports + comments |
| `GET /api/leaderboard` | Global / monthly / college leaderboard |
| `POST /api/uploads/*` | Avatar and screenshot uploads (Cloudinary) |
| `GET/PATCH /api/admin/*` | Admin dashboard — stats, ban/unban, approve programs |

## Authentication

All protected routes require a JWT access token:

```
Authorization: Bearer <accessToken>
```

Refresh tokens are stored in `httpOnly` cookies automatically.

## Response Format

**Success:**
```json
{ "success": true, "data": {}, "message": "..." }
```

**Paginated list:**
```json
{ "success": true, "data": [], "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
```

**Error:**
```json
{ "success": false, "message": "Error description", "code": "ERROR_CODE" }
```

## Business Logic

When a report is marked `ACCEPTED`:
1. Points awarded: CRITICAL=500, HIGH=300, MEDIUM=150, LOW=75, INFO=25
2. Hunter level recalculated (NEWBIE→SCOUT→HUNTER→ELITE→LEGEND)
3. Program `bugsFoundCount` incremented
4. Certificate auto-created
5. Notifications sent to hunter
6. Badges auto-awarded (First Blood, Critical Hit, Bug Slayer, Elite Hunter, Legend)
