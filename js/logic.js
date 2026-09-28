// Pure calculations. No DOM access here so it can be unit tested with node.
import { SYMPTOMS, TIMELINE, GROUPS } from './data.js';

export const HOUR = 3600 * 1000;
export const DAY = 24 * HOUR;

const clamp01 = (x) => Math.max(0, Math.min(1, x));

export function elapsedMs(quitAt, now) {
  return Math.max(0, now - quitAt);
}

export function splitDuration(ms) {
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function gramsPerDay(settings) {
  return settings.unit === 'joints'
    ? settings.amount * settings.gramsPerJoint
    : settings.amount;
}

export function jointsPerDay(settings) {
  return settings.unit === 'joints'
    ? settings.amount
    : settings.amount / (settings.gramsPerJoint || 0.5);
}

export function stats(settings, ms) {
  const days = ms / DAY;
  const grams = gramsPerDay(settings) * days;
  return {
    joints: Math.floor(jointsPerDay(settings) * days),
    grams,
    thcMg: grams * 1000 * (settings.thcPct / 100),
    money: grams * settings.pricePerGram,
  };
}

// Typical relative intensity (0..1) of a symptom `d` days after quitting.
// Rises from onset to the peak, then eases back to baseline at `resolve`.
export function intensityAt(sym, d) {
  if (d >= sym.resolve) return 0;
  if (d <= sym.peak) {
    if (sym.peak === 0) return 1;
    if (d < 0) return 0;
    const start = Math.min(sym.onset, sym.peak);
    if (d < start) return 0.25 * (d / Math.max(start, 0.01));
    const t = (d - start) / Math.max(sym.peak - start, 0.01);
    return 0.25 + 0.75 * Math.sin((t * Math.PI) / 2);
  }
  const t = (d - sym.peak) / (sym.resolve - sym.peak);
  // Ease-out: drops faster right after the peak, long gentle tail.
  return Math.pow(1 - t, 1.8);
}

// Recovery progress through the typical withdrawal window, 0..1.
export function symptomProgress(sym, d) {
  const pct = clamp01(d / sym.resolve);
  let phase;
  if (pct >= 1) phase = 'resolved';
  else if (d < sym.onset) phase = 'early';
  else if (d <= sym.peak + 0.5 && sym.peak > 0) phase = 'peak';
  else if (pct < 0.75) phase = 'easing';
  else phase = 'almost';
  return {
    pct,
    phase,
    intensity: intensityAt(sym, d),
    daysLeft: Math.max(0, sym.resolve - d),
    resolvedAtMs: sym.resolve * DAY,
  };
}

export function allSymptoms(d) {
  return SYMPTOMS.map((s) => ({ ...s, ...symptomProgress(s, d) }));
}

export function overallRecovery(d) {
  const list = allSymptoms(d);
  return list.reduce((a, s) => a + s.pct, 0) / list.length;
}

export function eventStatus(m, ms) {
  const target = m.at * HOUR;
  return { done: ms >= target, pct: clamp01(ms / target), msLeft: Math.max(0, target - ms) };
}

export function allEvents(ms) {
  return TIMELINE.map((m) => ({ ...m, ...eventStatus(m, ms) }));
}

export function groupFor(hours) {
  let g = GROUPS[0];
  for (const x of GROUPS) if (hours >= x.at) g = x;
  return g;
}

// A factual description of where someone is in the typical withdrawal course.
export function phaseLabel(d) {
  if (d < 1) return 'Before withdrawal · it usually starts on day 1–3';
  if (d < 2) return 'Withdrawal starting';
  if (d < 6) return 'Withdrawal peak · typically days 2–6';
  if (d < 14) return 'Past the peak · most symptoms fade by day 14';
  if (d < 28) return 'Late withdrawal · sleep, dreams and cravings last longest';
  if (d < 45) return 'Receptors recovered · sleep and dreams settling';
  return 'Withdrawal complete';
}

export function humanizeMs(ms) {
  const { days, hours, minutes } = splitDuration(ms);
  if (days >= 2) return `${days} days`;
  if (days === 1) return hours ? `1 day ${hours}h` : '1 day';
  if (hours >= 1) return `${hours}h ${minutes}m`;
  return `${Math.max(1, minutes)} min`;
}

// Snapshot used for the "since your last visit" summary and for animating
// progress rings from where the user last saw them.
export function snapshot(ms) {
  const d = ms / DAY;
  return {
    ms,
    overall: overallRecovery(d),
    symptoms: Object.fromEntries(allSymptoms(d).map((s) => [s.id, s.pct])),
    events: allEvents(ms).filter((m) => m.done).map((m) => m.id),
  };
}

export function diffSnapshots(prev, next) {
  if (!prev) return null;
  const seen = prev.events || [];
  const newEvents = next.events.filter((id) => !seen.includes(id));
  const newlyResolved = Object.keys(next.symptoms).filter(
    (id) => next.symptoms[id] >= 1 && (prev.symptoms[id] ?? 0) < 1,
  );
  return {
    overallFrom: prev.overall,
    overallTo: next.overall,
    newEvents,
    newlyResolved,
  };
}
