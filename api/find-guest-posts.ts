const KEYWORDS = [
    "write-for-us",
    "write for us",
    "guest-post",
    "guest post",
    "guest-posting",
    "guest posting",
    "guest-author",
    "guest author",
    "guest-contributor",
    "guest contributor",
    "submit-post",
    "submit post",
    "submission-guidelines",
    "submission guidelines",
    "editorial-guidelines",
    "editorial guidelines",
    "become-a-contributor",
    "become a contributor",
    "contribute",
  ];
  
  const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  
  type ScrapedResult = {
    website: string;
    guestPostUrl: string | null;
    emails: string[];
    status: "found" | "not_found" | "error";
    message?: string;
  };
  
  export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
  
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }
  
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second fetch timeout
  
      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        },
      });
      clearTimeout(timeoutId);
  
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
  
      const html = await response.text();
  
      let matchedPageUrl: string | null = null;
  
      // Advanced regex to parse all <a> tags (href + anchor inner content)
      const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
      let match;
  
      while ((match = linkRegex.exec(html)) !== null) {
        const rawHref = match[1];
        const anchorText = match[2].replace(/<[^>]+>/g, "").trim().toLowerCase();
        const lowerHref = rawHref.toLowerCase();
  
        // Skip non-navigational links
        if (
          lowerHref.startsWith("#") ||
          lowerHref.startsWith("javascript:") ||
          lowerHref.startsWith("mailto:") ||
          lowerHref.startsWith("tel:")
        ) {
          continue;
        }
  
        // 1. Smart Keyword Check inside URL path or Anchor Text
        const matchesKeyword = KEYWORDS.some((kw) => {
          // Direct substring check
          if (lowerHref.includes(kw) || anchorText.includes(kw)) return true;
  
          // Clean hyphen/space variations check (e.g. "fashion-write-for-us")
          const normalizedKw = kw.replace(/[\s-]/g, "");
          const normalizedHref = lowerHref.replace(/[\s-]/g, "");
          const normalizedAnchor = anchorText.replace(/[\s-]/g, "");
  
          return (
            normalizedHref.includes(normalizedKw) ||
            normalizedAnchor.includes(normalizedKw)
          );
        });
  
        if (matchesKeyword) {
          try {
            // Resolve relative paths to absolute URL
            matchedPageUrl = new URL(rawHref, targetUrl).href;
          } catch {
            matchedPageUrl = rawHref;
          }
          break; // Stop at first strong match
        }
      }
  
      let foundEmails: string[] = [];
  
      // Extract emails from Homepage
      const homeEmails = html.match(EMAIL_REGEX) || [];
      foundEmails.push(...homeEmails);
  
      // 2. If matched Guest Post page is found, scrape emails from it as well
      if (matchedPageUrl) {
        try {
          const pageController = new AbortController();
          const pageTimeout = setTimeout(() => pageController.abort(), 6000);
  
          const pageRes = await fetch(matchedPageUrl, {
            signal: pageController.signal,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            },
          });
          clearTimeout(pageTimeout);
  
          if (pageRes.ok) {
            const pageHtml = await pageRes.text();
            const pageEmails = pageHtml.match(EMAIL_REGEX) || [];
            foundEmails.push(...pageEmails);
          }
        } catch {
          // Fail silently and keep primary findings
        }
      }
  
      // Clean & Filter Emails (Remove images/assets tagged as email)
      const cleanedEmails = Array.from(new Set(foundEmails)).filter(
        (e) =>
          !e.endsWith(".png") &&
          !e.endsWith(".jpg") &&
          !e.endsWith(".webp") &&
          !e.endsWith(".svg") &&
          !e.endsWith(".gif") &&
          !e.includes("sentry") &&
          !e.includes("example") &&
          !e.includes("schema.org")
      );
  
      const result: ScrapedResult = {
        website: url,
        guestPostUrl: matchedPageUrl,
        emails: cleanedEmails,
        status: matchedPageUrl ? "found" : "not_found",
      };
  
      return res.status(200).json({ result });
    } catch (error: any) {
      const errorResult: ScrapedResult = {
        website: url,
        guestPostUrl: null,
        emails: [],
        status: "error",
        message: error.name === "AbortError" ? "Request Timeout" : error.message,
      };
      return res.status(200).json({ result: errorResult });
    }
  }