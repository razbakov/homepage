<script setup>
const { locale } = useI18n();
const localePath = useLocalePath();
const { filterByLanguage } = useLanguageFilter();
const { path } = useRoute();

const { data: project } = await useAsyncData(`content-${path}`, () =>
  queryContent(path).findOne()
);

useHead({ title: computed(() => project.value?.title) });
useSeoMeta({
  description: computed(() => project.value?.description),
  ogTitle: computed(() => project.value?.title ? `${project.value.title} · Alex Razbakov` : undefined),
  ogDescription: computed(() => project.value?.description),
  ogImage: computed(() => project.value?.screenshot || project.value?.icon),
  twitterCard: "summary_large_image",
});

const { data: relatedPosts } = await useAsyncData(
  `project-posts-${path}`,
  async () => {
    if (!project.value) return [];
    const title = project.value.title?.toLowerCase();
    const slug = path.split("/").pop();
    const allPosts = await queryContent("blog").sort({ date: -1 }).find();
    const posts = filterByLanguage(allPosts);
    return posts.filter((post) => {
      const postPath = post._path?.toLowerCase() || "";
      const postTags = post.tags?.map((t) => t.toLowerCase()) || [];
      const postTitle = post.title?.toLowerCase() || "";
      return (
        postPath.includes(slug) ||
        postTags.some((t) => t.includes(title) || title.includes(t)) ||
        postTitle.includes(title)
      );
    });
  }
);
</script>

<template>
  <article class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Header: small logo + title -->
        <header class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <img
              v-if="project.icon"
              :src="project.icon"
              :alt="project.title"
              class="w-10 h-10 shrink-0"
              width="40"
              height="40"
            />
            <h1 class="text-4xl font-bold flex-1">{{ project.title }}</h1>
            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200 gap-2 shrink-0"
            >
              Visit Website
              <Icon name="lucide:external-link" class="w-4 h-4" />
            </a>
          </div>
          <p class="text-xl text-muted-foreground mb-2">
            {{ project.description }}
          </p>
          <a
            v-if="project.url"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-muted-foreground/70 hover:text-primary transition-colors"
          >
            {{ project.url.replace(/^https?:\/\//, '').replace(/\/$/, '') }}
          </a>
        </header>

        <!-- Screenshot -->
        <div
          v-if="project.screenshot"
          class="mb-12 rounded-xl overflow-hidden border border-border/50"
        >
          <img
            :src="project.screenshot"
            :alt="`${project.title} screenshot`"
            class="w-full h-auto"
          />
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <ContentDoc>
            <template #empty>
              <p class="text-muted-foreground"></p>
            </template>
          </ContentDoc>
        </div>

        <!-- Tags -->
        <div v-if="project.stack?.length" class="flex flex-wrap gap-2 mt-8">
          <span
            v-for="tech in project.stack"
            :key="tech"
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground"
          >
            {{ tech }}
          </span>
        </div>

        <!-- Related Blog Posts -->
        <div v-if="relatedPosts?.length" class="mt-12 border-t pt-8">
          <h2 class="text-xl font-bold mb-4">Related Posts</h2>
          <div class="space-y-3">
            <NuxtLink
              v-for="post in relatedPosts"
              :key="post._path"
              :to="localePath(post._path)"
              class="group flex items-baseline gap-3 py-2 hover:bg-muted/50 -mx-3 px-3 rounded-lg transition-colors"
            >
              <time :datetime="post.date" class="text-sm text-muted-foreground shrink-0 tabular-nums">
                {{ new Date(post.date).toLocaleDateString(locale, { month: 'short', year: 'numeric' }) }}
              </time>
              <span class="text-base group-hover:text-primary transition-colors">
                {{ post.title }}
              </span>
            </NuxtLink>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="mt-12 flex justify-between">
          <NuxtLink
            to="/projects"
            class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            ← Back to Projects
          </NuxtLink>
        </nav>
      </div>
    </div>
  </article>
</template>

<style>
.prose {
  @apply text-foreground;
}
.prose a {
  @apply text-primary hover:text-primary/80;
}
.prose code {
  @apply text-primary bg-muted px-1 py-0.5 rounded;
}
.prose pre code {
  @apply bg-transparent p-0;
}
.prose img {
  @apply rounded-lg;
}
.prose h2,
.prose h3,
.prose h4 {
  @apply font-bold text-foreground scroll-m-20;
}
.prose h2 {
  @apply text-3xl mt-12 mb-6;
}
.prose h3 {
  @apply text-2xl mt-8 mb-4;
}
.prose p {
  @apply leading-7 [&:not(:first-child)]:mt-6;
}
.prose ul {
  @apply my-6 ml-6 list-disc [&>li]:mt-2;
}
.prose blockquote {
  @apply mt-6 border-l-2 pl-6 italic;
}
</style>
