# 23. Update urmator: "Cea mai grea luptă", Partea a doua (rundele 7 - 12)

Status: **specificatie, neimplementata.** Nimic din acest capitol nu exista inca in cod.

Cererea proprietarei, cuvant cu cuvant, este in `../prompts/05-cerere-16-noiembrie.md`. Promptul gata de lipit pentru cel care implementeaza este in `../prompts/06-prompt-partea-a-doua.md`.

Specificatia are trei capitole. Citeste-le in ordine. Promptul gata de lipit pentru fiecare dintre cele 12 sarcini este in `../prompts/06-prompt-partea-a-doua.md`.

| Capitol | Ce contine |
|---|---|
| 23 (acesta) | Ce se cere, ce s-a hotarat, ce a ramas de intrebat, principiile luate din "It Takes Two", planul in 12 sarcini, regulile din `CLAUDE.md` care se schimba. |
| [24](24-sisteme-noi.md) | Sistemele noi, comune tuturor nivelurilor: butoane, fuga, a doua putere, cele 10 secunde, capitole si salvare, scrisul de sus, stilul grafic. |
| [25](25-niveluri-7-12.md) | Povestea, mecanismele de colaborare, cele 6 niveluri noi, luptele cu George, lupta finala, texte, sunete, decor. |

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
| I1 | Fuga, cele 10 secunde si butoanele noi sa fie si in "Bubu și Leo"? | Da. | `CONFIG.sprint.games`, `CONFIG.rescue.limitGames` |
| I2 | Bubu si Leo sa primeasca si ei o a doua putere? | Nu. | `CONFIG.heroes[k].power2` |
| I3 | Boon arunca oase. Preferati altceva: oua pestrite, dinti, bulgari de lava? | Oase. | `CONFIG.lupta.heroes[0].throw.look` |
| I4 | Fuga: o apasare (tine pana lasi stick-ul) sau cat tii apasat? | O apasare. | `CONFIG.sprint.mode` |
| I5 | Amandoi loviti: reincepe nivelul sau se ridica singuri ca acum? | Reincepe dupa 3 secunde. | `CONFIG.rescue.bothDownRestart` |
| I6 | Dupa 3 reinceperi pe acelasi nivel, sa creasca timpul la 15 secunde? | Da. | `CONFIG.rescue.retryMercy` |
| I7 | Sa fie repictate si nivelurile 1 - 6 in stilul nou? | Nu, mai tarziu. | - |
| I8 | Reinceperea e "de la inceput". Sa existe varianta "de la ultimul val de cristale"? | Nu: de la inceput, cum e cerut. | `CONFIG.rescue.restart` |
| I9 | Copiii vor sa aleaga ei numele nivelurilor, ce fura George si cum arata lupta finala? | Se folosesc cele din capitolul 25. | texte in `STR` |

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

## 5. Planul: 12 sarcini

Fiecare sarcina se poate termina, testa si trimite separat. Ordinea conteaza: fiecare se sprijina pe cea dinainte. Promptul gata de lipit pentru fiecare este in `../prompts/06-prompt-partea-a-doua.md`.

Inainte de orice sarcina si dupa fiecare: `./build.sh`, `node tools/gen-docs.js`, `tests/toate.sh`, capturi privite cu ochiul, documentatia mutata in capitolul potrivit.

| Nr | Ce se face | Specificatia | Gata cand |
|---|---|---|---|
| T1 | Scrisul de sus nu mai acopera eroii. | 24, S6 | `tests/hud-acoperire.js` cu `STRICT=1` scrie 0% pentru toate coloanele, in ambele jocuri, si intra in `tests/toate.sh`. |
| T2 | Butoanele (○ ajuta, □ citit pentru a doua putere, L3) si fuga. | 24, S1 si S2 | `tests/control-nou.js` si `tests/fuga.js` trec. Niciun erou nu trece printr-un perete la viteza x 3. |
| T3 | Puterile devin abilitati (rotire, aruncare) pe care le poate avea orice erou. Apoi oasele lui Boon si manusile lui Killer. | 24, S3 | `tests/puteri-doi.js` trece. Testele vechi trec neschimbate in primul joc. |
| T4 | Cele 10 secunde si reinceperea nivelului. | 24, S4 | `tests/zece-secunde.js` trece. |
| T5 | Capitole, meniul de start, salvarea versiunea 4. | 24, S5 | `tests/capitole.js` trece. O salvare veche isi pastreaza progresul. |
| T6 | Stilul grafic: lumina, materiale, umbre, planul din fata, eroii repictati. | 24, S7 | Lista de verificare S7.8 bifata pe capturi. `tests/stil-grafic.js` trece. `performanta.js` cel mult 20% peste valoarea de dinainte. |
| T7 | Cadrul mecanismelor (benzi, porti, intrari) si nivelul 7. | 25, 3 si 4 | `tests/mecanisme.js` trece pentru nivelul 7, cu regulile G1 - G10. Botul termina nivelul. |
| T8 | Nivelurile 8 si 9 (tinte, benzi rulante, pluta). | 25, 4 | La fel, pentru 8 si 9. |
| T9 | Nivelurile 10 si 11 (cristalul carat prin intuneric, bolovanul). | 25, 4 | La fel, pentru 10 si 11. |
| T10 | Nivelul 12 si atacurile noi ale lui George. | 25, 4 si 5 | `mini-lupte-bot.js`: toate cele 144 de lupte castigate, niciuna peste 180 s. |
| T11 | Sala Tronului, scena "Va urma", finalul nou. | 25, 6 si 7 | `tests/sala-tronului.js` trece. `joc-complet-bot.js` ajunge de la capitolul 1 la finalul nou. |
| T12 | Sunete, muzica, cuvinte noi, decor, capturi, toata documentatia. | 25, 8 - 11 | `tests/toate.sh tot` trece. `numara-elemente.js` da peste 22.000 in al doilea joc. |

Dupa **T5** jocul are deja toate regulile cerute, pe nivelurile de acum: butoane, fuga, a doua putere, cele 10 secunde, capitole, scrisul reparat. Este cel mai bun moment sa il incerce copiii si sa primim raspunsurile la intrebarile I1 - I9 de mai sus, inainte de nivelurile noi. T1 - T5 sunt un update intreg si folositor chiar fara nimic dupa el.

## 6. Regulile din `CLAUDE.md` care se schimba

Se rescriu in `CLAUDE.md` in sarcina in care devin adevarate, nu inainte.

| Regula | Acum | Dupa update | Sarcina |
|---|---|---|---|
| 4 | "Stilul vizual: pictura in acuarela dintr-o carte pentru copii." | Se adauga: "Nivelurile 7 - 12 ale celui de-al doilea joc sunt pictate ca o diorama cu lumina (vezi `docs/24`, S7). Ramane valabil peste tot: fara contururi negre, fara gri, fara negru." | T6 |
| 6 | "Un erou lovit (...) asteapta pe loc pana il ajuta prietenul cu □. (...) daca amandoi sunt loviti se ridica amandoi dupa cateva secunde." | "Jocul nu spune niciodata 'Game Over'. Un erou lovit asteapta pe loc. Prietenul are 10 secunde sa il ajute cu ○. Daca nu, nivelul reincepe de la inceput, cu mesajul 'Încă o dată!'. Un copil care joaca singur se ridica singur." | T4 |
| 8 | "✕ pentru putere, □ pentru a ajuta prietenul" | "✕ prima putere, □ a doua putere, ○ ajuta prietenul, L3 (apasarea stick-ului) fuga, OPTIONS pauza." | T2 |
| 9 | "6 niveluri + lupta finala" | "Primul joc: 6 niveluri si o lupta finala. Al doilea: 12 niveluri si doua lupte mari. Minimum 10.000 de elemente pentru fiecare 6 niveluri." | T5 (numarul de capitole), T12 (elementele) |
| 10 | "Nivelul se termina doar cand amandoi jucatorii sunt in cuib." | Neschimbata. | - |
| noua, 11 | - | "In nivelurile 7 - 12 fiecare poarta are nevoie de amandoi eroii. Cu un singur jucator, jocul face singur partea celuilalt." | T7 |

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
| Fisierul creste (acum 440 KB). | Nu e o problema pentru Chrome. Se estimeaza 750 - 850 KB la final. |
| Nimic din toate acestea nu poate fi incercat de un asistent pe un controller real. | La fiecare sarcina se spune ce nu a fost verificat, ca in `19-limitari.md`. |

Surse despre "It Takes Two": pagina jocului pe Steam (`store.steampowered.com/app/1426210/It_Takes_Two/`) si interviul echipei Hazelight publicat de Unreal Engine ("It Takes Two lovingly marries story and gameplay together"). Principiile din sectiunea 4 sunt formulate de noi, pe baza jocului.
