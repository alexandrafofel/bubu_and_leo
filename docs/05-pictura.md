# 05. Pictura (`src/02-core.js`)

Cererea: "Everything should look hand-painted, like a watercolor/gouache illustration from a children's book. No hard black outlines, no pixel art, no flat vector look." Fisierul acesta are uneltele care fac asta posibil. Restul jocului le foloseste ca pe niste pensule.

## Constante si matematica

| Nume | Valoare | Ce este |
|---|---|---|
| `TAU` | 2 x PI | Un cerc intreg, in radiani. |
| `W`, `H` | 1920, 1080 | Ecranul logic. Toate desenele ecranelor folosesc aceste unitati. |
| `CS` | 40 | Celula grilei din niveluri. 3200 / 40 = 80 de coloane, 1800 / 40 = 45 de randuri. |
| `clamp(v, a, b)` | | Tine `v` intre `a` si `b`. |
| `lerp(a, b, t)` | | Punctul de la fractia `t` intre `a` si `b`. |
| `dist(ax, ay, bx, by)` | | Distanta dintre doua puncte. |
| `ease(t)` | | Curba lina la ambele capete (pornire si oprire moale). |
| `easeOut(t)` | | Curba care porneste repede si se opreste moale. |
| `rng(seed)` | | Generator de numere aleatoare cu samanta (algoritmul mulberry32). Aceeasi samanta da aceleasi numere. |
| `hash(s, i)` | | Un numar intre 0 si 1 care depinde doar de `s` si `i`. Fara stare. |

De ce numere cu samanta: un nivel se genereaza din samanta lui, deci arata la fel de fiecare data. Copiii recunosc locurile. `hash` este folosit pentru lucruri desenate in fiecare cadru (tremurul marginilor, cascada) care trebuie sa arate la fel in cadre succesive, altfel ar palpai.

## Culori

| Nume | Ce face |
|---|---|
| `hex(h)` | Transforma `#RRGGBB` in `[r, g, b]`. Tine minte rezultatele (`_hexCache`), pentru ca e apelata de mii de ori pe cadru. |
| `rgba(h, a)` | Culoarea hex cu transparenta `a`, ca text pentru canvas. |
| `mix(h1, h2, t)` | Amestec intre doua culori. |
| `shade(h, t)` | `t` negativ intuneca, `t` pozitiv deschide. |
| `SHADOW` | `#6A4270`, culoarea tuturor umbrelor. |

Decizia importanta: `shade` nu intuneca spre negru. Intuneca spre violet cald `#5A3550` si deschide spre crem `#FFF6E0`. Cererea: "Shadows in warm violet or brown, never gray or black." Asa orice culoare intunecata ramane calda, chiar daca cineva alege mai tarziu o culoare noua.

## Pensulele

### `blobPath(c, x, y, rx, ry, seed, wob, n)`

Forma de baza a tot jocului: o elipsa cu margini putin neregulate. Alege `n` puncte pe elipsa (implicit 10), muta fiecare cu pana la `wob` (implicit 7%) din raza, apoi le uneste cu curbe patratice prin mijlocul segmentelor. Rezultatul e o forma moale, fara colturi, care pare desenata de mana.

`_bx`, `_by` sunt doua liste refolosite pentru puncte, ca sa nu creeze liste noi la fiecare apel (mai putin gunoi pentru memorie, mai putine sacadari).

### `wash(c, x, y, rx, ry, col, o)`

Tehnica acuarelei. Picteaza 3 straturi (`o.layers`) semi-transparente ale aceleiasi forme, fiecare putin mai mic (x 0.93 pe strat) si putin mutat. Apoi traseaza marginea intr-o nuanta mai inchisa (`shade(col, -0.35)`), cu transparenta 0.2. In acuarela adevarata pigmentul se aduna la marginea petei cand se usuca. Aceasta margine imita asta.

Optiuni: `a` (opacitatea totala, implicit 0.55), `layers`, `seed`, `wob` (implicit 0.1), `n` (puncte, implicit 12), `edge` (grosimea marginii, `0` = fara margine), `edgeA` (transparenta marginii).

### `puff(c, x, y, rx, ry, fill, seed, edge, wob)`

Forma opaca pentru personaje. O singura pata plina cu o margine colorata subtire (`rgba(120,70,80,0.28)`, un maro-violet transparent, nu negru). `fill` poate fi si un gradient. Personajele trebuie sa fie clare si citibile, deci nu sunt transparente ca fundalul.

### `soft(c, x, y, rx, ry, col, alpha, seed)`

Pata simpla, fara margine. Pentru pete, obraji, lumini.

### `brushLine(c, pts, width, col, alpha, seed)`

O linie de pensula prin puncte. Trei treceri, fiecare putin mai subtire (x 0.86) si cu punctele putin tremurate. Folosita pentru drumuri, poduri, sforile de felinare, liniile de deal.

## Hartia si lumina

### `makePaper()`

Genereaza o singura data (`PAPER`) o textura de hartie de 1920 x 1080:

1. Doua straturi de zgomot neted: unul mare (48 x 27 puncte) pentru pete largi, unul fin (320 x 180) pentru granulatie. Interpolarea e lina (`smoothstep`).
2. Plus zgomot aleator per pixel (+/- 3%).
3. Culoarea de baza `255, 249, 236` (crem), inmultita cu valoarea calculata (intre aproximativ 0.88 si 1).
4. 900 de fibre: linii mici curbe, jumatate maro foarte transparent (`rgba(150,110,90,0.05)`), jumatate albe (`rgba(255,255,250,0.07)`).

### `makeOverlay(tint, tintA, vig)`

Stratul pus peste tot ecranul, la fiecare cadru, cu `multiply`:

- hartia,
- o tenta calda (`tint` cu transparenta `tintA`),
- o vinieta radiala violet-maro (`rgba(125,74,96,vig)`), mai puternica spre colturi.

Fiecare nivel isi face overlay-ul lui: tenta merge de la crem `#FFF4E0` spre piersica `#FFC08C` pe masura ce se apropie apusul (`mix(..., L.skyT)`). Ecranul de start are `#FFE6BE`, festivalul `#C8A0B4`, boss-ul `#FFBE8C`.

De ce `multiply`: hartia intuneca usor tot ce e sub ea, exact cum pigmentul pe hartie reala lasa granulatia sa se vada. Albul ramane crem, nu alb pur.

## Cerul

### `SKY_KEYS` si `skyCols(t)`

Cerul trece prin cinci momente. Fiecare are culoarea de sus si de jos:

| t | Moment | Sus | Jos |
|---|---|---|---|
| 0.0 | dupa-amiaza | `#A9CFD0` albastru-verzui palid | `#F8E6BC` crem auriu |
| 0.4 | dupa-amiaza tarzie | `#CDD0B4` salvie | `#F7D29A` miere |
| 0.7 | lumina aurie | `#DDB79A` piersica | `#F5B983` portocaliu cald |
| 1.0 | apus | `#B88FA6` roz prafuit | `#F2A070` portocaliu |
| 1.3 | amurg | `#5A4C7C` violet | `#D0808A` roz |

`skyTOf(idx)` (in `06-level.js`) da fiecarui nivel un `t` intre 0 si 0.95. Asa "the sky slowly shifts toward sunset as the levels progress", cum cere specificatia. Boss-ul are 1.05, festivalul 1.28.

### `paintSky(c, x, y, w, h, t, seed, o)`

Gradientul de cer, 14 pete ude (tehnica "ud pe ud"), soarele (un halou radial plus o pata), norii (4 pete late per nor, nuanta spre roz la apus) si, dupa `t > 1.1`, 60 de stele mici. Soarele coboara pe masura ce `t` creste.

### `paintHills(c, x, yBase, w, hgt, t, seed, cols)`

Trei randuri de dealuri indepartate, fiecare din doua curbe sinusoidale. Spre apus culorile se amesteca cu un violet (`#C9A6B0` spre `#8E7AA0`). Departarea se face cu culoare, nu cu ceata gri.

## Text

### `text(c, str, x, y, size, col, o)`

Fara contur negru. In loc de contur: un halou crem (`rgba(255,246,224,0.85)`, grosime 20% din marime) si o umbra violet transparenta mutata putin in jos. Optiuni: `title` (fontul de titlu), `weight`, `align`, `base`, `halo` (0 = fara), `haloCol`, `shadow` (0 = fara).

### `wrapLines(c, str, maxW, size, title)`

Imparte un text in randuri care incap in `maxW`.

### `iconX(c, x, y, r, pulse)` si `richText(...)`

Butonul ✕ al controllerului, pictat: un disc crem cu un X albastru `#6D8FD0` (culoarea reala a lui ✕ pe DualShock este albastru deschis). `richText` scrie un text in care fiecare caracter ✕ este inlocuit cu aceasta iconita. Asa "Apasă ✕" arata butonul adevarat, nu un caracter din font. `align: 'left'` incepe textul la `x`.

### `starPath(c, x, y, r, rot)`

Conturul unei stele cu 5 colturi. Raza interioara este jumatate din cea exterioara.

## Sprite-uri si carduri

### `sprite(key, w, h, paint)`

Picteaza o data, foloseste de multe ori. La primul apel creeaza un canvas ascuns de 2 ori mai mare (pentru claritate la zoom) si apeleaza `paint`. Apoi intoarce mereu acelasi canvas. Folosit pentru ou, stea, con, gandacul care doarme, "z", portretele din HUD, cuibul mic din bara de progres.

De ce: o pictura in acuarela are multe straturi. Desenata de la zero de 60 de ori pe secunda pentru fiecare ou, jocul ar fi incetinit. Masurat: un cadru a scazut de la aproximativ 25 ms la 16 ms in Chrome fara placa video dupa ce am stampilat aceste lucruri.

### `card(c, x, y, w, h, col, seed)` si `paintCard(...)`

Panourile din meniuri si HUD. Forma este o "superelipsa" (un dreptunghi cu colturi foarte rotunjite) cu marginea putin tremurata. Patru straturi: umbra violet mutata in jos-dreapta, marginea inchisa, culoarea, o lumina deschisa sus. Fiecare combinatie de marime, culoare si samanta se picteaza o singura data si se pastreaza (`_cards`).

## Update 21 noiembrie 2026 (T6.1): o singura lumina, `lit()`

Nivelurile 7 - 12, eroii si George se picteaza in stilul nou: "diorama cu lumina" (`docs/24-sisteme-noi.md`, S7). Nivelurile 1 - 6 raman in acuarela, cum sunt.

### Cele doua lumini

Toata lumea e luminata la fel: o lumina calda din **stanga-sus** si o lumina rece de umplere din **dreapta-jos**. Sunt doua nume de sus, langa `SHADOW`:

| Nume | Culoarea | De unde vine |
|---|---|---|
| `KEY` | `#FFE2B0` | stanga-sus, calda |
| `FILL` | `#8FA8FF` | dreapta-jos, rece |
| `SHADOW` | `#6A4270` | umbrele, ca pana acum: violet cald, niciodata gri |

### `lit(c, path, col, o)`

Orice pictor al stilului nou trece prin ea, ca lumina sa cada la fel peste tot. Deseneaza cinci straturi, mereu in ordinea asta:

1. **Umbra aruncata** lipeste obiectul de pamant: o pata violet, alpha 0.28, mutata cu `(+0.35 x inaltime, +0.12 x inaltime)` si turtita la 0.4, desenata cu `multiply`.
2. **Umbra de contact**, o pata mai mica si mai inchisa (alpha 0.4), exact sub baza, ca obiectul sa nu pluteasca.
3. **Forma**, cu un gradient liniar: din stanga-sus culoarea deschisa cu 22%, spre dreapta-jos inchisa cu 28% si impinsa spre violet cu 10%. Aici se adauga si materialul, daca are (`o.mat`, de la T6.2).
4. **Lumina de margine**, pe dinauntru: calda (`KEY`, alpha 0.7) pe marginea de sus-stanga, rece (`FILL`, alpha 0.55) pe cea de jos-dreapta.
5. **Stralucirea**, doar pe materialele lucioase: o pata alba in treimea de sus-stanga. Cu cat `gloss` e mai mare, cu atat pata e mai mare si mai tare (alpha 0.6 la 0.9).

Ce primeste in `o`:

| Camp | Ce este |
|---|---|
| `x`, `y` | Punctul in care obiectul sta pe pamant: mijlocul bazei lui. |
| `w`, `h` | Cat e de lat si de inalt. Din ele se fac umbra si gradientul. |
| `gloss` | 0 la 1, cat de lucios e materialul. `0` = fara pata de stralucire. |
| `mat` | Pictorul materialului `(c, o)`, chemat inauntrul formei, peste gradient. Vine cu T6.2 si T6.3. |
| `seed` | Pentru tremurul pictat de mana al petelor. |
| `shadow` | `false` = fara umbre, nici aruncata, nici de contact. Pentru ce nu sta pe pamant: un os aruncat, un nor. |

`path` e o functie `(c)` care construieste conturul, un singur drum inchis. E chemata de cateva ori: o data pentru forma si inca de doua ori pentru lumina de margine.

**Lumina de margine, cum e facuta:** se taie la forma (`clip`) si se traseaza acelasi contur mutat putin. Mutat in jos-dreapta, din el se vede banda de pe marginea de sus-stanga; mutat in sus-stanga, banda de pe cea de jos-dreapta. Asa nu e nevoie de `shadowBlur`.

**Bugetul (S7.7):** `lit()` ruleaza la fiecare cadru, deci nu foloseste `createRadialGradient`, `createPattern` sau `shadowBlur`. Gradientul liniar e singurul permis acolo.
