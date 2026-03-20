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

When writing blog posts, updating copy, or making design decisions — read the relevant files above for tone, brand voice, and strategic context.

## Stack

- Nuxt 3, Tailwind CSS, Nuxt Content (markdown blog)
- Config: `content/config.json` (site metadata, nav, hero, services, contact CTAs)
- Blog posts: `content/blog/YYYY-MM-DD-slug.md`
- Coral theme: warm palette (coral-500 primary), gradient backgrounds

## Rules

- Blog body text max ~70 characters wide (max-w-lg)
- "Schedule a Call" opens Calendly in new tab (no embed)
- CV page is printable — buttons use `print:hidden`
- Homepage is blog post list; About page has hero + services + contact
