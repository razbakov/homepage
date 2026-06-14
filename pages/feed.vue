<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Empty / not-found state: no dated feed file matched -->
        <div
          v-if="!feed"
          class="rounded-xl border border-dashed border-border/70 p-10 text-center bg-muted/20"
        >
          <Icon name="lucide:youtube" class="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h1 class="font-semibold mb-2">No feed yet</h1>
          <p class="text-sm text-muted-foreground max-w-md mx-auto">
            Nothing summarized for this date. The morning intelligence run writes a
            dated file to <code>content/data/feed/</code>; once it does, it shows up here.
          </p>
        </div>

        <template v-else>
          <!-- Header: date + how many recommended vs summarized -->
          <header class="mb-12 text-center">
            <p class="text-sm font-semibold tracking-wide uppercase text-primary/80 mb-3">
              Morning Intelligence
            </p>
            <h1 class="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-coral-600 via-coral-500 to-teal-600 bg-clip-text text-transparent leading-tight">
              YouTube feed · {{ formattedDate }}
            </h1>
            <p class="text-muted-foreground">
              <span class="font-semibold text-foreground tabular-nums">{{ feed.total_recommended }}</span>
              recommended,
              <span class="font-semibold text-foreground tabular-nums">{{ feed.summarized }}</span>
              summarized
            </p>
          </header>

          <!-- Items grouped by category -->
          <section
            v-for="group in groupedItems"
            :key="group.category"
            class="mb-12"
          >
            <h2 class="text-lg font-bold mb-5 flex items-center gap-2">
              <span class="h-px flex-1 bg-border/60"></span>
              <span class="text-muted-foreground uppercase tracking-wide text-sm">{{ group.category }}</span>
              <span class="h-px flex-1 bg-border/60"></span>
            </h2>

            <div class="space-y-4">
              <article
                v-for="item in group.items"
                :key="item.id"
                class="rounded-xl border border-border/50 bg-card p-5 md:p-6 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div class="flex flex-col sm:flex-row gap-4">
                  <!-- Thumbnail (links to video) -->
                  <a
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group block shrink-0 sm:w-44 aspect-video rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      :src="youtubeThumbnail(item.url)"
                      :alt="item.title"
                      class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                  </a>

                  <div class="min-w-0">
                    <h3 class="font-semibold leading-snug mb-1">
                      <a
                        :href="item.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="hover:text-primary transition-colors"
                      >
                        {{ item.title }}
                      </a>
                    </h3>
                    <p class="text-xs text-muted-foreground mb-3">
                      {{ item.channel }} · {{ item.duration }}
                    </p>
                    <p class="text-sm text-foreground/90 leading-relaxed mb-3">
                      {{ item.summary }}
                    </p>

                    <!-- "Why it matters to you" — visually distinct relevance line -->
                    <div class="flex gap-2 rounded-lg border border-coral-200 bg-coral-50/40 px-3 py-2">
                      <Icon name="lucide:sparkles" class="w-4 h-4 text-coral-600 shrink-0 mt-0.5" />
                      <p class="text-sm text-foreground/90 leading-relaxed">
                        <span class="font-semibold text-coral-700">Why it matters to you: </span>
                        {{ item.relevance }}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();

// Load every dated feed file under content/data/feed/. Each file is a JSON doc
// keyed by date (YYYY-MM-DD.json) with { date, source, total_recommended,
// summarized, items[] }. We pick the latest by date, or the ?date= override.
const { data: feeds } = await useAsyncData("feed-list", () =>
  queryContent("data/feed").find()
);

const feed = computed(() => {
  const list = (feeds.value || []).filter((f) => f?.date);
  if (!list.length) return null;
  // Optional ?date=YYYY-MM-DD to view a past day; otherwise newest by date.
  const wanted = route.query.date;
  if (wanted) return list.find((f) => f.date === wanted) || null;
  return [...list].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
});

// Group items by category, preserving first-seen category order.
const groupedItems = computed(() => {
  if (!feed.value?.items) return [];
  const groups = [];
  const byCategory = new Map();
  for (const item of feed.value.items) {
    const category = item.category || "Other";
    if (!byCategory.has(category)) {
      const group = { category, items: [] };
      byCategory.set(category, group);
      groups.push(group);
    }
    byCategory.get(category).items.push(item);
  }
  return groups;
});

const formattedDate = computed(() => {
  if (!feed.value?.date) return "";
  // Render the YYYY-MM-DD as a readable date without timezone drift.
  const [y, m, d] = feed.value.date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
});

// Derive YouTube thumbnail from URL (youtu.be/ID or watch?v=ID). Mirrors the
// helper used on /web100 so the visual treatment stays consistent.
function youtubeThumbnail(url) {
  if (!url) return "";
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/)([A-Za-z0-9_-]{6,})/);
  const id = m?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

// SEO: this page is UNLISTED + NOINDEX. The robots meta below is the per-page
// belt; nuxt.config.ts routeRules also disallows /feed (X-Robots-Tag header +
// sitemap exclusion via @nuxtjs/robots + @nuxtjs/sitemap). It is intentionally
// not linked from nav/footer.
useHead({
  title: "Feed",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});
</script>
