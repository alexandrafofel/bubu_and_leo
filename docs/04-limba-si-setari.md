# 04. Limba si setari (`src/015-lang.js`)

Fisierul are patru lucruri: `Opt` (setarile alese), `playerOf`, `STR` (toate textele) si functiile `T`, `lvlName`, `lvlIntro`, `eggWord`, `starWord`, `keyName`.

## `Opt`: ce a ales familia

`CONFIG` are valorile de pornire si nu se schimba in timpul jocului. `Opt` are ce s-a ales din meniul Setari. `Opt` se salveaza in `localStorage` si se citeste la pornire (`Save.apply()` din `09-screens.js`).

| Camp | Valoarea de inceput | Ce inseamna |
|---|---|---|
| `lang` | `CONFIG.language` | `'ro'` sau `'en'`. |
| `fullscreen` | `true` | Daca jocul intra in ecran complet la primul clic. Se actualizeaza singur cand ecranul complet porneste sau se opreste (evenimentul `fullscreenchange`). |
| `vibration` | `CONFIG.vibration` | Vibratiile controllerelor. |
| `swap` | `false` | `false`: jucatorul 1 e Bubu. `true`: jucatorul 1 e Leo. |
| `ctrl` | `['pad', 'pad']` | Pentru fiecare erou: `'pad'` (controller) sau `'kb'` (tastatura). |
| `keys` | copie din `CONFIG.keys` | Tastele fiecarui erou: `up`, `down`, `left`, `right`, `a` (puterea). |
| `guide` | copie din `CONFIG.guideArrow` | Sageata ajutatoare pentru fiecare erou. |
| `sink` | `['', '']` | Numele difuzorului in care se aud sunetele fiecarui erou. Gol = boxele calculatorului. |

Atentie la doua numerotari diferite:

- Eroul (`k`): 0 este mereu Bubu, 1 este mereu Leo. Aproape tot codul foloseste eroul.
- Jucatorul: 1 si 2 pe ecran, adica partea stanga si dreapta a ecranului de start. Cu `Opt.swap = true`, jucatorul 1 joaca Leo.

`playerOf(k)` (in acest fisier) da jucatorul care joaca eroul `k`. `heroOf(p)` (in `09-screens.js`) da eroul jucat de jucatorul `p`.

`Opt.ctrl`, `Opt.keys`, `Opt.guide`, `Opt.sink` si dificultatea sunt pe erou. Cand jucatorii schimba personajele (`swapHeroes()`), aceste liste se inverseaza si ele. Asa controllerul, tastele, dificultatea si sageata raman la acelasi copil, nu la acelasi personaj.

## `STR`: toate textele

`STR.ro` si `STR.en` au aceleasi chei. Cheile cu punct sunt grupate dupa ecran:

| Prefix | Unde apare |
|---|---|
| `boot.` | Primul ecran ("Fă clic sau apasă o tastă") |
| `t.` | Ecranul de start (title) |
| `end.`, `med.` | Ecranul "Bravo!" de la final de nivel si medaliile |
| `pause.` | Meniul de pauza |
| `ban.` | Bannerele din timpul jocului ("Mai departe!", "La cuib!", "Oul uriaș!", "Provocare!") |
| `fest.`, `sorry` | Boss-ul invins si Festivalul Apusului |
| `diff.` | Numele dificultatilor |
| `lvl.<cheie>.name`, `lvl.<cheie>.intro` | Numele si povestea fiecarui nivel. `<cheie>` este `key` din `LEVEL_DEFS` (`meadow`, `forest`, `river`, `hill`, `fall`, `sunset`, `boss`). |
| `duel.` | Numele paznicilor si textele mini-luptelor |
| `set.` | Meniul Setari |
| `key.` | Pagina "Alege tastele" |
| `pad.` | Pagina "Conectează controllerul" |
| `spk.` | Mesajele despre difuzorul controllerului |
| fara prefix | Cuvinte mici: `yes`, `no`, `egg1`, `eggN`, `star1`, `starN`, `title`, `subtitle`, `loading` |

Lista completa, cu ambele limbi, este in [anexa C](anexe/C-texte.md).

### De ce romana are diacritice in joc

Cererea initiala cere romana corecta ("Apasă ✕ pe controller"). Chrome pe Mac afiseaza diacriticele fara probleme cu fonturile folosite. Documentatia este fara diacritice doar ca stil de scriere al proprietarei.

### Cum au fost scrise textele

- Foarte scurte. Copilul de 6 ani nu citeste inca bine. Ce conteaza se arata si cu iconite.
- Propozitii pe care un parinte le poate citi cu voce tare.
- Povestile nivelurilor spun exact ce e nou ("Prin noroi mergeți mai încet").
- Textele in romana au fost scrise de Claude, nu de un vorbitor nativ. Merita citite o data de un adult.

## `T(cheie, a, b)`

Da textul in limba din `Opt.lang`. Cand se joaca al doilea joc, cauta intai cheia cu prefixul `L:` (vezi mai jos). Daca o cheie lipseste in engleza, foloseste romana. Daca lipseste si acolo, intoarce cheia insasi (asa o greseala se vede pe ecran, nu strica jocul). `{0}` se inlocuieste cu `a`, `{1}` cu `b`.

```js
T('t.level', 3)              // "Nivelul 3" sau "Level 3"
T('fest.bravo', 'Bubu', 'Leo') // "Bravo, Bubu și Leo!"
```

`T` se apeleaza la fiecare desen, nu o singura data. De aceea schimbarea limbii din Setari se vede imediat, fara reincarcare.

## Functii mici

| Functie | Ce face |
|---|---|
| `lvlName(def)`, `lvlIntro(def)` | Numele si povestea unui nivel, din cheia lui. |
| `eggWord(n)`, `starWord(n)` | "ou" sau "ouă", "stea" sau "stele", dupa numar. |
| `keyName(code)` | Numele citibil al unei taste: `Space` devine "Spațiu", `ArrowUp` devine "↑", `KeyW` devine "W". |

## Cum adaugi un text nou

1. Alegi o cheie cu prefixul ecranului. Exemplu: `'ban.boost'`.
2. O adaugi in `STR.ro` si in `STR.en`, in acelasi loc.
3. In cod scrii `T('ban.boost')`.
4. Rulezi `node tools/gen-docs.js`. Anexa C arata `(lipseste)` daca ai uitat o limba.

## Cum adaugi o limba noua

1. Copiezi tot obiectul `en: { ... }` intr-un obiect nou, de exemplu `de: { ... }`, si traduci.
2. In `setLanguage()` din `09-screens.js` accepti noua valoare.
3. In randul "Limbă" din `settingsRows()` (tot acolo) treci prin cele trei limbi in loc de doua.
4. In `Voice.pick()` din `03-audio.js` adaugi expresia pentru vocea noua (`/^de/i`).
5. In `Save.apply()` accepti noua valoare din salvare.

## Update 14 noiembrie 2026: jocul ales si textele lui

`GAME` este jocul ales: `'bubu'` sau `'lupta'`. `GAME_IDS = ['bubu', 'lupta']`. `isLupta()` spune daca e al doilea. Se schimba doar prin `setGame(id)` din `09-screens.js`, care schimba si eroii din `CONFIG`, muzica si fundalul ecranului de start.

**Texte diferite pe joc.** Un text care difera in al doilea joc are inca o cheie, cu prefixul `L:`:

```js
'ban.nest': 'La cuib!',            // primul joc
'L:ban.nest': 'La adăpost!',       // al doilea joc
```

`T('ban.nest')` alege singur. Daca nu exista `L:cheie`, se foloseste textul comun. Asa cele mai multe texte (meniuri, Setari, pauza) sunt scrise o singura data.

`TG(id, cheie, a, b)` da textul unui joc anume, oricare ar fi `GAME`. E folosit pe ecranul "Alege jocul", unde apar titlurile ambelor jocuri.

`applyGameConfig()` pune in `CONFIG.heroes`, `CONFIG.villainName` si `CONFIG.boss` valorile jocului ales. Originalele primului joc raman in `GAME_BASE`.

**Texte noi comune**: `sel.*` (ecranul "Alege jocul"), `ban.wait` ("Îl așteptăm pe {0} în cuib!"), `key.b` ("Ajută prietenul (butonul □)"), `spk.lost`, `spk.test`. Toate sunt in anexa C.

**Cand adaugi un text**: daca are sens doar in primul joc (vorbeste de oua, de Ciori, de cuib), adauga si varianta `L:` in ambele limbi. `tests/alege-jocul.js` nu verifica asta. Uita-te la ecran in al doilea joc.

**Tasta noua** in `Opt.keys[k]`: `b` = ajuta prietenul. O salvare veche, fara `b`, primeste tasta din `CONFIG.keys`.
