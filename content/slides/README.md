# Slides Management

This directory contains presentation slides in Markdown format.

## Structure

```
slides/
  ├── topic-name/           # Topic or event name
  │   ├── slides.md         # Main presentation file
  │   └── assets/           # Images and other assets
  │       └── image.png
  └── README.md            # This file
```

## Guidelines

1. Each presentation should be in its own directory
2. Use descriptive directory names with kebab-case
3. Main presentation file should be named `slides.md`
4. Store related assets in `assets/` subdirectory
5. Use Markdown format with [Slidev](https://sli.dev/) syntax

## Example Frontmatter

```yaml
---
theme: default
background: https://source.unsplash.com/collection/94734566/1920x1080
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Presentation Title
  Presentation description
drawings:
  persist: false
transition: slide-left
title: Presentation Title
---
```

## Commands

- Create: `slidev slides.md`
- Build: `slidev build`
- Export: `slidev export`
