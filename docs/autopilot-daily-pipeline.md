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

**Shipped (script step, PR #38):**
- `scripts/daily-video-script.mjs` — the generator. `build` / `latest` commands,
  STDERR logs + one-line JSON STDOUT status, exit codes 0/2/3/4. Anthropic
  backend detected exactly like `feed-pipeline.mjs` (API key → keychain OAuth →
  LiteLLM). Verified end-to-end against the `water-is-memory` post; output
  matches the hand-written Daily #001.
- `~/Orgs/ikigai/.bin/daily-video-script.sh` — runner (git bootstrap, commit/
  push, Forge DM, stale-OAuth handling). Reuses `FEED_ANTHROPIC_API_KEY`.
- `~/Orgs/ikigai/.bin/com.razbakov.daily-video-script.plist` — launchd job,
  08:30 daily. **Ships UNLOADED** — Alex bootstraps it.

**Shipped (render step, Option C — this follow-up PR):**
- `scripts/daily-video-render.mjs` — the render module. Commands: `render` /
  `assemble` / `narration` / `latest`. STDERR logs + one-line JSON STDOUT,
  exit codes 0/2/3/4/5/6. Pipeline: strip directions → spoken narration →
  ElevenLabs TTS (cloned voice) → mp3 → ffmpeg (hero image + audio → 1920×1080
  h264/aac MP4, limited-range yuv420p, +faststart, `-shortest`) → MP4 +
  `<date>__<slug>.youtube.txt` paste-ready metadata. Reads `ELEVENLABS_API_KEY`
  / `ELEVENLABS_VOICE_ID` from env (runner sources `~/.config/feed/.env`).
  The `assemble` command does the ffmpeg step from an existing audio file with
  no API call — used to prove the MP4 builds without a key.
- `daily-video-script.sh` now calls the render step after the script publishes:
  **only when both `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` are set**;
  otherwise it stops after the script with a clear log line (not a failure).
  A rendered MP4 is moved out of the repo into `~/Local/ikigai/razbakov-daily/`
  (large binary — `.mp4`/`.mp3`/`.wav` are gitignored under the staging folder).
- **Verified without the key:** `assemble` against the real `water-is-memory.png`
  + a 211 s silent placeholder track → valid MP4 (`h264` 1920×1080, `aac`,
  `pix_fmt=yuv420p`, `color_range=tv`, ~212.7 s, ~23 MB). ElevenLabs was NOT
  called (no key). The launchd job stays UNLOADED.

**Captions:** SKIPPED for now. Burned-in word-level captions need the TTS
timestamps endpoint (`/v1/text-to-speech/{voice_id}/with-timestamps`) → an SRT
→ an ffmpeg `subtitles` filter. It's a clean follow-up but not "cheap" (extra
API shape + alignment), so v1 ships caption-free over the hero image. The script
already carries `[TEXT ON SCREEN]` lines if we later want manual lower-thirds.

**NOT in this work (later, if Option C proves watch time):**
- the HeyGen avatar render (Options A/B) + burned-in captions.

### To activate the free step (Alex)
```bash
cp ~/Orgs/ikigai/.bin/com.razbakov.daily-video-script.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.razbakov.daily-video-script.plist
```
Optional reliability: add `DAILY_VIDEO_ANTHROPIC_API_KEY=sk-ant-...` to
`~/.config/feed/.env` so 08:30 generation never depends on a fresh OAuth token.

---

## 5. Go-live checklist (Option C — Alex)

Everything below is a one-time setup. Once the two env values are in place, the
08:30 job renders a ready-to-upload MP4 every day a script is generated.

1. **Sign up for ElevenLabs Creator ($22/mo).**
   - https://elevenlabs.io → Sign up → Subscription → **Creator** ($22/mo).
   - Creator is the cheapest tier with **Professional Voice Cloning (PVC)**.

2. **Create the voice clone.** Two options:
   - **Instant Voice Clone (IVC)** — *same-day, ready in ~1 minute.* Voices →
     **Add Voice → Instant Voice Clone** → upload **1–3 min** of clean Alex-only
     audio. Good enough to launch today. (Source already on disk — extract a
     clean stretch from `~/Local/ikigai/ai-study-group/.../livestream.wav` with
     ffmpeg; no new recording needed.)
   - **Professional Voice Clone (PVC)** — *higher fidelity, trains in a few
     hours.* Voices → **Add Voice → Professional Voice Clone** → upload **≥30 min**
     (ideally 30 min–2 h) of clean audio, then consent-verify. Use this once IVC
     proves the format; it's the better long-term voice.
   - Recommendation: **start with IVC to go live today**, swap in the PVC voice
     id later (just change `ELEVENLABS_VOICE_ID`).

3. **Copy the two values into `~/.config/feed/.env`** (same file the daily jobs
   already source):
   ```bash
   ELEVENLABS_API_KEY=sk-...          # ElevenLabs → Profile → API Keys
   ELEVENLABS_VOICE_ID=...            # the voice's id (Voices → … → "Copy Voice ID")
   ```
   - API key: ElevenLabs dashboard → **profile icon → API Keys → Create**.
   - Voice id: **Voices → the cloned voice → ⋯ menu → Copy Voice ID**.
   - Optional knobs (defaults are fine): `ELEVENLABS_MODEL_ID`
     (default `eleven_multilingual_v2`), `ELEVENLABS_OUTPUT_FORMAT`
     (default `mp3_44100_192`).

4. **Smoke-test the render once, by hand** (does one real ElevenLabs call):
   ```bash
   source ~/.config/feed/.env
   cd ~/Projects/razbakov.com
   node scripts/daily-video-render.mjs render --date 2026-06-19 --slug water-is-memory --force
   ```
   Expect a JSON line with `"ok":true`, an MP4 in
   `content/data/video-scripts/` (then moved by the runner to
   `~/Local/ikigai/razbakov-daily/`), and a `.youtube.txt` next to the script.
   Open the MP4, confirm the voice sounds right.

5. **Activate the daily job** (it ships UNLOADED — same as the script step):
   ```bash
   cp ~/Orgs/ikigai/.bin/com.razbakov.daily-video-script.plist ~/Library/LaunchAgents/
   launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.razbakov.daily-video-script.plist
   ```
   From then on: 08:00 feed → 08:30 script → (if the keys are set) auto-render →
   Forge DM with the MP4 path + paste-ready metadata.

**What Forge needs from Alex to go live:** exactly two values —
`ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` — pasted into
`~/.config/feed/.env`. Nothing else. The code, ffmpeg assembly, and the runner
wiring are done and verified.

---

## 6. Bottom line

- **Audio ready, avatar needs one 2–5 min recording.**
- **Cheapest path to a first video: $22/mo (Option C, voice-only), same-day.**
- **Full twin: ~$156–366/mo, ~1–2 days after a short recording.**
- **Recommendation: ship C now, add the avatar once daily narration proves watch
  time.** Script generator runs free starting today and stockpiles scripts.
