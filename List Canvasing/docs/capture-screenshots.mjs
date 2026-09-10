/**
 * Capture Screenshot Dokumentasi — Modul List Canvasing (List PKB)
 * =============================================================================
 *
 * Menghasilkan ulang seluruh screenshot yang dipakai pada "list-canvasing.md".
 * Jalankan setiap kali tampilan modul berubah agar dokumentasi tetap sinkron.
 *
 * CARA PAKAI (dari folder mana pun):
 *
 *     node "List Canvasing/docs/capture-screenshots.mjs"
 *
 * Syarat:
 *   - Node.js 18+ (butuh fetch & WebSocket bawaan; diuji pada Node 24)
 *   - Google Chrome atau Microsoft Edge terpasang
 *     (bila terpasang di lokasi tidak umum, set variabel CHROME_PATH)
 *
 * Cara kerja:
 *   Menjalankan browser headless, membuka "List Canvasing/index.html" secara
 *   langsung dari file system, lalu mengendalikan halaman melalui Chrome
 *   DevTools Protocol untuk membuka dashboard, tiap step wizard & pop-up,
 *   kemudian menyimpan screenshot ke folder "docs/attachments".
 *
 * Menambah screenshot baru:
 *   Tambahkan blok baru pada bagian "SKENARIO CAPTURE" di bawah, lalu tautkan
 *   berkas hasilnya pada "list-canvasing.md" dengan format:
 *   ![Keterangan](attachments/nama-file.png " =LEBARxTINGGI")
 *
 * Catatan: seluruh screenshot digenerate ulang dalam satu kali proses karena
 * tiap langkah bergantung pada kondisi halaman sebelumnya.
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import { tmpdir } from 'node:os';

// ---------------------------------------------------------------------------
// Konfigurasi path
// ---------------------------------------------------------------------------
const DOCS_DIR = dirname(fileURLToPath(import.meta.url));       // .../List Canvasing/docs
const MODULE_DIR = dirname(DOCS_DIR);                            // .../List Canvasing
const OUT_DIR = join(DOCS_DIR, 'attachments');
const PAGE_FILE = join(MODULE_DIR, 'index.html');
const PROFILE_DIR = join(tmpdir(), 'lc-capture-profile');

/** Ukuran viewport default (CSS px). Skala 2x agar tajam di layar retina. */
const VIEW_W = 1440;
const VIEW_H = 900;
const SCALE = 2;

// ---------------------------------------------------------------------------
// Deteksi lokasi browser
// ---------------------------------------------------------------------------
function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);

  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      'Chrome / Edge tidak ditemukan. Set variabel CHROME_PATH ke lokasi browser, contoh:\n' +
      '  set CHROME_PATH=C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    );
  }
  return found;
}

// ---------------------------------------------------------------------------
// Klien Chrome DevTools Protocol (minimal)
// ---------------------------------------------------------------------------
let ws;
let msgId = 0;
const pending = new Map();

/** Membaca port debugging yang dipilih Chrome dari file DevToolsActivePort. */
async function waitForDebugPort() {
  const portFile = join(PROFILE_DIR, 'DevToolsActivePort');
  for (let i = 0; i < 100; i++) {
    if (existsSync(portFile)) {
      const port = readFileSync(portFile, 'utf8').split('\n')[0].trim();
      if (port) return port;
    }
    await sleep(200);
  }
  throw new Error('Browser gagal dijalankan (port debugging tidak terbaca)');
}

async function connect(port) {
  for (let i = 0; i < 50; i++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = targets.find((t) => t.type === 'page');
      if (page) {
        ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((ok, err) => { ws.onopen = ok; ws.onerror = err; });
        ws.onmessage = (ev) => {
          const m = JSON.parse(ev.data);
          if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
        };
        return;
      }
    } catch { /* browser belum siap menerima koneksi */ }
    await sleep(200);
  }
  throw new Error('Gagal terhubung ke DevTools Protocol');
}

function send(method, params = {}) {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(id, (m) =>
      m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result));
  });
}

/** Menjalankan ekspresi JavaScript di dalam halaman. */
async function evaluate(expression) {
  const res = await send('Runtime.evaluate', {
    expression, awaitPromise: true, returnByValue: true,
  });
  if (res.exceptionDetails) {
    throw new Error('Error di halaman: ' + (res.exceptionDetails.exception?.description
      || res.exceptionDetails.text));
  }
  return res.result?.value;
}

// ---------------------------------------------------------------------------
// Utilitas capture
// ---------------------------------------------------------------------------
async function setViewport(width = VIEW_W, height = VIEW_H) {
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: SCALE, mobile: false,
  });
}

async function openPage() {
  await send('Page.navigate', { url: pathToFileURL(PAGE_FILE).href });
  await waitFor(`document.querySelectorAll('#pkbGrid .pkb-card').length > 0`);
}

/** Menunggu sampai ekspresi bernilai true (maksimal ~10 detik). */
async function waitFor(expression, label = expression) {
  for (let i = 0; i < 50; i++) {
    try {
      if (await evaluate(`Boolean(${expression})`)) { await sleep(250); return; }
    } catch { /* halaman mungkin masih memuat */ }
    await sleep(200);
  }
  throw new Error(`Timeout menunggu kondisi: ${label}`);
}

/** Menyembunyikan toast agar tidak menutupi konten pada screenshot. */
async function hideToast() {
  await evaluate(`
    (function () {
      var t = document.getElementById('toastNotification');
      if (t) { t.classList.remove('show'); t.style.display = 'none'; }
      return true;
    })()
  `);
}

/** Menggeser halaman ke posisi paling atas sebelum capture viewport. */
async function scrollTop() {
  await evaluate(`window.scrollTo(0, 0); true`);
  await sleep(150);
}

/**
 * Menyimpan screenshot.
 * @param {string} name   nama berkas tanpa ekstensi
 * @param {object} opts   { fullPage } — true untuk menangkap seluruh tinggi halaman
 *                        (gunakan false untuk pop-up / dropdown agar terlihat wajar)
 */
async function shot(name, { fullPage = false } = {}) {
  await hideToast();
  const params = { format: 'png' };

  if (fullPage) {
    const metrics = await send('Page.getLayoutMetrics');
    // cssContentSize memakai satuan CSS px; contentSize bisa ikut terskala
    // deviceScaleFactor sehingga hasil capture jadi 2x lebih lebar.
    const size = metrics.cssContentSize || metrics.contentSize;
    params.captureBeyondViewport = true;
    params.clip = { x: 0, y: 0, width: size.width, height: size.height, scale: 1 };
  }

  const { data } = await send('Page.captureScreenshot', params);
  const buf = Buffer.from(data, 'base64');
  writeFileSync(join(OUT_DIR, `${name}.png`), buf);

  // Baca dimensi dari header PNG untuk ditampilkan sebagai acuan penulisan
  // atribut ukuran pada markdown.
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  console.log(`  ✓ ${name}.png  (markdown: " =${w / SCALE}x${h / SCALE}")`);
}

// ---------------------------------------------------------------------------
// Skrip bantu — dijalankan di dalam halaman
// ---------------------------------------------------------------------------

/** Membuka wizard dari kartu PKB pertama (PKB berstatus "Sedang Dijalankan"). */
const OPEN_FIRST_PKB = `document.querySelector('#pkbGrid .pkb-card').click(); true`;

/**
 * Menyeragamkan tampilan Fuel Indicator pada screenshot Step 1.
 * Level tidak pernah diinisialisasi oleh modul (lihat catatan pengembangan pada
 * dokumentasi), sehingga dipicu manual agar level "Full" terlihat aktif.
 */
const SET_FUEL_FULL = `
  (function () {
    var lbl = document.querySelector('.gauge-lbl[data-level="4"]');
    if (lbl) lbl.click();
    return true;
  })()
`;

/**
 * Mengisi tabel "Cek Aja Dulu" (Step 3) dengan kombinasi yang valid.
 * Sejak Step 3 divalidasi, perpindahan ke Step 4 diblokir bila masih ada baris
 * kosong — pengisian ini dijalankan SETELAH screenshot Step 3 diambil agar
 * gambar tetap memperlihatkan kondisi awal halaman.
 */
/**
 * Menyiapkan kondisi error pada tabel "Cek Aja Dulu" lalu memicu validasi,
 * agar screenshot memperlihatkan seluruh jenis pesan error sekaligus:
 * Condition kosong, Part Code kosong, dan Reason kurang dari 10 karakter.
 */
const TRIGGER_CEK_AJA_DULU_ERRORS = `
  (function () {
    var rows = document.querySelectorAll('.cek-row');
    var pick = function (row, name, value) {
      var el = Array.prototype.find.call(
        row.querySelectorAll('input[name^="' + name + '_"]'),
        function (r) { return r.value === value; });
      if (el && !el.disabled) el.click();
    };
    // Baris 1 & 4 dibiarkan kosong -> error Condition
    pick(rows[1], 'cond', 'Not Ok');
    pick(rows[1], 'rep', 'Yes');          // Part Code dibiarkan kosong
    pick(rows[2], 'cond', 'Not Ok');
    pick(rows[2], 'rep', 'No');
    var ta = rows[2].querySelector('.cek-reason-textarea');
    ta.value = 'habis';                   // kurang dari 10 karakter
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    goToStep(4);                          // diblokir, memunculkan seluruh error
    return true;
  })()
`;

/**
 * Mengisi tabel Cek Aja Dulu dengan kombinasi Ok / Not Ok lalu menekan tombol
 * "Save & Print CAD" sehingga lembar Honda Safety Check Sheet terbuka.
 * Dijalankan paling akhir karena aksi simpan mengembalikan tampilan ke dashboard.
 */
const OPEN_CAD_REPORT = `
  (function () {
    var rows = document.querySelectorAll('.cek-row');
    var pick = function (row, name, value) {
      var el = Array.prototype.find.call(
        row.querySelectorAll('input[name^="' + name + '_"]'),
        function (r) { return r.value === value; });
      if (el && !el.disabled) el.click();
    };
    // Dua baris pertama Not Ok agar "Parts Not Ok" pada kop bernilai 2
    pick(rows[0], 'cond', 'Not Ok');
    pick(rows[0], 'rep', 'Yes');
    var sel = rows[0].querySelector('.cek-select-pill');
    sel.selectedIndex = 1;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    pick(rows[1], 'cond', 'Not Ok');
    pick(rows[1], 'rep', 'No');
    var ta = rows[1].querySelector('.cek-reason-textarea');
    ta.value = 'Stok kampas rem belum tersedia';
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    for (var i = 2; i < rows.length; i++) pick(rows[i], 'cond', 'Ok');
    document.getElementById('btnSavePrint').click();
    return true;
  })()
`;

const FILL_CEK_AJA_DULU = `
  (function () {
    var pick = function (row, name, value) {
      var el = Array.prototype.find.call(
        row.querySelectorAll('input[name^="' + name + '_"]'),
        function (r) { return r.value === value; });
      if (el && !el.disabled) el.click();
    };
    document.querySelectorAll('.cek-row').forEach(function (row, i) {
      pick(row, 'cond', 'Not Ok');
      if (i % 2 === 0) {
        pick(row, 'rep', 'Yes');
        var sel = row.querySelector('.cek-select-pill');
        sel.selectedIndex = 1;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        pick(row, 'rep', 'No');
        var ta = row.querySelector('.cek-reason-textarea');
        ta.value = 'Stok part belum tersedia di bengkel';
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    return true;
  })()
`;

// ---------------------------------------------------------------------------
// Proses utama
// ---------------------------------------------------------------------------
if (!existsSync(PAGE_FILE)) {
  console.error(`Halaman modul tidak ditemukan: ${PAGE_FILE}`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
rmSync(PROFILE_DIR, { recursive: true, force: true });

const browserPath = findBrowser();
console.log('Browser :', browserPath);
console.log('Halaman :', PAGE_FILE);
console.log('Output  :', OUT_DIR, '\n');

const browser = spawn(browserPath, [
  '--headless=new',
  '--remote-debugging-port=0',            // biarkan browser memilih port bebas
  `--user-data-dir=${PROFILE_DIR}`,
  `--window-size=${VIEW_W},${VIEW_H}`,
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  '--allow-file-access-from-files',
  'about:blank',
], { stdio: 'ignore' });

try {
  await connect(await waitForDebugPort());
  await send('Page.enable');
  await send('Runtime.enable');
  await setViewport();

  // =========================================================================
  // SKENARIO CAPTURE
  // =========================================================================

  // 01 — Dashboard List PKB Canvasing
  console.log('01 Dashboard List PKB Canvasing');
  await openPage();
  await shot('list-canvasing-01-dashboard', { fullPage: true });

  // 01b — Dashboard: empty state hasil pencarian
  console.log('01b Dashboard — empty state pencarian');
  await evaluate(`
    (function () {
      var i = document.getElementById('pkbSearchInput');
      i.value = 'XYZ-9999';
      i.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()
  `);
  await waitFor(`document.getElementById('pkbEmpty').style.display === 'block'`);
  await shot('list-canvasing-01b-dashboard-empty', { fullPage: true });

  // 01c — Dashboard: filter rentang tanggal aktif
  console.log('01c Dashboard — filter rentang tanggal');
  await openPage();
  await evaluate(`
    (function () {
      var from = document.getElementById('pkbDateFromDisplay');
      var to = document.getElementById('pkbDateToDisplay');
      from.value = '25-08-2024';
      from.dispatchEvent(new Event('input', { bubbles: true }));
      to.value = '26-08-2024';
      to.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()
  `);
  await waitFor(`document.getElementById('pkbDateClear').disabled === false`);
  await shot('list-canvasing-01c-dashboard-date-filter', { fullPage: true });

  // 01d — Pop-up Pilih Data Canvasing (dibuka dari tombol PKB Baru)
  console.log('01d Pop-up Pilih Data Canvasing');
  await openPage();
  await evaluate(`document.getElementById('btnNewPkb').click()`);
  await waitFor(`document.getElementById('pickCanvasingModal').style.display === 'flex'`);
  await scrollTop();
  await shot('list-canvasing-01d-modal-pilih-canvasing');

  // 01e — Pop-up Pilih Data Canvasing: satu data terpilih (tombol Lanjut aktif)
  console.log('01e Pop-up Pilih Data Canvasing — data terpilih');
  await evaluate(`document.querySelector('#canvasingPickList .canvasing-pick-item').click()`);
  await waitFor(`document.getElementById('btnPickCanvasingConfirm').disabled === false`);
  await shot('list-canvasing-01e-modal-pilih-canvasing-selected');

  // 01f — Pop-up Pilih Data Canvasing: empty state (semua canvasing sudah punya PKB)
  console.log('01f Pop-up Pilih Data Canvasing — empty state');
  await openPage();
  await evaluate(`
    (function () {
      // Simulasi kondisi seluruh data Master Canvasing sudah dibuatkan PKB:
      // setiap canvasing yang belum tertaut diberi entri PKB tiruan. Daftar
      // kartu dashboard tidak dirender ulang sehingga tampilan latar tetap sama.
      masterCanvasingList.forEach(function (c) {
        var taken = samplePkbList.some(function (p) { return p.canvasingId === c.id; });
        if (!taken) {
          samplePkbList.push(Object.assign({}, samplePkbList[0], {
            id: 'PKB-SIMULASI-' + c.id,
            canvasingId: c.id,
          }));
        }
      });
      document.getElementById('btnNewPkb').click();
      return true;
    })()
  `);
  await waitFor(`document.getElementById('canvasingPickEmpty').style.display === 'flex'`);
  await scrollTop();
  await shot('list-canvasing-01f-modal-pilih-canvasing-empty');

  // 01g — Step 1 mode PKB Baru: bar konteks data canvasing terpilih
  console.log('01g Step 1 — Bar konteks Data Canvasing');
  await openPage();
  await evaluate(`document.getElementById('btnNewPkb').click()`);
  await waitFor(`document.getElementById('pickCanvasingModal').style.display === 'flex'`);
  await evaluate(`document.querySelector('#canvasingPickList .canvasing-pick-item').click()`);
  await waitFor(`document.getElementById('btnPickCanvasingConfirm').disabled === false`);
  await evaluate(`document.getElementById('btnPickCanvasingConfirm').click()`);
  await waitFor(`document.getElementById('canvasingContextBar').style.display === 'flex'`);
  await scrollTop();
  await shot('list-canvasing-01g-step1-canvasing-context');

  // 02 — Step 1: Vehicle (dibuka dari kartu PKB pertama)
  console.log('02 Step 1 — Vehicle');
  await openPage();
  await evaluate(OPEN_FIRST_PKB);
  await waitFor(`document.getElementById('stepPane1').style.display === 'block'`);
  await evaluate(SET_FUEL_FULL);
  await shot('list-canvasing-02-step1-vehicle', { fullPage: true });

  // 02b — Step 1: empty state saat data kendaraan dihapus
  console.log('02b Step 1 — Empty State Kendaraan');
  await evaluate(`document.getElementById('btnClearScan').click()`);
  await waitFor(`document.getElementById('vehicleEmptyState').style.display === 'flex'`);
  await shot('list-canvasing-02b-step1-empty-vehicle', { fullPage: true });

  // 02c — Step 1: validasi Kilometer tidak lebih besar dari Kilometer Sebelumnya
  console.log('02c Step 1 — Validasi Kilometer');
  await openPage();
  await evaluate(OPEN_FIRST_PKB);
  await waitFor(`document.getElementById('stepPane1').style.display === 'block'`);
  await evaluate(`
    (function () {
      var i = document.getElementById('kilometerInput');
      i.value = '800';
      i.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()
  `);
  await waitFor(`document.getElementById('kilometerError').classList.contains('show')`);
  await shot('list-canvasing-02c-step1-kilometer-invalid', { fullPage: true });

  // 02d — Step 1: History Service digulir ke riwayat paling lama
  console.log('02d Step 1 — History Service scroll');
  await openPage();
  await evaluate(OPEN_FIRST_PKB);
  await waitFor(`document.getElementById('stepPane1').style.display === 'block'`);
  await evaluate(SET_FUEL_FULL);
  await evaluate(`
    (function () {
      var l = document.getElementById('historyFilledState');
      l.scrollTop = l.scrollHeight;
      l.dispatchEvent(new Event('scroll'));
      return true;
    })()
  `);
  await sleep(400);
  await shot('list-canvasing-02d-step1-history-scroll', { fullPage: true });

  // 03 — Pop-up Input New Vehicle Data (dibuka dari empty state kendaraan)
  console.log('03 Pop-up Input New Vehicle Data');
  await openPage();
  await evaluate(OPEN_FIRST_PKB);
  await waitFor(`document.getElementById('stepPane1').style.display === 'block'`);
  await evaluate(`document.getElementById('btnClearScan').click()`);
  await waitFor(`document.getElementById('vehicleEmptyState').style.display === 'flex'`);
  await evaluate(`document.getElementById('btnInputNewData').click()`);
  await waitFor(`document.getElementById('inputDataModal').style.display === 'flex'`);
  await scrollTop();
  await shot('list-canvasing-03-modal-input-vehicle');

  // 03b — Pop-up Edit Vehicle Data (dibuka dari tombol Edit pada box kendaraan)
  console.log('03b Pop-up Edit Vehicle Data');
  await openPage();
  await evaluate(OPEN_FIRST_PKB);
  await waitFor(`document.getElementById('stepPane1').style.display === 'block'`);
  await evaluate(`document.getElementById('btnEditVehicle').click()`);
  await waitFor(`document.getElementById('inputDataModal').style.display === 'flex'`);
  await scrollTop();
  await shot('list-canvasing-03b-modal-edit-vehicle');

  // 04 — Step 2: Carrier Data
  console.log('04 Step 2 — Carrier Data');
  await openPage();
  await evaluate(OPEN_FIRST_PKB);
  await waitFor(`document.getElementById('stepPane1').style.display === 'block'`);
  await evaluate(`goToStep(2)`);
  await waitFor(`document.getElementById('stepPane2').style.display === 'block'`);
  await shot('list-canvasing-04-step2-carrier', { fullPage: true });

  // 04b — Step 2: tab STNK Information
  console.log('04b Step 2 — Tab STNK Information');
  await evaluate(`document.getElementById('tabStnkInfo').click()`);
  await waitFor(`document.getElementById('tabContentStnk').style.display === 'block'`);
  await shot('list-canvasing-04b-step2-stnk', { fullPage: true });

  // 04c — Step 2: dropdown nomor telepon tersimpan
  console.log('04c Step 2 — Dropdown Saved Phone Number');
  await evaluate(`document.getElementById('tabCarrierInfo').click()`);
  await waitFor(`document.getElementById('tabContentCarrier').style.display === 'block'`);
  await evaluate(`
    (function () {
      var i = document.getElementById('carrierSearchPhone');
      i.scrollIntoView({ block: 'center' });
      // kosongkan kata kunci agar seluruh nomor tersimpan ikut terlihat
      i.value = '';
      i.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()
  `);
  await waitFor(`document.getElementById('carrierPhoneDropdown').classList.contains('open')`);
  await shot('list-canvasing-04c-step2-phone-dropdown');

  // 04d — Step 2: Tanggal Booking & Decline Reason tersembunyi saat Customer Agreement lain dipilih
  console.log('04d Step 2 — Tanggal Booking tersembunyi');
  await openPage();
  await evaluate(OPEN_FIRST_PKB);
  await waitFor(`document.getElementById('stepPane1').style.display === 'block'`);
  await evaluate(`goToStep(2)`);
  await waitFor(`document.getElementById('stepPane2').style.display === 'block'`);
  await evaluate(`
    (function () {
      var s = document.getElementById('lcrAgreement');
      s.value = 'Bersedia Langsung dilakukan Treatment 2';
      s.dispatchEvent(new Event('change', { bubbles: true }));
      s.closest('.content-card').scrollIntoView({ block: 'center' });
      return true;
    })()
  `);
  await waitFor(`document.getElementById('lcrBookingGroup').hidden === true`);
  await shot('list-canvasing-04d-step2-lcr-tanpa-booking');
  await scrollTop();   // kembalikan posisi scroll agar capture berikutnya tidak tergeser

  // 04e — Step 2: Decline Reason tampil saat Customer Agreement "Tidak Bersedia"
  console.log('04e Step 2 — Decline Reason tampil');
  await evaluate(`
    (function () {
      var s = document.getElementById('lcrAgreement');
      s.value = 'Tidak Bersedia';
      s.dispatchEvent(new Event('change', { bubbles: true }));
      s.closest('.content-card').scrollIntoView({ block: 'center' });
      return true;
    })()
  `);
  await waitFor(`document.getElementById('lcrDeclineGroup').hidden === false`);
  await shot('list-canvasing-04e-step2-lcr-decline-reason');
  await scrollTop();

  // 05 — Step 3: Cek Aja Dulu
  console.log('05 Step 3 — Cek Aja Dulu');
  await evaluate(`goToStep(3)`);
  await waitFor(`document.getElementById('stepPane3').style.display === 'block'`);
  await shot('list-canvasing-05-step3-cek-aja-dulu', { fullPage: true });

  // 05b — Step 3: state error validasi
  console.log('05b Step 3 — Validasi Cek Aja Dulu');
  await evaluate(TRIGGER_CEK_AJA_DULU_ERRORS);
  await waitFor(`document.querySelectorAll('.cek-error-text.show').length === 4`);
  await shot('list-canvasing-05b-step3-validasi', { fullPage: true });

  // 06 — Step 4: Service & Parts
  console.log('06 Step 4 — Service & Parts');
  await evaluate(FILL_CEK_AJA_DULU);   // Step 3 wajib valid sebelum lanjut
  await evaluate(`goToStep(4)`);
  await waitFor(`document.getElementById('stepPane4').style.display === 'block'`);
  await shot('list-canvasing-06-step4-service-parts', { fullPage: true });

  // 06b — Step 4: dropdown Source Request terbuka (part dengan stok kurang)
  console.log('06b Step 4 — Dropdown Source Request');
  await evaluate(`
    (function () {
      var g = document.querySelector('.sp-source-request-group');
      g.scrollIntoView({ block: 'center' });
      document.getElementById('sourceReqTrigger').click();
      return true;
    })()
  `);
  await waitFor(`document.getElementById('sourceReqMenu').classList.contains('show')`);
  await shot('list-canvasing-06b-step4-source-request');

  // 07 — Step 5: Summary
  console.log('07 Step 5 — Summary');
  await evaluate(`goToStep(5)`);
  await waitFor(`document.getElementById('stepPane5').style.display === 'block'`);
  await scrollTop();
  await shot('list-canvasing-07-step5-summary', { fullPage: true });

  // 08 — CAD Report (Honda Safety Check Sheet) dari tombol Save & Print CAD
  console.log('08 CAD Report — Honda Safety Check Sheet');
  await openPage();
  await evaluate(OPEN_FIRST_PKB);
  await evaluate(`goToStep(3)`);
  await waitFor(`document.getElementById('stepPane3').style.display === 'block'`);
  await evaluate(OPEN_CAD_REPORT);
  await waitFor(`document.getElementById('cadReportOverlay').classList.contains('is-open')`);
  await shot('list-canvasing-08-cad-report');

  console.log('\nSelesai. Perbarui atribut ukuran pada list-canvasing.md');
  console.log('bila dimensi yang tercetak di atas berubah.');
} catch (err) {
  console.error('\nGAGAL:', err.message);
  process.exitCode = 1;
} finally {
  try { ws?.close(); } catch { /* koneksi sudah tertutup */ }
  browser.kill();
}
