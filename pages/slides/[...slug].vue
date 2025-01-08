<script setup lang="ts">
import "@slidev/client/styles/index.css";
import { defineAsyncComponent } from "vue";

const route = useRoute();
const slug = computed(() => route.params.slug as string[]);
const slidePath = computed(() => slug.value.join("/"));

// Dynamic import of the slides
const SlidesComponent = defineAsyncComponent(async () => {
  try {
    return await import(`../../content/slides/${slidePath.value}/slides.md`);
  } catch (e) {
    console.error("Failed to load slides:", e);
    return {
      render: () => h("div", "Slides not found"),
    };
  }
});
</script>

<template>
  <div class="slidev-container">
    <Suspense>
      <SlidesComponent />
      <template #fallback>
        <div>Loading slides...</div>
      </template>
    </Suspense>
  </div>
</template>

<style>
.slidev-container {
  width: 100%;
  height: 100vh;
}
</style>
