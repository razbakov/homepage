import { definePerson } from "nuxt-schema-org/schema";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import config from "./content/config.json";

// Collect routes for blog posts marked `hidden: true`. Hidden posts are
// filtered out of listings (see pages/index.vue, unhidden via ?drafts) but
// their pages still need to be prerendered so direct links work.
// Note: avoid `draft: true` — Nuxt Content auto-excludes those from queryContent.
const hiddenRoutes = (() => {
  const dir = resolve("./content/blog");
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .filter((f) => /^hidden:\s*true/m.test(readFileSync(resolve(dir, f), "utf8")))
      .map((f) => `/blog/${f.replace(/\.md$/, "")}`);
  } catch {
    return [];
  }
})();

// Collect a prerender route per dated feed file (content/data/feed/YYYY-MM-DD.json).
// The /feed history index links to these, but we list them explicitly so each
// day's page is prerendered even without crawling. History is the set of files.
const feedRoutes = (() => {
  const dir = resolve("./content/data/feed");
  try {
    return readdirSync(dir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map((f) => `/feed/${f.replace(/\.json$/, "")}`);
  } catch {
    return [];
  }
})();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: "%s · Alösha",
      title: "Alösha",
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "preload",
          as: "style",
          href: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,600&family=Roboto+Slab:wght@700&display=swap",
          onload: "this.onload=null;this.rel='stylesheet'",
        },
      ],
    },
  },
  site: {
    url: config.site.url,
    name: config.site.name,
  },
  schemaOrg: {
    identity: definePerson({
      name: config.site.name,
      image: config.site.avatar,
      description: config.site.description,
      url: config.site.url,
      sameAs: [config.site.social.github],
    }),
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@vee-validate/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/content",
    "@nuxt/icon",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-schema-org",
    "nuxt-og-image",
    "@nuxt/image",
  ],
  i18n: {
    baseUrl: config.site.url,
    locales: [
      { code: "en", name: "English", file: "en.json", language: "en" },
      { code: "de", name: "Deutsch", file: "de.json", language: "de" },
      { code: "es", name: "Español", file: "es.json", language: "es" },
      { code: "ru", name: "Русский", file: "ru.json", language: "ru" },
      { code: "uk", name: "Українська", file: "uk.json", language: "uk" },
    ],
    defaultLocale: "en",
    strategy: "prefix_except_default",
    lazy: true,
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  content: {
    documentDriven: false,
    highlight: {
      theme: "github-dark",
      preload: [
        "json",
        "js",
        "ts",
        "html",
        "css",
        "vue",
        "diff",
        "shell",
        "markdown",
        "yaml",
        "bash",
        "ini",
      ],
    },
    markdown: {
      toc: {
        depth: 4,
        searchDepth: 4,
      },
    },
    experimental: {
      clientDB: true,
      stripQueryParameters: true,
    },
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  routeRules: {
    // /feed is Alex's private "morning intelligence" page — unlisted + noindex.
    // `robots: false` makes @nuxtjs/robots emit X-Robots-Tag: noindex,nofollow
    // and disallow it in robots.txt; @nuxtjs/sitemap reads the same rule and
    // excludes it from the sitemap. The page also sets a robots meta tag itself.
    "/feed": { robots: false },
    "/feed/**": { robots: false },
  },
  devtools: { enabled: true },
  compatibilityDate: "2025-01-07",
  nitro: {
    preset: "static",
    prerender: {
      crawlLinks: true,
      routes: [
        "/", "/about", "/blog", "/projects", "/cv", "/slides", "/privacy", "/web100",
        // Unlisted, noindex "morning intelligence" feed (see routeRules + pages/feed/)
        "/feed",
        ...feedRoutes,
        // Unlisted blog posts (hidden from listings, accessible via direct link)
        "/blog/2026-03-25-why-openclaw-has-no-soul",
        "/blog/2026-03-25-my-ai-team-runs-my-day",
        "/blog/2026-03-25-from-idea-to-mvp-in-minutes",
        "/blog/2026-03-25-ai-agents-need-goals",
        "/blog/2026-03-25-stop-estimating-in-hours",
        ...hiddenRoutes,
      ],
      failOnError: false,
    },
  },
  runtimeConfig: {
    public: {
      posthogPublicKey: config.site.analytics.posthog.publicKey,
      posthogHost: config.site.analytics.posthog.host,
    },
  },
});
