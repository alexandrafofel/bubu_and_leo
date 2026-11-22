# 12. Desen si HUD (`src/08-draw.js`)

> **Din 18 noiembrie 2026 exista un singur joc: "Cea mai grea luptă".** "Bubu și Leo" a fost scos (vezi `16-decizii.md`, "Un singur joc"). Orice schimbare se face doar in "Cea mai grea luptă". Ce scrie mai jos despre primul joc, despre alegerea jocului sau despre "ambele jocuri" este istoric.

Fisierul pune lumea pe ecran in fiecare cadru si deseneaza tot ce ajuta jucatorii sa stie ce au de facut.

## `drawWorld(c)`

1. Calculeaza coltul camerei (`l`, `tp`). Adauga tremurul (`P.shake`) daca e cazul.
   - `tp` are voie sa fie negativ, pana la `-(HUD_TOP + 20) / z`: camera poate privi putin mai sus decat marginea de sus a picturii, ca niciun erou sa nu ajunga sub banda de sus (vezi "Banda de sus" mai jos). Fasia aceea nu are pictura, deci se umple intai cu culoarea cerului (`L.skyTop`, primul pixel al picturii, luat de `topColor` la generarea nivelului).
2. Copiaza bucata vazuta din fundalul pictat (`L.bg`), scalata cu zoom-ul.
3. Intra in coordonatele lumii (`scale`, `translate`).
4. Lucruri pe pamant, in ordine:
   - luciri pe apa (46 de unde mici care apar si dispar);
   - bucata de faleza peste pestera, transparenta dupa `cave.reveal`;
   - lumina aurie a cuibului deschis;
   - cercurile tropaitului (portocaliu si crem);
   - la boss: copacul (care se poate scutura), cuibul cu ouale ramase, tintele (`drawBossTargets`);
   - mini-lupta pe pamant (`drawDuelGround`);
   - ouale si stelele;
   - sageata ajutatoare (`drawGuides`).
5. Lucruri in picioare, sortate dupa `y`: eroii (cu mingea tinuta), gandacii, conurile, copacii si morile, mingea in zbor, Ciori, paznicul.
   - Un erou care sta in spatele unui copac sau al unei mori face copacul transparent (40%). La prima versiune copiii se pierdeau in spatele copacilor.
6. Conurile aruncate de Ciori, lumina felinarelor, cascada (peste eroi), Ciori in zbor, fluturele, partea de sus a mini-luptei, particulele.
7. Cardul "Îmi pare rău!" al lui Ciori, sus (la y 250), ca sa nu acopere personajele.
8. Iese din coordonatele lumii. Dungile de vant, in coordonate de ecran.

Intoarce `{ l, tp, z }`, folosit de indicii ca sa transforme pozitii din lume in pozitii pe ecran.

## `drawHeroFull(c, h)`

- Un inel pe pamant in culoarea eroului (portocaliu pentru Bubu; galben cu inel albastru interior pentru Leo). Asa fiecare copil isi gaseste eroul dintr-o privire.
- Umbra, care se micsoreaza cand eroul sare.
- Lumina calda cand are viteza de la fluture.
- Inelul verde punctat cand e in adapost.
- Clipeste cand e invulnerabil.
- Stelele de ameteala.
- Pentru Leo cu mingea: sageata de tintire. Cat incarca, sageata se lungeste (62 pana la 132), creste, trece de la galben la portocaliu, iar deasupra capului se umple un cerc albastru.
- Numele, primele 5 secunde din nivel. Nu se scrie niciodata peste prieten: daca prietenul e in drum, numele urca cu 46 de unitati, iar daca nici acolo nu e loc, nu se scrie deloc. Numele celui de-al doilea erou urca si el daca s-ar suprapune peste numele primului (`heroInWay`).

## Sageata ajutatoare: `guideTarget(h)` si `drawGuides(c)`

Ceruta in al doilea update: pentru cel de 6 ani "nu este foarte intuitiv. Sa ii apara o sageata ... unde tb sa mearga sau ce sa faca (cu transparenta, sa nu ii ia tot focusul)".

Unde arata (`guideTarget`), in ordinea prioritatii:

| Situatia | Tinta | Bula |
|---|---|---|
| Nivel terminat | nimic | |
| Boss, Bubu, Ciori sus | langa copac (210 la stanga sau la dreapta) | ✕ |
| Boss, Leo, Ciori jos | cuibul | minge |
| Boss, altfel | cel mai apropiat ou | ou |
| Cuibul e deschis | cel mai apropiat ou (sub 700), altfel cuibul | ou sau cuib |
| Mini-lupta, cel mic care ajuta | cel mai apropiat ou (sub 750), altfel cuibul | ou sau cuib |
| Mini-lupta, cel care se lupta | paznicul | ✕ sau minge cand se poate lovi, "!" cand trebuie asteptat |
| Altfel | cel mai apropiat ou din val | ou |
| Fara oua (doar in copaci) | cel mai apropiat copac care sclipeste | ✕ (Bubu) sau minge (Leo) |

Cum arata (`drawGuides`):

- Trei sageti mici in culoarea eroului, care "curg" spre tinta pornind de la 64 la 126 de unitati de erou. Fiecare apare si dispare lin (`sin`).
- Transparenta maxima 55%. Sagetile nu acopera nimic important si nu iau atentia de la joc.
- Daca tinta e la peste 230 de unitati, o bula crem la 172 de unitati arata ce e acolo (ou, cuib, ✕, minge, "!").
- Sub 130 de unitati sageata dispare: copilul a ajuns.
- Nu se arata cat e eroul ametit sau daca nimeni nu il joaca.
- Se porneste si se opreste pentru fiecare jucator din Setari.

De ce bula cu iconita: un copil de 6 ani intelege "acolo e un ou" mai repede decat o sageata goala.

## Indiciile vechi: `hintTarget()` si `drawHints(c, v)`

- **Sageata aurie mare**: dupa 10 s fara oua (sau dupa `levelDuration`), deasupra celui mai apropiat ou sau copac care sclipeste. Daca e in afara ecranului, sageata sta pe marginea ecranului si arata spre el. Cand cuibul e deschis, arata spre cuib.
- **Primele miscari** (nivelul 1 si boss): deasupra fiecarui erou, iconita stick-ului pana merge 0.8 s, apoi iconita ✕ pana foloseste puterea. Dispar dupa 90 s oricum.
- **"Tine ✕"**: cand un tropait atinge un copac cu stea ascunsa, deasupra lui Leo apare ✕ cu un cerc care se umple: steaua iese doar la un sut incarcat.
- **Boss**: o iconita ✕ si o sageata portocalie langa copac (cand trebuie tropait), o minge si o sageata galbena sub cuib (cand trebuie sutat).

## Bara de progres: `levelProgress()` si `drawProgress(c)`

Ceruta in al doilea update: "sa se vada cat din nivel este facut (progresul) si cat mai au de facut".

Drumul nivelului are `n` parti, in ordinea asta: valul 1, valul 2, lupta din mijloc, valul 3, lupta de la cuib, cuibul. `levelProgress()` intoarce:

| Camp | Ce este |
|---|---|
| `n` | Cate parti. Cu 3 valuri si doua lupte, 6 (`NW + 3`). Fara lupte, `NW + 1`. |
| `cur` | Partea in care sunt jucatorii. Lupta din mijloc are segmentul ei (dupa valul 2), la fel si cea de la cuib. |
| `frac` | Cat din partea curenta e gata (ouale luate din val, inimile luate paznicului). |
| `left` | Cate oua mai sunt in val sau cate inimi mai are paznicul. |
| `kind` | `eggs`, `duel` sau `nest`. |
| `midSeg`, `fightSeg` | Al catelea segment e lupta din mijloc (2) si cea de la cuib (4). -1 daca nu exista. Dupa ele alege `drawProgress` intre ou si inima. |
| `u` | Progresul total intre 0 si 1. |

`drawProgress` deseneaza, pe randul de jos al benzii de sus (y = 118), fara cartonas in spate, doar cu o umbra moale sub linie:

- Stanga: ce e de facut acum. Un ou cu "× 12" (oua ramase), o inima cu "× 3" (inimi ramase) sau cuibul cu o sageata.
- Mijloc: un drum gros de 12. Partea facuta e aurie. Pe drum, un semn la capatul fiecarei parti (raza 13): cerc cu ou pentru valuri, cerc cu inima pentru lupta, cuibul la capat. Semnele facute se umplu cu auriu, cel curent pulseaza.
- Pe drum: un punct jumatate portocaliu, jumatate galben (cei doi eroi, raza 11), unde e echipa acum. Se misca lin (12% din distanta pe cadru).
- Dreapta: procentul.

Cele doua numere (marimea 22) au halou crem, pentru ca stau direct peste lume, nu peste un cartonas. Fara halou nu se citeau pe fundalul de noapte al celui de-al doilea joc.

De ce un drum si nu doar un procent: cel de 6 ani nu citeste procente, dar vede punctul care se apropie de cuib.

Nu apare la boss. Acolo HUD-ul arata cele trei mingi (golurile).

## Banda de sus: `HUD_TOP`, `drawHUD(c)`, `drawBadge`, `drawMidCard`

Tot ce scrie jocul peste lume sta intr-o banda de sus de **132 de unitati** (`HUD_TOP`, constanta din `08-draw.js`). Sub ea nu coboara nimic, niciodata. Camera (`camTarget`, vezi `10-gameplay.md`) tine amandoi eroii sub linia asta. Inainte de 18 noiembrie 2026 scrisul ocupa 218 de unitati, iar bannerele coborau pana la 420: acoperea un erou in pana la 50% din asezari. Vezi `24-sisteme-noi.md`, S6.

| Element | Dreptunghi pe ecran |
|---|---|
| Insigna eroului 1 | 28, 16, 328, 104 |
| Insigna eroului 2 | 1592, 16, 1892, 104 |
| Cardul din mijloc | 640, 16, 1280, 104 (mai lat la boss si cand tine un banner) |
| Bara de progres | 500, 105, 1420, 131 |

- **Insignele** din colturi (`drawBadge`, 300 x 88): portretul eroului de 68 (pictat o data), numele la marimea 36, dificultatea la 22. Daca eroul nu e jucat, scrie ce trebuie apasat ("Apasă ✕" sau tasta). Un fluture mic cand are viteza.
- **Cardul din mijloc** (`drawMidCard`): oul cu numarul de oua al echipei la marimea 52 (oul pulseaza la o serie), cele trei stele ale nivelului (raza 24, pline cand sunt luate) si soarele care coboara spre deal in `levelDuration`. La boss: cercuri care se umplu cu mingi la fiecare gol.
- **Bara de progres** (de mai sus). Nu apare la boss.
- La boss, cercurile pentru goluri sunt cate `CONFIG.boss.hits` (5). Cand sunt mai mult de 3, sunt mai mici (raza 18) si cardul e mai lat, ca sa nu intre peste numarul de oua. Ouale din cuibul lui Ciori scad cu fiecare gol (`9 * (1 - faza / hits)`).
- **Bannerele** nu mai sunt cartonase care coboara peste lume. Cat tine unul, **ia locul** continutului din cardul din mijloc: cardul se lateste (880, sau 1000 pentru bannerul de lupta), se face crem deschis (`#FFF6E2`) si arata textul. La intrare "respira" (scara 1.06 spre 1, in 0.2 secunde), iar la iesire se stinge lin. Textele: "Mai departe!" (val nou, cu sageata), "La cuib!" (cu cuib si sageata), "Oul uriaș!" (cu ou), "Curcubeu!" (cu cele sapte culori), "Provocare!" pe doua randuri (cu numele paznicului).
- **"Îl așteptăm pe Leo în cuib!"** (`waitBanner`) era scris in lume, deasupra cuibului. Acum e si el un banner in banda, cat timp un erou e in cuib si celalalt nu. Un banner adevarat are prioritate.

`pressLabel(k)`: "Apasă ✕" pentru controller sau numele tastei de putere pentru tastatura.

## `drawPlay(c)`

`drawWorld`, apoi `drawHints`, apoi `drawHUD`.

## Update 14 noiembrie 2026

Ce se deseneaza in plus, in ambele jocuri:

| Ce | Unde | Cand |
|---|---|---|
| Butonul □ si un punct in culoarea prietenului, deasupra eroului | `drawHeroFull` | cat eroul asteapta ajutor |
| Inel punctat care pulseaza, in culoarea prietenului | `drawHeroFull`, sub erou | la fel |
| Cercul plin, palid, in care trebuie sa intre primul erou (`reachNear`) | `drawHeroFull`, sub erou | cat asteapta ajutor al doilea erou (cel pe care il ajuta Bubu sau Boon) |
| □ mare deasupra celui care poate ajuta | `drawHeroFull` | cand e destul de aproape |
| Sageata spre prietenul lovit, cu □ in bula | `drawGuides`, `guideTarget` | mereu, si pentru jucatorul cu sageata oprita. Are prioritate fata de orice alta tinta. |
| Mingea magica, cu o inimioara si o dara | `drawWorld`, din `P.heal` | cat zboara |
| Doua inimioare mici deasupra unui inamic mic | `drawSmallHp` | dupa prima lovitura |
| "Îl așteptăm pe Leo în cuib!" | `drawWorld`, deasupra cuibului (din 18 noiembrie 2026: banner in banda de sus, `waitBanner`) | cuibul e deschis si doar un erou e in el |

In al doilea joc, in plus:

- Lumina calda in jurul fiecarui erou (`drawHeroFull`, cand `P.L.night`): un gradient rotund, desenat sub erou. Fara ea eroii se pierdeau in decorul colorat de noapte.
- Totemurile au o morisca in culorile curcubeului (`drawPinwheel`) in locul palelor de moara.
- La boss, sageata si indiciul (minge + sageata in jos) arata spre George cazut (`bossGoal()`), nu spre varful tronului.
- HUD-ul arata cristalul in locul oului si culorile curcubeului adunate (sapte puncte). Vezi `21-cea-mai-grea-lupta.md`.

## Update 18 noiembrie 2026 (sarcina T1)

Bug-ul semnalat de proprietara: "scrisul de sus vine peste joc si de multe ori nu se vad personajele".

| Ce s-a schimbat | Unde |
|---|---|
| Tot scrisul de sus intra in 132 de unitati (era 218, plus bannere pana la 420) | `HUD_TOP`, `drawHUD`, `drawBadge`, `drawMidCard`, `drawProgress` |
| Bannerele si "Îl așteptăm..." intra in cardul din mijloc, nu mai coboara peste lume | `drawMidCard`, `waitBanner` |
| Camera tine amandoi eroii sub banda si poate privi putin peste marginea de sus a lumii | `camTarget` (`07-play.js`), `drawWorld`, `L.skyTop` |
| Textele ramase in lume nu se mai scriu peste un erou | `heroInWay`, `drawHeroFull`, `drawDuelTop` |

Masurat cu `tests/hud-acoperire.js` (procent din asezari in care un erou e acoperit): inainte 6.5 - 47%, iar bannerul de lupta pana la 50.2%. Acum **0%** peste tot, in ambele jocuri, pe toate nivelurile si la boss.

## Update 18 noiembrie 2026 (T2): iconitele butoanelor si fuga

### `iconO` si `iconL3` (`src/02-core.js`)

- `iconO(c, x, y, r, pulse)`: disc crem cu un cerc rosu-corai (`#E4583C`), aceeasi forma ca `iconX` si `iconSq`. Se deseneaza peste eroul lovit ("prietene, apasa ○") si peste prietenul destul de aproape ca sa ajute.
- `iconL3(c, x, y, r, t)`: capul stick-ului stang (disc lila `#C9C0E8` cu margine `#8E7CC3`), litera "L" si o sageata galbena care coboara peste el. Se foloseste in tutorialul fugii.
- `richText` desparte acum textul dupa `✕`, `□`, `○` si `◉` (`◉` = L3). `fitText` trimite la `richText` pentru oricare din cele patru semne.
- Sageata ajutatoare: `g.kind === 'sq'` s-a facut `'help'` si deseneaza `iconO`.

### Eroul care fuge: `drawRunTrail(c, h)`

Trei copii ale eroului in spate (0.28, 0.18, 0.09), apoi sase linii subtiri de viteza in culoarea eroului amestecata cu crem. Corpul e aplecat cu 0.14 radiani in jurul picioarelor. Nimic nu se deseneaza cand eroul nu fuge, deci jocul de acum arata exact la fel.

## Update 19 noiembrie 2026 (T3): desenul celei de-a doua puteri

- `drawThrown(c, x, y, r, spin, look)` alege intre minge si os. `drawBone` si `drawGlove` sunt in `055-lupta.js`.
- Un os in zbor are un arc turcoaz in spate (ultimele 6 pozitii, o linie groasa de 13 cu un miez palid de 5) si lasa urme mici de laba (`kind: 'paw'`).
- `drawGloveRing(c, h)`: inelul manusilor lui Killer. Doua manusi pe cerc, fiecare cu panglica (albastra si alba), si un cerc punctat alb pe pamant. Se invarte invers fata de gheare (`-t * 11`).
- `heroOpts` are acum si `glove` (0 - 1), pe langa `claw`. `drawKiller` intinde amandoua bratele si pune manusile la capete cand `glove > 0`.
- Doua feluri noi de particule: `hex` (hexagon mic, de la manusi) si `paw` (urma de laba, de la oase).
- Sageata de tintire si inelul de incarcare se arata pentru orice erou cu abilitatea `throw`, pe butonul lui. Inelul lui Boon e turcoaz, al lui Killer rosu.
- Tutorial: `iconSq` deasupra eroului care nu si-a folosit inca a doua putere (nivelul 1 si nivelul 7, dupa ce a folosit ✕, cel mult 90 de secunde).

## Update 19 noiembrie 2026 (T4): numaratoarea de 10 secunde

- `drawDownRing(c, h, by)`: inelul de 10 margele in jurul eroului cazut (raza 76 pe orizontala, 40 pe verticala) si cifra deasupra lui. Margelele aprinse sunt in culoarea prietenului, cele stinse raman desenate in crem cu un contur subtire, ca sa se vada cate au fost. Ultima aprinsa pulseaza. Cifra "pocneste" la fiecare secunda si devine mai mare si corai in ultimele trei.
- `drawEdgePulse(c)`: in ultimele 3 secunde, o lumina moale dinspre marginile ecranului, in culoarea eroului cazut. Un gradient radial de la mijloc (transparent) spre margini, alpha pana la 0.25. Nimic inchis la culoare.
- `downBanner()`: bannerul "Ajută-l pe Boon!" din banda de sus, cu `iconO` la dreapta. Trece inaintea celorlalte bannere. Daca prietenul joaca pe tastatura, in loc de ○ scrie numele tastei lui.
- `iconO` si bulina prietenului de deasupra eroului cazut se mut la dreapta cand numaratoarea merge, ca sa faca loc cifrei.

Atentie la `text(...)`: `halo` este **grosimea conturului ca parte din marimea fontului** (0.2 implicit), nu un numar de pixeli. `halo: 5` deseneaza un cerc crem imens peste jumatate de ecran.

## Update 22 noiembrie 2026 (T6.6, T6.7): planul din fata si harta de lumina

Amandoua sunt doar pe nivelurile cu `look: 'diorama'` (7 - 12, cand vor exista) sau pe toate, cu `CONFIG.look.preview: true`. Nivelurile 1 - 6 raman cum erau. Se pun la incarcarea nivelului in `finishLook(L)` (`06-level.js`) si se desenează in `drawPlay`, dupa lume: intai harta de lumina, apoi planul din fata, apoi indicatiile si banda de sus.

### Ceata de aer (S7.4, fundal)

Peste partea de sus a picturii nivelului (departarea, pana la 45% din inaltime, cel mult 800) se pune o data un gradient albastru-pal, cel mai tare sus. Doar pe nivelurile noi.

### Planul din fata (S7.4): `L.front`

- Pictat o data la 960 x 540 (ecranul la jumatate), sters (`filter: blur`) si marit o data intr-un canvas cat ecranul: lucrurile par nefocalizate. Desenat 1:1 la fiecare cadru costa jumatate fata de marit la fiecare cadru (1,2 fata de 2,2 ms); in schimb tine 8 MB in plus pe nivel.
- Sase lucruri pe nivel, fiecare intr-un dreptunghi al lui pe ecran (`L.front.items`): doua colturi sus, cele doua laturi, doua locuri jos. Nimic de-a lungul sus-mijloc: acolo e banda de cartonase. **Nimic in dreptunghiul din mijloc de 1500 x 760**, plus o marja de 60 (`FRONT_PAR_MAX`), cat poate muta paralaxa.
- Ce fel de lucruri, dupa nivel (`L.def.key`): pestera - stalactite si pietre; fabrica si castelul - lanturi, stalpi si pietre; restul - liane si frunze uriase. Culoarea: ambianta nivelului amestecata spre `#2A2048` (inchis, dar peste culoarea cea mai inchisa permisa), frunzele spre un verde adanc, cu o margine mai deschisa spre lumina, de aceeasi nuanta (o margine calda peste violet si verde dadea gri), ca sa se vada si pe o noapte inchisa.
- Paralaxa: se misca de `frontPar` (1.15) ori cat camera, dar cel mult 60 de unitati de locul lui.
- **Regula care nu se incalca:** un lucru nu acopera niciodata un erou. Daca un erou (cutia lui pe ecran) e la mai putin de `frontNear` (220) de lucru, acesta se stinge spre `frontMin` (0.15) in `frontFade` (0.2 s), asa ca e deja stins cand eroul ajunge sub el. Daca eroul e deja sub el (camera a sarit, un erou a fost pus acolo), se stinge pe loc.
- Un `drawImage` pe lucru, cu alpha lui: cel mult 12 (sunt 6). `CONFIG.look.front: false` il opreste.
- Se elibereaza cu nivelul (e un camp al lui `L`).

### Harta de lumina (S7.5)

- La fiecare cadru, dupa lume: tot ecranul e inmultit (`multiply`) cu ambianta nivelului (`levelAmbient(L)`: `def.ambient`, sau `#C4BCEE` noaptea si `#F0E4D4` ziua) - o umplere. Apoi fiecare lumina e adaugata cu `lighter`, ca un sprite rotund pictat o data pe culoare (`lightSprite`). **Niciun `createRadialGradient` la fiecare cadru.**
- **Altfel decat S7.5:** specificatia cere un canvas mic (`LM`, 480 x 270) marit peste ecran cu `multiply`. Pe masina de test (SwiftShader), marirea unui canvas mic pe tot ecranul costa singura 10 ms cu netezire (4 ms fara, dar lumina iese in patratele de 4 pixeli, vazute pe captura). Cu luminile puse direct pe ecran costa cam 3 ms. Diferenta de aspect: o lumina adauga culoare calda peste lumea intunecata, in loc sa ii dea inapoi culoarea pictata. Cu cat ambianta e mai inchisa, cu atat luminile sunt mai tari (`look.lightGlow`, 0.6).
- Luminile (`collectLights`): eroii (raza 150, culoarea lor amestecata cu crem, 0.45), cristalele de pe jos (50), stelele (60), lucrurile aruncate (70), mingea care vindeca (90), felinarele aprinse (230), tortele din arena (210), cuibul deschis (260) si `L.lights`, luminile pe care si le pune un nivel singur (lava, Cristalul-Soare...; de la T7 incolo).
- Cel mult `look.maxLights` (24): intai cele de pe ecran, apoi cele mai apropiate de mijloc.
- **Hartia intra in pictura nivelului** (`L.paperBaked`, o data, in `finishLook`), iar peste nivel nu se mai pune deloc stratul de hartie si vinieta (`levelOverlay` intoarce `null`): harta de lumina ii ia locul. O trecere pe tot ecranul in loc de doua. Banda de cartonase nu mai e inmultita cu hartia (cartonasele sunt deja pictate pe hartie).
- `CONFIG.look.lights: false`: harta nu se deseneaza si ramane stratul vechi, cu vinieta. (Daca harta era pornita la incarcarea nivelului, hartia e deja in pictura si se vede putin mai tare.)
- `LightCount` si `FrontCount` spun ce a facut ultimul cadru (pentru teste).
