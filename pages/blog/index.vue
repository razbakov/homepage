<script setup>
const { data: posts } = await useAsyncData("blog-posts", () =>
  queryContent("blog").sort({ date: -1 }).find()
);

// Add category filtering
const selectedTags = ref(new Set());

const allTags = computed(() => {
  if (!posts.value) return new Set();
  return new Set(posts.value.flatMap((post) => post.tags || []));
});

const filteredPosts = computed(() => {
  if (!posts.value) return [];
  if (selectedTags.value.size === 0) return posts.value;

  return posts.value.filter((post) =>
    post.tags?.some((tag) => selectedTags.value.has(tag))
  );
});

const toggleTag = (tag) => {
  if (selectedTags.value.has(tag)) {
    selectedTags.value.delete(tag);
  } else {
    selectedTags.value.add(tag);
  }
  // Create a new Set to trigger reactivity
  selectedTags.value = new Set(selectedTags.value);
};
</script>

<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold mb-8">Blog</h1>
        <p class="text-xl text-muted-foreground mb-8">
          Thoughts on web development, UX design, and tech leadership.
        </p>

        <!-- Category Filter -->
        <div class="mb-12">
          <h2 class="text-sm font-medium text-muted-foreground mb-4">
            Filter by Category
          </h2>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in allTags"
              :key="tag"
              @click="toggleTag(tag)"
              :class="[
                'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                selectedTags.has(tag)
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted hover:bg-muted/80',
              ]"
            >
              {{ tag }}
              <span
                v-if="selectedTags.has(tag)"
                class="ml-1 text-xs"
                aria-hidden="true"
                >×</span
              >
            </button>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="post in filteredPosts"
            :key="post._path"
            class="group"
          >
            <NuxtLink :to="post._path" class="block">
              <div
                class="aspect-video mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center"
              >
                <img
                  v-if="post.image"
                  :src="post.image"
                  :alt="post.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div v-else class="text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="opacity-50"
                  >
                    <path
                      d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"
                    />
                    <line x1="16" x2="22" y1="5" y2="5" />
                    <line x1="19" x2="19" y1="2" y2="8" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              </div>
              <div class="space-y-2">
                <div
                  class="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <time :datetime="post.date">{{
                    new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}</time>
                </div>
                <h2
                  class="text-xl font-bold group-hover:text-primary line-clamp-2"
                >
                  {{ post.title }}
                </h2>
                <p class="text-sm text-muted-foreground line-clamp-2">
                  {{ post.description }}
                </p>
                <div class="flex flex-wrap gap-2 pt-2">
                  <span
                    v-for="tag in post.tags"
                    :key="tag"
                    class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>
