<script setup>
const { locale, t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { language } = useLanguageFilter();
const { trackBlogPostRead } = useAnalytics();

const ctaCopied = ref(false);

async function copyCtaPrompt(prompt) {
  if (!prompt || !import.meta.client) return;
  await navigator.clipboard.writeText(prompt);
  ctaCopied.value = true;

  setTimeout(() => {
    ctaCopied.value = false;
  }, 2000);
}

// Strip locale prefix from path for content query
const contentPath = computed(() => {
  const path = route.path;
  const localePrefix = `/${locale.value}`;
  if (locale.value !== "en" && path.startsWith(localePrefix)) {
    return path.slice(localePrefix.length);
  }
  return path;
});

const { data: post } = await useAsyncData(
  `content-${route.path}`,
  () => queryContent(contentPath.value).findOne()
);

watch(
  () => post.value?._path,
  (path, prevPath) => {
    if (!import.meta.client || !path || path === prevPath) return;
    const slug = path.split('/').pop() || '';
    trackBlogPostRead(slug, post.value?.title || '');
  },
  { immediate: true }
);

useHead({ title: computed(() => post.value?.title) });
useSeoMeta({
  description: computed(() => post.value?.description),
  ogTitle: computed(() => post.value?.title),
  ogDescription: computed(() => post.value?.description),
  ogImage: computed(() => post.value?.image),
  twitterCard: "summary_large_image",
});
useSchemaOrg([
  defineArticle({
    "@type": "BlogPosting",
    headline: computed(() => post.value?.title),
    description: computed(() => post.value?.description),
    image: computed(() => post.value?.image),
    datePublished: computed(() => post.value?.date),
    author: {
      "@type": "Person",
      name: "Alösha",
      alternateName: "Oleksii Razbakov",
      url: "https://razbakov.com/about",
    },
  }),
  defineBreadcrumb({
    itemListElement: computed(() => [
      { name: "Blog", item: "/blog" },
      { name: post.value?.title || "" },
    ]),
  }),
]);

// Redirect to translated version if user prefers a different language
const { data: allPosts } = await useAsyncData("blog-posts", () =>
  queryContent("blog").sort({ date: -1 }).find()
);

watch(
  () => [post.value, language.value, allPosts.value],
  () => {
    if (!post.value || !allPosts.value) return;

    const postLang = post.value.language || "en";
    if (postLang === language.value) return;

    // Find the translated post by matching date and language
    const translated = allPosts.value.find(
      (p) =>
        p.date === post.value.date &&
        (p.language || "en") === language.value
    );

    if (translated) {
      navigateTo(localePath(translated._path), { replace: true });
    }
  },
  { immediate: true }
);

// Fetch related articles data
const { data: relatedPosts } = await useAsyncData(
  `related-${route.path}`,
  async () => {
    if (!post.value?.related?.length) return [];
    const posts = await Promise.all(
      post.value.related.map((p) => queryContent(p).findOne())
    );
    return posts.filter(Boolean);
  }
);

// Fetch related projects
const { data: relatedProjects } = await useAsyncData(
  `post-projects-${route.path}`,
  async () => {
    if (!post.value) return [];
    const slug = contentPath.value.split("/").pop();
    const postTags = post.value.tags?.map((t) => t.toLowerCase()) || [];
    const postTitle = post.value.title?.toLowerCase() || "";
    const projects = await queryContent("projects").find();
    return projects.filter((project) => {
      const title = project.title?.toLowerCase() || "";
      const projectSlug = project._path?.split("/").pop() || "";
      return (
        slug.includes(projectSlug) ||
        postTags.some((t) => t.includes(title) || title.includes(t)) ||
        postTitle.includes(title)
      );
    });
  }
);
</script>

<template>
  <article v-if="post" class="py-16">
    <!-- Hero Image (full-width, before title) -->
    <div
      v-if="post.image && !post.hideImage && post.heroImage"
      class="container mx-auto px-4 mb-12"
    >
      <div class="max-w-4xl mx-auto overflow-hidden rounded-lg bg-muted">
        <img
          :src="post.image"
          :alt="post.title"
          class="w-full object-cover"
          width="1200"
          height="675"
        />
      </div>
    </div>

    <div class="container mx-auto px-4">
      <div class="max-w-lg mx-auto">
        <!-- Header -->
        <header class="mb-12">
          <div
            class="text-sm text-muted-foreground mb-4"
          >
            <time :datetime="post.date">{{
              new Date(post.date).toLocaleDateString(locale, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            }}</time>
          </div>
          <h1 class="text-4xl font-bold mb-6">{{ post.title }}</h1>
          <p class="text-xl text-muted-foreground">{{ post.description }}</p>
        </header>

        <!-- Featured Image (default, inside content column) -->
        <div
          v-if="post.image && !post.hideImage && !post.heroImage"
          class="aspect-video mb-12 overflow-hidden rounded-lg bg-muted"
        >
          <img
            :src="post.image"
            :alt="post.title"
            class="h-full w-full object-cover"
            width="1200"
            height="675"
          />
        </div>

        <!-- CTA -->
        <div
          v-if="post.cta"
          class="mb-12 rounded-lg border bg-muted/50 p-8"
        >
          <template v-if="post.cta.prompt">
            <h2 class="text-2xl font-bold mb-4 text-center">
              {{ post.cta.title || $t('blog.readyToStart') }}
            </h2>
            <p class="text-muted-foreground mb-6 text-center">
              {{
                post.cta.description ||
                $t('blog.takeNextStep')
              }}
            </p>

            <div class="max-w-2xl mx-auto rounded-2xl border bg-background/80 text-left shadow-sm">
              <div class="flex flex-col gap-4 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm font-medium">{{ post.cta.stepTitle || '1. Open Claude Code on Desktop' }}</p>
                  <p class="text-sm text-muted-foreground">{{ post.cta.stepDescription || '2. Paste this prompt' }}</p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  @click="copyCtaPrompt(post.cta.prompt)"
                >
                  <Icon :name="ctaCopied ? 'lucide:check' : 'lucide:copy'" class="h-4 w-4" />
                  {{ ctaCopied ? (post.cta.copiedLabel || 'Copied') : (post.cta.copyLabel || 'Copy prompt') }}
                </button>
              </div>

              <div class="px-4 py-4">
                <pre class="whitespace-pre-wrap break-words text-sm sm:text-base leading-7 text-foreground font-mono">{{ post.cta.prompt }}</pre>
              </div>

              <div v-if="post.cta.url && post.cta.label" class="px-4 pb-4">
                <a
                  :href="post.cta.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-muted"
                >
                  {{ post.cta.label }}
                </a>
              </div>
            </div>
          </template>

          <template v-else>
            <h2 class="text-2xl font-bold mb-4 text-center">
              {{ post.cta.title || $t('blog.readyToStart') }}
            </h2>
            <p class="text-muted-foreground mb-6 text-center">
              {{
                post.cta.description ||
                $t('blog.takeNextStep')
              }}
            </p>
            <div class="text-center">
              <a
                :href="post.cta.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {{ post.cta.label }}
              </a>
            </div>
          </template>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <ContentDoc :path="contentPath" />
        </div>

        <!-- Social Sharing -->
        <div class="mt-8 p-4 rounded-lg border bg-muted/50">
          <p class="text-sm text-muted-foreground mb-4">
            {{
              post.telegram
                ? $t('blog.joinDiscussionTelegram')
                : typeof post.tweet === "string" &&
                  post.tweet.startsWith("http")
                ? $t('blog.joinDiscussionX')
                : $t('blog.haveThoughts')
            }}
          </p>
          <div class="flex flex-wrap gap-3">
            <a
              v-if="post.telegram"
              :href="post.telegram"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-9 items-center justify-center rounded-md bg-sky-500 px-4 text-sm font-medium text-white hover:bg-sky-600 gap-2"
            >
              <Icon name="mdi:telegram" class="w-4 h-4" />
              {{ $t('blog.joinTelegram') }}
            </a>
            <a
              :href="
                typeof post.tweet === 'string' && post.tweet.startsWith('http')
                  ? post.tweet
                  : 'https://x.com/intent/tweet?text=' +
                    encodeURIComponent(
                      post.tweet ||
                        `${post.title}\n\nhttps://razbakov.com${post._path}\n\nby @razbakov`
                    )
              "
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-9 items-center justify-center rounded-md bg-[#000000] px-4 text-sm font-medium text-white hover:bg-[#000000]/90 gap-2"
            >
              <Icon name="simple-icons:x" class="w-4 h-4" />
              {{
                typeof post.tweet === "string" && post.tweet.startsWith("http")
                  ? $t('blog.viewDiscussionX')
                  : $t('blog.shareOnX')
              }}
            </a>
          </div>
        </div>

        <!-- Author -->
        <div class="mt-16 pt-8 border-t">
          <div class="flex items-center gap-4">
            <NuxtImg
              src="/images/avatar.png"
              alt="Alösha"
              class="w-16 h-16 rounded-full object-cover bg-muted"
              width="64"
              height="64"
            />
            <div>
              <h3 class="font-medium">Alösha</h3>
              <p class="text-sm text-muted-foreground mb-2">
                {{ $t('blog.authorBio') }}
              </p>
              <div class="flex items-center gap-3 text-sm">
                <a
                  href="https://t.me/razbakov"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:text-primary/80"
                >
                  {{ $t('blog.telegramChannel') }}
                </a>
                <a
                  href="https://x.com/razbakov"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:text-primary/80"
                >
                  {{ $t('blog.followOnX') }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="post.tags?.length" class="mt-8 flex flex-wrap gap-2">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Navigation -->
        <nav class="mt-12 flex justify-between">
          <NuxtLink
            :to="localePath('/blog')"
            class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            ← {{ $t('blog.backToBlog') }}
          </NuxtLink>
        </nav>

        <!-- Related Projects -->
        <div v-if="relatedProjects?.length" class="mt-12 border-t pt-8">
          <h2 class="text-2xl font-bold mb-4">{{ $t('blog.relatedProjects') }}</h2>
          <div class="grid grid-cols-2 gap-4">
            <NuxtLink
              v-for="project in relatedProjects"
              :key="project._path"
              :to="project._path"
              class="group flex flex-col items-center text-center p-5 rounded-xl border border-border/50 hover:border-coral-300 hover:bg-coral-50/30 transition-all"
            >
              <img
                v-if="project.icon"
                :src="project.icon"
                :alt="project.title"
                class="w-12 h-12 object-contain mb-3 group-hover:scale-110 transition-transform duration-200"
              />
              <span class="text-sm font-semibold group-hover:text-coral-500 transition-colors">{{ project.title }}</span>
              <p class="text-xs text-muted-foreground mt-1">{{ project.description }}</p>
            </NuxtLink>
          </div>
        </div>

        <!-- Related Articles -->
        <div v-if="relatedPosts?.length" class="mt-12 border-t pt-8">
          <h2 class="text-2xl font-bold mb-6">{{ $t('blog.relatedArticles') }}</h2>
          <div class="grid gap-6">
            <article
              v-for="related in relatedPosts"
              :key="related._path"
              class="group"
            >
              <NuxtLink :to="localePath(related._path)" class="flex flex-col gap-2">
                <h3 class="text-lg font-semibold group-hover:text-primary">
                  {{ related.title }}
                </h3>
                <p class="text-sm text-muted-foreground line-clamp-2">
                  {{ related.description }}
                </p>
              </NuxtLink>
            </article>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
