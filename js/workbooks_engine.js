// ==========================================================================
// DeutscheLernen - Interactive Workbook & Grammar Answer Generation Engine
// ==========================================================================

(function(window) {
  'use strict';

  const WorkbookEngine = {};

  // --------------------------------------------------------------------------
  // 1. German Grammar Solver Knowledge Base
  // --------------------------------------------------------------------------

  const PRONOUN_MAP = {
    'ich': '1s',
    'du': '2s',
    'er': '3s',
    'sie': '3s', // default singular unless plural context
    'es': '3s',
    'man': '3s',
    'wir': '1p',
    'ihr': '2p',
    'sie_pl': '3p',
    'Sie': '3p'
  };

  // Irregular / stem-changing present tense verbs
  const IRREGULAR_VERBS = {
    'sein': { '1s': 'bin', '2s': 'bist', '3s': 'ist', '1p': 'sind', '2p': 'seid', '3p': 'sind' },
    'haben': { '1s': 'habe', '2s': 'hast', '3s': 'hat', '1p': 'haben', '2p': 'habt', '3p': 'haben' },
    'werden': { '1s': 'werde', '2s': 'wirst', '3s': 'wird', '1p': 'werden', '2p': 'werdet', '3p': 'werden' },
    'wissen': { '1s': 'weiß', '2s': 'weißt', '3s': 'weiß', '1p': 'wissen', '2p': 'wisst', '3p': 'wissen' },
    'können': { '1s': 'kann', '2s': 'kannst', '3s': 'kann', '1p': 'können', '2p': 'könnt', '3p': 'können' },
    'müssen': { '1s': 'muss', '2s': 'musst', '3s': 'muss', '1p': 'müssen', '2p': 'müsst', '3p': 'müssen' },
    'wollen': { '1s': 'will', '2s': 'willst', '3s': 'will', '1p': 'wollen', '2p': 'wollt', '3p': 'wollen' },
    'sollen': { '1s': 'soll', '2s': 'sollst', '3s': 'soll', '1p': 'sollen', '2p': 'sollt', '3p': 'sollen' },
    'dürfen': { '1s': 'darf', '2s': 'darfst', '3s': 'darf', '1p': 'dürfen', '2p': 'dürft', '3p': 'dürfen' },
    'möchten': { '1s': 'möchte', '2s': 'möchtest', '3s': 'möchte', '1p': 'möchten', '2p': 'möchtet', '3p': 'möchten' },
    'mögen': { '1s': 'mag', '2s': 'magst', '3s': 'mag', '1p': 'mögen', '2p': 'mögt', '3p': 'mögen' },
    'fahren': { '1s': 'fahre', '2s': 'fährst', '3s': 'fährt', '1p': 'fahren', '2p': 'fahrt', '3p': 'fahren' },
    'schlafen': { '1s': 'schlafe', '2s': 'schläfst', '3s': 'schläft', '1p': 'schlafen', '2p': 'schlaft', '3p': 'schlafen' },
    'lesen': { '1s': 'lese', '2s': 'liest', '3s': 'liest', '1p': 'lesen', '2p': 'lest', '3p': 'lesen' },
    'sehen': { '1s': 'sehe', '2s': 'siehst', '3s': 'sieht', '1p': 'sehen', '2p': 'seht', '3p': 'sehen' },
    'sprechen': { '1s': 'spreche', '2s': 'sprichst', '3s': 'spricht', '1p': 'sprechen', '2p': 'sprecht', '3p': 'sprechen' },
    'geben': { '1s': 'gebe', '2s': 'gibst', '3s': 'gibt', '1p': 'geben', '2p': 'gebt', '3p': 'geben' },
    'helfen': { '1s': 'helfe', '2s': 'hilfst', '3s': 'hilft', '1p': 'helfen', '2p': 'helft', '3p': 'helfen' },
    'nehmen': { '1s': 'nehme', '2s': 'nimmst', '3s': 'nimmt', '1p': 'nehmen', '2p': 'nehmt', '3p': 'nehmen' },
    'treffen': { '1s': 'treffe', '2s': 'triffst', '3s': 'trifft', '1p': 'treffen', '2p': 'trefft', '3p': 'treffen' },
    'essen': { '1s': 'esse', '2s': 'isst', '3s': 'isst', '1p': 'essen', '2p': 'esst', '3p': 'essen' },
    'laufen': { '1s': 'laufe', '2s': 'läufst', '3s': 'läuft', '1p': 'laufen', '2p': 'lauft', '3p': 'laufen' },
    'tragen': { '1s': 'trage', '2s': 'trägst', '3s': 'trägt', '1p': 'tragen', '2p': 'tragt', '3p': 'tragen' },
    'waschen': { '1s': 'wasche', '2s': 'wäschst', '3s': 'wäscht', '1p': 'waschen', '2p': 'wascht', '3p': 'waschen' }
  };

  // Conjugate regular or irregular verb given infinitive and person key
  WorkbookEngine.conjugateVerb = function(infinitive, personKey) {
    if (!infinitive) return '';
    infinitive = infinitive.trim().toLowerCase();

    // Check irregular table
    if (IRREGULAR_VERBS[infinitive] && IRREGULAR_VERBS[infinitive][personKey]) {
      return IRREGULAR_VERBS[infinitive][personKey];
    }

    // Regular conjugation logic
    let stem = infinitive;
    if (stem.endsWith('en')) {
      stem = stem.slice(0, -2);
    } else if (stem.endsWith('n')) {
      stem = stem.slice(0, -1);
    }

    const needsE = stem.endsWith('t') || stem.endsWith('d') ||
      /(?:[bdfgkpst]m|[bdfgkpst]n|chn|ffn)$/i.test(stem);
    const sStem = stem.endsWith('s') || stem.endsWith('ss') || stem.endsWith('ß') || stem.endsWith('z') || stem.endsWith('tz') || stem.endsWith('x');
    const isEln = infinitive.endsWith('eln');

    switch (personKey) {
      case '1s':
        if (isEln) {
          // e.g. bügeln -> bügle, sammeln -> sammle
          const base = stem.slice(0, -2) + stem.slice(-1);
          return base + 'e';
        }
        return stem + 'e';
      case '2s':
        if (sStem) return stem + 't';
        if (needsE) return stem + 'est';
        return stem + 'st';
      case '3s':
        if (needsE) return stem + 'et';
        return stem + 't';
      case '1p':
        return isEln ? stem + 'n' : stem + 'en';
      case '2p':
        if (needsE) return stem + 'et';
        return stem + 't';
      case '3p':
        return isEln ? stem + 'n' : stem + 'en';
      default:
        return infinitive;
    }
  };

  // Get verb ending only (e.g. for "komm___" -> "t", "red___" -> "est")
  WorkbookEngine.getVerbEnding = function(stem, personKey) {
    stem = stem.trim().toLowerCase();
    const needsE = stem.endsWith('t') || stem.endsWith('d');
    const sStem = stem.endsWith('s') || stem.endsWith('ss') || stem.endsWith('ß') || stem.endsWith('z') || stem.endsWith('tz');

    switch (personKey) {
      case '1s':
        return 'e';
      case '2s':
        if (sStem) return 't';
        if (needsE) return 'est';
        return 'st';
      case '3s':
        if (needsE) return 'et';
        return 't';
      case '1p':
        return 'en';
      case '2p':
        if (needsE) return 'et';
        return 't';
      case '3p':
        return 'en';
      default:
        return 'en';
    }
  };

  // Detect grammatical person from subject string
  WorkbookEngine.detectPerson = function(subjectStr) {
    if (!subjectStr) return '3s';
    const s = subjectStr.toLowerCase().trim();

    if (/\b(carlos und ich|maria und ich|du und ich|wir)\b/.test(s)) return '1p';
    if (/\b(du und lena|ihr|du und maria)\b/.test(s)) return '2p';
    if (/\b(karl und eva|maria und carlos|die studenten|sie|sie \(pl\)|die leute)\b/.test(s)) {
      if (s === 'sie' && !/\b(und|alle|beide)\b/.test(s)) {
        return '3s';
      }
      return '3p';
    }
    if (/\bich\b/.test(s)) return '1s';
    if (/\bdu\b/.test(s)) return '2s';
    if (/\b(er|es|der student|die studentin|das kind|man|max|carlos|maria|hatem|hanna|eva|theo|paula|peter|beate)\b/.test(s)) return '3s';

    // Capitalized 'Sie' (polite form)
    if (/\bSie\b/.test(subjectStr)) return '3p';

    return '3s';
  };

  // --------------------------------------------------------------------------
  // 2. Pre-Configured Rich Interactive Lessons Library
  // --------------------------------------------------------------------------

  const PRELOADED_LESSONS = {
    'A1': {
      3: {
        lessonTitle: 'Lektion 1: Verb - Konjugation & Personalpronomen',
        grammarSummary: `
          <div class="wb-rule-summary-box">
            <h4>📌 Grammatikregel: Regelmäßige Verbendungen im Präsens</h4>
            <div class="wb-rule-grid">
              <div class="wb-rule-col"><strong>ich</strong> &rarr; <code>-e</code> (ich lerne)</div>
              <div class="wb-rule-col"><strong>du</strong> &rarr; <code>-st</code> (du lernst)</div>
              <div class="wb-rule-col"><strong>er / sie / es</strong> &rarr; <code>-t</code> (er lernt)</div>
              <div class="wb-rule-col"><strong>wir</strong> &rarr; <code>-en</code> (wir lernen)</div>
              <div class="wb-rule-col"><strong>ihr</strong> &rarr; <code>-t</code> (ihr lernt)</div>
              <div class="wb-rule-col"><strong>sie / Sie</strong> &rarr; <code>-en</code> (sie lernen)</div>
            </div>
            <p style="margin-top: 0.6rem; font-size: 0.85rem; color: var(--text-secondary);">
              <em>Besonderheit:</em> Verben auf <strong>-t, -d</strong> (z.B. <em>arbeiten, antworten, reden</em>) erhalten ein extra <code>-e-</code> vor <code>-st</code> und <code>-t</code> (du arbeit<strong>est</strong>, er arbeit<strong>et</strong>).
            </p>
          </div>
        `,
        exercises: [
          {
            id: 'a1_p3_ex1',
            title: 'Übung 1: Verben auf -en (Endungen ergänzen)',
            instruction: 'Ergänzen Sie die passende Personalendung (-e, -st, -t, -en).',
            example: 'gehen: Du gehst ins Kino.',
            items: [
              { id: '1_a', prefix: 'a) kommen: Maria komm', suffix: ' aus Rom.', answer: 't', explanation: 'Maria (sie, 3. Person Sg.) &rarr; Endung -t (kommt)' },
              { id: '1_b', prefix: 'b) kommen: Carlos komm', suffix: ' aus Madrid.', answer: 't', explanation: 'Carlos (er, 3. Person Sg.) &rarr; Endung -t (kommt)' },
              { id: '1_c', prefix: 'c) kommen: Ich komm', suffix: ' aus Berlin.', answer: 'e', explanation: 'ich (1. Person Sg.) &rarr; Endung -e (komme)' },
              { id: '1_d', prefix: 'd) kommen: Karl und Eva komm', suffix: ' aus Passau.', answer: 'en', explanation: 'Karl und Eva (Plural / sie) &rarr; Endung -en (kommen)' },
              { id: '1_e', prefix: 'e) kaufen: Martin kauf', suffix: ' Obst.', answer: 't', explanation: 'Martin (er, 3. Person Sg.) &rarr; Endung -t (kauft)' },
              { id: '1_f', prefix: 'f) kaufen: Maria kauf', suffix: ' Cola.', answer: 't', explanation: 'Maria (sie, 3. Person Sg.) &rarr; Endung -t (kauft)' },
              { id: '1_g', prefix: 'g) kaufen: Robert und Inga kauf', suffix: ' Eis.', answer: 'en', explanation: 'Robert und Inga (Plural) &rarr; Endung -en (kaufen)' },
              { id: '1_h', prefix: 'h) kaufen: Ich kauf', suffix: ' Mineralwasser.', answer: 'e', explanation: 'ich (1. Person Sg.) &rarr; Endung -e (kaufe)' },
              { id: '1_i', prefix: 'i) wohnen: Ich wohn', suffix: ' in Passau.', answer: 'e', explanation: 'ich (1. Person Sg.) &rarr; Endung -e (wohne)' },
              { id: '1_j', prefix: 'j) wohnen: Carlos wohn', suffix: ' auch in Passau.', answer: 't', explanation: 'Carlos (er, 3. Person Sg.) &rarr; Endung -t (wohnt)' },
              { id: '1_k', prefix: 'k) wohnen: Wir wohn', suffix: ' in Passau.', answer: 'en', explanation: 'wir (1. Person Pl.) &rarr; Endung -en (wohnen)' },
              { id: '1_l', prefix: 'l) wohnen: Ihr wohn', suffix: ' auch in Passau.', answer: 't', explanation: 'ihr (2. Person Pl.) &rarr; Endung -t (wohnt)' },
              { id: '1_m', prefix: 'm) trinken: Du trink', suffix: ' Orangensaft.', answer: 'st', explanation: 'du (2. Person Sg.) &rarr; Endung -st (trinkst)' },
              { id: '1_n', prefix: 'n) trinken: Ihr trink', suffix: ' Kaffee.', answer: 't', explanation: 'ihr (2. Person Pl.) &rarr; Endung -t (trinkt)' },
              { id: '1_o', prefix: 'o) trinken: Ich trink', suffix: ' Tee.', answer: 'e', explanation: 'ich (1. Person Sg.) &rarr; Endung -e (trinke)' },
              { id: '1_p', prefix: 'p) trinken: Robert trink', suffix: ' Mineralwasser.', answer: 't', explanation: 'Robert (er, 3. Person Sg.) &rarr; Endung -t (trinkt)' }
            ]
          },
          {
            id: 'a1_p3_ex2',
            title: 'Übung 2: Passende Verben einsetzen',
            instruction: 'Wählen Sie das passende Verb aus dem Kasten und setzen Sie es in der richtigen Form ein.',
            wordBank: ['wohnst', 'gehen', 'kommt', 'hört', 'studiert', 'kauft', 'trinken', 'mache', 'kennt', 'lernst', 'lebt'],
            example: 'Beispiel: Max kommt aus Köln.',
            items: [
              { id: '2_a', prefix: 'a) Murat ', suffix: ' Musik.', answer: 'hört', alternatives: ['hört'], explanation: 'Murat (3. Person Sg.) + Musik &rarr; hört Musik' },
              { id: '2_b', prefix: 'b) Du ', suffix: ' in Passau.', answer: 'wohnst', alternatives: ['lebst'], explanation: 'du (2. Person Sg.) + in Passau &rarr; wohnst / lebst' },
              { id: '2_c', prefix: 'c) Hanna ', suffix: ' in Wien.', answer: 'studiert', alternatives: ['wohnt', 'lebt'], explanation: 'Hanna (3. Person Sg.) &rarr; studiert / wohnt in Wien' },
              { id: '2_d', prefix: 'd) Ich ', suffix: ' eine Pause.', answer: 'mache', explanation: 'ich (1. Person Sg.) + eine Pause &rarr; mache' },
              { id: '2_e', prefix: 'e) Ihr ', suffix: ' in Berlin.', answer: 'wohnt', alternatives: ['lebt'], explanation: 'ihr (2. Person Pl.) &rarr; wohnt / lebt' },
              { id: '2_f', prefix: 'f) Wir ', suffix: ' nach Hause.', answer: 'gehen', explanation: 'wir (1. Person Pl.) + nach Hause &rarr; gehen' },
              { id: '2_g', prefix: 'g) Theo ', suffix: ' Eva.', answer: 'kennt', explanation: 'Theo (3. Person Sg.) &rarr; kennt Eva' },
              { id: '2_h', prefix: 'h) Du ', suffix: ' Deutsch.', answer: 'lernst', explanation: 'du (2. Person Sg.) + Deutsch &rarr; lernst' },
              { id: '2_i', prefix: 'i) Eva ', suffix: ' ein Eis.', answer: 'kauft', explanation: 'Eva (3. Person Sg.) + ein Eis &rarr; kauft' },
              { id: '2_j', prefix: 'j) Wir ', suffix: ' Saft.', answer: 'trinken', explanation: 'wir (1. Person Pl.) + Saft &rarr; trinken' }
            ]
          },
          {
            id: 'a1_p4_ex4',
            title: 'Übung 4: Verben auf -t, -d, -s, -z (Besonderheiten)',
            instruction: 'Achten Sie auf das Einschub-e (-est, -et) und Verben auf -s/-z (-t statt -st).',
            items: [
              { id: '4_a', prefix: 'a) reden: Ich red', suffix: ' mit Paul.', answer: 'e', explanation: 'ich &rarr; rede' },
              { id: '4_b', prefix: 'b) reden: Du red', suffix: ' mit Klaus.', answer: 'est', explanation: 'Stamm auf -d &rarr; du redest (+e)' },
              { id: '4_c', prefix: 'c) reden: Wir red', suffix: ' mit Maria.', answer: 'en', explanation: 'wir &rarr; reden' },
              { id: '4_d', prefix: 'd) reden: Paul red', suffix: ' mit Eva.', answer: 'et', explanation: 'Paul (3. Person Sg.) auf -d &rarr; redet (+e)' },
              { id: '4_e', prefix: 'e) antworten: Der Student antwort', suffix: '.', answer: 'et', explanation: 'Stamm auf -t &rarr; antwortet (+e)' },
              { id: '4_f', prefix: 'f) antworten: Du antwort', suffix: ' Maria.', answer: 'est', explanation: 'du &rarr; antwortest (+e)' },
              { id: '4_g', prefix: 'g) reisen: Du reis', suffix: ' nach Frankreich.', answer: 't', explanation: 'Stamm auf -s &rarr; du reist (kein Doppel-s!)' },
              { id: '4_h', prefix: 'h) heißen: Du heiß', suffix: ' Alex.', answer: 't', explanation: 'Stamm auf -ß &rarr; du heißt (nur -t)' }
            ]
          }
        ]
      },
      10: {
        lessonTitle: 'Lektion 2: Starke Verben & Nomen/Artikel im Nominativ',
        grammarSummary: `
          <div class="wb-rule-summary-box">
            <h4>📌 Grammatikregel: Vokalwechsel & Bestimmte Artikel</h4>
            <p>Einige starke Verben ändern bei <strong>du</strong> und <strong>er/sie/es</strong> den Stammvokal: <em>e &rarr; i/ie</em> (sprechen &rarr; du sprichst, lesen &rarr; du liest) oder <em>a &rarr; ä</em> (fahren &rarr; du fährst).</p>
            <div class="wb-rule-grid">
              <div class="wb-rule-col"><strong>der</strong> Tisch (Maskulin)</div>
              <div class="wb-rule-col"><strong>die</strong> Lampe (Feminin)</div>
              <div class="wb-rule-col"><strong>das</strong> Buch (Neutral)</div>
              <div class="wb-rule-col"><strong>die</strong> Bücher (Plural)</div>
            </div>
          </div>
        `,
        exercises: [
          {
            id: 'a1_p10_ex1',
            title: 'Übung 1: Vokalwechsel bei starken Verben',
            instruction: 'Konjugieren Sie das Verb in der passenden Form.',
            items: [
              { id: 'l2_1', prefix: 'a) fahren: Er ', suffix: ' mit dem Zug nach München.', answer: 'fährt', explanation: 'fahren (a &rarr; ä bei er/sie/es) &rarr; er fährt' },
              { id: 'l2_2', prefix: 'b) lesen: Du ', suffix: ' die Zeitung.', answer: 'liest', explanation: 'lesen (e &rarr; ie bei du/er) &rarr; du liest' },
              { id: 'l2_3', prefix: 'c) sprechen: Du ', suffix: ' sehr gut Deutsch.', answer: 'sprichst', explanation: 'sprechen (e &rarr; i) &rarr; du sprichst' },
              { id: 'l2_4', prefix: 'd) schlafen: Das Kind ', suffix: ' schon.', answer: 'schläft', explanation: 'schlafen (a &rarr; ä) &rarr; schläft' },
              { id: 'l2_5', prefix: 'e) geben: Carlos ', suffix: ' mir einen Stift.', answer: 'gibt', explanation: 'geben (e &rarr; i) &rarr; gibt' },
              { id: 'l2_6', prefix: 'f) treffen: Wir ', suffix: ' uns am Bahnhof.', answer: 'treffen', explanation: 'wir (Plural hat KEINEN Vokalwechsel) &rarr; treffen' }
            ]
          },
          {
            id: 'a1_p11_ex2',
            title: 'Übung 2: Bestimmte Artikel (der, die, das)',
            instruction: 'Setzen Sie den richtigen bestimmten Artikel ein.',
            items: [
              { id: 'art_1', prefix: 'a) ', suffix: ' Mann kommt aus Italien.', answer: 'Der', alternatives: ['der'], explanation: 'Mann ist maskulin &rarr; der Mann' },
              { id: 'art_2', prefix: 'b) ', suffix: ' Frau arbeitet an der Universität.', answer: 'Die', alternatives: ['die'], explanation: 'Frau ist feminin &rarr; die Frau' },
              { id: 'art_3', prefix: 'c) ', suffix: ' Auto steht vor dem Haus.', answer: 'Das', alternatives: ['das'], explanation: 'Auto ist neutral &rarr; das Auto' },
              { id: 'art_4', prefix: 'd) ', suffix: ' Kinder spielen im Park.', answer: 'Die', alternatives: ['die'], explanation: 'Kinder ist Plural &rarr; die Kinder' },
              { id: 'art_5', prefix: 'e) ', suffix: ' Computer ist neu.', answer: 'Der', alternatives: ['der'], explanation: 'Computer ist maskulin &rarr; der Computer' }
            ]
          }
        ]
      },
      18: {
        lessonTitle: 'Lektion 3: Nomen, Komposita & Akkusativ Grundlagen',
        grammarSummary: `
          <div class="wb-rule-summary-box">
            <h4>📌 Grammatikregel: Akkusativ & Nomen-Genus</h4>
            <p>Im <strong>Akkusativ</strong> ändert sich nur der maskuline Artikel: <strong>der &rarr; den</strong> / <strong>ein &rarr; einen</strong>. Feminin, Neutral und Plural bleiben unverändert (die, das, die)!</p>
          </div>
        `,
        exercises: [
          {
            id: 'a1_p18_ex1',
            title: 'Übung 1: Nomen und Artikel im Akkusativ (den / die / das)',
            instruction: 'Setzen Sie den bestimmten Artikel im Akkusativ ein.',
            items: [
              { id: 'akk_1', prefix: 'a) Ich suche ', suffix: ' Schlüssel (m).', answer: 'den', explanation: 'Schlüssel ist maskulin &rarr; im Akkusativ: den Schlüssel' },
              { id: 'akk_2', prefix: 'b) Peter kauft ', suffix: ' Tasche (f).', answer: 'die', explanation: 'Tasche ist feminin &rarr; im Akkusativ bleibt: die Tasche' },
              { id: 'akk_3', prefix: 'c) Wir nehmen ', suffix: ' Taxi (n).', answer: 'das', explanation: 'Taxi ist neutral &rarr; im Akkusativ bleibt: das Taxi' },
              { id: 'akk_4', prefix: 'd) Kennst du ', suffix: ' Mann dort drüben?', answer: 'den', explanation: 'Mann ist maskulin &rarr; Akkusativobjekt: den Mann' },
              { id: 'akk_5', prefix: 'e) Sie trinkt ', suffix: ' Kaffee (m) mit Milch.', answer: 'den', explanation: 'Kaffee ist maskulin &rarr; Akkusativ: den Kaffee' }
            ]
          }
        ]
      }
    },
    'A2': {
      3: {
        lessonTitle: 'Lektion 1: Kausale Nebensätze mit "weil" & Satzstellung',
        grammarSummary: `
          <div class="wb-rule-summary-box">
            <h4>📌 Grammatikregel: Nebensätze mit "weil"</h4>
            <p>Im Nebensatz mit <strong>weil</strong> wandert das konjugierte Verb an das absolute <strong>Satzende</strong>! Bei trennbaren Verben werden Präfix und Verb am Ende wieder zusammengezogen.</p>
            <p><em>Hauptsatz:</em> Monika spielt gut Tennis. <em>Nebensatz:</em> ..., <strong>weil</strong> sie viel <strong>trainiert</strong>.</p>
          </div>
        `,
        exercises: [
          {
            id: 'a2_p3_ex1',
            title: 'Übung 1: Nebensätze mit "weil" bilden',
            instruction: 'Verbinden Sie die Sätze mit "weil" (Verb ans Satzende!).',
            example: 'Max hat keine Zeit. &rarr; Max kommt nicht, weil er keine Zeit hat.',
            items: [
              { id: 'a2_1', prefix: 'a) Beate hat starke Kopfschmerzen. &rarr; Beate bleibt im Bett, weil sie starke Kopfschmerzen ', suffix: '.', answer: 'hat', explanation: 'Konjugiertes Verb "hat" wandert ans Satzende' },
              { id: 'a2_2', prefix: 'b) Er versteht uns nicht, weil er nie richtig ', suffix: ' (zuhören).', answer: 'zuhört', explanation: 'Trennbares Verb "zuhören" steht am Nebensatzende zusammen: zuhört' },
              { id: 'a2_3', prefix: 'c) Ich lerne Deutsch, weil ich in Deutschland ', suffix: ' möchte (arbeiten).', answer: 'arbeiten', explanation: 'Modalverb am Satzende: Infinitiv (arbeiten) + konjugiertes Modalverb (möchte)' },
              { id: 'a2_4', prefix: 'd) Wir bleiben zu Hause, weil das Wetter heute sehr schlecht ', suffix: '.', answer: 'ist', explanation: 'Verb "ist" steht am Satzende' },
              { id: 'a2_5', prefix: 'e) Lisa kauft das Auto nicht, weil es zu teuer ', suffix: '.', answer: 'ist', explanation: 'Kopulaverb "ist" am Satzende' }
            ]
          },
          {
            id: 'a2_p7_ex2',
            title: 'Übung 2: Wechselpräpositionen (Akkusativ vs. Dativ)',
            instruction: 'Entscheiden Sie: Wohin? (Richtung &rarr; Akkusativ) oder Wo? (Ort &rarr; Dativ).',
            items: [
              { id: 'wp_1', prefix: 'a) Ich lege das Buch auf ', suffix: ' Tisch (m, Akkusativ).', answer: 'den', explanation: 'Wohin lege ich es? &rarr; Akkusativ: auf den Tisch' },
              { id: 'wp_2', prefix: 'b) Das Buch liegt auf ', suffix: ' Tisch (m, Dativ).', answer: 'dem', explanation: 'Wo liegt es? &rarr; Dativ: auf dem Tisch' },
              { id: 'wp_3', prefix: 'c) Sie geht in ', suffix: ' Küche (f, Akkusativ).', answer: 'die', explanation: 'Wohin geht sie? &rarr; Akkusativ: in die Küche' },
              { id: 'wp_4', prefix: 'd) Sie kocht in ', suffix: ' Küche (f, Dativ).', answer: 'der', explanation: 'Wo kocht sie? &rarr; Dativ: in der Küche' }
            ]
          }
        ]
      }
    },
    'B1': {
      3: {
        lessonTitle: 'Lektion 1: Das Perfekt (haben vs. sein) & Partizip II',
        grammarSummary: `
          <div class="wb-rule-summary-box">
            <h4>📌 Grammatikregel: Perfektbildung</h4>
            <p><strong>sein + Partizip II:</strong> Bei Verben der Ortsveränderung (<em>gehen, fahren, fliegen</em>), Zustandsänderung (<em>aufwachen, sterben</em>) sowie <em>sein, bleiben, werden</em>.</p>
            <p><strong>haben + Partizip II:</strong> Bei allen transitiven Verben (mit Akkusativobjekt), reflexiven Verben und den meisten anderen Verben.</p>
          </div>
        `,
        exercises: [
          {
            id: 'b1_p3_ex1',
            title: 'Übung 1: Hilfsverb "haben" oder "sein"?',
            instruction: 'Setzen Sie das passende Hilfsverb im Präsens ein.',
            items: [
              { id: 'perf_1', prefix: 'a) Gestern ', suffix: ' ich mit dem Zug nach Berlin gefahren.', answer: 'bin', explanation: 'Ortsveränderung (fahren) &rarr; Hilfsverb sein: bin' },
              { id: 'perf_2', prefix: 'b) Paula ', suffix: ' ein köstliches Abendessen gekocht.', answer: 'hat', explanation: 'Transitives Verb (kochen) &rarr; Hilfsverb haben: hat' },
              { id: 'perf_3', prefix: 'c) Wir ', suffix: ' das ganze Wochenende zu Hause geblieben.', answer: 'sind', explanation: 'bleiben bildet Perfekt immer mit sein: sind' },
              { id: 'perf_4', prefix: 'd) Was ', suffix: ' du gestern Abend gemacht?', answer: 'hast', explanation: 'machen &rarr; Hilfsverb haben: hast' },
              { id: 'perf_5', prefix: 'e) Um wie viel Uhr ', suffix: ' der Zug angekommen?', answer: 'ist', explanation: 'ankommen (Ortswechsel) &rarr; Hilfsverb sein: ist' }
            ]
          }
        ]
      }
    },
    'B2': {
      3: {
        lessonTitle: 'Lektion 1: Nomen-Verb-Verbindungen & Feste Wendungen',
        grammarSummary: `
          <div class="wb-rule-summary-box">
            <h4>📌 Grammatikregel: Funktionsverbgefüge (FVG)</h4>
            <p>Im gehobenen Deutsch und in der Fachsprache werden einfache Verben durch feste Fügungen aus Nomen und Funktionsverb ersetzt.</p>
          </div>
        `,
        exercises: [
          {
            id: 'b2_p1_ex1',
            title: 'Übung 1: Passendes Funktionsverb ergänzen',
            instruction: 'Ergänzen Sie das richtige Funktionsverb.',
            items: [
              { id: 'fvg_1', prefix: 'a) Wir müssen zeitnah eine Entscheidung ', suffix: ' (entscheiden).', answer: 'treffen', explanation: 'eine Entscheidung treffen = entscheiden' },
              { id: 'fvg_2', prefix: 'b) Der Dozent stellt die Unterlagen zur Verfügung ', suffix: ' (bereitstellen).', answer: 'stellen', explanation: 'zur Verfügung stellen = anbieten/bereitstellen' },
              { id: 'fvg_3', prefix: 'c) Dieses Projekt kommt für uns leider nicht in ', suffix: ' (möglich sein).', answer: 'Frage', explanation: 'in Frage kommen = möglich/akzeptabel sein' },
              { id: 'fvg_4', prefix: 'd) Die Studierenden haben Kritik an dem Plan ', suffix: ' (kritisieren).', answer: 'geübt', explanation: 'Kritik üben an = kritisieren' }
            ]
          }
        ]
      }
    },
    'C1': {
      3: {
        lessonTitle: 'Lektion 1: Nominalisierung & Verbalisierung',
        grammarSummary: `
          <div class="wb-rule-summary-box">
            <h4>📌 Grammatikregel: Nominalstil vs. Verbalstil</h4>
            <p>Im Nominalstil werden verbale Handlungen in Substantive mit passenden Präpositionen umgewandelt (z.B. <em>als die Sonne aufging &rarr; bei Sonnenaufgang</em>).</p>
          </div>
        `,
        exercises: [
          {
            id: 'c1_p1_ex1',
            title: 'Übung 1: Umformung in den Nominalstil',
            instruction: 'Ergänzen Sie die passende Präposition oder das Nomen.',
            items: [
              { id: 'nom_1', prefix: 'a) Bevor das Projekt begann &rarr; Vor ', suffix: ' des Projekts.', answer: 'Beginn', explanation: 'beginnen &rarr; vor Beginn (+ Genitiv)' },
              { id: 'nom_2', prefix: 'b) Weil es stark regnete &rarr; ', suffix: ' starken Regens.', answer: 'Wegen', alternatives: ['Aufgrund'], explanation: 'Kausal &rarr; wegen / aufgrund (+ Genitiv)' },
              { id: 'nom_3', prefix: 'c) Nachdem die Konferenz beendet war &rarr; Nach ', suffix: ' der Konferenz.', answer: 'Beendigung', alternatives: ['Abschluss', 'Ende'], explanation: 'nach Beendigung / nach dem Ende' }
            ]
          }
        ]
      }
    }
  };

  WorkbookEngine.getPreloadedLesson = function(level, page) {
    if (!level) level = 'A1';
    page = parseInt(page, 10) || 1;

    if (PRELOADED_LESSONS[level] && PRELOADED_LESSONS[level][page]) {
      return PRELOADED_LESSONS[level][page];
    }
    return null;
  };

  // --------------------------------------------------------------------------
  // 3. Dynamic Parser & Auto-Answer Generator for Raw Text
  // --------------------------------------------------------------------------

  WorkbookEngine.parseAndGenerateWorksheet = function(rawText, titleOverride, levelKey, page) {
    if (!rawText || !rawText.trim()) {
      return {
        lessonTitle: titleOverride || 'Leere Übungsseite',
        grammarSummary: '<p style="color: var(--text-muted);">Kein Text zum Laden vorhanden.</p>',
        exercises: []
      };
    }

    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const exercises = [];
    let currentEx = null;
    let mainTitle = titleOverride || '';
    let grammarRules = [];
    let generalNotes = [];
    const idPrefix = (levelKey && page) ? `${levelKey.toLowerCase()}_p${page}_` : 'dyn_';

    const exHeaderPattern = /^(Übung|Aufgabe|Exercise)\s*(\d+|[A-Z])?:?\s*(.*)/i;
    const examplePattern = /^(Beispiel|Bsp\.|Example):?\s*(.*)/i;
    const itemPattern = /^([a-z0-9]+[\.\)])\s*(.*)/i;
    const gapPattern = /_{2,}|\.{3,}|\[_{2,}\]/g;

    lines.forEach((line) => {
      if (!mainTitle && /^(Grammatik|Lektion|\d+\.\d+|Deutsch)/i.test(line)) {
        mainTitle = line;
        return;
      }

      const exMatch = line.match(exHeaderPattern);
      if (exMatch) {
        if (currentEx && currentEx.items.length > 0) {
          exercises.push(currentEx);
        }
        currentEx = {
          id: `${idPrefix}ex_${exercises.length + 1}`,
          title: line,
          instruction: 'Ergänzen Sie die Lücken mit der passenden deutschen Form.',
          wordBank: [],
          example: '',
          items: []
        };
        return;
      }

      if (!currentEx) {
        if (line.includes('>') || line.includes('&rarr;') || line.includes(':') || line.includes('-e') || line.includes('-st')) {
          grammarRules.push(line);
        } else {
          generalNotes.push(line);
        }
        return;
      }

      const exampleMatch = line.match(examplePattern);
      if (exampleMatch) {
        currentEx.example = line;
        return;
      }

      if (!itemPattern.test(line) && line.split(/\s+/).length >= 4 && !line.includes('___') && !line.includes('.')) {
        const words = line.split(/\s+/).map(w => w.replace(/[,\/]/g, '').trim()).filter(w => w.length > 1);
        if (words.length >= 3) {
          currentEx.wordBank = words;
          return;
        }
      }

      const itemMatch = line.match(itemPattern);
      const hasGap = gapPattern.test(line) || line.includes('komm___') || line.includes('wohn___') || line.includes('kauf___') || line.includes('trink___') || line.includes('red___');

      if (itemMatch || hasGap) {
        const itemLabel = itemMatch ? itemMatch[1] : `${currentEx.items.length + 1}.`;
        const itemContent = itemMatch ? itemMatch[2] : line;

        let prefix = itemLabel + ' ';
        let suffix = '';
        let generatedAnswer = '';
        let explanation = '';
        let alternatives = [];

        const stemEndingMatch = itemContent.match(/(\b[a-zA-ZäöüÄÖÜß]+)___+(.*)/);
        if (stemEndingMatch) {
          const stem = stemEndingMatch[1];
          suffix = stemEndingMatch[2];
          prefix += itemContent.slice(0, stemEndingMatch.index + stem.length);

          const person = WorkbookEngine.detectPerson(prefix);
          generatedAnswer = WorkbookEngine.getVerbEnding(stem, person);
          explanation = `Subjekt (${person}) &rarr; Endung -${generatedAnswer}`;
        } else {
          const parts = itemContent.split(gapPattern);
          if (parts.length > 1) {
            prefix += parts[0];
            suffix = parts.slice(1).join(' ');

            const solved = WorkbookEngine.solveSentenceContext(prefix, suffix, currentEx.wordBank);
            generatedAnswer = solved.answer;
            explanation = solved.explanation;
            alternatives = solved.alternatives || [];
          } else {
            prefix += itemContent;
            generatedAnswer = itemContent;
            explanation = 'Vollständiger Beispielsatz zum Üben.';
          }
        }

        currentEx.items.push({
          id: `${currentEx.id}_item_${currentEx.items.length + 1}`,
          prefix: prefix,
          suffix: suffix,
          answer: generatedAnswer || '?',
          alternatives: alternatives,
          explanation: explanation || 'Grammatische Ergänzung'
        });
        return;
      }

      if (line.length < 80 && !currentEx.instructionUpdated) {
        currentEx.instruction = line;
        currentEx.instructionUpdated = true;
      }
    });

    if (currentEx && currentEx.items.length > 0) {
      exercises.push(currentEx);
    }

    if (exercises.length === 0 && lines.length > 0) {
      const fallbackItems = lines.map((l, idx) => {
        return {
          id: `${idPrefix}line_${idx + 1}`,
          prefix: `${idx + 1}. `,
          suffix: '',
          answer: l,
          explanation: 'Originaler deutscher Beispielsatz'
        };
      });
      exercises.push({
        id: `${idPrefix}ex_custom`,
        title: 'Übungs- und Beispielsätze',
        instruction: 'Lesen, bearbeiten und überprüfen Sie die deutschen Sätze.',
        items: fallbackItems
      });
    }

    let summaryHtml = '';
    if (grammarRules.length > 0 || generalNotes.length > 0) {
      summaryHtml = `
        <div class="wb-rule-summary-box">
          <h4>📌 Übersicht & Regeln aus dieser Lektion</h4>
          ${grammarRules.length > 0 ? `
            <div class="wb-rule-grid">
              ${grammarRules.slice(0, 6).map(r => `<div class="wb-rule-col">${WorkbookEngine.escapeHtml(r)}</div>`).join('')}
            </div>
          ` : ''}
          ${generalNotes.length > 0 ? `
            <p style="margin-top: 0.5rem; font-size: 0.88rem; color: var(--text-secondary);">
              ${generalNotes.slice(0, 3).map(n => WorkbookEngine.escapeHtml(n)).join(' · ')}
            </p>
          ` : ''}
        </div>
      `;
    }

    return {
      lessonTitle: mainTitle || 'Arbeitsblatt-Übung',
      grammarSummary: summaryHtml,
      exercises: exercises
    };
  };

  WorkbookEngine.solveSentenceContext = function(prefix, suffix, wordBank) {
    const full = (prefix + ' ' + suffix).toLowerCase();
    const person = WorkbookEngine.detectPerson(prefix);

    if (wordBank && wordBank.length > 0) {
      for (let i = 0; i < wordBank.length; i++) {
        const w = wordBank[i].toLowerCase();
        const ending = WorkbookEngine.getVerbEnding(w, person);
        if (w.endsWith(ending) || (person === '1s' && w.endsWith('e')) || (person === '2s' && w.endsWith('st'))) {
          if (full.includes('musik') && (w === 'hört' || w === 'macht')) return { answer: w, explanation: `Passendes Verb zu "Musik" (${person})` };
          if (full.includes('passau') || full.includes('wien') || full.includes('berlin')) {
            if (w.includes('wohn') || w.includes('leb') || w.includes('studier')) return { answer: w, explanation: `Ortsangabe &rarr; ${w}` };
          }
          if (full.includes('pause') && w.includes('mach')) return { answer: w, explanation: 'eine Pause machen' };
          if (full.includes('nach hause') && w.includes('geh')) return { answer: w, explanation: 'nach Hause gehen' };
          if (full.includes('deutsch') && w.includes('lern')) return { answer: w, explanation: 'Deutsch lernen' };
          if (full.includes('eis') && (w.includes('kauf') || w.includes('iss') || w.includes('ess'))) return { answer: w, explanation: `ein Eis ${w}` };
          if (full.includes('saft') && (w.includes('trink') || w.includes('kauf'))) return { answer: w, explanation: `Saft ${w}` };
        }
      }
      return { answer: wordBank[0], explanation: 'Aus dem Kasten ausgewählt.' };
    }

    if (full.includes('den') || full.includes('dem') || full.includes('die') || full.includes('das')) {
      if (full.includes('schlüssel') || full.includes('kaffee') || full.includes('tisch')) return { answer: 'den', alternatives: ['einen'], explanation: 'Maskulin Akkusativ: den / einen' };
      if (full.includes('tasche') || full.includes('lampe') || full.includes('küche')) return { answer: 'die', alternatives: ['eine'], explanation: 'Feminin: die / eine' };
      if (full.includes('auto') || full.includes('buch') || full.includes('taxi')) return { answer: 'das', alternatives: ['ein'], explanation: 'Neutral: das / ein' };
    }

    const commonVerbs = ['kommen', 'wohnen', 'kaufen', 'trinken', 'arbeiten', 'gehen', 'lernen', 'haben', 'sein'];
    for (const v of commonVerbs) {
      if (full.includes(v.slice(0, -2))) {
        const conj = WorkbookEngine.conjugateVerb(v, person);
        return { answer: conj, explanation: `Konjugation von "${v}" für ${person}` };
      }
    }

    return { answer: 'richtig', explanation: 'Passendes Wort laut Kontext.' };
  };

  // --------------------------------------------------------------------------
  // 4. Validation, Scoring & Normalization
  // --------------------------------------------------------------------------

  WorkbookEngine.normalizeText = function(str) {
    if (!str) return '';
    return str
      .trim()
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s+/g, ' ');
  };

  WorkbookEngine.isAnswerCorrect = function(userInput, expected, alternatives) {
    const userNorm = WorkbookEngine.normalizeText(userInput);
    if (!userNorm) return false;

    const expNorm = WorkbookEngine.normalizeText(expected);
    if (userNorm === expNorm) return true;

    if (Array.isArray(alternatives)) {
      for (const alt of alternatives) {
        if (userNorm === WorkbookEngine.normalizeText(alt)) return true;
      }
    }

    const normalizeUmlauts = (s) => s.replace(/ae/g, 'ä').replace(/oe/g, 'ö').replace(/ue/g, 'ü').replace(/ss/g, 'ß');
    if (normalizeUmlauts(userNorm) === normalizeUmlauts(expNorm)) return true;

    return false;
  };

  WorkbookEngine.evaluateWorksheet = function(exercises, userInputs) {
    let total = 0;
    let correct = 0;
    let unanswered = 0;
    const results = {};

    exercises.forEach(ex => {
      ex.items.forEach(item => {
        total++;
        const userVal = (userInputs && userInputs[item.id]) ? userInputs[item.id] : '';
        if (!userVal.trim()) {
          unanswered++;
          results[item.id] = { status: 'unanswered', userValue: '', expected: item.answer, explanation: item.explanation };
        } else if (WorkbookEngine.isAnswerCorrect(userVal, item.answer, item.alternatives)) {
          correct++;
          results[item.id] = { status: 'correct', userValue: userVal, expected: item.answer, explanation: item.explanation };
        } else {
          results[item.id] = { status: 'incorrect', userValue: userVal, expected: item.answer, explanation: item.explanation };
        }
      });
    });

    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      total,
      correct,
      incorrect: total - correct - unanswered,
      unanswered,
      scorePercent: percent,
      results
    };
  };

  // --------------------------------------------------------------------------
  // 5. Storage Persistence
  // --------------------------------------------------------------------------

  WorkbookEngine.saveUserProgress = function(level, page, answers) {
    try {
      const key = `dl_wb_answers_${level}_${page}`;
      localStorage.setItem(key, JSON.stringify(answers));
      return true;
    } catch (e) {
      console.warn('Could not save workbook answers:', e);
      return false;
    }
  };

  WorkbookEngine.loadUserProgress = function(level, page) {
    try {
      const key = `dl_wb_answers_${level}_${page}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  };

  WorkbookEngine.clearUserProgress = function(level, page) {
    try {
      const key = `dl_wb_answers_${level}_${page}`;
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  };

  WorkbookEngine.escapeHtml = function(text) {
    if (!text) return '';
    return text.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  window.WorkbookEngine = WorkbookEngine;

})(window);
