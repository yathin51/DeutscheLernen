# 02. IT, Softwareentwicklung & Tech

Willkommen im Fachmodul für die IT-Branche. Die Sprache in Tech-Unternehmen und agilen Entwicklungsteams im deutschsprachigen Raum ist eine faszinierende Mischung aus präzisem technischem Deutsch und etablierten englischen Fachbegriffen („Denglish“). Hier lernst du, wie Entwickler, DevOps, QA-Engineers und Product Owner professionell kommunizieren.

---

## 💻 Technischer Fachwortschatz (mit Genus & Plural)

| Nomen mit Artikel & Plural | Genus | Englische Bedeutung | Typischer Einsatz im Tech-Alltag |
| :--- | :--- | :--- | :--- |
| **der Fehler, - / der Bug, -s** | Maskulin | bug, error | *Der Fehler tritt nur in der mobilen Ansicht auf.* |
| **die Anforderung, -en** | Feminin | requirement | *Die Anforderung des Kunden ist noch nicht eindeutig definiert.* |
| **das Release, -s / die Veröffentlichung** | N / F | release, deployment | *Das Release ist für Donnerstagabend um 22 Uhr geplant.* |
| **der Server, -** | Maskulin | server | *Der Server antwortet nicht mehr auf Anfragen.* |
| **die Datenbank, -en** | Feminin | database | *Die Datenbank benötigt eine Indexoptimierung.* |
| **das Ticket, -s** | Neutrum | ticket, issue | *Bitte erstelle dafür ein separates Jira-Ticket.* |
| **der Quellcode, -s / der Code** | Maskulin | source code | *Der Quellcode muss gründlich überarbeitet werden.* |
| **die Schnittstelle, -n / die API, -s** | Feminin | interface, API | *Die Schnittstelle liefert Daten im JSON-Format.* |
| **das Repository, -s** | Neutrum | repository (Git) | *Ich habe die Änderungen in das Repository gepusht.* |
| **der Zweig, -e / der Branch, -es** | Maskulin | branch | *Wir arbeiten auf einem separaten Feature-Branch.* |
| **die Berechtigung, -en** | Feminin | permission, authorization | *Mir fehlen die nötigen Berechtigungen für den Cluster.* |
| **das Framework, -s** | Neutrum | framework | *Wir haben uns für ein modernes TypeScript-Framework entschieden.* |

---

## 🟢 Stufe 1: Onboarding, Setup & Daily Standup (Einstieg & Routine)

In agilen Teams (Scrum/Kanban) ist das tägliche Standup-Meeting der zentrale Dreh- und Angelpunkt.

### 1. Das tägliche Standup (Was habe ich gemacht? Was mache ich heute? Gibt es Blocker?)

#### 5 Standard-Beispielsätze (Aussagen):
1. **Gestern habe ich die Authentifizierung über OAuth2 fertiggestellt und die Komponententests geschrieben.**  
   *(Yesterday I finished the authentication via OAuth2 and wrote the component tests.)*
2. **Heute werde ich mich um die Behebung des Anzeigefehlers im Benutzer-Dashboard kümmern.**  
   *(Today I will take care of fixing the display bug in the user dashboard.)*
3. **Ich habe aktuell einen Blocker, weil mir noch die Zugangsdaten für die Testumgebung fehlen.**  
   *(I currently have a blocker because I am still missing the credentials for the staging environment.)*
4. **Ich richte gerade meine lokale Entwicklungsumgebung mit Docker neu ein.**  
   *(I am currently setting up my local development environment anew using Docker.)*
5. **Mein PR (Pull Request) ist fertiggestellt und wartet auf ein Review von einem Senior-Entwickler.**  
   *(My pull request is completed and waiting for a review from a senior developer.)*

#### ❓ Wie frage ich danach? (Standup- & Setup-Fragen):
- **Wer hat Zeit, sich heute Nachmittag mit mir kurz zusammenzusetzen und diesen Fehler zu analysieren?**  
  *(Who has time to sit down with me briefly this afternoon and analyze this bug?)*
- **Ist die Staging-Umgebung gerade stabil oder läuft dort aktuell ein Deployment?**  
  *(Is the staging environment stable right now or is a deployment currently running there?)*
- **Wo finde ich die Dokumentation für die lokale Docker-Konfiguration?**  
  *(Where can I find the documentation for the local Docker configuration?)*
- **Gibt es für diese Aufgabe bereits ein Akzeptanzkriterium im Ticket?**  
  *(Is there already an acceptance criterion in the ticket for this task?)*
- **Wirst du heute mit der Refaktorisierung der Datenbankabfrage fertig?**  
  *(Will you finish the refactoring of the database query today?)*

---

## 🟡 Stufe 2: Code Review, Bugfixing & Sprint-Planung (Mittlere Ebene)

Hier geht es um professionelle Diskussionen über Softwarequalität, Clean Code, Fehlersuche und Sprint-Ziele.

### 1. Code Reviews & Pull Requests konstruktiv kommentieren
Deutsche Entwickler schätzen sachliche, präzise und lösungsorientierte Kommentare.

#### 5 Standard-Beispielsätze (Aussagen):
1. **Ich habe deinen Pull Request gesichtet; die Logik ist sauber, aber wir sollten noch zwei Randfälle (Edge Cases) absichern.**  
   *(I reviewed your pull request; the logic is clean, but we should secure two edge cases.)*
2. **Könntest du diese Schleife bitte durch eine optimierte Map-Funktion ersetzen, um die Lesbarkeit zu erhöhen?**  
   *(Could you please replace this loop with an optimized map function to improve readability?)*
3. **An dieser Stelle besteht das Risiko einer NullPointerException, falls der Server keinen Wert zurückgibt.**  
   *(At this point there is a risk of a NullPointerException if the server returns no value.)*
4. **Wir sollten diese Geschäftslogik aus dem Controller in einen dedizierten Service auslagern.**  
   *(We should extract this business logic from the controller into a dedicated service.)*
5. **Die Unit-Tests decken den Fehlerfall noch nicht ab; bitte füge noch einen Test für ungültige Benutzereingaben hinzu.**  
   *(The unit tests do not cover the error case yet; please add a test for invalid user input.)*

#### ❓ Wie frage ich danach? (Code-Review-Fragen):
- **Gibt es einen bestimmten Grund, warum du an dieser Stelle synchrone Aufrufe statt Promises verwendet hast?**  
  *(Is there a specific reason why you used synchronous calls instead of promises here?)*
- **Wie verhält sich diese Funktion bei einer schlechten Internetverbindung des Nutzers?**  
  *(How does this function behave when the user has a poor internet connection?)*
- **Können wir diese wiederkehrende Hilfsfunktion in unsere gemeinsame Shared-Library verschieben?**  
  *(Can we move this recurring helper function into our shared library?)*
- **Hast du geprüft, ob diese Datenbankmigration abwärtskompatibel mit der alten Version ist?**  
  *(Did you check whether this database migration is backwards compatible with the old version?)*
- **Reicht dir diese Fehlermeldung im Frontend aus oder soll sie detaillierter sein?**  
  *(Is this error message in the frontend sufficient for you or should it be more detailed?)*

---

### 2. Bug Reporting & Fehlerdiagnose
Ein präziser Bug-Report spart dem Team Stunden an Fehlersuche.

#### 5 Standard-Beispielsätze (Aussagen):
1. **Der Fehler lässt sich reproduzieren, indem man auf den Abmelde-Button klickt, während ein Ladevorgang läuft.**  
   *(The bug can be reproduced by clicking the logout button while a loading process is active.)*
2. **Im Logfile auf dem Produktionsserver finden wir vermehrt Timeouts bei der Verbindung zum Bezahldienstleister.**  
   *(In the logfile on the production server we find increased timeouts connecting to the payment provider.)*
3. **Das Problem tritt ausschließlich im Safari-Browser auf iOS-Geräten auf.**  
   *(The problem occurs exclusively in the Safari browser on iOS devices.)*
4. **Der Memory Leak führt dazu, dass der Service nach ungefähr 24 Stunden Laufzeit abstürzt.**  
   *(The memory leak leads to the service crashing after approximately 24 hours of uptime.)*
5. **Ich habe einen temporären Hotfix erstellt, müssen aber zeitnah eine nachhaltige Lösung implementieren.**  
   *(I created a temporary hotfix, but we need to implement a sustainable solution promptly.)*

#### ❓ Wie frage ich danach? (Bug-Analyse-Fragen):
- **Welche Schritte sind exakt notwendig, um diesen Fehler auf der lokalen Maschine nachzustellen?**  
  *(What steps are strictly necessary to reproduce this bug on the local machine?)*
- **Seit welchem Commit oder welchem Release ist dieses fehlerhafte Verhalten erstmals aufgetreten?**  
  *(Since which commit or release did this erroneous behavior first appear?)*
- **Welche HTTP-Statuscodes gibt die API im Fehlerfall an das Frontend zurück?**  
  *(What HTTP status codes does the API return to the frontend in case of error?)*
- **Sind von diesem Ausfall alle Endnutzer betroffen oder nur neu registrierte Konten?**  
  *(Are all end users affected by this outage or only newly registered accounts?)*
- **Haben wir bereits ein Rollback auf die vorherige stabile Version erwogen?**  
  *(Have we already considered a rollback to the previous stable version?)*

---

## 🔴 Stufe 3: Softwarearchitektur, Cloud & Incident Management (Strategische Ebene)

In dieser Stufe geht es um Architekturentscheidungen, Skalierbarkeit, Cloud-Infrastruktur, SLAs und Ausfallsicherheit.

### 1. Architekturentscheidungen & Technische Schulden (Tech Debt)

#### 5 Standard-Beispielsätze (Aussagen):
1. **Wir müssen den monolithischen Kern schrittweise in lose gekoppelte Microservices zerlegen, um die Skalierbarkeit zu sichern.**  
   *(We must gradually decompose the monolithic core into loosely coupled microservices to ensure scalability.)*
2. **Die Anhäufung technischer Schulden verlangsamt unsere Feature-Entwicklung mittlerweile spürbar.**  
   *(The accumulation of technical debt is now noticeably slowing down our feature development.)*
3. **Aus Datenschutz- und DSGVO-Gründen dürfen die Server ausschließlich in Rechenzentren innerhalb der Europäischen Union gehostet werden.**  
   *(For data protection and GDPR reasons, the servers may only be hosted in data centers within the European Union.)*
4. **Wir führen ein ereignisgesteuertes System (Event-Driven Architecture) mit Apache Kafka ein, um Datenströme in Echtzeit zu verarbeiten.**  
   *(We are introducing an event-driven system with Apache Kafka to process data streams in real time.)*
5. **Unsere Verfügbarkeitsgarantie (SLA) von 99,9% erfordert eine automatisierte Multi-Region-Failover-Strategie.**  
   *(Our service level agreement of 99.9% availability requires an automated multi-region failover strategy.)*

#### ❓ Wie frage ich danach? (Architektur- & Strategiefragen):
- **Welche Kompromisse (Trade-offs) gehen wir bezüglich Konsistenz und Latenz ein, wenn wir auf eine NoSQL-Datenbank umstellen?**  
  *(What trade-offs regarding consistency and latency are we accepting if we migrate to a NoSQL database?)*
- **Wie hoch schätzt du den Aufwand für die Umstellung unserer Pipeline auf Kubernetes ein?**  
  *(How high do you estimate the effort for transitioning our pipeline to Kubernetes?)*
- **Welche Sicherheitsvorkehrungen treffen wir gegen Denial-of-Service-Angriffe (DDoS) auf der Netzwerkebene?**  
  *(What security precautions are we taking against denial-of-service attacks at the network layer?)*
- **Erfüllt diese Fremdbibliothek alle Lizenzanforderungen für unseren kommerziellen Vertrieb?**  
  *(Does this third-party library meet all licensing requirements for our commercial distribution?)*
- **Wann führen wir das nächste Disaster-Recovery-Audit für unsere Backups durch?**  
  *(When are we conducting the next disaster recovery audit for our backups?)*

---

## 📝 Praxis-Vorlage: Ein professionelles Jira-Ticket

```markdown
**Titel:** [BUG-402] Fehlerhafte Validierung der Postleitzahl im Checkout-Prozess

**Beschreibung:**
Beim Abschluss einer Bestellung schlägt die Validierung der Lieferadresse bei fünfstelligen deutschen Postleitzahlen fehl, die mit einer führenden Null beginnen (z. B. 01067 Dresden).

**Schritte zur Reproduktion:**
1. Einen beliebigen Artikel in den Warenkorb legen.
2. Zur Kasse gehen und eine Adresse mit PLZ "04109 Leipzig" eingeben.
3. Auf "Weiter zur Zahlung" klicken.

**Erwartetes Verhalten:**
Die Adresse wird als gültig erkannt und der Benutzer gelangt zur Zahlungsmethode.

**Tatsächliches Verhalten:**
Fehlermeldung: "Ungültiges Postleitzahlenformat" erscheint rot unter dem Eingabefeld.

**Priorität:** Hoch (Blockiert Kaufabschlüsse in den neuen Bundesländern)
**Betroffene Umgebung:** Production & Staging
```
