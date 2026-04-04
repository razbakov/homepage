<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-lg mx-auto prose prose-lg">
        <h1>Privacy Policy</h1>
        <p class="text-muted-foreground">Last updated: March 23, 2026</p>

        <h2>Who I am</h2>
        <p>
          This website is operated by Oleksii Razbakov. The site address is
          <a href="https://razbakov.com">https://razbakov.com</a>.
        </p>

        <h2>What data I collect</h2>
        <p>
          This site uses <strong>PostHog</strong> for analytics to understand
          how visitors use the site. PostHog is self-hosted in the EU
          (eu.i.posthog.com) to comply with GDPR data residency requirements.
        </p>
        <p>If you consent to analytics, the following data may be collected:</p>
        <ul>
          <li>Pages visited and navigation patterns</li>
          <li>Button clicks and interactions (e.g., CTA clicks, social links)</li>
          <li>Browser type, screen size, and operating system</li>
          <li>Approximate location (country/region level, from IP)</li>
          <li>Referral source (how you arrived at the site)</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          Analytics cookies are only set if you accept them via the cookie
          consent banner. If you decline, PostHog runs in memory-only mode and
          no persistent cookies are stored for analytics purposes.
        </p>
        <p>The site also uses a functional cookie for language preference (<code>i18n_redirected</code>), which is necessary for the site to work properly.</p>

        <h2>Your choices</h2>
        <ul>
          <li>You can accept or decline analytics cookies when you first visit the site.</li>
          <li>You can change your preference at any time using the "Cookie Settings" link in the footer.</li>
          <li>Declining cookies does not affect your ability to use the site.</li>
        </ul>

        <h2>Data sharing</h2>
        <p>
          Analytics data is not sold or shared with third parties. It is used
          solely to improve this website.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this privacy policy, you can reach me at
          <a href="mailto:alex@razbakov.com">alex@razbakov.com</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: "Privacy Policy" });
useSeoMeta({
  description: "Privacy policy for razbakov.com — how analytics data is collected and your choices.",
  ogTitle: "Privacy Policy — Alösha",
});
</script>
