# Contributing

Use Node.js 22 or newer, run `npm ci`, and start a disposable instance with `npm run dev`. Keep your `.dev.vars`, customer records, provider credentials, and production exports out of commits.

Before opening a pull request, run:

```bash
npm run check
npm test
npm run build
```

Explain the problem, the resulting behavior, and what you tested. Backend logic currently exists in two variants; keep them consistent unless a change intentionally differs. Add meaningful regression coverage for behavior changes. Live service tests require your own test accounts and must not use real customer data.

Useful first contributions include enforced activation policies, session authentication, password storage, atomic activation, webhook deduplication, response privacy, and splitting the duplicated backend. Read `docs/security.md` before starting.

Be respectful and focus reviews on the code. Do not disclose exploitable security issues or credentials in public issues; use `SECURITY.md`.
