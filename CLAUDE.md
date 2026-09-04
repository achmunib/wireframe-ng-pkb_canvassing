# PKB Canvasing

## Dokumentasi Modul (WAJIB)

Setiap kali ada perubahan pada sebuah modul — desain/UI, layout, styling, data dummy, field baru, perubahan/penghapusan field, alur wizard, validasi, perilaku tombol, isi modal/pop-up, dsb. — **dokumentasi modul tersebut harus ikut di-update pada commit yang sama**.

| Modul | Halaman | Dokumentasi yang wajib di-update |
|-------|---------|--------------------------------|
| Master Canvasing | `Master Canvasing/index.html`, `Master Canvasing/styles.css` | `Master Canvasing/docs/master-canvasing.md` |
| List Canvasing | `List Canvasing/index.html`, `List Canvasing/styles.css` | `List Canvasing/docs/list-canvasing.md` |

Aturan:

1. **Jangan pernah menganggap perubahan selesai** sebelum dokumentasi terkait diperbarui. Ini berlaku juga untuk perubahan kecil (ganti label, ubah placeholder, tambah opsi dropdown, ubah warna status, dll).
2. Ikuti **format tabel yang sudah ada** di dokumen: `Element Code | Component Type | Function | Behavior & Rule | Mandatory | API | Endpoint/Navigate | Method | Status QCC | Status Dev`. Tambahkan/ubah/hapus baris sesuai perubahan, jangan membuat format baru.
3. Jika elemen **dihapus** dari halaman, hapus juga barisnya dari dokumentasi. Jika elemen **ditambah**, tambahkan baris baru pada section yang sesuai.
4. Jika perubahan menambah section/pop-up/step baru, tambahkan **heading section baru** beserta tabelnya di dokumen.
5. Bila perubahan mengubah tampilan secara visual, **screenshot di `docs/attachments/` juga perlu diperbarui** (tersedia `docs/capture-screenshots.mjs` di masing-masing modul untuk regenerasi).
6. Catatan keterbatasan implementasi ditulis sebagai **"Catatan pengembangan:"** di kolom Behavior & Rule, sesuai konvensi dokumen yang ada.
7. Bahasa dokumentasi: **Bahasa Indonesia**, konsisten dengan isi dokumen saat ini.

## Sinkronisasi ke Root Shell `index.html` (WAJIB)

`index.html` (bersama `styles.css` dan `app.js` di root) adalah **shell portal** — pintu masuk ke kedua halaman modul, yang dimuat sebagai **iframe** (`#moduleFrame`). Setiap perubahan pada halaman Master Canvasing atau List Canvasing **harus dicek dan disinkronkan** ke root shell pada commit yang sama.

Titik sinkronisasi yang wajib dicek setiap kali ada perubahan modul:

| Yang berubah di modul | Yang harus ikut diperiksa/di-update di root |
|-----------------------|---------------------------------------------|
| Nama / judul halaman modul | Label sidebar submenu (`.submenu-text`), flyout card (`.flyout-item`), quick tab header (`.quick-tab`), dan `data-crumb` di `index.html`; `MODULES[].name` di `app.js` |
| Path / nama file modul | `data-src` pada submenu & flyout, `src` pada `<iframe id="moduleFrame">`, dan `MODULES[].path` di `app.js` |
| Route / hash navigasi | `MODULES[].hash` (`#master-canvasing`, `#list-canvasing`), `handleInitialRoute()`, dan listener `hashchange` di `app.js` |
| Breadcrumb / sub-crumb modul | Pengiriman `postMessage` bertipe `UPDATE_CRUMB` dari modul harus cocok dengan handler `initIframeCommunication()` dan elemen `#crumbActive` di root |
| Modul baru ditambahkan / dihapus | Registry `MODULES` di `app.js`, item sidebar submenu, item flyout, quick tab, dan default `src` iframe |
| Desain / token visual modul (warna, font, spacing, tinggi header) | `styles.css` root — pastikan tampilan shell (sidebar, header, frame container) tetap selaras dengan modul, tidak ada jarak/scrollbar ganda pada `.frame-container` |
| Header standalone modul | Modul menyembunyikan headernya sendiri via class `in-iframe`; pastikan mekanisme ini tetap berjalan agar header tidak dobel dengan header root |

Aturan:

1. Setelah mengubah modul, **selalu buka `index.html` dan verifikasi** bahwa navigasi (sidebar → flyout → quick tab → hash → iframe) masih konsisten dan mengarah ke file yang benar.
2. Perubahan pada modul **tidak boleh membuat navigasi root rusak** (label tidak sinkron, `data-src` menunjuk file yang sudah dipindah, hash tidak dikenali, breadcrumb tidak update).
3. Jika perubahan modul menuntut perubahan di root, lakukan di commit yang sama — jangan ditunda.
4. Perubahan pada root shell yang memengaruhi tampilan/alur modul juga wajib dicatat pada dokumentasi modul terkait (lihat section **Dokumentasi Modul** di atas).
