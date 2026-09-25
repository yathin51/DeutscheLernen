const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Sync A2/Arbeitsbuch.md
{
  const arbPath = path.join(rootDir, 'A2', 'Arbeitsbuch.md');
  let arb = fs.readFileSync(arbPath, 'utf8');

  const idx21 = arb.indexOf('## 📄 Seite 21:');
  const startIndex = arb.indexOf('### ✍️ Übung 4', idx21);
  const endIndex = arb.indexOf('<a id="seite-22">', idx21);

  if (idx21 === -1 || startIndex === -1 || endIndex === -1) {
    console.error('Could not find markers in Arbeitsbuch.md', { idx21, startIndex, endIndex });
    process.exit(1);
  }

  const replacementArb = `### ✍️ Übung 4
*Ergänzen Sie die Endungen.*
*Wortkasten:* \`em\` • \`en\` • \`er\` • \`ie\` • \`ir\` • \`m\` • \`s\`

- **a)** Was steht i_______ Brief?
- **b)** Der Hund sitzt unter d_______ Tisch.
- **c)** Sie trägt den Hund vor d_______ Tür.
- **d)** Paul möchte morgen auf_______ Land fahren.
- **e)** Setz dich bitte neben dein_______ Onkel!
- **f)** Maria sitzt zwischen Peter und m_______.
- **g)** Er will in ein_______ Monat nach Rom reisen.
- **h)** Wir wollten morgen in d_______ Berge fahren.
- **i)** Kannst du mir a_______ Wochenende helfen?
- **j)** Ich lebe nicht in d_______ Stadt, sondern auf dem Dorf.

### ✍️ Übung 5
*Ergänzen Sie den bestimmten Artikel im Dativ (Wo?) oder Akkusativ (Wohin?).*
*Wortkasten:* \`dem\` • \`den\` • \`der\` • \`die\` • \`ihrer\` • \`im\`

> 💡 **Beispiel:** Sie geht an die Kasse. (Wohin?) — Sie steht an der Kasse. (Wo?)

- **a)** Das Buch liegt auf _______ Schreibtisch.
- **b)** Stell den Wagen bitte vor _______ Garage!
- **c)** Meine Schwester lebt in _______ Schweiz.
- **d)** Maria sitzt auf _______ Sofa.
- **e)** Sandra geht schnell über _______ Straße.
- **f)** Eva sitzt zwischen mir und _______ Tante.
- **g)** Steck den Brief in _______ Tasche!
- **h)** Schreib die Adresse auf _______ Zettel!
- **i)** Ich gehe _______ Park spazieren. (!)
- **j)** Du läufst auf _______ Straße. (!)

### ✍️ Übung 6
*Bilden Sie Dialoge mit „schon“ und „erst“ sowie der passenden temporalen Präposition.*
*Wortkasten:* \`am Abend\` • \`am Dienstag\` • \`am Freitag\` • \`am Mittwoch\` • \`am Morgen\` • \`am Wochenende\` • \`im Juli\` • \`im Mai\` • \`im Sommer\` • \`im Winter\` • \`in der Nacht\` • \`in einem Monat\`

> 💡 **Beispiel:** Nachmittag — Berlin  
> *Fährst du schon am Abend nach Berlin? — Nein, erst am Vormittag.*

- **a)** Mai — Spanien: *Fährst du schon im Juni nach Spanien? — Nein, erst _______.*
- **b)** Dienstag — Köln: *Fährst du schon am Mittwoch nach Köln? — Nein, erst _______.*
- **c)** ein Monat — Ungarn: *Reist du schon nächste Woche nach Ungarn? — Nein, erst _______.*
- **d)** Abend — Stuttgart: *Fährst du schon am Nachmittag nach Stuttgart? — Nein, erst _______.*
- **e)** Wochenende — Frankfurt: *Fährst du schon am Donnerstag nach Frankfurt? — Nein, erst _______.*
- **f)** Winter — Griechenland: *Fährst du schon im Herbst nach Griechenland? — Nein, erst _______.*
- **g)** Freitag — Dortmund: *Fährst du schon am Donnerstag nach Dortmund? — Nein, erst _______.*
- **h)** Nacht — Nürnberg: *Fährst du schon am Abend nach Nürnberg? — Nein, erst _______.*
- **i)** Sommer — Schweiz: *Fährst du schon im Frühling in die Schweiz? — Nein, erst _______.*
- **j)** Morgen — Klaus: *Gehst du schon heute Abend zu Klaus? — Nein, erst _______.*
- **k)** Juli — Meer: *Fährst du schon im Juni ans Meer? — Nein, erst _______.*
- **l)** Mittwoch — Türkei: *Fliegst du schon am Montag in die Türkei? — Nein, erst _______.*

<details>
<summary><strong>👉 💡 Musterlösung & Grammatik-Tipps (Seite 21)</strong></summary>

> *Didaktische Lösungen für **5.2. Präpositionen mit Dativ und Akkusativ — Vertiefung & Übungen**:*

#### Übung 4
- **a)** \`m\` — *der Brief (m) ➔ Wo? Dativ: im Brief (i + m = im)*
- **b)** \`em\` — *der Tisch (m) ➔ Wo? Dativ: unter dem Tisch (d + em = dem)*
- **c)** \`ie\` — *die Tür (f) ➔ Wohin? Akkusativ: vor die Tür (d + ie = die)*
- **d)** \`s\` — *das Land (n) ➔ Wohin? Akkusativ: aufs Land (auf + s = aufs)*
- **e)** \`en\` — *dein Onkel (m) ➔ Wohin? Akkusativ: neben deinen Onkel (dein + en = deinen)*
- **f)** \`ir\` — *Personalpronomen ich ➔ Wo? Dativ: zwischen Peter und mir (m + ir = mir)*
- **g)** \`em\` — *ein Monat (m) ➔ Wann? Dativ: in einem Monat (ein + em = einem)*
- **h)** \`ie\` — *die Berge (Pl.) ➔ Wohin? Akkusativ: in die Berge (d + ie = die)*
- **i)** \`m\` — *das Wochenende (n) ➔ Wann? Dativ: am Wochenende (a + m = am)*
- **j)** \`er\` — *die Stadt (f) ➔ Wo? Dativ: in der Stadt (d + er = der)*

#### Übung 5
- **a)** \`dem\` — *der Schreibtisch (m) ➔ Wo? Dativ: auf dem Schreibtisch*
- **b)** \`die\` — *die Garage (f) ➔ Wohin? Akkusativ: vor die Garage*
- **c)** \`der\` — *die Schweiz (f) ➔ Wo? Dativ: in der Schweiz*
- **d)** \`dem\` — *das Sofa (n) ➔ Wo? Dativ: auf dem Sofa*
- **e)** \`die\` — *die Straße (f) ➔ Wohin? Akkusativ: über die Straße*
- **f)** \`ihrer\` — *ihre Tante (f) ➔ Wo? Dativ: zwischen mir und ihrer Tante*
- **g)** \`die\` — *die Tasche (f) ➔ Wohin? Akkusativ: in die Tasche*
- **h)** \`den\` — *der Zettel (m) ➔ Wohin? Akkusativ: auf den Zettel*
- **i)** \`im\` — *der Park (m) ➔ Wo? Dativ: im Park spazieren (innerhalb des Parks)*
- **j)** \`der\` — *die Straße (f) ➔ Wo? Dativ: auf der Straße laufen*

#### Übung 6
- **a)** \`im Mai\` — *Monat ➔ im Mai (nach Spanien)*
- **b)** \`am Dienstag\` — *Wochentag ➔ am Dienstag (nach Köln)*
- **c)** \`in einem Monat\` — *Zeitspanne ➔ in einem Monat (nach Ungarn)*
- **d)** \`am Abend\` — *Tageszeit ➔ am Abend (nach Stuttgart)*
- **e)** \`am Wochenende\` — *Wochenende ➔ am Wochenende (nach Frankfurt)*
- **f)** \`im Winter\` — *Jahreszeit ➔ im Winter (nach Griechenland)*
- **g)** \`am Freitag\` — *Wochentag ➔ am Freitag (nach Dortmund)*
- **h)** \`in der Nacht\` — *Nacht (feminin) ➔ in der Nacht (nach Nürnberg)*
- **i)** \`im Sommer\` — *Jahreszeit ➔ im Sommer (in die Schweiz)*
- **j)** \`am Morgen\` — *Tageszeit ➔ am Morgen (zu Klaus)*
- **k)** \`im Juli\` — *Monat ➔ im Juli (ans Meer)*
- **l)** \`am Mittwoch\` — *Wochentag ➔ am Mittwoch (in die Türkei)*

---
👉 **Interaktiv üben:** Öffne diese Seite im [**Arbeitsbuch-Studio (Seite 21)**](#workbooks:A2:21) mit automatischer Korrektur und Sofort-Feedback.

</details>

---

`;

  arb = arb.substring(0, startIndex) + replacementArb + arb.substring(endIndex);
  fs.writeFileSync(arbPath, arb, 'utf8');
  console.log('Successfully updated A2/Arbeitsbuch.md for Page 21');
}

// 2. Sync A2/Loesungsschluessel.md
{
  const loesPath = path.join(rootDir, 'A2', 'Loesungsschluessel.md');
  let loes = fs.readFileSync(loesPath, 'utf8');

  const startMarker = '<a id="seite-21"></a>';
  const endMarker = '<a id="seite-22"></a>';

  const startIndex = loes.indexOf(startMarker);
  const endIndex = loes.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find markers in Loesungsschluessel.md', { startIndex, endIndex });
    process.exit(1);
  }

  const replacementLoes = `<a id="seite-21"></a>
## 📄 Seite 21: 5.2. Präpositionen mit Dativ und Akkusativ — Vertiefung & Übungen (Seite 21)

> 👉 **Interaktives Studio:** [Diese Seite interaktiv im Arbeitsbuch lösen](#workbooks:A2:21)

### ✍️ Übung 4
*Ergänzen Sie die Endungen.*

- **a)** Was steht i**m** Brief?
  - 💡 **Lösung:** \`m\` — *der Brief (m) ➔ Wo? Dativ: im Brief (i + m = im)*
- **b)** Der Hund sitzt unter d**em** Tisch.
  - 💡 **Lösung:** \`em\` — *der Tisch (m) ➔ Wo? Dativ: unter dem Tisch (d + em = dem)*
- **c)** Sie trägt den Hund vor d**ie** Tür.
  - 💡 **Lösung:** \`ie\` — *die Tür (f) ➔ Wohin? Akkusativ: vor die Tür (d + ie = die)*
- **d)** Paul möchte morgen auf**s** Land fahren.
  - 💡 **Lösung:** \`s\` — *das Land (n) ➔ Wohin? Akkusativ: aufs Land (auf + s = aufs)*
- **e)** Setz dich bitte neben dein**en** Onkel!
  - 💡 **Lösung:** \`en\` — *dein Onkel (m) ➔ Wohin? Akkusativ: neben deinen Onkel (dein + en = deinen)*
- **f)** Maria sitzt zwischen Peter und m**ir**.
  - 💡 **Lösung:** \`ir\` — *Personalpronomen ich ➔ Wo? Dativ: zwischen Peter und mir (m + ir = mir)*
- **g)** Er will in ein**em** Monat nach Rom reisen.
  - 💡 **Lösung:** \`em\` — *ein Monat (m) ➔ Wann? Dativ: in einem Monat (ein + em = einem)*
- **h)** Wir wollten morgen in d**ie** Berge fahren.
  - 💡 **Lösung:** \`ie\` — *die Berge (Pl.) ➔ Wohin? Akkusativ: in die Berge (d + ie = die)*
- **i)** Kannst du mir a**m** Wochenende helfen?
  - 💡 **Lösung:** \`m\` — *das Wochenende (n) ➔ Wann? Dativ: am Wochenende (a + m = am)*
- **j)** Ich lebe nicht in d**er** Stadt, sondern auf dem Dorf.
  - 💡 **Lösung:** \`er\` — *die Stadt (f) ➔ Wo? Dativ: in der Stadt (d + er = der)*

### ✍️ Übung 5
> 💡 **Beispiel:** Sie geht an die Kasse. (Wohin?) — Sie steht an der Kasse. (Wo?)

- **a)** Das Buch liegt auf **dem** Schreibtisch.
  - 💡 **Lösung:** \`dem\` — *der Schreibtisch (m) ➔ Wo? Dativ: auf dem Schreibtisch*
- **b)** Stell den Wagen bitte vor **die** Garage!
  - 💡 **Lösung:** \`die\` — *die Garage (f) ➔ Wohin? Akkusativ: vor die Garage*
- **c)** Meine Schwester lebt in **der** Schweiz.
  - 💡 **Lösung:** \`der\` — *die Schweiz (f) ➔ Wo? Dativ: in der Schweiz*
- **d)** Maria sitzt auf **dem** Sofa.
  - 💡 **Lösung:** \`dem\` — *das Sofa (n) ➔ Wo? Dativ: auf dem Sofa*
- **e)** Sandra geht schnell über **die** Straße.
  - 💡 **Lösung:** \`die\` — *die Straße (f) ➔ Wohin? Akkusativ: über die Straße*
- **f)** Eva sitzt zwischen mir und **ihrer** Tante.
  - 💡 **Lösung:** \`ihrer\` — *ihre Tante (f) ➔ Wo? Dativ: zwischen mir und ihrer Tante*
- **g)** Steck den Brief in **die** Tasche!
  - 💡 **Lösung:** \`die\` — *die Tasche (f) ➔ Wohin? Akkusativ: in die Tasche*
- **h)** Schreib die Adresse auf **den** Zettel!
  - 💡 **Lösung:** \`den\` — *der Zettel (m) ➔ Wohin? Akkusativ: auf den Zettel*
- **i)** Ich gehe **im** Park spazieren.
  - 💡 **Lösung:** \`im\` — *der Park (m) ➔ Wo? Dativ: im Park spazieren (innerhalb des Parks)*
- **j)** Du läufst auf **der** Straße.
  - 💡 **Lösung:** \`der\` — *die Straße (f) ➔ Wo? Dativ: auf der Straße laufen*

### ✍️ Übung 6
> 💡 **Beispiel:** Nachmittag — Berlin: Fährst du schon am Abend nach Berlin? — Nein, erst am Vormittag.

- **a)** Mai — Spanien: Fährst du schon im Juni nach Spanien? — Nein, erst **im Mai**.
  - 💡 **Lösung:** \`im Mai\` — *Monat ➔ im Mai (nach Spanien)*
- **b)** Dienstag — Köln: Fährst du schon am Mittwoch nach Köln? — Nein, erst **am Dienstag**.
  - 💡 **Lösung:** \`am Dienstag\` — *Wochentag ➔ am Dienstag (nach Köln)*
- **c)** ein Monat — Ungarn: Reist du schon nächste Woche nach Ungarn? — Nein, erst **in einem Monat**.
  - 💡 **Lösung:** \`in einem Monat\` — *Zeitspanne ➔ in einem Monat (nach Ungarn)*
- **d)** Abend — Stuttgart: Fährst du schon am Nachmittag nach Stuttgart? — Nein, erst **am Abend**.
  - 💡 **Lösung:** \`am Abend\` — *Tageszeit ➔ am Abend (nach Stuttgart)*
- **e)** Wochenende — Frankfurt: Fährst du schon am Donnerstag nach Frankfurt? — Nein, erst **am Wochenende**.
  - 💡 **Lösung:** \`am Wochenende\` — *Wochenende ➔ am Wochenende (nach Frankfurt)*
- **f)** Winter — Griechenland: Fährst du schon im Herbst nach Griechenland? — Nein, erst **im Winter**.
  - 💡 **Lösung:** \`im Winter\` — *Jahreszeit ➔ im Winter (nach Griechenland)*
- **g)** Freitag — Dortmund: Fährst du schon am Donnerstag nach Dortmund? — Nein, erst **am Freitag**.
  - 💡 **Lösung:** \`am Freitag\` — *Wochentag ➔ am Freitag (nach Dortmund)*
- **h)** Nacht — Nürnberg: Fährst du schon am Abend nach Nürnberg? — Nein, erst **in der Nacht**.
  - 💡 **Lösung:** \`in der Nacht\` — *Nacht (feminin) ➔ in der Nacht (nach Nürnberg)*
- **i)** Sommer — Schweiz: Fährst du schon im Frühling in die Schweiz? — Nein, erst **im Sommer**.
  - 💡 **Lösung:** \`im Sommer\` — *Jahreszeit ➔ im Sommer (in die Schweiz)*
- **j)** Morgen — Klaus: Gehst du schon heute Abend zu Klaus? — Nein, erst **am Morgen**.
  - 💡 **Lösung:** \`am Morgen\` — *Tageszeit ➔ am Morgen (zu Klaus)*
- **k)** Juli — Meer: Fährst du schon im Juni ans Meer? — Nein, erst **im Juli**.
  - 💡 **Lösung:** \`im Juli\` — *Monat ➔ im Juli (ans Meer)*
- **l)** Mittwoch — Türkei: Fliegst du schon am Montag in die Türkei? — Nein, erst **am Mittwoch**.
  - 💡 **Lösung:** \`am Mittwoch\` — *Wochentag ➔ am Mittwoch (in die Türkei)*

---

`;

  loes = loes.substring(0, startIndex) + replacementLoes + loes.substring(endIndex);
  fs.writeFileSync(loesPath, loes, 'utf8');
  console.log('Successfully updated A2/Loesungsschluessel.md for Page 21');
}
