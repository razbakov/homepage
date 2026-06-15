import { defineEventHandler, readBody, createError, getRequestURL } from "h3";
import { createConfirmToken } from "../utils/newsletterToken";

// Newsletter signup — double opt-in (GDPR).
//
// 1. The email is added to the Resend Audience as `unsubscribed: true`, which
//    means "pending confirmation": such contacts are excluded from broadcasts.
// 2. A confirmation email with a signed token link is sent. Clicking it hits
//    /api/confirm, which flips the contact to `unsubscribed: false` (confirmed).
//
// An already-confirmed contact is never downgraded and gets no duplicate mail.
// The Resend key never leaves the server — it is read from runtimeConfig.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FROM = "Alösha <hello@razbakov.com>";
const REPLY_TO = "alex@razbakov.com";

type Locale = "en" | "de" | "es" | "ru" | "uk";

// Confirmation email copy per locale. Kept here (not in i18n json) because it's
// server-rendered HTML, never shipped to the client bundle.
const EMAIL: Record<Locale, { subject: string; heading: string; body: string; button: string; footer: string }> = {
  en: {
    subject: "Confirm your subscription to Alösha's newsletter",
    heading: "One more step",
    body: "Thanks for subscribing! Please confirm your email to start receiving updates on new posts, projects, and collaborations.",
    button: "Confirm subscription",
    footer: "If you didn't request this, you can safely ignore this email.",
  },
  de: {
    subject: "Bestätige dein Abo von Alöshas Newsletter",
    heading: "Nur noch ein Schritt",
    body: "Danke fürs Abonnieren! Bitte bestätige deine E-Mail, um Updates zu neuen Beiträgen, Projekten und Kooperationen zu erhalten.",
    button: "Abo bestätigen",
    footer: "Falls du das nicht angefordert hast, kannst du diese E-Mail ignorieren.",
  },
  es: {
    subject: "Confirma tu suscripción al boletín de Alösha",
    heading: "Un paso más",
    body: "¡Gracias por suscribirte! Confirma tu correo para empezar a recibir novedades sobre nuevas publicaciones, proyectos y colaboraciones.",
    button: "Confirmar suscripción",
    footer: "Si no solicitaste esto, puedes ignorar este correo con tranquilidad.",
  },
  ru: {
    subject: "Подтвердите подписку на рассылку Alösha",
    heading: "Остался один шаг",
    body: "Спасибо за подписку! Подтвердите свой адрес, чтобы получать новости о новых постах, проектах и коллаборациях.",
    button: "Подтвердить подписку",
    footer: "Если вы не запрашивали это письмо, просто проигнорируйте его.",
  },
  uk: {
    subject: "Підтвердьте підписку на розсилку Alösha",
    heading: "Залишився один крок",
    body: "Дякуємо за підписку! Підтвердьте свою адресу, щоб отримувати новини про нові пости, проєкти та співпрацю.",
    button: "Підтвердити підписку",
    footer: "Якщо ви не запитували цей лист, просто проігноруйте його.",
  },
};

function confirmEmailHtml(confirmUrl: string, t: (typeof EMAIL)[Locale]): string {
  return `<!doctype html>
<html><body style="margin:0;background:#fffbf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;">
    <h1 style="font-size:22px;margin:0 0 16px;color:#111827;">${t.heading}</h1>
    <p style="font-size:15px;line-height:1.6;margin:0 0 28px;color:#374151;">${t.body}</p>
    <a href="${confirmUrl}" style="display:inline-block;background:#ff6f61;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:9999px;">${t.button}</a>
    <p style="font-size:13px;line-height:1.6;margin:32px 0 0;color:#9ca3af;">${t.footer}</p>
    <p style="font-size:13px;margin:8px 0 0;color:#9ca3af;">— Alösha · <a href="https://razbakov.com" style="color:#9ca3af;">razbakov.com</a></p>
  </div>
</body></html>`;
}

async function resendFetch(path: string, apiKey: string, init: RequestInit) {
  return fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; locale?: string }>(event);
  const email = (body?.email ?? "").trim().toLowerCase();
  const locale = (["en", "de", "es", "ru", "uk"].includes(body?.locale ?? "") ? body!.locale : "en") as Locale;

  if (!email || !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, statusMessage: "Please enter a valid email address." });
  }

  const { resendApiKey, resendAudienceId, newsletterSecret } = useRuntimeConfig(event);

  if (!resendApiKey || !resendAudienceId || !newsletterSecret) {
    console.error("[subscribe] Missing RESEND_API_KEY / RESEND_AUDIENCE_ID / NEWSLETTER_SECRET env var");
    throw createError({ statusCode: 500, statusMessage: "Newsletter is not configured yet. Try again later." });
  }

  // 1. Look up the contact. An already-confirmed contact must not be downgraded.
  const existingRes = await resendFetch(
    `/audiences/${resendAudienceId}/contacts/${encodeURIComponent(email)}`,
    resendApiKey,
    { method: "GET" }
  );

  if (existingRes.ok) {
    // Resend returns the contact fields at the top level (no `data` wrapper):
    // { object, id, email, unsubscribed, ... }
    const existing = (await existingRes.json()) as { unsubscribed?: boolean };
    if (existing?.unsubscribed === false) {
      return { ok: true, status: "already_subscribed" };
    }
    // Exists but still pending (unsubscribed: true) — fall through and re-send
    // the confirmation email below.
  } else if (existingRes.status === 404) {
    // 2. Not a contact yet — add as pending (unsubscribed: true).
    const createRes = await resendFetch(`/audiences/${resendAudienceId}/contacts`, resendApiKey, {
      method: "POST",
      body: JSON.stringify({ email, unsubscribed: true }),
    });
    if (!createRes.ok && createRes.status !== 409) {
      console.error(`[subscribe] Resend create error ${createRes.status}`);
      throw createError({ statusCode: 502, statusMessage: "Could not subscribe right now. Please try again later." });
    }
  } else {
    console.error(`[subscribe] Resend lookup error ${existingRes.status}`);
    throw createError({ statusCode: 502, statusMessage: "Could not subscribe right now. Please try again later." });
  }

  // 3. Send the confirmation email with a signed token link.
  const token = createConfirmToken(email, newsletterSecret);
  const origin = getRequestURL(event).origin;
  const confirmUrl = `${origin}/api/confirm?token=${encodeURIComponent(token)}&l=${locale}`;
  const copy = EMAIL[locale];

  const mailRes = await resendFetch(`/emails`, resendApiKey, {
    method: "POST",
    body: JSON.stringify({
      from: FROM,
      to: email,
      reply_to: REPLY_TO,
      subject: copy.subject,
      html: confirmEmailHtml(confirmUrl, copy),
    }),
  });

  if (!mailRes.ok) {
    const detail = await mailRes.text();
    console.error(`[subscribe] Resend email error ${mailRes.status}: ${detail}`);
    // The contact is saved as pending; surface a soft error so the user can retry.
    throw createError({ statusCode: 502, statusMessage: "Couldn't send the confirmation email. Please try again later." });
  }

  return { ok: true, status: "pending_confirmation" };
});
