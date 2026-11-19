# 03. CONFIG

> **Din 18 noiembrie 2026 exista un singur joc: "Cea mai grea luptă".** "Bubu și Leo" a fost scos (vezi `16-decizii.md`, "Un singur joc"). Orice schimbare se face doar in "Cea mai grea luptă". Ce scrie mai jos despre primul joc, despre alegerea jocului sau despre "ambele jocuri" este istoric.

`CONFIG` este primul lucru din cod (`src/01-config.js`). A fost cerut explicit: "Put a CONFIG object at the top of the code ... so I can easily make changes the kids ask for". Aici sunt toate valorile care se pot schimba fara sa intelegi restul codului.

Dupa o schimbare: salvezi, rulezi `./build.sh`, reincarci pagina. Daca modifici direct fisierul din `game/` (fara build), cauti `const CONFIG = {` la inceputul scriptului. Merge si asa, dar schimbarea se pierde la urmatorul build.

Valorile exacte de acum sunt si in [anexa D](anexe/D-config.md), generata din cod.

Unitatile: distantele sunt in unitati logice (ecranul are 1920 x 1080, un nivel 3200 x 1800). Timpii sunt in secunde. Vitezele sunt unitati pe secunda.

## Nume si limba

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `villainName` | `'Ciori'` | Numele ciorii in vocea de la festival. | Numele din cerere. Celelalte texte cu Ciori sunt in `STR`. |
| `language` | `'ro'` | Limba la prima pornire: `'ro'` sau `'en'`. | Cererea initiala: totul in romana. Engleza a fost ceruta mai tarziu ca optiune. Dupa prima alegere din Setari conteaza valoarea salvata. |

## Eroii: `heroes[0]` este Bubu, `heroes[1]` este Leo

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `name` | `'Bubu'`, `'Leo'` | Numele afisat. | Din cerere. |
| `color` (Bubu) | `#F08A3C` | Corpul lui Bubu, inelul de sub el, cardul de pe ecranul de start, insigna din HUD, sageata lui. | Portocaliu cald. Cerut: "Bubu = orange". |
| `color2` (Bubu) | `#6FA35E` | Petele. | Verde salvie, cerut: "green spots". Mai stins decat un verde pur, ca sa ramana in paleta calda. |
| `scarf` | `#D9463C` | Esarfa. | Rosu caramiziu, cerut: "tiny red scarf". |
| `color` (Leo) | `#F6C63C` | Tricoul, inelul, insigna, sageata lui. | Galben miere, cerut: "yellow-and-blue kit". |
| `color2` (Leo) | `#3F78C8` | Sortul, gulerul, al doilea inel. | Albastru. Al doilea inel albastru il deosebeste de Bubu chiar si pentru cine nu deosebeste bine portocaliul de galben. |
| `headband` | `#D9463C` | Bentita. | Acelasi rosu ca esarfa, ca cei doi sa para din aceeasi carte. |
| `speed` | 330 (Bubu), 350 (Leo) | Viteza de mers. | Leo e putin mai rapid. Bubu e mai greoi, ca un dinozaur. Diferenta e mica, ca cel mic sa nu ramana in urma. |
| `stompRadius` | 280 | Raza in care tropaitul ameteste inamicii si scutura copacii. | Mare, ca un copil de 6 ani sa nimereasca fara sa tinteasca. |
| `pullRadius` | 360 | Raza din care ouale zboara spre Bubu dupa tropait. | Mai mare decat raza de ametire: tropaitul e si unealta de adunat. |
| `stompCooldown` | 0.7 | Pauza minima intre doua tropaituri. | Destul de scurta ca sa nu para ca butonul nu merge. Destul de lunga ca apasatul continuu sa nu acopere ecranul de unde. |
| `stunTime` | 2.8 | Cat stau ametiti inamicii dupa tropait. Pe "Ușor" se inmulteste cu 1.3. | Timp sa treci pe langa ei. |
| `kickSpeed` | 760 | Viteza mingii la o apasare scurta. | Utila fara indemanare. |
| `kickSpeedMax` | 1400 | Viteza la sutul incarcat complet. | Aproape dubla, ca diferenta sa se simta. |
| `chargeTime` | 0.9 | Cat tii ✕ ca sa incarci complet. | Sub o secunda: un copil de 8 ani are rabdare pentru asta. |
| `ballLife`, `ballLifeMax` | 2.3, 3.8 | Cat zboara mingea dupa sut (scurt, plin). Apoi se intoarce singura la Leo. | Mingea nu se pierde niciodata. |

## Lungimea jocului

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `levels` | 6 | Cate niveluri sunt inainte de boss (1 pana la 12). Peste 6, definitiile se repeta. | Cerere: 6 niveluri plus boss. |
| `levelDuration` | 360 | Durata tinta a unui nivel. Numarul de oua se calculeaza din ea. Soarele din HUD apune in acest timp. Dupa ea indiciile apar mereu si raza de adunare creste x 1.5. | Cerere: 5 pana la 7 minute pe nivel. |
| `eggsPerMinute` | 10 | Oua pe nivel = `levelDuration / 60 * eggsPerMinute` = 60. | La prima versiune era 8. Am crescut la 10 ca nivelul sa fie mai plin. |
| `wavesPerLevel` | 3 | Ouale apar in atatea valuri, de la stanga la dreapta. Fiecare val e o treime din harta. | Copiii vad mereu un tinta apropiata, nu 60 de oua imprastiate. Le da si un ritm: val, Ciori trece pe cer, val nou. |
| `starsPerLevel` | 3 | Stele bonus pe nivel (0 pana la 3). | Din cerere. |
| `giantEggValue` | 20 | Cat valoreaza oul urias din pestera. | Destul ca sa merite cautat, nu atat incat sa conteze mai mult decat restul nivelului. |

## Dificultatea: `difficulty.easy`, `.normal`, `.hard`

Fiecare jucator alege a lui. Valorile se aplica jucatorului care le-a ales.

| Cheie | Ușor | Normal | Greu | Ce face |
|---|---|---|---|---|
| `enemySpeed` | 0.55 | 1.0 | 1.3 | Inmultitor pentru viteza gandacilor si conurilor din jurul jucatorului (raza 460). Cand doi jucatori sunt aproape, conteaza cel mai bland. |
| `pickupRadius` | 105 | 64 | 54 | Cat de aproape trebuie sa fii de un ou ca sa il iei. |
| `dizzyTime` | 1.0 | 2.0 | 2.4 | Cat dureaza ameteala dupa o lovitura. |
| `wakeRadius` | 0.75 | 1.0 | 1.25 | Inmultitor pentru distanta la care se trezesc gandacii. |
| `wind` | 0.5 | 1.0 | 1.25 | Cat te impinge vantul. |
| `ballSize` | 1.3 | 1.0 | 1.0 | Raza mingilor lui Leo se inmulteste cu aceasta valoare. Pe Ușor mingile sunt mai mari, ca sa le prinzi mai usor. (Inlocuieste vechiul `aimAssist`, scos din update.) |
| `ballSpeed` | 0.85 | 1.0 | 1.0 | Viteza mingilor lui Leo se inmulteste cu aceasta valoare. Pe Ușor zboara mai incet. |

Pe langa acestea, dificultatea mai schimba (in cod, nu in CONFIG):

- Mini-luptele: inimile paznicului (-1 pe Ușor, +1 pe Greu, dupa cel mai greu jucator conectat), viteza lui, cat sta obosit, cate atacuri face la rand. Vezi `11-mini-lupte.md`.
- Boss-ul: cat zboara conurile spre tine (1.9 s, 1.4 s, 1.15 s) si cat sta Ciori jos (x 1.35, x 1, x 0.8 dupa dificultatea lui Leo).

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `defaultDifficulty` | `['easy', 'normal']` | Dificultatea la prima pornire, pentru Bubu si Leo. | Bubu e jucat de cel mic. |
| `guideArrow` | `[true, false]` | Sageata ajutatoare pornita sau nu, pentru Bubu si Leo. | Ceruta pentru cel de 6 ani. Cel de 8 ani nu are nevoie. Se schimba din Setari. |

`"Greu"` a fost adaugat in al doilea update, cand cel de 8 ani a spus ca jocul nu e destul de provocator.

## Obstacole

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `beetleSpeed` | 150 | Viteza gandacului care te urmareste. | Mai lent decat eroii (330, 350): poti mereu sa scapi. |
| `beetleWakeRadius` | 205 | Distanta la care se trezeste un gandac. | Trebuie sa treci aproape ca sa il trezesti. Poti ocoli. |
| `pineconeSpeed` | 165 | Viteza conurilor pe culoar. Unele niveluri o inmultesc (`coneSpeed` 0.75 pe pajiste). | Destul de lent ca sa vezi conul venind. |
| `mudSlow` | 0.45 | Viteza in noroi. | Se simte clar, dar nu te opreste. |
| `windEvery` | 9 | Secunde intre rafale (variaza intre x 0.8 si x 1.2). | Destul de rar ca vantul sa fie un eveniment, nu o pedeapsa continua. |
| `windDuration` | 2.6 | Cat sufla o rafala. | |
| `windForce` | 185 | Cat de tare impinge vantul (unitati pe secunda la putere 1). | Mai mic decat viteza eroilor: mersul impotriva vantului inca inainteaza. |

Inainte de fiecare rafala este 1 secunda de avertizare (sunet "whoosh" si frunze).

## Ajutoare

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `butterflyEvery` | `[40, 70]` | Fluturele apare la un interval intamplator intre 40 si 70 de secunde. Primul apare dupa 20 pana la 32 de secunde. | O surpriza de cateva ori pe nivel. |
| `butterflyBoost` | 1.5 | Inmultitorul de viteza. | |
| `butterflyTime` | 6 | Cat tine viteza. | |
| `hintAfter` | 10 | Dupa atatea secunde fara un ou, apare sageata aurie spre cel mai apropiat ou. | Copiii nu raman blocati. |

## Boss

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `boss.hits` | 5 | Cate suturi in cuib castiga lupta. (Era 3.) | Update 13 noiembrie: boss-ul mai greu. |
| `boss.shakes` | `[2, 2, 3, 3, 3]` | Cate tropaituri langa copac il dau jos pe Ciori, pe runda. (Era `[1, 2, 2]`.) | Fiecare runda cere mai multe tropaituri. |
| `boss.downTime` | 5 | Cat sta Ciori jos (momentul pentru sut). (Era 7.) | Fereastra mai scurta pentru sut. |
| `boss.throwEvery` | `[3, 2.5, 2.1, 1.8, 1.6]` | Secunde intre conurile aruncate, pe runda. (Era `[3.4, 2.7, 2.2]`.) | Conurile vin mai des. |

## Mini-lupte: `duel`

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `enabled` | `true` | `false` scoate mini-luptele. Cuibul se deschide imediat dupa ultimele oua. | Un comutator simplu daca nu plac. |
| `hp` | `[3, 3, 4, 4, 4, 5]` | Inimile paznicului pe fiecare nivel. Pe Ușor una mai putin, pe Greu una mai mult, minim 2. | Cresc spre final. |
| `tiredTime` | 2.4 | Cat sta paznicul obosit. Pe Ușor x 1.4, pe Greu x 0.75. Plus 0.7 daca s-a lovit de un perete. | Fereastra in care loviturile conteaza. |
| `eggsPerHit` | 4 | Oua care sar la fiecare lovitura. | Cel mic are de adunat in timp ce cel mare se lupta. Cerut explicit. |
| `eggsAtEnd` | 8 | Oua care sar la ultima lovitura. | Recompensa. |
| `finalHp` | `[5, 5, 6, 6, 7, 8]` | Inimile paznicului de la cuib, pe nivel (lupta a doua). | Update 13 noiembrie: lupta de la cuib e mai grea. |
| `finalSize` | 1.3 | Paznicul de la cuib e desenat si se loveste de atat de ori mai mare. | Cerut: "lupta mai grea". |
| `finalSpeed` | 1.25 | Inmultitor pentru viteza si atacurile paznicului de la cuib. | |
| `finalPrep` | 0.75 | Inmultitor pentru timpul de avertizare inainte de atac (mai scurt). | |
| `finalTired` | 0.75 | Inmultitor pentru cat sta paznicul obosit (fereastra mai scurta). | |
| `finalExtra` | 1 | Un atac in plus la fiecare runda. In plus, cand e suparat, inca unul. | |
| `angryAt` | 0.5 | Sub aceasta parte din inimi paznicul de la cuib se supara: un atac in plus si tremura ecranul putin. | |

## Control

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `deadzone` | 0.25 | Zona moarta a stick-ului. Codul foloseste minimum 0.25 chiar daca scrii mai putin. | Cerere: "deadzone at least 0.25". Controllerele vechi au stick-uri care nu revin perfect la centru. |
| `vibration` | `true` | Vibratiile pornite la prima pornire. | Se schimba din Setari. |
| `keys` | vezi mai jos | Tastele de la inceput, pentru jucatorul 1 si 2. | Din cerere: WASD + Spatiu, sageti + Enter. |

`keys` foloseste numele `KeyboardEvent.code`: `KeyW`, `ArrowUp`, `Space`, `Enter`. Asa tastele sunt aceleasi pe orice aranjament de tastatura (inclusiv romana). Tastele se pot schimba din Setari. "Tastele de la început" din Setari revine la aceste valori.

## Sunet

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `volume.music` | 0.5 | Volumul muzicii la prima pornire (0 pana la 1). | Cerere: muzica "low volume". In plus, muzica e inmultita cu 0.55 in cod. |
| `volume.ambient` | 0.7 | Sunetele lumii: pasari, apa, vant, inamici, meniuri. | |
| `volume.characters` | 0.8 | Sunetele eroilor: pasi, voci, puteri, oua. Si vocea care citeste povestea. | Cele mai importante pentru copii. |
| `footsteps` | `true` | Pasii eroilor. | Ceruti in al doilea update. Se pot opri daca devin obositori. |
| `voice` | `true` | Citirea cu voce a povestii nivelurilor. | Din cerere. Functioneaza doar daca macOS are o voce in limba aleasa. |
| `voiceRate` | 0.9 | Viteza vocii. | Putin mai rar decat normal, pentru copii. |

## Aspect

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `fontTitle` | `Georgia, "Times New Roman", serif` | Fontul titlurilor. | Un serif rotund, ca pe coperta unei carti. Exista pe orice Mac. |
| `fontUI` | `"Avenir Next", "Trebuchet MS", ...` | Fontul textelor mici. | Avenir Next e pe orice Mac si se citeste usor de departe. Restul sunt rezerve. |
| `maxRenderWidth` | 1920 | Latimea maxima reala a canvas-ului. | Pe un ecran Retina canvas-ul ar putea avea 3840 de pixeli latime. Limita tine jocul fluid. Coboara la 1600 sau 1280 daca Mac-ul se misca greu. |
| `saveKey` | `'bubu-leo-oua-de-aur-v1'` | Numele salvarii in `localStorage`. | Daca il schimbi, jocul porneste de la zero (salvarea veche ramane, dar nu mai e citita). |

## Valori noi din update-ul din 13 noiembrie 2026

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `nestSafe` | `true` | Cuibul e adapost pe tot nivelul: un erou in cuib nu e lovit si nu e luat de vant. | Cerut: "sa nu il ia vantul, sa nu poata fi lovit in niciun stadiu". |
| `nestSafeRadius` | 150 | Cat de aproape de centrul cuibului trebuie sa fii ca sa fii la adapost. (Era `duel.safeRadius`.) | |
| `nestHideSoundGap` | 3 | Secunde intre doua "ih-ih" cand eroii intra si ies din cuib in graba. | Sa nu se repete. |
| `heroes[1].ballsPerKick` | 8 | Cate mingi pleaca la o apasare de ✕, la distante egale in cerc. | Cerut: puterea in toate directiile. |
| `heroes[1].ballsPerKickMax` | 12 | Cate mingi pleaca la sutul incarcat complet. | |
| `heroes[1].kickCooldown` | 1.2 | Secunde dupa un sut in care o noua apasare cheama mingile inapoi. Dupa aceea, o apasare trage un sut nou. | |
| `decorPerLevel` | 1700 | Cate lucruri mici de decor are fiecare nivel (iarba, flori, pietre...). 6 niveluri x 1700 = 10.200. | Cerut: minim 10.000 de elemente. |
| `babble` | `true` | Personajele vorbesc in cuvintele lor inventate (30 pentru fiecare). `false` = doar sunetele efectelor. | Cerut: "un fel de limba a lor". |

## Valori noi din update-ul din 14 noiembrie 2026

Toate sunt comune celor doua jocuri, in afara de blocul `lupta`.

### Ajutorul: `rescue`

| Cheie | Valoare | Ce face | De ce |
|---|---|---|---|
| `enabled` | `true` | Un erou lovit asteapta pana il ajuta prietenul cu □. `false` = regula veche: se ridica singur dupa `dizzyTime`. | Cerut. |
| `reachNear` | 180 | Cat de aproape trebuie sa vina primul erou (Bubu, Boon) ca sa ajute. | Cerut: "tb sa vina aproape si îl vindeca cu mâinile". 180 = cam trei latimi de erou. La 130 botii nimereau greu locul langa un perete. |
| `reachFar` | 620 | De la ce distanta poate ajuta al doilea erou (Leo, Killer). | Cerut: "poate sta mai departe si ii da o minge magică". 620 = cam o treime din latimea ecranului. |
| `ballSpeed` | 900 | Viteza mingii magice. | Ajunge in mai putin de o secunda. |
| `safeAfter` | 2.6 | Secunde in care nimic nu il atinge pe eroul abia ridicat. | Cu 1.6 era lovit din nou inainte sa plece de langa inamic. |
| `bothDown` | 3 | Amandoi loviti: dupa atatea secunde se ridica singuri. | Altfel jocul s-ar opri. |
| `autoAfter` | 0 | Dupa cate secunde se ridica singur un erou. 0 = niciodata. | Cererea spune "pana când celălalt jucător nu vine". Reglajul exista daca asteptarea e prea lunga pentru cel mic. |
| `callEvery` | 5 | Secunde intre doua strigate dupa ajutor. | |

### Inamicii mici: `smallEnemy`

| Cheie | Valoare | Ce face |
|---|---|---|
| `hits` | 2 | Lovituri pana dispare un gandac sau un con (robot, melc, pasare in al doilea joc). |
| `respawn` | 22 | Secunde pana apare altul in locul lui. |

### Mila in mini-lupte: `duel.mercy`, `duel.mercyMax`

| Cheie | Valoare | Ce face |
|---|---|---|
| `mercy` | 0.06 | Pentru fiecare erou lovit intr-o lupta, paznicul avertizeaza cu 6% mai mult, e cu 3.6% mai incet si sta obosit cu 12% mai mult. 0 = oprit. |
| `mercyMax` | 10 | Se numara cel mult atatea lovituri. De la acest numar in sus, orice lovitura pe paznic conteaza, ca pe Ușor. |

De ce: cu regula ajutorului o lovitura costa mult mai mult timp decat inainte. Vezi `11-mini-lupte.md`.

### Tastele: `keys[k].b`

Tasta "Ajută prietenul": `KeyE` pentru primul jucator, `ShiftRight` pentru al doilea. (De la T2 ajutorul e pe butonul ○, nu pe □; numele campului a ramas `b`, ca salvarile vechi sa ramana bune.)

### Al doilea joc: `lupta`

Cat se joaca "Cea mai grea luptă", `lupta.heroes`, `lupta.villainName` si `lupta.boss` iau locul valorilor cu acelasi nume. Restul din `CONFIG` e comun. Fiecare valoare din `lupta` e explicata in `21-cea-mai-grea-lupta.md`, sectiunea "Reglaje".

Atentie: `heroes[0]` si `heroes[1]` din tabelele de mai sus sunt eroii primului joc. Pentru Boon si Killer schimbi `lupta.heroes[0]` si `lupta.heroes[1]`.

## Update 18 noiembrie 2026: `lupta.levels`

| Cheie | Valoare | Ce face |
|---|---|---|
| `lupta.levels` | 6 | Cate niveluri are al doilea joc. Partea a doua il creste cu fiecare nivel nou, pana la 12. Lista de capitole (`chapters()`) se face din el. |

`levels` (primul joc) ramane. `levelCount(id)` citeste valoarea jocului cerut.

## Update 18 noiembrie 2026 (T2): tastele noi si fuga

### Tastele: `keys[k].c` si `keys[k].r`

| Camp | Ce e | Jucatorul 1 | Jucatorul 2 |
|---|---|---|---|
| `a` | prima putere (butonul ✕) | `Space` | `Enter` |
| `b` | ajuta prietenul (butonul ○) | `KeyE` | `ShiftRight` |
| `c` | a doua putere (butonul □) | `KeyQ` | `Slash` |
| `r` | fuga (L3, apasarea stick-ului) | `ShiftLeft` | `AltRight` |

Butoanele de controller nu se regleaza. O salvare veche, fara `c` si `r`, primeste valorile de aici.

### Fuga: `sprint`

| Cheie | Valoare | Ce face |
|---|---|---|
| `enabled` | `true` | `false` opreste fuga cu totul. |
| `mult` | 3 | De cate ori mai repede. Cerere: "sa mearga mult mai repede (x3)". |
| `maxSpeed` | 1100 | Viteza nu trece niciodata de atat, nici cu racheta. |
| `mode` | `'click'` | `'click'`: o apasare, fuga tine pana lasi stick-ul. `'hold'`: numai cat L3 e apasat. |
| `stopAfter` | 0.25 | Secunde cu stick-ul in centru pana se opreste fuga. |
| `inDuel` | `true` | `false` = fara fuga in mini-lupte. |
| `max` | 0 | Secunde de fuga pana e nevoie de odihna. 0 = fara limita. |
| `rest` | 2 | Odihna, cand `max` nu e 0. |
| `step` | 12 | Cat de mult se misca eroul intr-un pas de coliziune. Vezi `10-gameplay.md`, "Fuga". |
| `wordGap` | 6 | Cel mult un cuvant "fug!" la atatea secunde. |

## Update 19 noiembrie 2026 (T3): puterile in `CONFIG`

Fiecare erou spune ce abilitate are pe fiecare buton:

```js
// CONFIG.heroes[0] (Bubu):        power: 'spin',  power2: null
// CONFIG.heroes[1] (Leo):         power: 'throw', power2: null
// CONFIG.lupta.heroes[0] (Boon):  power: 'spin',  power2: 'throw', throw: { ... }
// CONFIG.lupta.heroes[1] (Killer):power: 'throw', power2: 'spin',  spin:  { ... }
```

`throw` al lui Boon (oasele): `look: 'bone'`, `speed: 700`, `speedMax: 1250`, `charge: 0.9`, `n: 8`, `nMax: 12`, `cooldown: 1.2`, `life: 2.3`, `lifeMax: 3.8`.

`spin` al lui Killer (manusile): `look: 'gloves'`, `radius: 220`, `pull: 300`, `time: 0.85`, `cooldown: 1.6`, `stun: 2.8`.

Un erou fara bloc propriu foloseste numele vechi de pe el (`stompRadius`, `kickSpeed`...), prin `abil(k, kind)`. `power2: null` inseamna ca □ nu face nimic.
