# 13. Ecrane si meniuri (`src/09-screens.js`)

## `UI`

Starea ecranelor: cine a apasat ✕ pe ecranul de start (`seen`), cine e gata (`ready`), alegerea Continuă / Joc nou (`menuSel`), timpii ecranelor (`introT`, `lvlT`, `endT`), meniul Setari (`set`), dreptunghiurile pe care se poate da clic (`hits`), clicul si pozitia mouse-ului din cadrul curent (`click`, `hover`), eroul al carui controller s-a deconectat (`lostK`).

`DIFFS = ['easy', 'normal', 'hard']`. `heroOf(p)` = eroul jucat de jucatorul `p`.

## Salvarea: `Save`

In `localStorage`, sub `CONFIG.saveKey`, ca text JSON:

```text
{
  "v": 3,
  "game": "lupta",       // jocul jucat ultima data
  "level": 3,            // primul joc: urmatorul nivel de jucat
  "eggs": 187, "stars": 6, "results": [ ... ],
  "g2": { "level": 1, "eggs": 64, "stars": 2, "results": [ ... ] },   // progresul celui de-al doilea joc
  "diff": ["easy", "normal"],
  "vol": { "music": 0.5, "amb": 0.7, "chr": 0.8 },
  "opt": { "lang": "ro", "fullscreen": true, "vibration": true, "swap": false,
           "ctrl": ["pad", "pad"], "keys": [ ... ], "guide": [true, false], "sink": ["", ""] }
}
```

| Functie | Ce face |
|---|---|
| `load()` | Citeste. Daca nu exista sau e stricata, `null`. |
| `write(level)` | Scrie setarile. Cu `level`, scrie si progresul jocului ales (dupa fiecare nivel terminat). |
| `slot(id)` | Progresul unui joc: salvarea insasi pentru primul, `g2` pentru al doilea. Fara `id`, jocul ales. |
| `apply()` | Pune la loc setarile salvate. Verifica fiecare valoare (o tasta rezervata sau o limba necunoscuta sunt ignorate). Citeste si salvarile din prima versiune (`v` 1), care aveau un singur volum `sfx`. |
| `hasProgress()` | Exista un nivel inceput si neterminat in jocul ales. |

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
- Daca exista progres: "Continuă: Nivelul 4" si "Joc nou".
- Jos: vocea gasita (sau "Fără voce în română") si scurtaturile.

Cum se porneste: fiecare jucator conectat apasa ✕ inca o data ("Gata!"). Cand toti cei conectati sunt gata, jocul porneste dupa 0.9 s. ○ anuleaza "Gata!". Stanga si dreapta schimba dificultatea. Sus si jos aleg Continuă sau Joc nou. △ schimba personajele.

Un singur jucator poate porni singur. Celalalt erou il va urma.

## Cardul de poveste: `drawIntro`

Lumea nivelului estompata in spate. Un card mare cu "Nivelul 2", numele nivelului, trei iconite (`drawIntroIcon`: ou, stea, Bubu cu ✕, Leo cu minge si ✕, Ciori, gandac care doarme, con, fluture, copac care sclipeste, noroi, vant, moara, cascada, felinar) si povestea. "Apasă ✕" apare dupa 0.8 s, ca o apasare grabita sa nu sara peste poveste.

## Finalul de nivel: `drawLevelEnd`

"Bravo!", numele nivelului, ouale nivelului (numarate de la 0 in sus), cele trei stele (apar pe rand), cele trei medalii, totalul echipei.

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

OPTIONS, P sau Escape in timpul jocului. Randuri: "Continuă", "Setări", "Ieșire la meniu". ○, Backspace, OPTIONS sau P inchid pauza. Daca un controller s-a deconectat, sub titlu scrie al cui.

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
- La 12 s: "Sfârșit" si "Apasă ✕". Apasarea sterge progresul si duce la ecranul de start.

## Update 14 noiembrie 2026

### De ce progresul primului joc a ramas sus in salvare

O salvare veche (`v` 2) are `level`, `eggs`, `stars` direct in obiect. Daca le-as fi mutat intr-un `g1`, copiii si-ar fi pierdut progresul. Asa, salvarea veche se citeste fara nicio conversie, iar al doilea joc are locul lui, `g2`. Cheia din `localStorage` e aceeasi.

### Ecranul "Alege jocul": `drawSelect`, `updateSelect`

- Fundalul e impartit: stanga pajistea de zi a primului joc, dreapta jungla de noapte a celui de-al doilea (`titleBackdrop(id)` picteaza fiecare jumatate o data).
- Doua cartonase. Fiecare: titlul si subtitlul jocului (`TG`), cei doi eroi cu personajul rau intre ei, doua randuri despre joc, si "Continuă: Nivelul N" daca exista progres in jocul acela. Al doilea are eticheta "Joc inventat de copii".
- Cartonasul ales e mai mare, are rama aurie si eroii lui se misca.
- `UI.gameSel` = 0 sau 1. Stanga / dreapta (`Input.menu`: orice controller sau tastele de mers) schimba. Si mouse-ul trecut peste un cartonas. ✕, Enter, Spatiu sau clic pe cartonas alege: `setGame(id)`, apoi `Game.toTitle()`.
- Primele 0.4 s apasarile sunt ignorate, ca primul clic (cel care porneste sunetul) sa nu aleaga si jocul.
- OPTIONS sau P deschide Setarile.

`setGame(id)`: schimba `GAME`, cheama `applyGameConfig()`, goleste desenele pastrate care depind de joc (`SPR`: oul sau cristalul, portretele din HUD, cuibul), schimba fundalul ecranului de start si reseteaza "Gata!". Jocul ales se scrie in salvare (`game`) la prima salvare de dupa: cand porneste jocul sau cand se schimba o setare.

### Ecranul de start

La fel pentru ambele jocuri, cu eroii, titlul si fundalul jocului ales. In plus: butonul "Alege jocul" sus in stanga. ○ sau Backspace fac acelasi lucru, daca nimeni nu e "Gata!".

Daca un difuzor salvat nu a fost gasit, jos apare 14 secunde textul `spk.lost`.

### Setari

- "Alege tastele" are un rand nou: "Ajută prietenul (butonul □)".
- "Conectează controllerul": randul "Încearcă sunetul" canta pe iesirea eroului. Dupa "Caută difuzorul controllerului", un difuzor care pare al unui controller e ales singur.
- Setarile sunt comune celor doua jocuri. "Cine joacă pe cine" schimba eroii in amandoua.

### Finalul celui de-al doilea joc

`startEnding` si `drawEnding` trimit la `drawEndingL` cand `isLupta()`: petrecerea din jungla, cutia de cadou cu cristale, medaliile, stelutele care imbratiseaza eroii. Vezi `21-cea-mai-grea-lupta.md`.
