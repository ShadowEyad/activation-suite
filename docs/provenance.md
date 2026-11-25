# Source provenance

The supplied Premium-Package contained two pre-bundled Worker JavaScript files, a database SQL template, environment placeholders, platform embeds, and three setup guides. It did not include the original TypeScript project, package manifest, dependency lockfile, or source maps.

The bundles retained `src/` section markers. Application sections were extracted into editable ES modules, template declarations were exported into `src/templates/`, and bundler-only `__name` calls were removed. The bundled SDK was replaced with `@supabase/supabase-js` version `2.106.1`, matching the version string in the distribution. This is recovered JavaScript, not the missing original TypeScript source.

The OTP distribution supplies all three HTML templates; the direct-default distribution shares the admin and direct-activation templates. Both backend variants are retained. New build scripts regenerate distributable bundles using esbuild. Generated bundles are excluded from Git.

Documentation was rewritten around the actual files and inspected behavior. No upstream change history is claimed. The original folder was read only and was not modified.

The repository applies the MIT license to the author's project code. Third-party dependencies retain their respective licenses and must be included with redistributed bundles. See `THIRD_PARTY_NOTICES.md`.
