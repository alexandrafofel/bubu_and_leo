# Instructiuni pentru Claude

Acest fisier este pentru orice asistent care lucreaza la joc. Citeste-l primul.

## Ce este proiectul

Un joc HTML pentru doi copii (6 si 8 ani), cooperativ, cu doua controllere DualShock 4 pe Mac in Chrome. Un singur fisier, fara nimic extern. Detalii in `docs/01-prezentare.md`.

## Regulile care nu se schimba fara acordul proprietarei

1. Un singur fisier HTML final, complet independent. Fara biblioteci, fara imagini, fara fisiere audio, fara adrese de internet in cod. Desenele se fac pe canvas, sunetele cu Web Audio.
2. Trebuie sa mearga offline in Google Chrome pe macOS.
3. Toate textele din joc exista in romana si in engleza, in tabelul `STR` din `src/015-lang.js`. Nu scrie text direct in cod: adauga o cheie in `STR.ro` si `STR.en` si foloseste `T('cheie')`.
4. Stilul vizual: pictura in acuarela dintr-o carte pentru copii. Fara contururi negre, fara gri, fara negru. Umbrele sunt violet cald sau maro (`SHADOW = '#6A4270'`). Vezi `docs/15-culori.md`.
5. Sunetele sunt calde si moi: sinus, triunghi, filtre trece-jos, reverberatie. Fara sunete patrate sau aspre, nimic care sperie.
6. Jocul nu se termina niciodata cu "Game Over". Un erou lovit ameteste putin si scapa un ou, care poate fi luat inapoi.
7. Totul se reglaza din `CONFIG` (`src/01-config.js`) cand se poate. Valori noi de reglaj se adauga acolo, cu un comentariu.
8. Controalele: stick stanga sau D-pad pentru mers, ✕ pentru putere, OPTIONS pentru pauza. Zona moarta a stick-ului minimum 0.25.

## Cum lucrezi

1. Modifici doar fisierele din `src/`. Fisierul din `game/` se genereaza.
2. Rulezi `./build.sh`. Scriptul lipeste fisierele in ordinea din `FILES` si verifica sintaxa cu `node --check`.
3. Rulezi `node tools/gen-docs.js`. Anexele din `docs/anexe/` se refac din cod.
4. Rulezi testele relevante din `tests/` (vezi `docs/17-testare.md`). Minimum: `joc-complet-bot.js`, `controller-simulat.js`, `setari-ui.js`. Toate trebuie sa termine cu `errors 0`.
5. Te uiti la capturi de ecran (`capturi-ecran.js`) dupa orice schimbare vizuala.
6. Actualizezi capitolul din `docs/` care descrie partea schimbata. Daca schimbarea este o decizie noua, o adaugi in `docs/16-decizii.md` cu motivul.

## Unde gasesti lucrurile

| Vrei sa schimbi | Fisierul | Capitolul |
|---|---|---|
| Viteze, durate, numar de niveluri, culorile eroilor | `src/01-config.js` | `docs/03-config.md` |
| Texte, limba, setarile salvate | `src/015-lang.js` | `docs/04-limba-si-setari.md` |
| Pictura in acuarela, hartia, cerul | `src/02-core.js` | `docs/05-pictura.md` |
| Muzica, efecte, vocea | `src/03-audio.js` | `docs/06-sunet.md` |
| Controllere si tastatura | `src/04-input.js` | `docs/07-control.md` |
| Cum arata personajele si obiectele | `src/05-chars.js` | `docs/08-personaje.md` |
| Nivelurile si generarea lor | `src/06-level.js` | `docs/09-niveluri.md` |
| Regulile jocului, puterile, inamicii, boss-ul | `src/07-play.js` | `docs/10-gameplay.md` |
| Mini-luptele cu paznicii | `src/075-duel.js` | `docs/11-mini-lupte.md` |
| Desenarea lumii, sageata, bara de progres, HUD | `src/08-draw.js` | `docs/12-desen-si-hud.md` |
| Ecranele, meniurile, Setari, salvarea | `src/09-screens.js` | `docs/13-ecrane-si-meniuri.md` |
| Bucla principala, starile jocului | `src/10-main.js` | `docs/14-bucla-principala.md` |

## Capcane cunoscute

- Ordinea fisierelor din `build.sh` conteaza. Un fisier poate folosi la incarcare doar nume definite in fisierele de dinaintea lui. In functii care ruleaza mai tarziu poate folosi orice.
- Codul ruleaza intr-un singur `<script>` cu `'use strict'`. Toate numele de sus sunt globale si unice in tot jocul. Verifica cu `grep` ca un nume nou nu exista deja.
- `T` este functia de traducere. Nu folosi `T` ca nume de variabila locala.
- Lumea are coordonate logice. Ecranul are mereu 1920 x 1080 unitati, scalate la fereastra. Nivelurile au 3200 x 1800.
- Grila nivelului are celule de 40 (`CS`). Codurile celulelor sunt in `docs/09-niveluri.md`.
- `Snd.play(nume, valoare, erou)`: al treilea argument spune al cui este sunetul. Fara el, sunetul unui personaj nu poate merge in difuzorul controllerului lui.
- Chrome nu accepta un buton de controller ca gest pentru ecran complet sau pentru pornirea sunetului. Trebuie o tasta sau un clic.
- Testele ruleaza in Chrome fara placa video (SwiftShader). Timpii de cadru masurati acolo sunt mai mari decat pe un Mac real.

## Stilul documentatiei

Documentatia este in romana, fara diacritice in text, cu propozitii scurte. Textele din joc sunt citate exact, cu diacritice, pentru ca asa sunt in cod.
