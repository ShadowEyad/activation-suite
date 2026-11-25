// Recovered from the supplied distribution; see docs/provenance.md.
import { createClient } from '@supabase/supabase-js';
import { ADMIN_HTML } from './templates/adminHtml.js';
import { PORTAL_NO_OTP_HTML } from './templates/portalNoOtpHtml.js';

// src/index.ts
var clients = /* @__PURE__ */ new Set();
var logHistory = [];
var localOTPs = /* @__PURE__ */ new Map();
var loginAttempts = /* @__PURE__ */ new Map();
var otpRequests = /* @__PURE__ */ new Map();
var localAdmins = /* @__PURE__ */ new Map();
async function sha2562(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function verifyPassword(inputPassword, storedPassword) {
  if (inputPassword === storedPassword)
    return true;
  const hash = await sha2562(inputPassword);
  if (hash === storedPassword)
    return true;
  const storedHash = await sha2562(storedPassword);
  return hash === storedHash;
}
var DEMO_CONFIG = /* @__PURE__ */ new Map();
function addLog(type, message, data) {
  const logItem = {
    type,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    message,
    data
  };
  logHistory.push(logItem);
  if (logHistory.length > 50)
    logHistory.shift();
  const payload = JSON.stringify(logItem);
  for (const ws of clients) {
    try {
      ws.send(payload);
    } catch {
      clients.delete(ws);
    }
  }
}
var DEMO_PRODUCTS = [
  {
    serialNumber: "SN-DEMO-001",
    productName: "Sample Product Alpha",
    category: "Electronics",
    status: "unactivated",
    useType: "one-time"
  },
  {
    serialNumber: "SN-DEMO-002",
    productName: "Sample Product Beta",
    category: "Electronics",
    status: "unactivated",
    useType: "unlimited"
  }
];
async function loadFullConfig(sb, env) {
  const config = {
    PORTAL_NAME: env.PORTAL_NAME || "Activation Portal",
    PORTAL_SUB: env.PORTAL_SUB || "Product Registration",
    SUPPORT_EMAIL: env.SUPPORT_EMAIL || "support@yourdomain.com",
    SUPPORT_PHONE: env.SUPPORT_PHONE || "",
    PORTAL_LOGO_URL: env.PORTAL_LOGO_URL || "",
    COLOR_PRIMARY: env.COLOR_PRIMARY || "",
    COLOR_BG: env.COLOR_BG || "",
    COLOR_TEXT: env.COLOR_TEXT || "",
    COLOR_CARD: env.COLOR_CARD || "",
    COLOR_BORDER: env.COLOR_BORDER || "",
    CORS_ALLOWED_ORIGINS: env.CORS_ALLOWED_ORIGINS || "*",
    TWILIO_ACCOUNT_SID: env.TWILIO_ACCOUNT_SID || "",
    TWILIO_AUTH_TOKEN: env.TWILIO_AUTH_TOKEN || "",
    TWILIO_FROM_NUMBER: env.TWILIO_FROM_NUMBER || "",
    RESEND_API_KEY: env.RESEND_API_KEY || "",
    SHOPIFY_WEBHOOK_SECRET: env.SHOPIFY_WEBHOOK_SECRET || "",
    THEME_HUE: env.THEME_HUE || "indigo"
  };
  const keyMap = {
    portalName: "PORTAL_NAME",
    portalSub: "PORTAL_SUB",
    supportEmail: "SUPPORT_EMAIL",
    supportPhone: "SUPPORT_PHONE",
    themeHue: "THEME_HUE",
    requireEnterprise: "REQUIRE_ENTERPRISE",
    corsWhitelistedOrigins: "CORS_ALLOWED_ORIGINS",
    twilioSid: "TWILIO_ACCOUNT_SID",
    twilioToken: "TWILIO_AUTH_TOKEN",
    twilioFrom: "TWILIO_FROM_NUMBER",
    resendKey: "RESEND_API_KEY",
    shopifyWebhookSecret: "SHOPIFY_WEBHOOK_SECRET",
    portalLogoUrl: "PORTAL_LOGO_URL",
    colorPrimary: "COLOR_PRIMARY",
    colorBg: "COLOR_BG",
    colorText: "COLOR_TEXT",
    colorCard: "COLOR_CARD",
    colorBorder: "COLOR_BORDER"
  };
  if (sb) {
    try {
      const { data } = await sb.from("portal_config").select("*");
      if (data) {
        for (const row of data) {
          let key = row.key;
          if (keyMap[key]) {
            key = keyMap[key];
          }
          if (key in config) {
            config[key] = row.value;
          }
        }
      }
    } catch {
    }
  } else {
    for (let [key, value] of DEMO_CONFIG.entries()) {
      if (keyMap[key]) {
        key = keyMap[key];
      }
      if (key in config) {
        config[key] = value;
      }
    }
  }
  return config;
}
function getAllowedOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = env.CORS_ALLOWED_ORIGINS || "*";
  if (allowed === "*")
    return "*";
  const url = new URL(request.url);
  const ownOrigin = url.origin.toLowerCase();
  const list = allowed.split(",").map((o) => o.trim().toLowerCase());
  list.push(ownOrigin);
  return list.includes(origin.toLowerCase()) ? origin : "null";
}
function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept, Authorization"
  };
}
function json(data, status = 200, co = "*") {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(co) }
  });
}
function htmlResponse(html) {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "default-src 'self' https: 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; connect-src 'self' https: wss: ws:;",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "same-origin",
      "X-XSS-Protection": "1; mode=block"
    }
  });
}
async function checkAdminAuth(request, sb, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader)
    return false;
  if (authHeader.startsWith("Basic ")) {
    try {
      const credentials = atob(authHeader.substring(6)).split(":");
      const email = credentials[0].trim().toLowerCase();
      const password = credentials[1];
      const cfEmail = (env.ADMIN_EMAIL || "").trim().toLowerCase();
      const cfPassword = env.ADMIN_PASSWORD || "";
      if (cfEmail && cfPassword && email === cfEmail && (password === cfPassword || password.trim() === cfPassword.trim())) {
        return true;
      }
      if (sb) {
        try {
          const { data } = await sb.from("admin_accounts").select("*").eq("email", email);
          if (data && data.length > 0) {
            return await verifyPassword(password, data[0].password);
          }
        } catch (dbErr) {
          console.error("Database checkAdminAuth query failed:", dbErr);
        }
      } else {
        const local = localAdmins.get(email);
        if (local) {
          return await verifyPassword(password, local.passwordHash);
        }
      }
    } catch {
      return false;
    }
  }
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const adminPassword = env.ADMIN_PASSWORD;
    if (adminPassword && token === adminPassword)
      return true;
  }
  return false;
}
function generateLicenseKey(serial) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const block = Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  const clean = serial.replace(/[^A-Z0-9]/gi, "").toUpperCase();
  return `LIC-${clean.slice(0, 4)}-${block.slice(0, 4)}-${block.slice(4, 8)}`.toUpperCase();
}
function generateOtpCode() {
  return String(Math.floor(1e5 + Math.random() * 9e5));
}
function getSupabase(env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY)
    return null;
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}
function checkAndAdjustExpiry(p) {
  if (p.expirationDate && new Date(p.expirationDate).getTime() < Date.now()) {
    p.status = "expired";
  }
  return p;
}
async function findProduct(sb, serial) {
  const key = serial.trim().toUpperCase();
  if (sb) {
    const { data } = await sb.from("products").select("*").ilike("serialNumber", key);
    if (data && data.length > 0)
      return checkAndAdjustExpiry(data[0]);
    return null;
  }
  const p = DEMO_PRODUCTS.find((p2) => p2.serialNumber.toUpperCase() === key);
  return p ? checkAndAdjustExpiry(p) : null;
}
async function allProducts(sb) {
  if (sb) {
    const { data, error } = await sb.from("products").select("*");
    if (!error && data) {
      const list2 = data.map(checkAndAdjustExpiry);
      return { data: list2, usingSupabase: true };
    }
  }
  const list = DEMO_PRODUCTS.map(checkAndAdjustExpiry);
  return { data: list, usingSupabase: false };
}
async function saveOtp(sb, serial, code, details, expiresAt2) {
  const key = serial.trim().toUpperCase();
  if (sb) {
    await sb.from("otp_sessions").upsert({
      serialNumber: key,
      code,
      name: details.name,
      phone: details.phone,
      email: details.email,
      expiresAt: expiresAt2
    });
  } else {
    localOTPs.set(key, { code, details, expiresAt: expiresAt2 });
  }
}
async function getOtp(sb, serial) {
  const key = serial.trim().toUpperCase();
  if (sb) {
    const { data } = await sb.from("otp_sessions").select("*").eq("serialNumber", key);
    if (!data || data.length === 0)
      return null;
    const s = data[0];
    return {
      code: s.code,
      details: {
        name: s.name,
        phone: s.phone,
        email: s.email,
        serialNumber: s.serialNumber
      },
      expiresAt: Number(s.expiresAt)
    };
  } else {
    return localOTPs.get(key) || null;
  }
}
async function removeOtp(sb, serial) {
  const key = serial.trim().toUpperCase();
  if (sb) {
    await sb.from("otp_sessions").delete().eq("serialNumber", key);
  } else {
    localOTPs.delete(key);
  }
}
async function activateProduct(sb, serial, details, licenseKey) {
  const key = serial.trim().toUpperCase();
  if (sb) {
    const { data } = await sb.from("products").update({
      status: "active",
      ownerName: details.name,
      ownerPhone: details.phone,
      ownerEmail: details.email,
      activatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      licenseKey
    }).eq("serialNumber", key).select();
    return data && data.length > 0 ? data[0] : null;
  } else {
    const product = DEMO_PRODUCTS.find((p) => p.serialNumber.toUpperCase() === key);
    if (product) {
      product.status = "active";
      product.ownerName = details.name;
      product.ownerPhone = details.phone;
      product.ownerEmail = details.email;
      product.activatedAt = (/* @__PURE__ */ new Date()).toISOString();
      product.licenseKey = licenseKey;
      return product;
    }
    return null;
  }
}
async function sendSms(to, body, config) {
  if (!config.TWILIO_ACCOUNT_SID || !config.TWILIO_AUTH_TOKEN || !config.TWILIO_FROM_NUMBER)
    return false;
  const creds = btoa(`${config.TWILIO_ACCOUNT_SID}:${config.TWILIO_AUTH_TOKEN}`);
  const r = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${config.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ To: to, From: config.TWILIO_FROM_NUMBER, Body: body }).toString()
    }
  );
  return r.ok;
}
async function sendEmail(to, subject, html, config) {
  if (!config.RESEND_API_KEY)
    return false;
  const domain = config.SUPPORT_EMAIL?.split("@")[1] || "yourdomain.com";
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: `${config.PORTAL_NAME || "Activation Portal"} <no-reply@${domain}>`,
      to: [to],
      subject,
      html
    })
  });
  return r.ok;
}
async function verifyShopifyHmac(body, signature, secret) {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
    return await crypto.subtle.verify("HMAC", key, sigBytes, body);
  } catch {
    return false;
  }
}
var src_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    if (path === "/config.json" || path === "/_worker.js") {
      return new Response("Forbidden", { status: 403 });
    }
    let mergedEnv = { ...env };
    if (env.ASSETS) {
      try {
        const configUrl = new URL("/config.json", request.url).toString();
        const res = await env.ASSETS.fetch(new Request(configUrl));
        if (res.ok) {
          const fileConfig = await res.json();
          for (const key in fileConfig) {
            if (fileConfig[key] !== void 0 && fileConfig[key] !== "") {
              mergedEnv[key] = fileConfig[key];
            }
          }
        }
      } catch (e) {
        console.error("Error reading config.json:", e);
      }
    }
    const co = getAllowedOrigin(request, mergedEnv);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(co) });
    }
    const sb = getSupabase(mergedEnv);
    try {
      if (path === "/api/ws") {
        const upgradeHeader = request.headers.get("Upgrade");
        if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
          return new Response("Expected Upgrade: websocket", { status: 426 });
        }
        const email = url.searchParams.get("email") || "";
        const password = url.searchParams.get("password") || "";
        let valid = false;
        if (email && password) {
          const cfEmail = (mergedEnv.ADMIN_EMAIL || "").trim().toLowerCase();
          const cfPassword = mergedEnv.ADMIN_PASSWORD || "";
          if (cfEmail && cfPassword && email.trim().toLowerCase() === cfEmail && (password === cfPassword || password.trim() === cfPassword.trim())) {
            valid = true;
          } else if (sb) {
            try {
              const { data } = await sb.from("admin_accounts").select("*").eq("email", email.trim().toLowerCase());
              if (data && data.length > 0) {
                valid = await verifyPassword(password, data[0].password);
              }
            } catch (dbErr) {
              console.error("Database WS auth query failed:", dbErr);
            }
          } else {
            const local = localAdmins.get(email.trim().toLowerCase());
            if (local) {
              valid = await verifyPassword(password, local.passwordHash);
            }
          }
        }
        if (!valid) {
          return new Response("Unauthorized", { status: 401 });
        }
        const pair = new WebSocketPair();
        const client = pair[0];
        const server = pair[1];
        server.accept();
        clients.add(server);
        server.addEventListener("close", () => {
          clients.delete(server);
        });
        server.addEventListener("error", () => {
          clients.delete(server);
        });
        server.send(JSON.stringify({ type: "history", data: logHistory }));
        return new Response(null, {
          status: 101,
          webSocket: client
        });
      }
      if (method === "GET" && path === "/admin") {
        return htmlResponse(ADMIN_HTML);
      }
      if (method === "GET" && (path === "/" || path === "/portal" || path === "/portal-no-otp")) {
        const config = await loadFullConfig(sb, mergedEnv);
        let html = PORTAL_NO_OTP_HTML;
        html = html.replace('data-api=""', `data-api="${url.origin}"`).replace('data-name="Activation Portal"', `data-name="${config.PORTAL_NAME || "Activation Portal"}"`).replace('data-sub="Product Registration"', `data-sub="${config.PORTAL_SUB || "Product Registration"}"`).replace('data-email="support@yourdomain.com"', `data-email="${config.SUPPORT_EMAIL || "support@yourdomain.com"}"`).replace('data-theme-hue="indigo"', `data-theme-hue="${config.THEME_HUE || "indigo"}"`).replace('data-logo-url=""', `data-logo-url="${config.PORTAL_LOGO_URL || ""}"`).replace('data-color-primary=""', `data-color-primary="${config.COLOR_PRIMARY || ""}"`).replace('data-color-bg=""', `data-color-bg="${config.COLOR_BG || ""}"`).replace('data-color-text=""', `data-color-text="${config.COLOR_TEXT || ""}"`).replace('data-color-card=""', `data-color-card="${config.COLOR_CARD || ""}"`).replace('data-color-border=""', `data-color-border="${config.COLOR_BORDER || ""}"`);
        return htmlResponse(html);
      }
      if (method === "GET" && path === "/api/health") {
        let supabaseStatus = "not configured (demo mode)";
        if (sb) {
          const { error } = await sb.from("products").select("serialNumber").limit(1);
          if (error) {
            supabaseStatus = `error: ${error.message} (Did you run the SQL schema template?)`;
          } else {
            supabaseStatus = "connected (tables ok)";
          }
        }
        return json({
          status: "ok",
          runtime: "Cloudflare Workers",
          supabase: supabaseStatus,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }, 200, co);
      }
      if (method === "GET" && path === "/api/branding") {
        const config = await loadFullConfig(sb, mergedEnv);
        return json({
          portalName: config.PORTAL_NAME,
          portalSub: config.PORTAL_SUB,
          supportEmail: config.SUPPORT_EMAIL,
          supportPhone: config.SUPPORT_PHONE,
          themeHue: config.THEME_HUE,
          portalLogoUrl: config.PORTAL_LOGO_URL,
          colorPrimary: config.COLOR_PRIMARY,
          colorBg: config.COLOR_BG,
          colorText: config.COLOR_TEXT,
          colorCard: config.COLOR_CARD,
          colorBorder: config.COLOR_BORDER
        }, 200, co);
      }
      if (method === "POST" && path === "/api/branding") {
        const authOk = await checkAdminAuth(request, sb, mergedEnv);
        if (!authOk) {
          return json({ success: false, message: "Unauthorized: Invalid admin credentials." }, 401, co);
        }
        const body = await request.json();
        const keyMap = {
          portalName: "PORTAL_NAME",
          portalSub: "PORTAL_SUB",
          supportEmail: "SUPPORT_EMAIL",
          supportPhone: "SUPPORT_PHONE",
          themeHue: "THEME_HUE",
          requireEnterprise: "REQUIRE_ENTERPRISE",
          corsWhitelistedOrigins: "CORS_ALLOWED_ORIGINS",
          twilioSid: "TWILIO_ACCOUNT_SID",
          twilioToken: "TWILIO_AUTH_TOKEN",
          twilioFrom: "TWILIO_FROM_NUMBER",
          resendKey: "RESEND_API_KEY",
          shopifyWebhookSecret: "SHOPIFY_WEBHOOK_SECRET",
          portalLogoUrl: "PORTAL_LOGO_URL",
          colorPrimary: "COLOR_PRIMARY",
          colorBg: "COLOR_BG",
          colorText: "COLOR_TEXT",
          colorCard: "COLOR_CARD",
          colorBorder: "COLOR_BORDER"
        };
        if (sb) {
          for (const key of Object.keys(body)) {
            if (body[key] !== void 0) {
              const dbKey = keyMap[key] || key;
              const { error } = await sb.from("portal_config").upsert({ key: dbKey, value: String(body[key]) });
              if (error) {
                console.error(`Failed to upsert ${dbKey} in portal_config:`, error.message);
                return json({ success: false, message: `Failed to save configuration: ${error.message}` }, 500, co);
              }
            }
          }
        } else {
          for (const key of Object.keys(body)) {
            if (body[key] !== void 0) {
              const dbKey = keyMap[key] || key;
              DEMO_CONFIG.set(dbKey, String(body[key]));
            }
          }
        }
        addLog("info", "Portal settings and credentials configuration updated via /api/branding.");
        return json({ success: true, message: "Configuration settings saved." }, 200, co);
      }
      if (method === "GET" && path === "/api/products/lookup") {
        const serial = url.searchParams.get("serial") || "";
        if (!serial) {
          return json({ success: false, message: "Missing 'serial' query parameter." }, 400, co);
        }
        const product = await findProduct(sb, serial);
        if (!product) {
          addLog("lookup", `Lookup failed: Serial registry key "${serial}" not found.`);
          return json({ success: false, message: "Serial number not found in registry." }, 404, co);
        }
        addLog("lookup", `Lookup success: Registry check for serial "${serial}". Product is "${product.productName}".`);
        return json({ success: true, data: product }, 200, co);
      }
      if (method === "POST" && path === "/api/otp/request") {
        const config = await loadFullConfig(sb, mergedEnv);
        const body = await request.json();
        const { serialNumber, name, phone, email } = body;
        if (!serialNumber || !name || !phone || !email) {
          return json({
            success: false,
            message: "All fields (serialNumber, name, phone, email) are required."
          }, 400, co);
        }
        if (name.length > 100)
          return json({ success: false, message: "Name must be 100 characters or less." }, 400, co);
        if (phone.length > 30 || !/^[+0-9\s()-]{5,30}$/.test(phone)) {
          return json({ success: false, message: "Invalid phone number format." }, 400, co);
        }
        if (email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return json({ success: false, message: "Invalid email address format." }, 400, co);
        }
        if (serialNumber.length > 50 || !/^[A-Z0-9-]+$/i.test(serialNumber)) {
          return json({ success: false, message: "Invalid serial number format." }, 400, co);
        }
        const now = Date.now();
        const timestamps = otpRequests.get(serialNumber) || [];
        const activeRequests = timestamps.filter((t) => now - t < 10 * 60 * 1e3);
        if (activeRequests.length >= 3) {
          return json({ success: false, message: "Too many verification requests for this serial key. Please try again in 10 minutes." }, 429, co);
        }
        activeRequests.push(now);
        otpRequests.set(serialNumber, activeRequests);
        const product = await findProduct(sb, serialNumber);
        if (!product) {
          return json({ success: false, message: "Serial number not found." }, 404, co);
        }
        if (product.status === "expired") {
          return json({
            success: false,
            message: "This product registry key has expired."
          }, 410, co);
        }
        if (product.status === "active" && product.useType === "one-time") {
          return json({
            success: false,
            message: "This product is already activated and is one-time use only."
          }, 409, co);
        }
        const code = generateOtpCode();
        const expiresAt2 = Date.now() + 10 * 60 * 1e3;
        await saveOtp(sb, serialNumber, code, { name, phone, email, serialNumber }, expiresAt2);
        const smsBody = `[${config.PORTAL_NAME}] Your activation code is: ${code}. Valid for 10 minutes.`;
        const emailHtml = `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:28px;border-radius:12px;background:#f9fafb;border:1px solid #e5e7eb">
            <h2 style="color:#1a1a1e;margin-bottom:8px">${config.PORTAL_NAME} \u2014 Activation Code</h2>
            <p style="color:#4b5563">Hi <strong>${name}</strong>, here is your one-time code:</p>
            <div style="font-size:38px;font-weight:900;letter-spacing:8px;text-align:center;padding:20px;background:#fff;border:2px solid #e5e7eb;border-radius:8px;color:#1a1a1e;margin:20px 0">${code}</div>
            <p style="color:#9ca3af;font-size:13px">Valid for 10 minutes. Do not share this code.</p>
          </div>`;
        const smsSent = await sendSms(phone, smsBody, config);
        const emailSent = await sendEmail(email, `Your ${config.PORTAL_NAME} Activation Code`, emailHtml, config);
        const twilioConfigured = !!(config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN && config.TWILIO_FROM_NUMBER);
        const resendConfigured = !!config.RESEND_API_KEY;
        const simulated = !twilioConfigured && !resendConfigured;
        if (simulated) {
          console.log(`[TEST MODE] Generated OTP Code for serial ${serialNumber}: ${code}`);
        }
        addLog("otp", `OTP generated: Code sent to ${email} / ${phone} for serial "${serialNumber}".${simulated ? ` [TEST CODE: ${code}]` : ""}`);
        return json({
          success: true,
          message: "Verification code sent.",
          delivery: {
            sms: smsSent ? "sent" : twilioConfigured ? "failed" : "simulated (Twilio not configured)",
            email: emailSent ? "sent" : resendConfigured ? "failed" : "simulated (Resend not configured)"
          },
          simulatedCode: simulated ? code : void 0
        }, 200, co);
      }
      if (method === "POST" && path === "/api/otp/verify") {
        const config = await loadFullConfig(sb, mergedEnv);
        const body = await request.json();
        const { serialNumber, code } = body;
        if (!serialNumber || !code) {
          return json({ success: false, message: "Both 'serialNumber' and 'code' are required." }, 400, co);
        }
        const record = await getOtp(sb, serialNumber);
        if (!record) {
          return json({ success: false, message: "No active session. Please request a new code." }, 404, co);
        }
        if (Date.now() > record.expiresAt) {
          await removeOtp(sb, serialNumber);
          return json({ success: false, message: "Code has expired. Please request a new one." }, 410, co);
        }
        if (record.code !== String(code).trim()) {
          return json({ success: false, message: "Incorrect code. Please try again." }, 401, co);
        }
        await removeOtp(sb, serialNumber);
        const licenseKey = generateLicenseKey(serialNumber);
        const activated = await activateProduct(sb, serialNumber, record.details, licenseKey);
        if (!activated) {
          return json({ success: false, message: "Activation failed: could not update product record." }, 500, co);
        }
        const certHtml = `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:28px;border-radius:12px;background:#f0fdf4;border:1px solid #bbf7d0">
            <h2 style="color:#166534">\u{1F389} Product Activated!</h2>
            <p style="color:#15803d">Hi <strong>${record.details.name}</strong>, your product is registered.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
              <tr><td style="padding:7px;color:#6b7280;border-bottom:1px solid #d1fae5">Product</td><td style="padding:7px;font-weight:600;border-bottom:1px solid #d1fae5">${activated.productName}</td></tr>
              <tr><td style="padding:7px;color:#6b7280;border-bottom:1px solid #d1fae5">Serial</td><td style="padding:7px;font-family:monospace;border-bottom:1px solid #d1fae5">${activated.serialNumber}</td></tr>
              <tr><td style="padding:7px;color:#6b7280">License Key</td><td style="padding:7px;font-family:monospace;font-weight:700;letter-spacing:2px">${licenseKey}</td></tr>
            </table>
            <p style="color:#9ca3af;font-size:12px">Contact <a href="mailto:${config.SUPPORT_EMAIL}">${config.SUPPORT_EMAIL}</a> if you need help.</p>
          </div>`;
        await sendEmail(
          record.details.email,
          `\u{1F389} ${config.PORTAL_NAME} \u2014 Activation Certificate`,
          certHtml,
          config
        );
        addLog("activation", `Activation success: Serial "${serialNumber}" activated. License key is "${licenseKey}".`, { serialNumber });
        return json({ success: true, data: activated }, 200, co);
      }
      if (method === "POST" && path === "/api/activate") {
        const config = await loadFullConfig(sb, mergedEnv);
        const body = await request.json();
        const { serialNumber, name, phone, email } = body;
        if (!serialNumber || !name || !phone || !email) {
          return json({
            success: false,
            message: "All fields (serialNumber, name, phone, email) are required."
          }, 400, co);
        }
        if (name.length > 100)
          return json({ success: false, message: "Name must be 100 characters or less." }, 400, co);
        if (phone.length > 30 || !/^[+0-9\s()-]{5,30}$/.test(phone)) {
          return json({ success: false, message: "Invalid phone number format." }, 400, co);
        }
        if (email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return json({ success: false, message: "Invalid email address format." }, 400, co);
        }
        if (serialNumber.length > 50 || !/^[A-Z0-9-]+$/i.test(serialNumber)) {
          return json({ success: false, message: "Invalid serial number format." }, 400, co);
        }
        const product = await findProduct(sb, serialNumber);
        if (!product) {
          return json({ success: false, message: "Serial number not found." }, 404, co);
        }
        if (product.status === "expired") {
          return json({
            success: false,
            message: "This product registry key has expired."
          }, 410, co);
        }
        if (product.status === "active" && product.useType === "one-time") {
          return json({
            success: false,
            message: "This product is already activated and is one-time use only."
          }, 409, co);
        }
        const licenseKey = generateLicenseKey(serialNumber);
        const details = { name, phone, email, serialNumber };
        const activated = await activateProduct(sb, serialNumber, details, licenseKey);
        if (!activated) {
          return json({ success: false, message: "Activation failed: could not update product record." }, 500, co);
        }
        const certHtml = `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:28px;border-radius:12px;background:#f0fdf4;border:1px solid #bbf7d0">
            <h2 style="color:#166534">\u{1F389} Product Activated!</h2>
            <p style="color:#15803d">Hi <strong>${name}</strong>, your product is registered.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
              <tr><td style="padding:7px;color:#6b7280;border-bottom:1px solid #d1fae5">Product</td><td style="padding:7px;font-weight:600;border-bottom:1px solid #d1fae5">${activated.productName}</td></tr>
              <tr><td style="padding:7px;color:#6b7280;border-bottom:1px solid #d1fae5">Serial</td><td style="padding:7px;font-family:monospace;border-bottom:1px solid #d1fae5">${activated.serialNumber}</td></tr>
              <tr><td style="padding:7px;color:#6b7280">License Key</td><td style="padding:7px;font-family:monospace;font-weight:700;letter-spacing:2px">${licenseKey}</td></tr>
            </table>
            <p style="color:#9ca3af;font-size:12px">Contact <a href="mailto:${config.SUPPORT_EMAIL}">${config.SUPPORT_EMAIL}</a> if you need help.</p>
          </div>`;
        await sendEmail(
          email,
          `\u{1F389} ${config.PORTAL_NAME} \u2014 Activation Certificate`,
          certHtml,
          config
        );
        addLog("activation", `Activation success (no OTP): Serial "${serialNumber}" activated. License key is "${licenseKey}".`, { serialNumber });
        return json({ success: true, data: activated }, 200, co);
      }
      if (method === "POST" && path === "/api/admin/login") {
        const body = await request.json();
        const { email, password } = body;
        const ip = request.headers.get("CF-Connecting-IP") || "unknown";
        const now = Date.now();
        const attempts = loginAttempts.get(ip) || { count: 0, lockoutUntil: 0 };
        if (attempts.lockoutUntil > now) {
          const waitMin = Math.ceil((attempts.lockoutUntil - now) / (60 * 1e3));
          return json({ success: false, message: `Too many login attempts. Locked out. Please try again in ${waitMin} minutes.` }, 429, co);
        }
        let valid = false;
        let adminName = "System Administrator";
        const inputEmail = email.trim().toLowerCase();
        const inputPassword = password;
        const cfEmail = (mergedEnv.ADMIN_EMAIL || "").trim().toLowerCase();
        const cfPassword = mergedEnv.ADMIN_PASSWORD || "";
        if (cfEmail && cfPassword && inputEmail === cfEmail && (inputPassword === cfPassword || inputPassword.trim() === cfPassword.trim())) {
          valid = true;
          adminName = "System Administrator";
        } else if (sb) {
          try {
            const { data } = await sb.from("admin_accounts").select("*").eq("email", inputEmail);
            if (data && data.length > 0) {
              valid = await verifyPassword(inputPassword, data[0].password);
              adminName = data[0].name || "System Administrator";
            }
          } catch (dbErr) {
            console.error("Database login query failed:", dbErr);
          }
        } else {
          const local = localAdmins.get(inputEmail);
          if (local) {
            valid = await verifyPassword(inputPassword, local.passwordHash);
            adminName = local.name || "System Administrator";
          }
        }
        if (!valid) {
          attempts.count += 1;
          if (attempts.count >= 5) {
            attempts.lockoutUntil = now + 15 * 60 * 1e3;
          }
          loginAttempts.set(ip, attempts);
          return json({ success: false, message: "Invalid administrator credentials." }, 401, co);
        }
        loginAttempts.delete(ip);
        return json({ success: true, admin: { email, name: adminName } }, 200, co);
      }
      const adminPaths = ["/api/products", "/api/config", "/api/reset", "/api/admin/config", "/api/admin/accounts"];
      const isDeleteProductPath = path.startsWith("/api/products/") && method === "DELETE";
      const isDeleteAdminPath = path.startsWith("/api/admin/accounts/") && method === "DELETE";
      const isBulkPath = path === "/api/products/bulk" && method === "POST";
      const isAddPath = path === "/api/products" && method === "POST";
      if (adminPaths.includes(path) || isDeleteProductPath || isDeleteAdminPath || isBulkPath || isAddPath) {
        if (path !== "/api/products/lookup") {
          const authOk = await checkAdminAuth(request, sb, mergedEnv);
          if (!authOk) {
            return json({ success: false, message: "Unauthorized: Invalid admin credentials." }, 401, co);
          }
        }
      }
      if (method === "GET" && path === "/api/products") {
        const { data, usingSupabase } = await allProducts(sb);
        return json({ success: true, data, usingSupabase }, 200, co);
      }
      if (method === "POST" && path === "/api/products") {
        const body = await request.json();
        const { serialNumber, productName, category, useType, expirationDate } = body;
        if (!serialNumber || !productName || !category) {
          return json({ success: false, message: "serialNumber, productName, and category are required." }, 400, co);
        }
        const key = serialNumber.trim().toUpperCase();
        const existing = await findProduct(sb, key);
        if (existing)
          return json({ success: false, message: `Serial '${key}' already exists.` }, 409, co);
        const product = {
          serialNumber: key,
          productName: productName.trim(),
          category: category.trim(),
          status: "unactivated",
          useType: useType === "unlimited" ? "unlimited" : "one-time",
          expirationDate: expirationDate || void 0
        };
        if (sb) {
          const { error } = await sb.from("products").insert(product);
          if (error)
            return json({ success: false, message: error.message }, 500, co);
        } else {
          DEMO_PRODUCTS.push(product);
        }
        addLog("info", `Manual creation: Serial key "${key}" for "${productName}" added to registry.`);
        return json({ success: true, data: product }, 200, co);
      }
      if (method === "POST" && path === "/api/products/bulk") {
        const body = await request.json();
        const { productsList } = body;
        if (!Array.isArray(productsList) || productsList.length === 0) {
          return json({ success: false, message: "'productsList' must be a non-empty array." }, 400, co);
        }
        const inserted = [];
        const skipped = [];
        for (const item of productsList) {
          const serial = item.serialNumber?.trim().toUpperCase();
          const name = item.productName?.trim();
          if (!serial || !name) {
            skipped.push({ serialNumber: serial || "UNKNOWN", reason: "Missing serialNumber or productName." });
            continue;
          }
          const exists = await findProduct(sb, serial);
          if (exists) {
            skipped.push({ serialNumber: serial, reason: "Already registered." });
            continue;
          }
          const p = {
            serialNumber: serial,
            productName: name,
            category: item.category?.trim() || "General",
            status: "unactivated",
            useType: item.useType === "unlimited" ? "unlimited" : "one-time"
          };
          if (sb) {
            await sb.from("products").insert(p);
          } else {
            DEMO_PRODUCTS.push(p);
          }
          inserted.push(p);
        }
        addLog("info", `Bulk registration: imported ${inserted.length} serial keys. ${skipped.length} keys skipped.`);
        return json({
          success: true,
          summary: `Processed ${productsList.length}. Inserted ${inserted.length}. Skipped ${skipped.length}.`,
          inserted,
          skipped
        }, 200, co);
      }
      const deleteMatch = path.match(/^\/api\/products\/([^/]+)$/);
      if (method === "DELETE" && deleteMatch) {
        const key = decodeURIComponent(deleteMatch[1]).trim().toUpperCase();
        if (sb) {
          await sb.from("products").delete().eq("serialNumber", key);
        } else {
          const idx = DEMO_PRODUCTS.findIndex((p) => p.serialNumber.toUpperCase() === key);
          if (idx !== -1)
            DEMO_PRODUCTS.splice(idx, 1);
        }
        addLog("delete", `Manual removal: Serial key "${key}" deleted from registry.`);
        return json({ success: true, message: `Deleted '${key}'.` }, 200, co);
      }
      if (method === "GET" && path === "/api/admin/config") {
        const config = await loadFullConfig(sb, mergedEnv);
        let sbStatus = false;
        let sbError = "";
        if (sb) {
          const { error } = await sb.from("products").select("serialNumber").limit(1);
          if (!error) {
            sbStatus = true;
          } else {
            sbError = error.message;
          }
        } else {
          sbError = "SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY variables are missing from your Cloudflare settings.";
        }
        return json({
          success: true,
          data: {
            PORTAL_NAME: config.PORTAL_NAME,
            PORTAL_SUB: config.PORTAL_SUB,
            SUPPORT_EMAIL: config.SUPPORT_EMAIL,
            SUPPORT_PHONE: config.SUPPORT_PHONE,
            CORS_ALLOWED_ORIGINS: config.CORS_ALLOWED_ORIGINS,
            TWILIO_ACCOUNT_SID: config.TWILIO_ACCOUNT_SID,
            TWILIO_FROM_NUMBER: config.TWILIO_FROM_NUMBER,
            THEME_HUE: config.THEME_HUE,
            PORTAL_LOGO_URL: config.PORTAL_LOGO_URL,
            COLOR_PRIMARY: config.COLOR_PRIMARY,
            COLOR_BG: config.COLOR_BG,
            COLOR_TEXT: config.COLOR_TEXT,
            COLOR_CARD: config.COLOR_CARD,
            COLOR_BORDER: config.COLOR_BORDER,
            // Mask secrets details for UI checks
            twilioTokenConfigured: !!config.TWILIO_AUTH_TOKEN,
            resendKeyConfigured: !!config.RESEND_API_KEY,
            shopifySecretConfigured: !!config.SHOPIFY_WEBHOOK_SECRET,
            twilioConfigured: !!(config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN),
            resendConfigured: !!config.RESEND_API_KEY,
            shopifyWebhookConfigured: !!config.SHOPIFY_WEBHOOK_SECRET
          },
          usingSupabase: sbStatus,
          supabaseError: sbError
        }, 200, co);
      }
      if (method === "POST" && path === "/api/admin/config") {
        const body = await request.json();
        const keys = [
          "PORTAL_NAME",
          "PORTAL_SUB",
          "SUPPORT_EMAIL",
          "SUPPORT_PHONE",
          "CORS_ALLOWED_ORIGINS",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_FROM_NUMBER",
          "THEME_HUE",
          "PORTAL_LOGO_URL",
          "COLOR_PRIMARY",
          "COLOR_BG",
          "COLOR_TEXT",
          "COLOR_CARD",
          "COLOR_BORDER"
        ];
        const tokens = ["TWILIO_AUTH_TOKEN", "RESEND_API_KEY", "SHOPIFY_WEBHOOK_SECRET"];
        if (sb) {
          for (const key of [...keys, ...tokens]) {
            if (body[key] !== void 0) {
              const { error } = await sb.from("portal_config").upsert({ key, value: body[key] });
              if (error) {
                console.error(`Failed to upsert ${key} in portal_config:`, error.message);
                return json({ success: false, message: `Failed to save configuration: ${error.message}` }, 500, co);
              }
            }
          }
        } else {
          for (const key of [...keys, ...tokens]) {
            if (body[key] !== void 0) {
              DEMO_CONFIG.set(key, body[key]);
            }
          }
        }
        addLog("info", "Portal settings and credentials configuration updated.");
        return json({ success: true, message: "Configuration settings saved." }, 200, co);
      }
      if (method === "GET" && path === "/api/admin/accounts") {
        if (sb) {
          const { data, error } = await sb.from("admin_accounts").select("email, name");
          if (error) {
            console.error("Failed to query admin_accounts table from Supabase:", error.message);
            const cfEmail = (mergedEnv.ADMIN_EMAIL || "").trim().toLowerCase();
            const list = cfEmail ? [{ email: cfEmail, name: "System Administrator" }] : [];
            return json({ success: true, data: list, warning: error.message }, 200, co);
          }
          return json({ success: true, data }, 200, co);
        } else {
          const cfEmail = (mergedEnv.ADMIN_EMAIL || "").trim().toLowerCase();
          const list = cfEmail ? [{ email: cfEmail, name: "System Administrator" }] : [];
          for (const [email, record] of localAdmins.entries()) {
            if (email !== cfEmail) {
              list.push({ email, name: record.name });
            }
          }
          return json({ success: true, data: list }, 200, co);
        }
      }
      if (method === "POST" && path === "/api/admin/accounts") {
        const body = await request.json();
        const { email, password, name } = body;
        if (!email || !password) {
          return json({ success: false, message: "Email and password are required." }, 400, co);
        }
        const key = email.trim().toLowerCase();
        if (sb) {
          const { data } = await sb.from("admin_accounts").select("*").eq("email", key);
          if (data && data.length > 0) {
            const updates = { password };
            if (name)
              updates.name = name;
            const { error } = await sb.from("admin_accounts").update(updates).eq("email", key);
            if (error)
              return json({ success: false, message: error.message }, 500, co);
            addLog("info", `Password updated for administrator "${key}".`);
          } else {
            const { error } = await sb.from("admin_accounts").insert({ email: key, password, name: name || "Admin User" });
            if (error)
              return json({ success: false, message: error.message }, 500, co);
            addLog("info", `New administrator account "${key}" registered.`);
          }
        } else {
          const passwordHash = await sha2562(password);
          localAdmins.set(key, { passwordHash, name: name || "Admin User" });
          addLog("info", `New administrator account "${key}" registered in-memory.`);
        }
        return json({ success: true, message: "Account saved." }, 200, co);
      }
      const deleteAdminMatch = path.match(/^\/api\/admin\/accounts\/([^/]+)$/);
      if (method === "DELETE" && deleteAdminMatch) {
        const email = decodeURIComponent(deleteAdminMatch[1]).trim().toLowerCase();
        let totalAdmins = 0;
        if (sb) {
          const { count } = await sb.from("admin_accounts").select("*", { count: "exact", head: true });
          totalAdmins = count || 0;
        } else {
          const cfEmail = (mergedEnv.ADMIN_EMAIL || "").trim().toLowerCase();
          totalAdmins = (cfEmail ? 1 : 0) + localAdmins.size;
        }
        if (totalAdmins <= 1) {
          return json({ success: false, message: "Cannot remove the last administrator account." }, 400, co);
        }
        if (sb) {
          const { error } = await sb.from("admin_accounts").delete().eq("email", email);
          if (error)
            return json({ success: false, message: error.message }, 500, co);
        } else {
          localAdmins.delete(email);
        }
        addLog("delete", `Administrator access removed for "${email}".`);
        return json({ success: true, message: "Account deleted." }, 200, co);
      }
      if (method === "POST" && path === "/api/reset") {
        if (sb) {
          await sb.from("otp_sessions").delete().neq("serialNumber", "");
          await sb.from("products").delete().neq("serialNumber", "");
          const defaults = [
            { serialNumber: "SN-DEMO-001", productName: "Sample Product Alpha", category: "Electronics", status: "unactivated", useType: "one-time" },
            { serialNumber: "SN-DEMO-002", productName: "Sample Product Beta", category: "Electronics", status: "unactivated", useType: "unlimited" }
          ];
          await sb.from("products").insert(defaults);
        } else {
          localOTPs.clear();
          DEMO_PRODUCTS.length = 0;
          DEMO_PRODUCTS.push(
            { serialNumber: "SN-DEMO-001", productName: "Sample Product Alpha", category: "Electronics", status: "unactivated", useType: "one-time" },
            { serialNumber: "SN-DEMO-002", productName: "Sample Product Beta", category: "Electronics", status: "unactivated", useType: "unlimited" }
          );
        }
        addLog("info", "Registry reset: cleared all entries and seeded defaults.");
        return json({ success: true, message: "Database reset to defaults." }, 200, co);
      }
      if (method === "POST" && path === "/webhooks/shopify/orders-paid") {
        const config = await loadFullConfig(sb, mergedEnv);
        const rawBody = await request.arrayBuffer();
        if (config.SHOPIFY_WEBHOOK_SECRET) {
          const sig = request.headers.get("x-shopify-hmac-sha256") || "";
          const valid = await verifyShopifyHmac(rawBody, sig, config.SHOPIFY_WEBHOOK_SECRET);
          if (!valid) {
            addLog("webhook", "Shopify webhook rejected: HMAC signature verification failed.");
            return json({ error: "Unauthorized: HMAC verification failed." }, 401, co);
          }
        }
        let order;
        try {
          order = JSON.parse(new TextDecoder().decode(rawBody));
        } catch {
          return json({ error: "Invalid JSON body." }, 400, co);
        }
        const lineItems = order.line_items || [];
        const generated = [];
        for (const item of lineItems) {
          const serial = `SN-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
          const product = {
            serialNumber: serial,
            productName: item.name || "Shopify Product",
            category: "Shopify Order",
            status: "unactivated",
            useType: "one-time"
          };
          if (sb)
            await sb.from("products").insert(product);
          generated.push(product);
        }
        addLog("webhook", `Shopify paid order webhook processed. Generated: ${generated.map((p) => p.serialNumber).join(", ")}`);
        return json({ received: true, generated }, 200, co);
      }
      return json({ error: "Route not found." }, 404, co);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal server error.";
      return json({ success: false, message }, 500, co);
    }
  }
};
export {
  src_default as default
};

