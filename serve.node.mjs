import http from "node:http";
import fs from "node:fs/promises";
import { watch } from "node:fs";
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

// --- Live reload: watcher direktori + broadcast ke klien SSE ---
const clients = new Set();
const snippet = `<script>
(() => {
  const es = new EventSource("/__livereload");
  es.onmessage = (e) => { if (e.data === "reload") location.reload(); };
})();
</script>
`;
let timer;
watch(root, { recursive: true }, (_event, name) => {
  const f = String(name ?? "");
  if (!f || f.includes(".git")) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    for (const res of clients) res.write("data: reload\n\n");
  }, 60);
});

http
  .createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname);

      if (p === "/__livereload") {
        res.writeHead(200, {
          "Content-Type": "text/event-stream;charset=utf-8",
          "Cache-Control": "no-store",
          Connection: "keep-alive",
        });
        res.write("retry: 500\n\n");
        clients.add(res);
        req.on("close", () => clients.delete(res));
        return;
      }

      if (p.endsWith("/")) p += "index.html";
      const fp = path.join(root, p);
      if (!fp.startsWith(root)) {
        res.writeHead(403, { "Cache-Control": "no-store" });
        res.end("Forbidden");
        return;
      }
      const ext = path.extname(fp);
      let data = await fs.readFile(fp);
      if (ext === ".html") {
        const html = data.toString("utf8");
        data = html.includes("</body>")
          ? html.replace("</body>", snippet + "</body>")
          : html + snippet;
      }
      res.writeHead(200, {
        "Content-Type": mime[ext] ?? "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(data);
    } catch {
      res.writeHead(404, { "Cache-Control": "no-store" });
      res.end("Not found");
    }
  })
  .listen(8137, "127.0.0.1", () =>
    console.log("Portal: http://127.0.0.1:8137 (live reload aktif)"),
  );
