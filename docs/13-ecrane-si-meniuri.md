# 13. Ecrane si meniuri (`src/09-screens.js`)

## `UI`

Starea ecranelor: cine a apasat ✕ pe ecranul de start (`seen`), cine e gata (`ready`), butonul ales pe ecranul de start (`menuSel`), intrebarea da / nu deschisa acum (`ask`), capitolul ales pe ecranul Capitole (`chSel`), timpii ecranelor (`introT`, `lvlT`, `endT`), meniul Setari (`set`), dreptunghiurile pe care se poate da clic (`hits`), clicul si pozitia mouse-ului din cadrul curent (`click`, `hover`), eroul al carui controller s-a deconectat (`lostK`).

`DIFFS = ['easy', 'normal', 'hard']`. `heroOf(p)` = eroul jucat de jucatorul `p`.

## Salvarea: `Save`

In `localStorage`, sub `CONFIG.saveKey`, ca text JSON. Versiunea 4, de la 18 noiembrie 2026:

```text
{
  "v": 4,
  "game": "lupta",       // jocul jucat ultima data
  // progresul primului joc, sus in salvare (ca inainte):
  "level": 3,            // capitolul pornit de "Continuă" (vezi "Capitole" mai jos)
  "max": 5,              // cel mai departe capitol la care s-a ajuns: capitolele 0 .. max sunt deschise
  "results": [ { "eggs": 61, "stars": 3, "med": [true, false, true] }, ... ],   // cel mai bun rezultat al fiecarui capitol
  "eggs": 187, "stars": 6,   // totalul = suma din results. Inca scris, ca o versiune mai veche a jocului sa poata citi fisierul
  "g2": { "level": 1, "max": 1, "results": [ ... ], "eggs": 64, "stars": 2 },   // progresul celui de-al doilea joc, la fel
  "diff": ["easy", "normal"],
  "vol": { "music": 0.5, "amb": 0.7, "chr": 0.8 },
  "opt": { "lang": "ro", "fullscreen": true, "vibration": true, "swap": false,
           "ctrl": ["pad", "pad"], "keys": [ ... ], "guide": [true, false], "sink": ["", ""] }
}
```

| Functie | Ce face |
|---|---|
| `load()` | Citeste. Daca nu exista sau e stricata, `null`. O salvare mai veche trece prin `migrateSave` (mai jos). |
| `write()` | Scrie setarile si progresul, asa cum sunt in `Save.data`. |
| `slot(id)` | Progresul unui joc: salvarea insasi pentru primul, `g2` pentru al doilea. Fara `id`, jocul ales. Poate fi `null`. |
| `own()` | Ca `slot()`, pentru jocul ales, dar il face daca nu exista. |
| `finish(i, r)` | Capitolul `i` s-a terminat cu rezultatul `r`. Vezi "Totalul este o suma". |
| `newGame()` | Sterge progresul jocului ales. Celalalt joc si setarile raman. |
| `maxOpen(id)` | Ultimul capitol deschis pe ecranul Capitole. `-1` daca niciun capitol nu a fost terminat (atunci butonul "Capitole" lipseste). |
| `apply()` | Pune la loc setarile salvate. Verifica fiecare valoare (o tasta rezervata sau o limba necunoscuta sunt ignorate). Citeste si salvarile din prima versiune (`v` 1), care aveau un singur volum `sfx`. |
| `hasProgress(id)` | "Continuă" are unde duce: `level` e intre 1 si ultimul capitol. |

De ce dupa fiecare nivel si nu in timpul nivelului: un nivel e scurt. Salvarea in mijlocul lui ar fi trebuit sa pastreze pozitia fiecarui ou si inamic. Iesirea in mijlocul unui nivel reia nivelul de la inceput, cu ouale nivelurilor dinainte.

## Mouse

Orice element pe care se poate da clic se inregistreaza cand e desenat: `hitAdd(x, y, w, h, id, v, act, val)`. `hitFind(punct)` gaseste elementul de sub mouse (ultimul desenat castiga). Clicul si pozitia se pastreaza un singur cadru.

`pressedGo()`: adevarat la ✕ pe orice controller, Enter, Spatiu, tasta de putere a unui jucator sau un clic. Folosit pe ecranele unde "orice" merge mai departe.

`pressText()`: "Apasă ✕" daca cineva are controller, altfel "Apasă Spațiu" (tasta jucatorului).

`fitText(...)`: scrie un text si il micsoreaza daca nu incape in latimea data. Necesar pentru engleza si pentru nume lungi.

## Ecranul de start: `drawTitle`, `updateTitle`

- Titlul si subtitlul, Ciori care zboara cu un ou furat, cuibul gol cu trei oua.
- Butonul "Setări" sus in dreapta, cu o rotita care se invarte.
- Doua carduri, stanga pentru jucatorul 1 si dreapta pentru jucatorul 2. Fiecare are: numarul jucatorului in culoarea eroului, numele, eroul mare (transparent pana se conecteaza), starea ("Controller: apasă ✕ / sau tasta Spațiu", "Controller detectat ✓", "Tastatură ✓"), dificultatea intre doua sageti, eticheta "Gata!".
- In mijloc: "Apasă ✕ / pe controller", apoi "✕ = Gata / apoi pornim!".
- Jos in mijloc, intre cartonasele jucatorilor, butoanele (`titleMenu()`), unul sub altul:
  - "Continuă: Nivelul 4" (sau numele luptei mari), daca exista progres. E ales din start.
  - "Capitole", daca macar un capitol a fost terminat.
  - "Joc nou". La prima pornire e singurul buton si se numeste "Începe!".
- Jos: vocea gasita (sau "Fără voce în română") si scurtaturile.

Cum se porneste: fiecare jucator conectat apasa ✕ inca o data ("Gata!"). Cand toti cei conectati sunt gata, dupa 0.9 s se face ce spune butonul ales (`titleGo()`). ○ anuleaza "Gata!". Stanga si dreapta schimba dificultatea. Sus si jos aleg butonul (sau mouse-ul). △ schimba personajele.

"Joc nou", cand exista ceva de pierdut, intreaba intai (`askYesNo`): "Începi de la capăt? Se șterge tot ce ați adunat în acest joc." Randurile sunt "Da, de la capăt" si "Nu". **"Nu" e ales din start**, iar ✕ alege randul aratat: un copil care apasa ✕ de mai multe ori nu poate sterge nimic din greseala. Sus si jos schimba randul. ○ sau Backspace inseamna "Nu".

Un singur jucator poate porni singur. Celalalt erou il va urma.

## Cardul de poveste: `drawIntro`

Lumea nivelului estompata in spate. Un card mare cu "Nivelul 2", numele nivelului, trei iconite (`drawIntroIcon`: ou, stea, Bubu cu ✕, Leo cu minge si ✕, Ciori, gandac care doarme, con, fluture, copac care sclipeste, noroi, vant, moara, cascada, felinar) si povestea. "Apasă ✕" apare dupa 0.8 s, ca o apasare grabita sa nu sara peste poveste.

## Finalul de nivel: `drawLevelEnd`

"Bravo!", numele nivelului, ouale nivelului (numarate de la 0 in sus), cele trei stele (apar pe rand), cele trei medalii, totalul echipei.

Ecranul arata ce s-a adunat **de data asta** (`Game.lastRun`). In salvare ramane cel mai bun rezultat al capitolului. Totalul echipei de dedesubt e suma celor mai bune rezultate.

### Medaliile: `levelMedals()`

Adaugate in al doilea update, pentru cel de 8 ani.

| Medalie | Iconita | Se primeste daca |
|---|---|---|
| Toate stelele | stea | toate stelele nivelului au fost luate |
| Fără nicio lovitură | inima | nimeni nu a fost lovit in tot nivelul |
| Înainte de apus | soare | nivelul a fost terminat in `levelDuration` |

Medaliile primite sunt aurii, celelalte sunt gri-violet transparent. Se salveaza in `Game.results`.

## Meniurile: `menuNav` si `drawMenu`

Pauza si Setari folosesc acelasi sistem. Un meniu este o lista de randuri:

| Tip | Cum arata | Cum se schimba |
|---|---|---|
| `go` | un buton (cu sageata daca deschide o pagina) | OK |
| `opt` | eticheta in stanga, valoarea intre doua sageti in dreapta | stanga, dreapta sau OK. Clic pe sageti. |
| `slide` | eticheta si 10 puncte de volum | stanga, dreapta. Clic pe un punct (sau la stanga lor pentru 0). |
| `text` | un rand de text | nu se poate alege |

`menuNav` muta selectia (sare peste randurile `text`), urmareste mouse-ul si executa actiunea. `drawMenu` deseneaza cardul (inaltimea se potriveste cu numarul de randuri), titlul, un subtitlu optional, un continut optional (`body`), randurile, un mesaj si linia de ajutor de jos.

## Pauza

OPTIONS, P sau Escape in timpul jocului. Randuri: "Continuă", "Setări", "Reia nivelul", "Capitole", "Ieșire la meniu". "Reia nivelul" porneste acelasi capitol de la inceput. "Capitole" deschide lista. Amandoua intreaba intai ("Sigur? Ce ați adunat aici se pierde."), cu "Nu" ales din start. ○, Backspace, OPTIONS sau P inchid pauza. Daca un controller s-a deconectat, sub titlu scrie al cui.

## Setari

Se deschid de pe ecranul de start (OPTIONS, P, clic pe buton) si din pauza. Cat sunt deschise, controllerele noi nu se atribuie singure (ca sa nu se lege la intamplare). OPTIONS sau P le inchid de oriunde. ○ sau Backspace merg o pagina inapoi. Fiecare schimbare se salveaza imediat.

### Pagina principala

| Rand | Ce face |
|---|---|
| Limbă | Română / English. Se schimba imediat tot textul si vocea. |
| Ecran complet | Da / Nu. Daca Chrome refuza (comanda a venit de la un controller), scrie "Apasă tasta F pentru ecran complet." |
| Muzică | volum |
| Sunete ambientale | volum. La schimbare se aude un "pop" de proba. |
| Sunete personaje | volum. La schimbare se aude un ou de proba. |
| Vibrații în controller | Da / Nu. La pornire ambele controllere vibreaza o data. |
| Jucătorul 1 (Bubu) | deschide pagina jucatorului |
| Jucătorul 2 (Leo) | deschide pagina jucatorului |
| Înapoi | inchide |

### Pagina unui jucator

| Rand | Ce face |
|---|---|
| Personaj | Bubu / Leo. Jucatorii schimba personajele intre ei (`swapHeroes`). Controllerul, tastele, dificultatea, sageata si difuzorul raman la acelasi copil. |
| Joacă cu | Controller / Tastatură |
| Alege tastele (tastatura) sau Conectează controllerul (controller) | deschide pagina potrivita |
| Dificultate | Ușor / Normal / Greu |
| Săgeată ajutătoare | Da / Nu |
| Înapoi | |

### Alege tastele

Cinci randuri: Sus, Jos, Stânga, Dreapta, Putere (butonul ✕). OK pe un rand scrie "Apasă tasta nouă" (pulseaza). Urmatoarea tasta devine tasta noua.

- Daca tasta e deja folosita (de oricare jucator), cele doua taste se schimba intre ele. Mesaj: "Tasta era folosită. Le-am schimbat între ele."
- Tastele rezervate sunt refuzate: "Tasta aceasta este păstrată pentru meniu."
- Escape, un clic, ○ sau OPTIONS anuleaza.
- "Tastele de la început" pune la loc tastele din `CONFIG.keys` pentru ambii jucatori.

### Conectează controllerul

Trei pasi, fiecare cu bifa verde cand e facut:

1. Pornește controllerul. Cu cablu: USB. Fara cablu: SHARE + PS pana clipeste lumina, apoi "Wireless Controller" in Setări sistem › Bluetooth.
2. Apasă orice buton, ca să îl vadă Chrome. Arata cate controllere vede Chrome.
3. Apasă ✕ pe controllerul lui Bubu. Primul controller neatribuit care apasa ✕ devine al lui. Se aude "iu-huu" si controllerul vibreaza.

In dreapta, un tester (`drawPadTester`): D-pad, stick (punctul albastru se misca si devine plin cand iese din zona moarta), OPTIONS, △ ○ ✕ □ in culorile lor. Se aprind cand sunt apasate.

Dupa conectare:

- "Încearcă vibrația": vibreaza 0.5 s (chiar daca vibratiile sunt oprite). Daca nu poate: "Acest controller nu poate vibra în Chrome."
- "Caută difuzorul controllerului": cere permisiunea de microfon si listeaza difuzoarele. Apoi randul devine "Sunetele lui Bubu se aud în": stanga si dreapta trec prin difuzoare si canta un sunet de proba in fiecare. Mesajele posibile sunt in anexa C (`spk.`).
- "Alt controller": elibereaza controllerul, ca sa poata fi ales altul.

## Festivalul: `startEnding`, `updateEnding`, `drawEnding`

- Fundal de amurg (`skyT` 1.28) cu doua siruri de felinare colorate care lumineaza.
- Artificii la fiecare 0.7 pana la 1.6 s, in cinci combinatii pastel, cu doua inele de particule.
- Bubu, Leo si Ciori (fericit) topaie langa un cuib cu un ou mare.
- La 3.5 s oul se clatina si crapa de trei ori. La 6.5 s ecloseaza: un pui de dinozaur verde, cu pete galbene, care topaie.
- Vocea: "Festivalul Apusului a început! Ciori și-a cerut iertare și a rămas la petrecere." apoi "Din oul de aur a ieșit un pui de dinozaur! Bravo, Bubu și Leo!"
- La 8 s: "Bravo, Bubu și Leo!", ouale echipei si stelele (din totalul posibil).
- La 12 s: "Sfârșit" si "Apasă ✕". Apasarea duce la ecranul de start. Progresul **nu** se sterge (de la 18 noiembrie 2026): toate capitolele raman deschise, iar "Continuă" duce la lupta mare.

## Update 14 noiembrie 2026

### De ce progresul primului joc a ramas sus in salvare

O salvare veche (`v` 2) are `level`, `eggs`, `stars` direct in obiect. Daca le-as fi mutat intr-un `g1`, copiii si-ar fi pierdut progresul. Asa, salvarea veche se citeste fara nicio conversie, iar al doilea joc are locul lui, `g2`. Cheia din `localStorage` e aceeasi.

### Ecranul "Alege jocul" (scos)

Pana pe 17 noiembrie 2026 exista un ecran `select` (`drawSelect`, `updateSelect`, `Game.toSelect`, `UI.gameSel`) unde se alegea intre "Bubu și Leo" si "Cea mai grea luptă". A fost scos odata cu primul joc (`16-decizii.md`, "Un singur joc"). Dupa primul clic sau prima apasare, jocul merge direct la ecranul de start. `setGame` ramane, dar fixeaza mereu jocul `lupta`: `GAME = 'lupta'`, `applyGameConfig()`, goleste desenele pastrate si repune fundalul ecranului de start. Progresul se citeste din slotul `g2` al salvarii, ca inainte.

### Ecranul de start

Cu Boon si Killer, titlul si jungla de noapte. Nu mai are butonul "Alege jocul" si ○ sau Backspace nu mai fac nimic aici.

Daca un difuzor salvat nu a fost gasit, jos apare 14 secunde textul `spk.lost`.

### Setari

- "Alege tastele" are un rand nou: "Ajută prietenul (butonul □)".
- "Conectează controllerul": randul "Încearcă sunetul" canta pe iesirea eroului. Dupa "Caută difuzorul controllerului", un difuzor care pare al unui controller e ales singur.
- Setarile sunt comune celor doua jocuri. "Cine joacă pe cine" schimba eroii in amandoua.

### Finalul celui de-al doilea joc

`startEnding` si `drawEnding` trimit la `drawEndingL` cand `isLupta()`: petrecerea din jungla, cutia de cadou cu cristale, medaliile, stelutele care imbratiseaza eroii. Vezi `21-cea-mai-grea-lupta.md`.

## Update 18 noiembrie 2026: capitole (sarcina T5)

Cererea: "cand intri in joc apare sa incepi de la inceput sau de unde ai ramas (cum e acum level 6) - si poti merge prin chapters sa reiei un level (ca la it takes two)." Specificatia a fost `24-sisteme-noi.md`, S5. Ce scrie aici e ce s-a facut.

### Ce e un capitol

Un nivel sau o lupta mare. Lista o da `chapters(id)` din `06-level.js`:

| Joc | Capitole |
|---|---|
| Bubu și Leo | nivelurile 1 - 6, apoi lupta cu Ciori (7) |
| Cea mai grea luptă | nivelurile 1 - 6, Arena lui George (7). Nivelurile Partii a doua se adauga dupa Arena cand exista (`CONFIG.lupta.levels` creste), apoi Sala Tronului (sarcina T11). |

Fiecare capitol are `kind` (`'level'` sau `'boss'`), `def`, `part` (1 sau 2) si, la niveluri, `n`: numarul nivelului in joc, de la 0.

`Game.levelIdx` este acum **indicele capitolului**. Numarul nivelului e in `L.idx`, ca inainte. `buildLevel(idx)` alege din lista ce construieste si pune `L.ch = idx`.

`chapterLabel(i, id)`: "Nivelul 4" pentru un nivel, numele luptei pentru o lupta mare ("Cuibul lui Ciori", "Arena lui George"). Il folosesc "Continuă: ..." de pe ecranul de start si de pe ecranul "Alege jocul". Dupa ce jocul a fost terminat, butonul arata deci "Continuă: Cuibul lui Ciori", nu "Marele final": e mai clar unde duce.

### Totalul este o suma

Ca un capitol sa poata fi rejucat fara sa strice socoteala:

- `results[i]` este **cel mai bun** rezultat al capitolului `i`: cristale, stele, medalii. La sfarsitul unui capitol (`finishChapter` in `10-main.js`, apoi `Save.finish`) se pastreaza maximul pe fiecare camp. O medalie odata castigata ramane.
- Totalul echipei este suma rezultatelor (`sumResults`).
- La inceputul unui capitol (`startPlay`), totalul de pe ecran porneste de la suma **celorlalte** capitole (`P.baseEggs`) si creste cu ce se aduna aici.
- Un erou lovit scapa doar din ce s-a adunat in capitolul acesta (`P.levelEggs`). Inainte putea scapa un cristal adus din nivelurile dinainte.
- "Continuă" (`level`) merge mai departe doar cand se termina capitolul la care duce. Rejucarea unui capitol mai vechi nu il muta.
- `max` creste pana la capitolul de dupa cel terminat. Dupa lupta mare raman toate deschise.
- Rezultatul luptei mari se pastreaza si el (pentru medaliile de pe cartonasul ei).

### Trecerea de la versiunea 3: `migrateSave`

O salvare veche se schimba o singura data, la citire. Se schimba doar ce lipseste, deci poate rula de mai multe ori fara rau.

1. `max = level` pentru fiecare joc.
2. Daca lipsesc rezultate pentru niveluri terminate, primesc un rezultat gol.
3. Daca suma rezultatelor e mai mica decat totalul vechi, diferenta se adauga la primul rezultat. Copiii nu vad totalul scazand dupa update.
4. Totalul devine suma. De obicei suma e mai mare decat totalul vechi: inainte, o lovitura la inceputul unui nivel scadea totalul fara sa scada rezultatul nivelului.
5. Indicele 6 al celui de-al doilea joc insemna Arena si inseamna tot Arena.

### Ecranul Capitole: `Game.toChapters`, `updateChapters`, `drawChapters`

- Se ajunge aici din butonul "Capitole" de pe ecranul de start sau din pauza.
- Un cartonas pe capitol, 240 x 330, la 20 unul de altul, pe un rand centrat. Al doilea joc primeste un al doilea rand, "Partea a doua: Stelele furate", abia cand exista niveluri in el. Un rand gol, cu titlu, ar fi fost de neinteles pentru copii.
- Pe cartonas: o pictura mica a nivelului (`chapterPic`: cerul, pamantul in culorile paletei lui si cele trei imagini de pe cartonasul de poveste, pictate o data), "Nivelul N" sau o coroana pentru luptele mari (`drawCrownIcon`), numele pe cel mult doua randuri, cele trei stele, cele trei medalii si cristalele (cel mai bun rezultat). Un capitol deschis, dar inca nejucat, arata stelele goale si "–".
- Un capitol incuiat: pictura acoperita de un val lila, un lacat (`drawPadlock`) si "Încă nu". Fara gri.
- Capitolul ales e mai mare cu 6%, are rama aurie si se leagana. E desenat ultimul, peste vecini.
- La deschidere e ales capitolul la care duce "Continuă".
- Stanga si dreapta (stick, D-pad, sagetile, tastele de mers ale jucatorilor) muta alegerea. Sus si jos trec intre randuri. ✕, Enter sau clic porneste capitolul (`Game.startChapter`). ○, Backspace sau butonul "Înapoi" duc la ecranul de start.
- Pe un capitol incuiat, ✕ nu porneste nimic: lacatul tremura si se aude `no` (doua note moi care coboara).
- Dificultatea si cine joaca pe cine sunt cele alese pe ecranul de start.

### Tastatura bagă un jucator in joc doar pe ecranul de start

`Input.kbJoin` este acum adevarat doar pe ecranul de start. E fals pe "Alege jocul" (ca inainte), pe ecranul Capitole si de la inceputul oricarui nivel (`Game.goLevel`). Motivul: Enter si Spatiu sunt si tastele de putere ale eroilor. Un parinte care alege un capitol cu Enter, sau care raspunde cu Enter in pauza, il baga pe al doilea erou in joc pe tastatura. Un copil care juca singur s-ar fi trezit cu un prieten pe care nu il joaca nimeni (si care trebuie ajutat si asteptat in cuib). Controllerele pot intra in joc oricand, ca inainte.

### Starea noua

`Game.state = 'chapters'`. Vezi `14-bucla-principala.md`.

### Teste

`tests/capitole.js`, pentru fiecare joc. Vezi `17-testare.md`.

## Update 18 noiembrie 2026 (T2): pagina "Alege tastele"

`KEY_FIELDS` are acum opt campuri: `up`, `down`, `left`, `right`, `a` (prima putere, ✕), `b` (ajuta prietenul, ○), `c` (a doua putere, □), `r` (fuga, L3). Pagina are 10 randuri cu tot cu "Tastele de la început" si "Înapoi", la 70 de unitati randul: 976 de unitati inaltime, deci incape pe ecran fara sa scada randurile. Verificat de `tests/control-nou.js` (si cu o captura).

`Save.apply` copiaza doar campurile din `KEY_FIELDS`, deci o salvare veche fara `c` si `r` ramane buna: cele doua taste noi vin din `CONFIG`.

In testerul de controller din Setari, capul stick-ului stang se face mai inchis cand butonul L3 (indicele 10) e apasat.
