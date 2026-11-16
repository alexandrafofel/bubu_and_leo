# Cererea din 16 noiembrie 2026: urmatoarele 6 runde din "Cea mai grea luptă"

Mesajul proprietarei, cuvant cu cuvant (16 noiembrie 2026, 14:50):

> esti un creator de jocuri top 1% mondial. fa-mi o documentatie pe care ulterior sa o poata implementa opus pentru urmatoarele 6 runde din "cea mai grea lupta". sa fie in cele mai mici detalii sa poata fi implementata usor. urc-o in github. vreau sa ne inspiram din jocul "It takes two" - [It Takes Two on Steam](https://store.steampowered.com/app/1426210/It_Takes_Two/). Cele doua personaje sa colaboreze, sa se ajute, grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two). De asemenea, fiecare personaj sa primeasca inca o putere in plus - Killer sa isi alungeasca si el mainile si sa aiba puterea lui Boon (alta culoare, alte detalii sa nu arate fix la fel, sa vibreze controllerul cand o foloseste) iar Boon sa primeasca puterea lui Killer, dar sa arunce cu altceva - ceva specific dinozaurilor (la fel, alta culoare, alte detalii, sa fie diferit) - deci pe x apasa pentru puterea lor initiala, pe O sa se salveze reciproc si pe patrat sa fie cea de-a doua putere, asta. Stick-ul Stâng (L3): Stick analogic pentru mișcarea personajului; poate fi apăsat ca un buton (L3) - cand il apasa sa mearga mult mai repede (x3). cand un personaj este lovit - la ambii jucatori le vibreaza controllerul si au 10 secunde sa se ajute, daca nu se ajuta reincep level-ul de la inceput. cand intri in joc apare sa incepi de la inceput sau de unde ai ramas (cum e acum level 6) - si poti merge prin chapters sa reiei un level (ca la it takes two). also, scrisul de sus vine peste joc si de multe ori nu se vad personajele - de rezolvat acest bug.

## Cerintele, despartite

| Nr | Cerinta, cu cuvintele ei | Unde e specificata |
|---|---|---|
| C1 | "urmatoarele 6 runde din cea mai grea lupta" | `../docs/25-niveluri-7-12.md` |
| C2 | "sa ne inspiram din jocul It takes two. Cele doua personaje sa colaboreze, sa se ajute" | `../docs/23-update-partea-a-doua.md` (principii), `../docs/25-niveluri-7-12.md` (mecanisme) |
| C3 | "grafica sa fie asemanatoare (un singur screen cum e acum - sa fie vizibile ambele personaje cum e acum, dar detaliile grafice asemanatoare cu it takes two)" | `../docs/24-sisteme-noi.md`, S7 |
| C4 | "Killer sa isi alungeasca si el mainile si sa aiba puterea lui Boon (alta culoare, alte detalii sa nu arate fix la fel, sa vibreze controllerul cand o foloseste)" | `../docs/24-sisteme-noi.md`, S3 |
| C5 | "Boon sa primeasca puterea lui Killer, dar sa arunce cu altceva - ceva specific dinozaurilor (la fel, alta culoare, alte detalii, sa fie diferit)" | `../docs/24-sisteme-noi.md`, S3 |
| C6 | "pe x apasa pentru puterea lor initiala, pe O sa se salveze reciproc si pe patrat sa fie cea de-a doua putere" | `../docs/24-sisteme-noi.md`, S1 |
| C7 | "Stick-ul Stâng (L3) (...) cand il apasa sa mearga mult mai repede (x3)" | `../docs/24-sisteme-noi.md`, S2 |
| C8 | "cand un personaj este lovit - la ambii jucatori le vibreaza controllerul si au 10 secunde sa se ajute, daca nu se ajuta reincep level-ul de la inceput" | `../docs/24-sisteme-noi.md`, S4 |
| C9 | "cand intri in joc apare sa incepi de la inceput sau de unde ai ramas (cum e acum level 6) - si poti merge prin chapters sa reiei un level (ca la it takes two)" | `../docs/24-sisteme-noi.md`, S5 |
| C10 | "scrisul de sus vine peste joc si de multe ori nu se vad personajele - de rezolvat acest bug" | `../docs/24-sisteme-noi.md`, S6 |

Promptul gata de lipit pentru implementare este in `06-prompt-partea-a-doua.md`.
