// Numara elementele fiecarui nivel: obiecte din L (liste) si celulele pictate. Folosit pentru cerinta "minim 10.000 de elemente".
const boot = require('./common.js');
(async () => {
  const { page, done } = await boot();
  const r = await page.evaluate(() => {
    const G = __game, out = [];
    for (let i = 0; i < chapters().length; i++) {      // toate capitolele: nivelurile 1 - 6, lupta mare, apoi nivelurile Partii a doua (T7.4: nivelul 7)
      const L = G.buildLevel(i), row = { nivel: i, liste: {} };
      for (const [k, v] of Object.entries(L)) if (Array.isArray(v) && v.length && typeof v[0] === 'object') row.liste[k] = v.length;
      row.obiecte = Object.values(row.liste).reduce((a, b) => a + b, 0);
      out.push(row);
    }
    return out;
  });
  let tot = 0; for (const x of r) { tot += x.obiecte; console.log(JSON.stringify(x)); }
  console.log('total obiecte in liste, toate nivelurile:', tot);
  console.log(tot >= 10000 ? 'peste 10.000: OK' : 'SUB 10.000: NEREUSIT');
  await done();
})();
