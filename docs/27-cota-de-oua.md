# 27. Cota de oua si cristale (sarcina T14)

> **Un singur joc (18 noiembrie 2026).** "Bubu și Leo" a fost scos. Tot ce e specificat aici se implementeaza **doar in "Cea mai grea luptă"**. Unde scrie "ambele jocuri", "primul joc", variante `L:` sau teste pentru `bubu`, se citeste: un singur joc, textele lui (varianta `L:`), un singur rand de teste. Nu se mai scrie cod pentru primul joc.

Status: **specificatie, neimplementata.** Vezi `23-update-partea-a-doua.md` pentru cerere, hotarari si planul in 23 de sarcini, si `../prompts/06-prompt-partea-a-doua.md` (T14) pentru promptul gata de lipit.

Cererea proprietarei, 18 noiembrie 2026, cuvant cu cuvant:

> fiecare personaj trebuie sa gaseasca cate un numar de diamante/oua. Daca limita in level e de 10 diamante si un personaj gaseste 20 si celalalt 0 - nu pot trece la nivelul urmator. fiecare jucator poate tine cate 150% diamante si il poate ajuta pe celalalt - sa ii dea cate un diamant apasand pe L1. Fiecare level vine cu un numar de diamante de gasit. de ex level 1:10, level 2: 15... etc. in cotul din dreptul fiecarui personaj sus sa apara poza personaj (chiar desenul copiilor) cate au gasit si cate trebuie sa gaseasca in total. cu verde cand au gasit toate sau mai multe si cu rosu cand nu le-a gasit pe toate. cand un jucator le gaseste pe toate apare un mesaj: Ai gasit toate, acum ajuta-l si pe Boon/Killer si i le poti da cu L1.

In acest capitol, "diamante" sunt **ouale** din primul joc si **cristalele** din al doilea. Sunt aceleasi obiecte din cod (`P.eggs`, `collectEgg`). Textele din joc spun "oua" sau "cristale", ca acum.

---

## C1. Cum e acum (verificat in cod)

- Ouale sunt ale echipei: `Game.team.eggs`, plus `P.levelEggs` pentru nivelul de acum. **Nu exista nicio numaratoare pe erou.**
- Un nivel are 60 de oua: `CONFIG.levelDuration / 60 * CONFIG.eggsPerMinute` (360 / 60 * 10), in `genLevel`, `src/06-level.js`. Trei valuri, plus ouale care cad din copaci scuturati (`spark`). Masurat pe toate cele 6 niveluri, in ambele jocuri: exact 60.
- **Toate** sunt `req: true`: urmatorul val vine, iar cuibul se deschide, abia cand au fost luate toate (`checkWave`). Oul uriaș (nivelul 5) si ouale scoase din paznic cand e lovit sunt `req: false`: premii.
- Un ou se ia in trei locuri, toate prin `collectEgg(e, k)`: cand un erou il atinge (`updatePlay`, rand 475), cand mingea lui Leo/Killer il atinge (rand 447) si cand tropaitul lui Bubu/Boon il trage spre erou (`e.pull`, rand 468). Un singur punct de oprire.
- Cand un erou e lovit scapa un ou din `P.levelEggs` (`hitHero`). Oul poate fi luat inapoi de oricine.
- Nivelul se termina cand amandoi sunt in cuib (`near[0] && near[1]`), dupa ce cuibul e deschis.

## C2. Ce se hotaraste (si de ce)

| Nr | Hotarare | De ce |
|---|---|---|
| C1 | Fiecare nivel are o **cota** `q`: cate oua/cristale trebuie sa gaseasca **fiecare** erou. | Cererea. |
| C2 | Nivelul se termina cand amandoi sunt in cuib **si** fiecare are cel putin `q`. Daca un erou are 20 si celalalt 0, nu se trece. | Cererea. |
| C3 | Un erou poate tine cel mult **150%** din cota (`cap = ceil(1.5 * q)`). Un ou peste limita **ramane pe jos**, pentru prieten. Eroul spune "Plin!" (un balon mic) si oul tremura. | Cererea ("poate tine 150%"). Fara limita, un copil ar putea aduna tot nivelul, iar celalalt n-ar mai avea ce lua. |
| C4 | Un erou ii poate **da** prietenului un ou apasand **L1**. Oul zboara in arc (0.45 s). Tinut apasat, da unul la 0.3 s. | Cererea. |
| C5 | Dai doar daca prietenul e aproape (cel mult 420 de unitati) si are loc (sub limita lui). | Cooperarea trebuie sa se vada: copiii se apropie unul de altul. Daca e prea departe, apare sageata spre prieten, ca la ajutorul cu ○. |
| C6 | Numarul de oua de pe harta se potriveste cu cota: `E = ceil(2.2 * q)`. Intotdeauna `2q <= E <= 2 * cap`. | Daca `E < 2q`, nivelul n-ar putea fi terminat. Daca `E > 2 * cap`, amandoi ar fi plini si ar ramane oua `req` pe jos: nivelul s-ar bloca. Cu `2.2` un erou care aduna tot ce prinde (pana la `cap`) lasa celuilalt prea putin, si trebuie sa-i dea: exact ce cere proprietara. |
| C7 | Cota creste cu 5 pe nivel: **10, 15, 20, 25, 30, 35**, apoi pentru nivelurile 7 - 12 ale celui de-al doilea joc **40, 45, 50, 55, 60, 65**. | Exemplul din cerere ("level 1: 10, level 2: 15... etc."). Intrebarea I15 din `23` o poate schimba. Raspunsul la I16 (oul peste limita ramane pe jos) e C3; la I19, C8. |
| C8 | In numaratoarea pe erou intra doar ouale **din valuri si din copaci** (cele `req`) si cele scapate de un erou lovit. **Nu** intra oul uriaș, ouale scoase din paznic si bonusul curcubeului (al doilea joc): ele raman premii pentru echipa (`Game.team.eggs`), dar nu se numara in cota si nu au limita. | Daca ar intra, un erou ar putea ajunge la limita cu premii, iar ouale `req` ar ramane blocate pe jos. Asa, numarul de oua ale cotei e constant, si nicio blocare nu e posibila (vezi C9). |
| C9 | Un erou lovit scapa un ou **al lui** (din ce a gasit el), nu un ou al echipei. Daca nu are niciunul, nu scapa nimic. | Altfel un erou fara oua ar pierde oua ale prietenului. |
| C10 | Culoarea numaratorii: **verde** cand `gasite >= cota`, **rosu** cand nu. In plus un semn pe care il vad si copiii care nu deosebesc rosul de verde: o bifa pictata cand e gata, iar cand lipsesc oua numarul se clatina usor din cand in cand. | Aproape unul din zece baieti nu distinge rosul de verde. |
| C11 | Cand un erou isi gaseste cota, iar prietenul nu, apare **un mesaj** (vezi C5, "Mesajul"). | Cererea. |
| C12 | **Nimeni nu ramane blocat**: daca amandoi sunt in cuib de `CONFIG.quota.autoGive` secunde (120) si cota unuia lipseste, jocul transfera singur, din 2 in 2 secunde, cate un ou de la cel care are peste cota la cel care lipseste. 0 opreste ajutorul. | Regula 6 din `CLAUDE.md`. Un copil de 6 ani care nu gaseste L1 nu are voie sa ramana in fata unui nivel pe care nu-l poate termina. Intrebarea I17 din `23`. |
| C13 | Cu un singur jucator: cota celui care nu joaca se socoteste **indeplinita** si numaratoarea lui nu se arata. Cel care joaca nu are limita. Nivelul se termina cand el are cel putin `q`. | Regula 6 ("un copil care joaca singur..."). Cu o limita, singurul jucator n-ar putea lua toate ouale `req`. |
| C14 | Daca al doilea jucator intra in joc in mijlocul nivelului, ouale care depasesc limita primului trec la el, pana la limita lui. | Altfel primul ar ramane cu mai mult decat are voie. |
| C15 | Se aplica in **ambele jocuri** si la toate nivelurile cu oua (nu la luptele mari). | Regula 9 ("orice regula de joc e aceeasi in ambele jocuri"). |
| C16 | Portretul din insigna ramane cel pictat de joc dupa desenele copiilor (nu fotografia lor). | Regula 1: fara imagini in fisier. Intrebarea I18 din `23`. |

## C3. Numerele pe nivel

`q` = cota. `cap = ceil(1.5 * q)`. `E = ceil(2.2 * q)` = ouale din valuri si copaci. `min` = cel mai putin pe care il poate avea un erou cand celalalt e la limita (`E - cap`): sub `q` inseamna ca e nevoie de L1.

| Nivel | `q` | `cap` | `E` | `2q` | `2 * cap` | `min` |
|---|---|---|---|---|---|---|
| 1 | 10 | 15 | 22 | 20 | 30 | 7 |
| 2 | 15 | 23 | 33 | 30 | 46 | 10 |
| 3 | 20 | 30 | 44 | 40 | 60 | 14 |
| 4 | 25 | 38 | 55 | 50 | 76 | 17 |
| 5 | 30 | 45 | 66 | 60 | 90 | 21 |
| 6 | 35 | 53 | 77 | 70 | 106 | 24 |
| 7 | 40 | 60 | 88 | 80 | 120 | 28 |
| 8 | 45 | 68 | 99 | 90 | 136 | 31 |
| 9 | 50 | 75 | 110 | 100 | 150 | 35 |
| 10 | 55 | 83 | 121 | 110 | 166 | 38 |
| 11 | 60 | 90 | 132 | 120 | 180 | 42 |
| 12 | 65 | 98 | 143 | 130 | 196 | 45 |

Doua lucruri despre aceste numere:

- **Nivelurile 1 - 6 isi schimba numarul de oua**: nu mai sunt 60 la toate, ci 22, 33, 44, 55, 66, 77. Primul nivel e mai scurt, al saselea ceva mai lung. Timpul tinta ramane cel de acum pentru nivelurile mici: `durata(n) = max(CONFIG.levelDuration, E / CONFIG.eggsPerMinute * 60)`, deci 360 s pana la nivelul 5, 462 s la al 6-lea, 858 s la al 12-lea. `CONFIG.eggsPerMinute` ramane (10) si e folosit de aceasta formula. Soarele din HUD, medalia "soare" si ajutorul din `updatePlay` (rand 461) citesc durata nivelului, nu `CONFIG.levelDuration`.
- Rezultatele deja salvate (oua adunate pe nivel) raman. Totalul din meniu e suma celor mai bune rezultate, deci nu scade; nivelurile rejucate dau mai putin decat inainte. Vezi `13-ecrane-si-meniuri.md`.

## C4. Cum functioneaza, pe larg

### Starea nivelului (`P`)

| Camp | Ce este |
|---|---|
| `P.q` | Cota nivelului: `CONFIG.quota.perLevel[L.idx]`. |
| `P.cap` | `ceil(CONFIG.quota.cap * P.q)`. |
| `P.found[k]` | Cate oua ale cotei are acum eroul `k`. Creste cand ia un ou, scade cand scapa unul sau da unul, creste cand primeste unul. |
| `P.gifts` | Ouale in zbor de la un erou la altul: `{ from, to, t, x0, y0 }`. Cand ajung, `P.found[to]++`. In zbor nu apartin nimanui. |
| `P.quotaMsg[k]` | Mesajul "Ai gasit toate" a fost aratat eroului `k` (o singura data pe nivel). |
| `P.needT` | Cat timp sunt amandoi in cuib si cota cuiva lipseste (pentru C12). |

Functii noi, toate in `src/07-play.js`: `quotaOn()` (`CONFIG.quota.on` si nivelul nu e lupta mare), `quotaOk(k)` (`!joined(k) || P.found[k] >= P.q`), `canTake(e, k)`, `giveEgg(k)`, `updateGifts(dt)`, `quotaState(k)` (pentru HUD si teste: `{ found, q, cap, ok }`).

### Luarea unui ou

Un ou are un camp nou, `goal`: `true` pentru oul din val sau din copac (`makeEgg` il pune egal cu `req`) si pentru oul scapat de un erou lovit (`dropped`, care e `req: false` dar `goal: true`). Oul uriaș, ouale din paznic, bonusul curcubeului: `goal: false`.

`collectEgg(e, k)` primeste doua verificari la inceput:

```js
if (e.goal && quotaOn() && !canTake(e, k)) { e.pull = null; capHint(k, e); return; }   // Plin: oul ramane pe jos
...
if (e.goal) P.found[k]++;                                       // si numai atunci
```

`canTake(e, k)`: `!bothJoined() || P.found[k] < P.cap`. Cu un singur jucator limita nu exista (C13).

`capHint(k, e)`: o data la 1.2 s, un balon "Plin!" deasupra eroului, `Snd.play('no', 0, k)` si oul face un salt mic. **Tropaitul** (`e.pull`) ocoleste eroul plin: la fiecare cadru oul tras e scos din tragere daca eroul tras e plin. Mingea lui Leo sau Killer trece peste ou fara sa-l ia.

Se pastreaza: `P.combo`, sunetul, particulele, `checkWave()` pentru oul luat. Cand oul ramane pe jos, nu se numara nimic.

### Dat cu L1

`giveEgg(k)` se cheama din `updateHero` cand `Input.slots[k].gP` (L1, frontul apasarii) sau, tinut apasat, la fiecare `CONFIG.quota.giveEvery` (0.3 s):

1. Prietenul trebuie sa joace (`joined`). Daca nu, nu se intampla nimic.
2. Eroul nu e `down` si nu e ametit. Prietenul poate fi `down`: ii poti da si cand asteapta ajutor.
3. `P.found[k] >= 1`. Altfel: `Snd.play('no')`, numarul eroului se clatina.
4. `P.found[1 - k] + (oua in zbor catre el) < P.cap`. Altfel: balonul "Plin!" deasupra **prietenului**.
5. `dist(h, friend) <= CONFIG.quota.giveRange` (420). Altfel: `reachHint`-ul de la ajutor, si sageata spre prieten (`drawGuides`) cat tii apasat.
6. Daca da: `P.found[k]--`, se adauga in `P.gifts`. Un ou pictat (acelasi desen ca in joc) zboara in arc de la erou la prieten in 0.45 s. `Snd.play('give', 0, k)` (doua note de marimba, calde) la plecare, `Snd.play('egg', 0, 1 - k)` la sosire. `Input.rumble(k, 0.1, 0.3, 60)` si `Input.rumble(1 - k, 0, 0.4, 80)`. Cel care da spune `together`, cel care primeste `thanks` (cuvinte care exista deja in `BABBLE`).

Nimic nu se pierde: oul in zbor ajunge chiar daca eroul care a dat e lovit pe drum.

Se poate da si **sub** cota proprie: nu se interzice nimic. Numaratoarea lui se face rosie si copilul vede de ce.

### Cand un erou e lovit (`hitHero`)

Locul de azi (`if (P.levelEggs > 0) { ... }`) devine:

```js
if (P.found[h.k] > 0) { P.found[h.k]--; Game.team.eggs--; P.levelEggs--; /* oul scapat: goal: true, req: false, dropped: true */ }
```

Daca eroul are `found` 0 dar echipa are premii (`P.levelEggs > 0`), nu mai scapa nimic. Oul scapat se numara pentru cine il ia.

### Nivelul se termina

In `updatePlay`, conditia de azi (`ready && ((near[0] && near[1]) || ... solo)`) primeste un factor in plus:

```js
const quotaMet = !quotaOn() || (quotaOk(0) && quotaOk(1));
if (ready && quotaMet && (...)) { P.done = true; ... }
```

Cat timp amandoi sunt in cuib si `quotaMet` e fals, banda de sus arata bannerul `need` ("Leo mai are nevoie de 3 oua!") si `P.needT` creste (pentru C12). Cuibul ramane deschis. Ouale care ramasesera pe jos pot fi luate in continuare.

`P.nestOpenT > 14` (cele 14 secunde dupa care nu se mai asteapta ouale ramase) ramane, dar nu mai e de ajuns singur.

### Al doilea jucator intra in mijlocul nivelului (C14)

In `Input`, cand `slots[k].joined` devine adevarat in joc: pentru prietenul care joaca deja, `P.found[friend] - P.cap` ouale in plus (daca sunt) se muta la cel care a intrat, pana la limita lui, cu acelasi zbor ca la dat.

## C5. Ce se vede

### Insigna din colt (`drawBadge`)

Insigna de acum (300 x 88, `src/08-draw.js`) devine **300 x 108** (de la y = 16 la 124, adica tot in banda de 132, cum cere `24-sisteme-noi.md`, S6). `hud-acoperire.js` ramane cu 0%.

| Element | Unde in insigna | Cum |
|---|---|---|
| Portretul eroului (cel pictat de acum, dupa desenele copiilor) | stanga, 80 x 80 | Cum e. Un cerc mic al culorii eroului in spate. |
| Numele | sus, marimea 30 | Cum e, dar mai mic. |
| Dificultatea (`Ușor`, `Normal`, `Greu`) | sus, dreapta, marimea 18 | Mutata din sub nume. |
| **Un ou (sau un cristal) mic, apoi `gasite / cota`** | jos, marimea 46, de la x + 100 | `7 / 10`. Verde cand `gasite >= cota`, rosu cand nu. |
| Bifa pictata | dupa numar | Doar cand e gata. Un ✓ rotund, verde, cu o urma de acuarela. |
| Cand lipsesc oua | numarul | Se clatina usor (1 grad) o data la 3 secunde, ca sa se vada si fara culoare. |
| Cand a dat sau a primit un ou | numarul | Creste la 1.25 si revine in 0.2 s, in culoarea cu care ramane. |
| Cand e `down` | insigna | Ca acum (portretul ametit). |
| Daca eroul nu joaca | insigna | Cum e acum ("Apasă ✕" sau tasta). Fara numaratoare. |

Culorile (fara gri, fara negru, ca in `15-culori.md`): verde `#3E9A5A`, rosu `#D6503F`. Se verifica sa aiba contrast cel putin 3 : 1 pe cartonasul crem `#FFF3DC`. Fiecare culoare are o varianta mai inchisa pentru contur (`shade(col, -0.35)`), ca numarul sa se citeasca si pe fundalul de noapte.

Cartonasul din mijloc ramane cum e (totalul echipei, stelele, soarele). "× 12" din stanga barei de progres ramane: oua ramase in val.

La luptele mari insigna nu arata numaratoarea (nu exista cota).

### Mesajul "Ai gasit toate"

Prima data cand `P.found[k]` ajunge la `P.q`, daca `P.found[1 - k] < P.q` si prietenul joaca, apare in cardul din mijloc (ca orice banner, deci sub regulile din S6) timp de 6 secunde bannerul `quotaDone`:

- La stanga, portretul eroului care a terminat (mic). Randul de text, jos: o sageata animata de la insigna lui spre insigna prietenului, cu `iconL1` (pictograma noua, ca `iconX`/`iconSq`: disc crem cu margine lila, litera "L1") care pulseaza. Copilul de 6 ani intelege din imagine.
- Textul (ambele limbi, in `STR`, cu varianta `L:` pentru al doilea joc):

| Cheie | Romana | Engleza |
|---|---|---|
| `quota.done` | "Ai găsit toate ouăle! Acum ajută-l și pe {0}: poți să-i dai cu {1}." | "You found them all! Now help {0}: you can give them with {1}." |
| `L:quota.done` | "Ai găsit toate cristalele! Acum ajută-l și pe {0}: poți să-i dai cu {1}." | "You found all the crystals! Now help {0}: you can give them with {1}." |

`{0}` este numele prietenului (`Leo`, `Bubu`, `Boon`, `Killer`). `{1}` este `L1` pe controller si numele tastei pe tastatura (ca `pressLabel`). Un text, doua nume si un buton: cu `iconL1` desenat langa, textul se scurteaza daca e prea lat (se foloseste `wrapLines`, doua randuri la marimea 30).

Mesajul apare **o singura data pe nivel pentru fiecare erou** (`P.quotaMsg[k]`). Daca ambii isi gasesc cota in acelasi timp, nu apare nimic: bannerul `quotaBoth` ("Amândoi ați găsit toate! La cuib!", `L:` pentru al doilea joc) tine locul si arata sageata spre cuib. Cand cuibul e deja deschis, "La cuib!" ramane.

### Alte bannere si baloane

| Cheie | Cand | Romana | Engleza |
|---|---|---|---|
| `quota.need` | amandoi in cuib si cota cuiva lipseste | "{0} mai are nevoie de {1}!" cu `{1}` = "un ou" / "{n} ouă" (`L:`: "un cristal" / "{n} cristale") | "{0} still needs {1}!" |
| `quota.full` | balon scurt deasupra eroului plin | "Plin!" | "Full!" |
| `quota.far` | L1 cand prietenul e prea departe | "Apropie-te de {0}!" | "Come closer to {0}!" |
| `quota.auto` | cand jocul transfera singur (C12) | "{0} îți trimite un ou." (`L:` cristal) | "{0} sends you one." |

### Sageata ajutatoare (`guideTarget`)

Un erou **plin** nu mai e indrumat spre oua. Daca prietenul lui nu are cota, sageata il arata pe prieten, cu `iconL1` in balonul de la capat (`kind: 'give'`). Altfel arata cuibul. Un erou care a terminat cota si vede oua pe jos continua sa fie indrumat spre ele pana la limita.

### Sfarsitul nivelului

Ecranul de sfarsit de nivel (`drawLevelEnd`) arata, sub medalii, cei doi eroi cu ce au gasit: portret, `gasite / cota`, bifa. Numai citit, nimic de apasat.

## C6. Tastele

| Buton | Indice | Camp | Tastatura jucator 1 | Tastatura jucator 2 |
|---|---|---|---|---|
| L1 | 4 | `g`, `gP` in `Input.slots[k]` | `KeyR` | `Period` |

Se adauga langa cele din `24-sisteme-noi.md`, S1. Campul `g` intra in `KEY_FIELDS`; pagina "Alege tastele" primeste inca un rand ("Dă un ou prietenului (butonul L1)"). Se verifica cu `RESERVED` ca tastele noi nu sunt rezervate. O salvare veche fara `g` ramane cu valoarea din `CONFIG`. Testerul de butoane din Setari arata deja orice buton; se verifica doar ca L1 are loc desenat.

Pana la T2: daca `Input.slots[k].gP` nu exista inca, T14 il adauga el (sapte randuri in `mk()` si `poll`), dar numai pentru `g`.

## C7. `CONFIG.quota` (in `src/01-config.js`)

```js
quota: {
  on: true,                                              // false = jocul de dinainte (60 de oua, nicio cota)
  perLevel: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],   // cate oua/cristale trebuie sa gaseasca FIECARE erou, la nivelul 1 .. 12
  cap: 1.5,                                              // cat poate tine un erou, din cota (1.5 = 150%)
  extra: 2.2,                                            // ouale de pe harta = cota * extra (intre 2 si 2 * cap)
  giveRange: 420, giveEvery: 0.3, flyTime: 0.45,         // dat cu L1: cat de aproape, cat de repede, cat zboara oul
  autoGive: 120,                                         // dupa cate secunde in cuib jocul transfera singur (0 = niciodata)
  autoEvery: 2                                           // la cate secunde un transfer
}
```

`genLevel` citeste `perLevel`, `extra` si `cap`. Daca `extra` nu e intre `2` si `2 * cap` sau daca `perLevel` nu are valoare pentru un nivel, jocul scrie o eroare la pornire (`console.error`) si foloseste 60 de oua, ca inainte.

## C8. De facut in cod

1. `src/01-config.js`: `quota`, cu comentarii. `CONFIG.levelDuration` ramane, dar nu mai e citit direct (vezi mai jos).
2. `src/06-level.js`, `genLevel`: `total = ceil(extra * q)` in locul `levelDuration / 60 * eggsPerMinute`. Valurile se impart ca acum (`quota = round(total / NW)` pe val, minus ce dau copacii). `L.totalEggs` ramane suma reala. Dupa generare: daca `L.totalEggs` nu e intre `2q` si `2 * cap`, `buildLevel` incearca urmatoarea samanta (face deja pana la 80). Functie noua `levelDurationOf(L)`.
3. `src/07-play.js`: starea din C4, `canTake`, `giveEgg`, `updateGifts`, `quotaState`, schimbarile din `collectEgg`, `hitHero`, `updateHero` (citeste `s.gP`), conditia de sfarsit, ajutorul automat (C12), `capHint`. Tropaitul si mingea ocolesc eroul plin. Ouale scapate primesc `goal: true`.
4. `src/04-input.js`: `g`, `gP` (si `kb.g`). `src/01-config.js`: `keys[k].g`. `src/09-screens.js`: `KEY_FIELDS`, randul nou in pagina tastelor, `drawLevelEnd` (cei doi eroi cu cota).
5. `src/08-draw.js`: `drawBadge` (300 x 108), bifa, `iconL1` (in `02-core.js`, langa `iconSq`), bannerele `quotaDone`, `quotaBoth`, `need` in `drawMidCard`, `capHint` (baloanele), `drawGuides`/`guideTarget` (`kind: 'give'`), ouale in zbor (`P.gifts`). `L1` se deseneaza cu `iconL1`; textul are `{1}` inlocuit inainte de desen.
6. `src/015-lang.js`: textele din C5, ambele limbi, cu `L:` pentru al doilea joc.
7. `src/03-audio.js`: `give` (doua note de marimba, ca `drop`, dar urcand).
8. `src/10-main.js`: `quotaState`, `giveEgg` in `window.__game`.
9. Documentatia: `03-config.md`, `07-control.md` (L1), `09-niveluri.md` (numarul de oua), `10-gameplay.md`, `12-desen-si-hud.md` (insigna), `13-ecrane-si-meniuri.md` (sfarsit de nivel, pagina tastelor), `16-decizii.md` (C1 - C16 cu motivul), `17-testare.md`, `19-limitari.md`, `00-cuprins.md`, `README.md`, `CLAUDE.md` (regulile 8 si 10, cum scrie in `23`, sectiunea 6). Capitolul 27 devine istoric.

## C9. Cazuri de margine

- **Eroi la limita amandoi, oua `req` pe jos**: nu se poate (C6 si C8: `E <= 2 * cap`, iar cota numara doar ouale `goal`). Testul verifica la fiecare nivel.
- **Un erou lovit in timp ce da**: oul in zbor ajunge. Daca eroul care da e lovit, i se scade doar oul dat; cel scapat e altul.
- **Oul scapat cand ambii sunt la limita**: ramane pe jos (`req: false`). Nu blocheaza nimic. Cine scade sub limita il poate lua.
- **Eroul `down` primeste un ou**: da, se poate. Pastreaza starea `down` pana il ajuta prietenul cu ○.
- **Prietenul se deconecteaza** (controllerul): se tine `P.found`, iar cota lui se socoteste indeplinita pana revine (ca la C13), fara a se pierde oua.
- **Reincepere dupa cele 10 secunde** (T4): `P` se reface, deci `P.found` revine la 0 si ouale la locurile lor.
- **Nivelul 5 (oul uriaș)**: nu intra in cota si nu are limita (C8).
- **Al doilea joc, curcubeul**: un cristal din fiecare culoare da cristale-bonus echipei, nu intra in cota (C8). Culoarea nu conteaza pentru cota.
- **Luptele mari** (Ciori, George, Sala Tronului): nu au cota. Nu se arata numaratoarea.
- **Salvare veche**: nu se schimba nimic in salvare. Cotele nu se salveaza.

## C10. Teste (`tests/cota.js`, ambele jocuri)

| Nr | Ce verifica |
|---|---|
| 1 | Pentru fiecare nivel (1 - 6, si pana la 12 cand exista): `perLevel` exista, `2q <= L.totalEggs <= 2 * cap`, in 10 semințe diferite. |
| 2 | Exemplul din cerere: cota 10, un erou aduna oua pana la limita (15), celalalt are 7 dupa ce s-au luat toate. Ambii in cuib: `P.done` ramane fals, bannerul `need` apare cu numele si numarul corecte. |
| 3 | Un ou peste limita ramane pe jos (`P.eggs`), `P.found` nu creste, balonul "Plin!" apare, tropaitul nu il trage la eroul plin, mingea nu il ia. Celalalt erou il ia. |
| 4 | L1 (butonul 4, cu controller fals) da un ou: `P.found` al celui care da scade, al celuilalt creste dupa 0.45 s. Tinut apasat da mai multe, oprindu-se la limita prietenului. Cu tastatura, la fel, cu tasta noua. |
| 5 | L1 din prea departe nu da nimic si porneste sageata spre prieten. Fara oua, nu da nimic si numarul se clatina. |
| 6 | Dupa ce `P.found` e 10 / 10 pentru amandoi, nivelul se termina in cel mult 4 secunde de la intrarea ambilor in cuib. |
| 7 | Culorile: numarul e verde (`#3E9A5A` pe pixelii cifrelor) cand `found >= q`, rosu cand nu. Bifa apare doar cand e gata. Citit din captura, nu din cod. |
| 8 | Mesajul "Ai găsit toate" apare o singura data, numai cand prietenul nu are cota, cu numele prietenului, in romana si engleza, in ambele jocuri (Boon / Killer si Leo / Bubu). Nu apare cand amandoi termina deodata (apare `quotaBoth`). Contine `L1` pe controller si numele tastei pe tastatura. |
| 9 | Un singur jucator: nu exista limita, nu se arata numaratoarea celuilalt, nivelul se termina cand el are `q`. |
| 10 | Un erou lovit scapa un ou al lui (`P.found` scade cu 1). Fara oua nu scapa nimic. Oul scapat, luat de prieten, creste numaratoarea prietenului. |
| 11 | Al doilea jucator intra in mijlocul nivelului: ouale peste limita ale primului trec la el. |
| 12 | Oul uriaș, ouale din paznic si bonusul curcubeului cresc `Game.team.eggs`, nu `P.found`. |
| 13 | Ajutorul automat: cu `autoGive` pus la 3, dupa 3 secunde in cuib cu o cota care lipseste se transfera oua pana se indeplineste, si apare `quota.auto`. Cu `autoGive` 0, nu. |
| 14 | `hud-acoperire.js` cu `STRICT=1`: insigna mai inalta (108) nu acopera niciun erou. |
| 15 | Botii (`joc-complet-bot.js`, `nivele-bot-mers.js`) termina tot jocul. Ei dau cu `__game.giveEgg` cand e nevoie (ajutor nou in `tests/common.js`: `balanseaza()`). Timpul per nivel, masurat si trecut in `17-testare.md`. |
| 16 | `tests/toate.sh` trece intreg pentru ambele jocuri, cu `errors 0`. |

Ca la toate sarcinile: verifica o data ca fiecare test poate sa pice (strica regula, vezi `NEREUSIT`, pune la loc).

## C11. Ce nu se poate verifica fara copii

- Daca limita de 150% si numarul de oua pe nivel fac nivelurile prea scurte (primul: 22 de oua) sau prea lungi (ultimul: 143).
- Daca un copil de 6 ani gaseste singur L1, sau asteapta cele 120 de secunde pana la ajutorul automat.
- Daca ajutorul automat strica ideea (copiii invata sa dea) sau e singura cale prin care termina.
- Daca verde / rosu + bifa + clatinatul se citesc destul de bine pe televizorul familiei, in special pentru un copil care nu deosebeste culorile.
- Cum e vazut portretul mic (80 x 80) fata de cel de acum (68 x 68).
- Daca "Plin!" e inteles ca "dai oul celuilalt" si nu ca "ceva nu merge".
