import { serverQueryContent } from "#content/server";
import { defineSitemapEventHandler, asSitemapUrl } from "#imports";

export default defineSitemapEventHandler(async (e) => {
  const contentList = await serverQueryContent(e).find();

  return contentList
    .filter((c) => c._path && !c._path.startsWith("/data/") && !c._path.startsWith("/slides/"))
    .map((c) =>
      asSitemapUrl({
        loc: c._path,
        lastmod: c.date || c.updatedAt,
      })
    );
});
