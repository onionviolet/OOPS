import {registerDomain} from './domain_registry.js';
import {equipmentDurability as durability, setConditionCap, DURABILITY_PROPOSAL} from './absorb_e2/durability.js';
import {instrumentProfile, improvisedRates, verbNumbers, VERB_LABEL, repairRequirements, REPAIR_BANDS} from './tool_profiles.js';
import {createToolsPanel,toolsPanelDiscovered} from './tools_panel.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {lamplightPresentation,LAMP,OIL,FLASK_MINUTES} from './lamplight_domain.js';
// Tools domain (IP1-IP3, 2026-10-17). Owns per-instance tool facts that durability does not:
// max condition and repair history, plus one repair job. Condition itself stays in durability and
// stays one scalar (the tool's body; layered repair is a later phase).
// Keys are durability instance keys (e2.N), bound the same way prepareEquip binds equipment.
const MAX = DURABILITY_PROPOSAL.maximum;
let state = null, ports, panel;
const fresh = () => ({schema: 1, instances: {}, job: null});
const INSTANCE = /"e2_instance":"e2\.[1-9]\d*"/;
// Composition supplies each domain's ports directly; Tools owns its panel refresh.
export function configureToolsDomain(operations) { ports = operations; }
export function refreshToolsPanel() { panel?.render(); }
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
    if (j != null && (!INSTANCE.test(j.key) || typeof j.kind !== 'string' || !Number.isFinite(j.minutesLeft) || j.minutesLeft < 0 || !Number.isFinite(j.total) || typeof j.location !== 'string'
        || !Array.isArray(j.spent) || j.spent.some(m => typeof m?.id !== 'string' || !Number.isSafeInteger(m.count) || m.count < 1)
        || !Number.isFinite(j.restore) || !Number.isFinite(j.chance) || !Number.isFinite(j.failureLoss) || !Number.isFinite(j.floor))) throw Error('Invalid tool repair job.');
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
// Inputs guide rather than refuse: each requirement is shown met or short, and short inputs
// lower the result band. Only the state of the tool or the player (busy, no instance) stops a quote.
export function quoteRepair({kind = 'hand', key} = {}) {
    const actor = ports.actor(), item = durability.ownedItem(actor, key), profile = instrumentProfile(item);
    const out = {kind, key, eligible: false, reason: '', inputs: []};
    if (!profile) return {...out, reason: 'Only a carried or equipped tool can be repaired.'};
    const req = repairRequirements(kind, profile);
    if (!req) return {...out, name: item.getName(), reason: `Nobody here knows a ${kind} repair for this tool.`};
    if (req.claim) return {...out, name: item.getName(), reason: `Nobody here knows how: ${req.claim.belief} (${req.claim.basis}).`};
    const condition = durability.condition(key), max = maxCondition(key), missing = Math.max(0, max - condition);
    const level = ports.skillLevel(req.skill), tier = ports.stationTier(req.station.tag), B = REPAIR_BANDS;
    const skillGap = Math.max(0, req.level - level), stationShort = tier < req.station.tier;
    const materials = req.materials.map(m => ({...m, have: ports.count(m.id)}));
    const supplied = materials.length ? Math.min(...materials.map(m => Math.min(1, m.have / m.count))) : 1;
    let restoreShare = Math.min(1, B.restore.base + B.restore.perLevel * level), chance = B.chance.base + B.chance.perLevel * level, failureLoss = req.failure.maxLoss;
    restoreShare *= Math.max(0.25, 1 - B.short.skill.restore * skillGap); chance -= B.short.skill.chance * skillGap;
    if (stationShort) { restoreShare *= B.short.station.restore; chance -= B.short.station.chance; failureLoss *= B.short.station.lossFactor; }
    restoreShare *= 1 - B.short.material.restore * (1 - supplied); chance -= B.short.material.chance * (1 - supplied);
    chance = Math.round(Math.min(B.chance.max, Math.max(B.chance.min, chance)) * 100) / 100;
    const restore = Math.round(missing * restoreShare * 100) / 100;
    const minutes = Math.ceil(req.minutes.base + missing * req.minutes.perPoint);
    const inputs = [
        {input: 'skill', label: `${req.skill} level ${level} of ${req.level}`, met: skillGap === 0},
        {input: 'station', label: `${req.station.tag} station tier ${tier} of ${req.station.tier} here`, met: !stationShort},
        ...materials.map(m => ({input: 'material', label: `${m.id}: ${m.have} of ${m.count}`, met: m.have >= m.count})),
    ];
    const spent = materials.map(m => ({id: m.id, count: Math.min(m.have, m.count)})).filter(m => m.count > 0);
    const q = {...out, name: item.getName(), condition, max, missing, restore, chance, failureLoss, floor: req.failure.floor, minutes,
        skill: req.skill, level, location: ports.location(), inputs, spent,
        failure: `A failed repair keeps condition and lowers best condition by ${failureLoss} (not below ${req.failure.floor}).`};
    const blocked = !durability.enabled ? 'Turn on Equipment durability in Settings to track and repair tool wear.'
        : !INSTANCE.test(key) ? 'Equip this tool once with durability on so it has its own condition.'
        : state.job ? 'Finish or cancel the current repair first.'
        : missing <= 0 ? 'This tool is at its best condition.'
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
// Execute revalidates (AR7), spends what the quote said and starts a timed job inside the
// native transaction boundary, then persists once.
export function executeRepair(quoted) {
    const q = quoteRepair({kind: quoted.kind, key: quoted.key});
    if (!q.eligible) throw Error(q.reason);
    if (JSON.stringify([q.spent, q.minutes, q.restore, q.chance, q.failureLoss]) !== JSON.stringify([quoted.spent, quoted.minutes, quoted.restore, quoted.chance, quoted.failureLoss])) throw Error('The repair changed since its quote. Review it again.');
    for (const m of q.spent) ports.assertSpend(m.id);
    commit(() => {
        for (const m of q.spent) ports.removeItem(m.id, m.count);
        state = {...state, job: {kind: q.kind, key: q.key, name: q.name, minutesLeft: q.minutes, total: q.minutes, location: q.location, spent: q.spent,
            restore: q.restore, chance: q.chance, failureLoss: q.failureLoss, floor: q.floor, skill: q.skill}};
    });
    ports.logMessage(`You start repairing your ${q.name} by hand: ${q.minutes} minutes${q.inputs.every(i => i.met) ? '' : ', making do with what is short'}.`);
    panel?.render();
    return q;
}
export function cancelRepair() {
    if (!state.job) throw Error('No repair is in progress.');
    const job = state.job;
    commit(() => { for (const m of job.spent) ports.addItem(m.id, m.count); state = {...state, job: null}; });
    ports.logMessage(`You stop repairing your ${job.name}.${job.spent.length ? ' Unused materials go back in your pack.' : ''}`);
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
        const max = Math.max(Math.min(f.max, job.floor), f.max - job.failureLoss);
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
    const lamp=lamplightPresentation();
    return {enabled: durability.enabled, rows: toolRows(), job: state?.job ?? null, blocked: ports.blocked(), location: ports.location(), idle: ports.idle(),
        lamp:{...lamp,name:LAMP,oilName:OIL,baseline:FLASK_MINUTES,packFlasks:ports.count(OIL),rate:lamp.shining?{value:-1,unit:'lamp min per played min'}:null}};
}

registerDomain({id: 'tools', deps: [], initialState: () => null,
    save: () => state && (Object.keys(state.instances).length || state.job) ? structuredClone(state) : undefined,
    validate: slice => validateTools(slice),
    // Old saves have no slice: start fresh. No migration (old save compatibility deferred, 2026-10-17).
    migrate: slice => slice == null ? fresh() : structuredClone(slice),
    load: value=>{setToolsState(value);panel?.reset();}, tick,
    commands: {gate, workCycle, quote: quoteRepair, execute: executeRepair, cancel: cancelRepair},
    projection: project,
    refresh: () => panel?.render(),
    panels: [() => { panel = createToolsPanel({read: () => project('rows'), quote: quoteRepair, execute: executeRepair, cancel: cancelRepair, discovered: () => toolsPanelDiscovered(toolRows(),lamplightPresentation())}); }],
});
