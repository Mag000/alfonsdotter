import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

// In dev the app is served at the root. Content files (pages.json, img/)
// are served from the local public/ folder by Vite automatically.
const serveContentAtRoot = {
  name: "serve-content-at-root",
  configureServer(server: { middlewares: { use: (fn: Function) => void } }) {
    server.middlewares.use(
      (req: { url?: string }, res: any, next: () => void) => {
        const url = (req.url ?? "").split("?")[0];

        if (url !== "/pages.json" && !url.startsWith("/img/")) return next();
        const filePath = path.join(process.cwd(), "public", url);
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile())
          return next();
        const ext = path.extname(filePath).toLowerCase();
        const mime: Record<string, string> = {
          ".json": "application/json",
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".webp": "image/webp",
          ".gif": "image/gif",
          ".svg": "image/svg+xml",
        };
        res.setHeader("Content-Type", mime[ext] ?? "application/octet-stream");
        fs.createReadStream(filePath).pipe(res);
      },
    );
  },
};

export default defineConfig({
  plugins: [react(), serveContentAtRoot],
  base: "/",
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
