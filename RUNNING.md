# Cara Menjalankan Portal PKB Canvasing

Portal (`index.html`) adalah situs statis yang memuat modul **Master Canvasing** dan
**List Canvasing** lewat `<iframe>` + `postMessage`. Karena itu **wajib** disajikan
lewat server HTTP — kalau dibuka langsung via `file://`, iframe modul blank dan
breadcrumb tidak update.

## Prasyarat

- Salah satu: [Bun](https://bun.sh) **atau** [Node.js](https://nodejs.org) ≥ 20.11.
- File server sudah tersedia di root repo: `serve.bun.ts`, `serve.node.mjs`.

## Opsi A — Bun (tanpa dependency)

```bash
bun serve.bun.ts
# buka http://127.0.0.1:8137
```

## Opsi B — Node native (tanpa dependency)

```bash
node serve.node.mjs
# buka http://127.0.0.1:8137
```

## Opsi C — Node sekali perintah (perlu internet saat pertama kali)

Tanpa memakai file server di repo. Tanpa live reload dan tanpa
`Cache-Control: no-store`.

```bash
npx -y serve . -l 8137
# atau
npx -y http-server . -p 8137
```

## Live reload (otomatis)

`serve.bun.ts` dan `serve.node.mjs` sudah punya live reload bawaan — **tanpa
dependency**. Begitu ada file di repo yang berubah/ditambah/dihapus, semua tab
yang sedang terbuka akan refresh sendiri.

Cara kerjanya:

1. Server memantau seluruh isi folder repo secara rekursif (`fs.watch`), dengan
   debounce 60 ms supaya satu kali simpan tidak memicu reload berkali-kali.
   Perubahan di dalam `.git/` diabaikan.
2. Setiap response `.html` disisipi snippet kecil sebelum `</body>` yang membuka
   koneksi `EventSource` ke `/__livereload`.
3. Saat ada perubahan file, server mengirim event `reload` lewat SSE ke semua
   klien yang terhubung, lalu halaman memanggil `location.reload()`.
4. Semua response dikirim dengan header `Cache-Control: no-store`, jadi browser
   tidak pernah menyajikan CSS/JS versi lama dari cache.

Catatan:

- Snippet disisipkan **saat response dikirim**, bukan disimpan ke file — file
  `index.html` di repo tetap bersih.
- Karena portal memakai `<iframe>`, shell dan modul masing-masing punya koneksi
  SSE sendiri. Setelah shell reload, modul dipulihkan dari hash URL
  (`#master-canvasing` / `#list-canvasing`), tetapi **state di dalam modul**
  (isi wizard, filter, form) ikut ter-reset — ini normal untuk live reload.
- Opsi C (`npx serve` / `npx http-server`) **tidak** punya live reload.
- Kalau file server-nya sendiri (`serve.node.mjs` / `serve.bun.ts`) yang diubah,
  server tetap perlu di-restart manual — atau jalankan dengan
  `node --watch serve.node.mjs` / `bun --hot serve.bun.ts`.

## Route

| URL                                              | Isi                                   |
| ------------------------------------------------ | ------------------------------------- |
| `http://127.0.0.1:8137/`                         | Shell portal (default: Master)        |
| `http://127.0.0.1:8137/#master-canvasing`        | Langsung ke Master Canvasing          |
| `http://127.0.0.1:8137/#list-canvasing`          | Langsung ke List Canvasing (PKB)      |

## Berhentikan server

`Ctrl+C` di terminal tempat server berjalan.

## Troubleshooting

- **Port 8137 sudah dipakai** (mis. server Python lama masih jalan): matikan
  proses lama dulu, atau ubah angka `port` / `.listen(...)` di file server
  (mis. ke `8139`) lalu buka URL dengan port tersebut.
- **URL mengandung `%20`** (mis. `/Master%20Canvasing/...`): normal, itu encoding
  spasi nama folder. Kedua file server sudah `decodeURIComponent`, semua route
  termuat 200.
- **Halaman tidak auto-refresh**: pastikan dibuka lewat `serve.node.mjs` /
  `serve.bun.ts` (bukan `file://` atau `npx serve`), lalu cek tab Network di
  DevTools — harus ada request `/__livereload` berstatus `pending`. Kalau
  server di-restart, koneksi SSE otomatis tersambung ulang (`retry: 500`).
- **Halaman reload berulang-ulang**: ada proses lain yang terus menulis file di
  dalam folder repo (mis. `docs/capture-screenshots.mjs` sedang berjalan).
  Tunggu sampai proses itu selesai.
- **Font terlihat beda saat offline**: font `Plus Jakarta Sans` dimuat dari Google
  Fonts sehingga butuh internet; offline otomatis fallback ke system font, layout
  tetap berjalan.
