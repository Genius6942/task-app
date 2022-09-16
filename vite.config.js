import { build, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      manualChunks: (id) => {
        // if (id.includes("@mui/icons-material")) {
        //   return "mui-icons";
        // }
        if (id.includes("@mui/material")) {
          return "mui-material";
        }
        if (id.includes("lodash")) {
          return "lodash";
        }
        if (id.includes("firebase")) {
          // also firebase-ui included
          return "firebase";
        }
        // if (id.includes("react")) {
        //   return "react";
        // }
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        start_url: "/dashboard",
        name: "DoIt",
        short_name: "DoIt",
        description: "The app for managing your work, tasks, and life. Join now for free to access a full organization tool.",
        icons: [
          {
            src: "/android-chrome-36x36.png",
            sizes: "36x36",
            type: "image/png",
          },
          {
            src: "/android-chrome-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/android-chrome-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/favicon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/maskable_icon_x72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        theme_color: "#2074d4",
        background_color: "#2074d4",
        display: "standalone",
        orientation: "portrait",
      },
    }),
  ],
});
