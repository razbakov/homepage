#!/usr/bin/env node
/**
 * daily-video-render.mjs — daily AI-narrated VIDEO render step (Option C).
 *
 * The PAID half of the Autopilot daily-video pipeline (razbakov/homepage#37,
 * follow-up to the free script generator in daily-video-script.mjs / PR #38).
 * Alex approved $22/mo ElevenLabs Creator and chose **Option C (voice-only)**:
 * narrate the generated script with his cloned voice over the essay's hero
 * image → a ready-to-upload MP4. No HeyGen / avatar (yet).
 *
 * Pipeline:
 *   1. read a script file from content/data/video-scripts/<date>__<slug>.md
 *   2. strip directions ([B-ROLL] / [TEXT ON SCREEN] / [END SCREEN] / metadata /
 *      frontmatter / headings) → the SPOKEN narration only
 *   3. ElevenLabs TTS (cloned voice) → narration mp3
 *      POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
 *   4. ffmpeg: hero image (public/images/blog/<slug>.png) as a static 1080p
 *      background + narration mp3 → an MP4 sized for YouTube (1920x1080, h264)
 *   5. write <date>__<slug>.mp4 + <date>__<slug>.youtube.txt (paste-ready
 *      title/description/tags) next to the script in the staging folder.
 *
 * Sibling of daily-video-script.mjs / feed-pipeline.mjs, same style:
 *   - all human-readable progress → STDERR; one JSON status line → STDOUT
 *   - the git commit + Telegram notify live in the bash runner
 *   - reads ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID from env (the runner sources
 *     ~/.config/feed/.env, exactly like the Anthropic key for the script step)
 *
 * USAGE
 *   node scripts/daily-video-render.mjs render [--date YYYY-MM-DD] [--slug <slug>]
 *                                              [--script <path>] [--force]
 *   node scripts/daily-video-render.mjs latest        # newest un-rendered script, no write
 *   node scripts/daily-video-render.mjs narration --script <path>   # print stripped narration, no API
 *   node scripts/daily-video-render.mjs assemble --slug <slug> --audio <mp3|wav>
 *                                              [--date YYYY-MM-DD] [--out <mp4>]
 *       # ffmpeg-only path: assemble an MP4 from an EXISTING audio file (no
 *       # ElevenLabs call). Used to prove the assembly works without an API key.
 *
 * EXIT CODES
 *   0  rendered (STDOUT = one-line JSON status)
 *   2  nothing to render (no un-rendered script found)
 *   3  the dated MP4 already exists and --force was not passed
 *   4  ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID missing — stop after script
 *      (the runner treats this as "script ready, render pending key")
 *   5  ElevenLabs API call failed
 *   6  ffmpeg assembly failed / no hero image
 *
 * STDOUT status example:
 *   {"ok":true,"date":"2026-06-19","slug":"water-is-memory","mp4":"...","duration":211.4,"width":1920,"height":1080,"voice":"<id>"}
 */

import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  existsSync,
  statSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, basename } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const HERO_DIR = join(REPO_ROOT, "public", "images", "blog");
const SCRIPT_DIR =
  process.env.DAILY_VIDEO_SCRIPT_DIR ||
  join(REPO_ROOT, "content", "data", "video-scripts");

// ElevenLabs config — read from env (the bash runner sources ~/.config/feed/.env).
const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY || "";
const ELEVEN_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "";
const ELEVEN_MODEL = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
// Default to mp3_44100_128 — the highest mp3 bitrate allowed on the free/Starter
// ElevenLabs tier. mp3_44100_192 requires Creator tier and 403s otherwise (the
// silent render failure on 2026-06-25). Override via ELEVENLABS_OUTPUT_FORMAT in
// ~/.config/feed/.env once on a higher tier.
const ELEVEN_OUTPUT_FORMAT =
  process.env.ELEVENLABS_OUTPUT_FORMAT || "mp3_44100_128";

const FFMPEG = process.env.FFMPEG_BIN || "ffmpeg";
const FFPROBE = process.env.FFPROBE_BIN || "ffprobe";

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
 * (a) SOURCE SELECTION — find a script file to render.                *
 * ------------------------------------------------------------------ */

// content/data/video-scripts/2026-06-19__water-is-memory.md → {date, slug}
const SCRIPT_RE = /^(\d{4}-\d{2}-\d{2})__(.+)\.md$/;

function listScripts() {
  if (!existsSync(SCRIPT_DIR)) return [];
  return readdirSync(SCRIPT_DIR)
    .map((f) => {
      const m = f.match(SCRIPT_RE);
      if (!m) return null;
      return { file: f, full: join(SCRIPT_DIR, f), date: m[1], slug: m[2] };
    })
    .filter(Boolean)
    .sort((a, b) =>
      a.date === b.date ? b.file.localeCompare(a.file) : b.date.localeCompare(a.date)
    );
}

// Newest script that does NOT yet have a sibling .mp4.
function pickUnrendered() {
  for (const s of listScripts()) {
    const mp4 = join(SCRIPT_DIR, `${s.date}__${s.slug}.mp4`);
    if (!existsSync(mp4)) return s;
  }
  return null;
}

function findScript(flags) {
  if (flags.script && flags.script !== true) {
    const p = resolve(String(flags.script));
    if (!existsSync(p)) {
      log(`--script not found: ${p}`);
      process.exit(2);
    }
    const m = basename(p).match(SCRIPT_RE);
    return {
      file: basename(p),
      full: p,
      date: m ? m[1] : flags.date && flags.date !== true ? String(flags.date) : todayBerlin(),
      slug: m ? m[2] : flags.slug && flags.slug !== true ? String(flags.slug) : "script",
    };
  }
  if (flags.slug && flags.slug !== true) {
    const date = flags.date && flags.date !== true ? String(flags.date) : todayBerlin();
    const file = `${date}__${flags.slug}.md`;
    const full = join(SCRIPT_DIR, file);
    if (!existsSync(full)) {
      log(`no script at ${full}`);
      process.exit(2);
    }
    return { file, full, date, slug: String(flags.slug) };
  }
  return pickUnrendered();
}

/* ------------------------------------------------------------------ *
 * (b) NARRATION EXTRACTION — strip everything that isn't spoken.      *
 * ------------------------------------------------------------------ */

/**
 * Reduce a script .md to the spoken lines only:
 *   - drop YAML frontmatter (--- ... ---)
 *   - drop everything from the "## Metadata" heading onward (paste-ready block)
 *   - drop the "---" rule that precedes Metadata
 *   - drop markdown headings (## Hook, ## Point 1 …) — they're section labels
 *   - drop bracket directions: `[B-ROLL: …]`, `[TEXT ON SCREEN: …]`,
 *     `[END SCREEN: …]` (whether or not wrapped in backticks)
 *   - drop the "**Source:** …" line and the leading "# Daily — …" title
 *   - collapse blank runs; join paragraphs with natural pauses
 * The timestamp tags in headings (0:00–0:20) never reach TTS because the whole
 * heading line is dropped.
 */
function extractNarration(raw) {
  let body = raw;

  // strip frontmatter
  const fm = body.match(/^---\n[\s\S]*?\n---\n?/);
  if (fm) body = body.slice(fm[0].length);

  // cut the metadata block (everything from "## Metadata" on)
  const metaIdx = body.search(/^##\s+Metadata\b/m);
  if (metaIdx !== -1) body = body.slice(0, metaIdx);

  const spoken = [];
  for (let line of body.split("\n")) {
    line = line.trim();
    if (!line) {
      // paragraph boundary
      if (spoken.length && spoken[spoken.length - 1] !== "") spoken.push("");
      continue;
    }
    if (line === "---") continue; // horizontal rule
    if (line.startsWith("#")) continue; // headings (## Hook, # Daily — …)
    if (/^\*\*Source:\*\*/i.test(line)) continue; // the source line
    // direction lines: optionally backtick-wrapped [TAG: …]
    const stripped = line.replace(/^`+|`+$/g, "").trim();
    if (/^\[[^\]]*\]$/.test(stripped)) continue; // a whole line that's just [ … ]
    // drop any inline bracket directions that leaked into a prose line
    let cleaned = line
      .replace(/`?\[(?:B-ROLL|TEXT ON SCREEN|END SCREEN|CUT|SHOT|VISUAL)[^\]]*\]`?/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (!cleaned) continue;
    spoken.push(cleaned);
  }

  // collapse to paragraphs, then to one narration string with blank lines as
  // longer pauses (TTS handles paragraph breaks as natural breath).
  const text = spoken
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text;
}

/* ------------------------------------------------------------------ *
 * (c) METADATA EXTRACTION — paste-ready title/description/tags.       *
 * ------------------------------------------------------------------ */

function extractMetadata(raw, slug, date) {
  const metaIdx = raw.search(/^##\s+Metadata\b/m);
  const block = metaIdx === -1 ? "" : raw.slice(metaIdx);

  const titleM = block.match(/\*\*Title:\*\*\s*(.+)/);
  const tagsM = block.match(/\*\*Tags:\*\*\s*(.+)/);

  // Description is the blockquote between "**Description...:**" and "**Tags:**".
  let description = "";
  const descM = block.match(/\*\*Description[^\n]*\*\*\s*\n([\s\S]*?)(?:\n\*\*Tags:|\n##|$)/);
  if (descM) {
    description = descM[1]
      .split("\n")
      .map((l) => l.replace(/^>\s?/, "").trimEnd())
      .join("\n")
      .trim();
  }

  const title = titleM ? titleM[1].trim() : `Daily — ${slug}`;
  const tags = tagsM ? tagsM[1].trim() : "";

  return [
    `# YouTube — paste-ready (${date} · ${slug})`,
    ``,
    `## Title`,
    title,
    ``,
    `## Description`,
    description || "(see script)",
    ``,
    `## Tags`,
    tags,
    ``,
    `## Notes`,
    `Format: Option C — cloned-voice narration over the essay hero image (no avatar).`,
    `Voice: ElevenLabs (${ELEVEN_MODEL}).`,
    ``,
  ].join("\n");
}

/* ------------------------------------------------------------------ *
 * (d) ELEVENLABS TTS — narration text → mp3.                          *
 * ------------------------------------------------------------------ */

async function synthesize(text, outMp3) {
  if (!ELEVEN_API_KEY || !ELEVEN_VOICE_ID) {
    return { ok: false, reason: "missing-key" };
  }
  const url =
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(ELEVEN_VOICE_ID)}` +
    `?output_format=${encodeURIComponent(ELEVEN_OUTPUT_FORMAT)}`;
  const body = {
    text,
    model_id: ELEVEN_MODEL,
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.85,
      style: 0.0,
      use_speaker_boost: true,
    },
  };
  log(`  ElevenLabs: POST ${url} (model=${ELEVEN_MODEL}, ${text.length} chars)`);
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    return { ok: false, reason: `fetch failed: ${e.message}` };
  }
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.text()).slice(0, 300);
    } catch {}
    return { ok: false, reason: `HTTP ${res.status}: ${detail}` };
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (!buf.length) return { ok: false, reason: "empty audio" };
  writeFileSync(outMp3, buf);
  log(`  ElevenLabs: wrote ${outMp3} (${(buf.length / 1024).toFixed(0)} KB)`);
  return { ok: true, bytes: buf.length };
}

/* ------------------------------------------------------------------ *
 * (e) FFMPEG ASSEMBLY — hero image + narration → 1080p MP4.           *
 * ------------------------------------------------------------------ */

function heroImageFor(slug) {
  // Blog heroes use two conventions over time:
  //   legacy flat:     public/images/blog/<slug>.png
  //   current nested:  public/images/blog/<slug>/hero.png   (matches blog frontmatter)
  // Check both (and common extensions) so the render works regardless of vintage.
  const candidates = [];
  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    candidates.push(join(HERO_DIR, `${slug}.${ext}`));
    candidates.push(join(HERO_DIR, slug, `hero.${ext}`));
  }
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function probeMp4(mp4) {
  const res = spawnSync(
    FFPROBE,
    [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height",
      "-show_entries", "format=duration",
      "-of", "json",
      mp4,
    ],
    { encoding: "utf8" }
  );
  if (res.status !== 0) return null;
  try {
    const j = JSON.parse(res.stdout);
    const s = (j.streams && j.streams[0]) || {};
    return {
      width: Number(s.width) || null,
      height: Number(s.height) || null,
      duration: j.format && j.format.duration ? Number(j.format.duration) : null,
    };
  } catch {
    return null;
  }
}

/**
 * Assemble a YouTube-sized MP4 from a static image + an audio track.
 *   - image scaled+padded to 1920x1080 (16:9), pixel format yuv420p (YouTube-safe)
 *   - h264 video, aac audio, +faststart for streaming
 *   - duration follows the audio (-shortest)
 */
function assemble(image, audio, outMp4) {
  if (!existsSync(image)) return { ok: false, reason: `no image: ${image}` };
  if (!existsSync(audio)) return { ok: false, reason: `no audio: ${audio}` };

  // scale+pad to 1920x1080, then force LIMITED-range yuv420p (tv). Source PNGs
  // are often full-range (yuvj420p / color_range=pc); YouTube prefers limited
  // range, and the explicit scale=...:out_range=tv strips the "j" tag so the
  // output is yuv420p, not yuvj420p.
  const vf =
    "scale=1920:1080:force_original_aspect_ratio=decrease," +
    "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black," +
    "scale=out_range=tv,format=yuv420p";

  const args = [
    "-y",
    "-loop", "1",
    "-i", image,
    "-i", audio,
    "-vf", vf,
    "-r", "30",
    "-c:v", "libx264",
    "-tune", "stillimage",
    "-preset", "medium",
    "-crf", "20",
    "-c:a", "aac",
    "-b:a", "192k",
    "-ar", "44100",
    "-pix_fmt", "yuv420p",
    "-color_range", "tv",
    "-movflags", "+faststart",
    "-shortest",
    outMp4,
  ];

  log(`  ffmpeg: assembling ${basename(outMp4)} …`);
  const res = spawnSync(FFMPEG, args, { encoding: "utf8" });
  if (res.status !== 0) {
    return {
      ok: false,
      reason: `ffmpeg exit ${res.status}: ${(res.stderr || "").trim().slice(-400)}`,
    };
  }
  const info = probeMp4(outMp4);
  if (!info) return { ok: false, reason: "ffprobe could not read the output" };
  return { ok: true, info };
}

/* ------------------------------------------------------------------ *
 * (f) COMMANDS                                                        *
 * ------------------------------------------------------------------ */

async function cmdRender(flags) {
  const src = findScript(flags);
  if (!src) {
    log("nothing to render: no un-rendered script found in " + SCRIPT_DIR);
    process.exit(2);
  }
  log(`script: ${src.full}`);

  const outMp4 = join(SCRIPT_DIR, `${src.date}__${src.slug}.mp4`);
  if (existsSync(outMp4) && !flags.force) {
    log(`refuse: ${outMp4} already exists (pass --force to overwrite)`);
    process.exit(3);
  }

  // Gate on the key BEFORE doing any work, so the runner can cleanly report
  // "script ready, render pending key" with exit 4.
  if (!ELEVEN_API_KEY || !ELEVEN_VOICE_ID) {
    log(
      "ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID not set — stopping after script " +
        "(render pending key)."
    );
    process.exit(4);
  }

  const hero = heroImageFor(src.slug);
  if (!hero) {
    log(`no hero image for slug '${src.slug}' in ${HERO_DIR} — cannot assemble`);
    process.exit(6);
  }
  log(`hero: ${hero}`);

  const raw = readFileSync(src.full, "utf8");
  const narration = extractNarration(raw);
  if (!narration) {
    log("narration came out empty after stripping directions — aborting");
    process.exit(6);
  }
  log(`narration: ${narration.length} chars`);

  const outMp3 = join(SCRIPT_DIR, `${src.date}__${src.slug}.mp3`);
  const tts = await synthesize(narration, outMp3);
  if (!tts.ok) {
    log(`ElevenLabs failed: ${tts.reason}`);
    process.exit(5);
  }

  const asm = assemble(hero, outMp3, outMp4);
  if (!asm.ok) {
    log(`assembly failed: ${asm.reason}`);
    process.exit(6);
  }

  // paste-ready metadata next to the mp4
  const metaPath = join(SCRIPT_DIR, `${src.date}__${src.slug}.youtube.txt`);
  writeFileSync(metaPath, extractMetadata(raw, src.slug, src.date), "utf8");

  const status = {
    ok: true,
    date: src.date,
    slug: src.slug,
    mp4: outMp4,
    mp3: outMp3,
    metadata: metaPath,
    duration: asm.info.duration,
    width: asm.info.width,
    height: asm.info.height,
    voice: ELEVEN_VOICE_ID,
  };
  process.stdout.write(JSON.stringify(status) + "\n");
  log(`done: ${outMp4} (${asm.info.width}x${asm.info.height}, ${asm.info.duration}s)`);
}

// ffmpeg-only path: assemble from an existing audio file (no ElevenLabs).
// This is how we prove the assembly works WITHOUT an API key.
function cmdAssemble(flags) {
  const audio = flags.audio && flags.audio !== true ? resolve(String(flags.audio)) : null;
  if (!audio) {
    log("assemble requires --audio <file>");
    process.exit(1);
  }
  let slug = flags.slug && flags.slug !== true ? String(flags.slug) : null;
  let date = flags.date && flags.date !== true ? String(flags.date) : todayBerlin();
  if (!slug) {
    const src = pickUnrendered();
    if (!src) {
      log("no --slug and no un-rendered script to infer one");
      process.exit(2);
    }
    slug = src.slug;
    date = src.date;
  }
  const hero = heroImageFor(slug);
  if (!hero) {
    log(`no hero image for slug '${slug}' in ${HERO_DIR}`);
    process.exit(6);
  }
  const outMp4 =
    flags.out && flags.out !== true
      ? resolve(String(flags.out))
      : join(SCRIPT_DIR, `${date}__${slug}.mp4`);
  log(`hero: ${hero}`);
  log(`audio: ${audio}`);
  const asm = assemble(hero, audio, outMp4);
  if (!asm.ok) {
    log(`assembly failed: ${asm.reason}`);
    process.exit(6);
  }
  const status = {
    ok: true,
    date,
    slug,
    mp4: outMp4,
    duration: asm.info.duration,
    width: asm.info.width,
    height: asm.info.height,
    mode: "assemble-only",
  };
  process.stdout.write(JSON.stringify(status) + "\n");
  log(`done: ${outMp4} (${asm.info.width}x${asm.info.height}, ${asm.info.duration}s)`);
}

function cmdNarration(flags) {
  const src = findScript(flags);
  if (!src) {
    log("no script found");
    process.exit(2);
  }
  const narration = extractNarration(readFileSync(src.full, "utf8"));
  process.stdout.write(narration + "\n");
}

function cmdLatest() {
  const src = pickUnrendered();
  process.stdout.write(
    JSON.stringify(src ? { date: src.date, slug: src.slug, file: src.file } : { source: null }, null, 2) +
      "\n"
  );
}

/* ----------------------------- CLI ----------------------------- */

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const flags = parseFlags(rest);
  if (cmd === "render") return cmdRender(flags);
  if (cmd === "assemble") return cmdAssemble(flags);
  if (cmd === "narration") return cmdNarration(flags);
  if (cmd === "latest") return cmdLatest();
  log(
    [
      "daily-video-render.mjs — daily cloned-voice video render (Option C)",
      "",
      "commands:",
      "  render   [--date YYYY-MM-DD] [--slug <slug>] [--script <path>] [--force]",
      "  assemble --audio <mp3|wav> [--slug <slug>] [--date ...] [--out <mp4>]   # ffmpeg-only, no API",
      "  narration [--slug <slug>] [--script <path>]   # print stripped narration",
      "  latest                                        # newest un-rendered script",
    ].join("\n")
  );
  process.exit(cmd ? 1 : 0);
}

main();
