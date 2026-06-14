# Daily YouTube feed ("morning intelligence")

Generates Alex's private daily feed at **`/feed`** — a summarized digest of that
day's YouTube homepage recommendations, each with a per-video relevance tie to
his projects.

- **Page:** [`pages/feed.vue`](../pages/feed.vue) — renders the latest dated
  file. Supports `/feed?date=YYYY-MM-DD` to view a past day.
- **Data:** [`content/data/feed/<date>.json`](../content/data/feed) — one file
  per day, keyed by date. New dated files drop in and the page shows the latest.
- **Privacy:** the page is **unlisted + noindex**. It is not in nav/footer; a
  `routeRules["/feed"] = { robots: false }` in `nuxt.config.ts` disallows it in
  `robots.txt`, emits `X-Robots-Tag: noindex,nofollow`, and excludes it from the
  sitemap; the page also sets a `<meta name="robots" content="noindex, nofollow">`.

## Data shape

```jsonc
{
  "date": "2026-06-14",
  "source": "youtube-homepage-recommendations",
  "total_recommended": 45,   // how many recs YouTube showed
  "summarized": 12,          // how many made it into items[] after filtering
  "items": [
    {
      "id": "b3jlsjOIOzs",
      "title": "...",
      "channel": "...",
      "duration": "10:03",
      "category": "AI / Anthropic / Fable",  // items are grouped by this on the page
      "url": "https://youtu.be/b3jlsjOIOzs",
      "summary": "2–4 sentence neutral summary of the video.",
      "relevance": "Why it matters to Alex specifically — tied to a project."
    }
  ]
}
```

## Pipeline

Six steps. Two are deterministic (handled by `generate-feed.mjs`); the rest are
agent-driven and marked as such.

### (a) Collect homepage recommendations — AGENT / BROWSER

Pull the day's YouTube **homepage** recommendations.

> ⚠️ **Dependency:** this requires Alex's logged-in YouTube session. It must run
> against his authenticated Chrome (the homepage feed is personalized — a fresh
> headless browser sees a generic, useless feed). Use the Claude-in-Chrome MCP
> against his existing browser, or `agent-browser` driving his profile. There is
> no public/official API for the personalized homepage feed.

Output of this step: a list of candidate `{id, title, channel, duration, url}`.

### (b) Resolve metadata + transcripts — SCRIPT

```bash
node scripts/generate-feed.mjs fetch <id-or-url> [<id-or-url> ...]
```

Shells out to the **summarize-youtube** skill's fetcher:

```
~/.local/share/skill-mix/sources/skills@razbakov/skills/summarize-youtube/scripts/fetch_youtube.py
```

(Override the path with the `FETCH_YOUTUBE_PY` env var.) Prints a JSON array of
fetched metadata/transcripts to stdout for the next step to consume.

### (c) Summarize + score relevance — AGENT / LLM

For each video, the agent writes a neutral `summary` and a project-tied
`relevance` line, assigns a `category`, and **drops filler** (music videos,
sports, live streams, clickbait with no signal). This is the judgment step —
it is NOT in the script. The agent has the transcript from step (b) and Alex's
project context (CLAUDE.md, OKRs) to ground relevance.

### (d) Write the dated JSON — SCRIPT

```bash
cat summarized-items.json | node scripts/generate-feed.mjs write \
  --date 2026-06-14 --total 45 --summarized 12
```

`summarized-items.json` is the array of fully-summarized items from step (c).
Writes `content/data/feed/2026-06-14.json`.

### (e) Commit + push — CI / AGENT

Commit the new file to `main`. Netlify auto-deploys `main`, so the page goes
live within a couple of minutes at `https://razbakov.com/feed`.

### (f) Send the Telegram digest — AGENT

Send Alex a short Telegram digest (top items + the one-line "why") with a link
to `https://razbakov.com/feed`. Use the standard
`~/Orgs/ikigai/.bin/telegram-send.py` runner.

## Phase 2 (follow-up, not in this scaffold)

Wire steps (a)–(f) into a daily cron (e.g. a scheduled agent run early morning),
with step (a) targeting Alex's authenticated browser. Tracking: razbakov/homepage#22.
