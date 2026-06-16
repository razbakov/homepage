import { defineEventHandler, readBody, createError } from "h3";
import { requireDraftsAuth, slugToPath, getFile, putFile, publishFrontmatter } from "../../utils/githubContent";

// Publish a draft: set hidden -> false and date -> today in its frontmatter,
// then commit to the repo (which triggers a Netlify rebuild).
export default defineEventHandler(async (event) => {
  const { githubToken, draftsSecret } = useRuntimeConfig(event);
  requireDraftsAuth(event, draftsSecret);

  if (!githubToken) {
    throw createError({ statusCode: 500, statusMessage: "Drafts admin is not configured (missing GitHub token)." });
  }

  const body = await readBody<{ slug?: string }>(event);
  const filepath = slugToPath((body?.slug ?? "").trim());
  if (!filepath) throw createError({ statusCode: 400, statusMessage: "Invalid draft slug." });

  const file = await getFile(githubToken, filepath);
  if (!file) throw createError({ statusCode: 404, statusMessage: "Draft not found." });

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const updated = publishFrontmatter(file.content, today);
  if (updated === file.content) {
    // Nothing changed — frontmatter had no hidden/date to flip; treat as no-op success.
    return { ok: true, status: "unchanged", date: today };
  }

  const res = await putFile(githubToken, filepath, updated, file.sha, `blog: publish ${body!.slug} (${today})`);
  if (!res.ok) {
    const detail = await res.text();
    console.error(`[drafts/publish] GitHub ${res.status}: ${detail}`);
    throw createError({ statusCode: 502, statusMessage: "Could not publish — GitHub commit failed." });
  }

  return { ok: true, status: "published", date: today };
});
