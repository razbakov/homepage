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
        <div
          v-if="post.image"
          class="aspect-video mb-12 overflow-hidden rounded-lg bg-muted"
        >
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

        <!-- Social Sharing -->
        <div v-if="post.tweet" class="mt-8 p-4 rounded-lg border bg-muted/50">
          <p class="text-sm text-muted-foreground mb-4">
            {{
              typeof post.tweet === "string" && post.tweet.startsWith("http")
                ? "Join the discussion on X!"
                : "Have thoughts about this post? Let's discuss it on X!"
            }}
          </p>
          <a
            :href="
              typeof post.tweet === 'string' && post.tweet.startsWith('http')
                ? post.tweet
                : 'https://x.com/intent/tweet?text=' +
                  encodeURIComponent(post.tweet)
            "
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-9 items-center justify-center rounded-md bg-[#000000] px-4 text-sm font-medium text-white hover:bg-[#000000]/90"
          >
            {{
              typeof post.tweet === "string" && post.tweet.startsWith("http")
                ? "View Discussion"
                : "Share on X"
            }}
          </a>
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
              <p class="text-sm text-muted-foreground mb-2">
                Senior Web Developer & Tech Speaker sharing insights on web
                development, UX design, and tech leadership.
              </p>
              <div class="flex items-center gap-3 text-sm">
                <a
                  href="https://t.me/razbakov"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:text-primary/80"
                >
                  Telegram Channel
                </a>
                <span>•</span>
                <a
                  href="https://x.com/razbakov"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:text-primary/80"
                >
                  Follow on X
                </a>
              </div>
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
.prose p a,
.prose li a {
  @apply text-primary hover:text-primary/80 font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary/60;
}
.prose code {
  @apply text-primary bg-muted px-1.5 py-0.5 rounded text-sm;
}
.prose pre {
  @apply my-6 rounded-lg bg-zinc-900 p-4 overflow-x-auto;
}
.prose pre code {
  @apply bg-transparent p-0 text-sm leading-relaxed text-zinc-200;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
.prose pre code .hljs-keyword,
.prose pre code .hljs-built_in {
  @apply text-purple-400;
}
.prose pre code .hljs-string {
  @apply text-green-400;
}
.prose pre code .hljs-comment {
  @apply text-zinc-500;
}
.prose pre code .hljs-variable,
.prose pre code .hljs-attr {
  @apply text-blue-400;
}
.prose pre code .hljs-function {
  @apply text-yellow-400;
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
