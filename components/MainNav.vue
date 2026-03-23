<template>
  <NuxtLink
    v-for="item in menuItems"
    :key="item.key"
    :to="localePath(item.to)"
    class="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground"
    :class="{
      'bg-secondary text-foreground': isActive(item),
    }"
    @click="$emit('itemClick')"
  >
    {{ $t(`nav.${item.key}`) }}
  </NuxtLink>
  <a
    :href="calendlyUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
    :class="{ 'ml-2': !isMobile }"
    @click="trackCalendlyOpen('nav')"
  >
    {{ $t('nav.scheduleCall') }}
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

const { trackCalendlyOpen } = useAnalytics();

const route = useRoute();
const localePath = useLocalePath();
const calendlyUrl = `https://calendly.com/${config.site.calendly.username}`;

const menuItems = [
  { to: "/", key: "home" },
  { to: "/about", key: "about" },
  { to: "/projects", key: "projects" },
];

const isActive = (item) => {
  const localized = localePath(item.to);
  if (item.key === "home") {
    return route.path === localized;
  }
  return route.path.startsWith(localized);
};
</script>
