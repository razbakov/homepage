<script setup>
const { data: page } = await useAsyncData("uses", () =>
  queryContent("/uses").findOne()
);

// Extract categories and items from the content
const categories = ref([]);

onMounted(async () => {
  // Process the content to extract categories and items
  const content = document.querySelector(".prose");
  if (content) {
    const headings = content.querySelectorAll("h2");
    headings.forEach((heading) => {
      const category = {
        title: heading.textContent,
        items: [],
      };

      let ul = heading.nextElementSibling;
      if (ul && ul.tagName === "UL") {
        const items = ul.querySelectorAll("li");
        items.forEach((item) => {
          const link = item.querySelector("a");
          const text = item.textContent;
          const name = link ? link.textContent : text.split("–")[0].trim();
          const description = text.includes("–")
            ? text.split("–")[1].trim()
            : "";
          const url = link ? link.getAttribute("href") : "";

          category.items.push({
            name,
            description,
            url,
          });
        });
      }

      categories.value.push(category);
    });
  }
});

// Get icon for category
function getCategoryIcon(title) {
  const icons = {
    "Knowledge Base": "i-lucide-book-open",
    Editors: "i-lucide-edit-3",
    Meetings: "i-lucide-video",
    "Organize and notes": "i-lucide-clipboard-list",
    Commerce: "i-lucide-shopping-cart",
    Everyday: "i-lucide-smartphone",
    Gear: "i-lucide-cpu",
    Newsletters: "i-lucide-mail",
  };

  return icons[title] || "i-lucide-tool";
}
</script>

<template>
  <article class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-5xl mx-auto">
        <header class="mb-12 text-center">
          <h1 class="text-4xl font-bold mb-6">Uses</h1>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of tools, apps, hardware, and services I use daily to
            stay productive and creative.
          </p>
        </header>

        <!-- Telegram CTA -->
        <div
          class="mb-12 p-6 bg-primary/10 rounded-lg border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div class="flex items-center gap-4">
            <div class="text-4xl text-primary i-lucide-send"></div>
            <div>
              <h3 class="text-xl font-bold">Join My Telegram Channel</h3>
              <p class="text-muted-foreground">
                Get updates on my live coding sessions, projects, and tech
                insights
              </p>
            </div>
          </div>
          <a
            href="https://t.me/razbakov"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Subscribe Now
          </a>
        </div>

        <!-- Hidden content for extraction -->
        <div class="hidden">
          <ContentDoc />
        </div>

        <!-- Categories Grid -->
        <div
          v-if="categories.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div
            v-for="(category, index) in categories"
            :key="index"
            class="p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                :class="[
                  getCategoryIcon(category.title),
                  'text-2xl text-primary',
                ]"
              ></div>
              <h2 class="text-2xl font-bold">{{ category.title }}</h2>
            </div>

            <ul class="space-y-4">
              <li
                v-for="(item, itemIndex) in category.items"
                :key="itemIndex"
                class="flex gap-3"
              >
                <div class="text-primary i-lucide-check mt-1"></div>
                <div>
                  <div class="font-medium">
                    <a
                      v-if="item.url"
                      :href="item.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="hover:text-primary hover:underline"
                    >
                      {{ item.name }}
                    </a>
                    <span v-else>{{ item.name }}</span>
                  </div>
                  <p
                    v-if="item.description"
                    class="text-sm text-muted-foreground"
                  >
                    {{ item.description }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Fallback if JS processing fails -->
        <div v-else class="prose prose-lg max-w-none">
          <ContentDoc />
        </div>
      </div>
    </div>
  </article>
</template>
