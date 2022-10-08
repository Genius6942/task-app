import react from "@vitejs/plugin-react";
import { build, defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import { app_name } from "./src/lib/constants";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
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
      includeAssets: ["/favicon.ico", "/*.png"],
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        // enabled: command === 'serve' ? true : false,
      },
      manifest: {
        start_url: "/dashboard",
        name: app_name,
        short_name: app_name,
        description:
          "The app for managing your work, tasks, and life. Join now for free to access a full organization tool.",
        icons: [
          {
            src: "/icons/android-chrome-36x36.png?v=1",
            sizes: "36x36",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-48x48.png?v=1",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-72x72.png?v=1",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-96x96.png?v=1",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-144x144.png?v=1",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-192x192.png?v=1",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-256x256.png?v=1",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-384x384.png?v=1",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-512x512.png?v=1",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        theme_color: "#2074d4",
        background_color: "#2074d4",
        display: "standalone",
        orientation: "portrait",
      },
    }),
  ],
}));
