# razbakov.com — Personal Website

## Context

This is Alex Razbakov's personal website (Nuxt 3 + Tailwind + Nuxt Content).

Brand, strategy, and project definitions live in the ikigai workspace:

- **Profile & values**: `~/Projects/ikigai/profile.md`
- **Current focus & goals**: `~/Projects/ikigai/now.md`
- **All projects inventory**: `~/Projects/ikigai/PROJECTS.md`
- **OKRs & vision**: `~/Projects/ikigai/README.md`
- **Contacts/CRM**: `~/Projects/ikigai/contacts/`
- **Decisions (ADRs)**: `~/Projects/ikigai/decisions/`
- **Brand identity**: `~/Projects/ikigai/design/brand.md`
- **Coral Bloom style**: `~/Projects/ikigai/design/styles/coral-bloom.md`

When writing blog posts, updating copy, or making design decisions — read the relevant files above for tone, brand voice, and strategic context.

## Stack

- Nuxt 3, Tailwind CSS, Nuxt Content (markdown blog)
- Config: `content/config.json` (site metadata, nav, hero, services, contact CTAs)
- Blog posts: `content/blog/YYYY-MM-DD-slug.md`

## Brand & Style

This website uses the **Coral Bloom** style (warm, approachable, personal).
Coral Bloom is the only brand style — used across the website, social media, and all branded materials.

### Color Palette

| Role | Color | Hex | Tailwind |
|------|-------|-----|----------|
| **Primary accent** | Coral | `#FF6F61` | `coral-500` |
| **Background** | Warm off-white | `#FFFBF9` | — |
| **Base surface** | Light gray | `#F3F3F3` | — |
| **Card surface** | White | `#FFFFFF` | — |
| **Gradient start** | Coral light | `#FFF5F4` | `coral-50` |
| **Gradient mid** | Lavender | `#F0EEFC` | — |
| **Headlines** | Near black | `#171717` | — |
| **Body text** | Dark gray | `#646464` | — |
| **Borders** | Slate | `#E2E8F0` | — |

Coral is the only accent color — never blue, green, or purple as accents.

### Typography

| Role | Font | Weight |
|------|------|--------|
| Headlines, headers, nav | **Roboto Slab** | Bold (700) |
| Body, buttons, metadata | **Open Sans** | Regular (400), Bold (700) |
| Tagline / subtitle | **Open Sans** | SemiBold Italic (600i) |

**Note**: Tailwind currently loads Inter only. Roboto Slab + Open Sans should be loaded per the Coral Bloom spec.

### Voice & Tone

- **Tone**: direct, reflective, authentic — conversational, not corporate
- **Language**: casual but thoughtful — like a builder thinking out loud
- **Words to use**: build, ship, validate, hypothesis, purpose, ikigai, useful
- **Words to avoid**: synergy, leverage, disrupt, hustle, guru, empower, impactful, drive results

### Writing Blog Posts

- Write as Alex — first person, authentic voice
- Process-oriented: share the journey, not just the result
- "What if" framing works well (reflects his thinking pattern)
- Purpose-first: connect topics back to "does this matter?"
- Concrete and buildable — prototype thinking, not abstract philosophy
- OK to reference AI as a collaborator (talks to AI like a co-founder)
- Tagline spirit: "Do what you fear the most"

### Copy Guidelines

When writing or updating any website copy (hero, services, CTAs, descriptions):

- Lead with what Alex actually builds: dance community platforms, AI tools, open-source
- His ikigai: "Building technology platforms that create human connection through culture and movement"
- Avoid generic consultancy language ("impactful digital experiences", "drive results")
- Services should reflect actual work: community platforms, AI integration, fullstack development, open-source
- Keep CTAs direct and human ("Let's talk" > "Schedule a consultation")

## Rules

- Blog body text max ~70 characters wide (max-w-lg)
- "Schedule a Call" opens Calendly in new tab (no embed)
- CV page is printable — buttons use `print:hidden`
- Homepage is blog post list; About page has hero + services + contact
- Coral is the only accent — no other accent colors
