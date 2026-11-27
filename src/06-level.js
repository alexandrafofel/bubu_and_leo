
/* ==========================================================================
   LEVELS: definitions, generator (with a reachability check so every egg can
   be collected) and the hand-painted backgrounds, pre-rendered once per level.
   ========================================================================== */
const LEVEL_DEFS = [
  { key: 'meadow', music: 'l0', pal: 'meadow', icons: ['egg', 'bubu', 'leo'],
    trees: 30, rocks: 5, hay: 8, beetles: [0, 0, 0], lanes: [0, 1, 1], conesPerLane: 1, coneSpeed: 0.75, mud: [0, 0, 0], sparkle: [0, 1, 1],
    pond: true, stars: ['islet', 'nook', 'treetop'] },
  { key: 'forest', music: 'l1', pal: 'forest', icons: ['beetle', 'tree', 'egg'],
    trees: 105, rocks: 8, bigTrees: true, beetles: [2, 4, 5], lanes: [0, 0, 1], conesPerLane: 1, mud: [0, 0, 0], sparkle: [2, 3, 3],
    stars: ['guarded', 'treetop', 'nook'] },
  { key: 'river', music: 'l2', pal: 'river', icons: ['mud', 'cone', 'egg'],
    trees: 40, rocks: 10, beetles: [1, 1, 2], lanes: [1, 1, 2], conesPerLane: 1, mud: [3, 5, 4], sparkle: [1, 1, 2], river: 'v',
    stars: ['guarded', 'islet', 'treetop'] },
  { key: 'hill', music: 'l3', pal: 'hill', icons: ['wind', 'mill', 'egg'],
    trees: 18, rocks: 20, mills: 4, beetles: [1, 2, 3], lanes: [1, 1, 2], conesPerLane: 1, mud: [0, 1, 1], sparkle: [1, 1, 2], wind: 1,
    stars: ['nook', 'guarded', 'treetop'] },
  { key: 'fall', music: 'l4', pal: 'fall', icons: ['fall', 'star', 'egg'],
    trees: 46, rocks: 12, beetles: [2, 2, 3], lanes: [1, 1, 2], conesPerLane: 1, mud: [1, 2, 2], sparkle: [1, 1, 2], cliff: true, river: 'fall',
    stars: ['guarded', 'islet', 'nook'], pathY: [1100, 1420] },
  { key: 'sunset', music: 'l5', pal: 'sunset', icons: ['lantern', 'butterfly', 'egg'],
    trees: 50, rocks: 10, beetles: [2, 3, 4], lanes: [1, 2, 2], conesPerLane: 2, mud: [1, 2, 2], sparkle: [2, 2, 2], wind: 0.5, lanterns: true, pond: true,
    stars: ['treetop', 'guarded', 'islet'] }
];
const BOSS_DEF = { key: 'boss', music: 'boss', icons: ['bubu', 'ciori', 'leo'], };
/* The six levels of the second game, "Cea mai grea luptă": the jungle at night, in rainbow colors.
   The same building blocks as above, with other things in them:
   beetles = George's robots, lanes = sticky snails, mud = slime / quicksand / tangled vines (slowKind),
   pond + pit = a deep pit, mills = totems with a rainbow pinwheel, lanterns = torches, cliff + door = the hideout behind the vines,
   birds = big birds that carry a hero a little way. */
const LEVEL_DEFS_L = [
  { key: 'glade', music: 'l0', pal: 'glade', night: true, icons: ['egg', 'boon', 'killer'],
    trees: 30, rocks: 6, hay: 8, beetles: [0, 0, 0], lanes: [0, 1, 1], conesPerLane: 1, coneSpeed: 0.5, mud: [0, 0, 0], sparkle: [0, 1, 1],
    pond: true, pit: true, stars: ['islet', 'nook', 'treetop'] },
  { key: 'robots', music: 'l1', pal: 'robots', night: true, icons: ['robot', 'tree', 'egg'],
    trees: 100, rocks: 8, bigTrees: true, beetles: [2, 4, 5], lanes: [0, 0, 1], conesPerLane: 1, coneSpeed: 0.55, mud: [0, 0, 0], sparkle: [2, 3, 3],
    stars: ['guarded', 'treetop', 'nook'] },
  { key: 'snails', music: 'l2', pal: 'snails', night: true, icons: ['mud', 'cone', 'egg'],
    trees: 40, rocks: 10, beetles: [1, 1, 2], lanes: [1, 2, 2], conesPerLane: 1, coneSpeed: 0.55, mud: [3, 5, 4], slowKind: 'slime', sparkle: [1, 1, 2], river: 'v',
    stars: ['guarded', 'islet', 'treetop'] },
  { key: 'ridge', music: 'l3', pal: 'ridge', night: true, icons: ['wind', 'bird', 'mud'],
    trees: 18, rocks: 20, mills: 4, beetles: [1, 2, 3], lanes: [1, 1, 1], conesPerLane: 1, coneSpeed: 0.55, mud: [1, 2, 2], slowKind: 'sand', slow: 0.32, sparkle: [1, 1, 2], wind: 1, birds: 2,
    stars: ['nook', 'guarded', 'treetop'] },
  { key: 'vines', music: 'l4', pal: 'vines', night: true, icons: ['vine', 'door', 'star'],
    trees: 46, rocks: 12, beetles: [2, 2, 3], lanes: [1, 1, 2], conesPerLane: 1, coneSpeed: 0.55, mud: [1, 2, 2], slowKind: 'vines', sparkle: [1, 1, 2], cliff: true, river: 'fall', door: true,
    stars: ['guarded', 'islet', 'nook'], pathY: [1100, 1420] },
  { key: 'road', music: 'l5', pal: 'road', night: true, icons: ['lantern', 'butterfly', 'egg'],
    trees: 50, rocks: 10, beetles: [2, 3, 4], lanes: [1, 2, 2], conesPerLane: 2, coneSpeed: 0.55, mud: [1, 2, 2], slowKind: 'sand', slow: 0.32, sparkle: [2, 2, 2], wind: 0.5, lanterns: true, pond: true, pit: true, birds: 1,
    stars: ['treetop', 'guarded', 'islet'] },
  // Part Two (docs/25-niveluri-7-12.md, 4). Level 7: two chasms cut the map; plates open the bridges of light (T7.4)
  { key: 'canyon', music: 'l5', pal: 'canyon', look: 'diorama', ambient: '#FFE9D6', icons: ['plate', 'bridge', 'star'],
    trees: 22, rocks: 26, beetles: [0, 1, 2], lanes: [0, 0, 1], conesPerLane: 1, coneSpeed: 0.55, mud: [0, 0, 0], sparkle: [1, 1, 2], wind: 0.7, birds: 2,
    bands: [{ at: 0.335, kind: 'chasm', w: 200, mech: 'plates1' }, { at: 0.665, kind: 'chasm', w: 200, mech: 'plates2' }],
    stars: ['islet', 'nook', 'treetop'], toy: 'seesaw', cage: true },
  // Level 8: George's workshop. Targets in two colors on a tin wall, conveyor belts, rolling gears, many robots (T8)
  { key: 'works', music: 'l4', pal: 'works', look: 'diorama', ambient: '#C8C0F0', icons: ['target', 'robot', 'gear'],
    trees: 14, rocks: 30, beetles: [3, 5, 6], lanes: [1, 1, 2], conesPerLane: 1, coneSpeed: 0.7, roller: 'gear', mud: [2, 3, 3], slowKind: 'belt', sparkle: [1, 2, 2], lanterns: true,
    bands: [{ at: 0.335, kind: 'wall', w: 120, mech: 'targets1' }, { at: 0.665, kind: 'wall', w: 120, mech: 'targets2' }],
    stars: ['guarded', 'treetop', 'nook'], toy: 'button' },
  { key: 'lake', music: 'l2', pal: 'lake', night: true, look: 'diorama', ambient: '#9AA8F0', icons: ['raft', 'crank', 'egg'],
    trees: 34, rocks: 10, beetles: [1, 2, 2], lanes: [1, 1, 1], conesPerLane: 1, coneSpeed: 0.5, mud: [1, 1, 2], slowKind: 'slime', sparkle: [1, 2, 2],
    bands: [{ at: 0.335, kind: 'water', w: 400, mech: 'raft1' }, { at: 0.665, kind: 'water', w: 480, mech: 'raft2' }],
    stars: ['islet', 'nook', 'guarded'], toy: 'lilies' }
];
const BOSS_DEF_L = { key: 'arena', music: 'boss', night: true, icons: ['boon', 'ciori', 'killer'] };

/* The tin wall of level 8 (T8): riveted panels with seams, a lit top edge and a violet shadow on its right side. The sliding door is drawn every frame (drawDoor). */
function paintWall(c, L, P, r) {
  const W = P.wall || ['#7A86B0', '#A8B4D8', '#E6ECFF', '#4A5278'];
  for (const g of L.gates) {
    if (g.kind !== 'wall') continue;
    const poly = (k, off) => { c.beginPath(); for (let y = L.top - 20; y <= L.H + 40; y += 20) c.lineTo(bandX(g, y) - g.half * k + (off || 0), y); for (let y = L.H + 40; y >= L.top - 20; y -= 20) c.lineTo(bandX(g, y) + g.half * k + (off || 0), y); c.closePath(); };
    c.fillStyle = rgba(SHADOW, 0.28); poly(1, 22); c.fill();                   // the shadow it throws to the right
    c.fillStyle = W[3]; poly(1.06); c.fill();
    c.fillStyle = W[0]; poly(1); c.fill();
    c.fillStyle = rgba(W[1], 0.7); poly(0.62); c.fill();
    for (let y = L.top; y < L.H + 40; y += 90) {                                // seams between the sheets, and rivets on both edges
      const mx = bandX(g, y);
      c.strokeStyle = rgba(W[3], 0.55); c.lineWidth = 3; c.beginPath(); c.moveTo(mx - g.half, y); c.lineTo(mx + g.half, y); c.stroke();
      c.fillStyle = W[2]; for (const sd of [-1, 1]) for (const dy of [14, 76]) { c.beginPath(); c.arc(mx + sd * (g.half - 12), y + dy, 4.5, 0, TAU); c.fill(); }
    }
    for (const sd of [-1, 1]) { const pts = []; for (let y = L.top - 20; y <= L.H + 40; y += 30) pts.push([bandX(g, y) + sd * (g.half - 4), y]); brushLine(c, pts, 7, W[2], 0.7, 31 + sd); }
  }
}
const PALS = {
  meadow: { g0: '#CBD08F', g1: '#B4C283', tints: ['#E6D58A', '#A9BF7E', '#DCC47C', '#C7D39A', '#EBCB9C', '#B9CC8A'], canopy: ['#8FAF6A', '#A3BC72', '#7E9F63', '#B9C77A'], flowers: ['#E7A6A1', '#F3D36B', '#FBF3DE', '#E58F6B'], path: '#EBCB9E', trunk: '#9A6B4C', rock: '#C8AE98' },
  forest: { g0: '#AEBB80', g1: '#94A974', tints: ['#7F9B66', '#B9BF7F', '#8CA36B', '#C9B97A', '#9DAE78'], canopy: ['#6F9160', '#84A066', '#5F8459', '#9DB06C', '#7A9A72'], flowers: ['#F3D36B', '#E7A6A1', '#FBF3DE'], path: '#DCC090', trunk: '#8A6048', rock: '#B9A092' },
  river:  { g0: '#C6C389', g1: '#B3B57D', tints: ['#D8B987', '#A9B97F', '#C9A979', '#BFC98E'], canopy: ['#93AD6E', '#A9B878', '#829D66'], flowers: ['#FBF3DE', '#E7A6A1', '#F3D36B'], path: '#E5C597', trunk: '#96684A', rock: '#C2A994' },
  hill:   { g0: '#D9C985', g1: '#C8BE7C', tints: ['#E8CE86', '#BFC480', '#E5B97C', '#D9D08E', '#EBD59A'], canopy: ['#A7B56B', '#BFBF73', '#96A965'], flowers: ['#E58F6B', '#F3D36B', '#FBF3DE', '#E7A6A1'], path: '#F0D3A3', trunk: '#9A6B4C', rock: '#CDB39A' },
  fall:   { g0: '#B6C18C', g1: '#A2B382', tints: ['#C8C08A', '#93AE84', '#D2B48A', '#A9BC8E'], canopy: ['#7E9F6B', '#96AE74', '#6E9068', '#A6B67A'], flowers: ['#FBF3DE', '#E7A6A1', '#F3D36B'], path: '#E0C295', trunk: '#8A6048', rock: '#BFA090' },
  // the second game: the jungle at night. Deep blue and violet ground, plants and paths that glow.
  glade:  { night: true, g0: '#4A4A92', g1: '#3B3C7C', tints: RAINBOW, canopy: ['#2F9A84', '#3FB094', '#4A78C8', '#8A62C0', '#2F8AB0'], flowers: ['#FF8AB8', '#FFD84A', '#7AF0C8', '#B09AFF', '#FF9A5A'], path: '#8D8ACC', trunk: '#6A4A82', rock: '#9490D0' },
  robots: { night: true, g0: '#2F6274', g1: '#285262', tints: RAINBOW, canopy: ['#7A58B8', '#5A6FC8', '#2F9A8A', '#A060B8', '#3F88B8'], flowers: ['#7AF0C8', '#FFD84A', '#FF8AB8', '#9AD8FF'], path: '#7AA6B8', trunk: '#5A4A7A', rock: '#8AA0C8' },
  snails: { night: true, g0: '#4E4484', g1: '#40386E', tints: RAINBOW, canopy: ['#2F9A84', '#58B078', '#3F7AB8', '#7A62B8'], flowers: ['#B7F0A0', '#FF8AB8', '#FFD84A', '#9AD8FF'], path: '#9088C4', trunk: '#6A4A82', rock: '#8E8AC8' },
  ridge:  { night: true, g0: '#44578E', g1: '#394A7C', tints: RAINBOW, canopy: ['#3F9AA8', '#5A82C8', '#8A6AC0', '#38A08A'], flowers: ['#FFD84A', '#FF9A5A', '#FF8AB8', '#B09AFF'], path: '#93A0D0', trunk: '#5E4E86', rock: '#98A2D4' },
  vines:  { night: true, g0: '#2F6066', g1: '#275258', tints: RAINBOW, canopy: ['#2F9A6A', '#48B078', '#2F8A8A', '#6AB86A', '#3F7A9A'], flowers: ['#FF8AB8', '#FFD84A', '#B09AFF', '#7AF0C8'], path: '#7FB0A8', trunk: '#4E5A6A', rock: '#84A8B8' },
  road:   { night: true, g0: '#5C417C', g1: '#4C366C', tints: RAINBOW, canopy: ['#B0589A', '#8A58B8', '#D8704A', '#5A6FC8', '#C8508A'], flowers: ['#FFD84A', '#FF9A5A', '#FF8AB8', '#7AF0C8'], path: '#A88AC4', trunk: '#5E3E6E', rock: '#A088C0' },
  canyon: { g0: '#E8B48A', g1: '#D99A78', tints: ['#EEBE92', '#DCA27E', '#F2C8A0', '#E2AA86'], canopy: ['#6FB08A', '#8AC07A', '#4F9A8A', '#B8C86A'], flowers: ['#FF8AB8', '#FFD84A', '#FFF6E8', '#B09AFF'], path: '#F6D9B0', trunk: '#8A5A6A', rock: '#C98A7A',
            chasm: ['#3A4A8A', '#6A7AC0', '#D8DCF6'] },      // level 7: a high plateau at sunrise. chasm: the bottom of the chasm, its light middle, the mist
  lake:   { night: true, g0: '#3F6A8A', g1: '#34587A', tints: RAINBOW, canopy: ['#3FB08A', '#5AC08A', '#2F8AA8', '#7AC8A0'], flowers: ['#FFB0D8', '#FFFFFF', '#FFD84A', '#B09AFF'], path: '#8AB0C8', trunk: '#4E5A7A', rock: '#7A98B8', water: ['#1E3A78', '#2A4A8A', '#4A78C0', '#CFE6FF'] },
  works:  { night: true, g0: '#5A6A8A', g1: '#4A587A', tints: RAINBOW, canopy: ['#C8A040', '#D86A4A', '#5AA0A8', '#8A7AC0'], flowers: ['#FFD84A', '#7AF0C8', '#FF8AB8'], path: '#A8B0C8', trunk: '#6A5A7A', rock: '#8A98B8',
            wall: ['#7A86B0', '#A8B4D8', '#E6ECFF', '#4A5278'] },      // level 8: tin and violet, never grey. wall: the tin of the walls, its light, its shine, its shadow
  sunset: { g0: '#D6B87E', g1: '#C5A674', tints: ['#E4A771', '#DB9C79', '#CBB47C', '#E2BB8C', '#D8A07A'], canopy: ['#D98A52', '#E2A04F', '#C96F4E', '#E6B65A', '#B98A5A'], flowers: ['#F3D36B', '#E58F6B', '#FBF3DE'], path: '#EECFA2', trunk: '#8A5A48', rock: '#C4A08E' }
};
/* The calm look of the Krea maps (CONFIG.look.art and CONFIG.look.calm): every level has its own ground color, a clean cream path,
   and its things (trees, rocks, flowers) are Krea pictures (ART). These values are laid over PALS when the level is made (palOf).
   tree: the pictures of the trees; spark: the glowing tree that hides crystals; rock, bush, flowers: the small things. */
const PALS_ART = {
  glade:  { g0: '#8E86D0', g1: '#807AC4', tints: ['#9890D6', '#8680C8', '#A29ADA'], path: '#EEE8F4', lane: '#F2A8D8', canopy: ['#4E5AA0', '#5A66AE', '#6A74B8'], flowers: ['#FFE58A', '#FFB0D0', '#C8B8FF'],
            tree: ['l1_tree1', 'l1_tree2'], spark: 'l1_spark', rock: 'l1_rock', bush: 'l1_bush', flowers2: 'l1_flowers', band: '#6E6AA6' },
  robots: { g0: '#5C6E3E', g1: '#4F6236', tints: ['#667846', '#56683A', '#6E8050'], path: '#EAE4C2', lane: '#F2B4D6', canopy: ['#3F6A3A', '#4E7A42', '#5A8A4A'], flowers: ['#FFE6B0', '#FFF4D8', '#FFD0A0'],
            tree: ['l2_tree1', 'l2_tree2'], spark: 'l2_spark', rock: 'l2_rock', bush: 'l2_bush', flowers2: 'l2_flowers', band: '#3E5030' },
  snails: { g0: '#EEC888', g1: '#E6BA76', tints: ['#F2D096', '#E4B472', '#EAC284'], path: '#FBF0DA', lane: '#F4A8D2', canopy: ['#6FA058', '#5E9050', '#7EAE62'], flowers: ['#C8A8F0', '#FFF4D8', '#F4A8C8'],
            tree: ['l3_tree1', 'l3_tree2'], spark: 'l3_spark', rock: 'l3_rock', bush: 'l3_tree2', flowers2: 'l3_spark', band: '#C99A62',
            water: ['#5A7FC0', '#7EA6E4', '#A6C6F2', '#E8F2FF'] },
  ridge:  { g0: '#D8BEBA', g1: '#CCB0AE', tints: ['#E0C8C2', '#C8A8A8', '#D6BAB2'], path: '#F6ECE2', lane: '#F2A8D2', canopy: ['#B99AA4', '#A88C98', '#C8AAB0'], flowers: ['#FFE9A8', '#FFF6DC', '#F6C8D8'],
            tree: ['l4_tree1', 'l4_tree2'], spark: 'l4_spark', rock: 'l4_rock', bush: 'l4_bush', flowers2: 'l4_spark', band: '#B4969C' },
  vines:  { g0: '#8E7C48', g1: '#80703E', tints: ['#98864F', '#84743E', '#9C8C5A'], path: '#EADCB4', lane: '#F2B0D4', canopy: ['#4E8A44', '#5E9A4E', '#6AA858'], flowers: ['#F6B8D0', '#FFF0D0', '#FFE08A'],
            tree: ['l5_tree1', 'l5_tree2'], spark: 'l5_spark', rock: 'l5_rock', bush: 'l5_bush', flowers2: 'l5_spark', band: '#6A5A34',
            water: ['#4A6EA8', '#6A92D0', '#94B8EA', '#E4F0FF'], cliff: ['#B08058', '#8A6040', '#9E7050', '#BC9068', '#7A5236', '#A87C58', '#6A4630', '#D8B088', '#5E4030'] },
  road:   { g0: '#6E4A62', g1: '#603E56', tints: ['#76526A', '#66445C', '#7E5A72'], path: '#E8DCCB', lane: '#E8A0CC', canopy: ['#3E5A3E', '#4A6648', '#567254'], flowers: ['#FFE070', '#FFF0B0', '#FFC860'],
            tree: ['l6_tree1', 'l6_tree2'], spark: 'l6_spark', rock: 'l6_rock', bush: 'l6_bush', flowers2: 'l6_spark', band: '#4A3046',
            water: ['#3E3A78', '#5A5AA8', '#8A8AD0', '#D8D8FF'] },
  canyon: { g0: '#E8B48A', g1: '#DCA47E', tints: ['#EEBE92', '#E0AA84', '#F2C8A0'], path: '#FBEBD2', lane: '#F4A8C8', canopy: ['#5FA090', '#6FB08A', '#8AC0A0'], flowers: ['#FF9AC0', '#FFE58A', '#C8B8FF'],
            tree: ['l7_tree1', 'l7_tree2'], spark: 'l7_spark', rock: 'l7_rock', bush: 'l7_bush', flowers2: 'l7_flowers', band: '#F2B6A0' }
};
/* The palette of a level: PALS, with the calm Krea colors over it when the new look is on. */
function palOf(def) { const base = PALS[def.pal], a = artOn() && CONFIG.look.calm && PALS_ART[def.pal]; return a ? Object.assign({}, base, a, { art: true }) : base; }
const HERO_R = 27;                       // collision radius of the heroes
const levelCount = id => clamp(((id || GAME) === 'lupta' ? CONFIG.lupta.levels : CONFIG.levels) | 0, 1, 12);
const levelDefs = () => isLupta() ? LEVEL_DEFS_L : LEVEL_DEFS;
const levelDef = idx => levelDefs()[idx % levelDefs().length];
/* What the slow ground looks like: mud in the first game; slime, quicksand or tangled vines in the second. [dark rim, body, light, blotch 1, blotch 2, shine] */
const SLOW_COLS = { mud: ['#7E5A4C', '#A07A5C', '#B08A68', '#8A6452', '#B8926E', '#DCC0A0'], slime: ['#3F8A62', '#6FD08A', '#A8EC98', '#58BF7A', '#B7F0A0', '#EEFFD8'],
  sand: ['#8A7AA0', '#D6C592', '#E8DAAC', '#C8B486', '#EADCA8', '#FFF6D8'], belt: ['#5A4A8A', '#7A6AB0', '#9A8AD0', '#6A5AA0', '#8A7AC0', '#E6DCFF'], vines: ['#1F5A4A', '#2F7A5A', '#4E9A6A', '#2A6A52', '#62B07A', '#B7E6B0'] };
// the sky goes from afternoon to dusk over the levels. In the second game it is always counted over 6 levels: Part Two has its own colors
const skyTOf = idx => { const n = isLupta() ? 6 : levelCount(); return n === 1 ? 0.4 : Math.min(idx, n - 1) / (n - 1) * 0.95; };

/* The chapters of a game, in order: every level and every big fight. This is what "Continue", the Chapters screen and the
   save count in. Game.levelIdx is the index of a chapter; L.idx is still the number of the level (0-based) inside it.
     first game:  levels 1 - 6, then the fight with Ciori                         (7 chapters)
     second game: levels 1 - 6, George's Arena, then the levels of Part Two       (7 chapters now, 14 when Part Two is made)
   The Throne Hall, the last fight of Part Two, is added after the Part Two levels when it exists (task T11). */
function chapters(id) {
  const g = id || GAME, lv = (def, n, part) => ({ kind: 'level', n, def, part });
  if (g !== 'lupta') return [...Array.from({ length: levelCount(g) }, (_, n) => lv(LEVEL_DEFS[n % LEVEL_DEFS.length], n, 1)), { kind: 'boss', def: BOSS_DEF, part: 1 }];
  const n = levelCount(g), first = Math.min(n, 6), list = [];
  for (let i = 0; i < first; i++) list.push(lv(LEVEL_DEFS_L[i % LEVEL_DEFS_L.length], i, 1));
  for (let i = 6; i < n; i++) list.push(lv(LEVEL_DEFS_L[i % LEVEL_DEFS_L.length], i, 2));
  // the big fight is always the last chapter (since 27 November 2026): after Part Two when it has levels, else after level 6
  list.push({ kind: 'boss', def: BOSS_DEF_L, part: n > 6 ? 2 : 1 });
  return list;
}
/* A name for a chapter that does not change when chapters are added or moved: 'L0'... for the levels, 'boss' for the big fight.
   The save keeps the order of these names (sl.order), so the results find their chapter again (remapSave, 09-screens.js). */
const chapterId = ch => ch.kind === 'boss' ? 'boss' : 'L' + ch.n;
/* The order of the second game before 27 November 2026: six levels, the big fight, then the levels of Part Two. */
function oldChapterOrder(n) { const o = []; for (let i = 0; i < Math.min(n, 6); i++) o.push('L' + i); o.push('boss'); for (let i = 6; i < n; i++) o.push('L' + i); return o; }
// how a chapter is named in "Continue: ...": "Level 3", or the name of the big fight
function chapterLabel(i, id) {
  const ch = chapters(id)[i]; if (!ch) return '';
  return ch.kind === 'boss' ? TG(id || GAME, 'lvl.' + ch.def.key + '.name') : TG(id || GAME, 't.level', ch.n + 1);
}
// how many levels (not fights) come before chapter i: used for "stars found / stars there are"
const levelsBefore = (i, id) => chapters(id).slice(0, i).filter(ch => ch.kind === 'level').length;

function spline(pts, stepLen) {          // Catmull-Rom through points, resampled evenly
  const raw = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < 24; k++) {
      const t = k / 24, t2 = t * t, t3 = t2 * t;
      raw.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
                0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
    }
  }
  raw.push(pts[pts.length - 1]);
  const out = [raw[0]]; let acc = 0;
  for (let i = 1; i < raw.length; i++) {
    acc += dist(raw[i][0], raw[i][1], raw[i - 1][0], raw[i - 1][1]);
    if (acc >= stepLen) { out.push(raw[i]); acc = 0; }
  }
  out.push(raw[raw.length - 1]);
  return out;
}

/* The quota of level idx (0-based), or 0 when the quota is off or the numbers do not fit (then the old rule is used: 60 eggs, no quota).
   The numbers fit when the map has at least 2q diamonds to give: fewer and the level cannot be finished. There is no upper limit (T15). */
let _quotaBad = false;
function quotaOf(idx) {
  const Qc = CONFIG.quota;
  if (!Qc || !Qc.on) return 0;
  const q = Qc.perLevel && Qc.perLevel[idx];
  if (!(q > 0) || !(Qc.extra >= 2)) {
    if (!_quotaBad) { _quotaBad = true; console.error('CONFIG.quota: extra must be at least 2, and perLevel needs a value for every level'); }
    return 0;
  }
  return q;
}
/* How long a level lasts (seconds): the sun, the medal and the help in updatePlay read this, not CONFIG.levelDuration. */
function levelDurationOf(L) {
  const E = L && L.totalEggs || 0;
  return Math.max(CONFIG.levelDuration, L && L.q ? E / CONFIG.eggsPerMinute * 60 : 0);
}
for (let i = 0; i < CONFIG.levels; i++) quotaOf(i);      // a wrong CONFIG.quota is reported once, when the game starts
function genLevel(idx, seed) {
  const def = levelDef(idx), r = rng(seed), WW = 3200, WH = 1800, cols = WW / CS, rows = WH / CS;
  const NW = clamp(CONFIG.wavesPerLevel | 0, 1, 5);
  const top = def.cliff ? 520 : 280;
  const L = { idx, def, seed, night: !!def.night, W: WW, H: WH, cols, rows, top, skyH: def.cliff ? 160 : 280, pal: palOf(def), skyT: skyTOf(idx),
    grid: new Uint8Array(cols * rows), flag: new Uint8Array(cols * rows), solids: [], trees: [], dynTrees: [], beetles: [], lanes: [], cones: [],
    bridges: [], stones: [], mills: [], lanterns: [], stars: [], waves: [], waterCells: [], sprites: [],
    spawn: { x: 240, y: 1080 }, nest: { x: 2950, y: 1040 }, NW, minZoom: 0.6 };
  const G = L.grid, F = L.flag;       // F bits: 1 no trees, 2 no eggs, 4 cave, 8 bridge, 16 lane
  const inW = (cx, cy) => cx >= 0 && cy >= 0 && cx < cols && cy < rows;
  const ci = (x, y) => clamp(y / CS | 0, 0, rows - 1) * cols + clamp(x / CS | 0, 0, cols - 1);
  const mark = (x, y, rad, bits) => {
    for (let cy = (y - rad) / CS | 0; cy <= (y + rad) / CS; cy++) for (let cx = (x - rad) / CS | 0; cx <= (x + rad) / CS; cx++)
      if (inW(cx, cy) && dist((cx + 0.5) * CS, (cy + 0.5) * CS, x, y) <= rad + 20) F[cy * cols + cx] |= bits;
  };
  const region = k => [k * WW / NW, (k + 1) * WW / NW];
  const dv = (arr, k) => arr[Math.min(arr.length - 1, Math.floor(k * arr.length / NW))];
  const starRegion = i => Math.min(NW - 1, Math.floor(i * NW / 3));
  for (let cy = 0; cy < top / CS; cy++) for (let cx = 0; cx < cols; cx++) G[cy * cols + cx] = 3;

  // ---- the path from the start to the nest ----------------------------------
  const py = def.pathY || [740, 1380];
  let wps;
  if (def.river) {
    const Y = lerp(py[0] + 60, py[1] - 60, r());
    wps = [[L.spawn.x, L.spawn.y], [720 + r() * 120, lerp(py[0], py[1], r())], [1230, Y], [1970, Y], [2480 + r() * 120, lerp(py[0], py[1], r())], [L.nest.x, L.nest.y]];
    L.bridgeY = Y;
  } else {
    wps = [[L.spawn.x, L.spawn.y]];
    for (let i = 1; i <= 4; i++) wps.push([L.spawn.x + (L.nest.x - L.spawn.x) * i / 5 + (r() - 0.5) * 160, lerp(py[0], py[1], r())]);
    wps.push([L.nest.x, L.nest.y]);
  }
  L.path = spline(wps, 26);
  const pathDist = (x, y) => { let m = 1e9; for (let i = 0; i < L.path.length; i += 3) { const d = dist(x, y, L.path[i][0], L.path[i][1]); if (d < m) m = d; } return m; };
  for (const p of L.path) mark(p[0], p[1], 78, 1);
  mark(L.spawn.x, L.spawn.y, 210, 3); mark(L.nest.x, L.nest.y, 200, 3);

  // ---- water ----------------------------------------------------------------
  const setWater = (cx, cy) => { if (inW(cx, cy) && G[cy * cols + cx] === 0) G[cy * cols + cx] = 2; };
  if (def.cliff) {
    for (let cy = 6; cy <= 10; cy++) for (let cx = 36; cx <= 43; cx++) { G[cy * cols + cx] = 0; F[cy * cols + cx] |= 7; }
    for (let cy = 11; cy <= 12; cy++) for (let cx = 39; cx <= 41; cx++) { G[cy * cols + cx] = 0; F[cy * cols + cx] |= 7; }
    for (let cy = 13; cy <= 15; cy++) for (let cx = 0; cx < cols; cx++) F[cy * cols + cx] |= 1;
    for (let cy = 16; cy < 24; cy++) for (let cx = 0; cx < cols; cx++) {
      const nx = ((cx + 0.5) * CS - 1620) / 330, ny = ((cy + 0.5) * CS - 790) / 132;
      if (nx * nx + ny * ny < 1) setWater(cx, cy);
    }
    if (def.door) L.vines = { x: 1620, w: 290, y0: 150, y1: 520 };    // second game: a curtain of vines hides the door to the hideout
    else L.fall = { x: 1620, w: 250, y0: 160, y1: 668 };
    L.cave = { x0: 1440, y0: 240, x1: 1760, y1: 520, reveal: 0, egg: { x: 1600, y: 335 } };
    L.cover = { x: 1400, y: 215, w: 400, h: 310 };
  }
  if (def.river) {
    const ph = r() * 6, ph2 = r() * 6;
    L.riverX = def.river === 'fall' ? (y => 1620 + 150 * Math.sin((y - 840) / 270)) : (y => 1600 + 180 * Math.sin(y / 310 + ph) + 50 * Math.sin(y / 120 + ph2));
    const y0 = def.river === 'fall' ? 840 : top;
    for (let cy = y0 / CS | 0; cy < rows; cy++) {
      const yc = (cy + 0.5) * CS, rx = L.riverX(yc);
      for (let cx = 0; cx < cols; cx++) if (Math.abs((cx + 0.5) * CS - rx) < 78) setWater(cx, cy);
    }
    const crossing = (by, list) => {
      const row0 = Math.round((by - 60) / CS), yc = (row0 + 1.5) * CS, bx = L.riverX(yc);
      for (let cy = row0; cy < row0 + 3; cy++) for (let cx = (bx - 160) / CS | 0; cx <= (bx + 160) / CS; cx++)
        if (inW(cx, cy)) { const i = cy * cols + cx; if (G[i] === 2) G[i] = 0; F[i] |= 9; }
      list.push({ x: bx, y: yc, w: 320, h: 120 });
      return yc;
    };
    L.crossY = [crossing(L.bridgeY, L.bridges)];
    for (const y of [top + 190, WH - 200]) if (Math.abs(y - L.bridgeY) > 330 && !(def.river === 'fall' && y < 900)) L.crossY.push(crossing(y, L.stones));
  }

  // ---- bands (T7, levels 7 - 12): a chasm, water, lava or a wall from the top to the bottom --------------------------
  // One crossing each, where the path meets the band. While the level is made the crossings are open (reach is checked
  // with every gate open); startPlay closes them (closeGates, 065-mech.js). docs/25-niveluri-7-12.md, 3.1
  L.gates = []; L.inputs = [];
  (def.bands || []).forEach((b, bi) => {
    const code = b.kind === 'wall' ? 3 : 2, g = { band: bi, at: b.at, W: WW, ph: r() * 6, half: b.w / 2, kind: b.kind, mech: b.mech, code, cells: [], inputs: [] };
    for (let cy = top / CS | 0; cy < rows; cy++) {
      const mx = bandX(g, (cy + 0.5) * CS);
      for (let cx = 0; cx < cols; cx++) if (Math.abs((cx + 0.5) * CS - mx) < g.half) { const i = cy * cols + cx; if (G[i] < 2) G[i] = code; F[i] |= b.kind === 'chasm' ? 65 : 1; }   // 64: a chasm (T7.4), not water
    }
    let p = L.path[0];
    for (const q of L.path) if (Math.abs(q[0] - bandX(g, q[1])) < Math.abs(p[0] - bandX(g, p[1]))) p = q;
    const row0 = clamp(Math.round((p[1] - 60) / CS), (top / CS | 0) + 3, rows - 6), yc = (row0 + 1.5) * CS, mx = bandX(g, yc);
    for (let cy = row0; cy < row0 + 3; cy++) for (let cx = (mx - g.half - 60) / CS | 0; cx <= (mx + g.half + 60) / CS; cx++) {
      if (!inW(cx, cy)) continue;
      const i = cy * cols + cx; if (G[i] === code) { G[i] = 0; g.cells.push(i); } F[i] |= 1 | 2 | 8 | 32;   // 32: a gate. No eggs, trees or decor on it
    }
    Object.assign(g, { kindGate: code === 3 ? 'door' : 'bridge', x: mx, y: yc, w: b.w + 120, h: 3 * CS, state: 'closed', open: 0, stayT: 0, step: 0, idleT: 0 });
    L.gates.push(g);
  });

  const pathFar = (x, y, d) => pathDist(x, y) >= d;
  const areaClear = (x, y, rad) => {
    for (let cy = (y - rad) / CS | 0; cy <= (y + rad) / CS; cy++) for (let cx = (x - rad) / CS | 0; cx <= (x + rad) / CS; cx++) {
      if (!inW(cx, cy)) return false;
      if (G[cy * cols + cx] !== 0 || (F[cy * cols + cx] & 31)) return false;
    }
    return true;
  };
  const addSolid = (x, y, rad, kind, extra) => { const s = Object.assign({ x, y, r: rad, kind, seed: r() * 1000 }, extra || {}); L.solids.push(s); return s; };
  const mudEllipse = (x, y, rx, ry) => {
    for (let cy = (y - ry) / CS | 0; cy <= (y + ry) / CS; cy++) for (let cx = (x - rx) / CS | 0; cx <= (x + rx) / CS; cx++) {
      if (!inW(cx, cy)) continue;
      const i = cy * cols + cx, nx = ((cx + 0.5) * CS - x) / rx, ny = ((cy + 0.5) * CS - y) / ry;
      if (nx * nx + ny * ny < 1 + (hash(x, cx * 7 + cy) - 0.5) * 0.35 && G[i] === 0 && !(F[i] & 14)) G[i] = 1;
    }
  };

  // T8: a conveyor belt is a strip 3 cells wide and 10 - 16 long. It carries a hero 140 units per second, up or down (L.beltDir: 1 = down, -1 = up)
  L.belts = []; L.beltDir = new Int8Array(cols * rows);
  const beltStrip = (x, y) => {
    const cx0 = (x / CS | 0) - 1, len = 10 + (r() * 7 | 0), cy0 = clamp((y / CS | 0) - (len >> 1), (top / CS | 0) + 2, rows - len - 2), dir = r() < 0.5 ? -1 : 1;
    for (let cy = cy0; cy < cy0 + len; cy++) for (let d = 0; d < 3; d++) { const cx = cx0 + d; if (!inW(cx, cy)) return false; const i = cy * cols + cx; if (G[i] !== 0 || (F[i] & 30)) return false; }
    for (let cy = cy0; cy < cy0 + len; cy++) for (let d = 0; d < 3; d++) { const i = cy * cols + cx0 + d; G[i] = 1; L.beltDir[i] = dir; }
    L.belts.push({ x: (cx0 + 1.5) * CS, y0: cy0 * CS, y1: (cy0 + len) * CS, dir }); return true;
  };

  // ---- bonus stars: one per third of the map --------------------------------
  const kinds = def.stars.slice(0, clamp(CONFIG.starsPerLevel | 0, 0, 3));
  let guardSpots = [];
  for (let si = 0; si < kinds.length; si++) {
    const k = starRegion(si), [x0, x1] = region(k); let kind = kinds[si], done = false;
    if (kind === 'islet') {
      if (def.cliff) { L.stars.push({ x: 1620, y: 800, kind }); done = true; }
      else if (def.river) {
        for (let t = 0; t < 60 && !done; t++) {
          const y = top + 220 + r() * (WH - top - 440);
          if (L.crossY.every(cy => Math.abs(cy - y) > 250)) { L.stars.push({ x: L.riverX(y), y, kind }); done = true; }
        }
      } else if (def.pond) {
        for (let t = 0; t < 120 && !done; t++) {
          const rx = 190, ry = 130, x = lerp(x0 + rx + 70, x1 - rx - 70, r()), y = lerp(top + ry + 100, WH - ry - 100, r());
          if (!pathFar(x, y, rx + 150) || dist(x, y, L.spawn.x, L.spawn.y) < 460 || dist(x, y, L.nest.x, L.nest.y) < 460) continue;
          for (let cy = (y - ry) / CS | 0; cy <= (y + ry) / CS; cy++) for (let cx = (x - rx) / CS | 0; cx <= (x + rx) / CS; cx++) {
            const nx = ((cx + 0.5) * CS - x) / rx, ny = ((cy + 0.5) * CS - y) / ry;
            if (nx * nx + ny * ny < 1) setWater(cx, cy);
          }
          mark(x, y, rx + 50, 1);
          L.stars.push({ x, y, kind }); done = true;
        }
      }
      else if (L.gates.length) {              // T7.4: a stone pillar in the first chasm, far from the crossing. The star is taken with a thrown thing
        const g = L.gates[0];
        for (let t = 0; t < 80 && !done; t++) {
          const y = top + 260 + r() * (WH - top - 480);
          if (Math.abs(y - g.y) < 380) continue;
          if (L.solids.some(o => dist(o.x, o.y, bandLeft(g, y) - 55, y) < o.r + 90 || dist(o.x, o.y, bandRight(g, y) + 55, y) < o.r + 90 || dist(o.x, o.y, bandX(g, y), y) < o.r + 40)) continue;     // a hero must be able to stand at the edge and throw (nothing in the way)
          L.stars.push({ x: bandX(g, y), y, kind, pillar: true }); done = true;
        }
      }
      if (!done) kind = 'guarded';
    }
    if (kind === 'nook') {
      for (let t = 0; t < 120 && !done; t++) {
        const x = lerp(x0 + 250, x1 - 250, r()), y = r() < 0.5 ? top + 250 + r() * 90 : WH - 260 - r() * 70;
        if (!pathFar(x, y, 330) || !areaClear(x, y, 215)) continue;
        const gap = r() * TAU, n = 7, span = TAU - 1.6;
        for (let i = 0; i < n; i++) { const a = gap + 0.8 + i * span / (n - 1); addSolid(x + Math.cos(a) * 150, y + Math.sin(a) * 150, 44, 'rock'); }
        mark(x, y, 240, 3);
        L.stars.push({ x, y, kind, check: true });
        if (idx > 0) guardSpots.push({ x: x + 50, y: y - 20, n: 1, rad: 0 });
        done = true;
      }
      if (!done) kind = 'guarded';
    }
    if (kind === 'guarded') {
      for (let t = 0; t < 200 && !done; t++) {
        const x = lerp(x0 + 180, x1 - 180, r()), y = lerp(top + 200, WH - 200, r());
        if (!pathFar(x, y, 260) || !areaClear(x, y, 150) || dist(x, y, L.spawn.x, L.spawn.y) < 420) continue;
        mark(x, y, 170, 1);
        if (def.mud.some(m => m > 0)) mudEllipse(x, y, 160, 120);
        L.stars.push({ x, y, kind, check: true });
        guardSpots.push({ x, y, n: idx >= 1 ? (idx >= 3 ? 3 : 2) : 0, rad: 125 });
        done = true;
      }
    }
    if (kind === 'treetop') L.stars.push({ x: 0, y: 0, kind, hidden: true, region: k });
  }

  // ---- the toy of the level (T7.4): a seesaw from a fallen trunk. Two heroes at its ends make it rock; it gives nothing ----
  if (def.toy === 'seesaw' && L.gates.length >= 2) {
    const xa = L.gates[0].at * WW + 260, xb = L.gates[1].at * WW - 260;
    for (let t = 0; t < 300 && !L.toy; t++) {
      const x = lerp(xa, xb, r()), y = lerp(top + 220, WH - 220, r());
      if (!pathFar(x, y, 210) || pathDist(x, y) > 520 || !areaClear(x, y, 170)) continue;
      L.toy = { kind: 'seesaw', x, y, ang: 0, va: 0, laughT: 0 }; mark(x, y, 190, 3);
    }
  }
  // ---- the toy of level 8 (T8): a big red button. Pressed, every robot on the screen dances for 5 seconds (once in 30 seconds) ----
  if (def.toy === 'button' && L.gates.length >= 2) {
    const xa = L.gates[0].at * WW + 260, xb = L.gates[1].at * WW - 260;
    for (let t = 0; t < 300 && !L.toy; t++) {
      const x = lerp(xa, xb, r()), y = lerp(top + 220, WH - 220, r());
      if (!pathFar(x, y, 160) || pathDist(x, y) > 480 || !areaClear(x, y, 100)) continue;
      L.toy = { kind: 'button', x, y, danceT: 0, cool: 0, down: 0 }; mark(x, y, 120, 3);
    }
  }
  // ---- the toy of level 9 (T8): three giant lily pads on a bank. Whoever steps on one jumps high (only how it looks) with a "boing" ----
  if (def.toy === 'lilies' && L.gates.length >= 1) {
    const xa = 300, xb = L.gates[0].at * WW - 330, pads = [];
    for (let t = 0; t < 400 && pads.length < 3; t++) {
      const x = lerp(xa, xb, r()), y = lerp(top + 220, WH - 220, r());
      if (!pathFar(x, y, 130) || pathDist(x, y) > 560 || !areaClear(x, y, 80) || pads.some(q => dist(q.x, q.y, x, y) < 250)) continue;
      pads.push({ x, y, down: 0, jump: 0, cool: 0 }); mark(x, y, 100, 3);
    }
    if (pads.length) L.toy = { kind: 'lilies', pads, x: pads[0].x, y: pads[0].y };
  }
  // ---- mud, pinecone lanes, windmills ---------------------------------------
  for (let k = 0; k < NW; k++) {
    const [x0, x1] = region(k);
    for (let m = 0, t = 0; m < dv(def.mud, k) && t < 80; t++) {
      const x = lerp(x0 + 100, x1 - 100, r()), y = lerp(top + 150, WH - 150, r());
      if (dist(x, y, L.spawn.x, L.spawn.y) < 330 || dist(x, y, L.nest.x, L.nest.y) < 300) continue;
      if (def.slowKind === 'belt') { if (beltStrip(x, y)) m++; continue; }
      mudEllipse(x, y, 110 + r() * 80, 80 + r() * 60); m++;
    }
    for (let m = 0, t = 0; m < dv(def.lanes, k) && t < 120; t++) {
      const cx = lerp(x0 + 90, x1 - 90, r()) / CS | 0, x = (cx + 0.5) * CS;
      if (Math.abs(x - L.spawn.x) < 300 || Math.abs(x - L.nest.x) < 300 || L.lanes.some(l => Math.abs(l.x - x) < 240)) continue;
      let ok = true;
      for (let cy = (top / CS | 0) + 1; cy < rows && ok; cy++) for (let d = -1; d <= 1; d++) { const i = cy * cols + cx + d; if (G[i] > 1 || (F[i] & 14)) ok = false; }
      if (!ok) continue;
      for (let cy = top / CS | 0; cy < rows; cy++) for (let d = -1; d <= 1; d++) F[cy * cols + cx + d] |= 17;
      const lane = { x, y0: top + 70, y1: WH - 40 }; L.lanes.push(lane);
      const n = def.conesPerLane || 1;
      for (let j = 0; j < n; j++) L.cones.push({ lane, x, y: lerp(lane.y0, lane.y1, (j + r() * 0.6) / n), rot: 0, state: 'roll', t: 0, r: 26, seed: r() * 100 });
      m++;
    }
  }
  for (let m = 0, t = 0; m < (def.mills || 0) && t < 200; t++) {
    const x = WW * (0.15 + 0.23 * m) + (r() - 0.5) * 220, y = lerp(top + 330, WH - 330, r());
    if (!pathFar(x, y, 240) || !areaClear(x, y, 110)) continue;
    const s = addSolid(x, y, 56, 'mill'); mark(x, y, 150, 1);
    L.mills.push({ x, y, ang: r() * TAU, solid: s }); m++;
  }

  // ---- trees, rocks, haystacks ----------------------------------------------
  const spotFree = (x, y, rad) => {
    for (let a = -1; a < 8; a++) {
      const px = a < 0 ? x : x + Math.cos(a / 8 * TAU) * rad, py2 = a < 0 ? y : y + Math.sin(a / 8 * TAU) * rad;
      if (px < 30 || py2 < top + 20 || px > WW - 30 || py2 > WH - 30) return false;
      const i = ci(px, py2); if (G[i] !== 0 || (F[i] & 1)) return false;
    }
    return true;
  };
  const scatter = (count, rmin, rmax, kind, gap) => {
    for (let t = 0, placed = 0; t < count * 50 && placed < count; t++) {
      const R = lerp(rmin, rmax, r()), x = 70 + r() * (WW - 140), y = top + 50 + R + r() * (WH - top - 150 - R);
      const cx = x, cy = kind === 'tree' ? y + R * 0.15 : y, cr = kind === 'tree' ? R * 0.75 : R * 0.88;
      if (!spotFree(cx, cy, cr + 16)) continue;
      let ok = true;
      for (const s of L.solids) if (dist(cx, cy, s.x, s.y) < cr + s.r + gap) { ok = false; break; }
      if (!ok) continue;
      if (kind === 'tree') { const tr = { x, y, R, ci: r() * L.pal.canopy.length | 0, seed: r() * 1000, cx, cy, cr, shake: 0 }; L.trees.push(tr); tr.solid = addSolid(cx, cy, cr, 'tree', { tree: tr }); }
      else addSolid(cx, cy, cr, kind, { R });
      placed++;
    }
  };
  scatter(def.trees, def.bigTrees ? 56 : 52, def.bigTrees ? 100 : 90, 'tree', 68);
  scatter(def.rocks || 0, 28, 50, 'rock', 70);
  scatter(def.hay || 0, 46, 60, 'hay', 72);

  // ---- reachability (flood fill from the start) -----------------------------
  const blocked = new Uint8Array(cols * rows);
  for (let cy = 0; cy < rows; cy++) for (let cx = 0; cx < cols; cx++) {
    let b = false;
    for (let dy = -1; dy <= 1 && !b; dy++) for (let dx = -1; dx <= 1; dx++) { if (!inW(cx + dx, cy + dy) || G[(cy + dy) * cols + cx + dx] >= 2) { b = true; break; } }
    if (b) blocked[cy * cols + cx] = 1;
  }
  for (const s of L.solids) {
    const rad = s.r + HERO_R + 3;
    for (let cy = (s.y - rad) / CS | 0; cy <= (s.y + rad) / CS; cy++) for (let cx = (s.x - rad) / CS | 0; cx <= (s.x + rad) / CS; cx++)
      if (inW(cx, cy) && dist((cx + 0.5) * CS, (cy + 0.5) * CS, s.x, s.y) < rad) blocked[cy * cols + cx] = 1;
  }
  const reach = L.reach = new Uint8Array(cols * rows), q = [ci(L.spawn.x, L.spawn.y)];
  if (blocked[q[0]]) return null;
  reach[q[0]] = 1;
  while (q.length) {
    const i = q.pop(), cx = i % cols, cy = i / cols | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, ny = cy + dy; if (!inW(nx, ny)) continue;
      const j = ny * cols + nx; if (!reach[j] && !blocked[j]) { reach[j] = 1; q.push(j); }
    }
  }
  if (!reach[ci(L.nest.x, L.nest.y)]) return null;
  for (const s of L.stars) if (s.check && !reach[ci(s.x, s.y)]) return null;
  if (L.cave && !reach[ci(L.cave.egg.x, L.cave.egg.y + 80)]) return null;
  const reachCells = (x, y, r0, r1, bits) => {
    const out = [];
    for (let cy = (y - r1) / CS | 0; cy <= (y + r1) / CS; cy++) for (let cx = (x - r1) / CS | 0; cx <= (x + r1) / CS; cx++) {
      if (!inW(cx, cy)) continue; const i = cy * cols + cx, d = dist((cx + 0.5) * CS, (cy + 0.5) * CS, x, y);
      if (reach[i] && d >= r0 && d <= r1 && !(F[i] & bits)) out.push({ x: (cx + 0.5) * CS, y: (cy + 0.5) * CS });
    }
    return out;
  };
  L.ci = ci;
  if (L.gates.length && !placeMechInputs(L, r, mark)) return null;      // the plates, targets... of every gate (065-mech.js)
  if (def.cage) {                                                        // the star cage next to the nest (T7.2): only where a definition asks for one
    L.cage = { x: L.nest.x - 250, y: L.nest.y + 40, hit: [-99, -99], seen: [-1, -1], done: false, doneT: 0, by: -1, wobT: 0 };
    L.stars.push({ x: L.cage.x, y: L.cage.y - 70, kind: 'cage', hidden: true, region: 0, z: 0 });
  }
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = r() * (i + 1) | 0; const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  // ---- beetles ---------------------------------------------------------------
  const addBeetle = (x, y) => L.beetles.push({ hx: x, hy: y, x, y, vx: 0, vy: 0, state: 'sleep', t: 0, face: r() < 0.5 ? 1 : -1, seed: r() * 10, r: 28 });
  for (const gs of guardSpots) for (let j = 0; j < gs.n; j++) {
    const a = r() * TAU + j * TAU / Math.max(1, gs.n), x = gs.x + Math.cos(a) * gs.rad, y = gs.y + Math.sin(a) * gs.rad;
    if (reach[ci(x, y)]) addBeetle(x, y);
  }
  for (let k = 0; k < NW; k++) {
    const [x0, x1] = region(k);
    for (let m = 0, t = 0; m < dv(def.beetles, k) && t < 400; t++) {
      const x = lerp(x0 + 60, x1 - 60, r()), y = lerp(top + 80, WH - 80, r()), i = ci(x, y);
      if (!reach[i] || (F[i] & 22) || G[i] !== 0) continue;
      if (dist(x, y, L.spawn.x, L.spawn.y) < 380 || dist(x, y, L.nest.x, L.nest.y) < 280 || !pathFar(x, y, 105)) continue;
      if (L.beetles.some(b => dist(b.x, b.y, x, y) < 230)) continue;
      addBeetle(x, y); m++;
    }
  }

  // ---- sparkling trees (hide eggs) and the treetop star ----------------------
  for (let k = 0; k < NW; k++) {
    const [x0, x1] = region(k);
    const cand = shuffle(L.trees.filter(t => t.x >= x0 && t.x < x1 && !t.spark && pathDist(t.x, t.y) < 560));
    let n = dv(def.sparkle, k);
    for (const t of cand) {
      if (n <= 0) break;
      const cells = shuffle(reachCells(t.cx, t.cy, t.cr + 55, t.cr + 190, 6));
      if (cells.length < 4) continue;
      const cnt = 2 + (r() < 0.5 ? 1 : 0);
      t.spark = { wave: k, n: cnt, targets: cells.slice(0, cnt), done: false }; t.dyn = true; n--;
    }
  }
  // ---- T15: enough small enemies to give the diamonds (they are the only place diamonds come from) -------
  // fieldEnemies counts robots, the snails of the glowing trees and the pinecones; robots fill up what is missing.
  // Little George (miniGeorge) comes on top: he follows the nearest hero and never hits.
  const Q15 = quotaOf(idx), LC = CONFIG.lupta;
  if (Q15 && LC) {
    const want = (LC.fieldEnemies || [])[idx] || 0, snails = L.trees.filter(t => t.spark).length * (LC.treeSnails || 0);
    let turn = 0;          // with bands (T7.4) the enemies go to the thirds in turn: every third has diamonds, a band cannot be crossed for them
    const place = (gap) => {
      const off = L.gates.length ? turn++ : 0;
      for (let t = 0; t < 600; t++) {
        const k = (t + off) % NW, [x0, x1] = region(k), x = lerp(x0 + 60, x1 - 60, r()), y = lerp(top + 80, WH - 80, r()), i = ci(x, y);
        if (!reach[i] || (F[i] & 22) || G[i] !== 0) continue;
        if (dist(x, y, L.spawn.x, L.spawn.y) < 380 || dist(x, y, L.nest.x, L.nest.y) < 280 || !pathFar(x, y, 105)) continue;
        if (L.beetles.some(b => dist(b.x, b.y, x, y) < gap)) continue;
        return { x, y };
      }
      return null;
    };
    for (let guard = 0; L.beetles.length + snails + L.cones.length < want && guard < 60; guard++) {
      const p = place(170) || place(110); if (!p) break; addBeetle(p.x, p.y);
    }
    const M = LC.miniGeorge, mn = M ? (M.perLevel || [])[idx] || 0 : 0;
    for (let j = 0; j < mn; j++) {
      const p = place(200) || place(120); if (!p) break;
      addBeetle(p.x, p.y); Object.assign(L.beetles[L.beetles.length - 1], { look: 'mini', r: 30, hp: M.hp, maxHp: M.hp, drop: M.drop });
    }
  }
  for (const s of L.stars) if (s.kind === 'treetop') {
    const [x0, x1] = region(s.region);
    const cand = shuffle(L.trees.filter(t => t.x >= x0 && t.x < x1 && !t.spark && !t.starTree));
    let ok = false;
    for (const t of cand) {
      const cells = shuffle(reachCells(t.cx, t.cy, t.cr + 55, t.cr + 170, 6));
      if (!cells.length) continue;
      t.starTree = s; t.dyn = true; s.tree = t; s.x = cells[0].x; s.y = cells[0].y; ok = true; break;
    }
    if (!ok) { const cells = shuffle(reachCells((x0 + x1) / 2, (top + WH) / 2, 0, 700, 6)).filter(c2 => pathFar(c2.x, c2.y, 300)); if (!cells.length) return null; s.kind = 'guarded'; s.hidden = false; s.x = cells[0].x; s.y = cells[0].y; }
  }
  L.dynTrees = L.trees.filter(t => t.dyn);

  // ---- golden eggs, in waves from left to right ------------------------------
  const Q = quotaOf(idx), total = Math.max(NW, Q ? Math.ceil(CONFIG.quota.extra * Q) : Math.round(CONFIG.levelDuration / 60 * CONFIG.eggsPerMinute)), quota = Math.round(total / NW);
  L.q = Q; L.totalEggs = 0;
  if (Q) { for (let k = 0; k < NW; k++) L.waves.push([]); L.totalEggs = 2 * Q; }      // T15: no diamonds lie in the waves; they come from defeated enemies. The waves only light the trees
  else for (let k = 0; k < NW; k++) {
    const [x0, x1] = region(k), pts = [];
    const sparkN = L.trees.reduce((a, t) => a + (t.spark && t.spark.wave === k ? t.spark.n : 0), 0);
    const ground = Math.max(2, quota - sparkN), trailN = Math.round(ground * 0.4);
    const far = (x, y, d) => pts.every(p => dist(p.x, p.y, x, y) >= d);
    const seg = L.path.filter(p => p[0] > x0 + 50 && p[0] < x1 - 50 && dist(p[0], p[1], L.spawn.x, L.spawn.y) > 240 && dist(p[0], p[1], L.nest.x, L.nest.y) > 180);
    for (let j = 0; j < trailN && seg.length; j++) {
      const p = seg[Math.floor((j + 0.5) / trailN * seg.length)], i = ci(p[0], p[1]);
      if (reach[i] && !(F[i] & 2) && far(p[0], p[1], 90)) pts.push({ x: p[0], y: p[1] });
    }
    for (let t = 0; t < 6000 && pts.length < ground; t++) {
      const x = lerp(x0 + 50, x1 - 50, r()), y = lerp(top + 50, WH - 50, r()), i = ci(x, y);
      if (!reach[i] || (F[i] & 6) || !far(x, y, 125) || dist(x, y, L.spawn.x, L.spawn.y) < 210) continue;
      pts.push({ x: ((x / CS | 0) + 0.5) * CS + (r() - 0.5) * 14, y: ((y / CS | 0) + 0.5) * CS + (r() - 0.5) * 14 });
    }
    if (pts.length < Math.min(4, ground)) return null;
    L.waves.push(pts); L.totalEggs += pts.length + sparkN;
  }
  if (Q && L.totalEggs < 2 * Q) return null;      // buildLevel tries the next seed: both heroes must be able to finish

  // ---- lanterns along the path (sunset level) --------------------------------
  if (def.lanterns) {
    for (let i = 8, side = 1; i < L.path.length - 8; i += 10, side = -side) {
      const p = L.path[i], p2 = L.path[i + 1], dx = p2[0] - p[0], dy = p2[1] - p[1], d = Math.hypot(dx, dy) || 1;
      const x = p[0] - dy / d * 82 * side, y = p[1] + dx / d * 82 * side;
      if (G[ci(x, y)] === 0 && dist(x, y, L.nest.x, L.nest.y) > 200) L.lanterns.push({ x, y, lit: 0 });
    }
  }
  for (let i = 0; i < G.length; i++) if (G[i] === 2 && !(F[i] & 64)) L.waterCells.push(i);     // a chasm (flag 64) is not water
  if (def.birds) { L.birds = []; for (let i = 0; i < def.birds; i++) L.birds.push({ state: 'gone', t: 6 + i * 7 + r() * 4, x: 0, y: 0, dir: 1, hp: 2, wing: 0, rest: 0, grab: null }); }   // big birds come later, one after the other
  L.reachCells = reachCells; L.ci = ci; L.pathDist = pathDist;
  L.decor = makeDecor(L, L.seed);
  return L;
}

/* ---------------- painting ---------------- */
/* The chasms of a level with bands (T7.4, docs/25-niveluri-7-12.md, level 7). Painted once into the picture of the level:
   deep blue at the bottom (P.chasm[0]), a lighter middle (P.chasm[1]), mist (P.chasm[2]) and far little lights,
   the salmon rock lip on both edges. The crossings are painted as chasm too: their bridge of light is drawn every frame (drawBridge). */
function paintChasm(c, L, P, r) {
  const base = PALS[L.def.pal] || P, CH = base.chasm || ['#3A4A8A', '#6A7AC0', '#D8DCF6'];
  const rock = base.rock && base.rock[0] === '#' ? base.rock : '#C98A7A', lip = shade(rock, -0.1);      // with the Krea look P.rock is a picture name: the color is in PALS
  const band = (g, k) => {                       // the band as one smooth shape, k = how much of its width
    c.beginPath();
    for (let y = L.top - 20; y <= L.H + 40; y += 20) c.lineTo(bandX(g, y) - g.half * k, y);
    for (let y = L.H + 40; y >= L.top - 20; y -= 20) c.lineTo(bandX(g, y) + g.half * k, y);
    c.closePath();
  };
  for (const g of L.gates) {
    if (g.kind !== 'chasm') continue;
    // the bottom: deep at the walls, lighter in the middle, where the light of the sunrise reaches
    c.fillStyle = CH[0]; band(g, 1); c.fill();
    c.fillStyle = mix(CH[0], CH[1], 0.5); band(g, 0.72); c.fill();
    c.fillStyle = CH[1]; band(g, 0.42); c.fill();
    for (let y = L.top; y < L.H + 40; y += 70) {
      const mx = bandX(g, y);
      wash(c, mx + (r() - 0.5) * 30, y, g.half * 0.8, 60, mix(CH[0], CH[1], 0.7), { a: 0.35, seed: y, layers: 2, edge: 0 });
      if (r() < 0.6) wash(c, mx + (r() - 0.5) * g.half * 0.6, y + 20, g.half * 0.85, 46, CH[2], { a: 0.16, seed: y + 5, layers: 2, edge: 0 });     // mist
    }
    for (let y = L.top; y < L.H + 40; y += 26) if (r() < 0.55) {      // far little lights at the bottom
      c.fillStyle = rgba('#FFF6E0', 0.45 + r() * 0.4); c.beginPath(); c.arc(bandX(g, y) + (r() - 0.5) * g.half * 1.3, y + (r() - 0.5) * 20, 1.8 + r() * 2.2, 0, TAU); c.fill();
    }
    // the wall under the rim (shadow inside the chasm), the salmon rock lip, and the sunlit edge
    for (const side of [-1, 1]) {
      const edge = (off) => { const pts = []; for (let y = L.top - 20; y <= L.H + 40; y += 30) pts.push([bandX(g, y) + side * (g.half + off), y]); return pts; };
      brushLine(c, edge(-16), 26, mix(CH[0], SHADOW, 0.25), 0.45, 21 + side);
      brushLine(c, edge(-2), 16, lip, 0.95, 23 + side);
      brushLine(c, edge(7), 5, shade(rock, 0.45), 0.8, 25 + side);
    }
  }
  for (const s of L.stars) if (s.pillar) {                // the stone pillar of the star, rising from the chasm
    const h = 330;
    if (P.art && artOk('pillar')) drawArt(c, 'pillar', s.x, s.y + h * 0.74, h, 0.5);
    else { wash(c, s.x, s.y + 40, 58, 90, rock, { a: 1.1, seed: 9, wob: 0.1, n: 9 }); wash(c, s.x, s.y - 30, 56, 24, '#8FC07A', { a: 1, seed: 11 }); }
  }
}
/* ---------- decor: the small things of the meadow (update U6) ----------
   Every level has about CONFIG.decorPerLevel of them: grass, clover, daisies, reeds, dandelions,
   leaves, snails, ladybugs, mushrooms, pebbles, bushes, twigs, moss. All of them are painted once
   into the level picture (L.bg). Grass, clover, daisies, reeds, dandelions and leaves react with
   small puffs of leaves, petals or seeds and a rustle (updateDecor). Snails and ladybugs move, so
   they are drawn live every frame, but only the ones on screen. Nothing here blocks a hero. */
const DECOR_WEIGHT = { grass: 6, clover: 2, daisy: 3, reed: 1, dandelion: 2, leaf: 2, snail: 1, ladybug: 1, mushroom: 14, pebble: 18, bush: 12, twig: 12, moss: 12 };   // reacting kinds are about a fifth: they are drawn every frame
const DECOR_REACT = { grass: 'puff', clover: 'puff', daisy: 'puff', reed: 'puff', dandelion: 'puff', leaf: 'puff', snail: 'hide', ladybug: 'fly' };
/* The decor of the second game: as many kinds, with the same ways of reacting, but the things of a jungle at night. */
const DECOR_WEIGHT_L = { fern: 6, orchid: 3, glowcap: 2, bellflower: 2, puffball: 2, bigleaf: 1, glowworm: 1, firefly: 1, gem: 14, bolt: 12, root: 12, mossglow: 12, pawprint: 12 };
const DECOR_REACT_L = { fern: 'puff', orchid: 'puff', glowcap: 'puff', bellflower: 'puff', puffball: 'puff', bigleaf: 'puff', glowworm: 'hide', firefly: 'fly' };
function makeDecor(L, seed) {
  const WT = L.night ? DECOR_WEIGHT_L : DECOR_WEIGHT, RE = L.night ? DECOR_REACT_L : DECOR_REACT;
  const r = rng(seed + 555), out = [], types = Object.keys(WT), total = types.reduce((a, t) => a + WT[t], 0);
  const pickType = () => { let x = r() * total; for (const t of types) { x -= WT[t]; if (x < 0) return t; } return types[0]; };
  let tries = 0;
  while (out.length < CONFIG.decorPerLevel && tries++ < CONFIG.decorPerLevel * 8) {
    const x = r() * L.W, y = lerp(L.top + 30, L.H - 24, r());
    const g = L.grid[L.ci(x, y)]; if (g === 2 || g === 3) continue;                    // no decor in water or on the cliff
    if (dist(x, y, L.nest.x, L.nest.y) < 180) continue;
    let bad = false; for (const s of L.solids) if (dist(x, y, s.x, s.y) < s.r + 12) { bad = true; break; }
    if (bad) continue;
    const type = pickType();
    out.push({ type, x, y, s: 0.8 + r() * 0.45, rot: (r() - 0.5) * 0.5, v: r() * 4 | 0, react: !!RE[type], rk: RE[type] || '', live: RE[type] === 'hide' || RE[type] === 'fly', cool: 0, hide: 0, flyT: 0 });   // rk: how it reacts (puff, hide, fly)
  }
  return out;
}
/* One picture of a kind of decor, drawn once and cached. v = which of the 4 looks it has. */
function paintDecor(cc, type, v, seed) {
  const r = rng(seed * 31 + v * 7919 + type.length * 13), pick = a => a[Math.floor(r() * a.length)];
  const GREEN = ['#8BB36B', '#6FA35E', '#A4C77A', '#7FA65C'], SH = a => rgba(SHADOW, a);
  if (type === 'grass') {
    for (let i = 0; i < 5; i++) { const x = 48 + (i - 2) * 7 + (r() - 0.5) * 4, h = 26 + r() * 22, lean = (r() - 0.5) * 16; cc.strokeStyle = rgba(pick(GREEN), 0.92); cc.lineWidth = 3.2; cc.lineCap = 'round'; cc.beginPath(); cc.moveTo(x, 80); cc.quadraticCurveTo(x + lean * 0.3, 80 - h * 0.6, x + lean, 80 - h); cc.stroke(); }
  } else if (type === 'clover') {
    for (let i = 0; i < 3; i++) { const a = i / 3 * TAU - 1.5; wash(cc, 48 + Math.cos(a) * 9, 72 + Math.sin(a) * 5, 9, 7, pick(GREEN), { a: 0.9, seed: v * 5 + i, edge: 1 }); }
    cc.strokeStyle = rgba('#6FA35E', 0.8); cc.lineWidth = 2; cc.beginPath(); cc.moveTo(48, 78); cc.lineTo(46, 88); cc.stroke();
  } else if (type === 'daisy') {
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; wash(cc, 48 + Math.cos(a) * 11, 66 + Math.sin(a) * 9, 6, 4, '#FFF8EA', { a: 0.95, seed: i + v, edge: 1 }); }
    wash(cc, 48, 66, 4.5, 4.5, PETALS[v % PETALS.length] === '#FBE3BA' ? '#F6C63C' : '#F6C63C', { a: 0.95, seed: v, edge: 0 });
    cc.strokeStyle = rgba('#6FA35E', 0.85); cc.lineWidth = 2.2; cc.beginPath(); cc.moveTo(48, 72); cc.lineTo(47, 88); cc.stroke();
  } else if (type === 'reed') {
    for (let i = 0; i < 3; i++) { const x = 40 + i * 8 + (r() - 0.5) * 3, h = 40 + r() * 16; cc.strokeStyle = rgba('#8DAA6A', 0.95); cc.lineWidth = 2.6; cc.beginPath(); cc.moveTo(x, 84); cc.lineTo(x + (r() - 0.5) * 4, 84 - h); cc.stroke(); wash(cc, x, 84 - h, 3, 6, '#9C6A46', { a: 0.9, seed: i + v, edge: 0 }); }
  } else if (type === 'dandelion') {
    cc.strokeStyle = rgba('#8DAA6A', 0.9); cc.lineWidth = 2; cc.beginPath(); cc.moveTo(48, 86); cc.lineTo(48, 42); cc.stroke();
    for (let i = 0; i < 12; i++) { const a = r() * TAU, d = r() * 11; wash(cc, 48 + Math.cos(a) * d, 36 + Math.sin(a) * d, 3, 3, '#FFF8EA', { a: 0.9, seed: i + v, edge: 1 }); }
  } else if (type === 'leaf') {
    wash(cc, 48, 70, 17, 9, pick(['#D9913A', '#C96F4E', '#E2A04F']), { a: 0.95, seed: v + 3, edge: 1 });
    cc.strokeStyle = rgba('#FBE3BA', 0.7); cc.lineWidth = 1.6; cc.beginPath(); cc.moveTo(34, 72); cc.lineTo(62, 68); cc.stroke();
  } else if (type === 'snail') {
    wash(cc, 46, 75, 17, 6, '#E9C9A0', { a: 0.95, seed: v + 1, edge: 1 });
    wash(cc, 52, 66, 11, 10, '#B98A5A', { a: 0.95, seed: v + 2, edge: 1 });
    cc.strokeStyle = SH(0.6); cc.lineWidth = 1.6; cc.beginPath(); cc.arc(52, 66, 5, 0, TAU * 0.8); cc.stroke(); cc.beginPath(); cc.arc(52, 66, 2, 0, TAU * 0.9); cc.stroke();
  } else if (type === 'ladybug') {
    wash(cc, 48, 72, 18, 10, '#79A866', { a: 0.95, seed: v + 4, edge: 1 });
    wash(cc, 50, 63, 7, 6, '#D9463C', { a: 0.95, seed: v + 5, edge: 0 });
    for (let i = 0; i < 3; i++) soft(cc, 47 + i * 3, 61 + (i % 2) * 4, 1.2, 1.2, SHADOW, 0.85, i + v);
    soft(cc, 54, 56, 2.2, 2.2, SHADOW, 0.9, v);
  } else if (type === 'mushroom') {
    cc.fillStyle = rgba('#F3E2C0', 0.95); cc.fillRect(42, 66, 12, 16);
    wash(cc, 48, 62, 17, 11, pick(['#E9703C', '#D9463C', '#E7A6A1']), { a: 0.95, seed: v + 6, edge: 1 });
    for (let i = 0; i < 4; i++) wash(cc, 42 + i * 4 + (r() - 0.5) * 3, 58 + (r() - 0.5) * 6, 2.2, 2.2, '#FFF8EA', { a: 0.9, seed: i + v, edge: 0 });
  } else if (type === 'pebble') {
    wash(cc, 48, 74, 15, 9, pick(['#D8B7A0', '#CFA89A', '#E0C9B0']), { a: 0.95, seed: v + 7, edge: 1 });
    wash(cc, 46, 79, 11, 3.5, SHADOW, { a: 0.3, seed: v + 8, edge: 0 });
  } else if (type === 'bush') {
    for (let i = 0; i < 5; i++) wash(cc, 36 + r() * 26, 60 + r() * 22, 10 + r() * 7, 7 + r() * 5, pick(GREEN), { a: 0.9, seed: i + v * 3, edge: 1 });
  } else if (type === 'twig') {
    cc.strokeStyle = rgba('#9C6A46', 0.95); cc.lineWidth = 4; cc.lineCap = 'round'; cc.beginPath(); cc.moveTo(30, 78); cc.lineTo(68, 70); cc.stroke();
    cc.lineWidth = 2.5; cc.beginPath(); cc.moveTo(50, 74); cc.lineTo(58, 60); cc.stroke();
  } else if (type === 'moss') {
    for (let i = 0; i < 4; i++) wash(cc, 34 + i * 9 + (r() - 0.5) * 4, 76 + (r() - 0.5) * 4, 7, 4, pick(GREEN), { a: 0.9, seed: i + v * 2, edge: 1 });
  } else paintDecorL(cc, type, v, r, pick);
}
/* The decor of the second game (the jungle at night). Glowing things get a soft halo of their own color. */
function paintDecorL(cc, type, v, r, pick) {
  const JG = ['#3FB094', '#58C89A', '#2F9A84', '#7AD6A8'], glow = (x, y, rad, col, a) => { const g = cc.createRadialGradient(x, y, 1, x, y, rad); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); cc.fillStyle = g; cc.beginPath(); cc.arc(x, y, rad, 0, TAU); cc.fill(); };
  if (type === 'fern') {
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.42 + (r() - 0.5) * 0.15, l = 26 + r() * 16; cc.strokeStyle = rgba(pick(JG), 0.95); cc.lineWidth = 3; cc.lineCap = 'round'; cc.beginPath(); cc.moveTo(48, 82); cc.quadraticCurveTo(48 + Math.cos(a) * l * 0.5, 82 + Math.sin(a) * l * 0.8, 48 + Math.cos(a) * l, 82 + Math.sin(a) * l * 0.8); cc.stroke(); }
  } else if (type === 'orchid') {
    const col = RAINBOW[(v * 2 + 6) % 7]; glow(48, 62, 26, col, 0.35);
    cc.strokeStyle = rgba('#3FB094', 0.9); cc.lineWidth = 2.2; cc.beginPath(); cc.moveTo(48, 68); cc.lineTo(47, 88); cc.stroke();
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU - 1.57; wash(cc, 48 + Math.cos(a) * 9, 62 + Math.sin(a) * 8, 7, 5, col, { a: 0.95, seed: i + v, edge: 1 }); }
    wash(cc, 48, 62, 3.5, 3.5, '#FFF6D0', { a: 1, seed: v, edge: 0 });
  } else if (type === 'glowcap') {
    const col = RAINBOW[(v * 3 + 2) % 7]; glow(48, 62, 30, col, 0.4);
    cc.fillStyle = rgba('#EDE6FF', 0.95); cc.fillRect(44, 66, 8, 16);
    wash(cc, 48, 62, 15, 10, col, { a: 0.95, seed: v + 6, edge: 1 }); wash(cc, 44, 59, 4, 3, '#FFFFFF', { a: 0.7, seed: v, edge: 0 });
  } else if (type === 'bellflower') {
    const col = RAINBOW[(v + 4) % 7]; glow(52, 56, 22, col, 0.3);
    cc.strokeStyle = rgba('#58C89A', 0.9); cc.lineWidth = 2.2; cc.beginPath(); cc.moveTo(46, 88); cc.quadraticCurveTo(44, 60, 54, 50); cc.stroke();
    for (let i = 0; i < 3; i++) wash(cc, 50 + i * 4, 56 + i * 7, 5, 6, col, { a: 0.95, seed: i + v, edge: 1 });
  } else if (type === 'puffball') {
    glow(48, 38, 22, '#E8E0FF', 0.3);
    cc.strokeStyle = rgba('#58C89A', 0.9); cc.lineWidth = 2; cc.beginPath(); cc.moveTo(48, 86); cc.lineTo(48, 44); cc.stroke();
    for (let i = 0; i < 12; i++) { const a = r() * TAU, d = r() * 11; wash(cc, 48 + Math.cos(a) * d, 38 + Math.sin(a) * d, 3, 3, i % 3 ? '#F4EEFF' : RAINBOW[i % 7], { a: 0.9, seed: i + v, edge: 1 }); }
  } else if (type === 'bigleaf') {
    wash(cc, 48, 70, 19, 10, pick(JG), { a: 0.95, seed: v + 3, edge: 1 });
    cc.strokeStyle = rgba('#C8FFE0', 0.7); cc.lineWidth = 1.6; cc.beginPath(); cc.moveTo(32, 72); cc.lineTo(64, 68); cc.stroke();
  } else if (type === 'glowworm') {
    glow(48, 72, 24, '#B7F0A0', 0.35);
    for (let i = 0; i < 5; i++) wash(cc, 38 + i * 5, 74 - Math.sin(i * 0.9) * 4, 4.5, 4, i % 2 ? '#B7F0A0' : '#7AD68A', { a: 0.95, seed: i + v, edge: 1 });
    soft(cc, 60, 71, 1.4, 1.4, SHADOW, 0.9, v);
  } else if (type === 'firefly') {
    glow(50, 60, 22, '#FFE88A', 0.6);
    wash(cc, 50, 61, 4.5, 3.5, '#FFE88A', { a: 1, seed: v + 5, edge: 0 });
    wash(cc, 46, 57, 4, 2.2, '#EAF2FF', { a: 0.7, seed: v + 6, edge: 0 }); wash(cc, 54, 57, 4, 2.2, '#EAF2FF', { a: 0.7, seed: v + 7, edge: 0 });
  } else if (type === 'gem') {
    const col = RAINBOW[(v * 2 + 1) % 7]; glow(48, 72, 16, col, 0.3);
    cc.fillStyle = rgba(col, 0.95); cc.beginPath(); cc.moveTo(48, 62); cc.lineTo(55, 72); cc.lineTo(50, 82); cc.lineTo(42, 76); cc.closePath(); cc.fill();
    cc.fillStyle = 'rgba(255,255,255,0.6)'; cc.beginPath(); cc.moveTo(48, 62); cc.lineTo(51, 70); cc.lineTo(45, 71); cc.closePath(); cc.fill();
  } else if (type === 'bolt') {
    wash(cc, 48, 74, 9, 7, '#A6B0DE', { a: 0.95, seed: v + 7, edge: 1 }); wash(cc, 48, 74, 3.5, 3, '#56609E', { a: 0.9, seed: v + 8, edge: 0 });
    wash(cc, 46, 79, 8, 2.5, SHADOW, { a: 0.3, seed: v + 9, edge: 0 });
  } else if (type === 'root') {
    cc.strokeStyle = rgba('#6A4A82', 0.9); cc.lineWidth = 4.5; cc.lineCap = 'round'; cc.beginPath(); cc.moveTo(28, 78); cc.quadraticCurveTo(46, 62, 68, 74); cc.stroke();
    cc.lineWidth = 2.5; cc.beginPath(); cc.moveTo(48, 68); cc.lineTo(54, 58); cc.stroke();
  } else if (type === 'mossglow') {
    for (let i = 0; i < 4; i++) wash(cc, 34 + i * 9 + (r() - 0.5) * 4, 76 + (r() - 0.5) * 4, 7, 4, i % 2 ? '#58C89A' : '#7AF0C8', { a: 0.85, seed: i + v * 2, edge: 1 });
  } else if (type === 'pawprint') {
    cc.fillStyle = rgba(SHADOW, 0.3); cc.beginPath(); cc.ellipse(48, 76, 8, 6, 0, 0, TAU); cc.fill();
    for (let i = 0; i < 3; i++) { cc.beginPath(); cc.ellipse(40 + i * 8, 66 - (i === 1 ? 3 : 0), 3, 4.5, (i - 1) * 0.3, 0, TAU); cc.fill(); }
  }
}
const decorSprite = (type, v) => sprite('dec-' + type + '-' + v, 96, 96, cc => paintDecor(cc, type, v, 7));
function paintDecorStill(c, L) {                          // all the decor that stays put goes into the level picture, once
  if (L.pal.art && artReady()) {                          // the calm look: small tufts and pebbles in the ground's own color, so nothing shouts
    const P = L.pal; c.lineCap = 'round';
    for (const d of L.decor) if (!d.live) {
      const k = hash(d.x, d.y), dk = shade(P.g1, -0.22), lt = shade(P.g0, 0.22);
      if (k < 0.6) { c.strokeStyle = rgba(k < 0.3 ? dk : lt, 0.55); c.lineWidth = 2.2; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(d.x + i * 3, d.y); c.quadraticCurveTo(d.x + i * 5, d.y - 8 * d.s, d.x + i * 9, d.y - (13 + k * 8) * d.s); c.stroke(); } }
      else { c.fillStyle = rgba(k < 0.8 ? dk : lt, 0.45); c.beginPath(); c.ellipse(d.x, d.y, 6 * d.s, 3.5 * d.s, d.rot, 0, TAU); c.fill(); }
    }
    return;
  }
  for (const d of L.decor) if (!d.live) { c.save(); c.translate(d.x, d.y); c.rotate(d.rot); c.scale(d.s, d.s); c.drawImage(decorSprite(d.type, d.v), -48, -56, 96, 96); c.restore(); }
}

function paintTree(c, t, P, ox, oy) {
  const x = t.x - (ox || 0), y = t.y - (oy || 0), R = t.R, col = P.canopy[t.ci % P.canopy.length], r = rng(t.seed * 13 + 1);
  if (P.art && artReady()) {               // the calm look: the Krea tree of the level; a glowing tree is the level's glowing plant
    const n = t.spark ? P.spark : P.tree[(t.seed | 0) % P.tree.length], im = ART[n], w = R * (t.spark ? 2.1 : 2.4);
    wash(c, x - R * 0.2, y + R * 1.1, R * 0.95, R * 0.32, SHADOW, { a: 0.3, seed: t.seed, edge: 0 });
    drawArt(c, n, x, y + R * 1.18, Math.min(w * im.naturalHeight / im.naturalWidth, R * 2.5), 0.5);
    return;
  }
  wash(c, x, y + R * 0.8, R * 0.17, R * 0.42, P.trunk, { a: 1, seed: t.seed, wob: 0.14, layers: 2 });
  wash(c, x - R * 0.05, y + R * 0.8, R * 0.08, R * 0.36, shade(P.trunk, -0.3), { a: 0.35, seed: t.seed + 9, edge: 0 });
  wash(c, x, y, R, R * 0.92, col, { a: 1.2, seed: t.seed + 1, wob: 0.16, n: 14, edgeA: 0.28 });
  wash(c, x - R * 0.26, y + R * 0.3, R * 0.68, R * 0.52, shade(col, -0.32), { a: 0.38, seed: t.seed + 2, wob: 0.22, edge: 0 });
  wash(c, x + R * 0.26, y - R * 0.28, R * 0.56, R * 0.46, shade(col, 0.35), { a: 0.5, seed: t.seed + 3, wob: 0.2, edge: 0 });
  wash(c, x + R * 0.38, y - R * 0.42, R * 0.26, R * 0.2, '#FFF1C4', { a: 0.4, seed: t.seed + 4, edge: 0 });
  for (let k = 0; k < 12; k++) {
    const a = r() * TAU, d = R * (0.45 + r() * 0.52);
    wash(c, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.92, R * (0.1 + r() * 0.08), R * (0.07 + r() * 0.06), shade(col, (r() - 0.55) * 0.6), { a: 0.5, seed: k + t.seed, layers: 1, edge: 0 });
  }
  if (P.night) {                         // second game: giant jungle plants. Big leaves all around, a glowing heart, little lights.
    const n = 7 + (t.seed | 0) % 3, a0 = r() * TAU, fc = P.flowers[(t.seed | 0) % P.flowers.length];
    for (let k = 0; k < n; k++) { const a = a0 + k / n * TAU; c.save(); c.translate(x + Math.cos(a) * R * 0.62, y + Math.sin(a) * R * 0.56); c.rotate(a); wash(c, 0, 0, R * 0.42, R * 0.17, shade(col, 0.22), { a: 0.75, seed: k + t.seed, wob: 0.1, edgeA: 0.22 }); c.strokeStyle = rgba(shade(col, 0.55), 0.5); c.lineWidth = 2; c.beginPath(); c.moveTo(-R * 0.34, 0); c.lineTo(R * 0.36, 0); c.stroke(); c.restore(); }
    const g = c.createRadialGradient(x, y, 2, x, y, R * 0.5); g.addColorStop(0, rgba(fc, 0.75)); g.addColorStop(1, rgba(fc, 0)); c.fillStyle = g; c.beginPath(); c.arc(x, y, R * 0.5, 0, TAU); c.fill();
    wash(c, x, y, R * 0.15, R * 0.14, '#FFF6D0', { a: 0.9, seed: t.seed + 7, edge: 0 });
    for (let k = 0; k < 6; k++) { const a = r() * TAU, d = R * (0.3 + r() * 0.6); wash(c, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.9, 3.5, 3.5, P.flowers[k % P.flowers.length], { a: 0.95, seed: k, layers: 1, edge: 0 }); }
  }
}
/* Second game: a rock with little crystals growing on it, a big glowing mushroom, a torch, a totem with a rainbow pinwheel. */
function paintCrystalRock(c, x, y, R, col, seed) {
  paintRock(c, x, y, R, col, seed);
  const r = rng(seed * 3 + 5);
  for (let i = 0; i < 3; i++) { const a = -2.6 + i * 0.9 + r() * 0.3, px = x + Math.cos(a) * R * 0.5, py = y + Math.sin(a) * R * 0.45, h = R * (0.5 + r() * 0.3), cl = RAINBOW[(seed + i * 2 | 0) % 7]; c.fillStyle = rgba(cl, 0.92); c.beginPath(); c.moveTo(px - R * 0.14, py); c.lineTo(px, py - h); c.lineTo(px + R * 0.14, py); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.moveTo(px - R * 0.14, py); c.lineTo(px, py - h); c.lineTo(px - R * 0.03, py); c.closePath(); c.fill(); }
}
function paintShroom(c, x, y, R, seed) {
  const col = RAINBOW[(seed | 0) % 7], g = c.createRadialGradient(x, y - R * 0.2, R * 0.3, x, y - R * 0.2, R * 1.9);
  g.addColorStop(0, rgba(col, 0.4)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.beginPath(); c.arc(x, y - R * 0.2, R * 1.9, 0, TAU); c.fill();
  wash(c, x, y + R * 0.35, R * 0.32, R * 0.6, '#EDE6FF', { a: 1.1, seed: seed + 1, wob: 0.08, edgeA: 0.25 });
  wash(c, x, y - R * 0.25, R * 1.05, R * 0.78, col, { a: 1.2, seed, wob: 0.08, n: 12, edgeA: 0.3 });
  wash(c, x + R * 0.25, y - R * 0.5, R * 0.5, R * 0.3, shade(col, 0.5), { a: 0.5, seed: seed + 2, edge: 0 });
  const r = rng(seed * 7 + 3);
  for (let i = 0; i < 7; i++) { const a = r() * TAU, d = r() * R * 0.75; wash(c, x + Math.cos(a) * d, y - R * 0.25 + Math.sin(a) * d * 0.7, R * 0.1, R * 0.08, '#FFFBEA', { a: 0.9, seed: i, layers: 1, edge: 0 }); }
}
function paintTorch(c, x, y) {
  c.strokeStyle = '#6A4A6A'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 78); c.stroke();
  c.strokeStyle = '#E0A04A'; c.lineWidth = 3; for (const yy of [y - 22, y - 46]) { c.beginPath(); c.moveTo(x - 5, yy); c.lineTo(x + 5, yy - 3); c.stroke(); }
  wash(c, x, y - 82, 15, 9, '#C8784A', { a: 1.1, seed: 8, wob: 0.06 });
}
function drawFlame(c, x, y, t, s, glow) {    // a torch flame that flickers (glow: 0 to 1). Not "lit": that is the painter in 02-core.js
  if (glow <= 0) return;
  const fl = 0.85 + Math.sin(t * 11 + x) * 0.1 + Math.sin(t * 23 + x * 2) * 0.06, h = 46 * s * fl * glow;
  const g = c.createRadialGradient(x, y - h * 0.4, 4, x, y - h * 0.4, 150 * s); g.addColorStop(0, 'rgba(255,214,140,' + 0.7 * glow + ')'); g.addColorStop(0.35, 'rgba(255,170,90,' + 0.25 * glow + ')'); g.addColorStop(1, 'rgba(255,150,80,0)');
  c.fillStyle = g; c.beginPath(); c.arc(x, y - h * 0.4, 150 * s, 0, TAU); c.fill();
  const sway = Math.sin(t * 7 + x) * 5 * s;
  c.fillStyle = '#F58A3C'; c.beginPath(); c.moveTo(x - 13 * s, y); c.quadraticCurveTo(x - 16 * s, y - h * 0.5, x + sway, y - h); c.quadraticCurveTo(x + 16 * s, y - h * 0.5, x + 13 * s, y); c.closePath(); c.fill();
  c.fillStyle = '#FFE08A'; c.beginPath(); c.moveTo(x - 7 * s, y); c.quadraticCurveTo(x - 8 * s, y - h * 0.4, x + sway * 0.6, y - h * 0.62); c.quadraticCurveTo(x + 8 * s, y - h * 0.4, x + 7 * s, y); c.closePath(); c.fill();
}
function paintTotem(c, x, y) {           // x,y = base center. The totem rises about 200 px; the pinwheel turns on top.
  wash(c, x, y + 6, 54, 24, '#6A5A9A', { a: 0.9, seed: 3, edge: 0 });
  const cols = ['#8E86C8', '#3FB094', '#E45AA0', '#F6CE46'];
  for (let i = 0; i < 4; i++) {
    const yy = y - 20 - i * 46, w = 44 - i * 3;
    wash(c, x, yy, w, 26, cols[i], { a: 1.15, seed: i + 4, wob: 0.05, n: 10, edgeA: 0.3 });
    wash(c, x - w * 0.4, yy + 4, w * 0.4, 18, shade(cols[i], -0.35), { a: 0.3, seed: i + 9, edge: 0 });
    for (const sd of [-1, 1]) { wash(c, x + sd * w * 0.38, yy - 3, 6.5, 6.5, '#FFF6D0', { a: 1, seed: i + sd, layers: 1, edge: 0 }); wash(c, x + sd * w * 0.38, yy - 2, 3, 3, '#3A3F78', { a: 1, seed: i, layers: 1, edge: 0 }); }
    c.strokeStyle = 'rgba(60,50,110,0.6)'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.arc(x, yy + 6, 9, 0.2, Math.PI - 0.2); c.stroke();
  }
  c.strokeStyle = '#6A4A6A'; c.lineWidth = 6; c.beginPath(); c.moveTo(x, y - 176); c.lineTo(x, y - 204); c.stroke();
}
function drawPinwheel(c, x, y, ang) {    // the rainbow pinwheel on top of a totem: it turns faster when the wind blows
  c.save(); c.translate(x, y); c.rotate(ang);
  for (let i = 0; i < 7; i++) { c.rotate(TAU / 7); c.fillStyle = rgba(RAINBOW[i], 0.92); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(34, -18, 14, -92); c.quadraticCurveTo(-4, -50, 0, 0); c.closePath(); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2; c.stroke(); }
  c.restore();
  puff(c, x, y, 10, 10, '#FFF6D0', 6);
}
function paintRock(c, x, y, R, col, seed) {
  wash(c, x, y, R * 1.1, R * 0.95, col, { a: 1.2, seed, wob: 0.16, n: 9, edgeA: 0.3 });
  wash(c, x - R * 0.28, y + R * 0.25, R * 0.7, R * 0.55, shade(col, -0.35), { a: 0.38, seed: seed + 1, wob: 0.2, edge: 0 });
  wash(c, x + R * 0.25, y - R * 0.3, R * 0.55, R * 0.4, '#FFF1D8', { a: 0.5, seed: seed + 2, wob: 0.2, edge: 0 });
  c.strokeStyle = rgba(shade(col, -0.45), 0.3); c.lineWidth = 2; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x - R * 0.3, y - R * 0.1); c.quadraticCurveTo(x, y + R * 0.1, x + R * 0.1, y + R * 0.5); c.stroke();
}
function paintHay(c, x, y, R, seed) {
  const r = rng(seed * 7 + 3);
  wash(c, x, y - R * 0.15, R * 1.05, R * 1.05, '#E9C56C', { a: 1.2, seed, wob: 0.1, n: 12, edgeA: 0.3 });
  wash(c, x - R * 0.25, y + R * 0.3, R * 0.75, R * 0.55, '#C99A50', { a: 0.4, seed: seed + 1, edge: 0 });
  wash(c, x + R * 0.25, y - R * 0.5, R * 0.55, R * 0.4, '#FFF0B8', { a: 0.5, seed: seed + 2, edge: 0 });
  c.lineCap = 'round';
  for (let i = 0; i < 26; i++) {
    const a = r() * TAU, d = r() * R * 0.85, px = x + Math.cos(a) * d, py = y - R * 0.15 + Math.sin(a) * d;
    c.strokeStyle = rgba(i % 2 ? '#B98848' : '#FFF3C4', 0.5); c.lineWidth = 2;
    c.beginPath(); c.moveTo(px, py); c.lineTo(px + (r() - 0.5) * 10, py + 12 + r() * 12); c.stroke();
  }
}
function paintMillTower(c, x, y) {       // x,y = base center. Tower rises 250 px.
  wash(c, x, y + 6, 62, 30, '#B99A7A', { a: 0.9, seed: 3, edge: 0 });
  const body = (inset, col, a) => { c.beginPath(); c.moveTo(x - 54 + inset, y + 14); c.quadraticCurveTo(x - 44 + inset, y - 90, x - 34 + inset, y - 192); c.lineTo(x + 34 - inset, y - 192); c.quadraticCurveTo(x + 44 - inset, y - 90, x + 54 - inset, y + 14); c.quadraticCurveTo(x, y + 30, x - 54 + inset, y + 14); c.closePath(); c.fillStyle = rgba(col, a); c.fill(); };
  body(0, '#F3E4C6', 1); body(5, '#FBF1DA', 0.6);
  c.save(); c.beginPath(); c.rect(x - 60, y - 200, 46, 240); c.clip(); body(0, '#B08A9A', 0.32); c.restore();
  c.strokeStyle = 'rgba(150,110,100,0.35)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 54, y + 14); c.quadraticCurveTo(x - 44, y - 90, x - 34, y - 192); c.moveTo(x + 54, y + 14); c.quadraticCurveTo(x + 44, y - 90, x + 34, y - 192); c.stroke();
  c.fillStyle = '#C96F4E'; c.beginPath(); c.moveTo(x - 46, y - 186); c.quadraticCurveTo(x - 20, y - 240, x, y - 256); c.quadraticCurveTo(x + 20, y - 240, x + 46, y - 186); c.quadraticCurveTo(x, y - 174, x - 46, y - 186); c.closePath(); c.fill();
  wash(c, x + 12, y - 222, 16, 20, '#E9A07A', { a: 0.5, seed: 4, edge: 0 });
  c.fillStyle = '#9A5F4A'; c.beginPath(); c.moveTo(x - 15, y + 20); c.lineTo(x - 15, y - 16); c.quadraticCurveTo(x, y - 36, x + 15, y - 16); c.lineTo(x + 15, y + 20); c.closePath(); c.fill();
  wash(c, x, y - 110, 11, 14, '#8E7AA0', { a: 0.8, seed: 5 });
}
function drawMillBlades(c, x, y, ang) {
  c.save(); c.translate(x, y); c.rotate(ang);
  for (let i = 0; i < 4; i++) {
    c.rotate(TAU / 4);
    c.strokeStyle = '#9A6B4C'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -158); c.stroke();
    c.fillStyle = 'rgba(255,246,226,0.93)'; c.beginPath(); c.moveTo(6, -40); c.lineTo(40, -48); c.lineTo(36, -150); c.lineTo(6, -154); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(201,111,78,0.75)'; c.lineWidth = 3; c.stroke();
    c.strokeStyle = 'rgba(201,111,78,0.4)'; c.lineWidth = 2; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(6, -40 - k * 28); c.lineTo(38, -48 - k * 26); c.stroke(); }
  }
  c.restore();
  puff(c, x, y, 11, 11, '#C96F4E', 6);
}
function paintLantern(c, x, y) {
  c.strokeStyle = '#8A5A48'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 84); c.stroke();
  c.lineWidth = 5; c.beginPath(); c.moveTo(x, y - 84); c.quadraticCurveTo(x + 4, y - 100, x + 20, y - 98); c.stroke();
  wash(c, x + 20, y - 76, 14, 18, '#E9A07A', { a: 1, seed: 8, wob: 0.06 });
  wash(c, x + 20, y - 76, 8, 11, '#FFE9B0', { a: 0.8, seed: 9, edge: 0 });
}
function cellBlobs(c, L, type, rad, col, alpha, seed, jit) {
  c.fillStyle = rgba(col, alpha); jit = jit == null ? 14 : jit;
  for (let cy = 0; cy < L.rows; cy++) for (let cx = 0; cx < L.cols; cx++) {
    const i = cy * L.cols + cx; if (L.grid[i] !== type) continue;
    for (let k = 0; k < 2; k++) {       // two overlapping dabs per cell hide the grid
      c.beginPath(); c.arc((cx + 0.5) * CS + (hash(seed + k * 7, i) - 0.5) * jit * 2, (cy + 0.5) * CS + (hash(seed + 1 + k * 7, i) - 0.5) * jit * 2, rad * (0.8 + hash(seed + 2 + k * 7, i) * 0.4), 0, TAU); c.fill();
    }
  }
}

const NIGHT_HILLS = ['#5A56A8', '#4A4A98', '#3E4288'];
function paintLevel(L) {
  for (const g of L.gates || []) if (g.kind === 'water' && !g.waterPainted) {      // T8: the crossing of a water band is water too: the raft floats on it (closeGates gives the cells their code back)
    g.waterPainted = true; for (const i of g.cells) { L.grid[i] = 2; L.waterCells.push(i); }
  }
  const cv = makeCanvas(L.W, L.H), c = cv.getContext('2d'), P = L.pal, r = rng(L.seed + 999), G = L.grid, top = L.top, sl = 1 + L.skyT * 0.7, N = !!L.night;
  const A = P.art && artReady();          // the calm Krea look: the things of the level are pictures, the ground has few small things
  const typeAt = (x, y) => G[L.ci(x, y)];
  // ground: gradient, then many wet washes
  let g = c.createLinearGradient(0, top, 0, L.H); g.addColorStop(0, P.g0); g.addColorStop(1, P.g1);
  c.fillStyle = g; c.fillRect(0, 0, L.W, L.H);
  for (let i = 0; i < 110; i++) wash(c, r() * L.W, top - 40 + r() * (L.H - top + 40), 130 + r() * 280, 80 + r() * 190, P.tints[i % P.tints.length], { a: (N ? 0.07 : 0.1) + r() * (N ? 0.08 : 0.12) + (A ? 0.12 : 0), seed: i + 1, wob: 0.28, edge: 2, edgeA: 0.05 });
  if (L.def.key === 'hill') {            // terraced contour lines
    c.lineCap = 'round';
    for (let k = 0; k < 9; k++) { const pts = []; for (let x = -50; x <= L.W + 50; x += 80) pts.push([x, top + 120 + k * 165 + Math.sin(x / 420 + k * 1.7) * 70 + Math.sin(x / 150 + k) * 16]); brushLine(c, pts, 10, k % 2 ? '#B9A868' : '#F1DFA8', 0.28, k + 3); }
  }
  // dry-brush grass strokes
  c.lineCap = 'round';
  for (let i = 0; i < 4200; i++) {
    const x = r() * L.W, y = top + r() * (L.H - top); if (typeAt(x, y) !== 0) continue;
    c.strokeStyle = rgba(i % 3 ? shade(P.g1, -0.22) : shade(P.g0, 0.3), 0.14 + r() * 0.12); c.lineWidth = 1.2 + r() * 1.6;
    const l = 8 + r() * 16, a = -Math.PI / 2 + (r() - 0.5) * 0.9;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
  }
  // the path
  const pp = L.path.filter((p, i) => i % 2 === 0);
  brushLine(c, pp, 120, shade(P.path, -0.18), 0.3, 11); brushLine(c, pp, 96, P.path, 0.75, 12); brushLine(c, pp, 56, shade(P.path, 0.4), 0.4, 13);
  for (const p of L.path) for (let k = 0; k < 2; k++) { const x = p[0] + (r() - 0.5) * 90, y = p[1] + (r() - 0.5) * 80; wash(c, x, y, 3 + r() * 5, 2.5 + r() * 3, r() < 0.5 ? shade(P.path, -0.3) : '#FFF6E0', { a: 0.4, seed: x, layers: 1, edge: 0 }); }
  // pinecone lanes: a worn track
  for (const l of L.lanes) { const pts = []; for (let y = l.y0 - 60; y <= l.y1 + 40; y += 60) pts.push([l.x + Math.sin(y / 130) * 8, y]); brushLine(c, pts, A ? 56 : 78, A ? P.lane : N ? '#58BF7A' : '#A8875E', A ? 0.16 : 0.28, l.x); brushLine(c, pts, A ? 22 : 40, A ? '#FFE6F4' : N ? '#B7F0A0' : '#C9A878', A ? 0.18 : N ? 0.3 : 0.25, l.x + 1); }      // second game: the shiny trail of the snails
  // mud
  if (G.includes(1)) {
    const SK = L.def.slowKind || 'mud', M = A ? SLOW_COLS[SK].map((cl, i) => mix(shade(P.g1, [-0.32, -0.16, -0.04, -0.22, 0.04, 0.3][i]), cl, 0.3)) : SLOW_COLS[SK];      // the calm look: the slow ground is a darker patch of the level's own ground
    cellBlobs(c, L, 1, 33, M[0], 0.28, 21, 16); cellBlobs(c, L, 1, 27, M[1], 0.9, 22, 12); cellBlobs(c, L, 1, 20, M[2], 0.5, 23, 16);
    for (let i = 0; i < G.length; i++) if (G[i] === 1) {
      const x = (i % L.cols + 0.5) * CS, y = ((i / L.cols | 0) + 0.5) * CS;
      if (hash(34, i) < 0.35) wash(c, x + (hash(35, i) - 0.5) * 30, y + (hash(36, i) - 0.5) * 30, 34 + hash(37, i) * 30, 18 + hash(38, i) * 16, hash(39, i) < 0.5 ? M[3] : M[4], { a: 0.3, seed: i, wob: 0.25, layers: 2, edge: 2, edgeA: 0.1 });
      if (hash(31, i) < 0.22) wash(c, x + 6, y - 6, 15, 6, M[5], { a: 0.4, seed: i, layers: 1, edge: 0 });
      if (SK === 'vines') { if (hash(32, i) < 0.5) { c.strokeStyle = rgba(hash(33, i) < 0.5 ? M[4] : M[0], 0.7); c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 20, y + (hash(40, i) - 0.5) * 30); c.bezierCurveTo(x - 6, y - 22, x + 6, y + 22, x + 22, y + (hash(41, i) - 0.5) * 30); c.stroke(); } }      // tangled vines on the ground
      else if (SK === 'sand') { if (hash(32, i) < 0.3) { c.strokeStyle = rgba(M[0], 0.35); c.lineWidth = 2; c.beginPath(); c.ellipse(x, y, 12 + hash(33, i) * 8, 6 + hash(33, i) * 4, 0, 0, TAU); c.stroke(); } }                                                                                                                                         // rings where the sand sinks
      else if (hash(32, i) < 0.16) { c.strokeStyle = rgba(shade(M[0], -0.2), 0.35); c.lineWidth = 2; c.beginPath(); c.arc(x - 8, y + 6, 4 + hash(33, i) * 4, 0, TAU); c.stroke(); }
    }
  }
  // water
  if (L.waterCells.length) {
    // water by day; at night (second game) deep blue water, or a pit: dark, with a glowing rim and far little lights
    const pit = !!L.def.pit, WC = pit ? ['#B09AFF', '#2E2862', '#3C3480', '#7A6AC8'] : A && P.water ? P.water : N ? ['#27306E', '#3F74C4', '#62A0E4', '#BFE0FF'] : [mix(P.g1, '#7A6A52', 0.4), '#82B5AE', '#9CCBC0', '#CDE8DA'];
    cellBlobs(c, L, 2, 35, WC[0], pit ? 0.5 : 0.3, 41, 12); cellBlobs(c, L, 2, 29, WC[1], 1, 42, 9); cellBlobs(c, L, 2, 21, WC[2], 0.45, 43, 14);
    for (const i of L.waterCells) {
      const x = (i % L.cols + 0.5) * CS, y = ((i / L.cols | 0) + 0.5) * CS;
      if (hash(51, i) < 0.22) wash(c, x, y, 46, 22, WC[3], { a: pit ? 0.14 : 0.26, seed: i, layers: 2, edge: 0 });
      if (pit) { if (hash(52, i) < 0.25) wash(c, x + (hash(53, i) - 0.5) * 30, y + (hash(54, i) - 0.5) * 30, 2.5, 2.5, RAINBOW[i % 7], { a: 0.9, seed: i, layers: 1, edge: 0 }); }
      else if (hash(52, i) < 0.3) { c.strokeStyle = 'rgba(244,251,240,0.5)'; c.lineWidth = 2.2; c.beginPath(); c.arc(x, y + 10, 14 + hash(53, i) * 10, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
    }
  }
  if (L.gates && L.gates.some(g => g.kind === 'water')) for (const st of L.stars) if (st.pillar) {      // T8: the star of the lake sits on a big lily pad in the middle of the water (a thrown thing takes it)
    c.fillStyle = rgba(SHADOW, 0.25); c.beginPath(); c.ellipse(st.x + 6, st.y + 34, 86, 40, 0, 0, TAU); c.fill();
    c.fillStyle = '#1F6A52'; c.beginPath(); c.ellipse(st.x, st.y + 28, 84, 40, 0, 0, TAU); c.fill();
    c.fillStyle = '#3FB08A'; c.beginPath(); c.ellipse(st.x, st.y + 22, 76, 34, 0, 0, TAU); c.fill();
    c.fillStyle = '#5AC08A'; c.beginPath(); c.ellipse(st.x - 6, st.y + 18, 54, 22, 0, 0, TAU); c.fill();
    c.fillStyle = '#FFB0D8'; for (let i = 0; i < 6; i++) { const a = i * TAU / 6; c.beginPath(); c.ellipse(st.x + Math.cos(a) * 14, st.y + 18 + Math.sin(a) * 8, 11, 6, a, 0, TAU); c.fill(); }
  }
  if (L.gates && L.gates.some(g => g.kind === 'wall')) paintWall(c, L, P, r);      // T8: the tin walls of the workshop
  if (L.gates && L.gates.some(g => g.kind === 'chasm')) paintChasm(c, L, P, r);      // T7.4: the chasms of the bands, and the pillar of the star
  for (const b of L.bridges) {
    wash(c, b.x - 10, b.y + 14, b.w / 2 + 6, b.h / 2 + 4, SHADOW, { a: 0.3, seed: 3, edge: 0 });
    if (A) { c.drawImage(ART.bridge, b.x - b.w / 2 - 22, b.y - b.h / 2 - 26, b.w + 44, b.h + 52); continue; }
    for (let x = b.x - b.w / 2 + 14, k = 0; x < b.x + b.w / 2; x += 27, k++) wash(c, x, b.y + (hash(k, 4) - 0.5) * 6, 13, b.h / 2 - 4, k % 2 ? '#C99A6A' : '#B98858', { a: 1.1, seed: k + 5, wob: 0.05, n: 8, edgeA: 0.3 });
    for (const sy of [-1, 1]) brushLine(c, [[b.x - b.w / 2 - 6, b.y + sy * (b.h / 2 - 4)], [b.x, b.y + sy * (b.h / 2 + 2)], [b.x + b.w / 2 + 6, b.y + sy * (b.h / 2 - 4)]], 10, '#8E6244', 0.9, 7 + sy);
  }
  for (const s of L.stones) for (let k = 0; k < 6; k++) {
    const x = s.x - s.w / 2 + 34 + k * (s.w - 68) / 5, y = s.y + (k % 2 ? -18 : 18);
    wash(c, x - 5, y + 8, 40, 30, SHADOW, { a: 0.25, seed: k, edge: 0 });
    if (A) { if (k % 3 === 0) drawArt(c, 'stones', x + (s.w - 68) / 5, y + 34, 70, 0.5); continue; }
    wash(c, x, y, 38, 30, P.rock, { a: 1.2, seed: k + 60, wob: 0.14, n: 9, edgeA: 0.3 });
    wash(c, x + 8, y - 8, 20, 12, '#FFF1D8', { a: 0.45, seed: k + 70, edge: 0 });
  }
  if (L.def.river) for (let i = 0; i < 160; i++) {   // reeds on the banks
    const wc = L.waterCells[r() * L.waterCells.length | 0], x = (wc % L.cols + 0.5) * CS + (r() - 0.5) * 130, y = ((wc / L.cols | 0) + 0.5) * CS + (r() - 0.5) * 60;
    if (y < top + 30 || typeAt(x, y) === 2 || typeAt(x, y) === 3) continue;
    c.strokeStyle = rgba(r() < 0.5 ? '#7E9A5E' : '#A9B878', 0.8); c.lineWidth = 2.5;
    for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(x + k * 5, y); c.quadraticCurveTo(x + k * 5 + (r() - 0.5) * 10, y - 20, x + k * 5 + (r() - 0.5) * 16, y - 32 - r() * 16); c.stroke(); }
  }
  // flowers and tufts. The calm look: a few clumps of the level's flowers and some tufts in the ground's own color
  if (A) for (let i = 0; i < 60; i++) {
    const x = r() * L.W, y = top + 40 + r() * (L.H - top - 60); if (typeAt(x, y) !== 0) continue;
    drawArt(c, P.flowers2, x, y, 30 + r() * 16, 0.5);
  }
  for (let i = 0; i < (A ? 0 : 900); i++) {
    const x = r() * L.W, y = top + 20 + r() * (L.H - top - 30); if (typeAt(x, y) !== 0) continue;
    if (i % 3 === 0) {
      c.strokeStyle = rgba(shade(P.g1, -0.3), 0.5); c.lineWidth = 2;
      for (let k = -1; k <= 1; k++) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + k * 4, y - 9, x + k * 9, y - 14 - r() * 6); c.stroke(); }
    } else {
      const col = P.flowers[i % P.flowers.length], s = 4 + r() * 5;
      if (N) { const gg = c.createRadialGradient(x, y, 1, x, y, s * 3.4); gg.addColorStop(0, rgba(col, 0.32)); gg.addColorStop(1, rgba(col, 0)); c.fillStyle = gg; c.beginPath(); c.arc(x, y, s * 3.4, 0, TAU); c.fill(); }      // night flowers glow
      for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + i; wash(c, x + Math.cos(a) * s * 0.8, y + Math.sin(a) * s * 0.8, s * 0.62, s * 0.62, col, { a: 0.9, seed: i + k, layers: 1, edge: 0 }); }
      wash(c, x, y, s * 0.42, s * 0.42, N ? '#FFF6D0' : '#F3D36B', { a: 1, seed: i, layers: 1, edge: 0 });
    }
  }
  if (L.def.key === 'forest') for (let i = 0; i < 70; i++) {   // mushrooms
    const x = r() * L.W, y = top + 30 + r() * (L.H - top - 50); if (typeAt(x, y) !== 0) continue;
    wash(c, x, y, 5, 9, '#FBF3DE', { a: 1, seed: i, layers: 1 }); wash(c, x, y - 9, 13, 8, i % 2 ? '#D9735C' : '#E9A07A', { a: 1.1, seed: i + 2, layers: 2 });
    wash(c, x - 4, y - 10, 2.5, 2, '#FFF6E0', { a: 0.9, seed: i, layers: 1, edge: 0 }); wash(c, x + 5, y - 8, 2, 1.8, '#FFF6E0', { a: 0.9, seed: i, layers: 1, edge: 0 });
  }
  // long warm shadows, then everything solid
  paintDecorStill(c, L);
  for (const s of L.solids) wash(c, s.x - s.r * 0.5 * sl, s.y + s.r * 0.42, s.r * 1.08 * sl, s.r * 0.62, SHADOW, { a: 0.3, seed: s.seed, wob: 0.18, edge: 0 });
  if (A) drawArt(c, 'nest', L.nest.x, L.nest.y + 96, 220, 0.5); else drawNest(c, L.nest.x, L.nest.y, 120, 17, 0);
  for (const s of L.solids) {
    if (A && (s.kind === 'rock' || s.kind === 'hay')) { const n = s.kind === 'rock' ? P.rock : P.bush, im = ART[n]; drawArt(c, n, s.x, s.y + s.r * 0.75, Math.min(s.r * 2.4 * im.naturalHeight / im.naturalWidth, s.r * 2.6), 0.5); continue; }
    if (s.kind === 'rock') (N ? paintCrystalRock : paintRock)(c, s.x, s.y, s.r, P.rock, s.seed); else if (s.kind === 'hay') (N ? paintShroom : paintHay)(c, s.x, s.y, s.r, s.seed);
  }
  for (const l of L.lanterns) { wash(c, l.x - 16, l.y + 4, 22, 8, SHADOW, { a: 0.3, seed: 2, edge: 0 }); if (A) drawArt(c, 'torch', l.x, l.y + 8, 120, 0.5); else (N ? paintTorch : paintLantern)(c, l.x, l.y); }
  const trees = L.trees.slice().sort((a, b) => a.y - b.y);
  for (const t of trees) if (!t.dyn) paintTree(c, t, P);
  // sprites that are drawn every frame, sorted with the heroes
  for (const t of L.dynTrees) {
    const w = Math.ceil(t.R * 2.8), h = Math.ceil(t.R * 2.7), sc = makeCanvas(w, h);
    paintTree(sc.getContext('2d'), t, P, t.x - w / 2, t.y - t.R * 1.35);
    t.sprite = sc; L.sprites.push({ kind: 'tree', ref: t, y: t.y + t.R * 1.1 });
  }
  for (const m of L.mills) {
    const sc = makeCanvas(160, 320); if (A) drawArt(sc.getContext('2d'), 'totem', 80, 290, 270, 0.5); else (N ? paintTotem : paintMillTower)(sc.getContext('2d'), 80, 280);
    m.sprite = sc; L.sprites.push({ kind: 'mill', ref: m, y: m.y + 10 });
  }
  // top band: sky and far hills, or the cliff with the waterfall
  if (A && !L.def.cliff) {                // the calm look: no sky, the ground goes on under a thick row of the level's trees
    let g2 = c.createLinearGradient(0, 0, 0, top); g2.addColorStop(0, P.band); g2.addColorStop(1, P.g0); c.fillStyle = g2; c.fillRect(0, 0, L.W, top + 4);
    for (let row = 0; row < 3; row++) for (let x = -60 + row * 70; x < L.W + 120; x += 150 + r() * 40) drawArt(c, P.tree[(x / 7 + row | 0) % P.tree.length], x, 140 + row * ((top - 120) / 3) + r() * 30, 190 + r() * 60, 0.5);
  }
  else if (N) { paintNightSky(c, 0, 0, L.W, L.skyH + 40, L.seed, { sunR: L.def.cliff ? 46 : 62, clouds: 9 }); paintHills(c, 0, L.skyH + 20, L.W, L.def.cliff ? 110 : 170, 0, L.seed + 5, NIGHT_HILLS, true); }
  else { paintSky(c, 0, 0, L.W, L.skyH + 40, L.skyT, L.seed, { sunR: L.def.cliff ? 46 : 62, clouds: 9 }); paintHills(c, 0, L.skyH + 20, L.W, L.def.cliff ? 110 : 170, L.skyT, L.seed + 5); }
  if (L.def.cliff) {
    const y0 = L.skyH, y1 = top, CL = A && P.cliff ? P.cliff : N ? ['#7E72B8', '#4E4486', '#6E62A8', '#9A8ED0', '#4A3F80', '#8478BC', '#3E356E', '#B9AEE6', '#3A3268'] : ['#CDAF98', '#93747E', '#B8948A', '#D9BFA6', '#8E6E7C', '#C4A090', '#7A5A6C', '#E9D2B8', '#7A5A6C'];
    g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, CL[0]); g.addColorStop(1, CL[1]);
    c.fillStyle = g; c.fillRect(0, y0, L.W, y1 - y0 + 6);
    for (let i = 0; i < 260; i++) { const x = r() * L.W, y = y0 + r() * (y1 - y0); wash(c, x, y, 40 + r() * 90, 20 + r() * 50, CL[2 + i % 4], { a: 0.22, seed: i, wob: 0.3, edge: 2, edgeA: 0.08 }); }
    c.lineCap = 'round';
    for (let i = 0; i < 420; i++) { const x = r() * L.W, y = y0 + r() * (y1 - y0 - 40); c.strokeStyle = rgba(i % 2 ? CL[6] : CL[7], 0.22); c.lineWidth = 2 + r() * 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - 0.5) * 14, y + 30 + r() * 60); c.stroke(); }
    for (let x = 0; x < L.W; x += 46) { wash(c, x + r() * 30, y0 + 4 + r() * 10, 50 + r() * 30, 24 + r() * 14, P.canopy[r() * P.canopy.length | 0], { a: 0.95, seed: x, wob: 0.2, edgeA: 0.2 }); }
    for (let x = 0; x < L.W; x += 60) wash(c, x + r() * 40, y1 + 6, 46 + r() * 30, 16, CL[8], { a: 0.3, seed: x + 3, edge: 0 });
    if (L.vines) for (let k = 0; k < 9; k++) { const vx = 140 + k * 340 + r() * 120; if (Math.abs(vx - L.vines.x) < 330) continue; paintVines(c, vx, y0 + 6, 150 + r() * 120, y1 - y0 - 60 - r() * 120, k * 7 + 3, 0, P); }      // vines hang all along the cliff; only one bunch hides a door
    // remember the plain cliff over the cave, then paint the cave itself
    const cvr = L.cover, cc = makeCanvas(cvr.w, cvr.h); cc.getContext('2d').drawImage(cv, cvr.x, cvr.y, cvr.w, cvr.h, 0, 0, cvr.w, cvr.h); L.coverCv = cc;
    if (L.def.door) paintDoor(cc.getContext('2d'), 1620 - cvr.x, top - cvr.y);                                                                                                                                   // the door of the hideout, at the foot of the cliff
    const cvx = L.cave;
    c.save(); c.beginPath(); c.rect(cvr.x, cvr.y, cvr.w, cvr.h); c.clip();
    const room = (grow, col, al) => {       // rounded cave room plus the short tunnel to the waterfall
      wash(c, 1600, 342, 178 + grow, 112 + grow, col, { a: al, seed: 4, wob: 0.07, n: 16, edge: 0 });
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) wash(c, 1600 + sx * 112, 342 + sy * 58, 62 + grow, 56 + grow, col, { a: al, seed: 5 + sx + sy * 2, wob: 0.1, edge: 0 });
      wash(c, 1620, 478, 66 + grow, 70 + grow * 0.5, col, { a: al, seed: 9, wob: 0.06, edge: 0 });
    };
    room(22, '#4E3A54', 1.3); room(6, '#6E5668', 1.3); room(-20, '#806878', 0.6);
    wash(c, 1600, 345, 130, 80, '#C99A6A', { a: 0.4, seed: 6, edge: 0 }); wash(c, 1600, 340, 70, 44, '#FFE0A0', { a: 0.4, seed: 7, edge: 0 });
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, x = 1600 + Math.cos(a) * 186, y = 342 + Math.sin(a) * 112; if (Math.abs(x - 1620) < 90 && y > 400) continue; const cl = ['#E9B8C4', '#BFE0D4', '#F3D9A0', '#C8B8E0'][i % 4]; c.fillStyle = rgba(cl, 0.9); c.beginPath(); c.moveTo(x - 9, y + 8); c.lineTo(x, y - 20 - hash(i, 2) * 14); c.lineTo(x + 9, y + 8); c.closePath(); c.fill(); }
    c.restore();
    for (let x = 1480; x < 1760; x += 40) wash(c, x + r() * 20, top + 46, 30, 20, '#A99A94', { a: 0.5, seed: x, edge: 2 });   // wet stones behind the fall
  } else if (!A) {
    for (let x = -20; x < L.W + 40; x += 42) {
      const y = top - 34 + r() * 26, col = P.canopy[r() * P.canopy.length | 0];
      wash(c, x, y, 46 + r() * 34, 30 + r() * 22, col, { a: 1.1, seed: x + 1, wob: 0.22, edgeA: 0.2 });
      wash(c, x + 10, y - 10, 22, 14, shade(col, 0.4), { a: 0.4, seed: x + 2, edge: 0 });
      wash(c, x - 8, y + 14, 30, 14, shade(col, -0.35), { a: 0.3, seed: x + 3, edge: 0 });
    }
  }
  // leafy frame along the other edges. The calm look: the level's bushes and trees
  if (A) for (let i = 0; i < 70; i++) {
    const e = i % 3, x = e === 0 ? r() * L.W : e === 1 ? -20 + r() * 50 : L.W + 20 - r() * 50, y = e === 0 ? L.H + 40 - r() * 30 : top + 60 + r() * (L.H - top);
    drawArt(c, i % 4 ? P.bush : P.tree[i % 2], x, y, 110 + r() * 70, 0.5);
  }
  for (let i = 0; i < (A ? 0 : 150); i++) {
    const e = i % 3, col = P.canopy[i % P.canopy.length];
    const x = e === 0 ? r() * L.W : e === 1 ? -10 + r() * 26 : L.W + 10 - r() * 26, y = e === 0 ? L.H + 6 - r() * 22 : top + r() * (L.H - top);
    wash(c, x, y, 50 + r() * 40, 36 + r() * 26, shade(col, -0.1), { a: 0.95, seed: i + 5, wob: 0.22, edgeA: 0.2 });
    wash(c, x + 8, y - 10, 22, 14, shade(col, 0.35), { a: 0.35, seed: i + 6, edge: 0 });
  }
  finishPaint(c, L.W, L.H, L.skyT, r, N, A);
  L.bg = cv; L.skyTop = topColor(cv);
  L.overlay = A ? makeOverlay('#FFF4E0', 0.03, 0.28, true) : N ? makeOverlay('#C8D0FF', 0.1, 0.5, true) : makeOverlay(mix('#FFF4E0', '#FFC08C', L.skyT), 0.1 + L.skyT * 0.16, 0.42);
  return finishLook(L);
}
/* A bunch of hanging vines with leaves and a few glowing flowers. sway moves the lower ends (the bunch over the door is drawn every frame). */
function paintVines(c, x, y, w, len, seed, sway, P) {
  const n = Math.max(5, w / 22 | 0);
  c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const vx = x - w / 2 + (i + 0.5) * w / n + (hash(seed, i) - 0.5) * 14, vl = len * (0.62 + hash(seed + 1, i) * 0.38), sw = Math.sin(sway + i * 0.9) * 12 * (sway ? 1 : 0), col = P.canopy[i % P.canopy.length];
    c.strokeStyle = rgba(shade(col, -0.18), 0.95); c.lineWidth = 6 + hash(seed + 2, i) * 4;
    c.beginPath(); c.moveTo(vx, y); c.quadraticCurveTo(vx + (hash(seed + 3, i) - 0.5) * 30 + sw * 0.4, y + vl * 0.5, vx + sw, y + vl); c.stroke();
    for (let k = 1; k < 7; k++) { const u = k / 7, lx = vx + sw * u * u + (k % 2 ? 9 : -9), ly = y + vl * u; c.fillStyle = rgba(k % 3 ? col : shade(col, 0.3), 0.95); c.beginPath(); c.ellipse(lx, ly, 10, 5.5, k % 2 ? 0.5 : -0.5, 0, TAU); c.fill(); }
    if (i % 3 === 0) { const fc = P.flowers[i % P.flowers.length], fy = y + vl; const g = c.createRadialGradient(vx + sw, fy, 1, vx + sw, fy, 20); g.addColorStop(0, rgba(fc, 0.7)); g.addColorStop(1, rgba(fc, 0)); c.fillStyle = g; c.beginPath(); c.arc(vx + sw, fy, 20, 0, TAU); c.fill(); c.fillStyle = fc; c.beginPath(); c.arc(vx + sw, fy, 5.5, 0, TAU); c.fill(); }
  }
}
/* The door of the hideout: an arched wooden door with a rainbow knob. x = middle, y = the ground line. */
function paintDoor(c, x, y) {
  c.fillStyle = '#3A2F5E'; c.beginPath(); c.moveTo(x - 54, y + 4); c.lineTo(x - 54, y - 62); c.quadraticCurveTo(x, y - 122, x + 54, y - 62); c.lineTo(x + 54, y + 4); c.closePath(); c.fill();
  c.save(); c.beginPath(); c.moveTo(x - 46, y + 4); c.lineTo(x - 46, y - 60); c.quadraticCurveTo(x, y - 112, x + 46, y - 60); c.lineTo(x + 46, y + 4); c.closePath(); c.clip();
  for (let i = 0; i < 5; i++) { c.fillStyle = i % 2 ? '#A8744E' : '#B98458'; c.fillRect(x - 46 + i * 18.4, y - 120, 18.6, 126); }
  c.fillStyle = 'rgba(90,50,70,0.25)'; c.fillRect(x - 46, y - 120, 30, 126);
  c.restore();
  c.strokeStyle = '#E0A04A'; c.lineWidth = 5; c.lineCap = 'round'; for (const yy of [y - 66, y - 22]) { c.beginPath(); c.moveTo(x - 42, yy); c.lineTo(x + 6, yy); c.stroke(); }
  const g = c.createRadialGradient(x + 26, y - 44, 1, x + 26, y - 44, 22); g.addColorStop(0, 'rgba(255,240,200,0.8)'); g.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = g; c.beginPath(); c.arc(x + 26, y - 44, 22, 0, TAU); c.fill();
  for (let i = 0; i < 7; i++) { c.fillStyle = RAINBOW[i]; c.beginPath(); c.moveTo(x + 26, y - 44); c.arc(x + 26, y - 44, 8, i / 7 * TAU, (i + 1) / 7 * TAU); c.closePath(); c.fill(); }
}
/* Granulation speckles, watercolor blooms and the warm afternoon light (at night: the cool light of the moon). */
/* ---------- The frame of the new levels (docs/24-sisteme-noi.md, S7.4 and S7.5) ----------
   A level with look: 'diorama' (levels 7 - 12, or every level with CONFIG.look.preview) gets, once, at loading:
   - haze over its far part (the top of the picture): paler and bluer, like air between the eye and the far away;
   - the front plane (L.front): big dark blurred things at the edges of the screen;
   - the paper texture multiplied into the picture itself (L.paperBaked), when the light map is on: the light map then
     takes the place of the whole overlay (paper + night vignette). On the slow test machine every full-screen pass
     costs a few ms, and the light map is already one.
   Levels 1 - 6 stay as they are. */
function isDiorama(L) { return !!(L && L.def && (L.def.look === 'diorama' || CONFIG.look.preview)); }
function levelAmbient(L) { return L.def.ambient || (L.night ? '#C4BCEE' : '#F0E4D4'); }
function finishLook(L) {
  if (!isDiorama(L)) return L;
  const c = L.bg.getContext('2d'), hz = Math.min(L.H * 0.45, 800);
  const g = c.createLinearGradient(0, 0, 0, hz);                         // the haze: strongest at the top (the farthest), gone by the middle
  g.addColorStop(0, 'rgba(176,196,240,0.34)'); g.addColorStop(1, 'rgba(176,196,240,0)');
  c.fillStyle = g; c.fillRect(0, 0, L.W, hz);
  if (CONFIG.look.waves && L.waterCells.length) L.water = paintWater(L, c);
  L.front = paintFront(L);
  if (CONFIG.look.lights) {        // the paper goes into the picture once: the light map then replaces the whole overlay (one full-screen pass, not two)
    if (!PAPER) PAPER = makePaper();
    c.globalCompositeOperation = 'multiply';
    for (let y = 0; y < L.H; y += H) for (let x = 0; x < L.W; x += W) c.drawImage(PAPER, x, y);
    c.globalCompositeOperation = 'source-over';
    L.paperBaked = true;
  }
  return L;
}
/* The water of the new levels (T6.8). Once, at loading:
   - L.water.path: the water cells as one Path2D (a rectangle for every run of cells on a row, a little smaller than the cells,
     so the waves stop before the bank); every frame fills it twice with the wave pattern (drawWater);
   - the reflection: the bank above every column of water, upside down, faint and out of focus, painted into the picture.
     It is made at a quarter of the size (that is what makes it soft), faded with depth, cut with a mask of soft discs
     (the shore of the water is not square), then laid over the water with a low alpha;
   - L.water.spark: the places where it sparkles. */
function paintWater(L, c) {
  const path = new Path2D(), G = L.grid, cols = L.cols, rows = L.rows, spark = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols;) {
      if (G[y * cols + x] !== 2) { x++; continue; }
      let x1 = x; while (x1 < cols && G[y * cols + x1] === 2) x1++;
      path.rect(x * CS + 6, y * CS + 6, (x1 - x) * CS - 12, CS - 12); x = x1;
    }
  }
  const Q = 4, rf = makeCanvas(Math.ceil(L.W / Q), Math.ceil(L.H / Q)), rc = rf.getContext('2d'), mk = makeCanvas(rf.width, rf.height), mc = mk.getContext('2d');
  rc.imageSmoothingEnabled = true;
  const disc = makeCanvas(64, 64), dc = disc.getContext('2d'), gg = dc.createRadialGradient(32, 32, 10, 32, 32, 32);
  gg.addColorStop(0, 'rgba(0,0,0,1)'); gg.addColorStop(1, 'rgba(0,0,0,0)'); dc.fillStyle = gg; dc.fillRect(0, 0, 64, 64);
  for (let x = 0; x < cols; x++) {
    let y = 0;
    while (y < rows) {
      if (G[y * cols + x] !== 2) { y++; continue; }
      const y0 = y; while (y < rows && G[y * cols + x] === 2) y++;       // one column of water: from y0 to y
      for (let d = 0; d < Math.min(y - y0, 4); d++) {
        const sy = y0 * CS - (d + 1) * CS; if (sy < 0) break;                      // the bank above the water, mirrored about its top edge
        rc.save(); rc.globalAlpha = 1 - d * 0.22; rc.translate(0, (y0 * CS + d * CS) / Q + CS / Q); rc.scale(1, -1);
        rc.drawImage(L.bg, x * CS, sy, CS, CS, x * CS / Q, 0, CS / Q, CS / Q); rc.restore();
      }
      for (let k = y0; k < y; k++) mc.drawImage(disc, x * CS / Q - CS / Q * 0.45, k * CS / Q - CS / Q * 0.45, CS / Q * 1.9, CS / Q * 1.9);
    }
  }
  rc.globalCompositeOperation = 'destination-in'; rc.drawImage(mk, 0, 0);
  c.save(); c.globalAlpha = 0.3; c.imageSmoothingEnabled = true; c.drawImage(rf, 0, 0, L.W, L.H); c.restore();
  const wc = L.waterCells, n = Math.min(24, wc.length);
  for (let i = 0; i < n; i++) { const k = wc[(i * 53 + 7) % wc.length]; spark.push({ x: (k % cols + 0.5) * CS + (hash(81, i) - 0.5) * CS * 0.8, y: ((k / cols | 0) + 0.5) * CS + (hash(82, i) - 0.5) * CS * 0.8, ph: hash(83, i) * TAU, s: 9 + hash(84, i) * 9 }); }
  return { path, spark };
}
/* The front plane: painted once at half resolution (960 x 540), blurred, then blown up once to a canvas the size of the screen.
   items: a rectangle on the screen for each thing (x, y, w, h in screen units), and its alpha.
   Nothing is put inside the middle rectangle of 1500 x 760, nor in a margin of FRONT_PAR_MAX around it,
   so the parallax cannot push a thing into the middle. */
const FRONT_MID = { x: 210, y: 160, w: 1500, h: 760 }, FRONT_PAR_MAX = 60;
function frontSlots() {          // where the things can be: two tall corners at the top, the two sides, two places at the bottom
  const m = FRONT_PAR_MAX, L0 = FRONT_MID.x - m, R0 = FRONT_MID.x + FRONT_MID.w + m, B0 = FRONT_MID.y + FRONT_MID.h + m;
  return [
    { at: 'top', x: 0, y: 0, w: L0, h: 640 }, { at: 'top', x: R0, y: 0, w: W - R0, h: 600 },
    { at: 'side', x: 0, y: 620, w: L0, h: 460 }, { at: 'side', x: R0, y: 560, w: W - R0, h: 520 },
    { at: 'bottom', x: 330, y: B0, w: 420, h: H - B0 }, { at: 'bottom', x: 1180, y: B0, w: 460, h: H - B0 }
  ];                             // nothing along the top middle: the band of cards (HUD_TOP) covers it anyway
}
function paintFront(L) {
  const key = L.def.key, r = rng((L.seed || 7) + 911);
  const kinds = key === 'cave' ? { top: 'stal', side: 'stal', bottom: 'rock' }
    : (key === 'works' || key === 'castle') ? { top: 'chain', side: 'pillar', bottom: 'rock' }
    : { top: 'vine', side: 'leaf', bottom: 'leaf' };
  const tmp = makeCanvas(960, 540), t = tmp.getContext('2d');
  const amb = levelAmbient(L), day = (() => { const c = hex(amb); return (c[0] + c[1] + c[2]) / 765 > 0.75; })();
  // a bright daylight (level 7, sunrise) mixed 70% toward the violet makes a greyish mauve: in daylight the violet is stronger and more saturated
  const base = day ? mix(amb, '#3A1A60', 0.8) : mix(amb, '#2A2048', 0.7), base2 = mix(base, '#1F7A4A', key === 'cave' || key === 'works' || key === 'castle' ? 0.1 : 0.6);   // leaves: a deep green, never a grey
  const items = [];
  for (const sl of frontSlots()) {
    const kind = kinds[sl.at], x = sl.x / 2, y = sl.y / 2, w = sl.w / 2, h = sl.h / 2;
    t.save(); t.beginPath(); t.rect(x, y, w, h); t.clip();
    paintFrontThing(t, kind, sl.at, x, y, w, h, r, base, base2);
    t.restore();
    items.push({ x: sl.x, y: sl.y, w: sl.w, h: sl.h, a: 1, kind });
  }
  // a thin warm rim on the side the light comes from (upper left), so the dark things still read against a dark night
  const rim = makeCanvas(960, 540), rc = rim.getContext('2d');
  rc.drawImage(tmp, 0, 0); rc.globalCompositeOperation = 'source-in'; rc.fillStyle = rgba(mix(base2, KEY, 0.45), 0.6); rc.fillRect(0, 0, 960, 540);   // the rim keeps the hue of the things: warm light over a violet and a green made greys
  t.globalCompositeOperation = 'destination-over'; t.drawImage(rim, -2, -2); t.globalCompositeOperation = 'source-over';
  const half = makeCanvas(960, 540), hc = half.getContext('2d');
  hc.filter = 'blur(2.5px)'; hc.drawImage(tmp, 0, 0); hc.filter = 'none';    // out of focus: painted at half size, blurred...
  const cv = makeCanvas(W, H); cv.getContext('2d').drawImage(half, 0, 0, W, H);  // ...then blown up once, here: drawn 1:1 on every frame it costs half
  return { cv, items, t: -1 };
}
function paintFrontThing(t, kind, at, x, y, w, h, r, base, base2) {
  const fromLeft = x < 480 / 1, cx = x + w / 2;
  t.lineCap = 'round'; t.lineJoin = 'round';
  if (kind === 'vine') {                                   // two or three lianas hanging from the top, with big leaves
    for (let i = 0; i < 3; i++) {
      const x0 = x + w * (0.2 + i * 0.3), sway = (r() - 0.5) * w * 0.6, len = h * (0.6 + r() * 0.4);
      t.strokeStyle = i % 2 ? base : base2; t.lineWidth = 7 + r() * 5;
      t.beginPath(); t.moveTo(x0, y - 5); t.bezierCurveTo(x0 + sway, y + len * 0.4, x0 - sway, y + len * 0.7, x0 + sway * 0.5, y + len); t.stroke();
      for (let j = 0; j < 4; j++) { const u = 0.25 + j * 0.2, lx = x0 + sway * Math.sin(u * 3), ly = y + len * u; frontLeaf(t, lx, ly, 18 + r() * 14, (j % 2 ? 1 : -1) * (0.6 + r() * 0.5), j % 2 ? base2 : base); }
    }
  } else if (kind === 'leaf') {                            // one or two giant leaves coming in from the edge
    const n = at === 'bottom' ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const lx = at === 'bottom' ? x + w * (0.3 + i * 0.45) : (fromLeft ? x + w * 0.2 : x + w * 0.8), ly = at === 'bottom' ? y + h * 1.1 : y + h * (0.55 + r() * 0.2);
      const ang = at === 'bottom' ? -Math.PI / 2 + (i ? 0.5 : -0.5) : (fromLeft ? -0.5 - r() * 0.4 : Math.PI + 0.5 + r() * 0.4);
      frontLeaf(t, lx, ly, at === 'bottom' ? h * 1.6 : w * 1.5, ang, i % 2 ? base2 : base);
    }
  } else if (kind === 'stal') {                            // stalactites from the top, or a stalagmite at a side
    const n = Math.max(2, w / 34 | 0);
    for (let i = 0; i < n; i++) {
      const sx = x + (i + 0.5) * w / n, sw = w / n * (0.7 + r() * 0.5), sh = (at === 'top' ? h : h * 0.8) * (0.4 + r() * 0.6);
      t.fillStyle = i % 2 ? base : base2; t.beginPath();
      if (at === 'top') { t.moveTo(sx - sw / 2, y - 4); t.quadraticCurveTo(sx - sw * 0.1, y + sh * 0.7, sx, y + sh); t.quadraticCurveTo(sx + sw * 0.1, y + sh * 0.7, sx + sw / 2, y - 4); }
      else { t.moveTo(sx - sw / 2, y + h + 4); t.quadraticCurveTo(sx - sw * 0.1, y + h - sh * 0.7, sx, y + h - sh); t.quadraticCurveTo(sx + sw * 0.1, y + h - sh * 0.7, sx + sw / 2, y + h + 4); }
      t.closePath(); t.fill();
    }
  } else if (kind === 'chain') {                           // chains hanging from the top
    for (let i = 0; i < 2; i++) {
      const x0 = x + w * (0.3 + i * 0.4), n = (h * (0.6 + r() * 0.4)) / 16 | 0;
      t.strokeStyle = i ? base2 : base; t.lineWidth = 5;
      for (let j = 0; j < n; j++) { t.beginPath(); if (j % 2) t.ellipse(x0, y + j * 15, 3, 9, 0, 0, TAU); else t.ellipse(x0, y + j * 15, 7, 9, 0, 0, TAU); t.stroke(); }
    }
  } else if (kind === 'pillar') {                          // a big column at the side
    const pw = w * 0.7, px = fromLeft ? x : x + w - pw;
    t.fillStyle = base; t.fillRect(px, y - 10, pw, h + 20);
    t.fillStyle = base2; t.fillRect(px + (fromLeft ? pw * 0.6 : 0), y - 10, pw * 0.4, h + 20);
    for (let j = 0; j < 4; j++) { t.fillStyle = base2; t.fillRect(px - 6, y + h * (0.2 + j * 0.22), pw + 12, 7); }
  } else {                                                 // rock: big dark round stones at the bottom
    for (let i = 0; i < 3; i++) { t.fillStyle = i % 2 ? base : base2; blobPath(t, x + w * (0.2 + i * 0.3), y + h * 1.05, w * 0.22, h * 0.9, i + 3, 0.08, 10); t.fill(); }
  }
}
function frontLeaf(t, x, y, len, ang, col) {               // a long pointed leaf from (x, y) in the direction ang, with a pale midrib
  t.save(); t.translate(x, y); t.rotate(ang);
  t.fillStyle = col; t.beginPath(); t.moveTo(0, 0); t.bezierCurveTo(len * 0.3, -len * 0.32, len * 0.75, -len * 0.22, len, 0); t.bezierCurveTo(len * 0.75, len * 0.22, len * 0.3, len * 0.32, 0, 0); t.fill();
  t.strokeStyle = rgba(shade(col, 0.35), 0.6); t.lineWidth = Math.max(1.5, len * 0.025); t.beginPath(); t.moveTo(0, 0); t.lineTo(len * 0.92, 0); t.stroke();
  t.restore();
}
function finishPaint(c, w, h, skyT, r, night, calm) {
  if (calm) { for (let i = 0; i < 3000; i++) { c.fillStyle = i % 2 ? 'rgba(110,70,90,0.05)' : 'rgba(255,250,235,0.07)'; c.beginPath(); c.arc(r() * w, r() * h, 0.6 + r() * 1.4, 0, TAU); c.fill(); } return; }      // the calm look: only a light paper grain
  for (let i = 0; i < 7000; i++) { c.fillStyle = i % 2 ? 'rgba(110,70,90,0.07)' : 'rgba(255,250,235,0.1)'; c.beginPath(); c.arc(r() * w, r() * h, 0.6 + r() * 1.6, 0, TAU); c.fill(); }
  for (let i = 0; i < 260; i++) { blobPath(c, r() * w, r() * h, 14 + r() * 50, 10 + r() * 36, i, 0.3, 11); c.strokeStyle = 'rgba(255,250,232,0.09)'; c.lineWidth = 2 + r() * 3; c.stroke(); }
  c.save(); c.globalCompositeOperation = 'soft-light';
  const g = c.createRadialGradient(w * 0.74, 0, 100, w * 0.6, h * 0.3, Math.max(w, h) * 0.95);
  if (night) { g.addColorStop(0, 'rgba(225,235,255,0.7)'); g.addColorStop(0.5, 'rgba(170,190,255,0.22)'); g.addColorStop(1, 'rgba(60,40,130,0.4)'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.restore(); return; }
  g.addColorStop(0, 'rgba(255,232,170,0.75)'); g.addColorStop(0.5, 'rgba(255,214,160,0.25)'); g.addColorStop(1, 'rgba(120,80,140,' + (0.3 + skyT * 0.25) + ')');
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.restore();
}

/* The boss arena: one screen, the tallest tree in the valley. */
function genBoss() {
  const WW = 1920, WH = 1080, cols = WW / CS, rows = WH / CS;
  const L = { idx: levelCount(), def: BOSS_DEF, boss: true, seed: 4242, W: WW, H: WH, cols, rows, top: 480, skyH: 420, pal: PALS.sunset, skyT: 1.05,
    grid: new Uint8Array(cols * rows), flag: new Uint8Array(cols * rows), solids: [], trees: [], dynTrees: [], beetles: [], lanes: [], cones: [], bridges: [], stones: [],
    mills: [], lanterns: [], stars: [], waves: [[]], waterCells: [], sprites: [], spawn: { x: 760, y: 820 }, nest: { x: 960, y: 300 }, NW: 1, minZoom: 1, totalEggs: 0 };
  for (let cy = 0; cy < 12; cy++) for (let cx = 0; cx < cols; cx++) L.grid[cy * cols + cx] = 4;   // heroes stay below the tree, the ball flies over
  L.ci = (x, y) => clamp(y / CS | 0, 0, rows - 1) * cols + clamp(x / CS | 0, 0, cols - 1);
  L.reach = new Uint8Array(cols * rows);
  for (let cy = 13; cy < rows - 1; cy++) for (let cx = 1; cx < cols - 1; cx++) L.reach[cy * cols + cx] = 1;
  L.treeBase = { x: 960, y: 560 };
  L.solids.push({ x: 960, y: 548, r: 70, kind: 'trunk', noBall: true, seed: 1 });
  const cv = makeCanvas(WW, WH), c = cv.getContext('2d'), P = L.pal, r = rng(77);
  paintSky(c, 0, 0, WW, 520, L.skyT, 9, { sunX: 0.2, sunR: 70, clouds: 7 });
  paintHills(c, 0, 470, WW, 190, L.skyT, 12);
  let g = c.createLinearGradient(0, 440, 0, WH); g.addColorStop(0, P.g0); g.addColorStop(1, P.g1);
  c.fillStyle = g; c.beginPath(); c.moveTo(0, 470); for (let x = 0; x <= WW; x += 60) c.lineTo(x, 462 + Math.sin(x / 300) * 14); c.lineTo(WW, WH); c.lineTo(0, WH); c.closePath(); c.fill();
  for (let i = 0; i < 60; i++) wash(c, r() * WW, 480 + r() * 600, 120 + r() * 240, 60 + r() * 150, P.tints[i % P.tints.length], { a: 0.12 + r() * 0.1, seed: i + 1, wob: 0.28, edge: 2, edgeA: 0.05 });
  c.lineCap = 'round';
  for (let i = 0; i < 1800; i++) { const x = r() * WW, y = 480 + r() * 600; c.strokeStyle = rgba(i % 3 ? shade(P.g1, -0.22) : shade(P.g0, 0.3), 0.14 + r() * 0.12); c.lineWidth = 1.2 + r() * 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - 0.5) * 8, y - 8 - r() * 16); c.stroke(); }
  wash(c, 960, 800, 620, 190, P.path, { a: 0.5, seed: 3, wob: 0.12, n: 16, edge: 0 }); wash(c, 960, 800, 480, 130, shade(P.path, 0.4), { a: 0.3, seed: 4, wob: 0.14, n: 16, edge: 0 });
  for (let i = 0; i < 320; i++) { const x = r() * WW, y = 500 + r() * 570; if (Math.abs(x - 960) < 500 && Math.abs(y - 800) < 150) continue; const col = P.flowers[i % P.flowers.length], s = 4 + r() * 5; for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + i; wash(c, x + Math.cos(a) * s * 0.8, y + Math.sin(a) * s * 0.8, s * 0.62, s * 0.62, col, { a: 0.9, seed: i + k, layers: 1, edge: 0 }); } }
  wash(c, 880, 600, 330, 70, SHADOW, { a: 0.3, seed: 6, wob: 0.14, edge: 0 });
  for (const x of [150, 420, 1500, 1770]) { wash(c, x - 16, 574, 22, 8, SHADOW, { a: 0.3, seed: 2, edge: 0 }); paintLantern(c, x, 570); }
  for (let i = 0; i < 60; i++) { const e = i % 3, col = P.canopy[i % P.canopy.length]; const x = e === 0 ? r() * WW : e === 1 ? -10 + r() * 20 : WW + 10 - r() * 20, y = e === 0 ? WH + 6 - r() * 18 : 480 + r() * 600; wash(c, x, y, 50 + r() * 40, 36 + r() * 26, shade(col, -0.1), { a: 0.95, seed: i + 5, wob: 0.22, edgeA: 0.2 }); }
  finishPaint(c, WW, WH, 1, r);
  L.bg = cv; L.skyTop = topColor(cv);
  // the big tree is its own sprite so that it can shake
  const tw = 1240, th = 660, tc = makeCanvas(tw, th), t = tc.getContext('2d'), tr = rng(5);
  const bx = tw / 2, by = th - 40;
  t.fillStyle = '#8A5A48'; t.beginPath(); t.moveTo(bx - 120, by + 30); t.quadraticCurveTo(bx - 70, by - 40, bx - 62, by - 260); t.lineTo(bx + 62, by - 260); t.quadraticCurveTo(bx + 70, by - 40, bx + 120, by + 30); t.quadraticCurveTo(bx + 60, by + 6, bx, by + 22); t.quadraticCurveTo(bx - 60, by + 6, bx - 120, by + 30); t.closePath(); t.fill();
  wash(t, bx - 30, by - 120, 30, 130, '#6A4258', { a: 0.4, seed: 2, edge: 0 }); wash(t, bx + 28, by - 130, 18, 120, '#C99A78', { a: 0.4, seed: 3, edge: 0 });
  for (let i = 0; i < 14; i++) { t.strokeStyle = 'rgba(90,50,70,0.3)'; t.lineWidth = 3; t.beginPath(); const x = bx - 50 + tr() * 100, y = by - 240 + tr() * 220; t.moveTo(x, y); t.quadraticCurveTo(x + (tr() - 0.5) * 12, y + 30, x + (tr() - 0.5) * 8, y + 60); t.stroke(); }
  const blobs = [[0, -330, 330, 190], [-290, -280, 250, 170], [290, -280, 250, 170], [-150, -420, 240, 150], [160, -420, 240, 150], [0, -250, 380, 150], [-420, -210, 150, 110], [420, -210, 150, 110]];
  blobs.forEach((b, i) => { const col = P.canopy[i % P.canopy.length]; wash(t, bx + b[0], by + b[1], b[2], b[3], col, { a: 1.2, seed: i + 10, wob: 0.14, n: 16, edgeA: 0.25 }); wash(t, bx + b[0] + b[2] * 0.25, by + b[1] - b[3] * 0.3, b[2] * 0.5, b[3] * 0.4, shade(col, 0.35), { a: 0.4, seed: i + 30, wob: 0.2, edge: 0 }); wash(t, bx + b[0] - b[2] * 0.25, by + b[1] + b[3] * 0.35, b[2] * 0.6, b[3] * 0.4, shade(col, -0.35), { a: 0.32, seed: i + 50, wob: 0.2, edge: 0 }); });
  for (let k = 0; k < 150; k++) { const b = blobs[k % blobs.length], a = tr() * TAU, d = 0.3 + tr() * 0.7; wash(t, bx + b[0] + Math.cos(a) * b[2] * d, by + b[1] + Math.sin(a) * b[3] * d, 14 + tr() * 22, 10 + tr() * 14, shade(P.canopy[k % P.canopy.length], (tr() - 0.5) * 0.6), { a: 0.5, seed: k, layers: 1, edge: 0 }); }
  L.treeCv = tc; L.treeOff = { x: 960 - bx, y: 580 - by };
  L.overlay = makeOverlay('#FFBE8C', 0.2, 0.45);
  return finishLook(L);
}

/* The last level of the second game: George's arena. A clearing with mountains behind it, torches of fire all around,
   soldiers with spears, and in the middle the stone throne on which George sits. */
function genArena() {
  const WW = 1920, WH = 1080, cols = WW / CS, rows = WH / CS, P = PALS.road;
  const L = { idx: levelCount(), def: BOSS_DEF_L, boss: true, arena: true, night: true, seed: 5151, W: WW, H: WH, cols, rows, top: 480, skyH: 420, pal: P, skyT: 1,
    grid: new Uint8Array(cols * rows), flag: new Uint8Array(cols * rows), solids: [], trees: [], dynTrees: [], beetles: [], lanes: [], cones: [], bridges: [], stones: [],
    mills: [], lanterns: [], stars: [], waves: [[]], waterCells: [], sprites: [], spawn: { x: 760, y: 820 }, nest: { x: 960, y: 300 }, NW: 1, minZoom: 1, totalEggs: 0, torches: [], soldiers: [] };
  for (let cy = 0; cy < 12; cy++) for (let cx = 0; cx < cols; cx++) L.grid[cy * cols + cx] = 4;   // heroes stay below the throne, the ball flies over
  L.ci = (x, y) => clamp(y / CS | 0, 0, rows - 1) * cols + clamp(x / CS | 0, 0, cols - 1);
  L.reach = new Uint8Array(cols * rows);
  for (let cy = 13; cy < rows - 1; cy++) for (let cx = 1; cx < cols - 1; cx++) L.reach[cy * cols + cx] = 1;
  L.treeBase = { x: 960, y: 560 };                 // the foot of the throne: this is where the claws shake it
  for (const sx of [-110, 0, 110]) L.solids.push({ x: 960 + sx, y: 540, r: 62, kind: 'trunk', noBall: true, seed: 1 });
  for (const x of [170, 430, 690, 1230, 1490, 1750]) L.torches.push({ x, y: 548 });
  L.torches.push({ x: 64, y: 800 }, { x: 1856, y: 800 });
  const sol = [[300, 540, 1], [560, 540, 1], [1360, 540, -1], [1620, 540, -1], [70, 660, 1], [84, 950, 1], [1850, 660, -1], [1836, 950, -1]];
  sol.forEach((s, i) => { L.soldiers.push({ x: s[0], y: s[1], face: s[2], seed: i * 1.7, col: ['#6FA88A', '#5E9AA8', '#7AA86A'][i % 3], throwT: 0 }); L.solids.push({ x: s[0], y: s[1] - 8, r: 22, kind: 'soldier', noBall: true, seed: i }); });
  const cv = makeCanvas(WW, WH), c = cv.getContext('2d'), r = rng(88);
  paintNightSky(c, 0, 0, WW, 520, 9, { sunX: 0.2, sunR: 66, clouds: 6 });
  paintMountains(c, 0, 470, WW, 300, 12);
  for (let x = -20; x < WW + 40; x += 44) { const col = P.canopy[r() * P.canopy.length | 0]; wash(c, x, 466 + r() * 14, 44 + r() * 30, 26 + r() * 16, shade(col, -0.2), { a: 1.05, seed: x + 1, wob: 0.22, edgeA: 0.2 }); }      // the jungle at the foot of the mountains
  let g = c.createLinearGradient(0, 440, 0, WH); g.addColorStop(0, P.g0); g.addColorStop(1, P.g1);
  c.fillStyle = g; c.beginPath(); c.moveTo(0, 486); for (let x = 0; x <= WW; x += 60) c.lineTo(x, 480 + Math.sin(x / 300) * 10); c.lineTo(WW, WH); c.lineTo(0, WH); c.closePath(); c.fill();
  for (let i = 0; i < 60; i++) wash(c, r() * WW, 490 + r() * 590, 120 + r() * 240, 60 + r() * 150, RAINBOW[i % 7], { a: 0.06 + r() * 0.07, seed: i + 1, wob: 0.28, edge: 2, edgeA: 0.05 });
  // the floor of the arena: pale trodden sand, a ring of stones around it
  wash(c, 960, 800, 900, 282, '#8E7AB0', { a: 0.55, seed: 3, wob: 0.05, n: 20, edge: 0 });
  wash(c, 960, 800, 860, 262, '#C6B4D8', { a: 0.7, seed: 4, wob: 0.05, n: 20, edge: 0 });
  wash(c, 960, 790, 640, 180, '#E0D2E4', { a: 0.4, seed: 5, wob: 0.1, n: 18, edge: 0 });
  for (let i = 0; i < 64; i++) { const a = i / 64 * TAU, x = 960 + Math.cos(a) * 880, y = 800 + Math.sin(a) * 272; if (y < 540 && Math.abs(x - 960) < 260) continue; wash(c, x, y, 22 + r() * 8, 14 + r() * 5, i % 4 ? '#9A90D0' : RAINBOW[i % 7], { a: 1.05, seed: i + 9, wob: 0.12, n: 9, edgeA: 0.3 }); wash(c, x + 4, y - 4, 9, 5, '#EDE8FF', { a: 0.4, seed: i, edge: 0 }); }
  c.lineCap = 'round';
  for (let i = 0; i < 1500; i++) { const x = r() * WW, y = 490 + r() * 590, e = Math.pow((x - 960) / 880, 2) + Math.pow((y - 800) / 272, 2); if (e < 1.08) continue; c.strokeStyle = rgba(i % 3 ? shade(P.g1, -0.22) : shade(P.g0, 0.3), 0.16 + r() * 0.12); c.lineWidth = 1.2 + r() * 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - 0.5) * 8, y - 8 - r() * 16); c.stroke(); }
  for (let i = 0; i < 260; i++) { const x = r() * WW, y = 500 + r() * 570, e = Math.pow((x - 960) / 880, 2) + Math.pow((y - 800) / 272, 2); if (e < 1.1) continue; const col = P.flowers[i % P.flowers.length], s = 4 + r() * 5; const gg = c.createRadialGradient(x, y, 1, x, y, s * 3.4); gg.addColorStop(0, rgba(col, 0.32)); gg.addColorStop(1, rgba(col, 0)); c.fillStyle = gg; c.beginPath(); c.arc(x, y, s * 3.4, 0, TAU); c.fill(); for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + i; wash(c, x + Math.cos(a) * s * 0.8, y + Math.sin(a) * s * 0.8, s * 0.62, s * 0.62, col, { a: 0.9, seed: i + k, layers: 1, edge: 0 }); } }
  for (let i = 0; i < 70; i++) { const x = 200 + r() * 1520, y = 600 + r() * 400; wash(c, x, y, 3 + r() * 5, 2.5 + r() * 3, r() < 0.5 ? '#9A88B8' : '#F4ECF8', { a: 0.4, seed: x, layers: 1, edge: 0 }); }
  wash(c, 900, 606, 300, 46, SHADOW, { a: 0.32, seed: 6, wob: 0.14, edge: 0 });
  for (const tc of L.torches) { wash(c, tc.x - 14, tc.y + 4, 20, 7, SHADOW, { a: 0.3, seed: 2, edge: 0 }); paintTorch(c, tc.x, tc.y); }
  finishPaint(c, WW, WH, 1, r, true);
  L.bg = cv; L.skyTop = topColor(cv);
  // the throne is its own sprite so that it can shake
  const tw = 560, th = 500, tc = makeCanvas(tw, th), t = tc.getContext('2d'), bx = tw / 2, by = th - 20, st = '#C6BAEA';      // pale moonstone, so the throne stands out against the dark mountains
  const slab = (w, y0, h, col) => { wash(t, bx, y0 - h / 2, w / 2, h / 2 + 6, col, { a: 1.3, seed: w, wob: 0.03, n: 14, edgeA: 0.3 }); wash(t, bx, y0 - h + 6, w / 2 - 8, 9, shade(col, 0.45), { a: 0.55, seed: w + 1, wob: 0.04, edge: 0 }); wash(t, bx - w * 0.3, y0 - h / 2 + 4, w * 0.16, h / 2, shade(col, -0.35), { a: 0.3, seed: w + 2, edge: 0 }); };
  wash(t, bx, by - 250, 108, 200, shade(st, -0.12), { a: 1.3, seed: 31, wob: 0.03, n: 14, edgeA: 0.3 });                     // the tall back of the throne
  wash(t, bx + 30, by - 300, 40, 130, shade(st, 0.3), { a: 0.35, seed: 32, edge: 0 });
  for (let i = 0; i < 5; i++) { t.fillStyle = i % 2 ? '#F6CE46' : '#E4583C'; t.beginPath(); t.ellipse(bx, by - 150 - i * 44, 62 - i * 6, 9, 0, 0, TAU); t.fill(); }   // stripes like his crown
  for (let i = -1; i <= 1; i++) { const cl = RAINBOW[(i + 1) * 3], px = bx + i * 66, py = by - 430 + Math.abs(i) * 26; t.fillStyle = cl; t.beginPath(); t.moveTo(px - 17, py + 44); t.lineTo(px, py - 14); t.lineTo(px + 17, py + 44); t.closePath(); t.fill(); t.fillStyle = 'rgba(255,255,255,0.45)'; t.beginPath(); t.moveTo(px - 17, py + 44); t.lineTo(px, py - 14); t.lineTo(px - 4, py + 44); t.closePath(); t.fill(); }
  slab(440, by, 54, shade(st, -0.1)); slab(360, by - 50, 54, st); slab(288, by - 100, 58, shade(st, 0.08));
  slab(250, by - 156, 84, shade(st, 0.14));                                                                                  // the seat
  for (const sd of [-1, 1]) wash(t, bx + sd * 132, by - 250, 26, 44, shade(st, 0.05), { a: 1.25, seed: 40 + sd, wob: 0.05, edgeA: 0.3 });   // armrests
  for (let i = 0; i < 16; i++) { t.strokeStyle = 'rgba(60,50,120,0.25)'; t.lineWidth = 2.5; t.lineCap = 'round'; t.beginPath(); const x = bx - 200 + r() * 400, y = by - 20 - r() * 200; t.moveTo(x, y); t.lineTo(x + (r() - 0.5) * 30, y + 14 + r() * 16); t.stroke(); }
  L.treeCv = tc; L.treeOff = { x: 960 - bx, y: 600 - by };
  L.overlay = makeOverlay('#C8D0FF', 0.1, 0.52, true);
  return finishLook(L);
}
