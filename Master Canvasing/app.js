/**
 * Master Canvasing Module Application Logic
 * MPM AHASS Canvasing System
 */

// Initial Data with realistic AHASS Canvasing operations
let masterCanvasingData = [
  {
    id: 1,
    kodeCanvasing: '051-CNVS-2026-DMS0000000020',
    namaCanvasing: 'AHASS Roadshow & Service Keliling',
    lokasi: 'Lapangan Balai Desa Wage',
    provinsi: 'JAWA TIMUR',
    kota: 'KAB. SIDOARJO',
    kecamatan: 'TAMAN',
    kelurahan: 'WAGE',
    dari: '26-08-2026',
    sampai: '27-08-2026',
    petugas: 'Kalvin, Rizal'
  },
  {
    id: 2,
    kodeCanvasing: '051-CNVS-2026-DMS0000000019',
    namaCanvasing: 'AHASS Peduli Warga Jelbuk',
    lokasi: 'Balai Desa Sucopangepok',
    provinsi: 'JAWA TIMUR',
    kota: 'KAB. JEMBER',
    kecamatan: 'JELBUK',
    kelurahan: 'SUCOPANGEPOK',
    dari: '25-08-2026',
    sampai: '28-08-2026',
    petugas: 'Agung, Hendri'
  },
  {
    id: 3,
    kodeCanvasing: '051-CNVS-2026-DMS0000000004',
    namaCanvasing: 'Service Kunjung Kampus Surabaya',
    lokasi: 'Plaza Barat Kampus Wonokromo',
    provinsi: 'JAWA TIMUR',
    kota: 'KOTA SURABAYA',
    kecamatan: 'WONOKROMO',
    kelurahan: 'NGAGEL',
    dari: '20-08-2026',
    sampai: '22-08-2026',
    petugas: 'Robin, Ratna'
  },
  {
    id: 4,
    kodeCanvasing: '051-CNVS-2026-DMS0000000002',
    namaCanvasing: 'Canvasing Komunitas Honda Wonokromo',
    lokasi: 'Parkir Sentra Kuliner Wonokromo',
    provinsi: 'JAWA TIMUR',
    kota: 'KOTA SURABAYA',
    kecamatan: 'WONOKROMO',
    kelurahan: 'WONOKROMO',
    dari: '18-08-2026',
    sampai: '19-08-2026',
    petugas: 'Ratna'
  },
  {
    id: 5,
    kodeCanvasing: '051-CNVS-2026-DMS0000000001',
    namaCanvasing: 'AHASS Keliling Desa Gampingrowo',
    lokasi: 'Halaman Kantor Kecamatan Tarik',
    provinsi: 'JAWA TIMUR',
    kota: 'KAB. SIDOARJO',
    kecamatan: 'TARIK',
    kelurahan: 'GAMPINGROWO',
    dari: '10-08-2026',
    sampai: '12-08-2026',
    petugas: 'Kalvin'
  },
  {
    id: 6,
    kodeCanvasing: '051-CNVS-2025-DMS0000000023',
    namaCanvasing: 'Program Servis Hemat Akhir Tahun',
    lokasi: 'Alun-Alun Sidoarjo',
    provinsi: 'JAWA TIMUR',
    kota: 'KAB. SIDOARJO',
    kecamatan: 'SIDOARJO',
    kelurahan: 'BULUSIDOKARE',
    dari: '15-12-2025',
    sampai: '17-12-2025',
    petugas: 'Rizal, Kalvin'
  },
  {
    id: 7,
    kodeCanvasing: '051-CNVS-2025-DMS0000000017',
    namaCanvasing: 'AHASS Sahabat Pelanggan Wonokromo',
    lokasi: 'Pelataran Ruko Darmo Trade Center',
    provinsi: 'JAWA TIMUR',
    kota: 'KOTA SURABAYA',
    kecamatan: 'WONOKROMO',
    kelurahan: 'WONOKROMO',
    dari: '05-11-2025',
    sampai: '08-11-2025',
    petugas: 'Agung'
  },
  {
    id: 8,
    kodeCanvasing: '051-CNVS-2025-DMS0000000015',
    namaCanvasing: 'Service Kunjung Instansi Bapenda',
    lokasi: 'Gedung Bapenda Jawa Timur Gubeng',
    provinsi: 'JAWA TIMUR',
    kota: 'KOTA SURABAYA',
    kecamatan: 'GUBENG',
    kelurahan: 'GUBENG',
    dari: '22-10-2025',
    sampai: '24-10-2025',
    petugas: 'Robin'
  },
  {
    id: 9,
    kodeCanvasing: '051-CNVS-2025-DMS0000000014',
    namaCanvasing: 'Honda Roadshow & Uji Emisi Gratis',
    lokasi: 'Area Terbuka Taman Bungkul',
    provinsi: 'JAWA TIMUR',
    kota: 'KOTA SURABAYA',
    kecamatan: 'WONOKROMO',
    kelurahan: 'NGAGEL',
    dari: '14-10-2025',
    sampai: '15-10-2025',
    petugas: 'Kalvin'
  }
];

// Helper to generate formatted Kode Canvasing: 051-CNVS-YYYY-DMSXXXXXXXXXX
function generateNextKodeCanvasing() {
  const currentYear = new Date().getFullYear() || 2026;
  let maxSeq = 20;
  masterCanvasingData.forEach(item => {
    if (item.kodeCanvasing) {
      const match = item.kodeCanvasing.match(/DMS(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }
  });
  const nextSeq = maxSeq + 1;
  return `051-CNVS-${currentYear}-DMS${String(nextSeq).padStart(10, '0')}`;
}

let activeSearchField = 'kodeCanvasing';
let activeSelectedId = null;
let currentSortColumn = null;
let currentSortAsc = true;

document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  initSearchAndDropdown();
  initColumnFilters();
  initSorting();
  initKebabMenu();
  initModals();
  initEqualizerToggle();
  initStepperWizard();
  initTambahPartModal();
  initUploadPartModal();
  initTambahMekanikStep();
});

// Render Table Rows matching the Reference Screenshot
function renderTable(dataToRender = masterCanvasingData) {
  const tbody = document.getElementById('pkbTableBody');
  const infoText = document.getElementById('tableInfo');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (dataToRender.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 48px 20px; color: #94a3b8;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: #cbd5e1;">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span style="font-weight: 600; color: #64748b;">Data Canvasing tidak ditemukan</span>
            <span style="font-size: 13px;">Sesuaikan kata kunci pencarian atau filter kolom.</span>
          </div>
        </td>
      </tr>
    `;
    if (infoText) infoText.textContent = `Showing 0 to 0 of ${masterCanvasingData.length} entries`;
    return;
  }

  dataToRender.forEach((item) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td class="col-aksi" style="text-align: center; width: 52px; min-width: 52px;">
        <button type="button" class="btn-action-view-eye" title="View Detail" onclick="viewCanvasingDetail(${item.id})">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3.5"></circle>
          </svg>
        </button>
      </td>
      <td class="col-kode">${item.kodeCanvasing}</td>
      <td class="col-nama">${item.namaCanvasing}</td>
      <td class="col-lokasi">${item.lokasi}</td>
      <td class="col-provinsi">${item.provinsi}</td>
      <td class="col-kota">${item.kota}</td>
      <td class="col-kecamatan">${item.kecamatan}</td>
      <td class="col-kelurahan">${item.kelurahan}</td>
    `;

    tbody.appendChild(tr);
  });

  if (infoText) {
    infoText.textContent = `Showing 1 to ${dataToRender.length} of ${dataToRender.length} entries`;
  }
}

// Search & Dropdown Selection Logic
function initSearchAndDropdown() {
  const dropdownWrapper = document.getElementById('searchFieldDropdown');
  const dropdownBtn = document.getElementById('btnSearchField');
  const selectedFieldText = document.getElementById('selectedSearchField');
  const dropdownItems = document.querySelectorAll('#searchFieldMenu .dropdown-item');
  const searchInput = document.getElementById('topSearchInput');

  const fieldLabels = {
    kodeCanvasing: 'Kode Canvasing',
    namaCanvasing: 'Nama Canvasing',
    lokasi: 'Lokasi',
    provinsi: 'Provinsi',
    kota: 'Kota',
    kecamatan: 'Kecamatan',
    kelurahan: 'Kelurahan'
  };

  // Toggle Dropdown Menu
  if (dropdownBtn && dropdownWrapper) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownWrapper.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!dropdownWrapper.contains(e.target)) {
        dropdownWrapper.classList.remove('open');
      }
    });
  }

  // Select Dropdown Item
  dropdownItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownItems.forEach((btn) => btn.classList.remove('active'));
      item.classList.add('active');

      activeSearchField = item.getAttribute('data-field');
      const label = fieldLabels[activeSearchField] || 'Kode Canvasing';
      if (selectedFieldText) selectedFieldText.textContent = label;
      if (searchInput) {
        searchInput.placeholder = `Search by ${label}`;
        searchInput.focus();
      }
      dropdownWrapper.classList.remove('open');
      applyAllFilters();
    });
  });

  // Top Search Input Filter
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      applyAllFilters();
    });
  }
}

// Column-level Subheader Filter Inputs
function initColumnFilters() {
  const filterInputs = document.querySelectorAll('.sub-filter-input');
  filterInputs.forEach((input) => {
    input.addEventListener('input', () => {
      applyAllFilters();
    });
  });
}

// Combine all search and column filters
function applyAllFilters() {
  const topSearch = (document.getElementById('topSearchInput')?.value || '').toLowerCase().trim();
  const subFilters = {};
  document.querySelectorAll('.sub-filter-input').forEach((input) => {
    const key = input.getAttribute('data-filter');
    const val = input.value.toLowerCase().trim();
    if (val) subFilters[key] = val;
  });

  const filtered = masterCanvasingData.filter((item) => {
    // 1. Check Top Search
    if (topSearch) {
      const fieldVal = String(item[activeSearchField] || '').toLowerCase();
      if (!fieldVal.includes(topSearch)) {
        return false;
      }
    }

    // 2. Check Subheader Filters
    for (const [key, filterVal] of Object.entries(subFilters)) {
      const itemVal = String(item[key] || '').toLowerCase();
      if (!itemVal.includes(filterVal)) {
        return false;
      }
    }

    return true;
  });

  renderTable(filtered);
}

// Column Header Sorting
function initSorting() {
  const headers = document.querySelectorAll('.header-titles-row th[data-col]');
  headers.forEach((th) => {
    const content = th.querySelector('.th-content');
    if (!content) return;

    content.addEventListener('click', () => {
      const col = th.getAttribute('data-col');
      if (currentSortColumn === col) {
        currentSortAsc = !currentSortAsc;
      } else {
        currentSortColumn = col;
        currentSortAsc = true;
      }

      masterCanvasingData.sort((a, b) => {
        const valA = String(a[col] || '').toLowerCase();
        const valB = String(b[col] || '').toLowerCase();
        if (valA < valB) return currentSortAsc ? -1 : 1;
        if (valA > valB) return currentSortAsc ? 1 : -1;
        return 0;
      });

      applyAllFilters();
    });
  });
}

// Equalizer/Filter Toggle Button
function initEqualizerToggle() {
  const btn = document.getElementById('btnToggleFilters');
  const filterRow = document.getElementById('filterRow');
  if (!btn || !filterRow) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    if (filterRow.style.display === 'none') {
      filterRow.style.display = '';
      showToast('Kolom filter aktif', 'info');
    } else {
      filterRow.style.display = 'none';
      showToast('Kolom filter disembunyikan', 'info');
    }
  });
}

// Kebab Menu Handling
function initKebabMenu() {
  const menu = document.getElementById('kebabMenu');
  const btnView = document.getElementById('kebabActionView');
  const btnEdit = document.getElementById('kebabActionEdit');
  const btnPrint = document.getElementById('kebabActionPrint');
  const statusButtons = document.querySelectorAll('.kebab-item.status-sub');

  if (!menu) return;

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) {
      menu.classList.remove('show');
    }
  });

  if (btnView) {
    btnView.addEventListener('click', () => {
      menu.classList.remove('show');
      if (activeSelectedId) viewCanvasingDetail(activeSelectedId);
    });
  }

  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      menu.classList.remove('show');
      if (activeSelectedId) editCanvasingItem(activeSelectedId);
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      menu.classList.remove('show');
      showToast('Mencetak dokumen Canvasing...', 'info');
    });
  }
}

function openKebabMenu(event, id) {
  event.stopPropagation();
  activeSelectedId = id;
  const menu = document.getElementById('kebabMenu');
  if (!menu) return;

  const rect = event.currentTarget.getBoundingClientRect();
  menu.style.top = `${rect.bottom + window.scrollY + 4}px`;
  menu.style.left = `${Math.min(rect.left + window.scrollX - 80, window.innerWidth - 210)}px`;
  menu.classList.add('show');
}

// Detail View Modal
function viewCanvasingDetail(id) {
  const item = masterCanvasingData.find((d) => d.id === id);
  if (!item) return;

  const modal = document.getElementById('detailModal');
  const body = document.getElementById('detailModalBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="detail-grid">
      <div class="detail-item full-width" style="margin-bottom: 4px;">
        <span class="detail-label">Kode Canvasing</span>
        <span class="detail-val" style="color: var(--primary); font-weight: 700; font-size: 15px; font-family: monospace;">${item.kodeCanvasing}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Nama Canvasing</span>
        <span class="detail-val" style="font-weight: 600;">${item.namaCanvasing}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Lokasi</span>
        <span class="detail-val">${item.lokasi}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Provinsi</span>
        <span class="detail-val">${item.provinsi}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Kota / Kabupaten</span>
        <span class="detail-val">${item.kota}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Kecamatan</span>
        <span class="detail-val">${item.kecamatan}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Kelurahan</span>
        <span class="detail-val">${item.kelurahan}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Periode Tanggal</span>
        <span class="detail-val">${item.dari || '26-08-2026'} s/d ${item.sampai || '27-08-2026'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Mekanik / Petugas</span>
        <span class="detail-val">${item.petugas || 'Kalvin, Rizal'}</span>
      </div>
    </div>
  `;

  modal.classList.add('show');
}

// Edit Action - Opens Stepper Wizard in Edit Mode
function editCanvasingItem(id) {
  showCreateWizard(true, id);
}

// Create / Edit Modal Logic (For Detail Modal and Fallback)
function initModals() {
  const modal = document.getElementById('modalBackdrop');
  const btnClose = document.getElementById('btnCloseModal');
  const btnCancel = document.getElementById('btnCancelModal');
  const form = document.getElementById('pkbForm');

  const detailModal = document.getElementById('detailModal');
  const btnCloseDetail = document.getElementById('btnCloseDetailModal');
  const btnCloseDetail2 = document.getElementById('btnCloseDetailBtn');



  // Close Modals
  const closeModal = () => modal.classList.remove('show');
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  const closeDetail = () => detailModal.classList.remove('show');
  if (btnCloseDetail) btnCloseDetail.addEventListener('click', closeDetail);
  if (btnCloseDetail2) btnCloseDetail2.addEventListener('click', closeDetail);
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) closeDetail();
    });
  }

  // Submit Form
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const editId = modal.dataset.editId ? parseInt(modal.dataset.editId) : null;
      const transNo = document.getElementById('formTransNo').value;
      const status = document.getElementById('formStatus').value;
      const name = document.getElementById('formName').value;
      const policeNo = document.getElementById('formPoliceNo').value;
      const motor = document.getElementById('formMotor').value;
      const mechanic = document.getElementById('formMechanic').value;
      const engineNo = document.getElementById('formEngineNo').value;
      const frameNo = document.getElementById('formFrameNo').value;
      const startHour = document.getElementById('formStartHour').value;
      const estimatedHour = document.getElementById('formEstHour').value;
      const finishHour = document.getElementById('formFinishHour').value;

      if (editId) {
        // Edit Existing
        const existing = masterCanvasingData.find((d) => d.id === editId);
        if (existing) {
          existing.namaCanvasing = name;
          existing.kodeCanvasing = transNo;
          existing.petugas = mechanic;
        }
        showToast('Data Master Canvasing berhasil diperbarui', 'success');
      } else {
        // Create New
        const newItem = {
          id: Date.now(),
          kodeCanvasing: transNo,
          namaCanvasing: name,
          lokasi: 'Sidoarjo',
          provinsi: 'JAWA TIMUR',
          kota: 'KAB. SIDOARJO',
          kecamatan: 'TAMAN',
          kelurahan: 'WAGE',
          dari: startHour,
          sampai: finishHour,
          petugas: mechanic
        };
        masterCanvasingData.unshift(newItem);
        showToast('Data Master Canvasing berhasil dibuat', 'success');
      }

      closeModal();
      applyAllFilters();
    });
  }
}


// Toast Notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

// ==========================================================================
// Stepper Wizard Controller (Matching List Canvasing - Booking Page)
// ==========================================================================

let currentWizStep = 1;
const totalWizSteps = 4;
let editingPkbId = null;

// Master Catalog Part Canvasing with realistic AHASS Honda Genuine Parts & Stock
const partCatalog = [
  { code: '08232-2MB-K0LN1', name: 'AHM OIL MPX2 0.8L', satuan: 'BOTOL', harga: 'Rp 54.000', diskon: 'Rp 0', stock: 45, rawPrice: 54000 },
  { code: '08232-2MA-K0LN1', name: 'AHM OIL MPX1 0.8L (Bebek/Sport)', satuan: 'BOTOL', harga: 'Rp 52.000', diskon: 'Rp 0', stock: 30, rawPrice: 52000 },
  { code: '06455-K59-A71', name: 'PAD SET FR (Kampas Rem Depan)', satuan: 'SET', harga: 'Rp 68.000', diskon: 'Rp 0', stock: 20, rawPrice: 68000 },
  { code: '43130-KZL-930', name: 'SHOE SET BRAKE (Kampas Rem Belakang)', satuan: 'SET', harga: 'Rp 52.000', diskon: 'Rp 0', stock: 25, rawPrice: 52000 },
  { code: '31916-KRM-841', name: 'SPARK PLUG CPR9EA-9 (Busi NGK)', satuan: 'PCS', harga: 'Rp 22.000', diskon: 'Rp 0', stock: 35, rawPrice: 22000 },
  { code: '23100-K44-V01', name: 'BELT DRIVE (V-Belt Beat/Scoopy)', satuan: 'PCS', harga: 'Rp 95.000', diskon: 'Rp 0', stock: 15, rawPrice: 95000 },
  { code: '17210-K59-A70', name: 'ELEMENT COMP AIR/C (Filter Udara)', satuan: 'PCS', harga: 'Rp 58.000', diskon: 'Rp 0', stock: 18, rawPrice: 58000 },
  { code: '08293-999-011', name: 'OIL TRANSMISSION (Oli Gardan)', satuan: 'BOTOL', harga: 'Rp 16.000', diskon: 'Rp 0', stock: 50, rawPrice: 16000 },
  { code: '34901-K59-A71', name: 'BULB HEADLIGHT (Bohlam Depan LED)', satuan: 'PCS', harga: 'Rp 45.000', diskon: 'Rp 0', stock: 12, rawPrice: 45000 }
];

let partsDibawa = [];
let selectedPartItem = partCatalog[0];
let uploadedParsedData = [];

function renderPartsDibawa() {
  const tbody = document.getElementById('bodyPartCanvasing');
  if (!tbody) return;

  if (partsDibawa.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-part-row" id="rowEmptyPart">
        <td colspan="5" class="text-no-records">No records found</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = partsDibawa.map((item, index) => `
    <tr>
      <td style="font-weight: 600; color: #1e293b;">${item.code}</td>
      <td>${item.name}</td>
      <td style="text-align: center; font-weight: 600;">${item.qty} ${item.satuan}</td>
      <td style="text-align: right; font-weight: 600; color: var(--primary);">${item.harga}</td>
      <td style="text-align: center;">
        <button type="button" class="btn-del-part-row" title="Hapus Part" onclick="deletePartDibawa(${index})">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');
}

function deletePartDibawa(index) {
  const removed = partsDibawa.splice(index, 1);
  renderPartsDibawa();
  if (removed[0]) {
    showToast(`Part ${removed[0].name} dihapus dari daftar bawaan`, 'info');
  }
}

function initTambahPartModal() {
  const modal = document.getElementById('tambahPartModal');
  const btnOpen = document.getElementById('btnOpenTambahPartModal');
  const btnClose = document.getElementById('btnClosePartModal');
  const btnCancel = document.getElementById('btnCancelPartModal');
  const btnSave = document.getElementById('btnSavePartModal');
  const searchInput = document.getElementById('modalPartSearch');
  const suggestionsBox = document.getElementById('partSuggestionsDropdown');
  const qtyInput = document.getElementById('modalPartQty');
  const satuanInput = document.getElementById('modalPartSatuan');
  const hargaInput = document.getElementById('modalPartHarga');
  const diskonInput = document.getElementById('modalPartDiskon');
  const stockInput = document.getElementById('modalPartStock');

  function openModal() {
    if (!modal) return;
    modal.classList.add('show');
    selectedPartItem = partCatalog[0];
    if (searchInput) searchInput.value = selectedPartItem.name;
    if (qtyInput) qtyInput.value = 1;
    if (satuanInput) satuanInput.value = selectedPartItem.satuan;
    if (hargaInput) hargaInput.value = selectedPartItem.harga;
    if (diskonInput) diskonInput.value = selectedPartItem.diskon;
    if (stockInput) stockInput.value = selectedPartItem.stock;
    if (suggestionsBox) suggestionsBox.style.display = 'none';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
  }

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Autocomplete search
  if (searchInput && suggestionsBox) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      const matches = partCatalog.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
      if (matches.length > 0) {
        suggestionsBox.innerHTML = matches.map(p => `
          <div class="part-suggestion-item" data-code="${p.code}">
            <strong>${p.code}</strong> - ${p.name} (Stok: ${p.stock} ${p.satuan})
          </div>
        `).join('');
        suggestionsBox.style.display = 'block';

        suggestionsBox.querySelectorAll('.part-suggestion-item').forEach(itemEl => {
          itemEl.addEventListener('click', () => {
            const code = itemEl.getAttribute('data-code');
            const found = partCatalog.find(p => p.code === code);
            if (found) {
              selectedPartItem = found;
              searchInput.value = found.name;
              if (satuanInput) satuanInput.value = found.satuan;
              if (hargaInput) hargaInput.value = found.harga;
              if (diskonInput) diskonInput.value = found.diskon;
              if (stockInput) stockInput.value = found.stock;
            }
            suggestionsBox.style.display = 'none';
          });
        });
      } else {
        suggestionsBox.style.display = 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.style.display = 'none';
      }
    });
  }

  // Save Part into Step 2 table with Stock Validation
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const partName = searchInput ? searchInput.value.trim() : '';
      const qty = parseInt(qtyInput ? qtyInput.value : '1', 10) || 1;

      if (!partName) {
        showToast('Harap pilih atau masukkan nama part', 'info');
        return;
      }

      if (qty <= 0) {
        showToast('Qty harus berupa angka lebih besar dari 0', 'info');
        return;
      }

      // Stock validation check
      if (selectedPartItem && qty > selectedPartItem.stock) {
        showToast(`Qty (${qty}) melebihi stok yang tersedia (${selectedPartItem.stock} ${selectedPartItem.satuan})`, 'info');
        if (qtyInput) qtyInput.focus();
        return;
      }

      const itemToAdd = {
        code: selectedPartItem ? selectedPartItem.code : 'PRT-' + Math.floor(1000 + Math.random() * 9000),
        name: selectedPartItem ? selectedPartItem.name : partName,
        qty: qty,
        satuan: selectedPartItem ? selectedPartItem.satuan : 'PCS',
        harga: selectedPartItem ? selectedPartItem.harga : 'Rp 50.000'
      };

      // Check if already in list
      const existingIdx = partsDibawa.findIndex(p => p.code === itemToAdd.code);
      if (existingIdx >= 0) {
        const totalQty = partsDibawa[existingIdx].qty + qty;
        if (selectedPartItem && totalQty > selectedPartItem.stock) {
          showToast(`Total Qty (${totalQty}) melebihi stok tersedia (${selectedPartItem.stock})`, 'info');
          return;
        }
        partsDibawa[existingIdx].qty = totalQty;
      } else {
        partsDibawa.push(itemToAdd);
      }

      renderPartsDibawa();
      closeModal();
      showToast(`Part ${itemToAdd.name} (${qty} ${itemToAdd.satuan}) berhasil ditambahkan`, 'success');
    });
  }
}

// ==========================================================================
// Upload Part Modal & Available Stock Validation Engine
// ==========================================================================
function initUploadPartModal() {
  const modal = document.getElementById('uploadPartModal');
  const btnOpen = document.getElementById('btnOpenUploadPartModal');
  const btnClose = document.getElementById('btnCloseUploadPartModal');
  const btnCancel = document.getElementById('btnCancelUploadModal');
  const btnDownloadTemplate = document.getElementById('btnDownloadPartTemplate');
  const dropzone = document.getElementById('uploadPartDropzone');
  const fileInput = document.getElementById('fileUploadPart');
  const btnBrowse = document.getElementById('btnBrowsePartFile');
  const dropzoneSelected = document.getElementById('dropzoneSelectedFile');
  const dropzoneText = document.getElementById('dropzoneTextContent');
  const fileNameDisplay = document.getElementById('uploadedFileName');
  const btnRemoveFile = document.getElementById('btnRemoveUploadedFile');

  const summaryGrid = document.getElementById('validationSummaryGrid');
  const statTotal = document.getElementById('statTotalRows');
  const statValid = document.getElementById('statValidRows');
  const statError = document.getElementById('statErrorRows');

  const previewSection = document.getElementById('previewTableSection');
  const previewRowsCount = document.getElementById('previewRowsCount');
  const tbodyPreview = document.getElementById('tbodyPreviewUpload');

  const btnImportValidOnly = document.getElementById('btnImportValidOnly');
  const btnImportAll = document.getElementById('btnImportAllPart');
  const countValidOnlySpan = document.getElementById('countValidOnly');

  function openModal() {
    if (!modal) return;
    modal.classList.add('show');
    resetUploadState();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    resetUploadState();
  }

  function resetUploadState() {
    uploadedParsedData = [];
    if (fileInput) fileInput.value = '';
    if (dropzoneSelected) dropzoneSelected.style.display = 'none';
    if (dropzoneText) dropzoneText.style.display = 'block';
    if (summaryGrid) summaryGrid.style.display = 'none';
    if (previewSection) previewSection.style.display = 'none';
    if (tbodyPreview) tbodyPreview.innerHTML = '';
    if (btnImportValidOnly) btnImportValidOnly.style.display = 'none';
    if (btnImportAll) {
      btnImportAll.disabled = true;
      btnImportAll.textContent = 'Simpan ke Daftar Part';
      btnImportAll.title = '';
    }
  }

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Download Template
  if (btnDownloadTemplate) {
    btnDownloadTemplate.addEventListener('click', () => {
      downloadPartTemplate();
    });
  }

  // Browse File Button
  if (btnBrowse && fileInput) {
    btnBrowse.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  // Dropzone Interaction
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
      if (e.target !== btnRemoveFile && !btnRemoveFile?.contains(e.target)) {
        fileInput.click();
      }
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', (e) => {
      e.stopPropagation();
      resetUploadState();
    });
  }

  // Parse and validate uploaded file
  function handleFileSelection(file) {
    if (!file) return;

    if (fileNameDisplay) fileNameDisplay.textContent = file.name;
    if (dropzoneSelected) dropzoneSelected.style.display = 'block';
    if (dropzoneText) dropzoneText.style.display = 'none';

    const reader = new FileReader();

    if (window.XLSX) {
      reader.onload = function (e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
          processRawRows(jsonRows, file.name);
        } catch (err) {
          console.error('Error parsing Excel file:', err);
          showToast('Format file tidak dapat diproses', 'info');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Fallback CSV parser
      reader.onload = function (e) {
        const text = e.target.result;
        const lines = text.split(/\r\n|\n/).map(line => line.split(',').map(c => c.trim().replace(/^["']|["']$/g, '')));
        processRawRows(lines, file.name);
      };
      reader.readAsText(file);
    }
  }

  function processRawRows(rawRows, fileName) {
    if (!rawRows || rawRows.length < 2) {
      showToast('File tidak memiliki data baris atau format kosong', 'info');
      return;
    }

    // Identify column indices from header
    const headerRow = rawRows[0].map(h => String(h).trim().toLowerCase());
    let codeIndex = -1;
    let qtyIndex = -1;

    headerRow.forEach((col, idx) => {
      if (col.includes('kode') || col.includes('part') || col.includes('item') || col.includes('sku')) {
        if (codeIndex === -1) codeIndex = idx;
      }
      if (col.includes('qty') || col.includes('jumlah') || col.includes('kuantitas') || col.includes('banyak') || col.includes('count')) {
        if (qtyIndex === -1) qtyIndex = idx;
      }
    });

    if (codeIndex === -1) codeIndex = 0;
    if (qtyIndex === -1) qtyIndex = 1;

    uploadedParsedData = [];

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0 || (row.length === 1 && !row[0])) continue;

      const rawCode = String(row[codeIndex] || '').trim();
      const rawQtyStr = String(row[qtyIndex] || '').trim();

      if (!rawCode && !rawQtyStr) continue;

      const qty = parseInt(rawQtyStr, 10);

      // Match against partCatalog
      const cleanCode = rawCode.toLowerCase().replace(/[\s\-_]/g, '');
      const matchedPart = partCatalog.find(p => {
        const pClean = p.code.toLowerCase().replace(/[\s\-_]/g, '');
        return pClean === cleanCode || p.code.toLowerCase() === rawCode.toLowerCase() || p.name.toLowerCase().includes(rawCode.toLowerCase());
      });

      let status = 'valid';
      let message = '✅ Lolos Validasi (Stok Cukup)';
      let isValid = true;
      let availStock = matchedPart ? matchedPart.stock : 0;
      let partName = matchedPart ? matchedPart.name : 'Part Tidak Terdaftar';
      let satuan = matchedPart ? matchedPart.satuan : 'PCS';
      let harga = matchedPart ? matchedPart.harga : '-';

      if (!matchedPart) {
        status = 'notfound';
        message = '❌ Part Tidak Terdaftar di Sistem';
        isValid = false;
      } else if (isNaN(qty) || qty <= 0) {
        status = 'invalidqty';
        message = '❌ Qty Tidak Valid (> 0)';
        isValid = false;
      } else if (qty > matchedPart.stock) {
        status = 'overstock';
        message = `❌ Melebihi Stok (Tersedia: ${matchedPart.stock} ${satuan})`;
        isValid = false;
      } else {
        status = 'valid';
        message = `✅ Lolos Validasi (Tersedia: ${matchedPart.stock} ${satuan})`;
        isValid = true;
      }

      uploadedParsedData.push({
        rowNum: i,
        inputCode: rawCode || (matchedPart ? matchedPart.code : '-'),
        matchedPart: matchedPart,
        name: partName,
        qty: isNaN(qty) ? 0 : qty,
        satuan: satuan,
        harga: harga,
        stock: availStock,
        status: status,
        message: message,
        isValid: isValid
      });
    }

    renderValidationPreview();
  }

  function renderValidationPreview() {
    if (uploadedParsedData.length === 0) {
      showToast('Tidak ada data baris yang dapat diproses', 'info');
      return;
    }

    const totalCount = uploadedParsedData.length;
    const validCount = uploadedParsedData.filter(d => d.isValid).length;
    const errorCount = totalCount - validCount;

    if (summaryGrid) summaryGrid.style.display = 'grid';
    if (statTotal) statTotal.textContent = totalCount;
    if (statValid) statValid.textContent = `${validCount} Part`;
    if (statError) statError.textContent = `${errorCount} Part`;

    if (previewSection) previewSection.style.display = 'flex';
    if (previewRowsCount) previewRowsCount.textContent = `${totalCount} data baris terdeteksi`;

    if (tbodyPreview) {
      tbodyPreview.innerHTML = uploadedParsedData.map((item, idx) => `
        <tr class="${item.isValid ? '' : 'row-invalid-stock'}">
          <td style="text-align: center; font-weight: 600; color: #64748b;">${idx + 1}</td>
          <td style="font-weight: 600; color: #1e293b;">${item.inputCode}</td>
          <td>${item.name}</td>
          <td style="text-align: center; font-weight: 700; color: ${item.isValid ? '#1e293b' : '#dc2626'};">
            ${item.qty} ${item.satuan}
          </td>
          <td style="text-align: center; font-weight: 600; color: #0284c7;">
            ${item.stock} ${item.satuan}
          </td>
          <td>
            <span class="badge-part-status ${item.status}">
              ${item.message}
            </span>
          </td>
        </tr>
      `).join('');
    }

    // Configure Footer Action Buttons
    if (validCount > 0 && errorCount > 0) {
      if (btnImportValidOnly) {
        btnImportValidOnly.style.display = 'inline-flex';
        if (countValidOnlySpan) countValidOnlySpan.textContent = validCount;
      }
      if (btnImportAll) {
        btnImportAll.disabled = true;
        btnImportAll.textContent = `Simpan ke Daftar Part (${totalCount})`;
        btnImportAll.title = 'Perbaiki baris yang bermasalah atau pilih "Import Valid Saja"';
      }
    } else if (validCount > 0 && errorCount === 0) {
      if (btnImportValidOnly) btnImportValidOnly.style.display = 'none';
      if (btnImportAll) {
        btnImportAll.disabled = false;
        btnImportAll.textContent = `Simpan ke Daftar Part (${validCount})`;
      }
    } else {
      // 0 valid items
      if (btnImportValidOnly) btnImportValidOnly.style.display = 'none';
      if (btnImportAll) {
        btnImportAll.disabled = true;
        btnImportAll.textContent = 'Simpan ke Daftar Part (0)';
      }
    }
  }

  // Import Action Handlers
  if (btnImportAll) {
    btnImportAll.addEventListener('click', () => {
      const itemsToImport = uploadedParsedData.filter(d => d.isValid);
      executeImport(itemsToImport);
    });
  }

  if (btnImportValidOnly) {
    btnImportValidOnly.addEventListener('click', () => {
      const itemsToImport = uploadedParsedData.filter(d => d.isValid);
      executeImport(itemsToImport);
    });
  }

  function executeImport(items) {
    if (!items || items.length === 0) {
      showToast('Tidak ada part valid yang dapat diimpor', 'info');
      return;
    }

    items.forEach(item => {
      const code = item.matchedPart ? item.matchedPart.code : item.inputCode;
      const existingIdx = partsDibawa.findIndex(p => p.code === code);
      if (existingIdx >= 0) {
        partsDibawa[existingIdx].qty += item.qty;
      } else {
        partsDibawa.push({
          code: code,
          name: item.name,
          qty: item.qty,
          satuan: item.satuan,
          harga: item.harga
        });
      }
    });

    renderPartsDibawa();
    closeModal();
    showToast(`Berhasil menambahkan ${items.length} part ke daftar bawaan canvasing`, 'success');
  }
}

// Download Template Excel (.xlsx) generator
function downloadPartTemplate() {
  const templateData = [
    { 'Kode Part': '08232-2MB-K0LN1', 'Qty': 10 },
    { 'Kode Part': '06455-K59-A71', 'Qty': 5 },
    { 'Kode Part': '31916-KRM-841', 'Qty': 8 },
    { 'Kode Part': '23100-K44-V01', 'Qty': 25 } // Note: intentionally higher than stock (15) to demonstrate validation
  ];

  if (window.XLSX) {
    const ws = XLSX.utils.json_to_sheet(templateData);
    ws['!cols'] = [{ wch: 25 }, { wch: 10 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Part Canvasing');
    XLSX.writeFile(wb, 'Template_Upload_Part_Canvasing.xlsx');
  } else {
    // CSV fallback
    const csvContent = 'data:text/csv;charset=utf-8,Kode Part,Qty\n' + templateData.map(r => `"${r['Kode Part']}",${r['Qty']}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Template_Upload_Part_Canvasing.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  showToast('Template file Excel berhasil diunduh', 'success');
}

// Master Catalog Mekanik & Assignment Status
let mechanicCatalog = [
  { name: 'Kalvin', stall: 'Stall 1', isBusy: true, currentPkb: '051-PKB-CNVS-2026-DMS000001' },
  { name: 'Rizal', stall: 'Stall 2', isBusy: true, currentPkb: '051-PKB-CNVS-2026-DMS000002' },
  { name: 'Agung', stall: 'Stall 3', isBusy: false, currentPkb: null },
  { name: 'Robin', stall: 'Stall 4', isBusy: true, currentPkb: '051-PKB-CNVS-2026-DMS000004' },
  { name: 'Ratna', stall: 'Stall 5', isBusy: false, currentPkb: null },
  { name: 'Hendri', stall: 'Stall 6', isBusy: false, currentPkb: null }
];

let selectedMechanicsList = [];

function renderMechanicSelectOptions() {
  const selectEl = document.getElementById('selectMekanikCanvasing');
  if (!selectEl) return;

  selectEl.innerHTML = '<option value="">Pilih Mekanik...</option>' + mechanicCatalog.map(m => {
    if (m.isBusy) {
      return `<option value="${m.name}" data-stall="${m.stall}" data-busy="true" data-pkb="${m.currentPkb}">${m.name} (${m.stall} - Sedang Mengerjakan PKB ${m.currentPkb})</option>`;
    } else {
      return `<option value="${m.name}" data-stall="${m.stall}" data-busy="false">${m.name} (${m.stall} - Available / Siap Ditugaskan)</option>`;
    }
  }).join('');
  selectEl.value = '';
}

function refreshMechanicStatus() {
  // Randomize status for each mechanic (Available vs Sedang Mengerjakan)
  mechanicCatalog.forEach((m, index) => {
    // Generate pseudo-random boolean
    const isBusy = Math.random() < 0.5;
    m.isBusy = isBusy;
    if (isBusy) {
      const randomPkbNum = Math.floor(Math.random() * 900000) + 100000;
      m.currentPkb = `051-PKB-CNVS-2026-DMS${randomPkbNum}`;
    } else {
      m.currentPkb = null;
    }
  });

  // Re-render select options with newly randomized statuses
  renderMechanicSelectOptions();

  // Reset selected mechanics table to empty
  selectedMechanicsList = [];
  renderSelectedMechanics();
}

function renderSelectedMechanics() {
  const tbody = document.getElementById('bodyMekanikCanvasing');
  if (!tbody) return;

  if (selectedMechanicsList.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-part-row" id="rowEmptyMekanik">
        <td colspan="2" class="text-no-records">No records found</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = selectedMechanicsList.map((m, index) => `
    <tr>
      <td>
        <div class="mechanic-name-cell">
          <span style="font-weight: 600; color: #1e293b;">${m.name} (${m.stall})</span>
          ${m.isBusy ? `
            <span class="mechanic-busy-warning" title="Sedang mengerjakan PKB lain: ${m.currentPkb}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Sedang Mengerjakan PKB Lain (${m.currentPkb})</span>
            </span>
          ` : ''}
        </div>
      </td>
      <td style="text-align: center;">
        <button type="button" class="btn-del-part-row" title="Hapus Mekanik" onclick="deleteSelectedMechanic(${index})">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');
}

function deleteSelectedMechanic(index) {
  const removed = selectedMechanicsList.splice(index, 1);
  renderSelectedMechanics();
  if (removed[0]) {
    showToast(`Mekanik ${removed[0].name} dihapus dari daftar`, 'info');
  }
}

function initTambahMekanikStep() {
  const selectEl = document.getElementById('selectMekanikCanvasing');
  const btnAdd = document.getElementById('btnAddMekanikToList');
  const btnRefresh = document.getElementById('btnRefreshMekanik');

  renderMechanicSelectOptions();

  if (btnAdd && selectEl) {
    btnAdd.addEventListener('click', () => {
      const val = selectEl.value;
      if (!val) {
        showToast('Harap pilih mekanik terlebih dahulu', 'info');
        return;
      }

      const existing = selectedMechanicsList.find(m => m.name === val);
      if (existing) {
        showToast(`Mekanik ${val} sudah ada dalam daftar`, 'info');
        return;
      }

      const found = mechanicCatalog.find(m => m.name === val) || {
        name: val,
        stall: 'Stall 1',
        isBusy: false,
        currentPkb: null
      };

      selectedMechanicsList.push({ ...found });
      renderSelectedMechanics();
      selectEl.value = '';

      if (found.isBusy) {
        showToast(`⚠️ Peringatan: Mekanik ${found.name} sedang mengerjakan PKB (${found.currentPkb}), namun tetap berhasil ditambahkan ke daftar.`, 'warning');
      } else {
        showToast(`Mekanik ${found.name} berhasil ditambahkan ke daftar`, 'success');
      }
    });
  }

  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      btnRefresh.classList.add('rotating');
      setTimeout(() => {
        refreshMechanicStatus();
        btnRefresh.classList.remove('rotating');
        showToast('Status mekanik berhasil diperbarui. Daftar pilihan mekanik telah direset.', 'info');
      }, 500);
    });
  }
}

const sampleVehicles = {
  'JB91E1260677': {
    plate: 'AG 3323 UY',
    motor: 'ALL NEW SCOOPY',
    engine: 'JB91E1260677',
    frame: 'JB91E12606778J',
    color: 'PRESTIGE BLACK',
    year: '2024'
  },
  'JB91E1260676': {
    plate: 'AE 3392 OI',
    motor: 'ALL NEW VARIO',
    engine: 'JB91E1260676',
    frame: 'JB91E12606767S',
    color: 'MATTE RED',
    year: '2023'
  },
  'JB91E1260675': {
    plate: 'T 2727 HAH',
    motor: 'HONDA BEAT DELUXE',
    engine: 'JB91E1260675',
    frame: 'JB91E1260675LK',
    color: 'SILVER METALLIC',
    year: '2024'
  },
  'JB91E1260674': {
    plate: 'AG 6524 RFA',
    motor: 'ALL NEW VARIO',
    engine: 'JB91E1260674',
    frame: 'JB91E1260674JU',
    color: 'PEARL WHITE',
    year: '2024'
  }
};

function initStepperWizard() {
  const btnCreate = document.getElementById('btnCreatePkb');
  const btnBackToTable = document.getElementById('btnBackToTable');
  const btnWizPrev = document.getElementById('btnWizPrev');
  const btnWizNext = document.getElementById('btnWizNext');
  const btnScan = document.getElementById('btnWizScanVehicle');
  const btnClearScan = document.getElementById('btnWizClearScan');
  const btnSearchCarrier = document.getElementById('btnWizSearchCarrier');
  const scanInput = document.getElementById('wizScanVehicleInput');

  // Step node clicks
  for (let i = 1; i <= totalWizSteps; i++) {
    const node = document.getElementById(`stepNode${i}`);
    if (node) {
      node.addEventListener('click', () => {
        goToStep(i);
      });
    }
  }

  // Open Create Wizard
  if (btnCreate) {
    btnCreate.addEventListener('click', () => {
      showCreateWizard(false);
    });
  }

  // Back to table button in top banner
  if (btnBackToTable) {
    btnBackToTable.addEventListener('click', () => {
      showTableView();
    });
  }

  // Prev Button in bottom actions
  if (btnWizPrev) {
    btnWizPrev.addEventListener('click', () => {
      if (currentWizStep > 1) {
        goToStep(currentWizStep - 1);
      } else {
        showTableView();
      }
    });
  }

  // Next / Submit Button
  if (btnWizNext) {
    btnWizNext.addEventListener('click', () => {
      if (currentWizStep < totalWizSteps) {
        // Validate required fields on Step 1 & 2
        if (currentWizStep === 1) {
          const namaCanvasing = document.getElementById('wizNamaCanvasing')?.value.trim();
          const lokasiCanvasing = document.getElementById('wizLokasiCanvasing')?.value.trim();
          if (!namaCanvasing) {
            showToast('Harap isi nama canvasing', 'info');
            document.getElementById('wizNamaCanvasing')?.focus();
            return;
          }
          if (!lokasiCanvasing) {
            showToast('Harap isi lokasi canvasing', 'info');
            document.getElementById('wizLokasiCanvasing')?.focus();
            return;
          }
        } else if (currentWizStep === 2) {
          // Step 2: Part Dibawa (optional or warning if empty)
        }
        goToStep(currentWizStep + 1);
      } else {
        submitWizardForm();
      }
    });
  }

  // Scan Vehicle Action (if present)
  if (btnScan) {
    btnScan.addEventListener('click', () => {
      const q = (scanInput ? scanInput.value.trim().toUpperCase() : '');
      const found = sampleVehicles[q] || {
        plate: 'AG ' + Math.floor(1000 + Math.random() * 9000) + ' PKB',
        motor: 'HONDA NEW MODEL',
        engine: q || 'JB91E' + Math.floor(1000000 + Math.random() * 9000000),
        frame: 'MH1' + (q || 'JB91E') + '99',
        color: 'METALLIC BLACK',
        year: '2024'
      };

      if (document.getElementById('wizPoliceNo')) document.getElementById('wizPoliceNo').value = found.plate;
      if (document.getElementById('wizMotor')) document.getElementById('wizMotor').value = found.motor;
      if (document.getElementById('wizEngineNo')) document.getElementById('wizEngineNo').value = found.engine;
      if (document.getElementById('wizFrameNo')) document.getElementById('wizFrameNo').value = found.frame;

      if (document.getElementById('dispWizPlate')) document.getElementById('dispWizPlate').textContent = found.plate;
      if (document.getElementById('dispWizMotorTitle')) document.getElementById('dispWizMotorTitle').textContent = found.motor;
      if (document.getElementById('dispWizEngine')) document.getElementById('dispWizEngine').textContent = found.engine;
      if (document.getElementById('dispWizFrame')) document.getElementById('dispWizFrame').textContent = found.frame;
      if (document.getElementById('dispWizColor')) document.getElementById('dispWizColor').textContent = found.color;
      if (document.getElementById('dispWizYear')) document.getElementById('dispWizYear').textContent = found.year;

      showToast(`Kendaraan ${found.plate} (${found.motor}) berhasil discan`, 'success');
    });
  }

  // Clear Scan Action
  if (btnClearScan) {
    btnClearScan.addEventListener('click', () => {
      if (scanInput) scanInput.value = '';
      if (document.getElementById('wizPoliceNo')) document.getElementById('wizPoliceNo').value = '';
      if (document.getElementById('wizMotor')) document.getElementById('wizMotor').value = '';
      if (document.getElementById('wizEngineNo')) document.getElementById('wizEngineNo').value = '';
      if (document.getElementById('wizFrameNo')) document.getElementById('wizFrameNo').value = '';
      if (document.getElementById('dispWizPlate')) document.getElementById('dispWizPlate').textContent = '-';
      if (document.getElementById('dispWizMotorTitle')) document.getElementById('dispWizMotorTitle').textContent = '-';
      if (document.getElementById('dispWizEngine')) document.getElementById('dispWizEngine').textContent = '-';
      if (document.getElementById('dispWizFrame')) document.getElementById('dispWizFrame').textContent = '-';
      showToast('Input kendaraan dibersihkan', 'info');
    });
  }

  // Search Carrier Action
  if (btnSearchCarrier) {
    btnSearchCarrier.addEventListener('click', () => {
      const phoneInput = document.getElementById('wizCarrierSearchPhone');
      const phone = phoneInput ? phoneInput.value.trim() : '';
      if (phone) {
        document.getElementById('wizPhone').value = phone;
        showToast(`Data pelanggan untuk ${phone} ditemukan`, 'success');
      }
    });
  }

  // Service toggle buttons in Step 4
  const recButtons = document.querySelectorAll('.sp-btn-pill-outline');
  recButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.sp-rec-item');
      if (item) {
        item.classList.toggle('active');
        if (item.classList.contains('active')) {
          btn.classList.add('sp-btn-added');
          btn.textContent = 'Terpilih';
        } else {
          btn.classList.remove('sp-btn-added');
          btn.textContent = '+ Add';
        }
      }
    });
  });

  // Live input sync to badge if present
  const policeInput = document.getElementById('wizPoliceNo');
  const motorInput = document.getElementById('wizMotor');
  if (policeInput) {
    policeInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (document.getElementById('dispWizPlate')) document.getElementById('dispWizPlate').textContent = val || '-';
    });
  }
  if (motorInput) {
    motorInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (document.getElementById('dispWizMotorTitle')) document.getElementById('dispWizMotorTitle').textContent = val || '-';
    });
  }
}

function showCreateWizard(isEdit = false, editId = null) {
  editingPkbId = isEdit ? editId : null;
  const tableView = document.getElementById('masterTableView');
  const wizardView = document.getElementById('createMasterView');
  const bannerDetail = document.getElementById('wizardBannerDetail');
  const transNoPill = document.getElementById('dispWizardTransNo');

  if (tableView) tableView.style.display = 'none';
  if (wizardView) {
    wizardView.style.display = 'flex';
    wizardView.style.animation = 'fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  if (isEdit && editId) {
    const item = masterCanvasingData.find(d => d.id === editId);
    if (item) {
      if (transNoPill) transNoPill.textContent = item.kodeCanvasing;
      if (bannerDetail) {
        bannerDetail.innerHTML = `<span class="trans-id-pill" id="dispWizardTransNo">${item.kodeCanvasing}</span> • Edit Data Master Canvasing`;
      }
      if (document.getElementById('wizKodeCanvasing')) document.getElementById('wizKodeCanvasing').value = item.kodeCanvasing;
      if (document.getElementById('wizNamaCanvasing')) document.getElementById('wizNamaCanvasing').value = item.namaCanvasing;
      if (document.getElementById('wizLokasiCanvasing')) document.getElementById('wizLokasiCanvasing').value = item.lokasi;
      if (document.getElementById('wizDari')) document.getElementById('wizDari').value = item.dari || '26-08-2026';
      if (document.getElementById('wizSampai')) document.getElementById('wizSampai').value = item.sampai || '27-08-2026';
      if (document.getElementById('wizProvinsi')) document.getElementById('wizProvinsi').value = item.provinsi || 'JAWA TIMUR';
      if (document.getElementById('wizKabupaten')) document.getElementById('wizKabupaten').value = item.kota || 'KAB. SIDOARJO';
      if (document.getElementById('wizKecamatan')) document.getElementById('wizKecamatan').value = item.kecamatan || 'GEDANGAN';
      if (document.getElementById('wizKelurahan')) document.getElementById('wizKelurahan').value = item.kelurahan || 'GEDANGAN';
      if (document.getElementById('wizTransNo')) document.getElementById('wizTransNo').value = item.kodeCanvasing;
    }
  } else {
    // New Record
    const newKode = generateNextKodeCanvasing();
    if (transNoPill) transNoPill.textContent = newKode;
    if (bannerDetail) {
      bannerDetail.innerHTML = `<span class="trans-id-pill" id="dispWizardTransNo">${newKode}</span> • Pendaftaran Master Canvasing Baru`;
    }

    if (document.getElementById('wizKodeCanvasing')) document.getElementById('wizKodeCanvasing').value = '';
    if (document.getElementById('wizNamaCanvasing')) document.getElementById('wizNamaCanvasing').value = 'AHASS Service Kunjung PT Maspion I';
    if (document.getElementById('wizLokasiCanvasing')) document.getElementById('wizLokasiCanvasing').value = 'Area Parkir PT Maspion I Gedangan';
    if (document.getElementById('wizDari')) document.getElementById('wizDari').value = '26-08-2026';
    if (document.getElementById('wizSampai')) document.getElementById('wizSampai').value = '27-08-2026';
    if (document.getElementById('wizProvinsi')) document.getElementById('wizProvinsi').value = 'JAWA TIMUR';
    if (document.getElementById('wizKabupaten')) document.getElementById('wizKabupaten').value = 'KAB. SIDOARJO';
    if (document.getElementById('wizKecamatan')) document.getElementById('wizKecamatan').value = 'GEDANGAN';
    if (document.getElementById('wizKelurahan')) document.getElementById('wizKelurahan').value = 'SAWOTRATAP';
    if (document.getElementById('wizTransNo')) document.getElementById('wizTransNo').value = newKode;
  }

  // Reset Parts Dibawa Table
  partsDibawa = [];
  renderPartsDibawa();

  // Reset Selected Mechanics Table
  selectedMechanicsList = [];
  renderSelectedMechanics();
  renderMechanicSelectOptions();

  // Reset to Step 1
  goToStep(1);

  // Notify parent layout shell of subcrumb
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({
      type: 'UPDATE_CRUMB',
      subCrumb: isEdit ? 'Edit Master Canvasing' : 'Create New'
    }, '*');
  }
}

function showTableView() {
  const tableView = document.getElementById('masterTableView');
  const wizardView = document.getElementById('createMasterView');

  if (wizardView) wizardView.style.display = 'none';
  if (tableView) {
    tableView.style.display = 'block';
    tableView.style.animation = 'fadeIn 0.25s ease';
  }

  // Reset breadcrumb in parent shell
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({
      type: 'UPDATE_CRUMB',
      subCrumb: null
    }, '*');
  }
}

function goToStep(step) {
  currentWizStep = step;

  // Update Stepper Nodes and Lines
  for (let i = 1; i <= totalWizSteps; i++) {
    const node = document.getElementById(`stepNode${i}`);
    if (node) {
      node.classList.remove('active', 'completed');
      if (i === step) {
        node.classList.add('active');
      } else if (i < step) {
        node.classList.add('completed');
      }
    }

    if (i < totalWizSteps) {
      const line = document.getElementById(`stepLine${i}`);
      if (line) {
        if (i < step) {
          line.classList.add('active');
        } else {
          line.classList.remove('active');
        }
      }
    }
  }

  // Update Panes Visibility
  for (let i = 1; i <= totalWizSteps; i++) {
    const pane = document.getElementById(`stepPane${i}`);
    if (pane) {
      if (i === step) {
        pane.style.display = 'block';
        pane.style.animation = 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      } else {
        pane.style.display = 'none';
      }
    }
  }

  // Update Bottom Action Button Texts & Icons
  const prevText = document.getElementById('btnWizPrevText');
  const nextText = document.getElementById('btnWizNextText');
  const nextIcon = document.getElementById('btnWizNextIcon');

  if (prevText) {
    prevText.textContent = step === 1 ? 'Kembali ke Tabel' : 'Kembali';
  }

  if (nextText) {
    nextText.textContent = step === totalWizSteps ? (editingPkbId ? 'Perbarui Master Canvasing' : 'Simpan Master Canvasing') : 'Next';
  }

  if (nextIcon) {
    if (step === totalWizSteps) {
      nextIcon.innerHTML = `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>`;
    } else {
      nextIcon.innerHTML = `<polyline points="9 18 15 12 9 6"></polyline>`;
    }
  }

  // If on Step 4 (Summary), sync the summary fields
  if (step === totalWizSteps) {
    syncSummaryPane();
  }

  // Scroll to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function syncSummaryPane() {
  const namaCanvasing = document.getElementById('wizNamaCanvasing')?.value || 'AHASS Service Kunjung PT Maspion I';
  const lokasiCanvasing = document.getElementById('wizLokasiCanvasing')?.value || 'Area Parkir PT Maspion I Gedangan';
  const dari = document.getElementById('wizDari')?.value || '26-08-2026';
  const sampai = document.getElementById('wizSampai')?.value || '27-08-2026';
  const provinsi = document.getElementById('wizProvinsi')?.value || 'JAWA TIMUR';
  const kabupaten = document.getElementById('wizKabupaten')?.value || 'KAB. SIDOARJO';
  const kecamatan = document.getElementById('wizKecamatan')?.value || 'GEDANGAN';
  const kelurahan = document.getElementById('wizKelurahan')?.value || 'SAWOTRATAP';

  if (document.getElementById('sumNamaCanvasing')) document.getElementById('sumNamaCanvasing').textContent = namaCanvasing || '-';
  if (document.getElementById('sumLokasiCanvasing')) document.getElementById('sumLokasiCanvasing').textContent = lokasiCanvasing || '-';
  if (document.getElementById('sumPeriodeCanvasing')) document.getElementById('sumPeriodeCanvasing').textContent = `${dari} s/d ${sampai}`;
  if (document.getElementById('sumWilayahCanvasing')) {
    const regionParts = [kelurahan, kecamatan, kabupaten, provinsi].filter(Boolean);
    document.getElementById('sumWilayahCanvasing').textContent = regionParts.join(', ') || '-';
  }

  // Render Parts Dibawa in Summary
  const sumPartsBody = document.getElementById('sumPartsTableBody');
  if (sumPartsBody) {
    if (partsDibawa.length === 0) {
      sumPartsBody.innerHTML = `
        <tr class="empty-part-row">
          <td colspan="4" class="text-no-records">Belum ada part yang ditambahkan</td>
        </tr>
      `;
    } else {
      sumPartsBody.innerHTML = partsDibawa.map(p => `
        <tr>
          <td style="font-weight: 600; color: #1e293b;">${p.code}</td>
          <td>${p.name}</td>
          <td style="text-align: center; font-weight: 600;">${p.qty} ${p.satuan}</td>
          <td style="text-align: right; font-weight: 600; color: var(--primary);">${p.harga}</td>
        </tr>
      `).join('');
    }
  }

  // Render Mechanics in Summary
  const sumMechContainer = document.getElementById('sumMechanicsListContainer');
  if (sumMechContainer) {
    if (selectedMechanicsList.length === 0) {
      sumMechContainer.innerHTML = `<span style="color: #64748b; font-size: 13px; font-style: italic;">Belum ada mekanik yang dipilih</span>`;
    } else {
      sumMechContainer.innerHTML = selectedMechanicsList.map(m => `
        <div class="summary-mech-badge ${m.isBusy ? 'busy' : ''}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span><strong>${m.name}</strong> (${m.stall})</span>
          ${m.isBusy ? `<span style="color: #b45309; font-size: 11.5px; font-weight: 700;">(⚠️ Sedang PKB Lain: ${m.currentPkb})</span>` : ''}
        </div>
      `).join('');
    }
  }
}

function submitWizardForm() {
  const namaCanvasing = document.getElementById('wizNamaCanvasing')?.value.trim() || 'AHASS Service Kunjung PT Maspion I';
  const lokasiCanvasing = document.getElementById('wizLokasiCanvasing')?.value.trim() || 'Area Parkir PT Maspion I Gedangan';
  const dari = document.getElementById('wizDari')?.value || '26-08-2026';
  const sampai = document.getElementById('wizSampai')?.value || '27-08-2026';
  const provinsi = document.getElementById('wizProvinsi')?.value || 'JAWA TIMUR';
  const kabupaten = document.getElementById('wizKabupaten')?.value || 'KAB. SIDOARJO';
  const kecamatan = document.getElementById('wizKecamatan')?.value || 'GEDANGAN';
  const kelurahan = document.getElementById('wizKelurahan')?.value || 'SAWOTRATAP';

  const newKode = document.getElementById('wizTransNo')?.value || generateNextKodeCanvasing();
  const mechNames = selectedMechanicsList.map(m => m.name).join(', ') || 'Kalvin';

  if (editingPkbId) {
    const existing = masterCanvasingData.find(d => d.id === editingPkbId);
    if (existing) {
      existing.namaCanvasing = namaCanvasing;
      existing.lokasi = lokasiCanvasing;
      existing.provinsi = provinsi;
      existing.kota = kabupaten;
      existing.kecamatan = kecamatan;
      existing.kelurahan = kelurahan;
      existing.dari = dari;
      existing.sampai = sampai;
      existing.petugas = mechNames;
    }
    showToast(`Master Canvasing ${existing.kodeCanvasing} berhasil diperbarui`, 'success');
  } else {
    const newItem = {
      id: Date.now(),
      kodeCanvasing: newKode,
      namaCanvasing: namaCanvasing,
      lokasi: lokasiCanvasing,
      provinsi: provinsi,
      kota: kabupaten,
      kecamatan: kecamatan,
      kelurahan: kelurahan,
      dari: dari,
      sampai: sampai,
      petugas: mechNames
    };
    masterCanvasingData.unshift(newItem);
    showToast(`Master Canvasing baru ${newKode} berhasil disimpan!`, 'success');
  }

  // Refresh Table & return to table view
  applyAllFilters();
  showTableView();
}
