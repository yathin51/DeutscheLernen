const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Sync A2/Arbeitsbuch.md
{
  const arbPath = path.join(rootDir, 'A2', 'Arbeitsbuch.md');
  let arb = fs.readFileSync(arbPath, 'utf8');

  const idx22 = arb.indexOf('<a id="seite-22">');
  const idx23 = arb.indexOf('<a id="seite-23">', idx22);

  if (idx22 === -1 || idx23 === -1) {
    console.error('Could not find Page 22/23 markers in Arbeitsbuch.md', { idx22, idx23 });
    process.exit(1);
  }

  const replacementArb = `<a id="seite-22"></a>
## 📄 Seite 22: 5.3. Ähnliche Verben / Positions- & Richtungsverben

> [!NOTE]
> **📌 Grammatik-Fokus dieser Lektion:**
>
> • **Aktion vs. Position:**
> • **Aktionsverb:** wohin? (+ Akkusativ) — schwaches Verb: *stellen, legen, setzen, hängen, stecken*
> • **Positionsverb:** wo? (+ Dativ) — starkes/unregelmäßiges Verb: *stehen, liegen, sitzen, hängen, stecken*
> • *stellen / stehen:* Ich stelle die Flasche auf den Tisch. / Die Flasche steht auf dem Tisch.
> • *legen / liegen:* Ich lege den Wein in den Kühlschrank. / Der Wein liegt im Kühlschrank.
> • *setzen / sitzen:* Ich setze den Hund in den Korb. / Der Hund sitzt im Korb.
> • *hängen / hängen:* Ich hänge den Mantel in die Garderobe. / Der Mantel hängt in der Garderobe.
> • *stecken / stecken:* Ich stecke den Brief ins Kuvert. / Der Brief steckt im Kuvert.

### ✍️ Übung 1: stellen vs. stehen (Wohin? + Akk. vs. Wo? + Dat.)
*Ergänzen Sie die passende Form von „stellen“ (Aktion) oder „stehen“ (Position).*
*Wortkasten:* \`stehe\` • \`stehen\` • \`steht\` • \`stelle\` • \`stellen\` • \`stellst\` • \`stellt\`

> 💡 **Beispiel:** Max — in — Krankenhaus ➔ Max liegt im Krankenhaus.

- **a)** Ich — Glas — auf — Tisch: *Ich _______ das Glas auf den Tisch.*
- **b)** Glas — neben — Flasche: *Das Glas _______ neben der Flasche.*
- **c)** Du — Auto — vor — Garage: *Du _______ das Auto vor die Garage.*
- **d)** Paul — vor — Tür: *Paul _______ vor der Tür.*
- **e)** Viele Leute — an — Kinokasse: *Viele Leute _______ an der Kinokasse.*
- **f)** Maria — Roller — vor — Haus: *Maria _______ den Roller vor das Haus.*
- **g)** Wir — an — Bushaltestelle: *Wir _______ an der Bushaltestelle.*
- **h)** Er — zwischen — seine Eltern: *Er _______ zwischen seinen Eltern.*

### ✍️ Übung 2: legen vs. liegen (Wohin? + Akk. vs. Wo? + Dat.)
*Ergänzen Sie die passende Form von „legen“ (Aktion) oder „liegen“ (Position).*
*Wortkasten:* \`lege\` • \`legen\` • \`legst\` • \`legt\` • \`liege\` • \`liegen\` • \`liegt\`

- **a)** Brief — auf — Schreibtisch: *Der Brief _______ auf dem Schreibtisch.*
- **b)** Julia — auf — Sofa: *Julia _______ auf dem Sofa.*
- **c)** Maria — Buch — in — Regal: *Maria _______ das Buch ins Regal.*
- **d)** Er — Pass — neben — Ticket: *Er _______ den Pass neben das Ticket.*
- **e)** Sie — Hut — in — Schrank: *Sie _______ den Hut in den Schrank.*
- **f)** Ich — in — Bett: *Ich _______ noch im Bett.*
- **g)** Du — Mappe — auf — Tisch: *Du _______ die Mappe auf den Tisch.*
- **h)** Zeitungen — auf — Boden: *Die Zeitungen _______ auf dem Boden.*

### ✍️ Übung 3: setzen (sich) vs. sitzen (Wohin? + Akk. vs. Wo? + Dat.)
*Ergänzen Sie die passende Form von „setzen“ (Aktion) oder „sitzen“ (Position).*
*Wortkasten:* \`setze\` • \`setzen\` • \`setzt\` • \`sitze\` • \`sitzen\` • \`sitzt\`

- **a)** Ich — an — Fenster: *Ich _______ gern am Fenster.*
- **b)** Julia — Kind — auf — Bett: *Julia _______ das Kind auf das Bett.*
- **c)** Du — Katze — auf — Sofa: *Du _______ die Katze auf das Sofa.*
- **d)** Wir — in — Bus: *Wir _______ zusammen im Bus.*
- **e)** Paul — sein Sohn — in — Auto: *Paul _______ seinen Sohn ins Auto.*
- **f)** Ich — zwischen — Onkel — Tante: *Ich _______ zwischen Onkel und Tante.*
- **g)** Eva — Brille — auf — Nase: *Eva _______ die Brille auf die Nase.*
- **h)** Du — vor — Fernseher: *Du _______ den ganzen Tag vor dem Fernseher.*

### ✍️ Übung 4: hängen & stecken (Aktionsverb vs. Positionsverb)
*Ergänzen Sie die passende Form von „hängen“ oder „stecken“ im Präsens.*
*Wortkasten:* \`hänge\` • \`hängen\` • \`hängt\` • \`stecke\` • \`stecken\` • \`steckt\`

- **a)** Apfel — an — Baum (hängen): *Der Apfel _______ noch am Baum.*
- **b)** Ich — Uhr — an — Wand (hängen): *Ich _______ die neue Uhr an die Wand.*
- **c)** Maria — Poster — an — Tür (hängen): *Maria _______ das Poster an die Tür.*
- **d)** Handtuch — neben — Badewanne (hängen): *Das Handtuch _______ neben der Badewanne.*
- **e)** Paul — Hose — in — Schrank (hängen): *Paul _______ seine Hose in den Schrank.*
- **f)** Schlüssel — in — Schloss (stecken): *Der Schlüssel _______ im Schloss.*
- **g)** Er — Geld — in — Tasche (stecken): *Er _______ das Geld in die Tasche.*
- **h)** Füße — in — Schuhe (stecken): *Die Füße _______ in warmen Schuhen.*
- **i)** Ich — Foto — zwischen — Briefe (stecken): *Ich _______ das Foto zwischen die Briefe.*
- **j)** Zettel — hinter — Spiegel (stecken): *Der Zettel _______ hinter dem Spiegel.*

<details>
<summary><strong>👉 💡 Musterlösung & Grammatik-Tipps (Seite 22)</strong></summary>

> *Didaktische Lösungen für **5.3. Ähnliche Verben / Positions- & Richtungsverben**:*

#### Übung 1: stellen vs. stehen
- **a)** \`stelle\` — *Aktion (Wohin? + Akk.) ➔ ich stelle das Glas auf den Tisch*
- **b)** \`steht\` — *Position (Wo? + Dat.) ➔ das Glas steht neben der Flasche*
- **c)** \`stellst\` — *Aktion (Wohin? + Akk.) ➔ du stellst das Auto vor die Garage*
- **d)** \`steht\` — *Position (Wo? + Dat.) ➔ Paul steht vor der Tür*
- **e)** \`stehen\` — *Position (Wo? + Dat., Plural) ➔ viele Leute stehen an der Kinokasse*
- **f)** \`stellt\` — *Aktion (Wohin? + Akk.) ➔ Maria stellt den Roller vor das Haus*
- **g)** \`stehen\` — *Position (Wo? + Dat., 1. Plural) ➔ wir stehen an der Bushaltestelle*
- **h)** \`steht\` — *Position (Wo? + Dat.) ➔ er steht zwischen seinen Eltern*

#### Übung 2: legen vs. liegen
- **a)** \`liegt\` — *Position (Wo? + Dat.) ➔ der Brief liegt auf dem Schreibtisch*
- **b)** \`liegt\` — *Position (Wo? + Dat.) ➔ Julia liegt auf dem Sofa*
- **c)** \`legt\` — *Aktion (Wohin? + Akk.) ➔ Maria legt das Buch ins Regal*
- **d)** \`legt\` — *Aktion (Wohin? + Akk.) ➔ er legt den Pass neben das Ticket*
- **e)** \`legt\` — *Aktion (Wohin? + Akk.) ➔ sie legt den Hut in den Schrank*
- **f)** \`liege\` — *Position (Wo? + Dat.) ➔ ich liege im Bett*
- **g)** \`legst\` — *Aktion (Wohin? + Akk.) ➔ du legst die Mappe auf den Tisch*
- **h)** \`liegen\` — *Position (Wo? + Dat., Plural) ➔ die Zeitungen liegen auf dem Boden*

#### Übung 3: setzen (sich) vs. sitzen
- **a)** \`sitze\` — *Position (Wo? + Dat.) ➔ ich sitze am Fenster*
- **b)** \`setzt\` — *Aktion (Wohin? + Akk.) ➔ Julia setzt das Kind auf das Bett*
- **c)** \`setzt\` — *Aktion (Wohin? + Akk.) ➔ du setzt die Katze auf das Sofa*
- **d)** \`sitzen\` — *Position (Wo? + Dat., Plural) ➔ wir sitzen im Bus*
- **e)** \`setzt\` — *Aktion (Wohin? + Akk.) ➔ Paul setzt seinen Sohn ins Auto*
- **f)** \`sitze\` — *Position (Wo? + Dat.) ➔ ich sitze zwischen Onkel und Tante*
- **g)** \`setzt\` — *Aktion (Wohin? + Akk.) ➔ Eva setzt die Brille auf die Nase*
- **h)** \`sitzt\` — *Position (Wo? + Dat.) ➔ du sitzt vor dem Fernseher*

#### Übung 4: hängen & stecken
- **a)** \`hängt\` — *Position (Wo? + Dat.) ➔ der Apfel hängt am Baum*
- **b)** \`hänge\` — *Aktion (Wohin? + Akk.) ➔ ich hänge die Uhr an die Wand*
- **c)** \`hängt\` — *Aktion (Wohin? + Akk.) ➔ Maria hängt das Poster an die Tür*
- **d)** \`hängt\` — *Position (Wo? + Dat.) ➔ das Handtuch hängt neben der Badewanne*
- **e)** \`hängt\` — *Aktion (Wohin? + Akk.) ➔ Paul hängt die Hose in den Schrank*
- **f)** \`steckt\` — *Position (Wo? + Dat.) ➔ der Schlüssel steckt im Schloss*
- **g)** \`steckt\` — *Aktion (Wohin? + Akk.) ➔ er steckt das Geld in die Tasche*
- **h)** \`stecken\` — *Position (Wo? + Dat., Plural) ➔ die Füße stecken in warmen Schuhen*
- **i)** \`stecke\` — *Aktion (Wohin? + Akk.) ➔ ich stecke das Foto zwischen die Briefe*
- **j)** \`steckt\` — *Position (Wo? + Dat.) ➔ der Zettel steckt hinter dem Spiegel*

---
👉 **Interaktiv üben:** Öffne diese Seite im [**Arbeitsbuch-Studio (Seite 22)**](#workbooks:A2:22) mit automatischer Korrektur und Sofort-Feedback.

</details>

---

`;

  arb = arb.substring(0, idx22) + replacementArb + arb.substring(idx23);
  fs.writeFileSync(arbPath, arb, 'utf8');
  console.log('Successfully updated A2/Arbeitsbuch.md for Page 22');
}

// 2. Sync A2/Loesungsschluessel.md
{
  const loesPath = path.join(rootDir, 'A2', 'Loesungsschluessel.md');
  let loes = fs.readFileSync(loesPath, 'utf8');

  const idx22 = loes.indexOf('<a id="seite-22">');
  const idx23 = loes.indexOf('<a id="seite-23">', idx22);

  if (idx22 === -1 || idx23 === -1) {
    console.error('Could not find Page 22/23 markers in Loesungsschluessel.md', { idx22, idx23 });
    process.exit(1);
  }

  const replacementLoes = `<a id="seite-22"></a>
## 📄 Seite 22: 5.3. Ähnliche Verben / Positions- & Richtungsverben (Seite 22)

> 👉 **Interaktives Studio:** [Diese Seite interaktiv im Arbeitsbuch lösen](#workbooks:A2:22)

### ✍️ Übung 1: stellen vs. stehen (Wohin? + Akk. vs. Wo? + Dat.)
- **a)** Ich — Glas — auf — Tisch: Ich **stelle** das Glas auf den Tisch.
  - 💡 **Lösung:** \`stelle\` — *Aktion (Wohin? + Akk.) ➔ ich stelle das Glas auf den Tisch*
- **b)** Glas — neben — Flasche: Das Glas **steht** neben der Flasche.
  - 💡 **Lösung:** \`steht\` — *Position (Wo? + Dat.) ➔ das Glas steht neben der Flasche*
- **c)** Du — Auto — vor — Garage: Du **stellst** das Auto vor die Garage.
  - 💡 **Lösung:** \`stellst\` — *Aktion (Wohin? + Akk.) ➔ du stellst das Auto vor die Garage*
- **d)** Paul — vor — Tür: Paul **steht** vor der Tür.
  - 💡 **Lösung:** \`steht\` — *Position (Wo? + Dat.) ➔ Paul steht vor der Tür*
- **e)** Viele Leute — an — Kinokasse: Viele Leute **stehen** an der Kinokasse.
  - 💡 **Lösung:** \`stehen\` — *Position (Wo? + Dat., Plural) ➔ viele Leute stehen an der Kinokasse*
- **f)** Maria — Roller — vor — Haus: Maria **stellt** den Roller vor das Haus.
  - 💡 **Lösung:** \`stellt\` — *Aktion (Wohin? + Akk.) ➔ Maria stellt den Roller vor das Haus*
- **g)** Wir — an — Bushaltestelle: Wir **stehen** an der Bushaltestelle.
  - 💡 **Lösung:** \`stehen\` — *Position (Wo? + Dat., 1. Plural) ➔ wir stehen an der Bushaltestelle*
- **h)** Er — zwischen — seine Eltern: Er **steht** zwischen seinen Eltern.
  - 💡 **Lösung:** \`steht\` — *Position (Wo? + Dat.) ➔ er steht zwischen seinen Eltern*

### ✍️ Übung 2: legen vs. liegen (Wohin? + Akk. vs. Wo? + Dat.)
- **a)** Brief — auf — Schreibtisch: Der Brief **liegt** auf dem Schreibtisch.
  - 💡 **Lösung:** \`liegt\` — *Position (Wo? + Dat.) ➔ der Brief liegt auf dem Schreibtisch*
- **b)** Julia — auf — Sofa: Julia **liegt** auf dem Sofa.
  - 💡 **Lösung:** \`liegt\` — *Position (Wo? + Dat.) ➔ Julia liegt auf dem Sofa*
- **c)** Maria — Buch — in — Regal: Maria **legt** das Buch ins Regal.
  - 💡 **Lösung:** \`legt\` — *Aktion (Wohin? + Akk.) ➔ Maria legt das Buch ins Regal*
- **d)** Er — Pass — neben — Ticket: Er **legt** den Pass neben das Ticket.
  - 💡 **Lösung:** \`legt\` — *Aktion (Wohin? + Akk.) ➔ er legt den Pass neben das Ticket*
- **e)** Sie — Hut — in — Schrank: Sie **legt** den Hut in den Schrank.
  - 💡 **Lösung:** \`legt\` — *Aktion (Wohin? + Akk.) ➔ sie legt den Hut in den Schrank*
- **f)** Ich — in — Bett: Ich **liege** noch im Bett.
  - 💡 **Lösung:** \`liege\` — *Position (Wo? + Dat.) ➔ ich liege im Bett*
- **g)** Du — Mappe — auf — Tisch: Du **legst** die Mappe auf den Tisch.
  - 💡 **Lösung:** \`legst\` — *Aktion (Wohin? + Akk.) ➔ du legst die Mappe auf den Tisch*
- **h)** Zeitungen — auf — Boden: Die Zeitungen **liegen** auf dem Boden.
  - 💡 **Lösung:** \`liegen\` — *Position (Wo? + Dat., Plural) ➔ die Zeitungen liegen auf dem Boden*

### ✍️ Übung 3: setzen (sich) vs. sitzen (Wohin? + Akk. vs. Wo? + Dat.)
- **a)** Ich — an — Fenster: Ich **sitze** gern am Fenster.
  - 💡 **Lösung:** \`sitze\` — *Position (Wo? + Dat.) ➔ ich sitze am Fenster*
- **b)** Julia — Kind — auf — Bett: Julia **setzt** das Kind auf das Bett.
  - 💡 **Lösung:** \`setzt\` — *Aktion (Wohin? + Akk.) ➔ Julia setzt das Kind auf das Bett*
- **c)** Du — Katze — auf — Sofa: Du **setzt** die Katze auf das Sofa.
  - 💡 **Lösung:** \`setzt\` — *Aktion (Wohin? + Akk.) ➔ du setzt die Katze auf das Sofa*
- **d)** Wir — in — Bus: Wir **sitzen** zusammen im Bus.
  - 💡 **Lösung:** \`sitzen\` — *Position (Wo? + Dat., Plural) ➔ wir sitzen im Bus*
- **e)** Paul — sein Sohn — in — Auto: Paul **setzt** seinen Sohn ins Auto.
  - 💡 **Lösung:** \`setzt\` — *Aktion (Wohin? + Akk.) ➔ Paul setzt seinen Sohn ins Auto*
- **f)** Ich — zwischen — Onkel — Tante: Ich **sitze** zwischen Onkel und Tante.
  - 💡 **Lösung:** \`sitze\` — *Position (Wo? + Dat.) ➔ ich sitze zwischen Onkel und Tante*
- **g)** Eva — Brille — auf — Nase: Eva **setzt** die Brille auf die Nase.
  - 💡 **Lösung:** \`setzt\` — *Aktion (Wohin? + Akk.) ➔ Eva setzt die Brille auf die Nase*
- **h)** Du — vor — Fernseher: Du **sitzt** den ganzen Tag vor dem Fernseher.
  - 💡 **Lösung:** \`sitzt\` — *Position (Wo? + Dat.) ➔ du sitzt vor dem Fernseher*

### ✍️ Übung 4: hängen & stecken (Aktionsverb vs. Positionsverb)
- **a)** Apfel — an — Baum (hängen): Der Apfel **hängt** noch am Baum.
  - 💡 **Lösung:** \`hängt\` — *Position (Wo? + Dat.) ➔ der Apfel hängt am Baum*
- **b)** Ich — Uhr — an — Wand (hängen): Ich **hänge** die neue Uhr an die Wand.
  - 💡 **Lösung:** \`hänge\` — *Aktion (Wohin? + Akk.) ➔ ich hänge die Uhr an die Wand*
- **c)** Maria — Poster — an — Tür (hängen): Maria **hängt** das Poster an die Tür.
  - 💡 **Lösung:** \`hängt\` — *Aktion (Wohin? + Akk.) ➔ Maria hängt das Poster an die Tür*
- **d)** Handtuch — neben — Badewanne (hängen): Das Handtuch **hängt** neben der Badewanne.
  - 💡 **Lösung:** \`hängt\` — *Position (Wo? + Dat.) ➔ das Handtuch hängt neben der Badewanne*
- **e)** Paul — Hose — in — Schrank (hängen): Paul **hängt** seine Hose in den Schrank.
  - 💡 **Lösung:** \`hängt\` — *Aktion (Wohin? + Akk.) ➔ Paul hängt die Hose in den Schrank*
- **f)** Schlüssel — in — Schloss (stecken): Der Schlüssel **steckt** im Schloss.
  - 💡 **Lösung:** \`steckt\` — *Position (Wo? + Dat.) ➔ der Schlüssel steckt im Schloss*
- **g)** Er — Geld — in — Tasche (stecken): Er **steckt** das Geld in die Tasche.
  - 💡 **Lösung:** \`steckt\` — *Aktion (Wohin? + Akk.) ➔ er steckt das Geld in die Tasche*
- **h)** Füße — in — Schuhe (stecken): Die Füße **stecken** in warmen Schuhen.
  - 💡 **Lösung:** \`stecken\` — *Position (Wo? + Dat., Plural) ➔ die Füße stecken in Schuhen*
- **i)** Ich — Foto — zwischen — Briefe (stecken): Ich **stecke** das Foto zwischen die Briefe.
  - 💡 **Lösung:** \`stecke\` — *Aktion (Wohin? + Akk.) ➔ ich stecke das Foto zwischen die Briefe*
- **j)** Zettel — hinter — Spiegel (stecken): Der Zettel **steckt** hinter dem Spiegel.
  - 💡 **Lösung:** \`steckt\` — *Position (Wo? + Dat.) ➔ der Zettel steckt hinter dem Spiegel*

---

`;

  loes = loes.substring(0, idx22) + replacementLoes + loes.substring(idx23);
  fs.writeFileSync(loesPath, loes, 'utf8');
  console.log('Successfully updated A2/Loesungsschluessel.md for Page 22');
}
