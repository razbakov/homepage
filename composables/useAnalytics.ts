export function useAnalytics() {
  const { $posthog } = useNuxtApp()

  function track(event: string, properties?: Record<string, unknown>) {
    const posthog = $posthog?.()
    if (posthog) {
      posthog.capture(event, properties)
    }
  }

  function trackCtaClick(label: string, href: string) {
    track('cta_click', { label, href, page: useRoute().path })
  }

  function trackCalendlyOpen(source: string) {
    track('calendly_open', { source })
  }

  function trackEmailClick(source: string) {
    track('email_click', { source })
  }

  function trackSocialLinkClick(platform: string, href: string) {
    track('social_link_click', { platform, href })
  }

  function trackOutboundLinkClick(href: string) {
    track('outbound_link_click', { href, page: useRoute().path })
  }

  function trackBlogPostRead(slug: string, title: string) {
    track('blog_post_read', { slug, title })
  }

  function trackProjectView(slug: string, title: string) {
    track('project_view', { slug, title })
  }

  function trackLanguageSwitch(from: string, to: string) {
    track('language_switch', { from, to })
  }

  function trackCvDownload() {
    track('cv_download', { page: useRoute().path })
  }

  return {
    track,
    trackCtaClick,
    trackCalendlyOpen,
    trackEmailClick,
    trackSocialLinkClick,
    trackOutboundLinkClick,
    trackBlogPostRead,
    trackProjectView,
    trackLanguageSwitch,
    trackCvDownload,
  }
}
