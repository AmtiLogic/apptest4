import { SOURCES, SOURCE_BY_KEY, CATEGORIES, sourceUrl } from './data.js';
import {
  DAY, HOUR, elapsedMs, splitDuration, stats, allSymptoms, overallRecovery,
  allMilestones, groupFor, phaseMessage, humanizeMs, snapshot, diffSnapshots, intensityAt,
} from './logic.js';
import { sceneSvg, ICONS, TILE_ART } from './art.js';

const KEY = 'clearing.v1';
const RETURN_GAP = 20 * 60 * 1000; // a "new visit" after 20 min away

const $ = (sel, el = document) => el.querySelector(sel);
const app = $('#app');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- persistence ----------

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
}

let state = load();
let visit = null; // { prev: snapshot|null, diff, dismissed }
let animated = new Set();
let tickTimer = null;

// ---------- formatting ----------

const dateFmt = new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
const dateTimeFmt = new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const shortDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
const num = (n, d = 0) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

function fmtGrams(g) {
  if (g >= 1000) return `${num(g / 1000, 2)} kg`;
  return `${num(g, g < 100 ? 1 : 0)} g`;
}
function fmtThc(mg) {
  if (mg >= 10000) return `${num(mg / 1000, 1)} g`;
  return `${num(Math.round(mg))} mg`;
}
function fmtMoney(v, currency) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: v >= 1000 ? 0 : 2, minimumFractionDigits: v >= 1000 ? 0 : 2 }).format(v);
  } catch {
    return `${num(v, 2)} ${currency}`;
  }
}
function toLocalInput(ms) {
  const d = new Date(ms);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(ms - off).toISOString().slice(0, 16);
}

// ---------- shared components ----------

function ring(pct, { size = 64, stroke = 7, from = null, label = true, cls = '' } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const start = from ?? pct;
  const shown = Math.round(pct * 100);
  const doneCls = pct >= 1 ? ' done' : '';
  return `<div class="ring ${cls}${doneCls}" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle class="ring-bg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"/>
      <circle class="ring-fg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"
        stroke-dasharray="${c.toFixed(2)}" style="stroke-dashoffset:${(c * (1 - start)).toFixed(2)}"
        data-to="${(c * (1 - pct)).toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    </svg>
    ${label ? `<span class="ring-num" data-from="${Math.round(start * 100)}" data-to="${shown}">${Math.round(start * 100)}</span>` : ''}
  </div>`;
}

function animateRings(root = app) {
  const fgs = root.querySelectorAll('.ring-fg[data-to]');
  if (!fgs.length) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    fgs.forEach((el) => { el.style.strokeDashoffset = el.dataset.to; });
    root.querySelectorAll('.ring-num').forEach((el) => {
      const a = +el.dataset.from, b = +el.dataset.to;
      if (a === b) return;
      const t0 = performance.now(), dur = 1400;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(a + (b - a) * e);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }));
}

function chip(cat) {
  const c = CATEGORIES[cat];
  return `<span class="chip chip-${cat}"><span class="chip-ic">${c.icon}</span>${c.label}</span>`;
}

function sourceRefs(keys) {
  if (!keys?.length) return '';
  return keys.map((k) => `<button class="ref" data-source="${k}">[${SOURCE_BY_KEY[k].n}]</button>`).join('');
}

function sourceList(keys) {
  if (!keys?.length) return '';
  return `<h3 class="sheet-h3">Sources</h3><ol class="sources compact">${keys.map((k) => sourceItem(SOURCE_BY_KEY[k])).join('')}</ol>`;
}

function sourceItem(s) {
  return `<li class="source" id="src-${s.key}">
    <a href="${sourceUrl(s)}" target="_blank" rel="noopener">
      <span class="src-n">[${s.n}]</span>
      <span class="src-body">
        <span class="src-title">${esc(s.title)}</span>
        <span class="src-journal">${esc(s.journal)}</span>
        <span class="src-meta"><span>${esc(s.authors)}</span><b>${s.year}</b></span>
      </span>
    </a></li>`;
}

// ---------- sheets ----------

function openSheet(html, { onMount } = {}) {
  closeSheet(true);
  const wrap = document.createElement('div');
  wrap.className = 'sheet-wrap';
  wrap.innerHTML = `<div class="sheet-backdrop" data-close></div>
    <div class="sheet" role="dialog" aria-modal="true"><div class="sheet-handle" data-drag></div><div class="sheet-scroll">${html}</div></div>`;
  document.body.appendChild(wrap);
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => wrap.classList.add('open'));
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeSheet();
    handleCommon(e);
  });
  enableDrag(wrap);
  onMount?.(wrap);
  animateRings(wrap);
}

function closeSheet(immediate = false) {
  const wrap = $('.sheet-wrap');
  if (!wrap) return;
  document.body.classList.remove('no-scroll');
  if (immediate) { wrap.remove(); return; }
  wrap.classList.remove('open');
  setTimeout(() => wrap.remove(), 280);
}

function enableDrag(wrap) {
  const sheet = $('.sheet', wrap);
  const scroller = $('.sheet-scroll', wrap);
  let y0 = null, dy = 0;
  sheet.addEventListener('touchstart', (e) => {
    if (scroller.scrollTop > 0 && !e.target.closest('[data-drag]')) return;
    y0 = e.touches[0].clientY; dy = 0;
  }, { passive: true });
  sheet.addEventListener('touchmove', (e) => {
    if (y0 == null) return;
    dy = Math.max(0, e.touches[0].clientY - y0);
    if (dy > 0) sheet.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  sheet.addEventListener('touchend', () => {
    if (y0 == null) return;
    sheet.style.transform = '';
    if (dy > 110) closeSheet();
    y0 = null;
  });
}

function openSources(focusKey) {
  openSheet(`
    <div class="sheet-head"><h2>Sources</h2><button class="icon-btn" data-sheet="science" aria-label="About the science">${ICONS.info}</button></div>
    <ol class="sources">${SOURCES.map(sourceItem).join('')}</ol>`, {
    onMount: (w) => {
      if (!focusKey) return;
      const el = $(`#src-${focusKey}`, w);
      if (el) { el.classList.add('flash'); setTimeout(() => el.scrollIntoView({ block: 'center' }), 50); }
    },
  });
}

function openScience() {
  openSheet(`
    <div class="sheet-head"><h2>About the science</h2></div>
    <div class="prose">
      <p>Every timeline in Clearing comes from peer-reviewed research on cannabis withdrawal and recovery. The core pattern is well established: withdrawal usually starts 1–3 days after the last use, peaks between days 2 and 6, and most symptoms are gone within 1–2 weeks. Sleep problems and vivid dreams can take a month or more.</p>
      <p>About half of regular users experience withdrawal. You may not get every symptom, and heavier use usually means a longer, stronger course. The rings show your progress through the <em>typical</em> window, not a measurement of you.</p>
      <p>Clearing is not medical advice. If you feel very unwell, very low, or have thoughts of harming yourself, please contact a doctor or local emergency services.</p>
      <p class="muted">Tap any source to look it up on PubMed.</p>
    </div>`);
}

// ---------- onboarding ----------

function onboardingView(existing) {
  const s = existing || { quitAt: Date.now(), unit: 'grams', amount: 1, gramsPerJoint: 0.5, pricePerGram: 10, currency: guessCurrency(), thcPct: 18 };
  const currencies = ['USD', 'EUR', 'GBP', 'SEK', 'NOK', 'DKK', 'CAD', 'AUD', 'NZD', 'CHF', 'JPY'];
  if (!currencies.includes(s.currency)) currencies.unshift(s.currency);
  return `
  <form class="setup" id="setup">
    ${existing ? '' : `<div class="setup-hero">${sceneSvg(0, new Date().getHours() + new Date().getMinutes() / 60)}<div class="setup-title"><h1>Clearing</h1><p>Watch the fog lift, one day at a time.</p></div></div>`}
    <label class="field"><span>When was your last use?</span>
      <input type="datetime-local" name="quitAt" value="${toLocalInput(s.quitAt)}" max="${toLocalInput(Date.now())}" required></label>
    <div class="field"><span>How much did you use on a typical day?</span>
      <div class="row">
        <input type="number" name="amount" inputmode="decimal" step="any" min="0" value="${s.amount}" required>
        <div class="seg" role="radiogroup">
          <label><input type="radio" name="unit" value="grams" ${s.unit === 'grams' ? 'checked' : ''}><span>grams</span></label>
          <label><input type="radio" name="unit" value="joints" ${s.unit === 'joints' ? 'checked' : ''}><span>joints</span></label>
        </div>
      </div>
    </div>
    <label class="field"><span>Grams per joint</span>
      <input type="number" name="gramsPerJoint" inputmode="decimal" step="any" min="0.05" value="${s.gramsPerJoint}" required></label>
    <div class="field"><span>Price per gram</span>
      <div class="row">
        <input type="number" name="pricePerGram" inputmode="decimal" step="any" min="0" value="${s.pricePerGram}" required>
        <select name="currency">${currencies.map((c) => `<option ${c === s.currency ? 'selected' : ''}>${c}</option>`).join('')}</select>
      </div>
    </div>
    <label class="field"><span>THC content, % <small>(not sure? 15–20 is typical)</small></span>
      <input type="number" name="thcPct" inputmode="decimal" step="any" min="0" max="100" value="${s.thcPct}" required></label>
    <p class="fine">Everything stays on this device. No account, no tracking, no notifications.</p>
    <button class="btn primary" type="submit">${existing ? 'Save' : 'Start my journey'}</button>
  </form>`;
}

function guessCurrency() {
  const map = { SE: 'SEK', NO: 'NOK', DK: 'DKK', GB: 'GBP', CA: 'CAD', AU: 'AUD', NZ: 'NZD', CH: 'CHF', JP: 'JPY', US: 'USD' };
  const region = (navigator.language || 'en-US').split('-')[1];
  if (map[region]) return map[region];
  if (['DE', 'FR', 'NL', 'ES', 'IT', 'FI', 'AT', 'BE', 'IE', 'PT'].includes(region)) return 'EUR';
  return 'USD';
}

function readSetup(form) {
  const f = new FormData(form);
  const quitAt = Math.min(Date.now(), new Date(f.get('quitAt')).getTime() || Date.now());
  return {
    quitAt,
    unit: f.get('unit'),
    amount: Math.max(0, +f.get('amount') || 0),
    gramsPerJoint: Math.max(0.05, +f.get('gramsPerJoint') || 0.5),
    pricePerGram: Math.max(0, +f.get('pricePerGram') || 0),
    currency: f.get('currency'),
    thcPct: Math.min(100, Math.max(0, +f.get('thcPct') || 0)),
  };
}

// ---------- views ----------

function now() { return Date.now(); }
function ms() { return elapsedMs(state.settings.quitAt, now()); }
function days() { return ms() / DAY; }

function fromFor(tab) {
  // Animate rings from where the user last saw them, once per visit per tab.
  if (animated.has(tab) || !visit?.prev) return null;
  return visit.prev;
}

function overviewView() {
  const m = ms(), d = m / DAY, st = state.settings;
  const prev = fromFor('overview');
  const overall = overallRecovery(d);
  const syms = allSymptoms(d);
  const resolved = syms.filter((s) => s.pct >= 1).length;
  const next = syms.filter((s) => s.pct < 1).sort((a, b) => a.daysLeft - b.daysLeft)[0];
  const h = new Date();
  return `
  <header class="top"><h1>My Journey</h1><button class="icon-btn" data-sheet="settings" aria-label="Settings">${ICONS.gear}</button></header>
  <section class="hero">
    ${sceneSvg(d, h.getHours() + h.getMinutes() / 60)}
    <div class="hero-text">
      <div class="counter" id="counter">${counterHtml(m)}</div>
      <div class="since">since <em>${esc(dateTimeFmt.format(st.quitAt))}</em></div>
    </div>
  </section>
  <p class="phase">${esc(phaseMessage(d))}</p>
  ${sinceLastVisitHtml()}
  <button class="card recovery-card" data-go="recovery">
    ${ring(overall, { size: 92, stroke: 9, from: prev?.overall })}
    <div class="rc-text">
      <h2>Withdrawal recovery</h2>
      <p>${resolved} of ${syms.length} symptoms behind you</p>
      ${next ? `<p class="muted">Next: ${esc(next.name)} fades in ~${humanizeMs(next.daysLeft * DAY)}</p>` : '<p class="muted">Withdrawal is complete. 🎉</p>'}
    </div>
    <span class="chev">${ICONS.chevron}</span>
  </button>
  <div class="tiles" id="tiles">${tilesHtml(m)}</div>
  ${state.history?.attempts ? `<p class="fine center">Best streak ${humanizeMs(Math.max(state.history.bestMs, m))} · attempt ${state.history.attempts + 1}</p>` : ''}`;
}

function counterHtml(m) {
  const t = splitDuration(m);
  const cell = (v, l, pad) => `<div><b>${pad ? String(v).padStart(2, '0') : v}</b><span>${l}</span></div>`;
  return cell(t.days, t.days === 1 ? 'Day' : 'Days') + cell(t.hours, 'Hours', true) + cell(t.minutes, 'Min', true) + cell(t.seconds, 'Sec', true);
}

function tilesHtml(m) {
  const s = stats(state.settings, m);
  const tile = (art, val, label) => `<div class="tile"><div class="tile-art">${art}</div><b>${val}</b><span>${label}</span></div>`;
  return tile(TILE_ART.joints, num(s.joints), 'Joints not smoked')
    + tile(TILE_ART.grams, fmtGrams(s.grams), 'Weed avoided')
    + tile(TILE_ART.thc, fmtThc(s.thcMg), 'THC avoided')
    + tile(TILE_ART.money, fmtMoney(s.money, state.settings.currency), 'Money saved');
}

function sinceLastVisitHtml() {
  const diff = visit?.diff;
  if (!diff || visit.dismissed) return '';
  const gained = Math.round(diff.overallTo * 100) - Math.round(diff.overallFrom * 100);
  if (gained <= 0 && !diff.newMilestones.length && !diff.newlyResolved.length) return '';
  const ms = allMilestones(0);
  const syms = allSymptoms(0);
  const lines = [];
  if (gained > 0) lines.push(`<li><span class="dot"></span><span>Withdrawal recovery <b>${Math.round(diff.overallFrom * 100)}% → ${Math.round(diff.overallTo * 100)}%</b></span></li>`);
  diff.newlyResolved.forEach((id) => {
    const s = syms.find((x) => x.id === id);
    lines.push(`<li><span class="dot"></span><span>${s.emoji} <b>${esc(s.name)}</b> is behind you</span></li>`);
  });
  diff.newMilestones.slice(0, 4).forEach((id) => {
    const m = ms.find((x) => x.id === id);
    lines.push(`<li><span class="dot"></span><span>${m.emoji} Reached <b>${esc(m.title)}</b></span></li>`);
  });
  if (diff.newMilestones.length > 4) lines.push(`<li><span class="dot"></span><span>+${diff.newMilestones.length - 4} more milestones</span></li>`);
  return `<section class="card since-card">
    <div class="since-head"><h2>Since your last visit</h2><button class="icon-btn small" data-dismiss-visit aria-label="Dismiss">${ICONS.close}</button></div>
    <ul>${lines.join('')}</ul></section>`;
}

function milestonesView() {
  const m = ms();
  const list = allMilestones(m);
  const done = list.filter((x) => x.done).length;
  const prev = fromFor('milestones');
  let html = '', lastGroup = null, todayShown = false;
  for (const x of list) {
    if (!x.done && !todayShown) {
      html += `<div class="sep today" id="today"><span>Today</span></div>`;
      todayShown = true;
      lastGroup = null;
    }
    const g = groupFor(x.at);
    if (g !== lastGroup) html += `<div class="sep"><span>${g.label}</span></div>`;
    lastGroup = g;
    const reachedAt = state.settings.quitAt + x.at * HOUR;
    if (x.done) {
      const isNew = visit?.diff?.newMilestones.includes(x.id) ? ' new' : '';
      html += `<button class="card tl done${isNew}" data-milestone="${x.id}">
        <span class="tl-ic">${x.emoji}</span>
        <span class="tl-body"><span class="tl-title">${esc(x.title)}</span>
          <span class="tl-chips">${chip(x.cat)}<span class="chip date">${ICONS.check}${esc(dateFmt.format(reachedAt))}</span></span></span>
        <span class="chev">${ICONS.chevron}</span></button>`;
    } else {
      const from = prev ? Math.min(x.pct, prev.ms / (x.at * HOUR)) : null;
      html += `<button class="card tl todo" data-milestone="${x.id}">
        <span class="tl-ic dim">${x.emoji}</span>
        <span class="tl-body"><span class="tl-title">${esc(x.title)}</span>
          <span class="tl-chips">${chip(x.cat)}<span class="tl-when">in ${humanizeMs(x.msLeft)}</span></span></span>
        ${ring(x.pct, { size: 58, stroke: 6, from })}
        <span class="chev">${ICONS.chevron}</span></button>`;
    }
  }
  return `
  <header class="top"><h1>Health Timeline</h1>
    <button class="counter-btn" data-sheet="sources" aria-label="Sources">${ICONS.book}<span>${done}/${list.length}</span></button></header>
  <div class="timeline">${html}</div>
  <p class="fine center">Timelines are typical averages from research. Tap a milestone for details and sources.</p>`;
}

function recoveryView() {
  const d = days();
  const prev = fromFor('recovery');
  const syms = allSymptoms(d);
  const active = syms.filter((s) => s.pct < 1).sort((a, b) => b.pct - a.pct);
  const gone = syms.filter((s) => s.pct >= 1).sort((a, b) => b.resolve - a.resolve);
  const card = (s) => {
    if (s.pct >= 1) {
      return `<button class="card sym done" data-symptom="${s.id}">
        <span class="tl-ic">${s.emoji}</span>
        <span class="tl-body"><span class="tl-title">${esc(s.resolvedName)}</span>
          <span class="tl-chips">${chip(s.cat)}<span class="chip date">${ICONS.check}${esc(shortDate.format(state.settings.quitAt + s.resolve * DAY))}</span></span></span>
        <span class="chev">${ICONS.chevron}</span></button>`;
    }
    return `<button class="card sym" data-symptom="${s.id}">
      <span class="tl-ic">${s.emoji}</span>
      <span class="tl-body"><span class="tl-title">${esc(s.name)}</span>
        <span class="tl-chips">${chip(s.cat)}<span class="tl-when">${phaseLabel(s)}</span></span></span>
      ${ring(s.pct, { size: 58, stroke: 6, from: prev?.symptoms?.[s.id] })}
      <span class="chev">${ICONS.chevron}</span></button>`;
  };
  return `
  <header class="top"><h1>Recovery</h1><button class="icon-btn" data-sheet="science" aria-label="About the science">${ICONS.info}</button></header>
  <p class="intro">Each ring shows how far you are through that symptom’s typical course. Watch them close.</p>
  ${active.length ? `<div class="sep"><span>Fading now</span></div>${active.map(card).join('')}` : ''}
  ${gone.length ? `<div class="sep"><span>Behind you · ${gone.length}</span></div>${gone.map(card).join('')}` : ''}`;
}

function phaseLabel(s) {
  switch (s.phase) {
    case 'early': return 'may start soon';
    case 'peak': return 'peak phase';
    case 'almost': return `almost gone · ~${humanizeMs(s.daysLeft * DAY)}`;
    default: return `easing · ~${humanizeMs(s.daysLeft * DAY)} left`;
  }
}

// ---------- detail sheets ----------

function curveSvg(sym, d) {
  const W = 320, H = 120, pad = 8;
  const maxD = sym.resolve * 1.12;
  const x = (v) => pad + (v / maxD) * (W - pad * 2);
  const y = (v) => H - 22 - v * (H - 40);
  const pts = [];
  for (let i = 0; i <= 120; i++) { const t = (i / 120) * maxD; pts.push([x(t), y(intensityAt(sym, t))]); }
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');
  const area = `${line}L${x(maxD)} ${y(0)}L${x(0)} ${y(0)}Z`;
  const cd = Math.min(d, maxD);
  const cx = x(cd), cy = y(intensityAt(sym, cd));
  const tick = (v, label) => `<text x="${x(v)}" y="${H - 4}" text-anchor="${v === 0 ? 'start' : 'middle'}">${label}</text>`;
  const showPeak = sym.peak > 0 && sym.peak / maxD > 0.14;
  return `<svg class="curve" viewBox="0 0 ${W} ${H}" role="img" aria-label="Typical intensity over time">
    <defs><clipPath id="past"><rect x="0" y="0" width="${cx}" height="${H}"/></clipPath></defs>
    <path d="${area}" class="c-area"/>
    <path d="${area}" class="c-area-past" clip-path="url(#past)"/>
    <path d="${line}" class="c-line"/>
    <line x1="${x(0)}" x2="${x(maxD)}" y1="${y(0)}" y2="${y(0)}" class="c-base"/>
    ${tick(0, 'quit')}${showPeak ? tick(sym.peak, `day ${sym.peak}`) : ''}${tick(sym.resolve, `day ${sym.resolve}`)}
    <line x1="${cx}" x2="${cx}" y1="${y(0)}" y2="${cy}" class="c-now-line"/>
    <circle cx="${cx}" cy="${cy}" r="6" class="c-now"/>
    <text x="${Math.min(Math.max(cx, 24), W - 24)}" y="${Math.max(cy - 12, 12)}" text-anchor="middle" class="c-now-label">you</text>
  </svg>`;
}

function openSymptom(id) {
  const d = days();
  const s = allSymptoms(d).find((x) => x.id === id);
  const status = s.pct >= 1
    ? `Typically resolved by ${dateFmt.format(state.settings.quitAt + s.resolve * DAY)}. That's behind you now.`
    : { early: 'This usually starts in the first day or two.', peak: 'You’re in the peak window. This is as hard as it typically gets.', easing: 'Past the peak and easing off.', almost: 'Nearly through the typical course.' }[s.phase];
  openSheet(`
    <div class="detail-head">
      <span class="detail-ic">${s.emoji}</span>
      <div><h2>${esc(s.pct >= 1 ? s.resolvedName : s.name)}</h2>${chip(s.cat)}</div>
      ${ring(s.pct, { size: 76, stroke: 8 })}
    </div>
    <p class="status">${esc(status)}</p>
    ${curveSvg(s, d)}
    <div class="facts">
      <div><span>Starts</span><b>${s.onset < 1 ? 'hours' : `~day ${s.onset}`}</b></div>
      <div><span>Peaks</span><b>${s.peak === 0 ? 'at start' : `~day ${s.peak}`}</b></div>
      <div><span>Fades</span><b>${s.range}</b></div>
    </div>
    <h3 class="sheet-h3">What’s happening</h3>
    <p class="prose">${esc(s.what)} ${sourceRefs(s.src)}</p>
    <h3 class="sheet-h3">What helps</h3>
    <ul class="tips">${s.tips.map((t) => `<li>${esc(t.text)} ${sourceRefs(t.src)}</li>`).join('')}</ul>
    ${sourceList([...new Set([...s.src, ...s.tips.flatMap((t) => t.src || [])])])}`);
}

function openMilestone(id) {
  const m = ms();
  const x = allMilestones(m).find((y) => y.id === id);
  const at = state.settings.quitAt + x.at * HOUR;
  openSheet(`
    <div class="detail-head">
      <span class="detail-ic">${x.emoji}</span>
      <div><h2>${esc(x.title)}</h2>${chip(x.cat)}</div>
      ${ring(x.pct, { size: 76, stroke: 8 })}
    </div>
    <p class="status">${x.done ? `Reached ${esc(dateTimeFmt.format(at))}` : `Coming up in ${humanizeMs(x.msLeft)} · ${esc(dateFmt.format(at))}`}</p>
    <p class="prose">${esc(x.text)} ${sourceRefs(x.src)}</p>
    ${sourceList(x.src)}`);
}

function openSettings() {
  const h = state.history || { attempts: 0, bestMs: 0 };
  openSheet(`
    <div class="sheet-head"><h2>Settings</h2></div>
    ${onboardingView(state.settings)}
    <div class="settings-list">
      <button class="list-btn" data-sheet="slip">Had a slip? <span class="muted">Restart the clock</span></button>
      <button class="list-btn" data-sheet="sources">Sources <span class="muted">${SOURCES.length} studies</span></button>
      <button class="list-btn" data-sheet="science">About the science</button>
      <button class="list-btn danger" data-erase>Erase all data</button>
    </div>
    ${h.attempts ? `<p class="fine center">Best streak: ${humanizeMs(Math.max(h.bestMs, ms()))}</p>` : ''}`, {
    onMount: (w) => {
      $('#setup', w).addEventListener('submit', (e) => {
        e.preventDefault();
        state.settings = readSetup(e.target);
        state.last = null;
        visit = null;
        save();
        closeSheet();
        render();
      });
    },
  });
}

function openSlip() {
  openSheet(`
    <div class="sheet-head"><h2>Had a slip?</h2></div>
    <div class="prose">
      <p>It happens to most people who quit, and it doesn’t erase what you’ve learned. Your best streak is kept.</p>
      <p>What mattered is that you’re here and starting again. Every restart makes the next one easier.</p>
    </div>
    <label class="field"><span>When was your last use?</span>
      <input type="datetime-local" id="slipAt" value="${toLocalInput(Date.now())}" max="${toLocalInput(Date.now())}"></label>
    <button class="btn primary" data-confirm-slip>Restart my clock</button>
    <button class="btn ghost" data-close>Never mind</button>`);
}

// ---------- rendering & routing ----------

const VIEWS = { overview: overviewView, milestones: milestonesView, recovery: recoveryView };

function currentTab() {
  const t = location.hash.slice(1);
  return VIEWS[t] ? t : 'overview';
}

function render({ keepScroll = false } = {}) {
  clearInterval(tickTimer);
  if (!state?.settings) {
    app.innerHTML = onboardingView();
    $('nav.tabs')?.classList.add('hidden');
    $('#setup').addEventListener('submit', (e) => {
      e.preventDefault();
      state = { settings: readSetup(e.target), history: { attempts: 0, bestMs: 0 }, last: null };
      save();
      startVisit();
      render();
    });
    return;
  }
  const tab = currentTab();
  const y = window.scrollY;
  app.innerHTML = `<main class="view view-${tab}">${VIEWS[tab]()}</main>`;
  renderTabs(tab);
  animateRings();
  animated.add(tab);
  if (keepScroll) window.scrollTo(0, y);
  else if (tab === 'milestones') $('#today')?.scrollIntoView({ block: 'center' });
  else window.scrollTo(0, 0);
  if (tab === 'overview') {
    tickTimer = setInterval(() => {
      const c = $('#counter');
      if (!c) return;
      c.innerHTML = counterHtml(ms());
      $('#tiles').innerHTML = tilesHtml(ms());
    }, 1000);
  }
}

function renderTabs(tab) {
  let nav = $('nav.tabs');
  if (!nav) {
    nav = document.createElement('nav');
    nav.className = 'tabs';
    nav.innerHTML = [
      ['overview', 'Overview', ICONS.tabOverview],
      ['milestones', 'Milestones', ICONS.tabMilestones],
      ['recovery', 'Recovery', ICONS.tabRecovery],
    ].map(([id, label, ic]) => `<a href="#${id}" data-tab="${id}"><span class="tab-ic">${ic}</span>${label}</a>`).join('');
    document.body.appendChild(nav);
  }
  nav.classList.remove('hidden');
  nav.querySelectorAll('a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
}

// A "visit" starts when the app is opened or brought back after a while.
function startVisit() {
  const m = ms();
  const snap = snapshot(m);
  const last = state.last;
  const isReturn = last && Date.now() - last.at > RETURN_GAP;
  visit = { prev: isReturn ? last.snap : null, diff: isReturn ? diffSnapshots(last.snap, snap) : null, dismissed: false };
  animated = new Set();
  state.last = { at: Date.now(), snap };
  save();
}

function handleCommon(e) {
  const t = e.target;
  const src = t.closest('[data-source]');
  if (src) { e.preventDefault(); e.stopPropagation(); openSources(src.dataset.source); return true; }
  const sh = t.closest('[data-sheet]');
  if (sh) {
    ({ settings: openSettings, sources: () => openSources(), science: openScience, slip: openSlip })[sh.dataset.sheet]();
    return true;
  }
  if (t.closest('[data-confirm-slip]')) {
    const v = $('#slipAt')?.value;
    const at = Math.min(Date.now(), v ? new Date(v).getTime() : Date.now());
    const h = state.history || { attempts: 0, bestMs: 0 };
    state.history = { attempts: h.attempts + 1, bestMs: Math.max(h.bestMs, ms()) };
    state.settings.quitAt = at;
    state.last = null;
    save();
    startVisit();
    closeSheet();
    location.hash = '#overview';
    render();
    return true;
  }
  if (t.closest('[data-erase]')) {
    if (confirm('Erase all Clearing data from this device?')) {
      localStorage.removeItem(KEY);
      state = null;
      closeSheet(true);
      render();
    }
    return true;
  }
  return false;
}

app.addEventListener('click', (e) => {
  if (handleCommon(e)) return;
  const t = e.target;
  const go = t.closest('[data-go]');
  if (go) { location.hash = '#' + go.dataset.go; return; }
  const sym = t.closest('[data-symptom]');
  if (sym) { openSymptom(sym.dataset.symptom); return; }
  const mil = t.closest('[data-milestone]');
  if (mil) { openMilestone(mil.dataset.milestone); return; }
  if (t.closest('[data-dismiss-visit]')) {
    visit.dismissed = true;
    const card = $('.since-card');
    card.classList.add('leaving');
    setTimeout(() => card.remove(), 250);
  }
});

window.addEventListener('hashchange', () => { closeSheet(true); render(); });

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !state?.settings) return;
  if (state.last && Date.now() - state.last.at > RETURN_GAP) {
    startVisit();
    render();
  } else {
    render({ keepScroll: true });
  }
});

// Refresh rings and timeline once a minute while open.
setInterval(() => {
  if (state?.settings && document.visibilityState === 'visible' && !$('.sheet-wrap') && currentTab() !== 'overview') {
    render({ keepScroll: true });
  }
}, 60 * 1000);

if (state?.settings) startVisit();
render();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
