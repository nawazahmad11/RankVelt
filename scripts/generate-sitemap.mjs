import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFile);
const projectRoot = resolve(currentDirectory, "..");

const SITE_URL = "https://www.rankvelt.com";

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
  "/local-seo/dentists",
  "/local-seo/plumbers",
  "/local-seo/electricians",
  "/local-seo/hvac",
  "/local-seo/lawyers",

  "/ecommerce-seo",
  "/business-seo",

  "/ai-seo-agency",
  "/hire-seo-expert",
  "/ecommerce-seo-services",
  "/shopify-seo-services",
  "/seo-audit-services",

  "/blog",

  "/tools",
  "/tools/profit-margin-calculator",
  "/tools/legal-policy-generator",
  "/tools/shopify-theme-detector",
  "/tools/business-name-generator",
  "/tools/guest-post-finder",
  "/tools/meta-title-description-checker",
  "/tools/schema-markup-generator",
  "/tools/robots-txt-generator",
  "/tools/xml-sitemap-generator",
  "/tools/local-seo-checklist",
  "/tools/redirect-mapping-generator",
  "/tools/sentence-counter",
  "/tools/image-compressor",
  "/tools/h1-checker",
  "/tools/canonical-checker",
  "/tools/bulk-qr-code-generator",
  "/tools/paragraph-generator",
  "/tools/alt-text-checker",
  "/tools/meta-tag-generator",
  "/tools/color-contrast-checker",
  "/tools/markup-calculator",
  "/tools/sku-generator",
  "/tools/vin-barcode-generator",
  "/tools/google-review-link-generator",
  "/tools/open-graph-checker",

  "/case-studies",
  "/case-studies/product-discovery-at-scale",
  "/case-studies/civic-access",
  "/case-studies/clear-ride-auto-glass",
  "/case-studies/bluebridge",
  "/case-studies/harborline",

  "/services/custom-liquid-development",
  "/services/mobile-first-ux",
  "/services/visual-storytelling",
  "/services/app-api-sync",
  "/services/checkout-flow",

  "/wordpress-seo-agency",
  "/technical-seo-services",

  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",



  "/seo-services-abu-dhabi",
  "/seo-services-qatar",
  "/seo-services-dubai",
  "/seo-services-saudi-arabia",


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
 */
const articlePattern = /^(?:    |  |)id:\s*["\x27]([^\x27\x22]+)["\x27],/gm;

const blogRoutes = [];

for (const match of blogDataSource.matchAll(articlePattern)) {
  const blogPostStart = match.index;
  // We need to look ahead for date/content to get the metadata for sorting/lastmod
  // This is a bit brittle, but should work given the structure
  const contentAfterId = blogDataSource.substring(blogPostStart);

  const id = match[1];

  const dateModifiedMatch = contentAfterId.match(
    /^\s*dateModified:\s*["\x27](\d{4}-\d{2}-\d{2})["\x27],/m,
  );

  const datePublishedMatch = contentAfterId.match(
    /^\s*datePublished:\s*["\x27](\d{4}-\d{2}-\d{2})["\x27],/m,
  );

  const lastmod =
    dateModifiedMatch?.[1] ||
    datePublishedMatch?.[1];

  blogRoutes.push({
    path: `/blog/${id}`,
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
    console.warn(
      `Duplicate sitemap URL found: ${absoluteUrl}`,
    );
    continue;
  }

  seenUrls.add(absoluteUrl);
}

const sitemapUrlsXml = Array.from(seenUrls).map((absoluteUrl) => {
    const lines = [
      "  <url>",
      `    <loc>${escapeXml(absoluteUrl)}</loc>`,
    ];

    // Only add lastmod if it corresponds to the /blog path (as per logic)
    // Or we could try to pass the lastmod for each URL if we wanted.
    // For now, keeping original logic for /blog lastmod.

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
