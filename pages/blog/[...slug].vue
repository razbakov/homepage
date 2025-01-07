<script setup>
const { path } = useRoute();
const { data: post } = await useAsyncData(`content-${path}`, () =>
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
            <time :datetime="post.date">{{
              new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            }}</time>
            <span>•</span>
            <div class="flex gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <h1 class="text-4xl font-bold mb-6">{{ post.title }}</h1>
          <p class="text-xl text-muted-foreground">{{ post.description }}</p>
        </header>

        <!-- Featured Image -->
        <div class="aspect-video mb-12 overflow-hidden rounded-lg bg-muted">
          <img
            :src="post.image"
            :alt="post.title"
            class="h-full w-full object-cover"
          />
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <ContentDoc />
        </div>

        <!-- Author -->
        <div class="mt-16 pt-8 border-t">
          <div class="flex items-center gap-4">
            <img
              src="/images/avatar.png"
              alt="Alex Razbakov"
              class="w-16 h-16 rounded-full object-cover bg-muted"
            />
            <div>
              <h3 class="font-medium">Alex Razbakov</h3>
              <p class="text-sm text-muted-foreground">
                Senior Web Developer & Tech Speaker sharing insights on web
                development, UX design, and tech leadership.
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="mt-12 flex justify-between">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            ← Back to Blog
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
