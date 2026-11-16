# 12. Desen si HUD (`src/08-draw.js`)

Fisierul pune lumea pe ecran in fiecare cadru si deseneaza tot ce ajuta jucatorii sa stie ce au de facut.

## `drawWorld(c)`

1. Calculeaza coltul camerei (`l`, `tp`). Adauga tremurul (`P.shake`) daca e cazul.
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
- Numele, primele 5 secunde din nivel.

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

`drawProgress` deseneaza, sub contorul de oua:

- Stanga: ce e de facut acum. Un ou cu "× 12" (oua ramase), o inima cu "× 3" (inimi ramase) sau cuibul cu o sageata.
- Mijloc: un drum. Partea facuta e aurie. Pe drum, un semn la capatul fiecarei parti: cerc cu ou pentru valuri, cerc cu inima pentru lupta, cuibul la capat. Semnele facute se umplu cu auriu, cel curent pulseaza.
- Pe drum: un punct jumatate portocaliu, jumatate galben (cei doi eroi), unde e echipa acum. Se misca lin (12% din distanta pe cadru).
- Dreapta: procentul.

De ce un drum si nu doar un procent: cel de 6 ani nu citeste procente, dar vede punctul care se apropie de cuib.

Nu apare la boss. Acolo HUD-ul arata cele trei mingi (golurile).

## HUD: `drawHUD(c)` si `drawBadge(c, k, x, y)`

- **Insignele** din colturi: portretul eroului (pictat o data), numele, dificultatea. Daca eroul nu e jucat, scrie ce trebuie apasat ("Apasă ✕" sau tasta). Un fluture mic cand are viteza.
- **Cardul din mijloc**: oul cu numarul de oua al echipei (oul pulseaza la o serie), cele trei stele ale nivelului (pline cand sunt luate) si soarele care coboara spre deal in `levelDuration`. La boss: cercuri care se umplu cu mingi la fiecare gol.
- **Bara de progres** (de mai sus).
- La boss, cercurile pentru goluri sunt cate `CONFIG.boss.hits` (5). Cand sunt mai mult de 3, sunt mai mici si cardul e mai lat, ca sa nu intre peste numarul de oua. Ouale din cuibul lui Ciori scad cu fiecare gol (`9 * (1 - faza / hits)`).
- **Bannerele**: "Mai departe!" (val nou, cu sageata), "La cuib!" (cu cuib si sageata), "Oul uriaș!" (cu ou), "Provocare!" (cu numele paznicului: "Regele Gândac păzește cuibul!" la lupta de la cuib, "Regele Gândac vă stă în cale!" la lupta din mijloc). Apar si dispar lin.

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
| "Îl așteptăm pe Leo în cuib!" deasupra cuibului | `drawWorld` | cuibul e deschis si doar un erou e in el |

In al doilea joc, in plus:

- Lumina calda in jurul fiecarui erou (`drawHeroFull`, cand `P.L.night`): un gradient rotund, desenat sub erou. Fara ea eroii se pierdeau in decorul colorat de noapte.
- Totemurile au o morisca in culorile curcubeului (`drawPinwheel`) in locul palelor de moara.
- La boss, sageata si indiciul (minge + sageata in jos) arata spre George cazut (`bossGoal()`), nu spre varful tronului.
- HUD-ul arata cristalul in locul oului si culorile curcubeului adunate (sapte puncte). Vezi `21-cea-mai-grea-lupta.md`.
