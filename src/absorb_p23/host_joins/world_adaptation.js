import {planPathWork,quotePathWork} from '../../mistglass_path_work.js';
import {assertNativeItemDisposition} from '../../native_gameplay_adapter.js';
import {retainMistglassOrigin,validateMistglassOrigin,observeMistglassHistory,mistglassHistoryView,MISTGLASS_HISTORY_SITUATION} from '../../mistglass_history.js';
// P00 native owner joins for the original opt-in Mistglass proposal.
import {check, natural as nat} from '../../basics.js';
import {mistglassProfile as P,mistglassEnergyPolicy,validateAdaptation,prepareEnrollment,prepareAdvance,prepareTrial,adaptationView,previewTrial,prepareCultivationMethod,previewSluice,prepareSluice,prepareBraceRestoration,sluiceHistories} from '../world_adaptation/index.js';
import {applyEnergyEffect} from '../../energy_resources.js';
import {applyGameplayEffect} from '../../gameplay_transactions.js';
import {drawUnit,keyedUnit,scopedStream} from '../../seeded_streams.js';
import {createWorldInstance,createWorldVisit,validateWorldInstance,validateWorldVisit,planWorldClock,planWorldDeparture} from '../../world_instances.js';
export const MISTGLASS_LOCATION=P.locationId;
export const MISTGLASS_KEEPER='p23.mistglass.keeper';
export const MISTGLASS_DEFINITION=Object.freeze({id:'p23.mistglass',worldId:P.worldId,revision:1,label:'Mistglass conservatory (proposal)',unidentifiedLabel:'An optional conservatory',regions:[{id:'p23.mistglass.room',layerIds:['material']}],sites:[{id:MISTGLASS_LOCATION,label:'Conservatory',regionId:'p23.mistglass.room',layerId:'material',initialOpen:true}],initialFacts:{'method.available':true},uniqueClaimIds:[]});
const endpoint=instanceId=>({worldId:P.worldId,instanceId,regionId:'p23.mistglass.room',layerId:'material'});
export function registerMistglassNative(registry){
    registry.worlds.set(P.worldId,{id:P.worldId,label:'Mistglass conservatory (proposal)',publicName:'Mistglass conservatory',provenance:'Original opt-in proposal, default off.'});
    registry.simulation.energies.set(P.resourceId,mistglassEnergyPolicy);
    registry.simulation.situations.set(MISTGLASS_HISTORY_SITUATION.id,MISTGLASS_HISTORY_SITUATION);
    registry.simulation.conditions.set(P.blockedConditionId,{id:P.blockedConditionId,revision:1,label:'Conservatory rawness',stacking:'max'});
}
// Drawn once from the save's own seed when the instance is first created and
// saved with it. Reload reads the record; it never draws again. Older realms keep none.
function mistglassHistory(state){const ids=Object.keys(sluiceHistories);return {schema:1,id:ids[Math.floor(keyedUnit(state,scopedStream('world.events:p23.mistglass.history',P.worldId),'origin')*ids.length)],drawnAt:state.clock};}
export function mistglassHistoryAccount(state){const h=state.mistglassRealm?.history,k=state.simulation?.knowledge?.player?.['p23.mistglass.history'];return h&&k?.stage==='seen'?sluiceHistories[h.id].account:null;}
export function mistglassReserve(state){return state.simulation?.energies?.player?.[P.resourceId]?.reserve;}
export function mistglassContext(state,{body,alive,location,inventory={},materialClock=state.clock,effectsEnabled=false,optIn=false}={}){
    check(body && typeof body.id==='string','Use the actual native body owner.');
    const raw=state.simulation?.conditions?.player?.[P.blockedConditionId];
    const conditionIds=[];
    if(state.actors.player.worldId===P.worldId && location===MISTGLASS_LOCATION)conditionIds.push(P.exposureConditionId);
    if(raw && (raw.expiresAt===null||raw.expiresAt>state.clock))conditionIds.push(P.blockedConditionId);
    return {clock:state.clock,worldId:state.actors.player.worldId,instanceId:state.mistglassRealm?.instance.id,
        bodyId:body.id,bodyForm:body.form,ownerId:body.ownerId,controllerId:body.controllerId,alive:alive===true,
        conditionIds,optIn,inventory,materialClock,methodKnown:state.simulation?.knowledge?.player?.['p23.mistglass.method']?.stage==='understood',effectsEnabled,sluiceHistory:state.mistglassRealm?.history?.id??null};
}
export function validateMistglassEnvelope(save){
    const state=save.expansion;if(!state)return;
    const family=state.worldAdaptation,realm=state.mistglassRealm,energy=state.simulation?.energies?.player?.[P.resourceId],raw=state.simulation?.conditions?.player?.[P.blockedConditionId];
    validateAdaptation(family);
    check(realm!==undefined||state.actors.player.worldId!==P.worldId,'Mistglass placement requires a retained world owner.');
    if(realm!==undefined){
        check(realm!==null && realm.schema===1 && Object.keys(realm).filter(k=>k!=='history').sort().join(',')==='activeVisitId,instance,lastRestock,schema,visits','Invalid retained Mistglass fields/schema.');
        if(realm.history!==undefined)check(realm.history&&Object.keys(realm.history).filter(k=>k!=='receiptId').sort().join(',')==='drawnAt,id,schema'&&realm.history.schema===1&&Object.hasOwn(sluiceHistories,realm.history.id)&&nat(realm.history.drawnAt)&&realm.history.drawnAt<=state.clock,'Invalid retained Mistglass history.');
        validateMistglassOrigin(state,realm.history);
        validateWorldInstance(realm.instance,MISTGLASS_DEFINITION);
        check(state.worlds[P.worldId] && typeof state.worlds[P.worldId]==='object','Missing native Mistglass world registration.');
        check(realm.instance.clock.observedAt===state.clock && Array.isArray(realm.visits) && realm.visits.length<=64 && nat(realm.lastRestock) && realm.lastRestock<=state.clock,'Invalid retained Mistglass clock/stock.');
        for(const v of realm.visits)validateWorldVisit(v,realm.instance,MISTGLASS_DEFINITION);
        const active=realm.visits.filter(v=>v.status==='active');
        check(active.length===(realm.activeVisitId===null?0:1)&&(!active.length||active[0].id===realm.activeVisitId&&active[0].actorId==='player'),'Invalid active Mistglass visit.');
        const inside=state.actors.player.worldId===P.worldId;
        check(inside===!!active.length && (!inside||save['current location']===MISTGLASS_LOCATION&&state.simulation.people.player.location===MISTGLASS_LOCATION),'Mistglass needs its actual native placement.');
        check(!active.length||![state.realmPrototype,state.featureDestination,state.nestedCampaign,state.bookWorldCampaign,state.motherOfLearning,state.proto23Village].some(o=>o?.activeVisitId!=null),'One native body cannot visit two retained worlds.');
    }
    check(!!family===!!energy,'Mistglass family and native energy must occur together.');
    if(family){
        check(realm && family.instanceId===realm.instance.id && family.clock===state.clock,'Adaptation needs its actual retained instance/clock.');
        check(JSON.stringify(energy.policy)===JSON.stringify(mistglassEnergyPolicy)&&nat(energy.reserve)&&energy.reserve<=P.capacity&&energy.strain===0,'Invalid native condensate policy/reserve.');
        check(family.pending===null||realm.activeVisitId!==null,'A pending trial needs the enrolled active native world.');
        const actualBodyId=state.simulation.people.player.body?.id || 'native.player.body';
        check(actualBodyId===family.bodyId||family.pending===null,'A changed body must settle its interrupted purification before saving.');
        check(state.simulation.knowledge.player?.['p23.mistglass.method']?.stage==='understood','Learn this native method before owning condensate.');
        if(family.pending){const receipt=state.streams?.log?.findLast(r=>r.s===scopedStream('interaction:p23.mistglass',P.worldId)&&r.k===`trial.${family.pending.id}`);
            check(receipt && Math.floor(receipt.u*10000)===family.pending.roll,'Pending purification needs its frozen native stream receipt.');}
    }
    check(!raw||family&&raw.expiresAt!==null&&nat(raw.expiresAt)&&raw.expiresAt<=state.clock+P.failureMinutes&&raw.intensity===1,'Invalid native rawness.');
}
function applyPlan(plan,result,registry,{quoteXP=(_id,n)=>n}={}){
    const old=plan.state.worldAdaptation;
    check((old?.revision??null)===result.expectedRevision,'This conservatory action is stale.');
    if(result.expectedReserve!==undefined)check(mistglassReserve(plan.state)===result.expectedReserve,'Conservatory reserve changed.');
    for(const e of result.effects){
        if(e.kind==='learn-resource')applyEnergyEffect(plan.state,'player',{energyId:P.resourceId,operation:'learn'},registry.simulation);
        else if(e.kind==='resource-credit')applyEnergyEffect(plan.state,'player',{energyId:P.resourceId,operation:'recover',amount:e.amount},registry.simulation);
        else if(e.kind==='resource-debit')applyEnergyEffect(plan.state,'player',{energyId:P.resourceId,operation:'use',output:e.amount,control:1},registry.simulation);
        else if(e.kind==='native-consume-item'){
            check(JSON.parse(e.copyOrLotKey).id===P.doseItemId,'Choose the actual owned Cloudseed dose.');
            applyGameplayEffect(plan.gameplay,{type:'item',key:e.copyOrLotKey,amount:e.count},'player',true);
        }else if(e.kind==='native-material-spend'){assertNativeItemDisposition(plan.state,e.key);applyGameplayEffect(plan.gameplay,{type:'item',key:e.key,amount:e.count},'player',true);
        }else if(e.kind==='native-material-product'){applyGameplayEffect(plan.gameplay,{type:'item',key:e.key,amount:e.count},'player');
        }else if(e.kind==='native-skill-xp'){
            const amount=quoteXP(e.skillId,e.amount);check(Number.isFinite(amount)&&amount>=0,'Invalid native XP quote.');
            if(amount)applyGameplayEffect(plan.gameplay,{type:'xp',skill:e.skillId,amount},'player');
        }else if(e.kind==='native-condition'){
            check(e.conditionId===P.blockedConditionId&&nat(e.startsAt)&&nat(e.expiresAt),'Unsupported adaptation condition.');
            // This is the native condition envelope, not a presenter timer.
            (plan.state.simulation.conditions.player ||= {})[e.conditionId]={intensity:1,expiresAt:e.expiresAt,cause:e.eventId};
        }else if(e.kind==='native-reputation'){
            check(e.region==='Village'&&e.amount===1,'Unsupported conservatory standing.');applyGameplayEffect(plan.gameplay,{type:'reputation',region:e.region,amount:e.amount},'player');
        }else if(e.kind==='native-wage'){
            check(nat(e.amount)&&plan.external&&nat(plan.external.money)&&Number.isSafeInteger(plan.external.money+e.amount),'Bind the actual native coin owner before paying sluice work.');
            plan.external.money+=e.amount;
        }else throw Error('Unsupported adaptation effect.');
    }
    plan.state.worldAdaptation=result.state;return plan;
}
export function stageMistglassEnrollment(plan,context,registry,options){return applyPlan(plan,prepareEnrollment(plan.state.worldAdaptation,{...context,optIn:true}),registry,options);}
export function stageMistglassTrial(plan,context,registry,{doseKey,quoteXP}={}){
    const inventory=plan.gameplay.player.inventory;
    const doseAvailable=typeof doseKey==='string'&&JSON.parse(doseKey).id===P.doseItemId&&(inventory[doseKey]||0)>0;
    const preview=previewTrial(plan.state.worldAdaptation,context,mistglassReserve(plan.state),doseAvailable);
    check(preview.eligible,preview.reasons.join(' '));
    const roll=Math.floor(drawUnit(plan.state,scopedStream('interaction:p23.mistglass',P.worldId),`trial.${plan.state.worldAdaptation.started+1}`)*10000);
    return applyPlan(plan,prepareTrial(plan.state.worldAdaptation,context,{reserve:mistglassReserve(plan.state),doseKey,doseAvailable,roll}),registry,{quoteXP});
}
export function mistglassNextBoundary(state,target){
    const due=state.worldAdaptation?.pending?.dueAt,raw=state.simulation?.conditions?.player?.[P.blockedConditionId]?.expiresAt;
    return Math.min(target,...[due,raw].filter(t=>nat(t)&&t>state.clock));
}
// Root calls this once per segment using OLD native placement/body context,
// before applying the segment's travel/body changes; then once with NEW context
// at the same clock to cancel an interrupted trial. The shared clock must split
// before building an advance plan, at mistglassNextBoundary().
export function stageMistglassAdvance(plan,oldContext,registry,options){
    if(plan.state.worldAdaptation!==undefined){
        const result=prepareAdvance(plan.state.worldAdaptation,{...oldContext,clock:plan.state.clock},mistglassReserve(plan.state));
        applyPlan(plan,result,registry,options);
    }
    if(plan.state.mistglassRealm){
        const r=plan.state.mistglassRealm,p=planWorldClock(r.instance,{playedAt:plan.state.clock,visits:r.visits},MISTGLASS_DEFINITION);
        check(p.allowed,p.reasons?.join(' ')||'Invalid retained Mistglass clock.');r.instance=p.nextInstance;
    }
    return plan;
}
export function stageMistglassTravel(plan,direction,{fromLocation='Village'}={}){
    const state=plan.state;
    if(direction==='enter'){
        check(state.actors.player.worldId==='base.frontier'&&fromLocation==='Village','Enter the optional conservatory from Village.');
        check(![state.realmPrototype,state.featureDestination,state.nestedCampaign,state.bookWorldCampaign,state.motherOfLearning,state.proto23Village].some(o=>o?.activeVisitId!=null),'Leave the current retained world first.');
        state.worlds[P.worldId] ||= {facts:{},resources:{},completed:{}};
        if(!state.mistglassRealm)state.mistglassRealm={schema:1,instance:createWorldInstance(MISTGLASS_DEFINITION,{id:'mistglass.main',continuityId:'frontier.mistglass.proposal',eraId:'frontier.present',playedAt:state.clock,parentInstanceId:null,actorIds:[]}),visits:[],activeVisitId:null,lastRestock:state.clock,history:mistglassHistory(state)};
        const r=state.mistglassRealm;
        if(r.history&&!r.history.receiptId&&r.visits.length===0)r.history=retainMistglassOrigin(state,r.history);
        check(r.activeVisitId===null,'Already visiting this conservatory.');
        const p=planWorldClock(r.instance,{playedAt:state.clock,visits:r.visits},MISTGLASS_DEFINITION);check(p.allowed,'Cannot reconcile retained world.');r.instance=p.nextInstance;
        const visit=createWorldVisit(r.instance,{id:`mistglass.visit.${state.sequence}`,actorId:'player',endpoint:endpoint(r.instance.id),playedAt:state.clock},MISTGLASS_DEFINITION,{actorIds:Object.keys(state.actors),visits:r.visits});
        r.visits.push(visit);r.activeVisitId=visit.id;state.actors.player.worldId=P.worldId;
        state.simulation.people.player.location=MISTGLASS_LOCATION;plan.nativeLocation=MISTGLASS_LOCATION;
    }else if(direction==='exit'){
        const r=state.mistglassRealm;check(r?.activeVisitId&&state.actors.player.worldId===P.worldId,'Not in this native conservatory.');
        const v=r.visits.find(v=>v.id===r.activeVisitId),p=planWorldDeparture(r.instance,v,{playedAt:state.clock,visits:r.visits},MISTGLASS_DEFINITION);
        check(p.allowed,'Cannot leave this retained world.');r.instance=p.nextInstance;r.visits=r.visits.map(v=>v.id===p.nextVisit.id?p.nextVisit:v).slice(-64);r.activeVisitId=null;
        state.actors.player.worldId='base.frontier';state.simulation.people.player.location='Village';plan.nativeLocation='Village';
    }else throw Error('Unsupported conservatory passage.');
    plan.nativePatch={...plan.nativePatch,'current location':plan.nativeLocation};return plan;
}
export function knownMistglassView(state,context,doseKey){
    const family=state.worldAdaptation;
    if(family===undefined)return {enrolled:false,view:null,preview:null};
    return {enrolled:true,view:{...adaptationView(family,context,mistglassReserve(state)),history:mistglassHistoryView(state),pathQuotes:Object.fromEntries(['prepare','cut','set','discard'].map(id=>[id,quotePathWork(family,context,mistglassReserve(state),context.inventory||{},id)]))},preview:previewTrial(family,context,mistglassReserve(state),!!doseKey),sluice:previewSluice(family,context,mistglassReserve(state)),history:mistglassHistoryAccount(state)};
}
// Stock stays in the actual TraderComponent inventory. Only its native refresh
// deadline joins this optional realm; the conserved Proto23 shop is untouched.
export function stageMistglassRestock(plan,{forceInitial=false}={}){
    const r=plan.state.mistglassRealm;check(r,'Enter this conservatory before purchasing.');
    if(!forceInitial&&plan.state.clock-r.lastRestock<60)return false;
    plan.ownership={...plan.ownership,[MISTGLASS_KEEPER]:{[JSON.stringify({id:P.doseItemId})]:4}};
    r.lastRestock=plan.state.clock;return true;
}
export function stageMistglassTeaching(plan,context,registry,options){
    check(context.worldId===P.worldId&&context.alive&&context.bodyForm==='human'&&context.ownerId==='player'&&context.controllerId==='player','Learn from the keeper in your actual native human body.');
    (plan.state.simulation.knowledge.player ||= {})['p23.mistglass.method']={stage:'understood',value:'The conservatory method earns condensate in this mist and spends a paid dose on a twelve-minute purification trial.',at:plan.state.clock,cause:`p23.mistglass.teaching.${plan.state.sequence}`};
    if(plan.state.mistglassRealm?.history)observeMistglassHistory(plan.state,'player','account',sluiceHistories[plan.state.mistglassRealm.history.id].account);
    return stageMistglassEnrollment(plan,{...context,methodKnown:true},registry,options);
}

export function stageMistglassMethod(plan,context,registry,methodId){
    if(methodId.startsWith('path:'))return applyPlan(plan,planPathWork(plan.state.worldAdaptation,context,mistglassReserve(plan.state),plan.gameplay.player.inventory,methodId.slice(5)),registry);
    if(methodId.startsWith('history:'))return stageMistglassHistory(plan,context,methodId.slice(8),registry);
    return applyPlan(plan,prepareCultivationMethod(plan.state.worldAdaptation,context,methodId),registry);}
export function stageMistglassSluice(plan,context,registry){return applyPlan(plan,prepareSluice(plan.state.worldAdaptation,context,mistglassReserve(plan.state)),registry);}

function stageMistglassHistory(plan,context,action,registry){
    check(context.worldId===P.worldId&&context.alive&&context.bodyForm==='human'&&context.ownerId==='player'&&context.controllerId==='player','Inspect the actual conservatory with your living controlled body.');
    const state=plan.state,h=state.mistglassRealm?.history;check(h,'This older conservatory has no recorded origin to reconstruct.');
    if(action==='inspect')observeMistglassHistory(state,'player','inspect');
    else if(action==='restore'){
        const view=mistglassHistoryView(state);check(view?.inspected&&!view.restored,'Inspect the surviving masonry before restoring this outflow.');
        const key=JSON.stringify({id:'Rough wood log'});check((plan.gameplay.player.inventory[key]||0)>0,'Bring one owned rough log for the fitted brace.');
        assertNativeItemDisposition(state,key);
        const result=prepareBraceRestoration(state.worldAdaptation,context);
        applyGameplayEffect(plan.gameplay,{type:'item',key,amount:1},'player',true);applyPlan(plan,result,registry);
        state.worlds[P.worldId].facts['p23.mistglass.outflowRestored']=true;
        (state.simulation.knowledge.player||={})['p23.mistglass.restoration']={stage:'understood',value:'A fitted timber brace now holds the old outflow open. Leverage cleared the silt without condensate; the brace remains installed. Ordinary silt can accumulate again.',at:state.clock,cause:h.receiptId||'mistglass.legacy.origin'};
    }else throw Error('Unknown historical inspection.');
    return plan;
}
