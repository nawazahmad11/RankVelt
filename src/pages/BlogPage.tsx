import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { blogPosts } from "../data/blogData";

const SITE_URL = "https://rankvelt.com";

const getExcerpt = (content?: string) => {
  if (!content) {
    return "Explore RankVelt insights on SEO, website growth, eCommerce performance, and conversion-focused page structure.";
  }

  const plainText = content
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return `${plainText.slice(0, 170).trim()}...`;
};

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content");

    document.title = "RankVelt Insights | SEO, eCommerce & Website Growth";

    let descriptionElement = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;

    if (!descriptionElement) {
      descriptionElement = document.createElement("meta");
      descriptionElement.name = "description";
      document.head.appendChild(descriptionElement);
    }

    descriptionElement.content =
      "Practical insights from RankVelt on SEO, eCommerce growth, Shopify performance, website structure, conversion-focused design, and search visibility.";

    const schemaId = "rankvelt-blog-schema";
    document.getElementById(schemaId)?.remove();

    const schemaScript = document.createElement("script");
    schemaScript.id = schemaId;
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "RankVelt Insights",
      url: `${SITE_URL}/blog`,
      description:
        "SEO, eCommerce, website growth, technical SEO, and conversion-focused design insights from RankVelt.",
      publisher: {
        "@type": "Organization",
        name: "RankVelt",
        url: SITE_URL,
      },
    });

    document.head.appendChild(schemaScript);

    return () => {
      document.title = previousTitle;

      if (descriptionElement && previousDescription) {
        descriptionElement.content = previousDescription;
      }

      schemaScript.remove();
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(blogPosts.map((post) => post.category?.toUpperCase() || "SEO")),
    );

    return ["ALL", ...uniqueCategories];
  }, []);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return blogPosts.filter((post) => {
      const searchableContent = [
        post.title,
        post.category,
        post.author,
        post.content,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableContent.includes(query);

      const matchesCategory =
        selectedCategory === "ALL" ||
        post.category?.toUpperCase() === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-32 text-white selection:bg-[#f9a825] selection:text-black">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[#f9a825]/8 blur-[150px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[450px] w-[450px] rounded-full bg-purple-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <section className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              <Sparkles size={12} className="text-[#f9a825]" />

              <span className="text-[10px] font-black uppercase tracking-widest text-white/55">
                RankVelt Insights
              </span>
            </div>

            <h1 className="text-5xl font-black leading-[0.88] tracking-[-0.06em] text-white md:text-7xl">
              SEO, eCommerce
              <br />
              <span className="bg-gradient-to-r from-[#f9a825] to-[#ffe066] bg-clip-text text-transparent">
                & Website Growth.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/60">
              Practical insights for local businesses, eCommerce brands, and
              growing companies that want clearer website strategy, stronger
              search visibility, and better conversion pathways.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl sm:p-7">
            <label
              htmlFor="article-search"
              className="mb-3 block text-[11px] font-black uppercase tracking-[0.2em] text-white/45"
            >
              Search RankVelt Insights
            </label>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />

              <input
                id="article-search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Try Shopify SEO, conversion rate, website redesign..."
                className="w-full rounded-2xl border border-white/10 bg-black/25 py-4 pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#f9a825]/50"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 transition-colors hover:text-[#f9a825]"
                  aria-label="Clear article search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                      isActive
                        ? "border-[#f9a825]/50 bg-[#f9a825]/10 text-[#f9a825]"
                        : "border-white/10 bg-white/[0.02] text-white/45 hover:border-white/25 hover:text-white/70"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-16">
          {featuredPost ? (
            <Link
              to={`/blog/${featuredPost.id}`}
              className="group grid overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025] transition-all hover:border-[#f9a825]/35 hover:bg-white/[0.04] md:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="relative min-h-[300px] overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  loading="eager"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover grayscale-[20%] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#080808]" />

                <span className="absolute bottom-6 left-6 rounded-full border border-[#f9a825]/30 bg-black/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#f9a825] backdrop-blur-md">
                  Featured Insight
                </span>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10">
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                  <span>{featuredPost.category}</span>
                  <span className="h-1 w-1 rounded-full bg-[#f9a825]" />
                  <span>{featuredPost.date}</span>
                  <span className="h-1 w-1 rounded-full bg-[#f9a825]" />
                  <span>{featuredPost.readTime || "8 min read"}</span>
                </div>

                <h2 className="mt-6 text-3xl font-black leading-[1.03] tracking-tight text-white sm:text-4xl">
                  {featuredPost.title}
                </h2>

                <p className="mt-5 leading-relaxed text-white/60">
                  {getExcerpt(featuredPost.content)}
                </p>

                <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#f9a825]">
                  Read the full insight
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ) : (
            <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] px-6 py-20 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-primary" />

              <h2 className="mt-5 text-2xl font-black text-white">
                No articles matched that search.
              </h2>

              <p className="mx-auto mt-3 max-w-md text-white/55">
                Try a broader term, remove a filter, or explore the available
                RankVelt insights below.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                }}
                className="mt-6 rounded-xl border border-primary/30 px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {remainingPosts.length > 0 && (
          <section className="mt-16">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f9a825]">
                  More Insights
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  Explore the Latest Articles
                </h2>
              </div>

              <p className="text-sm text-white/45">
                {filteredPosts.length} article
                {filteredPosts.length !== 1 ? "s" : ""} available
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remainingPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    to={`/blog/${post.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] transition-all hover:-translate-y-1 hover:border-[#f9a825]/35 hover:bg-white/[0.04]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover grayscale-[25%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                      <span className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#f9a825] backdrop-blur-md">
                        {post.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-white/40">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={12} />
                          {post.date}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={12} />
                          {post.readTime || "8 min read"}
                        </span>
                      </div>

                      <h3 className="mt-5 text-2xl font-black leading-tight text-white transition-colors group-hover:text-[#f9a825]">
                        {post.title}
                      </h3>

                      <p className="mt-4 flex-1 text-sm leading-relaxed text-white/60">
                        {getExcerpt(post.content)}
                      </p>

                      <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#f9a825]">
                        Read article
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20 grid gap-4 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 md:grid-cols-3 md:p-8">
          {[
            {
              title: "Local SEO",
              description:
                "Build stronger local visibility, service-area relevance, and qualified enquiries.",
              path: "/local-seo",
            },
            {
              title: "eCommerce SEO",
              description:
                "Improve Shopify discovery through collection, product, and technical SEO.",
              path: "/ecommerce-seo",
            },
            {
              title: "Business SEO",
              description:
                "Create stronger service pages, technical foundations, and lead-generation pathways.",
              path: "/business-seo",
            },
          ].map((service) => (
            <Link
              key={service.path}
              to={service.path}
              className="group rounded-2xl border border-white/[0.07] bg-black/20 p-5 transition-all hover:border-[#f9a825]/35 hover:bg-[#f9a825]/[0.04]"
            >
              <h2 className="text-xl font-black text-white group-hover:text-[#f9a825]">
                {service.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {service.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#f9a825]">
                Explore service
                <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
};

export default BlogPage;