<template>
  <NuxtLink
    v-for="item in menuItems"
    :key="item.to"
    :to="item.to"
    class="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground"
    :class="{
      'bg-secondary text-foreground': isActive(item),
    }"
    @click="$emit('itemClick')"
  >
    {{ item.label }}
  </NuxtLink>
  <a
    :href="calendlyUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
    :class="{ 'ml-2': !isMobile }"
  >
    Schedule a Call
  </a>
</template>

<script setup>
import { useRoute } from "vue-router";
import config from "~/content/config.json";

const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["itemClick"]);

const route = useRoute();
const calendlyUrl = `https://calendly.com/${config.site.calendly.username}`;

const menuItems = [
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/slides", label: "Slides" },
  { to: "/uses", label: "Uses" },
];

const isActive = (item) => {
  if (item.to === "/about" || item.to === "/uses") {
    return route.path === item.to;
  }
  return route.path.startsWith(item.to);
};
</script>
