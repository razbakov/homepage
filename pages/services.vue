<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Hero -->
        <section class="mb-16 text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-coral-600 via-coral-500 to-teal-600 bg-clip-text text-transparent">
            {{ $t('services.title') }}
          </h1>
          <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {{ $t('services.subtitle') }}
          </p>
        </section>

        <!-- Services -->
        <section class="mb-16 space-y-8">
          <div
            v-for="service in services"
            :key="service.key"
            class="p-6 md:p-8 rounded-xl border border-border/50 hover:border-primary/20 transition-colors"
          >
            <Icon :name="service.icon" class="w-10 h-10 text-primary mb-4" />
            <h2 class="text-2xl font-bold mb-3">{{ $t(`services.${service.key}.title`) }}</h2>
            <p class="text-muted-foreground leading-relaxed mb-4">
              {{ $t(`services.${service.key}.description`) }}
            </p>
            <p v-if="service.showPrice" class="text-2xl font-bold text-primary mb-4">
              {{ $t(`services.${service.key}.price`) }}
            </p>
            <div class="space-y-2 mb-6 text-sm">
              <p>
                <span class="font-medium">{{ $t('services.deliverable') }}:</span>
                <span class="text-muted-foreground"> {{ $t(`services.${service.key}.deliverable`) }}</span>
              </p>
              <p>
                <span class="font-medium">{{ $t('services.audience') }}:</span>
                <span class="text-muted-foreground"> {{ $t(`services.${service.key}.audience`) }}</span>
              </p>
            </div>
            <a
              :href="service.cta.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              {{ $t(`services.${service.key}.cta`) }}
            </a>
          </div>
        </section>

        <!-- Social proof -->
        <section class="mb-16">
          <div class="flex flex-wrap justify-center gap-6 md:gap-12 text-center">
            <div v-for="stat in stats" :key="stat.key">
              <p class="text-2xl font-bold text-primary">{{ $t(`services.stats.${stat.key}.value`) }}</p>
              <p class="text-sm text-muted-foreground">{{ $t(`services.stats.${stat.key}.label`) }}</p>
            </div>
          </div>
        </section>

        <!-- Bottom CTA -->
        <section class="relative rounded-2xl overflow-hidden p-8 md:p-12 text-center">
          <div class="absolute inset-0 bg-gradient-to-br from-coral-50/50 via-secondary/50 to-teal-50/30"></div>
          <div class="relative">
            <h2 class="text-2xl font-bold mb-3">{{ $t('services.ctaTitle') }}</h2>
            <p class="text-muted-foreground mb-6">{{ $t('services.ctaDescription') }}</p>
            <a
              :href="calendlyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-11 items-center justify-center rounded-lg px-8 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              {{ $t('nav.scheduleCall') }}
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
useHead({ title: "AI Consulting Services — Alösha" });
useSeoMeta({
  description: () => t('seo.servicesDesc'),
  ogTitle: "AI Consulting Services — Alösha",
  ogDescription: () => t('seo.servicesDesc'),
  ogImage: "/images/alex-top.png",
  twitterCard: "summary",
});

import config from "~/content/config.json";

const calendlyUrl = `https://calendly.com/${config.site.calendly.username}`;

const services = [
  {
    key: "audit",
    icon: "lucide:scan",
    showPrice: true,
    cta: { url: calendlyUrl, external: true },
  },
  {
    key: "agents",
    icon: "lucide:bot",
    cta: { url: calendlyUrl, external: true },
  },
  {
    key: "workshops",
    icon: "lucide:presentation",
    showPrice: true,
    cta: { url: calendlyUrl, external: true },
  },
  {
    key: "academy",
    icon: "lucide:graduation-cap",
    showPrice: true,
    cta: { url: "https://learn-by-doing-academy.com", external: true },
  },
];

const stats = [
  { key: "agents" },
  { key: "skills" },
  { key: "community" },
];
</script>
