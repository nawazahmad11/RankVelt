import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Calendar, User, Share2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { blogPosts } from "../data/blogData";


interface TOCItem {
    id: string;
    title: string;
    level: number;
  }

const BlogPostDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);
  const [activeId, setActiveId] = useState("");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Scrollspy Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -60% 0%", threshold: 0.1 }
    );

    const headings = document.querySelectorAll("h2[id]");
    headings.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [post]);

  if (!post) return <div className="text-white pt-40 text-center font-bold">Post Not Found</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#f9a825] selection:text-black">
      {/* Reading Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#f9a825] z-[100] origin-left" style={{ scaleX }} />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* Navigation */}
        <Link to="/blog" className="flex items-center gap-2 text-white/30 hover:text-[#f9a825] transition-all mb-12 group uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Articles
        </Link>

        {/* Header Section */}
        <header className="mb-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#f9a825] text-[10px] font-black uppercase tracking-[3px] mb-6 block">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] text-white max-w-5xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-white/20 text-[10px] font-black uppercase tracking-[2px] border-y border-white/5 py-8">
              <div className="flex items-center gap-2"><Calendar size={14} className="text-[#f9a825]" /> {post.date}</div>
              <div className="flex items-center gap-2"><User size={14} className="text-[#f9a825]" /> By {post.author}</div>
              <div className="flex items-center gap-2"><Clock size={14} className="text-[#f9a825]" /> {post.readTime || '10 min read'}</div>
              <button className="ml-auto hover:text-white transition-colors"><Share2 size={14} /></button>
            </div>
          </motion.div>
        </header>

        {/* Featured Image */}
        {/* <div className="w-full aspect-video rounded-[2rem] overflow-hidden mb-20 border border-white/5 bg-white/5 shadow-2xl">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-700" />
        </div> */}

{/* Featured Image - Reduced Side Spacing & Widescreen */}
{/* <div className="w-[95vw] max-w-[1400px] mx-auto aspect-[21/7] rounded-[2.5rem] overflow-hidden mb-10 border border-white/5 bg-white/5 shadow-2xl relative left-1/2 right-1/2 -ml-[47.5vw] -mr-[47.5vw]">
  
  <img 
    src={post.image} 
    alt={post.title} 
    className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-700" 
  />

</div> */}


{/* <div className="w-[95vw] max-w-[1400px] mx-auto aspect-[21/7] rounded-[2.5rem] overflow-hidden mb-10 border border-white/5 bg-white/5 shadow-2xl"> */}
<div className="w-full max-w-[1400px] mx-auto aspect-[16/9] md:aspect-[21/7] rounded-2xl md:rounded-[2.5rem] overflow-hidden mb-10 border border-white/5 bg-white/5 shadow-2xl px-4 md:px-0">
  <img 
    src={post.image} 
    alt={post.title} 
    className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-700" 
  />

</div>



        {/* --- MAIN LAYOUT (Content + Sidebar) --- */}
        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* ARTICLE CONTENT */}
          <main className="flex-1 w-full overflow-hidden text-left">
            <div className="blog-rich-text custom-content-styles" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {/* Styles are kept here or in index.css */}
            <style>{`
              .custom-content-styles p { color: rgba(255, 255, 255, 0.6); font-size: 1.13rem; line-height: 1.3; margin-bottom: 1.0rem; }
              .custom-content-styles h2 { color: white; font-size: 1.8rem; font-weight: 900; text-transform: uppercase; word-spacing: 0.1em; letter-spacing: -0.05em; margin-top: 3.5rem; margin-bottom: 1.3rem; line-height: 1.1; scroll-margin-top: 100px; }
              .custom-content-styles h3 { color: white; font-size: 1.1rem; font-weight: 800; text-transform: uppercase; margin-top: 1.0rem; margin-bottom: 0.5rem; }
              .custom-content-styles ul { margin-bottom: 3rem; padding-left: 1.5rem; list-style-type: none; }
              .custom-content-styles li { margin-bottom: 1rem; font-size: 1.15rem; color: rgba(255, 255, 255, 0.6); position: relative; }
              .custom-content-styles li::before { content: '→'; color: #f9a825; position: absolute; left: -1.5rem; font-weight: bold; }
              .custom-content-styles table { width: 100%; margin: 3.5rem 0; border-collapse: collapse; background: rgba(255,255,255,0.02); border-radius: 1rem; overflow: hidden; }
              .custom-content-styles th { background: rgba(255, 255, 255, 0.05); padding: 1.5rem; text-align: left; color: #f9a825; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.1); }
              .custom-content-styles td { padding: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.69); font-size: 1rem; }
            `}</style>
          </main>

          {/* STICKY SIDEBAR TOC */}
          {/* <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-32 space-y-12">
              
              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[3px] text-[#f9a825]">On this page</h5>
                <nav className="flex flex-col border-l border-white/5">
                  {post.toc?.map((item: any) => (
                    <a 
                      key={item.id} 
                      href={`#${item.id}`} 
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`pl-6 py-3 text-[10px] uppercase font-black tracking-widest transition-all border-l-2 -ml-[1px] ${
                        activeId === item.id 
                        ? "text-[#f9a825] border-[#f9a825] bg-[#f9a825]/5" 
                        : "text-white/40 border-transparent hover:text-white/60"
                      }`}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div> */}



           <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-32 space-y-12">
              
              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[3px] text-[#f9a825]">On this page</h5>
                <nav className="flex flex-col border-l border-white/5 relative">
  {(() => {
    // Array ko safe banayen
    const tocItems = (post?.toc || []) as TOCItem[];

    return tocItems.map((item, index) => {
      const isSubItem = item.level === 3;
      const isActive = activeId === item.id;

      // Current section ka parent dhoondna
      const parentH2 = tocItems
        .slice(0, index + 1)
        .reverse()
        .find((t) => t.level === 2);

      // Section activity check
      const isSectionActive = activeId === parentH2?.id || 
        tocItems.some((t) => 
          t.level === 3 && t.id === activeId && 
          tocItems.slice(0, tocItems.indexOf(t) + 1).reverse().find(x => x.level === 2)?.id === parentH2?.id
        );

      // Folder Logic: H2 hamesha, H3 sirf active section mein
      const shouldShow = !isSubItem || isSectionActive;

      return (
        <motion.div
          key={item.id}
          initial={false}
          animate={{ 
            height: shouldShow ? "auto" : 0, 
            opacity: shouldShow ? 1 : 0,
            marginTop: shouldShow ? 0 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <a
            href={`#${item.id}`}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              const el = document.getElementById(item.id);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`py-3 text-[10px] uppercase font-black tracking-widest transition-all border-l-2 -ml-[1px] flex items-center
              ${isSubItem ? "pl-12 text-[9px] opacity-60" : "pl-6"} 
              ${isActive 
                ? "text-[#f9a825] border-[#f9a825] bg-[#f9a825]/5" 
                : "text-white/40 border-transparent hover:text-white/60"
              }`}
          >
            {isSubItem && <span className="mr-2 opacity-30">—</span>}
            <span className="truncate">{item.title}</span>
          </a>
                      </motion.div>
                          );
                       });
                    })()}
            </nav>
              </div>


              {/* Author Info Box */}
              <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-full bg-[#f9a825] flex items-center justify-center text-black font-black mb-4">NA</div>
                <h4 className="text-white font-black uppercase tracking-tighter text-lg">{post.author}</h4>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">Shopify Architect</p>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <button className="flex items-center gap-3 text-white/20 hover:text-[#f9a825] transition-all text-[10px] font-black uppercase tracking-widest">
                    <Share2 size={14} /> Share Article
                  </button>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;