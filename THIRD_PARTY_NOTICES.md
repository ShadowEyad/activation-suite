# Third-party notices

Activation Suite's own code is MIT-licensed. Runtime and build dependencies are separately licensed. `package-lock.json` records exact dependency resolutions.

- `@supabase/supabase-js` and its Supabase components: [Supabase JavaScript repository](https://github.com/supabase/supabase-js), MIT license.
- `esbuild`: [esbuild repository](https://github.com/evanw/esbuild), MIT license.
- `wrangler`: [Cloudflare Workers SDK](https://github.com/cloudflare/workers-sdk), Apache-2.0 / MIT licensing as provided by the package.

The generated bundles preserve dependency legal comments and include corresponding `.LEGAL.txt` files when esbuild emits them. When distributing a build, include these files and the relevant dependency license texts from the installed packages, including transitive dependencies. This document is an attribution index, not a substitute for those license texts.

The admin template references Google Fonts over the network. Font assets are not vendored in this repository. Review the fonts' licenses and privacy implications when self-hosting or redistributing them.

Cloudflare, Supabase, Shopify, Twilio, Resend, WordPress, BigCommerce, and Wix are third-party names used to describe compatibility. No affiliation or endorsement is claimed.
