import {validateThread} from './vessel_thread.js';
// The player naming act (G6). Naming binds a chosen name, and optionally a relic quality, to ONE gear
// instance (its stable e2 instance id), never to an item_key, because identical items share a stack.
// Save slice `naming` (AR6): {schema:1, used:n, named:{[instanceId]:record}}. Old saves have no slice and
// start empty, which needs no migration. Pure leaf over relic_generator and item_description.
import {generateRelic, seededRandom} from './relic_generator.js';
import {normalizeAffixes} from './gear_affixes.js';
import {addDescriptionClauses} from './item_description.js';

// Opportunities are a dial, not a fixed once: a world sets how many it grants at the start and how
// many more its deeds earn. Reason: naming is a thing a person does when an item has meant something.
export const DEFAULT_NAMING_DIAL = Object.freeze({start: 1, perCrafts: 50, perKills: 500, max: null});
export const WORLD_NAMING_DIALS = Object.freeze({'base.frontier': DEFAULT_NAMING_DIAL});
export const NAME_MAX = 40;
const INSTANCE = /^e2\.[1-9]\d*$/;
const object = v => v && typeof v === 'object' && !Array.isArray(v);

export const emptyNaming = () => ({schema: 1, used: 0, named: {}});
// The live slice, read by the item builder so a reload rebuilds named gear. The naming domain owns writes.
let current = emptyNaming();
export const namingState = () => current;
export const setNamingState = state => { current = state; };

export function cleanName(raw) {
    const name = String(raw ?? '').replace(/\s+/g, ' ').trim();
    if (name.length < 2 || name.length > NAME_MAX) throw Error(`A name needs 2 to ${NAME_MAX} characters.`);
    if (/[<>{}\\\u0000-\u001f\u007f]/.test(name)) throw Error('That name uses characters an item cannot carry.');
    return name;
}

export function opportunities(state, counters = {}, dial = DEFAULT_NAMING_DIAL) {
    const n = v => Number.isFinite(v) && v > 0 ? Math.floor(v) : 0;
    let earned = dial.start + (dial.perCrafts ? Math.floor(n(counters.crafts) / dial.perCrafts) : 0) + (dial.perKills ? Math.floor(n(counters.kills) / dial.perKills) : 0);
    if (dial.max != null) earned = Math.min(earned, dial.max);
    return {earned, used: state.used, available: Math.max(0, earned - state.used)};
}

export function validateNaming(slice) {
    if (slice == null) return emptyNaming();
    if (!object(slice) || slice.schema !== 1 || !Number.isSafeInteger(slice.used) || slice.used < 0 || !object(slice.named)) throw Error('Invalid naming record.');
    const named = {};
    for (const [id, r] of Object.entries(slice.named)) {
        if (!INSTANCE.test(id) || !object(r)) throw Error('Invalid named item.');
        validateThread(r.vesselThread);
        named[id] = {...(r.vesselThread?{vesselThread:structuredClone(r.vesselThread)}:{}),name: cleanName(r.name), tier: String(r.tier || 'named').slice(0, 24),
            uses: Number.isFinite(r.uses) && r.uses >= 0 ? Math.floor(r.uses) : 0, seed: Number.isInteger(r.seed) ? r.seed >>> 0 : 0,
            bestow: normalizeAffixes(r.bestow), clauses: Array.isArray(r.clauses) ? r.clauses.filter(c => c && typeof c.text === 'string' && typeof c.kind === 'string').slice(0, 8) : [], at: Number.isFinite(r.at) ? r.at : 0};
    }
    return {schema: 1, used: slice.used, named};
}

// Quote: what the act would do, for the UI. Execute rechecks it (AR7).
export function quoteNaming(state, {instance, name, uses = 0, armor = false, seed = 0, counters, dial, bestow = true}) {
    const reasons = [];
    if (!INSTANCE.test(instance || '')) reasons.push('Equip the item first; only gear you have carried has an identity of its own.');
    let clean = null; try { clean = cleanName(name); } catch (e) { reasons.push(e.message); }
    const opp = opportunities(state, counters, dial);
    if (opp.available < 1 && !state.named[instance]) reasons.push('No naming opportunity is available yet.');
    const taken = Object.entries(state.named).some(([id, r]) => id !== instance && clean && r.name.toLowerCase() === clean.toLowerCase());
    if (taken) reasons.push('Another item already carries that name.');
    const relic = reasons.length ? null : (bestow ? generateRelic({random: seededRandom(seed), uses, gearClass: armor ? 'armor' : 'other', name: clean}) : {tier: 'named', affixes: [], clauses: [{kind: 'name', text: `Named ${clean}`}]});
    return {eligible: !reasons.length, reason: reasons.join(' '), instance, name: clean, uses, seed, cost: state.named[instance] ? 0 : 1, available: opp.available, relic, rename: !!state.named[instance]};
}

export function executeNaming(state, quote, requote) {
    const again = requote();
    if (!again.eligible) throw Error(again.reason);
    if (JSON.stringify(again) !== JSON.stringify(quote)) throw Error('The naming quote changed. Review it again.');
    const rec = state.named[again.instance];
    // Renaming keeps the first bestowal: the item's story is what earned it, not the new word.
    state.named[again.instance] = {...(rec?.vesselThread?{vesselThread:structuredClone(rec.vesselThread)}:{}),name: again.name, tier: rec?.tier ?? again.relic.tier, uses: rec?.uses ?? again.uses, seed: rec?.seed ?? again.seed,
        bestow: rec?.bestow ?? again.relic.affixes, clauses: rec?.clauses ?? again.relic.clauses, at: rec?.at ?? Date.now()};
    if (!rec) state.used += 1;
    return state.named[again.instance];
}

// Presentation: both the item builder (load) and the panel (live) call this; it is idempotent.
export function applyNamedIdentity(item, record) {
    if (!record) return item;
    if (!item.__baseGetName) item.__baseGetName = item.getName.bind(item);
    item.getName = () => `${record.name} (${item.__baseGetName()})`;
    if (!item.__baseAffixes) item.__baseAffixes = item.affixes || [];
    const merged = normalizeAffixes([...item.__baseAffixes, ...record.bestow]);
    if (merged.length) item.affixes = merged;
    addDescriptionClauses(item, record.clauses.map(c => ({...c, source: c.source || 'naming'})));
    return item;
}
