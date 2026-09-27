import test from 'node:test';
import assert from 'node:assert/strict';
import { SYMPTOMS, MILESTONES, SOURCE_BY_KEY } from '../js/data.js';
import {
  DAY, HOUR, stats, intensityAt, symptomProgress, overallRecovery, allMilestones,
  groupFor, splitDuration, snapshot, diffSnapshots, humanizeMs,
} from '../js/logic.js';

const settings = { unit: 'grams', amount: 1, gramsPerJoint: 0.5, pricePerGram: 10, thcPct: 20 };

test('every cited source exists', () => {
  const keys = [
    ...SYMPTOMS.flatMap((s) => [...s.src, ...s.tips.flatMap((t) => t.src || [])]),
    ...MILESTONES.flatMap((m) => m.src),
  ];
  for (const k of keys) assert.ok(SOURCE_BY_KEY[k], `missing source ${k}`);
});

test('symptom timings are ordered', () => {
  for (const s of SYMPTOMS) {
    assert.ok(s.onset <= s.resolve && s.peak < s.resolve, s.id);
  }
});

test('milestones are chronological', () => {
  for (let i = 1; i < MILESTONES.length; i++) assert.ok(MILESTONES[i].at >= MILESTONES[i - 1].at);
});

test('stats scale with time', () => {
  const s = stats(settings, 10 * DAY);
  assert.equal(s.joints, 20);
  assert.ok(Math.abs(s.grams - 10) < 1e-9);
  assert.ok(Math.abs(s.thcMg - 2000) < 1e-9);
  assert.ok(Math.abs(s.money - 100) < 1e-9);
  const j = stats({ ...settings, unit: 'joints', amount: 3 }, 2 * DAY);
  assert.equal(j.joints, 6);
  assert.ok(Math.abs(j.grams - 3) < 1e-9);
});

test('intensity peaks at peak and is zero after resolve', () => {
  const s = SYMPTOMS.find((x) => x.id === 'irritability');
  assert.ok(Math.abs(intensityAt(s, s.peak) - 1) < 1e-9);
  assert.ok(intensityAt(s, 1) < 1);
  assert.ok(intensityAt(s, 8) < intensityAt(s, 5));
  assert.equal(intensityAt(s, s.resolve), 0);
  const fog = SYMPTOMS.find((x) => x.id === 'fog');
  assert.equal(intensityAt(fog, 0), 1);
});

test('symptom progress and phases', () => {
  const s = SYMPTOMS.find((x) => x.id === 'irritability');
  assert.equal(symptomProgress(s, 0.5).phase, 'early');
  assert.equal(symptomProgress(s, 3).phase, 'peak');
  assert.equal(symptomProgress(s, 7).phase, 'easing');
  assert.equal(symptomProgress(s, 12).phase, 'almost');
  assert.equal(symptomProgress(s, 14).phase, 'resolved');
  assert.equal(symptomProgress(s, 20).pct, 1);
});

test('overall recovery is monotonic and reaches 100%', () => {
  let prev = -1;
  for (let d = 0; d <= 50; d += 0.5) {
    const v = overallRecovery(d);
    assert.ok(v >= prev);
    prev = v;
  }
  assert.equal(overallRecovery(60), 1);
});

test('milestone status and grouping', () => {
  const list = allMilestones(25 * HOUR);
  assert.ok(list.find((m) => m.id === 'co').done);
  assert.ok(!list.find((m) => m.id === 'cb1start').done);
  assert.equal(groupFor(3).label, 'Quit day');
  assert.equal(groupFor(7 * 24).label, '1 week');
  assert.equal(groupFor(10 * 24).label, '1 week');
});

test('visit diff reports new milestones and resolved symptoms', () => {
  const a = snapshot(5 * DAY);
  const b = snapshot(15 * DAY);
  const d = diffSnapshots(a, b);
  assert.ok(d.overallTo > d.overallFrom);
  assert.ok(d.newMilestones.includes('mostgone'));
  assert.ok(d.newlyResolved.includes('irritability'));
  assert.equal(diffSnapshots(null, b), null);
});

test('duration helpers', () => {
  assert.deepEqual(splitDuration(DAY + 2 * HOUR + 61000), { days: 1, hours: 2, minutes: 1, seconds: 1 });
  assert.equal(humanizeMs(3 * DAY), '3 days');
  assert.equal(humanizeMs(90 * 60000), '1h 30m');
});
