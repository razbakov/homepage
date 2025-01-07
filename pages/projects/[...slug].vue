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
        <!-- Header -->
        <header class="mb-12">
          <div
            class="flex items-center gap-2 text-sm text-muted-foreground mb-4"
          >
            <div v-if="project.stack?.length" class="flex gap-2">
              <span
                v-for="tech in project.stack"
                :key="tech"
                class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary"
              >
                {{ tech }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-6 mb-6">
            <img
              v-if="project.icon"
              :src="project.icon"
              :alt="project.title"
              class="w-16 h-16"
            />
            <h1 class="text-4xl font-bold">{{ project.title }}</h1>
          </div>
          <p class="text-xl text-muted-foreground">{{ project.description }}</p>
        </header>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <ContentDoc>
            <template #empty>
              <p class="text-muted-foreground">
                No additional details available for this project.
              </p>
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
