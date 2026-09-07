// State Management
let currentStep = 1;
const totalSteps = 5;
let currentFuelLevel = 4; // Default full/sample level
// PKB Canvasing entries for simulation (status: 'pending' | 'progress' | 'done')
const samplePkbList = [
  { id: 'PKB-20240826-001', plate: 'AG 1000 ELM', model: 'VG - VARIO 125 CBS ISS', customer: 'Achmad Munib', engine: 'JB91E1260677', frame: 'MH1J891158K260', phone: '081234567890', service: 'Servis Berkala & Ganti Oli MPX2', time: '09:30', mechanic: 'Andi', status: 'progress', step: 3, date: '2024-08-26' },
  { id: 'PKB-20240826-002', plate: 'B 4592 KLR', model: 'VG - VARIO 160 ABS', customer: 'Budi Santoso', engine: 'KF11E1084920', frame: 'MH1KF1118PK092144', phone: '085712345678', service: 'Cek CVT & Kampas Rem', time: '10:45', mechanic: 'Rudi', status: 'pending', step: 0, date: '2024-08-26' },
  { id: 'PKB-20240826-003', plate: 'L 2831 AB', model: 'VG - SCOOPY PRESTIGE', customer: 'Siti Rahmawati', engine: 'JM31E2948102', frame: 'MH1JM3116PK748291', phone: '087898765432', service: 'Ganti Busi & Oli MPX2', time: '13:15', mechanic: 'Andi', status: 'pending', step: 0, date: '2024-08-25' },
  { id: 'PKB-20240826-004', plate: 'AB 1234 CD', model: 'VG - NMAX 155 CONNECTED', customer: 'Dewi Lestari', engine: 'B6NE1123456', frame: 'MH1B6NE11PK123456', phone: '081122334455', service: 'Servis Besar 10.000 km', time: '08:00', mechanic: 'Joko', status: 'pending', step: 0, date: '2024-08-24' },
  { id: 'PKB-20240826-005', plate: 'B 6789 XYZ', model: 'VG - BEAT SPORTY CBS', customer: 'Eko Prasetyo', engine: 'K1FJ2233445', frame: 'MH1K1FJ22PK223344', phone: '085566778899', service: 'Ganti Oli & Tune Up', time: '11:20', mechanic: 'Rudi', status: 'progress', step: 4, date: '2024-08-26' },
  { id: 'PKB-20240826-006', plate: 'D 4321 EF', model: 'VG - PCX 160 ABS', customer: 'Fitri Handayani', engine: 'JKE1EE556677', frame: 'MH1JKE11PK556677', phone: '081900112233', service: 'Cek Aki & Rem Depan', time: '14:00', mechanic: 'Joko', status: 'progress', step: 2, date: '2024-08-23' },
  { id: 'PKB-20240826-007', plate: 'H 9876 GH', model: 'VG - LEXI 125 KEYLESS', customer: 'Gunawan Wibowo', engine: 'F4SE1198877', frame: 'MH1F4SE11PK119887', phone: '082133445566', service: 'Servis Berkala & Ganti Oli MPX2', time: '09:00', mechanic: 'Andi', status: 'done', step: 5, date: '2024-08-25' },
  { id: 'PKB-20240826-008', plate: 'N 5555 IJ', model: 'VG - VARIO 125 CBS', customer: 'Hendra Saputra', engine: 'JB9NE2244668', frame: 'MH1JB9NEPK224466', phone: '083899887766', service: 'Ganti Roller & V-Belt', time: '15:30', mechanic: 'Rudi', status: 'done', step: 5, date: '2024-08-23' },
];

// Sample Vehicle Database for scanning simulation
const sampleVehicles = [
  {
    plate: 'AG 1000 ELM',
    model: 'VG - VARIO 125 CBS ISS',
    engine: 'JB91E1260677',
    frame: 'MH1J891158K260',
    color: 'BLACK',
    year: '2024',
    purchaseDate: '03-05-2024',
    dealer: 'MPM Motor Jombang',
    lastKm: '1000',
    customer: 'Achmad Munib',
    currentKm: '1233',
    reason: 'Inisiatif Sendiri'
  },
  {
    plate: 'B 4592 KLR',
    model: 'VG - VARIO 160 ABS',
    engine: 'KF11E1084920',
    frame: 'MH1KF1118PK092144',
    color: 'MATTE RED',
    year: '2023',
    purchaseDate: '12-08-2023',
    dealer: 'MPM Motor Surabaya',
    lastKm: '12450',
    customer: 'Budi Santoso',
    currentKm: '12500',
    reason: 'Servis Berkala'
  },
  {
    plate: 'L 2831 AB',
    model: 'VG - SCOOPY PRESTIGE',
    engine: 'JM31E2948102',
    frame: 'MH1JM3116PK748291',
    color: 'WHITE',
    year: '2024',
    purchaseDate: '15-01-2024',
    dealer: 'MPM Motor Malang',
    lastKm: '5400',
    customer: 'Siti Rahmawati',
    currentKm: '5450',
    reason: 'Ganti Oli'
  },
  {
    plate: 'AG 5567 QW',
    model: 'VG - BEAT DELUXE CBS',
    engine: 'JM81E1102345',
    frame: 'MH1JM8115MK102345',
    color: 'MATTE BLUE',
    year: '2022',
    purchaseDate: '22-09-2022',
    dealer: 'MPM Motor Kediri',
    lastKm: '18200',
    customer: 'Dwi Prasetyo',
    currentKm: '18350',
    reason: 'Servis Berkala'
  },
  {
    plate: 'N 7781 KH',
    model: 'VG - PCX 160 ABS',
    engine: 'KF41E2210984',
    frame: 'MH1KF4113PK210984',
    color: 'WONDERFUL WHITE',
    year: '2023',
    purchaseDate: '05-02-2023',
    dealer: 'MPM Motor Malang',
    lastKm: '9800',
    customer: 'Rizky Ramadhan',
    currentKm: '9925',
    reason: 'Klaim Garansi'
  },
  {
    plate: 'W 3312 ZC',
    model: 'VG - VARIO 160 CBS',
    engine: 'KF12E1330771',
    frame: 'MH1KF1214RK330771',
    color: 'ADVANCE MATTE BLACK',
    year: '2024',
    purchaseDate: '18-06-2024',
    dealer: 'MPM Motor Sidoarjo',
    lastKm: '2100',
    customer: 'Lina Marlina',
    currentKm: '2240',
    reason: 'Inisiatif Sendiri'
  },
  {
    plate: 'S 9024 TR',
    model: 'VG - GENIO CBS ISS',
    engine: 'JM51E1875220',
    frame: 'MH1JM5112NK875220',
    color: 'GLAM RED',
    year: '2022',
    purchaseDate: '30-11-2022',
    dealer: 'MPM Motor Tuban',
    lastKm: '24600',
    customer: 'Bagus Firmansyah',
    currentKm: '24780',
    reason: 'Servis Berkala'
  },
  {
    plate: 'AE 4408 UD',
    model: 'VG - SUPRA X 125 FI',
    engine: 'JBK1E1449902',
    frame: 'MH1JBK112LK449902',
    color: 'BLACK SILVER',
    year: '2021',
    purchaseDate: '14-03-2021',
    dealer: 'MPM Motor Madiun',
    lastKm: '41200',
    customer: 'Hendra Wijaya',
    currentKm: '41455',
    reason: 'Ganti Oli'
  },
  {
    plate: 'AG 2276 BN',
    model: 'VG - STYLO 160 ABS',
    engine: 'KF71E1005513',
    frame: 'MH1KF7118RK005513',
    color: 'ROYAL MATTE GREEN',
    year: '2024',
    purchaseDate: '09-07-2024',
    dealer: 'MPM Motor Jombang',
    lastKm: '800',
    customer: 'Nadia Safitri',
    currentKm: '940',
    reason: 'Servis Berkala'
  }
];

const sampleCarriers = [
  {
    phone: '085732255998',
    firstName: 'Achmad',
    lastName: 'Munib',
    stnkOwner: 'Achmad Munib',
    stnkPlate: 'AG 1000 ELM',
    stnkAddress: 'Jl. Merdeka No. 45, Jombang'
  },
  {
    phone: '081234567890',
    firstName: 'Achmad',
    lastName: 'Munib',
    stnkOwner: 'Achmad Munib',
    stnkPlate: 'AG 1000 ELM',
    stnkAddress: 'Jl. Merdeka No. 45, Jombang'
  },
  {
    phone: '085712345678',
    firstName: 'Budi',
    lastName: 'Santoso',
    stnkOwner: 'Budi Santoso',
    stnkPlate: 'B 4592 KLR',
    stnkAddress: 'Jl. Raya Darmo No. 112, Surabaya'
  },
  {
    phone: '087898765432',
    firstName: 'Siti',
    lastName: 'Rahmawati',
    stnkOwner: 'Siti Rahmawati',
    stnkPlate: 'L 2831 AB',
    stnkAddress: 'Jl. Soekarno Hatta No. 78, Malang'
  },
  {
    phone: '081122334455',
    firstName: 'Dewi',
    lastName: 'Lestari',
    stnkOwner: 'Dewi Lestari',
    stnkPlate: 'AB 1234 CD',
    stnkAddress: 'Jl. Kaliurang KM 5 No. 21, Yogyakarta'
  },
  {
    phone: '085566778899',
    firstName: 'Eko',
    lastName: 'Prasetyo',
    stnkOwner: 'Eko Prasetyo',
    stnkPlate: 'B 6789 XYZ',
    stnkAddress: 'Jl. Kebon Jeruk Raya No. 9, Jakarta Barat'
  },
  {
    phone: '081900112233',
    firstName: 'Fitri',
    lastName: 'Handayani',
    stnkOwner: 'Fitri Handayani',
    stnkPlate: 'D 4321 EF',
    stnkAddress: 'Jl. Asia Afrika No. 130, Bandung'
  },
  {
    phone: '082133445566',
    firstName: 'Gunawan',
    lastName: 'Wibowo',
    stnkOwner: 'Gunawan Wibowo',
    stnkPlate: 'H 9876 GH',
    stnkAddress: 'Jl. Pandanaran No. 56, Semarang'
  },
  {
    phone: '083899887766',
    firstName: 'Hendra',
    lastName: 'Saputra',
    stnkOwner: 'Hendra Saputra',
    stnkPlate: 'N 5555 IJ',
    stnkAddress: 'Jl. Basuki Rahmat No. 88, Kediri'
  }
];

function findCarrier(query) {
  const key = (query || '').trim().toLowerCase().replace(/[\s-]/g, '');
  if (!key) return null;
  return sampleCarriers.find(c =>
    c.phone.includes(key) ||
    `${c.firstName}${c.lastName}`.toLowerCase().includes(key) ||
    c.stnkPlate.toLowerCase().replace(/\s/g, '').includes(key)
  ) || null;
}

document.addEventListener('DOMContentLoaded', () => {
  initPkbDashboard();
  initStepper();
  initCollapsibleCard();
  initFuelIndicator();
  initKilometerValidation();
  initVehicleScanner();
  initCarrierStep();
  initLcrBookingDate();
  initCekAjaDuluStep();
  initServiceAndPartsStep();
  initSummaryStep();
  initModal();
  initSidebar();
  initLangSwitcher();
  initHistoryShowMore();

  // Deep links from the parent portal (kept for compatibility)
  if (window.location.hash === '#new') {
    openPkbWizard(null);
  } else {
    showPkbDashboard();
  }
});

// PKB Dashboard (Landing Page Logic: grid of PKB entries)
const PKB_STATUS_LABEL = {
  pending: 'Belum Dijalankan',
  progress: 'Sedang Dijalankan',
  done: 'Sudah Dijalankan',
};

const PKB_STEP_NAMES = ['Vehicle', 'Carrier Data', 'Cek Aja Dulu', 'Service & Parts', 'Summary'];

let pkbFilter = 'all';
let pkbQuery = '';
let pkbDateFrom = '';
let pkbDateTo = '';
let pkbCurrentPage = 1;
const pkbPageSize = 5;

function initPkbDashboard() {
  const btnNew = document.getElementById('btnNewPkb');
  const searchInput = document.getElementById('pkbSearchInput');
  const chips = document.querySelectorAll('.pkb-stat-chip');
  const btnPrev = document.getElementById('pkbPrevPage');
  const btnNext = document.getElementById('pkbNextPage');

  if (btnNew) {
    btnNew.addEventListener('click', () => {
      openPkbWizard(null);
      showToast('Canvasing baru dimulai (form kosong)');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      pkbQuery = e.target.value.toLowerCase().trim();
      pkbCurrentPage = 1;
      renderPkbGrid();
    });
  }

  const dateFromInput = document.getElementById('pkbDateFrom');
  const dateToInput = document.getElementById('pkbDateTo');
  const dateFromDisplay = document.getElementById('pkbDateFromDisplay');
  const dateToDisplay = document.getElementById('pkbDateToDisplay');
  const dateClearBtn = document.getElementById('pkbDateClear');

  const isoToDisplay = (iso) => {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length !== 3) return '';
    const [y, m, d] = parts;
    return `${d}-${m}-${y}`;
  };

  const parseDisplayToIso = (str) => {
    if (!str) return null;
    const match = str.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) return null;
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > 2100) return null;
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
    const isoMonth = String(month).padStart(2, '0');
    const isoDay = String(day).padStart(2, '0');
    return `${year}-${isoMonth}-${isoDay}`;
  };

  const formatInputDate = (val) => {
    const rawDigits = val.replace(/\D/g, '').slice(0, 8);
    if (val.endsWith('-') && (val.length === 3 || val.length === 6) && (rawDigits.length === 2 || rawDigits.length === 4)) {
      if (rawDigits.length === 2) return rawDigits + '-';
      if (rawDigits.length === 4) return rawDigits.slice(0, 2) + '-' + rawDigits.slice(2, 4) + '-';
    }
    if (rawDigits.length > 4) {
      return `${rawDigits.slice(0, 2)}-${rawDigits.slice(2, 4)}-${rawDigits.slice(4)}`;
    } else if (rawDigits.length > 2) {
      return `${rawDigits.slice(0, 2)}-${rawDigits.slice(2)}`;
    }
    return rawDigits;
  };

  const syncDateUi = () => {
    if (dateFromDisplay) dateFromDisplay.value = isoToDisplay(pkbDateFrom);
    if (dateToDisplay) dateToDisplay.value = isoToDisplay(pkbDateTo);
    if (dateFromInput) dateFromInput.value = pkbDateFrom;
    if (dateToInput) dateToInput.value = pkbDateTo;
    if (dateClearBtn) dateClearBtn.disabled = !pkbDateFrom && !pkbDateTo;
  };

  const applyDateChange = () => {
    pkbCurrentPage = 1;
    syncDateUi();
    renderPkbGrid();
  };

  const handleDisplayInput = (type) => {
    const displayInput = type === 'from' ? dateFromDisplay : dateToDisplay;
    const nativeInput = type === 'from' ? dateFromInput : dateToInput;
    if (!displayInput) return;

    const formatted = formatInputDate(displayInput.value);
    displayInput.value = formatted;

    if (!formatted) {
      if (type === 'from') {
        pkbDateFrom = '';
        if (nativeInput) nativeInput.value = '';
      } else {
        pkbDateTo = '';
        if (nativeInput) nativeInput.value = '';
      }
      applyDateChange();
      return;
    }

    if (formatted.length === 10) {
      const iso = parseDisplayToIso(formatted);
      if (iso) {
        if (type === 'from') {
          pkbDateFrom = iso;
          if (nativeInput) nativeInput.value = iso;
          if (pkbDateTo && pkbDateFrom > pkbDateTo) {
            pkbDateTo = pkbDateFrom;
            if (dateToInput) dateToInput.value = pkbDateTo;
            if (dateToDisplay) dateToDisplay.value = isoToDisplay(pkbDateTo);
          }
        } else {
          pkbDateTo = iso;
          if (nativeInput) nativeInput.value = iso;
          if (pkbDateFrom && pkbDateTo < pkbDateFrom) {
            pkbDateFrom = pkbDateTo;
            if (dateFromInput) dateFromInput.value = pkbDateFrom;
            if (dateFromDisplay) dateFromDisplay.value = isoToDisplay(pkbDateFrom);
          }
        }
        applyDateChange();
      }
    }
  };

  const handleDisplayBlur = (type) => {
    const displayInput = type === 'from' ? dateFromDisplay : dateToDisplay;
    const currentIso = type === 'from' ? pkbDateFrom : pkbDateTo;
    if (!displayInput) return;

    if (!displayInput.value.trim()) {
      if (currentIso) {
        if (type === 'from') pkbDateFrom = '';
        else pkbDateTo = '';
        applyDateChange();
      }
      return;
    }

    const iso = parseDisplayToIso(displayInput.value);
    if (!iso) {
      displayInput.value = isoToDisplay(currentIso);
    } else {
      displayInput.value = isoToDisplay(iso);
    }
  };

  if (dateFromDisplay) {
    dateFromDisplay.addEventListener('input', () => handleDisplayInput('from'));
    dateFromDisplay.addEventListener('blur', () => handleDisplayBlur('from'));
    dateFromDisplay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.target.blur();
    });
  }

  if (dateToDisplay) {
    dateToDisplay.addEventListener('input', () => handleDisplayInput('to'));
    dateToDisplay.addEventListener('blur', () => handleDisplayBlur('to'));
    dateToDisplay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.target.blur();
    });
  }

  if (dateFromInput) {
    dateFromInput.addEventListener('change', () => {
      pkbDateFrom = dateFromInput.value;
      if (pkbDateTo && pkbDateFrom > pkbDateTo) pkbDateTo = pkbDateFrom;
      applyDateChange();
    });
  }

  if (dateToInput) {
    dateToInput.addEventListener('change', () => {
      pkbDateTo = dateToInput.value;
      if (pkbDateFrom && pkbDateTo < pkbDateFrom) pkbDateFrom = pkbDateTo;
      applyDateChange();
    });
  }

  if (dateClearBtn) {
    dateClearBtn.addEventListener('click', () => {
      pkbDateFrom = '';
      pkbDateTo = '';
      if (dateFromDisplay) dateFromDisplay.value = '';
      if (dateToDisplay) dateToDisplay.value = '';
      applyDateChange();
    });
  }

  const setFilter = (f) => {
    pkbFilter = f;
    pkbCurrentPage = 1;
    chips.forEach(c => c.classList.toggle('active', c.dataset.filter === f));
    renderPkbGrid();
  };

  chips.forEach(c => c.addEventListener('click', () => setFilter(c.dataset.filter)));

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (pkbCurrentPage > 1) {
        pkbCurrentPage--;
        renderPkbGrid();
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const filtered = getFilteredPkbList();
      const totalPages = Math.ceil(filtered.length / pkbPageSize) || 1;
      if (pkbCurrentPage < totalPages) {
        pkbCurrentPage++;
        renderPkbGrid();
      }
    });
  }

  // Initial date label
  const dateEl = document.getElementById('pkbDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  renderPkbGrid();

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

function getFilteredPkbList() {
  return samplePkbList.filter(p => {
    const matchStatus = pkbFilter === 'all' || p.status === pkbFilter;
    const matchDate = (!pkbDateFrom || p.date >= pkbDateFrom) && (!pkbDateTo || p.date <= pkbDateTo);
    const hay = `${p.plate} ${p.id} ${p.customer} ${p.model}`.toLowerCase();
    const matchQuery = !pkbQuery || hay.includes(pkbQuery);
    return matchStatus && matchDate && matchQuery;
  });
}

function renderPkbGrid() {
  const grid = document.getElementById('pkbGrid');
  const empty = document.getElementById('pkbEmpty');
  if (!grid) return;

  const filtered = getFilteredPkbList();

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

  // Pagination calculation
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pkbPageSize) || 1;
  if (pkbCurrentPage > totalPages) pkbCurrentPage = totalPages;
  if (pkbCurrentPage < 1) pkbCurrentPage = 1;

  const startIndex = (pkbCurrentPage - 1) * pkbPageSize;
  const endIndex = Math.min(startIndex + pkbPageSize, totalItems);
  const pagedItems = filtered.slice(startIndex, endIndex);

  grid.innerHTML = pagedItems.map(p => {
    const stepHint = p.status === 'done'
      ? 'Selesai'
      : p.step > 0
        ? `Step ${p.step}/5 · ${PKB_STEP_NAMES[p.step - 1]}`
        : 'Belum mulai';
    return `
      <button type="button" class="pkb-card status-${p.status}" data-pkb-id="${p.id}">
        <div class="pkb-card-lead">
          <div class="pkb-card-top">
            <span class="pkb-code-pill">${p.id}</span>
            <span class="pkb-status-badge">${PKB_STATUS_LABEL[p.status]}</span>
          </div>
          <div class="pkb-plate">${p.plate}</div>
          <div class="pkb-model">${p.model}</div>
        </div>
        <div class="pkb-card-divider"></div>
        <div class="pkb-meta">
          <div class="pkb-meta-col">
            <span class="pkb-meta-label">Pelanggan</span>
            <strong class="pkb-meta-val">${p.customer}</strong>
          </div>
          <div class="pkb-meta-col">
            <span class="pkb-meta-label">Layanan</span>
            <strong class="pkb-meta-val" title="${p.service}">${p.service}</strong>
          </div>
          <div class="pkb-meta-col">
            <span class="pkb-meta-label">Jam</span>
            <strong class="pkb-meta-val">${p.time} WIB</strong>
          </div>
          <div class="pkb-meta-col">
            <span class="pkb-meta-label">Mekanik</span>
            <strong class="pkb-meta-val">${p.mechanic}</strong>
          </div>
          <div class="pkb-meta-col">
            <span class="pkb-meta-label">Progres</span>
            <span class="pkb-progress-hint">${stepHint}</span>
          </div>
        </div>
        <div class="pkb-card-action">
          <span class="pkb-card-arrow" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </div>
      </button>`;
  }).join('');

  if (empty) empty.style.display = filtered.length === 0 ? 'block' : 'none';

  renderPkbPagination(totalItems, totalPages, startIndex, endIndex);

  grid.querySelectorAll('.pkb-card').forEach(card => {
    card.addEventListener('click', () => {
      const entry = samplePkbList.find(p => p.id === card.dataset.pkbId);
      if (entry) openPkbWizard(entry);
    });
  });
}

function renderPkbPagination(totalItems, totalPages, startIndex, endIndex) {
  const wrapper = document.getElementById('pkbPaginationWrapper');
  const startEl = document.getElementById('pkbPageStart');
  const endEl = document.getElementById('pkbPageEnd');
  const totalEl = document.getElementById('pkbPageTotal');
  const btnPrev = document.getElementById('pkbPrevPage');
  const btnNext = document.getElementById('pkbNextPage');
  const numbersContainer = document.getElementById('pkbPageNumbers');

  if (!wrapper) return;

  if (totalItems === 0) {
    wrapper.style.display = 'none';
    return;
  }

  wrapper.style.display = 'flex';
  if (startEl) startEl.textContent = startIndex + 1;
  if (endEl) endEl.textContent = endIndex;
  if (totalEl) totalEl.textContent = totalItems;

  if (btnPrev) btnPrev.disabled = (pkbCurrentPage <= 1);
  if (btnNext) btnNext.disabled = (pkbCurrentPage >= totalPages);

  if (numbersContainer) {
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      html += `<button type="button" class="page-btn ${i === pkbCurrentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    numbersContainer.innerHTML = html;

    numbersContainer.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page, 10);
        if (page && page !== pkbCurrentPage) {
          pkbCurrentPage = page;
          renderPkbGrid();
        }
      });
    });
  }
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
    // Auto fill carrier (dummy dataset, fallback to PKB entry data)
    const names = entry.customer.split(' ');
    const carrier = findCarrier(entry.phone) || {
      phone: entry.phone,
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      stnkOwner: entry.customer,
      stnkPlate: entry.plate,
      stnkAddress: '-'
    };
    if (window.loadCarrierData) window.loadCarrierData(carrier);
    showToast(`Data PKB ${entry.id} dimuat (${entry.plate})`);
  } else {
    const scanInput = document.getElementById('scanVehicleInput');
    if (scanInput) scanInput.value = '';
    if (window.resetVehicleData) {
      window.resetVehicleData();
    }
    // Dummy carrier data for the new PKB draft
    if (window.loadCarrierData) {
      window.loadCarrierData(sampleCarriers[0]);
    }
    showToast('Mode PKB Baru dimulai');
  }

  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'UPDATE_CRUMB', module: 'list', subCrumb: entry ? entry.plate : 'PKB Baru' }, '*');
  }

  // Reset to Step 1
  if (window.goToStep) {
    window.goToStep(1);
  }
}

// Collapsible Vehicle Info Box
function initCollapsibleCard() {
  const headerToggle = document.getElementById('vehicleHeaderToggle');
  const btnCollapse = document.getElementById('btnVehicleCollapse');
  const content = document.getElementById('vehicleBoxContent');

  if (!headerToggle || !content) return;

  const toggleCollapse = () => {
    const isCollapsed = content.classList.toggle('collapsed');
    if (btnCollapse) {
      btnCollapse.classList.toggle('collapsed', isCollapsed);
    }
  };

  headerToggle.addEventListener('click', (e) => {
    // Avoid double trigger if clicking directly on button inside header
    if (e.target.closest('#btnVehicleCollapse')) {
      toggleCollapse();
    } else {
      toggleCollapse();
    }
  });
}

// Stepper Initialization
function initStepper() {
  const stepNodes = document.querySelectorAll('.step-node');
  const btnNext = document.getElementById('btnNext');
  const btnKembali = document.getElementById('btnKembali');
  const nextBtnText = document.getElementById('nextBtnText');

  stepNodes.forEach(node => {
    node.addEventListener('click', () => {
      const step = parseInt(node.dataset.step);
      goToStep(step);
    });
  });

  btnNext.addEventListener('click', () => {
    if (currentStep === 1 && window.validateKilometer && !window.validateKilometer()) {
      showToast(window.kilometerLimitMessage ? window.kilometerLimitMessage() : 'Kilometer tidak valid');
      const kmInput = document.getElementById('kilometerInput');
      if (kmInput) kmInput.focus();
      return;
    }

    if (currentStep < totalSteps) {
      goToStep(currentStep + 1);
    } else {
      showToast('PKB Berhasil Disimpan & Diteruskan ke Mekanik!');
    }
  });

  btnKembali.addEventListener('click', () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    } else if (currentStep === 1) {
      showPkbDashboard();
    }
  });

  function goToStep(step) {
    currentStep = step;
    updateStepperUI();
  }
  window.goToStep = goToStep;

  function updateStepperUI() {
    stepNodes.forEach(node => {
      const step = parseInt(node.dataset.step);
      node.classList.remove('active', 'completed');
      if (step === currentStep) {
        node.classList.add('active');
      } else if (step < currentStep) {
        node.classList.add('completed');
      }
    });

    // Update Panes
    for (let i = 1; i <= totalSteps; i++) {
      const pane = document.getElementById(`stepPane${i}`);
      if (pane) {
        pane.style.display = i === currentStep ? 'block' : 'none';
      }
    }

    // Update Button Labels & Bottom Actions
    const bottomActions = document.querySelector('.bottom-actions');
    if (bottomActions) {
      bottomActions.style.display = currentStep === totalSteps ? 'none' : 'flex';
    }

    // Save & Print PKB button only visible on Step 3 (Cek Aja Dulu)
    const btnSavePrint = document.getElementById('btnSavePrint');
    if (btnSavePrint) {
      btnSavePrint.style.display = currentStep === 3 ? 'inline-flex' : 'none';
    }

    if (currentStep === totalSteps) {
      nextBtnText.textContent = 'Save PKB';
    } else {
      nextBtnText.textContent = 'Next';
    }

    // Toggle Kembali button state
    if (currentStep === 1) {
      btnKembali.style.opacity = '1';
      btnKembali.style.pointerEvents = 'auto';
      const kembaliText = btnKembali.querySelector('span');
      if (kembaliText) kembaliText.textContent = 'List PKB';
    } else {
      btnKembali.style.opacity = '1';
      btnKembali.style.pointerEvents = 'auto';
      const kembaliText = btnKembali.querySelector('span');
      if (kembaliText) kembaliText.textContent = 'Back';
    }
  }
}

// Segmented Fuel Indicator
function initFuelIndicator() {
  const fuelSegments = document.querySelectorAll('.gauge-segment');
  const fuelLabels = document.querySelectorAll('.gauge-lbl');

  fuelSegments.forEach(segment => {
    segment.addEventListener('click', () => {
      const level = parseInt(segment.dataset.level);
      setFuelLevel(level);
    });
  });

  fuelLabels.forEach(label => {
    label.addEventListener('click', () => {
      const level = parseInt(label.dataset.level);
      setFuelLevel(level);
    });
  });

  function setFuelLevel(level) {
    currentFuelLevel = level;
    fuelSegments.forEach(seg => {
      const segLevel = parseInt(seg.dataset.level);
      if (segLevel <= level) {
        seg.style.opacity = '1';
        seg.style.filter = 'none';
      } else {
        seg.style.opacity = '0.25';
        seg.style.filter = 'grayscale(1)';
      }
    });

    fuelLabels.forEach(lbl => {
      const lblLevel = parseInt(lbl.dataset.level);
      if (lblLevel === level) {
        lbl.style.color = '#ea580c';
        lbl.style.fontWeight = '700';
      } else {
        lbl.style.color = '#475569';
        lbl.style.fontWeight = '600';
      }
    });

    const levelText = level === 0 ? 'Empty (0)' : level === 1 ? '1/4' : level === 2 ? '1/2' : level === 3 ? '3/4' : 'Full';
    showToast(`Fuel indicator set to: ${levelText}`);
  }
}

// Kilometer Validation (card Pre-Inspection Data)
// Aturan: nilai Kilometer harus lebih besar dari nilai Kilometer Sebelumnya.
function initKilometerValidation() {
  const kmInput = document.getElementById('kilometerInput');
  const prevInput = document.getElementById('prevKilometerInput');
  const errorBox = document.getElementById('kilometerError');
  const errorText = document.getElementById('kilometerErrorText');
  if (!kmInput) return;

  function parseKm(value) {
    const digits = String(value == null ? '' : value).replace(/[^0-9]/g, '');
    return digits === '' ? null : parseInt(digits, 10);
  }

  function previousKm() {
    return prevInput ? parseKm(prevInput.value) : null;
  }

  function limitMessage(previous) {
    return `Kilometer harus lebih besar dari Kilometer Sebelumnya (${previous.toLocaleString('id-ID')} km)`;
  }

  function validate() {
    const current = parseKm(kmInput.value);
    const previous = previousKm();
    const invalid = current !== null && previous !== null && current <= previous;

    kmInput.classList.toggle('is-invalid', invalid);
    if (errorBox) errorBox.classList.toggle('show', invalid);
    if (errorText && invalid) errorText.textContent = limitMessage(previous);

    return !invalid;
  }

  // Field hanya menerima angka
  kmInput.addEventListener('input', () => {
    const digitsOnly = kmInput.value.replace(/[^0-9]/g, '');
    if (digitsOnly !== kmInput.value) {
      const caret = kmInput.selectionStart || 0;
      const removed = kmInput.value.length - digitsOnly.length;
      kmInput.value = digitsOnly;
      const next = Math.max(0, caret - removed);
      kmInput.setSelectionRange(next, next);
    }
    validate();
  });

  window.validateKilometer = validate;
  window.kilometerLimitMessage = () => {
    const previous = previousKm();
    return previous === null ? '' : limitMessage(previous);
  };

  validate();
}

// Vehicle Scanner & Data Populator
function initVehicleScanner() {
  const scanInput = document.getElementById('scanVehicleInput');
  const btnScan = document.getElementById('btnScanVehicle');
  const btnClear = document.getElementById('btnClearScan');
  const vehicleBox = document.getElementById('vehicleInfoCard');
  const emptyState = document.getElementById('vehicleEmptyState');
  const kmInput = document.getElementById('kilometerInput');
  const prevKmInput = document.getElementById('prevKilometerInput');
  const btnEdit = document.getElementById('btnEditVehicle');
  const btnDelete = document.getElementById('btnDeleteVehicle');
  const btnInvoiceDate = document.getElementById('btnGetInvoiceDate');

  // Machine Number Suggestions
  const scanDropdown = document.getElementById('scanVehicleDropdown');

  function renderScanOptions(filter) {
    if (!scanDropdown) return;
    const key = (filter || '').trim().toLowerCase().replace(/s/g, '');
    const list = key
      ? sampleVehicles.filter(v =>
        v.engine.toLowerCase().includes(key) ||
        v.frame.toLowerCase().includes(key) ||
        v.plate.toLowerCase().replace(/s/g, '').includes(key) ||
        v.model.toLowerCase().replace(/s/g, '').includes(key))
      : sampleVehicles;

    if (!list.length) {
      scanDropdown.innerHTML = '<div class="scan-vehicle-empty">No machine number matched</div>';
      return;
    }

    const dispEngine = document.getElementById('dispEngine');
    const currentEngine = dispEngine ? dispEngine.textContent.trim() : '';
    scanDropdown.innerHTML = list.map(v => `
      <button type="button" class="scan-vehicle-option ${v.engine === currentEngine ? 'active' : ''}" data-engine="${v.engine}">
        <span class="scan-vehicle-main">
          <span class="scan-vehicle-engine">${v.engine}</span>
          <span class="scan-vehicle-model">${v.model} &middot; ${v.frame}</span>
        </span>
        <span class="scan-vehicle-plate">${v.plate}</span>
      </button>
    `).join('');
  }

  function openScanDropdown() {
    if (!scanDropdown) return;
    renderScanOptions(scanInput ? scanInput.value : '');
    scanDropdown.classList.add('open');
  }

  function closeScanDropdown() {
    if (scanDropdown) scanDropdown.classList.remove('open');
  }

  if (scanDropdown && scanInput) {
    scanInput.addEventListener('focus', openScanDropdown);
    scanInput.addEventListener('click', openScanDropdown);
    scanInput.addEventListener('input', () => {
      renderScanOptions(scanInput.value);
      scanDropdown.classList.add('open');
    });
    scanInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeScanDropdown();
    });

    scanDropdown.addEventListener('click', (e) => {
      const option = e.target.closest('.scan-vehicle-option');
      if (!option) return;
      const vehicle = sampleVehicles.find(v => v.engine === option.dataset.engine);
      if (!vehicle) return;
      scanInput.value = vehicle.engine;
      loadVehicleData(vehicle);
      closeScanDropdown();
      showToast(`Vehicle data loaded: ${vehicle.plate} (${vehicle.model})`);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.scan-input-container')) {
        closeScanDropdown();
      }
    });
  }

  btnScan.addEventListener('click', () => {
    closeScanDropdown();
    const query = scanInput.value.trim().toLowerCase();
    let vehicle = null;

    if (query) {
      vehicle = sampleVehicles.find(v =>
        v.plate.toLowerCase().replace(/\s/g, '').includes(query.replace(/\s/g, '')) ||
        v.engine.toLowerCase().includes(query) ||
        v.frame.toLowerCase().includes(query)
      );
    }

    // If not found or empty query, default to first sample
    if (!vehicle) {
      vehicle = sampleVehicles[0];
      scanInput.value = vehicle.engine;
    }

    loadVehicleData(vehicle);
    showToast(`Vehicle data loaded: ${vehicle.plate} (${vehicle.model})`);
  });

  scanInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      btnScan.click();
    }
  });

  btnClear.addEventListener('click', () => {
    scanInput.value = '';
    closeScanDropdown();
    resetVehicleData();
    showToast('Vehicle input cleared');
  });

  if (btnDelete) {
    btnDelete.addEventListener('click', () => {
      resetVehicleData();
      showToast('Vehicle data removed');
    });
  }

  if (btnInvoiceDate) {
    btnInvoiceDate.addEventListener('click', () => {
      const engine = document.getElementById('dispEngine');
      const vehicle = engine
        ? sampleVehicles.find(v => v.engine === engine.textContent.trim())
        : null;
      const disp = document.getElementById('dispPurchaseDate');
      if (disp && vehicle && vehicle.purchaseDate) {
        disp.textContent = vehicle.purchaseDate;
        showToast(`Purchase date from invoice: ${vehicle.purchaseDate}`);
      } else {
        showToast('Invoice date not found for this vehicle');
      }
    });
  }

  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      const modal = document.getElementById('inputDataModal');
      if (modal) {
        const copy = (modalId, dispId) => {
          const field = document.getElementById(modalId);
          const disp = document.getElementById(dispId);
          if (field && disp) field.value = disp.textContent.trim();
        };
        copy('modalPlate', 'dispPlate');
        copy('modalEngine', 'dispEngine');
        copy('modalFrame', 'dispFrame');
        copy('modalModel', 'dispModel');
        copy('modalYear', 'dispYear');
        copy('modalColor', 'dispColor');
        copy('modalDealer', 'dispDealer');

        const modalDate = document.getElementById('modalPurchaseDate');
        const dispDate = document.getElementById('dispPurchaseDate');
        if (modalDate && dispDate) {
          modalDate.value = displayDateToIso(dispDate.textContent) || '';
        }

        if (window.openVehicleModal) {
          window.openVehicleModal('edit');
        } else {
          modal.style.display = 'flex';
        }
      }
    });
  }

  function loadVehicleData(vehicle) {
    if (document.getElementById('dispPlate')) document.getElementById('dispPlate').textContent = vehicle.plate;
    if (document.getElementById('dispPoliceNumber')) document.getElementById('dispPoliceNumber').textContent = vehicle.plate;
    if (document.getElementById('dispModel')) document.getElementById('dispModel').textContent = vehicle.model;
    if (document.getElementById('dispEngine')) document.getElementById('dispEngine').textContent = vehicle.engine;
    if (document.getElementById('dispFrame')) document.getElementById('dispFrame').textContent = vehicle.frame;
    if (document.getElementById('dispColor')) document.getElementById('dispColor').textContent = vehicle.color || 'BLACK';
    if (document.getElementById('dispYear')) document.getElementById('dispYear').textContent = vehicle.year || '2024';
    if (document.getElementById('dispPurchaseDate')) document.getElementById('dispPurchaseDate').textContent = vehicle.purchaseDate || '03-05-2024';
    if (document.getElementById('dispDealer')) document.getElementById('dispDealer').textContent = vehicle.dealer || 'MPM Motor Jombang';

    if (prevKmInput) {
      const catalog = sampleVehicles.find(v => v.engine === vehicle.engine);
      prevKmInput.value = vehicle.lastKm || (catalog && catalog.lastKm) || '';
    }

    if (kmInput && vehicle.currentKm) {
      kmInput.value = vehicle.currentKm;
    }

    if (window.validateKilometer) window.validateKilometer();

    if (vehicleBox) vehicleBox.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
  }

  function resetVehicleData() {
    if (vehicleBox) vehicleBox.style.display = 'none';
    if (emptyState) emptyState.style.display = 'flex';
  }

  // Export helpers for modal & dashboard
  window.loadCustomVehicle = loadVehicleData;
  window.resetVehicleData = resetVehicleData;
}

// Carrier Step Interactive Handlers
function initCarrierStep() {
  const tabCarrier = document.getElementById('tabCarrierInfo');
  const tabStnk = document.getElementById('tabStnkInfo');
  const contentCarrier = document.getElementById('tabContentCarrier');
  const contentStnk = document.getElementById('tabContentStnk');

  // Tab Switching
  if (tabCarrier && tabStnk && contentCarrier && contentStnk) {
    tabCarrier.addEventListener('click', () => {
      tabCarrier.classList.add('active');
      tabStnk.classList.remove('active');
      contentCarrier.style.display = 'block';
      contentStnk.style.display = 'none';
    });

    tabStnk.addEventListener('click', () => {
      tabStnk.classList.add('active');
      tabCarrier.classList.remove('active');
      contentStnk.style.display = 'block';
      contentCarrier.style.display = 'none';
    });
  }

  // Carrier Phone Search
  const searchInput = document.getElementById('carrierSearchPhone');
  const btnSearch = document.getElementById('btnSearchCarrier');
  const btnClearSearch = document.getElementById('btnClearCarrierSearch');
  const btnAddCarrier = document.getElementById('btnAddCarrier');
  const promptBox = document.getElementById('carrierPromptBox');
  const carrierPhone = document.getElementById('carrierInputPhone');
  const carrierFirst = document.getElementById('carrierFirstName');
  const carrierLast = document.getElementById('carrierLastName');
  const stnkOwner = document.getElementById('stnkOwnerName');
  const stnkPlate = document.getElementById('stnkPlate');
  const stnkAddress = document.getElementById('stnkAddress');
  const btnViewDetail = document.getElementById('btnViewDetailCarrier');

  function loadCarrierData(carrier) {
    if (!carrier) return;
    if (searchInput) searchInput.value = carrier.phone;
    if (carrierPhone) carrierPhone.value = carrier.phone;
    if (carrierFirst) carrierFirst.value = carrier.firstName;
    if (carrierLast) carrierLast.value = carrier.lastName;
    if (stnkOwner) stnkOwner.value = carrier.stnkOwner;
    if (stnkPlate) stnkPlate.value = carrier.stnkPlate;
    if (stnkAddress) stnkAddress.value = carrier.stnkAddress;
    if (promptBox) promptBox.style.display = 'none';
  }

  function resetCarrierData(keepSearch) {
    if (searchInput && !keepSearch) searchInput.value = '';
    [carrierPhone, carrierFirst, carrierLast, stnkOwner, stnkPlate, stnkAddress].forEach(field => {
      if (field) field.value = '';
    });
    if (promptBox) promptBox.style.display = 'flex';
  }

  // Default dummy carrier so the card is never empty on first open
  loadCarrierData(sampleCarriers[0]);

  // Saved Phone Number Suggestions
  const phoneDropdown = document.getElementById('carrierPhoneDropdown');

  function renderPhoneOptions(filter) {
    if (!phoneDropdown) return;
    const key = (filter || '').trim().toLowerCase().replace(/[\s-]/g, '');
    const list = key
      ? sampleCarriers.filter(c =>
        c.phone.includes(key) ||
        `${c.firstName}${c.lastName}`.toLowerCase().includes(key) ||
        c.stnkPlate.toLowerCase().replace(/\s/g, '').includes(key))
      : sampleCarriers;

    if (!list.length) {
      phoneDropdown.innerHTML = '<div class="carrier-phone-empty">No saved phone number matched</div>';
      return;
    }

    const currentPhone = carrierPhone ? carrierPhone.value.trim() : '';
    phoneDropdown.innerHTML = list.map(c => `
      <button type="button" class="carrier-phone-option ${c.phone === currentPhone ? 'active' : ''}" data-phone="${c.phone}">
        <span class="carrier-phone-main">
          <span class="carrier-phone-number">${c.phone}</span>
          <span class="carrier-phone-name">${c.firstName} ${c.lastName}</span>
        </span>
        <span class="carrier-phone-plate">${c.stnkPlate}</span>
      </button>
    `).join('');
  }

  function openPhoneDropdown() {
    if (!phoneDropdown) return;
    renderPhoneOptions(searchInput ? searchInput.value : '');
    phoneDropdown.classList.add('open');
  }

  function closePhoneDropdown() {
    if (phoneDropdown) phoneDropdown.classList.remove('open');
  }

  if (phoneDropdown && searchInput) {
    searchInput.addEventListener('focus', openPhoneDropdown);
    searchInput.addEventListener('click', openPhoneDropdown);
    searchInput.addEventListener('input', () => {
      renderPhoneOptions(searchInput.value);
      phoneDropdown.classList.add('open');
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePhoneDropdown();
    });

    phoneDropdown.addEventListener('click', (e) => {
      const option = e.target.closest('.carrier-phone-option');
      if (!option) return;
      const carrier = sampleCarriers.find(c => c.phone === option.dataset.phone);
      if (!carrier) return;
      loadCarrierData(carrier);
      closePhoneDropdown();
      showToast(`Carrier selected: ${carrier.firstName} ${carrier.lastName} (${carrier.phone})`);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.carrier-search-input-pill-container')) {
        closePhoneDropdown();
      }
    });
  }

  if (btnSearch && searchInput) {
    const doSearch = () => {
      closePhoneDropdown();
      const query = searchInput.value.trim();
      if (!query) {
        showToast('Please enter a phone number to search.');
        return;
      }

      const carrier = findCarrier(query);
      if (!carrier) {
        resetCarrierData(true);
        if (carrierPhone) carrierPhone.value = query;
        showToast(`No carrier data found for: ${query}`);
        return;
      }

      loadCarrierData(carrier);
      showToast(`Carrier found: ${carrier.firstName} ${carrier.lastName} (${carrier.phone})`);
    };

    btnSearch.addEventListener('click', doSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSearch();
      }
    });
  }

  if (btnClearSearch && searchInput) {
    btnClearSearch.addEventListener('click', () => {
      closePhoneDropdown();
      resetCarrierData();
      showToast('Carrier search input cleared');
    });
  }

  if (btnAddCarrier) {
    btnAddCarrier.addEventListener('click', () => {
      closePhoneDropdown();
      resetCarrierData(true);
      if (carrierPhone && searchInput) {
        carrierPhone.value = searchInput.value.trim();
      }
      if (promptBox) promptBox.style.display = 'none';
      if (carrierFirst) carrierFirst.focus();
      showToast('Ready to input new carrier data');
    });
  }

  if (btnViewDetail) {
    btnViewDetail.addEventListener('click', () => {
      const name = `${carrierFirst?.value || ''} ${carrierLast?.value || ''}`.trim() || 'Carrier baru';
      const phone = carrierPhone?.value || '-';
      const plate = stnkPlate?.value || '-';
      showToast(`Detail carrier: ${name} - ${phone} - STNK ${plate}`);
    });
  }

  // Export helpers for the PKB wizard
  window.loadCarrierData = loadCarrierData;
  window.resetCarrierData = resetCarrierData;
}

// History Show More Action
function initHistoryShowMore() {
  const btnShowMore = document.getElementById('btnShowMoreHistory');
  if (!btnShowMore) return;

  btnShowMore.addEventListener('click', () => {
    showToast('Showing all historical services (2 records displayed)');
  });
}

// Date Helpers (display format DD-MM-YYYY <-> native input YYYY-MM-DD)
function isoDateToDisplay(iso) {
  const match = (iso || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return '';
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function displayDateToIso(display) {
  const match = (display || '').trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return '';
  return `${match[3]}-${match[2]}-${match[1]}`;
}

// Modal Handling
function initModal() {
  const modal = document.getElementById('inputDataModal');
  const btnOpen = document.getElementById('btnInputNewData');
  const btnClose = document.getElementById('btnModalClose');
  const btnCancel = document.getElementById('btnModalCancel');
  const form = document.getElementById('vehicleForm');
  const modalTitle = document.getElementById('modalVehicleTitle');

  // Shared opener: 'edit' keeps the fields already populated by the Edit button,
  // 'create' starts from a blank form.
  const openModal = (mode) => {
    modal.dataset.mode = mode === 'edit' ? 'edit' : 'create';
    if (modal.dataset.mode === 'create') form.reset();
    if (modalTitle) {
      modalTitle.textContent = modal.dataset.mode === 'edit'
        ? 'Edit Vehicle Data'
        : 'Input New Vehicle Data';
    }
    modal.style.display = 'flex';
  };
  window.openVehicleModal = openModal;

  if (btnOpen) {
    btnOpen.addEventListener('click', () => openModal('create'));
  }

  const closeModal = () => {
    modal.style.display = 'none';
  };

  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const btnModalInvoiceDate = document.getElementById('btnModalGetInvoiceDate');
  if (btnModalInvoiceDate) {
    btnModalInvoiceDate.addEventListener('click', () => {
      const engine = document.getElementById('modalEngine');
      const dateField = document.getElementById('modalPurchaseDate');
      const vehicle = engine
        ? sampleVehicles.find(v => v.engine === engine.value.trim())
        : null;
      const iso = vehicle ? displayDateToIso(vehicle.purchaseDate) : '';
      if (dateField && iso) {
        dateField.value = iso;
        showToast(`Tanggal faktur: ${vehicle.purchaseDate}`);
      } else {
        showToast('Tanggal faktur tidak ditemukan untuk nomor mesin ini');
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newVehicle = {
      plate: document.getElementById('modalPlate').value,
      model: document.getElementById('modalModel').value,
      engine: document.getElementById('modalEngine').value,
      frame: document.getElementById('modalFrame').value,
      year: document.getElementById('modalYear').value,
      color: document.getElementById('modalColor').value,
      dealer: document.getElementById('modalDealer').value,
      purchaseDate: isoDateToDisplay(document.getElementById('modalPurchaseDate').value),
      km: '150',
      history: []
    };

    if (window.loadCustomVehicle) {
      window.loadCustomVehicle(newVehicle);
      document.getElementById('scanVehicleInput').value = newVehicle.engine;
    }

    const wasEdit = modal.dataset.mode === 'edit';

    closeModal();
    form.reset();
    showToast(wasEdit ? 'Vehicle data updated successfully!' : 'New vehicle registered successfully!');
  });
}

// Sidebar toggle for responsiveness (safe guard)
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  if (sidebar && toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

// Language Switcher
function initLangSwitcher() {
  const btnId = document.getElementById('langId');
  const btnEn = document.getElementById('langEn');

  btnId.addEventListener('click', () => {
    btnId.classList.add('active');
    btnEn.classList.remove('active');
    showToast('Bahasa diganti ke Indonesia');
  });

  btnEn.addEventListener('click', () => {
    btnEn.classList.add('active');
    btnId.classList.remove('active');
    showToast('Language changed to English');
  });
}

// Cek Aja Dulu (Step 3) Handlers
// Layanan Cek Rangka — Tanggal Booking tampil kondisional dari Customer Agreement
const LCR_BOOKING_AGREEMENT = 'Bersedia Langsung dilakukan Pengecekan + Treatment 1';

function initLcrBookingDate() {
  const agreement = document.getElementById('lcrAgreement');
  const group = document.getElementById('lcrBookingGroup');
  const display = document.getElementById('lcrBookingDateDisplay');
  const native = document.getElementById('lcrBookingDate');
  const errorBox = document.getElementById('lcrBookingError');
  const errorText = document.getElementById('lcrBookingErrorText');
  const btnAlokasi = document.getElementById('btnCekAlokasi');
  if (!agreement || !group) return;

  // Menolak tanggal yang formatnya benar tapi tidak ada di kalender (contoh 31-02-2026)
  function isRealDate(iso) {
    const parts = (iso || '').split('-').map(Number);
    if (parts.length !== 3) return false;
    const [year, month, day] = parts;
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1
      && date.getUTCDate() === day;
  }

  function showError(message) {
    if (errorText) errorText.textContent = message;
    if (errorBox) errorBox.classList.add('show');
    if (display) display.classList.add('is-invalid');
  }

  function clearError() {
    if (errorBox) errorBox.classList.remove('show');
    if (display) display.classList.remove('is-invalid');
  }

  function resetBooking() {
    if (display) display.value = '';
    if (native) native.value = '';
    clearError();
  }

  // Tampilkan/sembunyikan field mengikuti pilihan Customer Agreement
  function syncVisibility() {
    const visible = agreement.value === LCR_BOOKING_AGREEMENT;
    group.hidden = !visible;
    if (!visible) resetBooking();
  }

  agreement.addEventListener('change', syncVisibility);

  if (display) {
    // Field hanya menerima angka & otomatis diformat dd-mm-yyyy
    display.addEventListener('input', () => {
      const digits = display.value.replace(/[^0-9]/g, '').slice(0, 8);
      const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
      display.value = parts.join('-');
      clearError();
    });

    display.addEventListener('blur', () => {
      const iso = displayDateToIso(display.value);
      if (display.value === '') {
        resetBooking();
      } else if (!iso) {
        showError('Format Tanggal Booking harus dd-mm-yyyy');
      } else if (!isRealDate(iso)) {
        if (native) native.value = '';
        showError('Tanggal Booking tidak valid');
      } else {
        if (native) native.value = iso;
        clearError();
      }
    });

    display.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.target.blur();
    });
  }

  if (native) {
    native.addEventListener('change', () => {
      if (display) display.value = isoDateToDisplay(native.value);
      clearError();
    });
  }

  if (btnAlokasi) {
    btnAlokasi.addEventListener('click', () => {
      const typed = display ? display.value.trim() : '';
      const iso = native && native.value ? native.value : displayDateToIso(typed);
      if (!iso && typed !== '') {
        showError('Format Tanggal Booking harus dd-mm-yyyy');
        if (display) display.focus();
        return;
      }
      if (!iso) {
        showError('Tanggal Booking wajib diisi sebelum cek alokasi');
        if (display) display.focus();
        return;
      }
      if (!isRealDate(iso)) {
        showError('Tanggal Booking tidak valid');
        if (display) display.focus();
        return;
      }
      clearError();
      showToast(`Mengecek alokasi slot untuk ${isoDateToDisplay(iso)}...`);
      setTimeout(() => {
        showToast(`Alokasi tersedia pada ${isoDateToDisplay(iso)} — 3 slot pengecekan rangka`);
      }, 900);
    });
  }

  syncVisibility();
}

function initCekAjaDuluStep() {
  // Character counters for reason textareas
  const reasonTextareas = document.querySelectorAll('.cek-reason-textarea');
  reasonTextareas.forEach(textarea => {
    const counterId = textarea.dataset.counter;
    const counterElem = document.getElementById(counterId);

    const updateCounter = () => {
      const len = textarea.value.length;
      if (counterElem) {
        counterElem.textContent = `${len}/500`;
      }
    };

    textarea.addEventListener('input', updateCounter);
  });

  // Select dropdown color change on selection
  const selectPills = document.querySelectorAll('.cek-select-pill');
  selectPills.forEach(select => {
    select.addEventListener('change', () => {
      if (select.value) {
        select.style.color = '#1e293b';
        select.style.fontWeight = '600';
      } else {
        select.style.color = '#64748b';
        select.style.fontWeight = 'normal';
      }
    });
  });

  // Save & Print PKB Button Handler
  const btnSavePrint = document.getElementById('btnSavePrint');
  if (btnSavePrint) {
    btnSavePrint.addEventListener('click', () => {
      showToast('Menyimpan data dan mencetak PKB...');
      setTimeout(() => {
        showToast('PKB #PKB-2026-00892 berhasil disimpan & diteruskan ke sistem!');
      }, 1000);
    });
  }
}

// Service & Parts (Step 4) Handlers
function initServiceAndPartsStep() {
  // Recommendation Add Buttons
  const recAddBtns = document.querySelectorAll('.sp-btn-add-rec');
  recAddBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name || 'Service';
      showToast(`${name} berhasil ditambahkan ke daftar Service!`);
    });
  });

  // Promo Use Buttons
  const promoUseBtns = document.querySelectorAll('.sp-btn-use-promo');
  promoUseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const promo = btn.dataset.promo || 'Promo';
      showToast(`${promo} berhasil digunakan!`);
    });
  });

  // Voucher KPB Add Button
  const btnAddKpb = document.getElementById('btnAddKpb');
  if (btnAddKpb) {
    btnAddKpb.addEventListener('click', () => {
      showToast('Voucher KPB 2 berhasil ditambahkan ke transaksi!');
    });
  }

  // See More & Show More Buttons
  const btnSeeMoreRec = document.getElementById('btnSeeMoreRec');
  if (btnSeeMoreRec) {
    btnSeeMoreRec.addEventListener('click', () => {
      showToast('Menampilkan seluruh rekomendasi servis untuk model ini.');
    });
  }

  const btnSeeMorePromo = document.getElementById('btnSeeMorePromo');
  if (btnSeeMorePromo) {
    btnSeeMorePromo.addEventListener('click', () => {
      showToast('Menampilkan seluruh promo yang tersedia.');
    });
  }

  const btnShowMorePart = document.getElementById('btnShowMorePart');
  if (btnShowMorePart) {
    btnShowMorePart.addEventListener('click', () => {
      showToast('Menampilkan seluruh suku cadang yang dipilih.');
    });
  }

  // Header Actions (Add OPPL, Add Service, Part All, Part)
  const btnAddOppl = document.getElementById('btnAddOppl');
  if (btnAddOppl) {
    btnAddOppl.addEventListener('click', () => {
      showToast('Membuka dialog Tambah OPPL (Order Pekerjaan Luar)...');
    });
  }

  const btnAddService = document.getElementById('btnAddService');
  if (btnAddService) {
    btnAddService.addEventListener('click', () => {
      showToast('Membuka katalog Service & Jasa AHASS...');
    });
  }

  const btnPartAll = document.getElementById('btnPartAll');
  if (btnPartAll) {
    btnPartAll.addEventListener('click', () => {
      showToast('Memilih seluruh spare part rekomendasi...');
    });
  }

  const btnPart = document.getElementById('btnPart');
  if (btnPart) {
    btnPart.addEventListener('click', () => {
      showToast('Membuka katalog Spare Part Honda Genuine Parts...');
    });
  }

  // Quantity Counters (+ / -)
  const qtyBtns = document.querySelectorAll('.sp-qty-btn');
  qtyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.dataset.target;
      const targetElem = document.getElementById(targetId);
      if (!targetElem) return;

      let currentQty = parseInt(targetElem.textContent) || 1;
      if (btn.classList.contains('sp-qty-plus')) {
        currentQty += 1;
      } else if (btn.classList.contains('sp-qty-minus')) {
        if (currentQty > 1) {
          currentQty -= 1;
        }
      }
      targetElem.textContent = currentQty;

      // Handle stock alert for washer oil bolt
      if (targetId === 'qtyVal1') {
        const alertQty = document.getElementById('alertQty1');
        const stockAlert = document.getElementById('stockAlert1');
        if (alertQty) alertQty.textContent = `(${currentQty})`;
        if (stockAlert) {
          stockAlert.style.display = currentQty > 2 ? 'inline-flex' : 'none';
        }
      }
    });
  });

  // Trash Delete Buttons
  const trashBtns = document.querySelectorAll('.sp-btn-trash');
  trashBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Item berhasil dihapus dari daftar.');
    });
  });

  // Source Request Custom Dropdown Menu
  const trigger = document.getElementById('sourceReqTrigger');
  const menu = document.getElementById('sourceReqMenu');
  const selectedText = document.getElementById('sourceReqSelectedText');
  const badgePart1 = document.getElementById('badgePart1');

  if (trigger && menu) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('show');
      trigger.classList.toggle('open', isOpen);
      trigger.classList.toggle('active', isOpen);
    });

    const options = menu.querySelectorAll('.sp-dropdown-option');
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = opt.dataset.value;
        if (selectedText) selectedText.textContent = val;
        
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');

        if (badgePart1) {
          badgePart1.textContent = val;
          if (val === 'Hotline') {
            badgePart1.style.background = '#2eaadc';
          } else if (val === 'Transfer Part') {
            badgePart1.style.background = '#8b5cf6';
          } else {
            badgePart1.style.background = '#10b981';
          }
        }

        menu.classList.remove('show');
        trigger.classList.remove('open', 'active');
        showToast(`Source Request diubah ke: ${val}`);
      });
    });

    document.addEventListener('click', () => {
      menu.classList.remove('show');
      trigger.classList.remove('open', 'active');
    });
  }

  // Choose Voucher Button
  const btnChooseVoucher = document.getElementById('btnChooseVoucher');
  if (btnChooseVoucher) {
    btnChooseVoucher.addEventListener('click', () => {
      showToast('Membuka modal pemilihan Voucher & Kupon Diskon...');
    });
  }

  // Ambil Deposit Button
  const btnAmbilDeposit = document.getElementById('btnAmbilDeposit');
  if (btnAmbilDeposit) {
    btnAmbilDeposit.addEventListener('click', () => {
      showToast('Deposit sebesar Rp 30.000 berhasil diaplikasikan ke DP!');
    });
  }
}

// Summary (Step 5) Handlers
function initSummaryStep() {
  const btnDitunggu = document.getElementById('btnDitunggu');
  const btnDitinggal = document.getElementById('btnDitinggal');
  const btnSummarySavePrint = document.getElementById('btnSummarySavePrint');
  const queueSelect = document.getElementById('summaryQueueType');
  const promoSelect = document.getElementById('summaryActivityPromo');

  if (btnDitunggu && btnDitinggal) {
    btnDitunggu.addEventListener('click', () => {
      btnDitunggu.classList.add('active');
      btnDitinggal.classList.remove('active');
      showToast('Status penanganan PKB: Ditunggu');
    });

    btnDitinggal.addEventListener('click', () => {
      btnDitinggal.classList.add('active');
      btnDitunggu.classList.remove('active');
      showToast('Status penanganan PKB: Ditinggal');
    });
  }

  if (btnSummarySavePrint) {
    btnSummarySavePrint.addEventListener('click', () => {
      showToast('Menyimpan data dan mencetak PKB...');
      setTimeout(() => {
        showToast('PKB #PKB-2026-00892 berhasil disimpan & diteruskan ke mekanik!');
      }, 1000);
    });
  }

  if (queueSelect) {
    queueSelect.addEventListener('change', (e) => {
      showToast(`Queue Type dipilih: ${e.target.value}`);
    });
  }

  if (promoSelect) {
    promoSelect.addEventListener('change', (e) => {
      showToast(`Activity Promotion dipilih: ${e.target.value}`);
    });
  }
}

// Toast Helper
function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

