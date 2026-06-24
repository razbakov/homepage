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
  renameSync,
  rmSync,
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
 * (a) COLLECT — yt-dlp + a cookies FILE. recs primary, subs fallback. *
 * ------------------------------------------------------------------ */

// We read cookies from a plain file, NOT --cookies-from-browser, because the
// 8am launchd run happens with the screen locked → the login keychain is locked
// → decrypting Chrome's cookies hangs on a prompt nobody can answer (it gets
// killed at the timeout, yielding zero candidates). A cookies file needs no
// keychain. We refresh it opportunistically whenever the machine IS unlocked.
const COOKIE_FILE =
  process.env.FEED_COOKIES || join(homedir(), ".config/feed/yt-cookies.txt");

// Try to refresh the cookies file from the live browser. Non-fatal, short-timed,
// and VALIDATED: refreshes into a temp file and only replaces the real cookie
// file if the result contains a genuine logged-in session (the LOGIN_INFO
// cookie). On Chrome 127+ macOS, App-Bound Encryption makes --cookies-from-browser
// silently emit a *logged-out* cookie set (no LOGIN_INFO) — overwriting a good
// manually-exported file with that is exactly how the feed broke. So we never
// clobber a known-good file with an unvalidated refresh. Set FEED_SKIP_COOKIE_REFRESH=1
// to disable auto-refresh entirely (recommended when cookies are maintained by hand).
function cookieFileHasLogin(path) {
  try { return /\bLOGIN_INFO\b/.test(readFileSync(path, "utf8")); }
  catch { return false; }
}
function refreshCookies() {
  if (process.env.FEED_SKIP_COOKIE_REFRESH) {
    log("cookies: auto-refresh disabled (FEED_SKIP_COOKIE_REFRESH) — using saved file");
    return;
  }
  try { mkdirSync(dirname(COOKIE_FILE), { recursive: true }); } catch {}
  const tmp = `${COOKIE_FILE}.refresh`;
  const res = spawnSync(
    "yt-dlp",
    ["--no-update", "--cookies-from-browser", "chrome", "--cookies", tmp,
     "--flat-playlist", "--playlist-end", "1", "--print", "%(id)s",
     "https://www.youtube.com/feed/subscriptions"],
    { encoding: "utf8", timeout: 45000 }
  );
  if (res.status === 0 && cookieFileHasLogin(tmp)) {
    try { renameSync(tmp, COOKIE_FILE); log("cookies: refreshed from browser (valid logged-in session)"); }
    catch { log("cookies: refresh ok but could not replace file — keeping existing"); }
  } else {
    // Either locked/unavailable, or the refresh produced a logged-out set (ABE).
    // Keep whatever good file we already have; never overwrite it with junk.
    try { rmSync(tmp, { force: true }); } catch {}
    log(res.status === 0
      ? "cookies: refresh produced no LOGIN_INFO (Chrome App-Bound Encryption?) — keeping existing file"
      : "cookies: refresh skipped (browser locked/unavailable) — using last saved file");
  }
}

function ytdlpList(url, limit) {
  // --flat-playlist is fast (no per-video network); we resolve real metadata in (b).
  const res = spawnSync(
    "yt-dlp",
    [
      "--no-update",
      "--cookies",
      COOKIE_FILE,
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

// (a-fallback) PUBLIC channel RSS — NO cookies, NO auth, NO keychain. The
// bulletproof floor: works even when Chrome is locked or the cookie session is
// dead (the recurring 8am failure mode). Reads a curated channel allowlist
// (channel_id<TAB>name per line, '#' comments ok) and pulls each channel's public
// Atom feed at youtube.com/feeds/videos.xml, keeping uploads inside the lookback
// window. yt-dlp/Chrome are never touched on this path.
const CHANNELS_FILE =
  process.env.FEED_CHANNELS || join(homedir(), ".config/feed/channels.txt");

function readChannelList() {
  if (!existsSync(CHANNELS_FILE)) return [];
  const out = [];
  for (const line of readFileSync(CHANNELS_FILE, "utf8").split("\n")) {
    const s = line.trim();
    if (!s || s.startsWith("#")) continue;
    const id = s.split(/\s+/)[0];
    if (/^UC[A-Za-z0-9_-]{20,}$/.test(id)) out.push(id);
  }
  return out;
}

function decodeXml(s) {
  return String(s)
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

function fetchChannelRss(channelId) {
  const res = spawnSync(
    "curl",
    ["-sS", "--max-time", "20", "-A", "Mozilla/5.0",
     `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }
  );
  if (res.status !== 0 || !res.stdout) return [];
  const out = [];
  for (const e of res.stdout.split("<entry>").slice(1)) {
    const id = (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
    const title = (e.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    const published = (e.match(/<published>([^<]+)<\/published>/) || [])[1] || "";
    if (id && /^[A-Za-z0-9_-]{6,}$/.test(id))
      out.push({ id, title: decodeXml(title), published });
  }
  return out;
}

function collectRss(want) {
  const channels = readChannelList();
  if (!channels.length) {
    log(`collect: RSS fallback unavailable — no channel list at ${CHANNELS_FILE}`);
    return [];
  }
  const lookbackDays = Number(process.env.FEED_RSS_LOOKBACK_DAYS) || 2;
  const cutoff = Date.now() - lookbackDays * 86400000;
  log(`collect: RSS fallback — ${channels.length} channels, lookback ${lookbackDays}d (no auth, no cookies)…`);
  const seen = new Set();
  const items = [];
  for (const ch of channels) {
    for (const v of fetchChannelRss(ch)) {
      if (seen.has(v.id)) continue;
      const t = Date.parse(v.published);
      if (Number.isFinite(t) && t < cutoff) continue;
      seen.add(v.id);
      items.push(v);
    }
  }
  items.sort((a, b) => (Date.parse(b.published) || 0) - (Date.parse(a.published) || 0));
  return items.slice(0, want);
}

function collect({ source, candidates }) {
  const want = Number(candidates) || 40;
  const tryRecs = source !== "subs" && source !== "rss";
  let items = [];
  let used = source === "subs" ? "subs" : source === "rss" ? "rss" : "recs";

  if (source !== "rss")
    refreshCookies(); // keep the file fresh when unlocked; no-op/keeps file when locked

  if (tryRecs) {
    log("collect: trying personalized homepage recommendations…");
    items = ytdlpList("https://www.youtube.com/", want * 2);
    if (items.length) used = "recs";
  }
  if (source !== "rss" && !items.length) {
    log("collect: falling back to subscriptions feed…");
    items = ytdlpList("https://www.youtube.com/feed/subscriptions", want * 2);
    if (items.length) used = "subs";
  }
  if (!items.length) {
    // No-auth safety net: never hard-fail just because cookies are dead/locked.
    items = collectRss(want * 2);
    if (items.length) used = "rss";
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
        : source === "rss"
        ? "curated-channel-rss"
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

/* ------------------------------------------------------------------ *
 * (e) EDITOR'S NOTE — audience-voice, PUBLIC. Resilience-gated: only   *
 *     succeeds with REAL AI summaries + a working backend. Writes HTML *
 *     to --out and exits 0; any failure logs a reason to stderr and    *
 *     exits non-zero so the runner NEVER posts an empty/bad note.      *
 * ------------------------------------------------------------------ */

const NOTE_PERSONA = `You are Alösha (Alex Razbakov) writing a short first-person "Editor's Note" to your Telegram audience, introducing today's curated YouTube digest. Munich-based founder/engineer. Interests: AI (esp. Anthropic/Claude), Apple & Vision Pro / spatial computing, consciousness & simulation & philosophy, science, building/startups, Cuban dance. Voice: warm, curious, concise, a little wry — never hypey or corporate.`;

function editorsnote(flags) {
  const date = flags.date && flags.date !== true ? String(flags.date) : todayBerlin();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    log(`editorsnote: --date must be YYYY-MM-DD, got: ${date}`);
    process.exit(1);
  }
  const inPath = join(FEED_DIR, `${date}.json`);
  if (!existsSync(inPath)) {
    log(`editorsnote: no feed file for ${date} at ${inPath}`);
    process.exit(1);
  }
  let doc;
  try { doc = JSON.parse(readFileSync(inPath, "utf8")); }
  catch (e) { log(`editorsnote: cannot parse ${inPath}: ${e.message}`); process.exit(1); }

  // Resilience gate: only post when there are REAL AI summaries.
  const real = (doc.items || []).filter(
    (it) => it.summary && !/^\(summary pending/i.test(it.summary)
  );
  if (!real.length) {
    log(`editorsnote: no real AI summaries for ${date} — refusing to post a note`);
    process.exit(1);
  }

  const binDir = nodeBinDir();
  const backend = binDir ? detectLlmBackend(binDir) : null;
  if (!backend) {
    log("editorsnote: no working claude -p backend (stale OAuth / no API key) — refusing to post");
    process.exit(1);
  }

  const feedUrl = `https://razbakov.com/feed/${date}`;
  const lines = real
    .map((it) => `- [${it.category || "Other"}] ${it.title} — ${it.channel}: ${it.summary}`)
    .join("\n");
  const prompt = `${NOTE_PERSONA}

Below are today's kept items (${real.length}). Write a SHORT Editor's Note (3-5 sentences, ~70-110 words) that:
- opens in your own voice,
- names 2-3 threads/themes you find most interesting today (group, don't list everything),
- ends inviting them to read the full digest.

Output ONLY Telegram-safe HTML using these tags and nothing else: <b>, <i>, <a href="...">. NO markdown, NO headers, NO bullet lists, NO code fences. Do not wrap in quotes. Write the link as <a href="${feedUrl}">today's feed</a> somewhere natural.

TODAY'S ITEMS:
${lines}`;

  const res = spawnSync("claude", ["-p"], {
    input: prompt,
    encoding: "utf8",
    timeout: 120000,
    env: backend.env,
    maxBuffer: 16 * 1024 * 1024,
  });
  if (res.status !== 0) {
    log(`editorsnote: claude -p failed (status ${res.status}): ${(res.stderr || "").trim().slice(0, 120)}`);
    process.exit(1);
  }
  let html = (res.stdout || "").trim()
    .replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/i, "").trim();
  if (!html) {
    log("editorsnote: backend returned empty note");
    process.exit(1);
  }
  const header = `<b>🎬 Daily YouTube feed — ${date}</b>\n\n`;
  const out = header + html;
  if (flags.out && flags.out !== true) {
    writeFileSync(String(flags.out), out, "utf8");
    log(`editorsnote: wrote note (${real.length} items, ${backend.label}) to ${flags.out}`);
  } else {
    process.stdout.write(out + "\n");
  }
}

/* ----------------------------- CLI ----------------------------- */

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const flags = parseFlags(rest);
  if (cmd === "build") return build(flags);
  if (cmd === "editorsnote") return editorsnote(flags);
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
      "  editorsnote [--date YYYY-MM-DD] [--out PATH]",
    ].join("\n")
  );
  process.exit(cmd ? 1 : 0);
}

main();
