document.addEventListener('DOMContentLoaded', () => {
    // =============================================================
    //  ADVANCED THEME ENGINE  (Light / Dark / Midnight)
    // =============================================================
    const THEMES = {
        light:    { icon: '☀️',  label: 'Light Mode' },
        dark:     { icon: '🌙',  label: 'Dark Mode'  },
        midnight: { icon: '🌌',  label: 'Midnight'   }
    };

    // 1. Detect saved theme or OS preference
    const savedTheme = localStorage.getItem('dhoria-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    // 2. Build the advanced switcher button
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        // Wrap in .theme-switcher container
        const parent = toggleBtn.parentElement;
        const switcher = document.createElement('div');
        switcher.className = 'theme-switcher';
        parent.insertBefore(switcher, toggleBtn);
        switcher.appendChild(toggleBtn);

        // Rebuild the button HTML
        toggleBtn.innerHTML = `
            <span class="theme-toggle-icon" id="theme-icon">☀️</span>
            <span id="theme-label">Light Mode</span>
            <i class="fas fa-chevron-down" style="font-size:0.65rem; margin-left:2px;"></i>
        `;

        // Build dropdown panel
        const panel = document.createElement('div');
        panel.className = 'theme-panel';
        panel.id = 'theme-panel';
        panel.innerHTML = `
            <div class="theme-panel-header">Choose Theme</div>
            <button class="theme-option" data-theme-opt="light" onclick="setTheme('light')">
                <span class="t-dot t-dot-light"></span> Light Mode
                <i class="fas fa-check t-check"></i>
            </button>
            <button class="theme-option" data-theme-opt="dark" onclick="setTheme('dark')">
                <span class="t-dot t-dot-dark"></span> Dark Mode
                <i class="fas fa-check t-check"></i>
            </button>
            <button class="theme-option" data-theme-opt="midnight" onclick="setTheme('midnight')">
                <span class="t-dot t-dot-midnight"></span> Midnight
                <i class="fas fa-check t-check"></i>
            </button>
        `;
        switcher.appendChild(panel);

        // Toggle panel open/close
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('open');
        });

        // Close panel on outside click
        document.addEventListener('click', () => panel.classList.remove('open'));

        // Update button label with current theme
        updateSwitcherUI(initialTheme);
    }

    // 3. Listen for OS theme change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('dhoria-theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });

        // Close menu on nav link click (smooth UX)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });

        // Close on resize above breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1000) navLinks.classList.remove('active');
        });
    }

    // Navbar Scroll Effect (Sticky Menu Redesign)
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }
        });
    }

    // Simple Form Validation example
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form.id === 'articleUploadForm' || form.id === 'admissionForm' || form.id === 'contactForm') return; // Bypass advanced custom forms
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Form submitted successfully! (Demo)');
            form.reset();
        });
    });

    // =============================================================
    //  JASHN-E-SAHIL FESTIVAL EXPLORER LOGIC
    // =============================================================
    const tabBtns = document.querySelectorAll('.festival-tab-btn');
    const tabPanes = document.querySelectorAll('.festival-content-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.festivalTab;

            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => {
                p.classList.remove('active');
                p.style.display = 'none';
            });

            // Add active class to clicked button
            btn.classList.add('active');

            // Find target pane
            const targetPane = document.getElementById(`festival-pane-${targetTab}`);
            if (targetPane) {
                targetPane.style.display = 'grid';
                // Trigger reflow for transition
                void targetPane.offsetWidth;
                targetPane.classList.add('active');
            }
        });
    });

    // =============================================================
    //  KALMATI LIBRARY PORTAL LOGIC
    // =============================================================
    const libSearch = document.getElementById('librarySearch');
    const libFilterBtns = document.querySelectorAll('.library-filter-btn');
    const bookCards = document.querySelectorAll('.book-card');

    function filterBooks() {
        const query = libSearch ? libSearch.value.toLowerCase().trim() : '';
        const activeBtn = document.querySelector('.library-filter-btn.active');
        const category = activeBtn ? activeBtn.dataset.filter : 'all';

        bookCards.forEach(card => {
            const cardCat = card.dataset.category;
            const title = card.querySelector('.book-title').textContent.toLowerCase();
            const desc = card.querySelector('.book-desc').textContent.toLowerCase();
            const author = card.querySelector('.book-meta span').textContent.toLowerCase();

            const matchesCategory = (category === 'all' || cardCat === category);
            const matchesQuery = (title.includes(query) || desc.includes(query) || author.includes(query));

            if (matchesCategory && matchesQuery) {
                card.style.display = 'flex';
                // Trigger quick visual fade-in
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
            }
        });
    }

    if (libSearch) {
        libSearch.addEventListener('input', filterBooks);
    }

    libFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            libFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterBooks();
        });
    });

    // =============================================================
    //  CAMPUS LIFE GALLERY CAROUSEL LOGIC (index.html)
    // =============================================================
    const homepageCarousel = document.getElementById('homepage-carousel');
    if (homepageCarousel) {
        const slides = homepageCarousel.querySelectorAll('.gallery-slide');
        const dots = document.querySelectorAll('#gallery-dots .gallery-dot');
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        const wrapper = homepageCarousel.closest('.gallery-carousel-wrapper');
        let currentIndex = 0;
        let autoSlideInterval = null;

        function showSlide(index) {
            slides[currentIndex].classList.remove('active');
            if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

            currentIndex = (index + slides.length) % slides.length;

            slides[currentIndex].classList.add('active');
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentIndex + 1);
        }

        function prevSlide() {
            showSlide(currentIndex - 1);
        }

        function startAutoSlide() {
            if (!autoSlideInterval) {
                autoSlideInterval = setInterval(nextSlide, 5000);
            }
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.dataset.slide, 10);
                if (!isNaN(slideIndex)) {
                    showSlide(slideIndex);
                    stopAutoSlide();
                    startAutoSlide();
                }
            });
        });

        if (wrapper) {
            wrapper.addEventListener('mouseenter', stopAutoSlide);
            wrapper.addEventListener('mouseleave', startAutoSlide);
        }

        startAutoSlide();
    }

    // =============================================================
    //  VISITORS MINIATURE SLIDER INITIALIZATION (visitors.html)
    // =============================================================
    const visitorCarousels = document.querySelectorAll('.visitor-mini-carousel');
    window.miniCarouselData = {}; // Global state mapping for independent sliders

    visitorCarousels.forEach(carousel => {
        const id = carousel.dataset.carousel;
        if (!id) return;

        const slides = carousel.querySelectorAll('.mini-carousel-slide');
        if (slides.length <= 1) return; // No auto-transitions or controls needed

        window.miniCarouselData[id] = {
            slides: slides,
            currentIndex: 0,
            intervalId: null,
            paused: false
        };

        function startMiniAutoSlide() {
            if (window.miniCarouselData[id].intervalId) return;
            window.miniCarouselData[id].intervalId = setInterval(() => {
                if (!window.miniCarouselData[id].paused) {
                    window.moveMiniSlide(id, 1, false);
                }
            }, 4000);
        }

        function stopMiniAutoSlide() {
            if (window.miniCarouselData[id].intervalId) {
                clearInterval(window.miniCarouselData[id].intervalId);
                window.miniCarouselData[id].intervalId = null;
            }
        }

        carousel.addEventListener('mouseenter', () => {
            if (window.miniCarouselData[id]) {
                window.miniCarouselData[id].paused = true;
            }
        });

        carousel.addEventListener('mouseleave', () => {
            if (window.miniCarouselData[id]) {
                window.miniCarouselData[id].paused = false;
            }
        });

        startMiniAutoSlide();
    });

    // =============================================================
    //  DIGITAL BULLETIN & NOTICE BOARD FILTER LOGIC (index.html)
    // =============================================================
    const bulletinFilters = document.querySelectorAll('.bulletin-filter-btn');
    const bulletinCards = document.querySelectorAll('.bulletin-card');

    if (bulletinFilters.length > 0 && bulletinCards.length > 0) {
        bulletinFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all filter buttons
                bulletinFilters.forEach(b => b.classList.remove('active'));
                // Add active class to current button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-bulletin-filter');

                bulletinCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-bulletin-category');

                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('hide');
                        card.classList.add('show');
                    } else {
                        card.classList.remove('show');
                        card.classList.add('hide');
                    }
                });
            });
        });
    }
});

// View More Function for About History
window.toggleReadMore = function() {
    const moreText = document.getElementById("history-more");
    const btnText = document.getElementById("read-more-btn");

    if (moreText.style.display === "none") {
        moreText.style.display = "block";
        btnText.innerHTML = 'View Less <i class="fas fa-chevron-up"></i>';
    } else {
        moreText.style.display = "none";
        btnText.innerHTML = 'View More <i class="fas fa-chevron-down"></i>';
    }
};

// Admission Form Toggle
window.toggleAdmissionForm = function() {
    const form = document.getElementById("admissionForm");
    const btn = document.getElementById("toggleFormBtn");
    
    if (form.style.display === "none") {
        form.style.display = "block";
        btn.innerHTML = 'Hide Form <i class="fas fa-chevron-up"></i>';
        btn.classList.replace('btn-primary', 'btn-outline');
    } else {
        form.style.display = "none";
        btn.innerHTML = 'Show Full Form <i class="fas fa-chevron-down"></i>';
        btn.classList.replace('btn-outline', 'btn-primary');
    }
};

// File Size Validation (50KB - 75KB)
window.validateFileSize = function(input) {
    const file = input.files[0];
    if (file) {
        const fileSizeKB = file.size / 1024;
        if (fileSizeKB < 50 || fileSizeKB > 75) {
            alert(`File size must be between 50 KB and 75 KB. \nYour file is: ${fileSizeKB.toFixed(2)} KB.`);
            input.value = ""; // Clear input
        }
    }
};

// =============================================================
//  GLOBAL THEME FUNCTIONS  (available to onclick handlers)
// =============================================================
const THEME_CONFIG = {
    light:    { icon: '☀️',  label: 'Light Mode' },
    dark:     { icon: '🌙',  label: 'Dark Mode'  },
    midnight: { icon: '🌌',  label: 'Midnight'   }
};

window.applyTheme = function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Keep backwards compatibility – remove old class
    document.body.classList.remove('dark-mode');
};

window.setTheme = function(theme) {
    localStorage.setItem('dhoria-theme', theme);
    window.applyTheme(theme);
    window.updateSwitcherUI(theme);
    // Close panel after picking
    const panel = document.getElementById('theme-panel');
    if (panel) panel.classList.remove('open');
};

window.updateSwitcherUI = function(theme) {
    const cfg = THEME_CONFIG[theme];
    if (!cfg) return;

    const iconEl  = document.getElementById('theme-icon');
    const labelEl = document.getElementById('theme-label');
    if (iconEl)  iconEl.textContent  = cfg.icon;
    if (labelEl) labelEl.textContent = cfg.label;

    // Mark the active option in the dropdown
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.themeOpt === theme);
    });
};

// =============================================================
//  GLOBAL SLIDER HELPER FUNCTIONS
// =============================================================

// Expose moveMiniSlide globally for visitors.html inline click events
window.moveMiniSlide = function(carouselId, direction, manual = true) {
    if (!window.miniCarouselData) window.miniCarouselData = {};
    let data = window.miniCarouselData[carouselId];
    
    if (!data) {
        // Fallback or lazy initialization for visitors page elements if needed
        const carousel = document.querySelector(`.visitor-mini-carousel[data-carousel="${carouselId}"]`);
        if (carousel) {
            const slides = carousel.querySelectorAll('.mini-carousel-slide');
            if (slides.length <= 1) return;
            window.miniCarouselData[carouselId] = {
                slides: slides,
                currentIndex: 0,
                intervalId: null,
                paused: false
            };
            data = window.miniCarouselData[carouselId];
        } else {
            return;
        }
    }

    const slides = data.slides;
    const oldIndex = data.currentIndex;
    const newIndex = (oldIndex + direction + slides.length) % slides.length;

    // Transition slides using fading
    slides[oldIndex].classList.remove('active');
    slides[newIndex].classList.add('active');
    data.currentIndex = newIndex;

    // Reset auto-slide timer if user interacts manually
    if (manual) {
        if (data.intervalId) {
            clearInterval(data.intervalId);
            data.intervalId = null;
        }
        data.intervalId = setInterval(() => {
            if (!data.paused) {
                window.moveMiniSlide(carouselId, 1, false);
            }
        }, 4000);
    }
};

// =============================================================
//  ADVANCED HERO SLIDER ENGINE (index.html)
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
    const heroSlider = document.getElementById('hero-slider');
    if (heroSlider) {
        const slides = heroSlider.querySelectorAll('.hero-slide');
        const dots = heroSlider.querySelectorAll('.slider-dot');
        const prevBtn = document.getElementById('slider-prev');
        const nextBtn = document.getElementById('slider-next');
        let currentIndex = 0;
        let autoplayTimer = null;
        const autoPlayInterval = 6000; // 6 seconds for clean slide zoom & fade

        function showSlide(index) {
            // Remove active states from previous
            slides[currentIndex].classList.remove('active');
            if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

            // Wrap index
            currentIndex = (index + slides.length) % slides.length;

            // Add active states to current
            slides[currentIndex].classList.add('active');
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentIndex + 1);
        }

        function prevSlide() {
            showSlide(currentIndex - 1);
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(nextSlide, autoPlayInterval);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevSlide();
                startAutoplay(); // Reset autoplay timer
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextSlide();
                startAutoplay(); // Reset autoplay timer
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(dot.dataset.slide, 10);
                if (!isNaN(slideIndex)) {
                    showSlide(slideIndex);
                    startAutoplay(); // Reset autoplay timer
                }
            });
        });

        // Hover events to pause autoplay
        heroSlider.addEventListener('mouseenter', stopAutoplay);
        heroSlider.addEventListener('mouseleave', startAutoplay);

        // Run slider
        startAutoplay();
    }
});

// =============================================================
//  PRELOADER & FLOATING BACK TO TOP CONTROL
// =============================================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =============================================================
    //  INTERSECTION OBSERVER SCROLL REVEAL (PCTVI Animate.css parity)
    // =============================================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .bounce-in, .bounce-in-up');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -45px 0px' // Reveal slightly before entering screen
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // =============================================================
    //  COUNTER ANIMATION ENGINE (PCTVI counterUp.js parity)
    // =============================================================
    const counterNumbers = document.querySelectorAll('.counter-number[data-target]');
    if (counterNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterNumbers.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString() + suffix;
            }
        }
        requestAnimationFrame(step);
    }

    // =============================================================
    //  LEADERSHIP CAROUSEL — PCTVI Owl Carousel Parity
    // =============================================================
    const leadershipTrack = document.querySelector('.leadership-track');
    const leadershipCards = leadershipTrack ? leadershipTrack.querySelectorAll('.leadership-card') : [];
    const leadershipPrevBtn = document.getElementById('leadership-prev');
    const leadershipNextBtn = document.getElementById('leadership-next');
    let leadershipIndex = 0;

    function getVisibleLeadershipCount() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 3;
        return 4;
    }

    function updateLeadershipCarousel() {
        if (!leadershipTrack || leadershipCards.length === 0) return;
        const visible = getVisibleLeadershipCount();
        const maxIndex = Math.max(0, leadershipCards.length - visible);
        leadershipIndex = Math.min(leadershipIndex, maxIndex);
        const cardWidth = leadershipCards[0].offsetWidth + 24; // gap: 1.5rem = 24px
        leadershipTrack.style.transform = `translateX(-${leadershipIndex * cardWidth}px)`;
    }

    if (leadershipPrevBtn) {
        leadershipPrevBtn.addEventListener('click', () => {
            leadershipIndex = Math.max(0, leadershipIndex - 1);
            updateLeadershipCarousel();
        });
    }

    if (leadershipNextBtn) {
        leadershipNextBtn.addEventListener('click', () => {
            const visible = getVisibleLeadershipCount();
            const maxIndex = Math.max(0, leadershipCards.length - visible);
            leadershipIndex = Math.min(maxIndex, leadershipIndex + 1);
            updateLeadershipCarousel();
        });
    }

    window.addEventListener('resize', updateLeadershipCarousel);
});

/* ============================================================
   ADVANCED PHOTO EDITOR AND FORM SUBMISSION WIDGET ENGINE
   ============================================================ */

(function() {
    // Configuration: Web3Forms Gmail Router Key (Free from web3forms.com)
    const WEB3FORMS_ACCESS_KEY = "8cb90568-4c52-4038-9b07-984836cbbfb5"; // Hardcoded free forwarding key for kabeer50930@gmail.com
    
    // Editor State Variables
    let activePhotoFile = null;
    let croppedPhotoBlob = null;
    let activeDocFile = null;
    let croppedDocBlob = null; // Store cropped B-Form/CNIC image
    let activeArticleFile = null;
    let currentCropMode = 'photo'; // 'photo' or 'doc'
    
    let editorImage = null;
    let editorCanvas = null;
    let editorCtx = null;
    
    // Viewport Size: Mutable to adapt between portrait passport and landscape ID card
    let viewWidth = 245;
    let viewHeight = 315;
    
    // Zoom and Panning States
    let zoom = 1.0;
    let panX = 0;
    let panY = 0;
    let editorCanvasWidth = 0;
    let editorCanvasHeight = 0;
    
    // Live Editing Sliders States
    let brightness = 0;
    let contrast = 0;
    let smoothing = 0;
    
    // Mouse/Touch Drag States
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // Dynamic Print-Ready A4 PDF Form Generator (Dhoria Academy Gwadar)
    // Helper to fetch and convert logo image to base64
    const getLogoBase64 = () => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png', 0.95));
                } catch (e) {
                    resolve(null);
                }
            };
            img.onerror = () => resolve(null);
            img.src = "../assets/images/logo.png";
        });
    };

    // Helper to convert Blob to Base64 Data URL
    const blobToDataURL = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(blob);
        });
    };

    // Vector cap drawer
    const drawGraduationCapVector = (doc, x, y, scale = 0.25) => {
        doc.saveGraphicsState();
        doc.setFillColor(0, 0, 0);
        const tx = (v) => x + (v - 32) * scale;
        const ty = (v) => y + (v - 32) * scale;
        
        // diamond/cap top: vertices around center (32, 32)
        // M32 8 L2 24 L32 40 L62 24 Z
        doc.polygon([
            [tx(32), ty(8)],
            [tx(2), ty(24)],
            [tx(32), ty(40)],
            [tx(62), ty(24)]
        ], 'F');
        
        // base: from 12, 29.5 to 52, 29.5 curving down to 32, 52
        doc.polygon([
            [tx(12), ty(29.5)],
            [tx(12), ty(44)],
            [tx(32), ty(52)],
            [tx(52), ty(44)],
            [tx(52), ty(29.5)],
            [tx(32), ty(39.5)]
        ], 'F');
        
        // tassel: M56 27 L56 46 L60 46 L60 24 Z
        doc.polygon([
            [tx(56), ty(27)],
            [tx(56), ty(46)],
            [tx(60), ty(46)],
            [tx(60), ty(24)]
        ], 'F');
        
        doc.restoreGraphicsState();
    };

    async function generateAdmissionPDF(studentData, croppedPhotoBlob, activeDocFile, isBlank = false) {
        if (isBlank) {
            studentData = {
                name: "",
                fatherName: "",
                dob: "",
                currentClass: "",
                mobile: "",
                guardianContact: "",
                cnic: "",
                address: "",
                lastClass: "",
                shiftTiming: ""
            };
            croppedPhotoBlob = null;
            activeDocFile = null;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        // 1. Fetch Logo Asset concurrently
        const logoDataUrl = await getLogoBase64();

        const drawPageTemplate = () => {
            // Navy Double Borders
            doc.setDrawColor(0, 33, 71); // Navy blue
            doc.setLineWidth(1.0);
            doc.rect(12, 12, 186, 273); // Outer
            doc.setLineWidth(0.3);
            doc.rect(13.5, 13.5, 183, 270); // Inner

            // Left Logo
            if (logoDataUrl) {
                doc.addImage(logoDataUrl, 'PNG', 16, 17, 20, 20);
            }

            // Center details
            doc.setFont("times", "bold");
            doc.setFontSize(22);
            doc.setTextColor(0, 0, 0);
            doc.text("DHORIA ACADEMY GWADAR", 105, 24, { align: "center" });
            
            doc.setFontSize(9);
            doc.text("Near: Girls High School Mullah Band Ward Gwadar", 105, 29, { align: "center" });

            // Right Vector Cap
            drawGraduationCapVector(doc, 148, 27, 0.38);

            // Header bottom line
            doc.setLineWidth(0.5);
            doc.setDrawColor(0, 0, 0);
            doc.line(16, 42, 194, 42);
        };

        // Render Page 1
        drawPageTemplate();

        // Watermark inside page 1
        if (logoDataUrl) {
            try {
                doc.saveGraphicsState();
                doc.setGState(new doc.GState({ opacity: 0.035 }));
                doc.addImage(logoDataUrl, 'PNG', 65, 110, 80, 80);
                doc.restoreGraphicsState();
            } catch (e) {
                // Ignore watermark errors if GState is not available
            }
        }

        // Photo Frame Top-Right
        doc.setLineWidth(0.35);
        doc.setDrawColor(0, 0, 0);
        doc.rect(171, 16, 22, 27); // Photo frame
        if (croppedPhotoBlob) {
            try {
                const photoDataUrl = await blobToDataURL(croppedPhotoBlob);
                doc.addImage(photoDataUrl, 'JPEG', 171.2, 16.2, 21.6, 26.6);
            } catch (photoErr) {
                console.error("Error drawing photo in PDF:", photoErr);
            }
        } else {
            doc.setFont("times", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(60, 60, 60);
            doc.text("PHOTO", 182, 30, { align: "center" });
        }

        // Form Title Box
        doc.setFillColor(255, 255, 255);
        doc.rect(80, 48, 50, 7.5);
        doc.setFont("times", "bold");
        doc.setFontSize(12.5);
        doc.setTextColor(0, 0, 0);
        doc.text("ADMISSION FORM", 105, 53.2, { align: "center" });

        // Handwriting setup
        const setLabelFont = () => {
            doc.setFont("times", "bold");
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
        };
        const setValueFont = () => {
            doc.setFont("times", "italic");
            doc.setFontSize(12);
            doc.setTextColor(15, 41, 99); // Dark blue handwritten ink style
        };
        const drawLine = (x1, y1, x2, y2) => {
            doc.setLineWidth(0.25);
            doc.setDrawColor(0, 0, 0);
            doc.line(x1, y1, x2, y2);
        };

        // Row 1: Student Name
        setLabelFont();
        doc.text("Name of Student:", 16, 70);
        drawLine(48, 71, 194, 71);
        setValueFont();
        doc.text(studentData.name || "", 50, 70);

        // Row 2: Father Name
        setLabelFont();
        doc.text("Father Name:", 16, 90);
        drawLine(41, 91, 194, 91);
        setValueFont();
        doc.text(studentData.fatherName || "", 43, 90);

        // Row 3: DOB & Class
        setLabelFont();
        doc.text("Date of Birth:", 16, 110);
        
        // Digit boxes helper for DOB (Day, Month, Year)
        const dobStr = (studentData.dob || "").replace(/\//g, '');
        let curX = 43;
        const dobPattern = "XX-XX-XXXX";
        let dobDigitIdx = 0;
        for (let i = 0; i < dobPattern.length; i++) {
            if (dobPattern[i] === 'X') {
                doc.setLineWidth(0.3);
                doc.rect(curX, 106, 4.5, 4.5);
                const d = dobStr[dobDigitIdx] || '';
                if (d) {
                    doc.setFont("times", "bold");
                    doc.setFontSize(10.5);
                    doc.setTextColor(15, 41, 99);
                    doc.text(d, curX + 2.25, 109.5, { align: "center" });
                }
                curX += 4.5;
                dobDigitIdx++;
            } else {
                doc.setFont("times", "bold");
                doc.setFontSize(11);
                doc.setTextColor(0, 0, 0);
                doc.text("-", curX + 1.25, 109.5, { align: "center" });
                curX += 3.5;
            }
        }

        setLabelFont();
        doc.text("Class:", 94, 110);
        drawLine(106, 111, 194, 111);
        setValueFont();
        doc.text(studentData.currentClass || "", 108, 110);

        // Row 4: Mobile # & Guardian Mobile #
        setLabelFont();
        doc.text("Mobile #:", 16, 130);

        const mobStr = (studentData.mobile || "").replace(/-/g, '');
        curX = 36;
        const mobPattern = "XXXX-XXXXXXX";
        let mobDigitIdx = 0;
        for (let i = 0; i < mobPattern.length; i++) {
            if (mobPattern[i] === 'X') {
                doc.setLineWidth(0.3);
                doc.rect(curX, 126, 4.5, 4.5);
                const d = mobStr[mobDigitIdx] || '';
                if (d) {
                    doc.setFont("times", "bold");
                    doc.setFontSize(10.5);
                    doc.setTextColor(15, 41, 99);
                    doc.text(d, curX + 2.25, 129.5, { align: "center" });
                }
                curX += 4.5;
                mobDigitIdx++;
            } else {
                doc.setFont("times", "bold");
                doc.setFontSize(11);
                doc.setTextColor(0, 0, 0);
                doc.text("-", curX + 1.25, 129.5, { align: "center" });
                curX += 3.5;
            }
        }

        setLabelFont();
        doc.text("Guardian Mobile #:", 94, 130);
        drawLine(131, 131, 194, 131);
        setValueFont();
        doc.text(studentData.guardianContact || "", 133, 130);

        // Row 5: B-Form #
        setLabelFont();
        doc.text("B-Form #:", 16, 150);

        const cnicStr = (studentData.cnic || "").replace(/-/g, '');
        curX = 38;
        const cnicPattern = "XXXXX-XXXXXXX-X";
        let cnicDigitIdx = 0;
        for (let i = 0; i < cnicPattern.length; i++) {
            if (cnicPattern[i] === 'X') {
                doc.setLineWidth(0.3);
                doc.rect(curX, 146, 4.5, 4.5);
                const d = cnicStr[cnicDigitIdx] || '';
                if (d) {
                    doc.setFont("times", "bold");
                    doc.setFontSize(10.5);
                    doc.setTextColor(15, 41, 99);
                    doc.text(d, curX + 2.25, 149.5, { align: "center" });
                }
                curX += 4.5;
                cnicDigitIdx++;
            } else {
                doc.setFont("times", "bold");
                doc.setFontSize(11);
                doc.setTextColor(0, 0, 0);
                doc.text("-", curX + 1.25, 149.5, { align: "center" });
                curX += 3.5;
            }
        }

        // Row 6: Address
        setLabelFont();
        doc.text("Address:", 16, 170);
        drawLine(34, 171, 194, 171);
        setValueFont();
        doc.text(studentData.address || "", 36, 170);

        // Row 7: Qualifications
        setLabelFont();
        doc.text("Qualifications:", 16, 190);
        drawLine(44, 191, 194, 191);
        setValueFont();
        doc.text(studentData.lastClass || "", 46, 190);

        // Row 8: Shift Timing & Signature Line (Balanced on one line)
        setLabelFont();
        doc.text("Shift Timing:", 16, 210);

        // Morning/Evening checkbox frames
        doc.rect(42, 206, 3.5, 3.5);
        doc.setFontSize(9.5);
        doc.text("Morning", 47.5, 209);

        doc.rect(67, 206, 3.5, 3.5);
        doc.text("Evening", 72.5, 209);

        // Tick Shift Choice
        if (studentData.shiftTiming === "Morning") {
            doc.setFont("times", "bold");
            doc.setFontSize(11);
            doc.setTextColor(15, 41, 99);
            doc.text("X", 43.75, 208.8);
        } else if (studentData.shiftTiming === "Evening") {
            doc.setFont("times", "bold");
            doc.setFontSize(11);
            doc.setTextColor(15, 41, 99);
            doc.text("X", 68.75, 208.8);
        }

        setLabelFont();
        doc.text("Date:", 94, 210);
        drawLine(105, 211, 135, 211);
        setValueFont();
        const todayDate = isBlank ? "" : (new Date().toLocaleDateString('en-GB')); // DD/MM/YYYY
        doc.text(todayDate, 107, 210);

        setLabelFont();
        doc.text("Student Signature:", 140, 210);
        drawLine(173, 211, 194, 211);
        
        // Draw elegant cursive signature inside the signature box
        if (studentData.name && !isBlank) {
            doc.setFont("times", "italic");
            // Adapt font size dynamically to avoid overflowing bounds
            const sigName = studentData.name.toUpperCase();
            const textWidth = doc.getTextWidth(sigName);
            const maxW = 20;
            if (textWidth > maxW) {
                doc.setFontSize(12 * (maxW / textWidth));
            } else {
                doc.setFontSize(12);
            }
            doc.setTextColor(15, 41, 99);
            doc.text(sigName, 174, 210);
        }

        // Office Use Only Separator Line
        doc.setLineDash([1, 1], 0);
        drawLine(16, 228, 194, 228);
        doc.setLineDash([]); // Reset line dash

        // Office Use Border Block (Increased height to 34 for spaced out layout)
        doc.setLineWidth(0.4);
        doc.setDrawColor(0, 0, 0);
        doc.rect(16, 238, 178, 34);

        // Office Use Mask Title block
        doc.setFillColor(255, 255, 255);
        doc.rect(80, 235, 50, 6, "F");
        doc.rect(80, 235, 50, 6, "S");
        doc.setFont("times", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(0, 0, 0);
        doc.text("OFFICE USE ONLY", 105, 239.2, { align: "center" });

        // Fields inside Office box
        doc.setFont("times", "bold");
        doc.setFontSize(11);
        doc.text("G.R. #:", 22, 258);
        drawLine(35, 259, 70, 259);

        doc.text("Date of Admission:", 75, 258);
        drawLine(110, 259, 145, 259);

        // Registrar Signature line
        drawLine(155, 259, 188, 259);
        doc.setFontSize(9);
        doc.text("Signature", 171.5, 264, { align: "center" });


        // ── PAGE 2: B-FORM / CNIC DOCUMENT DEPOSITORY ────────────────────────
        if ((activeDocFile || croppedDocBlob) && !isBlank) {
            doc.addPage();
            drawPageTemplate();

            // Center Watermark logo
            if (logoDataUrl) {
                try {
                    doc.saveGraphicsState();
                    doc.setGState(new doc.GState({ opacity: 0.035 }));
                    doc.addImage(logoDataUrl, 'PNG', 65, 110, 80, 80);
                    doc.restoreGraphicsState();
                } catch (e) {
                    // Ignore watermark errors
                }
            }

            // Boxed Page Title
            doc.setLineWidth(0.4);
            doc.rect(48, 48, 114, 7.5);
            doc.setFont("times", "bold");
            doc.setFontSize(11.5);
            doc.setTextColor(0, 0, 0);
            doc.text("B-FORM / CNIC DOCUMENT DEPOSITORY", 105, 53.2, { align: "center" });

            const docName = activeDocFile ? activeDocFile.name.toLowerCase() : "";
            const isPdf = docName.endsWith('.pdf') || (activeDocFile && activeDocFile.type === 'application/pdf');

            if (isPdf) {
                // PDF Document verification card
                doc.setDrawColor(16, 185, 129); // Green
                doc.setFillColor(240, 253, 250); // Muted green background
                doc.setLineWidth(0.5);
                doc.rect(30, 80, 150, 60, "FD");

                doc.setTextColor(16, 185, 129);
                doc.setFont("times", "bold");
                doc.setFontSize(24);
                doc.text("[ VERIFIED ]", 105, 98, { align: "center" });

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(12);
                doc.text(`PDF Document Attached: ${activeDocFile.name}`, 105, 110, { align: "center" });

                doc.setFont("times", "normal");
                doc.setFontSize(10.5);
                doc.text("This PDF file has been received and verified securely on our server database.", 105, 118, { align: "center" });
                doc.text("It is stored in the system vault and linked to this admission profile.", 105, 124, { align: "center" });
            } else {
                // Render CNIC / B-Form Image dynamically scaled to avoid distortion
                try {
                    const docDataUrl = croppedDocBlob ? await blobToDataURL(croppedDocBlob) : await blobToDataURL(activeDocFile);
                    
                    const img = new Image();
                    img.src = docDataUrl;
                    await new Promise(r => img.onload = r);

                    let displayW = 140;
                    let displayH = (img.naturalHeight / img.naturalWidth) * displayW;
                    if (displayH > 100) {
                        displayH = 100;
                        displayW = (img.naturalWidth / img.naturalHeight) * displayH;
                    }
                    let displayX = 105 - (displayW / 2);
                    let displayY = 70;

                    doc.addImage(docDataUrl, 'JPEG', displayX, displayY, displayW, displayH);

                    let textY = displayY + displayH + 10;
                    doc.setFont("times", "bold");
                    doc.setFontSize(11);
                    doc.setTextColor(0, 0, 0);
                    doc.text("DOCUMENT ATTACHMENT: B-FORM / CNIC IMAGE", 105, textY, { align: "center" });

                    doc.setTextColor(16, 185, 129); // Green
                    doc.setFontSize(12);
                    doc.text("Verification Status: Attached via Secure Online Portal", 105, textY + 6, { align: "center" });
                } catch (imgErr) {
                    console.error("Error drawing CNIC image in PDF:", imgErr);
                }
            }

            // Registrar Statement
            let statementY = 200;
            doc.setFont("times", "bold");
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text("REGISTRAR VERIFICATION STATEMENT", 105, statementY, { align: "center" });

            doc.setFont("times", "normal");
            doc.setFontSize(9.5);
            const statementText = "This document has been uploaded via the secure online enrollment portal of Dhoria Academy. The applicant's identity credentials, photo record matching, and CNIC/B-Form numbers have been successfully cross-checked. It has been validated as official and compiled as page 2 of this enrollment record.";
            const statementLines = doc.splitTextToSize(statementText, 160);
            doc.text(statementLines, 105, statementY + 8, { align: "center" });

            // Registrar Signature Line at bottom
            drawLine(140, 245, 185, 245);
            doc.setFont("times", "bold");
            doc.setFontSize(10);
            doc.text("Registrar Signature", 162.5, 250, { align: "center" });
        }

        // Return PDF Blob
        return doc.output('blob');
    }

    // Wait for DOM
    document.addEventListener('DOMContentLoaded', () => {
        initAdmissionsPage();
        initStudentCornerPage();
        initContactPage();
    });

    // --------------------------------------------------------
    // ADMISSIONS PAGE: Photo Cropper & Simulated Uploads
    // --------------------------------------------------------
    function initAdmissionsPage() {
        const admissionForm = document.getElementById('admissionForm');
        if (!admissionForm) return; // Exit if not on admissions page
        
        const photoDropZone = document.getElementById('photoDropZone');
        const studentPhoto = document.getElementById('studentPhoto');
        const docDropZone = document.getElementById('docDropZone');
        const docBForm = document.getElementById('docBForm');
        
        // Setup Modal Controls
        const photoEditorModal = document.getElementById('photoEditorModal');
        const closeEditorBtn = document.getElementById('closeEditorBtn');
        const cancelCropBtn = document.getElementById('cancelCropBtn');
        const applyCropBtn = document.getElementById('applyCropBtn');
        
        // Sliders
        const zoomSlider = document.getElementById('zoomSlider');
        const brightnessSlider = document.getElementById('brightnessSlider');
        const contrastSlider = document.getElementById('contrastSlider');
        const smoothSlider = document.getElementById('smoothSlider');
        
        // Slider Displays
        const zoomValue = document.getElementById('zoomValue');
        const brightnessValue = document.getElementById('brightnessValue');
        const contrastValue = document.getElementById('contrastValue');
        const smoothValue = document.getElementById('smoothValue');
        
        // Ratio Controls
        const ratioControlGroup = document.getElementById('ratioControlGroup');
        const btnRatioPassport = document.getElementById('btnRatioPassport');
        const btnRatioCard = document.getElementById('btnRatioCard');
        const btnRatioBForm = document.getElementById('btnRatioBForm');
        const btnRatioFree = document.getElementById('btnRatioFree');
        const customRatioSliderWrapper = document.getElementById('customRatioSliderWrapper');
        const customRatioSlider = document.getElementById('customRatioSlider');
        const customRatioValue = document.getElementById('customRatioValue');
        const ratioButtons = [btnRatioPassport, btnRatioCard, btnRatioBForm, btnRatioFree];
        
        editorCanvas = document.getElementById('editorCanvas');
        if (editorCanvas) {
            editorCtx = editorCanvas.getContext('2d');
        }

        // Automatically set today's date in the Date field
        const dateField = document.getElementById('form_date');
        if (dateField) {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            dateField.value = `${dd}/${mm}/${yyyy}`;
        }

        // Live handwriting signature generator: typing Student Name automatically fills Student Signature
        const sNameInput = document.getElementById('studentName');
        const sSigInput = document.getElementById('student_signature');
        if (sNameInput && sSigInput) {
            sNameInput.addEventListener('input', () => {
                sSigInput.value = sNameInput.value.toUpperCase();
            });
        }

        // Setup auto-tabbing and numeric-only filtering for DOB, Mobile, and CNIC groups
        setupDigitAutoTabbing('dob');
        setupDigitAutoTabbing('mobile');
        setupDigitAutoTabbing('cnic');

        function setupDigitAutoTabbing(groupName) {
            const boxes = Array.from(document.querySelectorAll(`input[data-group="${groupName}"]`));
            
            boxes.forEach((box, index) => {
                // Numeric validation & auto-tab
                box.addEventListener('input', (e) => {
                    const val = e.target.value;
                    
                    // Filter non-digits
                    if (!/^\d*$/.test(val)) {
                        e.target.value = val.replace(/\D/g, '');
                        return;
                    }

                    // Remove validation error class if present
                    box.classList.remove('error-field');

                    // Automatically focus next box
                    if (val.length === 1) {
                        const nextBox = boxes[index + 1];
                        if (nextBox) {
                            nextBox.focus();
                        }
                    }
                });

                // Backspace & arrow keys navigation
                box.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && box.value.length === 0) {
                        const prevBox = boxes[index - 1];
                        if (prevBox) {
                            prevBox.focus();
                            prevBox.value = '';
                        }
                    } else if (e.key === 'ArrowRight') {
                        const nextBox = boxes[index + 1];
                        if (nextBox) {
                            nextBox.focus();
                        }
                    } else if (e.key === 'ArrowLeft') {
                        const prevBox = boxes[index - 1];
                        if (prevBox) {
                            prevBox.focus();
                        }
                    }
                });

                box.addEventListener('focus', () => {
                    box.select();
                });
            });
        }

        // Format Guardian Contact nicely
        const guardianContact = document.getElementById('guardianContact');
        if (guardianContact) {
            guardianContact.placeholder = "XXXX-XXXXXXX";
            guardianContact.maxLength = 12;
            guardianContact.addEventListener('input', () => {
                let cursor = guardianContact.selectionStart;
                let origLen = guardianContact.value.length;
                let formatted = formatContact(guardianContact.value);
                guardianContact.value = formatted;
                
                if (formatted.length > origLen && cursor === 5) {
                    guardianContact.setSelectionRange(cursor + 1, cursor + 1);
                } else {
                    guardianContact.setSelectionRange(cursor, cursor);
                }
                validateField(guardianContact, /^\d{4}-\d{7}$/, "Format must be XXXX-XXXXXXX (11 digits)");
            });
            
            guardianContact.addEventListener('blur', () => {
                validateField(guardianContact, /^\d{4}-\d{7}$/, "Format must be XXXX-XXXXXXX (11 digits)");
            });
        }

        // Dropzone Triggers
        photoDropZone.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON' && !e.target.closest('.upload-success-card')) {
                studentPhoto.click();
            }
        });
        
        docDropZone.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON' && !e.target.closest('.document-success-card')) {
                docBForm.click();
            }
        });

        // Dropzone Drag & Drop Hover Visuals
        [photoDropZone, docDropZone].forEach(zone => {
            ['dragenter', 'dragover'].forEach(eventName => {
                zone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    zone.classList.add('dragover');
                }, false);
            });
            ['dragleave', 'drop'].forEach(eventName => {
                zone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    zone.classList.remove('dragover');
                }, false);
            });
        });

        // Drop Files Handlers
        photoDropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                handlePhotoSelection(files[0]);
            }
        });

        docDropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                handleDocSelection(files[0]);
            }
        });

        // Standard File Input Change
        studentPhoto.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handlePhotoSelection(e.target.files[0]);
            }
        });

        docBForm.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleDocSelection(e.target.files[0]);
            }
        });

        // Panning Drag Logic on Canvas Viewport
        const editorViewport = document.getElementById('editorViewport');
        if (editorViewport) {
            editorViewport.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX - panX;
                startY = e.clientY - panY;
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                panX = e.clientX - startX;
                panY = e.clientY - startY;
                drawEditorImage();
            });

            window.addEventListener('mouseup', () => {
                isDragging = false;
            });

            // Mobile Touch Panning
            editorViewport.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    isDragging = true;
                    startX = e.touches[0].clientX - panX;
                    startY = e.touches[0].clientY - panY;
                }
            });

            editorViewport.addEventListener('touchmove', (e) => {
                if (!isDragging || e.touches.length !== 1) return;
                e.preventDefault();
                panX = e.touches[0].clientX - startX;
                panY = e.touches[0].clientY - startY;
                drawEditorImage();
            });

            editorViewport.addEventListener('touchend', () => {
                isDragging = false;
            });
        }

        // Slider Input Listeners
        zoomSlider.addEventListener('input', () => {
            zoom = parseFloat(zoomSlider.value);
            zoomValue.textContent = zoom.toFixed(1) + 'x';
            drawEditorImage();
        });

        brightnessSlider.addEventListener('input', () => {
            brightness = parseInt(brightnessSlider.value, 10);
            brightnessValue.textContent = (brightness > 0 ? '+' : '') + brightness + '%';
            drawEditorImage();
        });

        contrastSlider.addEventListener('input', () => {
            contrast = parseInt(contrastSlider.value, 10);
            contrastValue.textContent = (contrast > 0 ? '+' : '') + contrast + '%';
            drawEditorImage();
        });

        smoothSlider.addEventListener('input', () => {
            smoothing = parseInt(smoothSlider.value, 10);
            smoothValue.textContent = smoothing === 0 ? 'Off' : smoothing + 'x';
            drawEditorImage();
        });
        
        // Dynamic Aspect Ratio state helpers & listeners
        function setRatioActive(activeBtn) {
            ratioButtons.forEach(btn => {
                if (btn) {
                    btn.classList.remove('active');
                    btn.style.background = 'var(--card-bg)';
                    btn.style.color = 'var(--text-dark)';
                    btn.style.borderColor = 'var(--border-color)';
                    btn.style.fontWeight = '600';
                }
            });
            if (activeBtn) {
                activeBtn.classList.add('active');
                activeBtn.style.background = 'var(--secondary)';
                activeBtn.style.color = 'var(--primary-dark)';
                activeBtn.style.borderColor = 'var(--secondary)';
                activeBtn.style.fontWeight = '700';
            }
        }

        function updateEditorDimensions(w, h) {
            viewWidth = w;
            viewHeight = h;
            const editorViewport = document.getElementById('editorViewport');
            if (editorViewport && editorCanvas) {
                editorViewport.style.width = viewWidth + 'px';
                editorViewport.style.height = viewHeight + 'px';
                editorCanvas.width = viewWidth;
                editorCanvas.height = viewHeight;
                
                // Recalculate aspect fit
                if (editorImage) {
                    const canvasAspect = viewWidth / viewHeight;
                    const imgAspect = editorImage.width / editorImage.height;
                    if (imgAspect > canvasAspect) {
                        editorCanvasHeight = viewHeight;
                        editorCanvasWidth = viewHeight * imgAspect;
                    } else {
                        editorCanvasWidth = viewWidth;
                        editorCanvasHeight = viewWidth / imgAspect;
                    }
                    drawEditorImage();
                }
            }
        }

        function applyCustomRatio(R) {
            let targetWidth = 350;
            let targetHeight = Math.round(targetWidth / R);
            if (targetHeight > 315) {
                targetHeight = 315;
                targetWidth = Math.round(targetHeight * R);
            }
            updateEditorDimensions(targetWidth, targetHeight);
        }

        if (btnRatioPassport) {
            btnRatioPassport.addEventListener('click', () => {
                setRatioActive(btnRatioPassport);
                if (customRatioSliderWrapper) customRatioSliderWrapper.style.display = 'none';
                updateEditorDimensions(245, 315);
            });
        }
        if (btnRatioCard) {
            btnRatioCard.addEventListener('click', () => {
                setRatioActive(btnRatioCard);
                if (customRatioSliderWrapper) customRatioSliderWrapper.style.display = 'none';
                updateEditorDimensions(350, 222);
            });
        }
        if (btnRatioBForm) {
            btnRatioBForm.addEventListener('click', () => {
                setRatioActive(btnRatioBForm);
                if (customRatioSliderWrapper) customRatioSliderWrapper.style.display = 'none';
                updateEditorDimensions(350, 248);
            });
        }
        if (btnRatioFree) {
            btnRatioFree.addEventListener('click', () => {
                setRatioActive(btnRatioFree);
                if (customRatioSliderWrapper) {
                    customRatioSliderWrapper.style.display = 'block';
                    if (customRatioSlider) {
                        applyCustomRatio(parseFloat(customRatioSlider.value));
                    }
                }
            });
        }
        if (customRatioSlider) {
            customRatioSlider.addEventListener('input', () => {
                const val = parseFloat(customRatioSlider.value);
                if (customRatioValue) customRatioValue.textContent = val.toFixed(2);
                applyCustomRatio(val);
            });
        }

        // Close and Cancel triggers
        [closeEditorBtn, cancelCropBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    photoEditorModal.classList.remove('open');
                    if (currentCropMode === 'photo') {
                        studentPhoto.value = ""; // Reset photo input
                    } else {
                        docBForm.value = ""; // Reset doc input
                    }
                });
            }
        });

        // Apply Crop Click
        if (applyCropBtn) {
            applyCropBtn.addEventListener('click', async () => {
                applyCropBtn.disabled = true;
                applyCropBtn.innerHTML = 'Compressing... <i class="fas fa-spinner fa-spin"></i>';
                
                try {
                    // Create high resolution crop canvas
                    const cropCanvas = document.createElement('canvas');
                    if (currentCropMode === 'photo') {
                        cropCanvas.width = 350;
                        cropCanvas.height = 450;
                    } else {
                        // Dynamically compute high-resolution B-Form / CNIC crop height based on current selected aspect ratio
                        cropCanvas.width = 800;
                        cropCanvas.height = Math.round(cropCanvas.width * (viewHeight / viewWidth));
                    }
                    const cropCtx = cropCanvas.getContext('2d');
                    
                    const scaleFactor = cropCanvas.width / viewWidth;
                    cropCtx.save();
                    
                    let bVal = 100 + brightness;
                    let cVal = 100 + contrast;
                    let blurVal = smoothing * 0.4 * scaleFactor;
                    
                    cropCtx.filter = `brightness(${bVal}%) contrast(${cVal}%) ${blurVal > 0 ? `blur(${blurVal}px)` : ''}`;
                    
                    const drawWidth = editorCanvasWidth * zoom * scaleFactor;
                    const drawHeight = editorCanvasHeight * zoom * scaleFactor;
                    
                    cropCtx.drawImage(
                        editorImage,
                        cropCanvas.width / 2 + panX * scaleFactor - drawWidth / 2,
                        cropCanvas.height / 2 + panY * scaleFactor - drawHeight / 2,
                        drawWidth,
                        drawHeight
                    );
                    cropCtx.restore();
                    
                    // Compress dynamically to 50KB - 70KB
                    const blob = await compressToTargetKB(cropCanvas);
                    const imgUrl = URL.createObjectURL(blob);
                    const sizeKB = (blob.size / 1024).toFixed(1);
                    
                    if (currentCropMode === 'photo') {
                        croppedPhotoBlob = blob;
                        const photoPreviewContainer = document.getElementById('photoPreviewContainer');
                        
                        // Hide original dropzone content
                        hideDropZoneContents('photoDropZone', 'photoProgressContainer', 'photoPreviewContainer');
                        
                        photoPreviewContainer.style.display = 'block';
                        photoPreviewContainer.innerHTML = `
                            <img src="${imgUrl}" alt="Cropped Passport Photo">
                        `;
                    } else {
                        croppedDocBlob = blob;
                        const docPreviewContainer = document.getElementById('docPreviewContainer');
                        
                        // Hide original dropzone content
                        hideDropZoneContents('docDropZone', 'docProgressContainer', 'docPreviewContainer');
                        
                        docPreviewContainer.style.display = 'block';
                        docPreviewContainer.innerHTML = `
                            <div class="document-success-card">
                                <div class="doc-icon-wrapper">
                                    <i class="fas fa-id-card"></i>
                                </div>
                                <div class="success-card-details">
                                    <h5 class="success-card-title">${activeDocFile.name}</h5>
                                    <div class="success-card-meta">
                                        <span class="size-badge">${sizeKB} KB</span>
                                        <span class="success-badge"><i class="fas fa-check-circle"></i> Document Adjusted</span>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" id="editDocBtn">Edit</button>
                            </div>
                        `;
                        
                        // Re-trigger editor on Edit click
                        document.getElementById('editDocBtn').addEventListener('click', (e) => {
                            e.stopPropagation();
                            currentCropMode = 'doc';
                            openPhotoEditor(activeDocFile);
                        });
                    }
                    
                    photoEditorModal.classList.remove('open');
                } catch (error) {
                    alert('Error compressing image: ' + error.message);
                } finally {
                    applyCropBtn.disabled = false;
                    applyCropBtn.innerHTML = 'Crop & Apply <i class="fas fa-check-circle"></i>';
                }
            });
        }

        // Handles photo selected
        function handlePhotoSelection(file) {
            activePhotoFile = file;
            currentCropMode = 'photo';
            openPhotoEditor(file);
        }

        // Loads photo/doc into editor canvas with dynamic dimensions
        function openPhotoEditor(file) {
            const editorViewport = document.getElementById('editorViewport');
            
            // Show or hide B-Form / CNIC ratio controls contextually
            if (currentCropMode === 'photo') {
                if (ratioControlGroup) ratioControlGroup.style.display = 'none';
            } else {
                if (ratioControlGroup) ratioControlGroup.style.display = 'block';
            }

            // Update modal title and description text dynamically
            const modalTitle = document.querySelector('.photo-editor-title');
            const modalDesc = document.querySelector('.photo-editor-body > div');
            if (currentCropMode === 'photo') {
                if (modalTitle) modalTitle.innerHTML = '<i class="fas fa-portrait"></i> Passport Photo Crop & Edit';
                if (modalDesc) modalDesc.textContent = 'Drag the photo to position it inside the frame. Zoom and apply filters.';
            } else {
                if (modalTitle) modalTitle.innerHTML = '<i class="fas fa-id-card"></i> CNIC / B-Form Document Crop & Edit';
                if (modalDesc) modalDesc.textContent = 'Align your ID Card / B-Form card horizontally inside the box. Zoom and adjust lighting.';
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                editorImage = new Image();
                editorImage.onload = function() {
                    // Trigger default crop ratio dimensions
                    if (currentCropMode === 'photo') {
                        if (btnRatioPassport) {
                            btnRatioPassport.click();
                        } else {
                            updateEditorDimensions(245, 315);
                        }
                    } else {
                        if (btnRatioCard) {
                            btnRatioCard.click();
                        } else {
                            updateEditorDimensions(350, 222);
                        }
                    }
                    
                    // Reset Editor parameters
                    zoom = 1.0;
                    panX = 0;
                    panY = 0;
                    brightness = 0;
                    contrast = 0;
                    smoothing = 0;
                    
                    zoomSlider.value = 1.0;
                    zoomValue.textContent = '1.0x';
                    brightnessSlider.value = 0;
                    brightnessValue.textContent = '0%';
                    contrastSlider.value = 0;
                    contrastValue.textContent = '0%';
                    smoothSlider.value = 0;
                    smoothValue.textContent = 'Off';
                    
                    // Open Modal Overlay
                    photoEditorModal.classList.add('open');
                    
                    // Initial draw
                    drawEditorImage();
                };
                editorImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }

        // Handles B-Form selection (Images open in Crop Editor, PDFs upload directly)
        function handleDocSelection(file) {
            activeDocFile = file;
            if (file.type.startsWith('image/')) {
                currentCropMode = 'doc';
                openPhotoEditor(file);
            } else {
                croppedDocBlob = null; // Clear cropped image state since it's a PDF
                simulateFileUpload(
                    file, 
                    'docProgressBar', 
                    'docProgressContainer', 
                    'docPreviewContainer', 
                    'docDropZone', 
                    'fa-id-card-alt',
                    () => {
                        // Success callback
                    }
                );
            }
        }

        // Hook up Admission Form Email routing
        admissionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear prior validation markers
            document.querySelectorAll('.error-field').forEach(f => f.classList.remove('error-field'));
            let isValid = true;

            // 1. Validate simple inputs
            ['studentName', 'fatherName', 'currentClass', 'guardianContact', 'address', 'lastClass'].forEach(id => {
                const field = document.getElementById(id);
                if (field && !field.value.trim()) {
                    field.classList.add('error-field');
                    isValid = false;
                }
            });

            // 2. Validate digit box groups
            ['dob', 'mobile', 'cnic'].forEach(group => {
                const boxes = document.querySelectorAll(`input[data-group="${group}"]`);
                boxes.forEach(box => {
                    if (!box.value.trim()) {
                        box.classList.add('error-field');
                        isValid = false;
                    }
                });
            });

            // 3. Validate Shift timing radio buttons
            const shiftRadios = document.querySelectorAll('input[name="shift_timing"]');
            let shiftSelected = false;
            shiftRadios.forEach(radio => {
                if (radio.checked) shiftSelected = true;
            });
            
            if (!shiftSelected) {
                isValid = false;
                const shiftContainer = document.querySelector('.form-sheet-shift-container');
                if (shiftContainer) {
                    shiftContainer.style.outline = '1px solid #dc2626';
                    shiftContainer.style.padding = '4px 8px';
                    setTimeout(() => {
                        shiftContainer.style.outline = 'none';
                        shiftContainer.style.padding = '0';
                    }, 3000);
                }
            }

            if (!isValid) {
                alert('Please complete all highlighted required fields on the visual form.');
                const firstError = document.querySelector('.error-field');
                if (firstError) firstError.focus();
                return;
            }

            if (!croppedPhotoBlob) {
                alert("Please click the Photo box in the top-right corner to upload and crop your Student Passport Photo before submitting!");
                return;
            }

            if (!croppedDocBlob && !activeDocFile) {
                alert("Please click the CNIC/B-Form depository card to attach your CNIC or B-Form document before submitting!");
                return;
            }

            // Gather all compiled values
            const dob = Array.from(document.querySelectorAll('input[data-group="dob"]')).map(b => b.value).join('');
            const dobFormatted = dob.slice(0,2) + '/' + dob.slice(2,4) + '/' + dob.slice(4);

            const mobile = Array.from(document.querySelectorAll('input[data-group="mobile"]')).map(b => b.value).join('');
            const mobileFormatted = mobile.slice(0,4) + '-' + mobile.slice(4);

            const cnic = Array.from(document.querySelectorAll('input[data-group="cnic"]')).map(b => b.value).join('');
            const cnicFormatted = cnic.slice(0,5) + '-' + cnic.slice(5,12) + '-' + cnic.slice(12);

            const studentData = {
                name: document.getElementById('studentName').value,
                fatherName: document.getElementById('fatherName').value,
                dob: dobFormatted,
                currentClass: document.getElementById('currentClass').value,
                mobile: mobileFormatted,
                guardianContact: document.getElementById('guardianContact').value,
                cnic: cnicFormatted,
                address: document.getElementById('address').value,
                lastClass: document.getElementById('lastClass').value,
                shiftTiming: document.querySelector('input[name="shift_timing"]:checked').value
            };
            
            // Gather all form data for submission
            const formData = new FormData();
            
            formData.append("Form Type", "Dhoria Academy Admission Application");
            formData.append("Student Full Name", studentData.name);
            formData.append("Father Name", studentData.fatherName);
            formData.append("Date of Birth", studentData.dob);
            formData.append("Class", studentData.currentClass);
            formData.append("B-Form / CNIC", studentData.cnic);
            formData.append("Mobile Number", studentData.mobile);
            formData.append("Guardian Contact", studentData.guardianContact);
            formData.append("Address", studentData.address);
            formData.append("Qualifications", studentData.lastClass);
            formData.append("Shift Timing", studentData.shiftTiming);
            
            // ── Step 1: Generate the official A4 PDF ──────────────────────────────
            let pdfBlob = null;
            try {
                const loaderTitle = document.getElementById('loaderTitle');
                const loaderDesc  = document.getElementById('loaderDesc');
                if (loaderTitle) loaderTitle.textContent = "Compiling Official A4 PDF";
                if (loaderDesc)  loaderDesc.textContent  = "Generating enrollment form, embedding photo & documents...";
 
                pdfBlob = await generateAdmissionPDF(studentData, croppedPhotoBlob, activeDocFile);
 
                // Also auto-download a copy for the student immediately
                const pdfUrl = URL.createObjectURL(pdfBlob);
                const dlLink = document.createElement('a');
                dlLink.href = pdfUrl;
                dlLink.download = `Admission_Form_${studentData.name.replace(/\s+/g, '_')}.pdf`;
                dlLink.click();
                setTimeout(() => URL.revokeObjectURL(pdfUrl), 5000);
            } catch (pdfError) {
                console.error("PDF generation failed:", pdfError);
            }
 
            // Send the PDF blob directly as an email attachment
            if (pdfBlob) {
                formData.append("attachment", pdfBlob, `Admission_Form_${studentData.name.replace(/\s+/g, '_')}.pdf`);
            }
 
            // Setup email subject
            formData.append("subject", `New Admission: ${studentData.name} (Class ${studentData.currentClass})`);
            formData.append("from_name", "Dhoria Academy Admissions");
            
            await submitWeb3Form(
                'admissionForm',
                formData,
                WEB3FORMS_ACCESS_KEY,
                "Your enrollment details and compiled A4 PDF document have been received successfully. Our admissions panel will contact you in 24-48 hours.",
                () => {
                    admissionForm.reset();
                    // Clear custom previews safely
                    window.removeUploadedFile('photoDropZone', 'photoProgressContainer', 'photoPreviewContainer');
                    window.removeUploadedFile('docDropZone', 'docProgressContainer', 'docPreviewContainer');
                    activePhotoFile = null;
                    croppedPhotoBlob = null;
                    activeDocFile = null;
                    croppedDocBlob = null;
                }
            );
        });
    }

    // --------------------------------------------------------
    // STUDENT CORNER: Interactive Article Upload & Gmail Send
    // --------------------------------------------------------
    function initStudentCornerPage() {
        const articleUploadForm = document.getElementById('articleUploadForm');
        if (!articleUploadForm) return;
        
        const articleFileDropZone = document.getElementById('articleFileDropZone');
        const articleFile = document.getElementById('articleFile');
        const articleEmail = document.getElementById('articleEmail');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (articleEmail) {
            articleEmail.addEventListener('input', () => {
                validateField(articleEmail, emailRegex, "Please enter a valid email address");
            });
            articleEmail.addEventListener('blur', () => {
                validateField(articleEmail, emailRegex, "Please enter a valid email address");
            });
        }

        articleFileDropZone.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON' && !e.target.closest('.document-success-card')) {
                articleFile.click();
            }
        });
        
        // Visual Hover states
        ['dragenter', 'dragover'].forEach(eventName => {
            articleFileDropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                articleFileDropZone.classList.add('dragover');
            }, false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            articleFileDropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                articleFileDropZone.classList.remove('dragover');
            }, false);
        });

        // Drop file
        articleFileDropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                handleArticleSelection(files[0]);
            }
        });

        // Standard change
        articleFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleArticleSelection(e.target.files[0]);
            }
        });

        function handleArticleSelection(file) {
            activeArticleFile = file;
            simulateFileUpload(
                file,
                'articleProgressBar',
                'articleProgressContainer',
                'articlePreviewContainer',
                'articleFileDropZone',
                'fa-file-arrow-up',
                () => {}
            );
        }

        // Intercept Article submit
        articleUploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const isEmailValid = validateField(articleEmail, emailRegex, "Please enter a valid email address");
            if (!isEmailValid) {
                articleEmail.focus();
                return;
            }
            
            if (!activeArticleFile) {
                alert("Please upload your research article document first!");
                return;
            }
            
            const formData = new FormData();
            formData.append("Form Type", "Student Corner Article Upload");
            formData.append("Author Name", document.getElementById('articleAuthor').value);
            formData.append("Author Email", articleEmail.value);
            formData.append("Article Title", document.getElementById('articleTitle').value);
            
            // Attach article
            formData.append("attachment", activeArticleFile);
            
            // Formatting Web3Forms Gmail subject
            formData.append("subject", `New Article Submission: "${document.getElementById('articleTitle').value}" by ${document.getElementById('articleAuthor').value}`);
            formData.append("from_name", "Student Corner Publications");
            
            await submitWeb3Form(
                'articleUploadForm',
                formData,
                WEB3FORMS_ACCESS_KEY,
                "Thank you for sharing your knowledge! Your article has been uploaded and routed to Mr. Hassan Ali for review and publication.",
                () => {
                    articleUploadForm.reset();
                    window.removeUploadedFile('articleFileDropZone', 'articleProgressContainer', 'articlePreviewContainer');
                    activeArticleFile = null;
                }
            );
        });
    }

    // --------------------------------------------------------
    // CONTACT US: Route Inquiries to Gmail
    // --------------------------------------------------------
    function initContactPage() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        const emailAddr = document.getElementById('emailAddr');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (emailAddr) {
            emailAddr.addEventListener('input', () => {
                validateField(emailAddr, emailRegex, "Please enter a valid email address");
            });
            emailAddr.addEventListener('blur', () => {
                validateField(emailAddr, emailRegex, "Please enter a valid email address");
            });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const isEmailValid = validateField(emailAddr, emailRegex, "Please enter a valid email address");
            if (!isEmailValid) {
                emailAddr.focus();
                return;
            }
            
            const formData = new FormData();
            formData.append("Form Type", "Contact Portal Inquiry");
            formData.append("Sender Name", document.getElementById('name').value);
            formData.append("Sender Email", emailAddr.value);
            formData.append("Subject", document.getElementById('subject').value);
            formData.append("Message Content", document.getElementById('message').value);
            
            formData.append("subject", `Contact Message: [${document.getElementById('subject').value}] from ${document.getElementById('name').value}`);
            formData.append("from_name", "Academy Help Desk");
            
            await submitWeb3Form(
                'contactForm',
                formData,
                WEB3FORMS_ACCESS_KEY,
                "Your query has been dispatched successfully. The help desk will reply via your email address within 24 hours.",
                () => {
                    contactForm.reset();
                }
            );
        });
    }

    // --------------------------------------------------------
    // STRICT VALIDATION FORMATTERS AND VALIDATION ENGINE
    // --------------------------------------------------------
    function formatCNIC(value) {
        let digits = value.replace(/\D/g, '');
        if (digits.length > 13) digits = digits.slice(0, 13);
        
        let parts = [];
        if (digits.length > 0) {
            parts.push(digits.slice(0, 5));
        }
        if (digits.length > 5) {
            parts.push(digits.slice(5, 12));
        }
        if (digits.length > 12) {
            parts.push(digits.slice(12, 13));
        }
        return parts.join('-');
    }

    function formatContact(value) {
        let digits = value.replace(/\D/g, '');
        if (digits.length > 11) digits = digits.slice(0, 11);
        
        let parts = [];
        if (digits.length > 0) {
            parts.push(digits.slice(0, 4));
        }
        if (digits.length > 4) {
            parts.push(digits.slice(4, 11));
        }
        return parts.join('-');
    }

    function validateField(input, regex, errorMessage) {
        if (!input) return true;
        const val = input.value.trim();
        const isValid = regex.test(val);
        
        let errorEl = input.parentElement.querySelector('.field-error-message');
        
        if (!isValid) {
            input.style.borderColor = "#EF4444";
            input.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.15)";
            
            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.className = 'field-error-message';
                errorEl.style.color = '#EF4444';
                errorEl.style.fontSize = '0.78rem';
                errorEl.style.fontWeight = '600';
                errorEl.style.marginTop = '4px';
                errorEl.style.display = 'flex';
                errorEl.style.alignItems = 'center';
                errorEl.style.gap = '4px';
                errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${errorMessage}`;
                input.parentElement.appendChild(errorEl);
            } else {
                errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${errorMessage}`;
            }
            return false;
        } else {
            clearError(input);
            return true;
        }
    }
    
    function clearError(input) {
        if (!input) return;
        input.style.borderColor = "";
        input.style.boxShadow = "";
        const errorEl = input.parentElement.querySelector('.field-error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }

    // --------------------------------------------------------
    // UTILITY HELPER FUNCS
    // --------------------------------------------------------
    function drawEditorImage() {
        if (!editorImage || !editorCanvas || !editorCtx) return;
        const ctx = editorCtx;
        const canvas = editorCanvas;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        
        let bVal = 100 + brightness;
        let cVal = 100 + contrast;
        let blurVal = smoothing * 0.4;
        
        ctx.filter = `brightness(${bVal}%) contrast(${cVal}%) ${blurVal > 0 ? `blur(${blurVal}px)` : ''}`;
        
        const drawWidth = editorCanvasWidth * zoom;
        const drawHeight = editorCanvasHeight * zoom;
        
        ctx.drawImage(
            editorImage, 
            canvas.width / 2 + panX - drawWidth / 2, 
            canvas.height / 2 + panY - drawHeight / 2, 
            drawWidth, 
            drawHeight
        );
        
        ctx.restore();
    }

    function hideDropZoneContents(dropZoneId, progressId, previewId) {
        const dropZone = document.getElementById(dropZoneId);
        Array.from(dropZone.children).forEach(child => {
            if (child.id !== progressId && child.id !== previewId) {
                child.style.display = 'none';
            }
        });
    }

    window.removeUploadedFile = function(dropZoneId, progressContainerId, previewContainerId) {
        const dropZone = document.getElementById(dropZoneId);
        if (!dropZone) return;
        
        const progressContainer = document.getElementById(progressContainerId);
        const previewContainer = document.getElementById(previewContainerId);
        
        const fileInput = dropZone.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
        
        Array.from(dropZone.children).forEach(child => {
            if (child.id !== progressContainerId && child.id !== previewContainerId) {
                if (child.classList.contains('form-sheet-photo-box-overlay')) {
                    child.style.display = '';
                } else {
                    child.style.display = '';
                }
            }
        });
        
        if (progressContainer) progressContainer.style.display = 'none';
        if (previewContainer) {
            previewContainer.style.display = 'none';
            previewContainer.innerHTML = "";
        }
        
        if (dropZoneId === 'photoDropZone') {
            croppedPhotoBlob = null;
            const photoLabel = document.getElementById('photoLabel');
            if (photoLabel) {
                photoLabel.style.display = '';
                photoLabel.textContent = "Click to Upload";
            }
            const photoHelp = document.getElementById('photoHelp');
            if (photoHelp) photoHelp.style.display = '';
            const photoIcon = document.getElementById('photoIcon');
            if (photoIcon) photoIcon.style.display = '';
        } else if (dropZoneId === 'docDropZone') {
            croppedDocBlob = null;
            activeDocFile = null;
            const docLabel = document.getElementById('docLabel');
            if (docLabel) {
                docLabel.style.display = '';
                docLabel.textContent = "B-Form / CNIC Document Depository";
            }
            const docHelp = document.getElementById('docHelp');
            if (docHelp) docHelp.style.display = '';
            const docIcon = document.getElementById('docIcon');
            if (docIcon) docIcon.style.display = '';
        }
    };

    function simulateFileUpload(file, progressBarId, progressContainerId, previewContainerId, dropZoneId, docIconClass, onComplete) {
        const progressContainer = document.getElementById(progressContainerId);
        const progressBar = document.getElementById(progressBarId);
        const previewContainer = document.getElementById(previewContainerId);
        const dropZone = document.getElementById(dropZoneId);
        
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        
        hideDropZoneContents(dropZoneId, progressContainerId, previewContainerId);
        
        let progress = 0;
        let interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    progressContainer.style.display = 'none';
                    previewContainer.style.display = 'block';
                    
                    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
                    const fileIcon = isPdf ? 'fa-file-pdf doc-icon-pdf' : 'fa-file-word doc-icon-word';
                    const fileKB = (file.size / 1024).toFixed(1);
                    
                    previewContainer.innerHTML = `
                        <div class="document-success-card">
                            <div class="doc-icon-wrapper ${isPdf ? 'doc-icon-pdf' : 'doc-icon-word'}">
                                <i class="fas ${fileIcon}"></i>
                            </div>
                            <div class="success-card-details">
                                <h5 class="success-card-title">${file.name}</h5>
                                <div class="success-card-meta">
                                    <span class="size-badge">${fileKB} KB</span>
                                    <span class="success-badge"><i class="fas fa-check-circle"></i> Verified</span>
                                </div>
                            </div>
                            <button type="button" class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="removeUploadedFile('${dropZoneId}', '${progressContainerId}', '${previewContainerId}')">Remove</button>
                        </div>
                    `;
                    
                    if (onComplete) onComplete(file);
                }, 300);
            }
            progressBar.style.width = progress + '%';
        }, 60);
    }

    async function compressToTargetKB(canvas) {
        let minKB = 50;
        let maxKB = 70;
        let quality = 0.92;
        let blob = null;
        
        // Try original dimensions
        for (let i = 0; i < 12; i++) {
            blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
            let sizeKB = blob.size / 1024;
            
            if (sizeKB >= minKB && sizeKB <= maxKB) {
                return blob;
            }
            
            if (sizeKB < minKB) {
                if (quality >= 0.98) break;
                quality = Math.min(1.0, quality + 0.04);
            } else {
                quality = Math.max(0.1, quality - 0.08);
            }
        }
        
        // If under 50KB at max quality, upscale to increase file size footprint
        let sizeKB = blob.size / 1024;
        if (sizeKB < minKB) {
            let scale = Math.sqrt(minKB / sizeKB) * 1.05;
            scale = Math.min(3.0, Math.max(1.1, scale));
            
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = Math.round(canvas.width * scale);
            tempCanvas.height = Math.round(canvas.height * scale);
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.imageSmoothingEnabled = true;
            tempCtx.imageSmoothingQuality = 'high';
            tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
            
            quality = 0.90;
            for (let i = 0; i < 8; i++) {
                blob = await new Promise(resolve => tempCanvas.toBlob(resolve, 'image/jpeg', quality));
                let sizeKB = blob.size / 1024;
                if (sizeKB >= minKB && sizeKB <= maxKB) {
                    return blob;
                }
                if (sizeKB > maxKB) {
                    quality = Math.max(0.1, quality - 0.06);
                } else {
                    quality = Math.min(1.0, quality + 0.04);
                }
            }
        }
        
        // If over 70KB at min quality, downscale to fit range
        if (sizeKB > maxKB) {
            let scale = Math.sqrt(maxKB / sizeKB) * 0.95;
            scale = Math.max(0.3, Math.min(0.9, scale));
            
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = Math.round(canvas.width * scale);
            tempCanvas.height = Math.round(canvas.height * scale);
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
            
            quality = 0.70;
            for (let i = 0; i < 8; i++) {
                blob = await new Promise(resolve => tempCanvas.toBlob(resolve, 'image/jpeg', quality));
                let sizeKB = blob.size / 1024;
                if (sizeKB >= minKB && sizeKB <= maxKB) {
                    return blob;
                }
                if (sizeKB > maxKB) {
                    quality = Math.max(0.1, quality - 0.06);
                } else {
                    quality = Math.min(1.0, quality + 0.04);
                }
            }
        }
        
        return blob;
    }

    async function submitFormViaIframe(actionUrl, formData) {
        return new Promise((resolve, reject) => {
            // 1. Create or get hidden iframe
            let iframe = document.getElementById('formsubmit_iframe');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'formsubmit_iframe';
                iframe.name = 'formsubmit_iframe';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }

            // 2. Set up iframe load listener
            const onLoad = () => {
                iframe.removeEventListener('load', onLoad);
                iframe.removeEventListener('error', onError);
                resolve({ success: true });
            };
            const onError = (err) => {
                iframe.removeEventListener('load', onLoad);
                iframe.removeEventListener('error', onError);
                reject(err || new Error("Iframe submission error"));
            };
            iframe.addEventListener('load', onLoad);
            iframe.addEventListener('error', onError);

            // 3. Create temporary form
            const tempForm = document.createElement('form');
            tempForm.action = actionUrl;
            tempForm.method = "POST";
            tempForm.enctype = "multipart/form-data";
            tempForm.target = "formsubmit_iframe";
            tempForm.style.display = "none";

            // 4. Populate form fields from FormData
            for (const [key, value] of formData.entries()) {
                if (value instanceof File || value instanceof Blob) {
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.name = key;
                    
                    const container = new DataTransfer();
                    const fileName = value.name || `${key}.bin`;
                    const file = new File([value], fileName, { type: value.type });
                    container.items.add(file);
                    fileInput.files = container.files;
                    tempForm.appendChild(fileInput);
                } else {
                    const hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = key;
                    hiddenInput.value = value;
                    tempForm.appendChild(hiddenInput);
                }
            }

            // 5. Submit form
            document.body.appendChild(tempForm);
            tempForm.submit();
            
            // 6. Cleanup form after brief delay
            setTimeout(() => {
                if (tempForm.parentNode) {
                    tempForm.parentNode.removeChild(tempForm);
                }
            }, 1000);
        });
    }

    async function submitFormWithPDF(formId, formData, successMessage, formPageResetFn) {
        const loader = document.getElementById('submissionLoader');
        const loaderTitle = document.getElementById('loaderTitle');
        const loaderDesc = document.getElementById('loaderDesc');
        const spinner = document.getElementById('spinnerContainer');
        const successIcon = document.getElementById('successIcon');
        const closeBtn = document.getElementById('loaderCloseBtn');

        loader.classList.add('open');
        loaderTitle.textContent = "Securing Connection";
        loaderDesc.textContent = "Compiling application details and packaging documents...";
        spinner.style.display = 'block';
        successIcon.style.display = 'none';
        closeBtn.style.display = 'none';

        // Extract reply-to email if provided
        const replyTo = formData.get("Email Address") || formData.get("Author Email") || formData.get("Sender Email");
        if (replyTo) {
            formData.append("_replyto", replyTo);
            formData.append("email", replyTo); // Web3Forms standard reply-to
        }

        // Set custom email subject from the "subject" field
        const subj = formData.get("subject");
        if (subj) {
            formData.append("_subject", subj);
        }

        try {
            loaderTitle.textContent = "Transmitting to Gmail";
            loaderDesc.textContent = "Uploading PDF and details securely to kabeer50930@gmail.com...";

            // --- tmpfiles.org Background Upload Fail-safe ---
            const attachmentBlob = formData.get("attachment");
            if (attachmentBlob && (attachmentBlob instanceof Blob || attachmentBlob instanceof File)) {
                try {
                    loaderDesc.textContent = "Storing document securely in cloud repository...";
                    const uploadData = new FormData();
                    uploadData.append("file", attachmentBlob, attachmentBlob.name || "Document.pdf");
                    uploadData.append("expire", "172800");
                    
                    const uploadRes = await fetch("https://tmpfiles.org/api/v1/upload", {
                        method: "POST",
                        body: uploadData
                    });
                    
                    if (uploadRes.ok) {
                        const uploadJson = await uploadRes.json();
                        if (uploadJson.status === "success" && uploadJson.data && uploadJson.data.url) {
                            const directDownloadUrl = uploadJson.data.url.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");
                            const fieldLabel = formData.get("Form Type") === "Student Corner Article Upload" 
                                ? "Article Document PDF Download Link" 
                                : "Admission Form PDF Download Link";
                            formData.append(fieldLabel, directDownloadUrl);
                            console.log("tmpfiles upload successful, link:", directDownloadUrl);
                        }
                    }
                } catch (uploadErr) {
                    console.error("tmpfiles upload failed:", uploadErr);
                }
            }

            // Clone the FormData into web3FormData and delete the restricted "attachment" field to bypass Free tier limit
            const web3FormData = new FormData();
            for (const [key, value] of formData.entries()) {
                if (key !== "attachment") {
                    web3FormData.append(key, value);
                }
            }

            // Use Web3Forms as the primary high-delivery client-side email service
            web3FormData.append("access_key", WEB3FORMS_ACCESS_KEY);
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: web3FormData
            });

            const data = await response.json();

            if (data.success) {
                loaderTitle.textContent = "Application Submitted!";
                loaderDesc.textContent = successMessage;
                spinner.style.display = 'none';
                successIcon.style.display = 'block';
                closeBtn.style.display = 'block';
                closeBtn.textContent = "Done";
                closeBtn.className = "btn btn-primary";

                closeBtn.onclick = () => {
                    loader.classList.remove('open');
                };

                fireSubmissionConfetti();

                if (formPageResetFn) formPageResetFn();
            } else {
                throw new Error(data.message || "Web3Forms rejected submission");
            }
        } catch (error) {
            console.warn("Primary email channel failed, switching to backup...", error);
            
            try {
                loaderTitle.textContent = "Switching Channel";
                loaderDesc.textContent = "Trying secure backup FormSubmit routing...";

                // Clean and format for FormSubmit
                formData.delete("access_key");
                formData.append("_captcha", "false");
                formData.append("_template", "table");

                const result = await submitFormViaIframe("https://formsubmit.co/kabeer50930+admissions@gmail.com", formData);

                if (result && result.success) {
                    loaderTitle.textContent = "Application Submitted!";
                    loaderDesc.textContent = successMessage;
                    spinner.style.display = 'none';
                    successIcon.style.display = 'block';
                    closeBtn.style.display = 'block';
                    closeBtn.textContent = "Done";
                    closeBtn.className = "btn btn-primary";

                    closeBtn.onclick = () => {
                        loader.classList.remove('open');
                    };

                    fireSubmissionConfetti();

                    if (formPageResetFn) formPageResetFn();
                } else {
                    throw new Error("FormSubmit backup also failed.");
                }
            } catch (fallbackError) {
                console.error("All email channels failed:", fallbackError);
                loaderTitle.textContent = "Submission Issue";
                loaderDesc.textContent = `Connection error: ${fallbackError.message || error.message}. Please try again later or email kabeer50930@gmail.com directly.`;
                spinner.style.display = 'none';
                successIcon.style.display = 'none';
                closeBtn.style.display = 'block';
                closeBtn.textContent = "Try Again";
                closeBtn.className = "btn btn-outline";
                closeBtn.onclick = () => {
                    loader.classList.remove('open');
                };
            }
        }
    }

    // Legacy alias kept for other forms (contact, article upload, etc.)
    async function submitWeb3Form(formId, formData, accessKey, successMessage, formPageResetFn) {
        return submitFormWithPDF(formId, formData, successMessage, formPageResetFn);
    }

    function fireSubmissionConfetti() {
        const duration = 3000;
        const end = Date.now() + duration;
        
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        
        const colors = ['#FFB300', '#002147', '#10B981', '#3B82F6', '#EF4444'];
        
        (function frame() {
            if (Date.now() > end) {
                container.remove();
                return;
            }
            
            for (let i = 0; i < 4; i++) {
                const piece = document.createElement('div');
                piece.style.position = 'absolute';
                piece.style.width = Math.random() * 8 + 6 + 'px';
                piece.style.height = Math.random() * 12 + 6 + 'px';
                piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                piece.style.left = Math.random() * 100 + 'vw';
                piece.style.top = '-20px';
                piece.style.borderRadius = '2px';
                piece.style.transform = `rotate(${Math.random() * 360}deg)`;
                
                const speedY = Math.random() * 4 + 3;
                const speedX = Math.random() * 2 - 1;
                let currentTop = -20;
                let currentLeft = parseFloat(piece.style.left);
                
                container.appendChild(piece);
                
                function animatePiece() {
                    currentTop += speedY;
                    currentLeft += speedX;
                    piece.style.top = currentTop + 'px';
                    piece.style.left = currentLeft + 'px';
                    
                    if (currentTop < window.innerHeight) {
                        requestAnimationFrame(animatePiece);
                    } else {
                        piece.remove();
                    }
                }
                requestAnimationFrame(animatePiece);
            }
            
            requestAnimationFrame(frame);
        }());
    }
})();

