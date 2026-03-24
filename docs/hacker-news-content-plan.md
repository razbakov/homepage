# Hacker News Content Plan — razbakov.com

**Created:** 2026-03-24
**Context:** On March 20, 2026, "I Asked AI 'Why Do I Exist?'" hit HN and drove 39 DAU (vs 1–3 baseline). First validated distribution channel. This plan is built to repeat and compound that result.

---

## What Made the AI Chief of Staff Post Work

**Title:** "I Asked AI 'Why Do I Exist?' — Here's What Happened"

### Why it resonated on HN

1. **Personal + technical intersection** — Not a tutorial, not a think piece. A real story where the narrator is the subject and the technology is the tool.
2. **Honest vulnerability** — "I had five side projects and zero clarity." HN readers are engineers with the same problem. Instant identification.
3. **Concrete outcome, not vague inspiration** — By the end the reader has a system: daily check-ins, weekly reviews, shared AI context. Actionable.
4. **AI as collaborator, not magic** — The post doesn't hype AI. It shows it asking good questions. That's credible.
5. **A real deadline** — The Meneate festival, one euro, seven days. Stakes make stories work.
6. **Open-source hook** — Link to GitHub repo / skill gives HN readers something to fork.

### Structural template extracted

```
1. Opening line: the unusual thing I did (one sentence, no setup)
2. The problem: why I needed to do it (context, raw honesty)
3. The session/build: what actually happened (specifics, quotes, code)
4. The surprise: what I didn't expect (the learning)
5. The system: what I now do differently (concrete and reusable)
6. Link: GitHub / tool / repo (so HN can act, not just read)
```

### Title formulas that work

| Pattern | Example |
|---------|---------|
| `I [did unusual thing] — here's what happened` | I Asked AI "Why Do I Exist?" — Here's What Happened |
| `Why I [contrarian choice]` | Why I Put My Life in a Git Repo |
| `Show HN: [thing] — [brief description]` | Show HN: life-os — git + markdown life tracking with AI coaching |
| `Your [familiar thing] [reframed as technical thing]` | Your Brain Has a Night Shift: Dreaming as Extra GPU Compute |
| `I [specific action] to [validate something]` | I Charged Dancers $1 to Validate My Startup |

---

## Blog Post Audit: HN Readiness

### Tier 1 — Ready to Submit

| Post | HN Title | Effort to Submit | Notes |
|------|----------|-----------------|-------|
| `2026-03-23-dream-compute-booster.md` | Your Brain Has a Night Shift: Dreaming as Extra GPU Compute | Low — already written | GPU metaphor is HN-friendly; cites real research; practical protocol at end |
| `2025-01-07-personal-life-management-system.md` | Why I Put My Life in a Git Repo | Medium — update with 14-month data | Show HN format; open-source repo; very HN-friendly framing |

### Tier 2 — Needs Expansion

| Post | HN Angle | What's Missing |
|------|----------|---------------|
| `2025-01-08-multi-agent.md` | What I Learned Building a Team of AI Agents | Needs code examples, config snippets, real output comparisons |
| `2025-01-09-architect-ai-framework.md` | How I Structure AI Projects Like Software Teams | Needs concrete architecture diagram, real-world case |
| `2026-03-23-thought-waterfall.md` | Thought Waterfall: When Ideas Arrive Faster Than You Can Catch Them | Already solid — could add practical AI trigger protocol |

### Tier 3 — Needs Writing

| Topic | HN Title | Source Material |
|-------|----------|----------------|
| AI agent ticketing | I Replaced My Ticketing System with AI Agents | Alex's Claude Code workflow with tmux agents |
| Festival validation | I Charged Dancers $1 to Validate My Startup | Meneate festival results (needs post-festival data) |
| Dance platform | How I Built a Community Platform for 1,000 Dancers Without a Marketing Budget | WeDance project |
| Sociocracy for devs | Sociocracy 3.0: The Framework I Use to Govern AI Agents | Referenced in multi-agent post |

---

## 4-Week Content Calendar

**Start date:** March 25, 2026 (day after plan created)
**Cadence:** One HN submission per week, Tuesday–Thursday, 8–10 AM EST

### Week 1 — March 25–26

**Post:** Your Brain Has a Night Shift: Dreaming as Extra GPU Compute
**File:** `content/blog/2026-03-23-dream-compute-booster.md`
**Effort:** Low — submit as-is
**HN submission title:** `Your Brain Has a Night Shift: Dreaming as Extra GPU Compute`
**Why now:** Already written and polished. GPU metaphor is immediately engaging for developers. Cites real peer-reviewed research (Science Advances, Northwestern, MIT). Practical protocol section gives HN readers something to try.
**First comment to post:** "I wrote this after waking up at 4 AM with an idea fully formed. The Edison/steel ball technique is real — tried it, it works. Happy to share the practical protocol I'm testing."

### Week 2 — April 1–2

**Post:** Why I Put My Life in a Git Repo (updated)
**File:** `content/blog/2025-01-07-personal-life-management-system.md`
**Effort:** Medium — update with 14+ months of real usage data
**HN submission title:** `Show HN: life-os – I've been tracking my life in git for 14 months`
**Prep work:**
- Add a "14 months later" section to the post with real data: what changed in scores, what OKRs were hit, what failed
- Update the GitHub repo README with current templates and example output
- Add one concrete example of AI coaching catching a contradiction

**Why this works:** "Show HN" submissions with working repos + real usage data perform consistently well. The "put your life in git" framing is instantly understandable to any developer and sounds absurd enough to click.

### Week 3 — April 8–9

**Post:** I Replaced My Ticketing System with AI Agents *(new post)*
**File:** `content/blog/2026-04-08-ai-agent-ticketing.md`
**Effort:** High — needs writing
**HN submission title:** `I Replaced My Ticketing System with AI Agents`

**Post structure:**
1. The problem: Jira/Linear overhead for solo developer / small team
2. The experiment: Claude Code agents as async workers via tmux
3. The workflow: dispatch → execute → review → merge
4. Real output: show actual agent-generated PRs, commit messages, before/after
5. What broke: where it fails and why (HN rewards honesty)
6. The config: share actual CLAUDE.md / agent prompt structure

**Key content to include:**
- Code: tmux agent dispatch command
- Code: CLAUDE.md structure for task agents
- Screenshot or output: example agent PR
- Honest failure mode: what tasks agents can't do well

### Week 4 — April 15–16

**Post:** I Charged Dancers $1 to Validate My Startup *(new post, needs festival data)*
**File:** `content/blog/2026-04-15-meneate-validation.md`
**Effort:** Medium — collect data at Meneate, then write
**HN submission title:** `I Charged Dancers $1 to Validate My Startup at a Dance Festival`

**Data to collect at Meneate festival:**
- Total attendees
- Number who paid (conversion rate)
- Total revenue
- Qualitative feedback: what they said
- Partner (Social Dance TV, 500k followers): did the partnership convert?
- What the AI Chief of Staff conversation predicted vs what actually happened

**Post structure:**
1. The bet: one euro, 50 dancers, one festival
2. The setup: what was built in 7 days
3. The day: what happened at the festival
4. The numbers: raw data
5. The verdict: proceed / pivot / kill
6. What I'd do differently

---

## HN Submission Checklist

Use this before every submission.

### The post

- [ ] Title uses one of the proven formulas (no marketing language, no "ultimate guide")
- [ ] Opening sentence is the unusual thing — no preamble
- [ ] Contains at least one honest failure or surprise
- [ ] Has a concrete, reusable takeaway (system, protocol, template, repo)
- [ ] Links to GitHub, open-source code, or working demo where possible
- [ ] Length: 800–1,500 words (HN front page sweet spot)
- [ ] No subheadings that sound like a blog SEO template

### The submission

- [ ] Posted Tuesday–Thursday, 8–10 AM EST (or 2–4 PM EST as backup)
- [ ] Title matches the post's first sentence energy
- [ ] No "self-promotion" framing — submit as a link, not an ad
- [ ] "Show HN:" prefix only when there's a working thing to show

### The first hour

- [ ] Write a first comment within 5 minutes of posting with additional context or the "why I did this" detail that didn't fit the post
- [ ] Reply to every comment in the first 2 hours — HN rewards engagement
- [ ] Don't argue with critics — acknowledge and add nuance
- [ ] Don't ask people to upvote (against HN rules, kills algorithmic boost)

### If it doesn't hit the front page

- [ ] Wait 30 days before resubmitting (HN penalizes quick resubmits)
- [ ] Try a different title framing
- [ ] Cross-post to relevant subreddits (r/programming, r/productivity, r/selfhosted) as a separate experiment

---

## Topics Backlog

Post ideas beyond the 4-week calendar, ranked by estimated HN resonance.

| Priority | Topic | Hook |
|----------|-------|------|
| High | Sociocracy 3.0 for AI agent governance | "I started managing AI agents like a democratic organization" |
| High | WeDance: building for 1,000 dancers with no budget | Real numbers, real community, open source |
| High | Two AIs, one life OS | The OpenClaw + Claude architecture from AI Chief of Staff post — expanded |
| Medium | OKRs for your personal life (not just work) | Concrete templates, 14 months of data |
| Medium | Why I gave up Notion and went back to markdown | Anti-SaaS sentiment always gets HN attention |
| Medium | The AI feedback loop that made me a better developer | Six Thinking Hats + AI review cycle |
| Low | Free writing as a debugging tool for creative problems | Niche but differentiated |
| Low | How I taught salsa and what it taught me about onboarding | Cross-domain insight — harder to place on HN |

---

## Analytics Baseline

**Pre-HN traffic (Mar 1–19, 2026):** 1–3 DAU
**Post-HN spike (Mar 20, 2026):** 39 DAU
**Goal:** Sustain 15+ DAU through consistent monthly HN submissions

### Success metrics per post

| Metric | Target |
|--------|--------|
| HN points on submission day | 50+ (front page threshold ~40) |
| DAU spike | 20+ |
| GitHub repo stars (if Show HN) | 10+ new stars |
| Email/newsletter signups from post | 2+ |
| Time on site from HN referral | >3 min |

---

## Agent Prompt Template

Use this to generate draft HN posts from raw content:

```
You are writing a blog post for Hacker News. The author is Alex Razbakov — a software engineer
who builds dance community platforms, AI tools, and open-source projects. His voice is direct,
reflective, and process-oriented. He talks to AI like a co-founder.

Topic: [TOPIC]
Source material: [PASTE RELEVANT NOTES OR EXISTING DRAFT]

Write using this structure:
1. One-sentence hook: the unusual thing (no setup, no "In this post I will...")
2. The problem: why this needed doing (raw, honest, specific)
3. What I built or discovered (concrete, with code/data where available)
4. The surprise: what I didn't expect (this is the learning)
5. The system: what I now do differently (reusable for the reader)
6. One link to GitHub or open-source resource

Rules:
- First person, past tense for the story, present tense for the lesson
- No marketing language: no "game-changing", "leverage", "impactful"
- No filler transitions: no "In conclusion", "It goes without saying"
- Max 1,500 words
- HN title: use one of these formulas:
  - "I [did unusual thing] — here's what happened"
  - "Why I [contrarian choice]"
  - "Show HN: [thing] — [brief description]"
  - "Your [familiar concept] is actually [reframed as technical]"
```
