# 22. Update din 14 noiembrie 2026: doua jocuri, reguli noi

Cererea, cuvant cu cuvant, este in `../prompts/04-cerere-14-noiembrie.md`. Aici e fiecare punct: ce inseamna, ce s-a facut, unde in cod, cum se regleaza si ce test il verifica. Toate regulile din `CLAUDE.md` au ramas valabile. Doua au fost completate, cu acordul proprietarei (regulile 6 si 8).

Status: implementat. Jocul nou este descris in `21-cea-mai-grea-lupta.md`.

---

## V1. Doua jocuri intr-un singur fisier

**Cerinta:** "Cand deschizi interfața jocului apar doua variante de joc: “Bubu si Leo” sau “Cea mai grea lupta” (jocul nou)." Si: "un singur fisier".

**Ce s-a facut:**

- Dupa primul clic apare ecranul "Alege jocul" (`Game.state === 'select'`, `drawSelect` si `updateSelect` in `09-screens.js`). Stanga: ziua, Bubu și Leo. Dreapta: noaptea, Cea mai grea luptă, cu eticheta "Joc inventat de copii". Fiecare cartonas arata eroii, personajul rau si ce se aduna.
- Stanga / dreapta alege. ✕ sau Enter porneste. Merge si cu mouse-ul. OPTIONS sau P deschide Setarile si de aici.
- De pe ecranul de start al unui joc, ○ sau Backspace (sau butonul "Alege jocul" din stanga sus) duce inapoi.
- La repornire este ales din start jocul jucat ultima data (`Save.data.game`).
- Fiecare joc isi tine progresul lui. Setarile (limba, volume, taste, dificultate, cine joaca pe cine) sunt comune. Salvarile vechi ale primului joc merg in continuare.
- Fisierul final are acelasi nume: `game/bubu-si-leo-ouale-de-aur.html`.

**Unde:** `GAME`, `applyGameConfig`, `T`, `TG` in `015-lang.js`. `setGame`, `titleBackdrop`, `drawSelect`, `Save.slot` in `09-screens.js`. `Game.toSelect` in `10-main.js`.

**Decizie luata pe drum:** pe ecranul "Alege jocul" Enter si Spatiu doar aleg jocul. Nimeni nu intra in joc cu tastatura de aici (`Input.kbJoin = false`). Altfel parintele care apasa Enter l-ar fi trecut pe al doilea erou pe tastatura si al doilea controller n-ar mai fi putut intra. Tasta care a ales jocul e ignorata pana e eliberata (`Input.muteHeld()`).

**Test:** `tests/alege-jocul.js` (taste reale si mouse, progres separat, repornire). `controller-simulat.js` alege jocul doar din controller.

---

## V2. La sfarsitul rundei se asteapta amandoi in cuib

**Cerinta:** "Ambele jocuri: la sfârșitul rundei, se așteaptă pana când ambii jucatori ajung in cuib (locul unde sunt in siguranță)."

**Inainte:** nivelul se termina cand ambii erau la cuib, sau unul singur dupa 7 secunde.

**Acum:** nivelul se termina doar cand amandoi sunt in cuib. Cat e doar unul, deasupra cuibului scrie "Îl așteptăm pe Leo în cuib!" (cu numele celui care lipseste). Un copil care joaca singur (celalalt erou nu e jucat de nimeni) termina singur, ca inainte.

A ramas regula veche: daca mai sunt oua pe jos, jocul mai lasa pana la 14 secunde de la deschiderea cuibului ca sa fie adunate.

**Unde:** `updatePlay` in `07-play.js` (blocul `P.nestOpen`), textul `ban.wait`, desenul in `drawWorld`.

**Test:** `tests/cuib-amandoi.js`.

---

## V3. Inamicii mici dispar dupa doua lovituri

**Cerinta:** "Dupa ce lovește de doua ori un inamic mic (cum sunt buburuzele sau conii de brad in bubu si Leo) acesta moare - dispare - pot apărea alții după."

**Ce s-a facut:**

- Gandacii si conurile (robotii, melcii si pasarile mari in al doilea joc) au `hp`. Fiecare lovitura scade unul (`hurtSmall`). La prima lovitura ametesc ca inainte. La a doua dispar intr-un norisor, cu sunetul `poof`.
- O lovitura = un tropait (sau o rotire de gheare), ori un sut. Un sut cu 8 mingi e o singura lovitura, oricate mingi ating inamicul (`kickHit`, `sweep`).
- Dupa prima lovitura apar deasupra inamicului doua inimioare mici, una stinsa (`drawSmallHp`). Asa copilul vede ca a mers.
- Dupa `respawn` secunde apare altul in acelasi loc. Un gandac nu reapare cat un erou sta la mai putin de 380 de unitati de locul lui. Un con nou porneste din capul cararii.
- Paznicii din mini-lupte si boss-ul nu sunt "mici": au inimile lor.

**Reglaj:** `CONFIG.smallEnemy.hits` (2) si `CONFIG.smallEnemy.respawn` (22 secunde).

**Unde:** `hurtSmall`, `powerSweep`, `stepFlyBall`, `updateEnemies` in `07-play.js`.

**Test:** `tests/inamici-mici.js`.

---

## V4. Eroul lovit asteapta sa fie ajutat de prieten, cu □

**Cerinta:** "Cand unul dintre jucatori este lovit de un inamic, nu poate înainta pana când celălalt jucător nu vine si îl salvează (apasă pe pătrat pe controller -> Boon tb sa vina aproape si îl vindeca cu mâinile iar Killer poate sta mai departe si ii da o minge magică)."

**Ce s-a facut, in ambele jocuri:**

- Un erou lovit ramane pe loc (`h.down`). Scapa un ou ca inainte. Nu poate merge, nu poate folosi puterea, nu aduna nimic. Nimic nu il mai poate lovi cat asteapta.
- Deasupra lui apare butonul □ si un punct in culoarea prietenului. In jurul lui pulseaza un inel punctat in aceeasi culoare. La fiecare 5 secunde striga dupa ajutor in limba lui (`help`).
- Prietenul primeste o sageata spre el, cu □ in bula (chiar daca are sageata ajutatoare oprita). Cand e destul de aproape, ii apare un □ mare deasupra capului.
- **Primul erou (Bubu, Boon) trebuie sa vina aproape**: la cel mult `reachNear` (180). Cercul in care trebuie sa intre e desenat pe jos. La □ il ridica pe loc, cu inimioare. Boon isi intinde bratul.
- **Al doilea erou (Leo, Killer) poate sta departe**: pana la `reachFar` (620). La □ trimite o minge magica, cu o inimioara, care zboara la prieten si il ridica.
- Daca apasa □ de prea departe, eroul spune "inca nu" in limba lui si nu se intampla nimic.
- Dupa ajutor eroul e ferit `safeAfter` (2.6) secunde, multumeste (`thanks`) si ambele controllere vibreaza scurt.
- In "Cea mai grea luptă" eroul lovit se face mic si creste la loc cand e ajutat.

**Cazuri gandite, ca nimeni sa nu ramana blocat:**

| Situatie | Ce se intampla |
|---|---|
| Joaca un singur copil | Regula veche: ameteste putin si se ridica singur. |
| Amandoi sunt loviti in acelasi timp | Dupa `bothDown` (3) secunde se ridica singuri amandoi. |
| Prietenul iese din joc (controller deconectat definitiv, erou nejucat) | Se ridica singur. |
| In mini-lupta | Lupta se odihneste cat un erou asteapta (vezi V8). |
| La boss | Nu se mai arunca nimic nou cat un erou asteapta. |

**Reglaj:** `CONFIG.rescue`. `enabled: false` aduce inapoi regula veche. `autoAfter` (0 = niciodata) poate ridica eroul singur dupa un numar de secunde, daca asteptarea se dovedeste prea lunga pentru copii.

**Butonul:** □ este butonul 2 al controllerului. Pe tastatura: E pentru primul jucator, Shift dreapta pentru al doilea. Se schimba din Setari, "Alege tastele" (randul "Ajută prietenul").

**Unde:** `hitHero`, `getUp`, `tryRescue`, `updateRescue` in `07-play.js`. `drawHeroFull`, `drawGuides`, `iconSq` pentru desen. `bP` in `04-input.js`.

**Test:** `tests/salvare-prieten.js`. `controller-simulat.js` apasa □ pe un controller fals.

**Regulile din `CLAUDE.md` schimbate:** regula 6 (eroul lovit asteapta prietenul) si regula 8 (□ = ajuta prietenul).

---

## V5. Al doilea joc are aceleasi caracteristici, dar altele

**Cerinta:** "acelasi număr de elemente - dar diferite, la fel de multe nivele de joc, dar diferite, sunete personaje dar diferite". Si raspunsurile: regulile de 30 de sunete si 10.000 de elemente se aplica si lui, 45 de minute si pentru el, "aceeasi mecanica, dar fa sa fie totusi cumva diferit".

| Caracteristica | Bubu și Leo | Cea mai grea luptă |
|---|---|---|
| Niveluri | 6 + boss | 6 + arena, toate altele |
| Obiecte in listele nivelurilor | 11.430 | 11.462 |
| Feluri de decor | 13 | 13, altele |
| Cuvinte pe erou | 33 | 33, altele (testul verifica: niciunul la fel) |
| Efecte sonore | 38 | 28 din ele inlocuite cu altele (`fx2`), 10 comune |
| Melodii | 11 | 11, alte game si instrumente |
| Mini-lupte | 2 pe nivel | 2 pe nivel, cu George |
| Durata tinta | `levelDuration` 360 s pe nivel | aceeasi |

"Cumva diferit": cristalele au sapte culori si un curcubeu complet da un bonus, pasarile te ridica, eroul lovit se face mic, ghearele lui Boon il apara. Vezi `21-cea-mai-grea-lupta.md`.

**Test:** `numara-elemente.js`, `sunete-personaje.js`, `joc-complet-bot.js`, `nivele-bot-mers.js`, `mini-lupte-bot.js`, toate cu `JOC=lupta`.

---

## V6. Sunetele personajelor nu se auzeau

**Cerinta:** "La bubu si leo nu se aud sunetele personajelor in console - repara bug-ul."

**Ce s-a gasit, masurat:** cuvintele eroilor erau de 10 pana la 15 ori mai incete decat efectele. Varful masurat la iesire, in versiunea veche: cuvintele lui Bubu 0.03 pana la 0.065, ale lui Leo 0.05 pana la 0.2. Tropaitul avea 0.9, muzica 0.17. Deci vocea lui Bubu era sub muzica. In plus Bubu vorbeste jos (nota de baza Sol 2, 98 Hz), iar difuzorul unui controller nu poate reda note atat de joase.

**Ce s-a facut:**

1. **Voci mai tari si mai pline** (`syl` in `03-audio.js`): doua unde triunghi (nota si octava ei) in loc de una, filtre de "gura" mai largi (Q 2.2 in loc de 4), putin din nota curata pe langa, castig 0.62 in loc de 0.3, inmultit pe erou (`VOICES`). Varful acum, masurat in acelasi loc: 0.36 pana la 1.1 pentru toti cei patru eroi.
2. **Difuzor mic** (`bus.small`, `smallUp`): cand sunetele unui erou merg intr-un difuzor ales din Setari care nu e al calculatorului, tot ce e sub 260 Hz urca o octava sau doua. Asa tropaitul si vocea lui Bubu se aud si in controller. Iesirea aceea are un filtru trece-sus la 200 Hz, o ridicare la 2400 Hz si un compresor.
3. **Un pas inainte** (`bus.lead`): pe a doua iesire audio fiecare sunet porneste cu 40 ms mai tarziu, ca sunetele scurte (pasi, suturi) sa nu inceapa intr-un bloc deja trimis.
4. **Difuzorul salvat e regasit** (`restoreSpeakers(true)`): Chrome uita permisiunea de microfon pentru o pagina deschisa din fisier. Fara ea nu spune numele difuzoarelor, deci difuzorul ales data trecuta nu mai era gasit si sunetele ramaneau in boxe fara niciun mesaj. Acum jocul cere din nou permisiunea, iar daca difuzorul tot lipseste, scrie pe ecranul de start: "Difuzorul ales pentru Bubu nu a fost găsit. Sunetele lui se aud în calculator."
5. **Alegere automata** (`findSpeakers`): dupa "Caută difuzorul controllerului", un difuzor care se numeste "controller" este ales pe loc (primul pentru primul erou, al doilea pentru al doilea). Stanga / dreapta il schimba.
6. **Limitator la iesire** (`toSpeaker`): cu vocile mai tari, mai multe sunete deodata treceau de limita boxelor (1.4 pana la 1.5, unde 1 e maximul) si s-ar fi auzit aspru. Un limitator inaintea oricarui difuzor tine totul sub 0.8. Vezi `06-sunet.md`.
7. **Proba** (`spk.test`): "Încearcă sunetul" spune "salut" in limba eroului si canta doua efecte, oriunde merg sunetele lui.

**Ce ramane adevarat:** browserul nu poate trimite sunet in controller decat daca macOS il arata ca difuzor. Pentru DualShock 4 asta se intampla doar cu cablu USB, nu prin Bluetooth. Fara cablu, sunetele personajelor se aud in boxele calculatorului (acum la volum normal).

**Test:** `tests/sunete-personaje.js` (fiecare cuvant se aude), `tests/sunete-controller.js` (cu doua iesiri audio false: fiecare efect si cuvant ajunge in difuzorul ales si nu in boxe), `tests/sunete-limita.js` (nimic nu trece de limita la iesire).

**Nu e verificat:** pe un DualShock 4 real. Vezi `19-limitari.md`.

---

## V7. George cel Rău, din ce in ce mai mare

**Cerinta:** "La “Cea mai grea lupta” in toate cele 6 levels + boss fight de la sfârșit apare George cel rău cu mai multe puteri si mai greu de învins. Mai mic inițial, din ce in ce mai mare."

Facut: vezi tabelul din `21-cea-mai-grea-lupta.md`. Marime 0.62 pe nivelul 1, 1.14 pe nivelul 6, 1.5 in arena. Un truc nou pe fiecare nivel. Inimi mai multe decat paznicii primului joc de la nivelul 2. In arena: 6 lovituri in loc de 5, urlet care impinge, sulite.

---

## V8. Ce s-a mai schimbat, ca regulile noi sa mearga bine

Nu au fost cerute cuvant cu cuvant. Au iesit din teste. Fiecare se poate opri din `CONFIG`.

| Schimbare | De ce | Reglaj |
|---|---|---|
| **Lupta se odihneste cat un erou asteapta ajutor.** Paznicul isi termina miscarea, nu mai loveste pe nimeni, nu incepe alt atac si se opreste obosit. Nu poate fi lovit cat doar asteapta (un paznic obosit poate fi lovit oricand). | Cu regula noua fiecare lovitura costa timp. Fara odihna, paznicul il lovea si pe cel care venea sa ajute. In teste unele lupte nu se mai terminau. | `duelWaiting()` in `075-duel.js` |
| **Mila.** Dupa fiecare erou lovit intr-o lupta, paznicul e putin mai incet, avertizeaza mai mult si sta obosit mai mult (pana la `mercyMax` lovituri). La fiecare 4 lovituri face un atac mai putin pe runda. De la `mercyMax` in sus orice lovitura pe el conteaza, ca pe Ușor. | O lupta nu trebuie sa dureze la nesfarsit pentru un copil care nu se fereste. Este in spiritul regulii "fara Game Over". | `CONFIG.duel.mercy` (0.06, 0 = oprit), `mercyMax` (10) |
| **Boss-ul nu arunca nimic nou cat un erou asteapta.** | La fel. | in `updateBoss` |
| **Lumina in jurul eroilor in jocul de noapte.** | Scena are 1700 de lucruri mici si multe culori. Eroii se pierdeau. | `drawHeroFull` |
| **Sageata spre prietenul lovit apare pentru orice jucator**, si daca are sageata ajutatoare oprita. | Altfel cel mare n-ar fi stiut unde e cel mic. | `drawGuides` |

---

## Intrebari ramase pentru proprietara

| Nr | Intrebare | Ce e facut acum |
|---|---|---|
| J1 | Cat de aproape trebuie sa vina Bubu / Boon? | 180 de unitati (cam trei latimi de erou). Cercul e desenat pe jos. |
| J2 | Asteptarea e prea lunga pentru cel mic daca fratele e departe? | Nu exista limita de timp (`autoAfter: 0`). Se poate pune, de exemplu, 20. |
| J3 | Ghearele lui Boon il apara cam doua treimi din timp daca apasa intruna. Prea usor? | E eroul celui de 6 ani. Se regleaza din `spinTime` si `stompCooldown`. |
| J4 | Killer are aceeasi putere ca Leo, doar ca arata altfel. Sa aiba ceva in plus? | Asa a fost cerut: "fix la fel". |
| J5 | Pasarile ridica eroul fara sa il loveasca. Sa il si loveasca? | Nu. "păsări care te ridica pe sus" a fost citit ca o incurcatura, nu ca o lovitura. |
| J6 | Din update-ul trecut au ramas: optiunea "Personajele vorbesc" in Setari, decor diferit pe fiecare nivel al primului joc. | Neschimbat. Vezi `19-limitari.md`. |
