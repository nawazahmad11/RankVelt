import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"; // Link import kiya

const blogs = [
  {
    id: "why-shopify-stores-fail",
    title: "Why Most Shopify Stores Fail After Launch (And How to Fix Yours)",
    excerpt: "95% of Shopify stores fail. Master the audits and conversion hacks used by top brands to fix funnel and maximize ROI.",
    date: "April 5, 2026",
    image: "/shopify-store-failure-reasons.webp",
  },
  {
    id: "high-converting-product-pages",
    title: "The Brutal Truth About Shopify Conversion Rates",
    excerpt: "Stop wasting ads on a broken store. Fix your conversion leaks and double your revenue with our Shopify 2.0 UI/UX secrets.",
    date: "April 13, 2026",
    image: "/shopify-conversion-rates.webp",
  },
  {
    id: "shopify-redesign-signs-2026",
    title: "7 Signs Your Shopify Store Needs a Redesign (2026 Edition)",
    excerpt: "Is your store stuck in 2022? Spot the 7 red flags killing your sales and learn how a 2026 redesign scales Customer LTV.",
    date: "April 14, 2026",
    image: "/shopify-store-redesign-signs.webp",
  }
];

const BlogSection = () => {
  // useNavigate ki ab zaroorat nahi hai yahan

  return (
    <section id="blog" className="py-24 bg-black/10 relative overflow-hidden">
      <div className="section-container relative z-10">
        
        {/* Header Portion */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Recent <span className="text-gradient-gold">Blog Posts</span>
            </h2>
            <p className="text-white/60 text-lg font-light">
              Latest insights on Shopify development and e-commerce scaling.
            </p>
          </div>
          
          {/* ✅ Fixed: Link for Right Click Support */}
          <Link 
            to="/blog" 
            className="px-6 py-2 border border-primary/40 text-primary rounded-full text-sm font-bold flex items-center gap-2 hover:bg-primary/10 transition-all group no-underline"
          >
            View all posts <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          {blogs.map((blog, i) => (
            /* ✅ Fixed: Wrapped entire card in Link for Right Click functionality */
            <Link 
              key={i} 
              to={`/blog/${blog.id}`} 
              className="no-underline block group"
            >
              <motion.div 
                whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                className={`p-8 h-full flex flex-col border-white/5 ${i !== blogs.length - 1 ? 'md:border-r' : ''} border-b md:border-b-0 transition-colors`}
              >
                <div className="aspect-video rounded-xl overflow-hidden mb-6 border border-white/10 relative group-card">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110" 
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2 select-none">
                {blog.title}
                  
                </h3>
                <p className="text-white/60 text-sm font-light mb-6 flex-1 line-clamp-3">
                  {blog.excerpt}
                </p>
                <div className="text-[10px] text-white/40 font-black uppercase tracking-widest border-t border-white/5 pt-4 flex justify-between items-center">
                  <span>{blog.date}</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BlogSection;