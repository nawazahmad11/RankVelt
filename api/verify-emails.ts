import { resolve4, resolve6, resolveMx } from "node:dns/promises";

type EmailStatus =
  | "likely_deliverable"
  | "invalid_format"
  | "duplicate"
  | "disposable"
  | "role_based"
  | "domain_or_mx_missing"
  | "needs_review";

type EmailResult = {
  email: string;
  status: EmailStatus;
  reason: string;
  action: "Keep" | "Review" | "Remove";
  suggestion?: string;
};

const MAX_EMAILS_PER_REQUEST = 100;
const CONCURRENT_DNS_LOOKUPS = 6;

const ROLE_PREFIXES = new Set([
  "admin",
  "billing",
  "careers",
  "contact",
  "hello",
  "hr",
  "info",
  "legal",
  "marketing",
  "office",
  "orders",
  "sales",
  "security",
  "support",
  "team",
  "webmaster",
]);

const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "dispostable.com",
  "getnada.com",
  "guerrillamail.com",
  "guerrillamailblock.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mytemp.email",
  "sharklasers.com",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
]);

const DOMAIN_TYPOS: Record<string, string> = {
  "gmal.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmaill.com": "gmail.com",
  "hotmal.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "yaho.com": "yahoo.com",
  "yahho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
};

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const jsonResponse = (
  data: unknown,
  status = 200,
): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};

const normaliseEmails = (input: unknown): string[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((email): email is string => typeof email === "string")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

const hasResolvableDomain = async (domain: string): Promise<boolean> => {
  try {
    await resolve4(domain);
    return true;
  } catch {
    try {
      await resolve6(domain);
      return true;
    } catch {
      return false;
    }
  }
};

const checkDomain = async (
  domain: string,
): Promise<{
  hasMx: boolean;
  domainResolves: boolean;
}> => {
  try {
    const mxRecords = await resolveMx(domain);

    if (mxRecords.length > 0) {
      return {
        hasMx: true,
        domainResolves: true,
      };
    }
  } catch {
    // MX records unavailable. Continue with normal DNS lookup.
  }

  return {
    hasMx: false,
    domainResolves: await hasResolvableDomain(domain),
  };
};

const validateEmail = async (
  email: string,
  seenEmails: Set<string>,
): Promise<EmailResult> => {
  if (!EMAIL_PATTERN.test(email)) {
    return {
      email,
      status: "invalid_format",
      reason: "The email address format is incomplete or invalid.",
      action: "Remove",
    };
  }

  if (seenEmails.has(email)) {
    return {
      email,
      status: "duplicate",
      reason: "This address appears more than once in the submitted list.",
      action: "Remove",
    };
  }

  seenEmails.add(email);

  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return {
      email,
      status: "invalid_format",
      reason: "The email address is missing a local part or domain.",
      action: "Remove",
    };
  }

  const suggestedDomain = DOMAIN_TYPOS[domain];

  if (suggestedDomain) {
    return {
      email,
      status: "needs_review",
      reason: "The domain looks like a common email-provider typo.",
      action: "Review",
      suggestion: `${localPart}@${suggestedDomain}`,
    };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      email,
      status: "disposable",
      reason: "The domain is commonly associated with temporary email inboxes.",
      action: "Remove",
    };
  }

  const domainCheck = await checkDomain(domain);

  if (!domainCheck.domainResolves) {
    return {
      email,
      status: "domain_or_mx_missing",
      reason: "The email domain could not be resolved through DNS.",
      action: "Remove",
    };
  }

  if (!domainCheck.hasMx) {
    return {
      email,
      status: "needs_review",
      reason:
        "The domain resolves, but no MX mail-server record was found during this check.",
      action: "Review",
    };
  }

  if (ROLE_PREFIXES.has(localPart)) {
    return {
      email,
      status: "role_based",
      reason:
        "This appears to be a shared role-based mailbox rather than a named individual inbox.",
      action: "Review",
    };
  }

  return {
    email,
    status: "likely_deliverable",
    reason:
      "Valid email format and a domain MX mail-server record were found.",
    action: "Keep",
  };
};

const runWithConcurrency = async (
  emails: string[],
  limit: number,
  seenEmails: Set<string>,
): Promise<EmailResult[]> => {
  const results: EmailResult[] = new Array(emails.length);
  let currentIndex = 0;

  const workers = Array.from(
    { length: Math.min(limit, emails.length) },
    async () => {
      while (currentIndex < emails.length) {
        const emailIndex = currentIndex;
        currentIndex += 1;

        results[emailIndex] = await validateEmail(
          emails[emailIndex],
          seenEmails,
        );
      }
    },
  );

  await Promise.all(workers);

  return results;
};

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          Allow: "POST, OPTIONS",
        },
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(
        {
          error: "Method not allowed. Use POST.",
        },
        405,
      );
    }

    try {
      const body = await request.json();
      const submittedEmails = normaliseEmails(body?.emails);

      if (!submittedEmails.length) {
        return jsonResponse(
          {
            error: "Please provide at least one email address.",
          },
          400,
        );
      }

      if (submittedEmails.length > MAX_EMAILS_PER_REQUEST) {
        return jsonResponse(
          {
            error: `This free tool checks up to ${MAX_EMAILS_PER_REQUEST} email addresses per request.`,
          },
          400,
        );
      }

      const seenEmails = new Set<string>();

      const results = await runWithConcurrency(
        submittedEmails,
        CONCURRENT_DNS_LOOKUPS,
        seenEmails,
      );

      const summary = results.reduce(
        (current, result) => {
          if (result.action === "Keep") {
            current.keep += 1;
          } else if (result.action === "Review") {
            current.review += 1;
          } else {
            current.remove += 1;
          }

          return current;
        },
        {
          keep: 0,
          review: 0,
          remove: 0,
        },
      );

      return jsonResponse({
        checked: results.length,
        results,
        summary,
      });
    } catch {
      return jsonResponse(
        {
          error:
            "The email list could not be checked. Please confirm the input and try again.",
        },
        500,
      );
    }
  },
};