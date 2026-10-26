// ORIGINAL paid-bench adaptation of the existing rack / wet-to-sound route.
// Simulation/native inventories own counts; this module owns no clock or bag.
import {PARADISE_IDS as P,PARADISE_LOCATIONS as L,PARADISE_KEYS as K} from './book_world_paradise_ids.js';
import {createDryingLot,validateDryingLot,advanceDryingExposure} from './drying_exposure.js';
import {readMaterialLineage} from './material_lineage.js';
import {registerDomain} from './domain_registry.js';
import {applyGameplayEffect} from './gameplay_transactions.js';
import {stageAcquisition} from './acquisition.js';
import {check} from './basics.js';
import {readPlanarEvent,planarEmission,nextPlanarBoundary,validateFieldSample,validateFieldOutcome} from './planar_drying_field.js';
export const PARADISE_DRYING = Object.freeze({rack:'book.paradise.drying.rack',prefix:'book.paradise.campaign.hub.drying_',wet:JSON.stringify({id:'Wet repair stave'}),sound:JSON.stringify({id:'Sound repair stave'}),coal:JSON.stringify({id:'Charcoal'})});
const D=PARADISE_DRYING, nat=n=>Number.isSafeInteger(n)&&n>=0;
const clone=structuredClone, same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const dryReason='Dry and collect two staves before binding a kit; damp pieces still need air exchange.';
export function readDryingKey(key){
    let v;try{v=JSON.parse(key);}catch{return null;}
    if(v.drying==null)return null;
    check(Object.keys(v).sort().join(',')==='drying,id','Unsupported drying carrier.');
    const lot=validateDryingLot(v.drying);
    check(v.id===(lot.field?.charge>0?'Charged repair stave':lot.moisture===0?'Sound repair stave':'Wet repair stave')&&JSON.stringify(v)===key,'Drying identity and retained condition disagree.');
    const source=JSON.parse(lot.sourceKey);check(['Wet repair stave','Sound repair stave'].includes(source.id)&&source.drying==null,'Unsupported drying source.');
    if(lot.provenanceKey!==null){const provenance=readMaterialLineage(lot.provenanceKey);check(provenance&&['Wet repair stave','Sound repair stave'].includes(JSON.parse(lot.provenanceKey).id),'Missing retained preparation receipt.');}
    return lot;
}
export function dryingKey(lot){validateDryingLot(lot);const key=JSON.stringify({id:lot.field?.charge>0?'Charged repair stave':lot.moisture===0?'Sound repair stave':'Wet repair stave',drying:lot});readDryingKey(key);return key;}
export const isBindableStave=key=>key===D.sound||!!(readDryingKey(key)?.moisture===0&&!(readDryingKey(key).field?.charge>0));
export function wrapDryingProvenance({cohort,worldId,instanceId,at,sourceKey=D.wet,provenanceKey=null}){
    return dryingKey(createDryingLot({cohort,worldId,instanceId,at,sourceKey,provenanceKey,moisture:JSON.parse(sourceKey).id==='Sound repair stave'?0:6000}));
}
function local(state){const instance=state.bookWorldCampaign?.instances?.find(i=>i.worldId===P.hub);return instance?{worldId:P.hub,instanceId:instance.id,at:instance.clock.elapsed}:null;}
const rack=state=>state.simulation?.people?.[D.rack];
const stock=state=>state.simulation?.owners?.[D.rack]||{};
const settings=state=>state.actors?.[D.rack]?.facts||{};
export function validateParadiseDryingState(state){
    if(!rack(state))return;
    const s=stock(state),f=settings(state),c=local(state);
    check(c&&rack(state).inventory==='simulation'&&state.actors[D.rack]?.worldId===P.hub&&rack(state).location===L.hub&&
        state.actors.player.completed?.[D.prefix+'rack']===1,'Drying needs its actually built local rack.');
    check(Object.values(s).every(n=>nat(n)&&n>0)&&Object.values(s).reduce((a,b)=>a+b,0)<=3,'The rack holds at most three actual staves.');
    for(const key of Object.keys(s)){const lot=readDryingKey(key);check(lot&&lot.instanceId===c.instanceId&&lot.worldId===c.worldId&&lot.at<=c.at,'Rack material lost its local history.');}
    const event=readPlanarEvent(f);if(event)check(state.actors.player.facts['book.paradise.campaign.fieldInstalled']===true&&state.actors.player.completed['book.paradise.campaign.hub.field_install']===1&&event.worldId===c.worldId&&event.instanceId===c.instanceId&&event.location===L.hub&&event.start<=c.at&&event.sequence<=state.sequence,'Field lost its owning clock or cause.');
    if(f['field.sample']!=null){const sample=validateFieldSample(JSON.parse(f['field.sample']));check(sample.worldId===c.worldId&&sample.instanceId===c.instanceId&&sample.observedAt<=c.at,'Field sample lost its owning clock.');}
    if(f['field.outcome']!=null){const o=validateFieldOutcome(JSON.parse(f['field.outcome']));check(o.sample.worldId===c.worldId&&o.sample.instanceId===c.instanceId&&o.observedAt<=c.at,'Field comparison lost its owning clock.');}
    check(['open','sealed'].includes(f['drying.closure'])&&[0,500,1000].includes(f['drying.cover'])&&typeof f['drying.vent']==='boolean'&&
        nat(f['drying.heatUntil'])&&typeof f['drying.running']==='boolean','Unsupported retained rack settings.');
}
function swapRack(plan,from,to,count){plan.state.simulation.owners[D.rack]=stageAcquisition({rack:stock(plan.state)}, {consumes:[{owner:'rack',key:from,count}],grants:[{owner:'rack',key:to,count}]}).rack;}
export function settleParadiseDrying(plan){
    const state=plan.state,c=local(state);if(!rack(state)||!c)return plan;
    const f=settings(state),event=readPlanarEvent(f);
    for(const [key,count]of Object.entries(stock(state))){let lot=readDryingKey(key);check(lot,'Unsupported drying stock.');
        // Local elapsed freezes in absent worlds. No root/wall-clock catch-up.
        while(lot.at<c.at){const from=lot.at,until=nextPlanarBoundary(event,from,Math.min(c.at,f['drying.heatUntil']>from?f['drying.heatUntil']:c.at));
            lot=advanceDryingExposure(lot,{...c,from:lot.at,to:until,rainPermille:null,humidityPermille:500},
                {closure:f['drying.closure'],coverPermille:f['drying.cover'],airflowPermille:f['drying.vent']?1000:500,
                    heatPermille:f['drying.running']&&lot.at<f['drying.heatUntil']?500:0});
            const emitted=planarEmission(event,{...c,from,to:until},f['drying.closure']);
            if(emitted.charge){lot={...lot,revision:2,moisture:Math.max(0,lot.moisture-emitted.drying),remainder:lot.moisture<=emitted.drying?0:lot.remainder,field:{lawId:event.lawId,revision:event.revision,eventId:event.id,worldId:event.worldId,instanceId:event.instanceId,charge:Math.min(6000,(lot.field?.charge||0)+emitted.charge)}};}
            validateDryingLot(lot);
        }
        const next=dryingKey(lot);if(next!==key)swapRack(plan,key,next,count);
    }
    validateParadiseDryingState(state);return plan;
}
const ready=(state,context)=>context.facts?.['paradiseCampaign.bench']===true&&context.facts?.['paradiseCampaign.supported']===true&&context.facts?.['paradiseCampaign.hands']===true&&
    state.actors.player.worldId===P.hub&&state.simulation.people.player.location===L.hub&&!context.busy&&!state.simulation.jobs.some(j=>(j.participants||[j.actorId]).includes('player'))&&!state.simulation.sessions?.player;
export function planParadiseDryingAction(state,command,context){
    check(ready(state,context),'Use your completed district bench with your living, free hands.');
    check(rack(state),'Build the drying rack first.');
    const plan={state:clone(state),external:clone(context.external||{}),gameplay:clone(context.gameplay||{}),gameplayBefore:clone(context.gameplay||{}),
        vitals:clone(context.vitals||{}),equipment:clone(context.equipment||{}),acquisitions:[],unlocks:[]};
    settleParadiseDrying(plan);const c=local(plan.state),f=settings(plan.state),s=stock(plan.state),key=command.key,n=command.count??1;
    check([1,3].includes(n),'Choose one or three actual pieces.');
    if(command.operation==='load'){
        check((plan.gameplay.player?.inventory[key]||0)>=n,'That exact carried batch changed.');
        const prior=readDryingKey(key);check(prior||[D.wet,D.sound].includes(key),'Choose an actual wet or sound repair stave.');
        check(Object.values(s).reduce((a,b)=>a+b,0)+n<=3,'Collect enough work to leave space on the three-piece rack.');
        let lot=prior?clone(prior):createDryingLot({...c,cohort:`paradise.${state.sequence+1}.${state.clock}`,sourceKey:key,moisture:key===D.sound?0:6000});
        // Unsupported carried atmosphere earned no drying; preserve its physical
        // state and immutable provenance while adopting this actual local owner.
        lot={...lot,...c};const next=dryingKey(lot);
        applyGameplayEffect(plan.gameplay,{type:'item',key,amount:n},'player',true);
        plan.state.simulation.owners[D.rack]=stageAcquisition({rack:s},{grants:[{owner:'rack',key:next,count:n}]}).rack;
    }else if(command.operation==='take'){
        check((s[key]||0)>=n&&readDryingKey(key),'Choose the exact current rack batch.');
        plan.state.simulation.owners[D.rack]=stageAcquisition({rack:s},{consumes:[{owner:'rack',key,count:n}]}).rack;
        applyGameplayEffect(plan.gameplay,{type:'item',key,amount:n},'player');
    }else if(command.operation==='closure'){
        check(['open','sealed'].includes(command.value),'Choose open ventilation or the sealed lid.');
        check(plan.state.actors.player.completed[D.prefix+'cover']===1,'Fit the physical sliding cover before sealing the rack.');f['drying.closure']=command.value;
    }else if(command.operation==='cover'){
        check(plan.state.actors.player.completed[D.prefix+'cover']===1&&[0,500,1000].includes(command.value),'Fit and position the actual rain cover.');f['drying.cover']=command.value;
    }else if(command.operation==='heat'){
        check(f['drying.closure']==='open','Open the vents before lighting the ordinary drying heater.');
        check(f['drying.heatUntil']<=c.at,'Use the current paid charcoal interval before adding another.');
        applyGameplayEffect(plan.gameplay,{type:'item',key:D.coal,amount:1},'player',true);f['drying.heatUntil']=c.at+6;f['drying.running']=true;
    }else if(command.operation==='pause'||command.operation==='resume')f['drying.running']=command.operation==='resume';
    else throw Error('Unsupported drying action.');
    plan.state.sequence++;validateParadiseDryingState(plan.state);return plan;
}
export function dryingBindingDefinition(state,definition,context){
    const inventory=context.gameplay?.player?.inventory||{},missingReason=Object.keys(inventory).some(key=>readDryingKey(key)?.field?.charge>0)?'Ground your charged staves at the fitted pulse head, then collect two dry uncharged pieces for binding.':dryReason;
    const rows=Object.entries(inventory).filter(([key])=>key!==D.sound&&isBindableStave(key));let left=2;const inputs=[];
    for(const [key,count]of rows){const amount=Math.min(left,count);if(amount){inputs.push({type:'item',actor:'player',key,amount:-amount});left-=amount;}if(!left)break;}
    if(left)inputs.push({type:'item',actor:'player',key:D.sound,amount:-left});
    return {...definition,requires:{...definition.requires,...(left>(context.gameplay?.player?.inventory[D.sound]||0)?{reason:missingReason}:{})},costs:[...inputs,...definition.costs.slice(1)]};
}
export function validDryingBindingCosts(costs,definition){
    if(!Array.isArray(costs)||costs.length<definition.costs.length)return false;
    const end=definition.costs.length-1,inputs=costs.slice(0,costs.length-end);
    return same(costs.slice(costs.length-end),definition.costs.slice(1))&&inputs.every(c=>c.type==='item'&&c.actor==='player'&&Number.isSafeInteger(c.amount)&&c.amount<0&&
        isBindableStave(c.key))&&inputs.reduce((n,c)=>n-c.amount,0)===2&&new Set(inputs.map(c=>c.key)).size===inputs.length;
}
export function paradiseDryingActions(state,context,projectLegibility){
    if(!rack(state)||state.actors.player.worldId!==P.hub||state.simulation.people.player.location!==L.hub)return {actions:[],records:[]};
    const actions=[],f=settings(state),supported=ready(state,context);
    const action=(id,label,operation,args={},description='',extraReasons=[])=>{
        id='drying.'+id;const reasons=[...(!supported?['Return with free hands to your built district bench.']:[]),...extraReasons],eligible=supported&&!reasons.length;
        const costs=operation==='heat'?[{id:'charcoal',known:true,text:'1 charcoal is consumed.'}]:
            operation==='load'||operation==='take'?[{id:'custody',known:true,text:`${args.count||1} exact stave${args.count===1?'':'s'} move ${operation==='load'?'onto the rack':'into your carried inventory'} with their condition retained.`}]:
            [{id:'handling',known:true,text:'Immediate handling of fitted apparatus; no material cost.'}];
        const terms=operation==='heat'?'One charcoal supports six local minutes of heat; pausing stops heating but its paid interval continues.':'Immediate material handling.';
        const legibility=projectLegibility({id,label,description,discovered:true,preview:{visible:true,eligible},definition:{duration:0},disclosure:{costs,preparation:[{id:'support',known:true,text:terms}]}});
        legibility.blockers=reasons.map((text,i)=>({id:'drying.'+i,text}));
        actions.push({id,label,description,terms,eligible,reasons,legibility,command:{type:'book_paradise_campaign',action:'drying',operation,...args,sequence:state.sequence}});
    };
    for(const [key,count]of Object.entries(context.gameplay?.player?.inventory||{}))if([D.wet,D.sound].includes(key)||readDryingKey(key)){
        const lot=readDryingKey(key),name=lot?.field?.charge>0?'charged':lot?.moisture===0||key===D.sound?'dry':'damp';action('load.'+actions.length,`Place one ${name} stave on your rack`, 'load',{key,count:1},'Keep this cohort’s prior drying and wetness. The rack has three physical spaces.',Object.values(stock(state)).reduce((a,b)=>a+b,0)>=3?['Collect a piece to make space.']:[]);
    }
    for(const [key,count]of Object.entries(stock(state))){const lot=readDryingKey(key);action('take.'+actions.length,`Take one ${lot.field?.charge>0?'charged':lot.moisture===0?'sound':'damp'} stave · ${count} in this batch`,'take',{key,count:1},'This exact condition and preparation history travels with the piece.');}
    if(state.actors.player.completed[D.prefix+'cover']===1){action('closure',f['drying.closure']==='sealed'?'Open the lid · let moisture escape':'Seal the lid · stop air exchange','closure',{value:f['drying.closure']==='sealed'?'open':'sealed'},'A closed lid protects from direct wetting but traps moisture. It earns no ordinary drying.');
        // Adjustable wetting exposure is retained for a supported source adapter;
        // no weather adjustment is offered while hub direct rain is unknown.
    }
    action('heat','Heat the open rack · 1 charcoal · six local minutes','heat',{},'Paid heat speeds moisture removal while ventilation stays open. Pausing the heater stops its work; its paid local interval still passes.',(context.gameplay?.player?.inventory[D.coal]||0)<1?['Carry one charcoal.']:f['drying.heatUntil']>local(state).at?['The current charcoal interval is still available.']:f['drying.closure']==='sealed'?['Open the lid before lighting the heater.']:[]);
    action('power',f['drying.running']?'Pause active heating · keep passive air exchange':'Resume active heating if paid time remains',f['drying.running']?'pause':'resume',{},'Pausing chosen heating does not seal or protect the material. Passive air exchange remains.');
    const records=[{id:'drying.settings',text:`Your rack: ${f['drying.closure']==='sealed'?'sealed, humid air trapped':f['drying.vent']?'open cross-ventilation':'open, ordinary air exchange'}. The workshop air is moderately humid; opening the vents lets moisture escape. ${Object.values(stock(state)).reduce((a,b)=>a+b,0)}/3 spaces occupied.`},
        ...Object.entries(stock(state)).map(([key,count],i)=>({id:'drying.batch.'+i,text:`${count} stave${count===1?'':'s'} · ${readDryingKey(key).field?.charge>0?'charged; ground before binding':readDryingKey(key).moisture===0?'dry enough to bind':'still damp; '+Math.ceil(readDryingKey(key).moisture/60)+'% of drying work remains'}. Prior exposure and preparation remain with this batch.`}))];
    return {actions,records};
}
export function paradiseDryingDefinitions(h){
    const {command,timed,bench,item,stamina,know}=h;
    const station={id:D.rack,revision:1,label:'Your district drying rack',worldId:P.hub,location:L.hub,inventory:'simulation',provision:false};
    return {people:[station],commands:[
        command('hub.drying_rack','Build a spaced drying rack · 2 logs + rope + 2 stamina · 3 min',P.hub,L.hub,{requires:bench,...timed(3,bench),
            costs:[item('player',K.log,-2),item('player',K.rope,-1),stamina('player',-2)],
            effects:[{type:'spawn',personId:D.rack,definitionId:D.rack,template:station},...Object.entries({'drying.closure':'open','drying.cover':0,'drying.vent':false,'drying.heatUntil':0,'drying.running':true}).map(([key,value])=>({type:'fact',scope:'actor',actor:D.rack,key,value})),
                know('drying_rack','Built a three-stave rack at my paid district bench. It supplies ordinary air exchange, not dry material, outdoor weather or a magical field.')],
            description:'Dry counted damp staves while other local work continues. Ordinary air needs 24 local minutes for a newly wet piece; cross-ventilation takes 12. A sealed lid traps moisture. These times and apparatus air are original workshop tuning.'}),
        command('hub.drying_cut','Prepare two damp staves · log + held kit + 2 stamina · 4 min',P.hub,L.hub,{once:false,requires:bench,...timed(4,bench),
            costs:[item('player',K.log,-1),item('player',K.kit,-1),stamina('player',-2)],effects:[item('player',K.kit,1,true),item('player',D.wet,2),know('drying_cut','My counted log became two damp staves. The held kit returned; neither piece is dry yet.')],description:'An ordinary wet-to-sound preparation route at your own bench. It uses the existing repair-stave material and survey-kit consumer.'}),
        command('hub.drying_cover','Fit a sliding cover · log + rope + 1 stamina · 3 min',P.hub,L.hub,{requires:{all:[bench,{fact:'paradiseDrying.rack',op:'eq',value:true}]},...timed(3,bench),costs:[item('player',K.log,-1),item('player',K.rope,-1),stamina('player',-1)],effects:[{type:'fact',scope:'actor',actor:D.rack,key:'drying.cover',value:1000}],description:'Adds an adjustable rain cover and a closeable lid. Full cover sheds direct wetting while the open lid leaves an air path; sealing that lid stops ordinary drying.'}),
        command('hub.drying_vents','Fit cross-ventilation · log + rope + 1 stamina · 2 min',P.hub,L.hub,{requires:{all:[bench,{fact:'paradiseDrying.rack',op:'eq',value:true}]},...timed(2,bench),costs:[item('player',K.log,-1),item('player',K.rope,-1),stamina('player',-1)],effects:[{type:'fact',scope:'actor',actor:D.rack,key:'drying.vent',value:true}],description:'Spaced side vents double this rack’s ordinary air exchange. The sealed lid still prevents moisture escaping.'}),
        command('hub.drying_bind','Bind two dry staves into a usable survey kit · held rope + 2 stamina · 3 min',P.hub,L.hub,{once:false,requires:{all:[bench,{fact:'paradiseDrying.dryCount',op:'gte',value:2,reason:dryReason}]},...timed(3,bench),costs:[item('player',D.sound,-2),item('player',K.rope,-1),stamina('player',-2)],effects:[item('player',K.rope,1,true),item('player',K.kit,1),know('drying_bound','Two actual dry staves became one usable Prepared survey kit. The held rope returned. This same kit can supply the existing district repair order.')],description:'Use the exact dry cohorts you carry. Cancellation returns those same keys and histories. Damp staves cannot fill the dry-material input.'})]};
}
// No save slice: current immutable native keys carry the material record.
registerDomain({id:'dryingExposure',ownsItemKey:key=>{const lot=readDryingKey(key);return lot!==null;},validate:(_,envelope)=>{
    const visit=value=>{if(!value||typeof value!=='object')return;for(const [key,row]of Object.entries(value)){if(key.startsWith('{'))readDryingKey(key);if(row&&typeof row==='object')visit(row);}};
    visit(envelope.inventories);visit(envelope.expansion?.simulation?.owners);
    if(envelope.expansion)validateParadiseDryingState(envelope.expansion);
}});
