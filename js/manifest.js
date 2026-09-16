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
            { title: "📒 A1 Arbeitsbuch", path: "A1/Arbeitsbuch.md", type: "workbook", icon: "📒", badge: "Werkbuch" },
            { title: "🔑 A1 Lösungsschlüssel", path: "A1/Loesungsschluessel.md", type: "solutions", icon: "🔑", badge: "Lösungen" },
            { title: "✍️ A1 Praktisches WerkBuch", path: "A1/Practisches_WerkBuch/EinfachDeutsch_examples.txt", type: "workbook", icon: "✍️", badge: "Praxis" },
            { title: "📌 A1 Leitfaden & Struktur", path: "A1/README.md", type: "guide", icon: "📌", badge: "Leitfaden" },
            { title: "🎓 A1 Abschluss-Spickzettel", path: "A1/Spickzettel.md", type: "cheatsheet", icon: "⚡", badge: "Level-Recap" }
          ]
        },
        {
          id: "A2",
          name: "Stufe A2 (Grundstufe / Elementary)",
          summary: "Der Dativ (Wem-Fall), Reflexivpronomen, 9 Wechselpräpositionen (Wo vs. Wohin), Perfekt & Präteritum, Nebensätze.",
          files: [
            { title: "📖 A2 Grammatik", path: "A2/Grammatik.md", type: "grammar", icon: "📖", badge: "Grammatik" },
            { title: "🗂️ A2 Wortschatz", path: "A2/Vocabulary.md", type: "vocab", icon: "🗂️", badge: "Wortschatz" },
            { title: "📒 A2 Arbeitsbuch", path: "A2/Arbeitsbuch.md", type: "workbook", icon: "📒", badge: "Werkbuch" },
            { title: "🔑 A2 Lösungsschlüssel", path: "A2/Loesungsschluessel.md", type: "solutions", icon: "🔑", badge: "Lösungen" },
            { title: "📌 A2 Leitfaden & Struktur", path: "A2/README.md", type: "guide", icon: "📌", badge: "Leitfaden" },
            { title: "🎓 A2 Abschluss-Spickzettel", path: "A2/Spickzettel.md", type: "cheatsheet", icon: "⚡", badge: "Level-Recap" }
          ]
        },
        {
          id: "B1",
          name: "Stufe B1 (Mittelstufe / Intermediate)",
          summary: "Der Genitiv (Wessen-Fall), Relativsätze, Vorgangspassiv, Konjunktiv II (Wünsche/Höflichkeit), Infinitiv mit zu, TeKaMoLo.",
          files: [
            { title: "📖 B1 Grammatik", path: "B1/Grammatik.md", type: "grammar", icon: "📖", badge: "Grammatik" },
            { title: "🗂️ B1 Wortschatz", path: "B1/Vocabulary.md", type: "vocab", icon: "🗂️", badge: "Wortschatz" },
            { title: "📒 B1 Arbeitsbuch", path: "B1/Arbeitsbuch.md", type: "workbook", icon: "📒", badge: "Werkbuch" },
            { title: "🔑 B1 Lösungsschlüssel", path: "B1/Loesungsschluessel.md", type: "solutions", icon: "🔑", badge: "Lösungen" },
            { title: "📌 B1 Leitfaden & Struktur", path: "B1/README.md", type: "guide", icon: "📌", badge: "Leitfaden" },
            { title: "🎓 B1 Abschluss-Spickzettel", path: "B1/Spickzettel.md", type: "cheatsheet", icon: "⚡", badge: "Level-Recap" }
          ]
        },
        {
          id: "B2",
          name: "Stufe B2 (Selbstständig / Upper-Int.)",
          summary: "Nominalstil vs. Verbalstil, 4 Passiversatzformen (sich lassen, sein + zu), Funktionsverbgefüge (FVG), erweiterte Partizipien.",
          files: [
            { title: "📖 B2 Grammatik", path: "B2/Grammatik.md", type: "grammar", icon: "📖", badge: "Grammatik" },
            { title: "🗂️ B2 Wortschatz", path: "B2/Vocabulary.md", type: "vocab", icon: "🗂️", badge: "Wortschatz" },
            { title: "📒 B2 Arbeitsbuch", path: "B2/Arbeitsbuch.md", type: "workbook", icon: "📒", badge: "Werkbuch" },
            { title: "🔑 B2 Lösungsschlüssel", path: "B2/Loesungsschluessel.md", type: "solutions", icon: "🔑", badge: "Lösungen" },
            { title: "📌 B2 Leitfaden & Struktur", path: "B2/README.md", type: "guide", icon: "📌", badge: "Leitfaden" },
            { title: "🎓 B2 Abschluss-Spickzettel", path: "B2/Spickzettel.md", type: "cheatsheet", icon: "⚡", badge: "Level-Recap" }
          ]
        },
        {
          id: "C1",
          name: "Stufe C1 (Fachkundig / Advanced)",
          summary: "Konjunktiv I (Indirekte Rede), epistemische/subjektive Modalverben, Gerundivum (zu + Partizip I), gehobene Satzkonnektoren.",
          files: [
            { title: "📖 C1 Grammatik", path: "C1/Grammatik.md", type: "grammar", icon: "📖", badge: "Grammatik" },
            { title: "🗂️ C1 Wortschatz", path: "C1/Vocabulary.md", type: "vocab", icon: "🗂️", badge: "Wortschatz" },
            { title: "📒 C1 Arbeitsbuch", path: "C1/Arbeitsbuch.md", type: "workbook", icon: "📒", badge: "Werkbuch" },
            { title: "🔑 C1 Lösungsschlüssel", path: "C1/Loesungsschluessel.md", type: "solutions", icon: "🔑", badge: "Lösungen" },
            { title: "📌 C1 Leitfaden & Struktur", path: "C1/README.md", type: "guide", icon: "📌", badge: "Leitfaden" },
            { title: "🎓 C1 Abschluss-Spickzettel", path: "C1/Spickzettel.md", type: "cheatsheet", icon: "⚡", badge: "Level-Recap" }
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
      id: "path-workbooks",
      name: "Praktische Werkbücher & Skripte",
      tag: "Interaktive Arbeitsbücher & Praxis",
      badge: "A1 – C1 Arbeitsbücher",
      color: "var(--color-gold)",
      icon: "📒",
      description: "Konsolidierte Arbeitsbücher im Markdown-Format mit strukturierten Übungen, Lösungsblöcken und didaktischen Aufgaben.",
      files: [
        {
          title: "A1 Arbeitsbuch & Übungen",
          path: "A1/Arbeitsbuch.md",
          type: "workbook",
          icon: "📒",
          badge: "A1 Werkbuch",
          desc: "Grammatikübungen, Satzbau und Lösungen für Stufe A1."
        },
        {
          title: "A1 Satzbau-Praxis (V2 & Satzklammer)",
          path: "A1_PRACTICAL",
          type: "practical",
          icon: "✍️",
          badge: "A1 Praxis",
          desc: "Interaktives Satzbau-Labor: V2-Stellung, Inversion, Satzklammer, W-Fragen."
        },
        {
          title: "A2 Arbeitsbuch & Übungen",
          path: "A2/Arbeitsbuch.md",
          type: "workbook",
          icon: "📒",
          badge: "A2 Werkbuch",
          desc: "Dativ, Wechselpräpositionen, Perfekt und Nebensätze mit Lösungen."
        },
        {
          title: "A2 Satzbau-Praxis (Satzgefüge & weil/wenn)",
          path: "A2_PRACTICAL",
          type: "practical",
          icon: "✍️",
          badge: "A2 Praxis",
          desc: "Kausalsätze (weil), Temporalsätze (wenn), Infinitiv mit zu, Reflexivverben."
        },
        {
          title: "B1 Arbeitsbuch & Übungen",
          path: "B1/Arbeitsbuch.md",
          type: "workbook",
          icon: "📒",
          badge: "B1 Werkbuch",
          desc: "Passiv, Konjunktiv II, Genitiv und Satzverbindung mit Lösungen."
        },
        {
          title: "B1 Satzbau-Praxis (Relativsätze & Passiv)",
          path: "B1_PRACTICAL",
          type: "practical",
          icon: "✍️",
          badge: "B1 Praxis",
          desc: "Relativsätze (Kasus), Konjunktiv II, Vorgangspassiv, Doppelkonnektoren."
        },
        {
          title: "B2 Arbeitsbuch & Übungen",
          path: "B2/Arbeitsbuch.md",
          type: "workbook",
          icon: "📒",
          badge: "B2 Werkbuch",
          desc: "Nominalstil, Partizipialkonstruktionen, FVG mit Lösungen."
        },
        {
          title: "B2 Satzbau-Praxis (Funktionsverben & Partizipien)",
          path: "B2_PRACTICAL",
          type: "practical",
          icon: "✍️",
          badge: "B2 Praxis",
          desc: "Funktionsverbgefüge (FVG), Passivalternativen, Erweitertes Partizip I/II."
        },
        {
          title: "C1 Arbeitsbuch & Übungen",
          path: "C1/Arbeitsbuch.md",
          type: "workbook",
          icon: "📒",
          badge: "C1 Werkbuch",
          desc: "Komplexe Satzstrukturen, Textsorten, Redemittel mit Lösungen."
        },
        {
          title: "C1 Satzbau-Praxis (Nominalstil & Redewiedergabe)",
          path: "C1_PRACTICAL",
          type: "practical",
          icon: "✍️",
          badge: "C1 Praxis",
          desc: "Nominalstil-Transformation, Partizipialsatz-Verkürzung, Konjunktiv I."
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
    },
    {
      id: "path-d",
      name: "Pfad D: English Learners' Companion",
      tag: "Deutsch lernen auf Englisch",
      badge: "Bilingual Hub",
      color: "#38bdf8",
      icon: "🇬🇧",
      description: "Speziell für Englischsprachige: Satzbau (Wortstellung), 112 Mini-Übersetzungen, Adjektivendungen, Präfixverben (holen) und unregelmäßige Verben.",
      files: [
        {
          title: "English Learners' Leitfaden",
          path: "English_Guides/README.md",
          type: "guide",
          icon: "🧭",
          badge: "Leitfaden",
          desc: "Die 4 mentalen Umstellungen: Word order, Satzklammer, Fälle & trennbare Verben."
        },
        {
          title: "112 Mini-Translations",
          path: "English_Guides/Mini_Translations.md",
          type: "guide",
          icon: "💬",
          badge: "Phrasen",
          desc: "112 alltags- und berufsnahe Sätze: du/Sie, typische Fallen ('Mir ist kalt', 'Stimmt so!')."
        },
        {
          title: "Wortstellung Demystified",
          path: "English_Guides/Wortstellung_Mastery.md",
          type: "grammar",
          icon: "📐",
          badge: "Satzbau",
          desc: "Verb an Position 2, TeKaMoLo, ADUSO (Position 0) vs. Verb-Kicker (weil, dass, ob) & Übungen."
        },
        {
          title: "Adjektivendungen Schritt für Schritt",
          path: "English_Guides/Adjective_Endings_Simplified.md",
          type: "grammar",
          icon: "🎨",
          badge: "Grammatik",
          desc: "Bestimmter, unbestimmter und Nullartikel, Dativ/Genitiv/Plural-Regeln & Übungsaufgaben."
        },
        {
          title: "Präfixverben Masterclass ('holen')",
          path: "English_Guides/Prefix_Verbs_Holen.md",
          type: "grammar",
          icon: "⚡",
          badge: "Verben",
          desc: "abholen, aufholen, ausholen, einholen, erholen, nachholen, überholen, wiederholen im Vergleich."
        },
        {
          title: "A1–B1 Unregelmäßige Verben",
          path: "English_Guides/Irregular_Verbs_Reference.md",
          type: "vocab",
          icon: "📚",
          badge: "Verbtabelle",
          desc: "Über 75 unregelmäßige Verben mit 4 Stammformen, Hilfsverb (haben/sein) und Beispielsätzen."
        },
        {
          title: "Aussprache & Phonetik (Pronunciation)",
          path: "English_Guides/Pronunciation_Phonetics_Guide.md",
          type: "guide",
          icon: "🎙️",
          badge: "Phonetik & IPA",
          desc: "Vokallänge, Umlaute (ä, ö, ü), Diphthonge, Knacklaut, ch-Laute, Auslautverhärtung und IPA-Lautschrift."
        },
        {
          title: "Conversational Survival Handbook",
          path: "English_Guides/Conversational_Survival_Handbook.md",
          type: "guide",
          icon: "🗣️",
          badge: "Real-Life Guides",
          desc: "Praktische soziale Skripte: Sie vs. du, Supermarkt-Kasse, ÖPNV, Gastronomie, Notfälle und Feiertage."
        },
        {
          title: "Verbtempera & Hilfsverben (haben/sein)",
          path: "English_Guides/Verb_Tenses_And_Auxiliaries.md",
          type: "grammar",
          icon: "⏳",
          badge: "Verben & Zeiten",
          desc: "Keine -ing-Formen, schwache vs. starke Verben, Perfekt mit haben vs. sein und Kernverben mit IPA."
        }
      ]
    },
    {
      id: "path-e",
      name: "Pfad E: Prüfungszentrum & Zertifikate",
      tag: "Goethe, telc & DTZ Prüfungen",
      badge: "Goethe & telc Hub",
      color: "#ec4899",
      icon: "🎯",
      description: "Offizielle Modellprüfungen (Goethe A2, telc Deutsch A1–C2), telc Sprachbausteine-Training, DTZ-Einbürgerungsleitfaden und Fachsprachen (Hochschule, Medizin & Pflege).",
      files: [
        {
          title: "Prüfungszentrum Leitfaden",
          path: "Pruefung/README.md",
          type: "guide",
          icon: "🧭",
          badge: "Leitfaden",
          desc: "CEFR-Prüfungsformate, Zeitmanagement, Bestehensgrenzen und Strategien."
        },
        {
          title: "Goethe-Zertifikat A2 Modelltest",
          path: "Pruefung/Goethe_A2_Modelltest.md",
          type: "exam",
          icon: "🎯",
          badge: "Goethe A2",
          desc: "Kompletter Modelltest: Lesen (Teil 1–4), Schreiben (Teil 1–2), Sprechen mit offiziellen Lösungen."
        },
        {
          title: "A2 Einstufungstest (40 Fragen)",
          path: "Pruefung/A2_Einstufungstest.md",
          type: "exam",
          icon: "📝",
          badge: "Einstufung",
          desc: "40 diagnostische Multiple-Choice-Fragen zur exakten Ermittlung des Sprachniveaus."
        },
        {
          title: "A2 Kapiteltests (1–12)",
          path: "Pruefung/A2_Kapiteltests.md",
          type: "exam",
          icon: "📑",
          badge: "Kapiteltests",
          desc: "Netzwerk A2 Lernkontrollen zu jedem Kapitel mit detailliertem Lösungsschlüssel."
        },
        {
          title: "telc Prüfungen Guide (A1–C2)",
          path: "Pruefung/telc_Zertifikate_Guide.md",
          type: "guide",
          icon: "🏛️",
          badge: "telc Matrix",
          desc: "Vollständiger Überblick aller telc Prüfungen: Allgemeinsprache, Beruf, Hochschule und Medizin."
        },
        {
          title: "telc Sprachbausteine Masterclass",
          path: "Pruefung/telc_Sprachbausteine_Masterclass.md",
          type: "grammar",
          icon: "🧩",
          badge: "B1/B2 Training",
          desc: "Intensivtraining für Teil 1 & 2 der telc Sprachbausteine mit 3 vollständigen Drills und Lösungen."
        },
        {
          title: "DTZ A2·B1 Einbürgerungs-Guide",
          path: "Pruefung/telc_DTZ_Einbuergerung_Guide.md",
          type: "guide",
          icon: "🇩🇪",
          badge: "DTZ & Einbürgerung",
          desc: "Deutsch-Test für Zuwanderer: Skalierte Bewertung, die 4 wichtigsten Brieftypen und Sprech-Redemittel."
        },
        {
          title: "telc C1 Hochschule & Fachsprachen",
          path: "Pruefung/telc_C1_Hochschule_Fachsprachen.md",
          type: "guide",
          icon: "🎓",
          badge: "Hochschule & Medizin",
          desc: "Wissenschaftlicher Hochschulzugang und medizinische Fachsprachprüfung (Approbation & Pflege)."
        },
        {
          title: "telc Lernfortschritt & Curriculum",
          path: "Pruefung/Lernfortschritt_telc_Curriculum.md",
          type: "guide",
          icon: "🗺️",
          badge: "A1–C1 Roadmap",
          desc: "Strukturierter Lernfortschritt, CEFR-Meilensteine und offizielle telc Downloadlinks."
        },
        {
          title: "telc Wortschatz A1–B1 (Bilingual)",
          path: "Pruefung/telc_Wortschatz_A1_B1_Bilingual.md",
          type: "vocab",
          icon: "📖",
          badge: "Wortschatz & Verben",
          desc: "Offizielle Wortschatzlisten mit englischen Übersetzungen, 50 A1-Verben und B1-Funktionsverben."
        },
        {
          title: "telc B1 Zertifikat Deutsch Modelltest",
          path: "Pruefung/telc_B1_ZertifikatDeutsch_Modelltest.md",
          type: "exam",
          icon: "🎯",
          badge: "B1 Modelltest",
          desc: "Vollständiger B1-Originaltest (Lesen, Sprachbausteine, Schreiben, Sprechen) mit Lösungen & Musterbrief."
        },
        {
          title: "Deutsch-Test für den Beruf B2 (DTB)",
          path: "Pruefung/telc_B2_Beruf_Modelltest.md",
          type: "exam",
          icon: "💼",
          badge: "B2 Berufstest",
          desc: "Kompletter BAMF/telc Berufstest: Arbeitsanweisungen, geschäftliche Reklamation und Verhandlung."
        },
        {
          title: "telc Pflege & Medizin Fachpraxis",
          path: "Pruefung/telc_Pflege_Medizin_Fachpraxis.md",
          type: "business",
          icon: "🩺",
          badge: "Klinik & Pflege",
          desc: "Klinische Fachbegriffe vs. Laiensprache, 7-Stufen-Anamnesebogen, ISBAR-Übergabe und Arztbrief."
        },
        {
          title: "telc C1 Wissenschaftssprache",
          path: "Pruefung/telc_C1_Wissenschaftssprache_Studium.md",
          type: "guide",
          icon: "🔬",
          badge: "C1 Studium",
          desc: "Akademische Konnektoren, Nominalstil, Grafikbeschreibung und universitäre Diskussionsführung."
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
