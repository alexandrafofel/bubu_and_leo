# 02. Arhitectura

## Un singur fisier, construit din 14 bucati

Cererea a fost un singur fisier HTML, fara nimic extern. Un fisier de 440 KB este greu de citit si de modificat. De aceea codul sta in 14 fisiere in `src/`, iar `build.sh` le lipeste unul dupa altul.

```
src/00-head.html     <!DOCTYPE>, stilul paginii, <canvas id="game">, deschide <script>
src/01-config.js     CONFIG: toate valorile de reglaj
src/015-lang.js      Opt (setarile alese), GAME (jocul ales), STR (texte ro + en), T(), TG(), keyName()
src/02-core.js       matematica, culori, pictura in acuarela, hartie, cer, text, carduri, sprite-uri
src/03-audio.js      Snd (muzica, efecte, ambient, difuzorul controllerului) si Voice (citire cu voce)
src/04-input.js      Input: controllere, tastatura, navigarea prin meniuri, vibratii
src/05-chars.js      cum se deseneaza Bubu, Leo, Ciori, gandacii, conurile, ouale, stelele, cuibul, iconitele
src/055-lupta.js     al doilea joc: cum se deseneaza Boon, Killer, George cel Rău, robotii, melcii, pasarile, cristalele, racheta
src/06-level.js      definitiile nivelurilor, generatorul, verificarea drumului, pictura fundalurilor, arena boss-ului
src/07-play.js       Game, P (nivelul curent), regulile: eroi, puteri, oua, inamici, vant, fluture, boss
src/075-duel.js      mini-luptele cu paznicii cuibului si desenul lor
src/08-draw.js       desenarea lumii, sageata ajutatoare, indiciile, bara de progres, HUD-ul
src/09-screens.js    UI, Save, ecranele (start, poveste, final de nivel, pauza, Setari, festival), meniurile
src/10-main.js       canvas, starile jocului, bucla de cadre, mouse, ecran complet, pornire
```

`build.sh` adauga la final `</script></body></html>`. Apoi pune aceleasi fisiere JS intr-un singur `tests/tmp/all.js` si ruleaza `node --check` pe el. Asa o greseala de sintaxa opreste construirea.

Numele `015`, `055` si `075` sunt alese ca sa intre in ordinea corecta intre `01` si `02`, `05` si `06`, respectiv `07` si `08`, fara sa renumerotez restul. Ordinea reala este cea din variabila `FILES` din `build.sh`, nu ordinea alfabetica.

### De ce ordinea conteaza

Totul ruleaza intr-un singur `<script>`. Un fisier poate folosi imediat (la incarcare) doar ce au definit fisierele de dinainte. De exemplu `015-lang.js` foloseste `CONFIG` la incarcare, deci vine dupa `01-config.js`. In schimb, functiile pot folosi orice nume, pentru ca ruleaza mai tarziu, cand totul e incarcat. De exemplu `Voice.pick()` din `03-audio.js` foloseste `Opt`, iar `drawGuides()` din `08-draw.js` foloseste `duelCanHurt()` din `075-duel.js`.

### De ce nu module ES sau un bundler

Un fisier deschis direct de pe disc (`file://`) nu poate incarca module separate in Chrome. Un bundler ar fi adus o unealta in plus. `cat` este suficient si se intelege usor.

## Nume globale

Toate numele de sus sunt globale. Cele importante:

| Nume | Fisier | Ce este |
|---|---|---|
| `CONFIG` | 01-config.js | Valorile de reglaj. Nu se schimba in timpul jocului. |
| `Opt` | 015-lang.js | Setarile alese de jucatori. Se salveaza. |
| `STR`, `T()` | 015-lang.js | Textele si functia care le alege dupa limba si dupa joc. |
| `GAME`, `isLupta()` | 015-lang.js | Jocul: mereu `'lupta'` (singurul). `setGame` il fixeaza, argumentul e ignorat. |
| `GAME_BASE` | 015-lang.js | Eroii, numele personajului rau si boss-ul primului joc, asa cum sunt in `CONFIG` la incarcare. Pictorii lui Bubu si Leo citesc de aici. |
| `W`, `H` | 02-core.js | 1920 si 1080: marimea logica a ecranului. |
| `CS` | 02-core.js | 40: marimea unei celule din grila nivelului. |
| `SHADOW` | 02-core.js | `#6A4270`: culoarea tuturor umbrelor. |
| `Snd`, `Voice` | 03-audio.js | Sunetul si vocea. |
| `Input` | 04-input.js | Controalele. |
| `HERO_R` | 06-level.js | 27: raza de coliziune a eroilor. |
| `Game` | 07-play.js | Starea mare a jocului (ce ecran, ce nivel, scorul echipei, dificultatea). |
| `P` | 07-play.js | Tot ce tine de nivelul care se joaca acum. `null` pana la primul nivel. |
| `UI` | 09-screens.js | Starea ecranelor si meniurilor. |
| `Save` | 09-screens.js | Salvarea in `localStorage`. |
| `canvas`, `ctx` | 10-main.js | Canvas-ul si contextul 2D. |
| `window.__game` | 10-main.js | Usa pentru teste: expune obiectele de mai sus. Jocul nu o foloseste. |

## Starile jocului

`Game.state` are una din valorile:

```
boot ──(clic, tasta sau ✕)──> title ──(toti "Gata!")──> loading ──> intro ──(✕)──> play
                                                            │                          nivel terminat          v
                                                            │                     <── loading <── (✕) <── levelEnd
                                                            │
                                                            └──(✕ dupa 12 s)── ending <── (boss invins, play la nivelul 7)
```

- `boot`: ecranul "Fă clic sau apasă o tastă". Exista pentru ca Chrome nu porneste sunetul fara un gest.
- (`select`, ecranul "Alege jocul", a fost scos pe 18 noiembrie 2026.)
- `title`: ecranul de start al jocului ales, cu cei doi eroi ai lui.
- `loading`: dureaza 3 cadre. In primele doua se deseneaza "Se pictează...", in al treilea se genereaza si se picteaza nivelul. Fara asta ecranul ar ingheta fara niciun mesaj.
- `intro`: cardul cu povestea nivelului.
- `play`: jocul. `Game.paused` este adevarat cand meniul de pauza e deschis.
- `levelEnd`: ecranul "Bravo!".
- `ending`: Festivalul Apusului.

Peste `title` si peste pauza poate fi deschis meniul Setari (`UI.set` nu este `null`). Cat timp e deschis, el primeste toate apasarile.

## Bucla de cadre

`frame()` din `10-main.js` ruleaza la fiecare cadru al ecranului (`requestAnimationFrame`):

1. `dt` = timpul de la cadrul trecut, in secunde, limitat intre 0.001 si 0.05. Limita de sus impiedica salturi mari dupa o pauza a tab-ului.
2. `Input.poll(dt)` citeste controllerele si tastatura.
3. `update(dt)` muta jocul inainte, dupa stare.
4. `draw()` deseneaza.
5. Orice eroare este prinsa si scrisa sus pe ecran ("Eroare: ..."), ca jocul sa nu ramana negru fara motiv.

Fizica foloseste `dt` peste tot, deci jocul merge la fel la 60 sau la 120 de cadre pe secunda.

## Coordonate

- Ecran logic: 1920 x 1080. Canvas-ul real este scalat sa intre in fereastra cu aceleasi proportii (`resize()`). Latimea reala este limitata de `CONFIG.maxRenderWidth` (1920).
- Lume: un nivel are 3200 x 1800. Arena boss-ului are 1920 x 1080.
- Camera (`P.cam`) urmareste mijlocul dintre eroi. Face zoom out pana la `L.minZoom` (0.6) cand eroii se departeaza, ca amandoi sa ramana pe ecran. Asa nu e nevoie de ecran impartit.
- Pozitia unui erou (`h.x`, `h.y`) este la picioare. Toate functiile de desen primesc pozitia picioarelor.
- `z` este inaltimea deasupra pamantului (sarituri, oua care cad). Se scade din `y` la desen.

## Ordinea desenului

1. Fundalul pre-pictat al nivelului (`L.bg`). Se picteaza o singura data la incarcare.
2. Lucruri pe pamant: unde, cercul de tropait, cuibul luminat, zona de adapost, ouale, stelele, sageata ajutatoare.
3. Lucruri in picioare, sortate dupa `y` (cine e mai jos pe ecran e in fata): eroi, gandaci, conuri, copaci care se misca, mori, minge, Ciori, paznicul.
4. Lucruri in aer: conuri aruncate, cascada, Ciori in zbor, fluturele, particule.
5. Ecran: dungile de vant, indiciile, HUD-ul, bara de progres, bannerele.
6. Peste tot: stratul de hartie, lumina calda si vinieta (`overlay`), desenate cu `multiply`.

## Performanta

Cererea a fost 60 de cadre pe secunda pe un Mac. Masuri luate:

- Fundalul fiecarui nivel se picteaza o data intr-un canvas ascuns (`L.bg`), apoi doar se copiaza.
- Lucrurile care arata la fel in fiecare cadru se picteaza o data si se "stampileaza": oul, steaua, conul, gandacul care doarme, literele "z", portretele din HUD, cardurile (`sprite()` si `card()` din `02-core.js`).
- Hartia se genereaza o singura data (`PAPER`).

Masurat in Chrome fara placa video: aproximativ 11 ms pe cadru la un nivel normal si 13 ms in timpul unei mini-lupte. Pe un Mac cu placa video ar trebui sa fie mai putin. Nu a fost masurat pe un Mac real.

## Update 14 noiembrie 2026: doua jocuri in acelasi cod

Al doilea joc nu este o copie a codului. Este acelasi motor, cu alte date. Un singur nume hotaraste: `GAME`.

| Ce difera | Cum alege codul |
|---|---|
| Eroii, numele personajului rau, boss-ul | `applyGameConfig()` pune `CONFIG.lupta.heroes`, `.villainName`, `.boss` in locul celor din `CONFIG`. Originalele stau in `GAME_BASE`. |
| Textele | `T('cheie')` cauta intai `'L:cheie'` cand jocul e `lupta`. `TG(id, cheie)` da textul unui joc anume (pentru ecranul "Alege jocul"). |
| Nivelurile si paznicii | `levelDefs()` da `LEVEL_DEFS` sau `LEVEL_DEFS_L`. `duelDefs()` da `DUEL_DEFS` sau `DUEL_DEFS_L`. |
| Desenul eroilor si al lumii | Pictorii din `05-chars.js` trimit la cei din `055-lupta.js` cand `isLupta()`. Fundalul are palete de noapte (`L.night`). |
| Sunetele | `fx2` inlocuieste o parte din efecte. `BABBLE.lupta` si `VOICES.lupta` sunt limba lui Boon si Killer. Melodiile si ambientul au variante cu prefixul `L:`. |
| Salvarea | `Save.slot(id)`: progresul primului joc e sus in salvare, al celui de-al doilea in `g2`. Vezi `13-ecrane-si-meniuri.md`. |

Tot restul (reguli, control, meniuri, Setari, camera, dificultate) este acelasi cod pentru ambele. O regula noua se scrie o data si merge in amandoua.

Capcana: `CONFIG.heroes` se schimba cand se schimba jocul. Codul care are nevoie de eroii primului joc anume (pictorii lui Bubu si Leo pe ecranul "Alege jocul") citeste `GAME_BASE.heroes`, nu `CONFIG.heroes`.
