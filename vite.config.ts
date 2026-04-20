import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

// In dev the app is served under /demo/ but content files (pages.json, img/)
// live at the server root so they are independent of app deployments.
// This plugin serves them at the root path from the local public/ folder.
const serveContentAtRoot = {
  name: "serve-content-at-root",
  configureServer(server: { middlewares: { use: (fn: Function) => void } }) {
    server.middlewares.use(
      (req: { url?: string }, res: any, next: () => void) => {
        const url = (req.url ?? "").split("?")[0];

        // Redirect /demo → /demo/ so Vite doesn't show the "did you mean" error
        if (url === "/demo") {
          res.writeHead(301, { Location: "/demo/" });
          res.end();
          return;
        }

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
  base: "/demo/",
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
