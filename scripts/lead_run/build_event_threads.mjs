#!/usr/bin/env node
// LSD257-LSD259, LSD263: canon events are threads. Candidate threads by script from data the readings hold, no model call and no new schema field (LSD258):
// scenes chain by `needs` deps, `continues`, rare recurring touched ids close together in order, and overlapping footprint windows. `after` deps alone do not chain
// (they link consecutive scenes, so they would join the whole book). Singleton scenes become single-beat threads, so every card has a thread id.
// Public and name-free: canon scenes come in through the caller and output stays private.
// Weight of one shared id by kind. World-state ids (deities, laws, languages, prices, clocks) recur everywhere and chain the whole book, so they do not link.
export const LINK_WEIGHT = Object.freeze({item: 1, document: 1, note: 1, creature: 1, event: 1, person: 0.5, organization: 0.5, org: 0.5});
const LINK_KINDS = new Set(Object.keys(LINK_WEIGHT));

class Sets { constructor(n) { this.p = Array.from({length: n}, (_, i) => i); } find(i) { while (this.p[i] !== i) { this.p[i] = this.p[this.p[i]]; i = this.p[i]; } return i; } union(a, b) { this.p[this.find(a)] = this.find(b); } }

/** `scenes` in book order (lead scenes in scope). Options: `maxShare` (an id seen in more than this share of scenes is too common to link), `near` (order distance). */
export function buildThreads(scenes, {maxShare = 0.15, near = 6, need = 1} = {}) {
  const n = scenes.length, idx = new Map(scenes.map((s, i) => [s.beat, i])), sets = new Sets(n), edges = {needs: 0, continues: 0, shared: 0, footprint: 0};
  const link = (a, b, kind) => { if (a == null || b == null || a === b || sets.find(a) === sets.find(b)) return; sets.union(a, b); edges[kind]++; };
  scenes.forEach((s, i) => {
    for (const d of s.deps || []) if (d.kind === 'needs') link(i, idx.get(d.id), 'needs');
    if (s.continues) link(i, idx.get(s.continues), 'continues');
  });
  const seen = new Map(), weight = new Map();
  scenes.forEach((s, i) => { for (const t of s.touched || []) if (LINK_KINDS.has(t.kind)) { weight.set(t.id, LINK_WEIGHT[t.kind]); const at = seen.get(t.id) || seen.set(t.id, []).get(t.id); if (at.at(-1) !== i) at.push(i); } });
  const rare = id => (seen.get(id)?.length ?? 0) >= 2 && seen.get(id).length <= Math.max(2, maxShare * n);
  const shared = new Map();
  for (const [id, at] of seen) if (rare(id)) for (let a = 0; a < at.length; a++) for (let b = a + 1; b < at.length && at[b] - at[a] <= near; b++) { const key = `${at[a]}:${at[b]}`; shared.set(key, (shared.get(key) || 0) + weight.get(id)); }
  for (const [key, w] of shared) if (w >= need) { const [a, b] = key.split(':').map(Number); link(a, b, 'shared'); }
  scenes.forEach((s, i) => { const w = s.footprint?.window; if (w && w.fromOffsetDays != null) for (let j = Math.max(0, i - near); j < i; j++) {
    const v = scenes[j].footprint?.window; if (v && v.anchor === w.anchor && v.fromOffsetDays != null && v.toOffsetDays >= w.fromOffsetDays && v.fromOffsetDays <= w.toOffsetDays) link(j, i, 'footprint'); } });
  const groups = new Map(); scenes.forEach((s, i) => { const r = sets.find(i); (groups.get(r) || groups.set(r, []).get(r)).push(i); });
  const threads = [...groups.values()].sort((a, b) => a[0] - b[0]).map(members => {
    const ss = members.map(i => scenes[i]), count = new Map();
    for (const s of ss) for (const id of new Set((s.touched || []).filter(t => LINK_KINDS.has(t.kind)).map(t => t.id))) count.set(id, (count.get(id) || 0) + 1);
    const carried = [...count].filter(([id, c]) => c >= 2 && rare(id)).map(([id]) => id).sort();
    const days = ss.map(s => s.date?.offsetDays).filter(Number.isFinite);
    return {schema: 'event-thread/1', id: `thread:${ss[0].beat}`, beats: ss.map(s => s.beat), size: ss.length,
      window: {firstBeat: ss[0].beat, lastBeat: ss.at(-1).beat, firstDay: days.length ? Math.min(...days) : null, lastDay: days.length ? Math.max(...days) : null, anchors: [...new Set(ss.map(s => s.date?.anchor).filter(Boolean))]},
      participants: [...new Set(ss.flatMap(s => s.present || []))].sort(), carriedIds: carried, motives: [...new Set(ss.flatMap(s => (s.motives || []).map(m => m.tag)))].slice(0, 6), source: 'script'};
  });
  return {threads, threadOfScene: new Map(threads.flatMap(t => t.beats.map(b => [b, t.id]))), edges};
}

const tail = id => String(id).split('.').slice(-1)[0].toLowerCase();
const words = v => new Set(String(v ?? '').toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2));
const names = (card, carriedTail) => { const text = [card.object, ...(card.inputs || []), ...(card.outputs || []), ...(card.gains || []), ...(card.requires || []), ...(card.effects || []).flatMap(e => [e.key, e.fact, e.value])].join(' '); const w = words(text); return [...words(carriedTail)].some(t => w.has(t)); };

/**
 * LSD259 and LSD263. `statusOf(stepId)` is 'clean_fold' for a control; `cardIds` is a Set of step ids with cards. A thread is fully reachable when every step of every beat has a
 * control or a card, and its carried state survives when each carried id is named by at least one card in the thread (a home for it).
 */
export function threadReport(threads, scenes, cards, statusOf, cardIds) {
  const byBeat = new Map(scenes.map(s => [s.beat, s])), cardsByThread = new Map();
  for (const c of cards) (cardsByThread.get(c.threadId) || cardsByThread.set(c.threadId, []).get(c.threadId)).push(c);
  const rows = threads.map(t => {
    const steps = t.beats.flatMap(b => (byBeat.get(b)?.steps || []).map((_, i) => `${b}#${i + 1}`));
    const missing = steps.filter(id => statusOf(id) !== 'clean_fold' && !cardIds.has(id));
    const orders = t.beats.map(b => byBeat.get(b)?.order);
    const ordered = orders.every(Number.isFinite) && orders.every((o, i) => i === 0 || o > orders[i - 1]);
    const tc = cardsByThread.get(t.id) || [];
    const homeless = t.carriedIds.filter(id => !tc.some(c => names(c, tail(id))));
    return {id: t.id, size: t.size, steps: steps.length, missingSteps: missing.length, ordered, carried: t.carriedIds.length, homeless};
  });
  const count = f => rows.filter(f).length, multi = rows.filter(r => r.size > 1);
  return {threads: rows.length, multiBeatThreads: multi.length,
    fullyReachableInOrder: count(r => r.missingSteps === 0 && r.ordered), multiBeatFullyReachableInOrder: multi.filter(r => r.missingSteps === 0 && r.ordered).length,
    carriedStateSurvives: count(r => r.missingSteps === 0 && r.homeless.length === 0), multiBeatCarriedStateSurvives: multi.filter(r => r.missingSteps === 0 && r.homeless.length === 0).length,
    threadsWithCarriedState: count(r => r.carried > 0), threadFoldLossGaps: count(r => r.homeless.length > 0), rows};
}
