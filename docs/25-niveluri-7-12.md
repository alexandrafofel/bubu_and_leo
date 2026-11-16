# 25. Partea a doua: nivelurile 7 - 12 si Sala Tronului

Status: **specificatie, neimplementata.** Vezi `23-update-partea-a-doua.md` pentru cerere, hotarari si etape, si `24-sisteme-noi.md` pentru butoane, fuga, a doua putere, cele 10 secunde, capitole si stilul grafic.

Cuprins: 1. Povestea. 2. Cum arata un nivel nou. 3. Mecanismele (cadrul comun). 4. Cele sase niveluri. 5. George in mini-lupte. 6. Sala Tronului. 7. "Va urma" si finalul. 8. Texte. 9. Sunete. 10. Decor si numarul de elemente. 11. Teste.

---

## 1. Povestea

Partea intai se termina cu Petrecerea Curcubeu: medalii, si zece stelute care ii imbratiseaza pe Boon si Killer (finalul cerut de copii).

**Partea a doua: "Stelele furate".** In mijlocul petrecerii cerul se intuneca. George cel Rău se intoarce intr-o masina zburatoare facuta din fiare vechi, cu o plasa mare. Prinde cele zece stelute si zboara spre castelul lui de pe vulcan. Coroana i-a ramas pe nisip in arena, asa ca acum poarta una de tinichea.

Boon si Killer pornesc dupa el. Drumul trece prin sase locuri. In fiecare, George a lasat o cusca cu stelute si pe el insusi de paza, tot mai mare. La capat, in Sala Tronului, il asteapta in Robo-George, un robot urias in care sta el la mansa.

| Nivel | Stelute eliberate | Total |
|---|---|---|
| 7, 8, 9, 10, 11 | cate una | 5 |
| 12 | doua | 7 |
| Sala Tronului | trei | 10 |

Finalul: Robo-George se desface in bucati. George, mic cat un pui, fuge pe o racheta de jucarie si striga ca se intoarce. Stelutele ii imbratiseaza din nou pe eroi. Ramane "rau de-a binelea", cum au vrut copiii, si nimeni nu pateste nimic.

Copiii pot schimba orice din poveste (I9): numele locurilor, ce fura George, cum arata robotul. Sunt doar texte in `STR` si pictori in `055-lupta.js`.

---

## 2. Cum arata un nivel nou

Motorul ramane cel de acum: harta de 3200 x 1800, generata din definitie (`genLevel`), cu drum de la stanga la dreapta, trei valuri de cristale, doua mini-lupte, cuib la capat, trei stele ascunse, 1700 de lucruri mici de decor.

Ce e nou: **doua benzi** taie harta de sus pana jos, la o treime si la doua treimi. O banda e o prapastie, un zid, un lac sau un rau de lava. Fiecare banda are o singura trecere, iar trecerea se deschide cu un **mecanism** care are nevoie de amandoi eroii.

```
 start                banda A                 banda B                cuib
  |   valul 1            ║      valul 2          ║      valul 3        |
  o  ~~~~~~~~~~~~~~~~~  ═╬═  ~~~~~~~~~~~~~~~~~  ═╬═  ~~~~~~~~~~~~~~~  (O)
  |                      ║     mini-lupta 1      ║    mini-lupta 2     |
                      poarta A              poarta B               cusca
                      (lectia)             (rasucirea)           stelutelor
```

Ordinea intr-un nivel nou:

1. Valul 1 de cristale, in prima treime.
2. Poarta A. Mecanismul nivelului, in forma lui cea mai simpla, fara pericol in jur (principiul P4).
3. Valul 2, in a doua treime. Apoi mini-lupta din mijloc cu George.
4. Poarta B. Acelasi mecanism, cu o rasucire: timp, pericol sau a doua putere.
5. Valul 3, in ultima treime. Apoi mini-lupta de la cuib.
6. Cusca stelutelor, langa cuib: se deschide cand **amandoi** eroii o lovesc, cu orice putere, la cel mult 1.5 secunde unul de altul ("Bate palma!"). Steluta zboara in HUD.
7. Cuibul se deschide. Amandoi in cuib: nivelul e gata.

---

## 3. Mecanismele: cadrul comun

Totul sta intr-un fisier nou, `src/065-mech.js`, pus in `build.sh` intre `06-level.js` si `07-play.js`. Desenul obiectelor sta in `055-lupta.js`.

### 3.1 Banda

In definitia nivelului:

```js
bands: [
  { at: 0.335, kind: 'chasm', w: 200, mech: 'plates1' },   // band A
  { at: 0.665, kind: 'chasm', w: 200, mech: 'plates2' }    // band B
],
```

| Camp | Ce este |
|---|---|
| `at` | Unde e mijlocul benzii, ca parte din latimea hartii. 0.335 si 0.665 cad pe granitele dintre cele trei zone ale valurilor (`region(k)` in `genLevel`). |
| `kind` | `chasm` (prapastie), `water` (lac, sant), `lava`: celule cu codul 2. Eroii nu trec, obiectele aruncate zboara peste. `wall` (zid): celule cu codul 3. Nu trece nimic. |
| `w` | Latimea, in unitati. Mijlocul benzii serpuieste usor, ca raul de acum: `x(y) = at * W + 40 * sin(y / 260 + faza)`. |
| `mech` | Reteta mecanismului (3.3). |

In `genLevel`, benzile se pun imediat dupa drum, langa blocul `if (def.river)` (nivelurile noi nu au `river`). Trecerea se face cu aceeasi functie ca la rau (`crossing`): un dreptunghi de 3 randuri inalt, lat cat banda plus 60 de fiecare parte, la inaltimea la care drumul (`L.path`) taie banda. Celulele trecerii primesc codul 0 si steagul 8 (pod) plus un steag nou, 32 (poarta), ca sa nu se puna acolo cristale, copaci sau decor.

O stea de felul `islet`, pe un nivel cu benzi si fara iaz, se pune in mijlocul unei benzi care nu e zid, la cel putin 250 de trecere: se ia doar cu un obiect aruncat.

Verificarea ca toate cristalele se pot culege (`reach`) se face **cu portile deschise**. Abia in `startPlay`, celulele fiecarei porti primesc codul benzii (2 sau 3). De aici le schimba doar mecanismul.

### 3.2 Poarta si intrarile

```js
// one per band, in L.gates
gate = { band: 0, kind: 'bridge', x, y, w, h, cells: [/* grid indexes */], code: 2,
         state: 'closed',        // 'closed' | 'open' | 'fixed'
         open: 0,                // 0..1, how far it has opened (for drawing)
         stayT: 0,               // seconds left before it closes again
         inputs: [/* ids */], rule: 'any', window: 0, stay: 1.5,
         step: 0, idleT: 0 };    // step: which part of the recipe the players are at; idleT: seconds without progress

// in L.inputs
input = { id, kind: 'plate',     // 'plate' | 'target' | 'crank' | 'pedestal' | 'slot' | 'cage'
          x, y, r, who: -1,      // who: -1 anyone, 0 only the first hero, 1 only the second
          on: false, onT: 0, n: 0, need: 1 };
```

`updateMechs(dt)` e chemata din `updatePlay`, dupa eroi si dupa obiectele aruncate:

1. Pentru fiecare intrare, calculeaza `on` (3.4).
2. Pentru fiecare poarta care nu e `fixed`, aplica regula:
   - `any`: deschisa cat macar o intrare e `on`.
   - `all`: deschisa cat toate sunt `on`.
   - `allWithin`: se deschide cand toate au devenit `on` la cel mult `window` secunde una de alta. Intrarile de acest fel raman `on` cate `window` secunde dupa ce au fost atinse.
   - `seq`: intrarile trebuie atinse in ordinea din `inputs`. `gate.step` arata care urmeaza.
3. Cand regula nu mai e adevarata, poarta mai sta deschisa `stay` secunde, apoi se inchide.
4. `gate.open` merge lin spre 1 sau 0 (0.5 secunde). Celulele devin libere (cod 0) cand `open > 0.9` si se inchid (cod 2 sau 3) cand `open < 0.1`.
5. Regulile de siguranta (3.6).

Cand o poarta se deschide prima oara: oprire scurta, camera se apropie putin (`24-sisteme-noi.md`, S7.6), sunetul `gateOpen`, cuvantul `gate` al ambilor eroi, vibratie pe ambele controllere (`rumble(k, 0.3, 0.6, 220)`).

### 3.3 Retetele

| Reteta | Nivel | Intrari | Regula | Pe scurt |
|---|---|---|---|---|
| `plates1` | 7, A | o placa pe malul apropiat, una pe cel indepartat, amandoua pentru oricine | `any`, `stay: 1.5` | Tu stai, eu trec. Apoi eu stau, tu treci. |
| `plates2` | 7, B | doua plăci pe malul apropiat: una turcoaz (Boon), una albastra (Killer), fiecare la 520 de trecere | `all`, `stay: 5` | Apasam amandoi, apoi fugim. |
| `targets1` | 8, A | doua tinte pe zid: una turcoaz, una albastra | `allWithin`, `window: 4` | Fiecare isi loveste tinta. |
| `targets2` | 8, B | patru tinte pe zid, culori pe rand | `seq` | Pe rand, cum arata luminile. |
| `raft1` | 9, A | o manivela pe fiecare mal | pluta (3.5) | Tu invarti, eu plutesc. |
| `raft2` | 9, B | la fel, dar apa are curent | pluta | Invarte fara oprire. |
| `orb1` | 10, A | un piedestal langa poarta | `all` | Unul duce lumina, celalalt il apara. |
| `orb2` | 10, B | doua piedestale, la 600 unul de altul, unul turcoaz, unul albastru | `all` | Fiecare isi duce cristalul. |
| `boulder1` | 11, A | o scobitura in rau | `all` | Impingem impreuna. |
| `boulder2` | 11, B | la fel, cu doua gheizere pe drum | `all` | Impingem cand tac gheizerele. |
| `combo1` | 12, A | doua placi si doua tinte cu scut | `all` | Tu tii scutul jos, eu lovesc. Apoi invers. |
| `combo2` | 12, B | pluta peste sant, cu sulite aruncate spre cel care invarte | pluta | Invarte: rotirea te si apara. |

Pe **Ușor** (dificultatea cea mai usoara dintre cei doi jucatori): `window` si `stay` se inmultesc cu 1.6, `seq` nu se reseteaza la o greseala, iar curentul din `raft2` e la jumatate.

### 3.4 Intrarile, una cate una

**Placa** (`plate`, raza 60). `on` cat un erou potrivit (`who`) sta la mai putin de 55 de mijlocul ei si nu e jos, dus de pasare sau pe pluta.

- Arata: un disc de piatra (`stone`) in pamant, cu o urma pictata: laba cu trei degete, turcoaz, pentru Boon; talpa de gheata, albastra, pentru Killer; jumatate-jumatate pentru oricine. Apasata: coboara 6 unitati, urma lumineaza, un inel de lumina urca.
- Sunet: `plate` (un clic de piatra si un clopotel). La eliberare, acelasi clopotel, mai jos.
- Vibratie pentru cel care a calcat: `rumble(k, 0, 0.4, 60)`.

**Tinta** (`target`, raza 46). Devine `on` cand o loveste un obiect aruncat de eroul potrivit (`b.owner === who`) sau rotirea lui, daca sta la mai putin de `radius`.

- Arata: un disc pe un stalp, ca o tinta de balci, din `metal`. Inel turcoaz si un os mic in mijloc pentru Boon; inel albastru si un hexagon de minge pentru Killer. Aprinsa: raze, halou, se roteste incet.
- Obiectul celuilalt erou ricoseaza. Tinta se clatina "nu" si canta `no`. Nu se pierde nimic.
- Cu scut (`shield: true`, nivelul 12): o cupola de sticla o acopera cat placa ei nu e apasata. Orice ricoseaza din cupola.
- Sunet la aprindere: `target` (un gong mic, cald: doua sinusuri la o cvinta, cu coada de 0.6 s).

**Manivela** (`crank`, raza 50). Fiecare rotire (gheare, manusi) pornita la mai putin de 200 de ea numara o tura (`n++`), o singura data pe rotire (acelasi `id` ca in `powerSweep`).

- Arata: o roata de lemn cu maner, pe un stalp, cu o franghie care pleaca spre pluta. La fiecare tura se invarte o treime de cerc, cu `easeBack`.
- Sunet: `crank` (patru clicuri moi de lemn, din ce in ce mai sus).

**Piedestal** (`pedestal`, raza 50). `on` cat are pe el cristalul potrivit (3.5).

**Scobitura** (`slot`). `on` cand bolovanul a ajuns in ea (3.5).

**Cusca stelutelor** (`cage`, raza 70, langa cuib). Numara loviturile fiecarui erou. Se deschide cand amandoi au lovit-o la cel mult 1.5 s unul de altul. Daca doar unul loveste, cusca se clatina si deasupra ei apar cele doua fete ale eroilor, cu cea care lipseste palpaind.

### 3.5 Obiectele care se misca

**Pluta** (`L.rafts`). `{ band, y, x0, x1, u: 0, w: 170, h: 130, riders: [] }`. `u` = 0 la malul apropiat, 1 la celalalt.

1. Cand pluta sta la un mal, celulele de sub ea sunt libere. Un erou urca pur si simplu mergand pe ea.
2. O tura la **oricare** manivela muta pluta spre dreapta cu `1 / need` din drum (`need: 3`). Miscarea dureaza 0.8 s.
3. Cand pluta pleaca de la mal, eroii care stau pe ea devin calatori (`h.riding = raft`). Un calator se misca odata cu pluta, nu poate merge, dar isi poate folosi puterile si poate ajuta cu ○. Nu poate fi ridicat de pasare.
4. La malul celalalt calatorii coboara singuri (`riding = null`).
5. O pluta goala, departe de malul apropiat, se intoarce singura la el dupa 1.5 s, cu 140 de unitati pe secunda. Asa ajunge la al doilea erou.
6. `raft2` (curent): cu un calator la bord si nimeni care invarte, pluta aluneca inapoi cu `drift` (0.07 din drum pe secunda). `need: 4`.
7. Dupa ce amandoi au trecut, pluta ramane la malul indepartat.

Deci: A urca, B invarte manivela de aici de trei ori. A coboara dincolo. Pluta se intoarce. B urca. A invarte manivela de dincolo de trei ori.

**Cristalul-Soare** (`L.orbs`). `{ x, y, who: -1, carrier: null, home: {x, y}, lit: 360 }`.

1. Un erou potrivit (`who`) care il atinge il ridica (`h.carry = orb`), daca nu e jos si nu cara deja ceva.
2. Cat il cara: merge cu 0.7 din viteza, nu poate fugi, nu are nicio putere. Poate ajuta prietenul cu ○. Cristalul pluteste deasupra capului lui.
3. ✕ cat il cara: daca prietenul e la mai putin de 420 si poate cara acest cristal, i-l arunca (un arc de 0.5 s, prins automat). Altfel il pune jos.
4. Daca purtatorul e lovit, cristalul cade langa el. Nu se pierde.
5. Daca ajunge intr-un loc de unde nu poate fi luat, reapare dupa 2 s in ultimul loc bun.
6. La mai putin de 70 de un piedestal potrivit, cristalul sare singur pe el.
7. Lumineaza (`lit`): vezi nivelul 10.
8. Arata: un cristal mare, auriu (`crystal`), cu o fata mica si adormita care se trezeste cand e ridicat. Cele colorate din `orb2`: unul turcoaz, unul albastru.

**Bolovanul** (`L.boulders`). `{ x, y, r: 70, path: [[x, y], ...], s: 0, len, pushers: 0 }`. Sta pe un sant drept care duce la scobitura din banda. Este si in `L.solids`, deci eroii, inamicii si obiectele aruncate se lovesc de el.

1. Un erou "impinge" cand e lipit de bolovan (la mai putin de `r + HERO_R + 10`), in spatele lui fata de sant, si tine stick-ul spre sant (produs scalar peste 0.4).
2. Doi care imping: bolovanul merge pe sant cu 85 de unitati pe secunda. Praf, sunetul `rumbleRoll` (un huruit jos, cat tine miscarea), vibratie slaba continua pe ambele controllere.
3. Unul singur: bolovanul tremura, nu inainteaza. Deasupra lui apar doua maini pictate si eroul spune `together`.
4. In scobitura: cade, plescaie, devine pod. Poarta e `fixed`. Oprire scurta, camera se apropie.
5. `boulder2`: doua gheizere stau pe sant. Daca bolovanul e deasupra unuia cand izbucneste, aluneca inapoi 120 de unitati. Pe Ușor nu aluneca.

### 3.6 Reguli de siguranta: nimeni nu ramane blocat

Acestea sunt obligatorii. Testul `mecanisme.js` le verifica pe fiecare.

| Nr | Regula |
|---|---|
| G1 | O poarta nu se inchide cat un erou sta pe celulele ei. |
| G2 | Cand amandoi eroii jucati sunt dincolo de banda (x mai mare decat marginea ei din dreapta plus 60), poarta devine `fixed`: ramane deschisa pana la sfarsitul nivelului. |
| G3 | Cat un erou e jos (asteapta ajutor), toate portile se deschid si raman deschise. Pluta merge singura la malul prietenului. Altfel Boon, care ajuta doar de aproape, nu ar putea ajunge. |
| G4 | Pasarile nu lasa niciodata un erou dincolo de o banda inchisa (`dropHero` cauta loc doar pe partea de unde l-a luat). |
| G5 | Vantul, urletul lui George si loviturile nu pot impinge un erou intr-o banda (`collide` il opreste, ca la apa). |
| G6 | Cu un singur jucator, intrarile celuilalt erou sunt socotite mereu `on`, ferestrele de timp nu exista, bolovanul merge cu un singur impingator, cusca se deschide la o lovitura. |
| G7 | Daca la o poarta nu se intampla nimic `autoOpen` (180) secunde, poarta se deschide singura, cu mesajul "Poarta s-a deschis singură." Numaratoarea porneste cand un erou ajunge la mai putin de 500 de poarta. |
| G8 | Dupa 40 de secunde fara progres la o poarta, fiecare erou primeste sageata spre intrarea lui (si cel cu sageata oprita) si iconita butonului de apasat deasupra intrarii. |
| G9 | In timpul unei mini-lupte portile nu isi schimba starea. |
| G10 | La reinceperea nivelului, totul porneste de la zero: porti inchise, pluta la mal, bolovanul la loc. |

```js
// ---- Co-op mechanisms of levels 7 - 12
mech: {
  autoOpen: 180,         // seconds without progress before a gate opens by itself. 0 = never
  hintAfter: 40,         // seconds without progress before both players get an arrow to their own switch
  easy: 1.6,             // on "Ușor": time windows and "stays open" times are this much longer
  cageWindow: 1.5,       // both heroes must hit the star cage within this many seconds
  raftTurns: 3, raftBack: 140, raftDrift: 0.07,
  orbSlow: 0.7, orbPass: 420, orbLight: 360,
  boulderSpeed: 85, boulderBack: 120
},
```

### 3.7 Sageata, indiciile, botul

Fiecare reteta stie in orice moment ce are de facut fiecare erou. O functie, `mechSteps(gate)`, intoarce pentru fiecare erou `{ x, y, act }`, unde `act` este `'stand'`, `'power1'`, `'power2'`, `'spin'`, `'throw'`, `'push'`, `'carry'`, `'ride'` sau `'cross'`.

- `guideTarget(h)` (`08-draw.js`) o foloseste: sageata fiecarui erou arata spre locul **lui**.
- `drawHints` deseneaza iconita butonului deasupra locului, in culoarea eroului.
- Eroul fara jucator (G6) nu are nevoie de ea.
- Testele o folosesc ca sa joace nivelurile cu boti.

---

## 4. Cele sase niveluri

Definitiile se adauga la `LEVEL_DEFS_L` (pozitiile 6 - 11). Campurile care exista deja au intelesul de acum (`21-cea-mai-grea-lupta.md`). Campuri noi: `look: 'diorama'` (stilul din `24-sisteme-noi.md`, S7), `ambient` (culoarea hartii de lumina), `bands`, `sleeper` si `roller` (cum arata inamicul care doarme si cel de pe culoar), `geysers`, `dark`, `toy`.

Paletele noi se adauga in `PALS`, cu aceleasi campuri ca cele de acum (`g0`, `g1`, `tints`, `canopy`, `flowers`, `path`, `trunk`, `rock`).

### Nivelul 7: Canionul Podurilor de Lumină (`canyon`)

**Ideea:** poduri de lumina peste o prapastie. Tu stai pe placa, eu trec.

| | |
|---|---|
| Locul | Un platou inalt, la rasarit. Prima raza de soare dupa sase niveluri de noapte: cer roz si auriu, stanci rosiatice, prapastii adanci cu ceata albastra pe fund. |
| Banda A | `chasm`, `plates1`. Podul e facut din sapte scanduri de lumina, cate una de fiecare culoare a curcubeului. Apar una dupa alta, de la malul placii apasate. |
| Banda B | `chasm`, `plates2`. Placile sunt la 520 deasupra si dedesubtul trecerii. Dupa ce le apasa amandoi, podul ramane 5 secunde. Mergand, abia ajung. Fugind (L3), ajung usor. Aici se invata fuga. |
| Inamici | 2 pasari mari (pot lua un erou de pe placa: e de ras, nu de plans, vezi G4). Roboti putini. Vant. |
| Invata | Placile. A doua putere (iconita □ deasupra eroilor). Fuga. |
| Stele | Una pe un stalp de piatra din prapastie (se ia cu un obiect aruncat). Una intr-un cotlon. Una in coroana unui copac. |
| Jucaria nivelului | Un balansoar urias dintr-un trunchi cazut. Daca cei doi stau la capete, se leagana si rad. Nu da nimic. |

```js
{ key: 'canyon', music: 'l6', pal: 'canyon', look: 'diorama', ambient: '#FFE9D6', icons: ['plate', 'bridge', 'star'],
  trees: 22, rocks: 26, beetles: [0, 1, 2], lanes: [0, 0, 1], conesPerLane: 1, coneSpeed: 0.55, mud: [0, 0, 0], sparkle: [1, 1, 2], wind: 0.7, birds: 2,
  bands: [{ at: 0.335, kind: 'chasm', w: 200, mech: 'plates1' }, { at: 0.665, kind: 'chasm', w: 200, mech: 'plates2' }],
  stars: ['islet', 'nook', 'treetop'], toy: 'seesaw' },
```

Paleta `canyon`: `g0 '#E8B48A'`, `g1 '#D99A78'`, `canopy ['#6FB08A', '#8AC07A', '#4F9A8A', '#B8C86A']`, `flowers ['#FF8AB8', '#FFD84A', '#FFFFFF', '#B09AFF']`, `path '#F6D9B0'`, `trunk '#8A5A6A'`, `rock '#C98A7A'`. Fundul prapastiei: `#3A4A8A` spre `#6A7AC0`, cu ceata.

### Nivelul 8: Atelierul lui George (`works`)

**Ideea:** tinte in doua culori. Fiecare o loveste pe a lui.

| | |
|---|---|
| Locul | O hala uriasa sub cerul liber, unde George isi construieste robotii. Totul e facut din lucruri marite: suruburi cat un om, chei fixe, roti dintate, cutii de conserve, o lanterna cat un turn. Becuri galbene pe sarme. |
| Banda A | `wall` (un zid din tabla nituita), `targets1`. Doua tinte pe zid, deasupra si dedesubtul unei usi glisante. Fiecare isi loveste tinta, la cel mult 4 secunde unul de altul. Aici Boon invata oasele. |
| Banda B | `wall`, `targets2`. Patru tinte, turcoaz si albastre pe rand. Un bec deasupra fiecareia arata care urmeaza. In fata lor merg doua benzi rulante care te cara la o parte. |
| Benzile rulante | `slowKind: 'belt'`. Celulele cu codul 1 nu incetinesc aici, ci imping eroul cu 140 de unitati pe secunda, in sus sau in jos (o tabela noua, `L.beltDir`). Sunt fasii late de 3 celule si lungi de 10 - 16. Sageti pictate pe ele se misca. |
| Inamici | Multi roboti. Pe culoare, roti dintate care se rostogolesc (`roller: 'gear'`). |
| Invata | Culoarea spune al cui e randul (principiul P2). |
| Stele | Una pazita de trei roboti. Una pe o grinda (obiect aruncat). Una intr-un cotlon dupa o banda rulanta. |
| Jucaria nivelului | Un buton rosu mare. Calcat, toti robotii de pe ecran danseaza 5 secunde in loc sa urmareasca. O data la 30 de secunde. |

```js
{ key: 'works', music: 'l7', pal: 'works', look: 'diorama', ambient: '#C8C0F0', icons: ['target', 'robot', 'gear'],
  trees: 14, rocks: 30, beetles: [3, 5, 6], lanes: [1, 1, 2], conesPerLane: 1, coneSpeed: 0.7, roller: 'gear', mud: [2, 3, 3], slowKind: 'belt', sparkle: [1, 2, 2], lanterns: true,
  bands: [{ at: 0.335, kind: 'wall', w: 120, mech: 'targets1' }, { at: 0.665, kind: 'wall', w: 120, mech: 'targets2' }],
  stars: ['guarded', 'treetop', 'nook'], toy: 'button' },
```

Paleta `works`: `g0 '#5A6A8A'`, `g1 '#4A587A'`, `canopy ['#C8A040', '#D86A4A', '#5AA0A8', '#8A7AC0']`, `flowers ['#FFD84A', '#7AF0C8', '#FF8AB8']`, `path '#A8B0C8'`, `trunk '#6A5A7A'`, `rock '#8A98B8'`. "Copacii" sunt lampi si stive de piese. "Pietrele" sunt suruburi si piulite.

### Nivelul 9: Lacul Nuferilor Uriași (`lake`)

**Ideea:** pluta. Tu invarti manivela, eu plutesc.

| | |
|---|---|
| Locul | Un lac linistit, noaptea, cu luna in apa. Nuferi cat o casa, trestii inalte, licurici, broaste care canta. Apa oglindeste malurile. |
| Banda A | `water`, lata de 400, `raft1`. Pluta e o frunza uriasa de nufar cu margini ridicate, legata cu o franghie de doua manivele. Aici Killer invata manusile (manivela se invarte cu rotirea). |
| Banda B | `water`, lata de 480, `raft2`. Apa curge. Daca cel de pe mal se opreste din invartit, pluta aluneca inapoi. Cristale plutesc pe apa: calatorul le culege cu obiecte aruncate. |
| Inamici | Putini roboti (ruginiti, cu alge). Melci pe carari. Fara pasari. |
| Invata | Rabdarea: unul munceste pentru celalalt, apoi invers. |
| Stele | Una pe un nufar din mijlocul lacului (obiect aruncat de pe pluta). Una intr-un cotlon intre trestii. Una pazita. |
| Jucaria nivelului | Trei nuferi-trambulina pe mal. Cine calca pe unul sare sus (doar desen: `h.z`), cu un "boing". |

```js
{ key: 'lake', music: 'l8', pal: 'lake', night: true, look: 'diorama', ambient: '#9AA8F0', icons: ['raft', 'crank', 'egg'],
  trees: 34, rocks: 10, beetles: [1, 2, 2], lanes: [1, 1, 1], conesPerLane: 1, coneSpeed: 0.5, mud: [1, 1, 2], slowKind: 'slime', sparkle: [1, 2, 2],
  bands: [{ at: 0.335, kind: 'water', w: 400, mech: 'raft1' }, { at: 0.665, kind: 'water', w: 480, mech: 'raft2' }],
  stars: ['islet', 'nook', 'guarded'], toy: 'lilies' },
```

Paleta `lake`: `g0 '#3F6A8A'`, `g1 '#34587A'`, `canopy ['#3FB08A', '#5AC08A', '#2F8AA8', '#7AC8A0']`, `flowers ['#FFB0D8', '#FFFFFF', '#FFD84A', '#B09AFF']`, `path '#8AB0C8'`, `trunk '#4E5A7A'`, `rock '#7A98B8'`. Apa: `#2A4A8A` spre `#4A78C0`.

### Nivelul 10: Peștera Ecoului (`cave`)

**Ideea:** unul duce lumina, celalalt il apara. Ramaneti impreuna.

| | |
|---|---|
| Locul | O pestera uriasa. E intuneric: harta de lumina are ambianta `#3A2E6A`. Cristale in pereti, ciuperci-felinar, stalactite in planul din fata, picaturi care cad cu ecou. |
| Intunericul | `dark: true`. Se vede bine doar in lumina. Lumineaza: Cristalul-Soare (raza 360), ciupercile-felinar aprinse (240), un piedestal cu cristal (500), cuibul (300), obiectele aruncate (70), eroii (110, slab). |
| Umbrele | Inamicul care doarme e aici o **umbra** (`sleeper: 'shade'`): un ghem violet cu doi ochi mari. Nu doarme: se tine dupa eroul cel mai apropiat, incet (90 pe secunda). **Nu poate intra in lumina.** La marginea ei se opreste, se face mica si inchide ochii. Loveste doar un erou aflat in intuneric. Doua lovituri si dispare, ca orice inamic mic. |
| Ciupercile-felinar | Iau locul torțelor (`lanterns: true`). Se aprind cand le loveste orice putere si raman aprinse 25 de secunde (45 pe Ușor). |
| Banda A | `wall` (stanca), `orb1`. Cristalul-Soare e la 700 de unitati inaintea zidului, intr-o nisa. Dus pe piedestal, deschide o poarta de piatra si lumineaza toata zona. |
| Banda B | `wall`, `orb2`. Doua cristale mai mici, unul turcoaz si unul albastru, in locuri diferite. Doua piedestale, la 600 unul de altul. Fiecare erou il poate cara doar pe al lui. |
| Invata | Sa stea aproape unul de altul. Cel care cara nu are puteri: prietenul aprinde ciupercile din fata si alunga umbrele. |
| Stele | Una se aprinde cand cele cinci cristale cantatoare sunt lovite (jucaria nivelului). Una pe o stanca dintr-un lac subteran. Una intr-un cotlon intunecat. |
| Jucaria nivelului | Cinci cristale mari in perete. Lovite, canta cate o nota (do, re, mi, sol, la). |
| Fara | Vant, pasari. |

```js
{ key: 'cave', music: 'l9', pal: 'cave', night: true, look: 'diorama', ambient: '#3A2E6A', dark: true, icons: ['orb', 'shade', 'lantern'],
  trees: 20, rocks: 34, beetles: [3, 4, 5], sleeper: 'shade', lanes: [0, 0, 0], mud: [0, 1, 1], slowKind: 'slime', sparkle: [1, 1, 2], lanterns: true, pond: true,
  bands: [{ at: 0.335, kind: 'wall', w: 160, mech: 'orb1' }, { at: 0.665, kind: 'wall', w: 160, mech: 'orb2' }],
  stars: ['islet', 'nook', 'chime'], toy: 'chimes' },
```

Paleta `cave`: `g0 '#3E3A7A'`, `g1 '#322E68'`, `canopy ['#6A58C8', '#4A8AC8', '#8A5AB8', '#3FA0A8']`, `flowers ['#7AF0C8', '#B09AFF', '#FFD84A', '#FF8AB8']`, `path '#7A78B8'`, `trunk '#4A3E7A'`, `rock '#6A68B0'`. "Copacii" sunt stalagmite cu cristale.

Felul nou de stea, `chime`: steaua e ascunsa (`hidden`) pana cand toate cele cinci cristale au fost lovite. Apare apoi deasupra lor.

### Nivelul 11: Vulcanul Adormit (`volcano`)

**Ideea:** bolovanul. Singur nu-l misti. Impreuna, da.

| | |
|---|---|
| Locul | Coasta unui vulcan, in amurg. Piatra neagra-violet (nu neagra: `#3A2A4A`), rauri de lava care lumineaza, cenusa care pluteste in sus, castelul lui George in departare, pe varf. |
| Banda A | `lava`, lata de 160, `boulder1`. Bolovanul sta la 320 de rau, pe un sant. Impins de amandoi, cade in lava si face pod. |
| Banda B | `lava`, lata de 240, `boulder2`. Santul are 640 si trece peste doua gheizere. |
| Gheizerele | `geysers: [3, 4, 5]` (cate pe zona). Raza 85. Liniste 3.5 - 5.5 s, apoi avertizare 1.4 s (crapaturile din pamant se aprind, bolboroseala), apoi izbucnire 0.9 s. Un erou in cerc la izbucnire e lovit. Pe Ușor: raza x 0.8, avertizarea x 1.4. Nu se pun la mai putin de 300 de start, de cuib sau de o intrare de mecanism. |
| Inamici | Roboti putini, cu scut termic (doar alt desen). Pe culoare, bulgari de lava racita care se rostogolesc (`roller: 'lavaball'`). |
| Invata | Sincronizarea: amandoi in acelasi loc, in acelasi moment. |
| Stele | Una pe o insula in lava (obiect aruncat). Una pazita. Una intr-un cotlon intre doua gheizere. |
| Jucaria nivelului | Un gheizer de abur, alb. Nu loveste: te ridica 2 secunde, iar camera se departeaza si arata tot nivelul. |

```js
{ key: 'volcano', music: 'l10', pal: 'volcano', look: 'diorama', ambient: '#E8B0A0', icons: ['boulder', 'geyser', 'egg'],
  trees: 10, rocks: 40, beetles: [1, 2, 3], lanes: [1, 1, 2], conesPerLane: 1, coneSpeed: 0.8, roller: 'lavaball', mud: [0, 0, 0], sparkle: [1, 1, 1], geysers: [3, 4, 5],
  bands: [{ at: 0.335, kind: 'lava', w: 160, mech: 'boulder1' }, { at: 0.665, kind: 'lava', w: 240, mech: 'boulder2' }],
  stars: ['islet', 'guarded', 'nook'], toy: 'steam' },
```

Paleta `volcano`: `g0 '#6A4A6A'`, `g1 '#5A3A5A'`, `canopy ['#C86A4A', '#E08A4A', '#8A5A8A', '#D8A04A']`, `flowers ['#FFD84A', '#FF9A5A', '#FF8AB8']`, `path '#A88A9A'`, `trunk '#4A3A5A'`, `rock '#7A5A7A'`. Lava: `#FFD84A` in miez, `#FF8A3A`, `#C8482A` la margine.

### Nivelul 12: Castelul lui George (`castle`)

**Ideea:** tot ce ati invatat, la un loc.

| | |
|---|---|
| Locul | Curtea castelului, noaptea. Ziduri de piatra cu steaguri roz (culoarea lui George), torte, statui cu George in toate marimile, soldati-soparla la creneluri. |
| Banda A | `wall` cu un grilaj, `combo1`. Doua tinte sub cupole de sticla. Boon calca placa turcoaz: cupola de pe tinta albastra se ridica, Killer o loveste. Apoi invers. |
| Banda B | `water` (santul castelului), lata de 400, `combo2`. Pluta si manivelele din nivelul 9. Doi soldati de pe zid arunca sulite spre cel care invarte, o data la 3 secunde, cu avertizare pe jos. Cine invarte e aparat chiar de rotirea lui. |
| Inamici | Roboti-garda (`sleeper: 'guard'`, cu coif si scut: doar alt desen). Pe culoare, butoaie care se rostogolesc (`roller: 'barrel'`). O pasare. |
| Cusca | Cea mai mare: doua stelute. |
| Stele | Una in spatele unui steag (cotlon). Una pazita de patru garzi. Una pe un turn (obiect aruncat). |
| Jucaria nivelului | Galeria de portrete ale lui George. Un portret lovit isi schimba fata: mustata, limba scoasa, ochelari. |

```js
{ key: 'castle', music: 'l11', pal: 'castle', night: true, look: 'diorama', ambient: '#B0A0E8', icons: ['door', 'spear', 'star'],
  trees: 16, rocks: 24, beetles: [3, 4, 5], sleeper: 'guard', lanes: [1, 2, 2], conesPerLane: 1, coneSpeed: 0.7, roller: 'barrel', mud: [0, 1, 1], slowKind: 'sand', slow: 0.4, sparkle: [1, 2, 2], lanterns: true, birds: 1,
  bands: [{ at: 0.335, kind: 'wall', w: 160, mech: 'combo1' }, { at: 0.665, kind: 'water', w: 400, mech: 'combo2' }],
  stars: ['nook', 'guarded', 'treetop'], toy: 'portraits', cageStars: 2 },
```

Paleta `castle`: `g0 '#54487C'`, `g1 '#463C6C'`, `canopy ['#E45AA0', '#B058B8', '#5A6FC8', '#D8704A']`, `flowers ['#FF8AB8', '#FFD84A', '#B09AFF']`, `path '#9A8AC0'`, `trunk '#5A4A7A'`, `rock '#8A80B8'`.

### Ce mecanica apare unde

| | Placi | Tinte | Pluta | Cristal carat | Bolovan | Benzi rulante | Intuneric | Gheizere | Fuga ajuta | Puterea 2 e necesara |
|---|---|---|---|---|---|---|---|---|---|---|
| 7 | A, B | | | | | | | | B | nu |
| 8 | | A, B | | | | da | | | | Boon (oase) |
| 9 | | | A, B | | | | | | | Killer (manusi), daca el invarte |
| 10 | | | | A, B | | | da | | de umbre | amandoi, pentru ciuperci |
| 11 | | | | | A, B | | | da | de gheizere | nu |
| 12 | A | A | B | | | | | | | amandoi |

---

## 5. George in mini-lupte, nivelurile 7 - 12

Regulile de acum raman (`11-mini-lupte.md`): se odihneste cat un erou e jos, mila, "Acum!" si "Încă nu!", Ușor / Normal / Greu. Se adauga sase randuri in `DUEL_DEFS_L` si trei atacuri noi.

In Partea a doua George poarta coroana de tinichea si, pe fiecare nivel, ceva din locul acela: o esarfa de vant, ochelari de sudura, un colac, o lampa de miner, o casca de pompier, armura.

```js
{ id: 'george', pats: ['charge', 'hop'], speed: 190, dashes: 2, lobs: 3, hops: 2, shock: 150, r: 44, size: 1.20 },                 // level 7
{ id: 'george', pats: ['shield', 'charge'], speed: 195, dashes: 2, lobs: 2, r: 44, size: 1.26 },                                   // level 8: the two-colored shield
{ id: 'george', pats: ['hop', 'grab'], hops: 3, shock: 160, r: 44, size: 1.32 },                                                   // level 9: he grabs a hero
{ id: 'george', pats: ['grab', 'shield'], shots: 6, r: 44, size: 1.38 },                                                           // level 10: in the dark
{ id: 'george', pats: ['hop', 'shield', 'charge'], hops: 3, shots: 8, shock: 170, speed: 200, dashes: 2, r: 44, size: 1.44 },      // level 11
{ id: 'george', pats: ['summon', 'grab', 'shield', 'hop'], hops: 3, shots: 8, shock: 175, speed: 205, dashes: 2, lobs: 3, r: 44, size: 1.50 }   // level 12: everything
```

Inimi (`CONFIG.lupta`): `duelHp` devine `[3, 3, 4, 5, 5, 6, 5, 5, 6, 6, 6, 7]`, `duelFinalHp` devine `[5, 6, 6, 7, 8, 9, 7, 8, 8, 9, 9, 10]`. In `startDuel`, limita `clamp(..., 2, 9)` urca la 12. Inimile nu cresc mult in Partea a doua: atacurile noi cer colaborare, iar cele 10 secunde fac fiecare greseala mai scumpa.

### Atacul `shield` (scutul in doua culori)

1. George ridica un scut rotund, jumatate turcoaz, jumatate albastru. Cat il tine, nimic nu il loveste si paseste incet spre eroul tinta.
2. Un obiect sau o rotire a lui Boon stinge jumatatea turcoaz. A lui Killer, pe cea albastra. Ordinea nu conteaza.
3. Cand amandoua sunt stinse, scutul se sparge si George e obosit (`tired`) de 1.5 ori mai mult decat de obicei.
4. Daca in 9 secunde scutul nu e spart, George il coboara singur si trece la atacul urmator (lupta nu se opreste niciodata aici).
5. Cu un singur jucator: orice lovitura stinge ambele jumatati.

### Atacul `grab` (te prinde)

1. Avertizare 1.2 s: George isi intinde bratul si o umbra de mana apare pe jos, sub eroul tinta.
2. Daca eroul e inca acolo, George il ridica in pumn (`h.held = true`). Eroul nu e lovit, nu pierde cristale, nu are numaratoare. Se zbate si striga `help`.
3. Prietenul are 5 secunde sa il loveasca pe George, cu orice. O lovitura: George scapa eroul, e obosit, iar lovitura conteaza.
4. Altfel George il pune jos cu un bobarnac: abia atunci eroul e lovit (`hitHero`).
5. Rotirea (ghearele, manusile) pornita in timpul avertizarii te apara: mana se inchide in gol.
6. Cu un singur jucator: acest atac e inlocuit cu `charge`.

### Atacul `summon` (cheama ajutoare)

George urla si doi roboti-garda cad din cer langa el (cu avertizare pe jos). Sunt inamici mici obisnuiti (doua lovituri). Cel mult doi deodata. Dispar cand lupta se termina.

### Schimbari in `075-duel.js`

- `duelDefs()` are 12 randuri pentru al doilea joc. `L.idx` e numarul nivelului (0 - 11).
- Starile noi din `updateDuel`: `shield`, `grabWarn`, `grabHold`, `summon`. Fiecare se opreste si trece in `tired` cand `duelWaiting()` e adevarat, ca atacurile de acum.
- `duelCanHurt(k, how)`: cat scutul e sus, intoarce fals, iar lovitura merge la scut.
- `DUEL_PAINT.george`: scutul, bratul lung, accesoriul nivelului.
- `tests/mini-lupte-bot.js`: botul invata sa sparga scutul (fiecare erou isi loveste jumatatea) si sa isi scape prietenul din pumn.

---

## 6. Sala Tronului: Robo-George

Capitolul 14. Un ecran fix de 1920 x 1080, ca arenele de acum (`genThrone()`, dupa modelul lui `genArena()`).

**Locul:** o sala rotunda in varful vulcanului. Podea de piatra cu un mozaic curcubeu. Ferestre inalte prin care se vede lava. Zece custi mici atarna de tavan: sapte goale, trei cu stelute. In mijloc, Robo-George: un robot urias facut din fiare, cu un geam in piept prin care se vede George, mic, tragand de manete.

**Mersul luptei:** sase lovituri, in trei faze de cate doua. Fiecare faza cere alt fel de colaborare. Se foloseste masina de stari a boss-ului de acum (`up`, `falling`, `down`, `won` in `updateBoss`), cu o conditie noua de "dat jos" pe fiecare faza.

| Faza | Lovituri | Cum il dati jos | Cum il loviti cat e jos | Ce face el |
|---|---|---|---|---|
| 1. Picioarele | 1, 2 | Amandoi folositi o rotire langa picioarele lui, la cel mult 1.5 s unul de altul. (Bubuie, un picior cedeaza.) | Orice obiect aruncat in geamul din piept. | Calca: unda rotunda pe podea, cu avertizare. Arunca suruburi. |
| 2. Scutul | 3, 4 | Ridica doua scuturi, unul turcoaz si unul albastru. Fiecare il sparge pe al lui (ca la atacul `shield`). | La fel. | Trage o raza care matura sala: o linie de avertizare se roteste, apoi raza o urmeaza. Cheama doi roboti. |
| 3. Inima | 5, 6 | Din tavan cade Cristalul-Soare. Unul il cara pana la tunul de lumina din marginea salii. Celalalt il apara. Tunul trage si Robo-George cade. | Amandoi il loviti, fiecare cu un obiect, la cel mult 2 s unul de altul. | Tot ce stie, mai repede. Soldatii arunca sulite. Incearca sa il prinda pe cel cu cristalul (`grab`). |

Dupa fiecare lovitura se elibereaza ceva: dupa a 2-a, a 4-a si a 6-a, cate o steluta.

Regulile comune raman: ajutorul cu ○ in 10 secunde, reinceperea luptei de la inceput, pauza cat un erou e jos (nu arunca nimic nou).

```js
// in CONFIG.lupta
boss2: {
  hits: 6,
  downTime: 6,                         // seconds he stays down
  together: 1.5,                       // phase 1: both spins within this many seconds
  bothHit: 2,                          // phase 3: both thrown things within this many seconds
  stompEvery: [3.2, 2.8], boltEvery: [2.6, 2.2],
  beamSpeed: 0.5,                      // phase 2: radians per second
  cannon: { x: 300, y: 860 },
  size: 2.2                            // how big Robo-George is drawn
},
```

Cu un singur jucator (G6): "amandoi" devine "o data", scuturile cad la orice lovitura, eroul fara jucator apara singur cristalul stand langa purtator.

La victorie: robotul se desface bucata cu bucata (opriri scurte, zguduiri). George cade pe podea, mic, se uita in jur, sare pe o racheta de jucarie si iese pe fereastra. Cele trei custi se deschid.

---

## 7. "Va urma" si finalul nou

**Dupa Arena lui George** (capitolul 7): finalul de acum, Petrecerea Curcubeu, ramane intreg, pentru ca e cel cerut de copii. Se schimba doar sfarsitul lui (`updateEnding`, `drawEndingL`):

| Secunda | Ce se intampla |
|---|---|
| 0 - 12 | Ca acum: medalii, stelute care imbratiseaza, "Bravo, Boon și Killer!". |
| 12 | In loc de "Sfârșit": cerul se intuneca, luminile petrecerii palpaie. |
| 13.5 | Masina zburatoare a lui George trece peste ecran. Plasa coboara. |
| 15 | Stelutele sunt in plasa. George rade (urletul lui, scurt). Pleaca spre dreapta-sus. |
| 16.5 | Textul "Va urma..." si, dedesubt, "Partea a doua: Stelele furate". |
| 18 | "✕ pentru a porni după el". ✕ duce la capitolul 8 (nivelul 7). |

Daca Partea a doua a fost deja terminata, rejucarea Arenei din "Capitole" arata tot aceasta scena.

**Dupa Sala Tronului** (capitolul 14): "Marea Petrecere". Aceeasi scena de petrecere, la rasarit in loc de noapte, cu zece stelute in loc de cele din Partea intai, cu cei doi eroi purtati pe sus de stelute, si cu George in departare, mic, pe racheta lui. Textele: "Ați eliberat toate stelele!", totalul de cristale, de stele si de medalii din toate cele 14 capitole, apoi "Sfârșit". ✕ duce la ecranul de start. Progresul nu se sterge (`24-sisteme-noi.md`, S5.5).

**Stelutele in HUD:** in nivelurile 7 - 12 si in Sala Tronului, sub insigna din stanga, zece stelute mici pe un rand. Cele eliberate sunt aurii si au fata. Celelalte sunt doar un contur lila. Numarul lor se socoteste din capitolele terminate, nu se salveaza separat.

---

## 8. Texte noi (romana si engleza)

Toate merg in `STR`, cu prefixul `L:` acolo unde cheia exista si in primul joc. `{0}` este un nume sau un numar.

| Cheie | Romana | Engleza |
|---|---|---|
| `lvl.canyon.name` | Canionul Podurilor de Lumină | The Canyon of Light Bridges |
| `lvl.canyon.intro` | George cel Rău s-a întors și a furat steluțele! Porniți după el. Aveți puteri noi: apăsați □. Boon aruncă oase-bumerang. Killer își învârte mănușile. Apăsați stick-ul ca să fugiți. Dacă prietenul e lovit, aveți zece secunde: ○! | George the Bad came back and stole the little stars! Go after him. You have new powers: press □. Boon throws boomerang bones. Killer spins his gloves. Press the stick to run. If your friend gets hit you have ten seconds: ○! |
| `lvl.works.name` | Atelierul lui George | George's Workshop |
| `lvl.works.intro` | Aici își face George roboții. Țintele turcoaz sunt ale lui Boon. Cele albastre sunt ale lui Killer. Loviți-le împreună și ușa se deschide. | This is where George builds his robots. The turquoise targets are Boon's. The blue ones are Killer's. Hit them together and the door opens. |
| `lvl.lake.name` | Lacul Nuferilor Uriași | The Lake of Giant Lilies |
| `lvl.lake.intro` | Lacul e prea adânc. Unul urcă pe plută. Celălalt învârte manivela cu puterea lui care se rotește. Apoi faceți schimb. | The lake is too deep. One of you climbs on the raft. The other turns the crank with the power that spins. Then swap. |
| `lvl.cave.name` | Peștera Ecoului | The Echo Cave |
| `lvl.cave.intro` | E întuneric, iar umbrele nu iubesc lumina. Unul duce Cristalul-Soare. Celălalt îl apără și aprinde ciupercile. Rămâneți împreună! | It is dark, and the shadows do not like light. One of you carries the Sun Crystal. The other protects and lights the mushrooms. Stay together! |
| `lvl.volcano.name` | Vulcanul Adormit | The Sleeping Volcano |
| `lvl.volcano.intro` | Bolovanul e prea greu pentru unul singur. Împingeți-l amândoi în râul de lavă. Atenție la gheizere: pământul se aprinde înainte să izbucnească. | The boulder is too heavy for one. Push it together into the river of lava. Watch the geysers: the ground glows before they burst. |
| `lvl.castle.name` | Castelul lui George | George's Castle |
| `lvl.castle.intro` | Ați ajuns! În castel e nevoie de tot ce ați învățat: plăci, ținte, pluta. Două steluțe vă așteaptă în cușcă. | You made it! The castle needs everything you have learned: plates, targets, the raft. Two little stars are waiting in the cage. |
| `lvl.throne.name` | Sala Tronului | The Throne Hall |
| `lvl.throne.intro` | George s-a urcat într-un robot uriaș! Doar împreună îl puteți opri. Loviți-l de {0} ori. | George climbed into a giant robot! Only together can you stop him. Hit him {0} times. |
| `ban.gate` | Poarta s-a deschis! | The gate is open! |
| `ban.gateAuto` | Poarta s-a deschis singură. | The gate opened by itself. |
| `ban.together` | Împreună! | Together! |
| `ban.cage` | Bate palma! Loviți cușca amândoi. | High five! Hit the cage together. |
| `ban.starFree` | O steluță e liberă! | A little star is free! |
| `ban.starsFree` | Două steluțe sunt libere! | Two little stars are free! |
| `ban.run` | Fugiți! ◉ | Run! ◉ |
| `ban.grab` | George l-a prins pe {0}! Lovește-l! | George grabbed {0}! Hit him! |
| `ban.dark` | Rămâi în lumină! | Stay in the light! |
| `mech.yours` | Al tău | Yours |
| `next.title` | Va urma... | To be continued... |
| `next.sub` | Partea a doua: Stelele furate | Part Two: The Stolen Stars |
| `next.go` | ✕ pentru a porni după el | ✕ to go after him |
| `fest2.bravo` | Ați eliberat toate stelele! | You freed all the stars! |
| `fest2.v1` | Robo-George s-a făcut bucăți, iar George a fugit pe o rachetă de jucărie. | Robo-George fell to pieces, and George ran away on a toy rocket. |
| `fest2.v2` | Steluțele sunt libere. Bravo, {0} și {1}! | The little stars are free. Bravo, {0} and {1}! |
| `duel.shield` | Spargeți scutul: fiecare culoarea lui! | Break the shield: each your own color! |

Textele despre butoane, capitole si reincepere sunt in `24-sisteme-noi.md` (S1 si S5).

Iconite noi pentru povestea nivelului (`drawIntroIconL`): `plate`, `bridge`, `target`, `gear`, `raft`, `crank`, `orb`, `shade`, `boulder`, `geyser`, `spear`. Fiecare e pictorul obiectului, micsorat.

---

## 9. Sunete

Regula 5 ramane: sinus, triunghi, zgomot filtrat, reverberatie. Nimic aspru, nimic care sperie. Fiecare sunet nou se adauga in `fx` (sau `fx2`, daca tine doar de al doilea joc) din `03-audio.js` si se masoara cu `sunete-volum.js` si `sunete-limita.js`.

### Efecte

| Nume | Cand | Cum se face |
|---|---|---|
| `dash` | porneste fuga | zgomot trece-banda care urca de la 600 la 1800 Hz, 0.18 s |
| `bone` | Boon arunca oasele | trei note de triunghi 180, 160, 140 Hz, cu tremur de 14 Hz |
| `tock` | un os loveste un perete | sinus 520 Hz, coada 0.06 s, si un clic filtrat |
| `gloves` | manusile lui Killer | doua "fuip" (zgomot 500 -> 1400 Hz) si un scartait (sinus 900 -> 700 Hz) |
| `tick` | fiecare secunda din numaratoare | sinus 660 Hz, 0.05 s. In ultimele trei: 880 Hz |
| `retry` | nivelul reincepe | trei note de kalimba care coboara: sol, mi, do |
| `no` | tinta gresita, capitol incuiat | doua note moi care coboara o terta mica |
| `plate` | placa apasata | clic de piatra (zgomot trece-jos, 0.04 s) si un clopotel (sinus 1320 Hz, coada 0.5 s) |
| `target` | tinta aprinsa | doua sinusuri la o cvinta (392 si 588 Hz), coada 0.6 s |
| `crank` | o tura de manivela | patru clicuri de lemn, 300 -> 420 Hz |
| `gateOpen` | poarta se deschide | un acord care urca (do, mi, sol, do) pe clopotei de sticla, si un fosnet |
| `bridge` | o scandura de lumina apare | o nota de sticla. Cele sapte scanduri canta o gama. |
| `raft` | pluta se misca | apa: zgomot trece-banda 300 - 700 Hz cu tremur lent, 0.8 s |
| `orbUp`, `orbDown`, `orbPass` | cristalul ridicat, pus, aruncat | un acord luminos care urca, coboara, aluneca |
| `rumbleRoll` | bolovanul se misca | triunghi 55 Hz cu tremur de 9 Hz, cat tine miscarea |
| `splash` | bolovanul cade in lava | zgomot trece-jos care coboara, 0.5 s, si un "fss" |
| `geyserWarn`, `geyser` | gheizerul avertizeaza, izbucneste | bolboroseala (sinusuri scurte la intamplare, 200 - 400 Hz), apoi zgomot trece-banda care urca |
| `shade` | o umbra se sperie de lumina | un "iii" scurt care coboara (sinus 900 -> 500 Hz) |
| `shroom` | o ciuperca-felinar se aprinde | sinus 880 Hz cu o octava deasupra, coada 0.4 s |
| `shieldUp`, `shieldHalf`, `shieldBreak` | scutul lui George | un zumzet cald, un clinchet, sticla care se sparge bland (5 note scurte, la intamplare, sus) |
| `grab` | George prinde un erou | un "hop" jos, apoi un "uuu" care urca |
| `cage` | cusca se deschide | lacat (doua clicuri) si un arpegiu vesel |
| `starFree` | steluta zboara in HUD | cinci note care urca repede, cu ecou |
| `chime0` - `chime4` | cristalele cantatoare | do, re, mi, sol, la, pe clopotei de sticla |
| `beam` | raza lui Robo-George | un sinus jos (110 Hz) cu un "uuu" deasupra, cat tine raza |
| `robotFall` | Robo-George cade | sase bufnituri moi, tot mai jos, si piese care zornaie (clicuri la intamplare) |

### Cuvinte noi ale eroilor

Limba inventata a eroilor (`BABBLE`) are acum 33 de cuvinte pe erou. Se adauga, in acelasi format (o lista de silabe `[vocala, semiton, durata, alunecare]`):

| Cuvant | Cine | Cand |
|---|---|---|
| `run` | toti patru eroii | porneste fuga (cel mult o data la 6 s) |
| `hurry` | toti patru | prietenul mai are 3 secunde |
| `retry` | toti patru | pe ecranul "Încă o dată!" (un oftat scurt si un "hai!") |
| `power2`, `power2Big` | Boon, Killer | a doua putere, scurta si incarcata |
| `gate` | Boon, Killer | o poarta se deschide |
| `plate` | Boon, Killer | calca pe placa lui |
| `together` | Boon, Killer | impinge singur bolovanul; loveste singur cusca |
| `carry` | Boon, Killer | ridica Cristalul-Soare |
| `pass` | Boon, Killer | arunca cristalul prietenului |
| `ride` | Boon, Killer | pluta pleaca cu el |
| `dark` | Boon, Killer | iese din lumina in pestera |
| `held` | Boon, Killer | George l-a prins |
| `starFree` | Boon, Killer | o steluta e libera |

Boon si Killer ajung la 47 de cuvinte, Bubu si Leo la 36. `tests/sunete-personaje.js` verifica deja ca niciun cuvant nu e la fel cu altul, nici in acelasi joc, nici in celalalt.

### Muzica si ambianta

Sapte melodii noi in `SONGS`, in formatul de acum (`{ root, sc, bpm, seed, ... }`), si sapte ambiante in `AMBS`:

| Cheie | Nivel | Caracter | Ambianta |
|---|---|---|---|
| `L:l6` | 7 | majora, luminoasa, 96 bpm, clopotei de sticla si flaut moale | vant, pasari de dimineata |
| `L:l7` | 8 | sacadata, 104 bpm, cu "tic-tac" de toba mica | roboti, zumzet, clinchete |
| `L:l8` | 9 | lenta, 76 bpm, harpa si clopotei | apa, broaste, greieri |
| `L:l9` | 10 | putine note, 68 bpm, cu ecou lung | picaturi cu ecou, vant slab |
| `L:l10` | 11 | minora, 110 bpm, toba de jungla | foc, bolboroseala, vant |
| `L:l11` | 12 | mars glumet, 112 bpm | torte, pasi departe, steaguri |
| `L:boss2` | Sala Tronului | minora, 124 bpm, toba si shaker, cu o tema care se intoarce din `L:boss` | foc, zumzet de masina |

Straturi noi de ambianta de facut: `drips` (picaturi cu ecou), `birdsong`, `hum` (zumzet jos), `bubbles`.

---

## 10. Decor si numarul de elemente

Regula celor "minimum 10.000 de elemente" se aplica pentru fiecare sase niveluri (H1). Fiecare nivel nou are `decorPerLevel` (1700) lucruri mici, ca cele de acum.

Decorul Partii a doua are tabela lui, `DECOR_WEIGHT_L2`, cu 13 feluri noi. Fiecare nivel foloseste 8 - 9 din ele (campul `decor` din definitie, o lista de nume). Daca lipseste, se folosesc toate.

| Reactioneaza (desenate la fiecare cadru) | Stau pe loc (pictate in fundal) |
|---|---|
| iarba inalta de canion, clopotel de sticla (suna incet cand treci), surub care se roteste, nufar mic (se scufunda si revine), ciuperca-felinar mica (clipeste), fir de abur, stegulet, licurici auriu | pietricica rosie, piulita, scoica, ciob de cristal, cenusa |

Obiectele mari, pictate cu lumina si materiale (`24-sisteme-noi.md`, S7): cate 6 - 10 pe nivel, in fundal, si 4 - 8 in planul din fata.

`tests/numara-elemente.js` trebuie sa dea: primul joc neschimbat (11.430), al doilea peste 22.000 (acum 11.462).

---

## 11. Teste noi pentru niveluri

| Test | Ce verifica |
|---|---|
| `mecanisme.js` | Pentru fiecare nivel 7 - 12 si fiecare poarta: (1) inchisa la inceput, nu se poate trece; (2) cu un singur erou facandu-si partea, ramane inchisa; (3) cu amandoi, se deschide; (4) regulile G1 - G10, una cate una; (5) cu un singur jucator, se deschide (G6); (6) lasata in pace, se deschide singura dupa `autoOpen` (G7). |
| `nivele-bot-mers.js` (extins) | Botii termina toate cele 12 niveluri, folosind `mechSteps`. Niciun blocaj mai lung de 20 de secunde. |
| `mini-lupte-bot.js` (extins) | 12 niveluri x 2 lupte x 6 combinatii de dificultate = 144 de lupte in al doilea joc. Toate castigate. Niciuna peste 180 de secunde. |
| `joc-complet-bot.js` (extins) | De la capitolul 1 la finalul nou, prin scena "Va urma". |
| `sala-tronului.js` | Fiecare faza: nu se poate trece cu un singur erou (in doi jucatori), se poate cu amandoi, se poate cu un singur jucator. |
| `stil-grafic.js` | Pentru fiecare nivel nou, o captura. Scriptul numara pixelii negri sau gri (R, G, B egale si sub 200): trebuie sa fie sub 0.1%. Restul listei din S7.8 se verifica cu ochiul. |
| `performanta.js` (extins) | Fiecare nivel nou, fata de nivelul 6 masurat in aceeasi rulare: cel mult 20% in plus. |
| `capturi-ecran.js` (extins) | Capturi `p2_*` pentru fiecare nivel nou: inceput, poarta A, poarta B, lupta, cusca. Pentru Sala Tronului: fiecare faza. |

Ce nu pot verifica testele, si trebuie spus la fiecare etapa: daca mecanismele sunt intelese de un copil de 6 ani fara ajutor, daca 10 secunde sunt prea putine sau prea multe, daca fuga strica luptele, cum se simt vibratiile noi in mana, cum suna totul.
