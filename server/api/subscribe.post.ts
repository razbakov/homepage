import { defineEventHandler, readBody, createError } from "h3";

// Newsletter signup endpoint. Adds an email to the razbakov.com Resend Audience.
// Runs as a Netlify Function (see nitro.preset = "netlify" in nuxt.config.ts).
// The Resend API key never leaves the server — it is read from runtimeConfig.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event);
  const email = (body?.email ?? "").trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, statusMessage: "Please enter a valid email address." });
  }

  const { resendApiKey, resendAudienceId } = useRuntimeConfig(event);

  if (!resendApiKey || !resendAudienceId) {
    // Misconfiguration on the server — surface a clear 500 so the UI can show
    // an error instead of silently pretending the subscription worked.
    console.error("[subscribe] Missing RESEND_API_KEY or RESEND_AUDIENCE_ID env var");
    throw createError({ statusCode: 500, statusMessage: "Newsletter is not configured yet. Try again later." });
  }

  const res = await fetch(`https://api.resend.com/audiences/${resendAudienceId}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  });

  if (res.ok) {
    return { ok: true, status: "subscribed" };
  }

  // Resend returns a non-2xx for an already-present contact. Treat any
  // "already exists" style response as a soft success so repeat signups
  // get a friendly message rather than a scary error.
  let detail = "";
  try {
    const err = (await res.json()) as { message?: string; name?: string };
    detail = `${err?.name ?? ""} ${err?.message ?? ""}`.toLowerCase();
  } catch {
    // non-JSON body — fall through to generic handling
  }

  if (res.status === 409 || detail.includes("already")) {
    return { ok: true, status: "already_subscribed" };
  }

  console.error(`[subscribe] Resend error ${res.status}: ${detail}`);
  throw createError({ statusCode: 502, statusMessage: "Could not subscribe right now. Please try again later." });
});
