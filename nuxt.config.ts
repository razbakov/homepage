// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@vee-validate/nuxt",
    "@nuxt/content",
    "@nuxt/icon",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
  ],
  content: {
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
      posthogPublicKey: "phc_OmGQ7s6qOxYgndhw6m3gh18Kkby0a2NdMGx4lGsEoob",
      posthogHost: "https://eu.i.posthog.com",
    },
  },
});
