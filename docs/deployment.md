# Deployment

## 1. Local configuration

Install dependencies with `npm ci`. Copy `.dev.vars.example` to `.dev.vars` and fill in your own values. Wrangler reads `.dev.vars` for local development. This file must never be committed.

| Setting | Required for | Location |
| --- | --- | --- |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Administrator access | Worker secrets |
| `SUPABASE_URL` | Persistent database | Worker environment |
| `SUPABASE_SERVICE_ROLE_KEY` | Persistent database | Worker secret |
| `RESEND_API_KEY` | OTP / certificate email | Worker secret |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | SMS OTP | Worker secrets |
| `SHOPIFY_WEBHOOK_SECRET` | Signed Shopify webhook validation | Worker secret |
| `CORS_ALLOWED_ORIGINS` | Storefront origin selection | Worker environment |
| `PORTAL_NAME`, `PORTAL_SUB`, `SUPPORT_EMAIL`, `THEME_HUE` | Branding | Worker environment or dashboard |

Additional logo and color options are in `.dev.vars.example`. The current email sender is hardcoded in the Worker; inspect `sendEmail` and configure a sender/domain supported by your Resend account before using customer email.

## 2. Database

Create a Supabase project and run `database/schema.sql` in its SQL editor. It creates `products`, `admin_accounts`, `portal_config`, `otp_sessions`, and `verification_logs`, and enables row-level security. The Worker uses a privileged service-role key. Do not place it in HTML, Liquid, browser JavaScript, or a public configuration file.

For a test database only, optionally run `database/seed-demo.sql`. Configure your primary administrator using Worker secrets. Additional administrators created through the current dashboard are stored with plaintext passwords; see [security findings](security.md).

Reference: [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).

## 3. Cloudflare Worker

The default configuration is `wrangler.jsonc`. Change `name` if desired. For the direct-default variant use `wrangler.no-otp.jsonc` and pass `--config wrangler.no-otp.jsonc` to each Wrangler command, including secret creation.

```bash
npx wrangler login
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npm run deploy
```

Add provider secrets with `npx wrangler secret put VARIABLE_NAME` as needed. Local `.dev.vars` values are not automatically uploaded by this workflow. Set non-secret branding variables in the dashboard or configuration. Avoid mixing dashboard settings with conflicting values in deployment configuration.

```bash
# Alternative variant, after setting its own secrets:
npm run deploy:no-otp
```

Reference: [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) and [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/).

## 4. Validate the installation

Visit `/api/health` and confirm the `supabase` field says `connected (tables ok)`. A top-level `status: ok` by itself does not prove persistence is configured. Sign in at `/admin`, create a disposable product, and complete activation through your chosen portal. Verify database writes and actual email/SMS delivery using your own test contacts.

Neither hosted database integration nor real provider delivery was verified during repository preparation. Local tests use the in-memory fallback.

## 5. Storefronts and webhooks

Follow [the integration guide](integrations.md). Set `SHOPIFY_WEBHOOK_SECRET` before sending Shopify events to `/webhooks/shopify/orders-paid`. The current implementation needs replay protection, quantity handling, and duplicate-event handling before reliable order fulfillment. Without a webhook secret, it currently accepts unsigned payloads.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Data disappears | Supabase is unconfigured and the Worker is using demo memory |
| Admin login fails | Correct variant's secrets and exact credentials |
| OTP appears in the browser | No SMS or email provider is configured; simulation mode is active |
| Email is missing | Provider response, sender/domain, recipient restrictions, and API key |
| Shopify section fails to render | Matching snippet exists in the theme's `snippets/` folder |
| Embed calls the wrong backend | `data-api`, `backendApiUrl`, or Shopify section settings |

Consult [the security findings](security.md) before public customer use.
