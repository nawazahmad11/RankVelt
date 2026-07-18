import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Share2,
  User,
} from "lucide-react";

import { blogPosts } from "../data/blogData";

const SITE_URL = "https://rankvelt.com";

interface TOCItem {
  id: string;
  title: string;
  level?: number;
}

const getPlainText = (content?: string) => {
  if (!content) {
    return "";
  }

  return content
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const createFallbackDescription = (content?: string) => {
  const text = getPlainText(content);

  if (!text) {
    return "Read practical RankVelt insights on SEO, website structure, eCommerce growth, and search visibility.";
  }

  const shortened = text.slice(0, 155).trim();
  const lastSpace = shortened.lastIndexOf(" ");

  return lastSpace > 120
    ? `${shortened.slice(0, lastSpace)}…`
    : `${shortened}…`;
};

const getAbsoluteUrl = (path?: string) => {
  if (!path) {
    return SITE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const BlogPostDetail = () => {
  const { id } = useParams();

  const post = blogPosts.find((item) => item.id === id);

  const [activeId, setActiveId] = useState("");
  const [shareLabel, setShareLabel] = useState("Share");

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const articleDescription = useMemo(() => {
    if (!post) {
      return "";
    }

    return post.metaDescription || createFallbackDescription(post.content);
  }, [post]);

  const articleSummary = useMemo(() => {
    if (!post) {
      return "";
    }

    return (
      post.excerpt ||
      getPlainText(post.content).slice(0, 280).trim()
    );
  }, [post]);

  const relatedPosts = useMemo(() => {
    if (!post) {
      return [];
    }

    const manuallySelected = (post.relatedPostIds || [])
      .map((relatedId) =>
        blogPosts.find((item) => item.id === relatedId),
      )
      .filter(
        (
          item,
        ): item is (typeof blogPosts)[number] => Boolean(item),
      );

    const sameCategory = blogPosts.filter(
      (item) =>
        item.id !== post.id &&
        item.category?.toUpperCase() === post.category?.toUpperCase() &&
        !manuallySelected.some(
          (selectedItem) => selectedItem.id === item.id,
        ),
    );

    const remainingPosts = blogPosts.filter(
      (item) =>
        item.id !== post.id &&
        !manuallySelected.some(
          (selectedItem) => selectedItem.id === item.id,
        ) &&
        !sameCategory.some(
          (sameCategoryItem) => sameCategoryItem.id === item.id,
        ),
    );

    return [
      ...manuallySelected,
      ...sameCategory,
      ...remainingPosts,
    ].slice(0, 3);
  }, [post]);

  useEffect(() => {
    if (!post) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -62% 0%",
        threshold: 0.1,
      },
    );

    const headings = document.querySelectorAll(
      "#article-content h2[id], #article-content h3[id]",
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      observer.disconnect();
    };
  }, [post]);

  useEffect(() => {
    if (!post) {
      return;
    }

    const articleUrl = `${SITE_URL}/blog/${post.id}`;
    const imageUrl = getAbsoluteUrl(post.image);

    const seoTitle =
      post.seoTitle || `${post.title} | RankVelt Insights`;

    const socialTitle = post.ogTitle || post.title;

    const socialDescription =
      post.socialDescription || articleDescription;

    const cleanupFunctions: Array<() => void> = [];

    const updateMeta = (
      attribute: "name" | "property",
      key: string,
      content: string,
    ) => {
      let element = document.querySelector(
        `meta[${attribute}="${key}"]`,
      ) as HTMLMetaElement | null;

      const wasCreated = !element;

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      const previousContent = element.getAttribute("content");

      element.setAttribute("content", content);

      cleanupFunctions.push(() => {
        if (!element) {
          return;
        }

        if (wasCreated) {
          element.remove();
          return;
        }

        if (previousContent === null) {
          element.removeAttribute("content");
        } else {
          element.setAttribute("content", previousContent);
        }
      });
    };

    const previousTitle = document.title;
    document.title = seoTitle;

    cleanupFunctions.push(() => {
      document.title = previousTitle;
    });

    updateMeta("name", "description", articleDescription);
    updateMeta("name", "robots", "index, follow, max-image-preview:large");

    updateMeta("property", "og:type", "article");
    updateMeta("property", "og:site_name", "RankVelt");
    updateMeta("property", "og:title", socialTitle);
    updateMeta("property", "og:description", socialDescription);
    updateMeta("property", "og:url", articleUrl);
    updateMeta("property", "og:image", imageUrl);
    updateMeta(
      "property",
      "og:image:alt",
      post.imageAlt || post.title,
    );

    updateMeta("name", "twitter:card", "summary_large_image");
    updateMeta("name", "twitter:title", socialTitle);
    updateMeta(
      "name",
      "twitter:description",
      socialDescription,
    );
    updateMeta("name", "twitter:image", imageUrl);
    updateMeta(
      "name",
      "twitter:image:alt",
      post.imageAlt || post.title,
    );

    let canonicalElement = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    const canonicalWasCreated = !canonicalElement;

    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.rel = "canonical";
      document.head.appendChild(canonicalElement);
    }

    const previousCanonical =
      canonicalElement.getAttribute("href");

    canonicalElement.href = articleUrl;

    cleanupFunctions.push(() => {
      if (!canonicalElement) {
        return;
      }

      if (canonicalWasCreated) {
        canonicalElement.remove();
        return;
      }

      if (previousCanonical === null) {
        canonicalElement.removeAttribute("href");
      } else {
        canonicalElement.href = previousCanonical;
      }
    });

    const schemaId = "rankvelt-blog-post-schema";

    document.getElementById(schemaId)?.remove();

    const parsedFallbackDate = new Date(post.date);

    const fallbackDate = Number.isNaN(
      parsedFallbackDate.getTime(),
    )
      ? undefined
      : parsedFallbackDate.toISOString();

    const datePublished =
      post.datePublished || fallbackDate;

    const dateModified =
      post.dateModified ||
      post.datePublished ||
      fallbackDate;

    const schemaGraph: Record<string, unknown>[] = [
      {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        headline: post.title,
        description: articleDescription,
        image: {
          "@type": "ImageObject",
          url: imageUrl,
          caption: post.imageAlt || post.title,
        },
        url: articleUrl,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
        datePublished,
        dateModified,
        author: {
          "@type": post.authorType || "Organization",
          name: post.author || "RankVelt Editorial Team",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "RankVelt",
          url: SITE_URL,
        },
        articleSection: post.category,
        inLanguage: "en",
        isAccessibleForFree: true,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "RankVelt Insights",
            item: `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: articleUrl,
          },
        ],
      },
    ];

    if (post.faqItems?.length) {
      schemaGraph.push({
        "@type": "FAQPage",
        "@id": `${articleUrl}#faq`,
        mainEntity: post.faqItems.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    }

    if (post.howTo?.steps?.length) {
      schemaGraph.push({
        "@type": "HowTo",
        "@id": `${articleUrl}#howto`,
        name: post.howTo.name,
        description: post.howTo.description,
        totalTime: post.howTo.totalTime,
        step: post.howTo.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.name,
          text: step.text,
        })),
      });
    }

    const schemaScript = document.createElement("script");

    schemaScript.id = schemaId;
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schemaGraph,
    });

    document.head.appendChild(schemaScript);

    cleanupFunctions.push(() => {
      schemaScript.remove();
    });

    return () => {
      cleanupFunctions.reverse().forEach((cleanup) => {
        cleanup();
      });
    };
  }, [articleDescription, post]);

  const handleShare = async () => {
    if (!post) {
      return;
    }

    const url = `${window.location.origin}/blog/${post.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text:
            post.socialDescription ||
            `Read this RankVelt insight: ${post.title}`,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);
      setShareLabel("Link copied");

      window.setTimeout(() => {
        setShareLabel("Share");
      }, 2200);
    } catch (error) {
      console.error("Article share action failed:", error);
    }
  };

  const scrollToHeading = (headingId: string) => {
    document.getElementById(headingId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!post) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 pb-24 pt-40 text-center text-white">
        <BookOpen className="mx-auto h-12 w-12 text-[#f9a825]" />

        <h1 className="mt-6 text-3xl font-black">
          Article Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-white/60">
          The article you are looking for may have moved or is
          not currently available.
        </p>

        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#f9a825]/30 px-5 py-3 text-sm font-bold text-[#f9a825] transition-colors hover:bg-[#f9a825]/10"
        >
          <ArrowLeft size={16} />
          Back to RankVelt Insights
        </Link>
      </main>
    );
  }

  const tocItems = (post.toc || []) as TOCItem[];

  const defaultService = {
    title: "Business SEO",
    description:
      "Build stronger service pages, technical foundations, structured content, and organic lead-generation pathways.",
    path: "/business-seo",
  };

  const primaryService =
    post.primaryService || defaultService;

  return (
    <main className="min-h-screen bg-[#050505] pb-24 text-white selection:bg-[#f9a825] selection:text-black">
      <motion.div
        className="fixed left-0 right-0 top-0 z-[120] h-1 origin-left bg-[#f9a825]"
        style={{ scaleX }}
      />

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-white/40"
        >
          <Link
            to="/"
            className="transition-colors hover:text-[#f9a825]"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/blog"
            className="transition-colors hover:text-[#f9a825]"
          >
            Insights
          </Link>

          <span>/</span>

          <span className="text-white/65">
            {post.category || "SEO"}
          </span>
        </nav>

        <Link
          to="/blog"
          className="group mb-10 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 transition-all hover:text-[#f9a825]"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to RankVelt Insights
        </Link>

        <header className="max-w-5xl">
          <span className="mb-6 block text-[10px] font-black uppercase tracking-[0.25em] text-[#f9a825]">
            {post.category || "SEO Insight"}
          </span>

          <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.045em] text-white md:text-6xl">
            {post.title}
          </h1>

          {articleSummary && (
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-white/70">
              {articleSummary}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 border-y border-white/10 py-6 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
            <span className="flex items-center gap-2">
              <Calendar
                size={14}
                className="text-[#f9a825]"
              />
              {post.date}
            </span>

            <span className="flex items-center gap-2">
              <User
                size={14}
                className="text-[#f9a825]"
              />
              By {post.author || "RankVelt Editorial Team"}
            </span>

            <span className="flex items-center gap-2">
              <Clock
                size={14}
                className="text-[#f9a825]"
              />
              {post.readTime || "8 min read"}
            </span>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-white/50 transition-colors hover:text-[#f9a825] sm:ml-auto"
            >
              <Share2 size={14} />
              {shareLabel}
            </button>
          </div>
        </header>

        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl md:aspect-[21/7] md:rounded-[2rem]">
          <img
            src={post.image}
            alt={post.imageAlt || post.title}
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-cover opacity-85 transition-opacity duration-700 hover:opacity-100"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {post.keyTakeaways &&
          post.keyTakeaways.length > 0 && (
            <section className="mt-10 rounded-2xl border border-[#f9a825]/20 bg-[#f9a825]/[0.05] p-6 md:p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f9a825]">
                Key Takeaways
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {post.keyTakeaways.map((takeaway) => (
                  <div
                    key={takeaway}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-[#f9a825]"
                    />

                    <p className="text-sm leading-relaxed text-white/75">
                      {takeaway}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        <div className="relative mt-14 flex flex-col gap-14 lg:flex-row">
          <article
            id="article-content"
            className="custom-content-styles min-w-0 flex-1 overflow-hidden text-left"
          >
            <div
              className="blog-rich-text"
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            />

            {post.showStandardCta !== false && (
              <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.025] p-7 md:p-9">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f9a825]">
                  Need Help Applying This?
                </p>

                <h2 className="mt-4 text-3xl font-black text-white">
                  Turn Website Insights Into a Practical Growth Plan
                </h2>

                <p className="mt-5 max-w-2xl leading-relaxed text-white/65">
                  RankVelt helps businesses connect search
                  visibility, technical SEO, website structure,
                  and conversion-focused design.
                </p>

                <Link
                  to="/strategy-call?package=SEO%20Content%20%26%20Website%20Review"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#f9a825] px-7 py-4 text-base font-black transition-transform hover:scale-[1.02] md:text-lg"
                  style={{
                    color: "#000000",
                    textDecoration: "none",
                  }}
                >
                  Request a Strategy Call

                  <ArrowRight
                    size={18}
                    color="#000000"
                  />
                </Link>
              </section>
            )}
          </article>

          <aside className="shrink-0 lg:w-80">
            <div className="space-y-7 lg:sticky lg:top-28">
              {tocItems.length > 0 && (
                <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f9a825]">
                    On This Page
                  </h2>

                  <nav className="mt-5 flex flex-col border-l border-white/10">
                    {tocItems.map((item) => {
                      const isActive =
                        activeId === item.id;

                      const isNested =
                        item.level === 3;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            scrollToHeading(item.id)
                          }
                          className={`border-l-2 py-2 text-left text-[11px] font-bold leading-relaxed transition-all ${isNested ? "pl-7" : "pl-4"
                            } ${isActive
                              ? "-ml-[1px] border-[#f9a825] bg-[#f9a825]/5 text-[#f9a825]"
                              : "border-transparent text-white/45 hover:text-white/80"
                            }`}
                        >
                          {item.title}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              )}

              {post.showStandardCta !== false && (
                <div className="rounded-2xl border border-[#f9a825]/20 bg-[#f9a825]/[0.05] p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f9a825]">
                    Related Service
                  </p>

                  <h2 className="mt-4 text-2xl font-black text-white">
                    {primaryService.title}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    {primaryService.description}
                  </p>

                  <Link
                    to={primaryService.path}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#f9a825]"
                  >
                    Explore service
                    <ExternalLink size={15} />
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>

        {relatedPosts.length > 0 && (
          <section className="mt-20 border-t border-white/10 pt-14">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f9a825]">
                  Continue Reading
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  Related RankVelt Insights
                </h2>
              </div>

              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-black text-[#f9a825]"
              >
                View all insights
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-all hover:border-[#f9a825]/35 hover:bg-white/[0.04]"
                >
                  <div className="flex h-full flex-col">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={
                          relatedPost.imageAlt ||
                          relatedPost.title
                        }
                        loading="lazy"
                        className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#f9a825]">
                        {relatedPost.category}
                      </p>

                      <h3 className="mt-3 text-xl font-black leading-tight text-white">
                        {relatedPost.title}
                      </h3>

                      <p className="mt-4 text-xs leading-relaxed text-white/55">
                        {relatedPost.date} ·{" "}
                        {relatedPost.readTime}
                      </p>

                      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-black text-[#f9a825]">
                        Read article
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .custom-content-styles {
          font-size: 1rem;
        }

        .custom-content-styles p {
          margin-bottom: 1.3rem;
          color: rgba(255, 255, 255, 0.72);
          font-size: 1.05rem;
          line-height: 1.82;
        }

        .custom-content-styles h2 {
          margin-top: 4rem;
          margin-bottom: 1.25rem;
          color: #ffffff;
          font-size: clamp(1.75rem, 3vw, 2.4rem);
          font-weight: 900;
          line-height: 1.12;
          letter-spacing: -0.035em;
          scroll-margin-top: 110px;
        }

        .custom-content-styles h3 {
          margin-top: 2.5rem;
          margin-bottom: 0.9rem;
          color: #ffffff;
          font-size: clamp(1.2rem, 2vw, 1.5rem);
          font-weight: 850;
          line-height: 1.3;
          scroll-margin-top: 110px;
        }

        .custom-content-styles strong {
          color: #ffffff;
          font-weight: 800;
        }

        .custom-content-styles .blog-rich-text a {
          color: #f9a825;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
        }

        .custom-content-styles ul,
        .custom-content-styles ol {
          margin: 0 0 2rem;
          padding-left: 1.5rem;
        }

        .custom-content-styles ul {
          list-style: disc;
        }

        .custom-content-styles ol {
          list-style: decimal;
        }

        .custom-content-styles li {
          margin-bottom: 0.85rem;
          padding-left: 0.25rem;
          color: rgba(255, 255, 255, 0.72);
          font-size: 1.02rem;
          line-height: 1.7;
        }

        .custom-content-styles table {
          display: block;
          width: 100%;
          margin: 2.75rem 0;
          overflow-x: auto;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-collapse: collapse;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.02);
          white-space: normal;
        }

        .custom-content-styles thead,
        .custom-content-styles tbody,
        .custom-content-styles tr {
          width: 100%;
        }

        .custom-content-styles th {
          min-width: 155px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(249, 168, 37, 0.07);
          padding: 1rem;
          color: #f9a825;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-align: left;
          text-transform: uppercase;
        }

        .custom-content-styles td {
          min-width: 155px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 1rem;
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.94rem;
          line-height: 1.6;
          vertical-align: top;
        }

        .custom-content-styles tr:last-child td {
          border-bottom: 0;
        }

        .custom-content-styles details {
          margin-top: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.025);
          padding: 1rem 1.25rem;
        }

        .custom-content-styles summary {
          cursor: pointer;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 800;
          line-height: 1.45;
        }

        .custom-content-styles details p {
          margin-top: 1rem;
          margin-bottom: 0;
        }

        .custom-content-styles .article-updated {
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.55);
          font-size: 0.88rem;
        }

        .custom-content-styles .standalone-line {
          margin: 1.75rem 0;
          color: #ffffff;
          font-size: 1.15rem;
          font-weight: 850;
          line-height: 1.5;
        }

        .custom-content-styles .answer-box {
          margin: 2rem 0;
          border-left: 3px solid #f9a825;
          border-radius: 0.75rem;
          background: rgba(249, 168, 37, 0.055);
          padding: 1.25rem 1.4rem;
        }

        .custom-content-styles .answer-box p {
          margin: 0;
          color: rgba(255, 255, 255, 0.82);
        }

        .custom-content-styles .source-note {
          margin: 2rem 0;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 0.9rem;
          background: rgba(255, 255, 255, 0.025);
          padding: 1rem 1.15rem;
          font-size: 0.94rem;
        }

        .custom-content-styles .layer-diagram {
          display: flex;
          max-width: 680px;
          margin: 2.75rem auto;
          flex-direction: column;
          gap: 0.7rem;
        }

        .custom-content-styles .layer {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(249, 168, 37, 0.22);
          border-radius: 0.85rem;
          background: rgba(249, 168, 37, 0.04);
          padding: 1rem;
          text-align: center;
        }

        .custom-content-styles .layer span {
          color: #f9a825;
          font-size: 1rem;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .custom-content-styles .layer small {
          margin-top: 0.25rem;
          color: rgba(255, 255, 255, 0.62);
          font-size: 0.8rem;
          line-height: 1.45;
        }

        .custom-content-styles .layer-geo {
          width: 72%;
          margin: 0 auto;
        }

        .custom-content-styles .layer-aeo {
          width: 86%;
          margin: 0 auto;
        }

        .custom-content-styles .layer-seo {
          width: 100%;
        }

        @media (max-width: 640px) {
          .custom-content-styles p {
            font-size: 1rem;
            line-height: 1.75;
          }

          .custom-content-styles li {
            font-size: 0.98rem;
          }

          .custom-content-styles th,
          .custom-content-styles td {
            min-width: 145px;
          }

          .custom-content-styles .layer-geo {
            width: 84%;
          }

          .custom-content-styles .layer-aeo {
            width: 92%;
          }
        }
      `}</style>
    </main>
  );
};

export default BlogPostDetail;