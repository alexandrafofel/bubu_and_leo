# 28. George vine de doua ori, dupa diamante (sarcina T15)

> Specificatie, nu cod. Scrisa pe 22 noiembrie 2026, dupa T14 (cota de diamante, `docs/27-cota-de-oua.md`).
> Cererea proprietarei: "george cel rau vine de doua ori in level - o data la mijlocul jocului, cand cei doi impreuna au strans jumatate din cota de diamante, si o data la sfarsitul rundei cand au strans toata cota. Cand vine la sfarsitul rundei arunca cu inamici mici care au cate 3 inimioare. Cu cat level-ul e mai inaintat, cu atat arunca mai multi. Scoate maximul de diamante pe care le pot lua: pot lua oricate, jocul se termina cand l-au invins pe George si fiecare are minimul lui de diamante."

---

## G1. Cum e acum (verificat in cod, 22 noiembrie 2026)

Trei lucruri exista deja si nu se rescriu, doar se leaga altfel:

1. **George vine de doua ori pe nivel.** `startDuel('mid')` si `startDuel('nest')`, in `src/075-duel.js`. Pe nivelul 1 e mic (`size` 0.62) si doar fuge la tine; pe nivelul 6 sare, arunca pietre si scoate scantei (`DUEL_DEFS_L`). Lupta de la cuib e mai mare, mai rapida si cu un atac in plus.
2. **Declansatorul e numarul de valuri**, nu diamantele: `checkWave()` in `src/07-play.js` cheama lupta din mijloc la `P.wave === L.NW - 2` si pe cea de la cuib dupa ultimul val.
3. **Cota are minim si maxim.** `P.q` e minimul fiecarui erou, `P.cap = ceil(1.5 q)` e maximul. Peste `cap` eroul nu mai poate lua (`canTake`), diamantul ramane pe jos cu balonul "Plin!".

Ce se schimba in T15: punctul 2 (declansatorul) si punctul 3 (maximul dispare). Plus inamicii aruncati, care sunt lucru nou.

---

## G2. Variantele cautate si ce am ales

Proprietara a cerut: "cauta mai multe variante ca jocul sa fie super engaging si spune-mi ce variante ai cautat si cum crezi ca e cel mai bine."

### A. Cand vine George

| Varianta | Cum | De ce da / de ce nu |
|---|---|---|
| **A1. Dupa diamante (aleasa)** | Jumatate din cota comuna => lupta din mijloc. Cota comuna intreaga => lupta de la cuib. | Copiii inteleg legatura: "cat strangem, atat de repede vine". Da un rost culesului, care pana acum era doar o sarcina. E si cererea proprietarei. |
| A2. Dupa valuri (cum e acum) | Nemodificat. | Nimic nu leaga culesul de lupta. Un copil care culege repede si unul care culege incet vad acelasi joc. |
| A3. Dupa timp | George vine la minutul 2 si la minutul 4. | Pedepseste copilul lent. Cel mic de 6 ani ar fi mereu prins nepregatit. |
| A4. Mixt: diamante, dar nu mai devreme de un val | Declansator pe diamante, cu o podea. | Protejeaza impotriva unui nivel in care primul val are destule diamante pentru jumatate de cota. **Am pastrat ideea** ca o siguranta mica (vezi G4). |

### B. Ce face maximul de diamante

Asta e partea delicata. Maximul (`cap`) nu a fost o toana: el impiedica blocajul in care cel de 8 ani aduna tot si cel de 6 ani ramane cu zero si nu mai poate termina nivelul. Daca il scoatem pur si simplu, blocajul se intoarce.

| Varianta | Cum | Verdict |
|---|---|---|
| **B1. Fara maxim + padurea nu seaca (aleasa)** | Pot lua oricate. Daca nu mai sunt diamante pe jos si cineva e sub minim, se aprinde inca un copac cu diamante, exact cat lipseste plus doua. | Respecta cererea ("pot lua oricate") si taie blocajul din radacina, nu cu o regula pe care copiii trebuie sa o inteleaga. Padurea pare generoasa, nu zgarcita. |
| B2. Fara maxim, fara plasa | Pot lua oricate, nivelul are mai multe diamante de la inceput. | Un copil de 8 ani care alearga repede poate tot sa ia tot. Ramane L1 si ajutorul automat, dar nivelul se poate impotmoli minute bune. |
| B3. Maxim pastrat, doar ridicat (3x minimul) | `cap = 3q`. | Jumatate de masura. Balonul "Plin!" tot apare, iar proprietara a cerut explicit "pot lua oricate". |
| B4. Fara maxim, dar diamantele peste minim merg intr-un sac comun | Ce iei peste minim e al echipei, nu al tau. | Frumos pe hartie, greu de explicat la 6 ani. Doua numaratori in loc de una. |

**Ales: B1.** Numarul din insigna devine `gasite / minim`, iar dupa minim arata `15 ✓ +5`. Nimic nu mai refuza un diamant.

### C. Ce fac inamicii aruncati

| Varianta | Cum | Verdict |
|---|---|---|
| C1. George e blindat pana sunt curatati | Loviturile in George nu conteaza cat traieste un inamic aruncat. | Cel mai "tactic", dar e un zid: daca cel mic nu reuseste sa curete, lupta sta pe loc. La 6 ani asta inseamna plans. |
| **C2. Nu blindeaza, dar fiecare inamic lasa un diamant (aleasa)** | George poate fi lovit oricand; inamicii sunt o alegere, nu o bariera. | Da fiecarui copil ceva de facut fara sa blocheze pe nimeni. Cel mare tine linia la George, cel mic strange diamantele care pica. Rasplata, nu pedeapsa. |
| C3. Inamicii fura diamante | Te ating, iti iau un diamant si fug cu el. | Prea aspru. Pierderea a ceva deja castigat e exact ce enerveaza copiii mici. |
| C4. Inamicii doar fac galagie | Fara inimi, se sparg la prima atingere. | Prea putin: nu se simt ca un atac al lui George. |

**Ales: C2**, cu trei inimi fiecare, asa cum a cerut proprietara, si doua inimi pe dificultatea Ușor.

### D. Alte lucruri incercate pe hartie si lasate deoparte

- **Umbra lui George la un sfert de cota**: trece prin spatele scenei, fara sa atace, ca sa se simta ca vine. Frumos, dar inca un sistem de desen; se poate adauga mai tarziu, nu acum.
- **Lovitura dubla**: daca amandoi lovesc in aceeasi secunda, George pierde doua inimi. Incurajeaza joaca impreuna, dar cere o sincronizare peste puterile unui copil de 6 ani.
- **Clopotelul**: cel mic apasa ○ si George ameteste o secunda. Se bate cap in cap cu ○, care e deja "ajuta prietenul". Regula 8 din `CLAUDE.md` nu se schimba pentru asta.
- **Bara de viata a lui George in banda de sus**: utila, dar banda e deja plina (`HUD_TOP`, vezi `12-desen-si-hud.md`). Inimile de deasupra lui raman.

---

## G3. Numerele

### Cota, pe nivel

`CONFIG.quota.perLevel` ramane **minimul fiecarui erou**. `CONFIG.quota.cap` si `extra` se scot.

| Nivel | Minim pe erou (`q`) | Cota comuna (`Q = 2q`) | George vine la | si la |
|---|---|---|---|---|
| 1 | 15 | 30 | 15 | 30 |
| 2 | 20 | 40 | 20 | 40 |
| 3 | 25 | 50 | 25 | 50 |
| 4 | 30 | 60 | 30 | 60 |
| 5 | 35 | 70 | 35 | 70 |
| 6 | 40 | 80 | 40 | 80 |

Proprietara a dat exemplul "la level 1 - 15 oua ... toata cota - 30". Asta inseamna minim 15 pe erou, nu 10 cum e acum (`perLevel: [10, 15, 20, 25, ...]`). Am urcat toata lista cu un pas, ca exemplul ei sa fie adevarat. Nivelurile 7 - 12 (partea a doua) continua: 45, 50, 55, 60, 65, 70.

**Cat se genereaza pe nivel**: cel putin `2.5 x Q` diamante, in loc de regula veche `2q .. 2cap`. Restul vine din copaci, cand e nevoie (G4).

### Inamicii aruncati, pe nivel

| Nivel | Aruncari | Cati o data | Total | Inimi fiecare |
|---|---|---|---|---|
| 1 | 1 | 2 | 2 | 3 (2 pe Ușor) |
| 2 | 1 | 4 | 4 | 3 |
| 3 | 2 | 2 | 4 | 3 |
| 4 | 2 | 3 | 6 | 3 |
| 5 | 2 | 4 | 8 | 3 |
| 6 | 3 | 4 | 12 | 3 |

Asta respecta exact cele doua numere date de proprietara: nivelul 2 arunca 4, nivelul 5 de doua ori cate 4. Nivelul 2 e singurul salt mare (de la 2 la 4 dintr-o data). Daca la joaca se dovedeste prea mult pentru cel de 6 ani, se schimba o singura cifra in `CONFIG.lupta.george.throws` la `[3]`; nimic altceva.

`CONFIG.lupta.george.throws = [[2], [4], [2, 2], [3, 3], [4, 4], [4, 4, 4]]`.

**Cand arunca**: la inceputul luptei de la cuib prima aruncare, apoi cate una la fiecare treime din inimile lui George (deci aruncarea a doua cand a pierdut o treime, a treia cand a pierdut doua treimi). Asa aruncarile sunt legate de cum merge lupta, nu de un cronometru.

---

## G4. Cum functioneaza, pe larg

### Declansatorul (inlocuieste bucatile din `checkWave()`)

Se tine o numaratoare noua: `P.teamFound = P.found[0] + P.found[1]` (diamantele numarate pentru minim, deci cele cu `goal`; vezi `27-cota-de-oua.md`, C4). Diamantele date cu L1 nu se numara de doua ori, pentru ca trec de la un erou la altul.

- Cand `P.teamFound >= Q / 2` si `!P.midFought`: `P.midFought = true`, bannerul `george.half`, apoi `startDuel('mid')`.
- Cand `P.teamFound >= Q` si `!P.nestFought`: `P.nestFought = true`, bannerul `george.final`, apoi `startDuel('nest')`.
- Siguranta (varianta A4): lupta din mijloc nu porneste in primele 20 de secunde ale nivelului (`CONFIG.lupta.george.minT`), ca sa nu sara pe copii imediat dupa "Start!".
- Valurile curg mai departe singure, fara sa mai cheme lupte: `checkWave()` ramane doar pentru valuri si pentru deschiderea cuibului.

### Padurea nu seaca (plasa de siguranta B1)

Intr-o functie noua, `keepEnough()`, chemata o data pe secunda:

- Daca nu e nicio lupta in curs, nu mai sunt diamante pe jos, niciun copac aprins, si un erou e sub minimul lui cu `n` diamante: se aprinde cel mai apropiat copac neatins de el, cu `n + 2` diamante.
- Daca nu mai sunt copaci, diamantele apar direct langa eroul care are nevoie, cate doua, la 3 secunde.
- Bannerul `george.more` ("Pădurea mai are!") apare o singura data pe nivel.

Asta inlocuieste rolul vechiului `cap`. Blocajul dispare pentru ca nu mai exista o cantitate fixa de impartit.

### Fara maxim

- `canTake` nu mai verifica `cap`: orice diamant `goal` poate fi luat de oricine.
- `quotaState(k)` intoarce `{ found, q, ok: found >= q, extra: max(0, found - q) }`. `cap` dispare.
- `giveEgg` / `sendEgg` (L1) nu mai au limita la primitor; raman limitate de cate are cel care da.
- Ajutorul automat (`updateAutoGive`) ia tot din ce e peste minimul celui care da, ca si pana acum.
- Balonul "Plin!" (`quota.full`) si `h.fullT` se scot cu totul.

### Inamicii aruncati

In lupta de la cuib (`kind === 'nest'`), George arunca dupa regula din G3. Fiecare aruncare:

1. George se ridica, bannerul mic `george.throw` ("Ai grijă!"), sunet de avertizare.
2. Pe pamant apar cercurile rosii unde vor cadea (acelasi desen ca la conuri, `11-mini-lupte.md`).
3. Inamicii zboara in arc din mainile lui si aterizeaza. La aterizare, un mic nor de praf.
4. Merg spre cel mai apropiat erou care nu e aparat (`duelSpares`, nemodificat).

Un inamic aruncat e un `smallEnemy` cu `hits: 3` (2 pe Ușor), `thrown: true` si `drops: 1`. Cand e invins, lasa un diamant `goal`, care se numara la minimul celui care il ia. Inamicii aruncati nu reapar (`respawn` nu se aplica lor) si dispar cand George e invins.

George **nu** e blindat: poate fi lovit oricand, chiar daca inamicii traiesc (varianta C2).

### Nivelul se termina

Trei conditii, toate:

1. George a fost invins in lupta de la cuib (`P.nestFought && P.duel.over`);
2. fiecare erou care joaca are cel putin minimul lui (`quotaOk(k)`);
3. amandoi sunt in cuib (regula 10 din `CLAUDE.md`, nemodificata).

Cuibul se deschide dupa punctul 1. Daca intra amandoi in cuib si punctul 2 nu e gata, ramane bannerul `need` de la T14 ("Killer mai are nevoie de 3"), iar ajutorul automat lucreaza mai departe. Nimic nu se termina cu "Game Over".

---

## G5. Ce se vede

- **Insigna** (`drawBadge`): `gasite / minim`. Dupa minim, bifa si, in dreapta, `+5` mic, in verde. Numarul nu mai e rosu dupa ce s-a atins minimul, oricat ar strange peste.
- **Bara lui George**: inimile de deasupra lui, ca acum. In lupta de la cuib, sub inimi apar punctele aruncarilor ramase (2 sau 3 puncte mici), ca sa se vada ca mai urmeaza.
- **Bannerele noi**: `george.half` ("George cel Rău se trezește!"), `george.final` ("George cel Rău, ultima luptă!"), `george.throw` ("Ai grijă!"), `george.more` ("Pădurea mai are!").
- **Sageata ajutatoare** (`guideTarget`): cand un erou e peste minim si prietenul nu, arata spre prieten cu `iconL1`, ca in T14. Cand lupta e in curs, arata spre George.

---

## G6. `CONFIG` (in `src/01-config.js`)

```
quota: {
  on: true,
  perLevel: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],  // MINIMUL fiecarui erou, nivel 1 .. 12
  giveRange: 420, giveEvery: 0.3, flyTime: 0.45,
  autoGive: 120, autoEvery: 2,
  supply: 2.5,          // cate diamante are nivelul, ca parte din cota comuna (2.5 x Q)
  refillEvery: 3        // secunde intre doua diamante noi, cand padurea trebuie sa mai dea
}
```

```
lupta: { ... george: {
  minT: 20,                                        // lupta din mijloc nu porneste mai devreme de atat
  throws: [[2], [4], [2, 2], [3, 3], [4, 4], [4, 4, 4]],   // aruncari x cati, pe nivel
  smallHp: 3, smallHpEasy: 2,                      // inimile unui inamic aruncat
  smallDrop: 1,                                    // diamante lasate cand e invins
  throwArc: 0.9                                    // secunde cat zboara prin aer
} }
```

`CONFIG.quota.cap` si `CONFIG.quota.extra` se sterg. `CONFIG.duel.enabled` ramane.

---

## G7. Textele noi (`src/015-lang.js`)

| Cheie | Romana | Engleza |
|---|---|---|
| `george.half` | George cel Rău se trezește! | George the Grim wakes up! |
| `george.final` | George cel Rău, ultima luptă! | George the Grim, the last fight! |
| `george.throw` | Ai grijă! | Look out! |
| `george.more` | Pădurea mai are! | The forest has more! |
| `quota.extra` | +{0} | +{0} |

`quota.full` ("Plin!") si `L:quota.full` se sterg, pentru ca nimeni nu mai e plin.

---

## G8. De facut in cod, pe sarcini

| Sarcina | Ce | Fisiere | Timp |
|---|---|---|---|
| **T15.1** | Fara maxim: scoate `cap` din `canTake`, `quotaState`, `giveEgg`, `sendEgg`, insigna, ecranul de sfarsit si `CONFIG`. Scoate `quota.full` si `h.fullT`. Insigna arata `+n`. | `01-config.js`, `015-lang.js`, `07-play.js`, `08-draw.js`, `09-screens.js` | 1 - 2 h |
| **T15.2** | Cote noi (`perLevel` urcat) si generarea a `2.5 x Q` diamante pe nivel. | `01-config.js`, `06-level.js` | 45 - 90 min |
| **T15.3** | `keepEnough()`: padurea nu seaca, bannerul `george.more`. | `07-play.js` | 1 - 2 h |
| **T15.4** | Declansatorul pe diamante: `P.teamFound`, luptele chemate din cota, `minT`, `checkWave()` curatat de lupte. Bannerele `george.half` si `george.final`. | `07-play.js`, `015-lang.js` | 1,5 - 2,5 h |
| **T15.5** | Inamicii aruncati: `CONFIG.lupta.george.throws`, aruncarea in arc, cercurile pe pamant, 3 inimi, diamantul lasat, punctele de sub inimile lui George. | `075-duel.js`, `07-play.js`, `08-draw.js` | 2 - 3 h |
| **T15.6** | Sfarsitul nivelului cu cele trei conditii; `tests/george.js` cu verificarile din G9; documentatia si `CLAUDE.md` (regulile 6 si 9). | `07-play.js`, `tests/`, `docs/` | 2 - 3 h |

Ordinea conteaza: T15.1 si T15.2 intai (altfel T15.3 si T15.4 lucreaza cu numere vechi), apoi T15.3, T15.4, T15.5, T15.6.

---

## G9. Teste (`tests/george.js`)

1. Pe fiecare nivel, numarul de diamante generate e cel putin `2.5 x Q`.
2. Un erou poate trece peste minim: la `q + 7` inca ia diamante, `fullT` nu mai exista.
3. Lupta din mijloc porneste exact cand `P.teamFound` ajunge la `Q / 2`, si nu inainte de `minT` secunde.
4. Lupta de la cuib porneste exact cand `P.teamFound` ajunge la `Q`.
5. Niciuna nu porneste de doua ori (`midFought`, `nestFought`).
6. Declansatorul merge si cand unul singur strange tot: cu `found = [Q, 0]`, ambele lupte au pornit.
7. In lupta de la cuib, numarul de inamici aruncati e cel din tabel, pe fiecare nivel; fiecare are 3 inimi (2 pe Ușor).
8. Un inamic aruncat, invins, lasa un diamant `goal`, care creste `found` al celui care il ia.
9. George poate fi lovit cat inamicii traiesc (nu e blindat).
10. `keepEnough()`: cu zero diamante pe jos si un erou sub minim, in 3 secunde apar diamante noi.
11. Nivelul nu se termina fara George invins, nici fara minimul fiecaruia, nici fara amandoi in cuib; se termina cand toate trei sunt gata.
12. Cu un singur jucator: minimul celuilalt se socoteste indeplinit, restul la fel.
13. Dupa reincepere ("Încă o dată!"), `teamFound`, `midFought` si `nestFought` sunt zero.

Fiecare verificare pusa sa pice, ca la `tests/cota.js` (`MUTA=n`).

---

## G10. Ce se schimba in `CLAUDE.md`

- Regula 6: lista a ce se intampla ramane; se adauga ca nivelul se termina doar dupa George.
- Regula 9: "6 niveluri + lupta finala" ramane; se adauga ca pe fiecare nivel George vine de doua ori.
- Tabelul "Unde gasesti lucrurile": rand nou pentru `CONFIG.lupta.george` si `keepEnough`.

---

## G11. Ce nu se poate verifica fara copii

- Daca saltul de la 2 inamici (nivelul 1) la 4 (nivelul 2) e prea mare pentru cel de 6 ani.
- Daca legatura "cat strangem, atat de repede vine George" se intelege fara sa i-o spuna cineva.
- Daca padurea care mai da diamante se simte generoasa sau se simte ca un joc care nu te lasa sa gresesti.
- Daca, fara maxim, cel de 8 ani chiar aduna tot si cel de 6 ani se plictiseste culegand resturi. Asta e riscul cel mai mare al lui T15 si se vede doar la joaca.
