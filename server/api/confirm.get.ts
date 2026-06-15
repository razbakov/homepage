import { defineEventHandler, getQuery, getRequestURL, sendRedirect } from "h3";
import { verifyConfirmToken, createConfirmToken } from "../utils/newsletterToken";
import { brandedEmail, sendNewsletterEmail, type Locale } from "../utils/newsletterMail";

// Double opt-in confirmation. The link in the confirmation email points here.
// We verify the signed token, flip the Resend contact to confirmed
// (unsubscribed: false), send a welcome email, then redirect to a localized
// thank-you page.

const LOCALES = ["en", "de", "es", "ru", "uk"];

// Cornerstone post — the "start here" essay every new subscriber is pointed to,
// per locale (each language has its own translated URL; all verified to 200).
const CORNERSTONE: Record<Locale, string> = {
  en: "https://razbakov.com/blog/2026-06-01-god-as-mediator-en",
  de: "https://razbakov.com/de/blog/2026-06-01-god-as-mediator-de",
  es: "https://razbakov.com/es/blog/2026-06-01-god-as-mediator-es",
  ru: "https://razbakov.com/ru/blog/2026-06-01-god-as-mediator-ru",
  uk: "https://razbakov.com/uk/blog/2026-06-01-god-as-mediator-uk",
};

// Welcome email copy per locale, sent once the subscription is confirmed.
const WELCOME: Record<Locale, { subject: string; heading: string; body: string; button: string; note: string; unsubscribe: string }> = {
  en: {
    subject: "Welcome — what brought you here?",
    heading: "Glad you're here.",
    body: "I'm Alösha — I build AI systems, teach salsa, and write to think out loud and find people who do the same. You'll hear from me when I publish an essay, ship something, or open a collaboration — roughly once or twice a month, and only when it's worth your time.",
    button: "Start with this →",
    note: "And I'd genuinely like to know: what brought you here? Just hit reply — every message reaches me, and I read them all.",
    unsubscribe: "Unsubscribe",
  },
  de: {
    subject: "Willkommen — was hat dich hergebracht?",
    heading: "Schön, dass du da bist.",
    body: "Ich bin Alösha — ich baue KI-Systeme, unterrichte Salsa und schreibe, um laut zu denken und Menschen zu finden, die das auch tun. Du hörst von mir, wenn ich einen Essay veröffentliche, etwas baue oder eine Kooperation öffne — etwa ein- bis zweimal im Monat, und nur, wenn es deine Zeit wert ist.",
    button: "Fang hier an →",
    note: "Und ich würde wirklich gern wissen: Was hat dich hergebracht? Antworte einfach — jede Nachricht erreicht mich, und ich lese alle.",
    unsubscribe: "Abbestellen",
  },
  es: {
    subject: "Bienvenido — ¿qué te trajo aquí?",
    heading: "Me alegra que estés aquí.",
    body: "Soy Alösha — construyo sistemas de IA, enseño salsa y escribo para pensar en voz alta y encontrar a personas que hacen lo mismo. Tendrás noticias mías cuando publique un ensayo, lance algo o abra una colaboración — una o dos veces al mes, y solo cuando valga tu tiempo.",
    button: "Empieza por aquí →",
    note: "Y me encantaría saber: ¿qué te trajo aquí? Solo responde a este correo — cada mensaje me llega y los leo todos.",
    unsubscribe: "Cancelar suscripción",
  },
  ru: {
    subject: "Добро пожаловать — что вас привело?",
    heading: "Рад, что вы здесь.",
    body: "Я Alösha — строю ИИ-системы, преподаю сальсу и пишу, чтобы думать вслух и находить людей, которые делают то же самое. Я напишу, когда опубликую эссе, что-то запущу или открою коллаборацию — примерно раз или два в месяц и только когда это стоит вашего времени.",
    button: "Начните с этого →",
    note: "И мне правда интересно: что вас сюда привело? Просто ответьте на это письмо — каждое сообщение доходит до меня, и я читаю их все.",
    unsubscribe: "Отписаться",
  },
  uk: {
    subject: "Ласкаво просимо — що вас привело?",
    heading: "Радий, що ви тут.",
    body: "Я Alösha — будую ШІ-системи, викладаю сальсу і пишу, щоб думати вголос і знаходити людей, які роблять те саме. Я напишу, коли опублікую есе, щось запущу або відкрию співпрацю — приблизно раз чи двічі на місяць і лише коли це варте вашого часу.",
    button: "Почніть із цього →",
    note: "І мені справді цікаво: що вас сюди привело? Просто дайте відповідь на цей лист — кожне повідомлення доходить до мене, і я читаю всі.",
    unsubscribe: "Відписатися",
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
    const origin = getRequestURL(event).origin;
    const unsubUrl = `${origin}/api/unsubscribe?token=${encodeURIComponent(createConfirmToken(email, newsletterSecret))}&l=${locale}`;
    const html = brandedEmail({
      heading: copy.heading,
      body: copy.body,
      footer: "",
      cta: { label: copy.button, href: CORNERSTONE[locale] },
      note: copy.note,
      unsubscribe: { label: copy.unsubscribe, href: unsubUrl },
    });
    try {
      const mail = await sendNewsletterEmail(resendApiKey, email, copy.subject, html, unsubUrl);
      if (!mail.ok) console.error(`[confirm] welcome email failed ${mail.status} for ${email}`);
    } catch (err) {
      console.error(`[confirm] welcome email threw for ${email}`, err);
    }
  }

  return sendRedirect(event, confirmedPath(locale, "ok"), 302);
});
