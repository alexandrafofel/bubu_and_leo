# 17. Testare

> **Din 18 noiembrie 2026 exista un singur joc: "Cea mai grea luptă".** "Bubu și Leo" a fost scos (vezi `16-decizii.md`, "Un singur joc"). Orice schimbare se face doar in "Cea mai grea luptă". Ce scrie mai jos despre primul joc, despre alegerea jocului sau despre "ambele jocuri" este istoric.

Jocul nu are teste unitare. Are scripturi care deschid jocul intr-un Chrome fara fereastra (Playwright), il joaca cu boti, apasa taste reale, simuleaza controllere si fac capturi de ecran. Un test trece cand termina cu `errors 0`: nicio eroare in consola si nicio exceptie in pagina.

## Ce iti trebuie

- Node.js 18 sau mai nou.
- Playwright: `npm install playwright` si apoi `npx playwright install chromium`.
- Optional, doua variabile de mediu, citite in `tests/pw.js`:
  - `PLAYWRIGHT`: calea pachetului playwright, daca nu e instalat normal.
  - `CHROME`: calea unui Chrome sau Chromium anume. Fara ea se foloseste cel instalat de Playwright.

  - `JOC`: ce joc joaca testul. `bubu` (implicit) sau `lupta`.

Fisierul testat este mereu `game/bubu-si-leo-ouale-de-aur.html`. Ruleaza `./build.sh` inainte de teste.

## Cum rulezi

Toate testele, pentru joc (`JOC` nu mai conteaza), cu o linie `OK` sau `NEREUSIT` pe test:

```
./build.sh
tests/toate.sh          # cam 25 de minute
tests/toate.sh tot      # si cele 144 de mini-lupte si capturile: inca o jumatate de ora
```

Un singur test, din `tests/out/` (capturile de ecran se scriu in dosarul din care rulezi, iar `tests/out/` e ignorat de git):

```
cd tests/out
node ../joc-complet-bot.js                 # primul joc
JOC=lupta node ../joc-complet-bot.js       # al doilea joc
```

Minimul dupa orice schimbare (vezi `CLAUDE.md`): `joc-complet-bot.js`, `controller-simulat.js` si `setari-ui.js`, fiecare o singura data. Ruleaza si testul care atinge partea schimbata.

Un test a trecut daca scrie `errors 0` si nu scrie `NEREUSIT`, `GRESIT` sau `PAGEERROR`.

## Fisierele de ajutor

| Fisier | Ce face |
|---|---|
| `tests/pw.js` | Gaseste Playwright si Chrome. Da adresa `file://` a jocului. |
| `tests/toate.sh` | Ruleaza toate testele pe rand. Iesirea fiecaruia ramane in `tests/out/log-<test>-<joc>.txt`. |
| `tests/common.js` | `boot(opts)`: porneste Chrome 1920 x 1080, deschide jocul, strange erorile, face un clic (pornirea sunetului), alege jocul (`opts.game` sau `JOC`) si ajunge pe ecranul lui de start. Daca `opts.manual` nu e `false`, inlocuieste `Input.poll` cu o varianta in care testul hotaraste intrarile. |

Ce pune `common.js` la dispozitia testelor, in pagina:

| Nume | Ce face |
|---|---|
| `inp[0]`, `inp[1]` | Intrarile fiecarui erou: `{ x, y, aP, a, aR, hP, cP, c, cR, runP, run }`. `aP` = ✕ apasat acum, `a` = tinut, `aR` = eliberat, `hP` = ○ (ajuta prietenul) apasat acum, `cP` / `c` / `cR` = □ (a doua putere), `runP` / `run` = L3 (fuga). `bP` merge inca, ca alt nume pentru `hP`, pentru testele vechi. |
| `inp.pause` | `true` = OPTIONS apasat o data. |
| `joined[k]` | Daca jucatorul `k` e in joc. |
| `step(n)` | Ruleaza `n` cadre de 1/60 s, apoi deseneaza o data. |
| `go(i)` | Porneste nivelul `i` direct (0 pana la 5, 6 este boss-ul), sare peste poveste. |

Din afara paginii: `shot(nume)` face o captura `nume.png`, `done()` afiseaza erorile si inchide Chrome.

In pagina, `window.__game` (din `src/10-main.js`) da acces la tot: `Game`, `Input`, `UI`, `Save`, `CONFIG`, `Opt`, `STR`, `T`, `Snd`, `Voice`, `Perf`, `P` (nivelul curent), `GAME`, `setGame`, `buildLevel`, `genLevel`, `startPlay`, `startDuel`, `duelHit`, `openNest`, `hitHero`, `getUp`, `tryRescue`, `hurtSmall`, `kickBall`, `recallBalls`, `update`, `draw`, `openSettings`, `closeSettings`, `swapHeroes`, `settingsRows`.

## Testele

Tabelul de mai jos e din 13 noiembrie 2026, dinainte de al doilea joc. Rezultatele de acum, pentru ambele jocuri, sunt la sfarsitul capitolului, in "Rezultate dupa update-ul din 14 noiembrie 2026".

| Test | Ce verifica | Rezultat la ultima rulare (13 noiembrie 2026) |
|---|---|---|
| `joc-complet-bot.js` | Un bot joaca tot jocul, de la ecranul de start, prin cele 6 niveluri cu mini-luptele lor, boss-ul si festivalul, pana inapoi la start. Afiseaza la sfarsit ce s-a salvat. | Ajunge la festival si inapoi la start. 507 oua. `errors 0`. |
| `nivele-bot-mers.js` | Un bot merge cu adevarat (cu coliziuni, pe drumul cel mai scurt prin grila), aduna ouale, tropaie la copacii cu indiciu si se lupta cu paznicul. Pentru fiecare nivel: timpul, ouale, loviturile primite, medaliile, daca s-a blocat. | Toate 6 niveluri terminate, niciun blocaj. 75 pana la 132 s pe nivel. Lupta: 6 pana la 27 s. |
| `mini-lupte-bot.js` | Fiecare paznic in 6 situatii: Ușor/Normal, Ușor/Greu, Ușor/Ușor, doar Bubu, doar Leo, un Leo care suteaza la intamplare. Primeste optional lista de niveluri: `node tests/mini-lupte-bot.js 1,5`. | Toate 36 de lupte se termina. 18 pana la 75 s. Cel mic pe Ușor nu a fost lovit cand ajuta. |
| `controller-simulat.js` | Doua controllere false (`navigator.getGamepads` inlocuit): intrarea in joc cu ✕, dificultatea cu stanga/dreapta, zona moarta, tropait, sut, vibratii, pauza, deconectare si reconectare. | `errors 0`, 9 vibratii cerute. |
| `setari-ui.js` | Meniul de Setari cu taste reale si controllere false: limba, volume, vibratii, pagina jucatorului, schimbarea tastelor (si refuzul tastelor rezervate), pagina controllerului, schimbarea personajelor, mouse-ul, salvarea si refacerea dupa reincarcare. Face capturi `u_*.png`. | `errors 0`. Setarile revin dupa reincarcare. |
| `tastatura-reala.js` | Doar tastatura, cu apasari reale: intrare, start, mers, tropait, pauza cu Esc, schimbarea unei taste in timpul jocului, mers cu tasta noua. | Tasta veche nu mai merge, cea noua da. `errors 0`. |
| `pauza-setari-engleza.js` | Pauza, Setari din pauza, limba engleza in timpul jocului, schimbarea personajelor in timpul jocului. Capturi `q_*.png`. | `errors 0`. |
| `capturi-ecran.js` | Capturi `p_*.png` cu bara de progres, sageata, fiecare paznic in fiecare stare, cuibul deschis, finalul de nivel cu medalii, povestea in engleza, pauza. | Verificate cu ochiul. |
| `sunete-volum.js` | Porneste fiecare efect sonor, fiecare voce a personajelor, muzica si ambientul, si masoara varful semnalului la iesire. | Niciun sunet peste 0.7. Vocile intre 0.06 si 0.11 (inainte de cresterea x2.1). Muzica 0.16 pana la 0.20. |
| `performanta.js` | Timpul mediu pe cadru, cu si fara cele doua desene pe tot ecranul. | 23.1 ms pe cadru, 6.7 ms fara cele doua desene mari. Versiunea dinainte de update, masurata in aceeasi zi pe aceeasi masina: 21.6 si 4.8 ms. Cifra veche din acest tabel (10.9 ms) era de pe o masina mai rapida. |
| `performanta-lupta.js` | Timpul pe cadru in timpul unei mini-lupte. | 20.9 ms medie, 31.1 ms maxim (lupta de la cuib, aceeasi masina ca mai sus). |
| `numara-elemente.js` | Numara obiectele din fiecare nivel. Baza pentru cerinta "minim 10.000 de elemente" din update-ul urmator. | 11.430 de obiecte in total, peste 10.000: OK (decorul e 1700 pe nivel, 10.200 din total). |

### Despre timpii masurati

Testele ruleaza fara placa video (SwiftShader, desen facut de procesor). Pe un Mac real, cu placa video, timpii sunt mult mai mici. Un cadru are voie sa dureze 16.7 ms pentru 60 de cadre pe secunda.

### Despre timpul de joc

Botii sunt mult mai rapizi decat copiii: merg drept la tinta si nu se opresc. Un nivel de 75 pana la 132 s pentru bot inseamna probabil 3 pana la 6 minute pentru copii. Acesta este o estimare, nu o masuratoare.

## Ce nu poate fi testat aici

Vezi `19-limitari.md`. Pe scurt: controllere reale, vibratia reala, sunetul ascultat de un om, difuzorul controllerului, vocea in romana a Mac-ului, timpul real al copiilor.

## Cand adaugi un test

1. Copiaza un test apropiat. Foloseste `require('./common.js')`.
2. Pune un comentariu pe prima linie: ce verifica.
3. Termina cu `await done()`, ca sa apara `errors N`. Daca testul verifica ceva anume, scrie `NEREUSIT` cand nu iese.
4. Adauga-l in tabel si in `tests/toate.sh`.
5. Foloseste `__game.CONFIG.heroes`, `T()` si `P.L` in loc de nume scrise de mana: acelasi test trebuie sa mearga in ambele jocuri.

Teste noi din update-ul 13 noiembrie 2026:

| Test | Ce verifica | Rezultat |
|---|---|---|
| `cuib-adapost.js` | Cuibul protejeaza un erou: nu pierde oua, nu e impins de vant, nu e lovit. | OK |
| `mingi-leo.js` | Sutul lui Leo trage 8 sau 12 mingi in cerc, le cheama inapoi, are cooldown. | OK |
| `sunete-personaje.js` | 30 de cuvinte distincte per personaj, varfuri de volum in limita. Ruleaza ~2 min. | OK, varfuri intre 0.07 si 0.32. |
| `ordine-nivel.js` | Ordinea pe nivel si pe bara de progres: val 1, val 2, lupta din mijloc, val 3, lupta de la cuib, cuib. Bannerul luptei din mijloc. | OK |
| `mini-lupte-bot.js` (schimbat) | Joaca acum ambele lupte pe fiecare nivel, in 6 feluri: 72 de lupte. Scrie `mini-lupte OK` sau `NEREUSIT`. Al doilea argument alege lupta: `node tests/mini-lupte-bot.js 0,1 mid`. | 72 din 72 castigate. |

Testele de sunet (`sunete-volum.js`, `sunete-personaje.js`) se ruleaza singure. Pornite in acelasi timp cu alte teste, masoara varfuri gresite si pot pica fara motiv.

## `hud-acoperire.js`

Adaugat pe 16 noiembrie 2026, ca sa masoare bug-ul C10 din `23-update-partea-a-doua.md`: cat de des acopera scrisul de sus un erou. Pentru fiecare nivel aseaza eroii in doua feluri (amandoi in aceeasi celula libera, pentru toate celulele; apoi 400 de perechi de celule alese la intamplare), pune camera unde o pune jocul si se uita daca dreptunghiul unui erou (corp si nume, 190 de unitati) atinge banda de sus.

Testul intreaba jocul cat e banda (`__game.HUD_TOP`) si unde pune camera (`__game.camTarget`). Daca nu le gaseste, foloseste dreptunghiurile de dinainte de reparare.

Din 18 noiembrie 2026 bug-ul e reparat (sarcina T1): testul e in `tests/toate.sh`, se ruleaza cu `STRICT=1` si trebuie sa scrie **0%** peste tot. Inainte scria 6.5 - 47% pentru HUD si pana la 50.2% pentru bannerul de lupta. Vezi `24-sisteme-noi.md`, S6.

## Rezultate dupa update-ul din 14 noiembrie 2026

Toate testele au fost rulate pe fisierul final, pentru fiecare joc (`tests/toate.sh tot`). Toate au terminat cu `errors 0`.

| Test | Ce verifica (nou sau schimbat) | Bubu și Leo | Cea mai grea luptă |
|---|---|---|---|
| `alege-jocul.js` (nou) | Ecranul "Alege jocul" cu taste reale si mouse; eroii, textele si boss-ul fiecarui joc; progres separat; jocul ales ramane dupa repornire. | OK (un singur test pentru amandoua) | |
| `joc-complet-bot.js` | Tot jocul, de la "Alege jocul" pana la final si inapoi. Botul ajuta cu □ cand prietenul e lovit. | OK. 10 eroi ajutati. | OK |
| `controller-simulat.js` | Doua controllere false, fara mouse si fara tastatura: alegerea jocului, intrarea, mersul, puterea, □, pauza, deconectarea. | OK | OK |
| `setari-ui.js`, `tastatura-reala.js`, `pauza-setari-engleza.js` | Ca inainte, pornind de la "Alege jocul". Randul nou "Ajută prietenul" la taste. | OK | OK |
| `nivele-bot-mers.js` | Botul merge prin fiecare nivel. Niciun blocaj. | 6 din 6. 88 pana la 161 s pe nivel. | 6 din 6. 85 pana la 131 s pe nivel. |
| `mini-lupte-bot.js` | 72 de lupte pe joc, cu regula ajutorului. | 72 din 72. 9 pana la 124 s. | 72 din 72. 11 pana la 114 s. |
| `salvare-prieten.js` (nou) | Eroul lovit sta pe loc, scapa un ou, nu e lovit din nou si nu se ridica singur. □ de prea departe nu ajuta. Primul erou ajuta doar de aproape, al doilea de departe cu mingea magica. Un singur jucator: regula veche. Amandoi jos: se ridica singuri. In lupta: paznicul asteapta, apoi ataca din nou. | OK | OK (si: eroul se face mic si creste la loc) |
| `inamici-mici.js` (nou) | Prima lovitura: ametit, cu o inima. A doua: dispare. Un sut cu 8 mingi = o lovitura. Reapare dupa `respawn`, dar nu langa un erou. | OK | OK |
| `cuib-amandoi.js` (nou) | Cu un singur erou in cuib nivelul nu se termina, nici dupa 30 de secunde. Cu amandoi se termina. Un singur jucator termina singur. | OK | OK |
| `cuib-adapost.js`, `mingi-leo.js`, `ordine-nivel.js` | Ca inainte. | OK | OK |
| `numara-elemente.js` | Minimum 10.000 de obiecte. | 11.430 | 11.462 |
| `sunete-personaje.js` | Minimum 30 de cuvinte pe erou, toate diferite, niciunul la fel cu ale celuilalt joc, niciunul prea incet. | 33 pe erou. Varfuri 0.36 pana la 1.08. | 33 pe erou. Varfuri 0.37 pana la 1.1. |
| `sunete-volum.js` | Fiecare efect, melodie si ambient porneste. | OK. Cel mai tare efect 0.7, muzica 0.17. | OK |
| `sunete-controller.js` (nou) | Cu doua iesiri audio false, una pe erou: fiecare efect si cuvant al unui erou ajunge in iesirea lui si nu in boxe. | OK | OK |
| `sunete-limita.js` (nou) | Ce ajunge la boxe, dupa limitator: nimic peste 0.98, niciun cuvant sub 0.1. | OK. Cuvinte 0.55 pana la 0.69, mai multe sunete deodata 0.76. | OK. Cuvinte 0.58 pana la 0.71, deodata 0.74. |
| `performanta.js` | Timpul mediu pe cadru, fara placa video. | 16 pana la 24 ms (doua rulari) | 19 ms |
| `performanta-lupta.js` | Timpul pe cadru in mini-lupta de la cuib. | 17.6 ms medie, 24.7 maxim | 22.3 ms medie, 41.9 maxim |
| `capturi-ecran.js` | Capturi `p_*.png`, si cu regulile noi: `p_ajutor_asteapta`, `p_ajutor_minge`, `p_ajutor_aproape`. | Verificate cu ochiul. | Verificate cu ochiul. |

Despre timpii pe cadru: masina de test nu are placa video si nu e mereu la fel de libera. Aceeasi masuratoare a dat 16.4 si 23.9 ms la o ora distanta. Al doilea joc nu e mai lent decat primul la un nivel obisnuit. In lupta de la cuib are varfuri mai mari (41.9 ms), de la scanteile si undele lui George. Pe un Mac cu placa video nu a fost masurat.

Despre varfurile vocilor: 0.36 pana la 1.1 sunt masurate inainte de compresor, ca sa poata fi comparate cu cele vechi (0.03 pana la 0.2). La boxe ajung intre 0.5 si 0.71.

## Update 18 noiembrie 2026: capitole (sarcina T5)

| Test | Ce verifica | Bubu și Leo | Cea mai grea luptă |
|---|---|---|---|
| `capitole.js` (nou) | Cu taste reale, apoi doar cu controllere false: un singur buton ("Începe!") la prima pornire; trei butoane dupa nivelul 1, "Continuă" ales din start; lista de capitole, incuiate si deschise; ✕ pe unul incuiat nu porneste nimic; un capitol rejucat pastreaza cel mai bun rezultat si nu muta "Continuă"; totalul de la inceputul unui capitol e suma celorlalte; o lovitura la inceputul unui capitol nu scapa cristale aduse; "Reia nivelul" si "Capitole" din pauza, fiecare cu intrebare si "Nu" ales din start; "Joc nou" cu "Nu" si cu "Da" (celalalt joc ramane neatins); o salvare versiunea 3 (totalul nu scade); un rand de 7 cartonase acum si doua randuri cand al doilea joc va avea 12 niveluri; progresul ramane dupa final; Enter pe ecranul Capitole sau in pauza nu il baga pe al doilea erou in joc. | OK (50 de verificari) | OK |

Testul a fost verificat ca poate pica: cu salvarea care tine ultimul rezultat in loc de cel mai bun si cu tastatura pornita pe ecranul Capitole, scrie `NEREUSIT` la exact acele puncte.

Doua teste vechi s-au schimbat, pentru ca foloseau salvarea veche: `alege-jocul.js` (pregateste progresul in forma noua) si `salvare-prieten.js` (o lovitura scapa doar cristale adunate in capitolul acesta, deci testul ii da capitolului 5 cristale inainte).

Rezultat, `tests/toate.sh` pe codul final: toate testele OK, pentru ambele jocuri. `capturi-ecran.js` (primul joc): `errors 0`, capturi privite. Nu au fost rulate din nou: `mini-lupte-bot.js` (sarcina nu atinge luptele) si `capturi-ecran.js` pentru al doilea joc.

## Update 18 noiembrie 2026: banda de sus (sarcina T1)

| Test | Ce verifica | Bubu și Leo | Cea mai grea luptă |
|---|---|---|---|
| `hud-acoperire.js` (acum in `tests/toate.sh`, cu `STRICT=1`) | Niciun erou nu ajunge sub banda de sus, pe niciun nivel, in nicio asezare. | 0% peste tot | 0% peste tot |

Masuratoarea de dinainte si de dupa, pe aceeasi masina (procent din asezari in care un erou e acoperit, HUD / banner / bannerul de lupta):

| Cum stau eroii | Inainte | Acum |
|---|---|---|
| Impreuna, nivelurile 1 - 4 si 6 | 6.5 - 6.7 / 12 - 12.2 / 48.8 - 50.2 | 0 / 0 / 0 |
| Impreuna, nivelul 5 | 0 / 2.2 / 43.4 | 0 / 0 / 0 |
| Departe unul de altul | 24.5 - 47.3 / 24 - 26.3 / 38.3 - 44 | 0 / 0 / 0 |

Testul a fost verificat ca poate pica: cu limita camerei scoasa din `camTarget` scrie `NEREUSIT: un erou e acoperit in 14.5% din asezari`. Pus la loc, scrie 0%.

Lupta mare nu e in test (testul merge pe nivelurile cu grila). A fost masurata separat, cu acelasi fel de socoteala: tot 0%, in ambele jocuri. Acolo camera nu s-a schimbat deloc.

Capturi privite cu ochiul, pentru fiecare joc: eroii impreuna la inceputul nivelului, eroii la marginea de sus a hartii, eroii in colturi opuse, bannerul de lupta, un banner de un rand, "Îl așteptăm pe ... în cuib!", lupta mare.

Rezultat, `tests/toate.sh` pe codul final: **toate testele OK, pentru ambele jocuri** (44 de rulari). Viteza nu s-a schimbat: `performanta.js` da 24.9 ms pe cadru, iar versiunea dinainte, masurata in aceeasi zi pe aceeasi masina, 24.8 ms. Nu au fost rulate `mini-lupte-bot.js` si `capturi-ecran.js` (cele lungi); capturile au fost facute separat, cu un script pentru banda de sus.

## Un singur joc (18 noiembrie 2026)

- `alege-jocul.js` a fost sters. In locul lui, `un-singur-joc.js`: dupa primul clic se ajunge direct la ecranul de start, cu Boon, Killer si George; Backspace nu duce nicaieri; Setarile merg; progresul e in slotul `g2` si campurile vechi raman in fisier.
- `controller-simulat.js`, `capitole.js`, `setari-ui.js`, `tastatura-reala.js`, `joc-complet-bot.js` nu mai trec prin alegerea jocului.
- `tests/pw.js` da mereu `game: 'lupta'`. Variabila `JOC` e ignorata.
- `tests/toate.sh` ruleaza fiecare test o singura data.

## Update 18 noiembrie 2026: butoanele noi si fuga (sarcina T2)

Doua teste noi, amandoua in `tests/toate.sh`.

### `control-nou.js`

Doua controllere false si taste reale. Verifica, cu numere:

| Nr | Ce verifica | Rezultat |
|---|---|---|
| 1 - 4 | ○ (butonul 1) ridica eroul lovit; □ (butonul 2) nu il mai ridica. | OK |
| 5 | □ da un singur `cP` pe apasare. | OK |
| 6 | L3 (butonul 10) da un singur `runP` pe apasare. | OK |
| 7 - 10 | Tastatura: E ridica prietenul, Q da `cP`, Shift stanga da `runP`. | OK |
| 11 | O salvare veche, fara `c` si `r`, se incarca si cele doua taste vin din `CONFIG`; `b` ramane cum era. | OK |
| 12 | Pagina "Alege tastele": 8 taste + "Tastele de la început" + "Înapoi" = 10 randuri, 976 de unitati, incape pe ecran. | OK, captura `c_taste.png` |

Verificat ca poate sa pice: cu ajutorul mutat inapoi pe `cP`, testul scrie `NEREUSIT` la pasii 3 si 8.

### `fuga.js`

| Nr | Ce verifica | Rezultat |
|---|---|---|
| 1a | Mers normal, o secunda pe teren liber (dupa 0.4 s de pornire). | 330 de unitati, exact cat `CONFIG.heroes[0].speed` |
| 1b | Fuga, la fel. | 989 de unitati (asteptat 990, adica x 3) |
| 2 | Racheta plus fuga nu trec de `maxSpeed`. | varf 1100, limita 1100 |
| 3 | Stick-ul lasat 0.35 s: fuga s-a oprit, mersul e iar 330. | OK |
| 4 | `mode: 'hold'`: fuga tine doar cat L3 e apasat. | OK |
| 5 | Fuga in opt directii, din trei locuri, pe trei niveluri, cu `dt` fortat la 0.05: 7200 de cadre (1200 din ele mai lungi de o celula) si niciun punct al drumului nu cade intr-un perete sau in apa. | OK |
| 5b | Un perete de **o singura celula**, construit anume de test, de sus pana jos, si viteza urcata la 2400: eroul nu trece prin el, din 12 pozitii de pornire. | OK |
| 6 | Lovit in timpul fugii: `h.run` devine fals. | OK |

Verificat ca poate sa pice: cu pasii mici scosi (`n = 1`), testul 5b scrie `NEREUSIT` (eroul ajunge dincolo de perete).

Nivelurile de acum nu au pereti mai subtiri de doua celule, deci fara pasii mici jocul **de azi** nu s-ar strica. Testul 5b e pentru nivelurile 7 - 12, care vor avea porti si praguri subtiri.

### Testele vechi schimbate

`controller-simulat.js` (acum apasa ○, si verifica si ca □ nu mai ridica eroul), `joc-complet-bot.js`, `mini-lupte-bot.js`, `salvare-prieten.js`, `capturi-ecran.js` si `common.js` (`inp[k].hP`, `cP`, `runP`; `bP` a ramas ca alt nume pentru `hP`).

## Update 19 noiembrie 2026: a doua putere (sarcina T3)

### `puteri-doi.js`

| Nr | Ce verifica | Rezultat |
|---|---|---|
| 1 | Boon, □ scurt: 8 oase cu `owner: 0` si `look: 'bone'`, la unghiuri egale; □ tinut o secunda: 12. | OK |
| 2 | A doua apasare cat zboara: oasele lui Boon se intorc, mingile lui Killer raman in aer. | OK |
| 3 | O aruncare de oase ia robotului o singura inima (toate cele 8 impreuna). | OK |
| 4 | Un os culege un cristal, iar culesul e trecut pe Boon. | OK |
| 5 | Killer, □: `shield` 0.85 s, robotul de langa pierde o inima, cristalele din jur vin spre el, un atac nu il loveste, dupa 0.85 s scutul se termina. | OK |
| 6 | Manusile: exact trei vibratii pe controllerul lui Killer, la cel putin 0.2 s una de alta. | OK (0.266 si 0.284 s) |
| 7 | Cat Killer se invarte, ✕ nu porneste un sut; cat Boon incarca oasele, ✕ nu porneste ghearele. | OK |
| 8 | Un erou cu `power2: null`: □ nu face nimic. | OK |
| 9 | Captura cu amandoua puterile pornite (`p_doua-puteri.png`), privita cu ochiul. | OK |

Verificat ca poate sa pice: cu oasele desenate ca mingi testul scrie `NEREUSIT` la 1b; cu o singura bataie de vibratie in loc de trei, la 6.

### Testele vechi schimbate (doar numele, nu si ce verifica)

`mingi-leo.js` (`G.throwRing`, `h.homeState`, `h.throwCd`, `recallBalls(1)`), `inamici-mici.js`, `mini-lupte-bot.js` si `salvare-prieten.js`. Numerele si verificarile au ramas aceleasi: asta e dovada ca refactorizarea nu a schimbat jocul.

In `control-nou.js` (testul butoanelor, de la T2) a fost nevoie de o linie in plus: □ porneste acum manusile lui Killer, iar cat se invart nimic nu il loveste, deci testul le opreste inainte sa verifice ca eroul poate fi lovit.

### Ce a prins rularea completa

`joc-complet-bot.js` a cazut cu "kickBall is not defined": la lupta cu boss-ul, eroul pe care nu-l joaca nimeni chema functia veche, singurul loc ramas nerenumit. Testele mici nu ajung acolo. De aceea `tests/toate.sh` se ruleaza intreg inainte de orice livrare.

## Update 19 noiembrie 2026: cele 10 secunde (sarcina T4)

### `zece-secunde.js`

| Nr | Ce verifica | Rezultat |
|---|---|---|
| 1 | La lovitura, amandoua controllerele vibreaza in acelasi cadru; numaratoarea porneste de la 10. | OK |
| 2 | Dupa 9.5 secunde eroul inca asteapta si jocul merge. Au fost cel putin 18 vibratii scurte (cate doua pe secunda). | OK |
| 3 | Ajutat la 9.5 secunde: se ridica, nu reincepe nimic. | OK |
| 4 | Neajutat: la 10 s starea e `retry`; dupa inca 2.6 s jocul e iar `play`, acelasi capitol, de la inceput, fara poveste; cristalele nivelului sunt 0 si totalul echipei e cel de la inceputul nivelului. | OK |
| 5 | Amandoi jos: numaratoarea sare la 3 secunde si nivelul reincepe. Cu `bothDownRestart: false` se ridica singuri. | OK |
| 6 | Un singur jucator: fara numaratoare, nu reincepe niciodata. | OK |
| 7 | Patru lovituri la rand fara ajutor: limitele sunt 10, 10, 10, **15**. | OK |
| 8 | Pauza la secunda 5, 20 de secunde de asteptare: numaratoarea nu scade deloc; dupa continuare scade iar. | OK |
| 9 | Capturi: numaratoarea la 3 (`z_numaratoare.png`) si ecranul "Încă o dată!" (`z_inca-o-data.png`). In cartonas: niciun pixel negru, niciun gri desenat (pana la 5 pixeli de margine moale sunt acceptati). | OK (0 si 0) |

Verificat ca poate sa pice: cu vibratia prietenului scoasa si cu `Game.failLevel()` inlocuit de "se ridica singur", testul scrie `NEREUSIT` la 8 din 9 puncte.

`tests/toate.sh` il ruleaza la fiecare rulare completa.

Verificare T14.1 (script scurt, fara test nou; `tests/cota.js` vine in T14.9): pentru nivelurile 1 - 6, 10 seminte pe nivel, toate in `[2q, 2 * cap]`. Oua pe nivel: 21, 33, 45, 57, 66, 78. Cu `extra` 1.2 jocul scrie o eroare si cade pe 60 de oua.

Verificare T14.2 (script scurt, `tests/cota.js` vine in T14.9; verificarile 3 si 10 din `27-cota-de-oua.md`): un erou plin nu ia oul (ramane pe jos, `fullT > 0`), prietenul il ia, eroul lovit fara oua nu scapa nimic si nu atinge `P.found` al prietenului, cel cu oua scapa unul cu `goal: true`, oul urias are `goal: false`. Cu `CONFIG.quota.on = false` toate cinci pica. `tests/salvare-prieten.js` da acum eroului 5 oua din cota (`P.found[0] = 5`) inainte de lovitura.

## Update 21 noiembrie 2026: `lit()` (sarcina T6.1)

Testul permanent al stilului grafic (`tests/stil-grafic.js`) se scrie la T6.10. Pana atunci, `lit()` a fost verificat cu un script de o singura data, `tests/tmp/lit-proba.js` (dosarul `tests/tmp/` nu intra in depozit). Deseneaza trei obiecte de proba pe un canvas al lui, nu pe cel al jocului: bucla jocului ar desena peste.

| Nr | Ce verifica | Rezultat |
|---|---|---|
| 1 | Lumina vine din stanga-sus (masurat pe obiectul mat, fara pata de stralucire). | OK |
| 2 | Pata de stralucire apare pe materialul lucios... | OK |
| 3 | ...si nu apare pe cel mat (`gloss: 0`). | OK |
| 4 | Umbra aruncata e in dreapta-jos si e mai inchisa decat fundalul. | OK |
| 5 | In stanga-jos nu e umbra. | OK |
| 6 | Cel care sta pe pamant are umbra de contact. | OK |
| 7 | Cu `shadow: false` nu lasa umbra aruncata... | OK |
| 8 | ...si nici umbra de contact. | OK |
| 9 | Niciun pixel gri (R, G, B egale si sub 200). | OK (0) |
| 10 | Nimic mai inchis decat `#241A3A`. | OK (0) |

### Ce a prins verificarea ca poate sa pice

Prima varianta a scriptului masura lumina **in locul petei de stralucire**. Cu gradientul inversat anume, verificarea tot trecea: masura pata alba, nu gradientul. Acum gradientul se masoara pe obiectul mat, care nu are pata. Tot atunci s-a vazut si ca `shadow: false` lasa umbra de contact desenata; verificarea de atunci masura in alt loc si n-o prindea. Ambele reparate.

**Limita cunoscuta:** regula "niciun pixel gri" din S7.8 cere `R`, `G` si `B` **egale**. Un gri desenat peste un fundal colorat iese cu canalele aproape egale, nu egale, si nu e prins. Verificat: un `rgba(80,80,80,0.9)` peste crem da `(97, 96, 94)` si trece. `tests/stil-grafic.js` (T6.10) ar trebui sa accepte si o mica abatere intre canale.

## Update 21 noiembrie 2026: materialele eroilor (sarcina T6.2)

Tot cu un script de o singura data, `tests/tmp/mat-proba.js` (nu intra in depozit; testul permanent e `tests/stil-grafic.js`, la T6.10). Pentru fiecare material deseneaza o forma de proba si **aceeasi forma fara material**, ca sa se vada exact ce adauga textura. Mai deseneaza un rand cu toate materialele pe **aceeasi culoare de baza**, ca sa le compare doar pe ele.

| Ce verifica | Rezultat |
|---|---|
| Fiecare textura se vede: difera de forma fara material (media diferentei de luminanta). | OK: scale 2.85, fabric 2.46, rubber 10.76, bone 1.06 |
| Nimic nu iese din contur: punctele din afara formei sunt identice cu cele fara material. | OK (0 la toate patru) |
| Niciun pixel gri, nimic sub `#241A3A`, in forma desenata. | OK |
| **Fiecare placa** (`SPR['mat-...']`): niciun pixel vizibil gri sau mai inchis decat `#241A3A`. | OK |
| Doua materiale oarecare, pe aceeasi culoare de baza, lasa imagini diferite (6 perechi, minim 0.7). | OK: de la 3.93 la 12.95 |
| `createPattern`: cel mult unul pe material in primul cadru, **niciunul in urmatoarele 60**. | OK: 3 si 0 |
| `scale`: textura de pe jumatatea stanga e cel putin 1.25 x cea de pe dreapta. | OK: 3.36 vs 1.8 |
| Luciul urmeaza materialul: pata de la `rubber` (0.4) e mai lata decat la `fabric` (0.05). | OK: 47 vs 33 |

### Verificat ca poate sa pice

Sapte defectiuni puse pe rand in `src/02-core.js`, fiecare prinsa de o verificare: fara `clip` (4 verificari pica, textura iese 49.9 din contur), fara cache pentru model (180 de `createPattern` noi), `rubber` care nu picteaza (diferenta 0.12), `fabric` facut la fel cu `scale` (diferenta 0.04), fara stratul din spate, `rubber` cu luciu 0.05, placa de pori neagra.

### Ce a prins verificarea in timp ce se scria

- **Doua verificari erau prea slabe** si nu picau la prima injectare. "Se deosebesc" compara materiale pe culori de baza diferite, deci doua materiale identice treceau (culorile erau diferite). Acum se compara pe aceeasi culoare. "Mai des spre spate" masura deviatia standard, adica gradientul si nu textura, si trecea si fara stratul din spate. Acum masoara forta texturii fata de forma fara material.
- **Comparatia pe aceeasi culoare dadea 4.92 pentru doua materiale identice.** Cauza: modelul e prins de coordonatele canvasului, iar obiectele erau la x diferit, deci fazele texturii difereau. Nu e o greseala in cod (la erou, `translate` o rezolva), dar scriptul trebuia sa deseneze si el dupa `translate`.
- Pata de stralucire nu e "aproape alb", e un alb translucid. Primul prag (toate canalele peste 225) dadea 0 la amandoua materialele. Acum se masoara latimea petei pe randul care trece prin ea.
- Porii de 36 x 36 se vedeau in grila pe captura. Placa a ajuns 64 x 64.

## Update 21 noiembrie 2026: materialele lumii (sarcina T6.3)

Acelasi `tests/tmp/mat-proba.js`, rulat cu toate cele zece materiale (`node ../tmp/mat-proba.js scale,fabric,rubber,bone,wood,metal,stone,crystal,leaf,lava`). Pentru cele sase noi verifica aceleasi lucruri ca la T6.2 (textura se vede, nimic in afara conturului, fara gri sau sub `#241A3A`, placile curate, toate 45 de perechi se deosebesc pe aceeasi culoare de baza, zero `createPattern` in 60 de cadre) si inca doua, pentru lava:

| Ce verifica | Rezultat |
|---|---|
| Crapaturile pulseaza: pe opt momente (la 0.4 s), media canalului verde al pixelilor de crapatura variaza cu peste 20. | OK: 51.3 |
| In niciun moment al pulsului nu apare gri sau pixel mai inchis decat `#241A3A`. | OK: 0 |
| Texturile se vad: wood 3.17, metal 7.02, stone 5.57, crystal 20.44, leaf 2.18, lava 62.17. | OK |

### Verificat ca poate sa pice

Cinci defectiuni, toate prinse: lava fara puls (span 0.0), crusta `#555555` (16642 pixeli gri), `crystal` care nu picteaza (0.11), `metal` care nu picteaza (0.12), verde crud in loc de galben (27 de pixeli prea inchisi / span 138.7 cu pixeli care apar si dispar).

### Ce a prins in timp ce se scria

- **Lava parea fixa.** Prima varianta defaza crapaturile cu 1.3 rad: sumate, se anulau, iar masuratoarea dadea span 4.2. Nu era doar testul: si pe ecran vulcanul n-ar fi parut sa pulseze. Defazajul e acum 0.45.
- **Piatra avea dreptunghiuri.** Petele taiate la marginea placii de 96 x 96 lasau margini drepte pe captura. Fiecare pata se deseneaza acum si la o placa distanta.

## Update 22 noiembrie 2026: eroii repictati (sarcina T6.4)

Un script de o singura data, `tests/tmp/eroi-proba.js`, deseneaza Boon, Killer si George, cu fata in ambele parti, pe un canvas al lui. Foaia de personaje o face `tests/tmp/foaie-personaje.js` (aceeasi asezare ca foaia veche).

| Ce verifica | Rezultat |
|---|---|
| Fara gri, pe trei momente (deschis, speriat, ametit): cel mult cat aveau pictorii vechi pe aceleasi desene (123 de pixeli) si sub 1 la 2000. | OK: 109 din 636 535 |
| Nimic mai inchis decat `#241A3A`. | OK: 0 |
| Capul lui Killer: sus-stanga mai luminos decat jos-dreapta, cu fata in ambele parti. | OK |
| Capul lui Killer: stanga mai luminoasa decat dreapta la aceeasi inaltime, si cand se uita spre stanga. | OK: 217.8 / 204.6 |
| Ochiul lui Boon: lucirea mare in stanga-sus a pupilei, in ambele directii. | OK: 255 / 55 |
| `createPattern`: niciunul in 30 de cadre dupa primul. | OK: 0 |
| Umbra: sub picioare si spre dreapta-jos, nimic in stanga. | OK |
| `performanta.js` (nivel) si `performanta-lupta.js`, fata de main in aceeasi zi. | 23,59 / 23,23 ms; 23,47 / 22,14 ms |

**Pixelii gri de margine.** Unde albastrul atinge portocaliul (tricoul langa piele, bratul albastru al lui Boon langa gatul lui), netezirea marginii da cativa pixeli aproape neutri. Pictorii vechi aveau la fel (123). De aceea testul nu cere zero, cere "nu mai mult decat inainte si nicio pata". Acelasi lucru va trebui in `stil-grafic.js` (T6.10).

### Verificat ca poate sa pice

Sapte defectiuni, toate prinse: ochi fara `flip` (lucirea trece in dreapta), `lit()` fara `flip` (capul lui Killer spre stanga e luminat din dreapta; a doua oara, dupa ce testul a primit masuratoarea pe orizontala), pictor care nu da `flip` (doua verificari), umbra in stanga, tricou gri (617 pixeli), modelul refacut la fiecare cadru (1800 de `createPattern`).

### Ce a prins verificarea in timp ce se scria

- **Prima verificare a luminii nu vedea o lumina intoarsa.** Masura sus-stanga fata de jos-dreapta; cu lumina venind din dreapta-sus, sus tot e mai luminos decat jos, si testul trecea. Acum se masoara si pe orizontala.
- **Masuratoarea ochiului pica din cauza testului:** uitase privirea (`look`) si respiratia (scara 1.02). Testul deseneaza acum la un moment cu respiratia 0.
- **Costul:** prima varianta (toate partile prin `lit()` complet) era 7,2 ms pentru cei trei, fata de 2 ms. Gasit cu o masuratoare a pictorilor singuri, inainte de `performanta.js`.
- Pe foaia de personaje: luciu pe fiecare parte, margini de lumina care pareau contururi, cusaturi pe pantaloni si maneci (prea mici), umbra langa erou in loc de sub el. Toate reparate.

## Update 22 noiembrie 2026: butonul L1 (sarcina T14.3)

Verificare T14.3: `tests/setari-ui.js` si `tests/tastatura-reala.js` trec (`errors 0`). Tasta `KeyR` (jucatorul 1) si `Period` (jucatorul 2) sunt in `CONFIG.keys` si in `KEY_FIELDS`, deci apar in pagina "Alege tastele". Testerul de controller din Setari arata L1 in coltul de sus, stanga. Un script scurt a verificat ca tasta R si valoarea implicita a salvarilor vechi merg. Pagina "Alege tastele" are acum 11 randuri (9 taste si 2 butoane); `tests/control-nou.js` si-a schimbat asteptarea de la 10 la 11 si verifica ca incape (1046 din 1048 unitati). Verificarea cu tasta R: `Input.slots[0].g` ramane adevarat cat tasta e tinuta si se intoarce la fals cand e lasata. `gP` e un front de un singur cadru, deci nu se citeste dupa o apasare lunga. Nu s-a verificat un apasat real de L1 pe un controller DualShock.
