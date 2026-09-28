import { SOURCES, SOURCE_BY_KEY, CATEGORIES, SYMPTOMS, SYMPTOM_GROUPS, sourceUrl } from './data.js';
import {
  DAY, HOUR, elapsedMs, splitDuration, stats, allSymptoms, overallRecovery,
  allEvents, groupFor, phaseLabel, humanizeMs, snapshot, diffSnapshots, intensityAt,
} from './logic.js';
import { ICONS, categorySymbol, sunburst } from './art.js';

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
const shortDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });
const num = (n, d = 0) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = (p) => Math.round(p * 100);

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
    const whole = v >= 1000;
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: whole ? 0 : 2, minimumFractionDigits: whole ? 0 : 2 }).format(v);
  } catch {
    return `${num(v, 2)} ${currency}`;
  }
}
function toLocalInput(ms) {
  const off = new Date(ms).getTimezoneOffset() * 60000;
  return new Date(ms - off).toISOString().slice(0, 16);
}

// ---------- shared components ----------

function ring(p, { size = 48, stroke = 3, from = null, label = true } = {}) {
  const r = (size - stroke) / 2 - 1;
  const c = 2 * Math.PI * r;
  const start = from ?? p;
  return `<div class="ring" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle class="ring-bg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"/>
      <circle class="ring-fg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"
        stroke-dasharray="${c.toFixed(2)}" style="stroke-dashoffset:${(c * (1 - start)).toFixed(2)}"
        data-to="${(c * (1 - p)).toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    </svg>
    ${label ? `<span class="ring-num" data-from="${pct(start)}" data-to="${pct(p)}">${pct(start)}</span>` : ''}
  </div>`;
}

function countUp(el, a, b, dur = 1400) {
  if (a === b) return;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(a + (b - a) * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function animate(root = app) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    root.querySelectorAll('.ring-fg[data-to]').forEach((el) => { el.style.strokeDashoffset = el.dataset.to; });
    root.querySelectorAll('.ring-num, .count-up').forEach((el) => countUp(el, +el.dataset.from, +el.dataset.to));
    root.querySelectorAll('.sunburst').forEach((sb) => {
      const from = +sb.dataset.from, to = +sb.dataset.on;
      sb.querySelectorAll('.tick').forEach((t) => {
        const i = +t.dataset.i;
        if (i >= from && i < to) {
          t.style.transitionDelay = `${(i - from) * 18}ms`;
          t.classList.add('on');
        }
      });
    });
  }));
}

function catLabel(cat) {
  return `<span class="cat">${categorySymbol(cat, 13)}${CATEGORIES[cat].label}</span>`;
}

function stamp(date) {
  return `<span class="stamp"><b>Gone</b>${date ? `<small>${esc(shortDate.format(date))}</small>` : ''}</span>`;
}

function sourceRefs(keys) {
  if (!keys?.length) return '';
  return keys.map((k) => `<button class="ref" data-source="${k}">${SOURCE_BY_KEY[k].n}</button>`).join('');
}

function sourceList(keys) {
  if (!keys?.length) return '';
  return `<h3 class="label">Sources</h3><ol class="sources compact">${keys.map((k) => sourceItem(SOURCE_BY_KEY[k])).join('')}</ol>`;
}

function sourceItem(s) {
  return `<li class="source" id="src-${s.key}">
    <a href="${sourceUrl(s)}" target="_blank" rel="noopener">
      <span class="src-n">${s.n}</span>
      <span class="src-body">
        <span class="src-title">${esc(s.title)}</span>
        <span class="src-journal">${esc(s.journal)}</span>
        <span class="src-meta"><span>${esc(s.authors)}</span><b>${s.year}</b></span>
      </span>
    </a></li>`;
}

function rule(label, extra = '') {
  return `<div class="rule"><span class="rule-label">${label}</span>${extra}</div>`;
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
  animate(wrap);
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
    <div class="sheet-head"><h2>The science</h2></div>
    <div class="prose">
      <p>The timings in Clearing come from peer-reviewed research on cannabis withdrawal and recovery. Withdrawal usually starts 1–3 days after the last use, peaks between days 2 and 6, and most symptoms are gone within 1–2 weeks. Sleep problems and vivid dreams can take a month or more.</p>
      <p>About half of regular users get withdrawal symptoms. Not everyone gets every symptom, and heavier use usually means a longer, stronger course. Each ring shows progress through a symptom’s <em>typical</em> course, not a measurement of you.</p>
      <p>Clearing is not medical advice. If you feel very unwell or very low, or have thoughts of harming yourself, contact a doctor or local emergency services.</p>
    </div>`);
}

// ---------- onboarding & settings form ----------

function setupForm(existing) {
  const s = existing || { quitAt: Date.now(), unit: 'grams', amount: 1, gramsPerJoint: 0.5, pricePerGram: 10, currency: guessCurrency(), thcPct: 18 };
  const currencies = ['USD', 'EUR', 'GBP', 'SEK', 'NOK', 'DKK', 'CAD', 'AUD', 'NZD', 'CHF', 'JPY'];
  if (!currencies.includes(s.currency)) currencies.unshift(s.currency);
  return `
  <form class="setup" id="setup">
    <label class="field"><span>Last use</span>
      <input type="datetime-local" name="quitAt" value="${toLocalInput(s.quitAt)}" max="${toLocalInput(Date.now())}" required></label>
    <div class="field"><span>Typical amount per day</span>
      <div class="row">
        <input type="number" name="amount" inputmode="decimal" step="any" min="0" value="${s.amount}" required>
        <div class="seg" role="radiogroup">
          <label><input type="radio" name="unit" value="grams" ${s.unit === 'grams' ? 'checked' : ''}><span>Grams</span></label>
          <label><input type="radio" name="unit" value="joints" ${s.unit === 'joints' ? 'checked' : ''}><span>Joints</span></label>
        </div>
      </div>
    </div>
    <div class="row two">
      <label class="field"><span>Grams per joint</span>
        <input type="number" name="gramsPerJoint" inputmode="decimal" step="any" min="0.05" value="${s.gramsPerJoint}" required></label>
      <label class="field"><span>THC %</span>
        <input type="number" name="thcPct" inputmode="decimal" step="any" min="0" max="100" value="${s.thcPct}" required></label>
    </div>
    <div class="field"><span>Price per gram</span>
      <div class="row">
        <input type="number" name="pricePerGram" inputmode="decimal" step="any" min="0" value="${s.pricePerGram}" required>
        <select name="currency">${currencies.map((c) => `<option ${c === s.currency ? 'selected' : ''}>${c}</option>`).join('')}</select>
      </div>
    </div>
    <p class="fine">Stored only on this device. No account, no notifications.</p>
    <button class="btn primary" type="submit">${existing ? 'Save' : 'Start'}</button>
  </form>`;
}

function onboardingView() {
  return `
  <div class="welcome">
    <div class="welcome-mark">${sunburst(0.33, 0.33, 180)}<span class="welcome-star">${ICONS.star}</span></div>
    <h1 class="wordmark">Clearing</h1>
    <p class="welcome-sub">Tracks the symptoms of regular cannabis use and of quitting, and how long each one typically takes to go.</p>
  </div>
  ${setupForm()}`;
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
  return {
    quitAt: Math.min(Date.now(), new Date(f.get('quitAt')).getTime() || Date.now()),
    unit: f.get('unit'),
    amount: Math.max(0, +f.get('amount') || 0),
    gramsPerJoint: Math.max(0.05, +f.get('gramsPerJoint') || 0.5),
    pricePerGram: Math.max(0, +f.get('pricePerGram') || 0),
    currency: f.get('currency'),
    thcPct: Math.min(100, Math.max(0, +f.get('thcPct') || 0)),
  };
}

// ---------- views ----------

function ms() { return elapsedMs(state.settings.quitAt, Date.now()); }
function days() { return ms() / DAY; }

// Animate from where the user last saw things, once per visit per tab.
function fromFor(tab) {
  if (animated.has(tab) || !visit?.prev) return null;
  return visit.prev;
}

function header(title, right = '') {
  return `<header class="top"><h1>${title}</h1>${right}</header>`;
}

function overviewView() {
  const m = ms(), d = m / DAY;
  const prev = fromFor('overview');
  const overall = overallRecovery(d);
  const syms = allSymptoms(d);
  const gone = syms.filter((s) => s.pct >= 1).length;
  const next = syms.filter((s) => s.pct < 1).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 3);
  const q = state.settings.quitAt;
  return `
  ${header('<span class="wordmark small">Clearing</span>', `<button class="icon-btn" data-sheet="settings" aria-label="Settings">${ICONS.settings}</button>`)}
  <section class="hero">
    <div class="dial">
      ${sunburst(overall, prev?.overall ?? overall)}
      <div class="dial-center">
        <span class="dial-days" id="days">${splitDuration(m).days}</span>
        <span class="dial-unit" id="days-unit">${splitDuration(m).days === 1 ? 'Day' : 'Days'}</span>
        <span class="dial-hms" id="hms">${hmsHtml(m)}</span>
      </div>
    </div>
    <div class="hero-meta">
      <div><span class="label">Recovered</span><b><span class="count-up" data-from="${pct(prev?.overall ?? overall)}" data-to="${pct(overall)}">${pct(prev?.overall ?? overall)}</span>%</b></div>
      <div><span class="label">Symptoms gone</span><b>${gone}<small>/${syms.length}</small></b></div>
    </div>
    <p class="since">Since ${esc(dateFmt.format(q))}, ${esc(timeFmt.format(q))}</p>
    <p class="phase">${esc(phaseLabel(d))}</p>
  </section>
  ${sinceLastVisitHtml()}
  ${next.length ? `${rule('Next to go', `<a class="rule-link" href="#milestones">All ${ICONS.chevron}</a>`)}
  <div class="list">${next.map((s) => symptomRow(s, prev)).join('')}</div>` : ''}
  ${rule('Since quitting')}
  <div class="ledger" id="ledger">${ledgerHtml(m)}</div>
  ${state.history?.attempts ? `<p class="fine center">Longest streak ${humanizeMs(Math.max(state.history.bestMs, m))} · attempt ${state.history.attempts + 1}</p>` : ''}`;
}

function hmsHtml(m) {
  const t = splitDuration(m);
  const p = (v) => String(v).padStart(2, '0');
  return `${p(t.hours)}<i>h</i> ${p(t.minutes)}<i>m</i> ${p(t.seconds)}<i>s</i>`;
}

function ledgerHtml(m) {
  const s = stats(state.settings, m);
  const cell = (val, label) => `<div class="ledger-cell"><b>${val}</b><span>${label}</span></div>`;
  return cell(num(s.joints), 'Joints not smoked')
    + cell(fmtGrams(s.grams), 'Weed not used')
    + cell(fmtThc(s.thcMg), 'THC not taken')
    + cell(fmtMoney(s.money, state.settings.currency), 'Money kept');
}

function sinceLastVisitHtml() {
  const diff = visit?.diff;
  if (!diff || visit.dismissed) return '';
  const gained = pct(diff.overallTo) - pct(diff.overallFrom);
  if (gained <= 0 && !diff.newEvents.length && !diff.newlyResolved.length) return '';
  const events = allEvents(0);
  const lines = [];
  if (gained > 0) lines.push(`<li><span>Recovered</span><b>${pct(diff.overallFrom)}% → ${pct(diff.overallTo)}%</b></li>`);
  diff.newlyResolved.forEach((id) => {
    const s = SYMPTOMS.find((x) => x.id === id);
    if (s) lines.push(`<li><span>Gone</span><b>${esc(s.name)}</b></li>`);
  });
  diff.newEvents.slice(0, 3).forEach((id) => {
    const e = events.find((x) => x.id === id);
    if (e) lines.push(`<li><span>Reached</span><b>${esc(e.title)}</b></li>`);
  });
  if (diff.newEvents.length > 3) lines.push(`<li><span>Reached</span><b>${diff.newEvents.length - 3} more timeline events</b></li>`);
  return `<section class="since-card">
    <div class="since-head"><span class="label">Since your last visit</span><button class="icon-btn small" data-dismiss-visit aria-label="Dismiss">${ICONS.close}</button></div>
    <ul>${lines.join('')}</ul></section>`;
}

function symptomRow(s, prev) {
  const done = s.pct >= 1;
  const goneAt = state.settings.quitAt + s.resolve * DAY;
  const meta = done
    ? `${catLabel(s.cat)}`
    : `${catLabel(s.cat)}<span class="dot-sep"></span><span>${phaseText(s)}</span>`;
  return `<button class="row-card${done ? ' done' : ''}" data-symptom="${s.id}">
    <span class="sym-mark">${categorySymbol(s.cat, 20)}</span>
    <span class="row-body">
      <span class="row-title">${esc(s.name)}</span>
      <span class="row-cause">${esc(s.cause)}</span>
      <span class="row-meta">${meta}</span>
    </span>
    ${done ? stamp(goneAt) : ring(s.pct, { from: prev?.symptoms?.[s.id] ?? null })}
  </button>`;
}

function phaseText(s) {
  if (s.phase === 'early') return 'may start soon';
  if (s.phase === 'peak') return 'at its worst now';
  return `~${humanizeMs(s.daysLeft * DAY)} left`;
}

function milestonesView() {
  const d = days();
  const prev = fromFor('milestones');
  const syms = allSymptoms(d);
  const gone = syms.filter((s) => s.pct >= 1).length;
  const section = (key) => {
    const g = SYMPTOM_GROUPS[key];
    // Still fading first (soonest to go at the top), then the gone ones, most recent first.
    const list = syms.filter((s) => s.group === key)
      .sort((a, b) => (a.pct >= 1) - (b.pct >= 1) || (a.pct >= 1 ? b.resolve - a.resolve : a.resolve - b.resolve));
    const n = list.filter((s) => s.pct >= 1).length;
    return `${rule(g.label, `<span class="tag">${n}/${list.length} gone</span>`)}
      <p class="group-note">${esc(g.note)} ${sourceRefs(g.src)}</p>
      <div class="list">${list.map((s) => symptomRow(s, prev)).join('')}</div>`;
  };
  return `
  ${header('Milestones', `<button class="count-btn" data-sheet="sources" aria-label="Sources">${ICONS.book}<span>${gone}/${syms.length}</span></button>`)}
  <p class="intro">Each ring fills over the symptom’s typical course, as measured in published studies. Tap one for the details and sources.</p>
  ${section('withdrawal')}
  ${section('use')}`;
}

function timelineView() {
  const m = ms();
  const list = allEvents(m);
  const done = list.filter((x) => x.done).length;
  let html = '', lastGroup = null, todayShown = false;
  for (const x of list) {
    if (!x.done && !todayShown) {
      html += `<li class="tl-today" id="today"><span>Today</span></li>`;
      todayShown = true;
      lastGroup = null;
    }
    const g = groupFor(x.at);
    if (g !== lastGroup) html += `<li class="tl-group">${g.label}</li>`;
    lastGroup = g;
    const at = state.settings.quitAt + x.at * HOUR;
    html += `<li><button class="tl-row${x.done ? ' done' : ''}" data-event="${x.id}">
      <span class="tl-node"></span>
      <span class="tl-body"><span class="tl-title">${esc(x.title)}</span>
        <span class="row-meta">${catLabel(x.cat)}<span class="dot-sep"></span><span>${x.done ? esc(shortDate.format(at)) : `in ${humanizeMs(x.msLeft)}`}</span></span></span>
      <span class="chev">${ICONS.chevron}</span></button></li>`;
  }
  return `
  ${header('Timeline', `<button class="count-btn" data-sheet="sources" aria-label="Sources">${ICONS.book}<span>${done}/${list.length}</span></button>`)}
  <p class="intro">What happens in the body and brain after the last use, and when.</p>
  <ol class="timeline">${html}</ol>`;
}

// ---------- detail sheets ----------

function curveSvg(sym, d) {
  const W = 320, H = 118, pad = 10;
  const maxD = sym.resolve * 1.12;
  const x = (v) => pad + (v / maxD) * (W - pad * 2);
  const y = (v) => H - 22 - v * (H - 42);
  const pts = [];
  for (let i = 0; i <= 120; i++) { const t = (i / 120) * maxD; pts.push([x(t), y(intensityAt(sym, t))]); }
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');
  const area = `${line}L${x(maxD)} ${y(0)}L${x(0)} ${y(0)}Z`;
  const cd = Math.min(d, maxD);
  const cx = x(cd), cy = y(intensityAt(sym, cd));
  const tick = (v, label, anchor = 'middle') => `<text x="${x(v)}" y="${H - 5}" text-anchor="${anchor}">${label}</text>`;
  const dayLabel = (v) => (v < 1 ? `${Math.round(v * 24)} h` : `day ${v}`);
  const showPeak = sym.peak > 0 && sym.peak / maxD > 0.14;
  const clip = `past-${sym.id}`;
  return `<svg class="curve" viewBox="0 0 ${W} ${H}" role="img" aria-label="Typical intensity over time">
    <defs><clipPath id="${clip}"><rect x="0" y="0" width="${cx}" height="${H}"/></clipPath></defs>
    <path d="${area}" class="c-area"/>
    <path d="${area}" class="c-area-past" clip-path="url(#${clip})"/>
    <path d="${line}" class="c-line"/>
    <line x1="${x(0)}" x2="${x(maxD)}" y1="${y(0)}" y2="${y(0)}" class="c-base"/>
    ${tick(0, 'last use', 'start')}${showPeak ? tick(sym.peak, dayLabel(sym.peak)) : ''}${tick(sym.resolve, dayLabel(sym.resolve))}
    <line x1="${cx}" x2="${cx}" y1="${y(0)}" y2="${cy}" class="c-now-line"/>
    <circle cx="${cx}" cy="${cy}" r="4.5" class="c-now"/>
    <text x="${Math.min(Math.max(cx, 22), W - 22)}" y="${Math.max(cy - 10, 12)}" text-anchor="middle" class="c-now-label">now</text>
  </svg>`;
}

function openSymptom(id) {
  const d = days();
  const s = allSymptoms(d).find((x) => x.id === id);
  const goneAt = state.settings.quitAt + s.resolve * DAY;
  const done = s.pct >= 1;
  const group = SYMPTOM_GROUPS[s.group];
  const status = done
    ? `Typically gone by ${dateFmt.format(goneAt)}`
    : `Typically gone by ${dateFmt.format(goneAt)} · ${humanizeMs(s.daysLeft * DAY)} left`;
  const tags = [group.label];
  if (s.group === 'withdrawal') tags.push(s.common ? 'Common' : 'Less common');
  const allSrc = [...new Set([...s.src, ...s.tips.flatMap((t) => t.src || [])])];
  openSheet(`
    <div class="detail-head">
      <div class="detail-title">
        <span class="label">${tags.join(' · ')}</span>
        <h2>${esc(s.name)}</h2>
        ${catLabel(s.cat)}
      </div>
      ${done ? stamp(goneAt) : ring(s.pct, { size: 72, stroke: 4 })}
    </div>
    <p class="status">${esc(status)}</p>
    <h3 class="label">Why it happens</h3>
    <p class="lead">${esc(s.cause)}</p>
    <p class="prose">${esc(s.what)} ${sourceRefs(s.src)}</p>
    <h3 class="label">Typical course</h3>
    ${curveSvg(s, d)}
    <div class="facts">
      <div><span>Starts</span><b>${s.onset === 0 ? 'While using' : s.onset < 1 ? 'Within hours' : `Day ${s.onset}`}</b></div>
      <div><span>Worst</span><b>${s.peak === 0 ? 'At the start' : `Day ${s.peak}`}</b></div>
      <div><span>Gone</span><b>${esc(s.range)}</b></div>
    </div>
    ${s.tips.length ? `<h3 class="label">What helps</h3><ul class="tips">${s.tips.map((t) => `<li>${esc(t.text)} ${sourceRefs(t.src)}</li>`).join('')}</ul>` : ''}
    ${sourceList(allSrc)}`);
}

function openEvent(id) {
  const x = allEvents(ms()).find((y) => y.id === id);
  const at = state.settings.quitAt + x.at * HOUR;
  openSheet(`
    <div class="detail-head">
      <div class="detail-title">
        <span class="label">Timeline</span>
        <h2>${esc(x.title)}</h2>
        ${catLabel(x.cat)}
      </div>
      ${ring(x.pct, { size: 72, stroke: 4 })}
    </div>
    <p class="status">${x.done ? `Reached ${esc(dateFmt.format(at))}, ${esc(timeFmt.format(at))}` : `${esc(dateFmt.format(at))} · in ${humanizeMs(x.msLeft)}`}</p>
    <p class="prose">${esc(x.text)} ${sourceRefs(x.src)}</p>
    ${sourceList(x.src)}`);
}

function openSettings() {
  const h = state.history || { attempts: 0, bestMs: 0 };
  openSheet(`
    <div class="sheet-head"><h2>Settings</h2></div>
    ${setupForm(state.settings)}
    <div class="settings-list">
      <button class="list-btn" data-sheet="slip">Reset after a slip <span class="muted">${ICONS.chevron}</span></button>
      <button class="list-btn" data-sheet="sources">Sources <span class="muted">${SOURCES.length} ${ICONS.chevron}</span></button>
      <button class="list-btn" data-sheet="science">The science <span class="muted">${ICONS.chevron}</span></button>
      <button class="list-btn danger" data-erase>Erase all data</button>
    </div>
    ${h.attempts ? `<p class="fine center">Longest streak ${humanizeMs(Math.max(h.bestMs, ms()))}</p>` : ''}`, {
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
    <div class="sheet-head"><h2>Reset</h2></div>
    <p class="prose">Restarts the clock from the time below. Your longest streak is kept.</p>
    <label class="field"><span>Last use</span>
      <input type="datetime-local" id="slipAt" value="${toLocalInput(Date.now())}" max="${toLocalInput(Date.now())}"></label>
    <button class="btn primary" data-confirm-slip>Restart clock</button>
    <button class="btn ghost" data-close>Cancel</button>`);
}

// ---------- rendering & routing ----------

const VIEWS = { overview: overviewView, milestones: milestonesView, timeline: timelineView };

function currentTab() {
  const t = location.hash.slice(1);
  if (t === 'recovery') return 'milestones';
  return VIEWS[t] ? t : 'overview';
}

function render({ keepScroll = false } = {}) {
  clearInterval(tickTimer);
  if (!state?.settings) {
    app.innerHTML = `<main class="view view-welcome">${onboardingView()}</main>`;
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
  animate();
  animated.add(tab);
  if (keepScroll) window.scrollTo(0, y);
  else if (tab === 'timeline') $('#today')?.scrollIntoView({ block: 'center' });
  else window.scrollTo(0, 0);
  if (tab === 'overview') {
    tickTimer = setInterval(() => {
      const el = $('#hms');
      if (!el) return;
      const m = ms();
      el.innerHTML = hmsHtml(m);
      $('#days').textContent = splitDuration(m).days;
      $('#ledger').innerHTML = ledgerHtml(m);
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
      ['timeline', 'Timeline', ICONS.tabTimeline],
    ].map(([id, label, ic]) => `<a href="#${id}" data-tab="${id}">${ic}<span>${label}</span></a>`).join('');
    document.body.appendChild(nav);
  }
  nav.classList.remove('hidden');
  nav.querySelectorAll('a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
}

// A "visit" starts when the app is opened or brought back after a while.
function startVisit() {
  const snap = snapshot(ms());
  const last = state.last;
  const isReturn = last?.snap && Date.now() - last.at > RETURN_GAP;
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
  const sym = t.closest('[data-symptom]');
  if (sym) { openSymptom(sym.dataset.symptom); return; }
  const ev = t.closest('[data-event]');
  if (ev) { openEvent(ev.dataset.event); return; }
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
