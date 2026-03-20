<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-coral-600 via-coral-500 to-teal-600 bg-clip-text text-transparent">
          Blog
        </h1>
        <p class="text-lg text-muted-foreground mb-12">
          Sharing insights and experiences on topics I'm passionate about.
        </p>

        <div class="space-y-0 divide-y divide-border/50">
          <article
            v-for="post in posts"
            :key="post._path"
            class="group"
          >
            <NuxtLink :to="post._path" class="block py-6 hover:pl-2 transition-all duration-200">
              <div class="flex items-baseline gap-4">
                <time :datetime="post.date" class="text-sm text-muted-foreground shrink-0 w-32">
                  {{ new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }}
                </time>
                <div class="min-w-0">
                  <h2 class="text-lg font-semibold group-hover:text-primary transition-colors">
                    {{ post.title }}
                  </h2>
                  <p class="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {{ post.description }}
                  </p>
                </div>
              </div>
            </NuxtLink>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: posts } = await useAsyncData("blog-posts", () =>
  queryContent("blog").sort({ date: -1 }).find()
);
</script>
