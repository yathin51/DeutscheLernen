// ==========================================================================
// DeutscheLernen - Modular, Student-Centric Workbook Studio Architecture
// ==========================================================================

(function(window) {
  'use strict';

  const WorkbookStudio = {
    state: {
      level: 'A1',
      page: 3,
      answers: {},
      checkResult: null,
      showSolutions: false,
      revealedHints: new Set(),
      revealedSolutions: new Set(),
      teachingsCollapsed: false,
      activeDrawer: null, // 'rules' | 'solutions' | 'pdf' | 'toc' | null
      viewMode: 'worksheet' // 'worksheet' | 'split'
    }
  };

  // One-time cleanup of legacy test answers from previous sessions
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('dl_wb_clean_v2') !== '1') {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('dl_wb_answers_')) {
          localStorage.removeItem(k);
        }
      });
      localStorage.setItem('dl_wb_clean_v2', '1');
    }
  } catch (e) {}

  // --------------------------------------------------------------------------
  // Data Access & Normalization
  // --------------------------------------------------------------------------

  WorkbookStudio.getMeta = function(levelKey) {
    const normLevel = (levelKey || 'A1').replace(/_WORKBOOK$/i, '').toUpperCase();
    const data = (window.WORKBOOKS_DATA && (window.WORKBOOKS_DATA[normLevel] || window.WORKBOOKS_DATA[levelKey])) || (window.WORKBOOKS_DATA && window.WORKBOOKS_DATA['A1']);
    return data || {
      level: normLevel,
      title: `Arbeitsbuch ${normLevel}`,
      author: 'Hans Witzlinger',
      edition: 'Passau',
      pages: 32,
      exerciseStartPage: 3,
      introPages: [1, 2],
      toc: []
    };
  };

  WorkbookStudio.getWorksheetData = function(levelKey, page) {
    const normLevel = (levelKey || 'A1').replace(/_WORKBOOK$/i, '').toUpperCase();
    // 1. Direct O(1) Answer Key Database
    const keysObj = (window.WORKBOOKS_KEYS && (window.WORKBOOKS_KEYS[normLevel] || window.WORKBOOKS_KEYS[levelKey])) || null;
    if (keysObj && keysObj[page]) {
      const kd = keysObj[page];
      if (kd && kd.exercises && kd.exercises.length > 0) {
        return {
          lessonTitle: kd.lessonTitle || `${normLevel} - Seite ${page}`,
          grammarSummary: kd.grammarSummary || '',
          exercises: kd.exercises
        };
      }
    }

    // 2. Preloaded Engine Lesson
    if (window.WorkbookEngine && window.WorkbookEngine.getPreloadedLesson) {
      const pre = window.WorkbookEngine.getPreloadedLesson(normLevel, page) || window.WorkbookEngine.getPreloadedLesson(levelKey, page);
      if (pre) return pre;
    }

    // 3. Dynamic Parser fallback from raw page text
    const rawPagesObj = (window.WORKBOOKS_RAW_PAGES && (window.WORKBOOKS_RAW_PAGES[normLevel] || window.WORKBOOKS_RAW_PAGES[levelKey])) || null;
    if (rawPagesObj && rawPagesObj[page - 1]) {
      const rawText = rawPagesObj[page - 1];
      if (window.WorkbookEngine && window.WorkbookEngine.parseAndGenerateWorksheet) {
        return window.WorkbookEngine.parseAndGenerateWorksheet(rawText, null, normLevel, page);
      }
    }

    return {
      lessonTitle: `${normLevel} - Seite ${page}`,
      grammarSummary: '<p style="color: var(--text-muted);">Keine Übungsinhalte für diese Seite vorhanden.</p>',
      exercises: []
    };
  };

  // --------------------------------------------------------------------------
  // Main Render Entry
  // --------------------------------------------------------------------------

  WorkbookStudio.render = function(container, requestedLevel, requestedPage) {
    if (!container) return;

    // Normalization of level & page
    const levelKey = requestedLevel || WorkbookStudio.state.level || 'A1';
    if (levelKey.endsWith('_PRACTICAL') || levelKey === 'practical') {
      const lvl = levelKey === 'practical' ? 'A1' : levelKey.replace('_PRACTICAL', '').toUpperCase();
      WorkbookStudio.renderPracticalStudio(container, ['A1', 'A2', 'B1', 'B2', 'C1'].includes(lvl) ? lvl : 'A1');
      return;
    }
    const meta = WorkbookStudio.getMeta(levelKey);
    const startPage = meta.exerciseStartPage || 3;
    const totalPages = meta.pages || 32;

    let pageNum = requestedPage ? parseInt(requestedPage, 10) : WorkbookStudio.state.page;
    if (isNaN(pageNum) || pageNum < 1) pageNum = startPage;
    if (pageNum > totalPages) pageNum = totalPages;

    const isPageChange = (WorkbookStudio.state.level !== levelKey) || (WorkbookStudio.state.page !== pageNum);

    // Update state
    WorkbookStudio.state.level = levelKey;
    WorkbookStudio.state.page = pageNum;

    if (isPageChange) {
      // Load saved user answers from localStorage
      WorkbookStudio.state.answers = (window.WorkbookEngine && window.WorkbookEngine.loadUserProgress)
        ? window.WorkbookEngine.loadUserProgress(levelKey, pageNum)
        : {};
      WorkbookStudio.state.checkResult = null;
      WorkbookStudio.state.showSolutions = false;
      WorkbookStudio.state.revealedHints.clear();
      if (WorkbookStudio.state.revealedSolutions) {
        WorkbookStudio.state.revealedSolutions.clear();
      } else {
        WorkbookStudio.state.revealedSolutions = new Set();
      }
    }

    const worksheet = WorkbookStudio.getWorksheetData(levelKey, pageNum);

    // Calculate progress stats
    let totalItems = 0;
    let answeredItems = 0;
    worksheet.exercises.forEach(ex => {
      (ex.items || []).forEach(it => {
        totalItems++;
        if (WorkbookStudio.state.answers[it.id] && WorkbookStudio.state.answers[it.id].trim()) {
          answeredItems++;
        }
      });
    });

    const isIntroPage = Boolean(meta.introPages && meta.introPages.includes(pageNum));
    const activeDrawer = WorkbookStudio.state.activeDrawer;

    // Render Clean HTML
    container.innerHTML = `
      <div class="wb-studio-wrapper ${activeDrawer ? 'drawer-open' : ''}">
        <!-- Top Studio Action Bar -->
        ${WorkbookStudio.renderTopBarHtml(meta, levelKey, pageNum, totalPages, totalItems, answeredItems)}

        <!-- Main Workspace Area -->
        <div class="wb-workspace-layout ${WorkbookStudio.state.viewMode === 'split' ? 'is-split' : ''}">
          <div class="wb-content-canvas">
            ${isIntroPage 
              ? WorkbookStudio.renderIntroCardHtml(meta, levelKey, pageNum) 
              : WorkbookStudio.renderWorksheetCanvasHtml(worksheet, levelKey, pageNum, meta)}
          </div>

          ${WorkbookStudio.state.viewMode === 'split' ? `
            <div class="wb-split-pdf-pane">
              <object data="${meta.pdfPath}#page=${pageNum}" type="application/pdf" class="wb-split-pdf-frame">
                <iframe src="${meta.pdfPath}#page=${pageNum}" class="wb-split-pdf-frame" title="${WorkbookStudio.escapeHtml(meta.title)}"></iframe>
              </object>
            </div>
          ` : ''}
        </div>

        <!-- Slide-out Drawers -->
        ${WorkbookStudio.renderDrawersHtml(meta, levelKey, pageNum, worksheet)}
      </div>
    `;

    // Re-focus first input on worksheet load if available
    setTimeout(() => {
      const firstInput = container.querySelector('.wb-gap-inline');
      if (firstInput && !firstInput.value) {
        firstInput.focus();
      }
    }, 50);
  };

  // --------------------------------------------------------------------------
  // Studio Top Bar
  // --------------------------------------------------------------------------

  WorkbookStudio.renderTopBarHtml = function(meta, levelKey, page, totalPages, totalItems, answeredItems) {
    const levels = [
      { id: 'A1', label: 'A1 Anfänger' },
      { id: 'A2', label: 'A2 Grundstufe' },
      { id: 'B1', label: 'B1 Mittelstufe 1' },
      { id: 'B2', label: 'B2 Mittelstufe 2' },
      { id: 'C1', label: 'C1 Oberstufe' },
      { id: 'A1_PRACTICAL', label: '✍️ Satzbau-Praxis' }
    ];

    const prevDisabled = page <= 1 ? 'disabled' : '';
    const nextDisabled = page >= totalPages ? 'disabled' : '';
    const progressPct = totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0;

    return `
      <header class="wb-studio-topbar">
        <!-- Left: Level Switcher Pills -->
        <div class="wb-topbar-levels" role="tablist">
          ${levels.map(l => `
            <button 
              class="wb-level-pill ${levelKey === l.id ? 'active' : ''}" 
              onclick="window.WorkbookStudio.switchLevel('${l.id}')"
              title="Wechsle zu Stufe ${l.label}"
            >
              ${l.id === 'A1_PRACTICAL' ? '✍️ Praxis' : l.id}
            </button>
          `).join('')}
        </div>

        <!-- Center: Lesson & Page Navigator -->
        <div class="wb-topbar-navigator">
          <button class="wb-nav-arrow" ${prevDisabled} onclick="window.WorkbookStudio.changePage(${page - 1})" title="Vorherige Seite (◀)">
            ◀
          </button>
          
          <div class="wb-nav-info">
            <div class="wb-nav-title-row">
              <span class="wb-level-tag">${levelKey}</span>
              <span class="wb-page-indicator">Seite <strong>${page}</strong> von ${totalPages}</span>
            </div>
            <div class="wb-page-progress-track" title="${answeredItems} von ${totalItems} Lücken bearbeitet (${progressPct}%)">
              <div class="wb-page-progress-fill" style="width: ${progressPct}%;"></div>
            </div>
          </div>

          <button class="wb-nav-arrow" ${nextDisabled} onclick="window.WorkbookStudio.changePage(${page + 1})" title="Nächste Seite (▶)">
            ▶
          </button>
        </div>

        <!-- Right: Drawer Toggles & View Controls -->
        <div class="wb-topbar-tools">
          <button 
            class="wb-tool-btn ${WorkbookStudio.state.activeDrawer === 'rules' ? 'active' : ''}" 
            onclick="window.WorkbookStudio.toggleDrawer('rules')" 
            title="Grammatik-Regeln & Formeln zu dieser Lektion einblenden"
          >
            <span>💡</span>
            <span class="hide-mobile">Grammatik-Tipps</span>
          </button>

          <button 
            class="wb-tool-btn ${WorkbookStudio.state.activeDrawer === 'solutions' ? 'active' : ''}" 
            onclick="window.WorkbookStudio.toggleDrawer('solutions')" 
            title="Lösungsheft mit allen Musterlösungen öffnen"
          >
            <span>🔑</span>
            <span class="hide-mobile">Lösungsheft</span>
          </button>

          <button 
            class="wb-tool-btn ${WorkbookStudio.state.viewMode === 'split' ? 'active' : ''}" 
            onclick="window.WorkbookStudio.toggleSplitMode()" 
            title="PDF-Buch nebeneinander einblenden"
          >
            <span>🌓</span>
            <span class="hide-mobile">PDF Geteilt</span>
          </button>
        </div>
      </header>
    `;
  };

  // --------------------------------------------------------------------------
  // Worksheet Canvas
  // --------------------------------------------------------------------------

  WorkbookStudio.renderWorksheetCanvasHtml = function(worksheet, levelKey, page, meta) {
    const totalPages = (meta && meta.pages) || 32;
    const exercises = worksheet.exercises || [];
    const checkResult = WorkbookStudio.state.checkResult;
    const showSolutions = WorkbookStudio.state.showSolutions;

    // Score Banner if evaluated
    let scoreBannerHtml = '';
    if (checkResult) {
      const pct = checkResult.scorePercent;
      let moodEmoji = '🎉';
      let moodText = 'Hervorragend gelöst!';
      if (pct < 50) {
        moodEmoji = '💪';
        moodText = 'Guter Anfang! Nutze die Grammatik-Tipps und probiere es noch einmal.';
      } else if (pct < 85) {
        moodEmoji = '👍';
        moodText = 'Gut gemacht! Fast alle Lücken sind korrekt.';
      }

      scoreBannerHtml = `
        <div class="wb-score-card">
          <div class="wb-score-badge ${pct >= 85 ? 'high' : (pct >= 50 ? 'med' : 'low')}">
            ${pct}%
          </div>
          <div class="wb-score-details">
            <h4>${moodEmoji} ${checkResult.correct} von ${checkResult.total} Aufgaben richtig</h4>
            <p>${moodText}</p>
          </div>
          <div class="wb-score-actions">
            <button class="wb-btn-primary" onclick="window.WorkbookStudio.resetAnswers()">
              ↺ Neu starten
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="wb-worksheet-body">
        <!-- Lesson Header Card -->
        <div class="wb-lesson-header">
          <div class="wb-lesson-header-left">
            <span class="wb-pill-badge">${levelKey} · Lektion ${Math.max(1, page - 2)}</span>
            <h2 class="wb-lesson-title">${WorkbookStudio.escapeHtml(worksheet.lessonTitle || 'Grammatikübung')}</h2>
          </div>
          <div class="wb-lesson-header-right">
            <button class="wb-btn-subtle" onclick="window.WorkbookStudio.toggleDrawer('toc')" title="Inhaltsverzeichnis aller Lektionen öffnen">
              📋 Alle Lektionen (${meta.toc ? meta.toc.length : 32})
            </button>
          </div>
        </div>

        ${scoreBannerHtml}

        <!-- 📖 Pre-Activity Workbook Teachings & Vorwissen -->
        ${WorkbookStudio.renderTeachingsCardHtml(worksheet, levelKey, page)}

        <!-- Exercises List -->
        <div class="wb-exercises-container">
          ${exercises.map((ex, exIdx) => WorkbookStudio.renderExerciseCardHtml(ex, exIdx, checkResult, showSolutions)).join('')}

        ${page >= totalPages ? `
          <div class="wb-level-completion-card" style="margin: 2rem 0; border-radius: var(--radius-lg, 12px); background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 2px solid #38bdf8; padding: 1.75rem; text-align: center; color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            <div style="font-size: 2.75rem; margin-bottom: 0.5rem;">🎉🎓🌟</div>
            <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem; color: #38bdf8;">Herzlichen Glückwunsch! Stufe ${levelKey} Arbeitsbuch abgeschlossen!</h3>
            <p style="font-size: 0.95rem; color: #cbd5e1; max-width: 650px; margin: 0 auto 1.25rem auto; line-height: 1.5;">
              Du hast alle Seiten dieser Stufe bearbeitet. Festige dein Wissen jetzt mit dem farbcodierten, interaktiven Abschluss-Spickzettel mit allen grammatischen Formeln, Witzlinger-Regeln und Sprech-Mustern!
            </p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <a href="#cheatsheet:${levelKey}" class="wb-btn-primary" style="text-decoration: none; padding: 0.7rem 1.4rem; font-weight: 700; font-size: 0.95rem; border-radius: 8px;">
                🌈 Zum bunten ${levelKey} Abschluss-Spickzettel (Recap) →
              </a>
              <a href="#doc:${levelKey}/Spickzettel.md" class="wb-btn-subtle" style="text-decoration: none; padding: 0.7rem 1.4rem; color: #cbd5e1; border: 1px solid #475569; border-radius: 8px;">
                📄 Skript im Lesemodus
              </a>
            </div>
          </div>
        ` : ''}

        </div>

        <!-- Sticky Floating Action Dock -->
        <div class="wb-action-dock">
          <div class="wb-action-dock-inner">
            <button class="wb-btn-primary" onclick="window.WorkbookStudio.checkAnswers()" title="Antworten überprüfen (Tastatur: Enter)">
              <span>✅</span>
              <span>Eingaben prüfen (Enter)</span>
            </button>

            <button class="wb-btn-secondary" onclick="window.WorkbookStudio.toggleSolutions()" title="Lösungen ein- oder ausblenden">
              <span>💡</span>
              <span>${showSolutions ? 'Lösungen verbergen' : 'Lösungen anzeigen'}</span>
            </button>

            <button class="wb-btn-subtle" onclick="window.WorkbookStudio.autoFillAnswers()" title="Lücken im Lernmodus automatisch ausfüllen">
              <span>✍️</span>
              <span>Auto-Fill (Lernen)</span>
            </button>

            <button class="wb-btn-subtle" onclick="window.WorkbookStudio.resetAnswers()" title="Alle Lücken dieser Seite leeren">
              <span>↺</span>
              <span>Leeren</span>
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // --------------------------------------------------------------------------
  // Pre-Activity Workbook Teachings Card (Grammar & Pre-Knowledge)
  // --------------------------------------------------------------------------

  WorkbookStudio.renderTeachingsCardHtml = function(worksheet, levelKey, page) {
    const rawTeachings = worksheet.grammarSummary || '';
    if (!rawTeachings.trim()) return '';

    const isCollapsed = Boolean(WorkbookStudio.state.teachingsCollapsed);

    let renderedHtml = '';
    if (typeof marked !== 'undefined' && marked.parse) {
      renderedHtml = marked.parse(rawTeachings);
    } else {
      renderedHtml = `<pre style="white-space: pre-wrap; font-family: inherit;">${WorkbookStudio.escapeHtml(rawTeachings)}</pre>`;
    }

    return `
      <section class="wb-teachings-card ${isCollapsed ? 'collapsed' : ''}" id="wb-teachings-card" aria-label="Unterricht & Grammatik-Vorwissen">
        <header class="wb-teachings-header">
          <div class="wb-teachings-title-group">
            <div class="wb-teachings-icon">📖</div>
            <div>
              <div class="wb-teachings-badge-row">
                <span class="wb-teachings-badge">🎓 Unterricht & Grammatik-Fokus</span>
                <span class="wb-teachings-subbadge">Vor der Aktivität aufmerksam durchlesen</span>
              </div>
              <h3 class="wb-teachings-title">Regeln, Strukturen & Vorwissen (Seite ${page})</h3>
            </div>
          </div>
          <div class="wb-teachings-actions">
            <button 
              class="wb-teachings-btn" 
              onclick="window.WorkbookStudio.toggleTeachings()" 
              title="${isCollapsed ? 'Grammatik-Erklärung aufklappen' : 'Grammatik-Erklärung einklappen'}"
            >
              <span>${isCollapsed ? '▼' : '▲'}</span>
              <span>${isCollapsed ? 'Regeln anzeigen' : 'Einklappen'}</span>
            </button>
          </div>
        </header>

        <div class="wb-teachings-body" style="${isCollapsed ? 'display: none;' : 'display: block;'}">
          <div class="wb-teachings-content markdown-body">
            ${renderedHtml}
          </div>
          <div class="wb-teachings-footer">
            <div class="wb-teachings-callout">
              💡 <strong>Didaktischer Hinweis:</strong> Präge dir die Endungen, Satzmuster und Signalwörter gut ein, bevor du mit den Lückenübungen beginnst.
            </div>
            ${(levelKey.startsWith('A1') || levelKey.startsWith('A2')) ? `
              <div class="wb-english-help-box" style="margin-top: 0.6rem; padding: 0.5rem 0.75rem; background: rgba(30, 58, 138, 0.25); border-left: 3px solid #3b82f6; border-radius: 4px; font-size: 0.82rem; color: #bfdbfe;">
                🇬🇧 <strong>English Instruction Key:</strong>
                <em>Ergänzen Sie</em> = Fill in/Complete | 
                <em>Bilden Sie Sätze</em> = Form sentences | 
                <em>Antworten Sie</em> = Answer | 
                <em>Ordnen Sie zu</em> = Match/Order | 
                <em>Wählen Sie aus</em> = Choose/Select
              </div>
            ` : ''}
            <button class="wb-btn-secondary" onclick="window.WorkbookStudio.toggleDrawer('rules')">
              ⚡ Mehr Tipps & Spickzettel ↗
            </button>
          </div>
        </div>
      </section>
    `;
  };

  // --------------------------------------------------------------------------
  // Exercise Card & Sentence Items
  // --------------------------------------------------------------------------
  WorkbookStudio.renderExerciseCardHtml = function(ex, exIdx, checkResult, showSolutions) {
    const items = ex.items || [];
    let wordBankList = (ex.wordBank && ex.wordBank.length > 0) ? ex.wordBank : (ex.wordBox && ex.wordBox.length > 0 ? ex.wordBox : []);
    if (!wordBankList.length && ex.wortkasten && ex.wortkasten.length > 0) {
      wordBankList = ex.wortkasten;
    }
    const hasWordBank = wordBankList.length > 0;

    return `
      <div class="wb-exercise-panel" id="${ex.id || 'ex_' + exIdx}">
        <div class="wb-exercise-panel-header">
          <div>
            <h3 class="wb-exercise-heading">📝 ${WorkbookStudio.escapeHtml(ex.title || `Übung ${exIdx + 1}`)}</h3>
            ${ex.instruction ? `<p class="wb-exercise-guidance">${WorkbookStudio.escapeHtml(ex.instruction)}</p>` : ''}
          </div>
          <span class="wb-exercise-count-tag">${items.length} Teilaufgaben</span>
        </div>

        ${hasWordBank ? `
          <div class="wb-wordbank-strip">
            <span class="wb-wordbank-title">📦 Wortkasten:</span>
            ${wordBankList.map(w => `<span class="wb-word-chip">${WorkbookStudio.escapeHtml(w)}</span>`).join('')}
          </div>
        ` : ''}

        ${ex.example ? `
          <div class="wb-example-banner">
            💡 <strong>Beispiel:</strong> ${WorkbookStudio.escapeHtml(ex.example)}
          </div>
        ` : ''}

        <!-- Interactive Item Rows -->
        <div class="wb-items-grid">
          ${items.map(item => WorkbookStudio.renderItemRowHtml(item, checkResult, showSolutions)).join('')}
        </div>
      </div>
    `;
  };

  WorkbookStudio.renderItemRowHtml = function(item, checkResult, showSolutions) {
    const userVal = WorkbookStudio.state.answers[item.id] || '';
    const itemResult = checkResult && checkResult.results ? checkResult.results[item.id] : null;

    const isRevealed = Boolean(WorkbookStudio.state.revealedSolutions && WorkbookStudio.state.revealedSolutions.has(item.id));

    let statusClass = '';
    let feedbackHtml = '';

    if (itemResult) {
      if (itemResult.status === 'correct') {
        statusClass = 'is-correct';
        feedbackHtml = `<span class="wb-feedback-tag correct">✓ Richtig</span>`;
      } else if (itemResult.status === 'incorrect') {
        statusClass = 'is-incorrect';
        feedbackHtml = `
          <span class="wb-feedback-tag incorrect" title="Grammatik: ${WorkbookStudio.escapeHtml(item.explanation)}">
            ❌ <strong>${WorkbookStudio.escapeHtml(item.answer)}</strong>
          </span>
        `;
      } else if (itemResult.status === 'unanswered') {
        statusClass = 'is-unanswered';
        feedbackHtml = `
          <span class="wb-feedback-tag unanswered">
            ⚠️ Nicht ausgefüllt (Lösung: <strong>${WorkbookStudio.escapeHtml(item.answer)}</strong>)
          </span>
        `;
      }
    } else if (showSolutions || isRevealed) {
      feedbackHtml = `
        <span class="wb-feedback-tag correct solution-tag" title="${WorkbookStudio.escapeHtml(item.explanation || 'Musterlösung')}">
          👁️ Lösung: <strong>${WorkbookStudio.escapeHtml(item.answer)}</strong>
        </span>
      `;
    }

    const itemLabel = item.label || '';
    const itemPrompt = item.prompt || '';
    let leadText = item.prefix || item.lead || '';
    let tailText = item.suffix || item.tail || '';

    // If prefix still has prompt or label, clean it up
    if (itemLabel) leadText = leadText.replace(/^[a-z0-9]+[\.\)]\s*/i, '');
    if (itemPrompt) leadText = leadText.replace(/^(?:\(([\wäöüÄÖÜß]+)\)|([\wäöüÄÖÜß]+):)\s*/i, '');

    const isCompact = item.isCompact || item.is_compact || (item.answer && item.answer.trim().length <= 4);

    return `
      <div class="wb-item-row" id="row-${item.id}">
        ${itemLabel ? `<span class="wb-item-num">${WorkbookStudio.escapeHtml(itemLabel)}</span>` : ''}
        ${itemPrompt ? `<span class="wb-prompt-badge" title="Vorgabe">${WorkbookStudio.escapeHtml(itemPrompt)}</span>` : ''}
        
        <div class="wb-sentence-builder">
          <span class="wb-sentence-lead">${WorkbookStudio.escapeHtml(leadText)}</span>
          
          <input
            type="text"
            class="wb-gap-inline ${isCompact ? 'compact' : ''} ${statusClass}"
            id="gap-${item.id}"
            data-item-id="${item.id}"
            value="${WorkbookStudio.escapeHtml(userVal)}"
            placeholder="..."
            autocomplete="off"
            spellcheck="false"
            aria-label="Lösung für ${WorkbookStudio.escapeHtml(leadText)}"
            oninput="window.WorkbookStudio.handleInput('${item.id}', this.value)"
            onkeydown="window.WorkbookStudio.handleKey(event, this)"
          >
          
          <span class="wb-sentence-tail">${WorkbookStudio.escapeHtml(tailText)}</span>
        </div>

        <div class="wb-item-feedback-wrap">
          ${feedbackHtml}
        </div>

        <div class="wb-item-actions">
          <button 
            class="wb-item-btn reveal-btn ${isRevealed ? 'active' : ''}" 
            onclick="window.WorkbookStudio.revealItemSolution('${item.id}')" 
            title="${isRevealed ? 'Lösung wieder ausblenden' : 'Lösung für diese Aufgabe aufdecken (Reveal Answer)'}"
          >
            👁️
          </button>
        </div>
      </div>
    `;
  };

  // --------------------------------------------------------------------------
  // Slide-out Drawers (Grammar Spickzettel, Solutions Book, Table of Contents)
  // --------------------------------------------------------------------------

  WorkbookStudio.renderDrawersHtml = function(meta, levelKey, page, worksheet) {
    const activeDrawer = WorkbookStudio.state.activeDrawer;
    if (!activeDrawer) return '';

    const tocItems = meta.toc || [];
    const solutionsDoc = meta.solutionsDoc || `${levelKey}/Loesungsschluessel.md`;

    return `
      <div class="wb-drawer-backdrop" onclick="window.WorkbookStudio.closeDrawer()"></div>
      <aside class="wb-drawer-panel" role="dialog" aria-modal="true">
        <div class="wb-drawer-header">
          <div class="wb-drawer-title-group">
            <h3>
              ${activeDrawer === 'rules' ? '💡 Grammatik-Tipps & Spickzettel' : ''}
              ${activeDrawer === 'solutions' ? `🔑 ${levelKey} Lösungsheft` : ''}
              ${activeDrawer === 'toc' ? `📋 Inhaltsverzeichnis (${levelKey})` : ''}
            </h3>
            <span class="wb-drawer-subtitle">Stufe ${levelKey} · Seite ${page}</span>
          </div>
          <button class="wb-drawer-close" onclick="window.WorkbookStudio.closeDrawer()" title="Schließen (Esc)">
            ✕
          </button>
        </div>

        <div class="wb-drawer-body">
          ${activeDrawer === 'rules' ? `
            <div class="wb-drawer-rules">
              <div class="wb-tip-box">
                <h4>📌 Grammatikfokus dieser Seite:</h4>
              <div class="wb-drawer-rules-content markdown-body" style="font-size: 0.95rem; line-height: 1.65; margin-top: 1rem;">
                ${worksheet.grammarSummary ? (typeof marked !== 'undefined' ? marked.parse(worksheet.grammarSummary) : worksheet.grammarSummary) : '<p style="color: var(--text-secondary);">Regeln für diese Lektion werden automatisch aus dem Skript geladen.</p>'}
              </div>
              <div style="margin-top: 1.5rem;">
                <button class="wb-btn-secondary" style="width: 100%; justify-content: center;" onclick="window.location.hash='#cheatsheet'">
                  ⚡ Zum Master-Spickzettel (Genus & Kasus)
                </button>
              </div>
            </div>
          ` : ''}

          ${activeDrawer === 'solutions' ? `
            <div class="wb-drawer-solutions">
              <div class="wb-tip-box">
                <h4>💡 Musterlösungen für Seite ${page}:</h4>
                <p>Vergleiche deine Eingaben mit den didaktischen Erklärungen.</p>
              </div>
              <ul class="wb-drawer-solutions-list">
                ${worksheet.exercises.map(ex => `
                  <li style="margin-bottom: 1.25rem;">
                    <strong style="color: var(--text-primary);">${WorkbookStudio.escapeHtml(ex.title)}</strong>
                    <div style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.4rem;">
                      ${ex.items.map(it => `
                        <div class="wb-drawer-sol-item">
                          <span><strong>${WorkbookStudio.escapeHtml(it.label || '')}</strong> ${WorkbookStudio.escapeHtml(it.prefix || it.lead || '')} <strong style="color: var(--color-primary);">${WorkbookStudio.escapeHtml(it.answer)}</strong> ${WorkbookStudio.escapeHtml(it.suffix || it.tail || '')}</span>
                          <span class="wb-drawer-sol-expl">📖 ${WorkbookStudio.escapeHtml(it.explanation || 'Grammatikregel')}</span>
                        </div>
                      `).join('')}
                    </div>
                  </li>
                `).join('')}
              </ul>
              <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                <button class="wb-btn-primary" style="width: 100%; justify-content: center;" onclick="window.location.hash='#doc:${solutionsDoc}'">
                  📖 Vollständiges Lösungsbuch (${levelKey}) öffnen
                </button>
              </div>
            </div>
          ` : ''}

          ${activeDrawer === 'toc' ? `
            <div class="wb-drawer-toc">
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${tocItems.map((t, idx) => {
                  const isActive = (t.page || 3) === page;
                  return `
                    <div 
                      class="wb-toc-item-link ${isActive ? 'is-active' : ''}" 
                      onclick="window.WorkbookStudio.changePage(${t.page || 3}); window.WorkbookStudio.closeDrawer();"
                    >
                      <span><strong>${idx + 1}.</strong> ${WorkbookStudio.escapeHtml(t.title)}</span>
                      <span class="wb-toc-page-pill">S. ${t.page} ↗</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </aside>
    `;
  };

  // --------------------------------------------------------------------------
  // Cover & Intro Card for Pages 1 & 2
  // --------------------------------------------------------------------------

  WorkbookStudio.renderIntroCardHtml = function(meta, levelKey, page) {
    const isCover = page === 1;
    const startPage = meta.exerciseStartPage || 3;
    const solutionsDoc = meta.solutionsDoc || `${levelKey}/Loesungsschluessel.md`;

    if (isCover) {
      return `
        <div class="wb-intro-card">
          <div class="wb-intro-icon">📘</div>
          <span class="wb-pill-badge">${levelKey} · Original-Titelblatt</span>
          <h2 class="wb-intro-title">${WorkbookStudio.escapeHtml(meta.title)}</h2>
          <p class="wb-intro-subtitle">
            Autor: <strong>${WorkbookStudio.escapeHtml(meta.author)}</strong> (${WorkbookStudio.escapeHtml(meta.edition)})
          </p>
          <p class="wb-intro-desc">
            Willkommen im interaktiven Arbeitsbuch für Stufe <strong>${levelKey}</strong>. 
            Die ersten beiden Seiten enthalten das Titelblatt und das Inhaltsverzeichnis des Original-Lehrbuchs.
            Sämtliche interaktiven Grammatikübungen beginnen ab <strong>Seite ${startPage} (Lektion 1)</strong>.
          </p>
          <div class="wb-intro-cta-row">
            <button class="wb-btn-primary" onclick="window.WorkbookStudio.changePage(${startPage})">
              🚀 Direkt zu Lektion 1 (Seite ${startPage}) springen
            </button>
            <button class="wb-btn-secondary" onclick="window.WorkbookStudio.changePage(2)">
              📋 Inhaltsverzeichnis (S. 2)
            </button>
            <button class="wb-btn-subtle" onclick="window.location.hash='#doc:${solutionsDoc}'">
              🔑 Lösungsheft
            </button>
          </div>
        </div>
      `;
    } else {
      // Page 2: Inhaltsverzeichnis
      const tocItems = meta.toc || [];
      return `
        <div class="wb-intro-card">
          <div class="wb-intro-icon">📋</div>
          <span class="wb-pill-badge">${levelKey} · Inhaltsverzeichnis</span>
          <h2 class="wb-intro-title">Lektionsübersicht & Kapitelverzeichnis</h2>
          <p class="wb-intro-desc">
            Wähle ein Kapitel aus, um direkt zum entsprechenden Arbeitsblatt mit Lückentexten zu springen:
          </p>
          <div class="wb-intro-toc-grid">
            ${tocItems.map((t, idx) => `
              <div class="wb-intro-toc-box" onclick="window.WorkbookStudio.changePage(${t.page || 3})">
                <span class="wb-intro-toc-name">${idx + 1}. ${WorkbookStudio.escapeHtml(t.title)}</span>
                <span class="wb-intro-toc-badge">S. ${t.page} ↗</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  };

  // --------------------------------------------------------------------------
  // Interactions & Actions
  // --------------------------------------------------------------------------

  WorkbookStudio.switchLevel = function(levelKey) {
    if (levelKey === 'A1_PRACTICAL') {
      window.location.hash = '#workbooks:A1_PRACTICAL';
      return;
    }
    const meta = WorkbookStudio.getMeta(levelKey);
    const startPage = meta.exerciseStartPage || 3;
    window.location.hash = `#workbooks:${levelKey}:${startPage}`;
  };

  WorkbookStudio.changePage = function(targetPage) {
    const meta = WorkbookStudio.getMeta(WorkbookStudio.state.level);
    const totalPages = meta.pages || 32;
    const cleanPage = Math.max(1, Math.min(totalPages, parseInt(targetPage, 10) || 3));
    window.location.hash = `#workbooks:${WorkbookStudio.state.level}:${cleanPage}`;
  };

  WorkbookStudio.handleInput = function(itemId, value) {
    WorkbookStudio.state.answers[itemId] = value;
    if (window.WorkbookEngine && window.WorkbookEngine.saveUserProgress) {
      window.WorkbookEngine.saveUserProgress(WorkbookStudio.state.level, WorkbookStudio.state.page, WorkbookStudio.state.answers);
    }
    const inputEl = document.getElementById(`gap-${itemId}`);
    if (inputEl) {
      inputEl.classList.remove('is-correct', 'is-incorrect', 'is-unanswered');
    }
  };

  WorkbookStudio.handleKey = function(e, inputEl) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const allGaps = Array.from(document.querySelectorAll('.wb-gap-inline'));
      const idx = allGaps.indexOf(inputEl);
      if (idx !== -1 && idx < allGaps.length - 1) {
        allGaps[idx + 1].focus();
      } else {
        WorkbookStudio.checkAnswers();
      }
    }
  };

  WorkbookStudio.checkAnswers = function() {
    const worksheet = WorkbookStudio.getWorksheetData(WorkbookStudio.state.level, WorkbookStudio.state.page);
    if (!window.WorkbookEngine || !window.WorkbookEngine.evaluateWorksheet) return;

    WorkbookStudio.state.checkResult = window.WorkbookEngine.evaluateWorksheet(worksheet.exercises, WorkbookStudio.state.answers);
    
    // Re-render worksheet to display feedback
    const container = document.getElementById('content-area');
    WorkbookStudio.render(container, WorkbookStudio.state.level, WorkbookStudio.state.page);

    // Smoothly scroll to top of worksheet
    const scrollArea = document.querySelector('.main-content-scroll') || window;
    if (scrollArea.scrollTo) {
      scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  WorkbookStudio.toggleSolutions = function() {
    WorkbookStudio.state.showSolutions = !WorkbookStudio.state.showSolutions;
    const container = document.getElementById('content-area');
    WorkbookStudio.render(container, WorkbookStudio.state.level, WorkbookStudio.state.page);
  };

  WorkbookStudio.revealItemHint = function() {
    // Hints removed per user design directive
  };

  WorkbookStudio.revealItemSolution = function(itemId) {
    if (!WorkbookStudio.state.revealedSolutions) {
      WorkbookStudio.state.revealedSolutions = new Set();
    }
    const isAlreadyRevealed = WorkbookStudio.state.revealedSolutions.has(itemId);
    if (isAlreadyRevealed) {
      WorkbookStudio.state.revealedSolutions.delete(itemId);
    } else {
      WorkbookStudio.state.revealedSolutions.add(itemId);
    }

    const row = document.getElementById(`row-${itemId}`);
    if (!row) return;

    const worksheet = WorkbookStudio.getWorksheetData(WorkbookStudio.state.level, WorkbookStudio.state.page);
    let targetItem = null;
    for (const ex of worksheet.exercises) {
      targetItem = (ex.items || []).find(it => it.id === itemId);
      if (targetItem) break;
    }

    if (targetItem) {
      const feedbackWrap = row.querySelector('.wb-item-feedback-wrap');
      const revealBtn = row.querySelector('.reveal-btn');
      const isNowRevealed = WorkbookStudio.state.revealedSolutions.has(itemId);
      if (revealBtn) {
        revealBtn.classList.toggle('active', isNowRevealed);
        revealBtn.title = isNowRevealed ? 'Lösung wieder ausblenden' : 'Lösung für diese Aufgabe aufdecken (Reveal Answer)';
      }
      if (feedbackWrap) {
        if (isNowRevealed) {
          feedbackWrap.innerHTML = `
            <span class="wb-feedback-tag correct solution-tag" title="${WorkbookStudio.escapeHtml(targetItem.explanation || 'Musterlösung')}">
              👁️ Lösung: <strong>${WorkbookStudio.escapeHtml(targetItem.answer)}</strong>
            </span>
          `;
        } else {
          feedbackWrap.innerHTML = '';
        }
      }
    }
  };

  WorkbookStudio.autoFillAnswers = function() {
    const worksheet = WorkbookStudio.getWorksheetData(WorkbookStudio.state.level, WorkbookStudio.state.page);
    worksheet.exercises.forEach(ex => {
      (ex.items || []).forEach(it => {
        if (it.answer && it.answer !== '—' && it.answer !== '?' && it.answer !== 'richtig') {
          WorkbookStudio.state.answers[it.id] = it.answer;
        } else if (it.prompt) {
          WorkbookStudio.state.answers[it.id] = it.prompt;
        }
      });
    });

    // NOTE: Auto-fill is strictly a temporary in-memory learning aid and is NOT saved to localStorage
    const container = document.getElementById('content-area');
    WorkbookStudio.render(container, WorkbookStudio.state.level, WorkbookStudio.state.page);
  };

  WorkbookStudio.resetAnswers = function() {
    WorkbookStudio.state.answers = {};
    WorkbookStudio.state.checkResult = null;
    WorkbookStudio.state.showSolutions = false;
    WorkbookStudio.state.revealedHints.clear();
    if (WorkbookStudio.state.revealedSolutions) {
      WorkbookStudio.state.revealedSolutions.clear();
    }

    if (window.WorkbookEngine && window.WorkbookEngine.clearUserProgress) {
      window.WorkbookEngine.clearUserProgress(WorkbookStudio.state.level, WorkbookStudio.state.page);
    }

    const container = document.getElementById('content-area');
    WorkbookStudio.render(container, WorkbookStudio.state.level, WorkbookStudio.state.page);
  };

  WorkbookStudio.toggleDrawer = function(drawerType) {
    if (WorkbookStudio.state.activeDrawer === drawerType) {
      WorkbookStudio.state.activeDrawer = null;
    } else {
      WorkbookStudio.state.activeDrawer = drawerType;
    }
    const container = document.getElementById('content-area');
    WorkbookStudio.render(container, WorkbookStudio.state.level, WorkbookStudio.state.page);
  };

  WorkbookStudio.closeDrawer = function() {
    WorkbookStudio.state.activeDrawer = null;
    const container = document.getElementById('content-area');
    WorkbookStudio.render(container, WorkbookStudio.state.level, WorkbookStudio.state.page);
  };

  WorkbookStudio.toggleSplitMode = function() {
    WorkbookStudio.state.viewMode = WorkbookStudio.state.viewMode === 'split' ? 'worksheet' : 'split';
    const container = document.getElementById('content-area');
    WorkbookStudio.render(container, WorkbookStudio.state.level, WorkbookStudio.state.page);
  };

  WorkbookStudio.toggleTeachings = function() {
    WorkbookStudio.state.teachingsCollapsed = !WorkbookStudio.state.teachingsCollapsed;
    const container = document.getElementById('content-area');
    WorkbookStudio.render(container, WorkbookStudio.state.level, WorkbookStudio.state.page);
  };

  WorkbookStudio.speakTeachings = function() {
    const content = document.querySelector('.wb-teachings-content');
    if (content) {
      const text = content.innerText.replace(/[•➔📌📖💡]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
      WorkbookStudio.speakSentence(text);
    }
  };

  WorkbookStudio.speakSentence = function(sentence) {
    if (window.DL && window.DL.speakGerman) {
      window.DL.speakGerman(sentence);
    } else if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(sentence);
      u.lang = 'de-DE';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  };

  WorkbookStudio.escapeHtml = function(text) {
    if (!text) return '';
    return text.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  
  // ==========================================================================
  // DaF Sentence Architecture Studio & Interactive Baukasten (A1_PRACTICAL)
  // ==========================================================================

    // --------------------------------------------------------------------------
  // Universal DaF Sentence Architecture Studio (A1 - C1 Praxis)
  // --------------------------------------------------------------------------

  WorkbookStudio.practicalState = {
    level: 'A1', // 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
    categoryFilter: 'all',
    // A1 fields
    a1_mode: 'standard', // 'standard' | 'inversion' | 'modal_bracket' | 'w_question' | 'yes_no_question'
    a1_subject: 'Ich',
    a1_verb: 'lerne',
    a1_timePlace: 'heute',
    a1_object: 'fleißig Deutsch',
    a1_modal: 'möchte',
    a1_infinitive: 'lernen',
    a1_questionWord: 'Wo',
    a1_questionTail: 'du in Deutschland?',
    // A2 fields
    a2_mode: 'weil_clause', // 'weil_clause' | 'wenn_temporal' | 'infinitiv_zu' | 'reflexiv'
    a2_mainClause: 'Ich lerne fleißig Deutsch',
    a2_subConnector: ', weil',
    a2_subSubject: 'ich',
    a2_subMid: 'in Deutschland arbeiten',
    a2_subVerb: 'möchte.',
    a2_wennSubject: 'ich',
    a2_wennMid: 'Zeit habe,',
    a2_mainVerb: 'gehe',
    a2_mainRest: 'ich im Park spazieren.',
    a2_infLead: 'Es ist wichtig',
    a2_infMid: 'jeden Tag neue Vokabeln',
    a2_infEnd: 'zu lernen.',
    a2_refSubject: 'Ich',
    a2_refVerb: 'freue',
    a2_refPronoun: 'mich',
    a2_refObj: 'sehr auf den nächsten Urlaub.',
    // B1 fields
    b1_mode: 'relativsatz', // 'relativsatz' | 'konjunktiv2' | 'passiv' | 'zweiteilig'
    b1_relLead: 'Das ist der neue Kollege',
    b1_relPron: ', der',
    b1_relMid: 'aus der Schweiz',
    b1_relVerb: 'stammt.',
    b1_kj2Cond: 'Wenn ich mehr Zeit hätte,',
    b1_kj2Verb: 'würde',
    b1_kj2Subj: 'ich',
    b1_kj2End: 'jeden Tag zwei Stunden Deutsch lernen.',
    b1_pasSubj: 'Der neue Vertrag',
    b1_pasAux: 'wird',
    b1_pasAgent: 'von der Rechtsabteilung',
    b1_pasPartizip: 'sorgfältig geprüft.',
    b1_zwPair: 'nicht nur ... sondern auch',
    b1_zwLead: 'Unsere Sprachakademie bietet',
    b1_zwPart1: 'nicht nur intensiven Unterricht,',
    b1_zwPart2: 'sondern auch persönliche Karriereberatung.',
    // B2 fields
    b2_mode: 'fvg', // 'fvg' | 'passiv_ersatz' | 'erweitertes_partizip' | 'praep_adverb'
    b2_fvgSubj: 'Die Geschäftsleitung',
    b2_fvgTime: 'nach langen Beratungen',
    b2_fvgNoun: 'eine zukunftsweisende Entscheidung',
    b2_fvgVerb: 'getroffen.',
    b2_peSubj: 'Dieses anspruchsvolle Problem',
    b2_peStruct: 'lässt sich',
    b2_peAdv: 'ohne nennenswerten Mehraufwand',
    b2_peEnd: 'reibungslos lösen.',
    b2_epArt: 'Die',
    b2_epPhrase: 'seit vielen Jahren international führenden',
    b2_epNoun: 'Unternehmen steigern ihre F&E-Investitionen.',
    b2_paQuestion: 'Worauf kommt es bei diesem Vorhaben vor allem an?',
    b2_paAnswer: 'Es kommt vor allem darauf an, effizient im Team zusammenzuarbeiten.',
    // C1 fields
    c1_mode: 'nominalstil', // 'nominalstil' | 'partizipial_verkuerzung' | 'modaler_infinitiv' | 'konjunktiv1'
    c1_nsPrep: 'Nach Abschluss der umfassenden Verhandlungen',
    c1_nsVerb: 'wurde',
    c1_nsSubj: 'ein wegweisendes Abkommen',
    c1_nsEnd: 'von allen Ministerien paraphiert.',
    c1_pvPart: 'Am Verhandlungsort eingetroffen,',
    c1_pvVerb: 'eröffnete',
    c1_pvSubj: 'die Bundeskanzlerin',
    c1_pvEnd: 'die internationale Konferenz mit einer Grundsatzrede.',
    c1_miSubj: 'Die diplomatischen Bemühungen',
    c1_miVerb: 'scheinen',
    c1_miMid: 'endlich die lang ersehnte friedliche Wende',
    c1_miEnd: 'herbeizuführen.',
    c1_k1Intro: 'Der Regierungssprecher erklärte,',
    c1_k1Subj: 'die gegenwärtige Wirtschaftslage',
    c1_k1Mid: 'keineswegs so pessimistisch zu bewerten',
    c1_k1Verb: 'sei.'
  };

  WorkbookStudio.switchPracticalLevel = function(lvl) {
    const valid = ['A1', 'A2', 'B1', 'B2', 'C1'];
    WorkbookStudio.practicalState.level = valid.includes(lvl) ? lvl : 'A1';
    WorkbookStudio.practicalState.categoryFilter = 'all';
    window.location.hash = `#workbooks:${WorkbookStudio.practicalState.level}_PRACTICAL`;
    const container = document.getElementById('app-root') || document.querySelector('.main-content') || document.body;
    WorkbookStudio.renderPracticalStudio(container, WorkbookStudio.practicalState.level);
  };

  WorkbookStudio.setSentenceMode = function(mode) {
    const lvl = WorkbookStudio.practicalState.level || 'A1';
    const key = `${lvl.toLowerCase()}_mode`;
    WorkbookStudio.practicalState[key] = mode;
    const container = document.getElementById('app-root') || document.querySelector('.main-content') || document.body;
    WorkbookStudio.renderPracticalStudio(container, lvl);
  };

  WorkbookStudio.updateSentenceField = function(field, value) {
    WorkbookStudio.practicalState[field] = value;
    const container = document.getElementById('app-root') || document.querySelector('.main-content') || document.body;
    WorkbookStudio.renderPracticalStudio(container, WorkbookStudio.practicalState.level || 'A1');
  };

  WorkbookStudio.filterPracticalCategory = function(cat) {
    WorkbookStudio.practicalState.categoryFilter = cat;
    const container = document.getElementById('app-root') || document.querySelector('.main-content') || document.body;
    WorkbookStudio.renderPracticalStudio(container, WorkbookStudio.practicalState.level || 'A1');
  };

  WorkbookStudio.getSavedPhrases = function() {
    try {
      const stored = localStorage.getItem('dl_custom_phrases');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  WorkbookStudio.saveCurrentSentence = function(sentence) {
    if (!sentence || !sentence.trim()) return;
    try {
      const phrases = WorkbookStudio.getSavedPhrases();
      if (!phrases.includes(sentence.trim())) {
        phrases.unshift(sentence.trim());
        localStorage.setItem('dl_custom_phrases', JSON.stringify(phrases));
      }
      const container = document.getElementById('app-root') || document.querySelector('.main-content') || document.body;
      WorkbookStudio.renderPracticalStudio(container, WorkbookStudio.practicalState.level || 'A1');
    } catch (e) {
      console.error('Failed to save sentence:', e);
    }
  };

  WorkbookStudio.deleteSavedSentence = function(index) {
    try {
      const phrases = WorkbookStudio.getSavedPhrases();
      phrases.splice(index, 1);
      localStorage.setItem('dl_custom_phrases', JSON.stringify(phrases));
      const container = document.getElementById('app-root') || document.querySelector('.main-content') || document.body;
      WorkbookStudio.renderPracticalStudio(container, WorkbookStudio.practicalState.level || 'A1');
    } catch (e) {
      console.error('Failed to delete sentence:', e);
    }
  };

  WorkbookStudio.clearSavedSentences = function() {
    if (confirm('Möchtest du wirklich alle gespeicherten Sätze löschen?')) {
      localStorage.removeItem('dl_custom_phrases');
      const container = document.getElementById('app-root') || document.querySelector('.main-content') || document.body;
      WorkbookStudio.renderPracticalStudio(container, WorkbookStudio.practicalState.level || 'A1');
    }
  };

  WorkbookStudio.speakPracticalSentence = function(text) {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`~[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS not supported or blocked:', e);
    }
  };

  // Curated phrase catalogs across all 5 CEFR levels
  WorkbookStudio.getPracticalPhrases = function(category, levelOpt) {
    const lvl = levelOpt || WorkbookStudio.practicalState.level || 'A1';
    
    if (lvl === 'A1') {
      let catalog = [];
      if (window.DOCS_CONTENT && window.DOCS_CONTENT['A1/Practisches_WerkBuch/EinfachDeutsch_examples.txt']) {
        const raw = window.DOCS_CONTENT['A1/Practisches_WerkBuch/EinfachDeutsch_examples.txt'];
        const lines = raw.split('\n');
        lines.forEach(line => {
          line = line.trim();
          if (!line || line.startsWith('#')) return;
          const parts = line.split('|').map(p => p.trim());
          if (parts.length >= 2) {
            catalog.push({
              de: parts[0],
              en: parts[1],
              category: parts[2] || 'Alltag',
              focus: parts[3] || 'Satzbau'
            });
          }
        });
      }
      if (catalog.length === 0) {
        catalog = [
          { de: 'Guten Tag! Ich heiße Thomas Müller und komme aus Deutschland.', en: 'Good day! My name is Thomas Müller and I come from Germany.', category: 'Kennenlernen', focus: 'Subjekt + Verb (Pos 2)' },
          { de: 'Wie heißen Sie und woher kommen Sie?', en: 'What is your name and where do you come from?', category: 'Kennenlernen', focus: 'W-Frage' },
          { de: 'Ich möchte gerne einen heißen Kaffee und ein Glas Wasser bestellen.', en: 'I would like to order a hot coffee and a glass of water.', category: 'Bestellen', focus: 'Satzklammer' },
          { de: 'Um 7:00 Uhr stehe ich auf und trinke einen starken Tee.', en: 'At 7:00 am I get up and drink a strong tea.', category: 'Tagesablauf', focus: 'Inversion + Trennbares Verb' },
          { de: 'Entschuldigung, wie komme ich zum Hauptbahnhof?', en: 'Excuse me, how do I get to the central station?', category: 'Orientierung', focus: 'W-Frage nach Weg' }
        ];
      }
      if (category && category !== 'all') {
        return catalog.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      return catalog;
    }

    const catalogs = {
      'A2': [
        { de: 'Ich lerne fleißig Deutsch, weil ich bald an einer deutschen Universität studieren möchte.', en: 'I am studying German diligently because I want to study at a German university soon.', category: 'Kausalsatz', focus: 'weil + Verb am Ende' },
        { de: 'Wenn ich am Wochenende frei habe, treffe ich mich mit meinen Freunden im Park.', en: 'When I have free time at the weekend, I meet my friends in the park.', category: 'Temporalsatz', focus: 'Wenn ... Hauptsatz-Inversion' },
        { de: 'Es ist sehr nützlich, jeden Morgen zwanzig neue Redewendungen zu wiederholen.', en: 'It is very useful to review twenty new idioms every morning.', category: 'Infinitivsatz', focus: 'zu + Infinitiv am Satzende' },
        { de: 'Ich freue mich schon riesig auf meinen nächsten Urlaub an der Ostsee.', en: 'I am already looking forward very much to my next holiday at the Baltic Sea.', category: 'Reflexiv', focus: 'sich freuen auf + Akk' },
        { de: 'Obwohl es heute stark geregnet hat, haben wir einen langen Spaziergang gemacht.', en: 'Although it rained heavily today, we went for a long walk.', category: 'Konzessivsatz', focus: 'obwohl + Verb am Ende' },
        { de: 'Er fragte mich gestern, ob ich ihm bei der Vorbereitung helfen könne.', en: 'He asked me yesterday whether I could help him with the preparation.', category: 'Indirekte Frage', focus: 'ob-Satz' }
      ],
      'B1': [
        { de: 'Das ist die Kollegin, die mir bei der Einarbeitung im Unternehmen sehr geholfen hat.', en: 'That is the colleague who helped me greatly during onboarding at the company.', category: 'Relativsatz', focus: 'Relativpronomen im Nominativ' },
        { de: 'Wenn ich damals mehr Mut gehabt hätte, hätte ich mich sofort für die Stelle beworben.', en: 'If I had had more courage back then, I would have applied for the position immediately.', category: 'Konjunktiv II', focus: 'Irreale Vergangenheit' },
        { de: 'Der vertrauliche Prüfbericht wird heute Nachmittag vom Vorstand eingehend beraten.', en: 'The confidential audit report will be thoroughly discussed by the board this afternoon.', category: 'Passiv', focus: 'Vorgangspassiv Präsens' },
        { de: 'Die neue Software ist sowohl überaus leistungsfähig als auch intuitiv zu bedienen.', en: 'The new software is both exceedingly powerful and intuitive to operate.', category: 'Doppelkonnektor', focus: 'sowohl ... als auch' },
        { de: 'Je intensiver man die Grammatik übt, desto leichter fällt einem das freie Sprechen.', en: 'The more intensely one practices grammar, the easier spontaneous speaking becomes.', category: 'Proportional', focus: 'je ... desto + Inversion' }
      ],
      'B2': [
        { de: 'Die Geschäftsführung hat nach intensiven Beratungen eine zukunftsweisende Entscheidung getroffen.', en: 'After intensive consultations, the management made a forward-looking decision.', category: 'Funktionsverb', focus: 'Entscheidung treffen' },
        { de: 'Dieses komplexe IT-Problem lässt sich mit den neuen Sicherheitsmodulen problemlos bewältigen.', en: 'This complex IT problem can be resolved without difficulty using the new security modules.', category: 'Passivalternative', focus: 'lässt sich + Infinitiv' },
        { de: 'Die seit mehreren Jahren stetig expandierenden Unternehmen schaffen zahlreiche neue Arbeitsplätze.', en: 'The enterprises, which have been expanding continuously for several years, are creating numerous new jobs.', category: 'Partizipialattribut', focus: 'Erweitertes Partizip I' },
        { de: 'Worauf kommt es bei dieser Ausschreibung primär an? - Es kommt auf höchste Präzision an.', en: 'What is primarily important in this tender? - Utmost precision is of the essence.', category: 'Pronominaladverb', focus: 'worauf / darauf ankommen' },
        { de: 'Es steht völlig außer Zweifel, dass Innovationen für den wirtschaftlichen Erfolg unerlässlich sind.', en: 'It is completely beyond doubt that innovations are indispensable for economic success.', category: 'Funktionsverb', focus: 'außer Zweifel stehen' }
      ],
      'C1': [
        { de: 'Nach Abschluss der multilateralen Verhandlungen wurde das historische Abkommen paraphiert.', en: 'Following the conclusion of multilateral negotiations, the historic agreement was initialed.', category: 'Nominalstil', focus: 'Substantivierte Temporalphrase' },
        { de: 'Am Verhandlungsort eingetroffen, eröffnete die Ministerin die internationale Konferenz.', en: 'Having arrived at the negotiation venue, the minister opened the international conference.', category: 'Partizipialsatz', focus: 'Satzverkürzendes Partizip II' },
        { de: 'Die vorliegenden empirischen Daten scheinen den bisherigen wissenschaftlichen Konsens zu bestätigen.', en: 'The available empirical data seem to corroborate the previous scientific consensus.', category: 'Modaler Infinitiv', focus: 'scheinen + zu + Infinitiv' },
        { de: 'Der Regierungssprecher betonte, die Regierung setze alle zur Verfügung stehenden Hebel in Bewegung.', en: 'The government spokesperson emphasized that the government was utilizing every available lever.', category: 'Indirekte Rede', focus: 'Konjunktiv I in Pressemitteilungen' },
        { de: 'Unter Berücksichtigung sämtlicher ökonomischer Faktoren erweist sich die Maßnahme als alternativlos.', en: 'Taking into account all economic factors, the measure proves to have no viable alternative.', category: 'Nominalstil', focus: 'Präpositionalgefüge C1' }
      ]
    };

    let list = catalogs[lvl] || catalogs['A2'];
    if (category && category !== 'all') {
      return list.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }
    return list;
  };

  WorkbookStudio.renderPracticalStudio = function(container, optLevel) {
    if (!container) return;
    if (optLevel) {
      WorkbookStudio.practicalState.level = optLevel;
    }
    container.innerHTML = WorkbookStudio.renderPracticalStudioHtml();
  };

  WorkbookStudio.renderPracticalStudioHtml = function() {
    const pState = WorkbookStudio.practicalState;
    const lvl = pState.level || 'A1';
    const savedPhrases = WorkbookStudio.getSavedPhrases();
    const phrases = WorkbookStudio.getPracticalPhrases(pState.categoryFilter, lvl);

    // Build assembled sentence, formula, syntax pills based on level & mode
    let assembledSentence = '';
    let formulaHtml = '';
    let syntaxPillsHtml = '';

    if (lvl === 'A1') {
      const mode = pState.a1_mode || 'standard';
      if (mode === 'standard') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Position 1: Subjekt</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Position 2: Finites Verb 🔴</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-mittelfeld">Mittelfeld: Zeit / Ort</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-obj">Objekt / Rest</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Goldene Grundregel (V2):</strong> Im deutschen Aussagesatz steht das konjugierte Verb <em>immer</em> an zweiter Stelle!</div>
        `;
        assembledSentence = `${pState.a1_subject} ${pState.a1_verb} ${pState.a1_timePlace} ${pState.a1_object}.`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">Pos 1: ${WorkbookStudio.escapeHtml(pState.a1_subject)}</span>
          <span class="wb-pill pill-verb">Pos 2: ${WorkbookStudio.escapeHtml(pState.a1_verb)}</span>
          <span class="wb-pill pill-mid">Mittelfeld: ${WorkbookStudio.escapeHtml(pState.a1_timePlace)}</span>
          <span class="wb-pill pill-obj">Objekt: ${WorkbookStudio.escapeHtml(pState.a1_object)}</span>
        `;
      } else if (mode === 'inversion') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-mittelfeld">Position 1: Zeit / Ort (Vorfeld)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Position 2: Finites Verb 🔴</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-pos1">Position 3: Subjekt (Invertiert)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-obj">Objekt / Rest</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Inversion:</strong> Steht Zeit oder Ort auf Position 1, rutscht das Subjekt hinter das Verb auf Position 3!</div>
        `;
        assembledSentence = `${pState.a1_timePlace} ${pState.a1_verb} ${pState.a1_subject.toLowerCase()} ${pState.a1_object}.`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-mid">Pos 1: ${WorkbookStudio.escapeHtml(pState.a1_timePlace)}</span>
          <span class="wb-pill pill-verb">Pos 2: ${WorkbookStudio.escapeHtml(pState.a1_verb)}</span>
          <span class="wb-pill pill-pos1">Pos 3: ${WorkbookStudio.escapeHtml(pState.a1_subject.toLowerCase())}</span>
          <span class="wb-pill pill-obj">Rest: ${WorkbookStudio.escapeHtml(pState.a1_object)}</span>
        `;
      } else if (mode === 'modal_bracket') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Position 1: Subjekt</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Position 2: Modalverb 🔴 [Klammer auf]</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-mittelfeld">Mittelfeld (Objekte / Angaben)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">Satzende: Infinitiv 🔒 [Klammer zu]</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Deutsche Satzklammer:</strong> Das konjugierte Modalverb steht auf Pos 2, der zweite Infinitiv wandert ganz ans Satzende!</div>
        `;
        assembledSentence = `${pState.a1_subject} ${pState.a1_modal} ${pState.a1_timePlace} ${pState.a1_infinitive}.`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">Subjekt: ${WorkbookStudio.escapeHtml(pState.a1_subject)}</span>
          <span class="wb-pill pill-verb">Modalverb: ${WorkbookStudio.escapeHtml(pState.a1_modal)}</span>
          <span class="wb-pill pill-mid">Mittelfeld: ${WorkbookStudio.escapeHtml(pState.a1_timePlace)}</span>
          <span class="wb-pill pill-bracket">Infinitiv: ${WorkbookStudio.escapeHtml(pState.a1_infinitive)}</span>
        `;
      } else if (mode === 'w_question') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Position 1: Fragewort (W-Wort)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Position 2: Finites Verb 🔴</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-pos1">Position 3: Subjekt / Angabe</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-obj">Fragezeichen (?)</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>W-Frage:</strong> Das Fragewort (Wer, Was, Wo...) besetzt Pos 1, das finite Verb bleibt auf Position 2.</div>
        `;
        assembledSentence = `${pState.a1_questionWord} ${pState.a1_verb} ${pState.a1_questionTail}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">W-Wort: ${WorkbookStudio.escapeHtml(pState.a1_questionWord)}</span>
          <span class="wb-pill pill-verb">Verb (Pos 2): ${WorkbookStudio.escapeHtml(pState.a1_verb)}</span>
          <span class="wb-pill pill-mid">Rest: ${WorkbookStudio.escapeHtml(pState.a1_questionTail)}</span>
        `;
      } else { // yes_no_question
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-verb">Position 1: Finites Verb 🔴 [Spitzenstellung]</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-pos1">Position 2: Subjekt</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-mittelfeld">Mittelfeld & Ergänzung (?)</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Ja/Nein-Frage:</strong> Bei geschlossenen Entscheidungsfragen springt das konjugierte Verb an Position 1!</div>
        `;
        assembledSentence = `${pState.a1_verb.charAt(0).toUpperCase() + pState.a1_verb.slice(1)} ${pState.a1_subject.toLowerCase()} ${pState.a1_object}?`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-verb">Pos 1 (Verb): ${WorkbookStudio.escapeHtml(pState.a1_verb)}</span>
          <span class="wb-pill pill-pos1">Pos 2 (Subjekt): ${WorkbookStudio.escapeHtml(pState.a1_subject.toLowerCase())}</span>
          <span class="wb-pill pill-mid">Ergänzung: ${WorkbookStudio.escapeHtml(pState.a1_object)}?</span>
        `;
      }
    } else if (lvl === 'A2') {
      const mode = pState.a2_mode || 'weil_clause';
      if (mode === 'weil_clause') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Hauptsatz (V2)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">Komma + Subjunktion (, weil)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-pos1">Nebensatz-Subjekt</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-mittelfeld">Mittelfeld</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Verb am Satzende 🔴</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Kausalsatz:</strong> Die Konjunktion <em>weil</em> leitet einen Nebensatz ein &rarr; das konjugierte Verb wandert zwingend ans Satzende!</div>
        `;
        assembledSentence = `${pState.a2_mainClause}${pState.a2_subConnector} ${pState.a2_subSubject} ${pState.a2_subMid} ${pState.a2_subVerb}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">Hauptsatz: ${WorkbookStudio.escapeHtml(pState.a2_mainClause)}</span>
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.a2_subConnector)}</span>
          <span class="wb-pill pill-mid">Mittelfeld: ${WorkbookStudio.escapeHtml(pState.a2_subMid)}</span>
          <span class="wb-pill pill-verb">Verb-Ende: ${WorkbookStudio.escapeHtml(pState.a2_subVerb)}</span>
        `;
      } else if (mode === 'wenn_temporal') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-bracket">Wenn + Nebensatz (Verb am Ende)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">, Hauptsatz-Verb (Pos 1 nach Komma!) 🔴</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-pos1">Subjekt</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-obj">Rest</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Nebensatz im Vorfeld:</strong> Steht der Wenn-Satz zuerst, besetzt er Pos 1. Der Hauptsatz beginnt direkt mit dem Verb!</div>
        `;
        assembledSentence = `Wenn ${pState.a2_wennSubject} ${pState.a2_wennMid} ${pState.a2_mainVerb} ${pState.a2_mainRest}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-bracket">Wenn-Satz: Wenn ${WorkbookStudio.escapeHtml(pState.a2_wennSubject)} ${WorkbookStudio.escapeHtml(pState.a2_wennMid)}</span>
          <span class="wb-pill pill-verb">Hauptsatz-Verb: ${WorkbookStudio.escapeHtml(pState.a2_mainVerb)}</span>
          <span class="wb-pill pill-mid">Rest: ${WorkbookStudio.escapeHtml(pState.a2_mainRest)}</span>
        `;
      } else if (mode === 'infinitiv_zu') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Einleitungssatz</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-mittelfeld">, Mittelfeld / Angaben</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">Infinitiv mit „zu“ (Satzende) 🔒</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Infinitivgruppe:</strong> Bei unpersönlichen Ausdrücken (Es ist wichtig...) oder Nomen (Lust haben...) steht <em>zu + Infinitiv</em> am Satzende.</div>
        `;
        assembledSentence = `${pState.a2_infLead}, ${pState.a2_infMid} ${pState.a2_infEnd}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">${WorkbookStudio.escapeHtml(pState.a2_infLead)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.a2_infMid)}</span>
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.a2_infEnd)}</span>
        `;
      } else { // reflexiv
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Subjekt (Pos 1)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Verb (Pos 2) 🔴</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">Reflexivpronomen (mich/dich/sich)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-obj">Präpositional-Ergänzung</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Reflexive Verben:</strong> Das Reflexivpronomen schmiegt sich direkt hinter das finite Verb (oder hinter das Subjekt bei Inversion).</div>
        `;
        assembledSentence = `${pState.a2_refSubject} ${pState.a2_refVerb} ${pState.a2_refPronoun} ${pState.a2_refObj}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">Subjekt: ${WorkbookStudio.escapeHtml(pState.a2_refSubject)}</span>
          <span class="wb-pill pill-verb">Verb: ${WorkbookStudio.escapeHtml(pState.a2_refVerb)}</span>
          <span class="wb-pill pill-bracket">Reflexiv: ${WorkbookStudio.escapeHtml(pState.a2_refPronoun)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.a2_refObj)}</span>
        `;
      }
    } else if (lvl === 'B1') {
      const mode = pState.b1_mode || 'relativsatz';
      if (mode === 'relativsatz') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Hauptsatz mit Bezugsnomen</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">, Relativpronomen (der/die/das/den/dem)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-mittelfeld">Mittelfeld</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Finites Verb am Satzende 🔴</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Relativsatz:</strong> Genus & Numerus richten sich nach dem Bezugswort; der Kasus richtet sich nach der Rolle im Nebensatz!</div>
        `;
        assembledSentence = `${pState.b1_relLead}${pState.b1_relPron} ${pState.b1_relMid} ${pState.b1_relVerb}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">${WorkbookStudio.escapeHtml(pState.b1_relLead)}</span>
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.b1_relPron)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.b1_relMid)}</span>
          <span class="wb-pill pill-verb">Verb-Ende: ${WorkbookStudio.escapeHtml(pState.b1_relVerb)}</span>
        `;
      } else if (mode === 'konjunktiv2') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-bracket">Irreale Bedingung (Wenn... hätte/wäre)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">, Konjunktiv-Verb (würde / könnte) 🔴</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-pos1">Subjekt</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">Infinitiv am Satzende 🔒</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Konjunktiv II:</strong> Dient zum Ausdruck von Träumen, hypothetischen Annahmen oder besonders höflichen Bitten.</div>
        `;
        assembledSentence = `${pState.b1_kj2Cond} ${pState.b1_kj2Verb} ${pState.b1_kj2Subj} ${pState.b1_kj2End}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.b1_kj2Cond)}</span>
          <span class="wb-pill pill-verb">${WorkbookStudio.escapeHtml(pState.b1_kj2Verb)}</span>
          <span class="wb-pill pill-pos1">${WorkbookStudio.escapeHtml(pState.b1_kj2Subj)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.b1_kj2End)}</span>
        `;
      } else if (mode === 'passiv') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Subjekt (Objekt der Handlung)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">wird / wurde (Pos 2) 🔴</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-mittelfeld">von / durch + Agens</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">Partizip II am Satzende 🔒</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Vorgangspassiv:</strong> Der Fokus liegt auf der Handlung, nicht auf dem Handelnden. Subjekt + <em>werden</em> + Partizip II.</div>
        `;
        assembledSentence = `${pState.b1_pasSubj} ${pState.b1_pasAux} ${pState.b1_pasAgent} ${pState.b1_pasPartizip}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">${WorkbookStudio.escapeHtml(pState.b1_pasSubj)}</span>
          <span class="wb-pill pill-verb">${WorkbookStudio.escapeHtml(pState.b1_pasAux)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.b1_pasAgent)}</span>
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.b1_pasPartizip)}</span>
        `;
      } else { // zweiteilig
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Subjekt & Verb</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">Erster Konnektor-Teil</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">Zweiter Konnektor-Teil</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Doppelkonnektoren:</strong> Verbinden zwei gleichwertige Elemente mit rhetorischer Verstärkung (<em>nicht nur ... sondern auch</em>).</div>
        `;
        assembledSentence = `${pState.b1_zwLead} ${pState.b1_zwPart1} ${pState.b1_zwPart2}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">${WorkbookStudio.escapeHtml(pState.b1_zwLead)}</span>
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.b1_zwPart1)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.b1_zwPart2)}</span>
        `;
      }
    } else if (lvl === 'B2') {
      const mode = pState.b2_mode || 'fvg';
      if (mode === 'fvg') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Subjekt (Pos 1)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-mittelfeld">Angabe / Zeit</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">Funktionsnomen (fest)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Funktionsverb 🔴</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Funktionsverbgefüge:</strong> Ein Nomen trägt die Hauptbedeutung, das Verb verblasst semantisch (<em>eine Entscheidung treffen = entscheiden</em>).</div>
        `;
        assembledSentence = `${pState.b2_fvgSubj} hat ${pState.b2_fvgTime} ${pState.b2_fvgNoun} ${pState.b2_fvgVerb}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">${WorkbookStudio.escapeHtml(pState.b2_fvgSubj)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.b2_fvgTime)}</span>
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.b2_fvgNoun)}</span>
          <span class="wb-pill pill-verb">${WorkbookStudio.escapeHtml(pState.b2_fvgVerb)}</span>
        `;
      } else if (mode === 'passiv_ersatz') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Subjekt</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Passiv-Ersatzform (lässt sich / ist zu) 🔴</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-mittelfeld">Adverbiale Bestimmung</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">Infinitiv 🔒</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Passivalternativen:</strong> Drücken Möglichkeit oder Notwendigkeit ohne Vollpassiv aus (<em>lässt sich lösen = kann gelöst werden</em>).</div>
        `;
        assembledSentence = `${pState.b2_peSubj} ${pState.b2_peStruct} ${pState.b2_peAdv} ${pState.b2_peEnd}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">${WorkbookStudio.escapeHtml(pState.b2_peSubj)}</span>
          <span class="wb-pill pill-verb">${WorkbookStudio.escapeHtml(pState.b2_peStruct)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.b2_peAdv)}</span>
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.b2_peEnd)}</span>
        `;
      } else if (mode === 'erweitertes_partizip') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Artikel</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">[Erweiterte Partizipialphrase]</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-pos1">Bezugsnomen</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Hauptsatzprädikat 🔴</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Erweitertes Partizip:</strong> Ein ganzer Relativsatz wird als Adjektivattribut vor das Nomen gepackt. Sehr typisch für gehobene Zeitungstexte!</div>
        `;
        assembledSentence = `${pState.b2_epArt} ${pState.b2_epPhrase} ${pState.b2_epNoun}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">${WorkbookStudio.escapeHtml(pState.b2_epArt)}</span>
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.b2_epPhrase)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.b2_epNoun)}</span>
        `;
      } else { // praep_adverb
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-bracket">Frage mit W-Adverb (Worauf/Woran)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Antwort mit Da-Adverb (darauf/daran)</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Pronominaladverbien:</strong> Bei Sachen und Verben verbindet man <em>wo(r)-</em> und <em>da(r)-</em> mit der festen Präposition (<em>warten auf &rarr; worauf / darauf</em>).</div>
        `;
        assembledSentence = `${pState.b2_paQuestion} - ${pState.b2_paAnswer}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.b2_paQuestion)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.b2_paAnswer)}</span>
        `;
      }
    } else { // C1
      const mode = pState.c1_mode || 'nominalstil';
      if (mode === 'nominalstil') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-bracket">Präpositionales Nominalgefüge (Substantiviert)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Finites Verb (Pos 2) 🔴</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-pos1">Subjekt</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-obj">Prädikatsergänzung</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Nominalstil:</strong> Verdichtet Nebensätze zu präpositionalen Nominalgruppen (<em>Nach Abschluss der Verhandlungen = Nachdem verhandelt worden war</em>).</div>
        `;
        assembledSentence = `${pState.c1_nsPrep} ${pState.c1_nsVerb} ${pState.c1_nsSubj} ${pState.c1_nsEnd}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.c1_nsPrep)}</span>
          <span class="wb-pill pill-verb">${WorkbookStudio.escapeHtml(pState.c1_nsVerb)}</span>
          <span class="wb-pill pill-pos1">${WorkbookStudio.escapeHtml(pState.c1_nsSubj)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.c1_nsEnd)}</span>
        `;
      } else if (mode === 'partizipial_verkuerzung') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-bracket">Partizipialkonstruktion (Satzverkürzung)</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">, Finites Verb (Pos 1 nach Komma) 🔴</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-pos1">Subjekt</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-obj">Prädikatsabschluss</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Partizipialsatz:</strong> Satzverkürzende Konstruktion ohne Konjunktion; Subjekt der Partizipialgruppe muss mit dem Hauptsatzsubjekt identisch sein!</div>
        `;
        assembledSentence = `${pState.c1_pvPart} ${pState.c1_pvVerb} ${pState.c1_pvSubj} ${pState.c1_pvEnd}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.c1_pvPart)}</span>
          <span class="wb-pill pill-verb">${WorkbookStudio.escapeHtml(pState.c1_pvVerb)}</span>
          <span class="wb-pill pill-pos1">${WorkbookStudio.escapeHtml(pState.c1_pvSubj)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.c1_pvEnd)}</span>
        `;
      } else if (mode === 'modaler_infinitiv') {
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Subjekt</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Modales Verb (scheinen / vermögen) 🔴</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-mittelfeld">Mittelfeld</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">zu + Infinitiv (Satzende) 🔒</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Modale Infinitivkonstruktionen:</strong> Gehobene Alternativen zu Modalverben (<em>scheinen zu = offensichtlich sein; vermögen zu = fähig sein</em>).</div>
        `;
        assembledSentence = `${pState.c1_miSubj} ${pState.c1_miVerb} ${pState.c1_miMid} ${pState.c1_miEnd}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">${WorkbookStudio.escapeHtml(pState.c1_miSubj)}</span>
          <span class="wb-pill pill-verb">${WorkbookStudio.escapeHtml(pState.c1_miVerb)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.c1_miMid)}</span>
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.c1_miEnd)}</span>
        `;
      } else { // konjunktiv1
        formulaHtml = `
          <div class="wb-formula-strip">
            <span class="wb-syntax-tag tag-pos1">Redeeinleitung</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-bracket">Subjekt der indirekten Rede</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-mittelfeld">Mittelfeld</span>
            <span class="wb-syntax-arrow">&rarr;</span>
            <span class="wb-syntax-tag tag-verb">Konjunktiv I (sei / habe / werde) 🔴</span>
          </div>
          <div class="wb-formula-hint">💡 <strong>Indirekte Rede:</strong> Neutrale Distanzierung des Autors von fremden Aussagen in Berichterstattung und Wissenschaft.</div>
        `;
        assembledSentence = `${pState.c1_k1Intro} ${pState.c1_k1Subj} ${pState.c1_k1Mid} ${pState.c1_k1Verb}`;
        syntaxPillsHtml = `
          <span class="wb-pill pill-pos1">${WorkbookStudio.escapeHtml(pState.c1_k1Intro)}</span>
          <span class="wb-pill pill-bracket">${WorkbookStudio.escapeHtml(pState.c1_k1Subj)}</span>
          <span class="wb-pill pill-mid">${WorkbookStudio.escapeHtml(pState.c1_k1Mid)}</span>
          <span class="wb-pill pill-verb">${WorkbookStudio.escapeHtml(pState.c1_k1Verb)}</span>
        `;
      }
    }

    assembledSentence = assembledSentence.replace(/\s+/g, ' ').trim();
    if (assembledSentence.length > 0) {
      assembledSentence = assembledSentence.charAt(0).toUpperCase() + assembledSentence.slice(1);
    }

    const levelBadges = {
      'A1': 'A1 PRAXIS · SATZBAU-LABOR (V2 & SATZKLAMMER)',
      'A2': 'A2 PRAXIS · SATZGEFÜGE & NEBENSÄTZE (WEIL, WENN, INFINITIV)',
      'B1': 'B1 PRAXIS · KOMPLEXE SYNTAX (RELATIVSÄTZE, PASSIV, KONJUNKTIV II)',
      'B2': 'B2 PRAXIS · STIL & PRÄZISION (FUNKTIONSVERBEN, PASSIV-ERSATZ, PARTIZIPIEN)',
      'C1': 'C1 PRAXIS · AKADEMISCHER SATZBAU (NOMINALSTIL, INDIREKTE REDE, HYPOTAXE)'
    };

    return `
      <div class="workbook-studio-wrap">
        <!-- Top Sticky Control Bar with Level Tabs -->
        <header class="wb-topbar" style="background: var(--bg-surface); border-bottom: 1px solid var(--border-color); padding: 0.75rem 1.5rem; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100;">
          <div class="wb-topbar-left" style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem; margin-right: 0.5rem;">Stufe:</span>
            ${['A1', 'A2', 'B1', 'B2', 'C1'].map(l => `
              <button 
                class="wb-level-pill ${lvl === l ? 'active' : ''}" 
                onclick="window.WorkbookStudio.switchPracticalLevel('${l}')" 
                title="${l} Satzbau-Praxis"
              >
                ${l} Praxis
              </button>
            `).join('')}
          </div>

          <div class="wb-topbar-tools">
            <a href="#doc:${lvl}%2FGrammatik.md" class="wb-tool-btn" title="${lvl} Grammatik aufschlagen">
              <span>📖</span>
              <span>${lvl} Grammatik-Guide</span>
            </a>
            <button class="wb-tool-btn primary" onclick="window.WorkbookStudio.switchLevel('${lvl}')">
              <span>📘</span>
              <span>Zu ${lvl} Übungen</span>
            </button>
          </div>
        </header>

        <div class="wb-content-canvas" style="padding: 1.5rem; max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.75rem;">
          
          <!-- Banner: Introduction to Sentence Structure Lab -->
          <div class="wb-lesson-header">
            <div class="wb-lesson-header-left">
              <span class="wb-pill-badge" style="background: var(--color-business);">${levelBadges[lvl] || levelBadges['A1']}</span>
              <h2 class="wb-lesson-title">🧩 Interaktiver DaF Satzbau-Baukasten (${lvl})</h2>
              <p style="color: var(--text-secondary); margin: 0.35rem 0 0 0; font-size: 0.95rem;">
                Konstruiere deutsche Sätze interaktiv nach den exakten Syntaxregeln der Stufe ${lvl}. Trainiere Wortstellung, Inversion, Satzklammern und Sprachmelodie mit Sofort-Audio.
              </p>
            </div>
            <div class="wb-lesson-header-right">
              <button class="wb-btn-subtle" onclick="window.WorkbookStudio.speakPracticalSentence('${WorkbookStudio.escapeHtml(assembledSentence).replace(/'/g, "\\'")}')" title="Aussprache anhören">
                🔊 Audio anhören
              </button>
            </div>
          </div>

          <!-- Sentence Architecture Interactive Lab -->
          <section class="wb-builder-section">
            
            <!-- Mode Switcher Tabs -->
            <div class="wb-builder-modes">
              ${WorkbookStudio.renderLevelModeTabsHtml(lvl, pState)}
            </div>

            <!-- Dynamic Syntax Formula & Pedagogical Rule Strip -->
            <div class="wb-formula-card">
              ${formulaHtml}
            </div>

            <!-- Interactive Token Chip Selectors -->
            <div class="wb-selectors-container">
              ${WorkbookStudio.renderModeSelectorsHtml(lvl, pState)}
            </div>

            <!-- Generated Sentence Live Showcase Banner -->
            <div class="wb-showcase-card">
              <div class="wb-showcase-header">
                <span class="wb-showcase-badge">🇩🇪 Grammatikalisch geprüfter Satz (${lvl})</span>
                <div class="wb-breakdown-row">
                  ${syntaxPillsHtml}
                </div>
              </div>

              <div class="wb-showcase-sentence">
                „${WorkbookStudio.escapeHtml(assembledSentence)}“
              </div>

              <div class="wb-showcase-actions">
                <button 
                  class="wb-btn-primary" 
                  onclick="window.WorkbookStudio.speakPracticalSentence('${WorkbookStudio.escapeHtml(assembledSentence).replace(/'/g, "\\'")}')"
                  title="Satz auf Deutsch anhören"
                >
                  <span>🔊</span>
                  <span>Vorlesen (Audio)</span>
                </button>
                <button 
                  class="wb-btn-secondary" 
                  onclick="window.WorkbookStudio.saveCurrentSentence('${WorkbookStudio.escapeHtml(assembledSentence).replace(/'/g, "\\'")}')"
                  title="Diesen Satz zu meinem persönlichen Phrasenbuch hinzufügen"
                >
                  <span>➕</span>
                  <span>Satz speichern</span>
                </button>
              </div>
            </div>

          </section>

          <!-- Saved Sentences / Phrasebook Drawer or List -->
          ${savedPhrases.length > 0 ? `
            <section class="wb-saved-section">
              <div class="wb-saved-header">
                <h3 style="margin: 0; font-size: 1.15rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                  <span>⭐</span>
                  <span>Meine gespeicherten Sätze (${savedPhrases.length})</span>
                </h3>
                <button class="wb-btn-subtle" onclick="window.WorkbookStudio.clearSavedSentences()">
                  🗑️ Alle leeren
                </button>
              </div>
              <div class="wb-saved-grid">
                ${savedPhrases.map((phrase, idx) => `
                  <div class="wb-saved-chip">
                    <span class="wb-saved-text">${WorkbookStudio.escapeHtml(phrase)}</span>
                    <div class="wb-saved-actions">
                      <button class="wb-icon-btn" onclick="window.WorkbookStudio.speakPracticalSentence('${WorkbookStudio.escapeHtml(phrase).replace(/'/g, "\\'")}')" title="Anhören">🔊</button>
                      <button class="wb-icon-btn delete" onclick="window.WorkbookStudio.deleteSavedSentence(${idx})" title="Löschen">✕</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Curated Practical Phrases Catalog -->
          <section class="wb-curated-section">
            <div class="wb-curated-header">
              <div>
                <h3 style="margin: 0; font-size: 1.3rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                  <span>📚</span>
                  <span>Authentische Alltagssätze & Dialoge (${lvl} Niveau)</span>
                </h3>
                <p style="color: var(--text-secondary); margin: 0.25rem 0 0 0; font-size: 0.9rem;">
                  Praxis-Sätze für Stufe ${lvl}. Höre dir die Aussprache an und präge dir die Satzstruktur ein:
                </p>
              </div>
            </div>

            <!-- Phrases Grid -->
            <div class="wb-phrases-catalog-grid">
              ${phrases.map(item => `
                <div class="wb-phrase-item-card">
                  <div class="wb-phrase-top">
                    <span class="wb-phrase-category-badge">${WorkbookStudio.escapeHtml(item.category)}</span>
                    <span class="wb-phrase-focus-tag">${WorkbookStudio.escapeHtml(item.focus)}</span>
                  </div>
                  <div class="wb-phrase-german">
                    ${WorkbookStudio.escapeHtml(item.de)}
                  </div>
                  <div class="wb-phrase-english">
                    ${WorkbookStudio.escapeHtml(item.en)}
                  </div>
                  <div class="wb-phrase-bottom">
                    <button 
                      class="wb-phrase-audio-btn" 
                      onclick="window.WorkbookStudio.speakPracticalSentence('${WorkbookStudio.escapeHtml(item.de).replace(/'/g, "\\'")}')"
                      title="Auf Deutsch anhören"
                    >
                      <span>🔊</span>
                      <span>Aussprache</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

        </div>
      </div>
    `;
  };

  WorkbookStudio.renderLevelModeTabsHtml = function(lvl, pState) {
    if (lvl === 'A1') {
      const m = pState.a1_mode || 'standard';
      return `
        <button class="wb-mode-pill ${m === 'standard' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('standard')">💬 1. Aussagesatz (V2)</button>
        <button class="wb-mode-pill ${m === 'inversion' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('inversion')">🔄 2. Inversion (Zeit/Ort zuerst)</button>
        <button class="wb-mode-pill ${m === 'modal_bracket' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('modal_bracket')">🗂️ 3. Satzklammer (Modalverb)</button>
        <button class="wb-mode-pill ${m === 'w_question' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('w_question')">❓ 4. W-Frage</button>
        <button class="wb-mode-pill ${m === 'yes_no_question' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('yes_no_question')">⚡ 5. Ja/Nein-Frage</button>
      `;
    } else if (lvl === 'A2') {
      const m = pState.a2_mode || 'weil_clause';
      return `
        <button class="wb-mode-pill ${m === 'weil_clause' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('weil_clause')">💡 1. Kausalsatz (, weil... Verb Ende)</button>
        <button class="wb-mode-pill ${m === 'wenn_temporal' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('wenn_temporal')">⏳ 2. Temporalsatz (Wenn... Verb, Verb...)</button>
        <button class="wb-mode-pill ${m === 'infinitiv_zu' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('infinitiv_zu')">🎯 3. Infinitivgruppe (... zu lernen)</button>
        <button class="wb-mode-pill ${m === 'reflexiv' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('reflexiv')">🪞 4. Reflexivverb (sich freuen auf)</button>
      `;
    } else if (lvl === 'B1') {
      const m = pState.b1_mode || 'relativsatz';
      return `
        <button class="wb-mode-pill ${m === 'relativsatz' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('relativsatz')">🔗 1. Relativsatz (der, die, das)</button>
        <button class="wb-mode-pill ${m === 'konjunktiv2' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('konjunktiv2')">✨ 2. Konjunktiv II (Wenn ich Zeit hätte...)</button>
        <button class="wb-mode-pill ${m === 'passiv' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('passiv')">⚙️ 3. Vorgangspassiv (wird geprüft)</button>
        <button class="wb-mode-pill ${m === 'zweiteilig' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('zweiteilig')">⚖️ 4. Doppelkonnektoren (nicht nur... sondern auch)</button>
      `;
    } else if (lvl === 'B2') {
      const m = pState.b2_mode || 'fvg';
      return `
        <button class="wb-mode-pill ${m === 'fvg' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('fvg')">💼 1. Funktionsverben (Entscheidung treffen)</button>
        <button class="wb-mode-pill ${m === 'passiv_ersatz' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('passiv_ersatz')">🔄 2. Passiv-Ersatz (lässt sich lösen)</button>
        <button class="wb-mode-pill ${m === 'erweitertes_partizip' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('erweitertes_partizip')">📜 3. Erweitertes Partizip (die hart arbeitenden...)</button>
        <button class="wb-mode-pill ${m === 'praep_adverb' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('praep_adverb')">🧭 4. Pronominaladverbien (worauf / darauf)</button>
      `;
    } else { // C1
      const m = pState.c1_mode || 'nominalstil';
      return `
        <button class="wb-mode-pill ${m === 'nominalstil' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('nominalstil')">🏛️ 1. Nominalstil (Nach Abschluss...)</button>
        <button class="wb-mode-pill ${m === 'partizipial_verkuerzung' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('partizipial_verkuerzung')">⚡ 2. Partizipialsatz (Eingetroffen, begann...)</button>
        <button class="wb-mode-pill ${m === 'modaler_infinitiv' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('modaler_infinitiv')">🔬 3. Modaler Infinitiv (scheinen zu)</button>
        <button class="wb-mode-pill ${m === 'konjunktiv1' ? 'active' : ''}" onclick="window.WorkbookStudio.setSentenceMode('konjunktiv1')">📰 4. Indirekte Rede (Konjunktiv I)</button>
      `;
    }
  };

  WorkbookStudio.renderModeSelectorsHtml = function(lvl, pState) {
    if (lvl === 'A1') {
      const mode = pState.a1_mode || 'standard';
      if (mode === 'standard') {
        const subjects = ['Ich', 'Du', 'Er', 'Sie', 'Wir', 'Ihr', 'Sie (Höflich)'];
        const verbConjugations = {
          'Ich': ['lerne', 'trinke', 'kaufe', 'wohne', 'arbeite', 'esse'],
          'Du': ['lernst', 'trinkst', 'kaufst', 'wohnst', 'arbeitest', 'isst'],
          'Er': ['lernt', 'trinkt', 'kauft', 'wohnt', 'arbeitet', 'isst'],
          'Sie': ['lernt', 'trinkt', 'kauft', 'wohnt', 'arbeitet', 'isst'],
          'Wir': ['lernen', 'trinken', 'kaufen', 'wohnen', 'arbeiten', 'essen'],
          'Ihr': ['lernt', 'trinkt', 'kauft', 'wohnt', 'arbeitet', 'esst'],
          'Sie (Höflich)': ['lernen', 'trinken', 'kaufen', 'wohnen', 'arbeiten', 'essen']
        };
        const verbs = verbConjugations[pState.a1_subject] || verbConjugations['Ich'];
        const times = ['heute', 'jeden Tag', 'am Morgen', 'gerne', 'in Berlin', 'im Büro'];
        const objs = ['fleißig Deutsch', 'einen heißen Kaffee', 'einen frischen Apfel', 'ein gutes Buch', 'eine leckere Pizza'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Subjekt (Position 1):</label>
            <div class="wb-chip-container">
              ${subjects.map(s => `<button class="wb-selector-chip ${pState.a1_subject === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_subject', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">2. Finites Verb (Position 2 - Angepasst an Subjekt!):</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.a1_verb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_verb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">3. Zeit / Ort (Mittelfeld):</label>
            <div class="wb-chip-container">
              ${times.map(t => `<button class="wb-selector-chip ${pState.a1_timePlace === t ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_timePlace', '${t}')">${t}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-obj">4. Akkusativ-Objekt / Ergänzung:</label>
            <div class="wb-chip-container">
              ${objs.map(o => `<button class="wb-selector-chip ${pState.a1_object === o ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_object', '${o}')">${o}</button>`).join('')}
            </div>
          </div>
        `;
      } else if (mode === 'inversion') {
        const times = ['Heute', 'Morgen', 'Jeden Tag', 'Am Wochenende', 'In Berlin', 'Im Büro'];
        const verbs = ['lerne', 'trinke', 'frühstücke', 'arbeite', 'wohne', 'kaufe'];
        const subjects = ['ich', 'du', 'er', 'wir', 'ihr', 'Sie'];
        const objs = ['fleißig Deutsch', 'einen heißen Kaffee', 'gemütlich auf dem Balkon', 'mit Kollegen', 'sehr gerne'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">1. Zeit- / Ortsangabe (Position 1):</label>
            <div class="wb-chip-container">
              ${times.map(t => `<button class="wb-selector-chip ${pState.a1_timePlace === t ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_timePlace', '${t}')">${t}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">2. Finites Verb (Position 2):</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.a1_verb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_verb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">3. Subjekt (Position 3 - Inversion!):</label>
            <div class="wb-chip-container">
              ${subjects.map(s => `<button class="wb-selector-chip ${pState.a1_subject.toLowerCase() === s.toLowerCase() ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_subject', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-obj">4. Ergänzung:</label>
            <div class="wb-chip-container">
              ${objs.map(o => `<button class="wb-selector-chip ${pState.a1_object === o ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_object', '${o}')">${o}</button>`).join('')}
            </div>
          </div>
        `;
      } else if (mode === 'modal_bracket') {
        const subjects = ['Ich', 'Du', 'Er', 'Wir', 'Ihr', 'Sie'];
        const modals = ['möchte', 'kann', 'muss', 'will', 'soll', 'darf'];
        const times = ['heute Abend', 'morgen früh', 'im Deutschkurs', 'am Wochenende'];
        const infs = ['lernen', 'Deutsch sprechen', 'nach Hause gehen', 'Kaffee trinken', 'einkaufen'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Subjekt (Pos 1):</label>
            <div class="wb-chip-container">
              ${subjects.map(s => `<button class="wb-selector-chip ${pState.a1_subject === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_subject', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">2. Modalverb (Pos 2 - Konjugiert):</label>
            <div class="wb-chip-container">
              ${modals.map(m => `<button class="wb-selector-chip ${pState.a1_modal === m ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_modal', '${m}')">${m}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">3. Mittelfeld:</label>
            <div class="wb-chip-container">
              ${times.map(t => `<button class="wb-selector-chip ${pState.a1_timePlace === t ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_timePlace', '${t}')">${t}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">4. Satzende (Infinitiv 🔒):</label>
            <div class="wb-chip-container">
              ${infs.map(i => `<button class="wb-selector-chip ${pState.a1_infinitive === i ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_infinitive', '${i}')">${i}</button>`).join('')}
            </div>
          </div>
        `;
      } else if (mode === 'w_question') {
        const words = ['Wo', 'Wer', 'Was', 'Woher', 'Wohin', 'Wann', 'Wie'];
        const verbs = ['wohnen', 'bist', 'macht', 'kommt', 'arbeitet', 'heißt'];
        const tails = ['du in Deutschland?', 'Sie von Beruf?', 'Herr Müller heute?', 'wir morgen?', 'die Lehrerin?'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. W-Fragewort (Pos 1):</label>
            <div class="wb-chip-container">
              ${words.map(w => `<button class="wb-selector-chip ${pState.a1_questionWord === w ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_questionWord', '${w}')">${w}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">2. Verb (Pos 2):</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.a1_verb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_verb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">3. Subjekt / Ergänzung:</label>
            <div class="wb-chip-container">
              ${tails.map(t => `<button class="wb-selector-chip ${pState.a1_questionTail === t ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_questionTail', '${t}')">${t}</button>`).join('')}
            </div>
          </div>
        `;
      } else { // yes_no_question
        const verbs = ['lernst', 'trinkst', 'wohnst', 'kommst', 'arbeitest'];
        const subjs = ['du', 'ihr', 'Sie'];
        const objs = ['fleißig Deutsch', 'einen Kaffee', 'in Berlin', 'aus Passau', 'heute Abend'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">1. Finites Verb (Pos 1 - Frage!):</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.a1_verb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_verb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">2. Subjekt (Pos 2):</label>
            <div class="wb-chip-container">
              ${subjs.map(s => `<button class="wb-selector-chip ${pState.a1_subject.toLowerCase() === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_subject', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">3. Ergänzung (?):</label>
            <div class="wb-chip-container">
              ${objs.map(o => `<button class="wb-selector-chip ${pState.a1_object === o ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a1_object', '${o}')">${o}</button>`).join('')}
            </div>
          </div>
        `;
      }
    } else if (lvl === 'A2') {
      const mode = pState.a2_mode || 'weil_clause';
      if (mode === 'weil_clause') {
        const leads = ['Ich lerne fleißig Deutsch', 'Wir bleiben heute zu Hause', 'Er geht heute nicht zur Arbeit', 'Sie spart jeden Monat Geld'];
        const conns = [', weil', ', da'];
        const subjs = ['ich', 'wir', 'er', 'sie'];
        const mids = ['in Deutschland arbeiten', 'das Wetter schlecht', 'gesund werden', 'eine Reise nach Wien machen'];
        const verbs = ['möchte.', 'ist.', 'will.', 'kann.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Hauptsatz:</label>
            <div class="wb-chip-container">
              ${leads.map(l => `<button class="wb-selector-chip ${pState.a2_mainClause === l ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_mainClause', '${l}')">${l}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">2. Kausal-Konnektor:</label>
            <div class="wb-chip-container">
              ${conns.map(c => `<button class="wb-selector-chip ${pState.a2_subConnector === c ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_subConnector', '${c}')">${c}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">3. Nebensatz-Subjekt:</label>
            <div class="wb-chip-container">
              ${subjs.map(s => `<button class="wb-selector-chip ${pState.a2_subSubject === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_subSubject', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">4. Mittelfeld:</label>
            <div class="wb-chip-container">
              ${mids.map(m => `<button class="wb-selector-chip ${pState.a2_subMid === m ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_subMid', '${m}')">${m}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">5. Verb am Satzende 🔴:</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.a2_subVerb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_subVerb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
        `;
      } else if (mode === 'wenn_temporal') {
        const subjs = ['ich', 'wir', 'das Wetter', 'der Kurs'];
        const mids = ['Zeit habe,', 'fertig sind,', 'schön ist,', 'vorbei ist,'];
        const verbs = ['gehe', 'treffen', 'machen', 'kochen'];
        const rests = ['ich im Park spazieren.', 'wir unsere Freunde.', 'wir ein Picknick.', 'ich ein Abendessen.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">1. Wenn + Subjekt:</label>
            <div class="wb-chip-container">
              ${subjs.map(s => `<button class="wb-selector-chip ${pState.a2_wennSubject === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_wennSubject', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">2. Nebensatz-Verb am Ende:</label>
            <div class="wb-chip-container">
              ${mids.map(m => `<button class="wb-selector-chip ${pState.a2_wennMid === m ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_wennMid', '${m}')">${m}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">3. Hauptsatz-Verb (Pos 1 nach Komma!):</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.a2_mainVerb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_mainVerb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-obj">4. Hauptsatz-Rest:</label>
            <div class="wb-chip-container">
              ${rests.map(r => `<button class="wb-selector-chip ${pState.a2_mainRest === r ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_mainRest', '${r}')">${r}</button>`).join('')}
            </div>
          </div>
        `;
      } else if (mode === 'infinitiv_zu') {
        const leads = ['Es ist wichtig', 'Ich habe große Lust', 'Es macht viel Spaß', 'Wir planen'];
        const mids = ['jeden Tag neue Vokabeln', 'am Wochenende ins Theater', 'die deutsche Sprache', 'eine eigene Wohnung'];
        const ends = ['zu lernen.', 'zu gehen.', 'zu verstehen.', 'zu finden.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Einleitung:</label>
            <div class="wb-chip-container">
              ${leads.map(l => `<button class="wb-selector-chip ${pState.a2_infLead === l ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_infLead', '${l}')">${l}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">2. Ergänzung:</label>
            <div class="wb-chip-container">
              ${mids.map(m => `<button class="wb-selector-chip ${pState.a2_infMid === m ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_infMid', '${m}')">${m}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">3. zu + Infinitiv 🔒:</label>
            <div class="wb-chip-container">
              ${ends.map(e => `<button class="wb-selector-chip ${pState.a2_infEnd === e ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_infEnd', '${e}')">${e}</button>`).join('')}
            </div>
          </div>
        `;
      } else { // reflexiv
        const subjs = ['Ich', 'Du', 'Wir', 'Er'];
        const verbs = ['freue', 'ärgere', 'interessiere', 'konzentriere'];
        const prons = ['mich', 'dich', 'uns', 'sich'];
        const objs = ['sehr auf den nächsten Urlaub.', 'über die Verspätung.', 'für deutsche Literatur.', 'auf die wichtige Prüfung.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Subjekt:</label>
            <div class="wb-chip-container">
              ${subjs.map(s => `<button class="wb-selector-chip ${pState.a2_refSubject === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_refSubject', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">2. Reflexives Verb:</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.a2_refVerb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_refVerb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">3. Reflexivpronomen:</label>
            <div class="wb-chip-container">
              ${prons.map(p => `<button class="wb-selector-chip ${pState.a2_refPronoun === p ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_refPronoun', '${p}')">${p}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">4. Präpositional-Objekt:</label>
            <div class="wb-chip-container">
              ${objs.map(o => `<button class="wb-selector-chip ${pState.a2_refObj === o ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('a2_refObj', '${o}')">${o}</button>`).join('')}
            </div>
          </div>
        `;
      }
    } else if (lvl === 'B1') {
      const mode = pState.b1_mode || 'relativsatz';
      if (mode === 'relativsatz') {
        const leads = ['Das ist der neue Kollege', 'Hier steht das schöne Haus', 'Ich danke der netten Nachbarin', 'Wir kennen die Experten'];
        const prons = [', der', ', die', ', das', ', den', ', dem', ', denen'];
        const mids = ['aus der Schweiz', 'im 19. Jahrhundert erbaut', 'mir gestern geholfen', 'beim Projekt beraten'];
        const verbs = ['stammt.', 'wurde.', 'hat.', 'haben.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Hauptsatz mit Bezugsnomen:</label>
            <div class="wb-chip-container">
              ${leads.map(l => `<button class="wb-selector-chip ${pState.b1_relLead === l ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_relLead', '${l}')">${l}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">2. Relativpronomen:</label>
            <div class="wb-chip-container">
              ${prons.map(p => `<button class="wb-selector-chip ${pState.b1_relPron === p ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_relPron', '${p}')">${p}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">3. Mittelfeld:</label>
            <div class="wb-chip-container">
              ${mids.map(m => `<button class="wb-selector-chip ${pState.b1_relMid === m ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_relMid', '${m}')">${m}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">4. Verb am Satzende 🔴:</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.b1_relVerb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_relVerb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
        `;
      } else if (mode === 'konjunktiv2') {
        const conds = ['Wenn ich mehr Zeit hätte,', 'Wenn wir im Lotto gewinnen würden,', 'Wenn das Wetter schöner wäre,'];
        const verbs = ['würde', 'könnten', 'hätte'];
        const subjs = ['ich', 'wir', 'man'];
        const ends = ['jeden Tag zwei Stunden Deutsch lernen.', 'eine weltweite Bildungsreise machen.', 'viel weniger Stress im Berufsalltag.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">1. Wenn-Bedingung:</label>
            <div class="wb-chip-container">
              ${conds.map(c => `<button class="wb-selector-chip ${pState.b1_kj2Cond === c ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_kj2Cond', '${c}')">${c}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">2. Konjunktiv II Verb:</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.b1_kj2Verb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_kj2Verb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">3. Subjekt:</label>
            <div class="wb-chip-container">
              ${subjs.map(s => `<button class="wb-selector-chip ${pState.b1_kj2Subj === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_kj2Subj', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">4. Prädikat / Rest:</label>
            <div class="wb-chip-container">
              ${ends.map(e => `<button class="wb-selector-chip ${pState.b1_kj2End === e ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_kj2End', '${e}')">${e}</button>`).join('')}
            </div>
          </div>
        `;
      } else if (mode === 'passiv') {
        const subjs = ['Der neue Vertrag', 'Die historischen Dokumente', 'Das innovative Produkt'];
        const auxs = ['wird', 'wurde', 'werden'];
        const agents = ['von der Rechtsabteilung', 'vom Forscherteam', 'durch modernste Maschinen'];
        const parts = ['sorgfältig geprüft.', 'bereits digitalisiert.', 'vollautomatisch hergestellt.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Subjekt (Geduldetes Objekt):</label>
            <div class="wb-chip-container">
              ${subjs.map(s => `<button class="wb-selector-chip ${pState.b1_pasSubj === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_pasSubj', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">2. Passiv-Hilfsverb (wird/wurde):</label>
            <div class="wb-chip-container">
              ${auxs.map(a => `<button class="wb-selector-chip ${pState.b1_pasAux === a ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_pasAux', '${a}')">${a}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">3. Agens (von/durch):</label>
            <div class="wb-chip-container">
              ${agents.map(ag => `<button class="wb-selector-chip ${pState.b1_pasAgent === ag ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_pasAgent', '${ag}')">${ag}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">4. Partizip II 🔒:</label>
            <div class="wb-chip-container">
              ${parts.map(pt => `<button class="wb-selector-chip ${pState.b1_pasPartizip === pt ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_pasPartizip', '${pt}')">${pt}</button>`).join('')}
            </div>
          </div>
        `;
      } else { // zweiteilig
        const leads = ['Unsere Sprachakademie bietet', 'Der Bewerber beherrscht', 'Dieses Projekt ist'];
        const part1s = ['nicht nur intensiven Unterricht,', 'sowohl verhandlungssicheres Deutsch,', 'weder zu teuer,'];
        const part2s = ['sondern auch persönliche Karriereberatung.', 'als auch fließendes Englisch.', 'noch zu zeitaufwendig.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Hauptsatz-Vorfeld & Verb:</label>
            <div class="wb-chip-container">
              ${leads.map(l => `<button class="wb-selector-chip ${pState.b1_zwLead === l ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_zwLead', '${l}')">${l}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">2. Erster Teil des Doppelkonnektors:</label>
            <div class="wb-chip-container">
              ${part1s.map(p => `<button class="wb-selector-chip ${pState.b1_zwPart1 === p ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_zwPart1', '${p}')">${p}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">3. Zweiter Teil des Doppelkonnektors:</label>
            <div class="wb-chip-container">
              ${part2s.map(p => `<button class="wb-selector-chip ${pState.b1_zwPart2 === p ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b1_zwPart2', '${p}')">${p}</button>`).join('')}
            </div>
          </div>
        `;
      }
    } else if (lvl === 'B2') {
      const mode = pState.b2_mode || 'fvg';
      if (mode === 'fvg') {
        const subjs = ['Die Geschäftsleitung', 'Das Forschungsteam', 'Der Ausschuss'];
        const times = ['nach langen Beratungen', 'im Laufe des Tages', 'gestern Abend'];
        const nouns = ['eine zukunftsweisende Entscheidung', 'wichtige Vorbereitungen', 'die Frage zur Diskussion'];
        const verbs = ['getroffen.', 'getroffen hat.', 'gestellt.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Subjekt:</label>
            <div class="wb-chip-container">
              ${subjs.map(s => `<button class="wb-selector-chip ${pState.b2_fvgSubj === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b2_fvgSubj', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">2. Umstand / Zeit:</label>
            <div class="wb-chip-container">
              ${times.map(t => `<button class="wb-selector-chip ${pState.b2_fvgTime === t ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b2_fvgTime', '${t}')">${t}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">3. Funktionsnomen:</label>
            <div class="wb-chip-container">
              ${nouns.map(n => `<button class="wb-selector-chip ${pState.b2_fvgNoun === n ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b2_fvgNoun', '${n}')">${n}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">4. Finites Funktionsverb 🔴:</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.b2_fvgVerb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b2_fvgVerb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
        `;
      } else if (mode === 'passiv_ersatz') {
        const subjs = ['Dieses anspruchsvolle Problem', 'Die vertraulichen Akten', 'Der Plan'];
        const structs = ['lässt sich', 'sind bis morgen', 'ist kaum'];
        const advs = ['ohne nennenswerten Mehraufwand', 'vollständig', 'mit einfachen Mitteln'];
        const ends = ['reibungslos lösen.', 'zu unterzeichnen.', 'umsetzbar.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Subjekt:</label>
            <div class="wb-chip-container">
              ${subjs.map(s => `<button class="wb-selector-chip ${pState.b2_peSubj === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b2_peSubj', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">2. Passiv-Ersatzform:</label>
            <div class="wb-chip-container">
              ${structs.map(st => `<button class="wb-selector-chip ${pState.b2_peStruct === st ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b2_peStruct', '${st}')">${st}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">3. Adverbiale Bestimmung:</label>
            <div class="wb-chip-container">
              ${advs.map(a => `<button class="wb-selector-chip ${pState.b2_peAdv === a ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b2_peAdv', '${a}')">${a}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">4. Abschluss (Infinitiv) 🔒:</label>
            <div class="wb-chip-container">
              ${ends.map(e => `<button class="wb-selector-chip ${pState.b2_peEnd === e ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b2_peEnd', '${e}')">${e}</button>`).join('')}
            </div>
          </div>
        `;
      } else if (mode === 'erweitertes_partizip') {
        const arts = ['Die', 'Ein', 'Alle', 'Das'];
        const phrases = ['seit vielen Jahren international führenden', 'vom Ministerium geförderte', 'stetig an Relevanz gewinnende'];
        const nouns = ['Unternehmen steigern ihre F&E-Investitionen.', 'Projekt erzielte herausragende Erfolge.', 'Technologie verändert den Markt.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Artikel:</label>
            <div class="wb-chip-container">
              ${arts.map(a => `<button class="wb-selector-chip ${pState.b2_epArt === a ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b2_epArt', '${a}')">${a}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">2. Erweitertes Partizipialattribut:</label>
            <div class="wb-chip-container">
              ${phrases.map(p => `<button class="wb-selector-chip ${pState.b2_epPhrase === p ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b2_epPhrase', '${p}')">${p}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">3. Bezugsnomen & Kernsatz:</label>
            <div class="wb-chip-container">
              ${nouns.map(n => `<button class="wb-selector-chip ${pState.b2_epNoun === n ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('b2_epNoun', '${n}')">${n}</button>`).join('')}
            </div>
          </div>
        `;
      } else { // praep_adverb
        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">Pronominaladverbien (Worauf / Darauf):</label>
            <div class="wb-chip-container">
              <button class="wb-selector-chip active">Worauf kommt es an? &rarr; Es kommt darauf an, im Team zu arbeiten.</button>
            </div>
          </div>
        `;
      }
    } else { // C1
      const mode = pState.c1_mode || 'nominalstil';
      if (mode === 'nominalstil') {
        const preps = ['Nach Abschluss der umfassenden Verhandlungen', 'Aufgrund des drastischen Anstiegs der Rohstoffpreise', 'Zur Gewährleistung höchster Standards'];
        const verbs = ['wurde', 'sahen sich', 'müssen'];
        const subjs = ['ein wegweisendes Abkommen', 'die führenden Industrieunternehmen', 'alle standardisierten Prozesse'];
        const ends = ['von allen Ministerien paraphiert.', 'zu massiven Einsparungen gezwungen.', 'fortlaufend auditiert werden.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">1. Nominalgefüge (Präposition):</label>
            <div class="wb-chip-container">
              ${preps.map(p => `<button class="wb-selector-chip ${pState.c1_nsPrep === p ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_nsPrep', '${p}')">${p}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">2. Verb (Pos 2) 🔴:</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.c1_nsVerb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_nsVerb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">3. Subjekt:</label>
            <div class="wb-chip-container">
              ${subjs.map(s => `<button class="wb-selector-chip ${pState.c1_nsSubj === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_nsSubj', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-obj">4. Prädikatsabschluss:</label>
            <div class="wb-chip-container">
              ${ends.map(e => `<button class="wb-selector-chip ${pState.c1_nsEnd === e ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_nsEnd', '${e}')">${e}</button>`).join('')}
            </div>
          </div>
        `;
      } else if (mode === 'partizipial_verkuerzung') {
        const parts = ['Am Verhandlungsort eingetroffen,', 'Von den Resultaten tief beeindruckt,', 'Dem wissenschaftlichen Protokoll folgend,'];
        const verbs = ['eröffnete', 'beschloss', 'dokumentierten'];
        const subjs = ['die Bundeskanzlerin', 'der Vorstandsvorsitzende', 'die Forscher'];
        const ends = ['die internationale Konferenz mit einer Grundsatzrede.', 'die sofortige Freigabe zusätzlicher Mittel.', 'jeden einzelnen Messwert minutiös.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">1. Partizipialkonstruktion:</label>
            <div class="wb-chip-container">
              ${parts.map(p => `<button class="wb-selector-chip ${pState.c1_pvPart === p ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_pvPart', '${p}')">${p}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">2. Verb (Pos 1 nach Komma!):</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.c1_pvVerb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_pvVerb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">3. Subjekt:</label>
            <div class="wb-chip-container">
              ${subjs.map(s => `<button class="wb-selector-chip ${pState.c1_pvSubj === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_pvSubj', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-obj">4. Prädikatsabschluss:</label>
            <div class="wb-chip-container">
              ${ends.map(e => `<button class="wb-selector-chip ${pState.c1_pvEnd === e ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_pvEnd', '${e}')">${e}</button>`).join('')}
            </div>
          </div>
        `;
      } else if (mode === 'modaler_infinitiv') {
        const subjs = ['Die diplomatischen Bemühungen', 'Kein bisheriges Berechnungsmodell', 'Die vorliegenden Befunde'];
        const verbs = ['scheinen', 'vermag', 'drohen'];
        const mids = ['endlich die friedliche Wende', 'die komplexe Marktdynamik präzise', 'den bisherigen Konsens'];
        const ends = ['herbeizuführen.', 'abzubilden.', 'zu erschüttern.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Subjekt:</label>
            <div class="wb-chip-container">
              ${subjs.map(s => `<button class="wb-selector-chip ${pState.c1_miSubj === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_miSubj', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">2. Modales Verb (scheinen/vermögen):</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.c1_miVerb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_miVerb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">3. Mittelfeld:</label>
            <div class="wb-chip-container">
              ${mids.map(m => `<button class="wb-selector-chip ${pState.c1_miMid === m ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_miMid', '${m}')">${m}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">4. Infinitiv mit zu 🔒:</label>
            <div class="wb-chip-container">
              ${ends.map(e => `<button class="wb-selector-chip ${pState.c1_miEnd === e ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_miEnd', '${e}')">${e}</button>`).join('')}
            </div>
          </div>
        `;
      } else { // konjunktiv1
        const intros = ['Der Regierungssprecher erklärte,', 'Das Gutachten hält fest,', 'Die Notenbank betonte,'];
        const subjs = ['die gegenwärtige Wirtschaftslage', 'eine rasche Erholung', 'die Inflationsrate'];
        const mids = ['keineswegs so pessimistisch zu bewerten', 'bereits im kommenden Halbjahr zu erwarten', 'im Zielkorridor von zwei Prozent'];
        const verbs = ['sei.', 'werde.', 'liege.'];

        return `
          <div class="wb-selector-row">
            <label class="wb-selector-label label-pos1">1. Redeeinleitung:</label>
            <div class="wb-chip-container">
              ${intros.map(i => `<button class="wb-selector-chip ${pState.c1_k1Intro === i ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_k1Intro', '${i}')">${i}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-bracket">2. Subjekt der indirekten Rede:</label>
            <div class="wb-chip-container">
              ${subjs.map(s => `<button class="wb-selector-chip ${pState.c1_k1Subj === s ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_k1Subj', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-mid">3. Mittelfeld:</label>
            <div class="wb-chip-container">
              ${mids.map(m => `<button class="wb-selector-chip ${pState.c1_k1Mid === m ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_k1Mid', '${m}')">${m}</button>`).join('')}
            </div>
          </div>
          <div class="wb-selector-row">
            <label class="wb-selector-label label-verb">4. Konjunktiv I Verb 🔴:</label>
            <div class="wb-chip-container">
              ${verbs.map(v => `<button class="wb-selector-chip ${pState.c1_k1Verb === v ? 'active' : ''}" onclick="window.WorkbookStudio.updateSentenceField('c1_k1Verb', '${v}')">${v}</button>`).join('')}
            </div>
          </div>
        `;
      }
    }
  };

window.WorkbookStudio = WorkbookStudio;

})(window);
