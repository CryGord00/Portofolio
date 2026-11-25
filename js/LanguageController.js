(function (global) {
  'use strict';

  const Portfolio = (global.Portfolio = global.Portfolio || {});

  const TRANSLATIONS = {
    id: {
      pageTitle: 'Dimas Pradhitya | App Developer & Cybersecurity',
      pageDesc:
        'Portofolio Dimas Pradhitya: Mahasiswa Informatika UMN yang berfokus pada pengembangan perangkat lunak lintas platform (Mobile, Web, dan Database) serta Application Security.',
      skipLink: 'Lewati ke konten utama',
      navAbout: 'Tentang',
      navProfile: 'Profil',
      navProjects: 'Project',
      navStack: 'Stack',
      navContact: 'Kontak',
      mobileNavProfile: 'Profil Formal',
      mobileNavProjects: 'Studi Kasus & Project',
      mobileNavStack: 'Tech Stack',
      langSwitchAria: 'Ganti bahasa ke Inggris',

      heroKicker: 'Halo, Saya',
      heroStatus: 'Terbuka untuk Magang & Kolaborasi',
      heroDesc:
        'Mahasiswa Informatika Universitas Multimedia Nusantara (UMN) yang berfokus pada pengembangan perangkat lunak lintas platform (Mobile, Web, dan Database) dengan perhatian khusus pada keamanan aplikasi (Application Security).',
      heroBtnProjects: 'Lihat Project',
      heroBtnCv: 'Lihat CV',
      heroBtnContact: 'Kontak',
      heroFindMe: 'Temukan Saya',
      heroScrollCue: 'Gulir ke perkenalan',
      lanyardHint: 'Tarik atau gerakkan kursor pada kartu',

      profileKicker: '01 · Pengalaman & Cara Kerja',
      profileTitleHtml: 'Tentang <span class="editorial-italic">Saya.</span>',
      aboutExpKicker: 'Pengalaman & Kolaborasi',
      aboutExpLead: 'Membangun produk nyata dalam tim.',
      aboutExpText:
        'Terlibat merancang dan membangun project kolaboratif, mulai dari aplikasi mobile SENORITA, game eksplorasi web Fantasticpart2 bersama Team Fantastic 4, perangkat analisis URL berbahaya, hingga berkontribusi sebagai Committee pada UMN Festival 2025.',
      aboutEngKicker: 'Praktik Rekayasa',
      aboutEngLead: 'Terstruktur dari desain hingga validasi keamanan.',
      aboutEngText:
        'Terbiasa memisahkan state arsitektur MVVM secara rapi pada aplikasi mobile, menjaga konsistensi validasi input serta alur database, dan menguji dasar celah keamanan OWASP Top 10 sebelum fitur dirilis.',
      detailLocLabel: 'Basis Lokasi',
      detailLocValue: 'Tangerang, Indonesia',
      detailLangLabel: 'Bahasa Utama',
      detailLangValue: 'Kotlin, JS, C#, SQL',
      detailCollabLabel: 'Alur Kolaborasi',
      detailCollabValue: 'Git & Tim Lintas Peran',
      detailCampusLabel: 'Pengalaman Kampus',
      detailCampusValue: 'Project & Panitia UMN',

      cvKicker: 'Curriculum Vitae · PDF (ID / EN)',
      cvTitle: 'Curriculum Vitae Dimas Pradhitya',
      cvDesc:
        'Tersedia versi Bahasa Indonesia dan Bahasa Inggris (ATS-friendly) dalam format PDF siap baca maupun unduh.',
      cvBtnOpen: 'Buka CV (ID)',
      cvBtnDownload: 'Unduh PDF',
      cvBtnAlt: 'CV (English)',

      orgKicker: '02 · Organisasi & Pengalaman Kampus',
      orgTitleHtml: 'Organisasi<span class="editorial-italic">.</span>',
      orgSub:
        'Rekam jejak organisasi, kepanitiaan, dan sertifikat kegiatan selama menempuh studi di Universitas Multimedia Nusantara (klik sertifikat untuk pratinjau).',
      org1Date: 'Kepanitiaan UMN · 2025',
      org1Title: 'UMN Festival 2025',
      org1Issuer: 'Committee · Universitas Multimedia Nusantara (2 Februari 2026)',
      org1Cat: 'Kepanitiaan UMN',
      org1ModalTitle: 'UMN Festival 2025 (Committee)',
      org1ModalDesc:
        'Certificate of Appreciation atas kontribusi sebagai Committee pada rangkaian acara UMN Festival 2025, Universitas Multimedia Nusantara (Tangerang, 2 Februari 2026).',
      org2Date: 'HMIF · PPIF UMN 2026',
      org2Title: 'Perkenalan Prodi Informatika (PPIF)',
      org2Issuer: 'Member of Module · HMIF Universitas Multimedia Nusantara',
      org2Cat: 'HMIF · PPIF UMN',
      org2ModalTitle: 'PPIF Informatika UMN 2026 (Member of Module)',
      org2ModalDesc:
        'Certificate of Appreciation atas kontribusi dan partisipasi sebagai Member of Module pada Perkenalan Prodi Informatika (PPIF) UMN 2026 bersama HMIF Universitas Multimedia Nusantara.',

      projKicker: '03 · Karya Pilihan',
      projTitleHtml: 'Studi Kasus <span class="editorial-italic">&amp; Project.</span>',
      projSub:
        'Penjelasan masalah, arsitektur teknis, serta implementasi nyata yang disertai source code GitHub dan beberapa live demo.',
      filterAll: 'Semua (5)',
      filterMobile: 'Mobile App (2)',
      filterCyber: 'Cybersecurity (1)',
      filterGame: 'Game (2)',
      emptyStateText: 'Belum ada project yang cocok dengan kategori ini.',
      emptyStateBtn: 'Tampilkan Semua Project',

      senoritaTitle: 'SENORITA: Aplikasi Pemesanan Food & Beverage',
      senoritaP1Html:
        '<strong>Masalah:</strong> Pemesanan Dine-In dan Take Away membutuhkan alur pilih cabang, kustomisasi menu, validasi form ketat, dan pelacakan status tanpa state keranjang yang tertukar.',
      senoritaP2Html:
        '<strong>Pendekatan Teknis:</strong> Membangun arsitektur MVVM terpisah dengan 6 ViewModel khusus, StateFlow reaktif, serta NavHost dengan pengiriman argumen dinamis antar 15+ layar Compose.',
      senoritaP3Html:
        '<strong>Implementasi Nyata:</strong> Sistem validasi input (Email, HP min. 10 digit, OTP 4 digit), tema Material 3 kustom, mockup pemindai QR meja, dan penerbitan struk digital.',
      senoritaLink: 'Lihat Source Code & Dokumentasi SENORITA',
      senoritaArchCaption: 'Arsitektur Lapisan',
      senoritaLayer1Scope: '15+ Layar',
      senoritaLayer2Scope: '6 ViewModel',
      senoritaLayer3Scope: 'Lokal',

      urlTitle: 'URL Phishing Detector',
      urlP1Html:
        '<strong>Masalah:</strong> Tautan phishing kerap menyamarkan domain asli lewat panjang path, angka atau tanda hubung berlebih, hingga pemakaian alamat IP mentah untuk mengecoh pengguna.',
      urlP2Html:
        '<strong>Pendekatan Teknis:</strong> Membangun backend Python (<code>ThreadingHTTPServer</code>) dengan endpoint <code>GET /api/health</code> dan <code>POST /api/predict</code> yang terhubung ke antarmuka web PhishGuard AI (HTML, CSS, JavaScript).',
      urlP3Html:
        '<strong>Cakupan Fitur:</strong> Mengekstrak 8 fitur leksikal URL (<code>path_length</code>, <code>url_length</code>, <code>num_dots</code>, <code>num_hyphens</code>, <code>num_digits</code>, <code>has_https</code>, <code>has_ip</code>), pengecekan domain tepercaya, serta skor risiko dengan <em>lexical fallback</em> saat model Random Forest tidak dimuat.',
      urlLinkRepo: 'Lihat Source Code URL Detector',
      urlLinkDemo: 'Buka Live Demo (Vercel)',
      urlVisualCaption: 'Bobot Fitur Deteksi',
      urlVisualMeta: 'Data Kode · app.py',

      fantasticTitle: 'Fantasticpart2: Game Eksplorasi Kota Berbasis Web',
      fantasticP1Html:
        '<strong>Konsep:</strong> Project kolaborasi tim beranggotakan 4 pengembang (Team Fantastic 4) menghadirkan pemilihan karakter dengan kombinasi <em>weakness</em> dan <em>strength</em> unik untuk gaya bermain yang berbeda.',
      fantasticP2Html:
        '<strong>Mekanik Permainan:</strong> Pemain menjelajahi berbagai kota sambil mengelola poin status bar yang berkurang sesuai aktivitas; pemain harus mengumpulkan seluruh item di semua kota sebelum salah satu status menyentuh <code>0</code> (<em>game over</em>).',
      fantasticP3Html:
        '<strong>Implementasi &amp; Deploy:</strong> Dibangun sebagai aplikasi web SPA dengan JavaScript, CSS, dan HTML serta dikonfigurasi untuk deployment root SPA di Vercel.',
      fantasticLinkRepo: 'Lihat Repository GitHub',
      fantasticLinkDemo: 'Buka Live Demo (Vercel)',
      fantasticVisualCaption: 'Komposisi Bahasa Kode',
      fantasticVisualMeta: 'GitHub Repo · 4 Kontributor',

      hotelTitle: 'Hotel Booking & Management: Aplikasi Reservasi Hotel',
      hotelP1Html:
        '<strong>Konsep &amp; Peran:</strong> Project kolaborasi tim beranggotakan 6 pengembang yang membagi alur aplikasi ke tiga zona rute (<code>auth</code>, <code>guest</code>, dan <code>admin</code>) menggunakan navigasi berbasis berkas pada Expo Router.',
      hotelP2Html:
        '<strong>Fitur Utama:</strong> Alur autentikasi (<em>login</em> &amp; <em>register</em>), pencarian dan detail kamar, konfirmasi serta riwayat reservasi tamu, hingga dashboard admin untuk mengelola kamar, reservasi, dan pemindai (<code>expo-camera</code>).',
      hotelP3Html:
        '<strong>Arsitektur Teknis:</strong> Dibangun dengan TypeScript (98.2%), React Native (Expo 54), NativeWind/Tailwind CSS, pemisahan layanan API pada folder <code>services/</code> (<code>api</code>, <code>auth</code>, <code>hotel</code>, <code>booking</code>, <code>admin</code>), dan <code>AsyncStorage</code>.',
      hotelLinkRepo: 'Lihat Repository GitHub',
      hotelVisualCaption: 'Komposisi Bahasa Kode',
      hotelVisualMeta: 'GitHub Repo · 6 Kontributor',

      gameTitle: 'Game Development & Interactive Simulation',
      gameDesc:
        'Implementasi mekanik kontroler objek, manajemen state permainan, dan pola desain OOP menggunakan C# pada Unity Engine.',
      gameLinkRepo: 'Lihat Repository Game Dev',

      stackKicker: '04 · Kompetensi Teknis',
      stackTitleHtml: 'Tech <span class="editorial-italic">Stack.</span>',
      stackSub:
        'Teknologi yang digunakan pada repository project mobile, web, backend, game, dan keamanan aplikasi.',
      stackCol1Item1Ctx: 'UI deklaratif Material 3, MVVM, StateFlow, dan navigasi layar (SENORITA)',
      stackCol1Item2Ctx: 'Expo Router multi-zona, NativeWind, dan expo-camera (Hotel App)',
      stackCol1Item3Ctx: 'Game 3D CharacterController, inventori ScriptableObject, dan OOP',
      stackCol2Item1Ctx: 'Antarmuka web SPA interaktif, game browser, dan UI responsif',
      stackCol2Item2Ctx: 'Server ThreadingHTTPServer, layanan backend, dan endpoint JSON',
      stackCol2Item3Ctx: 'Database relasional/NoSQL serta AsyncStorage dan SharedPreferences',
      stackCol3Item1Ctx: 'Ekstraksi 8 fitur leksikal URL, skor risiko, dan deteksi HTTPS/IP',
      stackCol3Item2Title: 'Web Security & Autentikasi',
      stackCol3Item2Ctx: 'Validasi input ketat, pemisahan akses rute, dan dasar OWASP Top 10',
      stackCol3Item3Ctx: 'Kolaborasi tim, kontainerisasi, troubleshooting Linux/Windows, dan deploy',

      contactKicker: '05 · Kolaborasi',
      contactTitleHtml: 'Kontak <span class="editorial-italic">&amp; Profil.</span>',
      contactSub: 'Hubungi untuk peluang magang, kolaborasi project, atau diskusi teknis.',
      contactLeftHeading: 'Kolaborasi & Rekrutmen',
      contactLeftDesc:
        'Tertarik mendiskusikan kesempatan magang, posisi junior developer, atau meninjau detail teknis dari aplikasi SENORITA dan perangkat analisis keamanan? Silakan hubungi saya langsung melalui email, WhatsApp, atau tautan kontak di samping.',
      contactBtnEmail: 'Kirim Email Langsung',
      contactBtnWa: 'Chat WhatsApp',
      contactRightHeading: 'Tautan Langsung',
      contactRightSub: 'Saluran aktif untuk komunikasi dan peninjauan kode.',

      footerBackTop: 'Kembali ke atas',
      modalClose: 'Tutup'
    },

    en: {
      pageTitle: 'Dimas Pradhitya | App Developer & Cybersecurity',
      pageDesc:
        'Portfolio of Dimas Pradhitya: Informatics undergraduate at Universitas Multimedia Nusantara (UMN) focused on cross-platform software engineering (Mobile, Web, Database) and Application Security.',
      skipLink: 'Skip to main content',
      navAbout: 'About',
      navProfile: 'Profile',
      navProjects: 'Projects',
      navStack: 'Stack',
      navContact: 'Contact',
      mobileNavProfile: 'Profile & Bio',
      mobileNavProjects: 'Case Studies & Projects',
      mobileNavStack: 'Tech Stack',
      langSwitchAria: 'Switch language to Indonesian',

      heroKicker: "Hello, I'm",
      heroStatus: 'Open to Internships & Collaboration',
      heroDesc:
        'Informatics student at Universitas Multimedia Nusantara (UMN) focused on cross-platform software engineering (Mobile, Web, and Database) with a strong emphasis on Application Security.',
      heroBtnProjects: 'View Projects',
      heroBtnCv: 'View CV',
      heroBtnContact: 'Contact',
      heroFindMe: 'Find Me',
      heroScrollCue: 'Scroll to introduction',
      lanyardHint: 'Drag or move cursor over the card',

      profileKicker: '01 · Experience & Approach',
      profileTitleHtml: 'About <span class="editorial-italic">Me.</span>',
      aboutExpKicker: 'Experience & Collaboration',
      aboutExpLead: 'Building real products in teams.',
      aboutExpText:
        'Experienced in designing and shipping collaborative software projects, ranging from the SENORITA mobile app and Fantasticpart2 web exploration game with Team Fantastic 4 to a malicious URL phishing analyzer and serving as a Committee member for UMN Festival 2025.',
      aboutEngKicker: 'Engineering Practice',
      aboutEngLead: 'Structured from architecture to security checks.',
      aboutEngText:
        'Comfortable separating state cleanly with MVVM on mobile apps, enforcing strict input validation and reliable database flows, and testing foundational OWASP Top 10 security risks before shipping features.',
      detailLocLabel: 'Location',
      detailLocValue: 'Tangerang, Indonesia',
      detailLangLabel: 'Core Languages',
      detailLangValue: 'Kotlin, JS, C#, SQL',
      detailCollabLabel: 'Workflow',
      detailCollabValue: 'Git & Cross-Role Teams',
      detailCampusLabel: 'Campus Activities',
      detailCampusValue: 'Projects & UMN Committees',

      cvKicker: 'Curriculum Vitae · PDF (EN / ID)',
      cvTitle: "Dimas Pradhitya's Curriculum Vitae",
      cvDesc:
        'Available in both English (ATS-friendly) and Indonesian PDF versions, ready to view or download.',
      cvBtnOpen: 'Open CV (EN)',
      cvBtnDownload: 'Download PDF',
      cvBtnAlt: 'CV (Indonesian)',

      orgKicker: '02 · Campus Organizations & Leadership',
      orgTitleHtml: 'Organizations<span class="editorial-italic">.</span>',
      orgSub:
        'Track record of campus organizations, event committees, and official certificates during my Informatics studies at Universitas Multimedia Nusantara (click any certificate to preview).',
      org1Date: 'UMN Committee · 2025',
      org1Title: 'UMN Festival 2025',
      org1Issuer: 'Committee · Universitas Multimedia Nusantara (Feb 2, 2026)',
      org1Cat: 'UMN Committee',
      org1ModalTitle: 'UMN Festival 2025 (Committee)',
      org1ModalDesc:
        'Certificate of Appreciation for contributing as a Committee member during UMN Festival 2025 at Universitas Multimedia Nusantara (Tangerang, February 2, 2026).',
      org2Date: 'HMIF · PPIF UMN 2026',
      org2Title: 'Informatics Orientation Program (PPIF)',
      org2Issuer: 'Member of Module · HMIF Universitas Multimedia Nusantara',
      org2Cat: 'HMIF · PPIF UMN',
      org2ModalTitle: 'PPIF Informatics UMN 2026 (Member of Module)',
      org2ModalDesc:
        'Certificate of Appreciation for contributing as a Member of Module for the Informatics Department Orientation Program (PPIF) UMN 2026 with HMIF Universitas Multimedia Nusantara.',

      projKicker: '03 · Selected Work',
      projTitleHtml: 'Case Studies <span class="editorial-italic">&amp; Projects.</span>',
      projSub:
        'Problem breakdowns, technical architecture, and shipped implementations backed by GitHub repositories and live interactive demos.',
      filterAll: 'All (5)',
      filterMobile: 'Mobile App (2)',
      filterCyber: 'Cybersecurity (1)',
      filterGame: 'Game (2)',
      emptyStateText: 'No projects match this category yet.',
      emptyStateBtn: 'Show All Projects',

      senoritaTitle: 'SENORITA: Food & Beverage Ordering App',
      senoritaP1Html:
        '<strong>Problem:</strong> Dine-In and Take Away ordering required branch selection, menu customization, strict form validation, and live order tracking without cart state collisions.',
      senoritaP2Html:
        '<strong>Technical Approach:</strong> Built a modular MVVM architecture with 6 dedicated ViewModels, reactive StateFlow pipelines, and dynamic NavHost routing across 15+ Jetpack Compose screens.',
      senoritaP3Html:
        '<strong>Implementation:</strong> Input validation suite (Email, 10+ digit phone, 4-digit OTP), custom Material 3 theme tokens, table QR scanner mockup, and digital receipt generation.',
      senoritaLink: 'View SENORITA Source Code & Docs',
      senoritaArchCaption: 'Layer Architecture',
      senoritaLayer1Scope: '15+ Screens',
      senoritaLayer2Scope: '6 ViewModels',
      senoritaLayer3Scope: 'Local',

      urlTitle: 'URL Phishing Detector',
      urlP1Html:
        '<strong>Problem:</strong> Phishing links routinely disguise spoofed domains using excessive path lengths, inserted digits or hyphens, and raw IP hosts to deceive users.',
      urlP2Html:
        '<strong>Technical Approach:</strong> Engineered a Python backend (<code>ThreadingHTTPServer</code>) exposing <code>GET /api/health</code> and <code>POST /api/predict</code> endpoints wired to the PhishGuard AI web interface (HTML, CSS, JavaScript).',
      urlP3Html:
        '<strong>Core Features:</strong> Extracts 8 lexical URL features (<code>path_length</code>, <code>url_length</code>, <code>num_dots</code>, <code>num_hyphens</code>, <code>num_digits</code>, <code>has_https</code>, <code>has_ip</code>), checks trusted domains, and computes risk scores with a <em>lexical fallback</em> engine when the Random Forest model is unavailable.',
      urlLinkRepo: 'View URL Detector Source Code',
      urlLinkDemo: 'Open Live Demo (Vercel)',
      urlVisualCaption: 'Detection Feature Weights',
      urlVisualMeta: 'Code Metrics · app.py',

      fantasticTitle: 'Fantasticpart2: Web City Exploration Game',
      fantasticP1Html:
        '<strong>Concept:</strong> Collaborative 4-developer team project (Team Fantastic 4) featuring selectable characters with distinct <em>weakness</em> and <em>strength</em> traits for varied playstyles.',
      fantasticP2Html:
        '<strong>Gameplay Mechanics:</strong> Players explore multiple cities while managing depleting status bars; players must collect all items across every city before any status bar reaches <code>0</code> (<em>game over</em>).',
      fantasticP3Html:
        '<strong>Implementation &amp; Deployment:</strong> Built as a responsive web SPA using JavaScript, CSS, and HTML, configured for root SPA routing on Vercel.',
      fantasticLinkRepo: 'View GitHub Repository',
      fantasticLinkDemo: 'Open Live Demo (Vercel)',
      fantasticVisualCaption: 'Language Breakdown',
      fantasticVisualMeta: 'GitHub Repo · 4 Contributors',

      hotelTitle: 'Hotel Booking & Management: Mobile Reservation App',
      hotelP1Html:
        '<strong>Concept &amp; Structure:</strong> 6-developer team project organized into three distinct route zones (<code>auth</code>, <code>guest</code>, and <code>admin</code>) powered by file-based routing in Expo Router.',
      hotelP2Html:
        '<strong>Key Features:</strong> End-to-end authentication (<em>login</em> &amp; <em>register</em>), room discovery and detail views, booking confirmation and history, plus an admin dashboard for rooms, bookings, and scanning (<code>expo-camera</code>).',
      hotelP3Html:
        '<strong>Technical Architecture:</strong> Written in TypeScript (98.2%) with React Native (Expo 54), NativeWind/Tailwind CSS, modular API services under <code>services/</code> (<code>api</code>, <code>auth</code>, <code>hotel</code>, <code>booking</code>, <code>admin</code>), and <code>AsyncStorage</code>.',
      hotelLinkRepo: 'View GitHub Repository',
      hotelVisualCaption: 'Language Breakdown',
      hotelVisualMeta: 'GitHub Repo · 6 Contributors',

      gameTitle: 'Game Development & Interactive Simulation',
      gameDesc:
        '3D third-person controller mechanics, game state management, ScriptableObject inventory, and OOP patterns built with C# in Unity Engine.',
      gameLinkRepo: 'View Game Dev Repository',

      stackKicker: '04 · Technical Capabilities',
      stackTitleHtml: 'Tech <span class="editorial-italic">Stack.</span>',
      stackSub:
        'Technologies applied across mobile, web, backend, game development, and application security repositories.',
      stackCol1Item1Ctx: 'Declarative Material 3 UI, MVVM, StateFlow, and multi-screen navigation (SENORITA)',
      stackCol1Item2Ctx: 'Multi-zone Expo Router, NativeWind styling, and expo-camera (Hotel App)',
      stackCol1Item3Ctx: '3D CharacterController gameplay, ScriptableObject inventory, and OOP',
      stackCol2Item1Ctx: 'Interactive web SPAs, browser games, and responsive user interfaces',
      stackCol2Item2Ctx: 'ThreadingHTTPServer services, backend APIs, and JSON endpoints',
      stackCol2Item3Ctx: 'Relational & NoSQL databases plus AsyncStorage and SharedPreferences',
      stackCol3Item1Ctx: '8-feature lexical URL extraction, risk scoring, and HTTPS/IP checks',
      stackCol3Item2Title: 'Web Security & Authentication',
      stackCol3Item2Ctx: 'Strict input validation, role-based route separation, and OWASP Top 10 fundamentals',
      stackCol3Item3Ctx: 'Team Git workflows, containerization, Linux/Windows troubleshooting, and deployments',

      contactKicker: '05 · Collaboration',
      contactTitleHtml: 'Contact <span class="editorial-italic">&amp; Links.</span>',
      contactSub: 'Reach out for internships, junior developer roles, or technical discussions.',
      contactLeftHeading: 'Collaboration & Recruitment',
      contactLeftDesc:
        'Interested in discussing internship opportunities, junior software roles, or diving into the technical details of SENORITA and my security tools? Reach out directly via email, WhatsApp, or the links alongside.',
      contactBtnEmail: 'Send Email Directly',
      contactBtnWa: 'Chat on WhatsApp',
      contactRightHeading: 'Direct Links',
      contactRightSub: 'Active channels for communication and code review.',

      footerBackTop: 'Back to top',
      modalClose: 'Close'
    }
  };

  /**
   * Mengelola pergantian bahasa Indonesia (ID) dan Inggris (EN) dengan dukungan URL (?lang=en) serta localStorage.
   */
  class LanguageController {
    constructor(options) {
      this.button = document.getElementById(options.buttonId || 'langToggleBtn');
      this.storageKey = options.storageKey || 'portfolio-lang';
      this.onLanguageChange = options.onLanguageChange || null;
      this.root = document.documentElement;
      this.metaDesc = document.querySelector('meta[name="description"]');
      this.currentLang = 'id';
    }

    getInitialLang() {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryLang = (params.get('lang') || '').toLowerCase();
        if (queryLang === 'en' || queryLang === 'id') {
          return queryLang;
        }
      } catch (err) {
        // Abaikan jika URLSearchParams tidak tersedia
      }

      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved === 'en' || saved === 'id') {
          return saved;
        }
      } catch (err) {
        // Abaikan jika localStorage dibatasi
      }

      return 'id';
    }

    syncCertificateAttributes(dict) {
      const cert1 = document.querySelector('[data-cert-index="01"]');
      if (cert1) {
        cert1.setAttribute('data-cert-category', dict.org1Cat);
        cert1.setAttribute('data-cert-title', dict.org1ModalTitle);
        cert1.setAttribute('data-cert-desc', dict.org1ModalDesc);
      }

      const cert2 = document.querySelector('[data-cert-index="02"]');
      if (cert2) {
        cert2.setAttribute('data-cert-category', dict.org2Cat);
        cert2.setAttribute('data-cert-title', dict.org2ModalTitle);
        cert2.setAttribute('data-cert-desc', dict.org2ModalDesc);
      }
    }

    syncCvLinks(lang) {
      const openBtn = document.getElementById('cvOpenBtn');
      const dlBtn = document.getElementById('cvDownloadBtn');
      const altBtn = document.getElementById('cvAltBtn');
      const isEn = lang === 'en';
      const primaryHref = isEn
        ? 'assets/cv-dimas-pradhitya-en.pdf?v=20261125a'
        : 'assets/cv-dimas-pradhitya.pdf?v=20261123b';
      const altHref = isEn
        ? 'assets/cv-dimas-pradhitya.pdf?v=20261123b'
        : 'assets/cv-dimas-pradhitya-en.pdf?v=20261125a';
      const dlFilename = isEn ? 'CV-Dimas-Pradhitya-EN.pdf' : 'CV-Dimas-Pradhitya-ID.pdf';

      if (openBtn) openBtn.setAttribute('href', primaryHref);
      if (dlBtn) {
        dlBtn.setAttribute('href', primaryHref);
        dlBtn.setAttribute('download', dlFilename);
      }
      if (altBtn) altBtn.setAttribute('href', altHref);
    }

    apply(lang) {
      const safeLang = lang === 'en' ? 'en' : 'id';
      const dict = TRANSLATIONS[safeLang];
      this.currentLang = safeLang;

      this.root.setAttribute('lang', safeLang);
      document.title = dict.pageTitle;
      if (this.metaDesc) {
        this.metaDesc.setAttribute('content', dict.pageDesc);
      }

      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (key && Object.prototype.hasOwnProperty.call(dict, key)) {
          el.textContent = dict[key];
        }
      });

      document.querySelectorAll('[data-i18n-html]').forEach((el) => {
        const key = el.getAttribute('data-i18n-html');
        if (key && Object.prototype.hasOwnProperty.call(dict, key)) {
          el.innerHTML = dict[key];
        }
      });

      this.syncCertificateAttributes(dict);
      this.syncCvLinks(safeLang);

      if (this.button) {
        this.button.setAttribute('aria-label', dict.langSwitchAria);
        this.button.setAttribute('data-active-lang', safeLang);
        this.button.querySelectorAll('[data-lang-opt]').forEach((opt) => {
          const isCurrent = opt.getAttribute('data-lang-opt') === safeLang;
          opt.classList.toggle('is-active', isCurrent);
        });
      }

      if (typeof this.onLanguageChange === 'function') {
        this.onLanguageChange(safeLang);
      }
    }

    toggle() {
      const nextLang = this.currentLang === 'id' ? 'en' : 'id';
      this.apply(nextLang);
      try {
        localStorage.setItem(this.storageKey, nextLang);
      } catch (err) {
        // Abaikan jika penyimpanan browser dibatasi
      }
    }

    init() {
      this.apply(this.getInitialLang());
      if (this.button) {
        this.button.addEventListener('click', () => this.toggle());
      }
    }
  }

  Portfolio.LanguageController = LanguageController;
})(window);
