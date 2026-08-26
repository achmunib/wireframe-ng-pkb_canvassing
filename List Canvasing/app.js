// State Management
let currentStep = 1;
const totalSteps = 5;
let currentFuelLevel = 4; // Default full/sample level
let currentMethod = null; // 'booking' | 'non-booking'
let activeBooking = null;

// Sample Booking Appointments for simulation
const sampleBookings = [
  {
    id: 'BK-20240826-001',
    plate: 'AG 1000 ELM',
    customer: 'Achmad Munib',
    phone: '081234567890',
    model: 'VG - VARIO 125 CBS ISS',
    engine: 'JB91E1260677',
    frame: 'MH1J891158K260',
    color: 'BLACK',
    year: '2024',
    dealer: 'MPM Motor Jombang',
    lastKm: '1000',
    currentKm: '233',
    reason: 'Inisiatif Sendiri',
    time: '09:30 WIB',
    service: 'Servis Berkala & Ganti Oli MPX2'
  },
  {
    id: 'BK-20240826-002',
    plate: 'B 4592 KLR',
    customer: 'Budi Santoso',
    phone: '085712345678',
    model: 'VG - VARIO 160 ABS',
    engine: 'KF11E1084920',
    frame: 'MH1KF1118PK092144',
    color: 'MATTE RED',
    year: '2023',
    dealer: 'MPM Motor Surabaya',
    lastKm: '12450',
    currentKm: '12500',
    reason: 'Servis Berkala',
    time: '10:45 WIB',
    service: 'Cek CVT & Kampas Rem'
  },
  {
    id: 'BK-20240826-003',
    plate: 'L 2831 AB',
    customer: 'Siti Rahmawati',
    phone: '087898765432',
    model: 'VG - SCOOPY PRESTIGE',
    engine: 'JM31E2948102',
    frame: 'MH1JM3116PK748291',
    color: 'WHITE',
    year: '2024',
    dealer: 'MPM Motor Malang',
    lastKm: '5400',
    currentKm: '5450',
    reason: 'Ganti Oli',
    time: '13:15 WIB',
    service: 'Ganti Busi & Oli MPX2'
  }
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
  initMethodSelection();
  initStepper();
  initCollapsibleCard();
  initFuelIndicator();
  initVehicleScanner();
  initCarrierStep();
  initCekAjaDuluStep();
  initServiceAndPartsStep();
  initSummaryStep();
  initModal();
  initSidebar();
  initLangSwitcher();
  initHistoryShowMore();
});

// Method Selection (Landing Page Logic: Booking vs Non-Booking)
function initMethodSelection() {
  const btnBooking = document.getElementById('btnChooseBooking');
  const btnNonBooking = document.getElementById('btnChooseNonBooking');
  const btnSwitchMethod = document.getElementById('btnSwitchMethod');
  const bookingModal = document.getElementById('bookingSelectModal');
  const btnCloseModal = document.getElementById('btnBookingModalClose');
  const btnConfirmBooking = document.getElementById('btnConfirmBookingChoice');
  const btnManualBooking = document.getElementById('btnManualBooking');
  const inputSearch = document.getElementById('inputSearchBooking');
  const bookingCards = document.querySelectorAll('.booking-item-card');

  // Choose Booking -> Open selection modal
  if (btnBooking && bookingModal) {
    btnBooking.addEventListener('click', () => {
      bookingModal.style.display = 'flex';
      if (inputSearch) {
        inputSearch.value = '';
        inputSearch.focus();
        bookingCards.forEach(c => c.style.display = 'flex');
      }
    });
  }

  // Choose Non-Booking -> Proceed to form directly
  if (btnNonBooking) {
    btnNonBooking.addEventListener('click', () => {
      selectBookingMethod('non-booking');
      showToast('Masuk ke mode Non-Booking (Walk-in Canvasing)');
    });
  }

  // Switch Method button from top banner
  if (btnSwitchMethod) {
    btnSwitchMethod.addEventListener('click', () => {
      showMethodSelection();
    });
  }

  // Modal Close Button
  if (btnCloseModal && bookingModal) {
    btnCloseModal.addEventListener('click', () => {
      bookingModal.style.display = 'none';
    });
  }

  // Close modal when clicking outside card
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.style.display = 'none';
      }
    });
  }

  // Search in booking modal
  if (inputSearch) {
    inputSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      bookingCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  // Select card in modal
  let selectedBookingId = 'BK-20240826-001';
  bookingCards.forEach(card => {
    card.addEventListener('click', () => {
      bookingCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedBookingId = card.dataset.bookingId;
    });
  });

  // Confirm booking selection
  if (btnConfirmBooking) {
    btnConfirmBooking.addEventListener('click', () => {
      const found = sampleBookings.find(b => b.id === selectedBookingId) || sampleBookings[0];
      if (bookingModal) bookingModal.style.display = 'none';
      selectBookingMethod('booking', found);
      showToast(`Data Booking ${found.id} dimuat (${found.plate})`);
    });
  }

  // Manual booking (without pre-filled appointment)
  if (btnManualBooking) {
    btnManualBooking.addEventListener('click', () => {
      if (bookingModal) bookingModal.style.display = 'none';
      selectBookingMethod('booking', null);
      showToast('Masuk ke mode Booking (Input Manual)');
    });
  }

  // Check URL hash on initial load
  const hash = window.location.hash;
  if (hash === '#booking') {
    selectBookingMethod('booking', sampleBookings[0]);
  } else if (hash === '#non-booking') {
    selectBookingMethod('non-booking');
  } else {
    showMethodSelection();
  }

  // Listen for reset command from parent portal
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'RESET_VIEW') {
      showMethodSelection();
    }
  });
}

function showMethodSelection() {
  const methodView = document.getElementById('methodSelectionView');
  const wizardView = document.getElementById('wizardContentView');
  if (methodView) methodView.style.display = 'flex';
  if (wizardView) wizardView.style.display = 'none';

  // Notify parent shell
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'UPDATE_CRUMB', subCrumb: 'Pilih Metode' }, '*');
  }
}

function selectBookingMethod(method, bookingData = null) {
  currentMethod = method;
  activeBooking = bookingData;

  const methodView = document.getElementById('methodSelectionView');
  const wizardView = document.getElementById('wizardContentView');
  const chip = document.getElementById('methodChip');
  const chipText = document.getElementById('methodChipText');
  const detailText = document.getElementById('methodBannerDetail');
  const summaryQueueType = document.getElementById('summaryQueueType');

  if (methodView) methodView.style.display = 'none';
  if (wizardView) {
    wizardView.style.display = 'block';
    wizardView.style.animation = 'fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  if (method === 'booking') {
    if (chip) chip.className = 'method-chip booking';
    if (chipText) chipText.textContent = 'Metode: Booking';
    if (detailText) {
      detailText.textContent = bookingData
        ? `Jadwal: ${bookingData.id} • ${bookingData.plate} (${bookingData.customer}) • ${bookingData.time}`
        : 'Pendaftaran PKB Mode Booking Service (Manual)';
    }
    if (summaryQueueType) summaryQueueType.value = 'Booking';

    if (bookingData) {
      // Auto fill vehicle
      const scanInput = document.getElementById('scanVehicleInput');
      if (scanInput) scanInput.value = bookingData.engine;
      if (window.loadCustomVehicle) {
        window.loadCustomVehicle(bookingData);
      }
      // Auto fill carrier
      const carrierPhone = document.getElementById('carrierInputPhone');
      const carrierFirst = document.getElementById('carrierFirstName');
      const carrierLast = document.getElementById('carrierLastName');
      const searchPhone = document.getElementById('carrierSearchPhone');
      if (carrierPhone) carrierPhone.value = bookingData.phone;
      if (searchPhone) searchPhone.value = bookingData.phone;
      const names = bookingData.customer.split(' ');
      if (carrierFirst) carrierFirst.value = names[0] || '';
      if (carrierLast) carrierLast.value = names.slice(1).join(' ') || '';
    }

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'UPDATE_CRUMB', subCrumb: 'Booking' }, '*');
    }
  } else {
    // Non-Booking
    if (chip) chip.className = 'method-chip non-booking';
    if (chipText) chipText.textContent = 'Metode: Non-Booking';
    if (detailText) detailText.textContent = 'Pendaftaran PKB Reguler / Walk-In Canvasing';
    if (summaryQueueType) summaryQueueType.value = 'Regular';

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'UPDATE_CRUMB', subCrumb: 'Non-Booking' }, '*');
    }
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
      showMethodSelection();
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
      if (kembaliText) kembaliText.textContent = 'Pilih Metode';
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

