import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tanstackRouter(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // publicDir: "public",
  // // Ensure assets folder is accessible
  // assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg"],
  // build: {
  //   // Optimize bundle size
  //   target: "es2015",
  //   minify: "esbuild", // Use esbuild for faster builds
  //   // Optimize chunk splitting
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         // Separate vendor chunks for better caching
  //         "react-vendor": ["react", "react-dom"],
  //         "ui-vendor": [
  //           "@radix-ui/react-slot",
  //           "@radix-ui/react-tabs",
  //           "lucide-react",
  //         ],
  //       },
  //     },
  //   },
  //   // Increase chunk size warning limit (our bundle is image-heavy)
  //   chunkSizeWarningLimit: 1000,
  // },
  // // Optimize dev server
  // server: {
  //   port: 5173,
  //   strictPort: false,
  //   open: false,
  // },
  // // Optimize preview server
  // preview: {
  //   port: 4173,
  //   strictPort: false,
  //   open: false,
  // },
});
