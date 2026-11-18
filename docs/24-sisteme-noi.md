# 24. Partea a doua: sistemele noi

> **Un singur joc (18 noiembrie 2026).** "Bubu și Leo" a fost scos. Tot ce e specificat aici se implementeaza **doar in "Cea mai grea luptă"**. Unde scrie "ambele jocuri", "primul joc", variante `L:` sau teste pentru `bubu`, se citeste: un singur joc, textele lui (varianta `L:`), un singur rand de teste. Nu se mai scrie cod pentru primul joc.

Status: **specificatie, neimplementata.** Vezi `23-update-partea-a-doua.md` pentru cerere, hotarari si cele 14 sarcini, si `../prompts/06-prompt-partea-a-doua.md` pentru promptul fiecareia.

Sapte sisteme. Fiecare are: cerinta, ce e acum in cod, ce se face, valorile din `CONFIG`, cazurile de margine si testul.

| Nr | Sistem | Sarcina | Jocuri |
|---|---|---|---|
| S1 | Butoane si taste | T2 | ambele |
| S2 | Fuga (L3) | T2 | ambele |
| S3 | A doua putere | T3 | doar "Cea mai grea luptă" |
| S4 | Cele 10 secunde | T4 | ambele |
| S5 | Capitole, meniu de start, salvare | T5, **facuta** | ambele |
| S6 | Scrisul de sus | T1, **facuta** | ambele |
| S7 | Stilul grafic | T6 | nivelurile 7 - 12 si eroii celui de-al doilea joc |

---

## S1. Butoane si taste - **facuta (T2, 18 noiembrie 2026)**

Butoanele si tastele sunt acum in joc. Descrierea lor, la timpul prezent: `07-control.md` (butoanele, campurile din `Input.slots`, tastele noi), `03-config.md` (`keys[k].c`, `keys[k].r`), `12-desen-si-hud.md` (`iconO`, `iconL3`, `richText`), `13-ecrane-si-meniuri.md` (pagina "Alege tastele"). Hotararile: `16-decizii.md`. Testul: `tests/control-nou.js`.

---

## S2. Fuga - **facuta (T2, 18 noiembrie 2026)**

Fuga e acum in joc. Descrierea ei, la timpul prezent: `10-gameplay.md`, "Fuga" (pornire si oprire, viteza, pasii de coliziune, camera, cum arata si cum suna, tutorialul), `03-config.md` (`sprint`), `06-sunet.md` (`dash`, cuvantul `run`), `12-desen-si-hud.md` (`drawRunTrail`). Hotararile: `16-decizii.md`. Ce n-a putut fi verificat: `19-limitari.md`. Testul: `tests/fuga.js`.

Ce s-a facut altfel decat scria in specificatie:

- Pasii de coliziune au marimea in `CONFIG.sprint.step` (12), nu scrisa in cod.
- `Snd.play` a primit un al patrulea argument (volumul), ca pasii din fuga sa fie mai incet fara un sunet nou.
- Iconita L3 din tutorial sta deasupra numelui eroului si deasupra lui ✕ (la 220 - 260 de unitati), altfel se suprapunea peste ele.
- Fuga se opreste si cand eroul incarca o aruncare (era in specificatie) si cand nivelul e terminat.

---

## S3. A doua putere

**Cerinta:** "Killer sa isi alungeasca si el mainile si sa aiba puterea lui Boon (alta culoare, alte detalii sa nu arate fix la fel, sa vibreze controllerul cand o foloseste) iar Boon sa primeasca puterea lui Killer, dar sa arunce cu altceva - ceva specific dinozaurilor."

| Erou | ✕ (prima putere) | □ (a doua putere) |
|---|---|---|
| Boon | **Gheare**: ghearele cresc si se rotesc. Scut, lovesc, trag cristalele. | **Oase-bumerang**: 8 oase de dinozaur pleaca in cerc. 12 la aruncarea incarcata. |
| Killer | **Mingi**: 8 mingi in cerc, care sar. 12 la sutul incarcat. | **Mănuși-vârtej**: bratele se lungesc, manusile de portar se rotesc. Scut, lovesc, trag cristalele. |

### S3.1 Intai: puterile devin abilitati

Acum codul stie ca eroul 0 se roteste (sau tropaie) si eroul 1 arunca. Asta e scris in multe locuri: `if (h.k === 0)` in `updateHero`, `CONFIG.heroes[0]` in `powerSweep`, `doStomp`, `startPower`, `CONFIG.heroes[1]` si `D(1)` in `kickBall`, `Snd.play('kick', power, 1)`, `Snd.talk(1, ...)`, `Input.rumble(1, ...)`, `collectEgg(e, 1)` in `stepFlyBall`, mingea de acasa `P.ball` desenata la picioarele eroului 1, `P.tut[0]` si `P.tut[1]`, eroul fara jucator din `updateHero`, `duelBall`, `duelStomp`, `bossBall`, `bossShake`.

Pasul acesta nu schimba nimic pentru jucator. Schimba doar cine poate face ce.

**Doua abilitati:**

- `spin` (rotire in jurul eroului): ghearele lui Boon, manusile lui Killer. Tropaitul lui Bubu este aceeasi abilitate cu `time: 0` (o singura lovitura, fara scut).
- `throw` (aruncare in cerc): mingile lui Leo si Killer, oasele lui Boon.

**In `CONFIG`**, fiecare erou spune ce are pe fiecare buton. Valorile de acum raman unde sunt, ca nimic sa nu se strice. Se adauga doar:

```js
// heroes[0] (Bubu):      power: 'spin',  power2: null
// heroes[1] (Leo):       power: 'throw', power2: null
// lupta.heroes[0] (Boon):   power: 'spin',  power2: 'throw', throw: { ... }
// lupta.heroes[1] (Killer): power: 'throw', power2: 'spin',  spin: { ... }
```

O functie mica da valorile unei abilitati pentru un erou:

```js
// the values of one ability of hero k: his own block if he has one, else the old names on the hero
function abil(k, kind) {
  const c = CONFIG.heroes[k];
  if (kind === 'spin')  return c.spin  || { radius: c.stompRadius, pull: c.pullRadius, cooldown: c.stompCooldown, stun: c.stunTime, time: c.spinTime || 0, look: c.spinTime ? 'claws' : 'stomp' };
  return c.throw || { speed: c.kickSpeed, speedMax: c.kickSpeedMax, charge: c.chargeTime, n: c.ballsPerKick, nMax: c.ballsPerKickMax, cooldown: c.kickCooldown, life: c.ballLife, lifeMax: c.ballLifeMax, look: 'ball' };
}
```

**Starea eroului** (`makeHero`). Campurile vechi raman. Se adauga, pentru aruncare, pe fiecare erou: `throwCd` (in locul lui `P.ballCool`), `homeState` (`'held'` sau `'away'`, in locul lui `P.ball.state`). `P.flock` ramane o singura lista. Fiecare obiect aruncat primeste `owner` (0 sau 1) si `look` (`'ball'` sau `'bone'`).

**Functiile, dupa refactorizare:**

| Acum | Devine | Ce se schimba |
|---|---|---|
| `startPower(h)` | `startSpin(h)` | Citeste `abil(h.k, 'spin')`. Sunet, cuvant si vibratie cu `h.k`, nu cu 0. |
| `powerSweep(h, id)` | `powerSweep(h, id)` | `cfg = abil(h.k, 'spin')`. `rank(h.k)` in loc de `Game.diff[0]`. |
| `doStomp(h)` | la fel | `Snd.play('stomp', 0, h.k)`, `Input.rumble(h.k, ...)`. |
| `kickBall(h, power, ax, ay)` | `throwRing(h, power, ax, ay)` | Citeste `abil(h.k, 'throw')` si `D(h.k)`. Fiecare obiect: `owner: h.k`, `look`. Sunetul dupa `look` (vezi S3.2). |
| `recallBalls()` | `recallBalls(k)` | Doar obiectele cu `owner === k`. |
| `ballReady()` | `throwReady(h)` | `h.homeState === 'held' || h.throwCd <= 0`. |
| `updateBall(dt)` | la fel | Scade `throwCd` pentru ambii eroi. Un erou are `homeState = 'held'` cand nu mai are nimic in `P.flock`. |
| `stepFlyBall(b, dt, h)` | `stepFlyBall(b, dt)` | `h = P.heroes[b.owner]`. `collectEgg(e, b.owner)`, `collectStar(s, b.owner)`, `Snd.play('bounce', 0, b.owner)`. Saritul (`b.z`) doar pentru `look === 'ball'`. |
| blocul `if (h.k === 0) {...} else {...}` din `updateHero` | doua bucati: `updateSpin(h, dt, pressed)` si `updateThrow(h, dt, pressed, released, held)` | Fiecare e chemata pentru butonul pe care eroul are abilitatea aceea: `power` cu `aP / aR / a`, `power2` cu `cP / cR / c`. |
| `duelStomp(h)`, `duelBall(b)`, `duelCanHurt(k, how)` | la fel | `k` vine din `h.k` sau `b.owner`. |
| `bossShake(h)`, `bossBall(b)` | la fel | La fel. |
| `P.tut[0].used`, `P.tut[1].used` | `P.tut[k].used` (prima putere), `P.tut[k].used2` (a doua) | Indicii din tutorial dupa erou, nu dupa abilitate. |

Mingea de acasa (cea de la picioarele lui Leo si Killer) se deseneaza pentru eroul care are `throw` si `look: 'ball'` si `homeState === 'held'`. Osul de acasa al lui Boon: vezi S3.2.

**Eroul fara jucator** (cel care il urmeaza pe prieten): la boss foloseste abilitatea potrivita, oricare ar fi butonul ei. Regula ramane: eroul 0 scutura, eroul 1 loveste.

**Gata cand:** toate testele de acum trec fara nicio schimbare in primul joc (`mingi-leo.js`, `joc-complet-bot.js`, `mini-lupte-bot.js`, `inamici-mici.js`). Asta e dovada ca refactorizarea nu a stricat nimic. Abia apoi se adauga a doua putere.

### S3.2 Boon: Oase-bumerang (□)

Aceleasi reguli ca mingile lui Killer: numar, viteza, durata, incarcare, a doua apasare le cheama inapoi, sar din pereti, lovesc inamicii mici o data pe aruncare, culeg cristale si stele, lovesc paznicul. Valorile sunt ale lui, ca sa poata fi reglate separat.

```js
// in CONFIG.lupta.heroes[0] (Boon)
power: 'spin', power2: 'throw',
throw: {                 // □: boomerang bones. The same rules as Killer's balls, his own numbers.
  look: 'bone',
  speed: 700, speedMax: 1250,   // a little slower than the balls (760, 1400): easier for the younger player to follow
  charge: 0.9,
  n: 8, nMax: 12,
  cooldown: 1.2,
  life: 2.3, lifeMax: 3.8
},
```

**Ce e diferit (cum arata si cum suna, nu regulile):**

| | Mingile lui Killer | Oasele lui Boon |
|---|---|---|
| Obiectul | Minge alba cu hexagoane indigo (`drawBallL`). | Os de dinozaur: doua capete rotunde si o tija, crem-chihlimbar (`#F3E2B8`, umbra `#C99A52`), cu o crapatura mica. Functie noua `drawBone(c, x, y, r, spin)` in `055-lupta.js`. |
| In zbor | Sare sus-jos (`b.z`). | Nu sare. Se roteste repede (`spin` x 3) si pluteste la 14 unitati deasupra pamantului. |
| Urma | Scantei curcubeu. | Un arc turcoaz (`#2FBFA8`) care se stinge, ca la un bumerang: ultimele 6 pozitii unite cu o linie groasa de 10, alpha de la 0.5 la 0. Plus urme mici de laba, din cand in cand. |
| Drumul inapoi | Linie dreapta spre Killer. | Curba: la intoarcere se adauga o deviere laterala `sin(u * PI) * 90`. E doar desen si pozitie, fara ciocniri la intoarcere (ca acum). |
| Sunet la aruncare | `kick` + `swish`. | Sunete noi `bone` ("fup-fup-fup": trei note joase de triunghi, 180 - 140 Hz, cu tremur de 14 Hz) si `swish`. |
| Sunet la perete | `bounce`. | `tock` (lemn: sinus de 520 Hz cu coada de 0.06 s, plus un clic filtrat). Cel mult 3 pe secunda pentru toate oasele, cu acelasi `P.bounceT`. |
| Vibratie | `0.3 + power * 0.5` tare, 0.5 slab, `70 + power * 90` ms. | La fel ca valori, pe controllerul lui Boon. |
| Incarcare | Inelul de acum, in albastrul lui Killer. | Inelul in turcoaz, iar Boon ridica osul deasupra capului. |
| Acasa | Mingea sta la picioare. | Osul sta in mana lui Boon (bratul cu gheare), tinut pe umar. Dispare din mana cat oasele sunt plecate. |
| Cuvinte | `power`, `powerBig`. | `power2`, `power2Big` (cuvinte noi, vezi capitolul 25). |

`drawBall(c, x, y, r, spin)` primeste un argument in plus, `look`. `drawFlock` (sau locul din `drawWorld` unde se deseneaza `P.flock`) trimite `b.look`.

### S3.3 Killer: Mănuși-vârtej (□)

Aceleasi reguli ca ghearele lui Boon: cat se rotesc, nimic nu il loveste (`h.shield`), tot ce e in cerc simte o lovitura pe rotire, cristalele din jur zboara spre el, urletul lui George nu il impinge, pasarea nu il ridica.

```js
// in CONFIG.lupta.heroes[1] (Killer)
power: 'throw', power2: 'spin',
spin: {                  // □: whirl gloves. The same rules as Boon's claws, his own numbers.
  look: 'gloves',
  radius: 220, pull: 300,
  time: 0.85,
  cooldown: 1.6,         // Boon: 1.25. A little longer: the older player is shielded a little less often
  stun: 2.8
},
```

**Ce e diferit:**

| | Ghearele lui Boon | Manusile lui Killer |
|---|---|---|
| Bratele | Un brat albastru care se lungeste, cu gheare care cresc (`o.claw`). | Amandoua bratele (lungi si de culoarea pielii, ca in desenul copilului) se intind de 2.4 ori. La capete, manusi mari de portar: rosii (`#E4583C`), cu palma alba si o stea albastra in palma. Optiune noua de desen `o.glove` (0 - 1) in `drawKiller`. |
| Inelul | `drawClawRing`: urme de gheare in culorile curcubeului. | Functie noua `drawGloveRing(c, h)`: doua manusi care se urmaresc pe cerc, fiecare cu o panglica in spate, una albastra (`#3B6FE0`) si una alba. Sub ele, pe pamant, un cerc punctat alb, ca linia de la centrul terenului. |
| Sensul | In sensul acelor de ceas. | Invers. |
| Scantei | Curcubeu. | Stelute albe si albastre si, din cand in cand, un hexagon mic (ca pe minge). |
| Sunet | `stomp` din `fx2` (trei suieraturi). | Sunet nou `gloves`: doua "fuip" care urca (zgomot trece-banda 500 -> 1400 Hz) si un scartait moale de cauciuc (sinus 900 -> 700 Hz, 0.08 s). |
| Vibratie | Continua: `rumble(k, 0.5, 0.6, time * 900)`. | **Trei batai**: la 0, 0.28 si 0.56 s, fiecare `rumble(k, 0.7, 0.9, 110)`. Se simte altfel in mana. Cerut: "sa vibreze controllerul cand o foloseste". |
| Cuvant | `power`. | `power2`. |

Vibratia in trei batai are nevoie de un mic ajutor in `updateSpin`: `h.spinBeat` numara bataile date. Cand `h.spinT` trece de `spinBeat * 0.28`, se da urmatoarea.

### S3.4 Reguli comune pentru cele doua puteri ale unui erou

1. Fiecare putere are timpul ei de asteptare. Nu se pot porni amandoua in acelasi timp: cat se roteste nu poate incepe o aruncare, cat incarca o aruncare nu poate porni rotirea.
2. Obiectele plecate raman in aer cand eroul incepe sa se roteasca.
3. Un erou jos, ametit, dus de pasare sau care poarta cristalul nu are nicio putere.
4. In mini-lupte si la boss, o lovitura conteaza dupa **fel** (rotire sau obiect aruncat), nu dupa cine a dat-o. Regulile din `duelCanHurt` raman.
5. Arena lui George (lupta de dupa nivelul 6) nu se schimba: rotirea il da jos de pe tron, obiectul aruncat il loveste. Acum fiecare erou le poate face pe amandoua. Lupta devine putin mai usoara. E acceptat: lupta noua, din Sala Tronului, cere cu adevarat amandoi eroii.
6. Tintele colorate din nivelurile noi asculta dupa **erou**, nu dupa putere (capitolul 25).

### S3.5 Tutorial

- Povestea nivelului 7 spune puterile noi (text in capitolul 25).
- Pe nivelul 7, deasupra fiecarui erou apare `iconSq` pana cand foloseste o data a doua putere (`P.tut[k].used2`), cel mult 90 de secunde. Aceeasi regula ca pentru ✕ pe nivelul 1 (`drawHints`).
- In lista de capitole, nivelurile 1 - 6 se pot rejuca cu ambele puteri.

### Test: `tests/puteri-doi.js` (doar `JOC=lupta`)

1. Boon, □ scurt: 8 obiecte cu `owner: 0`, `look: 'bone'`, la unghiuri egale. □ tinut 1 s: 12.
2. A doua apasare cat zboara: toate oasele lui se intorc. Mingile lui Killer nu.
3. Un os loveste un robot: o inima mai putin. Cele 8 oase ale aceleiasi aruncari: tot una.
4. Un os culege un cristal: creste totalul, culesul e trecut pe Boon.
5. Killer, □: `h.shield` adevarat 0.85 s. Un robot langa el pierde o inima. Un atac nu il loveste. Cristalele din 300 de unitati vin spre el.
6. Killer, □: vibratiile inregistrate pe controllerul lui sunt trei, la cel putin 0.2 s una de alta.
7. Cat Killer se roteste, ✕ nu porneste un sut. Cat Boon incarca oasele, ✕ nu porneste ghearele.
8. In "Bubu și Leo": □ nu face nimic. `P.flock` ramane gol dupa □ al lui Bubu.
9. Captura cu amandoua puterile noi pornite deodata, privita cu ochiul: oasele nu seamana cu mingile, manusile nu seamana cu ghearele.

---

## S4. Cele 10 secunde

**Cerinta:** "cand un personaj este lovit - la ambii jucatori le vibreaza controllerul si au 10 secunde sa se ajute, daca nu se ajuta reincep level-ul de la inceput."

### Acum

`hitHero` pune `h.down = true` daca prietenul e jucat. Vibreaza doar controllerul celui lovit (`Input.rumble(h.k, 0.9, 0.6, 280)`). Nu exista limita de timp (`rescue.autoAfter: 0`). Daca amandoi sunt jos, se ridica singuri dupa `bothDown` (3) secunde.

### Reguli

1. Cand un erou e lovit si ramane jos: **ambele** controllere vibreaza. Cel lovit: `rumble(k, 0.9, 0.6, 300)`. Prietenul: `rumble(1 - k, 0.6, 0.5, 300)`.
2. Porneste numaratoarea: `h.downLeft = limit` (10 secunde).
3. Daca prietenul il ajuta (○) inainte de zero: totul ca acum (`getUp`).
4. Daca ajunge la zero: `Game.failLevel()`. Nivelul reincepe de la inceput.
5. Daca amandoi sunt jos: numaratoarea amandurora sare la cel mult `bothDown` (3) secunde. La zero, nivelul reincepe. (H8. Cu `bothDownRestart: false` se ridica singuri, ca acum.)
6. Un singur jucator: fara numaratoare. Se ridica singur dupa ameteala, ca acum.
7. Numaratoarea sta pe loc in pauza (pauza opreste deja `updatePlay`).
8. In mini-lupta, paznicul se odihneste cat un erou e jos (regula de acum, `duelWaiting()`). Numaratoarea merge.
9. La reincepere: cristalele si stelele adunate in nivelul acesta se pierd. Cele din nivelurile dinainte raman (vezi S5, totalul e suma rezultatelor).
10. Dupa `retryMercy` (3) reinceperi ale aceluiasi nivel fara sa fie terminat, limita devine `limitMercy` (15) secunde pentru nivelul acela (H9).

### Ce vede si ce simte copilul, secunda cu secunda

| Moment | Pe ecran | Sunet | Vibratie (ambele controllere) |
|---|---|---|---|
| Lovitura | Ca acum. In plus: un inel de 10 margele in jurul eroului cazut, toate aprinse, in culoarea prietenului. Deasupra lui, cifra "10" (marime 64, font de titlu) si `iconO`. In banda de sus (S6), mesajul "Ajută-l pe Boon! ○". | `bonk`, `hurt` ca acum. Apoi cuvantul `help`. | tare, 300 ms |
| Fiecare secunda | Se stinge o margea. Cifra scade si "pocneste" (scara 1.25 -> 1 in 0.15 s). | `tick`: un toc moale de lemn (sinus 660 Hz, 0.05 s). | slab: `rumble(k, 0, 0.35, 60)` |
| Ultimele 3 secunde | Cifra e mai mare (84) si corai. Marginea ecranului pulseaza in culoarea eroului cazut, alpha pana la 0.25. Nu rosu inchis, nu negru. | `tick` mai sus (880 Hz), de doua ori pe secunda. Cuvantul `hurry` al prietenului, o data. | mai tare: `rumble(k, 0.4, 0.6, 90)`, de doua ori pe secunda |
| Ajutat la timp | Ca acum: inimioare, `heal`, `thanks`. Inelul se sparge in scantei. | ca acum | ca acum |
| Zero | Ecranul se stinge spre culoarea hartiei in 0.5 s. | `retry`: trei note care coboara bland (kalimba), nu o alarma. | una lunga si moale: `rumble(k, 0.3, 0.3, 400)` |

### Ecranul "Încă o dată!"

Stare noua a jocului: `Game.state = 'retry'`, 2.2 secunde, fara butoane.

- Fundalul: nivelul, cum era, sub un strat crem (`drawDim`, alpha 0.7).
- Un cartonas in mijloc (900 x 360): cei doi eroi desenati tinandu-se de mana, titlul "Încă o dată!" (`retry.title`), sub el "Ajutați-vă repede: aveți 10 secunde." (`retry.sub`, cu numarul din `CONFIG`).
- De la a treia reincepere pe acelasi nivel: "Acum aveți 15 secunde." (`retry.mercy`).
- Dupa 2.2 s: `Game.goLevel(Game.levelIdx)`. Povestea nivelului **nu** se mai arata la reincepere (`UI.skipIntro = true`): eroii pornesc direct.
- Cuvintele "Game Over", "Ai pierdut", "Greșit" nu apar nicaieri.

### De facut in cod

1. `CONFIG.rescue` primeste:

```js
limit: 10,               // seconds the friend has to help. 0 = no limit (the rule before this update)
limitMercy: 15,          // the limit after retryMercy restarts of the same level
retryMercy: 3,           // 0 = the limit never grows
bothDownRestart: true,   // both heroes down: the level restarts after bothDown seconds. false = both get up alone
restart: 'level',        // 'level' = from the beginning of the level. ('wave' is reserved, not built.)
limitGames: ['bubu', 'lupta'],
```

   `autoAfter` ramane, dar nu se mai foloseste cand `limit > 0`.
2. `makeHero`: `downLeft: 0`.
3. `hitHero`: dupa `h.down = true`, `h.downLeft = rescueLimit()`. Vibratia prietenului. `rescueLimit()` da `limitMercy` daca `Game.tries[Game.levelIdx] >= retryMercy`, altfel `limit`.
4. `updateHero`, in blocul `if (h.down)`: scade `h.downLeft`. La fiecare secunda intreaga trecuta: `tick` si vibratia. La zero: `Game.failLevel()`.
5. `updateRescue`: regula "amandoi jos" devine `downLeft = Math.min(downLeft, bothDown)` cand `bothDownRestart`.
6. `src/10-main.js`: `Game.failLevel = function () { Game.tries[Game.levelIdx] = (Game.tries[Game.levelIdx] || 0) + 1; Game.state = 'retry'; UI.retryT = 0; Snd.play('retry'); Snd.setDuck(0.5); }`. In `update`: starea `retry` numara si cheama `Game.goLevel`. In `draw`: `drawRetry`. `Game.tries` se goleste pentru un nivel cand e terminat.
7. `Game.levelEnd` salveaza numarul de incercari in rezultat (`tries`), pentru ecranul de capitole.
8. Medalia "Fără nicio lovitură" (`levelMedals`) ramane legata de `P.hits`.
9. Portile din nivelurile noi se deschid cat un erou e jos (capitolul 25, 3.6), ca prietenul sa poata ajunge.

### Cazuri de margine

- Erou jos in cuib: nu se poate, in cuib nu e lovit.
- Erou dus de pasare: nu e jos, nu are numaratoare.
- Prietenul isi pierde controllerul in timpul numaratorii: jocul intra in pauza (regula de acum), numaratoarea sta.
- Prietenul iese de tot din joc (`joined` fals): eroul se ridica singur (regula de acum).
- La boss (Arena, Sala Tronului): la fel. Reincepe lupta de la inceput.
- Reincepere in timpul unei rejucari din "Capitole": la fel.

### Test: `tests/zece-secunde.js`

1. Erou lovit: vibratii inregistrate pe ambele controllere in acelasi cadru.
2. Dupa 9.5 s inca asteapta. `Game.state === 'play'`.
3. Ajutat la 9.5 s: se ridica, nu reincepe nimic.
4. Neajutat: la 10 s `Game.state === 'retry'`. Dupa inca 2.5 s: `play`, acelasi `levelIdx`, `P.time` aproape de 0, cristalele nivelului 0, totalul echipei egal cu cel de la inceputul nivelului.
5. Amandoi loviti: reincepe dupa 3 s. Cu `bothDownRestart: false`: se ridica singuri.
6. Un singur jucator: nu reincepe niciodata.
7. Trei reinceperi la rand: a patra oara limita e 15.
8. Pauza la secunda 5, 20 de secunde de asteptare, apoi continuare: mai sunt 5 secunde.
9. Captura cu numaratoarea la 3 si captura cu "Încă o dată!". Niciun pixel negru sau gri in cartonas.
10. In ambele jocuri.

---

## S5. Capitole, meniul de start, salvarea

**Implementat pe 18 noiembrie 2026 (sarcina T5).** Descrierea a fost mutata in `13-ecrane-si-meniuri.md`, sectiunea "Update 18 noiembrie 2026: capitole", si in `14-bucla-principala.md`. Hotararile luate pe drum sunt in `16-decizii.md`. Ce ramane pentru alte sarcini:

- `results[i].tries` (de cate ori s-a reluat un nivel) se adauga in sarcina T4, impreuna cu cele 10 secunde.
- Sala Tronului intra in `chapters()` in sarcina T11. Nivelurile Partii a doua intra singure, cand creste `CONFIG.lupta.levels`.
- Textele `retry.*` si `ban.help`, scrise in tabelul vechi al acestei sectiuni, tin de sarcina T4. Sunt in S4.

---

## S6. Scrisul de sus nu mai acopera eroii

**Implementat pe 18 noiembrie 2026 (sarcina T1).** Descrierea a fost mutata in `12-desen-si-hud.md` (banda de sus) si in `10-gameplay.md` (camera). Hotararile luate pe drum sunt in `16-decizii.md`, iar ce nu s-a putut verifica in `19-limitari.md`. Ce s-a facut altfel decat scrie mai jos:

- Bannerul de lupta sta tot in cardul din mijloc (16 - 104), nu in dreptunghiul 16 - 124 din tabel: altfel ar fi acoperit bara de progres, adica inimile paznicului, exact in timpul luptei.
- Bara de progres e la 105 - 131, nu 108 - 128: semnele de etapa au raza 13, deci ies cu 3 unitati in sus si in jos fata de linie.
- `camTarget` are doua limite in plus fata de formula de mai jos: eroul de sus nu intra sub banda (limita tare) si, cand incape, eroul de jos ramane cu picioarele pe ecran. Formula din tabel singura lasa un erou sub banda cand eroii sunt departe pe verticala si zoom-ul e la minim.

**Cerinta:** "scrisul de sus vine peste joc si de multe ori nu se vad personajele - de rezolvat acest bug."

### Ce se intampla acum (masurat)

`drawHUD` (`src/08-draw.js`) deseneaza, peste lume:

| Element | Dreptunghi pe ecran (x0, y0, x1, y1) |
|---|---|
| Insigna eroului 1 | 36, 28, 376, 140 |
| Insigna eroului 2 | 1544, 28, 1884, 140 |
| Cartonasul din mijloc (cristale, stele, luna) | 630, 24, 1290, 144 |
| Bara de progres | 440, 152, 1480, 218 |
| Bannerul ("Mai multe!", "La cuib!", "Curcubeu!") | 630, 250, 1290, 362, timp de 4 - 5 s |
| Bannerul de lupta ("Provocare!" + numele paznicului) | 480, 244, 1440, 420 |

Deci sus, in mijloc, sunt acoperiti mereu 218 pixeli din 1080. Cand apare un banner, pana la 420.

Camera pune mijlocul dintre eroi in mijlocul ecranului (`ty = (a.y + b.y) / 2 - 30`). Un erou are cam 190 de unitati cu tot cu nume. Cand eroii stau impreuna, picioarele lor sunt la y = 570 pe ecran, iar numele la 380. Bannerul de lupta coboara pana la 420.

Masuratoare din 16 noiembrie 2026 (`tests/hud-acoperire.js`, aceleasi numere in ambele jocuri). Procentul de asezari in care macar un erou e acoperit:

| Cum stau eroii | Nivel | De HUD | De un banner | De bannerul de lupta |
|---|---|---|---|---|
| Impreuna (fiecare celula libera) | 1, 2, 3, 4, 6 | 6.5 - 6.7% | 12.0 - 12.2% | 48.8 - 50.2% |
| Impreuna | 5 (cu stanca) | 0% | 2.2% | 43.4% |
| Departe unul de altul (400 de perechi la intamplare) | 1, 2, 3, 4, 6 | 36 - 47% | 24 - 26% | 38 - 44% |
| Departe | 5 | 24.5% | 24.8% | 39% |

Cand eroii stau impreuna, bannerul de lupta acopera unul din ei in jumatate din locuri, exact cand incepe lupta. Cand sunt departe unul de altul, cel de sus ajunge sub HUD in peste o treime din asezari. Asta e bug-ul.

### Solutia: trei schimbari

**1. HUD mai subtire.** Totul intr-o banda de sus de cel mult 132 de pixeli (`HUD_TOP = 132`, constanta noua in `08-draw.js`).

| Element | Dreptunghi nou | Ce se schimba |
|---|---|---|
| Insigna eroului 1 | 28, 16, 328, 104 | Portret de 68 in loc de 90. Numele la marimea 36. Dificultatea sub nume, marimea 22. |
| Insigna eroului 2 | 1592, 16, 1892, 104 | La fel. |
| Cartonasul din mijloc | 640, 16, 1280, 104 | Cristalul si numarul la marimea 52. Cele sapte culori sub numar raman, mai mici (raza 6). Stelele la raza 24. Luna-ceas ramane. |
| Bara de progres | 500, 108, 1420, 128 | O singura linie groasa de 12, cu semnele de etapa (raza 13) si punctul echipei (raza 11). Fara cartonas in spate: doar o umbra moale sub linie. Numarul "× 12" din stanga si procentul din dreapta raman, la marimea 22. |

La boss, golurile (`bh` cercuri) intra in cartonasul din mijloc, la raza 20.

**2. Bannerele intra in banda de sus.** Un banner nu mai e un cartonas separat sub HUD. Cat timp e activ, **ia locul** continutului cartonasului din mijloc: cartonasul se lateste (la 880 pentru un rand, la 1000 pentru bannerul de lupta), isi schimba culoarea in `#FFF6E2` si arata textul. Dupa ce trece, revine.

- Un rand: marimea 46, culoarea `#C4573D`, cu iconitele de acum (sageata, cuibul, cristalele).
- Bannerul de lupta: doua randuri, 40 si 26, in aceeasi inaltime (16 - 124).
- Intrarea si iesirea: cartonasul "respira" (scara 1.06 -> 1 in 0.2 s). Nu coboara peste lume.
- `ban.wait` ("Îl așteptăm pe Leo în cuib!") se deseneaza acum deasupra cuibului, in lume. Se muta si el in banda de sus, ca banner, cat timp conditia e adevarata.
- Mesajul de ajutor (`ban.help`, S4) apare tot aici.

**3. Camera tine eroii sub banda.** Zona in care trebuie sa incapa eroii nu mai e tot ecranul, ci ecranul fara banda de sus.

Regula camerei se muta din `updatePlay` intr-o functie fara efecte, `camTarget(L, a, b)`, care intoarce `{ x, y, zoom }` pentru doi eroi. `updatePlay` o cheama si merge lin spre rezultat, ca acum. Functia se adauga la `window.__game`, ca testul sa masoare exact regula jocului.

```js
const SAFE = HUD_TOP + 20;                                   // nothing of a hero may be drawn above this line
let tz = Math.min(1, W / (Math.abs(a.x - b2.x) + 760), (H - SAFE) / (Math.abs(a.y - b2.y) + 560)); tz = clamp(tz, L.minZoom, 1);
...
const vw = W / cam.zoom, vh = H / cam.zoom, up = SAFE / 2 / cam.zoom;
const ty = clamp((a.y + b2.y) / 2 - 30 - up, vh / 2 - SAFE / cam.zoom, L.H - vh / 2);
```

Doua lucruri noi aici:

- Mijlocul dintre eroi e tinut in mijlocul zonei libere (mai jos cu `SAFE / 2` pixeli de ecran).
- Camera are voie sa urce **deasupra** marginii de sus a lumii cu `SAFE` pixeli de ecran. Altfel, cand eroii sunt la marginea de sus a nivelului, camera s-ar opri si ei ar ramane sub banda. In fasia aceea nu exista pictura. `drawWorld` o umple inainte de a desena nivelul, cu culoarea de sus a cerului (`L.skyTop`, o valoare noua pe care `paintLevel` o pune pe nivel: culoarea primului rand de pixeli al picturii).

La boss (`minZoom: 1`, lume de 1920 x 1080, pamantul incepe la y = 480) camera nu se misca. Eroii nu pot urca deasupra lui 480, deci nu ajung sub banda. Acolo nu se schimba nimic.

### Alte texte din lume

Raman in lume, pentru ca sunt legate de un loc si sunt mici: "Acum!" si "Încă nu!" de deasupra paznicului (`drawDuelTop`), numele eroilor, cifra numaratorii. Regula pentru ele: nu se deseneaza niciodata peste dreptunghiul unui erou. `drawDuelTop` muta textul deasupra capului paznicului cu inca 40 de unitati daca un erou e in drum.

### Test: `tests/hud-acoperire.js`

Testul exista deja in depozit (masoara starea de acum si scrie tabelul de mai sus). Dupa schimbare trebuie sa scrie **0%** in toate cele trei coloane, pentru fiecare nivel, in ambele jocuri, in doua feluri de asezare:

1. Amandoi eroii in aceeasi celula, pentru fiecare celula libera.
2. 400 de perechi de celule alese la intamplare pe nivel (eroi departe unul de altul).

Testul citeste din joc `HUD_TOP` si `camTarget` (amandoua se adauga la `window.__game`). Cand le gaseste, socoteste acoperit orice erou care ajunge, cu orice parte a lui, deasupra liniei `HUD_TOP`. Se ruleaza cu `STRICT=1` si se adauga in `tests/toate.sh`.

Plus capturi privite cu ochiul: inceputul unei lupte cu eroii in mijlocul ecranului, eroii la marginea de sus a nivelului 1, eroii la colturi opuse.

---

## S7. Stilul grafic: "diorama cu lumina"

**Cerinta:** "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)."

Ce se poate si ce nu: vezi `23-update-partea-a-doua.md`, sectiunea 4. Aici e reteta.

Unde se aplica: nivelurile 7 - 12, Sala Tronului, eroii si George in tot al doilea joc, toate obiectele noi (porti, tinte, pluta, bolovani). Nivelurile 1 - 6 raman cum sunt (H11).

Regulile care raman din `CLAUDE.md`, regula 4: **fara contururi negre, fara gri, fara negru.** Intunericul e indigo, violet sau maro cald. Cea mai inchisa culoare permisa: `#241A3A`.

### S7.1 O singura lumina

Tot ce e pictat in stilul nou e luminat din **stanga-sus**, cu o lumina calda (`KEY = '#FFE2B0'`). Din dreapta-jos vine o lumina de umplere rece (`FILL = '#8FA8FF'`). Fiecare obiect cu volum are cinci straturi, in ordinea aceasta:

| Strat | Ce este | Cum se picteaza |
|---|---|---|
| 1. Umbra aruncata | Lipeste obiectul de pamant. | Elipsa violet (`SHADOW`), alpha 0.28, mutata cu `(+0.35 x inaltime, +0.12 x inaltime)`, turtita la 0.4. Cu `multiply`. |
| 2. Umbra de contact | Linia inchisa de sub obiect. | Elipsa mica, alpha 0.4, exact sub baza. |
| 3. Forma | Culoarea obiectului, cu volum. | Gradient liniar dinspre stanga-sus (culoarea deschisa cu 22%) spre dreapta-jos (inchisa cu 28% si impinsa spre violet cu 10%). |
| 4. Lumina de margine | Linia subtire care desprinde obiectul de fundal. | Pe partea dreapta-jos a conturului: o linie de 2 - 3 pixeli in `FILL`, alpha 0.55. Pe partea stanga-sus: o linie in `KEY`, alpha 0.7. |
| 5. Stralucire | Doar pe materiale lucioase. | O pata alba mica, alpha 0.6 - 0.9, in treimea de stanga-sus. |

Functie noua in `02-core.js`: `lit(c, path, col, o)`. `path` e o functie care construieste conturul. `o` are `h` (inaltimea, pentru umbra), `gloss` (0 - 1), `mat` (materialul, mai jos). Toti pictorii noi o folosesc, ca lumina sa fie aceeasi peste tot.

### S7.2 Materiale

Fiecare material e o functie care adauga textura peste forma (stratul 3), taiata la contur (`clip`). Texturile sunt mici canvasuri pictate o data (`sprite('mat-...')`) si repetate cu `createPattern`.

| Material | Unde | Textura | Stralucire |
|---|---|---|---|
| `wood` | poduri, pluta, usi, manivele, scuturi | Fibre: linii lungi, usor ondulate, mai inchise cu 12%, si doua-trei noduri. Capete de scandura mai deschise. | 0.15 |
| `metal` | robotii, portile atelierului, tintele, armura lui George | Gradient in benzi (deschis, inchis, deschis), nituri mici cu umbra lor, zgarieturi fine deschise. | 0.8 |
| `fabric` | Killer (tricou, sort), steaguri, panglici, plasa | Tesatura: linii foarte fine in cruce, alpha 0.08. Cusaturi: liniute punctate deschise, la 4 pixeli de margine. | 0.05 |
| `rubber` | manusile lui Killer, mingea, rotile | Neted, cu o banda lata de lumina moale. | 0.4 |
| `scale` | Boon, George | Solzi: semicercuri mici pe randuri decalate, alpha 0.12, mai desi spre spate. | 0.3 |
| `bone` | oasele lui Boon, coltii, ziduri de oase | Aproape neted, cu pori mici si o crapatura. | 0.25 |
| `stone` | bolovani, piedestale, castel | Pete mari neregulate in doua tonuri, crapaturi, muschi in partea de jos. | 0.1 |
| `crystal` | cristalele, Cristalul-Soare, lumini | Fatete: triunghiuri in trei tonuri ale aceleiasi culori. Miezul mai deschis. | 1 |
| `leaf` | frunze uriase, nuferi | O nervura centrala si nervuri laterale, deschise. Margine putin mai inchisa. | 0.35 |
| `lava` | vulcanul | Crusta inchisa (`#5A2A3A`) cu crapaturi luminoase care pulseaza (galben -> portocaliu). | 0, dar lumineaza |
| `water` | lac, sant | Vezi S7.5. | - |

### S7.3 Eroii si George, repictati

Formele si culorile din desenele copiilor **nu se schimba**: corpul rotund turcoaz al lui Boon cu cupola si "muntii", gatul auriu, capul mic albastru; Killer cu capul rotund, ochii mari, zambetul cu dinti, tricoul albastru cu 10, ghetele rosii; George roz, cu capul curcubeu si cornul-coroana. Se schimba doar felul in care sunt pictati:

- Fiecare parte a corpului trece prin `lit()`, cu materialul ei: `scale` pentru dinozauri, `fabric` pentru hainele lui Killer, `rubber` pentru ghete si manusi.
- Killer capata cusaturi vizibile la tricou si numarul 10 "cusut" (o margine punctata in jurul cifrelor).
- Ochii au doua luciri (una mare stanga-sus, una mica dreapta-jos) si o umbra moale sub pleoapa.
- Umbra de pe pamant devine umbra aruncata din S7.1 (acum e o elipsa chiar sub erou).
- Miscare in plus: coada lui Boon si a lui George intarzie fata de corp (un arc cu doua articulatii care urmeaza viteza). Bratele lui Killer se balanseaza la mers. Clipit la 3 - 6 secunde. Respiratie cand stau (scara 1 -> 1.02).
- Turtire si intindere: la pornire, la oprire, la lovitura, la aterizare (exista deja `h.squash`; se foloseste si la pornirea fugii).

Pictorii sunt `drawBoon`, `drawKiller`, `drawGeorge` din `src/055-lupta.js`. Semnaturile raman. Portretele din HUD se refac singure (sunt sprite-uri din aceiasi pictori).

Verificare: foaia de personaje (`docs/capturi/24-personaje.jpg`) refacuta si pusa langa cea veche. Un copil trebuie sa isi recunoasca desenul.

### S7.4 Adancime: trei planuri

| Plan | Ce contine | Cum |
|---|---|---|
| Fundal | Pictura nivelului (`paintLevel`), ca acum, dar pictata cu `lit()` si materiale. Departarea (munti, castelul, vulcanul) e mai stearsa si mai albastra: ceata de aer. | O data, la incarcare. |
| Mijloc | Eroi, inamici, obiecte, decor care reactioneaza. | La fiecare cadru, ca acum, sortate dupa y. |
| Fata | Lucruri mari, foarte aproape de "ochi": frunze uriase, liane, stalpi, lanturi, stalactite. Doar la marginile ecranului. | Un canvas pe nivel, pictat o data (`L.front`), desenat dupa lume, cu o miscare de 1.15 ori mai mare decat camera (paralaxa). Elementele sunt inchise la culoare si usor sterse (pictate la jumatate de rezolutie si marite), ca si cum ar fi nefocalizate. |

**Regula care nu se incalca:** planul din fata nu acopera niciodata un erou. Fiecare element din fata are un dreptunghi. Daca un erou (pe ecran) intra in el, elementul devine transparent (alpha spre 0.15 in 0.2 s). Elementele se pun doar in afara unui dreptunghi central de 1500 x 760. E aceeasi grija ca la S6.

### S7.5 Lumina care se misca

**Harta de lumina.** Un canvas mic, `LM`, de 480 x 270 (un sfert din ecran). La fiecare cadru:

1. Se umple cu culoarea de ambianta a nivelului (`def.ambient`, de exemplu `#B8B0E8` pentru o noapte blanda sau `#3A2E6A` pentru pestera).
2. Cu `globalCompositeOperation = 'lighter'`, se deseneaza cate un gradient rotund pentru fiecare lumina: eroii (raza 150, culoarea lor, slab), cristalele de pe jos (raza 50), obiectele aruncate (raza 70), tortele si felinarele, lava, Cristalul-Soare (raza 360), tintele aprinse.
3. Se deseneaza peste lume, marit la tot ecranul, cu `multiply`.

Cel mult 24 de lumini pe cadru. Daca sunt mai multe, raman cele mai apropiate de mijlocul ecranului. Gradientele rotunde sunt sprite-uri pictate o data pe culoare, desenate cu `drawImage` (nu `createRadialGradient` la fiecare cadru).

Harta de lumina ia locul vinietei de noapte din `makeOverlay` pe nivelurile noi. Textura de hartie ramane.

**Stralucire.** Lucrurile care lumineaza (cristale, lava, tinte aprinse, ochii robotilor, flacari) primesc deasupra un sprite de "halou" desenat cu `lighter`, alpha 0.35 - 0.6.

**Apa** (lac, sant): culoarea de baza, apoi o oglindire stearsa si rasturnata a lucrurilor de pe mal (pictata o data in fundal), apoi doua randuri de valuri subtiri deschise care se misca in sens opus (un pattern desenat de doua ori cu deplasari diferite), apoi sclipiri mici la intamplare.

**Praf in lumina.** 40 de puncte foarte mici care plutesc incet prin tot ecranul (in spatiul ecranului, nu al lumii), alpha 0.15 - 0.4, mai vizibile langa lumini. Pe vulcan sunt scantei care urca. In pestera, spori care coboara.

### S7.6 Miscare si "greutate"

| Efect | Cand | Cum |
|---|---|---|
| Oprire scurta | La o lovitura mare: paznicul lovit, o poarta care se deschide, bolovanul care cade in lava. | Jocul sta 0.06 s (`P.freeze`): `updatePlay` nu ruleaza, desenul da. |
| Apropiere | La aceleasi momente. | Camera se apropie cu 4% in 0.15 s si revine in 0.4 s. |
| Zguduire | Exista (`P.shake`). | Neschimbata. |
| Anticipare | Inaintea oricarui atac al lui George si a oricarei miscari de mecanism. | Obiectul se trage inapoi 0.15 s, apoi porneste. Mecanismele scot un "clic" si o scanteie inainte sa se miste. |
| Urmare | Dupa. | Depaseste tinta cu 8% si revine (o functie noua, `easeBack`, langa `easeOut` in `02-core.js`). Podurile, portile, pluta. |
| Viata | Mereu. | Tot ce e viu respira. Tot ce atarna se leagana. Flacarile, apa si lava nu stau nicio clipa. |

### S7.7 Bugetul de timp

Jocul trebuie sa ramana fluent pe Mac. Masurat acum, fara placa video (SwiftShader): 16 - 24 ms pe cadru la un nivel obisnuit, 22 ms in lupta cu George.

| Ce | Limita |
|---|---|
| `tests/performanta.js` pe un nivel nou | cel mult 20% peste nivelul 6 de acum, masurat in aceeasi rulare |
| Harta de lumina | 1 umplere + cel mult 24 `drawImage` + 1 `drawImage` marit |
| Planul din fata | 1 canvas, cel mult 12 `drawImage` pe cadru |
| Umbrele eroilor din fuga | 3 `drawImage` pe erou |
| Particule | limita de acum din `part` (520) ramane |
| `createRadialGradient`, `createPattern`, `shadowBlur` | **niciodata** in desenul de la fiecare cadru. Doar in pictorii care se pun in `sprite()` sau in pictura nivelului. |
| Memorie | Fiecare nivel are deja o pictura de 3200 x 1800. Planul din fata e 1920 x 1080 la jumatate de rezolutie. Se elibereaza la schimbarea nivelului, ca pictura de acum. |

Daca un Mac mai vechi se chinuie: `CONFIG.look.lights: false` opreste harta de lumina (ramane vinieta veche), `CONFIG.look.front: false` opreste planul din fata.

```js
// ---- The look of levels 7 - 12 (second game)
look: {
  lights: true,          // the moving light map. false = the old night vignette
  front: true,           // big blurred things at the edges of the screen
  motes: 40,             // tiny specks floating in the light
  freeze: 0.06,          // seconds the game holds its breath at a big hit. 0 = off
  maxLights: 24
},
```

### S7.8 Lista de verificare pentru capturi

Dupa sarcina T6, pentru fiecare captura a unui nivel nou, raspunsul trebuie sa fie "da" la toate:

1. Se vede dintr-o privire de unde vine lumina?
2. Fiecare obiect mare are umbra pe pamant, in aceeasi directie?
3. Se poate spune din ce e facut fiecare lucru (lemn, metal, piatra, panza)?
4. Exista ceva in fata si ceva in departare?
5. Eroii sunt cele mai luminoase si mai limpezi lucruri de pe ecran? Se gasesc in mai putin de o secunda?
6. Nimic din planul din fata si nimic din scrisul de sus nu ii acopera?
7. Niciun pixel negru, niciun gri curat? (se verifica si cu un script: niciun pixel cu R, G, B egale si sub 200)
8. Copilul si-ar recunoaste desenul in Boon, Killer si George?
