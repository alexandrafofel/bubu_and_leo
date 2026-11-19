# 21. Al doilea joc: "Cea mai grea luptă"

> **Din 18 noiembrie 2026 exista un singur joc: "Cea mai grea luptă".** "Bubu și Leo" a fost scos (vezi `16-decizii.md`, "Un singur joc"). Orice schimbare se face doar in "Cea mai grea luptă". Ce scrie mai jos despre primul joc, despre alegerea jocului sau despre "ambele jocuri" este istoric.

Jocul inventat de copii pe 13 noiembrie 2026. Raspunsurile lor, cuvant cu cuvant, sunt in `../prompts/04-cerere-14-noiembrie.md`. Desenele lor (Boon, Killer, George cel Rău) au fost modelul pentru personaje.

Capitolul acesta aduna tot ce tine doar de al doilea joc. Regulile comune celor doua jocuri (ajutorul cu □, inamicii mici, cuibul) sunt in `10-gameplay.md` si in `22-update-14-noiembrie.md`.

## Ideea

Cerinta: "Celalalt joc (cea mai grea lupta) respecta caracteristicile jocului Bubu and Leo (acelasi număr de elemente - dar diferite, la fel de multe nivele de joc, dar diferite, sunete personaje dar diferite)."

Deci motorul este acelasi. Se schimba tot ce se vede si se aude:

| | Bubu și Leo | Cea mai grea luptă |
|---|---|---|
| Lumea | Valea Calda, dupa-amiaza spre apus | Jungla, noaptea, in culorile curcubeului |
| Eroul 1 (cel mic) | Bubu, pui de triceratops. Tropaie. | Boon, dinozaur turcoaz. Ghearele ii cresc si se rotesc in jurul lui. |
| Eroul 2 (cel mare) | Leo, fotbalist in galben si albastru. Suteaza mingi. | Killer, fotbalist in albastru, numarul 10. Arunca mingi care sar sus-jos. |
| Ce aduna | Oua de aur | Cristale curcubeu, in sapte culori |
| De ce | Ciori le-a furat inainte de Festivalul Apusului | Sunt cadoul pentru o petrecere |
| Personajul rau | Ciori, o cioara poznasa. Isi cere iertare. | George cel Rău, carnotaurus cu coroana. Rau de-a binelea. Fuge. |
| Paznicii din mini-lupte | Sase animale diferite | Mereu George: mic la inceput, tot mai mare, cu tot mai multe puteri |
| Inamicul care doarme | Gandac | Robot |
| Inamicul de pe culoar | Con de brad | Melc lipicios |
| Terenul lent | Noroi | Urme de melc, nisip miscator, liane incalcite |
| Ajutorul | Fluture portocaliu | Racheta |
| Secretul | Oul urias din pestera din spatele cascadei | Steaua din ascunzatoarea din spatele lianelor, cu o usa |
| Cand e lovit un erou | Ameteste si asteapta prietenul | Se face mic si asteapta prietenul. Creste la loc cand e ajutat. |
| Finalul | Festivalul Apusului, oul ecloseaza | Petrecerea Curcubeu: medalii si stelute care ii imbratiseaza pe eroi |
| Doar aici | | Pasari mari care te ridica, gropi, curcubeul de sapte cristale, urletul lui George, soldati cu sulite |

## Cum se alege jocul in cod

`GAME` (in `src/015-lang.js`) este `'bubu'` sau `'lupta'`. `setGame(id)` din `09-screens.js` il schimba. `isLupta()` intreaba.

Ce se schimba cand `GAME` devine `'lupta'`:

| Ce | Cum |
|---|---|
| Eroii, numele personajului rau, valorile boss-ului | `applyGameConfig()` pune `CONFIG.lupta.heroes`, `villainName` si `boss` in locul celor cu acelasi nume din `CONFIG`. Valorile primului joc sunt pastrate in `GAME_BASE`. De aceea restul codului citeste mereu `CONFIG.heroes[k]` si merge in ambele jocuri. |
| Textele | `T('cheie')` cauta intai `'L:cheie'`. Daca exista, il foloseste. Asa "ou" devine "cristal" fara nicio schimbare in codul care afiseaza. `TG(id, cheie)` da textul unui joc anume (pentru ecranul de alegere). |
| Nivelurile | `levelDefs()` da `LEVEL_DEFS_L` in loc de `LEVEL_DEFS`. `buildLevel` face `genArena()` in loc de `genBoss()`. |
| Paznicii | `duelDefs()` da `DUEL_DEFS_L`. |
| Desenele | Functiile comune aleg singure: `drawHero`, `drawSleeper`, `drawRoller`, `drawEgg`, `drawButterfly`, `drawBall`, `drawNest`, `itemPath`. |
| Sunetele | `Snd.play` cauta intai in `fx2`. Muzica si ambianta au chei cu `L:` in fata. Vocile vin din `BABBLE.lupta` si `VOICES.lupta`. |
| Decorul | `makeDecor` foloseste `DECOR_WEIGHT_L` cand nivelul are `night`. |
| Imaginile din cache | `setGame` goleste `SPR`, pentru ca portretele, cuibul si oul sunt altele. |
| Progresul | `Save.slot()` da salvarea jocului ales. Al doilea joc sta in `g2` (vezi `04-limba-si-setari.md`). |

Personajele si obiectele noi sunt in `src/055-lupta.js`. Fisierul este intre `05-chars.js` si `06-level.js` in `build.sh`.

## Eroii

Valorile sunt in `CONFIG.lupta.heroes`.

### Boon (jucatorul de 6 ani)

Raspunsul copiilor: "lovește cu mânuțele, când apasă pe x ii cresc ghearele care sa învârt formând un cerc in jur care îl protejează sau care iau cristalele. Boon: zgarie - își alungește mainile."

- Desen (`drawBoon`): corp rotund turcoaz, cupola pe spate cu trei "munti" albastri cu varfuri deschise, gat lung auriu, cap mic albastru cu bot inchis, brat albastru cu gheare, picioare si coada lunga verde-lime. Culorile sunt luate din desenul copilului.
- Puterea (`startPower`, `updateHero`): la ✕ incepe o rotire de `spinTime` (0.85 s). Bratul se lungeste si ghearele cresc (`o.claw` in `drawBoon`). In jurul lui se rotesc urme de gheare in culorile curcubeului (`drawClawRing`).
- Cat se rotesc ghearele: `h.shield` este adevarat, deci nimic nu il loveste (`hitHero` iese). Urletul lui George nu il impinge.
- Tot ce e in cerc (`stompRadius` 220) simte ghearele o singura data pe rotire (`powerSweep` cu `h.spinNo`): robotii, melcii si pasarile pierd o lovitura, florile uriase sunt scuturate, paznicul e lovit, tronul lui George e zgariat.
- Cristalele din `pullRadius` (300) zboara spre el.
- `stompCooldown` 1.25 s de la inceputul unei rotiri pana la urmatoarea. Deci e ferit cam doua treimi din timp daca apasa intruna. E voit: e eroul celui mic.

### Killer (jucatorul de 8 ani)

Raspunsul copiilor: "arunca cu mingi fix la fel ca in jocul Bubu and Leo, dar mingile sar jos sus, este un efect video mai artistic."

- Desen (`drawKiller`): cap rotund fara par, ochi mari, zambet lat cu dinti, tricou si sort albastre cu numarul 10 (numarul nu se oglindeste cand se intoarce), brate lungi, ghete rosii mari. Ridica bratele cand e fericit.
- Puterea: exact a lui Leo (aceleasi valori: 8 mingi la o apasare, 12 la sutul incarcat, cooldown 1.2 s).
- Efectul nou: in zbor fiecare minge sare (`b.z = |sin|` x 38 in `stepFlyBall`, doar la desen) si lasa in urma scantei in culorile curcubeului. Umbra se micsoreaza cand mingea e sus.
- Mingea lui (`drawBallL`): alba cu hexagoane, ca in desen.

### Cand un erou e lovit

Raspunsul copiilor: "Se face mic pentru câteva secunde - se face mare înapoi când îl salvează celălalt jucator."

`h.small` merge lin spre `CONFIG.lupta.shrink` (0.5) cat eroul asteapta ajutor si inapoi la 1 dupa. `heroOpts` trimite `scale: h.small` la desen. Sunetul `bonk` din `fx2` coboara ("se dezumfla"), `heal` urca. Regula ajutorului este cea comuna, vezi `10-gameplay.md`.

## George cel Rău

Raspunsul copiilor: "Dinozaur cu coroana - carnotaurus -> George cel rău îl cheamă. E rău de-a binelea." Si cerinta: "in toate cele 6 levels + boss fight de la sfârșit apare George cel rău cu mai multe puteri si mai greu de învins. Mai mic inițial, din ce in ce mai mare."

Desen (`drawGeorge`, dupa desenul copilului): corp roz, cap in culorile curcubeului (rosu la ceafa, portocaliu, galben), bot albastru cu dinti, corn-coroana in dungi rosii si galbene cu o banda aurie, brate si picioare subtiri maro, un picior cu gheara si unul roz, coada verde care se face albastra si se rasuceste in sus. Stari: `calm`, `angry` (deschide gura, tremura bratul), `dizzy`, `scared`.

### In mini-lupte (`DUEL_DEFS_L` in `075-duel.js`)

El este paznicul in ambele lupte ale fiecarui nivel. `size` il face mai mare, `pats` sunt tiparele de atac pe care le schimba pe rand (`d.cyc`).

| Nivel | Marime | Ce stie |
|---|---|---|
| 1 | 0.62 | Doar alearga spre tine (1 atac). |
| 2 | 0.72 | Alearga si arunca 2 pietre. |
| 3 | 0.82 | Sare pe tine de 2 ori (unda de 120). |
| 4 | 0.92 | Sare de 2 ori si imprastie 6 scantei, apoi alearga. |
| 5 | 1.02 | Alearga de 2 ori si arunca pietre, apoi sare de 2 ori (unda de 150). |
| 6 | 1.14 | Tot: 3 sarituri cu scantei (unda de 165), 2 alergari, 3 pietre. |

La cuib e inca de 1.3 ori mai mare (`CONFIG.duel.finalSize`), ca toti paznicii. In arena are 1.5 (`CONFIG.lupta.bossSize`).

Inimile lui sunt in `CONFIG.lupta.duelHp` (`[3, 3, 4, 5, 5, 6]`) si `duelFinalHp` (`[5, 6, 6, 7, 8, 9]`). De la nivelul 2 are cu una mai mult decat paznicii primului joc. Restul regulilor (obosit, "Acum!", "Încă nu!", Ușor/Normal/Greu, mila) sunt cele din `11-mini-lupte.md`.

Sunetele lui: urletul (`caw` din `fx2`, facut cu `growl`: un triunghi jos care aluneca in jos si tremura, cald, nu aspru), `tired`, `squeak`, `flee`.

### In arena (`genArena`, `updateBoss`)

Raspunsul copiilor: "într-o poiana, ca o arena, sa se vadă niște munți, sa fie torțe de foc in jurul arenei si niște soldați care au sulițe."

- Arena: nisip palid intr-un cerc de pietre colorate, doua randuri de munti cu zapada (`paintMountains`), cerul noptii cu luna si aurora, 8 torte cu flacara vie (`drawFlame`), 8 soldati-soparla cu coif si sulita (`drawSoldier`), tronul de piatra in mijloc.
- Mersul luptei este cel al boss-ului din primul joc, cu alte roluri:
  1. George sta pe tron si arunca pietre. Boon isi roteste ghearele langa tron (`bossShake`) de `shakes[runda]` ori.
  2. George cade pe nisip si sta ametit `downTime` secunde.
  3. Killer il loveste cu mingea. Tinta este George insusi (`bossGoal()`), nu un cuib. Fiecare lovitura scoate 8 cristale.
  4. George urca inapoi pe tron si urla: eroii mai aproape de `roarRadius` (520) sunt impinsi (`roarPush`). Nu doare. Boon nu e impins daca se roteste.
  5. De `hits` (6) ori. Ciori are 5.
- De la runda a doua arunca doua lucruri. In ultimele doua runde, al treilea este o sulita aruncata de un soldat (`kind: 'spear'`).
- Cristalele pe care le tine la picioarele tronului scad cu fiecare lovitura (`drawThrone`).
- La final isi pierde coroana (ramane pe nisip), se face mic si fuge din ecran. Soldatii scapa sulitele si sar de bucurie. Textul: "George cel Rău a fugit! Cristalele sunt ale voastre."

## Nivelurile (`LEVEL_DEFS_L` in `06-level.js`)

Aceleasi caramizi ca in primul joc, cu alt continut. `night: true` schimba cerul, lumina, decorul si felul in care sunt pictate lucrurile.

| Nr | Cheie | Nume | Ce aduce nou |
|---|---|---|---|
| 1 | `glade` | Poiana Licuricilor | Miscarea, ghearele, mingile, o groapa cu o stea, primul melc |
| 2 | `robots` | Jungla Roboților | Roboti care dorm, flori uriase care sclipesc si ascund cristale |
| 3 | `snails` | Râul Melcilor Lipicioși | Urme lipicioase, rau cu pod si pietre, melci pe carari |
| 4 | `ridge` | Culmea Vântului | Vant, toteme cu morisca, pasari mari, nisip miscator |
| 5 | `vines` | Stânca Lianelor | Stanca, liane, usa spre ascunzatoarea cu steaua secreta |
| 6 | `road` | Drumul Torțelor | Torte care se aprind, o groapa, nisip, o pasare, totul la un loc |
| Final | `arena` | Arena lui George | Lupta cu George |

Ce inseamna campurile noi din definitii:

| Camp | Ce face |
|---|---|
| `night` | Nivel de noapte: `paintNightSky`, dealuri albastre, flori care lumineaza, lumina rece in `finishPaint`, vinieta albastra in `makeOverlay`, copaci pictati ca flori uriase (`paintTree`), pietre cu cristale (`paintCrystalRock`), ciuperci uriase in loc de capite (`paintShroom`), torte in loc de felinare, toteme cu morisca in loc de mori. |
| `slowKind` | Cum arata terenul lent: `slime`, `sand` sau `vines`. Culorile sunt in `SLOW_COLS`. |
| `slow` | Viteza pe terenul lent al acestui nivel (nisipul miscator: 0.32, mai lent decat noroiul de 0.45). |
| `pit` | Iazul nivelului e pictat ca o groapa adanca: intunecata, cu margine care lumineaza si luminite pe fund. Nu se poate intra, ca in apa. Steaua de pe "insula" e in mijlocul gropii si se ia cu mingea. |
| `door` | In stanca e o usa. O perdea de liane o ascunde (`L.vines`, desenata in fata eroilor, ca vechea cascada). |
| `birds` | Cate pasari mari are nivelul. |
| `coneSpeed` | Melcii merg la jumatate din viteza conurilor. |

Paletele de noapte (`glade`, `robots`, `snails`, `ridge`, `vines`, `road`) sunt in `PALS`. Petele de culoare de pe pamant folosesc `RAINBOW`.

### Obstacolele cerute de copii

Raspunsul lor: "melci lipicioși, roboti, gropi, vânt, apa, liane, păsări care te ridica pe sus, nisip mișcător."

| Obstacol | Unde | Cum merge |
|---|---|---|
| Melci lipiciosi | Nivelurile 1, 3, 4, 5, 6 | Se tarasc incet pe carari de sus in jos (`L.cones`, `drawSnail`). Te lovesc daca te ating. Urmele lor (nivelul 3) te incetinesc. |
| Roboti | Nivelurile 2 pana la 6 | Dorm cu o luminita. Se trezesc daca treci aproape si te urmaresc (`L.beetles`, `drawRobot`). |
| Gropi | Nivelurile 1 si 6 | Nu se poate intra. Se ocolesc. |
| Vant | Nivelurile 4 si 6 | Ca in primul joc. Morisca totemelor se invarte mai repede. |
| Apa | Nivelurile 3 si 5 | Rau cu pod si pietre, lacul de la poalele stancii. |
| Liane | Nivelul 5 | Perdeaua care ascunde usa si lianele incalcite de pe jos, care te incetinesc. |
| Pasari care te ridica | Nivelurile 4 si 6 | Vezi mai jos. |
| Nisip miscator | Nivelurile 4 si 6 | Te incetineste mai tare decat noroiul. |

### Pasarile mari (`updateBirds` in `07-play.js`)

- O pasare zboara dintr-o parte in alta a ecranului, pe la inaltimea eroilor. Zboara sus: pe pamant se vede doar umbra ei, cu un cerc rosu punctat. Acolo te poate prinde.
- Daca umbra trece peste un erou, pasarea il ridica (`h.carried`), il duce `birdCarry` (1.7 s) mai incolo si il lasa jos. Nu doare, nu se pierde niciun cristal, nu trebuie ajutor. Eroul nu e lasat niciodata in apa, in groapa sau intr-un copac (`dropHero` cauta cel mai apropiat loc liber).
- Ghearele lui Boon si mingile lui Killer o lovesc. Dupa doua lovituri pleaca si vine alta mai tarziu (regula inamicilor mici).
- Nu prinde un erou ascuns in cuib, unul care asteapta ajutor sau pe Boon cat se roteste.
- Nu vin pasari in timpul unei mini-lupte sau dupa ce cuibul s-a deschis.
- Vine una la `birdEvery` (7 pana la 13 secunde) pentru fiecare pasare a nivelului.

### Cristalele si curcubeul

- Un cristal are una din sapte culori (`e.hue`, `RAINBOW`). `drawCrystal` le picteaza o data pe fiecare (`sprite('gem' + hue)`).
- Sub numarul din HUD sunt sapte cristale mici. Se coloreaza pe masura ce echipa aduna cate unul din fiecare culoare (`P.rainbow`).
- Toate sapte = "Curcubeu! +5": echipa primeste `rainbowBonus` cristale si sirul incepe din nou (`rainbowAdd`).
- Este felul in care al doilea joc e "aceeasi mecanica, dar altfel": se aduna la fel, dar exista un motiv sa cauti o culoare anume.

### Secretul

Raspunsul copiilor: "O stea care se găsește greu, intri pe o ușa într-o ascunzătoare."

Pe nivelul 5, stanca are o usa de lemn cu maner curcubeu, ascunsa dupa o perdea de liane. Lianele atarna peste tot pe stanca, deci usa nu sare in ochi. In spatele ei e ascunzatoarea (pestera primului joc). Acolo e steaua secreta (`drawSecretStar`: aurie, mare, cu un inel de stelute in toate culorile). Valoreaza `giantEggValue` (20) cristale. Bannerul: "Steaua secretă!". Prima racheta a nivelului zboara spre usa, ca indiciu.

### Racheta

Raspunsul copiilor: "Ce surpriză ajută uneori eroii? O racheta." Ia locul fluturelui (`drawRocket`). Cine o atinge da ambilor eroi viteza x 1.5 pentru 6 secunde.

## Decorul

Cerinta "minim 10.000 de elemente" se aplica si aici. Fiecare nivel are `decorPerLevel` (1700) lucruri mici, de 13 feluri, ca in primul joc, dar altele:

| Reactioneaza (se deseneaza la fiecare cadru) | Stau pe loc (pictate in fundal) |
|---|---|
| feriga, orhidee, ciuperca luminoasa, clopotel, puf, frunza mare (scot un norisor colorat cand treci), vierme luminos (se strange), licurici (zboara si revine) | cristal mic, surub, radacina, muschi luminos, urma de laba |

Testul `numara-elemente.js` da 11.462 de obiecte in listele celor sapte niveluri (primul joc: 11.430).

## Sunetele

Cerinta: "sunete personaje dar diferite". Raspunsul copiilor: "Roar, sunete de roboti."

- Vocile (`BABBLE.lupta`, `VOICES.lupta`): cate 33 de cuvinte pentru Boon si Killer, altele decat ale lui Bubu si Leo. Boon marae cuvintele (vocea ii tremura repede: `growl: 24`). Killer striga scurt, sportiv, mai sus.
- Efectele (`fx2`): cristalul suna ca sticla, ghearele sunt trei suieraturi, sutul lui Killer e un "boing", robotul face bip-bip cand se trezeste si coboara cand e lovit, racheta suiera in sus, torta se aprinde cu un fosnet, George urla.
- Muzica: aceleasi tipare pentatonice, alte game si alte instrumente: clopotei de sticla in loc de kalimba (`glass`) si o toba moale de jungla (`drum`).
- Ambianta: greieri, broaste, o bufnita, roboti care bipaie departe, focul tortelor.

Toate respecta regula 5 din `CLAUDE.md`: sinus si triunghi, filtre, nimic aspru.

## Finalul: Petrecerea Curcubeu (`drawEndingL`)

Raspunsul copiilor: "Medalii si steluțe care îmbrățișează personajele."

1. Jungla noaptea, ghirlande de lumini si stegulete in toate culorile, artificii colorate.
2. In mijloc, cadoul: o cutie roz deschisa, plina de cristale.
3. La 3.5 s coboara doua medalii pe panglici si se asaza la pieptul eroilor.
4. La 6.5 s zboara zece stelute cu fata si brate, se strang in jurul eroilor si ii imbratiseaza.
5. La 8 s apare "Bravo, Boon și Killer!" cu numarul de cristale si de stele.
6. La 12 s: "Sfârșit" si ✕ duce inapoi la ecranul de start.

## Ce se poate regla (`CONFIG.lupta`)

| Cheie | Valoare | Ce face |
|---|---|---|
| `villainName` | `'George cel Rău'` | Numele din vocea de la final. |
| `heroes[0].stompRadius` | 220 | Cercul ghearelor lui Boon. |
| `heroes[0].pullRadius` | 300 | De la ce distanta zboara cristalele spre el. |
| `heroes[0].spinTime` | 0.85 | Cat se rotesc ghearele (si cat e ferit). |
| `heroes[0].stompCooldown` | 1.25 | Secunde de la o rotire la urmatoarea. Mareste ca sa fie ferit mai rar. |
| `heroes[1]...` | ca la Leo | Mingile lui Killer. |
| `boss.hits` | 6 | De cate ori trebuie lovit George in arena. |
| `boss.shakes` | `[2, 2, 3, 3, 3, 4]` | Cate rotiri de gheare il dau jos de pe tron, pe runda. |
| `boss.downTime` | 5 | Cat sta jos. |
| `boss.throwEvery` | `[3, 2.5, 2.1, 1.8, 1.6, 1.4]` | Secunde intre aruncari, pe runda. |
| `boss.roarRadius`, `roarPush` | 520, 1500 | Cat de departe si cat de tare impinge urletul. |
| `duelHp`, `duelFinalHp` | vezi mai sus | Inimile lui George in mini-lupte. |
| `bossSize` | 1.5 | Cat de mare e in arena. |
| `shrink` | 0.5 | Cat de mic se face un erou lovit. |
| `rainbowBonus` | 5 | Cristale primite pentru un curcubeu. |
| `birdSpeed`, `birdCarry`, `birdEvery` | 250, 1.7, `[7, 13]` | Pasarile mari. |

Numele eroilor, culorile si vitezele lor sunt tot aici. Marimile si tiparele lui George pe niveluri sunt in `DUEL_DEFS_L` (`src/075-duel.js`).

## Ce nu e verificat

- Nimeni nu a jucat inca jocul cu un controller in mana. Botii termina toate nivelurile si castiga toate luptele (vezi `17-testare.md`), dar asta nu spune daca e prea usor sau prea greu pentru copii.
- Vocile lui Boon si Killer nu au fost ascultate de un om. Testul masoara doar ca se aud si ca sunt diferite.
- Scena de noapte e foarte bogata. Eroii au un inel colorat si o lumina moale in jur ca sa se vada. Daca tot se pierd pe televizor, scade `decorPerLevel`.

## Update 19 noiembrie 2026 (T3): a doua putere

Fiecare erou are acum doua puteri. Detaliile si regulile: `10-gameplay.md`, "Update 19 noiembrie 2026 (T3)".

| | ✕ | □ |
|---|---|---|
| Boon | ghearele care se rotesc | **oase-bumerang**: 8 oase (12 incarcat) pleaca in cerc, se intorc pe o curba |
| Killer | mingile | **manusi-vartej**: bratele se intind, manusi rosii de portar se rotesc in jurul lui |

Desene noi in `055-lupta.js`: `drawBone` (os crem-chihlimbar cu doua capete rotunde si o crapatura), `drawGlove` (manusa rosie cu palma alba si stea albastra), `drawThrown` (alege mingea sau osul). In `08-draw.js`: `drawGloveRing` (inelul manusilor, cu panglici si cercul punctat de pe pamant).

Sunete noi (`fx2`): `bone` (trei note joase cu tremur, la aruncare), `tock` (lemn, la perete), `gloves` (doua "fuip" si un scartait de cauciuc). Cuvinte noi pentru amandoi eroii: `power2` si `power2Big`.
