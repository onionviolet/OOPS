// Current owner views and exact new-job admission. No native bag mirror, crop
// allocator, grant, elapsed counter or observer-omniscient NPC sheet.
import {assert, natural, record} from './simulation_contracts.js';
import {remainderConsequencesFacts} from './audit_remainder_consequences_facts.js';
import {REMAINDER_CONSEQUENCES_IDS as C} from './audit_remainder_consequences_content.js';
import {statusCareSupportedBody} from './status_care_facts.js';
import {worldCompletionStripStamp} from './world_completion_strip.js';
import {WORLD_COMPLETION_MATERIALS_IDS as I, WORLD_COMPLETION_MATERIALS_KEYS as K,
    worldCompletionMaterialsDefinitions as B, createWorldCompletionMaterialsDefinitions,
    worldCompletionMaterialsCoverTexts, assertWorldCompletionMaterialsCropEffects,
    worldCompletionMaterialsValidationDefinitions, worldCompletionMaterialsFrozenDefinition} from './world_completion_materials_content.js';

export const worldCompletionMaterialsEqual = (a, b) => {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, n) => worldCompletionMaterialsEqual(v, b[n]));
    if(!record(a) || !record(b)) return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && worldCompletionMaterialsEqual(a[k], b[k]));
};
const same = worldCompletionMaterialsEqual;
const prefix = I.prefix;
const count = (state, id) => state.actors?.player?.completed?.[id] || 0;
const own = (state, key) => state.worlds?.[I.world]?.facts?.[prefix + key];
const covers = [I.coverOffcuts, I.coverMeasured];
export const worldCompletionMaterialsEnrolled = state => state.schema === 11 && state.auditRemainder?.schema === 1 &&
    state.simulation?.schema >= 5 && state.actors?.player?.facts?.['world.completion.enrolled'] === true &&
    count(state, I.enrollment) === 1;
export const worldCompletionMaterialsLocalSupported = (state, context = {}) => state.actors?.player?.worldId === I.world &&
    !state.realmPrototype?.activeVisitId && !state.featureDestination?.activeVisitId && !state.nestedCampaign?.activeVisitId &&
    !state.bookWorldCampaign?.activeVisitId && !state.chronicle?.session && state.chronicle?.life?.endedAt == null &&
    state.simulation?.people?.player?.inventory === 'native' && statusCareSupportedBody(state, context);
export const worldCompletionMaterialsBody = (state, context = {}) => {
    const ownBody = state.simulation?.people?.player?.body;
    return ownBody?.id && ownBody.form ? ownBody : context.nativeBody;
};
const causeSequence = cause => /^simulation:[1-9][0-9]*$/.test(cause || '') ? Number(cause.split(':')[1]) : null;
export const worldCompletionMaterialsCaused = (state, receipt) => !!receipt && natural(receipt.at) && receipt.at <= state.clock &&
    natural(causeSequence(receipt.cause)) && causeSequence(receipt.cause) > 0 && causeSequence(receipt.cause) <= state.sequence;

export function worldCompletionMaterialsFacts(state, context = {}) {
    const s = state.simulation, known = s?.knowledge?.player || {}, current = context.facts || {};
    const old = remainderConsequencesFacts(state, context), w = state.worlds?.[I.world]?.facts || {};
    const inventory = context.gameplay?.player?.inventory;
    const encumbered = key => Object.values(s?.custody || {}).some(c => c.key === key && c.holder === 'player') ||
        Object.values(context.equipment?.player || s?.equipment?.player || {}).includes(key);
    const location = current.location || s?.people?.player?.location;
    const sampleCause = current['worldCompletion.sampleCause'];
    const measuredCause = current['worldCompletion.measuredCause'];
    const stripKey = current['worldCompletion.measuredStripKey'], strip = worldCompletionStripStamp(stripKey);
    const sample = known['lore.warning.sample'];
    const measured = current['worldCompletion.measuredSample'] === true && worldCompletionMaterialsCaused(state, sample) &&
        sample.cause === sampleCause && sample.basis?.situationId === 'lore.warning.rain' && sample.basis?.attributedTo === 'player' &&
        natural(causeSequence(measuredCause)) && causeSequence(measuredCause) > causeSequence(sampleCause) && causeSequence(measuredCause) <= state.sequence;
    const candidate = context.worldCompletionMaterialsReservation || s?.jobs?.find(j => j.actorId === 'player' && j.commandId.startsWith(prefix));
    const ownJob = exactWorldCompletionMaterialsJob(state, candidate, undefined, {popped: !!context.worldCompletionMaterialsReservation}) ? candidate : null;
    const acceptedSupport = ownJob?.worldCompletionMaterials?.bodyId === worldCompletionMaterialsBody(state, context)?.id &&
        (!covers.includes(ownJob?.commandId) || measured && ownJob.worldCompletionMaterials.sampleCause === sampleCause && ownJob.worldCompletionMaterials.measuredCause === measuredCause);
    const notchSupported = current['worldCompletion.notchSupported'] === true &&
        current['worldCompletion.notchLocation'] === 'Village' && current['worldCompletion.notchSiteId'] === 'lore.warning.notch' &&
        location === 'Village' && !!s?.sites?.['lore.warning.notch'];
    return {
        'worldCompletionMaterials.enrolled': worldCompletionMaterialsEnrolled(state),
        'worldCompletionMaterials.local': worldCompletionMaterialsLocalSupported(state, context) && old[C.facts + 'frontierSupported'] === true,
        'worldCompletionMaterials.hands': worldCompletionMaterialsLocalSupported(state, context) && old[C.facts + 'playerHands'] === true,
        'worldCompletionMaterials.notchInspected': current['worldCompletion.notchInspected'] === true,
        'worldCompletionMaterials.notchRight': current['worldCompletion.notchRight'] === true,
        'worldCompletionMaterials.notchSupported': notchSupported,
        'worldCompletionMaterials.measuredSample': measured,
        'worldCompletionMaterials.measuredStrip': measured && current['worldCompletion.measuredStrip'] === true &&
            !!strip && strip.sampleCause === sampleCause && strip.measuredCause === measuredCause &&
            (inventory?.[stripKey] || 0) === 1 && !encumbered(stripKey),
        'worldCompletionMaterials.acceptedSupport': !!ownJob && acceptedSupport,
        'worldCompletionMaterials.plotRight': old[C.facts + 'plotRight'] === true,
        'worldCompletionMaterials.bedPresent': old[C.facts + 'bedPresent'] === true,
        'worldCompletionMaterials.stewardPresent': old[C.facts + 'stewardPresent'] === true,
        'worldCompletionMaterials.cropWarned': s?.situations?.[I.plot]?.phase === 'warned',
        'worldCompletionMaterials.frostOpen': old[C.facts + 'frostOpen'] === true,
        'worldCompletionMaterials.noCoverJob': !(s?.jobs || []).some(j => j.commandId === C.prefix + 'plot_cover' || covers.includes(j.commandId)),
        'worldCompletionMaterials.hasTwoGreen': (inventory?.[K.green] || 0) >= 2 && !encumbered(K.green),
        'worldCompletionMaterials.hasMaterialRecord': !!known[prefix + 'kept'] || !!known[prefix + 'disposal'] || !!known[prefix + 'cover'],
        // Current drain comes only from root's qualified P2 adapter. Historical
        // obstruction is never used to restore current support after clearance.
        'worldCompletionMaterials.drainOpen': current['worldCompletion.drainOpen'] === true,
        'worldCompletionMaterials.discarded': w[prefix + 'discarded'] === true,
    };
}

function definitions(registry) {
    if(!registry) return worldCompletionMaterialsValidationDefinitions();
    const registered = covers.map(id => registry.simulation.commands.get(id));
    assert(registered.every(Boolean), 'Register both exact alternate crop covers from the real terminal factory.');
    const supplied = text => {
        const d = registered.find(d => d.effects.some(e => e.type === 'knowledge' && e.key === C.facts + 'plot.result' && e.value === text));
        assert(d, 'The alternate cover lost its exact canonical crop result.');
        const terminal = d.effects.filter(e => !e.key?.startsWith(prefix));
        assertWorldCompletionMaterialsCropEffects(terminal, text);
        return terminal;
    };
    return createWorldCompletionMaterialsDefinitions({coveredPlotEffects: supplied});
}
function definition(registry, id) {
    const registered = registry?.simulation?.commands?.get(id);
    if(registered) return registered;
    return B.commands.find(d => d.id === id) || worldCompletionMaterialsValidationDefinitions().commands.find(d => d.id === id);
}

export function exactWorldCompletionMaterialsJob(state, job, registry, {popped = false} = {}) {
    const source = definition(registry, job?.commandId), support = job?.worldCompletionMaterials;
    const acceptedCause = causeSequence(job?.id);
    let d = source;
    if(source?.id === I.coverMeasured) {
        if(!worldCompletionStripStamp(support?.measuredStripKey)) return false;
        d = worldCompletionMaterialsFrozenDefinition(source, support.measuredStripKey);
    }
    const sample = covers.includes(d?.id);
    if(!d?.duration || d.group !== I.group || !support || !natural(acceptedCause) || acceptedCause <= 0) return false;
    const participants = [...new Set(['player', ...(d.participants || []).map(id => id === '$target' ? d.targetId : id)])];
    const costs = (job.costs || []).map(e => ({...e, actor: e.actor || 'player'}));
    const effects = (job.effects || []).map(e => {const out = {...e}; delete out.template; delete out.definition; return out;});
    const strip = worldCompletionStripStamp(support.measuredStripKey);
    const stripValid = d.id !== I.coverMeasured ? support.measuredStripKey === null : !!strip && strip.sampleCause === support.sampleCause &&
        strip.measuredCause === support.measuredCause && causeSequence(strip.productionCause) < acceptedCause;
    const exact = stripValid && support.schema === 1 && Object.keys(support).every(k => ['schema', 'acceptedAt', 'pausedMinutes', 'sampleCause', 'measuredCause', 'measuredStripKey', 'bodyId', 'notchLocation', 'notchSiteId'].includes(k)) &&
        natural(support.acceptedAt) && support.acceptedAt <= state.clock && natural(support.pausedMinutes) &&
        typeof support.bodyId === 'string' && support.bodyId.length > 0 &&
        support.notchLocation === 'Village' && support.notchSiteId === 'lore.warning.notch' &&
        (sample ? natural(causeSequence(support.sampleCause)) && causeSequence(support.sampleCause) > 0 &&
            causeSequence(support.sampleCause) < causeSequence(support.measuredCause) && causeSequence(support.measuredCause) < acceptedCause : support.sampleCause === null && support.measuredCause === null) &&
        job.id === 'simulation:' + job.sequence && job.sequence === acceptedCause && job.sequence <= state.sequence &&
        job.actorId === 'player' && job.targetId === (d.targetId || null) && job.revision === 1 && job.reservationReturns === 1 &&
        job.cancellation === 'refund' && job.siteId === d.siteId && job.claim === null &&
        job.due === support.acceptedAt + support.pausedMinutes + d.duration &&
        same(job.context, {actorId: 'player', targetId: d.targetId || null, partyIds: job.context?.partyIds}) && Array.isArray(job.context.partyIds) &&
        same(job.participants, participants) && same(costs, d.costs) && same(effects, d.effects) &&
        same(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: !!d.completionCoLocated, location: d.location, failure: 'refund'});
    return exact && (popped || state.simulation?.sites?.[d.siteId]?.reservations?.[job.id] === 'player');
}

export function validateWorldCompletionMaterialsState(state, registry) {
    const s = state.simulation, world = state.worlds?.[I.world]?.facts || {};
    const worldRows = Object.entries(world).filter(([key]) => key.startsWith(prefix));
    const wrongWorld = Object.entries(state.worlds || {}).some(([id, value]) => id !== I.world && Object.keys(value.facts || {}).some(k => k.startsWith(prefix)));
    const knowledgeRows = Object.entries(s?.knowledge || {}).flatMap(([actor, entries]) => Object.entries(entries).filter(([key]) => key.startsWith(prefix)).map(([key, value]) => [actor, key, value]));
    const completedRows = Object.entries(state.actors || {}).flatMap(([actor, a]) => Object.entries(a.completed || {}).filter(([key]) => key.startsWith(prefix)).map(([key, value]) => [actor, key, value]));
    const jobs = (s?.jobs || []).filter(j => j.commandId.startsWith(prefix));
    const actorFacts = Object.values(state.actors || {}).some(a => ['facts', 'resources', 'sources'].some(key => Object.keys(a[key] || {}).some(k => k.startsWith(prefix))));
    const unexpectedOwners = ['claims', 'sites', 'situations', 'checks', 'events', 'controllers'].some(key => Object.entries(s?.[key] || {}).some(([id, value]) =>
        id.startsWith(prefix) || value.definitionId?.startsWith(prefix))) ||
        ['powers', 'faculties', 'conditions', 'progression'].some(key => Object.values(s?.[key] || {}).some(entries => Object.keys(entries).some(id => id.startsWith(prefix)))) ||
        Object.values(s?.programs || {}).some(value => value.commandId?.startsWith(prefix));
    const active = worldRows.length || knowledgeRows.length || completedRows.length || jobs.length || actorFacts || wrongWorld || unexpectedOwners;
    if(!active) return true;
    assert(worldCompletionMaterialsEnrolled(state), 'New material meanings need explicit expansion11/auditRemainder1/completion enrollment and simulation5; old absence is inert.');
    assert(!actorFacts && !wrongWorld && !unexpectedOwners && !Object.keys(state.auditRemainder.modules || {}).some(k => k === 'world_completion_materials'), 'Materials use their declared current world/knowledge/job owners only.');
    const expected = definitions(registry), declared = new Map(expected.commands.map(d => [d.id, d]));
    if(registry) for(const d of expected.commands) {
        const current = registry.simulation.commands.get(d.id);
        const actualKey = current?.id === I.coverMeasured ? current.costs.find(e => e.type === 'item')?.key : null;
        const exact = current?.id === I.coverMeasured && worldCompletionStripStamp(actualKey) ? worldCompletionMaterialsFrozenDefinition(d, actualKey) : d;
        assert(same(current, exact), 'Unsupported registered material command revision or frozen meaning.');
    }
    for(const [actor, id, n] of completedRows) assert(actor === 'player' && declared.has(id) && n === 1, 'Each new finite material action belongs to the player and completes once.');
    for(const [actor, key, receipt] of knowledgeRows) {
        const completed = expected.commands.filter(d => d.effects.some(e => e.type === 'knowledge' && e.key === key) && count(state, d.id) === 1);
        assert(actor === 'player' && completed.some(d => {
            const e = d.effects.find(e => e.type === 'knowledge' && e.key === key);
            return worldCompletionMaterialsCaused(state, receipt) && receipt.stage === e.stage && receipt.value === e.value && same(receipt.basis, e.basis);
        }), 'Material knowledge must retain its actual completed declared witness and cause.');
    }
    for(const d of expected.commands) if(count(state, d.id)) for(const e of d.effects.filter(e => e.type === 'knowledge' && e.key.startsWith(prefix))) {
        const r = s.knowledge?.player?.[e.key];
        assert(r && r.value === e.value && r.stage === e.stage && same(r.basis, e.basis) && worldCompletionMaterialsCaused(state, r), 'A completed material action lost its exact observed receipt.');
    }
    const fields = {discarded: 'boolean', drainApplied: 'boolean', disposalCause: 'cause', afterRain: 'boolean', coverRoute: ['offcuts', 'measured'], coverSampleCause: 'cause', coverMeasuredCause: 'cause', coverCause: 'cause', coverStripKey: 'strip'};
    for(const [key, value] of worldRows) {
        const rule = fields[key.slice(prefix.length)];
        assert(rule && (rule === 'boolean' ? typeof value === 'boolean' : rule === 'cause' ? natural(causeSequence(value)) && causeSequence(value) > 0 && causeSequence(value) <= state.sequence : rule === 'strip' ? !!worldCompletionStripStamp(value) : rule.includes(value)), 'Unsupported material world field or value.');
    }
    const coverCount = covers.reduce((n, id) => n + count(state, id), 0);
    assert(coverCount <= 1 && jobs.filter(j => covers.includes(j.commandId)).length <= 1, 'One finite crop cannot hold two alternate covers.');
    assert(!jobs.some(j => covers.includes(j.commandId)) || !(s.jobs || []).some(j => j.commandId === C.prefix + 'plot_cover'), 'The new cover cannot overlap the existing cover of the same crop.');
    if(coverCount) {
        const id = count(state, I.coverOffcuts) ? I.coverOffcuts : I.coverMeasured, route = id === I.coverOffcuts ? 'offcuts' : 'measured';
        const receipt = s.knowledge.player[prefix + 'cover'], old = s.knowledge.player[C.facts + 'plot.result'];
        assert(own(state, 'coverRoute') === route && own(state, 'coverCause') === receipt.cause &&
            causeSequence(own(state, 'coverSampleCause')) < causeSequence(own(state, 'coverMeasuredCause')) && causeSequence(own(state, 'coverMeasuredCause')) < causeSequence(receipt.cause) &&
            old?.cause === receipt.cause && old.at === receipt.at && old.value === worldCompletionMaterialsCoverTexts[route] &&
            s.situations?.[I.plot]?.phase === 'covered' && s.claims?.[I.harvest]?.status === 'settled' &&
            state.actors.player.facts[C.facts + 'plot.yield'] === 5 && count(state, C.prefix + 'plot_cover') === 0 &&
            count(state, C.prefix + 'plot_early') === 0 && count(state, C.prefix + 'plot_neglect') === 0,
            'An actual alternate cover must settle the existing five-herb crop once with its popped-job sample and exact same-cause receipt.');
        const stamp = worldCompletionStripStamp(own(state, 'coverStripKey'));
        assert(route === 'offcuts' ? own(state, 'coverStripKey') == null : stamp && stamp.sampleCause === own(state, 'coverSampleCause') &&
            stamp.measuredCause === own(state, 'coverMeasuredCause') && causeSequence(stamp.productionCause) < causeSequence(receipt.cause),
            'A measured cover must retain its exact consumed strip sample, measurement, production and maker stamp.');
    } else assert(own(state, 'coverRoute') == null && own(state, 'coverSampleCause') == null && own(state, 'coverMeasuredCause') == null && own(state, 'coverCause') == null && own(state, 'coverStripKey') == null, 'Unperformed cover cannot award crop state or sample provenance.');
    if(count(state, I.discard)) {
        const r = s.knowledge.player[prefix + 'disposal'];
        assert(own(state, 'discarded') === true && own(state, 'drainApplied') === true && own(state, 'disposalCause') === r.cause && typeof own(state, 'afterRain') === 'boolean',
            'Actual scrap disposal must join the current physical drain at its supported completion boundary once.');
    } else assert(['discarded', 'drainApplied', 'disposalCause', 'afterRain'].every(k => own(state, k) == null), 'Reserved or cancelled scraps cannot obstruct a drain.');
    for(const j of jobs) assert(exactWorldCompletionMaterialsJob(state, j, registry) && count(state, j.commandId) === 0 && j.due >= state.clock,
        'New material work lost its exact frozen costs, effects, current body/participants/site, cause, sample or refundable deadline.');
    return true;
}
