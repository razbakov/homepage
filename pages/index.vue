<template>
  <div>
    <!-- Hero Section -->
    <section class="py-20 bg-gradient-to-b from-primary/10 to-background">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl">
          <h1 class="text-4xl font-bold mb-6">
            Senior Web Developer & UX Designer
          </h1>
          <p class="text-xl text-muted-foreground mb-4">
            With expertise in facilitating digital transformation, I help
            companies build exceptional web experiences that drive results.
          </p>
          <p class="text-xl text-muted-foreground mb-8">
            Available for full-time opportunities and select freelance projects.
          </p>
          <div class="space-x-4">
            <NuxtLink
              to="/#contact"
              class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
            >
              Let's Work Together
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
              As a Senior Web Developer and UX Designer with a unique background
              in facilitation, I bring a comprehensive approach to digital
              product development.
            </p>
            <p class="text-lg text-muted-foreground mb-6">
              Whether working as part of an in-house team or leading freelance
              projects, I focus on delivering scalable, user-centered solutions
              that drive business growth.
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
                <span class="font-medium">Availability:</span>
                <span class="text-muted-foreground">Open to opportunities</span>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="p-4 rounded-lg border">
              <h3 class="font-medium mb-2">Technical Leadership</h3>
              <p class="text-sm text-muted-foreground">
                Leading development teams and architecting scalable web
                solutions
              </p>
            </div>
            <div class="p-4 rounded-lg border">
              <h3 class="font-medium mb-2">UX Design</h3>
              <p class="text-sm text-muted-foreground">
                Creating intuitive interfaces and optimizing user experiences
              </p>
            </div>
            <div class="p-4 rounded-lg border">
              <h3 class="font-medium mb-2">Team Facilitation</h3>
              <p class="text-sm text-muted-foreground">
                Bridging technical and business needs through effective
                communication
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-16 bg-muted/50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8">Expertise</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="p-6 rounded-lg bg-background border">
            <h3 class="text-xl font-medium mb-4">Web Development</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li>Full-stack Development</li>
              <li>Modern Frontend (Vue.js, Nuxt)</li>
              <li>Performance Optimization</li>
              <li>Technical Architecture</li>
            </ul>
          </div>
          <div class="p-6 rounded-lg bg-background border">
            <h3 class="text-xl font-medium mb-4">UX Design</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li>User Research & Testing</li>
              <li>Interface Design</li>
              <li>Design Systems</li>
              <li>Conversion Optimization</li>
            </ul>
          </div>
          <div class="p-6 rounded-lg bg-background border">
            <h3 class="text-xl font-medium mb-4">Leadership</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li>Team Management</li>
              <li>Agile Facilitation</li>
              <li>Technical Mentoring</li>
              <li>Project Strategy</li>
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
            Whether you're looking to hire a senior developer or need help with
            a project, I'd love to discuss how I can contribute to your success.
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
