<template>
  <div class="w-full h-screen">
    <iframe
      :src="slidevUrl"
      class="w-full h-full border-0"
      allow="fullscreen"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const topic = computed(() => route.params.topic as string);
const isDev = process.env.NODE_ENV === "development";

const slidevUrl = computed(() => {
  if (isDev) {
    return `http://localhost:3030`;
  }
  return `/slides/${topic.value}/index.html`;
});
</script>
