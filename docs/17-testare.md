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
| `inp[0]`, `inp[1]` | Intrarile fiecarui erou: `{ x, y, aP, a, aR, bP }`. `aP` = ✕ apasat acum, `a` = tinut, `aR` = eliberat, `bP` = □ apasat acum. |
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
