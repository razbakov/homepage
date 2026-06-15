import { defineEventHandler, getQuery, sendRedirect } from "h3";
import { verifyConfirmToken } from "../utils/newsletterToken";
import { brandedEmail, sendNewsletterEmail, localeHome, type Locale } from "../utils/newsletterMail";

// Double opt-in confirmation. The link in the confirmation email points here.
// We verify the signed token, flip the Resend contact to confirmed
// (unsubscribed: false), send a welcome email, then redirect to a localized
// thank-you page.

const LOCALES = ["en", "de", "es", "ru", "uk"];

// Welcome email copy per locale, sent once the subscription is confirmed.
const WELCOME: Record<Locale, { subject: string; heading: string; body: string; button: string; footer: string }> = {
  en: {
    subject: "Welcome to Alösha's newsletter 🎉",
    heading: "You're in!",
    body: "Thanks for confirming. I'll write when I publish new posts, ship projects, or open up collaborations — and nothing in between. No spam, unsubscribe anytime.",
    button: "Read the latest posts",
    footer: "Glad to have you here.",
  },
  de: {
    subject: "Willkommen bei Alöshas Newsletter 🎉",
    heading: "Du bist dabei!",
    body: "Danke für die Bestätigung. Ich schreibe, wenn ich neue Beiträge veröffentliche, Projekte starte oder Kooperationen öffne — und nichts dazwischen. Kein Spam, jederzeit abbestellbar.",
    button: "Neueste Beiträge lesen",
    footer: "Schön, dass du dabei bist.",
  },
  es: {
    subject: "Bienvenido al boletín de Alösha 🎉",
    heading: "¡Ya estás dentro!",
    body: "Gracias por confirmar. Escribiré cuando publique nuevos artículos, lance proyectos o abra colaboraciones — y nada más. Sin spam, puedes darte de baja cuando quieras.",
    button: "Leer las últimas publicaciones",
    footer: "Me alegra tenerte aquí.",
  },
  ru: {
    subject: "Добро пожаловать в рассылку Alösha 🎉",
    heading: "Вы подписаны!",
    body: "Спасибо за подтверждение. Я напишу, когда опубликую новые посты, запущу проекты или открою коллаборации — и ничего лишнего. Никакого спама, отписаться можно в любой момент.",
    button: "Читать последние посты",
    footer: "Рад, что вы здесь.",
  },
  uk: {
    subject: "Ласкаво просимо до розсилки Alösha 🎉",
    heading: "Ви підписані!",
    body: "Дякуємо за підтвердження. Я напишу, коли опублікую нові пости, запущу проєкти або відкрию співпрацю — і нічого зайвого. Жодного спаму, відписатися можна будь-коли.",
    button: "Читати останні пости",
    footer: "Радий, що ви тут.",
  },
};

// Build the localized /newsletter/confirmed path. i18n strategy is
// `prefix_except_default` (en has no prefix), so only non-en locales prefix.
function confirmedPath(locale: string, status: "ok" | "invalid"): string {
  const prefix = locale && locale !== "en" ? `/${locale}` : "";
  return `${prefix}/newsletter/confirmed?status=${status}`;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = typeof query.token === "string" ? query.token : "";
  const locale = (LOCALES.includes(String(query.l)) ? String(query.l) : "en") as Locale;

  const { resendApiKey, resendAudienceId, newsletterSecret } = useRuntimeConfig(event);

  const email = newsletterSecret ? verifyConfirmToken(token, newsletterSecret) : null;

  if (!email || !resendApiKey || !resendAudienceId) {
    return sendRedirect(event, confirmedPath(locale, "invalid"), 302);
  }

  // Was this contact already confirmed before this click? If so, skip the
  // welcome email so a re-clicked link doesn't send a duplicate.
  let alreadyConfirmed = false;
  const lookup = await fetch(
    `https://api.resend.com/audiences/${resendAudienceId}/contacts/${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${resendApiKey}` } }
  );
  if (lookup.ok) {
    const c = (await lookup.json()) as { unsubscribed?: boolean };
    alreadyConfirmed = c?.unsubscribed === false;
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

  // Send the welcome email (only on first confirmation). Failure here must not
  // block confirmation — the subscription is already valid, so we log and move on.
  if (!alreadyConfirmed) {
    const copy = WELCOME[locale];
    const html = brandedEmail({
      heading: copy.heading,
      body: copy.body,
      footer: copy.footer,
      cta: { label: copy.button, href: localeHome(locale) },
    });
    try {
      const mail = await sendNewsletterEmail(resendApiKey, email, copy.subject, html);
      if (!mail.ok) console.error(`[confirm] welcome email failed ${mail.status} for ${email}`);
    } catch (err) {
      console.error(`[confirm] welcome email threw for ${email}`, err);
    }
  }

  return sendRedirect(event, confirmedPath(locale, "ok"), 302);
});
