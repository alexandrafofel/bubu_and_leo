# 19. Limitari

> **Din 18 noiembrie 2026 exista un singur joc: "Cea mai grea luptă".** "Bubu și Leo" a fost scos (vezi `16-decizii.md`, "Un singur joc"). Orice schimbare se face doar in "Cea mai grea luptă". Ce scrie mai jos despre primul joc, despre alegerea jocului sau despre "ambele jocuri" este istoric.

Ce nu a putut fi verificat si ce se stie ca lipseste. Cine preia jocul porneste de aici cand ceva nu se poarta cum e descris.

## Nu a fost verificat pe hardware real

Tot jocul a fost facut si testat intr-un mediu Linux, cu Chrome fara fereastra. Nu a existat niciun Mac si niciun controller real.

| Ce | Ce s-a verificat | Ce ramane de verificat |
|---|---|---|
| Doua DualShock 4 pe macOS | Controllere false prin `navigator.getGamepads`, cu aceeasi asezare a butoanelor (`standard`). | Ca Chrome pe Mac raporteaza ambele controllere ca `standard`, cu ✕ pe butonul 0 si OPTIONS pe 9. |
| Vibratia | Ca jocul cere vibratia (`vibrationActuator.playEffect`) la momentele potrivite. | Ca DualShock 4 chiar vibreaza in Chrome pe Mac. Daca nu, pagina controllerului spune "Acest controller nu poate vibra în Chrome." |
| Sunetul in difuzorul controllerului | Cu doua iesiri audio false: ca fiecare efect si fiecare cuvant ajunge in iesirea aleasa si nu in boxe (`sunete-controller.js`). | Daca Mac-ul vede DualShock 4 ca difuzor. Surse publice spun ca merge doar prin cablu USB, nu prin Bluetooth. |
| Vocea care citeste povestea | Ca jocul alege o voce `ro-RO` sau `en-*` daca exista. In mediul de test nu exista, deci apare "Fără voce în română". | Ca vocea Ioana (romana) exista pe Mac si se aude. Se adauga din Setari sistem, Accesibilitate, Continut vorbit. |
| Cum suna | Ca fiecare sunet porneste si varful nu depaseste 0.7. | Ca sunetele sunt placute, nu prea tari, nu prea incete. Nimeni nu le-a ascultat. |
| Viteza pe Mac | Fara placa video, pe aceeasi masina: 23.1 ms pe cadru dupa update, 21.6 ms inainte. Update-ul costa aproximativ 1.5 ms. | Pe Mac ar trebui sa fie mult sub 16.7 ms. Daca sacadeaza: `maxRenderWidth` 1600 sau 1280, apoi `decorPerLevel` mai mic. |
| Timpul de joc | Botii termina un nivel in 1 pana la 2 minute. | Cat dureaza pentru copii. Tinta este 6 minute pe nivel si aproximativ 45 de minute in total. |
| Textele in romana | Scrise de Claude, verificate pentru diacritice. | Citite de un vorbitor nativ, mai ales povestile nivelurilor si textele pentru copii. |

## Ce stii ca lipseste sau e imperfect

- Testele boss-ului si festivalului folosesc uneori scurtaturi (pozitii puse direct, stari fortate). Drumul complet a fost jucat de bot, dar nu in toate variantele (de exemplu un singur jucator pe Greu la boss).
- Ecranul complet nu poate fi pornit cu un buton de controller. Chrome cere o tasta sau un clic. Este o regula a browserului, nu se poate ocoli.
- Sunetul nu porneste pana la primul clic sau prima tasta. Tot o regula a browserului.
- Daca un controller se deconecteaza in timpul jocului, jocul se pune pe pauza si asteapta. Daca alt controller apasa ✕, il ia in locul celui pierdut.
- Salvarea este in browserul de pe acel Mac (`localStorage`). Alt browser sau alt calculator nu o vede. Stergerea datelor din Chrome o sterge.
- "Ecran complet: Da" in Setari arata starea reala a ecranului. Daca utilizatorul iese cu Esc, setarea devine "Nu".
- Documentatia descrie fiecare fisier, functie, valoare de reglaj, culoare, text, sunet si decizie. Nu are cate un rand de explicatie pentru fiecare linie de cod. Codul are comentarii la fiecare bloc si fiecare valoare neobisnuita.

## Update-ul din 13 noiembrie 2026: ce nu e verificat sau nu e facut

- Limba personajelor (60 de cuvinte) nu a fost ascultata de nimeni. Testul verifica doar ca fiecare cuvant porneste, ca sunt diferite si ca nu sunt prea tari.
- Lupta de la cuib e grea pentru boti pe ultimele niveluri: pe nivelul 6 dureaza in medie 104 s si eroii sunt loviti de 14 ori (lupta din mijloc: 48 s, 6 lovituri). Nu se stie cum e pentru copii. Reglaj: `duel.finalHp`, `finalSpeed`, `finalExtra`.
- Daca toti jucatorii stau in cuib in timpul unei lupte, paznicul asteapta si lupta nu inainteaza. E intentionat (altfel s-ar castiga stand ascuns), dar un copil singur poate sa nu inteleaga. Nu exista un indiciu pe ecran pentru asta.
- Ciori arunca 1 con in prima runda, 2 in rundele 2 si 3, 3 in ultimele doua. Cererea spunea "doua conuri deodata in ultimele 2 runde". Versiunea veche arunca deja 3 in ultima runda. De confirmat.
- Din specificatie nu s-au facut: optiunea "Personajele vorbesc" in Setari (exista doar `CONFIG.babble`); decor diferit pe fiecare nivel (broscute, spice, lampioane mici, scaieti, gaze); coroana si culoarea mai calda pentru paznicul de la cuib (e doar mai mare si scutura putin ecranul cand e suparat); conurile care ricoseaza din marginea cuibului (trec pe langa erou fara efect).
- Aproximativ o cincime din decor reactioneaza (iarba, trifoi, margarete, stuf, papadii, frunze, melci, buburuze). Restul (ciuperci, pietricele, tufisuri, betisoare, muschi) e pictat in fundal.
- Tinta de 14 ms pe cadru fara placa video nu e atinsa. Nu era atinsa nici inainte pe masina de test de acum (21.6 ms).
- `voc()` din `03-audio.js` foloseste o unda `sawtooth` trecuta printr-un filtru, pentru sunetele paznicilor. Exista dinainte de update. Regula 5 din `CLAUDE.md` cere sinus si triunghi. De ascultat si, daca e aspru, de schimbat in `triangle`.
- Captura `05-paznici-ataca.jpg` e din versiunea dinainte de decor.

## Cereri ambigue, asteptand confirmare

Vezi sectiunea "Intrebari deschise" din `20-update-urmator.md`.

## Bug cunoscut, nereparat: scrisul de sus acopera eroii

Semnalat de proprietara pe 16 noiembrie 2026. Masurat cu `tests/hud-acoperire.js`: bannerul de la inceputul unei lupte acopera un erou in jumatate din locuri, iar HUD-ul il acopera pe cel de sus in peste o treime din asezari cand eroii sunt departe unul de altul. Repararea e specificata in `24-sisteme-noi.md`, S6, si e prima etapa (E1) a update-ului urmator.

## Update-ul din 14 noiembrie 2026: ce nu e verificat sau nu e facut

- **Difuzorul unui DualShock 4 real.** Bug-ul "nu se aud sunetele personajelor" a fost gasit prin masuratoare: vocile erau de 10 pana la 15 ori mai incete decat efectele. Acum se aud tare in boxele calculatorului. Ca se aud si in difuzorul controllerului nu a putut fi verificat fara un controller. Conditia ramane cablul USB. Prin Bluetooth, macOS nu arata controllerul ca difuzor si browserul nu are alta cale.
- **Cum suna vocile noi.** Sunt mai tari si mai pline (cele mai tari cuvinte sunt acum cam cat tropaitul). Un limitator la iesire impiedica sunetul sa se rupa. Nimeni nu le-a ascultat. Daca sunt prea tari fata de muzica: "Sunete personaje" din Setari, sau castigul din `VOICES` in `03-audio.js`.
- **Cat de grea e regula ajutorului pentru copii.** Botii ajuta in 1 pana la 3 secunde. Un copil de 6 ani poate avea nevoie de mult mai mult ca sa ajunga la fratele lui, iar cel lovit sta in acest timp. Reglaje: `rescue.autoAfter`, `reachNear`, `reachFar`.
- **Durata celui de-al doilea joc.** Botul termina un nivel in 1 pana la 3 minute. Tinta de 45 de minute e reglata la fel ca in primul joc (`levelDuration` 360), nu masurata cu copii.
- **George cel Rău, cat de greu e.** Luptele sunt castigate de boti in toate cele 72 de situatii, in 11 pana la 114 secunde. "Mai greu de învins" e adevarat fata de paznicii primului joc (mai multe inimi, trucuri noi). Daca e prea greu sau prea usor pentru copii se vede doar jucand.
- **Desenele.** Boon, Killer si George sunt pictati dupa fotografiile desenelor, in stilul acuarela al jocului. Copiii pot vrea alte detalii. Pictorii sunt in `055-lupta.js`.
- **Butonul □ pe un controller real.** E butonul 2 in asezarea `standard`. Verificat doar cu controllere false.
- **Capturile 01 pana la 15** din `docs/capturi/` sunt dinainte de acest update.
- **Nu s-au facut**, din update-ul trecut: optiunea "Personajele vorbesc" in Setari, decor diferit pe fiecare nivel al primului joc.
- **`mini-lupte-bot.js`**: cand botul care ajuta ramane blocat intr-un obstacol mai mult de 6 secunde, testul il muta langa prieten. E o limita a botului (merge in linie dreapta), nu a jocului.

## Update 18 noiembrie 2026 (capitole): ce nu e verificat

- **Cum inteleg copiii ecranul Capitole.** Botii si testele merg pe el cu tastatura, cu controllere false si cu mouse-ul. Nu stim daca un copil de 6 ani intelege lacatul, stelele goale sau diferenta dintre "Continuă" si "Capitole".
- **Salvarea reala a copiilor.** Trecerea de la versiunea 3 e testata pe salvari scrise de test, nu pe salvarea de pe Mac-ul familiei. Totalul nu scade niciodata; de obicei creste putin (vezi `13-ecrane-si-meniuri.md`, "Trecerea de la versiunea 3").

## Update 18 noiembrie 2026 (banda de sus): ce nu e verificat

- **Eroii la cele doua capete ale unei harti inalte.** Cand distanta pe verticala dintre eroi trece de ~1390 de unitati si zoom-ul e deja la minim (0.6), banda si "amandoi eroii intregi pe ecran" nu mai incap deodata. Castiga banda: eroului de jos i se taie picioarele, cel mult 54 de pixeli. Masurat cu o socoteala facuta o data, ca in `hud-acoperire.js`: se intampla in 0 pana la 1.5% din perechile de celule alese la intamplare, si deloc cand eroii sunt impreuna. Daca deranjeaza, se poate cobori `minZoom` (`06-level.js`) si umple si marginile laterale cu culoarea de la marginea picturii.
- **Cum arata banda pe un ecran real.** Capturile sunt facute la 1920 x 1080. Scrisul e mai mic decat inainte (numele eroului 36 in loc de 44, dificultatea 22 in loc de 28, numarul de oua 52 in loc de 72). Pe televizorul sau laptopul familiei poate fi prea mic pentru cel de 6 ani. Se regleaza din `drawBadge` si `drawMidCard`.
- **Fasia de cer de deasupra lumii.** Se umple cu culoarea primului pixel al picturii. La nivelurile de noapte si la cel cu faleza culoarea e potrivita in capturi, dar nimeni nu a jucat asa, in miscare, pe un ecran mare.

## T2 (18 noiembrie 2026): ce nu s-a putut verifica

- **Cum se simte L3 pe un controller adevarat.** Apasarea stick-ului cere putina forta; un copil de 6 ani ar putea sa o apese din greseala cand impinge stick-ul tare, sau sa nu o gaseasca deloc. Daca se intampla des, `CONFIG.sprint.mode` poate deveni `'hold'`, sau fuga se poate muta pe alt buton.
- **Daca x 3 e prea repede** pentru hartile de acum (3200 x 1800). Se regleaza din `CONFIG.sprint.mult` si `maxSpeed`.
- **Daca fuga strica mini-luptele** (eroii se invart prea usor in jurul paznicului). `CONFIG.sprint.inDuel = false` o opreste acolo.
- **Cum suna `dash` si cuvantul "fug!"** pe boxele familiei si in difuzorul controllerului.
- **Daca urma si liniile de viteza se vad destul** pe jungla de noapte, care e deja plina de culori. Pe capturi se vad, dar nu e acelasi lucru cu un televizor.
- **Daca un copil intelege din iconita L3** ca trebuie sa apese stick-ul, nu sa-l impinga.
- **Daca ○ in loc de □ ii incurca** pe copiii care au jucat deja cu □ pentru ajutor.

## T3 (19 noiembrie 2026): ce nu s-a putut verifica

- **Daca jocul devine prea usor** acum, cand fiecare erou are si scut, si aruncare. Mai ales mini-luptele si lupta cu George. Se regleaza din pauzele celor doua puteri (`cooldown`).
- **Daca cei doi copii isi dau seama singuri** ce face □, dupa indiciul de pe nivelul 1.
- **Daca oasele se vad destul** peste jungla de noapte (arcul turcoaz ajuta, dar ecranul e plin de culori).
- **Cum se simt cele trei batai de vibratie** pe un controller adevarat, fata de vibratia continua a ghearelor.
- **Daca manusile intinse acopera prea mult** din ce e in jurul lui Killer.
- Cum suna `bone`, `tock` si `gloves` pe boxele familiei.

## T4 (19 noiembrie 2026): ce nu s-a putut verifica

- **Daca 10 secunde sunt destule** pentru cei doi copii pe hartile de acum (3200 x 1800). Cu fuga (L3) drumul e de trei ori mai scurt, dar nu stim daca cel mic o foloseste cand e graba. Daca nu ajung, se creste `CONFIG.rescue.limit`.
- **Daca pierderea progresului supara.** La reincepere se pierd cristalele si stelele nivelului. Rezultatele nivelurilor dinainte raman.
- **Daca reincepe prea des in luptele mari**, unde eroii sunt loviti mai usor.
- **Daca ecranul "Încă o dată!" e inteles** ca "mai incercam", nu ca o pedeapsa.
- Cum se simt vibratiile de fiecare secunda pe un controller adevarat, mai ales cele dese din ultimele 3 secunde: pot deveni suparatoare.
- Daca lumina de pe margini se vede destul pe televizorul familiei, peste jungla de noapte.

## T6.1 (21 noiembrie 2026): ce nu s-a putut verifica

- **Cum arata `lit()` pe personaje adevarate.** A fost verificat pe trei forme rotunde de proba. Boon, Killer si George au forme compuse din multe bucati; abia la T6.4 se vede daca lumina sta bine pe ele.
- **Daca gradientul liniar e destul de ieftin** cand sunt zeci de obiecte pe ecran. `lit()` face un `createLinearGradient` la fiecare chemare. Masurat abia cand sunt pictori adevarati care il folosesc (T6.4 incolo); daca nu e, gradientele pot fi tinute intr-un sprite.
- **Daca umbra aruncata (mutata cu `0.35 x inaltime`) e prea lunga** pentru obiectele inalte si subtiri. Pe cele rotunde de proba arata bine.
- **Daca banda de lumina de margine (5 pixeli, taiata la jumatate)** se vede pe obiectele mici. Pe cele de proba, de 200 - 300 de unitati, da.
- Cum se vad toate astea pe televizorul familiei, peste jungla de noapte.

## T6.2 (21 noiembrie 2026): ce nu s-a putut verifica

- **Cum arata materialele pe eroi adevarati.** S-au vazut pe forme rotunde de 200 de unitati. Un os de Boon are 30 - 60, iar la acea marime porii (0.8 - 1.9 unitati) si cusaturile (1.5) pot iesi sub un pixel.
- **Cusaturile pe forme alungite.** Sunt conturul micsorat in jurul mijlocului, deci la o forma foarte lunga si subtire (o coada, o curea) nu sunt la 4 unitati de margine peste tot. Pe forme rotunde da.
- **Daca modelul ramane drept cand eroul se roteste.** Un pictor care roteste (`c.rotate`) roteste si textura. Nu e un defect, dar nu s-a vazut pe un erou.
- **Cat costa `fillRect` cu model** cand sunt zeci de obiecte pe ecran. Masurat abia cand pictori adevarati folosesc materialele (T6.4 incolo).
- **Tesatura de la `fabric`** (alpha 0.08, cum cere S7.2) se vede foarte slab: din ea se vad mai ales cusaturile. Daca nu e destul, se creste alpha-ul.
- Cum se vad toate pe televizorul familiei, peste jungla de noapte.

## T6.3 (21 noiembrie 2026): ce nu s-a putut verifica

- **Cum arata pe obiectele adevarate** (poduri, usi, robotii, vulcanul). S-au vazut pe forme rotunde de 200 de unitati. Nodurile si niturile sunt pe un cadru fix al cutiei: pe o scandura foarte lunga si subtire pot cadea prea aproape de margine.
- **Luminarea din jurul lavei** (spec: "lumineaza") nu exista inca: `lit()` taie la contur. Se rezolva cu un strat in afara formei, in pictorul vulcanului (T6.4).
- **`leaf`, nervurile** merg pe verticala (varful in sus). O frunza intinsa pe orizontala (nufar) cere un parametru de directie, neadaugat.
- **Piatra:** muschiul are aceeasi culoare peste orice piatra. Pe o piatra verzuie se pierde.
- **Costul** a zeci de obiecte cu material pe ecran, la fel ca la T6.2: masurat cand pictorii le folosesc.
