# List Canvasing Grid-View Landing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Booking/Non-Booking method-selection landing page of `List Canvasing/` with a PKB Canvasing dashboard: a responsive card grid of PKB entries with status (Belum Dijalankan / Sedang Dijalankan / Sudah Dijalankan), stats chips, search, and status filter. Clicking a card opens the existing 5-step wizard prefilled; "+ PKB Baru" opens it empty.

**Architecture:** Pure static site (HTML + CSS + vanilla JS), no build step, no test framework. All three files live in `List Canvasing/`. The wizard (`#wizardContentView`) is untouched except for the entry point and one dropdown option. Spec: `docs/superpowers/specs/2026-09-01-list-canvasing-grid-view-design.md`.

**Tech Stack:** Vanilla HTML/CSS/JS, Plus Jakarta Sans, CSS custom properties defined in `List Canvasing/styles.css:1-31`.

## Global Constraints

- Use ONLY existing design tokens from `List Canvasing/styles.css:1-31` (`--primary: #ea580c`, `--text-main: #1e293b`, `--border-color: #e2e8f0`, `--radius-lg: 16px`, `--shadow-md`, `--transition`).
- Language of UI copy: Russian/English mix exactly as the rest of the page (headings EN, helper text ID).
- No new dependencies, no frameworks, no build tooling.
- The page runs inside an iframe of the root portal (`index.html`); the `in-iframe` class on `<html>` (set by the script at `List Canvasing/index.html:16-20`) must be respected in layout CSS (pattern: `.in-iframe .method-selection-section` at styles.css:3206).
- Every `init*()` function defined MUST be registered in the `DOMContentLoaded` handler (app.js:109-123) — unregistered init functions have dead listeners.
- Clean cutover: after this plan, `grep -ri "booking\|method-selection\|method-card\|selectBookingMethod\|sampleBookings" "List Canvasing/"` must return ZERO matches in code (comments included).
- Verification is browser-driven (no test framework exists); every task ends with a browser check or a grep check.

---

### Task 1: HTML — Replace landing section, delete booking modal, trim Queue Type

**Files:**
- Modify: `List Canvasing/index.html:64-116` (landing section)
- Modify: `List Canvasing/index.html:2138-2243` (booking modal — delete)
- Modify: `List Canvasing/index.html:1935-1941` (Queue Type select)

**Interfaces:**
- Consumes: nothing (pure markup).
- Produces: DOM ids used by Task 3 JS — `pkbDashboardView`, `pkbStatTotal`, `pkbStatPending`, `pkbStatProgress`, `pkbStatDone`, `pkbSearchInput`, `pkbFilterAll`, `pkbFilterPending`, `pkbFilterProgress`, `pkbFilterDone`, `pkbGrid`, `pkbEmpty`, `btnNewPkb`. Also produces the wizard container id `wizardContentView` (unchanged, at index.html:119).

- [ ] **Step 1: Replace the landing section**

Delete lines 64-116 (the whole `<section class="method-selection-section" id="methodSelectionView">...</section>`, from the `<!-- View 1: ... -->` comment through its closing `</section>`) and insert in its place:

```html
        <!-- View 1: PKB Canvasing Dashboard (Default Landing Screen) -->
        <section class="pkb-dashboard-section" id="pkbDashboardView">
          <div class="pkb-dashboard-container">
            <!-- Page Header -->
            <div class="pkb-page-header">
              <div>
                <h1 class="pkb-page-title">List PKB Canvasing</h1>
                <p class="pkb-page-subtitle">Dashboard canvasing hari ini · <span id="pkbDate"></span></p>
              </div>
              <button type="button" class="btn-new-pkb" id="btnNewPkb">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>PKB Baru</span>
              </button>
            </div>

            <!-- Stats Chips (clickable = status filter) -->
            <div class="pkb-stats-row">
              <button type="button" class="pkb-stat-chip" id="pkbStatTotal" data-filter="all">
                <span class="pkb-stat-num" id="pkbStatTotalNum">0</span>
                <span class="pkb-stat-label">Total</span>
              </button>
              <button type="button" class="pkb-stat-chip stat-pending" id="pkbStatPending" data-filter="pending">
                <span class="pkb-stat-num" id="pkbStatPendingNum">0</span>
                <span class="pkb-stat-label">Belum Dijalankan</span>
              </button>
              <button type="button" class="pkb-stat-chip stat-progress" id="pkbStatProgress" data-filter="progress">
                <span class="pkb-stat-num" id="pkbStatProgressNum">0</span>
                <span class="pkb-stat-label">Sedang Dijalankan</span>
              </button>
              <button type="button" class="pkb-stat-chip stat-done" id="pkbStatDone" data-filter="done">
                <span class="pkb-stat-num" id="pkbStatDoneNum">0</span>
                <span class="pkb-stat-label">Sudah Dijalankan</span>
              </button>
            </div>

            <!-- Toolbar: search + status pills -->
            <div class="pkb-toolbar">
              <div class="pkb-search-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input type="text" id="pkbSearchInput" class="form-input" placeholder="Cari plat / kode PKB / pelanggan...">
              </div>
              <div class="pkb-filter-pills">
                <button type="button" class="pkb-pill active" id="pkbFilterAll" data-filter="all">Semua</button>
                <button type="button" class="pkb-pill" id="pkbFilterPending" data-filter="pending">Belum</button>
                <button type="button" class="pkb-pill" id="pkbFilterProgress" data-filter="progress">Proses</button>
                <button type="button" class="pkb-pill" id="pkbFilterDone" data-filter="done">Selesai</button>
              </div>
            </div>

            <!-- Card Grid -->
            <div class="pkb-grid" id="pkbGrid">
              <!-- Cards rendered by app.js renderPkbGrid() -->
            </div>

            <!-- Empty State -->
            <div class="pkb-empty" id="pkbEmpty" style="display: none;">
              <p>Tidak ada data PKB yang cocok.</p>
            </div>
          </div>
        </section>
```

- [ ] **Step 2: Delete the booking modal**

Delete lines 2138-2243: the comment `<!-- Modal: Pilih Jadwal Booking Canvasing -->` and the whole `<div class="modal-overlay" id="bookingSelectModal" ...>...</div>` block (ends right before `<!-- Modal: Input New Vehicle Data -->`).

- [ ] **Step 3: Remove the "Booking" option from Queue Type**

In the Summary step markup (around line 1938), the select is:

```html
<select id="summaryQueueType" class="summary-select-pill">
  <option value="Regular" selected>Regular</option>
  <option value="Booking">Booking</option>
  <option value="Fast Track">Fast Track</option>
```

Delete the single line `<option value="Booking">Booking</option>` so only `Regular` (selected) and `Fast Track` remain.

- [ ] **Step 4: Browser check**

Run: open `List Canvasing/index.html` in the browser.
Expected: page renders; dashboard header/stats/toolbar/grid container visible (grid empty, cards come in Task 3); wizard NOT visible; no modal appears. Console may show errors about `initMethodSelection` missing elements — acceptable until Task 3.

---

### Task 2: CSS — Delete old styles, add dashboard styles

**Files:**
- Modify: `List Canvasing/styles.css:3187-3540` (method-selection + booking modal styles)
- Modify: `List Canvasing/styles.css` (append new styles before the final media query block)

**Interfaces:**
- Consumes: tokens from styles.css:1-31.
- Produces: class names used by Task 1 HTML and Task 3 JS: `.pkb-dashboard-section`, `.pkb-dashboard-container`, `.pkb-page-header`, `.pkb-page-title`, `.pkb-page-subtitle`, `.btn-new-pkb`, `.pkb-stats-row`, `.pkb-stat-chip` (+ `.stat-pending`, `.stat-progress`, `.stat-done`, `.active`), `.pkb-stat-num`, `.pkb-stat-label`, `.pkb-toolbar`, `.pkb-search-wrap`, `.pkb-filter-pills`, `.pkb-pill` (+ `.active`), `.pkb-grid`, `.pkb-card` (+ `.status-pending`, `.status-progress`, `.status-done`), `.pkb-card-top`, `.pkb-code-pill`, `.pkb-status-badge`, `.pkb-plate`, `.pkb-model`, `.pkb-meta`, `.pkb-meta-row`, `.pkb-empty`.

- [ ] **Step 1: Delete the method-selection and booking-modal CSS**

Delete these contiguous blocks (they span roughly styles.css:3187-3540; locate by these selectors):
- `.method-selection-section` through `.in-iframe .method-selection-section` block
- `.method-selection-container`, `.method-header`, `.mpm-brand-logo`, `.method-title`
- `.method-cards-grid`, `.method-card`, `.card-booking`, `.card-non-booking`, `.method-card:hover`, `.method-card-icon-box`, `.method-card-icon`, `.method-card:hover .method-card-icon`, `.method-card-label`
- All `.booking-*` selectors: `.booking-modal-card`, `.booking-search-bar`, `.booking-search-input-wrap`, `.booking-list-label`, `.booking-cards-list`, `.booking-item-card` (+ `.active`, hover), `.booking-item-top`, `.booking-code-pill`, `.booking-time-badge`, `.booking-item-main`, `.booking-plate-num`, `.booking-model-name`, `.booking-item-meta`, `.btn-manual-booking`
- The `@media (max-width: 640px)` rules that reference `.method-cards-grid` and `.method-card`

- [ ] **Step 2: Append the dashboard CSS**

Add at the end of styles.css:

```css
/* ===================== PKB Dashboard (Grid View Landing) ===================== */
.pkb-dashboard-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px 24px;
}

.in-iframe .pkb-dashboard-section {
  min-height: calc(100vh - 100px);
  padding: clamp(24px, 4vh, 48px) clamp(20px, 3vw, 40px);
}

.pkb-dashboard-container {
  width: 100%;
  max-width: 1200px;
}

.pkb-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.pkb-page-title {
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.3px;
}

.pkb-page-subtitle {
  margin-top: 4px;
  font-size: 14px;
  color: var(--text-muted);
}

.btn-new-pkb {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--primary);
  color: #ffffff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
}

.btn-new-pkb:hover {
  background: var(--primary-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.pkb-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.pkb-stat-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 14px 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
}

.pkb-stat-chip:hover {
  border-color: var(--primary-border);
  box-shadow: var(--shadow-md);
}

.pkb-stat-chip.active {
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary);
}

.pkb-stat-num {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-main);
}

.pkb-stat-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.2px;
}

.pkb-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.pkb-search-wrap {
  position: relative;
  flex: 1;
  min-width: 240px;
  max-width: 420px;
}

.pkb-search-wrap svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  pointer-events: none;
}

.pkb-search-wrap .form-input {
  width: 100%;
  padding-left: 42px;
}

.pkb-filter-pills {
  display: flex;
  gap: 8px;
}

.pkb-pill {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text-muted);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.pkb-pill:hover {
  border-color: var(--primary-border);
  color: var(--text-main);
}

.pkb-pill.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
}

.pkb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.pkb-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
  font-family: inherit;
}

.pkb-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary-border);
  box-shadow: var(--shadow-lg);
}

.pkb-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.pkb-code-pill {
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--primary-light);
  border: 1px solid var(--primary-border);
  color: var(--primary-hover);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.pkb-status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.pkb-card.status-pending .pkb-status-badge {
  background: #f1f5f9;
  color: #64748b;
}

.pkb-card.status-progress .pkb-status-badge {
  background: #dbeafe;
  color: #1d4ed8;
}

.pkb-card.status-done .pkb-status-badge {
  background: #dcfce7;
  color: #15803d;
}

.pkb-plate {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: 0.5px;
}

.pkb-model {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: -6px;
}

.pkb-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 10px;
  border-top: 1px dashed var(--border-color);
}

.pkb-meta-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12.5px;
  color: var(--text-muted);
}

.pkb-meta-row strong {
  color: var(--text-main);
  font-weight: 600;
}

.pkb-meta-row .pkb-progress-hint {
  color: var(--primary-hover);
  font-weight: 700;
}

.pkb-empty {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 720px) {
  .pkb-stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .pkb-page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-new-pkb {
    justify-content: center;
  }
}
```

- [ ] **Step 3: Grep check**

Run: `grep -n "method-card\|method-selection\|booking-item\|booking-modal\|booking-search\|booking-list\|booking-cards\|booking-code\|booking-time\|booking-plate\|booking-model\|btn-manual-booking" "List Canvasing/styles.css"`
Expected: no output.

---

### Task 3: JS — Replace booking flow with PKB dashboard logic

**Files:**
- Modify: `List Canvasing/app.js:5-6` (globals)
- Modify: `List Canvasing/app.js:8-~40` (sampleBookings → samplePkbList)
- Modify: `List Canvasing/app.js:109-123` (DOMContentLoaded registration)
- Modify: `List Canvasing/app.js:125-294` (initMethodSelection + showMethodSelection + selectBookingMethod → new functions)

**Interfaces:**
- Consumes: DOM ids from Task 1; existing globals `window.loadCustomVehicle(data)` (vehicle fill, used at app.js:264-266), `window.goToStep(n)` (step navigation, used at app.js:291-293), `showToast(msg)` (existing helper).
- Produces: `samplePkbList` (array), `initPkbDashboard()`, `renderPkbGrid()`, `openPkbWizard(entry)` (entry: object from samplePkbList or `null`), `showPkbDashboard()`.

- [ ] **Step 1: Replace globals and sample data**

Replace lines 5-6 (`currentMethod` / `activeBooking`) and the `sampleBookings` array (lines 8-~40) with:

```js
// PKB Canvasing entries for simulation (status: 'pending' | 'progress' | 'done')
const samplePkbList = [
  { id: 'PKB-20240826-001', plate: 'AG 1000 ELM', model: 'VG - VARIO 125 CBS ISS', customer: 'Achmad Munib', engine: 'JB91E1260677', frame: 'MH1J891158K260', phone: '081234567890', service: 'Servis Berkala & Ganti Oli MPX2', time: '09:30', mechanic: 'Andi', status: 'progress', step: 3 },
  { id: 'PKB-20240826-002', plate: 'B 4592 KLR', model: 'VG - VARIO 160 ABS', customer: 'Budi Santoso', engine: 'KF11E1084920', frame: 'MH1KF1118PK092144', phone: '085712345678', service: 'Cek CVT & Kampas Rem', time: '10:45', mechanic: 'Rudi', status: 'pending', step: 0 },
  { id: 'PKB-20240826-003', plate: 'L 2831 AB', model: 'VG - SCOOPY PRESTIGE', customer: 'Siti Rahmawati', engine: 'JM31E2948102', frame: 'MH1JM3116PK748291', phone: '087898765432', service: 'Ganti Busi & Oli MPX2', time: '13:15', mechanic: 'Andi', status: 'pending', step: 0 },
  { id: 'PKB-20240826-004', plate: 'AB 1234 CD', model: 'VG - NMAX 155 CONNECTED', customer: 'Dewi Lestari', engine: 'B6NE1123456', frame: 'MH1B6NE11PK123456', phone: '081122334455', service: 'Servis Besar 10.000 km', time: '08:00', mechanic: 'Joko', status: 'pending', step: 0 },
  { id: 'PKB-20240826-005', plate: 'B 6789 XYZ', model: 'VG - BEAT SPORTY CBS', customer: 'Eko Prasetyo', engine: 'K1FJ2233445', frame: 'MH1K1FJ22PK223344', phone: '085566778899', service: 'Ganti Oli & Tune Up', time: '11:20', mechanic: 'Rudi', status: 'progress', step: 4 },
  { id: 'PKB-20240826-006', plate: 'D 4321 EF', model: 'VG - PCX 160 ABS', customer: 'Fitri Handayani', engine: 'JKE1EE556677', frame: 'MH1JKE11PK556677', phone: '081900112233', service: 'Cek Aki & Rem Depan', time: '14:00', mechanic: 'Joko', status: 'progress', step: 2 },
  { id: 'PKB-20240826-007', plate: 'H 9876 GH', model: 'VG - LEXI 125 KEYLESS', customer: 'Gunawan Wibowo', engine: 'F4SE1198877', frame: 'MH1F4SE11PK119887', phone: '082133445566', service: 'Servis Berkala & Ganti Oli MPX2', time: '09:00', mechanic: 'Andi', status: 'done', step: 5 },
  { id: 'PKB-20240826-008', plate: 'N 5555 IJ', model: 'VG - VARIO 125 CBS', customer: 'Hendra Saputra', engine: 'JB9NE2244668', frame: 'MH1JB9NEPK224466', phone: '083899887766', service: 'Ganti Roller & V-Belt', time: '15:30', mechanic: 'Rudi', status: 'done', step: 5 },
];
```

- [ ] **Step 2: Register init in DOMContentLoaded**

In the `DOMContentLoaded` handler (app.js:109-123), find the call to `initMethodSelection()` (it is in the elided lines 110-118) and replace it with `initPkbDashboard();`. Keep all other registrations untouched.

- [ ] **Step 3: Replace the method-selection block (lines 125-294)**

Delete `initMethodSelection`, `showMethodSelection`, `selectBookingMethod` entirely and insert:

```js
// PKB Dashboard (Landing Page Logic: grid of PKB entries)
const PKB_STATUS_LABEL = {
  pending: 'Belum Dijalankan',
  progress: 'Sedang Dijalankan',
  done: 'Sudah Dijalankan',
};

const PKB_STEP_NAMES = ['Vehicle', 'Carrier Data', 'Cek Aja Dulu', 'Service & Parts', 'Summary'];

let pkbFilter = 'all';
let pkbQuery = '';

function initPkbDashboard() {
  const btnNew = document.getElementById('btnNewPkb');
  const searchInput = document.getElementById('pkbSearchInput');
  const chips = document.querySelectorAll('.pkb-stat-chip');
  const pills = document.querySelectorAll('.pkb-pill');

  if (btnNew) {
    btnNew.addEventListener('click', () => {
      openPkbWizard(null);
      showToast('Canvasing baru dimulai (form kosong)');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      pkbQuery = e.target.value.toLowerCase().trim();
      renderPkbGrid();
    });
  }

  const setFilter = (f) => {
    pkbFilter = f;
    chips.forEach(c => c.classList.toggle('active', c.dataset.filter === f));
    pills.forEach(p => p.classList.toggle('active', p.dataset.filter === f));
    renderPkbGrid();
  };

  chips.forEach(c => c.addEventListener('click', () => setFilter(c.dataset.filter)));
  pills.forEach(p => p.addEventListener('click', () => setFilter(p.dataset.filter)));

  // Initial date label
  const dateEl = document.getElementById('pkbDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  renderPkbGrid();

  // Deep links from the parent portal (kept for compatibility)
  const hash = window.location.hash;
  if (hash === '#new') {
    openPkbWizard(null);
  } else {
    showPkbDashboard();
  }

  // Listen for reset command from parent portal
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'RESET_VIEW') {
      showPkbDashboard();
    }
  });
}

function showPkbDashboard() {
  const dashView = document.getElementById('pkbDashboardView');
  const wizardView = document.getElementById('wizardContentView');
  if (dashView) dashView.style.display = 'flex';
  if (wizardView) wizardView.style.display = 'none';

  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'UPDATE_CRUMB', module: 'list', subCrumb: 'List PKB' }, '*');
  }
}

function renderPkbGrid() {
  const grid = document.getElementById('pkbGrid');
  const empty = document.getElementById('pkbEmpty');
  if (!grid) return;

  const filtered = samplePkbList.filter(p => {
    const matchStatus = pkbFilter === 'all' || p.status === pkbFilter;
    const hay = `${p.plate} ${p.id} ${p.customer} ${p.model}`.toLowerCase();
    const matchQuery = !pkbQuery || hay.includes(pkbQuery);
    return matchStatus && matchQuery;
  });

  // Stats always reflect the full list
  const counts = {
    all: samplePkbList.length,
    pending: samplePkbList.filter(p => p.status === 'pending').length,
    progress: samplePkbList.filter(p => p.status === 'progress').length,
    done: samplePkbList.filter(p => p.status === 'done').length,
  };
  const setNum = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setNum('pkbStatTotalNum', counts.all);
  setNum('pkbStatPendingNum', counts.pending);
  setNum('pkbStatProgressNum', counts.progress);
  setNum('pkbStatDoneNum', counts.done);

  grid.innerHTML = filtered.map(p => {
    const stepHint = p.status === 'done'
      ? 'Selesai'
      : p.step > 0
        ? `Step ${p.step}/5 · ${PKB_STEP_NAMES[p.step - 1]}`
        : 'Belum mulai';
    return `
      <button type="button" class="pkb-card status-${p.status}" data-pkb-id="${p.id}">
        <div class="pkb-card-top">
          <span class="pkb-code-pill">${p.id}</span>
          <span class="pkb-status-badge">${PKB_STATUS_LABEL[p.status]}</span>
        </div>
        <div class="pkb-plate">${p.plate}</div>
        <div class="pkb-model">${p.model}</div>
        <div class="pkb-meta">
          <div class="pkb-meta-row"><span>Pelanggan</span><strong>${p.customer}</strong></div>
          <div class="pkb-meta-row"><span>Layanan</span><strong>${p.service}</strong></div>
          <div class="pkb-meta-row"><span>Jam</span><strong>${p.time} WIB</strong></div>
          <div class="pkb-meta-row"><span>Mekanik</span><strong>${p.mechanic}</strong></div>
          <div class="pkb-meta-row"><span>Progres</span><span class="pkb-progress-hint">${stepHint}</span></div>
        </div>
      </button>`;
  }).join('');

  if (empty) empty.style.display = filtered.length === 0 ? 'block' : 'none';

  grid.querySelectorAll('.pkb-card').forEach(card => {
    card.addEventListener('click', () => {
      const entry = samplePkbList.find(p => p.id === card.dataset.pkbId);
      if (entry) openPkbWizard(entry);
    });
  });
}

function openPkbWizard(entry) {
  const dashView = document.getElementById('pkbDashboardView');
  const wizardView = document.getElementById('wizardContentView');

  if (dashView) dashView.style.display = 'none';
  if (wizardView) {
    wizardView.style.display = 'block';
    wizardView.style.animation = 'fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  if (entry) {
    // Auto fill vehicle
    const scanInput = document.getElementById('scanVehicleInput');
    if (scanInput) scanInput.value = entry.engine;
    if (window.loadCustomVehicle) {
      window.loadCustomVehicle(entry);
    }
    // Auto fill carrier
    const carrierPhone = document.getElementById('carrierInputPhone');
    const carrierFirst = document.getElementById('carrierFirstName');
    const carrierLast = document.getElementById('carrierLastName');
    const searchPhone = document.getElementById('carrierSearchPhone');
    if (carrierPhone) carrierPhone.value = entry.phone;
    if (searchPhone) searchPhone.value = entry.phone;
    const names = entry.customer.split(' ');
    if (carrierFirst) carrierFirst.value = names[0] || '';
    if (carrierLast) carrierLast.value = names.slice(1).join(' ') || '';
    showToast(`Data PKB ${entry.id} dimuat (${entry.plate})`);
  }

  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'UPDATE_CRUMB', module: 'list', subCrumb: entry ? entry.plate : 'PKB Baru' }, '*');
  }

  // Reset to Step 1
  if (window.goToStep) {
    window.goToStep(1);
  }
}
```

- [ ] **Step 4: Sweep remaining references**

Run: `grep -n "selectBookingMethod\|sampleBookings\|currentMethod\|activeBooking\|methodSelectionView\|bookingSelectModal\|showMethodSelection\|initMethodSelection\|summaryQueueType" "List Canvasing/app.js"`
Expected: only the `summaryQueueType` element reads inside wizard code that SETS it (there must be none left — delete any line that assigns `.value = 'Booking'` or `.value = 'Regular'` programmatically). Fix every remaining hit by deleting the dead code.

- [ ] **Step 5: Browser check**

Open `List Canvasing/index.html` in the browser:
- 8 cards render; badges: 3 slate "Belum Dijalankan", 3 blue "Sedang Dijalankan", 2 green "Sudah Dijalankan".
- Stat chips show 8 / 3 / 3 / 2.
- Click chip "Belum" → 3 cards; pill "Semua" → 8 cards; type "vario" in search → only Vario models.
- Click card "AG 1000 ELM" → wizard opens at step 1 with engine `JB91E1260677` in scan input, vehicle box shows plate AG 1000 ELM.
- Back in browser: click "PKB Baru" → wizard opens with empty scan input.
- No console errors.

---

### Task 4: Full verification + commit

**Files:**
- Verify: all three files in `List Canvasing/`

**Interfaces:**
- Consumes: Tasks 1-3 complete.
- Produces: committed, working grid-view landing.

- [ ] **Step 1: Clean-cutover grep**

Run: `grep -rin "booking\|method-selection\|method-card\|pilih metode" "List Canvasing/index.html" "List Canvasing/styles.css" "List Canvasing/app.js"`
Expected: ZERO matches. If any match appears, delete the dead code and re-run.

- [ ] **Step 2: Iframe integration check**

Open the root portal `index.html` in the browser, click "List Canvasing (PKB)" in the sidebar:
- The dashboard renders inside the iframe with correct padding (`.in-iframe` rule active).
- Breadcrumb updates to "List PKB" when the dashboard shows, and to the plate when a card is clicked (via `UPDATE_CRUMB` postMessage — verify the root portal `app.js` handles `UPDATE_CRUMB`; if it only handles known subCrumb values, no change needed, the crumb simply shows the plate text).
- Navigate away and back: dashboard shows again (module iframe reload).

- [ ] **Step 3: Responsive check**

In the browser, set viewport to 800px and 360px width:
- 800px: 2 cards per row; stats 4-up.
- 360px: 1 card per row; stats 2-up; header stacks (button full-width).

- [ ] **Step 4: Commit**

```bash
git add "List Canvasing/index.html" "List Canvasing/styles.css" "List Canvasing/app.js"
git commit -m "feat(list-canvasing): replace Booking/Non-Booking landing with PKB grid dashboard"
```
