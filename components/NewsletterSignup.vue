<template>
  <section
    class="rounded-xl border border-border/60 bg-muted/40 p-5 sm:p-6"
    aria-labelledby="newsletter-heading"
  >
    <h2 id="newsletter-heading" class="text-lg font-semibold mb-1">
      {{ $t('home.newsletter.title') }}
    </h2>
    <p class="text-sm text-muted-foreground mb-4">
      {{ $t('home.newsletter.valueProp') }}
    </p>

    <form
      class="flex flex-col sm:flex-row gap-2"
      novalidate
      @submit.prevent="onSubmit"
    >
      <label for="newsletter-email" class="sr-only">{{ $t('home.newsletter.emailLabel') }}</label>
      <input
        id="newsletter-email"
        v-model="email"
        type="email"
        name="email"
        autocomplete="email"
        required
        :placeholder="$t('home.newsletter.placeholder')"
        :disabled="state === 'loading'"
        :aria-invalid="state === 'error'"
        aria-describedby="newsletter-status"
        class="flex-1 min-w-0 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent disabled:opacity-60"
      />
      <button
        type="submit"
        :disabled="state === 'loading'"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-coral-500 text-white font-medium text-sm shadow-sm hover:bg-coral-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
      >
        <Icon v-if="state === 'loading'" name="lucide:loader-circle" class="w-4 h-4 animate-spin" />
        <span>{{ $t('home.newsletter.button') }}</span>
      </button>
    </form>

    <p
      v-if="message"
      id="newsletter-status"
      role="status"
      aria-live="polite"
      class="mt-3 text-sm"
      :class="state === 'error' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'"
    >
      {{ message }}
    </p>
  </section>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();

type State = "idle" | "loading" | "success" | "error";

const email = ref("");
const state = ref<State>("idle");
const message = ref("");

async function onSubmit() {
  if (state.value === "loading") return;

  state.value = "loading";
  message.value = "";

  try {
    const res = await $fetch<{ ok: boolean; status: string }>("/api/subscribe", {
      method: "POST",
      body: { email: email.value, locale: locale.value },
    });

    state.value = "success";
    message.value =
      res.status === "already_subscribed"
        ? t("home.newsletter.alreadySubscribed")
        : t("home.newsletter.checkInbox");
    email.value = "";
  } catch (err: unknown) {
    state.value = "error";
    const statusMessage = (err as { data?: { statusMessage?: string } })?.data?.statusMessage;
    message.value = statusMessage || t("home.newsletter.error");
  }
}
</script>
