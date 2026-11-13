# 06. Sunet (`src/03-audio.js`)

Cererea: sunete generate cu Web Audio, dar calde. Sinus si triunghi, filtre trece-jos, reverberatie moale. Timbre de kalimba, marimba, clopotei de lemn, flaut. Muzica pentatonica, incet, alta pe fiecare nivel. Boss-ul putin mai vioi. "Bonk" comic la lovitura, "thump" la tropait, "pok" la sut. Niciun fisier audio: totul se calculeaza in browser.

Fisierul are doua obiecte: `Snd` (muzica si efecte) si `Voice` (citire cu voce).

## Pornirea

Chrome nu lasa o pagina sa faca sunet inainte de un gest (clic sau tasta). De aceea primul ecran cere un clic. `Snd.init()` se apeleaza la fiecare clic si tasta (`10-main.js`). Prima data construieste tot. Dupa aceea doar reporneste contextul daca a fost suspendat.

Un buton de controller nu este considerat gest de Chrome. Daca jocul porneste doar cu controllerul, sunetul ramane oprit pana la primul clic sau tasta. Ecranul de start scrie atunci "Fă clic o dată pentru sunet".

## Lantul audio

```
   musicBus (volum muzica x 0.55 x duck) ──┐
   ambBus   (volum ambiental)  ────────────┼──> master (x 1.3) ──> trece-jos 6500 Hz ──> compresor ──> boxe
   chrBus   (volum personaje)  ────────────┘         ^
        │            │           │                   │
        └──(0.5)─────┴──(0.3)────┴──(0.26)──> reverb (2.6 s) ──> x 0.55
```

- Trei magistrale (bus-uri) cu volum separat. Cererea initiala avea doua (muzica si efecte). Al doilea update a cerut volum separat pentru "sunet personaje" si "sunet ambiental".
- Reverb: un `ConvolverNode` cu un raspuns generat de `impulse(2.6)`: zgomot care scade lin pe 2.6 secunde, filtrat (fiecare esantion se apropie doar 22% de cel nou, ceea ce taie inaltele). Da senzatia de camera mare si moale.
- Trece-jos la 6500 Hz pe tot: taie orice asprime.
- Compresor (prag -16 dB, raport 3, atac 10 ms, eliberare 250 ms): cand se aud multe sunete odata, nu se distorsioneaza.
- `master` 1.3: masurat ca sunetele sa se auda clar pe boxele unui laptop. Varfurile masurate sunt sub 0.75.
- `duck`: muzica scade la 0.45 in timpul povestii citite si la 0.35 in pauza.

## Piesele de baza

| Functie | Ce face |
|---|---|
| `osc(bus, tip, f, t, g, att, dec, o)` | Un oscilator (`sine` sau `triangle`) cu atac liniar si stingere exponentiala. `o.f2` face frecventa sa alunece (pentru "bonk"), `o.lp` adauga un filtru trece-jos. |
| `noise(bus, t, g, att, dec, tip, f, f2, q)` | Zgomot filtrat (fosnet, apa, vant, pasi). Zgomotul este un buffer de 1.5 s, refolosit, pornit dintr-un punct aleator. |
| `voc(bus, t, f0, f1, dur, g, m0, m1)` | O voce de desen animat: un ton dinte-de-fierastrau si unul triunghi, printr-un filtru trece-banda care se misca (ca o gura care se deschide). `f0` spre `f1` este melodia silabei. Castigul este inmultit cu 2.1. |
| `say(bus, t, k, a, b, dur, g)` | O silaba a eroului `k`. Bubu: ton de baza 215 Hz, "gura" 620 Hz. Leo: 400 Hz si 1050 Hz. |
| `nbuf(context)` | Bufferul de zgomot pentru un context (fiecare difuzor are contextul lui). |

Fiecare functie construieste sunetul pe contextul magistralei primite (`bus.context`). Asa acelasi efect poate canta in boxe sau in difuzorul unui controller.

De ce `voc` foloseste dinte-de-fierastrau, desi cererea zice "fara sunete aspre": dinte-de-fierastrau are armonicele de care are nevoie filtrul ca sa sune a vocala. Filtrul trece-banda (Q 2.2) taie tot ce e aspru. Rezultatul e un "mormait" moale, nu un bazait.

## Instrumentele

| Instrument | Cum e facut | Unde se aude |
|---|---|---|
| `kalimba(bus, f, t, g)` | Sinus la `f` (1.25 s) + sinus la 3 x `f` (0.28 s, 13%) + triunghi la 5.42 x `f` (0.07 s, 4%). Armonica nearmonica 5.42 da sunetul de lamela metalica. | Melodia, ouale, meniurile |
| `marimba(bus, f, t, g)` | Sinus la `f` (0.6 s) + sinus la 4 x `f` (scurt) + triunghi filtrat la 900 Hz. | Basul muzicii, valurile, castigul |
| `chime(bus, f, t, g)` | Sinus la `f` (1.9 s) + 2.76 x `f` + 5.4 x `f`. Raporturile sunt ale unui clopotel real. | Stele, fluture, felinare, artificii |
| `flute(bus, f, t, dur, g)` | Triunghi printr-un trece-jos, cu vibrato de 4.8 Hz care intra lin in 0.5 s, plus putin zgomot de suflu. | Note lungi in muzica unor niveluri |

## Muzica

Fiecare piesa este generata dintr-o samanta. Nu exista note scrise de mana.

`SONGS` are setarile fiecarei piese:

| Cheie | Unde | Nota de baza (MIDI) | Scara | Tempo | Extra |
|---|---|---|---|---|---|
| `title` | ecranul de start | 60 (Do) | majora pentatonica | 78 | flaut |
| `l0` | Pajistea | 60 (Do) | majora | 86 | |
| `l1` | Padurea | 57 (La) | minora pentatonica | 78 | flaut |
| `l2` | Malul | 62 (Re) | majora | 84 | |
| `l3` | Dealul | 65 (Fa) | majora | 92 | flaut |
| `l4` | Cascada | 55 (Sol) | "sus" (fara terta) | 76 | flaut, clopotei |
| `l5` | Drumul Apusului | 58 (Si bemol) | majora | 80 | flaut |
| `boss` | Ciori | 62 (Re) | minora | 112 | shaker |
| `duel` | mini-luptele | 64 (Mi) | minora | 104 | shaker |
| `ending` | festivalul | 60 (Do) | majora | 72 | flaut, clopotei |

Scarile: `MAJ = [0, 2, 4, 7, 9]`, `MIN = [0, 3, 5, 7, 10]`, `SUS = [0, 2, 5, 7, 9]`. Toate sunt pentatonice: cinci note care suna bine in orice combinatie. Nu poate iesi o nota "gresita".

`makeSong(p)`:

1. Face trei motive (`A`, `B`, `C`) de cate 8 pasi. Fiecare pas urca sau coboara cu 0, 1 sau 2 trepte. Unii pasi impari sunt pauze (42%).
2. `E` este `A` cu un final care coboara pe nota de baza: suna a "sfarsit de fraza".
3. Melodia are 8 masuri: `A B A E C B A E`.
4. Basul alege una din trei progresii de 8 masuri.
5. Un pas dureaza o optime: `60 / bpm / 2` secunde.

`schedule(st, t)` canta pasul `st` la timpul `t`: nota melodiei pe kalimba (o octava mai sus), basul pe marimba (o octava mai jos) pe pasii 0, 4 si uneori 6, un clopotel la fiecare 4 masuri, flautul la masurile pare, shaker-ul pe fiecare pas la boss. Fiecare nota are o mica abatere de timp (`hum`, pana la 6 ms), ca sa nu sune mecanic.

`tick()` ruleaza la 50 ms (`setInterval`) si programeaza notele care urmeaza in urmatoarele 250 ms. Asta e tehnica standard pentru muzica in Web Audio: timpul real vine de la ceasul audio, nu de la cadre, deci muzica nu se poticneste cand jocul are un cadru lent.

`music(key)` schimba piesa. Cu aceeasi cheie nu face nimic, deci se poate apela fara grija.

## Sunetele ambientale

`AMBS` spune ce se aude in fiecare loc:

| Loc | Pasari | Apa | Vant | Greieri | Bufnita |
|---|---|---|---|---|---|
| title | 0.3 | | | | |
| l0 pajiste | 0.4 | | | | |
| l1 padure | 0.5 | | | | da |
| l2 mal | 0.25 | 0.6 | | | |
| l3 deal | 0.15 | | 0.7 | | |
| l4 cascada | 0.2 | 1 | | | |
| l5 apus | 0.08 | | 0.25 | da | |
| boss | | | 0.35 | da | |
| ending | | | | da | |

- Apa si vantul sunt doua zgomote continue filtrate (`bedW`, `bedA`), cu volumul care urca lin in 0.8 s.
- Pasarile sunt 2 pana la 4 ciripituri scurte (sinus 2300 pana la 4000 Hz care aluneca).
- Greierii sunt 7 impulsuri foarte scurte la 4100 pana la 4600 Hz, la fiecare 1.1 pana la 2.7 secunde.
- Bufnita: doua note joase (370 si 350 Hz) care coboara.

Sunetele mici (pasari, greieri, bufnita) tac cat timp muzica e coborata (`duck < 0.9`), adica in timpul povestii si al pauzei.

In mini-lupte se schimba doar muzica, nu si ambientul nivelului.

## Efectele

Lista completa, cu codul fiecaruia, este in [anexa E](anexe/E-sunete.md). Fiecare efect primeste `(bus, timp, valoare)`.

Efectele sunt in doua grupe. Grupa decide ce volum le controleaza si unde se aud.

**Personaje** (`CHR`, volumul "Sunete personaje", pot merge in difuzorul controllerului):

| Efect | Cand | Sunetul |
|---|---|---|
| `egg` | un ou luat | doua note de kalimba. Nota urca odata cu seria (`combo`): oua luate repede una dupa alta fac o mica melodie |
| `star` | o stea | cinci clopotei care urca |
| `giant` | oul urias | sapte clopotei si kalimba |
| `stomp` | tropaitul | "thump": sinus 95 Hz care coboara la 42 Hz + zgomot grav |
| `kick` | sutul | "pok": sinus 210 Hz (mai sus cu puterea) care coboara |
| `bounce` | mingea sare de un obstacol | "tic" mic |
| `bonk` | eroul e lovit | "bonk": sinus care coboara de la 330 la 150 Hz + o nota de marimba |
| `drop` | eroul scapa un ou | trei note care coboara |
| `squelch` | pas prin noroi | zgomot grav scurt |
| `step` | fiecare pas | Bubu: un "bum" grav la 118 Hz. Leo: un "tic" mai sus la 205 Hz. Piciorul stang si drept au tonuri putin diferite. |
| `vGo` | inainte de tropait sau de un sut puternic | silaba "hop!" |
| `vOw` | lovit | "au-uu" |
| `vYay` | serie de oua, paznic lovit, nivel terminat | "iu-huu!" |
| `vWow` | stea, oul urias | "uaaau" |
| `vHide` | intra in adapostul din cuib | "ih-ih" |

**Lume** (volumul "Sunete ambientale"): `wake` (gandac trezit), `stun`, `pop`, `rustle` (frunze), `butterfly`, `wave` (val nou), `win`, `caw` (Ciori), `whoosh` (vant), `swish`, `lantern`, `firework`, `ui` (meniu), `ok`, `thud`, `goal`, `crack` (oul la festival), `splash`, `tonk` (mingea ricoseaza dintr-un paznic neobosit), `warn` (paznicul se pregateste), `squeak` (paznic lovit), `tired`, `duel` (inceputul luptei), `flee` (paznicul fuge).

### `Snd.play(nume, valoare, erou)`

```js
Snd.play('egg', P.combo, k);   // sunetul eroului k
Snd.play('rustle');             // sunet de lume
```

Daca efectul e de personaj si eroul are un difuzor ales, merge acolo. Altfel merge pe `chrBus` sau `ambBus`. Orice eroare dintr-un efect e prinsa si scrisa in consola, ca un sunet stricat sa nu opreasca jocul.

## Difuzorul controllerului

Ceruta in al doilea update: "personajele sa scoata niste sunete (care atunci cand e controllerul conectat sa se auda in controller)".

Ce stie browserul: Gamepad API nu are nicio functie de sunet. Singura cale este ca macOS sa arate controllerul ca dispozitiv audio. Atunci Chrome il vede ca iesire audio si un `AudioContext` poate canta acolo cu `setSinkId`. DualShock 4 are difuzor si mufa doar prin cablu USB, nu prin Bluetooth.

Cum e facut:

- `canSink()`: verifica daca browserul are `AudioContext.setSinkId` si `enumerateDevices`.
- `listOutputs(ask)`: cere permisiunea de microfon (fara ea Chrome nu da numele dispozitivelor), apoi listeaza iesirile audio. Intoarce `{ list, denied }`.
- `setSink(k, dev)`: creeaza un `AudioContext` nou legat de difuzorul ales (unul per dispozitiv, pastrate in `sinks`), cu un compresor. Sunetele eroului `k` merg acolo. Volumul e "Sunete personaje" x 1.6 (difuzorul controllerului e mic).
- `swapOuts()`: cand jucatorii schimba personajele, difuzoarele se schimba si ele.
- `restoreSpeakers()` (in `09-screens.js`): la pornire cauta din nou difuzorul salvat dupa nume.

Nu a putut fi testat cu un controller real. Vezi `19-limitari.md`.

## `Voice`

Citeste cu voce povestea fiecarui nivel si cateva replici (Ciori isi cere iertare, festivalul). Foloseste `speechSynthesis`, adica vocile instalate in macOS.

- `pick()` alege vocea: mai intai una locala in limba aleasa (`ro` sau, pentru engleza, `en-US`/`en-GB`), apoi orice voce in limba aleasa. Se reapeleaza cand Chrome termina de incarcat vocile (`voiceschanged`) si cand se schimba limba.
- `say(text, keep)` imparte textul in propozitii si le citeste una dupa alta. `keep` adevarat nu opreste ce se citea inainte.
- Viteza `CONFIG.voiceRate` (0.9), inaltime 1.08 (putin mai sus, mai prietenos). Volumul urmeaza "Sunete personaje".
- Daca nu exista voce, ecranul de start scrie "Fără voce în română" si nu se aude nimic. Vocea romaneasca de pe Mac se numeste Ioana si se instaleaza din Setari sistem.

## Functiile publice ale lui `Snd`

| Functie | Ce face |
|---|---|
| `init()` | Construieste sau reporneste sunetul. |
| `play(nume, valoare, erou)` | Canta un efect. |
| `music(cheie)` | Schimba muzica (si ambientul, cu exceptia lui `duel`). `null` opreste. |
| `ambience(cheie)` | Schimba doar ambientul. |
| `setVol(cheie, v)` | `'music'`, `'amb'` sau `'chr'`, intre 0 si 1, rotunjit la 0.1. |
| `setDuck(d)` | Coboara muzica temporar. |
| `vol` | Volumele de acum. |
| `ready` | Adevarat daca sunetul ruleaza. |
| `canSink`, `listOutputs`, `setSink`, `swapOuts` | Difuzorul controllerului. |
| `names()`, `debug()` | Pentru teste. |
