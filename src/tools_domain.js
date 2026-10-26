import {registerDomain} from './domain_registry.js';
import {equipmentDurability as durability, setConditionCap, DURABILITY_PROPOSAL} from './absorb_e2/durability.js';
import {instrumentProfile, improvisedRates, verbNumbers, VERB_LABEL, repairRequirements, REPAIR_BANDS, VILLAGE_CRACK} from './tool_profiles.js';
import {createToolsPanel,toolsPanelDiscovered} from './tools_panel.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {lamplightPresentation,LAMP,OIL,FLASK_MINUTES} from './lamplight_domain.js';
// Tools domain (IP1-IP3, 2026-10-17). Owns per-instance tool facts that durability does not:
// max condition, repair history and optional typed damage, plus one repair job.
// Scalar wear stays in durability; layered repair remains deferred.
// Keys are durability instance keys (e2.N), bound the same way prepareEquip binds equipment.
const MAX = DURABILITY_PROPOSAL.maximum;
let state = null, ports, panel;
const fresh = () => ({schema: 1, instances: {}, job: null});
const INSTANCE = /"e2_instance":"e2\.[1-9]\d*"/;
// Composition supplies each domain's ports directly; Tools owns its panel refresh.
export function configureToolsDomain(operations) { ports = operations; }
export function refreshToolsPanel() { panel?.render(); }
export function rekeyToolFacts(from, to) {
    if(!state) return;
    if(state.job?.key === from) throw Error('Finish the current tool repair before reworking it.');
    if(!state.instances[from]) return;
    const instances = {...state.instances};
    if(to) instances[to] = instances[from];
    delete instances[from]; state = {...state, instances};
}
export function toolsState() { return state; }
export function setToolsState(value) { state = value ?? fresh(); }
const facts = key => state.instances[key] ?? {max: MAX, repairs: 0, failures: 0};
const targetFacts = key => {
    const f = facts(key);
    return {condition: durability.condition(key), max: f.max, repairs: f.repairs, failures: f.failures,
        uses: durability.uses(key), revision: f.revision ?? 0};
};
const sameTarget = (a, b) => ['condition', 'max', 'repairs', 'failures', 'uses', 'revision'].every(k => (a[k] ?? 0) === (b[k] ?? 0));
export const maxCondition = key => facts(key).max;
setConditionCap(key => state ? maxCondition(key) : MAX);

export function validateTools(slice) {
    if (slice == null) return;
    if (slice.schema !== 1 || typeof slice.instances !== 'object' || Array.isArray(slice.instances)) throw Error('Invalid tools slice.');
    for (const [key, f] of Object.entries(slice.instances)) {
        if (!INSTANCE.test(key) || !Number.isFinite(f?.max) || f.max < 0 || f.max > MAX || !Number.isSafeInteger(f.repairs) || !Number.isSafeInteger(f.failures)) throw Error('Invalid tool instance record.');
    }
    for (const f of Object.values(slice.instances)) {
        if ((f.revision != null && (!Number.isSafeInteger(f.revision) || f.revision < 0))
            || (f.leverNext != null && typeof f.leverNext !== 'boolean')
            || (f.damage != null && (f.damage.type !== 'crack' || f.damage.cause !== VILLAGE_CRACK.cause || typeof f.damage.diagnosed !== 'boolean'))
            || (f.damage && f.leverNext)) throw Error('Invalid typed tool damage.');
    }
    const j = slice.job;
    if (j && ((j.repairDamage != null && (j.repairDamage !== 'crack' || j.restore !== 0))
        || (j.target?.revision != null && (!Number.isSafeInteger(j.target.revision) || j.target.revision < 0)))) throw Error('Invalid typed repair binding.');
    if (j != null && (!INSTANCE.test(j.key) || typeof j.kind !== 'string' || !Number.isFinite(j.minutesLeft) || j.minutesLeft < 0 || !Number.isFinite(j.total) || typeof j.location !== 'string'
        || !Array.isArray(j.spent) || j.spent.some(m => typeof m?.id !== 'string' || !Number.isSafeInteger(m.count) || m.count < 1)
        || !Number.isFinite(j.restore) || !Number.isFinite(j.chance) || !Number.isFinite(j.failureLoss) || !Number.isFinite(j.floor))) throw Error('Invalid tool repair job.');
    if (j && (j.total <= 0 || j.minutesLeft > j.total || j.restore < 0 || j.chance < 0 || j.chance > 1 || j.failureLoss < 0
        || (j.lastClock != null && (!Number.isFinite(j.lastClock) || j.lastClock < 0))
        || (j.target != null && (!Number.isFinite(j.target.condition) || j.target.condition < 0 || j.target.condition > j.target.max
            || !Number.isFinite(j.target.max) || j.target.max < 0 || j.target.max > MAX
            || !['repairs', 'failures', 'uses'].every(k => Number.isSafeInteger(j.target[k]) && j.target[k] >= 0))))) throw Error('Invalid tool repair binding.');
}

// Gathering hooks. Durability off: gate always passes with no rates and wear is a no-op,
// so native gathering is unchanged (IP2 regression).
function gate({item}) {
    if (!item || !durability.enabled) return {ok: true, rates: null};
    if (!durability.broken(item)) {
        if (state && facts(item.getInventoryKey()).damage) return {ok: true, rates: {...VILLAGE_CRACK.rates},
            message: `Your ${item.getName()}'s head shifts under load. You work with short, careful strokes: ${Math.round(VILLAGE_CRACK.rates.speed * 100)}% speed and ${Math.round(VILLAGE_CRACK.rates.yield * 100)}% find chance. Inspect it at the Village forge.`};
        return {ok: true, rates: null};
    }
    const profile = instrumentProfile(item);
    if (!profile) return {ok: true, rates: null};
    const rates = improvisedRates(profile);
    return {ok: true, rates, message: `Your ${item.getName()} is broken. You improvise with ${rates.means}: about ${Math.round(rates.speed * 100)}% speed and fewer finds, without its +${profile.levels} skill. Repair it from Tools.`};
}
function workCycle({item, rates}) {
    if (!item || (rates && (!state || !facts(item.getInventoryKey()).damage || durability.broken(item)))) return {worn: false};
    const profile = instrumentProfile(item);
    if (!profile || !durability.wearUse(item, profile.verb)) return {worn: false};
    const key = item.getInventoryKey(), f = state && facts(key);
    // Same native completed-round boundary as scalar wear, no extra clock or draw.
    if (f?.leverNext && profile.id === VILLAGE_CRACK.tool && (!ports.world || ports.world() === 'base.frontier')) {
        const {leverNext, ...rest} = f;
        state = {...state, instances: {...state.instances, [key]: {...rest, revision: (f.revision ?? 0) + 1,
            damage: {type: 'crack', cause: VILLAGE_CRACK.cause, diagnosed: false}}}};
        panel?.render();
        // Native host consumes `broken` as the existing stop-work signal, not a condition write.
        return {worn: true, broken: true, message: `You pry the wedged stone free. Your ${item.getName()}'s head shifts under the sideways load. Work stops; inspect it at the Village forge before trusting it.`};
    }
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
            condition: bound ? durability.condition(key) : MAX, max: bound ? maxCondition(key) : MAX, profile,
            diagnosis: bound && facts(key).damage?.diagnosed ? 'Crack in the pickaxe head' : '',
            leverNext: bound && facts(key).leverNext === true,
            actions: bound && profile.id === VILLAGE_CRACK.tool ? ['inspect', facts(key).leverNext ? 'cancelLever' : 'lever'].map(action => quoteToolAction({key, action})) : []};
    });
}

// TQ199 uses the existing native transaction boundary. Inspection records knowledge,
// never invents damage. Quotes expose observed diagnosis and an opaque revision only.
export function quoteToolAction({key, action} = {}) {
    const item = durability.ownedItem(ports.actor(), key), f = state && facts(key), D = VILLAGE_CRACK.diagnosis;
    const q = {key, action, eligible: false, reason: '', revision: f?.revision ?? 0};
    let custody = '';
    try { ports.assertSpend(key); } catch (error) { custody = error.message; }
    const reason = !ports.writable() ? 'This game does not own the writable save.'
        : custody || (!item || instrumentProfile(item)?.id !== VILLAGE_CRACK.tool ? 'This use needs your Iron pickaxe copy.'
        : !['inspect', 'lever', 'cancelLever'].includes(action) ? 'Unknown tool action.'
        : !durability.enabled ? 'Turn on Equipment durability to track tool damage.'
        : !INSTANCE.test(key) ? 'Equip this tool once with durability on.'
        : state.job ? 'Finish or cancel the current repair first.'
        : ports.location() !== 'Village' || (ports.world && ports.world() !== 'base.frontier') ? 'Prepare or inspect this tool at the Village forge.'
        : !ports.idle() ? 'Stop your activity before handling this tool.'
        : ports.blocked() || (action === 'lever' && (ports.actor().getEquipment().pickaxe !== item || durability.broken(item)) ? 'Equip a working Iron pickaxe first.'
        : action === 'lever' && (f.leverNext || f.damage?.diagnosed) ? 'Cancel the planned use or repair the diagnosed head first.'
        : action === 'cancelLever' && !f.leverNext ? 'No prying use is planned for this copy.' : ''));
    // Unknown damaged copies give no diagnostic eligibility clue.
    return {...q, ...(action === 'inspect' ? {means: `${D.skill} ${D.level} and a tier-${D.tier} ${D.station} station`,
        fitting: ports.skillLevel(D.skill) >= D.level && ports.stationTier(D.station) >= D.tier} : {}),
        eligible: !reason, reason};
}
export function executeToolAction(quoted) {
    const q = quoteToolAction(quoted);
    if (!q.eligible) throw Error(q.reason);
    if (JSON.stringify(q) !== JSON.stringify(quoted)) throw Error('The tool action changed. Review it again.');
    let message;
    commit(() => {
        const f = facts(q.key), next = {...f, revision: (f.revision ?? 0) + 1};
        if (q.action === 'lever') {
            // Repeated stress on an unknown existing crack does not replace it.
            if (!f.damage) next.leverNext = true;
            message = f.damage ? 'The head shifts as you check your grip. Inspect it before prying again.'
                : 'On the next mining round with this copy, you will use it to pry a wedged stone. Sideways load can damage the head. You can cancel this plan in Tools.';
        } else if (q.action === 'cancelLever') {
            delete next.leverNext;
            message = 'You cancel the planned prying use. The tool is unchanged.';
        } else if (!q.fitting) message = `You cannot judge the head with these means. A fitting inspection uses ${q.means}.`;
        else if (f.damage) {
            next.damage = {...f.damage, diagnosed: true};
            message = 'At the forge you find a crack in the pickaxe head. Hand repair can close it; ordinary wear is separate.';
        } else message = 'You inspect the pickaxe head at the forge and find no crack.';
        state = {...state, instances: {...state.instances, [q.key]: next}};
    });
    ports.logMessage(message); panel?.render(); return message;
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
    const repairDamage = facts(key).damage?.diagnosed ? 'crack' : null;
    const restore = repairDamage ? 0 : Math.round(missing * restoreShare * 100) / 100;
    const minutes = Math.ceil(req.minutes.base + (repairDamage ? 0 : missing) * req.minutes.perPoint);
    const inputs = [
        {input: 'skill', label: `${req.skill} level ${level} of ${req.level}`, met: skillGap === 0},
        {input: 'station', label: `${req.station.tag} station tier ${tier} of ${req.station.tier} here`, met: !stationShort},
        ...materials.map(m => ({input: 'material', label: `${m.id}: ${m.have} of ${m.count}`, met: m.have >= m.count})),
    ];
    const spent = materials.map(m => ({id: m.id, count: Math.min(m.have, m.count)})).filter(m => m.count > 0);
    const q = {...out, name: item.getName(), condition, max, missing, target: targetFacts(key), restore, chance, failureLoss, floor: req.failure.floor, minutes,
        skill: req.skill, level, location: ports.location(), inputs, spent, ...(repairDamage ? {repairDamage} : {}),
        failure: `A failed repair keeps condition and lowers best condition by ${failureLoss} (not below ${req.failure.floor}).`};
    let custody = '';
    try { ports.assertSpend(key); } catch (error) { custody = error.message; }
    const blocked = !ports.writable() ? 'This game does not own the writable save.'
        : custody || (!durability.enabled ? 'Turn on Equipment durability in Settings to track and repair tool wear.'
        : !INSTANCE.test(key) ? 'Equip this tool once with durability on so it has its own condition.'
        : state.job ? 'Finish or cancel the current repair first.'
        : missing <= 0 && !repairDamage ? 'This tool is at its best condition.'
        : ports.blocked() || '');
    return blocked ? {...q, reason: blocked} : {...q, eligible: true};
}

// One native rollback boundary and one durable save write, as the crafting domain does.
function commit(mutate) {
    const transaction = beginNativeCraftTransaction({owners: ports.itemOwners(), bindings: [
        {get: () => state, set: setToolsState},
        {get: () => durability.serialize(), set: value => durability.load(value)},
    ]});
    try { mutate(); ports.persist(() => transaction.markDurable()); }
    catch (error) { if (transaction.status === 'pending') transaction.rollback(); throw error; }
    finally { ports.refresh(); }
}
// Execute revalidates (AR7), spends what the quote said and starts a timed job inside the
// native transaction boundary, then persists once.
export function executeRepair(quoted) {
    const q = quoteRepair({kind: quoted.kind, key: quoted.key});
    if (!q.eligible) throw Error(q.reason);
    if (JSON.stringify(q) !== JSON.stringify(quoted)) throw Error('The repair changed since its quote. Review it again.');
    for (const m of q.spent) ports.assertSpend(m.id);
    commit(() => {
        for (const m of q.spent) ports.removeItem(m.id, m.count);
        state = {...state, job: {kind: q.kind, key: q.key, name: q.name, minutesLeft: q.minutes, total: q.minutes, location: q.location, spent: q.spent,
            restore: q.restore, chance: q.chance, failureLoss: q.failureLoss, floor: q.floor, skill: q.skill,
            target: q.target, ...(q.repairDamage ? {repairDamage: q.repairDamage} : {}), ...(ports.clock ? {lastClock: ports.clock()} : {})}};
    });
    ports.logMessage(`You start repairing your ${q.name} by hand: ${q.minutes} minutes${q.inputs.every(i => i.met) ? '' : ', making do with what is short'}.`);
    panel?.render();
    return q;
}
export function cancelRepair() {
    if (!state.job) throw Error('No repair is in progress.');
    if (!ports.writable()) throw Error('This game does not own the writable save.');
    const job = state.job;
    commit(() => { for (const m of job.spent) ports.addItem(m.id, m.count); state = {...state, job: null}; });
    ports.logMessage(`You stop repairing your ${job.name}.${job.spent.length ? ' Unused materials go back in your pack.' : ''}`);
    panel?.render();
}
// Resolve inside commit; publish the message only after the durable write.
function finishJob(job) {
    const actor = ports.actor(), item = durability.ownedItem(actor, job.key);
    const f = facts(job.key);
    if (!item) { state = {...state, job: null}; return `The repair ends: your ${job.name} is no longer with you.`; }
    const success = ports.random(`tools.repair:${job.key}:${f.repairs + f.failures}`) < job.chance;
    if (success) {
        const next = {...f, repairs: f.repairs + 1};
        if (job.repairDamage === 'crack') { delete next.damage; next.revision = (f.revision ?? 0) + 1; }
        state = {...state, job: null, instances: {...state.instances, [job.key]: next}};
        durability.setCondition(job.key, durability.condition(job.key) + job.restore);
        if (job.repairDamage === 'crack') return `You close the crack in your ${job.name}'s head. Ordinary wear remains: condition ${Math.round(durability.condition(job.key))}/${Math.round(f.max)}.`;
        return `You repair your ${job.name} by hand: condition ${Math.round(durability.condition(job.key))}/${Math.round(f.max)}.`;
    } else {
        const max = Math.max(Math.min(f.max, job.floor), f.max - job.failureLoss);
        state = {...state, job: null, instances: {...state.instances, [job.key]: {...f, max, failures: f.failures + 1}}};
        durability.setCondition(job.key, durability.condition(job.key));
        return `The repair goes wrong. Your ${job.name} keeps its condition, and its best condition drops to ${Math.round(max)}.`;
    }
}
function repairBlockReason(job) {
    if (!durability.enabled) return 'equipment durability is off';
    try { ports.assertSpend(job.key); } catch (error) { return error.message; }
    // Missing tools retain the existing end-without-result policy. Changed tools
    // remain pending for explicit cancellation, never receive an old paid result.
    if (durability.ownedItem(ports.actor(), job.key) && job.target && !sameTarget(targetFacts(job.key), job.target))
        return 'the tool changed; cancel and review a fresh quote';
    return '';
}
function tick(minutes) {
    const job = state?.job;
    if (!job || !ports?.writable()) return;
    if (!Number.isFinite(minutes) || minutes < 0) throw Error('Invalid repair interval.');
    const clock = ports.clock?.();
    // The existing game clock has already committed this interval. Retain its
    // cursor with work so a failed save can retry without losing or reusing time.
    const elapsed = clock == null ? minutes : Math.max(0, clock - (job.lastClock ?? clock - minutes));
    if (!elapsed && job.minutesLeft > 0) return;
    // Bench time counts only while you stay at the station's place and do nothing else.
    const paused = ports.location() !== job.location || !ports.idle() || repairBlockReason(job);
    if (paused && clock == null) return;
    let message;
    commit(() => {
        const left = paused ? job.minutesLeft : Math.max(0, job.minutesLeft - elapsed);
        state = {...state, job: {...job, minutesLeft: left, ...(clock == null ? {} : {lastClock: clock})}};
        if (!paused && left <= 0) message = finishJob(state.job);
    });
    if (message) ports.logMessage(message);
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
    if (rates) return `Tool: ${item.getName()} · ${durability.broken(item) ? 'broken; improvised with' : 'head shifts under load; working with'} ${rates.means} · speed ${Math.round(rates.speed * 100)}%, find chance ${Math.round(rates.yield * 100)}%`;
    return `Tool: ${item.getName()} · ${VERB_LABEL[n.verb]} +${n.levels} levels: speed ×${n.speed}, yield ×${n.yield}, precision ${n.precision}, hardness ${n.hardness}${condition}`;
}

function project(view = 'rows', args) {
    if (view === 'occupation') return occupation();
    if (view === 'tooltip') return tooltip(args);
    const lamp=lamplightPresentation();
    return {enabled: durability.enabled, rows: toolRows(), job: state?.job ?? null, repairBlocked: state?.job ? repairBlockReason(state.job) : '', blocked: ports.blocked(), location: ports.location(), idle: ports.idle(),
        lamp:{...lamp,name:LAMP,oilName:OIL,baseline:FLASK_MINUTES,packFlasks:ports.count(OIL),rate:lamp.shining?{value:-1,unit:'lamp min per played min'}:null}};
}

registerDomain({id: 'tools', deps: [], initialState: () => null,
    save: () => state && (Object.keys(state.instances).length || state.job) ? structuredClone(state) : undefined,
    validate: slice => validateTools(slice),
    // Old saves have no slice: start fresh. No migration (old save compatibility deferred, 2026-10-17).
    migrate: slice => slice == null ? fresh() : structuredClone(slice),
    load: value=>{setToolsState(value);panel?.reset();}, tick,
    commands: {gate, workCycle, quote: quoteRepair, execute: executeRepair, cancel: cancelRepair, quoteAction: quoteToolAction, executeAction: executeToolAction},
    projection: project,
    refresh: () => panel?.render(),
    panels: [() => { panel = createToolsPanel({read: () => project('rows'), quote: quoteRepair, execute: executeRepair, cancel: cancelRepair, action: executeToolAction, discovered: () => toolsPanelDiscovered(toolRows(),lamplightPresentation())}); }],
});
