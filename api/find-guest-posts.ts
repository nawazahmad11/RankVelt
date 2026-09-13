const KEYWORDS = [
    "write-for-us",
    "write for us",
    "guest-post",
    "guest post",
    "guest-posting",
    "submit-post",
    "submission-guidelines",
    "editorial-guidelines",
    "become-a-contributor",
    "contribute",
  ];
  
  const COMMON_PATHS = [
    "/write-for-us",
    "/write-for-us/",
    "/pages/write-for-us",
    "/guest-post",
    "/guest-post/",
    "/pages/guest-post",
    "/contribute",
  ];
  
  const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  
  type ScrapedResult = {
    website: string;
    guestPostUrl: string | null;
    emails: string[];
    status: "found" | "not_found" | "error";
    message?: string;
  };
  
  // Robust Fetch with Multi-Proxy Bypass for Cloudflare 403s
  async function fetchWithBypass(targetUrl: string): Promise<string | null> {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    };
  
    // Attempt 1: Direct Fetch
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(targetUrl, { signal: controller.signal, headers });
      clearTimeout(timeoutId);
  
      if (res.ok) {
        const text = await res.text();
        // Ensure it's not a Cloudflare Challenge page
        if (!text.includes("Just a moment...") && !text.includes("Enable JavaScript and cookies to continue")) {
          return text;
        }
      }
    } catch {
      // Proceed to Fallbacks
    }
  
    // Attempt 2: Scraper Proxy 1 (corsproxy.io)
    try {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
  
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 300) return text;
      }
    } catch {
      // Proceed to Fallback 3
    }
  
    // Attempt 3: Jina AI Web Reader (Extremely good at bypassing Cloudflare blocks)
    try {
      const jinaUrl = `https://r.jina.ai/${targetUrl}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(jinaUrl, {
        signal: controller.signal,
        headers: { "X-Return-Format": "html" },
      });
      clearTimeout(timeoutId);
  
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 200) return text;
      }
    } catch {
      // Final fail
    }
  
    return null;
  }
  
  export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
  
    let inputUrl = url.trim();
    if (!inputUrl.startsWith("http://") && !inputUrl.startsWith("https://")) {
      inputUrl = `https://${inputUrl}`;
    }
  
    try {
      const parsedUrl = new URL(inputUrl);
      const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
      
      // Check if the provided URL is ALREADY a guest post page (e.g. tashiara.com/p/submit-guest-post...)
      const isDirectGuestPostUrl = KEYWORDS.some((kw) => {
        const normKw = kw.replace(/[\s-]/g, "");
        const normPath = parsedUrl.pathname.toLowerCase().replace(/[\s-]/g, "");
        return normPath.includes(normKw);
      });
  
      let matchedPageUrl: string | null = isDirectGuestPostUrl ? inputUrl : null;
      let homepageHtml: string | null = null;
  
      // Fetch Homepage if not a direct guest post URL
      if (!matchedPageUrl) {
        homepageHtml = await fetchWithBypass(baseUrl);
  
        if (homepageHtml) {
          const linkRegex = /href=["']([^"']+)["']/gi;
          let match;
  
          while ((match = linkRegex.exec(homepageHtml)) !== null) {
            const href = match[1];
            const lowerHref = href.toLowerCase();
  
            if (
              lowerHref.startsWith("#") ||
              lowerHref.startsWith("javascript:") ||
              lowerHref.startsWith("mailto:")
            ) {
              continue;
            }
  
            const isMatch = KEYWORDS.some((kw) => {
              const normKw = kw.replace(/[\s-]/g, "");
              const normHref = lowerHref.replace(/[\s-]/g, "");
              return normHref.includes(normKw);
            });
  
            if (isMatch) {
              try {
                matchedPageUrl = new URL(href, baseUrl).href;
              } catch {
                matchedPageUrl = href;
              }
              break;
            }
          }
        }
      }
  
      // Path Probing Fallback for sites where link isn't found in HTML
      if (!matchedPageUrl) {
        for (const path of COMMON_PATHS) {
          const testUrl = new URL(path, baseUrl).href;
          const testHtml = await fetchWithBypass(testUrl);
  
          if (testHtml && testHtml.length > 500) {
            matchedPageUrl = testUrl;
            break;
          }
        }
      }
  
      let foundEmails: string[] = [];
  
      // Extract emails from Homepage HTML
      if (homepageHtml) {
        const homeEmails = homepageHtml.match(EMAIL_REGEX) || [];
        foundEmails.push(...homeEmails);
      }
  
      // Extract emails from Matched Guest Post page
      if (matchedPageUrl) {
        const pageHtml = await fetchWithBypass(matchedPageUrl);
        if (pageHtml) {
          const pageEmails = pageHtml.match(EMAIL_REGEX) || [];
          foundEmails.push(...pageEmails);
        }
      }
  
      // Clean up extracted emails
      const cleanedEmails = Array.from(new Set(foundEmails)).filter((e) => {
        const lower = e.toLowerCase();
        return (
          !lower.endsWith(".png") &&
          !lower.endsWith(".jpg") &&
          !lower.endsWith(".webp") &&
          !lower.endsWith(".svg") &&
          !lower.endsWith(".css") &&
          !lower.endsWith(".js") &&
          !lower.includes("swiper") &&
          !lower.includes("sentry") &&
          !lower.includes("example") &&
          !lower.includes("schema.org") &&
          !lower.includes("w3.org")
        );
      });
  
      const result: ScrapedResult = {
        website: url,
        guestPostUrl: matchedPageUrl,
        emails: cleanedEmails,
        status: matchedPageUrl ? "found" : "not_found",
      };
  
      return res.status(200).json({ result });
    } catch (error: any) {
      return res.status(200).json({
        result: {
          website: url,
          guestPostUrl: null,
          emails: [],
          status: "error",
          message: error.message || "Failed request",
        },
      });
    }
  }