<template>
  <div class="min-h-screen bg-background">
    <header class="border-b">
      <nav
        class="container mx-auto px-4 h-16 flex items-center justify-between"
      >
        <NuxtLink to="/" class="font-bold text-xl">Alex Razbakov</NuxtLink>
        <div class="space-x-4">
          <NuxtLink to="/#about" class="hover:text-primary">About</NuxtLink>
          <NuxtLink to="/#services" class="hover:text-primary"
            >Services</NuxtLink
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
