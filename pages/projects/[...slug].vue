<script setup>
const { path } = useRoute();
const { data: project } = await useAsyncData(`content-${path}`, () =>
  queryContent(path).findOne()
);
</script>

<template>
  <article class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Screenshot -->
        <div
          v-if="project.screenshot"
          class="mb-8 rounded-xl overflow-hidden border border-border/50 shadow-lg"
        >
          <img
            :src="project.screenshot"
            :alt="`${project.title} screenshot`"
            class="w-full h-auto"
          />
        </div>

        <!-- Header: small logo + title -->
        <header class="mb-12">
          <div class="flex items-center gap-4 mb-4">
            <img
              v-if="project.icon"
              :src="project.icon"
              :alt="project.title"
              class="w-10 h-10 shrink-0"
              width="40"
              height="40"
            />
            <h1 class="text-4xl font-bold">{{ project.title }}</h1>
          </div>
          <p class="text-xl text-muted-foreground mb-4">
            {{ project.description }}
          </p>
          <div class="flex items-center gap-4">
            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
            >
              Visit Site
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
          <div v-if="project.stack?.length" class="flex flex-wrap gap-2 mt-4">
            <span
              v-for="tech in project.stack"
              :key="tech"
              class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary"
            >
              {{ tech }}
            </span>
          </div>
        </header>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <ContentDoc>
            <template #empty>
              <p class="text-muted-foreground"></p>
            </template>
          </ContentDoc>
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
