<script setup>
const { data: page } = await useAsyncData("uses", () =>
  queryContent("/uses").findOne()
);
</script>

<template>
  <article class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <header class="mb-12">
          <h1 class="text-4xl font-bold mb-6">Uses</h1>
          <p class="text-xl text-muted-foreground">
            A list of tools, apps, hardware, and more that I use on a daily
            basis.
          </p>
        </header>

        <div class="prose prose-lg max-w-none">
          <ContentDoc />
        </div>
      </div>
    </div>
  </article>
</template>
