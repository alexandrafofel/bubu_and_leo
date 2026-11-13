# 19. Limitari

Ce nu a putut fi verificat si ce se stie ca lipseste. Cine preia jocul porneste de aici cand ceva nu se poarta cum e descris.

## Nu a fost verificat pe hardware real

Tot jocul a fost facut si testat intr-un mediu Linux, cu Chrome fara fereastra. Nu a existat niciun Mac si niciun controller real.

| Ce | Ce s-a verificat | Ce ramane de verificat |
|---|---|---|
| Doua DualShock 4 pe macOS | Controllere false prin `navigator.getGamepads`, cu aceeasi asezare a butoanelor (`standard`). | Ca Chrome pe Mac raporteaza ambele controllere ca `standard`, cu ✕ pe butonul 0 si OPTIONS pe 9. |
| Vibratia | Ca jocul cere vibratia (`vibrationActuator.playEffect`) la momentele potrivite. | Ca DualShock 4 chiar vibreaza in Chrome pe Mac. Daca nu, pagina controllerului spune "Acest controller nu poate vibra în Chrome." |
| Sunetul in difuzorul controllerului | Ca alegerea difuzorului (`AudioContext.setSinkId`) porneste fara erori. | Daca Mac-ul vede DualShock 4 ca difuzor. Surse publice spun ca merge doar prin cablu USB, nu prin Bluetooth. |
| Vocea care citeste povestea | Ca jocul alege o voce `ro-RO` sau `en-*` daca exista. In mediul de test nu exista, deci apare "Fără voce în română". | Ca vocea Ioana (romana) exista pe Mac si se aude. Se adauga din Setari sistem, Accesibilitate, Continut vorbit. |
| Cum suna | Ca fiecare sunet porneste si varful nu depaseste 0.7. | Ca sunetele sunt placute, nu prea tari, nu prea incete. Nimeni nu le-a ascultat. |
| Viteza pe Mac | 10.9 ms pe cadru fara placa video. | Pe Mac ar trebui sa fie mult sub 16.7 ms. Daca sacadeaza: `maxRenderWidth` 1600 sau 1280. |
| Timpul de joc | Botii termina un nivel in 1 pana la 2 minute. | Cat dureaza pentru copii. Tinta este 6 minute pe nivel si aproximativ 45 de minute in total. |
| Textele in romana | Scrise de Claude, verificate pentru diacritice. | Citite de un vorbitor nativ, mai ales povestile nivelurilor si textele pentru copii. |

## Ce stii ca lipseste sau e imperfect

- Testele boss-ului si festivalului folosesc uneori scurtaturi (pozitii puse direct, stari fortate). Drumul complet a fost jucat de bot, dar nu in toate variantele (de exemplu un singur jucator pe Greu la boss).
- Ecranul complet nu poate fi pornit cu un buton de controller. Chrome cere o tasta sau un clic. Este o regula a browserului, nu se poate ocoli.
- Sunetul nu porneste pana la primul clic sau prima tasta. Tot o regula a browserului.
- Daca un controller se deconecteaza in timpul jocului, jocul se pune pe pauza si asteapta. Daca alt controller apasa ✕, il ia in locul celui pierdut.
- Salvarea este in browserul de pe acel Mac (`localStorage`). Alt browser sau alt calculator nu o vede. Stergerea datelor din Chrome o sterge.
- "Ecran complet: Da" in Setari arata starea reala a ecranului. Daca utilizatorul iese cu Esc, setarea devine "Nu".
- Documentatia descrie fiecare fisier, functie, valoare de reglaj, culoare, text, sunet si decizie. Nu are cate un rand de explicatie pentru fiecare linie de cod. Codul are comentarii la fiecare bloc si fiecare valoare neobisnuita.

## Cereri ambigue, asteptand confirmare

Vezi sectiunea "Intrebari deschise" din `20-update-urmator.md`.
