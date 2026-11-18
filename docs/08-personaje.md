# 08. Personaje si obiecte (`src/05-chars.js`)

> **Din 18 noiembrie 2026 exista un singur joc: "Cea mai grea luptă".** "Bubu și Leo" a fost scos (vezi `16-decizii.md`, "Un singur joc"). Orice schimbare se face doar in "Cea mai grea luptă". Ce scrie mai jos despre primul joc, despre alegerea jocului sau despre "ambele jocuri" este istoric.

Toate personajele sunt desenate din forme moi (`puff`, `soft`) si gradiente. Nu exista imagini. Cererea: "Characters are round and cute with big friendly eyes, and move softly (gentle breathing when idle, little bounces when walking)."

Reguli comune:

- Fiecare functie primeste pozitia picioarelor (`x`, `y`).
- Optiunile `o` sunt aceleasi pentru toti: `scale` (marime), `face` (1 priveste dreapta, -1 stanga), `t` (timpul, pentru animatii), `moving`, `walk` (faza pasului), `z` (inaltimea), `squash` (turtire dupa tropait), `dizzy`, `happy`.
- Respiratia: corpul se lateste si se scurteaza cu cateva procente dupa `sin(t)`. Cand merge, respiratia scade la 30% si apar saltaresi mici (`hop`).
- Desenele folosesc coordonate locale. Valorile ca `-36` sunt unitati deasupra picioarelor la `scale` 1.

## `drawEye(c, x, y, r, o, look)`

Ochiul comun tuturor. Mare, alb crem `#FFFDF4`, pupila maro-violet `#4B2E33`, doua luminite albe. Nu negru.

- Clipeste singur la fiecare 3.7 secunde, 0.13 secunde (`blinkOff` muta momentul, ca personajele sa nu clipeasca toate odata).
- `happy`: ochiul devine un arc vesel.
- `dizzy`: o spirala care se roteste.
- `look`: muta pupila putin in directia privirii.

## Bubu: `drawBubu(c, x, y, o)`

Pui de triceratops. Inaltime aproximativ 90 de unitati la `scale` 1.

| Parte | Culoare | Nota |
|---|---|---|
| Corp | `CONFIG.heroes[0].color` `#F08A3C`, gradient de la `shade(+0.4)` la `shade(-0.22)` | Pata mare 44 x 34 |
| Burta | `#FCDDB0` | Piersica deschis |
| Pete | `CONFIG.heroes[0].color2` `#6FA35E` | 5 pe spate, 4 pe guler |
| Gulerul (frill) | `shade(corp, -0.16)` cu interior `shade(+0.28)` | In spatele capului |
| Esarfa | `CONFIG.heroes[0].scarf` `#D9463C` | Capatul flutura cu `sin(t * 5)` |
| Coarne | `#FFF3D6` | Trei: doua pe frunte, unul pe nas |
| Obraz | `#F29C8E` la 50% | |
| Gura | `#8A4A38` | Zambet. Ondulata cand e ametit. |

Picioarele se misca alternativ cand merge. Coada se leagana.

Optiunile `col`, `col2`, `noScarf` schimba culorile. Sunt folosite pentru puiul care iese din ou la festival (verde `#9CC27A` cu pete galbene `#F3D36B`, fara esarfa).

## Leo: `drawLeo(c, x, y, o)`

Mic fotbalist. Mai inalt decat Bubu (aproximativ 115 unitati).

| Parte | Culoare |
|---|---|
| Piele | `#F3C7A0` |
| Par | `#7C4B30` |
| Tricou | `CONFIG.heroes[1].color` `#F6C63C`, gradient vertical |
| Sort, guler, ciorapi, mansete | `CONFIG.heroes[1].color2` `#3F78C8` |
| Bentita cu doua capete care flutura | `CONFIG.heroes[1].headband` `#D9463C` |
| Ghete | `#C4573D` (teracota) |
| Obraji | `#F29C8E` |
| Gura | `#9A5440` |

`o.kick` (de la 1 la 0) ridica piciorul drept inainte, cand suteaza.

## Mingea: `drawBall(c, x, y, r, spin)`

Crem `#FFFBEE` spre `#EAD9BE`, cu pete teracota `#C4573D` (una in centru, cinci pe margine). Petele se rotesc cu `spin`, deci mingea pare ca se rostogoleste. Nu este alb-negru clasic: negrul nu exista in paleta.

## Ciori: `drawCiori(c, x, y, o)`

Cioara poznasa, pruna, nu neagra. Cererea: "mischievous, not evil".

| Parte | Culoare |
|---|---|
| Corp | `#5F4E80`, gradient spre `#8474A4` (lumina) si `#4A3C68` (umbra) |
| Burta | `#9A8AB8` |
| Cioc si picioare | `#F0A040` / `#E99A3C` |
| Smoc pe cap | trei pene |

`mood`:

- `cheeky` (implicit): sprancene in "V", zambet strengar.
- `dizzy`: ochi spirala (cand a fost dat jos din copac).
- `sorry`: sprancene triste si o lacrima albastra `rgba(160,210,220,0.9)` care curge.
- `happy`: ochi veseli (la festival).

`fly` misca aripa repede si leagana corpul. Optiunile `body`, `dark`, `light`, `belly` schimba culorile: Ciorel (paznicul nivelului 6) foloseste albastru-verzui `#4F7387`.

## Gandacul: `paintBeetleBody`, `drawBeetle`

Gandac morocanos rotund. Carapace `#BE665C` cu gradient (`#D98A72` sus, `#9A4F58` jos), pete crem `#FBE3BA`, cap si picioare `#7A4B60`.

| Stare | Cum arata |
|---|---|
| `sleep` | Ochi inchis (un arc), respira, "z"-uri violet `#8E7AA6` care urca. Desenat dintr-un sprite. |
| `wake` | Ochi deschis, un "!" rosu deasupra. |
| `chase` | Ochi deschis, spranceana incruntata, picioarele se misca. |
| `return` | Ochi inchis, se intoarce acasa. |
| `stun`, `knock` | Ochi spirala, stele deasupra. `knock` se si roteste (lovit de minge). |

## Conul: `drawCone(c, x, y, rot, r, z)`

Con de brad maro `#9C6A46` cu solzi crem `rgba(214,170,120,0.85)` si varf `#7A4E38`. Pictat o data intr-un sprite si rotit cand se rostogoleste.

## Oul de aur: `eggPath`, `drawEgg`

`eggPath(c, r)` traseaza forma de ou din patru curbe Bezier: mai ingust sus (1.25 x `r`), mai lat jos.

`drawEgg`: halou auriu `rgba(255,226,130,0.4)`, gradient `#FFF6C4` spre `#F8CC4E` spre `#E3952F`, margine `rgba(190,110,50,0.35)`, o luminita alba. Pluteste usor (`bob`), se clatina, si din cand in cand sclipeste o steluta. Sprite pictat o data la marimea 40 si scalat.

## Steaua bonus: `drawStar`

Steaua e intentionat alta culoare decat ouale: crem-roz (`#FFFDF0` spre `#FFE7A0`, contur piersica `#F4B08E`, halou roz `rgba(255,214,200,0.55)`). Asa se vede ca e altceva, mai rar. Pluteste mai sus si se roteste usor.

## Fluturele: `drawButterfly`

Aripi portocalii `#F2913C` si `#F6B25A`, cu pete `#FFE2A6`, corp `#7A4A3A`, halou cald. Aripile bat cu `sin(t * 11)`.

## Cuibul: `drawNest(c, x, y, r, seed, glow)`

Vazut de sus. Umbra violet, coroana `#B98858`, interior `#8E6244`, fund `#D9B27A`, plus 70 de fire de paie curbate in patru nuante (`#D9B27A`, `#8E6244`, `#E8CC96`, `#A87850`). `glow` adauga un halou auriu.

## Iconite fara cuvinte

| Functie | Ce arata | Folosita |
|---|---|---|
| `iconArrow(c, x, y, ang, size, col)` | O sageata cu margine crem si umbra | Indicii, sageata ajutatoare, bannere, meniuri |
| `iconStick(c, x, y, r, t)` | Stick-ul: patru sageti si un capac care se misca in cerc | Primul nivel: "misca stick-ul" deasupra eroului |
| `drawDizzyStars(c, x, y, t)` | Trei stelute galbene `#FFE08A` care se rotesc | Deasupra oricui e ametit |
| `drawHero(c, k, x, y, o)` | Bubu daca `k` e 0, Leo altfel | Peste tot |

De ce iconite: copilul de 6 ani nu citeste. "Misca stick-ul" si "apasa ✕" sunt aratate deasupra eroului lui, nu scrise.

## Update 14 noiembrie 2026

- Personajele celui de-al doilea joc (Boon, Killer, George cel Rău, robotii, melcii, pasarile, cristalele, steaua secreta, racheta, soldatii) sunt in `src/055-lupta.js`. Sunt descrise in `21-cea-mai-grea-lupta.md`.
- Pictorii din acest fisier trimit singuri la cei noi cand `isLupta()`: `drawBall` la `drawBallL` (mingea alba cu hexagoane a lui Killer), oul la cristal, cuibul la adapostul din jungla. Codul de joc cheama aceleasi functii in ambele jocuri.
- `drawBubu` si `drawLeo` iau culorile din `GAME_BASE.heroes`, nu din `CONFIG.heroes`. Pe ecranul "Alege jocul" sunt desenati si cand jocul ales e al doilea, cand `CONFIG.heroes` ii contine pe Boon si Killer.
- Optiuni noi de desen pentru eroi (din `heroOpts` in `08-draw.js`): `scale` vine acum din `h.small` (micsorarea din al doilea joc), `hug` (primul erou isi intinde bratele cand ajuta), `claw` (ghearele lui Boon, de la 0 la 1 cat se invart). Un erou care asteapta ajutor e desenat ametit (`dizzy`).
- `iconSq(c, x, y, r)`: butonul □, desenat ca pe controller (un patrat roz pe un disc crem). Apare deasupra eroului lovit, in sageata prietenului si in Setari.
