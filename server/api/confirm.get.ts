import { defineEventHandler, getQuery, sendRedirect } from "h3";
import { verifyConfirmToken } from "../utils/newsletterToken";

// Double opt-in confirmation. The link in the confirmation email points here.
// We verify the signed token, flip the Resend contact to confirmed
// (unsubscribed: false), then redirect to a localized thank-you page.

const LOCALES = ["en", "de", "es", "ru", "uk"];

// Build the localized /newsletter/confirmed path. i18n strategy is
// `prefix_except_default` (en has no prefix), so only non-en locales prefix.
function confirmedPath(locale: string, status: "ok" | "invalid"): string {
  const prefix = locale && locale !== "en" ? `/${locale}` : "";
  return `${prefix}/newsletter/confirmed?status=${status}`;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = typeof query.token === "string" ? query.token : "";
  const locale = LOCALES.includes(String(query.l)) ? String(query.l) : "en";

  const { resendApiKey, resendAudienceId, newsletterSecret } = useRuntimeConfig(event);

  const email = newsletterSecret ? verifyConfirmToken(token, newsletterSecret) : null;

  if (!email || !resendApiKey || !resendAudienceId) {
    return sendRedirect(event, confirmedPath(locale, "invalid"), 302);
  }

  // Flip the contact to confirmed.
  const res = await fetch(
    `https://api.resend.com/audiences/${resendAudienceId}/contacts/${encodeURIComponent(email)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ unsubscribed: false }),
    }
  );

  if (!res.ok) {
    console.error(`[confirm] Resend patch error ${res.status} for ${email}`);
    return sendRedirect(event, confirmedPath(locale, "invalid"), 302);
  }

  return sendRedirect(event, confirmedPath(locale, "ok"), 302);
});
