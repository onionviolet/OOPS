import {registerDomain} from './domain_registry.js';
import {equipmentDurability as durability, setConditionCap, DURABILITY_PROPOSAL} from './absorb_e2/durability.js';
import {instrumentProfile, improvisedRates, verbNumbers, VERB_LABEL} from './tool_profiles.js';
import {createToolsPanel} from './tools_panel.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';
// Tools domain (IP1-IP3, 2026-10-17). Owns per-instance tool facts that durability does not:
// max condition and repair history, plus one hand-repair job. Condition itself stays in durability.
// Keys are durability instance keys (e2.N), bound the same way prepareEquip binds equipment.
const MAX = DURABILITY_PROPOSAL.maximum;
// Hand repair proposal dials: partial by skill, may fail and cost a little max condition.
export const HAND_REPAIR = Object.freeze({baseRestore: 0.4, restorePerLevel: 0.06, baseChance: 0.55, chancePerLevel: 0.04,
    maxChance: 0.97, failureMaxLoss: 3, maxFloor: 40, baseMinutes: 20, minutesPerPoint: 0.4, materialCount: 1});
let state = null, ports, panel;
const fresh = () => ({schema: 1, instances: {}, job: null});
const INSTANCE = /"e2_instance":"e2\.[1-9]\d*"/;
export function configureToolsDomain(operations) { ports = operations; }
export function toolsState() { return state; }
export function setToolsState(value) { state = value ?? fresh(); }
const facts = key => state.instances[key] ?? {max: MAX, repairs: 0, failures: 0};
export const maxCondition = key => facts(key).max;
setConditionCap(key => state ? maxCondition(key) : MAX);

export function validateTools(slice) {
    if (slice == null) return;
    if (slice.schema !== 1 || typeof slice.instances !== 'object' || Array.isArray(slice.instances)) throw Error('Invalid tools slice.');
    for (const [key, f] of Object.entries(slice.instances)) {
        if (!INSTANCE.test(key) || !Number.isFinite(f?.max) || f.max < 0 || f.max > MAX || !Number.isSafeInteger(f.repairs) || !Number.isSafeInteger(f.failures)) throw Error('Invalid tool instance record.');
    }
    const j = slice.job;
    if (j != null && (!INSTANCE.test(j.key) || !Number.isFinite(j.minutesLeft) || j.minutesLeft < 0 || !Number.isFinite(j.total) || typeof j.location !== 'string' || typeof j.material !== 'string' || !Number.isFinite(j.restore) || !Number.isFinite(j.chance))) throw Error('Invalid tool repair job.');
}

// Gathering hooks. Durability off: gate always passes with no rates and wear is a no-op,
// so native gathering is unchanged (IP2 regression).
function gate({item}) {
    if (!item || !durability.broken(item)) return {ok: true, rates: null};
    const profile = instrumentProfile(item);
    if (!profile) return {ok: true, rates: null};
    const rates = improvisedRates(profile);
    return {ok: true, rates, message: `Your ${item.getName()} is broken. You improvise with ${rates.means}: about ${Math.round(rates.speed * 100)}% speed and fewer finds, without its +${profile.levels} skill. Repair it from Tools.`};
}
function workCycle({item, rates}) {
    if (rates || !item) return {worn: false};
    const profile = instrumentProfile(item);
    if (!profile || !durability.wearUse(item, profile.verb)) return {worn: false};
    panel?.render();
    if (!durability.broken(item)) return {worn: true};
    return {worn: true, broken: true, message: `Your ${item.getName()} breaks. ${VERB_LABEL[profile.verb]} work stops. Start again to improvise at worse rates, or repair it from Tools.`};
}

function toolRows() {
    const actor = ports.actor();
    const items = [...Object.values(actor.getEquipment()), ...Object.values(actor.getItems()).map(e => e.item)];
    return items.filter(item => instrumentProfile(item)).map(item => {
        const key = item.getInventoryKey(), profile = instrumentProfile(item), bound = INSTANCE.test(key);
        return {key, name: item.getName(), slot: item.equip_slot, equipped: actor.getEquipment()[item.equip_slot] === item, bound,
            condition: bound ? durability.condition(key) : MAX, max: bound ? maxCondition(key) : MAX, profile};
    });
}

// MR4/AR7: a quote reads only. No stock, money, condition or draw changes.
export function quoteHandRepair(key) {
    const actor = ports.actor(), item = durability.ownedItem(actor, key), profile = instrumentProfile(item);
    const out = {key, eligible: false, reason: ''};
    if (!profile) return {...out, reason: 'Only a carried or equipped tool can be repaired by hand.'};
    const condition = durability.condition(key), max = maxCondition(key), level = ports.skillLevel(profile.repair.skill);
    const station = ports.stationTier(profile.repair.station), have = ports.count(profile.repair.material);
    const missing = Math.max(0, max - condition);
    const restore = Math.round(missing * Math.min(1, HAND_REPAIR.baseRestore + HAND_REPAIR.restorePerLevel * level) * 100) / 100;
    const chance = Math.min(HAND_REPAIR.maxChance, HAND_REPAIR.baseChance + HAND_REPAIR.chancePerLevel * level);
    const minutes = Math.ceil(HAND_REPAIR.baseMinutes + missing * HAND_REPAIR.minutesPerPoint);
    const q = {...out, name: item.getName(), condition, max, missing, restore, chance, minutes, skill: profile.repair.skill, level,
        station: profile.repair.station, stationTier: station, location: ports.location(), material: profile.repair.material, have, need: HAND_REPAIR.materialCount,
        failure: `On a failed repair the tool keeps its condition and loses ${HAND_REPAIR.failureMaxLoss} max condition.`};
    const blocked = !durability.enabled ? 'Turn on Equipment durability in Settings to track and repair tool wear.'
        : !INSTANCE.test(key) ? 'Equip this tool once with durability on so it has its own condition.'
        : state.job ? 'Finish or cancel the current repair first.'
        : missing <= 0 ? 'This tool is at its best condition.'
        : station < 1 ? `Repair needs a ${profile.repair.station} station. The Village has one.`
        : have < HAND_REPAIR.materialCount ? `Repair needs ${HAND_REPAIR.materialCount} ${profile.repair.material}.`
        : ports.blocked() || '';
    return blocked ? {...q, reason: blocked} : {...q, eligible: true};
}

// One native rollback boundary and one durable save write, as the crafting domain does.
function commit(mutate) {
    const transaction = beginNativeCraftTransaction({owners: ports.itemOwners(), bindings: [{get: () => state, set: setToolsState}]});
    try { mutate(); ports.persist(() => transaction.markDurable()); }
    catch (error) { if (transaction.status === 'pending') transaction.rollback(); throw error; }
    finally { ports.refresh(); }
}
// Execute revalidates (AR7), spends the material and starts a timed bench job inside the
// native transaction boundary, then persists once.
export function executeHandRepair(quoted) {
    const q = quoteHandRepair(quoted.key);
    if (!q.eligible) throw Error(q.reason);
    if (q.material !== quoted.material || q.minutes !== quoted.minutes || q.restore !== quoted.restore) throw Error('The repair changed since its quote. Review it again.');
    ports.assertSpend(q.material);
    commit(() => {
        ports.removeItem(q.material, q.need);
        state = {...state, job: {key: q.key, name: q.name, minutesLeft: q.minutes, total: q.minutes, location: q.location, material: q.material, count: q.need, restore: q.restore, chance: q.chance, skill: q.skill}};
    });
    ports.logMessage(`You start repairing your ${q.name} by hand: ${q.minutes} minutes at the bench.`);
    panel?.render();
    return q;
}
export function cancelHandRepair() {
    if (!state.job) throw Error('No repair is in progress.');
    const job = state.job;
    commit(() => { ports.addItem(job.material, job.count); state = {...state, job: null}; });
    ports.logMessage(`You stop repairing your ${job.name}. The ${job.material} is set back in your pack.`);
    panel?.render();
}
function finishJob(job) {
    const actor = ports.actor(), item = durability.ownedItem(actor, job.key);
    const f = facts(job.key);
    if (!item) { state = {...state, job: null}; ports.logMessage(`The repair ends: your ${job.name} is no longer with you.`); return; }
    const success = ports.random(`tools.repair:${job.key}:${f.repairs + f.failures}`) < job.chance;
    if (success) {
        state = {...state, job: null, instances: {...state.instances, [job.key]: {...f, repairs: f.repairs + 1}}};
        durability.setCondition(job.key, durability.condition(job.key) + job.restore);
        ports.logMessage(`You repair your ${job.name} by hand: condition ${Math.round(durability.condition(job.key))}/${Math.round(f.max)}.`);
    } else {
        const max = Math.max(HAND_REPAIR.maxFloor, f.max - HAND_REPAIR.failureMaxLoss);
        state = {...state, job: null, instances: {...state.instances, [job.key]: {...f, max, failures: f.failures + 1}}};
        durability.setCondition(job.key, durability.condition(job.key));
        ports.logMessage(`The repair goes wrong. Your ${job.name} keeps its condition, and its best condition drops to ${Math.round(max)}.`);
    }
    ports.refresh();
}
function tick(minutes) {
    const job = state?.job;
    if (!job || !ports?.writable()) return;
    // Bench time counts only while you stay at the station's place and do nothing else.
    if (ports.location() !== job.location || !ports.idle()) return;
    const left = Math.max(0, job.minutesLeft - minutes);
    state = {...state, job: {...job, minutesLeft: left}};
    if (left <= 0) finishJob(state.job);
    panel?.render();
}

function occupation() { return state?.job ? `Finish or cancel the ${state.job.name} repair in Tools before starting another activity.` : ''; }

// IP1 projection for the gathering tooltip: verb numbers for the tool in the activity's slot.
function tooltip({item, gained, workingPeriod, levels, rates}) {
    const profile = instrumentProfile(item);
    if (!profile || !gained) return '';
    rates ||= gate({item}).rates;
    const n = verbNumbers(profile, gained, workingPeriod, levels);
    const bound = INSTANCE.test(item.getInventoryKey());
    const condition = durability.enabled && bound ? ` · condition ${Math.round(durability.condition(item))}/${Math.round(maxCondition(item.getInventoryKey()))}` : '';
    if (rates) return `Tool: ${item.getName()} (broken) · improvised with ${rates.means}`;
    return `Tool: ${item.getName()} · ${VERB_LABEL[n.verb]} +${n.levels} levels: speed ×${n.speed}, yield ×${n.yield}, precision ${n.precision}, hardness ${n.hardness}${condition}`;
}

function project(view = 'rows', args) {
    if (view === 'occupation') return occupation();
    if (view === 'tooltip') return tooltip(args);
    return {enabled: durability.enabled, rows: toolRows(), job: state?.job ?? null, blocked: ports.blocked(), location: ports.location()};
}

registerDomain({id: 'tools', deps: [], initialState: () => null,
    save: () => state && (Object.keys(state.instances).length || state.job) ? structuredClone(state) : undefined,
    validate: slice => validateTools(slice),
    // Old saves have no slice: start fresh. No migration (old save compatibility deferred, 2026-10-17).
    migrate: slice => slice == null ? fresh() : structuredClone(slice),
    load: setToolsState, tick,
    commands: {gate, workCycle, quote: quoteHandRepair, execute: executeHandRepair, cancel: cancelHandRepair},
    projection: project,
    refresh: () => panel?.render(),
    panels: [() => { panel = createToolsPanel({read: () => project('rows'), quote: quoteHandRepair, execute: executeHandRepair, cancel: cancelHandRepair, discovered: () => toolRows().length > 0}); }],
});
