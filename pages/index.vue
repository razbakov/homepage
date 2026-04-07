<template>
  <div class="pt-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <div class="flex flex-col md:flex-row items-center gap-8 mb-8">
          <NuxtImg
            src="/images/alex-top.webp"
            alt="Alösha"
            class="w-48 md:w-56 object-contain shrink-0"
            width="224"
            height="280"
            sizes="192px md:224px"
            loading="eager"
            preload
          />
          <div>
            <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-coral-600 via-coral-500 to-teal-600 bg-clip-text text-transparent">
              {{ $t('home.title') }}
            </h1>
            <p class="text-lg text-muted-foreground leading-relaxed">
              {{ $t('home.subtitleBefore') }} <a href="https://montuno.club" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">{{ $t('home.subtitleTeacher') }}</a>{{ $t('home.subtitleAfter') }} <NuxtLink :to="localePath('/about')" class="text-primary hover:underline">{{ $t('home.learnMore') }}</NuxtLink>
            </p>
          </div>
        </div>

        <!-- Academy banner -->
        <a
          href="https://learn-by-doing-academy.com"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-4 p-5 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all mb-8 group"
        >
          <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
            <span class="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">&lt;LBD&gt;</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold group-hover:text-primary transition-colors">{{ $t('home.academyTitle') }}</h3>
            <p class="text-sm text-muted-foreground">{{ $t('home.academyDescription') }}</p>
          </div>
          <span class="text-primary text-sm font-medium shrink-0 hidden sm:block">{{ $t('home.academyCta') }} →</span>
        </a>

        <!-- Services nudge -->
        <p class="text-sm text-muted-foreground mb-8">
          {{ $t('home.servicesNudge') }}
          <NuxtLink :to="localePath('/services')" class="text-primary hover:underline">{{ $t('home.servicesNudgeLink') }}</NuxtLink>
        </p>

        <!-- Interest filters -->
        <div class="flex gap-2 overflow-x-auto pb-2 mb-10 -mx-4 px-4 scrollbar-none">
          <button
            v-for="interest in interests"
            :key="interest.key"
            @click="activeInterest = interest.key"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0"
            :class="activeInterest === interest.key
              ? 'bg-coral-500 text-white shadow-sm'
              : 'border border-border text-muted-foreground hover:border-coral-300 hover:text-foreground'"
          >
            <Icon v-if="interest.icon" :name="interest.icon" class="w-4 h-4" />
            {{ $t(`home.interests.${interest.key}`) }}
          </button>
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
              <NuxtLink :to="localePath(post._path)" class="block py-3 -ml-6 pl-6 hover:bg-muted/50 rounded-r-lg transition-all duration-200">
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
const { locale, t } = useI18n();
useHead({ titleTemplate: "Alösha — Fullstack Developer & AI Engineer in Munich" });
useSeoMeta({
  description: () => t('seo.homeDesc'),
  ogTitle: "Alösha",
  ogDescription: () => t('seo.homeDesc'),
  ogImage: "/images/avatar.png",
  twitterCard: "summary",
});
useSchemaOrg([
  defineWebSite({ name: "Alösha" }),
  defineWebPage({ name: "Alösha — Fullstack Developer & AI Engineer in Munich" }),
]);
const localePath = useLocalePath();
const { filterByLanguage } = useLanguageFilter();

const telegramUrl = computed(() =>
  ['ru', 'uk'].includes(locale.value) ? 'https://t.me/razbakov_ru' : 'https://t.me/razbakov'
);

const activeInterest = ref('all');

const interests = [
  { key: 'all', icon: null, categories: [] },
  { key: 'building', icon: 'lucide:code', categories: ['Technology'] },
  { key: 'dancing', icon: 'lucide:music', categories: ['Dance'] },
  { key: 'thinking', icon: 'lucide:lightbulb', categories: ['Philosophy', 'Ideas', 'Writing'] },
  { key: 'optimizing', icon: 'lucide:settings', categories: ['Productivity', 'Personal Finance', 'Lifestyle'] },
  { key: 'exploring', icon: 'lucide:compass', categories: ['Travel'] },
];

const { data: posts } = await useAsyncData("blog-posts", () =>
  queryContent("blog").sort({ date: -1 }).find()
);

const postsByYear = computed(() => {
  if (!posts.value) return [];
  let filtered = filterByLanguage(posts.value).filter(
    (post) => post.category !== "Unlisted"
  );

  const active = interests.find(i => i.key === activeInterest.value);
  if (active && active.categories.length > 0) {
    filtered = filtered.filter(post => active.categories.includes(post.category));
  }

  const grouped = new Map();
  for (const post of filtered) {
    const year = new Date(post.date).getFullYear();
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year).push(post);
  }
  return [...grouped.entries()];
});
</script>
