// State Management
let currentStep = 1;
const totalSteps = 5;
let currentFuelLevel = 4; // Default full/sample level

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
    currentKm: '233',
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
}
];

document.addEventListener('DOMContentLoaded', () => {
  initStepper();
  initCollapsibleCard();
  initFuelIndicator();
  initVehicleScanner();
  initCarrierStep();
  initModal();
  initSidebar();
  initLangSwitcher();
  initHistoryShowMore();
});

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
    if (currentStep < totalSteps) {
      goToStep(currentStep + 1);
    } else {
      showToast('PKB Berhasil Disimpan & Diteruskan ke Mekanik!');
    }
  });

  btnKembali.addEventListener('click', () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });

  function goToStep(step) {
    currentStep = step;
    updateStepperUI();
  }

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

    // Update Button Labels
    if (currentStep === totalSteps) {
      nextBtnText.textContent = 'Save PKB';
    } else {
      nextBtnText.textContent = 'Next';
    }

    // Toggle Kembali button disable state
    btnKembali.style.opacity = currentStep === 1 ? '0.6' : '1';
    btnKembali.style.pointerEvents = currentStep === 1 ? 'none' : 'auto';
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

// Vehicle Scanner & Data Populator
function initVehicleScanner() {
  const scanInput = document.getElementById('scanVehicleInput');
  const btnScan = document.getElementById('btnScanVehicle');
  const btnClear = document.getElementById('btnClearScan');
  const vehicleBox = document.getElementById('vehicleInfoCard');
  const emptyState = document.getElementById('vehicleEmptyState');
  const kmInput = document.getElementById('kilometerInput');
  const btnEdit = document.getElementById('btnEditVehicle');
  const btnDelete = document.getElementById('btnDeleteVehicle');

  btnScan.addEventListener('click', () => {
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
    resetVehicleData();
    showToast('Vehicle input cleared');
  });

  if (btnDelete) {
    btnDelete.addEventListener('click', () => {
      resetVehicleData();
      showToast('Vehicle data removed');
    });
  }

  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      const modal = document.getElementById('inputDataModal');
      if (modal) {
        document.getElementById('modalPlate').value = document.getElementById('dispPlate').textContent;
        document.getElementById('modalModel').value = document.getElementById('dispModel').textContent;
        document.getElementById('modalEngine').value = document.getElementById('dispEngine').textContent;
        document.getElementById('modalFrame').value = document.getElementById('dispFrame').textContent;
        document.getElementById('modalYear').value = document.getElementById('dispYear').textContent;
        modal.style.display = 'flex';
      }
    });
  }

  function loadVehicleData(vehicle) {
    if (document.getElementById('dispPlate')) document.getElementById('dispPlate').textContent = vehicle.plate;
    if (document.getElementById('dispModel')) document.getElementById('dispModel').textContent = vehicle.model;
    if (document.getElementById('dispEngine')) document.getElementById('dispEngine').textContent = vehicle.engine;
    if (document.getElementById('dispFrame')) document.getElementById('dispFrame').textContent = vehicle.frame;
    if (document.getElementById('dispColor')) document.getElementById('dispColor').textContent = vehicle.color || 'BLACK';
    if (document.getElementById('dispYear')) document.getElementById('dispYear').textContent = vehicle.year;
    if (document.getElementById('dispPurchaseDate')) document.getElementById('dispPurchaseDate').textContent = vehicle.purchaseDate || '03-05-2024';
    if (document.getElementById('dispDealer')) document.getElementById('dispDealer').textContent = vehicle.dealer || 'MPM Motor Jombang';
    if (document.getElementById('dispLastKm')) document.getElementById('dispLastKm').textContent = vehicle.lastKm || '1000';

    if (kmInput && vehicle.currentKm) {
      kmInput.value = vehicle.currentKm;
    }

    if (vehicleBox) vehicleBox.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
  }

  function resetVehicleData() {
    if (vehicleBox) vehicleBox.style.display = 'none';
    if (emptyState) emptyState.style.display = 'flex';
  }

  // Export helper for modal
  window.loadCustomVehicle = loadVehicleData;
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
  const carrierPhone = document.getElementById('carrierInputPhone');
  const carrierFirst = document.getElementById('carrierFirstName');
  const carrierLast = document.getElementById('carrierLastName');
  const btnViewDetail = document.getElementById('btnViewDetailCarrier');

  if (btnSearch && searchInput) {
    const doSearch = () => {
      const query = searchInput.value.trim();
      if (!query) {
        showToast('Please enter a phone number to search.');
        return;
      }
      if (carrierPhone) carrierPhone.value = query;
      if (carrierFirst) carrierFirst.value = 'Achmad';
      if (carrierLast) carrierLast.value = 'Munib';
      showToast(`Carrier found for phone: ${query}`);
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
      searchInput.value = '';
      if (carrierPhone) carrierPhone.value = '';
      if (carrierFirst) carrierFirst.value = '';
      if (carrierLast) carrierLast.value = '';
      showToast('Carrier search input cleared');
    });
  }

  if (btnAddCarrier) {
    btnAddCarrier.addEventListener('click', () => {
      if (carrierPhone && searchInput) {
        carrierPhone.value = searchInput.value;
      }
      if (carrierFirst) {
        carrierFirst.value = '';
        carrierFirst.focus();
      }
      if (carrierLast) carrierLast.value = '';
      showToast('Ready to input new carrier data');
    });
  }

  if (btnViewDetail) {
    btnViewDetail.addEventListener('click', () => {
      const name = `${carrierFirst?.value || 'Achmad'} ${carrierLast?.value || 'Munib'}`.trim();
      const phone = carrierPhone?.value || '085732255998';
      showToast(`Viewing details for: ${name} (${phone})`);
    });
  }
}

// History Show More Action
function initHistoryShowMore() {
  const btnShowMore = document.getElementById('btnShowMoreHistory');
  if (!btnShowMore) return;

  btnShowMore.addEventListener('click', () => {
    showToast('Showing all historical services (2 records displayed)');
  });
}

// Modal Handling
function initModal() {
  const modal = document.getElementById('inputDataModal');
  const btnOpen = document.getElementById('btnInputNewData');
  const btnClose = document.getElementById('btnModalClose');
  const btnCancel = document.getElementById('btnModalCancel');
  const form = document.getElementById('vehicleForm');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  }

  const closeModal = () => {
    modal.style.display = 'none';
  };

  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newVehicle = {
      plate: document.getElementById('modalPlate').value,
      model: document.getElementById('modalModel').value,
      engine: document.getElementById('modalEngine').value,
      frame: document.getElementById('modalFrame').value,
      customer: document.getElementById('modalOwner').value,
      year: document.getElementById('modalYear').value,
      km: '150',
      history: []
    };

    if (window.loadCustomVehicle) {
      window.loadCustomVehicle(newVehicle);
      document.getElementById('scanVehicleInput').value = newVehicle.engine;
    }

    closeModal();
    form.reset();
    showToast('New vehicle registered successfully!');
  });
}

// Sidebar toggle for responsiveness
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
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

// Toast Helper
function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
