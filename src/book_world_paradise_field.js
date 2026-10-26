// ORIGINAL paid contained planar apparatus, not Paradise outdoor meteorology.
import {check} from './basics.js';
import {PARADISE_IDS as P,PARADISE_LOCATIONS as L,PARADISE_KEYS as K} from './book_world_paradise_ids.js';
import {PARADISE_DRYING as D,readDryingKey,dryingKey,settleParadiseDrying,validateParadiseDryingState} from './book_world_paradise_drying.js';
import {sourceCalendarAt} from './world_calendar.js';
import {createPlanarEvent,readPlanarEvent,recordFieldForecast,recordFieldOutcome,fieldForecastStatus,FIELD_METHODS} from './planar_drying_field.js';
import {applyGameplayEffect} from './gameplay_transactions.js';
import {stageAcquisition} from './acquisition.js';
import {artifactEquipmentReasons} from './artifact_collection.js';
const F='book.paradise.campaign.',coin='book.paradise.coin';
const facts=s=>s.actors?.[D.rack]?.facts;
const owned=(s,name)=>s.actors.player.facts[F+name]===true;
function fieldContext(state){const c=sourceCalendarAt(state);return c?{...c,location:state.simulation.people.player.location,closure:facts(state)?.['drying.closure'],meter:owned(state,'fieldMeter'),calibrated:state.simulation.knowledge.player?.[F+'field_calibration']?.stage==='understood'}:null;}
function supported(state,context){return !!facts(state)&&context.facts?.['paradiseCampaign.bench']===true&&context.facts?.['paradiseCampaign.supported']===true&&context.facts?.['paradiseCampaign.hands']===true&&
    state.actors.player.worldId===P.hub&&state.simulation.people.player.location===L.hub&&!context.busy&&!state.simulation.jobs.some(j=>(j.participants||[j.actorId]).includes('player'))&&!state.simulation.sessions?.player;}
export function planParadiseFieldAction(state,command,context){
    check(supported(state,context)&&owned(state,'fieldInstalled'),'Use your fitted planar apparatus at the supported district bench with free hands.');
    const plan={state:structuredClone(state),external:structuredClone(context.external||{}),gameplay:structuredClone(context.gameplay||{}),gameplayBefore:structuredClone(context.gameplay||{}),
        vitals:structuredClone(context.vitals||{}),equipment:structuredClone(context.equipment||{}),acquisitions:[],unlocks:[]};
    settleParadiseDrying(plan);const c=fieldContext(plan.state),f=facts(plan.state);check(c,'The apparatus needs its actual active local clock.');
    const pay=(credits,effort=0)=>{const payer=plan.state.actors.player.resources,receiver=plan.state.actors[P.employee].resources;
        check(payer[coin]>=credits,'Carry the actual district credits for this operation.');check(!effort||plan.vitals.player?.stamina>=effort,'Grounding needs one actual stamina.');
        payer[coin]-=credits;receiver[coin]=(receiver[coin]||0)+credits;if(effort){plan.vitals.player.stamina-=effort;plan.native={...plan.native,staminaToFull:plan.vitals.player.max_stamina-plan.vitals.player.stamina};}};
    if(command.operation==='start'){
        const previous=readPlanarEvent(f);check(!previous||c.at>=previous.end,'The paid pulse is still committed; use its remaining interval.');
        const reasons=artifactEquipmentReasons([{type:'item',actor:'player',key:D.coal,amount:-1}],plan.state,context);check(!reasons.length,reasons.join(' '));
        check((plan.gameplay.player.inventory[D.coal]||0)>=1,'Carry one charcoal to energize the supplied pulse head.');
        pay(2);applyGameplayEffect(plan.gameplay,{type:'item',key:D.coal,amount:1},'player',true);
        f['field.event']=JSON.stringify(createPlanarEvent({...c,sequence:state.sequence+1}));
    }else if(command.operation==='record'){
        const event=readPlanarEvent(f);check(event,'Pay for and commit one pulse before observing its cycle.');
        f['field.sample']=JSON.stringify(recordFieldForecast(event,c,command.method));
    }else if(command.operation==='outcome'){
        check(f['field.sample'],'Record a local forecast before comparing its outcome.');
        f['field.outcome']=JSON.stringify(recordFieldOutcome(JSON.parse(f['field.sample']),readPlanarEvent(f),c));
    }else if(command.operation==='ground'){
        const lot=readDryingKey(command.key);check(lot?.field?.charge>0,'Select the exact charged stave you currently carry.');
        check((plan.gameplay.player.inventory[command.key]||0)>=1,'That exact charged piece changed; collect it from the rack first.');
        const reasons=artifactEquipmentReasons([{type:'item',actor:'player',key:command.key,amount:-1}],plan.state,context);check(!reasons.length,reasons.join(' '));
        pay(1,1);const next=dryingKey({...lot,field:{...lot.field,charge:0}});
        plan.gameplay.player.inventory=stageAcquisition({player:plan.gameplay.player.inventory},{consumes:[{owner:'player',key:command.key,count:1}],grants:[{owner:'player',key:next,count:1}]}).player;
    }else throw Error('Choose a current pulse, attributed observation or actual grounding operation.');
    plan.state.sequence++;validateParadiseDryingState(plan.state);return plan;
}
export function paradiseFieldDefinitions(h){
    const {command,timed,bench,item,stamina,know,purse}=h;
    const installed={fact:'actor.'+F+'fieldInstalled',op:'eq',value:true},meter={fact:'actor.'+F+'fieldMeter',op:'eq',value:true};
    const rack={all:[bench,{fact:'paradiseDrying.rack',op:'eq',value:true}]};
    return [command('hub.field_install','Fit a supplied planar pulse head · 5 credits + log + rope + 2 stamina · 5 min',P.hub,L.hub,{requires:rack,...timed(5,rack),
        costs:[purse('player',-5,true),item('player',K.log,-1),item('player',K.rope,-1),stamina('player',-2)],effects:[purse(P.employee,5,true),{type:'fact',scope:'actor',actor:'player',key:F+'fieldInstalled',value:true},
            know('field_install','Installed one supplied planar pulse head and grounding contact on my actual rack. Each pulse costs two credits and one charcoal, warms for two local minutes and emits for eight. It removes extra moisture but leaves a charge in exposed staves. One credit and one stamina discharge one collected piece; ordinary drying remains available.')],
        description:'Speed preparation at your actual bench. This contained ORIGINAL apparatus changes the material in its open receiver, not outdoor weather. Its charge remains through carrying and blocks ordinary kit binding until grounded.'}),
        command('hub.field_meter','Fit a pulse meter · 3 credits + 1 stamina · 3 min',P.hub,L.hub,{requires:{all:[rack,installed]},...timed(3,{all:[rack,installed]}),
            costs:[purse('player',-3,true),stamina('player',-1)],effects:[purse(P.employee,3,true),{type:'fact',scope:'actor',actor:'player',key:F+'fieldMeter',value:true},
                know('field_meter','Fitted an actual meter to this stationary pulse head. Its public cycle readings support six-local-minute forecasts; fitting it does not refresh any old observation.')],
            description:'Extends an attributable local forecast from two to six minutes using the fitted instrument. Its readings cover this apparatus, not unsourced world weather.'}),
        command('hub.field_calibrate','Learn this meter’s cycle · held kit + 2 stamina · 4 min',P.hub,L.hub,{requires:{all:[rack,installed,meter]},...timed(4,{all:[rack,installed,meter]}),
            costs:[item('player',K.kit,-1),stamina('player',-2)],effects:[item('player',K.kit,1,true),know('field_calibration','Practiced the supplied meter’s cycle against the pulse-head controls for four actual minutes. I can interpret its publicly announced window up to twelve local minutes ahead, with one minute of interpretive uncertainty. This is learned apparatus calibration, not a magical faculty or general weather mastery.','player','player',true)],
            description:'Learn a longer local forecast by working with your fitted meter and actual kit. Reading a panel does not teach or calibrate it.'})];
}
export function paradiseFieldActions(state,context,projectLegibility){
    if(!facts(state)||state.actors.player.worldId!==P.hub||state.simulation.people.player.location!==L.hub||!owned(state,'fieldInstalled'))return {actions:[],records:[]};
    const c=fieldContext(state);if(!c)return {actions:[],records:[{id:'field.unavailable',text:'The apparatus needs its actual active local clock.'}]};
    const f=facts(state),event=readPlanarEvent(f),sample=f['field.sample']?JSON.parse(f['field.sample']):null,status=fieldForecastStatus(sample,event,c),actions=[];
    const can=supported(state,context),add=(id,label,operation,args={},description='',extraReasons=[])=>{
        id='field.'+id;const reasons=[...(!can?['Return with free hands to your fitted district apparatus.']:[]),...extraReasons],eligible=can&&!reasons.length;
        const costs=operation==='start'?[{id:'credits',known:true,text:'2 district credits are paid.'},{id:'charcoal',known:true,text:'1 charcoal is consumed.'}]:
            operation==='ground'?[{id:'credits',known:true,text:'1 district credit is paid.'},{id:'stamina',known:true,text:'1 stamina is spent.'},{id:'carrier',known:true,text:'One exact charged stave becomes grounded; its wetness and preparation remain.'}]:
            [{id:'observation',known:true,text:'Immediate local observation; resource and time cost 0.'}];
        const legibility=projectLegibility({id,label,description,discovered:true,preview:{visible:true,eligible},definition:{duration:0},
            disclosure:{costs,preparation:[{id:'scope',known:true,text:operation==='start'?'The committed apparatus cycle warms for two local minutes, then emits for eight.':description}]}});
        legibility.blockers=reasons.map((text,i)=>({id:'field.'+i,text}));
        actions.push({id,label,description,eligible,reasons,legibility,command:{type:'book_paradise_campaign',action:'field',operation,...args,sequence:state.sequence}});
    };
    const pulseActive=event&&c.at<event.end;
    add('start','Commit one planar pulse · 2 credits + 1 charcoal','start',{},'Two local minutes of warm-up, then eight emitting minutes. An open receiver dries faster and acquires retained charge. A sealed lid blocks both paths.',[
        ...(pulseActive?['The paid pulse is still committed; use its remaining interval.']:[]),...((state.actors.player.resources[coin]||0)<2?['Carry two district credits.']:[]),...((context.gameplay?.player?.inventory[D.coal]||0)<1?['Carry one charcoal.']:[])]);
    for(const [method,m]of Object.entries(FIELD_METHODS))add('record.'+method,`Record ${method==='calibrated'?'calibrated':method} forecast · ${m.horizon} local min horizon`,'record',{method},
        `Retains your place, time and source. Uncertainty ±${m.uncertainty} local min, conditional on the same apparatus. Recording spends no stock or time and never alters the pulse.`,[
            ...(!event?['Commit a paid pulse first.']:[]),...(method!=='observation'&&!c.meter?['Fit the actual pulse meter first.']:[]),...(method==='calibrated'&&!c.calibrated?['Complete actual meter calibration practice first.']:[])]);
    if(sample)add('outcome','Record the current pulse/receiver check','outcome',{},'Keeps the dated forecast and what actually changed. A changed lid or source is not retroactive weather; this check spends no stock or time.');
    for(const [key]of Object.entries(context.gameplay?.player?.inventory||{}))if(readDryingKey(key)?.field?.charge>0)add('ground.'+actions.length,'Ground one charged stave · 1 credit + 1 stamina','ground',{key},
        'Discharges only this collected piece. It preserves wetness, prior exposure and preparation, so a damp piece still needs drying.',[
            ...((state.actors.player.resources[coin]||0)<1?['Carry one district credit.']:[]),...(context.vitals?.player?.stamina<1?['Recover one stamina.']:[])]);
    const records=[{id:'field.pulse',text:event?`Contained planar pulse: ${c.at<event.activeFrom?'warming':c.at<event.end?'emitting':'spent'} · ${Math.max(0,event.end-c.at)} local minutes remain. Open staves receive the drying field and retain charge; sealing blocks the field. Outdoor weather remains unknown.`:'Your supplied pulse head is idle. Ordinary ventilation remains available.'}];
    if(sample)records.push({id:'field.forecast',text:`${sample.method} observation at local minute ${sample.observedAt}; horizon through ${sample.expiresAt}, uncertainty ±${sample.uncertainty} min. ${status.current?'Current conditional forecast':`Stale: ${status.reason}`} Pulse window ${sample.predictedFrom}–${sample.predictedEnd}. Reopening this panel does not refresh the observation.`});
    if(f['field.outcome']){const o=JSON.parse(f['field.outcome']);records.push({id:'field.outcome',text:`Recorded local check at ${o.observedAt}: ${o.assessment==='receiver_changed'?'receiver support changed since the forecast':o.assessment==='source_changed'?'a different pulse source is now present':'the observed window remains consistent'}. The ${o.sample.method} forecast from ${o.sample.observedAt} remains attached to this observation.`});}
    return {actions,records};
}
