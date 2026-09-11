// DeutscheLernen - Single Page Web Application Logic (Serverless & Offline-Ready)

(function () {
  'use strict';

  // State Management
  const state = {
    currentRoute: 'home',
    currentDocPath: null,
    searchQuery: '',
    theme: localStorage.getItem('dl_theme') || 'dark',
    timerInterval: null,
    timerSeconds: 15 * 60,
    timerRemaining: 15 * 60,
    timerRunning: false,
    timerCurrentStep: 1, // 1: Grammatik (0-5m), 2: Satzbau (5-10m), 3: Praxis (10-15m)
    currentWorkbookLevel: 'A1',
    currentWorkbookPage: 1,
    currentWorkbookTab: 'toc', // 'toc', 'notes', 'cheatsheet'
    currentWorkbookViewMode: 'worksheet', // 'worksheet', 'editor', 'pdf', 'split'
    workbookAnswers: {},
    workbookCheckResult: null,
    workbookShowSolutions: false,
    customEditorText: '',
    activeCustomWorksheet: null,
    sentenceBuilderState: {
      subject: 'Ich bin',
      adjective: 'froh',
      clause: 'weil ich heute viel Deutsch gelernt habe.'
    },
  };

  // DOM Elements Cache
  let elements = {};

  // Initialize Application
  function init() {
    cacheElements();
    applyTheme(state.theme);
    renderSidebarNav();
    bindEvents();
    handleRouting();
    initSpeechSynthesis();
    updateTimerDisplay();
  }

  function cacheElements() {
    elements = {
      appContainer: document.getElementById('app-container'),
      sidebar: document.getElementById('sidebar'),
      sidebarNav: document.getElementById('sidebar-nav'),
      sidebarToggleBtn: document.getElementById('sidebar-toggle-btn'),
      searchInput: document.getElementById('sidebar-search-input'),
      breadcrumbCurrent: document.getElementById('breadcrumb-current'),
      mainScrollArea: document.getElementById('main-scroll-area'),
      contentArea: document.getElementById('content-area'),
      tocPanel: document.getElementById('toc-panel'),
      tocList: document.getElementById('toc-list'),
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      readingProgress: document.getElementById('reading-progress'),
      homeNavBtn: document.getElementById('nav-home-btn'),
      cheatsheetNavBtn: document.getElementById('nav-cheatsheet-btn'),
      workbooksNavBtn: document.getElementById('nav-workbooks-btn'),
      listenCurrentBtn: document.getElementById('listen-current-btn'),
      // Top Header Timer elements
      topTimerDisplay: document.getElementById('top-timer-display'),
      topTimerStepBadge: document.getElementById('top-timer-step-badge'),
      topTimerToggleBtn: document.getElementById('top-timer-toggle-btn'),
    };
  }

  function bindEvents() {
    // Hash Routing
    window.addEventListener('hashchange', handleRouting);

    // Sidebar Search Filter
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      renderSidebarNav();
    });

    // Theme Toggle
    elements.themeToggleBtn.addEventListener('click', toggleTheme);

    // Mobile Sidebar Toggle
    elements.sidebarToggleBtn.addEventListener('click', () => {
      elements.sidebar.classList.toggle('open');
    });

    // Close sidebar on outside click on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && elements.sidebar.classList.contains('open')) {
        if (!elements.sidebar.contains(e.target) && !elements.sidebarToggleBtn.contains(e.target)) {
          elements.sidebar.classList.remove('open');
        }
      }
    });

    // Scroll Progress
    elements.mainScrollArea.addEventListener('scroll', updateReadingProgress);

    // Quick Action: Listen to selected text
    if (elements.listenCurrentBtn) {
      elements.listenCurrentBtn.addEventListener('click', () => {
        const selected = window.getSelection().toString().trim();
        if (selected) {
          speakGerman(selected);
        } else {
          // Speak page title or current heading
          const h1 = elements.contentArea.querySelector('h1');
          if (h1) speakGerman(h1.innerText);
        }
      });
    }
  }

  // =========================================================================
  // Routing
  // =========================================================================

  function handleRouting() {
    const hash = window.location.hash.slice(1) || 'home';
    state.currentRoute = hash;

    // Close sidebar on mobile on route change
    if (window.innerWidth <= 768) {
      elements.sidebar.classList.remove('open');
    }

    if (hash === 'home') {
      state.currentDocPath = null;
      renderDashboard();
      updateActiveNavItem(elements.homeNavBtn);
      elements.breadcrumbCurrent.textContent = 'Übersicht & Lernleitfaden';
      hideToc();
    } else if (hash === 'cheatsheet') {
      state.currentDocPath = null;
      renderCheatsheet();
      updateActiveNavItem(elements.cheatsheetNavBtn);
      elements.breadcrumbCurrent.textContent = 'Master-Spickzettel (Genus & Kasus)';
      hideToc();
    } else if (hash === 'workbooks' || hash.startsWith('workbooks:')) {
      state.currentDocPath = null;
      const parts = hash.split(':');
      const level = parts[1] || state.currentWorkbookLevel || 'A1';
      const page = parts[2] ? parseInt(parts[2], 10) : 1;
      renderWorkbookStudio(level, page);
      updateActiveNavItem(elements.workbooksNavBtn);
      elements.breadcrumbCurrent.textContent = `Arbeitsbuch & Übungsstudio (${level === 'A1_PRACTICAL' ? 'Praxis-Satzbau' : level})`;
      hideToc();
    } else if (hash.startsWith('doc:')) {
      const docPath = decodeURIComponent(hash.substring(4));
      state.currentDocPath = docPath;
      loadDocument(docPath);
    } else {
      renderDashboard();
      updateActiveNavItem(elements.homeNavBtn);
    }
  }

  function updateActiveNavItem(activeElement) {
    document.querySelectorAll('.nav-item-btn, .nav-sub-item').forEach(el => {
      el.classList.remove('active');
    });
    if (activeElement) {
      activeElement.classList.add('active');
    }
  }

  // =========================================================================
  // Theme Toggle
  // =========================================================================

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dl_theme', theme);
    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.innerHTML = theme === 'dark' 
        ? '☀️ <span class="hide-mobile">Hell</span>' 
        : '🌙 <span class="hide-mobile">Dunkel</span>';
    }
  }

  function toggleTheme() {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  // =========================================================================
  // Sidebar Navigation Rendering
  // =========================================================================

  function renderSidebarNav() {
    if (!window.LEARNING_MANIFEST) return;
    const manifest = window.LEARNING_MANIFEST;
    const q = state.searchQuery;
    let html = '';

    manifest.paths.forEach((path) => {
      let matchingLevels = [];
      let matchingFiles = [];

      if (path.levels) {
        matchingLevels = path.levels.filter(lvl => {
          if (!q) return true;
          const matchLvl = lvl.name.toLowerCase().includes(q) || lvl.summary.toLowerCase().includes(q);
          const hasMatchingFile = lvl.files.some(f => f.title.toLowerCase().includes(q) || f.path.toLowerCase().includes(q));
          return matchLvl || hasMatchingFile;
        });
      }

      if (path.files) {
        matchingFiles = path.files.filter(f => {
          if (!q) return true;
          return f.title.toLowerCase().includes(q) || (f.desc && f.desc.toLowerCase().includes(q)) || f.path.toLowerCase().includes(q);
        });
      }

      if (q && matchingLevels.length === 0 && matchingFiles.length === 0) {
        return;
      }

      html += `<div class="nav-section-title">${path.name}</div>`;

      // Pfad A: CEFR Levels
      if (matchingLevels.length > 0) {
        matchingLevels.forEach(lvl => {
          const isCurrentInLevel = state.currentDocPath && lvl.files.some(f => f.path === state.currentDocPath);
          const collapsed = !q && !isCurrentInLevel;

          html += `
            <div class="nav-level-group ${collapsed ? 'collapsed' : ''}" id="group-${lvl.id}">
              <button class="nav-level-header" onclick="window.DL.toggleGroup('group-${lvl.id}')">
                <span class="nav-level-header-title">
                  <strong class="nav-level-header-badge">${lvl.id}</strong>
                  <span class="nav-level-header-label">· ${lvl.name.replace(/Stufe [A-Z0-9]+ /, '')}</span>
                </span>
                <span class="arrow-icon">▼</span>
              </button>
              <div class="nav-sub-list">
          `;

          lvl.files.forEach(f => {
            const isActive = state.currentDocPath === f.path ? 'active' : '';
            html += `
              <button class="nav-sub-item ${isActive}" onclick="window.location.hash='#doc:${encodeURIComponent(f.path)}'">
                <span>${f.title}</span>
                <span class="badge-tag badge-${f.type}">${f.badge}</span>
              </button>
            `;
          });

          html += `
              </div>
            </div>
          `;
        });
      }

      // Pfad B & C: File lists
      if (matchingFiles.length > 0) {
        matchingFiles.forEach(f => {
          const isActive = state.currentDocPath === f.path ? 'active' : '';
          html += `
            <button class="nav-sub-item ${isActive}" onclick="window.location.hash='#doc:${encodeURIComponent(f.path)}'" style="padding: 0.5rem 0.75rem;">
              <span>${f.icon} ${f.title}</span>
              <span class="badge-tag badge-${f.type}">${f.badge}</span>
            </button>
          `;
        });
      }
    });

    elements.sidebarNav.innerHTML = html;
  }

  function toggleGroup(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.toggle('collapsed');
    }
  }

  // =========================================================================
  // Main Dashboard View (Directions & Pedagogical Framework)
  // =========================================================================

  function renderDashboard() {
    const html = `
      <div class="markdown-body">
        <!-- Hero Section -->
        <div class="dashboard-hero">
          <div class="hero-badge">
            <span>🇩🇪</span> Interaktives DaF-Lernportal
          </div>
          <h1 class="hero-title">DeutscheLernen: Dein Umfassendes Lernsystem</h1>
          <p class="hero-quote">
            „Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.“ — Ludwig Wittgenstein
          </p>
          <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6;">
            Willkommen im Lernportal! Entwickelt nach bewährten DaF-Prinzipien (Deutsch als Fremdsprache): 
            <strong>zeiteffizient, strukturiert und sofort in Alltag und Beruf anwendbar</strong>. 
            Alle Originalunterlagen bleiben als saubere Markdown-Dateien erhalten und stehen dir hier direkt im Browser zur Verfügung.
          </p>
          <div class="hero-stats-row">
            <div class="hero-stat-item">
              <h3>A1 – C2</h3>
              <p>6 CEFR Stufen</p>
            </div>
            <div class="hero-stat-item">
              <h3>8 Sektoren</h3>
              <p>Berufliche Sprache</p>
            </div>
            <div class="hero-stat-item">
              <h3>4 Module</h3>
              <p>Redewendungen & Kultur</p>
            </div>
            <div class="hero-stat-item">
              <h3>15 Min / Tag</h3>
              <p>Oben im Timer aktiv</p>
            </div>
          </div>
        </div>

        <!-- Directions Section -->
        <div class="section-heading">
          <h2>🧭 Wie du das Lernsystem optimal nutzt</h2>
          <p>Drei komplementäre Lernpfade greifen nahtlos ineinander. Wähle deinen Schwerpunkt:</p>
        </div>

        <div class="paths-grid">
          <!-- Pfad A Card -->
          <div class="path-card">
            <div class="path-card-header">
              <div class="path-icon-wrapper" style="color: var(--color-primary);">🎓</div>
              <span class="badge-tag badge-grammar">CEFR A1 – C2</span>
            </div>
            <h3>Pfad A: Der Akademische Sprachpfad</h3>
            <p>Konsequenter Aufbau von Stufe A1 bis C2. Jedes Level basiert auf zwei konsolidierten Säulen:</p>
            <ul class="path-directions-list">
              <li>
                <span>📖</span>
                <span><strong>Grammatik.md:</strong> Lerne die Universal-Triade (der/die/das), Nomen-Pronomen-Austausch und nutze die <em>Fragesektionen („Wie frage ich danach?“)</em>.</span>
              </li>
              <li>
                <span>🗂️</span>
                <span><strong>Vocabulary.md:</strong> Thematischer Wortschatz mit Genus, Plural und 5–6 Beispielsätzen pro Wort.</span>
              </li>
            </ul>
            <div class="path-card-actions">
              <button class="header-btn primary" onclick="window.location.hash='#doc:A1/Grammatik.md'">
                Zu A1 Grammatik starten
              </button>
              <button class="header-btn" onclick="window.location.hash='#doc:A1/README.md'">
                A1 Leitfaden
              </button>
            </div>
          </div>

          <!-- Pfad B Card -->
          <div class="path-card">
            <div class="path-card-header">
              <div class="path-icon-wrapper" style="color: var(--color-business);">💼</div>
              <span class="badge-tag badge-business">8 Berufsfelder</span>
            </div>
            <h3>Pfad B: Berufliche Sprache (Business)</h3>
            <p>Bereitet dich zielgerichtet auf den deutschsprachigen Arbeitsmarkt vor. Wächst in 3 Stufen:</p>
            <ul class="path-directions-list">
              <li>
                <span>1️⃣</span>
                <span><strong>Stufe 1 (Alltag):</strong> Routinen, Begrüßung, E-Mail-Muster, Krankmeldung.</span>
              </li>
              <li>
                <span>2️⃣</span>
                <span><strong>Stufe 2 (Team & Projekte):</strong> Standups, PR-Reviews, Meilensteine, Feedback.</span>
              </li>
              <li>
                <span>3️⃣</span>
                <span><strong>Stufe 3 (Führung & Strategie):</strong> Verhandlung, KPIs, Vorstandsberichte.</span>
              </li>
            </ul>
            <div class="path-card-actions">
              <button class="header-btn primary" onclick="window.location.hash='#doc:berufliche_sprache/02_IT_Software_und_Tech.md'">
                IT & Tech Berufsdeutsch
              </button>
              <button class="header-btn" onclick="window.location.hash='#doc:berufliche_sprache/README.md'">
                Sektorübersicht
              </button>
            </div>
          </div>

          <!-- Pfad C Card -->
          <div class="path-card">
            <div class="path-card-header">
              <div class="path-icon-wrapper" style="color: var(--color-idiom);">🎭</div>
              <span class="badge-tag badge-idiom">Idiome & Kultur</span>
            </div>
            <h3>Pfad C: Redewendungen & Sprichwörter</h3>
            <p>Bildhafte deutsche Alltagssprache für flüssige, natürliche Konversation:</p>
            <ul class="path-directions-list">
              <li>
                <span>💡</span>
                <span><strong>Wörtliche Übersetzung & Herkunft:</strong> Verstehe die Kulturgeschichte hinter Redensarten.</span>
              </li>
              <li>
                <span>🎯</span>
                <span><strong>Sprachregister & Nuancen:</strong> Erkennen, ob salopp, umgangssprachlich oder bürotauglich.</span>
              </li>
              <li>
                <span>🔄</span>
                <span><strong>5–6 Pronomen-Sätze:</strong> Sofort aktive Anwendung in verschiedenen grammatischen Personen.</span>
              </li>
            </ul>
            <div class="path-card-actions">
              <button class="header-btn primary" onclick="window.location.hash='#doc:Redewendungen/01_Arbeit_und_Erfolg.md'">
                Arbeit & Erfolg Idiome
              <button class="header-btn" onclick="window.location.hash='#doc:Redewendungen/README.md'">
                Alle Redensarten
              </button>
            </div>
          </div>

          <!-- Pfad D Card -->
          <div class="path-card">
            <div class="path-card-header">
              <div class="path-icon-wrapper" style="color: var(--color-gold);">📒</div>
              <span class="badge-tag badge-workbook">A1 – C1 Skripte</span>
            </div>
            <h3>Praktische Werkbücher & Skripte</h3>
            <p>Vollständige PDF-Grammatikskripte und praktische Übungsarbeitsbücher direkt im Portal:</p>
            <ul class="path-directions-list">
              <li>
                <span>📒</span>
                <span><strong>PDF-Skripte (A1 – C1):</strong> Originale Arbeitsbücher zum Lernen, Nachschlagen und Downloaden.</span>
              </li>
              <li>
                <span>✍️</span>
                <span><strong>Praktisches WerkBuch:</strong> Praxisbeispiele und Übungssätze aus EinfachDeutsch.</span>
              </li>
              <li>
                <span>📥</span>
                <span><strong>Direkt-Anzeige & Download:</strong> PDFs direkt im Browser durchblättern oder lokal sichern.</span>
              </li>
            </ul>
            <div class="path-card-actions">
              <button class="header-btn primary" onclick="window.location.hash='#workbooks:A1'">
                📘 Arbeitsbuch-Studio (A1-C1)
              </button>
              <button class="header-btn" onclick="window.location.hash='#workbooks:A1_PRACTICAL'">
                ✍️ Satzbau-Studio (Praxis)
              </button>
          <!-- Pfad E Card: Prüfungszentrum & telc Zertifikate -->
          <div class="path-card" style="border-color: #ec4899;">
            <div class="path-card-header">
              <div class="path-icon-wrapper" style="color: #ec4899;">🎯</div>
              <span class="badge-tag" style="background: rgba(236, 72, 153, 0.15); color: #ec4899;">telc & Goethe Hub</span>
            </div>
            <h3>Prüfungszentrum & telc Zertifikate</h3>
            <p>Vollständige Modelltests, offizielle telc Wortschatzlisten und Fachsprachprüfungen:</p>
            <ul class="path-directions-list">
              <li>
                <span>🎯</span>
                <span><strong>telc B1 & B2 Beruf Modelltests:</strong> Originalgetreue Komplettprüfungen mit allen Teilen und Lösungen.</span>
              </li>
              <li>
                <span>📖</span>
                <span><strong>Bilinguale Wortschatzlisten:</strong> Offizieller telc A1–B1 Wortschatz mit englischer Übersetzung & Verbenliste.</span>
              </li>
              <li>
                <span>🩺</span>
                <span><strong>Fachsprachen & Hochschule:</strong> telc Pflege/Medizin (Anamnese, ISBAR) & telc C1 Hochschule Wissenschaftssprache.</span>
              </li>
              <li>
                <span>🗺️</span>
                <span><strong>telc Curriculum & Downloads:</strong> Stufenweiser Lernfortschritt mit direkten Links zum Downloadbereich.</span>
              </li>
            </ul>
            <div class="path-card-actions">
              <button class="header-btn primary" style="background: #ec4899;" onclick="window.location.hash='#doc:Pruefung/telc_B1_ZertifikatDeutsch_Modelltest.md'">
                🎯 telc B1 Modelltest
              </button>
              <button class="header-btn" onclick="window.location.hash='#doc:Pruefung/telc_Wortschatz_A1_B1_Bilingual.md'">
                📖 Wortschatz (Bilingual)
              </button>
              <button class="header-btn" onclick="window.location.hash='#doc:Pruefung/Lernfortschritt_telc_Curriculum.md'">
                🗺️ telc Curriculum
              </button>
            </div>
          </div>
        </div>

        <!-- 15-Minute Daily Routine Guide (Timer is at the top of the page!) -->
        <div class="routine-box">
          <div class="routine-header">
            <div>
              <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.25rem;">
                🎯 Der 15-Minuten-Erfolgsplan (Tägliche Routine)
              </h3>
              <p style="font-size: 0.88rem; color: var(--text-secondary);">
                Dein Timer oben in der Leiste führt dich Schritt für Schritt durch die 3 täglichen Phasen:
              </p>
            </div>
            <div>
              <button class="header-btn primary" onclick="window.DL.toggleTimer()">
                ⏱️ Oben im Header starten
              </button>
            </div>
          </div>

          <div class="routine-steps-grid">
            <div class="routine-step-card" id="step-card-1">
              <div class="routine-step-num">Phase 1 (Minuten 0 – 5)</div>
              <h4>5 Min: Grammatik & Triade</h4>
              <p>Öffne dein aktuelles Grammatikkapitel und lies die Universal-Triade (der/die/das) laut vor.</p>
              <button class="header-btn" style="margin-top: 0.75rem; font-size: 0.76rem;" onclick="window.location.hash='#doc:A1/Grammatik.md'">
                📖 Grammatik öffnen
              </button>
            </div>

            <div class="routine-step-card" id="step-card-2">
              <div class="routine-step-num">Phase 2 (Minuten 5 – 10)</div>
              <h4>5 Min: Satzbau & Fragen</h4>
              <p>Bilde 3 Aussagen und formuliere dazu 3 Fragen mit der passenden Fragesektion („Wie frage ich danach?“).</p>
              <button class="header-btn" style="margin-top: 0.75rem; font-size: 0.76rem;" onclick="window.location.hash='#doc:A2/Grammatik.md'">
                ❓ Fragesektionen üben
              </button>
            </div>

            <div class="routine-step-card" id="step-card-3">
              <div class="routine-step-num">Phase 3 (Minuten 10 – 15)</div>
              <h4>5 Min: Praxis & Kultur</h4>
              <p>Lerne 2 Business-Formulierungen für das Büro oder 1 bildhafte Redewendung für deinen aktiven Wortschatz.</p>
              <button class="header-btn" style="margin-top: 0.75rem; font-size: 0.76rem;" onclick="window.location.hash='#doc:berufliche_sprache/01_Allgemeine_Buerokommunikation.md'">
                💼 Bürosprache öffnen
              </button>
            </div>
          </div>
        </div>

        <!-- Master Cheatsheet Preview Section -->
        <div class="cheatsheet-section">
          <div class="section-heading">
            <h2>⚡ Master-Spickzettel: Genus, Kasus & Pronomen</h2>
            <p>Die zwei wichtigsten Fundamente der deutschen Grammatik auf einen Blick:</p>
          </div>

          <div class="table-responsive">
            <table style="margin: 0;">
              <thead>
                <tr>
                  <th>Fall (Kasus)</th>
                  <th>Kontrollfrage</th>
                  <th>Maskulin (der)</th>
                  <th>Feminin (die)</th>
                  <th>Neutrum (das)</th>
                  <th>Plural (die)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Nominativ</strong></td>
                  <td><em>Wer / Was?</em></td>
                  <td><span class="gender-der">der</span> Tisch</td>
                  <td><span class="gender-die">die</span> Lampe</td>
                  <td><span class="gender-das">das</span> Buch</td>
                  <td><span style="color: var(--gender-pl); font-weight:600;">die</span> Kinder</td>
                </tr>
                <tr>
                  <td><strong>Akkusativ</strong></td>
                  <td><em>Wen / Was?</em></td>
                  <td><span class="gender-der">den</span> Tisch</td>
                  <td><span class="gender-die">die</span> Lampe</td>
                  <td><span class="gender-das">das</span> Buch</td>
                  <td><span style="color: var(--gender-pl); font-weight:600;">die</span> Kinder</td>
                </tr>
                <tr>
                  <td><strong>Dativ</strong></td>
                  <td><em>Wem?</em></td>
                  <td><span class="gender-der">dem</span> Tisch</td>
                  <td><span class="gender-die">der</span> Lampe</td>
                  <td><span class="gender-das">dem</span> Buch</td>
                  <td><span style="color: var(--gender-pl); font-weight:600;">den</span> Kindern (+n)</td>
                </tr>
                <tr>
                  <td><strong>Genitiv</strong></td>
                  <td><em>Wessen?</em></td>
                  <td><span class="gender-der">des</span> Tisches (+s)</td>
                  <td><span class="gender-die">der</span> Lampe</td>
                  <td><span class="gender-das">des</span> Buches (+s)</td>
                  <td><span style="color: var(--gender-pl); font-weight:600;">der</span> Kinder</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="text-align: center; margin-top: 1rem;">
            <button class="header-btn" onclick="window.location.hash='#cheatsheet'">
              🔍 Vollständigen Master-Spickzettel mit Pronomen anzeigen →
            </button>
          </div>
        </div>

      </div>
    `;

    elements.contentArea.innerHTML = html;
    elements.mainScrollArea.scrollTop = 0;
  }

  // =========================================================================
  // Cheatsheet View
  // =========================================================================

  function renderCheatsheet() {
    const html = `
      <div class="markdown-body">
        <h1>⚡ Der Master-Spickzettel: Genus, Kasus & Pronomen</h1>
        <p>Der Nomen-Pronomen-Austausch und die 4 Fälle sind der Schlüssel zur fehlerfreien deutschen Grammatik.</p>

        <h2>1. Die 4 Fälle im Deutschen (Deklination der bestimmten Artikel)</h2>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Fall</th>
                <th>Kontrollfrage</th>
                <th>Maskulin</th>
                <th>Feminin</th>
                <th>Neutrum</th>
                <th>Plural</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Nominativ</strong> (Subjekt)</td>
                <td><em>Wer / Was?</em></td>
                <td><span class="gender-der">der</span> Tisch</td>
                <td><span class="gender-die">die</span> Lampe</td>
                <td><span class="gender-das">das</span> Buch</td>
                <td>die Kinder</td>
              </tr>
              <tr>
                <td><strong>Akkusativ</strong> (Direktes Objekt)</td>
                <td><em>Wen / Was?</em></td>
                <td><span class="gender-der">den</span> Tisch</td>
                <td><span class="gender-die">die</span> Lampe</td>
                <td><span class="gender-das">das</span> Buch</td>
                <td>die Kinder</td>
              </tr>
              <tr>
                <td><strong>Dativ</strong> (Indirektes Objekt / Ort)</td>
                <td><em>Wem? / Wo?</em></td>
                <td><span class="gender-der">dem</span> Tisch</td>
                <td><span class="gender-die">der</span> Lampe</td>
                <td><span class="gender-das">dem</span> Buch</td>
                <td>den Kindern (+n)</td>
              </tr>
              <tr>
                <td><strong>Genitiv</strong> (Zugehörigkeit)</td>
                <td><em>Wessen?</em></td>
                <td><span class="gender-der">des</span> Tisches (+s)</td>
                <td><span class="gender-die">der</span> Lampe</td>
                <td><span class="gender-das">des</span> Buches (+s)</td>
                <td>der Kinder</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>2. Der Nomen-Pronomen-Austausch</h2>
        <p>Wie ersetze ich Nomen durch das grammatikalisch korrekte Pronomen?</p>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Genus / Nomen</th>
                <th>Nominativ (Subjekt)</th>
                <th>Akkusativ (Objekt)</th>
                <th>Dativ (Objekt)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Maskulin</strong> (der Kollege / der Tisch)</td>
                <td><strong>er</strong> (<em>Er</em> ist neu.)</td>
                <td><strong>ihn</strong> (Ich kenne <em>ihn</em>.)</td>
                <td><strong>ihm</strong> (Ich helfe <em>ihm</em>.)</td>
              </tr>
              <tr>
                <td><strong>Feminin</strong> (die Kollegin / die Lampe)</td>
                <td><strong>sie</strong> (<em>Sie</em> ist nett.)</td>
                <td><strong>sie</strong> (Ich sehe <em>sie</em>.)</td>
                <td><strong>ihr</strong> (Ich antworte <em>ihr</em>.)</td>
              </tr>
              <tr>
                <td><strong>Neutrum</strong> (das Kind / das Buch)</td>
                <td><strong>es</strong> (<em>Es</em> ist spannend.)</td>
                <td><strong>es</strong> (Ich lese <em>es</em>.)</td>
                <td><strong>ihm</strong> (Ich gebe <em>ihm</em> Zeit.)</td>
              </tr>
              <tr>
                <td><strong>Plural</strong> (die Kollegen / die Bücher)</td>
                <td><strong>sie</strong> (<em>Sie</em> sind da.)</td>
                <td><strong>sie</strong> (Ich besuche <em>sie</em>.)</td>
                <td><strong>ihnen</strong> (Ich danke <em>ihnen</em>.)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>3. Die Universal-Triade (Anwendungsmuster)</h2>
        <blockquote>
          <strong>Tipp:</strong> Verinnerliche die Triade nicht isoliert, sondern immer im Dreiklang:
          <br>1. <strong>Maskulin:</strong> <em>Der</em> Wagen ist schnell. Ich fahre <em>den</em> Wagen. Ich fahre mit <em>dem</em> Wagen.
          <br>2. <strong>Feminin:</strong> <em>Die</em> Datei ist groß. Ich speichere <em>die</em> Datei. Ich arbeite mit <em>der</em> Datei.
          <br>3. <strong>Neutrum:</strong> <em>Das</em> Meeting beginnt. Ich leite <em>das</em> Meeting. Ich nehme an <em>dem</em> Meeting teil.
        </blockquote>

        <div style="margin-top: 2rem;">
          <button class="header-btn primary" onclick="window.location.hash='#doc:A1/Grammatik.md'">
            📖 Zu A1 Grammatik wechseln →
          </button>
        </div>
      </div>
    `;

    elements.contentArea.innerHTML = html;
    elements.mainScrollArea.scrollTop = 0;
  }

  // =========================================================================
  // Document Loading (Instant Offline-Bundle with fetch fallback)
  // =========================================================================

  async function loadDocument(filePath) {
    showLoading();
    elements.breadcrumbCurrent.textContent = filePath;

    // Highlight active nav item
    renderSidebarNav();

    // Special handler for PDF files (Workbooks & Grammar Scripts)
    if (filePath.toLowerCase().endsWith('.pdf')) {
      let level = 'A1';
      if (filePath.includes('a2_skript')) level = 'A2';
      else if (filePath.includes('b1_skript')) level = 'B1';
      else if (filePath.includes('b2_skript')) level = 'B2';
      else if (filePath.includes('c1_skript')) level = 'C1';
      window.location.hash = `#workbooks:${level}`;
      return;
    }

    // Special handler for TXT files (Practical workbook notes)
    if (filePath.toLowerCase().endsWith('.txt')) {
      window.location.hash = '#workbooks:A1_PRACTICAL';
      return;
    }

    // 1. Check bundled/embedded DOCS_CONTENT (100% serverless, offline, instant!)
    const normSlash = filePath.replace(/\\/g, '/');
    const normBackslash = filePath.replace(/\//g, '\\');
    if (window.DOCS_CONTENT && (window.DOCS_CONTENT[normSlash] || window.DOCS_CONTENT[normBackslash] || window.DOCS_CONTENT[filePath])) {
      const content = window.DOCS_CONTENT[normSlash] || window.DOCS_CONTENT[normBackslash] || window.DOCS_CONTENT[filePath];
      renderMarkdownContent(content, filePath);
      return;
    }

    // 2. Fallback to fetch if running on a server or relative URL
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Datei konnte nicht geladen werden (HTTP ${response.status})`);
      }
      const markdown = await response.text();
      renderMarkdownContent(markdown, filePath);
    } catch (err) {
      console.warn('Direct fetch failed, showing error:', err);
      renderFetchError(filePath, err);
    }
  }

  function showLoading() {
    elements.contentArea.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>Lade Lernunterlage...</p>
      </div>
    `;
    hideToc();
  }

  function renderFetchError(filePath, err) {
    elements.contentArea.innerHTML = `
      <div class="markdown-body">
        <h1>⚠️ Dokument konnte nicht geladen werden</h1>
        <div class="path-card" style="border-color: var(--color-crimson); margin-top: 1.5rem;">
          <h3 style="color: var(--color-crimson);">Datei nicht gefunden</h3>
          <p>
            Die Datei <code>${filePath}</code> konnte nicht geladen werden.
          </p>
          <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button class="header-btn primary" onclick="window.location.hash='#home'">
              Zur Startseite zurückkehren
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // Interactive Workbook Studio & Digital Companion Notebook
  // =========================================================================

  function getCurrentWorksheetData(levelKey, page) {
    if (state.activeCustomWorksheet) {
      return state.activeCustomWorksheet;
    }

    if (window.WorkbookEngine && window.WorkbookEngine.getPreloadedLesson) {
      const preloaded = window.WorkbookEngine.getPreloadedLesson(levelKey, page);
      if (preloaded) return preloaded;
    }

    // Dynamic generation from raw page text
    if (window.WORKBOOKS_RAW_PAGES && window.WORKBOOKS_RAW_PAGES[levelKey] && window.WORKBOOKS_RAW_PAGES[levelKey][page - 1]) {
      const rawText = window.WORKBOOKS_RAW_PAGES[levelKey][page - 1];
      if (window.WorkbookEngine && window.WorkbookEngine.parseAndGenerateWorksheet) {
        return window.WorkbookEngine.parseAndGenerateWorksheet(rawText, `${levelKey} - Seite ${page}`, levelKey, page);
      }
    }

    // Fallback if nothing available
    return {
      lessonTitle: `${levelKey} - Seite ${page}`,
      grammarSummary: '<p style="color: var(--text-muted);">Keine strukturierte Übung für diese Seite verfügbar.</p>',
      exercises: []
    };
  }

  function renderWorkbookStudio(levelKey, requestedPage) {
    if (!levelKey || levelKey === 'undefined') levelKey = 'A1';
    state.currentWorkbookLevel = levelKey;

    // Route to practical sentence studio if requested
    if (levelKey === 'A1_PRACTICAL' || levelKey === 'practical') {
      renderPracticalWorkbookStudio();
      return;
    }

    const data = (window.WORKBOOKS_DATA && window.WORKBOOKS_DATA[levelKey]) || (window.WORKBOOKS_DATA && window.WORKBOOKS_DATA['A1']);
    if (!data) {
      renderDashboard();
      return;
    }

    const totalPages = data.pages || 32;
    const page = requestedPage ? Math.max(1, Math.min(totalPages, requestedPage)) : (state.currentWorkbookPage || 1);
    state.currentWorkbookPage = page;
    const activeTab = state.currentWorkbookTab || 'toc';
    const viewMode = state.currentWorkbookViewMode || 'worksheet';

    // Load saved user answers from localStorage for current level and page
    state.workbookAnswers = (window.WorkbookEngine && window.WorkbookEngine.loadUserProgress)
      ? window.WorkbookEngine.loadUserProgress(levelKey, page)
      : {};

    // Retrieve worksheet data
    const worksheet = getCurrentWorksheetData(levelKey, page);

    // Saved completed chapters from localStorage
    const savedCompletedKey = `dl_wb_completed_${levelKey}`;
    let completedSet = new Set();
    try {
      const stored = localStorage.getItem(savedCompletedKey);
      if (stored) completedSet = new Set(JSON.parse(stored));
    } catch (e) {}

    // Saved notes from localStorage
    const savedNotesKey = `dl_wb_notes_${levelKey}`;
    const userNotes = localStorage.getItem(savedNotesKey) || '';

    // Companion grammar file path
    const companionDocPath = `${levelKey}/Grammatik.md`;

    // Calculate progress
    const totalChapters = (data.toc && data.toc.length) || 1;
    const completedCount = completedSet.size;
    const progressPercent = Math.round((completedCount / totalChapters) * 100);

    // Raw page text for editor
    const rawPageText = (window.WORKBOOKS_RAW_PAGES && window.WORKBOOKS_RAW_PAGES[levelKey] && window.WORKBOOKS_RAW_PAGES[levelKey][page - 1]) || '';
    state.customEditorText = rawPageText;

    // Determine left pane content based on active view mode
    let leftPaneHtml = '';
    if (viewMode === 'worksheet') {
      leftPaneHtml = renderWorksheetViewHtml(worksheet, levelKey, page, state.workbookAnswers, state.workbookCheckResult, state.workbookShowSolutions);
    } else if (viewMode === 'editor') {
      leftPaneHtml = renderLiveEditorViewHtml(levelKey, page, rawPageText);
    } else if (viewMode === 'pdf') {
      leftPaneHtml = `
        <div class="wb-pdf-card">
          <object id="wb-pdf-object" data="${data.pdfPath}#page=${page}" type="application/pdf" class="wb-pdf-frame">
            <iframe id="wb-pdf-iframe" src="${data.pdfPath}#page=${page}" class="wb-pdf-frame" title="${escapeHtml(data.title)}">
              <p>Dein Browser unterstützt das direkte Einbetten nicht. <a href="${data.pdfPath}" download>Hier herunterladen</a>.</p>
            </iframe>
          </object>
        </div>
      `;
    } else if (viewMode === 'split') {
      leftPaneHtml = `
        <div class="wb-split-grid">
          <div>
            ${renderWorksheetViewHtml(worksheet, levelKey, page, state.workbookAnswers, state.workbookCheckResult, state.workbookShowSolutions)}
          </div>
          <div class="wb-pdf-card" style="position: sticky; top: 1rem;">
            <object id="wb-pdf-object" data="${data.pdfPath}#page=${page}" type="application/pdf" class="wb-pdf-frame" style="height: 75vh;">
              <iframe id="wb-pdf-iframe" src="${data.pdfPath}#page=${page}" class="wb-pdf-frame" style="height: 75vh;" title="${escapeHtml(data.title)}">
                <p>PDF nicht geladen.</p>
              </iframe>
            </object>
          </div>
        </div>
      `;
    }

    const html = `
      <div class="workbook-studio">
        <!-- Level Header -->
        <div class="wb-header">
          <div class="wb-title-row">
            <div class="wb-title-group">
              <h1>
                <span>📘</span>
                <span>${escapeHtml(data.title)}</span>
              </h1>
              <p class="wb-subtitle">
                Autor: <strong>${escapeHtml(data.author)}</strong> (${escapeHtml(data.edition)}) · ${totalPages} Seiten · ${totalChapters} Lektionen
              </p>
            </div>
            <div class="wb-actions-group">
              <a href="${data.pdfPath}" download class="header-btn" title="PDF lokal speichern">
                ⬇️ PDF sichern
              </a>
              <a href="${data.pdfPath}" target="_blank" rel="noopener noreferrer" class="header-btn" title="In eigenem Vollbild-Tab öffnen">
                ↗️ Neues Fenster
              </a>
              <button class="header-btn" onclick="window.location.hash='#doc:${companionDocPath}'" title="Grammatik-Theorie öffnen">
                📖 ${levelKey} Grammatik
              </button>
            </div>
          </div>

          <!-- Level Switcher Ribbon -->
          <div class="wb-level-tabs">
            <button class="wb-level-tab ${levelKey === 'A1' ? 'active' : ''}" onclick="window.DL.switchWorkbook('A1')">
              <span class="tab-badge">A1</span>
              <span>Anfänger</span>
            </button>
            <button class="wb-level-tab ${levelKey === 'A2' ? 'active' : ''}" onclick="window.DL.switchWorkbook('A2')">
              <span class="tab-badge">A2</span>
              <span>Grundlagen</span>
            </button>
            <button class="wb-level-tab ${levelKey === 'B1' ? 'active' : ''}" onclick="window.DL.switchWorkbook('B1')">
              <span class="tab-badge">B1</span>
              <span>Mittelstufe 1</span>
            </button>
            <button class="wb-level-tab ${levelKey === 'B2' ? 'active' : ''}" onclick="window.DL.switchWorkbook('B2')">
              <span class="tab-badge">B2</span>
              <span>Mittelstufe 2</span>
            </button>
            <button class="wb-level-tab ${levelKey === 'C1' ? 'active' : ''}" onclick="window.DL.switchWorkbook('C1')">
              <span class="tab-badge">C1</span>
              <span>Oberstufe</span>
            </button>
            <button class="wb-level-tab ${levelKey === 'A1_PRACTICAL' ? 'active' : ''}" onclick="window.DL.switchWorkbook('A1_PRACTICAL')">
              <span class="tab-badge">Praxis</span>
              <span>✍️ Satzbau-Studio</span>
            </button>
          </div>

          <!-- Interactive Control Bar & View Mode Switcher -->
          <div class="wb-control-bar">
            <!-- Page Controls -->
            <div class="wb-page-controls">
              <button class="wb-btn-mini" onclick="window.DL.prevWorkbookPage()" title="Eine Seite zurück">
                ◀ Zurück
              </button>
              <span style="font-size: 0.88rem; color: var(--text-secondary);">Seite</span>
              <input type="number" id="wb-page-input" class="wb-page-input" min="1" max="${totalPages}" value="${page}" onchange="window.DL.goWorkbookPage(this.value)">
              <span style="font-size: 0.88rem; color: var(--text-secondary);">von ${totalPages}</span>
              <button class="wb-btn-mini" onclick="window.DL.goWorkbookPage(document.getElementById('wb-page-input').value)" title="Zur Seite springen">
                Springen
              </button>
              <button class="wb-btn-mini" onclick="window.DL.nextWorkbookPage()" title="Eine Seite vor">
                Vor ▶
              </button>
            </div>

            <!-- View Modes Pill Selector -->
            <div class="wb-view-modes" role="tablist">
              <button class="wb-view-mode-btn ${viewMode === 'worksheet' ? 'active' : ''}" onclick="window.DL.switchWorkbookViewMode('worksheet')" title="Interaktives Arbeitsblatt mit Lückentexten">
                <span>✍️</span>
                <span>Arbeitsblatt (Bearbeitbar)</span>
              </button>
              <button class="wb-view-mode-btn ${viewMode === 'editor' ? 'active' : ''}" onclick="window.DL.switchWorkbookViewMode('editor')" title="Übungstext bearbeiten oder eigenen Text laden">
                <span>📝</span>
                <span>Live-Editor / Laden</span>
              </button>
              <button class="wb-view-mode-btn ${viewMode === 'pdf' ? 'active' : ''}" onclick="window.DL.switchWorkbookViewMode('pdf')" title="Original-PDF anzeigen">
                <span>📑</span>
                <span>Original-PDF</span>
              </button>
              <button class="wb-view-mode-btn ${viewMode === 'split' ? 'active' : ''}" onclick="window.DL.switchWorkbookViewMode('split')" title="Arbeitsblatt und PDF nebeneinander">
                <span>🌓</span>
                <span>Geteilt</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Layout Workspace -->
        <div class="${viewMode === 'split' ? '' : 'wb-layout-grid'}">
          <!-- Main Pane -->
          <div class="wb-main-pane">
            ${leftPaneHtml}
          </div>

          ${viewMode === 'split' ? '' : `
            <!-- Right Sidecar (TOC, Notes, Cheatsheet) -->
            <div class="wb-sidecar-card">
              <div class="wb-sidecar-nav">
                <button class="wb-sidecar-tab-btn ${activeTab === 'toc' ? 'active' : ''}" onclick="window.DL.switchWorkbookTab('toc')">
                  <span>📋</span>
                  <span>Lektionen (${totalChapters})</span>
                </button>
                <button class="wb-sidecar-tab-btn ${activeTab === 'notes' ? 'active' : ''}" onclick="window.DL.switchWorkbookTab('notes')">
                  <span>✍️</span>
                  <span>Notizen</span>
                </button>
                <button class="wb-sidecar-tab-btn ${activeTab === 'cheatsheet' ? 'active' : ''}" onclick="window.DL.switchWorkbookTab('cheatsheet')">
                  <span>⚡</span>
                  <span>Spickzettel</span>
                </button>
              </div>

              <!-- Tab 1: TOC Content -->
              <div class="wb-tab-content-area" id="wb-tab-toc" style="display: ${activeTab === 'toc' ? 'block' : 'none'};">
                <div class="wb-search-box">
                  <input type="text" id="wb-toc-filter" placeholder="Lektion oder Thema filtern..." oninput="window.DL.filterWorkbookToc(this.value)">
                </div>
                <div class="wb-progress-summary">
                  <span>Erledigte Lektionen:</span>
                  <span id="wb-progress-text"><strong>${completedCount}</strong> von ${totalChapters} (${progressPercent}%)</span>
                </div>
                <div class="wb-progress-track">
                  <div class="wb-progress-fill" id="wb-progress-fill" style="width: ${progressPercent}%;"></div>
                </div>
                <div class="wb-toc-list" id="wb-toc-list">
                  ${renderWorkbookTocItemsHtml(data.toc, completedSet, page)}
                </div>
              </div>

              <!-- Tab 2: Notes Content -->
              <div class="wb-tab-content-area" id="wb-tab-notes" style="display: ${activeTab === 'notes' ? 'flex' : 'none'}; flex-direction: column; height: 100%;">
                <div class="wb-notes-toolbar">
                  <button class="wb-btn-mini" onclick="window.DL.insertNoteTemplate('task')" title="Aufgabe-Muster einfügen">
                    ➕ Aufgabe
                  </button>
                  <button class="wb-btn-mini" onclick="window.DL.insertNoteTemplate('vocab')" title="Vokabel-Zeile einfügen">
                    ➕ Vokabel
                  </button>
                  <button class="wb-btn-mini" onclick="window.DL.insertNoteTemplate('rule')" title="Grammatikregel notieren">
                    ➕ Regel
                  </button>
                </div>
                <textarea id="wb-notes-textarea" class="wb-notes-textarea" placeholder="Schreibe hier deine Notizen oder Lösungen auf (wird lokal gespeichert)..." oninput="window.DL.saveWorkbookNotes(this.value)">${escapeHtml(userNotes)}</textarea>
                <div class="wb-notes-footer">
                  <span class="wb-notes-status" id="wb-notes-status">✓ Automatisch gespeichert</span>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="wb-btn-mini" onclick="window.DL.exportWorkbookNotes()" title="Notizen exportieren">
                      💾 Exportieren
                    </button>
                    <button class="wb-btn-mini" onclick="window.DL.clearWorkbookNotes()" title="Notizen leeren">
                      🧹 Leeren
                    </button>
                  </div>
                </div>
              </div>

              <!-- Tab 3: Cheatsheet Content -->
              <div class="wb-tab-content-area" id="wb-tab-cheatsheet" style="display: ${activeTab === 'cheatsheet' ? 'block' : 'none'};">
                ${renderWorkbookLevelCheatsheet(levelKey)}
              </div>
            </div>
          `}
        </div>
      </div>
    `;

    elements.contentArea.innerHTML = html;
    elements.mainScrollArea.scrollTop = 0;
    hideToc();
  }

  function renderWorksheetViewHtml(worksheet, levelKey, page, answers, checkResult, showSolutions) {
    if (!worksheet) {
      return `<div class="wb-worksheet-card"><p style="color: var(--text-muted);">Keine Übungsinhalte vorhanden.</p></div>`;
    }

    const title = worksheet.lessonTitle || `${levelKey} - Seite ${page}`;
    const exercises = worksheet.exercises || [];

    // Score Banner HTML if checked
    let scoreBannerHtml = '';
    if (checkResult) {
      const pct = checkResult.scorePercent;
      let moodEmoji = '🎉';
      let moodText = 'Hervorragend gelöst!';
      if (pct < 50) {
        moodEmoji = '💪';
        moodText = 'Guter Anfang! Schau dir die Lösungen an und wiederhole die Lektion.';
      } else if (pct < 85) {
        moodEmoji = '👍';
        moodText = 'Gut gemacht! Fast alle Aufgaben waren richtig.';
      }

      scoreBannerHtml = `
        <div class="wb-score-banner">
          <div class="wb-score-left">
            <div class="wb-score-badge">${pct}%</div>
            <div class="wb-score-info">
              <h4>${moodEmoji} ${checkResult.correct} von ${checkResult.total} Aufgaben richtig</h4>
              <p>${moodText}</p>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button class="header-btn" onclick="window.DL.revealWorkbookSolutions()">
              💡 ${showSolutions ? 'Lösungen ausblenden' : 'Erklärungen anzeigen'}
            </button>
            <button class="header-btn primary" onclick="window.DL.resetWorkbookAnswers()">
              ↺ Neu starten
            </button>
          </div>
        </div>
      `;
    }

    // Render Exercises Cards
    const exercisesHtml = exercises.map((ex) => {
      const hasWordBank = ex.wordBank && ex.wordBank.length > 0;
      const wordBankHtml = hasWordBank ? `
        <div class="wb-word-bank">
          <span class="wb-word-bank-label">📦 Wortkasten:</span>
          ${ex.wordBank.map(w => `<span class="wb-word-chip">${escapeHtml(w)}</span>`).join('')}
        </div>
      ` : '';

      const exampleHtml = ex.example ? `
        <div style="font-size: 0.88rem; color: var(--color-gold); background: rgba(245, 158, 11, 0.1); border-left: 3px solid var(--color-gold); padding: 0.4rem 0.75rem; border-radius: var(--radius-sm);">
          💡 <strong>${escapeHtml(ex.example)}</strong>
        </div>
      ` : '';

      const itemsHtml = ex.items.map((item) => {
        const userVal = (answers && answers[item.id]) ? answers[item.id] : '';
        const itemResult = checkResult && checkResult.results ? checkResult.results[item.id] : null;

        let statusClass = '';
        let feedbackHtml = '';

        if (itemResult) {
          if (itemResult.status === 'correct') {
            statusClass = 'correct';
            feedbackHtml = `<span class="wb-gap-feedback correct">✓ Richtig</span>`;
          } else if (itemResult.status === 'incorrect') {
            statusClass = 'incorrect';
            feedbackHtml = `<span class="wb-gap-feedback incorrect" title="Grammatik: ${escapeHtml(item.explanation)}">❌ Lösung: <span class="correct-answer-text">${escapeHtml(item.answer)}</span></span>`;
          } else if (itemResult.status === 'unanswered') {
            statusClass = 'incorrect';
            feedbackHtml = `<span class="wb-gap-feedback incorrect">⚠️ Nicht ausgefüllt (Lösung: <strong>${escapeHtml(item.answer)}</strong>)</span>`;
          }
        } else if (showSolutions) {
          feedbackHtml = `<span class="wb-gap-feedback correct">Lösung: <strong>${escapeHtml(item.answer)}</strong></span>`;
        }

        const fullSentence = `${item.prefix || ''}${item.answer || ''}${item.suffix || ''}`.replace(/^[a-z0-9]+[\.\)]\s*/i, '').trim();

        return `
          <div class="wb-exercise-item" id="wb-item-row-${item.id}">
            <span>${escapeHtml(item.prefix || '')}</span>
            <input
              type="text"
              class="wb-gap-input ${statusClass}"
              id="gap-input-${item.id}"
              data-item-id="${item.id}"
              value="${escapeHtml(userVal)}"
              placeholder="..."
              aria-label="Lösung für ${escapeHtml(item.prefix || '')}"
              oninput="window.DL.handleGapInput('${item.id}', this.value)"
              onkeydown="window.DL.handleGapKey(event, this)"
            >
            <span>${escapeHtml(item.suffix || '')}</span>
            ${feedbackHtml}
            <button class="inline-audio-btn" onclick="window.DL.speakWorksheetSentence('${escapeHtml(fullSentence).replace(/'/g, "\\'")}')" title="Diesen Satz auf Deutsch vorlesen">
              🔊
            </button>
          </div>
        `;
      }).join('');

      // Solution explanation card
      const solutionBoxHtml = (showSolutions || checkResult) ? `
        <div class="wb-solution-box">
          <h5><span>💡</span><span>Grammatische Lösungen & Regelerklärungen zu ${escapeHtml(ex.title)}:</span></h5>
          <ul class="wb-solution-list">
            ${ex.items.map(it => `
              <li class="wb-solution-item">
                <div>${escapeHtml(it.prefix || '')}<strong>${escapeHtml(it.answer)}</strong>${escapeHtml(it.suffix || '')}</div>
                <em>📖 ${escapeHtml(it.explanation || 'Grammatikregel')}</em>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : '';

      return `
        <div class="wb-exercise-card" id="${ex.id}">
          <div class="wb-exercise-header">
            <div>
              <h3 class="wb-exercise-title">📝 ${escapeHtml(ex.title)}</h3>
              <p class="wb-exercise-instruction">${escapeHtml(ex.instruction)}</p>
            </div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${ex.items.length} Teilaufgaben</span>
          </div>
          ${wordBankHtml}
          ${exampleHtml}
          <div class="wb-exercise-items">
            ${itemsHtml}
          </div>
          ${solutionBoxHtml}
        </div>
      `;
    }).join('');

    return `
      <div class="wb-worksheet-card">
        <!-- Worksheet Top Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
          <div>
            <span style="display: inline-block; padding: 0.2rem 0.5rem; background: var(--color-primary); color: #fff; font-size: 0.75rem; font-weight: 700; border-radius: var(--radius-sm); margin-bottom: 0.35rem;">
              ${levelKey} · Seite ${page}
            </span>
            <h2 style="font-size: 1.45rem; font-weight: 700; margin: 0; color: var(--text-primary);">
              ${escapeHtml(title)}
            </h2>
          </div>

          <!-- Worksheet Action Buttons -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center;">
            <button class="header-btn" onclick="window.DL.revealWorkbookSolutions()" title="Lösungen für alle Lücken einblenden oder ausblenden">
              💡 ${showSolutions ? 'Lösungen verbergen' : 'Antworten generieren'}
            </button>
            <button class="header-btn" onclick="window.DL.autoFillWorkbookAnswers()" title="Lücken automatisch mit korrekten Antworten ausfüllen">
              ✍️ Automatisch ausfüllen
            </button>
            <button class="header-btn primary" onclick="window.DL.checkWorkbookAnswers()" title="Eigene Antworten überprüfen und bewerten">
              ✅ Eingaben prüfen
            </button>
            <button class="header-btn" onclick="window.DL.resetWorkbookAnswers()" title="Lücken leeren und zurücksetzen">
              ↺ Zurücksetzen
            </button>
            <button class="header-btn" onclick="window.DL.exportWorkbookWorksheet()" title="Arbeitsblatt und Eingaben als Text exportieren">
              💾 Exportieren
            </button>
          </div>
        </div>

        ${scoreBannerHtml}
        ${worksheet.grammarSummary || ''}
        ${exercisesHtml}
      </div>
    `;
  }

  function renderLiveEditorViewHtml(levelKey, page, rawPageText) {
    const editorValue = state.customEditorText || rawPageText || '';

    return `
      <div class="wb-custom-editor-card">
        <div>
          <h2 style="font-size: 1.35rem; font-weight: 700; margin: 0 0 0.35rem 0; display: flex; align-items: center; gap: 0.5rem;">
            <span>📝</span>
            <span>Live-Übungseditor & Dynamischer Antwort-Generator</span>
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.92rem; margin: 0;">
            Laden Sie eine Buchseite, fügen Sie eigene Lücken (z.B. <code>komm___</code> oder <code>______</code>) ein oder öffnen Sie eine Datei. Der Parser generiert automatisch das interaktive Arbeitsblatt mit den Lösungen.
          </p>
        </div>

        <!-- Preset Loaders -->
        <div class="wb-editor-presets">
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Schnell laden:</span>
          <button class="wb-btn-mini" onclick="window.DL.loadEditorPreset('einfach_deutsch')" title="Aus A1/Practisches_WerkBuch laden">
            📄 EinfachDeutsch (Praxis)
          </button>
          <button class="wb-btn-mini" onclick="window.DL.loadEditorPreset('a1_konjugation')" title="A1 Lektion 1 Verben laden">
            📄 A1 Konjugation (S. 3)
          </button>
          <button class="wb-btn-mini" onclick="window.DL.loadEditorPreset('a2_kausal')" title="A2 Lektion 1 Kausalsätze laden">
            📄 A2 Weil-Sätze (S. 3)
          </button>
          <button class="wb-btn-mini" onclick="window.DL.loadEditorPreset('b1_perfekt')" title="B1 Lektion 1 Perfekt laden">
            📄 B1 Perfekt (S. 3)
          </button>
          <label class="wb-btn-mini" style="cursor: pointer;" title="Eigene .txt oder .md Datei öffnen">
            📁 Datei öffnen...
            <input type="file" accept=".txt,.md" style="display: none;" onchange="window.DL.handleEditorFileUpload(this)">
          </label>
        </div>

        <!-- Editable Area -->
        <textarea
          id="wb-custom-editor-textarea"
          class="wb-custom-textarea"
          placeholder="Fügen Sie hier Ihren deutschen Übungstext ein... Beispiel:&#10;&#10;Übung 1&#10;a) Maria komm___ aus Rom.&#10;b) Carlos wohn___ in Passau.&#10;c) Wir trink___ Kaffee."
          oninput="state.customEditorText = this.value"
        >${escapeHtml(editorValue)}</textarea>

        <!-- Editor Action Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; gap: 0.5rem;">
            <button class="header-btn primary" onclick="window.DL.loadEditorIntoWorksheet()" title="Text analysieren und in interaktive Arbeitsblatt-Ansicht laden">
              🚀 In interaktives Arbeitsblatt laden & Antworten generieren
            </button>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="wb-btn-mini" onclick="window.DL.loadEditorPreset('current_page')" title="Originaltext dieser Buchseite neu laden">
              ↺ Seite ${page} neu laden
            </button>
            <button class="wb-btn-mini" onclick="document.getElementById('wb-custom-editor-textarea').value = ''; state.customEditorText = '';" title="Editor leeren">
              🧹 Leeren
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderWorkbookTocItemsHtml(toc, completedSet, currentPage) {
    if (!toc || !toc.length) {
      return `<p style="color: var(--text-muted); font-size: 0.85rem;">Kein Inhaltsverzeichnis verfügbar.</p>`;
    }
    const currPage = parseInt(currentPage, 10) || 1;

    return toc.map((item, idx) => {
      const isCompleted = completedSet.has(idx);
      const cleanTitle = escapeHtml(item.title);
      const searchTitle = item.title.toLowerCase();
      const page = item.page || 1;
      const isActive = page === currPage;

      return `
        <div class="wb-toc-row ${isActive ? 'active-page' : ''} ${isCompleted ? 'completed' : ''}" id="wb-toc-row-${idx}" data-title="${searchTitle}" onclick="window.DL.jumpToWorkbookPage(${page})">
          <div class="wb-toc-left">
            <input type="checkbox" class="wb-toc-check" id="wb-toc-check-${idx}" ${isCompleted ? 'checked' : ''} onclick="event.stopPropagation(); window.DL.toggleWorkbookChapter(${idx})">
            <span class="wb-toc-title" title="${cleanTitle}">${cleanTitle}</span>
          </div>
          <span class="wb-toc-page-badge" title="Zu Seite ${page} springen">S. ${page} ↗</span>
        </div>
      `;
    }).join('');
  }

  function renderWorkbookLevelCheatsheet(levelKey) {
    if (levelKey === 'A1') {
      return `
        <div class="wb-quickref-card">
          <h4>📌 Bestimmte Artikel (A1)</h4>
          <table class="wb-table-mini">
            <tr><th>Kasus</th><th>Maskulin</th><th>Feminin</th><th>Neutral</th><th>Plural</th></tr>
            <tr><td><strong>Nominativ</strong></td><td>der</td><td>die</td><td>das</td><td>die</td></tr>
            <tr><td><strong>Akkusativ</strong></td><td><strong style="color: var(--color-primary);">den</strong></td><td>die</td><td>das</td><td>die</td></tr>
            <tr><td><strong>Dativ</strong></td><td><strong style="color: var(--color-gold);">dem</strong></td><td><strong style="color: var(--color-gold);">der</strong></td><td><strong style="color: var(--color-gold);">dem</strong></td><td><strong style="color: var(--color-gold);">den (+n)</strong></td></tr>
          </table>
        </div>
        <div class="wb-quickref-card">
          <h4>📌 Personalpronomen (Nominativ / Akkusativ / Dativ)</h4>
          <p style="font-size: 0.82rem; margin: 0; line-height: 1.7; font-family: var(--font-mono);">
            ich · mich · mir<br>
            du · dich · dir<br>
            er · ihn · ihm<br>
            sie · sie · ihr<br>
            es · es · ihm<br>
            wir · uns · uns<br>
            ihr · euch · euch<br>
            Sie/sie · Sie/sie · Ihnen/ihnen
          </p>
        </div>
        <div class="wb-quickref-card">
          <h4>📌 Regelmäßige Verbendungen (Präsens)</h4>
          <p style="font-size: 0.82rem; margin: 0; line-height: 1.6;">
            ich lerne (<strong>-e</strong>) · du lernst (<strong>-st</strong>) · er/sie/es lernt (<strong>-t</strong>)<br>
            wir lernen (<strong>-en</strong>) · ihr lernt (<strong>-t</strong>) · sie lernen (<strong>-en</strong>)
          </p>
        </div>
      `;
    } else if (levelKey === 'A2') {
      return `
        <div class="wb-quickref-card">
          <h4>📌 Wechselpräpositionen (Akkusativ vs. Dativ)</h4>
          <p style="font-size: 0.82rem; margin-bottom: 0.4rem;">
            <em>an, auf, hinter, in, neben, über, unter, vor, zwischen</em>
          </p>
          <table class="wb-table-mini">
            <tr><th>Frage</th><th>Bedeutung</th><th>Kasus</th><th>Beispiel</th></tr>
            <tr><td><strong>Wohin?</strong></td><td>Richtung / Bewegung</td><td><strong>Akkusativ</strong></td><td>Ich lege das Buch auf <em>den</em> Tisch.</td></tr>
            <tr><td><strong>Wo?</strong></td><td>Ort / Stillstand</td><td><strong>Dativ</strong></td><td>Das Buch liegt auf <em>dem</em> Tisch.</td></tr>
          </table>
        </div>
        <div class="wb-quickref-card">
          <h4>📌 Kausale Nebensätze mit "weil" & "da"</h4>
          <p style="font-size: 0.82rem; margin: 0;">
            Im Nebensatz wandert das konjugierte Verb ans <strong>Satzende</strong>:<br>
            <em>"Ich lerne Deutsch, weil ich in Deutschland arbeiten <strong>möchte</strong>."</em>
          </p>
        </div>
        <div class="wb-quickref-card">
          <h4>📌 Konjunktiv II (Höflichkeit & Wunsch)</h4>
          <p style="font-size: 0.82rem; margin: 0; font-family: var(--font-mono);">
            würde + Infinitiv (ich würde gern...)<br>
            hätte (ich hätte gern einen Kaffee)<br>
            wäre (das wäre schön)<br>
            könnte (könnten Sie mir helfen?)
          </p>
        </div>
      `;
    } else if (levelKey === 'B1') {
      return `
        <div class="wb-quickref-card">
          <h4>📌 Zeiten der Vergangenheit</h4>
          <table class="wb-table-mini">
            <tr><th>Zeitform</th><th>Bildung</th><th>Verwendung</th></tr>
            <tr><td><strong>Perfekt</strong></td><td>haben/sein + Partizip II</td><td>Mündliche Sprache, Alltag</td></tr>
            <tr><td><strong>Präteritum</strong></td><td>Stamm + -te / Ablaut</td><td>Schriftlich, Berichte, Romane</td></tr>
            <tr><td><strong>Plusquamperfekt</strong></td><td>hatte/war + Partizip II</td><td>Vorvergangenheit</td></tr>
          </table>
        </div>
        <div class="wb-quickref-card">
          <h4>📌 Konnektoren & Satzstellung</h4>
          <p style="font-size: 0.82rem; line-height: 1.6; margin: 0;">
            • <strong>Subjunktionen (Verb am Ende):</strong> weil, dass, obwohl, wenn, als, damit, während.<br>
            • <strong>Konjunktionen (Position 0):</strong> und, aber, oder, denn, sondern.<br>
            • <strong>Konjunktionaladverbien (Position 1):</strong> deshalb, trotzdem, außerdem.
          </p>
        </div>
        <div class="wb-quickref-card">
          <h4>📌 Vorgangspassiv Präsens & Präteritum</h4>
          <p style="font-size: 0.82rem; margin: 0;">
            <em>Präsens:</em> werden + Partizip II (Der Brief <strong>wird geschrieben</strong>.)<br>
            <em>Präteritum:</em> wurden + Partizip II (Der Brief <strong>wurde geschrieben</strong>.)
          </p>
        </div>
      `;
    } else if (levelKey === 'B2') {
      return `
        <div class="wb-quickref-card">
          <h4>📌 Nomen-Endungen und Genus</h4>
          <p style="font-size: 0.82rem; line-height: 1.6; margin: 0;">
            • <strong>Maskulin (der):</strong> -ling, -or, -ismus, -ist, -ant, -ent<br>
            • <strong>Feminin (die):</strong> -ung, -heit, -keit, -schaft, -tion, -tät, -ik, -ei, -ur<br>
            • <strong>Neutral (das):</strong> -chen, -lein, -ment, -um, -tum, -ma
          </p>
        </div>
        <div class="wb-quickref-card">
          <h4>📌 Passiv mit Modalverben & Perfekt</h4>
          <p style="font-size: 0.82rem; line-height: 1.6; margin: 0;">
            • <em>Perfekt:</em> ist + Partizip II + <strong>worden</strong><br>
            • <em>Modalverb Präsens:</em> muss/kann + Partizip II + <strong>werden</strong><br>
            • <em>Modalverb Präteritum:</em> musste/konnte + Partizip II + <strong>werden</strong>
          </p>
        </div>
        <div class="wb-quickref-card">
          <h4>📌 n-Deklination (Schwache Maskulina)</h4>
          <p style="font-size: 0.82rem; margin: 0;">
            Endung <strong>-(e)n</strong> in allen Kasus außer Nominativ:<br>
            der Kunde → den Kunden, dem Kunden, des Kunden<br>
            der Student, der Kollege, der Herr (des Herrn)
          </p>
        </div>
      `;
    } else if (levelKey === 'C1') {
      return `
        <div class="wb-quickref-card">
          <h4>📌 Funktionsverbgefüge (FVG)</h4>
          <table class="wb-table-mini">
            <tr><th>FVG</th><th>Einfaches Verb</th></tr>
            <tr><td><strong>zur Verfügung stellen</strong></td><td>geben / bereitstellen</td></tr>
            <tr><td><strong>zur Verfügung stehen</strong></td><td>vorhanden sein</td></tr>
            <tr><td><strong>in Frage kommen</strong></td><td>möglich / relevant sein</td></tr>
            <tr><td><strong>in Betracht ziehen</strong></td><td>erwägen / bedenken</td></tr>
            <tr><td><strong>eine Entscheidung treffen</strong></td><td>entscheiden</td></tr>
            <tr><td><strong>Kritik üben an (+ Dat)</strong></td><td>kritisieren</td></tr>
            <tr><td><strong>in Anspruch nehmen</strong></td><td>nutzen / beanspruchen</td></tr>
          </table>
        </div>
        <div class="wb-quickref-card">
          <h4>📌 Subjektive Bedeutung der Modalverben</h4>
          <p style="font-size: 0.82rem; line-height: 1.6; margin: 0;">
            • <strong>müssen (100%):</strong> Er muss krank sein. (Fast sicher)<br>
            • <strong>dürfte (~75%):</strong> Er dürfte gleich kommen. (Sehr wahrscheinlich)<br>
            • <strong>könnte (~50%):</strong> Es könnte noch klappen. (Möglich)<br>
            • <strong>soll (Gerücht):</strong> Er soll im Ausland sein. (Man sagt...)<br>
            • <strong>will (Behauptung):</strong> Er will nichts gewusst haben. (Er behauptet...)
          </p>
        </div>
        <div class="wb-quickref-card">
          <h4>📌 Passiversatzformen</h4>
          <p style="font-size: 0.82rem; line-height: 1.6; margin: 0;">
            • <strong>sein + zu + Infinitiv:</strong> "Das ist zu tun" = muss getan werden<br>
            • <strong>sich lassen + Infinitiv:</strong> "Das lässt sich machen" = kann gemacht werden<br>
            • <strong>Adjektive auf -bar/-lich:</strong> machbar, verständlich
          </p>
        </div>
      `;
    }
    return '';
  }

  function renderPracticalWorkbookStudio() {
    state.currentWorkbookLevel = 'A1_PRACTICAL';

    // Get custom saved phrases from localStorage
    let customPhrases = [];
    try {
      const stored = localStorage.getItem('dl_custom_phrases');
      if (stored) customPhrases = JSON.parse(stored);
    } catch (e) {}

    const subject = (state.sentenceBuilderState && state.sentenceBuilderState.subject) || 'Ich bin';
    const adjective = (state.sentenceBuilderState && state.sentenceBuilderState.adjective) || 'froh';
    const clause = (state.sentenceBuilderState && state.sentenceBuilderState.clause) || 'weil ich heute viel Deutsch gelernt habe.';

    const currentSentence = `${subject} ${adjective}${clause ? ', ' + clause : '.'}`.trim();

    const html = `
      <div class="workbook-studio wb-studio-practical">
        <!-- Level Ribbon -->
        <div class="wb-header">
          <div class="wb-title-row">
            <div class="wb-title-group">
              <h1>
                <span>✍️</span>
                <span>Praktisches Werkbuch & Satzbau-Studio</span>
              </h1>
              <p class="wb-subtitle">
                Praktische Beispielsätze, Satzmuster und interaktive Alltagskonstruktionen aus <code>A1/Practisches_WerkBuch/EinfachDeutsch_examples.txt</code>
              </p>
            </div>
            <div class="wb-actions-group">
              <a href="A1/Practisches_WerkBuch/EinfachDeutsch_examples.txt" download class="header-btn" title="Original-Textdatei herunterladen">
                ⬇️ Textdatei sichern
              </a>
              <button class="header-btn primary" onclick="window.DL.switchWorkbook('A1')">
                📘 Zu A1 Grammatik-Arbeitsbuch
              </button>
            </div>
          </div>

          <!-- Level Switcher Ribbon -->
          <div class="wb-level-tabs">
            <button class="wb-level-tab" onclick="window.DL.switchWorkbook('A1')">
              <span class="tab-badge">A1</span>
              <span>Anfänger</span>
            </button>
            <button class="wb-level-tab" onclick="window.DL.switchWorkbook('A2')">
              <span class="tab-badge">A2</span>
              <span>Grundlagen</span>
            </button>
            <button class="wb-level-tab" onclick="window.DL.switchWorkbook('B1')">
              <span class="tab-badge">B1</span>
              <span>Mittelstufe 1</span>
            </button>
            <button class="wb-level-tab" onclick="window.DL.switchWorkbook('B2')">
              <span class="tab-badge">B2</span>
              <span>Mittelstufe 2</span>
            </button>
            <button class="wb-level-tab" onclick="window.DL.switchWorkbook('C1')">
              <span class="tab-badge">C1</span>
              <span>Oberstufe</span>
            </button>
            <button class="wb-level-tab active" onclick="window.DL.switchWorkbook('A1_PRACTICAL')">
              <span class="tab-badge">Praxis</span>
              <span>✍️ Satzbau-Studio</span>
            </button>
          </div>
        </div>

        <!-- Interactive Sentence Builder Card -->
        <div class="wb-builder-card">
          <div class="wb-builder-section-title">
            <span>🧩</span>
            <span>Interaktiver Satzbau-Baukasten (Subjekt + Prädikativ + Konnektor)</span>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 1.25rem;">
            Wähle Pronomen, Gefühl/Zustand und Nebensatz-Erweiterung aus, um korrekte deutsche Sätze mit automatischer Aussprache zu formen:
          </p>

          <!-- 1. Subject Pronouns -->
          <label style="font-size: 0.85rem; font-weight: 600; color: var(--color-primary); display: block; margin-bottom: 0.4rem;">
            1. Subjekt & Personalform von "sein":
          </label>
          <div class="wb-chip-group">
            ${['Ich bin', 'Du bist', 'Er ist', 'Sie ist', 'Wir sind', 'Ihr seid', 'Sie sind'].map(p => `
              <button class="wb-chip ${subject === p ? 'active' : ''}" onclick="window.DL.updateSentenceBuilder('subject', '${p}')">
                ${p}
              </button>
            `).join('')}
          </div>

          <!-- 2. Adjectives -->
          <label style="font-size: 0.85rem; font-weight: 600; color: var(--color-gold); display: block; margin-bottom: 0.4rem;">
            2. Adjektiv (Gefühl / Zustand):
          </label>
          <div class="wb-chip-group">
            ${['froh', 'glücklich', 'müde', 'zufrieden', 'dankbar', 'bereit', 'gesund', 'stolz', 'aufgeregt', 'überrascht', 'traurig'].map(adj => `
              <button class="wb-chip ${adjective === adj ? 'active' : ''}" onclick="window.DL.updateSentenceBuilder('adjective', '${adj}')">
                ${adj}
              </button>
            `).join('')}
          </div>

          <!-- 3. Clause extensions -->
          <label style="font-size: 0.85rem; font-weight: 600; color: var(--color-business); display: block; margin-bottom: 0.4rem;">
            3. Satzverbindung (Konnektoren & Nebensätze):
          </label>
          <div class="wb-chip-group">
            ${[
              { label: 'Keine Erweiterung', val: '' },
              { label: 'weil ich heute viel Deutsch gelernt habe.', val: 'weil ich heute viel Deutsch gelernt habe.' },
              { label: 'weil das Wetter so schön ist.', val: 'weil das Wetter so schön ist.' },
              { label: 'denn das Wochenende beginnt bald.', val: 'denn das Wochenende beginnt bald.' },
              { label: 'obwohl die Grammatik anspruchsvoll ist.', val: 'obwohl die Grammatik anspruchsvoll ist.' },
              { label: 'wenn wir zusammen sprechen.', val: 'wenn wir zusammen sprechen.' }
            ].map(item => `
              <button class="wb-chip ${clause === item.val ? 'active' : ''}" onclick="window.DL.updateSentenceBuilder('clause', '${item.val}')">
                ${item.label}
              </button>
            `).join('')}
          </div>

          <!-- Generated Sentence Display Banner -->
          <div class="wb-sentence-showcase">
            <div>
              <div class="wb-sentence-text" id="wb-built-sentence">${escapeHtml(currentSentence)}</div>
              <div class="wb-sentence-meta">
                <span>🇩🇪 Korrekter deutscher Satz · Subjekt-Verb-Kongruenz geprüft</span>
              </div>
            </div>
            <div class="wb-sentence-actions">
              <button class="header-btn primary" onclick="window.DL.speakCurrentSentence()" title="Diesen Satz auf Deutsch vorlesen">
                🔊 Vorlesen
              </button>
              <button class="header-btn" onclick="window.DL.saveBuiltSentence()" title="Zu meinen Beispielsätzen hinzufügen">
                ➕ Satz speichern
              </button>
            </div>
          </div>
        </div>

        <!-- Curated Practical Phrases Catalog -->
        <div style="margin-top: 2rem;">
          <h2 style="font-size: 1.45rem; font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>📚</span>
            <span>Praktischer Phrasen-Katalog & Alltagssätze</span>
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 1.25rem;">
            Klicke auf das 🔊-Symbol, um die korrekte deutsche Aussprache direkt anzuhören:
          </p>

          <div class="wb-phrases-grid" id="wb-phrases-container">
            ${renderPracticalPhrasesHtml(customPhrases)}
          </div>
        </div>
      </div>
    `;

    elements.contentArea.innerHTML = html;
    elements.mainScrollArea.scrollTop = 0;
    hideToc();
  }

  function renderPracticalPhrasesHtml(customPhrases) {
    const DEFAULT_PRACTICAL_PHRASES = [
      { de: "Ich bin froh.", trans: "I am glad.", tip: "Grundbeispiel (A1/Practisches_WerkBuch)", cat: "Gefühle" },
      { de: "Es geht mir gut, danke!", trans: "I am doing well, thank you!", tip: "Dativ: mir geht es", cat: "Befinden" },
      { de: "Könnten Sie mir bitte helfen?", trans: "Could you please help me?", tip: "Höflicher Konjunktiv II", cat: "Alltag" },
      { de: "Ich habe morgen leider keine Zeit.", trans: "Unfortunately I don't have time tomorrow.", tip: "Zeitangabe vor Negation", cat: "Termine" },
      { de: "Ich melde mich gleich bei Ihnen zurück.", trans: "I will get back to you right away.", tip: "Reflexives Verb (sich melden)", cat: "Beruf" },
      { de: "Ich bin froh, dass ich heute Deutsch geübt habe.", trans: "I am glad that I practiced German today.", tip: "Nebensatz mit 'dass' (Verb am Ende)", cat: "Lernen" },
      { de: "Wo befindet sich der Bahnhof?", trans: "Where is the train station located?", tip: "Höfliche Ortsfrage", cat: "Reisen" },
      { de: "Ich freue mich auf das Wochenende!", trans: "I am looking forward to the weekend!", tip: "sich freuen auf + Akkusativ", cat: "Gefühle" }
    ];

    let all = [];
    if (customPhrases && customPhrases.length) {
      all = all.concat(customPhrases.map((p, idx) => ({ ...p, isCustom: true, customIdx: idx })));
    }
    all = all.concat(DEFAULT_PRACTICAL_PHRASES);

    return all.map((phrase) => {
      const deEscaped = escapeHtml(phrase.de);
      const transEscaped = escapeHtml(phrase.trans);
      const tipEscaped = escapeHtml(phrase.tip);
      const catEscaped = escapeHtml(phrase.cat);

      return `
        <div class="wb-phrase-card">
          <div class="wb-phrase-main">
            <span>${deEscaped}</span>
            <button class="inline-audio-btn" onclick="window.DL.speakGerman('${deEscaped.replace(/'/g, "\\'")}', null)" title="Aussprache anhören">
              🔊
            </button>
          </div>
          <div class="wb-phrase-trans">${transEscaped}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.25rem;">
            <span class="wb-phrase-tip">${catEscaped}: ${tipEscaped}</span>
            ${phrase.isCustom ? `
              <button class="wb-btn-mini" onclick="window.DL.deleteCustomPhrase(${phrase.customIdx})" title="Diesen eigenen Satz löschen" style="color: var(--color-crimson); padding: 0.2rem 0.4rem;">
                ✕
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // Workbook helper actions
  function switchWorkbook(level) {
    state.activeCustomWorksheet = null;
    state.workbookCheckResult = null;
    state.workbookShowSolutions = false;
    window.location.hash = `#workbooks:${level}`;
  }

  function switchWorkbookViewMode(mode) {
    state.currentWorkbookViewMode = mode;
    renderWorkbookStudio(state.currentWorkbookLevel, state.currentWorkbookPage);
  }

  function jumpToWorkbookPage(pageNum) {
    const data = window.WORKBOOKS_DATA && window.WORKBOOKS_DATA[state.currentWorkbookLevel];
    const totalPages = (data && data.pages) || 100;
    pageNum = Math.max(1, Math.min(totalPages, parseInt(pageNum, 10) || 1));
    state.currentWorkbookPage = pageNum;
    state.activeCustomWorksheet = null;
    state.workbookAnswers = null;
    state.workbookCheckResult = null;
    state.workbookShowSolutions = false;
    state.customEditorText = (window.WORKBOOKS_RAW_PAGES && window.WORKBOOKS_RAW_PAGES[state.currentWorkbookLevel] && window.WORKBOOKS_RAW_PAGES[state.currentWorkbookLevel][pageNum - 1]) || '';

    const targetHash = `#workbooks:${state.currentWorkbookLevel}:${pageNum}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      renderWorkbookStudio(state.currentWorkbookLevel, pageNum);
    }
  }

  function prevWorkbookPage() {
    jumpToWorkbookPage((state.currentWorkbookPage || 1) - 1);
  }

  function nextWorkbookPage() {
    jumpToWorkbookPage((state.currentWorkbookPage || 1) + 1);
  }

  function goWorkbookPage(val) {
    jumpToWorkbookPage(val);
  }

  function handleGapInput(itemId, val) {
    if (!state.workbookAnswers) state.workbookAnswers = {};
    state.workbookAnswers[itemId] = val;

    if (window.WorkbookEngine && window.WorkbookEngine.saveUserProgress) {
      window.WorkbookEngine.saveUserProgress(state.currentWorkbookLevel, state.currentWorkbookPage, state.workbookAnswers);
    }

    const inputEl = document.getElementById(`gap-input-${itemId}`);
    if (inputEl) {
      inputEl.classList.remove('correct', 'incorrect');
    }
  }

  function handleGapKey(e, inputEl) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const allInputs = Array.from(document.querySelectorAll('.wb-gap-input'));
      const idx = allInputs.indexOf(inputEl);
      if (idx !== -1 && idx < allInputs.length - 1) {
        allInputs[idx + 1].focus();
      } else {
        checkWorkbookAnswers();
      }
    }
  }

  function revealWorkbookSolutions() {
    state.workbookShowSolutions = !state.workbookShowSolutions;
    renderWorkbookStudio(state.currentWorkbookLevel, state.currentWorkbookPage);
  }

  function autoFillWorkbookAnswers() {
    const worksheet = getCurrentWorksheetData(state.currentWorkbookLevel, state.currentWorkbookPage);
    if (!worksheet || !worksheet.exercises) return;

    if (!state.workbookAnswers) state.workbookAnswers = {};
    worksheet.exercises.forEach(ex => {
      ex.items.forEach(it => {
        state.workbookAnswers[it.id] = it.answer;
      });
    });

    if (window.WorkbookEngine && window.WorkbookEngine.saveUserProgress) {
      window.WorkbookEngine.saveUserProgress(state.currentWorkbookLevel, state.currentWorkbookPage, state.workbookAnswers);
    }

    checkWorkbookAnswers();
  }

  function checkWorkbookAnswers() {
    const worksheet = getCurrentWorksheetData(state.currentWorkbookLevel, state.currentWorkbookPage);
    if (!worksheet || !worksheet.exercises) return;

    if (window.WorkbookEngine && window.WorkbookEngine.evaluateWorksheet) {
      state.workbookCheckResult = window.WorkbookEngine.evaluateWorksheet(worksheet.exercises, state.workbookAnswers || {});
    }

    renderWorkbookStudio(state.currentWorkbookLevel, state.currentWorkbookPage);
  }

  function resetWorkbookAnswers() {
    state.workbookAnswers = {};
    state.workbookCheckResult = null;
    state.workbookShowSolutions = false;

    if (window.WorkbookEngine && window.WorkbookEngine.clearUserProgress) {
      window.WorkbookEngine.clearUserProgress(state.currentWorkbookLevel, state.currentWorkbookPage);
    }

    renderWorkbookStudio(state.currentWorkbookLevel, state.currentWorkbookPage);
  }

  function exportWorkbookWorksheet() {
    const worksheet = getCurrentWorksheetData(state.currentWorkbookLevel, state.currentWorkbookPage);
    if (!worksheet) return;

    let text = `# ${worksheet.lessonTitle || 'Arbeitsblatt'}\n`;
    text += `Stufe: ${state.currentWorkbookLevel} | Seite: ${state.currentWorkbookPage}\n`;
    text += `Datum: ${new Date().toLocaleDateString()}\n\n`;

    if (worksheet.exercises) {
      worksheet.exercises.forEach((ex) => {
        text += `## ${ex.title}\n`;
        text += `${ex.instruction}\n\n`;
        ex.items.forEach(it => {
          const userVal = (state.workbookAnswers && state.workbookAnswers[it.id]) || '[nicht beantwortet]';
          const isCorrect = (window.WorkbookEngine && window.WorkbookEngine.isAnswerCorrect)
            ? window.WorkbookEngine.isAnswerCorrect(userVal, it.answer, it.alternatives)
            : false;
          text += `${it.prefix}${userVal}${it.suffix} -> ${isCorrect ? '✓ Korrekt' : `✗ Lösung: ${it.answer}`}\n`;
        });
        text += `\n`;
      });
    }

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Arbeitsblatt_${state.currentWorkbookLevel}_Seite_${state.currentWorkbookPage}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function loadEditorIntoWorksheet() {
    const textarea = document.getElementById('wb-custom-editor-textarea');
    const content = textarea ? textarea.value : (state.customEditorText || '');
    if (!content.trim()) return;

    state.customEditorText = content;
    if (window.WorkbookEngine && window.WorkbookEngine.parseAndGenerateWorksheet) {
      state.activeCustomWorksheet = window.WorkbookEngine.parseAndGenerateWorksheet(content, `Eigenes Arbeitsblatt (${state.currentWorkbookLevel})`);
      state.currentWorkbookViewMode = 'worksheet';
      state.workbookCheckResult = null;
      state.workbookShowSolutions = false;
      renderWorkbookStudio(state.currentWorkbookLevel, state.currentWorkbookPage);
    }
  }

  function loadEditorPreset(presetKey) {
    let presetText = '';
    if (presetKey === 'einfach_deutsch') {
      presetText = `Grammatik A1 Praxis - EinfachDeutsch Beispielsätze
Übung 1: Grundlegende Satzkonstruktionen
a) Ich bin froh.
b) Es geht mir gut, danke!
c) Könnten Sie mir bitte helfen?
d) Ich habe morgen leider keine Zeit.
e) Ich bin froh, dass ich heute viel Deutsch gelernt habe.`;
    } else if (presetKey === 'a1_konjugation') {
      presetText = (window.WORKBOOKS_RAW_PAGES && window.WORKBOOKS_RAW_PAGES['A1'] && window.WORKBOOKS_RAW_PAGES['A1'][2]) || `Grammatik A1 Lektion 1
1.1. Verb - Konjugation
Übung 1
a) Maria komm___ aus Rom.
b) Carlos wohn___ in Passau.
c) Wir trink___ Mineralwasser.
d) Ihr kauf___ ein Eis.`;
    } else if (presetKey === 'a2_kausal') {
      presetText = (window.WORKBOOKS_RAW_PAGES && window.WORKBOOKS_RAW_PAGES['A2'] && window.WORKBOOKS_RAW_PAGES['A2'][2]) || `Grammatik A2 Lektion 1
1.1. Nebensätze - kausal
Übung 1: Verbinden Sie mit "weil"
a) Beate bleibt im Bett, weil sie starke Kopfschmerzen hat.
b) Er versteht uns nicht, weil er nie richtig zuhört.`;
    } else if (presetKey === 'b1_perfekt') {
      presetText = (window.WORKBOOKS_RAW_PAGES && window.WORKBOOKS_RAW_PAGES['B1'] && window.WORKBOOKS_RAW_PAGES['B1'][2]) || `Grammatik B1
Verben - Vergangenheit
1. Das Perfekt
Übung 1: Hilfsverb haben oder sein?
a) Gestern bin ich nach Berlin gefahren.
b) Paula hat gekocht.`;
    } else if (presetKey === 'current_page') {
      presetText = (window.WORKBOOKS_RAW_PAGES && window.WORKBOOKS_RAW_PAGES[state.currentWorkbookLevel] && window.WORKBOOKS_RAW_PAGES[state.currentWorkbookLevel][state.currentWorkbookPage - 1]) || '';
    }

    state.customEditorText = presetText;
    const textarea = document.getElementById('wb-custom-editor-textarea');
    if (textarea) textarea.value = presetText;
  }

  function handleEditorFileUpload(fileInput) {
    if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      state.customEditorText = text;
      const textarea = document.getElementById('wb-custom-editor-textarea');
      if (textarea) textarea.value = text;
    };
    reader.readAsText(file, 'UTF-8');
  }

  function speakWorksheetSentence(sentenceText) {
    if (!sentenceText) return;
    speakGerman(sentenceText, null);
  }

  function switchWorkbookTab(tabName) {
    state.currentWorkbookTab = tabName;
    document.querySelectorAll('.wb-sidecar-tab-btn').forEach(btn => btn.classList.remove('active'));

    const tabToc = document.getElementById('wb-tab-toc');
    const tabNotes = document.getElementById('wb-tab-notes');
    const tabCheat = document.getElementById('wb-tab-cheatsheet');

    if (tabToc) tabToc.style.display = tabName === 'toc' ? 'block' : 'none';
    if (tabNotes) tabNotes.style.display = tabName === 'notes' ? 'flex' : 'none';
    if (tabCheat) tabCheat.style.display = tabName === 'cheatsheet' ? 'block' : 'none';

    const buttons = document.querySelectorAll('.wb-sidecar-tab-btn');
    if (tabName === 'toc' && buttons[0]) buttons[0].classList.add('active');
    if (tabName === 'notes' && buttons[1]) buttons[1].classList.add('active');
    if (tabName === 'cheatsheet' && buttons[2]) buttons[2].classList.add('active');
  }

  function filterWorkbookToc(query) {
    const q = (query || '').toLowerCase().trim();
    const rows = document.querySelectorAll('.wb-toc-row');
    rows.forEach(row => {
      const title = row.getAttribute('data-title') || '';
      if (!q || title.includes(q)) {
        row.style.display = 'flex';
      } else {
        row.style.display = 'none';
      }
    });
  }

  function toggleWorkbookChapter(idx) {
    const levelKey = state.currentWorkbookLevel || 'A1';
    const savedCompletedKey = `dl_wb_completed_${levelKey}`;
    let completedSet = new Set();
    try {
      const stored = localStorage.getItem(savedCompletedKey);
      if (stored) completedSet = new Set(JSON.parse(stored));
    } catch (e) {}

    if (completedSet.has(idx)) {
      completedSet.delete(idx);
    } else {
      completedSet.add(idx);
    }
    localStorage.setItem(savedCompletedKey, JSON.stringify(Array.from(completedSet)));

    const row = document.getElementById(`wb-toc-row-${idx}`);
    const check = document.getElementById(`wb-toc-check-${idx}`);
    if (row && check) {
      if (completedSet.has(idx)) {
        row.classList.add('completed');
        check.checked = true;
      } else {
        row.classList.remove('completed');
        check.checked = false;
      }
    }

    const data = window.WORKBOOKS_DATA && window.WORKBOOKS_DATA[levelKey];
    const totalChapters = (data && data.toc && data.toc.length) || 1;
    const count = completedSet.size;
    const pct = Math.round((count / totalChapters) * 100);
    const textEl = document.getElementById('wb-progress-text');
    const fillEl = document.getElementById('wb-progress-fill');
    if (textEl) textEl.innerHTML = `<strong>${count}</strong> von ${totalChapters} (${pct}%)`;
    if (fillEl) fillEl.style.width = `${pct}%`;
  }

  let notesSaveTimeout = null;
  function saveWorkbookNotes(val) {
    const levelKey = state.currentWorkbookLevel || 'A1';
    localStorage.setItem(`dl_wb_notes_${levelKey}`, val);
    const status = document.getElementById('wb-notes-status');
    if (status) {
      status.textContent = '💾 Speichert...';
      clearTimeout(notesSaveTimeout);
      notesSaveTimeout = setTimeout(() => {
        status.textContent = '✓ Automatisch gespeichert';
      }, 400);
    }
  }

  function insertNoteTemplate(templateType) {
    const textarea = document.getElementById('wb-notes-textarea');
    if (!textarea) return;
    const currPage = state.currentWorkbookPage || 1;
    let snippet = '';
    if (templateType === 'task') {
      snippet = `\n### Aufgabe (Seite ${currPage})\n1. \n2. \n3. \n`;
    } else if (templateType === 'vocab') {
      snippet = `\n- **Neues Wort**: Bedeutung / Übersetzung | Beispielsatz (S. ${currPage})\n`;
    } else if (templateType === 'rule') {
      snippet = `\n💡 **Grammatik-Erkenntnis**: \n- Regel: \n- Beispiel: \n`;
    }
    textarea.value += snippet;
    textarea.focus();
    saveWorkbookNotes(textarea.value);
  }

  function exportWorkbookNotes() {
    const levelKey = state.currentWorkbookLevel || 'A1';
    const notes = localStorage.getItem(`dl_wb_notes_${levelKey}`) || '';
    if (!notes.trim()) {
      alert('Dein Notizheft für diese Stufe ist noch leer. Schreibe zuerst Notizen oder Übungsantworten.');
      return;
    }
    const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DeutscheLernen_Uebungen_${levelKey}_Notizen.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearWorkbookNotes() {
    if (confirm('Möchtest du deine Notizen für dieses Arbeitsbuch wirklich leeren?')) {
      const levelKey = state.currentWorkbookLevel || 'A1';
      localStorage.removeItem(`dl_wb_notes_${levelKey}`);
      const textarea = document.getElementById('wb-notes-textarea');
      if (textarea) textarea.value = '';
      const status = document.getElementById('wb-notes-status');
      if (status) status.textContent = '✓ Notizen geleert';
    }
  }

  function updateSentenceBuilder(field, val) {
    if (!state.sentenceBuilderState) {
      state.sentenceBuilderState = {
        subject: 'Ich bin',
        adjective: 'froh',
        clause: 'weil ich heute viel Deutsch gelernt habe.'
      };
    }
    state.sentenceBuilderState[field] = val;
    renderPracticalWorkbookStudio();
  }

  function speakCurrentSentence() {
    const sentenceEl = document.getElementById('wb-built-sentence');
    if (sentenceEl) {
      speakGerman(sentenceEl.textContent.trim());
    }
  }

  function saveBuiltSentence() {
    const sentenceEl = document.getElementById('wb-built-sentence');
    if (!sentenceEl) return;
    const text = sentenceEl.textContent.trim();
    if (!text) return;

    let customPhrases = [];
    try {
      const stored = localStorage.getItem('dl_custom_phrases');
      if (stored) customPhrases = JSON.parse(stored);
    } catch (e) {}

    customPhrases.unshift({
      de: text,
      trans: "Eigener Übungssatz",
      tip: "Im Satzbau-Studio erstellt",
      cat: "Mein Satz"
    });

    localStorage.setItem('dl_custom_phrases', JSON.stringify(customPhrases));
    renderPracticalWorkbookStudio();
  }

  function deleteCustomPhrase(index) {
    let customPhrases = [];
    try {
      const stored = localStorage.getItem('dl_custom_phrases');
      if (stored) customPhrases = JSON.parse(stored);
    } catch (e) {}

    customPhrases.splice(index, 1);
    localStorage.setItem('dl_custom_phrases', JSON.stringify(customPhrases));
    renderPracticalWorkbookStudio();
  }

  function renderMarkdownContent(markdown, filePath) {
    let renderedHtml = '';
    if (typeof marked !== 'undefined' && marked.parse) {
      marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: true
      });
      renderedHtml = marked.parse(markdown);
    } else {
      renderedHtml = `<pre style="white-space: pre-wrap;">${escapeHtml(markdown)}</pre>`;
    }

    elements.contentArea.innerHTML = `<div class="markdown-body" id="rendered-md">${renderedHtml}</div>`;
    elements.mainScrollArea.scrollTop = 0;

    // Post-processing enhancements
    enhanceRenderedMarkdown(filePath);
  }

  function enhanceRenderedMarkdown(filePath) {
    const container = document.getElementById('rendered-md');
    if (!container) return;

    // 1. Wrap tables for horizontal responsiveness
    const tables = container.querySelectorAll('table');
    tables.forEach(table => {
      if (!table.parentElement.classList.contains('table-responsive')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });

    // 2. Add TTS speaker button to headings (h2, h3)
    const headings = container.querySelectorAll('h2, h3');
    headings.forEach((heading, idx) => {
      if (!heading.id) {
        heading.id = `heading-${idx}`;
      }

      const textToSpeak = heading.innerText.replace(/[📖🗂️📌💼🎭⚡🧭0-9\.\(\)]/g, '').trim();
      if (textToSpeak && textToSpeak.length > 2) {
        const speakBtn = document.createElement('button');
        speakBtn.className = 'tts-speak-btn';
        speakBtn.title = 'Aussprache anhören (Deutsch)';
        speakBtn.innerHTML = '🔊';
        speakBtn.setAttribute('aria-label', `Aussprache für ${textToSpeak}`);
        speakBtn.onclick = (e) => {
          e.stopPropagation();
          speakGerman(textToSpeak);
        };
        heading.appendChild(speakBtn);
      }
    });

    // 3. Highlight grammatical genders
    highlightGenders(container);

    // 4. Enhance audio & pronunciation links to play in place without opening new pages
    enhanceAudioLinks(container);

    // 5. Intercept internal markdown links to keep navigation inside the SPA
    interceptInternalLinks(container, filePath);

    // 6. Generate Table of Contents (Outline) on right panel
    generateToc(container);
  }

  let currentAudio = null;

  function enhanceAudioLinks(container) {
    const links = container.querySelectorAll('a');
    links.forEach(a => {
      const href = a.getAttribute('href') || '';
      const text = a.innerText.trim();

      const isAudioIcon = text === '🔊' || text === '🔉' || text === '🔈';
      const isAudioFile = href.includes('.ogg') || href.includes('.mp3') || href.includes('.wav') || href.includes('Special:FilePath') || href.includes('forvo.com');

      if (isAudioIcon || isAudioFile) {
        // Extract the German word from the same table row or surrounding context
        let germanWord = '';
        const tr = a.closest('tr');
        if (tr) {
          const firstTd = tr.querySelector('td');
          if (firstTd) {
            germanWord = firstTd.innerText.split(',')[0].replace(/[\*\_]/g, '').trim();
          }
        }
        if (!germanWord) {
          germanWord = a.parentElement.innerText.replace(/[🔊🔉🔈\[\]\(\)\/]/g, '').trim();
        }

        // Style as interactive inline audio button
        a.classList.add('inline-audio-btn');
        a.title = germanWord ? `Aussprache für "${germanWord}" hier abspielen` : 'Aussprache abspielen';
        a.setAttribute('role', 'button');
        a.setAttribute('aria-label', `Aussprache für ${germanWord}`);
        a.removeAttribute('target');
        a.removeAttribute('rel');

        // Play in place - DO NOT open another page!
        a.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          playAudioInPlace(href, germanWord, a);
          return false;
        };
      }
    });
  }

  function playAudioInPlace(audioUrl, fallbackWord, btnElement) {
    if (currentAudio) {
      try { currentAudio.pause(); } catch(e) {}
      currentAudio = null;
    }
    document.querySelectorAll('.inline-audio-btn.playing, .tts-speak-btn.playing').forEach(b => b.classList.remove('playing'));

    if (btnElement) {
      btnElement.classList.add('playing');
    }

    const cleanFallback = fallbackWord ? fallbackWord.replace(/[\*\_\[\]\(\)\,\.\:\-]/g, '').trim() : '';

    const finish = () => {
      if (btnElement) btnElement.classList.remove('playing');
      currentAudio = null;
    };

    const fallbackTTS = () => {
      if (cleanFallback) {
        speakGerman(cleanFallback, finish);
      } else {
        finish();
      }
    };

    if (audioUrl && (audioUrl.includes('.ogg') || audioUrl.includes('.mp3') || audioUrl.includes('.wav') || audioUrl.includes('Special:FilePath'))) {
      try {
        const audio = new Audio(audioUrl);
        currentAudio = audio;

        audio.onended = finish;
        audio.onerror = () => {
          fallbackTTS();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            fallbackTTS();
          });
        }
      } catch (err) {
        fallbackTTS();
      }
    } else {
      fallbackTTS();
    }
  }

  function resolveRelativePath(basePath, relativePath) {
    const parts = relativePath.split('#');
    const pathOnly = parts[0];
    const anchor = parts[1] ? '#' + parts[1] : '';

    if (!pathOnly) return anchor;

    const baseDir = basePath.includes('/') ? basePath.substring(0, basePath.lastIndexOf('/')) : '';
    const combined = baseDir ? baseDir + '/' + pathOnly : pathOnly;

    const segments = combined.split('/');
    const resolved = [];
    for (const seg of segments) {
      if (seg === '.' || seg === '') continue;
      if (seg === '..') {
        if (resolved.length > 0) resolved.pop();
      } else {
        resolved.push(seg);
      }
    }
    return resolved.join('/') + anchor;
  }

  function interceptInternalLinks(container, filePath) {
    const links = container.querySelectorAll('a');
    links.forEach(a => {
      if (a.classList.contains('inline-audio-btn')) {
        return; // Handled by playAudioInPlace, never open new page!
      }
      const href = a.getAttribute('href');
      if (!href) return;
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        return;
      }
      if (href.startsWith('#')) {
        const targetId = href.substring(1);
        a.onclick = (e) => {
          e.preventDefault();
          scrollToHeading(e, targetId);
        };
        return;
      }
      if (href.includes('.md')) {
        const resolved = resolveRelativePath(filePath, href);
        a.href = '#doc:' + encodeURIComponent(resolved);
        a.onclick = (e) => {
          e.preventDefault();
          window.location.hash = '#doc:' + encodeURIComponent(resolved);
        };
      }
    });
  }

  function highlightGenders(container) {
    const strongs = container.querySelectorAll('strong, em');
    strongs.forEach(el => {
      const text = el.innerText.trim();
      if (text === 'der' || text === 'den' || text === 'dem' || text === 'des') {
        el.classList.add('gender-der');
      } else if (text === 'die' || text === 'der (Fem.)') {
        el.classList.add('gender-die');
      } else if (text === 'das') {
        el.classList.add('gender-das');
      }
    });
  }

  // =========================================================================
  // Table of Contents (Outline)
  // =========================================================================

  function generateToc(container) {
    const headings = container.querySelectorAll('h2, h3, h4');
    if (headings.length < 2) {
      hideToc();
      return;
    }

    let tocHtml = '<div class="toc-title">Inhaltsverzeichnis</div>';
    headings.forEach(heading => {
      const level = heading.tagName.toLowerCase();
      const text = heading.innerText.replace('🔊', '').trim();
      const id = heading.id;
      tocHtml += `
        <a href="#${id}" class="toc-link level-${level.replace('h', '')}" onclick="window.DL.scrollToHeading(event, '${id}')">
          ${text}
        </a>
      `;
    });

    elements.tocList.innerHTML = tocHtml;
    elements.tocPanel.classList.add('visible');
  }

  function hideToc() {
    elements.tocPanel.classList.remove('visible');
    elements.tocList.innerHTML = '';
  }

  function scrollToHeading(e, id) {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // =========================================================================
  // German Text-To-Speech (Web Speech API)
  // =========================================================================

  let germanVoice = null;

  function initSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        germanVoice = voices.find(v => v.lang.startsWith('de')) || null;
      };
      setVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
    }
  }

  function speakGerman(text, onEndCallback) {
    if (!('speechSynthesis' in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    if (germanVoice) {
      utterance.voice = germanVoice;
    }
    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }
    window.speechSynthesis.speak(utterance);
  }

  // =========================================================================
  // 15-Minute Daily Routine Timer (At the top of the page)
  // =========================================================================

  function toggleTimer() {
    if (state.timerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  function startTimer() {
    state.timerRunning = true;
    updateTimerButtonUI();
    state.timerInterval = setInterval(() => {
      if (state.timerRemaining > 0) {
        state.timerRemaining--;
        updateTimerDisplay();
      } else {
        pauseTimer();
        speakGerman('Hervorragend gemacht! Deine 15 Minuten Deutsch-Lernroutine sind für heute abgeschlossen.');
        alert('🎉 Hervorragend! Deine 15 Minuten Deutsch-Lernzeit für heute sind abgeschlossen!');
      }
    }, 1000);
  }

  function pauseTimer() {
    state.timerRunning = false;
    clearInterval(state.timerInterval);
    updateTimerButtonUI();
  }

  function resetTimer() {
    pauseTimer();
    state.timerRemaining = state.timerSeconds;
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const mins = Math.floor(state.timerRemaining / 60);
    const secs = state.timerRemaining % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (elements.topTimerDisplay) {
      elements.topTimerDisplay.textContent = formatted;
    }

    // Step calculation:
    // Min 0-5 (900s down to 600s) -> Step 1 (Grammatik)
    // Min 5-10 (600s down to 300s) -> Step 2 (Satzbau)
    // Min 10-15 (300s down to 0s) -> Step 3 (Praxis)
    let stepName = '1. Grammatik (5m)';
    let stepNum = 1;
    if (state.timerRemaining <= 300) {
      stepName = '3. Praxis & Kultur (5m)';
      stepNum = 3;
    } else if (state.timerRemaining <= 600) {
      stepName = '2. Satzbau & Fragen (5m)';
      stepNum = 2;
    }

    if (elements.topTimerStepBadge) {
      elements.topTimerStepBadge.textContent = stepName;
      if (state.timerRunning) {
        elements.topTimerStepBadge.style.background = 'var(--color-primary)';
        elements.topTimerStepBadge.style.color = '#ffffff';
      } else {
        elements.topTimerStepBadge.style.background = 'var(--color-primary-light)';
        elements.topTimerStepBadge.style.color = 'var(--color-primary)';
      }
    }

    // Highlight on dashboard cards if on home
    [1, 2, 3].forEach(s => {
      const card = document.getElementById(`step-card-${s}`);
      if (card) {
        if (s === stepNum && state.timerRunning) {
          card.style.borderColor = 'var(--color-primary)';
          card.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.3)';
        } else {
          card.style.borderColor = 'var(--border-color)';
          card.style.boxShadow = 'none';
        }
      }
    });
  }

  function updateTimerButtonUI() {
    if (elements.topTimerToggleBtn) {
      elements.topTimerToggleBtn.innerHTML = state.timerRunning ? '⏸ Pause' : '▶ Start';
    }
  }

  // =========================================================================
  // Reading Progress & Helpers
  // =========================================================================

  function updateReadingProgress() {
    const el = elements.mainScrollArea;
    const total = el.scrollHeight - el.clientHeight;
    if (total > 0) {
      const percentage = (el.scrollTop / total) * 100;
      elements.readingProgress.style.width = `${percentage}%`;
    } else {
      elements.readingProgress.style.width = '0%';
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Expose methods for HTML inline events
  window.DL = {
    toggleGroup,
    toggleTimer,
    resetTimer,
    speakGerman,
    playAudioInPlace,
    scrollToHeading,
    switchWorkbook,
    switchWorkbookViewMode,
    jumpToWorkbookPage,
    prevWorkbookPage,
    nextWorkbookPage,
    goWorkbookPage,
    switchWorkbookTab,
    filterWorkbookToc,
    toggleWorkbookChapter,
    saveWorkbookNotes,
    insertNoteTemplate,
    exportWorkbookNotes,
    clearWorkbookNotes,
    handleGapInput,
    handleGapKey,
    revealWorkbookSolutions,
    autoFillWorkbookAnswers,
    checkWorkbookAnswers,
    resetWorkbookAnswers,
    exportWorkbookWorksheet,
    loadEditorIntoWorksheet,
    loadEditorPreset,
    handleEditorFileUpload,
    speakWorksheetSentence,
    updateSentenceBuilder,
    speakCurrentSentence,
    saveBuiltSentence,
    deleteCustomPhrase
  };

  // Run on DOM Content Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
