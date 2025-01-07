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
        <div class="space-x-4">
          <NuxtLink to="/cv" class="hover:text-primary">CV</NuxtLink>
          <NuxtLink to="/projects" class="hover:text-primary"
            >Projects</NuxtLink
          >
          <NuxtLink to="/blog" class="hover:text-primary">Blog</NuxtLink>
          <NuxtLink to="/#contact" class="hover:text-primary">Contact</NuxtLink>
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
