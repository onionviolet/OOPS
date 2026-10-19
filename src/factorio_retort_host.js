// Original opt-in retort host. Shared registry, native-envelope reader, UI,
// clock and durable publication are root-owned integrations. No storage writes.
import {sameJson as same} from './basics.js';
import {FACTORIO_RETORT_IDS as I, FACTORIO_RETORT_KEYS as K, FACTORIO_RETORT_TERMS as T,
    factorioRetortDefinitions, factorioRetortPlanDefinitions} from './factorio_retort_content.js';
import {factorioRetortFacts, factorioRetortBenchSupported} from './factorio_retort_facts.js';
import {assert, record, natural, stableId, meets} from './simulation_contracts.js';
import {commitSimulationCommand, cancelSimulationJob, simulationOccupiesActor} from './simulation.js';
import {startWorkPlan, controlWorkPlan, workPlanView} from './feature_expansion_work_plan.js';
import {projectFeatureCommands, featureWorkControls, featureRecordedKnowledge} from './feature_expansion_host.js';
import {activePractice} from './techniques.js';

const definitions = new Map(factorioRetortDefinitions.commands.map(d => [d.id, d]));
const itemIDs = new Map(['resinEmpty', 'resinFull', 'residueEmpty', 'residueFull', 'residue'].map(name => [JSON.parse(K[name]).id, K[name]]));
const receiptFor = new Map([[I.install, 'installed'], [I.batch, 'batch'], [I.collectResin, 'collected_resin'],
    [I.collectResidue, 'collected_residue'], [I.disposeFilled, 'disposed_filled_residue'], [I.disposeLoose, 'disposed_residue']]);
const keysOnly = (value, keys, text) => assert(record(value) && Object.keys(value).every(k => keys.includes(k)), text);
const completed = (state, id) => state.actors?.player?.completed?.[id] || 0;

export function factorioRetortContext(state, registry, context = {}) {
    return {...context, facts: {...context.facts, ...factorioRetortFacts(state, context, registry)}};
}

export function validateFactorioRetortDefinitions(registry) {
    if(!registry) return;
    const simulation = registry.simulation || registry;
    const site = simulation.sites?.get(I.site);
    assert(site?.revision === T.revision && site.capacity === T.siteCapacity && site.provision === false &&
        site.worldId === I.world && site.location === 'Village', 'Retain the exact opt-in retort rack definition.');
    const fields = ['revision', 'worldId', 'group', 'actorId', 'location', 'reservationReturns', 'once', 'targetId', 'coLocated', 'participants',
        'visibleWhen', 'requires', 'duration', 'siteId', 'cancellation', 'completionFailure', 'completionRequires', 'costs', 'effects'];
    for(const d of definitions.values()) {
        const actual = simulation.commands?.get(d.id);
        assert(actual && fields.every(key => same(actual[key] ?? null, d[key] ?? null)), `The retained retort terms changed for ${d.id}.`);
    }
    for(const d of simulation.commands?.values() || []) if(d.id.startsWith(I.prefix)) {
        assert(definitions.has(d.id) && d.group === I.group, 'Unsupported retort command revision or identity.');
    }
    const plan = registry.workPlans?.get(I.plan), source = factorioRetortPlanDefinitions[0];
    if(plan) assert(['revision', 'actorId', 'origin', 'steps', 'requires', 'visibleWhen'].every(key => same(plan[key], source[key])) &&
        plan.stockPolicy == null && plan.goal == null, 'The retort needs its exact three ordinary command steps, not the kit stock policy.');
}

export function validateFactorioRetortAcceptedJob(job, state, registry) {
    const d = definitions.get(job?.commandId), r = state.referenceGameplay?.retort;
    assert(d?.duration > 0 && r?.schema === 1, 'Only declared timed retort work can hold accepted stock.');
    validateFactorioRetortDefinitions(registry);
    keysOnly(job, ['id', 'sequence', 'commandId', 'revision', 'actorId', 'targetId', 'due', 'effects', 'costs', 'cancellation', 'siteId',
        'claim', 'label', 'roll', 'outcomeId', 'context', 'participants', 'reservationReturns', 'completionSupport'], 'Unsupported retort accepted-job fields.');
    keysOnly(job.context, ['actorId', 'targetId', 'partyIds'], 'A retort job cannot retain copied facts, stock or output counters.');
    assert(job.id === `simulation:${job.sequence}` && natural(job.sequence) && job.sequence > r.installedSequence && job.sequence <= state.sequence &&
        job.revision === T.revision && job.actorId === 'player' && job.targetId === null && job.context.actorId === 'player' && job.context.targetId === null &&
        Array.isArray(job.context.partyIds) && job.context.partyIds.every(stableId) && new Set(job.context.partyIds).size === job.context.partyIds.length &&
        same(job.participants, ['player']) && natural(job.due) && job.due - d.duration >= r.installedAt && job.due - d.duration <= state.clock &&
        job.label === d.label && job.siteId === I.site && job.claim === null && job.roll === null && job.outcomeId === null &&
        job.reservationReturns === 1 && job.cancellation === 'refund' && same(job.costs, d.costs) && same(job.effects, d.effects),
        'Retort accepted work lost its exact custody, fuel, product, origin or refund terms.');
    assert(same(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: false, location: 'Village', failure: 'refund'}) &&
        state.simulation?.sites?.[I.site]?.reservations?.[job.id] === 'player', 'Retort work lost its live rack reservation or completion support.');
}

export function validateFactorioRetortState(state = {}, registry) {
    const r = state.referenceGameplay?.retort, s = state.simulation, a = state.actors?.player;
    const ownCounts = Object.entries(a?.completed || {}).filter(([id]) => id.startsWith(I.prefix));
    const ownFacts = Object.entries(a?.facts || {}).filter(([id]) => id.startsWith(I.prefix));
    const knowledge = Object.entries(s?.knowledge?.player || {}).filter(([id]) => id.startsWith(I.prefix));
    const jobs = (s?.jobs || []).filter(j => j.commandId?.startsWith(I.prefix) || j.siteId === I.site ||
        [...(j.costs || []), ...(j.effects || [])].some(e => e.type === 'item' && [...itemIDs.values()].includes(e.key)));
    const cursors = Object.values(s?.workPlans?.cursors || {}).filter(c => c.definitionId?.startsWith(I.prefix) ||
        c.origin?.startsWith(I.prefix) || c.steps?.some(step => step.commandId?.startsWith(I.prefix)));
    assert(!Object.values(s?.programs || {}).some(p => p.commandId?.startsWith(I.prefix)),
        'Retort repetition uses only the declared finite work plan, not an undisclosed program.');
    for(const [id, actor] of Object.entries(state.actors || {})) if(id !== 'player') {
        assert(!['facts', 'completed', 'resources', 'sources', 'techniques'].some(field =>
            Object.keys(actor[field] || {}).some(key => key.startsWith(I.prefix))) &&
            !Object.keys(s?.knowledge?.[id] || {}).some(key => key.startsWith(I.prefix)),
            'Retort observations and completed work belong only to their actual player owner.');
    }
    if(r == null) {
        assert(!ownCounts.some(([, count]) => count !== 0) && ownFacts.length === 0 && knowledge.length === 0 &&
            !jobs.length && !cursors.length && !s?.sites?.[I.site], 'Retort activation needs its explicit updated optional receipt. Preserve the original save.');
        return;
    }
    keysOnly(r, ['schema', 'installedAt', 'installedSequence'], 'Unsupported optional retort receipt.');
    assert(r.schema === 1 && [9, 10, 11].includes(state.schema) && state.referenceGameplay?.schema === 1 && state.referenceGameplay.workshop?.schema === 1 &&
        natural(r.installedAt) && r.installedAt <= state.clock && natural(r.installedSequence) && r.installedSequence > 0 && r.installedSequence <= state.sequence &&
        completed(state, I.install) === 1 && a?.facts?.[I.prefix + 'installed'] === true && s?.people?.player?.inventory === 'native',
        'Retort work needs its actual once-only installation, existing workshop and native owner.');
    assert(ownFacts.length === 1 && ownFacts[0][0] === I.prefix + 'installed' && ownFacts[0][1] === true &&
        ownCounts.every(([id, count]) => definitions.has(id) && natural(count)), 'Unsupported retort counters or saved capacity facts.');
    const rack = s.sites?.[I.site];
    assert(rack?.owner === 'player' && rack.capacity === T.siteCapacity && record(rack.reservations) && factorioRetortBenchSupported(state),
        'Retain the actual player rack and fitting-bench rights.');
    const allowedKnowledge = new Set([...receiptFor.values()].map(name => I.prefix + name));
    assert(knowledge.every(([id]) => allowedKnowledge.has(id)), 'Unsupported retort observation identity.');
    for(const [id, suffix] of receiptFor) {
        const k = s.knowledge.player?.[I.prefix + suffix], count = completed(state, id);
        assert((count > 0) === !!k, 'Retort completion needs its actual observed receipt.');
        if(k) {
            const source = definitions.get(id).effects.find(e => e.type === 'knowledge'), sequence = Number(k.cause?.slice(11));
            assert(k.stage === source.stage && k.value === source.value && natural(k.at) && k.at >= r.installedAt && k.at <= state.clock &&
                /^simulation:[1-9][0-9]*$/.test(k.cause) && natural(sequence) && sequence <= state.sequence &&
                sequence >= r.installedSequence && (id === I.install || sequence > r.installedSequence) && same(k.basis, source.basis),
                'Retort observations must retain their exact completed definition, actual past cause and observer.');
        }
        if(id === I.install) assert(k?.at === r.installedAt && k.cause === `simulation:${r.installedSequence}`, 'Retort installation receipt was replayed.');
    }
    assert(completed(state, I.collectResin) <= completed(state, I.batch) &&
        completed(state, I.collectResidue) + completed(state, I.disposeFilled) <= completed(state, I.batch) &&
        completed(state, I.disposeLoose) <= completed(state, I.collectResidue), 'Retort collection or disposal exceeds its actual prior products.');
    for(const job of jobs) validateFactorioRetortAcceptedJob(job, state, registry);
    assert(jobs.length <= T.siteCapacity && Object.keys(rack.reservations).length === jobs.length &&
        Object.keys(rack.reservations).every(id => jobs.some(j => j.id === id)), 'Orphan or overlapping retort capacity reservation.');
    for(const c of cursors) assert(c.definitionId === I.plan && c.revision === T.revision && c.actorId === 'player' && c.origin === I.install &&
        same(c.steps, factorioRetortPlanDefinitions[0].steps) && c.stockPolicy == null && c.goal == null,
        'Retain the exact finite retort cursor and its ordinary command steps.');
    validateFactorioRetortDefinitions(registry);
}

// A carried-stock admission check complements the root full-envelope validator.
// It permits absent carried trays that are genuinely stored/other-held, but it
// cannot let a duplicate bag/reserved copy become another receiver.
export function validateFactorioRetortHeldNative(state, context = {}) {
    const counts = Object.fromEntries([...itemIDs.values()].map(key => [key, 0]));
    for(const [key, count] of Object.entries(context.gameplay?.player?.inventory || {})) {
        let value; try {value = JSON.parse(key);} catch {continue;}
        if(!itemIDs.has(value?.id)) continue;
        assert(itemIDs.get(value.id) === key && natural(count), 'Unsupported native retort item key or quantity.');
        counts[key] += count;
    }
    for(const job of state.simulation?.jobs || []) for(const cost of job.costs || []) {
        if(cost.type === 'item' && cost.actor === 'player' && cost.amount < 0 && Object.hasOwn(counts, cost.key)) counts[cost.key] -= cost.amount;
    }
    if(!state.referenceGameplay?.retort) assert(Object.values(counts).every(n => n === 0), 'Retort items need actual enrollment.');
    else assert(counts[K.resinEmpty] + counts[K.resinFull] <= 1 && counts[K.residueEmpty] + counts[K.residueFull] <= 1,
        'The same retort receiver cannot be carried and reserved twice.');
}

export function commitFactorioRetortCommand(state, registry, command, context, expectedSequence = state.sequence) {
    validateFactorioRetortState(state, registry); validateFactorioRetortHeldNative(state, context);
    const d = definitions.get(command.id);
    assert(d && context.actorId === 'player' && (!command.targetId || command.targetId === d.targetId), 'Choose the declared player retort control.');
    const ctx = factorioRetortContext(state, registry, {...context, targetId: d.targetId || null});
    const out = commitSimulationCommand(state, registry, {id: d.id}, ctx, expectedSequence);
    if(d.id === I.install) {
        assert(!out.state.referenceGameplay.retort, 'The retort pair was already installed.');
        out.state.referenceGameplay.retort = {schema: 1, installedAt: out.state.clock, installedSequence: out.state.sequence};
    }
    validateFactorioRetortState(out.state, registry); validateFactorioRetortHeldNative(out.state, out);
    return out;
}

export function cancelFactorioRetortJob(state, registry, jobId, context, expectedSequence = state.sequence) {
    validateFactorioRetortState(state, registry); validateFactorioRetortHeldNative(state, context);
    const job = state.simulation?.jobs?.find(j => j.id === jobId && j.actorId === 'player');
    assert(job && definitions.has(job.commandId) && context.actorId === 'player', 'Choose the actual held retort job.');
    const out = cancelSimulationJob(state, registry, jobId, factorioRetortContext(state, registry, context), expectedSequence);
    validateFactorioRetortState(out.state, registry); validateFactorioRetortHeldNative(out.state, out); return out;
}

export function startFactorioRetortPlan(state, registry, context, expectedSequence = state.sequence) {
    validateFactorioRetortState(state, registry); validateFactorioRetortHeldNative(state, context);
    assert(state.referenceGameplay?.retort && registry.workPlans?.has(I.plan), 'Install and register the finite retort plan first.');
    const out = startWorkPlan(state, registry, registry.workPlans, I.plan, factorioRetortContext(state, registry, context), expectedSequence);
    validateFactorioRetortState(out.state, registry); validateFactorioRetortHeldNative(out.state, out); return out;
}
export function controlFactorioRetortPlan(state, registry, command, context, expectedSequence = state.sequence) {
    validateFactorioRetortState(state, registry); validateFactorioRetortHeldNative(state, context);
    assert(state.simulation?.workPlans?.cursors.player?.definitionId === I.plan, 'This finite retort cursor changed.');
    const out = controlWorkPlan(state, registry, command, factorioRetortContext(state, registry, context), expectedSequence);
    validateFactorioRetortState(out.state, registry); validateFactorioRetortHeldNative(out.state, out); return out;
}

export function factorioRetortPresentation(state, registry, context) {
    const ctx = factorioRetortContext(state, registry, context), facts = ctx.facts;
    const saved = state.simulation?.workPlans?.cursors.player, ownCursor = saved?.definitionId === I.plan;
    if(!facts['factorioRetort.workshopOpened'] && !ownCursor) return {visible: false, sections: []};
    const installed = facts['factorioRetort.installed'];
    const actions = projectFeatureCommands(state, registry, ctx, {groups: [I.group], commandType: 'factorio_retort'});
    const work = featureWorkControls(state, registry, [I.group], ctx);
    if(work.actions.length) work.actions[0].command = {type: 'factorio_retort_cancel', id: state.simulation.jobs.find(j => definitions.has(j.commandId) && j.actorId === 'player').id};
    const cursor = ownCursor ? workPlanView(state, registry, registry.workPlans, ctx) : null;
    const plan = registry.workPlans?.get(I.plan), occupied = saved && !['complete', 'cancelled'].includes(saved.status);
    const supported = facts['factorioRetort.supported'], free = supported && !context.busy && !simulationOccupiesActor(state, 'player') &&
        !state.pending.some(j => j.context.actorId === 'player') && !activePractice(state.actors.player) && state.simulation.programs.player?.status !== 'running';
    if(installed && plan && !occupied && meets(plan.visibleWhen, facts)) actions.push({id: I.plan,
        label: 'Plan three retort batches · pause until each actual receiver is cleared', command: {type: 'factorio_retort_plan_start'},
        eligible: !!free, reasons: free ? [] : ['Return to your supported rack and finish current activity before accepting the finite plan.'],
        terms: 'Only the current batch is reserved. Either filled or unavailable tray pauses the next start before spending its input or fuel. Clear or recover both trays and explicitly resume.', automatable: false});
    if(cursor) for(const [action, show] of [['pause', cursor.canPause], ['resume', cursor.canResume], ['cancel', cursor.canCancel],
        ['forget', cursor.canForget && ['complete', 'cancelled'].includes(cursor.status)]]) if(show) actions.push({id: `factorio_retort.plan_${action}`,
        label: action === 'forget' ? 'Remove ended retort plan' : action === 'cancel' ? 'Stop future retort batches; accepted work keeps its terms' : `${action[0].toUpperCase()+action.slice(1)} retort plan`,
        command: {type: 'factorio_retort_plan_control', action, cursorId: cursor.id}, eligible: action !== 'resume' || !!free,
        reasons: action !== 'resume' || free ? [] : ['Return to supported work and finish your current activity before resuming.'], automatable: false});
    const records = installed ? [
        {id: 'factorio_retort.trays', text: `Available carried resin receiver: ${facts['factorioRetort.count.resinEmpty']} empty / ${facts['factorioRetort.count.resinFull']} filled. Residue receiver: ${facts['factorioRetort.count.residueEmpty']} empty / ${facts['factorioRetort.count.residueFull']} filled. Each holds one batch; stored, borrowed, equipped and other-held objects do not provide receiving capacity.`},
        {id: 'factorio_retort.inputs', text: `Available owned batch inputs: ${facts['factorioRetort.count.sap']} sap, ${facts['factorioRetort.count.log']} log fuel. Loose spent residue: ${facts['factorioRetort.count.residue']}. Each batch reserves one of each input and both actual empty trays, with one stamina and three supported played minutes.`},
        {id: 'factorio_retort.consumer', text: 'Collect one Set repair resin and use the existing resin route with two Sound repair staves to produce two Prepared survey kits. Clearing resin alone leaves the residue receiver occupied.'},
        ...featureRecordedKnowledge(state, [I.prefix]),
    ] : [];
    return {visible: true, sections: [{id: I.group, label: 'Your two-receiver retort',
        description: 'Prepare three-minute batches with two actual empty trays. Collect resin and clear residue separately before another batch. Fuel stays unburned during preparation; cancellation returns the reserved inputs and trays.',
        work: [work.work, cursor ? `${cursor.label}: ${cursor.status}. ${cursor.reason || ''}` : ''].filter(Boolean).join(' '),
        actions: [...actions, ...work.actions], records}]};
}
