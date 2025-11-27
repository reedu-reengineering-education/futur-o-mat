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
  define: {
    "process.env": {},
  },
  build: {
    rollupOptions: {
      output: {
        // Function to customize the naming pattern for all non-JS/CSS assets
        assetFileNames: (assetInfo) => {
          // Check if the asset is a font file (e.g., .woff, .woff2, .ttf, .otf)
          const isFont = /\.(woff2?|ttf|otf|eot)$/i.test(assetInfo.name || "");

          if (isFont) {
            // For font files, use the original name and extension without a hash
            // This assumes your fontsource files are being imported/processed as assets.
            // [name] is the original file name (without extension).
            // [ext] is the file extension.
            return "assets/fonts/[name].[ext]";
          }

          // For all other assets (images, other files), keep the default hashing behavior
          // for cache busting.
          return "assets/[name]-[hash].[ext]";
        },

        // Optional: you can also configure JS and CSS file naming here if needed
        // entryFileNames: 'assets/[name].js',
        // chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});
