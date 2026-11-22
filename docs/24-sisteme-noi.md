# 24. Partea a doua: sistemele noi

> **Un singur joc (18 noiembrie 2026).** "Bubu și Leo" a fost scos. Tot ce e specificat aici se implementeaza **doar in "Cea mai grea luptă"**. Unde scrie "ambele jocuri", "primul joc", variante `L:` sau teste pentru `bubu`, se citeste: un singur joc, textele lui (varianta `L:`), un singur rand de teste. Nu se mai scrie cod pentru primul joc.

Status: **specificatie, neimplementata.** Vezi `23-update-partea-a-doua.md` pentru cerere, hotarari si cele 32 de sarcini, si `../prompts/06-prompt-partea-a-doua.md` pentru promptul fiecareia.

Sapte sisteme. Fiecare are: cerinta, ce e acum in cod, ce se face, valorile din `CONFIG`, cazurile de margine si testul.

| Nr | Sistem | Sarcina | Jocuri |
|---|---|---|---|
| S1 | Butoane si taste | T2 | ambele |
| S2 | Fuga (L3) | T2 | ambele |
| S3 | A doua putere | T3 | doar "Cea mai grea luptă" |
| S4 | Cele 10 secunde | T4 | ambele |
| S5 | Capitole, meniu de start, salvare | T5, **facuta** | ambele |
| S6 | Scrisul de sus | T1, **facuta** | ambele |
| S7 | Stilul grafic | T6 | nivelurile 7 - 12 si eroii celui de-al doilea joc |

---

## S1. Butoane si taste - **facuta (T2, 18 noiembrie 2026)**

Butoanele si tastele sunt acum in joc. Descrierea lor, la timpul prezent: `07-control.md` (butoanele, campurile din `Input.slots`, tastele noi), `03-config.md` (`keys[k].c`, `keys[k].r`), `12-desen-si-hud.md` (`iconO`, `iconL3`, `richText`), `13-ecrane-si-meniuri.md` (pagina "Alege tastele"). Hotararile: `16-decizii.md`. Testul: `tests/control-nou.js`.

---

## S2. Fuga - **facuta (T2, 18 noiembrie 2026)**

Fuga e acum in joc. Descrierea ei, la timpul prezent: `10-gameplay.md`, "Fuga" (pornire si oprire, viteza, pasii de coliziune, camera, cum arata si cum suna, tutorialul), `03-config.md` (`sprint`), `06-sunet.md` (`dash`, cuvantul `run`), `12-desen-si-hud.md` (`drawRunTrail`). Hotararile: `16-decizii.md`. Ce n-a putut fi verificat: `19-limitari.md`. Testul: `tests/fuga.js`.

Ce s-a facut altfel decat scria in specificatie:

- Pasii de coliziune au marimea in `CONFIG.sprint.step` (12), nu scrisa in cod.
- `Snd.play` a primit un al patrulea argument (volumul), ca pasii din fuga sa fie mai incet fara un sunet nou.
- Iconita L3 din tutorial sta deasupra numelui eroului si deasupra lui ✕ (la 220 - 260 de unitati), altfel se suprapunea peste ele.
- Fuga se opreste si cand eroul incarca o aruncare (era in specificatie) si cand nivelul e terminat.

---

## S3. A doua putere - **facuta (T3, 19 noiembrie 2026)**

Cele doua puteri sunt acum in joc. Descrierea lor, la timpul prezent: `10-gameplay.md`, "Update 19 noiembrie 2026 (T3)" (abilitatile, oasele, manusile, regulile comune, tutorialul), `03-config.md` (`power`, `power2`, blocurile `spin` si `throw`), `21-cea-mai-grea-lupta.md` (ce au eroii acum), `06-sunet.md` (`bone`, `tock`, `gloves`, cuvintele `power2`), `12-desen-si-hud.md` (`drawBone`, `drawGlove`, `drawGloveRing`, particulele noi). Hotararile: `16-decizii.md`. Ce n-a putut fi verificat: `19-limitari.md`. Testul: `tests/puteri-doi.js`.

Ce s-a facut altfel decat scria in specificatie:

- Etapa 1 (refactorizarea) si etapa 2 (puterile noi) sunt intr-o singura schimbare, nu doua. Dovada ca refactorizarea nu a stricat nimic e aceeasi: toate testele vechi trec, cu aceleasi numere; in trei dintre ele s-au schimbat doar numele campurilor (`P.ball` -> `h.homeState`).
- `P.ball` a disparut cu totul: fiecare erou are `h.home` (lucrul tinut la indemana), `h.homeState` si `h.throwCd`.
- Indiciul □ din tutorial apare si pe nivelul 1, nu doar pe nivelul 7: nivelurile 7 - 12 nu exista inca.
- `osc` din `03-audio.js` a primit optiunea `trem` (nota care tremura), pentru sunetul oaselor.
- Osul de acasa sta pe umarul lui Boon, cum cerea specificatia, si dispare cat timp oasele sunt plecate.

---

## S4. Cele 10 secunde - **facuta (T4, 19 noiembrie 2026)**

Regula e acum in joc. Descrierea ei, la timpul prezent: `10-gameplay.md`, "Update 19 noiembrie 2026 (T4)" (numaratoarea, ce se vede, reincepere, plasa de siguranta, cazurile speciale), `03-config.md` (`CONFIG.rescue`), `13-ecrane-si-meniuri.md` (ecranul "Încă o dată!"), `14-bucla-principala.md` (starea `retry`, `Game.failLevel`), `12-desen-si-hud.md` (inelul, cifra, lumina de pe margini), `06-sunet.md` (`tick`, `retry`, cuvantul `hurry`). Hotararile: `16-decizii.md`. Ce n-a putut fi verificat: `19-limitari.md`. Testul: `tests/zece-secunde.js`.

Ce s-a facut altfel decat scria in specificatie:

- Cartonasul are 900 x 470, nu 900 x 360: la 360 eroii acopereau scrisul.
- Margelele stinse raman desenate in crem, cu un contur subtire. Daca dispar de tot, copiii nu mai vad cate au fost.
- Bannerul din banda scrie tasta prietenului cand el joaca pe tastatura, in loc de ○.
- Rezultatul salvat al unui capitol are si `tries` (cate reinceperi), cum cerea punctul 7 din specificatie. Ecranul de capitole nu il arata inca.
- Portile care se deschid cat un erou e jos (punctul 9) sunt pentru nivelurile 7 - 12 si vin cu T6.

---

## S5. Capitole, meniul de start, salvarea

**Implementat pe 18 noiembrie 2026 (sarcina T5).** Descrierea a fost mutata in `13-ecrane-si-meniuri.md`, sectiunea "Update 18 noiembrie 2026: capitole", si in `14-bucla-principala.md`. Hotararile luate pe drum sunt in `16-decizii.md`. Ce ramane pentru alte sarcini:

- `results[i].tries` (de cate ori s-a reluat un nivel) se adauga in sarcina T4, impreuna cu cele 10 secunde.
- Sala Tronului intra in `chapters()` in sarcina T11. Nivelurile Partii a doua intra singure, cand creste `CONFIG.lupta.levels`.
- Textele `retry.*` si `ban.help`, scrise in tabelul vechi al acestei sectiuni, tin de sarcina T4. Sunt in S4.

---

## S6. Scrisul de sus nu mai acopera eroii

**Implementat pe 18 noiembrie 2026 (sarcina T1).** Descrierea a fost mutata in `12-desen-si-hud.md` (banda de sus) si in `10-gameplay.md` (camera). Hotararile luate pe drum sunt in `16-decizii.md`, iar ce nu s-a putut verifica in `19-limitari.md`. Ce s-a facut altfel decat scrie mai jos:

- Bannerul de lupta sta tot in cardul din mijloc (16 - 104), nu in dreptunghiul 16 - 124 din tabel: altfel ar fi acoperit bara de progres, adica inimile paznicului, exact in timpul luptei.
- Bara de progres e la 105 - 131, nu 108 - 128: semnele de etapa au raza 13, deci ies cu 3 unitati in sus si in jos fata de linie.
- `camTarget` are doua limite in plus fata de formula de mai jos: eroul de sus nu intra sub banda (limita tare) si, cand incape, eroul de jos ramane cu picioarele pe ecran. Formula din tabel singura lasa un erou sub banda cand eroii sunt departe pe verticala si zoom-ul e la minim.

**Cerinta:** "scrisul de sus vine peste joc si de multe ori nu se vad personajele - de rezolvat acest bug."

### Ce se intampla acum (masurat)

`drawHUD` (`src/08-draw.js`) deseneaza, peste lume:

| Element | Dreptunghi pe ecran (x0, y0, x1, y1) |
|---|---|
| Insigna eroului 1 | 36, 28, 376, 140 |
| Insigna eroului 2 | 1544, 28, 1884, 140 |
| Cartonasul din mijloc (cristale, stele, luna) | 630, 24, 1290, 144 |
| Bara de progres | 440, 152, 1480, 218 |
| Bannerul ("Mai multe!", "La cuib!", "Curcubeu!") | 630, 250, 1290, 362, timp de 4 - 5 s |
| Bannerul de lupta ("Provocare!" + numele paznicului) | 480, 244, 1440, 420 |

Deci sus, in mijloc, sunt acoperiti mereu 218 pixeli din 1080. Cand apare un banner, pana la 420.

Camera pune mijlocul dintre eroi in mijlocul ecranului (`ty = (a.y + b.y) / 2 - 30`). Un erou are cam 190 de unitati cu tot cu nume. Cand eroii stau impreuna, picioarele lor sunt la y = 570 pe ecran, iar numele la 380. Bannerul de lupta coboara pana la 420.

Masuratoare din 16 noiembrie 2026 (`tests/hud-acoperire.js`, aceleasi numere in ambele jocuri). Procentul de asezari in care macar un erou e acoperit:

| Cum stau eroii | Nivel | De HUD | De un banner | De bannerul de lupta |
|---|---|---|---|---|
| Impreuna (fiecare celula libera) | 1, 2, 3, 4, 6 | 6.5 - 6.7% | 12.0 - 12.2% | 48.8 - 50.2% |
| Impreuna | 5 (cu stanca) | 0% | 2.2% | 43.4% |
| Departe unul de altul (400 de perechi la intamplare) | 1, 2, 3, 4, 6 | 36 - 47% | 24 - 26% | 38 - 44% |
| Departe | 5 | 24.5% | 24.8% | 39% |

Cand eroii stau impreuna, bannerul de lupta acopera unul din ei in jumatate din locuri, exact cand incepe lupta. Cand sunt departe unul de altul, cel de sus ajunge sub HUD in peste o treime din asezari. Asta e bug-ul.

### Solutia: trei schimbari

**1. HUD mai subtire.** Totul intr-o banda de sus de cel mult 132 de pixeli (`HUD_TOP = 132`, constanta noua in `08-draw.js`).

| Element | Dreptunghi nou | Ce se schimba |
|---|---|---|
| Insigna eroului 1 | 28, 16, 328, 104 | Portret de 68 in loc de 90. Numele la marimea 36. Dificultatea sub nume, marimea 22. |
| Insigna eroului 2 | 1592, 16, 1892, 104 | La fel. |
| Cartonasul din mijloc | 640, 16, 1280, 104 | Cristalul si numarul la marimea 52. Cele sapte culori sub numar raman, mai mici (raza 6). Stelele la raza 24. Luna-ceas ramane. |
| Bara de progres | 500, 108, 1420, 128 | O singura linie groasa de 12, cu semnele de etapa (raza 13) si punctul echipei (raza 11). Fara cartonas in spate: doar o umbra moale sub linie. Numarul "× 12" din stanga si procentul din dreapta raman, la marimea 22. |

La boss, golurile (`bh` cercuri) intra in cartonasul din mijloc, la raza 20.

**2. Bannerele intra in banda de sus.** Un banner nu mai e un cartonas separat sub HUD. Cat timp e activ, **ia locul** continutului cartonasului din mijloc: cartonasul se lateste (la 880 pentru un rand, la 1000 pentru bannerul de lupta), isi schimba culoarea in `#FFF6E2` si arata textul. Dupa ce trece, revine.

- Un rand: marimea 46, culoarea `#C4573D`, cu iconitele de acum (sageata, cuibul, cristalele).
- Bannerul de lupta: doua randuri, 40 si 26, in aceeasi inaltime (16 - 124).
- Intrarea si iesirea: cartonasul "respira" (scara 1.06 -> 1 in 0.2 s). Nu coboara peste lume.
- `ban.wait` ("Îl așteptăm pe Leo în cuib!") se deseneaza acum deasupra cuibului, in lume. Se muta si el in banda de sus, ca banner, cat timp conditia e adevarata.
- Mesajul de ajutor (`ban.help`, S4) apare tot aici.

**3. Camera tine eroii sub banda.** Zona in care trebuie sa incapa eroii nu mai e tot ecranul, ci ecranul fara banda de sus.

Regula camerei se muta din `updatePlay` intr-o functie fara efecte, `camTarget(L, a, b)`, care intoarce `{ x, y, zoom }` pentru doi eroi. `updatePlay` o cheama si merge lin spre rezultat, ca acum. Functia se adauga la `window.__game`, ca testul sa masoare exact regula jocului.

```js
const SAFE = HUD_TOP + 20;                                   // nothing of a hero may be drawn above this line
let tz = Math.min(1, W / (Math.abs(a.x - b2.x) + 760), (H - SAFE) / (Math.abs(a.y - b2.y) + 560)); tz = clamp(tz, L.minZoom, 1);
...
const vw = W / cam.zoom, vh = H / cam.zoom, up = SAFE / 2 / cam.zoom;
const ty = clamp((a.y + b2.y) / 2 - 30 - up, vh / 2 - SAFE / cam.zoom, L.H - vh / 2);
```

Doua lucruri noi aici:

- Mijlocul dintre eroi e tinut in mijlocul zonei libere (mai jos cu `SAFE / 2` pixeli de ecran).
- Camera are voie sa urce **deasupra** marginii de sus a lumii cu `SAFE` pixeli de ecran. Altfel, cand eroii sunt la marginea de sus a nivelului, camera s-ar opri si ei ar ramane sub banda. In fasia aceea nu exista pictura. `drawWorld` o umple inainte de a desena nivelul, cu culoarea de sus a cerului (`L.skyTop`, o valoare noua pe care `paintLevel` o pune pe nivel: culoarea primului rand de pixeli al picturii).

La boss (`minZoom: 1`, lume de 1920 x 1080, pamantul incepe la y = 480) camera nu se misca. Eroii nu pot urca deasupra lui 480, deci nu ajung sub banda. Acolo nu se schimba nimic.

### Alte texte din lume

Raman in lume, pentru ca sunt legate de un loc si sunt mici: "Acum!" si "Încă nu!" de deasupra paznicului (`drawDuelTop`), numele eroilor, cifra numaratorii. Regula pentru ele: nu se deseneaza niciodata peste dreptunghiul unui erou. `drawDuelTop` muta textul deasupra capului paznicului cu inca 40 de unitati daca un erou e in drum.

### Test: `tests/hud-acoperire.js`

Testul exista deja in depozit (masoara starea de acum si scrie tabelul de mai sus). Dupa schimbare trebuie sa scrie **0%** in toate cele trei coloane, pentru fiecare nivel, in ambele jocuri, in doua feluri de asezare:

1. Amandoi eroii in aceeasi celula, pentru fiecare celula libera.
2. 400 de perechi de celule alese la intamplare pe nivel (eroi departe unul de altul).

Testul citeste din joc `HUD_TOP` si `camTarget` (amandoua se adauga la `window.__game`). Cand le gaseste, socoteste acoperit orice erou care ajunge, cu orice parte a lui, deasupra liniei `HUD_TOP`. Se ruleaza cu `STRICT=1` si se adauga in `tests/toate.sh`.

Plus capturi privite cu ochiul: inceputul unei lupte cu eroii in mijlocul ecranului, eroii la marginea de sus a nivelului 1, eroii la colturi opuse.

---

## S7. Stilul grafic: "diorama cu lumina"

**Cerinta:** "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)."

Ce se poate si ce nu: vezi `23-update-partea-a-doua.md`, sectiunea 4. Aici e reteta.

Unde se aplica: nivelurile 7 - 12, Sala Tronului, eroii si George in tot al doilea joc, toate obiectele noi (porti, tinte, pluta, bolovani). Nivelurile 1 - 6 raman cum sunt (H11).

Regulile care raman din `CLAUDE.md`, regula 4: **fara contururi negre, fara gri, fara negru.** Intunericul e indigo, violet sau maro cald. Cea mai inchisa culoare permisa: `#241A3A`.

### S7.1 O singura lumina - **facuta (T6.1, 21 noiembrie 2026)**

E in joc. Descrierea ei, la timpul prezent: `05-pictura.md`, "Update 21 noiembrie 2026 (T6.1)". `CONFIG.look`: `03-config.md`. Hotararile: `16-decizii.md`. Ce n-a putut fi verificat: `19-limitari.md`.

Ce s-a facut altfel decat scria mai jos: `shadow: false` scoate amandoua umbrele, nu doar cea aruncata; pata de stralucire creste cu `gloss`, nu doar se aprinde.

Tot ce e pictat in stilul nou e luminat din **stanga-sus**, cu o lumina calda (`KEY = '#FFE2B0'`). Din dreapta-jos vine o lumina de umplere rece (`FILL = '#8FA8FF'`). Fiecare obiect cu volum are cinci straturi, in ordinea aceasta:

| Strat | Ce este | Cum se picteaza |
|---|---|---|
| 1. Umbra aruncata | Lipeste obiectul de pamant. | Elipsa violet (`SHADOW`), alpha 0.28, mutata cu `(+0.35 x inaltime, +0.12 x inaltime)`, turtita la 0.4. Cu `multiply`. |
| 2. Umbra de contact | Linia inchisa de sub obiect. | Elipsa mica, alpha 0.4, exact sub baza. |
| 3. Forma | Culoarea obiectului, cu volum. | Gradient liniar dinspre stanga-sus (culoarea deschisa cu 22%) spre dreapta-jos (inchisa cu 28% si impinsa spre violet cu 10%). |
| 4. Lumina de margine | Linia subtire care desprinde obiectul de fundal. | Pe partea dreapta-jos a conturului: o linie de 2 - 3 pixeli in `FILL`, alpha 0.55. Pe partea stanga-sus: o linie in `KEY`, alpha 0.7. |
| 5. Stralucire | Doar pe materiale lucioase. | O pata alba mica, alpha 0.6 - 0.9, in treimea de stanga-sus. |

Functie noua in `02-core.js`: `lit(c, path, col, o)`. `path` e o functie care construieste conturul. `o` are `h` (inaltimea, pentru umbra), `gloss` (0 - 1), `mat` (materialul, mai jos). Toti pictorii noi o folosesc, ca lumina sa fie aceeasi peste tot.

### S7.2 Materiale - **zece din unsprezece facute (`scale`, `fabric`, `rubber`, `bone`: T6.2; `wood`, `metal`, `stone`, `crystal`, `leaf`, `lava`: T6.3, 21 noiembrie 2026)**

Cadrul (`MATERIALS`, `matPattern`, `matFill`) si cele patru materiale ale eroilor sunt in joc. Descrierea lor, la timpul prezent: `05-pictura.md`, "Update 21 noiembrie 2026 (T6.2)". Hotararile: `16-decizii.md`. Ce n-a putut fi verificat: `19-limitari.md`. Cele sase ale lumii (T6.3) sunt descrise in acelasi capitol. `water` vine cu T6.8. Lava pulseaza dupa `o.t`; luminarea din jurul ei ramane pentru T6.4.

Ce s-a facut altfel decat scrie mai jos: placa de pori are 64 x 64, nu e o placa mica; solzii "mai desi spre spate" sunt un al doilea strat pe jumatatea stanga; cusaturile sunt conturul micsorat in jurul mijlocului, nu o linie la distanta fixa.

Fiecare material e o functie care adauga textura peste forma (stratul 3), taiata la contur (`clip`). Texturile sunt mici canvasuri pictate o data (`sprite('mat-...')`) si repetate cu `createPattern`.

| Material | Unde | Textura | Stralucire |
|---|---|---|---|
| `wood` | poduri, pluta, usi, manivele, scuturi | Fibre: linii lungi, usor ondulate, mai inchise cu 12%, si doua-trei noduri. Capete de scandura mai deschise. | 0.15 |
| `metal` | robotii, portile atelierului, tintele, armura lui George | Gradient in benzi (deschis, inchis, deschis), nituri mici cu umbra lor, zgarieturi fine deschise. | 0.8 |
| `fabric` | Killer (tricou, sort), steaguri, panglici, plasa | Tesatura: linii foarte fine in cruce, alpha 0.08. Cusaturi: liniute punctate deschise, la 4 pixeli de margine. | 0.05 |
| `rubber` | manusile lui Killer, mingea, rotile | Neted, cu o banda lata de lumina moale. | 0.4 |
| `scale` | Boon, George | Solzi: semicercuri mici pe randuri decalate, alpha 0.12, mai desi spre spate. | 0.3 |
| `bone` | oasele lui Boon, coltii, ziduri de oase | Aproape neted, cu pori mici si o crapatura. | 0.25 |
| `stone` | bolovani, piedestale, castel | Pete mari neregulate in doua tonuri, crapaturi, muschi in partea de jos. | 0.1 |
| `crystal` | cristalele, Cristalul-Soare, lumini | Fatete: triunghiuri in trei tonuri ale aceleiasi culori. Miezul mai deschis. | 1 |
| `leaf` | frunze uriase, nuferi | O nervura centrala si nervuri laterale, deschise. Margine putin mai inchisa. | 0.35 |
| `lava` | vulcanul | Crusta inchisa (`#5A2A3A`) cu crapaturi luminoase care pulseaza (galben -> portocaliu). | 0, dar lumineaza |
| `water` | lac, sant | Vezi S7.5. | - |

### S7.3 Eroii si George, repictati - **facuta (T6.4 pictura, T6.5 miscarea, 22 noiembrie 2026)**

Miscarea (coada pe arc, bratele, clipitul, respiratia, turtirea, urmele din fuga ca imagini) e descrisa in `21-cea-mai-grea-lupta.md`, "Update 22 noiembrie 2026 (T6.5)". Ce s-a facut altfel: coada lui George isi face arcul in desen (`tailFollow`), nu intr-un `update`.

Pictura (lumina, materialele, ochii, cusaturile, numarul 10, umbra aruncata) e in joc; descrierea: `21-cea-mai-grea-lupta.md`, "Update 22 noiembrie 2026 (T6.4)". Miscarea (coada, bratele, clipitul, respiratia, turtirea) vine cu T6.5. Ce s-a facut altfel: partile mici trec prin `lit()` doar cu gradientul, fara margine si textura (costul); materialele stau pe partile mari; coroana lui George nu s-a schimbat.

Formele si culorile din desenele copiilor **nu se schimba**: corpul rotund turcoaz al lui Boon cu cupola si "muntii", gatul auriu, capul mic albastru; Killer cu capul rotund, ochii mari, zambetul cu dinti, tricoul albastru cu 10, ghetele rosii; George roz, cu capul curcubeu si cornul-coroana. Se schimba doar felul in care sunt pictati:

- Fiecare parte a corpului trece prin `lit()`, cu materialul ei: `scale` pentru dinozauri, `fabric` pentru hainele lui Killer, `rubber` pentru ghete si manusi.
- Killer capata cusaturi vizibile la tricou si numarul 10 "cusut" (o margine punctata in jurul cifrelor).
- Ochii au doua luciri (una mare stanga-sus, una mica dreapta-jos) si o umbra moale sub pleoapa.
- Umbra de pe pamant devine umbra aruncata din S7.1 (acum e o elipsa chiar sub erou).
- Miscare in plus: coada lui Boon si a lui George intarzie fata de corp (un arc cu doua articulatii care urmeaza viteza). Bratele lui Killer se balanseaza la mers. Clipit la 3 - 6 secunde. Respiratie cand stau (scara 1 -> 1.02).
- Turtire si intindere: la pornire, la oprire, la lovitura, la aterizare (exista deja `h.squash`; se foloseste si la pornirea fugii).

Pictorii sunt `drawBoon`, `drawKiller`, `drawGeorge` din `src/055-lupta.js`. Semnaturile raman. Portretele din HUD se refac singure (sunt sprite-uri din aceiasi pictori).

Verificare: foaia de personaje (`docs/capturi/24-personaje.jpg`) refacuta si pusa langa cea veche. Un copil trebuie sa isi recunoasca desenul.

### S7.4 Adancime: trei planuri

| Plan | Ce contine | Cum |
|---|---|---|
| Fundal | Pictura nivelului (`paintLevel`), ca acum, dar pictata cu `lit()` si materiale. Departarea (munti, castelul, vulcanul) e mai stearsa si mai albastra: ceata de aer. | O data, la incarcare. |
| Mijloc | Eroi, inamici, obiecte, decor care reactioneaza. | La fiecare cadru, ca acum, sortate dupa y. |
| Fata | Lucruri mari, foarte aproape de "ochi": frunze uriase, liane, stalpi, lanturi, stalactite. Doar la marginile ecranului. | Un canvas pe nivel, pictat o data (`L.front`), desenat dupa lume, cu o miscare de 1.15 ori mai mare decat camera (paralaxa). Elementele sunt inchise la culoare si usor sterse (pictate la jumatate de rezolutie si marite), ca si cum ar fi nefocalizate. |

**Regula care nu se incalca:** planul din fata nu acopera niciodata un erou. Fiecare element din fata are un dreptunghi. Daca un erou (pe ecran) intra in el, elementul devine transparent (alpha spre 0.15 in 0.2 s). Elementele se pun doar in afara unui dreptunghi central de 1500 x 760. E aceeasi grija ca la S6.

### S7.5 Lumina care se misca

**Harta de lumina.** Un canvas mic, `LM`, de 480 x 270 (un sfert din ecran). La fiecare cadru:

1. Se umple cu culoarea de ambianta a nivelului (`def.ambient`, de exemplu `#B8B0E8` pentru o noapte blanda sau `#3A2E6A` pentru pestera).
2. Cu `globalCompositeOperation = 'lighter'`, se deseneaza cate un gradient rotund pentru fiecare lumina: eroii (raza 150, culoarea lor, slab), cristalele de pe jos (raza 50), obiectele aruncate (raza 70), tortele si felinarele, lava, Cristalul-Soare (raza 360), tintele aprinse.
3. Se deseneaza peste lume, marit la tot ecranul, cu `multiply`.

Cel mult 24 de lumini pe cadru. Daca sunt mai multe, raman cele mai apropiate de mijlocul ecranului. Gradientele rotunde sunt sprite-uri pictate o data pe culoare, desenate cu `drawImage` (nu `createRadialGradient` la fiecare cadru).

Harta de lumina ia locul vinietei de noapte din `makeOverlay` pe nivelurile noi. Textura de hartie ramane.

**Stralucire.** Lucrurile care lumineaza (cristale, lava, tinte aprinse, ochii robotilor, flacari) primesc deasupra un sprite de "halou" desenat cu `lighter`, alpha 0.35 - 0.6.

**Apa** (lac, sant): culoarea de baza, apoi o oglindire stearsa si rasturnata a lucrurilor de pe mal (pictata o data in fundal), apoi doua randuri de valuri subtiri deschise care se misca in sens opus (un pattern desenat de doua ori cu deplasari diferite), apoi sclipiri mici la intamplare.

**Praf in lumina.** 40 de puncte foarte mici care plutesc incet prin tot ecranul (in spatiul ecranului, nu al lumii), alpha 0.15 - 0.4, mai vizibile langa lumini. Pe vulcan sunt scantei care urca. In pestera, spori care coboara.

### S7.6 Miscare si "greutate"

| Efect | Cand | Cum |
|---|---|---|
| Oprire scurta | La o lovitura mare: paznicul lovit, o poarta care se deschide, bolovanul care cade in lava. | Jocul sta 0.06 s (`P.freeze`): `updatePlay` nu ruleaza, desenul da. |
| Apropiere | La aceleasi momente. | Camera se apropie cu 4% in 0.15 s si revine in 0.4 s. |
| Zguduire | Exista (`P.shake`). | Neschimbata. |
| Anticipare | Inaintea oricarui atac al lui George si a oricarei miscari de mecanism. | Obiectul se trage inapoi 0.15 s, apoi porneste. Mecanismele scot un "clic" si o scanteie inainte sa se miste. |
| Urmare | Dupa. | Depaseste tinta cu 8% si revine (o functie noua, `easeBack`, langa `easeOut` in `02-core.js`). Podurile, portile, pluta. |
| Viata | Mereu. | Tot ce e viu respira. Tot ce atarna se leagana. Flacarile, apa si lava nu stau nicio clipa. |

### S7.7 Bugetul de timp

Jocul trebuie sa ramana fluent pe Mac. Masurat acum, fara placa video (SwiftShader): 16 - 24 ms pe cadru la un nivel obisnuit, 22 ms in lupta cu George.

| Ce | Limita |
|---|---|
| `tests/performanta.js` pe un nivel nou | cel mult 20% peste nivelul 6 de acum, masurat in aceeasi rulare |
| Harta de lumina | 1 umplere + cel mult 24 `drawImage` + 1 `drawImage` marit |
| Planul din fata | 1 canvas, cel mult 12 `drawImage` pe cadru |
| Umbrele eroilor din fuga | 3 `drawImage` pe erou |
| Particule | limita de acum din `part` (520) ramane |
| `createRadialGradient`, `createPattern`, `shadowBlur` | **niciodata** in desenul de la fiecare cadru. Doar in pictorii care se pun in `sprite()` sau in pictura nivelului. |
| Memorie | Fiecare nivel are deja o pictura de 3200 x 1800. Planul din fata e 1920 x 1080 la jumatate de rezolutie. Se elibereaza la schimbarea nivelului, ca pictura de acum. |

Daca un Mac mai vechi se chinuie: `CONFIG.look.lights: false` opreste harta de lumina (ramane vinieta veche), `CONFIG.look.front: false` opreste planul din fata.

```js
// ---- The look of levels 7 - 12 (second game)
look: {
  lights: true,          // the moving light map. false = the old night vignette
  front: true,           // big blurred things at the edges of the screen
  motes: 40,             // tiny specks floating in the light
  freeze: 0.06,          // seconds the game holds its breath at a big hit. 0 = off
  maxLights: 24
},
```

### S7.8 Lista de verificare pentru capturi

Dupa sarcina T6, pentru fiecare captura a unui nivel nou, raspunsul trebuie sa fie "da" la toate:

1. Se vede dintr-o privire de unde vine lumina?
2. Fiecare obiect mare are umbra pe pamant, in aceeasi directie?
3. Se poate spune din ce e facut fiecare lucru (lemn, metal, piatra, panza)?
4. Exista ceva in fata si ceva in departare?
5. Eroii sunt cele mai luminoase si mai limpezi lucruri de pe ecran? Se gasesc in mai putin de o secunda?
6. Nimic din planul din fata si nimic din scrisul de sus nu ii acopera?
7. Niciun pixel negru, niciun gri curat? (se verifica si cu un script: niciun pixel cu R, G, B egale si sub 200)
8. Copilul si-ar recunoaste desenul in Boon, Killer si George?
