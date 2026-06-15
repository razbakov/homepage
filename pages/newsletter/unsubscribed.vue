<template>
  <div class="py-20">
    <div class="container mx-auto px-4">
      <div class="max-w-md mx-auto text-center">
        <div
          class="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
          :class="ok ? 'bg-muted' : 'bg-amber-500/10'"
        >
          <Icon
            :name="ok ? 'lucide:mail-x' : 'lucide:link-2-off'"
            class="h-7 w-7"
            :class="ok ? 'text-muted-foreground' : 'text-amber-600 dark:text-amber-400'"
          />
        </div>
        <h1 class="text-2xl font-bold mb-3">
          {{ ok ? $t('newsletter.unsubscribed.title') : $t('newsletter.confirmed.invalidTitle') }}
        </h1>
        <p class="text-muted-foreground leading-relaxed mb-8">
          {{ ok ? $t('newsletter.unsubscribed.body') : $t('newsletter.confirmed.invalidBody') }}
        </p>
        <NuxtLink
          :to="localePath('/')"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coral-500 text-white font-medium text-sm shadow-sm hover:bg-coral-600 transition-colors"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          {{ $t('newsletter.confirmed.backHome') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();

// /api/unsubscribe redirects here with ?status=ok | invalid
const ok = computed(() => route.query.status !== "invalid");

useHead({ title: () => (ok.value ? t("newsletter.unsubscribed.title") : t("newsletter.confirmed.invalidTitle")) });
useSeoMeta({ robots: "noindex, nofollow" });
</script>
