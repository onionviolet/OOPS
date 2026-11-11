// Story director (STY10, STY11, STY30; shape taken from the RimWorld storyteller decompile, FRC38, numbers not copied, SKR11).
// A pure pacing layer. Candidates are events something ELSE already caused (a deck draw, a dated record); the director chooses which
// of them surface to the player and when. It writes no effects, invents no causes and owns no randomness: every pick is a keyed gen_kit
// draw at address(director id, window, step), so the same seed and clock replay the same run (GR17). It saves nothing: held and
// cooled-down state is derived by replaying the windows in order, like storylet_deck2.js.
//
// Shape (RimWorld F5, STORYTELLER.md): per window, a quiet weight competes with categories; a category is drawn, then a weighted
// eligible candidate inside it; eligibility is rechecked at the moment of surfacing; a category promises no specific candidate.
//   candidate = {id, kind?, category, weight, recheck?: (windowFacts) => boolean, born: window}
//   spec = {id, categories: {name: {weight, hold, tension?, comfort?}}, quiet, tensionQuiet, dry: {after, relief, floor}, cooldown, attempts}
// Dials (default, reason):
//   quiet 3          weight of "nothing surfaces this window"; high tension subtracts `tensionQuiet` (a tense city is not a silent one).
//   category.tension weight multiplier per unit of tension (0..1): pressure grows with it, texture shrinks.
//   category.comfort weight multiplier per unit of comfort (0..1, a long unsurfaced stretch): relief texture comes back after a lull.
//   category.hold    windows a candidate may wait for a later window; 0 means it is of the moment and is lost if not surfaced now.
//   cooldown         windows a surfaced candidate's kind sits out (kind defaults to its id). A rejected recheck spends nothing and starts
//                    no cooldown (RW-D7). category.cooldown overrides it per category. Second world (Gu annex, 2026-11-10): its candidates
//                    are separate occurrences of a few repeating kinds (a daily meal), so cooldown keyed on the instance id never applied.
//   attempts 2       how many candidates may be tried (and rechecked) in one window.
// Fixed points (dated events, canon beats) never pass through here: they surface on their day and are reported beside the receipts.
import {address, drawU32, pickWeighted} from './gen_kit.js';

const SCALE = 1000;
const int = x => Math.max(0, Math.round(x * SCALE));
const kindOf = c => c.kind ?? c.id;
const clamp01 = x => Math.min(1, Math.max(0, Number.isFinite(x) ? x : 0));

export function validateDirector(spec) {
    const bad = m => { throw Error(`Invalid story director (${spec?.id}): ${m}`); };
    if(!spec || typeof spec.id !== 'string' || !spec.id) bad('needs an id');
    if(!(spec.quiet >= 0) || !(spec.tensionQuiet >= 0) || !Number.isInteger(spec.cooldown) || spec.cooldown < 0 || !Number.isInteger(spec.attempts) || spec.attempts < 1) bad('quiet, cooldown or attempts');
    if(!spec.dry || !Number.isInteger(spec.dry.after) || !(spec.dry.relief > 0 && spec.dry.relief <= 1) || !(spec.dry.floor >= 0 && spec.dry.floor <= 1)) bad('dry');
    const names = Object.keys(spec.categories || {});
    if(!names.length) bad('needs categories');
    for(const n of names) {
        const c = spec.categories[n];
        if(!(c.weight >= 0) || !Number.isInteger(c.hold) || c.hold < 0 || c.cooldown !== undefined && !(Number.isInteger(c.cooldown) && c.cooldown >= 0) || !/^[a-z][a-z0-9_]*$/.test(n)) bad(`category ${n}`);
    }
    return spec;
}
// 0..1 "how long since anything surfaced", read from the dry streak: zero until `after`, then rising to one at twice that.
export const comfortOf = (spec, dry) => clamp01((dry - spec.dry.after) / Math.max(1, spec.dry.after));
export const quietWeight = (spec, tension, dry) => Math.max(0, spec.quiet * (1 - spec.tensionQuiet * clamp01(tension))
    * (dry > spec.dry.after ? Math.max(spec.dry.floor, spec.dry.relief ** (dry - spec.dry.after)) : 1));
export const categoryWeight = (spec, name, tension, comfort) => {
    const c = spec.categories[name];
    return c.weight * Math.max(0, 1 + (c.tension ?? 0) * clamp01(tension)) * Math.max(0, 1 + (c.comfort ?? 0) * clamp01(comfort));
};

// One window. `pool` is every unspent candidate the director may consider (held ones and this window's births), already in the
// caller's deterministic order. Returns the receipt and the surfaced candidate (or null).
export function directWindow(spec, seed, window, pool, {tension = 0, dry = 0, last = {}, facts = {}} = {}) {
    const comfort = comfortOf(spec, dry), receipt = {window, tension: clamp01(tension), comfort, quiet: 0, categories: [], tried: [], rejected: [], surfaced: null, reason: ''};
    const cooling = c => { const at = last[kindOf(c)], cd = spec.categories[c.category]?.cooldown ?? spec.cooldown; return at !== undefined && window - at < cd; };
    const live = pool.filter(c => spec.categories[c.category] && !cooling(c) && c.weight > 0);
    const names = [...new Set(live.map(c => c.category))].sort();
    const quiet = quietWeight(spec, tension, dry);
    receipt.quiet = quiet;
    receipt.categories = names.map(n => ({category: n, weight: categoryWeight(spec, n, tension, comfort)}));
    if(!live.length) { receipt.reason = 'nothing eligible'; return {receipt, surfaced: null}; }
    const rejected = new Set();
    for(let step = 0; step < spec.attempts; step++) {
        const open = live.filter(c => !rejected.has(c.id)), cats = [...new Set(open.map(c => c.category))].sort();
        if(!cats.length) break;
        const rows = [{id: '~quiet', kind: 'quiet'}, ...cats.map(n => ({id: n, kind: 'category'}))];
        const pickedCat = pickWeighted(rows, r => r.kind === 'quiet' ? {weight: int(quiet), reason: 'quiet'} : {weight: int(categoryWeight(spec, r.id, tension, comfort)), reason: 'category'},
            drawU32(seed, address(spec.id, window, step, 'category')));
        if(!pickedCat.value || pickedCat.value.kind === 'quiet') { receipt.reason = pickedCat.value ? 'quiet window' : 'zero weight'; return {receipt, surfaced: null}; }
        const inCat = open.filter(c => c.category === pickedCat.value.id);
        const item = pickWeighted(inCat, c => ({weight: int(c.weight), reason: 'candidate'}), drawU32(seed, address(spec.id, window, step, 'item', pickedCat.value.id)));
        const chosen = item.value;
        if(!chosen) break;
        receipt.tried.push(chosen.id);
        if(chosen.recheck && !chosen.recheck(facts)) { rejected.add(chosen.id); receipt.rejected.push({id: chosen.id, why: 'no longer fits'}); continue; }
        receipt.surfaced = chosen.id; receipt.reason = `${pickedCat.value.id} drawn`;
        return {receipt, surfaced: chosen};
    }
    receipt.reason = receipt.rejected.length ? 'every try failed its recheck' : 'nothing surfaced';
    return {receipt, surfaced: null};
}

const runs = new Map();
// The director's run over windows [0..upto]. `born(window)` returns that window's new candidates (caused elsewhere); `factsAt(window)` is
// {tension, ...facts for rechecks} and must be a pure function of the window. Memoised per (seed, spec id, signature) and extended.
export function runDirector(spec, seed, upto, born, factsAt, signature = '') {
    const key = `${seed}|${spec.id}|${signature}`;
    let run = runs.get(key);
    if(!run) { run = {out: [], held: [], last: {}, dry: 0}; runs.set(key, run); if(runs.size > 16) runs.delete(runs.keys().next().value); }
    while(run.out.length <= upto) {
        const w = run.out.length, f = factsAt(w);
        run.held = run.held.filter(c => w - c.born <= spec.categories[c.category].hold);
        const pool = [...run.held, ...born(w).map(c => ({...c, born: w}))];
        const {receipt, surfaced} = directWindow(spec, seed, w, pool, {tension: f.tension, dry: run.dry, last: run.last, facts: f});
        if(surfaced) receipt.late = surfaced.born < w;
        if(surfaced) { run.last[kindOf(surfaced)] = w; run.dry = 0; run.held = run.held.filter(c => c.id !== surfaced.id); } else run.dry++;
        const held = new Set(run.held.map(c => c.id));
        // A candidate not surfaced is kept only while its category allows waiting; the rest are lost with the window.
        for(const c of pool) if(c.id !== surfaced?.id && !held.has(c.id) && c.born === w && spec.categories[c.category]?.hold > 0) run.held.push(c);
        run.out.push({window: w, surfaced: surfaced ? {id: surfaced.id, born: surfaced.born, category: surfaced.category} : null, receipt});
    }
    return run.out.slice(0, upto + 1);
}
// Plain-words reading of a receipt for the player's "why now" line: no weights, no codes (PRS). `words` is the world's own wording
// (a city, an annex, a ship): the defaults are Tingen's. Finding from the second world (Gu annex, 2026-11-10): the reading hard-coded
// "the city", so a world without one needs its own lines; the receipt fields read are unchanged.
export const WHY_WORDS = Object.freeze({tense: 'The city is on edge, so this is what stands out.', lull: 'It has been quiet for a while, so this catches your eye.',
    calm: 'Nothing else competed for your attention.', late: 'It had been waiting for the right moment.'});
export function whyLine(receipt, words = WHY_WORDS) {
    if(!receipt?.surfaced) return '';
    const w = {...WHY_WORDS, ...words}, late = receipt.late ? ` ${w.late}` : '';
    if(receipt.tension > 0.5) return `${w.tense}${late}`;
    if(receipt.comfort > 0.5) return `${w.lull}${late}`;
    return `${w.calm}${late}`;
}
