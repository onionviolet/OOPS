// The normal caller publishes the returned native staged plan exactly once.
import {STEAM_DF_IDS as I, steamDFDefinitions as D, steamDFLegacyKnowledge} from './steam_df_content.js';
import {steamDFFacts, validateSteamDFState} from './steam_df_facts.js';
import {steamDFCurrentReport, steamDFReportText, guardSteamDFAdmission} from './steam_df_runtime.js';
import {commitSimulationCommand, cancelSimulationJob} from './simulation.js';
import {projectFeatureCommands, featureWorkControls, featureRecordedKnowledge} from './feature_expansion_host.js';

const visibleTerms = Object.freeze({
    'Use your current living body and usable hands at the Village bench.': 'Return to the Village bench with healthy, usable hands.',
    'Eda must be present, willing and able to use her own hands.': 'Eda must be here, willing to help and well enough to work.',
    'Eda must retain her actual fitting bench.': 'You need access to Eda’s fitting bench.',
    'The accepted stock sample changed. Reserved costs return without a report or wage.': 'The shelf changed while Eda counted. She returns your fee without issuing a count.',
    'Obtain a current exact report of at least two staves before buying this pair.': 'Ask for a fresh full count showing at least two staves before ordering a pair.',
});
const inWorld = value => typeof value === 'string' ? visibleTerms[value] || value : Array.isArray(value) ? value.map(inWorld) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, ['text', 'label', 'description', 'reason'].includes(k) ? inWorld(v) : typeof v === 'object' ? inWorld(v) : v])) : value;
const check = (ok, message) => {if (!ok) throw new Error(message);};
export function steamDFContext(state, registry, context = {}) {
    return {...context, steamDFHost: true, facts: {...context.facts, ...steamDFFacts(state, context, registry)}};
}
export function commitSteamDFCommand(state, registry, command, context, expectedSequence = state.sequence) {
    check(command.type === I.group && context.actorId === 'player' && expectedSequence === state.sequence, 'This offered-stock action is stale or unavailable.');
    if (command.action === 'cancel') {
        const j = state.simulation?.jobs?.find(j => j.id === command.id && j.actorId === 'player');
        check(j && registry.simulation.commands.get(j.commandId)?.group === I.group, 'Choose the current offered-stock report job.');
        const out = cancelSimulationJob(state, registry, j.id, steamDFContext(state, registry, {...context, targetId: j.targetId}), expectedSequence);
        validateSteamDFState(out.state, registry); return out;
    }
    check(command.action == null, 'Unknown offered-stock service action.');
    const d = registry.simulation.commands.get(command.id);
    check(d?.group === I.group && d.actorId === 'player' && (command.targetId == null || command.targetId === I.owner), 'Choose the declared offered-stock service.');
    validateSteamDFState(state, registry);
    const current = steamDFContext(state, registry, {...context, targetId: I.owner});
    guardSteamDFAdmission(state, d, current);
    const out = commitSimulationCommand(state, registry, {id: d.id}, current, expectedSequence);
    validateSteamDFState(out.state, registry); return out;
}
export function steamDFPresentation(state, registry, context = {}) {
    if (!state.simulation || state.actors?.player?.facts?.['feature_objects.introduced'] !== true) return {visible: false, sections: []};
    const current = steamDFContext(state, registry, context);
    const actions = projectFeatureCommands(state, registry, current, {groups: [I.group], commandType: I.group}).map(a => ({...a, reasons: a.reasons.map(inWorld), legibility: inWorld(a.legibility)}));
    const work = featureWorkControls(state, registry, [I.group], current);
    work.actions = work.actions.map(a => ({...a, command: {type: I.group, action: 'cancel', id: a.command.id, sequence: state.sequence}}));
    const records = featureRecordedKnowledge(state, [I.prefix]).filter(r => r.id !== I.report).map(r => ({...r, text: steamDFLegacyKnowledge[r.id] ? D.commands.flatMap(d => d.effects).find(e => e.type === 'knowledge' && e.key === r.id).value : r.text}));
    const {report, knowledge, current: reportCurrent} = steamDFCurrentReport(state);
    if (report && knowledge) records.push({id: I.report,
        text: `${steamDFReportText(report)} ${reportCurrent ? 'The shelf still matches your note.' : 'Your old count is out of date. Eda has moved stock since then; ask for another count.'}`});
    const pending = state.simulation.jobs.find(j => j.actorId === 'player' && registry.simulation.commands.get(j.commandId)?.group === I.group);
    if (pending) records.push({id: 'steam.df.pending', text: 'Eda is counting at the bench. If the work stops, she returns your fee. There will be no count to write down until she finishes.'});
    return {visible: actions.length > 0 || !!work.work || records.length > 0, sections: [{id: I.group, label: 'Eda’s offered-stock reports',
        description: 'Eda rests a hand on the stacked wood. Ask what she has, or order a pair against her latest count.',
        ...work, actions: [...actions, ...work.actions], records}]};
}
