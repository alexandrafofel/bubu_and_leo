/* Shared settings for every test script.
   PLAYWRIGHT  path of the playwright package (default: the normal require)
   CHROME      path of a Chrome or Chromium binary (default: the one Playwright installed)
   JOC         which of the two games the test plays: bubu (default) or lupta
   The game file is always ../game/bubu-si-leo-ouale-de-aur.html. Run ./build.sh first. */
const path = require('path');
let pw;
try { pw = require(process.env.PLAYWRIGHT || 'playwright'); } catch (e) { throw new Error('Playwright nu a fost gasit. Instaleaza-l (npm install playwright) sau pune calea lui in variabila PLAYWRIGHT.'); }
module.exports = {
  chromium: pw.chromium,
  chrome: process.env.CHROME || undefined,
  game: process.env.JOC === 'lupta' ? 'lupta' : 'bubu',
  url: 'file://' + path.resolve(__dirname, '../game/bubu-si-leo-ouale-de-aur.html')
};
