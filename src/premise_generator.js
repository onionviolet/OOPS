// G2 slice 2: seeded start premises on top of resolveStart (no new resolver). A premise is one more start axis whose layers are
// ordinary, odd, villain or funny openings. Pure. FND1: address shape [world.id, revision, seed, 'premise'] (via resolveStart's own keying);
// reader: offerPremises / premiseWorld; tests: tests/premise_generator.test.js; budget: O(layers).
import {resolveStart} from './start_records.js';
import {keyedUnitFor} from './keyed_generation.js';

export const TONES = Object.freeze(['ordinary', 'odd', 'villain', 'funny']);
// Default with a dial and a reason (AD5): how strongly each tone is drawn. 0 turns a tone off for a world that has no room for it;
// raising it makes that world lean into villain or funny openings. Ordinary always keeps weight so a plain start stays reachable.
export const TONE_DIAL = Object.freeze({ordinary: 1, odd: 1, villain: 0.5, funny: 0.5});

const weighted = (layer, dial) => (layer.weight ?? 1) * (dial[layer.tone] ?? 1);

// The world with a 'premise' axis appended. Existing axes and their draws are untouched (resolveStart keys each axis by name).
export function premiseWorld(world, premises, dial = TONE_DIAL) {
    if(world.axes.includes('premise')) return world;
    return {...world, axes: [...world.axes, 'premise'], layers: {...world.layers,
        premise: premises.map(p => ({...p, weight: weighted(p, dial)}))}};
}

// A short offer list for a new life or a crossing: distinct premises, at most one per tone, seeded and repeatable.
// Returns [{id, tone, line}] ordered by draw. An offer never fills a tone whose dial is 0.
export function offerPremises({world, premises, seed, count = 3, dial = TONE_DIAL}) {
    const byTone = new Map();
    for(const p of premises) if((dial[p.tone] ?? 1) > 0) (byTone.get(p.tone) ?? byTone.set(p.tone, []).get(p.tone)).push(p);
    const picks = [...byTone].map(([tone, list]) => {
        const scored = list.map(p => ({p, s: keyedUnitFor(String(seed).length ? hashSeed(seed) : 1, 'text', ['premise', world.id, p.id]) * weighted(p, dial)}));
        scored.sort((a, b) => b.s - a.s || (a.p.id < b.p.id ? -1 : 1));
        return {p: scored[0].p, tone, s: scored[0].s * (dial[tone] ?? 1)};
    });
    picks.sort((a, b) => b.s - a.s || (a.p.id < b.p.id ? -1 : 1));
    const plain = picks.find(x => x.tone === 'ordinary');
    const chosen = picks.slice(0, count);
    if(plain && !chosen.includes(plain)) chosen[chosen.length - 1] = plain;
    return chosen.map(({p}) => ({id: p.id, tone: p.tone, line: p.patch.text[0]}));
}
function hashSeed(seed) {let h = 2166136261; for(const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; return h;}

// Begin with a chosen premise: lock the axis and let resolveStart do the rest, so conflicts and needs behave as for any start.
export const resolveWithPremise = (world, premises, seed, premiseId, choices = {}, dial = TONE_DIAL) =>
    resolveStart(premiseWorld(world, premises, dial), {...choices, premise: premiseId ? {mode: 'lock', layerId: premiseId} : {mode: 'roll'}}, seed);
