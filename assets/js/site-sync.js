/**
 * DHORIA ACADEMY GWADAR — LIVE PUBLIC SITE DYNAMIC SYNCHRONIZER (site-sync.js)
 * Connects all 10+ public website pages directly to the shared DhoriaDB master datastore.
 * Handles Global Maintenance Mode, Granular Page & Section Locks, and Live Dynamic Data Hydration.
 */

(function() {
  'use strict';

  function initPublicSync() {
    if (typeof DhoriaDB === 'undefined') return;

    const isSubpage = window.location.pathname.includes('/pages/');
    const homePath = isSubpage ? '../index.html' : 'index.html';
    const adminPath = isSubpage ? '../admin/login.html' : 'admin/login.html';
    const assetsPrefix = isSubpage ? '../' : '';

    // Helper: Escape HTML
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // Identify current page key
    function getCurrentPageKey() {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('about')) return 'about';
      if (p.includes('academics')) return 'academics';
      if (p.includes('admission')) return 'admissions';
      if (p.includes('staff')) return 'staff';
      if (p.includes('event')) return 'events';
      if (p.includes('visitor')) return 'visitors';
      if (p.includes('student-corner') || p.includes('student_corner')) return 'studentCorner';
      if (p.includes('student-article') || p.includes('student_article') || p.includes('articles')) return 'studentArticles';
      if (p.includes('contact')) return 'contact';
      return 'home';
    }

    // ============================================================
    // 1. MAINTENANCE MODE & GRANULAR PAGE / SECTION LOCKING
    // ============================================================
    function syncMaintenanceAndLocks() {
      const s = DhoriaDB.getSettings();
      if (!s) return;

      const maint = s.maintenance || {
        globalEnabled: false,
        title: "Scheduled Maintenance in Progress",
        message: "Dhoria Academy Gwadar website is currently undergoing scheduled maintenance.",
        estimatedTime: "Estimated completion: Soon",
        contactPhone: s.primaryPhone || "0331 5396518",
        contactEmail: s.officialEmail || "kabeer50930@gmail.com",
        lockedPages: {},
        lockedSections: {}
      };

      // 1.1 GLOBAL MAINTENANCE MODE
      let globalOverlay = document.getElementById('dhoria-global-maintenance-overlay');
      if (maint.globalEnabled) {
        if (!globalOverlay) {
          globalOverlay = document.createElement('div');
          globalOverlay.id = 'dhoria-global-maintenance-overlay';
          globalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle at center, #0b192e 0%, #030712 100%);
            color: #ffffff;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            box-sizing: border-box;
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            text-align: center;
          `;
          document.body.appendChild(globalOverlay);
          document.body.style.overflow = 'hidden';
        }

        const phone = maint.contactPhone || s.primaryPhone || '0331 5396518';
        const email = maint.contactEmail || s.officialEmail || 'kabeer50930@gmail.com';

        globalOverlay.innerHTML = `
          <div style="max-width: 620px; width: 100%; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 20px; padding: 2.5rem 2rem; box-shadow: 0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(245, 158, 11, 0.15); backdrop-filter: blur(16px);">
            <div style="display:inline-flex; align-items:center; justify-content:center; width:84px; height:84px; border-radius:50%; background:rgba(245, 158, 11, 0.12); border:2px solid #f59e0b; margin-bottom:1.5rem; box-shadow:0 0 20px rgba(245, 158, 11, 0.3);">
              <img src="${assetsPrefix}assets/images/logo.png?v=3" alt="Logo" style="width:60px; height:60px; object-fit:contain; border-radius:50%;">
            </div>
            
            <div style="display:inline-block; background:rgba(245, 158, 11, 0.2); color:#fbbf24; border:1px solid rgba(245, 158, 11, 0.5); padding:4px 14px; border-radius:99px; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:1rem;">
              <i class="fas fa-tools"></i> Maintenance Mode Active
            </div>

            <h1 style="font-size: clamp(1.5rem, 4vw, 2.1rem); font-weight:800; color:#ffffff; margin:0 0 1rem 0; line-height:1.25;">
              ${escapeHtml(maint.title || 'Scheduled Maintenance in Progress')}
            </h1>

            <p style="color:#cbd5e1; font-size:1rem; line-height:1.7; margin-bottom:1.5rem; text-align:justify; text-justify:inter-word;">
              ${escapeHtml(maint.message || 'The website is currently undergoing planned system upgrades. We will be back online shortly.')}
            </p>

            ${maint.estimatedTime ? `
              <div style="background:rgba(30, 41, 59, 0.8); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:0.75rem 1.25rem; font-size:0.9rem; color:#94a3b8; display:inline-flex; align-items:center; gap:8px; margin-bottom:1.75rem;">
                <i class="fas fa-clock" style="color:#f59e0b;"></i>
                <span>${escapeHtml(maint.estimatedTime)}</span>
              </div>
            ` : ''}

            <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:1.5rem; margin-top:0.5rem; display:flex; flex-direction:column; gap:0.75rem;">
              <div style="font-size:0.85rem; color:#94a3b8; font-weight:600;">Urgent Administrative Assistance:</div>
              <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
                <a href="tel:${phone.replace(/\s+/g, '')}" style="color:#ffffff; background:#1e3a8a; padding:8px 16px; border-radius:8px; text-decoration:none; font-size:0.85rem; font-weight:600; display:inline-flex; align-items:center; gap:6px;">
                  <i class="fas fa-phone-alt" style="color:#f59e0b;"></i> ${phone}
                </a>
                <a href="mailto:${email}" style="color:#ffffff; background:#1e293b; border:1px solid rgba(255,255,255,0.15); padding:8px 16px; border-radius:8px; text-decoration:none; font-size:0.85rem; font-weight:600; display:inline-flex; align-items:center; gap:6px;">
                  <i class="fas fa-envelope" style="color:#f59e0b;"></i> ${email}
                </a>
              </div>
            </div>

            <div style="margin-top:1.75rem; text-align:center;">
              <a href="${adminPath}" style="color:#64748b; font-size:0.75rem; text-decoration:none; transition:color 0.2s;" onmouseover="this.style.color='#f59e0b'" onmouseout="this.style.color='#64748b'">
                <i class="fas fa-lock"></i> Staff &amp; Administrator Login
              </a>
            </div>
          </div>
        `;
      } else {
        if (globalOverlay) {
          globalOverlay.remove();
          document.body.style.overflow = '';
        }
      }

      // 1.2 GRANULAR PAGE LOCK
      const pageKey = getCurrentPageKey();
      const isPageLocked = maint.lockedPages && maint.lockedPages[pageKey] === true;
      let pageLockContainer = document.getElementById('dhoria-page-locked-notice');

      if (isPageLocked && pageKey !== 'home') {
        // Hide standard page sections except header and footer
        document.querySelectorAll('section:not(.header-section):not(header):not(nav), .two-col, .visitor-grid, .article-container, .table-responsive, #admissionForm, #form-summary').forEach(el => {
          el.setAttribute('data-dhoria-locked-hidden', 'true');
          el.style.display = 'none';
        });

        if (!pageLockContainer) {
          pageLockContainer = document.createElement('div');
          pageLockContainer.id = 'dhoria-page-locked-notice';
          pageLockContainer.style.cssText = `
            padding: 5rem 1.5rem;
            max-width: 800px;
            margin: 2rem auto;
            text-align: center;
          `;
          
          const navEl = document.querySelector('nav') || document.querySelector('header');
          if (navEl && navEl.nextSibling) {
            navEl.parentNode.insertBefore(pageLockContainer, navEl.nextSibling);
          } else {
            document.body.insertBefore(pageLockContainer, document.body.firstChild);
          }
        }

        pageLockContainer.innerHTML = `
          <div style="background:var(--card-bg, #ffffff); border:2px dashed var(--secondary, #f59e0b); border-radius:16px; padding:3.5rem 2rem; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
            <div style="width:72px; height:72px; border-radius:50%; background:rgba(245, 158, 11, 0.12); color:#f59e0b; display:inline-flex; align-items:center; justify-content:center; font-size:2rem; margin-bottom:1.25rem;">
              <i class="fas fa-lock"></i>
            </div>
            <h2 style="font-size:1.85rem; font-weight:800; color:var(--text-dark, #0f172a); margin-bottom:0.75rem;">
              Section Temporarily Locked
            </h2>
            <p style="color:var(--text-muted, #64748b); font-size:1.05rem; line-height:1.7; max-width:560px; margin:0 auto 2rem auto;">
              This section is currently undergoing administrative updates by the administration. 
              Please check back shortly or visit our homepage.
            </p>
            <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
              <a href="${homePath}" class="btn btn-primary" style="padding:0.75rem 1.75rem; text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
                <i class="fas fa-home"></i> Return to Homepage
              </a>
              <a href="${isSubpage ? 'contact.html' : 'pages/contact.html'}" class="btn btn-outline" style="padding:0.75rem 1.75rem; text-decoration:none; display:inline-flex; align-items:center; gap:8px; border:1.5px solid var(--primary, #002147); color:var(--primary, #002147);">
                <i class="fas fa-envelope"></i> Contact Office
              </a>
            </div>
          </div>
        `;
      } else {
        if (pageLockContainer) {
          pageLockContainer.remove();
        }
        document.querySelectorAll('[data-dhoria-locked-hidden="true"]').forEach(el => {
          el.removeAttribute('data-dhoria-locked-hidden');
          el.style.display = '';
        });
      }

      // 1.3 NAVBAR LOCK INDICATORS — removed (no lock symbols shown in header)

      // 1.4 HOMEPAGE GRANULAR SECTION LOCKS
      if (pageKey === 'home') {
        const lockedSec = maint.lockedSections || {};
        
        // Hero Slider — target the full container so arrows/nav also hide
        const heroContainer = document.getElementById('hero-slider') ||
                              document.querySelector('.hero-slider-container') ||
                              document.querySelector('.hero-slides-wrapper') ||
                              document.querySelector('.hero-section');
        if (heroContainer) {
          heroContainer.style.display = lockedSec.heroSlider === true ? 'none' : '';
        }

        // Announcements — find section that wraps .announcement-list
        const annSection = document.querySelector('.announcement-list')?.closest('section') ||
                           document.querySelector('.announcement-bar') ||
                           document.querySelector('.announcements-section') ||
                           document.querySelector('#announcements') ||
                           document.querySelector('#announcements-section');
        if (annSection) {
          annSection.style.display = lockedSec.announcements === true ? 'none' : '';
        }

        // Partners Marquee
        const partnersSection = document.querySelector('.partners-section') ||
                                document.querySelector('.partners-track')?.parentElement;
        if (partnersSection) {
          partnersSection.style.display = lockedSec.partners === true ? 'none' : '';
        }
      }
    }

    // ============================================================
    // 2. GLOBAL HEADER, FOOTER & EMERGENCY ALERT BAR
    // ============================================================
    function syncGlobalHeaderAndFooter() {
      const s = DhoriaDB.getSettings();
      if (!s) return;

      // Emergency Alert Bar
      let emBar = document.getElementById('dhoria-emergency-bar');
      if (s.emergencyBanner && s.emergencyBanner.enabled) {
        if (!emBar) {
          emBar = document.createElement('div');
          emBar.id = 'dhoria-emergency-bar';
          document.body.insertBefore(emBar, document.body.firstChild);
        }
        emBar.style.display = 'flex';
        
        let targetLink = s.emergencyBanner.link || 'pages/admissions.html';
        if (isSubpage && targetLink.startsWith('pages/')) {
          targetLink = targetLink.replace('pages/', '');
        }

        const badge = s.emergencyBanner.badge ? `<span style="background:#f59e0b; color:#000; padding:2px 8px; border-radius:99px; font-weight:700; font-size:0.75rem; text-transform:uppercase;">${escapeHtml(s.emergencyBanner.badge)}</span>` : '';
        const link = targetLink ? `<a href="${targetLink}" style="color:#fff; text-decoration:underline; font-weight:700; margin-left:6px;">${escapeHtml(s.emergencyBanner.linkText || 'Apply Now &rarr;')}</a>` : '';
        const newHtml = `${badge} <span>${escapeHtml(s.emergencyBanner.text)}</span> ${link}`;

        if (emBar.innerHTML !== newHtml) {
          emBar.innerHTML = newHtml;
        }
      } else if (emBar) {
        emBar.style.display = 'none';
      }

      // Top Bar Phone
      const topPhones = document.querySelectorAll('.header-top-left a[href^="tel:"]');
      topPhones.forEach(el => {
        if (s.primaryPhone) {
          el.href = `tel:${s.primaryPhone.replace(/\s+/g, '')}`;
          el.textContent = s.primaryPhone;
        }
      });

      // Top Bar Email
      const topEmails = document.querySelectorAll('.header-top-left a[href^="mailto:"]');
      topEmails.forEach(el => {
        if (s.officialEmail) {
          el.href = `mailto:${s.officialEmail}`;
          el.textContent = s.officialEmail;
        }
      });

      // Footer contact info
      const footerParas = document.querySelectorAll('.footer-col p');
      footerParas.forEach(p => {
        if (p.querySelector('.fa-map-marker-alt') && s.address) {
          p.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${escapeHtml(s.address)}`;
        }
        if (p.querySelector('.fa-mobile-alt') && s.primaryPhone) {
          p.innerHTML = `<i class="fas fa-mobile-alt"></i> ${escapeHtml(s.primaryPhone)} ${s.secondaryPhone ? '/ ' + escapeHtml(s.secondaryPhone) : ''}`;
        }
        if (p.querySelector('.fa-envelope') && s.officialEmail) {
          p.innerHTML = `<i class="fas fa-envelope"></i> <a href="mailto:${s.officialEmail}" style="color:inherit; text-decoration:none;">${escapeHtml(s.officialEmail)}</a>`;
        }
      });

      // Official Logo Synchronization
      if (s.siteLogoUrl) {
        const logoSrc = isSubpage ? (s.siteLogoUrl.startsWith('../') ? s.siteLogoUrl : `../${s.siteLogoUrl}`) : s.siteLogoUrl;
        document.querySelectorAll('.nav-logo, .footer-logo, .brand img, .sidebar-logo').forEach(img => {
          if (img) img.src = logoSrc;
        });
      }

      // Academy Name Sync — nav brand text, footer name, footer copyright, page title
      if (s.siteName) {
        // Split into two parts: first word = .dhoria-text, rest = .academy-text
        const nameParts = s.siteName.split(' ');
        const firstWord = nameParts[0] || 'Dhoria';
        const restWords = nameParts.slice(1).join(' ');

        document.querySelectorAll('.dhoria-text').forEach(el => {
          el.textContent = firstWord;
        });
        document.querySelectorAll('.academy-text').forEach(el => {
          el.textContent = restWords;
        });

        // Footer academy name
        document.querySelectorAll('.footer-brand-name, .footer-academy-name').forEach(el => {
          el.textContent = s.siteName;
        });

        // Footer copyright notice
        document.querySelectorAll('.footer-bottom p').forEach(p => {
          p.innerHTML = `&copy; ${s.establishedYear || new Date().getFullYear()} ${escapeHtml(s.siteName)}. All Rights Reserved. Designed by Kabeer Ahmed.`;
        });

        // Update page title suffix
        const currentTitle = document.title;
        if (currentTitle.includes('|')) {
          const parts = currentTitle.split('|');
          document.title = s.siteName + ' | ' + (parts[1] || '').trim();
        } else {
          document.title = s.siteName;
        }
      }

      // Tagline Sync
      if (s.siteTagline) {
        document.querySelectorAll('.footer-tagline, .brand-tagline, .site-tagline, .footer-col > p:not([class]):not(:has(i))').forEach(el => {
          if (!el.querySelector('i') && !el.closest('.footer-bottom')) {
            el.textContent = s.siteTagline;
          }
        });
      }

      // Discreet Admin Portal Link in Footer
      const footerLinks = document.querySelector('.footer-links');
      if (footerLinks && !footerLinks.querySelector('.admin-portal-link')) {
        const li = document.createElement('li');
        li.className = 'admin-portal-link';
        li.innerHTML = `<a href="${adminPath}" style="color:var(--secondary,#f59e0b); font-weight:600;"><i class="fas fa-user-shield"></i> Admin Portal</a>`;
        footerLinks.appendChild(li);
      }
    }

    // ============================================================
    // 3. HOMEPAGE DYNAMICS (index.html)
    // ============================================================
    function syncHomePage() {
      const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || !isSubpage;
      if (!isHome) return;

      // 1. Hero Slides (Only dynamically rebuild if explicitly modified in Admin Panel)
      const slides = DhoriaDB.get('heroSlides') || [];
      const activeSlides = slides.filter(s => s.active !== false);
      const heroWrapper = document.querySelector('.hero-slides-wrapper');
      const isCustomized = localStorage.getItem('dhoria_hero_slides_custom') === '1';

      if (heroWrapper && isCustomized && activeSlides.length > 0) {
        heroWrapper.innerHTML = activeSlides.map((sl, idx) => {
          const imgUrl = sl.imageUrl ? sl.imageUrl.replace(/\.(png|jpg|jpeg)$/i, '.webp') : 'assets/images/hero.webp';
          const priorityAttr = idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"';
          return `
          <div class="hero-slide ${idx === 0 ? 'active' : ''}" data-slide-index="${idx}">
            <img src="${imgUrl}" alt="Hero Slide" class="slide-bg" ${priorityAttr} decoding="async" onerror="this.src='assets/images/hero.webp'">
            <div class="slide-overlay"></div>
            <div class="slide-content">
              ${sl.badge ? `<span class="slide-badge">${escapeHtml(sl.badge)}</span>` : ''}
              <h1 class="slide-title">${sl.title}</h1>
              <p class="slide-desc">${escapeHtml(sl.description)}</p>
              <div class="slide-buttons">
                ${sl.primaryBtnText ? `<a href="${sl.primaryBtnLink || 'pages/admissions.html'}" class="btn btn-primary">${escapeHtml(sl.primaryBtnText)}</a>` : ''}
                ${sl.secondaryBtnText ? `<a href="${sl.secondaryBtnLink || '#explore'}" class="btn btn-secondary">${escapeHtml(sl.secondaryBtnText)}</a>` : ''}
              </div>
            </div>
          </div>
        `;
        }).join('');
      }

      // 2. Announcements
      const announcements = DhoriaDB.get('announcements') || [];
      const activeAnnouncements = announcements.filter(a => a.active !== false);
      const annList = document.querySelector('.announcement-list');

      if (annList) {
        if (activeAnnouncements.length === 0) {
          annList.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--text-muted); font-size:0.95rem;">No active announcements at this time.</div>';
        } else {
          const sorted = [...activeAnnouncements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
          annList.innerHTML = sorted.map(a => `
            <div class="announcement-item ${a.pinned ? 'pinned-item' : ''}" style="${a.pinned ? 'border-left: 4px solid var(--secondary); background: var(--card-bg); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);' : ''}">
              <div style="flex-grow: 1;">
                <div class="announcement-date" style="display:flex; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap;">
                  ${a.pinned ? '<span style="color:var(--secondary); font-size:0.8rem; font-weight:700;"><i class="fas fa-thumbtack"></i> Pinned</span>' : ''}
                  <span>${escapeHtml(a.date || 'Notice')}</span>
                  <span style="font-size:0.75rem; color:var(--primary); font-weight:700; background:rgba(37, 99, 235, 0.08); padding:2px 8px; border-radius:4px;">${escapeHtml(a.category || 'General')}</span>
                </div>
                <div class="announcement-title" style="font-size:1.15rem; font-weight:700; color:var(--text-dark); margin-bottom:6px; line-height:1.3;">${escapeHtml(a.title)}</div>
                ${a.excerpt ? `<div class="announcement-text" style="font-size:0.95rem; color:var(--text-muted); line-height:1.6;">${escapeHtml(a.excerpt)}</div>` : ''}
              </div>
              ${a.linkUrl ? `
                <div style="margin-left: 1.5rem; flex-shrink: 0;">
                  <a href="${a.linkUrl}" class="btn btn-primary btn-sm" style="padding: 0.55rem 1.25rem; font-size: 0.88rem; font-weight: 600; white-space: nowrap; display:inline-flex; align-items:center; gap:6px;">
                    ${escapeHtml(a.linkText || 'Learn More')} <i class="fas fa-arrow-right"></i>
                  </a>
                </div>
              ` : ''}
            </div>
          `).join('');
        }
      }

      // 3. Partners Marquee
      const partners = DhoriaDB.get('partners') || [];
      const activePartners = partners.filter(p => p.active !== false);
      const partnersTrack = document.querySelector('.partners-track');

      if (partnersTrack && activePartners.length > 0) {
        const itemsHtml = activePartners.map(p => `
          <div class="partner-item"><i class="${p.iconClass || 'fas fa-university'}"></i> ${escapeHtml(p.name)}</div>
        `).join('');
        // Duplicate for seamless infinite marquee scroll
        partnersTrack.innerHTML = itemsHtml + itemsHtml;
      }
    }

    // ============================================================
    // 4. STAFF & FACULTY (pages/staff.html & pages/about.html)
    // ============================================================
    function syncStaffPages() {
      const isStaffPage = window.location.pathname.includes('staff');
      const isAboutPage = window.location.pathname.includes('about');
      if (!isStaffPage && !isAboutPage) return;

      const staff = DhoriaDB.get('staff') || [];
      const activeStaff = staff.filter(s => s.active !== false);
      const staffGrid = document.querySelector('#team .grid-4') || document.querySelector('.grid-4');

      if (staffGrid && activeStaff.length > 0) {
        staffGrid.innerHTML = activeStaff.map(s => {
          let photoSrc = s.photoUrl ? (isSubpage ? (s.photoUrl.startsWith('../') ? s.photoUrl : `../${s.photoUrl}`) : s.photoUrl) : '';
          return `
            <div class="staff-card">
              <div class="staff-img-box">
                ${photoSrc ? `<img loading="lazy" src="${photoSrc}" alt="${escapeHtml(s.name)}" onerror="this.style.display='none'">` : ''}
                <svg class="staff-avatar-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="40" r="16" fill="rgba(255, 255, 255, 0.75)" />
                  <path d="M25 80C25 66 36 58 50 58C64 58 75 66 75 80" stroke="rgba(255, 255, 255, 0.75)" stroke-width="8" stroke-linecap="round" fill="none" />
                </svg>
              </div>
              <div class="staff-info-box">
                <h3 class="staff-card-name">${escapeHtml(s.name)}</h3>
                <p class="staff-card-role" style="color: var(--secondary);">${escapeHtml(s.role)}</p>
                <div class="staff-socials">
                  ${s.email ? `<a href="mailto:${s.email}" class="staff-social-link" title="Email"><i class="fas fa-envelope"></i></a>` : ''}
                  ${s.phone ? `<a href="tel:${s.phone}" class="staff-social-link" title="Phone"><i class="fas fa-phone"></i></a>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // ============================================================
    // 5. ACADEMICS & TIMETABLE (pages/academics.html)
    // ============================================================
    function syncAcademicsPage() {
      if (!window.location.pathname.includes('academics')) return;

      const shifts = DhoriaDB.get('shifts') || [];
      const tbody = document.querySelector('.table-responsive table tbody');

      if (tbody && shifts.length > 0) {
        const rowsHtml = shifts.map(sh => `
          <tr>
            <td>
              ${escapeHtml(sh.timing)}<br>
              ${sh.subTiming ? `<span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">(${escapeHtml(sh.subTiming)})</span>` : ''}
            </td>
            <td><strong>${escapeHtml(sh.group)}</strong></td>
            <td>${escapeHtml(sh.classes)}</td>
          </tr>
        `).join('');

        tbody.innerHTML = rowsHtml + `
          <tr style="background-color: var(--bg-light);">
            <td colspan="3" style="text-align: center; font-weight: bold; color: var(--text-muted);">Saturday & Sunday are Off</td>
          </tr>
        `;
      }
    }

    // ============================================================
    // 6. VIP VISITORS & TESTIMONIALS (pages/visitors.html)
    // ============================================================
    function syncVisitorsPage() {
      if (!window.location.pathname.includes('visitor')) return;

      const visitors = DhoriaDB.get('visitors') || [];
      const activeVisitors = visitors.filter(v => v.active !== false);
      const grid = document.querySelector('.visitor-grid');

      if (grid && activeVisitors.length > 0) {
        grid.innerHTML = activeVisitors.map(v => {
          const hasCustomPhoto = v.photoUrl && !v.photoUrl.includes('logo.png');
          const photoSrc = hasCustomPhoto ? (v.photoUrl.startsWith('data:') || v.photoUrl.startsWith('http') ? v.photoUrl : (v.photoUrl.startsWith('../') ? v.photoUrl : `../${v.photoUrl}`)) : null;
          return `
            <div class="visitor-card">
              <span class="visitor-badge">${escapeHtml(v.badge || 'Visitor')}</span>
              <div class="visitor-author">
                <div class="visitor-avatar" style="width:48px; height:48px; border-radius:50%; background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.1rem; overflow:hidden; border:2px solid var(--border-color);">
                  ${photoSrc ? `<img src="${photoSrc}" alt="${escapeHtml(v.name)}" style="width:100%; height:100%; object-fit:cover;" onerror="this.parentElement.innerHTML='${escapeHtml((v.name || 'V').charAt(0))}'">` : escapeHtml((v.name || 'V').charAt(0))}
                </div>
                <div>
                  <h4 style="font-size:1.05rem; margin:0; color:var(--text-dark);">${escapeHtml(v.name)}</h4>
                  <p style="font-size:0.8rem; color:var(--text-muted); margin:0;">${escapeHtml(v.designation)}</p>
                </div>
              </div>
              <div class="visitor-comment">"${escapeHtml(v.comment)}"</div>
              <div style="font-size:0.75rem; color:var(--text-muted); text-align:right;">Visited: ${escapeHtml(v.date)}</div>
            </div>
          `;
        }).join('');
      }
    }

    // ============================================================
    // 7. STUDENT ARTICLES (pages/student-articles.html)
    // ============================================================
    function syncArticlesPage() {
      if (!window.location.pathname.includes('student-article') && !window.location.pathname.includes('student_article')) return;

      const articles = DhoriaDB.get('articles') || [];
      const published = articles.filter(a => a.status === 'Published');
      const container = document.querySelector('.article-container');

      if (container && published.length > 0) {
        container.innerHTML = published.map(art => {
          const rawUrl = art.imageUrl || art.photoUrl;
          let photoSrc = rawUrl ? (rawUrl.startsWith('../') ? rawUrl : (rawUrl.startsWith('data:') || rawUrl.startsWith('http') ? rawUrl : `../${rawUrl}`)) : '../assets/images/weebly/mainpage-3.jpg';
          const excerpt = art.excerpt || (art.content ? (art.content.length > 160 ? art.content.substring(0, 160) + '...' : art.content) : 'Click to read complete article details.');
          return `
            <article class="article-card" id="article-${escapeHtml(art.id || '')}">
              <div class="article-preview-row">
                <div class="article-thumb-wrapper">
                  <img src="${photoSrc}" alt="${escapeHtml(art.title)}" class="article-thumb-img" onerror="this.src='../assets/images/weebly/mainpage-3.jpg'">
                </div>
                <div class="article-preview-content">
                  <div class="article-header">
                    <span class="article-badge">${escapeHtml(art.category || 'General')}</span>
                    <h2 class="article-title">${escapeHtml(art.title)}</h2>
                    <div class="article-meta">
                      <span><i class="fas fa-user"></i> ${escapeHtml(art.author || 'Author')} (${escapeHtml(art.authorRole || 'Contributor')})</span>
                      <span><i class="fas fa-calendar"></i> ${escapeHtml(art.date || '')}</span>
                      <span><i class="fas fa-eye"></i> ${art.views || 0} reads</span>
                    </div>
                  </div>
                  <div class="article-excerpt">
                    <p>${escapeHtml(excerpt)}</p>
                  </div>
                  <div class="article-action">
                    <button class="article-toggle-btn" aria-expanded="false">
                      <span class="toggle-text">Read Full Article</span> <i class="fas fa-chevron-down"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="article-details">
                <div class="article-text">
                  <p style="white-space: pre-line;">${escapeHtml(art.content || '')}</p>
                </div>
              </div>
            </article>
          `;
        }).join('');
      }
    }

    // ============================================================
    // 8. EVENTS PAGE (pages/events.html)
    // ============================================================
    function syncEventsPage() {
      if (!window.location.pathname.includes('event')) return;

      const events = DhoriaDB.get('events') || [];
      const gallery = DhoriaDB.get('gallery') || [];
      const publishedEvents = events.filter(e => e.status !== 'Draft');
      const galleryGrid = document.querySelector('.gallery-grid');

      // Combine dedicated gallery photos and published event photos
      const displayItems = gallery.length > 0 ? gallery : publishedEvents;

      if (galleryGrid && displayItems.length > 0) {
        galleryGrid.innerHTML = displayItems.map(item => {
          const rawUrl = item.imageUrl || item.photoUrl;
          let photoSrc = rawUrl ? (rawUrl.startsWith('../') ? rawUrl : (rawUrl.startsWith('data:') || rawUrl.startsWith('http') ? rawUrl : `../${rawUrl}`)) : '../assets/images/weebly/4308649.jpg';
          const badge = item.category ? `<span class="badge-gold">${escapeHtml(item.category)}</span>` : '';
          return `
            <div class="gallery-item" title="${escapeHtml(item.title)}">
              <img src="${photoSrc}" alt="${escapeHtml(item.title)}" onerror="this.src='../assets/images/weebly/4308649.jpg'">
              <div class="gallery-overlay">
                ${badge}
                <div class="gallery-title">${escapeHtml(item.title)}</div>
                <div class="gallery-desc">${escapeHtml(item.description || item.date || 'Campus activity')}</div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // ============================================================
    // 9. FORM SUBMISSION INTERCEPTORS (CONTACT & ADMISSIONS)
    // ============================================================
    function setupSubmissionHandlers() {
      
      // Contact Form Handler
      const contactForm = document.getElementById('contactForm');
      if (contactForm && !contactForm.dataset.dhoriaSynced) {
        contactForm.dataset.dhoriaSynced = 'true';
        contactForm.addEventListener('submit', function() {
          const name = contactForm.querySelector('#name, input[name="name"]')?.value || 'Website Visitor';
          const email = contactForm.querySelector('#email, input[name="email"]')?.value || '';
          const phone = contactForm.querySelector('#phone, input[name="phone"]')?.value || '';
          const subject = contactForm.querySelector('#subject, input[name="subject"]')?.value || 'Inquiry';
          const message = contactForm.querySelector('#message, textarea[name="message"]')?.value || '';

          if (message || name) {
            DhoriaDB.addMessage({ senderName: name, email, phone, subject, message });
          }
        });
      }

      // Admission Form Handler
      const admissionForm = document.getElementById('admissionForm');
      if (admissionForm && !admissionForm.dataset.dhoriaSynced) {
        admissionForm.dataset.dhoriaSynced = 'true';
        admissionForm.addEventListener('submit', function() {
          const studentName = document.getElementById('studentName')?.value || '';
          const fatherName = document.getElementById('fatherName')?.value || '';
          const currentClass = document.getElementById('currentClass')?.value || 'Class 1st';
          const address = document.getElementById('address')?.value || '';
          const qualification = document.getElementById('lastClass')?.value || '';
          const shiftTiming = document.querySelector('input[name="shift_timing"]:checked')?.value || 'Evening';
          const guardianContact = document.getElementById('guardianContact')?.value || '';

          // Gather DOB digit boxes
          const dobInputs = document.querySelectorAll('.dob-field');
          let dob = '';
          if (dobInputs.length >= 8) {
            dob = `${dobInputs[0].value}${dobInputs[1].value}-${dobInputs[2].value}${dobInputs[3].value}-${dobInputs[4].value}${dobInputs[5].value}${dobInputs[6].value}${dobInputs[7].value}`;
          }

          // Gather Mobile digit boxes
          const mobInputs = document.querySelectorAll('.mobile-field');
          let mobile = '';
          if (mobInputs.length > 0) {
            mobile = Array.from(mobInputs).map(i => i.value).join('');
          }

          // Gather CNIC/B-Form digit boxes
          const cnicInputs = document.querySelectorAll('.cnic-field');
          let bform = '';
          if (cnicInputs.length > 0) {
            bform = Array.from(cnicInputs).map(i => i.value).join('');
          }

          if (studentName) {
            DhoriaDB.addAdmission({
              studentName: studentName,
              fatherName: fatherName,
              className: currentClass,
              dob: dob,
              mobile: mobile,
              guardianMobile: guardianContact,
              bform: bform,
              address: address,
              qualification: qualification,
              shiftTiming: shiftTiming,
              status: 'Pending'
            });
          }
        });
      }

      // Article Upload Form in Student Corner
      const articleForm = document.getElementById('articleUploadForm');
      if (articleForm && !articleForm.dataset.dhoriaSynced) {
        articleForm.dataset.dhoriaSynced = 'true';
        articleForm.addEventListener('submit', function() {
          const author = document.getElementById('articleAuthor')?.value || 'Student';
          const title = document.getElementById('articleTitle')?.value || 'Article';
          
          if (title) {
            DhoriaDB.addArticle({
              title: title,
              author: author,
              authorRole: 'Student Submission',
              category: 'General',
              content: 'Submitted by student from online portal. Awaiting review.',
              status: 'Published'
            });
          }
        });
      }
    }

    // ============================================================
    // 10. MASTER SYNC TRIGGER
    // ============================================================
    function runAllPublicSync() {
      try { syncMaintenanceAndLocks(); } catch (e) { console.error('Error in syncMaintenanceAndLocks:', e); }
      try { syncGlobalHeaderAndFooter(); } catch (e) { console.error('Error in syncGlobalHeaderAndFooter:', e); }
      try { syncHomePage(); } catch (e) { console.error('Error in syncHomePage:', e); }
      try { syncStaffPages(); } catch (e) { console.error('Error in syncStaffPages:', e); }
      try { syncAcademicsPage(); } catch (e) { console.error('Error in syncAcademicsPage:', e); }
      try { syncVisitorsPage(); } catch (e) { console.error('Error in syncVisitorsPage:', e); }
      try { syncArticlesPage(); } catch (e) { console.error('Error in syncArticlesPage:', e); }
      try { syncEventsPage(); } catch (e) { console.error('Error in syncEventsPage:', e); }
      try { setupSubmissionHandlers(); } catch (e) { console.error('Error in setupSubmissionHandlers:', e); }
    }

    // Run Initial Hydrations
    runAllPublicSync();

    // Listen for database changes across open tabs/windows
    DhoriaDB.on('change', () => {
      runAllPublicSync();
    });

    window.addEventListener('dhoria_db_change', () => {
      runAllPublicSync();
    });

    window.addEventListener('focus', () => {
      runAllPublicSync();
    });
  }

  function scheduleSync() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initPublicSync, { timeout: 2000 });
    } else {
      setTimeout(initPublicSync, 800);
    }
  }

  if (document.readyState === 'loading') {
    window.addEventListener('load', scheduleSync);
  } else {
    scheduleSync();
  }
})();
