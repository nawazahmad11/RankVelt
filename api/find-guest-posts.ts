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
  
  // Common fallback paths for Shopify, WordPress, and Custom CMS
  const COMMON_PATHS = [
    "/pages/write-for-us",
    "/write-for-us",
    "/write-for-us/",
    "/guest-post",
    "/guest-post/",
    "/pages/guest-post",
    "/pages/contribute",
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
  
  // Helper function: Direct fetch with AllOrigins Proxy fallback for Cloudflare/403 blocks
  async function fetchPageHtml(targetUrl: string, headers: Record<string, string>): Promise<{ html: string | null; isBlocked: boolean }> {
    // 1. Direct Fetch
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
  
      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers,
      });
      clearTimeout(timeoutId);
  
      if (response.ok) {
        const html = await response.text();
        return { html, isBlocked: false };
      }
  
      if (response.status === 403 || response.status === 401) {
        // Direct request blocked, proceed to proxy
      }
    } catch {
      // Timeout or network error, proceed to proxy fallback
    }
  
    // 2. Proxy Fallback (Bypasses Cloudflare / 403 blocks)
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
  
      const proxyRes = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
  
      if (proxyRes.ok) {
        const html = await proxyRes.text();
        return { html, isBlocked: false };
      }
    } catch {
      // Proxy also failed
    }
  
    return { html: null, isBlocked: true };
  }
  
  export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
  
    let baseUrl = url.trim();
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `https://${baseUrl}`;
    }
  
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
    };
  
    try {
      // 1. Fetch Homepage HTML
      const { html, isBlocked } = await fetchPageHtml(baseUrl, headers);
      let matchedPageUrl: string | null = null;
  
      // Method A: Check Links in Homepage HTML
      if (html) {
        const linkRegex = /href=["']([^"']+)["']/gi;
        let match;
  
        while ((match = linkRegex.exec(html)) !== null) {
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
  
      // Method B: Fallback Path Probing (If link not found in HTML, JS rendered, or 403 blocked)
      if (!matchedPageUrl) {
        for (const path of COMMON_PATHS) {
          const testUrl = new URL(path, baseUrl).href;
          const pathData = await fetchPageHtml(testUrl, headers);
  
          if (pathData.html && pathData.html.length > 500) {
            matchedPageUrl = testUrl;
            break;
          }
        }
      }
  
      let foundEmails: string[] = [];
  
      // Extract emails from Homepage HTML
      if (html) {
        const homeEmails = html.match(EMAIL_REGEX) || [];
        foundEmails.push(...homeEmails);
      }
  
      // 2. Fetch matched Guest Post page to extract page text & emails
      if (matchedPageUrl) {
        const pageData = await fetchPageHtml(matchedPageUrl, headers);
        if (pageData.html) {
          const pageEmails = pageData.html.match(EMAIL_REGEX) || [];
          foundEmails.push(...pageEmails);
        }
      }
  
      // Advanced Filter: Remove CSS/JS libraries, assets, and dummy emails
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
        status: matchedPageUrl
          ? "found"
          : isBlocked && !matchedPageUrl
          ? "error"
          : "not_found",
        message: isBlocked && !matchedPageUrl ? "HTTP 403 (Protected)" : undefined,
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