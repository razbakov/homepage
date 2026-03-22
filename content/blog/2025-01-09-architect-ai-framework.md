---
title: Architect AI Framework
description: I was juggling multiple AI agents and losing track of who knows what. So I built a framework where you just talk to it, and it builds the agent for you.
date: 2025-01-09
image: /img/ai-architect.webp
cta:
  label: Get Started with Architect
  url: https://github.com/razbakov/ai-architect
related:
  - /blog/2025-01-10-ai-first
  - /blog/2025-01-08-multi-agent
category: Technology
tags:
  - AI & Machine Learning
  - Development
  - System Architecture
  - Best Practices
---

I had a problem. I was running multiple AI agents across different projects — a code reviewer here, a content writer there, a project planner somewhere else — and it was a mess. Each agent had its own setup, its own memory, its own quirks. I kept losing context, repeating myself, and forgetting what I'd already taught them.

So I built [Architect](https://github.com/razbakov/ai-architect). Not a product. A framework — a way to create and manage AI agents through conversation.

## You just talk to it

The core idea is simple: you describe what you need, and Architect helps you shape an agent for it. No config files to write by hand. No setup wizards. You just say what you're trying to do.

Something like:

- _"I need someone to help me create the perfect playlist for my next Salsa Cubana party."_
- _"I want to build a personal website but don't know where to start."_
- _"I need help finding a new job."_

Architect walks you through defining the role, suggests what knowledge to include, and — this is the part I care about most — teaches the agent to understand your shorthand. Your way of talking. Your context.

So instead of saying _"Check all relevant documentation, create a cross-reference index, and find misalignments"_ every time, you just say _"Status"_ and the agent knows exactly what you mean.

That's the thing that makes it feel like a real collaborator instead of a tool you have to babysit.

## Every agent remembers

One of the first problems I ran into with AI agents was amnesia. You'd spend an hour explaining your project, close the session, and next time — blank slate. Gone.

Architect solves this with a structured memory system. Each agent keeps its own knowledge base, its own docs, its own history. When you come back tomorrow, the agent still knows what you told it yesterday. It knows your project structure, your preferences, your decisions.

This isn't magic. It's just a directory:

```
[rolename]/
├── knowledge/
├── docs/
├── .cursorrules
└── README.md
```

Everything lives in files. Knowledge, configuration, documentation — all version-controlled, all readable, all portable. You can look at an agent's directory and understand exactly what it knows and how it works.

## Agent jargon changed everything

Here's the insight that surprised me most. When I started using short commands — what I call agent jargon — the whole workflow got faster. Not a little faster. Fundamentally different.

These are the ones I use constantly:

- **`think`** — Have the agent analyze and reflect without making changes. Just think out loud.
- **`learn [topic]`** — Teach the agent something new, or have it explore a capability on its own.
- **`review [path]`** — Point the agent at a file or config and ask for feedback.
- **`save`** — Commit progress to git. One word instead of staging, committing, writing a message.
- **`status`** — The big one. Check all docs, cross-reference everything, surface what's out of alignment.

It sounds small, but it changes the relationship. You stop thinking about *how* to ask and start thinking about *what* to ask. The jargon becomes muscle memory. Like keyboard shortcuts, but for conversation.

## What I actually use it for

I'm not going to pretend this is for everyone or every scenario. Here's where I've found it genuinely useful:

- **Code review** — An agent that knows my codebase and my standards, so I can just say "review" and get feedback that actually matters.
- **Content writing** — An agent that knows my voice, my blog, my topics. I can say "think about a post on X" and get something worth editing, not starting from scratch.
- **Project planning** — An agent that tracks my OKRs, my open tasks, my decisions. "Status" gives me a real picture instead of me digging through files.

For a real-world example, the [AI Secretary](/blog/2025-01-10-ai-first) project uses Architect to build an entire AI-first organizational system. That's where I pushed it the hardest.

## Quality is a structure problem

One thing I learned the hard way: agents drift. You set them up, they work great for a week, and then slowly the quality drops. They forget things. They start giving generic answers. The config gets stale.

Architect handles this by treating quality as a structure problem, not a willpower problem. The framework checks for:

- Whether the agent's configuration is complete
- Whether its memory is organized correctly
- Whether the docs are up to date
- Whether the interaction patterns still make sense

It's like a health check for your agents. You don't have to remember to do it — it's built into the system.

## Why I keep building this

I keep coming back to the same question with all my side projects: *is this useful?* Not interesting, not cool — useful. Does it solve a real problem I actually have?

Architect passes that test for me. I use it every day. It makes working with multiple AI agents feel manageable instead of chaotic. And the fact that it's just conversation — no complex setup, no learning curve beyond talking — means I actually stick with it.

If you're managing more than one AI agent and finding it messy, take a look at the [GitHub repo](https://github.com/razbakov/ai-architect). The whole thing is open source. You can start with one agent and see if the structure helps.

And if you want to see the bigger picture of how I think about multi-agent systems, I wrote about that [here](/blog/2025-01-08-multi-agent).

Try it. Say what you need:

- _"I need someone to organize my travel plans for a business trip."_
- _"Help me brainstorm ideas for my next marketing campaign."_
- _"I want assistance in tracking my fitness goals."_
- _"Help me prepare for my upcoming job interview."_

Architect will walk you through the rest.
