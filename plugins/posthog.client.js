import { defineNuxtPlugin } from "#app";

const CONSENT_KEY = "cookie_consent";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const router = useRouter();

  const initPostHog = async () => {
    const { default: posthog } = await import("posthog-js");

    const consent = localStorage.getItem(CONSENT_KEY);

    const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
      api_host: runtimeConfig.public.posthogHost,
      person_profiles: "identified_only",
      capture_pageview: false,
      persistence: consent === "granted" ? "localStorage+cookie" : "memory",
      loaded: (posthog) => {
        if (import.meta.env.MODE === "development") posthog.debug();
        if (consent !== "granted") {
          posthog.opt_out_capturing();
        }
      },
    });

    router.afterEach((to) => {
      nextTick(() => {
        posthog.capture("$pageview", {
          current_url: to.fullPath,
        });
      });
    });

    nuxtApp.provide("posthog", () => posthogClient);
  };

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(() => initPostHog());
  } else {
    setTimeout(() => initPostHog(), 3000);
  }
});
