import {FEATURE_OBJECT_IDS as I, FEATURE_OBJECT_KEYS as K, featureObjectDefinitions} from './feature_expansion_objects.js';
import {enrollSimulation, commitSimulationCommand, previewSimulationCommand, simulationFacts, simulationOccupiesActor} from './simulation.js';
import {assert, meets, validateSimulationState} from './simulation_contracts.js';
import {originalFrontierFacts} from './original_frontier_facts.js';

const variants = ['sharp', 'dull', 'fine', 'fineDull'];
const validCount = value => Number.isSafeInteger(value) && value >= 0;
const active = (state, actor, id) => {
    const source = state.actors?.[actor]?.sources?.[id], faculty = state.simulation?.faculties?.[actor]?.[id];
    return !!source && (source.expiresAt == null || source.expiresAt > state.clock) && faculty?.awakened === true && faculty.active === true && faculty.suppressed !== true;
};
const ownCount = (state, context, actor, key) => {
    const person = state.simulation?.people?.[actor];
    const stock = person?.inventory === 'simulation' ? state.simulation.owners?.[actor] : actor === 'player' ? context.gameplay?.player?.inventory : context.gameplay?.[actor]?.inventory;
    return validCount(stock?.[key]) ? stock[key] : 0;
};

// These are eligibility facts, not observer-facing reports. Recompute inside
// simulationFacts as well as the player bridge so queued completion support
// checks use current native stock/body and exact current custody.
export function featureObjectFacts(state, context = {}, registry) {
    const s = state.simulation, actor = context.actorId || 'player', a = state.actors?.[actor], person = s?.people?.[actor];
    const location = context.facts?.location || person?.location;
    const stock = context.gameplay?.player?.inventory, vitals = context.vitals?.player;
    const nativeReady = !!stock && Object.values(stock).every(validCount) && !!vitals &&
        ['health', 'max_health', 'stamina', 'max_stamina'].every(key => Number.isFinite(vitals[key]) && vitals[key] >= 0) &&
        vitals.health <= vitals.max_health && vitals.stamina <= vitals.max_stamina;
    const frontier = originalFrontierFacts(state, context, registry);
    const f = {'featureObjects.supported': actor === 'player' && a?.worldId === I.world && location === 'Village' && nativeReady &&
        !state.realmPrototype?.activeVisitId && !s?.sessions?.player && !state.chronicle?.session && state.chronicle?.life.endedAt == null,
        'featureObjects.handsUsable': nativeReady && frontier['originalFrontier.playerHandsUsable'] === true};
    f[`power.${I.method}.owned`] = s?.powers?.[actor]?.[I.method]?.owned === true;
    f['knowledge.feature_objects.alignment.seen'] = !!s?.knowledge?.[actor]?.['feature_objects.alignment'];
    f['knowledge.feature_objects.method.understood'] = s?.knowledge?.[actor]?.['feature_objects.method']?.stage === 'understood';
    const miri = s?.people?.[I.miri], resident = state.actors?.[I.miri];
    f['featureObjects.miriSupported'] = !!miri && miri.life === 'alive' && resident?.worldId === a?.worldId && miri.location === location &&
        miri.body?.hands >= 2 && miri.vitals?.health > 1 && resident.facts['feature_objects.willing'] === true;
    f['featureObjects.miriSourceSupported'] = f['featureObjects.miriSupported'] && active(state, I.miri, I.method) && s?.powers?.[I.miri]?.[I.method]?.owned === true;
    f['featureObjects.miriFunctionSupported'] = f['featureObjects.miriSourceSupported'] && ownCount(state, context, I.miri, K.sound) >= 1 && ownCount(state, context, I.miri, K.fine) >= 1 &&
        !Object.values(s?.custody || {}).some(c => c.holder === I.miri && [K.sound, K.fine].includes(c.key));
    const held = s?.custody?.[I.loan];
    f['featureObjects.loanAbsent'] = !held && state.actors?.player?.facts?.['feature_objects.depositHeld'] !== true;
    for(const variant of variants) {
        const count = ownCount(state, context, 'player', K[variant]);
        const encumbered = Object.values(s?.custody || {}).some(c => c.holder === 'player' && c.key === K[variant]);
        const equipped = Object.values(context.equipment?.player || s?.equipment?.player || {}).includes(K[variant]);
        f[`featureObjects.own.${variant}`] = nativeReady && count >= 1 && !encumbered && !equipped;
        f[`featureObjects.loan.${variant}`] = nativeReady && count >= 1 && !equipped && held?.key === K[variant] && held.count === 1 && held.owner === I.miri && held.holder === 'player' &&
            state.actors?.player?.facts?.['feature_objects.depositHeld'] === true;
    }
    return f;
}

export function featureObjectContext(state, registry, context) {
    return {...context, facts: {...context.facts, ...featureObjectFacts(state, context, registry)}};
}

export function beginFeatureObjects(state, registry, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence, 'This fitting meeting is stale.');
    assert(context.actorId === 'player', 'Only the present player can accept this optional meeting.');
    const first = state.simulation ? {state, ...context} : enrollSimulation(state, registry, context, expectedSequence);
    const live = {...context, external: first.external, gameplay: first.gameplay, vitals: first.vitals || context.vitals};
    const out = commitSimulationCommand(first.state, registry, {id: I.begin}, featureObjectContext(first.state, registry, live), first.state.sequence);
    out.acquisitions = [...(first.acquisitions || []), ...(out.acquisitions || [])];
    out.unlocks = [...(first.unlocks || []), ...(out.unlocks || [])];
    validateFeatureObjectState(out.state, registry, out); return out;
}

export function commitFeatureObjectCommand(state, registry, command, context, expectedSequence = state.sequence) {
    const definition = registry.simulation.commands.get(command.id);
    assert(definition?.group === I.group && definition.actorId === 'player' && command.id !== I.begin, 'Unsupported fitting action.');
    assert(context.actorId === 'player', 'This fitting command belongs to the player.');
    assert(!command.targetId || command.targetId === definition.targetId, 'Choose the declared fitting participant.');
    const current = featureObjectContext(state, registry, {...context, targetId: definition.targetId || null});
    const out = commitSimulationCommand(state, registry, {id: definition.id}, current, expectedSequence);
    validateFeatureObjectState(out.state, registry, out); return out;
}

export function previewFeatureObjectCommand(state, registry, commandId, context) {
    const definition = registry.simulation.commands.get(commandId);
    assert(definition?.group === I.group, 'Unsupported fitting preview.');
    return previewSimulationCommand(state, registry, commandId, featureObjectContext(state, registry, {...context, targetId: definition.targetId || null}));
}

// Optional additive content owns no second save namespace. The normal envelope
// validators still own people/items/jobs/custody; these checks bind this named
// case to those owners and detect partial or unsupported activation.
export function validateFeatureObjectState(state, registry, nativeContext) {
    const s = state.simulation, f = state.actors?.player?.facts || {}, opened = f['feature_objects.introduced'] === true;
    const present = state.actors?.[I.miri] || s?.people?.[I.miri] || s?.situations?.[I.situation] || s?.custody?.[I.loan] || state.worlds?.[I.world]?.facts?.['feature_objects.joint'];
    if(!opened && !present) return;
    assert(opened && s?.people?.[I.miri]?.definitionId === I.miri && s?.situations?.[I.situation]?.revision === 1, 'Incomplete or unsupported fitting activation.');
    assert(s.people[I.miri].inventory === 'simulation' && state.actors[I.miri]?.worldId === I.world && s.owners[I.miri], 'Fitting stock needs its actual resident owner.');
    const situation = s.situations[I.situation], joint = state.worlds?.[I.world]?.facts?.['feature_objects.joint'];
    assert(({offered: 'leaking', braced: 'braced', sealed: 'sealed'})[situation.phase] === joint, 'The saved joint does not match its installed consequence.');
    const held = s.custody[I.loan];
    if(held) {
        assert(held.owner === I.miri && held.holder === 'player' && held.count === 1 && variants.some(v => K[v] === held.key) && f['feature_objects.depositHeld'] === true, 'Invalid fitting loan variant or deposit.');
        assert(state.actors[I.miri].resources.coins >= 2, 'The fitting owner no longer holds the refundable deposit.');
        if(nativeContext) assert(validCount(nativeContext.gameplay?.player?.inventory?.[held.key]) && nativeContext.gameplay.player.inventory[held.key] >= held.count &&
            !Object.values(nativeContext.equipment?.player || {}).includes(held.key), 'The fitting loan lost its actual carried native tool.');
    }
    else assert(f['feature_objects.depositHeld'] !== true, 'The knife deposit lost its corresponding loan.');
    const orders = state.actors[I.miri].resources.kitOrders;
    assert(validCount(orders) && orders <= 2, 'Unsupported fitting demand.');
    if(registry) validateSimulationState(s, state, registry.simulation);
}

export function featureObjectPresentation(state, registry, context) {
    const f = state.actors?.player?.facts || {}, s = state.simulation;
    const introduced = f['feature_objects.introduced'] === true;
    const current = featureObjectContext(state, registry, context);
    const canBegin = !introduced && current.facts['featureObjects.supported'] === true && current.facts['village.craftsmanMet'] === true && !context.busy && !simulationOccupiesActor(state);
    const actions = [];
    if(introduced) for(const definition of featureObjectDefinitions.commands) {
        if(definition.id === I.begin || definition.once && state.actors.player.completed[definition.id] || definition.claim && s.claims[definition.claim]) continue;
        const ctx = featureObjectContext(state, registry, {...context, targetId: definition.targetId || null});
        if(!meets(definition.visibleWhen, simulationFacts(state, ctx, registry))) continue;
        const p = previewSimulationCommand(state, registry, definition.id, ctx);
        if(p.visible) actions.push({id: definition.id, label: definition.label, description: definition.description || '', targetId: definition.targetId || null,
            eligible: p.eligible, reasons: p.reasons, duration: p.duration, costs: p.costs, cancellation: definition.cancellation || 'none', automatable: false});
    }
    const job = s?.jobs?.find(j => j.actorId === 'player' && registry.simulation.commands.get(j.commandId)?.group === I.group);
    const records = Object.entries(s?.knowledge?.player || {}).filter(([key]) => key.startsWith('feature_objects.')).map(([id, r]) => ({id, text: r.value, at: r.at, basis: r.basis ? {...r.basis} : null}));
    // Condition is known only from the player's performed installation or latest
    // firsthand observation, never a lookup of private truth/current NPC stock.
    const joint = f['feature_objects.lastSeenJoint'] || (f['feature_objects.sealed'] ? 'sealed' : f['feature_objects.braced'] ? 'braced' : f['feature_objects.jointInspected'] ? 'leaking' : null);
    const loanRecord = s?.custody?.[I.loan];
    const loan = introduced && loanRecord?.holder === 'player' ? {label: 'Eda\'s fitting knife', key: loanRecord.key, deposit: 2, owner: 'Eda', condition: ['dull', 'fineDull'].some(v => K[v] === loanRecord.key) ? 'dulled' : 'sharp'} : null;
    return {visible: !!(canBegin || introduced || job), canBegin, beginId: I.begin, label: 'Tools & the drying shelf', actions, records, loan,
        work: job ? {id: job.id, label: registry.simulation.commands.get(job.commandId)?.label || job.label, remainingMinutes: Math.max(0, job.due - state.clock), cancellation: job.cancellation} : null,
        quest: introduced && f['feature_objects.jointInspected'] ? {id: I.situation, label: 'The leaking joint', stage: joint === 'sealed' ? 'Sealed shelf retained' : joint === 'braced' ? 'Ordinary brace retained' : 'Inspected local fault',
            details: joint === 'sealed' ? 'Use the quicker shelf drying task or make actual survey kits. Return a remaining loan when ready.' : 'Ordinary sound stock can brace it. An acquired fitting function or Eda\'s demonstrated part can seal it. No work was promised by asking.', completed: joint === 'sealed'} : null};
}
