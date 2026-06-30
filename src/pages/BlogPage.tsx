import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { blogPosts } from "../data/blogData"; 

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pehla post "Featured" banane ke liye
  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 selection:bg-[#f9a825] selection:text-black">
      
      {/* Background Decorative Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f9a825]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-white/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Side: Navigation & Info */}
          <div className="lg:w-[30%] lg:sticky lg:top-32 lg:h-fit">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <Sparkles size={12} className="text-[#f9a825]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Digital Journal</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.85]  uppercase">
                Shopify <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f9a825] to-[#ffe066]">Titans.</span>
              </h1>
              
              <p className="text-white/40 text-lg font-medium leading-relaxed mb-10 max-w-xs">
                Technical strategies to scale your e-commerce empire.
              </p>

              {/* Search Bar with Premium Focus */}
              <div className="relative group max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#f9a825] transition-all" size={18} />
                <input 
                  type="text" 
                  placeholder="Hunt for knowledge..."
                  className="w-full bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#f9a825]/40 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/20"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Side: Blog Feed */}
          <div className="lg:w-[70%]">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={searchQuery}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* 1. Featured Post (Big Card) */}
                {featuredPost && searchQuery === "" && (
                  <Link 
                    to={`/blog/${featuredPost.id}`}
                    className="group relative block mb-12 overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-1 hover:border-[#f9a825]/30 transition-all duration-500"
                  >
                    <div className="relative aspect-[21/9] rounded-[2.8rem] overflow-hidden">
                      <img 
                        src={featuredPost.image} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        alt="Featured"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-8 left-8 right-8">
                        <span className="px-4 py-1 bg-[#f9a825] text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">
                          Featured Article
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white group-hover:text-[#f9a825] transition-colors">
                          {featuredPost.title}
                        </h2>
                      </div>
                    </div>
                  </Link>
                )}

                {/* 2. Standard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                  {(searchQuery === "" ? remainingPosts : filteredPosts).map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link 
                        to={`/blog/${post.id}`} 
                        className="group flex flex-col h-full bg-[#0A0A0A]/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-6 hover:bg-white/[0.02] hover:border-white/10 transition-all duration-500 relative"
                      >
                        {/* Hover Glow Light */}
                        <div className="absolute inset-0 bg-[#f9a825]/0 group-hover:bg-[#f9a825]/2 blur-[80px] rounded-full transition-all pointer-events-none"></div>

                        {/* Card Image */}
                        <div className="aspect-[4/3] rounded-[1.8rem] overflow-hidden mb-6 border border-white/5 bg-[#111]">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                          />
                        </div>

                        {/* Content */}
                        <div className="space-y-4 px-2 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[#f9a825] text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-[#f9a825]/10 rounded-full border border-[#f9a825]/20">
                              {post.category}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase">
                              <Calendar size={12} /> {post.date}
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-[#f9a825] transition-colors uppercase line-clamp-2">
                            {post.title}
                          </h3>
                        </div>

                        {/* Footer Button */}
                        <div className="pt-6 mt-auto flex items-center justify-between px-2">
                           <span className="text-[10px] font-black uppercase tracking-[3px] text-white/20 group-hover:text-white transition-all">
                             Read Article
                           </span>
                           <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#f9a825] group-hover:border-[#f9a825] transition-all">
                              <ArrowRight size={16} className="text-white group-hover:text-black transition-all" />
                           </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* 3. Empty State */}
                {filteredPosts.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="text-center py-40 border border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search size={24} className="text-white/20" />
                    </div>
                    <p className="text-white/20 uppercase tracking-widest text-sm font-black">The hunt yielded no results.</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogPage;