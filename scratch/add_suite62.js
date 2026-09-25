const fs = require('fs');
const path = require('path');

const testPath = path.join(__dirname, '../tests/test_all.js');
let testContent = fs.readFileSync(testPath, 'utf8');

const target = 'console.log(`\\n📊 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);';
if (!testContent.includes(target)) {
  console.error('Target not found in test_all.js');
  process.exit(1);
}

const suite62Code = `// ----------------------------------------------------------------------------
// Suite 62: A2 Page 23 Refinement Integrity (6.1. Präteritum regelmäßige & trennbare Verben)
// ----------------------------------------------------------------------------
describe("A2 Page 23 Refinement Integrity (6.1. Präteritum regelmäßige & trennbare Verben)", () => {
  const rootDir = path.join(__dirname, "..");
  const keysPath = path.join(rootDir, "js", "workbooks_keys.js");
  const raw = fs.readFileSync(keysPath, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const data = JSON.parse(raw.substring(start, end));

  const page23 = data.A2 && data.A2["23"];
  assert(page23, "A2 Page 23 exists in WORKBOOK_DATA");
  assert(page23.lessonTitle.includes("6.1. Präteritum (Imperfekt) — Regelmäßige & trennbare Verben"), "Page 23 has pedagogical lessonTitle");
  assert(page23.exercises.length === 2, "Page 23 has exactly 2 exercises");

  // Übung 1: Regelmäßige Verben
  const ex1 = page23.exercises[0];
  assert(ex1.id === "a2_p23_ex1", "Übung 1 ID is a2_p23_ex1");
  assert(ex1.items.length === 18, "Übung 1 has 18 items (a-r)");
  assert(Array.isArray(ex1.wordBox) && ex1.wordBox.length === 18, "Übung 1 has 18-chip wordBox");
  assert(ex1.answers["a2_p23_ex1_a"] === "fragte", "Item a is fragte");
  assert(ex1.answers["a2_p23_ex1_b"] === "holte", "Item b is holte");
  assert(ex1.answers["a2_p23_ex1_c"] === "kündigte", "Item c is kündigte");
  assert(ex1.answers["a2_p23_ex1_d"] === "reparierte", "Item d is reparierte");
  assert(ex1.answers["a2_p23_ex1_e"] === "lieferte", "Item e is lieferte");
  assert(ex1.answers["a2_p23_ex1_f"] === "putzte", "Item f is putzte");
  assert(ex1.answers["a2_p23_ex1_g"] === "änderte", "Item g is änderte");
  assert(ex1.answers["a2_p23_ex1_h"] === "reservierte", "Item h is reservierte");
  assert(ex1.answers["a2_p23_ex1_i"] === "lernten", "Item i is lernten");
  assert(ex1.answers["a2_p23_ex1_j"] === "besuchte", "Item j is besuchte");
  assert(ex1.answers["a2_p23_ex1_k"] === "buchten", "Item k is buchten");
  assert(ex1.answers["a2_p23_ex1_l"] === "wechselte", "Item l is wechselte");
  assert(ex1.answers["a2_p23_ex1_m"] === "besichtigten", "Item m is besichtigten");
  assert(ex1.answers["a2_p23_ex1_n"] === "mietete", "Item n is mietete (Dentalstamm)");
  assert(ex1.answers["a2_p23_ex1_o"] === "gratulierte", "Item o is gratulierte");
  assert(ex1.answers["a2_p23_ex1_p"] === "antworteten", "Item p is antworteten (Dentalstamm)");
  assert(ex1.answers["a2_p23_ex1_q"] === "entschuldigte", "Item q is entschuldigte");
  assert(ex1.answers["a2_p23_ex1_r"] === "informierten", "Item r is informierten");
  assert(ex1.items.every(i => i.isCompact === true), "All Übung 1 items are isCompact: true");
  assert(!Object.values(ex1.answers).includes("—"), "Übung 1 has no corrupt '—' answers");
  assert(!Object.values(ex1.answers).includes("richtig"), "Übung 1 has no corrupt 'richtig' answers");
  assert(!Object.values(ex1.answers).includes("das"), "Übung 1 has no corrupt 'das' answers");

  // Übung 2: Trennbare Verben (Satzklammer)
  const ex2 = page23.exercises[1];
  assert(ex2.id === "a2_p23_ex2", "Übung 2 ID is a2_p23_ex2");
  assert(ex2.items.length === 12, "Übung 2 has 12 items (a-l)");
  assert(Array.isArray(ex2.wordBox) && ex2.wordBox.length === 12, "Übung 2 has 12-chip wordBox");
  assert(ex2.answers["a2_p23_ex2_a"] === "räumtest", "Item a is räumtest");
  assert(ex2.answers["a2_p23_ex2_b"] === "holte", "Item b is holte");
  assert(ex2.answers["a2_p23_ex2_c"] === "machte", "Item c is machte");
  assert(ex2.answers["a2_p23_ex2_d"] === "lehntest", "Item d is lehntest");
  assert(ex2.answers["a2_p23_ex2_e"] === "zahltet", "Item e is zahltet");
  assert(ex2.answers["a2_p23_ex2_f"] === "füllten", "Item f is füllten");
  assert(ex2.answers["a2_p23_ex2_g"] === "schaltetet", "Item g is schaltetet");
  assert(ex2.answers["a2_p23_ex2_h"] === "machten", "Item h is machten");
  assert(ex2.answers["a2_p23_ex2_i"] === "kreuzte", "Item i is kreuzte");
  assert(ex2.answers["a2_p23_ex2_j"] === "packte", "Item j is packte");
  assert(ex2.answers["a2_p23_ex2_k"] === "zündetest", "Item k is zündetest");
  assert(ex2.answers["a2_p23_ex2_l"] === "sagte", "Item l is sagte");
  assert(ex2.items.every(i => i.isCompact === true), "All Übung 2 items are isCompact: true");
  assert(!Object.values(ex2.answers).includes("—"), "Übung 2 has no corrupt '—' answers");
  assert(!Object.values(ex2.answers).includes("richtig"), "Übung 2 has no corrupt 'richtig' answers");
  assert(!Object.values(ex2.answers).includes("die"), "Übung 2 has no corrupt 'die' answers");

  // Grammar Summary Checks
  assert(page23.grammarSummary.includes("6.1. Präteritum (Imperfekt)"), "Grammar summary includes header");
  assert(page23.grammarSummary.includes("Regelmäßige Verben"), "Grammar summary includes Regelmäßige Verben");
  assert(page23.grammarSummary.includes("Trennbare Verben"), "Grammar summary includes Trennbare Verben");
  assert(page23.grammarSummary.includes("Satzklammer"), "Grammar summary includes Satzklammer");
  assert(page23.grammarSummary.includes("English Cognitive Bridge"), "Grammar summary includes English bridge");

  // Markdown Sync Checks
  const arbPath = path.join(rootDir, "A2", "Arbeitsbuch.md");
  const loesPath = path.join(rootDir, "A2", "Loesungsschluessel.md");
  const arbText = fs.readFileSync(arbPath, "utf8");
  const loesText = fs.readFileSync(loesPath, "utf8");

  const s23Arb = arbText.slice(arbText.indexOf("Seite 23: 6.1. Präteritum"), arbText.indexOf("Seite 24:", arbText.indexOf("Seite 23: 6.1. Präteritum")));
  const s23Loes = loesText.slice(loesText.indexOf("## 📄 Seite 23:"), loesText.indexOf("## 📄 Seite 24:", loesText.indexOf("## 📄 Seite 23:")));

  assert(s23Arb.includes("6.1. Präteritum (Imperfekt) — Regelmäßige & trennbare Verben"), "A2/Arbeitsbuch.md has Page 23 section");
  assert(s23Loes.includes("6.1. Präteritum (Imperfekt) — Regelmäßige & trennbare Verben"), "A2/Loesungsschluessel.md has Page 23 section");
  assert(!s23Loes.includes("**—**"), "A2/Loesungsschluessel.md has no dash scraper junk in Page 23");
  assert(!s23Loes.includes("**richtig**"), "A2/Loesungsschluessel.md has no 'richtig' scraper junk in Page 23");
  assert(!s23Loes.includes("**das**"), "A2/Loesungsschluessel.md has no 'das' scraper junk in Page 23");
  assert(!s23Loes.includes("**die**"), "A2/Loesungsschluessel.md has no 'die' scraper junk in Page 23");
});

`;

testContent = testContent.replace(target, suite62Code + target);
fs.writeFileSync(testPath, testContent, 'utf8');
console.log('Added Suite 62 to tests/test_all.js');
