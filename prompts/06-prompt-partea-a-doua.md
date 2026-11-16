# Prompt pentru "Partea a doua" (rundele 7 - 12)

Lipeste textul de mai jos intr-o conversatie noua cu Claude (Opus sau alt model), dupa ce Claude are acces la depozitul `alexandrafofel/bubu_and_leo`. Update-ul e mare. Cel mai bine merge cate o etapa pe conversatie: schimba doar randul "Etapa de acum".

---

Lucrezi la depozitul GitHub `alexandrafofel/bubu_and_leo`. Sunt doua jocuri HTML intr-un singur fisier, pentru doi frati de 6 si 8 ani, jucate pe un Mac in Chrome cu doua controllere DualShock 4: "Bubu și Leo: Ouăle de Aur" si "Cea mai grea luptă" (inventat de copii).

Inainte sa schimbi ceva, citeste in ordinea aceasta:

1. `CLAUDE.md`: regulile care nu se schimba si pasii de lucru.
2. `docs/00-cuprins.md`, apoi `docs/02-arhitectura.md` si `docs/21-cea-mai-grea-lupta.md`.
3. `docs/23-update-partea-a-doua.md`: ce se cere, ce s-a hotarat, planul pe etape.
4. `docs/24-sisteme-noi.md` si `docs/25-niveluri-7-12.md`: specificatia, in detaliu.
5. `prompts/05-cerere-16-noiembrie.md`: cererea mea, cuvant cu cuvant. Daca specificatia si cererea spun lucruri diferite, cererea are dreptate: spune-mi.

Etapa de acum: **E1** (vezi tabelul din `docs/23-update-partea-a-doua.md`, sectiunea 5).

Raspunsurile mele la intrebarile deschise I1 - I9 din `docs/23-update-partea-a-doua.md`, sectiunea 3 (unde nu am scris nimic, foloseste coloana "Daca nu raspunzi"):

- I1:
- I2:
- I3:
- I4:
- I5:
- I6:
- I7:
- I8:
- I9:

Reguli de lucru:

- Lucreaza pe o ramura noua, pornita din `main`. Inainte de orice schimbare ruleaza `./build.sh` si `tests/toate.sh` si spune-mi daca ceva nu trece.
- Modifici doar `src/`. Construiesti cu `./build.sh`. Regenerezi anexele cu `node tools/gen-docs.js`.
- Fa doar etapa ceruta. Nu incepe urmatoarea.
- Etapa e gata cand e adevarat ce scrie in coloana "Gata cand" si cand `tests/toate.sh` trece pentru ambele jocuri, cu `errors 0` si fara `NEREUSIT`.
- Scrie testele noi cerute de etapa, in `tests/`, si adauga-le in `tests/toate.sh`. Un test trebuie sa poata pica: verifica asta o data, stricand anume regula pe care o testeaza.
- Nimic din primul joc nu are voie sa se schimbe in afara de ce spune specificatia. Dupa fiecare etapa, `joc-complet-bot.js`, `mingi-leo.js` si `mini-lupte-bot.js` trebuie sa treaca in primul joc.
- Fa capturi de ecran dupa orice schimbare vizuala si uita-te la ele. Pentru stilul grafic foloseste lista de verificare din `docs/24-sisteme-noi.md`, S7.8.
- Toate textele noi in romana si engleza, in `STR` din `src/015-lang.js`. Textele sunt deja scrise in specificatie: foloseste-le pe acelea.
- Toate valorile noi de reglaj in `CONFIG` (`src/01-config.js`), cu comentariu. Blocurile sunt deja scrise in specificatie.
- Fara contururi negre, fara gri, fara negru. Sunete calde. Niciodata cuvintele "Game Over".
- Nu copia nimic din jocul "It Takes Two": nici personaje, nici locuri, nici obiecte, nici nume. Luam doar principiile din `docs/23-update-partea-a-doua.md`, sectiunea 4.
- Cand termini etapa: muta descrierea ei din capitolele 24 si 25 in capitolul care descrie partea aceea de cod (03, 06, 07, 09, 10, 11, 12, 13), adauga hotararile noi in `docs/16-decizii.md`, rezultatele testelor in `docs/17-testare.md`, ce nu ai putut verifica in `docs/19-limitari.md`, si schimba in `CLAUDE.md` regulile aratate in `docs/23-update-partea-a-doua.md`, sectiunea 6, pentru etapa aceea.
- La final: commit pe ramura, pull request in `alexandrafofel/bubu_and_leo`, si fisierul `game/bubu-si-leo-ouale-de-aur.html` trimis mie in conversatie.
- Spune-mi la final, pe scurt: ce ai facut, ce teste au trecut, ce nu ai putut verifica (controllere reale, cum suna, cum se simt vibratiile, daca un copil de 6 ani intelege mecanismul), si ce intrebari ai pentru mine sau pentru copii.

---

## Ordinea etapelor

| Conversatia | Etapa | Ce primesti la sfarsit |
|---|---|---|
| 1 | E1 | Scrisul de sus nu mai acopera eroii. |
| 2 | E2, E3 | Butoanele noi si fuga. |
| 3 | E4 | A doua putere pentru Boon si Killer. |
| 4 | E5 | Cele 10 secunde. |
| 5 | E6 | Capitole, meniul de start. |
| 6 | E7 | Grafica noua pentru eroi si baza pentru nivelurile noi. |
| 7 - 10 | E8, E9, E10, E11 | Nivelurile 7 - 12. |
| 11 | E12 | Lupta finala si finalul nou. |
| 12 | E13 | Sunete, decor, documentatie, tot testat. |

Dupa conversatia 5 jocul are deja toate regulile cerute, pe nivelurile de acum. E un moment bun sa il incerce copiii si sa raspunzi la intrebarile I1 - I9 inainte de nivelurile noi.

## Daca vrei alte schimbari

Inlocuieste randul "Etapa de acum" cu cererea ta. Pastreaza pasii "Inainte sa schimbi ceva" si "Reguli de lucru".
