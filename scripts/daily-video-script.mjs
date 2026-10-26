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
 * TRIGGER:
 *   the newest published essay we haven't scripted yet, in ANY language
 *   (English preferred when the essay has an English version), that has a
 *   hero image. The script is always written in English. Essays without a
 *   hero are skipped and named in `skipped_no_hero` so the runner can flag
 *   them. (The daily-feed fallback was removed: the feed was retired
 *   2026-09-10 and a feed note has no hero, so it could never render.)
 *
 * USAGE
 *   node scripts/daily-video-script.mjs build [--date YYYY-MM-DD] [--slug <slug>] [--force]
 *   node scripts/daily-video-script.mjs latest        # print the post it WOULD script, no write
 *
 * EXIT CODES
 *   0  script written (STDOUT = one-line JSON status)
 *   2  nothing to script (no un-scripted post with a hero image);
 *      STDOUT = {"ok":false,"reason":"nothing","skipped_no_hero":[…]}
 *   3  the dated script already exists and --force was not passed
 *   4  found a source but the LLM backend was unavailable (no script written)
 *   6  --slug names a post that has no hero image
 *
 * STDOUT status example:
 *   {"ok":true,"date":"2026-06-19","slug":"water-is-memory","source":"blog","language":"en",
 *    "hero":"public/images/blog/…/hero.png","skipped_no_hero":[],"path":"...","llm":"api-key"}
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
import { dirname, resolve, join, basename, relative } from "node:path";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const BLOG_DIR = join(REPO_ROOT, "content", "blog");
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
 * (a) SOURCE SELECTION — newest un-scripted post, in ANY language,    *
 *     that has a hero image.                                          *
 * ------------------------------------------------------------------ */

// An essay is one file per language: the canonical file plus translations
// with a language suffix (-de/-es/-ru/-uk) and a matching `language:` in
// frontmatter. Some essays were only ever published in translation, so there
// is not always an English file. All language versions share one slug (the
// filename minus date and suffix) and become ONE video; English is preferred
// when it exists.
//
// The video is narration over the essay's hero image, so a post without a hero
// cannot become a video. Those are skipped and reported by name
// (`skipped_no_hero`) so the runner can say so loudly instead of the job
// silently running dry.
const LANG_SUFFIX_RE = /-(en|de|es|ru|uk|fr|it|pt)\.md$/i;
const LANG_PREFERENCE = ["en", "de", "es", "ru", "uk", "fr", "it", "pt"];
const LANG_NAMES = {
  en: "English", de: "German", es: "Spanish", ru: "Russian",
  uk: "Ukrainian", fr: "French", it: "Italian", pt: "Portuguese",
};
const PUBLIC_DIR = join(REPO_ROOT, "public");
const HERO_EXTS = ["png", "jpg", "jpeg", "webp"];

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

// 2026-06-19-water-is-memory.md and 2026-06-19-water-is-memory-ru.md → water-is-memory
function slugFromFilename(file) {
  return basename(file)
    .replace(LANG_SUFFIX_RE, ".md")
    .replace(/\.md$/, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

// Scripts written before this change used the full filename slug, which kept
// a "-en" suffix on a few posts — compare against that form too.
function legacySlugFromFilename(file) {
  return basename(file).replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function languageOf(file, fm) {
  if (typeof fm.language === "string" && fm.language) return fm.language.toLowerCase();
  const m = basename(file).match(LANG_SUFFIX_RE);
  return m ? m[1].toLowerCase() : "en";
}

// The frontmatter `image:` is the source of truth (the hero folder keeps the
// post's date prefix, so it is not derivable from the slug). The two older
// slug-based conventions are the fallback.
function heroFor(post) {
  const candidates = [];
  if (typeof post.fm.image === "string" && post.fm.image.startsWith("/")) {
    candidates.push(join(PUBLIC_DIR, post.fm.image));
  }
  for (const ext of HERO_EXTS) {
    candidates.push(join(PUBLIC_DIR, "images", "blog", `${post.slug}.${ext}`));
    candidates.push(join(PUBLIC_DIR, "images", "blog", post.slug, `hero.${ext}`));
  }
  return candidates.find((p) => existsSync(p)) || null;
}

function postUrl(post) {
  const name = basename(post.file).replace(/\.md$/, "");
  if (post.lang === "en") return `${SITE_BASE}/blog/${name}`;
  return `${SITE_BASE}/${post.lang}/blog/${name.replace(/-[a-z]{2}$/i, "")}`;
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

// Every published essay, one entry per slug, with its preferred language
// version and its hero image (null when there is none). Newest first.
function listEssays() {
  if (!existsSync(BLOG_DIR)) return [];
  const bySlug = new Map();
  for (const f of readdirSync(BLOG_DIR)) {
    if (!f.endsWith(".md")) continue;
    const full = join(BLOG_DIR, f);
    const { fm, body } = parseFrontmatter(readFileSync(full, "utf8"));
    if (String(fm.draft || "").toLowerCase() === "true") continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fm.date || ""))) continue;
    const post = { file: f, full, fm, body, slug: slugFromFilename(f), lang: languageOf(f, fm) };
    if (!bySlug.has(post.slug)) bySlug.set(post.slug, []);
    bySlug.get(post.slug).push(post);
  }
  const rank = (lang) => {
    const i = LANG_PREFERENCE.indexOf(lang);
    return i === -1 ? LANG_PREFERENCE.length : i;
  };
  const essays = [];
  for (const [slug, versions] of bySlug) {
    versions.sort((a, b) => rank(a.lang) - rank(b.lang) || a.file.localeCompare(b.file));
    const preferred = versions[0];
    // A hero on any language version is the essay's hero.
    const hero = heroFor(preferred) || versions.map(heroFor).find(Boolean) || null;
    essays.push({
      ...preferred,
      slug,
      hero,
      url: postUrl(preferred),
      legacySlugs: versions.map((v) => legacySlugFromFilename(v.file)),
    });
  }
  // sort by date desc, then filename desc (stable tiebreak)
  return essays.sort((a, b) =>
    a.fm.date === b.fm.date
      ? b.file.localeCompare(a.file)
      : String(b.fm.date).localeCompare(String(a.fm.date))
  );
}

// Newest essay we have NOT scripted yet that has a hero. Un-scripted essays
// newer than it (or all of them, when none qualifies) that lack a hero come
// back in skippedNoHero.
function pickBlogSource() {
  const scripted = listScriptedSlugs();
  const pending = listEssays().filter(
    (e) => !scripted.has(e.slug) && !e.legacySlugs.some((s) => scripted.has(s))
  );
  const source = pending.find((e) => e.hero) || null;
  const cutoff = source ? pending.indexOf(source) : pending.length;
  const skippedNoHero = pending
    .slice(0, cutoff)
    .map((e) => ({ slug: e.slug, file: e.file, date: e.fm.date }));
  return { source, skippedNoHero };
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
  const url = source.url;
  const title = source.fm.title || source.slug;
  // The channel is English; an essay published only in translation is
  // narrated in English and still links to the version that exists.
  const languageNote =
    source.lang === "en"
      ? ""
      : `\nThe essay below is written in ${LANG_NAMES[source.lang] || source.lang}. Write the script, title, description and tags in ENGLISH. The essay link stays as given.\n`;
  return `${VOICE}

Write the daily video script from the blog essay below. Narrate the SPINE of the essay (don't read it verbatim) and drive viewers to the full post.
${languageNote}
${TEMPLATE_SPEC}

Use this canonical URL everywhere it says <FULL_URL>: ${url}
Leave "Daily #NNN" literally as "Daily #NNN" — the runner numbers it.

Output ONLY the markdown script (starting at "## Hook"). No preamble, no code fences around the whole thing.

ESSAY TITLE: ${title}
ESSAY BODY:
${source.body.slice(0, 16000)}`;
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

  // --- pick source: explicit slug > newest un-scripted essay with a hero
  let source = null;
  if (flags.slug && flags.slug !== true) {
    const wanted = String(flags.slug);
    source = listEssays().find((e) => e.slug === wanted) || null;
    if (!source) {
      log(`no blog post matched --slug ${wanted}`);
      process.exit(2);
    }
    if (!source.hero) {
      log(`NO HERO IMAGE for '${wanted}' (${source.file}) — a video needs one. Add the post's \`image:\` hero first.`);
      process.stdout.write(JSON.stringify({ ok: false, reason: "no_hero", slug: wanted, file: source.file }) + "\n");
      process.exit(6);
    }
  } else {
    const picked = pickBlogSource();
    source = picked.source;
    for (const s of picked.skippedNoHero) {
      log(`skipped (NO HERO IMAGE): ${s.file}`);
    }
    if (!source) {
      log("nothing to script: no un-scripted post with a hero image for " + date);
      process.stdout.write(
        JSON.stringify({ ok: false, reason: "nothing", skipped_no_hero: picked.skippedNoHero }) + "\n"
      );
      process.exit(2);
    }
    if (picked.skippedNoHero.length) {
      // Surface the skip even on a good day, so a hero-less post never just vanishes.
      source.skippedNoHero = picked.skippedNoHero;
    }
  }
  log(`source: ${source.lang} → ${source.slug} (hero ${relative(REPO_ROOT, source.hero)})`);

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
  const prompt = buildBlogPrompt(source);
  log(`generating script via ${backend.label}…`);
  const script = generate(backend, prompt);
  if (!script) {
    log("generation failed (empty output) — NOT writing a script");
    process.exit(4);
  }

  // --- frontmatter header so the render step has structured inputs
  const sourceUrl = source.url;
  const header = [
    "---",
    `date: ${date}`,
    `slug: ${source.slug}`,
    `source: blog`,
    `source_language: ${source.lang}`,
    `source_url: ${sourceUrl}`,
    `hero: ${relative(REPO_ROOT, source.hero)}`,
    `channel: "Alösha — Daily (@razbakovdaily)"`,
    `format: "AI-avatar narration (HeyGen) + cloned voice (ElevenLabs)"`,
    `target_length: "~3:30"`,
    `status: draft`,
    `generated_at: ${new Date().toISOString()}`,
    `llm: ${backend.label}`,
    "---",
    "",
    `# Daily — ${source.fm.title || source.slug}`,
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
    source: "blog",
    language: source.lang,
    hero: relative(REPO_ROOT, source.hero),
    skipped_no_hero: source.skippedNoHero || [],
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
    const { source: src, skippedNoHero } = pickBlogSource();
    process.stdout.write(
      JSON.stringify(
        {
          source: src
            ? { slug: src.slug, language: src.lang, title: src.fm.title || "", date: src.fm.date, url: src.url, hero: relative(REPO_ROOT, src.hero) }
            : null,
          skipped_no_hero: skippedNoHero,
        },
        null,
        2
      ) + "\n"
    );
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
