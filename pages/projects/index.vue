<script setup>
useHead({ title: "Projects" });
useSeoMeta({
  description: "Community platforms, AI tools, client sites, and side projects — things I've built, shipped, or am still figuring out.",
  ogTitle: "Projects - Alex Razbakov",
  ogDescription: "Community platforms, AI tools, client sites, and side projects.",
  twitterCard: "summary",
});

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
  { key: "AI", label: "AI", icon: "lucide:bot" },
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
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-8">Projects</h1>
        <p class="text-xl text-muted-foreground mb-4">
          Things I've built, shipped, or am still figuring out.
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

        <!-- Logo grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <NuxtLink
            v-for="project in filtered"
            :key="project._path"
            :to="project._path"
            class="group flex flex-col items-center text-center p-6 rounded-xl border border-border/50 hover:border-coral-300 hover:bg-coral-50/30 transition-all duration-200"
          >
            <img
              v-if="project.icon"
              :src="project.icon"
              :alt="project.title"
              class="w-16 h-16 object-contain mb-4 group-hover:scale-110 transition-transform duration-200"
            />
            <div
              v-else
              class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 text-2xl font-bold text-muted-foreground"
            >
              {{ project.title?.charAt(0) }}
            </div>
            <h2 class="text-base font-semibold group-hover:text-coral-500 transition-colors">
              {{ project.title }}
            </h2>
            <p class="text-sm text-muted-foreground mt-1">
              {{ project.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
