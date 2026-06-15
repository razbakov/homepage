import { defineEventHandler, getQuery, getMethod, sendRedirect } from "h3";
import { verifyConfirmToken } from "../utils/newsletterToken";

// Newsletter unsubscribe. Reached two ways:
//   - GET  — the subscriber clicks the "Unsubscribe" link in an email footer.
//   - POST — RFC 8058 one-click, fired automatically by Gmail/Apple Mail's
//            native unsubscribe button (List-Unsubscribe-Post header).
// Both verify the signed token and set the Resend contact to unsubscribed: true.

const LOCALES = ["en", "de", "es", "ru", "uk"];

function unsubscribedPath(locale: string, status: "ok" | "invalid"): string {
  const prefix = locale && locale !== "en" ? `/${locale}` : "";
  return `${prefix}/newsletter/unsubscribed?status=${status}`;
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const query = getQuery(event);
  const token = typeof query.token === "string" ? query.token : "";
  const locale = LOCALES.includes(String(query.l)) ? String(query.l) : "en";

  const { resendApiKey, resendAudienceId, newsletterSecret } = useRuntimeConfig(event);
  const email = newsletterSecret ? verifyConfirmToken(token, newsletterSecret) : null;

  let ok = false;
  if (email && resendApiKey && resendAudienceId) {
    const res = await fetch(
      `https://api.resend.com/audiences/${resendAudienceId}/contacts/${encodeURIComponent(email)}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ unsubscribed: true }),
      }
    );
    ok = res.ok;
    if (!ok) console.error(`[unsubscribe] Resend patch error ${res.status} for ${email}`);
  }

  // One-click (POST) expects a plain 200 with no redirect.
  if (method === "POST") {
    return { ok };
  }

  return sendRedirect(event, unsubscribedPath(locale, ok ? "ok" : "invalid"), 302);
});
