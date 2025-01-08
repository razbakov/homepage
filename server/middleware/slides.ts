import { defineEventHandler, sendRedirect } from "h3";

export default defineEventHandler((event) => {
  const url = event.path || "";

  // If it's a direct slide URL (e.g., /slides/example/1)
  if (url.match(/^\/slides\/[^\/]+\/\d+$/)) {
    // Redirect to the index.html of that presentation
    const presentationPath = url.replace(/\/\d+$/, "");
    return sendRedirect(event, presentationPath, 302);
  }
});
