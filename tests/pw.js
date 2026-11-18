/* Shared settings for every test script.
   PLAYWRIGHT  path of the playwright package (default: the normal require)
   CHROME      path of a Chrome or Chromium binary (default: the one Playwright installed)
   JOC         ignored: there is one game, lupta
   The game file is always ../game/bubu-si-leo-ouale-de-aur.html. Run ./build.sh first. */
const path = require('path');
let pw;
try { pw = require(process.env.PLAYWRIGHT || 'playwright'); } catch (e) { throw new Error('Playwright nu a fost gasit. Instaleaza-l (npm install playwright) sau pune calea lui in variabila PLAYWRIGHT.'); }
module.exports = {
  chromium: pw.chromium,
  chrome: process.env.CHROME || undefined,
  game: 'lupta',      // singurul joc (Bubu si Leo a fost scos pe 18 noiembrie 2026)
  url: 'file://' + path.resolve(__dirname, '../game/bubu-si-leo-ouale-de-aur.html')
};
