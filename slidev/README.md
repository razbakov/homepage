# Slidev Presentations

This is a standalone Slidev setup that works with presentations stored in `../content/slides/`.

## Development

To start working on a presentation:

```bash
pnpm serve <topic>
```

For example:

```bash
pnpm serve multi-agent
```

This will open the presentation in your browser with hot-reload enabled.

## Building

To build all presentations:

```bash
pnpm build
```

This will:

1. Build each presentation from `../content/slides/*/slides.md`
2. Output the built files to `dist/<topic>/`

## Directory Structure

- `../content/slides/<topic>/` - Presentation source files
  - `slides.md` - Main presentation file
  - `assets/` - Images and other assets
- `dist/<topic>/` - Built presentations
