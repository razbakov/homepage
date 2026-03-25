---
title: "I Built a Live Map of My Entire Life System"
description: "Managing 18 side projects while working full-time means things fall through the cracks — not from lack of tools, but lack of visibility. So I built a D3.js radial mindmap to see everything at once."
date: 2026-03-25
image: /images/blog/mindmap-command-center.png
heroImage: true
category: Technology
tags:
  - Productivity
  - Building in Public
  - Open Source
related:
  - /blog/2026-03-24-ai-agent-team
  - /blog/2025-01-07-personal-life-management-system
---

I have 18 side projects. A full-time job. OKRs for Q2. A team of AI agents. A CRM of people I'm building with.

The tools aren't the problem. Notion tracks tasks. GitHub tracks code. A spreadsheet tracks projects. But none of them answer the question I actually need answered: *how does this connect to that?*

That question was the forcing function. I built a mindmap.

## The Problem With Task Tools

Task tools tell you *what to do*. They don't show you *why it matters* — or how one project feeds another, how a value shapes a decision, how a key relationship opens a door to a specific goal.

I'd open Notion, see 40 cards, and have no sense of the shape of my work. Is WeDance connected to my mission? Theoretically yes, but where in the list? Which projects are satellites and which are central? I couldn't see it.

The map was missing.

## What I Built

A D3.js radial tree. Mission at the center. Everything else branches out: OKRs, projects, values, key people, major decisions.

49 nodes total. The full picture.

Tech is deliberately minimal — D3.js v7, TypeScript, Vite, about 20KB of source. No framework. I wanted something I could open in a browser and have work immediately, not something that requires three npm installs and a config file.

[Try the live demo →](https://razbakov.com/mindmap/)

Source on GitHub: [razbakov/mindmap](https://github.com/razbakov/mindmap)

## Building It Was the Point

Here's what I didn't expect: the act of building the map taught me more than the map itself.

To structure the tree, I had to answer hard questions. Is "WeDance" an OKR or a project? (Project — but it's the vehicle for OKR1.) Which values actually drive my decisions right now? (Connection, autonomy, practical application — three that come up every time.) Which people belong at the top level of the system? (Key relationships, not just contacts.)

D3 trees don't allow circular dependencies. If A connects to B, you have to decide which one is the parent. That constraint is useful. It makes you commit.

I kept realizing things were in the wrong place — not because the code was wrong, but because my mental model was fuzzy. The map clarified it.

## How It Fits Into My System

The mindmap isn't a task manager. It doesn't track due dates or statuses. What it does is answer the question "does this fit?" before I start work.

When I'm deciding whether to take on something new — a project, a partnership, a feature — I look at the map. Does it connect to a node that's already there? Or is it floating, disconnected from everything else? Disconnected usually means: not now.

It also works as a grounding tool. When I'm context-switching between five things and losing the thread, opening the map resets me. There's the center. There's where I am in it. Fifteen seconds and I'm reoriented.

## What's in the 49 Nodes

- **Mission** — center node
- **OKRs** — current quarter's objectives
- **Projects** — all 18, grouped by domain (dance, AI, ops, side)
- **Values** — the ones that actually show up in decisions, not aspirational ones
- **Key people** — not a full CRM, just the relationships that shape the work
- **Decisions** — major ADRs that affect the whole system

The people layer was the hardest. Adding someone to the map isn't just tagging a contact — it's saying "this relationship is structural to how my work runs." That forced some honest thinking about who actually matters operationally versus who I just know.

## What If This Was a Living System

The current version is static — I update the data file manually when something changes. But the obvious next step is making it live: pull from Notion for task status, from GitHub for project health, from my OKR tracker for progress.

What if the map glowed differently depending on which projects were active? What if you could filter by value — show me everything connected to "connection" as a driver? What if clicking a project node opened the Notion workspace for it?

That's a weekend project. Maybe two.

## Try It

The mindmap is open source. If you manage multiple projects, the structure might be useful — not necessarily the code, but the act of forcing yourself to map it.

[razbakov.com/mindmap](https://razbakov.com/mindmap/) — live demo
[github.com/razbakov/mindmap](https://github.com/razbakov/mindmap) — source

The 20 minutes it takes to lay out your system as a tree is worth it. Not because the map is the answer. Because drawing it forces the question.
