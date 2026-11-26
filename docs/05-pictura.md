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

## Update 21 noiembrie 2026 (T6.2): materialele eroilor

`lit()` primeste acum si **materialul** obiectului. Un material da o textura peste forma (stratul 3 din `lit()`), taiata la contur, si luciul pe care il are in mod normal. Se alege dupa nume:

```js
lit(c, path, col, { x, y, w, h, mat: 'scale' });          // luciul vine din material: 0.3
lit(c, path, col, { x, y, w, h, mat: 'scale', gloss: 0 });  // un luciu al apelantului il bate pe al materialului
```

`o.mat` poate fi si o functie `(c, o, path)`, pentru un material facut pe loc. Un nume care nu exista scrie o singura data o eroare in consola (nu la fiecare cadru) si desenul merge mai departe fara textura.

Materialele sunt in `MATERIALS` (`src/02-core.js`), fiecare `{ gloss, paint(c, o, path) }`.

### Cum se fac texturile

O textura e o **placa mica**, pictata o singura data (`sprite()`), facuta model o singura data (`matPattern()`, pastrat in `_matPat`) si apoi doar umpluta cu `fillRect` la fiecare cadru. **`createPattern` nu se cheama niciodata cat se deseneaza un cadru** (S7.7): doar la prima folosire a unui material. Placile sunt pictate opace, in violet-umbra sau crem; materialul hotaraste cat de tare se vad (`globalAlpha`).

`sprite()` picteaza la dublu, deci modelul e micsorat la jumatate (`setTransform`) ca placa sa aiba din nou marimea ei.

**Modelul e prins de sistemul de coordonate de la momentul desenului.** Un pictor de erou face `translate` la erou, deci textura merge cu eroul si nu "aluneca" cand se misca. Cine deseneaza un material fara `translate` o are prinsa de coltul ecranului.

### Cele patru materiale ale eroilor

| Material | Luciu | Unde | Cum arata |
|---|---|---|---|
| `scale` | 0.3 | Boon, George | Semicercuri mici pe randuri decalate (placa 22 x 16, fara cusatura), alpha 0.12. **Mai dese spre spate:** un al doilea strat (alpha 0.07) doar pe jumatatea stanga, pentru ca pictorii intorc tot eroul, iar spatele e mereu la stanga. |
| `fabric` | 0.05 | tricoul si sortul lui Killer, steaguri | O tesatura foarte fina (linii in cruce, la 3 unitati, alpha 0.08) si, la ~4 unitati de margine, **cusaturi**: o linie punctata crem. Cusaturile sunt acelasi contur micsorat in jurul mijlocului: la forme rotunde da o distanta aproape egala, la forme foarte alungite nu. |
| `rubber` | 0.4 | manusile lui Killer, mingea, rotile, ghetele | Neted. O singura banda lata si moale de lumina (`KEY`) in diagonala, fara margine dura. |
| `bone` | 0.25 | oasele lui Boon, coltii | Aproape neted. Pori mici (placa 64 x 64, 11 pori, unii in grupuri de cate trei) si o crapatura cu margine palida alaturi. Crapatura se muta cu `o.seed`. |

Placa de pori e mare dinadins: una de 36 x 36 repeta aceleasi grupuri intr-o grila vizibila. La marimea unui os de erou (30 - 60 de unitati) placa de 64 nu se repeta deloc.

## Update 21 noiembrie 2026 (T6.3): materialele lumii

Aceleasi cadru si aceleasi reguli ca la eroi (placa pictata o data, model facut o data, `fillRect` la fiecare cadru; `lit()` da materialului si conturul). Sase materiale noi in `MATERIALS`:

| Material | Luciu | Cum arata |
|---|---|---|
| `wood` | 0.15 | Fibre lungi, usor ondulate (placa 96 x 48, alpha 0.2), trei noduri cu inele la locuri alese dupa `o.seed`, capetele scandurii mai deschise (benzi de `KEY` la ~12% din latime). |
| `metal` | 0.8 | Benzi de lumina pe orizontala (deschis, inchis, deschis), patru nituri cu umbra lor la un sfert din cutie fata de colturi, zgarieturi fine crem (placa 70 x 70, alpha 0.25). |
| `stone` | 0.1 | Pete mari in doua tonuri (placa 96 x 96, fiecare pata desenata si la o placa distanta, ca modelul sa nu aiba cusatura dreapta), doua crapaturi, muschi verde (`rgba(122,174,94)`) din treimea de jos. |
| `crystal` | 1 | Sapte fatete (triunghiuri din centru) in trei tonuri: `KEY`, `SHADOW`, `FILL`; miez crem, mai deschis. |
| `leaf` | 0.35 | Nervura centrala usor curbata, sase perechi de nervuri laterale, toate crem; marginea mai inchisa (contur lat de 5, taiat la jumatate de `clip`). |
| `lava` | 0 | Crusta `#5A2A3A` (alpha 0.92 - 0.95, ca gradientul de dedesubt sa se mai vada) si cinci crapaturi luminoase care **pulseaza**. |

**Lava pulseaza dupa `o.t`** (secunde, dat de cel care deseneaza; fara el sta pe loc). Culoarea crapaturii e `mix(#F58A3C, #F6CE46, puls)`, puls = 0.5 + 0.5 sin(2.4 t + 0.45 k). Defazajul dintre crapaturi e mic dinadins: la 1.3 pulsau in faze opuse, iar vulcanul parea ca sta nemiscat. Doua straturi: o dunga larga si moale (alpha 0.3) si crapatura insasi (alpha 0.95). Galben si portocaliu raman in paleta: nicio culoare de pe drum nu e gri sau negru.

> **Apa (T6.8):** al unsprezecelea material, `water`, e descris in `12-desen-si-hud.md`, "Update 22 noiembrie 2026 (T6.8)": baza albastra si doua randuri de valuri care merg in sens opus (`paintWaveTile`, `fillWaves`).

## Update 22 noiembrie 2026 (T6.4): `lit()` pentru eroi, `castShadow()`

`lit()` a primit patru optiuni noi, pentru eroii facuti din multe parti:

| Optiune | Ce face |
|---|---|
| `flip` | -1 cand pictorul a oglindit desenul. Gradientul, marginea de lumina si pata de luciu se intorc, ca lumina sa ramana in stanga-sus a ecranului. Lipsa: se citeste din transformare (`getTransform`). Pictorii eroilor il dau ei, ca sa nu se citeasca transformarea la fiecare parte. |
| `rim` | Cat de lata e marginea de lumina (5 implicit). |
| `rimA` | Cat de tare e (1 implicit). Partile eroilor folosesc 0.5. |
| `lite` | Doar gradientul si luciul: fara `clip`, fara material, fara margine. Pentru partile mici. |

**Umbrele au iesit din `lit()` intr-o functie a lor**, `castShadow(c, x, y, w, h, seed, k)`, pe care `lit()` o cheama la fel ca inainte. Un erou are o singura umbra, desenata de cine il deseneaza (`drawHeroFull`), nu cate una pe fiecare parte. `h` hotaraste doar cat de departe spre dreapta-jos cade umbra: un erou da mai putin decat inaltimea lui, ca umbra sa porneasca de la picioare. `k` (0 - 1): cat de tare; sub 0.95 nu mai e linie de contact (eroul e in aer).

## Update 22 noiembrie 2026 (T6.10): cum se verifica stilul nou

Testul permanent `tests/stil-grafic.js` (pixeli gri, fara gradienti pe cadru) si bugetul de timp din `tests/performanta.js` sunt descrise in `17-testare.md`. Functiile noi de desen ale stilului nou se adauga in lista `names` din test.

## Update 23 noiembrie 2026: imaginile Krea

Proprietara a aprobat pe 23 noiembrie 2026 schimbarea regulii 1: jocul foloseste imagini facute cu Krea.
Fisierul ramane unul singur si merge offline. Imaginile sunt in el, ca WebP in `src/016-art-data.js`.

### De unde vin

- `art/krea/*.png`: imaginile decupate, fara fundal. Ele sunt sursa.
- `tools/pack-art.py`: le face WebP (calitate 84), le trage putin spre violet pe cele aproape gri (regula 4) si scrie `src/016-art-data.js`. Fisierul generat nu se editeaza de mana.
- `build.sh` pune `016-art-data.js` dupa `015-lang.js`. Jocul creste la ~1,5 MB.

O imagine noua: o pui in `art/krea/`, rulezi `python3 tools/pack-art.py`, apoi `./build.sh`.

### Ce sunt imagini

- Eroii (`boon`, `killer`), George (`george`, `george_bare` fara coroana), Micul George (`mini`, cu cornul in dungi mai mic), robotii (`robot_sleep`, `robot_awake`), melcul (`melc`), pasarea (`pasare`), soldatii (`soldier`, `soldier_jump`).
- Pe fiecare nivel: doi copaci (`lN_tree1`, `lN_tree2`), planta care straluceste (`lN_spark`), piatra, tufa, florile. Comune: cuibul, podul, pietrele din rau, torta, totemul, ciuperca, cristalul, groapa.

Mingile, oasele, diamantele, stelele si arena raman pictate in cod.

### Cum se deseneaza

- `ART[nume]` e o `Image`. `artOk(nume)` spune daca s-a decodat. Pana atunci se deseneaza pictura veche, ca sa nu lipseasca nimic.
- `drawArt(c, nume, x, y, inaltime, ax, flip)`: imaginea sta pe (x, y), cu talpa la `ax` din latime.
- `drawArtChar(c, nume, x, y, o, inaltime, ax)`: un personaj cu miscare simpla. Sare putin si se leagana cand merge, respira pe loc, se turteste si se intinde, se clatina cand e ametit. Picioarele nu se misca separat.
- `drawBoon`, `drawKiller`, `drawGeorge` si ceilalti intorc imaginea cand `artOn()` e adevarat. Asa o primesc si urmele din fuga, ecranele si insignele.
- Marimile sunt in `CONFIG.look.artSize`.

### Nivelurile calme

`PALS_ART` (`06-level.js`) da fiecarui nivel culorile hartii Krea: solul, drumul crem, benzile melcilor, apa, stanca. `palOf(def)` le pune peste `PALS`.
Cu `L.pal.art`, `paintLevel`:

- picteaza copacii, pietrele, tufele, cuibul, podul, tortele si totemurile din imagini;
- pune doar 60 de tufe de flori si niciuna din cele 900 de flori stralucitoare;
- picteaza decorul (`L.decor`, tot 1700 de lucruri pe nivel) ca fire de iarba si pietricele in culoarea solului;
- inlocuieste cerul cu trei randuri de copaci;
- face pamantul lent un petic mai inchis al solului;
- pune doar un graunte de hartie, fara lumina calda peste tot.

Totul se opreste cu `CONFIG.look.art: false` (sau doar solul, cu `calm: false`).

## Update 26 noiembrie 2026 (T7.2): placile si cusca in `art/krea/`

Cinci imagini noi, decupate din foaia Krea (foaia Krea din T7.2, varianta 1 pentru placi si pentru cusca), cu fundalul crem scos prin distanta de culoare:

| Nume | Ce e | Folosire |
|---|---|---|
| `plate_turq` | Placa cu laba turcoaz | placa lui Boon (`who` 0) |
| `plate_ice` | Placa cu talpa de gheata | placa lui Killer (`who` 1) |
| `plate_both` | Jumatate turcoaz, jumatate gheata | placa oricui (`who` -1) |
| `cage_shut` | Cusca inchisa, cu steluta inauntru | cusca, pana se deschide |
| `cage_open` | Cusca deschisa, gratiile desfacute | cusca, dupa lovitura comuna |

Desenul (`drawPlate`, `drawCage`, `drawMechs`, in `055-lupta.js`) cade pe o desenare simpla daca imaginea lipseste (`artOn() && artOk(...)`). Nu are gradienti. Lumina placii apasate si a cuștii deschise intra in `collectLights`.

Cele doua medalioane de pe cusca au labele lui Boon si talpa lui Killer, cum le-a aprobat proprietara. Nu s-a refacut cusca.
