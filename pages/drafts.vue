<template>
  <div class="py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-1">Drafts</h1>
        <p class="text-muted-foreground mb-8">Unpublished posts (<code class="text-xs">hidden: true</code>). Publishing sets today's date and makes the post visible.</p>

        <!-- Password gate -->
        <form v-if="!authed" class="flex flex-col sm:flex-row gap-2 max-w-md" @submit.prevent="saveSecret">
          <input
            v-model="secretInput"
            type="password"
            placeholder="Drafts password"
            autocomplete="off"
            class="flex-1 min-w-0 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
          />
          <button type="submit" class="px-5 py-2.5 rounded-full bg-coral-500 text-white font-medium text-sm hover:bg-coral-600 transition-colors shrink-0">
            Unlock
          </button>
        </form>

        <template v-else>
          <p v-if="drafts.length === 0" class="text-muted-foreground py-12 text-center">No drafts. 🎉</p>

          <ul class="divide-y divide-border/60">
            <li v-for="d in drafts" :key="d.slug" class="py-4 flex items-start gap-4">
              <div class="flex-1 min-w-0">
                <a :href="d.path" target="_blank" rel="noopener noreferrer" class="font-medium hover:text-primary transition-colors">{{ d.title }}</a>
                <div class="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  <span class="uppercase">{{ d.language || 'en' }}</span>
                  <span>{{ d.date }}</span>
                  <span v-if="d.category">{{ d.category }}</span>
                </div>
                <p v-if="d.message" class="text-xs mt-1.5" :class="d.error ? 'text-red-600' : 'text-emerald-600'">{{ d.message }}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button
                  :disabled="d.busy || d.done"
                  class="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  @click="publish(d)"
                >
                  {{ d.busy === 'publish' ? '…' : 'Publish' }}
                </button>
                <button
                  :disabled="d.busy || d.done"
                  class="px-3 py-1.5 rounded-full border border-red-300 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                  @click="remove(d)"
                >
                  {{ d.busy === 'delete' ? '…' : 'Delete' }}
                </button>
              </div>
            </li>
          </ul>

          <button class="mt-8 text-xs text-muted-foreground hover:text-foreground underline" @click="lock">Lock</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: "Drafts" });
useSeoMeta({ robots: "noindex, nofollow" });

const { data: rawDrafts } = await useAsyncData("all-drafts", () =>
  queryContent("blog").where({ hidden: true }).sort({ date: -1 }).find()
);

// Local reactive copy with per-row UI state.
const drafts = ref(
  (rawDrafts.value || []).map((p) => ({
    slug: p._path.replace("/blog/", ""),
    path: p._path,
    title: p.title,
    date: typeof p.date === "string" ? p.date.slice(0, 10) : p.date,
    language: p.language,
    category: p.category,
    busy: null,
    done: false,
    message: "",
    error: false,
  }))
);

const secret = ref("");
const secretInput = ref("");
const authed = computed(() => !!secret.value);

onMounted(() => {
  secret.value = localStorage.getItem("draftsSecret") || "";
});

function saveSecret() {
  secret.value = secretInput.value.trim();
  localStorage.setItem("draftsSecret", secret.value);
}
function lock() {
  secret.value = "";
  localStorage.removeItem("draftsSecret");
}

async function call(endpoint, d, action) {
  d.busy = action;
  d.message = "";
  d.error = false;
  try {
    const res = await $fetch(`/api/drafts/${endpoint}`, {
      method: "POST",
      headers: { "x-drafts-secret": secret.value },
      body: { slug: d.slug },
    });
    return res;
  } catch (err) {
    d.error = true;
    if (err?.statusCode === 401) {
      d.message = "Wrong password — click Lock and re-enter.";
    } else {
      d.message = err?.data?.statusMessage || "Something went wrong.";
    }
    return null;
  } finally {
    d.busy = null;
  }
}

async function publish(d) {
  const res = await call("publish", d, "publish");
  if (res?.ok) {
    d.done = true;
    d.message = `Published (${res.date}). Live in ~1–2 min after rebuild.`;
  }
}

async function remove(d) {
  if (!confirm(`Delete draft "${d.title}"? This removes the file from the repo.`)) return;
  const res = await call("delete", d, "delete");
  if (res?.ok) {
    d.done = true;
    d.message = "Deleted. Gone after rebuild (~1–2 min).";
  }
}
</script>
