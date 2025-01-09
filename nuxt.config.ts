// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
    "@vee-validate/nuxt",
    "@nuxt/content",
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
  colorMode: {
    classSuffix: "",
    preference: "light",
    fallback: "light",
    disableTransition: true,
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
});
