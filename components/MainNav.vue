<template>
  <NuxtLink
    v-for="item in menuItems"
    :key="item.to"
    :to="item.to"
    class="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
    :class="{
      'bg-accent text-accent-foreground': isActive(item),
    }"
    @click="$emit('itemClick')"
  >
    {{ item.label }}
  </NuxtLink>
  <button
    @click="$emit('scheduleCall')"
    class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
    :class="{ 'ml-2': !isMobile }"
  >
    Schedule a Call
  </button>
</template>

<script setup>
import { useRoute } from "vue-router";

const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["itemClick", "scheduleCall"]);

const route = useRoute();

const menuItems = [
  { to: "/cv", label: "CV" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/slides", label: "Slides" },
  { to: "/uses", label: "Uses" },
];

const isActive = (item) => {
  if (item.to === "/cv" || item.to === "/uses") {
    return route.path === item.to;
  }
  return route.path.startsWith(item.to);
};
</script>
