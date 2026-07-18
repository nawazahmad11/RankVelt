import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

import { blogPosts } from "@/data/blogData";

const getExcerpt = (content?: string) => {
  if (!content) {
    return "Explore practical SEO, website growth, eCommerce, and conversion-focused insights from RankVelt.";
  }

  const plainText = content
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return `${plainText.slice(0, 145).trim()}...`;
};

const BlogSection = () => {
  const featuredBlogs = blogPosts.slice(0, 3);

  return (
    <section
      id="blog"
      className="relative overflow-hidden bg-black/10 py-24"
    >
      <div className="section-container relative z-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="text-left">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-primary">
              RankVelt Insights
            </p>

            <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
              SEO, eCommerce &{" "}
              <span className="text-gradient-gold">Website Growth</span>
            </h2>

            <p className="max-w-2xl text-lg font-light leading-relaxed text-white/60">
              Practical articles on search visibility, Shopify performance,
              conversion-focused design, website structure, and stronger growth
              foundations.
            </p>
          </div>

          <Link
            to="/blog"
            className="group flex items-center gap-2 rounded-full border border-primary/40 px-6 py-2 text-sm font-bold text-primary no-underline transition-all hover:bg-primary/10"
          >
            View All Insights
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid overflow-hidden rounded-3xl border border-white/5 shadow-2xl md:grid-cols-3">
          {featuredBlogs.map((blog, index) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.id}`}
              className="group block no-underline"
            >
              <motion.article
                whileHover={{ backgroundColor: "rgba(255,255,255,0.025)" }}
                className={`flex h-full flex-col p-8 transition-colors ${
                  index !== featuredBlogs.length - 1
                    ? "border-b border-white/5 md:border-b-0 md:border-r"
                    : ""
                }`}
              >
                <div className="group-card relative mb-6 aspect-video overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={blog.image}
                    alt={blog.title}
                   
                    decoding="async"
                    className="h-full w-full object-cover grayscale-[25%] transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                   loading="lazy"/>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-primary backdrop-blur-md">
                    {blog.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-white/40">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={12} />
                    {blog.date}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} />
                    {blog.readTime || "8 min read"}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-black leading-tight text-white transition-colors group-hover:text-primary">
                  {blog.title}
                </h3>

                <p className="mb-6 mt-4 flex-1 text-sm font-light leading-relaxed text-white/60">
                  {getExcerpt(blog.content)}
                </p>

                <span className="inline-flex items-center gap-2 text-sm font-black text-primary">
                  Read Insight
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;