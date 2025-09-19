import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'lucide-react',
            '@clerk/clerk-react',
            'framer-motion',
          ],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            'class-variance-authority',
          ],
          data: ['@tanstack/react-query', '@supabase/supabase-js'],
          maps: ['mapbox-gl', 'leaflet', 'react-leaflet'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    target: 'esnext',
    minify: 'esbuild',
  },
}));
