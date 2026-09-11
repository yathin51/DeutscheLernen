# DeutscheLernen: Dein Umfassendes Deutsch-Lernsystem

> *„Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.“* — Ludwig Wittgenstein

Willkommen bei **DeutscheLernen**!  
Dieses Repository wurde von einem erfahrenen Senior-Sprachdozenten (DaF – Deutsch als Fremdsprache) grundlegend strukturiert, um das Deutschlernen für Einsteiger und Fortgeschrittene **zeiteffizienter, intuitiver und praxisnäher** zu gestalten. 

---

---

## 🚀 Lokale Nutzung & Schnellstart (Local Usage Guide)

Das Projekt **DeutscheLernen** ist als **autarkes, offline-fähiges Gesamtsystem** konzipiert. Du kannst es auf deinem lokalen Rechner auf verschiedene Arten nutzen – ganz ohne Internetverbindung, ohne externe Abhängigkeiten und ohne Cloud-Zwang.

```
                          ┌───────────────────────────────────────────────────┐
                          │          DeutscheLernen: Lokale Nutzung           │
                          └─────────────────────────┬─────────────────────────┘
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 ▼                                                                     ▼
    ┌─────────────────────────┐                                           ┌─────────────────────────┐
    │   A. WEB-PORTAL (SPA)   │                                           │  B. MARKDOWN-QUELLDATEIEN│
    │ Interaktives Dashboard  │                                           │ Direkte Bearbeitung im  │
    │  & Arbeitsblatt-Studio  │                                           │  Editor (z. B. VS Code) │
    └────────────┬────────────┘                                           └────────────┬────────────┘
                 │                                                                     │
     ┌───────────┴───────────┐                                             ┌───────────┴───────────┐
     ▼                       ▼                                             ▼                       ▼
Option 1: Direktstart   Option 2: Lokaler Server                      Markdown-Preview       Python-Build-Skripte
 (Doppelklick index.html) (python / npx / Live Server)                 (Strg+Umschalt+V)     (scripts/build_*.py)
```

---

### Modus 1: Interaktives Web-Portal lokal nutzen (`index.html`)

Das Web-Portal bietet dir eine vollständige Desktop- und Tablet-Oberfläche mit dynamischer Navigation, 15-Minuten-Lerntimer, Text-to-Speech-Aussprache und interaktiven Arbeitsblättern.

#### Option A: Direktstart ohne Server (Empfohlen – 0 Sekunden Setup)
Die Anwendung verfügt über eine vorkompilierte Offline-Datenarchitektur ([`./js/docs_content.js`](./js/docs_content.js)). Dadurch läuft das gesamte Portal ohne Webserver und ohne CORS-Sicherheitsblockaden:

1. Navigiere im Datei-Explorer in den Projektordner.
2. Mache einen **Doppelklick auf [`./index.html`](./index.html)**.
3. *Alternativ:* Ziehe [`./index.html`](./index.html) per Drag & Drop in dein geöffnetes Browserfenster (Google Chrome, Edge, Firefox oder Safari).
4. Die Adresszeile zeigt `file:///.../index.html` – alle Inhalte, Module und Übungen sind sofort einsatzbereit.

#### Option B: Start über lokalen HTTP-Webserver (Entwickler-Empfehlung)
Wenn du Quelldateien editierst oder das Portal standardkonform über `localhost` nutzen möchtest, starte einen lokalen Einzeiler-Server:

* **Mit Python (bereits auf den meisten Systemen installiert):**
  ```bash
  # Im Hauptverzeichnis des Projekts ausführen:
  python -m http.server 8080
  ```
  Anschließend im Browser öffnen: [**http://localhost:8080**](http://localhost:8080)

* **Mit Node.js / npx:**
  ```bash
  npx serve .
  # oder:
  npx http-server -p 8080
  ```
  Anschließend im Browser öffnen: [**http://localhost:3000**](http://localhost:3000) bzw. [**http://localhost:8080**](http://localhost:8080)

* **Mit Visual Studio Code:**
  Installiere die Erweiterung **Live Server**, klicke mit der rechten Maustaste auf [`./index.html`](./index.html) und wähle **„Open with Live Server“**.

---

### Modus 2: Interaktives Arbeitsblatt-Studio (`#workbooks`)

Direkt im Web-Portal integriert ist ein interaktives Lernstudio für Grammatikübungen:

* **Aufrufen:** Klicke in der linken Navigationsleiste auf **„📝 Arbeitsblätter & Studio“** (oder rufe direkt `#workbooks:A1` im Browser auf).
* **Interaktiv lösen:** Fülle Lückentexte, Tabellen und Übungssätze direkt in den Formularfeldern aus.
* **Echtzeit-Bewertung:** Klicke auf **„Eingaben prüfen & bewerten“**, um deinen aktuellen Punktestand und sofortiges Farb-Feedback (Grün/Rot) zu erhalten.
* **Musterlösung generieren:** Der Schalter **„Antworten generieren & Lösungsschlüssel“** füllt alle Übungen mit didaktisch geprüften Musterlösungen aus.
* **Drucken & PDF-Export:** Drücke im Browser `Strg + P`. Das Portal blendet Navigation und Bedienelemente automatisch aus und erzeugt ein sauberes, druckfertiges Arbeitsblatt.

---

### Modus 3: Lokale Markdown-Nutzung in VS Code & Editoren

Alle Lernmaterialien sind in standardkonformem GitHub Flavored Markdown (`.md`) verfasst. Du kannst das Projekt komplett textbasiert in Editoren wie Visual Studio Code, Obsidian, Cursor oder Typora verwenden:

* **Integrierte Vorschau:** Öffne eine beliebige Datei (z. B. [`./A1/Grammatik.md`](./A1/Grammatik.md)) in VS Code und drücke `Strg + Umschalt + V` (macOS: `Cmd + Shift + V`) für die formatierte Vorschau mit Tabellen und Codeblöcken.
* **Suche:** Nutze die projektweite Textsuche (`Strg + Umschalt + F`), um Vokabeln, Grammatikregeln oder Redewendungen sekundenschnell aufzuspüren.
* **Relative Verlinkung:** Alle internen Querverweise zwischen den Stufen ([`./A1/`](./A1/), [`./A2/`](./A2/), [`./B1/`](./B1/), [`./B2/`](./B2/), [`./C1/`](./C1/), [`./C2/`](./C2/), [`./berufliche_sprache/`](./berufliche_sprache/) und [`./Redewendungen/`](./Redewendungen/)) sind strikt relativ angelegt und funktionieren nahtlos im Editor.

---

### Modus 4: Lokale Build- & Pflegewerkzeuge (`scripts/`)

Im Ordner [`./scripts/`](./scripts/) stehen automatisierte Python-Skripte für die lokale Pflege und Erweiterung des Systems bereit:

| Skript | Befehl | Funktion |
| :--- | :--- | :--- |
| **Dokumente bündeln** | `python scripts/build_docs_bundle.py` | Liest alle 34 Markdown-Dateien ein und aktualisiert das Offline-Bündel [`./js/docs_content.js`](./js/docs_content.js). Nach Bearbeitung von `.md`-Dateien einmalig ausführen. |
| **Aussprache-Wörterbuch** | `python scripts/build_pronunciations.py` | Generiert standardisierte IPA-Lautschriften und Audio-Verknüpfungen für deutsche Vokabeln via G2P-Engine. |
| **Vokabular anreichern** | `python scripts/clean_and_populate_vocabulary.py` | Synchronisiert und strukturiert Beispielsätze (5–6 Pronomen-Sätze) über alle CEFR-Stufen. |

---

### 💡 Tipps für das optimale Browser-Erlebnis

* 🔊 **Audio & Sprachausgabe (TTS):**  
  Das Portal nutzt die native Browser Web Speech API. Klicke auf Lautsprecher-Symbole für die deutsche Aussprache.  
  *(Tipp: Browser verlangen vor der ersten Tonwiedergabe eine kurze Benutzerinteraktion – klicke einfach einmal auf die Seite).*
* ⏱️ **Persistenter Speicher (`localStorage`):**  
  Dein Lerntimer (15-Minuten-Fokus), Farbschema (Dark/Light) und deine Arbeitsblatt-Fortschritte werden automatisch lokal im Browserprofil gespeichert.
* 📱 **Mobile & Tablet-Test:**  
  Drücke `F12` im Browser, um die Entwicklertools zu öffnen, und aktiviere die Geräteemulation für eine responsive Smartphone- oder Tablet-Ansicht.

---

### 🧭 Die Fünf Großen Lernpfade

Das System ist in fünf komplementäre Hauptbereiche gegliedert:

```
                                  ┌─────────────────────────────────────────────────────────────┐
                                  │                       DeutscheLernen                        │
                                  └──────────────────────────────┬──────────────────────────────┘
                                                                 │
        ┌─────────────────────────┬──────────────────────────────┼──────────────────────────────┬─────────────────────────┐
        ▼                         ▼                              ▼                              ▼                         ▼
┌───────────────────┐   ┌───────────────────┐          ┌───────────────────┐          ┌───────────────────┐     ┌───────────────────┐
│  PFAD A: CEFR     │   │ PFAD B: BERUFS-   │          │ PFAD C: REDE-     │          │ PFAD D: ENGLISH   │     │ PFAD E: PRÜFUNGS- │
│  Stufen (A1-C2)   │   │ SPRACHE (Job)     │          │ WENDUNGEN (Idiom) │          │ COMPANION (EN/DE) │     │ ZENTRUM (Zertif.) │
│  Akademischer     │   │ 8 Sektoren von    │          │ Deutsche Redens-  │          │ 112 Translations, │     │ Goethe Modelltest,│
│  Stufenaufbau     │   │ IT bis Finanzen   │          │ arten & Kultur    │          │ Wortstellung & Co │     │ Einstufung & Tests│
└───────────────────┘   └───────────────────┘          └───────────────────┘          └───────────────────┘     └───────────────────┘
```

---

## 🎓 Pfad A: Der Akademische Sprachpfad (CEFR A1 – C2)

Jeder Stufenordner ist konsequent auf **drei Kernsäulen** konsolidiert (Schluss mit Datei-Chaos!):
1. **`Grammatik.md`**: Der vollständige Leitfaden mit der **Universal-Triade (`der / die / das`)**, Nomen-Pronomen-Austausch, mindestens 5 ausführlichen Beispielsätzen pro Thema und **eigenen Fragesektionen** („Wie frage ich danach?“).
2. **`Vocabulary.md`**: Der thematisch geordnete Wortschatz mit Genus, Plural und 5–6 nicht-wiederholten Pronomen-Beispielsätzen pro Wort.
3. **`Arbeitsbuch.md`**: Vollständig digitalisierte, strukturierte Arbeitsbücher mit Übungsaufgaben, Satzbaumustern und aufklappbaren Lösungsschlüsseln.

| Stufe | Niveau & Kernkompetenz | Wichtigste Grammatikthemen | Schnellzugriff |
| :---: | :--- | :--- | :---: |
| **A1** | **Anfänger (Beginner)** | Genusregeln (*der/die/das*), Nominativ vs. Akkusativ, Personal- & Possessivpronomen, Präsens, Modalverben, DOGFU-Präpositionen, Satzklammer (Verb auf Pos. 2). | [📖 Grammatik](./A1/Grammatik.md) \| [🗂️ Wortschatz](./A1/Vocabulary.md) \| [📒 Arbeitsbuch](./A1/Arbeitsbuch.md) \| [📌 Leitfaden](./A1/README.md) |
| **A2** | **Grundstufe (Elementary)** | Der Dativ (*Wem-Fall*), Dativpronomen & Reflexivpronomen, 9 Wechselpräpositionen (Wo? vs. Wohin?), Perfekt & Präteritum, Nebensätze (*weil, dass, wenn*). | [📖 Grammatik](./A2/Grammatik.md) \| [🗂️ Wortschatz](./A2/Vocabulary.md) \| [📒 Arbeitsbuch](./A2/Arbeitsbuch.md) \| [📌 Leitfaden](./A2/README.md) |
| **B1** | **Mittelstufe (Intermediate)** | Der Genitiv (*Wessen-Fall*), Relativsätze, Vorgangspassiv (*werden + Partizip II*), Konjunktiv II der Gegenwart, Infinitiv mit *zu / um... zu*, TeKaMoLo. | [📖 Grammatik](./B1/Grammatik.md) \| [🗂️ Wortschatz](./B1/Vocabulary.md) \| [📒 Arbeitsbuch](./B1/Arbeitsbuch.md) \| [📌 Leitfaden](./B1/README.md) |
| **B2** | **Selbstständig (Upper-Interm.)**| Nominalstil vs. Verbalstil (Transformation), 4 Passiversatzformen (*sich lassen, sein + zu*), Funktionsverbgefüge (FVG), erweiterte Partizipien, Futur II. | [📖 Grammatik](./B2/Grammatik.md) \| [🗂️ Wortschatz](./B2/Vocabulary.md) \| [📒 Arbeitsbuch](./B2/Arbeitsbuch.md) \| [📌 Leitfaden](./B2/README.md) |
| **C1** | **Fachkundig (Advanced)** | Konjunktiv I (Indirekte Rede), epistemische/subjektive Modalverben (*muss, dürfte, will, soll*), Gerundivum (*zu + Partizip I*), gehobene Syntaxkonnektoren. | [📖 Grammatik](./C1/Grammatik.md) \| [🗂️ Wortschatz](./C1/Vocabulary.md) \| [📒 Arbeitsbuch](./C1/Arbeitsbuch.md) \| [📌 Leitfaden](./C1/README.md) |
| **C2** | **Meisterschaft (Proficient)** | Synthetischer Konjunktiv II, topologische Ausklammerung ins Nachfeld, Dativus Ethicus, rhetorische Stilmittel (Chiasmus, Oxymoron), Modalpartikeln. | [📖 Grammatik](./C2/Grammatik.md) \| [🗂️ Wortschatz](./C2/Vocabulary.md) \| [📌 Leitfaden](./C2/README.md) |

---

## 💼 Pfad B: Berufliche Sprache (Business German nach Tätigkeitsfeldern)

Der Kursbereich [**`berufliche_sprache/`**](./berufliche_sprache/README.md) bereitet dich zielgerichtet auf den deutschsprachigen Arbeitsmarkt vor. Er ist **nicht nach Sprachlevels unterteilt**, sondern wächst in jeder Datei **stufenweise von Alltagsroutinen (Stufe 1) über Teamabstimmungen (Stufe 2) bis zur Führungsebene (Stufe 3)**.

| Sektor-Datei | Berufsfeld & Tätigkeitsbereich | Enthaltene Praxis-Vorlagen |
| :--- | :--- | :--- |
| [**`01_Allgemeine_Buerokommunikation.md`**](./berufliche_sprache/01_Allgemeine_Buerokommunikation.md) | Begrüßung, Smalltalk, Telefonieren, Krankmeldung, Terminkoordination | Formelle E-Mail-Terminanfrage |
| [**`02_IT_Software_und_Tech.md`**](./berufliche_sprache/02_IT_Software_und_Tech.md) | Daily Standups, Code Reviews, Bug Reports, APIs, Architektur, DevOps | Jira-Bug-Ticket & PR-Review |
| [**`03_Projektmanagement_und_Consulting.md`**](./berufliche_sprache/03_Projektmanagement_und_Consulting.md) | Kick-offs, Meilensteine, Scope Creep, Risikomatrix, Lenkungsausschuss | Vorstands-Statusbericht (Executive Summary) |
| [**`04_Vertrieb_Sales_und_Account_Management.md`**](./berufliche_sprache/04_Vertrieb_Sales_und_Account_Management.md) | Kaltakquise, Bedarfsanalyse, Einwandbehandlung, Rabatte, Rahmenverträge | Professionelles B2B-Angebotsanschreiben |
| [**`05_Marketing_und_Digitale_Medien.md`**](./berufliche_sprache/05_Marketing_und_Digitale_Medien.md) | Redaktionspläne, Performance Marketing, SEO/SEA, Markenstrategie, Krisen-PR | Kreativ-Briefing für Werbeagenturen |
| [**`06_Finanzen_Controlling_und_Buchhaltung.md`**](./berufliche_sprache/06_Finanzen_Controlling_und_Buchhaltung.md) | Reisekosten, Belegprüfung, Monatsabschluss, Soll-Ist-Vergleich, Revision | Formelle Zahlungserinnerung / Mahnung |
| [**`07_Personalwesen_und_Recruiting_HR.md`**](./berufliche_sprache/07_Personalwesen_und_Recruiting_HR.md) | Stellenausschreibungen, Bewerbungsgespräche, Arbeitszeugnisse, Betriebsrat | Einladung zum Vorstellungsgespräch |
| [**`08_Kundenservice_und_Support.md`**](./berufliche_sprache/08_Kundenservice_und_Support.md) | Tickethandling, Deeskalation am Telefon, Kulanzregelungen, SLAs | Kundenservice-Deeskalationsschreiben |

---

## 🎭 Pfad C: Redewendungen, Sprichwörter & Redensarten

Der Modulbereich [**`Redewendungen/`**](./Redewendungen/README.md) erschließt dir den Reichtum der bildhaften deutschen Alltagssprache. Jede Redewendung enthält die wörtliche Übersetzung, Herkunft & Kulturgeschichte, Sprachregister, 5–6 nicht-wiederholte Pronomen-Beispiele und eine eigene Fragesektion:

| Thematische Datei | Themenschwerpunkt | Ausgewählte Schlüssel-Idiome |
| :--- | :--- | :--- |
| [**`01_Arbeit_und_Erfolg.md`**](./Redewendungen/01_Arbeit_und_Erfolg.md) | Beruf, Karriere, Fleiß & Scheitern | *Nägel mit Köpfen machen, Daumen drücken, auf Nummer sicher gehen, alle Hebel in Bewegung setzen* |
| [**`02_Kommunikation_und_Verstaendnis.md`**](./Redewendungen/02_Kommunikation_und_Verstaendnis.md) | Missverständnisse, Klarheit & Wahrheit | *Nur Bahnhof verstehen, auf dem Holzweg sein, durch die Blume sagen, auf dem Schlauch stehen* |
| [**`03_Emotionen_und_Konflikte.md`**](./Redewendungen/03_Emotionen_und_Konflikte.md) | Wut, Verliebtheit, Milde & Kritik | *Auf die Palme bringen, aus allen Wolken fallen, Honig ums Maul schmieren, ein Auge zudrücken* |
| [**`04_Alltag_und_Lebensweisheiten.md`**](./Redewendungen/04_Alltag_und_Lebensweisheiten.md) | Glück, Alltagspannen, Tiere & Geduld | *Schwein haben, zwei Fliegen mit einer Klappe schlagen, Tomaten auf den Augen haben, alles in Butter* |

---

## 🇬🇧 Pfad D: English Learners' Companion (Deutsch für Englischsprachige)

Der Modulbereich [**`English_Guides/`**](./English_Guides/README.md) wurde speziell für Personen entwickelt, die Deutsch über die englische Sprache lernen. Er baut die typischen Stolperfallen und mentalen Barrieren von englischen Muttersprachlern systematisch ab:

| Leitfaden | Thema & didaktischer Fokus | Enthaltene Highlights |
| :--- | :--- | :--- |
| [**`README.md`**](./English_Guides/README.md) | Übersicht & Mentale Transformation | Die 4 mentalen Umstellungen: Word order (V2), Satzklammer, Fälle & trennbare Verben |
| [**`Mini_Translations.md`**](./English_Guides/Mini_Translations.md) | 112 Alltags- & Business-Mini-Translations | du vs. Sie Varianten, Praxis-Fallen (*„Mir ist kalt“* vs. *„Ich bin kalt“*, *„Stimmt so!“*) |
| [**`Wortstellung_Mastery.md`**](./English_Guides/Wortstellung_Mastery.md) | Deutsche Satzstellung & Syntax | V2-Regel, TeKaMoLo (Wann-Warum-Wie-Wo), ADUSO (Position 0) vs. Verb-Kicker |
| [**`Adjective_Endings_Simplified.md`**](./English_Guides/Adjective_Endings_Simplified.md) | Adjektivdeklination Schritt für Schritt | Der 3-Stufen-Entscheidungsbaum (Schwach, Gemischt, Stark) mit 20 Übungssätzen & Lösungen |
| [**`Prefix_Verbs_Holen.md`**](./English_Guides/Prefix_Verbs_Holen.md) | Trennbare & untrennbare Präfixe (*holen*) | *abholen, aufholen, ausholen, einholen, erholen, nachholen, überholen, wiederholen* |
| [**`Irregular_Verbs_Reference.md`**](./English_Guides/Irregular_Verbs_Reference.md) | A1–B1 Unregelmäßige Verben | Über 75 Schlüsselverben mit 4 Stammformen, Hilfsverb (*haben/sein*) und englischer Übersetzung |
| [**`Pronunciation_Phonetics_Guide.md`**](./English_Guides/Pronunciation_Phonetics_Guide.md) | Aussprache, Phonetik & IPA-Lautschrift | Vokallänge, Knacklaut, Umlaute (ä, ö, ü), Diphthonge, ch-Laute, Auslautverhärtung |
| [**`Conversational_Survival_Handbook.md`**](./English_Guides/Conversational_Survival_Handbook.md) | Conversational Survival Handbook | Sie vs. du, Supermarkt-Kasse, ÖPNV, Gastronomie, Notruf-Leitfaden (112/110) & Feiertage |
| [**`Verb_Tenses_And_Auxiliaries.md`**](./English_Guides/Verb_Tenses_And_Auxiliaries.md) | Verbtempera & Hilfsverben (haben vs. sein) | Keine -ing-Formen, schwache vs. starke Verben, haben/sein-Entscheidungsbaum & IPA-Tabelle |

---

## 🌐 Externe Referenzen & Cloud-Ressourcen

* 📂 **Google Drive Lernmaterialien:** [Google Drive Folder (Referenz)](https://drive.google.com/drive/u/0/folders/17Qqsozkrh0KDDWqVTvUyNfZpKk4DABW6) — Ergänzendes Cloud-Archiv für PDFs, Handbücher und Lehrwerke.
* 🏛️ **telc Downloadbereich:** [telc Offizieller Downloadbereich](https://www.telc.net/lehrmaterialien/downloadbereich/) — Kostenlose Übungstests, Audio-Dateien, Wortschatzlisten und Curricula direkt vom Testanbieter.

---

## 🎯 Pfad E: Prüfungszentrum & Zertifikate (Goethe, telc & DTZ Hub)

Das [**`Pruefung/`**](./Pruefung/README.md)-Zentrum liefert umfassende, prüfungsnahe Materialien zur Vorbereitung auf offizielle Sprachdiplome (Goethe-Zertifikat, telc Deutsch, ÖSD) sowie Einstufungs-, Kontroll- und Einbürgerungstests:

| Prüfungsmaterial | Format & Modul | Enthaltene Komponenten & Schwerpunkte |
| :--- | :--- | :--- |
| [**`README.md`**](./Pruefung/README.md) | Leitfaden & Prüfungsarchitektur | CEFR-Bewertungsskala, Bestehensgrenzen (60%), Zeitmanagement & Strategien |
| [**`Goethe_A2_Modelltest.md`**](./Pruefung/Goethe_A2_Modelltest.md) | Kompletter Goethe-Zertifikat A2 Modelltest | **Lesen (Teil 1–4):** Zeitungsberichte, Kleinanzeigen, Schilder.<br>**Schreiben (Teil 1–2):** SMS/Kurznachricht & formelle Entschuldigung.<br>**Sprechen (Teil 1–3):** Fragen stellen, von sich erzählen, gemeinsam etwas aushandeln.<br>Inklusive offiziellem Lösungsschlüssel & Bewertungskriterien. |
| [**`A2_Einstufungstest.md`**](./Pruefung/A2_Einstufungstest.md) | Diagnostischer Einstufungstest | 40 strukturierte Multiple-Choice-Fragen zu Kasus, Wechselpräpositionen, Verben & Satzbau mit Punkteauswertung & Einstufungsempfehlung (A1.1 bis B1.1). |
| [**`A2_Kapiteltests.md`**](./Pruefung/A2_Kapiteltests.md) | Netzwerk A2 Kapitelprüfungen | Tests zu den Kapiteln 1 bis 12 mit Punkteverteilung und vollständigem Lösungsschlüssel. |
| [**`telc_Zertifikate_Guide.md`**](./Pruefung/telc_Zertifikate_Guide.md) | Der Große telc Prüfungs- & Zertifikats-Guide | Matrix aller telc Prüfungen (A1–C2, Beruf, Hochschule, Pflege/Medizin), Formate (Papier, DIGItelc 2.0), 60%-Bestehensgrenze & Teilwiederholungen. |
| [**`telc_Sprachbausteine_Masterclass.md`**](./Pruefung/telc_Sprachbausteine_Masterclass.md) | telc Sprachbausteine Masterclass (B1/B2) | Systematisches Training für Teil 1 & 2, die 5 Grammatik-/Lexik-Fallen und 3 vollständige Drills mit detaillierten Erklärungen. |
| [**`telc_DTZ_Einbuergerung_Guide.md`**](./Pruefung/telc_DTZ_Einbuergerung_Guide.md) | Deutsch-Test für Zuwanderer (DTZ A2·B1) | Gesetzliche Grundlagen (§ 10 StAG, Einbürgerung), skalierte Auswertung (Sprechen B1 Pflicht!), 4 Brieftypen & mündliche Dialog-Redemittel. |
| [**`telc_C1_Hochschule_Fachsprachen.md`**](./Pruefung/telc_C1_Hochschule_Fachsprachen.md) | C1 Hochschule & Medizin/Pflege Fachsprachen | Hochschulzugang (HRK/KMK anerkannt), wissenschaftliche Textsorten, Approbationsprüfung (Anamnese, Arztbrief, kollegiale Übergabe). |
| [**`telc_Wortschatz_A1_B1_Bilingual.md`**](./Pruefung/telc_Wortschatz_A1_B1_Bilingual.md) | telc Wortschatz A1–B1 & Verbenliste (Bilingual) | Bilinguale Wortschatzlisten nach *Auf jeden Fall!* & *Einfach gut!*, 50 A1-Verben mit Stammformen, 8 Themenfelder, feste B1 Funktionsverben. |
| [**`telc_B1_ZertifikatDeutsch_Modelltest.md`**](./Pruefung/telc_B1_ZertifikatDeutsch_Modelltest.md) | telc B1 Zertifikat Deutsch Modelltest | Vollständiger B1-Originaltest: Leseverstehen (Teil 1–3), Sprachbausteine (Teil 1 & 2), Briefschreiben, Mündliche Prüfung, Lösungsschlüssel. |
| [**`telc_B2_Beruf_Modelltest.md`**](./Pruefung/telc_B2_Beruf_Modelltest.md) | Deutsch-Test für den Beruf B2 (DTB B2) | Vollständiger BAMF-Berufstest (*Einfach besser! 400/500*): Betriebliche Rundschreiben, Reklamationsantworten, Verhandlung & Lösungen. |
| [**`telc_Pflege_Medizin_Fachpraxis.md`**](./Pruefung/telc_Pflege_Medizin_Fachpraxis.md) | telc Deutsch Pflege & Medizin Praxis | Aus offiziellen *Trainingseinheiten Pflege & Medizin*: Laien- vs. Fachsprache, 7-Stufen-Anamnese, ISBAR-Übergabeschema, Fachabkürzungen. |
| [**`telc_C1_Wissenschaftssprache_Studium.md`**](./Pruefung/telc_C1_Wissenschaftssprache_Studium.md) | telc C1 Wissenschaftssprache & Studium | Basierend auf *Einfach zum Studium! C1*: Akademische Konnektoren, Nominalstil, Grafik- & Diagrammbeschreibung, Seminardiskussionen. |
| [**`Lernfortschritt_telc_Curriculum.md`**](./Pruefung/Lernfortschritt_telc_Curriculum.md) | telc Lernfortschritt & Curriculum-Leitfaden | Der modulare Master-Fahrplan von A1 bis C1 mit direkten Downloadlinks zu allen offiziellen kostenlosen telc Materialien des Downloadbereichs. |

---

## ⚡ Der Master-Spickzettel: Genus, Kasus & Pronomen auf einen Blick

### Die 4 Fälle im Deutschen (Deklination der bestimmten Artikel)

| Fall | Frage | Maskulin | Feminin | Neutrum | Plural |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Nominativ** | *Wer / Was?* | **der** Tisch | **die** Lampe | **das** Buch | **die** Kinder |
| **Akkusativ** | *Wen / Was?* | **den** Tisch | **die** Lampe | **das** Buch | **die** Kinder |
| **Dativ** | *Wem?* | **dem** Tisch | **der** Lampe | **dem** Buch | **den** Kindern (+ n) |
| **Genitiv** | *Wessen?* | **des** Tisches (+ s) | **der** Lampe | **des** Buches (+ s) | **der** Kinder |

### Der Nomen-Pronomen-Austausch (Wie ersetze ich Nomen durch Pronomen?)

| Genus / Nomen | Nominativ (Subjekt) | Akkusativ (Direktes Objekt) | Dativ (Indirektes Objekt) |
| :--- | :---: | :---: | :---: |
| **Maskulin** (*der Tisch / der Kollege*) | **er** (*Er ist neu.*) | **ihn** (*Ich kaufe **ihn**.*) | **ihm** (*Ich helfe **ihm**.*) |
| **Feminin** (*die Lampe / die Kollegin*) | **sie** (*Sie ist schön.*) | **sie** (*Ich sehe **sie**.*) | **ihr** (*Ich antworte **ihr**.*) |
| **Neutrum** (*das Buch / das Kind*) | **es** (*Es ist spannend.*) | **es** (*Ich lese **es**.*) | **ihm** (*Ich gebe **ihm** den Apfel.*) |
| **Plural** (*die Bücher / die Kollegen*) | **sie** (*Sie sind da.*) | **sie** (*Ich besuche **sie**.*) | **ihnen** (*Ich danke **ihnen**.*) |

---

## 🎯 Der 15-Minuten-Erfolgsplan für Lernende

Als Sprachlehrer empfehle ich diese tägliche 15-Minuten-Routine:
1. **5 Minuten Grammatik:** Öffne das aktuelle Kapitel in [`Grammatik.md`](./A1/Grammatik.md) und lies die Universal-Triade laut vor.
2. **5 Minuten Satzbau & Fragen:** Wähle 3 Wörter und bilde damit 3 Aussagen und **3 Fragen** (nutze dazu die Fragesektionen „Wie frage ich danach?“).
3. **5 Minuten Praxis & Kultur:** Lerne entweder 2 Büroformulierungen aus [`berufliche_sprache/`](./berufliche_sprache/README.md) oder 1 bildhafte Redewendung aus [`Redewendungen/`](./Redewendungen/README.md).

