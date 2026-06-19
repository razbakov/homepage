# Autopilot — Daily AI-Avatar Video Pipeline

Plan + readiness audit for the daily AI-narrated video per blog post on the
**Alösha — Daily** channel (@razbakovdaily). Julia McCoy method: Claude writes
the script → ElevenLabs clones the voice → HeyGen renders the avatar.

Tracking issue: razbakov/homepage#37. Owner: Forge.
Last updated: 2026-06-19.

> **No subscription has been purchased.** This doc reports exact monthly cost
> for approval *before* any signup. The free script-generator step ships now.

---

## 1. Readiness audit (what exists vs what must be recorded)

Searched `~/Local/ikigai/` and the repo for clean audio (ElevenLabs voice clone
needs ≥3 min, ideally 30 min–2 h) and clean source video (HeyGen avatar needs a
2–5 min talking-head clip).

### Audio — READY (more than enough)

| File | Length | Notes |
|---|---|---|
| `ai-study-group/meetings/2026-03-23/livestream.m4a` | **124 min** | Alex narrating his AI-study-group livestream |
| `ai-study-group/meetings/2026-03-22/livestream.wav` | **57 min** | second livestream, lossless WAV |
| `ai-study-group/meetings/2026-03-25/nacho-call.mp4` | 37 min | call (multi-speaker — not ideal as clone source) |
| `ai-study-group/meetings/2026-03-14/meeting-01-edited.mp4` | 48 min | edited meeting |

The two solo livestreams (~3 h combined) are far past ElevenLabs' minimum for a
**Professional Voice Clone**. The WAV is lossless. Caveat: livestreams may have
short stretches of other speakers / screen-share commentary — for a PVC we'd
extract one clean ~30 min stretch of Alex-only speech (trivial with ffmpeg).
**No new audio recording is required.**

### Video — MUST RECORD (no usable talking-head source)

Every large video asset is a **screen-share / livestream recording** (1080p, but
the frame is a shared screen, not Alex's face). There is **no clean 2–5 min
talking-head clip** of Alex anywhere in `~/Local/ikigai/`. The beeble-tests clip
is a relighting test, not a usable avatar source.

→ **To build a HeyGen custom avatar, Alex must record one 2–5 min clip**: face
to camera, even lighting, neutral background, natural delivery (read anything —
HeyGen only needs the face + mouth motion). ~15 min of his time, one take.

**Verdict:** Voice = ready today. Avatar = one short recording gates Options A/B;
Option C (voice-only) needs nothing recorded and can ship the moment ElevenLabs
is subscribed.

---

## 2. Pricing + API verification (2026, current)

Verified via web search June 2026. **Nothing purchased.**

### ElevenLabs (voice clone)

| Plan | Price/mo | Unlocks | Fit |
|---|---|---|---|
| Starter | $5 | **Instant** Voice Cloning | low-fidelity clone |
| **Creator** | **$22** | **Professional Voice Cloning (PVC)** + 100k credits (~100 min TTS) | **the floor for a real clone** |
| Pro | $99 | 500k credits + 44.1 kHz PCM via API | needed only if rendering *every* day |

A 3:30 script is ~3,400 characters ≈ 3,400 credits. **30/mo ≈ 103k credits** —
that's right at the Creator cap, so a true daily cadence eventually needs Pro.
For launch (not yet daily, plus re-gens), **Creator $22/mo is the right starting
tier**; PVC is the must-have feature and Creator is the cheapest plan with it.

### HeyGen (avatar render via API)

The HeyGen **API is a standalone subscription, separate from the web plan** —
the web plan does NOT include API access and vice-versa.

| What | Cost |
|---|---|
| Web plan (create/host the custom avatar in the UI) | **Creator $29/mo** (or Pro $99) |
| API render (Avatar V) | **~$0.05/sec = $3/min**; ~$1/min for 720p/1080p on newer pricing |
| **Custom Digital-Twin avatar creation _via API_** | **Enterprise-only** ⚠️ |

**Key constraint that shapes the design:** you cannot *create* a custom twin
through the API on Creator/Pro — only Enterprise. **The standard workaround:**
create the avatar **once in the web UI** (a Creator/Pro task), then drive it for
daily renders via the standard API using its `avatar_id`. That keeps us off
Enterprise. A 3:30 render ≈ **$3.50–$10.50/video** depending on resolution/engine
(~$1–$3/min).

### Exact monthly cost by option

| Option | ElevenLabs | HeyGen web | HeyGen API (daily 3:30) | **Total/mo** |
|---|---|---|---|---|
| **A — full twin** | Creator $22 | Creator $29 | ~30 × $3.50–10.50 = **$105–315** | **~$156–366** |
| **B — lower-tier avatar + cloned voice** | Creator $22 | Creator $29 | fewer renders / lower res ≈ $60–105 | **~$111–156** |
| **C — voice-only over B-roll** | Creator $22 | — | — | **$22** |

> Headline figure for approval: **Option C = $22/mo. Option A ≈ $156–366/mo**
> (dominated by per-render API usage at daily cadence).

Sources: ElevenLabs pricing (flexprice.io, bigvu.tv, magichour.ai), HeyGen
pricing + API docs (arcade.software, eesel.ai, developers.heygen.com,
help.heygen.com — "custom Digital Twin via API = Enterprise only").

---

## 3. The three render options

### A — Full custom twin (HeyGen Business/Pro avatar + ElevenLabs PVC)
Most authentic; Alex's face + cloned voice narrating daily.
- **Cost:** ~$156–366/mo. **Gated by:** one 2–5 min face recording + one-time
  avatar setup in the HeyGen UI. **Time-to-first-video:** ~1–2 days after the
  recording (clone trains in hours; avatar in the UI is minutes).

### B — Lower-tier avatar + cloned voice only
Stock/lite avatar (or lower-res custom) + the real cloned voice. Cheaper; test
whether the *voice* alone carries before paying for full-twin renders daily.
- **Cost:** ~$111–156/mo. **Time-to-first-video:** ~1 day.

### C — Voice-only over B-roll / essay-hero visuals (no avatar) ✅ RECOMMENDED
ElevenLabs cloned voice narrates over the essay's hero image + simple B-roll/
text-on-screen (the script already specifies `[B-ROLL]`/`[TEXT ON SCREEN]`).
No HeyGen, no face recording, no Enterprise constraint.
- **Cost:** **$22/mo.** **Gated by:** nothing — audio is ready today.
  **Time-to-first-video:** **same day** ElevenLabs is subscribed.

### Recommendation

**Start with C ($22/mo), add the avatar later.** Rationale: (1) the voice clone
source is ready *now* and the avatar source is not — C removes the only blocker;
(2) it's 1/7th the cost of A, so we validate that daily-narrated essays get watch
time before committing to per-render avatar spend; (3) the script generator,
B-roll directions, and metadata are identical across all three — moving C→A later
is just adding the HeyGen render call, no rework. Record the 2–5 min avatar clip
in parallel (it's cheap insurance) so A is one API call away once C proves demand.

---

## 4. The automation design (mirrors `feed-daily`)

Built on the exact `feed-daily` launchd pattern (`scripts/feed-pipeline.mjs` +
`~/Orgs/ikigai/.bin`).

```
08:00  feed-daily.sh            → content/data/feed/<date>.json  (existing)
08:30  daily-video-script.sh    → content/data/video-scripts/<date>__<slug>.md  (NEW, this PR)
         └─ scripts/daily-video-script.mjs build
              trigger: newest un-scripted English blog post
              fallback: today's feed Editor's Note
              generate ~3:30 script via `claude -p` (same backend ladder as feed)
              never overwrites a dated script
         └─ commit + push to main, DM Alex via Forge
[later]  render step (NOT in this PR): script → ElevenLabs TTS → (HeyGen) → video
```

**Shipped in this PR (the free step):**
- `scripts/daily-video-script.mjs` — the generator. `build` / `latest` commands,
  STDERR logs + one-line JSON STDOUT status, exit codes 0/2/3/4. Anthropic
  backend detected exactly like `feed-pipeline.mjs` (API key → keychain OAuth →
  LiteLLM). Verified end-to-end against the `water-is-memory` post; output
  matches the hand-written Daily #001.
- `~/Orgs/ikigai/.bin/daily-video-script.sh` — runner (git bootstrap, commit/
  push, Forge DM, stale-OAuth handling). Reuses `FEED_ANTHROPIC_API_KEY`.
- `~/Orgs/ikigai/.bin/com.razbakov.daily-video-script.plist` — launchd job,
  08:30 daily. **Ships UNLOADED** — Alex bootstraps it.

**NOT in this PR (needs the paid subscriptions approved first):**
- the ElevenLabs TTS call + HeyGen render call + ffmpeg assembly.

### To activate the free step (Alex)
```bash
cp ~/Orgs/ikigai/.bin/com.razbakov.daily-video-script.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.razbakov.daily-video-script.plist
```
Optional reliability: add `DAILY_VIDEO_ANTHROPIC_API_KEY=sk-ant-...` to
`~/.config/feed/.env` so 08:30 generation never depends on a fresh OAuth token.

---

## 5. Bottom line

- **Audio ready, avatar needs one 2–5 min recording.**
- **Cheapest path to a first video: $22/mo (Option C, voice-only), same-day.**
- **Full twin: ~$156–366/mo, ~1–2 days after a short recording.**
- **Recommendation: ship C now, add the avatar once daily narration proves watch
  time.** Script generator runs free starting today and stockpiles scripts.
