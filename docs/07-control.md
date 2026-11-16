# 07. Control (`src/04-input.js`)

`Input` citeste controllerele si tastatura o data pe cadru (`poll(dt)`) si pune rezultatul in doua locuri:

- `Input.slots[0]` si `Input.slots[1]`: ce face fiecare erou (0 = Bubu, 1 = Leo).
- `Input.menu`: navigarea in meniuri, de la oricine.

## Controllerele

Cererea: Gamepad API, "standard mapping". Cu aceasta mapare, butoanele DualShock 4 au mereu aceleasi numere in Chrome:

| Buton | Index | Ce face in joc |
|---|---|---|
| ✕ | 0 | Puterea, OK in meniuri, "Gata!" |
| ○ | 1 | Inapoi in meniuri. Pe ecranul de start: inapoi la "Alege jocul". |
| □ | 2 | Ajuta prietenul lovit (`bP`). De la update-ul din 14 noiembrie. |
| △ | 3 | Schimba personajele pe ecranul de start |
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

Fiecare erou are tastele lui in `Opt.keys[k]` (`up`, `down`, `left`, `right`, `a`, `b`). `b` = ajuta prietenul: E pentru primul jucator, Shift dreapta pentru al doilea. Se folosesc doar daca `Opt.ctrl[k]` este `'kb'` si eroul nu are controller.

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
| `start`, `tri`, `back` | OPTIONS, △, ○ tocmai apasate. |
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
- In testerul din Setari, □ se aprinde ca inainte.
