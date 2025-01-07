<template>
  <div>
    <!-- Hero Section -->
    <section class="py-20 bg-gradient-to-b from-primary/10 to-background">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl">
          <h1 class="text-4xl font-bold mb-6">
            Senior Web Developer & Tech Speaker
          </h1>
          <p class="text-xl text-muted-foreground mb-4">
            Empowering teams and audiences with expertise in web development, UX
            design, and digital transformation.
          </p>
          <p class="text-xl text-muted-foreground mb-8">
            Available for speaking engagements, technical leadership roles, and
            select freelance projects.
          </p>
          <div class="space-x-4">
            <NuxtLink
              to="/#contact"
              class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
            >
              Let's Connect
            </NuxtLink>
            <a
              href="/cv.pdf"
              class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8">About Me</h2>
        <div class="grid md:grid-cols-2 gap-12">
          <div>
            <p class="text-lg mb-4">
              As a Senior Web Developer and conference speaker, I combine
              technical expertise with the ability to communicate complex
              concepts to diverse audiences.
            </p>
            <p class="text-lg text-muted-foreground mb-6">
              My mission is to elevate the web development community through
              knowledge sharing, while delivering impactful solutions for
              businesses.
            </p>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="font-medium">Location:</span>
                <span class="text-muted-foreground">Remote / Worldwide</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium">Experience:</span>
                <span class="text-muted-foreground">8+ years</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium">Speaking Topics:</span>
                <span class="text-muted-foreground"
                  >Web Development, UX, Team Leadership</span
                >
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="p-4 rounded-lg border">
              <h3 class="font-medium mb-2">Technical Leadership</h3>
              <p class="text-sm text-muted-foreground">
                Leading development teams and sharing expertise through
                conference talks
              </p>
            </div>
            <div class="p-4 rounded-lg border">
              <h3 class="font-medium mb-2">Public Speaking</h3>
              <p class="text-sm text-muted-foreground">
                Engaging audiences with insights on web development and digital
                transformation
              </p>
            </div>
            <div class="p-4 rounded-lg border">
              <h3 class="font-medium mb-2">Community Building</h3>
              <p class="text-sm text-muted-foreground">
                Fostering knowledge sharing and professional growth in tech
                communities
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Expertise Section -->
    <section id="services" class="py-16 bg-muted/50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8">Expertise</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="p-6 rounded-lg bg-background border">
            <h3 class="text-xl font-medium mb-4">Technical Expertise</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li>Modern Frontend (Vue.js, Nuxt)</li>
              <li>Performance Optimization</li>
              <li>Technical Architecture</li>
              <li>Developer Experience</li>
            </ul>
          </div>
          <div class="p-6 rounded-lg bg-background border">
            <h3 class="text-xl font-medium mb-4">Speaking Topics</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li>Web Development Best Practices</li>
              <li>UX Design & Implementation</li>
              <li>Team Leadership & Culture</li>
              <li>Digital Transformation</li>
            </ul>
          </div>
          <div class="p-6 rounded-lg bg-background border">
            <h3 class="text-xl font-medium mb-4">Community Impact</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li>Conference Speaking</li>
              <li>Workshop Facilitation</li>
              <li>Technical Writing</li>
              <li>Mentorship Programs</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">Let's Connect</h2>
          <p class="text-lg text-muted-foreground mb-8">
            Whether you're looking for a speaker for your next event, a
            technical leader for your team, or help with a project, I'd love to
            discuss how we can work together.
          </p>
          <div class="space-x-4">
            <a
              href="mailto:alex@razbakov.com"
              class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
            >
              Email Me
            </a>
            <a
              href="https://linkedin.com/in/razbakov"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
