---
title: "I Built an Executive Team of 6 AI Agents to Manage My 15 Side Projects"
description: "How I use Claude Code to run an autonomous AI agent team that handles code review, content, strategy, coaching, and community across 15 projects while working full-time."
date: 2026-03-24
image: /images/blog/ai-agent-team.png
heroImage: true
tweet: https://x.com/razbakov/status/1904281908619587855
telegram: https://t.me/razbakov/83
category: Technology
tags:
  - Artificial Intelligence
  - Productivity
  - Building in Public
related:
  - /blog/2026-03-21-dancing-with-ai
  - /blog/2025-01-10-ai-first
cta:
  label: "Watch the full presentation"
  url: "https://www.youtube.com/watch?v=6Jwb8pSOZ4M"
---

I have 15 active side projects and a full-time engineering job.

The math doesn't work — unless you delegate.

So I built an executive team of 6 AI agents. Each one has their own domain, personality, and skill set. I call it my **Executive Cabinet**.

## The Team

| Agent | Role | Domain |
|-------|------|--------|
| **Maya** | Chief of Staff | Daily reviews, inbox triage, task routing |
| **Viktor** | CTO | Code review, PRs, architecture decisions |
| **Luna** | Content & Growth | Blog posts, social media, SEO |
| **Marco** | Strategy & Business | Ideas to plans, hypothesis validation |
| **Sage** | Personal Coach | Life balance, reflection, goal tracking |
| **Kai** | Community & Partnerships | CRM, networking, follow-ups |

## My Role as Commander

I focus on four things only:

- **Strategic decisions** — what to build, what to kill
- **Being the face** — presentations, networking, relationships
- **Building relationships** — partnerships, collaborations
- **Validating ideas** — testing hypotheses with real users

Everything else is delegated. Coding, inbox processing, blog posts, goal tracking, competitor research — all agents.

## How It Works in Practice

I send a message (usually via Telegram). Maya triages it by domain and routes to the right agent.

A typical day:

- **Morning**: Maya + Sage run daily review and set priorities
- **Midday**: Viktor reviews PRs, Luna drafts content
- **Evening**: Maya generates a report, Marco checks weekly goals

Each agent runs in its own tmux session with an isolated git worktree. They deliver pull requests, not just local commits. Everything is reviewable.

## The Tech Stack

Nothing proprietary. No custom platform.

- **Claude Code** (Opus) — the brain
- **Markdown files** — skill definitions, prompts, context
- **Git worktrees** — isolation per agent task
- **Tmux** — parallel agent sessions
- **Notion** — Kanban board for tracking
- **Telegram** — input interface

## Governance: Sociocracy 3.0

The team follows S3 patterns:

- **Clear domains** — each agent owns a specific area
- **Consent-based decisions** — no one overrides another's domain
- **Driver-based work** — every task starts with "why" (tension, driver, requirement, response)
- **Accountability** — agents must deliver PRs, not just status updates

## What I Learned

1. **Agents need structure, not freedom.** Vague prompts produce vague results. Each agent has a detailed skill file with step-by-step processes.

2. **Fire-and-forget beats micromanagement.** I dispatch tasks and check results later via a `/scrum` command that reads all agent logs.

3. **The inbox pattern is everything.** One command (`/inbox: <task>`) creates a worktree, writes a prompt, launches in tmux, and logs everything for retry.

4. **Personality matters.** Giving agents names and domains isn't just fun — it creates clear routing and accountability.

## Try It Yourself

The whole system runs on Claude Code with markdown skill files. No special infrastructure needed. Check out [Ikigai Team](https://ikigai.razbakov.com) to see the full system and get started.

I also recorded a 7-minute video walking through the setup from my Apple Vision Pro workspace. Watch it above or [on YouTube](https://www.youtube.com/watch?v=6Jwb8pSOZ4M).

---

What's your approach to managing multiple projects with AI? I'd love to hear how others are doing this. [Find me on X](https://x.com/razbakov) or drop a comment on [the YouTube video](https://www.youtube.com/watch?v=6Jwb8pSOZ4M).

---

*This agent team is one of the projects built at [Learn By Doing Academy](https://learn-by-doing-academy.com). Students learn to build their own AI agent systems as part of the program.*
