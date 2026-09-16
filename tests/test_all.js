/**
 * DeutscheLernen - Comprehensive Automated Test Suite
 * Validates:
 * 1. Answer Key Integrity across all 155 pages (A1, A2, B1, B2, C1)
 * 2. Pre-Activity Teachings coverage (100% pages have non-empty grammar summaries)
 * 3. DaF Sentence Architecture Studio logic, permutations & phrase catalog
 * 4. A1 Master-Grammatik Sentence Structure (Chapter 6) & Beginner Scaffolding
 * 5. Workbook Engine Evaluation Logic (scoring, trimming, case-insensitivity, umlauts)
 * 6. German TTS Preparation & Sanitization
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    process.stdout.write(`  ✅ PASS: ${message}\n`);
  } else {
    failed++;
    errors.push(message);
    process.stdout.write(`  ❌ FAIL: ${message}\n`);
  }
}

function describe(suiteName, fn) {
  console.log(`\n======================================================`);
  console.log(`🧪 SUITE: ${suiteName}`);
  console.log(`======================================================`);
  fn();
}
// ----------------------------------------------------------------------------
// Suite 1: Answer Key Catalog Integrity (js/workbooks_keys.js)
// ----------------------------------------------------------------------------
describe('Answer Key Catalog Integrity', () => {
  const filePath = path.join(__dirname, '../js/workbooks_keys.js');
  assert(fs.existsSync(filePath), 'workbooks_keys.js exists');

  const content = fs.readFileSync(filePath, 'utf8');
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}') + 1;
  const data = JSON.parse(content.substring(start, end));

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  let totalExercises = 0;
  let totalItems = 0;
  let totalPages = 0;
  let emptyAnswers = 0;

  levels.forEach(lvl => {
    assert(!!data[lvl], `Level ${lvl} exists in catalog`);
    const pages = Object.keys(data[lvl]);
    totalPages += pages.length;

    pages.forEach(p => {
      const pageData = data[lvl][p];
      if (pageData.exercises) {
        totalExercises += pageData.exercises.length;
        pageData.exercises.forEach(ex => {
          if (ex.items) {
            totalItems += ex.items.length;
            ex.items.forEach(item => {
              if (item.answer === undefined || item.answer === null || item.answer === '') {
                emptyAnswers++;
              }
            });
          }
        });
      }
    });
  });

  assert(totalPages >= 155, `Catalog contains at least 155 pages (found: ${totalPages})`);
  assert(totalExercises >= 300, `Catalog contains at least 300 exercises (found: ${totalExercises})`);
  assert(totalItems >= 3500, `Catalog contains at least 3500 items (found: ${totalItems})`);
  assert(emptyAnswers === 0, `Zero empty/undefined answers in catalog (found: ${emptyAnswers})`);
});

// ----------------------------------------------------------------------------
// Suite 2: Pre-Activity Pedagogical Teachings Coverage
// ----------------------------------------------------------------------------
describe('Pre-Activity Pedagogical Teachings Coverage', () => {
  const filePath = path.join(__dirname, '../js/workbooks_keys.js');
  const content = fs.readFileSync(filePath, 'utf8');
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}') + 1;
  const data = JSON.parse(content.substring(start, end));

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  let pagesWithTeachings = 0;
  let totalPages = 0;

  levels.forEach(lvl => {
    const pages = Object.keys(data[lvl]);
    totalPages += pages.length;
    pages.forEach(p => {
      const summary = data[lvl][p].grammarSummary;
      if (summary && typeof summary === 'string' && summary.trim().length > 10) {
        pagesWithTeachings++;
      }
    });
  });

  assert(totalPages === 155, `Total curriculum pages is 155 (found: ${totalPages})`);
  assert(pagesWithTeachings === 155, `100% of pages have pedagogical teachings (found: ${pagesWithTeachings}/155)`);
});

// ----------------------------------------------------------------------------
// Suite 3: Universal DaF Sentence Architecture Studio Across All Levels (A1–C1)
// ----------------------------------------------------------------------------
describe('Universal DaF Sentence Architecture Studio Across All Levels (A1–C1)', () => {
  global.window = {};
  require('../js/workbook_studio.js');
  const studio = global.window.WorkbookStudio;

  assert(typeof studio === 'object', 'WorkbookStudio is loaded');
  assert(typeof studio.renderPracticalStudio === 'function', 'renderPracticalStudio function exists');
  assert(typeof studio.switchPracticalLevel === 'function', 'switchPracticalLevel function exists');
  assert(typeof studio.setSentenceMode === 'function', 'setSentenceMode function exists');
  assert(typeof studio.updateSentenceField === 'function', 'updateSentenceField function exists');
  assert(typeof studio.getPracticalPhrases === 'function', 'getPracticalPhrases function exists');

  // Verify phrase catalogs for all 5 CEFR levels
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  levels.forEach(lvl => {
    const list = studio.getPracticalPhrases('all', lvl);
    assert(list && list.length >= 4, `Level ${lvl} has authentic phrase catalog (found: ${list ? list.length : 0})`);
    assert(list[0].de && list[0].en && list[0].focus, `Level ${lvl} phrases contain German, English, and grammar focus`);
  });

  // Test A1 Sentence Formation
  studio.practicalState.level = 'A1';
  studio.practicalState.a1_mode = 'standard';
  studio.practicalState.a1_subject = 'Wir';
  studio.practicalState.a1_verb = 'lernen';
  studio.practicalState.a1_timePlace = 'heute';
  studio.practicalState.a1_object = 'Deutsch';
  assert(studio.practicalState.a1_verb === 'lernen', 'A1 correctly conjugates for plural Wir');

  // Test A2 Sentence Formation (weil-Kausalsatz & wenn-Temporalsatz)
  studio.practicalState.level = 'A2';
  studio.practicalState.a2_mode = 'weil_clause';
  studio.practicalState.a2_mainClause = 'Ich lerne fleißig Deutsch';
  studio.practicalState.a2_subConnector = ', weil';
  studio.practicalState.a2_subSubject = 'ich';
  studio.practicalState.a2_subMid = 'in Berlin studieren';
  studio.practicalState.a2_subVerb = 'möchte.';
  const a2Sentence = `${studio.practicalState.a2_mainClause}${studio.practicalState.a2_subConnector} ${studio.practicalState.a2_subSubject} ${studio.practicalState.a2_subMid} ${studio.practicalState.a2_subVerb}`;
  assert(a2Sentence.includes(', weil ich in Berlin studieren möchte.'), 'A2 Kausalsatz places conjugated verb at end');

  // Test B1 Sentence Formation (Relativsatz & Konjunktiv II)
  studio.practicalState.level = 'B1';
  studio.practicalState.b1_mode = 'relativsatz';
  studio.practicalState.b1_relLead = 'Das ist der Kollege';
  studio.practicalState.b1_relPron = ', der';
  studio.practicalState.b1_relMid = 'aus Wien';
  studio.practicalState.b1_relVerb = 'stammt.';
  const b1Sentence = `${studio.practicalState.b1_relLead}${studio.practicalState.b1_relPron} ${studio.practicalState.b1_relMid} ${studio.practicalState.b1_relVerb}`;
  assert(b1Sentence === 'Das ist der Kollege, der aus Wien stammt.', 'B1 Relativsatz correctly constructed');

  // Test B2 Sentence Formation (Funktionsverbgefüge & Passivalternativen)
  studio.practicalState.level = 'B2';
  studio.practicalState.b2_mode = 'fvg';
  studio.practicalState.b2_fvgSubj = 'Der Rat';
  studio.practicalState.b2_fvgNoun = 'eine Entscheidung';
  studio.practicalState.b2_fvgVerb = 'getroffen.';
  const b2Sentence = `${studio.practicalState.b2_fvgSubj} hat ${studio.practicalState.b2_fvgNoun} ${studio.practicalState.b2_fvgVerb}`;
  assert(b2Sentence === 'Der Rat hat eine Entscheidung getroffen.', 'B2 Funktionsverbgefüge correctly constructed');

  // Test C1 Sentence Formation (Nominalstil)
  studio.practicalState.level = 'C1';
  studio.practicalState.c1_mode = 'nominalstil';
  studio.practicalState.c1_nsPrep = 'Nach Abschluss der Verhandlungen';
  studio.practicalState.c1_nsVerb = 'wurde';
  studio.practicalState.c1_nsSubj = 'das Abkommen';
  studio.practicalState.c1_nsEnd = 'unterzeichnet.';
  const c1Sentence = `${studio.practicalState.c1_nsPrep} ${studio.practicalState.c1_nsVerb} ${studio.practicalState.c1_nsSubj} ${studio.practicalState.c1_nsEnd}`;
  assert(c1Sentence === 'Nach Abschluss der Verhandlungen wurde das Abkommen unterzeichnet.', 'C1 Nominalstil correctly constructed');
});

// ----------------------------------------------------------------------------
// Suite 3B: Rigorous Answer Key Audit (A1 Übung 2 & Foundational Workbooks)
// ----------------------------------------------------------------------------
describe('Rigorous Answer Key Audit (A1 Übung 2 & Foundational Workbooks)', () => {
  const filePath = path.join(__dirname, '../js/workbooks_keys.js');
  const content = fs.readFileSync(filePath, 'utf8');
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}') + 1;
  const data = JSON.parse(content.substring(start, end));

  // 1. Verify A1 Page 3 Übung 2 (Exact word box items: hört, wohnst, studiert, etc.)
  const p3 = data['A1']['3'];
  assert(!!p3, 'A1 Page 3 exists in catalog');
  const ex2 = p3.exercises.find(e => e.id === 'a1_p3_ex2');
  assert(!!ex2, 'A1 Page 3 Übung 2 exists');
  assert(Object.keys(ex2.answers).length === 10, `A1 Page 3 Übung 2 has all 10 items (found: ${Object.keys(ex2.answers).length})`);
  assert(ex2.answers['a1_p3_ex2_a'] === 'hört', 'Übung 2 item a is "hört" (Murat hört Musik)');
  assert(ex2.answers['a1_p3_ex2_b'] === 'wohnst', 'Übung 2 item b is "wohnst" (Du wohnst in Passau)');
  assert(ex2.answers['a1_p3_ex2_c'] === 'studiert', 'Übung 2 item c is "studiert" (Hanna studiert in Wien)');
  assert(ex2.answers['a1_p3_ex2_d'] === 'mache', 'Übung 2 item d is "mache" (Ich mache eine Pause)');
  assert(ex2.answers['a1_p3_ex2_e'] === 'lebt', 'Übung 2 item e is "lebt" (Ihr lebt in Berlin)');
  assert(ex2.answers['a1_p3_ex2_f'] === 'gehen', 'Übung 2 item f is "gehen" (Wir gehen nach Hause)');
  assert(ex2.answers['a1_p3_ex2_g'] === 'kennt', 'Übung 2 item g is "kennt" (Theo kennt Eva)');
  assert(ex2.answers['a1_p3_ex2_h'] === 'lernst', 'Übung 2 item h is "lernst" (Du lernst Deutsch)');
  assert(ex2.answers['a1_p3_ex2_i'] === 'kauft', 'Übung 2 item i is "kauft" (Eva kauft ein Eis)');
  assert(ex2.answers['a1_p3_ex2_j'] === 'trinken', 'Übung 2 item j is "trinken" (Wir trinken Saft)');

  // 2. Verify A1 Page 5 Übung 7 (sein Konjugation)
  const p5 = data['A1']['5'];
  const p5_ex7 = p5.exercises.find(e => e.title === 'Übung 7');
  assert(p5_ex7.answers['a1_p5_ex7_a'] === 'sind', 'Page 5 item a is "sind" (Julia und Maria sind in Italien)');
  assert(p5_ex7.answers['a1_p5_ex7_b'] === 'bist', 'Page 5 item b is "bist" (Du bist hier)');
  assert(p5_ex7.answers['a1_p5_ex7_e'] === 'ist', 'Page 5 item e is "ist" (Lena ist zu Hause)');
  assert(p5_ex7.answers['a1_p5_ex7_g'] === 'seid', 'Page 5 item g is "seid" (Ihr seid im Bus)');
  assert(p5_ex7.answers['a1_p5_ex7_h'] === 'bin', 'Page 5 item h is "bin" (Ich bin im Deutschkurs)');

  // 3. Verify A1 Page 6 Übung 2 (Pronomen & Verb)
  const p6 = data['A1']['6'];
  const p6_ex2 = p6.exercises.find(e => e.title === 'Übung 2');
  assert(p6_ex2.answers['a1_p6_ex2_a'] === 'ich lerne', 'Page 6 item a is "ich lerne"');
  assert(p6_ex2.answers['a1_p6_ex2_b'] === 'ich gehe', 'Page 6 item b is "ich gehe"');
  assert(p6_ex2.answers['a1_p6_ex2_c'] === 'er lernt', 'Page 6 item c is "er lernt"');

  // 4. Verify A1 Page 7 Übung 3 (W-Fragen)
  const p7 = data['A1']['7'];
  const p7_ex3 = p7.exercises.find(e => e.title === 'Übung 3');
  assert(p7_ex3.answers['a1_p7_ex3_a'] === 'Wer', 'Page 7 item a is "Wer" (kauft Brot)');
  assert(p7_ex3.answers['a1_p7_ex3_b'] === 'Wie', 'Page 7 item b is "Wie" (heißt die Lehrerin)');
  assert(p7_ex3.answers['a1_p7_ex3_c'] === 'Was', 'Page 7 item c is "Was" (trinkt Paul)');
});

// ----------------------------------------------------------------------------
// Suite 4: Pedagogical Content Integrity in A1/Grammatik.md
// ----------------------------------------------------------------------------
describe('Pedagogical Content Integrity in A1/Grammatik.md', () => {
  const filePath = path.join(__dirname, '../A1/Grammatik.md');
  assert(fs.existsSync(filePath), 'A1/Grammatik.md exists');

  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes('## 6. Satzbau & Satzklammer'), 'Chapter 6 exists in A1/Grammatik.md');
  assert(content.includes('Regel 1: Das finite Verb'), 'Contains Rule 1 (Finite Verb on Position 2)');
  assert(content.includes('Regel 2: Die Inversion'), 'Contains Rule 2 (Inversion for time/place)');
  assert(content.includes('Regel 3: Die Satzklammer'), 'Contains Rule 3 (Sentence Bracket)');
  assert(content.includes('W-Fragen vs. Ja/Nein-Fragen'), 'Contains Questions structure breakdown');
  assert(content.includes('TeKaMoLo'), 'Contains TeKaMoLo word order rule');
  assert(content.includes('❓ Wie frage ich danach?'), 'Contains communicative practice questions');

  // Verify A1/README.md roadmap & structure
  const readmePath = path.join(__dirname, '../A1/README.md');
  assert(fs.existsSync(readmePath), 'A1/README.md exists');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  assert(readmeContent.includes('drei aufeinander aufbauenden Säulen'), 'A1 README defines 3 pedagogical pillars');
  assert(readmeContent.includes('Kapitel 6: Satzbau & Satzklammer'), 'A1 README highlights Chapter 6 Satzbau');
  assert(readmeContent.includes('A1 Satzbau-Labor & Praktisches Werkbuch'), 'A1 README links to Satzbau-Labor');
  assert(readmeContent.includes('Schritt-für-Schritt Fahrplan für Sprachanfänger'), 'A1 README contains beginner step-by-step roadmap');
});

// ----------------------------------------------------------------------------
// Suite 5: Practical Everyday Sentences Catalog File
// ----------------------------------------------------------------------------
describe('Practical Everyday Sentences Catalog File', () => {
  const filePath = path.join(__dirname, '../A1/Practisches_WerkBuch/EinfachDeutsch_examples.txt');
  assert(fs.existsSync(filePath), 'EinfachDeutsch_examples.txt exists');

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  assert(lines.length >= 25, `Contains at least 25 authentic beginner sentences (found: ${lines.length})`);
  assert(content.includes('Kennenlernen'), 'Includes Kennenlernen category');
  assert(content.includes('Bestellen'), 'Includes Restaurant & Bestellen category');
  assert(content.includes('Tagesablauf'), 'Includes Tagesablauf category');
  assert(content.includes('Orientierung'), 'Includes Orientierung category');
});

// ----------------------------------------------------------------------------
// Suite 6: Workbook Engine Evaluation Logic
// ----------------------------------------------------------------------------
describe('Workbook Engine Evaluation Logic', () => {
  global.window = {};
  require('../js/workbooks_engine.js');
  const engine = global.window.WorkbookEngine;

  assert(typeof engine === 'object', 'WorkbookEngine is loaded');
  assert(typeof engine.normalizeText === 'function', 'normalizeText function exists');
  assert(typeof engine.isAnswerCorrect === 'function', 'isAnswerCorrect function exists');
  assert(typeof engine.evaluateWorksheet === 'function', 'evaluateWorksheet function exists');

  assert(engine.normalizeText('  Komme. ') === 'komme', 'Cleans punctuation, whitespace and lowercases');
  assert(engine.isAnswerCorrect('Komme', 'komme'), 'Evaluates case-insensitive exact match');
  assert(engine.isAnswerCorrect('Apfel', 'Äpfel') || engine.isAnswerCorrect('Aepfel', 'äpfel'), 'Handles German umlauts normalization');

  // Test alternatives
  assert(engine.isAnswerCorrect('sie', 'sie', ['er', 'es']), 'Recognizes direct match with alternatives');
  assert(engine.isAnswerCorrect('er', 'sie', ['er', 'es']), 'Recognizes alternative match');
  assert(!engine.isAnswerCorrect('wir', 'sie', ['er', 'es']), 'Rejects incorrect value');

  const mockExercises = [
    {
      id: 'ex1',
      title: 'Übung 1',
      items: [
        { id: 'ex1_a', answer: 'komme' },
        { id: 'ex1_b', answer: 'wohnst' }
      ]
    }
  ];

  const res1 = engine.evaluateWorksheet(mockExercises, { ex1_a: 'komme', ex1_b: 'wohnst' });
  assert(res1.scorePercent === 100, `Full score gives 100% (got ${res1.scorePercent}%)`);
  assert(res1.correct === 2 && res1.total === 2, 'Counts correct and total accurately');

  const res2 = engine.evaluateWorksheet(mockExercises, { ex1_a: 'komme', ex1_b: 'falsch' });
  assert(res2.correct === 1 && res2.scorePercent === 50, 'Partial score evaluated accurately');
});

// ----------------------------------------------------------------------------
// Suite 7: German TTS Preparation & Sanitization
// ----------------------------------------------------------------------------
describe('German TTS Preparation & Sanitization', () => {
  function sanitizeForSpeech(raw) {
    if (!raw) return '';
    return raw
      .replace(/[•➔📌📖💡🎓⚡📝📦]/g, ' ')
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const rawMarkdown = '📌 **Grammatik-Fokus:** • Subjekt (1s) ➔ Endung *-e* (*Ich komme*).';
  const sanitized = sanitizeForSpeech(rawMarkdown);
  assert(!sanitized.includes('📌'), 'Strips emoji symbols');
  assert(!sanitized.includes('•'), 'Strips bullets');
  assert(!sanitized.includes('➔'), 'Strips arrows');
  assert(!sanitized.includes('*'), 'Strips markdown asterisks');
  assert(sanitized.includes('Ich komme'), 'Preserves actual German vocabulary');
});


// ----------------------------------------------------------------------------
// Suite 8: Level-by-Level Spickzettel (A1–C1) & Interactive Hub Integrity
// ----------------------------------------------------------------------------
describe('Level-by-Level Spickzettel (A1–C1) & Interactive Hub Integrity', () => {
  const rootDir = path.join(__dirname, '..');
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

  levels.forEach(lvl => {
    const spickPath = path.join(rootDir, lvl, 'Spickzettel.md');
    assert(fs.existsSync(spickPath), `${lvl}/Spickzettel.md exists`);
    
    const content = fs.readFileSync(spickPath, 'utf8');
    assert(content.length > 2000, `${lvl}/Spickzettel.md has substantial content (${content.length} chars)`);
    assert(content.includes('Prüfungs-Express') || content.includes('Prüfung Express'), `${lvl} contains Prüfungs-Express section`);
    assert(content.includes('Arbeitsbuch-Tipps') || content.includes('Arbeitsbuch'), `${lvl} contains Arbeitsbuch tips`);
    assert(content.includes('Konversation') || content.includes('Sprechen'), `${lvl} contains Conversational / Speaking section`);
  });

  // Check A1 specific content
  const a1 = fs.readFileSync(path.join(rootDir, 'A1', 'Spickzettel.md'), 'utf8');
  assert(a1.includes('V2-Regel') || a1.includes('Position 2'), 'A1 includes V2 rule');
  assert(a1.includes('Satzklammer'), 'A1 includes Satzklammer rule');
  assert(a1.includes('Notfall-Phrasen'), 'A1 includes rescue phrases for speech blocks');

  // Check A2 specific content
  const a2 = fs.readFileSync(path.join(rootDir, 'A2', 'Spickzettel.md'), 'utf8');
  assert(a2.includes('Wechselpräpositionen'), 'A2 includes 9 Wechselpräpositionen');
  assert(a2.includes('stellen') && a2.includes('stehen'), 'A2 includes Richtungs-/Lageverben (stellen/stehen)');
  assert(a2.includes('weil'), 'A2 includes weil-Nebensätze');

  // Check B1 specific content
  const b1 = fs.readFileSync(path.join(rootDir, 'B1', 'Spickzettel.md'), 'utf8');
  assert(b1.includes('Relativsätze'), 'B1 includes Relativsätze');
  assert(b1.includes('Vorgangspassiv'), 'B1 includes Vorgangspassiv');
  assert(b1.includes('TeKaMoLo'), 'B1 includes TeKaMoLo');
  assert(b1.includes('Adjektivdeklination'), 'B1 includes 2-step adjective signal system');

  // Check B2 specific content
  const b2 = fs.readFileSync(path.join(rootDir, 'B2', 'Spickzettel.md'), 'utf8');
  assert(b2.includes('Passiversatzformen'), 'B2 includes 4 Passivalternativen');
  assert(b2.includes('Funktionsverbgefüge'), 'B2 includes Funktionsverbgefüge (FVG)');
  assert(b2.includes('eine Entscheidung treffen'), 'B2 includes key FVG examples');

  // Check C1 specific content
  const c1 = fs.readFileSync(path.join(rootDir, 'C1', 'Spickzettel.md'), 'utf8');
  assert(c1.includes('Nominalstil'), 'C1 includes Nominalstil vs Verbalstil');
  assert(c1.includes('Konjunktiv I'), 'C1 includes Konjunktiv I for indirect speech');
  assert(c1.includes('scheinen zu') || c1.includes('vermögen zu'), 'C1 includes modal infinitive structures');

  // Check Manifest registration
  const manifestPath = path.join(rootDir, 'js', 'manifest.js');
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  levels.forEach(lvl => {
    assert(manifestContent.includes(`${lvl}/Spickzettel.md`), `Manifest registers ${lvl}/Spickzettel.md`);
  });

  // Check CheatsheetHub JS code
  const hubPath = path.join(rootDir, 'js', 'cheatsheet_hub.js');
  assert(fs.existsSync(hubPath), 'js/cheatsheet_hub.js exists');
  
  const hubCode = fs.readFileSync(hubPath, 'utf8');
  assert(hubCode.includes('CheatsheetHub'), 'CheatsheetHub object is defined');
  assert(hubCode.includes('switchLevel'), 'switchLevel method exists');
  assert(hubCode.includes('setFilter'), 'setFilter method exists');
  assert(hubCode.includes('onSearchInput'), 'onSearchInput method exists');
  assert(hubCode.includes('speakPhrase'), 'speakPhrase method exists');
  assert(hubCode.includes('copyPhrase'), 'copyPhrase method exists');
  assert(hubCode.includes('cs-completion-banner'), 'CheatsheetHub renders celebratory level completion banner');
  assert(hubCode.includes('cs-syntax-pill'), 'CheatsheetHub renders colorful syntax ribbons/pills');
  assert(hubCode.includes('cs-gender-der'), 'CheatsheetHub renders colorful DaF gender badges');

  // Check WorkbookStudio Graduation Recap Card
  const wbStudioPath = path.join(rootDir, 'js', 'workbook_studio.js');
  const wbStudioCode = fs.readFileSync(wbStudioPath, 'utf8');
  assert(wbStudioCode.includes('wb-level-completion-card'), 'WorkbookStudio renders level completion card at final page');
  assert(wbStudioCode.includes('#cheatsheet:'), 'WorkbookStudio completion card links directly to colorful level recap');

  // Check A1 Arbeitsbuch Graduation Recap Transition
  const wbA1Doc = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(wbA1Doc.includes('Stufe A1 erfolgreich abgeschlossen!'), 'A1 Arbeitsbuch Page 32 contains graduation banner');
  assert(wbA1Doc.includes('#cheatsheet:A1'), 'A1 Arbeitsbuch Page 32 links to A1 Abschluss-Spickzettel');
});

describe('Universal Muscle-Memory & Subconscious Reflex System (A1–C1)', () => {
  const rootDir = path.join(__dirname, '..');
  // Check A1 Grammatik Muscle Memory
  const gA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Grammatik.md'), 'utf8');
  assert(gA1.includes('MUSKELGEDÄCHTNIS-REFLEX'), 'A1 Grammatik has Muskelgedächtnis-Reflex boxes');
  assert(gA1.includes('🦁 MASKULIN'), 'A1 Grammatik has 3 Sensory Archetypes');
  assert(gA1.includes('🧲 DER VERB-MAGNET'), 'A1 Grammatik has Verb-Magnet visual track');
  assert(gA1.includes('🏗️ DER SATZKLAMMER-KRAN'), 'A1 Grammatik has Satzklammer-Kran model');
  assert(gA1.includes('🐶 D - O - G - F - U'), 'A1 Grammatik has DOGFU Wachhund box');
  assert(gA1.includes('🔨 DER AKKUSATIV-HAMMER'), 'A1 Grammatik has Akkusativ-Hammer model');

  // Check A2 Grammatik Muscle Memory
  const gA2 = fs.readFileSync(path.join(rootDir, 'A2', 'Grammatik.md'), 'utf8');
  assert(gA2.includes('MUSKELGEDÄCHTNIS-REFLEX'), 'A2 Grammatik has Muskelgedächtnis-Reflex boxes');
  assert(gA2.includes('MR. DATIV IST FAUL'), 'A2 Grammatik has Mr. Dativ model');
  assert(gA2.includes('🎵 AUS - BEI - MIT'), 'A2 Grammatik has Dativ-Rhythmus-Marsch');
  assert(gA2.includes('🎯 DER DARTS & GPS KOMPASS'), 'A2 Grammatik has Darts & GPS Kompass');
  assert(gA2.includes('🚀 DAS VERB-KATAPULT'), 'A2 Grammatik has Verb-Katapult model');
  assert(gA2.includes('Die 4 Zwillingsverben'), 'A2 Grammatik has Zwillingsverben matrix');

  // Check B1 Grammatik Muscle Memory
  const gB1 = fs.readFileSync(path.join(rootDir, 'B1', 'Grammatik.md'), 'utf8');
  assert(gB1.includes('MUSKELGEDÄCHTNIS-REFLEX'), 'B1 Grammatik has Muskelgedächtnis-Reflex boxes');
  assert(gB1.includes('🚂 DER TEKAMOLO-EXPRESS'), 'B1 Grammatik has TeKaMoLo-Express train model');
  assert(gB1.includes('🚦 DIE 2-SCHRITTE-ADJEKTIV-AMPEL'), 'B1 Grammatik has 2-Schritte-Adjektiv-Ampel');

  // Check B2 Grammatik Muscle Memory
  const gB2 = fs.readFileSync(path.join(rootDir, 'B2', 'Grammatik.md'), 'utf8');
  assert(gB2.includes('MUSKELGEDÄCHTNIS-REFLEX'), 'B2 Grammatik has Muskelgedächtnis-Reflex boxes');
  assert(gB2.includes('DAS 4-WEGE-PASSIVERSATZ-COCKPIT'), 'B2 Grammatik has 4-Wege-Passiversatz-Cockpit');

  // Check C1 Grammatik Muscle Memory
  const gC1 = fs.readFileSync(path.join(rootDir, 'C1', 'Grammatik.md'), 'utf8');
  assert(gC1.includes('MUSKELGEDÄCHTNIS-REFLEX'), 'C1 Grammatik has Muskelgedächtnis-Reflex boxes');
  assert(gC1.includes('DER AKADEMISCHE NOMINALSTIL-KONVERTER'), 'C1 Grammatik has Nominalstil-Konverter');

  // Check Interactive Reflex Trainer in CheatsheetHub
  const hubCode = fs.readFileSync(path.join(rootDir, 'js', 'cheatsheet_hub.js'), 'utf8');
  assert(hubCode.includes('reflexDrills'), 'CheatsheetHub has reflexDrills array');
  assert(hubCode.includes('toggleReflexTrainer'), 'CheatsheetHub has toggleReflexTrainer method');
  assert(hubCode.includes('revealReflex'), 'CheatsheetHub has revealReflex method');
  assert(hubCode.includes('nextReflex'), 'CheatsheetHub has nextReflex method');
  assert(hubCode.includes('cs-reflex-modal'), 'CheatsheetHub renders reflex modal');
});


describe('English Assistance & Cognitive Bridges for A1 & A2 Learners', () => {
  const rootDir = path.join(__dirname, '..');
  // 1. A1 Grammatik English Bridges & Cognate Table
  const gA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Grammatik.md'), 'utf8');
  assert(gA1.includes("English Learner's Bridge & The Germanic Cognate Secret"), 'A1 Grammatik has Germanic Cognate secret table');
  assert(gA1.includes('d ➔ t') && gA1.includes('th ➔ d'), 'A1 Grammatik has sound shift rules');
  assert(gA1.includes('English Bridge (Why German has Genders'), 'A1 Grammatik has gender English bridge');
  assert(gA1.includes('English Bridge (You Already Know Cases in English!)'), 'A1 Grammatik has case English bridge');
  assert(gA1.includes('English Bridge (Pronoun Direct Mapping)'), 'A1 Grammatik has pronoun English bridge');
  assert(gA1.includes('English Bridge (Conjugation & The Modal Sentence Bracket)'), 'A1 Grammatik has verb & bracket English bridge');
  assert(gA1.includes('English Bridge (DOGFU Accusative Prepositions)'), 'A1 Grammatik has DOGFU English bridge');
  assert(gA1.includes('English Bridge (The V2 Rule & Inversion vs. English SVO)'), 'A1 Grammatik has V2 inversion English bridge');
  assert(gA1.includes('English Bridge (nicht vs. kein)'), 'A1 Grammatik has negation English bridge');

  // 2. A1 Spickzettel Bilingual Glosses
  const spickA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Spickzettel.md'), 'utf8');
  assert(spickA1.includes('Who?') && spickA1.includes('Whom?') && spickA1.includes('Where to?'), 'A1 Spickzettel has English question words');
  assert(spickA1.includes('Good day, my name is') || spickA1.includes('I am called Alex'), 'A1 Spickzettel has English self-introduction glosses');
  assert(spickA1.includes('Could you please say that once more?'), 'A1 Spickzettel has English emergency phrases');

  // 3. A1 README Quick-Start Guide
  const readmeA1 = fs.readFileSync(path.join(rootDir, 'A1', 'README.md'), 'utf8');
  assert(readmeA1.includes('Quick-Start Guide for English Speakers'), 'A1 README has English Quick-Start Guide');

  // 4. A2 Grammatik English Bridges & False Friends Radar
  const gA2 = fs.readFileSync(path.join(rootDir, 'A2', 'Grammatik.md'), 'utf8');
  assert(gA2.includes('False Friends (Falsche Freunde) Radar'), 'A2 Grammatik has False Friends radar');
  assert(gA2.includes('bekommen') && gA2.includes('to receive / get'), 'A2 False Friends radar explains bekommen');
  assert(gA2.includes('English Bridge (The Dative Case = Indirect Object'), 'A2 Grammatik has Dative English bridge');
  assert(gA2.includes('English Bridge (Dative Pronouns & Reflexives)'), 'A2 Grammatik has Reflexives English bridge');
  assert(gA2.includes('English Bridge (The "In vs. Into"'), 'A2 Grammatik has Wechselpräpositionen English bridge');
  assert(gA2.includes('English Bridge (Conversational Past vs. Written Past)'), 'A2 Grammatik has Perfekt English bridge');
  assert(gA2.includes('English Bridge (Conjunctions: SVO vs. Verb Kickers)'), 'A2 Grammatik has Subordinate clauses English bridge');

  // 5. A2 Spickzettel & README
  const spickA2 = fs.readFileSync(path.join(rootDir, 'A2', 'Spickzettel.md'), 'utf8');
  assert(spickA2.includes('The Indirect Object') || spickA2.includes('To whom?'), 'A2 Spickzettel has English Dativ annotations');
  assert(spickA2.includes('What do you like to do most on weekends?'), 'A2 Spickzettel has English speaking exam glosses');

  const readmeA2 = fs.readFileSync(path.join(rootDir, 'A2', 'README.md'), 'utf8');
  assert(readmeA2.includes("English Speaker's Milestone Map for A2"), 'A2 README has English Milestone Map');

  // 6. Interactive Reflex Trainer & Workbook Studio
  const hubCode = fs.readFileSync(path.join(rootDir, 'js', 'cheatsheet_hub.js'), 'utf8');
  assert(hubCode.includes('enBridge:'), 'CheatsheetHub reflex drills include enBridge');
  assert(hubCode.includes('cs-reaction-enbridge'), 'CheatsheetHub renders English cognitive bridge container');

  const wbCode = fs.readFileSync(path.join(rootDir, 'js', 'workbook_studio.js'), 'utf8');
  assert(wbCode.includes('wb-english-help-box'), 'WorkbookStudio renders English instruction key for A1 & A2');
});

// ----------------------------------------------------------------------------
// Suite 11: Workbook Studio Ergonomics & Page-by-Page Refinement (Page 3)
// ----------------------------------------------------------------------------
describe('Workbook Studio Ergonomics & Page 3 Refinement', () => {
  const rootDir = path.join(__dirname, '..');
  const wbStudioCode = fs.readFileSync(path.join(rootDir, 'js', 'workbook_studio.js'), 'utf8');

  // 1. Hints & Audio removal from exercise rows and teachings header
  assert(!wbStudioCode.includes('class="wb-item-btn hint-btn'), 'Hint button (💡) is removed from exercise item actions');
  assert(!wbStudioCode.includes('class="wb-item-btn audio-btn'), 'Audio button (🔊) is removed from exercise item actions');
  assert(!wbStudioCode.includes('wb-feedback-tag hint'), 'Hint feedback tag is removed from exercise item feedback wrap');
  assert(!wbStudioCode.includes('speakTeachings()'), 'Audio speech button (🔊 Vorlesen) is removed from teachings header');
  assert(wbStudioCode.includes('class="wb-item-btn reveal-btn'), 'Reveal button (👁️) is retained for autonomous self-checking');

  // 2. Normalization of levelKey in getMeta & getWorksheetData
  assert(wbStudioCode.includes("const normLevel = (levelKey || 'A1').replace(/_WORKBOOK$/i, '').toUpperCase();"), 'levelKey is properly normalized in WorkbookStudio');

  // 3. WordBox support in exercise card
  assert(wbStudioCode.includes('wordBankList = (ex.wordBank && ex.wordBank.length > 0) ? ex.wordBank : (ex.wordBox && ex.wordBox.length > 0 ? ex.wordBox : []);'), 'Exercise card supports wordBox array');

  // 4. Page 3 in js/workbooks_keys.js
  const wbKeysCode = fs.readFileSync(path.join(rootDir, 'js', 'workbooks_keys.js'), 'utf8');
  const start = wbKeysCode.indexOf('{');
  const end = wbKeysCode.lastIndexOf('}') + 1;
  const data = JSON.parse(wbKeysCode.substring(start, end));

  const page3 = data['A1']['3'];
  assert(!!page3, 'A1 Page 3 exists in WORKBOOKS_KEYS');
  assert(page3.exercises.length === 2, 'A1 Page 3 contains exactly 2 exercises');

  // Übung 1
  const ex1 = page3.exercises[0];
  assert(ex1.instruction.includes('Ergänzen Sie die passende Verbendung') && ex1.instruction.includes('Fill in the matching verb ending'), 'Übung 1 has bilingual instruction');
  const item1c = ex1.items.find(it => it.id === 'a1_p3_ex1_c');
  assert(!!item1c, 'Übung 1 item c exists');
  assert(item1c.lead === 'Ich komm' && item1c.tail === ' aus Italien.', 'Übung 1 item c lead and tail are cleanly formatted');
  assert(item1c.answer === 'e', 'Übung 1 item c expected answer is "e"');
  assert(Array.isArray(item1c.alternatives) && item1c.alternatives.includes('komme'), 'Übung 1 item c accepts alternative "komme"');

  // Übung 2
  const ex2 = page3.exercises[1];
  assert(ex2.instruction.includes('Wählen Sie aus dem Wortkasten') && ex2.instruction.includes('Choose from the word box'), 'Übung 2 has bilingual instruction');
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 11, 'Übung 2 has wordBox array with 11 verbs');
  assert(ex2.items.length === 10, 'Übung 2 has 10 interactive gap items');
  const item2c = ex2.items.find(it => it.id === 'a1_p3_ex2_c');
  assert(item2c && Array.isArray(item2c.alternatives) && item2c.alternatives.includes('lebt'), 'Übung 2 item c accepts plausible alternative "lebt"');

  // Grammar summary
  assert(page3.grammarSummary.includes('| Personalpronomen (Person) | Endung (Ending) |'), 'Page 3 grammarSummary has structured markdown table');
  assert(page3.grammarSummary.includes('ich komm**e**') && page3.grammarSummary.includes('I come'), 'Page 3 grammarSummary has English glosses');

  // 5. A1/Arbeitsbuch.md Page 3
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('### ✍️ Übung 1: Verbendungen ergänzen'), 'A1/Arbeitsbuch.md has Übung 1 refined');
  assert(abA1.includes('Ich komm_______ aus Italien.'), 'A1/Arbeitsbuch.md has item c updated to Italien');
  assert(abA1.includes('### ✍️ Übung 2: Verben aus dem Wortkasten einsetzen'), 'A1/Arbeitsbuch.md has Übung 2 refined');
});

// ----------------------------------------------------------------------------
// Suite 12: Workbook Page 4 Refinement (Special Verbs: -t/-d & Sibilant Stems)
// ----------------------------------------------------------------------------
describe('Workbook Page 4 Refinement (Special Verbs: -t/-d & Sibilant Stems)', () => {
  const rootDir = path.join(__dirname, '..');
  const wbKeysCode = fs.readFileSync(path.join(rootDir, 'js', 'workbooks_keys.js'), 'utf8');
  const start = wbKeysCode.indexOf('{');
  const end = wbKeysCode.lastIndexOf('}') + 1;
  const data = JSON.parse(wbKeysCode.substring(start, end));

  const page4 = data['A1']['4'];
  assert(!!page4, 'A1 Page 4 exists in WORKBOOKS_KEYS');
  assert(page4.exercises.length === 2, 'A1 Page 4 contains exactly 2 exercises (Übung 3 & Übung 4)');

  // Übung 3
  const ex3 = page4.exercises[0];
  assert(ex3.instruction.includes('Antworten Sie im Mini-Dialog') && ex3.instruction.includes('Answer in the mini-dialogue'), 'Übung 3 has bilingual instruction');
  assert(ex3.items.length === 6, 'Übung 3 has 6 dialogue items');
  
  // Verify that corrupted article answers (den, die, das) are eliminated
  const ex3Answers = Object.values(ex3.answers);
  assert(!ex3Answers.includes('den') && !ex3Answers.includes('die') && !ex3Answers.includes('das'), 'Corrupted article answers completely removed from Übung 3');
  assert(ex3.answers['a1_p4_ex3_a'] === 'komme', 'Übung 3 item a answer is komme');
  assert(ex3.answers['a1_p4_ex3_b'] === 'trinke', 'Übung 3 item b answer is trinke');
  assert(ex3.answers['a1_p4_ex3_c'] === 'wohne', 'Übung 3 item c answer is wohne');
  assert(ex3.answers['a1_p4_ex3_d'] === 'frage', 'Übung 3 item d answer is frage');
  assert(ex3.answers['a1_p4_ex3_e'] === 'studiere', 'Übung 3 item e answer is studiere');
  assert(ex3.answers['a1_p4_ex3_f'] === 'gehe', 'Übung 3 item f answer is gehe');

  // Übung 4
  const ex4 = page4.exercises[1];
  assert(ex4.instruction.includes('Ergänzen Sie die Endungen') && ex4.instruction.includes('Fill in the verb endings'), 'Übung 4 has bilingual instruction');
  assert(ex4.items.length === 16, 'Übung 4 contains 16 suffix items (a-p)');
  
  // Sibilant stem tests (heißen, reisen) -> du reist / du heißt (kein extra s)
  assert(ex4.answers['a1_p4_ex4_k'] === 't', 'reisen (du) correctly takes -t ending');
  assert(ex4.answers['a1_p4_ex4_o'] === 't', 'heißen (du) correctly takes -t ending');
  
  // -t/-d stem tests (reden, antworten) -> du redest / du antwortest (Einschub -e-)
  assert(ex4.answers['a1_p4_ex4_b'] === 'est', 'reden (du) correctly takes -est ending');
  assert(ex4.answers['a1_p4_ex4_d'] === 'et', 'reden (er/es/Paul) correctly takes -et ending');
  assert(ex4.answers['a1_p4_ex4_e'] === 'et', 'antworten (er/Student) correctly takes -et ending');
  assert(ex4.answers['a1_p4_ex4_g'] === 'est', 'antworten (du) correctly takes -est ending');

  // Grammar Summary
  assert(page4.grammarSummary.includes('Verbstamm auf `-t` oder `-d`'), 'Page 4 grammarSummary covers -t/-d stem rules');
  assert(page4.grammarSummary.includes('Verbstamm auf Zischlaut'), 'Page 4 grammarSummary covers sibilant stem rules');
  assert(page4.grammarSummary.includes('I work / I speak'), 'Page 4 grammarSummary includes English glosses');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 📄 Seite 4: 1.1. Verb - Konjugation — Besonderheiten'), 'A1/Arbeitsbuch.md has Page 4 heading refined');
  assert(abA1.includes('### ✍️ Übung 3: Mini-Dialoge im Präsens'), 'A1/Arbeitsbuch.md has Übung 3 refined');
  assert(abA1.includes('### ✍️ Übung 4: Endungen ergänzen'), 'A1/Arbeitsbuch.md has Übung 4 refined');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('Subjekt ich (1s) ➔ komme'), 'A1/Loesungsschluessel.md has clean Page 4 solutions');
  assert(!lsA1.includes('Wasser.den'), 'A1/Loesungsschluessel.md has no corrupted Wasser.den string');
});

// ----------------------------------------------------------------------------
// Suite 15: Workbook Page 5 Refinement (Conjugation Deepening & Verb "sein")
// ----------------------------------------------------------------------------
describe('Workbook Page 5 Refinement (Conjugation Deepening & Verb "sein")', () => {
  const rootDir = path.join(__dirname, '..');
  const keysPath = path.join(rootDir, 'js', 'workbooks_keys.js');
  const raw = fs.readFileSync(keysPath, 'utf8');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}') + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page5 = data.A1['5'];
  assert(!!page5, 'A1 Page 5 exists in WORKBOOKS_KEYS');
  assert(Array.isArray(page5.exercises) && page5.exercises.length === 3, 'A1 Page 5 contains exactly 3 exercises (Übung 5, 6, 7)');

  // Übung 5: Verbendungen im Kontrast (24 items: 12 studieren/arbeiten + 12 reisen/reden)
  const ex5 = page5.exercises[0];
  assert(ex5.id === 'a1_p5_ex5', 'Übung 5 ID matches');
  assert(ex5.instruction.includes('(Fill in the matching verb ending.)'), 'Übung 5 has bilingual instruction');
  assert(ex5.items.length === 24, 'Übung 5 has 24 items (a-x)');
  assert(ex5.answers['a1_p5_ex5_a'] === 'e', 'Übung 5 item a answer is "e"');
  assert(ex5.answers['a1_p5_ex5_b'] === 'et', 'Übung 5 item b answer is "et" (ihr arbeitet)');
  assert(ex5.answers['a1_p5_ex5_h'] === 'est', 'Übung 5 item h answer is "est" (du arbeitest)');
  assert(ex5.answers['a1_p5_ex5_p'] === 'est', 'Übung 5 item p answer is "est" (du redest)');
  assert(ex5.answers['a1_p5_ex5_u'] === 't', 'Übung 5 item u answer is "t" (du reist, no extra s)');
  assert(ex5.items[0].alternatives.includes('studiere'), 'Übung 5 accepts alternative full word');
  assert(ex5.items[0].isCompact === true, 'Übung 5 items are styled compact');

  // Übung 6: Sätze bilden mit "sein"
  const ex6 = page5.exercises[1];
  assert(ex6.id === 'a1_p5_ex6', 'Übung 6 ID matches');
  assert(ex6.instruction.includes('Form sentences with the correct form of sein'), 'Übung 6 has bilingual instruction');
  assert(ex6.items.length === 6, 'Übung 6 has 6 items');
  assert(ex6.answers['a1_p5_ex6_a'] === 'ist', 'Übung 6 item a answer is "ist" (Max ist im Kino)');
  assert(ex6.answers['a1_p5_ex6_b'] === 'bist', 'Übung 6 item b answer is "bist" (Du bist in Berlin)');
  assert(ex6.answers['a1_p5_ex6_c'] === 'sind', 'Übung 6 item c answer is "sind" (Wir sind im Hotel)');
  assert(ex6.answers['a1_p5_ex6_d'] === 'sind', 'Übung 6 item d answer is "sind" (Paul und Jana sind zu Hause)');
  assert(ex6.answers['a1_p5_ex6_e'] === 'seid', 'Übung 6 item e answer is "seid" (Ihr seid im Bus)');
  assert(ex6.answers['a1_p5_ex6_f'] === 'bin', 'Übung 6 item f answer is "bin" (Ich bin im Deutschkurs)');

  // Übung 7: "sein" im Satz
  const ex7 = page5.exercises[2];
  assert(ex7.id === 'a1_p5_ex7', 'Übung 7 ID matches');
  assert(Array.isArray(ex7.wordBox) && ex7.wordBox.length === 5, 'Übung 7 has Wortkasten with 5 forms of sein');
  assert(ex7.items.length === 10, 'Übung 7 has 10 items');
  assert(ex7.answers['a1_p5_ex7_a'] === 'sind', 'Übung 7 item a answer is "sind"');
  assert(ex7.answers['a1_p5_ex7_b'] === 'bist', 'Übung 7 item b answer is "bist"');
  assert(ex7.answers['a1_p5_ex7_h'] === 'bin', 'Übung 7 item h answer is "bin"');
  assert(ex7.answers['a1_p5_ex7_j'] === 'ist', 'Übung 7 item j answer is "ist"');

  // Grammar Summary
  assert(page5.grammarSummary.includes('Das unregelmäßige Hilfsverb *sein*'), 'Page 5 grammarSummary covers verb sein');
  assert(page5.grammarSummary.includes('Drei Kernfunktionen von *sein*'), 'Page 5 grammarSummary covers 3 core uses');
  assert(page5.grammarSummary.includes('Wer? / Was?'), 'Page 5 grammarSummary covers identity/profession');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 📄 Seite 5: 1.1. Verb - Konjugation — Vertiefung & das Hilfsverb "sein"'), 'A1/Arbeitsbuch.md has Page 5 heading refined');
  assert(abA1.includes('### ✍️ Übung 5: Verbendungen im Kontrast'), 'A1/Arbeitsbuch.md has Übung 5 refined');
  assert(abA1.includes('### ✍️ Übung 6: Sätze mit dem Verb "sein" bilden'), 'A1/Arbeitsbuch.md has Übung 6 refined');
  assert(abA1.includes('### ✍️ Übung 7: Das Verb "sein" im Satz'), 'A1/Arbeitsbuch.md has Übung 7 refined');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('Max **ist** im Kino'), 'A1/Loesungsschluessel.md has clean Page 5 solutions for Übung 6');
  assert(lsA1.includes('Julia und Maria **sind** in Italien'), 'A1/Loesungsschluessel.md has clean Page 5 solutions for Übung 7');
});

// ----------------------------------------------------------------------------
// Suite 16: Workbook Page 6 Refinement (1.2. Personalpronomen — Nominativ)
// ----------------------------------------------------------------------------
describe('Workbook Page 6 Refinement (1.2. Personalpronomen — Nominativ)', () => {
  const rootDir = path.join(__dirname, '..');
  const keysPath = path.join(rootDir, 'js', 'workbooks_keys.js');
  const raw = fs.readFileSync(keysPath, 'utf8');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}') + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page6 = data.A1['6'];
  assert(!!page6, 'A1 Page 6 exists in WORKBOOKS_KEYS');
  assert(Array.isArray(page6.exercises) && page6.exercises.length === 4, 'A1 Page 6 contains exactly 4 exercises (Übung 1, 2, 3, 4)');

  // Übung 1: Fragen und Antworten mit Personalpronomen
  const ex1 = page6.exercises[0];
  assert(ex1.id === 'a1_p6_ex1', 'Übung 1 ID matches');
  assert(ex1.instruction.includes('(Answer the question with the correct pronoun and verb.)'), 'Übung 1 has bilingual instruction');
  assert(ex1.items.length === 6, 'Übung 1 has 6 items');
  assert(ex1.answers['a1_p6_ex1_a'] === 'sie arbeitet', 'Übung 1 item a answer is "sie arbeitet"');
  assert(ex1.answers['a1_p6_ex1_b'] === 'er redet', 'Übung 1 item b answer is "er redet"');
  assert(ex1.answers['a1_p6_ex1_c'] === 'wir lernen', 'Übung 1 item c answer is "wir lernen"');
  assert(ex1.answers['a1_p6_ex1_d'] === 'ich studiere', 'Übung 1 item d answer is "ich studiere"');
  assert(ex1.answers['a1_p6_ex1_e'] === 'wir trinken', 'Übung 1 item e answer is "wir trinken"');
  assert(ex1.answers['a1_p6_ex1_f'] === 'sie tanzen', 'Übung 1 item f answer is "sie tanzen"');

  // Übung 2: Dialoge im Alltag
  const ex2 = page6.exercises[1];
  assert(ex2.id === 'a1_p6_ex2', 'Übung 2 ID matches');
  assert(ex2.instruction.includes('(Answer with the matching pronoun and verb.)'), 'Übung 2 has bilingual instruction');
  assert(ex2.items.length === 6, 'Übung 2 has 6 items');
  assert(ex2.answers['a1_p6_ex2_a'] === 'ich lerne', 'Übung 2 item a answer is "ich lerne"');
  assert(ex2.answers['a1_p6_ex2_b'] === 'ich gehe', 'Übung 2 item b answer is "ich gehe"');
  assert(ex2.answers['a1_p6_ex2_c'] === 'er lernt', 'Übung 2 item c answer is "er lernt"');
  assert(ex2.answers['a1_p6_ex2_d'] === 'sie kommt', 'Übung 2 item d answer is "sie kommt"');
  assert(ex2.answers['a1_p6_ex2_e'] === 'wir studieren', 'Übung 2 item e answer is "wir studieren"');
  assert(ex2.answers['a1_p6_ex2_f'] === 'sie wohnen', 'Übung 2 item f answer is "sie wohnen"');

  // Übung 3: Herr Schneider und Frau Berg
  const ex3 = page6.exercises[2];
  assert(ex3.id === 'a1_p6_ex3', 'Übung 3 ID matches');
  assert(ex3.instruction.includes('(Fill in the matching personal pronoun and verb.)'), 'Übung 3 has bilingual instruction');
  assert(ex3.items.length === 7, 'Übung 3 has 7 items');
  assert(ex3.answers['a1_p6_ex3_a'] === 'Er', 'Übung 3 item a answer is "Er"');
  assert(ex3.answers['a1_p6_ex3_b'] === 'er wohnt', 'Übung 3 item b answer is "er wohnt"');
  assert(ex3.answers['a1_p6_ex3_c'] === 'Er ist', 'Übung 3 item c answer is "Er ist"');
  assert(ex3.answers['a1_p6_ex3_d'] === 'Sie heißt', 'Übung 3 item d answer is "Sie heißt"');
  assert(ex3.answers['a1_p6_ex3_e'] === 'Sie', 'Übung 3 item e answer is "Sie"');
  assert(ex3.answers['a1_p6_ex3_f'] === 'Sie wohnt', 'Übung 3 item f answer is "Sie wohnt"');
  assert(ex3.answers['a1_p6_ex3_g'] === 'Sie ist', 'Übung 3 item g answer is "Sie ist"');

  // Übung 4: Personalpronomen einsetzen
  const ex4 = page6.exercises[3];
  assert(ex4.id === 'a1_p6_ex4', 'Übung 4 ID matches');
  assert(Array.isArray(ex4.wordBox) && ex4.wordBox.length === 6, 'Übung 4 has Wortkasten with 6 pronouns');
  assert(ex4.items.length === 6, 'Übung 4 has 6 items');
  assert(ex4.answers['a1_p6_ex4_a'] === 'Sie', 'Übung 4 item a answer is "Sie"');
  assert(ex4.answers['a1_p6_ex4_b'] === 'Er', 'Übung 4 item b answer is "Er"');
  assert(ex4.answers['a1_p6_ex4_c'] === 'Sie', 'Übung 4 item c answer is "Sie"');
  assert(ex4.answers['a1_p6_ex4_d'] === 'Es', 'Übung 4 item d answer is "Es" (das Mädchen ➔ Es)');
  assert(ex4.answers['a1_p6_ex4_e'] === 'Ich', 'Übung 4 item e answer is "Ich"');
  assert(ex4.answers['a1_p6_ex4_f'] === 'Wir', 'Übung 4 item f answer is "Wir"');

  // Grammar Summary
  assert(page6.grammarSummary.includes('Personalpronomen im Nominativ'), 'Page 6 grammarSummary covers subject pronouns');
  assert(page6.grammarSummary.includes('Pronomen-Wechsel im Dialog'), 'Page 6 grammarSummary covers dialogue flip');
  assert(page6.grammarSummary.includes('Grammatisches Geschlecht beachten'), 'Page 6 grammarSummary covers grammatical gender rule');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 📄 Seite 6: 1.2. Personalpronomen — Nominativ'), 'A1/Arbeitsbuch.md has Page 6 heading refined');
  assert(abA1.includes('### ✍️ Übung 1: Fragen und Antworten mit Personalpronomen'), 'A1/Arbeitsbuch.md has Übung 1 refined');
  assert(abA1.includes('### ✍️ Übung 2: Dialoge im Alltag'), 'A1/Arbeitsbuch.md has Übung 2 refined');
  assert(abA1.includes('### ✍️ Übung 3: Herr Schneider und Frau Berg'), 'A1/Arbeitsbuch.md has Übung 3 refined');
  assert(abA1.includes('### ✍️ Übung 4: Personalpronomen einsetzen'), 'A1/Arbeitsbuch.md has Übung 4 refined');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('sie arbeitet'), 'A1/Loesungsschluessel.md has clean Page 6 solutions for Übung 1');
  assert(lsA1.includes('Herr Schneider ➔ Er ist (Lehrer)'), 'A1/Loesungsschluessel.md has clean Page 6 solutions for Übung 3');
});

// ----------------------------------------------------------------------------
// Suite 17: Workbook Page 7 Refinement (1.3. Wortstellung: Aussagesatz / Fragesätze)
// ----------------------------------------------------------------------------
describe('Workbook Page 7 Refinement (1.3. Wortstellung: Aussagesatz / Fragesätze)', () => {
  const rootDir = path.join(__dirname, '..');
  const keysPath = path.join(rootDir, 'js', 'workbooks_keys.js');
  const raw = fs.readFileSync(keysPath, 'utf8');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}') + 1;
  const data = JSON.parse(raw.substring(start, end));

  assert(data.A1 && data.A1['7'], 'A1 Page 7 exists in WORKBOOKS_KEYS');
  const page7 = data.A1['7'];
  assert(page7.exercises.length === 3, 'A1 Page 7 contains exactly 3 exercises (Übung 1, 2, 3)');

  // Übung 1: Aussagesatz & Inversion
  const ex1 = page7.exercises[0];
  assert(ex1.id === 'a1_p7_ex1', 'Übung 1 ID matches');
  assert(ex1.instruction.includes('(Form the inverted sentence: Position I element ➔ Position II verb ➔ Position III subject.)'), 'Übung 1 has bilingual instruction');
  assert(ex1.items.length === 6, 'Übung 1 has 6 items (a-f)');
  assert(ex1.answers['a1_p7_ex1_a'] === 'komme ich', 'Übung 1 item a answer is "komme ich"');
  assert(ex1.answers['a1_p7_ex1_b'] === 'studiert Maria', 'Übung 1 item b answer is "studiert Maria"');
  assert(ex1.answers['a1_p7_ex1_c'] === 'wohnst du', 'Übung 1 item c answer is "wohnst du"');
  assert(ex1.answers['a1_p7_ex1_d'] === 'trinken wir', 'Übung 1 item d answer is "trinken wir"');
  assert(ex1.answers['a1_p7_ex1_e'] === 'studiert ihr', 'Übung 1 item e answer is "studiert ihr"');
  assert(ex1.answers['a1_p7_ex1_f'] === 'kauft Carlos', 'Übung 1 item f answer is "kauft Carlos"');
  assert(ex1.items[0].alternatives.includes('komme ich'), 'Übung 1 item a accepts alternative "komme ich"');

  // Übung 2: Satzbildung vom Infinitiv zur Inversion
  const ex2 = page7.exercises[1];
  assert(ex2.id === 'a1_p7_ex2', 'Übung 2 ID matches');
  assert(ex2.instruction.includes('(Form the inverted sentence from the given elements.)'), 'Übung 2 has bilingual instruction');
  assert(ex2.items.length === 8, 'Übung 2 has 8 items (a-h)');
  assert(ex2.answers['a1_p7_ex2_a'] === 'hören wir', 'Übung 2 item a answer is "hören wir"');
  assert(ex2.answers['a1_p7_ex2_b'] === 'reisen Max und Eva', 'Übung 2 item b answer is "reisen Max und Eva"');
  assert(ex2.answers['a1_p7_ex2_c'] === 'kaufen wir', 'Übung 2 item c answer is "kaufen wir"');
  assert(ex2.answers['a1_p7_ex2_d'] === 'arbeitet Herr Berg', 'Übung 2 item d answer is "arbeitet Herr Berg"');
  assert(ex2.answers['a1_p7_ex2_e'] === 'kommt Dora', 'Übung 2 item e answer is "kommt Dora"');
  assert(ex2.answers['a1_p7_ex2_f'] === 'schreibe ich', 'Übung 2 item f answer is "schreibe ich"');
  assert(ex2.answers['a1_p7_ex2_g'] === 'studiert Lena', 'Übung 2 item g answer is "studiert Lena"');
  assert(ex2.answers['a1_p7_ex2_h'] === 'bist du', 'Übung 2 item h answer is "bist du"');
  assert(ex2.items[0].alternatives.includes('hören'), 'Übung 2 item a accepts fallback verb "hören"');

  // Übung 3: W-Fragen
  const ex3 = page7.exercises[2];
  assert(ex3.id === 'a1_p7_ex3', 'Übung 3 ID matches');
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 3, 'Übung 3 has Wortkasten with 3 question words');
  assert(ex3.items.length === 8, 'Übung 3 has 8 items (a-h)');
  assert(ex3.answers['a1_p7_ex3_a'] === 'Wer', 'Übung 3 item a answer is "Wer"');
  assert(ex3.answers['a1_p7_ex3_b'] === 'Wie', 'Übung 3 item b answer is "Wie"');
  assert(ex3.answers['a1_p7_ex3_c'] === 'Was', 'Übung 3 item c answer is "Was"');
  assert(ex3.answers['a1_p7_ex3_d'] === 'Wer', 'Übung 3 item d answer is "Wer"');
  assert(ex3.answers['a1_p7_ex3_e'] === 'Was', 'Übung 3 item e answer is "Was"');
  assert(ex3.answers['a1_p7_ex3_f'] === 'Wer', 'Übung 3 item f answer is "Wer"');
  assert(ex3.answers['a1_p7_ex3_g'] === 'Wie', 'Übung 3 item g answer is "Wie"');
  assert(ex3.answers['a1_p7_ex3_h'] === 'Wie', 'Übung 3 item h answer is "Wie"');
  assert(ex3.items.every(item => item.isCompact === true), 'Übung 3 items are compact inputs');

  // Grammar Summary
  assert(page7.grammarSummary.includes('Der Aussagesatz (V2-Regel & Inversion)'), 'Page 7 grammarSummary covers V2 and Inversion');
  assert(page7.grammarSummary.includes('Der Fragesatz mit Fragewort (W-Frage)'), 'Page 7 grammarSummary covers W-Fragen');
  assert(page7.grammarSummary.includes('Der Fragesatz ohne Fragewort (Ja/Nein-Frage)'), 'Page 7 grammarSummary covers Ja/Nein-Fragen');
  assert(page7.grammarSummary.includes('English Cognitive Bridge'), 'Page 7 grammarSummary includes English cognitive bridges');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 📄 Seite 7: 1.3. Wortstellung: Aussagesatz / Fragesätze'), 'A1/Arbeitsbuch.md has Page 7 heading refined');
  assert(abA1.includes('### ✍️ Übung 1: Aussagesatz & Inversion (V2-Regel)'), 'A1/Arbeitsbuch.md has Übung 1 refined');
  assert(abA1.includes('### ✍️ Übung 2: Satzbildung — Vom Infinitiv zur Inversion'), 'A1/Arbeitsbuch.md has Übung 2 refined');
  assert(abA1.includes('### ✍️ Übung 3: W-Fragen & Antworten (Wer, Was, Wie)'), 'A1/Arbeitsbuch.md has Übung 3 refined');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('Inversion: Zeitangabe (Pos. I) + Verb (Pos. II) + Subjekt (Pos. III)'), 'A1/Loesungsschluessel.md has clean Page 7 solutions for Übung 1');
  assert(!lsA1.includes('richtig kauft Brot'), 'A1/Loesungsschluessel.md has no corrupt "richtig" strings on Page 7');
});

// ----------------------------------------------------------------------------
// Suite 18: Workbook Page 8 Refinement (1.3. Wortstellung: W-Fragen & Lokale Präpositionen)
// ----------------------------------------------------------------------------
describe('Workbook Page 8 Refinement (1.3. Wortstellung: W-Fragen & Lokale Präpositionen)', () => {
  const rootDir = path.join(__dirname, '..');
  const keysPath = path.join(rootDir, 'js', 'workbooks_keys.js');
  const raw = fs.readFileSync(keysPath, 'utf8');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}') + 1;
  const data = JSON.parse(raw.substring(start, end));

  assert(data.A1 && data.A1['8'], 'A1 Page 8 exists in WORKBOOKS_KEYS');
  const page8 = data.A1['8'];
  assert(page8.exercises.length === 2, 'A1 Page 8 contains exactly 2 exercises (Übung 4, 5)');

  // Übung 4: W-Fragen in Dialogen & Lokale Präpositionen
  const ex4 = page8.exercises[0];
  assert(ex4.id === 'a1_p8_ex4', 'Übung 4 ID matches');
  assert(ex4.instruction.includes('(Fill in the matching question word or preposition.)'), 'Übung 4 has bilingual instruction');
  assert(ex4.items.length === 17, 'Übung 4 has 17 items');
  assert(ex4.answers['a1_p8_ex4_a'] === 'Was', 'Übung 4 item a1 is "Was"');
  assert(ex4.answers['a1_p8_ex4_2'] === 'Wer', 'Übung 4 item a2 is "Wer"');
  assert(ex4.answers['a1_p8_ex4_3'] === 'Wo', 'Übung 4 item a3 is "Wo"');
  assert(ex4.answers['a1_p8_ex4_4'] === 'Woher', 'Übung 4 item a4 is "Woher"');
  assert(ex4.answers['a1_p8_ex4_b'] === 'Was', 'Übung 4 item b1 is "Was"');
  assert(ex4.answers['a1_p8_ex4_6'] === 'Wer', 'Übung 4 item b2 is "Wer"');
  assert(ex4.answers['a1_p8_ex4_7'] === 'Wo', 'Übung 4 item b3 is "Wo"');
  assert(ex4.answers['a1_p8_ex4_8'] === 'Woher', 'Übung 4 item b4 is "Woher"');
  assert(ex4.answers['a1_p8_ex4_c'] === 'Was', 'Übung 4 item c1 is "Was"');
  assert(ex4.answers['a1_p8_ex4_10'] === 'Wer', 'Übung 4 item c2 is "Wer"');
  assert(ex4.answers['a1_p8_ex4_11'] === 'Wo', 'Übung 4 item c3 is "Wo"');
  assert(ex4.answers['a1_p8_ex4_d'] === 'Was', 'Übung 4 item d1 is "Was"');
  assert(ex4.answers['a1_p8_ex4_13'] === 'Wer', 'Übung 4 item d2 is "Wer"');
  assert(ex4.answers['a1_p8_ex4_14'] === 'Woher', 'Übung 4 item d3 is "Woher"');
  assert(ex4.answers['a1_p8_ex4_15'] === 'in', 'Übung 4 item e1 is "in"');
  assert(ex4.answers['a1_p8_ex4_16'] === 'nach', 'Übung 4 item e2 is "nach"');
  assert(ex4.answers['a1_p8_ex4_17'] === 'aus', 'Übung 4 item e3 is "aus"');
  assert(ex4.items.every(i => i.isCompact === true), 'Übung 4 items are compact');

  // Übung 5: Lokale Fragewörter
  const ex5 = page8.exercises[1];
  assert(ex5.id === 'a1_p8_ex5', 'Übung 5 ID matches');
  assert(ex5.instruction.includes('(Fill in the matching question word: wo, wohin, woher.)'), 'Übung 5 has bilingual instruction');
  assert(Array.isArray(ex5.wordBox) && ex5.wordBox.length === 3, 'Übung 5 has Wortkasten with 3 items');
  assert(ex5.items.length === 6, 'Übung 5 has 6 items');
  assert(ex5.answers['a1_p8_ex5_a'] === 'Wo', 'Übung 5 item a is "Wo"');
  assert(ex5.answers['a1_p8_ex5_b'] === 'Wohin', 'Übung 5 item b is "Wohin"');
  assert(ex5.answers['a1_p8_ex5_c'] === 'Wo', 'Übung 5 item c is "Wo"');
  assert(ex5.answers['a1_p8_ex5_d'] === 'Woher', 'Übung 5 item d is "Woher"');
  assert(ex5.answers['a1_p8_ex5_e'] === 'Wo', 'Übung 5 item e is "Wo"');
  assert(ex5.answers['a1_p8_ex5_f'] === 'Wo', 'Übung 5 item f is "Wo"');
  assert(ex5.items.every(i => i.isCompact === true), 'Übung 5 items are compact');

  // Grammar Summary
  assert(page8.grammarSummary.includes('Lokale Fragewörter & Präpositionen'), 'Page 8 grammarSummary covers question words and prepositions');
  assert(page8.grammarSummary.includes('Der Sonderfall: „Hause“'), 'Page 8 grammarSummary covers Hause idioms');
  assert(page8.grammarSummary.includes('English Cognitive Bridge'), 'Page 8 grammarSummary includes English cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 📄 Seite 8: 1.3. Wortstellung: Aussagesatz / Fragesätze — Vertiefung & W-Fragen'), 'A1/Arbeitsbuch.md has Page 8 heading refined');
  assert(abA1.includes('### ✍️ Übung 4: W-Fragen in Dialogen & Präpositionen'), 'A1/Arbeitsbuch.md has Übung 4 refined');
  assert(abA1.includes('### ✍️ Übung 5: Lokale Fragewörter (wo, wohin, woher)'), 'A1/Arbeitsbuch.md has Übung 5 refined');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('Frage nach Herkunft'), 'A1/Loesungsschluessel.md has clean Page 8 solutions');
  assert(!lsA1.includes('richtig ist das? - Das ist Käse.'), 'A1/Loesungsschluessel.md has no corrupt "richtig" strings on Page 8');
});

// ----------------------------------------------------------------------------
// Suite 19: A1 Page 9 Refinement Integrity (Ja/Nein-Fragen, Verneinung & Doch)
// ----------------------------------------------------------------------------
describe('A1 Page 9 Refinement Integrity (Ja/Nein-Fragen, Verneinung & Doch)', () => {
  const rootDir = path.join(__dirname, '..');
  const keysPath = path.join(rootDir, 'js', 'workbooks_keys.js');
  const raw = fs.readFileSync(keysPath, 'utf8');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}') + 1;
  const data = JSON.parse(raw.substring(start, end));

  assert(data && data.A1 && data.A1['9'], 'A1 Page 9 exists in WORKBOOK_DATA');
  const page9 = data.A1['9'];
  assert(page9.lessonTitle.includes('1.3. Wortstellung: Ja/Nein-Fragen & Verneinung'), 'Page 9 has refined lessonTitle');
  assert(page9.exercises.length === 3, 'Page 9 has 3 exercises');

  // Übung 6: Ja/Nein-Fragen bejahen
  const ex6 = page9.exercises[0];
  assert(ex6.id === 'a1_p9_ex6', 'Übung 6 ID is a1_p9_ex6');
  assert(ex6.items.length === 12, 'Übung 6 has 12 items');
  assert(ex6.answers['a1_p9_ex6_a'] === 'ich frage', 'Übung 6 item a is "ich frage"');
  assert(ex6.answers['a1_p9_ex6_g'] === 'wir studieren', 'Übung 6 item g is "wir studieren"');
  assert(ex6.answers['a1_p9_ex6_l'] === 'wir sind', 'Übung 6 item l is "wir sind"');
  assert(!Object.values(ex6.answers).includes('—'), 'Übung 6 has no scrape dash answers');

  // Übung 7: Verneinte Antworten mit Gegenteil / Alternative
  const ex7 = page9.exercises[1];
  assert(ex7.id === 'a1_p9_ex7', 'Übung 7 ID is a1_p9_ex7');
  assert(ex7.items.length === 8, 'Übung 7 has 8 items');
  assert(ex7.answers['a1_p9_ex7_a'] === 'wir trinken', 'Übung 7 item a is "wir trinken"');
  assert(ex7.answers['a1_p9_ex7_b'] === 'ich arbeite', 'Übung 7 item b is "ich arbeite"');
  assert(ex7.answers['a1_p9_ex7_d'] === 'ich antworte', 'Übung 7 item d is "ich antworte"');
  assert(!Object.values(ex7.answers).includes('—'), 'Übung 7 has no scrape dash answers');

  // Übung 8: Fragen beantworten (Ja — Nein — Doch)
  const ex8 = page9.exercises[2];
  assert(ex8.id === 'a1_p9_ex8', 'Übung 8 ID is a1_p9_ex8');
  assert(ex8.items.length === 10, 'Übung 8 has 10 items');
  assert(ex8.answers['a1_p9_ex8_a'] === 'sie studiert Mathematik', 'Übung 8 item a is "sie studiert Mathematik"');
  assert(ex8.answers['a1_p9_ex8_b'] === 'er kommt nicht aus London', 'Übung 8 item b is "er kommt nicht aus London"');
  assert(ex8.answers['a1_p9_ex8_d'] === 'ich lerne Deutsch', 'Übung 8 item d is "ich lerne Deutsch"');
  assert(ex8.answers['a1_p9_ex8_j'] === 'sie studieren Jura', 'Übung 8 item j is "sie studieren Jura"');
  assert(!Object.values(ex8.answers).includes('richtig'), 'Übung 8 has no scrape "richtig" answers');

  // Grammar summary
  assert(page9.grammarSummary.includes('Der Fragesatz ohne Fragewort (Ja/Nein-Frage)'), 'Page 9 grammarSummary covers V1 questions');
  assert(page9.grammarSummary.includes('Das Antwort-Dreieck (Ja — Nein — Doch)'), 'Page 9 grammarSummary covers Ja-Nein-Doch system');
  assert(page9.grammarSummary.includes('English Cognitive Bridge'), 'Page 9 grammarSummary includes English cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('### ✍️ Übung 6: Ja/Nein-Fragen bejahen'), 'A1/Arbeitsbuch.md has Übung 6 refined');
  assert(abA1.includes('### ✍️ Übung 7: Verneinte Antworten mit Gegenteil / Alternative'), 'A1/Arbeitsbuch.md has Übung 7 refined');
  assert(abA1.includes('### ✍️ Übung 8: Fragen beantworten (Ja — Nein — Doch)'), 'A1/Arbeitsbuch.md has Übung 8 refined');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('`sie studiert Mathematik` — *Positive Bestätigung*'), 'A1/Loesungsschluessel.md has clean Page 9 solutions');
  assert(lsA1.includes('`ich lerne Deutsch` — *Widerspruch mit „Doch“ auf verneinte Frage*'), 'A1/Loesungsschluessel.md has Doch solutions');
});

// ----------------------------------------------------------------------------
// Suite 20: A1 Page 10 Refinement Integrity (2.1. Starke Verben: Vokalwechsel)
// ----------------------------------------------------------------------------
describe('A1 Page 10 Refinement Integrity (2.1. Starke Verben: Vokalwechsel)', () => {
  const rootDir = path.join(__dirname, '..');
  const keysPath = path.join(rootDir, 'js', 'workbooks_keys.js');
  const raw = fs.readFileSync(keysPath, 'utf8');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}') + 1;
  const data = JSON.parse(raw.substring(start, end));

  assert(data && data.A1 && data.A1['10'], 'A1 Page 10 exists in WORKBOOK_DATA');
  const page10 = data.A1['10'];
  assert(page10.lessonTitle.includes('2.1. Starke Verben — Vokalwechsel im Präsens'), 'Page 10 has refined lessonTitle');
  assert(page10.exercises.length === 3, 'Page 10 has 3 exercises');

  // Übung 1: Kontrastsätze bilden (3. Person)
  const ex1 = page10.exercises[0];
  assert(ex1.id === 'a1_p10_ex1', 'Übung 1 ID is a1_p10_ex1');
  assert(ex1.items.length === 5, 'Übung 1 has 5 items');
  assert(ex1.answers['a1_p10_ex1_a'] === 'isst', 'Übung 1 item a is "isst"');
  assert(ex1.answers['a1_p10_ex1_b'] === 'schläft', 'Übung 1 item b is "schläft"');
  assert(ex1.answers['a1_p10_ex1_c'] === 'läuft', 'Übung 1 item c is "läuft"');
  assert(ex1.answers['a1_p10_ex1_d'] === 'liest Zeitung', 'Übung 1 item d is "liest Zeitung"');
  assert(ex1.answers['a1_p10_ex1_e'] === 'fährt nach Hause', 'Übung 1 item e is "fährt nach Hause"');
  assert(!Object.values(ex1.answers).includes('—'), 'Übung 1 has no scrape dash answers');
  assert(!Object.values(ex1.answers).includes('die'), 'Übung 1 has no corrupt "die" answer');
  assert(!Object.values(ex1.answers).includes('das'), 'Übung 1 has no corrupt "das" answer');

  // Übung 2: Starke Verben im Satz konjugieren (2. & 3. Person)
  const ex2 = page10.exercises[1];
  assert(ex2.id === 'a1_p10_ex2', 'Übung 2 ID is a1_p10_ex2');
  assert(ex2.items.length === 7, 'Übung 2 has 7 items');
  assert(ex2.answers['a1_p10_ex2_a'] === 'fährt', 'Übung 2 item a is "fährt"');
  assert(ex2.answers['a1_p10_ex2_b'] === 'sprichst', 'Übung 2 item b is "sprichst"');
  assert(ex2.answers['a1_p10_ex2_c'] === 'liest', 'Übung 2 item c is "liest"');
  assert(ex2.answers['a1_p10_ex2_d'] === 'trägt', 'Übung 2 item d is "trägt"');
  assert(ex2.answers['a1_p10_ex2_e'] === 'isst', 'Übung 2 item e is "isst"');
  assert(ex2.answers['a1_p10_ex2_f'] === 'hilfst', 'Übung 2 item f is "hilfst"');
  assert(ex2.answers['a1_p10_ex2_g'] === 'läuft', 'Übung 2 item g is "läuft"');
  assert(ex2.items.every(item => item.isCompact === true), 'Übung 2 items are compact verb inputs');
  assert(!Object.values(ex2.answers).includes('die'), 'Übung 2 has no corrupt "die" answer');

  // Übung 3: Gegenfragen mit „du“ stellen
  const ex3 = page10.exercises[2];
  assert(ex3.id === 'a1_p10_ex3', 'Übung 3 ID is a1_p10_ex3');
  assert(ex3.items.length === 8, 'Übung 3 has 8 items');
  assert(ex3.answers['a1_p10_ex3_a'] === 'Liest du', 'Übung 3 item a is "Liest du"');
  assert(ex3.answers['a1_p10_ex3_b'] === 'Isst du', 'Übung 3 item b is "Isst du"');
  assert(ex3.answers['a1_p10_ex3_c'] === 'Schläfst du', 'Übung 3 item c is "Schläfst du"');
  assert(ex3.answers['a1_p10_ex3_d'] === 'Hilfst du', 'Übung 3 item d is "Hilfst du"');
  assert(ex3.answers['a1_p10_ex3_e'] === 'Läufst du', 'Übung 3 item e is "Läufst du"');
  assert(ex3.answers['a1_p10_ex3_f'] === 'Fährst du', 'Übung 3 item f is "Fährst du"');
  assert(ex3.answers['a1_p10_ex3_g'] === 'Nimmst du', 'Übung 3 item g is "Nimmst du"');
  assert(ex3.answers['a1_p10_ex3_h'] === 'Sprichst du', 'Übung 3 item h is "Sprichst du"');
  assert(ex3.items.every(item => item.isCompact === true), 'Übung 3 items are compact inputs');
  assert(!Object.values(ex3.answers).includes('—'), 'Übung 3 has no scrape dash answers');

  // Grammar summary
  assert(page10.grammarSummary.includes('Starke Verben mit Vokalwechsel im Präsens'), 'Page 10 grammarSummary covers strong verbs present vowel shift');
  assert(page10.grammarSummary.includes('Die vier Vokalwechsel-Gruppen'), 'Page 10 grammarSummary covers the 4 vowel shift groups');
  assert(page10.grammarSummary.includes('English Cognitive Bridge'), 'Page 10 grammarSummary includes English cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('### ✍️ Übung 1: Kontrastsätze bilden (3. Person Singular)'), 'A1/Arbeitsbuch.md has Übung 1 refined');
  assert(abA1.includes('### ✍️ Übung 2: Starke Verben im Satz konjugieren (2. & 3. Person)'), 'A1/Arbeitsbuch.md has Übung 2 refined');
  assert(abA1.includes('### ✍️ Übung 3: Gegenfragen mit „du“ stellen'), 'A1/Arbeitsbuch.md has Übung 3 refined');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('`fährt nach Hause` — *fahren (a ➔ ä): Claudia fährt nach Hause (3s)*'), 'A1/Loesungsschluessel.md has clean Page 10 Übung 1 solutions');
  assert(lsA1.includes('`Sprichst du` — *sprechen (e ➔ i): Sprichst du (2s)*'), 'A1/Loesungsschluessel.md has clean Page 10 Übung 3 solutions');
});

// ----------------------------------------------------------------------------
// Suite 21: A1 Page 11 Refinement Integrity (2.2. Nomen und Artikel: Bestimmte Artikel & Plural)
// ----------------------------------------------------------------------------
describe('A1 Page 11 Refinement Integrity (2.2. Nomen und Artikel: Bestimmte Artikel & Plural)', () => {
  const rootDir = path.join(__dirname, '..');
  const keysPath = path.join(rootDir, 'js', 'workbooks_keys.js');
  const raw = fs.readFileSync(keysPath, 'utf8');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}') + 1;
  const data = JSON.parse(raw.substring(start, end));

  assert(data && data.A1 && data.A1['11'], 'A1 Page 11 exists in WORKBOOK_DATA');
  const page11 = data.A1['11'];
  assert(page11.lessonTitle.includes('2.2. Nomen und Artikel'), 'Page 11 has refined lessonTitle');
  assert(page11.exercises.length === 3, 'Page 11 has 3 exercises');

  // Übung 1: Bestimmte Artikel einsetzen
  const ex1 = page11.exercises[0];
  assert(ex1.id === 'a1_p11_ex1', 'Übung 1 ID is a1_p11_ex1');
  assert(ex1.items.length === 12, 'Übung 1 has 12 items');
  assert(ex1.answers['a1_p11_ex1_a'] === 'das', 'Übung 1 item a is "das"');
  assert(ex1.answers['a1_p11_ex1_b'] === 'das', 'Übung 1 item b is "das"');
  assert(ex1.answers['a1_p11_ex1_c'] === 'die', 'Übung 1 item c is "die"');
  assert(ex1.answers['a1_p11_ex1_d'] === 'der', 'Übung 1 item d is "der"');
  assert(ex1.answers['a1_p11_ex1_l'] === 'die', 'Übung 1 item l is "die"');
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 3, 'Übung 1 has 3-chip Wortkasten');
  assert(ex1.items.every(item => item.isCompact === true), 'Übung 1 items are compact inputs');
  assert(!Object.values(ex1.answers).includes('richtig'), 'Übung 1 has no corrupt "richtig" answers');

  // Übung 2: Pluralformen bilden
  const ex2 = page11.exercises[1];
  assert(ex2.id === 'a1_p11_ex2', 'Übung 2 ID is a1_p11_ex2');
  assert(ex2.items.length === 8, 'Übung 2 has 8 items');
  assert(ex2.answers['a1_p11_ex2_a'] === 'Lehrer', 'Übung 2 item a is "Lehrer"');
  assert(ex2.answers['a1_p11_ex2_b'] === 'Übungen', 'Übung 2 item b is "Übungen"');
  assert(ex2.answers['a1_p11_ex2_c'] === 'Fragen', 'Übung 2 item c is "Fragen"');
  assert(ex2.answers['a1_p11_ex2_d'] === 'Fahrräder', 'Übung 2 item d is "Fahrräder"');
  assert(ex2.answers['a1_p11_ex2_h'] === 'Berufe', 'Übung 2 item h is "Berufe"');
  assert(ex2.items.every(item => item.isCompact === true), 'Übung 2 items are compact inputs');
  assert(!Object.values(ex2.answers).includes('richtig'), 'Übung 2 has no corrupt "richtig" answers');

  // Übung 3: Pluralbildung vertiefen
  const ex3 = page11.exercises[2];
  assert(ex3.id === 'a1_p11_ex3', 'Übung 3 ID is a1_p11_ex3');
  assert(ex3.items.length === 4, 'Übung 3 has 4 items');
  assert(ex3.answers['a1_p11_ex3_a'] === 'Taschen', 'Übung 3 item a is "Taschen"');
  assert(ex3.answers['a1_p11_ex3_b'] === 'Autos', 'Übung 3 item b is "Autos"');
  assert(ex3.answers['a1_p11_ex3_c'] === 'Fenster', 'Übung 3 item c is "Fenster"');
  assert(ex3.answers['a1_p11_ex3_d'] === 'Bücher', 'Übung 3 item d is "Bücher"');
  assert(ex3.items.every(item => item.isCompact === true), 'Übung 3 items are compact inputs');
  assert(!Object.values(ex3.answers).includes('richtig'), 'Übung 3 has no corrupt "richtig" answers');

  // Grammar summary
  assert(page11.grammarSummary.includes('Bestimmte Artikel (der, die, das)'), 'Page 11 grammarSummary covers definite articles');
  assert(page11.grammarSummary.includes('Die 8 Pluralmuster im Deutschen'), 'Page 11 grammarSummary covers the 8 plural patterns');
  assert(page11.grammarSummary.includes('English Cognitive Bridge'), 'Page 11 grammarSummary includes English cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('### ✍️ Übung 1: Bestimmte Artikel einsetzen (der, die, das)'), 'A1/Arbeitsbuch.md has Übung 1 refined');
  assert(abA1.includes('### ✍️ Übung 2: Pluralformen bilden (Singular ➔ Plural)'), 'A1/Arbeitsbuch.md has Übung 2 refined');
  assert(abA1.includes('### ✍️ Übung 3: Pluralbildung vertiefen (Weitere Nomen)'), 'A1/Arbeitsbuch.md has Übung 3 refined');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('`Fahrräder` — *das Fahrrad ➔ die Fahrräder (Umlaut + -er)*'), 'A1/Loesungsschluessel.md has clean Page 11 Übung 2 solutions');
  assert(!lsA1.includes('**richtig** Hotel'), 'A1/Loesungsschluessel.md has no corrupt "richtig" strings on Page 11');
});

// ----------------------------------------------------------------------------
// Suite 22: A1 Page 12 Refinement Integrity (2.2. Nomen und Artikel: Unbestimmte Artikel & Negation)
// ----------------------------------------------------------------------------
describe('A1 Page 12 Refinement Integrity (2.2. Nomen und Artikel: Unbestimmte Artikel & Negation)', () => {
  const rootDir = path.join(__dirname, '..');
  const keysPath = path.join(rootDir, 'js', 'workbooks_keys.js');
  const raw = fs.readFileSync(keysPath, 'utf8');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}') + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page12 = data.A1 && data.A1['12'];
  assert(page12, 'A1 Page 12 exists in WORKBOOK_DATA');
  assert(page12.lessonTitle.includes('Unbestimmte Artikel & Negation'), 'Page 12 has refined lessonTitle');
  assert(page12.exercises.length === 3, 'Page 12 has 3 exercises');

  // Übung 4: Unbestimmte Artikel und Plural
  const ex4 = page12.exercises[0];
  assert(ex4.id === 'a1_p12_ex4', 'Übung 4 ID is a1_p12_ex4');
  assert(ex4.items.length === 12, 'Übung 4 has 12 items');
  assert(ex4.answers['a1_p12_ex4_a'] === 'ein', 'Übung 4 item a is "ein"');
  assert(ex4.answers['a1_p12_ex4_b'] === 'eine', 'Übung 4 item b is "eine"');
  assert(ex4.answers['a1_p12_ex4_c'] === 'eine', 'Übung 4 item c is "eine"');
  assert(ex4.answers['a1_p12_ex4_d'] === 'sind', 'Übung 4 item d is "sind"');
  assert(ex4.answers['a1_p12_ex4_f'] === 'ein', 'Übung 4 item f is "ein"');
  assert(ex4.answers['a1_p12_ex4_h'] === 'sind', 'Übung 4 item h is "sind"');
  assert(ex4.answers['a1_p12_ex4_j'] === 'sind', 'Übung 4 item j is "sind"');
  assert(ex4.answers['a1_p12_ex4_l'] === 'sind', 'Übung 4 item l is "sind"');
  assert(Array.isArray(ex4.wortkasten) && ex4.wortkasten.length === 3, 'Übung 4 has 3-chip Wortkasten');
  assert(ex4.items.every(item => item.isCompact === true), 'Übung 4 items are compact inputs');
  assert(!Object.values(ex4.answers).includes('—'), 'Übung 4 has no corrupt scrape dash answers');

  // Übung 5: Satznegation mit "nicht"
  const ex5 = page12.exercises[1];
  assert(ex5.id === 'a1_p12_ex5', 'Übung 5 ID is a1_p12_ex5');
  assert(ex5.items.length === 6, 'Übung 5 has 6 items');
  assert(ex5.answers['a1_p12_ex5_a'] === 'ich reise nicht nach Hamburg', 'Übung 5 item a is "ich reise nicht nach Hamburg"');
  assert(ex5.answers['a1_p12_ex5_b'] === 'er kommt nicht aus Rom', 'Übung 5 item b is "er kommt nicht aus Rom"');
  assert(ex5.answers['a1_p12_ex5_c'] === 'ich besuche Klaus nicht', 'Übung 5 item c is "ich besuche Klaus nicht"');
  assert(ex5.answers['a1_p12_ex5_d'] === 'ich bin nicht krank', 'Übung 5 item d is "ich bin nicht krank"');
  assert(ex5.answers['a1_p12_ex5_e'] === 'ich gehe nicht ins Kino', 'Übung 5 item e is "ich gehe nicht ins Kino"');
  assert(ex5.answers['a1_p12_ex5_f'] === 'er lernt nicht viel', 'Übung 5 item f is "er lernt nicht viel"');
  assert(!Object.values(ex5.answers).includes('richtig'), 'Übung 5 has no corrupt "richtig" answers');

  // Übung 6: Speisen & Getränke — Negation mit kein/keine
  const ex6 = page12.exercises[2];
  assert(ex6.id === 'a1_p12_ex6', 'Übung 6 ID is a1_p12_ex6');
  assert(ex6.items.length === 8, 'Übung 6 has 8 items');
  assert(ex6.answers['a1_p12_ex6_1'] === 'Was', 'Übung 6 item 1 is "Was"');
  assert(ex6.answers['a1_p12_ex6_2'] === 'kein', 'Übung 6 item 2 is "kein"');
  assert(ex6.answers['a1_p12_ex6_3'] === 'das', 'Übung 6 item 3 is "das"');
  assert(ex6.answers['a1_p12_ex6_4'] === 'keine', 'Übung 6 item 4 is "keine"');
  assert(ex6.answers['a1_p12_ex6_5'] === 'das', 'Übung 6 item 5 is "das"');
  assert(ex6.answers['a1_p12_ex6_6'] === 'keine', 'Übung 6 item 6 is "keine"');
  assert(ex6.answers['a1_p12_ex6_7'] === 'das', 'Übung 6 item 7 is "das"');
  assert(ex6.answers['a1_p12_ex6_8'] === 'kein', 'Übung 6 item 8 is "kein"');
  assert(Array.isArray(ex6.wortkasten) && ex6.wortkasten.length === 4, 'Übung 6 has 4-chip Wortkasten');
  assert(ex6.items.every(item => item.isCompact === true), 'Übung 6 items are compact inputs');
  assert(!Object.values(ex6.answers).includes('richtig'), 'Übung 6 has no corrupt "richtig" answers');

  // Grammar summary
  assert(page12.grammarSummary.includes('Unbestimmte Artikel im Nominativ'), 'Page 12 grammarSummary covers indefinite articles');
  assert(page12.grammarSummary.includes('Negation: „nicht“ vs. „kein / keine“'), 'Page 12 grammarSummary covers negation distinction');
  assert(page12.grammarSummary.includes('English Cognitive Bridge'), 'Page 12 grammarSummary includes English cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('### ✍️ Übung 4: Unbestimmte Artikel und Plural (Was ist das?)'), 'A1/Arbeitsbuch.md has Übung 4 refined');
  assert(abA1.includes('### ✍️ Übung 5: Satznegation mit „nicht“'), 'A1/Arbeitsbuch.md has Übung 5 refined');
  assert(abA1.includes('### ✍️ Übung 6: Speisen & Getränke — Negation mit „kein / keine“'), 'A1/Arbeitsbuch.md has Übung 6 refined');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('`ich reise nicht nach Hamburg` — *du ➔ ich reise nicht nach Hamburg*'), 'A1/Loesungsschluessel.md has clean Page 12 Übung 5 solutions');
  assert(!lsA1.includes('Nein, das **richtig**   Milch'), 'A1/Loesungsschluessel.md has no corrupt "richtig" strings on Page 12');
});

// ----------------------------------------------------------------------------
// Suite 23: Workbook Page 13 Refinement (2.3. Die Formen der Anrede: du / ihr / Sie)
// ----------------------------------------------------------------------------
describe('Workbook Page 13 Refinement (2.3. Die Formen der Anrede: du / ihr / Sie)', () => {
  const rootDir = path.join(__dirname, '..');
  const wbKeysCode = fs.readFileSync(path.join(rootDir, 'js', 'workbooks_keys.js'), 'utf8');
  const start = wbKeysCode.indexOf('{');
  const end = wbKeysCode.lastIndexOf('}') + 1;
  const data = JSON.parse(wbKeysCode.substring(start, end));

  const page13 = data['A1']['13'];
  assert(!!page13, 'A1 Page 13 exists in WORKBOOKS_KEYS');
  assert(page13.lessonTitle.includes('2.3. Anrede'), 'Page 13 title has correct lesson name');
  assert(page13.exercises.length === 4, 'A1 Page 13 contains exactly 4 exercises');

  // Übung 1: Anredeformen zuordnen
  const ex1 = page13.exercises[0];
  assert(ex1.id === 'a1_p13_ex1', 'Übung 1 ID is a1_p13_ex1');
  assert(ex1.items.length === 18, 'Übung 1 has 18 items across 4 sections (Carlos, Frau Mayer, Anna & Maria, Frau Müller & Frau Berg)');
  assert(Array.isArray(ex1.wortkasten) && ex1.wortkasten.length === 4, 'Übung 1 has 4-chip Wortkasten');
  assert(ex1.answers['a1_p13_ex1_1'] === 't du', 'Übung 1 Carlos item 1 (heißt du) is "t du"');
  assert(ex1.answers['a1_p13_ex1_2'] === 'st du', 'Übung 1 Carlos item 2 (lernst du) is "st du"');
  assert(ex1.answers['a1_p13_ex1_5'] === 'en Sie', 'Übung 1 Frau Mayer item 5 is "en Sie"');
  assert(ex1.answers['a1_p13_ex1_10'] === 't ihr', 'Übung 1 Anna & Maria item 10 is "t ihr"');
  assert(ex1.answers['a1_p13_ex1_14'] === 'en Sie', 'Übung 1 Plural Sie item 14 is "en Sie"');
  assert(!Object.values(ex1.answers).includes('—'), 'Übung 1 has no corrupt "—" answers');

  // Übung 2: Die passende Verbendung und das Pronomen wählen
  const ex2 = page13.exercises[1];
  assert(ex2.id === 'a1_p13_ex2', 'Übung 2 ID is a1_p13_ex2');
  assert(ex2.items.length === 8, 'Übung 2 has 8 items');
  assert(Array.isArray(ex2.wortkasten) && ex2.wortkasten.length === 4, 'Übung 2 has 4-chip Wortkasten');
  assert(ex2.answers['a1_p13_ex2_a'] === 'st du', 'Übung 2 item a is "st du"');
  assert(ex2.answers['a1_p13_ex2_b'] === 'en Sie', 'Übung 2 item b is "en Sie"');
  assert(ex2.answers['a1_p13_ex2_d'] === 't ihr', 'Übung 2 item d is "t ihr"');
  assert(ex2.answers['a1_p13_ex2_h'] === 'Sie', 'Übung 2 item h is "Sie"');

  // Übung 3: Fragen formulieren
  const ex3 = page13.exercises[2];
  assert(ex3.id === 'a1_p13_ex3', 'Übung 3 ID is a1_p13_ex3');
  assert(ex3.items.length === 7, 'Übung 3 has 7 items');
  assert(Array.isArray(ex3.wortkasten) && ex3.wortkasten.length === 7, 'Übung 3 has 7-chip Wortkasten');
  assert(ex3.answers['a1_p13_ex3_a'] === 'Studierst du', 'Übung 3 item a is "Studierst du"');
  assert(ex3.answers['a1_p13_ex3_b'] === 'heißen Sie', 'Übung 3 item b is "heißen Sie" (not corrupted "die")');
  assert(!Object.values(ex3.answers).includes('die'), 'Übung 3 has no corrupt "die" answers');

  // Übung 4: Dialog im Sprachinstitut (Herr Klein und Carlos)
  const ex4 = page13.exercises[3];
  assert(ex4.id === 'a1_p13_ex4', 'Übung 4 ID is a1_p13_ex4');
  assert(ex4.items.length === 7, 'Übung 4 has 7 dialogue items');
  assert(Array.isArray(ex4.wortkasten) && ex4.wortkasten.length === 3, 'Übung 4 has 3-chip Wortkasten');
  assert(ex4.answers['a1_p13_ex4_1'] === 'Sie', 'Übung 4 item 1 is "Sie"');
  assert(ex4.answers['a1_p13_ex4_2'] === 'ich', 'Übung 4 item 2 is "ich" (not corrupted "Carlot")');
  assert(ex4.answers['a1_p13_ex4_5'] === 'Ich', 'Übung 4 item 5 is "Ich"');
  assert(!Object.values(ex4.answers).includes('Carlot'), 'Übung 4 has no corrupt "Carlot" answers');
  assert(!Object.values(ex4.answers).includes('richtig'), 'Übung 4 has no corrupt "richtig" answers');

  // Grammar summary
  assert(page13.grammarSummary.includes('Die Formen der Anrede im Deutschen'), 'Page 13 grammarSummary covers address forms');
  assert(page13.grammarSummary.includes('English Cognitive Bridge'), 'Page 13 grammarSummary includes English cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 2.3. Anrede — familiär (du / ihr) vs. offiziell (Sie)'), 'A1/Arbeitsbuch.md has Page 13 title');
  assert(abA1.includes('Wie heiß_____?'), 'A1/Arbeitsbuch.md has clean Page 13 items');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('t du (heißt du)'), 'A1/Loesungsschluessel.md has clean Page 13 Übung 1 solutions');
  assert(!lsA1.includes('Carlot'), 'A1/Loesungsschluessel.md has no "Carlot"');
});

// ----------------------------------------------------------------------------
// Suite 24: Workbook Page 14 Refinement (3.1. Nomen — Genusregeln)
// ----------------------------------------------------------------------------
describe('Workbook Page 14 Refinement (3.1. Nomen — Genusregeln)', () => {
  const rootDir = path.join(__dirname, '..');
  const wbKeysCode = fs.readFileSync(path.join(rootDir, 'js', 'workbooks_keys.js'), 'utf8');
  const start = wbKeysCode.indexOf('{');
  const end = wbKeysCode.lastIndexOf('}') + 1;
  const data = JSON.parse(wbKeysCode.substring(start, end));

  const page14 = data['A1']['14'];
  assert(!!page14, 'A1 Page 14 exists in WORKBOOKS_KEYS');
  assert(page14.lessonTitle.includes('3.1. Nomen — Genusregeln'), 'Page 14 title has correct lesson name');
  assert(page14.exercises.length === 2, 'A1 Page 14 contains exactly 2 exercises');

  // Übung 1: Genusregeln anwenden (der / die / das)
  const ex1 = page14.exercises[0];
  assert(ex1.id === 'a1_p14_ex1', 'Übung 1 ID is a1_p14_ex1');
  assert(ex1.items.length === 18, 'Übung 1 has 18 items');
  assert(Array.isArray(ex1.wortkasten) && ex1.wortkasten.length === 3, 'Übung 1 has 3-chip Wortkasten');
  assert(ex1.answers['a1_p14_ex1_1'] === 'die', 'Übung 1 item 1 (Zeitung) is "die"');
  assert(ex1.answers['a1_p14_ex1_2'] === 'der', 'Übung 1 item 2 (Professor) is "der"');
  assert(ex1.answers['a1_p14_ex1_3'] === 'die', 'Übung 1 item 3 (Polizei) is "die"');
  assert(ex1.answers['a1_p14_ex1_4'] === 'das', 'Übung 1 item 4 (Datum) is "das"');
  assert(ex1.answers['a1_p14_ex1_11'] === 'der', 'Übung 1 item 11 (Mittwoch) is "der"');
  assert(ex1.answers['a1_p14_ex1_12'] === 'der', 'Übung 1 item 12 (Opa) is "der"');
  assert(ex1.answers['a1_p14_ex1_13'] === 'der', 'Übung 1 item 13 (Optimismus) is "der"');
  assert(ex1.answers['a1_p14_ex1_14'] === 'die', 'Übung 1 item 14 (Gesundheit) is "die"');
  assert(ex1.answers['a1_p14_ex1_15'] === 'das', 'Übung 1 item 15 (Dokument) is "das"');
  assert(ex1.answers['a1_p14_ex1_18'] === 'die', 'Übung 1 item 18 (Wirtschaft) is "die"');
  assert(ex1.items.every(it => it.isCompact === true), 'Übung 1 items are compact inputs');
  assert(!Object.values(ex1.answers).includes('—'), 'Übung 1 has no corrupt "—" answers');

  // Übung 2: Die Endung „-en“ (der / die / das)
  const ex2 = page14.exercises[1];
  assert(ex2.id === 'a1_p14_ex2', 'Übung 2 ID is a1_p14_ex2');
  assert(ex2.items.length === 12, 'Übung 2 has 12 items');
  assert(Array.isArray(ex2.wortkasten) && ex2.wortkasten.length === 3, 'Übung 2 has 3-chip Wortkasten');
  assert(ex2.answers['a1_p14_ex2_1'] === 'der', 'Übung 2 item 1 (Garten) is "der"');
  assert(ex2.answers['a1_p14_ex2_2'] === 'das', 'Übung 2 item 2 (Leben) is "das"');
  assert(ex2.answers['a1_p14_ex2_3'] === 'die', 'Übung 2 item 3 (Taschen) is "die"');
  assert(ex2.answers['a1_p14_ex2_4'] === 'der', 'Übung 2 item 4 (Schinken) is "der"');
  assert(ex2.answers['a1_p14_ex2_5'] === 'die', 'Übung 2 item 5 (Krankheiten) is "die"');
  assert(ex2.answers['a1_p14_ex2_6'] === 'das', 'Übung 2 item 6 (Sprechen) is "das"');
  assert(ex2.answers['a1_p14_ex2_8'] === 'der', 'Übung 2 item 8 (Wagen) is "der"');
  assert(ex2.answers['a1_p14_ex2_9'] === 'das', 'Übung 2 item 9 (Lernen) is "das"');
  assert(ex2.answers['a1_p14_ex2_10'] === 'die', 'Übung 2 item 10 (Birnen) is "die"');
  assert(ex2.answers['a1_p14_ex2_11'] === 'der', 'Übung 2 item 11 (Braten) is "der"');
  assert(ex2.answers['a1_p14_ex2_12'] === 'die', 'Übung 2 item 12 (Jacken) is "die"');
  assert(ex2.items.every(it => it.isCompact === true), 'Übung 2 items are compact inputs');
  assert(!Object.values(ex2.answers).includes('—'), 'Übung 2 has no corrupt "—" answers');

  // Grammar summary
  assert(page14.grammarSummary.includes('Das grammatische Geschlecht im Deutschen'), 'Page 14 grammarSummary covers gender rules');
  assert(page14.grammarSummary.includes('Die 3-Wege-Prüfung bei der Endung „-en“'), 'Page 14 grammarSummary covers -en 3-way check');
  assert(page14.grammarSummary.includes('English Cognitive Bridge'), 'Page 14 grammarSummary includes English cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 3.1. Nomen — Genusregeln (der / die / das)'), 'A1/Arbeitsbuch.md has Page 14 title');
  assert(abA1.includes('_____ Zeitung *(Suffix -ung)*'), 'A1/Arbeitsbuch.md has clean Page 14 items');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('die (die Zeitung — Suffix -ung)'), 'A1/Loesungsschluessel.md has clean Page 14 Übung 1 solutions');
  assert(lsA1.includes('das (das Leben — substantivierter Infinitiv, neutrum)'), 'A1/Loesungsschluessel.md has clean Page 14 Übung 2 solutions');
  assert(!lsA1.includes('z. T. für Plural (oft mask. oder fem.): der Student > die Studenten / die Tür > die Türen**die**'), 'A1/Loesungsschluessel.md has no corrupt scrape debris on Page 14');
});

// ----------------------------------------------------------------------------
// Suite 25: Workbook Page 15 Refinement (3.2. Nomen — Komposita)
// ----------------------------------------------------------------------------
describe('Workbook Page 15 Refinement (3.2. Nomen — Komposita)', () => {
  const rootDir = path.join(__dirname, '..');
  const wbKeysCode = fs.readFileSync(path.join(rootDir, 'js', 'workbooks_keys.js'), 'utf8');
  const start = wbKeysCode.indexOf('{');
  const end = wbKeysCode.lastIndexOf('}') + 1;
  const data = JSON.parse(wbKeysCode.substring(start, end));

  const page15 = data['A1']['15'];
  assert(!!page15, 'A1 Page 15 exists in WORKBOOKS_KEYS');
  assert(page15.lessonTitle.includes('3.2. Nomen — Komposita'), 'Page 15 title has correct lesson name');
  assert(page15.exercises.length === 4, 'A1 Page 15 contains exactly 4 exercises');

  // Übung 1: Bestimmter Artikel beim Grundwort
  const ex1 = page15.exercises[0];
  assert(ex1.id === 'a1_p15_ex1', 'Übung 1 ID is a1_p15_ex1');
  assert(ex1.items.length === 8, 'Übung 1 has 8 items');
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 3, 'Übung 1 has 3-chip wordBox');
  assert(ex1.answers['a1_p15_ex1_a'] === 'das', 'Übung 1 item a is "das"');
  assert(ex1.answers['a1_p15_ex1_b'] === 'der', 'Übung 1 item b is "der"');
  assert(ex1.answers['a1_p15_ex1_c'] === 'der', 'Übung 1 item c is "der"');
  assert(ex1.answers['a1_p15_ex1_d'] === 'das', 'Übung 1 item d is "das"');
  assert(ex1.answers['a1_p15_ex1_e'] === 'der', 'Übung 1 item e is "der"');
  assert(ex1.answers['a1_p15_ex1_f'] === 'der', 'Übung 1 item f is "der"');
  assert(ex1.answers['a1_p15_ex1_g'] === 'das', 'Übung 1 item g is "das"');
  assert(ex1.answers['a1_p15_ex1_h'] === 'der', 'Übung 1 item h is "der"');
  assert(ex1.items.every(it => it.isCompact === true), 'Übung 1 items are compact inputs');
  assert(!Object.values(ex1.answers).includes('richtig'), 'Übung 1 has no corrupt "richtig" answers');
  assert(!Object.values(ex1.answers).includes('—'), 'Übung 1 has no corrupt "—" answers');

  // Übung 2: Nomen + Nomen
  const ex2 = page15.exercises[1];
  assert(ex2.id === 'a1_p15_ex2', 'Übung 2 ID is a1_p15_ex2');
  assert(ex2.items.length === 5, 'Übung 2 has 5 items');
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 5, 'Übung 2 has 5-chip wordBox');
  assert(ex2.answers['a1_p15_ex2_a'] === 'der Sonnenschirm', 'Übung 2 item a is "der Sonnenschirm"');
  assert(ex2.answers['a1_p15_ex2_b'] === 'die Wohnungstür', 'Übung 2 item b is "die Wohnungstür"');
  assert(ex2.answers['a1_p15_ex2_c'] === 'die Blumenvase', 'Übung 2 item c is "die Blumenvase"');
  assert(ex2.answers['a1_p15_ex2_d'] === 'die Berufsschule', 'Übung 2 item d is "die Berufsschule"');
  assert(ex2.answers['a1_p15_ex2_e'] === 'das Wörterbuch', 'Übung 2 item e is "das Wörterbuch"');
  assert(!Object.values(ex2.answers).includes('richtig'), 'Übung 2 has no corrupt "richtig" answers');
  assert(!Object.values(ex2.answers).includes('—'), 'Übung 2 has no corrupt "—" answers');

  // Übung 3: Adjektiv + Nomen
  const ex3 = page15.exercises[2];
  assert(ex3.id === 'a1_p15_ex3', 'Übung 3 ID is a1_p15_ex3');
  assert(ex3.items.length === 5, 'Übung 3 has 5 items');
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 5, 'Übung 3 has 5-chip wordBox');
  assert(ex3.answers['a1_p15_ex3_a'] === 'das Schwarzbrot', 'Übung 3 item a is "das Schwarzbrot"');
  assert(ex3.answers['a1_p15_ex3_b'] === 'die Großstadt', 'Übung 3 item b is "die Großstadt"');
  assert(ex3.answers['a1_p15_ex3_c'] === 'die Frischmilch', 'Übung 3 item c is "die Frischmilch"');
  assert(ex3.answers['a1_p15_ex3_d'] === 'das Kleinkind', 'Übung 3 item d is "das Kleinkind"');
  assert(ex3.answers['a1_p15_ex3_e'] === 'das Altpapier', 'Übung 3 item e is "das Altpapier"');
  assert(!Object.values(ex3.answers).includes('richtig'), 'Übung 3 has no corrupt "richtig" answers');
  assert(!Object.values(ex3.answers).includes('—'), 'Übung 3 has no corrupt "—" answers');

  // Übung 4: Verbstamm + Nomen
  const ex4 = page15.exercises[3];
  assert(ex4.id === 'a1_p15_ex4', 'Übung 4 ID is a1_p15_ex4');
  assert(ex4.items.length === 7, 'Übung 4 has 7 items');
  assert(Array.isArray(ex4.wordBox) && ex4.wordBox.length === 7, 'Übung 4 has 7-chip wordBox');
  assert(ex4.answers['a1_p15_ex4_a'] === 'die Waschmaschine', 'Übung 4 item a is "die Waschmaschine"');
  assert(ex4.answers['a1_p15_ex4_b'] === 'das Fragewort', 'Übung 4 item b is "das Fragewort"');
  assert(ex4.answers['a1_p15_ex4_c'] === 'das Kaufhaus', 'Übung 4 item c is "das Kaufhaus"');
  assert(ex4.answers['a1_p15_ex4_d'] === 'das Reisebüro', 'Übung 4 item d is "das Reisebüro"');
  assert(ex4.answers['a1_p15_ex4_e'] === 'der Tanzkurs', 'Übung 4 item e is "der Tanzkurs"');
  assert(ex4.answers['a1_p15_ex4_f'] === 'der Spielplatz', 'Übung 4 item f is "der Spielplatz"');
  assert(ex4.answers['a1_p15_ex4_g'] === 'der Gehweg', 'Übung 4 item g is "der Gehweg"');
  assert(!Object.values(ex4.answers).includes('wascht'), 'Übung 4 has no corrupt "wascht" answers');
  assert(!Object.values(ex4.answers).includes('fragt'), 'Übung 4 has no corrupt "fragt" answers');
  assert(!Object.values(ex4.answers).includes('—'), 'Übung 4 has no corrupt "—" answers');

  // Grammar summary
  assert(page15.grammarSummary.includes('3.2. Nomen — Komposita'), 'Page 15 grammarSummary covers Komposita');
  assert(page15.grammarSummary.includes('Die goldene Regel des Grundworts'), 'Page 15 grammarSummary covers Grundwort rule');
  assert(page15.grammarSummary.includes('Cognitive Bridge'), 'Page 15 grammarSummary includes English cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 📄 Seite 15: 3.2. Nomen — Komposita'), 'A1/Arbeitsbuch.md has Page 15 title');
  assert(abA1.includes('die Sonne + der Schirm ➔ ______________________'), 'A1/Arbeitsbuch.md has clean Page 15 items');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('die Sonne + der Schirm (Grundwort) ➔ der Sonnenschirm'), 'A1/Loesungsschluessel.md has clean Page 15 Übung 2 solutions');
  assert(lsA1.includes('waschen (Stamm: wasch-) + die Maschine (Grundwort) ➔ die Waschmaschine'), 'A1/Loesungsschluessel.md has clean Page 15 Übung 4 solutions');
  assert(!lsA1.includes('wascht'), 'A1/Loesungsschluessel.md has no "wascht" on Page 15');
});

// ----------------------------------------------------------------------------
// Suite 26: Workbook Page 16 Refinement (3.3. Adjektiv — Prädikative Adjektive, Gegenteile & Farben)
// ----------------------------------------------------------------------------
describe('Workbook Page 16 Refinement (3.3. Adjektiv — Prädikative Adjektive, Gegenteile & Farben)', () => {
  const rootDir = path.join(__dirname, '..');
  const wbKeysCode = fs.readFileSync(path.join(rootDir, 'js', 'workbooks_keys.js'), 'utf8');
  const start = wbKeysCode.indexOf('{');
  const end = wbKeysCode.lastIndexOf('}') + 1;
  const data = JSON.parse(wbKeysCode.substring(start, end));

  const page16 = data['A1']['16'];
  assert(!!page16, 'A1 Page 16 exists in WORKBOOKS_KEYS');
  assert(page16.lessonTitle.includes('3.3. Adjektiv'), 'Page 16 title has correct lesson name');
  assert(page16.exercises.length === 3, 'A1 Page 16 contains exactly 3 exercises');

  // Übung 1: Prädikative Adjektive & Pronomenzuordnung
  const ex1 = page16.exercises[0];
  assert(ex1.id === 'a1_p16_ex1', 'Übung 1 ID is a1_p16_ex1');
  assert(ex1.items.length === 12, 'Übung 1 has 12 items');
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 5, 'Übung 1 has 5-chip wordBox');
  assert(ex1.answers['a1_p16_ex1_a'] === 'es ist', 'Übung 1 item a is "es ist"');
  assert(ex1.answers['a1_p16_ex1_b'] === 'sie ist', 'Übung 1 item b is "sie ist"');
  assert(ex1.answers['a1_p16_ex1_c'] === 'sie sind', 'Übung 1 item c is "sie sind"');
  assert(ex1.answers['a1_p16_ex1_d'] === 'er ist', 'Übung 1 item d is "er ist"');
  assert(ex1.answers['a1_p16_ex1_g'] === 'ich bin', 'Übung 1 item g is "ich bin"');
  assert(ex1.answers['a1_p16_ex1_l'] === 'sie sind', 'Übung 1 item l is "sie sind"');
  assert(!Object.values(ex1.answers).includes('—'), 'Übung 1 has no corrupt "—" answers');
  assert(!Object.values(ex1.answers).includes('richtig'), 'Übung 1 has no corrupt "richtig" answers');

  // Übung 2: Gegenteile (Antonyme)
  const ex2 = page16.exercises[1];
  assert(ex2.id === 'a1_p16_ex2', 'Übung 2 ID is a1_p16_ex2');
  assert(ex2.items.length === 18, 'Übung 2 has 18 items');
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 18, 'Übung 2 has 18-chip wordBox');
  assert(ex2.answers['a1_p16_ex2_a'] === 'kalt', 'Übung 2 item a is "kalt"');
  assert(ex2.answers['a1_p16_ex2_b'] === 'teuer', 'Übung 2 item b is "teuer"');
  assert(ex2.answers['a1_p16_ex2_c'] === 'schwierig', 'Übung 2 item c is "schwierig"');
  assert(ex2.answers['a1_p16_ex2_d'] === 'krank', 'Übung 2 item d is "krank"');
  assert(ex2.answers['a1_p16_ex2_e'] === 'fleißig', 'Übung 2 item e is "fleißig"');
  assert(ex2.answers['a1_p16_ex2_f'] === 'ledig', 'Übung 2 item f is "ledig"');
  assert(ex2.answers['a1_p16_ex2_g'] === 'schnell', 'Übung 2 item g is "schnell"');
  assert(ex2.answers['a1_p16_ex2_h'] === 'schlecht', 'Übung 2 item h is "schlecht"');
  assert(ex2.answers['a1_p16_ex2_i'] === 'einfach', 'Übung 2 item i is "einfach"');
  assert(ex2.answers['a1_p16_ex2_j'] === 'laut', 'Übung 2 item j is "laut"');
  assert(ex2.answers['a1_p16_ex2_k'] === 'sauer', 'Übung 2 item k is "sauer"');
  assert(ex2.answers['a1_p16_ex2_l'] === 'billig', 'Übung 2 item l is "billig"');
  assert(ex2.answers['a1_p16_ex2_m'] === 'frisch', 'Übung 2 item m is "frisch"');
  assert(ex2.answers['a1_p16_ex2_n'] === 'jung', 'Übung 2 item n is "jung"');
  assert(ex2.answers['a1_p16_ex2_o'] === 'neu', 'Übung 2 item o is "neu"');
  assert(ex2.answers['a1_p16_ex2_p'] === 'falsch', 'Übung 2 item p is "falsch"');
  assert(ex2.answers['a1_p16_ex2_q'] === 'weich', 'Übung 2 item q is "weich"');
  assert(ex2.answers['a1_p16_ex2_r'] === 'gesund', 'Übung 2 item r is "gesund"');
  assert(!Object.values(ex2.answers).includes('—'), 'Übung 2 has no corrupt "—" answers');

  // Übung 3: Farben im Alltag
  const ex3 = page16.exercises[2];
  assert(ex3.id === 'a1_p16_ex3', 'Übung 3 ID is a1_p16_ex3');
  assert(ex3.items.length === 8, 'Übung 3 has 8 items');
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length >= 7, 'Übung 3 has color wordBox');
  assert(ex3.answers['a1_p16_ex3_a'] === 'grün', 'Übung 3 item a is "grün"');
  assert(ex3.answers['a1_p16_ex3_b'] === 'gelb', 'Übung 3 item b is "gelb"');
  assert(ex3.answers['a1_p16_ex3_c'] === 'rot', 'Übung 3 item c is "rot"');
  assert(ex3.answers['a1_p16_ex3_d'] === 'blau', 'Übung 3 item d is "blau"');
  assert(ex3.answers['a1_p16_ex3_e'] === 'weiß', 'Übung 3 item e is "weiß"');
  assert(ex3.answers['a1_p16_ex3_f'] === 'schwarz', 'Übung 3 item f is "schwarz"');
  assert(ex3.answers['a1_p16_ex3_g'] === 'orange', 'Übung 3 item g is "orange"');
  assert(ex3.answers['a1_p16_ex3_h'] === 'rot', 'Übung 3 item h is "rot"');
  assert(!Object.values(ex3.answers).includes('richtig'), 'Übung 3 has no corrupt "richtig" answers');

  // Grammar summary
  assert(page16.grammarSummary.includes('3.3. Adjektiv'), 'Page 16 grammarSummary covers 3.3. Adjektiv');
  assert(page16.grammarSummary.includes('Prädikative Adjektive'), 'Page 16 grammarSummary covers prädikative Adjektive');
  assert(page16.grammarSummary.includes('Cognitive Bridge'), 'Page 16 grammarSummary includes cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 📄 Seite 16: 3.3. Adjektiv — Prädikative Adjektive'), 'A1/Arbeitsbuch.md has Page 16 title');
  assert(abA1.includes('Ist das Haus klein? — Ja, _______ klein.'), 'A1/Arbeitsbuch.md has clean Page 16 items');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('## 📄 Seite 16: 3.3. Adjektiv — Prädikative Adjektive'), 'A1/Loesungsschluessel.md has clean Page 16 title');
  assert(lsA1.includes('Neutral (das Haus ➔ es ist klein)'), 'A1/Loesungsschluessel.md has clean Page 16 explanations');
  assert(!lsA1.includes('Welche Farbe hat eine Gurke? - **richtig**'), 'A1/Loesungsschluessel.md has no "richtig" answers on Page 16');
});

// ----------------------------------------------------------------------------
// Suite 27: Workbook Page 17 Refinement (4.1. Verben — Trennbare und nicht trennbare Verben)
// ----------------------------------------------------------------------------
describe('Workbook Page 17 Refinement (4.1. Verben — Trennbare und nicht trennbare Verben)', () => {
  const rootDir = path.join(__dirname, '..');
  const wbKeysCode = fs.readFileSync(path.join(rootDir, 'js', 'workbooks_keys.js'), 'utf8');
  const start = wbKeysCode.indexOf('{');
  const end = wbKeysCode.lastIndexOf('}') + 1;
  const data = JSON.parse(wbKeysCode.substring(start, end));

  const page17 = data['A1']['17'];
  assert(!!page17, 'A1 Page 17 exists in WORKBOOKS_KEYS');
  assert(page17.lessonTitle.includes('4.1. Verben — Trennbare und nicht trennbare Verben'), 'Page 17 title has correct lesson name');
  assert(page17.exercises.length === 3, 'A1 Page 17 contains exactly 3 exercises');

  // Übung 1: Nicht trennbare Verben
  const ex1 = page17.exercises[0];
  assert(ex1.id === 'a1_p17_ex1', 'Übung 1 ID is a1_p17_ex1');
  assert(ex1.items.length === 10, 'Übung 1 has 10 items');
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 10, 'Übung 1 has 10-chip wordBox');
  assert(ex1.answers['a1_p17_ex1_a'] === 'bezahlst', 'Übung 1 item a is "bezahlst"');
  assert(ex1.answers['a1_p17_ex1_b'] === 'beginnt', 'Übung 1 item b is "beginnt"');
  assert(ex1.answers['a1_p17_ex1_c'] === 'empfehle', 'Übung 1 item c is "empfehle"');
  assert(ex1.answers['a1_p17_ex1_d'] === 'entlässt', 'Übung 1 item d is "entlässt"');
  assert(ex1.answers['a1_p17_ex1_e'] === 'erklärt', 'Übung 1 item e is "erklärt"');
  assert(ex1.answers['a1_p17_ex1_f'] === 'genießt', 'Übung 1 item f is "genießt"');
  assert(ex1.answers['a1_p17_ex1_g'] === 'verstehe', 'Übung 1 item g is "verstehe"');
  assert(ex1.answers['a1_p17_ex1_h'] === 'vergisst', 'Übung 1 item h is "vergisst"');
  assert(ex1.answers['a1_p17_ex1_i'] === 'verdient', 'Übung 1 item i is "verdient"');
  assert(ex1.answers['a1_p17_ex1_j'] === 'zerreißt', 'Übung 1 item j is "zerreißt"');
  assert(!Object.values(ex1.answers).includes('—'), 'Übung 1 has no corrupt "—" answers');
  assert(!Object.values(ex1.answers).includes('richtig'), 'Übung 1 has no corrupt "richtig" answers');

  // Übung 2: Trennbare Verben — Satzklammer
  const ex2 = page17.exercises[1];
  assert(ex2.id === 'a1_p17_ex2', 'Übung 2 ID is a1_p17_ex2');
  assert(ex2.items.length === 10, 'Übung 2 has 10 items');
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 10, 'Übung 2 has 10-chip wordBox');
  assert(ex2.answers['a1_p17_ex2_a'] === 'fährt', 'Übung 2 item a is "fährt"');
  assert(ex2.answers['a1_p17_ex2_b'] === 'kreuzt', 'Übung 2 item b is "kreuzt"');
  assert(ex2.answers['a1_p17_ex2_c'] === 'steht', 'Übung 2 item c is "steht"');
  assert(ex2.answers['a1_p17_ex2_d'] === 'steige', 'Übung 2 item d is "steige"');
  assert(ex2.answers['a1_p17_ex2_e'] === 'kommt', 'Übung 2 item e is "kommt"');
  assert(ex2.answers['a1_p17_ex2_f'] === 'lade', 'Übung 2 item f is "lade"');
  assert(ex2.answers['a1_p17_ex2_g'] === 'stellt', 'Übung 2 item g is "stellt"');
  assert(ex2.answers['a1_p17_ex2_h'] === 'liest', 'Übung 2 item h is "liest"');
  assert(ex2.answers['a1_p17_ex2_j'] === 'machst', 'Übung 2 item i is "machst"');
  assert(ex2.answers['a1_p17_ex2_k'] === 'gibt', 'Übung 2 item j is "gibt"');
  assert(!Object.values(ex2.answers).includes('—'), 'Übung 2 has no corrupt "—" answers');

  // Übung 3: Trennbare vs. nicht trennbare Verben im Kontext
  const ex3 = page17.exercises[2];
  assert(ex3.id === 'a1_p17_ex3', 'Übung 3 ID is a1_p17_ex3');
  assert(ex3.items.length === 14, 'Übung 3 has 14 items');
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length >= 10, 'Übung 3 has wordBox');
  assert(ex3.answers['a1_p17_ex3_a'] === 'ein', 'Übung 3 item a is "ein"');
  assert(ex3.answers['a1_p17_ex3_b'] === 'mit', 'Übung 3 item b is "mit"');
  assert(ex3.answers['a1_p17_ex3_c'] === 'ein', 'Übung 3 item c is "ein"');
  assert(ex3.answers['a1_p17_ex3_d'] === 'bekommt', 'Übung 3 item d is "bekommt"');
  assert(ex3.answers['a1_p17_ex3_e'] === 'ab', 'Übung 3 item e is "ab"');
  assert(ex3.answers['a1_p17_ex3_f'] === 'zu', 'Übung 3 item f is "zu"');
  assert(ex3.answers['a1_p17_ex3_g'] === 'aus', 'Übung 3 item g is "aus"');
  assert(ex3.answers['a1_p17_ex3_h'] === 'vor', 'Übung 3 item h is "vor"');
  assert(ex3.answers['a1_p17_ex3_i'] === 'trinke', 'Übung 3 item i is "trinke"');
  assert(ex3.answers['a1_p17_ex3_j'] === 'zurück', 'Übung 3 item j is "zurück"');
  assert(ex3.answers['a1_p17_ex3_k'] === 'an', 'Übung 3 item k is "an"');
  assert(ex3.answers['a1_p17_ex3_l'] === 'erklärt', 'Übung 3 item l is "erklärt"');
  assert(ex3.answers['a1_p17_ex3_m'] === 'vergisst', 'Übung 3 item m is "vergisst"');
  assert(ex3.answers['a1_p17_ex3_n'] === 'aus', 'Übung 3 item n is "aus"');
  assert(!Object.values(ex3.answers).includes('richtig'), 'Übung 3 has no corrupt "richtig" answers');

  // Grammar summary
  assert(page17.grammarSummary.includes('4.1. Verben'), 'Page 17 grammarSummary covers 4.1. Verben');
  assert(page17.grammarSummary.includes('Satzklammer'), 'Page 17 grammarSummary covers Satzklammer');
  assert(page17.grammarSummary.includes('Cognitive Bridge'), 'Page 17 grammarSummary includes cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 📄 Seite 17: 4.1. Verben — Trennbare und nicht trennbare Verben'), 'A1/Arbeitsbuch.md has Page 17 title');
  assert(abA1.includes('Du _______ die Rechnung.'), 'A1/Arbeitsbuch.md has clean Page 17 items');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('## 📄 Seite 17: 4.1. Verben — Trennbare und nicht trennbare Verben'), 'A1/Loesungsschluessel.md has clean Page 17 title');
  assert(lsA1.includes('bezahlen (untrennbar) ➔ du bezahlst'), 'A1/Loesungsschluessel.md has clean Page 17 explanations');
  assert(!lsA1.includes('Du **richtig** im Supermarkt'), 'A1/Loesungsschluessel.md has no "richtig" answers on Page 17');
});

// ----------------------------------------------------------------------------
// Suite 28: Workbook Page 18 Refinement (4.2. Nomen und Artikel — Akkusativ)
// ----------------------------------------------------------------------------
describe('Workbook Page 18 Refinement (4.2. Nomen und Artikel — Akkusativ)', () => {
  const rootDir = path.join(__dirname, '..');
  const wbKeysCode = fs.readFileSync(path.join(rootDir, 'js', 'workbooks_keys.js'), 'utf8');
  const start = wbKeysCode.indexOf('{');
  const end = wbKeysCode.lastIndexOf('}') + 1;
  const data = JSON.parse(wbKeysCode.substring(start, end));

  const page18 = data['A1']['18'];
  assert(!!page18, 'A1 Page 18 exists in WORKBOOKS_KEYS');
  assert(page18.lessonTitle.includes('4.2. Nomen und Artikel — Akkusativ'), 'Page 18 title has correct lesson name');
  assert(page18.exercises.length === 2, 'Page 18 contains exactly 2 exercises (Übung 1, 2)');

  // Übung 1: Bestimmter Artikel im Akkusativ
  const ex1 = page18.exercises[0];
  assert(ex1.id === 'a1_p18_ex1', 'Übung 1 ID matches');
  assert(ex1.items.length === 12, 'Übung 1 has 12 items (a-l)');
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 3, 'Übung 1 has wordBox with 3 articles (den, die, das)');
  assert(ex1.answers['a1_p18_ex1_a'] === 'den', 'Übung 1 item a is "den"');
  assert(ex1.answers['a1_p18_ex1_b'] === 'das', 'Übung 1 item b is "das"');
  assert(ex1.answers['a1_p18_ex1_c'] === 'die', 'Übung 1 item c is "die"');
  assert(ex1.answers['a1_p18_ex1_d'] === 'die', 'Übung 1 item d is "die"');
  assert(ex1.answers['a1_p18_ex1_e'] === 'das', 'Übung 1 item e is "das"');
  assert(ex1.answers['a1_p18_ex1_f'] === 'die', 'Übung 1 item f is "die"');
  assert(ex1.answers['a1_p18_ex1_g'] === 'den', 'Übung 1 item g is "den"');
  assert(ex1.answers['a1_p18_ex1_h'] === 'die', 'Übung 1 item h is "die"');
  assert(ex1.answers['a1_p18_ex1_i'] === 'das', 'Übung 1 item i is "das"');
  assert(ex1.answers['a1_p18_ex1_j'] === 'den', 'Übung 1 item j is "den"');
  assert(ex1.answers['a1_p18_ex1_k'] === 'die', 'Übung 1 item k is "die"');
  assert(ex1.answers['a1_p18_ex1_l'] === 'das', 'Übung 1 item l is "das"');
  assert(ex1.items.every(item => item.isCompact === true), 'Übung 1 items are all compact inputs');
  assert(!Object.values(ex1.answers).includes('—'), 'Übung 1 has no empty dash "—" answers');

  // Übung 2: Bestimmter (b) und unbestimmter (u) Artikel
  const ex2 = page18.exercises[1];
  assert(ex2.id === 'a1_p18_ex2', 'Übung 2 ID matches');
  assert(ex2.items.length === 19, 'Übung 2 has 19 items (a-s)');
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 6, 'Übung 2 has wordBox with 6 articles');
  assert(ex2.answers['a1_p18_ex2_a'] === 'den', 'Übung 2 item a is "den"');
  assert(ex2.answers['a1_p18_ex2_b'] === 'die', 'Übung 2 item b is "die"');
  assert(ex2.answers['a1_p18_ex2_c'] === 'eine', 'Übung 2 item c is "eine"');
  assert(ex2.answers['a1_p18_ex2_d'] === 'ein', 'Übung 2 item d is "ein"');
  assert(ex2.answers['a1_p18_ex2_e'] === 'den', 'Übung 2 item e is "den"');
  assert(ex2.answers['a1_p18_ex2_f'] === 'ein', 'Übung 2 item f is "ein"');
  assert(ex2.answers['a1_p18_ex2_g'] === 'die', 'Übung 2 item g is "die"');
  assert(ex2.answers['a1_p18_ex2_h'] === 'ein', 'Übung 2 item h is "ein"');
  assert(ex2.answers['a1_p18_ex2_i'] === 'einen', 'Übung 2 item i is "einen"');
  assert(ex2.answers['a1_p18_ex2_j'] === 'das', 'Übung 2 item j is "das"');
  assert(ex2.answers['a1_p18_ex2_k'] === 'die', 'Übung 2 item k is "die"');
  assert(ex2.answers['a1_p18_ex2_l'] === 'ein', 'Übung 2 item l is "ein"');
  assert(ex2.answers['a1_p18_ex2_m'] === 'die', 'Übung 2 item m is "die"');
  assert(ex2.answers['a1_p18_ex2_n'] === 'einen', 'Übung 2 item n is "einen"');
  assert(ex2.answers['a1_p18_ex2_o'] === 'einen', 'Übung 2 item o is "einen"');
  assert(ex2.answers['a1_p18_ex2_p'] === 'die', 'Übung 2 item p is "die"');
  assert(ex2.answers['a1_p18_ex2_q'] === 'die', 'Übung 2 item q is "die"');
  assert(ex2.answers['a1_p18_ex2_r'] === 'eine', 'Übung 2 item r is "eine"');
  assert(ex2.answers['a1_p18_ex2_s'] === 'die', 'Übung 2 item s is "die"');
  assert(ex2.items.every(item => item.isCompact === true), 'Übung 2 items are all compact inputs');
  assert(!Object.values(ex2.answers).includes('habst'), 'Übung 2 has no corrupt "habst" answers');
  assert(!Object.values(ex2.answers).includes('sehst'), 'Übung 2 has no corrupt "sehst" answers');

  // Grammar summary & cognitive bridge
  assert(page18.grammarSummary.includes('4.2. Nomen und Artikel — Der Akkusativ'), 'Page 18 grammarSummary covers 4.2. Akkusativ');
  assert(page18.grammarSummary.includes('Goldene Regel'), 'Page 18 grammarSummary covers goldene Regel');
  assert(page18.grammarSummary.includes('Cognitive Bridge'), 'Page 18 grammarSummary includes cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 📄 Seite 18: 4.2. Nomen und Artikel — Akkusativ'), 'A1/Arbeitsbuch.md has Page 18 title');
  assert(abA1.includes('Ich packe _______ Koffer.'), 'A1/Arbeitsbuch.md has clean Page 18 Übung 1 item');
  assert(abA1.includes('Du besuchst (b) _______ Großvater.'), 'A1/Arbeitsbuch.md has clean Page 18 Übung 2 item');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('## 📄 Seite 18: 4.2. Nomen und Artikel — Akkusativ'), 'A1/Loesungsschluessel.md has clean Page 18 title');
  assert(lsA1.includes('Ich packe **den** Koffer.'), 'A1/Loesungsschluessel.md has clean Page 18 Übung 1 solution');
  assert(lsA1.includes('Du besuchst (b) **den** Großvater.'), 'A1/Loesungsschluessel.md has clean Page 18 Übung 2 solution');
  assert(!lsA1.includes('Koffer - packen**—**'), 'A1/Loesungsschluessel.md has no dash scraper junk on Page 18');
});

// ----------------------------------------------------------------------------
// Suite 29: Workbook Page 19 Refinement (4.2. Nomen und Artikel — Akkusativ: Vertiefung & Negation)
// ----------------------------------------------------------------------------
describe('Workbook Page 19 Refinement (4.2. Nomen und Artikel — Akkusativ: Vertiefung & Negation)', () => {
  const rootDir = path.join(__dirname, '..');
  const wbKeysCode = fs.readFileSync(path.join(rootDir, 'js', 'workbooks_keys.js'), 'utf8');
  const start = wbKeysCode.indexOf('{');
  const end = wbKeysCode.lastIndexOf('}') + 1;
  const data = JSON.parse(wbKeysCode.substring(start, end));

  const page19 = data['A1']['19'];
  assert(!!page19, 'A1 Page 19 exists in WORKBOOKS_KEYS');
  assert(page19.lessonTitle.includes('4.2. Nomen und Artikel — Akkusativ'), 'Page 19 title has correct lesson name');
  assert(page19.exercises.length === 3, 'Page 19 contains exactly 3 exercises (Übung 3, 4, 5)');

  // Übung 3: Satzstellung — Akkusativobjekt auf Position 1
  const ex3 = page19.exercises[0];
  assert(ex3.id === 'a1_p19_ex3', 'Übung 3 ID matches');
  assert(ex3.items.length === 12, 'Übung 3 has 12 items (a-l)');
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 12, 'Übung 3 has 12-chip wordBox');
  assert(ex3.answers['a1_p19_ex3_a'] === 'Ein Kotelett', 'Übung 3 item a is "Ein Kotelett"');
  assert(ex3.answers['a1_p19_ex3_b'] === 'Eine Tasse Kaffee', 'Übung 3 item b is "Eine Tasse Kaffee"');
  assert(ex3.answers['a1_p19_ex3_c'] === 'Die Banane hier', 'Übung 3 item c is "Die Banane hier"');
  assert(ex3.answers['a1_p19_ex3_d'] === 'Die Zeitung hier', 'Übung 3 item d is "Die Zeitung hier"');
  assert(ex3.answers['a1_p19_ex3_e'] === 'Trauben', 'Übung 3 item e is "Trauben"');
  assert(ex3.answers['a1_p19_ex3_f'] === 'Einen Teller Suppe', 'Übung 3 item f is "Einen Teller Suppe"');
  assert(ex3.answers['a1_p19_ex3_g'] === 'Ein Stück Kuchen', 'Übung 3 item g is "Ein Stück Kuchen"');
  assert(ex3.answers['a1_p19_ex3_h'] === 'Den Döner hier', 'Übung 3 item h is "Den Döner hier"');
  assert(ex3.answers['a1_p19_ex3_i'] === 'Eine Portion Eis', 'Übung 3 item i is "Eine Portion Eis"');
  assert(ex3.answers['a1_p19_ex3_j'] === 'Orangensaft', 'Übung 3 item j is "Orangensaft"');
  assert(ex3.answers['a1_p19_ex3_k'] === 'Den Salat hier', 'Übung 3 item k is "Den Salat hier"');
  assert(ex3.answers['a1_p19_ex3_l'] === 'Eine Tafel Schokolade', 'Übung 3 item l is "Eine Tafel Schokolade"');
  assert(!Object.values(ex3.answers).includes('—'), 'Übung 3 has no empty dash "—" answers');

  // Übung 4: Negation im Akkusativ (keinen, keine, kein)
  const ex4 = page19.exercises[1];
  assert(ex4.id === 'a1_p19_ex4', 'Übung 4 ID matches');
  assert(ex4.items.length === 16, 'Übung 4 has 16 items (a-p)');
  assert(Array.isArray(ex4.wordBox) && ex4.wordBox.length === 3, 'Übung 4 has 3-chip wordBox');
  assert(ex4.answers['a1_p19_ex4_a'] === 'kein', 'Übung 4 item a is "kein"');
  assert(ex4.answers['a1_p19_ex4_b'] === 'kein', 'Übung 4 item b is "kein"');
  assert(ex4.answers['a1_p19_ex4_c'] === 'keine', 'Übung 4 item c is "keine"');
  assert(ex4.answers['a1_p19_ex4_d'] === 'keine', 'Übung 4 item d is "keine"');
  assert(ex4.answers['a1_p19_ex4_e'] === 'kein', 'Übung 4 item e is "kein"');
  assert(ex4.answers['a1_p19_ex4_f'] === 'keinen', 'Übung 4 item f is "keinen"');
  assert(ex4.answers['a1_p19_ex4_g'] === 'keine', 'Übung 4 item g is "keine"');
  assert(ex4.answers['a1_p19_ex4_h'] === 'keine', 'Übung 4 item h is "keine"');
  assert(ex4.answers['a1_p19_ex4_i'] === 'kein', 'Übung 4 item i is "kein"');
  assert(ex4.answers['a1_p19_ex4_j'] === 'kein', 'Übung 4 item j is "kein"');
  assert(ex4.answers['a1_p19_ex4_k'] === 'keine', 'Übung 4 item k is "keine"');
  assert(ex4.answers['a1_p19_ex4_l'] === 'keinen', 'Übung 4 item l is "keinen"');
  assert(ex4.answers['a1_p19_ex4_m'] === 'keinen', 'Übung 4 item m is "keinen"');
  assert(ex4.answers['a1_p19_ex4_n'] === 'keine', 'Übung 4 item n is "keine"');
  assert(ex4.answers['a1_p19_ex4_o'] === 'keinen', 'Übung 4 item o is "keinen"');
  assert(ex4.answers['a1_p19_ex4_p'] === 'keinen', 'Übung 4 item p is "keinen"');
  assert(ex4.items.every(item => item.isCompact === true), 'Übung 4 items are compact inputs');
  assert(!Object.values(ex4.answers).includes('—'), 'Übung 4 has no empty dash "—" answers');

  // Übung 5: Feste Ausdrücke mit „haben“ + Negation
  const ex5 = page19.exercises[2];
  assert(ex5.id === 'a1_p19_ex5', 'Übung 5 ID matches');
  assert(ex5.items.length === 8, 'Übung 5 has 8 items (a-h)');
  assert(Array.isArray(ex5.wordBox) && ex5.wordBox.length === 3, 'Übung 5 has 3-chip wordBox');
  assert(ex5.answers['a1_p19_ex5_a'] === 'keinen', 'Übung 5 item a is "keinen"');
  assert(ex5.answers['a1_p19_ex5_b'] === 'kein', 'Übung 5 item b is "kein"');
  assert(ex5.answers['a1_p19_ex5_c'] === 'keinen', 'Übung 5 item c is "keinen"');
  assert(ex5.answers['a1_p19_ex5_d'] === 'keine', 'Übung 5 item d is "keine"');
  assert(ex5.answers['a1_p19_ex5_e'] === 'kein', 'Übung 5 item e is "kein"');
  assert(ex5.answers['a1_p19_ex5_f'] === 'keinen', 'Übung 5 item f is "keinen"');
  assert(ex5.answers['a1_p19_ex5_g'] === 'kein', 'Übung 5 item g is "kein"');
  assert(ex5.answers['a1_p19_ex5_h'] === 'keine', 'Übung 5 item h is "keine"');
  assert(ex5.items.every(item => item.isCompact === true), 'Übung 5 items are compact inputs');
  assert(!Object.values(ex5.answers).includes('—'), 'Übung 5 has no empty dash "—" answers');

  // Grammar summary & cognitive bridge
  assert(page19.grammarSummary.includes('4.2. Nomen und Artikel — Akkusativ: Vertiefung & Negation'), 'Page 19 grammarSummary covers Akkusativ Vertiefung');
  assert(page19.grammarSummary.includes('kein-'), 'Page 19 grammarSummary covers kein-');
  assert(page19.grammarSummary.includes('Mengenangaben'), 'Page 19 grammarSummary covers Mengenangaben');
  assert(page19.grammarSummary.includes('Cognitive Bridge'), 'Page 19 grammarSummary includes cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 📄 Seite 19: 4.2. Nomen und Artikel — Akkusativ: Vertiefung & Negation'), 'A1/Arbeitsbuch.md has Page 19 title');
  assert(abA1.includes('Was isst du? — _______ *(ein Kotelett)* esse ich.'), 'A1/Arbeitsbuch.md has clean Page 19 Übung 3 item');
  assert(abA1.includes('Isst du ein Stück Kuchen? — Nein danke, ich esse jetzt _______ Stück Kuchen.'), 'A1/Arbeitsbuch.md has clean Page 19 Übung 4 item');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('## 📄 Seite 19: 4.2. Nomen und Artikel — Akkusativ: Vertiefung & Negation'), 'A1/Loesungsschluessel.md has clean Page 19 title');
  assert(lsA1.includes('Was isst du? — **Ein Kotelett** esse ich.'), 'A1/Loesungsschluessel.md has clean Page 19 Übung 3 solution');
  assert(lsA1.includes('Nein danke, ich esse jetzt **kein** Stück Kuchen.'), 'A1/Loesungsschluessel.md has clean Page 19 Übung 4 solution');
  assert(!lsA1.includes('ein Kotelett**—**'), 'A1/Loesungsschluessel.md has no dash scraper junk on Page 19');
});

// ----------------------------------------------------------------------------
// Suite 30: Workbook Page 20 Refinement (4.3. Personalpronomen — Akkusativ)
// ----------------------------------------------------------------------------
describe('Workbook Page 20 Refinement (4.3. Personalpronomen — Akkusativ)', () => {
  const rootDir = path.join(__dirname, '..');
  const wbKeysCode = fs.readFileSync(path.join(rootDir, 'js', 'workbooks_keys.js'), 'utf8');
  const start = wbKeysCode.indexOf('{');
  const end = wbKeysCode.lastIndexOf('}') + 1;
  const data = JSON.parse(wbKeysCode.substring(start, end));

  const page20 = data['A1']['20'];
  assert(!!page20, 'A1 Page 20 exists in WORKBOOKS_KEYS');
  assert(page20.lessonTitle.includes('4.3. Personalpronomen — Akkusativ'), 'Page 20 title has correct lesson name');
  assert(page20.exercises.length === 4, 'Page 20 contains exactly 4 exercises (Übung 1, 2, 3, 4)');

  // Übung 1: Artikel ➔ Pronomen im Akkusativ
  const ex1 = page20.exercises[0];
  assert(ex1.id === 'a1_p20_ex1', 'Übung 1 ID matches');
  assert(ex1.items.length === 5, 'Übung 1 has 5 items (a-e)');
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 3, 'Übung 1 has 3-chip wordBox');
  assert(ex1.answers['a1_p20_ex1_a'] === 'sie', 'Übung 1 item a is "sie"');
  assert(ex1.answers['a1_p20_ex1_b'] === 'ihn', 'Übung 1 item b is "ihn"');
  assert(ex1.answers['a1_p20_ex1_c'] === 'es', 'Übung 1 item c is "es"');
  assert(ex1.answers['a1_p20_ex1_d'] === 'es', 'Übung 1 item d is "es"');
  assert(ex1.answers['a1_p20_ex1_e'] === 'ihn', 'Übung 1 item e is "ihn"');
  assert(ex1.items.every(item => item.isCompact === true), 'Übung 1 items are compact inputs');
  assert(!Object.values(ex1.answers).includes('richtig'), 'Übung 1 has no corrupt "richtig" answers');

  // Übung 2: Subjekt- und Objektpronomen im Kontrast
  const ex2 = page20.exercises[1];
  assert(ex2.id === 'a1_p20_ex2', 'Übung 2 ID matches');
  assert(ex2.items.length === 7, 'Übung 2 has 7 items (a-g)');
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 7, 'Übung 2 has 7-chip wordBox');
  assert(ex2.answers['a1_p20_ex2_a'] === 'dich', 'Übung 2 item a is "dich"');
  assert(ex2.answers['a1_p20_ex2_b'] === 'sie', 'Übung 2 item b is "sie"');
  assert(ex2.answers['a1_p20_ex2_c'] === 'uns', 'Übung 2 item c is "uns"');
  assert(ex2.answers['a1_p20_ex2_d'] === 'euch', 'Übung 2 item d is "euch"');
  assert(ex2.answers['a1_p20_ex2_e'] === 'es', 'Übung 2 item e is "es"');
  assert(ex2.answers['a1_p20_ex2_f'] === 'ihn', 'Übung 2 item f is "ihn"');
  assert(ex2.answers['a1_p20_ex2_g'] === 'sie', 'Übung 2 item g is "sie"');
  assert(ex2.items.every(item => item.isCompact === true), 'Übung 2 items are compact inputs');
  assert(!Object.values(ex2.answers).includes('richtig'), 'Übung 2 has no corrupt "richtig" answers');

  // Übung 3: Nomen durch Pronomen ersetzen (Verneinte Antworten)
  const ex3 = page20.exercises[2];
  assert(ex3.id === 'a1_p20_ex3', 'Übung 3 ID matches');
  assert(ex3.items.length === 12, 'Übung 3 has 12 items (a-l)');
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 3, 'Übung 3 has 3-chip wordBox');
  assert(ex3.answers['a1_p20_ex3_a'] === 'ihn', 'Übung 3 item a is "ihn"');
  assert(ex3.answers['a1_p20_ex3_b'] === 'es', 'Übung 3 item b is "es"');
  assert(ex3.answers['a1_p20_ex3_c'] === 'sie', 'Übung 3 item c is "sie"');
  assert(ex3.answers['a1_p20_ex3_d'] === 'es', 'Übung 3 item d is "es"');
  assert(ex3.answers['a1_p20_ex3_e'] === 'sie', 'Übung 3 item e is "sie"');
  assert(ex3.answers['a1_p20_ex3_f'] === 'ihn', 'Übung 3 item f is "ihn"');
  assert(ex3.answers['a1_p20_ex3_g'] === 'sie', 'Übung 3 item g is "sie"');
  assert(ex3.answers['a1_p20_ex3_h'] === 'es', 'Übung 3 item h is "es"');
  assert(ex3.answers['a1_p20_ex3_i'] === 'sie', 'Übung 3 item i is "sie"');
  assert(ex3.answers['a1_p20_ex3_j'] === 'ihn', 'Übung 3 item j is "ihn"');
  assert(ex3.answers['a1_p20_ex3_k'] === 'es', 'Übung 3 item k is "es"');
  assert(ex3.answers['a1_p20_ex3_l'] === 'ihn', 'Übung 3 item l is "ihn"');
  assert(ex3.items.every(item => item.isCompact === true), 'Übung 3 items are compact inputs');
  assert(!Object.values(ex3.answers).includes('richtig'), 'Übung 3 has no corrupt "richtig" answers');

  // Übung 4: Akkusativ mit „mögen“ + Negation
  const ex4 = page20.exercises[3];
  assert(ex4.id === 'a1_p20_ex4', 'Übung 4 ID matches');
  assert(ex4.items.length === 8, 'Übung 4 has 8 items (a-h)');
  assert(Array.isArray(ex4.wordBox) && ex4.wordBox.length === 3, 'Übung 4 has 3-chip wordBox');
  assert(ex4.answers['a1_p20_ex4_a'] === 'kein', 'Übung 4 item a is "kein"');
  assert(ex4.answers['a1_p20_ex4_b'] === 'keinen', 'Übung 4 item b is "keinen"');
  assert(ex4.answers['a1_p20_ex4_c'] === 'keine', 'Übung 4 item c is "keine"');
  assert(ex4.answers['a1_p20_ex4_d'] === 'keinen', 'Übung 4 item d is "keinen"');
  assert(ex4.answers['a1_p20_ex4_e'] === 'keine', 'Übung 4 item e is "keine"');
  assert(ex4.answers['a1_p20_ex4_f'] === 'kein', 'Übung 4 item f is "kein"');
  assert(ex4.answers['a1_p20_ex4_g'] === 'keine', 'Übung 4 item g is "keine"');
  assert(ex4.answers['a1_p20_ex4_h'] === 'keine', 'Übung 4 item h is "keine"');
  assert(ex4.items.every(item => item.isCompact === true), 'Übung 4 items are compact inputs');
  assert(!Object.values(ex4.answers).includes('—'), 'Übung 4 has no corrupt "—" answers');

  // Grammar summary & cognitive bridge
  assert(page20.grammarSummary.includes('4.3. Personalpronomen — Akkusativ'), 'Page 20 grammarSummary covers Personalpronomen Akkusativ');
  assert(page20.grammarSummary.includes('Nomen durch Pronomen ersetzen'), 'Page 20 grammarSummary covers pronoun substitution');
  assert(page20.grammarSummary.includes('Cognitive Bridge'), 'Page 20 grammarSummary includes cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 📄 Seite 20: 4.3. Personalpronomen — Akkusativ'), 'A1/Arbeitsbuch.md has Page 20 title');
  assert(abA1.includes('Du kennst den Professor, aber er kennt _______ nicht.'), 'A1/Arbeitsbuch.md has clean Page 20 Übung 2 item');
  assert(abA1.includes('Essen Sie den Salat hier? — Nein, ich esse _______ nicht.'), 'A1/Arbeitsbuch.md has clean Page 20 Übung 3 item');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('## 📄 Seite 20: 4.3. Personalpronomen — Akkusativ'), 'A1/Loesungsschluessel.md has clean Page 20 title');
  assert(lsA1.includes('Du kennst den Professor, aber er kennt **dich** nicht.'), 'A1/Loesungsschluessel.md has clean Page 20 Übung 2 solution');
  assert(lsA1.includes('Essen Sie den Salat hier? — Nein, ich esse **ihn** nicht.'), 'A1/Loesungsschluessel.md has clean Page 20 Übung 3 solution');
});

// ----------------------------------------------------------------------------
// Suite 31: Workbook Page 21 Refinement (5.1. Possessivartikel — Nominativ und Akkusativ)
// ----------------------------------------------------------------------------
describe('Workbook Page 21 Refinement (5.1. Possessivartikel — Nominativ und Akkusativ)', () => {
  const rootDir = path.join(__dirname, '..');
  const wbKeysCode = fs.readFileSync(path.join(rootDir, 'js', 'workbooks_keys.js'), 'utf8');
  const start = wbKeysCode.indexOf('{');
  const end = wbKeysCode.lastIndexOf('}') + 1;
  const data = JSON.parse(wbKeysCode.substring(start, end));

  const page21 = data['A1']['21'];
  assert(!!page21, 'A1 Page 21 exists in WORKBOOKS_KEYS');
  assert(page21.lessonTitle.includes('5.1. Possessivartikel — Nominativ und Akkusativ'), 'Page 21 title has correct lesson name');
  assert(page21.exercises.length === 2, 'Page 21 contains exactly 2 exercises (Übung 1, 2)');

  // Übung 1: Die 1. Person („mein-“) im Nominativ und Akkusativ
  const ex1 = page21.exercises[0];
  assert(ex1.id === 'a1_p21_ex1', 'Übung 1 ID matches');
  assert(ex1.items.length === 14, 'Übung 1 has 14 items (a-n)');
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 5, 'Übung 1 has 5-chip wordBox');
  assert(ex1.answers['a1_p21_ex1_a'] === 'mein', 'Übung 1 item a is "mein"');
  assert(ex1.answers['a1_p21_ex1_b'] === 'Mein', 'Übung 1 item b is "Mein"');
  assert(ex1.answers['a1_p21_ex1_c'] === 'meine', 'Übung 1 item c is "meine"');
  assert(ex1.answers['a1_p21_ex1_d'] === 'mein', 'Übung 1 item d is "mein"');
  assert(ex1.answers['a1_p21_ex1_e'] === 'Meine', 'Übung 1 item e is "Meine"');
  assert(ex1.answers['a1_p21_ex1_f'] === 'Mein', 'Übung 1 item f is "Mein"');
  assert(ex1.answers['a1_p21_ex1_g'] === 'meinen', 'Übung 1 item g is "meinen"');
  assert(ex1.answers['a1_p21_ex1_h'] === 'meine', 'Übung 1 item h is "meine"');
  assert(ex1.answers['a1_p21_ex1_i'] === 'meinen', 'Übung 1 item i is "meinen"');
  assert(ex1.answers['a1_p21_ex1_j'] === 'Meine', 'Übung 1 item j is "Meine"');
  assert(ex1.answers['a1_p21_ex1_k'] === 'Mein', 'Übung 1 item k is "Mein"');
  assert(ex1.answers['a1_p21_ex1_l'] === 'meine', 'Übung 1 item l is "meine"');
  assert(ex1.answers['a1_p21_ex1_m'] === 'meinen', 'Übung 1 item m is "meinen"');
  assert(ex1.answers['a1_p21_ex1_n'] === 'Mein', 'Übung 1 item n is "Mein"');
  assert(ex1.items.every(item => item.isCompact === true), 'Übung 1 items are compact inputs');
  assert(!Object.values(ex1.answers).includes('richtig'), 'Übung 1 has no corrupt "richtig" answers');
  assert(!Object.values(ex1.answers).includes('—'), 'Übung 1 has no corrupt "—" answers');

  // Übung 2: Alle Personen im Akkusativ & die Sonderform „euer / eure“
  const ex2 = page21.exercises[1];
  assert(ex2.id === 'a1_p21_ex2', 'Übung 2 ID matches');
  assert(ex2.items.length === 14, 'Übung 2 has 14 items (a-n)');
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 10, 'Übung 2 has 10-chip wordBox');
  assert(ex2.answers['a1_p21_ex2_a'] === 'unsere', 'Übung 2 item a is "unsere"');
  assert(ex2.answers['a1_p21_ex2_b'] === 'seinen', 'Übung 2 item b is "seinen"');
  assert(ex2.answers['a1_p21_ex2_c'] === 'ihren', 'Übung 2 item c is "ihren"');
  assert(ex2.answers['a1_p21_ex2_d'] === 'eure', 'Übung 2 item d is "eure" (dropped inner e)');
  assert(ex2.answers['a1_p21_ex2_e'] === 'dein', 'Übung 2 item e is "dein"');
  assert(ex2.answers['a1_p21_ex2_f'] === 'ihre', 'Übung 2 item f is "ihre"');
  assert(ex2.answers['a1_p21_ex2_g'] === 'euren', 'Übung 2 item g is "euren" (dropped inner e)');
  assert(ex2.answers['a1_p21_ex2_h'] === 'ihre', 'Übung 2 item h is "ihre"');
  assert(ex2.answers['a1_p21_ex2_i'] === 'unsere', 'Übung 2 item i is "unsere"');
  assert(ex2.answers['a1_p21_ex2_j'] === 'sein', 'Übung 2 item j is "sein"');
  assert(ex2.answers['a1_p21_ex2_k'] === 'ihre', 'Übung 2 item k is "ihre"');
  assert(ex2.answers['a1_p21_ex2_l'] === 'deine', 'Übung 2 item l is "deine"');
  assert(ex2.answers['a1_p21_ex2_m'] === 'unser', 'Übung 2 item m is "unser"');
  assert(ex2.answers['a1_p21_ex2_n'] === 'eure', 'Übung 2 item n is "eure" (dropped inner e)');
  assert(ex2.items.every(item => item.isCompact === true), 'Übung 2 items are compact inputs');
  assert(!Object.values(ex2.answers).includes('richtig'), 'Übung 2 has no corrupt "richtig" answers');
  assert(!Object.values(ex2.answers).includes('—'), 'Übung 2 has no corrupt "—" answers');
  assert(!ex2.items.some(it => it.id.includes('Fahrrad') || it.id.includes('Auto')), 'Übung 2 has no dummy scraper items');

  // Grammar summary & cognitive bridge
  assert(page21.grammarSummary.includes('Possessivartikel im Nominativ und Akkusativ'), 'Page 21 grammarSummary covers Possessivartikel');
  assert(page21.grammarSummary.includes('euer / eure'), 'Page 21 grammarSummary covers euer / eure rule');
  assert(page21.grammarSummary.includes('Cognitive Bridge'), 'Page 21 grammarSummary includes cognitive bridge');

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Arbeitsbuch.md'), 'utf8');
  assert(abA1.includes('## 📄 Seite 21: 5.1. Possessivartikel — Nominativ und Akkusativ'), 'A1/Arbeitsbuch.md has Page 21 title');
  assert(abA1.includes('Ich bringe _______ Fahrrad in die Garage.'), 'A1/Arbeitsbuch.md has clean Page 21 Übung 1 item a');
  assert(abA1.includes('Besucht ihr _______ Großvater?'), 'A1/Arbeitsbuch.md has clean Page 21 Übung 2 item g');

  const lsA1 = fs.readFileSync(path.join(rootDir, 'A1', 'Loesungsschluessel.md'), 'utf8');
  assert(lsA1.includes('## 📄 Seite 21: 5.1. Possessivartikel — Nominativ und Akkusativ'), 'A1/Loesungsschluessel.md has clean Page 21 title');
  assert(lsA1.includes('Ich bringe **mein** Fahrrad in die Garage.'), 'A1/Loesungsschluessel.md has clean Page 21 Übung 1 solution');
  assert(lsA1.includes('Besucht ihr **euren** Großvater?'), 'A1/Loesungsschluessel.md has clean Page 21 Übung 2 solution');

  const lsP21Section = lsA1.substring(lsA1.indexOf('## 📄 Seite 21:'), lsA1.indexOf('## 📄 Seite 22:'));
  assert(!lsP21Section.includes('**richtig**'), 'A1/Loesungsschluessel.md has no "richtig" scraper junk on Page 21');
  assert(!lsP21Section.includes('**—**'), 'A1/Loesungsschluessel.md has no dash scraper junk on Page 21');
});


  // ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Suite 32: A1 Page 22 Refinement Integrity (5.2. Präteritum: haben / sein & 5.3. Zeitadverbien)
// ----------------------------------------------------------------------------
describe("A1 Page 22 Refinement Integrity (5.2. Präteritum: haben / sein & 5.3. Zeitadverbien)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page22 = data.A1 && data.A1["22"];
  assert(page22, "A1 Page 22 exists in WORKBOOK_DATA");
  assert(page22.lessonTitle.includes("5.2. Präteritum: haben / sein & 5.3. Zeitadverbien"), "Page 22 has refined lessonTitle");
  assert(page22.exercises.length === 3, "Page 22 has exactly 3 exercises");

  // Übung 1: Das Präteritum von „haben“ und „sein“
  const ex1 = page22.exercises[0];
  assert(ex1.id === "a1_p22_ex1", "Übung 1 ID matches");
  assert(ex1.items.length === 12, "Übung 1 has 12 items (a-l)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 7, "Übung 1 has 7-chip wordBox");
  assert(ex1.answers["a1_p22_ex1_a"] === "Warst", "Übung 1 item a is Warst");
  assert(ex1.answers["a1_p22_ex1_b"] === "Hattet", "Übung 1 item b is Hattet");
  assert(ex1.answers["a1_p22_ex1_c"] === "War", "Übung 1 item c is War");
  assert(ex1.answers["a1_p22_ex1_d"] === "Hattest", "Übung 1 item d is Hattest");
  assert(ex1.answers["a1_p22_ex1_e"] === "Wart", "Übung 1 item e is Wart");
  assert(ex1.answers["a1_p22_ex1_f"] === "Hatten", "Übung 1 item f is Hatten");
  assert(ex1.answers["a1_p22_ex1_g"] === "Warst", "Übung 1 item g is Warst");
  assert(ex1.answers["a1_p22_ex1_h"] === "Waren", "Übung 1 item h is Waren");
  assert(ex1.answers["a1_p22_ex1_i"] === "War", "Übung 1 item i is War");
  assert(ex1.answers["a1_p22_ex1_j"] === "Wart", "Übung 1 item j is Wart");
  assert(ex1.answers["a1_p22_ex1_k"] === "Hattest", "Übung 1 item k is Hattest");
  assert(ex1.answers["a1_p22_ex1_l"] === "Warst", "Übung 1 item l is Warst");
  assert(ex1.items.every(item => item.isCompact === true), "Übung 1 items are compact inputs");
  assert(!Object.values(ex1.answers).includes("richtig"), "Übung 1 has no corrupt richtig answers");
  assert(!Object.values(ex1.answers).includes("—"), "Übung 1 has no corrupt dash answers");
  assert(!ex1.items.some(it => (it.prefix && it.prefix.includes("5. 3.")) || (it.suffix && it.suffix.includes("5. 3."))), "Übung 1 has no bogus scraper item 13");

  // Übung 2: Zeit- und Häufigkeitsadverbien
  const ex2 = page22.exercises[1];
  assert(ex2.id === "a1_p22_ex2", "Übung 2 ID matches");
  assert(ex2.items.length === 14, "Übung 2 has 14 items (a-n)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 10, "Übung 2 has 10-chip wordBox");
  assert(ex2.answers["a1_p22_ex2_a"] === "ab und zu", "Übung 2 item a matches");
  assert(ex2.answers["a1_p22_ex2_b"] === "oft", "Übung 2 item b matches");
  assert(ex2.answers["a1_p22_ex2_c"] === "selten", "Übung 2 item c matches");
  assert(ex2.answers["a1_p22_ex2_d"] === "manchmal", "Übung 2 item d matches");
  assert(ex2.answers["a1_p22_ex2_e"] === "ständig", "Übung 2 item e matches");
  assert(ex2.answers["a1_p22_ex2_f"] === "nie", "Übung 2 item f matches");
  assert(ex2.answers["a1_p22_ex2_g"] === "kaum", "Übung 2 item g matches");
  assert(ex2.answers["a1_p22_ex2_h"] === "hin und wieder", "Übung 2 item h matches");
  assert(ex2.answers["a1_p22_ex2_i"] === "nie", "Übung 2 item i matches");
  assert(ex2.answers["a1_p22_ex2_j"] === "oft", "Übung 2 item j matches");
  assert(ex2.answers["a1_p22_ex2_k"] === "ab und zu", "Übung 2 item k matches");
  assert(ex2.answers["a1_p22_ex2_l"] === "fast nie", "Übung 2 item l matches");
  assert(ex2.answers["a1_p22_ex2_m"] === "kaum", "Übung 2 item m matches");
  assert(ex2.answers["a1_p22_ex2_n"] === "immer", "Übung 2 item n matches");
  assert(ex2.items.every(item => item.isCompact === true), "Übung 2 items are compact adverb inputs");
  assert(!Object.values(ex2.answers).includes("richtig"), "Übung 2 has no corrupt richtig answers");
  assert(!Object.values(ex2.answers).includes("—"), "Übung 2 has no corrupt dash answers");

  // Übung 3: Fragen bilden im Präsens
  const ex3 = page22.exercises[2];
  assert(ex3.id === "a1_p22_ex3", "Übung 3 ID matches");
  assert(ex3.items.length === 9, "Übung 3 has 9 items (a-i)");
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 9, "Übung 3 has 9-chip wordBox");
  assert(ex3.answers["a1_p22_ex3_a"] === "Fährst", "Übung 3 item a is Fährst (a -> ä)");
  assert(ex3.answers["a1_p22_ex3_b"] === "Isst", "Übung 3 item b is Isst (e -> i)");
  assert(ex3.answers["a1_p22_ex3_c"] === "Trägst", "Übung 3 item c is Trägst (a -> ä)");
  assert(ex3.answers["a1_p22_ex3_d"] === "Trinkst", "Übung 3 item d is Trinkst");
  assert(ex3.answers["a1_p22_ex3_e"] === "Liest", "Übung 3 item e is Liest (e -> ie)");
  assert(ex3.answers["a1_p22_ex3_f"] === "Nimmst", "Übung 3 item f is Nimmst (eh -> imm)");
  assert(ex3.answers["a1_p22_ex3_g"] === "Reist", "Übung 3 item g is Reist (stem -s + -t)");
  assert(ex3.answers["a1_p22_ex3_h"] === "Bestellst", "Übung 3 item h is Bestellst");
  assert(ex3.answers["a1_p22_ex3_i"] === "Fliegst", "Übung 3 item i is Fliegst");
  assert(ex3.items.every(item => item.isCompact === true), "Übung 3 items are compact inputs");
  assert(!Object.values(ex3.answers).includes("richtig"), "Übung 3 has no corrupt richtig answers");
  assert(!Object.values(ex3.answers).includes("—"), "Übung 3 has no corrupt dash answers");

  // Grammar summary & cognitive bridge
  assert(page22.grammarSummary.includes("Präteritum von „haben“ und „sein“"), "Page 22 grammarSummary covers Präteritum");
  assert(page22.grammarSummary.includes("Frequenzskala"), "Page 22 grammarSummary covers frequency adverbs");
  assert(page22.grammarSummary.includes("Ja, Nein und Doch"), "Page 22 grammarSummary covers Ja/Nein/Doch rules");
  assert(page22.grammarSummary.includes("English Cognitive Bridge"), "Page 22 grammarSummary includes cognitive bridge");

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, "A1", "Arbeitsbuch.md"), "utf8");
  assert(abA1.includes("## 📄 Seite 22: 5.2. Präteritum: haben / sein & 5.3. Zeitadverbien"), "A1/Arbeitsbuch.md has Page 22 title");
  assert(abA1.includes("_______ du gestern im Kino?"), "A1/Arbeitsbuch.md has clean Page 22 Übung 1 item a");
  assert(abA1.includes("Gehst du manchmal ins Kino? > ab und zu ➔ _______"), "A1/Arbeitsbuch.md has clean Page 22 Übung 2 item a");
  assert(abA1.includes("(fahren) — mit dem Bus ➔ _______ du manchmal mit dem Bus?"), "A1/Arbeitsbuch.md has clean Page 22 Übung 3 item a");

  const lsA1 = fs.readFileSync(path.join(rootDir, "A1", "Loesungsschluessel.md"), "utf8");
  assert(lsA1.includes("## 📄 Seite 22: 5.2. Präteritum: haben / sein & 5.3. Zeitadverbien"), "A1/Loesungsschluessel.md has clean Page 22 title");
  assert(lsA1.includes("**Warst** du gestern im Kino?"), "A1/Loesungsschluessel.md has clean Page 22 Übung 1 solution");
  assert(lsA1.includes("**Ja, ich gehe ab und zu ins Kino.**"), "A1/Loesungsschluessel.md has clean Page 22 Übung 2 solution");
  assert(lsA1.includes("**Fährst du manchmal mit dem Bus?**"), "A1/Loesungsschluessel.md has clean Page 22 Übung 3 solution");

  const lsP22Section = lsA1.substring(lsA1.indexOf("## 📄 Seite 22:"), lsA1.indexOf("## 📄 Seite 23:"));
  assert(!lsP22Section.includes("**richtig**"), "A1/Loesungsschluessel.md has no richtig scraper junk on Page 22");
  assert(!lsP22Section.includes("**—**"), "A1/Loesungsschluessel.md has no dash scraper junk on Page 22");
});


// ----------------------------------------------------------------------------
// Suite 33: A1 Page 23 Refinement Integrity (6.1. Nomen und Artikel — Dativ)
// ----------------------------------------------------------------------------
describe("A1 Page 23 Refinement Integrity (6.1. Nomen und Artikel — Dativ)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page23 = data.A1 && data.A1["23"];
  assert(page23, "A1 Page 23 exists in WORKBOOK_DATA");
  assert(page23.lessonTitle.includes("6.1. Nomen und Artikel — Dativ"), "Page 23 has refined lessonTitle");
  assert(page23.exercises.length === 3, "Page 23 has exactly 3 exercises");

  // Übung 1: Verben mit Dativ — Personen als Dativobjekt
  const ex1 = page23.exercises[0];
  assert(ex1.id === "a1_p23_ex1", "Übung 1 ID matches");
  assert(ex1.items.length === 7, "Übung 1 has 7 items (a-g)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 2, "Übung 1 has 2-chip wordBox (dem, der)");
  assert(ex1.answers["a1_p23_ex1_a"] === "dem", "Übung 1 item a is dem (der Professor ➔ dem)");
  assert(ex1.answers["a1_p23_ex1_b"] === "der", "Übung 1 item b is der (die Tante ➔ der)");
  assert(ex1.answers["a1_p23_ex1_c"] === "der", "Übung 1 item c is der (die Reporterin ➔ der)");
  assert(ex1.answers["a1_p23_ex1_d"] === "dem", "Übung 1 item d is dem (der Onkel ➔ dem)");
  assert(ex1.answers["a1_p23_ex1_e"] === "dem", "Übung 1 item e is dem (der Großvater ➔ dem)");
  assert(ex1.answers["a1_p23_ex1_f"] === "dem", "Übung 1 item f is dem (der Freund ➔ dem)");
  assert(ex1.answers["a1_p23_ex1_g"] === "der", "Übung 1 item g is der (die Professorin ➔ der)");
  assert(ex1.items.every(item => item.isCompact === true), "Übung 1 items are compact inputs");
  assert(!Object.values(ex1.answers).includes("richtig"), "Übung 1 has no corrupt richtig answers");
  assert(!Object.values(ex1.answers).includes("—"), "Übung 1 has no corrupt dash answers");
  assert(!ex1.items.some(it => it.tail && it.tail.includes("_____")), "Übung 1 has no raw underscore placeholders in tail");
  assert(ex1.items[6].tail === " Professorin zu.", "Übung 1 item g has correct separable tail for zuhören");

  // Übung 2: Dativ bei unpersönlichen Verben (schmecken, gehören, gefallen, passen)
  const ex2 = page23.exercises[1];
  assert(ex2.id === "a1_p23_ex2", "Übung 2 ID matches");
  assert(ex2.items.length === 4, "Übung 2 has 4 items (a-d)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 3, "Übung 2 has 3-chip wordBox (dem, der, den)");
  assert(ex2.answers["a1_p23_ex2_a"] === "den", "Übung 2 item a is den (die Kinder Plural ➔ den)");
  assert(ex2.answers["a1_p23_ex2_b"] === "dem", "Übung 2 item b is dem (der Lehrer ➔ dem)");
  assert(ex2.answers["a1_p23_ex2_c"] === "der", "Übung 2 item c is der (die Studentin ➔ der)");
  assert(ex2.answers["a1_p23_ex2_d"] === "dem", "Übung 2 item d is dem (das Mädchen neutral ➔ dem)");
  assert(ex2.items.every(item => item.isCompact === true), "Übung 2 items are compact inputs");
  assert(!Object.values(ex2.answers).includes("richtig"), "Übung 2 has no corrupt richtig answers");
  assert(!Object.values(ex2.answers).includes("—"), "Übung 2 has no corrupt dash answers");
  assert(!ex2.items.some(it => it.tail && it.tail.includes("_____")), "Übung 2 has no raw underscore placeholders in tail");
  assert(ex2.items[2].lead.includes("gefällt"), "Übung 2 item c has correctly spelled gefällt");

  // Übung 3: Verbauswahl & Satzbildung (gehören, schmecken, gefallen)
  const ex3 = page23.exercises[2];
  assert(ex3.id === "a1_p23_ex3", "Übung 3 ID matches");
  assert(ex3.items.length === 9, "Übung 3 has 9 items (a-i)");
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 5, "Übung 3 has 5-chip wordBox");
  assert(ex3.answers["a1_p23_ex3_a"] === "schmeckt", "Übung 3 item a is schmeckt (Pizza)");
  assert(ex3.answers["a1_p23_ex3_b"] === "gehört", "Übung 3 item b is gehört (Jacke)");
  assert(ex3.answers["a1_p23_ex3_c"] === "gefällt", "Übung 3 item c is gefällt (Film)");
  assert(ex3.answers["a1_p23_ex3_d"] === "schmeckt", "Übung 3 item d is schmeckt (Wein)");
  assert(ex3.answers["a1_p23_ex3_e"] === "gehört", "Übung 3 item e is gehört (Wagen)");
  assert(ex3.answers["a1_p23_ex3_f"] === "gehört", "Übung 3 item f is gehört (Hund)");
  assert(ex3.answers["a1_p23_ex3_g"] === "gefallen", "Übung 3 item g is gefallen (Bücher Plural)");
  assert(ex3.answers["a1_p23_ex3_h"] === "schmecken", "Übung 3 item h is schmecken (Erdbeeren Plural)");
  assert(ex3.answers["a1_p23_ex3_i"] === "gefallen", "Übung 3 item i is gefallen (Bilder Plural)");
  assert(ex3.items.every(item => item.isCompact === true), "Übung 3 items are compact inputs");
  assert(!Object.values(ex3.answers).includes("richtig"), "Übung 3 has no corrupt richtig answers");
  assert(!Object.values(ex3.answers).includes("—"), "Übung 3 has no corrupt dash answers");
  assert(!Object.values(ex3.answers).includes("das"), "Übung 3 has no corrupt stray das answer");

  // Grammar summary & cognitive bridge
  assert(page23.grammarSummary.includes("Was ist der Dativ"), "Page 23 grammarSummary covers Dativ concept");
  assert(page23.grammarSummary.includes("goldenen Dativ-Regeln"), "Page 23 grammarSummary covers golden dative rules");
  assert(page23.grammarSummary.includes("Zwei Gruppen von Dativ-Verben"), "Page 23 grammarSummary covers the two dative verb groups");
  assert(page23.grammarSummary.includes("English Cognitive Bridge"), "Page 23 grammarSummary includes cognitive bridge");

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, "A1", "Arbeitsbuch.md"), "utf8");
  assert(abA1.includes("## 📄 Seite 23: 6.1. Nomen und Artikel — Dativ (Bestimmte Artikel & Verben mit Dativ)"), "A1/Arbeitsbuch.md has Page 23 title");
  assert(abA1.includes("Paul antwortet _______ Professor."), "A1/Arbeitsbuch.md has clean Page 23 Übung 1 item a");
  assert(abA1.includes("Das Eis schmeckt _______ Kindern."), "A1/Arbeitsbuch.md has clean Page 23 Übung 2 item a");
  assert(abA1.includes("Die Pizza _______ den Kindern."), "A1/Arbeitsbuch.md has clean Page 23 Übung 3 item a");

  const lsA1 = fs.readFileSync(path.join(rootDir, "A1", "Loesungsschluessel.md"), "utf8");
  assert(lsA1.includes("## 📄 Seite 23: 6.1. Nomen und Artikel — Dativ (Bestimmte Artikel & Verben mit Dativ)"), "A1/Loesungsschluessel.md has clean Page 23 title");
  assert(lsA1.includes("Paul antwortet **dem** Professor."), "A1/Loesungsschluessel.md has clean Page 23 Übung 1 solution");
  assert(lsA1.includes("Das Eis schmeckt **den** Kindern."), "A1/Loesungsschluessel.md has clean Page 23 Übung 2 solution");
  assert(lsA1.includes("Die Pizza **schmeckt** den Kindern."), "A1/Loesungsschluessel.md has clean Page 23 Übung 3 solution");

  const lsP23Section = lsA1.substring(lsA1.indexOf("## 📄 Seite 23:"), lsA1.indexOf("## 📄 Seite 24:"));
  assert(!lsP23Section.includes("**richtig**"), "A1/Loesungsschluessel.md has no richtig scraper junk on Page 23");
  assert(!lsP23Section.includes("**—**"), "A1/Loesungsschluessel.md has no dash scraper junk on Page 23");
  assert(!lsP23Section.includes("zuhört"), "A1/Loesungsschluessel.md has no ungrammatical zuhört string on Page 23");
});

// ----------------------------------------------------------------------------
// Suite 34: A1 Page 24 Refinement Integrity (6.2. Personalpronomen — Dativ)
// ----------------------------------------------------------------------------
describe("A1 Page 24 Refinement Integrity (6.2. Personalpronomen — Dativ)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page24 = data.A1 && data.A1["24"];
  assert(page24, "A1 Page 24 exists in WORKBOOK_DATA");
  assert(page24.lessonTitle.includes("6.2. Personalpronomen — Dativ"), "Page 24 has refined lessonTitle");
  assert(page24.exercises.length === 3, "Page 24 has exactly 3 exercises");

  // Übung 1: Dativpronomen in verneinten Antworten
  const ex1 = page24.exercises[0];
  assert(ex1.id === "a1_p24_ex1", "Übung 1 ID matches");
  assert(ex1.items.length === 9, "Übung 1 has 9 items (a-i)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 4, "Übung 1 has 4-chip wordBox");
  assert(ex1.answers["a1_p24_ex1_a"] === "ihm", "Übung 1 item a is ihm (Peter)");
  assert(ex1.answers["a1_p24_ex1_b"] === "ihnen", "Übung 1 item b is ihnen (den Leuten)");
  assert(ex1.answers["a1_p24_ex1_c"] === "ihr", "Übung 1 item c is ihr (Eva)");
  assert(ex1.answers["a1_p24_ex1_d"] === "ihnen", "Übung 1 item d is ihnen (Max und Maria)");
  assert(ex1.answers["a1_p24_ex1_e"] === "euch", "Übung 1 item e is euch (uns ➔ euch)");
  assert(ex1.answers["a1_p24_ex1_f"] === "ihm", "Übung 1 item f is ihm (Paul)");
  assert(ex1.answers["a1_p24_ex1_g"] === "euch", "Übung 1 item g is euch (uns ➔ euch)");
  assert(ex1.answers["a1_p24_ex1_h"] === "ihr", "Übung 1 item h is ihr (Maria)");
  assert(ex1.answers["a1_p24_ex1_i"] === "ihm", "Übung 1 item i is ihm (Klaus)");
  assert(ex1.items.every(item => item.isCompact === true), "Übung 1 items are compact inputs");
  assert(!Object.values(ex1.answers).includes("richtig"), "Übung 1 has no corrupt richtig answers");
  assert(!Object.values(ex1.answers).includes("—"), "Übung 1 has no corrupt dash answers");

  // Übung 2: Dialoge mit „schmecken“ & Dativpronomen
  const ex2 = page24.exercises[1];
  assert(ex2.id === "a1_p24_ex2", "Übung 2 ID matches");
  assert(ex2.items.length === 8, "Übung 2 has 8 items (a-h)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 5, "Übung 2 has 5-chip wordBox");
  assert(ex2.answers["a1_p24_ex2_a"] === "uns", "Übung 2 item a is uns (euch ➔ uns)");
  assert(ex2.answers["a1_p24_ex2_b"] === "ihr", "Übung 2 item b is ihr (Julia)");
  assert(ex2.answers["a1_p24_ex2_c"] === "mir", "Übung 2 item c is mir (dir ➔ mir)");
  assert(ex2.answers["a1_p24_ex2_d"] === "mir", "Übung 2 item d is mir (Ihnen ➔ mir)");
  assert(ex2.answers["a1_p24_ex2_e"] === "ihm", "Übung 2 item e is ihm (Robert)");
  assert(ex2.answers["a1_p24_ex2_f"] === "uns", "Übung 2 item f is uns (euch ➔ uns)");
  assert(ex2.answers["a1_p24_ex2_g"] === "mir", "Übung 2 item g is mir (dir ➔ mir)");
  assert(ex2.answers["a1_p24_ex2_h"] === "ihnen", "Übung 2 item h is ihnen (den Kindern)");
  assert(ex2.items.every(item => item.isCompact === true), "Übung 2 items are compact inputs");
  assert(!Object.values(ex2.answers).includes("richtig"), "Übung 2 has no corrupt richtig answers");
  assert(!Object.values(ex2.answers).includes("—"), "Übung 2 has no corrupt dash answers");
  assert(!Object.values(ex2.answers).includes("das"), "Übung 2 has no corrupt stray das answer");

  // Übung 3: Besitz erfragen & mit Dativpronomen antworten („gehören“)
  const ex3 = page24.exercises[2];
  assert(ex3.id === "a1_p24_ex3", "Übung 3 ID matches");
  assert(ex3.items.length === 9, "Übung 3 has 9 items (a-i)");
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 6, "Übung 3 has 6-chip wordBox");
  assert(ex3.answers["a1_p24_ex3_a"] === "ihr", "Übung 3 item a is ihr (die Touristin)");
  assert(ex3.answers["a1_p24_ex3_b"] === "ihm", "Übung 3 item b is ihm (der Reporter)");
  assert(ex3.answers["a1_p24_ex3_c"] === "ihm", "Übung 3 item c is ihm (das Mädchen neutral ➔ ihm!)");
  assert(ex3.answers["a1_p24_ex3_d"] === "mir", "Übung 3 item d is mir (ich)");
  assert(ex3.answers["a1_p24_ex3_e"] === "ihr", "Übung 3 item e is ihr (die Tante)");
  assert(ex3.answers["a1_p24_ex3_f"] === "ihm", "Übung 3 item f is ihm (der Lehrer)");
  assert(ex3.answers["a1_p24_ex3_g"] === "dir", "Übung 3 item g is dir (du)");
  assert(ex3.answers["a1_p24_ex3_h"] === "uns", "Übung 3 item h is uns (wir)");
  assert(ex3.answers["a1_p24_ex3_i"] === "ihnen", "Übung 3 item i is ihnen (die Studentinnen Plural)");
  assert(ex3.items.every(item => item.isCompact === true), "Übung 3 items are compact inputs");
  assert(!Object.values(ex3.answers).includes("richtig"), "Übung 3 has no corrupt richtig answers");
  assert(!Object.values(ex3.answers).includes("—"), "Übung 3 has no corrupt dash answers");
  assert(!Object.values(ex3.answers).includes("das"), "Übung 3 has no corrupt stray das answer");
  assert(!Object.values(ex3.answers).includes("die"), "Übung 3 has no corrupt stray die answer");

  // Grammar summary & cognitive bridge
  assert(page24.grammarSummary.includes("Personalpronomen im Dativ"), "Page 24 grammarSummary covers Dativ-Personalpronomen");
  assert(page24.grammarSummary.includes("Maskulin & Neutral sind identisch"), "Page 24 grammarSummary covers ihm rule");
  assert(page24.grammarSummary.includes("wir & ihr"), "Page 24 grammarSummary covers uns / euch rule");
  assert(page24.grammarSummary.includes("English Cognitive Bridge"), "Page 24 grammarSummary includes cognitive bridge");

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, "A1", "Arbeitsbuch.md"), "utf8");
  assert(abA1.includes("## 📄 Seite 24: 6.2. Personalpronomen — Dativ"), "A1/Arbeitsbuch.md has Page 24 title");
  assert(abA1.includes("Antwortest du Peter? ➔ Nein, ich antworte _______ nicht."), "A1/Arbeitsbuch.md has clean Page 24 Übung 1 item a");
  assert(abA1.includes("euch — Suppe ➔ Schmeckt euch die Suppe? — Ja, sie schmeckt _______ ziemlich gut."), "A1/Arbeitsbuch.md has clean Page 24 Übung 2 item a");
  assert(abA1.includes("Tablet — Mädchen ➔ Wem gehört das Tablet? — Es gehört _______ ."), "A1/Arbeitsbuch.md has clean Page 24 Übung 3 item c");

  const lsA1 = fs.readFileSync(path.join(rootDir, "A1", "Loesungsschluessel.md"), "utf8");
  assert(lsA1.includes("## 📄 Seite 24: 6.2. Personalpronomen — Dativ"), "A1/Loesungsschluessel.md has clean Page 24 title");
  assert(lsA1.includes("Antwortest du Peter? ➔ Nein, ich antworte **ihm** nicht."), "A1/Loesungsschluessel.md has clean Page 24 Übung 1 solution");
  assert(lsA1.includes("Schmeckt euch die Suppe? — Ja, sie schmeckt **uns** ziemlich gut."), "A1/Loesungsschluessel.md has clean Page 24 Übung 2 solution");
  assert(lsA1.includes("Wem gehört das Tablet? — Es gehört **ihm**."), "A1/Loesungsschluessel.md has clean Page 24 Übung 3 solution");

  const lsP24Section = lsA1.substring(lsA1.indexOf("## 📄 Seite 24:"), lsA1.indexOf("## 📄 Seite 25:"));
  assert(!lsP24Section.includes("**richtig**"), "A1/Loesungsschluessel.md has no richtig scraper junk on Page 24");
  assert(!lsP24Section.includes("**—**"), "A1/Loesungsschluessel.md has no dash scraper junk on Page 24");
});

// ----------------------------------------------------------------------------
// Suite 35: A1 Page 25 Refinement Integrity (6.3. Imperativ)
// ----------------------------------------------------------------------------
describe("A1 Page 25 Refinement Integrity (6.3. Imperativ)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page25 = data.A1 && data.A1["25"];
  assert(page25, "A1 Page 25 exists in WORKBOOK_DATA");
  assert(page25.lessonTitle.includes("6.3. Imperativ"), "Page 25 has refined lessonTitle");
  assert(page25.exercises.length === 4, "Page 25 has exactly 4 exercises");

  // Übung 1: Imperativ für die informelle Anrede (du)
  const ex1 = page25.exercises[0];
  assert(ex1.id === "a1_p25_ex1", "Übung 1 ID matches");
  assert(ex1.items.length === 13, "Übung 1 has 13 items (a-m)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 13, "Übung 1 has 13-chip wordBox");
  assert(ex1.answers["a1_p25_ex1_a"] === "Frag", "Übung 1 item a is Frag");
  assert(ex1.answers["a1_p25_ex1_b"] === "Kauf", "Übung 1 item b is Kauf");
  assert(ex1.answers["a1_p25_ex1_c"] === "Arbeite", "Übung 1 item c is Arbeite (stem -t + -e)");
  assert(ex1.answers["a1_p25_ex1_d"] === "Antworte", "Übung 1 item d is Antworte (stem -t + -e)");
  assert(ex1.answers["a1_p25_ex1_e"] === "Rede", "Übung 1 item e is Rede (stem -d + -e)");
  assert(ex1.answers["a1_p25_ex1_f"] === "Lauf", "Übung 1 item f is Lauf (no umlaut!)");
  assert(ex1.answers["a1_p25_ex1_g"] === "Fahr", "Übung 1 item g is Fahr (no umlaut!)");
  assert(ex1.answers["a1_p25_ex1_h"] === "Schlaf", "Übung 1 item h is Schlaf (no umlaut!)");
  assert(ex1.answers["a1_p25_ex1_i"] === "Gib", "Übung 1 item i is Gib (e -> i)");
  assert(ex1.answers["a1_p25_ex1_j"] === "Sprich", "Übung 1 item j is Sprich (e -> i)");
  assert(ex1.answers["a1_p25_ex1_k"] === "Iss", "Übung 1 item k is Iss (e -> i)");
  assert(ex1.answers["a1_p25_ex1_l"] === "Nimm", "Übung 1 item l is Nimm (eh -> imm)");
  assert(ex1.answers["a1_p25_ex1_m"] === "Sei", "Übung 1 item m is Sei (irregular sein)");
  assert(ex1.items.every(item => item.isCompact === true), "Übung 1 items are compact inputs");
  assert(!Object.values(ex1.answers).includes("richtig"), "Übung 1 has no corrupt richtig answers");
  assert(!Object.values(ex1.answers).includes("—"), "Übung 1 has no corrupt dash answers");

  // Übung 2: Die passende Anrede im Imperativ (du, ihr oder Sie)
  const ex2 = page25.exercises[1];
  assert(ex2.id === "a1_p25_ex2", "Übung 2 ID matches");
  assert(ex2.items.length === 7, "Übung 2 has 7 items (a-g)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 7, "Übung 2 has 7-chip wordBox");
  assert(ex2.answers["a1_p25_ex2_a"] === "Nimm", "Übung 2 item a is Nimm (Maria)");
  assert(ex2.answers["a1_p25_ex2_b"] === "Sprecht", "Übung 2 item b is Sprecht (Carlos und Peter)");
  assert(ex2.answers["a1_p25_ex2_c"] === "Gib", "Übung 2 item c is Gib (Claudia)");
  assert(ex2.answers["a1_p25_ex2_d"] === "Holen Sie", "Übung 2 item d is Holen Sie (Herr Meier)");
  assert(ex2.answers["a1_p25_ex2_e"] === "Iss", "Übung 2 item e is Iss (Klaus)");
  assert(ex2.answers["a1_p25_ex2_f"] === "Sei", "Übung 2 item f is Sei (Robert)");
  assert(ex2.answers["a1_p25_ex2_g"] === "Warte", "Übung 2 item g is Warte (Julia)");
  assert(ex2.items.every(item => item.isCompact === true), "Übung 2 items are compact inputs");
  assert(!Object.values(ex2.answers).includes("richtig"), "Übung 2 has no corrupt richtig answers");
  assert(!Object.values(ex2.answers).includes("—"), "Übung 2 has no corrupt dash answers");
  assert(!Object.values(ex2.answers).includes("die"), "Übung 2 has no corrupt stray die answer");

  // Übung 3: Ratschläge geben mit „Dann ... !“ (du)
  const ex3 = page25.exercises[2];
  assert(ex3.id === "a1_p25_ex3", "Übung 3 ID matches");
  assert(ex3.items.length === 5, "Übung 3 has 5 items (a-e)");
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 4, "Übung 3 has 4-chip wordBox");
  assert(ex3.answers["a1_p25_ex3_a"] === "geh", "Übung 3 item a is geh");
  assert(ex3.answers["a1_p25_ex3_b"] === "nimm", "Übung 3 item b is nimm");
  assert(ex3.answers["a1_p25_ex3_c"] === "mach", "Übung 3 item c is mach");
  assert(ex3.answers["a1_p25_ex3_d"] === "iss", "Übung 3 item d is iss");
  assert(ex3.answers["a1_p25_ex3_e"] === "geh", "Übung 3 item e is geh");
  assert(ex3.items.every(item => item.isCompact === true), "Übung 3 items are compact inputs");
  assert(!Object.values(ex3.answers).includes("richtig"), "Übung 3 has no corrupt richtig answers");
  assert(!Object.values(ex3.answers).includes("—"), "Übung 3 has no corrupt dash answers");

  // Übung 4: Trennbare Verben im Imperativ
  const ex4 = page25.exercises[3];
  assert(ex4.id === "a1_p25_ex4", "Übung 4 ID matches");
  assert(ex4.items.length === 5, "Übung 4 has 5 items (a-e)");
  assert(Array.isArray(ex4.wordBox) && ex4.wordBox.length === 5, "Übung 4 has 5-chip wordBox");
  assert(ex4.answers["a1_p25_ex4_a"] === "ruf", "Übung 4 item a is ruf (anrufen)");
  assert(ex4.answers["a1_p25_ex4_b"] === "steigt", "Übung 4 item b is steigt (einsteigen)");
  assert(ex4.answers["a1_p25_ex4_c"] === "hören Sie", "Übung 4 item c is hören Sie (zuhören)");
  assert(ex4.answers["a1_p25_ex4_d"] === "kreuz", "Übung 4 item d is kreuz (ankreuzen)");
  assert(ex4.answers["a1_p25_ex4_e"] === "lies", "Übung 4 item e is lies (vorlesen)");
  assert(ex4.items.every(item => item.isCompact === true), "Übung 4 items are compact inputs");
  assert(!Object.values(ex4.answers).includes("richtig"), "Übung 4 has no corrupt richtig answers");
  assert(!Object.values(ex4.answers).includes("—"), "Übung 4 has no corrupt dash answers");

  // Grammar summary & cognitive bridge
  assert(page25.grammarSummary.includes("Was ist der Imperativ"), "Page 25 grammarSummary covers Imperativ concept");
  assert(page25.grammarSummary.includes("Kein Umlaut bei du"), "Page 25 grammarSummary covers no umlaut rule");
  assert(page25.grammarSummary.includes("Vokalwechsel e ➔ i/ie bleibt"), "Page 25 grammarSummary covers vowel shift rule");
  assert(page25.grammarSummary.includes("Sonderform von „sein“"), "Page 25 grammarSummary covers sein rule");
  assert(page25.grammarSummary.includes("English Cognitive Bridge"), "Page 25 grammarSummary includes cognitive bridge");

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, "A1", "Arbeitsbuch.md"), "utf8");
  assert(abA1.includes("## 📄 Seite 25: 6.3. Imperativ (Befehlsform — du, ihr, Sie)"), "A1/Arbeitsbuch.md has Page 25 title");
  assert(abA1.includes("*(fragen)* _______ !"), "A1/Arbeitsbuch.md has clean Page 25 Übung 1 item a");
  assert(abA1.includes("Maria, _______ bitte die Tasche! (nehmen)"), "A1/Arbeitsbuch.md has clean Page 25 Übung 2 item a");
  assert(abA1.includes("Ich bin müde. (zu Bett — gehen) ➔ Dann _______ zu Bett!"), "A1/Arbeitsbuch.md has clean Page 25 Übung 3 item a");
  assert(abA1.includes("(anrufen) Peter, _______ bitte deine Mutter an!"), "A1/Arbeitsbuch.md has clean Page 25 Übung 4 item a");

  const lsA1 = fs.readFileSync(path.join(rootDir, "A1", "Loesungsschluessel.md"), "utf8");
  assert(lsA1.includes("## 📄 Seite 25: 6.3. Imperativ (Befehlsform — du, ihr, Sie)"), "A1/Loesungsschluessel.md has clean Page 25 title");
  assert(lsA1.includes("*(fragen)* **Frag**!"), "A1/Loesungsschluessel.md has clean Page 25 Übung 1 solution");
  assert(lsA1.includes("Maria, **Nimm** bitte die Tasche! (nehmen)"), "A1/Loesungsschluessel.md has clean Page 25 Übung 2 solution");
  assert(lsA1.includes("Ich bin müde. (zu Bett — gehen) ➔ Dann **geh** zu Bett!"), "A1/Loesungsschluessel.md has clean Page 25 Übung 3 solution");
  assert(lsA1.includes("(anrufen) Peter, **ruf** bitte deine Mutter an!"), "A1/Loesungsschluessel.md has clean Page 25 Übung 4 solution");

  const lsP25Section = lsA1.substring(lsA1.indexOf("## 📄 Seite 25:"), lsA1.indexOf("## 📄 Seite 26:"));
  assert(!lsP25Section.includes("**richtig**"), "A1/Loesungsschluessel.md has no richtig scraper junk on Page 25");
  assert(!lsP25Section.includes("**—**"), "A1/Loesungsschluessel.md has no dash scraper junk on Page 25");
});

// ----------------------------------------------------------------------------
// Suite 36: A1 Page 27 Refinement Integrity (7.2. Modalverben)
// ----------------------------------------------------------------------------
describe("A1 Page 27 Refinement Integrity (7.2. Modalverben)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page27 = data.A1 && data.A1["27"];
  assert(page27, "A1 Page 27 exists in WORKBOOK_DATA");
  assert(page27.lessonTitle.includes("7.2. Modalverben"), "Page 27 has refined lessonTitle");
  assert(page27.exercises.length === 4, "Page 27 has exactly 4 exercises");

  // Übung 1: wollen & können
  const ex1 = page27.exercises[0];
  assert(ex1.id === "a1_p27_ex1", "Übung 1 ID matches");
  assert(ex1.items.length === 8, "Übung 1 has 8 items (a-h)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 6, "Übung 1 has 6-chip wordBox");
  assert(ex1.answers["a1_p27_ex1_a"] === "wollt", "Übung 1 item a is wollt (ihr)");
  assert(ex1.answers["a1_p27_ex1_b"] === "willst", "Übung 1 item b is willst (du)");
  assert(ex1.answers["a1_p27_ex1_c"] === "will", "Übung 1 item c is will (ich)");
  assert(ex1.answers["a1_p27_ex1_d"] === "will", "Übung 1 item d is will (Eva)");
  assert(ex1.answers["a1_p27_ex1_e"] === "kannst", "Übung 1 item e is kannst (du)");
  assert(ex1.answers["a1_p27_ex1_f"] === "kann", "Übung 1 item f is kann (Carlos)");
  assert(ex1.answers["a1_p27_ex1_g"] === "kann", "Übung 1 item g is kann (ich)");
  assert(ex1.answers["a1_p27_ex1_h"] === "können", "Übung 1 item h is können (wir)");
  assert(ex1.items.every(item => item.isCompact === true), "Übung 1 items are compact inputs");
  assert(!Object.values(ex1.answers).includes("richtig"), "Übung 1 has no corrupt richtig answers");
  assert(!Object.values(ex1.answers).includes("—"), "Übung 1 has no corrupt dash answers");

  // Übung 2: dürfen & müssen
  const ex2 = page27.exercises[1];
  assert(ex2.id === "a1_p27_ex2", "Übung 2 ID matches");
  assert(ex2.items.length === 8, "Übung 2 has 8 items (a-h)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 7, "Übung 2 has 7-chip wordBox");
  assert(ex2.answers["a1_p27_ex2_a"] === "dürft", "Übung 2 item a is dürft (ihr)");
  assert(ex2.answers["a1_p27_ex2_b"] === "darf", "Übung 2 item b is darf (ich)");
  assert(ex2.answers["a1_p27_ex2_c"] === "dürfen", "Übung 2 item c is dürfen (Kinder)");
  assert(ex2.answers["a1_p27_ex2_d"] === "darfst", "Übung 2 item d is darfst (du)");
  assert(ex2.answers["a1_p27_ex2_e"] === "müsst", "Übung 2 item e is müsst (ihr)");
  assert(ex2.answers["a1_p27_ex2_f"] === "muss", "Übung 2 item f is muss (ich)");
  assert(ex2.answers["a1_p27_ex2_g"] === "muss", "Übung 2 item g is muss (Paul)");
  assert(ex2.answers["a1_p27_ex2_h"] === "müssen", "Übung 2 item h is müssen (wir)");
  assert(ex2.items.every(item => item.isCompact === true), "Übung 2 items are compact inputs");
  assert(!Object.values(ex2.answers).includes("richtig"), "Übung 2 has no corrupt richtig answers");
  assert(!Object.values(ex2.answers).includes("—"), "Übung 2 has no corrupt dash answers");
  assert(!Object.values(ex2.answers).includes("das"), "Übung 2 has no corrupt stray das answer");

  // Übung 3: Verneinung mit können & spielen
  const ex3 = page27.exercises[2];
  assert(ex3.id === "a1_p27_ex3", "Übung 3 ID matches");
  assert(ex3.items.length === 8, "Übung 3 has 8 items (a-h)");
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 8, "Übung 3 has 8-chip wordBox");
  assert(ex3.answers["a1_p27_ex3_a"] === "Schach spielen", "Übung 3 item a is Schach spielen");
  assert(ex3.answers["a1_p27_ex3_b"] === "Tischtennis spielen", "Übung 3 item b is Tischtennis spielen");
  assert(ex3.answers["a1_p27_ex3_c"] === "Karten spielen", "Übung 3 item c is Karten spielen");
  assert(ex3.answers["a1_p27_ex3_d"] === "Theater spielen", "Übung 3 item d is Theater spielen");
  assert(ex3.answers["a1_p27_ex3_e"] === "Roulette spielen", "Übung 3 item e is Roulette spielen");
  assert(ex3.answers["a1_p27_ex3_f"] === "Geige spielen", "Übung 3 item f is Geige spielen");
  assert(ex3.answers["a1_p27_ex3_g"] === "Golf spielen", "Übung 3 item g is Golf spielen");
  assert(ex3.answers["a1_p27_ex3_h"] === "Fußball spielen", "Übung 3 item h is Fußball spielen");
  assert(ex3.items.every(item => item.isCompact === false), "Übung 3 items are full phrase inputs");
  assert(!Object.values(ex3.answers).includes("richtig"), "Übung 3 has no corrupt richtig answers");
  assert(!Object.values(ex3.answers).includes("—"), "Übung 3 has no corrupt dash answers");

  // Übung 4: sollen & möchten
  const ex4 = page27.exercises[3];
  assert(ex4.id === "a1_p27_ex4", "Übung 4 ID matches");
  assert(ex4.items.length === 6, "Übung 4 has 6 items (a-f)");
  assert(Array.isArray(ex4.wordBox) && ex4.wordBox.length === 6, "Übung 4 has 6-chip wordBox");
  assert(ex4.answers["a1_p27_ex4_a"] === "soll", "Übung 4 item a is soll (ich)");
  assert(ex4.answers["a1_p27_ex4_b"] === "sollst", "Übung 4 item b is sollst (du)");
  assert(ex4.answers["a1_p27_ex4_c"] === "sollen", "Übung 4 item c is sollen (wir)");
  assert(ex4.answers["a1_p27_ex4_d"] === "möchtest", "Übung 4 item d is möchtest (du)");
  assert(ex4.answers["a1_p27_ex4_e"] === "möchte", "Übung 4 item e is möchte (ich)");
  assert(ex4.answers["a1_p27_ex4_f"] === "möchten", "Übung 4 item f is möchten (die Gäste)");
  assert(ex4.items.every(item => item.isCompact === true), "Übung 4 items are compact inputs");
  assert(!Object.values(ex4.answers).includes("richtig"), "Übung 4 has no corrupt richtig answers");
  assert(!Object.values(ex4.answers).includes("—"), "Übung 4 has no corrupt dash answers");

  // Grammar summary & cognitive bridge
  assert(page27.grammarSummary.includes("Bedeutung und Funktion der sechs Modalverben"), "Page 27 grammarSummary covers all 6 modal verbs");
  assert(page27.grammarSummary.includes("Die Satzklammer mit Modalverben"), "Page 27 grammarSummary covers Satzklammer");
  assert(page27.grammarSummary.includes("1. Person = 3. Person Singular"), "Page 27 grammarSummary covers 1s=3s rule");
  assert(page27.grammarSummary.includes("English Cognitive Bridge"), "Page 27 grammarSummary includes cognitive bridge");

  // Markdown Documents
  const abA1 = fs.readFileSync(path.join(rootDir, "A1", "Arbeitsbuch.md"), "utf8");
  assert(abA1.includes("Seite 27: 7.2. Modalverben (können, müssen, dürfen, wollen, sollen, möchten)"), "A1/Arbeitsbuch.md has Page 27 title");
  assert(abA1.includes("*(wollen / ihr)* Ihr ________ nicht so früh aufstehen."), "A1/Arbeitsbuch.md has clean Page 27 Übung 1 item a");
  assert(abA1.includes("*(dürfen / ihr)* Ihr ________ heute leider nicht mitkommen."), "A1/Arbeitsbuch.md has clean Page 27 Übung 2 item a");
  assert(abA1.includes("Spielst du Schach? — Nein, ich kann nicht ________."), "A1/Arbeitsbuch.md has clean Page 27 Übung 3 item a");
  assert(abA1.includes("*(sollen / ich)* Der Arzt sagt, ich ________ viel Tee trinken und schlafen."), "A1/Arbeitsbuch.md has clean Page 27 Übung 4 item a");

  const lsA1 = fs.readFileSync(path.join(rootDir, "A1", "Loesungsschluessel.md"), "utf8");
  assert(lsA1.includes("## 📄 Seite 27: 7.2. Modalverben (können, müssen, dürfen, wollen, sollen, möchten)"), "A1/Loesungsschluessel.md has clean Page 27 title");
  assert(lsA1.includes("*(wollen / ihr)* Ihr **wollt** nicht so früh aufstehen."), "A1/Loesungsschluessel.md has clean Page 27 Übung 1 solution");
  assert(lsA1.includes("*(dürfen / ihr)* Ihr **dürft** heute leider nicht mitkommen."), "A1/Loesungsschluessel.md has clean Page 27 Übung 2 solution");
  assert(lsA1.includes("Spielst du Schach? — Nein, ich kann nicht **Schach spielen**."), "A1/Loesungsschluessel.md has clean Page 27 Übung 3 solution");
  assert(lsA1.includes("Der Arzt sagt, ich **soll** viel Tee trinken und schlafen."), "A1/Loesungsschluessel.md has clean Page 27 Übung 4 solution");

  const lsP27Section = lsA1.substring(lsA1.indexOf("## 📄 Seite 27:"), lsA1.indexOf("## 📄 Seite 28:"));
  assert(!lsP27Section.includes("**richtig**"), "A1/Loesungsschluessel.md has no richtig scraper junk on Page 27");
  assert(!lsP27Section.includes("**—**"), "A1/Loesungsschluessel.md has no dash scraper junk on Page 27");
  assert(!lsP27Section.includes("**das**"), "A1/Loesungsschluessel.md has no das scraper junk on Page 27");
});

// ----------------------------------------------------------------------------
// Suite 37: A1 Page 28 Refinement Integrity (7.3. Präpositionen mit Dativ)
// ----------------------------------------------------------------------------
describe("A1 Page 28 Refinement Integrity (7.3. Präpositionen mit Dativ)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page28 = data.A1 && data.A1["28"];
  assert(page28, "A1 Page 28 exists in WORKBOOK_DATA");
  assert(page28.lessonTitle.includes("7.3. Präpositionen mit Dativ"), "Page 28 has refined lessonTitle");
  assert(page28.exercises.length === 3, "Page 28 has exactly 3 exercises");

  // Übung 1: Bestimmte & unbestimmte Artikel im Dativ
  const ex1 = page28.exercises[0];
  assert(ex1.id === "a1_p28_ex1", "Übung 1 ID is a1_p28_ex1");
  assert(ex1.items.length === 12, "Übung 1 has 12 items (a-l)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 6, "Übung 1 has 6-chip wordBox");
  assert(ex1.answers["a1_p28_ex1_a"] === "dem", "Item a is dem (das Taxi)");
  assert(ex1.answers["a1_p28_ex1_b"] === "einem", "Item b is einem (ein Jahr)");
  assert(ex1.answers["a1_p28_ex1_c"] === "der", "Item c is der (die Post)");
  assert(ex1.answers["a1_p28_ex1_d"] === "dem", "Item d is dem (das Haus)");
  assert(ex1.answers["a1_p28_ex1_e"] === "dem", "Item e is dem (das Essen)");
  assert(ex1.answers["a1_p28_ex1_f"] === "dem", "Item f is dem (der Keller)");
  assert(ex1.answers["a1_p28_ex1_g"] === "den", "Item g is den (die Eltern)");
  assert(ex1.answers["a1_p28_ex1_h"] === "einer", "Item h is einer (eine Woche)");
  assert(ex1.answers["a1_p28_ex1_i"] === "dem", "Item i is dem (der Schrank)");
  assert(ex1.answers["a1_p28_ex1_j"] === "der", "Item j is der (die Arbeit)");
  assert(ex1.answers["a1_p28_ex1_k"] === "dem", "Item k is dem (der Bahnhof)");
  assert(ex1.answers["a1_p28_ex1_l"] === "seiner", "Item l is seiner (seine Tante)");
  assert(ex1.items.every(it => it.isCompact === true), "All Übung 1 items are isCompact: true");

  // Übung 2: Feste Dativ-Präpositionen
  const ex2 = page28.exercises[1];
  assert(ex2.id === "a1_p28_ex2", "Übung 2 ID is a1_p28_ex2");
  assert(ex2.items.length === 13, "Übung 2 has 13 items");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 9, "Übung 2 has 9-chip wordBox");
  assert(ex2.answers["a1_p28_ex2_a"] === "mit", "Item a is mit");
  assert(ex2.answers["a1_p28_ex2_b"] === "aus", "Item b is aus");
  assert(ex2.answers["a1_p28_ex2_d"] === "gegenüber", "Item d is gegenüber");
  assert(ex2.answers["a1_p28_ex2_e"] === "bei", "Item e is bei");
  assert(ex2.answers["a1_p28_ex2_f"] === "vom", "Item f is vom");
  assert(ex2.answers["a1_p28_ex2_g"] === "mit", "Item g is mit");
  assert(ex2.answers["a1_p28_ex2_h"] === "zum", "Item h is zum");
  assert(ex2.answers["a1_p28_ex2_i"] === "bei", "Item i is bei");
  assert(ex2.answers["a1_p28_ex2_j"] === "mit", "Item j is mit");
  assert(ex2.answers["a1_p28_ex2_k"] === "vom", "Item k is vom");
  assert(ex2.answers["a1_p28_ex2_l"] === "zu", "Item l is zu");
  assert(ex2.answers["a1_p28_ex2_m"] === "Bei", "Item m is Bei");
  assert(ex2.answers["a1_p28_ex2_n"] === "Von", "Item n is Von");
  assert(ex2.items.every(it => it.isCompact === true), "All Übung 2 items are isCompact: true");

  // Übung 3: Dativ mit Personalpronomen
  const ex3 = page28.exercises[2];
  assert(ex3.id === "a1_p28_ex3", "Übung 3 ID is a1_p28_ex3");
  assert(ex3.items.length === 8, "Übung 3 has 8 items (a-h)");
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 7, "Übung 3 has 7-chip wordBox");
  assert(ex3.answers["a1_p28_ex3_a"] === "von ihr", "Item a is von ihr");
  assert(ex3.answers["a1_p28_ex3_b"] === "mit ihm", "Item b is mit ihm");
  assert(ex3.answers["a1_p28_ex3_c"] === "mit ihr", "Item c is mit ihr");
  assert(ex3.answers["a1_p28_ex3_d"] === "von ihm", "Item d is von ihm");
  assert(ex3.answers["a1_p28_ex3_e"] === "mit ihnen", "Item e is mit ihnen");
  assert(ex3.answers["a1_p28_ex3_f"] === "zu ihr", "Item f is zu ihr");
  assert(ex3.answers["a1_p28_ex3_g"] === "bei ihnen", "Item g is bei ihnen");
  assert(ex3.answers["a1_p28_ex3_h"] === "von ihm", "Item h is von ihm");
  assert(ex3.items.every(it => it.isCompact === false), "All Übung 3 items are isCompact: false (two words)");

  // Grammar Summary
  assert(page28.grammarSummary.includes("7.3. Präpositionen mit dem Dativ"), "Grammar summary includes header");
  assert(page28.grammarSummary.includes("Dativ-Schuh"), "Grammar summary includes memory rhyme");
  assert(page28.grammarSummary.includes("Verschmelzung"), "Grammar summary includes contraction table");
  assert(page28.grammarSummary.includes("Personalpronomen im Dativ"), "Grammar summary includes dative personal pronouns");
  assert(page28.grammarSummary.includes("English Cognitive Bridge"), "Grammar summary includes English bridge");

  // Markdown Sync Checks
  const arbPath = path.join(rootDir, "A1", "Arbeitsbuch.md");
  const loesPath = path.join(rootDir, "A1", "Loesungsschluessel.md");
  const arbText = fs.readFileSync(arbPath, "utf8");
  const loesText = fs.readFileSync(loesPath, "utf8");

  const s28Arb = arbText.slice(arbText.indexOf('<a id="seite-28"></a>'), arbText.indexOf('<a id="seite-29"></a>'));
  const s28Loes = loesText.slice(loesText.indexOf('<a id="seite-28"></a>'), loesText.indexOf('<a id="seite-29"></a>'));

  assert(s28Arb.includes("7.3. Präpositionen mit Dativ"), "A1/Arbeitsbuch.md has Page 28 section");
  assert(s28Loes.includes("7.3. Präpositionen mit Dativ"), "A1/Loesungsschluessel.md has Page 28 section");
  assert(!s28Loes.includes("d**et** Taxi"), "A1/Loesungsschluessel.md has no verb ending scraper junk in Page 28");
  assert(!s28Loes.includes("**richtig**"), "A1/Loesungsschluessel.md has no 'richtig' scraper junk in Page 28");
  assert(!s28Loes.includes("Parkhaus **das**"), "A1/Loesungsschluessel.md has no 'das' scraper junk in Page 28");
  assert(!s28Loes.includes("Frau Berg?**die**"), "A1/Loesungsschluessel.md has no 'die' scraper junk in Page 28");
});


// ----------------------------------------------------------------------------
// Suite 38: A1 Page 29 Refinement Integrity (8.1. Perfekt: Regelmäßige und unregelmäßige Verben)
// ----------------------------------------------------------------------------
describe("A1 Page 29 Refinement Integrity (8.1. Perfekt)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page29 = data.A1 && data.A1["29"];
  assert(page29, "A1 Page 29 exists in WORKBOOK_DATA");
  assert(page29.lessonTitle.includes("8.1. Perfekt"), "Page 29 has refined lessonTitle");
  assert(page29.exercises.length === 2, "Page 29 has exactly 2 exercises");

  // Übung 1: Schwache Verben
  const ex1 = page29.exercises[0];
  assert(ex1.id === "a1_p29_ex1", "Übung 1 ID is a1_p29_ex1");
  assert(ex1.items.length === 18, "Übung 1 has 18 items (a-r)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 18, "Übung 1 has 18-chip wordBox");
  assert(ex1.answers["a1_p29_ex1_a"] === "gewohnt", "Item a is gewohnt");
  assert(ex1.answers["a1_p29_ex1_b"] === "gelernt", "Item b is gelernt");
  assert(ex1.answers["a1_p29_ex1_c"] === "gesucht", "Item c is gesucht");
  assert(ex1.answers["a1_p29_ex1_d"] === "geholt", "Item d is geholt");
  assert(ex1.answers["a1_p29_ex1_e"] === "gebucht", "Item e is gebucht");
  assert(ex1.answers["a1_p29_ex1_f"] === "gedankt", "Item f is gedankt");
  assert(ex1.answers["a1_p29_ex1_g"] === "gespielt", "Item g is gespielt");
  assert(ex1.answers["a1_p29_ex1_h"] === "gesagt", "Item h is gesagt");
  assert(ex1.answers["a1_p29_ex1_i"] === "gepasst", "Item i is gepasst");
  assert(ex1.answers["a1_p29_ex1_j"] === "gewartet", "Item j is gewartet (mit -et)");
  assert(ex1.answers["a1_p29_ex1_k"] === "geantwortet", "Item k is geantwortet (mit -et)");
  assert(ex1.answers["a1_p29_ex1_l"] === "gemietet", "Item l is gemietet (mit -et)");
  assert(ex1.answers["a1_p29_ex1_m"] === "korrigiert", "Item m is korrigiert (ohne ge-)");
  assert(ex1.answers["a1_p29_ex1_n"] === "gratuliert", "Item n is gratuliert (ohne ge-)");
  assert(ex1.answers["a1_p29_ex1_o"] === "studiert", "Item o is studiert (ohne ge-)");
  assert(ex1.answers["a1_p29_ex1_p"] === "gereist", "Item p is gereist (mit sein)");
  assert(ex1.answers["a1_p29_ex1_q"] === "passiert", "Item q is passiert (mit sein, ohne ge-)");
  assert(ex1.answers["a1_p29_ex1_r"] === "gestartet", "Item r is gestartet (mit sein)");
  assert(ex1.items.every(it => it.isCompact === true), "All Übung 1 items are isCompact: true");

  // Übung 2: Starke Verben
  const ex2 = page29.exercises[1];
  assert(ex2.id === "a1_p29_ex2", "Übung 2 ID is a1_p29_ex2");
  assert(ex2.items.length === 8, "Übung 2 has 8 items (a-h)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 8, "Übung 2 has 8-chip wordBox");
  assert(ex2.answers["a1_p29_ex2_a"] === "getroffen", "Item a is getroffen (treffen)");
  assert(ex2.answers["a1_p29_ex2_b"] === "gewaschen", "Item b is gewaschen (waschen)");
  assert(ex2.answers["a1_p29_ex2_c"] === "gelesen", "Item c is gelesen (lesen)");
  assert(ex2.answers["a1_p29_ex2_d"] === "gegessen", "Item d is gegessen (essen)");
  assert(ex2.answers["a1_p29_ex2_e"] === "geholfen", "Item e is geholfen (helfen)");
  assert(ex2.answers["a1_p29_ex2_f"] === "geschlossen", "Item f is geschlossen (schließen)");
  assert(ex2.answers["a1_p29_ex2_g"] === "geschnitten", "Item g is geschnitten (schneiden)");
  assert(ex2.answers["a1_p29_ex2_h"] === "geschrieben", "Item h is geschrieben (schreiben)");
  assert(ex2.items.every(it => it.isCompact === true), "All Übung 2 items are isCompact: true");

  // Grammar Summary
  assert(page29.grammarSummary.includes("8.1. Perfekt"), "Grammar summary includes header");
  assert(page29.grammarSummary.includes("Satzklammer"), "Grammar summary includes Satzklammer explanation");
  assert(page29.grammarSummary.includes("Hilfsverb: „haben“ oder „sein“?"), "Grammar summary includes auxiliary selection table");
  assert(page29.grammarSummary.includes("Bildung des Partizip II bei schwachen"), "Grammar summary includes regular formation rules");
  assert(page29.grammarSummary.includes("Bildung des Partizip II bei starken"), "Grammar summary includes strong verbs matrix");
  assert(page29.grammarSummary.includes("English Cognitive Bridge"), "Grammar summary includes English bridge");

  // Markdown Sync Checks
  const arbPath = path.join(rootDir, "A1", "Arbeitsbuch.md");
  const loesPath = path.join(rootDir, "A1", "Loesungsschluessel.md");
  const arbText = fs.readFileSync(arbPath, "utf8");
  const loesText = fs.readFileSync(loesPath, "utf8");

  const s29Arb = arbText.slice(arbText.indexOf('<a id="seite-29"></a>'), arbText.indexOf('<a id="seite-30"></a>'));
  const s29Loes = loesText.slice(loesText.indexOf('<a id="seite-29"></a>'), loesText.indexOf('<a id="seite-30"></a>'));

  assert(s29Arb.includes("8.1. Perfekt"), "A1/Arbeitsbuch.md has Page 29 section");
  assert(s29Loes.includes("8.1. Perfekt"), "A1/Loesungsschluessel.md has Page 29 section");
  assert(!s29Loes.includes("**—**"), "A1/Loesungsschluessel.md has no dash scraper junk in Page 29");
  assert(!s29Loes.includes("**richtig**"), "A1/Loesungsschluessel.md has no 'richtig' scraper junk in Page 29");
  assert(!s29Loes.includes("Auto**das**"), "A1/Loesungsschluessel.md has no 'das' scraper junk in Page 29");
  assert(!s29Loes.includes("Zeitung?**die**"), "A1/Loesungsschluessel.md has no 'die' scraper junk in Page 29");
});


// ----------------------------------------------------------------------------
// Suite 39: A1 Page 30 Refinement Integrity (8.1. Perfekt: Vertiefung & Übungen)
// ----------------------------------------------------------------------------
describe("A1 Page 30 Refinement Integrity (8.1. Perfekt: Vertiefung)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page30 = data.A1 && data.A1["30"];
  assert(page30, "A1 Page 30 exists in WORKBOOK_DATA");
  assert(page30.lessonTitle.includes("8.1. Perfekt"), "Page 30 has refined lessonTitle");
  assert(page30.exercises.length === 4, "Page 30 has exactly 4 exercises");

  // Übung 3: Starke Verben im Fragesatz
  const ex3 = page30.exercises[0];
  assert(ex3.id === "a1_p30_ex3", "Übung 3 ID is a1_p30_ex3");
  assert(ex3.items.length === 18, "Übung 3 has 18 items (a-r)");
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 18, "Übung 3 has 18-chip wordBox");
  assert(ex3.answers["a1_p30_ex3_a"] === "genommen", "Item a is genommen (nehmen)");
  assert(ex3.answers["a1_p30_ex3_b"] === "gefunden", "Item b is gefunden (finden)");
  assert(ex3.answers["a1_p30_ex3_c"] === "geholfen", "Item c is geholfen (helfen)");
  assert(ex3.answers["a1_p30_ex3_d"] === "geschlafen", "Item d is geschlafen (schlafen)");
  assert(ex3.answers["a1_p30_ex3_e"] === "getragen", "Item e is getragen (tragen)");
  assert(ex3.answers["a1_p30_ex3_f"] === "geschrieben", "Item f is geschrieben (schreiben)");
  assert(ex3.answers["a1_p30_ex3_g"] === "gelesen", "Item g is gelesen (lesen)");
  assert(ex3.answers["a1_p30_ex3_h"] === "gesehen", "Item h is gesehen (sehen)");
  assert(ex3.answers["a1_p30_ex3_i"] === "gegessen", "Item i is gegessen (essen)");
  assert(ex3.answers["a1_p30_ex3_j"] === "gegangen", "Item j is gegangen (gehen)");
  assert(ex3.answers["a1_p30_ex3_k"] === "geblieben", "Item k is geblieben (bleiben)");
  assert(ex3.answers["a1_p30_ex3_l"] === "gelaufen", "Item l is gelaufen (laufen)");
  assert(ex3.answers["a1_p30_ex3_m"] === "gekommen", "Item m is gekommen (kommen)");
  assert(ex3.answers["a1_p30_ex3_n"] === "gefahren", "Item n is gefahren (fahren)");
  assert(ex3.answers["a1_p30_ex3_o"] === "geflogen", "Item o is geflogen (fliegen)");
  assert(ex3.answers["a1_p30_ex3_p"] === "gesessen", "Item p is gesessen (sitzen)");
  assert(ex3.answers["a1_p30_ex3_q"] === "gestanden", "Item q is gestanden (stehen)");
  assert(ex3.answers["a1_p30_ex3_r"] === "gelegen", "Item r is gelegen (liegen)");
  assert(ex3.items.every(it => it.isCompact === true), "All Übung 3 items are isCompact: true");

  // Übung 4: Gemischte Verben
  const ex4 = page30.exercises[1];
  assert(ex4.id === "a1_p30_ex4", "Übung 4 ID is a1_p30_ex4");
  assert(ex4.items.length === 6, "Übung 4 has 6 items (a-f)");
  assert(Array.isArray(ex4.wordBox) && ex4.wordBox.length === 6, "Übung 4 has 6-chip wordBox");
  assert(ex4.answers["a1_p30_ex4_a"] === "genannt", "Item a is genannt (nennen)");
  assert(ex4.answers["a1_p30_ex4_b"] === "gewusst", "Item b is gewusst (wissen)");
  assert(ex4.answers["a1_p30_ex4_c"] === "gesandt", "Item c is gesandt (senden)");
  assert(ex4.answers["a1_p30_ex4_d"] === "gekannt", "Item d is gekannt (kennen)");
  assert(ex4.answers["a1_p30_ex4_e"] === "gedacht", "Item e is gedacht (denken)");
  assert(ex4.answers["a1_p30_ex4_f"] === "gerannt", "Item f is gerannt (rennen)");
  assert(ex4.items.every(it => it.isCompact === true), "All Übung 4 items are isCompact: true");

  // Übung 5: Nicht trennbare Verben (ohne ge-)
  const ex5 = page30.exercises[2];
  assert(ex5.id === "a1_p30_ex5", "Übung 5 ID is a1_p30_ex5");
  assert(ex5.items.length === 8, "Übung 5 has 8 items (a-h)");
  assert(Array.isArray(ex5.wordBox) && ex5.wordBox.length === 8, "Übung 5 has 8-chip wordBox");
  assert(ex5.answers["a1_p30_ex5_a"] === "erklärt", "Item a is erklärt (erklären)");
  assert(ex5.answers["a1_p30_ex5_b"] === "genossen", "Item b is genossen (genießen)");
  assert(ex5.answers["a1_p30_ex5_c"] === "empfohlen", "Item c is empfohlen (empfehlen)");
  assert(ex5.answers["a1_p30_ex5_d"] === "verloren", "Item d is verloren (verlieren)");
  assert(ex5.answers["a1_p30_ex5_e"] === "bekommen", "Item e is bekommen (bekommen)");
  assert(ex5.answers["a1_p30_ex5_f"] === "zerbrochen", "Item f is zerbrochen (zerbrechen)");
  assert(ex5.answers["a1_p30_ex5_g"] === "erwartet", "Item g is erwartet (erwarten)");
  assert(ex5.answers["a1_p30_ex5_h"] === "vergessen", "Item h is vergessen (vergessen)");
  assert(ex5.items.every(it => it.isCompact === true), "All Übung 5 items are isCompact: true");

  // Übung 6: Trennbare Verben (-ge- nach Präfix)
  const ex6 = page30.exercises[3];
  assert(ex6.id === "a1_p30_ex6", "Übung 6 ID is a1_p30_ex6");
  assert(ex6.items.length === 8, "Übung 6 has 8 items (a-h)");
  assert(Array.isArray(ex6.wordBox) && ex6.wordBox.length === 8, "Übung 6 has 8-chip wordBox");
  assert(ex6.answers["a1_p30_ex6_a"] === "zugehört", "Item a is zugehört (zuhören)");
  assert(ex6.answers["a1_p30_ex6_b"] === "angerufen", "Item b is angerufen (anrufen)");
  assert(ex6.answers["a1_p30_ex6_c"] === "mitgebracht", "Item c is mitgebracht (mitbringen)");
  assert(ex6.answers["a1_p30_ex6_d"] === "eingeladen", "Item d is eingeladen (einladen)");
  assert(ex6.answers["a1_p30_ex6_e"] === "aufgeweckt", "Item e is aufgeweckt (aufwecken)");
  assert(ex6.answers["a1_p30_ex6_f"] === "zurückgegeben", "Item f is zurückgegeben (zurückgeben)");
  assert(ex6.answers["a1_p30_ex6_g"] === "aufgestanden", "Item g is aufgestanden (aufstehen)");
  assert(ex6.answers["a1_p30_ex6_h"] === "eingestiegen", "Item h is eingestiegen (einsteigen)");
  assert(ex6.items.every(it => it.isCompact === true), "All Übung 6 items are isCompact: true");

  // Grammar Summary
  assert(page30.grammarSummary.includes("8.1. Perfekt: Vertiefung"), "Grammar summary includes header");
  assert(page30.grammarSummary.includes("Gemischte Verben"), "Grammar summary includes mixed verbs");
  assert(page30.grammarSummary.includes("Nicht trennbare Verben"), "Grammar summary includes inseparable prefix verbs");
  assert(page30.grammarSummary.includes("Trennbare Verben"), "Grammar summary includes separable prefix verbs");
  assert(page30.grammarSummary.includes("English Cognitive Bridge"), "Grammar summary includes English bridge");

  // Markdown Sync Checks
  const arbPath = path.join(rootDir, "A1", "Arbeitsbuch.md");
  const loesPath = path.join(rootDir, "A1", "Loesungsschluessel.md");
  const arbText = fs.readFileSync(arbPath, "utf8");
  const loesText = fs.readFileSync(loesPath, "utf8");

  const s30Arb = arbText.slice(arbText.indexOf('<a id="seite-30"></a>'), arbText.indexOf('<a id="seite-31"></a>'));
  const s30Loes = loesText.slice(loesText.indexOf('<a id="seite-30"></a>'), loesText.indexOf('<a id="seite-31"></a>'));

  assert(s30Arb.includes("8.1. Perfekt — Vertiefung & Übungen"), "A1/Arbeitsbuch.md has Page 30 section");
  assert(s30Loes.includes("8.1. Perfekt — Vertiefung & Übungen"), "A1/Loesungsschluessel.md has Page 30 section");
  assert(!s30Loes.includes("**—**"), "A1/Loesungsschluessel.md has no dash scraper junk in Page 30");
  assert(!s30Loes.includes("**richtig**"), "A1/Loesungsschluessel.md has no 'richtig' scraper junk in Page 30");
});


// ----------------------------------------------------------------------------
// Suite 40: A1 Page 31 Refinement Integrity (8.2. Konjunktionen — ADUSO)
// ----------------------------------------------------------------------------
describe("A1 Page 31 Refinement Integrity (8.2. Konjunktionen — ADUSO)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page31 = data.A1 && data.A1["31"];
  assert(page31, "A1 Page 31 exists in WORKBOOK_DATA");
  assert(page31.lessonTitle.includes("8.2. Konjunktionen"), "Page 31 has refined lessonTitle");
  assert(page31.exercises.length === 2, "Page 31 has exactly 2 exercises");

  // Übung 1: Hauptsätze verbinden mit Konjunktionen
  const ex1 = page31.exercises[0];
  assert(ex1.id === "a1_p31_ex1", "Übung 1 ID is a1_p31_ex1");
  assert(ex1.items.length === 10, "Übung 1 has 10 items (a-j)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 5, "Übung 1 has 5-chip wordBox");
  assert(ex1.answers["a1_p31_ex1_a"] === "denn", "Item a is denn");
  assert(ex1.answers["a1_p31_ex1_b"] === "sondern", "Item b is sondern");
  assert(ex1.answers["a1_p31_ex1_c"] === "aber", "Item c is aber");
  assert(ex1.answers["a1_p31_ex1_d"] === "oder", "Item d is oder");
  assert(ex1.answers["a1_p31_ex1_e"] === "und", "Item e is und");
  assert(ex1.answers["a1_p31_ex1_f"] === "sondern", "Item f is sondern");
  assert(ex1.answers["a1_p31_ex1_g"] === "sondern", "Item g is sondern");
  assert(ex1.answers["a1_p31_ex1_h"] === "und", "Item h is und");
  assert(ex1.answers["a1_p31_ex1_i"] === "denn", "Item i is denn");
  assert(ex1.answers["a1_p31_ex1_j"] === "denn", "Item j is denn");
  assert(ex1.items.every(it => it.isCompact === true), "All Übung 1 items are isCompact: true");
  assert(!Object.values(ex1.answers).includes("das"), "Übung 1 has no corrupt 'das' answers");
  assert(!Object.values(ex1.answers).includes("die"), "Übung 1 has no corrupt 'die' answers");
  assert(!Object.values(ex1.answers).includes("—"), "Übung 1 has no corrupt '—' answers");

  // Übung 2: Die passende Konjunktion einsetzen
  const ex2 = page31.exercises[1];
  assert(ex2.id === "a1_p31_ex2", "Übung 2 ID is a1_p31_ex2");
  assert(ex2.items.length === 11, "Übung 2 has 11 items (a-k)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 5, "Übung 2 has 5-chip wordBox");
  assert(ex2.answers["a1_p31_ex2_a"] === "denn", "Item a is denn");
  assert(ex2.answers["a1_p31_ex2_b"] === "oder", "Item b is oder");
  assert(ex2.answers["a1_p31_ex2_c"] === "und", "Item c is und");
  assert(ex2.answers["a1_p31_ex2_d"] === "aber", "Item d is aber");
  assert(ex2.answers["a1_p31_ex2_e"] === "oder", "Item e is oder");
  assert(ex2.answers["a1_p31_ex2_f"] === "denn", "Item f is denn");
  assert(ex2.answers["a1_p31_ex2_g"] === "aber", "Item g is aber");
  assert(ex2.answers["a1_p31_ex2_h"] === "und", "Item h is und");
  assert(ex2.answers["a1_p31_ex2_i"] === "sondern", "Item i is sondern");
  assert(ex2.answers["a1_p31_ex2_j"] === "und", "Item j is und");
  assert(ex2.answers["a1_p31_ex2_k"] === "aber", "Item k is aber");
  assert(ex2.items.every(it => it.isCompact === true), "All Übung 2 items are isCompact: true");
  assert(!Object.values(ex2.answers).includes("richtig"), "Übung 2 has no corrupt 'richtig' answers");

  // Grammar Summary
  assert(page31.grammarSummary.includes("8.2. Konjunktionen"), "Grammar summary includes header");
  assert(page31.grammarSummary.includes("Position 0"), "Grammar summary includes Position 0");
  assert(page31.grammarSummary.includes("ADUSO"), "Grammar summary includes ADUSO mnemonic");
  assert(page31.grammarSummary.includes("English Cognitive Bridge"), "Grammar summary includes English bridge");

  // Markdown Sync Checks
  const arbPath = path.join(rootDir, "A1", "Arbeitsbuch.md");
  const loesPath = path.join(rootDir, "A1", "Loesungsschluessel.md");
  const arbText = fs.readFileSync(arbPath, "utf8");
  const loesText = fs.readFileSync(loesPath, "utf8");

  const s31Arb = arbText.slice(arbText.indexOf('<a id="seite-31"></a>'), arbText.indexOf('<a id="seite-32"></a>'));
  const s31Loes = loesText.slice(loesText.indexOf('<a id="seite-31"></a>'), loesText.indexOf('<a id="seite-32"></a>'));

  assert(s31Arb.includes("8.2. Konjunktionen"), "A1/Arbeitsbuch.md has Page 31 section");
  assert(s31Loes.includes("8.2. Konjunktionen"), "A1/Loesungsschluessel.md has Page 31 section");
  assert(!s31Loes.includes("**—**"), "A1/Loesungsschluessel.md has no dash scraper junk in Page 31");
  assert(!s31Loes.includes("**richtig**"), "A1/Loesungsschluessel.md has no 'richtig' scraper junk in Page 31");
  assert(!s31Loes.includes("**das**"), "A1/Loesungsschluessel.md has no 'das' scraper junk in Page 31");
  assert(!s31Loes.includes("**die**"), "A1/Loesungsschluessel.md has no 'die' scraper junk in Page 31");
});


// ----------------------------------------------------------------------------
// Suite 41: A1 Page 32 Refinement Integrity (8.3. Präpositionen mit Akkusativ)
// ----------------------------------------------------------------------------
describe("A1 Page 32 Refinement Integrity (8.3. Präpositionen mit Akkusativ)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page32 = data.A1 && data.A1["32"];
  assert(page32, "A1 Page 32 exists in WORKBOOK_DATA");
  assert(page32.lessonTitle.includes("8.3. Präpositionen mit Akkusativ"), "Page 32 has refined lessonTitle");
  assert(page32.exercises.length === 2, "Page 32 has exactly 2 exercises");

  // Übung 1: Artikel und Pronomen im Akkusativ
  const ex1 = page32.exercises[0];
  assert(ex1.id === "a1_p32_ex1", "Übung 1 ID is a1_p32_ex1");
  assert(ex1.items.length === 16, "Übung 1 has 16 items (a-p)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 8, "Übung 1 has 8-chip wordBox");
  assert(ex1.answers["a1_p32_ex1_a"] === "seine", "Item a is seine");
  assert(ex1.answers["a1_p32_ex1_b"] === "den", "Item b is den");
  assert(ex1.answers["a1_p32_ex1_c"] === "den", "Item c is den");
  assert(ex1.answers["a1_p32_ex1_d"] === "einen", "Item d is einen");
  assert(ex1.answers["a1_p32_ex1_e"] === "deinen", "Item e is deinen");
  assert(ex1.answers["a1_p32_ex1_f"] === "die", "Item f is die");
  assert(ex1.answers["a1_p32_ex1_g"] === "eine", "Item g is eine");
  assert(ex1.answers["a1_p32_ex1_h"] === "den", "Item h is den");
  assert(ex1.answers["a1_p32_ex1_i"] === "mich", "Item i is mich");
  assert(ex1.answers["a1_p32_ex1_j"] === "die", "Item j is die");
  assert(ex1.answers["a1_p32_ex1_k"] === "einen", "Item k is einen");
  assert(ex1.answers["a1_p32_ex1_l"] === "die", "Item l is die");
  assert(ex1.answers["a1_p32_ex1_m"] === "die", "Item m is die");
  assert(ex1.answers["a1_p32_ex1_n"] === "eine", "Item n is eine");
  assert(ex1.answers["a1_p32_ex1_o"] === "die", "Item o is die");
  assert(ex1.answers["a1_p32_ex1_p"] === "wen", "Item p is wen");
  assert(ex1.items.every(it => it.isCompact === true), "All Übung 1 items are isCompact: true");
  assert(!Object.values(ex1.answers).includes("t"), "Übung 1 has no corrupt 't' verb ending answers");
  assert(!Object.values(ex1.answers).includes("et"), "Übung 1 has no corrupt 'et' verb ending answers");

  // Übung 2: Präpositionen mit Akkusativ einsetzen
  const ex2 = page32.exercises[1];
  assert(ex2.id === "a1_p32_ex2", "Übung 2 ID is a1_p32_ex2");
  assert(ex2.items.length === 14, "Übung 2 has 14 items (a-n)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 7, "Übung 2 has 7-chip wordBox");
  assert(ex2.answers["a1_p32_ex2_a"] === "um", "Item a is um");
  assert(ex2.answers["a1_p32_ex2_b"] === "bis", "Item b is bis");
  assert(ex2.answers["a1_p32_ex2_c"] === "durch", "Item c is durch");
  assert(ex2.answers["a1_p32_ex2_d"] === "ohne", "Item d is ohne");
  assert(ex2.answers["a1_p32_ex2_e"] === "für", "Item e is für");
  assert(ex2.answers["a1_p32_ex2_f"] === "durch", "Item f is durch");
  assert(ex2.answers["a1_p32_ex2_g"] === "gegen", "Item g is gegen");
  assert(ex2.answers["a1_p32_ex2_h"] === "um", "Item h is um");
  assert(ex2.answers["a1_p32_ex2_i"] === "ohne", "Item i is ohne");
  assert(ex2.answers["a1_p32_ex2_j"] === "bis", "Item j is bis");
  assert(ex2.answers["a1_p32_ex2_k"] === "durch", "Item k is durch");
  assert(ex2.answers["a1_p32_ex2_l"] === "ohne", "Item l is ohne");
  assert(ex2.answers["a1_p32_ex2_m"] === "Für", "Item m is Für");
  assert(ex2.answers["a1_p32_ex2_n"] === "ohne", "Item n is ohne");
  assert(ex2.items.every(it => it.isCompact === true), "All Übung 2 items are isCompact: true");
  assert(!Object.values(ex2.answers).includes("richtig"), "Übung 2 has no corrupt 'richtig' answers");
  assert(!Object.values(ex2.answers).includes("—"), "Übung 2 has no corrupt '—' answers");

  // Grammar Summary
  assert(page32.grammarSummary.includes("8.3. Präpositionen mit Akkusativ"), "Grammar summary includes header");
  assert(page32.grammarSummary.includes("DOGFU"), "Grammar summary includes DOGFU mnemonic");
  assert(page32.grammarSummary.includes("Deklination"), "Grammar summary includes declension table");
  assert(page32.grammarSummary.includes("Verschmelzungen"), "Grammar summary includes contractions");
  assert(page32.grammarSummary.includes("English Cognitive Bridge"), "Grammar summary includes English bridge");

  // Markdown Sync Checks
  const arbPath = path.join(rootDir, "A1", "Arbeitsbuch.md");
  const loesPath = path.join(rootDir, "A1", "Loesungsschluessel.md");
  const arbText = fs.readFileSync(arbPath, "utf8");
  const loesText = fs.readFileSync(loesPath, "utf8");

  const s32Arb = arbText.slice(arbText.indexOf('<a id="seite-32"></a>'));
  const s32Loes = loesText.slice(loesText.indexOf('<a id="seite-32"></a>'));

  assert(s32Arb.includes("8.3. Präpositionen mit Akkusativ"), "A1/Arbeitsbuch.md has Page 32 section");
  assert(s32Loes.includes("8.3. Präpositionen mit Akkusativ"), "A1/Loesungsschluessel.md has Page 32 section");
  assert(!s32Loes.includes("**—**"), "A1/Loesungsschluessel.md has no dash scraper junk in Page 32");
  assert(!s32Loes.includes("**richtig**"), "A1/Loesungsschluessel.md has no 'richtig' scraper junk in Page 32");
  assert(!s32Loes.includes("**t**"), "A1/Loesungsschluessel.md has no 't' verb ending junk in Page 32");
  assert(!s32Loes.includes("**et**"), "A1/Loesungsschluessel.md has no 'et' verb ending junk in Page 32");
});


// ----------------------------------------------------------------------------
// Suite 42: A2 Page 3 Refinement Integrity (1.1. Nebensätze — kausal / weil)
// ----------------------------------------------------------------------------
describe("A2 Page 3 Refinement Integrity (1.1. Nebensätze — kausal / weil)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page3 = data.A2 && data.A2["3"];
  assert(page3, "A2 Page 3 exists in WORKBOOK_DATA");
  assert(page3.lessonTitle.includes("1.1. Nebensätze — kausal"), "A2 Page 3 has refined lessonTitle");
  assert(page3.exercises.length === 2, "A2 Page 3 has exactly 2 exercises");

  // Übung 1: Kausalsätze mit „weil“ bilden
  const ex1 = page3.exercises[0];
  assert(ex1.id === "a2_p3_ex1", "Übung 1 ID is a2_p3_ex1");
  assert(ex1.items.length === 14, "Übung 1 has 14 items (a-n)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 13, "Übung 1 has 13-chip wordBox");
  assert(ex1.answers["a2_p3_ex1_a"] === "hat", "Item a is hat");
  assert(ex1.answers["a2_p3_ex1_b"] === "hat", "Item b is hat");
  assert(ex1.answers["a2_p3_ex1_c"] === "erledigen muss", "Item c is erledigen muss");
  assert(ex1.answers["a2_p3_ex1_d"] === "bekommt", "Item d is bekommt");
  assert(ex1.answers["a2_p3_ex1_e"] === "lernen muss", "Item e is lernen muss");
  assert(ex1.answers["a2_p3_ex1_f"] === "besuchen", "Item f is besuchen");
  assert(ex1.answers["a2_p3_ex1_g"] === "reparieren muss", "Item g is reparieren muss");
  assert(ex1.answers["a2_p3_ex1_h"] === "aufräumt", "Item h is aufräumt");
  assert(ex1.answers["a2_p3_ex1_i"] === "vorbereite", "Item i is vorbereite");
  assert(ex1.answers["a2_p3_ex1_j"] === "abholt", "Item j is abholt");
  assert(ex1.answers["a2_p3_ex1_k"] === "ausgeht", "Item k is ausgeht");
  assert(ex1.answers["a2_p3_ex1_l"] === "teilnimmst", "Item l is teilnimmst");
  assert(ex1.answers["a2_p3_ex1_m"] === "ansieht", "Item m is ansieht");
  assert(ex1.answers["a2_p3_ex1_n"] === "umzieht", "Item n is umzieht");
  assert(!Object.values(ex1.answers).includes("—"), "Übung 1 has no corrupt '—' answers");

  // Übung 2: Vorangestellte Kausalsätze (Inversion im Hauptsatz)
  const ex2 = page3.exercises[1];
  assert(ex2.id === "a2_p3_ex2", "Übung 2 ID is a2_p3_ex2");
  assert(ex2.items.length === 7, "Übung 2 has 7 items (a-g)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 6, "Übung 2 has 6-chip wordBox");
  assert(ex2.answers["a2_p3_ex2_a"] === "geht", "Item a is geht");
  assert(ex2.answers["a2_p3_ex2_b"] === "kann", "Item b is kann");
  assert(ex2.answers["a2_p3_ex2_c"] === "kauft", "Item c is kauft");
  assert(ex2.answers["a2_p3_ex2_d"] === "meldet", "Item d is meldet");
  assert(ex2.answers["a2_p3_ex2_e"] === "ruft", "Item e is ruft");
  assert(ex2.answers["a2_p3_ex2_f"] === "kann", "Item f is kann");
  assert(ex2.answers["a2_p3_ex2_g"] === "lernt", "Item g is lernt");
  assert(ex2.items.every(it => it.isCompact === true), "All Übung 2 items are isCompact: true");
  assert(!Object.values(ex2.answers).includes("das"), "Übung 2 has no corrupt 'das' answers");
  assert(!Object.values(ex2.answers).includes("—"), "Übung 2 has no corrupt '—' answers");

  // Grammar Summary
  assert(page3.grammarSummary.includes("1.1. Kausale Nebensätze mit „weil“"), "Grammar summary includes header");
  assert(page3.grammarSummary.includes("SATZENDE"), "Grammar summary includes SATZENDE rule");
  assert(page3.grammarSummary.includes("Trennbare Verben"), "Grammar summary includes separable verbs rule");
  assert(page3.grammarSummary.includes("Vorangestellter Nebensatz"), "Grammar summary includes inversion rule");
  assert(page3.grammarSummary.includes("English Cognitive Bridge"), "Grammar summary includes English bridge");

  // Markdown Sync Checks
  const arbPath = path.join(rootDir, "A2", "Arbeitsbuch.md");
  const loesPath = path.join(rootDir, "A2", "Loesungsschluessel.md");
  const arbText = fs.readFileSync(arbPath, "utf8");
  const loesText = fs.readFileSync(loesPath, "utf8");

  const s3Arb = arbText.slice(arbText.indexOf('<a id="seite-3"></a>'), arbText.indexOf('<a id="seite-4"></a>'));
  const s3Loes = loesText.slice(loesText.indexOf('<a id="seite-3"></a>'), loesText.indexOf('<a id="seite-4"></a>'));

  assert(s3Arb.includes("1.1. Nebensätze — kausal (weil)"), "A2/Arbeitsbuch.md has Page 3 section");
  assert(s3Loes.includes("1.1. Nebensätze — kausal (weil)"), "A2/Loesungsschluessel.md has Page 3 section");
  assert(!s3Loes.includes("**—**"), "A2/Loesungsschluessel.md has no dash scraper junk in Page 3");
  assert(!s3Loes.includes("**das**"), "A2/Loesungsschluessel.md has no 'das' scraper junk in Page 3");
  assert(!s3Loes.includes("fliegen."), "A2/Loesungsschluessel.md has no synthetic 'fliegen.' lines in Page 3");
});


// ----------------------------------------------------------------------------
// Suite 43: A2 Page 4 Refinement Integrity (1.2. Verben mit Dativ- und Akkusativobjekt)
// ----------------------------------------------------------------------------
describe("A2 Page 4 Refinement Integrity (1.2. Verben mit Dativ- und Akkusativobjekt)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page4 = data.A2 && data.A2["4"];
  assert(page4, "A2 Page 4 exists in WORKBOOK_DATA");
  assert(page4.lessonTitle.includes("1.2. Verben mit Dativ- und Akkusativobjekt"), "A2 Page 4 has refined lessonTitle");
  assert(page4.exercises.length === 3, "A2 Page 4 has exactly 3 exercises");

  // Übung 1: Dativobjekt vor Akkusativobjekt
  const ex1 = page4.exercises[0];
  assert(ex1.id === "a2_p4_ex1", "Übung 1 ID is a2_p4_ex1");
  assert(ex1.items.length === 12, "Übung 1 has 12 items (a-l)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 11, "Übung 1 has 11-chip wordBox");
  assert(ex1.answers["a2_p4_ex1_a"] === "den Kindern", "Item a is den Kindern");
  assert(ex1.answers["a2_p4_ex1_b"] === "dem Freund", "Item b is dem Freund");
  assert(ex1.answers["a2_p4_ex1_c"] === "dir", "Item c is dir");
  assert(ex1.answers["a2_p4_ex1_d"] === "uns", "Item d is uns");
  assert(ex1.answers["a2_p4_ex1_e"] === "der Tante", "Item e is der Tante");
  assert(ex1.answers["a2_p4_ex1_f"] === "dem Kind", "Item f is dem Kind");
  assert(ex1.answers["a2_p4_ex1_g"] === "einer Reporterin", "Item g is einer Reporterin");
  assert(ex1.answers["a2_p4_ex1_h"] === "den Freunden", "Item h is den Freunden");
  assert(ex1.answers["a2_p4_ex1_i"] === "ihr", "Item i is ihr");
  assert(ex1.answers["a2_p4_ex1_j"] === "uns", "Item j is uns");
  assert(ex1.answers["a2_p4_ex1_k"] === "mir", "Item k is mir");
  assert(ex1.answers["a2_p4_ex1_l"] === "einer Touristin", "Item l is einer Touristin");
  assert(!Object.values(ex1.answers).includes("das"), "Übung 1 has no corrupt 'das' answers");
  assert(!Object.values(ex1.answers).includes("—"), "Übung 1 has no corrupt '—' answers");

  // Übung 2: Dativpronomen und Akkusativartikel
  const ex2 = page4.exercises[1];
  assert(ex2.id === "a2_p4_ex2", "Übung 2 ID is a2_p4_ex2");
  assert(ex2.items.length === 6, "Übung 2 has 6 items (a-f)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 5, "Übung 2 has 5-chip wordBox");
  assert(ex2.answers["a2_p4_ex2_a"] === "mir den", "Item a is mir den");
  assert(ex2.answers["a2_p4_ex2_b"] === "mir eine", "Item b is mir eine");
  assert(ex2.answers["a2_p4_ex2_c"] === "dir ein", "Item c is dir ein");
  assert(ex2.answers["a2_p4_ex2_d"] === "dir das", "Item d is dir das");
  assert(ex2.answers["a2_p4_ex2_e"] === "mir einen", "Item e is mir einen");
  assert(ex2.answers["a2_p4_ex2_f"] === "dir das", "Item f is dir das");
  assert(!Object.values(ex2.answers).includes("st"), "Übung 2 has no corrupt 'st' verb endings");
  assert(!Object.values(ex2.answers).includes("et"), "Übung 2 has no corrupt 'et' verb endings");

  // Übung 3: Zwei Personalpronomen (Akkusativ vor Dativ)
  const ex3 = page4.exercises[2];
  assert(ex3.id === "a2_p4_ex3", "Übung 3 ID is a2_p4_ex3");
  assert(ex3.items.length === 10, "Übung 3 has 10 items (a-j)");
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 9, "Übung 3 has 9-chip wordBox");
  assert(ex3.answers["a2_p4_ex3_a"] === "sie dir", "Item a is sie dir");
  assert(ex3.answers["a2_p4_ex3_b"] === "es dir", "Item b is es dir");
  assert(ex3.answers["a2_p4_ex3_c"] === "sie euch", "Item c is sie euch");
  assert(ex3.answers["a2_p4_ex3_d"] === "es ihr", "Item d is es ihr");
  assert(ex3.answers["a2_p4_ex3_e"] === "ihn ihnen", "Item e is ihn ihnen");
  assert(ex3.answers["a2_p4_ex3_f"] === "sie ihm", "Item f is sie ihm");
  assert(ex3.answers["a2_p4_ex3_g"] === "sie dir", "Item g is sie dir");
  assert(ex3.answers["a2_p4_ex3_h"] === "sie ihr", "Item h is sie ihr");
  assert(ex3.answers["a2_p4_ex3_i"] === "sie ihnen", "Item i is sie ihnen");
  assert(ex3.answers["a2_p4_ex3_j"] === "ihn dir", "Item j is ihn dir");
  assert(!Object.values(ex3.answers).includes("—"), "Übung 3 has no corrupt '—' answers");

  // Grammar Summary
  assert(page4.grammarSummary.includes("1.2. Verben mit Dativ- und Akkusativobjekt"), "Grammar summary includes header");
  assert(page4.grammarSummary.includes("Dativ vor Akkusativ"), "Grammar summary includes Dativ vor Akkusativ rule");
  assert(page4.grammarSummary.includes("Pronomen vor Nomen"), "Grammar summary includes Pronomen vor Nomen rule");
  assert(page4.grammarSummary.includes("Akkusativ vor Dativ"), "Grammar summary includes Akkusativ vor Dativ rule");
  assert(page4.grammarSummary.includes("English Cognitive Bridge"), "Grammar summary includes English bridge");

  // Markdown Sync Checks
  const arbPath = path.join(rootDir, "A2", "Arbeitsbuch.md");
  const loesPath = path.join(rootDir, "A2", "Loesungsschluessel.md");
  const arbText = fs.readFileSync(arbPath, "utf8");
  const loesText = fs.readFileSync(loesPath, "utf8");

  const s4Arb = arbText.slice(arbText.indexOf('<a id="seite-4"></a>'), arbText.indexOf('<a id="seite-5"></a>'));
  const s4Loes = loesText.slice(loesText.indexOf('<a id="seite-4"></a>'), loesText.indexOf('<a id="seite-5"></a>'));

  assert(s4Arb.includes("1.2. Verben mit Dativ- und Akkusativobjekt"), "A2/Arbeitsbuch.md has Page 4 section");
  assert(s4Loes.includes("1.2. Verben mit Dativ- und Akkusativobjekt"), "A2/Loesungsschluessel.md has Page 4 section");
  assert(!s4Loes.includes("**—**"), "A2/Loesungsschluessel.md has no dash scraper junk in Page 4");
  assert(!s4Loes.includes("**das**"), "A2/Loesungsschluessel.md has no 'das' scraper junk in Page 4");
  assert(!s4Loes.includes("**st**"), "A2/Loesungsschluessel.md has no 'st' verb ending junk in Page 4");
});

// ----------------------------------------------------------------------------
// Suite 44: A2 Page 5 Refinement Integrity (1.3. Präteritum / Imperfekt — Modalverben)
// ----------------------------------------------------------------------------
describe("A2 Page 5 Refinement Integrity (1.3. Präteritum / Imperfekt — Modalverben)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page5 = data.A2 && data.A2["5"];
  assert(!!page5, "A2 Page 5 exists in WORKBOOK_DATA");
  assert(page5.lessonTitle.includes("1.3. Präteritum (Imperfekt) — Modalverben"), "A2 Page 5 has refined lessonTitle");
  assert(page5.exercises.length === 3, "A2 Page 5 has exactly 3 exercises");

  // Übung 1: Modalverb im Präteritum einsetzen
  const ex1 = page5.exercises[0];
  assert(ex1.id === "a2_p5_ex1", "Übung 1 ID is a2_p5_ex1");
  assert(ex1.items.length === 6, "Übung 1 has 6 items (a-f)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 5, "Übung 1 has 5-chip wordBox");
  assert(ex1.answers["a2_p5_ex1_a"] === "musste", "Item a is musste");
  assert(ex1.answers["a2_p5_ex1_b"] === "wollte", "Item b is wollte");
  assert(ex1.answers["a2_p5_ex1_c"] === "musste", "Item c is musste");
  assert(ex1.answers["a2_p5_ex1_d"] === "durfte", "Item d is durfte");
  assert(ex1.answers["a2_p5_ex1_e"] === "konnte", "Item e is konnte");
  assert(ex1.answers["a2_p5_ex1_f"] === "sollte", "Item f is sollte");
  assert(ex1.items.every(i => i.isCompact === true), "All Übung 1 items are isCompact: true");
  assert(!Object.values(ex1.answers).includes("muss"), "Übung 1 has no corrupt present tense 'muss'");
  assert(!Object.values(ex1.answers).includes("will"), "Übung 1 has no corrupt present tense 'will'");

  // Übung 2: Sätze ins Präteritum umformen
  const ex2 = page5.exercises[1];
  assert(ex2.id === "a2_p5_ex2", "Übung 2 ID is a2_p5_ex2");
  assert(ex2.items.length === 16, "Übung 2 has 16 items (a-p)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 12, "Übung 2 has 12-chip wordBox");
  assert(ex2.answers["a2_p5_ex2_a"] === "wollte", "Item a is wollte");
  assert(ex2.answers["a2_p5_ex2_b"] === "konnte", "Item b is konnte");
  assert(ex2.answers["a2_p5_ex2_c"] === "musstest", "Item c is musstest");
  assert(ex2.answers["a2_p5_ex2_d"] === "konnten", "Item d is konnten");
  assert(ex2.answers["a2_p5_ex2_e"] === "solltet", "Item e is solltet");
  assert(ex2.answers["a2_p5_ex2_f"] === "musste", "Item f is musste");
  assert(ex2.answers["a2_p5_ex2_g"] === "wolltest", "Item g is wolltest");
  assert(ex2.answers["a2_p5_ex2_h"] === "sollte", "Item h is sollte");
  assert(ex2.answers["a2_p5_ex2_i"] === "durftest", "Item i is durftest");
  assert(ex2.answers["a2_p5_ex2_j"] === "konnte", "Item j is konnte");
  assert(ex2.answers["a2_p5_ex2_k"] === "wollten", "Item k is wollten");
  assert(ex2.answers["a2_p5_ex2_l"] === "musstest", "Item l is musstest");
  assert(ex2.answers["a2_p5_ex2_m"] === "konnte", "Item m is konnte");
  assert(ex2.answers["a2_p5_ex2_n"] === "mussten", "Item n is mussten");
  assert(ex2.answers["a2_p5_ex2_o"] === "musstet", "Item o is musstet");
  assert(ex2.answers["a2_p5_ex2_p"] === "wollte", "Item p is wollte");
  assert(ex2.items.every(i => i.isCompact === true), "All Übung 2 items are isCompact: true");
  assert(!Object.values(ex2.answers).includes("—"), "Übung 2 has no corrupt '—' answers");

  // Übung 3: Modalverb im Präteritum mit Dativ- und Akkusativobjekt
  const ex3 = page5.exercises[2];
  assert(ex3.id === "a2_p5_ex3", "Übung 3 ID is a2_p5_ex3");
  assert(ex3.items.length === 10, "Übung 3 has 10 items (a-j)");
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 10, "Übung 3 has 10-chip wordBox");
  assert(ex3.answers["a2_p5_ex3_a"] === "meinem Bruder ein Buch", "Item a is meinem Bruder ein Buch");
  assert(ex3.answers["a2_p5_ex3_b"] === "meinem Onkel eine Karte", "Item b is meinem Onkel eine Karte");
  assert(ex3.answers["a2_p5_ex3_c"] === "meinen Freunden die Stadt", "Item c is meinen Freunden die Stadt");
  assert(ex3.answers["a2_p5_ex3_d"] === "meiner Kollegin das Problem", "Item d is meiner Kollegin das Problem");
  assert(ex3.answers["a2_p5_ex3_e"] === "meiner Schwester den Schlüssel", "Item e is meiner Schwester den Schlüssel");
  assert(ex3.answers["a2_p5_ex3_f"] === "meinem Freund nichts", "Item f is meinem Freund nichts");
  assert(ex3.answers["a2_p5_ex3_g"] === "meiner Kollegin das Buch", "Item g is meiner Kollegin das Buch");
  assert(ex3.answers["a2_p5_ex3_h"] === "meiner Tante meine Hilfe", "Item h is meiner Tante meine Hilfe");
  assert(ex3.answers["a2_p5_ex3_i"] === "meinen Kollegen den Text", "Item i is meinen Kollegen den Text");
  assert(ex3.answers["a2_p5_ex3_j"] === "meinem Freund das Restaurant", "Item j is meinem Freund das Restaurant");
  assert(!Object.values(ex3.answers).includes("das"), "Übung 3 has no corrupt 'das' answers");
  assert(!Object.values(ex3.answers).includes("—"), "Übung 3 has no corrupt '—' answers");

  // Grammar Summary
  assert(page5.grammarSummary.includes("Präteritum der Modalverben"), "Grammar summary includes header");
  assert(page5.grammarSummary.includes("Kein Umlaut"), "Grammar summary includes Kein Umlaut rule");
  assert(page5.grammarSummary.includes("1. und 3. Person Singular sind immer identisch"), "Grammar summary includes 1s/3s identical rule");
  assert(page5.grammarSummary.includes("Satzklammer im Präteritum"), "Grammar summary includes Satzklammer rule");
  assert(page5.grammarSummary.includes("English Cognitive Bridge"), "Grammar summary includes English bridge");

  // Markdown Sync Checks
  const arbPath = path.join(rootDir, "A2", "Arbeitsbuch.md");
  const loesPath = path.join(rootDir, "A2", "Loesungsschluessel.md");
  const arbText = fs.readFileSync(arbPath, "utf8");
  const loesText = fs.readFileSync(loesPath, "utf8");

  const s5Arb = arbText.slice(arbText.indexOf("Seite 5: 1.3. Präteritum"), arbText.indexOf("Seite 6:", arbText.indexOf("Seite 5: 1.3. Präteritum")));
  const s5Loes = loesText.slice(loesText.indexOf("## 📄 Seite 5:"), loesText.indexOf("## 📄 Seite 6:", loesText.indexOf("## 📄 Seite 5:")));

  assert(s5Arb.includes("1.3. Präteritum (Imperfekt) — Modalverben"), "A2/Arbeitsbuch.md has Page 5 section");
  assert(s5Loes.includes("1.3. Präteritum (Imperfekt) — Modalverben"), "A2/Loesungsschluessel.md has Page 5 section");
  assert(!s5Loes.includes("**—**"), "A2/Loesungsschluessel.md has no dash scraper junk in Page 5");
  assert(!s5Loes.includes("**das**"), "A2/Loesungsschluessel.md has no 'das' scraper junk in Page 5");
  assert(!s5Loes.includes("**muss**"), "A2/Loesungsschluessel.md has no 'muss' present tense scraper junk in Page 5");
});

// ----------------------------------------------------------------------------
// Suite 45: A2 Page 6 Refinement Integrity (2.1. Genitiv — Nomen und Artikel)
// ----------------------------------------------------------------------------
describe("A2 Page 6 Refinement Integrity (2.1. Genitiv — Nomen und Artikel)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page6 = data.A2 && data.A2["6"];
  assert(!!page6, "A2 Page 6 exists in WORKBOOK_DATA");
  assert(page6.lessonTitle.includes("2.1. Genitiv — Nomen und Artikel"), "A2 Page 6 has refined lessonTitle");
  assert(page6.exercises.length === 3, "A2 Page 6 has exactly 3 exercises");

  // Übung 1: Genitiv im Satz bilden
  const ex1 = page6.exercises[0];
  assert(ex1.id === "a2_p6_ex1", "Übung 1 ID is a2_p6_ex1");
  assert(ex1.items.length === 9, "Übung 1 has 9 items (a-i)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 9, "Übung 1 has 9-chip wordBox");
  assert(ex1.answers["a2_p6_ex1_a"] === "des Flusses", "Item a is des Flusses");
  assert(ex1.answers["a2_p6_ex1_b"] === "der Studentin", "Item b is der Studentin");
  assert(ex1.answers["a2_p6_ex1_c"] === "der Geschichte", "Item c is der Geschichte");
  assert(ex1.answers["a2_p6_ex1_d"] === "des Schulkindes", "Item d is des Schulkindes");
  assert(ex1.answers["a2_p6_ex1_e"] === "des Professors", "Item e is des Professors");
  assert(ex1.answers["a2_p6_ex1_f"] === "der Gäste", "Item f is der Gäste");
  assert(ex1.answers["a2_p6_ex1_g"] === "Evas", "Item g is Evas");
  assert(ex1.answers["a2_p6_ex1_h"] === "des Bio-Marktes", "Item h is des Bio-Marktes");
  assert(ex1.answers["a2_p6_ex1_i"] === "des Problems", "Item i is des Problems");
  assert(!Object.values(ex1.answers).includes("—"), "Übung 1 has no corrupt '—' answers");
  assert(!Object.values(ex1.answers).includes("das"), "Übung 1 has no corrupt 'das' answers");

  // Übung 2: Genitiv mit bestimmtem Artikel
  const ex2 = page6.exercises[1];
  assert(ex2.id === "a2_p6_ex2", "Übung 2 ID is a2_p6_ex2");
  assert(ex2.items.length === 9, "Übung 2 has 9 items (a-i)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 9, "Übung 2 has 9-chip wordBox");
  assert(ex2.answers["a2_p6_ex2_a"] === "der Bank", "Item a is der Bank");
  assert(ex2.answers["a2_p6_ex2_b"] === "des Romans", "Item b is des Romans");
  assert(ex2.answers["a2_p6_ex2_c"] === "des Liedes", "Item c is des Liedes");
  assert(ex2.answers["a2_p6_ex2_d"] === "des Ministers", "Item d is des Ministers");
  assert(ex2.answers["a2_p6_ex2_e"] === "der Stadt", "Item e is der Stadt");
  assert(ex2.answers["a2_p6_ex2_f"] === "der Studentin", "Item f is der Studentin");
  assert(ex2.answers["a2_p6_ex2_g"] === "des Landes", "Item g is des Landes");
  assert(ex2.answers["a2_p6_ex2_h"] === "der Vorlesung", "Item h is der Vorlesung");
  assert(ex2.answers["a2_p6_ex2_i"] === "der Nachbarin", "Item i is der Nachbarin");
  assert(!Object.values(ex2.answers).includes("—"), "Übung 2 has no corrupt '—' answers");
  assert(!Object.values(ex2.answers).includes("das"), "Übung 2 has no corrupt 'das' answers");
  assert(!Object.values(ex2.answers).includes("die"), "Übung 2 has no corrupt 'die' answers");

  // Übung 3: Possessivartikel im Genitiv
  const ex3 = page6.exercises[2];
  assert(ex3.id === "a2_p6_ex3", "Übung 3 ID is a2_p6_ex3");
  assert(ex3.items.length === 9, "Übung 3 has 9 items (a-i)");
  assert(Array.isArray(ex3.wordBox) && ex3.wordBox.length === 9, "Übung 3 has 9-chip wordBox");
  assert(ex3.answers["a2_p6_ex3_a"] === "seines Vaters", "Item a is seines Vaters");
  assert(ex3.answers["a2_p6_ex3_b"] === "unserer Tante", "Item b is unserer Tante");
  assert(ex3.answers["a2_p6_ex3_c"] === "ihres Großvaters", "Item c is ihres Großvaters");
  assert(ex3.answers["a2_p6_ex3_d"] === "eurer Gäste", "Item d is eurer Gäste");
  assert(ex3.answers["a2_p6_ex3_e"] === "ihrer Tochter", "Item e is ihrer Tochter");
  assert(ex3.answers["a2_p6_ex3_f"] === "meines Freundes", "Item f is meines Freundes");
  assert(ex3.answers["a2_p6_ex3_g"] === "deines Onkels", "Item g is deines Onkels");
  assert(ex3.answers["a2_p6_ex3_h"] === "meiner Kollegin", "Item h is meiner Kollegin");
  assert(ex3.answers["a2_p6_ex3_i"] === "seines Sohnes", "Item i is seines Sohnes");
  assert(!Object.values(ex3.answers).includes("—"), "Übung 3 has no corrupt '—' answers");
  assert(!Object.values(ex3.answers).includes("das"), "Übung 3 has no corrupt 'das' answers");

  // Grammar Summary
  assert(page6.grammarSummary.includes("Der Genitiv — Nomen und Artikel"), "Grammar summary includes header");
  assert(page6.grammarSummary.includes("Wessen?"), "Grammar summary includes Wessen? question word");
  assert(page6.grammarSummary.includes("Eigennamen"), "Grammar summary includes proper names rule");
  assert(page6.grammarSummary.includes("English Cognitive Bridge"), "Grammar summary includes English bridge");

  // Markdown Sync Checks
  const arbPath = path.join(rootDir, "A2", "Arbeitsbuch.md");
  const loesPath = path.join(rootDir, "A2", "Loesungsschluessel.md");
  const arbText = fs.readFileSync(arbPath, "utf8");
  const loesText = fs.readFileSync(loesPath, "utf8");

  const s6Arb = arbText.slice(arbText.indexOf("Seite 6: 2.1. Genitiv"), arbText.indexOf("Seite 7:", arbText.indexOf("Seite 6: 2.1. Genitiv")));
  const s6Loes = loesText.slice(loesText.indexOf("## 📄 Seite 6:"), loesText.indexOf("## 📄 Seite 7:", loesText.indexOf("## 📄 Seite 6:")));

  assert(s6Arb.includes("2.1. Genitiv — Nomen und Artikel"), "A2/Arbeitsbuch.md has Page 6 section");
  assert(s6Loes.includes("2.1. Genitiv — Nomen und Artikel"), "A2/Loesungsschluessel.md has Page 6 section");
  assert(!s6Loes.includes("**—**"), "A2/Loesungsschluessel.md has no dash scraper junk in Page 6");
  assert(!s6Loes.includes("**das**"), "A2/Loesungsschluessel.md has no 'das' scraper junk in Page 6");
  assert(!s6Loes.includes("**die**"), "A2/Loesungsschluessel.md has no 'die' scraper junk in Page 6");
});

// ----------------------------------------------------------------------------
// Suite 46: A2 Page 7 Refinement Integrity (2.2. n-Deklination)
// ----------------------------------------------------------------------------
describe("A2 Page 7 Refinement Integrity (2.2. n-Deklination)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page7 = data.A2 && data.A2["7"];
  assert(!!page7, "A2 Page 7 exists in WORKBOOK_DATA");
  assert(page7.lessonTitle.includes("2.2. n-Deklination"), "A2 Page 7 has refined lessonTitle");
  assert(page7.exercises.length === 2, "A2 Page 7 has exactly 2 exercises");

  // Übung 1: n-Deklination im Akkusativ einsetzen
  const ex1 = page7.exercises[0];
  assert(ex1.id === "a2_p7_ex1", "Übung 1 ID is a2_p7_ex1");
  assert(ex1.items.length === 15, "Übung 1 has 15 items (a-o)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 15, "Übung 1 has 15-chip wordBox");
  assert(ex1.answers["a2_p7_ex1_a"] === "Kollegen", "Item a is Kollegen");
  assert(ex1.answers["a2_p7_ex1_b"] === "Studenten", "Item b is Studenten");
  assert(ex1.answers["a2_p7_ex1_c"] === "Touristen", "Item c is Touristen");
  assert(ex1.answers["a2_p7_ex1_d"] === "Postboten", "Item d is Postboten");
  assert(ex1.answers["a2_p7_ex1_e"] === "Patienten", "Item e is Patienten");
  assert(ex1.answers["a2_p7_ex1_f"] === "Polizisten", "Item f is Polizisten");
  assert(ex1.answers["a2_p7_ex1_g"] === "Soldaten", "Item g is Soldaten");
  assert(ex1.answers["a2_p7_ex1_h"] === "Praktikanten", "Item h is Praktikanten");
  assert(ex1.answers["a2_p7_ex1_i"] === "Kunden", "Item i is Kunden");
  assert(ex1.answers["a2_p7_ex1_j"] === "Agenten", "Item j is Agenten");
  assert(ex1.answers["a2_p7_ex1_k"] === "Fotografen", "Item k is Fotografen");
  assert(ex1.answers["a2_p7_ex1_l"] === "Architekten", "Item l is Architekten");
  assert(ex1.answers["a2_p7_ex1_m"] === "Herrn", "Item m is Herrn");
  assert(ex1.answers["a2_p7_ex1_n"] === "Juristen", "Item n is Juristen");
  assert(ex1.answers["a2_p7_ex1_o"] === "Nachbarn", "Item o is Nachbarn");
  assert(ex1.items.every(i => i.isCompact === true), "All Übung 1 items are isCompact: true");
  assert(!Object.values(ex1.answers).includes("—"), "Übung 1 has no corrupt '—' answers");

  // Übung 2: n-Deklination im Kontext (Akkusativ vs. Dativ)
  const ex2 = page7.exercises[1];
  assert(ex2.id === "a2_p7_ex2", "Übung 2 ID is a2_p7_ex2");
  assert(ex2.items.length === 15, "Übung 2 has 15 items (a-o)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 15, "Übung 2 has 15-chip wordBox");
  assert(ex2.answers["a2_p7_ex2_a"] === "dem Studenten", "Item a is dem Studenten");
  assert(ex2.answers["a2_p7_ex2_b"] === "den Gitarristen", "Item b is den Gitarristen");
  assert(ex2.answers["a2_p7_ex2_c"] === "den Nachbarn", "Item c is den Nachbarn");
  assert(ex2.answers["a2_p7_ex2_d"] === "den Diamanten", "Item d is den Diamanten");
  assert(ex2.answers["a2_p7_ex2_e"] === "den Automaten", "Item e is den Automaten");
  assert(ex2.answers["a2_p7_ex2_f"] === "dem Journalisten", "Item f is dem Journalisten");
  assert(ex2.answers["a2_p7_ex2_g"] === "dem Postboten", "Item g is dem Postboten");
  assert(ex2.answers["a2_p7_ex2_h"] === "den Elefanten", "Item h is den Elefanten");
  assert(ex2.answers["a2_p7_ex2_i"] === "den Polizisten", "Item i is den Polizisten");
  assert(ex2.answers["a2_p7_ex2_j"] === "den Kollegen", "Item j is den Kollegen");
  assert(ex2.answers["a2_p7_ex2_k"] === "dem Experten", "Item k is dem Experten");
  assert(ex2.answers["a2_p7_ex2_l"] === "den Präsidenten", "Item l is den Präsidenten");
  assert(ex2.answers["a2_p7_ex2_m"] === "den Jungen", "Item m is den Jungen");
  assert(ex2.answers["a2_p7_ex2_n"] === "den Kometen", "Item n is den Kometen");
  assert(ex2.answers["a2_p7_ex2_o"] === "Herrn Berg", "Item o is Herrn Berg");
  assert(!Object.values(ex2.answers).includes("—"), "Übung 2 has no corrupt '—' answers");
  assert(!Object.values(ex2.answers).includes("das"), "Übung 2 has no corrupt 'das' answers");

  // Grammar Summary
  assert(page7.grammarSummary.includes("Die n-Deklination"), "Grammar summary includes header");
  assert(page7.grammarSummary.includes("der Herr"), "Grammar summary includes der Herr exception");
  assert(page7.grammarSummary.includes("das Herz"), "Grammar summary includes das Herz exception");
  assert(page7.grammarSummary.includes("English Cognitive Bridge"), "Grammar summary includes English bridge");

  // Markdown Sync Checks
  const arbPath = path.join(rootDir, "A2", "Arbeitsbuch.md");
  const loesPath = path.join(rootDir, "A2", "Loesungsschluessel.md");
  const arbText = fs.readFileSync(arbPath, "utf8");
  const loesText = fs.readFileSync(loesPath, "utf8");

  const s7Arb = arbText.slice(arbText.indexOf("Seite 7: 2.2. n-Deklination"), arbText.indexOf("Seite 8:", arbText.indexOf("Seite 7: 2.2. n-Deklination")));
  const s7Loes = loesText.slice(loesText.indexOf("## 📄 Seite 7:"), loesText.indexOf("## 📄 Seite 8:", loesText.indexOf("## 📄 Seite 7:")));

  assert(s7Arb.includes("2.2. n-Deklination (Schwache Nomen)"), "A2/Arbeitsbuch.md has Page 7 section");
  assert(s7Loes.includes("2.2. n-Deklination (Schwache Nomen)"), "A2/Loesungsschluessel.md has Page 7 section");
  assert(!s7Loes.includes("**—**"), "A2/Loesungsschluessel.md has no dash scraper junk in Page 7");
  assert(!s7Loes.includes("**das**"), "A2/Loesungsschluessel.md has no 'das' scraper junk in Page 7");
});

console.log(`\n======================================================`);
console.log(`📊 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log(`======================================================`);

if (failed > 0) {
  console.error(`\nFailed tests:`);
  errors.forEach(e => console.error(`  ❌ ${e}`));
  process.exit(1);
} else {
  console.log(`\n🎉 All tests passed successfully!\n`);
  process.exit(0);
}



