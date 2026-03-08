import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward /api/* to the local ASP.NET Core API host during development
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
