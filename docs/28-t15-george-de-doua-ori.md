# 28. George vine de doua ori, cu diamante comune (sarcina T15)

> Status: **implementat pe 22 noiembrie 2026** (sarcinile T15.1 - T15.7). Deciziile au fost luate in aceeasi zi, dupa raspunsurile proprietarei la cele 7 intrebari si la a doua runda.
> Ce iese din cod si unde codul se abate de la hartie: sectiunea 14, la sfarsit.
> Inlocuieste versiunea din aceeasi zi, cu maximul de diamante si "padurea care nu seaca".

---

## 1. Ce s-a hotarat

| Intrebare | Raspuns al proprietarei | Ce inseamna in cod |
|---|---|---|
| 1. Cota | 15 de diamante pe erou, la TOATE nivelurile. Dificultatea creste din inamici, nu din cota. | `CONFIG.quota.perLevel` devine 15 peste tot (ca 1 - 12). |
| 2. Inamici aruncati | Nivel 1: 2, nivel 2: 4, nivel 3: 5, nivel 4: 6, nivel 5: 8 etc. La mijlocul rundei: oase si mingi. La sfarsit: inamici mai puternici. | Tabelul din G3. |
| 3. Colaborare | Nu exista "padure care nu seaca". Daca unul n-are, celalalt il ajuta. | Se scoate `keepEnough()`. Ajutorul vine din L1 si din ajutorul automat. |
| 4. Diamante comune | Diamantele se aduna in comun (contorul de sus, ca acum). Fiecare are si cota individuala, ca sa se ajute. | Contorul de sus = totalul echipei. Insigna = `gasite / 15` pe erou. |
| 5. Diamant per inamic | 1 diamant per inamic omorat. | `CONFIG.lupta.enemyDrop = 1`. |
| 6. Cand arunca George | Cand ramane cu jumatate din inimi: aruncari. Pierde o inima: oase si mingi. Mai are o inima: inamici care se tin dupa Killer si Boon. | Vezi G4. |
| 7. Siguranta | Mai putine diamante in joc. Diamantele vin doar din inamicii omorati (melci, roboti, altii). Mini-George nou: 3 inimioare, in alte culori, se tine dupa cel mai apropiat erou. | Vezi G5 si G6. |

**Consecinta de care depinde totul**: un nivel de 30 de diamante (15 + 15) cere 30 de inamici omorati. Copacii raman, strahlucesc in continuare si ascund melci: cand un melc iese din copac si e omorat, lasa diamant. Inamicii mici reapar dupa `CONFIG.smallEnemy.respawn` (22 s), deci nivelul nu se blocheaza.

---

## 2. Cota si diamantele

- Cota e 15 pe erou, pe toate nivelurile. Totalul de pe nivel e deci 30, mereu.
- Diamantele apar **doar** cand un inamic e omorat. Valurile nu mai dau diamante. Copacii dau melci, nu diamante: melcul care iese din copac si e omorat lasa diamant (ca orice inamic).
- **Comun si individual.** Contorul de sus arata cate diamante a luat echipa. Insigna arata cate a luat fiecare, din cota lui. Cine e sub cota primeste ajutor de la celalalt (L1, sau ajutorul automat dupa `autoGive`).
- **Fara maxim.** Eroul poate lua oricate. `CONFIG.quota.cap`, `extra` si balonul "Plin!" se scot.
- **Fara "padure care nu seaca".** Ce facea `keepEnough()` il face acum reaparitia inamicilor mici.
- L1 (da un diamant prietenului) ramane ca in T14: aproape (`giveRange`), cu numar.

---

## 3. Mini-George (inamic nou)

- Inamic mic, cu **3 inimioare**, in alte culori decat George (de ales la pictare; propun verde-ulei, ca sa nu se confunde cu George cel mare).
- Se tine dupa **cel mai apropiat erou**. Nu loveste (copiii nu sunt atacati), doar urmareste. Se omoara ca inamicii mici: cu saritura sau cu mingea.
- Cand e omorat, lasa **1 diamant**. Reapare dupa `CONFIG.smallEnemy.respawn`, ca ceilalti.
- Apare pe harta in numar mic (1 - 2 per nivel), langa inamicii mici obisnuiti.

---

## 4. Luptele lui George

### 4.1 Lupta din mijloc (dupa jumatatea cotei comune)

- George arunca **oase si mingi**, nu inamici. Numar pe nivel in G7.
- Un os sau o minge care atinge un erou il ameteste ca un con (refolosim codul de la conuri din `11-mini-lupte.md`).
- Nu se numara in diamante.

### 4.2 Lupta de la cuib (dupa cota comuna intreaga)

George se bate cu inimile lui. Fiecare moment de mai jos e legat de cate inimi ii raman, nu de un cronometru:

| Cand | Ce arunca | Unde se duc |
|---|---|---|
| Pierde o inima, peste jumatate | 2 oase si mingi | Cad pe pamant, ca conurile |
| Ajunge la jumatate sau mai putin (prima data) | Inamici mici, numarul din G7 (prima jumatate) | Se duc la cel mai apropiat erou |
| Pierde inca inimi, sub jumatate | Restul inamicilor din G7 | La fel |
| Ii ramane o inima | Inamici care se tin dupa Killer si Boon | Urmaresc ambii eroi, cel mai apropiat, pana sunt omorati |

"Jumatate" inseamna `ramase <= H / 2`, unde `H` e `CONFIG.lupta.george.hp` (din `CONFIG.duel.finalHp` pe nivel).

Inamicii aruncati:

- au `hp` din G7 (2 pe nivelurile 1 - 2, 3 de la nivelul 3), fiecare lasa **1 diamant** (`enemyDrop`);
- nu reapar dupa ce George e invins (ei dispar cu el);
- nu opresc lupta: George poate fi lovit oricand.

---

## 5. Nivelul se termina

Toate trei, ca in T14, cu punctul 1 nou:

1. George e invins in lupta de la cuib.
2. Fiecare erou are cel putin cota lui (15).
3. Amandoi sunt in cuib.

Cuibul se deschide dupa punctul 1. Daca amandoi sunt in cuib si lipseste cota unuia, ramane bannerul `need` ("Killer mai are nevoie de 3"), iar ajutorul automat lucreaza.

---

## 6. Ce s-a scos fata de versiunea precedenta

- `CONFIG.quota.cap`, `extra`, `supply`, `refillEvery` si `P.cap`.
- `keepEnough()` si bannerul `george.more` ("Padurea mai are!").
- Balonul "Plin!" (`quota.full`, `h.fullT`).
- Diamantele din valuri si din copaci. Copacii raman, dar acum ascund melci, nu diamante.

---

## 7. Numere (de verificat la joaca)

### 7.1 Cota si inamicii din teren

`CONFIG.quota.perLevel = [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]`

Inamici mici din teren, pe nivel (melci din copaci, roboti si altii), care trebuie omorati ca sa iasa 30 de diamante. Reapar la 22 s. Au fost cu 50% mai multi decat in prima varianta, la cererea proprietarei:

| Nivel | Inamici mici pe harta | Mini-George pe harta | Diamante de la ei (30 in total) |
|---|---|---|---|
| 1 | 12 | 1 | 30 |
| 2 | 14 | 1 | 30 |
| 3 | 15 | 1 | 30 |
| 4 | 15 | 2 | 30 |
| 5 | 17 | 2 | 30 |
| 6 | 18 | 2 | 30 |

Cifrele sunt exemple de pornire, cum a cerut proprietara, ca sa aiba o idee. Ele se ajusteaza la joaca.

### 7.2 Luptele lui George

| Nivel | Oase si mingi, mijloc (`midThrows`) | Inamici la nivelul lui (`nestEnemies`), in total | Din care la jumatate | Restul, la o inima |
|---|---|---|---|---|
| 1 | 2 | 2 | 2 | 0 |
| 2 | 3 | 4 | 2 | 2 |
| 3 | 3 | 5 | 2 | 3 |
| 4 | 4 | 6 | 3 | 3 |
| 5 | 4 | 8 | 4 | 4 |
| 6 | 5 | 10 | 5 | 5 |

Nivelul 6 nu a fost dat de proprietara. Cifra 10 e un exemplu de pornire.

Inimile inamicilor aruncati (`enemyHp`): 2 pe nivelurile 1 - 2, 3 de la nivelul 3 incolo.

Viteza inamicilor care urmaresc (`chaseSpeed`): 120, mai mica decat mersul eroului (150), ca sa nu fie ei mai iuti decat copiii. De verificat.

---

## 8. Raspunsurile din a doua runda (22 noiembrie 2026)

- **Copacii** raman si pot straluci in continuare. In ei sunt melci; cand un melc e omorat, apar diamante. Copacii nu mai dau diamante direct.
- **Numarul de inamici din teren**: nu e mult, e ok, dar trebuie sa fie cu cel putin 50% mai multi. Cifrele din 7.1 sunt deja asa.
- **Exemplele de pornire** din 7.1 si 7.2 sunt ca idee, nu cifre fixe. Se ajusteaza la joaca.
- **Oasele si mingile** ameteasca ca si conurile.
- **Micul George** nu loveste, doar urmareste.
- **"Jumatate"** inseamna `ramase <= H/2`.

Nimic nu mai e deschis din specificatie. Restul se verifica la joaca, cu copii.

---

## 9. Configuratie noua (`src/01-config.js`)

```
quota: {
  on: true,
  perLevel: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],  // cota fiecarui erou, pe toate nivelurile
  giveRange: 420, giveEvery: 0.3, flyTime: 0.45,
  autoGive: 120, autoEvery: 2
  // scoase: cap, extra, supply, refillEvery
}
```

```
lupta: { ... george: {
  minT: 20,                                  // lupta din mijloc nu porneste mai devreme de atat
  midThrows: [2, 3, 3, 4, 4, 5],             // oase si mingi in lupta din mijloc, pe nivel
  nestEnemies: [2, 4, 5, 6, 8, 10],          // inamici aruncati in lupta de la cuib, in total pe nivel
  enemyHp: [2, 2, 3, 3, 3, 3],               // inimile fiecarui inamic aruncat
  enemyDrop: 1,                              // diamante lasate de un inamic omorat
  chaseSpeed: 120                            // viteza inamicilor care urmaresc
} }
```

```
lupta: { fieldEnemies: [12, 14, 15, 15, 17, 18],  // inamici mici pe harta, pe nivel (melci din copaci, roboti, altii); exemple de pornire
         miniGeorge: { hp: 3, perLevel: [1, 1, 1, 2, 2, 2], drop: 1 } }
```

---

## 10. Texte noi (`src/015-lang.js`)

| Cheie | Romana | Engleza |
|---|---|---|
| `george.half` | George cel Rău se trezește! | George the Grim wakes up! |
| `george.final` | George cel Rău, ultima luptă! | George the Grim, the last fight! |
| `george.throw` | Ai grijă! | Look out! |
| `george.last` | Ultima inimă! Vin după voi! | Last heart! They come for you! |
| `mini.name` | Micul George | Little George |

`quota.full` și `quota.extra` se scot. `george.more` se scoate.

---

## 11. Sarcini (T15.1 - T15.7)

| Sarcina | Ce | Fisiere |
|---|---|---|
| **T15.1** | Fara maxim: scoate `cap`, `extra`, `quota.full`, `h.fullT`. Cota = 15 peste tot. Insigna arata `gasite / 15`, iar peste cota un `+n` mic. | `01-config.js`, `015-lang.js`, `07-play.js`, `08-draw.js`, `09-screens.js` |
| **T15.2** | Diamante doar din inamicii omorati: scoate diamantele din valuri, copacii dau melci (nu diamante), `keepEnough()`, `supply`, `refillEvery`. Inamicii mici din teren pe nivel (`fieldEnemies`, cu 50% mai multi). | `06-level.js`, `07-play.js`, `01-config.js` |
| **T15.3** | Mini-George: inamic nou, 3 inimioare, urmareste cel mai apropiat erou, lasa 1 diamant, reapare. Pictare in alta culoare. | `05-chars.js`, `07-play.js`, `08-draw.js` |
| **T15.4** | Declansatorul pe diamantele comune (`teamFound`): jumatatea cotei (15 in total) cheama lupta din mijloc, cota intreaga (30) cheama lupta de la cuib. `minT` ramane. | `07-play.js`, `015-lang.js` |
| **T15.5** | Lupta din mijloc: oase si mingi (`midThrows`), ameteala ca la conuri, cad pe pamant ca conurile. | `075-duel.js`, `07-play.js`, `08-draw.js` |
| **T15.6** | Lupta de la cuib: aruncari dupa inimi (G4.2), inamici aruncati cu `enemyHp`, `enemyDrop`, cei de la o inima urmaresc ambii eroi (`chaseSpeed`). Banner `george.last`. | `075-duel.js`, `07-play.js`, `08-draw.js`, `015-lang.js` |
| **T15.7** | Teste `tests/george.js` (G12), documentatie, `CLAUDE.md` (regulile 6, 9, 10 si tabelul), verificare pe capturi. | `tests/`, `docs/`, `CLAUDE.md` |

Ordinea: T15.1 si T15.2 intai (fara ele celelalte lucreaza cu numere vechi). Apoi T15.3, T15.4, T15.5, T15.6, T15.7.

---

## 12. Teste (`tests/george.js`)

1. Cota e 15 pe erou pe fiecare nivel, si nu exista `cap`: un erou ia si peste 15 fara sa se opreasca.
2. Diamantele vin doar din inamicii omorati: niciun diamant nu apare la valuri sau la copaci.
3. Un inamic mic omorat lasa exact 1 diamant, care creste totalul echipei.
4. Mini-George are 3 inimioare, urmareste cel mai apropiat erou, lasa 1 diamant, reapare dupa `respawn`.
5. Lupta din mijloc porneste cand totalul comun ajunge la 15, si nu inainte de `minT`.
6. Lupta de la cuib porneste cand totalul comun ajunge la 30.
7. In lupta din mijloc, George arunca `midThrows[nivel]` oase si mingi, si niciun inamic.
8. In lupta de la cuib, la fiecare inima pierduta peste jumatate arunca 2 oase si mingi.
9. La prima jumatate arunca inamicii din prima jumatate din `nestEnemies`; restul la o inima, care urmaresc.
10. Inamicii aruncati au `enemyHp[nivel]` inimi, iar cei de la o inima urmaresc ambii eroi.
11. George nu e blindat: poate fi lovit cat timp inamicii traiesc.
12. Nivelul nu se termina fara George invins, fara 15 de fiecare, sau fara amandoi in cuib.
13. Cu un singur jucator: cota celuilalt e indeplinita, restul ca mai sus.
14. Dupa reincepere, `teamFound`, `midFought` si `nestFought` sunt zero.

Fiecare verificare e pusa sa pice, ca la `tests/cota.js` (`MUTA=n`).

---

## 13. Ce nu se poate verifica fara copii

- Daca 30 de omoruri per nivel se simt ca un joc sau ca o corvoada.
- Daca oasele si mingile se citesc ca atac, fara sa sperie.
- Daca inamicii care urmaresc sunt prea multi pentru doi copii deodata.
- Daca mini-George, care nu loveste, e "prea prietenos" sau se simte ca o pedeapsa.

---

## 14. Ce s-a implementat si unde codul se abate (22 noiembrie 2026)

Codul e in `src/07-play.js` (`teamNeed`, `teamFound`, `updateGeorge`, `dropGems`, `addSnail`), `src/075-duel.js` (`georgeBones`, `georgeEnemies`, `updateGeorgeMid`, `georgeNestThrows`, `georgeClearThrown`), `src/06-level.js` (inamicii pe harta, Micul George), `src/055-lupta.js` (`drawMiniGeorge`) si `src/08-draw.js` (bara de sus, insigna). Reglajele sunt in `CONFIG.lupta` (`fieldEnemies`, `treeSnails`, `enemyDrop`, `miniGeorge`, `george`).

| Ce | Pe hartie | In cod | De ce |
|---|---|---|---|
| Totalul echipei | Camp `P.teamFound` | Functie `teamFound()`: `found[0] + found[1] + diamantele in zbor` | Un diamant dat cu L1 e in aer cateva zecimi de secunda; altfel totalul ar cobori si ar urca la loc. |
| Cat trebuie echipei | 30 | `teamNeed()`: `q` ori numarul de jucatori (15 cand joaca unul singur) | Cu un singur jucator, cota celuilalt se socoteste gasita (C13). George vine la 8 si la 15. |
| Inamicii de pe harta | `fieldEnemies`: melci, roboti, altii | `fieldEnemies` numara roboti + melcii copacilor (`treeSnails` = 2 de copac) + conurile. Robotii completeaza ce lipseste | Un singur numar de reglat. |
| Ce lasa un inamic | 1 diamant | 1 diamant (`enemyDrop`), de la orice inamic mic: robot, melc, con, pasare, Micul George, inamic aruncat | Toti mor prin `hurtSmall`; un singur loc. |
| Prima parte a inamicilor de la cuib | Tabelul 7.2 | `N <= 2 ? N : floor(N / 2)` la jumatate, restul la ultima inima | Formula da exact tabelul (2+0, 2+2, 2+3, 3+3, 4+4, 5+5). |
| Bannerele aruncarilor | `george.throw`, `george.last` | `ban.gthrow`, `ban.glast` | Bannerele mici din banda citesc `ban.<fel>`. |
| `mini.name` | Text nou | Nu a fost adaugat | Numele nu apare nicaieri pe ecran. |
| Unde aterizeaza George la mijloc | Nespecificat | Langa eroi, la 420 de unitati in dreapta lor | Vine cand au strans jumatate, oriunde ar fi pe harta; nu cade peste ei. |
| Cuibul | Se deschide dupa George | `openNest()` doar la sfarsitul luptei de la cuib; valurile doar aprind copacii | Ca pe hartie. Fara lupte (`CONFIG.duel.enabled = false`), cuibul se deschide la cota echipei. |
| **In plus**: jocul cu un singur jucator | Nespecificat | Ce culege eroul care nu joaca se numara la cel care joaca | Greseala gasita de botul care merge singur: eroul care nu joaca lua diamante, George venea, dar cota celui care juca nu se umplea si nivelul nu se mai termina. |
| **In plus**: Micul George la inceputul nivelului | 3 inimi | `startPlay` pune `maxHp`, nu numarul general | Greseala gasita de `tests/george.js`: pornea cu 2 inimi. |
