# Prompturi pentru "Partea a doua" (rundele 7 - 12)

Update-ul e impartit in **13 sarcini**. Fiecare se poate termina, testa si trimite separat.

Cum folosesti fisierul:

1. Deschide o conversatie noua cu Claude (Opus), care are acces la depozitul `alexandrafofel/bubu_and_leo`.
2. Copiaza blocul sarcinii de la care ai ramas si lipeste-l ca prim mesaj. Nimic altceva.
3. Cand sarcina e gata, primesti un pull request si fisierul jocului. Incearca-l cu copiii.
4. Treci la sarcina urmatoare, intr-o conversatie noua.

Sarcinile merg in ordine: fiecare se sprijina pe cea dinainte. Dupa sarcina 5 jocul are deja **toate regulile cerute** pe nivelurile de acum. E cel mai bun moment sa il incerce copiii si sa raspunzi la intrebarile I1 - I9 din `../docs/23-update-partea-a-doua.md`, inainte de nivelurile noi.

| Sarcina | Ce primesti la sfarsit | Specificatia |
|---|---|---|
| [T1](#t1) | Scrisul de sus nu mai acopera personajele | 24, S6 |
| [T2](#t2) | Butoanele noi (✕, ○, □, L3) si fuga | 24, S1 si S2 |
| [T3](#t3) | A doua putere: oasele lui Boon, manusile lui Killer | 24, S3 |
| [T4](#t4) | Cele 10 secunde si "Încă o dată!" | 24, S4 |
| [T5](#t5) | Capitole, meniul de start, salvarea noua | 24, S5 |
| [T6](#t6) | Grafica noua: lumina, materiale, adancime | 24, S7 |
| [T7](#t7) | Mecanismele de colaborare si nivelul 7 | 25, 3 si 4 |
| [T8](#t8) | Nivelurile 8 si 9 | 25, 4 |
| [T9](#t9) | Nivelurile 10 si 11 | 25, 4 |
| [T10](#t10) | Nivelul 12 si George cu puteri noi | 25, 4 si 5 |
| [T11](#t11) | Sala Tronului si finalurile | 25, 6 si 7 |
| [T12](#t12) | Sunete, decor, documentatie, totul testat | 25, 8 - 11 |
| [T13](#t13) | Limba personajelor: cam 1000 de cuvinte pe erou, Dictionar | 26 |

---

## Context

Textul acesta e citit de cel care implementeaza, la inceputul fiecarei sarcini.

Depozitul `alexandrafofel/bubu_and_leo` are doua jocuri HTML intr-un singur fisier, pentru doi frati de 6 si 8 ani, jucate pe un Mac in Chrome cu doua controllere DualShock 4:

- "Bubu și Leo: Ouăle de Aur", primul joc;
- "Cea mai grea luptă", inventat de copii (Boon, Killer, George cel Rău, jungla de noapte).

De citit, in ordinea aceasta, inainte de orice sarcina:

1. `CLAUDE.md`: regulile care nu se schimba si pasii de lucru.
2. `docs/00-cuprins.md`, apoi `docs/02-arhitectura.md` si `docs/21-cea-mai-grea-lupta.md`.
3. `docs/23-update-partea-a-doua.md`: cererea, hotararile, intrebarile deschise, principiile luate din "It Takes Two", planul in 13 sarcini.
4. Capitolul de specificatie al sarcinii tale: `docs/24-sisteme-noi.md` sau `docs/25-niveluri-7-12.md`.
5. `prompts/05-cerere-16-noiembrie.md`: cererea proprietarei, cuvant cu cuvant. **Daca specificatia si cererea spun lucruri diferite, cererea are dreptate: spune-i, nu alege singur.**

Sarcinile pornesc din ramura `claude/partea-a-doua` (pull request-ul care aduce specificatia). Daca a fost deja integrata in `main`, porneste din `main`.

Raspunsurile proprietarei la intrebarile deschise I1 - I9 sunt in `docs/23-update-partea-a-doua.md`, sectiunea 3. Daca o intrebare nu are raspuns, foloseste coloana "Daca nu raspunzi".

## Reguli de lucru

- Lucreaza pe o ramura noua, `partea-a-doua/tN-<nume-scurt>`, pornita din ramura sarcinii dinainte (sau din `main`, daca aceea a fost integrata).
- **Inainte de orice schimbare**: `./build.sh`, apoi `tests/toate.sh`. Daca ceva nu trece deja, spune si opreste-te.
- Modifici doar `src/`, `tests/`, `docs/`, `prompts/`. Fisierul din `game/` se genereaza cu `./build.sh`. Anexele se refac cu `node tools/gen-docs.js`.
- **Fa doar sarcina ceruta.** Nu incepe urmatoarea, oricat de aproape ar fi.
- Sarcina e gata cand e adevarat tot ce scrie la "Gata cand" si cand `tests/toate.sh` trece pentru ambele jocuri, cu `errors 0` si fara `NEREUSIT`.
- Scrie testele noi cerute, in `tests/`, si adauga-le in `tests/toate.sh`. **Verifica o data ca fiecare test nou poate sa pice**: strica anume regula pe care o testeaza, vezi ca testul spune `NEREUSIT`, apoi pune la loc.
- Nimic din primul joc nu are voie sa se schimbe in afara de ce spune specificatia. Dupa fiecare sarcina, `joc-complet-bot.js`, `mingi-leo.js` si `mini-lupte-bot.js` trebuie sa treaca in "Bubu și Leo".
- Fa capturi de ecran dupa orice schimbare vizuala si uita-te la ele. Pentru grafica, foloseste lista de verificare din `docs/24-sisteme-noi.md`, S7.8.
- Toate textele noi in romana si engleza, in `STR` din `src/015-lang.js`. Textele sunt deja scrise in specificatie: foloseste-le pe acelea.
- Toate valorile noi de reglaj in `CONFIG` (`src/01-config.js`), cu comentariu. Blocurile sunt deja scrise in specificatie.
- Fara contururi negre, fara gri, fara negru. Sunete calde, niciodata aspre. Cuvintele "Game Over" nu apar nicaieri.
- Nu copia nimic din jocul "It Takes Two": nici personaje, nici locuri, nici obiecte, nici nume, nici muzica. Luam doar principiile din `docs/23-update-partea-a-doua.md`, sectiunea 4.
- **Documentatia se muta, nu se dubleaza.** Cand termini, scoate din capitolele 24 si 25 partea pe care ai facut-o si scrie-o in capitolul care descrie acea parte de cod (03, 06, 07, 09, 10, 11, 12, 13), la timpul prezent. Adauga hotararile noi in `docs/16-decizii.md`, rezultatele testelor in `docs/17-testare.md`, ce n-ai putut verifica in `docs/19-limitari.md`, si schimba in `CLAUDE.md` doar regulile aratate in `docs/23-update-partea-a-doua.md`, sectiunea 6, pentru sarcina ta.
- La final: commit pe ramura, pull request in `alexandrafofel/bubu_and_leo`, si fisierul `game/bubu-si-leo-ouale-de-aur.html` trimis proprietarei in conversatie.
- Spune la final, pe scurt: ce ai facut, ce teste au trecut cu ce numere, **ce nu ai putut verifica** (controllere reale, cum suna, cum se simt vibratiile, daca un copil de 6 ani intelege), si ce intrebari ai pentru proprietara sau pentru copii.

---

<a id="t1"></a>
## T1. Scrisul de sus nu mai acopera personajele

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T1: repara bug-ul semnalat de proprietara: "scrisul de sus vine peste joc si de multe ori nu se vad personajele".

Specificatia: docs/24-sisteme-noi.md, sectiunea S6. Acolo sunt masuratorile de acum, cele trei schimbari si dreptunghiurile exacte.

Ce ai de facut:
1. Ruleaza tests/toate.sh si tests/hud-acoperire.js (pentru ambele jocuri) inainte de orice schimbare. Pastreaza numerele: sunt referinta.
2. HUD mai subtire: tot scrisul de sus intra intr-o banda de cel mult 132 de pixeli (HUD_TOP). Insignele, cartonasul din mijloc si bara de progres se rearanjeaza cum arata tabelul din S6.
3. Bannerele ("Mai multe!", "La cuib!", "Curcubeu!", bannerul de lupta, textul de asteptare de la cuib) nu mai coboara peste lume: iau locul continutului din cartonasul de sus, cat timp sunt active.
4. Camera: regula se muta intr-o functie fara efecte, camTarget(L, a, b), care intoarce {x, y, zoom}. Tine amandoi eroii sub banda, inclusiv la marginea de sus a nivelului, unde camera are voie sa urce peste marginea lumii. Fasia aceea se umple cu culoarea de sus a cerului.
5. Adauga HUD_TOP si camTarget in window.__game, ca testul sa masoare exact regula jocului.
6. Textele care raman in lume ("Acum!", "Încă nu!", numele eroilor) nu se deseneaza peste un erou.

Gata cand:
- STRICT=1 node ../hud-acoperire.js scrie 0% pentru toate coloanele, pentru fiecare nivel, in ambele jocuri, si in asezarea "impreuna", si in cea "departe".
- tests/hud-acoperire.js este in tests/toate.sh.
- tests/toate.sh trece pentru ambele jocuri.
- Ai capturi si le-ai privit: inceputul unei lupte cu eroii in mijloc, eroii la marginea de sus a nivelului 1, eroii in colturi opuse, nivelul boss-ului.

Nu face in aceasta sarcina: butoane noi, fuga, puteri noi, niciun nivel nou.
````

---

<a id="t2"></a>
## T2. Butoanele noi si fuga

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T2: butoanele cerute de proprietara si fuga cu stick-ul.

Cererea: "pe x apasa pentru puterea lor initiala, pe O sa se salveze reciproc si pe patrat sa fie cea de-a doua putere" si "Stick-ul Stang (L3) (...) cand il apasa sa mearga mult mai repede (x3)".

Specificatia: docs/24-sisteme-noi.md, sectiunile S1 si S2.

Ce ai de facut:
1. Butoane: ✕ ramane prima putere. ○ devine "ajuta prietenul" (acum e pe □). □ ramane liber pentru a doua putere, care vine in sarcina urmatoare: deocamdata doar citeste-l si tine-l intr-un camp nou. L3 (butonul 10) se citeste pentru fuga.
2. Taste noi pentru fiecare jucator: "c" (a doua putere) si "r" (fuga), cu valorile din specificatie. "b" ramane ajutorul, ca salvarile vechi sa fie bune. Pagina "Alege tastele" primeste doua randuri si trebuie sa incapa.
3. Iconite noi iconO si iconL3, in stilul lui iconX si iconSq. richText desface acum si ○ si ◉. Peste tot unde se arata □ pentru ajutor se arata ○.
4. Texte noi si texte de schimbat: key.b, key.c, key.r, si povestile nivelurilor care pomenesc patratul (lvl.meadow.intro, lvl.glade.intro).
5. Fuga: o apasare de L3 cu stick-ul inclinat porneste fuga, care tine pana cand jucatorul lasa stick-ul. Viteza x 3, cu limita de 1100. Reglajele in CONFIG.sprint.
6. OBLIGATORIU: miscarea eroului se face in pasi mici, cum se misca mingile, altfel la viteza mare trece prin pereti si peste apa.
7. Camera urmareste mai repede cat fuge cineva. Eroul aplecat, urma de trei umbre, praf, linii de viteza, sunetul dash, cuvantul "run", vibratie scurta la pornire.
8. Tutorial: iconita L3 deasupra eroilor cand se despart mult, o data pe nivel, pana cand au fugit o data.
9. tests/common.js trebuie sa stie sa apese butoanele noi.

Gata cand:
- tests/control-nou.js trece: ○ ridica eroul, □ nu-l mai ridica, □ si L3 se citesc, tastele noi merg, o salvare veche fara ele se incarca, pagina de taste incape pe ecran.
- tests/fuga.js trece: viteza x 3 masurata, limita respectata, oprirea cand lasi stick-ul, varianta "hold", si proba cu dt fortat la 0.05 in care niciun erou nu trece printr-un perete, in apa sau in prapastie.
- controller-simulat.js trece cu ○ in loc de □.
- tests/toate.sh trece pentru ambele jocuri.

Nu face in aceasta sarcina: a doua putere propriu-zisa (□ nu face inca nimic), cele 10 secunde, capitole.
````

---

<a id="t3"></a>
## T3. A doua putere: oasele lui Boon, manusile lui Killer

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T3: fiecare dintre cei doi eroi ai jocului "Cea mai grea lupta" primeste a doua putere, pe butonul □.

Cererea: "Killer sa isi alungeasca si el mainile si sa aiba puterea lui Boon (alta culoare, alte detalii sa nu arate fix la fel, sa vibreze controllerul cand o foloseste) iar Boon sa primeasca puterea lui Killer, dar sa arunce cu altceva - ceva specific dinozaurilor (la fel, alta culoare, alte detalii, sa fie diferit)".

Specificatia: docs/24-sisteme-noi.md, sectiunea S3, cu tabelele de diferente si valorile din CONFIG.

Lucreaza in doua etape, in ordinea asta.

Etapa 1, refactorizare care nu schimba nimic pentru jucator (S3.1):
- Puterile devin doua abilitati: "spin" (rotire in jurul eroului) si "throw" (aruncare in cerc). Orice erou poate avea oricare, pe oricare dintre cele doua butoane.
- Urmeaza tabelul de functii din S3.1: startSpin, throwRing, updateSpin, updateThrow, abil(k, kind), owner si look pe fiecare obiect aruncat, throwCd si homeState pe erou in loc de P.ballCool si P.ball.state.
- Etapa 1 e gata cand TOATE testele de acum trec neschimbate, in ambele jocuri. Asta e dovada ca n-ai stricat nimic. Nu trece mai departe pana nu e asa.

Etapa 2, puterile noi (S3.2 si S3.3):
- Boon, □: oase-bumerang. Aceleasi reguli ca mingile lui Killer, cu valorile lui din CONFIG.lupta.heroes[0].throw. Osul nu sare, se roteste, lasa un arc turcoaz, se intoarce pe o curba, suna "fup-fup-fup" si "tock" la perete, sta pe umarul lui cand e acasa.
- Killer, □: manusi-vartej. Aceleasi reguli ca ghearele lui Boon, cu valorile lui din CONFIG.lupta.heroes[1].spin. Amandoua bratele se intind, manusi rosii de portar, inel cu panglici albastre si albe, se invarte invers decat ghearele, si vibratia e in TREI batai scurte (asta a cerut proprietara anume).
- In "Bubu si Leo", □ nu face nimic.
- Tutorial: iconita □ deasupra eroilor pana cand folosesc o data a doua putere.

Gata cand:
- tests/puteri-doi.js trece, cu toate punctele din S3.5 (numar de obiecte, o lovitura pe aruncare, scutul, cele trei vibratii, puterile care nu se pot porni deodata, □ fara efect in primul joc).
- Toate testele vechi trec neschimbate in ambele jocuri.
- Ai o captura cu amandoua puterile noi pornite deodata si ai privit-o: oasele nu seamana cu mingile, manusile nu seamana cu ghearele.

Nu face in aceasta sarcina: cele 10 secunde, capitole, niveluri noi.
````

---

<a id="t4"></a>
## T4. Cele 10 secunde si "Încă o dată!"

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T4: regula noua cand un erou e lovit.

Cererea: "cand un personaj este lovit - la ambii jucatori le vibreaza controllerul si au 10 secunde sa se ajute, daca nu se ajuta reincep level-ul de la inceput".

Specificatia: docs/24-sisteme-noi.md, sectiunea S4, cu tabelul "secunda cu secunda" si valorile din CONFIG.rescue.

Ce ai de facut:
1. Cand un erou ramane jos, vibreaza AMBELE controllere si porneste o numaratoare de 10 secunde.
2. Pe ecran: un inel de 10 margele in jurul celui cazut, cifra deasupra lui, mesajul in banda de sus. La fiecare secunda se stinge o margea, suna un "toc" moale si vibreaza scurt ambele controllere. In ultimele 3 secunde totul devine mai apasat, iar marginea ecranului pulseaza in culoarea eroului cazut (nu rosu inchis, nu negru).
3. Ajutat la timp: ca acum. La zero: nivelul reincepe de la inceput.
4. Ecranul de reincepere: starea noua "retry", 2.2 secunde, cartonas cu cei doi eroi tinandu-se de mana si textul "Încă o dată!". Povestea nivelului nu se mai arata la reluare. Cuvintele "Game Over", "Ai pierdut", "Greșit" nu apar nicaieri.
5. Plasa de siguranta: dupa 3 reinceperi ale aceluiasi nivel, limita creste la 15 secunde.
6. Cazurile speciale, toate din S4: un singur jucator nu are numaratoare; amandoi loviti reincep dupa 3 secunde; pauza opreste numaratoarea; prietenul care pierde controllerul; la boss reincepe lupta.

Gata cand:
- tests/zece-secunde.js trece, cu toate cele 10 puncte din S4 ("Test").
- Ai capturi cu numaratoarea la 3 si cu ecranul "Încă o dată!", privite: niciun pixel negru sau gri in cartonas.
- tests/toate.sh trece pentru ambele jocuri.

Nu face in aceasta sarcina: capitolele, grafica noua, niveluri noi.
````

---

<a id="t5"></a>
## T5. Capitole, meniul de start, salvarea noua

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T5: meniul de start si lista de capitole.

Cererea: "cand intri in joc apare sa incepi de la inceput sau de unde ai ramas (cum e acum level 6) - si poti merge prin chapters sa reiei un level (ca la it takes two)".

Specificatia: docs/24-sisteme-noi.md, sectiunea S5.

Ce ai de facut:
1. Functia chapters(): lista capitolelor jocului ales (niveluri si lupte mari). Game.levelIdx devine indicele capitolului. Schimba toate locurile din tabelul S5.1 care socoteau "ultimul nivel = boss".
2. ATENTIE: lista creste singura cand se adauga niveluri. CONFIG.lupta.levels ramane deocamdata 6; va urca pe masura ce nivelurile noi sunt gata, in sarcinile urmatoare. Nu inventa niveluri provizorii.
3. Meniul de pe ecranul de start: trei butoane mari, "Continuă: ...", "Capitole", "Joc nou". La prima pornire, unul singur: "Începe!". "Joc nou" intreaba intai si sterge doar progresul jocului ales.
4. Ecranul "Capitole": starea noua, cartonase cu o pictura mica a nivelului (din paleta si iconitele lui, fara sa generezi nivelul), nume, stele, medalii, cristale. Capitolele nejucate inca sunt incuiate, cu un val lila si un lacat, fara gri. Pentru al doilea joc, doua randuri: "Partea întâi" si "Partea a doua: Stelele furate" (al doilea rand va fi gol pana vin nivelurile noi).
5. Totalul devine o suma: fiecare capitol tine cel mai bun rezultat al lui, iar totalul echipei e suma lor. Rejucarea unui capitol nu strica socoteala si nu muta "Continuă".
6. Salvarea versiunea 4, cu trecerea de la versiunea 3 facuta o singura data, fara ca totalul copiilor sa scada. La sfarsitul jocului progresul nu se mai sterge.
7. Meniul de pauza primeste "Reia nivelul" si "Capitole", fiecare cu o intrebare inainte.

Gata cand:
- tests/capitole.js trece, cu toate cele 10 puncte din S5 ("Test"), inclusiv proba cu o salvare veche versiunea 3.
- Navigarea merge si doar cu controllerul, si doar cu tastatura, si cu mouse-ul.
- tests/toate.sh trece pentru ambele jocuri.

Nu face in aceasta sarcina: grafica noua, niveluri noi.

Dupa aceasta sarcina jocul are toate regulile cerute de proprietara. Spune-i ca e momentul bun sa il incerce cu copiii inainte de nivelurile noi, si intreab-o raspunsurile la I1 - I9 din docs/23-update-partea-a-doua.md.
````

---

<a id="t6"></a>
## T6. Grafica noua: lumina, materiale, adancime

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T6: stilul grafic nou.

Cererea: "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)".

Specificatia: docs/24-sisteme-noi.md, sectiunea S7, toata. Citeste si docs/23-update-partea-a-doua.md, sectiunea 4, ultimul paragraf: ce se poate si ce nu se poate face intr-un joc 2D pictat pe canvas.

Unde se aplica: eroii si George din "Cea mai grea lupta", si cadrul pentru nivelurile 7 - 12, care vin in sarcinile urmatoare. Nivelurile 1 - 6 raman pictate in acuarela, asa cum sunt.

Ce ai de facut:
1. Functia lit(c, path, col, o): cele cinci straturi (umbra aruncata, umbra de contact, forma cu gradient, lumina de margine, stralucire), cu o singura lumina din stanga-sus. Toti pictorii noi trec prin ea.
2. Materialele din tabelul S7.2, ca texturi mici puse in sprite si repetate: lemn, metal, panza, cauciuc, solzi, os, piatra, cristal, frunza, lava, apa.
3. Boon, Killer si George repictati cu lumina si materiale. Formele si culorile din desenele copiilor NU se schimba. Se adauga ochi cu doua luciri, cusaturi la tricoul lui Killer, coada care intarzie fata de corp, clipit, respiratie, turtire si intindere.
4. Trei planuri: fundal, mijloc, si un plan din fata cu lucruri mari si usor sterse la marginile ecranului. REGULA care nu se incalca: planul din fata nu acopera niciodata un erou (devine transparent cand se apropie).
5. Harta de lumina: un canvas mic desenat peste lume, cu cel mult 24 de lumini. Stralucire pe lucrurile care lumineaza, apa cu oglindire si valuri, praf care pluteste in lumina.
6. Greutate: oprire scurta de 0.06 s la lovituri mari, apropierea camerei, anticipare si urmare la mecanisme.
7. Bugetul de timp din S7.6: niciun createRadialGradient, createPattern sau shadowBlur in desenul de la fiecare cadru. Reglajele in CONFIG.look, cu care se pot opri lumina si planul din fata.

Gata cand:
- tests/stil-grafic.js trece: pe fiecare captura, sub 0.1% pixeli negri sau gri (R, G, B egale si sub 200).
- performanta.js: cel mult 20% peste valoarea masurata inainte, in aceeasi rulare.
- Ai refacut foaia de personaje (docs/capturi/24-personaje.jpg) si ai pus-o langa cea veche. Un copil trebuie sa isi recunoasca desenul.
- Ai raspuns "da" la toate cele 8 intrebari din lista de verificare S7.8, pentru fiecare captura.
- tests/toate.sh trece pentru ambele jocuri.

Nu face in aceasta sarcina: niveluri noi, mecanisme.
````

---

<a id="t7"></a>
## T7. Mecanismele de colaborare si nivelul 7

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T7: cadrul in care cei doi eroi trebuie sa colaboreze, si primul nivel nou.

Cererea: "vreau sa ne inspiram din jocul It takes two (...) Cele doua personaje sa colaboreze, sa se ajute."

Specificatia: docs/25-niveluri-7-12.md, sectiunile 2, 3 si 4 (nivelul 7, "Canionul Podurilor de Lumină"). Principiile: docs/23-update-partea-a-doua.md, sectiunea 4.

Ce ai de facut:
1. Fisier nou src/065-mech.js, pus in build.sh intre 06-level.js si 07-play.js.
2. Benzi: doua fasii care taie harta de sus pana jos, la o treime si la doua treimi, fiecare cu o singura trecere. Se pun in genLevel, iar verificarea ca toate cristalele se pot culege se face cu portile deschise.
3. Porti si intrari, cu regulile any, all, allWithin si seq. updateMechs(dt) chemata din updatePlay.
4. Intrarile din sectiunea 3.4, pentru acest nivel doar placile: cum arata, cum suna, cum vibreaza.
5. Cusca stelutelor de langa cuib: se deschide doar cand amandoi eroii o lovesc la cel mult 1.5 secunde unul de altul.
6. OBLIGATORIU: toate regulile de siguranta G1 - G10 din sectiunea 3.6. Nimeni nu are voie sa ramana blocat, niciodata. Cat un erou asteapta ajutor, toate portile se deschid.
7. mechSteps(gate): ce are de facut fiecare erou, acum. O folosesc sageata ajutatoare, indiciile si testele.
8. Nivelul 7 intreg: definitia, paleta, podurile de lumina din sapte scanduri colorate, pasarile, textele, iconitele pentru povestea nivelului. CONFIG.lupta.levels devine 7.
9. Povestea Partii a doua incepe aici: textul lvl.canyon.intro spune puterile noi, fuga si cele 10 secunde.

Gata cand:
- tests/mecanisme.js trece pentru nivelul 7: poarta inchisa la inceput, nu se deschide cu un singur erou facandu-si partea, se deschide cu amandoi, fiecare regula G1 - G10 verificata separat, se deschide si cu un singur jucator, si se deschide singura dupa autoOpen daca nu se intampla nimic.
- nivele-bot-mers.js termina nivelul 7, folosind mechSteps, fara blocaje mai lungi de 20 de secunde.
- numara-elemente.js si celelalte teste de nivel trec pentru nivelul nou.
- Ai capturi de la inceputul nivelului, de la poarta A si de la poarta B, privite.
- tests/toate.sh trece pentru ambele jocuri.

Nu face in aceasta sarcina: nivelurile 8 - 12, atacurile noi ale lui George, Sala Tronului.
````

---

<a id="t8"></a>
## T8. Nivelurile 8 si 9

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T8: urmatoarele doua niveluri noi.

Specificatia: docs/25-niveluri-7-12.md, sectiunea 4, "Atelierul lui George" si "Lacul Nuferilor Uriasi". Cadrul mecanismelor e deja facut (sectiunea 3): foloseste-l, nu-l rescrie.

Nivelul 8, Atelierul lui George:
- Tinte in doua culori: cele turcoaz asculta doar de Boon, cele albastre doar de Killer. Poarta A cere o tinta fiecare, in cel mult 4 secunde. Poarta B cere patru tinte, in ordinea aratata de becuri.
- Benzi rulante care te cara la o parte (celulele lente capata o directie).
- Roti dintate care se rostogolesc pe culoare, roboti multi, lumea facuta din unelte marite.
- Jucaria nivelului: butonul rosu care face robotii sa danseze.

Nivelul 9, Lacul Nuferilor Uriasi:
- Pluta: o frunza de nufar legata cu franghii de doua manivele. Manivela se invarte cu puterea care se roteste. Unul pluteste, celalalt invarte, apoi fac schimb.
- Poarta B: apa are curent, deci pluta aluneca inapoi daca nimeni nu invarte.
- Regulile plutei din sectiunea 3.5: cine e pe ea nu merge, dar isi poate folosi puterile si poate ajuta cu ○; pluta goala se intoarce singura; dupa ce trec amandoi ramane dincolo.

Pentru fiecare nivel: definitia completa, paleta noua, textele in romana si engleza, iconitele povestii, stelele ascunse, jucaria nivelului. CONFIG.lupta.levels creste la 9.

Gata cand:
- tests/mecanisme.js trece pentru nivelurile 8 si 9, cu toate regulile G1 - G10.
- nivele-bot-mers.js termina ambele niveluri fara blocaje.
- Ai capturi de la fiecare poarta, privite.
- tests/toate.sh trece pentru ambele jocuri.

Nu face in aceasta sarcina: nivelurile 10 - 12, Sala Tronului.
````

---

<a id="t9"></a>
## T9. Nivelurile 10 si 11

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T9: cele mai grele doua mecanisme.

Specificatia: docs/25-niveluri-7-12.md, sectiunea 4, "Pestera Ecoului" si "Vulcanul Adormit". Obiectele care se misca: sectiunea 3.5.

Nivelul 10, Pestera Ecoului:
- E intuneric: se vede bine doar in lumina (foloseste harta de lumina facuta la sarcina T6).
- Cristalul-Soare: unul il cara, si atunci merge mai incet si nu are nicio putere; celalalt il apara si aprinde ciupercile-felinar. ✕ il paseaza prietenului. Daca purtatorul e lovit, cristalul cade langa el si nu se pierde.
- Umbrele: inamicul care doarme e aici o umbra care se tine dupa eroi, dar NU poate intra in lumina si loveste doar un erou ramas in intuneric.
- Poarta B: doua cristale colorate, fiecare erou il poate cara doar pe al lui.
- Jucaria: cinci cristale care canta note.

Nivelul 11, Vulcanul Adormit:
- Bolovanul: se misca doar daca il imping amandoi deodata. Unul singur il face sa tremure, iar eroul spune "impreuna". In lava devine pod.
- Gheizere pe drum, cu avertizare clara pe pamant inainte sa izbucneasca. Nu se pun langa start, langa cuib sau langa o intrare de mecanism.
- Jucaria: gheizerul de abur care te ridica si arata tot nivelul.

Pentru fiecare nivel: definitia completa, paleta noua, textele, iconitele, stelele (una dintre ele e de felul nou "chime"), decorul. CONFIG.lupta.levels creste la 11.

Gata cand:
- tests/mecanisme.js trece pentru nivelurile 10 si 11, cu toate regulile G1 - G10.
- nivele-bot-mers.js termina ambele niveluri fara blocaje, inclusiv in intuneric.
- Verifici anume: un erou care cara cristalul nu poate ramane blocat nicaieri, si daca cristalul ajunge intr-un loc rau se intoarce singur.
- Ai capturi din pestera (cu si fara lumina) si de la gheizere, privite.
- tests/toate.sh trece pentru ambele jocuri.

Nu face in aceasta sarcina: nivelul 12, atacurile noi ale lui George, Sala Tronului.
````

---

<a id="t10"></a>
## T10. Nivelul 12 si George cu puteri noi

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T10: ultimul nivel dinaintea luptei finale, si George mai greu de invins.

Cererea copiilor cere ca George sa fie "mai greu de invins" si "din ce in ce mai mare" pe fiecare nivel.

Specificatia: docs/25-niveluri-7-12.md, sectiunea 4 ("Castelul lui George") si sectiunea 5 (George in mini-lupte).

Ce ai de facut:
1. Nivelul 12, Castelul lui George: aduna tot ce s-a invatat. Poarta A cere tinte sub cupole de sticla, ridicate pe rand de placi (deci fiecare erou ii deschide celuilalt). Poarta B are pluta peste santul castelului, cu soldati care arunca sulite spre cel care invarte manivela: rotirea il si apara. Cusca de aici tine doua stelute.
2. George in Partea a doua: sase randuri noi in DUEL_DEFS_L, marimile si inimile din sectiunea 5. Pe fiecare nivel poarta ceva din locul acela.
3. Trei atacuri noi, fiecare cu regulile lui exacte din sectiunea 5:
   - "shield": scut in doua culori, fiecare erou stinge jumatatea lui. Daca nu reusesc in 9 secunde, George il coboara singur, ca lupta sa nu se blocheze niciodata.
   - "grab": prinde un erou in pumn; prietenul are 5 secunde sa-l loveasca pe George ca sa-l scape. Rotirea pornita la timp te apara.
   - "summon": cheama doi roboti-garda.
4. Toate atacurile noi se opresc si trec in "obosit" cat un erou asteapta ajutor, ca atacurile de acum.
5. Cu un singur jucator: "grab" se inlocuieste cu "charge", iar scutul cade la orice lovitura.
6. CONFIG.lupta.levels devine 12.

Gata cand:
- mini-lupte-bot.js castiga toate cele 144 de lupte ale celui de-al doilea joc (12 niveluri x 2 lupte x 6 combinatii de dificultate), niciuna peste 180 de secunde. Botul stie sa sparga scutul si sa isi scape prietenul din pumn.
- tests/mecanisme.js si nivele-bot-mers.js trec pentru nivelul 12.
- Ai capturi cu scutul, cu eroul prins in pumn si cu nivelul 12, privite.
- tests/toate.sh trece pentru ambele jocuri.

Nu face in aceasta sarcina: Sala Tronului, finalurile.
````

---

<a id="t11"></a>
## T11. Sala Tronului si finalurile

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T11: lupta finala si cele doua finaluri.

Specificatia: docs/25-niveluri-7-12.md, sectiunile 6 si 7.

Ce ai de facut:
1. Sala Tronului: un ecran fix, ca arena de acum, cu genThrone() dupa modelul lui genArena(). In mijloc, Robo-George: un robot urias din fiare, cu George mic la mansa, in spatele unui geam.
2. Lupta are sase lovituri in trei faze, si fiecare faza cere alt fel de colaborare:
   - picioarele: amandoi folosesc o rotire langa el, aproape deodata;
   - scutul: doua scuturi colorate, fiecare il sparge pe al lui;
   - inima: unul cara Cristalul-Soare la tunul de lumina, celalalt il apara, apoi amandoi lovesc deodata.
   Dupa fiecare a doua lovitura se elibereaza o steluta.
3. Cu un singur jucator: "amandoi" devine "o data", iar eroul nejucat il apara pe purtator.
4. Scena "Va urma": finalul de acum (Petrecerea Curcubeu) ramane intreg, dar in loc de "Sfarsit" vine masina zburatoare a lui George, care fura steluțele, apoi textele "Va urma..." si "Partea a doua: Stelele furate", si ✕ duce la nivelul 7.
5. Finalul nou, dupa Sala Tronului: Marea Petrecere, la rasarit, cu toate cele zece steluțe, totalul din toate cele 14 capitole, si George fugind in departare pe o racheta de jucarie. Progresul nu se sterge.
6. Cele zece steluțe apar in HUD, sub insigna din stanga, in nivelurile 7 - 12 si in Sala Tronului.
7. Regulile comune raman: ajutorul cu ○ in 10 secunde, reinceperea luptei, pauza cat un erou e jos.

Gata cand:
- tests/sala-tronului.js trece: pentru fiecare faza, nu se poate trece cu un singur erou (cand joaca doi), se poate cu amandoi, si se poate cu un singur jucator.
- joc-complet-bot.js merge de la capitolul 1 pana la finalul nou, prin scena "Va urma".
- Ai capturi din fiecare faza a luptei si din amandoua finalurile, privite.
- tests/toate.sh trece pentru ambele jocuri.

Nu face in aceasta sarcina: sunetele noi si decorul (sunt sarcina urmatoare), in afara de ce e neaparat nevoie ca lupta sa se inteleaga.
````

---

<a id="t12"></a>
## T12. Sunete, decor, documentatie, totul testat

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T12: jocul e intreg, dar inca nu suna si nu arata ca un joc terminat.

Specificatia: docs/25-niveluri-7-12.md, sectiunile 8, 9, 10 si 11.

Ce ai de facut:
1. Toate efectele sonore noi din tabelul sectiunii 9, facute cum scrie acolo. Regula 5 din CLAUDE.md ramane: sinus, triunghi, zgomot filtrat, reverberatie. Nimic aspru, nimic care sperie un copil de 6 ani.
2. Cuvintele noi ale eroilor, in limba lor inventata: run, hurry, retry, power2, gate, plate, together, carry, pass, ride, dark, held, starFree. Niciun cuvant nu are voie sa semene cu altul.
3. Sapte melodii noi si sapte ambiante noi, in formatul de acum.
4. Decorul Partii a doua: tabela cu 13 feluri noi, cate 1700 de lucruri pe nivel, plus obiectele mari din fundal si din planul din fata.
5. Capturi noi pentru docs/capturi/, pentru fiecare nivel nou si pentru lupta finala.
6. TOATA documentatia: muta ce a mai ramas din capitolele 24 si 25 in capitolele care descriu codul, actualizeaza 03, 06, 07, 09, 10, 11, 12, 13, 15, 16, 17, 19, 21, cuprinsul, README.md si CLAUDE.md (regulile 4, 6, 8, 9 si regula noua 11, cum scrie in docs/23, sectiunea 6). Capitolele 23, 24 si 25 raman doar ca istoric, cu o nota in cap ca au fost implementate.

Gata cand:
- numara-elemente.js da peste 22.000 pentru al doilea joc, si neschimbat pentru primul.
- sunete-personaje.js: niciun cuvant la fel cu altul, in niciunul dintre jocuri.
- sunete-volum.js, sunete-limita.js si sunete-controller.js trec: nimic nu se aude rupt sau prea incet.
- tests/toate.sh tot trece intreg, pentru ambele jocuri.
- Documentatia nu mai spune nicaieri "specificatie, neimplementata" despre ceva ce exista in cod. Singura exceptie: capitolul 26 (limba personajelor, T13), care ramane specificatie.

La final, pe langa raportul obisnuit, spune ce a ramas neverificat in aceasta sarcina. Lista completa pentru toate sarcinile se scrie la sfarsitul T13.

Nu face in aceasta sarcina: limba cu 1000 de cuvinte (T13). Cele 13 cuvinte noi de aici raman exclamatii, ca cele 33 de acum.
````

---

<a id="t13"></a>
## T13. Limba personajelor

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.

Sarcina T13: fiecare erou (Bubu, Leo, Boon, Killer) primeste o limba a lui, cu cam 1000 de cuvinte. Acum are doar 33 (47 dupa T12) de exclamatii fara sens.

Specificatia: docs/26-limba-personajelor.md, toate sectiunile (L1 - L9). Citeste si docs/06-sunet.md, sectiunea "Limba personajelor", si docs/24-sisteme-noi.md, S6 (balonul trebuie sa respecte aceleasi reguli ca scrisul de sus).

Inainte sa incepi, verifica ca T1 si T12 sunt facute (in main sau in ramura de la care pornesti). Daca nu sunt, spune si opreste-te.

Ce ai de facut:
1. Scrie intai lista celor 1000 de sensuri in src/016-lexic.js, cu romana si engleza, pe cele 12 categorii din L2, cu numarul exact de sensuri pe categorie. Cuvinte pe intelesul unui copil de 6 ani, nimic urat, nimic care sperie. Adauga-l in FILES din build.sh. Numerele (id) nu se mai schimba niciodata dupa aceea.
2. Generatorul de cuvinte: LANG_PHON pentru cele patru limbi, buildLexicon(hero), determinist (fara Math.random), cu regulile de respingere din L3. Valorile `seeds` si celelalte reglaje merg in CONFIG.lang.
3. Consoanele moi in syl() din src/03-audio.js, ca al cincilea element al silabei. Silabele vechi nu se schimba. Nimic aspru: regula 5 din CLAUDE.md ramane. Adauga Snd.say(k, id) si Snd.phrase(k, key).
4. Cel putin 30 de fraze (exclamatie + 1 - 3 cuvinte) cu traducere in romana si engleza, in STR. Frazele nu se aud la fiecare eveniment (phraseGap).
5. Eroii spun numele lucrurilor din apropiere (L7). Balonul cu traducerea, asezat dupa regulile S6. Optiunea "Text la cuvinte" in Setari.
6. Ecranul Dictionar, din pauza si din meniul de start, cu tastatura si controller. Cuvintele descoperite se salveaza in campul `lex` al slotului, fara versiune noua de salvare.
7. tests/limba.js cu cele 14 verificari din L8, ambele jocuri, in tests/toate.sh. Verifica o data ca fiecare poate sa pice. Adapteaza tests/sunete-personaje.js si hud-acoperire.js daca trebuie.
8. Documentatia: capitolele 03, 06 (consoanele si lexicul; regula veche "doar vocale" se rescrie), 13, 16 (hotararile L1 - L10 cu motivul), 17, 19, 00-cuprins.md, README.md si regula 9 din CLAUDE.md, cum scrie in docs/23, sectiunea 6. Capitolul 26 devine istoric, cu o nota in cap ca a fost implementat.

Gata cand:
- tests/limba.js trece pentru amandoua jocurile, cu errors 0 si fara NEREUSIT.
- Fiecare din cele 4 limbi are intre 950 si 1100 de cuvinte, niciunul la fel cu altul, nici in aceeasi limba, nici in alta.
- Generarea celor patru limbi dureaza sub 80 ms, iar fisierul creste cu cel mult 60 KB.
- tests/toate.sh tot trece pentru ambele jocuri. performanta.js: cel mult 3% mai incet.
- Ai capturi cu un balon si cu ecranul Dictionar, in ambele limbi (ro si en), privite cu ochiul.
- La sfarsit, ai ascultat (cu analizatorul din tests/sunete-*.js) ca nicio consoana nu depaseste limita si nicio fraza nu e mai lunga de maxPhrase.

Nu face in aceasta sarcina: nimic din nivelurile noi, nimic din grafica. Nu schimba cele 47 de exclamatii de acum.

La final scrie proprietarei raportul obisnuit si, pentru toate cele 13 sarcini, o lista scurta cu tot ce a ramas neverificat (controllere reale, cum suna, cum se simt vibratiile, daca mecanismele sunt intelese de un copil de 6 ani, daca cele 10 secunde sunt prea putine, daca fuga strica luptele, daca limbile se deosebesc pentru urechea unui copil de 6 ani, daca balonul incurca) si ce ar trebui sa incerce cu copiii, in ordine.
````
