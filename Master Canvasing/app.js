/**
 * Master Canvasing Module Application Logic
 * MPM AHASS Canvasing System
 */

// Initial Sample Master Canvasing Data
let masterData = [
  {
    id: 1,
    kode: 'MC-2026-001',
    nama: 'Canvasing Instansi Pemkab & Dispora',
    wilayah: 'Kepanjen',
    lokasi: 'Kompleks Perkantoran Pemkab Kepanjen',
    tglMulai: '2026-08-01',
    tglSelesai: '2026-08-15',
    periode: '01 Agu - 15 Agu 2026',
    pic: 'Budi Santoso (Koordinator)',
    target: 150,
    realisasi: 128,
    status: 'Aktif',
    catatan: 'Armada Canvasing Mobil 1 & 2. Promo ganti oli gratis busi.'
  },
  {
    id: 2,
    kode: 'MC-2026-002',
    nama: 'AHASS Goes to School (SMK 1 & SMK 4)',
    wilayah: 'Malang Kota',
    lokasi: 'SMKN 1 Malang & SMKN 4 Grafika',
    tglMulai: '2026-08-10',
    tglSelesai: '2026-08-20',
    periode: '10 Agu - 20 Agu 2026',
    pic: 'Rahmat Hidayat',
    target: 200,
    realisasi: 215,
    status: 'Selesai',
    catatan: 'Edukasi safety riding + service kunjung pelajar & guru.'
  },
  {
    id: 3,
    kode: 'MC-2026-003',
    nama: 'Canvasing Komunitas Sawojajar Madyopuro',
    wilayah: 'Malang Kota',
    lokasi: 'Balai RW 05 - 08 Sawojajar',
    tglMulai: '2026-08-18',
    tglSelesai: '2026-08-31',
    periode: '18 Agu - 31 Agu 2026',
    pic: 'Ahmad Faisal',
    target: 180,
    realisasi: 95,
    status: 'Aktif',
    catatan: 'Layanan servis berkala dan tune up hemat akhir pekan.'
  },
  {
    id: 4,
    kode: 'MC-2026-004',
    nama: 'Service Kunjung Pabrik Gula Kebonagung',
    wilayah: 'Kepanjen',
    lokasi: 'Area Parkir Karyawan PG Kebonagung',
    tglMulai: '2026-09-01',
    tglSelesai: '2026-09-10',
    periode: '01 Sep - 10 Sep 2026',
    pic: 'Deni Setiawan',
    target: 250,
    realisasi: 0,
    status: 'Draft',
    catatan: 'Kerjasama dengan serikat pekerja pabrik gula.'
  },
  {
    id: 5,
    kode: 'MC-2026-005',
    nama: 'Canvasing Wisata Songgoriti & Payung',
    wilayah: 'Batu',
    lokasi: 'Pusat Oleh-oleh & Rest Area Songgoriti',
    tglMulai: '2026-08-22',
    tglSelesai: '2026-08-29',
    periode: '22 Agu - 29 Agu 2026',
    pic: 'Hendra Wijaya',
    target: 120,
    realisasi: 88,
    status: 'Aktif',
    catatan: 'Armada motor keliling dan booth pit-stop darurat.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  initSearchAndFilter();
  initModal();
  initLangSwitcher();
  initExportButton();
});

// Render Table Rows
function renderTable(dataToRender = masterData) {
  const tbody = document.getElementById('tableBody');
  const infoText = document.getElementById('tableInfo');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (dataToRender.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 40px; color: var(--text-muted);">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: #94a3b8;">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span style="font-weight: 600;">Data Master Canvasing tidak ditemukan</span>
            <span style="font-size: 13px;">Coba ubah kata kunci pencarian atau filter yang Anda gunakan.</span>
          </div>
        </td>
      </tr>
    `;
    if (infoText) infoText.textContent = `Menampilkan 0 dari ${masterData.length} data`;
    return;
  }

  dataToRender.forEach((item, index) => {
    const percent = item.target > 0 ? Math.min(100, Math.round((item.realisasi / item.target) * 100)) : 0;
    const statusClass = item.status.toLowerCase();

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color: var(--text-muted); font-size: 13px;">${index + 1}</td>
      <td class="code-cell">${item.kode}</td>
      <td>
        <span class="program-title">${item.nama}</span>
        <span class="program-desc">${item.catatan || 'Program canvasing AHASS'}</span>
      </td>
      <td>
        <div class="location-tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <strong>${item.wilayah}</strong> - ${item.lokasi}
        </div>
      </td>
      <td style="font-size: 13px; color: var(--text-main); white-space: nowrap;">${item.periode}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 13px; font-weight: 600; color: var(--text-main);">${item.pic}</span>
        </div>
      </td>
      <td style="font-weight: 700; color: var(--text-main);">${item.target} Unit</td>
      <td>
        <div class="progress-container">
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${percent}%;"></div>
          </div>
          <span class="progress-text">${percent}%</span>
        </div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${item.realisasi} / ${item.target} Unit</div>
      </td>
      <td>
        <span class="badge-status ${statusClass}">
          <span class="status-dot"></span>
          ${item.status}
        </span>
      </td>
      <td>
        <div class="row-actions">
          <button class="btn-action" title="Edit Data" onclick="editItem(${item.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="btn-action delete" title="Hapus Data" onclick="deleteItem(${item.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (infoText) {
    infoText.textContent = `Menampilkan 1 - ${dataToRender.length} dari ${dataToRender.length} data`;
  }
}

// Search and Filter Handling
function initSearchAndFilter() {
  const searchInput = document.getElementById('searchInput');
  const filterWilayah = document.getElementById('filterWilayah');
  const filterStatus = document.getElementById('filterStatus');
  const btnReset = document.getElementById('btnResetFilter');

  const applyFilters = () => {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const wilayahVal = filterWilayah ? filterWilayah.value : '';
    const statusVal = filterStatus ? filterStatus.value : '';

    const filtered = masterData.filter(item => {
      const matchQuery = !query ||
        item.kode.toLowerCase().includes(query) ||
        item.nama.toLowerCase().includes(query) ||
        item.lokasi.toLowerCase().includes(query) ||
        item.pic.toLowerCase().includes(query);

      const matchWilayah = !wilayahVal || item.wilayah === wilayahVal;
      const matchStatus = !statusVal || item.status === statusVal;

      return matchQuery && matchWilayah && matchStatus;
    });

    renderTable(filtered);
  };

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (filterWilayah) filterWilayah.addEventListener('change', applyFilters);
  if (filterStatus) filterStatus.addEventListener('change', applyFilters);

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (filterWilayah) filterWilayah.value = '';
      if (filterStatus) filterStatus.value = '';
      renderTable(masterData);
      showToast('Filter telah direset', 'info');
    });
  }
}

// Modal Form Handling
function initModal() {
  const modal = document.getElementById('modalBackdrop');
  const btnOpen = document.getElementById('btnOpenModal');
  const btnClose = document.getElementById('btnCloseModal');
  const btnCancel = document.getElementById('btnCancelModal');
  const form = document.getElementById('masterForm');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('show');
    // Generate next code
    const nextNum = masterData.length + 1;
    const nextCode = `MC-2026-${String(nextNum).padStart(3, '0')}`;
    const codeInput = document.getElementById('formKode');
    if (codeInput) codeInput.value = nextCode;
  };

  const closeModal = () => {
    modal.classList.remove('show');
    if (form) form.reset();
  };

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const kode = document.getElementById('formKode').value;
      const nama = document.getElementById('formNama').value;
      const wilayah = document.getElementById('formWilayah').value;
      const lokasi = document.getElementById('formLokasi').value;
      const tglMulai = document.getElementById('formTglMulai').value;
      const tglSelesai = document.getElementById('formTglSelesai').value;
      const pic = document.getElementById('formPIC').value;
      const target = parseInt(document.getElementById('formTarget').value) || 0;
      const status = document.getElementById('formStatus').value;
      const catatan = document.getElementById('formCatatan').value;

      const formatTgl = (tglStr) => {
        if (!tglStr) return '';
        const d = new Date(tglStr);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      };

      const newItem = {
        id: Date.now(),
        kode,
        nama,
        wilayah,
        lokasi,
        tglMulai,
        tglSelesai,
        periode: `${formatTgl(tglMulai)} - ${formatTgl(tglSelesai)}`,
        pic,
        target,
        realisasi: 0,
        status,
        catatan
      };

      masterData.unshift(newItem);
      renderTable();
      closeModal();
      showToast(`Data Master Canvasing ${kode} berhasil disimpan!`, 'success');
    });
  }
}

// Global actions
window.editItem = function(id) {
  const item = masterData.find(d => d.id === id);
  if (!item) return;
  showToast(`Fitur edit untuk ${item.kode} sedang disiapkan.`, 'info');
};

window.deleteItem = function(id) {
  const item = masterData.find(d => d.id === id);
  if (!item) return;
  if (confirm(`Apakah Anda yakin ingin menghapus data master "${item.nama}" (${item.kode})?`)) {
    masterData = masterData.filter(d => d.id !== id);
    renderTable();
    showToast(`Data ${item.kode} berhasil dihapus.`, 'info');
  }
};

// Export button
function initExportButton() {
  const btnExport = document.getElementById('btnExport');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      showToast('Mengunduh rekapan data Master Canvasing (.xlsx)...', 'success');
    });
  }
}

// Language Switcher
function initLangSwitcher() {
  const btnId = document.getElementById('langId');
  const btnEn = document.getElementById('langEn');
  if (!btnId || !btnEn) return;

  btnId.addEventListener('click', () => {
    btnId.classList.add('active');
    btnEn.classList.remove('active');
    showToast('Bahasa dialihkan ke Indonesia', 'info');
  });

  btnEn.addEventListener('click', () => {
    btnEn.classList.add('active');
    btnId.classList.remove('active');
    showToast('Language set to English', 'info');
  });
}

// Toast Alert
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
