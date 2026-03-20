<template>
  <div class="min-h-screen bg-background">
    <header class="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <nav
        class="container mx-auto px-4 h-16 flex items-center justify-between"
      >
        <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80">
          <NuxtImg
            :src="config.site.avatar"
            :alt="config.site.name"
            class="w-8 h-8 rounded-full ring-2 ring-primary/20"
            width="32"
            height="32"
          />
          <span class="font-bold text-xl">{{ config.site.name }}</span>
        </NuxtLink>

        <!-- Mobile Menu Button -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 rounded-md hover:bg-secondary"
          aria-label="Toggle menu"
        >
          <div class="w-6 h-6 flex flex-col justify-center gap-1.5">
            <span
              class="block w-full h-0.5 bg-foreground transition-transform"
              :class="{ 'rotate-45 translate-y-2': isMenuOpen }"
            ></span>
            <span
              class="block w-full h-0.5 bg-foreground transition-opacity"
              :class="{ 'opacity-0': isMenuOpen }"
            ></span>
            <span
              class="block w-full h-0.5 bg-foreground transition-transform"
              :class="{ '-rotate-45 -translate-y-2': isMenuOpen }"
            ></span>
          </div>
        </button>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-1">
          <MainNav />
        </div>
      </nav>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden border-t border-border/50">
        <div class="container mx-auto px-4 py-4 flex flex-col gap-2">
          <MainNav
            :is-mobile="true"
            @item-click="isMenuOpen = false"
          />
        </div>
      </div>
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer class="border-t border-border/50 py-8 mt-16">
      <div
        class="container mx-auto px-4 text-center text-sm text-muted-foreground"
      >
        &copy; {{ new Date().getFullYear() }} {{ config.site.name }}. All rights
        reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import config from "~/content/config.json";

const isMenuOpen = ref(false);
</script>
