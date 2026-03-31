---
title: "Stop Estimating in Hours: Story Points for AI Development"
description: "AI agents give human-era time estimates. Here's how to use story points to calibrate your actual velocity when building with AI."
date: 2026-03-25
category: Unlisted
image: /images/blog/stop-estimating-hours.png
tags:
  - AI Agents
  - Productivity
  - Building in Public
  - Software Development
  - Estimation
related:
  - /blog/2026-03-25-from-idea-to-mvp-in-minutes
  - /blog/2026-03-25-my-ai-team-runs-my-day
cta:
  title: "Join the conversation"
  description: "We discuss AI-augmented development workflows in the AI Study Group."
  label: "Join the Community"
  url: "https://razbakov.com/#pricing"
---

My AI agent said it would take 2-3 weeks to build a trading bot prototype.

It took 5 minutes.

## The estimation problem

When you ask an AI to estimate how long something will take, it draws on training data from a world where humans wrote all the code. In that world, a trading bot prototype really does take weeks.

But we're not in that world anymore. With AI agents writing code, generating architecture, and iterating on feedback in real-time, the timeline is compressed by 100x or more.

The AI doesn't know this about itself. It estimates like a human because it learned from humans.

## Why hours don't work

The traditional approach — estimate in hours, track against actual — breaks completely with AI development:

- A task estimated at 40 hours might take 20 minutes
- A task estimated at 2 hours might take 3 hours (because the AI gets stuck on something weird)
- The variance is enormous and unpredictable

Hours assume a relatively stable velocity. AI development doesn't have stable velocity. It has bursts of extreme productivity interrupted by debugging sessions.

## Story points as a bridge

Story points measure complexity, not time. A 1-point story is simple. A 5-point story is complex. An 8-point story probably needs to be broken down.

AI agents are actually good at estimating complexity. They can look at a task, compare it to similar tasks, and assign a reasonable relative size. What they can't do is convert that to hours — because their hour-calibration is from the pre-AI era.

Here's the workflow:

1. **Estimate in story points.** Ask the AI to size the work by complexity.
2. **Track your actual velocity.** After a week, count how many story points you completed.
3. **Calibrate.** Now you know: "I complete X story points per day with AI assistance."
4. **Convert.** For future planning, use your calibrated velocity to estimate timelines.

## The calibration period

The first week is chaos. You have no baseline. Things that feel small turn out complex. Things that seem hard get solved in seconds.

By week two, patterns emerge. You start to know which kinds of tasks AI handles instantly and which ones require human intervention. Your velocity stabilizes.

By week three, you can actually make commitments. "This project is 30 story points. At my current velocity, that's 3 days."

## What I've learned

After months of building with AI agents, here are my calibrated observations:

- **Scaffolding is instant.** Project setup, boilerplate, configuration — 0 points. The AI does it while you think about the next thing.
- **Integration is medium.** Connecting APIs, setting up auth, data flow — 3-5 points. AI writes the code but you debug the edge cases.
- **Novel logic is variable.** Anything the AI hasn't seen before — could be 1 point, could be 13. This is where you need judgment.
- **Design decisions are human.** Architecture, product choices, trade-offs — these aren't point-estimated. They're discussions.

## T-shirt sizing for quick estimates

When I need a rough estimate without the formal story-point process:

- **XS** — AI does it in one shot. No review needed. (Config changes, simple CRUD)
- **S** — AI does it with one round of feedback. (Feature additions, API integrations)
- **M** — Multiple iterations. I'm actively involved. (Complex features, refactors)
- **L** — Mostly human work with AI assistance. (Architecture changes, novel algorithms)
- **XL** — Break it down. This isn't one task.

## The communication challenge

The hardest part isn't the estimation itself — it's communicating with stakeholders who still think in hours.

At work, I've started showing both: "This is an M-sized task. In my experience, M tasks take about half a day with AI assistance." The t-shirt gives the team a complexity signal. The time estimate gives managers something for their Gantt charts.

## Stop lying to yourself

The worst thing you can do is accept the AI's human-era estimates. If your agent says "this will take 2 weeks" and you nod along, you're planning based on fiction.

Challenge the estimate. Size it in story points. Calibrate against reality. Then plan from data, not from the AI's inherited assumptions about human productivity.

---

*From my [Twitch stream](https://www.twitch.tv/videos/2731361778). Watch the [estimation discussion](https://www.youtube.com/watch?v=Uei-MlF37uk).*
