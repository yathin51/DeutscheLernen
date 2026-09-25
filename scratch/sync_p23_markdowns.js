const fs = require('fs');
const path = require('path');

// 1. Update A2/Arbeitsbuch.md
const arbPath = path.join(__dirname, '../A2/Arbeitsbuch.md');
let arbContent = fs.readFileSync(arbPath, 'utf8');

const arbTargetStart = '<a id="seite-23"></a>';
const arbTargetEnd = '<a id="seite-24"></a>';

const arbStartIndex = arbContent.indexOf(arbTargetStart);
const arbEndIndex = arbContent.indexOf(arbTargetEnd);

if (arbStartIndex === -1 || arbEndIndex === -1) {
  console.error('Could not find anchor bounds in Arbeitsbuch.md');
  process.exit(1);
}

const newArbSection = `<a id="seite-23"></a>
## 📄 Seite 23: 6.1. Präteritum (Imperfekt) — Regelmäßige & trennbare Verben

> [!NOTE]
> **📌 Grammatik-Fokus dieser Lektion:**
>
> • **6.1. Präteritum (Imperfekt) — Regelmäßige schwache Verben:**
>   - Stamm + Endung: *ich -te, du -test, er/sie/es -te, wir -ten, ihr -tet, sie/Sie -ten*.
>   - Phonetic \`-et-\`: Dentalstämme auf *-t, -d* oder Konsonantenhäufung (*-chn, -ffn, -gn*) erhalten ein Bindungs-e: *antworten ➔ antwortete, mieten ➔ mietete, öffnen ➔ öffnete*.
>   - Verben auf *-eln, -ern, -igen, -ieren* sind ausnahmslos schwach: *ändern ➔ änderte, reparieren ➔ reparierte, besichtigen ➔ besichtigte*.
> • **Trennbare Verben im Präteritum (Satzklammer):**
>   - Konjugierter Präteritumstamm an Position 2, trennbares Präfix wandert an das Satzende!
>   - Beispiel: *aufräumen ➔ Du räumtest gestern den Keller auf.*

### ✍️ Übung 1: Regelmäßige Verben im Präteritum
*Antworten Sie im Präteritum mit „gestern“. Achten Sie auf die richtige Personalform und das Pronomen (z. B. du ➔ ich, ihr ➔ wir).*

> 💡 **Beispiel:** Wann kauft Max den Wagen? ➔ *Er **kaufte** ihn gestern.*

- **a)** Wann fragt Theo die Lehrerin? ➔ Theo [___] sie gestern. *(fragte)*
- **b)** Wann holst du die Tickets? ➔ Ich [___] sie gestern. *(holte)*
- **c)** Wann kündigt Yasmin den Vertrag? ➔ Yasmin [___] ihn gestern. *(kündigte)*
- **d)** Wann repariert Murat das Fahrrad? ➔ Murat [___] es gestern. *(reparierte)*
- **e)** Wann liefert man die Maschinen? ➔ Man [___] sie gestern. *(lieferte)*
- **f)** Wann putzt du die Fenster? ➔ Ich [___] sie gestern. *(putzte)*
- **g)** Wann ändert Julia den PIN-Code? ➔ Julia [___] ihn gestern. *(änderte)*
- **h)** Wann reservierst du den Tisch? ➔ Ich [___] ihn gestern. *(reservierte)*
- **i)** Wann lernt ihr die starken Verben? ➔ Wir [___] sie gestern. *(lernten)*
- **j)** Wann besuchst du Paul? ➔ Ich [___] ihn gestern. *(besuchte)*
- **k)** Wann bucht ihr die Reise? ➔ Wir [___] sie gestern. *(buchten)*
- **l)** Wann wechselt Lena das Geld? ➔ Lena [___] es gestern. *(wechselte)*
- **m)** Wann besichtigt ihr die Burg? ➔ Wir [___] sie gestern. *(besichtigten)*
- **n)** Wann mietest du das Auto? ➔ Ich [___] es gestern. *(mietete)*
- **o)** Wann gratulierst du deinem Großvater? ➔ Ich [___] ihm gestern. *(gratulierte)*
- **p)** Wann antwortet ihr der Kollegin? ➔ Wir [___] ihr gestern. *(antworteten)*
- **q)** Wann entschuldigst du dich? ➔ Ich [___] mich gestern. *(entschuldigte)*
- **r)** Wann informiert ihr euch? ➔ Wir [___] uns gestern. *(informierten)*

### ✍️ Übung 2: Trennbare Verben im Präteritum
*Bilden Sie einen vollständigen Hauptsatz im Präteritum. Setzen Sie den Präteritumstamm an Position 2 und das trennbare Präfix an das Satzende.*

> 💡 **Beispiel:** ich — im Supermarkt — einkaufen ➔ *Ich **kaufte** im Supermarkt **ein**.*

- **a)** du — den Keller — aufräumen ➔ Du [___] gestern den Keller auf. *(räumtest)*
- **b)** ich — die Pakete — abholen ➔ Ich [___] gestern die Pakete ab. *(holte)*
- **c)** Max — die Tür — zumachen ➔ Max [___] leise die Tür zu. *(machte)*
- **d)** du — das Angebot — ablehnen ➔ Du [___] das Angebot höflich ab. *(lehntest)*
- **e)** ihr — den Kredit — zurückzahlen ➔ Ihr [___] den Kredit pünktlich zurück. *(zahltet)*
- **f)** wir — das Formular — ausfüllen ➔ Wir [___] das Formular sorgfältig aus. *(füllten)*
- **g)** ihr — das Gerät — ausschalten ➔ Ihr [___] das Gerät rechtzeitig aus. *(schaltetet)*
- **h)** wir — alle Fenster — zumachen ➔ Wir [___] am Abend alle Fenster zu. *(machten)*
- **i)** ich — die richtige Antwort — ankreuzen ➔ Ich [___] die richtige Antwort an. *(kreuzte)*
- **j)** Jana — den Koffer — auspacken ➔ Jana [___] nach der Reise den Koffer aus. *(packte)*
- **k)** du — eine Kerze — anzünden ➔ Du [___] am Abend eine Kerze an. *(zündetest)*
- **l)** Paul — den Termin — absagen ➔ Paul [___] den wichtigen Termin ab. *(sagte)*

<details>
<summary><strong>👉 💡 Musterlösung & Grammatik-Tipps (Seite 23)</strong></summary>

> *Didaktische Lösungen für **6.1. Präteritum (Imperfekt) — Regelmäßige & trennbare Verben**:*

#### Übung 1: Regelmäßige Verben
- **a)** \`fragte\` — *er fragte*
- **b)** \`holte\` — *ich holte*
- **c)** \`kündigte\` — *sie kündigte*
- **d)** \`reparierte\` — *er reparierte*
- **e)** \`lieferte\` — *man lieferte*
- **f)** \`putzte\` — *ich putzte*
- **g)** \`änderte\` — *sie änderte*
- **h)** \`reservierte\` — *ich reservierte*
- **i)** \`lernten\` — *wir lernten*
- **j)** \`besuchte\` — *ich besuchte*
- **k)** \`buchten\` — *wir buchten*
- **l)** \`wechselte\` — *sie wechselte*
- **m)** \`besichtigten\` — *wir besichtigten*
- **n)** \`mietete\` — *Dentalstamm: ich mietete*
- **o)** \`gratulierte\` — *ich gratulierte*
- **p)** \`antworteten\` — *Dentalstamm: wir antworteten*
- **q)** \`entschuldigte\` — *ich entschuldigte mich*
- **r)** \`informierten\` — *wir informierten uns*

#### Übung 2: Trennbare Verben
- **a)** \`räumtest\` — *du räumtest (... auf)*
- **b)** \`holte\` — *ich holte (... ab)*
- **c)** \`machte\` — *Max machte (... zu)*
- **d)** \`lehntest\` — *du lehntest (... ab)*
- **e)** \`zahltet\` — *ihr zahltet (... zurück)*
- **f)** \`füllten\` — *wir füllten (... aus)*
- **g)** \`schaltetet\` — *Dentalstamm: ihr schaltetet (... aus)*
- **h)** \`machten\` — *wir machten (... zu)*
- **i)** \`kreuzte\` — *ich kreuzte (... an)*
- **j)** \`packte\` — *Jana packte (... aus)*
- **k)** \`zündetest\` — *Dentalstamm: du zündetest (... an)*
- **l)** \`sagte\` — *Paul sagte (... ab)*

---
👉 **Interaktiv üben:** Öffne diese Seite im [**Arbeitsbuch-Studio (Seite 23)**](#workbooks:A2:23) mit automatischer Korrektur und Sofort-Feedback.

</details>

---

`;

arbContent = arbContent.slice(0, arbStartIndex) + newArbSection + arbContent.slice(arbEndIndex);
fs.writeFileSync(arbPath, arbContent, 'utf8');
console.log('Arbeitsbuch.md updated for Page 23.');

// 2. Update A2/Loesungsschluessel.md
const loesPath = path.join(__dirname, '../A2/Loesungsschluessel.md');
let loesContent = fs.readFileSync(loesPath, 'utf8');

const loesTargetStart = '<a id="seite-23"></a>';
const loesTargetEnd = '<a id="seite-24"></a>';

const loesStartIndex = loesContent.indexOf(loesTargetStart);
const loesEndIndex = loesContent.indexOf(loesTargetEnd);

if (loesStartIndex === -1 || loesEndIndex === -1) {
  console.error('Could not find anchor bounds in Loesungsschluessel.md');
  process.exit(1);
}

const newLoesSection = `<a id="seite-23"></a>
## 📄 Seite 23: 6.1. Präteritum (Imperfekt) — Regelmäßige & trennbare Verben

> 👉 **Interaktives Studio:** [Diese Seite interaktiv im Arbeitsbuch lösen](#workbooks:A2:23)

### ✍️ Übung 1: Regelmäßige Verben im Präteritum
> 💡 **Beispiel:** Wann kauft Max den Wagen? ➔ *Er **kaufte** ihn gestern.*

- **a)** Wann fragt Theo die Lehrerin? ➔ Theo **fragte** sie gestern.
  - 💡 **Lösung:** \`fragte\` — *Präteritum: er fragte*
- **b)** Wann holst du die Tickets? ➔ Ich **holte** sie gestern.
  - 💡 **Lösung:** \`holte\` — *Präteritum: ich holte*
- **c)** Wann kündigt Yasmin den Vertrag? ➔ Yasmin **kündigte** ihn gestern.
  - 💡 **Lösung:** \`kündigte\` — *Präteritum: sie kündigte*
- **d)** Wann repariert Murat das Fahrrad? ➔ Murat **reparierte** es gestern.
  - 💡 **Lösung:** \`reparierte\` — *Verben auf -ieren sind regelmäßig: er reparierte*
- **e)** Wann liefert man die Maschinen? ➔ Man **lieferte** sie gestern.
  - 💡 **Lösung:** \`lieferte\` — *Verben auf -ern: man lieferte*
- **f)** Wann putzt du die Fenster? ➔ Ich **putzte** sie gestern.
  - 💡 **Lösung:** \`putzte\` — *Präteritum: ich putzte*
- **g)** Wann ändert Julia den PIN-Code? ➔ Julia **änderte** ihn gestern.
  - 💡 **Lösung:** \`änderte\` — *Verben auf -ern: sie änderte*
- **h)** Wann reservierst du den Tisch? ➔ Ich **reservierte** ihn gestern.
  - 💡 **Lösung:** \`reservierte\` — *Verben auf -ieren: ich reservierte*
- **i)** Wann lernt ihr die starken Verben? ➔ Wir **lernten** sie gestern.
  - 💡 **Lösung:** \`lernten\` — *Präteritum: wir lernten*
- **j)** Wann besuchst du Paul? ➔ Ich **besuchte** ihn gestern.
  - 💡 **Lösung:** \`besuchte\` — *Präteritum: ich besuchte*
- **k)** Wann bucht ihr die Reise? ➔ Wir **buchten** sie gestern.
  - 💡 **Lösung:** \`buchten\` — *Präteritum: wir buchten*
- **l)** Wann wechselt Lena das Geld? ➔ Lena **wechselte** es gestern.
  - 💡 **Lösung:** \`wechselte\` — *Verben auf -eln: sie wechselte*
- **m)** Wann besichtigt ihr die Burg? ➔ Wir **besichtigten** sie gestern.
  - 💡 **Lösung:** \`besichtigten\` — *Verben auf -igen: wir besichtigten*
- **n)** Wann mietest du das Auto? ➔ Ich **mietete** es gestern.
  - 💡 **Lösung:** \`mietete\` — *Dentalstamm (-t): ich mietete mit Bindungs-e*
- **o)** Wann gratulierst du deinem Großvater? ➔ Ich **gratulierte** ihm gestern.
  - 💡 **Lösung:** \`gratulierte\` — *Verben auf -ieren: ich gratulierte*
- **p)** Wann antwortet ihr der Kollegin? ➔ Wir **antworteten** ihr gestern.
  - 💡 **Lösung:** \`antworteten\` — *Dentalstamm (-t): wir antworteten mit Bindungs-e*
- **q)** Wann entschuldigst du dich? ➔ Ich **entschuldigte** mich gestern.
  - 💡 **Lösung:** \`entschuldigte\` — *Verben auf -igen: ich entschuldigte mich*
- **r)** Wann informiert ihr euch? ➔ Wir **informierten** uns gestern.
  - 💡 **Lösung:** \`informierten\` — *Verben auf -ieren: wir informierten uns*

### ✍️ Übung 2: Trennbare Verben im Präteritum
> 💡 **Beispiel:** ich — im Supermarkt — einkaufen ➔ *Ich **kaufte** im Supermarkt **ein**.*

- **a)** du — den Keller — aufräumen ➔ Du **räumtest** gestern den Keller auf.
  - 💡 **Lösung:** \`räumtest\` — *du räumtest (... auf)*
- **b)** ich — die Pakete — abholen ➔ Ich **holte** gestern die Pakete ab.
  - 💡 **Lösung:** \`holte\` — *ich holte (... ab)*
- **c)** Max — die Tür — zumachen ➔ Max **machte** leise die Tür zu.
  - 💡 **Lösung:** \`machte\` — *Max machte (... zu)*
- **d)** du — das Angebot — ablehnen ➔ Du **lehntest** das Angebot höflich ab.
  - 💡 **Lösung:** \`lehntest\` — *du lehntest (... ab)*
- **e)** ihr — den Kredit — zurückzahlen ➔ Ihr **zahltet** den Kredit pünktlich zurück.
  - 💡 **Lösung:** \`zahltet\` — *ihr zahltet (... zurück)*
- **f)** wir — das Formular — ausfüllen ➔ Wir **füllten** das Formular sorgfältig aus.
  - 💡 **Lösung:** \`füllten\` — *wir füllten (... aus)*
- **g)** ihr — das Gerät — ausschalten ➔ Ihr **schaltetet** das Gerät rechtzeitig aus.
  - 💡 **Lösung:** \`schaltetet\` — *Dentalstamm (-t): ihr schaltetet (... aus)*
- **h)** wir — alle Fenster — zumachen ➔ Wir **machten** am Abend alle Fenster zu.
  - 💡 **Lösung:** \`machten\` — *wir machten (... zu)*
- **i)** ich — die richtige Antwort — ankreuzen ➔ Ich **kreuzte** die richtige Antwort an.
  - 💡 **Lösung:** \`kreuzte\` — *ich kreuzte (... an)*
- **j)** Jana — den Koffer — auspacken ➔ Jana **packte** nach der Reise den Koffer aus.
  - 💡 **Lösung:** \`packte\` — *Jana packte (... aus)*
- **k)** du — eine Kerze — anzünden ➔ Du **zündetest** am Abend eine Kerze an.
  - 💡 **Lösung:** \`zündetest\` — *Dentalstamm (-d): du zündetest (... an)*
- **l)** Paul — den Termin — absagen ➔ Paul **sagte** den wichtigen Termin ab.
  - 💡 **Lösung:** \`sagte\` — *Paul sagte (... ab)*

---

`;

loesContent = loesContent.slice(0, loesStartIndex) + newLoesSection + loesContent.slice(loesEndIndex);
fs.writeFileSync(loesPath, loesContent, 'utf8');
console.log('Loesungsschluessel.md updated for Page 23.');
