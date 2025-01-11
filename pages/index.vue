<template>
  <div>
    <!-- Hero -->
    <section class="py-20 md:py-32">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            {{ config.home.hero.title }}
          </h1>
          <p class="text-xl text-muted-foreground mb-8">
            {{ config.home.hero.description }}
          </p>
          <div class="flex gap-4 justify-center">
            <NuxtLink
              v-for="button in config.home.hero.cta"
              :key="button.link"
              :to="button.link"
              class="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium"
              :class="
                button.primary
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border border-input hover:bg-accent hover:text-accent-foreground'
              "
            >
              {{ button.text }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section class="py-16 bg-muted/50">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold mb-12 text-center">
            {{ config.home.featured.title }}
          </h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <article
              v-for="project in projects?.slice(
                0,
                config.home.featured.maxItems
              )"
              :key="project._path"
              class="group"
            >
              <NuxtLink :to="project._path" class="block">
                <img
                  v-if="project.icon"
                  :src="project.icon"
                  :alt="project.title"
                  class="h-7 w-auto mb-4"
                  style="max-width: 120px"
                  height="28"
                />
                <div class="space-y-2">
                  <h3
                    class="text-xl font-bold group-hover:text-primary line-clamp-2"
                  >
                    {{ project.title }}
                  </h3>
                  <p class="text-sm text-muted-foreground line-clamp-2">
                    {{ project.description }}
                  </p>
                </div>
              </NuxtLink>
            </article>
          </div>
          <div class="text-center mt-12">
            <NuxtLink
              to="/projects"
              class="inline-flex h-10 items-center justify-center rounded-md border border-input px-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              {{ config.home.featured.viewAllText }}
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
              class="space-y-4"
            >
              <h3 class="text-xl font-bold">{{ service.title }}</h3>
              <p class="text-muted-foreground">
                {{ service.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="py-16 bg-muted/50">
      <div class="container mx-auto px-4">
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
              <button
                v-if="button.action === 'calendly'"
                @click="openCalendly"
                class="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium"
                :class="
                  button.primary
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-input hover:bg-accent hover:text-accent-foreground'
                "
              >
                {{ button.text }}
              </button>
              <a
                v-else-if="button.action === 'mailto'"
                :href="`mailto:${config.site.email}`"
                class="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium"
                :class="
                  button.primary
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-input hover:bg-accent hover:text-accent-foreground'
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

const { data: projects } = await useAsyncData("featured-projects", () =>
  queryContent("projects").sort({ date: -1 }).find()
);

const openCalendly = () => {
  Calendly.initPopupWidget({
    url: `https://calendly.com/${config.site.calendly.username}`,
    prefill: {},
    pageSettings: config.site.calendly.settings,
    enableClosing: true,
  });
};
</script>
