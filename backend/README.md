# WiseSell AI — NestJS staging API

This backend lives in `backend/` and is intentionally isolated on branch `staging/nestjs-backend`. It does not change the production branch or production service.

## Deploy as a separate Render Web Service
- Repository: `abdico21/Wise-Sell-AI-App`
- Branch: `staging/nestjs-backend`
- Root Directory: `backend`
- Runtime: Docker (uses the included Dockerfile), or Node
- Health Check Path: `/api/v1/health`
- Never attach the production database. Use a dedicated staging PostgreSQL database.

## Required staging environment
Copy `.env.example` into the staging service environment and set:
- `NODE_ENV=staging`
- `CORS_ORIGINS` to the exact staging frontend origin(s)
- `DATABASE_URL` to a dedicated staging PostgreSQL database
- Firebase Admin credentials via Render environment variables (never commit a service-account JSON file)
- `OPENAI_API_KEY` only if AI assistance is enabled

For Firebase Admin, use either `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`, or workload/application default credentials.

## Endpoints
- `GET /api/v1/health` — liveness
- `GET /api/v1/ready` — readiness and database check
- `POST /api/v1/ai/assist` — authenticated Firebase ID token required; JSON body `{"prompt":"..."}`

## Security and staging boundaries
- Firebase ID tokens are verified server-side; do not send Firebase Admin credentials to the browser.
- CORS is allow-listed. Configure exact frontend origins.
- Helmet headers, request validation, and basic rate limiting are enabled.
- AI requests require authentication and are length-limited.
- Telebirr is intentionally not wired to live payment processing. Payment flags default to disabled. Add Telebirr only after the staging merchant credentials, signature scheme, callback verification, and test cases are confirmed.
- Chapa is not included.
- Do not use production secrets, production database URLs, or production payment credentials.

## Local checks
```sh
npm install
npx prisma generate
npm run build
```
