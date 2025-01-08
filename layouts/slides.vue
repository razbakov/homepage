<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <header class="border-b border-gray-200 dark:border-gray-800">
      <nav
        class="container mx-auto px-4 py-4 flex items-center justify-between"
      >
        <NuxtLink
          to="/slides"
          class="text-xl font-semibold hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Presentations
        </NuxtLink>
        <button
          @click="toggleDark()"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          <div i="carbon-moon dark:carbon-sun" class="w-5 h-5" />
        </button>
      </nav>
    </header>

    <slot />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const toggleDark = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>
