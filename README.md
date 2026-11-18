# Cea mai grea lupta

Un joc video cooperativ, intr-un singur fisier, pentru doi frati de 6 si 8 ani. Se joaca pe un Mac, in Google Chrome, cu doua controllere PlayStation 4 (DualShock 4) sau cu tastatura.

"Cea mai grea lupta" este jocul inventat de copii. Boon, un dinozaur cu gheare care se invart, si Killer, un fotbalist cu tricoul 10, aduna cristale curcubeu printr-o jungla de noapte, ca sa le dea cadou la o petrecere. Pe fiecare nivel ii asteapta George cel Rau, un dinozaur cu coroana, din ce in ce mai mare. Personajele sunt pictate dupa desenele copiilor.

Jocul "Bubu si Leo: Ouale de Aur" (primul joc) a fost scos pe 18 noiembrie 2026. Orice schimbare se face doar in "Cea mai grea lupta".

Totul este intr-un singur fisier HTML. Nu are imagini, sunete sau biblioteci externe. Desenele sunt pictate cu cod pe canvas. Muzica si sunetele sunt generate cu Web Audio. Merge fara internet.

## Cum joci

1. Descarca `game/bubu-si-leo-ouale-de-aur.html`.
2. Trage fisierul intr-o fereastra Google Chrome.
3. Fa clic o data pe ecran. Chrome porneste sunetul si ecranul complet doar dupa un clic sau o tasta.
4. Apare ecranul de start. Fiecare apasa ✕ (sau tasta lui de putere) ca sa intre in joc.
5. Fiecare jucator apasa ✕ pe controllerul lui. Fara controller: primul erou cu W A S D si Spatiu, al doilea cu sagetile si Enter.
6. Stanga si dreapta aleg dificultatea. ✕ inseamna "Gata!".

In joc: ✕ este prima putere a eroului. ○ ajuta prietenul lovit (tastatura: E, respectiv Shift dreapta): el ramane pe loc pana vine celalalt. Primul erou trebuie sa vina aproape, al doilea poate ajuta de departe, cu o minge magica. L3 (apasarea stick-ului stang; tastatura: Shift stanga, respectiv Alt dreapta) porneste fuga: de trei ori mai repede, pana lasi stick-ul. □ este a doua putere, care nu e inca facuta. Nivelul se termina cand amandoi sunt in cuib.

Sunetele personajelor se pot auzi in difuzorul controllerului doar daca acesta e legat cu cablu USB: Setari, "Conectează controllerul", "Caută difuzorul controllerului".

Setarile se deschid cu OPTIONS pe controller, cu tasta P sau cu clic pe butonul "Setari". Tasta F comuta ecranul complet.

## Ce este in acest depozit

| Locul | Ce contine |
|---|---|
| `game/` | Jocul gata de jucat: un singur fisier HTML. |
| `src/` | Codul sursa, impartit in 14 fisiere. Jocul se construieste din ele. |
| `build.sh` | Lipeste fisierele din `src/` in jocul din `game/` si verifica sintaxa. |
| `docs/` | Documentatia completa. Incepe cu `docs/00-cuprins.md`. |
| `docs/anexe/` | Liste generate automat din cod: toate functiile, culorile, textele, sunetele, valorile din CONFIG. |
| `tools/gen-docs.js` | Scriptul care genereaza anexele. |
| `tests/` | Testele automate (Chrome fara fereastra, cu boti si controllere simulate). `tests/toate.sh` le ruleaza pe toate, pentru joc. |
| `prompts/` | Cererile originale, cuvant cu cuvant, si promptul pentru urmatorul update (`06-prompt-partea-a-doua.md`). |
| `CLAUDE.md` | Instructiuni pentru orice cont Claude care modifica jocul. |

## Cum modifici jocul

Citeste `CLAUDE.md` si `docs/18-ghid-modificari.md`. Pe scurt:

1. Schimbi fisierele din `src/`. Nu schimbi direct fisierul din `game/`.
2. Rulezi `./build.sh`.
3. Rulezi `node tools/gen-docs.js` ca anexele sa ramana la zi.
4. Rulezi testele din `tests/` (vezi `docs/17-testare.md`).

Cele mai multe schimbari cerute de copii (viteze, nume, culori, numar de niveluri, durata) sunt in obiectul `CONFIG` din `src/01-config.js`. Fiecare valoare este explicata in `docs/03-config.md`.

## Ultimul update

14 noiembrie 2026: al doilea joc, ajutorul cu □ (mutat pe ○ in 18 noiembrie), inamicii mici care dispar dupa doua lovituri, cuibul care ii asteapta pe amandoi, sunetele personajelor reparate. Totul, pe puncte, in `docs/22-update-14-noiembrie.md`. Ce nu a putut fi verificat fara un Mac si controllere reale este in `docs/19-limitari.md`.

## Urmatorul update

"Partea a doua": inca sase runde pentru "Cea mai grea lupta", in care cei doi eroi trebuie sa colaboreze la fiecare pas, a doua putere pentru Boon si Killer, fuga cu L3, zece secunde pentru ajutor, capitole. Este doar specificat, nu implementat: `docs/23-update-partea-a-doua.md`, `docs/24-sisteme-noi.md`, `docs/25-niveluri-7-12.md`, plus limba personajelor (fiecare erou cu cam 1000 de cuvinte): `docs/26-limba-personajelor.md`. plus cota de oua pe erou, cu L1 pentru a ajuta prietenul: `docs/27-cota-de-oua.md`. Implementarea e impartita in 14 sarcini, cu cate un prompt gata de lipit pentru fiecare: `prompts/06-prompt-partea-a-doua.md`.
