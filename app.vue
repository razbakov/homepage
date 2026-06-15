<template>
  <div class="min-h-screen bg-background">
    <header class="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <nav
        class="container mx-auto px-4 h-16 flex items-center justify-between"
      >
        <NuxtLink :to="localePath('/')" class="flex items-center gap-3 hover:opacity-80">
          <NuxtImg
            :src="config.site.avatar"
            :alt="config.site.name"
            class="w-8 h-8 rounded-full ring-2 ring-primary/20"
            width="32"
            height="32"
          />
          <span class="font-bold text-xl">{{ config.site.name }}</span>
        </NuxtLink>

        <!-- Mobile Controls -->
        <div class="md:hidden flex items-center gap-1">
          <LanguageSelector :compact="true" />
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="p-2 rounded-md hover:bg-secondary"
            aria-label="Toggle menu"
          >
            <div class="w-6 h-6 flex flex-col justify-center gap-1.5">
              <span
                class="block w-full h-0.5 bg-foreground transition-transform"
                :class="{ 'rotate-45 translate-y-2': isMenuOpen }"
              ></span>
              <span
                class="block w-full h-0.5 bg-foreground transition-opacity"
                :class="{ 'opacity-0': isMenuOpen }"
              ></span>
              <span
                class="block w-full h-0.5 bg-foreground transition-transform"
                :class="{ '-rotate-45 -translate-y-2': isMenuOpen }"
              ></span>
            </div>
          </button>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-2">
          <MainNav />
          <div class="ml-2 border-l border-border/50 pl-3">
            <LanguageSelector />
          </div>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden border-t border-border/50">
        <div class="container mx-auto px-4 py-4 flex flex-col gap-2">
          <MainNav
            :is-mobile="true"
            @item-click="isMenuOpen = false"
          />
        </div>
      </div>
    </header>

    <main>
      <NuxtPage />
    </main>

    <!-- Site-wide newsletter signup (end of articles, feed, and other pages).
         Excluded on the homepage — which has its own in-hero signup — and on
         the newsletter result / web100 / slides routes. -->
    <section v-if="showNewsletter" class="container mx-auto px-4 mb-16">
      <div class="max-w-3xl mx-auto">
        <NewsletterSignup />
      </div>
    </section>

    <footer class="border-t border-border/50">
      <div class="flex justify-center">
        <NuxtImg
          src="/images/alex-welcome.webp"
          alt="Alösha"
          class="max-h-[32rem] object-contain"
          width="500"
          height="640"
          loading="lazy"
        />
      </div>
      <div class="container mx-auto px-4 flex flex-col items-center gap-4 py-8">
        <div class="flex items-center gap-1">
          <a v-for="link in socialLinks" :key="link.label" :href="link.href" target="_blank" rel="noopener noreferrer" class="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" :aria-label="link.label" @click="trackSocialLinkClick(link.label, link.href)">
            <Icon :name="link.icon" class="w-4 h-4" />
          </a>
        </div>
        <div class="flex items-center gap-3 text-sm text-muted-foreground">
          <p>
            &copy; {{ new Date().getFullYear() }} {{ config.site.name }}. {{ $t('footer.allRightsReserved') }}
          </p>
          <span class="text-border">|</span>
          <NuxtLink :to="localePath('/privacy')" class="hover:text-foreground transition-colors">
            {{ $t('footer.privacy') }}
          </NuxtLink>
          <span class="text-border">|</span>
          <button @click="cookieConsent?.showSettings()" class="hover:text-foreground transition-colors">
            {{ $t('footer.cookieSettings') }}
          </button>
        </div>
      </div>
    </footer>

    <CookieConsent ref="cookieConsent" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import config from "~/content/config.json";

const { locale } = useI18n();
const localePath = useLocalePath();
const isMenuOpen = ref(false);
const cookieConsent = ref(null);
const { trackSocialLinkClick } = useAnalytics();
const { socialLinks } = useSocialLinks();

const route = useRoute();
const baseUrl = "https://razbakov.com";
const locales = ["en", "de", "es", "ru", "uk"];

// Show the site-wide newsletter band everywhere except the homepage (it has its
// own in-hero signup) and a few routes where it would be redundant or off-flow.
const showNewsletter = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  const rest = locales.includes(segments[0]) ? segments.slice(1) : segments;
  const norm = "/" + rest.join("/");
  if (norm === "/") return false; // homepage — already has a signup
  return !/^\/(newsletter|web100|slides)(\/|$)/.test(norm);
});

useHead(() => {
  // Strip locale prefix to get the base path
  const path = route.path;
  let basePath = path;
  for (const loc of locales) {
    if (path === `/${loc}` || path.startsWith(`/${loc}/`)) {
      basePath = path.slice(loc.length + 1) || "/";
      break;
    }
  }

  const enPath = basePath === "/" ? "" : basePath;
  const links = [
    { rel: "canonical", href: `${baseUrl}${path === "/" ? "" : path}` },
    { rel: "alternate", href: `${baseUrl}${enPath}`, hreflang: "x-default" },
    { rel: "alternate", href: `${baseUrl}${enPath}`, hreflang: "en" },
    ...locales.filter(l => l !== "en").map(l => ({
      rel: "alternate",
      href: `${baseUrl}/${l}${basePath === "/" ? "" : basePath}`,
      hreflang: l,
    })),
  ];

  return {
    htmlAttrs: { lang: locale.value },
    link: links,
  };
});

</script>
