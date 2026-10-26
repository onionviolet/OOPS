import {registerDomain} from './domain_registry.js';
import {readPort} from './ui_ports.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {calendarMinutes} from './world_rhythm.js';
import {begin, commit, quote as quoteAction, view, settle, validate, HP_SLICE_ID, HP} from './hp_brewing_state.js';
import {createHpBrewingPanel} from './hp_brewing_panel.js';
import {HP_ABRASIVE_PROCESS as ABRASIVE, planNativeHpMaterials, planHpAbrasiveMixture, projectHpIngredientChoices, hpAbrasiveHostWorld} from './hp_ingredient_substitution.js';

// Polyjuice slice host (book.hp pack). The slice owns its state and reads the played
// clock and moon through the `gameTime` UI port (AR4). Optional ORIGINAL native
// solids use the same inventory/envelope transaction; HP keeps its local purse.
let state = null, panel, native;
// Reuse the existing native envelope writer; HP keeps its one registered slice.
export function configureHpBrewingDomain(operations) {
    native = operations;
    panel?.render();
}
const writeReason = () => !native?.persist || !native?.writable?.() ? 'Restore writable saving before using the HP bench.' : null;
function publish(next, summary, materials = []) {
    if(materials.length && (!native?.itemOwners || !native?.removeExact)) throw Error('The native material transaction is not available.');
    const transaction = beginNativeCraftTransaction({owners: materials.length ? native.itemOwners() : [],
        bindings: [{get: () => state, set: value => {state = value;}}]});
    try {
        state = validate(next);
        for(const {key, qty} of materials) {
            if((native.inventory()[key]?.count ?? 0) < qty) throw Error('The exact native stock changed before admission.');
            native.assertSpend(key);
            native.removeExact(key, qty);
        }
        native.persist(() => transaction.markDurable());
    } catch(error) {
        if(transaction.status === 'pending') transaction.rollback();
        throw error;
    } finally { panel?.render(); }
    return {state, summary};
}
function context() {
    const t = readPort('gameTime');
    if(!t) return null;
    return {now: calendarMinutes(t), moon: t.getMoonPhaseName(t.getMoonPhase())};
}
const need = () => context() ?? (() => { throw new Error('The game clock is not ready.'); })();
function nativeHoldings() {
    const inventory = native?.inventory?.() ?? {}, world = native?.world?.(), rows = [];
    for(const [key, held] of Object.entries(inventory)) {
        let id; try {id = JSON.parse(key).id;} catch {continue;}
        if(id !== 'Bonemeal') continue;
        let reason = hpAbrasiveHostWorld(world) ? '' : 'Carry this material into an HP school or trade life first.';
        try {native.assertSpend?.(key);} catch(error) {reason = error.message;}
        rows.push({key, name: 'Bonemeal', count: held.count, custody: 'carried native inventory', available: !reason, reason,
            evidence: {identity: {id, name: 'Bonemeal'}, lot: {id: key, form: 'powdered', custody: 'carried native inventory'}}});
    }
    return rows;
}
const read = () => {
    const c = context(); if(!c) return {begun: false, waiting: true};
    const v = view(state, c);
    if(v.begun) v.substitution = projectHpIngredientChoices({lots: v.lots, nativeHoldings: nativeHoldings()});
    return v;
};
function requestContext(req, c) {
    if(req?.type !== 'brew' || req.method !== ABRASIVE.ref) {
        if(req?.materialInputs?.length) throw Error('Native inputs need the explicit ORIGINAL suspension method; they cannot replace a canonical ingredient by label.');
        return c;
    }
    const localInputs = [];
    for(const [slot, id] of Object.entries(req.slots ?? {})) if(id) {
        if(!HP.formula.slots.some(row => row.id === slot) || !state?.lots[id]) throw Error('Choose a current HP lot in a supported slot.');
        localInputs.push({slot, lot: state.lots[id]});
    }
    if(req.materialInputs?.length && (!native?.inventory || !native?.itemOwners || !native?.removeExact || !native?.assertSpend))
        throw Error('The exact native material transaction is not available.');
    const externalMaterials = planNativeHpMaterials({inputs: req.materialInputs ?? [], inventory: native?.inventory?.(), world: native?.world?.(), assertSpend: native?.assertSpend});
    const abrasivePlan = planHpAbrasiveMixture({localInputs, externalMaterials, process: ABRASIVE.steps,
        apparatus: {station: 'cauldron', carrier: 'water-suspension', application: 'manual-scour'}});
    return {...c, externalMaterials, abrasivePlan};
}
// Prevent partial integration from spending imported stock unless the actual
// state owner retained exactly what it admitted, including paid process terms.
function checkAdmission(next, c) {
    if(!c.abrasivePlan) return;
    const h = next.cauldron.brew?.history;
    if(h?.process !== ABRASIVE.id || h.minutes !== ABRASIVE.minutes ||
        JSON.stringify(h.externalMaterials) !== JSON.stringify(c.externalMaterials) ||
        JSON.stringify(h.abrasivePlan) !== JSON.stringify(c.abrasivePlan))
        throw Error('The current HP process cannot yet retain this suspension and its imported material. Nothing was spent.');
}
export function quote(req) {
    const c = context();
    if(!c) return {eligible: false, reason: 'The game clock is not ready.'};
    const reason = writeReason();
    if(reason) return {eligible: false, reason};
    if(req?.type === 'begin') return state ? {eligible: false, reason: 'The slice is already begun.'} : {eligible: true, summary: 'Set up a bench and a small purse.'};
    if(!state) return {eligible: false, reason: 'Begin the slice first.'};
    try {
        const actual = requestContext(req, c);
        if(actual.abrasivePlan) {
            const out = commit(state, actual, req); checkAdmission(out.state, actual);
            return {eligible: true, summary: 'Pay 1 HP coin for water, use the exact chosen solids, and settle for 20 played minutes. The result is an untested original suspension.'};
        }
        return quoteAction(state, actual, req);
    } catch(error) {return {eligible: false, reason: error.message};}
}
export function execute(req) {
    const c = need(), reason = writeReason();
    if(reason) throw new Error(reason);
    if(req?.type === 'begin') {
        if(state) throw new Error('The slice is already begun.');
        const seed = req.seed ?? globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
        return publish(begin({seed, now: c.now}), 'The Polyjuice slice is set up.');
    }
    if(!state) throw new Error('Begin the slice first.');
    const actual = requestContext(req, c), out = commit(state, actual, req);
    checkAdmission(out.state, actual);
    return publish(out.state, out.summary, actual.externalMaterials ?? []);
}
function tick() {
    const c = state && context();
    if(!c || c.now < state.now) return;
    const before = JSON.stringify(state);
    settle(state, c.now);
    if(JSON.stringify(state) !== before) panel?.render();
}
registerDomain({id: HP_SLICE_ID, initialState: () => null,
    // MR33: a player who never begins keeps byte-identical saves.
    save: () => state ? structuredClone(state) : undefined,
    migrate: slice => slice == null ? null : validate(structuredClone(slice)),
    validate: (slice, envelope) => {
        if(slice == null) return;
        validate(slice);
        const t = envelope?.['current time'];
        if(t && slice.now > calendarMinutes(t)) throw new Error('The Polyjuice slice is ahead of the native calendar.');
    },
    load: slice => { state = slice ?? null; panel?.render(); },
    tick, commands: {quote, execute}, projection: read,
    refresh: () => panel?.render(),
    panels: [() => { panel = createHpBrewingPanel({read, quote, execute}); }],
});
