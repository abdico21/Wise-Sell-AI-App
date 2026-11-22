# WiseSell AI NestJS staging API

Deploy as a separate Render Web Service from branch `staging/nestjs-backend`, with Root Directory `backend`. Build command: `npm install && npx prisma generate && npm run build`. Start command: `npx prisma db push && npm run start` (only with a dedicated staging database).

Set `DATABASE_URL` to a new staging-only PostgreSQL database. Set `CORS_ORIGINS` to the staging frontend origin. Set Firebase Admin credentials as secret environment variables; never commit private keys. Set `OPENAI_API_KEY` only in the service secret settings. Keep `PAYMENTS_ENABLED=false`; Telebirr is not active in this scaffold.

Endpoints: `GET /api/v1/health`, `GET /api/v1/ready`, authenticated `POST /api/v1/ai/assist` with JSON body `{"prompt":"..." }`.
