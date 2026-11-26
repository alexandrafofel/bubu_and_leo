# Prompturi pentru "Partea a doua" (rundele 7 - 12)

> **Un singur joc (18 noiembrie 2026).** "Bubu și Leo" a fost scos. Tot ce e specificat aici se implementeaza **doar in "Cea mai grea luptă"**. Unde scrie "ambele jocuri", "primul joc", variante `L:` sau teste pentru `bubu`, se citeste: un singur joc, textele lui (varianta `L:`), un singur rand de teste. Nu se mai scrie cod pentru primul joc.

Update-ul e impartit in **36 de sarcini** (T6 si T14 au cate zece subsarcini: T6.1 - T6.10 si T14.1 - T14.10; T7 are cinci: T7.1 - T7.5). T15 e separat, in `../docs/28-t15-george-de-doua-ori.md`. Fiecare se poate termina, testa si trimite separat.

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
| [T6.1](#t6-1) | `lit()`: cele cinci straturi, si `CONFIG.look` | 24, S7.1, S7.7 |
| [T6.2](#t6-2) | Materialele eroilor: solzi, panza, cauciuc, os | 24, S7.2 |
| [T6.3](#t6-3) | Materialele lumii: lemn, metal, piatra, cristal, frunza, lava | 24, S7.2 |
| [T6.4](#t6-4) | Boon, Killer si George repictati | 24, S7.3 |
| [T6.5](#t6-5) | Miscarea eroilor: coada, clipit, respiratie, turtire | 24, S7.3 |
| [T6.6](#t6-6) | Planul din fata (nu acopera niciodata un erou) | 24, S7.4 |
| [T6.7](#t6-7) | Harta de lumina | 24, S7.5, S7.7 |
| [T6.8](#t6-8) | Stralucire, apa, praf in lumina | 24, S7.5 |
| [T6.9](#t6-9) | Greutatea miscarii: oprire, apropiere, anticipare | 24, S7.6 |
| [T6.10](#t6-10) | Teste, buget de timp, capturi, documentatie | 24, S7.7, S7.8 |
| [T7.1](#t7-1) | Benzile si portile (cadrul) | 25, 2, 3.1 - 3.3 |
| [T7.2](#t7-2) | Placile si cusca stelutelor | 25, 3.3, 3.4 |
| [T7.3](#t7-3) | Nimeni nu ramane blocat: G1 - G10, mechSteps | 25, 3.6, 3.7 |
| [T7.4](#t7-4) | Nivelul 7: Canionul Podurilor de Lumină | 25, 4, 8 - 10 |
| [T7.5](#t7-5) | Boti, teste complete, documentatie | 25, 11 |
| [T8](#t8) | Nivelurile 8 si 9 | 25, 4 |
| [T9](#t9) | Nivelurile 10 si 11 | 25, 4 |
| [T10](#t10) | Nivelul 12 si George cu puteri noi | 25, 4 si 5 |
| [T11](#t11) | Sala Tronului si finalurile | 25, 6 si 7 |
| [T12](#t12) | Sunete, decor, documentatie, totul testat | 25, 8 - 11 |
| [T13](#t13) | Limba personajelor: cam 1000 de cuvinte pe erou, Dictionar | 26 |
| [T14.1](#t14-1) | Cota (partea 1): cifrele si semintele | 27, C3, C6 - C8 |
| [T14.2](#t14-2) | Luarea ouului cu cota, ouale peste limita | 27, C2, C3, C8, C9 |
| [T14.3](#t14-3) | Butonul L1 si pagina de taste | 27, C6 |
| [T14.4](#t14-4) | Dat cu L1, ouale in zbor, sageata | 27, C4, C5 |
| [T14.5](#t14-5) | Sfarsitul nivelului cu cota | 27, C2 |
| [T14.6](#t14-6) | Ajutor automat si cazuri speciale | 27, C9, C12 - C14 |
| [T14.7](#t14-7) | Insigna verde / rosie si sfarsitul de nivel | 27, C5, C10 |
| [T14.8](#t14-8) | Mesajele "Ai gasit toate", "mai are nevoie", ghidul | 27, C5, C11 |
| [T14.9](#t14-9) | tests/cota.js: cele 16 verificari | 27, C10 |
| [T14.10](#t14-10) | Boti, teste complete, documentatie | 27, C8, C10 |

---

## Context

Textul acesta e citit de cel care implementeaza, la inceputul fiecarei sarcini.

Depozitul `alexandrafofel/bubu_and_leo` are doua jocuri HTML intr-un singur fisier, pentru doi frati de 6 si 8 ani, jucate pe un Mac in Chrome cu doua controllere DualShock 4:

- "Bubu și Leo: Ouăle de Aur", primul joc;
- "Cea mai grea luptă", inventat de copii (Boon, Killer, George cel Rău, jungla de noapte).

De citit, in ordinea aceasta, inainte de orice sarcina:

1. `CLAUDE.md`: regulile care nu se schimba si pasii de lucru.
2. `docs/00-cuprins.md`, apoi `docs/02-arhitectura.md` si `docs/21-cea-mai-grea-lupta.md`.
3. `docs/23-update-partea-a-doua.md`: cererea, hotararile, intrebarile deschise, principiile luate din "It Takes Two", planul in 36 de sarcini.
4. Capitolul de specificatie al sarcinii tale: `docs/24-sisteme-noi.md`, `docs/25-niveluri-7-12.md`, `docs/26-limba-personajelor.md` sau `docs/27-cota-de-oua.md`.
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
## T6. Stilul grafic (impartit in 10 subsarcini)

T6 e impartit in zece sarcini. Ordinea: T6.1 intai (toate celelalte o folosesc); apoi T6.2, T6.3, T6.7 si T6.9, care nu depind una de alta; T6.4 dupa T6.2; T6.5 dupa T6.4; T6.6 dupa T6.3; T6.8 dupa T6.7; T6.10 ultima. Fiecare se verifica inainte de urmatoarea.

Inainte de T6.1: T1 e facuta (in `main`). Daca nu e, opreste-te: regulile pentru scrisul de sus se aplica si planului din fata.

<a id="t6-1"></a>

### T6.1 - `lit()` si `CONFIG.look`

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia stilului grafic: docs/24-sisteme-noi.md, S7. Cererea proprietarei: "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)". Citeste si docs/23-update-partea-a-doua.md, sectiunea 4, ultimul paragraf: ce se poate si ce nu intr-un joc 2D pictat pe canvas.
Regula 4 din CLAUDE.md ramane peste tot: fara contururi negre, fara gri, fara negru. Cea mai inchisa culoare permisa e #241A3A.
Nivelurile 1 - 6 raman pictate in acuarela, cum sunt. Stilul nou e pentru eroi, George si cadrul nivelurilor 7 - 12.

Sarcina T6.1: o singura functie prin care trec toti pictorii noi, ca lumina sa fie la fel peste tot.

Ce faci (S7.1, S7.7):
1. `lit(c, path, col, o)` in `src/02-core.js`. `path` construieste conturul, `o` are `h` (inaltimea, pentru umbra), `gloss` (0 - 1) si `mat` (materialul, gol deocamdata).
2. Cele cinci straturi, in ordine: umbra aruncata (elipsa `SHADOW`, alpha 0.28, mutata cu `(+0.35 * h, +0.12 * h)`, turtita la 0.4, cu `multiply`); umbra de contact (elipsa mica, alpha 0.4, sub baza); forma cu gradient liniar (stanga-sus culoarea deschisa cu 22%, dreapta-jos inchisa cu 28% si impinsa spre violet cu 10%); lumina de margine (dreapta-jos 2 - 3 px in `FILL = '#8FA8FF'` alpha 0.55, stanga-sus in `KEY = '#FFE2B0'` alpha 0.7); stralucirea (pata alba mica, alpha 0.6 - 0.9, in treimea stanga-sus, doar cand `gloss > 0`).
3. `KEY` si `FILL` ca nume de sus, langa `SHADOW`.
4. `CONFIG.look` cu blocul din S7.7 (`lights`, `front`, `motes`, `freeze`, `maxLights`), cu comentarii.
5. Verifica cu `grep` ca `lit`, `KEY` si `FILL` nu exista deja (regulile din CLAUDE.md, "Capcane cunoscute").

Gata cand: un obiect de proba desenat cu `lit()` (intr-un script scurt, nu in joc) are lumina din stanga-sus si umbra in aceeasi directie, fara pixeli negri sau gri. `./build.sh`, `node tools/gen-docs.js` si `tests/toate.sh` nu au regresii fata de main.

Nu face: nu schimba niciun pictor din joc (vin de la T6.2 incolo). Nu desena materiale.
````

<a id="t6-2"></a>

### T6.2 - Materialele eroilor

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia stilului grafic: docs/24-sisteme-noi.md, S7. Cererea proprietarei: "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)". Citeste si docs/23-update-partea-a-doua.md, sectiunea 4, ultimul paragraf: ce se poate si ce nu intr-un joc 2D pictat pe canvas.
Regula 4 din CLAUDE.md ramane peste tot: fara contururi negre, fara gri, fara negru. Cea mai inchisa culoare permisa e #241A3A.
Nivelurile 1 - 6 raman pictate in acuarela, cum sunt. Stilul nou e pentru eroi, George si cadrul nivelurilor 7 - 12.

Sarcina T6.2: primele patru materiale, cele de care au nevoie eroii si George.

Ce faci (S7.2):
1. Cadrul materialelor: fiecare material e o functie care adauga textura peste stratul 3 al lui `lit()`, taiata la contur cu `clip`. Textura e un canvas mic pictat o data cu `sprite('mat-...')` si repetat cu `createPattern`.
2. `scale` (Boon, George): semicercuri mici pe randuri decalate, alpha 0.12, mai desi spre spate; gloss 0.3.
3. `fabric` (tricoul si sortul lui Killer, steaguri, panglici, plasa): linii foarte fine in cruce, alpha 0.08; cusaturi punctate deschise la 4 px de margine; gloss 0.05.
4. `rubber` (manusile lui Killer, mingea, rotile): neted, cu o banda lata de lumina moale; gloss 0.4.
5. `bone` (oasele lui Boon, coltii): aproape neted, pori mici si o crapatura; gloss 0.25.

Gata cand: cele patru texturi se vad pe o captura de proba si se deosebesc intre ele. Niciun `createPattern` in desenul de la fiecare cadru (doar in pictorii pusi in `sprite()`).

Nu face: materialele lumii (T6.3). Nu repicta inca eroii (T6.4).
````

<a id="t6-3"></a>

### T6.3 - Materialele lumii

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia stilului grafic: docs/24-sisteme-noi.md, S7. Cererea proprietarei: "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)". Citeste si docs/23-update-partea-a-doua.md, sectiunea 4, ultimul paragraf: ce se poate si ce nu intr-un joc 2D pictat pe canvas.
Regula 4 din CLAUDE.md ramane peste tot: fara contururi negre, fara gri, fara negru. Cea mai inchisa culoare permisa e #241A3A.
Nivelurile 1 - 6 raman pictate in acuarela, cum sunt. Stilul nou e pentru eroi, George si cadrul nivelurilor 7 - 12.

Sarcina T6.3: celelalte sase materiale, pentru decor si obiecte.

Ce faci (S7.2), cu acelasi cadru ca la T6.2:
1. `wood` (poduri, pluta, usi, manivele, scuturi): fibre lungi usor ondulate, mai inchise cu 12%, doua-trei noduri, capete de scandura mai deschise; gloss 0.15.
2. `metal` (roboti, portile atelierului, tinte, armura lui George): gradient in benzi, nituri mici cu umbra lor, zgarieturi fine deschise; gloss 0.8.
3. `stone` (bolovani, piedestale, castel): pete mari neregulate in doua tonuri, crapaturi, muschi jos; gloss 0.1.
4. `crystal` (cristalele, Cristalul-Soare): fatete in trei tonuri ale aceleiasi culori, miezul mai deschis; gloss 1.
5. `leaf` (frunze uriase, nuferi): nervura centrala si nervuri laterale deschise, margine putin mai inchisa; gloss 0.35.
6. `lava` (vulcanul): crusta `#5A2A3A` cu crapaturi luminoase care pulseaza (galben spre portocaliu); gloss 0, dar lumineaza.
`water` nu intra aici: e la T6.8.

Gata cand: cele sase se vad pe o captura de proba. `lava` pulseaza fara sa iasa din paleta. Niciun pixel negru sau gri curat.

Nu face: apa (T6.8), harta de lumina (T6.7).
````

<a id="t6-4"></a>

### T6.4 - Boon, Killer si George repictati

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia stilului grafic: docs/24-sisteme-noi.md, S7. Cererea proprietarei: "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)". Citeste si docs/23-update-partea-a-doua.md, sectiunea 4, ultimul paragraf: ce se poate si ce nu intr-un joc 2D pictat pe canvas.
Regula 4 din CLAUDE.md ramane peste tot: fara contururi negre, fara gri, fara negru. Cea mai inchisa culoare permisa e #241A3A.
Nivelurile 1 - 6 raman pictate in acuarela, cum sunt. Stilul nou e pentru eroi, George si cadrul nivelurilor 7 - 12.

Sarcina T6.4: cei trei trec prin `lit()` si prin materialele lor. Formele si culorile din desenele copiilor NU se schimba.

Ce faci (S7.3, prima parte), in `src/055-lupta.js`, cu semnaturile neschimbate (`drawBoon`, `drawKiller`, `drawGeorge`):
1. Fiecare parte a corpului prin `lit()`, cu materialul ei: `scale` pentru dinozauri, `fabric` pentru hainele lui Killer, `rubber` pentru ghete si manusi, `bone` pentru colti.
2. Ochii: doua luciri (una mare stanga-sus, una mica dreapta-jos) si o umbra moale sub pleoapa.
3. Killer: cusaturi vizibile la tricou si numarul 10 "cusut" (margine punctata in jurul cifrelor).
4. Umbra de pe pamant devine umbra aruncata din S7.1 (acum e o elipsa chiar sub erou).
5. Ce ramane neatins: corpul rotund turcoaz al lui Boon cu cupola si "muntii", gatul auriu, capul mic albastru; capul rotund al lui Killer, ochii mari, zambetul cu dinti, tricoul albastru cu 10, ghetele rosii; George roz, capul curcubeu, cornul-coroana.
6. Portretele din HUD se refac singure (sunt sprite-uri din aceiasi pictori): verifica-le pe o captura.

Gata cand: ai refacut foaia de personaje (`docs/capturi/24-personaje.jpg`) si ai pus-o langa cea veche. Un copil trebuie sa isi recunoasca desenul: daca nu esti sigur, intreaba proprietara inainte sa mergi mai departe. Insignele din HUD arata bine.

Nu face: miscarile noi (T6.5). Nu schimba formele sau culorile.
````

<a id="t6-5"></a>

### T6.5 - Miscarea eroilor

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia stilului grafic: docs/24-sisteme-noi.md, S7. Cererea proprietarei: "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)". Citeste si docs/23-update-partea-a-doua.md, sectiunea 4, ultimul paragraf: ce se poate si ce nu intr-un joc 2D pictat pe canvas.
Regula 4 din CLAUDE.md ramane peste tot: fara contururi negre, fara gri, fara negru. Cea mai inchisa culoare permisa e #241A3A.
Nivelurile 1 - 6 raman pictate in acuarela, cum sunt. Stilul nou e pentru eroi, George si cadrul nivelurilor 7 - 12.

Sarcina T6.5: eroii capata greutate si viata, fara sa isi schimbe desenul.

Ce faci (S7.3, a doua parte):
1. Coada lui Boon si a lui George intarzie fata de corp: un arc cu doua articulatii care urmeaza viteza.
2. Bratele lui Killer se balanseaza la mers.
3. Clipit la 3 - 6 secunde, la intamplare, pentru fiecare.
4. Respiratie cand stau pe loc: scara de la 1 la 1.02.
5. Turtire si intindere (`h.squash`, exista deja) la pornire, oprire, lovitura, aterizare, si in plus la pornirea fugii (L3).

Gata cand: miscarile se vad pe capturi si pe un GIF scurt. Nimic nu tremura cand eroul sta nemiscat mai mult timp. `performanta.js` ramane in bugetul din S7.7.

Nu face: planul din fata (T6.6), lumina (T6.7).
````

<a id="t6-6"></a>

### T6.6 - Planul din fata

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia stilului grafic: docs/24-sisteme-noi.md, S7. Cererea proprietarei: "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)". Citeste si docs/23-update-partea-a-doua.md, sectiunea 4, ultimul paragraf: ce se poate si ce nu intr-un joc 2D pictat pe canvas.
Regula 4 din CLAUDE.md ramane peste tot: fara contururi negre, fara gri, fara negru. Cea mai inchisa culoare permisa e #241A3A.
Nivelurile 1 - 6 raman pictate in acuarela, cum sunt. Stilul nou e pentru eroi, George si cadrul nivelurilor 7 - 12.

Sarcina T6.6: lucruri mari si usor sterse la marginile ecranului, care dau adancime. Au o regula care nu se incalca.

Ce faci (S7.4):
1. Trei planuri: fundal (pictura nivelului, cu departarea mai stearsa si mai albastra: ceata de aer), mijloc (ca acum, sortat dupa y), fata.
2. Planul din fata: un canvas pe nivel (`L.front`), pictat o data, desenat dupa lume, cu o miscare de 1.15 ori mai mare decat camera. Elementele sunt inchise la culoare si usor sterse (pictate la jumatate de rezolutie si marite): frunze uriase, liane, stalpi, lanturi, stalactite.
3. Elementele se pun doar in afara unui dreptunghi central de 1500 x 760.
4. **Regula care nu se incalca:** planul din fata nu acopera niciodata un erou. Fiecare element are un dreptunghi; daca un erou (pe ecran) intra in el, elementul devine transparent (alpha spre 0.15 in 0.2 s).
5. `CONFIG.look.front: false` il opreste cu totul.
6. Se elibereaza la schimbarea nivelului, ca pictura de acum.

Gata cand: un test (inceputul lui `tests/stil-grafic.js`) pune eroii in 400 de asezari si arata ca niciunul nu e acoperit de planul din fata. Cel mult 12 `drawImage` pe cadru. `hud-acoperire.js` cu `STRICT=1` ramane la 0%.

Nu face: harta de lumina (T6.7), apa si praful (T6.8).
````

<a id="t6-7"></a>

### T6.7 - Harta de lumina

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia stilului grafic: docs/24-sisteme-noi.md, S7. Cererea proprietarei: "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)". Citeste si docs/23-update-partea-a-doua.md, sectiunea 4, ultimul paragraf: ce se poate si ce nu intr-un joc 2D pictat pe canvas.
Regula 4 din CLAUDE.md ramane peste tot: fara contururi negre, fara gri, fara negru. Cea mai inchisa culoare permisa e #241A3A.
Nivelurile 1 - 6 raman pictate in acuarela, cum sunt. Stilul nou e pentru eroi, George si cadrul nivelurilor 7 - 12.

Sarcina T6.7: lumina care se misca odata cu eroii si cu obiectele care lumineaza.

Ce faci (S7.5, harta; S7.7, bugetul):
1. Un canvas mic, `LM`, de 480 x 270 (un sfert din ecran). La fiecare cadru: se umple cu ambianta nivelului (`def.ambient`), apoi, cu `globalCompositeOperation = 'lighter'`, cate un gradient rotund pentru fiecare lumina: eroii (raza 150, culoarea lor, slab), cristalele de pe jos (50), obiectele aruncate (70), tortele si felinarele, lava, Cristalul-Soare (360), tintele aprinse. Se deseneaza peste lume, marit la tot ecranul, cu `multiply`.
2. Cel mult `CONFIG.look.maxLights` (24) pe cadru. Daca sunt mai multe, raman cele mai apropiate de mijlocul ecranului.
3. Gradientele rotunde sunt sprite-uri pictate o data pe culoare, desenate cu `drawImage`. **Niciun `createRadialGradient` in desenul de la fiecare cadru.**
4. Pe nivelurile noi, harta ia locul vinietei de noapte din `makeOverlay`. Textura de hartie ramane.
5. `CONFIG.look.lights: false` o opreste si lasa vinieta veche.

Gata cand: 1 umplere + cel mult 24 `drawImage` + 1 `drawImage` marit pe cadru, numarate intr-un test. Cu `lights: false` jocul arata ca inainte. `performanta.js` ramane in bugetul din S7.7.

Nu face: stralucirea, apa si praful (T6.8).
````

<a id="t6-8"></a>

### T6.8 - Stralucire, apa si praf in lumina

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia stilului grafic: docs/24-sisteme-noi.md, S7. Cererea proprietarei: "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)". Citeste si docs/23-update-partea-a-doua.md, sectiunea 4, ultimul paragraf: ce se poate si ce nu intr-un joc 2D pictat pe canvas.
Regula 4 din CLAUDE.md ramane peste tot: fara contururi negre, fara gri, fara negru. Cea mai inchisa culoare permisa e #241A3A.
Nivelurile 1 - 6 raman pictate in acuarela, cum sunt. Stilul nou e pentru eroi, George si cadrul nivelurilor 7 - 12.

Sarcina T6.8: restul luminii. Se aseaza peste harta de la T6.7.

Ce faci (S7.5, restul):
1. Stralucire: lucrurile care lumineaza (cristale, lava, tinte aprinse, ochii robotilor, flacari) primesc deasupra un sprite de halou desenat cu `lighter`, alpha 0.35 - 0.6.
2. Apa (lac, sant): culoarea de baza; o oglindire stearsa si rasturnata a lucrurilor de pe mal, pictata o data in fundal; doua randuri de valuri subtiri deschise care se misca in sens opus (un pattern desenat de doua ori cu deplasari diferite); sclipiri mici la intamplare. Materialul `water` din tabelul S7.2.
3. Praf in lumina: `CONFIG.look.motes` (40) puncte foarte mici care plutesc incet prin tot ecranul (in spatiul ecranului, nu al lumii), alpha 0.15 - 0.4, mai vizibile langa lumini. Pe vulcan sunt scantei care urca; in pestera, spori care coboara.

Gata cand: se vad pe capturi. Cu `motes: 0` nu se deseneaza niciunul. Apa se misca fara sa para zgomot. `performanta.js` ramane in buget.

Nu face: greutatea miscarii (T6.9).
````

<a id="t6-9"></a>

### T6.9 - Greutatea miscarii

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia stilului grafic: docs/24-sisteme-noi.md, S7. Cererea proprietarei: "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)". Citeste si docs/23-update-partea-a-doua.md, sectiunea 4, ultimul paragraf: ce se poate si ce nu intr-un joc 2D pictat pe canvas.
Regula 4 din CLAUDE.md ramane peste tot: fara contururi negre, fara gri, fara negru. Cea mai inchisa culoare permisa e #241A3A.
Nivelurile 1 - 6 raman pictate in acuarela, cum sunt. Stilul nou e pentru eroi, George si cadrul nivelurilor 7 - 12.

Sarcina T6.9: loviturile mari se simt. Se poate face oricand dupa T6.1.

Ce faci (S7.6):
1. Oprire scurta: la o lovitura mare (paznicul lovit, o poarta care se deschide, bolovanul care cade in lava) jocul sta `CONFIG.look.freeze` (0.06 s): `updatePlay` nu ruleaza, desenul da. Camp nou `P.freeze`.
2. Apropiere: la aceleasi momente, camera se apropie cu 4% in 0.15 s si revine in 0.4 s.
3. Zguduirea (`P.shake`) ramane neschimbata.
4. Anticipare: inaintea oricarui atac al lui George si a oricarei miscari de mecanism, obiectul se trage inapoi 0.15 s, apoi porneste. Mecanismele scot un "clic" si o scanteie inainte sa se miste.
5. Urmare: `easeBack` (langa `easeOut` in `src/02-core.js`), depasire 8% si revenire. O folosesc podurile, portile, pluta.

Gata cand: cu `CONFIG.look.freeze: 0` nu se opreste nimic. Oprirea nu opreste desenul. `tests/toate.sh` trece: niciun test nu cade din cauza cadrelor in care `updatePlay` nu ruleaza.

Nu face: mecanisme noi (T7). Aici doar cadrul pentru ele.
````

<a id="t6-10"></a>

### T6.10 - Teste, buget de timp, capturi, documentatie

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia stilului grafic: docs/24-sisteme-noi.md, S7. Cererea proprietarei: "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)". Citeste si docs/23-update-partea-a-doua.md, sectiunea 4, ultimul paragraf: ce se poate si ce nu intr-un joc 2D pictat pe canvas.
Regula 4 din CLAUDE.md ramane peste tot: fara contururi negre, fara gri, fara negru. Cea mai inchisa culoare permisa e #241A3A.
Nivelurile 1 - 6 raman pictate in acuarela, cum sunt. Stilul nou e pentru eroi, George si cadrul nivelurilor 7 - 12.

Sarcina T6.10: stilul nou e masurat, verificat cu ochiul si scris in documentatie.

Ce faci (S7.7, S7.8):
1. `tests/stil-grafic.js` intreg: pe fiecare captura, sub 0.1% pixeli negri sau gri (niciun pixel cu R, G, B egale si sub 200); planul din fata nu acopera eroii (de la T6.6); numarul de `drawImage` pentru harta de lumina si planul din fata. Fiecare verificare trebuie sa poata sa pice: strica regula, vezi `NEREUSIT`, pune la loc. Adauga-l in `tests/toate.sh`.
2. Bugetul din S7.7: `performanta.js` cel mult 20% peste nivelul 6 de acum, masurat in aceeasi rulare. Verifica prin `grep` ca `createRadialGradient`, `createPattern` si `shadowBlur` nu apar in desenul de la fiecare cadru.
3. Capturi (ro si en) cu eroii, George si un nivel; lista de verificare S7.8, cele 8 intrebari, cu raspuns "da" la fiecare, scrise in raport.
4. Documentatia: `05-pictura.md` (lumina si materialele), `08-personaje.md` si `21-cea-mai-grea-lupta.md` (eroii repictati), `12-desen-si-hud.md` (planurile, harta de lumina), `03-config.md` (`CONFIG.look`), `16-decizii.md` (de ce asa), `17-testare.md`, `19-limitari.md`, `00-cuprins.md`, `README.md`, `CLAUDE.md` (tabelul "Unde gasesti lucrurile" si capcanele noi). In `24-sisteme-noi.md`, S7 devine istoric, cu o nota in cap ca a fost implementat.
5. `./build.sh` si `node tools/gen-docs.js`.

Gata cand: `tests/toate.sh` trece intreg, cu `errors 0` si fara `NEREUSIT`. Toate cele 8 intrebari din S7.8 au raspuns "da". Raportul catre proprietara spune si ce nu s-a putut verifica (cum arata pe televizorul familiei, daca copiii isi recunosc desenele).

Nu face: niveluri noi si mecanisme (T7 - T12).
````

<a id="t7"></a>
## T7. Mecanismele de colaborare si nivelul 7 (impartit in 5 subsarcini)

T7 e impartit in cinci sarcini, cu acelasi format ca restul. Ordinea: T7.1 -> T7.2 -> T7.3 -> T7.4 -> T7.5. Fiecare se verifica inainte de urmatoarea.

Inainte de T7.1: T6.1 - T6.10, T14 si T15 sunt facute, iar stilul cu imagini Krea si inelul din luptele cu George (23 noiembrie 2026) sunt in `main`. Daca nu sunt, opreste-te.

Ce s-a schimbat fata de `docs/25-niveluri-7-12.md`, si se aplica in toate cele cinci:

- Diamantele vin doar din inamicii invinsi (T15, `docs/28-t15-george-de-doua-ori.md`). Unde specificatia scrie "valul 1 de cristale", citeste "prima treime a nivelului, cu inamicii ei".
- George vine dupa diamantele echipei (la jumatatea cotei si la toata cota), nu intr-un loc anume de pe harta. O lupta poate porni oriunde, si de o parte si de alta a unei benzi. G9 (portile nu se schimba in lupta) ramane.
- Personajele si piesele nivelurilor sunt imagini Krea (`art/krea/`, `tools/pack-art.py`, `drawArt`). Ce e nou pe nivelul 7 se face la fel, cu pictura pe canvas cand imaginea lipseste (`artOn() && artOk('nume')`).

<a id="t7-1"></a>

### T7.1 - Benzile si portile (cadrul)

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le. Citeste si inceputul sectiunii T7 din acelasi fisier: ce s-a schimbat fata de specificatie.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia: docs/25-niveluri-7-12.md, sectiunile 2, 3.1, 3.2 si 3.3. Principiile: docs/23-update-partea-a-doua.md, sectiunea 4. Cererea: "vreau sa ne inspiram din jocul It takes two (...) Cele doua personaje sa colaboreze, sa se ajute."

Sarcina T7.1: cadrul pe care stau toate mecanismele nivelurilor 7 - 12. Nimic nu se vede inca in joc.

Ce faci:
1. Fisier nou src/065-mech.js, pus in build.sh intre 06-level.js si 07-play.js. Verifica cu grep ca numele noi nu exista deja.
2. Blocul CONFIG.mech din sectiunea 3.6, cu comentarii, in src/01-config.js.
3. Benzile in genLevel (src/06-level.js), langa blocul `if (def.river)`: `bands` din definitie, mijlocul care serpuieste, celulele cu codul 2 (chasm, water, lava) sau 3 (wall), trecerea cu `crossing` la inaltimea drumului, steagul 8 si steagul nou 32 (poarta) pe celulele trecerii.
4. Verificarea `reach` (si `keepEnough` / `fieldEnemies` din T15) se face cu portile deschise. Abia in startPlay celulele portii primesc codul benzii.
5. `L.gates` si `L.inputs` cu campurile din 3.2. `updateMechs(dt)` chemata din updatePlay, dupa eroi si dupa obiectele aruncate: regulile any, all, allWithin (cu `window`) si seq (cu `gate.step`), `stay`, `gate.open` care merge lin in 0.5 s, celulele care se deschid peste 0.9 si se inchid sub 0.1. Miscarea portii foloseste mechMove si mechClick (T6.9).
6. Prima deschidere a unei porti: bigHit(), sunetul gateOpen (cald, Web Audio), vibratie pe ambele controllere (rumble(k, 0.3, 0.6, 220)).
7. Pe "Ușor": `window` si `stay` inmultite cu CONFIG.mech.easy, seq nu se reseteaza la o greseala.
8. tests/mecanisme.js, partea intai, pe o definitie de proba facuta in test (nu in joc): banda inchisa la inceput si nu se poate trece; fiecare regula (any, all, allWithin, seq) deschide si inchide poarta cum scrie; reach trece cu portile deschise. Intrarile se pornesc direct din test (`input.on = true`). Adauga-l in tests/toate.sh.

Gata cand: tests/mecanisme.js trece si fiecare verificare pica atunci cand regula ei e stricata. Nivelurile 1 - 6 nu se schimba deloc (nu au `bands`). ./build.sh, node tools/gen-docs.js si tests/toate.sh trec.

Nu face: desenul placilor si cusca (T7.2), regulile G2 - G10 si mechSteps (T7.3), nivelul 7 (T7.4).

Facut pe 26 noiembrie 2026, cu trei lucruri aprobate in plus: regula "cine trece nu poate fi si cel care deschide", testul de colaborare (un erou singur nu trece) si placa portii A la cel putin 700 de trecere.
````

<a id="t7-2"></a>

### T7.2 - Placile si cusca stelutelor

Facuta (26 noiembrie 2026): vezi docs/10-gameplay.md, docs/05-pictura.md, docs/06-sunet.md si docs/17-testare.md (partea a treia din tests/mecanisme.js). Steluta din cusca nu zboara inca spre bara de sus (docs/16-decizii.md).

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le. Citeste si inceputul sectiunii T7 din acelasi fisier.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia: docs/25-niveluri-7-12.md, sectiunile 2 (pasul 6), 3.3 (plates1, plates2) si 3.4 (Placa si Cusca stelutelor). T7.1 e facuta.

Sarcina T7.2: primele doua intrari, cele de pe nivelul 7. Din T7.1 placa stie deja cand e apasata (inputRaw, cu regula "cine trece nu poate fi si cel care deschide") si unde se pune (MECH_RECIPES, placeMechInputs). Aici vine ce se vede, se aude si se simte, plus cusca.

Ce faci:
1. Placa (`plate`, raza 60): `on` cat un erou potrivit (`who`: -1 oricine, 0 Boon, 1 Killer) sta la mai putin de 55 de mijloc si nu e jos, dus de pasare sau pe pluta. Retetele plates1 (any, stay 1.5, o placa pe fiecare mal) si plates2 (all, stay 5, doua placi la 520 deasupra si dedesubtul trecerii).
2. Desenul placii, in 055-lupta.js: disc de piatra cu urma pictata (laba turcoaz pentru Boon, talpa albastra pentru Killer, jumatate-jumatate pentru oricine). Apasata coboara 6 unitati, urma lumineaza, un inel de lumina urca. Lumina ei intra in collectLights, nu un gradient pe cadru. Adauga functiile noi in lista `names` din tests/stil-grafic.js.
3. Sunetul plate (clic de piatra si clopotel; la eliberare acelasi clopotel, mai jos) si vibratia rumble(k, 0, 0.4, 60) pentru cel care a calcat. Al treilea argument al lui Snd.play e eroul.
4. Cusca stelutelor (`cage`, raza 70, langa cuib, doar pe nivelurile cu `bands`): se deschide cand amandoi o lovesc, cu orice putere, la cel mult CONFIG.mech.cageWindow secunde unul de altul ("Bate palma!"). Daca loveste doar unul: cusca se clatina si deasupra apar fetele celor doi, cu cea care lipseste palpaind. Steluta zboara in HUD si se numara ca o stea ascunsa.
5. Textele noi (romana si engleza) in STR, cu T('cheie'). Sunt deja scrise in docs/25-niveluri-7-12.md, sectiunea 8.
6. tests/mecanisme.js, partea a doua: placa `who` 0 nu porneste cu Killer; plates1 se deschide cu un erou pe oricare placa si se inchide dupa 1.5 s; plates2 nu se deschide cu un singur erou, se deschide cu amandoi; cusca nu se deschide la o lovitura, se deschide la doua lovituri ale celor doi in fereastra, nu se deschide la 2 s distanta.

Gata cand: verificarile noi trec si fiecare pica atunci cand regula ei e stricata. Capturi cu o placa libera, una apasata si cusca, privite cu ochiul (fara negru, fara gri). tests/toate.sh trece.

Nu face: regulile G1 - G10 (T7.3). Tintele, manivelele, pluta (T8 si T9).
````

<a id="t7-3"></a>

### T7.3 - Nimeni nu ramane blocat: G1 - G10 si mechSteps

Facuta (26 noiembrie 2026): vezi docs/10-gameplay.md (tabelul G1 - G10), docs/16-decizii.md si docs/17-testare.md (partea a patra din tests/mecanisme.js, cu mutatiile).

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le. Citeste si inceputul sectiunii T7 din acelasi fisier.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia: docs/25-niveluri-7-12.md, sectiunile 3.6 si 3.7. T7.1 si T7.2 sunt facute.

Sarcina T7.3: regulile de siguranta. Sunt obligatorii: nimeni nu are voie sa ramana blocat, niciodata.

Ce faci:
1. G1 - G10, fiecare in codul ei, cu un comentariu care spune numarul regulii:
   - G1 poarta nu se inchide cat un erou sta pe celulele ei (facuta in T7.1, in stepGateOpen; aici doar se verifica in toate cazurile);
   - G2 cand amandoi eroii jucati sunt dincolo de banda, poarta devine `fixed`;
   - G3 cat un erou e jos (asteapta ajutor), toate portile se deschid si raman deschise; dupa ce se ridica, se inchid dupa `stay`;
   - G4 dropHero (pasarile) pune eroul doar pe partea de unde l-a luat;
   - G5 vantul, urletul lui George, loviturile si inamicii aruncati nu imping un erou intr-o banda (collide il opreste, ca la apa);
   - G6 cu un singur jucator: intrarile celuilalt sunt mereu `on`, fara ferestre de timp, cusca la o lovitura;
   - G7 autoOpen (180 s fara progres, socotit de cand un erou e la mai putin de 500 de poarta): poarta se deschide singura, cu mesajul "Poarta s-a deschis singură.";
   - G8 dupa hintAfter (40 s) fara progres: fiecare erou primeste sageata spre intrarea lui (si cel cu sageata oprita) si iconita butonului deasupra intrarii;
   - G9 in timpul unei lupte cu George (oricare din cele doua, si cu inelul de 10 lovituri) portile nu isi schimba starea;
   - G10 la reinceperea nivelului ("Încă o dată!"), totul porneste de la zero.
2. mechSteps(gate): pentru fiecare erou `{ x, y, act }`, cu act din 3.7. guideTarget(h) (08-draw.js) o foloseste: sageata fiecarui erou arata spre locul lui. drawHints deseneaza iconita butonului deasupra locului, in culoarea eroului, sub banda de sus (HUD_TOP).
3. Textele noi in STR, romana si engleza.
4. tests/mecanisme.js, partea a treia: fiecare regula G1 - G10 verificata separat, pe definitia de proba si cu placile din T7.2. Fiecare verificare pica atunci cand regula e stricata (scrie in docs/17-testare.md ce ai stricat pentru fiecare). Plus: mechSteps da un loc si o actiune pentru fiecare erou, la fiecare poarta inchisa.

Gata cand: toate verificarile G1 - G10 trec si pica cand regula e stricata. tests/hud-acoperire.js cu STRICT=1 ramane la 0%. tests/toate.sh trece.

Nu face: nivelul 7 (T7.4), botii (T7.5).
````

<a id="t7-4"></a>

### T7.4 - Nivelul 7: Canionul Podurilor de Lumină

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le. Citeste si inceputul sectiunii T7 din acelasi fisier.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia: docs/25-niveluri-7-12.md, sectiunea 4, "Nivelul 7", si sectiunile 1, 8, 9 si 10 pentru ce tine de nivelul 7. Stilul: docs/05-pictura.md ("Imaginile Krea") si docs/24-sisteme-noi.md, S7. T7.1 - T7.3 sunt facute.

Sarcina T7.4: primul nivel nou, intreg.

Ce faci:
1. Definitia `canyon` la LEVEL_DEFS_L, pozitia 6, cu `look: 'diorama'` si `bands` (plates1, plates2). Paleta `canyon` in PALS si in PALS_ART. CONFIG.lupta.levels devine 7. Capitolele (chapters()) si salvarea il primesc.
2. Imaginile Krea ale nivelului, decupate din harta aleasa de proprietara, art/krea-ref/nivel7-harta.jpg (sau refacute cu ea ca referinta), in acelasi stil cu nivelurile 1 - 6 (acuarela de carte pentru copii, fara negru, fara gri): doi copaci, o stanca rosiatica, un tufis, flori, un stalp de piatra din prapastie, balansoarul din trunchi, placa. Fundul prapastiei (#3A4A8A spre #6A7AC0, cu ceata) si podul de lumina din sapte scanduri colorate se picteaza pe canvas. Pune imaginile in art/krea/, ruleaza python3 tools/pack-art.py. Cere aprobarea proprietarei pe o foaie cu imaginile, inainte sa le pui in joc. Spune-i cate credite Krea costa (cam 33 - 44 pe imagine).
3. Podul de lumina: cele sapte scanduri apar una dupa alta, de la malul placii apasate, si se sting la fel. Foloseste mechMove.
4. Pasarile (2), robotii putini, vantul, cele trei stele (islet pe stalpul din prapastie, nook, treetop), balansoarul (cei doi la capete: se leagana si rad, nu da nimic).
5. Inamicii mici (fieldEnemies, T15) se impart pe cele trei treimi, ca fiecare treime sa aiba de unde da diamante. Cota (15) si cele doua lupte cu George raman ca pe nivelurile 1 - 6.
6. Textele nivelului (romana si engleza, din sectiunea 8), iconitele povestii, si textul lvl.canyon.intro: incepe Partea a doua, spune puterile noi, fuga si cele 10 secunde.
7. Muzica: refoloseste 'l6' (cum scrie in definitie). Sunetele noi doar daca le cere sectiunea 9 pentru nivelul 7.
8. Planul din fata (L.front) si harta de lumina (LM) merg pe nivelul 7. Planul din fata nu acopera niciodata un erou.

Gata cand: nivelul 7 se joaca de la inceput la cuib cu doi jucatori pe tastatura. Capturi de la inceput, poarta A, poarta B, o lupta cu George si cusca, privite cu ochiul, cu lista S7.8. numara-elemente.js trece pentru nivelul 7. tests/stil-grafic.js are o captura a nivelului 7 sub 0.1% pixeli negri sau gri. tests/toate.sh trece.

Nu face: botii si testele lungi (T7.5). Nivelurile 8 - 12.
````

<a id="t7-5"></a>

### T7.5 - Boti, teste complete, documentatie

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le. Citeste si inceputul sectiunii T7 din acelasi fisier.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia: docs/25-niveluri-7-12.md, sectiunea 11. T7.1 - T7.4 sunt facute.

Sarcina T7.5: nivelul 7 jucat de boti, toate testele si documentatia.

Ce faci:
1. tests/nivele-bot-mers.js: botii folosesc mechSteps si termina nivelul 7, fara blocaj mai lung de 20 de secunde. Si cu un singur jucator.
2. tests/mecanisme.js, partea finala, pe nivelul 7 adevarat: fiecare poarta inchisa la inceput; nu se deschide cu un singur erou facandu-si partea; se deschide cu amandoi; se deschide cu un singur jucator (G6); se deschide singura dupa autoOpen (G7).
3. tests/mini-lupte-bot.js si tests/joc-complet-bot.js trec cu 7 niveluri (joc-complet ajunge la lupta finala prin nivelul 7). tests/inel.js trece pe nivelul 7.
4. tests/performanta.js: nivelul 7 cel mult 20% peste nivelul 6, in aceeasi rulare (minim cinci runde).
5. tests/capturi-ecran.js: capturi p2_canyon_* (inceput, poarta A, poarta B, lupta, cusca).
6. Documentatia se muta, nu se dubleaza: ce e facut din docs/25-niveluri-7-12.md (3.1 - 3.4 pentru placi si cusca, 3.6, 3.7, nivelul 7) trece in docs/09-niveluri.md, docs/10-gameplay.md, docs/12-desen-si-hud.md si docs/03-config.md, la timpul prezent. Decizii noi in docs/16-decizii.md, rezultatele in docs/17-testare.md, ce n-ai putut verifica in docs/19-limitari.md. In docs/23-update-partea-a-doua.md marchezi T7.1 - T7.5 facute. In CLAUDE.md: progresul, randurile noi din tabel (065-mech.js, CONFIG.mech) si capcanele noi.

Gata cand: tests/toate.sh trece intreg, cu errors 0 si fara NEREUSIT. Fisierul jocului trimis proprietarei.

Spune la final ce nu ai putut verifica: daca un copil de 6 ani intelege placile fara ajutor, daca 5 secunde la poarta B sunt destule fara fuga, cum se simt vibratiile, cum suna clopotelul.
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

La final scrie proprietarei raportul obisnuit si, pentru toate sarcinile facute pana atunci, o lista scurta cu tot ce a ramas neverificat (controllere reale, cum suna, cum se simt vibratiile, daca mecanismele sunt intelese de un copil de 6 ani, daca cele 10 secunde sunt prea putine, daca fuga strica luptele, daca limbile se deosebesc pentru urechea unui copil de 6 ani, daca balonul incurca) si ce ar trebui sa incerce cu copiii, in ordine.
````

---

<a id="t14"></a>
## T14. Cota de oua si cristale (impartit in 10 subsarcini)

T14 e impartit in zece sarcini, cu acelasi format ca restul. Ordinea: T14.1 -> T14.2 -> T14.3 -> T14.4 -> T14.5; apoi T14.6 si T14.7; T14.8 dupa T14.4 si T14.7; T14.9 dupa tot codul; T14.10 ultima. Fiecare se verifica inainte de urmatoarea.

Inainte de T14.1: T1 si T2 sunt facute (in `main`). Daca T1 nu e facuta, opreste-te.

<a id="t14-1"></a>

### T14.1 - Cota (partea 1): cifrele si semintele

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia cotei: docs/27-cota-de-oua.md, sectiunile C1 - C16. Cererea proprietarei e la inceputul ei; daca specificatia si cererea difera, cererea are dreptate: spune-i proprietarei.

Sarcina T14.1: fiecare nivel are o cota (10, 15, 20... 65), iar numarul de oua de pe harta se calculeaza din ea.

Ce faci:
1. `CONFIG.quota` in `src/01-config.js`, cu comentarii (C7).
2. `genLevel` in `src/06-level.js`: `E = ceil(extra * cota)` in locul `levelDuration / 60 * eggsPerMinute`. Valurile se impart ca acum. Dupa generare, daca `2q <= E <= 2 * cap` nu e adevarat, `buildLevel` incearca urmatoarea samanta.
3. `levelDurationOf(L)` = `max(CONFIG.levelDuration, E / eggsPerMinute * 60)`. Soarele din HUD, medalia si ajutorul din `updatePlay` folosesc durata nivelului, nu `CONFIG.levelDuration`.
4. Daca `CONFIG.quota` e gresit (extra in afara lui `[2, 2 * cap]` sau lipseste o cota), `console.error` la pornire, iar jocul foloseste 60 de oua ca inainte.

Gata cand: pentru nivelurile 1 - 12, `2q <= L.totalEggs <= 2 * cap` in 10 seminte diferite (testul e in T14.9, aici verifici cu un script scurt). `build.sh`, `gen-docs.js` si `tests/toate.sh` nu au regresii fata de main.

Nu face: nu schimba jocul pentru erou (luarea ouului e in T14.2). Nu schimba medaliile.
````

<a id="t14-2"></a>

### T14.2 - Luarea ouului cu cota

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia cotei: docs/27-cota-de-oua.md, sectiunile C1 - C16. Cererea proprietarei e la inceputul ei; daca specificatia si cererea difera, cererea are dreptate: spune-i proprietarei.

Sarcina T14.2: un ou luat intr-un nivel cu cota trece la eroul care il ia, dar eroul nu poate avea mai mult de 150% din cota.

Ce faci (C2 parte, C3, C8, C9):
1. Oul are campul `goal`: `true` pentru oul din val sau copac (`makeEgg`) si pentru oul scapat de un erou lovit (`dropped`, cu `req: false`). Oul urias, ouale din paznic si bonusul curcubeului: `goal: false`.
2. `P.q`, `P.cap = ceil(1.5 * P.q)`, `P.found[k]`, `canTake(e, k)` (`!bothJoined() || P.found[k] < P.cap`), `quotaOk(k)`, `quotaState(k)`.
3. `collectEgg(e, k)`: daca `e.goal` si `!canTake`, oul ramane pe jos, `capHint(k, e)` (balonul "Plin!" o data la 1.2 s, `Snd.play('no')`, un salt mic). Altfel `P.found[k]++` doar pentru `goal`.
4. Tropaiul (`e.pull`) si mingea lui Leo / Killer ocolesc eroul plin.
5. `hitHero`: eroul lovit scapa un ou al lui (`P.found[h.k]--`). Daca nu are niciunul, nu scapa nimic. Oul scapat se numara pentru cine il ia.

Gata cand: un erou plin nu mai ia oua `goal` si balonul apare; prietenul le ia. Un erou lovit fara oua nu pierde oua ale prietenului. `tests/cota.js` (T14.9) cu verificarile 3 si 10 trece; le poti verifica si ca script scurt pana atunci.

Nu face: nu schimba L1 (T14.3) si nu da oua cu L1 (T14.4). Nu schimba fasonul insignei.
````

<a id="t14-3"></a>

### T14.3 - Butonul L1 si pagina de taste

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia cotei: docs/27-cota-de-oua.md, sectiunile C1 - C16. Cererea proprietarei e la inceputul ei; daca specificatia si cererea difera, cererea are dreptate: spune-i proprietarei.

Sarcina T14.3: L1 da un ou prietenului. Aici se adauga doar butonul; actiunea e in T14.4.

Ce faci (C6):
1. `src/04-input.js`: campul `g` si `gP` in `Input.slots[k]` (frontul apasarii), `kb.g`. Indicele butonului: 4.
2. Tastele: jucatorul 1 `KeyR`, jucatorul 2 `Period`. Verifica `RESERVED`.
3. `src/01-config.js`: `keys[k].g`. `src/09-screens.js`: `KEY_FIELDS` si randul "Dă un ou prietenului (butonul L1)" in pagina "Alege tastele".
4. O salvare veche fara `g` ramane cu valoarea din `CONFIG`. Testerul din Setari arata deja orice buton; verifica doar ca L1 are loc desenat.

Gata cand: in Setari apare randul L1, poate fi schimbat, iar `Input.slots[k].gP` se aprinde la apasare (testat cu controller simulat si cu tastatura). `tests/setari-ui.js` si `tests/tastatura-reala.js` trec.

Nu face: nu scrie `giveEgg` (T14.4).
````

<a id="t14-4"></a>

### T14.4 - Dat cu L1: ouale in zbor si sageata

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia cotei: docs/27-cota-de-oua.md, sectiunile C1 - C16. Cererea proprietarei e la inceputul ei; daca specificatia si cererea difera, cererea are dreptate: spune-i proprietarei.

Sarcina T14.4: un erou ii poate da prietenului un ou apasand L1 (sau tinut apasat, la 0.3 s).

Ce faci (C4, C5):
1. `giveEgg(k)` din `updateHero` cand `gP` e apasat (sau tinut, la `CONFIG.quota.giveEvery`). Verificari in ordine: prietenul joaca; eroul nu e `down` / ametit; `P.found[k] >= 1`; prietenul are loc sub `cap` (incl. ouale in zbor); distanta <= `giveRange` (420).
2. Daca da: `P.found[k]--`, oul intra in `P.gifts` (`{ from, to, t, x0, y0 }`) si zboara in arc 0.45 s. La sosire `P.found[to]++`.
3. `updateGifts(dt)`, desenarea oului in zbor (acelasi desen ca oul din joc). `Snd.play('give', 0, k)` la plecare (doua note de marimba, urcand), `Snd.play('egg', 0, 1 - k)` la sosire. `Input.rumble(k, 0.1, 0.3, 60)` si `Input.rumble(1 - k, 0, 0.4, 80)`. Cel care da spune `together`, cel care primeste `thanks`.
4. Prea departe sau fara oua: nu da nimic; `reachHint` si sageata spre prieten (`drawGuides`) cat tii apasat; numarul clatina.
5. Texte: `quota.far` ("Apropie-te de {0}!") in `STR`, ambele limbi, cu varianta `L:` nu e nevoie.

Gata cand: `tests/cota.js` verificarile 4 si 5 trec (cu L1 simulat si cu tasta). Un ou dat ajunge chiar daca eroul care a dat e lovit pe drum.

Nu face: nu schimba bannerele (T14.8). Nu termina nivelul (T14.5).
````

<a id="t14-5"></a>

### T14.5 - Sfarsitul nivelului cu cota

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia cotei: docs/27-cota-de-oua.md, sectiunile C1 - C16. Cererea proprietarei e la inceputul ei; daca specificatia si cererea difera, cererea are dreptate: spune-i proprietarei.

Sarcina T14.5: nivelul se termina doar cand amandoi sunt in cuib si fiecare si-a gasit cota (C2).

Ce faci:
1. In `updatePlay`: `const quotaMet = !quotaOn() || (quotaOk(0) && quotaOk(1));` si conditia de final: `ready && quotaMet && (...)`.
2. Cat timp amandoi sunt in cuib si `quotaMet` e fals: bannerul `quota.need` ("{0} mai are nevoie de {1}!", cu "un ou" / "{n} ouă" sau varianta `L:`), `P.needT` creste (pentru C12, implementat in T14.6). Cuibul ramane deschis.
3. Ouale ramase pe jos pot fi luate in continuare. `P.nestOpenT > 14` ramane, dar nu mai e de ajuns singur.
4. Cu un singur jucator (C13): cota celuilalt e indeplinita, nu se arata numaratoarea, nivelul se termina cand cel care joaca are `q`.

Gata cand: exemplul din cerere (cota 10, un erou 15, celalalt 7, ambii in cuib) nu termina nivelul; dupa ce primeste ouale cu L1, il termina. Verificarea 6 din `cota.js` trece.

Nu face: nu schimba insigna (T14.7).
````

<a id="t14-6"></a>

### T14.6 - Ajutor automat si cazuri speciale

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia cotei: docs/27-cota-de-oua.md, sectiunile C1 - C16. Cererea proprietarei e la inceputul ei; daca specificatia si cererea difera, cererea are dreptate: spune-i proprietarei.

Sarcina T14.6: nimeni nu ramane blocat in cuib, si cazurile de margine din C9 merg.

Ce faci:
1. Ajutorul automat (C12): dupa `CONFIG.quota.autoGive` (120) secunde in cuib cu o cota care lipseste, jocul transfera singur, din `autoEvery` (2) in 2 secunde, cate un ou de la cel care are peste cota la cel care lipseste. 0 opreste ajutorul. Apare `quota.auto` ("{0} îți trimite un ou.").
2. Prietenul deconectat: cota lui se socoteste indeplinita pana revine, fara a pierde oua (C9).
3. Al doilea jucator intra in mijlocul nivelului (C14): ouale peste limita primului trec la el, pana la limita lui, cu zborul de la T14.4.
4. Reincepere dupa cele 10 secunde (T4): `P` se reface, `P.found` revine la 0.
5. Nivelurile 5 (oul urias), luptele mari (fara cota) si curcubeul (bonus, nu intra in cota) raman cum sunt.

Gata cand: `tests/cota.js` verificarile 9, 11 si 13 trec. Cu `autoGive` 0 nu se transfera nimic.

Nu face: nu schimba mesajele din cardul din mijloc (T14.8).
````

<a id="t14-7"></a>

### T14.7 - Insigna verde / rosie si sfarsitul de nivel

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia cotei: docs/27-cota-de-oua.md, sectiunile C1 - C16. Cererea proprietarei e la inceputul ei; daca specificatia si cererea difera, cererea are dreptate: spune-i proprietarei.

Sarcina T14.7: insigna din colt arata portretul, ce a gasit fiecare erou si cata cota are.

Ce faci (C5 tabel, C10):
1. `drawBadge` in `src/08-draw.js`: 300 x 108 (y 16 - 124, in banda de 132). Portretul pictat de acum, 80 x 80, numele, dificultatea sus dreapta, ou / cristal mic si "gasite / cota" (marimea 46).
2. Verde `#3E9A5A` cand `gasite >= cota`, rosu `#D6503F` cand nu; contrast cel putin 3 : 1 pe `#FFF3DC`; contur `shade(col, -0.35)`.
3. Bifa pictata (un ✓ rotund, verde) doar cand e gata. Cand lipsesc oua, numarul se clatina 1 grad o data la 3 s. Cand a dat sau a primit un ou, numarul creste la 1.25 si revine in 0.2 s.
4. `iconL1` in `src/02-core.js`, langa `iconSq`: disc crem cu margine lila, litera "L1".
5. Ecranul de sfarsit (`drawLevelEnd`): cei doi eroi cu portret, `gasite / cota` si bifa. Numai citit.
6. La luptele mari insigna nu arata numaratoarea.

Gata cand: `tests/cota.js` verificarile 7 si 14 trec; `hud-acoperire.js` cu `STRICT=1` ramane la 0%. Capturi ro si en, cu insigna rosie si verde, privite cu ochiul.

Nu face: nu schimba bannerele si textele (T14.8).
````

<a id="t14-8"></a>

### T14.8 - Mesajele "Ai găsit toate", "mai are nevoie" si ghidul

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia cotei: docs/27-cota-de-oua.md, sectiunile C1 - C16. Cererea proprietarei e la inceputul ei; daca specificatia si cererea difera, cererea are dreptate: spune-i proprietarei.

Sarcina T14.8: cand un erou isi gaseste cota, prietenul vede un mesaj cu cum sa-i dea un ou.

Ce faci (C5 texte, C11):
1. Bannerul `quotaDone`, o data pe nivel pentru fiecare erou (`P.quotaMsg[k]`), cand prietenul nu are cota: portretul eroului, o sageata animata de la insigna lui spre insigna prietenului, cu `iconL1` care pulseaza. Text: `quota.done` / `L:quota.done` (vezi C5). Se scurteaza cu `wrapLines` daca e prea lat.
2. Daca ambii isi gasesc cota in acelasi timp, `quotaBoth` ("Amândoi ați găsit toate! La cuib!") si sageata spre cuib.
3. `quota.full` ("Plin!"), `quota.far` si `quota.auto` in `STR`, romana si engleza, cu varianta `L:` pentru al doilea joc.
4. `guideTarget`: un erou plin e indrumat spre prieten, cu `iconL1` in balonul de la capat (`kind: 'give'`).
5. Textele cu `{1}` = `L1` pe controller sau numele tastei pe tastatura (ca `pressLabel`).

Gata cand: verificarea 8 din `cota.js` trece in ambele limbi. Mesajul apare o singura data, numai cand prietenul nu are cota, cu numele corect (Boon / Killer si Leo / Bubu). Nu apare cand amandoi termina deodata.

Nu face: nu schimba ce numara jocul (T14.5).
````

<a id="t14-9"></a>

### T14.9 - tests/cota.js: cele 16 verificari

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia cotei: docs/27-cota-de-oua.md, sectiunile C1 - C16. Cererea proprietarei e la inceputul ei; daca specificatia si cererea difera, cererea are dreptate: spune-i proprietarei.

Sarcina T14.9: scrie `tests/cota.js` cu cele 16 verificari din C10, pentru cele doua jocuri (ca in `tests/toate.sh`, cu `errors 0`).

Ce faci:
1. Verificarile 1 - 16 din C10, fiecare cu rezultat `ok` sau `GRESIT`.
2. Fiecare verificare trebuie sa poata sa pice: strica regula (de exemplu lasa `canTake` mereu adevarat), ruleaza testul, vezi `NEREUSIT`, pune la loc.
3. Adauga `cota.js` in `tests/toate.sh`.

Gata cand: toate cele 16 trec si fiecare pica atunci cand regula e stricata. Descrierea fiecarei verificari e in `docs/17-testare.md`.

Nu face: nu scrie boti noi (T14.10).
````

<a id="t14-10"></a>

### T14.10 - Boti, teste complete, documentatie

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Jocul e "Cea mai grea luptă" (singurul joc). Specificatia cotei: docs/27-cota-de-oua.md, sectiunile C1 - C16. Cererea proprietarei e la inceputul ei; daca specificatia si cererea difera, cererea are dreptate: spune-i proprietarei.

Sarcina T14.10: jocul se termina cu botii, toate testele trec, iar documentatia e la zi.

Ce faci:
1. `tests/common.js`: `balanseaza()` ca botii sa dea cu `__game.giveEgg` cand e nevoie.
2. `joc-complet-bot.js` si `nivele-bot-mers.js` termina tot jocul. Notezi timpul pe nivel in `17-testare.md`.
3. `tests/toate.sh` intreg, cu `errors 0`. `hud-acoperire.js` cu `STRICT=1` ramane la 0%.
4. Documentatia: `03-config.md`, `07-control.md` (L1), `09-niveluri.md`, `10-gameplay.md`, `12-desen-si-hud.md`, `13-ecrane-si-meniuri.md`, `16-decizii.md` (C1 - C16 cu motivul), `17-testare.md`, `19-limitari.md`, `00-cuprins.md`, `README.md`, regulile 8 si 10 din `CLAUDE.md`, sectiunea 6 din `23`. `27-cota-de-oua.md` devine istoric, cu o nota in cap ca a fost implementat.
5. `node tools/gen-docs.js` si `./build.sh`.

Gata cand: `tests/toate.sh` trece intreg, cu `errors 0` si fara `NEREUSIT`. Capturile (ro si en) sunt privite cu ochiul. Raportul catre proprietara include ce nu s-a putut verifica (C11).

Nu face: nu schimba nivelurile noi (T6 - T12) sau limba (T13).
````


## T15. George vine de doua ori, cu diamante comune (7 subsarcini)

Specificatia: docs/28-t15-george-de-doua-ori.md (versiunea din 22 noiembrie 2026, dupa raspunsurile proprietarei). Ordinea: T15.1 si T15.2 intai, apoi T15.3 - T15.7.

### T15.1 - Fara maxim, cota 15 peste tot

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Specificatia: docs/28-t15-george-de-doua-ori.md, sectiunile 1, 2 si 9.

Sarcina T15.1: fara maxim. Cota e 15 pe erou, la toate nivelurile.

Ce faci:
1. `CONFIG.quota.perLevel` = 15 pentru toate cele 12 niveluri. Scoti `cap`, `extra`.
2. Scoti `P.cap`, `canTake` (nu mai refuza pentru cota), balonul "Plin!" (`quota.full`, `h.fullT`, desenul lui).
3. `quotaState(k)` intoarce `{ found, q, ok }`.
4. Insigna: `gasite / 15`; peste cota, un `+n` mic in verde, cu cheia `quota.extra`. Numarul nu mai e rosu dupa cota.
5. Randul de pe ecranul de sfarsit de nivel: la fel.
6. Adaptezi testele care foloseau `cap`: `tests/cota.js` (verificarile 3, 4, 9, 11), `ordine-nivel.js`, `cuib-amandoi.js`.

Gata cand: `./build.sh`, `node tools/gen-docs.js`, apoi `tests/cota.js`, `joc-complet-bot.js`, `controller-simulat.js`, `setari-ui.js`, `hud-acoperire.js` (cu `STRICT=1`) trec, cu `errors 0` si fara `NEREUSIT`. Te uiti la capturi.

Nu face: nu atinge sursa diamantelor (T15.2) si nu adauga inamici noi (T15.3).
````

### T15.2 - Diamante doar din inamicii omorati

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Specificatia: docs/28-t15-george-de-doua-ori.md, sectiunile 2, 7.1 si 9.

Sarcina T15.2: diamantele vin doar din inamicii omorati. Inamicii mici reapar.

Ce faci:
1. Scoti diamantele din valuri (`makeEgg` cu `req` in `06-level.js`). Copacii raman si pot straluci, dar acum ascund melci, nu diamante: `shakeTree`/`spark` scot un melc (inamic mic), nu un ou.
2. Un inamic mic omorat (`hitSmall` sau echivalent) lasa `CONFIG.lupta.enemyDrop` (1) diamant, care e `goal`.
3. Scoti `keepEnough()`, `CONFIG.quota.supply`, `refillEvery`, bannerul `george.more`.
4. `CONFIG.lupta.fieldEnemies` = [12, 14, 15, 15, 17, 18]: inamici mici pe harta, pe nivel (cu 50% mai multi decat prima varianta). Cifrele sunt exemple de pornire, se ajusteaza la joaca.
5. Verifici pe 10 seminte ca nivelul are cel putin 30 de inamici mici care pot fi omorati pe rand (cu reaparitia de la `CONFIG.smallEnemy.respawn`).

Gata cand: `tests/cota.js` (verificarea 1 adaptata: diamantele apar doar din omoruri), `numara-elemente.js`, `inamici-mici.js`, `joc-complet-bot.js` trec, cu `errors 0`. Raportezi cat durau cele 30 de omoruri in botul cu doi eroi.

Nu face: nu lasa niciun diamant sa apara la valuri sau la copaci, nici macar ca bonus. Copacii nu scot diamante, doar melci.
````

### T15.3 - Mini-George

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Specificatia: docs/28-t15-george-de-doua-ori.md, sectiunile 3 si 9.

Sarcina T15.3: un inamic nou, Micul George, cu 3 inimioare, in alte culori.

Ce faci:
1. Inamic mic nou, cu 3 inimioare (`CONFIG.lupta.miniGeorge.hp`), care urmareste cel mai apropiat erou (`chaseSpeed` de 120 sau mai mic, de verificat).
2. Nu loveste. Se omoara ca un inamic mic: sarit sau minge.
3. Cand e omorat, lasa `CONFIG.lupta.miniGeorge.drop` (1) diamant. Reapare dupa `respawn`.
4. Pe harta: `CONFIG.lupta.miniGeorge.perLevel` = [1, 1, 1, 2, 2, 2].
5. Pictezi in alta culoare (verde-ulei propus), in stilul acuarela, fara contur negru. Text: `mini.name` in `STR`.
6. Adaugi regula de urmarire in `docs/11-mini-lupte.md`, ca un tipar nou, pentru inamicii care nu lovesc.

Gata cand: verificarea 4 din `28`, sectiunea 12, trece; `tests/cota.js` si `inamici-mici.js` trec; capturi cu Micul George langa Boon si Killer, in romana si in engleza.

Nu face: nu-l lasa sa loveasca, nici chiar cand e langa un erou.
````

### T15.4 - Declansatorul pe diamante comune

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Specificatia: docs/28-t15-george-de-doua-ori.md, sectiunile 1, 2 si 5.

Sarcina T15.4: luptele pornesc din totalul comun de diamante, nu din valuri.

Ce faci:
1. `P.teamFound = P.found[0] + P.found[1]`, numarat o data (diamantele date cu L1 nu se numara de doua ori).
2. La `teamFound >= 15` si `!P.midFought`: `P.midFought = true`, bannerul `george.half`, apoi `startDuel('mid')`.
3. La `teamFound >= 30` si `!P.nestFought`: `P.nestFought = true`, bannerul `george.final`, apoi `startDuel('nest')`.
4. Lupta din mijloc nu porneste in primele `CONFIG.lupta.george.minT` (20) secunde.
5. `checkWave()` ramane doar cu valurile si cu deschiderea cuibului.
6. Dupa reincepere ("Încă o dată!"), `teamFound`, `midFought` si `nestFought` sunt zero.

Gata cand: verificarile 5, 6 si 12 din `28` trec, plus `tests/cota.js`, `ordine-nivel.js`, `joc-complet-bot.js`, `capitole.js`, cu `errors 0`.

Nu face: nu schimba ce arunca George (T15.5 si T15.6).
````

### T15.5 - Lupta din mijloc: oase si mingi

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Specificatia: docs/28-t15-george-de-doua-ori.md, sectiunile 4.1, 7.2 si 9.

Sarcina T15.5: in lupta din mijloc, George arunca oase si mingi, nu inamici.

Ce faci:
1. `CONFIG.lupta.george.midThrows` = [2, 3, 3, 4, 4, 5] (oase si mingi pe nivel).
2. Un os sau o minge care atinge un erou il ameteste, ca un con. Refolosesti codul de la conuri (`11-mini-lupte.md`).
3. Cad pe pamant ca conurile, cu cercul rosu.
4. Nu se numara in diamante si nu sunt inamici.

Gata cand: verificarea 7 din `28`, sectiunea 12, trece; `joc-complet-bot.js` si `performanta-lupta.js` trec. Capturi cu un os in zbor.

Nu face: nu le lasa sa loveasca in afara ametelii, si nu adauga inamici in lupta din mijloc.
````

### T15.6 - Lupta de la cuib: aruncari dupa inimi

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Specificatia: docs/28-t15-george-de-doua-ori.md, sectiunile 4.2, 7.2 si 9.

Sarcina T15.6: in lupta de la cuib, George arunca dupa cate inimi ii raman.

Ce faci:
1. Cand pierde o inima peste jumatate (`ramase > H/2`, cu `H` din `duelFinalHp`): 2 oase si mingi.
2. La prima ramasa `<= H/2`: inamici din prima jumatate din `CONFIG.lupta.george.nestEnemies`.
3. Cand mai pierde inimi sub jumatate: restul inamicilor.
4. Cand ii ramane o inima: inamicii care urmaresc ambii eroi (`chaseSpeed`), pana sunt omorati. Banner `george.last`.
5. Inamicii aruncati: `enemyHp[nivel]` inimi, `enemyDrop` diamant, dispar cand George e invins.
6. George nu e blindat.

Gata cand: verificarile 8, 9, 10 si 11 din `28` trec; `joc-complet-bot.js`, `performanta-lupta.js`, `hud-acoperire.js` (cu `STRICT=1`) trec, cu `errors 0`. Capturi pe nivelurile 1, 2 si 6.

Nu face: nu le lasa sa stea pe loc dupa ce George e invins.
````

### T15.7 - Teste, documentatie, CLAUDE.md

````
Lucrezi la depozitul GitHub alexandrafofel/bubu_and_leo.
Citeste intai prompts/06-prompt-partea-a-doua.md, sectiunile "Context" si "Reguli de lucru", si respecta-le.
Specificatia: docs/28-t15-george-de-doua-ori.md, sectiunile 8, 12 si 13.

Sarcina T15.7: testele, documentatia si regulile.

Ce faci:
1. `tests/george.js` cu cele 14 verificari din `28`, sectiunea 12, fiecare pusa sa pice cu `MUTA=n`. Il adaugi in `tests/toate.sh`, dupa `cota.js`.
2. `tests/toate.sh` intreg, cu `errors 0` si fara `NEREUSIT`.
3. Documentatia: `03-config.md`, `09-niveluri.md`, `10-gameplay.md`, `11-mini-lupte.md`, `12-desen-si-hud.md`, `17-testare.md`, `19-limitari.md`, `16-decizii.md`, `23-update-partea-a-doua.md` (T15.1 - T15.7 marcate "Facut"), `27-cota-de-oua.md` (nota ca 15 e cota acum).
4. `CLAUDE.md`: regulile 6, 9, 10 si tabelul "Unde gasesti lucrurile".
5. `node tools/gen-docs.js` si `./build.sh`.

Gata cand: `tests/toate.sh` trece intreg. Capturile (ro si en) sunt privite cu ochiul. Raportul catre proprietara include ce nu s-a putut verifica (`28`, sectiunea 13).

Nu face: nu lasa nivelul sa se termine fara George invins.
````
