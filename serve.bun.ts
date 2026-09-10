import { watch } from "node:fs";

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

// --- Live reload: watcher direktori + broadcast ke klien SSE ---
type Client = ReadableStreamDefaultController<Uint8Array>;
const clients = new Set<Client>();
const enc = new TextEncoder();
const snippet = `<script>
(() => {
  const es = new EventSource("/__livereload");
  es.onmessage = (e) => { if (e.data === "reload") location.reload(); };
})();
</script>
`;
let timer: ReturnType<typeof setTimeout>;
watch(root, { recursive: true }, (_event, name) => {
  const f = String(name ?? "");
  if (!f || f.includes(".git")) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    for (const c of clients) {
      try {
        c.enqueue(enc.encode("data: reload\n\n"));
      } catch {
        clients.delete(c);
      }
    }
  }, 60);
});

Bun.serve({
  port: 8137,
  async fetch(req) {
    const url = new URL(req.url);
    let p = decodeURIComponent(url.pathname);

    if (p === "/__livereload") {
      let self: Client | null = null;
      const stream = new ReadableStream<Uint8Array>({
        start(c) {
          self = c;
          clients.add(c);
          c.enqueue(enc.encode("retry: 500\n\n"));
        },
        cancel() {
          if (self) clients.delete(self);
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream;charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    if (p.endsWith("/")) p += "index.html";
    const fp = root + p;
    if (!fp.startsWith(root))
      return new Response("Forbidden", {
        status: 403,
        headers: { "Cache-Control": "no-store" },
      });
    const f = Bun.file(fp);
    if (await f.exists()) {
      const ext = fp.slice(fp.lastIndexOf("."));
      const headers = {
        "Content-Type": mime[ext] ?? "application/octet-stream",
        "Cache-Control": "no-store",
      };
      if (ext === ".html") {
        const html = await f.text();
        const body = html.includes("</body>")
          ? html.replace("</body>", snippet + "</body>")
          : html + snippet;
        return new Response(body, { headers });
      }
      return new Response(f, { headers });
    }
    return new Response("Not found: " + p, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  },
});
console.log("Portal: http://127.0.0.1:8137 (live reload aktif)");
