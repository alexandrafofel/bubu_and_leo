
/* ==========================================================================
   CHARACTERS AND THINGS: all drawn with canvas shapes, picture-book style.
   Every draw function takes the feet position (x, y) in the current transform.
   ========================================================================== */
function drawEye(c, x, y, r, o, look) {
  const t = o.t || 0;
  if (o.dizzy) {                       // little spirals
    c.strokeStyle = '#7A4A52'; c.lineWidth = r * 0.28; c.lineCap = 'round'; c.beginPath();
    for (let i = 0; i <= 14; i++) { const a = i / 14 * TAU * 1.6 + t * 6, rr = r * 0.95 * i / 14; const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; if (i === 0) c.moveTo(px, py); else c.lineTo(px, py); }
    c.stroke(); return;
  }
  const blink = ((t + (o.blinkOff || 0)) % 3.7) < 0.13;
  if (o.happy || blink) {
    c.strokeStyle = '#5A3838'; c.lineWidth = r * 0.34; c.lineCap = 'round'; c.beginPath();
    if (o.happy) c.arc(x, y + r * 0.3, r * 0.75, Math.PI * 1.12, Math.PI * 1.88); else c.arc(x, y - r * 0.3, r * 0.75, Math.PI * 0.12, Math.PI * 0.88);
    c.stroke(); return;
  }
  c.fillStyle = '#FFFDF4'; c.beginPath(); c.ellipse(x, y, r, r * 1.08, 0, 0, TAU); c.fill();
  c.strokeStyle = 'rgba(120,70,80,0.25)'; c.lineWidth = 1.4; c.stroke();
  const lx = (look || 0) * r * 0.25;
  c.fillStyle = '#4B2E33'; c.beginPath(); c.ellipse(x + lx + r * 0.12, y + r * 0.08, r * 0.66, r * 0.72, 0, 0, TAU); c.fill();
  c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(x + lx - r * 0.12, y - r * 0.22, r * 0.26, 0, TAU); c.fill();
  c.beginPath(); c.arc(x + lx + r * 0.36, y + r * 0.3, r * 0.12, 0, TAU); c.fill();
}

/* BUBU: round baby triceratops, orange with green spots and a tiny red scarf. */
function drawBubu(c, x, y, o) {
  const H0 = CONFIG.heroes[0], s = o.scale || 1, f = o.face || 1, t = o.t || 0;
  const step = o.moving ? Math.sin(o.walk || 0) : 0, hop = o.moving ? Math.abs(step) * 7 : 0;
  const br = Math.sin(t * 2.4) * 0.025 * (o.moving ? 0.3 : 1), sq = o.squash || 0;
  const body = o.col || H0.color, spot = o.col2 || H0.color2, dark = shade(body, -0.22), light = shade(body, 0.4);
  c.save(); c.translate(x, y - (o.z || 0) * s); c.scale(s * f, s);
  puff(c, -20 + step * 7, -8 - Math.max(0, step) * 5, 12, 10, dark, 3);
  puff(c, 18 - step * 7, -8 - Math.max(0, -step) * 5, 12, 10, dark, 4);
  c.translate(0, -hop); c.scale(1 + br + sq, 1 - br - sq);
  // tail
  c.save(); c.translate(-36, -24); c.rotate(-0.45 + Math.sin(t * 3.1) * 0.14); puff(c, -12, 0, 22, 10, shade(body, -0.08), 5); c.restore();
  // body
  let g = c.createRadialGradient(8, -52, 6, 0, -36, 52); g.addColorStop(0, light); g.addColorStop(0.55, body); g.addColorStop(1, dark);
  puff(c, 0, -36, 44, 34, g, 1);
  soft(c, 8, -23, 27, 17, '#FCDDB0', 0.75, 2);
  const sp = [[-24, -50, 9], [-8, -62, 7.5], [-30, -34, 6.5], [6, -57, 5.5], [-16, -40, 4.5]];
  for (let i = 0; i < sp.length; i++) soft(c, sp[i][0], sp[i][1], sp[i][2], sp[i][2] * 0.9, spot, 0.9, 20 + i);
  // frill behind the head
  puff(c, 22, -70, 31, 28, shade(body, -0.16), 7);
  soft(c, 23, -69, 22, 19, shade(body, 0.28), 0.8, 8);
  for (let i = 0; i < 4; i++) { const a = -2.7 + i * 0.52; soft(c, 22 + Math.cos(a) * 25, -70 + Math.sin(a) * 22, 4, 4, spot, 0.85, 30 + i); }
  // scarf
  if (!o.noScarf) {
  c.save(); c.translate(14, -38); c.rotate(-0.4); puff(c, 0, 0, 19, 8.5, H0.scarf, 12, 'rgba(150,50,50,0.4)'); c.restore();
  c.fillStyle = shade(H0.scarf, -0.12); c.beginPath(); c.moveTo(4, -36); c.quadraticCurveTo(-4 + Math.sin(t * 5) * 3, -28, -8 + Math.sin(t * 5 + 1) * 4, -16); c.lineTo(3, -19); c.quadraticCurveTo(8, -28, 10, -34); c.closePath(); c.fill();
  }
  // head
  g = c.createRadialGradient(42, -64, 4, 36, -54, 34); g.addColorStop(0, light); g.addColorStop(0.6, body); g.addColorStop(1, shade(body, -0.12));
  puff(c, 36, -54, 29, 26, g, 9);
  soft(c, 55, -46, 15, 12, shade(body, 0.45), 0.9, 10);
  // horns
  const horn = (hx, hy, w, h, rot) => { c.save(); c.translate(hx, hy); c.rotate(rot); c.fillStyle = '#FFF3D6'; c.beginPath(); c.moveTo(-w, 0); c.quadraticCurveTo(-w * 0.3, -h * 1.1, 0, -h); c.quadraticCurveTo(w * 0.5, -h * 0.9, w, 0); c.closePath(); c.fill(); c.strokeStyle = 'rgba(160,110,90,0.3)'; c.lineWidth = 1.6; c.stroke(); c.restore(); };
  horn(27, -77, 5.5, 13, -0.25); horn(44, -79, 5.5, 13, 0.15); horn(63, -55, 4.5, 9, 0.7);
  drawEye(c, 32, -57, 9.5, o, 1); drawEye(c, 51, -58, 8.5, o, 1);
  soft(c, 43, -44, 7, 4.5, '#F29C8E', 0.5, 11);
  c.strokeStyle = '#8A4A38'; c.lineWidth = 2.4; c.lineCap = 'round'; c.beginPath();
  if (o.dizzy) { c.moveTo(51, -40); c.quadraticCurveTo(55, -43, 59, -40); c.quadraticCurveTo(62, -37, 65, -40); }
  else c.arc(57, -43, 6.5, 0.2, Math.PI * 0.85);
  c.stroke();
  c.fillStyle = 'rgba(138,74,56,0.6)'; c.beginPath(); c.arc(65, -49, 1.5, 0, TAU); c.fill();
  c.restore();
}

/* LEO: young footballer, yellow shirt, blue shorts, red headband. */
function drawLeo(c, x, y, o) {
  const H1 = CONFIG.heroes[1], s = o.scale || 1, f = o.face || 1, t = o.t || 0;
  const step = o.moving ? Math.sin(o.walk || 0) : 0, hop = o.moving ? Math.abs(step) * 6 : 0;
  const br = Math.sin(t * 2.6 + 1) * 0.022 * (o.moving ? 0.3 : 1), sq = o.squash || 0;
  const skin = '#F3C7A0', hair = '#7C4B30', kickLeg = o.kick || 0;
  c.save(); c.translate(x, y - (o.z || 0) * s); c.scale(s * f, s);
  // legs: sock + shoe
  const leg = (lx, lift, fwd, seed) => {
    soft(c, lx + fwd * 0.5, -17 - lift * 0.6, 6.5, 10, skin, 1, seed);
    soft(c, lx + fwd * 0.8, -11 - lift, 6.5, 6.5, H1.color2, 1, seed + 1);
    puff(c, lx + fwd + 2, -5 - lift, 10, 6.5, '#C4573D', seed + 2);
  };
  leg(-10, Math.max(0, step) * 6, step * 7, 40);
  leg(10, Math.max(0, -step) * 6 + kickLeg * 8, -step * 7 + kickLeg * 16, 44);
  c.translate(0, -hop); c.scale(1 + br + sq, 1 - br - sq);
  puff(c, 0, -27, 19, 11, H1.color2, 23);                       // shorts
  soft(c, 0, -24, 2, 7, shade(H1.color2, -0.2), 0.5, 24);
  // arms
  const arm = (ax, sw, seed) => { puff(c, ax, -46 + sw * 3, 7.5, 10, H1.color, seed); soft(c, ax + Math.sign(ax) * 1, -36 + sw * 4.5, 5.5, 5.5, skin, 1, seed + 1); soft(c, ax, -53 + sw * 2, 8, 3.2, H1.color2, 0.9, seed + 2); };
  arm(-21, step, 50);
  let g = c.createLinearGradient(0, -62, 0, -26); g.addColorStop(0, shade(H1.color, 0.25)); g.addColorStop(1, shade(H1.color, -0.1));
  puff(c, 0, -44, 21, 19, g, 26);                               // shirt
  soft(c, 0, -60, 10, 4.5, H1.color2, 1, 27);                   // collar
  arm(21, -step, 54);
  // head
  puff(c, -4, -98, 28, 15, hair, 60);                           // hair behind
  g = c.createRadialGradient(6, -90, 4, 0, -82, 32); g.addColorStop(0, shade(skin, 0.3)); g.addColorStop(1, skin);
  puff(c, 0, -82, 29, 27, g, 28, 'rgba(180,110,80,0.3)');
  soft(c, -26, -84, 5, 7, skin, 1, 29);                         // ear
  soft(c, -6, -103, 27, 11, hair, 1, 61); soft(c, 12, -107, 12, 8, hair, 1, 62); soft(c, -24, -92, 8, 12, hair, 1, 63);
  soft(c, 14, -110, 6, 5, shade(hair, 0.25), 0.7, 64);
  // red headband with two little tails
  c.strokeStyle = H1.headband; c.lineCap = 'round'; c.lineWidth = 7.5;
  c.beginPath(); c.moveTo(-27, -91); c.quadraticCurveTo(0, -99, 28, -92); c.stroke();
  c.lineWidth = 5; const wv = Math.sin(t * 6) * 4 + (o.moving ? -6 : 0);
  c.beginPath(); c.moveTo(-27, -91); c.quadraticCurveTo(-36, -88 + wv * 0.4, -43, -82 + wv); c.stroke();
  c.beginPath(); c.moveTo(-27, -91); c.quadraticCurveTo(-37, -94 + wv * 0.3, -45, -93 + wv * 0.8); c.stroke();
  drawEye(c, 3, -80, 8.5, o, 1); drawEye(c, 19, -80, 7.8, o, 1);
  soft(c, 23, -70, 6, 4, '#F29C8E', 0.55, 30); soft(c, -5, -69, 6, 4, '#F29C8E', 0.4, 31);
  c.strokeStyle = '#9A5440'; c.lineWidth = 2.3; c.beginPath();
  if (o.dizzy) { c.moveTo(6, -67); c.quadraticCurveTo(10, -70, 14, -67); c.quadraticCurveTo(17, -64, 20, -67); }
  else c.arc(12, -70, 6, 0.15, Math.PI * 0.85);
  c.stroke();
  c.restore();
}

/* The football: cream with terracotta patches. */
function drawBall(c, x, y, r, spin) {
  c.save(); c.translate(x, y);
  c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip();
  const g = c.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r * 1.1); g.addColorStop(0, '#FFFBEE'); g.addColorStop(1, '#EAD9BE');
  c.fillStyle = g; c.fillRect(-r, -r, r * 2, r * 2);
  c.rotate(spin || 0);
  soft(c, 0, 0, r * 0.36, r * 0.36, '#C4573D', 0.9, 7);
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; soft(c, Math.cos(a) * r * 0.92, Math.sin(a) * r * 0.92, r * 0.3, r * 0.3, '#C4573D', 0.85, 8 + i); }
  c.restore();
  c.strokeStyle = 'rgba(150,100,90,0.35)'; c.lineWidth = 1.6; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
}

/* CIORI: a mischievous plum-colored crow. mood: cheeky | dizzy | sorry | happy */
function drawCiori(c, x, y, o) {
  const s = o.scale || 1, f = o.face || 1, t = o.t || 0, fly = !!o.fly;
  const body = o.body || '#5F4E80', dark = o.dark || '#4A3C68', light = o.light || '#8474A4';
  c.save(); c.translate(x, y); c.scale(s * f, s);
  if (fly) c.translate(0, Math.sin(t * 7) * 5);
  if (!fly) { c.strokeStyle = '#E99A3C'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(-8, -8); c.lineTo(-10, 0); c.moveTo(8, -8); c.lineTo(10, 0); c.moveTo(-16, 0); c.lineTo(-4, 0); c.moveTo(4, 0); c.lineTo(16, 0); c.stroke(); }
  for (let i = 0; i < 3; i++) { c.save(); c.translate(-28, -30); c.rotate(-0.5 + i * 0.3 + Math.sin(t * 4) * 0.05); puff(c, -18, 0, 20, 6.5, dark, 70 + i); c.restore(); }
  const g = c.createRadialGradient(6, -46, 4, 0, -34, 40); g.addColorStop(0, light); g.addColorStop(0.6, body); g.addColorStop(1, dark);
  puff(c, 0, -34, 34, 29, g, 71);
  soft(c, 8, -26, 20, 15, o.belly || '#9A8AB8', 0.5, 72);
  // wing
  c.save(); c.translate(-6, -42);
  if (fly) c.rotate(Math.sin(t * 16) * 0.95 - 0.3); else c.rotate(0.25 + (o.mood === 'sorry' ? 0.2 : 0));
  puff(c, -4, 12, 15, 24, dark, 73); soft(c, -5, 18, 9, 14, '#3F335C', 0.5, 74);
  c.restore();
  // head
  puff(c, 16, -62, 24, 22, body, 75);
  for (let i = 0; i < 3; i++) { c.save(); c.translate(10 + i * 5, -82); c.rotate(-0.5 + i * 0.4); puff(c, 0, -6, 4.5, 10, dark, 76 + i, 0); c.restore(); }
  // beak
  c.fillStyle = '#F0A040'; c.beginPath(); c.moveTo(34, -68); c.quadraticCurveTo(52, -66, 60, -57); c.quadraticCurveTo(48, -52, 35, -53); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(170,90,40,0.5)'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(36, -60); c.quadraticCurveTo(48, -60, 58, -57); c.stroke();
  const eo = { t: t, dizzy: o.mood === 'dizzy', happy: o.mood === 'happy', blinkOff: 1.3 };
  drawEye(c, 12, -65, 8.5, eo, 1); drawEye(c, 28, -66, 7.5, eo, 1);
  c.strokeStyle = '#3F335C'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath();
  if (o.mood === 'sorry') { c.moveTo(4, -74); c.lineTo(16, -79); c.moveTo(24, -79); c.lineTo(35, -75); }
  else if (o.mood === 'cheeky' || !o.mood) { c.moveTo(4, -79); c.lineTo(17, -74); c.moveTo(23, -75); c.lineTo(35, -79); }
  c.stroke();
  if (o.mood === 'sorry') { c.fillStyle = 'rgba(160,210,220,0.9)'; c.beginPath(); c.ellipse(-4, -70 + (t * 20 % 12), 3, 4.5, 0, 0, TAU); c.fill(); }
  c.restore();
}

/* Grumpy sleepy beetle. state: sleep | wake | chase | return | stun | knock */
function paintBeetleBody(c, b, t) {
  const moving = b.state === 'chase' || b.state === 'return';
  c.strokeStyle = '#7A4B60'; c.lineWidth = 3.5; c.lineCap = 'round';
  for (let i = 0; i < 3; i++) { const wig = moving ? Math.sin(t * 18 + i * 2) * 5 : 0; c.beginPath(); c.moveTo(-14 + i * 13, -6); c.lineTo(-18 + i * 13 + wig, 3); c.stroke(); }
  puff(c, 22, -15, 13, 12, '#7A4B60', 81);                       // head
  const g = c.createRadialGradient(-4, -30, 4, 0, -18, 34); g.addColorStop(0, '#D98A72'); g.addColorStop(0.6, '#BE665C'); g.addColorStop(1, '#9A4F58');
  puff(c, 0, -19, 30, 23, g, 80);                                // shell
  c.strokeStyle = 'rgba(122,60,80,0.45)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-2, -41); c.quadraticCurveTo(2, -20, -2, 2); c.stroke();
  const sp = [[-14, -26, 5], [10, -27, 5], [-12, -11, 4], [12, -11, 4.5]];
  for (let i = 0; i < 4; i++) soft(c, sp[i][0], sp[i][1], sp[i][2], sp[i][2], '#FBE3BA', 0.85, 82 + i);
  c.strokeStyle = '#7A4B60'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(27, -25); c.quadraticCurveTo(33, -36, 39, -34); c.moveTo(22, -26); c.quadraticCurveTo(24, -38, 30, -40); c.stroke();
  if (b.state === 'sleep' || b.state === 'return') {
    c.strokeStyle = '#3F2A3A'; c.lineWidth = 2.4; c.beginPath(); c.arc(26, -15, 4, 0.1, Math.PI - 0.1); c.stroke();
  } else if (b.state === 'stun' || b.state === 'knock') {
    drawEye(c, 26, -16, 5.5, { t: t, dizzy: true });
  } else {
    drawEye(c, 26, -16, 5.5, { t: 1 }, 1);
    c.strokeStyle = '#3F2A3A'; c.lineWidth = 2.6; c.beginPath(); c.moveTo(20, -24); c.lineTo(31, -20); c.stroke();
  }
}
function drawBeetle(c, b, t) {
  const f = b.face || 1;
  c.fillStyle = rgba(SHADOW, 0.22); c.beginPath(); c.ellipse(b.x - 6 * f, b.y + 2, 32, 11, 0, 0, TAU); c.fill();
  c.save(); c.translate(b.x, b.y); c.scale(f, 1);
  if (b.state === 'knock') c.rotate(t * 9);
  if (b.state === 'sleep') {
    const br = Math.sin(t * 1.6 + b.seed) * 0.04; c.scale(1 + br, 1 - br);
    const sp = sprite('beetleSleep', 100, 70, cc => { cc.translate(46, 58); paintBeetleBody(cc, { state: 'sleep' }, 0); });
    c.drawImage(sp, -46, -58, 100, 70);
  } else paintBeetleBody(c, b, t);
  c.restore();
  if (b.state === 'sleep') {
    const zs = sprite('zzz', 30, 34, cc => { text(cc, 'z', 15, 17, 28, '#8E7AA6', { halo: 0, shadow: 0, weight: 'bold' }); });
    for (let i = 0; i < 3; i++) {
      const p = ((t * 0.5 + i * 0.33 + b.seed) % 1), k = 0.6 + p * 0.6;
      c.globalAlpha = 0.9 * (1 - p); c.drawImage(zs, b.x + 26 * f + p * 26 - 15 * k, b.y - 44 - p * 44 - 17 * k, 30 * k, 34 * k);
    }
    c.globalAlpha = 1;
  } else if (b.state === 'wake') {
    text(c, '!', b.x, b.y - 66, 52, '#D9463C', { weight: 'bold' });
  }
}

function drawCone(c, x, y, rot, r, z) {
  c.fillStyle = rgba(SHADOW, 0.22); c.beginPath(); c.ellipse(x - 4, y + 4, r, r * 0.4, 0, 0, TAU); c.fill();
  const R = 26, sp = sprite('cone', 64, 72, cc => {
    cc.translate(32, 38);
    puff(cc, 0, 0, R * 0.82, R, '#9C6A46', 90, 'rgba(110,60,50,0.35)');
    cc.strokeStyle = 'rgba(214,170,120,0.85)'; cc.lineWidth = 2.2; cc.lineCap = 'round';
    for (let row = -2; row <= 2; row++) for (let k = -1; k <= 1; k++) {
      const px = k * R * 0.48 + (row % 2 ? R * 0.24 : 0), py = row * R * 0.36;
      if (px * px / (R * R * 0.6) + py * py / (R * R * 0.95) > 1) continue;
      cc.beginPath(); cc.arc(px, py - R * 0.1, R * 0.2, 0.15, Math.PI - 0.15); cc.stroke();
    }
    soft(cc, 0, -R * 0.95, R * 0.14, R * 0.14, '#7A4E38', 1, 91);
  });
  const k = r / R;
  c.save(); c.translate(x, y - r * 0.9 - (z || 0)); c.rotate(rot); c.drawImage(sp, -32 * k, -38 * k, 64 * k, 72 * k); c.restore();
}

function eggPath(c, r) {
  c.beginPath(); c.moveTo(0, -1.25 * r);
  c.bezierCurveTo(0.62 * r, -1.25 * r, 0.95 * r, -0.2 * r, 0.95 * r, 0.2 * r);
  c.bezierCurveTo(0.95 * r, 0.72 * r, 0.5 * r, r, 0, r);
  c.bezierCurveTo(-0.5 * r, r, -0.95 * r, 0.72 * r, -0.95 * r, 0.2 * r);
  c.bezierCurveTo(-0.95 * r, -0.2 * r, -0.62 * r, -1.25 * r, 0, -1.25 * r);
  c.closePath();
}
function drawEgg(c, x, y, r, t, seed, z) {
  const bob = Math.sin(t * 2.2 + seed) * 2.5, R = 40, k = r / R;
  c.fillStyle = rgba(SHADOW, 0.24); c.beginPath(); c.ellipse(x - 3, y + r * 0.55, r * 0.9, r * 0.32, 0, 0, TAU); c.fill();
  const sp = sprite('egg', 200, 220, cc => {
    cc.translate(100, 118);
    const gg = cc.createRadialGradient(0, 0, R * 0.5, 0, 0, R * 2.4); gg.addColorStop(0, 'rgba(255,226,130,0.4)'); gg.addColorStop(1, 'rgba(255,226,130,0)');
    cc.fillStyle = gg; cc.beginPath(); cc.arc(0, 0, R * 2.4, 0, TAU); cc.fill();
    const g = cc.createRadialGradient(-R * 0.3, -R * 0.5, R * 0.1, 0, 0, R * 1.35); g.addColorStop(0, '#FFF6C4'); g.addColorStop(0.45, '#F8CC4E'); g.addColorStop(1, '#E3952F');
    eggPath(cc, R); cc.fillStyle = g; cc.fill();
    cc.strokeStyle = 'rgba(190,110,50,0.35)'; cc.lineWidth = R * 0.1; cc.stroke();
    cc.fillStyle = 'rgba(255,255,245,0.8)'; cc.beginPath(); cc.ellipse(-R * 0.32, -R * 0.5, R * 0.2, R * 0.32, -0.4, 0, TAU); cc.fill();
  });
  c.save(); c.translate(x, y - r * 0.55 - (z || 0) + bob); c.rotate(Math.sin(t * 1.7 + seed * 2) * 0.1);
  c.drawImage(sp, -100 * k, -118 * k, 200 * k, 220 * k);
  const tw = Math.sin(t * 3 + seed * 5);
  if (tw > 0.55) { const q = (tw - 0.55) / 0.45; c.fillStyle = 'rgba(255,255,240,' + q + ')'; starPath(c, r * 0.5, -r * 0.9, r * 0.5 * q, t); c.fill(); }
  c.restore();
}
function drawStar(c, x, y, r, t, z) {
  const R = 26, k = r / R;
  c.fillStyle = rgba(SHADOW, 0.2); c.beginPath(); c.ellipse(x - 3, y + r * 0.4, r * 0.8, r * 0.28, 0, 0, TAU); c.fill();
  const sp = sprite('star', 150, 150, cc => {
    cc.translate(75, 75);
    const gg = cc.createRadialGradient(0, 0, R * 0.3, 0, 0, R * 2.6); gg.addColorStop(0, 'rgba(255,214,200,0.55)'); gg.addColorStop(1, 'rgba(255,214,200,0)');
    cc.fillStyle = gg; cc.beginPath(); cc.arc(0, 0, R * 2.6, 0, TAU); cc.fill();
    cc.lineJoin = 'round';
    starPath(cc, 0, 0, R, 0); cc.strokeStyle = '#F4B08E'; cc.lineWidth = R * 0.34; cc.stroke();
    const g = cc.createRadialGradient(-R * 0.2, -R * 0.3, 1, 0, 0, R); g.addColorStop(0, '#FFFDF0'); g.addColorStop(1, '#FFE7A0');
    cc.fillStyle = g; cc.fill();
    starPath(cc, 0, 0, R, 0); cc.strokeStyle = '#FFF0C0'; cc.lineWidth = R * 0.12; cc.stroke();
  });
  c.save(); c.translate(x, y - r * 1.1 - (z || 0) + Math.sin(t * 2.4) * 5); c.rotate(Math.sin(t * 1.3) * 0.25);
  c.drawImage(sp, -75 * k, -75 * k, 150 * k, 150 * k); c.restore();
}
function drawButterfly(c, x, y, t, s) {
  c.save(); c.translate(x, y); c.scale(s || 1, s || 1);
  const gg = c.createRadialGradient(0, 0, 4, 0, 0, 70); gg.addColorStop(0, 'rgba(255,200,120,0.5)'); gg.addColorStop(1, 'rgba(255,200,120,0)');
  c.fillStyle = gg; c.beginPath(); c.arc(0, 0, 70, 0, TAU); c.fill();
  const fl = 0.25 + Math.abs(Math.sin(t * 11)) * 0.75;
  for (const sd of [-1, 1]) {
    c.save(); c.scale(sd * fl, 1);
    puff(c, 15, -9, 16, 14, '#F2913C', 95, 'rgba(180,90,50,0.4)'); puff(c, 12, 10, 11, 10, '#F6B25A', 96, 'rgba(180,90,50,0.4)');
    soft(c, 17, -9, 7, 6, '#FFE2A6', 0.8, 97); soft(c, 12, 10, 4, 4, '#FFF0CC', 0.8, 98);
    c.restore();
  }
  puff(c, 0, 0, 3.5, 13, '#7A4A3A', 99, 0);
  c.strokeStyle = '#7A4A3A'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, -11); c.quadraticCurveTo(-4, -20, -8, -22); c.moveTo(0, -11); c.quadraticCurveTo(4, -20, 8, -22); c.stroke();
  c.restore();
}
/* A woven nest seen from above. */
function drawNest(c, x, y, r, seed, glow) {
  if (glow > 0) { const gg = c.createRadialGradient(x, y, r * 0.4, x, y, r * 2.2); gg.addColorStop(0, 'rgba(255,224,140,' + 0.55 * glow + ')'); gg.addColorStop(1, 'rgba(255,224,140,0)'); c.fillStyle = gg; c.beginPath(); c.arc(x, y, r * 2.2, 0, TAU); c.fill(); }
  wash(c, x - r * 0.12, y + r * 0.2, r * 1.1, r * 0.75, SHADOW, { a: 0.3, seed: seed, edge: 0 });
  wash(c, x, y, r, r * 0.72, '#B98858', { a: 1, seed: seed + 1, wob: 0.08, n: 16 });
  wash(c, x, y - r * 0.04, r * 0.72, r * 0.46, '#8E6244', { a: 0.9, seed: seed + 2, wob: 0.08, edge: 0 });
  wash(c, x, y, r * 0.6, r * 0.36, '#D9B27A', { a: 0.6, seed: seed + 3, edge: 0 });
  const rr = rng(seed);
  c.lineCap = 'round';
  for (let i = 0; i < 70; i++) {
    const a = rr() * TAU, d = 0.72 + rr() * 0.3, l = 0.25 + rr() * 0.3;
    c.strokeStyle = rgba(['#D9B27A', '#8E6244', '#E8CC96', '#A87850'][i % 4], 0.7); c.lineWidth = 2 + rr() * 2.5;
    c.beginPath(); c.moveTo(x + Math.cos(a) * r * d, y + Math.sin(a) * r * d * 0.72);
    c.quadraticCurveTo(x + Math.cos(a + l * 0.5) * r * (d + 0.08), y + Math.sin(a + l * 0.5) * r * (d + 0.08) * 0.72, x + Math.cos(a + l) * r * d, y + Math.sin(a + l) * r * d * 0.72); c.stroke();
  }
}
/* Small painted icons for hints (no words needed). */
function iconArrow(c, x, y, ang, size, col) {
  c.save(); c.translate(x, y); c.rotate(ang);
  c.fillStyle = rgba(SHADOW, 0.25); c.beginPath(); c.moveTo(size + 4, 5); c.lineTo(-size * 0.5 + 4, -size * 0.7 + 5); c.lineTo(-size * 0.2 + 4, 5); c.lineTo(-size * 0.5 + 4, size * 0.7 + 5); c.closePath(); c.fill();
  c.fillStyle = col; c.strokeStyle = 'rgba(255,248,226,0.9)'; c.lineWidth = size * 0.16; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(size, 0); c.lineTo(-size * 0.5, -size * 0.7); c.lineTo(-size * 0.2, 0); c.lineTo(-size * 0.5, size * 0.7); c.closePath(); c.stroke(); c.fill();
  c.restore();
}
function iconStick(c, x, y, r, t) {     // left stick: four little arrows and a wiggling cap
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; iconArrow(c, x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75, a, r * 0.42, '#F8C24E'); }
  soft(c, x + 3, y + 4, r, r, SHADOW, 0.25, 3);
  puff(c, x, y, r, r, '#FFF6E2', 4, 'rgba(120,90,90,0.35)');
  const a = t * 2.5; puff(c, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, r * 0.56, r * 0.56, '#8E7AA0', 5, 'rgba(90,60,90,0.4)');
}
function drawDizzyStars(c, x, y, t) {
  for (let i = 0; i < 3; i++) {
    const a = t * 5 + i * TAU / 3;
    c.fillStyle = '#FFE08A'; c.strokeStyle = 'rgba(210,140,70,0.5)'; c.lineWidth = 1.5;
    starPath(c, x + Math.cos(a) * 30, y + Math.sin(a) * 9, 9, a); c.fill(); c.stroke();
  }
}
function drawHero(c, k, x, y, o) { if (k === 0) drawBubu(c, x, y, o); else drawLeo(c, x, y, o); }
