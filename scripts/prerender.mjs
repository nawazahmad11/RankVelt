import puppeteerCore from "puppeteer-core";
import puppeteerFull from "puppeteer";
import chromium from "@sparticuz/chromium";
import http from "http";
import fs from "fs";
import path from "path";

const routes = [
  "/",
  "/local-seo",
  "/local-seo/dentists",
  "/local-seo/plumbers",
  "/blog/plumbing-seo-guide",


  "/local-seo/electricians",
  "/blog/electrician-seo-guide",
  "/local-seo/hvac",
  "/blog/hvac-seo-guide",

  "/local-seo/lawyers",
  "/blog/law-firm-seo-guide",


  "/ecommerce-seo",
  "/business-seo",
  "/blog",
  "/blog/seo-vs-aeo-vs-geo",
  "/blog/optimize-google-ai-overviews",
  "/blog/local-seo-ai-overviews",
  "/blog/service-area-pages",
  "/blog/shopify-seo-checklist",
  "/blog/structured-website-design",
  "/blog/website-redesign-seo-checklist",
  "/blog/internal-linking-seo-ai",
  "/blog/seo-growth-case-study-lessons",
  "/blog/why-shopify-stores-fail",
  "/blog/high-converting-product-pages",
  "/blog/shopify-redesign-signs",
  "/case-studies",
  "/case-studies/product-discovery-at-scale",
  "/case-studies/civic-access",
  "/case-studies/clear-ride-auto-glass",
  "/case-studies/bluebridge",
  "/case-studies/harborline",
  "/tools",
  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
];

const PORT = 5005;
const DIST = path.resolve("dist");

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

// Simple static server with SPA fallback:
// agar exact file mil jaye to wahi bhejo, warna hamesha index.html bhejo
const server = http.createServer((req, res) => {
  let urlPath = req.url.split("?")[0];
  let filePath = path.join(DIST, urlPath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      return sendFile(filePath, res);
    }

    if (!err && stats.isDirectory()) {
      const indexInFolder = path.join(filePath, "index.html");
      if (fs.existsSync(indexInFolder)) {
        return sendFile(indexInFolder, res);
      }
    }

    return sendFile(path.join(DIST, "index.html"), res);
  });
});

function sendFile(filePath, res) {
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

// Vercel pe apna khud ka VERCEL environment variable set karta hai.
// Mac pe ye exist nahi karta, is liye wahan normal puppeteer chalega.
async function launchBrowser() {
  const isVercel = Boolean(process.env.VERCEL);

  if (isVercel) {
    console.log("Vercel environment detected — using @sparticuz/chromium");

    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  console.log("Local environment detected — using full puppeteer");

  return puppeteerFull.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

server.listen(PORT, async () => {
  console.log(`Local server running on http://localhost:${PORT}`);

  const browser = await launchBrowser();

  for (const route of routes) {
    const page = await browser.newPage();
    const url = `http://localhost:${PORT}${route}`;

    console.log(`Rendering: ${route}`);

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const html = await page.content();
      const outDir = route === "/" ? DIST : path.join(DIST, route);

      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html);

      console.log(`Saved: ${route}`);
    } catch (err) {
      console.error(`Failed: ${route}`, err.message);
    }

    await page.close();
  }

  await browser.close();
  server.close();
  console.log("Prerendering complete.");
  process.exit(0);
});