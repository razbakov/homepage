---
title: "Why OpenClaw Has No Soul (And How I Built My Own)"
description: "OpenClaw is a Telegram wrapper. I built 6 AI agents with distinct personalities, voice calls, and autonomous decision-making — a year before it launched."
date: 2026-03-25
category: Unlisted
image: /images/blog/openclaw-no-soul.png
tags:
  - AI Agents
  - Building in Public
  - Claude Code
  - Productivity
related:
  - /blog/2026-03-24-ai-agent-team
  - /blog/2026-03-25-mindmap-command-center
cta:
  title: "Want to try this setup?"
  description: "Join the AI Study Group — we share tools, skills, and workflows for AI-augmented development."
  label: "Join the Community"
  url: "https://razbakov.com/#pricing"
---

When OpenClaw launched, everyone lost their minds. An AI agent with identity! Personality! Soul!

I looked at it and thought: this is just a Telegram bot with a system prompt.

## What OpenClaw actually is

OpenClaw gives you one AI character connected to Telegram. You chat with it. It responds. That's it.

The "soul" they market is a system prompt. The "identity" is whatever you type into a text field. There's no memory architecture, no goal orientation, no multi-perspective thinking.

It's Claude in a Telegram wrapper with good branding.

## What I built instead

In January 2025 — a full year before OpenClaw became a thing — I built what I called an "AI secretary." It started as one agent but quickly became six:

- **Maya** (Chief of Staff) — plans my day, manages my calendar, delegates to other agents
- **Viktor** (CTO) — handles technical decisions, code reviews, architecture
- **Luna** (Content & Growth) — writes posts, manages social media, tracks engagement
- **Marco** (Strategy & Business) — product thinking, business development, partnerships
- **Sage** (Personal Coach) — challenges my decisions, holds me accountable
- **Kai** (Community & Partnerships) — manages contacts, CRM, networking

Each has a distinct personality. When I say "hi" in the team chat, they all react differently. Marco obsesses about my upcoming festival. Luna asks what's for lunch. Viktor says nothing unless there's a technical question.

## The personality gap

Here's what makes it real: send the same message to Maya and Sage.

Tell Maya: "I'm skipping dinner tonight."
She replies: "Got it, I'll update the calendar."

Tell Sage the same thing.
She replies: "Hold on. You've been skipping meals when you're stressed. What's actually going on?"

That's the difference between a bot and a team. Multiple perspectives on the same situation. A chief of staff who executes. A coach who questions.

## Why this matters

Generic AI assistants are yes-machines. They do what you say. That's useful for tasks but terrible for decisions.

When you have six agents with different priorities, you get disagreement. You get challenge. You get the kind of friction that makes better decisions — the same thing a real executive team provides.

## The technical setup

The whole system runs on:
- **Claude Code** with custom skills (markdown files that define behavior)
- **Telegram bots** — one per agent, each with their own personality prompt
- **Notion** as the control center (kanban board for agent tasks)
- **Google Calendar** integration (agents schedule meetings with me)
- **Voice calls** via a custom Butler app

No proprietary platform. No vendor lock-in. Just markdown, APIs, and a clear organizational structure.

## What I learned

1. **Personality requires constraints.** Agents without specific domains drift into generic helpfulness.
2. **Goals beat instructions.** Once I gave agents their own OKRs, they became proactive instead of reactive.
3. **The team metaphor works.** Thinking of agents as team members (not tools) changes how you interact with them.
4. **You need friction.** An AI that always agrees is less useful than one that sometimes pushes back.

## Try it yourself

The startup-coach skill is open source and bootstraps any new project with proper structure. Start there if you want to build your own agent team.

The full setup — six agents, Telegram integration, Notion workflow, calendar sync — is something I'm packaging for beta testers. If you're interested, join the AI Study Group.

---

*This post is based on my [Twitch live stream](https://www.twitch.tv/videos/2731361778) from March 25, 2026.*
