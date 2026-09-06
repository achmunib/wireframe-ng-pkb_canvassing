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

Tanpa memakai file server di repo:

```bash
npx -y serve . -l 8137
# atau
npx -y http-server . -p 8137
```

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
- **Font terlihat beda saat offline**: font `Plus Jakarta Sans` dimuat dari Google
  Fonts sehingga butuh internet; offline otomatis fallback ke system font, layout
  tetap berjalan.
