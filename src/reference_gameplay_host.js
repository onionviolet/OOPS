import {REFERENCE_GAMEPLAY_IDS as I, REFERENCE_GAMEPLAY_KEYS as K, referenceGameplayDefinitions} from './reference_gameplay_content.js';
import {featureObjectFacts} from './feature_expansion_objects_host.js';
import {commitSimulationCommand, previewSimulationCommand, simulationFacts, simulationOccupiesActor} from './simulation.js';
import {assert, natural, record, meets} from './simulation_contracts.js';
const active = (state, actor, id) => {
    const source = state.actors?.[actor]?.sources?.[id], faculty = state.simulation?.faculties?.[actor]?.[id];
    return !!source && (source.expiresAt == null || source.expiresAt > state.clock) && faculty?.awakened === true && faculty.active === true && faculty.suppressed !== true;
};
const ownedTool = (state, context, key) => natural(context.gameplay?.player?.inventory?.[key]) && context.gameplay.player.inventory[key] > 0 &&
    !Object.values(state.simulation?.custody || {}).some(c => c.holder === 'player' && c.key === key) &&
    !Object.values(context.equipment?.player || state.simulation?.equipment?.player || {}).includes(key);
export function referenceGameplayFacts(state, context = {}, registry) {
    const objects = featureObjectFacts(state, context, registry), s = state.simulation, a = state.actors?.player;
    const enabled = state.referenceGameplay?.schema === 1, opened = !!state.referenceGameplay?.workshop && a?.facts?.['reference_gameplay.opened'] === true;
    const location = context.facts?.location || s?.people?.player?.location;
    const teacher = objects['featureObjects.miriSupported'] === true;
    const pole = s?.equipment?.[I.hook]?.hook_pole;
    const hook = s?.people?.[I.hook];
    return {
        'reference.workshop.opened': enabled && opened,
        // Absence is explicitly unowned so the first paid lesson is discoverable.
        [`power.${I.cooling}.owned`]: s?.powers?.player?.[I.cooling]?.owned === true,
        'reference.workshop.supported': enabled && objects['featureObjects.supported'] === true,
        'reference.workshop.handsUsable': objects['featureObjects.handsUsable'] === true,
        'reference.workshop.edaPresent': teacher,
        'reference.workshop.teacherSupported': enabled && teacher && active(state, I.teacher, I.cooling) && s?.powers?.[I.teacher]?.[I.cooling]?.owned === true,
        'reference.workshop.charged': ownedTool(state, context, K.charged),
        'reference.workshop.empty': ownedTool(state, context, K.empty),
        'reference.workshop.functionReady': enabled && s?.powers?.player?.[I.cooling]?.owned === true && s.powers.player[I.cooling].mastery >= 3 && active(state, 'player', I.cooling) &&
            s?.knowledge?.player?.['reference_gameplay.method']?.stage === 'understood',
        'reference.workshop.hookSupported': enabled && hook?.life === 'alive' && hook.vitals?.health > 1 && hook.location === location && state.actors?.[I.hook]?.worldId === a?.worldId &&
            pole === K.pole && (s?.owners?.[I.hook]?.[pole] || 0) > 0 && !Object.values(s?.custody || {}).some(c => c.holder === I.hook && c.key === pole) && !simulationOccupiesActor(state, I.hook),
        'reference.workshop.hookCooled': (s?.conditions?.[I.hook]?.[I.field]?.expiresAt || 0) > state.clock,
    };
}
export function referenceGameplayContext(state, registry, context = {}) {
    return {...context, facts: {...context.facts, ...referenceGameplayFacts(state, context, registry)}};
}
export function commitReferenceGameplayCommand(state, registry, command, context, expectedSequence = state.sequence) {
    const d = registry.simulation.commands.get(command.id);
    assert(d?.group === I.group && d.actorId === 'player' && context.actorId === 'player', 'Unsupported cooling workshop command.');
    assert(!command.targetId || command.targetId === d.targetId, 'Choose the actual declared cooling participant.');
    assert(state.referenceGameplay?.schema === 1, 'Enroll the optional reference gameplay first.');
    const out = commitSimulationCommand(state, registry, {id: d.id}, referenceGameplayContext(state, registry, {...context, targetId: d.targetId || null}), expectedSequence);
    if(d.id === I.open) {
        assert(!out.state.referenceGameplay.workshop, 'The cooling workshop is already open.');
        out.state.referenceGameplay.workshop = {schema: 1, openedAt: out.state.clock, openedSequence: out.state.sequence};
    }
    validateReferenceGameplayWorkshop(out.state.referenceGameplay.workshop, out.state, registry);
    return out;
}
export function previewReferenceGameplayCommand(state, registry, commandId, context) {
    const d = registry.simulation.commands.get(commandId);
    assert(d?.group === I.group, 'Unsupported cooling workshop preview.');
    return previewSimulationCommand(state, registry, commandId, referenceGameplayContext(state, registry, {...context, targetId: d.targetId || null}));
}
// This namespace stores only the explicit meeting receipt. All executable means,
// progression, purchases, refunds and fields stay with existing authoritative owners.
export function validateReferenceGameplayWorkshop(value, state, registry) {
    const opened = state.actors?.player?.facts?.['reference_gameplay.opened'] === true;
    const related = [state.simulation?.powers?.player?.[I.cooling], state.simulation?.powers?.[I.teacher]?.[I.cooling],
        state.simulation?.conditions?.[I.hook]?.[I.field]].some(Boolean);
    if(value == null) {assert(!opened && !related, 'Cooling activation lost its meeting receipt.'); return;}
    assert(state.referenceGameplay?.schema === 1 && record(value) && value.schema === 1 && Object.keys(value).every(k => ['schema', 'openedAt', 'openedSequence'].includes(k)), 'Unsupported cooling workshop state.');
    assert(natural(value.openedAt) && value.openedAt <= state.clock && natural(value.openedSequence) && value.openedSequence > 0 && value.openedSequence <= state.sequence &&
        opened && state.actors.player.completed[I.open] === 1, 'Invalid explicit cooling meeting receipt.');
    assert(state.simulation?.people?.[I.teacher]?.definitionId === I.teacher && state.simulation?.sites?.[I.site], 'Cooling requires the retained real fitter and bench.');
    if(registry) assert(registry.simulation?.commands?.get(I.open)?.revision === 1 && registry.simulation.powers.has(I.cooling) && registry.simulation.conditions.has(I.field), 'Cooling content is unavailable.');
    const field = state.simulation?.conditions?.[I.hook]?.[I.field];
    if(field) {
        const ordinary = state.simulation.knowledge.player?.['reference_gameplay.hook'];
        const refined = state.simulation.knowledge.player?.['reference.coolingRefinement.steady_hook'];
        const supported=(receipt,command,duration)=>state.actors.player.completed[command]>0&&receipt?.cause===field.cause&&receipt.at+duration===field.expiresAt&&receipt.basis?.attributedTo==='player';
        assert(natural(field.expiresAt) && field.expiresAt <= state.clock + 5 && field.intensity === 1 &&
            (supported(ordinary,'reference_gameplay.cool_hook',4)||supported(refined,'reference_gameplay.steady_hook',5)), 'Unsupported cooling field lifetime, strength or paid attribution.');
    }
}
// Common conditions already supply the expiry boundary and remove this field.
// No second timer, source upkeep or background NPC consent is created here.
export function referenceGameplayNextBoundary(state) {
    const due = state.referenceGameplay?.workshop ? state.simulation?.conditions?.[I.hook]?.[I.field]?.expiresAt : null;
    return due != null && due > state.clock ? due : Infinity;
}
export function referenceGameplayPresentation(state, registry, context) {
    if(state.referenceGameplay?.schema !== 1) return {visible: false, actions: [], records: []};
    const current = referenceGameplayContext(state, registry, context), opened = current.facts['reference.workshop.opened'];
    const actions = [];
    for(const d of referenceGameplayDefinitions.commands) {
        if(d.once && state.actors?.player?.completed?.[d.id]) continue;
        // Optional workshops and encounters introduce their own participants.
        // Rendering an unrelated feat record cannot create or inspect them.
        if(d.targetId&&(!state.simulation?.people?.[d.targetId]||!state.actors?.[d.targetId]))continue;
        const ctx = {...current, targetId: d.targetId || null};
        if(!meets(d.visibleWhen, simulationFacts(state, ctx, registry))) continue;
        const p = previewSimulationCommand(state, registry, d.id, ctx);
        if(p.visible) actions.push({id: d.id, targetId: d.targetId || null, label: d.label, description: d.description || '', eligible: p.eligible,
            reasons: p.reasons, costs: p.costs, duration: p.duration, cancellation: d.cancellation || 'none', automatable: false});
    }
    const job = state.simulation?.jobs?.find(j => registry.simulation.commands.get(j.commandId)?.group === I.group && j.actorId === 'player');
    const records = Object.entries(state.simulation?.knowledge?.player || {}).filter(([id]) => id.startsWith('reference_gameplay.')).map(([id, r]) => ({id, text: r.value, at: r.at, basis: r.basis ? {...r.basis} : null}));
    return {visible: opened || actions.length > 0 || !!job, label: 'Measured cooling with Eda', actions, records,
        mastery: state.simulation?.powers?.player?.[I.cooling]?.owned ? state.simulation.powers.player[I.cooling].mastery : null,
        usefulThreshold: 3, practicePlanId: I.plan, practiceGoalReached: current.facts['reference.workshop.functionReady'],
        work: job ? {id: job.id, label: job.label, remainingMinutes: Math.max(0, job.due - state.clock), cancellation: job.cancellation} : null};
}
