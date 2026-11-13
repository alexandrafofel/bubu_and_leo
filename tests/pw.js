/* Shared settings for every test script.
   PLAYWRIGHT  path of the playwright package (default: the normal require)
   CHROME      path of a Chrome or Chromium binary (default: the one Playwright installed)
   The game file is always ../game/bubu-si-leo-ouale-de-aur.html. Run ./build.sh first. */
const path = require('path');
let pw;
try { pw = require(process.env.PLAYWRIGHT || 'playwright'); } catch (e) { pw = require('./pw.js'); }
module.exports = {
  chromium: pw.chromium,
  chrome: process.env.CHROME || undefined,
  url: 'file://' + path.resolve(__dirname, '../game/bubu-si-leo-ouale-de-aur.html')
};
