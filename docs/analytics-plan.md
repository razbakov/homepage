# Analytics Audit & Improvement Plan

## Current State

### PostHog (installed)

- **Package**: `posthog-js` v1.205.0
- **Plugin**: `plugins/posthog.client.js` — client-side Nuxt plugin
- **Config**: `content/config.json` → `site.analytics.posthog`
  - Public key: `phc_OmGQ7s6qOxYgndhw6m3gh18Kkby0a2NdMGx4lGsEoob`
  - Host: `https://eu.i.posthog.com` (EU data residency)
- **Runtime config**: `nuxt.config.ts` exposes `posthogPublicKey` and `posthogHost` via `runtimeConfig.public`

### What PostHog currently tracks

- **Pageviews**: Manual `$pageview` capture on every route change via `router.afterEach()`
- **Person profiles**: `identified_only` — anonymous users are not profiled
- **Debug mode**: Enabled in development

### What is NOT set up

- No custom event tracking (CTA clicks, form submissions, outbound links)
- No cookie consent / GDPR banner
- No Google Analytics, Plausible, or any other analytics provider
- No Meta Pixel, LinkedIn Insight, or ad tracking pixels
- No error tracking (Sentry, LogRocket, etc.)
- No Web Vitals / performance monitoring
- No `$posthog` usage in any Vue component — only the plugin captures pageviews

---

## Recommended Improvements

PostHog is the preferred analytics tool for the org. All improvements below build on the existing PostHog setup.

### Priority 1: GDPR Cookie Consent

**Why**: PostHog sets cookies and tracks users in the EU. Without consent, the site is non-compliant with GDPR/ePrivacy.

**Tasks**:

- [ ] Add a cookie consent banner component (e.g., use PostHog's `opt_in_capturing()` / `opt_out_capturing()` API)
- [ ] Initialize PostHog with `persistence: 'memory'` or delay init until consent is granted
- [ ] Store consent preference in `localStorage` and respect it on subsequent visits
- [ ] Add a privacy policy page (or link to one) explaining what data is collected
- [ ] Add a "Cookie Settings" link in the footer to allow users to change preferences

**Implementation notes**:
- PostHog supports `posthog.opt_out_capturing()` and `posthog.opt_in_capturing()` natively
- Consider `posthog.has_opted_out_capturing()` to check status on init
- For EU hosting (already configured), this is the minimum required

### Priority 2: Custom Event Tracking

**Why**: Pageviews alone don't tell you what users care about. Track meaningful interactions to understand user behavior and optimize conversions.

**Key events to track**:

| Event | Location | Details |
|-------|----------|---------|
| `cta_click` | About page CTAs | Which CTA, button text |
| `calendly_open` | "Schedule a Call" button | Source page |
| `email_click` | "Send Email" button | Source page |
| `project_view` | Project detail pages | Project slug |
| `blog_post_read` | Blog post pages | Post slug, reading time |
| `social_link_click` | Footer social icons | Platform name |
| `cv_download` | CV page print/download | — |
| `language_switch` | Language selector | From/to locale |
| `outbound_link_click` | Any external link | Target URL |

**Tasks**:

- [ ] Create a `composables/useAnalytics.ts` composable wrapping `$posthog` for type-safe event tracking
- [ ] Track CTA clicks on the About page (`cta_click` with button label and destination)
- [ ] Track Calendly open events
- [ ] Track outbound/social link clicks in the footer
- [ ] Track blog post views with slug and estimated reading time
- [ ] Track project detail page views with project slug
- [ ] Track language switches
- [ ] Track CV page print/download action

### Priority 3: PostHog Feature Flags & Session Recording

**Why**: PostHog includes session replay and feature flags at no extra cost. These provide deep insight into user behavior and enable safe experimentation.

**Tasks**:

- [ ] Enable session recording in PostHog project settings (server-side, no code change needed)
- [ ] Review PostHog autocapture settings — consider enabling autocapture for clicks and form interactions as a supplement to custom events
- [ ] Set up PostHog feature flags for any future A/B tests (e.g., hero copy, CTA variants)

### Priority 4: Web Vitals & Performance Monitoring

**Why**: Core Web Vitals affect SEO ranking and user experience.

**Tasks**:

- [ ] Add `web-vitals` package and send LCP, FID, CLS, TTFB, INP metrics to PostHog as custom events
- [ ] Alternatively, use PostHog's built-in web vitals autocapture if available in the current SDK version

### Priority 5: User Identification (Optional)

**Why**: Currently `person_profiles: "identified_only"` means anonymous visitors are not linked across sessions. This is privacy-friendly but limits funnel analysis.

**Tasks**:

- [ ] Evaluate whether to switch to `person_profiles: "always"` for richer session linking
- [ ] If a login/contact form is added later, call `posthog.identify()` with email to link sessions
- [ ] Consider setting user properties like `locale` and `referrer` via `posthog.people.set()`

---

## Implementation Order

1. **GDPR consent** — legal requirement, do this first
2. **useAnalytics composable + CTA tracking** — highest-value events with minimal effort
3. **Blog/project/social tracking** — complete the event coverage
4. **Session recording** — zero-code, just enable in PostHog dashboard
5. **Web Vitals** — nice-to-have for SEO monitoring
6. **User identification** — only relevant if auth/forms are added

---

## Architecture Notes

### Proposed `composables/useAnalytics.ts`

```ts
export function useAnalytics() {
  const { $posthog } = useNuxtApp()

  function track(event: string, properties?: Record<string, unknown>) {
    $posthog()?.capture(event, properties)
  }

  return { track }
}
```

Usage in components:

```vue
<script setup>
const { track } = useAnalytics()
function onCtaClick(label: string, href: string) {
  track('cta_click', { label, href })
}
</script>
```

### Cookie Consent Flow

```
Page Load
  → Check localStorage for consent
  → If no consent stored: show banner, init PostHog with persistence: 'memory'
  → If consent granted: init PostHog normally
  → If consent denied: call posthog.opt_out_capturing()
```

---

## Files to Modify/Create

| File | Action | Purpose |
|------|--------|---------|
| `composables/useAnalytics.ts` | Create | Type-safe event tracking wrapper |
| `components/CookieConsent.vue` | Create | GDPR consent banner |
| `plugins/posthog.client.js` | Modify | Add consent check before init |
| `app.vue` | Modify | Mount CookieConsent component |
| `pages/about.vue` | Modify | Add CTA click tracking |
| `pages/blog/[...slug].vue` | Modify | Add blog read tracking |
| `pages/projects/[...slug].vue` | Modify | Add project view tracking |
| `components/LanguageSelector.vue` | Modify | Track language switches |
| `pages/privacy.vue` | Create | Privacy policy page |
