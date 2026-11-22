# WiseSell NestJS staging API

This isolated backend is intended to run from the `backend/` directory as a staging service. It does not alter the frontend's current Firebase sign-in flow or any production deployment.

## Routes

- `GET /api/v1/health` — process health
- `GET /api/v1/ready` — verifies required Supabase and OpenAI environment configuration
- `POST /api/v1/ai/generate-content` — Supabase-authenticated AI content generation

The AI request body follows the uploaded secure backend contract:

```json
{
  "product": { "title": "Leather shoes", "price": 2450 },
  "channels": ["whatsapp", "instagram"],
  "tone": "friendly",
  "languages": ["am", "en", "om"]
}
```

Send the Supabase access token in `Authorization: Bearer <access_token>`.

## Staging deployment

Configure the Render service to use this repository and set **Root Directory** to `backend`. Build command: `npm ci && npm run build`. Start command: `npm run start:prod`.

Set the following environment variables in Render (never commit real secrets):

- `NODE_ENV=staging`
- `SUPABASE_URL` — URL for the WiseSell-Staging Supabase project
- `SUPABASE_ANON_KEY` — Supabase publishable/anon key (not service-role)
- `OPENAI_API_KEY` — server-side OpenAI API key
- `OPENAI_MODEL=gpt-4o-mini`
- `FRONTEND_ORIGINS` — exact deployed WiseSell frontend origin(s)
- `PORT` — Render injects this automatically; the app defaults to 10000

## Security notes

- Every AI request requires a valid Supabase access token; the token is verified with Supabase Auth `getUser`.
- The Supabase service-role key is not used.
- Request DTO validation rejects unknown fields and unsupported values.
- Throttling is 10 requests per minute per IP per service instance. Use a shared Redis-backed limiter before production or multi-instance scaling.
- The OpenAI key remains server-side. Provider response bodies and secrets are not returned to clients.
- CORS is restricted to the configured frontend origins. Native clients without an Origin header still require a valid bearer token.

## Current integration boundary

The selected frontend repository currently uses Firebase Authentication and has an existing Gemini/Workers AI route. This NestJS service is a staging addition only. Frontend authentication and API endpoint migration to Supabase must be completed and tested separately before the app can use this endpoint. No deployment or live AI request has been performed by this source commit.
