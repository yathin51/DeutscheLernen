// Manifest catalog of all learning modules in DeutscheLernen
const LEARNING_MANIFEST = {
  paths: [
    {
      id: "path-a",
      name: "Pfad A: CEFR Stufen (A1 – C2)",
      tag: "Akademischer Sprachpfad",
      badge: "A1 – C2",
      color: "var(--color-primary)",
      icon: "🎓",
      description: "Systematischer Aufbau von Grammatik, thematischem Wortschatz und praktischen Arbeitsbüchern von den ersten Grundlagen bis zur muttersprachlichen Meisterschaft.",
      levels: [
        {
          id: "A1",
          name: "Stufe A1 (Anfänger / Beginner)",
          summary: "Grundlagen der deutschen Sprache: Genusregeln, Nominativ & Akkusativ, Personal- & Possessivpronomen, Präsens, Satzklammer.",
          files: [
            { title: "📖 A1 Grammatik", path: "A1/Grammatik.md", type: "grammar", icon: "📖", badge: "Grammatik" },
            { title: "🗂️ A1 Wortschatz", path: "A1/Vocabulary.md", type: "vocab", icon: "🗂️", badge: "Wortschatz" },
            { title: "📒 A1 Arbeitsbuch / Skript", path: "A1/a1_skript_gr.pdf", type: "workbook", icon: "📒", badge: "Werkbuch" },
            { title: "✍️ A1 Praktisches WerkBuch", path: "A1/Practisches_WerkBuch/EinfachDeutsch_examples.txt", type: "workbook", icon: "✍️", badge: "Praxis" },
            { title: "📌 A1 Leitfaden & Struktur", path: "A1/README.md", type: "guide", icon: "📌", badge: "Leitfaden" }
          ]
        },
        {
          id: "A2",
          name: "Stufe A2 (Grundstufe / Elementary)",
          summary: "Der Dativ (Wem-Fall), Reflexivpronomen, 9 Wechselpräpositionen (Wo vs. Wohin), Perfekt & Präteritum, Nebensätze.",
          files: [
            { title: "📖 A2 Grammatik", path: "A2/Grammatik.md", type: "grammar", icon: "📖", badge: "Grammatik" },
            { title: "🗂️ A2 Wortschatz", path: "A2/Vocabulary.md", type: "vocab", icon: "🗂️", badge: "Wortschatz" },
            { title: "📒 A2 Arbeitsbuch / Skript", path: "A2/a2_skript_gr.pdf", type: "workbook", icon: "📒", badge: "Werkbuch" },
            { title: "📌 A2 Leitfaden & Struktur", path: "A2/README.md", type: "guide", icon: "📌", badge: "Leitfaden" }
          ]
        },
        {
          id: "B1",
          name: "Stufe B1 (Mittelstufe / Intermediate)",
          summary: "Der Genitiv (Wessen-Fall), Relativsätze, Vorgangspassiv, Konjunktiv II (Wünsche/Höflichkeit), Infinitiv mit zu, TeKaMoLo.",
          files: [
            { title: "📖 B1 Grammatik", path: "B1/Grammatik.md", type: "grammar", icon: "📖", badge: "Grammatik" },
            { title: "🗂️ B1 Wortschatz", path: "B1/Vocabulary.md", type: "vocab", icon: "🗂️", badge: "Wortschatz" },
            { title: "📒 B1 Arbeitsbuch / Skript", path: "B1/b1_skript_gr.pdf", type: "workbook", icon: "📒", badge: "Werkbuch" },
            { title: "📌 B1 Leitfaden & Struktur", path: "B1/README.md", type: "guide", icon: "📌", badge: "Leitfaden" }
          ]
        },
        {
          id: "B2",
          name: "Stufe B2 (Selbstständig / Upper-Int.)",
          summary: "Nominalstil vs. Verbalstil, 4 Passiversatzformen (sich lassen, sein + zu), Funktionsverbgefüge (FVG), erweiterte Partizipien.",
          files: [
            { title: "📖 B2 Grammatik", path: "B2/Grammatik.md", type: "grammar", icon: "📖", badge: "Grammatik" },
            { title: "🗂️ B2 Wortschatz", path: "B2/Vocabulary.md", type: "vocab", icon: "🗂️", badge: "Wortschatz" },
            { title: "📒 B2 Arbeitsbuch / Skript", path: "B2/b2_skript_gr.pdf", type: "workbook", icon: "📒", badge: "Werkbuch" },
            { title: "📌 B2 Leitfaden & Struktur", path: "B2/README.md", type: "guide", icon: "📌", badge: "Leitfaden" }
          ]
        },
        {
          id: "C1",
          name: "Stufe C1 (Fachkundig / Advanced)",
          summary: "Konjunktiv I (Indirekte Rede), epistemische/subjektive Modalverben, Gerundivum (zu + Partizip I), gehobene Satzkonnektoren.",
          files: [
            { title: "📖 C1 Grammatik", path: "C1/Grammatik.md", type: "grammar", icon: "📖", badge: "Grammatik" },
            { title: "🗂️ C1 Wortschatz", path: "C1/Vocabulary.md", type: "vocab", icon: "🗂️", badge: "Wortschatz" },
            { title: "📒 C1 Arbeitsbuch / Skript", path: "C1/c1_skript_gr.pdf", type: "workbook", icon: "📒", badge: "Werkbuch" },
            { title: "📌 C1 Leitfaden & Struktur", path: "C1/README.md", type: "guide", icon: "📌", badge: "Leitfaden" }
          ]
        },
        {
          id: "C2",
          name: "Stufe C2 (Meisterschaft / Proficient)",
          summary: "Synthetischer Konjunktiv II, topologische Ausklammerung ins Nachfeld, Dativus Ethicus, rhetorische Stilmittel, Modalpartikeln.",
          files: [
            { title: "📖 C2 Grammatik", path: "C2/Grammatik.md", type: "grammar", icon: "📖", badge: "Grammatik" },
            { title: "🗂️ C2 Wortschatz", path: "C2/Vocabulary.md", type: "vocab", icon: "🗂️", badge: "Wortschatz" },
            { title: "📌 C2 Leitfaden & Struktur", path: "C2/README.md", type: "guide", icon: "📌", badge: "Leitfaden" }
          ]
        }
      ]
    },
    {
      id: "path-d",
      name: "Praktische Werkbücher & Skripte",
      tag: "PDF Arbeitsbücher & Praxis",
      badge: "A1 – C1 Skripte",
      color: "var(--color-gold)",
      icon: "📒",
      description: "Original-Grammatikskripte (PDFs) und praktische Werkbücher für systematisches Üben, Vertiefen und Nachschlagen.",
      files: [
        {
          title: "A1 Grammatik-Skript & Arbeitsbuch",
          path: "A1/a1_skript_gr.pdf",
          type: "workbook",
          icon: "📒",
          badge: "A1 PDF",
          desc: "Vollständiges A1-Grammatikskript und Arbeitsbuch mit Übungen."
        },
        {
          title: "A1 Praktisches WerkBuch (EinfachDeutsch)",
          path: "A1/Practisches_WerkBuch/EinfachDeutsch_examples.txt",
          type: "workbook",
          icon: "✍️",
          badge: "A1 Praxis",
          desc: "Praktische Beispielsätze und Übungsnotizen."
        },
        {
          title: "A2 Grammatik-Skript & Arbeitsbuch",
          path: "A2/a2_skript_gr.pdf",
          type: "workbook",
          icon: "📒",
          badge: "A2 PDF",
          desc: "Vollständiges A2-Grammatikskript und Arbeitsbuch mit Übungen."
        },
        {
          title: "B1 Grammatik-Skript & Arbeitsbuch",
          path: "B1/b1_skript_gr.pdf",
          type: "workbook",
          icon: "📒",
          badge: "B1 PDF",
          desc: "Vollständiges B1-Grammatikskript und Arbeitsbuch mit Übungen."
        },
        {
          title: "B2 Grammatik-Skript & Arbeitsbuch",
          path: "B2/b2_skript_gr.pdf",
          type: "workbook",
          icon: "📒",
          badge: "B2 PDF",
          desc: "Vollständiges B2-Grammatikskript und Arbeitsbuch mit Übungen."
        },
        {
          title: "C1 Grammatik-Skript & Arbeitsbuch",
          path: "C1/c1_skript_gr.pdf",
          type: "workbook",
          icon: "📒",
          badge: "C1 PDF",
          desc: "Vollständiges C1-Grammatikskript und Arbeitsbuch mit Übungen."
        }
      ]
    },
    {
      id: "path-b",
      name: "Pfad B: Berufliche Sprache",
      tag: "Business German & Jobsektoren",
      badge: "8 Berufsfelder",
      color: "var(--color-business)",
      icon: "💼",
      description: "Praxisorientiertes Berufsdeutsch nach 8 Sektoren mit 3 Stufen: 1 (Alltag) → 2 (Team/Projekte) → 3 (Führung/Verhandlung).",
      files: [
        {
          title: "Übersicht & Konzept",
          path: "berufliche_sprache/README.md",
          type: "guide",
          icon: "🧭",
          badge: "Leitfaden",
          desc: "Didaktisches Stufenmodell für alle 8 Berufssektoren."
        },
        {
          title: "01. Büro & Administration",
          path: "berufliche_sprache/01_Allgemeine_Buerokommunikation.md",
          type: "business",
          icon: "🏢",
          badge: "Büro",
          desc: "Begrüßung, Smalltalk, Telefonieren, Krankmeldung, E-Mail-Korrespondenz."
        },
        {
          title: "02. IT, Software & Tech",
          path: "berufliche_sprache/02_IT_Software_und_Tech.md",
          type: "business",
          icon: "💻",
          badge: "IT & Tech",
          desc: "Daily Standups, Code Reviews, Bug Reports, Architekturdiskussionen, DevOps."
        },
        {
          title: "03. Projektmanagement & Consulting",
          path: "berufliche_sprache/03_Projektmanagement_und_Consulting.md",
          type: "business",
          icon: "📊",
          badge: "PM & Consulting",
          desc: "Kick-offs, Meilensteine, Scope Creep, Risikomatrix, Lenkungsausschuss."
        },
        {
          title: "04. Vertrieb, Sales & Account Mgmt.",
          path: "berufliche_sprache/04_Vertrieb_Sales_und_Account_Management.md",
          type: "business",
          icon: "🤝",
          badge: "Sales",
          desc: "Kaltakquise, Bedarfsanalyse, Einwandbehandlung, Rabattverhandlung, B2B-Angebote."
        },
        {
          title: "05. Marketing & Digitale Medien",
          path: "berufliche_sprache/05_Marketing_und_Digitale_Medien.md",
          type: "business",
          icon: "📢",
          badge: "Marketing",
          desc: "Redaktionspläne, Performance Marketing, Kampagnen, SEO/SEA, Agenturbriefings."
        },
        {
          title: "06. Finanzen & Controlling",
          path: "berufliche_sprache/06_Finanzen_Controlling_und_Buchhaltung.md",
          type: "business",
          icon: "💶",
          badge: "Finanzen",
          desc: "Reisekostenabrechnung, Monatsabschluss, Soll-Ist-Vergleich, Mahnwesen."
        },
        {
          title: "07. Personalwesen & HR",
          path: "berufliche_sprache/07_Personalwesen_und_Recruiting_HR.md",
          type: "business",
          icon: "👥",
          badge: "HR & Recruiting",
          desc: "Stellenausschreibungen, Bewerbungsinterviews, Arbeitszeugnisse, Onboarding."
        },
        {
          title: "08. Kundenservice & Support",
          path: "berufliche_sprache/08_Kundenservice_und_Support.md",
          type: "business",
          icon: "🎧",
          badge: "Support",
          desc: "Tickethandling, Deeskalation bei Beschwerden, Kulanzregelungen, SLAs."
        }
      ]
    },
    {
      id: "path-c",
      name: "Pfad C: Redewendungen & Sprichwörter",
      tag: "Deutsche Redensarten & Kultur",
      badge: "4 Themenbereiche",
      color: "var(--color-idiom)",
      icon: "🎭",
      description: "Bildhafte deutsche Alltagssprache, Herkunft, Sprachregister, 5-6 Beispielsätze pro Idiom und passende Frageschemata.",
      files: [
        {
          title: "Übersicht & Methodik",
          path: "Redewendungen/README.md",
          type: "guide",
          icon: "🧭",
          badge: "Leitfaden",
          desc: "Wie Redewendungen erlernt und verinnerlicht werden."
        },
        {
          title: "01. Arbeit & Erfolg",
          path: "Redewendungen/01_Arbeit_und_Erfolg.md",
          type: "idiom",
          icon: "🚀",
          badge: "Arbeit",
          desc: "Nägel mit Köpfen machen, Daumen drücken, auf Nummer sicher gehen, alle Hebel in Bewegung setzen."
        },
        {
          title: "02. Kommunikation & Verständnis",
          path: "Redewendungen/02_Kommunikation_und_Verstaendnis.md",
          type: "idiom",
          icon: "💬",
          badge: "Kommunikation",
          desc: "Nur Bahnhof verstehen, auf dem Holzweg sein, durch die Blume sagen, auf dem Schlauch stehen."
        },
        {
          title: "03. Emotionen & Konflikte",
          path: "Redewendungen/03_Emotionen_und_Konflikte.md",
          type: "idiom",
          icon: "🔥",
          badge: "Emotionen",
          desc: "Auf die Palme bringen, aus allen Wolken fallen, Honig ums Maul schmieren, ein Auge zudrücken."
        },
        {
          title: "04. Alltag & Lebensweisheiten",
          path: "Redewendungen/04_Alltag_und_Lebensweisheiten.md",
          type: "idiom",
          icon: "🍀",
          badge: "Alltag",
          desc: "Schwein haben, zwei Fliegen mit einer Klappe schlagen, Tomaten auf den Augen haben, alles in Butter."
        }
      ]
    }
  ],
  general: [
    {
      id: "main-readme",
      title: "🧭 DeutscheLernen Hauptleitfaden",
      path: "README.md",
      type: "root",
      icon: "🇩🇪",
      badge: "Zentrale"
    }
  ]
};

if (typeof window !== 'undefined') {
  window.LEARNING_MANIFEST = LEARNING_MANIFEST;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LEARNING_MANIFEST;
}
