# Design: Halaman Utama "List PKB Canvasing" (Grid View)

Date: 2026-09-01
Module: `List Canvasing/` (index.html, styles.css, app.js)
Status: Approved by user in conversation

## Context

Landing page List Canvasing saat ini adalah "PILIH METODE BOOKING": dua kartu besar
BOOKING / NON BOOKING. BOOKING membuka modal `bookingSelectModal` (3 jadwal booking
statis + pencarian), NON BOOKING langsung masuk wizard 5 langkah. Konsep metode
Booking/Non-Booking akan dihilangkan seluruhnya dari modul ini.

## Goal

Halaman awal List Canvasing menjadi dashboard **grid view** berisi daftar data
PKB Canvasing dengan status **Belum Dijalankan / Sedang Dijalankan / Sudah
Dijalankan**, plus data pendukung (statistik, pencarian, filter status).

## Non-goals

- Tidak mengubah wizard 5 langkah (Vehicle → Carrier Data → Cek Aja Dulu →
  Service & Parts → Summary) selain titik masuk dan opsi Queue Type.
- Tidak ada backend; data tetap mock statis di app.js (pola existing
  `sampleBookings`).
- Tidak mengubah modul lain (Master Canvasing, shell portal).

## Halaman utama (menggantikan `#methodSelectionView` → section baru `#pkbDashboardView`)

```
LIST PKB CANVASING                              [+ PKB Baru]
Dashboard canvasing hari ini · Sabtu, 26 Agustus 2024

[ Total 8 ][ Belum 3 ][ Proses 3 ][ Selesai 2 ]   ← chip statistik, klik = filter
[ Cari plat / kode / pelanggan... ]  [Semua][Belum][Proses][Selesai]

[ kartu PKB ] [ kartu PKB ] [ kartu PKB ] ...
```

- Header halaman: judul + subjudul + tanggal + tombol primer "+ PKB Baru".
- Statistik: 4 chip (Total, Belum, Proses, Selesai) — klik chip = set filter status.
- Toolbar: input pencarian (plat / kode PKB / pelanggan / model) + pill filter
  status [Semua | Belum | Proses | Selesai]; filter & pencarian saling menggabung.
- Grid: `display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`,
  gap konsisten dengan token existing; kosong → empty state.
- Seluruh section menggunakan token desain existing (Plus Jakarta Sans, warna,
  radius, shadow `content-card`, pola hover lift).

## Anatomi kartu PKB

- Baris atas: kode PKB (pill, gaya `booking-code-pill`) + badge status:
  - Belum Dijalankan → slate/neutral
  - Sedang Dijalankan → biru
  - Sudah Dijalankan → hijau
- Utama: nomor polisi (besar, tebal) + model kendaraan.
- Meta: pelanggan, layanan, jam, mekanik, progres (`Step 3/5 · Cek Aja Dulu`).
- Hover: lift + aksen border (pola hover existing). Klik seluruh kartu → wizard.

## Data & alur

- `samplePkbList` (8 entri statis: 3 belum / 3 proses / 2 selesai). Field:
  `id, plate, model, customer, engine, frame, phone, service, time, mechanic,
  status ('pending'|'progress'|'done'), step (0–5)`.
- Dirender dinamis oleh `renderPkbGrid()`; search + filter me-render ulang.
- **Klik kartu** → `openPkbWizard(entry)`: sembunyikan dashboard, tampilkan wizard
  dengan data step 1 terisi (logika pengisian yang sama dengan alur booking lama:
  scan input, plate, engine, frame, color, dealer, year, km, model, purchase date).
- **+ PKB Baru** → `openPkbWizard(null)`: wizard kosong (perilaku walk-in lama).
- Breadcrumb parent portal: subCrumb `List PKB` (bukan `Pilih Metode`).
- Pesan `RESET_VIEW` dari parent → tampilkan dashboard.

## Pembersihan menyeluruh (clean cutover)

HTML (`List Canvasing/index.html`):
- Hapus section `#methodSelectionView` (method-selection) → ganti `#pkbDashboardView`.
- Hapus modal `#bookingSelectModal` beserta seluruh isinya.
- Pertahankan `#inputDataModal` (Input New Vehicle Data — dipakai wizard, bukan
  bagian konsep booking).
- Summary: pada select `#summaryQueueType` hapus opsi "Booking"; default Regular
  (Regular / Fast Track tersisa).

CSS (`List Canvasing/styles.css`):
- Hapus: `.method-selection-section`, `.method-selection-container`,
  `.method-header`, `.mpm-brand-logo`, `.method-title`, `.method-cards-grid`,
  `.method-card*`, `.method-card-icon*`, `.method-card-label`, media query terkait,
  dan seluruh style `.booking-*` milik modal booking
  (`booking-modal-card`, `booking-search-*`, `booking-list-label`,
  `booking-cards-list`, `booking-item-*`, `booking-code-pill` → diganti nama baru
  bila dipakai ulang di kartu PKB, `btn-manual-booking`).
- Tambah: `.pkb-dashboard-*` (header, stats, toolbar, grid, kartu, badge status)
  mengikuti token existing.

JS (`List Canvasing/app.js`):
- Hapus: `sampleBookings`, `currentMethod`, `activeBooking`,
  `initMethodSelection`, `showMethodSelection`, `selectBookingMethod`,
  penanganan hash `#booking` / `#non-booking`, listener modal booking,
  pengesetan `summaryQueueType` programmatically.
- Tambah: `samplePkbList`, `initPkbDashboard()` (registrasi di DOMContentLoaded),
  `renderPkbGrid(filter, query)`, `openPkbWizard(entry)`, `showPkbDashboard()`.
- Toast tetap dipakai untuk umpan balik ("Data PKB ... dimuat", "Mode canvasing baru").

## Implementasi

- Dieksekusi oleh **agent Designer** dalam satu pass (HTML + CSS + JS pada
  `List Canvasing/`), mengikuti spesifikasi ini dan pola existing.

## Verifikasi

- Browser-drive halaman (langsung `List Canvasing/index.html` dan via iframe
  portal `index.html`):
  - Grid render 8 kartu, badge status benar.
  - Filter chip statistik & pill filter memfilter; pencarian memfilter;
    kombinasi keduanya bekerja.
  - Klik kartu (semua status) → wizard terbuka dengan data kartu terisi.
  - "+ PKB Baru" → wizard kosong.
  - Tidak ada error konsol; tidak ada sisa referensi booking/metode
    (`grep` bersih terhadap `methodSelectionView`, `bookingSelectModal`,
    `selectBookingMethod`, `sampleBookings`).
  - Responsif: grid menyusut mulus di lebar sempit (iframe ≥ ~700px).
