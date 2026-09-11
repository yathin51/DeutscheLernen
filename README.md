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

### 🧭 Die Drei Großen Lernpfade

Das System ist in drei komplementäre Hauptbereiche gegliedert:

```
                            ┌──────────────────────────────┐
                            │        DeutscheLernen        │
                            └──────────────┬───────────────┘
                                           │
             ┌─────────────────────────────┼─────────────────────────────┐
             ▼                             ▼                             ▼
  ┌───────────────────────┐    ┌───────────────────────┐    ┌───────────────────────┐
  │  PFAD A: CEFR (A1-C2) │    │ PFAD B: BERUFSSPRACHE │    │ PFAD C: REDEWENDUNGEN │
  │ Systematischer Aufbau │    │ Intensiver Praxiskurs │    │ Idiome, Sprichwörter, │
  │ Grammatik & Wortschatz│    │ für Büro & Jobsektoren│    │ Kultur & Redensarten  │
  └───────────────────────┘    └───────────────────────┘    └───────────────────────┘
```

---

## 🎓 Pfad A: Der Akademische Sprachpfad (CEFR A1 – C2)

Jeder Stufenordner ist konsequent auf **zwei Kernsäulen** konsolidiert (Schluss mit Datei-Chaos!):
1. **`Grammatik.md`**: Der vollständige Leitfaden mit der **Universal-Triade (`der / die / das`)**, Nomen-Pronomen-Austausch, mindestens 5 ausführlichen Beispielsätzen pro Thema und **eigenen Fragesektionen** („Wie frage ich danach?“).
2. **`Vocabulary.md`**: Der thematisch geordnete Wortschatz mit Genus, Plural und 5–6 nicht-wiederholten Pronomen-Beispielsätzen pro Wort.

| Stufe | Niveau & Kernkompetenz | Wichtigste Grammatikthemen | Schnellzugriff |
| :---: | :--- | :--- | :---: |
| **A1** | **Anfänger (Beginner)** | Genusregeln (*der/die/das*), Nominativ vs. Akkusativ, Personal- & Possessivpronomen, Präsens, Modalverben, DOGFU-Präpositionen, Satzklammer (Verb auf Pos. 2). | [📖 Grammatik](./A1/Grammatik.md) \| [🗂️ Wortschatz](./A1/Vocabulary.md) \| [📌 Leitfaden](./A1/README.md) |
| **A2** | **Grundstufe (Elementary)** | Der Dativ (*Wem-Fall*), Dativpronomen & Reflexivpronomen, 9 Wechselpräpositionen (Wo? vs. Wohin?), Perfekt & Präteritum, Nebensätze (*weil, dass, wenn*). | [📖 Grammatik](./A2/Grammatik.md) \| [🗂️ Wortschatz](./A2/Vocabulary.md) \| [📌 Leitfaden](./A2/README.md) |
| **B1** | **Mittelstufe (Intermediate)** | Der Genitiv (*Wessen-Fall*), Relativsätze, Vorgangspassiv (*werden + Partizip II*), Konjunktiv II der Gegenwart, Infinitiv mit *zu / um... zu*, TeKaMoLo. | [📖 Grammatik](./B1/Grammatik.md) \| [🗂️ Wortschatz](./B1/Vocabulary.md) \| [📌 Leitfaden](./B1/README.md) |
| **B2** | **Selbstständig (Upper-Interm.)**| Nominalstil vs. Verbalstil (Transformation), 4 Passiversatzformen (*sich lassen, sein + zu*), Funktionsverbgefüge (FVG), erweiterte Partizipien, Futur II. | [📖 Grammatik](./B2/Grammatik.md) \| [🗂️ Wortschatz](./B2/Vocabulary.md) \| [📌 Leitfaden](./B2/README.md) |
| **C1** | **Fachkundig (Advanced)** | Konjunktiv I (Indirekte Rede), epistemische/subjektive Modalverben (*muss, dürfte, will, soll*), Gerundivum (*zu + Partizip I*), gehobene Syntaxkonnektoren. | [📖 Grammatik](./C1/Grammatik.md) \| [🗂️ Wortschatz](./C1/Vocabulary.md) \| [📌 Leitfaden](./C1/README.md) |
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

