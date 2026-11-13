# 17. Testare

Jocul nu are teste unitare. Are scripturi care deschid jocul intr-un Chrome fara fereastra (Playwright), il joaca cu boti, apasa taste reale, simuleaza controllere si fac capturi de ecran. Un test trece cand termina cu `errors 0`: nicio eroare in consola si nicio exceptie in pagina.

## Ce iti trebuie

- Node.js 18 sau mai nou.
- Playwright: `npm install playwright` si apoi `npx playwright install chromium`.
- Optional, doua variabile de mediu, citite in `tests/pw.js`:
  - `PLAYWRIGHT`: calea pachetului playwright, daca nu e instalat normal.
  - `CHROME`: calea unui Chrome sau Chromium anume. Fara ea se foloseste cel instalat de Playwright.

Jocul testat este mereu `game/bubu-si-leo-ouale-de-aur.html`. Ruleaza `./build.sh` inainte de teste.

## Cum rulezi

Din radacina depozitului:

```
./build.sh
node tests/joc-complet-bot.js
node tests/controller-simulat.js
node tests/setari-ui.js
```

Cele trei de mai sus sunt minimul dupa orice schimbare (vezi `CLAUDE.md`). Ruleaza si testul care atinge partea schimbata.

## Fisierele de ajutor

| Fisier | Ce face |
|---|---|
| `tests/pw.js` | Gaseste Playwright si Chrome. Da adresa `file://` a jocului. |
| `tests/common.js` | `boot(opts)`: porneste Chrome 1920 x 1080, deschide jocul, strange erorile, face un clic (pornirea sunetului). Daca `opts.manual` nu e `false`, inlocuieste `Input.poll` cu o varianta in care testul hotaraste intrarile. |

Ce pune `common.js` la dispozitia testelor, in pagina:

| Nume | Ce face |
|---|---|
| `inp[0]`, `inp[1]` | Intrarile fiecarui erou: `{ x, y, aP, a, aR }`. `aP` = ✕ apasat acum, `a` = tinut, `aR` = eliberat. |
| `inp.pause` | `true` = OPTIONS apasat o data. |
| `joined[k]` | Daca jucatorul `k` e in joc. |
| `step(n)` | Ruleaza `n` cadre de 1/60 s, apoi deseneaza o data. |
| `go(i)` | Porneste nivelul `i` direct (0 pana la 5, 6 este boss-ul), sare peste poveste. |

Din afara paginii: `shot(nume)` face o captura `nume.png`, `done()` afiseaza erorile si inchide Chrome.

In pagina, `window.__game` (din `src/10-main.js`) da acces la tot: `Game`, `Input`, `UI`, `Save`, `CONFIG`, `Opt`, `STR`, `T`, `Snd`, `Voice`, `Perf`, `P` (nivelul curent), `buildLevel`, `genLevel`, `startPlay`, `startDuel`, `duelHit`, `openNest`, `update`, `draw`, `openSettings`, `closeSettings`, `swapHeroes`, `settingsRows`.

## Testele

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
3. Termina cu `await done()`, ca sa apara `errors N`.
4. Adauga-l in tabelul de mai sus.

Teste noi din update-ul 13 noiembrie 2026:

| Test | Ce verifica | Rezultat |
|---|---|---|
| `cuib-adapost.js` | Cuibul protejeaza un erou: nu pierde oua, nu e impins de vant, nu e lovit. | OK |
| `mingi-leo.js` | Sutul lui Leo trage 8 sau 12 mingi in cerc, le cheama inapoi, are cooldown. | OK |
| `sunete-personaje.js` | 30 de cuvinte distincte per personaj, varfuri de volum in limita. Ruleaza ~2 min. | OK, varfuri intre 0.07 si 0.32. |
| `ordine-nivel.js` | Ordinea pe nivel si pe bara de progres: val 1, val 2, lupta din mijloc, val 3, lupta de la cuib, cuib. Bannerul luptei din mijloc. | OK |
| `mini-lupte-bot.js` (schimbat) | Joaca acum ambele lupte pe fiecare nivel, in 6 feluri: 72 de lupte. Scrie `mini-lupte OK` sau `NEREUSIT`. Al doilea argument alege lupta: `node tests/mini-lupte-bot.js 0,1 mid`. | 72 din 72 castigate. |

Testele de sunet (`sunete-volum.js`, `sunete-personaje.js`) se ruleaza singure. Pornite in acelasi timp cu alte teste, masoara varfuri gresite si pot pica fara motiv.
