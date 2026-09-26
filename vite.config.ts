import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Lazy chunks (StatsGrid, PortfolioSection, framer-motion gestures/proxy, ...)
    // ko initial load par preload mat karo. Vite by default har dynamic import ke
    // liye <link rel="modulepreload"> inject karta hai — ~15 chunks FCP/LCP se
    // bandwidth chheen lete hain (slow 4G par). Chunks React.lazy se on-demand
    // load honge jaise pehle hote thay; koi visual ya behavior change nahi.
    modulePreload: false,
    rollupOptions: {
      output: {
        // Sirf hamesha-zaroori core libraries (react/react-dom/react-router) ek chhote
        // stable chunk mein rakhte hain. Baqi sab (radix-ui, embla-carousel, recharts,
        // supabase, react-hook-form, wagera) ko Rollup apne aap alag chunks mein tor dega,
        // aligned with hamare lazy()/dynamic import boundaries - taake unused libraries
        // sirf tab download hon jab unki zaroorat ho (lazy-loaded section open ho).
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react-dom") ||
              id.includes("/react/") ||
              id.includes("react-router")
            ) {
              return "vendor-core";
            }
            // baqi sab ko default automatic splitting par chor dete hain
            return undefined;
          }
        },
      },
    },
    sourcemap: false, // Production build ka size chota rakhne ke liye maps off kiye hain
  },
}));
