# Instructiuni pentru Claude

Acest fisier este pentru orice asistent care lucreaza la joc. Citeste-l primul.

## Ce este proiectul

Un joc HTML, pentru doi copii (6 si 8 ani), cooperative, cu doua controllere DualShock 4 pe Mac in Chrome. Fara nimic extern.

- "Cea mai grea luptă": jocul inventat de copii (Boon, Killer, George cel Rău, jungla de noapte). **Singurul joc.** Detalii in `docs/21-cea-mai-grea-lupta.md`.
- "Bubu și Leo: Ouăle de Aur" a fost scos pe 18 noiembrie 2026 (`docs/16-decizii.md`, "Un singur joc"). **Nu se mai modifica nimic pentru el.** Codul lui (`GAME_BASE`, ramurile `!isLupta()`, `LEVEL_DEFS`, `drawBubu`, `drawLeo`...) a ramas in `src/`, nefolosit; la o curatare se poate sterge. Capitolele din `docs/` scrise despre el sunt istorice.

`GAME` este mereu `'lupta'`. Ultimul update, pe puncte: `docs/22-update-14-noiembrie.md`.

Urmatorul update ("Partea a doua": rundele 7 - 12, a doua putere, fuga, zece secunde, capitole) este specificat, nu implementat, in `docs/23-update-partea-a-doua.md`, `docs/24-sisteme-noi.md` si `docs/25-niveluri-7-12.md`, iar limba personajelor (cam 1000 de cuvinte pe erou) in `docs/26-limba-personajelor.md`, iar cota de oua / cristale pe erou (L1 da un ou prietenului) in `docs/27-cota-de-oua.md`. Regulile de mai jos descriu jocul de acum. Cele care se schimba cu acel update sunt aratate in `docs/23-update-partea-a-doua.md`, sectiunea 6, si se rescriu aici abia cand sarcina lor e gata. Update-ul e impartit in 23 de sarcini (T14 are zece subsarcini, T14.1 - T14.10; se implementeaza doar in "Cea mai grea luptă"; ce spun specificatiile despre "ambele jocuri" sau despre primul joc nu se mai aplica), cu cate un prompt pentru fiecare, in `prompts/06-prompt-partea-a-doua.md`. Facute: T5 (capitole), T1 (banda de sus) si T2 (butoanele noi si fuga) pe 18 noiembrie 2026, T3 (a doua putere) si T4 (cele 10 secunde) pe 19 noiembrie 2026.

## Regulile care nu se schimba fara acordul proprietarei

1. Un singur fisier HTML final, complet independent. Fara biblioteci, fara imagini, fara fisiere audio, fara adrese de internet in cod. Desenele se fac pe canvas, sunetele cu Web Audio.
2. Trebuie sa mearga offline in Google Chrome pe macOS.
3. Toate textele din joc exista in romana si in engleza, in tabelul `STR` din `src/015-lang.js`. Nu scrie text direct in cod: adauga o cheie in `STR.ro` si `STR.en` si foloseste `T('cheie')`.
4. Stilul vizual: pictura in acuarela dintr-o carte pentru copii. Fara contururi negre, fara gri, fara negru. Umbrele sunt violet cald sau maro (`SHADOW = '#6A4270'`). Vezi `docs/15-culori.md`.
5. Sunetele sunt calde si moi: sinus, triunghi, filtre trece-jos, reverberatie. Fara sunete patrate sau aspre, nimic care sperie.
6. Jocul nu se termina niciodata cu "Game Over". Un erou lovit scapa un ou, care poate fi luat inapoi, si asteapta pe loc. Prietenul are 10 secunde sa il ajute cu ○; daca nu ajunge, nivelul reincepe de la inceput cu mesajul "Încă o dată!" (niciodata "Ai pierdut"). Dupa trei reinceperi ale aceluiasi nivel, limita creste la 15 secunde. Nimeni nu ramane blocat: un copil care joaca singur se ridica singur si nu are numaratoare.
7. Totul se reglaza din `CONFIG` (`src/01-config.js`) cand se poate. Valori noi de reglaj se adauga acolo, cu un comentariu.
8. Controalele: stick stanga sau D-pad pentru mers, ✕ prima putere, □ a doua putere, ○ ajuta prietenul, L3 (apasarea stick-ului) fuga, OPTIONS pauza. Zona moarta a stick-ului minimum 0.25.
9. Exista un singur joc, "Cea mai grea luptă": 6 niveluri + lupta finala, peste 10.000 de elemente, minimum 30 de cuvinte pe erou. Toate schimbarile se fac doar in el. Nu adauga cod nou pentru Bubu si Leo si nu mai face ramuri pentru doua jocuri.
10. Nivelul se termina doar cand amandoi jucatorii sunt in cuib.

## Cum lucrezi

1. Modifici doar fisierele din `src/`. Fisierul din `game/` se genereaza.
2. Rulezi `./build.sh`. Scriptul lipeste fisierele in ordinea din `FILES` si verifica sintaxa cu `node --check`.
3. Rulezi `node tools/gen-docs.js`. Anexele din `docs/anexe/` se refac din cod.
4. Rulezi testele relevante din `tests/` (vezi `docs/17-testare.md`), pentru joc. Minimum: `joc-complet-bot.js`, `controller-simulat.js`, `setari-ui.js`. Toate trebuie sa termine cu `errors 0` si fara `NEREUSIT`. `tests/toate.sh` le ruleaza pe toate.
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
| Cum arata Boon, Killer, George si lumea lor | `src/055-lupta.js` | `docs/21-cea-mai-grea-lupta.md` |
| Ajutorul cu ○, inamicii mici, cuibul | `src/07-play.js`, `CONFIG.rescue`, `CONFIG.smallEnemy` | `docs/10-gameplay.md`, `docs/22-update-14-noiembrie.md` |
| Fuga cu L3, viteza, pasii de coliziune | `src/07-play.js`, `CONFIG.sprint` | `docs/10-gameplay.md` |
| Cele 10 secunde, ecranul "Încă o dată!" | `src/07-play.js`, `src/10-main.js`, `CONFIG.rescue` | `docs/10-gameplay.md`, `docs/13-ecrane-si-meniuri.md` |
| Ecranul de start, `setGame` (acum fixeaza jocul) | `src/09-screens.js` | `docs/13-ecrane-si-meniuri.md` |
| Capitolele, meniul de start, salvarea (`chapters`, `Save.finish`) | `src/06-level.js`, `src/09-screens.js`, `src/10-main.js` | `docs/13-ecrane-si-meniuri.md` |
| Nivelurile si generarea lor | `src/06-level.js` | `docs/09-niveluri.md` |
| Regulile jocului, puterile, inamicii, boss-ul | `src/07-play.js` | `docs/10-gameplay.md` |
| Ce putere are fiecare erou pe fiecare buton (`power`, `power2`, `abil`) | `src/01-config.js`, `src/07-play.js` | `docs/03-config.md`, `docs/10-gameplay.md` |
| Mini-luptele cu paznicii | `src/075-duel.js` | `docs/11-mini-lupte.md` |
| Desenarea lumii, sageata, bara de progres, HUD | `src/08-draw.js` | `docs/12-desen-si-hud.md` |
| Banda de sus (`HUD_TOP`), bannerele, camera (`camTarget`) | `src/08-draw.js`, `src/07-play.js` | `docs/12-desen-si-hud.md`, `docs/10-gameplay.md` |
| Ecranele, meniurile, Setari, salvarea | `src/09-screens.js` | `docs/13-ecrane-si-meniuri.md` |
| Bucla principala, starile jocului | `src/10-main.js` | `docs/14-bucla-principala.md` |

## Capcane cunoscute

- Ordinea fisierelor din `build.sh` conteaza. Un fisier poate folosi la incarcare doar nume definite in fisierele de dinaintea lui. In functii care ruleaza mai tarziu poate folosi orice.
- Codul ruleaza intr-un singur `<script>` cu `'use strict'`. Toate numele de sus sunt globale si unice in tot jocul. Verifica cu `grep` ca un nume nou nu exista deja.
- `T` este functia de traducere. Nu folosi `T` ca nume de variabila locala.
- In `text(...)`, `halo` e grosimea conturului **ca parte din marimea fontului** (0.2 implicit). `halo: 5` deseneaza un cerc crem cat jumatate de ecran.
- Tot scrisul de sus sta in banda de 132 de unitati (`HUD_TOP`, `08-draw.js`). Nimic nu coboara sub ea peste lume, niciun banner. Camera (`camTarget`, `07-play.js`) tine eroii sub banda. Daca schimbi inaltimea unui cartonas de sus, ruleaza `tests/hud-acoperire.js` cu `STRICT=1`.
- `Game.levelIdx` este indicele unui **capitol** (nivel sau lupta mare), nu numarul nivelului. Numarul nivelului e `P.L.idx`. Lista capitolelor o da `chapters()`.
- Tastatura baga un jucator in joc doar pe ecranul de start (`Input.kbJoin`). Nu il porni pe alte ecrane: Enter si Spatiu sunt si tastele de putere.
- Puterile sunt doua abilitati, `spin` si `throw`. Nu scrie `h.k === 0` ca sa afli ce poate un erou: foloseste `abil(k, kind)` si `hasAbil(k, kind)`. Fiecare lucru aruncat are `owner` si `look`.
- Eroul se misca in pasi de cel mult `CONFIG.sprint.step` unitati (ca mingile). Daca adaugi ceva care muta eroul, pune-l in acelasi pas, nu dupa el.
- Lumea are coordonate logice. Ecranul are mereu 1920 x 1080 unitati, scalate la fereastra. Nivelurile au 3200 x 1800.
- Grila nivelului are celule de 40 (`CS`). Codurile celulelor sunt in `docs/09-niveluri.md`.
- `Snd.play(nume, valoare, erou, volum)`: al treilea argument spune al cui este sunetul. Fara el, sunetul unui personaj nu poate merge in difuzorul controllerului lui. Al patrulea (optional) e un volum intre 0 si 1.
- Chrome nu accepta un buton de controller ca gest pentru ecran complet sau pentru pornirea sunetului. Trebuie o tasta sau un clic.
- `CONFIG.heroes`, `CONFIG.villainName` si `CONFIG.boss` se schimba cand se schimba jocul. Eroii primului joc sunt mereu in `GAME_BASE`. Pentru Boon si Killer reglezi `CONFIG.lupta.heroes`.
- Un text care vorbeste de oua, de Ciori sau de cuib are nevoie si de varianta `'L:cheie'` pentru al doilea joc.
- Testele pornesc pe ecranul de start (nu mai exista "Alege jocul"). `tests/common.js` porneste jocul. Variabila `JOC` e ignorata. Ruleaza-le din `tests/out/`, ca acolo raman capturile.
- Testele de sunet si de viteza se ruleaza singure, fara alt test in acelasi timp.
- Testele ruleaza in Chrome fara placa video (SwiftShader). Timpii de cadru masurati acolo sunt mai mari decat pe un Mac real.

## Stilul documentatiei

Documentatia este in romana, fara diacritice in text, cu propozitii scurte. Textele din joc sunt citate exact, cu diacritice, pentru ca asa sunt in cod.
