<template>
  <div>
    <!-- Hero -->
    <section class="relative py-20 md:py-32 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-coral-50 via-background to-teal-50/30"></div>
      <div class="absolute top-20 right-10 w-72 h-72 bg-coral-200/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 left-10 w-96 h-96 bg-teal-200/10 rounded-full blur-3xl"></div>
      <div class="container mx-auto px-4 relative">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-coral-600 via-coral-500 to-teal-600 bg-clip-text text-transparent">
            {{ config.home.hero.title }}
          </h1>
          <p class="text-xl text-muted-foreground mb-10 leading-relaxed">
            {{ config.home.hero.description }}
          </p>
          <div class="flex gap-4 justify-center">
            <NuxtLink
              to="/cv"
              class="inline-flex h-11 items-center justify-center rounded-lg px-8 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Download CV
            </NuxtLink>
            <NuxtLink
              to="/projects"
              class="inline-flex h-11 items-center justify-center rounded-lg border border-input px-8 text-sm font-medium hover:bg-secondary hover:text-foreground transition-colors"
            >
              View Projects
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold mb-12 text-center">
            {{ config.home.services.title }}
          </h2>
          <div class="grid sm:grid-cols-2 gap-8">
            <div
              v-for="service in config.home.services.items"
              :key="service.title"
              class="space-y-3 p-6 rounded-xl border border-border/50 hover:border-primary/20 transition-colors"
            >
              <h3 class="text-xl font-bold">{{ service.title }}</h3>
              <p class="text-muted-foreground leading-relaxed">
                {{ service.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="relative py-16 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-coral-50/50 via-secondary/50 to-teal-50/30"></div>
      <div class="container mx-auto px-4 relative">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">
            {{ config.home.contact.title }}
          </h2>
          <p class="text-xl text-muted-foreground mb-8">
            {{ config.home.contact.description }}
          </p>
          <div class="flex gap-4 justify-center">
            <template
              v-for="button in config.home.contact.cta"
              :key="button.text"
            >
              <a
                v-if="button.action === 'calendly'"
                :href="calendlyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-11 items-center justify-center rounded-lg px-8 text-sm font-medium transition-all duration-200"
                :class="
                  button.primary
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5'
                    : 'border border-input hover:bg-secondary hover:text-foreground'
                "
              >
                {{ button.text }}
              </a>
              <a
                v-else-if="button.action === 'mailto'"
                :href="`mailto:${config.site.email}`"
                class="inline-flex h-11 items-center justify-center rounded-lg px-8 text-sm font-medium transition-all duration-200"
                :class="
                  button.primary
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25'
                    : 'border border-input hover:bg-secondary hover:text-foreground'
                "
              >
                {{ button.text }}
              </a>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import config from "~/content/config.json";

const calendlyUrl = `https://calendly.com/${config.site.calendly.username}`;
</script>
