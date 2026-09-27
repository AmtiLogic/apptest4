// Hand-drawn SVG art: a Central Coast bluff above the Pacific.
// Ice plant, silver sage, rust buckwheat and dried coyote brush on a sandstone
// slope. As the streak grows the bare sand slides heal over with ice plant,
// sage replaces dried brush, ice plant blooms, and turkey vultures turn up.
// The sky follows the real time of day, with morning fog burning off.

export const PALETTE = {
  sand: '#dcbf85',
  sandLight: '#ead7ae',
  sandDark: '#c49a5c',
  ice: '#8faa45',
  iceLight: '#b8c45a',
  iceDark: '#62813a',
  iceRed: '#c0583a',
  sage: '#b7c6b9',
  sageLight: '#d3ddd2',
  rust: '#8a4a30',
  brush: '#8e8790',
  ocean: '#3d6e8c',
  oceanDeep: '#2c5570',
  bloomPink: '#d8508f',
  bloomGold: '#efc94c',
};
const P = PALETTE;

// [fromHour, skyTop, skyBottom, fogOpacity, nightTint]
const SKIES = [
  [0, '#16213a', '#2d3d5a', 0.08, 0.5],
  [5, '#8d93ab', '#e5c8b0', 0.55, 0.15],
  [7, '#b9c9d6', '#e8ecea', 0.7, 0],
  [10, '#5d8fd0', '#b9d0e8', 0.25, 0],
  [16.5, '#7e9fd0', '#f0d6b0', 0.15, 0],
  [18.5, '#6a6a94', '#e0a184', 0.3, 0.1],
  [20, '#2a3150', '#5f5a7c', 0.15, 0.35],
  [21.5, '#16213a', '#2d3d5a', 0.08, 0.5],
];

function skyFor(hour) {
  let s = SKIES[0];
  for (const x of SKIES) if (hour >= x[0]) s = x;
  return { top: s[1], bottom: s[2], fog: s[3], tint: s[4], night: s[4] >= 0.35 };
}

// Deterministic pseudo random so the scene doesn't jump between renders.
function rand(i) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// The bluff face runs from bottom-left up to the top-right.
const slopeY = (x) => 212 - x * 0.46;
function onBluff(i, minX = 70) {
  const x = minX + rand(i) * (400 - minX);
  const top = slopeY(x) + 14;
  const y = top + rand(i + 1000) * (228 - top);
  return [x, y];
}

// Silver sage: a soft mound built from many small leaf puffs.
function sageMound(x, y, s, i) {
  const puffs = Array.from({ length: 14 }, (_, k) => {
    const a = rand(i * 31 + k) * Math.PI;
    const r = rand(i * 17 + k) * 11 * s;
    const px = x + Math.cos(a) * r * 1.3;
    const py = y - Math.sin(a) * r * 0.7;
    return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(2.4 * s + rand(k + i) * 1.6 * s).toFixed(1)}" fill="${k % 3 ? P.sage : P.sageLight}"/>`;
  }).join('');
  return `<g>${puffs}</g>`;
}

function driedBrush(x, y, s, i) {
  const lines = Array.from({ length: 7 }, (_, k) => {
    const a = -Math.PI * (0.15 + 0.7 * rand(i * 7 + k));
    const l = (8 + rand(i + k) * 7) * s;
    return `M${x} ${y}l${(Math.cos(a) * l).toFixed(1)} ${(Math.sin(a) * l).toFixed(1)}`;
  }).join('');
  return `<path d="${lines}" stroke="${P.brush}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".9"/>`;
}

// Rust buckwheat: a low mound of dry flower heads.
function buckwheat(x, y, s, i) {
  return `<g>${Array.from({ length: 16 }, (_, k) => {
    const a = rand(i * 13 + k) * Math.PI;
    const r = rand(i * 7 + k) * 9 * s;
    return `<circle cx="${(x + Math.cos(a) * r * 1.2).toFixed(1)}" cy="${(y - Math.sin(a) * r * 0.6).toFixed(1)}" r="${(1.3 * s + rand(k) * 0.8).toFixed(1)}" fill="${k % 4 ? P.rust : '#a86a45'}"/>`;
  }).join('')}</g>`;
}

function vulture(i) {
  return `<g class="vulture v${i}"><path d="M-9 0 L-2 -3 L0 -1.5 L2 -3 L9 0 L2 -1 L0 1 L-2 -1Z" fill="#2a2522"/></g>`;
}

let sceneId = 0;

export function sceneSvg(days, hour) {
  const id = `sc${++sceneId}`;
  const sky = skyFor(hour);
  const heal = Math.min(1, days / 60); // sand slides fully grown over at ~2 months
  const sageCount = Math.round(3 + Math.min(1, days / 45) * 6);
  const brushCount = Math.round(8 - Math.min(1, days / 45) * 5);
  const blooms = days >= 7 ? Math.min(26, Math.floor((days - 5) * 0.9)) : 0;
  const vultures = days >= 14 ? Math.min(3, 1 + Math.floor((days - 14) / 21)) : 0;

  const stars = sky.night
    ? Array.from({ length: 30 }, (_, i) => [rand(i) * 380, rand(i + 50) * 110, i])
        .filter(([x, y]) => y < slopeY(x) - 6 && y < 140)
        .map(([x, y, i]) =>
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.5 + rand(i + 99)).toFixed(2)}" fill="#fff" opacity="${(0.4 + rand(i + 7) * 0.6).toFixed(2)}"/>`).join('')
    : '';
  const moon = sky.night ? `<circle cx="70" cy="40" r="10" fill="#efe9d2"/><circle cx="76" cy="36" r="8.5" fill="#26324d"/>` : '';

  // Ice plant texture: tiny leaf ticks in greens with the odd red tip.
  const leaves = Array.from({ length: 520 }, (_, i) => {
    const [x, y] = onBluff(i + 2000, 0);
    if (y < slopeY(x) + 4) return '';
    const r = rand(i + 5000);
    const c = r < 0.1 ? P.iceRed : r < 0.45 ? P.iceLight : r < 0.8 ? P.iceDark : '#a3b84f';
    const a = (rand(i + 7000) * 60 - 30).toFixed(0);
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="1.4" height="3.6" rx=".7" fill="${c}" transform="rotate(${a} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }).join('');

  // Bare sand slides running down the face. They narrow as ice plant grows back.
  const slides = [
    'M300 78 C270 110 220 150 150 196',
    'M360 64 C340 100 300 135 262 168',
    'M225 118 C205 140 180 160 120 205',
  ].map((d, i) => {
    const w = (i === 0 ? 11 : 7) * (1 - heal);
    if (w < 0.4) return '';
    return `<path d="${d}" stroke="${P.sand}" stroke-width="${w.toFixed(2)}" fill="none" stroke-linecap="round"/>
      <path d="${d}" stroke="${P.sandLight}" stroke-width="${(w * 0.35).toFixed(2)}" fill="none" stroke-linecap="round" opacity=".7"/>`;
  }).join('');

  const sages = Array.from({ length: sageCount }, (_, i) => {
    const [x, y] = onBluff(i * 3 + 11, 90);
    return sageMound(x, y, 1.1 + rand(i + 40) * 0.8, i);
  }).join('');
  const brushes = Array.from({ length: brushCount }, (_, i) => {
    const [x, y] = onBluff(i * 5 + 300, 80);
    return driedBrush(x, y, 0.8 + rand(i + 80) * 0.5, i);
  }).join('');
  const buckwheats = Array.from({ length: 6 }, (_, i) => {
    const [x, y] = onBluff(i * 7 + 600, 100);
    return buckwheat(x, y, 1.1 + rand(i + 90) * 0.6, i);
  }).join('');
  const bloomSvg = Array.from({ length: blooms }, (_, i) => {
    const [x, y] = onBluff(i * 13 + 900, 30);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.9" fill="${i % 3 === 0 ? P.bloomGold : P.bloomPink}"/>`;
  }).join('');

  return `
  <svg class="scene" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky.top}"/><stop offset="1" stop-color="${sky.bottom}"/></linearGradient>
      <linearGradient id="${id}sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.ocean}"/><stop offset="1" stop-color="${P.oceanDeep}"/></linearGradient>
      <linearGradient id="${id}face" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.iceLight}"/><stop offset=".55" stop-color="${P.ice}"/><stop offset="1" stop-color="${P.iceDark}"/></linearGradient>
      <filter id="${id}blur" x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <rect width="400" height="240" fill="url(#${id}sky)"/>
    <path d="M0 150 L200 150 L200 240 L0 240Z" fill="url(#${id}sea)"/>
    <g class="swell" stroke="#dbe8ee" stroke-width="1" stroke-linecap="round" opacity=".55">
      <path d="M8 170h26M60 182h34M20 198h40M110 166h22M86 206h30"/>
    </g>
    <path d="M0 214 C40 206 90 214 140 208 L140 240 L0 240Z" fill="${P.sandLight}"/>
    <path class="foam" d="M0 214 C40 206 90 214 140 208" stroke="#fff" stroke-width="2.2" fill="none" opacity=".8"/>
    ${vultures && !sky.night ? Array.from({ length: vultures }, (_, i) => vulture(i)).join('') : ''}
    <!-- bluff -->
    <path d="M0 212 L400 28 L400 240 L0 240Z" fill="url(#${id}face)"/>
    <path d="M150 145 C200 118 260 96 300 70 L330 50 C350 44 380 34 400 26 L400 22 C360 30 330 36 300 50 C270 62 230 84 180 110Z" fill="${P.sand}"/>
    <path d="M300 58 C320 50 350 42 400 32 L400 40 C360 48 330 56 305 66Z" fill="${P.sandDark}" opacity=".55"/>
    ${leaves}${slides}${brushes}${buckwheats}${sages}${bloomSvg}
    <path d="M0 212 L400 28" stroke="${P.iceDark}" stroke-width="1.2" opacity=".4"/>
    <!-- fog -->
    <g class="fog" fill="#fff" opacity="${sky.fog}" filter="url(#${id}blur)">
      <ellipse cx="80" cy="140" rx="140" ry="16"/><ellipse cx="260" cy="110" rx="170" ry="14"/><ellipse cx="160" cy="175" rx="190" ry="12" opacity=".6"/>
    </g>
    ${sky.tint ? `<rect width="400" height="240" fill="#0b1426" opacity="${sky.tint}"/>` : ''}
    ${stars}${moon}
  </svg>`;
}

export const ICONS = {
  gear: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.3 7.3 0 0 0-1.7-1L15 3.3h-4l-.4 2.6a7.3 7.3 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.3 7.3 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.3 7.3 0 0 0 1.7-1l2.5 1 2-3.5ZM13 15.5A3.5 3.5 0 1 1 13 8.5a3.5 3.5 0 0 1 0 7Z" transform="translate(-1 0)"/></svg>',
  book: '<svg viewBox="0 0 28 24" width="26" height="22" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" d="M2 4.5c3-1.3 6.5-1.3 10 .6V21c-3.5-1.8-7-1.8-10-.6ZM14 5.1c3.5-1.9 7-1.9 10-.6v15.9c-3-1.2-6.5-1.2-10 .6Z"/><path stroke="currentColor" stroke-width="1.3" d="M16.5 9h5M16.5 12h5M16.5 15h5"/></svg>',
  info: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7.5" r="1.3" fill="currentColor"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#6e9a3c"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  tabOverview: '<svg viewBox="0 0 28 24" width="28" height="24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20 L26 5"/><path d="M2 20h24V5"/><path d="M9 13.5c2 .5 3 2 3 3.5M15 10c2 .5 3 2 3 3.5"/></g></svg>',
  tabMilestones: '<svg viewBox="0 0 28 24" width="28" height="24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21c4-2 6-6 9-9s6-4 11-8"/><circle cx="8" cy="18" r="1.6" fill="currentColor"/><circle cx="14" cy="11.5" r="1.6" fill="currentColor"/><path d="M22 3v6M22 3l4 1.5-4 1.5"/></g></svg>',
  tabRecovery: '<svg viewBox="0 0 28 24" width="28" height="24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="12" r="9"/><path d="M14 3a9 9 0 0 1 8.2 12.7"/><path d="M14 17v-6M14 11c0-2 1.5-3.5 4-3.5 0 2.5-1.5 4-4 3.5ZM14 13c0-1.6-1.2-2.8-3.2-2.8 0 2 1.2 3.2 3.2 2.8Z"/></g></svg>',
};

// Illustrations for the four stat tiles, drawn in the bluff palette.
export const TILE_ART = {
  joints: `<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M14 64 L56 20 L64 28 L22 72Z" fill="#f4ead6" stroke="${P.sandDark}" stroke-width="1.2"/><path d="M14 64 L22 72 L18 76 L10 68Z" fill="${P.sandDark}"/><path d="M56 20 L64 28 L68 16Z" fill="#ece0c4"/><path d="M60 22 q6-8 2-14 q-3 5 -8 6" fill="none" stroke="${P.brush}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/><path d="M8 34 L34 8" stroke="${P.iceRed}" stroke-width="4" stroke-linecap="round"/></svg>`,
  grams: `<svg viewBox="0 0 80 80" aria-hidden="true"><g><ellipse cx="30" cy="50" rx="15" ry="13" fill="${P.iceDark}"/><ellipse cx="51" cy="52" rx="14" ry="12" fill="${P.ice}"/><ellipse cx="41" cy="33" rx="13" ry="12" fill="${P.iceLight}"/></g><g stroke="${P.iceRed}" stroke-width="1.5" stroke-linecap="round"><path d="M25 46l3 3M34 52l2 2M47 49l3 2M55 56l2 2M38 30l2 3M45 35l2 2"/></g></svg>`,
  thc: `<svg viewBox="0 0 90 80" aria-hidden="true"><g fill="${P.sageLight}" stroke="${P.ocean}" stroke-width="2.2"><path d="M22 14l10 6v11l-10 6-10-6V20Z"/><path d="M36 36l10 6v11l-10 6-10-6V42Z"/><path d="M58 36l10 6v11l-10 6-10-6V42Z"/></g><g font-family="Fraunces,Georgia,serif" font-weight="700" font-size="11" fill="${P.oceanDeep}" text-anchor="middle"><text x="22" y="30">T</text><text x="36" y="52">H</text><text x="58" y="52">C</text></g><path d="M68 50l5 4 5-4 5 4" fill="none" stroke="${P.ocean}" stroke-width="2.2"/><path d="M14 72 L76 12" stroke="${P.iceRed}" stroke-width="3.5" stroke-linecap="round" opacity=".85"/></svg>`,
  money: `<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M16 60 C16 44 24 34 40 34 C56 34 64 44 64 60 C64 70 56 74 40 74 C24 74 16 70 16 60Z" fill="${P.sand}" stroke="${P.sandDark}" stroke-width="1.8"/><path d="M30 34 C30 26 34 22 40 22 C46 22 50 26 50 34" fill="none" stroke="${P.sandDark}" stroke-width="1.8"/><path d="M28 22 q12 -8 24 0" fill="none" stroke="${P.rust}" stroke-width="3" stroke-linecap="round"/><text x="40" y="63" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-weight="700" font-size="20" fill="${P.rust}">$</text><circle cx="62" cy="20" r="8" fill="${P.bloomGold}" stroke="#c9a23a" stroke-width="1.5"/></svg>`,
};

// Progress colour: stressed ice plant (rust) → recovering (gold) → healthy (green).
export function progressColor(pct) {
  const stops = [[0, [192, 88, 58]], [0.5, [201, 170, 70]], [1, [100, 145, 58]]];
  let a = stops[0], b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (pct >= stops[i][0] && pct <= stops[i + 1][0]) { a = stops[i]; b = stops[i + 1]; break; }
  }
  const t = (pct - a[0]) / (b[0] - a[0] || 1);
  const c = a[1].map((v, i) => Math.round(v + (b[1][i] - v) * t));
  return `rgb(${c.join(',')})`;
}
