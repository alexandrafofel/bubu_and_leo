# 07. Control (`src/04-input.js`)

`Input` citeste controllerele si tastatura o data pe cadru (`poll(dt)`) si pune rezultatul in doua locuri:

- `Input.slots[0]` si `Input.slots[1]`: ce face fiecare erou (0 = Bubu, 1 = Leo).
- `Input.menu`: navigarea in meniuri, de la oricine.

## Controllerele

Cererea: Gamepad API, "standard mapping". Cu aceasta mapare, butoanele DualShock 4 au mereu aceleasi numere in Chrome:

| Buton | Index | Ce face in joc |
|---|---|---|
| ✕ | 0 | Prima putere (`a`, `aP`, `aR`), OK in meniuri, "Gata!" |
| ○ | 1 | **Ajuta prietenul lovit** (`h`, `hP`). In meniuri: inapoi (`back`). |
| □ | 2 | **A doua putere** (`c`, `cP`, `cR`). Se citeste de la T2; puterea insasi vine cu T3. |
| △ | 3 | Schimba personajele pe ecranul de start |
| L3 (apasarea stick-ului stang) | 10 | **Fuga** (`run`, `runP`). Vezi `10-gameplay.md`, "Fuga". |
| L1 | 4 | **Da un ou prietenului** (`g`, `gP`). Din T14.3 se aprinde la apasare; ce face e T14.4. |
| OPTIONS | 9 | Pauza, deschide sau inchide Setari |
| D-pad sus, jos, stanga, dreapta | 12, 13, 14, 15 | Mers, navigare |
| Stick stanga | axele 0 si 1 | Mers, navigare |

### Cum un controller devine al unui erou

Chrome nu arata un controller pana nu e apasat un buton pe el. De aceea ecranul de start cere "Apasă ✕".

Cand un controller neatribuit apasa ✕ (o apasare noua, nu tinut apasat):

- Daca meniul "Conectează controllerul" asteapta un anumit erou (`Input.bindTo`), controllerul devine al acelui erou.
- Altfel, daca atribuirea automata e pornita (`Input.autoJoin`, oprita cat timp e deschis meniul Setari), devine al primului erou liber. `freeSlot()` cauta intai un erou care vrea controller (`Opt.ctrl` = `'pad'`), in ordinea jucatorilor (cu `Opt.swap`, jucatorul 1 e Leo).

Apasarea care a atribuit controllerul nu e folosita si ca putere sau ca OK (`s._p.a` si `menu._p.ok` sunt puse ca si cum butonul era deja apasat).

### Stick-ul si zona moarta

```js
const m = Math.hypot(ax, ay), dz = Math.max(0.25, CONFIG.deadzone);
if (m > dz) { const f = Math.min(1, (m - dz) / (1 - dz)) / m; x = ax * f; y = ay * f; }
```

Zona moarta e circulara, nu pe fiecare axa. Sub 0.25 stick-ul e considerat in centru. Peste, miscarea e rescalata sa porneasca lin de la 0, nu sa sara direct la 0.25. Asa un copil care tine stick-ul usor inclinat merge incet, nu deloc sau brusc. D-pad-ul suprascrie stick-ul cu valori pline.

### Controller deconectat

Daca un controller atribuit dispare, `s.lost` devine adevarat. `10-main.js` pune jocul pe pauza si scrie "Controllerul lui Bubu s-a deconectat. Apasă ✕ pe el." Orice controller nou care apasa ✕ ia locul liber. Pauza se inchide cand controllerul revine si se apasa Continuă (sau OPTIONS).

## Tastatura

Fiecare erou are tastele lui in `Opt.keys[k]` (`up`, `down`, `left`, `right`, `a`, `b`, `c`, `r`). `a` = prima putere (Spatiu, Enter), `b` = ajuta prietenul (E, Shift dreapta), `c` = a doua putere (Q, Slash), `r` = fuga (Shift stanga, Alt dreapta). Numele campurilor nu s-au schimbat cand butoanele s-au mutat, ca o salvare veche sa ramana buna: `b` e tot ajutorul, chiar daca acum e pe ○. Se folosesc doar daca `Opt.ctrl[k]` este `'kb'` si eroul nu are controller.

- Un jucator fara controller poate intra apasand tasta lui de putere pe ecranul de start (`Input.kbJoin`). Atunci `Opt.ctrl` devine `'kb'` pentru el. Pe ecranul "Alege jocul" `kbJoin` e oprit: acolo Enter si Spatiu doar aleg jocul.
- Tastele folosesc `KeyboardEvent.code` (pozitia fizica a tastei), nu litera. Merg la fel pe tastatura romana, engleza sau franceza.
- Tastele rezervate (`RESERVED`) nu pot fi alese pentru un erou: Escape, P (pauza), F (ecran complet), Backspace (inapoi), Tab, Cmd.

### Apasari scurte

O tasta apasata si eliberata intre doua cadre s-ar pierde. `tap` tine minte orice apasare pana la sfarsitul cadrului urmator. Problema s-a vazut in teste: apasari scurte simulate nu erau inregistrate.

### Alegerea unei taste noi

`Input.capture(f)`: urmatoarea tasta apasata nu ajunge in joc. E trimisa functiei `f`. Tasta ramane "muta" (`mute`) pana e eliberata, ca sa nu declanseze altceva imediat.

## Navigarea in meniuri: `Input.menu`

Meniurile asculta pe toata lumea: orice controller, sagetile, Enter, Spatiu, Backspace si tastele fiecarui jucator de tastatura.

| Camp | Adevarat cand |
|---|---|
| `up`, `down` | o apasare noua sus sau jos |
| `left`, `right` | o apasare noua, apoi repetat la fiecare 0.14 s dupa 0.4 s cat e tinut (pentru volume) |
| `ok` | ✕, Enter, Spatiu sau tasta de putere a unui jucator |
| `back` | ○ sau Backspace |
| `pause` | OPTIONS, P sau Escape |

Stick-ul conteaza pentru navigare doar peste 0.6, ca o atingere usoara sa nu sara peste randuri.

## Ce primeste fiecare erou: `Input.slots[k]`

| Camp | Inseamna |
|---|---|
| `pad` | Numarul controllerului atribuit sau `null`. |
| `joined` | Eroul e jucat de cineva (are controller sau a folosit tastatura). Un erou nejucat merge singur dupa prieten. |
| `x`, `y` | Directia de mers, intre -1 si 1, lungime maximum 1. |
| `a` | ✕ e tinut apasat. |
| `aP`, `aR` | ✕ tocmai a fost apasat, tocmai a fost eliberat. |
| `h`, `hP` | ○ (sau tasta `b`): tinut apasat, tocmai apasat. Ajuta prietenul. |
| `c`, `cP`, `cR` | □ (sau tasta `c`): a doua putere. |
| `run`, `runP` | L3 (sau tasta `r`): fuga. |
| `g`, `gP` | L1 (sau tasta `g`): da un ou prietenului (din T14.3, actiunea din T14.4). |
| `start`, `tri`, `back` | OPTIONS, △, ○ tocmai apasate. `back` e acelasi buton cu `hP`: in meniuri inseamna "inapoi", in joc "ajuta prietenul". Nu se ciocnesc, pentru ca meniurile nu sunt deschise in timpul jocului. |
| `up`, `down`, `left`, `right` | Apasari noi (stanga si dreapta se repeta). |
| `lost` | Controllerul tocmai a disparut. |

## Vibratii: `Input.rumble(k, tare, slab, ms, force)`

Foloseste `vibrationActuator.playEffect('dual-rumble', ...)`. `tare` este motorul mare, `slab` cel mic, intre 0 si 1. Intoarce `false` daca controllerul nu poate vibra. Nu face nimic daca vibratiile sunt oprite din Setari, cu exceptia lui `force` (butonul "Încearcă vibrația").

| Cand | Tare | Slab | Durata |
|---|---|---|---|
| Ou luat | 0 | 0.4 | 45 ms (maximum o data la 0.12 s) |
| Stea | 0.3 | 0.7 | 160 ms |
| Tropait | 0.85 | 0.4 | 170 ms |
| Sut | 0.3 la 0.8 | 0.5 | 70 la 160 ms, dupa putere |
| Lovit | 0.9 | 0.6 | 280 ms |
| Oul urias | 0.6 | 0.8 | 400 ms, ambii |
| Paznic lovit | 0.6 | 0.8 | 260 ms, ambii |
| Gol in cuibul lui Ciori | 0.7 | 0.9 | 350 ms, ambii |
| Nivel terminat | 0.4 | 0.8 | 500 ms, ambii |

De ce: vibratia mica la oua confirma ca s-a luat ceva, fara sa obosesca. Cea mare e pentru momente rare.

## Alte functii

| Functie | Ce face |
|---|---|
| `setCtrl(k, tip)` | Din Setari: eroul `k` joaca cu `'pad'` sau `'kb'`. |
| `unbind(k)` | Elibereaza controllerul eroului (butonul "Alt controller"). |
| `swap()` | Cand jucatorii schimba personajele, controllerele merg cu jucatorii. |
| `pads()` | Lista controllerelor din Chrome. |
| `padCount()` | Cate controllere vede Chrome acum. |
| `any(f)` | Adevarat daca `f` e adevarat pentru oricare erou. |
| `muteHeld()` | Toate tastele tinute acum sunt ignorate pana la eliberare. |

## Update 14 noiembrie 2026

- `Input.slots[k].bP`: adevarat in cadrul in care eroul `k` a apasat □ (sau tasta lui `b`). Citit de `tryRescue` in `07-play.js`.
- `Input.muteHeld()`: tastele si butoanele tinute acum sunt ignorate pana sunt eliberate. Folosit cand se trece de pe "Alege jocul" pe ecranul de start, ca apasarea care a ales jocul sa nu insemne si "intru in joc".
- `Input.kbJoin` este `false` pe ecranul "Alege jocul" si `true` pe ecranul de start. Motivul: parintele alege jocul cu Enter. Daca Enter l-ar fi si bagat in joc pe al doilea erou, cu tastatura, al doilea controller n-ar mai fi avut loc.
- Controllerele intra in joc ca inainte, de pe orice ecran: primul care apasa ✕ e jucatorul 1.
- In testerul din Setari, □ se aprinde ca inainte. De la T2, capul stick-ului stang se face mai inchis cand e apasat (L3).

## Update 18 noiembrie 2026

`Input.kbJoin` (un jucator fara controller intra in joc apasand tasta lui de putere) este adevarat **doar pe ecranul de start**. E fals pe "Alege jocul", pe ecranul Capitole si de la inceputul fiecarui nivel. Inainte era adevarat si in timpul jocului, deci Enter apasat in meniul de pauza il baga pe al doilea erou in joc. Motivul complet e in `13-ecrane-si-meniuri.md`.

Pe ecranul Capitole navigarea foloseste `Input.menu`: orice controller (D-pad sau stick), sagetile si tastele de mers ale jucatorilor.

## Update 18 noiembrie 2026 (T2): butoanele noi

Cererea proprietarei: "pe x apasa pentru puterea lor initiala, pe O sa se salveze reciproc si pe patrat sa fie cea de-a doua putere", plus L3 pentru fuga.

| Buton | Inainte | Acum | Campul |
|---|---|---|---|
| ✕ | prima putere | neschimbat | `a`, `aP`, `aR` |
| ○ | doar "inapoi" in meniuri | ajuta prietenul | `h`, `hP` (si `back` in meniuri) |
| □ | ajuta prietenul | a doua putere (vine cu T3) | `c`, `cP`, `cR` |
| L3 | nefolosit | fuga | `run`, `runP` |
| L1 | nefolosit | da un ou prietenului | `g`, `gP` |

- Campurile vechi `b` si `bP` din `Input.slots[k]` nu mai exista. Tot codul care citea `s.bP` citeste acum `s.hP`.
- Tastele noi: `c` (Q si Slash) si `r` (Shift stanga si Alt dreapta). Pagina "Alege tastele" are acum 8 randuri. Nicio tasta noua nu e in `RESERVED`.
- O salvare veche, fara `c` si `r`, se incarca si primeste tastele din `CONFIG` (`Save.apply` copiaza doar campurile din `KEY_FIELDS`).
- Textele care spuneau "apasă pe pătrat" spun acum "apasă pe cerc". Cheile noi: `key.c`, `key.r`.
- Testul: `tests/control-nou.js`.

## Update 22 noiembrie 2026: ce face L1 (T14.3, T14.10)

L1 (butonul 4 al unui DualShock 4; tastatura: `R` pentru primul erou, `.` pentru al doilea, reglabile in "Alege tastele") da un diamant prietenului. Campurile din `Input.slots[k]` sunt `g` (tinut) si `gP` (abia apasat), ca la celelalte butoane. `KEY_FIELDS` include `'g'`, deci tasta se salveaza cu restul.

Apasarea nu face nimic in trei cazuri, fiecare cu semnul lui: fara diamante numarul din insigna se scutura, prea departe apare balonul "Apropie-te de {0}!", si prietenul nu joaca. Raza e `CONFIG.quota.giveRange` (420) si nu se poate da mai des de `giveEvery` (0.3 s). Detaliile: `10-gameplay.md` si `27-cota-de-oua.md`.
