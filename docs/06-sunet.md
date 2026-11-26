# 06. Sunet (`src/03-audio.js`)

> **Din 18 noiembrie 2026 exista un singur joc: "Cea mai grea luptă".** "Bubu și Leo" a fost scos (vezi `16-decizii.md`, "Un singur joc"). Orice schimbare se face doar in "Cea mai grea luptă". Ce scrie mai jos despre primul joc, despre alegerea jocului sau despre "ambele jocuri" este istoric.

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
| `duel2` | lupta de la cuib (aceeasi melodie, mai repede) | 64 (Mi) | minora | 116 | shaker |
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
| (fostele voci `vGo`, `vOw`, `vYay`, `vWow`, `vHide`) | inlocuite de limba personajelor, vezi mai jos | |

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
- `restoreSpeakers()` (in `09-screens.js`): la pornire cauta din nou difuzorul salvat dupa nume. Daca nu il gaseste, cere din nou permisiunea si, daca tot lipseste, scrie pe ecran (`spk.lost`).

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

## Limba personajelor (update 13 noiembrie 2026)

Fiecare erou are 30 de cuvinte inventate. Nu sunt inregistrari: sunt sintetizate in Web Audio, ca toate celelalte sunete. Cuvintele stau in `BABBLE` din `03-audio.js`: `BABBLE.bubu` are un tabel pentru Bubu si unul pentru Leo, `BABBLE.lupta` unul pentru Boon si unul pentru Killer. De la update-ul din 14 noiembrie sunt 33 de cuvinte pe erou (vezi sfarsitul capitolului).

**Un cuvant** este o lista de silabe. Fiecare silaba: `[vocala, semitonuri, durata, alunecare]`.

- Vocala (`a`, `e`, `i`, `o`, `u`) dau doua filtre bandpass (formantii, din `FORM`). Pentru Bubu formantii sunt x 0.85 (mai rotund), pentru Leo x 1.15 (mai luminos).
- Nota: `BASE` (Bubu: nota 43, Leo: nota 62) plus semitonurile silabei.
- Sursa: de la update-ul din 14 noiembrie, doua unde triunghi (nota si octava ei), cu anvelopa 0.015 s atac si coada de 0.05 s. Nivel 0.62 pe silaba, inmultit pe erou. Varful, masurat inainte de compresor: 0.36 pana la 1.1 (testat). Inainte era o singura unda, nivel 0.3, si vocile abia se auzeau: vezi sfarsitul capitolului.

**Personalitate.** Bubu: voce joasa, lenta, cu alunecari in jos. Leo: voce sus, rapida, cu alunecari in sus. Niciun cuvant nu are consoane: doar vocale, ca sa nu sune a vorbire reala.

**Cuvinte cu mai multe variante.** `egg` are trei variante, alese la intamplare fara sa repete una imediat dupa alta.

**Prioritate** (`TALK_PRIO`). 3 = taie orice cuvant in curs, 2 = taie doar cuvintele mai slabe, 1 = se aude doar daca eroul tace.

| Cuvant | Prioritate | Cand se aude |
|---|---|---|
| `hello` | 3 | inceputul nivelului, dupa poveste |
| `ready` | 3 | ✕ pe ecranul de start, sau cand alege pe ecranul controllerului |
| `egg` | 1 | un ou luat (una din trei ori, ca sa nu oboseasca) |
| `eggs5` | 2 | al patrulea ou luat repede, la rand |
| `star` | 3 | o stea |
| `giant` | 3 | oul urias |
| `power` | 2 | tropait sau sut usor |
| `powerBig` | 3 | sut incarcat (peste 0.8) |
| `hurt` | 3 | eroul e lovit |
| `dizzy` | 2 | dupa 0.9 s de la lovitura, cat se rotesc stelele |
| `recover` | 2 | isi revine din ameteala |
| `drop` | 2 | scapa un ou (aceeasi lovitura, de obicei taiat de `hurt`) |
| `regain` | 2 | ia inapoi oul scapat |
| `hide` | 2 | intra in cuib |
| `unhide` | 1 | iese din cuib |
| `beetleWake` | 2 | un gandac se trezeste langa erou |
| `beetleStun` | 2 | un gandac e ametit de tropait sau de minge |
| `wind` | 2 | incepe vantul (spune primul erou) |
| `mud` | 1 | intra in noroi |
| `bridge` | 1 | urca pe pod |
| `butterfly` | 3 | fluturele il prinde |
| `guardHit` | 3 | paznicul e lovit (fara ultima lovitura) |
| `notYet` | 1 | lovitura nu conteaza inca |
| `guardGone` | 3 | ultima lovitura, paznicul fuge |
| `bored` | 1 | sta pe loc 8 s |
| `callFriend` | 1 | prietenul e departe (peste 1200 unitati) de 5 s |
| `together` | 2 | se regasesc (dupa ce au fost departe, acum sub 250) |
| `nestOpen` | 3 | cuibul se deschide |
| `levelWin` | 3 | nivelul e terminat |
| `bossDown` | 3 | Ciori cade din copac |

**Cum se apeleaza.** `Snd.talk(k, 'cuvant')`: eroul `k` spune cuvantul. Ruteaza ca restul sunetelor eroului (pe difuzorul controllerului, daca a ales unul) si merge pe volumul "Sunete personaje". `Snd.words()` da tabelele, ca sa se poata asculta si schimba usor.

**Ce lipseste.** Optiunea "Personajele vorbesc" din Setari nu exista inca: se schimba doar `CONFIG.babble`. Vezi `19-limitari.md`.

## Update 14 noiembrie 2026

### De ce nu se auzeau personajele, si ce s-a schimbat

Cererea: "La bubu si leo nu se aud sunetele personajelor in console - repara bug-ul."

Masurat cu `tests/sunete-volum.js` pe versiunea veche: cuvintele lui Bubu aveau varful intre 0.03 si 0.065, ale lui Leo intre 0.05 si 0.2. Muzica avea 0.17, tropaitul 0.9. Vocea lui Bubu era sub muzica. Cresterea "x 2.1" din update-ul trecut nu fusese destula.

| Schimbare | Unde | Ce face |
|---|---|---|
| Silabe mai pline | `syl()` | Doua unde triunghi (nota si octava), filtre de "gura" mai largi (Q 2.2 in loc de 4), putin din nota curata, castig 0.62 x `VOICES[joc][erou].gain`. |
| Difuzor mic | `bus.small`, `smallUp(bus, f)` | Pe un difuzor ales care nu e al calculatorului, notele sub 260 Hz urca o octava, cele sub 130 Hz doua. Zgomotele joase urca si ele. Iesirea are trece-sus la 200 Hz, o ridicare la 2400 Hz si compresor. |
| Un pas inainte | `bus.lead` | Pe a doua iesire audio, fiecare sunet e programat cu latenta iesirii plus 30 ms (minimum 40 ms) mai tarziu. Un sunet scurt nu mai poate incepe intr-un bloc deja trimis. |
| Difuzorul pierdut se vede | `restoreSpeakers(true)`, `UI.spkLostT` | Vezi mai sus. |
| Alegere automata | `findSpeakers()` | Un difuzor cu "controller", "DualShock", "DualSense" sau "gamepad" in nume e ales pe loc dupa cautare. |
| Proba | randul "Încearcă sunetul" | Spune `hello` si canta doua efecte ale eroului, pe iesirea lui. |

`bus.small` se hotaraste dupa numele dispozitivului: tot ce nu se numeste built-in, MacBook, iMac, display, HDMI, AirPods, headphone, căști sau boxe e socotit difuzor mic.

Varfuri masurate dupa schimbare, in acelasi loc ca inainte (la `master`, inainte de compresor): cuvintele 0.36 pana la 1.1 pentru toti cei patru eroi. Cel mai tare efect, tropaitul, are 0.7. Muzica are 0.17.

### Limitatorul de la iesire: `toSpeaker(a, nod)`

Cu vocile mai tari, un cuvant, un tropait si muzica in acelasi moment treceau de 1 la iesire (masurat: 1.4 pana la 1.5). Peste 1 sunetul se rupe si devine aspru, adica exact ce interzice regula 5. De aceea ultimul lucru dinaintea oricarui difuzor (boxele calculatorului si difuzorul unui controller) este acum un limitator: un `DynamicsCompressor` cu prag -8 dB, raport 20, atac 2 ms, urmat de un castig de 0.85.

Masurat cu `tests/sunete-limita.js`, dupa limitator: fiecare cuvant intre 0.5 si 0.71, mai multe sunete tari deodata peste muzica cel mult 0.77. Nimic nu mai trece de 1.

| Unde masori | Test |
|---|---|
| Inainte de compresor (cat de tare e fiecare sunet fata de celelalte) | `sunete-volum.js`, `sunete-personaje.js` |
| Dupa limitator (ce ajunge la boxe) | `sunete-limita.js` |
| In iesirea aleasa pentru un erou (difuzorul controllerului) | `sunete-controller.js` |

### Trei cuvinte noi pe erou (33 in total)

| Cuvant | Prioritate | Cand se aude |
|---|---|---|
| `help` | 3 | eroul lovit, cat asteapta, la fiecare `rescue.callEvery` secunde |
| `rescue` | 3 | eroul care ajuta, cand apasa □ si e destul de aproape |
| `thanks` | 3 | eroul ridicat |

`notYet` se aude acum si cand □ e apasat de prea departe. `dizzy` si `recover` se aud doar cand eroul se ridica singur (un singur jucator).

### Sunetele celui de-al doilea joc

- `BABBLE.lupta`, `VOICES.lupta`: limba lui Boon (joasa, cu maraituri scurte) si a lui Killer (sus, sacadata). 33 de cuvinte fiecare. Niciun cuvant nu e la fel cu unul din primul joc (testul compara silabele).
- `fx2`: efecte care iau locul celor cu acelasi nume cand `GAME` e `lupta` (ghearele in loc de tropait, cristalul in loc de ou, robotul, urletul lui George, racheta, torta ...). `Snd.play('stomp')` canta singur varianta potrivita. `Snd.names2()` le listeaza.
- `growl()`: piesa noua pentru urlete. Unda triunghi joasa, cu tremur si filtru trece-jos. Nu e patrata si nu e aspra (regula 5).
- Melodiile si ambientul: `SONGS['L:title']`, `SONGS['L:l0']` ... `SONGS['L:boss']` si `AMBS['L:...']`. `Snd.music(nume)` cauta intai varianta `L:` cand se joaca al doilea joc.
- Efecte noi comune: `heal` (prietenul e ridicat) si `poof` (un inamic mic dispare). Amandoua au si o varianta in `fx2`. Mingea magica pleaca cu sunetul de sut (`kick`).

Lista completa a efectelor, cu varfurile, e in anexa E.

## Update 18 noiembrie 2026

Efect nou in `fx`: `no`, doua note moi de kalimba care coboara o terta mica (sol, mi). Se aude cand se alege un capitol incuiat. Nu e un sunet de greseala aspru: spune doar "inca nu".

## Update 18 noiembrie 2026 (T2): sunetul fugii

- Sunetul nou `dash`: un "fiu" scurt si moale (zgomot trece-banda care urca de la 500 la 2100 Hz in 0.17 s, plus o sinusoida 330 - 760 Hz). E sunetul unui personaj (`CHR`), deci merge in difuzorul controllerului lui.
- Cuvantul nou `run` pentru Boon si pentru Killer, ca orice alt cuvant al lor. Se aude cel mult o data la `CONFIG.sprint.wordGap` (6) secunde.
- `Snd.play(nume, valoare, erou, volum)` are un al patrulea argument: un volum intre 0 si 1 pentru o copie mai inceata a aceluiasi sunet. Folosit de pasii din fuga (0.8), ca sa nu acopere restul.

## Update 19 noiembrie 2026 (T3): sunetele celei de-a doua puteri

| Sunet | Cand | Cum e facut |
|---|---|---|
| `bone` | Boon arunca oasele | Trei note de triunghi care coboara (180, 160, 140 Hz), fiecare cu un tremur de 14 Hz, plus un zgomot scurt trece-banda. |
| `tock` | un os atinge un perete | Sinus 520 -> 430 Hz, coada scurta, cu un clic filtrat. Cel mult 3 pe secunda, ca la mingi. |
| `gloves` | Killer porneste manusile | Doua "fuip" care urca (zgomot trece-banda 500 -> 1400 Hz) si un scartait moale de cauciuc (sinus 900 -> 700 Hz). |

Toate trei sunt sunete de personaj (`CHR`), deci merg in difuzorul controllerului eroului.

`osc(...)` are acum optiunea `trem`: o unda lenta peste volum, pentru note care tremura (folosita de `bone`).

Cuvinte noi pentru Boon si pentru Killer: `power2` si `power2Big` (a doua putere, si varianta incarcata).

## Update 19 noiembrie 2026 (T4): sunetele celor 10 secunde

| Sunet | Cand | Cum e facut |
|---|---|---|
| `click` | un mecanism inainte sa se miste (T6.9) | Triunghi 1250 -> 900 Hz, 0.045 s, plus putin zgomot trece-banda 2600 Hz: un "tic" moale de lemn. Sunet al lumii, nu al unui erou. |
| `tick` | la fiecare secunda a numaratorii | Sinus 660 -> 580 Hz, 0.05 s: un toc moale de lemn. In ultimele 3 secunde, 880 -> 760 Hz si de doua ori pe secunda. |
| `retry` | cand nivelul reincepe | Trei note de marimba care coboara (do, sol, mi) si un clopotel la sfarsit. Blande, nu o alarma: nu e o pedeapsa. |

Cuvant nou pentru amandoi eroii: `hurry` ("repede!"), spus o data de prieten cand mai sunt 3 secunde.

## Update 26 noiembrie 2026 (T7.1): `gateOpen`

O poarta care se deschide prima oara: patru note de marimba care urca (do, mi, sol, do), un suflu moale de aer (zgomot prin trece-jos la 700 Hz) si un clopotel sus la sfarsit. Inainte de el se aude `click` (`mechClick`).

## Update 26 noiembrie 2026 (T7.2): `plate`, `plateOff`, `cage`

- `plate`: un clic de piatra (zgomot filtrat, banda 1400 - 3200) si un clopotel. Se aude cand o placa e calcata.
- `plateOff`: acelasi clopotel, mai jos. Se aude cand placa e lasata.
- `cage`: doua clicuri de lacat, apoi un arpegiu vesel (patru clopotele). Se aude cand cusca se deschide.

Toate sunt in `fx2` (`03-audio.js`), deci merg doar in "Cea mai grea luptă".

## Update 26 noiembrie 2026 (T7.4): `bridge`

O nota de sticla pentru fiecare scandura de lumina care apare. Cele sapte scanduri canta o gama (do, re, mi, fa, sol, la, si). Balansoarul nu are sunet propriu: cei doi eroi spun `levelWin` cand se leagana (cel mult o data la 4 s).
