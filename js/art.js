// Visual language: the Central Coast bluff palette as flat colour, plus a
// few simple line symbols. No illustrations.

// Ocean, sage, ice plant, ice-plant red, sand, from sea to bluff top.
export const PALETTE = ['#3d6e8c', '#b7c6b9', '#8faa45', '#c0583a', '#dcbf85'];

// A band of palette colours. The ice plant band widens as the streak grows
// (full at ~60 days), a quiet nod to bare ground growing back.
export function paletteBand(days = 0) {
  const grow = Math.min(1, days / 60);
  const w = [14, 14, 22 + grow * 30, 10, 14 - grow * 6];
  return `<div class="band" aria-hidden="true">${PALETTE.map((c, i) => `<span style="flex:${w[i].toFixed(2)};background:${c}"></span>`).join('')}</div>`;
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
