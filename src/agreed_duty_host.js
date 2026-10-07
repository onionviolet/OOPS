// ACS-P03 join-ready hooks. The parent owns the common registry, scheduler,
// effect publisher and UI mounts; these helpers only decorate those owners.
import {AGREED_DUTY_IDS as I, AGREED_DUTY_POLICY as P, agreedDutyController,
    agreedDutyDefinitions, agreedDutyFollowupDefinitions} from './agreed_duty_content.js';
import {agreedDutyFacts, agreedDutyReadiness, agreedDutyReceiptValue,
    agreedDutyReceiptMatches, agreedDutySelectedCommand, validateAgreedDutyState} from './agreed_duty_facts.js';
import {SOCIETY_IDS as S} from './feature_expansion_society.js';
import {commitSimulationCommand,previewSimulationCommand,simulationFacts} from './simulation.js';

const know = (key, value, attributedTo) => ({type:'knowledge',actor:'player',key:`${S.prefix}.duty.${key}`,stage:'seen',value,
    basis:{kind:'observation',attributedTo,situationId:`${S.prefix}.home_agreement`}});
const clearPreference = {type:'world',worldId:S.world,key:`${S.prefix}.dutyPreference`,value:false};
const dutyTerminalMarker = commandId => ({type:'world',worldId:S.world,key:'feature_society.dutyTerminalCommand',value:commandId});
const commandIds = new Set([...agreedDutyDefinitions.commands,...agreedDutyFollowupDefinitions.commands].map(d=>d.id));
const legacyDuplicateIds = new Set([`${S.prefix}.authorize_home`,`${S.prefix}.fund_lesson`,`${S.prefix}.request_apprentice`]);

function withAgreedDutyFacts(state,registry,context) {
    const base=simulationFacts(state,{...context,targetId:context.targetId || null},registry);
    return {...context,facts:{...base,...agreedDutyFacts(state,context)}};
}

export function joinAgreedDutyDefinitions(definitions) {
    const commandIds = new Set((definitions.commands || []).map(d => d.id));
    const added = [...agreedDutyDefinitions.commands,...agreedDutyFollowupDefinitions.commands];
    for(const d of added) {
        if(commandIds.has(d.id)) throw new Error(`Duplicate ACS-P03 command ${d.id}.`);
        commandIds.add(d.id);
    }
    return {...definitions, commands:[...(definitions.commands || []),...added],
        controllers:(definitions.controllers || []).map(agreedDutyController)};
}

export function agreedDutySocietyCommandAdmission(state,commandId) {
    const prebooked=state.worlds?.[S.world]?.facts?.[`${S.prefix}.dutyPrebooked`]===true;
    return legacyDuplicateIds.has(commandId)&&prebooked
        ? {allowed:false,reason:'This household already made the one-coin joint booking. Continue its actual repair, lesson and reports; do not repeat the original offer.'}
        : {allowed:true,reason:''};
}

export function assertAgreedDutySocietyCommandAdmission(state,commandId) {
    const result=agreedDutySocietyCommandAdmission(state,commandId);
    if(!result.allowed) throw new Error(result.reason);
    return true;
}

export function agreedDutyFilterSocietyActions(state,actions) {
    return (actions||[]).filter(action=>agreedDutySocietyCommandAdmission(state,action.id).allowed);
}

export function agreedDutyPresentation(state,registry,context) {
    if(!state.simulation||state.actors?.player?.facts?.[`${S.prefix}.introduced`]!==true)return {visible:false,actions:[]};
    const ctx=withAgreedDutyFacts(state,registry,{...context,actorId:'player'}), all=[...agreedDutyDefinitions.commands,...agreedDutyFollowupDefinitions.commands];
    const actions=[], readiness=agreedDutyReadiness(state);
    for(const definition of all) {
        const preview=previewSimulationCommand(state,registry,definition.id,{...ctx,targetId:definition.targetId||null});
        if(!preview.visible) continue;
        const reasons=[...(preview.reasons||[])];
        if(agreedDutyDefinitions.commands.some(d=>d.id===definition.id)&&!readiness.ready&&readiness.reason&&!reasons.includes(readiness.reason))reasons.push(readiness.reason);
        actions.push({id:definition.id,label:definition.label,description:definition.description||'',targetId:definition.targetId||null,
            eligible:preview.eligible,reasons,duration:preview.duration,cancellation:definition.cancellation||'none',
            costs:preview.eligible?preview.costs:[],command:{type:'command',id:definition.id,targetId:definition.targetId||null}});
    }
    const preference=state.worlds?.[S.world]?.facts?.[`${S.prefix}.dutyPreference`];
    const selected=agreedDutySelectedCommand(state),activeJob=selected&&state.simulation?.jobs?.find(job=>job.commandId===selected&&job.actorId===S.craftsperson)||null;
    let paused=false,pauseReason='';
    if(selected&&!activeJob) {
        const duty=registry.simulation.commands.get(selected), dutyTarget=duty?.targetId||null;
        const actorContext=withAgreedDutyFacts(state,registry,{...context,actorId:S.craftsperson,targetId:dutyTarget,worldId:S.world,busy:false,
            facts:{...(context.facts||{}),location:'Village'},vitals:{...(context.vitals||{}),[S.craftsperson]:state.simulation.people[S.craftsperson]?.vitals||{},[S.apprentice]:state.simulation.people[S.apprentice]?.vitals||{}}});
        const quote=previewSimulationCommand(state,registry,selected,actorContext);
        paused=!quote.eligible; pauseReason=paused?(quote.reasons||[]).join(' '):'';
    }
    const status=state.simulation?.knowledge?.player?.[I.resultKey]||null;
    let result=null;
    if(status&&agreedDutyReceiptMatches(state)) {
        try {const data=JSON.parse(status.value);result={status:data.status,preference:data.preference,note:data.note,at:status.at,cause:status.cause,basis:status.basis};} catch {}
    }
    return {visible:actions.length>0||!!selected||!!status,actions,preference:typeof preference==='string'?preference:null,
        selectedCommandId:selected,working:!!activeJob,paused,pauseReason,
        agreement:state.simulation?.knowledge?.player?.[I.agreementKey]||null,result,followupAvailable:actions.some(a=>[I.followupRepair,I.followupLesson].includes(a.id))};
}

export function commitAgreedDutyAction(state,registry,context,commandId,expectedSequence=state.sequence) {
    if(!commandIds.has(commandId)) throw new Error('This is not one of the five bounded household scheduling choices.');
    const admission=agreedDutySocietyCommandAdmission(state,commandId);
    if(!admission.allowed) throw new Error(admission.reason);
    const definition=registry.simulation.commands.get(commandId);
    if(!definition) throw new Error(`The current registry is missing ${commandId}.`);
    const ctx=withAgreedDutyFacts(state,registry,{...context,actorId:'player',targetId:definition.targetId||null});
    return commitSimulationCommand(state,registry,{id:commandId,targetId:definition.targetId||null},ctx,expectedSequence);
}

export function agreedDutyCompletionEffects(state, job) {
    const selected = agreedDutySelectedCommand(state);
    if(!selected || !job || job.commandId !== selected) return [];
    const value = agreedDutyReceiptValue(state,job,'kept');
    return value ? [clearPreference,know('result',value,S.craftsperson)] : [];
}

export function agreedDutyCancellationEffects(state, job) {
    const selected = agreedDutySelectedCommand(state);
    if(!selected || !job || job.commandId !== selected) return [];
    const value = agreedDutyReceiptValue(state,job,'cancelled');
    return value ? [clearPreference,dutyTerminalMarker(job.commandId),know('result',value,S.craftsperson)] : [];
}

export function agreedDutyStoppedEffects(state, job) {
    const selected=agreedDutySelectedCommand(state);
    if(!selected||!job||job.commandId!==selected)return [];
    const value=agreedDutyReceiptValue(state,job,'stopped');
    return value?[clearPreference,dutyTerminalMarker(job.commandId),know('result',value,S.craftsperson)]:[];
}

export function agreedDutyRefusalEffects(state) {
    const selected = agreedDutySelectedCommand(state);
    if(!selected) return [];
    const route = selected === I.lesson ? 'lesson' : state.worlds?.[S.world]?.facts?.[`${S.prefix}.dutyPreference`] === P.values.ordinary ? 'ordinary' : 'repair';
    const agreement = state.simulation?.knowledge?.player?.[I.agreementKey];
    if(!agreement) return [];
    const value = JSON.stringify({schema:1,status:'refused',preference:route,agreementCause:agreement.cause,
        dutyCommandId:selected,jobId:null,note:P.currentReceipts[route].refused});
    return [clearPreference,dutyTerminalMarker(selected),know('result',value,S.craftsperson)];
}

export function agreedDutyPeopleView(state) {
    const knowledge = state.simulation?.knowledge?.player || {}, specs = [
        [S.household,'Hessa, household keeper'],[S.craftsperson,'Orr, local joiner'],[S.apprentice,'Vale, prospective apprentice']];
    return specs.map(([id,name]) => {
        const entries = Object.entries(knowledge).filter(([key,r]) => key.startsWith(`${S.prefix}.duty.`) && r.basis?.attributedTo === id &&
            (key !== I.resultKey || agreedDutyReceiptMatches(state)));
        const visibleValue = (key,r) => {
            if(key !== I.resultKey) return r.value;
            try {return JSON.parse(r.value).note;} catch {return '';}
        };
        const rows=entries.map(([key,r])=>({id:key,at:r.at,text:visibleValue(key,r),cause:r.cause})).filter(r=>r.text);
        return {id,name,location:'Last met: Village',details:rows.map(r=>r.text),memories:rows};
    }).filter(row=>row.details.length);
}

export {validateAgreedDutyState};
