#!/usr/bin/env node
/**
 * generate-feed.mjs — scaffold for the daily "morning intelligence" feed.
 *
 * PHASE 1 SCOPE: this script handles only the DETERMINISTIC parts of the
 * pipeline — resolving video metadata/transcripts via the summarize-youtube
 * fetcher, and writing the dated JSON file that pages/feed.vue renders. The
 * collection step (homepage recommendations) and the summarization step
 * (summary + relevance per video) are AGENT-driven and clearly marked below.
 *
 * Full pipeline (see scripts/README.md for the prose version):
 *   (a) [AGENT/BROWSER] pull YouTube homepage recommendations
 *   (b) [SCRIPT]        resolve metadata + transcripts via fetch_youtube.py
 *   (c) [AGENT/LLM]     summarize each (summary + relevance; drop filler)
 *   (d) [SCRIPT]        write content/data/feed/<date>.json   <-- this file
 *   (e) [CI/AGENT]      commit + push (Netlify auto-deploys main)
 *   (f) [AGENT]         send the Telegram digest linking to /feed
 *
 * USAGE
 *   # Resolve metadata for a list of video ids/urls (step b):
 *   node scripts/generate-feed.mjs fetch <id-or-url> [<id-or-url> ...]
 *
 *   # Write a feed file from an items array on stdin (step d):
 *   cat items.json | node scripts/generate-feed.mjs write --date 2026-06-14 \
 *       --total 45 --summarized 12
 *
 * DEPENDENCY (step b): the summarize-youtube skill's Python fetcher at
 *   ~/.local/share/skill-mix/sources/skills@razbakov/skills/summarize-youtube/scripts/fetch_youtube.py
 * Override with FETCH_YOUTUBE_PY if the skill lives elsewhere.
 */

import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const FEED_DIR = join(REPO_ROOT, "content", "data", "feed");

const FETCH_YOUTUBE_PY =
  process.env.FETCH_YOUTUBE_PY ||
  join(
    homedir(),
    ".local/share/skill-mix/sources/skills@razbakov/skills/summarize-youtube/scripts/fetch_youtube.py"
  );

function videoId(idOrUrl) {
  const m = idOrUrl.match(/(?:youtu\.be\/|v=|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m?.[1] || idOrUrl;
}

/**
 * Step (b): resolve metadata + transcript for one video via the skill fetcher.
 * Returns whatever the Python fetcher prints as JSON. The agent uses the
 * transcript field for the summarization step (c); this script does not
 * summarize.
 */
function fetchYoutube(idOrUrl) {
  const id = videoId(idOrUrl);
  const url = `https://youtu.be/${id}`;
  const res = spawnSync("python3", [FETCH_YOUTUBE_PY, url], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (res.status !== 0) {
    throw new Error(
      `fetch_youtube.py failed for ${id} (exit ${res.status}): ${res.stderr?.trim() || "no stderr"}`
    );
  }
  try {
    return JSON.parse(res.stdout);
  } catch {
    // Fetcher may emit plain text; return it under a known key so the agent
    // step can still consume it.
    return { id, url, raw: res.stdout };
  }
}

/**
 * Step (d): write the dated feed file. `items` must already be summarized
 * (each: {id, title, channel, duration, category, url, summary, relevance}).
 */
function writeFeed({ date, source, total, summarized, items }) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) {
    throw new Error(`--date must be YYYY-MM-DD, got: ${date}`);
  }
  mkdirSync(FEED_DIR, { recursive: true });
  const doc = {
    date,
    source: source || "youtube-homepage-recommendations",
    total_recommended: Number(total ?? items.length),
    summarized: Number(summarized ?? items.length),
    items,
  };
  const out = join(FEED_DIR, `${date}.json`);
  writeFileSync(out, JSON.stringify(doc, null, 2) + "\n", "utf8");
  return out;
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

function main() {
  const [cmd, ...rest] = process.argv.slice(2);

  if (cmd === "fetch") {
    if (!rest.length) {
      console.error("usage: generate-feed.mjs fetch <id-or-url> [...]");
      process.exit(1);
    }
    const out = rest.map((arg) => fetchYoutube(arg));
    process.stdout.write(JSON.stringify(out, null, 2) + "\n");
    return;
  }

  if (cmd === "write") {
    const flags = parseFlags(rest);
    const stdin = readFileSync(0, "utf8").trim();
    const items = stdin ? JSON.parse(stdin) : [];
    if (!Array.isArray(items)) {
      console.error("write: stdin must be a JSON array of summarized items");
      process.exit(1);
    }
    const out = writeFeed({
      date: flags.date,
      source: flags.source,
      total: flags.total,
      summarized: flags.summarized,
      items,
    });
    console.error(`wrote ${out} (${items.length} items)`);
    return;
  }

  console.error(
    [
      "generate-feed.mjs — daily morning-intelligence feed scaffold",
      "",
      "commands:",
      "  fetch <id-or-url> [...]   resolve metadata/transcript via fetch_youtube.py (step b)",
      "  write --date YYYY-MM-DD   write content/data/feed/<date>.json from stdin items (step d)",
      "        [--total N] [--summarized N] [--source S]",
      "",
      "See scripts/README.md for the full (agent-assisted) pipeline.",
    ].join("\n")
  );
  process.exit(cmd ? 1 : 0);
}

main();
