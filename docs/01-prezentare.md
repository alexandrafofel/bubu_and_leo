# 01. Prezentare

## Pentru cine

Doi frati. Cel mic are 6 ani si nu a mai tinut un controller in mana. Cel mare are 8 ani si vrea provocari. Joaca impreuna, pe acelasi ecran, pe un Mac legat la televizor sau pe monitorul Mac-ului.

Din asta vin aproape toate deciziile:

- Jocul este cooperativ. Toate ouale sunt ale echipei. Nu exista scor separat.
- Nu exista "Game Over". Un erou lovit ameteste putin si scapa un ou.
- Fiecare jucator are dificultatea lui. Cel mic poate juca pe "Ușor" in timp ce cel mare joaca pe "Normal" sau "Greu", in acelasi nivel.
- Vederea este de sus. Nu trebuie sarit cu precizie.
- Textele sunt foarte scurte. Unde se poate, sunt iconite in loc de propozitii.
- Totul este mare si se citeste de pe canapea.

## Povestea

Ciori, o cioara poznasa, a furat ouale de aur din cuiburile dinozaurilor chiar inainte de Festivalul Apusului. Le-a imprastiat prin Valea Calda. Bubu si Leo le aduna pe toate inainte de apus. La final il prind pe Ciori in cel mai inalt copac. Ciori nu este rau, doar obraznic. Isi cere iertare si vine la festival. Un ou de aur ecloseaza si iese un pui de dinozaur.

## Eroii

| | Bubu (jucatorul 1 la inceput) | Leo (jucatorul 2 la inceput) |
|---|---|---|
| Cine | Pui de triceratops rotund, portocaliu cu pete verzi si o esarfa rosie | Mic fotbalist cu tricou galben, sort albastru si bentita rosie |
| Culoarea pe ecran | Portocaliu `#F08A3C` | Galben `#F6C63C` cu albastru `#3F78C8` |
| Puterea (✕) | Tropait: un val care ameteste inamicii din jur si trage ouale spre el | Sut: mingea zboara, sare de pereti, impinge inamicii si aduna ouale atinse |
| Indemanare optionala | Nu are | Tine ✕ apasat mai mult pentru un sut mai puternic |
| De ce | Puterea lui merge in toate directiile, nu trebuie tintit. Bun pentru 6 ani. | Trebuie tintit si dozat. Bun pentru 8 ani. |

Jucatorii pot schimba personajele intre ei (△ pe ecranul de start sau din Setari).

## Ce se aduna

- Oua de aur. Contorul echipei. 60 pe nivel cu valorile de acum (360 secunde x 10 pe minut).
- Stele bonus. 3 pe nivel, mai greu de luat: pe o insula, intr-un colt cu stanci, sub un gandac, in coroana unui copac.
- Oul urias din pestera din spatele cascadei (nivelul 5). Valoreaza 20 de oua.

## Obstacole

- Noroi: incetineste mersul (viteza x 0.45).
- Conuri de brad care se rostogolesc pe culoare de sus in jos.
- Gandaci morocanosi care dorm. Se trezesc daca treci prea aproape si te urmaresc.
- Rafale de vant pe dealul cu mori.
- Paznicul cuibului (mini-lupta) la finalul fiecarui nivel.

## Ajutoare

- Fluturele portocaliu. Apare din cand in cand. Cine il atinge da ambilor eroi viteza x 1.5 pentru 6 secunde.
- Sageata ajutatoare. Arata unde sa mergi si ce te asteapta acolo. Pornita pentru Bubu.
- Sageata aurie de indiciu. Apare dupa 10 secunde fara niciun ou luat.
- Ajutorul la tintire pe "Ușor": sutul lui Leo se indreapta singur spre cel mai apropiat ou sau inamic.

## Nivelurile

| Nr | Nume (ro) | Nume (en) | Ce aduce nou | Paznicul cuibului |
|---|---|---|---|---|
| 1 | Pajiștea Însorită | The Sunny Meadow | Miscarea, tropaitul, sutul, un iaz cu o stea | Regele Gândac (fuge spre tine) |
| 2 | Pădurea Somnoroasă | The Sleepy Forest | Gandaci care dorm, copaci care sclipesc si ascund oua | Bufnița Buhu (zboara si arunca) |
| 3 | Malul Noroios | The Muddy Bank | Noroi, rau cu pod si pietre, conuri | Racul Cleștișor (fuge de doua ori si arunca) |
| 4 | Dealul Morilor | Windmill Hill | Vant, mori de vant | Vârtejel (sare si imprastie frunze) |
| 5 | Cascada Secretă | The Secret Waterfall | Cascada, pestera ascunsa cu oul urias | Broscoiul Oac (sare de trei ori) |
| 6 | Drumul Apusului | Sunset Road | Felinare care se aprind, totul la apus | Ciorel, nepotul lui Ciori (zboara si arunca) |
| Final | Cuibul lui Ciori | Ciori's Nest | Boss-ul: Bubu scutura copacul, Leo suteaza in cuib de trei ori | |

Dupa boss urmeaza Festivalul Apusului: felinare, artificii, oul care ecloseaza si scorul echipei.

## Cum curge un nivel

1. Ecranul de poveste: numele nivelului, trei iconite, o propozitie citita cu voce (daca exista o voce de sistem in limba aleasa).
2. Trei valuri de oua, de la stanga la dreapta. Cand un val e adunat, apare urmatorul si Ciori trece in zbor pe cer.
3. Provocarea: un paznic apare langa cuib. Fiecare lovitura scoate oua. Cand pierde toate inimile, fuge.
4. Cuibul se deschide. Cand ambii eroi ajung la cuib (sau unul singur dupa 7 secunde), nivelul e gata.
5. Ecranul "Bravo!": ouale nivelului, stelele, trei medalii, totalul echipei.

Bara de progres de sus arata drumul: trei oua, inima paznicului, cuibul, plus procentul.

## Durata

Tinta initiala a fost 45 de minute in total. Un bot care merge perfect termina un nivel in 1 pana la 2 minute. Copiii vor avea nevoie de mai mult. Durata se regleaza din `CONFIG.levelDuration` si `CONFIG.eggsPerMinute` (vezi `03-config.md`).

## Platforma

- Google Chrome pe macOS. Alte browsere nu au fost testate.
- Controllere DualShock 4 prin Gamepad API, cu "standard mapping". Prin cablu USB sau Bluetooth.
- Tastatura ca rezerva: W A S D + Spatiu si sageti + Enter. Tastele se pot schimba din Setari.
- Progresul si setarile se salveaza in `localStorage` al browserului, sub cheia `bubu-leo-oua-de-aur-v1`.
