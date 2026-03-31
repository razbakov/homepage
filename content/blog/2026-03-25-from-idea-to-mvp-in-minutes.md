---
title: "From Idea to MVP in Minutes: The Startup Coach Skill"
description: "A single Claude Code skill that takes a business idea, runs design thinking phases, and produces a working prototype — live demo included."
date: 2026-03-25
category: Unlisted
tags:
  - AI Agents
  - Building in Public
  - Claude Code
  - Design Thinking
  - Startup
related:
  - /blog/2026-03-25-why-openclaw-has-no-soul
  - /blog/2026-03-25-stop-estimating-in-hours
cta:
  title: "Try the startup-coach skill"
  description: "It's open source. Install it in Claude Code and bootstrap your next idea."
  label: "View on GitHub"
  url: "https://github.com/razbakov/ikigai"
---

What if you could go from a raw business idea to a working prototype in the time it takes to eat lunch?

On a live stream, someone said: "I want to build a trading agent." Five minutes later, we had a product strategy, user personas, a hypothesis, and the agent was building the prototype.

Here's how.

## The startup-coach skill

It's a single Claude Code skill — a markdown file that defines a structured thinking process. When you invoke it, it walks through design thinking phases:

1. **Discovery** — What problem are you solving? Who is it for? What does success look like?
2. **Hypothesis framing** — "If we build X, then Y will happen for Z people"
3. **Validation planning** — How do we test this before building everything?
4. **Prototyping** — Build the minimum thing that proves the hypothesis

The skill asks you questions. You answer (voice or text). It synthesizes your answers into a structured project.

## Live demo: MoneyMaker

On stream, we tried it with a trading agent idea.

**The questions it asked:**
- What problem are you solving that isn't solved today?
- If this works perfectly, what does the world look like?
- What's the biggest obstacle?
- Who is this for?

**What it produced:**
- A project README with mission, vision, and hypothesis
- A product strategy document
- User personas (the side hustler, the cautious newcomer)
- An engineering architecture plan
- Three prototype sketches with different approaches

All in one session. No context switching. No blank-page paralysis.

## Why this works better than just asking AI to build something

The difference is structure. If you tell Claude "build me a trading bot," you get code. Maybe good code, maybe not. But you skip the thinking.

The startup-coach forces you to answer the hard questions first. Why this idea? For whom? What's the hypothesis? This means the prototype that gets built is grounded in actual thinking, not just vibes.

## The estimation problem

One thing the skill gets wrong: time estimates. It'll say "this prototype will take 2-3 weeks to build."

It takes 5 minutes.

The AI is mimicking human estimates from its training data. Before AI-assisted development, a trading bot prototype really would take weeks. But with agents writing the code, the timeline is compressed by orders of magnitude.

My workaround: use story points instead of hours. After a week of working with AI agents, you calibrate your velocity and can convert story points to actual time.

## How to use it

1. Install the skill in your Claude Code setup
2. Create an empty directory for your project
3. Run `/startup-coach`
4. Answer the questions
5. Watch it build

The skill creates the full project structure: README, product strategy, engineering architecture, decision records. Everything is in markdown, version-controlled, and readable by both humans and AI.

## What happens after the prototype

The startup-coach is the bootstrap. After that, you have a real project with structure. You can:

- Hand it off to specific agents (Viktor for engineering, Luna for marketing)
- Start validating with real users
- Iterate based on feedback

The point isn't to ship the prototype. It's to have something concrete to react to instead of discussing abstract ideas.

## The compound effect

Once you have this workflow, ideas stop being scary. You don't need to commit weeks to explore a concept. Five minutes of structured thinking + five minutes of prototyping = enough to decide proceed, pivot, or kill.

I've used this to bootstrap 15+ projects. Most got killed after the prototype phase. A few survived. That's the point — fail fast, fail cheap, and keep the winners.

---

*Live demo from my [Twitch stream](https://www.twitch.tv/videos/2731361778). Watch the [prototype clip](https://www.youtube.com/watch?v=Uei-MlF37uk).*
