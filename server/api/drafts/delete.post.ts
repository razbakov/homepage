import { defineEventHandler, readBody, createError } from "h3";
import { requireDraftsAuth, slugToPath, getFile, deleteFile } from "../../utils/githubContent";

// Delete a draft: remove its markdown file from the repo (triggers a rebuild).
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
  if (!file) {
    // Already gone — treat as success so the row clears.
    return { ok: true, status: "absent" };
  }

  const res = await deleteFile(githubToken, filepath, file.sha, `blog: delete draft ${body!.slug}`);
  if (!res.ok) {
    const detail = await res.text();
    console.error(`[drafts/delete] GitHub ${res.status}: ${detail}`);
    throw createError({ statusCode: 502, statusMessage: "Could not delete — GitHub commit failed." });
  }

  return { ok: true, status: "deleted" };
});
