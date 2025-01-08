<template>
  <div>
    <!-- Hero -->
    <section class="py-20 md:py-32">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            Empowering Digital Innovation
          </h1>
          <p class="text-xl text-muted-foreground mb-8">
            I help businesses and organizations create impactful digital
            experiences that connect with their audience and drive results.
          </p>
          <div class="flex gap-4 justify-center">
            <NuxtLink
              to="/projects"
              class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              View Projects
            </NuxtLink>
            <NuxtLink
              to="/cv"
              class="inline-flex h-10 items-center justify-center rounded-md border border-input px-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Learn More
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section class="py-16 bg-muted/50">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold mb-12 text-center">Featured Work</h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <article
              v-for="project in projects?.slice(0, 3)"
              :key="project._path"
              class="group"
            >
              <NuxtLink :to="project._path" class="block">
                <img
                  v-if="project.icon"
                  :src="project.icon"
                  :alt="project.title"
                  class="h-7 w-auto mb-4"
                  style="max-width: 120px"
                />
                <div class="space-y-2">
                  <h3
                    class="text-xl font-bold group-hover:text-primary line-clamp-2"
                  >
                    {{ project.title }}
                  </h3>
                  <p class="text-sm text-muted-foreground line-clamp-2">
                    {{ project.description }}
                  </p>
                </div>
              </NuxtLink>
            </article>
          </div>
          <div class="text-center mt-12">
            <NuxtLink
              to="/projects"
              class="inline-flex h-10 items-center justify-center rounded-md border border-input px-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              View All Projects
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold mb-12 text-center">How I Can Help</h2>
          <div class="grid sm:grid-cols-2 gap-8">
            <div class="space-y-4">
              <h3 class="text-xl font-bold">Digital Product Development</h3>
              <p class="text-muted-foreground">
                From concept to launch, I help create web applications that
                solve real problems and deliver value to users.
              </p>
            </div>
            <div class="space-y-4">
              <h3 class="text-xl font-bold">AI Integration</h3>
              <p class="text-muted-foreground">
                Enhancing applications with AI capabilities: smart search,
                content generation, chatbots, and workflow automation.
              </p>
            </div>
            <div class="space-y-4">
              <h3 class="text-xl font-bold">Performance & SEO</h3>
              <p class="text-muted-foreground">
                Optimizing websites for speed, search engines, and conversion
                rates to maximize online visibility and user satisfaction.
              </p>
            </div>
            <div class="space-y-4">
              <h3 class="text-xl font-bold">Technical Leadership</h3>
              <p class="text-muted-foreground">
                Guiding teams through digital transformation with modern web
                technologies and AI-driven development practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="py-16 bg-muted/50">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">Let's Work Together</h2>
          <p class="text-xl text-muted-foreground mb-8">
            Have a project in mind? I'd love to help bring your ideas to life.
          </p>
          <div class="flex gap-4 justify-center">
            <button
              @click="openCalendly"
              class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Schedule a Call
            </button>
            <a
              href="mailto:alex@razbakov.com"
              class="inline-flex h-10 items-center justify-center rounded-md border border-input px-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { data: projects } = await useAsyncData("featured-projects", () =>
  queryContent("projects").sort({ date: -1 }).find()
);

const openCalendly = () => {
  Calendly.initPopupWidget({
    url: "https://calendly.com/razbakov",
    prefill: {},
    pageSettings: {
      backgroundColor: "ffffff",
      hideEventTypeDetails: false,
      hideLandingPageDetails: false,
      primaryColor: "00a2ff",
      height: "900",
    },
    enableClosing: true,
  });
};
</script>
