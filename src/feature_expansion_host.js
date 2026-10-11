import {previewSimulationCommand, simulationFacts, previewSimulationResponse} from './simulation.js';
import {meets} from './simulation_contracts.js';
import {featureLegibilityRow,featureActionDisclosure} from './feature_expansion_legibility.js';
import {projectAcceptedWorkLegibility,projectSimulationAftermath} from './action_legibility.js';

const text = v => typeof v === 'string' ? v : v?.known === false ? '' : v?.text || v?.reason || '';
const itemName = key => {try {return JSON.parse(key).id || 'material';} catch {return 'material';}};
const resourceNames={'book.paradise.coin':'district credits','book.paradise.belli':'belli','book.paradise.attention':'available attention','book.paradise.agenda':'available operation time','book.mol.crowns':'local crowns','book.mol.deviceFuel':'stored lamp charge','book.mol.personalMana':'personal mana','book.mol.attention':'available attention'};
export function featureCostText(costs = []) {
    return costs.map(c => {
        if(c.type === 'transfer') return `${c.count} ${itemName(c.key)} handed over`;
        if(c.type === 'item') return `${Math.abs(c.amount)} ${itemName(c.key)}`;
        if(c.type === 'vital') return `${Math.abs(c.amount)} ${c.key}`;
        if(c.type === 'resource') return `${Math.abs(c.amount)} ${c.key === 'money' ? 'coins' : resourceNames[c.key] || c.key.replaceAll('_', ' ')}`;
        if(c.type === 'loan') return `${c.count} ${itemName(c.key)} borrowed under the agreed return`;
        if(c.type === 'return') return 'the held loan returned';
        return '';
    }).filter(Boolean).join(', ');
}

// Stable command definitions supply disclosure. The evaluator owns legality,
// costs and frozen outcomes. Reading this projection spends nothing.
export function projectFeatureCommands(state, registry, context, {groups, prefixes = [], commandType = 'command'} = {}) {
    if(!state.simulation) return [];
    const actor = state.actors.player, s = state.simulation, actions = [];
    for(const d of registry.simulation.commands.values()) {
        if(d.actorId !== 'player' || !(groups?.includes(d.group) || prefixes.some(p => d.id.startsWith(p)))) continue;
        // Optional residents are not created by viewing another enrolled family.
        if(d.targetId && !s.people[d.targetId]) continue;
        if(d.once && actor.completed[d.id] || d.claim && s.claims[d.claim]) continue;
        const ctx = {...context, targetId:d.targetId || null};
        if(!meets(d.visibleWhen, simulationFacts(state, ctx, registry))) continue;
        const preview = previewSimulationCommand(state, registry, d.id, ctx);
        if(!preview.visible) continue;
        const costs = featureCostText(preview.costs || d.costs), terms = [];
        if(costs) terms.push(costs);
        terms.push(`${Math.max(0, preview.duration || 0)} played minutes`);
        if(preview.duration) terms.push(d.cancellation === 'refund' ? 'Cancel to return reserved inputs.' : d.cancellation === 'forfeit' ? 'Cancellation keeps spent inputs spent.' : 'Accepted work has no cancellation.');
        actions.push({id:d.id, label:d.label, description:d.description || '', terms:terms.join(' · '), eligible:preview.eligible,
            legibility:featureLegibilityRow(state,registry,ctx,d.id,preview),
            reasons:preview.reasons?.map(text).filter(Boolean) || [], command:{type:commandType,id:d.id,targetId:d.targetId || null}});
    }
    return actions;
}

export function featureRecordedKnowledge(state, prefixes) {
    return projectSimulationAftermath({state}).filter(row=>prefixes.some(prefix=>row.id.startsWith(prefix)))
        .map(row=>({id:row.id,text:`${row.basisLabel}: ${row.text}${row.timeText?` · ${row.timeText}`:''}`}));
}

export function featureWorkControls(state, registry, groups, context={actorId:'player'}) {
    const job = state.simulation?.jobs.find(j => j.actorId === 'player' && groups.includes(registry.simulation.commands.get(j.commandId)?.group));
    if(!job) return {work:'', actions:[]};
    const action = registry.simulation.commands.get(job.commandId);
    const ctx={...context,targetId:job.targetId||null},disclosure=featureActionDisclosure(state,registry,ctx,action);
    const accepted=projectAcceptedWorkLegibility({job,clock:state.clock,label:action.label,context:ctx,disclosure});
    return {work:[accepted.label,accepted.remainingText,...accepted.costs.map(cost=>cost.text),accepted.cancellation.text].join(' · '),accepted, actions:job.cancellation === 'none' ? [] : [{id:`cancel:${job.id}`,
        label:job.cancellation === 'refund' ? 'Cancel work · return reserved inputs' : 'Cancel work · keep spent costs', eligible:true,
        command:{type:'cancel',id:job.id}, reasons:[]}]};
}

export function featureEncounterControls(state, registry, context, groups) {
    const session = state.simulation?.sessions.player;
    if(!session || session.nativeBattle || !groups.includes(registry.simulation.commands.get(session.commandId)?.group)) return null;
    const ctx = {...context,targetId:session.targetId};
    const turn = session.turns[session.turn];
    return {work:turn.cue, actions:[...turn.responses.filter(r => meets(r.visibleWhen, simulationFacts(state,ctx,registry))).map(r => {
        const p = previewSimulationResponse(state,registry,{kind:'encounter',responseId:r.id},ctx);
        return {id:`response:${r.id}`,label:r.label,eligible:p.eligible,reasons:p.reasons,command:{type:'response',responseId:r.id}};
    }), {id:'withdraw',label:'Withdraw · retain costs already spent',eligible:!context.busy,reasons:context.busy?['Finish your current native activity first.']:[],command:{type:'withdraw'}}]};
}
