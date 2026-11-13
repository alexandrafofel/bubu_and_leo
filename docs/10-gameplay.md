# 10. Gameplay (`src/07-play.js`)

Aici sunt regulile: cum merg eroii, ce fac puterile, cum se iau ouale, cum se misca inamicii, vantul, fluturele si boss-ul.

## `Game`

| Camp | Ce este |
|---|---|
| `state` | Ecranul curent (vezi `02-arhitectura.md`). |
| `t` | Timpul total de la pornire. Folosit pentru animatiile ecranelor. |
| `levelIdx` | Nivelul curent. 0 pana la 5, iar 6 este boss-ul. |
| `team` | `{ eggs, stars }`: scorul echipei pe tot jocul. |
| `results` | Pentru fiecare nivel terminat: `{ eggs, stars, med }`. |
| `diff` | Dificultatea fiecarui erou: `'easy'`, `'normal'` sau `'hard'`. |
| `paused` | Meniul de pauza e deschis. |

Functii ajutatoare:

- `D(k)`: setarile de dificultate ale eroului `k` (din `CONFIG.difficulty`).
- `rank(k)`: 0 pentru Ușor, 1 pentru Normal, 2 pentru Greu. Folosit pentru tabele de forma `[usor, normal, greu][rank(k)]`.

## Pornirea unui nivel

`buildLevel(idx)` incearca pana la 80 de samante (`1000 + idx * 97 + a * 13`). Prima care trece verificarea e pictata si intoarsa. Daca toate esueaza (nu s-a intamplat in teste), apare eroarea "Nivelul nu a putut fi construit". Dupa ultimul nivel intoarce arena boss-ului.

`startPlay(L)` creeaza `P`, starea nivelului:

| Camp din `P` | Ce este |
|---|---|
| `L` | Nivelul generat. |
| `heroes` | Cei doi eroi (vezi mai jos). |
| `ball` | Mingea lui Leo: `state` este `held`, `fly` sau `return`. |
| `eggs` | Ouale de pe harta acum. |
| `stars` | Stelele nivelului. |
| `parts`, `rings` | Particule si cercurile tropaitului. |
| `wave`, `waveNeed`, `waveGot`, `nextWaveT` | Valul curent, cate oua are, cate s-au luat, cand vine urmatorul. |
| `duel` | Mini-lupta (vezi `11-mini-lupte.md`). |
| `nestOpen`, `nestT`, `nestOpenT` | Cuibul s-a deschis, de cat timp sta cineva langa el, de cand e deschis. |
| `done`, `doneT` | Nivelul e terminat, timpul de sarbatoare. |
| `time`, `sinceEgg` | Timpul in nivel, timpul de la ultimul ou. |
| `levelEggs`, `levelStars`, `hits` | Scorul nivelului si de cate ori au fost loviti eroii (pentru medalii). |
| `combo`, `comboT` | Seria de oua luate repede (nota sunetului urca). |
| `cam` | Camera: `x`, `y`, `zoom`. |
| `shake` | Tremurul ecranului. |
| `wind` | Vantul: `state` (`calm`, `warn`, `blow`), `dir`, `power`. |
| `bfly`, `bflyT` | Fluturele si timpul pana la urmatorul. |
| `crow` | Ciori care trece pe cer la un val nou. |
| `banner` | Bannerul de sus: `kind` si timpul ramas. |
| `boss` | Starea boss-ului (doar la nivelul final). |
| `tut` | Pentru fiecare erou: cat a mers si daca a folosit puterea (pentru iconitele de inceput). |

## Eroul

`makeHero(k, x, y)` face un obiect cu: pozitia, viteza, directia privirii (`face`), directia tintita (`ax`, `ay`), faza pasului (`walk`), timpii de ameteala (`dizzy`), invulnerabilitate (`inv`), viteza de la fluture (`boost`), pauza intre tropaituri (`cd`), saritura (`z`, `stompT`), incarcarea sutului (`charge`, `charging`), `safe` (e in adapost), `tagT` (cat se mai vede numele deasupra).

### `updateHero(h, dt)`, pe scurt

1. Scad toti timpii.
2. Daca nimeni nu joaca eroul (`!joined`), el merge singur dupa prieten, la 85 de unitati in spatele lui. La boss face singur treaba lui: Bubu tropaie langa copac, Leo suteaza cand Ciori e jos. Asa un copil poate juca singur.
3. Calculeaza `safe`: in timpul unei mini-lupte, mai aproape de cuib decat `CONFIG.duel.safeRadius`.
4. Viteza: `speed` x 0.45 in noroi, x 1.5 cu fluture, x 0.2 ametit, x 0.65 cat incarca sutul, x 0.35 in timpul tropaitului.
5. Accelereaza lin spre directia dorita (12 pe secunda: aproape imediat, dar fara smucituri). Un stick putin inclinat inca da 45% din viteza (`0.45 + 0.55 * m`).
6. Vantul il impinge (nu si cand e in adapost).
7. Coliziuni (`collide`).
8. Pasii: un sunet de fiecare data cand faza pasului trece de un multiplu de PI (adica un picior atinge pamantul). In noroi, un "squelch" la 0.3 s si stropi.
9. Puterea.

### Coliziunile: `collide(L, e, r, isBall)`

Impinge un obiect de raza `r` afara din celulele blocate si din obstacolele rotunde (`L.solids`). Pentru minge, doar peretii (tip 3) si obstacolele (in afara celor `noBall`) conteaza: mingea zboara peste apa si noroi. Intoarce normala ciocnirii, folosita de minge ca sa sara.

## Puterile

### Tropaitul lui Bubu

La ✕ (daca nu e in pauza de 0.7 s si nu e ametit): Bubu sare 0.2 s (`z` pana la 30) si aterizeaza. La aterizare, `doStomp(h)`:

- cerc portocaliu care se largeste pana la `stompRadius` (280), praf, petale, tremur de ecran, vibratie;
- gandacii si conurile din raza sunt ametiti `stunTime` (2.8 s, x 1.3 pe Ușor);
- ouale din `pullRadius` (360) zboara spre Bubu si ajung pana la el;
- copacii din raza se scutura: un copac care sclipeste scoate ouale;
- in mini-lupta: `duelStomp(h)`;
- la boss: langa copac, il scutura. Dupa destule tropaituri (`CONFIG.boss.shakes`), Ciori cade.

### Sutul lui Leo

- Apasare: incepe incarcarea. Un cerc albastru deasupra lui Leo se umple, sageata de tintire creste si trece de la galben la portocaliu.
- Eliberare (sau dupa 1.2 s tinut la maxim): `kickBall(h, putere, ax, ay)`. Sub 0.22 conteaza ca sut scurt.
- Pe Ușor, `aimAssist` indreapta mingea spre cea mai buna tinta aflata la cel mult aproximativ 37 de grade de directia tintita, la 50 pana la 640 de unitati.
- Mingea: viteza intre 760 si 1400, sare de pereti si obstacole (pierde 10% la fiecare saritura), incetineste usor, se intoarce singura dupa `ballLife` sau cand e prea lenta. A doua apasare pe ✕ cat zboara o cheama inapoi.
- Ce face mingea in zbor (`updateBall`): impinge gandacii si ii ameteste, sparge conurile, ia ouale si stelele atinse, scutura copacii (un sut peste 0.55 scoate steaua ascunsa), loveste paznicul sau intra in cuibul lui Ciori.

Mingea se misca in pasi mici (maximum 11 unitati pe pas) ca sa nu treaca prin pereti la viteza mare.

## Ouale

`makeEgg(x, y, o)`: `state` este `fall` (cade din cer la un val nou), `pop` (sare dintr-un copac, din erou sau din paznic), sau `idle` (pe jos). `req` = oul face parte din val (trebuie luat ca sa vina valul urmator). `wait` = cat timp nu poate fi luat (un ou scapat nu poate fi prins inapoi imediat).

`updateEggs(dt)`: un ou e luat cand un erou neametit e mai aproape decat `pickupRadius`. Dupa `levelDuration`, raza creste x 1.5, ca nivelul sa se termine chiar daca copiii obosesc.

`collectEgg(e, k)`: adauga la scor, sunet (nota urca cu seria), "iu-huu" la a 5-a in serie, particule, vibratie mica. Apoi `checkWave()`.

`checkWave()`: cand nu mai e niciun ou de val si niciun copac care sclipeste:

- daca mai sunt valuri: urmatorul vine dupa 1 s;
- daca a fost ultimul: incepe mini-lupta (`startDuel`);
- dupa mini-lupta: `openNest()`.

## Cand un erou e lovit: `hitHero(h, sx, sy)`

Nu se intampla daca eroul e deja ametit, invulnerabil, in adapost sau daca nimeni nu il joaca. Altfel:

- ameteste `dizzyTime` si e invulnerabil inca 1.6 s dupa aceea (clipeste);
- e impins putin in spate;
- "bonk", "au-uu", vibratie, stele deasupra;
- daca echipa are oua, scapa unul. Oul sare intr-o celula atinsa la 80 pana la 200 de unitati si poate fi luat dupa 0.9 s.

Nu exista viata, nu exista "Game Over". Cererea a fost clara.

## Inamicii: `updateEnemies(dt)`

### Gandacii

```
sleep ──(un erou treaz trece aproape)──> wake (0.6 s, "!") ──> chase (pana la 5 s)
  ^                                                              │
  └───── return <──(timpul a trecut, eroul e departe sau ametit)──┘
stun (tropait) ──> return       knock (minge) ──> stun 3 s ──> return
```

- Se trezesc la `beetleWakeRadius` x `wakeRadius` al celui mai apropiat erou.
- Urmaresc cel mult 440 de unitati de acasa si renunta daca eroul e la peste 560.
- Dupa ce lovesc pe cineva, se intorc si nu se mai trezesc 3 s.
- `enemyMul(x, y)`: viteza depinde de dificultatea celui mai bland jucator din jur (raza 460).

### Conurile

Se rostogolesc de sus in jos pe culoar. La capat dispar 1.4 s si pornesc din nou de sus, aparand treptat. Un erou atins e lovit si conul se sparge. Tropaitul le opreste 2.8 s, mingea le sparge.

## Vantul

Doar pe nivelurile cu `wind`: `calm` 9 s (variaza), `warn` 1 s (sunet si cateva frunze), `blow` 2.6 s. Puterea urca lin. Impinge eroii (x `wind` din dificultate) si mingea. Pe ecran: frunze care zboara si dungi crem. Morile se invart mai repede.

## Fluturele

Apare la 40 pana la 70 de secunde, pe marginea ecranului, si zboara in jurul eroilor. Cine il atinge da ambilor viteza x 1.5 pentru 6 s. Pleaca dupa 18 s daca nu e prins.

La nivelul 5, primul fluture zboara spre cascada si sta acolo pana la 40 s. Este un indiciu pentru pestera, fara cuvinte.

## Cuibul si finalul nivelului

Dupa mini-lupta, cuibul se deschide: banner "La cuib!", lumina aurie. Nivelul se termina cand:

- ambii eroi sunt langa cuib (sub 185 de unitati), sau
- unul singur, daca celalalt nu e jucat, sau daca a asteptat 7 s.

Dar numai daca nu mai sunt oua pe jos sau au trecut 14 s de la deschidere. Asa ouale scoase din paznic au timp sa fie adunate.

La final: sunete de victorie, petale, dupa 2.6 s ecranul "Bravo!".

## Pestera si cascada

Cand un erou e in spatele cascadei, bucata de faleza din fata pesterii devine transparenta treptat (`cave.reveal`). Oul urias se vede doar atunci. Din cand in cand sclipesc stelute la cascada, ca indiciu. Cascada e desenata peste eroi, deci par ca trec prin spatele ei.

## Felinarele

Pe nivelul 6, un felinar se aprinde (cu un clopotel) cand un erou trece la sub 200 de unitati de el.

## Boss-ul: `updateBoss(dt)`, `bossBall(b)`

```
up ──(destule tropaituri langa copac)──> falling (0.8 s) ──> down (7 s) ──> rising (1.1 s) ──> up
                                                              │
                                                    minge in cuib
                                                              v
                                       phase + 1 ── daca phase = 3 ──> won
```

- `up`: Ciori sta in cuib si arunca conuri spre eroi la `throwEvery` secunde. Conurile tintesc unde va fi eroul (pozitia + viteza x 0.5). Pe pamant apare un cerc rosu unde vor cadea.
- Mingea in cuib cat e `up`: Ciori o respinge cu aripa (ricoseaza).
- `down`: Ciori ametit langa copac. Cuibul are un cerc galben-albastru. Mingea in cuib = gol: tremur, vibratie, 8 oua sar din cuib.
- Dupa 3 goluri: muzica de final, Ciori zboara in fata, spune "Îmi pare rău!" (cu voce si pe un card). Dupa 3.5 s ✕ trece la festival (sau singur dupa 9 s).

Ouale din cuibul lui Ciori: 9 la inceput, 3 dispar la fiecare gol.

## Camera

Urmareste mijlocul dintre eroi (putin mai sus). Zoom-ul se potriveste ca amandoi sa incapa, intre 1 si `minZoom` (0.6). Miscarea e lina (x 4 pe secunda pentru pozitie, x 2.5 pentru zoom). Nu iese din harta.

## Particule

`part(x, y, o)` adauga o particula, `burst(x, y, n, o)` mai multe. Tipuri: `spark` (steluta), `dust` (praf), `petal`, `leaf`, `dot`. Cel mult 520 odata (cele vechi dispar). `PETALS` si `LEAVES` sunt culorile lor.
