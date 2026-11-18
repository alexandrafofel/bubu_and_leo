# 11. Mini-lupte (`src/075-duel.js`)

Adaugate in al doilea update. Cererea: "sa existe niste challenge-uri la fiecare nivel, niste mini lupte inainte de terminarea nivelului in care jucatorul de 8 ani (in cazul asta fotbalistul) sa aiba ceva mai antrenant si cel mic fie sa stea ascuns in cuib sau sa adune ouale care apar din lupta (sa nu aiba prea multe de facut)."

## Ideea

Pe fiecare nivel sunt doua lupte, cu acelasi paznic (ca la inceput): una la mijlocul drumului si una la cuib, mai grea (vezi "Doua lupte pe nivel" mai jos). Lupta are un ritm simplu, la fel la toti paznicii:

1. **Pregatire** (`aim`): paznicul tremura si pe pamant apare in rosu unde va ataca. Sunet de avertizare.
2. **Atac** (`dash`, `jump` sau `lob`): fuge, sare sau arunca.
3. **Oboseala** (`tired`): sta ametit, cu stele. Deasupra scrie "Acum!". Abia acum loviturile conteaza (pe Normal si Greu).
4. Repeta.

Asa cel mare invata un tipar: te feresti, apoi lovesti. Cel mic are doua lucruri simple de facut: sta in cuib, unde nimic nu il atinge, sau aduna ouale care sar din paznic la fiecare lovitura.

## Cei sase paznici: `DUEL_DEFS`

| Nivel | Paznic | Tipar | Parametri |
|---|---|---|---|
| 1 | Regele Gândac (`beetle`) | charge | viteza 150, 1 fuga |
| 2 | Bufnița Buhu (`owl`) | fly | arunca 2 conuri, 1 zbor in picaj |
| 3 | Racul Cleștișor (`crab`) | charge | viteza 175, 2 fugi, apoi arunca 2 conuri |
| 4 | Vârtejel (`whirl`) | hop | 2 sarituri, la fiecare aterizare 6 frunze in cerc, unda 115 |
| 5 | Broscoiul Oac (`frog`) | hop | 3 sarituri, unda mare 170 |
| 6 | Ciorel (`chick`) | fly | arunca 3 conuri, 2 zboruri in picaj |

Raza paznicului (`r`) este 40 sau 46.

Fiecare paznic se potriveste cu nivelul lui: gandacul vine din padure, racul de pe mal, varteju de pe dealul cu vant, broscoiul de la cascada, Ciorel este nepotul lui Ciori, chiar inainte de boss.

### Tiparele

**charge** (gandac, rac): se apropie de tinta. Cand e la 430 de unitati (sau dupa 2.8 s), se opreste si tinteste (0.85 s prima data, 0.5 s la urmatoarele). Pe pamant apare o banda rosie in directia fugii. Apoi fuge in linie dreapta cu 840 unitati pe secunda timp de 0.72 s. Daca se loveste de un perete sau de un copac, ameteste mai mult (+0.7 s). Racul mai arunca si conuri dupa fugi.

**hop** (varteju, broscoi): alege un loc spre tinta, la cel mult 390 de unitati. Pe pamant apare un cerc rosu punctat. Sare (0.62 s, inaltime 200). La aterizare face o unda: cine e in cerc e lovit. Varteju arunca si frunze in toate directiile, care zboara 2.3 s.

**fly** (bufnita, Ciorel): zboara la 260 de unitati de tinta, la inaltime. Arunca conuri: primul unde va fi tinta, restul in jur. Pe pamant apar cercurile unde cad. Apoi plonjeaza in linie dreapta printr-un punct unde e tinta, de la 500 de unitati de o parte la 440 de cealalta. Cat e sus (peste 90), mingea trece pe sub el pe Normal si Greu. Cand oboseste, coboara aproape de cel care se lupta cu el (la cel mult 250 de unitati), ca sa poata fi lovit.

## Pe cine ataca: `duelFighter()`

Paznicul alege jucatorul cu dificultatea cea mai mare care nu e in adapost. La egalitate, pe cel mai apropiat. Asa, cand cel mic e pe Ușor si cel mare pe Normal, paznicul se lupta cu cel mare. Cererea: cel mic "sa nu aiba prea multe de facut".

`duelSpares(h)`: nimic nu atinge un erou care:

- e in adapostul din cuib, sau
- e pe Ușor, nu este tinta acum, iar prietenul lui joaca, sau
- oricine, cat un erou asteapta ajutor (`duelWaiting()`, de la update-ul din 14 noiembrie).

Al doilea punct a fost adaugat dupa teste: conurile aruncate in jurul tintei il loveau pe cel mic in timp ce aduna ouale.

## Cand conteaza o lovitura: `duelCanHurt(k, cum)`

- Pe Ușor: oricand. Cel mic poate ajuta fara sa astepte.
- Pe Normal si Greu: doar cand paznicul e obosit (`tired`).
- Exceptie: mingea conteaza si cand paznicul se clatina (`stag`).

Ce se intampla cand lovitura nu conteaza:

- Mingea ricoseaza din paznic cu un "tonk" si apare "Încă nu!".
- Tropaitul langa un paznic care se pregateste sau se misca il face sa se clatine (`stag`) 1 s. Atunci mingea lui Leo conteaza. Se poate face o data la 4.5 s. Este combinatia de echipa: Bubu tropaie, Leo suteaza.

## Inimile

```
inimi = CONFIG.duel.hp[nivel] + (-1 daca cel mai greu jucator e pe Ușor, +1 daca e pe Greu), minim 2, maxim 9      (lupta din mijloc)
inimi = CONFIG.duel.finalHp[nivel] + acelasi reglaj                                                             (lupta de la cuib)
```

Cu valorile de acum (`[3, 3, 4, 4, 4, 5]`), un copil pe Normal are 3 pana la 5 lovituri de dat in lupta din mijloc, si `[5, 5, 6, 6, 7, 8]` la cuib.

`duelHit(k)`: o inima mai putin, paznicul e aruncat inapoi (`hurt`, 1.1 s), "goal", "squeak", "iu-huu", vibratie la ambii, 4 oua sar in jur (8 la ultima lovitura). Ouale cad doar in celule atinse (`reachCells`), la 90 pana la 330 de unitati.

Dupa ultima inima: paznicul se invarte si zboara afara din ecran (`flee`, 1.7 s). Muzica nivelului revine, cuibul se deschide.

## Cum se adapteaza la dificultate

Valorile depind de dificultatea tintei (`rk`):

| | Ușor | Normal | Greu |
|---|---|---|---|
| `slow`: inmultitor pentru timpii de pregatire si de zbor al conurilor | 1.5 | 1 | 0.8 |
| `sf`: inmultitor de viteza | 0.6 | 1 | 1.25 |
| `more`: atacuri in plus la rand (fugi, sarituri, zboruri, conuri), frunze in plus | 0 | 0 | 1 |
| Timpul obosit (`tiredTime` x) | 1.4 | 1 | 0.75 |
| Mingea trece pe sub un paznic zburator | nu | da | da |

## Doua lupte pe nivel

Ordinea pe nivel (`checkWave()` in `07-play.js`):

1. valul 1, valul 2;
2. **lupta din mijloc**, dupa valul 2 (`P.midFought`), exact ca lupta de dinainte, cu `CONFIG.duel.hp`. Paznicul aterizeaza aproape de mijlocul dintre start si cuib (`startDuel('mid')`): dintre celulele la care se poate ajunge, la cel mult 420 de mijloc, o alege pe cea cu cel mai mult loc liber in jur, nu pe pod si nu in noroi. Asa nu ajunge pe malul raului pe nivelurile 3 si 5. Bannerul spune "Racul Cleștișor vă stă în cale!" (`duel.mid`), iar vocea nu mai pomeneste cuibul (`duel.midSay`). Dupa ea urmeaza valul 3 (`P.nextWaveT`);
3. valul 3;
4. **lupta de la cuib** (`startDuel('nest')`, `P.nestFought`). Acelasi paznic, dar:
   - `d.hard = true`, `d.sc = CONFIG.duel.finalSize` (1.3): desenat si lovit mai mare, `d.R = def.r * sc`;
   - inimi din `CONFIG.duel.finalHp`;
   - viteza x `finalSpeed`, avertizarea mai scurta x `finalPrep`, oboseala mai scurta x `finalTired`;
   - un atac in plus la fiecare runda (`finalExtra`), inca unul cand e suparat (sub `angryAt` din inimi). Cand e suparat, ecranul tremura putin (`P.shake` 0.03);
   - muzica e aceeasi melodie, mai repede (`duel2`, 116 batai pe minut in loc de 104);
5. cuibul se deschide (`openNest()`).

Dupa lupta din mijloc nu se deschide cuibul: `flee` pune `P.nextWaveT = 1.0`.

## Adapostul

Un cerc verde punctat in jurul cuibului, raza `CONFIG.nestSafeRadius` (150). Din update-ul 13 noiembrie 2026 este pe tot nivelul, nu doar in mini-lupte, si se deseneaza mereu (`drawNestShelter(c)` in `08-draw.js`):

- afara din mini-lupta, cercul e mai discret (alpha x 0.35 si x 0.6 pentru umplere);
- cand un erou e inauntru, umplerea e mai luminoasa;
- in mini-lupta, cercul e complet.

Ce face adapostul pentru un erou aflat in cuib (`h.safe`, calculat in `updateHero`):

- `hitHero` iese fara efect (nu pierde oua, nu ameteste, nu are invulnerabilitate);
- vantul nu-l mai impinge (`P.wind` ignorat);
- gandacii care il urmaresc se opresc (`near.safe` ii trimite inapoi, nu se trezesc pentru el), iar conurile trec pe langa el fara efect;
- paznicii il ignora (`duelSpares`), iar pe Ușor eroul care doar ajuta e scutit;
- sunetul "ih-ih" (`Snd.talk(h.k, 'hide')`) se aude la intrare, cel mult o data la `nestHideSoundGap` (3 s).

Nivelul boss-ului: cuibul lui Ciori e in copac, unde eroii nu ajung. Nu s-a pus un cuib pe jos (raspunsul la intrebarea I1). Pe acest nivel `h.safe` e mereu fals si cercul nu se deseneaza (`L.boss`).

Daca toti jucatorii stau in cuib, paznicul nu are pe cine ataca (`duelFighter()` intoarce -1): se duce la locul lui si asteapta. Nu oboseste, deci nu poate fi lovit. Lupta inainteaza abia cand cineva iese din cuib.

Masurat cu `mini-lupte-bot.js` (72 de lupte, toate castigate): lupta din mijloc dureaza in medie 27 s, cea de la cuib 53 s. Pe niveluri, cea de la cuib e de 1.5 pana la 2.5 ori mai lunga.

## Sageata ajutatoare in lupta

`guideTarget` din `08-draw.js`:

- Cel mic pe Ușor, cu prietenul pe Normal sau Greu: sageata arata spre cel mai apropiat ou (cel mult 750), altfel spre cuib.
- Ceilalti: sageata arata spre paznic, cu bula "✕" sau minge cand se poate lovi si "!" cand trebuie asteptat.

## Desenul

| Functie | Ce deseneaza |
|---|---|
| `DUEL_PAINT.beetle` | Gandacul obisnuit marit x 1.9, cu o coroana aurie `#F8C24E` si o piatra rosie |
| `DUEL_PAINT.owl` | Bufnita maro `#A07E5C` cu piept crem `#E8D2A8`, ochi mari in discuri `#F4E6C8`, urechi, aripi care bat in zbor, sprancene incruntate cand ataca |
| `DUEL_PAINT.crab` | Rac `#E0705A` cu clesti care clampanesc cand ataca, ochi pe tije, 6 picioare care se misca |
| `DUEL_PAINT.whirl` | Varteju: 6 inele albastre `#C9D6E8` / `#AFC0DA` care se leagana, dungi albe care se rotesc, 3 frunze care zboara in jur |
| `DUEL_PAINT.frog` | Broscoi verde `#8DB866` cu burta crem `#EEF2C0`, se turteste inainte de saritura si se lungeste in aer, scoate limba cand e ametit |
| `DUEL_PAINT.chick` | Ciori, desenat cu culori albastru-verzui `#4F7387` si marit x 1.25 |
| `drawDuelBoss(c)` | Paznicul cu starea lui: tremura la pregatire, se clatina cand e lovit, respira cand e obosit, palpaie dupa o lovitura, devine transparent cand fuge |
| `drawDuelGround(c)` | Adapostul, zona de atac in rosu (`#D9463C` transparent, pulseaza), undele de aterizare, cercurile conurilor, umbra |
| `drawDuelTop(c)` | Paznicul in aer, conurile, frunzele, inimile (`#E2574C` pline, violet transparent goale), "Acum!" si "Încă nu!". Cele doua texte raman in lume, deasupra capului paznicului. Daca un erou e in drum, urca din 40 in 40 de unitati, de cel mult trei ori (`heroInWay`, din 18 noiembrie 2026). |
| `heartPath(c, x, y, s)` | Forma de inima |

## Testat

`tests/mini-lupte-bot.js` joaca fiecare paznic in 6 situatii (ambii jucatori Ușor/Normal, Ușor/Greu, Ușor/Ușor, doar Bubu pe Normal, doar Leo, un bot care suteaza la intamplare). Toate 36 de lupte se termina. Rezultate tipice: 6 pana la 45 de secunde pe Ușor/Normal, pana la 75 de secunde pe Ușor/Greu pentru Bufnita.

## Update 14 noiembrie 2026: lupta si regula ajutorului

Regula noua (un erou lovit asteapta prietenul) a schimbat mult luptele. In teste, pe Greu si la paznicii care sar, eroii erau loviti din nou chiar cand veneau sa ajute si unele lupte nu se mai terminau. Trei schimbari:

**1. Lupta se odihneste cat un erou asteapta.** `duelWaiting()` = cel putin un erou are `down`.

- `duelSpares(h)` e adevarat pentru toti: nimic nu mai loveste pe nimeni.
- Paznicul nu incepe alt atac. Un atac in curs (fuga, saritura, plonjonul) se opreste si paznicul trece in `tired`.
- Conurile si frunzele nu mai sunt aruncate.
- Paznicul nu poate fi lovit "pe gratis" cat doar asteapta: pe Ușor lovitura conteaza doar daca nimeni nu e jos. Un paznic `tired` poate fi lovit oricand.

**2. Mila** (`CONFIG.duel.mercy`, `mercyMax`). `P.duel.downs` numara eroii loviti in lupta asta. Cu `mz = min(mercyMax, downs) x mercy`:

| Ce | Cum se schimba |
|---|---|
| Viteza paznicului | inmultita cu `1 - 0.6 x mz` |
| Timpul de avertizare | inmultit cu `1 + mz` |
| Timpul cat sta obosit | inmultit cu `1 + 2 x mz` |
| Atacuri pe runda | cu unul mai putin la fiecare 4 lovituri primite de eroi (minimum 1) |
| De la `mercyMax` lovituri | orice lovitura pe paznic conteaza, ca pe Ușor |

Cu valorile de acum, dupa 10 eroi loviti: paznicul are 64% din viteza, avertizeaza cu 60% mai mult si sta obosit de 2.2 ori mai mult. O lupta in care copiii nu se feresc deloc se termina si ea.

**3. Inimile lui George** in al doilea joc vin din `CONFIG.lupta.duelHp` (lupta din mijloc) si `duelFinalHp` (lupta de la cuib), nu din `duel.hp`. Vezi `21-cea-mai-grea-lupta.md`.

Rezultat (`mini-lupte-bot.js`, 72 de lupte pe joc): toate castigate in ambele jocuri. Primul joc: 9 pana la 124 s, jumatate din ele sub 31 s. Al doilea: 11 pana la 114 s, jumatate sub 30 s. Cele mai lungi sunt luptele de la cuib de pe nivelul 6.
