import { createError, getHeader, type H3Event } from "h3";
import { timingSafeEqual } from "node:crypto";

// Helpers for the /drafts admin: edit blog content in the GitHub repo via the
// Contents API, gated by a shared secret. Server-only — token + secret come
// from runtimeConfig and never reach the client.

const REPO = "razbakov/homepage";
const BRANCH = "main";

// Blog slugs are lowercase ascii + digits + dashes (e.g. 2026-05-08-foo-en).
// Validate hard to prevent any path traversal into the contents API.
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

export function slugToPath(slug: string): string | null {
  if (!slug || !SLUG_RE.test(slug)) return null;
  return `content/blog/${slug}.md`;
}

// Constant-time check of the x-drafts-secret header against the configured
// secret. Throws 401 on mismatch.
export function requireDraftsAuth(event: H3Event, secret: string): void {
  const provided = getHeader(event, "x-drafts-secret") ?? "";
  const a = Buffer.from(provided);
  const b = Buffer.from(secret || "\0");
  const ok = !!secret && a.length === b.length && timingSafeEqual(a, b);
  if (!ok) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
}

async function gh(path: string, token: string, init: RequestInit = {}) {
  return fetch(`https://api.github.com/repos/${REPO}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "razbakov-drafts-admin",
      ...(init.headers ?? {}),
    },
  });
}

export async function getFile(token: string, filepath: string): Promise<{ content: string; sha: string } | null> {
  const res = await gh(`contents/${filepath}?ref=${BRANCH}`, token);
  if (!res.ok) return null;
  const j = (await res.json()) as { content: string; sha: string };
  return { content: Buffer.from(j.content, "base64").toString("utf8"), sha: j.sha };
}

export async function putFile(token: string, filepath: string, content: string, sha: string, message: string): Promise<Response> {
  return gh(`contents/${filepath}`, token, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      sha,
      branch: BRANCH,
    }),
  });
}

export async function deleteFile(token: string, filepath: string, sha: string, message: string): Promise<Response> {
  return gh(`contents/${filepath}`, token, {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });
}

// Flip a draft's frontmatter to published: hidden -> false and date -> today.
// Only touches the frontmatter block; the body is left untouched.
export function publishFrontmatter(md: string, today: string): string {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return md;
  let fm = m[1];
  fm = /^hidden:\s*.*$/m.test(fm) ? fm.replace(/^hidden:\s*.*$/m, "hidden: false") : `hidden: false\n${fm}`;
  fm = /^date:\s*.*$/m.test(fm) ? fm.replace(/^date:\s*.*$/m, `date: ${today}`) : `${fm}\ndate: ${today}`;
  return md.replace(m[0], `---\n${fm}\n---`);
}
