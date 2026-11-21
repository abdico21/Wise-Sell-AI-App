# WiseSell AI — Production Build Plan (Staging Only)

## Current verified baseline
- Mobile client: React 19 + Vite + Capacitor 8 in `abdico21/Wise-Sell-AI-App`.
- Firebase Authentication and Firestore client are already configured in `src/firebase/config.ts` and `src/firebase/businessData.ts`.
- Existing language selector supports Amharic, Afaan Oromoo, Tigrinya, Somali and English; default language is Amharic.
- Existing UI includes business dashboard, campaigns, social content, CRM, inventory, orders, SEO, video/audio and agent-work-team views.
- Existing AI orchestration service is a separate Cloudflare Worker in `abdico21/Wise-Sell-AI-App2`, with six agent IDs and Firebase ID-token verification.
- Worker base URL documented by the project: `https://wise-sell-ai-app2.abdico-veiws22.workers.dev`.
- Android application ID is `com.aistudio.wisesell.kpzqvm`; preserve it and the existing Firebase project/configuration.

## Important release blockers found during inspection
1. The client repository is a web/Capacitor app, not a native Flutter app. Build Android from the existing Capacitor source; do not invent or rename the package ID.
2. The separate Worker exposes six AI agents, but its current prompts explicitly prohibit claiming external publishing, sending, or transactions. The app must call the authenticated Worker and show AI output as drafts until the relevant official API integration is connected and the user approves an action.
3. The app's current Express `server.ts` contains a demo order/payment simulation endpoint (`/api/db/orders/simulate`) that calculates ETB from a hard-coded USD multiplier and returns a simulated “Payment Captured” status. This is not a payment integration and must never be used for live orders or shown as verified payment.
4. The Express server also exposes database table and export routes without visible authentication in this file. Do not expose this server as a production API until all routes have verified Firebase authentication, per-user authorization, input validation, rate limiting and audit logging.
5. Existing mock dashboard metrics and sample social posts must be visibly labeled as demo/sample data or replaced by authenticated Firestore records. They must never be presented as live channel analytics.
6. No social platform OAuth credentials, approved app permissions, payment merchant credentials, or webhook secrets were found in the inspected source files. Never add secrets to Git, mobile bundles, chat, or client-side environment variables.

## Six coordinated agents
Keep the existing agent IDs and use one authenticated orchestration entry point:
- `business-assistant`: business operations and decision support.
- `sales-agent`: lead qualification, follow-up drafts and conversion workflow.
- `digital-marketing`: campaign strategy and channel-specific campaign drafts.
- `seo-content`: SEO research plans and multilingual content.
- `social-media`: platform-specific posts, captions, inbox response drafts and publishing preparation.
- `video-audio`: scripts, storyboards, voiceover and short-video production briefs.

All agents receive a minimal, permission-scoped business context object. Persist conversation history and business memory per Firebase UID/organization with explicit user consent. Never allow one user's data into another user's context. Any write, send, publish, spend, order or refund action requires a clear preview and explicit confirmation, followed by a verified server-side provider result.

## External social channels
Build an integration registry for WhatsApp Business Platform, Telegram Bot API, Facebook Pages, Instagram professional accounts, TikTok, X, LinkedIn and YouTube. Each integration must:
- use the official API and OAuth/bot authorization supported by that provider;
- store access/refresh tokens only server-side, encrypted at rest;
- request least-privilege scopes and show connected / needs-approval / expired / revoked states;
- record granted capabilities separately (publish, read analytics, inbox/messages, comments, media upload);
- handle webhooks with signature verification, idempotency, retries and audit logs;
- never scrape, automate consumer logins, or claim a capability that the granted API scope does not provide.

## Ethiopian languages and localization
Retain Amharic (`am`), Afaan Oromoo (`om`), Tigrinya (`ti`), Somali (`so`) and English (`en`). Add language selection for agent conversations and per-channel content. Mark AI translations as reviewable drafts, preserve source text, support Unicode and right-to-left only where applicable, and use ETB as the local default. Additional Ethiopian languages should be added only with tested UI fonts and reviewed translations.

## Payments and commerce
Use a provider adapter pattern; never simulate a successful payment. Payment flow:
1. Backend creates a pending order and payment intent with an idempotency key.
2. Backend creates a checkout session using the selected licensed merchant provider.
3. User completes checkout on the provider's hosted/approved flow.
4. Backend verifies signed webhook/provider status server-to-server.
5. Only then mark the order paid and issue a receipt.
6. Handle failed, expired, duplicate, reversed and refunded events.
Never store card/bank credentials. Do not hard-code exchange rates. Keep ETB amounts as integer minor units and store currency explicitly.

Potential Ethiopia-focused provider adapters to evaluate: Chapa, Telebirr merchant checkout and CBE Birr merchant APIs. Provider selection, merchant onboarding and production credentials are prerequisites; a provider name or checkout link alone is not an integration.

## Required release gates
- TypeScript lint and production build pass.
- Android Capacitor sync/build succeeds with existing application ID.
- Firebase rules and backend authorization tests prove cross-user data isolation.
- Worker integration tests pass for all six agents using a real Firebase ID token.
- Social provider sandbox/OAuth/webhook tests pass individually; unsupported permissions are clearly marked unavailable.
- Payment sandbox tests pass for pending, success, failure, duplicate webhook, expiry and refund.
- No demo data is represented as live data.
- Android APK is installed and smoke-tested on a real device.
- Production rollout is a separate explicit approval after staging validation.

## Current status
This is an implementation plan, not a claim that the release gates have passed. The two staging branches were created from `main`:
- Frontend: `staging/wisesell-social-commerce`
- Worker/backend: `staging/wisesell-social-commerce`

Production branches have not been changed.
