// Hand-drawn SVG art. The landscape slowly grows with your streak and
// follows the real time of day.

const SKIES = [
  // [fromHour, top, bottom, isNight]
  [0, '#0d1633', '#27335c', true],
  [5, '#f6a96b', '#fbe0a6', false],
  [7, '#8fd3f4', '#c9ecfb', false],
  [17, '#f39a6b', '#fdd9a0', false],
  [19.5, '#2b2d5c', '#6b5a8e', true],
  [21, '#0d1633', '#27335c', true],
];

function skyFor(hour) {
  let s = SKIES[0];
  for (const x of SKIES) if (hour >= x[0]) s = x;
  return { top: s[1], bottom: s[2], night: s[3] };
}

// Deterministic pseudo random so the scene doesn't jump between renders.
function rand(i) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function sceneSvg(days, hour) {
  const sky = skyFor(hour);
  const grow = Math.min(1, 0.25 + days / 40); // tree: sapling → full at ~30 days
  const flowers = Math.min(14, Math.floor(days / 2));
  const birds = days >= 14 ? Math.min(4, 1 + Math.floor((days - 14) / 14)) : 0;
  // Sun/moon arc across the sky
  const dayT = Math.max(0, Math.min(1, (hour - 6) / 12));
  const nightT = ((hour + 24 - 19) % 24) / 11;
  const t = sky.night ? nightT : dayT;
  const cx = 60 + t * 280;
  const cy = 120 - Math.sin(t * Math.PI) * 85;

  const stars = sky.night
    ? Array.from({ length: 26 }, (_, i) =>
        `<circle cx="${(rand(i) * 400).toFixed(1)}" cy="${(rand(i + 50) * 110).toFixed(1)}" r="${(0.6 + rand(i + 99) * 1.1).toFixed(2)}" fill="#fff" opacity="${(0.4 + rand(i + 7) * 0.6).toFixed(2)}"><animate attributeName="opacity" values="1;.3;1" dur="${(2 + rand(i) * 4).toFixed(1)}s" repeatCount="indefinite"/></circle>`).join('')
    : '';

  const body = sky.night
    ? `<circle cx="${cx}" cy="${cy}" r="20" fill="#f4f1d6"/><circle cx="${cx + 8}" cy="${cy - 5}" r="17" fill="${sky.top}" opacity=".9"/>`
    : `<circle cx="${cx}" cy="${cy}" r="46" fill="#fff38a" opacity=".25"/><circle cx="${cx}" cy="${cy}" r="34" fill="#ffec45"/>`;

  const clouds = `
    <g class="cloud c1" opacity="${sky.night ? 0.25 : 0.95}"><ellipse cx="80" cy="70" rx="46" ry="12" fill="#fff"/><ellipse cx="72" cy="61" rx="22" ry="13" fill="#fff"/></g>
    <g class="cloud c2" opacity="${sky.night ? 0.2 : 0.9}"><ellipse cx="320" cy="50" rx="34" ry="9" fill="#fff"/><ellipse cx="312" cy="43" rx="16" ry="10" fill="#fff"/></g>`;

  // Tree on the left hill
  const tx = 92, ty = 158;
  const th = 40 * grow;
  const tree = `
    <g>
      <rect x="${tx - 2.5 * grow}" y="${ty - th}" width="${5 * grow}" height="${th}" rx="2" fill="#5b4326"/>
      <circle cx="${tx}" cy="${ty - th - 6 * grow}" r="${16 * grow}" fill="#4f7a2e"/>
      <circle cx="${tx - 11 * grow}" cy="${ty - th + 4 * grow}" r="${11 * grow}" fill="#5d8a34"/>
      <circle cx="${tx + 11 * grow}" cy="${ty - th + 3 * grow}" r="${12 * grow}" fill="#56823a"/>
    </g>`;

  const flowerColors = ['#ff8fb1', '#ffd166', '#fff', '#c3a6ff'];
  const flowerSvg = Array.from({ length: flowers }, (_, i) => {
    const x = 20 + rand(i + 300) * 210;
    const y = 162 + rand(i + 400) * 18 - x * 0.05;
    return `<g><line x1="${x}" y1="${y}" x2="${x}" y2="${y + 5}" stroke="#4f7a2e" stroke-width="1"/><circle cx="${x}" cy="${y}" r="2.2" fill="${flowerColors[i % 4]}"/></g>`;
  }).join('');

  const birdSvg = Array.from({ length: birds }, (_, i) =>
    `<path class="bird b${i}" d="M${230 + i * 22} ${60 + (i % 2) * 12} q5 -5 10 0 q5 -5 10 0" fill="none" stroke="${sky.night ? '#9aa' : '#333'}" stroke-width="1.6" stroke-linecap="round"/>`).join('');

  return `
  <svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky.top}"/><stop offset="1" stop-color="${sky.bottom}"/></linearGradient>
      <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky.night ? '#1d3d6b' : '#1aa3e8'}"/><stop offset="1" stop-color="${sky.night ? '#132a4a' : '#1686c4'}"/></linearGradient>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e2c25" stop-opacity="0"/><stop offset="1" stop-color="#2e2c25"/></linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#sky)"/>
    ${stars}${body}${clouds}${birdSvg}
    <path d="M0 150 L120 95 L200 140 L290 90 L400 140 L400 200 L0 200Z" fill="${sky.night ? '#4d4a22' : '#9a9432'}"/>
    <path d="M0 165 C60 150 150 150 240 172 L0 200Z" fill="${sky.night ? '#3e5a22' : '#7a9a3a'}"/>
    ${tree}${flowerSvg}
    <path d="M200 178 C260 165 330 160 400 160 L400 300 L0 300 L0 186 C60 176 140 186 200 178Z" fill="url(#lake)"/>
    <g class="boat"><path d="M0 0 L18 0 L14 5 L4 5Z" fill="#3a3a3a"/><path d="M9 -1 L9 -20 L17 -3Z" fill="#3a3a3a"/></g>
    <rect y="165" width="400" height="135" fill="url(#fade)"/>
  </svg>`;
}

export const ICONS = {
  gear: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.3 7.3 0 0 0-1.7-1L15 3.3h-4l-.4 2.6a7.3 7.3 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.3 7.3 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.3 7.3 0 0 0 1.7-1l2.5 1 2-3.5ZM13 15.5A3.5 3.5 0 1 1 13 8.5a3.5 3.5 0 0 1 0 7Z" transform="translate(-1 0)"/></svg>',
  book: '<svg viewBox="0 0 28 24" width="30" height="26" aria-hidden="true"><path fill="currentColor" d="M2 4c3-1.3 6.5-1.3 10 .6V21c-3.5-1.8-7-1.8-10-.6ZM14 4.6c3.5-1.9 7-1.9 10-.6v16.4c-3-1.2-6.5-1.2-10 .6Z" opacity=".9"/><path stroke="#15140f" stroke-width="1.3" d="M16.5 8.5h5M16.5 11.5h5M16.5 14.5h5"/></svg>',
  info: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="7.5" r="1.4" fill="currentColor"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#fff"/><circle cx="12" cy="12" r="9.5" fill="#3cc25a"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  tabOverview: '<svg viewBox="0 0 28 24" width="30" height="26" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 11a6 6 0 0 1 12 0"/><path d="M14 2v2M6.5 5l1.4 1.4M21.5 5l-1.4 1.4M3.5 11h2M22.5 11h2"/><rect x="4" y="14" width="9" height="7" rx="1.5"/><rect x="15" y="14" width="9" height="7" rx="1.5"/></g></svg>',
  tabMilestones: '<svg viewBox="0 0 28 24" width="30" height="26" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M9 3h10v5a5 5 0 0 1-10 0Z"/><path d="M9 5H5.5a3 3 0 0 0 3.8 4.7M19 5h3.5a3 3 0 0 1-3.8 4.7"/><path d="M14 13v4M10 21h8l-1-4h-6Z"/></g></svg>',
  tabRecovery: '<svg viewBox="0 0 28 24" width="30" height="26" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="3.5" r="1.8"/><path d="M11 6v6l-2.5 4v5M11 12l2.5 3.5V21M8 8.5l-2 3M11 8l3 2.5"/><rect x="16.5" y="15" width="3" height="6"/><rect x="20" y="11" width="3" height="10"/><rect x="23.5" y="7" width="3" height="14"/></g></svg>',
};

// Illustrations for the four stat tiles.
export const TILE_ART = {
  joints: `<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M14 66 L58 18 L66 26 L22 70Z" fill="#f2e7cf"/><path d="M14 66 L22 70 L18 74 L10 70Z" fill="#8a5a2b"/><path d="M58 18 L66 26 L70 16Z" fill="#e8d9b5"/><circle cx="26" cy="26" r="13" fill="#f59e2b"/><path d="M26 17 l2.5 6 5-3-3 5.5 5 1.5-6 1 1 5-4.5-4-4.5 4 1-5-6-1 5-1.5-3-5.5 5 3Z" fill="#4c6a1a"/></svg>`,
  grams: `<svg viewBox="0 0 80 80" aria-hidden="true"><g fill="#8fa33a" stroke="#5d6e1c" stroke-width="2"><circle cx="30" cy="48" r="15"/><circle cx="52" cy="50" r="14"/><circle cx="42" cy="30" r="14"/></g><g fill="none" stroke="#5d6e1c" stroke-width="1.6" stroke-linecap="round"><path d="M25 45q4 3 8 0M47 48q4 3 8 0M37 27q4 3 8 0"/></g></svg>`,
  thc: `<svg viewBox="0 0 90 80" aria-hidden="true"><g fill="#8a8a2a" stroke="#5a5a18" stroke-width="2.5"><path d="M20 12l10 6v11l-10 6-10-6V18Z"/><path d="M34 34l10 6v11l-10 6-10-6V40Z"/><path d="M56 34l10 6v11l-10 6-10-6V40Z"/></g><g font-family="Poppins,system-ui" font-weight="700" font-size="11" fill="#f2efdc" text-anchor="middle"><text x="20" y="28">T</text><text x="34" y="50">H</text><text x="56" y="50">C</text></g><path d="M66 48l5 4 5-4 5 4 5-4" fill="none" stroke="#8a8a2a" stroke-width="2.5"/><path d="M14 56h10" stroke="#8a8a2a" stroke-width="2.5"/></svg>`,
  money: `<svg viewBox="0 0 80 80" aria-hidden="true"><g transform="rotate(-18 40 40)"><rect x="12" y="16" width="36" height="52" rx="3" fill="#2fb36b"/><rect x="17" y="21" width="26" height="42" rx="2" fill="#a6e6b8"/></g><g transform="rotate(10 40 40)"><rect x="28" y="12" width="34" height="50" rx="3" fill="#2fb36b"/><rect x="33" y="17" width="24" height="40" rx="2" fill="#a6e6b8"/></g><g><rect x="28" y="52" width="22" height="5" rx="2" fill="#f5b52e"/><rect x="28" y="58" width="22" height="5" rx="2" fill="#f5b52e"/><rect x="28" y="64" width="22" height="5" rx="2" fill="#f5b52e"/><circle cx="56" cy="60" r="13" fill="#f5b52e" stroke="#e39a12" stroke-width="2"/><text x="56" y="65" text-anchor="middle" font-family="Poppins,system-ui" font-weight="700" font-size="14" fill="#c77b00">$</text></g></svg>`,
};
