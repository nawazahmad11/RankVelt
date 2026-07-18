import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFile);
const projectRoot = resolve(currentDirectory, "..");

const SITE_URL = "https://rankvelt.com";

const blogDataPath = resolve(
  projectRoot,
  "src/data/blogData.ts",
);

const sitemapOutputPath = resolve(
  projectRoot,
  "public/sitemap.xml",
);

const staticRoutes = [
  "/",

  "/local-seo",
  "/ecommerce-seo",
  "/business-seo",

  "/blog",

  "/tools",
  "/tools/meta-title-description-checker",
  "/tools/schema-markup-generator",
  "/tools/robots-txt-generator",
  "/tools/xml-sitemap-generator",
  "/tools/local-seo-checklist",
  "/tools/redirect-mapping-generator",

  "/case-studies",
  "/case-studies/project-meridian",
  "/case-studies/civic-access",
  "/case-studies/clear-ride-auto-glass",
  "/case-studies/bluebridge",
  "/case-studies/harborline",

  "/services/custom-liquid-development",
  "/services/mobile-first-ux",
  "/services/visual-storytelling",
  "/services/app-api-sync",
  "/services/checkout-flow",

  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
];

const escapeXml = (value) => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
};

const normalizePath = (path) => {
  if (path === "/") {
    return "/";
  }

  return `/${path.replace(/^\/+|\/+$/g, "")}`;
};

const createAbsoluteUrl = (path) => {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === "/") {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${normalizedPath}`;
};

const blogDataSource = await readFile(
  blogDataPath,
  "utf8",
);

/*
 * Har top-level blog object ko find karta hai.
 *
 * Expected article format:
 *
 *   {
 *     id: "article-slug",
 *     datePublished: "2026-07-01",
 *     dateModified: "2026-07-18",
 *     ...
 *     content: `
 */
const articlePattern =
  /^\s{2}\{\s*\r?\n([\s\S]*?)^\s{4}content:\s*`/gm;

const blogRoutes = [];

for (const match of blogDataSource.matchAll(articlePattern)) {
  const metadataBlock = match[1];

  const idMatch = metadataBlock.match(
    /^\s{4}id:\s*["']([^"']+)["'],?/m,
  );

  if (!idMatch) {
    continue;
  }

  const dateModifiedMatch = metadataBlock.match(
    /^\s{4}dateModified:\s*["'](\d{4}-\d{2}-\d{2})["'],?/m,
  );

  const datePublishedMatch = metadataBlock.match(
    /^\s{4}datePublished:\s*["'](\d{4}-\d{2}-\d{2})["'],?/m,
  );

  const articleId = idMatch[1].trim();

  if (!articleId) {
    continue;
  }

  const lastmod =
    dateModifiedMatch?.[1] ||
    datePublishedMatch?.[1];

  blogRoutes.push({
    path: `/blog/${articleId}`,
    lastmod,
  });
}

if (blogRoutes.length === 0) {
  throw new Error(
    "No blog articles were found in src/data/blogData.ts.",
  );
}

const latestBlogDate = blogRoutes
  .map((route) => route.lastmod)
  .filter(Boolean)
  .sort()
  .at(-1);

const sitemapEntries = [
  ...staticRoutes.map((path) => ({
    path,
    lastmod: path === "/blog" ? latestBlogDate : undefined,
  })),
  ...blogRoutes,
];

const seenUrls = new Set();

for (const entry of sitemapEntries) {
  const absoluteUrl = createAbsoluteUrl(entry.path);

  if (seenUrls.has(absoluteUrl)) {
    throw new Error(
      `Duplicate sitemap URL found: ${absoluteUrl}`,
    );
  }

  seenUrls.add(absoluteUrl);
}

const sitemapUrlsXml = sitemapEntries
  .map((entry) => {
    const absoluteUrl = createAbsoluteUrl(entry.path);

    const lines = [
      "  <url>",
      `    <loc>${escapeXml(absoluteUrl)}</loc>`,
    ];

    if (entry.lastmod) {
      lines.push(
        `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
      );
    }

    lines.push("  </url>");

    return lines.join("\n");
  })
  .join("\n\n");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${sitemapUrlsXml}

</urlset>
`;

await mkdir(dirname(sitemapOutputPath), {
  recursive: true,
});

await writeFile(
  sitemapOutputPath,
  sitemapXml,
  "utf8",
);

console.log("");
console.log("✅ Sitemap generated successfully");
console.log(`   Static routes: ${staticRoutes.length}`);
console.log(`   Blog articles: ${blogRoutes.length}`);
console.log(`   Total URLs: ${sitemapEntries.length}`);
console.log(`   Output: ${sitemapOutputPath}`);
console.log("");