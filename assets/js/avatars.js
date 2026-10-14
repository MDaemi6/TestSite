/* Eat Easily — Instagram-style avatar kit (pure SVG, no external assets).
 * Soft "Memoji / Meta avatar" look: big almond eyes, defined brows, glossy black hair,
 * light-olive skin, gentle volume shading. Iranian male / female characters.
 *   EEAvatar.full({gender:'female'|'male', build:0..3, zones:['belly','thighs','arms','hips','all'], mood})
 *   EEAvatar.bust({gender, mood, prop, age, hair})
 *   EEAvatar.pair()          -> female + male side by side (hero)
 * moods: smile | happy | sleepy | flat | think
 */
(() => {
  'use strict';
  let uid = 0;

  /* [highlight, base, shade] */
  const SKIN = ['#ffe9d6', '#f4cba9', '#d49c76'];
  const HAIR = {
    female: ['#5a5868', '#23212b', '#0c0b10'],
    male: ['#55535f', '#1f1d26', '#0b0a0f'],
    gray: ['#f6f7f9', '#d3d8df', '#a2abb8']
  };
  const TOP = {
    male: ['#8fb0f7', '#3b73ee', '#1a479f'],
    female: ['#ffe2ad', '#f7ae2c', '#d9892a']
  };
  const PANTS = ['#93aad0', '#5b78a8', '#384f7a'];
  const SHOE = ['#ffffff', '#f3f5f8', '#c2cad6'];
  const WHITE = ['#ffffff', '#f3f5f8', '#cdd3dc'];

  const P = {
    male: { S: [32, 37, 45, 53], W: [24, 31, 45, 58], H: [28, 34, 45, 55], arm: [14, 17, 22, 27], leg: [20, 25, 34, 43] },
    female: { S: [27, 31, 38, 45], W: [19, 25, 40, 53], H: [30, 38, 50, 60], arm: [12, 15, 20, 25], leg: [20, 25, 35, 44] }
  };

  function kit() {
    const id = 'av' + (++uid);
    const defs = [];
    let n = 0;
    const G = (c, type) => {
      const gid = `${id}-g${++n}`;
      const [l, b, d] = c;
      defs.push(type === 'v'
        ? `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${d}"/><stop offset=".32" stop-color="${l}"/><stop offset=".68" stop-color="${b}"/><stop offset="1" stop-color="${d}"/></linearGradient>`
        : type === 'h'
          ? `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${l}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${d}"/></linearGradient>`
          : `<radialGradient id="${gid}" cx=".3" cy=".24" r=".98"><stop offset="0" stop-color="${l}"/><stop offset=".52" stop-color="${b}"/><stop offset="1" stop-color="${d}"/></radialGradient>`);
      return `url(#${gid})`;
    };
    const clip = (d) => {
      const cid = `${id}-c${++n}`;
      defs.push(`<clipPath id="${cid}"><path d="${d}"/></clipPath>`);
      return `url(#${cid})`;
    };
    const shadowId = `${id}-sh`;
    const glowId = `${id}-gl`;
    defs.push(`<radialGradient id="${shadowId}"><stop offset="0" stop-color="#1f2937" stop-opacity=".30"/><stop offset="1" stop-color="#1f2937" stop-opacity="0"/></radialGradient>`);
    defs.push(`<radialGradient id="${glowId}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff" stop-opacity=".75"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>`);
    return { id, defs, G, clip, shadow: `url(#${shadowId})`, glow: `url(#${glowId})` };
  }

  /* Head in local coords: centre (0,0), face ≈ 52 wide, from y=-31 (crown) to y=31 (chin).
   * Returns { back, front, locks } — back sits behind the body, locks hang in front of it. */
  function head(k, { gender, mood = 'smile', hair, age, build = 1 }) {
    const male = gender === 'male';
    const f = Math.max(0, Math.min(3, Math.round(build)));
    const H = hair || HAIR[gender];
    const hairC = k.G(H);
    const browC = H[2];
    const lid = '#17111a';
    const skin = k.G(SKIN);
    const skinEar = k.G([SKIN[1], SKIN[2], SKIN[2]]);
    const lipC = male ? '#c4786c' : '#d65f72';
    const lipD = male ? '#9a4f48' : '#a63a4d';

    /* face outline — gets fuller with build */
    const c = 25.5 + f * 1.9;
    const j = (male ? 17 : 14) + f * 3.4;
    const face = `M${-c} -4C${-c} -23 -14 -31 0 -31C14 -31 ${c} -23 ${c} -4C${c} 14 ${j} 31 0 31C${-j} 31 ${-c} 14 ${-c} -4Z`;
    const faceClip = k.clip(face);

    /* ---- eyes ---- */
    const open = { smile: 1, happy: 1, think: 1, flat: 0.5, sleepy: 0 }[mood] ?? 1;
    const look = mood === 'think' ? [-1.3, -0.9] : [0, 0];
    const eye = (ex, s) => {
      const inX = ex - s * 6.6, outX = ex + s * 6.8;
      const top = -5.6 * open;
      const bot = open === 0 ? 0 : (open < 1 ? 3.6 : 4.8);
      const shape = `M${inX} 1.3C${ex - s * 4.6} ${top} ${ex + s * 4.2} ${top - 0.3} ${outX} -0.5C${ex + s * 4} ${bot - 0.4} ${ex - s * 4} ${bot} ${inX} 1.3Z`;
      if (open === 0) {
        return `<path d="M${inX} 0.6Q${ex} 6.2 ${outX} -0.6" fill="none" stroke="${lid}" stroke-width="2.1" stroke-linecap="round"/>
          <path d="M${outX} -0.6l${s * 2.8} -1.6" fill="none" stroke="${lid}" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M${ex + s * 3} 3.6l${s * 1.4} 1.8M${ex} 4.6l${s * 0.6} 2" fill="none" stroke="${lid}" stroke-width="1" stroke-linecap="round" opacity=".7"/>`;
      }
      const ec = k.clip(shape);
      const ix = ex + look[0], iy = (open < 1 ? 1.1 : 0.2) + look[1];
      const topLine = `M${inX} 1.3C${ex - s * 4.6} ${top} ${ex + s * 4.2} ${top - 0.3} ${outX} -0.5`;
      return `<path d="${shape}" fill="#fff"/>
        <g clip-path="${ec}">
          <circle cx="${ix}" cy="${iy}" r="3.9" fill="#4a2b1a"/>
          <circle cx="${ix}" cy="${iy}" r="3.9" fill="none" stroke="#2a150c" stroke-width="1"/>
          <circle cx="${ix}" cy="${iy}" r="1.9" fill="#0f0806"/>
          <circle cx="${ix - 1.3}" cy="${iy - 1.5}" r="1.25" fill="#fff"/><circle cx="${ix + 1.4}" cy="${iy + 1.4}" r=".65" fill="#fff" opacity=".75"/>
          <path d="M${inX - 1} ${top - 1}H${outX + 1}V${top + 1.4 + (open < 1 ? 3.2 : 0)}H${inX - 1}Z" fill="#000" opacity=".12"/>
        </g>
        <path d="${topLine}" fill="none" stroke="${lid}" stroke-width="${male ? 1.8 : 2.1}" stroke-linecap="round"/>
        ${male ? '' : `<path d="M${outX} -0.5q${s * 2.2} -0.2 ${s * 3} -2.4" fill="none" stroke="${lid}" stroke-width="1.7" stroke-linecap="round"/>`}
        <path d="M${ex - s * 4.8} ${top - 2.2}Q${ex} ${top - 4.2} ${ex + s * 5} ${top - 1.8}" fill="none" stroke="#a8684a" stroke-width=".9" stroke-linecap="round" opacity=".38"/>
        <path d="M${inX + s * 1.5} ${bot + 0.2}Q${ex} ${bot + 1.1} ${outX - s * 1.5} ${bot - 0.8}" fill="none" stroke="#a8684a" stroke-width=".8" stroke-linecap="round" opacity=".25"/>`;
    };

    /* ---- brows ---- */
    const bw = male ? 3.3 : 2.5;
    const brow = (ex, s, lift = 0, tiltIn = 0, arch = 1) => {
      const by = -11.2 - lift;
      const inX = ex - s * 6.8, outX = ex + s * 7.4;
      const peak = male ? 1.7 : 3.4;
      return `<path d="M${inX} ${by + 0.6 + tiltIn}Q${ex + s * 1.8} ${by - peak * arch} ${outX} ${by + 1.4}" fill="none" stroke="${browC}" stroke-width="${bw}" stroke-linecap="round" opacity="${male ? 0.95 : 0.9}"/>`;
    };
    const browPair = {
      smile: () => brow(-11, -1) + brow(11, 1),
      happy: () => brow(-11, -1, 1.4) + brow(11, 1, 1.4),
      sleepy: () => brow(-11, -1, -0.4, 0.4, 0.6) + brow(11, 1, -0.4, 0.4, 0.6),
      flat: () => brow(-11, -1, 0, -2.2, 0.6) + brow(11, 1, 0, -2.2, 0.6),
      think: () => brow(-11, -1, 3.2, 0, 1.3) + brow(11, 1, -0.4, 1, 0.8)
    }[mood] || (() => brow(-11, -1) + brow(11, 1));

    /* ---- mouth ---- */
    const upperLip = (w, h) => `M${-w} 17Q${-w / 2} ${17 - h} 0 ${17 - h * 0.45}Q${w / 2} ${17 - h} ${w} 17`;
    const mouths = {
      smile: `<path d="${upperLip(7.4, 1.7)}Q0 ${male ? 22.2 : 24} ${-7.4} 17Z" fill="${lipC}"/>
        <path d="M-7.4 17Q0 19.8 7.4 17" fill="none" stroke="${lipD}" stroke-width="1" stroke-linecap="round" opacity=".7"/>
        <ellipse cx="0" cy="20.2" rx="2.6" ry=".9" fill="#fff" opacity=".4"/>`,
      happy: (() => {
        const m = 'M-9.2 16.3Q0 18.4 9.2 16.3Q7.6 26.8 0 26.8Q-7.6 26.8 -9.2 16.3Z';
        const mc = k.clip(m);
        return `<path d="${m}" fill="#6a1c2b"/>
        <g clip-path="${mc}"><path d="M-9 16.2Q0 18.4 9 16.2L8.4 20.6Q0 22.4 -8.4 20.6Z" fill="#fff"/><ellipse cx="0" cy="25.6" rx="5.2" ry="3" fill="#e8707f"/></g>
        <path d="${m}" fill="none" stroke="${lipC}" stroke-width="1.5" stroke-linejoin="round"/>`;
      })(),
      sleepy: `<path d="M-3.8 18.6Q0 20.8 3.8 18.6" fill="none" stroke="${lipD}" stroke-width="2" stroke-linecap="round"/>`,
      flat: `<path d="M-4.6 19.6Q0 17.8 4.6 19.6" fill="none" stroke="${lipD}" stroke-width="2" stroke-linecap="round"/>`,
      think: `<path d="M-3.4 19.2Q2 17.6 6.2 19.8" fill="none" stroke="${lipD}" stroke-width="2" stroke-linecap="round"/>`
    };
    const m = mouths[mood] ? mood : 'smile';

    /* ---- facial hair (men): light designer stubble + moustache ---- */
    const stubble = male ? `<g clip-path="${faceClip}">
        <path d="M-34 -2C-29 12 -17 14.5 -8 15.2Q0 13.6 8 15.2C17 14.5 29 12 34 -2L34 40L-34 40Z" fill="${H[2]}" opacity="${age >= 50 ? 0.2 : 0.13}"/>
        <path d="M-9.6 15.2Q-4.6 12 0 13.4Q4.6 12 9.6 15.2Q4.8 16.2 0 15.6Q-4.8 16.2 -9.6 15.2Z" fill="${H[2]}" opacity=".4"/>
      </g>` : '';

    /* ---- hair ---- */
    const sheen = (d) => `<path d="${d}" fill="none" stroke="#9aa6d8" stroke-width="2.6" stroke-linecap="round" opacity="${age >= 50 || hair ? 0.35 : 0.3}"/>`;
    const back = male ? '' : `<g><path d="M-34 -6C-41 -38 -14 -45 0 -45S41 -38 34 -6C38 14 41 40 37 58Q31 67 18 63L-18 63Q-31 67 -37 58C-41 40 -38 14 -34 -6Z" fill="${hairC}"/>
      <path d="M-30 20C-33 36 -33 50 -30 60M30 20C33 36 33 50 30 60" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" opacity=".18"/></g>`;
    const frontHair = male
      ? `<path d="M-29 -2C-35 -28 -22 -41 -2 -43C18 -45 34 -34 29 -2C28 -9 25 -14 21 -17C17 -14 12 -20 3 -22C-6 -20 -14 -17 -19 -13C-23 -11 -27 -7 -29 -2Z" fill="${hairC}"/>
         <path d="M-12 -38C-4 -48 16 -48 23 -36C16 -39 6 -39 -12 -38Z" fill="${hairC}"/>
         ${sheen('M-16 -35Q-1 -45 16 -38')}
         <path d="M-6 -42Q-2 -33 -4 -25M6 -43Q10 -33 8 -24M17 -40Q21 -33 19 -26" fill="none" stroke="#000" stroke-width="1.3" stroke-linecap="round" opacity=".25"/>
         <path d="M-29 -2C-30 4 -28.500 8 -27 9L-25 1Z M29 -2C30 4 28.500 8 27 9L25 1Z" fill="${hairC}"/>`
      : `<path d="M-31 8C-37 -25 -16 -39 2 -39C23 -39 36 -22 31 8C29 -6 24 -16 15 -22C7 -14 -6 -7 -20 -3C-25 -1 -28 3 -31 8Z" fill="${hairC}"/>
         <path d="M15 -22C20 -30 14 -37 4 -38.500" fill="none" stroke="#000" stroke-width="1.4" stroke-linecap="round" opacity=".28"/>
         ${sheen('M-19 -29Q-2 -38 16 -31')}${sheen('M-24 -10Q-18 -16 -9 -14')}`;
    const locks = male ? '' : `<g>
      <path d="M-26 12C-35 33 -37 50 -32 65Q-25 70 -21 61C-19 46 -21 30 -24.500 16Z" fill="${hairC}"/>
      <path d="M26 12C35 33 37 50 32 65Q25 70 21 61C19 46 21 30 24.500 16Z" fill="${hairC}"/>
      <path d="M-30 30C-32 42 -31 52 -28 60M30 30C32 42 31 52 28 60" fill="none" stroke="#9aa6d8" stroke-width="2.2" stroke-linecap="round" opacity=".28"/></g>`;

    return {
      back: back ? `<g>${back}</g>` : '',
      locks: locks ? `<g>${locks}</g>` : '',
      front: `<g>
        <ellipse cx="${-c + 0.5}" cy="3" rx="4.8" ry="6.4" fill="${skinEar}"/><ellipse cx="${c - 0.5}" cy="3" rx="4.8" ry="6.4" fill="${skinEar}"/>
        <ellipse cx="${-c - 0.3}" cy="3.4" rx="2" ry="3.4" fill="#b86f52" opacity=".4"/><ellipse cx="${c + 0.3}" cy="3.4" rx="2" ry="3.4" fill="#b86f52" opacity=".4"/>
        <path d="${face}" fill="${skin}"/>
        <g clip-path="${faceClip}">
          <ellipse cx="0" cy="-23" rx="30" ry="10" fill="#7a3d22" opacity=".16"/>
          <ellipse cx="${-c + 3}" cy="14" rx="7" ry="16" fill="#b66f4e" opacity=".12"/><ellipse cx="${c - 3}" cy="14" rx="7" ry="16" fill="#b66f4e" opacity=".12"/>
        </g>
        <ellipse cx="${-15.500 - f * 0.8}" cy="10.500" rx="6.2" ry="4.2" fill="#ff7a7a" opacity="${male ? 0.2 : 0.3}"/><ellipse cx="${15.500 + f * 0.8}" cy="10.500" rx="6.2" ry="4.2" fill="#ff7a7a" opacity="${male ? 0.2 : 0.3}"/>
        ${f >= 2 ? `<path d="M${-j + 1} 28.500Q0 ${33 + f} ${j - 1} 28.500" fill="none" stroke="#b36a4b" stroke-width="1.2" stroke-linecap="round" opacity=".22"/>` : ''}
        ${stubble}
        ${eye(-11, -1)}${eye(11, 1)}
        ${browPair()}
        <path d="M-2.800 8.300Q0 11.200 2.800 8.300" fill="none" stroke="#b06a4e" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>
        <path d="M3 -2Q4.500 4 3.200 8" fill="none" stroke="#b06a4e" stroke-width="1.4" stroke-linecap="round" opacity=".14"/>
        <ellipse cx="-.4" cy="3" rx="1.2" ry="4.600" fill="#fff" opacity=".2"/>
        ${mouths[m]}
        ${frontHair}
        <ellipse cx="-12" cy="-27" rx="11" ry="4.500" transform="rotate(-18 -12 -27)" fill="${k.glow}" opacity=".35"/>
      </g>`
    };
  }

  /* ---------- Full body ---------- */
  /* Half-widths per build (0 slim … 3 heavy). */
  const BODY = {
    male: {
      S: [34, 38, 44, 50], C: [30, 35, 43, 51], W: [24, 29, 42, 55], H: [27, 31, 40, 50],
      T: [11, 13, 17, 21], K: [8.5, 10, 13, 15.5], Ca: [8, 9.5, 12, 14], Au: [7, 8.5, 11, 13.5], Af: [6, 7, 9, 11]
    },
    female: {
      S: [28, 31, 36, 41], C: [23, 27, 34, 41], W: [18, 22, 34, 46], H: [29, 34, 43, 52],
      T: [11, 13.5, 18, 22], K: [8, 9.5, 12.5, 15], Ca: [7.5, 9, 11.5, 13.5], Au: [6, 7.5, 10, 12.5], Af: [5, 6.2, 8.2, 10.2]
    }
  };

  /* Smooth Catmull-Rom path through points. */
  const sp = (pts, move = true) => {
    const n = pts.length;
    const g = (i) => pts[Math.max(0, Math.min(n - 1, i))];
    const f = (v) => Math.round(v * 10) / 10;
    let d = move ? `M${f(pts[0][0])} ${f(pts[0][1])}` : '';
    for (let i = 0; i < n - 1; i++) {
      const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d;
  };

  function full(opts = {}) {
    const gender = opts.gender === 'male' ? 'male' : 'female';
    const male = gender === 'male';
    const b = Math.max(0, Math.min(3, Math.round(opts.build ?? 1)));
    const zones = opts.zones || [];
    const q = BODY[gender];
    const S = q.S[b], C = q.C[b], W = q.W[b], H = q.H[b], T = q.T[b], K = q.K[b], Ca = q.Ca[b], Au = q.Au[b], Af = q.Af[b];
    const cx = 100;
    const k = kit();
    const skin = k.G(SKIN);
    const top = k.G(TOP[gender]);
    const topC = TOP[gender];
    const topD = topC[2];
    const hd = head(k, { gender, mood: opts.mood || 'smile', hair: opts.hair && HAIR[opts.hair], build: b });
    const HX = cx, HY = 50;
    const shoeFill = k.G(SHOE), neckG = k.G([SKIN[1], SKIN[2], SKIN[2]], 'v'), topV = k.G(TOP[gender], 'v');

    /* ---------- key heights ---------- */
    const yS = 94, yC = 122, yW = 156, yHem = 194 + b * 0.5;

    /* ---------- legs (straight-leg jeans) ---------- */
    const jeans = PANTS;
    const leg = (s) => {
      const xc = (y) => {
        const t = (y - 190) / (310 - 190);
        return cx + s * (H * 0.5 + t * (7 + b * 1.2));
      };
      const hw = (y) => {
        const pts = [[188, T * 1.2], [220, T], [258, K], [286, Ca], [310, Ca * 0.96 + 1]];
        for (let i = 0; i < pts.length - 1; i++) {
          if (y >= pts[i][0] && y <= pts[i + 1][0]) { const t = (y - pts[i][0]) / (pts[i + 1][0] - pts[i][0]); return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t; }
        }
        return pts[pts.length - 1][1];
      };
      const ys = [188, 220, 258, 286, 310];
      const outer = ys.map(y => [xc(y) + s * hw(y), y]);
      const inner = ys.slice().reverse().map(y => [xc(y) - s * hw(y), y]);
      const d = sp(outer) + `L${inner[0][0]} ${inner[0][1]}` + sp(inner, false);
      return { d: d + 'Z', xc, hw };
    };
    const legL = leg(-1), legR = leg(1);
    const jg = k.G(jeans, 'v');
    const jh = k.G(jeans, 'h');
    const legShade = (L_) => {
      const x = L_.xc, h = L_.hw;
      return `<path d="M${x(222) - h(222) * 0.1} 214Q${x(258) - 2} 236 ${x(258) - h(258) * 0.35} 258" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".14"/>
        <path d="M${x(256) - h(256) * 0.8} 256Q${x(256)} 262 ${x(256) + h(256) * 0.8} 256" fill="none" stroke="#1e2a44" stroke-width="1.6" stroke-linecap="round" opacity=".22"/>
        <path d="M${x(304) - h(304)} 303H${x(304) + h(304)}" stroke="#1e2a44" stroke-width="2" stroke-linecap="round" opacity=".28"/>`;
    };

    /* ---------- sneakers ---------- */
    const shoe = (s) => {
      const x = legL.xc && (s < 0 ? legL : legR).xc(310);
      const w = Ca + 7;
      const gx = x + s * 3;
      return `<g transform="rotate(${s * 7} ${gx} 316)">
        <path d="M${gx - w} 322Q${gx - w - 1} 328 ${gx} 328.500Q${gx + w + 3} 328 ${gx + w + 4} 322Z" fill="#dfe5ee"/>
        <path d="M${gx - w + 1} 309C${gx - w} 318 ${gx - w - 1} 322 ${gx - w} 324L${gx + w + 4} 324C${gx + w + 7} 322 ${gx + w + 4} 316 ${gx + w - 3} 314C${gx + w - 9} 313 ${gx + 2} 308.500 ${gx + 2} 308.500Z" fill="${shoeFill}"/>
        <path d="M${gx + w - 3} 316C${gx + w + 3} 316 ${gx + w + 6} 320 ${gx + w + 4} 324L${gx + w - 8} 324C${gx + w - 6} 320 ${gx + w - 6} 317 ${gx + w - 3} 316Z" fill="#fff" opacity=".9"/>
        <path d="M${gx - w + 2} 324H${gx + w + 4}" stroke="#2a3242" stroke-width="2" opacity=".75"/>
        <path d="M${gx - 4} 311l5 3M${gx - 1} 309.500l5 3" stroke="#8b96a8" stroke-width="1.300" stroke-linecap="round"/>
      </g>`;
    };

    /* ---------- torso (tee) ---------- */
    const neckY = male ? 106 : 111;
    const Lp = [[cx - 14, 91], [cx - S + 5, 94], [cx - S, 104], [cx - C, 124], [cx - W, 156], [cx - H - 1, yHem]];
    const Rp = Lp.map(([x, y]) => [2 * cx - x, y]).reverse();
    const torsoD = sp(Lp) + `Q${cx} ${yHem + 3 + b} ${cx + H + 1} ${yHem}` + sp(Rp, false).replace(/^/, '') + `Q${cx} ${neckY} ${cx - 14} 91Z`;
    const neckline = `M${cx - 14} 91Q${cx} ${neckY} ${cx + 14} 91`;

    /* ---------- arms ---------- */
    const tube = (pts, ws, cols, dx = -0.12) => {
      /* pts: joints, ws: width per segment. Layered strokes give a soft volume. */
      const seg = (i, w, col, off = 0, op = 1) => `<path d="M${pts[i][0] + off} ${pts[i][1]}L${pts[i + 1][0] + off} ${pts[i + 1][1]}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="${op}"/>`;
      let s = '';
      for (let i = 0; i < pts.length - 1; i++) s += seg(i, ws[i] * 2, cols[2]);
      for (let i = 0; i < pts.length - 1; i++) s += seg(i, ws[i] * 1.55, cols[1], ws[i] * dx * 0.6);
      for (let i = 0; i < pts.length - 1; i++) s += seg(i, ws[i] * 0.6, cols[0], ws[i] * dx * 1.6, 0.8);
      return s;
    };
    const hand = (x, y, r, rot) => `<g transform="rotate(${rot} ${x} ${y})">
      <ellipse cx="${x}" cy="${y + r * 0.7}" rx="${r}" ry="${r * 1.35}" fill="${skin}"/>
      <ellipse cx="${x + (rot > 0 ? -1 : 1) * r * 0.85}" cy="${y + r * 0.1}" rx="${r * 0.38}" ry="${r * 0.85}" fill="${skin}" transform="rotate(${rot > 0 ? 18 : -18} ${x} ${y})"/>
    </g>`;
    const sleeve = (j0, j1) => {
      const dx = j1[0] - j0[0], dy = j1[1] - j0[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
      const e = [j0[0] + dx * 0.56, j0[1] + dy * 0.56];
      const w0 = Au + 4.5, w1 = Au + 3.4;
      const a0 = [j0[0] + nx * w0, j0[1] + ny * w0], b0 = [j0[0] - nx * w0, j0[1] - ny * w0];
      const a1 = [e[0] + nx * w1, e[1] + ny * w1], b1 = [e[0] - nx * w1, e[1] - ny * w1];
      const cap = [j0[0] - ux * w0 * 1.2, j0[1] - uy * w0 * 1.2];
      const f = (pt) => `${Math.round(pt[0] * 10) / 10} ${Math.round(pt[1] * 10) / 10}`;
      return `<path d="M${f(b0)}Q${f(cap)} ${f(a0)}L${f(a1)}Q${f([e[0] + ux * 1.5, e[1] + uy * 1.5])} ${f(b1)}Z" fill="${topV}"/>
        <path d="M${f(a1)}Q${f([e[0] + ux * 1.5, e[1] + uy * 1.5])} ${f(b1)}" fill="none" stroke="${topD}" stroke-width="1.6" stroke-linecap="round" opacity=".35"/>`;
    };
    const armR = () => {
      const j = [[cx + S - 6, 107], [cx + S + 3 + b * 2, 150], [cx + S + 5 + b * 2.4, 192 + b]];
      const ws = [Au + 2, Af + 1.4];
      return `<g>${tube([[j[0][0] + (j[1][0] - j[0][0]) * 0.4, j[0][1] + (j[1][1] - j[0][1]) * 0.4], j[1], j[2]], ws, [SKIN[0], SKIN[1], SKIN[2]])}
        ${hand(j[2][0] + 0.5, j[2][1] + 2, Af * 1.25, -4)}
        ${sleeve(j[0], j[1])}</g>`;
    };
    const armL = () => {
      /* hand on hip */
      const hipX = cx - H + 1;
      const j = [[cx - S + 6, 107], [cx - S - 12 - b * 3, 148], [hipX + 3, 188 + b]];
      const ws = [Au + 2, Af + 1.4];
      return `<g>${tube([[j[0][0] + (j[1][0] - j[0][0]) * 0.4, j[0][1] + (j[1][1] - j[0][1]) * 0.4], j[1], j[2]], ws, [SKIN[0], SKIN[1], SKIN[2]])}
        ${hand(j[2][0] + 3, j[2][1] - 1, Af * 1.25, 62)}
        ${sleeve(j[0], j[1])}</g>`;
    };

    /* ---------- zones ---------- */
    const zone = (cxz, cyz, rx, ry) => `<ellipse class="av-zone" cx="${cxz}" cy="${cyz}" rx="${rx}" ry="${ry}"/>`;
    const all = zones.includes('all');
    const z = [];
    if (all || zones.includes('belly')) z.push(zone(cx, 166, W + 9, 26));
    if (all || zones.includes('thighs')) { z.push(zone(legL.xc(228), 232, T + 8, 36)); z.push(zone(legR.xc(228), 232, T + 8, 36)); }
    if (all || zones.includes('arms')) {
      z.push(zone(cx + S + 3 + b * 2, 140, Au + 9, 38));
      z.push(zone(cx - S - 8 - b * 2, 138, Au + 9, 38));
    }
    if (all || zones.includes('hips')) z.push(zone(cx, 196, H + 9, 20));

    const bellyShade = b >= 2
      ? `<ellipse cx="${cx}" cy="${168 + b * 2}" rx="${W - 6}" ry="${16 + b * 2}" fill="${k.glow}" opacity=".28"/>
         <path d="M${cx - W + 8} ${178 + b * 2}Q${cx} ${192 + b * 4} ${cx + W - 8} ${178 + b * 2}" fill="none" stroke="${topD}" stroke-width="2.4" stroke-linecap="round" opacity=".26"/>`
      : `<path d="M${cx - W + 6} 178Q${cx} 186 ${cx + W - 6} 178" fill="none" stroke="${topD}" stroke-width="2" stroke-linecap="round" opacity=".1"/>`;

    return `<svg class="av av--full" viewBox="0 0 200 340" role="img" aria-label="${opts.label || ''}" ${opts.label ? '' : 'aria-hidden="true"'} xmlns="http://www.w3.org/2000/svg">
      <defs>${k.defs.join('')}</defs>
      <ellipse cx="${cx}" cy="327" rx="${H + 34}" ry="8" fill="${k.shadow}"/>
      ${hd.back ? `<g transform="translate(${HX} ${HY})">${hd.back}</g>` : ''}
      <path d="${legL.d}" fill="${jg}"/><path d="${legR.d}" fill="${jg}"/>
      ${legShade(legL)}${legShade(legR)}
      ${shoe(-1)}${shoe(1)}
      <path d="M${cx - H} 178L${cx + H} 178C${cx + H + 2} 190 ${cx + H - 1} 200 ${cx} 208C${cx - H + 1} 200 ${cx - H - 2} 190 ${cx - H} 178Z" fill="${jh}"/>
      <path d="M${cx} 200V${224}" stroke="#1e2a44" stroke-width="2" stroke-linecap="round" opacity=".3"/>
      <path d="M${cx - H + 6} 200Q${cx - H + 18} 214 ${cx - H + 26} 206M${cx + H - 6} 200Q${cx + H - 18} 214 ${cx + H - 26} 206" fill="none" stroke="#f3d28e" stroke-width="1.3" stroke-dasharray="3 2.500" stroke-linecap="round" opacity=".6"/>
      <rect x="${cx - 8}" y="72" width="16" height="30" rx="7" fill="${neckG}"/>
      <path d="M${cx - 15} 88Q${cx} ${neckY + 3} ${cx + 15} 88Z" fill="${skin}"/>
      <path d="${torsoD}" fill="${top}"/>
      <path d="M${cx - C + 1} 126Q${cx - W + 1} 142 ${cx - W + 2} 156M${cx + C - 1} 126Q${cx + W - 1} 142 ${cx + W - 2} 156" fill="none" stroke="${topD}" stroke-width="3" stroke-linecap="round" opacity=".16"/>
      <ellipse cx="${cx - C * 0.4}" cy="130" rx="${Math.max(7, C * 0.28)}" ry="17" transform="rotate(10 ${cx - C * 0.4} 130)" fill="${k.glow}" opacity=".34"/>
      <path d="M${cx - 8} 128Q${cx - 3} 138 ${cx - 10} 150M${cx + 10} 134Q${cx + 14} 142 ${cx + 9} 150" fill="none" stroke="${topD}" stroke-width="1.6" stroke-linecap="round" opacity=".12"/>
      ${bellyShade}
      <rect x="${cx - H - 1}" y="${yHem - 6}" width="${2 * H + 2}" height="6" rx="3" fill="${topD}" opacity=".22"/>
      <path d="${neckline}" fill="none" stroke="${topD}" stroke-width="3.200" stroke-linecap="round" opacity=".6"/>
      ${armR()}
      <ellipse cx="${cx}" cy="82" rx="10" ry="4.500" fill="#7a3d22" opacity=".3"/>
      ${armL()}
      <g transform="translate(${HX} ${HY})">${hd.front}</g>
      ${hd.locks ? `<g transform="translate(${HX} ${HY})">${hd.locks}</g>` : ''}
      ${z.length ? `<g class="av-zones">${z.join('')}</g>` : ''}
    </svg>`;
  }

  /* ---------- Props (bust coords, 200x200) ---------- */
  function prop(name, k) {
    const hand = (x, y, r = 12) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${k.G(SKIN)}"/>`;
    const gold = k.G(['#ffdfa8', '#f59e0b', '#d9992a']);
    const blue = k.G(['#e4ecfe', '#a9c9fd', '#417bf7']);
    const green = k.G(['#9ab9fb', '#2563eb', '#103b96']);
    const dark = k.G(['#6a788c', '#3f4b5c', '#2a3340']);
    const red = k.G(['#ffb1a3', '#f0745e', '#c24a35']);
    const white = k.G(WHITE);
    const peach = k.G(['#ffe8d2', '#ffd8b8', '#e6a77a']);
    const P = {
      glass: `<path d="M138 112h28l-3 46q-.5 8-8 8h-6q-7.5 0-8-8z" fill="${blue}" opacity=".95"/><path d="M140.5 126h23l-1.6 30q-.4 6-6 6h-7.8q-5.600 0-6-6z" fill="#759ff9" opacity=".75"/><ellipse cx="152" cy="112" rx="14" ry="3.5" fill="#ffffff" opacity=".7"/><path d="M143 118l1.5 38" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>${hand(150, 166, 11)}`,
      zzz: `<g fill="none" stroke="${gold}" stroke-linecap="round" stroke-linejoin="round"><path d="M138 56h16l-16 18h16" stroke-width="6"/><path d="M162 28h11l-11 12.500h11" stroke-width="5"/><path d="M178 10h7l-7 8h7" stroke-width="4"/></g>`,
      dumbbell: `<g transform="rotate(-18 150 150)"><rect x="124" y="145" width="52" height="9" rx="4.500" fill="${dark}"/><rect x="118" y="132" width="14" height="36" rx="6" fill="${green}"/><rect x="168" y="132" width="14" height="36" rx="6" fill="${green}"/><rect x="110" y="138" width="10" height="24" rx="4.500" fill="${dark}"/><rect x="180" y="138" width="10" height="24" rx="4.500" fill="${dark}"/></g>${hand(150, 156, 11)}`,
      bowl: `<path d="M120 138h60q-2 32-30 32t-30-32z" fill="${white}"/><path d="M122 140h56" stroke="#cfd5de" stroke-width="2"/><circle cx="138" cy="132" r="9" fill="${green}"/><circle cx="152" cy="127" r="10" fill="${red}"/><circle cx="165" cy="133" r="8.500" fill="${gold}"/><circle cx="150" cy="136" r="7" fill="${green}"/>${hand(150, 172, 10)}`,
      phone: `<g transform="rotate(10 150 150)"><rect x="136" y="118" width="30" height="52" rx="7" fill="${dark}"/><rect x="140" y="124" width="22" height="38" rx="3.500" fill="${blue}"/><circle cx="151" cy="143" r="6" fill="#ffffff" opacity=".6"/></g>${hand(152, 172, 11)}`,
      sneaker: `<g transform="rotate(-8 150 150)"><path d="M118 168q-2-26 12-30l14-4q6 14 22 14 14 0 16 12v8q0 6-6 6h-52q-6 0-6-6z" fill="${white}"/><path d="M114 174h74v8q0 5-5 5h-64q-5 0-5-5z" fill="${green}"/><path d="M148 142l6 6m4-10l6 6" stroke="${green}" stroke-width="3" stroke-linecap="round"/></g>`,
      drops: `<path d="M148 30q-9 14-9 22a9 9 0 0018 0q0-8-9-22z" fill="${blue}"/><path d="M168 62q-6 9-6 14a6 6 0 0012 0q0-5-6-14z" fill="${blue}"/><path d="M36 38q-6 9-6 14a6 6 0 0012 0q0-5-6-14z" fill="${blue}"/>`,
      star: `<path d="M160 36l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="${gold}" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/><circle cx="36" cy="46" r="5" fill="${gold}"/><circle cx="176" cy="96" r="4" fill="${green}"/>`,
      heart: `<path d="M158 150c-14-9-24-20-14-30 6-6 14-2 14 4 0-6 8-10 14-4 10 10 0 21-14 30z" fill="${red}" stroke="#ffffff" stroke-width="2.500" stroke-linejoin="round"/>`,
      scale: `<rect x="112" y="148" width="76" height="26" rx="12" fill="${white}"/><rect x="112" y="166" width="76" height="9" rx="4.500" fill="#cdd3dc"/><rect x="136" y="153" width="28" height="12" rx="5" fill="${green}"/><circle cx="150" cy="159" r="3" fill="#ffffff"/>`,
      pill: `<g transform="rotate(-35 150 150)"><rect x="124" y="138" width="52" height="24" rx="12" fill="${white}"/><path d="M150 138h14a12 12 0 010 24h-14z" fill="${red}"/><path d="M130 144h14" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/></g>`,
      cookie: `<circle cx="150" cy="148" r="22" fill="${peach}"/><path d="M132 140q8-4 12 2M154 134q6 4 4 10M140 160q8 4 14-2M162 154q4 4 2 8" fill="none" stroke="#8a5530" stroke-width="3.500" stroke-linecap="round"/><circle cx="144" cy="150" r="2.500" fill="#8a5530"/><circle cx="160" cy="144" r="2.500" fill="#8a5530"/><circle cx="156" cy="158" r="2.500" fill="#8a5530"/>${hand(150, 172, 10)}`,
      clock: `<circle cx="152" cy="148" r="24" fill="${white}"/><circle cx="152" cy="148" r="24" fill="none" stroke="${gold}" stroke-width="5"/><path d="M152 134v14l10 6" fill="none" stroke="#3f4b5c" stroke-width="3.500" stroke-linecap="round" stroke-linejoin="round"/>`,
      moon: `<path d="M168 30a22 22 0 1021 30 18 18 0 01-21-30z" fill="${gold}"/><circle cx="36" cy="40" r="3.500" fill="${gold}"/><circle cx="50" cy="26" r="2.500" fill="${gold}"/>`
    };
    return P[name] || '';
  }

  /* ---------- Bust ---------- */
  function bust(opts = {}) {
    const gender = opts.gender === 'male' ? 'male' : 'female';
    const male = gender === 'male';
    const k = kit();
    const gray = (opts.age >= 50) || opts.hair === 'gray';
    const hd = head(k, { gender, mood: opts.mood || 'smile', hair: gray ? HAIR.gray : null, age: opts.age, build: 1 });
    const skin = k.G(SKIN), skinD = k.G([SKIN[1], SKIN[2], SKIN[2]], 'v');
    const top = k.G(TOP[gender]);
    const topD = TOP[gender][2];
    const left = opts.propSide === 'left';
    const pr = opts.prop ? prop(opts.prop, k) : '';
    const nd = male ? 17 : 19, ny = male ? 168 : 176;
    const neckline = `M${100 - nd} 146Q100 ${ny} ${100 + nd} 146`;
    return `<svg class="av av--bust" viewBox="0 0 200 200" ${opts.label ? `role="img" aria-label="${opts.label}"` : 'aria-hidden="true"'} xmlns="http://www.w3.org/2000/svg">
      <defs>${k.defs.join('')}</defs>
      <ellipse cx="100" cy="196" rx="74" ry="7" fill="${k.shadow}"/>
      ${hd.back ? `<g transform="translate(100 82) scale(1.5)">${hd.back}</g>` : ''}
      <rect x="86" y="118" width="28" height="34" rx="11" fill="${skinD}"/>
      <path d="M86 143C70 146 40 150 28 168C21 178 20 190 20 200L180 200C180 190 179 178 172 168C160 150 130 146 114 143Z" fill="${top}"/>
      <path d="M40 176Q36 188 36 200" fill="none" stroke="${topD}" stroke-width="3" stroke-linecap="round" opacity=".14"/>
      <path d="${neckline}Z" fill="${skin}"/>
      <path d="${neckline}" fill="none" stroke="${topD}" stroke-width="3.500" stroke-linecap="round" opacity=".55"/>
      <ellipse cx="62" cy="170" rx="20" ry="9" transform="rotate(-24 62 170)" fill="${k.glow}" opacity=".35"/>
      <ellipse cx="100" cy="127" rx="14" ry="6" fill="#7a3d22" opacity=".3"/>
      <g transform="translate(100 82) scale(1.5)">${hd.front}</g>
      ${hd.locks ? `<g transform="translate(100 82) scale(1.5)">${hd.locks}</g>` : ''}
      ${pr ? `<g class="av-prop"${left ? ' transform="translate(200 0) scale(-1 1)"' : ''}>${pr}</g>` : ''}
    </svg>`;
  }

  const pair = () => `<div class="av-pair">${full({ gender: 'female', build: 1, label: 'آواتار سه‌بعدی خانم' })}${full({ gender: 'male', build: 1, label: 'آواتار سه‌بعدی آقا' })}</div>`;

  window.EEAvatar = { full, bust, pair };
})();
