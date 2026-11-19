
/* ==========================================================================
   THE SECOND GAME, "CEA MAI GREA LUPTĂ": its characters and things.
   Everything here was invented and drawn by the children. The painters follow
   their drawings: Boon (teal dinosaur, blue spikes on the back, long tan neck,
   lime legs and tail), Killer (footballer in blue with the number 10 and red
   boots) and George cel Rău (pink dinosaur with a rainbow head and a striped
   horn-crown). Same picture-book watercolor style as the first game.
   Every draw function takes the feet position (x, y) in the current transform.
   ========================================================================== */
/* A soft tapered tube along a curve: tails, necks, arms, legs. */
function tube(c, x0, y0, cx, cy, x1, y1, r0, r1, col, col2) {
  const n = 16;
  for (let i = 0; i <= n; i++) {
    const u = i / n, v = 1 - u, x = v * v * x0 + 2 * v * u * cx + u * u * x1, y = v * v * y0 + 2 * v * u * cy + u * u * y1;
    c.fillStyle = col2 ? mix(col, col2, u) : col; c.beginPath(); c.arc(x, y, lerp(r0, r1, u), 0, TAU); c.fill();
  }
}
function clawTips(c, x, y, ang, len, n, col) {       // n little pointed claws fanning out from (x, y)
  c.fillStyle = col || '#FFF3D6';
  for (let i = 0; i < n; i++) {
    const a = ang + (i - (n - 1) / 2) * 0.42, bx = Math.cos(a + Math.PI / 2) * len * 0.22, by = Math.sin(a + Math.PI / 2) * len * 0.22;
    c.beginPath(); c.moveTo(x + bx, y + by); c.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); c.lineTo(x - bx, y - by); c.closePath(); c.fill();
  }
}

/* BOON: the little one's hero. Round teal body, a dome of blue spikes on the back, long tan neck, small blue head,
   lime legs and a long lime tail. o.claw (0 to 1) = the claws are out and spinning. */
function drawBoon(c, x, y, o) {
  const s = o.scale || 1, f = o.face || 1, t = o.t || 0;
  const step = o.moving ? Math.sin(o.walk || 0) : 0, hop = o.moving ? Math.abs(step) * 6 : 0;
  const br = Math.sin(t * 2.4) * 0.025 * (o.moving ? 0.3 : 1), sq = o.squash || 0, claw = o.claw != null && o.claw >= 0;
  const teal = '#3DBDB4', tealD = '#2B9A9E', lime = '#B7D645', limeD = '#8FB436', tan = '#CFA052', blue = '#3F78D8', navy = '#56609E', lilac = '#C4BEDC';
  c.save(); c.translate(x, y - (o.z || 0) * s); c.scale(s * f, s);
  // tail: thick at the body, down to the ground, long
  const wag = Math.sin(t * 3.1) * 4;
  tube(c, -30, -30, -52, -30, -58, -10 + wag * 0.3, 11, 8, lime);
  tube(c, -58, -10 + wag * 0.3, -62, 2, -92, -4 + wag, 8, 4.5, lime, limeD);
  // legs with little claws
  const leg = (lx, lift, fwd) => {
    tube(c, lx, -26, lx + fwd * 0.4, -16 - lift * 0.5, lx + fwd, -6 - lift, 6.5, 5.5, lime, limeD);
    clawTips(c, lx + fwd + 4, -4 - lift, 0.15, 9, 3, '#FFF3D6');
  };
  leg(-14, Math.max(0, step) * 6, step * 7); leg(12, Math.max(0, -step) * 6, -step * 7);
  c.translate(0, -hop); c.scale(1 + br + sq, 1 - br - sq);
  // the dome on the back with three blue spikes ("mountains") and their pale tips
  c.beginPath(); c.moveTo(-40, -40); c.bezierCurveTo(-40, -124, 30, -128, 32, -40); c.closePath();
  let g = c.createLinearGradient(0, -106, 0, -40); g.addColorStop(0, shade(tealD, 0.15)); g.addColorStop(1, tealD);
  c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(40,110,120,0.3)'; c.lineWidth = 2.2; c.stroke();
  const spikes = [[-35, -9, -21, -91], [-13, 15, 1, -99], [9, 29, 19, -88]];
  for (const sp of spikes) {
    c.fillStyle = blue; c.beginPath(); c.moveTo(sp[0], -44); c.lineTo(sp[2], sp[3]); c.lineTo(sp[1], -44); c.closePath(); c.fill();
    c.fillStyle = lilac; c.beginPath(); c.moveTo(lerp(sp[0], sp[2], 0.7), lerp(-44, sp[3], 0.7)); c.lineTo(sp[2], sp[3]); c.lineTo(lerp(sp[1], sp[2], 0.7), lerp(-44, sp[3], 0.7)); c.closePath(); c.fill();
  }
  // body
  g = c.createRadialGradient(8, -46, 6, 0, -34, 48); g.addColorStop(0, shade(teal, 0.4)); g.addColorStop(0.55, teal); g.addColorStop(1, tealD);
  puff(c, -2, -34, 42, 24, g, 1, 'rgba(40,110,120,0.3)');
  soft(c, 6, -26, 26, 11, '#BFF0E4', 0.45, 2);
  // neck
  tube(c, 28, -40, 37, -78, 34, -116, 10.5, 8.5, tan, shade(tan, 0.15));
  soft(c, 31, -80, 4, 30, shade(tan, 0.4), 0.5, 3);
  // arm: short normally; long, with long claws, when the power is on
  const reach = claw ? 26 : 0, ay = -50 + (o.moving ? step * 2 : 0);
  tube(c, 28, -48, 40 + reach * 0.5, ay - 6, 46 + reach, ay, 5.5, 5, '#4A9FE0');
  soft(c, 48 + reach, ay, 7, 6, '#4A9FE0', 1, 5);
  clawTips(c, 52 + reach, ay, 0, claw ? 26 : 9, 3, claw ? '#FFFBEA' : '#EAF2FF');
  if (o.hug > 0) for (let i = 0; i < 3; i++) { heartPath(c, 62 + i * 14, ay - 20 - i * 12 - (1 - o.hug) * 30, 6); c.fillStyle = rgba('#F29C9C', o.hug); c.fill(); }
  // head: round and blue, with a darker snout
  c.translate(0, -16);
  puff(c, 30, -110, 14, 13, blue, 6, 'rgba(50,70,150,0.3)');
  puff(c, 47, -107, 14, 9, navy, 7, 'rgba(50,50,110,0.3)');
  soft(c, 26, -116, 6, 4, shade(blue, 0.45), 0.7, 8);
  drawEye(c, 36, -112, 6.5, o, 1);
  c.strokeStyle = '#2F3566'; c.lineWidth = 2; c.lineCap = 'round'; c.beginPath();
  if (o.dizzy) { c.moveTo(44, -101); c.quadraticCurveTo(48, -104, 52, -101); c.quadraticCurveTo(55, -98, 58, -101); } else c.arc(50, -105, 6, 0.25, Math.PI * 0.8);
  c.stroke();
  c.fillStyle = 'rgba(47,53,102,0.7)'; c.beginPath(); c.arc(57, -110, 1.4, 0, TAU); c.fill();
  c.restore();
}

/* KILLER: the big one's hero. A footballer all in blue, number 10, big red boots, a round head with big eyes and a wide grin. */
function drawKiller(c, x, y, o) {
  const s = o.scale || 1, f = o.face || 1, t = o.t || 0;
  const step = o.moving ? Math.sin(o.walk || 0) : 0, hop = o.moving ? Math.abs(step) * 6 : 0;
  const br = Math.sin(t * 2.6 + 1) * 0.022 * (o.moving ? 0.3 : 1), sq = o.squash || 0, kick = o.kick || 0;
  const skin = '#F6D2AE', kit = '#2F6FD0', kitD = '#2456A8', boot = '#E4583C', ink = '#243A7A', up = o.happy || o.hug > 0;
  c.save(); c.translate(x, y - (o.z || 0) * s); c.scale(s * f, s);
  // legs in blue, big red boots
  const leg = (lx, lift, fwd, seed) => {
    tube(c, lx, -32, lx + fwd * 0.4, -22 - lift * 0.5, lx + fwd * 0.8, -11 - lift, 5.5, 5, skin);
    tube(c, lx, -34, lx + fwd * 0.15, -29 - lift * 0.2, lx + fwd * 0.35, -22 - lift * 0.45, 7.5, 7, kit, kitD);
    puff(c, lx + fwd + 3, -5 - lift, 13, 7.5, boot, seed, 'rgba(150,50,40,0.4)');
    soft(c, lx + fwd + 6, -8 - lift, 5, 2.5, shade(boot, 0.4), 0.6, seed + 1);
  };
  leg(-10, Math.max(0, step) * 6, step * 7, 40);
  leg(10, Math.max(0, -step) * 6 + kick * 8, -step * 7 + kick * 16, 44);
  c.translate(0, -hop); c.scale(1 + br + sq, 1 - br - sq);
  // long arms, like in the drawing (up in the air when happy)
  const gl = o.glove > 0 ? o.glove : 0;                                // the whirl gloves: both arms stretch out, 2.4 times longer
  const arm = (sd, sw) => {
    if (gl > 0) {
      const ext = 1 + 1.4 * Math.min(1, gl * 4) * (gl > 0.85 ? (1 - gl) / 0.15 : 1), wob = Math.sin(t * 24 + sd * 2) * 5;
      tube(c, sd * 17, -62, sd * (26 * ext), -58 + wob * 0.4, sd * (34 * ext), -52 + wob, 6.5, 5.5, skin);
      drawGlove(c, sd * (36 * ext), -50 + wob, 13, sd, t);
    } else if (up) tube(c, sd * 17, -62, sd * 30, -74, sd * 34, -92 + Math.sin(t * 9 + sd) * 4, 6.5, 6, skin);
    else tube(c, sd * 17, -62, sd * 32, -56 + sw * 3, sd * 36, -38 + sw * 5, 6.5, 6.5, skin);
    soft(c, sd * 17, -62, 8, 6, kit, 1, 50 + sd);                      // sleeve
  };
  arm(-1, step);
  let g = c.createLinearGradient(0, -70, 0, -26); g.addColorStop(0, shade(kit, 0.2)); g.addColorStop(1, kitD);
  puff(c, 0, -46, 20, 23, g, 26, 'rgba(30,60,130,0.35)');           // shirt and shorts in one blue piece
  arm(1, -step);
  c.save(); c.scale(f, 1);                                             // the number is never mirrored
  text(c, '10', 0, -47, 21, ink, { halo: 0, shadow: 0, weight: 'bold' });
  c.restore();
  // head: round, no hair, big eyes, wide grin with teeth
  g = c.createRadialGradient(6, -100, 4, 0, -90, 30); g.addColorStop(0, shade(skin, 0.35)); g.addColorStop(1, skin);
  puff(c, 0, -92, 25, 24, g, 28, 'rgba(180,110,80,0.3)');
  soft(c, -22, -92, 4.5, 6.5, skin, 1, 29);
  drawEye(c, -5, -99, 7.5, o, 1); drawEye(c, 11, -99, 7.5, o, 1);
  soft(c, 19, -86, 5, 3.5, '#F29C8E', 0.5, 30); soft(c, -13, -85, 5, 3.5, '#F29C8E', 0.4, 31);
  if (o.dizzy) { c.strokeStyle = '#9A5440'; c.lineWidth = 2.3; c.lineCap = 'round'; c.beginPath(); c.moveTo(-6, -79); c.quadraticCurveTo(-1, -83, 3, -79); c.quadraticCurveTo(7, -75, 12, -79); c.stroke(); }
  else {
    c.fillStyle = '#FFFDF4'; c.strokeStyle = '#9A5440'; c.lineWidth = 2; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-10, -85); c.quadraticCurveTo(3, -82, 16, -85); c.quadraticCurveTo(15, -72, 3, -72); c.quadraticCurveTo(-9, -72, -10, -85); c.closePath(); c.fill(); c.stroke();
    c.lineWidth = 1.3; c.strokeStyle = 'rgba(154,84,64,0.75)'; c.beginPath(); c.moveTo(-9, -79); c.lineTo(15, -79); for (const tx of [-3, 3, 9]) { c.moveTo(tx, -84); c.lineTo(tx, -73); } c.stroke();
  }
  c.restore();
}

/* Killer's ball, like in the drawing: white, with hexagons. */
function drawBallL(c, x, y, r, spin) {
  c.save(); c.translate(x, y);
  c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip();
  const g = c.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r * 1.1); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#D6DBF8');
  c.fillStyle = g; c.fillRect(-r, -r, r * 2, r * 2);
  c.rotate(spin || 0);
  c.strokeStyle = '#4A4690'; c.lineWidth = Math.max(1.3, r * 0.12); c.lineJoin = 'round';
  for (const hx of [[-0.26, -0.1, 0.44, 0.2], [0.52, 0.34, 0.38, 0.7], [0.14, -0.9, 0.36, 0.1], [-0.72, 0.62, 0.34, 0.4]]) {
    c.beginPath();
    for (let i = 0; i < 6; i++) { const a = hx[3] + i / 6 * TAU, px = (hx[0] + Math.cos(a) * hx[2]) * r, py = (hx[1] + Math.sin(a) * hx[2]) * r; if (i === 0) c.moveTo(px, py); else c.lineTo(px, py); }
    c.closePath(); c.fillStyle = 'rgba(90,120,224,0.22)'; c.fill(); c.stroke();
  }
  c.restore();
  c.strokeStyle = 'rgba(74,70,144,0.6)'; c.lineWidth = 1.8; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
}

/* GEORGE CEL RĂU: a carnotaurus with a crown. Pink body, a head in rainbow colors with a blue snout full of teeth,
   a striped horn-crown, thin brown legs and arms, a tail that turns from green to blue.
   mood: calm | angry | dizzy | scared */
function drawGeorge(c, x, y, o) {
  const s = o.scale || 1, f = o.face || 1, t = o.t || 0, mood = o.mood || 'calm';
  const step = o.moving ? Math.sin(o.walk || 0) : 0, hop = o.moving ? Math.abs(step) * 5 : 0, sq = o.squash || 0;
  const pink = '#E45AA0', pinkD = '#C2417F', brown = '#9A6B3C', eo = { t: t, dizzy: mood === 'dizzy', blinkOff: 0.9 };
  c.save(); c.translate(x, y); c.scale(s * f, s);
  // tail: green at the body, then blue, curling up
  const wag = Math.sin(t * 3.4) * 5;
  tube(c, -36, -40, -70, -34, -84, -52 + wag * 0.4, 12, 9, '#A8D645', '#6FC96A');
  tube(c, -84, -52 + wag * 0.4, -98, -74 + wag, -78, -94 + wag, 9, 4.5, '#46A8D8', '#3F78D8');
  c.strokeStyle = 'rgba(40,60,120,0.45)'; c.lineWidth = 2; c.lineCap = 'round';
  for (let i = 0; i < 3; i++) { const yy = -70 - i * 8 + wag * 0.8; c.beginPath(); c.moveTo(-96 + i * 4, yy); c.lineTo(-88 + i * 4, yy - 3); c.stroke(); }
  // thin brown legs: a pink foot behind, a pale claw foot in front
  tube(c, -14 + step * 5, -26, -14 + step * 6, -14, -14 + step * 8, -5 - Math.max(0, step) * 5, 4.5, 4, brown);
  soft(c, -11 + step * 8, -3 - Math.max(0, step) * 5, 10, 6, '#E77AB4', 1, 61);
  tube(c, 14 - step * 5, -26, 14 - step * 6, -14, 15 - step * 8, -5 - Math.max(0, -step) * 5, 4.5, 4, brown);
  clawTips(c, 18 - step * 8, -3 - Math.max(0, -step) * 5, 0.2, 15, 3, '#DCD6EC');
  c.translate(0, -hop); c.scale(1 + sq, 1 - sq);
  // body
  let g = c.createRadialGradient(10, -62, 6, 0, -46, 54); g.addColorStop(0, shade(pink, 0.4)); g.addColorStop(0.55, pink); g.addColorStop(1, pinkD);
  puff(c, 0, -46, 46, 31, g, 60, 'rgba(150,40,100,0.35)');
  c.strokeStyle = 'rgba(255,220,236,0.4)'; c.lineWidth = 5; c.lineCap = 'round';
  for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-22 + i * 18, -62); c.lineTo(-8 + i * 18, -34); c.stroke(); }       // crayon strokes
  // thin arm with claws
  tube(c, 30, -52, 44, -50, 50, -38 + (mood === 'angry' ? Math.sin(t * 20) * 3 : 0), 4, 3.5, brown);
  clawTips(c, 51, -35, 1.2, 10, 3, '#FFF3D6');
  // neck and the rainbow head: red at the back, orange, yellow, then the blue snout
  tube(c, 22, -64, 24, -78, 26, -90, 12, 12, '#E4455A');
  c.save(); c.translate(0, mood === 'scared' ? Math.sin(t * 30) * 1.5 : 0);
  puff(c, 16, -100, 21, 21, '#E4455A', 62, 'rgba(150,40,60,0.3)');
  puff(c, 34, -101, 17, 20, '#F58A3C', 63, 0);
  puff(c, 50, -101, 16, 19, '#F6CE46', 64, 0);
  // jaws: open wider when he is angry
  const open = mood === 'angry' ? 9 + Math.abs(Math.sin(t * 9)) * 4 : mood === 'dizzy' ? 7 : mood === 'scared' ? 10 : 4;
  c.save(); c.translate(60, -96); c.rotate(open * 0.02);
  puff(c, 16, 8 + open * 0.5, 19, 6.5, '#8E8AC0', 66, 'rgba(60,60,120,0.3)');                                     // lower jaw
  c.fillStyle = '#FFFDF4'; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(6 + i * 9, 5 + open * 0.5); c.lineTo(10 + i * 9, -2 + open * 0.3); c.lineTo(14 + i * 9, 5 + open * 0.5); c.closePath(); c.fill(); }
  c.restore();
  g = c.createLinearGradient(56, -116, 56, -92); g.addColorStop(0, '#5A9AE8'); g.addColorStop(1, '#3F78D8');
  puff(c, 74, -104, 24, 12, g, 65, 'rgba(40,60,130,0.35)');                                                       // upper jaw, the blue snout
  c.fillStyle = '#FFFDF4'; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(60 + i * 9, -95); c.lineTo(64 + i * 9, -86 + (i % 2)); c.lineTo(68 + i * 9, -95); c.closePath(); c.fill(); }
  c.fillStyle = 'rgba(30,40,100,0.6)'; c.beginPath(); c.arc(92, -109, 1.8, 0, TAU); c.fill();
  drawEye(c, 38, -108, 7.5, eo, 1); drawEye(c, 55, -108, 7, eo, 1);
  c.strokeStyle = '#7A2A3A'; c.lineWidth = 3.2; c.lineCap = 'round'; c.beginPath();
  if (mood === 'angry' || mood === 'calm') { c.moveTo(29, -120); c.lineTo(43, -115); c.moveTo(50, -115); c.lineTo(63, -119); }
  else if (mood === 'scared') { c.moveTo(29, -115); c.lineTo(43, -120); c.moveTo(50, -120); c.lineTo(63, -116); }
  c.stroke();
  // the striped horn that is also his crown
  if (!o.noCrown) drawGeorgeCrown(c, 34, -118, 1, -0.12);
  c.restore();
  c.restore();
}
function drawGeorgeCrown(c, x, y, s, rot) {
  c.save(); c.translate(x, y); c.rotate(rot || 0); c.scale(s, s);
  c.beginPath(); c.moveTo(-17, 0); c.lineTo(0, -46); c.lineTo(17, 0); c.closePath(); c.save(); c.clip();
  for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#F6CE46' : '#E4583C'; c.fillRect(-20, -i * 8 - 8, 40, 8.5); }
  c.restore();
  c.strokeStyle = 'rgba(150,60,40,0.35)'; c.lineWidth = 1.8; c.lineJoin = 'round'; c.stroke();
  puff(c, 0, 1, 19, 4.5, '#F8C24E', 67, 'rgba(180,110,40,0.5)');                                                  // a gold band, so everyone knows it is a crown
  for (let i = -1; i <= 1; i++) soft(c, i * 10, 1, 2.2, 2.2, RAINBOW[(i + 1) * 3], 1, 68 + i);
  c.restore();
}

/* One of George's robots: asleep (a slow light), awake (!), chasing, dizzy. Same states as the beetle of the first game. */
function paintRobotBody(c, b, t) {
  const st = b.state, moving = st === 'chase' || st === 'return', steel = '#A6B0DE', steelD = '#7C86BE', rust = '#D9834E';
  for (const sx of [-15, 15]) { const sp = moving ? t * 14 : 0; puff(c, sx, -6, 10, 8, rust, 81 + sx, 'rgba(140,70,40,0.4)'); c.strokeStyle = 'rgba(120,60,40,0.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(sx + Math.cos(sp) * 6, -6 + Math.sin(sp) * 5); c.lineTo(sx - Math.cos(sp) * 6, -6 - Math.sin(sp) * 5); c.stroke(); }   // wheels
  let g = c.createLinearGradient(0, -46, 0, -8); g.addColorStop(0, shade(steel, 0.3)); g.addColorStop(1, steelD);
  c.fillStyle = g; c.beginPath(); c.roundRect(-25, -40, 50, 32, 11); c.fill(); c.strokeStyle = 'rgba(70,80,140,0.35)'; c.lineWidth = 2.2; c.stroke();
  soft(c, -10, -34, 10, 3.5, '#EEF2FF', 0.6, 83);
  for (let i = 0; i < 3; i++) soft(c, -10 + i * 10, -15, 2.6, 2.6, RAINBOW[(i * 2 + 1) % 7], st === 'sleep' ? 0.35 : 0.95, 84 + i);     // three little buttons
  // head with one screen for a face
  c.fillStyle = shade(steel, 0.15); c.beginPath(); c.roundRect(-17, -62, 34, 24, 9); c.fill(); c.stroke();
  c.fillStyle = '#3A3F78'; c.beginPath(); c.roundRect(-12, -58, 24, 15, 6); c.fill();
  c.strokeStyle = steelD; c.lineWidth = 2.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, -62); c.lineTo(0, -72); c.stroke();
  const pulse = 0.5 + 0.5 * Math.sin(t * (st === 'sleep' ? 1.6 : 9));
  soft(c, 0, -75, 4.5, 4.5, st === 'chase' || st === 'wake' ? '#FF9A4A' : '#9A8AFF', 0.5 + pulse * 0.5, 87);
  c.strokeStyle = st === 'chase' || st === 'wake' ? '#FF9A4A' : '#7AF0C8'; c.lineWidth = 2.6;
  if (st === 'sleep' || st === 'return') { c.beginPath(); c.moveTo(-8, -50); c.lineTo(-2, -50); c.moveTo(2, -50); c.lineTo(8, -50); c.stroke(); }
  else if (st === 'stun' || st === 'knock') { c.beginPath(); for (let i = 0; i <= 12; i++) { const a = i / 12 * TAU * 1.5 + t * 6, rr = 6 * i / 12; if (i === 0) c.moveTo(Math.cos(a) * rr, -50 + Math.sin(a) * rr); else c.lineTo(Math.cos(a) * rr, -50 + Math.sin(a) * rr); } c.stroke(); }
  else { c.beginPath(); c.moveTo(-9, -54); c.lineTo(-3, -50); c.moveTo(9, -54); c.lineTo(3, -50); c.stroke(); soft(c, -5, -48, 2.4, 2.4, '#FF9A4A', 1, 88); soft(c, 5, -48, 2.4, 2.4, '#FF9A4A', 1, 89); }
}
function drawRobot(c, b, t) {
  const f = b.face || 1;
  c.fillStyle = rgba(SHADOW, 0.24); c.beginPath(); c.ellipse(b.x - 5 * f, b.y + 2, 32, 11, 0, 0, TAU); c.fill();
  c.save(); c.translate(b.x, b.y); c.scale(f, 1);
  if (b.state === 'knock') c.rotate(t * 9);
  if (b.state === 'sleep') {
    const sp = sprite('robotSleep', 80, 96, cc => { cc.translate(40, 88); paintRobotBody(cc, { state: 'sleep' }, 0); });
    c.drawImage(sp, -40, -88, 80, 96);
    soft(c, 0, -75, 5, 5, '#9A8AFF', 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.6 + b.seed)), 87);
  } else paintRobotBody(c, b, t);
  c.restore();
  if (b.state === 'sleep') {
    const zs = sprite('zzzL', 30, 34, cc => { text(cc, 'z', 15, 17, 28, '#C4BEF0', { halo: 0, shadow: 0, weight: 'bold' }); });
    for (let i = 0; i < 3; i++) { const p = ((t * 0.5 + i * 0.33 + b.seed) % 1), k = 0.6 + p * 0.6; c.globalAlpha = 0.9 * (1 - p); c.drawImage(zs, b.x + 20 * f + p * 26 - 15 * k, b.y - 70 - p * 44 - 17 * k, 30 * k, 34 * k); }
    c.globalAlpha = 1;
  } else if (b.state === 'wake') text(c, '!', b.x, b.y - 96, 52, '#FF9A4A', { weight: 'bold' });
}

/* A sticky snail that crawls down its lane and leaves a shiny trail. o.state 'stun' = it hides in its shell. */
function drawSnail(c, x, y, t, o) {
  const st = o && o.state === 'stun', r = (o && o.r) || 26, k = r / 26, cr = Math.sin(t * 5 + ((o && o.seed) || 0)) * 2;
  c.fillStyle = rgba('#B7F0C0', 0.28); c.beginPath(); c.ellipse(x, y - 34 * k, 13 * k, 40 * k, 0, 0, TAU); c.fill();          // the slime trail behind (it crawls downward)
  c.fillStyle = rgba(SHADOW, 0.24); c.beginPath(); c.ellipse(x - 4, y + 4, r * 1.05, r * 0.42, 0, 0, TAU); c.fill();
  c.save(); c.translate(x, y - r * 0.5); c.scale(k, k);
  if (!st) {
    puff(c, 0, 14 + cr, 13, 22, '#C9E27A', 91, 'rgba(110,140,60,0.4)');                                              // body, head toward the bottom of the screen
    c.strokeStyle = '#A9C65A'; c.lineWidth = 3.5; c.lineCap = 'round';
    for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(sd * 5, 30 + cr); c.lineTo(sd * 10, 42 + cr + Math.sin(t * 4 + sd) * 2); c.stroke(); drawEye(c, sd * 10, 45 + cr + Math.sin(t * 4 + sd) * 2, 5, { t: t + sd, blinkOff: sd }, 0); }
  }
  const sh = sprite('snailShell', 64, 64, cc => {
    cc.translate(32, 32);
    const g = cc.createRadialGradient(-6, -8, 3, 0, 0, 27); g.addColorStop(0, '#F6A8D0'); g.addColorStop(0.6, '#D86AA8'); g.addColorStop(1, '#A8508E');
    puff(cc, 0, 0, 25, 24, g, 92, 'rgba(120,50,100,0.4)');
    cc.strokeStyle = 'rgba(255,230,244,0.85)'; cc.lineWidth = 3; cc.lineCap = 'round'; cc.beginPath();
    for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU * 2.2, rr = 2 + i / 40 * 19; if (i === 0) cc.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); else cc.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    cc.stroke();
    soft(cc, -9, -11, 6, 4, '#FFF0F8', 0.7, 93);
  });
  c.rotate(st ? Math.sin(t * 22) * 0.12 : Math.sin(t * 2.5) * 0.06);
  c.drawImage(sh, -32, -32, 64, 64);
  c.restore();
}

/* A big jungle bird. It flies high: only its shadow touches the ground. o.grab = it carries a hero. o.spy = the small one that brings news to George. */
function drawBird(c, x, y, o) {
  const s = o.scale || 1, f = o.face || 1, t = o.t || 0, flap = Math.sin(t * 9), body = o.spy ? '#7A6AC8' : '#8A5AC8', wing = o.spy ? '#5A4AA8' : '#6A3FA8';
  c.save(); c.translate(x, y + Math.sin(t * 4.5) * 6); c.scale(s * f, s);
  for (let i = 0; i < 3; i++) { c.save(); c.translate(-44, 4); c.rotate(-0.25 + i * 0.25); puff(c, -20, 0, 24, 7, [RAINBOW[0], RAINBOW[2], RAINBOW[4]][i], 70 + i, 0); c.restore(); }       // tail feathers
  c.save(); c.translate(-4, -8); c.rotate(-0.5 - flap * 0.7); puff(c, -10, -30, 22, 44, wing, 75, 'rgba(60,30,110,0.35)'); soft(c, -12, -46, 12, 22, shade(wing, 0.3), 0.5, 76); c.restore();   // far wing
  const g = c.createRadialGradient(8, -12, 4, 0, 0, 46); g.addColorStop(0, shade(body, 0.35)); g.addColorStop(1, body);
  puff(c, 0, 0, 44, 28, g, 71, 'rgba(60,30,110,0.35)');
  soft(c, 10, 10, 26, 12, '#F6CE46', 0.85, 72);
  puff(c, 40, -16, 21, 19, body, 73, 'rgba(60,30,110,0.35)');
  c.fillStyle = '#F58A3C'; c.beginPath(); c.moveTo(54, -24); c.quadraticCurveTo(88, -22, 92, -4); c.quadraticCurveTo(72, -2, 54, -6); c.closePath(); c.fill();                                   // big beak
  c.fillStyle = '#F6CE46'; c.beginPath(); c.moveTo(54, -24); c.quadraticCurveTo(78, -24, 90, -12); c.quadraticCurveTo(70, -14, 54, -16); c.closePath(); c.fill();
  drawEye(c, 44, -20, 7, { t: t, blinkOff: 0.5 }, 1);
  c.save(); c.translate(-2, -4); c.rotate(0.4 + flap * 0.8); puff(c, -8, -32, 24, 46, shade(wing, 0.12), 74, 'rgba(60,30,110,0.35)'); soft(c, -10, -50, 12, 22, shade(wing, 0.4), 0.5, 77); c.restore();   // near wing
  c.strokeStyle = '#F58A3C'; c.lineWidth = 5; c.lineCap = 'round';                                                                                                                              // claws
  for (const sx of [-8, 12]) { c.beginPath(); c.moveTo(sx, 24); c.lineTo(sx, o.grab ? 46 : 38); c.stroke(); c.beginPath(); c.moveTo(sx - 7, o.grab ? 52 : 44); c.lineTo(sx, o.grab ? 46 : 38); c.lineTo(sx + 7, o.grab ? 52 : 44); c.stroke(); }
  c.restore();
}

/* A rainbow crystal: a cut gem in one of the seven colors, with a soft glow. */
function gemPath(c, r) {
  c.beginPath(); c.moveTo(0, -1.25 * r); c.lineTo(0.82 * r, -0.5 * r); c.lineTo(0.82 * r, 0.38 * r); c.lineTo(0, r); c.lineTo(-0.82 * r, 0.38 * r); c.lineTo(-0.82 * r, -0.5 * r); c.closePath();
}
function drawCrystal(c, x, y, r, t, seed, z, hue) {
  hue = ((hue | 0) % 7 + 7) % 7;
  const bob = Math.sin(t * 2.2 + seed) * 2.5, R = 40, k = r / R, col = RAINBOW[hue];
  c.fillStyle = rgba(SHADOW, 0.26); c.beginPath(); c.ellipse(x - 3, y + r * 0.55, r * 0.8, r * 0.3, 0, 0, TAU); c.fill();
  const sp = sprite('gem' + hue, 200, 220, cc => {
    cc.translate(100, 118);
    const gg = cc.createRadialGradient(0, 0, R * 0.4, 0, 0, R * 2.4); gg.addColorStop(0, rgba(shade(col, 0.45), 0.55)); gg.addColorStop(1, rgba(col, 0));
    cc.fillStyle = gg; cc.beginPath(); cc.arc(0, 0, R * 2.4, 0, TAU); cc.fill();
    gemPath(cc, R); cc.fillStyle = col; cc.fill();
    cc.fillStyle = rgba(shade(col, 0.6), 0.9); cc.beginPath(); cc.moveTo(0, -1.25 * R); cc.lineTo(0.82 * R, -0.5 * R); cc.lineTo(0, -0.2 * R); cc.lineTo(-0.82 * R, -0.5 * R); cc.closePath(); cc.fill();      // top facets
    cc.fillStyle = rgba(shade(col, -0.3), 0.75); cc.beginPath(); cc.moveTo(0, -0.2 * R); cc.lineTo(0.82 * R, -0.5 * R); cc.lineTo(0.82 * R, 0.38 * R); cc.lineTo(0, R); cc.closePath(); cc.fill();             // the side in shade
    cc.fillStyle = 'rgba(255,255,250,0.85)'; cc.beginPath(); cc.moveTo(-0.5 * R, -0.5 * R); cc.lineTo(-0.2 * R, -0.75 * R); cc.lineTo(-0.3 * R, -0.3 * R); cc.closePath(); cc.fill();
    gemPath(cc, R); cc.strokeStyle = rgba(shade(col, -0.4), 0.45); cc.lineWidth = R * 0.08; cc.lineJoin = 'round'; cc.stroke();
  });
  c.save(); c.translate(x, y - r * 0.55 - (z || 0) + bob); c.rotate(Math.sin(t * 1.7 + seed * 2) * 0.1);
  c.drawImage(sp, -100 * k, -118 * k, 200 * k, 220 * k);
  const tw = Math.sin(t * 3 + seed * 5);
  if (tw > 0.55) { const q = (tw - 0.55) / 0.45; c.fillStyle = 'rgba(255,255,255,' + q + ')'; starPath(c, r * 0.45, -r * 0.9, r * 0.5 * q, t); c.fill(); }
  c.restore();
}
/* The secret star hidden behind the door: big, golden, with a ring in all the rainbow colors. */
function drawSecretStar(c, x, y, r, t, z) {
  c.fillStyle = rgba(SHADOW, 0.24); c.beginPath(); c.ellipse(x - 3, y + r * 0.5, r * 0.9, r * 0.3, 0, 0, TAU); c.fill();
  c.save(); c.translate(x, y - r * 0.9 - (z || 0) + Math.sin(t * 2.2) * 5);
  for (let i = 0; i < 7; i++) { const a = t * 1.3 + i / 7 * TAU; c.fillStyle = rgba(RAINBOW[i], 0.85); starPath(c, Math.cos(a) * r * 1.5, Math.sin(a) * r * 1.1, r * 0.22, a); c.fill(); }
  const gg = c.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 2.2); gg.addColorStop(0, 'rgba(255,236,170,0.6)'); gg.addColorStop(1, 'rgba(255,236,170,0)');
  c.fillStyle = gg; c.beginPath(); c.arc(0, 0, r * 2.2, 0, TAU); c.fill();
  c.rotate(Math.sin(t * 1.3) * 0.2); c.lineJoin = 'round';
  starPath(c, 0, 0, r * 1.15, 0); c.strokeStyle = '#F4B08E'; c.lineWidth = r * 0.3; c.stroke();
  const g = c.createRadialGradient(-r * 0.2, -r * 0.3, 1, 0, 0, r * 1.15); g.addColorStop(0, '#FFFDF0'); g.addColorStop(1, '#FFD86A'); c.fillStyle = g; c.fill();
  c.restore();
}
/* The helper of the second game: a little rocket. Whoever touches it makes both heroes fast. */
function drawRocket(c, x, y, t, s) {
  c.save(); c.translate(x, y); c.scale(s || 1, s || 1); c.rotate(-0.5 + Math.sin(t * 3) * 0.25);
  const gg = c.createRadialGradient(0, 0, 4, 0, 0, 70); gg.addColorStop(0, 'rgba(255,200,120,0.5)'); gg.addColorStop(1, 'rgba(255,200,120,0)');
  c.fillStyle = gg; c.beginPath(); c.arc(0, 0, 70, 0, TAU); c.fill();
  const fl = 0.7 + Math.abs(Math.sin(t * 23)) * 0.5;
  c.fillStyle = '#F58A3C'; c.beginPath(); c.moveTo(-9, 20); c.quadraticCurveTo(0, 20 + 34 * fl, 9, 20); c.closePath(); c.fill();
  c.fillStyle = '#FFE08A'; c.beginPath(); c.moveTo(-5, 20); c.quadraticCurveTo(0, 20 + 20 * fl, 5, 20); c.closePath(); c.fill();
  for (const sd of [-1, 1]) { c.fillStyle = '#E4583C'; c.beginPath(); c.moveTo(sd * 10, 6); c.lineTo(sd * 23, 24); c.lineTo(sd * 10, 20); c.closePath(); c.fill(); }       // fins
  puff(c, 0, 0, 13, 23, '#FFF6E2', 95, 'rgba(160,110,100,0.4)');
  c.fillStyle = '#E4583C'; c.beginPath(); c.moveTo(-11, -12); c.quadraticCurveTo(0, -42, 11, -12); c.closePath(); c.fill();                                                 // nose
  soft(c, 0, -2, 6.5, 6.5, '#46B8D8', 1, 96); soft(c, -2, -4, 2.2, 2.2, '#E8FBFF', 0.9, 97);                                                                               // window
  c.restore();
}
/* Things thrown in the second game: a glowing rock (George) and a spear (his soldiers). */
function drawRockProj(c, x, y, rot, r) {
  const sp = sprite('rockP', 64, 64, cc => { cc.translate(32, 32); const g = cc.createRadialGradient(-6, -8, 3, 0, 0, 26); g.addColorStop(0, '#E0DAF6'); g.addColorStop(1, '#8E86C0'); puff(cc, 0, 0, 24, 22, g, 98, 'rgba(70,60,120,0.4)'); soft(cc, 6, 6, 9, 6, '#6A62A0', 0.5, 99); for (let i = 0; i < 3; i++) soft(cc, -8 + i * 8, -6 + (i % 2) * 9, 2.6, 2.6, RAINBOW[i * 2], 0.9, 100 + i); });
  const k = r / 24;
  c.save(); c.translate(x, y - r); c.rotate(rot); c.drawImage(sp, -32 * k, -32 * k, 64 * k, 64 * k); c.restore();
}
function drawSpear(c, x, y, ang, s) {
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
  c.strokeStyle = '#9A6B4C'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(-52, 0); c.lineTo(40, 0); c.stroke();
  c.fillStyle = '#DCD6EC'; c.beginPath(); c.moveTo(38, -9); c.lineTo(66, 0); c.lineTo(38, 9); c.closePath(); c.fill(); c.strokeStyle = 'rgba(90,80,140,0.4)'; c.lineWidth = 1.6; c.stroke();
  soft(c, 30, 0, 5, 7, '#E4583C', 1, 104);
  c.restore();
}
/* One of George's soldiers: a small lizard with a helmet and a spear. They stand around the arena. throwT > 0 = it just threw. */
function drawSoldier(c, so, t) {
  const f = so.face || 1, bob = Math.abs(Math.sin(t * 3 + so.seed)) * 4, body = so.col || '#6FA88A', thr = so.throwT > 0, cheer = P && P.boss && P.boss.state === 'won';
  c.fillStyle = rgba(SHADOW, 0.24); c.beginPath(); c.ellipse(so.x, so.y + 3, 26, 9, 0, 0, TAU); c.fill();
  c.save(); c.translate(so.x, so.y - (cheer ? Math.abs(Math.sin(t * 7 + so.seed)) * 14 : bob)); c.scale(f, 1);
  tube(c, -14, -18, -30, -16, -36, -6, 7, 3, body);                                                                  // tail
  soft(c, -7, -5, 6, 5, shade(body, -0.2), 1, 110); soft(c, 8, -5, 6, 5, shade(body, -0.2), 1, 111);
  puff(c, 0, -26, 17, 20, body, 112, 'rgba(40,90,70,0.35)');
  soft(c, 3, -22, 9, 11, '#E4F2C8', 0.8, 113);
  puff(c, 6, -52, 15, 13, body, 114, 'rgba(40,90,70,0.35)');
  c.fillStyle = '#E0A04A'; c.beginPath(); c.arc(5, -57, 14, Math.PI, TAU); c.closePath(); c.fill();                    // helmet
  c.fillStyle = '#E4583C'; c.beginPath(); c.moveTo(1, -70); c.quadraticCurveTo(8, -84, 14, -68); c.closePath(); c.fill();
  drawEye(c, 11, -52, 5, { t: t + so.seed, blinkOff: so.seed, happy: cheer }, 1);
  // the spear: upright in the hand, gone for a moment after a throw, dropped when George has lost
  if (!thr && !cheer) { c.save(); c.translate(22, -30); drawSpear(c, 0, -14, -Math.PI / 2 + Math.sin(t * 2 + so.seed) * 0.04, 0.95); c.restore(); }
  tube(c, 12, -32, 18, -30, 22, cheer ? -52 : -30, 4, 3.5, body);
  c.restore();
  if (cheer) { c.save(); c.translate(so.x + f * 34, so.y + 2); drawSpear(c, 0, 0, 0.1 * f, 0.9); c.restore(); }
}

/* One goalkeeper glove: red, white palm, a blue star in the palm. sd = which side it points to. */
function drawGlove(c, x, y, r, sd, t) {
  c.save(); c.translate(x, y); c.rotate(sd * 0.25 + Math.sin((t || 0) * 18) * 0.12); c.scale(sd, 1);
  soft(c, 1, r * 0.2, r, r * 0.95, SHADOW, 0.22, 7);
  puff(c, 0, 0, r, r * 0.95, '#E4583C', 8, 'rgba(150,50,40,0.45)');          // the glove
  puff(c, r * 0.18, r * 0.05, r * 0.6, r * 0.62, '#FFF6E2', 9, 'rgba(200,150,120,0.35)');   // the white palm
  c.save(); c.translate(r * 0.18, r * 0.05); c.fillStyle = '#3B6FE0'; starPath(c, 0, 0, r * 0.4, 0.3); c.fill(); c.restore();
  puff(c, -r * 0.62, -r * 0.42, r * 0.34, r * 0.46, '#E4583C', 10, 'rgba(150,50,40,0.4)');  // the thumb
  soft(c, -r * 0.1, -r * 0.72, r * 0.7, r * 0.2, shade('#E4583C', 0.35), 0.5, 11);          // the cuff
  c.restore();
}

/* Boon's boomerang bone: two round ends and a shaft, cream amber, with a small crack. */
function drawBone(c, x, y, r, spin) {
  c.save(); c.translate(x, y); c.rotate(spin || 0);
  const L = r * 1.25, w = r * 0.42, col = '#F3E2B8', sh = '#C99A52';
  soft(c, 0, w * 0.5, L, w * 0.8, SHADOW, 0.2, 3);
  c.fillStyle = col; c.strokeStyle = rgba(sh, 0.75); c.lineWidth = Math.max(1.5, r * 0.1); c.lineJoin = 'round';
  c.beginPath(); c.moveTo(-L * 0.55, -w * 0.5); c.lineTo(L * 0.55, -w * 0.5); c.lineTo(L * 0.55, w * 0.5); c.lineTo(-L * 0.55, w * 0.5); c.closePath(); c.fill();
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) { c.beginPath(); c.arc(sx * L * 0.62, sy * w * 0.62, w * 0.72, 0, TAU); c.fill(); }
  c.beginPath(); c.moveTo(-L * 0.3, -w * 0.18); c.lineTo(L * 0.1, -w * 0.05); c.stroke();        // the crack
  c.fillStyle = rgba('#FFFDF4', 0.6); c.beginPath(); c.ellipse(-L * 0.1, -w * 0.3, L * 0.3, w * 0.16, 0, 0, TAU); c.fill();
  c.restore();
}

/* What a thrown thing looks like: Killer's and Leo's ball, or Boon's bone. */
function drawThrown(c, x, y, r, spin, look) {
  if (look === 'bone') drawBone(c, x, y, r, spin); else drawBall(c, x, y, r, spin);
}
