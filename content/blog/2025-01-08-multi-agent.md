---
title: What I Learned Building a Team of AI Agents
description: I started treating AI agents like team members — with roles, onboarding, and feedback. Here's what actually worked.
date: 2025-01-08
image: /img/ai-guide.webp
cta:
  label: See it in Action
  url: /blog/2025-01-10-ai-first
related:
  - /blog/2025-01-10-ai-first
  - /blog/2025-01-09-architect-ai-framework
category: Technology
tags:
  - AI & Machine Learning
  - Development
  - System Architecture
  - Team Management
---

At some point I stopped thinking of AI as a tool and started thinking of it as a team. Not in a "the robots are my friends" way — more like, if I'm going to have multiple AI agents working on different parts of a project, I need to manage them the way I'd manage people. Roles, expectations, communication, feedback loops. The whole thing.

Here's what I figured out along the way.

## Every agent needs a job description

The first thing that actually worked was getting specific about what each agent does. Not "you're a helpful assistant" — that's like hiring someone and saying "just be useful." It doesn't work with people, and it doesn't work with AI either.

Each agent I build gets a configuration file (I use `.cursorrules` in JSON format — tried markdown first, JSON works better) that defines:

- **What they do** — a specific role, not a vague one
- **What they know** — their memory, their knowledge base
- **How they're organized** — document structure, templates, navigation
- **What they can do** — defined skills and methods
- **How they talk** — communication patterns and shortcuts

Think of it as onboarding. When you hire someone, you don't just throw them into the deep end. You give them context, set expectations, and teach them the team's language. Same thing here.

## Agent management is basically HR

This was the realization that changed everything for me. Managing AI agents is managing a team. The same principles apply:

1. **Culture** — what are the values and working principles?
2. **Roles** — who does what? No overlaps, no gaps.
3. **Goals** — are we all working toward the same thing?
4. **Onboarding** — how does a new agent learn the ropes?
5. **Environment** — where's the documentation, what are the templates?
6. **Reviews** — is this agent actually performing well?

When I started thinking about it this way, everything clicked. I wasn't just writing prompts anymore. I was building an organization.

## Start with the why, then build

I went through this in two phases, and the order matters.

**Phase 1 was all planning and documentation.** Before writing a single line of code, I defined the mission. What are we building? Why? I used OKRs to set goals. I wrote out documentation. I created a knowledge base with an index so agents could find things.

For task management, I broke everything into epics and user stories with clear success metrics. If an agent doesn't know what "done" looks like, it will just keep going.

**Phase 2 was building.** Once the foundation was there, I applied the same methodologies I use in software: design thinking, behavior-driven development, test-driven development, edge case analysis. The agents were better at all of this because they had context. They knew the mission, they knew the constraints, they knew what success looked like.

## How to actually talk to your agents

This is where most people get it wrong. They tell the agent *what to build* instead of telling it *what problem to solve*. When you describe the problem and explain the why, the agent proposes solutions you wouldn't have thought of. When you dictate the solution, you get exactly what you asked for — which is usually not what you needed.

So I learned to focus on problems, not solutions. Explain the context. Let the agent think.

### The Six Thinking Hats trick

Here's something that actually surprised me. I use [Six Thinking Hats](/blog/2018-05-16-thinking-hats) — it's a framework by Edward de Bono for structured thinking. Six perspectives, six colored hats. I gave a talk about it years ago, way before I was using AI for anything.

Turns out it works perfectly for giving feedback to AI agents:

- **White Hat** — just the facts. "The data shows X. The test fails on Y."
- **Red Hat** — gut feelings. "Something feels off about this approach."
- **Black Hat** — poking holes. "What happens when the user does Z?"
- **Yellow Hat** — what's good. "I like how you handled the edge case."
- **Green Hat** — alternatives. "What if we tried a completely different approach?"
- **Blue Hat** — process. "Let's step back and think about how we're thinking about this."

I don't always name the hats explicitly. Sometimes I just say "well done" (yellow hat). Sometimes I write something sarcastic and critical (black hat). Sometimes I say "try another approach" (green hat). The AI picks up on the tone and adjusts. It's weird how well it works.

The key insight: you don't need to be polite or formal with AI. You need to be *clear*. And switching between these perspectives — facts, feelings, criticism, praise, alternatives, process — gives you a vocabulary for being clear.

## Version control is your safety net

This one is practical. I use git constantly when working with agents. Every small win gets a commit. Every successful step gets saved. That way, when I want to try something wild in the next prompt — and I often do — I can always roll back.

Think of commits as decision checkpoints. You're not just saving code. You're saving a moment where things worked, so you can explore without fear.

It's similar to how I track decisions in my [personal life management system](/blog/2025-01-07-personal-life-management-system) — version control for life choices. Except here it's literal version control, and the stakes are lower. Try something crazy. If it breaks, `git checkout`.

## What I'd tell someone starting out

Every interaction with an AI agent can produce different results depending on context, phrasing, and configuration. That's both the opportunity and the risk. You can get creative solutions you'd never think of on your own, but you also need to stay engaged. This isn't automation. It's collaboration.

Here's the short version of what worked for me:

1. Give each agent a clear, specific role
2. Write documentation before you start building
3. Describe problems, not solutions
4. Use structured feedback (the Six Thinking Hats help)
5. Commit early, commit often
6. Review and adjust constantly

If you want to see what this looks like in practice, I built an [AI Secretary](/blog/2025-01-10-ai-first) that uses these principles to create a full AI-first workflow. It's the closest thing I have to a working prototype of "what if your whole team was AI."

The honest truth: managing AI agents taught me more about management than managing AI. The same things that make a human team work — clarity, purpose, feedback, trust — make an AI team work too. The medium changed. The principles didn't.
