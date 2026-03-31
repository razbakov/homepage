---
title: "My AI Team Runs My Day: A Full Workflow Demo"
description: "From 9am check-in to dinner planning — how 6 AI agents manage my calendar, meals, travel, and meetings while I focus on what matters."
date: 2026-03-25
category: Unlisted
tags:
  - AI Agents
  - Productivity
  - Building in Public
  - Claude Code
  - GTD
image: /images/blog/ai-team-runs-my-day.png
related:
  - /blog/2026-03-25-why-openclaw-has-no-soul
  - /blog/2026-03-25-ai-agents-need-goals
cta:
  title: "Want this workflow?"
  description: "Join the AI Study Group to get early access to the agent team setup."
  label: "Join the Community"
  url: "https://razbakov.com/#pricing"
---

I have 15 active side projects and a full-time engineering job. The math doesn't work unless you delegate.

So I built a team of 6 AI agents. Here's what a typical day looks like.

## 9:00 AM — Maya's morning briefing

At exactly 9am, Maya (my Chief of Staff) sends me a Telegram message:

> Good morning. Here's your schedule for today.

She lists everything: meetings with agents, blocked time for deep work, lunch and dinner plans, travel logistics. The whole day is already planned.

I didn't plan any of it. She did.

## How it got planned

The night before, Maya checked my calendar, looked at pending tasks in Notion, and built the schedule. She booked my train to Vienna. She planned my meals based on what's in the kitchen. She scheduled 15-minute check-ins with each agent.

All I had to do was show up.

## Agent meetings

Each agent gets a slot. The meetings happen via voice call through my Butler app. They're short and focused.

**Kai** (Community & Partnerships) asks about my plan for the festival. Do I have contact templates ready? What's my strategy for meeting people?

**Marco** (Strategy & Business) pushes on the SDTV partnership and wants a 48-hour post-festival follow-up plan.

**Viktor** (CTO) runs through open PRs and technical blockers.

These aren't generic status updates. Each agent has context about their domain and asks questions specific to their responsibility.

## The Notion control center

Everything flows through a single Notion kanban board:

- **Suggested** — agents propose tasks
- **To do** — I approve them
- **In progress** — agents are working
- **To review** — I verify the output
- **To share** — worth posting publicly
- **Done** — archived

I move cards from "Suggested" to "To do." That's my job. Everything else is delegated.

## Mid-day adjustments

Plans change. That's fine.

I message Maya: "I'm not in the mood for dinner tonight. I'd rather have shisha with Cvetan."

She updates the calendar, adjusts the evening plan, and confirms the change. No friction.

But here's the key part — if I send the same message to Sage (my coach), I get a different response. She doesn't just comply. She asks why I'm changing plans. Is it stress? Am I avoiding something?

That's the value of multiple agents. Maya executes. Sage questions.

## The foundations

This workflow is built on three frameworks:

1. **GTD** (Getting Things Done) — everything goes into inbox, gets clarified, becomes actionable
2. **Sociocracy 3.0** — clear domains, consent-based decisions, driver-based prioritization
3. **Design Thinking** — discovery before building, hypothesis-driven work

These aren't buzzwords. They're encoded into the agent skills. When Marco evaluates a new idea, he follows the design thinking phases. When Maya triages inbox items, she applies GTD classification.

## The tools

- **Claude Code** with custom skills (markdown-based behavior definitions)
- **Telegram** — one bot per agent
- **Notion** — kanban board as control center
- **Google Calendar** — agents read and write events
- **Butler** — custom voice assistant for agent calls
- **Faster Whisper** — free local transcription for recordings

No SaaS platform. No monthly fee beyond API usage. Everything runs on standard dev tools.

## What changed

Before agents, I context-switched constantly. I'd start coding, remember I needed to email someone, forget about lunch, and end the day feeling busy but unproductive.

Now I have one job: make decisions. The agents handle everything else — planning, scheduling, drafting, researching, even posting on social media.

The only thing I can't delegate is showing up.

---

*Based on my [Twitch live stream](https://www.twitch.tv/videos/2731361778) from March 25, 2026. Watch the [calendar demo clip](https://www.youtube.com/watch?v=XRMcPcE2fWM).*
