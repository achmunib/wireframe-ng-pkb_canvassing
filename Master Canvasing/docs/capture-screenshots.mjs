/**
 * Capture Screenshot Dokumentasi — Modul Master Canvasing
 * =============================================================================
 *
 * Menghasilkan ulang seluruh screenshot yang dipakai pada "master-canvasing.md".
 * Jalankan setiap kali tampilan modul berubah agar dokumentasi tetap sinkron.
 *
 * CARA PAKAI (dari folder mana pun):
 *
 *     node "Master Canvasing/docs/capture-screenshots.mjs"
 *
 * Syarat:
 *   - Node.js 18+ (butuh fetch & WebSocket bawaan; diuji pada Node 24)
 *   - Google Chrome atau Microsoft Edge terpasang
 *     (bila terpasang di lokasi tidak umum, set variabel CHROME_PATH)
 *
 * Cara kerja:
 *   Menjalankan browser headless, membuka "Master Canvasing/index.html" secara
 *   langsung dari file system, lalu mengendalikan halaman melalui Chrome
 *   DevTools Protocol untuk membuka tiap step & pop-up, kemudian menyimpan
 *   screenshot ke folder "docs/attachments".
 *
 * Menambah screenshot baru:
 *   Tambahkan blok baru pada bagian "SKENARIO CAPTURE" di bawah, lalu tautkan
 *   berkas hasilnya pada "master-canvasing.md" dengan format:
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
const DOCS_DIR = dirname(fileURLToPath(import.meta.url));       // .../Master Canvasing/docs
const MODULE_DIR = dirname(DOCS_DIR);                            // .../Master Canvasing
const OUT_DIR = join(DOCS_DIR, 'attachments');
const PAGE_FILE = join(MODULE_DIR, 'index.html');
const PROFILE_DIR = join(tmpdir(), 'mc-capture-profile');

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
  await waitFor(`!!document.getElementById('pkbTableBody')?.children.length`);
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

/**
 * Menyimpan screenshot.
 * @param {string} name   nama berkas tanpa ekstensi
 * @param {object} opts   { fullPage } — true untuk menangkap seluruh tinggi halaman
 *                        (gunakan false untuk pop-up / modal agar terlihat wajar)
 */
async function shot(name, { fullPage = false } = {}) {
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
  console.log(`  ✔ ${name}.png  (markdown: " =${w / SCALE}x${h / SCALE}")`);
}

// ---------------------------------------------------------------------------
// Data contoh — dipakai agar tabel tidak tampil kosong pada screenshot
// ---------------------------------------------------------------------------
const SEED_PARTS = `
  partsDibawa = [
    { code: '08232-2MB-K0LN1', name: 'AHM OIL MPX2 0.8L',              qty: 12, satuan: 'BOTOL', harga: 'Rp 54.000' },
    { code: '06455-K59-A71',   name: 'PAD SET FR (Kampas Rem Depan)',   qty: 6,  satuan: 'SET',   harga: 'Rp 68.000' },
    { code: '31916-KRM-841',   name: 'SPARK PLUG CPR9EA-9 (Busi NGK)',  qty: 10, satuan: 'PCS',   harga: 'Rp 22.000' }
  ];
  renderPartsDibawa();
`;

const SEED_MECHANICS = `
  mechanicCatalog = [
    { name: 'Kalvin', stall: 'Stall 1', isBusy: true,  currentPkb: '051-PKB-CNVS-2026-DMS000001' },
    { name: 'Rizal',  stall: 'Stall 2', isBusy: true,  currentPkb: '051-PKB-CNVS-2026-DMS000002' },
    { name: 'Agung',  stall: 'Stall 3', isBusy: false, currentPkb: null },
    { name: 'Robin',  stall: 'Stall 4', isBusy: true,  currentPkb: '051-PKB-CNVS-2026-DMS000004' },
    { name: 'Ratna',  stall: 'Stall 5', isBusy: false, currentPkb: null },
    { name: 'Hendri', stall: 'Stall 6', isBusy: false, currentPkb: null }
  ];
  renderMechanicSelectOptions();

  selectedMechanicsList = [
    { name: 'Agung',  stall: 'Stall 3', isBusy: false, currentPkb: null },
    { name: 'Kalvin', stall: 'Stall 1', isBusy: true,  currentPkb: '051-PKB-CNVS-2026-DMS000001' }
  ];
  renderSelectedMechanics();
`;

/**
 * Berkas CSV contoh untuk menguji Upload Part. Sengaja memuat kelima kondisi
 * validasi agar screenshot menampilkan seluruh variasi status.
 */
const SEED_UPLOAD_FILE = `
  (function () {
    var csv = 'Kode Part,Qty\\n'
      + '08232-2MB-K0LN1,12\\n'   /* valid                    */
      + '06455-K59-A71,6\\n'      /* valid                    */
      + '23100-K44-V01,25\\n'     /* melebihi stok (stok 15)  */
      + '99999-XXX-000,4\\n'      /* part tidak terdaftar     */
      + '31916-KRM-841,0\\n';     /* qty tidak valid          */

    var dt = new DataTransfer();
    dt.items.add(new File([csv], 'part_canvasing.csv', { type: 'text/csv' }));

    var input = document.getElementById('fileUploadPart');
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
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

  // =========================================================================
  // SKENARIO CAPTURE
  // =========================================================================

  // 01 — Tabel Master Canvasing
  // Viewport dilebarkan agar kolom Kelurahan tidak terpotong.
  console.log('01 Tabel Master Canvasing');
  await setViewport(1680, VIEW_H);
  await openPage();
  await shot('master-canvasing-01-table-view', { fullPage: true });

  // 01b — Pop-up Filter Kolom Pencarian (Checklist Kolom)
  console.log('01b Pop-up Filter Kolom Pencarian');
  await evaluate(`document.getElementById('btnToggleFilters').click()`);
  await waitFor(`document.getElementById('filterColumnModal').classList.contains('show')`);
  await shot('master-canvasing-01b-filter-column-modal');
  await evaluate(`document.getElementById('btnCloseFilterModal').click()`);

  // 02 — Modal Detail Master Canvasing
  console.log('02 Modal Detail');
  await setViewport();
  await evaluate(`viewCanvasingDetail(1)`);
  await waitFor(`document.getElementById('detailModal').classList.contains('show')`);
  await shot('master-canvasing-02-detail-modal');

  // 03 — Step 1: Informasi Canvasing
  console.log('03 Step 1 — Informasi Canvasing');
  await openPage();
  await evaluate(`document.getElementById('btnCreatePkb').click()`);
  await waitFor(`document.getElementById('stepPane1').style.display !== 'none'`);
  await shot('master-canvasing-03-step1', { fullPage: true });

  // 04 — Step 2: Daftar Part Dibawa (terisi data contoh)
  console.log('04 Step 2 — Part Dibawa');
  await evaluate(`goToStep(2); ${SEED_PARTS}`);
  await waitFor(`document.querySelectorAll('#bodyPartCanvasing tr').length === 3`);
  await shot('master-canvasing-04-step2', { fullPage: true });

  // 05 — Pop-up Tambah Part
  console.log('05 Pop-up Tambah Part');
  await evaluate(`document.getElementById('btnOpenTambahPartModal').click()`);
  await waitFor(`document.getElementById('tambahPartModal').classList.contains('show')`);
  await shot('master-canvasing-05-modal-tambah-part');

  // 06 — Pop-up Upload Part (kondisi awal)
  console.log('06 Pop-up Upload Part');
  await evaluate(`document.getElementById('btnClosePartModal').click()`);
  await sleep(300);
  await evaluate(`document.getElementById('btnOpenUploadPartModal').click()`);
  await waitFor(`document.getElementById('uploadPartModal').classList.contains('show')`);
  await shot('master-canvasing-06-modal-upload-part');

  // 06b — Pop-up Upload Part (hasil pemeriksaan ketersediaan stok)
  console.log('06b Upload Part — hasil validasi');
  await evaluate(SEED_UPLOAD_FILE);
  await waitFor(`document.querySelectorAll('#tbodyPreviewUpload tr').length > 0`);
  await shot('master-canvasing-06b-upload-validasi');

  // 07 — Step 3: Pilih Mekanik (2 mekanik ditugaskan)
  console.log('07 Step 3 — Pilih Mekanik');
  await evaluate(`document.getElementById('btnCancelUploadModal').click()`);
  await sleep(300);
  await evaluate(`goToStep(3); ${SEED_MECHANICS}`);
  await waitFor(`document.querySelectorAll('#bodyMekanikCanvasing tr').length === 2`);
  await shot('master-canvasing-07-step3', { fullPage: true });

  // 08 — Step 4: Summary
  console.log('08 Step 4 — Summary');
  await evaluate(`goToStep(4)`);
  await waitFor(`document.querySelectorAll('#sumPartsTableBody tr').length === 3`);
  await shot('master-canvasing-08-step4', { fullPage: true });

  console.log('\nSelesai. Perbarui atribut ukuran pada master-canvasing.md');
  console.log('bila dimensi yang tercetak di atas berubah.');
} catch (err) {
  console.error('\nGAGAL:', err.message);
  process.exitCode = 1;
} finally {
  try { ws?.close(); } catch { /* koneksi sudah tertutup */ }
  browser.kill();
}
