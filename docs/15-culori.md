# 15. Culori

> **Din 18 noiembrie 2026 exista un singur joc: "Cea mai grea luptă".** "Bubu și Leo" a fost scos (vezi `16-decizii.md`, "Un singur joc"). Orice schimbare se face doar in "Cea mai grea luptă". Ce scrie mai jos despre primul joc, despre alegerea jocului sau despre "ambele jocuri" este istoric.

Cererea: "Warm palette: ochre, peach, terracotta, honey yellow, sage green, dusty pink. Shadows in warm violet or brown, never gray or black."

Codul are aproximativ 300 de culori hex diferite. Toate, cu fiecare loc unde apar, sunt in [anexa B](anexe/B-culori.md). Aici sunt regulile si culorile care conteaza.

## Regulile paletei

1. **Fara negru, fara gri.** Cel mai inchis ton din joc este violetul `#4A3C68` (umbra lui Ciori) si violetul-maro `#3F2A3A` (ochii inchisi ai gandacului). Pupilele sunt `#4B2E33`, maro-violet.
2. **Umbrele sunt violet cald.** `SHADOW = #6A4270`, folosit transparent (20% pana la 30%) pentru toate umbrele de pe pamant.
3. **Intunecarea merge spre violet, luminarea spre crem.** `shade()` amesteca spre `#5A3550` sau spre `#FFF6E0`. Orice culoare noua trecuta prin `shade` ramane calda.
4. **Albul este crem.** `#FFF6E2` este "albul" cardurilor, `#FFF6E0` al luminilor, hartia are `255, 249, 236`.
5. **Saturatie moderata.** Culorile sunt ca de acuarela: destul de vii pentru copii, dar niciuna "neon".
6. **Fiecare jucator are culoarea lui**, folosita peste tot unde e vorba de el: inel, card, insigna, sageata, punctul de pe bara de progres.
7. **Rosul inseamna "atentie".** Zonele de atac, cercurile unde cad conurile si "!" sunt `#D9463C`. Este acelasi rosu ca esarfa si bentita, dar transparent si pulsand.
8. **Verdele inseamna "in siguranta".** Adapostul din cuib este verde `#7FB06A` / `#BFE3A8`.
9. **Auriul inseamna "de luat" sau "facut".** Ouale, bara de progres facuta, medaliile, semnele atinse.

## Culorile jucatorilor

| Culoare | Hex | Unde | De ce |
|---|---|---|---|
| Portocaliu Bubu | `#F08A3C` | corp, inel, card, insigna, sageata | Cerut. Portocaliu cald, nu rosu. |
| Verde pete | `#6FA35E` | petele lui Bubu | Salvie, mai stins decat verdele frunzelor. |
| Galben Leo | `#F6C63C` | tricou, inel, insigna, sageata | Cerut. Galben miere. |
| Albastru Leo | `#3F78C8` | sort, al doilea inel, cercul de incarcare | Cerut. Singurul albastru saturat din joc, ca Leo sa se vada imediat. |
| Rosu accesorii | `#D9463C` | esarfa, bentita, zone de atac | Leaga personajele intre ele. |

## Interfata

| Culoare | Hex | Unde |
|---|---|---|
| Crem card | `#FFF6E2` | Carduri mari, bule, halouri |
| Crem HUD | `#FFF3DC` | Cardurile HUD si insignele |
| Selectie | `#F8C24E` | Randul ales in meniuri, partea facuta a barei, sageata aurie de indiciu |
| Titluri | `#C4573D` | Titluri, "Acum!", volumele pline, sagetile din meniuri |
| Subtitlu | `#B9802E` | "Ouăle de Aur", numele nivelului |
| Text | `#7A4A52`, `#6A4250` | Textul normal |
| Text sters | `#8A6A6A`, `#9A7A7A` | Indicii, text secundar |
| Bifa | `#5E8A4E` | "Controller detectat ✓", "Conectat!" |
| Numarul de oua | `#B9702E` | Contoarele |
| ✕ | `#6D8FD0` | Iconita butonului ✕ |
| Fundalul paginii | `#4a3540` | In jurul canvas-ului cand fereastra nu are proportia 16:9 |

## Obiecte

| Obiect | Culori |
|---|---|
| Oul de aur | `#FFF6C4` → `#F8CC4E` → `#E3952F`, halou `rgba(255,226,130,...)` |
| Steaua | `#FFFDF0` → `#FFE7A0`, contur `#F4B08E`, halou roz. Alta culoare decat oul, ca sa se vada ca e rara. |
| Mingea | crem `#FFFBEE` / `#EAD9BE` cu pete `#C4573D` |
| Ciori | pruna `#5F4E80`, `#8474A4`, `#4A3C68`, burta `#9A8AB8`, cioc `#F0A040` |
| Gandac | `#BE665C` (gradient `#D98A72` / `#9A4F58`), pete `#FBE3BA`, cap `#7A4B60` |
| Con | `#9C6A46`, solzi crem, varf `#7A4E38` |
| Fluture | `#F2913C`, `#F6B25A`, `#FFE2A6` |
| Cuib | `#B98858`, `#8E6244`, `#D9B27A`, paie `#E8CC96`, `#A87850` |
| Moara | turn `#F3E4C6` / `#FBF1DA`, acoperis `#C96F4E`, pale crem cu dungi teracota |
| Felinar | stalp `#8A5A48`, lumina `#E9A07A` / `#FFE9B0` |
| Capita | `#E9C56C`, `#C99A50`, `#FFF0B8` |
| Noroi | `#7E5A4C`, `#A07A5C`, `#B08A68`, lumini `#DCC0A0` |
| Apa | `#82B5AE`, `#9CCBC0`, luciri `#CDE8DA` |
| Pod | scanduri `#C99A6A` / `#B98858`, balustrada `#8E6244` |
| Faleza | `#CDAF98` → `#93747E` |
| Particule petale | `#F4B6B0`, `#FBE3BA`, `#F3D36B`, `#E7A6A1` (`PETALS`) |
| Particule frunze | `#8FAF6A`, `#B9C77A`, `#E2A04F`, `#C96F4E` (`LEAVES`) |

## Paletele nivelurilor (`PALS`)

Fiecare nivel are o atmosfera proprie, dar toate raman in aceeasi familie calda.

| Nivel | Pamant (g0 / g1) | Coroane | Drum | Atmosfera |
|---|---|---|---|---|
| meadow | `#CBD08F` / `#B4C283` | `#8FAF6A` `#A3BC72` `#7E9F63` `#B9C77A` | `#EBCB9E` | Verde-galbui, luminos, dupa-amiaza |
| forest | `#AEBB80` / `#94A974` | `#6F9160` `#84A066` `#5F8459` `#9DB06C` `#7A9A72` | `#DCC090` | Cel mai verde si mai umbros. Copaci mari. |
| river | `#C6C389` / `#B3B57D` | `#93AD6E` `#A9B878` `#829D66` | `#E5C597` | Ocru, nisip, mal |
| hill | `#D9C985` / `#C8BE7C` | `#A7B56B` `#BFBF73` `#96A965` | `#F0D3A3` | Iarba uscata, auriu, vant |
| fall | `#B6C18C` / `#A2B382` | `#7E9F6B` `#96AE74` `#6E9068` `#A6B67A` | `#E0C295` | Verde racoros langa apa |
| sunset | `#D6B87E` / `#C5A674` | `#D98A52` `#E2A04F` `#C96F4E` `#E6B65A` `#B98A5A` | `#EECFA2` | Toamna la apus: coroane portocalii |

Florile folosesc roz prafuit `#E7A6A1`, galben `#F3D36B`, crem `#FBF3DE`, piersica `#E58F6B`.

## Cerul si lumina

Cerul trece de la albastru-verzui palid (`#A9CFD0`) la violet de amurg (`#5A4C7C`) pe parcursul jocului (tabelul complet in `05-pictura.md`). Lumina de deasupra fiecarui nivel (`overlay`) trece de la crem `#FFF4E0` la piersica `#FFC08C`. Umbrele se lungesc. Asa copiii simt ca se apropie apusul fara sa li se spuna.

## Paznicii

| Paznic | Culori principale |
|---|---|
| Regele Gândac | ca gandacul, coroana `#F8C24E`, piatra `#D9463C` |
| Bufnița Buhu | `#A07E5C`, `#8A6A4E`, piept `#E8D2A8`, ochi in `#F4E6C8`, cioc `#F0A040` |
| Racul Cleștișor | `#E0705A`, `#F29A80`, `#B4503C` |
| Vârtejel | `#C9D6E8`, `#AFC0DA`, alb transparent |
| Broscoiul Oac | `#8DB866`, `#B4D684`, `#6E9A52`, burta `#EEF2C0` |
| Ciorel | `#4F7387`, `#3B596B`, `#86AEBE`, `#A9C7D2` |
| Inimi | pline `#E2574C`, goale violet transparent |

## Update 14 noiembrie 2026: culorile celui de-al doilea joc

Regula ramane: fara negru, fara gri. Noaptea din jungla e indigo si violet.

| Culoare | Unde |
|---|---|
| `#2FBFA8` turcoaz, `#B7D645` verde-lime | Boon: corpul si cupola; picioarele si coada. Culoarea lui pe ecran e turcoazul. |
| `#3B6FE0` albastru, `#E4583C` rosu | Killer: tricoul si sortul; ghetele. Culoarea lui pe ecran e albastrul. |
| roz, cu cap in rosu, portocaliu, galben, albastru | George cel Rău, ca in desenul copiilor. Cornul-coroana are dungi rosii si galbene. |
| `RAINBOW` (sapte culori) | Cristalele, morisca totemurilor, bonusul "Curcubeu!". |
| `#C6BAEA` lila deschis | Piatra tronului lui George. |
| `#E45AA0` roz | Eticheta "Joc inventat de copii" si butonul □. |

Paletele de noapte ale fiecarui nivel sunt in `LEVEL_DEFS_L` (`06-level.js`). Toate culorile din cod, cu locurile lor, sunt in anexa B.
