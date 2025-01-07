<script setup>
const { data: posts } = await useAsyncData("blog-posts", () =>
  queryContent("blog").sort({ date: -1 }).find()
);
</script>

<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold mb-8">Blog</h1>
        <p class="text-xl text-muted-foreground mb-12">
          Thoughts on web development, UX design, and tech leadership.
        </p>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <article v-for="post in posts" :key="post._path" class="group">
            <NuxtLink :to="post._path" class="block">
              <div
                class="aspect-video mb-4 overflow-hidden rounded-lg bg-muted"
              >
                <img
                  :src="post.image"
                  :alt="post.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
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
