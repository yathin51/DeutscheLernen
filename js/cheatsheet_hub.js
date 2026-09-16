/**
 * cheatsheet_hub.js
 * 
 * Interactive Spickzettel-Zentrale (DaF Cheat Sheet Hub)
 * Fast exam revision, conversational reference & Hans Witzlinger Arbeitsbuch tips across A1–C1.
 * 100% client-side, zero dependencies, offline-ready.
 */

(function() {
  'use strict';

  const CheatsheetHub = {

    // --------------------------------------------------------------------------
    // 🧠 Muskelgedächtnis-Reflex-Trainer (Subconscious Reflex Drills)
    // --------------------------------------------------------------------------
    reflexDrills: [
      {
        id: "rf_1",
        level: "A1",
        category: "syntax",
        stimulus: "Zeit- oder Ortsangabe steht am Satzanfang (z. B. „Heute...“ / „Im Park...“)",
        question: "Wo steht das finite Verb und wo landet das Subjekt?",
        reflexAnswer: "Verb IMMER auf Position 2! Das Subjekt wandert direkt auf Position 3!",
        metaphor: "🧲 Der Verb-Magnet hält Pos 2 eisern fest. Das Subjekt weicht auf Pos 3 aus.",
        example: "„Heute lerne ich fleißig Deutsch.“ (NICHT: Heute ich lerne ❌)",
        enBridge: "English says 'Today I go', but German verbs are glued to Position 2: 'Today go I' (Inversion)."
      },
      {
        id: "rf_2",
        level: "A1",
        category: "cases",
        stimulus: "Maskulines Nomen im Akkusativ (Wen/Was?)",
        question: "Welche Artikelform feuert reflexartig ab?",
        reflexAnswer: "„den / einen / meinen / keinen“!",
        metaphor: "🔨 Der Akkusativ-Hammer: Nur der Mann bekommt den Schlag (-en)! Feminin, Neutrum & Plural sind immun.",
        example: "„Ich kaufe DEN Tisch (der) und DIE Lampe (die bleibt!).“",
        enBridge: "Like English 'he' ➔ 'him', only masculine German changes: 'der' ➔ 'den' (feminine & neuter stay immune!)."
      },
      {
        id: "rf_3",
        level: "A1",
        category: "prepositions",
        stimulus: "DOGFU (Durch, Ohne, Gegen, Für, Um)",
        question: "Welcher Kasus folgt nach diesen 5 Präpositionen?",
        reflexAnswer: "Zu 100% immer der AKKUSATIV!",
        metaphor: "🐶 Der DOGFU-Wachhund verjagt jeden Dativ sofort vom Hof.",
        example: "„Ohne MEINEN Hund gehe ich durch DEN Park.“",
        enBridge: "DOGFU = Through, Without, Against, For, Around. All 5 strictly demand the direct object (Accusative)."
      },
      {
        id: "rf_4",
        level: "A1",
        category: "bracket",
        stimulus: "Modalverb oder Hilfsverb auf Position 2 (kann, muss, will, hat, ist)",
        question: "Wohin wandert das eigentliche Hauptverb (Infinitiv oder Partizip II)?",
        reflexAnswer: "GANZ ANS SATZENDE!",
        metaphor: "🏗️ Der Satzklammer-Kran: Verb-Kopf vorne, Verb-Haken ganz hinten – klammert die Satzfracht ein.",
        example: "„Ich KANN heute leider nicht zur Schule KOMMEN.“",
        enBridge: "English keeps 'can come' together. German brackets the sentence: modal on Pos 2, infinitive at the very end."
      },
      {
        id: "rf_5",
        level: "A2",
        category: "prepositions",
        stimulus: "Aus - Bei - Mit - Nach - Seit - Von - Zu",
        question: "Welcher Fall folgt nach diesen 7 Präpositionen?",
        reflexAnswer: "Zu 100% ausnahmslos der DATIV!",
        metaphor: "🎶 Der Dativ-Rhythmus-Marsch: Singe diese 7 im Marschtakt!",
        example: "„Ich fahre MIT DEM Bus ZU MEINEM Freund.“",
        enBridge: "From, at, with, after/to, since, of/by, to: all 7 100% demand the indirect object (Dative: dem/der/dem/den)."
      },
      {
        id: "rf_6",
        level: "A2",
        category: "prepositions",
        stimulus: "Wechselpräposition + Bewegung auf ein Ziel zu (Wohin?)",
        question: "Welcher Fall wird reflexartig ausgelöst?",
        reflexAnswer: "AKKUSATIV!",
        metaphor: "🎯 Der Darts-Flugpfeil fliegt dynamisch ins Ziel!",
        example: "„Ich lege das Buch AUF DEN Tisch.“",
        enBridge: "Movement towards a destination (into/onto) = Accusative (the dart flies to the target!)."
      },
      {
        id: "rf_7",
        level: "A2",
        category: "prepositions",
        stimulus: "Wechselpräposition + statische Ruhe am festen Ort (Wo?)",
        question: "Welcher Fall wird reflexartig ausgelöst?",
        reflexAnswer: "DATIV!",
        metaphor: "📍 Die GPS-Stecknadel ruht fest und unverändert im Boden.",
        example: "„Das Buch liegt AUF DEM Tisch.“",
        enBridge: "Static resting location (in/on at rest) = Dative (the GPS pin stays fixed in place!)."
      },
      {
        id: "rf_8",
        level: "A2",
        category: "syntax",
        stimulus: "Subjunktion leitet Nebensatz ein (weil, dass, wenn, obwohl, als)",
        question: "Wo landet das konjugierte finite Verb?",
        reflexAnswer: "GANZ AM SATZENDE!",
        metaphor: "🚀 Das Verb-Katapult: Der Konnektor schleudert das Verb an die allerletzte Stelle!",
        example: "„Ich bleibe zu Hause, WEIL ich krank BIN.“",
        enBridge: "In English: 'because I have time'. In German, 'weil/dass/wenn' catapult the conjugated verb to the end: 'weil ich Zeit habe'."
      },
      {
        id: "rf_9",
        level: "B1",
        category: "syntax",
        stimulus: "TeKaMoLo (Wortstellung im Mittelfeld)",
        question: "In welcher Reihenfolge ordnest du Zeit, Art, Grund und Ort an?",
        reflexAnswer: "1. Wann? (Temporal) ➔ 2. Warum? (Kausal) ➔ 3. Wie? (Modal) ➔ 4. Wo/Wohin? (Lokal)",
        metaphor: "🚂 Der TeKaMoLo-Express: 4 Waggons in unverrückbarer Rangierfolge.",
        example: "„Ich fahre [heute] [wegen des Regens] [mit dem Bus] [nach München].“",
        enBridge: "TeKaMoLo expresses the sentence components: 1. When? ➔ 2. Why? ➔ 3. How? ➔ 4. Where?"
      },
      {
        id: "rf_10",
        level: "B1",
        category: "endings",
        stimulus: "Adjektiv nach unbestimmtem Artikel „ein“ vor Maskulinum im Nominativ",
        question: "Welche Endung erhält das Adjektiv?",
        reflexAnswer: "„-er“ (ein guter Mann 🦁)!",
        metaphor: "🚦 Die Adjektiv-Ampel: 'ein' hat kein Signal (Rot) ➔ Adjektiv MUSS das Signal '-er' tragen!",
        example: "„Hier steht ein neuER Tisch.“",
        enBridge: "If the article doesn't carry the gender signal (ein), the adjective MUST carry it (ein gut-er Mann)."
      },
      {
        id: "rf_11",
        level: "B2",
        category: "passive",
        stimulus: "Passiversatzform für „Das Problem kann gelöst werden“",
        question: "Welche elegante B2-Reflexformel nutzt du?",
        reflexAnswer: "„Das Problem LÄSST SICH lösen.“ oder „Das Problem IST zu lösen.“",
        metaphor: "⚙️ Das 4-Wege-Passiversatz-Getriebe für gehobene Stilebene.",
        example: "„Diese Hürde LÄSST SICH überwinden.“",
        enBridge: "English says 'can be solved'. High-level German uses 'lässt sich lösen' (lets itself be solved)."
      },
      {
        id: "rf_12",
        level: "C1",
        category: "nominal",
        stimulus: "Verbaler Nebensatz: „Weil die Zinsen stiegen...“",
        question: "Wie transformiert dein Gehirn das in den C1-Nominalstil?",
        reflexAnswer: "„Aufgrund / Infolge des Zinsanstiegs...“ (Präposition mit Genitiv + Nomen)",
        metaphor: "🔬 Der Nominalstil-Konverter für akademische Berichte und Veröffentlichungen.",
        example: "„Aufgrund des Zinsanstiegs verlangsamte sich das Wachstum.“",
        enBridge: "Converts full subordinate clauses into concise academic noun phrases with genitive."
      }
    ],

    stateReflex: {
      currentIndex: 0,
      revealed: false,
      filterCategory: 'all'
    },

    toggleReflexTrainer: function() {
      const modal = document.getElementById('cs-reflex-modal');
      if (modal) {
        modal.classList.toggle('active');
        if (modal.classList.contains('active')) {
          this.renderReflexCard();
        }
      }
    },

    renderReflexCard: function() {
      const container = document.getElementById('cs-reflex-card-content');
      if (!container) return;

      const filtered = this.getFilteredReflexDrills();
      if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding: 2rem;">Keine Reflex-Drills für diesen Filter gefunden.</p>`;
        return;
      }

      if (this.stateReflex.currentIndex >= filtered.length) {
        this.stateReflex.currentIndex = 0;
      }

      const drill = filtered[this.stateReflex.currentIndex];
      const isRevealed = this.stateReflex.revealed;

      container.innerHTML = `
        <div class="cs-drill-header">
          <span class="cs-drill-badge">${drill.level} · ${drill.category.toUpperCase()}</span>
          <span class="cs-drill-progress">Reflex ${this.stateReflex.currentIndex + 1} von ${filtered.length}</span>
        </div>

        <div class="cs-stimulus-box">
          <div class="cs-stimulus-label">👂 SIGNAL-REIZ (Was du siehst/hörst):</div>
          <div class="cs-stimulus-text">${drill.stimulus}</div>
          <div class="cs-stimulus-question">❓ ${drill.question}</div>
        </div>

        <div class="cs-reflex-answer-box ${isRevealed ? 'revealed' : 'concealed'}" onclick="CheatsheetHub.revealReflex()">
          ${isRevealed ? `
            <div class="cs-reaction-label">⚡ DEIN UNBEWUSSTER MUSKEL-REFLEX:</div>
            <div class="cs-reaction-text">${drill.reflexAnswer}</div>
            <div class="cs-reaction-metaphor">${drill.metaphor}</div>
            <div class="cs-reaction-example">💡 <em>Muster:</em> ${drill.example}</div>
            ${drill.enBridge ? `
              <div class="cs-reaction-enbridge" style="margin-top: 0.6rem; padding: 0.5rem 0.75rem; background: rgba(59, 130, 246, 0.15); border-left: 3px solid #3b82f6; border-radius: 4px; font-size: 0.85rem; color: #bfdbfe; text-align: left;">
                🇬🇧 <strong>English Bridge:</strong> ${drill.enBridge}
              </div>
            ` : ''}
          ` : `
            <div class="cs-reaction-prompt">
              <span style="font-size: 1.8rem; display: block; margin-bottom: 0.5rem;">🧠</span>
              <strong>Klicke oder tippe hier, um den Muskel-Reflex abzufeuern!</strong>
              <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-top: 0.3rem;">(Tastatur: Leertaste zum Aufdecken / Weiter)</div>
            </div>
          `}
        </div>

        <div class="cs-drill-actions">
          <button class="cs-btn-action" onclick="CheatsheetHub.prevReflex()">
            ◀ Vorheriger
          </button>
          <button class="cs-btn-action primary" onclick="${isRevealed ? 'CheatsheetHub.nextReflex()' : 'CheatsheetHub.revealReflex()'}">
            ${isRevealed ? 'Nächster Reflex ▶' : '⚡ Aufdecken (Space)'}
          </button>
        </div>
      `;
    },

    getFilteredReflexDrills: function() {
      const cat = this.stateReflex.filterCategory;
      if (cat === 'all') return this.reflexDrills;
      return this.reflexDrills.filter(d => d.category === cat || d.level.toLowerCase() === cat.toLowerCase());
    },

    revealReflex: function() {
      this.stateReflex.revealed = true;
      this.renderReflexCard();
    },

    nextReflex: function() {
      const filtered = this.getFilteredReflexDrills();
      this.stateReflex.currentIndex = (this.stateReflex.currentIndex + 1) % filtered.length;
      this.stateReflex.revealed = false;
      this.renderReflexCard();
    },

    prevReflex: function() {
      const filtered = this.getFilteredReflexDrills();
      this.stateReflex.currentIndex = (this.stateReflex.currentIndex - 1 + filtered.length) % filtered.length;
      this.stateReflex.revealed = false;
      this.renderReflexCard();
    },

    setReflexFilter: function(category) {
      this.stateReflex.filterCategory = category;
      this.stateReflex.currentIndex = 0;
      this.stateReflex.revealed = false;
      this.renderReflexCard();
    },

    state: {
      activeLevel: 'A1',
      activeCategory: 'all',
      searchQuery: ''
    },

    levels: {
      A1: {
        title: "Stufe A1: Fundamente & Alltags-Start",
        examBadge: "Goethe A1 / telc A1",
        docPath: "A1/Spickzettel.md",
        summary: "Satzbau (V2 & Inversion), Akkusativ-Objekt, Modalverben, Konjugation & erste Konversationen.",
        cards: [
          {
            category: "exam",
            title: "Die Goldene V2-Regel & Inversion",
            badge: "Satzbau",
            html: `
              <p>Das finite Verb steht im Aussagesatz <strong>IMMER auf Position 2</strong>:</p>
              <div class="cs-formula-box">
                <strong>Normal:</strong> <span class="cs-syntax-pill pos1">Ich (Pos 1)</span> + <span class="cs-syntax-pill pos2">lerne (Pos 2)</span> + <span class="cs-syntax-pill mittelfeld">heute fleißig Deutsch</span>.<br>
                <strong>Inversion:</strong> <span class="cs-syntax-pill pos1">Heute (Pos 1)</span> + <span class="cs-syntax-pill pos2">lerne (Pos 2)</span> + <span class="cs-syntax-pill pos3">ich (Pos 3)</span> + <span class="cs-syntax-pill mittelfeld">fleißig Deutsch</span>.
              </div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.4rem;">
                💡 <em>Merke:</em> Wenn Zeit oder Ort auf Pos 1 steht, wandert das Subjekt zwingend auf Pos 3!
              </p>
            `
          },
          {
            category: "exam",
            title: "Die Satzklammer (Modalverben)",
            badge: "Verben",
            html: `
              <p>Modalverben klammern das Mittelfeld ein:</p>
              <div class="cs-formula-box">
                <span class="cs-syntax-pill pos1">Subjekt</span> + <span class="cs-syntax-pill pos2">kann / muss (Pos 2)</span> + <span class="cs-syntax-pill mittelfeld">... Mittelfeld ...</span> + <span class="cs-syntax-pill satzende">Infinitiv (Satzende!)</span><br>
                <em>„<span class="cs-syntax-pill pos1">Ich</span> <span class="cs-syntax-pill pos2">kann</span> heute leider nicht zum Unterricht <span class="cs-syntax-pill satzende">kommen</span>.“</em>
              </div>
            `
          },
          {
            category: "exam",
            title: "Akkusativ: Nur der maskuline Artikel ändert sich!",
            badge: "Kasus",
            html: `
              <table class="cs-table">
                <thead><tr><th>Genus</th><th>Nominativ</th><th>Akkusativ (Wen/Was?)</th></tr></thead>
                <tbody>
                  <tr><td><span class="cs-gender-der">Maskulin</span></td><td><span class="gender-der">der / ein</span> Tisch</td><td><strong class="gender-der" style="color: #0284c7; font-weight:800;">den / einen Tisch</strong> ⚠️</td></tr>
                  <tr><td><span class="cs-gender-die">Feminin</span></td><td><span class="gender-die">die / eine</span> Lampe</td><td><span class="gender-die">die / eine</span> Lampe (bleibt gleich)</td></tr>
                  <tr><td><span class="cs-gender-das">Neutrum</span></td><td><span class="gender-das">das / ein</span> Buch</td><td><span class="gender-das">das / ein</span> Buch (bleibt gleich)</td></tr>
                  <tr><td><span class="cs-gender-pl">Plural</span></td><td><span class="gender-pl">die / -</span> Kinder</td><td><span class="gender-pl">die / -</span> Kinder (bleibt gleich)</td></tr>
                </tbody>
              </table>
            `
          },
          {
            category: "tips",
            title: "Arbeitsbuch-Tipp: Regelmäßige Verbendungen",
            badge: "Witzlinger A1 S.3",
            html: `
              <p>Die 6 Personal-Endungen nach Hans Witzlinger:</p>
              <div class="cs-formula-box">
                ich ➔ <strong>-e</strong> | du ➔ <strong>-st</strong> | er/sie/es ➔ <strong>-t</strong><br>
                wir ➔ <strong>-en</strong> | ihr ➔ <strong>-t</strong> | sie/Sie ➔ <strong>-en</strong>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.4rem;">
                ⚠️ Bei Verbstamm auf <em>-d / -t</em> (arbeiten, finden): <em>du arbeit-<strong>e</strong>-st, er arbeit-<strong>e</strong>-t</em>.
              </p>
            `
          },
          {
            category: "tips",
            title: "Perfekt: Wann haben, wann sein?",
            badge: "Witzlinger A1 S.29",
            html: `
              <p>Standard ist <strong>haben</strong>. Nehmen Sie <strong>sein</strong> nur bei:</p>
              <div class="cs-formula-box">
                1. <strong>Ortswechsel:</strong> gehen, fahren, fliegen, kommen (<em>Ich bin gefahren</em>)<br>
                2. <strong>Zustandswechsel:</strong> aufstehen, aufwachen, einschlafen (<em>Ich bin aufgewacht</em>)<br>
                3. <strong>Ausnahmen:</strong> sein, werden, bleiben (<em>Wir sind geblieben</em>)
              </div>
            `
          },
          {
            category: "conversation",
            title: "Prüfung Sprechen Teil 1: Sich vorstellen",
            badge: "Goethe A1 Sprechen",
            phrases: [
              { de: "Mein Name ist Alex Weber und ich bin 28 Jahre alt.", en: "My name is Alex Weber and I am 28 years old." },
              { de: "Ich komme aus Spanien und wohne jetzt in Frankfurt am Main.", en: "I come from Spain and now live in Frankfurt am Main." },
              { de: "Ich spreche Spanisch, fließend Englisch und ein bisschen Deutsch.", en: "I speak Spanish, fluent English, and a little German." },
              { de: "Ich bin Ingenieur von Beruf und meine Hobbys sind Kochen und Musik.", en: "I am an engineer by profession and my hobbies are cooking and music." }
            ]
          },
          {
            category: "conversation",
            title: "Alltägliche Bitten & Bestellen",
            badge: "Alltags-Dialog",
            phrases: [
              { de: "Ich möchte bitte einen Kaffee und ein Mineralwasser.", en: "I would like a coffee and sparkling water, please." },
              { de: "Entschuldigung, wo finde ich Milch und Brot?", en: "Excuse me, where can I find milk and bread?" },
              { de: "Können Sie mir bitte helfen? Was kostet das?", en: "Could you please help me? How much does that cost?" },
              { de: "Zahlen, bitte! Wir möchten bezahlen.", en: "The check, please! We would like to pay." }
            ]
          },
          {
            category: "rescue",
            title: "🆘 Rettungsanker bei Sprachblockaden",
            badge: "Notfall",
            phrases: [
              { de: "Entschuldigung, wie heißt das auf Deutsch?", en: "Excuse me, what is that called in German?" },
              { de: "Können Sie das bitte noch einmal langsam wiederholen?", en: "Could you please repeat that slowly once more?" },
              { de: "Ich verstehe das Wort leider nicht. Haben Sie ein Beispiel?", en: "Unfortunately I don't understand the word. Do you have an example?" },
              { de: "Einen kleinen Moment bitte, ich überlege kurz.", en: "Just a moment please, I am thinking briefly." }
            ]
          }
        ]
      },

      A2: {
        title: "Stufe A2: Satzgefüge & Dativ-Kompetenz",
        examBadge: "Goethe A2 / telc A2",
        docPath: "A2/Spickzettel.md",
        summary: "Dativ (Wem-Fall), 9 Wechselpräpositionen (Wo vs. Wohin), Nebensätze mit weil/dass/wenn, Präteritum Modalverben.",
        cards: [
          {
            category: "exam",
            title: "Der Dativ (Wem-Fall) & Deklination",
            badge: "Kasus",
            html: `
              <table class="cs-table">
                <thead><tr><th>Genus</th><th>Nominativ</th><th>Dativ (Wem? / Wo?)</th></tr></thead>
                <tbody>
                  <tr><td>Maskulin</td><td>der / ein Mann</td><td><strong>dem / einem</strong> Mann</td></tr>
                  <tr><td>Feminin</td><td>die / eine Frau</td><td><strong>der / einer</strong> Frau <em>(Achtung!)</em></td></tr>
                  <tr><td>Neutrum</td><td>das / ein Kind</td><td><strong>dem / einem</strong> Kind</td></tr>
                  <tr><td>Plural</td><td>die / - Kinder</td><td><strong>den</strong> Kindern <strong>(+n!)</strong></td></tr>
                </tbody>
              </table>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.4rem;">
                📌 <strong>Feste Dativverben:</strong> <em>helfen, danken, gefallen, gehören, gratulieren, schmecken, fehlen, passen</em>.
              </p>
            `
          },
          {
            category: "exam",
            title: "Nebensätze mit „weil“, „dass“, „wenn“",
            badge: "Satzbau",
            html: `
              <p>Das konjugierte Verb wandert <strong>ans absolute Satzende</strong>:</p>
              <div class="cs-formula-box">
                <em>„Ich lerne fleißig, <strong>weil</strong> ich nächste Woche die Prüfung <strong>habe</strong>.“</em><br>
                <em>„Ich weiß, <strong>dass</strong> du viel <strong>geübt hast</strong>.“</em><br>
                <em>„<strong>Wenn</strong> das Wetter schön <strong>ist</strong>, <strong>gehen</strong> wir spazieren.“</em>
              </div>
            `
          },
          {
            category: "exam",
            title: "Die 9 Wechselpräpositionen: Wo? vs. Wohin?",
            badge: "Präpositionen",
            html: `
              <p><strong>an, auf, hinter, in, neben, über, unter, vor, zwischen</strong></p>
              <div class="cs-formula-box">
                📍 <strong>Wo? (Ruhe / Zustand) ➔ DATIV:</strong><br>
                <em>„Das Buch liegt auf <strong>dem</strong> Tisch (Dativ).“</em><br><br>
                🎯 <strong>Wohin? (Richtung / Bewegung) ➔ AKKUSATIV:</strong><br>
                <em>„Ich lege das Buch auf <strong>den</strong> Tisch (Akkusativ).“</em>
              </div>
            `
          },
          {
            category: "tips",
            title: "Arbeitsbuch-Tipp: Lage- & Richtungsverben-Paare",
            badge: "Witzlinger A2 S.22",
            html: `
              <table class="cs-table">
                <thead><tr><th>Aktiv (Wohin? + Akk)</th><th>Statisch (Wo? + Dat)</th></tr></thead>
                <tbody>
                  <tr><td><strong>stellen</strong> (Ich stelle die Vase...)</td><td><strong>stehen</strong> (Die Vase steht...)</td></tr>
                  <tr><td><strong>legen</strong> (Er legt das Handy...)</td><td><strong>liegen</strong> (Das Handy liegt...)</td></tr>
                  <tr><td><strong>setzen</strong> (Sie setzt das Kind...)</td><td><strong>sitzen</strong> (Das Kind sitzt...)</td></tr>
                  <tr><td><strong>hängen</strong> (Ich hänge das Bild...)</td><td><strong>hängen</strong> (Das Bild hängt...)</td></tr>
                </tbody>
              </table>
            `
          },
          {
            category: "tips",
            title: "Arbeitsbuch-Tipp: Reihenfolge im Mittelfeld",
            badge: "Witzlinger A2 S.4",
            html: `
              <div class="cs-formula-box">
                1. <strong>Zwei Nomen:</strong> Dativ VOR Akkusativ!<br>
                <em>„Ich gebe [dem Mann] [den Schlüssel].“</em><br><br>
                2. <strong>Pronomen gewinnt immer:</strong> Pronomen steht vor Nomen!<br>
                <em>„Ich gebe [ihn] [dem Mann].“</em><br><br>
                3. <strong>Zwei Pronomen:</strong> Akkusativ VOR Dativ!<br>
                <em>„Ich gebe [ihn] [ihm].“</em>
              </div>
            `
          },
          {
            category: "conversation",
            title: "Prüfung Sprechen Teil 3: Gemeinsam planen",
            badge: "Goethe A2 Sprechen",
            phrases: [
              { de: "Hast du am Samstag Zeit? Wir könnten zusammen einen Ausflug machen.", en: "Do you have time on Saturday? We could take a trip together." },
              { de: "Das ist eine ausgezeichnete Idee! Wann und wo wollen wir uns treffen?", en: "That is an excellent idea! When and where shall we meet?" },
              { de: "Am Vormittag passt es mir leider nicht. Wie wäre es um 15 Uhr?", en: "Unfortunately the morning doesn't suit me. How about 3 PM?" },
              { de: "Einverstanden! Ich kümmere mich um die Fahrkarten.", en: "Agreed! I will take care of the tickets." }
            ]
          },
          {
            category: "conversation",
            title: "Arztbesuch & Wegbeschreibung",
            badge: "Alltags-Dialog",
            phrases: [
              { de: "Guten Tag, ich brauche einen Termin. Mir tut seit gestern der Hals weh.", en: "Good day, I need an appointment. My throat has been hurting since yesterday." },
              { de: "Wie oft soll ich diese Tabletten einnehmen?", en: "How often should I take these tablets?" },
              { de: "Entschuldigung, wie komme ich am schnellsten zum Hauptbahnhof?", en: "Excuse me, how do I get to the central station the fastest?" },
              { de: "Gehen Sie geradeaus und an der Kreuzung nach links.", en: "Go straight ahead and at the intersection turn left." }
            ]
          }
        ]
      },

      B1: {
        title: "Stufe B1: Komplexe Syntax & Selbstständigkeit",
        examBadge: "Goethe B1 / telc B1 / DTZ",
        docPath: "B1/Spickzettel.md",
        summary: "Relativsätze in allen Kasus, Vorgangspassiv, Konjunktiv II, TeKaMoLo, Adjektiv-Signale, Modelltest-Redemittel.",
        cards: [
          {
            category: "exam",
            title: "Relativsätze: Genus vom Bezugswort, Kasus vom Verb!",
            badge: "Syntax",
            html: `
              <p>Das Relativpronomen richtet sich im <strong>Genus</strong> nach dem Nomen, aber im <strong>Kasus</strong> nach der Funktion im Nebensatz:</p>
              <div class="cs-formula-box">
                • <strong>Nominativ:</strong> Das ist der Kollege, <strong>der</strong> das Projekt leitet.<br>
                • <strong>Akkusativ:</strong> Das ist der Kollege, <strong>den</strong> ich gestern angerufen habe.<br>
                • <strong>Dativ:</strong> Das ist der Kollege, <strong>dem</strong> ich bei der Präsentation geholfen habe.<br>
                • <strong>Mit Präposition:</strong> Das ist der Kollege, <strong>mit dem</strong> ich zusammenarbeite.
              </div>
            `
          },
          {
            category: "exam",
            title: "Vorgangspassiv: werden + Partizip II",
            badge: "Passiv",
            html: `
              <div class="cs-formula-box">
                • <strong>Präsens:</strong> Das Formular <strong>wird</strong> vom Antragsteller <strong>ausgefüllt</strong>.<br>
                • <strong>Präteritum (Bericht):</strong> Das Formular <strong>wurde</strong> gestern <strong>ausgefüllt</strong>.<br>
                • <strong>Mit Modalverb:</strong> Die Rechnung <strong>muss</strong> sofort <strong>überwiesen werden</strong>.<br>
                • <strong>Perfekt:</strong> Der Fehler <strong>ist</strong> rechtzeitig <strong>korrigiert worden</strong>.
              </div>
            `
          },
          {
            category: "exam",
            title: "Die Adjektivdeklination: Das 2-Schritte-Signalsystem",
            badge: "Adjektive",
            html: `
              <p>Frage: <em>Hat das Wort vor dem Adjektiv bereits das Genus/Kasus-Signal gezeigt?</em></p>
              <div class="cs-formula-box">
                1. <strong>Nach bestimmtem Artikel (der/die/das):</strong><br>
                Nominativ Singular = <strong>-e</strong> (der gute Wein, die kalte Milch, das neue Auto).<br>
                Dativ, Genitiv & ALLER Plural = <strong>-en</strong> (mit den neuen Kollegen).<br><br>
                2. <strong>Nach unbestimmtem Artikel (ein/mein/kein):</strong><br>
                Wo der Artikel kein Signal hat (ein alter Mann [-r], ein neues Auto [-s]), <strong>übernimmt das Adjektiv das Signal!</strong>
              </div>
            `
          },
          {
            category: "exam",
            title: "TeKaMoLo: Wortstellung im Mittelfeld",
            badge: "Regel",
            html: `
              <div class="cs-formula-box">
                <strong>1. Temporal (Wann?):</strong> heute / um 10 Uhr<br>
                <strong>2. Kausal (Warum?):</strong> wegen des Meetings<br>
                <strong>3. Modal (Wie?):</strong> mit dem Zug / bequem<br>
                <strong>4. Lokal (Wo? Wohin?):</strong> nach Hamburg<br><br>
                <em>„Ich fahre <strong>heute</strong> <strong>wegen des Meetings</strong> <strong>mit dem Zug</strong> <strong>nach Hamburg</strong>.“</em>
              </div>
            `
          },
          {
            category: "tips",
            title: "Arbeitsbuch-Tipp: Zweiteilige Konnektoren",
            badge: "Witzlinger B1 S.38",
            html: `
              <div class="cs-formula-box">
                • <strong>nicht nur ..., sondern auch ...</strong> (Addition)<br>
                • <strong>sowohl ... als auch ...</strong> (Addition)<br>
                • <strong>entweder ... oder ...</strong> (Alternative)<br>
                • <strong>weder ... noch ...</strong> (Doppelte Verneinung)<br>
                • <strong>zwar ..., aber ...</strong> (Gegensatz)<br>
                • <strong>je ... desto/umso ...</strong> (Proportional: <em>Je mehr du sprichst, desto besser wirst du</em>)
              </div>
            `
          },
          {
            category: "conversation",
            title: "Prüfung B1 Teil 2: Präsentation strukturieren",
            badge: "B1 Vortrag",
            phrases: [
              { de: "Mein Vortrag beschäftigt sich heute mit dem Thema ‚Einkaufen im Internet‘.", en: "My presentation today deals with the topic 'Online Shopping'." },
              { de: "Zuerst möchte ich meine persönlichen Erfahrungen schildern, danach Vor- und Nachteile abwägen.", en: "First I would like to describe my personal experience, then weigh pros and cons." },
              { de: "Ein entscheidender Vorteil ist die Zeitersparnis, allerdings belastet der Rückversand die Umwelt.", en: "A crucial advantage is saving time, although returns put a burden on the environment." },
              { de: "Zusammenfassend bin ich der Ansicht, dass Online-Handel eine sinnvolle Ergänzung darstellt.", en: "In conclusion, I am of the opinion that online retail represents a sensible supplement." },
              { de: "Damit bin ich am Ende meines Vortrags. Haben Sie noch Fragen?", en: "With that I have reached the end of my presentation. Do you have any questions?" }
            ]
          },
          {
            category: "conversation",
            title: "B1-Brief / E-Mail Textbausteine",
            badge: "Schreiben",
            phrases: [
              { de: "Sehr geehrte Damen und Herren, ich schreibe Ihnen bezüglich Ihrer Anzeige vom...", en: "Dear Sir or Madam, I am writing to you regarding your advertisement dated..." },
              { de: "Aus diesem Grund möchte ich Sie höflich bitten, mir den Betrag zu erstatten.", en: "For this reason I would like to politely ask you to refund the amount to me." },
              { de: "Über eine baldige und positive Rückmeldung würde ich mich sehr freuen.", en: "I would be very pleased to receive a prompt and positive response." },
              { de: "Mit freundlichen Grüßen", en: "Sincerely / Kind regards" }
            ]
          }
        ]
      },

      B2: {
        title: "Stufe B2: Gehobene Syntax & Fachsprache",
        examBadge: "Goethe B2 / telc B2 / DTB",
        docPath: "B2/Spickzettel.md",
        summary: "Funktionsverbgefüge (FVG), 4 Passiversatzformen, erweiterte Partizipien, Verhandlung & Geschäftssprache.",
        cards: [
          {
            category: "exam",
            title: "Die 4 Passiversatzformen",
            badge: "Syntax",
            html: `
              <div class="cs-formula-box">
                1. <strong>sich lassen + Infinitiv:</strong> <em>„Das Problem <strong>lässt sich</strong> rasch <strong>lösen</strong>.“</em> (= kann gelöst werden)<br>
                2. <strong>sein + zu + Infinitiv:</strong> <em>„Der Bericht <strong>ist</strong> bis Freitag <strong>einzureichen</strong>.“</em> (= muss eingereicht werden)<br>
                3. <strong>Adjektive auf -bar / -lich:</strong> <em>„Diese Forderung ist nicht <strong>akzeptabel</strong>.“</em> (= kann nicht akzeptiert werden)<br>
                4. <strong>Funktionsverb passivisch:</strong> <em>„Die Frage <strong>steht zur Diskussion</strong>.“</em> (= wird diskutiert)
              </div>
            `
          },
          {
            category: "exam",
            title: "Top 15 Funktionsverbgefüge (Nomen-Verb-Verbindungen)",
            badge: "FVG",
            html: `
              <table class="cs-table">
                <thead><tr><th>Funktionsverbgefüge</th><th>Einfaches Verb</th></tr></thead>
                <tbody>
                  <tr><td><strong>eine Entscheidung treffen</strong></td><td>entscheiden</td></tr>
                  <tr><td><strong>in Betracht ziehen</strong></td><td>erwägen / bedenken</td></tr>
                  <tr><td><strong>zur Verfügung stehen / stellen</strong></td><td>vorhanden sein / bereitstellen</td></tr>
                  <tr><td><strong>in Anspruch nehmen</strong></td><td>nutzen / beanspruchen</td></tr>
                  <tr><td><strong>in Frage kommen / stellen</strong></td><td>möglich sein / bezweifeln</td></tr>
                  <tr><td><strong>Maßnahmen ergreifen</strong></td><td>handeln</td></tr>
                  <tr><td><strong>Kritik üben an + Dat</strong></td><td>kritisieren</td></tr>
                  <tr><td><strong>zur Kenntnis nehmen</strong></td><td>bemerken / wahrnehmen</td></tr>
                </tbody>
              </table>
            `
          },
          {
            category: "exam",
            title: "Erweiterte Partizipien als Adjektivattribute",
            badge: "Partizipien",
            html: `
              <div class="cs-formula-box">
                • <strong>Partizip I (-end: aktiv / gleichzeitig):</strong><br>
                <em>„Die <strong>rasch voranschreitende</strong> Digitalisierung verändert den Markt.“</em><br><br>
                • <strong>Partizip II (-t/-en: passivisch / vorzeitig):</strong><br>
                <em>„Die <strong>gestern vom Vorstand beschlossenen</strong> Maßnahmen treten ab Montag in Kraft.“</em><br><br>
                • <strong>Gerundivum (zu + Partizip I: modale Pflicht):</strong><br>
                <em>„Die <strong>unverzüglich zu erledigenden</strong> Aufgaben haben oberste Priorität.“</em>
              </div>
            `
          },
          {
            category: "tips",
            title: "Arbeitsbuch-Tipp: Subjektive Modalverben (Vermutungen)",
            badge: "Witzlinger B2 S.16",
            html: `
              <div class="cs-formula-box">
                • <strong>müssen (99% sicher):</strong> <em>„Das Licht brennt – er <strong>muss</strong> zu Hause sein.“</em><br>
                • <strong>dürfte (ca. 75% wahrscheinlich):</strong> <em>„Das Projekt <strong>dürfte</strong> morgen fertig sein.“</em><br>
                • <strong>könnte (ca. 50% möglich):</strong> <em>„Die Ursache <strong>könnte</strong> im Update liegen.“</em><br>
                • <strong>soll (Hörensagen / Behauptung Dritter):</strong> <em>„Der CEO <strong>soll</strong> zurücktreten.“</em><br>
                • <strong>will (Eigene Behauptung / man zweifelt):</strong> <em>„Er <strong>will</strong> davon nichts gewusst haben.“</em>
              </div>
            `
          },
          {
            category: "conversation",
            title: "Prüfung B2: Diskussion & Verhandlung auf Augenhöhe",
            badge: "B2 Diskussion",
            phrases: [
              { de: "Aus meiner Perspektive ist hierbei von ausschlaggebender Bedeutung, dass die Qualität gewahrt bleibt.", en: "From my perspective, it is of decisive importance that quality is maintained." },
              { de: "Einerseits ist der wirtschaftliche Ertrag hoch, andererseits müssen soziale Folgekosten berücksichtigt werden.", en: "On the one hand economic yield is high, on the other social follow-up costs must be considered." },
              { de: "Ich teile diese Einschätzung nur bedingt; empirische Studien weisen in eine andere Richtung.", en: "I only conditionally share this assessment; empirical studies point in another direction." },
              { de: "Lassen Sie uns einen Kompromiss finden, der für beide Verhandlungspartner tragfähig ist.", en: "Let us find a compromise that is viable for both negotiating parties." }
            ]
          },
          {
            category: "conversation",
            title: "Professionelle Geschäftskorrespondenz",
            badge: "Business Deutsch",
            phrases: [
              { de: "Bezug nehmend auf unser aufschlussreiches Gespräch vom Vormittag übersende ich Ihnen das Angebot.", en: "Referring to our insightful conversation from this morning, I am sending you the quotation." },
              { de: "Wir bitten Sie, die vertragliche Nachbesserung bis spätestens zum 15. des Monats vorzunehmen.", en: "We request you make the contractual remediation by the 15th of the month at the latest." },
              { de: "Unter dieser Voraussetzung sehen wir einer konstruktiven Zusammenarbeit mit Freude entgegen.", en: "Under this condition, we look forward with pleasure to constructive cooperation." }
            ]
          }
        ]
      },

      C1: {
        title: "Stufe C1: Akademischer Stil & Höchste Eloquenz",
        examBadge: "Goethe C1 / telc C1 Hochschule / TestDaF",
        docPath: "C1/Spickzettel.md",
        summary: "Nominalstil-Transformation, Konjunktiv I für indirekte Rede, modale Infinitive, wissenschaftliche Diskursanalyse.",
        cards: [
          {
            category: "exam",
            title: "Nominalstil vs. Verbalstil: Die akademische Matrix",
            badge: "Nominalstil",
            html: `
              <p>Verwandeln Sie Nebensätze in prägnante präpositionale Nominalgefüge:</p>
              <table class="cs-table">
                <thead><tr><th>Verbaler Nebensatz</th><th>Nominalstil (C1 Präposition)</th></tr></thead>
                <tbody>
                  <tr><td><em>nachdem</em> die Daten geprüft wurden</td><td><strong>Nach Prüfung der Daten</strong></td></tr>
                  <tr><td><em>weil</em> die Rohstoffpreise steigen</td><td><strong>Aufgrund des Anstiegs der Rohstoffpreise</strong></td></tr>
                  <tr><td><em>obwohl</em> die Umstände schwierig sind</td><td><strong>Trotz / Ungeachtet der widrigen Umstände</strong></td></tr>
                  <tr><td><em>wenn</em> Sicherheitsregeln eingehalten werden</td><td><strong>Bei Einhaltung der Sicherheitsrichtlinien</strong></td></tr>
                  <tr><td><em>damit</em> das Ziel erreicht wird</td><td><strong>Zwecks Erreichung des Ziels</strong></td></tr>
                  <tr><td><em>indem</em> man moderne Methoden einsetzt</td><td><strong>Durch Einsatz modernster Verfahren</strong></td></tr>
                </tbody>
              </table>
            `
          },
          {
            category: "exam",
            title: "Konjunktiv I: Indirekte Rede in Wissenschaft & Medien",
            badge: "Konjunktiv I",
            html: `
              <div class="cs-formula-box">
                • <strong>Bildung (Präsensstamm + -e, -est, -e, -en, -et, -en):</strong><br>
                <em>er habe, er sei, er wisse, er könne, er müsse</em><br><br>
                • <strong>Beispiel:</strong><br>
                <em>„Der Sprecher bekräftigte, die Unternehmensgruppe <strong>habe</strong> solide gewirtschaftet und <strong>werde</strong> weiter investieren.“</em><br><br>
                • <strong>Ersatzregel:</strong> Bei Übereinstimmung mit dem Indikativ (z. B. <em>sie haben</em>) weicht man auf den <strong>Konjunktiv II</strong> aus (<em>hätten / würden</em>).
              </div>
            `
          },
          {
            category: "exam",
            title: "Modale Infinitivkonstruktionen (Gehobene Nuancen)",
            badge: "Stilistik",
            html: `
              <div class="cs-formula-box">
                • <strong>scheinen zu + Infinitiv:</strong> <em>„Die Hypothese <strong>scheint</strong> plausibel <strong>zu sein</strong>.“</em><br>
                • <strong>vermögen zu + Infinitiv:</strong> <em>„Weder Theorie noch Empirie <strong>vermochten</strong> das Resultat <strong>zu erklären</strong>.“</em> (= konnten erklären)<br>
                • <strong>pflegen zu + Infinitiv:</strong> <em>„Der Autor <strong>pflegt</strong> historische Analogien <strong>heranzuziehen</strong>.“</em> (= hat die Gewohnheit)<br>
                • <strong>nicht brauchen zu + Infinitiv:</strong> <em>„Dieser Punkt <strong>braucht</strong> nicht weiter vertieft <strong>zu werden</strong>.“</em> (= muss nicht)
              </div>
            `
          },
          {
            category: "tips",
            title: "Arbeitsbuch-Tipp: Subjektlose Passivkonstruktionen",
            badge: "Witzlinger C1 S.5",
            html: `
              <p>Eliminieren Sie den handelnden Akteur für maximale wissenschaftliche Objektivität:</p>
              <div class="cs-formula-box">
                • <em>„Hierbei <strong>gilt es zu berücksichtigen</strong>, dass...“</em><br>
                • <em>„Der Untersuchung <strong>liegt die Annahme zugrunde</strong>, dass...“</em><br>
                • <em>„<strong>Vermutet wird</strong>, dass der Effekt auf thermische Schwankungen zurückzuführen ist.“</em>
              </div>
            `
          },
          {
            category: "conversation",
            title: "C1 Akademische Diskussionsführung & Grafikkommentar",
            badge: "C1 Kolloquium",
            phrases: [
              { de: "Es stellt sich die fundamentale Frage, inwieweit die zugrunde gelegten Prämissen stichhaltig sind.", en: "The fundamental question arises to what extent the underlying premises are sound." },
              { de: "Man darf Ursache und Wirkung keineswegs verwechseln; vielmehr ist von einer reziproken Beeinflussung auszugehen.", en: "One must by no means confuse cause and effect; rather, reciprocal influence is to be assumed." },
              { de: "Das vorliegende Schaubild verdeutlicht den signifikanten Umschwung im beobachteten Zeitraum.", en: "The present diagram illustrates the significant turnaround in the observed period." },
              { de: "Zusammenfassend verdichtet sich der Befund, dass nachhaltige Reformen unausweichlich sind.", en: "In summary, the finding consolidates that sustainable reforms are inevitable." }
            ]
          }
        ]
      }
    },

    init: function(container, initialLevel) {
      if (initialLevel && this.levels[initialLevel]) {
        this.state.activeLevel = initialLevel;
      }
      this.render(container);
    },

    switchLevel: function(lvl) {
      this.state.activeLevel = lvl;
      this.state.searchQuery = '';
      const container = document.getElementById('content-area') || document.querySelector('.content-body');
      if (container) {
        this.render(container);
      }
      // Update breadcrumb
      const bc = document.getElementById('breadcrumb-current');
      if (bc) {
        bc.textContent = `Master-Spickzettel (${lvl === 'ALL' ? 'Alle Stufen' : 'Stufe ' + lvl})`;
      }
    },

    setFilter: function(category) {
      this.state.activeCategory = category;
      this.applyFilter();
    },

    onSearchInput: function(query) {
      this.state.searchQuery = (query || '').toLowerCase().trim();
      this.applyFilter();
    },

    applyFilter: function() {
      const q = this.state.searchQuery;
      const cat = this.state.activeCategory;
      const cards = document.querySelectorAll('.cs-card-item');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        const cardText = card.textContent.toLowerCase();
        
        const matchesCat = (cat === 'all' || cardCat === cat);
        const matchesQuery = (!q || cardText.includes(q));

        if (matchesCat && matchesQuery) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });

      // Update category chips active state
      document.querySelectorAll('.cs-category-chip').forEach(chip => {
        if (chip.getAttribute('data-cat') === cat) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    },

    copyPhrase: function(text, btnElement) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showCopyFeedback(btnElement);
        });
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        this.showCopyFeedback(btnElement);
      }
    },

    showCopyFeedback: function(btnElement) {
      if (!btnElement) return;
      const originalText = btnElement.innerHTML;
      btnElement.innerHTML = '✅ Kopiert!';
      btnElement.style.color = '#10b981';
      btnElement.style.borderColor = '#10b981';
      setTimeout(() => {
        btnElement.innerHTML = originalText;
        btnElement.style.color = '';
        btnElement.style.borderColor = '';
      }, 1500);
    },

    speakPhrase: function(text) {
      if (!('speechSynthesis' in window)) {
        alert('Web Speech API wird von diesem Browser leider nicht unterstützt.');
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const deVoice = voices.find(v => v.lang.startsWith('de') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Hedda') || v.name.includes('Stefan')));
      if (deVoice) utterance.voice = deVoice;
      
      window.speechSynthesis.speak(utterance);
    },

    printSheet: function() {
      window.print();
    },

    render: function(container) {
      const lvl = this.state.activeLevel;
      const lvlData = this.levels[lvl] || this.levels['A1'];

      let cardsHtml = '';
      if (lvl === 'ALL') {
        cardsHtml = this.renderAllLevelsOverview();
      } else {
        cardsHtml = this.renderLevelCards(lvlData);
      }

      const html = `
        <div class="cs-hub-container">
          <!-- Top Controls & Level Tabs -->
          <div class="cs-header-strip">
            <div class="cs-header-top">
              <div class="cs-header-title-box">
                <h1>⚡ Spickzettel-Zentrale: Prüfung Express & Konversation</h1>
                <p>Kompakte Schnell-Revision, DaF-Sprechmuster & didaktische Arbeitsbuch-Tricks nach Hans Witzlinger.</p>
              </div>
              <div class="cs-header-actions">
                <button class="cs-btn-action accent" onclick="CheatsheetHub.toggleReflexTrainer()" title="Muskelgedächtnis-Trainer für automatische Reflexe starten">
                  🧠 Muskel-Reflex-Trainer
                </button>
                <button class="cs-btn-action" onclick="CheatsheetHub.printSheet()" title="Spickzettel sauber drucken oder als PDF sichern">
                  🖨️ Drucken / PDF
                </button>
                ${lvl !== 'ALL' ? `
                  <button class="cs-btn-action primary" onclick="window.location.hash='#doc:${lvlData.docPath}'" title="Vollständiges Dokument lesen">
                    📖 ${lvl}-Skript lesen →
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Level Selector Bar -->
            <div class="cs-level-tabs">
              <button class="cs-level-tab ${lvl === 'A1' ? 'active' : ''}" onclick="CheatsheetHub.switchLevel('A1')">
                🌱 A1 Anfänger
              </button>
              <button class="cs-level-tab ${lvl === 'A2' ? 'active' : ''}" onclick="CheatsheetHub.switchLevel('A2')">
                🌿 A2 Grundstufe
              </button>
              <button class="cs-level-tab ${lvl === 'B1' ? 'active' : ''}" onclick="CheatsheetHub.switchLevel('B1')">
                🌳 B1 Mittelstufe
              </button>
              <button class="cs-level-tab ${lvl === 'B2' ? 'active' : ''}" onclick="CheatsheetHub.switchLevel('B2')">
                💼 B2 Selbstständig
              </button>
              <button class="cs-level-tab ${lvl === 'C1' ? 'active' : ''}" onclick="CheatsheetHub.switchLevel('C1')">
                🎓 C1 Fachkundig
              </button>
              <button class="cs-level-tab ${lvl === 'ALL' ? 'active' : ''}" onclick="CheatsheetHub.switchLevel('ALL')">
                🌟 Master-Übersicht (Alle)
              </button>
            </div>

            <!-- Category Filter & Real-Time Search -->
            <div class="cs-filter-bar">
              <div class="cs-category-chips">
                <button class="cs-category-chip active" data-cat="all" onclick="CheatsheetHub.setFilter('all')">
                  Alle Themen
                </button>
                <button class="cs-category-chip" data-cat="exam" onclick="CheatsheetHub.setFilter('exam')">
                  📝 Prüfungs-Express
                </button>
                <button class="cs-category-chip" data-cat="tips" onclick="CheatsheetHub.setFilter('tips')">
                  💡 Arbeitsbuch-Tipps
                </button>
                <button class="cs-category-chip" data-cat="conversation" onclick="CheatsheetHub.setFilter('conversation')">
                  🗣️ Konversation & Sprechen
                </button>
                <button class="cs-category-chip" data-cat="rescue" onclick="CheatsheetHub.setFilter('rescue')">
                  🆘 Notfall-Phrasen
                </button>
              </div>

              <div class="cs-search-box">
                <span class="cs-search-icon">🔍</span>
                <input 
                  type="text" 
                  class="cs-search-input" 
                  placeholder="Schnellsuche (z. B. Dativ, weil, Adjektiv, Arzt)..."
                  oninput="CheatsheetHub.onSearchInput(this.value)"
                  value="${this.state.searchQuery}"
                />
              </div>
            </div>
          </div>

          <!-- Celebratory Level Completion & Recap Banner -->
          <div class="cs-completion-banner ${lvl.toLowerCase()}">
            <div class="cs-banner-content">
              <h3>🎓 ${lvl === 'ALL' ? 'Master-Spickzettel: Alle 5 GER-Stufen auf einen Blick' : lvl + ' Abschluss-Spickzettel & Rekapitulation'}</h3>
              <p>${lvl === 'ALL' ? 'Die Essenz der deutschen Grammatik und Konversation von A1 bis C1 in einer bunten Schnellübersicht.' : 'Herzlichen Glückwunsch zum Abschluss von ' + lvl + '! Nutzen Sie diese farbcodierte Zusammenfassung zur schnellen Wiederholung vor Prüfungen oder für den Alltag.'}</p>
            </div>
            <div class="cs-banner-badge">
              ✨ ${lvl === 'ALL' ? 'A1 • A2 • B1 • B2 • C1' : 'Level-Recap ' + lvl}
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="cs-section">
            <div class="cs-section-header">
              <h2 class="cs-section-title">
                <span>${lvl === 'ALL' ? '🌐 Übergreifende Sprach-Fundamente' : lvlData.title}</span>
              </h2>
              ${lvl !== 'ALL' ? `<span class="cs-badge-level">🎯 ${lvlData.examBadge}</span>` : ''}
            </div>

            <div class="cs-cards-grid" id="cs-cards-grid">
              ${cardsHtml}
            </div>
          <!-- 🧠 Muskelgedächtnis Reflex Modal -->
          <div id="cs-reflex-modal" class="cs-reflex-modal-overlay">
            <div class="cs-reflex-modal-content">
              <div class="cs-reflex-modal-header">
                <h3>⚡ Muskelgedächtnis-Reflex-Trainer</h3>
                <button class="cs-close-btn" onclick="CheatsheetHub.toggleReflexTrainer()">✕</button>
              </div>
              <p class="cs-reflex-subtext">
                Trainiere unbewusste Sprachreflexe: Wenn du nachts aufgeweckt wirst, muss die Antwort in unter 250 Millisekunden sitzen!
              </p>
              
              <div class="cs-drill-filters">
                <button class="cs-mini-chip active" onclick="CheatsheetHub.setReflexFilter('all')">Alle Reflexe</button>
                <button class="cs-mini-chip" onclick="CheatsheetHub.setReflexFilter('syntax')">🧲 Satzbau</button>
                <button class="cs-mini-chip" onclick="CheatsheetHub.setReflexFilter('cases')">🔨 Fälle & Kasus</button>
                <button class="cs-mini-chip" onclick="CheatsheetHub.setReflexFilter('prepositions')">🐶 Präpositionen</button>
                <button class="cs-mini-chip" onclick="CheatsheetHub.setReflexFilter('bracket')">🏗️ Satzklammer</button>
              </div>

              <div id="cs-reflex-card-content" class="cs-reflex-card-stage">
                <!-- Dynamically populated -->
              </div>
            </div>
          </div>
        </div>
      `;

      container.innerHTML = html;
      this.applyFilter();
    },

    renderLevelCards: function(lvlData) {
      return lvlData.cards.map((card, idx) => {
        let bodyContent = '';

        if (card.phrases && card.phrases.length > 0) {
          bodyContent = `
            <div style="display: flex; flex-direction: column; gap: 0.6rem;">
              ${card.phrases.map(p => `
                <div class="cs-phrase-card">
                  <div class="cs-phrase-german">${p.de}</div>
                  <div class="cs-phrase-english">${p.en}</div>
                  <div class="cs-phrase-actions">
                    <button class="cs-btn-sm" onclick="CheatsheetHub.speakPhrase('${p.de.replace(/'/g, "\\'")}')" title="Aussprache anhören">
                      🔊 Anhören
                    </button>
                    <button class="cs-btn-sm" onclick="CheatsheetHub.copyPhrase('${p.de.replace(/'/g, "\\'")}', this)" title="In die Zwischenablage kopieren">
                      📋 Kopieren
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `;
        } else if (card.html) {
          bodyContent = card.html;
        }

        return `
          <div class="cs-card cs-card-item" data-category="${card.category}">
            <div class="cs-card-header" style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
              <h3 class="cs-card-title">${card.title}</h3>
              <span class="cs-phrase-tag">${card.badge || card.category}</span>
            </div>
            <div class="cs-card-body">
              ${bodyContent}
            </div>
          </div>
        `;
      }).join('');
    },

    renderAllLevelsOverview: function() {
      return `
        <!-- Kasus-Kompass Matrix -->
        <div class="cs-card cs-card-item" data-category="exam" style="grid-column: 1 / -1;">
          <h3 class="cs-card-title">🧭 Der Deutsche Kasus-Kompass (Die 4 Fälle)</h3>
          <div class="table-responsive">
            <table class="cs-table">
              <thead>
                <tr>
                  <th>Kasus</th>
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
                  <td><span class="gender-der">der / ein</span> Tisch</td>
                  <td><span class="gender-die">die / eine</span> Lampe</td>
                  <td><span class="gender-das">das / ein</span> Buch</td>
                  <td>die / - Kinder</td>
                </tr>
                <tr>
                  <td><strong>Akkusativ</strong></td>
                  <td><em>Wen / Was?</em></td>
                  <td><span class="gender-der">den / einen</span> Tisch</td>
                  <td><span class="gender-die">die / eine</span> Lampe</td>
                  <td><span class="gender-das">das / ein</span> Buch</td>
                  <td>die / - Kinder</td>
                </tr>
                <tr>
                  <td><strong>Dativ</strong></td>
                  <td><em>Wem? / Wo?</em></td>
                  <td><span class="gender-der">dem / einem</span> Tisch</td>
                  <td><span class="gender-die">der / einer</span> Lampe</td>
                  <td><span class="gender-das">dem / einem</span> Buch</td>
                  <td>den / - Kindern <strong>(+n)</strong></td>
                </tr>
                <tr>
                  <td><strong>Genitiv</strong></td>
                  <td><em>Wessen?</em></td>
                  <td><span class="gender-der">des / eines</span> Tisches <strong>(+s)</strong></td>
                  <td><span class="gender-die">der / einer</span> Lampe</td>
                  <td><span class="gender-das">des / eines</span> Buches <strong>(+s)</strong></td>
                  <td>der / - Kinder</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Level Jump Cards -->
        <div class="cs-card cs-card-item" data-category="exam">
          <h3 class="cs-card-title">🌱 Stufe A1: Anfänger-Express</h3>
          <p class="cs-card-desc">V2-Wortstellung, Satzklammer (Modalverben), Fragewörter & Vorstellungsgespräch.</p>
          <button class="cs-btn-action primary" onclick="CheatsheetHub.switchLevel('A1')" style="margin-top: 0.5rem;">
            A1 Spickzettel öffnen →
          </button>
        </div>

        <div class="cs-card cs-card-item" data-category="exam">
          <h3 class="cs-card-title">🌿 Stufe A2: Grundstufe-Express</h3>
          <p class="cs-card-desc">Dativ, 9 Wechselpräpositionen, Nebensätze mit weil/wenn, Richtungsverben & Termine planen.</p>
          <button class="cs-btn-action primary" onclick="CheatsheetHub.switchLevel('A2')" style="margin-top: 0.5rem;">
            A2 Spickzettel öffnen →
          </button>
        </div>

        <div class="cs-card cs-card-item" data-category="exam">
          <h3 class="cs-card-title">🌳 Stufe B1: Mittelstufe-Express</h3>
          <p class="cs-card-desc">Relativsätze, Vorgangspassiv, Konjunktiv II, TeKaMoLo, Adjektivendungen & B1-Vortrag.</p>
          <button class="cs-btn-action primary" onclick="CheatsheetHub.switchLevel('B1')" style="margin-top: 0.5rem;">
            B1 Spickzettel öffnen →
          </button>
        </div>

        <div class="cs-card cs-card-item" data-category="exam">
          <h3 class="cs-card-title">💼 Stufe B2: Beruf & Diskussion</h3>
          <p class="cs-card-desc">Funktionsverbgefüge (FVG), 4 Passiversatzformen, erweiterte Partizipien & Verhandlungen.</p>
          <button class="cs-btn-action primary" onclick="CheatsheetHub.switchLevel('B2')" style="margin-top: 0.5rem;">
            B2 Spickzettel öffnen →
          </button>
        </div>

        <div class="cs-card cs-card-item" data-category="exam">
          <h3 class="cs-card-title">🎓 Stufe C1: Akademischer Diskurs</h3>
          <p class="cs-card-desc">Nominalstil-Transformation, Konjunktiv I (Indirekte Rede), modale Infinitive & Kolloquium.</p>
          <button class="cs-btn-action primary" onclick="CheatsheetHub.switchLevel('C1')" style="margin-top: 0.5rem;">
            C1 Spickzettel öffnen →
          </button>
        </div>
      `;
    }
  };

  if (typeof window !== 'undefined') {
    window.CheatsheetHub = CheatsheetHub;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheatsheetHub;
  }
})();
