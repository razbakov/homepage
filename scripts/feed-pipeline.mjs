#!/usr/bin/env node
/**
 * feed-pipeline.mjs — full daily "morning intelligence" feed pipeline.
 *
 * Orchestrates the whole thing end-to-end so a launchd job can run it unattended:
 *   (a) collect candidate video ids  — yt-dlp + Chrome cookies (recs primary, subs fallback)
 *   (b) resolve metadata + transcript — summarize-youtube/fetch_youtube.py
 *   (c) summarize + curate each video — `claude -p` headless (auto-detects a working backend)
 *   (d) assemble + write the dated JSON in the EXISTING feed schema (never overwrites a day)
 *
 * The git commit/push and the Telegram digest are handled by the bash runner
 * (feed-daily.sh) so this script stays a pure content-builder with no side
 * effects beyond writing one JSON file.
 *
 * USAGE
 *   node scripts/feed-pipeline.mjs build [--date YYYY-MM-DD] [--source recs|subs]
 *                                        [--candidates N] [--keep N] [--force]
 *   node scripts/feed-pipeline.mjs collect [--source recs|subs] [--candidates N]
 *
 * EXIT CODES
 *   0  feed written (with or without AI summaries)
 *   2  nothing to write (no candidates at all) — runner sends a failure note
 *   3  the dated file already exists and --force was not passed
 *
 * The script prints a one-line JSON status object to STDOUT on success, e.g.
 *   {"ok":true,"date":"2026-06-15","path":"...","total":40,"kept":11,"summarized":11,"source":"recs","llm":"claude-oauth"}
 * The runner parses this to build the Telegram digest.
 *
 * All human-readable progress goes to STDERR so STDOUT stays machine-parseable.
 */

import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  mkdtempSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { homedir, tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const FEED_DIR = join(REPO_ROOT, "content", "data", "feed");

const FETCH_YOUTUBE_PY =
  process.env.FETCH_YOUTUBE_PY ||
  join(
    homedir(),
    ".local/share/skill-mix/sources/skills@razbakov/skills/summarize-youtube/scripts/fetch_youtube.py"
  );

const log = (...a) => process.stderr.write(a.join(" ") + "\n");

function videoId(idOrUrl) {
  const m = String(idOrUrl).match(/(?:youtu\.be\/|v=|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m?.[1] || String(idOrUrl);
}

function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
      flags[key] = val;
    }
  }
  return flags;
}

function todayBerlin() {
  // YYYY-MM-DD in Europe/Berlin regardless of the machine's TZ.
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

/* ------------------------------------------------------------------ *
 * (a) COLLECT — yt-dlp + Chrome cookies. recs primary, subs fallback. *
 * ------------------------------------------------------------------ */

function ytdlpList(url, limit) {
  // --flat-playlist is fast (no per-video network); we resolve real metadata in (b).
  const res = spawnSync(
    "yt-dlp",
    [
      "--cookies-from-browser",
      "chrome",
      "--flat-playlist",
      "--playlist-end",
      String(limit),
      "--print",
      "%(id)s\t%(title)s",
      url,
    ],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 120000 }
  );
  if (res.status !== 0) {
    log(`yt-dlp failed for ${url} (exit ${res.status}): ${(res.stderr || "").trim().slice(0, 300)}`);
    return [];
  }
  const out = [];
  for (const line of (res.stdout || "").split("\n")) {
    const [id, title] = line.split("\t");
    if (id && /^[A-Za-z0-9_-]{6,}$/.test(id)) out.push({ id, title: title || "" });
  }
  return out;
}

// Obvious filler we never want to even fetch transcripts for. The LLM does the
// nuanced curation; this is just a cheap pre-filter on the title.
const FILLER_RE =
  /(\b(fireplace|crackling|lofi|lo-fi|sleep music|rain sounds|ambience|ambient|chillout|chill out|deep house|lounge mix|official music video|music video|full match|highlights|nba|nfl|ufc|asmr|нажив|новини|новости|радіо|radio|official trailer|official video)\b|\b(claude ?fm|24\/7)\b|🔴|🍓|^mix -| - .*\bmix\b|\blive\b ?[:|]|\bvs\.? )/i;

function collect({ source, candidates }) {
  const want = Number(candidates) || 40;
  const tryRecs = source !== "subs";
  let items = [];
  let used = source === "subs" ? "subs" : "recs";

  if (tryRecs) {
    log("collect: trying personalized homepage recommendations…");
    items = ytdlpList("https://www.youtube.com/", want * 2);
    if (items.length) used = "recs";
  }
  if (!items.length) {
    log("collect: falling back to subscriptions feed…");
    items = ytdlpList("https://www.youtube.com/feed/subscriptions", want * 2);
    used = "subs";
  }

  // de-dupe by id, drop obvious filler titles, cap to want
  const seen = new Set();
  const filtered = [];
  for (const it of items) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    if (FILLER_RE.test(it.title)) continue;
    filtered.push(it);
    if (filtered.length >= want) break;
  }
  log(`collect: ${items.length} raw → ${filtered.length} candidates (source=${used})`);
  return { source: used, totalRaw: items.length, candidates: filtered };
}

/* ------------------------------------------------------------------ *
 * (b) FETCH — metadata + transcript via the summarize-youtube fetcher *
 * ------------------------------------------------------------------ */

function fetchMeta(ids, outdir) {
  // One batched call; the fetcher prints one TSV line per id and writes
  // clean_<id>.txt transcripts into outdir.
  const urls = ids.map((id) => `https://www.youtube.com/watch?v=${id}`);
  const res = spawnSync("python3", [FETCH_YOUTUBE_PY, ...urls, "--outdir", outdir], {
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
    timeout: 600000,
  });
  const byId = new Map();
  for (const line of (res.stdout || "").split("\n")) {
    if (!line.trim()) continue;
    const [id, title, channel, duration, , cleanPath] = line.split("\t");
    if (!id) continue;
    byId.set(id, {
      id,
      title: title || "",
      channel: channel || "",
      duration: duration || "",
      transcriptPath: cleanPath && cleanPath.trim() ? cleanPath.trim() : null,
    });
  }
  if (res.status !== 0) {
    log(`fetch_youtube.py exit ${res.status}: ${(res.stderr || "").trim().slice(0, 300)}`);
  }
  return byId;
}

/* ------------------------------------------------------------------ *
 * (c) SUMMARIZE — `claude -p` headless, with backend auto-detection.  *
 * ------------------------------------------------------------------ */

// Find a Node >=18 (the desktop env may default PATH to an old nvm Node 16,
// which crashes the CLI: "TransformStream is not defined").
function nodeBinDir() {
  if (process.env.FEED_NODE_BIN) return process.env.FEED_NODE_BIN;
  const candidates = [
    join(homedir(), ".nvm/versions/node/v24.14.0/bin"),
    join(homedir(), ".nvm/versions/node/v22.14.0/bin"),
    "/opt/homebrew/bin",
    "/usr/local/bin",
  ];
  for (const dir of candidates) {
    if (existsSync(join(dir, "node"))) {
      const v = spawnSync(join(dir, "node"), ["--version"], { encoding: "utf8" });
      const major = parseInt((v.stdout || "").replace(/^v/, ""), 10);
      if (major >= 18) return dir;
    }
  }
  return null;
}

// One probe call to find a backend `claude -p` can actually authenticate with.
// Tries, in order: (1) ANTHROPIC_API_KEY from env, (2) the keychain OAuth token,
// (3) the local LiteLLM proxy if it's reachable. Returns an env overlay + label,
// or null if nothing works (→ metadata-only feed).
function detectLlmBackend(binDir) {
  const PATH = `${binDir}:/opt/homebrew/bin:/usr/bin:/bin`;
  const probe = (env, label) => {
    const res = spawnSync("claude", ["-p"], {
      input: "Reply with only the single word: ok",
      encoding: "utf8",
      timeout: 90000,
      env: { ...env, PATH, HOME: homedir() },
    });
    const ok = res.status === 0 && /ok/i.test((res.stdout || "").trim());
    log(`  backend ${label}: ${ok ? "OK" : "no (" + ((res.stderr || res.stdout || "").trim().slice(0, 80)) + ")"}`);
    return ok ? { env: { ...env, PATH, HOME: homedir() }, label } : null;
  };

  // (1) explicit API key
  if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.startsWith("sk-")) {
    const r = probe({ ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY }, "api-key");
    if (r) return r;
  }
  // (2) keychain OAuth (works only while the desktop-refreshed token is current)
  {
    const r = probe({}, "claude-oauth");
    if (r) return r;
  }
  // (3) LiteLLM proxy, if reachable and a key is exported
  if (process.env.FEED_LITELLM_KEY) {
    const base = process.env.FEED_LITELLM_BASE || "http://localhost:4000";
    const r = probe(
      {
        ANTHROPIC_BASE_URL: base,
        ANTHROPIC_API_KEY: "sk-noop",
        ANTHROPIC_MODEL: "claude-sonnet-4-6",
        ANTHROPIC_DEFAULT_SONNET_MODEL: "claude-sonnet-4-6",
        ANTHROPIC_DEFAULT_HAIKU_MODEL: "claude-haiku-4-5",
        ANTHROPIC_CUSTOM_HEADERS: `x-litellm-api-key: Bearer ${process.env.FEED_LITELLM_KEY}`,
      },
      "litellm"
    );
    if (r) return r;
  }
  return null;
}

const PERSONA = `You are curating a daily YouTube digest for Alösha (Alex Razbakov) — a Munich-based founder/engineer. His interests: AI (especially Anthropic/Claude), Apple & Vision Pro / spatial computing, consciousness & simulation & philosophy, science, startups/building, and Cuban dance/salsa culture. He dislikes filler: music videos, ambient/sleep loops, sports, raw live-news streams, low-substance clickbait.`;

function summarizeOne(backend, meta, transcript) {
  const prompt = `${PERSONA}

Decide if this video is worth including in the digest. SKIP music/sports/ambient/sleep/live-news-filler/low-substance clickbait. KEEP substantive content in his interest areas.

If KEEP: write
- "summary": 2-3 dense, factual lines (what the video actually says/argues)
- "relevance": ONE audience-facing line in Alösha's voice ("Alösha's take") on why it's worth a watch
Also give a short "category" (e.g. "AI / Anthropic", "Apple / Vision Pro", "Consciousness / Simulation", "Science", "Dance / Cuba", "Startups / Building").

Output STRICT JSON on a single line, no markdown, no code fences:
{"keep":true,"category":"...","summary":"...","relevance":"..."}
If not worth keeping: {"keep":false,"category":"...","summary":"","relevance":""}

VIDEO: ${meta.title} — ${meta.channel} (${meta.duration})
TRANSCRIPT (may be empty if no captions):
${transcript ? transcript.slice(0, 14000) : "(no transcript available)"}`;

  const res = spawnSync("claude", ["-p"], {
    input: prompt,
    encoding: "utf8",
    timeout: 120000,
    env: backend.env,
    maxBuffer: 16 * 1024 * 1024,
  });
  if (res.status !== 0) return null;
  const out = (res.stdout || "").trim();
  // tolerate stray prose / code fences around the JSON
  const m = out.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * (d) ASSEMBLE + WRITE — exact existing schema, never overwrite a day *
 * ------------------------------------------------------------------ */

function build(flags) {
  const date = flags.date && flags.date !== true ? String(flags.date) : todayBerlin();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    log(`--date must be YYYY-MM-DD, got: ${date}`);
    process.exit(1);
  }
  mkdirSync(FEED_DIR, { recursive: true });
  const outPath = join(FEED_DIR, `${date}.json`);
  if (existsSync(outPath) && !flags.force) {
    log(`refuse: ${outPath} already exists (pass --force to overwrite)`);
    process.exit(3);
  }

  // (a)
  const { source, totalRaw, candidates } = collect({
    source: flags.source && flags.source !== true ? String(flags.source) : "recs",
    candidates: flags.candidates,
  });
  if (!candidates.length) {
    log("no candidates collected — aborting");
    process.exit(2);
  }
  const keepTarget = Number(flags.keep) || 12;

  // (b)
  const workdir = mkdtempSync(join(tmpdir(), "feed-"));
  log(`fetch: resolving metadata + transcripts for ${candidates.length} videos…`);
  const metaById = fetchMeta(
    candidates.map((c) => c.id),
    workdir
  );

  // (c)
  const binDir = nodeBinDir();
  let backend = null;
  if (binDir) {
    log("summarize: detecting a working claude -p backend…");
    backend = detectLlmBackend(binDir);
  } else {
    log("summarize: no Node>=18 found; skipping LLM step");
  }

  const items = [];
  let summarizedCount = 0;
  for (const cand of candidates) {
    const meta = metaById.get(cand.id) || {
      id: cand.id,
      title: cand.title,
      channel: "",
      duration: "",
      transcriptPath: null,
    };
    const url = `https://youtu.be/${meta.id}`;
    let transcript = "";
    if (meta.transcriptPath && existsSync(meta.transcriptPath)) {
      try {
        transcript = readFileSync(meta.transcriptPath, "utf8");
      } catch {}
    }

    if (backend) {
      const r = summarizeOne(backend, meta, transcript);
      if (r && r.keep === false) {
        log(`  skip  ${meta.title.slice(0, 60)}`);
        continue;
      }
      if (r && r.keep) {
        items.push({
          id: meta.id,
          title: meta.title || cand.title,
          channel: meta.channel,
          duration: meta.duration,
          category: r.category || "Other",
          url,
          summary: r.summary || "",
          relevance: r.relevance || "",
        });
        summarizedCount++;
        log(`  keep  [${r.category}] ${meta.title.slice(0, 55)}`);
        if (items.length >= keepTarget) break;
        continue;
      }
      // r === null → fall through to metadata-only entry below
    }

    // Metadata-only fallback (no backend, or this one failed to summarize).
    // Keep the page non-empty and honest about the missing summary.
    items.push({
      id: meta.id,
      title: meta.title || cand.title,
      channel: meta.channel,
      duration: meta.duration,
      category: "Uncategorized",
      url,
      summary: "(summary pending — AI backend unavailable for this run)",
      relevance: "Surfaced from your YouTube feed; open it to judge for yourself.",
    });
    if (items.length >= keepTarget) break;
  }

  const doc = {
    date,
    source:
      source === "recs"
        ? "youtube-homepage-recommendations"
        : "youtube-subscriptions",
    total_recommended: totalRaw || candidates.length,
    summarized: summarizedCount,
    items,
  };
  writeFileSync(outPath, JSON.stringify(doc, null, 2) + "\n", "utf8");

  const status = {
    ok: true,
    date,
    path: outPath,
    total: doc.total_recommended,
    kept: items.length,
    summarized: summarizedCount,
    source,
    llm: backend ? backend.label : "none",
  };
  process.stdout.write(JSON.stringify(status) + "\n");
  log(
    `done: wrote ${items.length} items (${summarizedCount} AI-summarized) to ${outPath}`
  );
}

/* ----------------------------- CLI ----------------------------- */

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const flags = parseFlags(rest);
  if (cmd === "build") return build(flags);
  if (cmd === "collect") {
    const r = collect({
      source: flags.source && flags.source !== true ? String(flags.source) : "recs",
      candidates: flags.candidates,
    });
    process.stdout.write(JSON.stringify(r, null, 2) + "\n");
    return;
  }
  log(
    [
      "feed-pipeline.mjs — daily morning-intelligence feed",
      "",
      "commands:",
      "  build [--date YYYY-MM-DD] [--source recs|subs] [--candidates N] [--keep N] [--force]",
      "  collect [--source recs|subs] [--candidates N]",
    ].join("\n")
  );
  process.exit(cmd ? 1 : 0);
}

main();
