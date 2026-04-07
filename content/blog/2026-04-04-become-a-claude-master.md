---
title: "I Built a Training Program Inside Claude Code"
description: "How a single slash command onboards you to Claude Code, installs the right skills, and guides you through a structured learning curriculum — from beginner to power user."
date: 2026-04-04
image: /images/blog/become-claude-master.png
category: Technology
tags:
  - AI Agents
  - Claude Code
  - Productivity
  - Building in Public
  - Developer Tools
related:
  - /blog/2026-03-25-my-ai-team-runs-my-day
  - /blog/2026-03-24-ai-executive-team
  - /blog/2026-03-20-ikigai-ai-chief-of-staff
telegram: https://t.me/razbakov/85
tweet: https://x.com/razbakov/status/2040772376988643580
cta:
  title: "Try it yourself"
  description: "Open Claude Code on Desktop, paste this command, and start your learning journey in 5 minutes."
  stepTitle: "1. Open Claude Code on Desktop"
  stepDescription: "2. Paste this command"
  copyLabel: "Copy command"
  copiedLabel: "Copied"
  prompt: "/become-claude-master"
  label: "Install the skill"
  url: "https://github.com/razbakov/skills/tree/main/skills/become-claude-master"
---

Most people use Claude Code the same way they use ChatGPT — type a question, get an answer, repeat. They never discover that Claude Code has a memory system, hooks, skills, MCP integrations, and multi-agent workflows that can turn it into a full operating system for their work.

I know this because I was that person six months ago. I stumbled into each feature by accident, wasted hours on things that had one-line solutions, and wished someone had just shown me the path.

So I built one.

## One command to get started

```
/become-claude-master
```

That's it. This single slash command kicks off a three-phase onboarding that adapts to where you are.

## Phase 1: Your foundation (5 minutes)

The skill checks if you have a `~/.claude/CLAUDE.md` — the file that Claude reads in every single conversation. If you don't have one, it creates it with five starter rules:

- **`rule: <text>`** — Say this and Claude adds the rule to your config instantly
- **`learned?`** — Claude extracts lessons from what just happened and saves them
- **`new skill`** — Claude turns your current workflow into a reusable skill
- **Path management** — Keeps configurations project-scoped, not global
- **Browser automation** — Connects to your authenticated browser session when needed

These five rules compound. After a week you'll have a CLAUDE.md that genuinely understands how you work.

## Phase 2: The right tools for your work (10 minutes)

The skill interviews you. Not a generic questionnaire — it asks what you actually do: your stack, your tools, whether you write content or manage projects or review PRs.

Based on your answers, it recommends skills from a curated collection and installs them for you. A frontend developer gets `test-driven-development` and `pr-review-responder`. A content creator gets `social-post` and `viral-threads`. A project manager gets `workflow` and `estimation`.

You don't need to browse a catalog. The skill matches tools to your work.

## Phase 3: Structured learning (ongoing)

This is the part I'm most excited about. Claude Code has a 16-topic curriculum built in:

**Foundations** — prompting patterns, the CLAUDE.md system, slash commands, context management.

**Coding workflows** — when to use Edit vs Write vs Bash, test-driven development, debugging strategies.

**Advanced features** — creating skills, hooks and automation, MCP server integrations, multi-agent workflows.

**Mastery** — the memory system, custom pipelines, performance optimization, security.

Each session takes about 15 minutes. Claude fetches the latest docs, presents the key concept, gives you a mini-challenge, records your score, and offers to schedule the next session.

## It starts with an assessment

When I ran it on myself, the skill didn't start at topic 1. It ran a quick assessment first — four questions about how I use prompting, hooks, memory, and agents.

Result: I'm running 118 skills and a 6-agent team but had never configured a single hook. The skill identified that gap and started there instead of wasting time on basics I already knew.

Fifteen minutes later I had a notification hook running globally — now every time any of my agents needs input, I get a macOS popup with a sound. One line of config that I'd been missing for months.

## Why this matters

Claude Code is the most powerful developer tool I've used. But its power is buried. There's no onboarding wizard, no progressive disclosure, no "you might also like" suggestions.

The gap between a beginner and a power user isn't talent — it's knowing what's possible. This skill closes that gap systematically.

## What's next

I'm adding more topics as Claude Code evolves — IDE integrations, the Agent SDK, API patterns. The curriculum grows with the tool.

If you try it, I'd love to hear what gaps the assessment finds for you. The skill is open source and PRs are welcome.

```bash
claude install-skill https://github.com/razbakov/skills/tree/main/skills/become-claude-master
```

Then just type `/become-claude-master` and follow along.

---

*This skill is open-source. If you want structured mentorship building systems like this — with live sessions, code reviews, and a cohort of builders — check out [Learn By Doing Academy](https://learn-by-doing-academy.com).*
