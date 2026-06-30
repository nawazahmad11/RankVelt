import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User, ArrowRight, Share2, Linkedin, Twitter, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

// 1. Blog Data Object
const blogContent: any = {
  "shopify-speed-secrets": {
    title: "Shopify Speed Secrets: How to Hit a 90+ Score in 2024",
    date: "March 15, 2024",
    readTime: "6 min read",
    image: "/blog-1.jpg", // Aapki post image
    tags: ["Development", "Performance"],
    content: `
      <h3 id="liquid">1. Liquid Code Optimization</h3>
      <p>Having a fast store isn't just a luxury; it's a necessity for conversion. Google PageSpeed scores directly impact your ranking and your customer's trust.</p>
      <p>The first step is to remove unnecessary loops and unused apps that inject heavy scripts into your theme.liquid file.</p>
      <h3 id="images">2. Image Next-Gen Formats</h3>
      <p>Always use WebP format. Shopify handles this automatically in many cases, but you need to ensure your Liquid tags are using the latest filters.</p>
    `,
    toc: [
      { id: "liquid", title: "Liquid Optimization" },
      { id: "images", title: "Next-Gen Images" }
    ]
  }
};

// 2. Related Blogs Data (Read More Section)
const relatedBlogs = [
  { 
    id: "high-converting-funnels", 
    title: "The Psychology of High-Converting Shopify Funnels", 
    image: "/blog-2.jpg",
    date: "March 10, 2024"
  },
  { 
    id: "marketing-automation", 
    title: "Marketing Automation: Set Your Sales on Autopilot", 
    image: "/blog-3.jpg",
    date: "March 05, 2024"
  }
];

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogContent[id || "shopify-speed-secrets"];
  
  const [activeId, setActiveId] = useState("");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "0% 0% -80% 0%" } 
    );
    blog?.toc?.forEach((item: any) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [blog]);

  if (!blog) return <div className="text-white text-center py-20 font-black uppercase">Post Not Found.</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black">
      {/* Reading Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[70] origin-left" style={{ scaleX }} />

      {/* --- HERO SECTION WITH BG IMAGE --- */}
      <div className="relative min-h-[65vh] w-full pt-32 flex items-end border-b border-white/5">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src={blog.image} className="w-full h-full object-cover opacity-30" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pb-12">
            <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-white/40 hover:text-primary transition-all uppercase text-[10px] font-black tracking-[3px] mb-8">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Articles
            </button>

            <div className="flex gap-3 mb-6">
                {blog.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>

            <h1 className="text-4xl md:text-7xl font-black mb-8 max-w-5xl tracking-tighter leading-[0.95]">
                {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 py-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-black text-xs">NA</div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Nawaz Ahmad</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Shopify Architect</p>
                    </div>
                </div>
                <div className="flex gap-6 text-[10px] uppercase font-bold tracking-widest text-white/40">
                    <div className="flex items-center gap-2"><Calendar size={12} className="text-primary" /> {blog.date}</div>
                    <div className="flex items-center gap-2"><Clock size={12} className="text-primary" /> {blog.readTime}</div>
                </div>
            </div>
        </div>
      </div>

      {/* --- CONTENT & SIDEBAR LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16 relative">
            
            {/* Left Content */}
            <main className="flex-1 w-full overflow-hidden">
                <div className="prose prose-invert max-w-none prose-h3:text-3xl prose-h3:font-black prose-h3:tracking-tighter prose-p:text-white/60 prose-p:text-lg prose-p:leading-[1.8]"
                    dangerouslySetInnerHTML={{ __html: blog.content }} 
                />

                {/* --- EXPERT CTA PANEL --- */}
                <div className="mt-20 p-8 md:p-12 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
                                Need help wiring <br /> these <span className="text-primary">into your store?</span>
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <button onClick={() => navigate('/schedule')} className="bg-primary text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                                    Book a Call <ArrowRight size={16} />
                                </button>
                                <a href="https://wa.me/923059552222" target="_blank" className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-white/10 transition-all text-white">
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                        <div className="w-64 h-64 md:w-72 md:h-72 rounded-[2rem] overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                            <img src="/nawaz-expert.jpg" className="w-full h-full object-cover" alt="Nawaz Ahmad" />
                        </div>
                    </div>
                </div>

                {/* --- READ MORE SECTION (Wapis Added) --- */}
                <div className="mt-32 pt-16 border-t border-white/5">
                    <div className="flex items-center justify-between mb-10">
                        <h4 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                            Read more <ChevronRight size={28} className="text-primary" />
                        </h4>
                        <Link to="/blog" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors">
                            View All Posts
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {relatedBlogs.map((post) => (
                            <Link key={post.id} to={`/blog/${post.id}`} className="group block space-y-4">
                                <div className="aspect-video rounded-2xl overflow-hidden border border-white/5 bg-white/5 relative">
                                    <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{post.date}</p>
                                    <h5 className="text-xl font-black tracking-tight leading-snug group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h5>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            {/* Sticky Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
                <div className="sticky top-32 space-y-12">
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black font-black">NA</div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Nawaz Ahmad</h4>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Shopify Architect</p>
                            </div>
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed font-light">
                            Helping e-commerce brands scale with high-performance stores.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black uppercase tracking-[3px] text-primary">On this page</h5>
                        <nav className="flex flex-col border-l border-white/5">
                            {blog.toc?.map((item: any) => (
                                <a 
                                    key={item.id} 
                                    href={`#${item.id}`} 
                                    className={`pl-6 py-2 text-sm transition-all border-l-2 -ml-[1px] ${
                                        activeId === item.id ? "text-primary border-primary font-bold bg-primary/5" : "text-white/30 border-transparent hover:text-white"
                                    }`}
                                >
                                    {item.title}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <button className="flex items-center gap-3 text-white/20 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                            <Share2 size={16} /> Share Article
                        </button>
                    </div>
                </div>
            </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;