import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const root = import.meta.dirname;
const mime = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".mjs": "text/javascript;charset=utf-8",
};

http
  .createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (p.endsWith("/")) p += "index.html";
      const fp = path.join(root, p);
      if (!fp.startsWith(root)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      const data = await fs.readFile(fp);
      res.writeHead(200, {
        "Content-Type": mime[path.extname(fp)] ?? "application/octet-stream",
      });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(8137, "127.0.0.1", () =>
    console.log("Portal: http://127.0.0.1:8137"),
  );
