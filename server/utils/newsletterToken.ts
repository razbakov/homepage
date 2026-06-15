import { createHmac, timingSafeEqual } from "node:crypto";

// Double opt-in confirmation tokens. A token is a stateless, signed payload —
// no database needed. Shape: base64url(`<email>:<expiresAtMs>`) + "." + hmac.
// The HMAC (keyed with NUXT_NEWSLETTER_SECRET) makes it unforgeable, so the
// /api/confirm route can trust the email without storing anything server-side.

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(input: string): string {
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

function sign(payload: string, secret: string): string {
  return b64url(createHmac("sha256", secret).update(payload).digest());
}

export function createConfirmToken(email: string, secret: string, now = Date.now()): string {
  const payload = `${email}:${now + TOKEN_TTL_MS}`;
  return `${b64url(payload)}.${sign(payload, secret)}`;
}

// Returns the email if the token is valid and unexpired, otherwise null.
export function verifyConfirmToken(token: string, secret: string, now = Date.now()): string | null {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;

  const encodedPayload = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  let payload: string;
  try {
    payload = b64urlDecode(encodedPayload);
  } catch {
    return null;
  }

  const expected = sign(payload, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const sep = payload.lastIndexOf(":");
  if (sep < 0) return null;
  const email = payload.slice(0, sep);
  const expiresAt = Number(payload.slice(sep + 1));
  if (!email || !Number.isFinite(expiresAt) || now > expiresAt) return null;

  return email;
}
