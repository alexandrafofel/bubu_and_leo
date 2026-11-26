#!/usr/bin/env node
/* ==========================================================================
   Generates the reference annexes in docs/anexe/ straight from the code in src/.
   Run it after every change:   node tools/gen-docs.js
   The annexes are never edited by hand: they are always rebuilt from the code,
   so they cannot drift away from what the game really does.
     A-functii.md     every function, with file, line and the comment next to it
     B-culori.md      every color written in the code, how often and where
     C-texte.md       every text of the game, in Romanian and in English
     D-config.md      every CONFIG value as it is now
     E-sunete.md      every sound effect, its group (characters or world) and line
     F-harta-cod.md   every file split into its sections, with line ranges
     G-numere.md      counts: lines, functions, colors, texts, sounds
   ========================================================================== */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), SRC = path.join(ROOT, 'src'), OUT = path.join(ROOT, 'docs', 'anexe');
fs.mkdirSync(OUT, { recursive: true });
const ORDER = ['00-head.html', '01-config.js', '015-lang.js', '02-core.js', '03-audio.js', '04-input.js', '05-chars.js', '055-lupta.js', '06-level.js', '065-mech.js', '07-play.js', '075-duel.js', '08-draw.js', '09-screens.js', '10-main.js'];
const files = ORDER.map(f => ({ f, lines: fs.readFileSync(path.join(SRC, f), 'utf8').split('\n') }));
const md = s => String(s).replace(/\|/g, '\\|');
const HEAD = '<!-- GENERAT AUTOMAT de tools/gen-docs.js. Nu edita de mana: ruleaza din nou scriptul. -->\n\n';
const write = (name, body) => fs.writeFileSync(path.join(OUT, name), HEAD + body);

/* ---- A: functions ----------------------------------------------------------- */
function commentFor(lines, i) {
  const trail = lines[i].match(/\/\/\s*(.+)$/);
  if (trail && !/['"`]/.test(trail[1].slice(0, 1))) return trail[1].trim();
  const out = [];
  for (let j = i - 1; j >= 0 && j > i - 8; j--) {
    const l = lines[j].trim();
    if (l.startsWith('//')) { out.unshift(l.replace(/^\/\/\s?/, '')); continue; }
    if (l.endsWith('*/')) {
      let k = j; const block = [];
      while (k >= 0) { block.unshift(lines[k].trim()); if (lines[k].includes('/*')) break; k--; }
      const txt = block.join(' ').replace(/\/\*+|\*+\//g, '').replace(/={3,}/g, '').replace(/\s+/g, ' ').trim();
      if (txt) out.unshift(txt);
    }
    break;
  }
  return out.join(' ');
}
const fnRows = []; let fnCount = 0;
const RX = [
  { re: /^\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/, kind: 'functie' },
  { re: /^\s*(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/, kind: 'functie sageata' },
  { re: /^\s*(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*)\s*=>/, kind: 'functie sageata' },
  { re: /^\s{2,6}([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/, kind: 'metoda' },
  { re: /^\s*(Game\.[A-Za-z_$][\w$]*)\s*=\s*function\s*\(([^)]*)\)/, kind: 'functie' }
];
const SKIP = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'else']);
for (const { f, lines } of files) {
  if (!f.endsWith('.js')) continue;
  const rows = [];
  lines.forEach((l, i) => {
    for (const r of RX) {
      const m = l.match(r.re); if (!m || SKIP.has(m[1])) continue;
      rows.push('| ' + (i + 1) + ' | `' + md(m[1]) + '(' + md(m[2].trim()) + ')` | ' + r.kind + ' | ' + md(commentFor(lines, i)) + ' |');
      break;
    }
  });
  fnCount += rows.length;
  fnRows.push('\n## ' + f + '\n\n' + (rows.length ? '| Linia | Nume si parametri | Tip | Comentariul din cod |\n|---|---|---|---|\n' + rows.join('\n') : 'Nicio functie.') + '\n');
}
write('A-functii.md', '# Anexa A. Toate functiile\n\nFiecare functie, functie sageata si metoda din cod, in ordinea din fisier. Coloana "Comentariul din cod" este textul scris chiar langa functie. Explicatiile pe larg sunt in capitolele din docs/.\n\nTotal: ' + fnCount + ' intrari.\n' + fnRows.join(''));

/* ---- B: colors ----------------------------------------------------------------- */
const colors = new Map(); let rgbaCount = 0; const rgbaMap = new Map();
for (const { f, lines } of files) lines.forEach((l, i) => {
  for (const m of l.matchAll(/#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b(?![0-9A-Fa-f])/g)) {
    const c = m[0].toUpperCase(); if (!colors.has(c)) colors.set(c, []); colors.get(c).push(f + ':' + (i + 1));
  }
  for (const m of l.matchAll(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,/g)) {
    rgbaCount++; const c = m[0].replace(/\s/g, '').replace(/,$/, ')'); if (!rgbaMap.has(c)) rgbaMap.set(c, []); rgbaMap.get(c).push(f + ':' + (i + 1));
  }
});
const hsl = h => { const n = parseInt(h.slice(1), 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let hh = 0, s = 0; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); hh = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; } return [Math.round(hh), Math.round(s * 100), Math.round(l * 100)]; };
const famName = h => { const [hh, s, l] = hsl(h); if (s < 12) return l > 85 ? 'crem / aproape alb' : 'neutru cald'; if (hh < 15 || hh >= 345) return 'rosu / teracota'; if (hh < 40) return 'portocaliu / piersica'; if (hh < 65) return 'galben / miere / ocru'; if (hh < 160) return 'verde / salvie'; if (hh < 200) return 'turcoaz / apa'; if (hh < 255) return 'albastru'; if (hh < 300) return 'violet / mov'; return 'roz / pruna'; };
const cs = [...colors.entries()].sort((a, b) => hsl(a[0])[0] - hsl(b[0])[0] || hsl(a[0])[2] - hsl(b[0])[2]);
let bTxt = '# Anexa B. Toate culorile din cod\n\nFiecare culoare hex scrisa in cod, sortata dupa nuanta. "Unde" arata fisierul si linia. Semnificatia culorilor principale este explicata in docs/15-culori.md.\n\nCulori hex diferite: ' + colors.size + '. Culori rgba() scrise direct: ' + rgbaCount + ' aparitii, ' + rgbaMap.size + ' valori diferite.\n\n| Mostra | Hex | Familie | HSL | Aparitii | Unde |\n|---|---|---|---|---|---|\n';
for (const [c, w] of cs) { const h = hsl(c); bTxt += '| ![](https://placehold.co/24x24/' + c.slice(1) + '/' + c.slice(1) + '.png) | `' + c + '` | ' + famName(c) + ' | ' + h[0] + '°, ' + h[1] + '%, ' + h[2] + '% | ' + w.length + ' | ' + w.join(', ') + ' |\n'; }
bTxt += '\n## Culori rgba() scrise direct\n\nCelelalte culori transparente sunt facute cu functia `rgba(hex, alfa)` din culorile de mai sus.\n\n| Valoare | Aparitii | Unde |\n|---|---|---|\n';
for (const [c, w] of [...rgbaMap.entries()].sort((a, b) => b[1].length - a[1].length)) bTxt += '| `' + c + '` | ' + w.length + ' | ' + w.join(', ') + ' |\n';
write('B-culori.md', bTxt);

/* ---- C, D: texts and CONFIG (the two files are run in a tiny sandbox) ------------- */
const vm = require('vm');
const sb = { console, Math, Object, JSON, Array, String, Number };
vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(SRC, '01-config.js'), 'utf8').replace(/^'use strict';/, '') + '\n;this.CONFIG = CONFIG;', sb);
vm.runInContext(fs.readFileSync(path.join(SRC, '015-lang.js'), 'utf8') + '\n;this.STR = STR; this.Opt = Opt;', sb);
const STR = sb.STR, CONFIG = sb.CONFIG;
const strLine = {}; files.find(x => x.f === '015-lang.js').lines.forEach((l, i) => { for (const m of l.matchAll(/(?:'([\w.:]+)'|\b([a-zA-Z]\w*))\s*:/g)) { const k = m[1] || m[2]; if (!(k in strLine) && k in STR.ro) strLine[k] = i + 1; } });
let cTxt = '# Anexa C. Toate textele jocului\n\nTextele sunt in `STR` din src/015-lang.js. Cheia este numele folosit in cod: `T(\'cheie\')`. `{0}` si `{1}` sunt locuri completate de cod (un nume, un numar).\n\nTotal: ' + Object.keys(STR.ro).length + ' texte in romana si ' + Object.keys(STR.en).length + ' in engleza.\n\n| Cheie | Linia (ro) | Romana | Engleza |\n|---|---|---|---|\n';
for (const k of Object.keys(STR.ro)) cTxt += '| `' + md(k) + '` | ' + (strLine[k] || '') + ' | ' + md(STR.ro[k]) + ' | ' + md(STR.en[k] == null ? '(lipseste)' : STR.en[k]) + ' |\n';
write('C-texte.md', cTxt);
const flat = (o, p, out) => { for (const k in o) { const v = o[k], n = p ? p + '.' + k : k; if (v && typeof v === 'object' && (!Array.isArray(v) || v.some(x => x && typeof x === 'object'))) flat(v, n, out); else out.push([n, v]); } return out; };
const cfgLines = files.find(x => x.f === '01-config.js').lines;
let dTxt = '# Anexa D. Valorile din CONFIG\n\nValorile asa cum sunt acum in src/01-config.js. Explicatia fiecarei valori si motivul alegerii sunt in docs/03-config.md.\n\n| Cheie | Valoare | Comentariul din cod |\n|---|---|---|\n';
let cur = 0;
const pathKey = n => n.split('.').pop().replace(/^\d+$/, '');
for (const [n, v] of flat(CONFIG, '', [])) {
  const key = pathKey(n); let cm = '';
  if (key) { const i = cfgLines.findIndex((l, j) => j >= cur && new RegExp('\\b' + key + '\\s*:').test(l)); if (i >= 0) { cur = i; const m = cfgLines[i].match(/\/\/\s*(.+)$/); if (m) cm = m[1]; } }
  dTxt += '| `' + n + '` | `' + md(JSON.stringify(v)) + '` | ' + md(cm) + ' |\n';
}
write('D-config.md', dTxt);

/* ---- E: sounds -------------------------------------------------------------------- */
const au = files.find(x => x.f === '03-audio.js').lines, chrLine = au.find(l => /const CHR = /.test(l)) || '';
const CHR = new Set((chrLine.match(/(\w+): 1/g) || []).map(s => s.split(':')[0]));
const start = au.findIndex(l => /const fx = \{/.test(l)), end = au.findIndex((l, i) => i > start && /^\s*\};/.test(l));
let eTxt = '# Anexa E. Toate efectele sonore\n\nEfectele sunt in obiectul `fx` din src/03-audio.js. Se cer cu `Snd.play(\'nume\', valoare, erou)`. Grupul decide volumul care le controleaza: "personaje" = Sunete personaje (pot merge si in difuzorul controllerului), "lume" = Sunete ambientale.\n\n| Linia | Nume | Grup | Comentariul din cod | Cod |\n|---|---|---|---|---|\n';
let nfx = 0;
for (let i = start + 1; i < end; i++) {
  const m = au[i].match(/^\s{4}(\w+)\s*\(([^)]*)\)\s*\{/); if (!m) continue; nfx++;
  const c = (au[i].match(/\/\/\s*(.+)$/) || [])[1] || '';
  eTxt += '| ' + (i + 1) + ' | `' + m[1] + '` | ' + (CHR.has(m[1]) ? 'personaje' : 'lume') + ' | ' + md(c) + ' | `' + md(au[i].trim().slice(0, 160)) + (au[i].trim().length > 160 ? ' ...' : '') + '` |\n';
}
// the second game: the effects in fx2 take the place of the ones with the same name while "Cea mai grea luptă" is played
const start2 = au.findIndex(l => /const fx2 = \{/.test(l)), end2 = au.findIndex((l, i) => i > start2 && /^\s*\};/.test(l));
let e2 = '', nfx2 = 0;
if (start2 >= 0) for (let i = start2 + 1; i < end2; i++) {
  const m = au[i].match(/^\s{4}(\w+)\s*\(([^)]*)\)\s*\{/); if (!m) continue; nfx2++;
  const c = (au[i].match(/\/\/\s*(.+)$/) || [])[1] || '';
  e2 += '| ' + (i + 1) + ' | `' + m[1] + '` | ' + (CHR.has(m[1]) ? 'personaje' : 'lume') + ' | ' + md(c) + ' | `' + md(au[i].trim().slice(0, 160)) + (au[i].trim().length > 160 ? ' ...' : '') + '` |\n';
}
if (nfx2) eTxt += '\n## Al doilea joc: `fx2`\n\nCat se joaca "Cea mai grea luptă", efectele de mai jos iau locul celor cu acelasi nume din `fx`. Un nume care nu e in `fx` exista doar in al doilea joc.\n\nTotal: ' + nfx2 + ' efecte.\n\n| Linia | Nume | Grup | Comentariul din cod | Cod |\n|---|---|---|---|---|\n' + e2;
write('E-sunete.md', eTxt.replace('| Linia | Nume', 'Total: ' + nfx + ' efecte.\n\n| Linia | Nume'));

/* ---- F: map of every file, section by section ---------------------------------------- */
let fTxt = '# Anexa F. Harta codului, sectiune cu sectiune\n\nFiecare fisier este impartit in sectiuni. O sectiune incepe la un comentariu-titlu (`// ---- ... ----`, `/* ---- ... ---- */` sau un bloc `/* ... */`) si tine pana la urmatoarea. Asa fiecare linie de cod are un loc numit, iar capitolul din docs/ cu acelasi nume o explica.\n';
for (const { f, lines } of files) {
  const secs = [];
  lines.forEach((l, i) => {
    const t = l.trim();
    let m = t.match(/^\/\/\s*-{2,}\s*(.+?)\s*-*$/) || t.match(/^\/\*\s*-{2,}\s*(.+?)\s*-*\s*\*\/$/) || t.match(/^\/\*\s*(?!=)(.+?)\s*\*\/$/);
    if (!m && /^\/\*\s*=+$/.test(t) && lines[i + 1]) m = [0, lines[i + 1].trim()];
    if (m && m[1].length > 3) secs.push({ i, name: m[1].replace(/\*\/$/, '').trim() });
  });
  fTxt += '\n## ' + f + ' (' + lines.length + ' linii)\n\n| Liniile | Sectiunea |\n|---|---|\n';
  if (!secs.length) fTxt += '| 1-' + lines.length + ' | tot fisierul |\n';
  secs.forEach((s, j) => { const e = j + 1 < secs.length ? secs[j + 1].i : lines.length; fTxt += '| ' + (s.i + 1) + '-' + e + ' | ' + md(s.name) + ' |\n'; });
}
write('F-harta-cod.md', fTxt);

/* ---- G: numbers ------------------------------------------------------------------------ */
const totalLines = files.reduce((a, x) => a + x.lines.length, 0);
write('G-numere.md', '# Anexa G. Numere\n\n| Ce | Cate |\n|---|---|\n| Fisiere sursa | ' + files.length + ' |\n| Linii de cod | ' + totalLines + ' |\n| Functii si metode | ' + fnCount + ' |\n| Culori hex diferite | ' + colors.size + ' |\n| Texte (romana) | ' + Object.keys(STR.ro).length + ' |\n| Texte (engleza) | ' + Object.keys(STR.en).length + ' |\n| Efecte sonore | ' + nfx + ' |\n| Valori in CONFIG | ' + flat(CONFIG, '', []).length + ' |\n\n## Linii pe fisier\n\n| Fisier | Linii |\n|---|---|\n' + files.map(x => '| ' + x.f + ' | ' + x.lines.length + ' |').join('\n') + '\n');
console.log('annexes written:', fnCount, 'functions,', colors.size, 'colors,', Object.keys(STR.ro).length, 'texts,', nfx, 'sounds,', totalLines, 'lines');
