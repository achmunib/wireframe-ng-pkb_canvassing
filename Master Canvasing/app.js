/**
 * Master Canvasing / PKB List Module Application Logic
 * MPM AHASS Canvasing System
 */

// Initial Data matching exact uploaded reference image
let pkbData = [
  {
    id: 1,
    status: 'Waiting Mechanic',
    transNo: '027-PKB-2025-DMS0000000134',
    name: 'Grego',
    policeNo: 'AG 3323 UY',
    motor: 'ALL NEW SCOOPY',
    engineNo: 'JB91E1260677',
    frameNo: 'JB91E12606778J',
    mechanic: 'Kalvin',
    startHour: '15-05-2025',
    estimatedHour: '15-05-2025',
    finishHour: '15-05-2025'
  },
  {
    id: 2,
    status: 'Waiting Mechanic',
    transNo: '027-PKB-2025-DMS0000000130',
    name: 'Renata',
    policeNo: 'AE 3392 OI',
    motor: 'ALL NEW VARIO',
    engineNo: 'JB91E1260676',
    frameNo: 'JB91E12606767S',
    mechanic: 'Rizal',
    startHour: '15-05-2025',
    estimatedHour: '15-05-2025',
    finishHour: '15-05-2025'
  },
  {
    id: 3,
    status: 'Waiting Mechanic',
    transNo: '027-PKB-2025-DMS0000000129',
    name: 'Mentari',
    policeNo: 'T 2727 HAH',
    motor: '',
    engineNo: 'JB91E1260675',
    frameNo: 'JB91E1260675LK',
    mechanic: 'Agung',
    startHour: '15-05-2025',
    estimatedHour: '15-05-2025',
    finishHour: '15-05-2025'
  },
  {
    id: 4,
    status: 'In Progress',
    transNo: '027-PKB-2025-DMS0000000128',
    name: 'Vincent',
    policeNo: 'AG 6524 RFA',
    motor: 'ALL NEW VARIO',
    engineNo: 'JB91E1260674',
    frameNo: 'JB91E1260674JU',
    mechanic: 'Robin',
    startHour: '15-05-2025',
    estimatedHour: '15-05-2025',
    finishHour: '15-05-2025'
  },
  {
    id: 5,
    status: 'Pause',
    transNo: '027-PKB-2025-DMS0000000127',
    name: 'Sylkinta',
    policeNo: 'AG 3738 BS',
    motor: '',
    engineNo: 'JB91E1260671',
    frameNo: 'JB91E1260671LP',
    mechanic: 'Ratna',
    startHour: '15-05-2025',
    estimatedHour: '15-05-2025',
    finishHour: '15-05-2025'
  }
];

let activeSearchField = 'transNo';
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
  initDraftPill();
  initEqualizerToggle();
  initStepperWizard();
  initTambahPartModal();
  initTambahMekanikStep();
});

// Render Table Rows matching the Reference Screenshot
function renderTable(dataToRender = pkbData) {
  const tbody = document.getElementById('pkbTableBody');
  const infoText = document.getElementById('tableInfo');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (dataToRender.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="12" style="text-align: center; padding: 48px 20px; color: #94a3b8;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: #cbd5e1;">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span style="font-weight: 600; color: #64748b;">Data PKB tidak ditemukan</span>
            <span style="font-size: 13px;">Sesuaikan kata kunci pencarian atau filter kolom.</span>
          </div>
        </td>
      </tr>
    `;
    if (infoText) infoText.textContent = `Showing 0 to 0 of ${pkbData.length} entries`;
    return;
  }

  dataToRender.forEach((item) => {
    const statusClass = getStatusClass(item.status);
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td class="col-action">
        <div class="col-action-cell">
          <button class="btn-row-action btn-view" title="View PKB" onclick="viewPkbDetail(${item.id})">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          <button class="btn-row-action btn-kebab" title="More Options" onclick="openKebabMenu(event, ${item.id})">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1.5"></circle>
              <circle cx="12" cy="5" r="1.5"></circle>
              <circle cx="12" cy="19" r="1.5"></circle>
            </svg>
          </button>
        </div>
      </td>
      <td class="col-status">
        <span class="status-pill ${statusClass}">${item.status}</span>
      </td>
      <td class="col-trans">${item.transNo}</td>
      <td class="col-name">${item.name}</td>
      <td class="col-police">${item.policeNo}</td>
      <td class="col-motor">${item.motor || ''}</td>
      <td class="col-engine">${item.engineNo || ''}</td>
      <td class="col-frame">${item.frameNo || ''}</td>
      <td class="col-mechanic">${item.mechanic}</td>
      <td class="col-starthour">${item.startHour}</td>
      <td class="col-esthour">${item.estimatedHour}</td>
      <td class="col-finishhour">${item.finishHour}</td>
    `;

    tbody.appendChild(tr);
  });

  if (infoText) {
    infoText.textContent = `Showing 1 to ${dataToRender.length} of ${dataToRender.length} entries`;
  }
}

function getStatusClass(status) {
  if (status === 'Waiting Mechanic') return 'waiting-mechanic';
  if (status === 'In Progress') return 'in-progress';
  if (status === 'Pause') return 'pause';
  return 'completed';
}

// Search & Dropdown Selection Logic
function initSearchAndDropdown() {
  const dropdownWrapper = document.getElementById('searchFieldDropdown');
  const dropdownBtn = document.getElementById('btnSearchField');
  const selectedFieldText = document.getElementById('selectedSearchField');
  const dropdownItems = document.querySelectorAll('#searchFieldMenu .dropdown-item');
  const searchInput = document.getElementById('topSearchInput');

  const fieldLabels = {
    transNo: 'Transaction No',
    name: 'Name',
    policeNo: 'Police Number',
    motor: 'Motor',
    engineNo: 'Engine Number',
    frameNo: 'Frame Number',
    mechanic: 'Mechanic'
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
      const label = fieldLabels[activeSearchField] || 'Transaction No';
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

  const filtered = pkbData.filter((item) => {
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

      pkbData.sort((a, b) => {
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
      if (activeSelectedId) viewPkbDetail(activeSelectedId);
    });
  }

  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      menu.classList.remove('show');
      if (activeSelectedId) editPkbItem(activeSelectedId);
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      menu.classList.remove('show');
      showToast('Mencetak dokumen PKB...', 'info');
    });
  }

  statusButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const newStatus = btn.getAttribute('data-set-status');
      menu.classList.remove('show');
      if (activeSelectedId && newStatus) {
        const item = pkbData.find((d) => d.id === activeSelectedId);
        if (item) {
          item.status = newStatus;
          applyAllFilters();
          showToast(`Status diperbarui menjadi: ${newStatus}`, 'success');
        }
      }
    });
  });
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
function viewPkbDetail(id) {
  const item = pkbData.find((d) => d.id === id);
  if (!item) return;

  const modal = document.getElementById('detailModal');
  const body = document.getElementById('detailModalBody');
  if (!modal || !body) return;

  const statusClass = getStatusClass(item.status);

  body.innerHTML = `
    <div class="detail-grid">
      <div class="detail-item">
        <span class="detail-label">Status PKB</span>
        <div><span class="status-pill ${statusClass}">${item.status}</span></div>
      </div>
      <div class="detail-item">
        <span class="detail-label">Transaction No</span>
        <span class="detail-val" style="color: var(--primary);">${item.transNo}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Customer Name</span>
        <span class="detail-val">${item.name}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Police Number</span>
        <span class="detail-val">${item.policeNo}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Motor Type</span>
        <span class="detail-val">${item.motor || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Mechanic</span>
        <span class="detail-val">${item.mechanic}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Engine Number</span>
        <span class="detail-val">${item.engineNo || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Frame Number</span>
        <span class="detail-val">${item.frameNo || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Start Hour</span>
        <span class="detail-val">${item.startHour}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Estimated Hour</span>
        <span class="detail-val">${item.estimatedHour}</span>
      </div>
      <div class="detail-item full-width">
        <span class="detail-label">Finish Hour</span>
        <span class="detail-val">${item.finishHour}</span>
      </div>
    </div>
  `;

  modal.classList.add('show');
}

// Edit PKB Action - Opens Stepper Wizard in Edit Mode
function editPkbItem(id) {
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
        const existing = pkbData.find((d) => d.id === editId);
        if (existing) {
          existing.status = status;
          existing.name = name;
          existing.policeNo = policeNo;
          existing.motor = motor;
          existing.mechanic = mechanic;
          existing.engineNo = engineNo;
          existing.frameNo = frameNo;
          existing.startHour = startHour;
          existing.estimatedHour = estimatedHour;
          existing.finishHour = finishHour;
        }
        showToast('Data PKB berhasil diperbarui', 'success');
      } else {
        // Create New
        const newItem = {
          id: Date.now(),
          status,
          transNo,
          name,
          policeNo,
          motor,
          mechanic,
          engineNo,
          frameNo,
          startHour,
          estimatedHour,
          finishHour
        };
        pkbData.unshift(newItem);
        showToast('Data PKB berhasil dibuat', 'success');
      }

      closeModal();
      applyAllFilters();
    });
  }
}

// Floating Draft PKB Indicator
function initDraftPill() {
  const btn = document.getElementById('btnDraftPkb');
  if (btn) {
    btn.addEventListener('click', () => {
      showToast('3 draft PKB tersimpan siap diterbitkan', 'info');
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

// Master Catalog Part Canvasing
const partCatalog = [
  { code: '08232-2MB-K0LN1', name: 'AHM OIL MPX2 0.8L', satuan: 'BOTOL', harga: 'Rp 54.000', diskon: 'Rp 0', stock: 45, rawPrice: 54000 },
  { code: '06455-K59-A71', name: 'PAD SET FR (Kampas Rem Depan)', satuan: 'SET', harga: 'Rp 68.000', diskon: 'Rp 0', stock: 20, rawPrice: 68000 },
  { code: '31916-KRM-841', name: 'SPARK PLUG CPR9EA-9 (Busi NGK)', satuan: 'PCS', harga: 'Rp 22.000', diskon: 'Rp 0', stock: 35, rawPrice: 22000 },
  { code: '23100-K44-V01', name: 'BELT DRIVE (V-Belt Beat/Scoopy)', satuan: 'PCS', harga: 'Rp 95.000', diskon: 'Rp 0', stock: 15, rawPrice: 95000 },
  { code: '17210-K59-A70', name: 'ELEMENT COMP AIR/C (Filter Udara)', satuan: 'PCS', harga: 'Rp 58.000', diskon: 'Rp 0', stock: 18, rawPrice: 58000 },
  { code: '08293-999-011', name: 'OIL TRANSMISSION (Oli Gardan)', satuan: 'BOTOL', harga: 'Rp 16.000', diskon: 'Rp 0', stock: 50, rawPrice: 16000 }
];

let partsDibawa = [];
let selectedPartItem = partCatalog[0];

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
            <strong>${p.code}</strong> - ${p.name} (${p.harga})
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

  // Save Part into Step 2 table
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const partName = searchInput ? searchInput.value.trim() : '';
      const qty = parseInt(qtyInput ? qtyInput.value : '1', 10) || 1;

      if (!partName) {
        showToast('Harap pilih atau masukkan nama part', 'info');
        return;
      }

      const itemToAdd = {
        code: selectedPartItem ? selectedPartItem.code : 'PRT-' + Math.floor(1000 + Math.random() * 9000),
        name: partName,
        qty: qty,
        satuan: selectedPartItem ? selectedPartItem.satuan : 'PCS',
        harga: selectedPartItem ? selectedPartItem.harga : 'Rp 50.000'
      };

      partsDibawa.push(itemToAdd);
      renderPartsDibawa();
      closeModal();
      showToast(`Part ${itemToAdd.name} (${qty} ${itemToAdd.satuan}) berhasil ditambahkan`, 'success');
    });
  }
}

// Master Catalog Mekanik & Assignment Status
const mechanicCatalog = [
  { name: 'Kalvin', stall: 'Stall 1', isBusy: true, currentPkb: '027-PKB-2025-DMS0000000134' },
  { name: 'Rizal', stall: 'Stall 2', isBusy: true, currentPkb: '027-PKB-2025-DMS0000000130' },
  { name: 'Agung', stall: 'Stall 3', isBusy: false, currentPkb: null },
  { name: 'Robin', stall: 'Stall 4', isBusy: true, currentPkb: '027-PKB-2025-DMS0000000128' },
  { name: 'Ratna', stall: 'Stall 5', isBusy: false, currentPkb: null },
  { name: 'Hendri', stall: 'Stall 6', isBusy: false, currentPkb: null }
];

let selectedMechanicsList = [];

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

      selectedMechanicsList.push(found);
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
        btnRefresh.classList.remove('rotating');
        showToast('Daftar status dan ketersediaan mekanik berhasil diperbarui', 'info');
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
    const item = pkbData.find(d => d.id === editId);
    if (item) {
      if (transNoPill) transNoPill.textContent = item.transNo;
      if (bannerDetail) {
        bannerDetail.innerHTML = `<span class="trans-id-pill" id="dispWizardTransNo">${item.transNo}</span> • Edit Data PKB Master Canvasing`;
      }
      if (document.getElementById('wizKodeCanvasing')) document.getElementById('wizKodeCanvasing').value = '';
      if (document.getElementById('wizNamaCanvasing')) document.getElementById('wizNamaCanvasing').value = 'Test lagi NG';
      if (document.getElementById('wizLokasiCanvasing')) document.getElementById('wizLokasiCanvasing').value = 'Gedangan Pusat Dunia';
      if (document.getElementById('wizDari')) document.getElementById('wizDari').value = '26-08-2026';
      if (document.getElementById('wizSampai')) document.getElementById('wizSampai').value = '27-08-2026';
      if (document.getElementById('wizProvinsi')) document.getElementById('wizProvinsi').value = 'JAWA TIMUR';
      if (document.getElementById('wizKabupaten')) document.getElementById('wizKabupaten').value = 'KAB. SIDOARJO';
      if (document.getElementById('wizKecamatan')) document.getElementById('wizKecamatan').value = 'GEDANGAN';
      if (document.getElementById('wizKelurahan')) document.getElementById('wizKelurahan').value = 'GEDANGAN';

      document.getElementById('wizTransNo').value = item.transNo;
      document.getElementById('wizStatus').value = item.status;
      document.getElementById('wizName').value = item.name;
      if (document.getElementById('wizPoliceNo')) document.getElementById('wizPoliceNo').value = item.policeNo;
      if (document.getElementById('wizMotor')) document.getElementById('wizMotor').value = item.motor || '';
      document.getElementById('wizMechanic').value = item.mechanic;
      if (document.getElementById('wizEngineNo')) document.getElementById('wizEngineNo').value = item.engineNo || '';
      if (document.getElementById('wizFrameNo')) document.getElementById('wizFrameNo').value = item.frameNo || '';
      document.getElementById('wizStartHour').value = item.startHour;
      document.getElementById('wizEstHour').value = item.estimatedHour;
      document.getElementById('wizFinishHour').value = item.finishHour;
    }
  } else {
    // New Record
    const nextNum = 135 + pkbData.length - 5;
    const newTransNo = `027-PKB-2025-DMS0000000${nextNum}`;
    if (transNoPill) transNoPill.textContent = newTransNo;
    if (bannerDetail) {
      bannerDetail.innerHTML = `<span class="trans-id-pill" id="dispWizardTransNo">${newTransNo}</span> • Pendaftaran PKB Master Canvasing Baru`;
    }

    if (document.getElementById('wizKodeCanvasing')) document.getElementById('wizKodeCanvasing').value = '';
    if (document.getElementById('wizNamaCanvasing')) document.getElementById('wizNamaCanvasing').value = 'Test lagi NG';
    if (document.getElementById('wizLokasiCanvasing')) document.getElementById('wizLokasiCanvasing').value = 'Gedangan Pusat Dunia';
    if (document.getElementById('wizDari')) document.getElementById('wizDari').value = '26-08-2026';
    if (document.getElementById('wizSampai')) document.getElementById('wizSampai').value = '27-08-2026';
    if (document.getElementById('wizProvinsi')) document.getElementById('wizProvinsi').value = 'JAWA TIMUR';
    if (document.getElementById('wizKabupaten')) document.getElementById('wizKabupaten').value = 'KAB. SIDOARJO';
    if (document.getElementById('wizKecamatan')) document.getElementById('wizKecamatan').value = 'GEDANGAN';
    if (document.getElementById('wizKelurahan')) document.getElementById('wizKelurahan').value = 'GEDANGAN';

    document.getElementById('wizTransNo').value = newTransNo;
    document.getElementById('wizStatus').value = 'Waiting Mechanic';
    document.getElementById('wizName').value = 'Grego';
    if (document.getElementById('wizPoliceNo')) document.getElementById('wizPoliceNo').value = 'AG 3323 UY';
    if (document.getElementById('wizMotor')) document.getElementById('wizMotor').value = 'ALL NEW SCOOPY';
    document.getElementById('wizMechanic').value = 'Kalvin';
    if (document.getElementById('wizEngineNo')) document.getElementById('wizEngineNo').value = 'JB91E1260677';
    if (document.getElementById('wizFrameNo')) document.getElementById('wizFrameNo').value = 'JB91E12606778J';
    document.getElementById('wizStartHour').value = '15-05-2025';
    document.getElementById('wizEstHour').value = '15-05-2025';
    document.getElementById('wizFinishHour').value = '15-05-2025';
  }

  // Reset Parts Dibawa Table
  partsDibawa = [];
  renderPartsDibawa();

  // Reset Selected Mechanics Table
  selectedMechanicsList = [];
  renderSelectedMechanics();

  // Reset to Step 1
  goToStep(1);

  // Notify parent layout shell of subcrumb
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({
      type: 'UPDATE_CRUMB',
      subCrumb: isEdit ? 'Edit PKB' : 'Create New'
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
  const namaCanvasing = document.getElementById('wizNamaCanvasing')?.value || 'Test lagi NG';
  const lokasiCanvasing = document.getElementById('wizLokasiCanvasing')?.value || 'Gedangan Pusat Dunia';
  const dari = document.getElementById('wizDari')?.value || '26-08-2026';
  const sampai = document.getElementById('wizSampai')?.value || '27-08-2026';
  const provinsi = document.getElementById('wizProvinsi')?.value || 'JAWA TIMUR';
  const kabupaten = document.getElementById('wizKabupaten')?.value || 'KAB. SIDOARJO';
  const kecamatan = document.getElementById('wizKecamatan')?.value || 'GEDANGAN';
  const kelurahan = document.getElementById('wizKelurahan')?.value || 'GEDANGAN';

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
  const namaCanvasing = document.getElementById('wizNamaCanvasing')?.value.trim() || 'Test lagi NG';
  const lokasiCanvasing = document.getElementById('wizLokasiCanvasing')?.value.trim() || 'Gedangan Pusat Dunia';
  const dari = document.getElementById('wizDari')?.value || '26-08-2026';
  const sampai = document.getElementById('wizSampai')?.value || '27-08-2026';

  const nextNum = 135 + pkbData.length - 5;
  const newTransNo = `027-PKB-2025-DMS0000000${nextNum}`;
  const mechNames = selectedMechanicsList.map(m => m.name).join(', ') || 'Kalvin';

  if (editingPkbId) {
    const existing = pkbData.find(d => d.id === editingPkbId);
    if (existing) {
      existing.name = namaCanvasing;
      existing.mechanic = mechNames;
      existing.startHour = dari;
      existing.finishHour = sampai;
    }
    showToast(`Master Canvasing ${existing.transNo} berhasil diperbarui`, 'success');
  } else {
    const newItem = {
      id: Date.now(),
      status: 'Waiting Mechanic',
      transNo: newTransNo,
      name: namaCanvasing,
      policeNo: 'AG 3323 UY',
      motor: 'ALL NEW SCOOPY',
      mechanic: mechNames,
      engineNo: 'JB91E1260677',
      frameNo: 'JB91E12606778J',
      startHour: dari,
      estimatedHour: sampai,
      finishHour: sampai
    };
    pkbData.unshift(newItem);
    showToast(`Master Canvasing baru ${newTransNo} berhasil disimpan!`, 'success');
  }

  // Refresh Table & return to table view
  applyAllFilters();
  showTableView();
}
