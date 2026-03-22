<script setup>
const { t } = useI18n();
useHead({ title: "Senior Fullstack Developer in Munich" });
useSeoMeta({
  description: () => t('seo.cvDesc'),
  ogTitle: "Senior Fullstack Developer in Munich — Alex Razbakov",
  ogDescription: () => t('seo.cvDesc'),
  twitterCard: "summary",
});
useSchemaOrg([
  defineWebPage({ name: "CV — Alex Razbakov" }),
  defineBreadcrumb({
    itemListElement: [{ name: "CV" }],
  }),
]);

const {
  data: cv,
  pending,
  error,
} = await useAsyncData("cv", () => queryContent("data/cv").findOne());

if (error.value) {
  throw createError({
    statusCode: 500,
    message: "Failed to load CV data",
  });
}

const downloadPDF = async () => {
  if (!process.client) return;

  const html2pdf = (await import("html2pdf.js")).default;
  const element = document.querySelector(".cv-content");
  const opt = {
    margin: [10, 10],
    filename: "cv.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(element).save();
};
</script>

<template>
  <div class="py-16 print:py-4 print:text-sm">
    <div v-if="pending" class="container mx-auto px-4 print:px-0">
      <div class="max-w-3xl mx-auto">
        <p class="text-center text-muted-foreground">Loading CV...</p>
      </div>
    </div>

    <div v-else-if="cv" class="container mx-auto px-4 print:px-0">
      <div class="max-w-3xl mx-auto cv-content">
        <header class="mb-12 print:mb-4">
          <h1 class="text-4xl font-bold mb-2">{{ cv.name }}</h1>
          <h2 class="text-2xl font-medium mb-6 text-primary">
            {{ cv.title }}
          </h2>
          <p class="text-xl text-muted-foreground print:text-base">
            {{ cv.summary }}
          </p>
        </header>

        <!-- Quick Info -->
        <div class="grid sm:grid-cols-2 gap-8 mb-8 print:mb-4 print:gap-4">
          <div class="space-y-4">
            <div class="flex items-start gap-2">
              <span class="font-medium">Location:</span>
              <span class="text-muted-foreground">{{
                cv.quick_info.location
              }}</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-medium">Experience:</span>
              <span class="text-muted-foreground">{{
                cv.quick_info.experience
              }}</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-medium">Languages:</span>
              <span class="text-muted-foreground">{{
                cv.quick_info.languages.join(", ")
              }}</span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-start gap-2">
              <span class="font-medium">Email:</span>
              <a
                :href="'mailto:' + cv.quick_info.contact.email"
                class="text-primary hover:text-primary/80"
                >{{ cv.quick_info.contact.email }}</a
              >
            </div>
            <div class="flex items-start gap-2">
              <span class="font-medium">LinkedIn:</span>
              <a
                :href="
                  'https://linkedin.com/in/' + cv.quick_info.contact.linkedin
                "
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:text-primary/80"
                >@{{ cv.quick_info.contact.linkedin }}</a
              >
            </div>
            <div class="flex items-start gap-2">
              <span class="font-medium">GitHub:</span>
              <a
                :href="'https://github.com/' + cv.quick_info.contact.github"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:text-primary/80"
                >@{{ cv.quick_info.contact.github }}</a
              >
            </div>
          </div>
        </div>

        <!-- Skills Summary -->
        <section class="mb-12">
          <div class="space-y-4">
            <h2 class="text-2xl font-bold mb-6">Skills</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="(skills, title) in cv.skills"
                :key="title"
                class="text-sm p-4 rounded-xl bg-secondary/50"
              >
                <div class="font-medium text-foreground">{{ title }}:</div>
                <div class="text-muted-foreground">{{ skills.join(", ") }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Professional Experience -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6">Professional Experience</h2>
          <div class="space-y-8">
            <div v-for="exp in cv.professional_experience" :key="exp.company" class="border-l-2 border-primary/20 pl-6">
              <h3 class="text-xl font-medium">{{ exp.company }}</h3>
              <p class="text-muted-foreground">
                {{ exp.position }} ({{ exp.period }})
              </p>
              <ul class="mt-2 space-y-2 text-muted-foreground list-disc ml-5">
                <li v-for="resp in exp.responsibilities" :key="resp">
                  {{ resp }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Volunteering & Community -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6">
            Volunteering & Community Leadership
          </h2>
          <div class="space-y-8">
            <div v-for="vol in cv.volunteering" :key="vol.organization" class="border-l-2 border-accent/20 pl-6">
              <h3 class="text-xl font-medium">
                {{ vol.role }}, {{ vol.organization }}
              </h3>
              <p class="text-muted-foreground">{{ vol.field }}</p>
              <ul
                v-if="vol.achievements"
                class="mt-2 space-y-2 text-muted-foreground list-disc ml-5"
              >
                <li v-for="achievement in vol.achievements" :key="achievement">
                  {{ achievement }}
                </li>
              </ul>
              <ul
                v-if="vol.responsibilities"
                class="mt-2 space-y-2 text-muted-foreground list-disc ml-5"
              >
                <li v-for="resp in vol.responsibilities" :key="resp">
                  {{ resp }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Speaking & Community -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6">Speaking & Community</h2>
          <div class="grid sm:grid-cols-2 gap-8">
            <div class="space-y-4">
              <h3 class="text-xl font-medium">Conference Topics</h3>
              <ul class="space-y-2 text-muted-foreground list-disc ml-5">
                <li
                  v-for="talk in cv.speaking_community.conference_talks"
                  :key="talk.title"
                >
                  "{{ talk.title }}" at {{ talk.event }}
                </li>
              </ul>
            </div>
            <div class="space-y-4">
              <h3 class="text-xl font-medium">Community Involvement</h3>
              <ul class="space-y-2 text-muted-foreground list-disc ml-5">
                <li
                  v-for="item in cv.speaking_community.community_involvement"
                  :key="item"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Certifications -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6">Certifications</h2>
          <ul class="space-y-2 text-muted-foreground list-disc ml-5">
            <li v-for="cert in cv.certifications" :key="cert.title">
              {{ cert.title }} - {{ cert.issuer }}, {{ cert.date }}
            </li>
          </ul>
        </section>

        <!-- Education -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6">Education</h2>
          <div class="space-y-8">
            <div v-for="edu in cv.education" :key="edu.institution">
              <h3 class="text-xl font-medium">{{ edu.institution }}</h3>
              <p class="text-muted-foreground">
                {{ edu.degree }} ({{ edu.period }})
              </p>
              <ul class="mt-2 space-y-2 text-muted-foreground list-disc ml-5">
                <li v-for="achievement in edu.achievements" :key="achievement">
                  {{ achievement }}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <!-- Download CV - moved outside cv-content -->
      <div class="text-center print:hidden mt-8">
        <button
          @click="downloadPDF"
          class="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-200"
        >
          Download CV
        </button>
      </div>
    </div>

    <div v-else class="container mx-auto px-4 print:px-0">
      <div class="max-w-3xl mx-auto">
        <p class="text-center text-destructive">Failed to load CV data</p>
      </div>
    </div>
  </div>
</template>
