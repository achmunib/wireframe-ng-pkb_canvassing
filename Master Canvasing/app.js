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

// Edit PKB Modal
function editPkbItem(id) {
  const item = pkbData.find((d) => d.id === id);
  if (!item) return;

  const modal = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  if (!modal) return;

  if (modalTitle) modalTitle.textContent = 'Edit Data PKB Canvasing';

  document.getElementById('formTransNo').value = item.transNo;
  document.getElementById('formStatus').value = item.status;
  document.getElementById('formName').value = item.name;
  document.getElementById('formPoliceNo').value = item.policeNo;
  document.getElementById('formMotor').value = item.motor || '';
  document.getElementById('formMechanic').value = item.mechanic;
  document.getElementById('formEngineNo').value = item.engineNo || '';
  document.getElementById('formFrameNo').value = item.frameNo || '';
  document.getElementById('formStartHour').value = item.startHour;
  document.getElementById('formEstHour').value = item.estimatedHour;
  document.getElementById('formFinishHour').value = item.finishHour;

  modal.dataset.editId = String(id);
  modal.classList.add('show');
}

// Create / Edit Modal Logic
function initModals() {
  const modal = document.getElementById('modalBackdrop');
  const btnCreate = document.getElementById('btnCreatePkb');
  const btnClose = document.getElementById('btnCloseModal');
  const btnCancel = document.getElementById('btnCancelModal');
  const form = document.getElementById('pkbForm');

  const detailModal = document.getElementById('detailModal');
  const btnCloseDetail = document.getElementById('btnCloseDetailModal');
  const btnCloseDetail2 = document.getElementById('btnCloseDetailBtn');

  // Open Create Modal
  if (btnCreate && modal) {
    btnCreate.addEventListener('click', () => {
      delete modal.dataset.editId;
      document.getElementById('modalTitle').textContent = 'Create New PKB Canvasing';
      if (form) form.reset();
      // Generate Next Transaction Number
      const nextNum = 135 + pkbData.length - 5;
      document.getElementById('formTransNo').value = `027-PKB-2025-DMS0000000${nextNum}`;
      document.getElementById('formStartHour').value = '15-05-2025';
      document.getElementById('formEstHour').value = '15-05-2025';
      document.getElementById('formFinishHour').value = '15-05-2025';
      modal.classList.add('show');
    });
  }

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
