<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <header class="mb-12 text-center">
          <p class="text-sm font-semibold tracking-wide uppercase text-primary/80 mb-3">
            Morning Intelligence
          </p>
          <h1 class="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-coral-600 via-coral-500 to-teal-600 bg-clip-text text-transparent leading-tight">
            YouTube feed
          </h1>
          <p class="text-muted-foreground max-w-xl mx-auto">
            A daily, summarized digest of the videos worth my time — AI, Apple,
            consciousness, science — each with my take on why it's interesting.
            One page per day; the archive stays up.
          </p>
        </header>

        <!-- Empty state: no dated files at all -->
        <div
          v-if="!days.length"
          class="rounded-xl border border-dashed border-border/70 p-10 text-center bg-muted/20"
        >
          <Icon name="lucide:youtube" class="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h2 class="font-semibold mb-2">No days yet</h2>
          <p class="text-sm text-muted-foreground max-w-md mx-auto">
            The morning intelligence run writes a dated file to
            <code>content/data/feed/</code>; once it does, days show up here.
          </p>
        </div>

        <!-- History: every day newest-first -->
        <ul v-else class="space-y-3">
          <li v-for="day in days" :key="day.date">
            <NuxtLink
              :to="`/feed/${day.date}`"
              class="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-card px-5 py-4 hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div class="min-w-0">
                <p class="font-semibold leading-snug group-hover:text-primary transition-colors">
                  {{ formatDate(day.date) }}
                </p>
                <p class="text-xs text-muted-foreground tabular-nums mt-0.5">
                  {{ day.summarized }} of {{ day.total_recommended }} summarized
                </p>
              </div>
              <Icon
                name="lucide:chevron-right"
                class="w-5 h-5 text-muted-foreground/60 shrink-0 group-hover:text-primary transition-colors"
              />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
// Load every dated feed file under content/data/feed/. History = the set of
// dated files; nothing is overwritten. List newest-first.
const { data: feeds } = await useAsyncData("feed-index", () =>
  queryContent("data/feed").find()
);

const days = computed(() =>
  (feeds.value || [])
    .filter((f) => f?.date)
    .map((f) => ({
      date: f.date,
      summarized: f.summarized ?? (f.items?.length || 0),
      total_recommended: f.total_recommended ?? (f.items?.length || 0),
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
);

function formatDate(date) {
  const [y, m, d] = String(date).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Public, indexable. Durable entry point for the daily feed; linked from the
// homepage and included in the sitemap.
useHead({
  title: "YouTube feed",
  meta: [{ name: "description", content: "Alösha's daily, summarized digest of the YouTube videos worth your time — AI, Apple, consciousness, science — with a personal take on each." }],
});
</script>
