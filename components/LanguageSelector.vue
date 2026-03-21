<template>
  <div class="relative" ref="wrapper">
    <button
      @click="open = !open"
      class="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
    >
      <Icon name="lucide:globe" class="w-4 h-4" />
      <span>{{ currentShort }}</span>
      <span v-if="!compact" class="text-muted-foreground">{{ currentLabel }}</span>
      <svg class="w-3 h-3 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>
    <div
      v-if="open"
      class="absolute right-0 mt-1 w-44 rounded-md border border-border bg-popover shadow-md z-50"
    >
      <NuxtLink
        v-for="lang in languages"
        :key="lang.code"
        :to="switchLocalePath(lang.code)"
        @click="open = false"
        :class="[
          'block w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2',
          language === lang.code
            ? 'bg-accent text-accent-foreground font-medium'
            : 'text-popover-foreground hover:bg-accent/50',
        ]"
      >
        <span class="w-6 text-muted-foreground">{{ lang.short }}</span>
        <span>{{ lang.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  compact: { type: Boolean, default: false },
});

const { language, languages } = useLanguageFilter();
const switchLocalePath = useSwitchLocalePath();
const open = ref(false);
const wrapper = ref(null);

const currentLang = computed(() =>
  languages.find((l) => l.code === language.value)
);
const currentLabel = computed(() => currentLang.value?.label ?? "English");
const currentShort = computed(() => currentLang.value?.short ?? "EN");

const onClickOutside = (e) => {
  if (wrapper.value && !wrapper.value.contains(e.target)) {
    open.value = false;
  }
};

onMounted(() => document.addEventListener("click", onClickOutside));
onUnmounted(() => document.removeEventListener("click", onClickOutside));
</script>
