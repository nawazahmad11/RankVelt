import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Copy,
  Download,
  Globe2,
  Link2,
  MapPin,
  MessageSquareText,
  MonitorSmartphone,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const SITE_URL = "https://rankvelt.com";
const STORAGE_KEY = "rankvelt-local-seo-checklist-v1";

type CategoryKey = "profile" | "website" | "reputation" | "authority";

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium";
};

type BusinessDetails = {
  businessName: string;
  targetCity: string;
  businessCategory: string;
  websiteUrl: string;
};

const checklistGroups: Record<
  CategoryKey,
  {
    title: string;
    shortTitle: string;
    description: string;
    items: ChecklistItem[];
  }
> = {
  profile: {
    title: "Google Business Profile Foundation",
    shortTitle: "Business Profile",
    description:
      "Check that your public business information is complete, accurate, useful, and aligned with how customers find you.",
    items: [
      {
        id: "gbp-verified",
        title: "Business Profile is claimed and verified",
        description:
          "Confirm that the profile is owned by the real business and verification status is complete.",
        priority: "High",
      },
      {
        id: "gbp-name",
        title: "Business name reflects the real-world name",
        description:
          "Use the actual customer-facing business name. Avoid adding unnecessary keywords, city names, or promotional wording.",
        priority: "High",
      },
      {
        id: "gbp-category",
        title: "Primary business category is accurate",
        description:
          "Choose the closest available category for the main service or business activity customers should find.",
        priority: "High",
      },
      {
        id: "gbp-secondary-categories",
        title: "Relevant secondary categories are reviewed",
        description:
          "Add only genuine additional categories that reflect real services or products.",
        priority: "Medium",
      },
      {
        id: "gbp-contact-details",
        title: "Phone, website, and appointment links are correct",
        description:
          "Make sure all links lead to live pages and the phone number is actively monitored.",
        priority: "High",
      },
      {
        id: "gbp-hours",
        title: "Regular and special opening hours are updated",
        description:
          "Keep holiday hours, temporary closures, and appointment availability accurate for customers.",
        priority: "High",
      },
      {
        id: "gbp-services",
        title: "Services, products, and business description are complete",
        description:
          "Add useful factual details about what the business offers without stuffing keywords.",
        priority: "Medium",
      },
      {
        id: "gbp-media",
        title: "Current real photos, logo, and cover image are added",
        description:
          "Use genuine business, team, product, location, or service photos that help customers understand the business.",
        priority: "Medium",
      },
    ],
  },

  website: {
    title: "Local Website & On-Page SEO",
    shortTitle: "Website",
    description:
      "Make it easy for search engines and customers to understand where you operate, what you offer, and how to contact you.",
    items: [
      {
        id: "website-nap",
        title: "Business name, address, and phone are consistent",
        description:
          "Display accurate public contact details on relevant pages and keep them aligned with your business profile.",
        priority: "High",
      },
      {
        id: "website-service-pages",
        title: "Each core service has a clear dedicated page",
        description:
          "Create useful pages that explain each important service, who it helps, process details, proof, and next steps.",
        priority: "High",
      },
      {
        id: "website-location-pages",
        title: "Location or service-area content is genuinely useful",
        description:
          "Use location pages only where they add unique, truthful value for customers in that area.",
        priority: "High",
      },
      {
        id: "website-title-h1",
        title: "Title tags and H1 headings explain page purpose",
        description:
          "Each important service or location page should have clear, unique metadata and a visible primary heading.",
        priority: "High",
      },
      {
        id: "website-cta",
        title: "Contact, call, booking, or enquiry action is easy to find",
        description:
          "Give users a clear next step from service pages, especially on mobile.",
        priority: "High",
      },
      {
        id: "website-mobile",
        title: "Website is usable on mobile devices",
        description:
          "Check readable text, tap targets, forms, navigation, page layout, and fast access to the main conversion action.",
        priority: "High",
      },
      {
        id: "website-internal-links",
        title: "Relevant internal links connect services, locations, and resources",
        description:
          "Use descriptive internal links to help visitors and crawlers move between related pages.",
        priority: "Medium",
      },
      {
        id: "website-schema",
        title: "Local business information is represented accurately in structured data",
        description:
          "Use structured data only when it reflects visible, real business details on the correct page.",
        priority: "Medium",
      },
    ],
  },

  reputation: {
    title: "Reviews & Customer Trust",
    shortTitle: "Reputation",
    description:
      "Create a sustainable process for earning genuine feedback and responding professionally to customer concerns.",
    items: [
      {
        id: "reviews-process",
        title: "A genuine review-request process exists",
        description:
          "Ask real customers for honest feedback after a completed purchase, project, visit, or service interaction.",
        priority: "High",
      },
      {
        id: "reviews-replies",
        title: "Recent reviews receive thoughtful replies",
        description:
          "Respond professionally, avoid sharing sensitive details, and show future customers that feedback is taken seriously.",
        priority: "High",
      },
      {
        id: "reviews-no-gating",
        title: "Review collection does not filter or manipulate feedback",
        description:
          "Avoid review gating, fake reviews, incentives that distort feedback, or asking only selected customers for public reviews.",
        priority: "High",
      },
      {
        id: "trust-proof",
        title: "Website includes truthful trust information",
        description:
          "Use real testimonials, project proof, team details, policies, credentials, warranties, or customer-process information where relevant.",
        priority: "Medium",
      },
      {
        id: "contact-expectations",
        title: "Response times and service expectations are clear",
        description:
          "Help customers understand how quickly you respond, what happens after enquiry, and how booking or delivery works.",
        priority: "Medium",
      },
    ],
  },

  authority: {
    title: "Local Authority & Ongoing Monitoring",
    shortTitle: "Authority",
    description:
      "Strengthen accurate business references, relevant local awareness, and the reporting process needed for ongoing improvements.",
    items: [
      {
        id: "citations",
        title: "Important business listings are accurate and consistent",
        description:
          "Review major maps, industry directories, local directories, and social profiles for correct public business information.",
        priority: "High",
      },
      {
        id: "local-links",
        title: "Relevant local relationships and mentions are being developed",
        description:
          "Look for genuine local partnerships, suppliers, associations, events, sponsorships, PR opportunities, or community resources.",
        priority: "Medium",
      },
      {
        id: "local-content",
        title: "Local content answers real customer questions",
        description:
          "Create helpful content around local services, processes, areas served, pricing context, booking guidance, or customer problems.",
        priority: "Medium",
      },
      {
        id: "competitor-review",
        title: "Local search competitors are reviewed regularly",
        description:
          "Track what competing businesses show in maps and search, then identify useful gaps without copying misleading claims.",
        priority: "Medium",
      },
      {
        id: "tracking",
        title: "Calls, forms, bookings, and local visibility are measured",
        description:
          "Track practical business outcomes instead of focusing only on rankings or impressions.",
        priority: "High",
      },
      {
        id: "monthly-review",
        title: "A monthly local SEO review routine is in place",
        description:
          "Review profile accuracy, reviews, technical issues, new content, enquiries, and changes in local competition.",
        priority: "Medium",
      },
    ],
  },
};

const categoryOrder: CategoryKey[] = [
  "profile",
  "website",
  "reputation",
  "authority",
];

const pageFaqs = [
  {
    question: "Does completing this checklist guarantee local rankings?",
    answer:
      "No. This scorecard tracks implementation coverage, not ranking guarantees. Local visibility can be affected by relevance, distance, prominence, competition, customer location, business category, website quality, reviews, and other factors.",
  },
  {
    question: "What should I fix first for Local SEO?",
    answer:
      "Start with accurate Google Business Profile details, a verified profile, correct contact information, useful service pages, mobile usability, genuine reviews, and clear ways for customers to contact the business.",
  },
  {
    question: "Can a service-area business use this checklist?",
    answer:
      "Yes. Service-area businesses can use it, but should only show public address information where it is appropriate for customers and consistent with their actual business model.",
  },
  {
    question: "Should every nearby city get its own location page?",
    answer:
      "No. Create a location page only when it provides meaningful, unique, truthful information for people in that location. Thin duplicate city pages usually create a poor user experience.",
  },
  {
    question: "Are more reviews always better for Local SEO?",
    answer:
      "Genuine reviews and thoughtful replies can support customer trust and prominence signals, but review quantity alone does not solve weak relevance, inaccurate information, distance limits, or a poor website experience.",
  },
  {
    question: "How often should I review Local SEO progress?",
    answer:
      "A monthly review is practical for many businesses. Review profile accuracy, hours, reviews, website issues, service pages, calls, enquiries, customer feedback, and meaningful local competitor changes.",
  },
];

const categoryIcon = (category: CategoryKey) => {
  switch (category) {
    case "profile":
      return <Building2 size={20} />;

    case "website":
      return <MonitorSmartphone size={20} />;

    case "reputation":
      return <MessageSquareText size={20} />;

    case "authority":
    default:
      return <Link2 size={20} />;
  }
};

const escapeCsvValue = (value: string) => {
  return `"${value.replace(/"/g, '""')}"`;
};

const ensureMetaByName = (name: string) => {
  let meta = document.querySelector(
    `meta[name="${name}"]`,
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }

  return meta;
};

const ensureMetaByProperty = (property: string) => {
  let meta = document.querySelector(
    `meta[property="${property}"]`,
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }

  return meta;
};

const copyToClipboard = async (value: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");

  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const LocalSeoChecklist = () => {
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    businessName: "",
    targetCity: "",
    businessCategory: "",
    websiteUrl: "",
  });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    {},
  );

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [copyStatus, setCopyStatus] = useState("");
  const [storageLoaded, setStorageLoaded] = useState(false);

  const allItems = useMemo(() => {
    return categoryOrder.flatMap((category) =>
      checklistGroups[category].items.map((item) => ({
        ...item,
        category,
      })),
    );
  }, []);

  const completedCount = useMemo(() => {
    return allItems.filter((item) => checkedItems[item.id]).length;
  }, [allItems, checkedItems]);

  const score = useMemo(() => {
    if (!allItems.length) {
      return 0;
    }

    return Math.round((completedCount / allItems.length) * 100);
  }, [allItems.length, completedCount]);

  const scoreLabel = useMemo(() => {
    if (score >= 85) {
      return {
        label: "Strong implementation coverage",
        description:
          "Most practical local SEO foundations are in place. Focus on review quality, ongoing monitoring, customer experience, and opportunity gaps.",
      };
    }

    if (score >= 60) {
      return {
        label: "Good foundation, clear next actions",
        description:
          "Important work is underway, but unfinished high-priority items should be completed before adding more advanced tactics.",
      };
    }

    if (score >= 30) {
      return {
        label: "Foundations need attention",
        description:
          "Start with business profile accuracy, service-page clarity, public contact details, mobile usability, and genuine review process.",
      };
    }

    return {
      label: "Start with essential local SEO foundations",
      description:
        "Complete the high-priority profile, website, and trust tasks first. Focus on accurate public information and customer usefulness before advanced tactics.",
    };
  }, [score]);

  const categoryProgress = useMemo(() => {
    return categoryOrder.reduce(
      (result, category) => {
        const items = checklistGroups[category].items;
        const completed = items.filter((item) => checkedItems[item.id]).length;

        result[category] = {
          completed,
          total: items.length,
          percent: items.length
            ? Math.round((completed / items.length) * 100)
            : 0,
        };

        return result;
      },
      {} as Record<
        CategoryKey,
        {
          completed: number;
          total: number;
          percent: number;
        }
      >,
    );
  }, [checkedItems]);

  const priorityActions = useMemo(() => {
    return allItems
      .filter(
        (item) =>
          item.priority === "High" &&
          !checkedItems[item.id],
      )
      .slice(0, 6);
  }, [allItems, checkedItems]);

  useEffect(() => {
    try {
      const savedData = window.localStorage.getItem(STORAGE_KEY);

      if (savedData) {
        const parsedData = JSON.parse(savedData) as {
          businessDetails?: BusinessDetails;
          checkedItems?: Record<string, boolean>;
          notes?: Record<string, string>;
        };

        if (parsedData.businessDetails) {
          setBusinessDetails(parsedData.businessDetails);
        }

        if (parsedData.checkedItems) {
          setCheckedItems(parsedData.checkedItems);
        }

        if (parsedData.notes) {
          setNotes(parsedData.notes);
        }
      }
    } catch {
      // Local storage is optional. The checklist remains usable without it.
    } finally {
      setStorageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          businessDetails,
          checkedItems,
          notes,
        }),
      );
    } catch {
      // Do not interrupt the checklist if local storage is unavailable.
    }
  }, [businessDetails, checkedItems, notes, storageLoaded]);

  useEffect(() => {
    const pageTitle = "Free Local SEO Checklist & Scorecard | RankVelt";
    const pageDescription =
      "Use RankVelt's free Local SEO Checklist and Scorecard to review Google Business Profile accuracy, service pages, local trust, reviews, citations, and ongoing local SEO priorities.";

    document.title = pageTitle;

    ensureMetaByName("description").content = pageDescription;
    ensureMetaByName("robots").content = "index, follow";
    ensureMetaByName("twitter:title").content = pageTitle;
    ensureMetaByName("twitter:description").content = pageDescription;

    ensureMetaByProperty("og:title").content = pageTitle;
    ensureMetaByProperty("og:description").content = pageDescription;
    ensureMetaByProperty("og:type").content = "website";
    ensureMetaByProperty("og:url").content =
      `${SITE_URL}/tools/local-seo-checklist`;

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = `${SITE_URL}/tools/local-seo-checklist`;

    document
      .getElementById("rankvelt-local-seo-checklist-schema")
      ?.remove();

    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-local-seo-checklist-schema";
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: "Local SEO Checklist & Scorecard",
          url: `${SITE_URL}/tools/local-seo-checklist`,
          description: pageDescription,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          publisher: {
            "@type": "Organization",
            name: "RankVelt",
            url: SITE_URL,
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: pageFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
      ],
    });

    document.head.appendChild(schemaScript);

    return () => {
      schemaScript.remove();
    };
  }, []);

  const updateBusinessDetail = (
    field: keyof BusinessDetails,
    value: string,
  ) => {
    setBusinessDetails((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleItem = (itemId: string) => {
    setCheckedItems((current) => ({
      ...current,
      [itemId]: !current[itemId],
    }));
  };

  const updateNote = (itemId: string, value: string) => {
    setNotes((current) => ({
      ...current,
      [itemId]: value,
    }));
  };

  const resetChecklist = () => {
    setBusinessDetails({
      businessName: "",
      targetCity: "",
      businessCategory: "",
      websiteUrl: "",
    });

    setCheckedItems({});
    setNotes({});
    setCopyStatus("");

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Checklist reset still works when local storage cannot be accessed.
    }
  };

  const copyPriorityPlan = async () => {
    const businessLabel =
      businessDetails.businessName.trim() || "Local Business";

    const locationLabel =
      businessDetails.targetCity.trim() || "Target Location";

    const plan = [
      `${businessLabel} — Local SEO Priority Plan`,
      `Target location: ${locationLabel}`,
      `Current score: ${score}% (${completedCount}/${allItems.length} actions complete)`,
      "",
      "High-priority actions still to complete:",
      ...priorityActions.map(
        (item, index) =>
          `${index + 1}. ${item.title} — ${item.description}`,
      ),
    ].join("\n");

    try {
      await copyToClipboard(plan);

      setCopyStatus("Priority action plan copied.");

      window.setTimeout(() => {
        setCopyStatus("");
      }, 2200);
    } catch {
      setCopyStatus("Copy failed. Please copy the priority actions manually.");
    }
  };

  const downloadReport = () => {
    const reportRows = [
      [
        "Business Name",
        businessDetails.businessName || "Not added",
      ],
      [
        "Target City / Service Area",
        businessDetails.targetCity || "Not added",
      ],
      [
        "Business Category",
        businessDetails.businessCategory || "Not added",
      ],
      ["Website URL", businessDetails.websiteUrl || "Not added"],
      ["Overall Score", `${score}%`],
      ["Completed Actions", `${completedCount}/${allItems.length}`],
      [],
      ["Category", "Task", "Priority", "Status", "Notes"],
      ...allItems.map((item) => [
        checklistGroups[item.category].shortTitle,
        item.title,
        item.priority,
        checkedItems[item.id] ? "Complete" : "Incomplete",
        notes[item.id] || "",
      ]),
    ];

    const csvContent = reportRows
      .map((row) => row.map((value) => escapeCsvValue(String(value))).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8",
    });

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = "rankvelt-local-seo-checklist-report.csv";
    link.click();

    URL.revokeObjectURL(objectUrl);
  };

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-10%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-12%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.1] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/75 transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} />
          Back to Free Tools
        </Link>

        <section className="mx-auto mt-12 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            <Sparkles size={13} />
            Free Local SEO Planning Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Local SEO Checklist &{" "}
            <span className="text-gradient-gold">Scorecard</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            Review your Google Business Profile, local service pages, customer
            trust, reviews, citations, and ongoing local SEO process in one
            practical scorecard.
          </p>
        </section>

        <section className="mt-12 rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Business Context
              </p>

              <h2 className="mt-3 text-2xl font-black text-white">
                Add Details for Your Checklist Report
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
                These fields stay in your browser only. Nothing is sent to a
                server by this tool.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-emerald-200">
              <ShieldCheck size={14} />
              Browser-only checklist
            </span>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                Business Name
              </span>

              <input
                value={businessDetails.businessName}
                onChange={(event) =>
                  updateBusinessDetail("businessName", event.target.value)
                }
                placeholder="Example: RankVelt"
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary/55"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                Target City / Area
              </span>

              <input
                value={businessDetails.targetCity}
                onChange={(event) =>
                  updateBusinessDetail("targetCity", event.target.value)
                }
                placeholder="Example: Lahore"
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary/55"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                Business Category
              </span>

              <input
                value={businessDetails.businessCategory}
                onChange={(event) =>
                  updateBusinessDetail(
                    "businessCategory",
                    event.target.value,
                  )
                }
                placeholder="Example: Dental Clinic"
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary/55"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                Website URL
              </span>

              <input
                value={businessDetails.websiteUrl}
                onChange={(event) =>
                  updateBusinessDetail("websiteUrl", event.target.value)
                }
                placeholder="https://example.com"
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary/55"
              />
            </label>
          </div>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[0.74fr_1.26fr]">
          <article className="rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/[0.1] via-white/[0.03] to-purple-500/[0.1] p-6 sm:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Current Coverage Score
            </p>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-6xl font-black tracking-[-0.06em] text-white">
                {score}
              </span>

              <span className="mb-2 text-2xl font-black text-primary">%</span>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-black/30">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>

            <h2 className="mt-6 text-2xl font-black text-white">
              {scoreLabel.label}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {scoreLabel.description}
            </p>

            <div className="mt-7 rounded-2xl border border-white/[0.1] bg-black/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                Completed Actions
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {completedCount}
                <span className="text-lg text-white/55">
                  {" "}
                  / {allItems.length}
                </span>
              </p>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Target size={21} />
              </span>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Recommended Next Actions
                </p>

                <h2 className="mt-1 text-2xl font-black text-white">
                  Focus on High-Priority Gaps First
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {priorityActions.length ? (
                priorityActions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/[0.1] bg-black/20 p-4"
                  >
                    <span className="inline-flex rounded-full border border-primary/30 bg-primary/[0.08] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-primary">
                      High priority
                    </span>

                    <h3 className="mt-3 text-sm font-black leading-snug text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-white/75">
                      {item.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-5">
                  <p className="flex items-start gap-3 text-sm leading-relaxed text-emerald-100">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-300"
                    />
                    Your high-priority checklist items are complete. Continue
                    reviewing medium-priority actions and track real customer
                    outcomes each month.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyPriorityPlan}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02]"
              >
                <Copy size={15} />
                Copy Priority Plan
              </button>

              <button
                type="button"
                onClick={downloadReport}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
              >
                <Download size={15} />
                Download CSV Report
              </button>

              <button
                type="button"
                onClick={resetChecklist}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-black text-white transition-colors hover:border-red-400/45 hover:text-red-300"
              >
                <RefreshCcw size={15} />
                Reset Checklist
              </button>
            </div>

            {copyStatus && (
              <p
                className="mt-4 text-sm font-semibold text-emerald-300"
                aria-live="polite"
              >
                {copyStatus}
              </p>
            )}
          </article>
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Local SEO Action Plan
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                Complete the Foundations in Order
              </h2>
            </div>

            <p className="text-sm text-white/70">
              Score tracks completed actions, not a ranking prediction.
            </p>
          </div>

          <div className="mt-7 grid gap-5 xl:grid-cols-2">
            {categoryOrder.map((category) => {
              const group = checklistGroups[category];
              const progress = categoryProgress[category];

              return (
                <article
                  key={category}
                  className="rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        {categoryIcon(category)}
                      </span>

                      <div>
                        <h3 className="text-2xl font-black text-white">
                          {group.title}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-white/80">
                          {group.description}
                        </p>
                      </div>
                    </div>

                    <span className="w-fit rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] font-black text-white/80">
                      {progress.completed}/{progress.total} complete
                    </span>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/30">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>

                  <div className="mt-6 space-y-3">
                    {group.items.map((item) => {
                      const isComplete = Boolean(checkedItems[item.id]);

                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl border p-4 transition-colors ${
                            isComplete
                              ? "border-emerald-400/25 bg-emerald-400/[0.07]"
                              : "border-white/[0.1] bg-black/20"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => toggleItem(item.id)}
                              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                                isComplete
                                  ? "border-emerald-300 bg-emerald-300 text-black"
                                  : "border-white/30 bg-black/30 text-transparent hover:border-primary"
                              }`}
                              aria-label={`Mark ${item.title} as ${
                                isComplete ? "incomplete" : "complete"
                              }`}
                              aria-pressed={isComplete}
                            >
                              <CheckCircle2 size={15} />
                            </button>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4
                                  className={`text-sm font-black leading-snug ${
                                    isComplete
                                      ? "text-emerald-100"
                                      : "text-white"
                                  }`}
                                >
                                  {item.title}
                                </h4>

                                <span
                                  className={`rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-wider ${
                                    item.priority === "High"
                                      ? "bg-primary/[0.12] text-primary"
                                      : "bg-white/[0.08] text-white/70"
                                  }`}
                                >
                                  {item.priority}
                                </span>
                              </div>

                              <p className="mt-2 text-xs leading-relaxed text-white/80">
                                {item.description}
                              </p>

                              <textarea
                                value={notes[item.id] || ""}
                                onChange={(event) =>
                                  updateNote(item.id, event.target.value)
                                }
                                rows={2}
                                placeholder="Optional note, issue, owner, or next action..."
                                className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs leading-relaxed text-white outline-none placeholder:text-white/40 focus:border-primary/45"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
            <MapPin className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Relevance First
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Complete, accurate public business information helps customers
              and search engines understand what you offer and who you serve.
            </p>
          </article>

          <article className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-6">
            <Globe2 className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Website Clarity Matters
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              A business profile works best alongside useful service pages,
              accurate contact details, crawlable internal links, and a clear
              conversion path for real visitors.
            </p>
          </article>

          <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
            <MessageSquareText className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Trust Builds Over Time
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Genuine customer feedback, accurate details, helpful replies, and
              a reliable service experience create stronger local trust than
              shortcuts or inflated claims.
            </p>
          </article>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Local SEO FAQs
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Questions Before You Start
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-4xl space-y-3">
            {pageFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5 open:border-primary/45"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-sm font-black text-white sm:text-base">
                  {faq.question}

                  <ChevronDown
                    size={18}
                    className="shrink-0 text-primary transition-transform group-open:rotate-180"
                  />
                </summary>

                <p className="mt-4 text-sm leading-relaxed text-white/80">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Need a Professional Local SEO Plan?
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Turn Your Checklist Into a Practical Growth Roadmap
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Use this scorecard to identify gaps, then build a focused plan
                around local visibility, service pages, technical SEO, customer
                trust, and qualified enquiries.
              </p>
            </div>

            <Link
              to="/strategy-call?package=Local%20SEO%20Opportunity%20Check"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-xs font-black text-black transition-transform hover:scale-[1.02]"
            >
              Request a Free SEO Check
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-2">
            <Link
              to="/local-seo"
              className="group rounded-2xl border border-white/[0.1] bg-black/25 p-5 transition-all hover:border-primary/45 hover:bg-primary/[0.05]"
            >
              <h3 className="text-lg font-black text-white group-hover:text-primary">
                Local SEO Services
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Improve local service pages, Google Business Profile relevance,
                customer trust, and qualified local enquiries.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                Explore Local SEO
                <ArrowRight size={15} />
              </span>
            </Link>

            <Link
              to="/business-seo"
              className="group rounded-2xl border border-white/[0.1] bg-black/25 p-5 transition-all hover:border-primary/45 hover:bg-primary/[0.05]"
            >
              <h3 className="text-lg font-black text-white group-hover:text-primary">
                Business SEO
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Improve technical foundations, content structure, service-page
                clarity, and organic lead-generation pathways.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                Explore Business SEO
                <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LocalSeoChecklist;