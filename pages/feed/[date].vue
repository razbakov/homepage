<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Back to history index -->
        <NuxtLink
          to="/feed"
          class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          All days
        </NuxtLink>

        <!-- Not-found state: no dated feed file matched this route -->
        <div
          v-if="!feed"
          class="rounded-xl border border-dashed border-border/70 p-10 text-center bg-muted/20"
        >
          <Icon name="lucide:youtube" class="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h1 class="font-semibold mb-2">No feed for this date</h1>
          <p class="text-sm text-muted-foreground max-w-md mx-auto">
            Nothing summarized for <code>{{ routeDate }}</code>. The morning
            intelligence run writes a dated file to <code>content/data/feed/</code>;
            once it does, the day shows up here.
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
              <span class="font-semibold text-foreground tabular-nums">{{ feed.summarized }}</span>
              of
              <span class="font-semibold text-foreground tabular-nums">{{ feed.total_recommended }}</span>
              recommendations summarized
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

                    <!-- "Alösha's take" — visually distinct curator note -->
                    <div class="flex gap-2 rounded-lg border border-coral-200 bg-coral-50/40 px-3 py-2">
                      <Icon name="lucide:sparkles" class="w-4 h-4 text-coral-600 shrink-0 mt-0.5" />
                      <p class="text-sm text-foreground/90 leading-relaxed">
                        <span class="font-semibold text-coral-700">Alösha's take: </span>
                        {{ item.relevance }}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <!-- Prev / next day navigation (only when an adjacent day exists) -->
          <nav
            v-if="prevDate || nextDate"
            class="flex items-center justify-between gap-4 border-t border-border/50 pt-6 mt-4"
          >
            <NuxtLink
              v-if="prevDate"
              :to="`/feed/${prevDate}`"
              class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="lucide:chevron-left" class="w-4 h-4" />
              {{ prevDate }}
            </NuxtLink>
            <span v-else></span>
            <NuxtLink
              v-if="nextDate"
              :to="`/feed/${nextDate}`"
              class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              {{ nextDate }}
              <Icon name="lucide:chevron-right" class="w-4 h-4" />
            </NuxtLink>
          </nav>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const routeDate = computed(() => String(route.params.date || ""));

// Load every dated feed file under content/data/feed/. Each file is a JSON doc
// keyed by date (YYYY-MM-DD.json) with { date, source, total_recommended,
// summarized, items[] }. Days are never overwritten — history is the set of files.
const { data: feeds } = await useAsyncData("feed-files", () =>
  queryContent("data/feed").find()
);

// All available dates, newest-first.
const dates = computed(() =>
  (feeds.value || [])
    .map((f) => f?.date)
    .filter(Boolean)
    .sort((a, b) => (a < b ? 1 : -1))
);

const feed = computed(() => {
  const list = (feeds.value || []).filter((f) => f?.date);
  return list.find((f) => f.date === routeDate.value) || null;
});

// Adjacent days for prev/next links. dates is newest-first, so the "next" (newer)
// day sits before the current index and "prev" (older) sits after it.
const currentIdx = computed(() => dates.value.indexOf(routeDate.value));
const nextDate = computed(() => {
  const i = currentIdx.value;
  return i > 0 ? dates.value[i - 1] : null;
});
const prevDate = computed(() => {
  const i = currentIdx.value;
  return i >= 0 && i < dates.value.length - 1 ? dates.value[i + 1] : null;
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

// Public, indexable content (Alösha's daily YouTube digest). Linked from the
// homepage and included in the sitemap.
useHead({
  title: `YouTube feed · ${routeDate.value}`,
  meta: [
    { name: "description", content: `Alösha's summarized digest of YouTube recommendations for ${routeDate.value} — AI, Apple, consciousness, science, with a personal take on each.` },
  ],
});
</script>
