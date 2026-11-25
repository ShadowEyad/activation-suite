# API reference

JSON requests use `Content-Type: application/json`. Examples assume a local demo Worker. Mutating demo data is disposable; do not run these against a customer registry.

## Public routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Runtime and Supabase connectivity |
| GET | `/api/branding` | Public portal branding |
| GET | `/api/products/lookup?serial=SN-DEMO-001` | Serial lookup; currently returns the full product record |
| POST | `/api/otp/request` | Create OTP session and send or simulate delivery |
| POST | `/api/otp/verify` | Verify session and activate product |
| POST | `/api/activate` | Activate directly, without OTP |
| POST | `/api/admin/login` | Validate credentials; does not issue a session token |
| POST | `/webhooks/shopify/orders-paid` | Provision registry entries from paid-order items |

Both Worker variants expose `/api/activate`. Selecting the OTP-default portal does not disable direct activation.

### Request OTP / activate directly

The request body for `/api/otp/request` and `/api/activate` is:

```json
{
  "serialNumber": "SN-DEMO-001",
  "name": "Demo Customer",
  "phone": "+15550100000",
  "email": "customer@example.com"
}
```

### Verify OTP

```json
{
  "serialNumber": "SN-DEMO-001",
  "code": "123456"
}
```

Use the code actually delivered, or the `simulatedCode` returned by a provider-free local demo. A successful activation returns `{ "success": true, "data": { ... } }` with the updated product and license key. Errors commonly return `success: false` and `message`; not every endpoint uses the same error envelope.

## Administrator routes

Use HTTP Basic authentication with the configured admin email/password over HTTPS. The browser dashboard currently retains these credentials in localStorage. The backend also accepts the primary admin password as a bearer token; replacing this with real session authentication is a known priority.

| Method | Route | Purpose |
| --- | --- | --- |
| GET / POST | `/api/products` | List / create registry entries |
| POST | `/api/products/bulk` | Bulk product creation |
| DELETE | `/api/products/:serial` | Delete a product |
| POST | `/api/branding` | Update branding and related settings |
| GET / POST | `/api/admin/config` | Read / update configuration |
| GET / POST | `/api/admin/accounts` | List / create or update administrators |
| DELETE | `/api/admin/accounts/:email` | Delete an administrator |
| POST | `/api/reset` | Destructive registry reset |
| GET, WebSocket upgrade | `/api/ws` | Live activity; currently authenticates via URL query credentials |

The definitive request handling is in `src/worker.js` and `src/worker-no-otp.js`. Avoid exposing the current API to untrusted customer traffic until the issues in [security findings](security.md) are addressed.
