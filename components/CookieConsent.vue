<template>
  <Transition name="slide-up">
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 z-[100] border-t border-border bg-background/95 backdrop-blur-sm shadow-lg"
    >
      <div class="container mx-auto px-4 py-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p class="text-sm text-muted-foreground flex-1">
            {{ $t('cookies.message') }}
            <NuxtLink
              :to="localePath('/privacy')"
              class="text-primary hover:text-primary/80 underline"
            >
              {{ $t('cookies.learnMore') }}
            </NuxtLink>
          </p>
          <div class="flex gap-2 shrink-0">
            <button
              @click="decline"
              class="px-4 py-2 text-sm font-medium rounded-lg border border-input hover:bg-secondary transition-colors"
            >
              {{ $t('cookies.decline') }}
            </button>
            <button
              @click="accept"
              class="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {{ $t('cookies.accept') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const CONSENT_KEY = 'cookie_consent'

const localePath = useLocalePath()
const showBanner = ref(false)

onMounted(() => {
  const stored = localStorage.getItem(CONSENT_KEY)
  if (stored === null) {
    showBanner.value = true
  }
})

function accept() {
  localStorage.setItem(CONSENT_KEY, 'granted')
  showBanner.value = false

  const { $posthog } = useNuxtApp()
  const posthog = $posthog?.()
  if (posthog) {
    posthog.opt_in_capturing()
  }
}

function decline() {
  localStorage.setItem(CONSENT_KEY, 'denied')
  showBanner.value = false

  const { $posthog } = useNuxtApp()
  const posthog = $posthog?.()
  if (posthog) {
    posthog.opt_out_capturing()
  }
}

function showSettings() {
  localStorage.removeItem(CONSENT_KEY)
  showBanner.value = true
}

defineExpose({ showSettings })
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
