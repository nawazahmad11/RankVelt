// IndexNow ping script for rankvelt.com
// Sends new or updated page URLs to IndexNow, which notifies Bing and the
// other participating search engines so they crawl the pages sooner.
//
// Usage:
//   node scripts/indexnow-ping.mjs <url1> <url2> ...
//   node scripts/indexnow-ping.mjs --file urls-initial.txt
//
// Requires Node 18 or newer (uses the built in fetch). No dependencies.
// The key below is NOT a password. IndexNow keys are public by design:
// the matching key file lives at https://www.rankvelt.com/<key>.txt and
// proves these pings come from the site owner.

import { readFile } from "node:fs/promises";

const HOST = "www.rankvelt.com";
const KEY = "fc3729db1e31dd742f6dc714d53fd942";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_PER_REQUEST = 10000; // IndexNow limit per request

async function main() {
  const args = process.argv.slice(2);
  let urls = [];

  if (args[0] === "--file") {
    if (!args[1]) {
      console.error("Give a file path after --file");
      process.exit(1);
    }
    const text = await readFile(args[1], "utf8");
    urls = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  } else {
    urls = args;
  }

  if (urls.length === 0) {
    console.error("No URLs given. Pass URLs as arguments or use --file <path>.");
    process.exit(1);
  }

  const wrong = urls.filter((u) => {
    try {
      return new URL(u).host !== HOST;
    } catch {
      return true;
    }
  });
  if (wrong.length > 0) {
    console.error(`These URLs are not on ${HOST}, nothing was sent:`);
    wrong.forEach((u) => console.error("  " + u));
    process.exit(1);
  }

  for (let i = 0; i < urls.length; i += MAX_PER_REQUEST) {
    const chunk = urls.slice(i, i + MAX_PER_REQUEST);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: chunk,
      }),
    });
    // 200 means OK, 202 means accepted.
    console.log(
      `Submitted ${chunk.length} URL(s). IndexNow replied ${res.status} ${res.statusText}.`
    );
    if (res.status !== 200 && res.status !== 202) {
      console.log("Response body:", await res.text());
      console.log(
        "Common cause: the key file is not live yet at " +
          KEY_LOCATION +
          " . Deploy first, open that URL to confirm it shows the key, then run again."
      );
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
