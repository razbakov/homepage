// Shared Resend email helpers for the newsletter (confirmation + welcome).
// Server-only — the API key and these HTML templates never reach the client.

export type Locale = "en" | "de" | "es" | "ru" | "uk";

const FROM = "Alösha <hello@razbakov.com>";
const REPLY_TO = "alex@razbakov.com";

export interface Cta {
  label: string;
  href: string;
}

// One branded email shell (warm coral, matches the site) used by every
// newsletter email so they stay visually consistent.
//   - cta:   optional primary button
//   - note:  optional normal-weight paragraph after the CTA (e.g. a reply prompt)
//   - footer: small grey closing line
//   - unsubscribe: optional {label, href} rendered as a tiny grey footer link
export function brandedEmail(opts: {
  heading: string;
  body: string;
  footer: string;
  cta?: Cta;
  note?: string;
  unsubscribe?: Cta;
}): string {
  const { heading, body, footer, cta, note, unsubscribe } = opts;
  const ctaHtml = cta
    ? `<a href="${cta.href}" style="display:inline-block;background:#ff6f61;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:9999px;">${cta.label}</a>`
    : "";
  const noteHtml = note
    ? `<p style="font-size:15px;line-height:1.6;margin:28px 0 0;color:#374151;">${note}</p>`
    : "";
  const footerHtml = footer
    ? `<p style="font-size:13px;line-height:1.6;margin:32px 0 0;color:#9ca3af;">${footer}</p>`
    : "";
  const unsubHtml = unsubscribe
    ? `<p style="font-size:12px;margin:20px 0 0;color:#c4c4c4;"><a href="${unsubscribe.href}" style="color:#c4c4c4;text-decoration:underline;">${unsubscribe.label}</a></p>`
    : "";
  return `<!doctype html>
<html><body style="margin:0;background:#fffbf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;">
    <h1 style="font-size:22px;margin:0 0 16px;color:#111827;">${heading}</h1>
    <p style="font-size:15px;line-height:1.6;margin:0 0 28px;color:#374151;">${body}</p>
    ${ctaHtml}
    ${noteHtml}
    ${footerHtml}
    <p style="font-size:13px;margin:8px 0 0;color:#9ca3af;">— Alösha · <a href="https://razbakov.com" style="color:#9ca3af;">razbakov.com</a></p>
    ${unsubHtml}
  </div>
</body></html>`;
}

export async function sendNewsletterEmail(
  apiKey: string,
  to: string,
  subject: string,
  html: string,
  // When provided, sets RFC 8058 one-click unsubscribe headers so Gmail/Apple
  // Mail show a native "Unsubscribe" control and inbox placement improves.
  listUnsubscribeUrl?: string
): Promise<Response> {
  const headers: Record<string, string> = listUnsubscribeUrl
    ? {
        "List-Unsubscribe": `<${listUnsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      }
    : {};
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, reply_to: REPLY_TO, subject, html, headers }),
  });
}

// Localized homepage URL for email CTAs (i18n strategy: prefix_except_default).
export function localeHome(locale: Locale): string {
  return locale === "en" ? "https://razbakov.com" : `https://razbakov.com/${locale}`;
}
