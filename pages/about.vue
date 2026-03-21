<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Intro -->
        <div class="flex flex-col md:flex-row items-center gap-8 mb-16">
          <NuxtImg
            src="/images/alex-top.png"
            alt="Alex Razbakov"
            class="w-48 md:w-56 object-contain shrink-0"
            width="224"
            height="280"
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
            <div class="p-6 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
              <Icon name="lucide:sparkles" class="w-8 h-8 text-primary mb-3" />
              <h3 class="font-bold mb-2">{{ $t('about.doAI') }}</h3>
              <p class="text-sm text-muted-foreground">{{ $t('about.doAIDesc') }}</p>
            </div>
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
              >
                {{ $t('nav.scheduleCall') }}
              </a>
              <a
                :href="`mailto:${email}`"
                class="inline-flex h-11 items-center justify-center rounded-lg border border-input px-8 text-sm font-medium hover:bg-secondary hover:text-foreground transition-colors"
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
import config from "~/content/config.json";

const calendlyUrl = `https://calendly.com/${config.site.calendly.username}`;
const email = config.site.email;

const facts = [
  { icon: "lucide:map-pin", key: "about.factMunich" },
  { icon: "lucide:globe", key: "about.factLanguages" },
  { icon: "lucide:heart", key: "about.factWeDance" },
  { icon: "lucide:rocket", key: "about.factSciFi" },
  { icon: "lucide:chess", key: "about.factChess" },
];
</script>
