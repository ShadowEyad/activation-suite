-- =====================================================================
--  SUPABASE DATABASE SQL TEMPLATE
--  Run this inside your Supabase SQL Editor query window:
--  Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- =====================================================================

-- 1. Create registered products table
CREATE TABLE IF NOT EXISTS products (
  "serialNumber" TEXT PRIMARY KEY,
  "productName" TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unactivated',
  "ownerName" TEXT,
  "ownerPhone" TEXT,
  "ownerEmail" TEXT,
  "activatedAt" TEXT,
  "licenseKey" TEXT,
  "useType" TEXT DEFAULT 'one-time',
  "expirationDate" TEXT
);

-- 2. Create administrative login accounts table
--    NOTE: Passwords are stored in plaintext here for simplicity.
--    For production with many admins, consider storing bcrypt hashes.
--    Configure the primary admin through Worker secrets; see docs/security.md.
CREATE TABLE IF NOT EXISTS admin_accounts (
  email TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  name TEXT
);

-- 3. Create white-label branding configuration table
CREATE TABLE IF NOT EXISTS portal_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 4. Create one-time-password session table
--    OTP codes are short-lived (10 minutes) and auto-deleted after use.
CREATE TABLE IF NOT EXISTS otp_sessions (
  "serialNumber" TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  "expiresAt" BIGINT NOT NULL
);

-- 5. Verification log history table (optional, for audit trail)
CREATE TABLE IF NOT EXISTS verification_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  code TEXT NOT NULL
);

-- =====================================================================
--  🔒 ROW LEVEL SECURITY (STRONGLY RECOMMENDED)
--  Enable RLS on all tables. Since your Worker uses the service_role key
--  (which bypasses RLS), this protects against accidental direct API access
--  from the browser using the anon key.
-- =====================================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;

-- Deny all public (anon) access — Worker uses service_role which bypasses RLS
DROP POLICY IF EXISTS "Deny all anon access" ON products;
CREATE POLICY "Deny all anon access" ON products FOR ALL TO anon USING (false);

DROP POLICY IF EXISTS "Deny all anon access" ON admin_accounts;
CREATE POLICY "Deny all anon access" ON admin_accounts FOR ALL TO anon USING (false);

DROP POLICY IF EXISTS "Deny all anon access" ON portal_config;
CREATE POLICY "Deny all anon access" ON portal_config FOR ALL TO anon USING (false);

DROP POLICY IF EXISTS "Deny all anon access" ON otp_sessions;
CREATE POLICY "Deny all anon access" ON otp_sessions FOR ALL TO anon USING (false);

DROP POLICY IF EXISTS "Deny all anon access" ON verification_logs;
CREATE POLICY "Deny all anon access" ON verification_logs FOR ALL TO anon USING (false);

