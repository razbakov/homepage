<script setup>
const { data: projects } = await useAsyncData("projects-list", () =>
  queryContent("projects").sort({ date: -1 }).find()
);
</script>

<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold mb-8">Projects</h1>
        <p class="text-xl text-muted-foreground mb-12">
          A showcase of my work in web development, UX design, and tech
          leadership.
        </p>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="project in projects"
            :key="project._path"
            class="group"
          >
            <NuxtLink :to="project._path" class="block">
              <NuxtImg
                v-if="project.icon"
                :src="project.icon"
                :alt="project.title"
                class="h-7 w-auto mb-4"
                style="max-width: 120px"
                height="28"
              />
              <div v-else class="h-7 mb-4 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="opacity-50"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h10" />
                  <path d="M7 12h10" />
                  <path d="M7 17h10" />
                </svg>
              </div>
              <div class="space-y-2">
                <h2
                  class="text-xl font-bold group-hover:text-primary line-clamp-2"
                >
                  {{ project.title }}
                </h2>
                <p class="text-sm text-muted-foreground line-clamp-2">
                  {{ project.description }}
                </p>
                <div class="flex flex-wrap gap-2 pt-2">
                  <span
                    v-for="tech in project.stack"
                    :key="tech"
                    class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {{ tech }}
                  </span>
                </div>
                <a
                  v-if="project.url"
                  :href="project.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary hover:text-primary/80"
                  @click.stop
                >
                  Visit Site
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
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
            </NuxtLink>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>
