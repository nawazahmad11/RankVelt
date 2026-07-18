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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          /*
           * React core aur routing
           */
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router/") ||
            id.includes("/react-router-dom/")
          ) {
            return "react-vendor";
          }

          /*
           * Framer Motion animations
           */
          if (id.includes("/framer-motion/")) {
            return "motion-vendor";
          }

          /*
           * Shadcn ke Radix UI components
           */
          if (id.includes("/@radix-ui/")) {
            return "radix-vendor";
          }

          /*
           * React Query
           */
          if (id.includes("/@tanstack/react-query/")) {
            return "query-vendor";
          }

          /*
           * Lucide icons
           */
          if (id.includes("/lucide-react/")) {
            return "icons-vendor";
          }

          /*
           * Remaining third-party packages
           */
          return "vendor";
        },
      },
    },

    sourcemap: false,
  },
}));