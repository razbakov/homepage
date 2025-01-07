<template>
  <div>
    <!-- Hero Section -->
    <section class="py-20 bg-gradient-to-b from-primary/10 to-background">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl">
          <h1 class="text-4xl font-bold mb-6">
            Transforming Ideas into Delightful Digital Products
          </h1>
          <p class="text-xl text-muted-foreground mb-8">
            I help businesses boost their revenue through exceptional user
            experiences and modern web development.
          </p>
          <NuxtLink
            to="/#contact"
            class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
          >
            Let's Work Together
          </NuxtLink>
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
              As a Facilitator, Web Developer, and UX Designer, I bring a unique
              blend of skills to help businesses succeed in the digital space.
            </p>
            <p class="text-lg text-muted-foreground">
              With years of experience in creating user-centered solutions, I
              focus on delivering products that are both beautiful and
              functional.
            </p>
          </div>
          <div class="space-y-4">
            <div class="p-4 rounded-lg border">
              <h3 class="font-medium mb-2">Web Development</h3>
              <p class="text-sm text-muted-foreground">
                Modern, responsive websites built with the latest technologies
              </p>
            </div>
            <div class="p-4 rounded-lg border">
              <h3 class="font-medium mb-2">UX Design</h3>
              <p class="text-sm text-muted-foreground">
                User-centered design solutions that drive engagement
              </p>
            </div>
            <div class="p-4 rounded-lg border">
              <h3 class="font-medium mb-2">Facilitation</h3>
              <p class="text-sm text-muted-foreground">
                Guiding teams through effective decision-making and
                problem-solving
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-16 bg-muted/50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8">Services</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="p-6 rounded-lg bg-background border">
            <h3 class="text-xl font-medium mb-4">Web Development</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li>Custom Website Development</li>
              <li>E-commerce Solutions</li>
              <li>Web Applications</li>
              <li>Performance Optimization</li>
            </ul>
          </div>
          <div class="p-6 rounded-lg bg-background border">
            <h3 class="text-xl font-medium mb-4">UX Design</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li>User Research</li>
              <li>Interface Design</li>
              <li>Usability Testing</li>
              <li>Design Systems</li>
            </ul>
          </div>
          <div class="p-6 rounded-lg bg-background border">
            <h3 class="text-xl font-medium mb-4">Facilitation</h3>
            <ul class="space-y-2 text-muted-foreground">
              <li>Workshop Facilitation</li>
              <li>Design Sprints</li>
              <li>Team Alignment</li>
              <li>Strategy Sessions</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">Let's Work Together</h2>
          <p class="text-lg text-muted-foreground mb-8">
            Ready to transform your ideas into reality? Get in touch to discuss
            your project.
          </p>
          <a
            href="mailto:contact@example.com"
            class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
