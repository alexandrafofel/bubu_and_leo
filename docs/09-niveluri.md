# 09. Niveluri (`src/06-level.js`)

> **Din 18 noiembrie 2026 exista un singur joc: "Cea mai grea luptă".** "Bubu și Leo" a fost scos (vezi `16-decizii.md`, "Un singur joc"). Orice schimbare se face doar in "Cea mai grea luptă". Ce scrie mai jos despre primul joc, despre alegerea jocului sau despre "ambele jocuri" este istoric.

Nivelurile nu sunt desenate de mana. Sunt generate dintr-o samanta, cu reguli. Apoi un test verifica daca totul se poate atinge. Daca nu, se incearca alta samanta. La final fundalul se picteaza o singura data.

De ce generate: sase niveluri de 3200 x 1800 asezate de mana ar fi insemnat mii de coordonate. Cu reguli, fiecare nivel se schimba din cateva numere. Samanta fixa face ca nivelul sa arate la fel la fiecare joc.

## Definitiile: `LEVEL_DEFS`

| Cheie | Ce inseamna |
|---|---|
| `key` | Numele intern. Leaga nivelul de textele `lvl.<key>.name` si `.intro`. |
| `music` | Piesa din `SONGS`. |
| `pal` | Paleta din `PALS`. |
| `icons` | Cele trei iconite de pe cardul de poveste. |
| `trees`, `rocks`, `hay`, `mills` | Cati copaci, bolovani, capite de fan, mori. |
| `bigTrees` | Copaci mai mari (padurea). |
| `beetles` | Gandaci pe fiecare treime a hartii, de exemplu `[2, 4, 5]`. |
| `lanes` | Culoare de conuri pe fiecare treime. |
| `conesPerLane` | Conuri pe un culoar. |
| `coneSpeed` | Inmultitor de viteza a conurilor (lipsa = 1). |
| `mud` | Balti de noroi pe fiecare treime. |
| `sparkle` | Copaci care sclipesc (ascund oua) pe fiecare treime. |
| `river` | `'v'` = un rau de sus pana jos. `'fall'` = rau care incepe de la cascada. |
| `pond` | Un iaz (cu o stea pe o insula). |
| `cliff` | Faleza cu cascada si pestera (nivelul 5). |
| `wind` | Puterea rafalelor (lipsa = fara vant). |
| `lanterns` | Felinare de-a lungul drumului. |
| `stars` | Tipul celor trei stele: `islet`, `nook`, `guarded`, `treetop`. |
| `pathY` | Intre ce inaltimi trece drumul (implicit 740 pana la 1380). |

| Nivel | trees | rocks | hay | mills | beetles | lanes | cones/lane | mud | sparkle | special | stars |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 meadow | 30 | 5 | 8 | | 0,0,0 | 0,1,1 | 1 (x 0.75 viteza) | 0,0,0 | 0,1,1 | iaz | islet, nook, treetop |
| 2 forest | 105 | 8 | | | 2,4,5 | 0,0,1 | 1 | 0,0,0 | 2,3,3 | copaci mari | guarded, treetop, nook |
| 3 river | 40 | 10 | | | 1,1,2 | 1,1,2 | 1 | 3,5,4 | 1,1,2 | rau | guarded, islet, treetop |
| 4 hill | 18 | 20 | | 4 | 1,2,3 | 1,1,2 | 1 | 0,1,1 | 1,1,2 | vant 1 | nook, guarded, treetop |
| 5 fall | 46 | 12 | | | 2,2,3 | 1,1,2 | 1 | 1,2,2 | 1,1,2 | faleza, cascada, pestera | guarded, islet, nook |
| 6 sunset | 50 | 10 | | | 2,3,4 | 1,2,2 | 2 | 1,2,2 | 2,2,2 | vant 0.5, felinare, iaz | treetop, guarded, islet |

Fiecare nivel aduce un singur lucru nou mare. Gandacii apar abia in nivelul 2, noroiul in 3, vantul in 4. Cererea: "Each level introduces something new".

Numarul de gandaci creste spre dreapta (`[2, 4, 5]`): nivelul incepe usor si devine mai greu.

`levelCount()` = `CONFIG.levels`, intre 1 si 12. `levelDef(idx)` repeta definitiile daca sunt mai multe niveluri decat definitii.

## Paletele: `PALS`

Fiecare nivel are o paleta. Culorile sunt in `15-culori.md`.

| Camp | Ce coloreaza |
|---|---|
| `g0`, `g1` | Pamantul: gradient de sus (`g0`) in jos (`g1`) |
| `tints` | Petele de acuarela de pe pamant |
| `canopy` | Coroanele copacilor |
| `flowers` | Florile |
| `path` | Drumul |
| `trunk` | Trunchiurile |
| `rock` | Bolovanii si pietrele din rau |

## Grila

Nivelul are 80 x 45 de celule de 40 (`CS`). Fiecare celula are un tip in `L.grid` si niste semne in `L.flag`.

| `grid` | Inseamna | Eroii | Mingea |
|---|---|---|---|
| 0 | iarba | merg | trece |
| 1 | noroi | merg incet (x 0.45) | trece |
| 2 | apa | nu pot intra | trece |
| 3 | perete (copacii de sus, faleza) | nu pot intra | sare inapoi |
| 4 | interzis (doar la boss: zona copacului) | nu pot intra | trece |

| Bit in `flag` | Inseamna |
|---|---|
| 1 | aici nu se pun copaci (drum, start, cuib, culoare) |
| 2 | aici nu se pun oua |
| 4 | pestera |
| 8 | pod sau pietre de trecere |
| 16 | culoar de conuri |

`L.ci(x, y)` da celula unui punct.

## Generatorul: `genLevel(idx, seed)`

Pasii, in ordine. Daca un pas nu reuseste, functia intoarce `null` si `buildLevel` (in `07-play.js`) incearca alta samanta, de pana la 80 de ori.

1. **Marginea de sus**: primele 280 de unitati (520 la faleza) sunt perete. Acolo se picteaza cerul si dealurile.
2. **Drumul**: de la start (240, 1080) la cuib (2950, 1040), prin 4 puncte intamplatoare. La rau, drumul trece pe la mijloc, pe pod. Punctele sunt unite cu o curba Catmull-Rom (`spline`) si reesantionate la fiecare 26 de unitati. Langa drum (78), start (210) si cuib (200) nu se pun copaci.
3. **Apa**: raul (latime 156, serpuit cu doua sinusoide), cascada si lacul de sub ea, iazul. Peste rau: un pod (pe drum) si pana la doua treceri de pietre.
4. **Stelele**, cate una pe fiecare treime:
   - `islet`: pe o insula in iaz sau in rau (in mijlocul apei). Eroii nu pot intra in apa, deci steaua se ia doar cu mingea lui Leo. E gandita pentru cel mare.
   - `nook`: intr-un cerc de 7 bolovani cu o singura intrare. Uneori pazit de un gandac.
   - `guarded`: in camp deschis, inconjurata de 2 sau 3 gandaci (din nivelul 2), uneori in noroi.
   - `treetop`: ascunsa intr-un copac. Iese doar la un sut puternic (putere peste 0.55) in copac. Un tropait doar scutura frunzele si arata indiciul "tine ✕".
   - Daca un tip nu incape, devine `guarded`.
5. **Noroi, culoare, mori**: noroiul ca elipse neregulate. Culoarele de conuri merg de sus pana jos, departe de start, cuib si alte culoare. Morile la intervale egale.
6. **Copaci, bolovani, capite de fan**: puse la intamplare, cu distanta minima intre ele (68 la 72 de unitati intre margini), departe de apa si drum.
7. **Verificarea drumului** (cel mai important pas):
   - Se marcheaza ca blocata orice celula de langa apa sau perete si orice celula in care un erou nu ar incapea langa un obstacol (raza obstacolului + `HERO_R` + 3).
   - Se umple pornind de la start (flood fill). Rezultatul este `L.reach`: celulele in care se poate ajunge.
   - Daca nu se poate ajunge la cuib, la stelele `nook` si `guarded` sau la oul din pestera, nivelul e respins.
   - `L.reachCells(x, y, r0, r1, bits)` da celulele atinse intre doua raze. Folosit pentru tot ce apare in timpul jocului (oua scapate, oua din copaci, oua din paznici), ca nimic sa nu cada intr-un loc in care nu se poate ajunge.
8. **Gandacii**: langa stelele pazite si apoi pe fiecare treime, in celule atinse, departe de start (380), cuib (280), drum (105) si unul de altul (230).
9. **Copacii care sclipesc**: alesi aproape de drum. Fiecare ascunde 2 sau 3 oua, puse in celule atinse din jurul lui.
10. **Ouale**: 60 impartite in 3 valuri, unul pe fiecare treime. 40% pe drum (copiii le vad imediat), restul in jur, la minimum 125 unitati unul de altul. Ouale din copaci se scad din cota valului.
11. **Felinarele** (nivelul 6): pe ambele parti ale drumului, alternativ.

De ce verificarea: la inceput nivelul 5 nu se putea construi. Pestera nu era atinsa, pentru ca faleza si apa blocau trecerea. Verificarea a prins asta. Am mutat apa si am largit trecerea. Fara verificare, copiii ar fi gasit un ou imposibil de luat.

## Pictura fundalului: `paintLevel(L)`

Se picteaza o singura data, la incarcarea nivelului, intr-un canvas de 3200 x 1800 (`L.bg`). Ordinea este cea a unui pictor: de la fond spre detalii. La sfarsit se retine si culoarea primului pixel (`L.skyTop`, prin `topColor`): cu ea se umple fasia de deasupra lumii, cand camera priveste mai sus decat marginea picturii (vezi `12-desen-si-hud.md`).

1. Gradientul pamantului si 110 pete de acuarela din `tints`.
2. Pe deal: 9 linii de nivel (terase).
3. 4200 de fire de iarba (doar pe iarba).
4. Drumul: trei linii de pensula (umbra lata, culoarea, lumina ingusta) si pietricele.
5. Urmele culoarelor de conuri.
6. Noroiul: trei straturi de pete pe fiecare celula, apoi pete mari, lumini si bule. Doua pete pe fiecare celula, mutate putin, ca sa nu se vada grila (`cellBlobs`). La prima versiune se vedeau patratele.
7. Apa: la fel, trei straturi plus luciri si unde.
8. Podul (scanduri alternante) si pietrele de trecere.
9. Trestii pe malul raului (160).
10. Flori si smocuri (900). Ciuperci in padure (70).
11. Umbre lungi spre stanga pentru tot ce sta in picioare. Lungimea creste spre apus (`sl = 1 + skyT * 0.7`): soarele coboara, umbrele cresc.
12. Cuibul, bolovanii, capitele, felinarele, copacii (sortati de sus in jos).
13. Copacii care se misca (sclipesc sau ascund o stea) si morile nu sunt pictati pe fundal. Fiecare primeste sprite-ul lui si e desenat in fiecare cadru, sortat cu eroii.
14. Banda de sus: cerul, dealurile si o margine de coroane. La nivelul 5: faleza (gradient `#CDAF98` spre `#93747E`, 260 de pete, 420 de dungi), apoi pestera (o camera rotunda cu cristale colorate). Bucata de faleza de dinainte de pestera e pastrata separat (`L.coverCv`) si desenata peste pestera pana cand un erou intra in spatele cascadei.
15. O rama de frunze pe marginile de jos si laterale.
16. `finishPaint`: 7000 de puncte de granulatie, 260 de "flori" de acuarela (inele deschise) si o lumina calda `soft-light` dinspre soare.
17. Overlay-ul nivelului (hartie, tenta, vinieta).

Functiile de pictura pentru obiecte:

| Functie | Ce picteaza |
|---|---|
| `paintTree(c, t, pal, ox, oy)` | Trunchi, coroana (culoare din `canopy`), umbra, lumina, o pata crem `#FFF1C4` de soare, 12 frunze mici |
| `paintRock(c, x, y, R, col, seed)` | Bolovan cu umbra, lumina `#FFF1D8` si o crapatura |
| `paintHay(c, x, y, R, seed)` | Capita de fan `#E9C56C` cu 26 de fire |
| `paintMillTower(c, x, y)` | Turnul morii, crem, cu acoperis teracota `#C96F4E` si usa `#9A5F4A` |
| `drawMillBlades(c, x, y, ang)` | Cele patru pale, desenate in fiecare cadru ca sa se roteasca |
| `paintLantern(c, x, y)` | Stalp `#8A5A48` si felinar piersica `#E9A07A` |
| `cellBlobs(c, L, tip, raza, culoare, alfa, seed, jit)` | Pete pe fiecare celula de un tip (noroi, apa) |

## Arena boss-ului: `genBoss()`

Un singur ecran (1920 x 1080), fara generare intamplatoare. Samanta 4242.

- Randurile de sus (pana la 480) sunt tip 4: eroii nu pot urca in copac, mingea poate zbura spre cuib.
- Cuibul la (960, 300), in coroana. Baza copacului la (960, 560), un trunchi solid de raza 70 prin care mingea nu trece (`noBall`).
- Cerul la 1.05 (apus), soarele in stanga, patru felinare, o poiana luminata in fata copacului.
- Copacul mare este un sprite separat de 1240 x 660 (`L.treeCv`): trunchi cu dungi si 8 pete mari de coroana plus 150 de frunze. Separat ca sa se poata scutura cand Bubu tropaie.

## Decorul (update 13 noiembrie 2026)

`makeDecor(L, seed)` (`06-level.js`) pune pe fiecare nivel `CONFIG.decorPerLevel` (1700) lucruri mici: iarba, trifoi, margarete, stuf, paapadii, frunze, melci, buburuze, ciuperci, pietre, tufisuri, betisoare si muschi. Locul e ales la intamplare, dar fara apa, fara stanca, fara nimic solid in jur (`L.solids`, la 12 unitati) si nu langa cuib (180).

Greutatea fiecarui fel este in `DECOR_WEIGHT`. Cele care reactioneaza (`DECOR_REACT`: iarba, trifoi, margarete, stuful, paapadia, frunzele) sunt aproximativ o cincime din total, ca sa nu incarce cadrul. Melcii si buburuzele se misca, deci sunt desenate live, dar doar cand sunt pe ecran.

- Decorul care sta pe loc e pictat o data in imaginea nivelului (`paintDecorStill`, in `paintLevel`), inainte de umbrele pietrelor.
- Fiecare fel are patru aspecte (`paintDecor`), puse in cache cu `sprite('dec-tip-v')`.
- Reactiile (`updateDecor` in `07-play.js`): cand un erou sau o minge trece la mai putin de 70 de unitati, o planta scoate un mic puf de frunze sau petale (`burst`) si are o pauza de 0.7 s. La un tropait, papadiile si frunzele sar mai sus (0.9 s). Iarba face un "fsss" scurt (`rustle`), cel mult o data la 0.8 s.
- Melcul se retrage in coaja cand un erou e la mai putin de 90 de unitati. Buburuza zboara cand e atinsa (la 60), 2.2 s, apoi se intoarce.
- Numarul total: 6 niveluri x 1700 = 10.200 de lucruri. Testat cu `numara-elemente.js`.

## Update 14 noiembrie 2026

- `levelDefs()` da definitiile jocului ales: `LEVEL_DEFS` sau `LEVEL_DEFS_L`. `levelCount()` e acelasi (6). Codul nu mai citeste `LEVEL_DEFS` direct.
- Nivelurile celui de-al doilea joc folosesc acelasi generator si aceeasi verificare a drumului. Campurile noi din definitii (`night`, `robots`, `snails`, `birds`, `pits`, `vines`, `quick`, `door`, `rocket`), paletele de noapte si arena lui George (`genArena`) sunt descrise in `21-cea-mai-grea-lupta.md`.
- Gandacii si conurile au acum `hp` (vezi `10-gameplay.md`). Generatorul nu s-a schimbat: `hp` se pune la prima lovitura.
- Numarate cu `tests/numara-elemente.js`: 11.430 de obiecte in primul joc, 11.462 in al doilea.

## Update 18 noiembrie 2026

- `levelCount(id)`: numarul de niveluri al jocului cerut (`CONFIG.levels` sau `CONFIG.lupta.levels`).
- `chapters(id)`: nivelurile si luptele mari, in ordine. `chapterLabel(i, id)`, `levelsBefore(i, id)`. Vezi `13-ecrane-si-meniuri.md`, "Capitole".
- `skyTOf(idx)`: in al doilea joc cerul se socoteste mereu pe 6 niveluri. Nivelurile Partii a doua vor avea culorile lor.
- `buildLevel(idx)` primeste indicele unui capitol si pune `L.ch`. `L.idx` ramane numarul nivelului.

## Numarul de oua si cota (T14.1)

`genLevel` ia cota nivelului din `quotaOf(idx)` si pune pe harta `ceil(extra * cota)` oua, impartite pe valuri ca inainte (`round(total / NW)` pe val). Din cauza rotunjirii pe val, numarul real (`L.totalEggs`) poate diferi cu 1 - 2 de cifra ideala: nivelul 1 are 21, nu 22. Dupa generare, daca `L.totalEggs` nu e intre `2q` si `2 * ceil(cap * q)`, `genLevel` intoarce `null`, iar `buildLevel` incearca urmatoarea samanta (pana la 80).

`levelDurationOf(L) = max(levelDuration, L.totalEggs / eggsPerMinute * 60)`. Soarele din HUD, medalia "soare", indiciile si raza de adunare citesc aceasta durata. Nivelurile 1 - 4 raman la 360 s; nivelul 5 are 396 s, nivelul 6 are 468 s.
