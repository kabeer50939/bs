/**
 * DHORIA ACADEMY GWADAR — MASTER SHARED DATABASE ENGINE (DhoriaDB)
 * Links Public Website and Admin Panel to the same unified datastore.
 */

(function(global) {
  'use strict';

  const STORAGE_KEY = 'dhoria_master_db_v3';
  const API_ENDPOINT = '/api/data';

  // Master Initial Schema (Synchronized with db/database.json)
  const DEFAULT_DB = {
    settings: {
      siteName: "Dhoria Academy Gwadar",
      siteTagline: "The Place of Learning — Empowering Minds & Building the Future",
      establishedYear: "2006",
      primaryPhone: "0331 5396518",
      secondaryPhone: "0322 2185069",
      officialEmail: "kabeer50930@gmail.com",
      address: "Fish Harbor Road, Near Mir Ghous Bakhsh Bizenjo Football Stadium, Gwadar, Balochistan, Pakistan",
      workingHours: "Morning Shift: 09:00 AM - 01:00 PM | Evening Shift: 03:00 PM - 09:00 PM",
      logoUrl: "assets/images/logo.webp?v=3",
      principalName: "Mr. Hassan Ali",
      principalTitle: "Director & Founder",
      principalMessage: "Welcome to Dhoria Academy Gwadar. For two decades, we have provided tuition-free education, vocational empowerment, and cultural literacy to the youth and women of Gwadar.",
      emergencyBanner: {
        enabled: true,
        badge: "Admissions Open",
        text: "Admissions are currently OPEN for Morning Vocational & Evening Academic Shifts!",
        link: "pages/admissions.html",
        linkText: "Apply Now"
      },
      admissionSettings: {
        admissionsOpen: true,
        currentSession: "Academic Session 2026-2027",
        applicationDeadline: "2026-10-31",
        feePolicy: "100% Free Education & Skill Training (No Tuition Fee)",
        morningShift: "09:00 AM - 01:00 PM (Women's Vocational & Madrasa)",
        eveningShift: "03:00 PM - 09:00 PM (Girls & Boys Academic & IT)",
        maxApplicationsPerDevice: 5
      },
      socialLinks: {
        facebook: "https://facebook.com/dhoriaacademy",
        instagram: "https://instagram.com/dhoriaacademy",
        youtube: "https://youtube.com/@dhoriaacademy",
        whatsapp: "+923315396518"
      },
      seo: {
        metaTitle: "Dhoria Academy Gwadar | Empowering Education in Balochistan",
        metaDescription: "Welcome to Dhoria Academy Gwadar - Empowering minds and building the future.",
        keywords: "Dhoria Academy, Gwadar School, Free Education Gwadar, Balochistan Education, Balochi Embroidery, English Learning Gwadar"
      },
      maintenance: {
        globalEnabled: false,
        title: "Scheduled Maintenance in Progress",
        message: "Dhoria Academy Gwadar website is currently undergoing scheduled maintenance and updates. We will be back online shortly. For urgent inquiries, please contact our administrative office.",
        estimatedTime: "Estimated completion: Soon",
        contactPhone: "0331 5396518",
        contactEmail: "kabeer50930@gmail.com",
        lockedPages: {
          about: false,
          academics: false,
          admissions: false,
          events: false,
          staff: false,
          visitors: false,
          studentCorner: false,
          studentArticles: false,
          contact: false
        },
        lockedSections: {
          heroSlider: false,
          announcements: false,
          partners: false
        }
      },
      defaultTheme: "light"
    },
    heroSlides: [
      {
        id: "slide-1",
        badge: "Welcome to Dhoria Academy",
        title: "THE PLACE OF <br><span>LEARNING.</span>",
        description: "Welcome to Dhoria Academy Gwadar. The place of learning and empowering your skills and career for the future.",
        imageUrl: "assets/images/hero.webp",
        primaryBtnText: "Apply Now",
        primaryBtnLink: "pages/admissions.html",
        secondaryBtnText: "Explore Campus",
        secondaryBtnLink: "#explore",
        active: true,
        order: 1
      },
      {
        id: "slide-2",
        badge: "Co-Curricular Activities",
        title: "DEVELOPING <br><span>CREATIVE MINDS.</span>",
        description: "Our students expressing talents and leadership confidence through co-curricular drama and presentations.",
        imageUrl: "assets/images/weebly/mainpage-3.jpg",
        primaryBtnText: "Our Faculty",
        primaryBtnLink: "pages/about.html#team",
        secondaryBtnText: "Student Corner",
        secondaryBtnLink: "pages/student-corner.html",
        active: true,
        order: 2
      },
      {
        id: "slide-3",
        badge: "Academic Standards",
        title: "RECOGNIZED <br><span>EXCELLENCE.</span>",
        description: "We believe in transparency, regular evaluations, and recognizing student academic milestones.",
        imageUrl: "assets/images/weebly/mainpage-4.jpg",
        primaryBtnText: "View Programs",
        primaryBtnLink: "pages/academics.html",
        secondaryBtnText: "Join Dhoria",
        secondaryBtnLink: "pages/admissions.html",
        active: true,
        order: 3
      },
      {
        id: "slide-4",
        badge: "Women's Vocational Center",
        title: "TRADITIONAL <br><span>BALOCHI EMBROIDERY.</span>",
        description: "Preserving traditional regional needlework and tailoring skills to promote economic self-reliance for local women.",
        imageUrl: "assets/images/weebly/mainpage-5.jpg",
        primaryBtnText: "Vocational Details",
        primaryBtnLink: "pages/student-corner.html",
        secondaryBtnText: "Apply Now",
        secondaryBtnLink: "pages/admissions.html",
        active: true,
        order: 4
      },
      {
        id: "slide-5",
        badge: "Vocational Training",
        title: "EMPOWERING <br><span>LOCAL WOMEN.</span>",
        description: "Morning shift embroidery, tailoring, and sewing classes aimed at female skill acquisition and empowerment.",
        imageUrl: "assets/images/weebly/mainpage-6.jpg",
        primaryBtnText: "Shift Schedule",
        primaryBtnLink: "pages/academics.html",
        secondaryBtnText: "Student Corner",
        secondaryBtnLink: "pages/student-corner.html",
        active: true,
        order: 5
      },
      {
        id: "slide-6",
        badge: "Modern Classroom Technology",
        title: "VISUAL & DIGITAL <br><span>LEARNING.</span>",
        description: "Utilizing multimedia aids, digital presentations, and visual materials to optimize our students' comprehension.",
        imageUrl: "assets/images/weebly/mainpage-7.jpg",
        primaryBtnText: "Our Syllabus",
        primaryBtnLink: "pages/academics.html",
        secondaryBtnText: "Student Corner",
        secondaryBtnLink: "pages/student-corner.html",
        active: true,
        order: 6
      },
      {
        id: "slide-7",
        badge: "Public Speaking & Leadership",
        title: "MONTHLY SPEECH <br><span>PROGRAMS.</span>",
        description: "Enabling bilingual debate matches, speech events, and creative expression forums to foster confidence.",
        imageUrl: "assets/images/weebly/mainpage-9.jpg",
        primaryBtnText: "Gallery",
        primaryBtnLink: "pages/student-corner.html",
        secondaryBtnText: "Our Legacy",
        secondaryBtnLink: "pages/about.html",
        active: true,
        order: 7
      },
      {
        id: "slide-8",
        badge: "Distinguished Visitors",
        title: "COMMUNITY & NATIONAL <br><span>INSPIRATION.</span>",
        description: "Prominent figures, national legends, and educationists regularly visit our campus to encourage our learners.",
        imageUrl: "assets/images/weebly/mainpage-10.jpg",
        primaryBtnText: "View Guestbook",
        primaryBtnLink: "pages/visitors.html",
        secondaryBtnText: "Learn History",
        secondaryBtnLink: "pages/about.html",
        active: true,
        order: 8
      },
      {
        id: "slide-9",
        badge: "Rigorous Evaluation",
        title: "REGULAR ENGLISH <br><span>TESTS.</span>",
        description: "Maintaining a structured curriculum verified by standard examinations to track student progress.",
        imageUrl: "assets/images/weebly/mainpage-11.jpg",
        primaryBtnText: "Curriculum",
        primaryBtnLink: "pages/academics.html",
        secondaryBtnText: "Join Course",
        secondaryBtnLink: "pages/admissions.html",
        active: true,
        order: 9
      },
      {
        id: "slide-10",
        badge: "Dedicated Instructors",
        title: "VOLUNTARY <br><span>COMMUNITY TEACHERS.</span>",
        description: "Run entirely by altruistic educationists offering free quality guidance to Gwadar's next generation.",
        imageUrl: "assets/images/weebly/mainpage-12.jpg",
        primaryBtnText: "Meet Faculty",
        primaryBtnLink: "pages/about.html#team",
        secondaryBtnText: "Our Mission",
        secondaryBtnLink: "pages/about.html",
        active: true,
        order: 10
      },
      {
        id: "slide-11",
        badge: "Altruistic Faculty",
        title: "A SUPPORTIVE <br><span>TEAM ENVIRONMENT.</span>",
        description: "Educators united under the banner of free learning, creating a friendly and highly motivated academy.",
        imageUrl: "assets/images/weebly/mainpage-13.jpg",
        primaryBtnText: "Our Staff",
        primaryBtnLink: "pages/staff.html",
        secondaryBtnText: "Contact Us",
        secondaryBtnLink: "pages/contact.html",
        active: true,
        order: 11
      },
      {
        id: "slide-12",
        badge: "Kalmati Memorial Library",
        title: "OCEAN OF <br><span>KNOWLEDGE.</span>",
        description: "Housing classic Balochi literature, academic reference texts, and silent study zones open for all.",
        imageUrl: "assets/images/weebly/mainpage-14.jpg",
        primaryBtnText: "Search Books",
        primaryBtnLink: "pages/academics.html#library",
        secondaryBtnText: "Our Donor",
        secondaryBtnLink: "pages/about.html",
        active: true,
        order: 12
      }
    ],
    announcements: [
      {
        id: "ann-1",
        title: "Celebrating our 20th Anniversary (2006–2026)",
        date: "May 22, 2026",
        excerpt: "Celebrating our 20th Anniversary (2006–2026) of educational and community service in Gwadar.",
        category: "Milestone",
        linkUrl: "pages/about.html",
        linkText: "Our Legacy",
        pinned: true,
        active: true
      },
      {
        id: "ann-2",
        title: "Mir Abdul Ghafoor Kalmati Library adds new digital catalog",
        date: "May 10, 2026",
        excerpt: "Mir Abdul Ghafoor Kalmati Library adds a new digital catalog and English grammar learning materials.",
        category: "Library",
        linkUrl: "pages/about.html",
        linkText: "Library Info",
        pinned: false,
        active: true
      },
      {
        id: "ann-3",
        title: "Morning shift Balochi Embroidery & sewing registration open",
        date: "April 28, 2026",
        excerpt: "Morning shift Balochi Embroidery and sewing registration details released for local women.",
        category: "Admissions",
        linkUrl: "pages/admissions.html",
        linkText: "Apply Now",
        pinned: true,
        active: true
      }
    ],
    shifts: [
      {
        id: "shift-women",
        timing: "09:00 AM - 01:00 PM",
        subTiming: "Madrasa: 09:00 AM - 12:00 PM",
        group: "Women's Program",
        classes: "Balochi Embroidery & Tailoring Training, and Islamic Madrasa Facilities (Morning Shift)",
        active: true
      },
      {
        id: "shift-girls",
        timing: "03:00 PM - 05:00 PM",
        subTiming: "",
        group: "Girls' Programs",
        classes: "Computer Education, English Language, and Library Facilities",
        active: true
      },
      {
        id: "shift-boys",
        timing: "05:30 PM - 09:00 PM",
        subTiming: "",
        group: "Boys' Programs",
        classes: "Balochi Language, English Language, Computer Classes, and Library Facilities",
        active: true
      }
    ],
    staff: [
      {
        id: "stf-1",
        name: "Mir Abdul Ghafoor Kalmati",
        role: "Honorable Donor",
        category: "Leadership",
        photoUrl: "assets/images/logo.png",
        email: "",
        phone: "",
        bio: "Honorable patron and donor of Dhoria Academy and the Kalmati Memorial Library.",
        order: 1,
        active: true
      },
      {
        id: "stf-2",
        name: "Mr. Hassan Ali",
        role: "Director & Founder",
        category: "Leadership",
        photoUrl: "assets/images/hassan_ali.jpg",
        email: "kabeer50930@gmail.com",
        phone: "0331 5396518",
        bio: "Founding visionary who voluntarily runs Dhoria Academy free of cost since 2006.",
        order: 2,
        active: true
      },
      {
        id: "stf-3",
        name: "Master Ghulam Sarwar",
        role: "Academic Coordinator",
        category: "Academic Faculty",
        photoUrl: "",
        email: "",
        phone: "0322 2185069",
        bio: "Senior coordinator guiding students through matriculation and standard board examinations.",
        order: 3,
        active: true
      },
      {
        id: "stf-4",
        name: "Madam Ruqayya Baloch",
        role: "Vocational Instructor (Morning)",
        category: "Vocational Faculty",
        photoUrl: "",
        email: "",
        phone: "0331 5396518",
        bio: "Master craftsperson leading traditional Balochi embroidery and tailoring training.",
        order: 4,
        active: true
      }
    ],
    visitors: [
      {
        id: "vis-1",
        name: "Dr. Manzoor Ahmed",
        designation: "Vice Chancellor, University of Gwadar",
        badge: "Academic",
        date: "February 2026",
        comment: "Dhoria Academy represents the true grassroots spirit of Gwadar. Providing voluntary, tuition-free education for two decades is a monumental feat of public service that deserves our deepest gratitude.",
        active: true
      },
      {
        id: "vis-2",
        name: "Moeen Khan",
        designation: "Former Pakistan National Cricket Captain & Legend",
        badge: "National Legend",
        date: "Visit Archive",
        comment: "Deeply inspired by the discipline, dedication of the volunteer faculty, and the enthusiasm of young students learning in Gwadar.",
        active: true
      },
      {
        id: "vis-3",
        name: "Capt. Tariq Mehmood PN",
        designation: "Commander, Pakistan Navy Coastal Command",
        badge: "Official",
        date: "November 2025",
        comment: "Highly impressed by the discipline and dedication of the volunteer educators who provide free quality education to the coastal youth.",
        active: true
      },
      {
        id: "vis-4",
        name: "Jan Achakzai",
        designation: "Distinguished Columnist & Political Analyst",
        badge: "Prominent Visitor",
        date: "August 2025",
        comment: "An extraordinary sanctuary of knowledge in the heart of Gwadar. Mr. Hassan Ali and the Kalmati family have crafted a model school for community-driven progress.",
        active: true
      }
    ],
    events: [
      {
        id: "evt-1",
        title: "Jashn-e-Sahil Festival (Festival of the Coast)",
        category: "Cultural Festival",
        date: "Annual",
        location: "East Bay & Campus Grounds, Gwadar",
        description: "5 consecutive years of organizing boat racing, chair racing, Kati races, Lewa dance, theatrical drama, and athletic celebrations.",
        imageUrl: "assets/images/weebly/4308649.jpg",
        status: "Completed",
        featured: true
      },
      {
        id: "evt-2",
        title: "20th Anniversary Celebration (2006-2026)",
        category: "Milestone Ceremony",
        date: "May 2026",
        location: "Main Auditorium, Gwadar",
        description: "Celebrating two decades of free education and community empowerment in Gwadar.",
        imageUrl: "assets/images/gathering.jpg",
        status: "Upcoming",
        featured: true
      }
    ],
    gallery: [
      { id: "gal-1", title: "New Year Celebration", category: "Campus", imageUrl: "assets/images/weebly/4308649.jpg" },
      { id: "gal-2", title: "Performance Stage", category: "Culture", imageUrl: "assets/images/weebly/3061265.jpg" },
      { id: "gal-3", title: "Chair Racing Awards", category: "Sports", imageUrl: "assets/images/weebly/1936016.jpg" },
      { id: "gal-4", title: "Kati Race Winners", category: "Sports", imageUrl: "assets/images/weebly/2759261.jpg" },
      { id: "gal-5", title: "Oceanic Sports Award", category: "Sports", imageUrl: "assets/images/weebly/2046611.jpg" },
      { id: "gal-6", title: "Jashn-e-Sahil Winning Boat", category: "Culture", imageUrl: "assets/images/weebly/7775440.jpg" }
    ],
    articles: [
      {
        id: "art-1",
        title: "Dhoria Academy Campus Band: Rhythms of Coastal Youth",
        author: "Student Council & Music Club",
        authorRole: "Student Council",
        category: "Culture & Arts",
        date: "March 15, 2026",
        imageUrl: "assets/images/weebly/mainpage-3.jpg",
        excerpt: "Exploring the journey of Dhoria Academy's musical band and how folk melodies inspire discipline and unity among students.",
        content: "Music and performing arts have always provided our students a powerful medium of emotional and creative expression. The Dhoria Academy Campus Band unites traditional Balochi instruments with modern acoustic rhythms, representing Gwadar's cultural vibrancy.",
        status: "Published",
        views: 432
      },
      {
        id: "art-2",
        title: "History of Computing in Gwadar: From Typewriters to Digital Code",
        author: "Mr. Hassan Ali & Senior IT Batch",
        authorRole: "Faculty & Students",
        category: "Technology & History",
        date: "February 10, 2026",
        imageUrl: "assets/images/weebly/mainpage-7.jpg",
        excerpt: "A chronicle of how Dhoria Academy introduced early computer education in Gwadar and transformed digital literacy in the region.",
        content: "In the early 2000s, access to computers in coastal Balochistan was an unimaginable luxury. Dhoria Academy set up one of the earliest community computer centers, introducing students to word processing, programming logic, and the global internet.",
        status: "Published",
        views: 890
      },
      {
        id: "art-3",
        title: "Preserving the Golden Threads of Balochi Hand Embroidery",
        author: "Madam Ruqayya Baloch",
        authorRole: "Vocational Department",
        category: "Heritage & Craft",
        date: "April 02, 2026",
        imageUrl: "assets/images/weebly/mainpage-5.jpg",
        excerpt: "An in-depth study of the geometric motifs, traditional colors, and economic empowerment behind Gwadar's needlework traditions.",
        content: "Every stitch in Balochi embroidery carries centuries of maternal lineage, coastal folklore, and patient artistry. At Dhoria Academy, we ensure this heritage thrives in modern times by connecting skilled artisans with ethical learning platforms.",
        status: "Published",
        views: 315
      }
    ],
    partners: [
      { id: "prt-1", name: "Gwadar District Administration", iconClass: "fas fa-landmark", link: "#", active: true },
      { id: "prt-2", name: "University of Gwadar", iconClass: "fas fa-university", link: "https://ug.edu.pk", active: true },
      { id: "prt-3", name: "Mir Abdul Ghafoor Kalmati Foundation", iconClass: "fas fa-hand-holding-heart", link: "#", active: true },
      { id: "prt-4", name: "Gwadar Port Authority", iconClass: "fas fa-ship", link: "http://gpa.gov.pk", active: true },
      { id: "prt-5", name: "Gwadar Youth Council", iconClass: "fas fa-users", link: "#", active: true },
      { id: "prt-6", name: "Balochi Cultural Society", iconClass: "fas fa-book", link: "#", active: true }
    ],
    admissions: [
      {
        id: "ADM-2026-001",
        studentName: "Muhammad Bilal",
        fatherName: "Abdul Rashid",
        dob: "14/04/2010",
        className: "Class 9th (Matric Science)",
        shiftTiming: "Evening",
        bform: "51201-4567890-1",
        mobile: "03337890123",
        guardianMobile: "03315678901",
        address: "Mulla Band Ward, Near Gwadar Port, Gwadar",
        qualification: "Passed Class 8th with Grade A",
        photoUrl: "assets/images/students.png",
        status: "Approved",
        submissionDate: "2026-09-18",
        notes: "Verified B-Form and transcript. Admitted to Evening shift science group."
      },
      {
        id: "ADM-2026-002",
        studentName: "Zainab Baloch",
        fatherName: "Ghulam Qadir",
        dob: "20/11/2008",
        className: "Vocational (Balochi Embroidery & IT)",
        shiftTiming: "Morning",
        bform: "51201-9876543-2",
        mobile: "03218901234",
        guardianMobile: "03001234567",
        address: "Gazorwan Ward, Gwadar",
        qualification: "Middle pass",
        photoUrl: "assets/images/students.png",
        status: "Under Review",
        submissionDate: "2026-09-19",
        notes: "Morning embroidery shift applicant."
      }
    ],
    messages: [
      {
        id: "msg-1",
        senderName: "Zubair Ahmed",
        email: "zubair.gwadar@gmail.com",
        phone: "0333-1234567",
        subject: "Inquiry about Morning Shift Computer Classes",
        message: "Assalam-o-Alaikum, I want to inquire if the morning computer classes are open for new admissions next month? Please let me know the required documents.",
        timestamp: "2026-09-20T10:15:00Z",
        status: "Unread"
      }
    ],
    users: [
      {
        id: "usr-1",
        username: "admin",
        password: "admin123",
        fullName: "Administrator",
        email: "kabeer50930@gmail.com",
        role: "Super Admin",
        avatar: "assets/images/logo.png",
        status: "Active",
        createdAt: "2026-01-01"
      },
      {
        id: "usr-2",
        username: "editor",
        password: "editor123",
        fullName: "Content Editor",
        email: "editor@dhoriaacademy.org",
        role: "Editor",
        avatar: "assets/images/logo.png",
        status: "Active",
        createdAt: "2026-02-15"
      }
    ],
    activityLog: [
      {
        id: "log-1",
        user: "admin",
        action: "Database Synchronized",
        details: "Public website and Admin Panel linked to unified database.",
        timestamp: new Date().toISOString()
      }
    ]
  };

  class DhoriaDatabase {
    constructor() {
      this.data = null;
      this.listeners = {};
      this.init();
    }

    init() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.data = JSON.parse(stored);
          this.mergeWithDefaults();
        } else {
          this.data = JSON.parse(JSON.stringify(DEFAULT_DB));
          this.persistLocal();
        }
      } catch (err) {
        this.data = JSON.parse(JSON.stringify(DEFAULT_DB));
      }

      // Sync with server API
      this.syncWithServer();

      // Listen to cross-tab storage updates
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
          if (e.key === STORAGE_KEY && e.newValue) {
            try {
              this.data = JSON.parse(e.newValue);
              this.emit('change', { type: 'storage_sync' });
            } catch (err) {}
          }
        });

        // Re-sync with server whenever window/tab is focused or visibility changes
        window.addEventListener('focus', () => this.syncWithServer());
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) this.syncWithServer();
        });
      }
    }

    mergeWithDefaults() {
      for (const key of Object.keys(DEFAULT_DB)) {
        if (this.data[key] === undefined) {
          this.data[key] = JSON.parse(JSON.stringify(DEFAULT_DB[key]));
        }
      }
      if (this.data.settings) {
        if (!this.data.settings.maintenance) {
          this.data.settings.maintenance = JSON.parse(JSON.stringify(DEFAULT_DB.settings.maintenance));
        } else {
          this.data.settings.maintenance.lockedPages = {
            ...DEFAULT_DB.settings.maintenance.lockedPages,
            ...(this.data.settings.maintenance.lockedPages || {})
          };
          this.data.settings.maintenance.lockedSections = {
            ...DEFAULT_DB.settings.maintenance.lockedSections,
            ...(this.data.settings.maintenance.lockedSections || {})
          };
        }
        if (!this.data.settings.emergencyBanner) {
          this.data.settings.emergencyBanner = JSON.parse(JSON.stringify(DEFAULT_DB.settings.emergencyBanner));
        }
        if (!this.data.settings.admissionSettings) {
          this.data.settings.admissionSettings = JSON.parse(JSON.stringify(DEFAULT_DB.settings.admissionSettings));
        }
      }
    }

    hasBackend() {
      if (typeof window === 'undefined') return false;
      const host = window.location.hostname;
      if (!host || host.includes('static.hf.space') || host.endsWith('github.io') || host.endsWith('hf.space') || window.location.protocol === 'file:') {
        return false;
      }
      return host === 'localhost' || host === '127.0.0.1';
    }

    async syncWithServer() {
      if (typeof window === 'undefined' || !window.fetch || !this.hasBackend()) return;
      try {
        const res = await fetch(API_ENDPOINT, { cache: 'no-store' });
        if (res.ok) {
          const serverData = await res.json();
          if (serverData && typeof serverData === 'object' && serverData.settings) {
            // Always prefer server data — it is the source of truth
            this.data = serverData;
            this.mergeWithDefaults();
            this.persistLocal();
            this.emit('change', { type: 'server_pull' });
          }
        }
      } catch (e) {
        // Operates in localStorage-only mode if server unreachable
      }
    }

    persistLocal() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (e) {}
    }

    async persistServer() {
      if (typeof window === 'undefined' || !window.fetch || !this.hasBackend()) return;
      try {
        await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.data)
        });
      } catch (e) {}
    }

    async save(actionName = 'Database Updated', details = '', user = 'admin') {
      this.persistLocal();
      this.persistServer();
      this.emit('change', { action: actionName, details });
    }

    on(event, callback) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(callback);
    }

    emit(event, payload) {
      if (this.listeners && this.listeners[event]) {
        this.listeners[event].forEach(cb => {
          try { cb(payload); } catch(err) { console.error(err); }
        });
      }
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('dhoria_db_change', { detail: payload }));
      }
    }

    logActivity(action, details, user = 'admin') {
      if (!this.data.activityLog) this.data.activityLog = [];
      const log = {
        id: 'log-' + Date.now(),
        user: user || 'admin',
        action: action,
        details: details,
        timestamp: new Date().toISOString()
      };
      this.data.activityLog.unshift(log);
      if (this.data.activityLog.length > 200) {
        this.data.activityLog = this.data.activityLog.slice(0, 200);
      }
      this.persistLocal();
      this.persistServer();
    }

    // Collection CRUD
    get(collectionName) {
      return this.data[collectionName] || [];
    }

    getById(collectionName, id) {
      const items = this.get(collectionName);
      if (!Array.isArray(items)) return null;
      return items.find(item => String(item.id) === String(id)) || null;
    }

    create(collectionName, item, user = 'admin') {
      if (!this.data[collectionName]) this.data[collectionName] = [];
      if (!item.id) {
        item.id = collectionName.substring(0, 3) + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 4);
      }
      this.data[collectionName].unshift(item);
      this.logActivity(`Created in ${collectionName}`, `Record ID: ${item.id}`, user);
      this.save(`create_${collectionName}`, `Created ${item.id}`, user);
      return item;
    }

    update(collectionName, id, updates, user = 'admin') {
      if (!this.data[collectionName]) return null;
      const idx = this.data[collectionName].findIndex(i => String(i.id) === String(id));
      if (idx === -1) return null;

      this.data[collectionName][idx] = {
        ...this.data[collectionName][idx],
        ...updates
      };
      this.logActivity(`Updated in ${collectionName}`, `Record ID: ${id}`, user);
      this.save(`update_${collectionName}`, `Updated ${id}`, user);
      return this.data[collectionName][idx];
    }

    delete(collectionName, id, user = 'admin') {
      if (!this.data[collectionName]) return false;
      const lenBefore = this.data[collectionName].length;
      this.data[collectionName] = this.data[collectionName].filter(i => String(i.id) !== String(id));
      if (this.data[collectionName].length < lenBefore) {
        this.logActivity(`Deleted from ${collectionName}`, `Record ID: ${id}`, user);
        this.save(`delete_${collectionName}`, `Deleted ${id}`, user);
        return true;
      }
      return false;
    }

    // Settings
    getSettings() {
      return this.data.settings || DEFAULT_DB.settings;
    }

    updateSettings(newSettings, user = 'admin') {
      this.data.settings = {
        ...this.data.settings,
        ...newSettings
      };
      this.logActivity('Settings Updated', 'Website and Contact settings updated', user);
      this.save('settings_updated', 'Website Settings updated', user);
      return this.data.settings;
    }

    // Add admission
    addAdmission(admissionData) {
      const year = new Date().getFullYear();
      const count = (this.data.admissions ? this.data.admissions.length : 0) + 1;
      const id = `ADM-${year}-${String(count).padStart(3, '0')}`;

      const newRecord = {
        id: id,
        studentName: admissionData.studentName || '',
        fatherName: admissionData.fatherName || '',
        dob: admissionData.dob || '',
        className: admissionData.className || 'Class 1st',
        shiftTiming: admissionData.shiftTiming || 'Evening',
        bform: admissionData.bform || '',
        mobile: admissionData.mobile || '',
        guardianMobile: admissionData.guardianMobile || '',
        address: admissionData.address || '',
        qualification: admissionData.qualification || '',
        photoUrl: admissionData.photoUrl || 'assets/images/students.png',
        status: admissionData.status || 'Pending',
        submissionDate: admissionData.submissionDate || new Date().toISOString().split('T')[0],
        notes: admissionData.notes || 'Submitted via online portal'
      };

      if (!this.data.admissions) this.data.admissions = [];
      this.data.admissions.unshift(newRecord);
      this.logActivity('New Admission Submission', `Student: ${newRecord.studentName} (${newRecord.id})`, 'Portal');
      this.save('new_admission', `Admission ${newRecord.id}`, 'Portal');
      return newRecord;
    }

    // Add message
    addMessage(msgData) {
      const newMsg = {
        id: 'msg-' + Date.now().toString(36),
        senderName: msgData.senderName || msgData.name || 'Website Visitor',
        email: msgData.email || '',
        phone: msgData.phone || '',
        subject: msgData.subject || 'Website Inquiry',
        message: msgData.message || '',
        timestamp: new Date().toISOString(),
        status: 'Unread'
      };

      if (!this.data.messages) this.data.messages = [];
      this.data.messages.unshift(newMsg);
      this.logActivity('Contact Message Received', `From: ${newMsg.senderName} (${newMsg.subject})`, 'Contact Form');
      this.save('new_message', `Message from ${newMsg.senderName}`, 'Contact Form');
      return newMsg;
    }

    // Add article
    addArticle(artData) {
      const newArt = {
        id: 'art-' + Date.now().toString(36),
        title: artData.title || 'Untitled Article',
        author: artData.author || 'Student Author',
        authorRole: artData.authorRole || 'Student',
        category: artData.category || 'General',
        date: artData.date || new Date().toISOString().split('T')[0],
        imageUrl: artData.imageUrl || artData.photoUrl || 'assets/images/weebly/mainpage-3.jpg',
        excerpt: artData.excerpt || '',
        content: artData.content || '',
        status: artData.status || 'Published',
        views: 0
      };

      if (!this.data.articles) this.data.articles = [];
      this.data.articles.unshift(newArt);
      this.logActivity('Article Submitted', `Title: ${newArt.title}`, 'Student Corner');
      this.save('new_article', `Article ${newArt.title}`, 'Student Corner');
      return newArt;
    }

    // Stats
    getStats() {
      const admissions = this.get('admissions');
      const messages = this.get('messages');
      const staff = this.get('staff');
      const articles = this.get('articles');
      const events = this.get('events');
      const visitors = this.get('visitors');
      const slides = this.get('heroSlides');
      const announcements = this.get('announcements');

      return {
        totalAdmissions: admissions.length,
        pendingAdmissions: admissions.filter(a => a.status === 'Pending').length,
        approvedAdmissions: admissions.filter(a => a.status === 'Approved').length,
        totalStaff: staff.filter(s => s.active !== false).length,
        totalArticles: articles.length,
        publishedArticles: articles.filter(a => a.status === 'Published').length,
        totalEvents: events.length,
        totalVisitors: visitors.length,
        totalSlides: slides.length,
        totalAnnouncements: announcements.length,
        totalMessages: messages.length,
        unreadMessages: messages.filter(m => m.status === 'Unread').length
      };
    }

    exportBackup() {
      return JSON.stringify(this.data, null, 2);
    }

    importBackup(jsonString, user = 'admin') {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed || typeof parsed !== 'object' || !parsed.settings) {
          throw new Error('Invalid database format');
        }
        this.data = parsed;
        this.mergeWithDefaults();
        this.logActivity('Database Restored', 'Full database restored from backup file', user);
        this.save('backup_restored', 'Database Restored', user);
        return { success: true, message: 'Database restored successfully!' };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    resetToDefault(user = 'admin') {
      this.data = JSON.parse(JSON.stringify(DEFAULT_DB));
      this.logActivity('Factory Reset', 'Database reset to original academy defaults', user);
      this.save('factory_reset', 'Database reset to defaults', user);
      return true;
    }
  }

  global.DhoriaDB = new DhoriaDatabase();

})(typeof window !== 'undefined' ? window : this);
