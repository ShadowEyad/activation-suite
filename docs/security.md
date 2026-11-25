# Inspection findings and release limitations

This document records issues observed in the supplied code during source recovery. This was a repository-preparation inspection, not a complete security audit. The source behavior is largely preserved so that existing deployments and follow-up work can be understood.

## Authentication and privacy

- Additional admin accounts are saved as plaintext passwords in Supabase. The verifier also accepts legacy SHA-256 values. Replace this with a password KDF or an established identity/session provider.
- The admin dashboard stores passwords in localStorage and sends them with API requests. The live WebSocket includes email/password in URL query parameters, which may appear in logs. Replace both with short-lived sessions and safer WebSocket authentication.
- Public product lookup returns full records, including owner contact details and license keys for activated products. Restrict its response and require appropriate authorization for owner data.
- Customer and branding data are interpolated into HTML in several places. Audit escaping, URL validation, and DOM insertion before handling untrusted input.

## Activation and OTP

- The OTP-default backend still exposes `/api/activate` and the no-OTP portal. Deploying the OTP variant does not enforce verification as a server-side policy.
- When email and SMS are both unconfigured, OTP codes are returned to the requester and logged for demonstration. Require an explicit development flag and fail closed in production.
- OTP and license generation use `Math.random()`. Replace this with cryptographically secure randomness and define the intended license validation model.
- OTP requests have an in-memory throttle, but verification lacks a failed-attempt cap. Throttles, demo data, and live logs are local to an individual Worker isolate.
- Activation reads and updates are separate operations. Concurrent requests may bypass one-time-use intent; use an atomic database operation.

## Integrations and persistence

- Shopify signature validation runs only when a secret is configured. Missing secrets should reject webhook traffic. Add durable event deduplication, retry handling, and quantity-aware provisioning.
- CORS defaults to `*`, and disallowed origins may fall back to that value. This is not access control. Correct origin handling and authorization independently.
- Missing Supabase configuration silently selects an in-memory demo registry. Health reports should be checked for the database-specific result.
- Provider responses and some database errors are not consistently enforced. A success screen does not establish that a certificate email was delivered.
- License keys and personal data can appear in live activity messages. Define retention, redaction, and access rules before customer use.

## Repository preparation changes

- Default admin insertion was removed from schema setup.
- Optional demo products were separated into `database/seed-demo.sql`; the supplied sample owner/contact record was omitted.
- Third-party SDK implementation was removed from committed application source and replaced by a pinned package dependency.
- The missing Shopify snippet files were supplied.

These changes improve the release package; they do not remediate the runtime findings above. No live customer database, provider account, or production deployment was accessed.
