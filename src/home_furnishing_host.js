// Native-facing controls use the existing staged executor and single root
// publisher. There is no alternate inventory, scheduler or save path here.
import {assert} from './simulation_contracts.js';
import {commitSimulationCommand} from './simulation.js';
import {projectFeatureCommands, featureWorkControls, featureRecordedKnowledge} from './feature_expansion_host.js';
import {HOME_FURNISHING_IDS as I, homeFurnishingPublicCommandIds} from './home_furnishing_content.js';
import {homeFurnishingsEnrolled, homeFurnishingFacts, validateHomeFurnishings} from './home_furnishing_facts.js';

export function homeFurnishingContext(state, registry, context = {}) {
    return {...context, facts: {...context.facts, ...homeFurnishingFacts(state, context)}};
}
export function commitHomeFurnishingCommand(state, registry, command, context, expectedSequence = state.sequence) {
    const d = registry.simulation.commands.get(command.id);
    assert(command.sequence == null || command.sequence === expectedSequence, 'This workshop request changed; review its current terms.');
    assert(homeFurnishingsEnrolled(state) && context.actorId === 'player' && command.type === I.group &&
        d?.group === I.group && d.actorId === 'player', 'Choose a known, deliberately enrolled player furnishing action.');
    assert(command.targetId == null, 'Workshop furnishings use your own body, actual materials and earned site.');
    const current = homeFurnishingContext(state, registry, {...context, actorId: 'player', targetId: null});
    const out = commitSimulationCommand(state, registry, {id: d.id}, current, expectedSequence);
    validateHomeFurnishings(out.state, registry);
    return out;
}
export function homeFurnishingPresentation(state, registry, context = {}) {
    if(!homeFurnishingsEnrolled(state)) return {visible: false, sections: []};
    const current = homeFurnishingContext(state, registry, context), f = current.facts;
    const actions = projectFeatureCommands(state, registry, current, {groups: [I.group], commandType: I.group});
    for(const action of actions) action.command.sequence = state.sequence;
    const work = featureWorkControls(state, registry, [I.group], current);
    const records = featureRecordedKnowledge(state, [I.prefix]);
    if(f['homeFurnishings.rights']) records.push({id: I.prefix + 'fixture_status', at: state.clock, basis: null,
        text: `Your permitted workshop fixtures: drying rack ${f['homeFurnishings.rackBuilt'] ? 'finished' : f['homeFurnishings.rackFrame'] ? 'framed; finishing still required' : 'not built'}; drafting bench ${f['homeFurnishings.benchBuilt'] ? 'finished' : f['homeFurnishings.benchFrame'] ? 'framed; finishing still required' : 'not built'}. One actual field-workshop capacity remains shared with all its existing jobs.`});
    if(f['homeFurnishings.adapted'] && f['homeFurnishings.matureNotebook']) records.push({id: I.prefix + 'return_use', at: state.clock, basis: null,
        text: 'Your returned, actually compiled Cyoria notebook now supports mundane drafting at this built home bench. Two dry offcuts can become one sound repair stave. A stave and sap can become one native survey kit with your own sharp fitting knife, which returns dulled. Each job holds and returns this same notebook; the notebook supplies design, while your real home materials supply the product.'});
    if(f['homeFurnishings.rackBuilt'] && !f['homeFurnishings.matureRecord']) records.push({id: I.prefix + 'later_route', at: state.clock, basis: null,
        text: 'The rack already dries your counted green offcuts here. The later drafting route needs your own mature Cyoria design notebook compiled after tested lamp control, received research and an honest service outcome. Build and use it when you return with that real notebook; no casting ability travels home.'});
    if(f['homeFurnishings.benchBuilt'] && !f['homeFurnishings.matureNotebook']) records.push({id: I.prefix + 'notebook_required', at: state.clock, basis: null,
        text: 'Bring your own actual Cyorian annotated design notebook to the Shack for adaptation and each drafted fitting/kit job. A stored book, remembered title, lamp or another person\'s record supplies no reserved physical input.'});
    const visible = !!(actions.length || work.work || records.length);
    return {visible, sections: visible ? [{id: I.group, label: 'Your workshop furnishings',
        description: 'Pay for a local fit-out survey, physically build useful fixtures, dry actual stock and later adapt your own retained research into ordinary home fitting and native survey kits. No upkeep or automatic output.',
        ...work, actions: [...actions, ...work.actions], records}] : []};
}
export function homeFurnishingPublicCommands() {return homeFurnishingPublicCommandIds;}
