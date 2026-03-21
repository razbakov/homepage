<template>
  <div class="pt-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <div class="flex flex-col md:flex-row items-center gap-8 mb-8">
          <NuxtImg
            src="/images/alex-top.png"
            alt="Alex Razbakov"
            class="w-48 md:w-56 object-contain shrink-0"
            width="224"
            height="280"
          />
          <div>
            <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-coral-600 via-coral-500 to-teal-600 bg-clip-text text-transparent">
              {{ $t('home.title') }}
            </h1>
            <p class="text-lg text-muted-foreground leading-relaxed">
              {{ $t('home.subtitleBefore') }} <a href="https://wedance.vip/alexrazbakov" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">{{ $t('home.subtitleTeacher') }}</a>{{ $t('home.subtitleAfter') }} <NuxtLink :to="localePath('/about')" class="text-primary hover:underline">{{ $t('home.learnMore') }}</NuxtLink>
            </p>
          </div>
        </div>

        <!-- CTAs -->
        <div class="grid sm:grid-cols-2 gap-4 mb-12">
          <a
            href="https://t.me/razbakov"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-4 p-5 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all"
          >
            <Icon name="mdi:telegram" class="w-8 h-8 text-sky-500 shrink-0" />
            <div>
              <h3 class="font-semibold">{{ $t('home.joinTelegram') }}</h3>
              <p class="text-sm text-muted-foreground">{{ $t('home.telegramDescription') }}</p>
            </div>
          </a>
          <a
            href="https://youtube.com/@razbakov"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-4 p-5 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all"
          >
            <Icon name="simple-icons:youtube" class="w-8 h-8 text-red-500 shrink-0" />
            <div>
              <h3 class="font-semibold">{{ $t('home.joinYoutube') }}</h3>
              <p class="text-sm text-muted-foreground">{{ $t('home.youtubeDescription') }}</p>
            </div>
          </a>
        </div>

        <p v-if="postsByYear.length === 0" class="text-muted-foreground text-center py-12">
          {{ $t('blog.noPosts') }}
        </p>

        <div v-for="[year, yearPosts] in postsByYear" :key="year" class="mb-12">
          <h2 class="text-2xl font-bold text-foreground/80 mb-4">{{ year }}</h2>
          <div class="border-l-2 border-border/50 pl-6 space-y-1">
            <article
              v-for="post in yearPosts"
              :key="post._path"
              class="group"
            >
              <NuxtLink :to="post._path" class="block py-3 -ml-6 pl-6 hover:bg-muted/50 rounded-r-lg transition-all duration-200">
                <div class="flex items-baseline gap-4">
                  <time :datetime="post.date" class="text-sm text-muted-foreground shrink-0 tabular-nums">
                    {{ new Date(post.date).toLocaleDateString(locale, { month: "short", day: "numeric" }) }}
                  </time>
                  <div class="min-w-0">
                    <h3 class="text-base font-medium group-hover:text-primary transition-colors">
                      {{ post.title }}
                    </h3>
                    <p class="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                      {{ post.description }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </article>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const localePath = useLocalePath();
const { filterByLanguage } = useLanguageFilter();

const { data: posts } = await useAsyncData("blog-posts", () =>
  queryContent("blog").sort({ date: -1 }).find()
);

const postsByYear = computed(() => {
  if (!posts.value) return [];
  const filtered = filterByLanguage(posts.value);
  const grouped = new Map();
  for (const post of filtered) {
    const year = new Date(post.date).getFullYear();
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year).push(post);
  }
  return [...grouped.entries()];
});
</script>
