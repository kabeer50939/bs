/**
 * DHORIA ACADEMY GWADAR — MASTER ADMIN CONTROLLER (admin.js)
 * High-performance, reactive management logic for all website components.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================================
  // AUTHENTICATION & USER SESSION GUARD
  // ============================================================
  let currentUser = null;
  try {
    const rawUser = localStorage.getItem('dhoria_admin_user') || sessionStorage.getItem('dhoria_admin_user');
    if (rawUser) {
      currentUser = JSON.parse(rawUser);
    }
  } catch (e) {}

  if (!currentUser) {
    currentUser = { username: 'admin', fullName: 'Administrator', role: 'Super Admin' };
  }

  // Populate sidebar user details
  const sbName = document.getElementById('sidebarUserName');
  const sbRole = document.getElementById('sidebarUserRole');
  const sbAvatar = document.getElementById('sidebarUserAvatar');
  if (sbName) sbName.textContent = currentUser.fullName || currentUser.username;
  if (sbRole) sbRole.textContent = currentUser.role || 'Admin';
  if (sbAvatar) sbAvatar.textContent = (currentUser.fullName || currentUser.username || 'A').charAt(0).toUpperCase();

  // Logout Handler
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to log out of the Admin Panel?')) {
        localStorage.removeItem('dhoria_admin_token');
        localStorage.removeItem('dhoria_admin_user');
        sessionStorage.removeItem('dhoria_admin_token');
        sessionStorage.removeItem('dhoria_admin_user');
        window.location.href = 'login.html';
      }
    });
  }

  // ============================================================
  // THEME ENGINE
  // ============================================================
  const themeToggleBtn = document.getElementById('adminThemeToggle');
  const themeIcon = document.getElementById('adminThemeIcon');
  
  function updateThemeUI(t) {
    document.documentElement.setAttribute('data-admin-theme', t);
    localStorage.setItem('dhoria-admin-theme', t);
    if (themeIcon) {
      themeIcon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  const currentTheme = localStorage.getItem('dhoria-admin-theme') || 'light';
  updateThemeUI(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-admin-theme');
      updateThemeUI(active === 'dark' ? 'light' : 'dark');
    });
  }

  // ============================================================
  // SIDEBAR & SECTION NAVIGATION
  // ============================================================
  const sidebar = document.getElementById('adminSidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const topbarSectionName = document.getElementById('topbarCurrentSection');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  window.switchSection = function(sectionId) {
    sidebarLinks.forEach(link => {
      if (link.dataset.section === sectionId) {
        link.classList.add('active');
        if (topbarSectionName) {
          topbarSectionName.textContent = link.querySelector('span').textContent;
        }
      } else {
        link.classList.remove('active');
      }
    });

    document.querySelectorAll('.admin-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById(`sec-${sectionId}`);
    if (targetSec) {
      targetSec.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (window.innerWidth <= 1024 && sidebar) {
      sidebar.classList.remove('open');
    }

    // Trigger section-specific renderer
    loadSectionData(sectionId);
  };

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.section;
      if (target) switchSection(target);
    });
  });

  // ============================================================
  // TOAST NOTIFICATION SYSTEM
  // ============================================================
  window.showToast = function(title, message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast toast-${type}`;
    
    let iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-times-circle';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle';
    if (type === 'info') iconClass = 'fa-info-circle';

    toast.innerHTML = `
      <i class="fas ${iconClass} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // ============================================================
  // MODAL CONTROLLER
  // ============================================================
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');

    // Auto-reset photo upload widgets on fresh add forms (no hidden ID = new record)
    const formIdMap = {
      addStaffModal: { id: 'staffFormId', photo: 'staffFormPhoto', preview: 'staffPhotoPreview', badge: 'staffCompressionBadge', def: 'assets/images/logo.png' },
      addHeroSlideModal: { id: 'heroFormId', photo: 'heroFormImage', preview: 'heroPhotoPreview', badge: 'heroCompressionBadge', def: 'assets/images/hero.png' },
      addEventModal: { id: 'eventFormId', photo: 'eventFormImage', preview: 'eventPhotoPreview', badge: 'eventCompressionBadge', def: 'assets/images/weebly/3061265.jpg' },
      addUserModal: { id: 'userFormId', photo: 'userFormAvatar', preview: 'userAvatarPreview', badge: 'userCompressionBadge', def: 'assets/images/logo.png' },
      addAdmissionModal: { id: null, photo: 'manAdmPhoto', preview: 'admPhotoPreview', badge: 'admCompressionBadge', def: 'assets/images/students.png' },
      addGalleryModal: { id: null, photo: 'galFormImage', preview: 'galPhotoPreview', badge: 'galCompressionBadge', def: 'assets/images/gathering.jpg' },
      addVisitorModal: { id: 'visFormId', photo: 'visFormPhoto', preview: 'visPhotoPreview', badge: 'visCompressionBadge', def: 'assets/images/logo.png' },
      addArticleModal: { id: 'artFormId', photo: 'artFormPhoto', preview: 'artPhotoPreview', badge: 'artCompressionBadge', def: 'assets/images/logo.png' }
    };

    const cfg = formIdMap[modalId];
    if (cfg) {
      const isNewRecord = !cfg.id || !document.getElementById(cfg.id)?.value;
      if (isNewRecord) {
        const hiddenEl = document.getElementById(cfg.photo);
        if (hiddenEl) hiddenEl.value = cfg.def;
        const previewEl = document.getElementById(cfg.preview);
        if (previewEl) previewEl.src = '../' + cfg.def;
        const badgeEl = document.getElementById(cfg.badge);
        if (badgeEl) badgeEl.innerHTML = '';
        const fileInput = modal.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      }
    }

    // Reset modal titles for non-photo modals on fresh Add (no record ID)
    const titleResetMap = {
      addPartnerModal: { idField: 'partnerFormId', titleId: 'partnerModalTitle', icon: 'fa-handshake', text: 'Partner Organization' },
      addAnnouncementModal: { idField: 'annFormId', titleId: 'announcementModalTitle', icon: 'fa-bullhorn', text: 'New Announcement' },
      addCourseModal: { idField: 'crsFormId', titleId: 'courseModalTitle', icon: 'fa-book', text: 'Course / Educational Program' },
      editShiftModal: { idField: 'shiftFormId', titleId: null, icon: null, text: null }
    };
    const trCfg = titleResetMap[modalId];
    if (trCfg && trCfg.titleId) {
      const idVal = document.getElementById(trCfg.idField)?.value || '';
      if (!idVal) {
        const titleEl = document.getElementById(trCfg.titleId);
        if (titleEl) titleEl.innerHTML = `<i class="fas ${trCfg.icon}"></i> ${trCfg.text}`;
      }
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    // Clear the hidden form ID field so the next open knows it's a fresh "add" form
    const idFieldMap = {
      addStaffModal: 'staffFormId',
      addHeroSlideModal: 'heroFormId',
      addEventModal: 'eventFormId',
      addUserModal: 'userFormId',
      addVisitorModal: 'visFormId',
      addPartnerModal: 'partnerFormId',
      addAnnouncementModal: 'annFormId',
      addArticleModal: 'artFormId',
      addCourseModal: 'crsFormId',
      editShiftModal: 'shiftFormId'
    };
    const idField = idFieldMap[modalId];
    if (idField) {
      const el = document.getElementById(idField);
      if (el) el.value = '';
    }
    const form = modal.querySelector('form');
    if (form) form.reset();
  };

  document.querySelectorAll('.admin-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.admin-modal-backdrop.active').forEach(m => m.classList.remove('active'));
    }
  });

  // ============================================================
  // IMAGE URL RESOLVER (ADMIN PANEL CONTEXT)
  // ============================================================
  function resolveAdminImg(url, fallback = 'assets/images/logo.png') {
    if (!url || typeof url !== 'string' || !url.trim()) {
      const fb = fallback || 'assets/images/logo.png';
      return (fb.startsWith('http') || fb.startsWith('data:') || fb.startsWith('../')) ? fb : '../' + fb;
    }
    const clean = url.trim();
    if (clean.startsWith('data:') || clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('blob:') || clean.startsWith('../')) {
      return clean;
    }
    return '../' + clean;
  }

  // ============================================================
  // AUTOMATIC IMAGE COMPRESSION & OPTIMIZATION ENGINE
  // ============================================================
  async function compressAndProcessImage(imageSource, options = {}) {
    const maxWidth = options.maxWidth || 1000;
    const maxHeight = options.maxHeight || 1000;
    let initialQuality = options.quality !== undefined ? options.quality : 0.82;
    const filename = options.filename || 'image';
    const folder = options.folder || 'uploads';

    // 1. Convert File/Blob to Image Data URL
    let dataUrl = '';
    let originalBytes = 0;
    if (typeof imageSource === 'string') {
      dataUrl = imageSource;
      originalBytes = Math.round((dataUrl.length * 3) / 4);
    } else {
      originalBytes = imageSource.size;
      dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageSource);
      });
    }

    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image for processing'));
      image.src = dataUrl;
    });

    // 2. Calculate optimal proportional dimensions
    let width = img.width;
    let height = img.height;

    if (width > maxWidth || height > maxHeight) {
      if (width / height > maxWidth / maxHeight) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      } else {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }

    // 3. Render onto Canvas with high smoothing
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    // 4. Adaptive multi-pass compression to guarantee small size in KB
    let compressedDataUrl = canvas.toDataURL('image/jpeg', initialQuality);
    let compressedBytes = Math.round((compressedDataUrl.length * 3) / 4);

    if (compressedBytes > 180 * 1024 && initialQuality > 0.7) {
      compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
      compressedBytes = Math.round((compressedDataUrl.length * 3) / 4);
    }
    if (compressedBytes > 250 * 1024) {
      compressedDataUrl = canvas.toDataURL('image/jpeg', 0.65);
      compressedBytes = Math.round((compressedDataUrl.length * 3) / 4);
    }

    const origSizeKB = +(originalBytes / 1024).toFixed(1);
    const compressedSizeKB = +(compressedBytes / 1024).toFixed(1);
    const savingsPercent = originalBytes > compressedBytes ? Math.round(((originalBytes - compressedBytes) / originalBytes) * 100) : 0;

    // 5. Save to Server Uploads Directory or fallback to base64
    let finalUrl = compressedDataUrl;
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: compressedDataUrl,
          filename: filename,
          folder: folder
        })
      });
      if (res.ok) {
        const resJson = await res.json();
        if (resJson.success && resJson.url) {
          finalUrl = resJson.url;
        }
      }
    } catch (e) {
      // LocalStorage / DataURL fallback
    }

    return {
      url: finalUrl,
      base64: compressedDataUrl,
      origSizeKB,
      compressedSizeKB,
      width,
      height,
      savingsPercent
    };
  }

  window.triggerImageCompression = async function(fileInput, hiddenFieldId, previewImgId, badgeContainerId, options = {}) {
    if (!fileInput.files || !fileInput.files[0]) return;
    const file = fileInput.files[0];
    const badge = document.getElementById(badgeContainerId);
    if (badge) {
      badge.innerHTML = '<span class="compression-stat-badge processing"><i class="fas fa-spinner fa-spin"></i> Optimizing & Compressing...</span>';
    }

    try {
      const result = await compressAndProcessImage(file, options);
      const hidden = document.getElementById(hiddenFieldId);
      if (hidden) hidden.value = result.url;

      const preview = document.getElementById(previewImgId);
      if (preview) {
        preview.src = result.url.startsWith('data:') ? result.url : (result.url.startsWith('http') ? result.url : '../' + result.url);
      }

      if (badge) {
        badge.innerHTML = `<span class="compression-stat-badge"><i class="fas fa-magic"></i> Auto-Compressed: ${result.compressedSizeKB} KB (Saved ${result.savingsPercent}%)</span>`;
      }

      showToast('Image Compressed', `Optimized to ${result.compressedSizeKB} KB (from ${result.origSizeKB} KB).`, 'success');
    } catch (err) {
      showToast('Compression Failed', err.message, 'error');
      if (badge) badge.innerHTML = '';
    }
  };

  window.resetImageField = function(hiddenFieldId, previewImgId, badgeContainerId, defaultUrl) {
    const hidden = document.getElementById(hiddenFieldId);
    if (hidden) hidden.value = defaultUrl;
    const preview = document.getElementById(previewImgId);
    if (preview) preview.src = defaultUrl.startsWith('http') || defaultUrl.startsWith('data:') ? defaultUrl : '../' + defaultUrl;
    const badge = document.getElementById(badgeContainerId);
    if (badge) badge.innerHTML = '';
    showToast('Reset', 'Picture reset to default.');
  };

  window.replaceStudentPhoto = async function(admId, input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const badge = document.getElementById('dossierCompressionBadge');
    if (badge) {
      badge.innerHTML = '<span class="compression-stat-badge processing"><i class="fas fa-spinner fa-spin"></i> Compressing...</span>';
    }

    try {
      const result = await compressAndProcessImage(file, {
        maxWidth: 600,
        maxHeight: 600,
        folder: 'students',
        filename: 'student-' + admId.toLowerCase()
      });

      // Update DB record
      DhoriaDB.update('admissions', admId, { photoUrl: result.url }, currentUser.username);

      // Update preview in modal
      const preview = document.getElementById('dossierStudentPhotoImg');
      if (preview) {
        preview.src = result.url.startsWith('data:') ? result.url : (result.url.startsWith('http') ? result.url : '../' + result.url);
      }

      if (badge) {
        badge.innerHTML = `<span class="compression-stat-badge"><i class="fas fa-check-circle"></i> ${result.compressedSizeKB} KB (-${result.savingsPercent}%)</span>`;
      }

      showToast('Photo Updated', `Student picture updated & compressed to ${result.compressedSizeKB} KB.`, 'success');
      renderAdmissionsTable();
    } catch (err) {
      showToast('Upload Failed', err.message, 'error');
      if (badge) badge.innerHTML = '';
    }
  };

  // Drag & Drop Setup for all Image Dropzones
  document.addEventListener('dragover', (e) => {
    const widget = e.target.closest('.img-upload-widget');
    if (widget) {
      e.preventDefault();
      widget.classList.add('dragover');
    }
  });

  document.addEventListener('dragleave', (e) => {
    const widget = e.target.closest('.img-upload-widget');
    if (widget) {
      widget.classList.remove('dragover');
    }
  });

  document.addEventListener('drop', (e) => {
    const widget = e.target.closest('.img-upload-widget');
    if (widget) {
      e.preventDefault();
      widget.classList.remove('dragover');
      const fileInput = widget.querySelector('input[type="file"]') || widget.previousElementSibling;
      if (fileInput && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
      }
    }
  });

  // ============================================================
  // DATA DISPATCHER & REFRESH LOGIC
  // ============================================================
  function loadSectionData(sec) {
    switch (sec) {
      case 'dashboard': renderDashboard(); break;
      case 'settings': renderSettings(); break;
      case 'hero': renderHeroSlides(); renderPageHeaders(); break;
      case 'announcements': renderAnnouncementsTable(); break;
      case 'admissions': renderAdmissionsTable(); break;
      case 'academics': renderAcademics(); break;
      case 'staff': renderStaffList(); break;
      case 'events': renderEventsTable(); renderGallery(); break;
      case 'articles': renderArticlesTable(); break;
      case 'visitors': renderVisitorsList(); break;
      case 'partners': renderPartnersTable(); break;
      case 'messages': renderMessagesTable(); break;
      case 'users': renderUsersTable(); break;
      case 'logs': renderLogsTable(); break;
    }
    updateBadges();
  }

  function updateBadges() {
    const stats = DhoriaDB.getStats();
    const s = DhoriaDB.getSettings();
    
    const admBadge = document.getElementById('sidebarAdmissionsBadge');
    if (admBadge) {
      admBadge.textContent = stats.pendingAdmissions;
      admBadge.style.display = stats.pendingAdmissions > 0 ? 'inline-block' : 'none';
    }

    const msgBadge = document.getElementById('sidebarMessagesBadge');
    const topbarDot = document.getElementById('topbarNotifyDot');
    if (msgBadge) {
      msgBadge.textContent = stats.unreadMessages;
      msgBadge.style.display = stats.unreadMessages > 0 ? 'inline-block' : 'none';
    }
    if (topbarDot) {
      topbarDot.style.display = (stats.unreadMessages > 0 || stats.pendingAdmissions > 0) ? 'block' : 'none';
    }

    const topbarMaint = document.getElementById('topbarMaintBadge');
    if (topbarMaint) {
      topbarMaint.style.display = (s.maintenance && s.maintenance.globalEnabled) ? 'inline-flex' : 'none';
    }
  }

  // Auto-listen to DB events
  DhoriaDB.on('change', () => {
    const activeSection = document.querySelector('.sidebar-link.active')?.dataset.section || 'dashboard';
    loadSectionData(activeSection);
  });

  // ============================================================
  // SECTION 1: DASHBOARD
  // ============================================================
  function renderDashboard() {
    const stats = DhoriaDB.getStats();
    
    document.getElementById('dashTotalAdmissions').textContent = stats.totalAdmissions;
    document.getElementById('dashPendingAdmissionsSub').textContent = `${stats.pendingAdmissions} pending review`;
    document.getElementById('dashTotalMessages').textContent = stats.totalMessages;
    document.getElementById('dashUnreadMessagesSub').textContent = `${stats.unreadMessages} unread inquiries`;
    document.getElementById('dashTotalStaff').textContent = stats.totalStaff;
    document.getElementById('dashTotalArticles').textContent = stats.publishedArticles;
    document.getElementById('dashTotalEvents').textContent = stats.totalEvents;
    document.getElementById('dashTotalVisitors').textContent = stats.totalVisitors;

    // Recent Admissions
    const admissions = DhoriaDB.get('admissions') || [];
    const recentAdmissions = admissions.slice(0, 5);
    const admTbody = document.getElementById('dashRecentAdmissionsTbody');
    
    if (admTbody) {
      if (recentAdmissions.length === 0) {
        admTbody.innerHTML = '<tr><td colspan="4" class="table-empty-state">No admission applications found.</td></tr>';
      } else {
        admTbody.innerHTML = recentAdmissions.map(adm => {
          const imgSrc = adm.photoUrl ? (adm.photoUrl.startsWith('data:') || adm.photoUrl.startsWith('http') ? adm.photoUrl : '../' + adm.photoUrl) : '../assets/images/students.png';
          return `
            <tr>
              <td>
                <div class="table-user-cell">
                  <img src="${imgSrc}" alt="${escapeHtml(adm.studentName)}" class="table-avatar" onerror="this.src='../assets/images/students.png'">
                  <div>
                    <strong style="color:var(--adm-text); font-size:0.85rem;">${escapeHtml(adm.studentName)}</strong>
                    <div style="font-size:0.72rem; color:var(--adm-text-muted);">${adm.id}</div>
                  </div>
                </div>
              </td>
              <td>${escapeHtml(adm.className)} <span style="font-size:0.75rem; color:var(--adm-primary);">(${adm.shiftTiming})</span></td>
              <td><span class="status-pill status-${(adm.status || 'pending').toLowerCase().replace(/\s+/g, '')}">${adm.status}</span></td>
              <td>
                <button class="btn-action" onclick="inspectAdmission('${adm.id}')" title="Inspect Application"><i class="fas fa-eye"></i></button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Recent Messages
    const messages = DhoriaDB.get('messages') || [];
    const recentMessages = messages.slice(0, 5);
    const msgTbody = document.getElementById('dashRecentMessagesTbody');

    if (msgTbody) {
      if (recentMessages.length === 0) {
        msgTbody.innerHTML = '<tr><td colspan="4" class="table-empty-state">No messages received yet.</td></tr>';
      } else {
        msgTbody.innerHTML = recentMessages.map(msg => `
          <tr>
            <td>
              <strong>${escapeHtml(msg.senderName)}</strong>
              <div style="font-size:0.75rem; color:var(--adm-text-muted);">${msg.email || msg.phone}</div>
            </td>
            <td style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(msg.subject)}</td>
            <td><span class="status-pill status-${(msg.status || 'unread').toLowerCase()}">${msg.status}</span></td>
            <td>
              <button class="btn-action" onclick="viewMessage('${msg.id}')" title="View Message"><i class="fas fa-envelope-open-text"></i></button>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  window.toggleMaintLiveWarning = function() {
    const isGlobal = document.getElementById('setMaintGlobalEnabled')?.checked;
    const banner = document.getElementById('maintActiveAlertBanner');
    if (banner) banner.style.display = isGlobal ? 'flex' : 'none';
  };

  window.saveLockToggle = function(inputEl) {
    if (!inputEl) return;
    const current = DhoriaDB.getSettings();
    const m = current.maintenance || {
      globalEnabled: false,
      title: 'Scheduled Maintenance in Progress',
      message: 'Dhoria Academy Gwadar website is currently undergoing scheduled maintenance.',
      lockedPages: {},
      lockedSections: {}
    };

    if (!m.lockedPages) m.lockedPages = {};
    if (!m.lockedSections) m.lockedSections = {};

    const isChecked = !!inputEl.checked;
    const id = inputEl.id;
    let label = 'Setting';

    const updated = {
      ...current,
      maintenance: m
    };

    if (id === 'setMaintGlobalEnabled') {
      m.globalEnabled = isChecked;
      label = 'Global Maintenance Mode';
      toggleMaintLiveWarning();
    } else if (id === 'setEmergencyEnabled') {
      if (!updated.emergencyBanner) updated.emergencyBanner = {};
      updated.emergencyBanner.enabled = isChecked;
      label = 'Top Marquee Alert Banner';
    } else if (id === 'setAdmissionsOpen') {
      if (!updated.admissionSettings) updated.admissionSettings = {};
      updated.admissionSettings.admissionsOpen = isChecked;
      label = 'Online Admissions Acceptance';
    } else if (id.startsWith('lockPage')) {
      const key = id.replace('lockPage', '');
      const pageKey = key.charAt(0).toLowerCase() + key.slice(1);
      m.lockedPages[pageKey] = isChecked;
      label = pageKey.replace(/([A-Z])/g, ' $1') + ' Page';
    } else if (id.startsWith('lockSec')) {
      const key = id.replace('lockSec', '');
      const secKey = key.charAt(0).toLowerCase() + key.slice(1);
      m.lockedSections[secKey] = isChecked;
      label = secKey.replace(/([A-Z])/g, ' $1') + ' Section';
    }

    DhoriaDB.updateSettings(updated, currentUser ? currentUser.username : 'admin');

    if (id === 'setEmergencyEnabled' || id === 'setAdmissionsOpen') {
      if (isChecked) {
        showToast('Enabled', `${label} is now active.`, 'success');
      } else {
        showToast('Disabled', `${label} is now turned off.`, 'info');
      }
    } else {
      if (isChecked) {
        showToast('Locked', `${label} is now locked from public view.`, 'warning');
      } else {
        showToast('Unlocked', `${label} is now live and accessible.`, 'success');
      }
    }
  };

  // ============================================================
  // SECTION 2: SETTINGS
  // ============================================================
  function renderSettings() {
    const s = DhoriaDB.getSettings();
    const m = s.maintenance || {};
    const lockedP = m.lockedPages || {};
    const lockedS = m.lockedSections || {};

    // Maintenance UI
    const maintGlobalInput = document.getElementById('setMaintGlobalEnabled');
    if (maintGlobalInput) maintGlobalInput.checked = !!m.globalEnabled;
    const maintAlertBanner = document.getElementById('maintActiveAlertBanner');
    if (maintAlertBanner) maintAlertBanner.style.display = m.globalEnabled ? 'flex' : 'none';

    const setMaintTitle = document.getElementById('setMaintTitle');
    if (setMaintTitle) setMaintTitle.value = m.title || 'Scheduled Maintenance in Progress';
    const setMaintEstimatedTime = document.getElementById('setMaintEstimatedTime');
    if (setMaintEstimatedTime) setMaintEstimatedTime.value = m.estimatedTime || 'Estimated completion: Soon';
    const setMaintPhone = document.getElementById('setMaintPhone');
    if (setMaintPhone) setMaintPhone.value = m.contactPhone || s.primaryPhone || '0331 5396518';
    const setMaintEmail = document.getElementById('setMaintEmail');
    if (setMaintEmail) setMaintEmail.value = m.contactEmail || s.officialEmail || 'kabeer50930@gmail.com';
    const setMaintMessage = document.getElementById('setMaintMessage');
    if (setMaintMessage) setMaintMessage.value = m.message || 'Dhoria Academy Gwadar website is currently undergoing scheduled maintenance. We will be back online shortly.';

    // Granular Page Locks
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };
    setVal('lockPageAbout', lockedP.about);
    setVal('lockPageAcademics', lockedP.academics);
    setVal('lockPageAdmissions', lockedP.admissions);
    setVal('lockPageStaff', lockedP.staff);
    setVal('lockPageEvents', lockedP.events);
    setVal('lockPageVisitors', lockedP.visitors);
    setVal('lockPageStudentCorner', lockedP.studentCorner);
    setVal('lockPageStudentArticles', lockedP.studentArticles);
    setVal('lockPageContact', lockedP.contact);

    // Homepage Section Locks
    setVal('lockSecHeroSlider', lockedS.heroSlider);
    setVal('lockSecAnnouncements', lockedS.announcements);
    setVal('lockSecPartners', lockedS.partners);

    // Identity & Contact
    document.getElementById('setSiteName').value = s.siteName || '';
    document.getElementById('setEstablishedYear').value = s.establishedYear || '';
    document.getElementById('setSiteTagline').value = s.siteTagline || '';
    document.getElementById('setPrincipalName').value = s.principalName || '';
    document.getElementById('setPrincipalTitle').value = s.principalTitle || '';
    document.getElementById('setPrincipalMessage').value = s.principalMessage || '';

    // Emergency Bar
    const eb = s.emergencyBanner || {};
    document.getElementById('setEmergencyEnabled').checked = !!eb.enabled;
    document.getElementById('setEmergencyBadge').value = eb.badge || '';
    document.getElementById('setEmergencyText').value = eb.text || '';
    document.getElementById('setEmergencyLink').value = eb.link || '';

    // Contact
    document.getElementById('setPrimaryPhone').value = s.primaryPhone || '';
    document.getElementById('setSecondaryPhone').value = s.secondaryPhone || '';
    document.getElementById('setOfficialEmail').value = s.officialEmail || '';
    document.getElementById('setAddress').value = s.address || '';
    document.getElementById('setWorkingHours').value = s.workingHours || '';

    // Admission portal settings
    const adm = s.admissionSettings || {};
    document.getElementById('setAdmissionsOpen').checked = adm.admissionsOpen !== false;
    document.getElementById('setAdmissionSession').value = adm.currentSession || '';
    document.getElementById('setAdmissionDeadline').value = adm.applicationDeadline || '';
    document.getElementById('setAdmissionFeePolicy').value = adm.feePolicy || '';

    // Social & SEO
    const soc = s.socialLinks || {};
    document.getElementById('setSocialWhatsapp').value = soc.whatsapp || '';
    document.getElementById('setSocialFacebook').value = soc.facebook || '';
    document.getElementById('setSocialInstagram').value = soc.instagram || '';
    document.getElementById('setSocialYoutube').value = soc.youtube || '';

    const seo = s.seo || {};
    document.getElementById('setSeoKeywords').value = seo.keywords || '';
    document.getElementById('setSeoDescription').value = seo.metaDescription || '';

    // Logo upload widget sync
    const logoUrl = s.siteLogoUrl || 'assets/images/logo.png?v=3';
    const setLogoEl = document.getElementById('setLogoUrl');
    if (setLogoEl) setLogoEl.value = logoUrl;
    const logoPreviewEl = document.getElementById('logoPreview');
    if (logoPreviewEl) {
      logoPreviewEl.src = logoUrl.startsWith('data:') || logoUrl.startsWith('http') ? logoUrl : '../' + logoUrl;
    }
    const logoBadge = document.getElementById('logoCompressionBadge');
    if (logoBadge) logoBadge.innerHTML = '';
  }

  window.saveGeneralSettings = function() {
    const current = DhoriaDB.getSettings();
    const isMaintGlobal = document.getElementById('setMaintGlobalEnabled')?.checked || false;

    const getVal = (id) => document.getElementById(id)?.value.trim() || '';
    const getChk = (id) => !!document.getElementById(id)?.checked;

    const updated = {
      ...current,
      maintenance: {
        globalEnabled: isMaintGlobal,
        title: getVal('setMaintTitle') || 'Scheduled Maintenance in Progress',
        message: getVal('setMaintMessage') || 'Dhoria Academy Gwadar website is currently undergoing scheduled maintenance.',
        estimatedTime: getVal('setMaintEstimatedTime') || 'Estimated completion: Soon',
        contactPhone: getVal('setMaintPhone') || current.primaryPhone || '0331 5396518',
        contactEmail: getVal('setMaintEmail') || current.officialEmail || 'kabeer50930@gmail.com',
        lockedPages: {
          about: getChk('lockPageAbout'),
          academics: getChk('lockPageAcademics'),
          admissions: getChk('lockPageAdmissions'),
          staff: getChk('lockPageStaff'),
          events: getChk('lockPageEvents'),
          visitors: getChk('lockPageVisitors'),
          studentCorner: getChk('lockPageStudentCorner'),
          studentArticles: getChk('lockPageStudentArticles'),
          contact: getChk('lockPageContact')
        },
        lockedSections: {
          heroSlider: getChk('lockSecHeroSlider'),
          announcements: getChk('lockSecAnnouncements'),
          partners: getChk('lockSecPartners')
        }
      },
      siteName: getVal('setSiteName'),
      establishedYear: getVal('setEstablishedYear'),
      siteTagline: getVal('setSiteTagline'),
      principalName: getVal('setPrincipalName'),
      principalTitle: getVal('setPrincipalTitle'),
      principalMessage: getVal('setPrincipalMessage'),
      primaryPhone: getVal('setPrimaryPhone'),
      secondaryPhone: getVal('setSecondaryPhone'),
      officialEmail: getVal('setOfficialEmail'),
      address: getVal('setAddress'),
      workingHours: getVal('setWorkingHours'),
      emergencyBanner: {
        enabled: getChk('setEmergencyEnabled'),
        badge: getVal('setEmergencyBadge'),
        text: getVal('setEmergencyText'),
        link: getVal('setEmergencyLink'),
        linkText: 'Learn More'
      },
      admissionSettings: {
        ...current.admissionSettings,
        admissionsOpen: getChk('setAdmissionsOpen'),
        currentSession: getVal('setAdmissionSession'),
        applicationDeadline: document.getElementById('setAdmissionDeadline')?.value || '',
        feePolicy: getVal('setAdmissionFeePolicy')
      },
      socialLinks: {
        whatsapp: getVal('setSocialWhatsapp'),
        facebook: getVal('setSocialFacebook'),
        instagram: getVal('setSocialInstagram'),
        youtube: getVal('setSocialYoutube')
      },
      seo: {
        ...current.seo,
        keywords: getVal('setSeoKeywords'),
        metaDescription: getVal('setSeoDescription')
      },
      siteLogoUrl: getVal('setLogoUrl') || current.siteLogoUrl || 'assets/images/logo.png?v=3'
    };

    DhoriaDB.updateSettings(updated, currentUser.username);
    updateBadges();

    if (isMaintGlobal) {
      showToast('Maintenance Mode Activated', 'Public website is now displaying the maintenance screen to all visitors.', 'warning');
    } else {
      showToast('Settings Saved', 'Global website and access control settings have been updated successfully.', 'success');
    }
  };

  // ============================================================
  // SECTION 3: HERO & BANNERS
  // ============================================================
  function renderHeroSlides() {
    const slides = DhoriaDB.get('heroSlides') || [];
    const container = document.getElementById('heroSlidesGrid');
    if (!container) return;

    if (slides.length === 0) {
      container.innerHTML = '<div class="table-empty-state">No hero slides defined. Click "Add New Slide" to create one.</div>';
      return;
    }

    container.innerHTML = slides.map((sl, idx) => `
      <div class="item-card">
        <div class="item-card-top">
          <span class="status-pill ${sl.active !== false ? 'status-active' : 'status-inactive'}">
            ${sl.active !== false ? 'Active' : 'Inactive'}
          </span>
          <span style="font-size:0.75rem; color:var(--adm-text-muted); font-weight:700;">Slide #${idx + 1}</span>
        </div>
        <img src="${resolveAdminImg(sl.imageUrl, 'assets/images/hero.png')}" alt="Slide" style="width:100%; height:130px; object-fit:cover; border-radius:var(--adm-radius-md);" onerror="this.src='../assets/images/hero.png'">
        <div class="item-card-title">${escapeHtml(sl.badge || 'Slide')}</div>
        <div class="item-card-subtitle" style="font-size:0.8rem;">${sl.title}</div>
        <div class="item-card-desc">${escapeHtml(sl.description)}</div>
        <div class="item-card-footer">
          <div class="table-actions">
            <button class="btn-action" onclick="editHeroSlide('${sl.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-action btn-action-delete" onclick="deleteHeroSlide('${sl.id}')" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="toggleHeroSlideActive('${sl.id}')">
            ${sl.active !== false ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    `).join('');
  }

  function renderPageHeaders() {
    const headers = DhoriaDB.getPageHeaders();
    const container = document.getElementById('pageHeadersContainer');
    if (!container) return;

    const pages = [
      { key: 'about', label: 'About Us' },
      { key: 'academics', label: 'Academics & Shifts' },
      { key: 'admissions', label: 'Admissions' },
      { key: 'staff', label: 'Staff Directory' },
      { key: 'events', label: 'Events & Gallery' },
      { key: 'visitors', label: 'VIP Visitors' },
      { key: 'studentCorner', label: 'Student Corner' },
      { key: 'studentArticles', label: 'Student Articles' },
      { key: 'contact', label: 'Contact Us' }
    ];

    container.innerHTML = pages.map(p => {
      const data = headers[p.key] || {};
      return `
        <div style="background:var(--adm-surface-2); padding:0.85rem 1rem; border-radius:var(--adm-radius-md); border:1px solid var(--adm-border);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <strong style="color:var(--adm-text); font-size:0.88rem;"><i class="fas fa-heading" style="color:var(--adm-primary); font-size:0.8rem;"></i> ${p.label}</strong>
            <button class="btn btn-primary btn-sm" onclick="savePageHeader('${p.key}')" style="padding:0.25rem 0.6rem; font-size:0.75rem;"><i class="fas fa-save"></i> Save</button>
          </div>
          <div class="form-group" style="margin-bottom:0.4rem;">
            <label class="form-label" style="font-size:0.75rem;">Header Title</label>
            <input type="text" class="form-input" id="hdr_title_${p.key}" value="${escapeHtml(data.title || '')}" style="padding:0.4rem 0.65rem; font-size:0.82rem;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:0.75rem;">Subtitle</label>
            <input type="text" class="form-input" id="hdr_sub_${p.key}" value="${escapeHtml(data.subtitle || '')}" style="padding:0.4rem 0.65rem; font-size:0.82rem;">
          </div>
        </div>
      `;
    }).join('');
  }

  window.savePageHeader = function(pageKey) {
    const title = document.getElementById(`hdr_title_${pageKey}`).value.trim();
    const subtitle = document.getElementById(`hdr_sub_${pageKey}`).value.trim();
    DhoriaDB.updatePageHeader(pageKey, { title, subtitle }, currentUser.username);
    showToast('Header Updated', `Page header for ${pageKey} updated.`);
  };

  window.editHeroSlide = function(id) {
    const sl = DhoriaDB.getById('heroSlides', id);
    if (!sl) return;
    document.getElementById('heroFormId').value = sl.id;
    document.getElementById('heroFormBadge').value = sl.badge || '';
    document.getElementById('heroFormTitle').value = sl.title || '';
    document.getElementById('heroFormDesc').value = sl.description || '';
    document.getElementById('heroFormImage').value = sl.imageUrl || 'assets/images/hero.png';
    document.getElementById('heroFormBtn1Text').value = sl.primaryBtnText || '';
    document.getElementById('heroFormBtn1Link').value = sl.primaryBtnLink || '';
    document.getElementById('heroFormBtn2Text').value = sl.secondaryBtnText || '';
    document.getElementById('heroFormBtn2Link').value = sl.secondaryBtnLink || '';
    // Sync photo preview
    const heroPreview = document.getElementById('heroPhotoPreview');
    if (heroPreview) {
      const iUrl = sl.imageUrl || 'assets/images/hero.png';
      heroPreview.src = iUrl.startsWith('data:') || iUrl.startsWith('http') ? iUrl : '../' + iUrl;
    }
    const heroBadge = document.getElementById('heroCompressionBadge');
    if (heroBadge) heroBadge.innerHTML = '';
    document.getElementById('heroModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Hero Slide';
    openModal('addHeroSlideModal');
  };

  window.submitHeroSlideForm = function() {
    const id = document.getElementById('heroFormId').value;
    const slideData = {
      badge: document.getElementById('heroFormBadge').value.trim(),
      title: document.getElementById('heroFormTitle').value.trim(),
      description: document.getElementById('heroFormDesc').value.trim(),
      imageUrl: document.getElementById('heroFormImage').value.trim(),
      primaryBtnText: document.getElementById('heroFormBtn1Text').value.trim(),
      primaryBtnLink: document.getElementById('heroFormBtn1Link').value.trim(),
      secondaryBtnText: document.getElementById('heroFormBtn2Text').value.trim(),
      secondaryBtnLink: document.getElementById('heroFormBtn2Link').value.trim(),
      active: true
    };

    if (id) {
      DhoriaDB.update('heroSlides', id, slideData, currentUser.username);
      showToast('Slide Updated', 'Hero slide updated successfully.');
    } else {
      slideData.order = (DhoriaDB.get('heroSlides') || []).length + 1;
      DhoriaDB.create('heroSlides', slideData, currentUser.username);
      showToast('Slide Created', 'New hero slide added.');
    }
    localStorage.setItem('dhoria_hero_slides_custom', '1');
    closeModal('addHeroSlideModal');
    renderHeroSlides();
  };

  window.toggleHeroSlideActive = function(id) {
    const sl = DhoriaDB.getById('heroSlides', id);
    if (sl) {
      DhoriaDB.update('heroSlides', id, { active: sl.active === false }, currentUser.username);
      localStorage.setItem('dhoria_hero_slides_custom', '1');
      renderHeroSlides();
    }
  };

  window.deleteHeroSlide = function(id) {
    if (confirm('Delete this slide from the homepage carousel?')) {
      DhoriaDB.delete('heroSlides', id, currentUser.username);
      localStorage.setItem('dhoria_hero_slides_custom', '1');
      showToast('Slide Deleted', 'Hero slide removed.');
      renderHeroSlides();
    }
  };

  // ============================================================
  // SECTION 4: ANNOUNCEMENTS
  // ============================================================
  window.renderAnnouncementsTable = function() {
    const list = DhoriaDB.get('announcements') || [];
    const search = (document.getElementById('searchAnnouncementsInput')?.value || '').toLowerCase();
    const cat = document.getElementById('filterAnnouncementsCat')?.value || 'all';

    const filtered = list.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(search) || item.excerpt.toLowerCase().includes(search);
      const matchCat = cat === 'all' || item.category === cat;
      return matchSearch && matchCat;
    });

    const tbody = document.getElementById('announcementsTbody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="table-empty-state">No announcements matching criteria.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(a => `
      <tr>
        <td style="max-width:320px;">
          <strong>${escapeHtml(a.title)}</strong>
          <div style="font-size:0.8rem; color:var(--adm-text-muted); margin-top:2px;">${escapeHtml(a.excerpt)}</div>
        </td>
        <td>${a.date || 'N/A'}</td>
        <td><span class="status-pill status-unread">${a.category}</span></td>
        <td>${a.pinned ? '<i class="fas fa-thumbtack" style="color:var(--adm-primary);"></i> Yes' : 'No'}</td>
        <td><span class="status-pill ${a.active !== false ? 'status-active' : 'status-inactive'}">${a.active !== false ? 'Active' : 'Draft'}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-action" onclick="editAnnouncement('${a.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-action btn-action-delete" onclick="deleteAnnouncement('${a.id}')" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  };

  window.editAnnouncement = function(id) {
    const a = DhoriaDB.getById('announcements', id);
    if (!a) return;
    document.getElementById('annFormId').value = a.id;
    document.getElementById('annFormTitle').value = a.title || '';
    document.getElementById('annFormCategory').value = a.category || 'General';
    document.getElementById('annFormDate').value = a.date || '';
    document.getElementById('annFormExcerpt').value = a.excerpt || '';
    document.getElementById('annFormLinkUrl').value = a.linkUrl || '';
    document.getElementById('annFormLinkText').value = a.linkText || '';
    document.getElementById('annFormPinned').checked = !!a.pinned;
    document.getElementById('announcementModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Announcement';
    openModal('addAnnouncementModal');
  };

  window.submitAnnouncementForm = function() {
    const id = document.getElementById('annFormId').value;
    const annData = {
      title: document.getElementById('annFormTitle').value.trim(),
      category: document.getElementById('annFormCategory').value,
      date: document.getElementById('annFormDate').value,
      excerpt: document.getElementById('annFormExcerpt').value.trim(),
      linkUrl: document.getElementById('annFormLinkUrl').value.trim(),
      linkText: document.getElementById('annFormLinkText').value.trim(),
      pinned: document.getElementById('annFormPinned').checked,
      active: true
    };

    if (id) {
      DhoriaDB.update('announcements', id, annData, currentUser.username);
      showToast('Announcement Updated', 'Announcement was successfully updated.');
    } else {
      DhoriaDB.create('announcements', annData, currentUser.username);
      showToast('Announcement Created', 'New announcement published.');
    }
    closeModal('addAnnouncementModal');
    renderAnnouncementsTable();
  };

  window.deleteAnnouncement = function(id) {
    if (confirm('Delete this announcement?')) {
      DhoriaDB.delete('announcements', id, currentUser.username);
      showToast('Deleted', 'Announcement removed.');
      renderAnnouncementsTable();
    }
  };

  // ============================================================
  // SECTION 5: ADMISSIONS & DOSSIER INSPECTOR
  // ============================================================
  window.renderAdmissionsTable = function() {
    const list = DhoriaDB.get('admissions') || [];
    const search = (document.getElementById('searchAdmissionsInput')?.value || '').toLowerCase();
    const status = document.getElementById('filterAdmissionStatus')?.value || 'all';
    const shift = document.getElementById('filterAdmissionShift')?.value || 'all';

    const filtered = list.filter(item => {
      const q = `${item.id} ${item.studentName} ${item.fatherName} ${item.bform} ${item.mobile}`.toLowerCase();
      const matchSearch = q.includes(search);
      const matchStatus = status === 'all' || item.status === status;
      const matchShift = shift === 'all' || item.shiftTiming === shift;
      return matchSearch && matchStatus && matchShift;
    });

    const tbody = document.getElementById('admissionsTbody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="table-empty-state">No student admission records found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(adm => {
      const imgSrc = resolveAdminImg(adm.photoUrl, 'assets/images/students.png');
      return `
        <tr>
          <td>
            <div class="table-user-cell">
              <img src="${imgSrc}" alt="${escapeHtml(adm.studentName)}" class="table-avatar" onerror="this.src='../assets/images/students.png'">
              <div>
                <strong style="color:var(--adm-text); font-size:0.88rem;">${escapeHtml(adm.studentName)}</strong>
                <div style="font-size:0.72rem; color:var(--adm-text-muted); font-family:var(--adm-font-mono, monospace); font-weight:600;">${adm.id}</div>
              </div>
            </div>
          </td>
          <td>${escapeHtml(adm.fatherName)}</td>
          <td><span style="font-weight:600;">${escapeHtml(adm.className)}</span></td>
          <td><span class="status-pill ${adm.shiftTiming === 'Morning' ? 'status-unread' : 'status-replied'}">${adm.shiftTiming}</span></td>
          <td>${escapeHtml(adm.mobile)}</td>
          <td>${adm.submissionDate || 'N/A'}</td>
          <td><span class="status-pill status-${(adm.status || 'pending').toLowerCase().replace(/\s+/g, '')}">${adm.status}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn-action" onclick="inspectAdmission('${adm.id}')" title="Inspect Full Dossier"><i class="fas fa-eye"></i></button>
              <button class="btn-action btn-action-delete" onclick="deleteAdmission('${adm.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  };

  let activeInspectedAdmissionId = null;

  window.inspectAdmission = function(id) {
    const adm = DhoriaDB.getById('admissions', id);
    if (!adm) return;
    activeInspectedAdmissionId = id;

    const studentPhoto = resolveAdminImg(adm.photoUrl, 'assets/images/students.png');
    const body = document.getElementById('dossierModalBody');
    body.innerHTML = `
      <div class="student-dossier-grid">
        <div class="student-photo-box">
          <img src="${studentPhoto}" alt="Student Photo" id="dossierStudentPhotoImg" onerror="this.src='../assets/images/students.png'" style="width:120px; height:140px; object-fit:cover; border-radius:var(--adm-radius-md); border:2px solid var(--adm-border);">
          <div style="margin-top:0.75rem; font-weight:700; color:var(--adm-primary);">${adm.id}</div>
          <div style="font-size:0.78rem; color:var(--adm-text-muted);">Applied: ${adm.submissionDate}</div>
          <div style="margin-top:0.75rem;">
            <input type="file" id="dossierReplacePhotoInput" accept="image/*" style="display:none;" onchange="replaceStudentPhoto('${adm.id}', this)">
            <button class="btn btn-secondary btn-sm" style="width:100%; margin-bottom:0.4rem;" onclick="document.getElementById('dossierReplacePhotoInput').click()"><i class="fas fa-camera"></i> Replace Photo</button>
            <div id="dossierCompressionBadge" style="margin-top:4px;"></div>
          </div>
        </div>

        <div>
          <h3 style="font-size:1.3rem; margin-bottom:0.75rem; color:var(--adm-text);">${escapeHtml(adm.studentName)}</h3>

          <div class="dossier-field-row">
            <div class="dossier-field-label">Father Name:</div>
            <div class="dossier-field-val">${escapeHtml(adm.fatherName)}</div>
          </div>
          <div class="dossier-field-row">
            <div class="dossier-field-label">Date of Birth:</div>
            <div class="dossier-field-val">${adm.dob}</div>
          </div>
          <div class="dossier-field-row">
            <div class="dossier-field-label">B-Form / CNIC:</div>
            <div class="dossier-field-val">${escapeHtml(adm.bform)}</div>
          </div>
          <div class="dossier-field-row">
            <div class="dossier-field-label">Applied Class:</div>
            <div class="dossier-field-val" style="color:var(--adm-primary);">${escapeHtml(adm.className)}</div>
          </div>
          <div class="dossier-field-row">
            <div class="dossier-field-label">Shift Timing:</div>
            <div class="dossier-field-val">${adm.shiftTiming}</div>
          </div>
          <div class="dossier-field-row">
            <div class="dossier-field-label">Mobile Number:</div>
            <div class="dossier-field-val"><a href="tel:${adm.mobile}">${escapeHtml(adm.mobile)}</a></div>
          </div>
          <div class="dossier-field-row">
            <div class="dossier-field-label">Guardian Mobile:</div>
            <div class="dossier-field-val">${escapeHtml(adm.guardianMobile || 'N/A')}</div>
          </div>
          <div class="dossier-field-row">
            <div class="dossier-field-label">Address:</div>
            <div class="dossier-field-val">${escapeHtml(adm.address)}</div>
          </div>
          <div class="dossier-field-row">
            <div class="dossier-field-label">Qualifications:</div>
            <div class="dossier-field-val">${escapeHtml(adm.qualification || 'N/A')}</div>
          </div>

          <div style="margin-top:1.25rem; background:var(--adm-surface-2); padding:1rem; border-radius:var(--adm-radius-md);">
            <div class="form-group">
              <label class="form-label">Update Application Decision</label>
              <select class="form-select" id="dossierStatusSelect">
                <option value="Pending" ${adm.status === 'Pending' ? 'selected' : ''}>Pending Review</option>
                <option value="Under Review" ${adm.status === 'Under Review' ? 'selected' : ''}>Under Review / Documents Requested</option>
                <option value="Approved" ${adm.status === 'Approved' ? 'selected' : ''}>Approved / Admitted</option>
                <option value="Rejected" ${adm.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Administrative Notes & Remarks</label>
              <textarea class="form-textarea" id="dossierNotesInput" rows="2">${escapeHtml(adm.notes || '')}</textarea>
            </div>
          </div>
        </div>
      </div>
    `;

    openModal('dossierModal');
  };

  window.saveDossierStatus = function() {
    if (!activeInspectedAdmissionId) return;
    const newStatus = document.getElementById('dossierStatusSelect').value;
    const newNotes = document.getElementById('dossierNotesInput').value.trim();

    DhoriaDB.update('admissions', activeInspectedAdmissionId, {
      status: newStatus,
      notes: newNotes
    }, currentUser.username);

    showToast('Status Updated', `Admission ${activeInspectedAdmissionId} marked as ${newStatus}.`);
    closeModal('dossierModal');
    renderAdmissionsTable();
    updateBadges();
  };

  window.printDossier = function() {
    window.print();
  };

  window.submitManualAdmission = function() {
    const photoVal = document.getElementById('manAdmPhoto')?.value.trim() || 'assets/images/students.png';
    const studentData = {
      studentName: document.getElementById('manAdmName').value.trim(),
      fatherName: document.getElementById('manAdmFather').value.trim(),
      dob: document.getElementById('manAdmDob').value,
      bform: document.getElementById('manAdmBform').value.trim(),
      className: document.getElementById('manAdmClass').value,
      shiftTiming: document.getElementById('manAdmShift').value,
      mobile: document.getElementById('manAdmMobile').value.trim(),
      guardianMobile: document.getElementById('manAdmGuardian').value.trim(),
      address: document.getElementById('manAdmAddress').value.trim(),
      qualification: document.getElementById('manAdmQual').value.trim(),
      photoUrl: photoVal,
      status: 'Approved',
      notes: `Walk-in admission entered by admin (${currentUser.username})`
    };

    const record = DhoriaDB.addAdmission(studentData);
    showToast('Student Admitted', `Application ${record.id} registered for ${record.studentName}.`);
    closeModal('addAdmissionModal');
    document.getElementById('manualAdmissionForm').reset();
    // Reset photo preview back to default
    resetImageField('manAdmPhoto', 'admPhotoPreview', 'admCompressionBadge', 'assets/images/students.png');
    renderAdmissionsTable();
    updateBadges();
  };

  window.deleteAdmission = function(id) {
    if (confirm(`Are you sure you want to permanently delete admission application ${id}?`)) {
      DhoriaDB.delete('admissions', id, currentUser.username);
      showToast('Deleted', `Admission ${id} was removed.`);
      renderAdmissionsTable();
      updateBadges();
    }
  };

  window.exportAdmissionsCSV = function() {
    const list = DhoriaDB.get('admissions') || [];
    if (list.length === 0) return alert('No admissions to export.');

    const headers = ['ID', 'Student Name', 'Father Name', 'DOB', 'Class', 'Shift', 'BForm/CNIC', 'Mobile', 'Guardian Mobile', 'Address', 'Status', 'Date'];
    const rows = list.map(a => [
      a.id,
      `"${a.studentName}"`,
      `"${a.fatherName}"`,
      a.dob,
      `"${a.className}"`,
      a.shiftTiming,
      `"${a.bform}"`,
      `"${a.mobile}"`,
      `"${a.guardianMobile || ''}"`,
      `"${(a.address || '').replace(/"/g, '""')}"`,
      a.status,
      a.submissionDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dhoria_admissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // ============================================================
  // SECTION 6: ACADEMICS & SHIFTS TIMETABLE
  // ============================================================
  function renderAcademics() {
    // Shifts matching Academics Page Daily Schedule Table
    const shifts = DhoriaDB.get('shifts') || [];
    const shiftsContainer = document.getElementById('shiftsContainer');
    if (shiftsContainer) {
      shiftsContainer.innerHTML = shifts.map(sh => `
        <div style="background:var(--adm-surface-2); border:1px solid var(--adm-border); border-radius:var(--adm-radius-md); padding:0.9rem 1rem; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="color:var(--adm-primary); font-size:0.92rem;">${escapeHtml(sh.group || sh.name)}</strong>
              <span class="status-pill status-active">${escapeHtml(sh.timing || sh.timings || '')}</span>
            </div>
            ${sh.subTiming ? `<div style="font-size:0.75rem; color:var(--adm-text-muted); margin-top:2px;">${escapeHtml(sh.subTiming)}</div>` : ''}
            <p style="font-size:0.82rem; color:var(--adm-text); margin:0.4rem 0 0.6rem;">${escapeHtml(sh.classes || sh.description || '')}</p>
          </div>
          <div style="display:flex; justify-content:flex-end; border-top:1px solid var(--adm-border); padding-top:0.4rem;">
            <button class="btn btn-secondary btn-sm" onclick="editShift('${sh.id}')"><i class="fas fa-edit"></i> Edit</button>
          </div>
        </div>
      `).join('');
    }

    // Courses
    const courses = DhoriaDB.get('courses') || [];
    const coursesTbody = document.getElementById('coursesTbody');
    if (coursesTbody) {
      if (courses.length === 0) {
        coursesTbody.innerHTML = '<tr><td colspan="7" class="table-empty-state">No courses added yet.</td></tr>';
        return;
      }
      coursesTbody.innerHTML = courses.map(c => `
        <tr>
          <td><strong>${escapeHtml(c.title)}</strong></td>
          <td><span class="status-pill status-unread">${c.category}</span></td>
          <td>${c.shift}</td>
          <td>${c.duration || 'N/A'}</td>
          <td>${escapeHtml(c.instructor || 'Academy Faculty')}</td>
          <td><span class="status-pill ${c.enrollmentStatus === 'Open' ? 'status-active' : 'status-inactive'}">${c.enrollmentStatus}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn-action" onclick="editCourse('${c.id}')" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="btn-action btn-action-delete" onclick="deleteCourse('${c.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  window.editShift = function(id) {
    const sh = DhoriaDB.getById('shifts', id);
    if (!sh) return;
    document.getElementById('shiftFormId').value = sh.id;
    document.getElementById('shiftFormGroup').value = sh.group || sh.name || '';
    document.getElementById('shiftFormTiming').value = sh.timing || sh.timings || '';
    document.getElementById('shiftFormSubTiming').value = sh.subTiming || '';
    document.getElementById('shiftFormClasses').value = sh.classes || sh.description || '';
    openModal('editShiftModal');
  };

  window.submitShiftForm = function() {
    const id = document.getElementById('shiftFormId').value;
    const shiftData = {
      group: document.getElementById('shiftFormGroup').value.trim(),
      timing: document.getElementById('shiftFormTiming').value.trim(),
      subTiming: document.getElementById('shiftFormSubTiming').value.trim(),
      classes: document.getElementById('shiftFormClasses').value.trim()
    };

    if (id) {
      DhoriaDB.update('shifts', id, shiftData, currentUser.username);
      showToast('Timetable Updated', 'Academic schedule updated.');
    }
    closeModal('editShiftModal');
    renderAcademics();
  };

  window.submitPartnerForm = function() {
    const id = document.getElementById('partnerFormId').value;
    const partnerData = {
      name: document.getElementById('partnerFormName').value.trim(),
      iconClass: document.getElementById('partnerFormIcon').value.trim() || 'fas fa-university',
      link: document.getElementById('partnerFormLink').value.trim() || '#',
      active: true
    };

    if (id) {
      DhoriaDB.update('partners', id, partnerData, currentUser.username);
      showToast('Partner Updated', 'Partner info saved.');
    } else {
      DhoriaDB.create('partners', partnerData, currentUser.username);
      showToast('Partner Added', 'New partner added.');
    }
    closeModal('addPartnerModal');
    renderPartnersTable();
  };

  window.editUser = function(id) {
    const u = DhoriaDB.getById('users', id);
    if (!u) return;
    document.getElementById('userFormId').value = u.id;
    document.getElementById('userFormUsername').value = u.username || '';
    document.getElementById('userFormPassword').value = u.password || '';
    document.getElementById('userFormFullName').value = u.fullName || '';
    document.getElementById('userFormRole').value = u.role || 'Super Admin';
    document.getElementById('userFormEmail').value = u.email || '';
    document.getElementById('userFormAvatar').value = u.avatar || 'assets/images/logo.png';
    const preview = document.getElementById('userAvatarPreview');
    if (preview) {
      const aUrl = u.avatar || 'assets/images/logo.png';
      preview.src = aUrl.startsWith('data:') || aUrl.startsWith('http') ? aUrl : '../' + aUrl;
    }
    const badge = document.getElementById('userCompressionBadge');
    if (badge) badge.innerHTML = '';
    document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-user-edit"></i> Edit Administrator Account';
    openModal('addUserModal');
  };

  window.submitUserForm = function() {
    const id = document.getElementById('userFormId').value;
    const userData = {
      username: document.getElementById('userFormUsername').value.trim(),
      password: document.getElementById('userFormPassword').value.trim(),
      fullName: document.getElementById('userFormFullName').value.trim(),
      role: document.getElementById('userFormRole').value,
      email: document.getElementById('userFormEmail').value.trim(),
      avatar: document.getElementById('userFormAvatar')?.value.trim() || 'assets/images/logo.png',
      status: 'Active'
    };

    if (id) {
      DhoriaDB.update('users', id, userData, currentUser.username);
      showToast('User Updated', 'User account updated.');
      if (currentUser && currentUser.username === userData.username) {
        currentUser = { ...currentUser, ...userData };
        try {
          localStorage.setItem('dhoria_admin_user', JSON.stringify(currentUser));
        } catch (e) {}
        const sbName = document.getElementById('sidebarUserName');
        if (sbName) sbName.textContent = currentUser.fullName || currentUser.username;
      }
    } else {
      DhoriaDB.create('users', userData, currentUser.username);
      showToast('User Created', 'New administrator account created.');
    }
    closeModal('addUserModal');
    renderUsersTable();
  };

  window.editCourse = function(id) {
    const c = DhoriaDB.getById('courses', id);
    if (!c) return;
    document.getElementById('crsFormId').value = c.id;
    document.getElementById('crsFormTitle').value = c.title || '';
    document.getElementById('crsFormCat').value = c.category || 'Academic';
    document.getElementById('crsFormShift').value = c.shift || 'Evening';
    document.getElementById('crsFormDuration').value = c.duration || '';
    document.getElementById('crsFormInstructor').value = c.instructor || '';
    document.getElementById('crsFormDesc').value = c.description || '';
    document.getElementById('courseModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Course';
    openModal('addCourseModal');
  };

  window.submitCourseForm = function() {
    const id = document.getElementById('crsFormId').value;
    const courseData = {
      title: document.getElementById('crsFormTitle').value.trim(),
      category: document.getElementById('crsFormCat').value,
      shift: document.getElementById('crsFormShift').value,
      duration: document.getElementById('crsFormDuration').value.trim(),
      instructor: document.getElementById('crsFormInstructor').value.trim(),
      description: document.getElementById('crsFormDesc').value.trim(),
      fee: '100% Free',
      enrollmentStatus: 'Open',
      featured: true
    };

    if (id) {
      DhoriaDB.update('courses', id, courseData, currentUser.username);
      showToast('Course Updated', 'Course curriculum updated.');
    } else {
      DhoriaDB.create('courses', courseData, currentUser.username);
      showToast('Course Added', 'New educational course registered.');
    }
    closeModal('addCourseModal');
    renderAcademics();
  };

  window.deleteCourse = function(id) {
    if (confirm('Delete this course from curriculum?')) {
      DhoriaDB.delete('courses', id, currentUser.username);
      showToast('Deleted', 'Course removed.');
      renderAcademics();
    }
  };

  // ============================================================
  // SECTION 7: STAFF DIRECTORY
  // ============================================================
  window.renderStaffList = function() {
    const staff = DhoriaDB.get('staff') || [];
    const search = (document.getElementById('searchStaffInput')?.value || '').toLowerCase();
    const cat = document.getElementById('filterStaffCat')?.value || 'all';

    const filtered = staff.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search) || (s.role || '').toLowerCase().includes(search);
      const matchCat = cat === 'all' || s.category === cat;
      return matchSearch && matchCat;
    });

    const grid = document.getElementById('staffCardsGrid');
    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="table-empty-state">No faculty members found.</div>';
      return;
    }

    grid.innerHTML = filtered.map(s => `
      <div class="item-card">
        <div class="item-card-top">
          <span class="status-pill status-active">${s.category || 'Faculty'}</span>
          <span style="font-size:0.75rem; color:var(--adm-text-muted);">#${s.order || 1}</span>
        </div>
        <div style="display:flex; align-items:center; gap:1rem;">
          <img src="${resolveAdminImg(s.photoUrl, 'assets/images/logo.png')}" alt="${escapeHtml(s.name)}" class="item-card-img" onerror="this.src='../assets/images/logo.png'">
          <div>
            <div class="item-card-title">${escapeHtml(s.name)}</div>
            <div class="item-card-subtitle">${escapeHtml(s.role)}</div>
          </div>
        </div>
        <div style="font-size:0.8rem; color:var(--adm-text-light);"><strong>Qual:</strong> ${escapeHtml(s.qualification || 'Educator')}</div>
        <div class="item-card-desc">${escapeHtml(s.bio || '')}</div>
        <div class="item-card-footer">
          <div style="font-size:0.78rem; color:var(--adm-text-muted);"><i class="fas fa-phone"></i> ${s.phone || 'N/A'}</div>
          <div class="table-actions">
            <button class="btn-action" onclick="editStaff('${s.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-action btn-action-delete" onclick="deleteStaff('${s.id}')" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    `).join('');
  };

  window.editStaff = function(id) {
    const s = DhoriaDB.getById('staff', id);
    if (!s) return;
    document.getElementById('staffFormId').value = s.id;
    document.getElementById('staffFormName').value = s.name || '';
    document.getElementById('staffFormRole').value = s.role || '';
    document.getElementById('staffFormCategory').value = s.category || 'Academic Faculty';
    document.getElementById('staffFormQualification').value = s.qualification || '';
    document.getElementById('staffFormEmail').value = s.email || '';
    document.getElementById('staffFormPhone').value = s.phone || '';
    document.getElementById('staffFormPhoto').value = s.photoUrl || 'assets/images/logo.png';
    document.getElementById('staffFormBio').value = s.bio || '';
    // Sync photo preview
    const photoPreview = document.getElementById('staffPhotoPreview');
    if (photoPreview) {
      const pUrl = s.photoUrl || 'assets/images/logo.png';
      photoPreview.src = pUrl.startsWith('data:') || pUrl.startsWith('http') ? pUrl : '../' + pUrl;
    }
    const badge = document.getElementById('staffCompressionBadge');
    if (badge) badge.innerHTML = '';
    document.getElementById('staffModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Staff Member';
    openModal('addStaffModal');
  };

  window.submitStaffForm = function() {
    const id = document.getElementById('staffFormId').value;
    const staffData = {
      name: document.getElementById('staffFormName').value.trim(),
      role: document.getElementById('staffFormRole').value.trim(),
      category: document.getElementById('staffFormCategory').value,
      qualification: document.getElementById('staffFormQualification').value.trim(),
      email: document.getElementById('staffFormEmail').value.trim(),
      phone: document.getElementById('staffFormPhone').value.trim(),
      photoUrl: document.getElementById('staffFormPhoto').value.trim() || 'assets/images/logo.png',
      bio: document.getElementById('staffFormBio').value.trim(),
      active: true
    };

    if (id) {
      DhoriaDB.update('staff', id, staffData, currentUser.username);
      showToast('Staff Updated', 'Staff directory entry updated.');
    } else {
      staffData.order = (DhoriaDB.get('staff') || []).length + 1;
      DhoriaDB.create('staff', staffData, currentUser.username);
      showToast('Staff Added', 'New faculty member registered.');
    }
    closeModal('addStaffModal');
    renderStaffList();
  };

  window.deleteStaff = function(id) {
    if (confirm('Delete this staff member from directory?')) {
      DhoriaDB.delete('staff', id, currentUser.username);
      showToast('Deleted', 'Faculty member removed.');
      renderStaffList();
    }
  };

  // ============================================================
  // SECTION 8: EVENTS & GALLERY
  // ============================================================
  function renderEventsTable() {
    const events = DhoriaDB.get('events') || [];
    const tbody = document.getElementById('eventsTbody');
    if (!tbody) return;

    if (events.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="table-empty-state">No events scheduled.</td></tr>';
      return;
    }

    tbody.innerHTML = events.map(e => {
      const evImg = resolveAdminImg(e.imageUrl, 'assets/images/gathering.jpg');
      return `
        <tr>
          <td>
            <div class="table-user-cell">
              <img src="${evImg}" alt="${escapeHtml(e.title)}" class="table-thumb" onerror="this.src='../assets/images/gathering.jpg'">
              <div>
                <strong style="color:var(--adm-text); font-size:0.88rem;">${escapeHtml(e.title)}</strong>
                <div style="font-size:0.75rem; color:var(--adm-text-muted);"><i class="fas fa-map-marker-alt" style="font-size:0.7rem; color:var(--adm-primary);"></i> ${escapeHtml(e.location || 'Campus')}</div>
              </div>
            </div>
          </td>
          <td><span class="status-pill status-unread">${e.category}</span></td>
          <td>${e.date}</td>
          <td><span class="status-pill status-${e.status === 'Upcoming' ? 'active' : 'replied'}">${e.status}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn-action" onclick="editEvent('${e.id}')" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="btn-action btn-action-delete" onclick="deleteEvent('${e.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderGallery() {
    const gallery = DhoriaDB.get('gallery') || [];
    const container = document.getElementById('galleryGrid');
    if (!container) return;
    if (gallery.length === 0) {
      container.innerHTML = '<div class="table-empty-state col-span-full">No gallery pictures yet. Click "Upload Photo to Gallery" to add one.</div>';
      return;
    }

    container.innerHTML = gallery.map(g => {
      const imgSrc = resolveAdminImg(g.imageUrl, 'assets/images/gathering.jpg');
      return `
        <div style="position:relative; border-radius:var(--adm-radius-md); overflow:hidden; border:1px solid var(--adm-border); background:var(--adm-surface);">
          <img src="${imgSrc}" alt="${escapeHtml(g.title)}" style="width:100%; height:130px; object-fit:cover;" onerror="this.src='../assets/images/gathering.jpg'">
          <div style="padding:0.5rem 0.75rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:0.8rem; font-weight:700; color:var(--adm-text);">${escapeHtml(g.title)}</div>
              <span style="font-size:0.7rem; color:var(--adm-primary);">${escapeHtml(g.category || 'General')}</span>
            </div>
            <button class="btn-action btn-action-delete" onclick="deletePhoto('${g.id}')" title="Delete Photo"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.editEvent = function(id) {
    const ev = DhoriaDB.getById('events', id);
    if (!ev) return;
    document.getElementById('eventFormId').value = ev.id;
    document.getElementById('eventFormTitle').value = ev.title || '';
    document.getElementById('eventFormCat').value = ev.category || 'Festival';
    document.getElementById('eventFormDate').value = ev.date || '';
    document.getElementById('eventFormLocation').value = ev.location || '';
    document.getElementById('eventFormStatus').value = ev.status || 'Upcoming';
    document.getElementById('eventFormImage').value = ev.imageUrl || 'assets/images/weebly/3061265.jpg';
    document.getElementById('eventFormDesc').value = ev.description || '';
    // Sync photo preview
    const evPreview = document.getElementById('eventPhotoPreview');
    if (evPreview) {
      const eUrl = ev.imageUrl || 'assets/images/weebly/3061265.jpg';
      evPreview.src = eUrl.startsWith('data:') || eUrl.startsWith('http') ? eUrl : '../' + eUrl;
    }
    const evBadge = document.getElementById('eventCompressionBadge');
    if (evBadge) evBadge.innerHTML = '';
    document.getElementById('eventModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Event';
    openModal('addEventModal');
  };

  window.submitEventForm = function() {
    const id = document.getElementById('eventFormId').value;
    const eventData = {
      title: document.getElementById('eventFormTitle').value.trim(),
      category: document.getElementById('eventFormCat').value,
      date: document.getElementById('eventFormDate').value,
      location: document.getElementById('eventFormLocation').value.trim(),
      status: document.getElementById('eventFormStatus').value,
      imageUrl: document.getElementById('eventFormImage').value.trim() || 'assets/images/gathering.jpg',
      description: document.getElementById('eventFormDesc').value.trim(),
      featured: true
    };

    if (id) {
      DhoriaDB.update('events', id, eventData, currentUser.username);
      showToast('Event Updated', 'Event details saved.');
    } else {
      DhoriaDB.create('events', eventData, currentUser.username);
      showToast('Event Created', 'New academy event scheduled.');
    }
    closeModal('addEventModal');
    renderEventsTable();
  };

  window.deleteEvent = function(id) {
    if (confirm('Delete this event?')) {
      DhoriaDB.delete('events', id, currentUser.username);
      showToast('Deleted', 'Event deleted.');
      renderEventsTable();
    }
  };

  window.deletePhoto = function(id) {
    if (confirm('Delete photo from gallery?')) {
      DhoriaDB.delete('gallery', id, currentUser.username);
      showToast('Deleted', 'Photo removed.');
      renderGallery();
    }
  };

  window.submitGalleryForm = function() {
    const photoData = {
      title: document.getElementById('galFormTitle').value.trim() || 'Academy Photo',
      category: document.getElementById('galFormCat').value,
      imageUrl: document.getElementById('galFormImage').value.trim() || 'assets/images/gathering.jpg'
    };

    DhoriaDB.create('gallery', photoData, currentUser.username);
    showToast('Photo Added', 'New picture added to academy gallery.');
    closeModal('addGalleryModal');
    document.getElementById('galleryForm').reset();
    resetImageField('galFormImage', 'galPhotoPreview', 'galCompressionBadge', 'assets/images/gathering.jpg');
    renderGallery();
  };

  // ============================================================
  // SECTION 9: STUDENT ARTICLES
  // ============================================================
  window.renderArticlesTable = function() {
    const articles = DhoriaDB.get('articles') || [];
    const search = (document.getElementById('searchArticlesInput')?.value || '').toLowerCase();
    const status = document.getElementById('filterArticleStatus')?.value || 'all';

    const filtered = articles.filter(art => {
      const matchSearch = art.title.toLowerCase().includes(search) || art.author.toLowerCase().includes(search);
      const matchStatus = status === 'all' || art.status === status;
      return matchSearch && matchStatus;
    });

    const tbody = document.getElementById('articlesTbody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="table-empty-state">No articles found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(art => {
      const authorImg = resolveAdminImg(art.authorPhotoUrl, 'assets/images/logo.png');
      return `
        <tr>
          <td style="max-width:280px;"><strong style="color:var(--adm-text); font-size:0.88rem;">${escapeHtml(art.title)}</strong></td>
          <td>
            <div class="table-user-cell">
              <img src="${authorImg}" alt="${escapeHtml(art.author)}" class="table-avatar" onerror="this.src='../assets/images/logo.png'">
              <div>
                <strong style="color:var(--adm-text); font-size:0.85rem;">${escapeHtml(art.author)}</strong>
                <div style="font-size:0.72rem; color:var(--adm-text-muted);">${escapeHtml(art.authorRole || 'Student')}</div>
              </div>
            </div>
          </td>
          <td><span class="status-pill status-unread">${art.category}</span></td>
          <td>${art.date}</td>
          <td><span style="font-weight:600; color:var(--adm-text);">${art.views || 0}</span></td>
          <td><span class="status-pill ${art.status === 'Published' ? 'status-active' : 'status-review'}">${art.status}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn-action" onclick="editArticle('${art.id}')" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="btn-action btn-action-delete" onclick="deleteArticle('${art.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  };

  window.editArticle = function(id) {
    const art = DhoriaDB.getById('articles', id);
    if (!art) return;
    document.getElementById('artFormId').value = art.id;
    document.getElementById('artFormTitle').value = art.title || '';
    document.getElementById('artFormAuthor').value = art.author || '';
    document.getElementById('artFormAuthorRole').value = art.authorRole || '';
    document.getElementById('artFormCat').value = art.category || 'Culture & Arts';
    document.getElementById('artFormStatus').value = art.status || 'Published';
    document.getElementById('artFormExcerpt').value = art.excerpt || '';
    document.getElementById('artFormContent').value = art.content || '';
    // Populate author photo
    const photoVal = art.authorPhotoUrl || 'assets/images/logo.png';
    document.getElementById('artFormPhoto').value = photoVal;
    const preview = document.getElementById('artPhotoPreview');
    if (preview) preview.src = resolveAdminImg(photoVal, 'assets/images/logo.png');
    document.getElementById('articleModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Article';
    openModal('addArticleModal');
  };

  window.submitArticleForm = function() {
    const id = document.getElementById('artFormId').value;
    const articleData = {
      title: document.getElementById('artFormTitle').value.trim(),
      author: document.getElementById('artFormAuthor').value.trim(),
      authorRole: document.getElementById('artFormAuthorRole').value.trim(),
      authorPhotoUrl: document.getElementById('artFormPhoto')?.value.trim() || 'assets/images/logo.png',
      category: document.getElementById('artFormCat').value,
      status: document.getElementById('artFormStatus').value,
      excerpt: document.getElementById('artFormExcerpt').value.trim(),
      content: document.getElementById('artFormContent').value.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    if (id) {
      DhoriaDB.update('articles', id, articleData, currentUser.username);
      showToast('Article Updated', 'Article updated.');
    } else {
      DhoriaDB.create('articles', articleData, currentUser.username);
      showToast('Article Published', 'New article submitted.');
    }
    closeModal('addArticleModal');
    renderArticlesTable();
  };

  window.deleteArticle = function(id) {
    if (confirm('Delete this article?')) {
      DhoriaDB.delete('articles', id, currentUser.username);
      showToast('Deleted', 'Article removed.');
      renderArticlesTable();
    }
  };

  // ============================================================
  // SECTION 10: VIP VISITORS
  // ============================================================
  function renderVisitorsList() {
    const visitors = DhoriaDB.get('visitors') || [];
    const grid = document.getElementById('visitorsCardsGrid');
    if (!grid) return;

    if (visitors.length === 0) {
      grid.innerHTML = '<div class="table-empty-state col-span-full">No VIP visitors recorded.</div>';
      return;
    }

    grid.innerHTML = visitors.map(v => {
      const vImg = resolveAdminImg(v.photoUrl, 'assets/images/logo.png');
      return `
        <div class="item-card">
          <div class="item-card-top">
            <span class="status-pill status-active">${v.badge || v.category}</span>
            <span style="font-size:0.75rem; color:var(--adm-text-muted);">${v.date}</span>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.75rem;">
            <img src="${vImg}" alt="${escapeHtml(v.name)}" style="width:44px; height:44px; border-radius:50%; object-fit:cover; border:1.5px solid var(--adm-border);" onerror="this.src='../assets/images/logo.png'">
            <div>
              <div class="item-card-title">${escapeHtml(v.name)}</div>
              <div class="item-card-subtitle">${escapeHtml(v.designation)}</div>
            </div>
          </div>
          <div class="item-card-desc" style="font-style:italic;">"${escapeHtml(v.comment)}"</div>
          <div class="item-card-footer">
            <div class="table-actions">
              <button class="btn-action" onclick="editVisitor('${v.id}')" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="btn-action btn-action-delete" onclick="deleteVisitor('${v.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  window.editVisitor = function(id) {
    const v = DhoriaDB.getById('visitors', id);
    if (!v) return;
    document.getElementById('visFormId').value = v.id;
    document.getElementById('visFormName').value = v.name || '';
    document.getElementById('visFormDesig').value = v.designation || '';
    document.getElementById('visFormCat').value = v.category || 'Academic';
    document.getElementById('visFormDate').value = v.date || '';
    document.getElementById('visFormPhoto').value = v.photoUrl || 'assets/images/logo.png';
    document.getElementById('visFormComment').value = v.comment || '';
    // Sync preview
    const preview = document.getElementById('visPhotoPreview');
    if (preview) {
      const pUrl = v.photoUrl || 'assets/images/logo.png';
      preview.src = pUrl.startsWith('data:') || pUrl.startsWith('http') ? pUrl : '../' + pUrl;
    }
    const badge = document.getElementById('visCompressionBadge');
    if (badge) badge.innerHTML = '';
    document.getElementById('visitorModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit VIP Testimonial';
    openModal('addVisitorModal');
  };

  window.submitVisitorForm = function() {
    const id = document.getElementById('visFormId').value;
    const cat = document.getElementById('visFormCat').value;
    const visitorData = {
      name: document.getElementById('visFormName').value.trim(),
      designation: document.getElementById('visFormDesig').value.trim(),
      category: cat,
      badge: `${cat} Dignitary`,
      date: document.getElementById('visFormDate').value,
      comment: document.getElementById('visFormComment').value.trim(),
      photoUrl: document.getElementById('visFormPhoto')?.value.trim() || 'assets/images/logo.png',
      active: true
    };

    if (id) {
      DhoriaDB.update('visitors', id, visitorData, currentUser.username);
      showToast('Updated', 'VIP remarks updated.');
    } else {
      DhoriaDB.create('visitors', visitorData, currentUser.username);
      showToast('Added', 'New VIP testimonial recorded.');
    }
    closeModal('addVisitorModal');
    renderVisitorsList();
  };

  window.deleteVisitor = function(id) {
    if (confirm('Delete this visitor quote?')) {
      DhoriaDB.delete('visitors', id, currentUser.username);
      showToast('Deleted', 'VIP remarks removed.');
      renderVisitorsList();
    }
  };

  // ============================================================
  // SECTION 11: PARTNERS & SUPPORTERS
  // ============================================================
  function renderPartnersTable() {
    const partners = DhoriaDB.get('partners') || [];
    const tbody = document.getElementById('partnersTbody');
    if (!tbody) return;

    if (partners.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="table-empty-state">No partner organizations added yet.</td></tr>';
      return;
    }

    tbody.innerHTML = partners.map(p => `
      <tr>
        <td><strong>${escapeHtml(p.name)}</strong></td>
        <td><i class="${p.iconClass || 'fas fa-landmark'}"></i> ${p.iconClass || 'fas fa-landmark'}</td>
        <td><a href="${p.link || '#'}" target="_blank">${p.link || '—'}</a></td>
        <td><span class="status-pill status-active">${p.active !== false ? 'Active' : 'Hidden'}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-action" onclick="editPartner('${p.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-action btn-action-delete" onclick="deletePartner('${p.id}')" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  window.editPartner = function(id) {
    const p = DhoriaDB.getById('partners', id);
    if (!p) return;
    document.getElementById('partnerFormId').value = p.id;
    document.getElementById('partnerFormName').value = p.name || '';
    document.getElementById('partnerFormIcon').value = p.iconClass || 'fas fa-university';
    document.getElementById('partnerFormLink').value = p.link || '';
    document.getElementById('partnerModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Partner Organization';
    openModal('addPartnerModal');
  };

  window.deletePartner = function(id) {
    if (confirm('Remove partner?')) {
      DhoriaDB.delete('partners', id, currentUser.username);
      showToast('Deleted', 'Partner removed from marquee.');
      renderPartnersTable();
    }
  };


  // ============================================================
  // SECTION 12: CONTACT MESSAGES INBOX
  // ============================================================
  window.renderMessagesTable = function() {
    const messages = DhoriaDB.get('messages') || [];
    const search = (document.getElementById('searchMessagesInput')?.value || '').toLowerCase();
    const status = document.getElementById('filterMessagesStatus')?.value || 'all';

    const filtered = messages.filter(m => {
      const matchSearch = m.senderName.toLowerCase().includes(search) || m.subject.toLowerCase().includes(search) || m.message.toLowerCase().includes(search);
      const matchStatus = status === 'all' || m.status === status;
      return matchSearch && matchStatus;
    });

    const tbody = document.getElementById('messagesTbody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="table-empty-state">No contact inquiries found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(m => `
      <tr>
        <td><strong>${escapeHtml(m.senderName)}</strong></td>
        <td>
          <div>${escapeHtml(m.email || 'N/A')}</div>
          <div style="font-size:0.75rem; color:var(--adm-text-muted);">${escapeHtml(m.phone || '')}</div>
        </td>
        <td style="max-width:300px;">
          <strong>${escapeHtml(m.subject)}</strong>
          <div style="font-size:0.8rem; color:var(--adm-text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(m.message)}</div>
        </td>
        <td>${new Date(m.timestamp).toLocaleDateString()}</td>
        <td><span class="status-pill status-${(m.status || 'unread').toLowerCase()}">${m.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-action" onclick="viewMessage('${m.id}')" title="View Message"><i class="fas fa-envelope-open-text"></i></button>
            <button class="btn-action btn-action-delete" onclick="deleteMessage('${m.id}')" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  };

  window.viewMessage = function(id) {
    const msg = DhoriaDB.getById('messages', id);
    if (!msg) return;

    // Mark as read if unread
    if (msg.status === 'Unread') {
      DhoriaDB.update('messages', id, { status: 'Read' }, currentUser.username);
      updateBadges();
    }

    const body = document.getElementById('readMessageModalBody');
    body.innerHTML = `
      <div style="margin-bottom:1rem; border-bottom:1px solid var(--adm-border); padding-bottom:1rem;">
        <h3 style="color:var(--adm-text); font-size:1.2rem;">${escapeHtml(msg.subject)}</h3>
        <div style="display:flex; justify-content:space-between; margin-top:0.5rem; font-size:0.85rem; color:var(--adm-text-muted);">
          <span>From: <strong>${escapeHtml(msg.senderName)}</strong> &lt;${msg.email}&gt;</span>
          <span>${new Date(msg.timestamp).toLocaleString()}</span>
        </div>
        ${msg.phone ? `<div style="font-size:0.85rem; color:var(--adm-text-muted); margin-top:0.25rem;"><i class="fas fa-phone"></i> ${msg.phone}</div>` : ''}
      </div>
      <div style="line-height:1.7; font-size:0.95rem; color:var(--adm-text); white-space:pre-wrap;">${escapeHtml(msg.message)}</div>
    `;

    const footer = document.getElementById('readMessageModalFooter');
    footer.innerHTML = `
      <a href="mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}" class="btn btn-primary btn-sm" onclick="markReplied('${msg.id}')">
        <i class="fas fa-reply"></i> Reply via Email
      </a>
      ${msg.phone ? `
        <a href="https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-success btn-sm" onclick="markReplied('${msg.id}')">
          <i class="fab fa-whatsapp"></i> WhatsApp
        </a>
      ` : ''}
      <button class="btn btn-secondary btn-sm" onclick="closeModal('readMessageModal')">Close</button>
    `;

    openModal('readMessageModal');
  };

  window.markReplied = function(id) {
    DhoriaDB.update('messages', id, { status: 'Replied' }, currentUser.username);
    renderMessagesTable();
  };

  window.deleteMessage = function(id) {
    if (confirm('Delete this message?')) {
      DhoriaDB.delete('messages', id, currentUser.username);
      showToast('Deleted', 'Message deleted.');
      renderMessagesTable();
      updateBadges();
    }
  };

  window.exportMessagesCSV = function() {
    const list = DhoriaDB.get('messages') || [];
    if (list.length === 0) return alert('No messages to export.');

    const headers = ['ID', 'Sender Name', 'Email', 'Phone', 'Subject', 'Message', 'Timestamp', 'Status'];
    const rows = list.map(m => [
      m.id,
      `"${m.senderName}"`,
      `"${m.email}"`,
      `"${m.phone}"`,
      `"${m.subject.replace(/"/g, '""')}"`,
      `"${m.message.replace(/"/g, '""')}"`,
      m.timestamp,
      m.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dhoria_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // ============================================================
  // SECTION 13: USERS & ROLES
  // ============================================================
  function renderUsersTable() {
    const users = DhoriaDB.get('users') || [];
    const tbody = document.getElementById('usersTbody');
    if (!tbody) return;

    tbody.innerHTML = users.map(u => {
      const avatarSrc = resolveAdminImg(u.avatar, 'assets/images/logo.png');
      return `
        <tr>
          <td>
            <div class="table-user-cell">
              <img src="${avatarSrc}" alt="Avatar" class="table-avatar" onerror="this.src='../assets/images/logo.png'">
              <div>
                <strong style="color:var(--adm-text); font-size:0.88rem;">${escapeHtml(u.fullName || u.username)}</strong>
                <div style="font-size:0.72rem; color:var(--adm-text-muted);">${u.username === currentUser.username ? '(You)' : ''}</div>
              </div>
            </div>
          </td>
          <td><code>${escapeHtml(u.username)}</code></td>
          <td><span class="status-pill status-active">${u.role}</span></td>
          <td>${escapeHtml(u.email || 'N/A')}</td>
          <td><span class="status-pill status-active">${u.status}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn-action" onclick="editUser('${u.id}')" title="Edit User & Avatar"><i class="fas fa-edit"></i></button>
              ${u.username !== 'admin' ? `
                <button class="btn-action btn-action-delete" onclick="deleteUser('${u.id}')" title="Delete User"><i class="fas fa-trash"></i></button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.deleteUser = function(id) {
    if (confirm('Delete this admin user account?')) {
      DhoriaDB.delete('users', id, currentUser.username);
      showToast('Deleted', 'User account removed.');
      renderUsersTable();
    }
  };

  // ============================================================
  // SECTION 14: LOGS & BACKUPS
  // ============================================================
  function renderLogsTable() {
    const logs = DhoriaDB.get('activityLog') || [];
    const tbody = document.getElementById('logsTbody');
    if (!tbody) return;

    tbody.innerHTML = logs.slice(0, 50).map(l => `
      <tr>
        <td style="font-size:0.8rem; color:var(--adm-text-muted);">${new Date(l.timestamp).toLocaleString()}</td>
        <td><strong>${escapeHtml(l.user || 'admin')}</strong></td>
        <td><span class="status-pill status-active">${escapeHtml(l.action)}</span></td>
        <td>${escapeHtml(l.details || '')}</td>
      </tr>
    `).join('');
  }

  window.exportFullDatabase = function() {
    const backupJson = DhoriaDB.exportBackup();
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(backupJson);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `dhoria_academy_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Backup Exported', 'Full website backup JSON downloaded.');
  };

  window.handleRestoreFile = function(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      const res = DhoriaDB.importBackup(content, currentUser.username);
      if (res.success) {
        showToast('Database Restored', res.message);
        loadSectionData('dashboard');
      } else {
        alert('Restore Failed: ' + res.error);
      }
    };
    reader.readAsText(file);
    input.value = '';
  };

  window.confirmFactoryReset = function() {
    if (confirm('⚠️ WARNING: This will reset all settings, courses, staff, and events to factory defaults! Are you sure?')) {
      if (confirm('Please confirm again. All changes made since initial install will be replaced with defaults.')) {
        DhoriaDB.resetToDefault(currentUser.username);
        showToast('Reset Complete', 'Website restored to factory defaults.');
        loadSectionData('dashboard');
      }
    }
  };

  // Helper Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial Load
  loadSectionData('dashboard');
  updateBadges();

});
