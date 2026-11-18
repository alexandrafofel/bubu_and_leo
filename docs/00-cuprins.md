# Cuprins

Documentatia completa a celor doua jocuri din acelasi fisier: "Bubu și Leo: Ouăle de Aur" si "Cea mai grea luptă" (inventat de copii, vezi capitolul 21). Este scrisa ca oricine (om sau orice cont Claude) sa poata intelege si modifica jocul fara sa fi vazut conversatiile in care a fost facut.

## Cum citesti

Daca vrei doar sa schimbi ceva repede, citeste `18-ghid-modificari.md`. Are retete pas cu pas.

Daca vrei sa intelegi tot, citeste in ordine. Fiecare capitol descrie un fisier din `src/`, functie cu functie, cu valorile folosite si motivul fiecarei alegeri.

Capitolele 01 pana la 20 au fost scrise pentru primul joc. Regulile schimbate pe 14 noiembrie 2026 (doua jocuri, ajutorul cu □, inamicii mici, cuibul) sunt trecute in fiecare capitol, intr-o sectiune "Update 14 noiembrie 2026" la sfarsit. Capitolul 22 le are pe toate la un loc. Capitolul 21 descrie al doilea joc.

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
| 20 | [Update 13 noiembrie](20-update-urmator.md) | Specificatia update-ului din 13 noiembrie 2026 (facut) |
| 21 | [Cea mai grea luptă](21-cea-mai-grea-lupta.md) | Al doilea joc: Boon, Killer, George cel Rău, jungla de noapte |
| 22 | [Update 14 noiembrie](22-update-14-noiembrie.md) | Doua jocuri, ajutorul cu □, inamicii mici, cuibul, sunetele reparate |
| 23 | [Update urmator: Partea a doua](23-update-partea-a-doua.md) | **Specificatie, neimplementata.** Rundele 7 - 12 din "Cea mai grea luptă": cerere, hotarari, intrebari, principii, planul in 14 sarcini |
| 24 | [Sisteme noi](24-sisteme-noi.md) | **Specificatie.** Butoane (✕, ○, □, L3), fuga, a doua putere, cele 10 secunde, capitole, scrisul de sus, stilul grafic |
| 25 | [Nivelurile 7 - 12](25-niveluri-7-12.md) | **Specificatie.** Povestea, mecanismele de colaborare, cele sase niveluri, George, Sala Tronului, texte, sunete |
| 26 | [Limba personajelor](26-limba-personajelor.md) | **Specificatie (T13).** Fiecare erou are propria limba, cu cam 1000 de cuvinte generate, fraze, balon cu traducerea si Dictionar |
| 27 | [Cota de oua si cristale](27-cota-de-oua.md) | **Specificatie (T14).** Fiecare erou are de gasit un numar pe nivel, tine cel mult 150%, ii da prietenului cu L1; insigna verde / rosie |

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

In `capturi/` sunt capturi facute de testele automate. Capturile 01 pana la 15 sunt din primul joc, dinainte de update-ul din 14 noiembrie (in joc apare acum intai ecranul "Alege jocul", iar 05 e dinainte de decor). Capturile 16 pana la 24 sunt din versiunea de acum. Foloseste-le ca sa vezi cum arata ce descriu capitolele:

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
| [14-lupta-din-mijloc](capturi/14-lupta-din-mijloc.jpg) | Lupta din mijlocul nivelului 3, bara de progres cu cele doua lupte |
| [15-boss-cinci-goluri](capturi/15-boss-cinci-goluri.jpg) | Boss-ul: cinci goluri de dat |
| [16-alege-jocul](capturi/16-alege-jocul.jpg) | Ecranul "Alege jocul" cu cele doua jocuri |
| [17-lupta-start](capturi/17-lupta-start.jpg) | Ecranul de start al jocului "Cea mai grea luptă" |
| [18-lupta-nivel](capturi/18-lupta-nivel.jpg) | Jungla de noapte: Boon, Killer, cristale, roboti |
| [19-ajutor-asteapta](capturi/19-ajutor-asteapta.jpg) | Un erou lovit asteapta: butonul □, inelul, sageata prietenului |
| [20-ajutor-minge](capturi/20-ajutor-minge.jpg) | Mingea magica zboara spre prieten |
| [21-george-mini-lupta](capturi/21-george-mini-lupta.jpg) | Mini-lupta cu George cel Rău |
| [22-arena](capturi/22-arena.jpg) | Lupta finala: arena cu munti, torte si soldati cu sulite |
| [23-final-medalii](capturi/23-final-medalii.jpg) | Finalul: medalii si stelute care imbratiseaza eroii |
| [24-personaje](capturi/24-personaje.jpg) | Boon, Killer si George cel Rău, pictati dupa desenele copiilor |

## Prompturi

In `../prompts/` sunt cererile originale cuvant cu cuvant. Cea mai noua: `05-cerere-16-noiembrie.md` (rundele 7 - 12), cu promptul gata de lipit in `06-prompt-partea-a-doua.md`. Inaintea ei: `04-cerere-14-noiembrie.md` (al doilea joc si regulile noi, cu raspunsurile copiilor si descrierea desenelor lor).
