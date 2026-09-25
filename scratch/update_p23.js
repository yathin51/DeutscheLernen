const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'workbooks_keys.js');
let content = fs.readFileSync(filePath, 'utf8');

const a2Index = content.indexOf('"A2": {');
if (a2Index === -1) {
  console.error('Could not find "A2": { in workbooks_keys.js');
  process.exit(1);
}

const p23Start = content.indexOf('"23": {', a2Index);
const p24Start = content.indexOf('"24": {', a2Index);

if (p23Start === -1 || p24Start === -1) {
  console.error('Could not find Page 23/24 markers in A2 block of workbooks_keys.js');
  process.exit(1);
}

const p23Object = {
  lessonTitle: "Lektion 6: 6.1. Präteritum (Imperfekt) — Regelmäßige & trennbare Verben (Seite 23)",
  exercises: [
    {
      id: "a2_p23_ex1",
      title: "Übung 1: Regelmäßige Verben im Präteritum (Fragen beantworten)",
      instruction: "Beantworten Sie die Fragen im Präteritum mit „gestern“ und dem passenden Personalpronomen.",
      wordBox: [
        "antworteten",
        "besichtigten",
        "besuchte",
        "buchten",
        "entschuldigte",
        "fragte",
        "gratulierte",
        "holte",
        "informierten",
        "kündigte",
        "lernten",
        "lieferte",
        "mietete",
        "putzte",
        "reparierte",
        "reservierte",
        "wechselte",
        "änderte"
      ],
      answers: {
        a2_p23_ex1_a: "fragte",
        a2_p23_ex1_b: "holte",
        a2_p23_ex1_c: "kündigte",
        a2_p23_ex1_d: "reparierte",
        a2_p23_ex1_e: "lieferte",
        a2_p23_ex1_f: "putzte",
        a2_p23_ex1_g: "änderte",
        a2_p23_ex1_h: "reservierte",
        a2_p23_ex1_i: "lernten",
        a2_p23_ex1_j: "besuchte",
        a2_p23_ex1_k: "buchten",
        a2_p23_ex1_l: "wechselte",
        a2_p23_ex1_m: "besichtigten",
        a2_p23_ex1_n: "mietete",
        a2_p23_ex1_o: "gratulierte",
        a2_p23_ex1_p: "antworteten",
        a2_p23_ex1_q: "entschuldigte",
        a2_p23_ex1_r: "informierten"
      },
      explanations: {
        a2_p23_ex1_a: "Theo (er) ➔ fragte sie gestern",
        a2_p23_ex1_b: "du ➔ ich holte sie gestern",
        a2_p23_ex1_c: "Yasmin (sie) ➔ kündigte ihn gestern",
        a2_p23_ex1_d: "Murat (er) ➔ reparierte es gestern (-ieren ➔ -ierte)",
        a2_p23_ex1_e: "man ➔ lieferte sie gestern",
        a2_p23_ex1_f: "du ➔ ich putzte sie gestern",
        a2_p23_ex1_g: "Julia (sie) ➔ änderte ihn gestern (-ern ➔ -erte)",
        a2_p23_ex1_h: "du ➔ ich reservierte ihn gestern (-ieren ➔ -ierte)",
        a2_p23_ex1_i: "ihr ➔ wir lernten sie gestern",
        a2_p23_ex1_j: "du ➔ ich besuchte ihn gestern",
        a2_p23_ex1_k: "ihr ➔ wir buchten sie gestern",
        a2_p23_ex1_l: "Lena (sie) ➔ wechselte es gestern (-eln ➔ -elte)",
        a2_p23_ex1_m: "ihr ➔ wir besichtigten sie gestern (-igen ➔ -igten)",
        a2_p23_ex1_n: "du ➔ ich mietete es gestern (Stamm auf -t ➔ -ete)",
        a2_p23_ex1_o: "du ➔ ich gratulierte ihm gestern (-ieren ➔ -ierte)",
        a2_p23_ex1_p: "ihr ➔ wir antworteten ihr gestern (Stamm auf -t ➔ -eten)",
        a2_p23_ex1_q: "du ➔ ich entschuldigte mich gestern (reflexiv)",
        a2_p23_ex1_r: "ihr ➔ wir informierten uns gestern (reflexiv)"
      },
      items: [
        {
          id: "a2_p23_ex1_a",
          label: "a)",
          prompt: "Wann fragt Theo die Lehrerin?",
          lead: "Wann fragt Theo die Lehrerin? — Er ",
          tail: " sie gestern.",
          answer: "fragte",
          explanation: "Theo (er) ➔ fragte sie gestern",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_b",
          label: "b)",
          prompt: "Wann holst du die Tickets?",
          lead: "Wann holst du die Tickets? — Ich ",
          tail: " sie gestern.",
          answer: "holte",
          explanation: "du ➔ ich holte sie gestern",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_c",
          label: "c)",
          prompt: "Wann kündigt Yasmin den Vertrag?",
          lead: "Wann kündigt Yasmin den Vertrag? — Sie ",
          tail: " ihn gestern.",
          answer: "kündigte",
          explanation: "Yasmin (sie) ➔ kündigte ihn gestern",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_d",
          label: "d)",
          prompt: "Wann repariert Murat das Fahrrad?",
          lead: "Wann repariert Murat das Fahrrad? — Er ",
          tail: " es gestern.",
          answer: "reparierte",
          explanation: "Murat (er) ➔ reparierte es gestern (-ieren ➔ -ierte)",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_e",
          label: "e)",
          prompt: "Wann liefert man die Maschinen?",
          lead: "Wann liefert man die Maschinen? — Man ",
          tail: " sie gestern.",
          answer: "lieferte",
          explanation: "man ➔ lieferte sie gestern",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_f",
          label: "f)",
          prompt: "Wann putzt du die Fenster?",
          lead: "Wann putzt du die Fenster? — Ich ",
          tail: " sie gestern.",
          answer: "putzte",
          explanation: "du ➔ ich putzte sie gestern",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_g",
          label: "g)",
          prompt: "Wann ändert Julia den PIN-Code?",
          lead: "Wann ändert Julia den PIN-Code? — Sie ",
          tail: " ihn gestern.",
          answer: "änderte",
          explanation: "Julia (sie) ➔ änderte ihn gestern (-ern ➔ -erte)",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_h",
          label: "h)",
          prompt: "Wann reservierst du den Tisch?",
          lead: "Wann reservierst du den Tisch? — Ich ",
          tail: " ihn gestern.",
          answer: "reservierte",
          explanation: "du ➔ ich reservierte ihn gestern (-ieren ➔ -ierte)",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_i",
          label: "i)",
          prompt: "Wann lernt ihr die starken Verben?",
          lead: "Wann lernt ihr die starken Verben? — Wir ",
          tail: " sie gestern.",
          answer: "lernten",
          explanation: "ihr ➔ wir lernten sie gestern",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_j",
          label: "j)",
          prompt: "Wann besuchst du Paul?",
          lead: "Wann besuchst du Paul? — Ich ",
          tail: " ihn gestern.",
          answer: "besuchte",
          explanation: "du ➔ ich besuchte ihn gestern",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_k",
          label: "k)",
          prompt: "Wann bucht ihr die Reise?",
          lead: "Wann bucht ihr die Reise? — Wir ",
          tail: " sie gestern.",
          answer: "buchten",
          explanation: "ihr ➔ wir buchten sie gestern",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_l",
          label: "l)",
          prompt: "Wann wechselt Lena das Geld?",
          lead: "Wann wechselt Lena das Geld? — Sie ",
          tail: " es gestern.",
          answer: "wechselte",
          explanation: "Lena (sie) ➔ wechselte es gestern (-eln ➔ -elte)",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_m",
          label: "m)",
          prompt: "Wann besichtigt ihr die Burg?",
          lead: "Wann besichtigt ihr die Burg? — Wir ",
          tail: " sie gestern.",
          answer: "besichtigten",
          explanation: "ihr ➔ wir besichtigten sie gestern (-igen ➔ -igten)",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_n",
          label: "n)",
          prompt: "Wann mietest du das Auto?",
          lead: "Wann mietest du das Auto? — Ich ",
          tail: " es gestern.",
          answer: "mietete",
          explanation: "du ➔ ich mietete es gestern (Stamm auf -t ➔ -ete)",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_o",
          label: "o)",
          prompt: "Wann gratulierst du deinem Großvater?",
          lead: "Wann gratulierst du deinem Großvater? — Ich ",
          tail: " ihm gestern.",
          answer: "gratulierte",
          explanation: "du ➔ ich gratulierte ihm gestern (-ieren ➔ -ierte)",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_p",
          label: "p)",
          prompt: "Wann antwortet ihr der Kollegin?",
          lead: "Wann antwortet ihr der Kollegin? — Wir ",
          tail: " ihr gestern.",
          answer: "antworteten",
          explanation: "ihr ➔ wir antworteten ihr gestern (Stamm auf -t ➔ -eten)",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_q",
          label: "q)",
          prompt: "Wann entschuldigst du dich?",
          lead: "Wann entschuldigst du dich? — Ich ",
          tail: " mich gestern.",
          answer: "entschuldigte",
          explanation: "du ➔ ich entschuldigte mich gestern (reflexiv)",
          isCompact: true
        },
        {
          id: "a2_p23_ex1_r",
          label: "r)",
          prompt: "Wann informiert ihr euch?",
          lead: "Wann informiert ihr euch? — Wir ",
          tail: " uns gestern.",
          answer: "informierten",
          explanation: "ihr ➔ wir informierten uns gestern (reflexiv)",
          isCompact: true
        }
      ]
    },
    {
      id: "a2_p23_ex2",
      title: "Übung 2: Trennbare Verben im Präteritum (Satzklammer)",
      instruction: "Setzen Sie die trennbaren Verben ins Präteritum. Achten Sie auf die richtige Verbendung.",
      wordBox: [
        "füllten",
        "holte",
        "kreuzte",
        "lehntest",
        "machte",
        "machten",
        "packte",
        "räumtest",
        "sagte",
        "schaltetet",
        "zahltet",
        "zündetest"
      ],
      answers: {
        a2_p23_ex2_a: "räumtest",
        a2_p23_ex2_b: "holte",
        a2_p23_ex2_c: "machte",
        a2_p23_ex2_d: "lehntest",
        a2_p23_ex2_e: "zahltet",
        a2_p23_ex2_f: "füllten",
        a2_p23_ex2_g: "schaltetet",
        a2_p23_ex2_h: "machten",
        a2_p23_ex2_i: "kreuzte",
        a2_p23_ex2_j: "packte",
        a2_p23_ex2_k: "zündetest",
        a2_p23_ex2_l: "sagte"
      },
      explanations: {
        a2_p23_ex2_a: "du ➔ räumtest den Keller auf",
        a2_p23_ex2_b: "ich ➔ holte die Pakete ab",
        a2_p23_ex2_c: "Max (er) ➔ machte die Tür zu",
        a2_p23_ex2_d: "du ➔ lehntest das Angebot ab",
        a2_p23_ex2_e: "ihr ➔ zahltet den Kredit zurück",
        a2_p23_ex2_f: "wir ➔ füllten das Formular aus",
        a2_p23_ex2_g: "ihr ➔ schaltetet das Gerät aus (Stamm auf -t ➔ -etet)",
        a2_p23_ex2_h: "wir ➔ machten alle Fenster zu",
        a2_p23_ex2_i: "ich ➔ kreuzte die richtige Antwort an",
        a2_p23_ex2_j: "Jana (sie) ➔ packte den Koffer aus",
        a2_p23_ex2_k: "du ➔ zündetest eine Kerze an (Stamm auf -d ➔ -etest)",
        a2_p23_ex2_l: "Paul (er) ➔ sagte den Termin ab"
      },
      items: [
        {
          id: "a2_p23_ex2_a",
          label: "a)",
          prompt: "du — den Keller — aufräumen",
          lead: "Du ",
          tail: " den Keller auf.",
          answer: "räumtest",
          explanation: "du ➔ räumtest den Keller auf",
          isCompact: true
        },
        {
          id: "a2_p23_ex2_b",
          label: "b)",
          prompt: "ich — die Pakete — abholen",
          lead: "Ich ",
          tail: " die Pakete ab.",
          answer: "holte",
          explanation: "ich ➔ holte die Pakete ab",
          isCompact: true
        },
        {
          id: "a2_p23_ex2_c",
          label: "c)",
          prompt: "Max — die Tür — zumachen",
          lead: "Max ",
          tail: " die Tür zu.",
          answer: "machte",
          explanation: "Max (er) ➔ machte die Tür zu",
          isCompact: true
        },
        {
          id: "a2_p23_ex2_d",
          label: "d)",
          prompt: "du — das Angebot — ablehnen",
          lead: "Du ",
          tail: " das Angebot ab.",
          answer: "lehntest",
          explanation: "du ➔ lehntest das Angebot ab",
          isCompact: true
        },
        {
          id: "a2_p23_ex2_e",
          label: "e)",
          prompt: "ihr — den Kredit — zurückzahlen",
          lead: "Ihr ",
          tail: " den Kredit zurück.",
          answer: "zahltet",
          explanation: "ihr ➔ zahltet den Kredit zurück",
          isCompact: true
        },
        {
          id: "a2_p23_ex2_f",
          label: "f)",
          prompt: "wir — das Formular — ausfüllen",
          lead: "Wir ",
          tail: " das Formular aus.",
          answer: "füllten",
          explanation: "wir ➔ füllten das Formular aus",
          isCompact: true
        },
        {
          id: "a2_p23_ex2_g",
          label: "g)",
          prompt: "ihr — das Gerät — ausschalten",
          lead: "Ihr ",
          tail: " das Gerät aus.",
          answer: "schaltetet",
          explanation: "ihr ➔ schaltetet das Gerät aus (Stamm auf -t ➔ -etet)",
          isCompact: true
        },
        {
          id: "a2_p23_ex2_h",
          label: "h)",
          prompt: "wir — alle Fenster — zumachen",
          lead: "Wir ",
          tail: " alle Fenster zu.",
          answer: "machten",
          explanation: "wir ➔ machten alle Fenster zu",
          isCompact: true
        },
        {
          id: "a2_p23_ex2_i",
          label: "i)",
          prompt: "ich — die richtige Antwort — ankreuzen",
          lead: "Ich ",
          tail: " die richtige Antwort an.",
          answer: "kreuzte",
          explanation: "ich ➔ kreuzte die richtige Antwort an",
          isCompact: true
        },
        {
          id: "a2_p23_ex2_j",
          label: "j)",
          prompt: "Jana — den Koffer — auspacken",
          lead: "Jana ",
          tail: " den Koffer aus.",
          answer: "packte",
          explanation: "Jana (sie) ➔ packte den Koffer aus",
          isCompact: true
        },
        {
          id: "a2_p23_ex2_k",
          label: "k)",
          prompt: "du — eine Kerze — anzünden",
          lead: "Du ",
          tail: " eine Kerze an.",
          answer: "zündetest",
          explanation: "du ➔ zündetest eine Kerze an (Stamm auf -d ➔ -etest)",
          isCompact: true
        },
        {
          id: "a2_p23_ex2_l",
          label: "l)",
          prompt: "Paul — den Termin — absagen",
          lead: "Paul ",
          tail: " den Termin ab.",
          answer: "sagte",
          explanation: "Paul (er) ➔ sagte den Termin ab",
          isCompact: true
        }
      ]
    }
  ],
  grammarSummary: "### 📌 Grammatik-Fokus: 6.1. Präteritum (Imperfekt) — Regelmäßige & trennbare Verben\n\n#### 1. Verwendung des Präteritums\nDas Präteritum (auch Imperfekt) wird vor allem in der **Schriftsprache** verwendet (Zeitungsartikel, Berichte, Romane, Erzählungen). In der gesprochenen Sprache verwendet man meist das Perfekt — außer bei Hilfsverben (*sein*, *haben*) und Modalverben (*können*, *müssen* etc.).\n\n---\n\n#### 2. Konjugation der regelmäßigen (schwachen) Verben\nRegelmäßige Verben bilden das Präteritum mit dem Stamm + **-t-** + Personalendung:\n\n| Person | Endung | kaufen (*kauf-*) | lernen (*lern-*) | arbeiten (*arbeit-*) [Stamm auf -t/-d] |\n| :--- | :---: | :--- | :--- | :--- |\n| **ich** | **-te** | ich kauf**te** | ich lern**te** | ich arbeit**ete** |\n| **du** | **-test** | du kauf**test** | du lern**test** | du arbeit**etest** |\n| **er / sie / es** | **-te** | er kauf**te** | sie lern**te** | es arbeit**ete** |\n| **wir** | **-ten** | wir kauf**ten** | wir lern**ten** | wir arbeit**eten** |\n| **ihr** | **-tet** | ihr kauf**tet** | ihr lern**tet** | ihr arbeit**etet** |\n| **sie / Sie** | **-ten** | sie kauf**ten** | Sie lern**ten** | sie arbeit**eten** |\n\n> ⚠️ **Wichtig:** Die 1. Person (*ich*) und die 3. Person (*er/sie/es*) sind im Präteritum immer **identisch** (*ich kaufte = er kaufte*)!\n\n---\n\n#### 3. Lautliche Besonderheiten & Verbgruppen\n1. **Stamm auf -t, -d, -chn, -ffn, -gn:**  \n   Zur besseren Aussprache wird ein **-e-** vor das *-t-* geschoben (*-ete, -etest, -ete, -eten, -etet, -eten*):  \n   - *antworten ➔ ich antwortete, ihr antwortetet*  \n   - *mieten ➔ ich mietete*  \n   - *anzünden ➔ du zündetest an*  \n   - *schalten ➔ ihr schaltetet*  \n2. **Verben auf -eln, -ern, -igen, -ieren (immer schwach!):**  \n   - *ändern ➔ sie änderte*  \n   - *besichtigen ➔ wir besichtigten*  \n   - *reservieren ➔ ich reservierte*  \n   - *reparieren ➔ er reparierte*\n\n---\n\n#### 4. Trennbare Verben im Präteritum\nBei trennbaren Verben wird das Präfix abgetrennt und steht am **Satzende (Satzklammer)**:\n- *aufräumen ➔ Du **räumtest** gestern den Keller **auf**.*\n- *einkaufen ➔ Ich **kaufte** im Supermarkt **ein**.*\n- *ausfüllen ➔ Wir **füllten** das Formular **aus**.*\n\n---\n\n#### 5. 🇬🇧 English Cognitive Bridge\n> In English, the simple past of regular verbs is formed with **-ed** (*learn ➔ learned, ask ➔ asked*).  \n> In German, the regular past uses **-te** (*lernte, fragte*).  \n> Notice the close phonetic correspondence between English *-ed* and German *-te*!  \n> For verbs ending in dental consonants (*-t*, *-d*), English adds an extra syllable (*waited, rented*), exactly like German adds **-e-** (*wartete, mietete*)."
};

const jsonSnippet = '"23": ' + JSON.stringify(p23Object, null, 2).replace(/\n/g, '\n    ') + ',\n    ';

content = content.substring(0, p23Start) + jsonSnippet + content.substring(p24Start);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated Page 23 in js/workbooks_keys.js!');
