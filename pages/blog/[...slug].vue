<script setup>
const { path } = useRoute();
const { data: post } = await useAsyncData(`content-${path}`, () =>
  queryContent(path).findOne()
);

// Fetch related articles data
const { data: relatedPosts } = await useAsyncData(
  `related-${path}`,
  async () => {
    if (!post.value?.related?.length) return [];
    const posts = await Promise.all(
      post.value.related.map((path) => queryContent(path).findOne())
    );
    return posts.filter(Boolean);
  }
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
            <div class="flex flex-wrap gap-2">
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
          v-if="post.image && !post.hideImage"
          class="aspect-video mb-12 overflow-hidden rounded-lg bg-muted"
        >
          <NuxtImg
            :src="post.image"
            :alt="post.title"
            class="h-full w-full object-cover"
            width="1200"
            height="675"
          />
        </div>

        <!-- CTA -->
        <div
          v-if="post.cta"
          class="mb-12 rounded-lg border bg-muted/50 p-8 text-center"
        >
          <h2 class="text-2xl font-bold mb-4">
            {{ post.cta.title || "Ready to Get Started?" }}
          </h2>
          <p class="text-muted-foreground mb-6">
            {{
              post.cta.description ||
              "Take the next step and explore more resources."
            }}
          </p>
          <a
            :href="post.cta.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {{ post.cta.label }}
          </a>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <ContentDoc />
        </div>

        <!-- Social Sharing -->
        <div class="mt-8 p-4 rounded-lg border bg-muted/50">
          <p class="text-sm text-muted-foreground mb-4">
            {{
              post.telegram
                ? "Join the discussion on Telegram!"
                : typeof post.tweet === "string" &&
                  post.tweet.startsWith("http")
                ? "Join the discussion on X!"
                : "Have thoughts about this post? Let's discuss it on X!"
            }}
          </p>
          <div class="flex flex-wrap gap-3">
            <a
              v-if="post.telegram"
              :href="post.telegram"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-9 items-center justify-center rounded-md bg-sky-500 px-4 text-sm font-medium text-white hover:bg-sky-600 gap-2"
            >
              <Icon name="mdi:telegram" class="w-4 h-4" />
              Join Telegram Discussion
            </a>
            <a
              :href="
                typeof post.tweet === 'string' && post.tweet.startsWith('http')
                  ? post.tweet
                  : 'https://x.com/intent/tweet?text=' +
                    encodeURIComponent(
                      post.tweet ||
                        `${post.title}\n\nhttps://razbakov.com${post.permalink}\n\nby @razbakov`
                    )
              "
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-9 items-center justify-center rounded-md bg-[#000000] px-4 text-sm font-medium text-white hover:bg-[#000000]/90 gap-2"
            >
              <Icon name="simple-icons:x" class="w-4 h-4" />
              {{
                typeof post.tweet === "string" && post.tweet.startsWith("http")
                  ? "View Discussion on X"
                  : "Share on X"
              }}
            </a>
          </div>
        </div>

        <!-- Author -->
        <div class="mt-16 pt-8 border-t">
          <div class="flex items-center gap-4">
            <NuxtImg
              src="/images/avatar.png"
              alt="Alex Razbakov"
              class="w-16 h-16 rounded-full object-cover bg-muted"
              width="64"
              height="64"
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

        <!-- Related Articles -->
        <div v-if="relatedPosts?.length" class="mt-12 border-t pt-8">
          <h2 class="text-2xl font-bold mb-6">Related Articles</h2>
          <div class="grid gap-6">
            <article
              v-for="related in relatedPosts"
              :key="related._path"
              class="group"
            >
              <NuxtLink :to="related._path" class="flex flex-col gap-2">
                <h3 class="text-lg font-semibold group-hover:text-primary">
                  {{ related.title }}
                </h3>
                <p class="text-sm text-muted-foreground line-clamp-2">
                  {{ related.description }}
                </p>
              </NuxtLink>
            </article>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
