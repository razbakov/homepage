<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Intro -->
        <div class="flex flex-col md:flex-row items-center gap-8 mb-16">
          <NuxtImg
            src="/images/alex-top.webp"
            alt="Alösha"
            class="w-48 md:w-56 object-contain shrink-0"
            width="224"
            height="280"
            sizes="192px md:224px"
            loading="eager"
            preload
          />
          <div>
            <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-coral-600 via-coral-500 to-teal-600 bg-clip-text text-transparent">
              {{ $t('about.title') }}
            </h1>
            <p class="text-xl text-muted-foreground leading-relaxed">
              {{ $t('about.intro') }}
            </p>
          </div>
        </div>

        <!-- What I believe -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold mb-6">{{ $t('about.believeTitle') }}</h2>
          <div class="space-y-4 text-muted-foreground leading-relaxed">
            <p>{{ $t('about.believe1') }}</p>
            <p>{{ $t('about.believe2') }}</p>
          </div>
        </section>

        <!-- What I do -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold mb-6">{{ $t('about.doTitle') }}</h2>
          <div class="grid sm:grid-cols-2 gap-6">
            <div class="p-6 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
              <Icon name="lucide:code-2" class="w-8 h-8 text-primary mb-3" />
              <h3 class="font-bold mb-2">{{ $t('about.doCode') }}</h3>
              <p class="text-sm text-muted-foreground">{{ $t('about.doCodeDesc') }}</p>
            </div>
            <NuxtLink :to="localePath('/services')" class="block p-6 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
              <Icon name="lucide:sparkles" class="w-8 h-8 text-primary mb-3" />
              <h3 class="font-bold mb-2">{{ $t('about.doAI') }}</h3>
              <p class="text-sm text-muted-foreground">{{ $t('about.doAIDesc') }}</p>
            </NuxtLink>
            <div class="p-6 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
              <Icon name="lucide:users" class="w-8 h-8 text-primary mb-3" />
              <h3 class="font-bold mb-2">{{ $t('about.doCommunity') }}</h3>
              <p class="text-sm text-muted-foreground">{{ $t('about.doCommunityDesc') }}</p>
            </div>
            <div class="p-6 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
              <Icon name="lucide:music" class="w-8 h-8 text-primary mb-3" />
              <h3 class="font-bold mb-2">{{ $t('about.doDance') }}</h3>
              <p class="text-sm text-muted-foreground">{{ $t('about.doDanceDesc') }}</p>
            </div>
          </div>
        </section>

        <!-- Photo gallery -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold mb-6">{{ $t('about.photosTitle') }}</h2>
          <div v-for="gallery in galleries" :key="gallery.titleKey" class="mb-8 last:mb-0">
            <h3 class="text-lg font-semibold mb-3 text-muted-foreground">{{ $t(gallery.titleKey) }}</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <figure v-for="photo in gallery.photos" :key="photo.src" class="group">
                <NuxtImg
                  :src="photo.src"
                  :alt="$t(photo.altKey)"
                  class="rounded-xl object-cover w-full aspect-[3/4] group-hover:scale-[1.02] transition-transform duration-300"
                  width="800"
                  height="1422"
                  loading="lazy"
                />
                <figcaption class="text-xs text-muted-foreground mt-1.5 px-0.5">{{ $t(photo.captionKey) }}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <!-- Fun facts -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold mb-6">{{ $t('about.factsTitle') }}</h2>
          <ul class="space-y-3">
            <li v-for="(fact, i) in facts" :key="i" class="flex items-start gap-3">
              <span class="text-primary mt-1 shrink-0">
                <Icon :name="fact.icon" class="w-5 h-5" />
              </span>
              <span class="text-muted-foreground">{{ $t(fact.key) }}</span>
            </li>
          </ul>
        </section>

        <!-- CTA -->
        <section class="relative rounded-2xl overflow-hidden p-8 md:p-12 text-center">
          <div class="absolute inset-0 bg-gradient-to-br from-coral-50/50 via-secondary/50 to-teal-50/30"></div>
          <div class="relative">
            <h2 class="text-2xl font-bold mb-3">{{ $t('about.ctaTitle') }}</h2>
            <p class="text-muted-foreground mb-6">{{ $t('about.ctaDescription') }}</p>
            <div class="flex gap-4 justify-center">
              <a
                :href="calendlyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-11 items-center justify-center rounded-lg px-8 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
                @click="trackCalendlyOpen('about_cta')"
              >
                {{ $t('nav.scheduleCall') }}
              </a>
              <a
                :href="`mailto:${email}`"
                class="inline-flex h-11 items-center justify-center rounded-lg border border-input px-8 text-sm font-medium hover:bg-secondary hover:text-foreground transition-colors"
                @click="trackEmailClick('about_cta')"
              >
                {{ $t('about.sendEmail') }}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
const { trackCalendlyOpen, trackEmailClick } = useAnalytics();
const localePath = useLocalePath();
useHead({ title: "About Alösha — Developer, Builder & Community Creator in Munich" });
useSeoMeta({
  description: () => t('seo.aboutDesc'),
  ogTitle: "About Alösha",
  ogDescription: () => t('seo.aboutDesc'),
  ogImage: "/images/alex-top.webp",
  twitterCard: "summary",
});
useSchemaOrg([
  defineWebPage({
    "@type": "AboutPage",
    name: "About Alösha",
  }),
  definePerson({
    name: "Alösha",
    alternateName: "Oleksii Razbakov",
    jobTitle: "Senior Fullstack Developer",
    worksFor: { "@type": "Organization", name: "OMMAX" },
    knowsLanguage: ["en", "de", "es", "uk", "ru"],
    url: "https://razbakov.com",
    sameAs: [
      "https://github.com/razbakov",
      "https://linkedin.com/in/razbakov",
      "https://x.com/razbakov",
      "https://youtube.com/@razbakov",
    ],
  }),
]);

import config from "~/content/config.json";

const calendlyUrl = `https://calendly.com/${config.site.calendly.username}`;
const email = config.site.email;

const galleries = [
  {
    titleKey: "about.galleryKenya",
    photos: [
      { src: "/images/about/kenya-giraffe.jpg", altKey: "about.photoGiraffe", captionKey: "about.captionGiraffe" },
      { src: "/images/about/kenya-atv.jpg", altKey: "about.photoAtv", captionKey: "about.captionAtv" },
      { src: "/images/about/kenya-beach.jpg", altKey: "about.photoBeach", captionKey: "about.captionBeach" },
      { src: "/images/about/kenya-mangroves.jpg", altKey: "about.photoMangroves", captionKey: "about.captionMangroves" },
      { src: "/images/about/kenya-sunset.jpg", altKey: "about.photoSunset", captionKey: "about.captionSunset" },
      { src: "/images/about/kenya-matatu.jpg", altKey: "about.photoMatatu", captionKey: "about.captionMatatu" },
    ],
  },
  {
    titleKey: "about.galleryCuba",
    photos: [
      { src: "/images/about/cuba-vinales.jpg", altKey: "about.photoCubaVinales", captionKey: "about.captionCubaVinales" },
      { src: "/images/about/cuba-malecon.jpg", altKey: "about.photoCubaMalecon", captionKey: "about.captionCubaMalecon" },
      { src: "/images/about/cuba-vintage-car.jpg", altKey: "about.photoCubaVintageCar", captionKey: "about.captionCubaVintageCar" },
      { src: "/images/about/cuba-havana-street.jpg", altKey: "about.photoCubaHavanaStreet", captionKey: "about.captionCubaHavanaStreet" },
      { src: "/images/about/cuba-habana-concert.jpg", altKey: "about.photoCubaHabanaConcert", captionKey: "about.captionCubaHabanaConcert" },
      { src: "/images/about/cuba-sign.jpg", altKey: "about.photoCubaSign", captionKey: "about.captionCubaSign" },
    ],
  },
];

const facts = [
  { icon: "lucide:map-pin", key: "about.factMunich" },
  { icon: "lucide:globe", key: "about.factLanguages" },
  { icon: "lucide:heart", key: "about.factWeDance" },
  { icon: "lucide:rocket", key: "about.factSciFi" },
  { icon: "lucide:chess", key: "about.factChess" },
];
</script>
