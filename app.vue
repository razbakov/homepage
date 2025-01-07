<template>
  <div class="min-h-screen bg-background">
    <header class="border-b">
      <nav
        class="container mx-auto px-4 h-16 flex items-center justify-between"
      >
        <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80">
          <img
            src="/images/avatar.png"
            alt="Alex Razbakov"
            class="w-8 h-8 rounded-full"
          />
          <span class="font-bold text-xl">Alex Razbakov</span>
        </NuxtLink>
        <div class="flex items-center gap-1">
          <NuxtLink
            to="/cv"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            CV
          </NuxtLink>
          <NuxtLink
            to="/projects"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Projects
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Blog
          </NuxtLink>
          <button
            @click="openCalendly"
            class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ml-2"
          >
            Schedule a Call
          </button>
        </div>
      </nav>
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer class="border-t py-8 mt-16">
      <div
        class="container mx-auto px-4 text-center text-sm text-muted-foreground"
      >
        © {{ new Date().getFullYear() }} Alex Razbakov. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
const openCalendly = () => {
  Calendly.initPopupWidget({
    url: "https://calendly.com/razbakov",
    prefill: {},
    pageSettings: {
      backgroundColor: "ffffff",
      hideEventTypeDetails: false,
      hideLandingPageDetails: false,
      primaryColor: "00a2ff",
      height: "900",
    },
    enableClosing: true,
  });
};

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.async = true;
  document.head.appendChild(script);
});
</script>

<style>
.calendly-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9999;
}

.calendly-popup-content {
  height: 900px !important;
}

.calendly-inline-widget {
  height: 900px !important;
}
</style>
