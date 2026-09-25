const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'workbooks_keys.js');
let content = fs.readFileSync(filePath, 'utf8');

const a2Index = content.indexOf('"A2": {');
const p23Index = content.indexOf('"23":', a2Index);

if (a2Index === -1 || p23Index === -1) {
  console.error('Could not find markers in workbooks_keys.js');
  process.exit(1);
}

const page22Object = {
  lessonTitle: "Lektion 5: 5.3. Ähnliche Verben / Positions- & Richtungsverben (Seite 22)",
  exercises: [
    {
      id: "a2_p22_ex1",
      title: "Übung 1: stellen vs. stehen (Wohin? + Akk. vs. Wo? + Dat.)",
      instruction: "Ergänzen Sie die passende Form von „stellen“ (Aktion ➔ Wohin? + Akk.) oder „stehen“ (Position ➔ Wo? + Dat.).",
      wordBox: [
        "stehe",
        "stehen",
        "steht",
        "stelle",
        "stellen",
        "stellst",
        "stellt"
      ],
      answers: {
        a2_p22_ex1_a: "stelle",
        a2_p22_ex1_b: "steht",
        a2_p22_ex1_c: "stellst",
        a2_p22_ex1_d: "steht",
        a2_p22_ex1_e: "stehen",
        a2_p22_ex1_f: "stellt",
        a2_p22_ex1_g: "stehen",
        a2_p22_ex1_h: "steht"
      },
      explanations: {
        a2_p22_ex1_a: "Aktion (Wohin? + Akk.) ➔ ich stelle das Glas auf den Tisch",
        a2_p22_ex1_b: "Position (Wo? + Dat.) ➔ das Glas steht neben der Flasche",
        a2_p22_ex1_c: "Aktion (Wohin? + Akk.) ➔ du stellst das Auto vor die Garage",
        a2_p22_ex1_d: "Position (Wo? + Dat.) ➔ Paul steht vor der Tür",
        a2_p22_ex1_e: "Position (Wo? + Dat., Plural) ➔ viele Leute stehen an der Kinokasse",
        a2_p22_ex1_f: "Aktion (Wohin? + Akk.) ➔ Maria stellt den Roller vor das Haus",
        a2_p22_ex1_g: "Position (Wo? + Dat., 1. Plural) ➔ wir stehen an der Bushaltestelle",
        a2_p22_ex1_h: "Position (Wo? + Dat.) ➔ er steht zwischen seinen Eltern"
      },
      items: [
        {
          id: "a2_p22_ex1_a",
          label: "a)",
          prompt: "Ich — Glas — auf — Tisch",
          lead: "Ich ",
          tail: " das Glas auf den Tisch.",
          answer: "stelle",
          explanation: "Aktion (Wohin? + Akk.) ➔ ich stelle das Glas auf den Tisch",
          isCompact: true
        },
        {
          id: "a2_p22_ex1_b",
          label: "b)",
          prompt: "Glas — neben — Flasche",
          lead: "Das Glas ",
          tail: " neben der Flasche.",
          answer: "steht",
          explanation: "Position (Wo? + Dat.) ➔ das Glas steht neben der Flasche",
          isCompact: true
        },
        {
          id: "a2_p22_ex1_c",
          label: "c)",
          prompt: "Du — Auto — vor — Garage",
          lead: "Du ",
          tail: " das Auto vor die Garage.",
          answer: "stellst",
          explanation: "Aktion (Wohin? + Akk.) ➔ du stellst das Auto vor die Garage",
          isCompact: true
        },
        {
          id: "a2_p22_ex1_d",
          label: "d)",
          prompt: "Paul — vor — Tür",
          lead: "Paul ",
          tail: " vor der Tür.",
          answer: "steht",
          explanation: "Position (Wo? + Dat.) ➔ Paul steht vor der Tür",
          isCompact: true
        },
        {
          id: "a2_p22_ex1_e",
          label: "e)",
          prompt: "Viele Leute — an — Kinokasse",
          lead: "Viele Leute ",
          tail: " an der Kinokasse.",
          answer: "stehen",
          explanation: "Position (Wo? + Dat., Plural) ➔ viele Leute stehen an der Kinokasse",
          isCompact: true
        },
        {
          id: "a2_p22_ex1_f",
          label: "f)",
          prompt: "Maria — Roller — vor — Haus",
          lead: "Maria ",
          tail: " den Roller vor das Haus.",
          answer: "stellt",
          explanation: "Aktion (Wohin? + Akk.) ➔ Maria stellt den Roller vor das Haus",
          isCompact: true
        },
        {
          id: "a2_p22_ex1_g",
          label: "g)",
          prompt: "Wir — an — Bushaltestelle",
          lead: "Wir ",
          tail: " an der Bushaltestelle.",
          answer: "stehen",
          explanation: "Position (Wo? + Dat., 1. Plural) ➔ wir stehen an der Bushaltestelle",
          isCompact: true
        },
        {
          id: "a2_p22_ex1_h",
          label: "h)",
          prompt: "Er — zwischen — seine Eltern",
          lead: "Er ",
          tail: " zwischen seinen Eltern.",
          answer: "steht",
          explanation: "Position (Wo? + Dat.) ➔ er steht zwischen seinen Eltern",
          isCompact: true
        }
      ]
    },
    {
      id: "a2_p22_ex2",
      title: "Übung 2: legen vs. liegen (Wohin? + Akk. vs. Wo? + Dat.)",
      instruction: "Ergänzen Sie die passende Form von „legen“ (Aktion ➔ Wohin? + Akk.) oder „liegen“ (Position ➔ Wo? + Dat.).",
      wordBox: [
        "lege",
        "legen",
        "legst",
        "legt",
        "liege",
        "liegen",
        "liegt"
      ],
      answers: {
        a2_p22_ex2_a: "liegt",
        a2_p22_ex2_b: "liegt",
        a2_p22_ex2_c: "legt",
        a2_p22_ex2_d: "legt",
        a2_p22_ex2_e: "legt",
        a2_p22_ex2_f: "liege",
        a2_p22_ex2_g: "legst",
        a2_p22_ex2_h: "liegen"
      },
      explanations: {
        a2_p22_ex2_a: "Position (Wo? + Dat.) ➔ der Brief liegt auf dem Schreibtisch",
        a2_p22_ex2_b: "Position (Wo? + Dat.) ➔ Julia liegt auf dem Sofa",
        a2_p22_ex2_c: "Aktion (Wohin? + Akk.) ➔ Maria legt das Buch ins Regal",
        a2_p22_ex2_d: "Aktion (Wohin? + Akk.) ➔ er legt den Pass neben das Ticket",
        a2_p22_ex2_e: "Aktion (Wohin? + Akk.) ➔ sie legt den Hut in den Schrank",
        a2_p22_ex2_f: "Position (Wo? + Dat.) ➔ ich liege im Bett",
        a2_p22_ex2_g: "Aktion (Wohin? + Akk.) ➔ du legst die Mappe auf den Tisch",
        a2_p22_ex2_h: "Position (Wo? + Dat., Plural) ➔ die Zeitungen liegen auf dem Boden"
      },
      items: [
        {
          id: "a2_p22_ex2_a",
          label: "a)",
          prompt: "Brief — auf — Schreibtisch",
          lead: "Der Brief ",
          tail: " auf dem Schreibtisch.",
          answer: "liegt",
          explanation: "Position (Wo? + Dat.) ➔ der Brief liegt auf dem Schreibtisch",
          isCompact: true
        },
        {
          id: "a2_p22_ex2_b",
          label: "b)",
          prompt: "Julia — auf — Sofa",
          lead: "Julia ",
          tail: " auf dem Sofa.",
          answer: "liegt",
          explanation: "Position (Wo? + Dat.) ➔ Julia liegt auf dem Sofa",
          isCompact: true
        },
        {
          id: "a2_p22_ex2_c",
          label: "c)",
          prompt: "Maria — Buch — in — Regal",
          lead: "Maria ",
          tail: " das Buch ins Regal.",
          answer: "legt",
          explanation: "Aktion (Wohin? + Akk.) ➔ Maria legt das Buch ins Regal",
          isCompact: true
        },
        {
          id: "a2_p22_ex2_d",
          label: "d)",
          prompt: "Er — Pass — neben — Ticket",
          lead: "Er ",
          tail: " den Pass neben das Ticket.",
          answer: "legt",
          explanation: "Aktion (Wohin? + Akk.) ➔ er legt den Pass neben das Ticket",
          isCompact: true
        },
        {
          id: "a2_p22_ex2_e",
          label: "e)",
          prompt: "Sie — Hut — in — Schrank",
          lead: "Sie ",
          tail: " den Hut in den Schrank.",
          answer: "legt",
          explanation: "Aktion (Wohin? + Akk.) ➔ sie legt den Hut in den Schrank",
          isCompact: true
        },
        {
          id: "a2_p22_ex2_f",
          label: "f)",
          prompt: "Ich — in — Bett",
          lead: "Ich ",
          tail: " noch im Bett.",
          answer: "liege",
          explanation: "Position (Wo? + Dat.) ➔ ich liege im Bett",
          isCompact: true
        },
        {
          id: "a2_p22_ex2_g",
          label: "g)",
          prompt: "Du — Mappe — auf — Tisch",
          lead: "Du ",
          tail: " die Mappe auf den Tisch.",
          answer: "legst",
          explanation: "Aktion (Wohin? + Akk.) ➔ du legst die Mappe auf den Tisch",
          isCompact: true
        },
        {
          id: "a2_p22_ex2_h",
          label: "h)",
          prompt: "Zeitungen — auf — Boden",
          lead: "Die Zeitungen ",
          tail: " auf dem Boden.",
          answer: "liegen",
          explanation: "Position (Wo? + Dat., Plural) ➔ die Zeitungen liegen auf dem Boden",
          isCompact: true
        }
      ]
    },
    {
      id: "a2_p22_ex3",
      title: "Übung 3: setzen (sich) vs. sitzen (Wohin? + Akk. vs. Wo? + Dat.)",
      instruction: "Ergänzen Sie die passende Form von „setzen“ (Aktion ➔ Wohin? + Akk.) oder „sitzen“ (Position ➔ Wo? + Dat.).",
      wordBox: [
        "setze",
        "setzen",
        "setzt",
        "sitze",
        "sitzen",
        "sitzt"
      ],
      answers: {
        a2_p22_ex3_a: "sitze",
        a2_p22_ex3_b: "setzt",
        a2_p22_ex3_c: "setzt",
        a2_p22_ex3_d: "sitzen",
        a2_p22_ex3_e: "setzt",
        a2_p22_ex3_f: "sitze",
        a2_p22_ex3_g: "setzt",
        a2_p22_ex3_h: "sitzt"
      },
      explanations: {
        a2_p22_ex3_a: "Position (Wo? + Dat.) ➔ ich sitze am Fenster",
        a2_p22_ex3_b: "Aktion (Wohin? + Akk.) ➔ Julia setzt das Kind auf das Bett",
        a2_p22_ex3_c: "Aktion (Wohin? + Akk.) ➔ du setzt die Katze auf das Sofa",
        a2_p22_ex3_d: "Position (Wo? + Dat., Plural) ➔ wir sitzen im Bus",
        a2_p22_ex3_e: "Aktion (Wohin? + Akk.) ➔ Paul setzt seinen Sohn ins Auto",
        a2_p22_ex3_f: "Position (Wo? + Dat.) ➔ ich sitze zwischen Onkel und Tante",
        a2_p22_ex3_g: "Aktion (Wohin? + Akk.) ➔ Eva setzt die Brille auf die Nase",
        a2_p22_ex3_h: "Position (Wo? + Dat.) ➔ du sitzt vor dem Fernseher"
      },
      items: [
        {
          id: "a2_p22_ex3_a",
          label: "a)",
          prompt: "Ich — an — Fenster",
          lead: "Ich ",
          tail: " gern am Fenster.",
          answer: "sitze",
          explanation: "Position (Wo? + Dat.) ➔ ich sitze am Fenster",
          isCompact: true
        },
        {
          id: "a2_p22_ex3_b",
          label: "b)",
          prompt: "Julia — Kind — auf — Bett",
          lead: "Julia ",
          tail: " das Kind auf das Bett.",
          answer: "setzt",
          explanation: "Aktion (Wohin? + Akk.) ➔ Julia setzt das Kind auf das Bett",
          isCompact: true
        },
        {
          id: "a2_p22_ex3_c",
          label: "c)",
          prompt: "Du — Katze — auf — Sofa",
          lead: "Du ",
          tail: " die Katze auf das Sofa.",
          answer: "setzt",
          explanation: "Aktion (Wohin? + Akk.) ➔ du setzt die Katze auf das Sofa",
          isCompact: true
        },
        {
          id: "a2_p22_ex3_d",
          label: "d)",
          prompt: "Wir — in — Bus",
          lead: "Wir ",
          tail: " zusammen im Bus.",
          answer: "sitzen",
          explanation: "Position (Wo? + Dat., Plural) ➔ wir sitzen im Bus",
          isCompact: true
        },
        {
          id: "a2_p22_ex3_e",
          label: "e)",
          prompt: "Paul — sein Sohn — in — Auto",
          lead: "Paul ",
          tail: " seinen Sohn ins Auto.",
          answer: "setzt",
          explanation: "Aktion (Wohin? + Akk.) ➔ Paul setzt seinen Sohn ins Auto",
          isCompact: true
        },
        {
          id: "a2_p22_ex3_f",
          label: "f)",
          prompt: "Ich — zwischen — Onkel — Tante",
          lead: "Ich ",
          tail: " zwischen Onkel und Tante.",
          answer: "sitze",
          explanation: "Position (Wo? + Dat.) ➔ ich sitze zwischen Onkel und Tante",
          isCompact: true
        },
        {
          id: "a2_p22_ex3_g",
          label: "g)",
          prompt: "Eva — Brille — auf — Nase",
          lead: "Eva ",
          tail: " die Brille auf die Nase.",
          answer: "setzt",
          explanation: "Aktion (Wohin? + Akk.) ➔ Eva setzt die Brille auf die Nase",
          isCompact: true
        },
        {
          id: "a2_p22_ex3_h",
          label: "h)",
          prompt: "Du — vor — Fernseher",
          lead: "Du ",
          tail: " den ganzen Tag vor dem Fernseher.",
          answer: "sitzt",
          explanation: "Position (Wo? + Dat.) ➔ du sitzt vor dem Fernseher",
          isCompact: true
        }
      ]
    },
    {
      id: "a2_p22_ex4",
      title: "Übung 4: hängen & stecken (Aktionsverb vs. Positionsverb)",
      instruction: "Ergänzen Sie die passende Form von „hängen“ oder „stecken“ im Präsens.",
      wordBox: [
        "hänge",
        "hängen",
        "hängt",
        "stecke",
        "stecken",
        "steckt"
      ],
      answers: {
        a2_p22_ex4_a: "hängt",
        a2_p22_ex4_b: "hänge",
        a2_p22_ex4_c: "hängt",
        a2_p22_ex4_d: "hängt",
        a2_p22_ex4_e: "hängt",
        a2_p22_ex4_f: "steckt",
        a2_p22_ex4_g: "steckt",
        a2_p22_ex4_h: "stecken",
        a2_p22_ex4_i: "stecke",
        a2_p22_ex4_j: "steckt"
      },
      explanations: {
        a2_p22_ex4_a: "Position (Wo? + Dat.) ➔ der Apfel hängt am Baum",
        a2_p22_ex4_b: "Aktion (Wohin? + Akk.) ➔ ich hänge die Uhr an die Wand",
        a2_p22_ex4_c: "Aktion (Wohin? + Akk.) ➔ Maria hängt das Poster an die Tür",
        a2_p22_ex4_d: "Position (Wo? + Dat.) ➔ das Handtuch hängt neben der Badewanne",
        a2_p22_ex4_e: "Aktion (Wohin? + Akk.) ➔ Paul hängt die Hose in den Schrank",
        a2_p22_ex4_f: "Position (Wo? + Dat.) ➔ der Schlüssel steckt im Schloss",
        a2_p22_ex4_g: "Aktion (Wohin? + Akk.) ➔ er steckt das Geld in die Tasche",
        a2_p22_ex4_h: "Position (Wo? + Dat., Plural) ➔ die Füße stecken in warmen Schuhen",
        a2_p22_ex4_i: "Aktion (Wohin? + Akk.) ➔ ich stecke das Foto zwischen die Briefe",
        a2_p22_ex4_j: "Position (Wo? + Dat.) ➔ der Zettel steckt hinter dem Spiegel"
      },
      items: [
        {
          id: "a2_p22_ex4_a",
          label: "a)",
          prompt: "Apfel — an — Baum (hängen)",
          lead: "Der Apfel ",
          tail: " noch am Baum.",
          answer: "hängt",
          explanation: "Position (Wo? + Dat.) ➔ der Apfel hängt am Baum",
          isCompact: true
        },
        {
          id: "a2_p22_ex4_b",
          label: "b)",
          prompt: "Ich — Uhr — an — Wand (hängen)",
          lead: "Ich ",
          tail: " die neue Uhr an die Wand.",
          answer: "hänge",
          explanation: "Aktion (Wohin? + Akk.) ➔ ich hänge die Uhr an die Wand",
          isCompact: true
        },
        {
          id: "a2_p22_ex4_c",
          label: "c)",
          prompt: "Maria — Poster — an — Tür (hängen)",
          lead: "Maria ",
          tail: " das Poster an die Tür.",
          answer: "hängt",
          explanation: "Aktion (Wohin? + Akk.) ➔ Maria hängt das Poster an die Tür",
          isCompact: true
        },
        {
          id: "a2_p22_ex4_d",
          label: "d)",
          prompt: "Handtuch — neben — Badewanne (hängen)",
          lead: "Das Handtuch ",
          tail: " neben der Badewanne.",
          answer: "hängt",
          explanation: "Position (Wo? + Dat.) ➔ das Handtuch hängt neben der Badewanne",
          isCompact: true
        },
        {
          id: "a2_p22_ex4_e",
          label: "e)",
          prompt: "Paul — Hose — in — Schrank (hängen)",
          lead: "Paul ",
          tail: " seine Hose in den Schrank.",
          answer: "hängt",
          explanation: "Aktion (Wohin? + Akk.) ➔ Paul hängt die Hose in den Schrank",
          isCompact: true
        },
        {
          id: "a2_p22_ex4_f",
          label: "f)",
          prompt: "Schlüssel — in — Schloss (stecken)",
          lead: "Der Schlüssel ",
          tail: " im Schloss.",
          answer: "steckt",
          explanation: "Position (Wo? + Dat.) ➔ der Schlüssel steckt im Schloss",
          isCompact: true
        },
        {
          id: "a2_p22_ex4_g",
          label: "g)",
          prompt: "Er — Geld — in — Tasche (stecken)",
          lead: "Er ",
          tail: " das Geld in die Tasche.",
          answer: "steckt",
          explanation: "Aktion (Wohin? + Akk.) ➔ er steckt das Geld in die Tasche",
          isCompact: true
        },
        {
          id: "a2_p22_ex4_h",
          label: "h)",
          prompt: "Füße — in — Schuhe (stecken)",
          lead: "Die Füße ",
          tail: " in warmen Schuhen.",
          answer: "stecken",
          explanation: "Position (Wo? + Dat., Plural) ➔ die Füße stecken in Schuhen",
          isCompact: true
        },
        {
          id: "a2_p22_ex4_i",
          label: "i)",
          prompt: "Ich — Foto — zwischen — Briefe (stecken)",
          lead: "Ich ",
          tail: " das Foto zwischen die Briefe.",
          answer: "stecke",
          explanation: "Aktion (Wohin? + Akk.) ➔ ich stecke das Foto zwischen die Briefe",
          isCompact: true
        },
        {
          id: "a2_p22_ex4_j",
          label: "j)",
          prompt: "Zettel — hinter — Spiegel (stecken)",
          lead: "Der Zettel ",
          tail: " hinter dem Spiegel.",
          answer: "steckt",
          explanation: "Position (Wo? + Dat.) ➔ der Zettel steckt hinter dem Spiegel",
          isCompact: true
        }
      ]
    }
  ],
  grammarSummary: "### 📌 Grammatik-Fokus: 5.3. Ähnliche Verben / Positions- & Richtungsverben\n\n#### 1. Die Verbpaare im Überblick (Aktion vs. Position)\nIm Deutschen unterscheidet man strikt zwischen der **Handlung** (jemand bewegt etwas an einen neuen Ort) und dem **Zustand** (etwas befindet sich bereits an einem Ort):\n\n| Aktionsverb (Wohin? + AKKUSATIV) | Bedeutung / Richtung | Positionsverb (Wo? + DATIV) | Bedeutung / Lage |\n| :--- | :--- | :--- | :--- |\n| **stellen** (*stellte, gestellt*) | senkrecht hinstellen | **stehen** (*stand, gestanden*) | senkrecht stehen |\n| **legen** (*legte, gelegt*) | waagerecht hinlegen | **liegen** (*lag, gelegen*) | flach ruhen/liegen |\n| **setzen (sich)** (*setzte, gesetzt*) | hinsetzen | **sitzen** (*saß, gesessen*) | sitzen |\n| **hängen** (*hängte, gehängt*) | aufhängen | **hängen** (*hing, gehangen*) | hängen (Zustand) |\n| **stecken** (*steckte, gesteckt*) | hineinstecken | **stecken** (*steckte, gesteckt*) | drinnen stecken |\n\n---\n\n#### 2. Die goldene Grammatikregel\n- **Aktionsverben sind REGELMÄSSIG (schwach) und transitiv:**  \n  Sie verlangen immer ein Akkusativobjekt (Wen/Was?) und eine Richtungsangabe (**Wohin? ➔ Akkusativ**).  \n  *„Ich **stelle** das Glas (Akk.) auf **den** Tisch (Akk.).“*  \n  *„Ich **lege** mich (Akk.) auf **das** Sofa (Akk.).“*\n- **Positionsverben sind UNREGELMÄSSIG (stark) und intransitiv:**  \n  Sie haben kein Akkusativobjekt und verlangen eine Ortsangabe (**Wo? ➔ Dativ**).  \n  *„Das Glas **steht** auf **dem** Tisch (Dat.).“*  \n  *„Ich **liege** auf **dem** Sofa (Dat.).“*\n\n---\n\n#### 3. Der Sonderfall: „hängen“ und „stecken“\n- **hängen** existiert in zwei Varianten:\n  - Als Aktion (schwach): *„Ich **hänge** das Bild an die Wand.“* (Präteritum: *hängte*)\n  - Als Position (stark): *„Das Bild **hängt** an der Wand.“* (Präteritum: *hing*)\n- **stecken** wird meist regelmäßig konjugiert:\n  - Als Aktion: *„Er **steckt** den Schlüssel ins Schloss.“*\n  - Als Position: *„Der Schlüssel **steckt** im Schloss.“*\n\n---\n\n#### 4. 🇬🇧 English Cognitive Bridge\n> English has similar verb pairs, but uses them less strictly:\n> - **lay / lie:** *to lay* (transitive / action: *I lay the book on the table*) vs. *to lie* (intransitive / state: *The book lies on the table*). In German, this distinction is mandatory for **legen / liegen**!\n> - **set / sit:** *to set* (*Ich setze das Kind ins Auto*) vs. *to sit* (*Das Kind sitzt im Auto*).\n> - **put:** English frequently uses the universal verb *\"to put\"* (*I put the glass on the table*, *I put the book on the desk*). **German NEVER allows a universal \"put\"!** You MUST decide:\n>   - Stands upright? ➔ **stellen**\n>   - Lies flat? ➔ **legen**\n>   - Placed seated? ➔ **setzen**\n>   - Placed inside a narrow space? ➔ **stecken**\n>   - Suspended from above? ➔ **hängen**"
};

const jsonSnippet = '    "22": ' + JSON.stringify(page22Object, null, 2).replace(/\n/g, '\n    ') + ',\n';

content = content.substring(0, p23Index) + jsonSnippet + content.substring(p23Index);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully inserted Page 22 into js/workbooks_keys.js!');
