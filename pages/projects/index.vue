<script setup>
const { data: projects } = await useAsyncData("projects-list", () =>
  queryContent("projects").sort({ date: -1 }).find()
);

const activeFilter = ref("all");

const filters = [
  { key: "all", label: "Show all", icon: "lucide:sparkles" },
  { key: "Code", label: "Code", icon: "lucide:code" },
  { key: "Design", label: "Design", icon: "lucide:palette" },
  { key: "For clients", label: "For clients", icon: "lucide:handshake" },
  { key: "Concept", label: "Concept", icon: "lucide:lightbulb" },
];

const filtered = computed(() => {
  if (!projects.value) return [];
  if (activeFilter.value === "all") return projects.value;
  return projects.value.filter((p) => p.roles?.includes(activeFilter.value));
});
</script>

<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold mb-8">Projects</h1>
        <p class="text-xl text-muted-foreground mb-4">
          A showcase of my work in web development, UX design, and tech
          leadership.
        </p>

        <!-- Filter pills -->
        <div class="flex gap-2 overflow-x-auto pb-2 mb-10 -mx-4 px-4 scrollbar-none">
          <button
            v-for="f in filters"
            :key="f.key"
            @click="activeFilter = f.key"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0"
            :class="activeFilter === f.key
              ? 'bg-coral-500 text-white shadow-sm'
              : 'border border-border text-muted-foreground hover:border-coral-300 hover:text-foreground'"
          >
            <Icon v-if="f.icon" :name="f.icon" class="w-4 h-4" />
            {{ f.label }}
          </button>
        </div>

        <!-- Masonry grid -->
        <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <article
            v-for="project in filtered"
            :key="project._path"
            class="group break-inside-avoid"
          >
            <NuxtLink :to="project._path" class="block">
              <img
                v-if="project.screenshot"
                :src="project.screenshot"
                :alt="`${project.title} screenshot`"
                class="w-full h-auto border border-black/10 hover:opacity-90 transition-opacity duration-200"
              />
            </NuxtLink>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>
