# 20. Update urmator: specificatie

Cererea proprietarei, 13 noiembrie 2026, cuvant cu cuvant:

> personajele sa aiba fiecare cate 30 de sunete diferite pentru diverse actiuni - un fel de limba a lor, draguta, amuzanta. nu ma intereseaza sa dau mai incet muzica din controller, ambele personaje cand isi folosesc puterea (cum e saritul dinozaurului si aruncatul mingii) puterea se duce in toate directiile (cum e la saritul dinozaurului) de ex - in cazul fotbalistului ar fi trebuit sa arunce cu mingi in toate directiile. lupta ca grad de dificultate cum e acum sa fie cand personajele ajung la mijlocul drumului si "boss" fight-ul sa fie mai greu. cand un personaj ajunge in "cuib" sa nu il ia vantul, sa nu poata fi lovit in niciun stadiu al jocului. sa existe minim 10.000 de elemente in joc.

Mai jos, fiecare cerinta: ce inseamna, cum se face, unde in cod, ce trebuie testat. Ordinea recomandata de lucru este cea a sectiunilor. Toate regulile din `CLAUDE.md` raman valabile.

Nimic din acest capitol nu este facut inca. Cand faci o parte, muta descrierea ei in capitolul potrivit (06, 10, 11, 12) si sterge-o de aici.

---

## U1. Cuibul: adapost in tot jocul

**Cerinta:** "cand un personaj ajunge in cuib sa nu il ia vantul, sa nu poata fi lovit in niciun stadiu al jocului."

**Acum:** adapostul exista doar in timpul mini-luptei. In `updateHero` (`src/07-play.js`):

```js
h.safe = !!(P.duel && !P.duel.over && dist(h.x, h.y, L.nest.x, L.nest.y) < CONFIG.duel.safeRadius);
```

`hitHero` iese deja daca `h.safe`. Vantul nu impinge deja un erou `safe`. Deci aproape totul depinde de aceasta linie.

**De facut:**

1. O valoare noua in `CONFIG`: `nestSafe: true` (comentariu: "un erou in cuib nu poate fi lovit si nu il ia vantul, in tot nivelul"). Muta `safeRadius` din `CONFIG.duel` intr-o valoare proprie, `nestSafeRadius: 150`, si foloseste-o peste tot.
2. In `updateHero`: `h.safe = CONFIG.nestSafe && dist(h.x, h.y, L.nest.x, L.nest.y) < CONFIG.nestSafeRadius` pe nivelurile 1 pana la 6, in orice moment.
3. Gandacii (`updateEnemies`) nu urmaresc un erou `safe`. Daca tinta lor intra in cuib, se opresc la marginea cercului si se intorc la somn dupa 2 s. Conurile care se rostogolesc ricoseaza din marginea cercului.
4. Mini-luptele: `duelFighter()` sare deja peste eroii `safe`. Daca ambii sunt in cuib, paznicul se plimba pe langa cerc si nu ataca. Fara regula asta un copil poate termina lupta stand in cuib.
5. Desenul (`drawDuelGround` din `075-duel.js`): cercul verde punctat se deseneaza acum doar in lupta. Muta-l intr-o functie `drawNestShelter(c)` in `08-draw.js`, apelata mereu. In afara luptei, mai discret (alpha 0.35).
6. Nivelul boss-ului: cuibul lui Ciori e sus in copac, eroii nu ajung acolo. Pune un "cuib mic" pe jos, la marginea arenei (de exemplu la `{x: 360, y: 900}`), cu aceeasi regula. **Intrebare deschisa I1.**
7. Sunetul "ih-ih" (`vHide`) si vibratia scurta raman la intrarea in cuib, dar nu mai des de o data la 3 s (altfel se repeta cand un copil sta pe margine).

**Test:** un test nou `tests/cuib-adapost.js`: erou in cuib, gandac treaz langa el, con aruncat peste el, vant pe nivelul 4, boss. Niciun `hitHero`, pozitia nu se schimba de la vant.

---

## U2. Puterea in toate directiile

**Cerinta:** "ambele personaje cand isi folosesc puterea (...) puterea se duce in toate directiile (cum e la saritul dinozaurului) (...) in cazul fotbalistului ar fi trebuit sa arunce cu mingi in toate directiile."

**Acum:** Bubu tropaie in cerc (`doStomp`). Corect deja. Leo are o singura minge (`P.ball`) pe care o suteaza intr-o directie (`kickBall`), cu incarcare si ajutor la tintire pe Ușor.

**De facut pentru Leo:**

1. `P.ball` devine `P.balls`, o lista. Valori noi in `CONFIG.heroes[1]`:
   - `ballsPerKick: 8` (comentariu: "cate mingi pleaca la o apasare, la distante egale pe cerc")
   - `ballsPerKickMax: 12` (la sutul incarcat complet)
2. `kickBall(h, power)` creeaza `n = round(lerp(ballsPerKick, ballsPerKickMax, power))` mingi, la unghiuri `i / n * TAU`, rotite cu directia stick-ului (ca o minge sa plece mereu exact unde priveste Leo). Viteza si durata ca acum.
3. Fiecare minge are viata ei: sare de pereti, se opreste, apoi se intoarce la Leo si dispare cand ajunge. Leo poate sutui din nou doar cand toate mingile s-au intors sau dupa 1.2 s (o valoare in `CONFIG`: `kickCooldown`). A doua apasare cat zboara le cheama inapoi pe toate.
4. Desenul: fiecare minge cu umbra ei. Cu 12 mingi deodata, sprite-ul mingii trebuie pus in cache (`sprite()` din `02-core.js`), cum e facut la oua.
5. Ajutorul la tintire (`aimAssist`) nu mai are rost. Sterge-l si sterge `difficulty.*.aimAssist`. Pe Ușor, in schimb, mingile sunt mai mari (raza x 1.3) si zboara mai incet (x 0.85).
6. Tot ce reactiona la "mingea" trebuie sa reactioneze la oricare minge, o singura data pe sut:
   - ameteala gandacilor si a conurilor,
   - steaua din copac (sut incarcat): orice minge incarcata care atinge copacul,
   - steaua de pe insula,
   - paznicii din mini-lupte (`bossBall`, `duelBall`): o lovitura pe sut, nu una pe minge, altfel lupta se termina dintr-o data,
   - cuibul lui Ciori la boss: o lovitura pe sut.
7. Sunetul: un singur `kick` la plecare, plus un "fff" scurt (`swish`) mai incet. Fiecare ricoseu pe perete: `bounce`, dar maxim 3 pe secunda pentru toate mingile la un loc.
8. Vibratia ramane una pe sut.

**De facut pentru Bubu:** nimic la putere. Optional, pentru simetrie vizuala, inelul de praf din `doStomp` sa fie la fel de vizibil ca roata de mingi.

**De verificat cu proprietara:** daca sutul incarcat mai trebuie pastrat. Recomandare: da, pentru ca este provocarea celui mare (mai multe mingi, mai departe, singura cale spre steaua din copac).

**Test:** `mini-lupte-bot.js` si `nivele-bot-mers.js` trebuie adaptate (botul nu mai tinteste). Un test nou care numara: o apasare = 8 mingi, fiecare se intoarce, o singura lovitura pe paznic pe sut.

---

## U3. Doua lupte pe nivel: la mijloc si la cuib

**Cerinta:** "lupta ca grad de dificultate cum e acum sa fie cand personajele ajung la mijlocul drumului si boss fight-ul sa fie mai greu."

**Interpretare:** fiecare nivel are doua lupte:

1. **Lupta de la mijloc**, exact cum e lupta de acum (acelasi paznic, aceleasi valori). Porneste cand eroii ajung la jumatatea drumului.
2. **Lupta de la cuib** (pe care proprietara o numeste "boss fight"), cu un paznic mai greu, inainte de deschiderea cuibului.

Si boss-ul final, Ciori, devine mai greu. **Intrebare deschisa I2:** "boss fight" inseamna lupta de la cuib, Ciori, sau ambele. Specificatia de mai jos le face pe amandoua.

**Lupta de la mijloc:**

1. Porneste cand se termina valul 2 din 3 de oua (aproape de mijloc, `progress` aproximativ 0.5). Alternativa: cand un erou trece de punctul din mijloc al lui `L.path`. Recomandare: dupa valul 2, pentru ca nu poate fi sarita.
2. Paznicul aterizeaza pe drum, in punctul din mijloc al lui `L.path`, nu langa cuib.
3. Adapostul in timpul acestei lupte este tot cuibul (U1). Cuibul poate fi departe, deci cel mic poate si doar sa adune ouale.
4. In `CONFIG.duel`: `hpMid` (acum `hp`: `[3, 3, 4, 4, 4, 5]`), valori neschimbate.
5. Bara de progres (`drawProgress` din `08-draw.js`) primeste un al doilea semn de lupta, intre valurile 2 si 3.

**Lupta de la cuib, mai grea:**

1. Al doilea paznic al nivelului. Cel mai simplu: acelasi tipar ca paznicul de la mijloc, dar "Marele ..." (marit x 1.3, coroana). Mai frumos: sase paznici noi, cate unul pe nivel. **Intrebare deschisa I3.**
2. Valori noi in `CONFIG.duel.final`:
   - `hp: [5, 5, 6, 6, 7, 8]`
   - `speed: 1.25` (inmultitor la `sf`)
   - `prep: 0.75` (inmultitor la timpii de pregatire: avertizarea rosie e mai scurta)
   - `tired: 0.75` (inmultitor la `tiredTime`)
   - `extra: 1` (un atac in plus la rand)
   - `phase2At: 0.5`: la jumatate din inimi paznicul se infurie (culoare mai calda, tremura), iar `extra` creste cu 1.
3. Pe Ușor pentru cel mic raman regulile de acum: nu e tinta, nu poate fi lovit cand ajuta.
4. Muzica: aceeasi melodie de lupta, cu tempo 116 in loc de 104.

**Boss-ul final, mai greu:**

1. `CONFIG.boss.hits`: 3 in 5.
2. `CONFIG.boss.shakes`: `[1, 2, 2]` in `[2, 2, 3, 3, 3]`.
3. `CONFIG.boss.downTime`: 7 in 5.
4. `CONFIG.boss.throwEvery`: `[3.4, 2.7, 2.2]` in `[3, 2.5, 2.1, 1.8, 1.6]`.
5. In ultimele 2 runde Ciori arunca doua conuri deodata.
6. Cel mic pe Ușor ramane ferit ca in mini-lupte (`duelSpares`), iar cuibul mic de pe jos (U1) e adapost.

**Timpul total:** cu doua lupte pe nivel, jocul creste cu aproximativ 1 minut pe nivel. Fie accepti 50 de minute in loc de 45, fie scazi `levelDuration` de la 360 la 320.

**Test:** `mini-lupte-bot.js` pentru ambele lupte. `joc-complet-bot.js` trebuie sa treaca de ambele. Tinta: lupta de la cuib dureaza de 1.5 pana la 2 ori cat cea de la mijloc pentru botul de pe Normal.

---

## U4. 30 de sunete pentru fiecare personaj: limba lor

**Cerinta:** "personajele sa aiba fiecare cate 30 de sunete diferite pentru diverse actiuni - un fel de limba a lor, draguta, amuzanta."

**Acum:** fiecare erou are 5 voci (`vGo`, `vOw`, `vYay`, `vWow`, `vHide`) facute din aceeasi functie `say()`, cu tonuri diferite pentru Bubu si Leo, plus pasii.

**Regula de baza:** fara fisiere audio (`CLAUDE.md`, regula 1). "Cuvintele" se fac cu Web Audio, ca acum: silabe scurte, fiecare o nota sinus sau triunghi care urca sau coboara, trecuta printr-un filtru care imita o vocala.

### Cum se construieste o limba

1. O functie noua `babble(b, t, k, word)` in `03-audio.js`. Un `word` este o lista de silabe. O silaba: `[vocala, nota, durata, alunecare]`.
   - `vocala`: `a`, `e`, `i`, `o`, `u`. Fiecare inseamna doua filtre `bandpass` paralele (formantii), de exemplu `a` = 800 si 1200 Hz, `i` = 300 si 2300 Hz, `u` = 300 si 800 Hz. Pentru Bubu formantii se inmultesc cu 0.85 (voce mai "rotunda"), pentru Leo cu 1.15.
   - `nota`: semitonuri peste nota de baza a eroului (Bubu: Sol 2, voce joasa, moale; Leo: Re 4, voce mai sus, rapida).
   - `durata`: 0.06 pana la 0.35 s.
   - `alunecare`: cat urca sau coboara nota in silaba, in semitonuri.
   - Sursa: `triangle` plus putin `sine` cu o octava mai sus, atac 0.015 s, fara margini taiate.
2. Toate "cuvintele" stau intr-un tabel `WORDS = { bubu: {...}, leo: {...} }`, cate 30 de intrari, cu numele actiunii ca cheie. Asa se pot asculta si schimba usor.
3. Personalitate:
   - **Bubu** (pui de dinozaur, 6 ani): silabe din "bu", "mo", "ga", "rrr" moale. Lent, vesel, putin stangaci. Termina des cu un "mm" de multumire.
   - **Leo** (fotbalist, 8 ani): silabe din "le", "ti", "pa", "hop". Rapid, energic, cu urcari de ton. Ca un comentator mic de fotbal.
4. Ca sa nu enerveze:
   - cel mult o voce pe erou o data la 0.5 s; o voce noua cu prioritate mai mare o opreste pe cea veche;
   - actiunile dese (ou luat, pas) au 3 variante si se aleg la intamplare, fara aceeasi de doua ori la rand;
   - o voce pentru "ou luat" la cel mult 1 din 3 oua; la celelalte doar sunetul de kalimba de acum.
5. Toate merg pe volumul "Sunete personaje", sunt in lista `CHR` si se redau cu `Snd.play(nume, valoare, erou)`, ca sa poata merge in difuzorul controllerului.

### Cele 30 de actiuni

Aceeasi lista pentru ambii eroi, cu "cuvinte" diferite. Prioritatea: 3 = taie orice, 1 = se aude doar daca eroul tace.

| Nr | Cheie | Cand se aude | Prioritate | Bubu (cum suna) | Leo (cum suna) |
|---|---|---|---|---|---|
| 1 | `hello` | Inceputul nivelului, dupa poveste | 3 | "bu-buu!" urcat | "le-oo, hai!" |
| 2 | `ready` | Apasa ✕ pe ecranul de start | 3 | "mm-ga!" | "ti-pa!" |
| 3 | `egg` | Ia un ou (3 variante) | 1 | "mo!" | "pi!" |
| 4 | `eggs5` | 5 oua la rand, repede | 2 | "mo-mo-mo-mooo" | "pi-pi-pi-paa" |
| 5 | `star` | Ia o stea | 3 | "uaaa-bu!" | "uau-ti-ti!" |
| 6 | `giant` | Ia oul urias | 3 | "booo-ga-ga-ga!" | "go-o-o-ol!" lung |
| 7 | `power` | Foloseste puterea | 2 | "hup!" jos | "hop!" sus |
| 8 | `powerBig` | Tropait langa multe oua / sut incarcat complet | 3 | "rrr-BUM!" | "hiii-PA!" |
| 9 | `hurt` | E lovit | 3 | "au-buu" coborat | "aoleu-le" |
| 10 | `dizzy` | Ameteste, cat se rotesc stelele | 2 | "bu-bu-bu..." care se clatina | "le-le-le..." care se clatina |
| 11 | `recover` | Isi revine din ameteala | 2 | "mm! bu." | "gata!" scurt |
| 12 | `drop` | Scapa un ou | 2 | "oo-oh" | "ups-pa" |
| 13 | `regain` | Ia inapoi oul scapat | 2 | "mm-mo!" | "a-ha!" |
| 14 | `hide` | Intra in cuib | 2 | "ih-ih" moale | "ss-ss" (soptit) |
| 15 | `unhide` | Iese din cuib | 1 | "bu?" | "hop-afara" |
| 16 | `beetleWake` | Un gandac se trezeste aproape | 2 | "ga?!" | "o-o!" |
| 17 | `beetleStun` | Ameteste un gandac | 2 | "hi-hi-bu" | "ha-ti!" |
| 18 | `wind` | Incepe vantul | 2 | "fuuu-bu" | "fiuuu!" |
| 19 | `mud` | Intra in noroi | 1 | "bloop-bu" | "iac-le" |
| 20 | `bridge` | Trece pe pod sau pe pietre | 1 | "tup-tup" | "tip-tap" |
| 21 | `butterfly` | Prinde fluturele (viteza) | 3 | "bu-bu-bu-ziiip!" | "ziuuum!" |
| 22 | `guardHit` | Loveste un paznic | 3 | "BUM-ga!" | "GOL!" |
| 23 | `notYet` | Loveste cand inca nu conteaza | 1 | "mm?" | "ah-na" |
| 24 | `guardGone` | Paznicul fuge | 3 | "bu-bu-buuu!" | "le-le-leee!" |
| 25 | `bored` | Sta pe loc 8 s | 1 | "mm-mm-mm" fredonat | fluierat scurt "fi-fi-fii" |
| 26 | `callFriend` | Prietenul e departe (peste 1200) de 5 s | 1 | "le-oo?" (strigand numele) | "bu-buu?" |
| 27 | `together` | Ajung unul langa altul dupa ce au fost departe | 2 | "mm-bu!" | "ti-la!" |
| 28 | `nestOpen` | Cuibul se deschide | 3 | "ga-ga-mo!" | "hai-la-cuib!" |
| 29 | `levelWin` | Finalul nivelului | 3 | "bu-bu-bu-BU!" | "le-o-le-o-le!" |
| 30 | `bossDown` | Ciori cade din copac | 3 | "ga-ga-ga-ha!" | "pa-pa-pa-ha!" |

Doua dintre ele (26 si 1) folosesc numele celuilalt. Nu este o vorbire reala, doar ritmul si tonul lui.

### De verificat dupa implementare

- `sunete-volum.js`: toate 60 de cuvinte pornesc, varf intre 0.08 si 0.25 la iesire.
- Ascultat de un om, cu copiii. Daca un cuvant enerveaza, se schimba in `WORDS`, nu in cod.
- Optiune noua in Setari: "Personajele vorbesc" Da/Nu (cheia `set.babble`), separata de volum.

---

## U5. Muzica si controllerul

**Cerinta:** "nu ma intereseaza sa dau mai incet muzica din controller".

**Interpretare:** nu e nevoie de un reglaj de volum al muzicii pentru difuzorul controllerului. Acum muzica merge oricum doar in boxele Mac-ului; in controller merg doar sunetele personajului. Nu se adauga nimic. **Intrebare deschisa I4:** daca de fapt ea vrea ca muzica sa se auda si in controller, sau ca volumul muzicii sa se poata schimba din butoanele controllerului in timpul jocului (de exemplu cu D-pad sus/jos in pauza).

---

## U6. Minimum 10.000 de elemente

**Cerinta:** "sa existe minim 10.000 de elemente in joc."

**Acum:** `tests/numara-elemente.js` numara obiectele din listele fiecarui nivel. Rezultatul de acum:

| Nivel | Obiecte |
|---|---|
| 1 Pajiștea Însorită | 179 |
| 2 Pădurea Somnoroasă | 247 |
| 3 Malul Noroios | 207 |
| 4 Dealul Morilor | 181 |
| 5 Cascada Secretă | 180 |
| 6 Drumul Apusului | 234 |
| Boss | 2 |
| **Total** | **1230** |

La acestea se adauga 60 de oua pe nivel (360) si pictura fundalului (mii de pete de culoare, dar acestea nu sunt "elemente" separate: sunt pictate o data intr-o imagine).

**Interpretare:** element = un obiect separat din lume, pe care copilul il poate vedea ca lucru distinct: o floare, un tufis, o ciuperca, o piatra, un fluture, o frunza care cade, un ou, un gandac. **Intrebare deschisa I5:** daca "elemente" inseamna obiecte de decor, lucruri cu care se poate interactiona, sau altceva (de exemplu oua de adunat).

**Plan (interpretarea de mai sus):**

1. Un strat nou de decor viu, `L.decor`, in `06-level.js`, generat cu aceeasi samanta ca nivelul. Tipuri:
   - flori (5 forme, culorile din `PETALS`), fire de iarba, trifoi, ciuperci, pietricele, papadii, scaieti, melci, buburuze pe frunze, gaze, broscute mici (nivelul 5), trestie (nivelurile 3 si 5), spice (nivelul 4), lampioane mici (nivelul 6).
   - Tinta: cel putin 1700 pe nivel, deci peste 10.000 in total, numarate de `numara-elemente.js`.
2. Elementele reactioneaza, ca sa fie "elemente" si nu doar textura:
   - se apleaca cand trece un erou (iarba, flori),
   - zboara cand Bubu tropaie (papadii, frunze),
   - fug din calea mingii (gaze, melci care se ascund in casuta),
   - unele scot un sunet mic, cu o pauza de 0.3 s.
3. Performanta: 1700 de obiecte desenate pe rand ar fi prea lent. Solutia:
   - elementele nemiscate sunt pictate in fundal (`L.bg`) o data, ca acum;
   - doar elementele aflate la cel mult 300 de unitati de un erou sau de o minge sunt desenate separat, animate, din sprite-uri in cache;
   - o grila spatiala (celule de 160) ca sa gasesti repede elementele din jurul unui erou.
   - Tinta: sub 14 ms pe cadru in `performanta.js` (masurat fara placa video).
4. `numara-elemente.js` afiseaza totalul si da eroare daca e sub 10.000.

---

## Intrebari deschise

Trebuie puse proprietarei inainte de implementare. Pana la raspuns, cine lucreaza foloseste recomandarea.

| Nr | Intrebare | Recomandare |
|---|---|---|
| I1 | Pe nivelul boss-ului cuibul e in copac. Facem un cuib mic pe jos ca adapost? | Da, la marginea arenei. |
| I2 | "Boss fight-ul sa fie mai greu": lupta de la cuib a fiecarui nivel, Ciori de la final, sau ambele? | Ambele. |
| I3 | Lupta de la cuib: acelasi paznic, mai mare si mai rapid, sau un paznic nou pe fiecare nivel? | Acelasi, marit, ca sa intre mai repede; paznici noi intr-un update separat. |
| I4 | "Nu ma intereseaza sa dau mai incet muzica din controller": nu se adauga nimic, sau vrei altceva cu muzica si controllerul? | Nu se adauga nimic. |
| I5 | "10.000 de elemente": decor viu (flori, iarba, gaze), obiecte de adunat, sau altceva? | Decor viu care reactioneaza. |
| I6 | Sutul incarcat al lui Leo ramane cu mingile in toate directiile? | Da: mai multe mingi si mai departe. |

## Decizii care vor intra in `16-decizii.md`

Cand se implementeaza, adauga in `16-decizii.md`:

- Cuibul e adapost in tot jocul (cerere directa). Paznicii si gandacii nu ataca pe nimeni in cuib; daca ambii sunt in cuib, nimic nu progreseaza, ca sa nu se poata castiga stand ascuns.
- Puterea lui Leo in cerc (cerere directa). O lovitura pe paznic pe sut, nu pe minge.
- Doua lupte pe nivel, cea de la cuib mai grea (cerere directa).
- Limba personajelor din silabe sintetizate, fara fisiere audio (regula 1).
- Decorul viu pictat in fundal si desenat separat doar langa eroi (performanta).
