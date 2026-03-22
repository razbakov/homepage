import { definePerson } from "nuxt-schema-org/schema";
import config from "./content/config.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: "%s · Alex Razbakov",
      title: "Alex Razbakov",
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,600&family=Roboto+Slab:wght@700&display=swap",
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
  devtools: { enabled: true },
  compatibilityDate: "2025-01-07",
  nitro: {
    routeRules: {
      "/slides/**": { static: true },
    },
  },
  runtimeConfig: {
    public: {
      posthogPublicKey: config.site.analytics.posthog.publicKey,
      posthogHost: config.site.analytics.posthog.host,
    },
  },
});
