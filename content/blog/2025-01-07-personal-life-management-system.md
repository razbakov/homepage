---
title: Why I Put My Life in a Git Repo
description: I had five side projects, no accountability, and no way to know if my life was getting better. So I built a system out of git, markdown, and AI coaching sessions.
date: 2025-01-07
permalink: /personal-life-management-system
category: Productivity
tags:
  - Productivity
  - Personal Development
  - Life Management
image: /img/lifeos.webp
telegram: https://t.me/razbakov/48
cta:
  label: See the repo on GitHub
  url: https://github.com/razbakov/life-os
related:
  - /blog/2025-01-10-ai-first
---

I had a problem I couldn't code my way out of: I didn't know if my life was getting better.

I had side projects everywhere. Goals I'd written down once and never looked at again. Decisions I couldn't remember making. No reviews, no accountability, no record of what I'd tried and what I'd learned. Just a vague feeling that I was busy but not moving.

So I did what any engineer would do. I built a system.

## The actual problem

It wasn't about productivity. I had plenty of tools for that. The problem was deeper: I had no way to measure whether my life was improving across the dimensions that mattered to me — health, relationships, purpose, finances, fun.

I'd set goals in January and forget them by March. I'd make a decision about a project and six months later not remember why. I'd have a great insight during a walk and lose it by the time I sat down.

Everything was scattered. Notes in one app, goals in another, reflections nowhere. No single place where past-me could talk to future-me.

## Git as a life layer

The solution turned out to be embarrassingly simple: a git repository with markdown files and a clear folder structure.

```
life-os/
  assessments/    # Quarterly life snapshots — scored, honest, never edited after
  objectives/     # OKRs for the quarter
  decisions/      # Why I chose X over Y, written down when it happened
  reviews/        # Weekly and monthly reviews
  templates/      # Prompts for each review type
```

That's it. No app. No database. No framework to learn. Just files, folders, and git history.

Why git? Because it gives me things no notes app does:

- **History I can't fake.** Every change is timestamped. I can see exactly when I wrote something and what I changed. No quietly editing last month's goals to make myself look better.
- **Diffs that tell the truth.** When I update my life assessment, git shows me what actually changed. Health went from 4 to 7. Relationships dropped from 8 to 5. The numbers don't lie.
- **Branches for experiments.** I can try a new routine for a month without losing the old one. If it doesn't work, I roll back.

## Level 10 Life: the honest mirror

The core of the system is something called the Level 10 Life assessment. It's simple: rate ten areas of your life from 1 to 10. Be honest. Write down why you gave each score.

The areas I track:

1. Health and fitness
2. Intellectual life
3. Emotional life
4. Character
5. Spirituality
6. Love relationship
7. Parenting (or family)
8. Social life
9. Financial
10. Career and business

Every quarter, I sit down and do this assessment. I save it as an immutable file — `assessments/2025-01-07.md` — and never edit it after. It becomes a snapshot. A checkpoint.

The first time I did this honestly, it was uncomfortable. Some areas were 3s. But that discomfort is the point. You can't fix what you won't look at.

Over time, these snapshots become a trajectory. Am I actually getting healthier? Are my relationships improving? Is my career going where I want? The git history answers these questions with data, not feelings.

## OKRs, but for your life

At work, I use OKRs — objectives and key results. They keep teams focused. I figured: why not apply the same thinking to my own life?

Each quarter, based on the assessment, I pick two or three objectives. Not ten. Not five. Two or three. The ones where the gap between where I am and where I want to be is largest.

Then I define key results — concrete, measurable outcomes that would prove the objective is working. Not "get healthier" but "run three times per week for eight weeks." Not "improve finances" but "validate one side project with paying users."

The objectives live in `objectives/` as markdown files. They reference the assessment that inspired them. Everything connects.

## Reviews: the accountability loop

The system only works if I actually use it. That's where reviews come in.

**Daily check-in.** Five minutes. What did I do today? What am I doing tomorrow? Any obstacles? It sounds simple, but most days I was skipping this entirely before the system existed. Now it's a habit.

**Weekly review.** Thirty minutes on Saturday. What happened this week? Did I make progress on my key results? What do I need to adjust? I look at the previous week's review to see if I followed through on what I said I would do.

**Quarterly assessment.** The big one. Redo the Level 10 Life scores. Compare to last quarter. Set new OKRs. This is where the trajectory becomes visible.

Each review has a template in `templates/` so I don't have to think about structure. I just answer the prompts.

## AI as a thinking partner

Here's where it gets interesting. The repository isn't just for me to read — it's for AI to read too.

When I open a session with Claude, it has access to my entire life context: my current OKRs, my latest assessment, my recent reviews, my open decisions. It knows what I'm working on, what I'm struggling with, and what I said I'd do last week.

This turns AI from a generic assistant into something closer to a coach. It can ask: "You said you'd reach out to three friends this week. Did you?" It can notice patterns: "Your spirituality score has dropped three quarters in a row. Want to talk about that?" It can challenge me: "You have five active projects but your OKR says to focus on one. Which four are you pausing?"

The AI doesn't have opinions about my life. But it has perfect memory of everything I've written about it. That turns out to be more useful than advice.

## What it looks like in practice

A typical week: I wake up Monday, open a terminal, and run my daily check-in. The AI reads my weekly plan and asks what I'm focusing on today. I answer in plain text. It flags anything that seems off — "You have a deadline Thursday but nothing scheduled for it" — and we move on. Two minutes.

Saturday morning, I do the weekly review. The AI pulls up what I said I'd do, what I actually did, and where the gaps are. We talk about it. Sometimes the gap is fine — priorities shifted. Sometimes it means I'm avoiding something. Either way, it's visible.

Every quarter, the bigger assessment. I score each area, compare to last time, and set new objectives. The AI helps me be specific: not "improve health" but "what does a 7 look like for you, concretely?"

All of it lives in the repo. All of it has history. All of it is searchable.

## Why not use an app?

I've tried apps. Notion, Obsidian, journaling apps, habit trackers. They all have the same problem: they own the format. When the app dies or changes or I lose interest, my data is trapped or gone.

Markdown in git is forever. I can read these files in any text editor on any operating system in twenty years. I can grep them, diff them, pipe them into scripts. They're just text.

And there's something about the plainness of it that keeps me honest. No fancy dashboards to distract from the content. No gamification to make me feel good about checking boxes. Just words on a screen, asking me to tell the truth about where I am.

## What I've learned so far

The system has been running for a few months now, and a few things surprised me:

**The reviews matter more than the goals.** Setting OKRs is easy. Reviewing them honestly every week is where the actual growth happens. Most people skip the review. I did too, before the system made it unavoidable.

**AI coaching works because of context, not intelligence.** The AI doesn't give me wisdom I couldn't find myself. But it remembers everything I've said, which means it catches the contradictions and patterns I'd otherwise miss.

**Writing things down changes behavior.** There's something about typing "I didn't exercise this week because I was tired" into a file that gets committed to git that makes you not want to type it again next week.

**Simplicity is the only thing that survives.** Every time I added complexity — more templates, more tracking, more categories — I used the system less. The current version is the simplest one that still works.

## Is this for you?

Maybe. If you're comfortable with git and a terminal, if you have a nagging feeling that you're busy but not progressing, if you've tried apps and they didn't stick — this might be worth a look.

It's not polished. It's not pretty. It's a repo with markdown files and some templates. But it's the first system I've built for myself that I actually kept using, because it does the one thing no app ever did: it tells me the truth about whether my life is getting better.

> Curious? The whole thing is open source: [life-os on GitHub](https://github.com/razbakov/life-os). Fork it, change it, make it yours.
