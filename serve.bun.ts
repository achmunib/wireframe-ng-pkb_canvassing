const root = import.meta.dir;
const mime: Record<string, string> = {
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
Bun.serve({
  port: 8137,
  async fetch(req) {
    const url = new URL(req.url);
    let p = decodeURIComponent(url.pathname);
    if (p.endsWith("/")) p += "index.html";
    const fp = root + p;
    if (!fp.startsWith(root)) return new Response("Forbidden", { status: 403 });
    const f = Bun.file(fp);
    if (await f.exists()) {
      const ext = fp.slice(fp.lastIndexOf("."));
      return new Response(f, {
        headers: { "Content-Type": mime[ext] ?? "application/octet-stream" },
      });
    }
    return new Response("Not found: " + p, { status: 404 });
  },
});
console.log("Portal: http://127.0.0.1:8137");
