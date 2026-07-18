import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Code2,
  Copy,
  Download,
  FileText,
  Globe2,
  HelpCircle,
  MapPin,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react";

const SITE_URL = "https://rankvelt.com";

type SchemaType =
  | "organization"
  | "localBusiness"
  | "service"
  | "faq"
  | "article";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type SchemaForm = {
  pageUrl: string;

  businessName: string;
  businessUrl: string;
  logoUrl: string;
  sameAs: string;
  telephone: string;
  email: string;

  localBusinessType: string;
  priceRange: string;
  imageUrl: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  openingHours: string;

  serviceName: string;
  serviceType: string;
  serviceDescription: string;
  areaServed: string;

  articleHeadline: string;
  articleDescription: string;
  articleImage: string;
  authorName: string;
  authorUrl: string;
  datePublished: string;
  dateModified: string;
};

type InputFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
};

type TextareaFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
};

const initialForm: SchemaForm = {
  pageUrl: "",

  businessName: "",
  businessUrl: "",
  logoUrl: "",
  sameAs: "",
  telephone: "",
  email: "",

  localBusinessType: "LocalBusiness",
  priceRange: "",
  imageUrl: "",
  streetAddress: "",
  addressLocality: "",
  addressRegion: "",
  postalCode: "",
  addressCountry: "",
  openingHours: "",

  serviceName: "",
  serviceType: "",
  serviceDescription: "",
  areaServed: "",

  articleHeadline: "",
  articleDescription: "",
  articleImage: "",
  authorName: "",
  authorUrl: "",
  datePublished: "",
  dateModified: "",
};

const createFaqItem = (): FaqItem => ({
  id: `faq-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  question: "",
  answer: "",
});

const normaliseUrl = (value: string) => {
  const cleanValue = value.trim();

  if (!cleanValue) {
    return "";
  }

  if (/^https?:\/\//i.test(cleanValue)) {
    return cleanValue.replace(/\/+$/, "");
  }

  return `https://${cleanValue.replace(/^\/+/, "").replace(/\/+$/, "")}`;
};

const splitUrls = (value: string) => {
  return value
    .split(/[\n,]/)
    .map((url) => normaliseUrl(url))
    .filter(Boolean);
};

const addIfPresent = (
  target: Record<string, unknown>,
  key: string,
  value: string,
) => {
  const cleanValue = value.trim();

  if (cleanValue) {
    target[key] = cleanValue;
  }
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

const InputField = ({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: InputFieldProps) => {
  return (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary/55"
      />
    </label>
  );
};

const TextareaField = ({
  label,
  value,
  placeholder,
  rows = 5,
  onChange,
}: TextareaFieldProps) => {
  return (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
        {label}
      </span>

      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary/55"
      />
    </label>
  );
};

const schemaChoices = [
  {
    type: "organization" as SchemaType,
    title: "Organization",
    description: "For your main company, brand, or agency website.",
    icon: Building2,
  },
  {
    type: "localBusiness" as SchemaType,
    title: "Local Business",
    description: "For a business with a public address, phone, and hours.",
    icon: MapPin,
  },
  {
    type: "service" as SchemaType,
    title: "Service",
    description: "For a visible service page with clear details.",
    icon: Settings2,
  },
  {
    type: "faq" as SchemaType,
    title: "FAQ Page",
    description: "For real visible questions and answers on one page.",
    icon: HelpCircle,
  },
  {
    type: "article" as SchemaType,
    title: "Article",
    description: "For blog posts, guides, news, or resource content.",
    icon: FileText,
  },
];

const pageFaqs = [
  {
    question: "What is schema markup?",
    answer:
      "Schema markup is structured information added to a page to help search engines and other systems better understand the page content, such as a business, service, article, or visible FAQ section.",
  },
  {
    question: "Which schema type should I choose first?",
    answer:
      "Choose the type that matches the visible page. Use Organization for a brand page, LocalBusiness for a real local business, Service for a specific service page, BlogPosting for an article, and FAQPage for genuine visible questions and answers.",
  },
  {
    question: "Does valid schema guarantee rich results in Google?",
    answer:
      "No. Valid structured data can help search engines understand a page and may make it eligible for certain search appearances, but no markup guarantees rich-result display.",
  },
  {
    question: "Can I add schema for content that is not visible on the page?",
    answer:
      "No. Schema should match the real visible main content and genuine business details on the page where it is added. Do not use markup for hidden, misleading, or unrelated information.",
  },
  {
    question: "Can I use FAQPage schema for every page?",
    answer:
      "Use FAQPage schema only when the page has meaningful visible questions and answers. Do not create artificial FAQs only to add schema markup.",
  },
  {
    question: "How do I test generated JSON-LD schema?",
    answer:
      "Copy the JSON-LD into the relevant page, then test the page or code using a structured-data validator and relevant rich-result testing tools before publishing it live.",
  },
];

const SchemaMarkupGenerator = () => {
  const [schemaType, setSchemaType] =
    useState<SchemaType>("organization");

  const [form, setForm] = useState<SchemaForm>(initialForm);

  const [faqItems, setFaqItems] = useState<FaqItem[]>([
    {
      id: "faq-1",
      question: "",
      answer: "",
    },
    {
      id: "faq-2",
      question: "",
      answer: "",
    },
  ]);

  const [copyStatus, setCopyStatus] = useState("");

  const updateField = (field: keyof SchemaForm, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const generatedSchema = useMemo(() => {
    const pageUrl = normaliseUrl(form.pageUrl);
    const businessUrl = normaliseUrl(form.businessUrl);
    const logoUrl = normaliseUrl(form.logoUrl);

    if (schemaType === "organization") {
      const organization: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Organization",
      };

      addIfPresent(organization, "name", form.businessName);
      addIfPresent(organization, "url", businessUrl);
      addIfPresent(organization, "logo", logoUrl);
      addIfPresent(organization, "telephone", form.telephone);
      addIfPresent(organization, "email", form.email);

      const socialUrls = splitUrls(form.sameAs);

      if (socialUrls.length) {
        organization.sameAs = socialUrls;
      }

      return organization;
    }

    if (schemaType === "localBusiness") {
      const localBusiness: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": form.localBusinessType.trim() || "LocalBusiness",
      };

      addIfPresent(localBusiness, "name", form.businessName);
      addIfPresent(localBusiness, "url", businessUrl);
      addIfPresent(localBusiness, "logo", logoUrl);
      addIfPresent(localBusiness, "image", normaliseUrl(form.imageUrl));
      addIfPresent(localBusiness, "telephone", form.telephone);
      addIfPresent(localBusiness, "email", form.email);
      addIfPresent(localBusiness, "priceRange", form.priceRange);
      addIfPresent(localBusiness, "openingHours", form.openingHours);

      const socialUrls = splitUrls(form.sameAs);

      if (socialUrls.length) {
        localBusiness.sameAs = socialUrls;
      }

      const address: Record<string, unknown> = {
        "@type": "PostalAddress",
      };

      addIfPresent(address, "streetAddress", form.streetAddress);
      addIfPresent(address, "addressLocality", form.addressLocality);
      addIfPresent(address, "addressRegion", form.addressRegion);
      addIfPresent(address, "postalCode", form.postalCode);
      addIfPresent(address, "addressCountry", form.addressCountry);

      if (Object.keys(address).length > 1) {
        localBusiness.address = address;
      }

      return localBusiness;
    }

    if (schemaType === "service") {
      const service: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Service",
      };

      addIfPresent(service, "name", form.serviceName);
      addIfPresent(service, "serviceType", form.serviceType);
      addIfPresent(service, "description", form.serviceDescription);
      addIfPresent(service, "url", pageUrl);
      addIfPresent(service, "areaServed", form.areaServed);

      const provider: Record<string, unknown> = {
        "@type": "Organization",
      };

      addIfPresent(provider, "name", form.businessName);
      addIfPresent(provider, "url", businessUrl);

      if (Object.keys(provider).length > 1) {
        service.provider = provider;
      }

      return service;
    }

    if (schemaType === "faq") {
      const validFaqItems = faqItems.filter(
        (faq) => faq.question.trim() && faq.answer.trim(),
      );

      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: validFaqItems.map((faq) => ({
          "@type": "Question",
          name: faq.question.trim(),
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer.trim(),
          },
        })),
      };
    }

    const article: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
    };

    addIfPresent(article, "headline", form.articleHeadline);
    addIfPresent(article, "description", form.articleDescription);
    addIfPresent(article, "image", normaliseUrl(form.articleImage));
    addIfPresent(article, "datePublished", form.datePublished);
    addIfPresent(article, "dateModified", form.dateModified);

    if (pageUrl) {
      article.mainEntityOfPage = {
        "@type": "WebPage",
        "@id": pageUrl,
      };
    }

    const author: Record<string, unknown> = {
      "@type": "Person",
    };

    addIfPresent(author, "name", form.authorName);
    addIfPresent(author, "url", normaliseUrl(form.authorUrl));

    if (Object.keys(author).length > 1) {
      article.author = author;
    }

    const publisher: Record<string, unknown> = {
      "@type": "Organization",
    };

    addIfPresent(publisher, "name", form.businessName);

    if (logoUrl) {
      publisher.logo = {
        "@type": "ImageObject",
        url: logoUrl,
      };
    }

    if (Object.keys(publisher).length > 1) {
      article.publisher = publisher;
    }

    return article;
  }, [schemaType, form, faqItems]);

  const jsonOutput = useMemo(() => {
    return JSON.stringify(generatedSchema, null, 2);
  }, [generatedSchema]);

  const validationNotes = useMemo(() => {
    const notes: string[] = [];

    if (schemaType === "organization") {
      if (!form.businessName.trim()) {
        notes.push("Add your organization or business name.");
      }

      if (!form.businessUrl.trim()) {
        notes.push("Add your official business website URL.");
      }
    }

    if (schemaType === "localBusiness") {
      if (!form.businessName.trim()) {
        notes.push("Add the public local business name.");
      }

      if (!form.telephone.trim()) {
        notes.push("Add a public business phone number where appropriate.");
      }

      if (!form.streetAddress.trim() && !form.addressLocality.trim()) {
        notes.push(
          "Add a real address only when it is relevant and publicly visible to customers.",
        );
      }
    }

    if (schemaType === "service") {
      if (!form.serviceName.trim()) {
        notes.push("Add the exact visible service name.");
      }

      if (!form.serviceDescription.trim()) {
        notes.push("Add a useful service description that matches the page.");
      }

      if (!form.pageUrl.trim()) {
        notes.push("Add the full URL of the service page.");
      }
    }

    if (schemaType === "faq") {
      const validFaqCount = faqItems.filter(
        (faq) => faq.question.trim() && faq.answer.trim(),
      ).length;

      if (validFaqCount < 2) {
        notes.push(
          "Add at least two complete visible question-and-answer pairs.",
        );
      }
    }

    if (schemaType === "article") {
      if (!form.articleHeadline.trim()) {
        notes.push("Add the article headline.");
      }

      if (!form.articleDescription.trim()) {
        notes.push("Add an article description matching the visible content.");
      }

      if (!form.pageUrl.trim()) {
        notes.push("Add the article's canonical page URL.");
      }

      if (!form.datePublished) {
        notes.push("Add the original article publication date.");
      }
    }

    return notes;
  }, [schemaType, form, faqItems]);

  useEffect(() => {
    const pageTitle = "Free Schema Markup Generator | RankVelt";

    const pageDescription =
      "Generate JSON-LD schema markup for Organization, LocalBusiness, Service, FAQPage, and Article pages with RankVelt's free schema markup generator.";

    document.title = pageTitle;

    ensureMetaByName("description").content = pageDescription;
    ensureMetaByName("robots").content = "index, follow";
    ensureMetaByName("twitter:title").content = pageTitle;
    ensureMetaByName("twitter:description").content = pageDescription;

    ensureMetaByProperty("og:title").content = pageTitle;
    ensureMetaByProperty("og:description").content = pageDescription;
    ensureMetaByProperty("og:type").content = "website";
    ensureMetaByProperty("og:url").content =
      `${SITE_URL}/tools/schema-markup-generator`;

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = `${SITE_URL}/tools/schema-markup-generator`;
  }, []);

  const handleCopy = async () => {
    try {
      await copyToClipboard(jsonOutput);

      setCopyStatus("JSON-LD schema copied successfully.");

      window.setTimeout(() => {
        setCopyStatus("");
      }, 2000);
    } catch {
      setCopyStatus("Copy failed. Please copy the JSON manually.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonOutput], {
      type: "application/ld+json;charset=utf-8",
    });

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = `rankvelt-${schemaType}-schema.json`;
    link.click();

    URL.revokeObjectURL(objectUrl);
  };

  const handleReset = () => {
    setForm(initialForm);

    setFaqItems([
      {
        id: "faq-1",
        question: "",
        answer: "",
      },
      {
        id: "faq-2",
        question: "",
        answer: "",
      },
    ]);

    setCopyStatus("");
  };

  const updateFaqItem = (
    id: string,
    field: "question" | "answer",
    value: string,
  ) => {
    setFaqItems((currentFaqItems) =>
      currentFaqItems.map((faq) =>
        faq.id === id
          ? {
              ...faq,
              [field]: value,
            }
          : faq,
      ),
    );
  };

  const removeFaqItem = (id: string) => {
    setFaqItems((currentFaqItems) => {
      if (currentFaqItems.length <= 1) {
        return currentFaqItems;
      }

      return currentFaqItems.filter((faq) => faq.id !== id);
    });
  };

  const renderBusinessFields = () => {
    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Business / Organization Name"
            value={form.businessName}
            placeholder="Example: RankVelt"
            onChange={(value) => updateField("businessName", value)}
          />

          <InputField
            label="Business Website URL"
            value={form.businessUrl}
            placeholder="https://example.com"
            onChange={(value) => updateField("businessUrl", value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Logo URL"
            value={form.logoUrl}
            placeholder="https://example.com/logo.png"
            onChange={(value) => updateField("logoUrl", value)}
          />

          <InputField
            label="Social Profile URLs"
            value={form.sameAs}
            placeholder="LinkedIn, Instagram, Facebook URLs"
            onChange={(value) => updateField("sameAs", value)}
          />
        </div>
      </>
    );
  };

  const renderSchemaFields = () => {
    if (schemaType === "organization") {
      return (
        <div className="space-y-4">
          {renderBusinessFields()}

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Public Phone Number"
              value={form.telephone}
              placeholder="+92 300 1234567"
              onChange={(value) => updateField("telephone", value)}
            />

            <InputField
              label="Public Email Address"
              value={form.email}
              placeholder="hello@example.com"
              onChange={(value) => updateField("email", value)}
            />
          </div>
        </div>
      );
    }

    if (schemaType === "localBusiness") {
      return (
        <div className="space-y-4">
          {renderBusinessFields()}

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Business Type"
              value={form.localBusinessType}
              placeholder="LocalBusiness"
              onChange={(value) =>
                updateField("localBusinessType", value)
              }
            />

            <InputField
              label="Price Range"
              value={form.priceRange}
              placeholder="$$"
              onChange={(value) => updateField("priceRange", value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Public Phone Number"
              value={form.telephone}
              placeholder="+92 300 1234567"
              onChange={(value) => updateField("telephone", value)}
            />

            <InputField
              label="Public Email Address"
              value={form.email}
              placeholder="hello@example.com"
              onChange={(value) => updateField("email", value)}
            />
          </div>

          <InputField
            label="Visible Business Image URL"
            value={form.imageUrl}
            placeholder="https://example.com/business-image.jpg"
            onChange={(value) => updateField("imageUrl", value)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Street Address"
              value={form.streetAddress}
              placeholder="123 Main Street"
              onChange={(value) => updateField("streetAddress", value)}
            />

            <InputField
              label="City / Locality"
              value={form.addressLocality}
              placeholder="Lahore"
              onChange={(value) =>
                updateField("addressLocality", value)
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <InputField
              label="Region / State"
              value={form.addressRegion}
              placeholder="Punjab"
              onChange={(value) => updateField("addressRegion", value)}
            />

            <InputField
              label="Postal Code"
              value={form.postalCode}
              placeholder="54000"
              onChange={(value) => updateField("postalCode", value)}
            />

            <InputField
              label="Country"
              value={form.addressCountry}
              placeholder="PK"
              onChange={(value) =>
                updateField("addressCountry", value)
              }
            />
          </div>

          <InputField
            label="Business Hours"
            value={form.openingHours}
            placeholder="Mo-Fr 09:00-17:00"
            onChange={(value) => updateField("openingHours", value)}
          />
        </div>
      );
    }

    if (schemaType === "service") {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Service Name"
              value={form.serviceName}
              placeholder="Local SEO Services"
              onChange={(value) => updateField("serviceName", value)}
            />

            <InputField
              label="Service Type"
              value={form.serviceType}
              placeholder="Search Engine Optimization"
              onChange={(value) => updateField("serviceType", value)}
            />
          </div>

          <InputField
            label="Service Page URL"
            value={form.pageUrl}
            placeholder="https://example.com/local-seo"
            onChange={(value) => updateField("pageUrl", value)}
          />

          <TextareaField
            label="Visible Service Description"
            value={form.serviceDescription}
            placeholder="Describe the actual service visible on this page."
            rows={5}
            onChange={(value) =>
              updateField("serviceDescription", value)
            }
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Provider / Business Name"
              value={form.businessName}
              placeholder="Example: RankVelt"
              onChange={(value) => updateField("businessName", value)}
            />

            <InputField
              label="Provider Website URL"
              value={form.businessUrl}
              placeholder="https://example.com"
              onChange={(value) => updateField("businessUrl", value)}
            />
          </div>

          <InputField
            label="Area Served"
            value={form.areaServed}
            placeholder="Lahore, Pakistan"
            onChange={(value) => updateField("areaServed", value)}
          />
        </div>
      );
    }

    if (schemaType === "faq") {
      return (
        <div className="space-y-5">
          <div className="rounded-2xl border border-primary/25 bg-primary/[0.07] p-4">
            <p className="text-sm leading-relaxed text-white/85">
              Add only real FAQs that are visibly displayed on the page where
              you plan to add this schema.
            </p>
          </div>

          {faqItems.map((faq, index) => (
            <div
              key={faq.id}
              className="rounded-2xl border border-white/[0.1] bg-black/20 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  FAQ {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeFaqItem(faq.id)}
                  disabled={faqItems.length <= 1}
                  className="inline-flex items-center gap-2 text-xs font-black text-red-300 transition-colors hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>

              <div className="mt-4">
                <InputField
                  label="Question"
                  value={faq.question}
                  placeholder="What is Local SEO?"
                  onChange={(value) =>
                    updateFaqItem(faq.id, "question", value)
                  }
                />
              </div>

              <div className="mt-4">
                <TextareaField
                  label="Answer"
                  value={faq.answer}
                  placeholder="Write the visible answer exactly as it appears on the page."
                  rows={4}
                  onChange={(value) =>
                    updateFaqItem(faq.id, "answer", value)
                  }
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setFaqItems((currentFaqItems) => [
                ...currentFaqItems,
                createFaqItem(),
              ])
            }
            className="inline-flex items-center gap-2 rounded-xl border border-primary/35 bg-primary/[0.08] px-4 py-3 text-xs font-black text-primary transition-colors hover:bg-primary/[0.14]"
          >
            <Plus size={15} />
            Add Another FAQ
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <InputField
          label="Article Headline"
          value={form.articleHeadline}
          placeholder="How to Improve Local SEO for Small Businesses"
          onChange={(value) => updateField("articleHeadline", value)}
        />

        <InputField
          label="Article URL"
          value={form.pageUrl}
          placeholder="https://example.com/blog/local-seo-guide"
          onChange={(value) => updateField("pageUrl", value)}
        />

        <TextareaField
          label="Visible Article Description"
          value={form.articleDescription}
          placeholder="Write a useful summary that matches the visible article introduction."
          rows={4}
          onChange={(value) =>
            updateField("articleDescription", value)
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Article Image URL"
            value={form.articleImage}
            placeholder="https://example.com/article-image.jpg"
            onChange={(value) => updateField("articleImage", value)}
          />

          <InputField
            label="Author Name"
            value={form.authorName}
            placeholder="Author name"
            onChange={(value) => updateField("authorName", value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Author URL"
            value={form.authorUrl}
            placeholder="https://example.com/about"
            onChange={(value) => updateField("authorUrl", value)}
          />

          <InputField
            label="Publisher / Business Name"
            value={form.businessName}
            placeholder="Example: RankVelt"
            onChange={(value) => updateField("businessName", value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Date Published"
            value={form.datePublished}
            type="date"
            onChange={(value) => updateField("datePublished", value)}
          />

          <InputField
            label="Date Modified"
            value={form.dateModified}
            type="date"
            onChange={(value) => updateField("dateModified", value)}
          />
        </div>

        <InputField
          label="Publisher Logo URL"
          value={form.logoUrl}
          placeholder="https://example.com/logo.png"
          onChange={(value) => updateField("logoUrl", value)}
        />
      </div>
    );
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
            Free JSON-LD Schema Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Schema Markup{" "}
            <span className="text-gradient-gold">Generator</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            Generate JSON-LD schema for visible Organization, Local Business,
            Service, FAQ, and Article content. Copy the result or download the
            JSON file for implementation on the matching page.
          </p>
        </section>

        <section className="mt-12">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            Select Schema Type
          </p>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Choose the Content You Need to Describe
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {schemaChoices.map((choice) => {
              const Icon = choice.icon;
              const isActive = schemaType === choice.type;

              return (
                <button
                  key={choice.type}
                  type="button"
                  onClick={() => setSchemaType(choice.type)}
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    isActive
                      ? "border-primary/50 bg-primary/[0.1]"
                      : "border-white/[0.1] bg-white/[0.03] hover:border-primary/35 hover:bg-white/[0.05]"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive
                        ? "bg-primary text-black"
                        : "bg-black/30 text-primary"
                    }`}
                  >
                    <Icon size={19} />
                  </span>

                  <h3 className="mt-5 text-lg font-black text-white">
                    {choice.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-white/75">
                    {choice.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-12 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ClipboardCheck size={21} />
              </span>

              <div>
                <h2 className="text-2xl font-black text-white">
                  Add Visible Page Details
                </h2>

                <p className="mt-1 text-sm text-white/75">
                  Only enter information that is real and visible on the page.
                </p>
              </div>
            </div>

            <div className="mt-7">{renderSchemaFields()}</div>
          </article>

          <aside className="rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Generated JSON-LD
                </p>

                <h2 className="mt-3 text-2xl font-black text-white">
                  Ready for Review
                </h2>
              </div>

              <Code2 className="text-primary" size={23} />
            </div>

            <textarea
              readOnly
              value={jsonOutput}
              spellCheck={false}
              aria-label="Generated JSON-LD schema"
              className="mt-7 min-h-[430px] w-full resize-y rounded-2xl border border-white/[0.12] bg-[#080808] p-5 font-mono text-xs leading-relaxed text-emerald-200 outline-none"
            />

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02]"
              >
                <Copy size={15} />
                Copy JSON-LD
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
              >
                <Download size={15} />
                Download JSON
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-black text-white transition-colors hover:border-red-400/45 hover:text-red-300"
              >
                <RefreshCcw size={15} />
                Reset
              </button>
            </div>

            {copyStatus && (
              <p className="mt-4 text-sm font-semibold text-emerald-300">
                {copyStatus}
              </p>
            )}

            <div className="mt-8 rounded-2xl border border-white/[0.1] bg-black/25 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Before You Publish
              </p>

              {validationNotes.length ? (
                <ul className="mt-4 space-y-3">
                  {validationNotes.map((note) => (
                    <li
                      key={note}
                      className="flex items-start gap-3 text-sm leading-relaxed text-white/80"
                    >
                      <Search
                        size={16}
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-emerald-200">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-emerald-300"
                  />
                  Your inputs look complete. Confirm every detail matches the
                  visible page before implementation.
                </p>
              )}
            </div>
          </aside>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
            <Globe2 className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Match the Page
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Add generated JSON-LD only to the page that contains the exact
              business, service, article, or FAQ details being described.
            </p>
          </article>

          <article className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-6">
            <CheckCircle2 className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Validate Before Launch
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Test generated markup after implementation. Fix syntax errors,
              missing properties, and content mismatches before relying on it.
            </p>
          </article>

          <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
            <HelpCircle className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              No Display Promise
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Correct structured data can improve machine understanding, but
              search-result features are always decided by search engines.
            </p>
          </article>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Schema Markup FAQs
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Questions Before You Implement
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
                Continue Your SEO Work
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Schema Is One Part of Better SEO
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Strong organic visibility also needs useful content, clean page
                structure, technical SEO, internal linking, and clear
                conversion paths for real visitors.
              </p>
            </div>

            <Link
              to="/strategy-call?package=SEO%20Opportunity%20Check"
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
                Local SEO
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Improve local service pages, Google Maps visibility, business
                information, and qualified customer enquiries.
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
                Improve service-page relevance, technical SEO, content
                structure, and organic lead-generation pathways.
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

export default SchemaMarkupGenerator;