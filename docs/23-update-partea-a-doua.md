# 23. Update urmator: "Cea mai grea luptă", Partea a doua (rundele 7 - 12)

> **Un singur joc (18 noiembrie 2026).** "Bubu și Leo" a fost scos. Tot ce e specificat aici se implementeaza **doar in "Cea mai grea luptă"**. Unde scrie "ambele jocuri", "primul joc", variante `L:` sau teste pentru `bubu`, se citeste: un singur joc, textele lui (varianta `L:`), un singur rand de teste. Nu se mai scrie cod pentru primul joc.

Status: **specificatie, neimplementata.** Nimic din acest capitol nu exista inca in cod.

Cererea proprietarei, cuvant cu cuvant, este in `../prompts/05-cerere-16-noiembrie.md`. Promptul gata de lipit pentru cel care implementeaza este in `../prompts/06-prompt-partea-a-doua.md`.

Specificatia are cinci capitole. Citeste-le in ordine. Promptul gata de lipit pentru fiecare dintre cele 32 de sarcini este in `../prompts/06-prompt-partea-a-doua.md`.

| Capitol | Ce contine |
|---|---|
| 23 (acesta) | Ce se cere, ce s-a hotarat, ce a ramas de intrebat, principiile luate din "It Takes Two", planul in 32 de sarcini, regulile din `CLAUDE.md` care se schimba. |
| [24](24-sisteme-noi.md) | Sistemele noi, comune tuturor nivelurilor: butoane, fuga, a doua putere, cele 10 secunde, capitole si salvare, scrisul de sus, stilul grafic. |
| [25](25-niveluri-7-12.md) | Povestea, mecanismele de colaborare, cele 6 niveluri noi, luptele cu George, lupta finala, texte, sunete, decor. |
| [26](26-limba-personajelor.md) | Limba personajelor (T13): patru limbi de cam 1000 de cuvinte, generate, cu fraze, balon cu traducerea si Dictionar. |
| [27](27-cota-de-oua.md) | Cota de oua si cristale (T14): fiecare erou are de gasit un numar pe nivel, tine cel mult 150%, ii da prietenului cu L1; insigna verde / rosie si mesajul "Ai gasit toate". |

Tot ce e scris aici porneste de la codul de dupa update-ul din 14 noiembrie 2026 (`22-update-14-noiembrie.md`). Numele de functii si valorile citate au fost verificate in `src/` la 16 noiembrie 2026.

---

## 1. Ce se cere, pe scurt

| Nr | Cerinta | Rezumat |
|---|---|---|
| C1 | Inca 6 runde | Nivelurile 7 - 12 si o lupta finala noua, dupa Arena lui George. |
| C2 | Ca in "It Takes Two" | Fiecare nivel are un mecanism pe care niciun erou nu il poate face singur. |
| C3 | Grafica asemanatoare | Acelasi ecran comun. Lumina, materiale, adancime si miscare mult mai bogate. |
| C4 | Killer: a doua putere | Mainile i se lungesc si se rotesc in jurul lui, ca ghearele lui Boon. Alta culoare, alte detalii, vibratie. |
| C5 | Boon: a doua putere | Arunca in cerc, ca Killer, dar cu ceva de dinozaur. |
| C6 | Butoane | ✕ = prima putere. ○ = ajuta prietenul. □ = a doua putere. |
| C7 | L3 | Apasarea stick-ului stang: fuga, de 3 ori mai repede. |
| C8 | 10 secunde | Erou lovit: vibreaza ambele controllere. Daca nu e ajutat in 10 secunde, nivelul reincepe. |
| C9 | Capitole | La intrare: continua sau de la inceput. In plus, o lista de capitole din care se reia orice nivel jucat. |
| C10 | Bug | Scrisul de sus acopera personajele. |

---

## 2. Ce s-a hotarat (si de ce)

Cererea lasa cateva lucruri deschise. Mai jos e alegerea facuta pentru fiecare. Cele marcate **[I]** sunt si in lista de intrebari din sectiunea 3: daca proprietara raspunde altfel, se schimba doar valoarea din `CONFIG` aratata acolo.

| Nr | Hotarare | De ce |
|---|---|---|
| H1 | Al doilea joc are 12 niveluri si doua lupte mari: nivelurile 1 - 6, Arena lui George, nivelurile 7 - 12, Sala Tronului. Primul joc ramane cu 6 niveluri si lupta cu Ciori. | "urmatoarele 6 runde din cea mai grea lupta". Regula 9 din `CLAUDE.md` ("6 niveluri + lupta finala") se rescrie pentru al doilea joc. |
| H2 | Regulile noi de joc (butoane, fuga, cele 10 secunde, capitole, scrisul de sus) se aplica in **ambele** jocuri. **[I1]** | Regula 9: "Orice regula de joc e aceeasi in ambele jocuri". Motorul e comun, deci asa e si mai putin cod. |
| H3 | A doua putere o au doar Boon si Killer. In "Bubu și Leo", □ nu face nimic. **[I2]** | Cererea ii numeste doar pe ei. |
| H4 | Boon arunca **oase de dinozaur care se rotesc ca un bumerang**. | "ceva specific dinozaurilor". Un os se citeste dintr-o privire, nu seamana cu mingea si nu se confunda cu ouale din primul joc. **[I3]** |
| H5 | Mainile lungi ale lui Killer se termina in **manusi mari de portar**, rosii cu alb. Urma lor e din panglici albastre si albe, nu din gheare curcubeu. | "alta culoare, alte detalii sa nu arate fix la fel". Killer e fotbalist, iar bratele lungi sunt deja in desenul copilului. |
| H6 | Fuga porneste la o apasare de L3 si tine pana cand jucatorul lasa stick-ul. Nu trebuie tinut apasat. **[I4]** | A tine stick-ul apasat si inclinat in acelasi timp e greu pentru o mana de 6 ani. Asa merge fuga in cele mai multe jocuri. |
| H7 | Cele 10 secunde nu se aplica unui copil care joaca singur. El se ridica singur, ca acum. | Nu are cine sa il ajute. |
| H8 | Daca amandoi sunt loviti in acelasi timp, nivelul reincepe dupa 3 secunde. **[I5]** | Nimeni nu mai poate ajuta. Asa e si in "It Takes Two". Azi se ridica singuri dupa 3 secunde. |
| H9 | Ecranul de reincepere nu spune "Game Over". Spune "Încă o dată!". Dupa 3 reinceperi pe acelasi nivel, timpul creste la 15 secunde pentru nivelul acela. **[I6]** | Regula 6 se schimba la cererea proprietarei, dar jocul ramane bland. Plasa de siguranta e pentru copilul de 6 ani. |
| H10 | "Joc nou" sterge progresul jocului ales, dupa o intrebare. "Capitole" nu sterge nimic. Totalul de cristale este suma celor mai bune rezultate pe capitole. | Altfel reluarea unui capitol ar strica totalul. E modelul cel mai simplu de inteles. |
| H11 | Stilul nou ("diorama cu lumina") se aplica nivelurilor 7 - 12, luptei finale si eroilor celui de-al doilea joc. Nivelurile 1 - 6 raman pictate in acuarela. **[I7]** | Repictarea nivelurilor vechi dubleaza munca si nu a fost ceruta. |
| H12 | Nu se copiaza nimic din "It Takes Two": nici personaje, nici locuri, nici obiecte, nici nume, nici muzica. Se iau doar principiile de joc din sectiunea 4. | Jocul acela este al altcuiva. Lumea noastra ramane cea inventata de copii. |
| H13 | Un singur ecran comun, ca acum. Fara ecran impartit. | Cerut: "un singur screen cum e acum". |
| H14 | Povestea Partii a doua: George se intoarce la petrecere si fura cele zece stelute care ii imbratisau pe eroi. Eroii le elibereaza, una cate una. | Leaga finalul de acum de nivelurile noi fara personaje noi. Copiii pot schimba povestea: vezi `25-niveluri-7-12.md`, sectiunea 1. |

---

## 3. Intrebari pentru proprietara

Implementarea poate porni fara raspunsuri: se foloseste coloana "Daca nu raspunzi".

| Nr | Intrebare | Daca nu raspunzi | Unde se schimba |
|---|---|---|---|
| I1 | Fuga, cele 10 secunde si butoanele noi sa fie si in "Bubu și Leo"? | Da. | Nu mai e o intrebare: un singur joc, deci fuga si ajutorul sunt deja in el. Chei: `CONFIG.sprint.enabled`, `CONFIG.rescue.enabled` |
| I2 | Bubu si Leo sa primeasca si ei o a doua putere? | Nu. | `CONFIG.heroes[k].power2` |
| I3 | Boon arunca oase. Preferati altceva: oua pestrite, dinti, bulgari de lava? | Oase. | `CONFIG.lupta.heroes[0].throw.look` |
| I4 | Fuga: o apasare (tine pana lasi stick-ul) sau cat tii apasat? | O apasare. | `CONFIG.sprint.mode` |
| I5 | Amandoi loviti: reincepe nivelul sau se ridica singuri ca acum? | Reincepe dupa 3 secunde. | `CONFIG.rescue.bothDownRestart` |
| I6 | Dupa 3 reinceperi pe acelasi nivel, sa creasca timpul la 15 secunde? | Da. | `CONFIG.rescue.retryMercy` |
| I7 | Sa fie repictate si nivelurile 1 - 6 in stilul nou? | Nu, mai tarziu. | - |
| I8 | Reinceperea e "de la inceput". Sa existe varianta "de la ultimul val de cristale"? | Nu: de la inceput, cum e cerut. | `CONFIG.rescue.restart` |
| I9 | Copiii vor sa aleaga ei numele nivelurilor, ce fura George si cum arata lupta finala? | Se folosesc cele din capitolul 25. | texte in `STR` |
| I10 | Limba: una pentru fiecare erou (patru limbi) sau una pentru Bubu si Leo si alta pentru Boon si Killer? | Patru limbi. | `CONFIG.lang.seeds`, `LANG_PHON` |
| I11 | Cand un erou vorbeste, sa se vada si traducerea intr-un balon mic? | Da, se poate opri din Setari. | `CONFIG.lang.bubble` |
| I12 | Cuvintele sa se descopere pe parcurs si sa existe un Dictionar (ca o colectie)? | Da. | `CONFIG.lang.on`, ecranul `dict` |
| I13 | Pot limbile sa aiba si consoane moi (m, n, l, b, d...), nu doar vocale? | Da: fara ele nu ies 1000 de cuvinte care se deosebesc. | `LANG_PHON[].con` |
| I14 | Copiii vor sa-si aleaga ei cateva cuvinte (de exemplu 20 pentru fiecare erou: cum zice "ou", "salut", "mama")? | Nu; locul e pregatit in `CONFIG.lang.own`. | `CONFIG.lang.own` |
| I15 | Cota creste cu 5 pe nivel si la nivelurile 7 - 12 (40, 45, ... 65)? | Da. | `CONFIG.quota.perLevel` |
| I16 | Exemplul "unul gaseste 20, celalalt 0": un erou plin (150%) lasa oul pe jos, sau il ia si doar 150% se numara? | Oul ramane pe jos, pentru prieten. | `CONFIG.quota.cap` |
| I17 | Daca dupa 120 de secunde in cuib cota cuiva tot lipseste, jocul sa dea singur oua? | Da (regula 6: nimeni nu ramane blocat). `0` il opreste. | `CONFIG.quota.autoGive` |
| I18 | Portretul din insigna: cel pictat de joc dupa desenele copiilor, sau poza reala a desenului? | Pictat de joc (regula 1: fara imagini in fisier). | `drawBadge` |
| I19 | Oul uriaș, ouale din paznic si bonusul curcubeului intra in cota? | Nu: raman premii pentru echipa. | `egg.goal` |

---

## 4. Ce luam din "It Takes Two" si ce nu

"It Takes Two" (Hazelight, 2021) este un joc doar pentru doi. Nu se poate juca singur. Ce il face bun se poate spune in sase principii. Le aplicam in lumea noastra, cu mijloacele noastre (un ecran comun, vazut de sus, pictat pe canvas).

| Nr | Principiul | Cum arata la noi |
|---|---|---|
| P1 | **E nevoie de amandoi.** Fiecare obstacol important are doua jumatati. Un jucator deschide, celalalt trece. | Fiecare nivel nou are doua porti. Nicio poarta nu se deschide cu un singur erou (vezi "Mecanisme" in capitolul 25). |
| P2 | **Fiecare are unealta lui.** Cei doi nu pot face aceleasi lucruri, deci trebuie sa vorbeasca. | Tintele turcoaz asculta doar de Boon. Tintele albastre doar de Killer. Culoarea spune al cui e randul. |
| P3 | **Un capitol, o idee noua.** Nicio mecanica nu e folosita pana plictiseste. | Sase niveluri, sase mecanisme: poduri de lumina, tinte duble, pluta, cristalul purtat prin intuneric, bolovanul impins in doi, apoi toate la un loc. |
| P4 | **Intai inveti, apoi vine surpriza.** Prima intalnire cu o mecanica e fara pericol. A doua o rasuceste. | Poarta A a fiecarui nivel e lectia. Poarta B adauga timp, pericol sau a doua putere. |
| P5 | **Esecul e scurt si fara rusine.** Daca unul cade, celalalt il poate aduce inapoi. Doar daca amandoi cad se reia. | Ajutorul cu ○ in 10 secunde. Reinceperea spune "Încă o dată!" si dureaza 2 secunde. |
| P6 | **Lumea e o jucarie.** Aproape orice lucru raspunde cand il atingi, chiar daca nu ajuta la nimic. Eroii sunt mici intr-o lume mare. | Decorul care reactioneaza exista deja (1700 de lucruri pe nivel). Se adauga obiecte uriase, lumini care se aprind, lucruri care se leagana. |

Ce **nu** luam: personajele si povestea lor, nivelurile, obiectele recunoscute din joc, camera 3D, ecranul impartit, minijocurile unul contra altul.

Despre grafica, cinstit: "It Takes Two" este un joc 3D facut cu un motor mare. Jocul nostru este pictat in 2D, intr-un singur fisier, fara imagini. Nu poate arata la fel. Poate avea aceleasi **calitati**: o singura sursa de lumina care da volum fiecarui lucru, materiale care se recunosc (lemn, metal, panza, sticla), umbre care leaga obiectele de pamant, adancime (lucruri in fata si in spate), lumini care stralucesc, miscare in tot ce e viu. Exact ce inseamna asta e in `24-sisteme-noi.md`, S7.

---

## 5. Planul: 32 de sarcini (T6 si T14 impartite in cate zece subsarcini)

Fiecare sarcina se poate termina, testa si trimite separat. T6 e impartit in zece subsarcini (T6.1 - T6.10), in ordinea: T6.1 intai; apoi T6.2, T6.3, T6.7 si T6.9 (independente intre ele); T6.4 dupa T6.2; T6.5 dupa T6.4; T6.6 dupa T6.3; T6.8 dupa T6.7; T6.10 ultima. T14 e impartit la fel (T14.1 - T14.10), in ordinea: T14.1 -> T14.2 -> T14.3 -> T14.4 -> T14.5; apoi T14.6 si T14.7 (independente intre ele); T14.8 dupa T14.4 si T14.7; T14.9 dupa tot codul; T14.10 ultima. Ordinea conteaza: fiecare se sprijina pe cea dinainte. Promptul gata de lipit pentru fiecare este in `../prompts/06-prompt-partea-a-doua.md`.

Inainte de orice sarcina si dupa fiecare: `./build.sh`, `node tools/gen-docs.js`, `tests/toate.sh`, capturi privite cu ochiul, documentatia mutata in capitolul potrivit.

| Nr | Ce se face | Specificatia | Gata cand |
|---|---|---|---|
| T1 | Scrisul de sus nu mai acopera eroii. **Facuta pe 18 noiembrie 2026.** | 24, S6 | `tests/hud-acoperire.js` cu `STRICT=1` scrie 0% pentru toate coloanele, in ambele jocuri, si intra in `tests/toate.sh`. |
| T2 | Butoanele (○ ajuta, □ citit pentru a doua putere, L3) si fuga. **Facuta pe 18 noiembrie 2026.** | 24, S1 si S2 | `tests/control-nou.js` si `tests/fuga.js` trec. Niciun erou nu trece printr-un perete la viteza x 3. |
| T3 | Puterile devin abilitati (rotire, aruncare) pe care le poate avea orice erou. Apoi oasele lui Boon si manusile lui Killer. **Facuta pe 19 noiembrie 2026.** | 24, S3 | `tests/puteri-doi.js` trece. Testele vechi trec neschimbate in primul joc. |
| T4 | Cele 10 secunde si reinceperea nivelului. **Facuta pe 19 noiembrie 2026.** | 24, S4 | `tests/zece-secunde.js` trece. |
| T5 | Capitole, meniul de start, salvarea versiunea 4. **Facuta pe 18 noiembrie 2026**, inaintea T1 - T4 (nu depinde de ele). | 24, S5 | `tests/capitole.js` trece. O salvare veche isi pastreaza progresul. |
| T6.1 | Stilul grafic, partea 1 (**facuta pe 21 noiembrie 2026**): `lit(c, path, col, o)` cu cele cinci straturi (umbra aruncata, umbra de contact, forma cu gradient, lumina de margine, stralucire) si `CONFIG.look`. | 24, S7.1 si S7.7 | Un obiect de proba desenat cu `lit()` are lumina din stanga-sus si umbra in aceeasi directie. Nimic din joc nu se schimba inca. |
| T6.2 | Materialele eroilor (**facuta pe 21 noiembrie 2026**): `scale`, `fabric`, `rubber`, `bone`, ca texturi mici puse in `sprite()` si repetate cu `createPattern`. | 24, S7.2 | Cele patru texturi se vad pe o captura de proba. Niciun `createPattern` in desenul de la fiecare cadru. |
| T6.3 | Materialele lumii (**facuta pe 21 noiembrie 2026**): `wood`, `metal`, `stone`, `crystal`, `leaf`, `lava`. | 24, S7.2 | La fel, pentru cele sase. `lava` pulseaza fara sa iasa din paleta (fara negru, fara gri). |
| T6.4 | Boon, Killer si George repictati (**facuta pe 22 noiembrie 2026**) cu `lit()` si materiale: ochi cu doua luciri, cusaturi la tricou, numarul 10 "cusut". Formele si culorile din desenele copiilor nu se schimba. | 24, S7.3 (prima parte) | Foaia de personaje (`docs/capturi/24-personaje.jpg`) refacuta si pusa langa cea veche. Un copil isi recunoaste desenul. |
| T6.5 | Miscarea eroilor (**facuta pe 22 noiembrie 2026**): coada care intarzie fata de corp (Boon, George), bratele lui Killer la mers, clipit la 3 - 6 s, respiratie cand stau, turtire si intindere la pornire, oprire, lovitura, aterizare si la pornirea fugii. | 24, S7.3 (a doua parte) | Miscarile se vad pe capturi si pe un GIF scurt. `performanta.js` nu creste peste limita din S7.7. |
| T6.6 | Planul din fata (**facuta pe 22 noiembrie 2026**): `L.front`, un canvas pe nivel, paralaxa 1.15, elemente doar in afara dreptunghiului central de 1500 x 760. **Regula care nu se incalca:** nu acopera niciodata un erou (alpha spre 0.15 in 0.2 s). | 24, S7.4 | `tests/stil-grafic.js` (partea de plan din fata) arata ca niciun erou nu e acoperit, in 400 de asezari. Cel mult 12 `drawImage` pe cadru. |
| T6.7 | Harta de lumina (**facuta pe 22 noiembrie 2026**): canvasul `LM` de 480 x 270, ambianta nivelului, cel mult 24 de lumini din sprite-uri, desenata peste lume cu `multiply`. Ia locul vinietei de noapte pe nivelurile noi. | 24, S7.5 (harta) si S7.7 | Cu `CONFIG.look.lights: false` ramane vinieta veche. 1 umplere + cel mult 24 `drawImage` + 1 marit. Niciun `createRadialGradient` pe cadru. |
| T6.8 | Stralucirea lucrurilor care lumineaza (**facuta pe 22 noiembrie 2026**), apa (oglindire, doua randuri de valuri, sclipiri) si praful care pluteste in lumina (40 de puncte, scantei pe vulcan, spori in pestera). | 24, S7.5 (restul) | Se vad pe capturi. `CONFIG.look.motes` le regleaza. |
| T6.9 | Greutatea miscarii (**facuta pe 22 noiembrie 2026**): oprirea scurta (`P.freeze`, 0.06 s), apropierea camerei cu 4%, anticiparea (0.15 s inapoi) si urmarea (`easeBack`, depasire 8%). | 24, S7.6 | Oprirea nu opreste desenul, doar `updatePlay`. Cu `CONFIG.look.freeze: 0` nu se intampla. |
| T6.10 | (**facuta pe 22 noiembrie 2026**) `tests/stil-grafic.js` intreg, bugetul de timp din S7.7, capturile si lista de verificare S7.8, documentatia. | 24, S7.7 si S7.8 | `tests/stil-grafic.js` trece: sub 0.1% pixeli negri sau gri. `performanta.js` cel mult 20% peste valoarea de dinainte, in aceeasi rulare. Raspuns "da" la toate cele 8 intrebari din S7.8. `tests/toate.sh` trece intreg. |
| T7 | Cadrul mecanismelor (benzi, porti, intrari) si nivelul 7. | 25, 3 si 4 | `tests/mecanisme.js` trece pentru nivelul 7, cu regulile G1 - G10. Botul termina nivelul. |
| T8 | Nivelurile 8 si 9 (tinte, benzi rulante, pluta). | 25, 4 | La fel, pentru 8 si 9. |
| T9 | Nivelurile 10 si 11 (cristalul carat prin intuneric, bolovanul). | 25, 4 | La fel, pentru 10 si 11. |
| T10 | Nivelul 12 si atacurile noi ale lui George. | 25, 4 si 5 | `mini-lupte-bot.js`: toate cele 144 de lupte castigate, niciuna peste 180 s. |
| T11 | Sala Tronului, scena "Va urma", finalul nou. | 25, 6 si 7 | `tests/sala-tronului.js` trece. `joc-complet-bot.js` ajunge de la capitolul 1 la finalul nou. |
| T12 | Sunete, muzica, cuvinte noi, decor, capturi, toata documentatia. | 25, 8 - 11 | `tests/toate.sh tot` trece. `numara-elemente.js` da peste 22.000 in al doilea joc. |
| T13 | Limba personajelor: fiecare erou are propria limba, cu cam 1000 de cuvinte generate, fraze, balon cu traducerea si Dictionar. Se face **dupa T12** (cele 13 cuvinte noi din T12 devin exclamatiile limbii) si dupa T1 (regulile pentru scrisul de sus se aplica si balonului). | 26 | `tests/limba.js` trece pentru ambele jocuri. 950 - 1100 de cuvinte pe limba, niciunul la fel cu altul. |
| T14.1 | Cota de oua / cristale, partea 1: cifrele. `CONFIG.quota`, `genLevel` cu `E = ceil(2.2 * cota)`, `levelDurationOf`, verificarea semintelor (`2q <= E <= 2 * cap`). | 27, C3, C6, C7, C8 (1 - 2) | Pentru nivelurile 1 - 12, `E` e in intervalul corect, iar durata urmeaza formula din C3. Nimic din joc nu se schimba inca pentru erou. |
| T14.2 | Luarea ouului cu cota: campul `goal`, `canTake`, `collectEgg` si `hitHero` numara doar ouale `goal`. Ouale peste limita raman pe jos, cu balonul "Plin!"; tropaiul si mingea ocolesc eroul plin. Un erou lovit scapa un ou al lui. | 27, C2 (parte), C3, C8, C9 | Verificarile 3 si 10 din `cota.js` trec (adunate in acelasi test pana la T14.9). |
| T14.3 | Butonul L1: campul `g` / `gP` in `Input`, `KEY_FIELDS`, `RESERVED`, randul nou in pagina de taste, salvarile vechi. | 27, C6 | Testerul din Setari arata L1; o salvare veche ramane cu tastele din `CONFIG`. |
| T14.4 | Dat cu L1: `giveEgg`, ouale in zbor (`P.gifts`, 0.45 s), sunetul `give`, vibratiile, distanta 420, sageata spre prieten cand e departe. | 27, C4, C5 | Verificarile 4 si 5 din `cota.js` trec, cu tastatura si cu controllerul. |
| T14.5 | Sfarsitul nivelului: se termina doar cand fiecare si-a gasit cota, bannerul "mai are nevoie" (`need`), `P.needT`, ouale de pe jos se pot lua in continuare. | 27, C2 (complet) | Verificarea 6 din `cota.js` trece. Exemplul din cerere nu termina nivelul. |
| T14.6 | Ajutorul automat si cazurile speciale: transferul dupa `autoGive`, un singur jucator fara limita, prietenul deconectat, al doilea jucator care intra in mijlocul nivelului. | 27, C9, C12, C13, C14 | Verificarile 9, 11 si 13 din `cota.js` trec. |
| T14.7 | Insigna si sfarsitul de nivel: insigna 300 x 108 cu portret, ou / cristal mic si "gasite / cota", verde / rosu cu contrast verificat, bifa, clatinarea, `iconL1`; ecranul de sfarsit cu cei doi eroi. | 27, C5 (insigna, sfarsitul), C10 | Verificarile 7 si 14 din `cota.js` trec. `hud-acoperire.js` cu `STRICT=1` ramane la 0%. Capturi privite cu ochiul. |
| T14.8 | Mesajele si ghidul: bannerele `quotaDone` si `quotaBoth`, `quota.full`, `quota.far`, `quota.auto`; textele in `STR`, romana si engleza, cu varianta `L:`; sageata `kind: 'give'`; sunetul `give` ramane pe T14.4. | 27, C5 (texte si sageata), C11 | Verificarea 8 din `cota.js` trece, in ambele limbi. |
| T14.9 | `tests/cota.js` cu cele 16 verificari din C10, fiecare verificat ca poate sa pice (strica regula, vezi `NEREUSIT`, apoi pune la loc). | 27, C10 | Toate cele 16 verificari trec si fiecare pica atunci cand regula e stricata. |
| T14.10 | Boti, teste complete, documentatie: `balanseaza()` in `tests/common.js`, `joc-complet-bot.js` si `nivele-bot-mers.js` termina jocul, `tests/toate.sh` intreg, timpul pe nivel in `17-testare.md`, toate capitolele, `27` devine istoric. | 27, C8 (9), C10 (15 - 16) | `tests/toate.sh` trece intreg, cu `errors 0`. Planul marcheaza T14.1 - T14.10 facute. |
| T15.1 | Fara maxim: cota 15 peste tot, scoase `cap`, `extra` si balonul "Plin!". | 28, 1, 2, 9 | `07-play.js`, `08-draw.js`, `01-config.js` |
| T15.2 | Diamante doar din inamicii omorati: scoase diamantele din valuri; copacii ascund melci; `keepEnough()`, `supply`; inamici mici pe harta (cu 50% mai multi). | 28, 2, 7.1 | `06-level.js`, `07-play.js`, `01-config.js` |
| T15.3 | Micul George: 3 inimioare, urmareste, nu loveste, lasa 1 diamant. | 28, 3 | `05-chars.js`, `07-play.js`, `08-draw.js` |
| T15.4 | Luptele pornesc din totalul comun (15 si 30). | 28, 1, 2, 5 | `07-play.js`, `015-lang.js` |
| T15.5 | Lupta din mijloc: oase si mingi, ameteala ca la conuri. | 28, 4.1, 7.2 | `075-duel.js`, `07-play.js`, `08-draw.js` |
| T15.6 | Lupta de la cuib: aruncari dupa inimi, inamici care urmaresc la o inima. | 28, 4.2, 7.2 | `075-duel.js`, `07-play.js`, `08-draw.js`, `015-lang.js` |
| T15.7 | Teste `tests/george.js`, documentatie, `CLAUDE.md`. | 28, 8, 12, 13 | `tests/`, `docs/`, `CLAUDE.md` |

**Verificare la 21 noiembrie 2026 (dupa PR-urile #5 - #14).** `tests/salvare-prieten.js` era rosu pe `main` dupa T4: testul astepta 12 s de la lovitura, dar limita de ajutor e 10 s (`CONFIG.rescue.limit`), deci nivelul reincepea inainte de verificare. Jocul era bine; testul nu fusese actualizat. Testul a fost corectat: asteapta 5 s (inca in limita) si verifica reinceperea dupa `bothDown` (3 s) in loc de "se ridica singuri". Dupa aceea `tests/toate.sh` a trecut cu toate cele 26 de teste.

Dupa **T5** jocul are deja toate regulile cerute, pe nivelurile de acum: butoane, fuga, a doua putere, cele 10 secunde, capitole, scrisul reparat. Este cel mai bun moment sa il incerce copiii si sa primim raspunsurile la intrebarile I1 - I9 de mai sus, inainte de nivelurile noi. T1 - T5 sunt un update intreg si folositor chiar fara nimic dupa el.

### Stare, dependente, model si timp (21 noiembrie 2026)

Starea e cea din `main` la 21 noiembrie 2026 (PR-urile #5 - #12 mergeate). **Modelul si timpul sunt estimari, nu reguli si nu masuratori.** Singurul timp masurat este rularea completa a `tests/toate.sh`, cam 25 de minute (`toate.sh tot`: inca 30). Timpul e pe ceasul de perete si include build, teste, capturi, documentatie si PR. Nu include asteptarea proprietarei pentru merge si nici testarea cu copiii.

| Nr | Stare | Depinde de | Model | Timp estimat |
|---|---|---|---|---|
| T1 | Facuta | - | - | - |
| T2 | Facuta | - | - | - |
| T3 | Facuta | T2 | - | - |
| T4 | Facuta | T2, T5 | - | - |
| T5 | Facuta | - | - | - |
| T6.1 | Facuta | T1 | Opus | 1 - 2 h |
| T6.2 | Facuta | T6.1 | Sonnet | 1 - 1,5 h |
| T6.3 | Facuta | T6.1 | Sonnet | 1 - 2 h |
| T6.4 | Facuta | T6.1, T6.2 | Opus | 1,5 - 3 h |
| T6.5 | Facuta | T6.4 | Sonnet | 1 - 2 h |
| T6.6 | Facuta | T6.1, T6.3 | Opus | 1 - 2 h |
| T6.7 | Facuta | T6.1 | Opus | 1,5 - 2,5 h |
| T6.8 | Facuta | T6.7 | Sonnet | 1 - 2 h |
| T6.9 | Facuta | T6.1 | Sonnet | 1 - 1,5 h |
| T6.10 | Facuta | T6.1 - T6.9 | Sonnet | 1,5 - 3 h |
| T7 | De facut | T6.1 - T6.10 | Opus | 4 - 7 h |
| T8 | De facut | T7 | Sonnet | 2 - 4 h |
| T9 | De facut | T7 (si T8, ca ordine) | Sonnet | 2 - 4 h |
| T10 | De facut | T9 | Sonnet | 2 - 4 h |
| T11 | De facut | T10 | Sonnet | 2 - 3 h |
| T12 | De facut | T11 | Sonnet | 3 - 5 h |
| T13 | De facut | T12, T1 | Sonnet | 2 - 4 h |
| T14.1 | Facut (22 noiembrie 2026) | T1, T2 | Sonnet | 45 - 90 min |
| T14.2 | Facut (22 noiembrie 2026) | T14.1 | Opus | 1 - 2 h |
| T14.3 | Facut (22 noiembrie 2026) | T2 | Haiku | 30 - 60 min |
| T14.4 | Facut (22 noiembrie 2026) | T14.2, T14.3 | Sonnet | 1 - 2 h |
| T14.5 | Facut (22 noiembrie 2026) | T14.2 (ideal si T14.4) | Sonnet | 45 - 90 min |
| T14.6 | Facut (22 noiembrie 2026) | T14.4, T14.5 | Opus | 1,5 - 3 h |
| T14.7 | Facut (22 noiembrie 2026) | T14.2 | Sonnet | 1,5 - 2,5 h |
| T14.8 | Facut (22 noiembrie 2026) | T14.4, T14.7 | Sonnet | 1 - 2 h |
| T14.9 | Facut (22 noiembrie 2026) | T14.1 - T14.8 | Sonnet | 1,5 - 2,5 h |
| T14.10 | Facut (22 noiembrie 2026) | T14.9 | Sonnet | 1,5 - 3 h |
| T15.1 | Facut (22 noiembrie 2026) | T14.9 | Sonnet | 1 - 2 h |
| T15.2 | Facut (22 noiembrie 2026) | T15.1 | Sonnet | 1 - 2 h |
| T15.3 | Facut (22 noiembrie 2026) | T15.2 | Sonnet | 1,5 - 2,5 h |
| T15.4 | Facut (22 noiembrie 2026) | T15.2 | Sonnet | 1,5 - 2,5 h |
| T15.5 | Facut (22 noiembrie 2026) | T15.4 | Sonnet | 1,5 - 2,5 h |
| T15.6 | Facut (22 noiembrie 2026) | T15.5 | Opus | 2 - 3 h |
| T15.7 | Facut (22 noiembrie 2026) | T15.1 - T15.6 | Sonnet | 2 - 3 h |

Totaluri: T6.1 - T6.10 cam 12 - 22 h, T6 - T13 cam 29 - 53 h, T14.1 - T14.10 cam 11 - 21 h, in total cam 40 - 74 h.

Suma celor zece subsarcini ale lui T6 (12 - 22 h) e mai mare decat estimarea de dinainte pentru T6 intreg (4 - 8 h). Doua motive: estimarea de atunci era prea mica pentru tot ce cere S7 (lumina, unsprezece materiale, trei personaje repictate, trei planuri, harta de lumina, apa, praf, greutate, teste si documentatie), iar fiecare subsarcina are build, teste, capturi, documentatie si PR ale ei. Numarul mai mare e cel in care am mai multa incredere.

Ce spune planul explicit despre dependente: T13 vine dupa T12 si T1; T14 vine dupa T1 si T2 si nu depinde de T13; ordinea T14.1 - T14.10 e in tabelul de mai sus. T7 - T12 sunt marcate "ordinea conteaza"; dependentele exacte dintre ele nu sunt scrise una cate una, deci coloana "Depinde de" le deduce din ordine. T14 poate merge in paralel cu T6 - T13, dar nu doua sarcini pe acelasi fisier in acelasi timp.

De ce acest model: **Opus** pentru ce creeaza cadrul pe care stau altele (T6.1, T7), cere judecata vizuala (T6.4: un copil trebuie sa isi recunoasca desenul), tine o regula care nu se incalca (T6.6: planul din fata nu acopera un erou) sau are un buget de timp strans (T6.7) sau atinge toate caile unei reguli si cazuri care pot bloca nivelul (T14.2, T14.6); la T3 un nume ramas nerenumit a scapat testelor mici si l-a prins abia rularea completa. **Sonnet** pentru ce se aseaza pe un cadru sau un tipar gata facut. **Haiku** doar pentru T14.3 (campuri de input dupa un tipar existent); daca rateaza un nume sau un caz, se adauga o runda de reparat.

---

## 6. Regulile din `CLAUDE.md` care se schimba

Se rescriu in `CLAUDE.md` in sarcina in care devin adevarate, nu inainte.

| Regula | Acum | Dupa update | Sarcina |
|---|---|---|---|
| 4 | "Stilul vizual: pictura in acuarela dintr-o carte pentru copii." | Se adauga: "Nivelurile 7 - 12 ale celui de-al doilea joc sunt pictate ca o diorama cu lumina (vezi `docs/24`, S7). Ramane valabil peste tot: fara contururi negre, fara gri, fara negru." | T6 |
| 6 | "Un erou lovit (...) asteapta pe loc pana il ajuta prietenul cu □. (...) daca amandoi sunt loviti se ridica amandoi dupa cateva secunde." | "Jocul nu spune niciodata 'Game Over'. Un erou lovit asteapta pe loc. Prietenul are 10 secunde sa il ajute cu ○. Daca nu, nivelul reincepe de la inceput, cu mesajul 'Încă o dată!'. Un copil care joaca singur se ridica singur." | **T4 facuta** |
| 8 **(rescrisa, 22 noiembrie 2026)** | "✕ pentru putere, □ pentru a ajuta prietenul" | "✕ prima putere, □ a doua putere, ○ ajuta prietenul, L3 (apasarea stick-ului) fuga, L1 da un ou / cristal prietenului, OPTIONS pauza." | **T2 facuta** (fara L1), T14 (L1) |
| 9 | "6 niveluri + lupta finala" | "Primul joc: 6 niveluri si o lupta finala. Al doilea: 12 niveluri si doua lupte mari. Minimum 10.000 de elemente pentru fiecare 6 niveluri." | T11 (cand exista toate nivelurile si a doua lupta mare), T12 (elementele) |
| 10 **(rescrisa, 22 noiembrie 2026; din nou in T15)** | "Nivelul se termina doar cand amandoi jucatorii sunt in cuib." | "Nivelul se termina doar cand amandoi jucatorii sunt in cuib si fiecare si-a gasit cota de oua / cristale (`docs/27`)." | T14 |
| noua, 11 | - | "In nivelurile 7 - 12 fiecare poarta are nevoie de amandoi eroii. Cu un singur jucator, jocul face singur partea celuilalt." | T7 |
| 9 (a doua schimbare) | "minimum 30 de cuvinte pe erou, niciunul la fel cu ale primului joc" | "Fiecare erou are propria limba, cu cel putin 950 de cuvinte generate (`docs/26`). Niciun cuvant nu e la fel cu al altui erou." | T13 |

---

## 7. Ce ramane neschimbat

- Un singur fisier HTML, fara nimic extern, offline in Chrome pe macOS (regulile 1 si 2).
- Toate textele in romana si engleza, in `STR` (regula 3).
- Sunete calde, fara nimic aspru (regula 5). Urletele si exploziile noi se fac ca urletul de acum al lui George: unde triunghi, filtrate.
- Tot ce se poate regla sta in `CONFIG` (regula 7).
- Nivelurile 1 - 6 ale ambelor jocuri: aceleasi harti, aceiasi inamici, aceleasi lupte. Se schimba doar regulile comune de mai sus.
- Dificultatea pe jucator (Ușor, Normal, Greu), mila din lupte, adapostul din cuib, inamicii mici cu doua lovituri.

---

## 8. Riscuri cunoscute

| Risc | Ce facem |
|---|---|
| Fuga x 3 face inamicii usor de ocolit si luptele prea usoare. | Reglaje in `CONFIG.sprint` (`mult`, `inDuel`, `max`). Se vede doar jucand cu copiii. |
| Reinceperea unui nivel de 6 minute supara copilul mic. | H9 (timpul creste dupa 3 reinceperi), `CONFIG.rescue.restart` poate deveni `'wave'`. |
| Portile pot bloca un erou de o parte si pe celalalt de alta. | Regulile de siguranta din capitolul 25, sectiunea 3.6. Testul `mecanisme.js` le verifica pe fiecare. |
| Lumina si planul din fata incetinesc jocul. | Bugetul din 24, S7.6. Harta de lumina e la un sfert din rezolutie. |
| Fisierul creste (acum 458 KB). | Nu e o problema pentru Chrome. Se estimeaza 750 - 850 KB la final, plus cel mult 60 KB pentru limba (T13). |
| 1000 de cuvinte inventate pot suna toate la fel sau pot incurca un copil de 6 ani. | Regulile de deosebire din `26`, L3, si testul 7 din L8. Se judeca doar ascultand cu copiii; `seeds` si `LANG_PHON` se schimba usor. |
| Cota de oua (T14): 60 de oua pe nivel, toate necesare, nu se potrivesc cu cote de 10, 15... si cu limita de 150%. Daca E < 2q nivelul nu se poate termina, daca E > 2 * cap poate ramane blocat. | Numarul de oua pe nivel devine `ceil(2.2 * cota)` (intre 2q si 2 * cap, verificat de test la fiecare nivel). Doar ouale din valuri si copaci intra in cota. Ajutor automat dupa 120 s. Vezi `27`, C2 si C3. |
| Nimic din toate acestea nu poate fi incercat de un asistent pe un controller real. | La fiecare sarcina se spune ce nu a fost verificat, ca in `19-limitari.md`. |

Surse despre "It Takes Two": pagina jocului pe Steam (`store.steampowered.com/app/1426210/It_Takes_Two/`) si interviul echipei Hazelight publicat de Unreal Engine ("It Takes Two lovingly marries story and gameplay together"). Principiile din sectiunea 4 sunt formulate de noi, pe baza jocului.
