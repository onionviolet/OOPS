// The parent owns enrollment, native bindings, common scheduler and durable
// publication. These thin joins use those existing staged transaction owners.
import {assert} from './simulation_contracts.js';
import {commitSimulationCommand} from './simulation.js';
import {applySimulationEffects} from './simulation_effects.js';
import {projectFeatureCommands, featureWorkControls, featureRecordedKnowledge} from './feature_expansion_host.js';
import {NESTED_IDS as N} from './feature_expansion_nested_content.js';
import {REMAINDER_CONSEQUENCES_IDS as I, remainderConsequencesDefinitions as D} from './audit_remainder_consequences_content.js';
import {remainderConsequencesFacts, validateRemainderConsequences, planRemainderConsequencesReconciliation,
    pruneRemainderConsequencesChecks} from './audit_remainder_consequences_facts.js';

export function remainderConsequencesContext(state, context = {}) {
    // Scheduler actor frames carry flat native vitals; command plans carry
    // keyed owners. Normalize the read view without changing either frame.
    const vitals = context.vitals?.player ? context.vitals : context.vitalsByActor ||
        (Number.isFinite(context.vitals?.health) ? {[context.actorId || 'player']: context.vitals} : context.vitals);
    return {...context, facts: {...context.facts, ...remainderConsequencesFacts(state, {...context, vitals})}};
}

// Compose after current nested native/context joins. The finite simulation
// collector has its own persistent body/stock/location, no native copy or gear.
// Existing native Brin and the player retain their live native bindings.
export function remainderConsequencesSimulationContexts(state, contexts = {}) {
    if(state.auditRemainder?.schema !== 1 || !state.simulation) return contexts;
    const next = {...contexts}, player = contexts.player || {};
    for(const actorId of ['player', N.foreman, I.steward, I.collector]) {
        const p = state.simulation.people[actorId];
        if(!p) continue;
        const source = next[actorId] || {actorId, facts: {location: p.location}, vitals: {[actorId]: p.vitals}};
        next[actorId] = remainderConsequencesContext(state, {...source, actorId,
            nativeAlive: source.nativeAlive ?? player.nativeAlive,
            nestedNative: source.nestedNative || player.nestedNative,
            gameplay: source.gameplay || player.gameplay,
            vitals: {...player.vitals, ...source.vitals},
            busy: !!source.busy || (actorId !== 'player' && state.actors.player.worldId !== state.actors[actorId].worldId)});
    }
    return next;
}

// Call after actual completed job counts are recorded and BEFORE event checks,
// and after commands including the old nested restitution. Returns no awards;
// any owner effects pass through the same staged plan/publisher as that action.
export function reconcileRemainderConsequences(out, registry, context = {}) {
    if(out.state.auditRemainder?.schema !== 1) return 0;
    const effects = planRemainderConsequencesReconciliation(out.state);
    if(effects.length) applySimulationEffects(out, effects,
        remainderConsequencesContext(out.state, {...context, actorId: 'player', external: out.external,
            gameplay: out.gameplay, vitals: out.vitals, equipment: out.equipment}), registry,
        `reconcile_remainder_consequences:${++out.state.sequence}`);
    const retired = pruneRemainderConsequencesChecks(out.state);
    return (effects.length ? 1 : 0) + retired;
}

export function commitRemainderConsequencesCommand(state, registry, command, context, expectedSequence = state.sequence) {
    const d = registry.simulation.commands.get(command.id);
    assert(state.schema === 11 && state.auditRemainder?.schema === 1 && context.actorId === 'player' &&
        d?.group === I.group && d.actorId === 'player' && command.type === 'audit_remainder', 'Choose the explicitly enrolled local consequence action.');
    assert(!command.targetId || command.targetId === d.targetId, 'Use the declared person for this particular local interaction.');
    const current = remainderConsequencesContext(state, {...context, actorId: 'player', targetId: d.targetId || null});
    const out = commitSimulationCommand(state, registry, {id: d.id}, current, expectedSequence);
    reconcileRemainderConsequences(out, registry, current);
    validateRemainderConsequences(out.state, registry);
    return out;
}

export function remainderConsequencesPresentation(state, registry, context = {}) {
    if(state.auditRemainder?.schema !== 1 || !state.simulation) return {visible: false, sections: []};
    const current = remainderConsequencesContext(state, context), sections = [], location = context.facts?.location || state.simulation.people.player?.location;
    const actions = projectFeatureCommands(state, registry, current, {groups: [I.group], commandType: 'audit_remainder'})
        .filter(a => {const d = registry.simulation.commands.get(a.id); return state.actors.player.worldId === d.worldId && d.location === location;});
    for(const [prefix, label, description, recordsPrefix] of [
        [`${I.prefix}iona_`, 'Iona’s recent exchange', 'A temporary response between the same two people. The actual parcel order keeps its own payment and custody terms.', 'exchange.remainder.'],
        [`${I.prefix}plot_`, 'Your finite association herb bed', 'One paid planting allocation, one observed local cold draft and one actual native herb harvest.', `${I.facts}plot.`],
        [`${I.prefix}collection_`, 'The retained Saltworks water account', 'One funded local collector, optional fee or actual material repair, and disclosed future-trade terms. Basic departure remains available.', `${I.facts}collection.`],
    ]) {
        const ownActions = actions.filter(a => a.id.startsWith(prefix)), records = featureRecordedKnowledge(state, [recordsPrefix]);
        const job = state.simulation.jobs.find(j => j.actorId === 'player' && j.commandId.startsWith(prefix));
        const work = job ? featureWorkControls(state, registry, [I.group], current) : {work: '', actions: []};
        if(ownActions.length || records.length || work.work) sections.push({id: prefix, label, description,
            ...work, actions: [...ownActions, ...work.actions], records});
    }
    return {visible: sections.length > 0, sections};
}

// Root appends these to People. Only public, player-directed receipts count as
// an introduction. Private commissioning, purse/body and route records stay out.
export function remainderConsequencesPeopleView(state) {
    const known = state.simulation?.knowledge?.player || {}, rows = [];
    const add = (id, name, introducedBy, prefix, location) => {
        if(!known[introducedBy]) return;
        const records = Object.entries(known).filter(([k]) => k.startsWith(prefix));
        rows.push({id, name, location, details: records.map(([, r]) => r.value),
            memories: records.map(([id, r]) => ({id, at: r.at, text: r.value}))});
    };
    add(I.steward, 'Nell, field-association steward', `${I.facts}plot.terms`, `${I.facts}plot.`, 'Last met: Village field association');
    add(I.collector, 'Corin, Saltworks landing collector', `${I.facts}collection.notice`, `${I.facts}collection.`, 'Last met: Saltworks landing');
    return rows;
}

export const remainderConsequencesPublicCommandIds = Object.freeze(D.commands.filter(d => d.actorId === 'player').map(d => d.id));
