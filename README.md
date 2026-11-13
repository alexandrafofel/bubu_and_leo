# Bubu si Leo: Ouale de Aur

Un joc video cooperativ pentru doi frati de 6 si 8 ani. Se joaca pe un Mac, in Google Chrome, cu doua controllere PlayStation 4 (DualShock 4) sau cu tastatura.

Bubu este un pui de dinozaur. Leo este un mic fotbalist. Cioara Ciori a furat ouale de aur si le-a imprastiat prin Valea Calda. Cei doi le aduna inainte de apus, trec prin sase niveluri si il prind pe Ciori in cuibul lui.

Totul este intr-un singur fisier HTML. Nu are imagini, sunete sau biblioteci externe. Desenele sunt pictate cu cod pe canvas. Muzica si sunetele sunt generate cu Web Audio. Merge fara internet.

## Cum joci

1. Descarca `game/bubu-si-leo-ouale-de-aur.html`.
2. Trage fisierul intr-o fereastra Google Chrome.
3. Fa clic o data pe ecran. Chrome porneste sunetul si ecranul complet doar dupa un clic sau o tasta.
4. Fiecare jucator apasa ✕ pe controllerul lui. Fara controller: Bubu cu W A S D si Spatiu, Leo cu sagetile si Enter.
5. Stanga si dreapta aleg dificultatea. ✕ inseamna "Gata!".

Setarile se deschid cu OPTIONS pe controller, cu tasta P sau cu clic pe butonul "Setari". Tasta F comuta ecranul complet.

## Ce este in acest depozit

| Locul | Ce contine |
|---|---|
| `game/` | Jocul gata de jucat: un singur fisier HTML. |
| `src/` | Codul sursa, impartit in 13 fisiere. Jocul se construieste din ele. |
| `build.sh` | Lipeste fisierele din `src/` in jocul din `game/` si verifica sintaxa. |
| `docs/` | Documentatia completa. Incepe cu `docs/00-cuprins.md`. |
| `docs/anexe/` | Liste generate automat din cod: toate functiile, culorile, textele, sunetele, valorile din CONFIG. |
| `tools/gen-docs.js` | Scriptul care genereaza anexele. |
| `tests/` | Testele automate (Chrome fara fereastra, cu boti si controllere simulate). |
| `prompts/` | Cererile originale, cuvant cu cuvant, si promptul gata de folosit pentru urmatorul update. |
| `CLAUDE.md` | Instructiuni pentru orice cont Claude care modifica jocul. |

## Cum modifici jocul

Citeste `CLAUDE.md` si `docs/18-ghid-modificari.md`. Pe scurt:

1. Schimbi fisierele din `src/`. Nu schimbi direct fisierul din `game/`.
2. Rulezi `./build.sh`.
3. Rulezi `node tools/gen-docs.js` ca anexele sa ramana la zi.
4. Rulezi testele din `tests/` (vezi `docs/17-testare.md`).

Cele mai multe schimbari cerute de copii (viteze, nume, culori, numar de niveluri, durata) sunt in obiectul `CONFIG` din `src/01-config.js`. Fiecare valoare este explicata in `docs/03-config.md`.

## Urmatorul update

Lista de schimbari cerute pentru versiunea urmatoare este in `docs/20-update-urmator.md`. Promptul gata de lipit intr-o conversatie cu Claude este in `prompts/03-prompt-update-urmator.md`.
