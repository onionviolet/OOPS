import {remainderCombatObjectivesAdmissionChoices} from './audit_remainder_combat_objectives_host.js';
import {remainderCombatFitLioSupported} from './audit_remainder_combat_fit_facts.js';
import {FEATURE_SPECIALIZATIONS,featurePowerFacts,featurePowerDefinitions} from './feature_expansion_powers.js';
import {featureBattleDefinitions,featureBattleFacts,featureBattleToken,previewFeatureBattleAdmission,FEATURE_BATTLE_SCHEMA,isFeatureBattleSchema,initializeFeatureBattle} from './feature_expansion_battle.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob,enrollSimulation} from './simulation.js';
import {meets} from './simulation_contracts.js';
export function featurePowerContext(state,context={}) {return {...context,facts:{...context.facts,...featurePowerFacts(state,context),...featureBattleFacts(state,context)}};}
function publicFacts(state,context) {return {...context.facts,...Object.fromEntries(Object.entries(state.actors.player.facts).map(([k,v])=>[`actor.${k}`,v])),
    ...Object.fromEntries(Object.entries(state.campaign.facts).map(([k,v])=>[`campaign.${k}`,v]))};}
function row(state,registry,context,d,extra={}) {
    const p=previewSimulationCommand(state,registry,d.id,{...context,targetId:d.targetId||null});
    return {id:d.id,label:d.label,description:d.description||'',eligible:p.eligible,reasons:p.reasons,
        terms:`${d.duration||0} played minutes · cancellation ${d.cancellation||'none'}`,
        command:{type:'feature_command',id:d.id,targetId:d.targetId||null,sequence:state.sequence,...extra}};
}
// Returns the integrator's generic read-only section/row shape. No DOM, draws,
// writes or enrollment occur while a visible method/encounter is projected.
export function featurePowerPresentation(state,registry,context={},battleView=null,{battleRunning=false}={}) {
    context=featurePowerContext(state,context);const s=state.simulation,sections=[],facts=publicFacts(state,context),knowledge=s?.knowledge.player||{},a=state.actors.player;
    for(const f of FEATURE_SPECIALIZATIONS) {
        const p=s?.powers.player?.[f.id];if(!p?.owned||(p.mastery||0)<4)continue;
        const actions=[];
        for(const definition of featurePowerDefinitions.commands.filter(d=>d.powerId===f.id)) {
            const d=registry.simulation.commands.get(definition.id);if(!d||d.once&&a.completed[d.id]||!meets(d.visibleWhen,facts))continue;
            if(s)actions.push(row(state,registry,context,d));
        }
        sections.push({id:`mature_${f.key}`,label:`${f.label} · mastery ${p.mastery}`,description:`Current function: ${f.choices.find(c=>c.id===facts[`feature.powers.${f.key}.choice`])?.label||'choose a trained specialization'}. Mastery six expands scope; eight improves efficiency. These authored drills do not define a universal ceiling.`,actions,
            records:Object.entries(knowledge).filter(([id])=>id.startsWith(`feature.powers.${f.key}.`)).map(([id,r])=>({id,text:r.value}))});
    }
    const apparatus=featurePowerDefinitions.commands.filter(d=>!d.powerId).filter(d=>meets(d.visibleWhen,facts)&&!(d.once&&a.completed[d.id]));
    if(apparatus.length&&s)sections.push({id:'mature_apparatus',label:'Owned field apparatus',description:'Ordinary supplies make the same real harness. Lio uses only his own consent, body, trained source and actual equipment.',actions:apparatus.map(d=>row(state,registry,context,registry.simulation.commands.get(d.id)))});
    const known=a.facts['feature.battle.seen']===true;
    const discover=registry.simulation.commands.get('feature_battle.inspect');
    if(known||discover&&meets(discover.visibleWhen,facts)&&!a.completed[discover.id]) {
        const actions=[],records=[];
        if(!s)actions.push({id:'feature_powers.enroll',label:'Follow the sluice lead through local people & work',description:'Explicitly activate the existing shared local services. This step spawns no tollkeepers, starts no fight and teaches no method; inspect the claim afterward.',eligible:!context.busy&&context.facts?.location==='Village'&&a.worldId==='base.frontier',reasons:context.busy?['Finish the current native activity first.']:context.facts?.location!=='Village'?['Return to Village to follow this lead.']:[],command:{type:'feature_enroll',sequence:state.sequence}});
        if(s&&!battleView)for(const definition of featureBattleDefinitions.commands) {
            const d=registry.simulation.commands.get(definition.id);if(!d||d.once&&a.completed[d.id]||!meets(d.visibleWhen,facts))continue;
            if(d.id==='feature_battle.start') {
                const quote=previewFeatureBattleAdmission(state,registry,context,{});
                actions.push({...row(state,registry,context,d),eligible:quote.eligible,reasons:quote.reasons});
                for(const preparation of remainderCombatObjectivesAdmissionChoices(state,context)) {
                    const quote=previewFeatureBattleAdmission(state,registry,context,preparation.command);
                    actions.push({...row(state,registry,context,d,preparation.command),id:`feature_battle.start_${preparation.id}`,label:`Challenge: ${preparation.label}`,eligible:quote.eligible,reasons:quote.reasons});
                }
            } else actions.push(row(state,registry,context,d));
            if(d.id==='feature_battle.start'&&(state.auditRemainder?remainderCombatFitLioSupported(state):facts['skills.lioSupported'])) {
                const quote=previewFeatureBattleAdmission(state,registry,context,{withHelper:true});
                actions.push({...row(state,registry,context,d,{withHelper:true}),id:'feature_battle.start_with_lio',label:'Challenge with Lio’s paid native support · 1 coin + 1 stamina',eligible:quote.eligible,reasons:quote.reasons});
            }
        }
        if(battleView) {
            if(!battleRunning)actions.push({id:'feature_battle.resume',label:'Resume the saved native sluice encounter',eligible:!context.busy,reasons:context.busy?['Finish the current native activity first.']:[],command:{type:'feature_battle_resume',...featureBattleToken(state)}});
            for(const action of battleView.actions)actions.push({...action,command:{...action.command,type:'feature_battle_action',actionType:action.command.type},terms:`${action.cost} actual stamina · prior wounds/materials persist`});
            records.push({id:'feature_battle.current',text:`${battleView.last} Gate ${battleView.objective.progress}/${battleView.objective.required}; retreat ${battleView.escape.progress}/${battleView.escape.required}; ${battleView.guardsTaken} guarded attempts.`});
            for(const fighter of battleView.fighters)records.push({id:`feature_battle.fighter.${fighter.id}`,text:`${fighter.label}: ${fighter.status}${fighter.vitals?`, HP ${Math.round(fighter.vitals.health*10)/10}/${fighter.vitals.max_health}, stamina ${Math.round(fighter.vitals.stamina*10)/10}/${fighter.vitals.max_stamina}`:''}.`});
        }
        for(const [id,r] of Object.entries(knowledge).filter(([id])=>id.startsWith('feature.battle.')))records.push({id,text:r.value});
        sections.push({id:'mature_native_battle',label:'The sluice claim',description:known?'Known local opponents with separate native bodies and equipment. Your methods change targets, held guards, paid material support, gate progress and retreat. The slower drainage walk remains viable.':'You can inspect the claimed sluice before deciding how to pass.',actions,records});
    }
    const jobs=s?.jobs.filter(j=>j.actorId==='player'&&['feature_powers','feature_battle'].includes(registry.simulation.commands.get(j.commandId)?.group))||[];
    if(jobs.length)sections.push({id:'mature_work',label:'Accepted method work',work:jobs.map(j=>`${j.label}: ${Math.max(0,j.due-state.clock)} played minutes left; cancellation ${j.cancellation}.`).join(' '),actions:jobs.map(j=>({id:`cancel:${j.id}`,label:'Cancel this accepted work',eligible:true,reasons:[],command:{type:'feature_cancel',jobId:j.id,sequence:state.sequence}}))});
    return {visible:sections.length>0,sections};
}
// Exact selected command dispatch, suitable for the parent actFeature handler.
// Native actions require the actual host, rather than trusting UI-provided stats.
export function planFeaturePowerCommand(state,registry,command,context,expectedSequence=command.sequence??state.sequence) {
    context=featurePowerContext(state,context);
    if(command.type==='feature_enroll') {
        const d=registry.simulation.commands.get('feature_battle.inspect');
        if(state.simulation||state.actors.player.worldId!=='base.frontier'||context.facts?.location!=='Village'||!d||!meets(d.visibleWhen,publicFacts(state,context)))throw new Error('No supported new local lead to activate.');
        return enrollSimulation(state,registry,context,expectedSequence);
    }
    if(command.type==='feature_cancel') {
        const job=state.simulation?.jobs.find(j=>j.id===command.jobId&&j.actorId==='player');
        if(!['feature_powers','feature_battle'].includes(registry.simulation.commands.get(job?.commandId)?.group))throw new Error('No selected method work to cancel.');
        return cancelSimulationJob(state,registry,job.id,context,expectedSequence);
    }
    if(command.type!=='feature_command'||!['feature_powers','feature_battle'].includes(registry.simulation.commands.get(command.id)?.group))throw new Error('Unknown selected method command.');
    return command.id==='feature_battle.start'?initializeFeatureBattle(state,registry,command,context,expectedSequence):commitSimulationCommand(state,registry,command,{...context,targetId:command.targetId||null},expectedSequence);
}
export function isFeatureBattle(state){return isFeatureBattleSchema(state.simulation?.sessions.player?.nativeBattle?.schema);}
