/**
 * Main Layout Shell Logic - MPM AHASS Canvasing Portal
 * Controls Root Sidebar, Submenu Reception, and Module Switching
 */

// Module Definitions
const MODULES = {
  list: {
    key: 'list',
    name: 'List Canvasing',
    path: 'List Canvasing/index.html',
    hash: '#list-canvasing'
  },
  master: {
    key: 'master',
    name: 'Master Canvasing',
    path: 'Master Canvasing/index.html',
    hash: '#master-canvasing'
  }
};

let currentModule = 'list';

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initModuleNavigation();
  initHeaderControls();
  handleInitialRoute();
});

/**
 * Initialize Sidebar Toggling & Collapsing
 */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  const collapseBtn = document.getElementById('btnSidebarCollapse');
  const brandToggle = document.getElementById('brandToggle');
  const btnReception = document.getElementById('btnReception');
  const groupReception = document.getElementById('groupReception');

  // Toggle Collapse/Expand on Desktop & Open/Close on Mobile
  const toggleSidebarState = () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('collapsed');
      // If expanding from collapsed and Reception is parent, keep accordion open
      if (!sidebar.classList.contains('collapsed') && groupReception) {
        groupReception.classList.add('open');
      }
    }
  };

  if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebarState);
  if (collapseBtn) collapseBtn.addEventListener('click', toggleSidebarState);
  if (brandToggle) brandToggle.addEventListener('click', toggleSidebarState);

  // Accordion toggle on Reception parent click
  if (btnReception && groupReception) {
    btnReception.addEventListener('click', (e) => {
      e.stopPropagation();

      // If sidebar is currently collapsed, expanding Reception should expand the sidebar
      if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
        groupReception.classList.add('open');
      } else {
        groupReception.classList.toggle('open');
      }
    });
  }

  // Close sidebar on mobile when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
}

/**
 * Initialize Module Switching between Master Canvasing and List Canvasing
 */
function initModuleNavigation() {
  // Elements that trigger module switch
  const navItems = document.querySelectorAll('[data-module]');

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const moduleKey = item.getAttribute('data-module');
      if (moduleKey && MODULES[moduleKey]) {
        switchModule(moduleKey);

        // Auto close mobile sidebar after selection
        if (window.innerWidth <= 768) {
          const sidebar = document.getElementById('sidebar');
          if (sidebar) sidebar.classList.remove('open');
        }
      }
    });
  });

  // Handle browser back/forward navigation
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash === '#master-canvasing') {
      switchModule('master', false);
    } else if (hash === '#list-canvasing') {
      switchModule('list', false);
    }
  });
}

/**
 * Switch Active Module
 * @param {string} moduleKey - 'list' or 'master'
 * @param {boolean} updateHash - whether to update window.location.hash
 */
function switchModule(moduleKey, updateHash = true) {
  const targetModule = MODULES[moduleKey];
  if (!targetModule) return;

  currentModule = moduleKey;
  const frame = document.getElementById('moduleFrame');
  const crumbActive = document.getElementById('crumbActive');

  // Update iframe destination
  if (frame && frame.getAttribute('src') !== targetModule.path) {
    frame.src = targetModule.path;
  }

  // Update Breadcrumbs
  if (crumbActive) {
    crumbActive.textContent = targetModule.name;
  }

  // Update active state in accordion submenu
  const navList = document.getElementById('navListCanvasing');
  const navMaster = document.getElementById('navMasterCanvasing');
  if (navList) navList.classList.toggle('active', moduleKey === 'list');
  if (navMaster) navMaster.classList.toggle('active', moduleKey === 'master');

  // Update active state in flyout submenu
  const flyoutList = document.getElementById('flyoutListCanvasing');
  const flyoutMaster = document.getElementById('flyoutMasterCanvasing');
  if (flyoutList) flyoutList.classList.toggle('active', moduleKey === 'list');
  if (flyoutMaster) flyoutMaster.classList.toggle('active', moduleKey === 'master');

  // Update active state in quick tabs
  const tabList = document.getElementById('tabListCanvasing');
  const tabMaster = document.getElementById('tabMasterCanvasing');
  if (tabList) tabList.classList.toggle('active', moduleKey === 'list');
  if (tabMaster) tabMaster.classList.toggle('active', moduleKey === 'master');

  // Update URL hash
  if (updateHash) {
    window.location.hash = targetModule.hash;
  }

  showToast(`Beralih ke modul ${targetModule.name}`, 'info');
}

/**
 * Handle initial route based on URL hash
 */
function handleInitialRoute() {
  const hash = window.location.hash;
  if (hash === '#master-canvasing') {
    switchModule('master', false);
  } else {
    switchModule('list', false);
  }
}

/**
 * Header Controls (Language switch, User Profile, Help)
 */
function initHeaderControls() {
  const btnId = document.getElementById('langId');
  const btnEn = document.getElementById('langEn');
  const userMenuBtn = document.getElementById('userMenuBtn');
  const btnHelp = document.getElementById('btnHelp');

  if (btnId && btnEn) {
    btnId.addEventListener('click', () => {
      btnId.classList.add('active');
      btnEn.classList.remove('active');
      showToast('Bahasa portal diganti ke Indonesia', 'info');
    });

    btnEn.addEventListener('click', () => {
      btnEn.classList.add('active');
      btnId.classList.remove('active');
      showToast('Portal language switched to English', 'info');
    });
  }

  if (userMenuBtn) {
    userMenuBtn.addEventListener('click', () => {
      showToast('User: Pak Kabeng (150 - Chiro) | MPM AHASS', 'info');
    });
  }

  if (btnHelp) {
    btnHelp.addEventListener('click', () => {
      showToast('Panduan modul Canvasing Reception MPM AHASS', 'info');
    });
  }
}

/**
 * Portal Toast Notification System
 */
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

  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
