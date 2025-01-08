<script setup>
const { data: presentations } = await useAsyncData("slides-list", () =>
  queryContent("slides")
    .where({
      _extension: "md",
      _file: { $regex: /slides\.md$/ }, // Only include files named slides.md
    })
    .find()
    .then((items) =>
      items.map((item) => {
        const pathParts = item._file?.split("/") || [];
        const topic = pathParts[pathParts.length - 2] || "";
        return {
          title: item.title || topic,
          description: item.description,
          path: `/slides/${topic}`,
        };
      })
    )
);

useHead({
  title: "Presentations",
  meta: [{ name: "description", content: "List of available presentations" }],
});
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
      Presentations
    </h1>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <a
        v-for="presentation in presentations"
        :key="presentation.path"
        :href="presentation.path"
        class="block p-6 rounded-lg border border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 transition-colors"
      >
        <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {{ presentation.title }}
        </h2>
        <p
          v-if="presentation.description"
          class="text-gray-600 dark:text-gray-400 mb-4"
        >
          {{ presentation.description }}
        </p>
      </a>
    </div>

    <div v-if="!presentations?.length" class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-400">
        No presentations available yet. Add markdown files to
        content/slides/[topic]/slides.md
      </p>
    </div>
  </main>
</template>
