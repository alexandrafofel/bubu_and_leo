# Cuprins

Documentatia completa a jocului "Bubu și Leo: Ouăle de Aur". Este scrisa ca oricine (om sau orice cont Claude) sa poata intelege si modifica jocul fara sa fi vazut conversatiile in care a fost facut.

## Cum citesti

Daca vrei doar sa schimbi ceva repede, citeste `18-ghid-modificari.md`. Are retete pas cu pas.

Daca vrei sa intelegi tot, citeste in ordine. Fiecare capitol descrie un fisier din `src/`, functie cu functie, cu valorile folosite si motivul fiecarei alegeri.

Anexele din `anexe/` sunt liste generate din cod. Ele sunt mereu exacte, pentru ca se refac cu `node tools/gen-docs.js`. Capitolele explica, anexele numara si localizeaza.

## Capitole

| Nr | Capitol | Despre |
|---|---|---|
| 01 | [Prezentare](01-prezentare.md) | Ideea, jucatorii, nivelurile, regulile mari |
| 02 | [Arhitectura](02-arhitectura.md) | Cum e construit fisierul, ordinea codului, starile, coordonatele |
| 03 | [CONFIG](03-config.md) | Fiecare valoare de reglaj, ce face si de ce are valoarea asta |
| 04 | [Limba si setari](04-limba-si-setari.md) | `Opt`, `STR`, `T()`, cum adaugi un text |
| 05 | [Pictura](05-pictura.md) | `src/02-core.js`: acuarela, hartie, cer, text, carduri |
| 06 | [Sunet](06-sunet.md) | `src/03-audio.js`: instrumente, muzica, efecte, voce, difuzorul controllerului |
| 07 | [Control](07-control.md) | `src/04-input.js`: controllere, tastatura, meniuri, vibratii |
| 08 | [Personaje](08-personaje.md) | `src/05-chars.js`: Bubu, Leo, Ciori, gandaci, ouale, iconitele |
| 09 | [Niveluri](09-niveluri.md) | `src/06-level.js`: definitii, generator, verificarea drumului, pictura fundalului |
| 10 | [Gameplay](10-gameplay.md) | `src/07-play.js`: eroi, puteri, oua, inamici, vant, fluture, boss |
| 11 | [Mini-lupte](11-mini-lupte.md) | `src/075-duel.js`: cei sase paznici si cum se lupta |
| 12 | [Desen si HUD](12-desen-si-hud.md) | `src/08-draw.js`: lumea pe ecran, sageata ajutatoare, bara de progres |
| 13 | [Ecrane si meniuri](13-ecrane-si-meniuri.md) | `src/09-screens.js`: start, poveste, final de nivel, pauza, Setari, festival, salvare |
| 14 | [Bucla principala](14-bucla-principala.md) | `src/10-main.js`: starile jocului, cadrul, mouse-ul, ecranul complet |
| 15 | [Culori](15-culori.md) | Paleta, fiecare culoare importanta si de ce |
| 16 | [Decizii](16-decizii.md) | Fiecare decizie de design si motivul ei |
| 17 | [Testare](17-testare.md) | Testele automate, ce verifica, rezultatele |
| 18 | [Ghid de modificari](18-ghid-modificari.md) | Retete: cum schimbi X |
| 19 | [Limitari](19-limitari.md) | Ce nu a putut fi verificat si ce stii ca lipseste |
| 20 | [Update urmator](20-update-urmator.md) | Specificatia completa pentru versiunea urmatoare |

## Anexe generate

| Anexa | Contine |
|---|---|
| [A. Functii](anexe/A-functii.md) | Fiecare functie, cu fisier, linie si comentariu |
| [B. Culori](anexe/B-culori.md) | Fiecare culoare din cod si toate locurile unde apare |
| [C. Texte](anexe/C-texte.md) | Fiecare text, in romana si in engleza |
| [D. CONFIG](anexe/D-config.md) | Fiecare valoare din CONFIG, asa cum e acum |
| [E. Sunete](anexe/E-sunete.md) | Fiecare efect sonor |
| [F. Harta codului](anexe/F-harta-cod.md) | Fiecare fisier impartit in sectiuni, cu liniile |
| [G. Numere](anexe/G-numere.md) | Cate linii, functii, culori, texte, sunete |

## Capturi de ecran

In `capturi/` sunt 13 capturi din versiunea de acum, facute de testele automate. Foloseste-le ca sa vezi cum arata ce descriu capitolele:

| Captura | Ce arata |
|---|---|
| [01-start](capturi/01-start.jpg) | Ecranul de start, un controller conectat |
| [02-joc-sageata-progres](capturi/02-joc-sageata-progres.jpg) | Nivelul 1: HUD, bara de progres, sageata ajutatoare a lui Bubu |
| [03-lupta-pregatire](capturi/03-lupta-pregatire.jpg) | Mini-lupta: paznicul tinteste, zona rosie pe jos |
| [04-lupta-acum](capturi/04-lupta-acum.jpg) | Mini-lupta: paznicul obosit, "Acum!" |
| [05-paznici-ataca](capturi/05-paznici-ataca.jpg) | Ceilalti cinci paznici in atac |
| [06-cuib-deschis](capturi/06-cuib-deschis.jpg) | Cuibul deschis dupa lupta |
| [07-final-nivel-medalii](capturi/07-final-nivel-medalii.jpg) | Finalul nivelului cu stele si medalii |
| [08-setari](capturi/08-setari.jpg) | Setari, pagina principala |
| [09-setari-jucator](capturi/09-setari-jucator.jpg) | Setari, pagina unui jucator |
| [10-setari-controller](capturi/10-setari-controller.jpg) | Pasii de conectare a controllerului si proba butoanelor |
| [11-setari-taste](capturi/11-setari-taste.jpg) | Alegerea tastelor |
| [12-pauza](capturi/12-pauza.jpg) | Pauza in timpul unui nivel |
| [13-poveste-engleza](capturi/13-poveste-engleza.jpg) | Povestea unui nivel, in engleza |

## Prompturi

In `../prompts/` sunt cererile originale cuvant cu cuvant si promptul pentru urmatorul update.
