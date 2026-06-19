#!/usr/bin/env node
/**
 * daily-video-script.mjs — daily AI-avatar VIDEO SCRIPT generator.
 *
 * The "free step" of the Autopilot daily-video pipeline (razbakov/homepage#37,
 * Julia McCoy method). It turns the latest published blog post into a
 * ~3:30 spoken video script (Hook → 3 beats → CTA, with [B-ROLL] / [TEXT ON
 * SCREEN] directions and paste-ready title/description/tags), so scripts
 * accumulate in a staging folder BEFORE the paid render step (HeyGen +
 * ElevenLabs) exists. When the render step lands, it consumes these files.
 *
 * Sibling of feed-pipeline.mjs and deliberately written in the same style:
 *   - pure content-builder, no side effects beyond writing one .md file
 *   - all human-readable progress → STDERR; one JSON status line → STDOUT
 *   - the git commit + Telegram notify live in the bash runner (daily-video-script.sh)
 *   - never overwrites an existing dated script (exit 3) unless --force
 *
 * TRIGGER (matches the issue):
 *   primary  = a NEW published blog post since the last run (newest English/
 *              canonical post whose slug we haven't scripted yet)
 *   fallback = the daily feed Editor's Note (content/data/feed/<date>.json),
 *              scripted as a "what I watched today" teaser when no new post.
 *
 * USAGE
 *   node scripts/daily-video-script.mjs build [--date YYYY-MM-DD] [--slug <slug>] [--force]
 *   node scripts/daily-video-script.mjs latest        # print the post it WOULD script, no write
 *
 * EXIT CODES
 *   0  script written (STDOUT = one-line JSON status)
 *   2  nothing to script (no new post AND no usable feed fallback)
 *   3  the dated script already exists and --force was not passed
 *   4  found a source but the LLM backend was unavailable (no script written)
 *
 * STDOUT status example:
 *   {"ok":true,"date":"2026-06-19","slug":"water-is-memory","source":"blog","path":"...","llm":"api-key"}
 *
 * The Anthropic backend is detected EXACTLY like feed-pipeline.mjs:
 *   (1) ANTHROPIC_API_KEY (or DAILY_VIDEO_ANTHROPIC_API_KEY → ANTHROPIC_API_KEY
 *       in the runner), (2) the keychain OAuth token, (3) LiteLLM if exported.
 */

import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  existsSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, basename } from "node:path";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const BLOG_DIR = join(REPO_ROOT, "content", "blog");
const FEED_DIR = join(REPO_ROOT, "content", "data", "feed");
// Scripts staging folder. Lives in the repo so the accumulation is versioned
// and the render step can find them deterministically.
const SCRIPT_DIR =
  process.env.DAILY_VIDEO_SCRIPT_DIR ||
  join(REPO_ROOT, "content", "data", "video-scripts");

const SITE_BASE = process.env.DAILY_VIDEO_SITE_BASE || "https://razbakov.com";

const log = (...a) => process.stderr.write(a.join(" ") + "\n");

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
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

/* ------------------------------------------------------------------ *
 * (a) SOURCE SELECTION — newest un-scripted English blog post, or     *
 *     the day's feed Editor's Note as a fallback.                     *
 * ------------------------------------------------------------------ */

// Translations carry a language suffix in the filename (-de/-es/-ru/-uk) and a
// `language:` other than `en` in frontmatter. The canonical English post has
// neither. We only script the English/canonical post.
const LANG_SUFFIX_RE = /-(de|es|ru|uk|fr|it|pt)\.md$/i;

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  let currentKey = null;
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      const v = kv[2].trim();
      fm[currentKey] = v === "" ? [] : v.replace(/^["']|["']$/g, "");
    } else if (/^\s*-\s+/.test(line) && currentKey && Array.isArray(fm[currentKey])) {
      fm[currentKey].push(line.replace(/^\s*-\s+/, "").trim());
    }
  }
  return { fm, body: m[2] };
}

function slugFromFilename(file) {
  // 2026-06-19-water-is-memory.md → water-is-memory
  return basename(file)
    .replace(/\.md$/, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function listScriptedSlugs() {
  if (!existsSync(SCRIPT_DIR)) return new Set();
  const slugs = new Set();
  for (const f of readdirSync(SCRIPT_DIR)) {
    // <date>__<slug>.md → slug
    const m = f.match(/^\d{4}-\d{2}-\d{2}__(.+)\.md$/);
    if (m) slugs.add(m[1]);
  }
  return slugs;
}

// Newest English/canonical post we have NOT scripted yet.
function pickBlogSource() {
  if (!existsSync(BLOG_DIR)) return null;
  const scripted = listScriptedSlugs();
  const candidates = readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") && !LANG_SUFFIX_RE.test(f))
    .map((f) => {
      const full = join(BLOG_DIR, f);
      const { fm, body } = parseFrontmatter(readFileSync(full, "utf8"));
      return { file: f, full, fm, body, slug: slugFromFilename(f) };
    })
    // canonical English only (language absent or explicitly en)
    .filter((p) => !p.fm.language || String(p.fm.language).toLowerCase() === "en")
    // not a draft
    .filter((p) => String(p.fm.draft || "").toLowerCase() !== "true")
    // must have a real date
    .filter((p) => /^\d{4}-\d{2}-\d{2}$/.test(String(p.fm.date || "")))
    // not already scripted
    .filter((p) => !scripted.has(p.slug))
    // sort by date desc, then filename desc (stable tiebreak)
    .sort((a, b) =>
      a.fm.date === b.fm.date
        ? b.file.localeCompare(a.file)
        : String(b.fm.date).localeCompare(String(a.fm.date))
    );
  return candidates[0] || null;
}

// Fallback: today's feed Editor's Note source (the day's curated items).
function pickFeedFallback(date) {
  const path = join(FEED_DIR, `${date}.json`);
  if (!existsSync(path)) return null;
  let doc;
  try {
    doc = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
  if (!doc.items || !doc.items.length) return null;
  return { date, doc, path, slug: `feed-${date}` };
}

/* ------------------------------------------------------------------ *
 * (b) LLM BACKEND — same detection ladder as feed-pipeline.mjs.        *
 * ------------------------------------------------------------------ */

function nodeBinDir() {
  if (process.env.DAILY_VIDEO_NODE_BIN) return process.env.DAILY_VIDEO_NODE_BIN;
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
    log(
      `  backend ${label}: ${
        ok ? "OK" : "no (" + ((res.stderr || res.stdout || "").trim().slice(0, 80)) + ")"
      }`
    );
    return ok ? { env: { ...env, PATH, HOME: homedir() }, label } : null;
  };

  if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.startsWith("sk-")) {
    const r = probe({ ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY }, "api-key");
    if (r) return r;
  }
  {
    const r = probe({}, "claude-oauth");
    if (r) return r;
  }
  if (process.env.DAILY_VIDEO_LITELLM_KEY || process.env.FEED_LITELLM_KEY) {
    const key = process.env.DAILY_VIDEO_LITELLM_KEY || process.env.FEED_LITELLM_KEY;
    const base =
      process.env.DAILY_VIDEO_LITELLM_BASE ||
      process.env.FEED_LITELLM_BASE ||
      "http://localhost:4000";
    const r = probe(
      {
        ANTHROPIC_BASE_URL: base,
        ANTHROPIC_API_KEY: "sk-noop",
        ANTHROPIC_MODEL: "claude-sonnet-4-6",
        ANTHROPIC_DEFAULT_SONNET_MODEL: "claude-sonnet-4-6",
        ANTHROPIC_DEFAULT_HAIKU_MODEL: "claude-haiku-4-5",
        ANTHROPIC_CUSTOM_HEADERS: `x-litellm-api-key: Bearer ${key}`,
      },
      "litellm"
    );
    if (r) return r;
  }
  return null;
}

/* ------------------------------------------------------------------ *
 * (c) GENERATE — script the source following the Daily #001 template. *
 * ------------------------------------------------------------------ */

const VOICE = `You are writing a daily YouTube video script for Alösha (Alex Razbakov) — a Munich-based founder/engineer/philosopher. Voice: first person, contemplative but SPOKEN — shorter sentences than the essay, more breath, more direct address ("you", "here's the thought I can't put down"). No throat-clearing, no "in this video". He talks TO one person.`;

const TEMPLATE_SPEC = `Follow this exact structure (≈3:30 of spoken narration, ~520-600 words of dialogue):

## Hook (0:00–0:20)
2-4 spoken sentences that grab in the first 5 words, then state the one idea the whole video orbits. End on a sharp one-liner.
\`[B-ROLL: ...]\`  one concrete shot direction
\`[TEXT ON SCREEN: ...]\`  one short on-screen line (the hook line)

## Point 1 — <short label> (0:20–1:10)
The first beat of the argument. Spoken. End with a memorable line.
\`[B-ROLL: ...]\`
\`[TEXT ON SCREEN: ...]\`

## Point 2 — <short label> (1:10–2:10)
The second beat — go bigger / zoom out.
\`[B-ROLL: ...]\`
\`[TEXT ON SCREEN: ...]\`

## Point 3 — <short label> (2:10–3:05)
The third beat — make it personal / land it.
\`[B-ROLL: ...]\`
\`[TEXT ON SCREEN: ...]\`

## CTA (3:05–3:30)
Resolve the idea in 2-3 sentences, then: "The full essay is on razbakov.com — link below. New one every day. I'll see you tomorrow."
\`[END SCREEN: Subscribe + "Read the full essay → razbakov.com"]\`

---

## Metadata (paste-ready)

**Title:** <hooky title> | Daily #NNN

**Description (first 2 lines = the hook):**
> <line 1 — the hook question/claim>
> <line 2 — what the 3-minute video delivers>
>
> Full essay → <FULL_URL>
> New essay narrated here every day.

**Tags:** <12-16 comma-separated tags, lowercase, specific>

**Thumbnail:** reuse the essay hero image if one exists; per Julia method, swap to a real photo of Alex once available.`;

function buildBlogPrompt(source) {
  const url = `${SITE_BASE}/blog/${basename(source.file).replace(/\.md$/, "")}`;
  const title = source.fm.title || source.slug;
  return `${VOICE}

Write the daily video script from the blog essay below. Narrate the SPINE of the essay (don't read it verbatim) and drive viewers to the full post.

${TEMPLATE_SPEC}

Use this canonical URL everywhere it says <FULL_URL>: ${url}
Leave "Daily #NNN" literally as "Daily #NNN" — the runner numbers it.

Output ONLY the markdown script (starting at "## Hook"). No preamble, no code fences around the whole thing.

ESSAY TITLE: ${title}
ESSAY BODY:
${source.body.slice(0, 16000)}`;
}

function buildFeedPrompt(source) {
  const url = `${SITE_BASE}/feed/${source.date}`;
  const items = source.doc.items
    .slice(0, 10)
    .map(
      (it) =>
        `- [${it.category || "?"}] ${it.title} — ${it.channel}: ${it.summary || ""}`
    )
    .join("\n");
  return `${VOICE}

There is no new blog essay today, so script a short "what I watched today" teaser from my curated daily YouTube feed. Pull a single THROUGHLINE across the items (a tension or theme), don't just list them.

${TEMPLATE_SPEC}

Use this URL everywhere it says <FULL_URL>: ${url}
Leave "Daily #NNN" literally as "Daily #NNN".

Output ONLY the markdown script (starting at "## Hook"). No preamble.

TODAY'S CURATED ITEMS (${source.date}):
${items}`;
}

function generate(backend, prompt) {
  const res = spawnSync("claude", ["-p"], {
    input: prompt,
    encoding: "utf8",
    timeout: 180000,
    env: backend.env,
    maxBuffer: 16 * 1024 * 1024,
  });
  if (res.status !== 0) return null;
  let out = (res.stdout || "").trim();
  // tolerate an accidental wrapping code fence
  out = out.replace(/^```(?:markdown)?\n?/, "").replace(/\n?```$/, "");
  return out || null;
}

/* ------------------------------------------------------------------ *
 * (d) ASSEMBLE + WRITE — one dated .md, never overwrite.              *
 * ------------------------------------------------------------------ */

function build(flags) {
  const date = flags.date && flags.date !== true ? String(flags.date) : todayBerlin();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    log(`--date must be YYYY-MM-DD, got: ${date}`);
    process.exit(1);
  }

  // --- pick source: explicit slug > newest un-scripted blog > feed fallback
  let source = null;
  let kind = null;
  if (flags.slug && flags.slug !== true) {
    const wanted = String(flags.slug);
    const file = existsSync(BLOG_DIR)
      ? readdirSync(BLOG_DIR).find(
          (f) => slugFromFilename(f) === wanted && !LANG_SUFFIX_RE.test(f)
        )
      : null;
    if (!file) {
      log(`no blog post matched --slug ${wanted}`);
      process.exit(2);
    }
    const { fm, body } = parseFrontmatter(readFileSync(join(BLOG_DIR, file), "utf8"));
    source = { file, full: join(BLOG_DIR, file), fm, body, slug: wanted };
    kind = "blog";
  } else {
    source = pickBlogSource();
    kind = source ? "blog" : null;
    if (!source) {
      source = pickFeedFallback(date);
      kind = source ? "feed" : null;
    }
  }

  if (!source) {
    log("nothing to script: no new English blog post and no usable feed for " + date);
    process.exit(2);
  }
  log(`source: ${kind} → ${source.slug}`);

  // --- never overwrite a dated+slugged script
  mkdirSync(SCRIPT_DIR, { recursive: true });
  const outPath = join(SCRIPT_DIR, `${date}__${source.slug}.md`);
  if (existsSync(outPath) && !flags.force) {
    log(`refuse: ${outPath} already exists (pass --force to overwrite)`);
    process.exit(3);
  }

  // --- backend
  const binDir = nodeBinDir();
  if (!binDir) {
    log("no Node>=18 found for claude -p — cannot generate");
    process.exit(4);
  }
  log("detecting a working claude -p backend…");
  const backend = detectLlmBackend(binDir);
  if (!backend) {
    log("no working LLM backend (stale OAuth / no API key) — NOT writing a script");
    process.exit(4);
  }

  // --- generate
  const prompt = kind === "blog" ? buildBlogPrompt(source) : buildFeedPrompt(source);
  log(`generating script via ${backend.label}…`);
  const script = generate(backend, prompt);
  if (!script) {
    log("generation failed (empty output) — NOT writing a script");
    process.exit(4);
  }

  // --- frontmatter header so the render step has structured inputs
  const sourceUrl =
    kind === "blog"
      ? `${SITE_BASE}/blog/${basename(source.file).replace(/\.md$/, "")}`
      : `${SITE_BASE}/feed/${date}`;
  const header = [
    "---",
    `date: ${date}`,
    `slug: ${source.slug}`,
    `source: ${kind}`,
    `source_url: ${sourceUrl}`,
    `channel: "Alösha — Daily (@razbakovdaily)"`,
    `format: "AI-avatar narration (HeyGen) + cloned voice (ElevenLabs)"`,
    `target_length: "~3:30"`,
    `status: draft`,
    `generated_at: ${new Date().toISOString()}`,
    `llm: ${backend.label}`,
    "---",
    "",
    `# Daily — ${kind === "blog" ? source.fm.title || source.slug : `Feed ${date}`}`,
    "",
    `**Source:** ${sourceUrl}`,
    "",
    script.trim(),
    "",
  ].join("\n");

  writeFileSync(outPath, header, "utf8");

  const status = {
    ok: true,
    date,
    slug: source.slug,
    source: kind,
    path: outPath,
    llm: backend.label,
  };
  process.stdout.write(JSON.stringify(status) + "\n");
  log(`done: wrote ${outPath}`);
}

/* ----------------------------- CLI ----------------------------- */

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const flags = parseFlags(rest);
  if (cmd === "build") return build(flags);
  if (cmd === "latest") {
    const src = pickBlogSource();
    if (src) {
      process.stdout.write(
        JSON.stringify({ source: "blog", slug: src.slug, title: src.fm.title || "", date: src.fm.date }, null, 2) + "\n"
      );
    } else {
      const fb = pickFeedFallback(todayBerlin());
      process.stdout.write(
        JSON.stringify(fb ? { source: "feed", slug: fb.slug } : { source: null }, null, 2) + "\n"
      );
    }
    return;
  }
  log(
    [
      "daily-video-script.mjs — daily AI-avatar video script generator",
      "",
      "commands:",
      "  build [--date YYYY-MM-DD] [--slug <slug>] [--force]",
      "  latest    # print the source it WOULD script, no write",
    ].join("\n")
  );
  process.exit(cmd ? 1 : 0);
}

main();
