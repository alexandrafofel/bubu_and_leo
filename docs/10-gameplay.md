# 10. Gameplay (`src/07-play.js`)

> **Din 18 noiembrie 2026 exista un singur joc: "Cea mai grea luptă".** "Bubu și Leo" a fost scos (vezi `16-decizii.md`, "Un singur joc"). Orice schimbare se face doar in "Cea mai grea luptă". Ce scrie mai jos despre primul joc, despre alegerea jocului sau despre "ambele jocuri" este istoric.

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
3. Calculeaza `safe`: eroul e in cuib daca e mai aproape de centrul cuibului decat `CONFIG.nestSafeRadius` (150). Asta e valabil pe tot nivelul (vezi `CONFIG.nestSafe`). Detaliile sunt in `11-mini-lupte.md`, la "Adapostul".
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
- **Un sut trimite mai multe mingi, in cerc.** Numarul: `ballsPerKick` (8) la sut scurt, `ballsPerKickMax` (12) la sut incarcat, intre ele in functie de putere. Mingile pleaca la unghiuri egale (`i / n * TAU`), iar prima merge spre directia stick-ului. Puterea merge in toate directiile.
- Fiecare minge are propria viata: `newBall(...)` o face, iar `stepFlyBall(b, dt, h)` o misca si o intoarce. Ea se intoarce la Leo si dispare cand ajunge la el (`m < 40`).
- Viteza intre 760 si 1400 (x `ballSpeed` pe Ușor), sare de pereti si obstacole (pierde 10% la fiecare saritura), incetineste usor, se intoarce singura dupa `ballLife` sau cand e prea lenta. Pe Ușor mingea e mai mare (x `ballSize` 1.3).
- **Cooldown si chemare.** Dupa un sut, `P.ballCool` = 1.2 s (`kickCooldown`). Cat timp mingile zboara si cooldown-ul merge, o apasare ✕ le cheama pe toate inapoi (`recallBalls()`). Dupa cooldown, o apasare trage un sut nou; mingile vechi zboara mai departe. Cand toate sunt acasa, `P.ball.state` devine `held` si Leo poate incarca iar.
- `P.ball` este mingea de acasa (cea care sta la picioarele lui Leo). `P.flock` este lista mingilor din aer.
- Ajutorul la tintire (`aimAssist`) a fost scos, impreuna cu valoarea lui din `difficulty`.
- Ce face fiecare minge in zbor (`stepFlyBall`): impinge gandacii si ii ameteste, sparge conurile, ia ouale si stelele atinse, scutura copacii (un sut peste 0.55 scoate steaua ascunsa), loveste paznicul sau intra in cuibul lui Ciori.
- Un ricoseu pe perete face sunetul `bounce` cel mult o data la 0.33 s, pentru toate mingile la un loc.

Fiecare minge se misca in pasi mici (maximum 11 unitati pe pas) ca sa nu treaca prin pereti la viteza mare.

## Ouale

`makeEgg(x, y, o)`: `state` este `fall` (cade din cer la un val nou), `pop` (sare dintr-un copac, din erou sau din paznic), sau `idle` (pe jos). `req` = oul face parte din val (trebuie luat ca sa vina valul urmator). `wait` = cat timp nu poate fi luat (un ou scapat nu poate fi prins inapoi imediat).

`updateEggs(dt)`: un ou e luat cand un erou neametit e mai aproape decat `pickupRadius`. Dupa `levelDuration`, raza creste x 1.5, ca nivelul sa se termine chiar daca copiii obosesc.

`collectEgg(e, k)`: adauga la scor, sunet (nota urca cu seria), "iu-huu" la a 5-a in serie, particule, vibratie mica. Apoi `checkWave()`.

**Cota (T14.2, 22 noiembrie 2026).** Un ou are campul `goal`: `true` pentru oul din val sau din copac si pentru oul scapat de un erou lovit; `false` pentru oul urias, oul din paznic si bonusul curcubeului. `makeEgg` il pune egal cu `req`, daca nu e dat. In `startPlay`: `P.q` (cota nivelului, `L.q`), `P.cap` (`ceil(CONFIG.quota.cap * q)`), `P.found[k]` (cate oua ale cotei are eroul `k`). Functii: `quotaOn()` (cota e pornita, nivelul are cota si nu e lupta mare), `quotaOk(k)`, `canTake(e, k)` (cu un singur jucator nu exista limita), `quotaState(k)` (`{ found, q, cap, ok }`), `capHint(k, e)`.

- `collectEgg` nu ia un ou `goal` daca eroul e plin (`P.found[k] >= P.cap` cu amandoi in joc): oul ramane pe jos, eroul spune "Plin!" (un balon, cel mult o data la 1.2 s, cu sunetul `no`) si oul face un salt mic. Cand il ia, `P.found[k]++`.
- `updateEggs`: daca primul erou din apropiere e plin, oul se da celuilalt. Tropaitul (`e.pull`) se opreste daca eroul tras e plin. Mingea lui Leo sau Killer ocoleste oul.
- Cand eroul e lovit, scapa un ou al lui (`P.found[k]--`, oul nou are `goal: true`). Daca nu are niciunul, nu scapa nimic si ouale prietenului nu se ating. In lupta mare ramane regula veche (ce s-a adunat in lupta).
- **L1: `giveEgg(k)` (T14.4).** Se cheama din `updateHero` la `gP`, sau tinut apasat la fiecare `CONFIG.quota.giveEvery`. Verificari, in ordine: prietenul joaca; eroul nu e `down`, ametit sau purtat; `P.found[k] >= 1` (altfel sunetul `no`); prietenul are loc sub `cap`, numarand si ouale in zbor (`flying(to)`; altfel "Plin!" deasupra lui); distanta <= `giveRange` (altfel `h.farT` si balonul "Apropie-te de {0}!"). Daca da: `P.found[k]--` si oul intra in `P.gifts`. `updateGifts(dt)` il duce in arc 0.45 s spre prieten (urmareste prietenul daca el se misca) si la sosire `P.found[to]++`, sunetul `egg`, vibratie, "multumesc". Oul ajunge chiar daca cel care l-a dat e lovit pe drum. Sunetul `give` (doua note de marimba) e in `CHR`, deci merge in difuzorul controllerului.
- **Sfarsitul nivelului (T14.5).** In `updatePlay`: `quotaMet = !quotaOn() || (quotaOk(0) && quotaOk(1))`, iar nivelul se termina doar cu `ready && quotaMet && (amandoi in cuib sau unul singur cand joaca singur)`. Cu un singur jucator `quotaOk` a celuilalt e adevarat (nu joaca). Cat timp amandoi sunt in cuib si cota lipseste, `P.needT` creste (il citeste ajutorul automat, T14.6) si banda de sus arata `quota.need` ("{0} mai are nevoie de {1}!"). Cuibul ramane deschis, ouale de pe jos se pot lua.
- **Ajutorul automat: `updateAutoGive(dt)` (T14.6).** Cat timp amandoi sunt in cuib si cota unuia lipseste, `P.needT` creste. Dupa `CONFIG.quota.autoGive` secunde (120, iar 0 opreste ajutorul) jocul muta singur, din `autoEvery` in `autoEvery` secunde (2), cate un ou de la cel care are **peste** cota lui la cel care lipseste, cu acelasi zbor ca la L1. Bannerul `quota.auto` ("{0} îți trimite un ou."). Nu se ia niciodata din ce are nevoie cel care da, deci nimeni nu pierde cota pe care si-a gasit-o. Niciun copil nu poate rama blocat in fata unui nivel pe care nu-l poate termina (regula 6 din `CLAUDE.md`).
- **Al doilea jucator intra in mijlocul nivelului: `updateJoinQuota()` (C14).** `P.wasJoined` tine minte cine juca. Cand cineva intra, ce are prietenul peste `cap` zboara la el, pana la limita lui. Acelasi lucru se intampla cand un controller se deconecteaza si revine: cota celui plecat se socoteste indeplinita (`quotaOk` cere `isJoined`), `P.found` al lui nu se pierde, iar la revenire surplusul se muta.
- **`sendEgg(from, to, auto)`** e locul prin care trece orice ou mutat intre eroi: scade la unul, il pune in `P.gifts`, sunetul `give`, vibratie. `giveEgg` (L1) si ajutorul automat il folosesc amandoua.
- Reincepere dupa cele 10 secunde: `P` se reface, deci `P.found` revine la 0. Oul uriaș, luptele mari si bonusul curcubeului nu intra in cota si nu s-au schimbat.
- Nu e facut inca: insigna cu numaratoare (T14.7), bannerele "Ai gasit toate" (T14.8).

`checkWave()`: cand nu mai e niciun ou de val si niciun copac care sclipeste:

- daca mai sunt valuri: urmatorul vine dupa 1 s;
- daca a fost ultimul: incepe mini-lupta (`startDuel`);
- dupa mini-lupta: `openNest()`.

## Cand un erou e lovit: `hitHero(h, sx, sy)`

Nu se intampla daca eroul e deja ametit, invulnerabil, in adapost, daca asteapta deja ajutor sau daca nimeni nu il joaca. Altfel:

- daca prietenul lui e jucat de cineva: ramane pe loc (`h.down`) pana e ajutat cu □. Vezi "Ajutorul" la sfarsitul capitolului;
- daca joaca singur: ameteste `dizzyTime` si e invulnerabil inca 1.6 s dupa aceea (clipeste), ca inainte;
- e impins putin in spate;
- "bonk", "au-uu", vibratie, stele deasupra;
- daca eroul are oua din cota lui (`P.found`), scapa unul (in lupta mare: daca echipa are oua adunate acolo). Fara oua proprii nu scapa nimic. Oul sare intr-o celula atinsa la 80 pana la 200 de unitati si poate fi luat dupa 0.9 s.

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

Se rostogolesc de sus in jos pe culoar. La capat dispar 1.4 s si pornesc din nou de sus, aparand treptat. Un erou atins e lovit si conul se sparge. Tropaitul le opreste 2.8 s. Prima lovitura (tropait sau sut) il opreste, a doua il face sa dispara: vezi "Inamicii mici" la sfarsitul capitolului.

## Vantul

Doar pe nivelurile cu `wind`: `calm` 9 s (variaza), `warn` 1 s (sunet si cateva frunze), `blow` 2.6 s. Puterea urca lin. Impinge eroii (x `wind` din dificultate) si mingea. Pe ecran: frunze care zboara si dungi crem. Morile se invart mai repede.

## Fluturele

Apare la 40 pana la 70 de secunde, pe marginea ecranului, si zboara in jurul eroilor. Cine il atinge da ambilor viteza x 1.5 pentru 6 s. Pleaca dupa 18 s daca nu e prins.

La nivelul 5, primul fluture zboara spre cascada si sta acolo pana la 40 s. Este un indiciu pentru pestera, fara cuvinte.

## Cuibul si finalul nivelului

Dupa mini-lupta, cuibul se deschide: banner "La cuib!", lumina aurie. Nivelul se termina cand:

- ambii eroi sunt langa cuib (sub 185 de unitati), sau
- unul singur, doar daca celalalt nu e jucat de nimeni.

Regula "unul singur dupa 7 s" a fost scoasa pe 14 noiembrie 2026: se asteapta amandoi. Cat lipseste unul, deasupra cuibului scrie `ban.wait` cu numele lui. Un erou care asteapta ajutor departe de cuib tine nivelul deschis pana e ajutat si ajunge.

Dar numai daca nu mai sunt oua pe jos sau au trecut 14 s de la deschidere. Asa ouale scoase din paznic au timp sa fie adunate.

La final: sunete de victorie, petale, dupa 2.6 s ecranul "Bravo!".

## Pestera si cascada

Cand un erou e in spatele cascadei, bucata de faleza din fata pesterii devine transparenta treptat (`cave.reveal`). Oul urias se vede doar atunci. Din cand in cand sclipesc stelute la cascada, ca indiciu. Cascada e desenata peste eroi, deci par ca trec prin spatele ei.

## Felinarele

Pe nivelul 6, un felinar se aprinde (cu un clopotel) cand un erou trece la sub 200 de unitati de el.

## Boss-ul: `updateBoss(dt)`, `bossBall(b)`

```
up ──(destule tropaituri langa copac)──> falling (0.8 s) ──> down (5 s) ──> rising (1.1 s) ──> up
                                                              │
                                                    minge in cuib
                                                              v
                                       phase + 1 ── daca phase = 3 ──> won
```

- `up`: Ciori sta in cuib si arunca conuri spre eroi la `throwEvery` secunde (update 13 noiembrie: `[3, 2.5, 2.1, 1.8, 1.6]`). Cate un con in prima runda, doua din runda a doua, si inca unul in ultimele doua runde (`1 + min(1, faza) + (faza >= hits - 2 ? 1 : 0)`). Conurile tintesc unde va fi eroul (pozitia + viteza x 0.5). Pe pamant apare un cerc rosu unde vor cadea.
- Mingea in cuib cat e `up`: Ciori o respinge cu aripa (ricoseaza).
- `down`: Ciori ametit langa copac. Cuibul are un cerc galben-albastru. Mingea in cuib = gol: tremur, vibratie, 8 oua sar din cuib.
- Dupa 3 goluri: muzica de final, Ciori zboara in fata, spune "Îmi pare rău!" (cu voce si pe un card). Dupa 3.5 s ✕ trece la festival (sau singur dupa 9 s).

Ouale din cuibul lui Ciori: 9 la inceput, 3 dispar la fiecare gol.

## Camera

Regula sta in `camTarget(L, a, b)`, o functie fara efecte care intoarce `{ x, y, zoom }` pentru doi eroi. `updatePlay` o cheama si merge lin spre rezultat (x 4 pe secunda pentru pozitie, x 2.5 pentru zoom). E functie separata ca sa o poata chema si testul `hud-acoperire.js`: asa testul masoara exact regula jocului, nu o copie a ei. E si in `window.__game`.

Ce face, pe rand:

1. **Zoom**: amandoi eroii trebuie sa incapa, pe orizontala in 1920 cu o margine de 760, pe verticala in **1080 minus banda de sus** cu o margine de 560. Intre `minZoom` (0.6) si 1.
2. **Stanga - dreapta**: mijlocul dintre eroi, fara sa iasa din harta.
3. **Sus - jos**: mijlocul dintre eroi, coborat cu 30 si cu inca o jumatate de banda, ca eroii sa stea in mijlocul partii libere a ecranului. Apoi doua limite:
   - **nimic din eroul de sus nu are voie sa intre sub banda** (`HUD_TOP`, `08-draw.js`), nici numele lui (`HERO_BOX`, 190 de unitati). Pentru asta camera poate privi si mai sus decat marginea de sus a lumii, cu cel mult `HUD_TOP + 20` pixeli de ecran. Fasia fara pictura se umple cu culoarea cerului (vezi `12-desen-si-hud.md`).
   - **cand incape, eroul de jos ramane cu picioarele pe ecran**. Daca cele doua limite nu pot fi respectate amandoua (eroi la cele doua capete ale unei harti inalte, cu zoom-ul deja la minim), castiga banda: vezi `19-limitari.md`.

La lupta mare nu se schimba nimic: harta e cat ecranul, `minZoom` e 1 si eroii nu pot urca peste y = 480.

## Particule

`part(x, y, o)` adauga o particula, `burst(x, y, n, o)` mai multe. Tipuri: `spark` (steluta), `dust` (praf), `petal`, `leaf`, `dot`. Cel mult 520 odata (cele vechi dispar). `PETALS` si `LEAVES` sunt culorile lor.

## Update 14 noiembrie 2026

### Ajutorul: `hitHero`, `tryRescue`, `getUp`, `updateRescue`

Starea eroului lovit:

| Camp | Ce este |
|---|---|
| `h.down` | Adevarat cat asteapta ajutor. Nu merge, nu foloseste puterea, nu aduna, nu poate fi lovit. |
| `h.downT` | De cate secunde asteapta. |
| `h.callT` | Pana la urmatorul strigat `help`. |
| `h.reachHint` | Timp in care se arata cercul "vino mai aproape" dupa un □ apasat de prea departe. |

Pasii:

1. `hitHero(h, sx, sy)`: oul scapat, impingerea, sunetele sunt ca inainte. Daca regula e pornita si prietenul e jucat, `h.down = true`. In mini-lupta creste `P.duel.downs` (pentru mila).
2. `updateRescue(dt)`, in fiecare cadru: numara timpul, striga dupa ajutor, misca mingile magice (`P.heal`), si ridica eroii singuri in cazurile de siguranta: amandoi jos de `bothDown` secunde, prieten plecat din joc, `autoAfter` trecut.
3. `tryRescue(h)`: chemat cand eroul `h` apasa □ (`bP`) si prietenul e jos. Verifica distanta: `reachNear` pentru eroul 0, `reachFar` pentru eroul 1. Prea departe: `notYet` si cercul de indiciu. Destul de aproape: eroul 0 il ridica pe loc (`getUp`), eroul 1 trimite o minge in `P.heal` (cu sunetul de sut), care il ridica atunci cand ajunge.
4. `getUp(h, by)`: `h.down = false`, `h.inv = safeAfter`, inimioare, sunetul `heal`, `thanks`, vibratie pe ambele controllere. `P.rescues` numara ajutoarele (apare la finalul nivelului doar in teste).

Un erou nejucat (care merge singur dupa prieten) nu poate fi lovit, deci nu ajunge niciodata sa astepte.

In al doilea joc `h.small` scade marimea desenata la `CONFIG.lupta.shrink` cat eroul e jos si creste lin la loc dupa ajutor.

### Inamicii mici: `hurtSmall(e)`

Gandacii (`P.beetles`), conurile (`P.cones`) si, in al doilea joc, robotii, melcii si pasarile au `e.hp`, pornit de la `smallEnemy.hits`.

- `hurtSmall(e)` scade o inima si intoarce `true` daca a fost ultima. Daca mai are, inamicul ameteste ca inainte si arata doua inimioare deasupra (`drawSmallHp`).
- La zero: norisor, sunetul `poof`, starea devine `dead` (gandac) sau `gone` (con, pasare), cu `e.t = smallEnemy.respawn`. Nu mai e desenat, nu mai loveste.
- `updateEnemies` numara `e.t` in jos. La zero inamicul reapare, cu `hp` plin. Un gandac asteapta pana cand niciun erou nu e la mai putin de 380 de unitati de casa lui. Un con porneste din capul cararii.
- O lovitura = un sut sau un tropait, nu o minge. Fiecare sut are un numar (`b.kick`), tinut minte pe inamic in `e.kickHit`: cele 8 mingi ale aceluiasi sut scad o singura inima. La fel, `powerSweep(h, id)` atinge fiecare inamic o data pe tropait (sau pe rotire a ghearelor).

### Cuibul asteapta pe amandoi

Vezi sectiunea "Cuibul si finalul nivelului" de mai sus, schimbata.

### Boss-ul

Cat un erou asteapta ajutor, `bs.throwT` nu mai scade: Ciori (sau George) nu arunca nimic nou. Ce e deja in aer cade.

## Update 18 noiembrie 2026 (T2): fuga

Cererea: "Stick-ul Stâng (L3) (...) poate fi apăsat ca un buton (L3) - cand il apasa sa mearga mult mai repede (x3)".

### Pornire si oprire: `updateRun(h, s, ix, iy, dt)`, `canRun(h)`, `startRun(h)`, `stopRun(h)`

- O apasare de L3 cu stick-ul inclinat peste 0.5 porneste fuga (`h.run`).
- Fuga tine cat stick-ul e inclinat. Se opreste cand stick-ul sta in centru `CONFIG.sprint.stopAfter` (0.25 s), la o a doua apasare de L3, cand eroul e lovit, ametit, dus de o pasare, cand incarca o aruncare sau cand nivelul e terminat (toate intr-un singur loc, `canRun`).
- Cu `mode: 'hold'` fuga tine doar cat L3 e apasat.
- Un erou pe care nu-l joaca nimeni (merge dupa prieten) fuge cand prietenul fuge si e la mai mult de 300 de unitati.
- Cu `max` diferit de 0, dupa atatea secunde eroul oboseste si se odihneste `rest` secunde.

### Viteza

`sp = min(sp * CONFIG.sprint.mult, CONFIG.sprint.maxSpeed)`, dupa toti ceilalti inmultitori. Deci:

- Pe teren lent inmultirea ramane: in noroi 330 x 0.32 x 3 = 317.
- Cu racheta (x 1.5) si fuga, viteza se opreste la 1100: cele doua nu se aduna peste limita.
- In timpul rotirii ghearelor fuga merge, cu inmultitorul de acum (0.8).

### Miscarea in pasi mici

La 1100 de unitati pe secunda si un cadru de 0.05 s, eroul ar sari 55 de unitati odata, mai mult decat o celula (40). De aceea eroul se misca acum **in pasi**, ca mingile:

```js
const v0 = Math.hypot(h.vx, h.vy), n = Math.max(1, Math.ceil(v0 * dt / CONFIG.sprint.step)), sdt = dt / n;
for (let i = 0; i < n; i++) { h.px = h.x; h.py = h.y; h.x += h.vx * sdt; h.y += h.vy * sdt; /* vant */ collide(L, h, HERO_R, false); }
```

Vantul se aduna in acelasi pas. La mers obisnuit (350 x 0.016 = 5.6 unitati) ramane un singur pas, deci nimic nu se schimba pentru restul jocului. Testul `tests/fuga.js` verifica regula cu un perete de o singura celula si cu viteza urcata la 2400: fara pasii mici eroul trece prin el.

### Camera

Cat timp macar un erou fuge, camera merge mai repede spre tinta: x 9 pe secunda pentru pozitie (in loc de x 4) si x 5 pentru zoom (in loc de x 2.5). Altfel eroul ajunge la marginea ecranului inaintea camerei.

### Cum arata si cum suna

| Ce | Cum |
|---|---|
| Corpul | Aplecat inainte cu 0.14 radiani, in jurul picioarelor. |
| Urma | Trei copii ale eroului in spate, cu 0.28, 0.18 si 0.09 transparenta, la 0.04 s una de alta (`h.ghosts`, `drawRunTrail`). Din T6.5 fiecare copie e pictata o singura data, cand apare, intr-un canvas mic al ei (`ghostCanvas`, 4 pe erou, refolosite), si apoi doar pusa cu `drawImage`: 3 `drawImage` pe erou, cum cere S7.7. |
| Praf | Un norisor la fiecare pas, in culoarea pamantului nivelului. |
| Linii de viteza | Sase linii subtiri in spatele eroului, lungi de 60 - 120. |
| Pornire | Sunetul `dash` (un "fiu" scurt care urca), cuvantul `run` al eroului (cel mult o data la 6 secunde), vibratie `rumble(k, 0, 0.35, 70)`. |
| Pasi | Sunetul `step` de acum, la ritmul nou, la 0.8 din volum. |

### Tutorialul

Prima data cand eroii se despart la mai mult de 900 de unitati pe un nivel, deasupra fiecarui erou care nu a fugit inca apare `iconL3` timp de 4 secunde (`P.runHint`, `P.runHintDone`, `P.tut[k].ran`).

## Update 19 noiembrie 2026 (T3): doua puteri pentru fiecare erou

Cererea: "Killer sa isi alungeasca si el mainile si sa aiba puterea lui Boon (alta culoare, alte detalii...) iar Boon sa primeasca puterea lui Killer, dar sa arunce cu altceva - ceva specific dinozaurilor".

### Puterile sunt acum doua abilitati

Codul nu mai stie "eroul 0 se roteste, eroul 1 arunca". Stie doua abilitati, iar fiecare erou spune in `CONFIG` ce are pe fiecare buton:

| | `power` (✕) | `power2` (□) |
|---|---|---|
| Boon | `spin`: ghearele | `throw`: oasele-bumerang |
| Killer | `throw`: mingile | `spin`: manusile-vartej |
| Bubu (jocul scos) | `spin`: tropaitul (`time: 0`) | - |
| Leo (jocul scos) | `throw`: mingile | - |

`abil(k, kind)` da numerele unei abilitati pentru un erou: blocul lui (`spin` sau `throw` in `CONFIG`), sau numele vechi de pe erou (`stompRadius`, `kickSpeed`...) daca nu are bloc. `hasAbil(k, kind)` spune daca o are, `abilSlot(k, kind)` pe ce buton (1 sau 2: hotaraste cuvantul si indiciul din tutorial).

| Inainte | Acum |
|---|---|
| `startPower(h)` | `startSpin(h)` |
| `kickBall(h, ...)` | `throwRing(h, ...)` |
| `ballReady()` | `throwReady(h)` |
| `recallBalls()` | `recallBalls(k)`: doar lucrurile eroului `k` |
| `stepFlyBall(b, dt, h)` | `stepFlyBall(b, dt)`: eroul vine din `b.owner` |
| blocul `if (h.k === 0) ... else ...` | `updateSpin(h, dt, apasat)` si `updateThrow(h, dt, apasat, eliberat, tinut)`, chemate pe butonul pe care eroul are abilitatea |
| `P.ball`, `P.ballCool` | `h.home`, `h.homeState`, `h.throwCd` (pe fiecare erou) |
| `P.tut[k].used` | `P.tut[k].used` (prima putere), `P.tut[k].used2` (a doua) |

`P.flock` ramane o singura lista. Fiecare lucru aruncat are `owner` (0 sau 1) si `look` (`'ball'` sau `'bone'`).

### Oasele-bumerang ale lui Boon (□)

Aceleasi reguli ca mingile, cu numerele lui (`CONFIG.lupta.heroes[0].throw`): 8 oase la apasare scurta, 12 la aruncare incarcata, viteza 700 - 1250 (mingile: 760 - 1400), pauza 1.2 s, viata 2.3 - 3.8 s. A doua apasare cheama inapoi doar oasele lui.

Ce e altfel fata de mingi: osul nu sare, pluteste la 14 unitati si se roteste repede; lasa un arc turcoaz (`b.trail`, ultimele 6 pozitii) si urme mici de laba; se intoarce pe o curba (`b.ret`, deviere laterala `sin(u * PI) * 90`); suna `bone` ("fup-fup-fup") la aruncare si `tock` (lemn) la perete; inelul de incarcare e turcoaz; cand e acasa, osul sta pe umarul lui Boon, nu la picioare.

### Manusile-vartej ale lui Killer (□)

Aceleasi reguli ca ghearele, cu numerele lui (`CONFIG.lupta.heroes[1].spin`): raza 220, trage cristalele din 300, tin 0.85 s, pauza 1.6 s (ghearele: 1.25), ameteala 2.8 s. Cat se invart, `h.shield` e adevarat: nimic nu il loveste.

Ce e altfel fata de gheare: amandoua bratele se intind de 2.4 ori, cu manusi rosii de portar (palma alba, stea albastra); inelul are doua manusi care se urmaresc, fiecare cu o panglica (albastra si alba) si un cerc punctat alb pe pamant; se invarte invers; scanteile sunt stelute albe si albastre si, din cand in cand, un hexagon; sunetul e `gloves`; **vibratia e in trei batai** (la 0, 0.28 si 0.56 s), nu continua, cum a cerut proprietara.

### Reguli comune

1. Fiecare putere are pauza ei. Cele doua ale aceluiasi erou nu pornesc deodata: cat se roteste nu poate incepe o aruncare, cat incarca o aruncare nu poate porni rotirea.
2. Lucrurile plecate raman in aer cand eroul incepe sa se roteasca.
3. Un erou jos, ametit sau dus de o pasare nu are nicio putere (`updateHero` se opreste inainte).
4. In mini-lupte si la boss, lovitura conteaza dupa **fel** (rotire sau lucru aruncat), nu dupa cine a dat-o. Acum fiecare erou le poate face pe amandoua, deci lupta lui George e putin mai usoara. E acceptat (`16-decizii.md`).
5. Tutorial: pe nivelul 1 si pe nivelul 7, dupa ce eroul foloseste ✕, deasupra lui apare □ pana cand foloseste a doua putere (cel mult 90 de secunde).

## Update 19 noiembrie 2026 (T4): cele 10 secunde

Cererea: "cand un personaj este lovit - la ambii jucatori le vibreaza controllerul si au 10 secunde sa se ajute, daca nu se ajuta reincep level-ul de la inceput".

### Numaratoarea

Cand un erou ramane jos (prietenul joaca), `hitHero` porneste numaratoarea: `h.downLeft = rescueLimit()`, adica 10 secunde. **Amandoua** controllerele vibreaza in acelasi cadru: cel lovit tare (`0.9, 0.6, 300`), prietenul mai moale (`0.6, 0.5, 300`).

`countDown(h, dt)` scade timpul si, la fiecare secunda intreaga:

- Sunetul `tick` (un toc moale de lemn).
- O vibratie scurta pe **amandoua** controllerele: `(0, 0.35, 60)`.
- In ultimele 3 secunde totul se indeseste: tocul e mai inalt si se aude de doua ori pe secunda, vibratia e mai apasata (`0.4, 0.6, 90`), iar prietenul spune o data `hurry`.

La zero: `Game.failLevel()`. Daca prietenul ajunge la timp (○), `getUp` sterge numaratoarea si inelul se sparge in scantei.

### Ce se vede

| Element | Unde | Cum |
|---|---|---|
| Inelul de 10 margele | in jurul eroului cazut | `drawDownRing`. O margea se stinge la fiecare zecime din timp. Cele aprinse sunt in culoarea prietenului, cele stinse raman desenate in crem, ca sa se vada cate au fost. |
| Cifra | deasupra eroului | 64, sau 84 si corai in ultimele 3 secunde. "Pocneste" (1.25 -> 1 in 0.15 s) la fiecare secunda. |
| `iconO` si bulina prietenului | langa cifra | Ca inainte, mutate la dreapta ca sa faca loc cifrei. |
| Mesajul "Ajută-l pe Boon!" | in banda de sus | Banner nou, `kind: 'down'`, cu `iconO` la dreapta. Trece inaintea oricarui alt banner. Daca prietenul joaca pe tastatura, scrie tasta lui in loc de ○. |
| Marginea ecranului | ultimele 3 secunde | `drawEdgePulse`: o lumina moale dinspre margini, in culoarea eroului cazut, pana la alpha 0.25. Fara rosu inchis, fara negru. |

### Reincepere: starea `retry`

`Game.failLevel()` numara incercarea (`Game.tries[levelIdx]`), trece jocul in starea `retry`, porneste sunetul `retry` (trei note calde care coboara) si o vibratie lunga si moale pe amandoua controllerele.

Ecranul `drawRetry` tine `CONFIG.rescue.retryScreen` (2.2) secunde: nivelul ramane in spate sub un strat crem, iar in mijloc un cartonas de 900 x 470 cu titlul "Încă o dată!", textul "Ajutați-vă repede: aveți 10 secunde." si cei doi eroi tinandu-se de mana, cu inimioare intre ei. Dupa aceea `Game.goLevel(Game.levelIdx)`, cu `UI.skipIntro`: povestea nivelului nu se mai spune a doua oara.

Cuvintele "Game Over", "Ai pierdut" sau "Greșit" nu apar nicaieri.

### Plasa de siguranta

Dupa `CONFIG.rescue.retryMercy` (3) reinceperi ale aceluiasi capitol, limita devine `limitMercy` (15) secunde, iar cartonasul scrie "Acum aveți 15 secunde.". Numarul se reseteaza cand capitolul e terminat.

### Cazurile speciale

| Situatie | Ce se intampla |
|---|---|
| Amandoi jos | Numaratoarea amandurora sare la `bothDown` (3) secunde si nivelul reincepe. Cu `bothDownRestart: false` se ridica singuri, ca inainte. |
| Un singur jucator | Fara numaratoare: eroul se ridica singur, ca inainte. |
| Pauza | `updatePlay` nu mai ruleaza, deci numaratoarea sta pe loc. |
| Prietenul pierde controllerul | Jocul intra in pauza (regula de acum). La deconectare de tot, eroul se ridica singur si numaratoarea se sterge. |
| La boss | La fel: lupta reincepe de la inceput. |
| Ce se pierde | Cristalele si stelele adunate in nivelul acesta. Totalul echipei revine la suma rezultatelor salvate (`startPlay` il reface). Rezultatele nivelurilor dinainte raman. |
| Medalia "Fără nicio lovitură" | Ramane legata de `P.hits`, care porneste de la 0 la fiecare reincepere. |

## Update 22 noiembrie 2026: mesajele cotei (T14.8)

`updateQuotaMsg` (in `updatePlay`) ridica `quotaDone` o data pe erou cand isi termina cota si prietenul inca nu, doar cu doi jucatori; daca amandoi termina odata ridica `quotaBoth`. Textul numeste prietenul si butonul (L1 sau tasta). Testele: `tests/cota.js`.

## Update 22 noiembrie 2026: George vine dupa diamante (T15)

Specificatia si abaterile: `28-t15-george-de-doua-ori.md`.

- **Diamantele** vin doar din inamicii mici invinsi: `hurtSmall`, cand ia ultima inima, cheama `dropGems`, care lasa `enemyDrop` (1) diamant `goal`. Inamicii reapar dupa `CONFIG.smallEnemy.respawn` (22 s), deci padurea mai da cat timp se joaca.
- **Copacii** care stralucesc, scuturati, scot melci (`addSnail`): inamici mici, mai incete decat robotii (70% din viteza), care reapar ca ceilalti.
- **Micul George** urmareste cel mai apropiat erou (pana la `near`, 640) si se opreste langa el. Nu loveste niciodata. Are 3 inimi si lasa un diamant.
- **Fara limita de sus**: un erou poate lua oricate diamante. Ce are peste cota se vede in insigna ca `+n` si se poate da cu L1.
- **Cand vine George** (`updateGeorge`, la fiecare cadru): la jumatatea cotei echipei (`teamNeed()`, 30 cu doi jucatori) lupta din mijloc, dar nu in primele `minT` (20) secunde; la cota intreaga, lupta de la cuib. Valurile doar aprind copacii urmatori.
- **Cuibul** se deschide doar la sfarsitul luptei de la cuib. Nivelul se termina cand George e invins, fiecare are 15 si amandoi sunt in cuib.
- **Un singur jucator**: ce culege eroul care nu joaca se numara la cel care joaca.

## Update 23 noiembrie 2026: inelul din luptele cu George

Fiecare erou sta pe un disc in culoarea lui, cu un inel, o margine crem si una violet (`drawHeroRing`).
In luptele cu George (cea din mijloc, cea de la cuib si arena, `ringFight()`) inelul are 10 bucati.

- Fiecare lovitura, de la George sau de la ce arunca el, face o bucata rosie (`h.ringHits`). Bucatile se inrosesc din fata, de sub picioare, spre spate.
- O astfel de lovitura il impinge putin si il apara `CONFIG.ring.inv` secunde. Nu cade si nu pierde diamante.
- Cand tot inelul e rosu, inelul pulseaza. Urmatoarea lovitura e cea veche: eroul ameteste, scapa un diamant si asteapta prietenul. Merg si cele 10 secunde si "Încă o dată!".
- Cand prietenul il ajuta (`getUp`), inelul e intreg din nou. Un copil care joaca singur se ridica singur si inelul se goleste.
- Fiecare lupta cu George incepe cu inelul intreg (`startDuel`). In afara luptelor, o lovitura il pune jos ca inainte.

Reglaje: `CONFIG.ring` (`on`, `hits`, `inv`, `red`, `push`).

## Update 26 noiembrie 2026: portile benzilor (T7.1)

`updateMechs(dt)` (`065-mech.js`) ruleaza in `updatePlay`, dupa eroi si dupa obiectele aruncate. Pentru fiecare intrare afla daca e apasata (`on`), apoi aplica regula portii:

| Regula | Poarta e deschisa |
|---|---|
| `any` | cat macar o intrare e apasata |
| `all` | cat toate sunt apasate |
| `allWithin` | cand toate au fost atinse la cel mult `window` secunde una de alta |
| `seq` | cand intrarile au fost atinse in ordine; una gresita o ia de la capat (nu pe "Ușor") |

- Cand regula nu mai e adevarata, poarta mai sta deschisa `stay` secunde, apoi se inchide.
- **Cine trece nu poate fi si cel care deschide.** Un erou de pe o trecere (sau de pe pluta, T9) nu apasa nicio intrare. La regula `any`, cele `stay` secunde curg doar cat un erou e pe trecere sau la cel mult `CONFIG.mech.nearGate` (150) de ea. Altfel poarta se inchide indata. Asa nimeni nu poate sa apese placa, sa fuga si sa treaca singur.
- `g.open` merge lin spre 1 sau 0 in `CONFIG.mech.openTime` (0.5 s). Celulele se deschid peste 0.9. La inchidere se inchid indata (podul se stinge in desen), dar niciodata sub un erou (G1).
- Prima deschidere a unei porti: `mechClick`, `bigHit()` (oprire scurta, camera se apropie), sunetul `gateOpen`, vibratie pe ambele controllere (`rumble(k, 0.3, 0.6, 220)`).
- Pe "Ușor" (daca macar unul dintre jucatori e pe Ușor): `window` si `stay` se inmultesc cu `CONFIG.mech.easy` (1.6).
- Placa (`plate`) e apasata cat un erou potrivit (`who`: -1 oricine, 0 Boon, 1 Killer), cu jucator, sta la mai putin de 55 de mijlocul ei si nu e jos, dus de pasare sau pe trecere. Desenul ei vine in T7.2.
- Regulile G2 - G10 (nimeni nu ramane blocat) vin in T7.3. Pana atunci niciun nivel din joc nu are benzi.

## Update 26 noiembrie 2026: placile si cusca stelutelor (T7.2)

**Placa** (`plate`). Cand un erou potrivit (`who`) sta la mai putin de 55 de mijlocul ei (regula din T7.1, neschimbata), placa coboara `plateDown` unitati, un inel de lumina urca din ea, iar cel care a calcat primeste vibratie (`rumble(k, 0, 0.4, 60)`). Cand e lasata, se aude `plateOff`. Sunetul si vibratia le face `updateMechs`, cu `plateBy(inp)`, care spune cine a calcat.

**Cusca stelutelor** (`cage`). Se face cu `L.cage`, creat de `genLevel` doar cand definitia nivelului are `cage: true` (nicio definitie reala nu o are inca; cusca vine pe nivelul 12, si in T7.4 nu apare pe nivelul 7). Cusca are o steluta inauntru, in `L.stars` cu `kind: 'cage'` si `hidden`.

- O putere a unui erou (`powerSweep`: lovitura, rotirea) sau o minge aruncata de el (`updateCage`) care ajunge la cel mult `cageReach` de cusca e o lovitura. Un obiect sau o putere se numara o singura data.
- Daca al doilea erou a lovit in ultimele `cageWindow` secunde (`easy` pe Ușor), cusca se deschide: `cageOpen` marcheaza steluta, `collectStar` o numara, apare bannerul "Bate palma!" (`ban.cage`) si ambii primesc vibratie.
- Daca a lovit doar unul, cusca se clatina `cageWobble` secunde si deasupra apar fetele celor doi. Cel care nu a lovit inca palpaie.

Steluta nu zboara inca spre bara de sus: `collectStar` o numara cu o explozie de petale, la cusca. Zborul spre HUD nu exista in joc (nici pentru stelele de pe copaci) si se face separat.
