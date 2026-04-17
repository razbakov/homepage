<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Hero -->
        <section class="mb-16 text-center">
          <p class="text-sm font-semibold tracking-wide uppercase text-primary/80 mb-4">
            {{ copy.hero.eyebrow }}
          </p>
          <h1 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-coral-600 via-coral-500 to-teal-600 bg-clip-text text-transparent leading-tight">
            {{ copy.hero.title }}
          </h1>
          <p class="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            {{ copy.hero.subtitle }}
          </p>

          <!-- Progress -->
          <div class="max-w-md mx-auto mb-8">
            <div class="flex items-baseline justify-center gap-2 mb-2">
              <span class="text-5xl font-bold text-coral-500 tabular-nums">{{ progress.completed }}</span>
              <span class="text-2xl font-bold text-muted-foreground">{{ copy.hero.progressOf }} {{ progress.target }}</span>
            </div>
            <p class="text-sm text-muted-foreground mb-3">{{ copy.hero.progressLabel }}</p>
            <div class="h-2 rounded-full bg-muted overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-coral-500 to-coral-400 transition-all duration-500"
                :style="{ width: progressPct + '%' }"
              ></div>
            </div>
            <p v-if="statusLine" class="text-xs text-muted-foreground/80 mt-3 italic">
              {{ copy.hero.statusPrefix }}: {{ statusLine }}
            </p>
          </div>

          <div class="flex flex-wrap gap-3 justify-center">
            <a
              href="#form"
              class="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              {{ copy.hero.ctaPrimary }}
            </a>
            <a
              href="#bet"
              class="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-medium border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors"
            >
              {{ copy.hero.ctaSecondary }}
            </a>
          </div>
        </section>

        <!-- Offer: includes vs excludes -->
        <section class="mb-16">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center">{{ copy.offer.title }}</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="p-6 rounded-xl border border-coral-200 bg-coral-50/40">
              <div class="flex items-center gap-2 mb-4">
                <Icon name="lucide:check-circle-2" class="w-5 h-5 text-coral-600" />
                <h3 class="font-bold">{{ copy.offer.includesTitle }}</h3>
              </div>
              <ul class="space-y-2.5 text-sm text-foreground/90 leading-relaxed">
                <li v-for="(item, i) in copy.offer.includes" :key="i" class="flex gap-2">
                  <Icon name="lucide:check" class="w-4 h-4 text-coral-600 shrink-0 mt-0.5" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
            <div class="p-6 rounded-xl border border-border/50 bg-muted/30">
              <div class="flex items-center gap-2 mb-4">
                <Icon name="lucide:x-circle" class="w-5 h-5 text-muted-foreground" />
                <h3 class="font-bold">{{ copy.offer.excludesTitle }}</h3>
              </div>
              <ul class="space-y-2.5 text-sm text-muted-foreground leading-relaxed">
                <li v-for="(item, i) in copy.offer.excludes" :key="i" class="flex gap-2">
                  <Icon name="lucide:minus" class="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
          <p class="text-sm text-muted-foreground mt-6 text-center italic">{{ copy.offer.note }}</p>
        </section>

        <!-- Audits -->
        <section class="mb-16">
          <h2 class="text-2xl md:text-3xl font-bold mb-3 text-center">{{ copy.audits.title }}</h2>
          <p class="text-muted-foreground text-center max-w-2xl mx-auto mb-8 leading-relaxed">
            {{ copy.audits.subtitle }}
          </p>

          <div v-if="audits.length" class="grid sm:grid-cols-2 gap-4">
            <a
              v-for="audit in audits"
              :key="audit.url"
              :href="audit.url"
              target="_blank"
              rel="noopener noreferrer"
              class="group block rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div class="aspect-video bg-muted overflow-hidden">
                <img
                  :src="audit.thumbnail || youtubeThumbnail(audit.url)"
                  :alt="audit.title"
                  class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div class="p-4">
                <p class="text-xs font-medium text-primary/80 uppercase tracking-wide mb-1">
                  {{ audit.business }}
                </p>
                <h3 class="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {{ audit.title }}
                </h3>
                <p class="text-xs text-muted-foreground mt-2">{{ copy.audits.watchCta }} →</p>
              </div>
            </a>
          </div>
          <div v-else class="rounded-xl border border-dashed border-border/70 p-8 text-center bg-muted/20">
            <Icon name="lucide:youtube" class="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <h3 class="font-semibold mb-2">{{ copy.audits.emptyTitle }}</h3>
            <p class="text-sm text-muted-foreground max-w-md mx-auto mb-4">{{ copy.audits.emptyBody }}</p>
            <a
              href="https://youtube.com/@razbakov"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-medium border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors"
            >
              {{ copy.audits.subscribeCta }}
            </a>
          </div>
        </section>

        <!-- Bet -->
        <section id="bet" class="mb-16">
          <div class="relative rounded-2xl overflow-hidden p-8 md:p-10 text-center">
            <div class="absolute inset-0 bg-gradient-to-br from-coral-50/70 via-secondary/40 to-teal-50/40"></div>
            <div class="relative">
              <h2 class="text-2xl md:text-3xl font-bold mb-3">{{ copy.bet.title }}</h2>
              <p class="text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed">{{ copy.bet.body }}</p>
              <div class="flex flex-wrap gap-3 justify-center">
                <a
                  :href="telegramBetUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex h-10 items-center gap-2 justify-center rounded-lg px-5 text-sm font-medium border border-border hover:border-primary/30 hover:bg-white/50 transition-colors"
                >
                  <Icon name="lucide:send" class="w-4 h-4" />
                  {{ copy.bet.telegramCta }}
                </a>
                <a
                  :href="xBetUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex h-10 items-center gap-2 justify-center rounded-lg px-5 text-sm font-medium border border-border hover:border-primary/30 hover:bg-white/50 transition-colors"
                >
                  <Icon name="lucide:twitter" class="w-4 h-4" />
                  {{ copy.bet.xCta }}
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Lead form -->
        <section id="form" class="mb-16 scroll-mt-20">
          <h2 class="text-2xl md:text-3xl font-bold mb-3 text-center">{{ copy.form.title }}</h2>
          <p class="text-muted-foreground text-center max-w-xl mx-auto mb-8 leading-relaxed">
            {{ copy.form.subtitle }}
          </p>

          <div v-if="submitted" class="rounded-xl border border-coral-200 bg-coral-50/40 p-8 text-center">
            <Icon name="lucide:check-circle-2" class="w-10 h-10 text-coral-600 mx-auto mb-3" />
            <h3 class="text-lg font-bold mb-2">{{ copy.form.successTitle }}</h3>
            <p class="text-sm text-muted-foreground">{{ copy.form.successBody }}</p>
          </div>

          <form
            v-else
            name="web100-lead"
            @submit.prevent="onSubmit"
            class="space-y-5 rounded-xl border border-border/50 p-6 md:p-8 bg-card"
          >
            <!-- Honeypot — real humans leave this empty. -->
            <p class="hidden" aria-hidden="true">
              <label>Don't fill this out: <input v-model="honeypot" tabindex="-1" autocomplete="off" /></label>
            </p>

            <div>
              <label for="business" class="block text-sm font-medium mb-1.5">{{ copy.form.businessLabel }}</label>
              <input
                id="business"
                v-model="form.business"
                name="business"
                type="text"
                :placeholder="copy.form.businessPlaceholder"
                class="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
                :class="{ 'border-red-400 focus:ring-red-300': errors.business }"
              />
              <p v-if="errors.business" class="text-xs text-red-600 mt-1.5">{{ errors.business }}</p>
            </div>

            <div>
              <label for="url" class="block text-sm font-medium mb-1.5">{{ copy.form.urlLabel }}</label>
              <input
                id="url"
                v-model="form.url"
                name="url"
                type="url"
                :placeholder="copy.form.urlPlaceholder"
                class="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
                :class="{ 'border-red-400 focus:ring-red-300': errors.url }"
              />
              <p v-if="errors.url" class="text-xs text-red-600 mt-1.5">{{ errors.url }}</p>
            </div>

            <div>
              <label for="description" class="block text-sm font-medium mb-1.5">{{ copy.form.descLabel }}</label>
              <textarea
                id="description"
                v-model="form.description"
                name="description"
                rows="4"
                :placeholder="copy.form.descPlaceholder"
                class="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors resize-y"
                :class="{ 'border-red-400 focus:ring-red-300': errors.description }"
              ></textarea>
              <p v-if="errors.description" class="text-xs text-red-600 mt-1.5">{{ errors.description }}</p>
            </div>

            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label for="email" class="block text-sm font-medium mb-1.5">{{ copy.form.emailLabel }}</label>
                <input
                  id="email"
                  v-model="form.email"
                  name="email"
                  type="email"
                  :placeholder="copy.form.emailPlaceholder"
                  class="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
                  :class="{ 'border-red-400 focus:ring-red-300': errors.email }"
                />
                <p v-if="errors.email" class="text-xs text-red-600 mt-1.5">{{ errors.email }}</p>
              </div>

              <div>
                <label for="language" class="block text-sm font-medium mb-1.5">{{ copy.form.languageLabel }}</label>
                <select
                  id="language"
                  v-model="form.language"
                  name="language"
                  class="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
                  :class="{ 'border-red-400 focus:ring-red-300': errors.language }"
                >
                  <option value="">—</option>
                  <option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
                <p v-if="errors.language" class="text-xs text-red-600 mt-1.5">{{ errors.language }}</p>
              </div>
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="inline-flex w-full sm:w-auto h-11 items-center justify-center rounded-lg px-8 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {{ submitting ? copy.form.submitting : copy.form.submit }}
            </button>
          </form>
        </section>

        <!-- FAQ -->
        <section class="mb-16">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center">{{ copy.faq.title }}</h2>
          <div class="space-y-3">
            <details
              v-for="(item, i) in copy.faq.items"
              :key="i"
              class="group rounded-xl border border-border/50 bg-card [&_summary::-webkit-details-marker]:hidden"
            >
              <summary class="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-semibold hover:text-primary transition-colors">
                <span>{{ item.q }}</span>
                <Icon name="lucide:chevron-down" class="w-5 h-5 shrink-0 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <div class="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                {{ item.a }}
              </div>
            </details>
          </div>
        </section>

        <!-- Final CTA -->
        <section class="relative rounded-2xl overflow-hidden p-8 md:p-12 text-center">
          <div class="absolute inset-0 bg-gradient-to-br from-coral-50/50 via-secondary/50 to-teal-50/30"></div>
          <div class="relative">
            <h2 class="text-2xl font-bold mb-3">{{ copy.finalCta.title }}</h2>
            <p class="text-muted-foreground mb-6">{{ copy.finalCta.body }}</p>
            <div class="flex flex-wrap gap-3 justify-center">
              <a
                href="#form"
                class="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg transition-all"
              >
                {{ copy.finalCta.primary }}
              </a>
              <a
                :href="calendlyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-medium border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors"
              >
                {{ copy.finalCta.secondary }}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { z } from "zod";
import config from "~/content/config.json";

const { locale } = useI18n();

// Load copy + data from @nuxt/content YAML
const [{ data: copyData }, { data: progressData }, { data: auditsData }] = await Promise.all([
  useAsyncData("web100-copy", () => queryContent("data/web100-copy").findOne()),
  useAsyncData("web100-progress", () => queryContent("data/web100-progress").findOne()),
  useAsyncData("web100-audits", () => queryContent("data/web100-audits").findOne()),
]);

// German is the primary audience for /web100 (Munich business cards).
// We serve DE by default on every locale. English (and future es/ru/uk)
// readers can still see the full site in their language elsewhere, but
// this marathon page stays narrative-coherent in German for now.
// To enable EN copy later, change the fallback chain below or set
// `PRIMARY_LOCALE` to `locale.value`.
const PRIMARY_LOCALE = "de";
const copy = computed(() => {
  const c = copyData.value || {};
  return c[PRIMARY_LOCALE] || c[locale.value] || c.de || c.en || {};
});

const progress = computed(() => ({
  target: progressData.value?.target ?? 100,
  completed: progressData.value?.completed ?? 0,
}));

const progressPct = computed(() => {
  if (!progress.value.target) return 0;
  return Math.min(100, Math.round((progress.value.completed / progress.value.target) * 100));
});

const statusLine = computed(() => {
  if (!progressData.value) return "";
  const key = `status_${locale.value}`;
  return progressData.value[key] || progressData.value.status_de || progressData.value.status_en || "";
});

const audits = computed(() => auditsData.value?.audits || []);

// Derive YouTube thumbnail from URL (youtu.be/ID or watch?v=ID)
function youtubeThumbnail(url) {
  if (!url) return "";
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/)([A-Za-z0-9_-]{6,})/);
  const id = m?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

// External links
const calendlyUrl = `https://calendly.com/${config.site.calendly.username}`;
const telegramBetUrl = computed(() =>
  ["ru", "uk"].includes(locale.value) ? "https://t.me/razbakov_ru" : "https://t.me/razbakov"
);
const xBetUrl = "https://x.com/razbakov";

// Language options for form
const languageOptions = computed(() => {
  const labels = copy.value?.form?.languageOptionLabel || {};
  return [
    { value: "de", label: labels.de || "Deutsch" },
    { value: "en", label: labels.en || "English" },
    { value: "es", label: labels.es || "Español" },
    { value: "ru", label: labels.ru || "Русский" },
    { value: "uk", label: labels.uk || "Українська" },
    { value: "other", label: labels.other || "Other" },
  ];
});

// Form state + Zod validation
const form = reactive({
  business: "",
  url: "",
  description: "",
  email: "",
  language: "",
});
const errors = reactive({
  business: "",
  url: "",
  description: "",
  email: "",
  language: "",
});
const submitting = ref(false);
const submitted = ref(false);
const honeypot = ref("");

const schema = computed(() => {
  const e = copy.value?.form?.errors || {};
  return z.object({
    business: z.string().trim().min(2, e.business || "Required"),
    url: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || /^https?:\/\/.+\..+/.test(v),
        e.urlFormat || "Invalid URL"
      ),
    description: z.string().trim().min(10, e.descMin || "Too short"),
    email: z.string().trim().email(e.email || "Invalid email"),
    language: z.string().min(1, e.language || "Required"),
  });
});

function validate() {
  for (const k of Object.keys(errors)) errors[k] = "";
  const result = schema.value.safeParse({ ...form });
  if (result.success) return true;
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return false;
}

async function onSubmit() {
  // Silent no-op for bot submissions (honeypot filled).
  if (honeypot.value) {
    submitted.value = true;
    return;
  }
  if (!validate()) return;
  submitting.value = true;
  try {
    // No custom form backend on this repo (Vercel-hosted static site, no
    // existing contact endpoint). Primary submission: mailto — opens the
    // user's mail client with a pre-filled message to alex@razbakov.com.
    // When a serverless handler (or Formspree/Netlify-style form backend)
    // is added, swap this block for a fetch() to it and keep mailto as a
    // fallback in the catch.
    const subject = `Web100 — ${form.business}`;
    const lines = [
      `Business: ${form.business}`,
      form.url ? `URL: ${form.url}` : "",
      `Preferred language: ${form.language}`,
      "",
      form.description,
      "",
      `— ${form.email}`,
    ].filter(Boolean);
    const href = `mailto:${config.site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    // Optimistically show success — we can't observe whether the mail
    // client opened. A server-side backend is the right v2.
    window.location.href = href;
    submitted.value = true;
  } finally {
    submitting.value = false;
  }
}

// SEO
useHead(() => ({
  title: copy.value?.seo?.title || "Web100 Marathon",
  htmlAttrs: { lang: locale.value },
}));
useSeoMeta({
  description: () => copy.value?.seo?.description || "",
  ogTitle: () => copy.value?.seo?.title || "Web100 Marathon",
  ogDescription: () => copy.value?.seo?.description || "",
  ogImage: "/images/alex-top.png",
  ogType: "website",
  twitterCard: "summary_large_image",
});
useSchemaOrg([
  defineWebPage({ name: "Web100 Marathon — Alösha" }),
]);
</script>
