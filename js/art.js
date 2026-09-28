// Visual language: thin geometric line symbols in the spirit of art deco and
// mid-century modern ornament. Everything is drawn with currentColor so
// colour is controlled by CSS tokens.

const svg = (body, { size = 24, vb = 24, fill = false } = {}) =>
  `<svg viewBox="0 0 ${vb} ${vb}" width="${size}" height="${size}" aria-hidden="true" fill="${fill ? 'currentColor' : 'none'}" stroke="${fill ? 'none' : 'currentColor'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

// One symbol per category.
const CATEGORY_PATHS = {
  mind: '<path d="M2.5 12c2.6-4.2 5.8-6.3 9.5-6.3s6.9 2.1 9.5 6.3c-2.6 4.2-5.8 6.3-9.5 6.3S5.1 16.2 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/>',
  body: '<path d="M12 19.5s-7.5-4.4-7.5-9.8A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.5 2.3c0 5.4-7.5 9.8-7.5 9.8Z"/>',
  sleep: '<path d="M15.5 4.2a8 8 0 1 0 4.3 12.4 6.8 6.8 0 0 1-4.3-12.4Z"/><path d="M19 4.5v3M17.5 6h3"/>',
  lungs: '<path d="M3 8c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M3 12.5c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M3 17c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0"/>',
  detox: '<path d="M12 3.5c3 4 5.5 7.1 5.5 10.1a5.5 5.5 0 0 1-11 0c0-3 2.5-6.1 5.5-10.1Z"/><path d="M9.5 14.5a2.6 2.6 0 0 0 2.4 2.4"/>',
  fertility: '<path d="M12 21V11M12 14c-3.6 0-6-2.3-6-5.6 3.6 0 6 2.3 6 5.6ZM12 11.2c0-3.3 2.4-5.6 6-5.6 0 3.3-2.4 5.6-6 5.6Z"/>',
};

export function categorySymbol(cat, size = 20) {
  return svg(CATEGORY_PATHS[cat] || CATEGORY_PATHS.mind, { size });
}

export const ICONS = {
  settings: svg('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'),
  book: svg('<path d="M4 5.5h5.5A2.5 2.5 0 0 1 12 8v11a2 2 0 0 0-2-2H4ZM20 5.5h-5.5A2.5 2.5 0 0 0 12 8v11a2 2 0 0 1 2-2h6Z"/>', { size: 22 }),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".6" fill="currentColor"/>', { size: 22 }),
  chevron: svg('<path d="M9.5 6l6 6-6 6"/>', { size: 16 }),
  close: svg('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>', { size: 18 }),
  star: svg('<path d="M12 2 13.3 10.7 22 12 13.3 13.3 12 22 10.7 13.3 2 12 10.7 10.7Z"/>', { size: 10, fill: true }),
  tabOverview: svg('<circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>'),
  tabMilestones: svg('<path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5"/><path d="M3.5 12a8.5 8.5 0 0 1 3.6-7" stroke-dasharray="1 2.6"/><path d="M8.5 12.2l2.3 2.3 4.7-4.8"/>'),
  tabTimeline: svg('<path d="M12 3v18"/><path d="M12 5.5l2 2-2 2-2-2Z" fill="currentColor"/><path d="M12 14.5l2 2-2 2-2-2Z"/><path d="M16 7.5h4.5M16 16.5h4.5"/>'),
};

// Deco sunburst: a ring of radial ticks that light up with overall recovery.
export const SUNBURST_TICKS = 72;

export function sunburst(pct, from = pct, size = 280) {
  const c = size / 2;
  const on = Math.round(pct * SUNBURST_TICKS);
  const start = Math.round(from * SUNBURST_TICKS);
  const ticks = Array.from({ length: SUNBURST_TICKS }, (_, i) => {
    const a = (i / SUNBURST_TICKS) * Math.PI * 2 - Math.PI / 2;
    const major = i % 6 === 0;
    const r1 = c - (major ? 26 : 18);
    const r2 = c - 4;
    const x1 = c + Math.cos(a) * r1, y1 = c + Math.sin(a) * r1;
    const x2 = c + Math.cos(a) * r2, y2 = c + Math.sin(a) * r2;
    const cls = `tick${major ? ' major' : ''}${i < start ? ' on' : ''}`;
    return `<line class="${cls}" data-i="${i}" x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"/>`;
  }).join('');
  return `<svg class="sunburst" viewBox="0 0 ${size} ${size}" data-on="${on}" data-from="${start}" aria-hidden="true">
    <circle class="sb-ring" cx="${c}" cy="${c}" r="${c - 34}"/>
    <circle class="sb-ring faint" cx="${c}" cy="${c}" r="${c - 40}"/>
    ${ticks}
  </svg>`;
}
