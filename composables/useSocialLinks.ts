// Single source of truth for Alösha's social + contact links.
// Used by the homepage hero and the site footer so links never drift apart.

export interface SocialLink {
  href: string
  icon: string
  label: string
}

const WHATSAPP_NUMBER = "4915782039401"

export function useSocialLinks() {
  const { locale } = useI18n()

  // Telegram routes Russian/Ukrainian visitors to the RU channel.
  const telegramUrl = computed(() =>
    ["ru", "uk"].includes(locale.value)
      ? "https://t.me/razbakov_ru"
      : "https://t.me/razbakov"
  )

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`

  const socialLinks = computed<SocialLink[]>(() => [
    { href: telegramUrl.value, icon: "simple-icons:telegram", label: "Telegram" },
    { href: "https://x.com/razbakov", icon: "simple-icons:x", label: "X" },
    { href: "https://youtube.com/@razbakov", icon: "simple-icons:youtube", label: "YouTube" },
    { href: "https://www.linkedin.com/in/razbakov/", icon: "simple-icons:linkedin", label: "LinkedIn" },
    { href: "https://www.threads.net/@alosha_timba_munich", icon: "simple-icons:threads", label: "Threads" },
    { href: "https://github.com/razbakov", icon: "simple-icons:github", label: "GitHub" },
  ])

  return {
    socialLinks,
    telegramUrl,
    whatsappUrl,
  }
}
