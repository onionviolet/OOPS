// ORIGINAL maintained coppice nursery. Standing source availability is separate
// from harvested native inventory; the existing instance owns elapsed time.
import {defineSourceTable,nodeAt,harvest,validateSourceState} from './craft_sources.js';
import {nativeCatalogue} from './native_material_catalogue.js';
import {sourceCalendarAt} from './world_calendar.js';
import {WORLD_CALENDAR_PROFILES} from './world_calendar_content.js';
import {PARADISE_IDS as P,PARADISE_LOCATIONS as L,PARADISE_KEYS as K} from './book_world_paradise_ids.js';
import {readPreparationWater} from './book_world_paradise_environment_inputs.js';
import {applyGameplayEffect} from './gameplay_transactions.js';
const check=(ok,why)=>{if(!ok)throw Error(why);},nat=n=>Number.isSafeInteger(n)&&n>=0;
export const PARADISE_ECOLOGY=Object.freeze({nursery:'book.paradise.ecology.nursery',source:'coppice',prefix:'book.paradise.campaign.hub.ecology_',careMinutes:1440});
const E=PARADISE_ECOLOGY,profile=WORLD_CALENDAR_PROFILES[P.hub];
export const paradiseEcologySources=defineSourceTable(nativeCatalogue,{id:'paradise.nursery',revision:1,sources:[{
    id:E.source,name:'Your maintained coppice stools',kind:'gather',capacity:2,regenPerDay:2,quality:[50,50],
    calendar:{worldId:P.hub,profileId:profile.id,profileRevision:profile.revision,...profile.units,seasonTags:{}},
    yields:[{material:'Rough wood log',qty:[1,1]}]}]});
const source=paradiseEcologySources.sources[E.source],actor=s=>s.actors?.[E.nursery],facts=s=>actor(s)?.facts;
function savedNode(state){const text=facts(state)?.['ecology.node'];return text?JSON.parse(text):null;}
function binding(state){return state.bookWorldCampaign?.instances?.find(i=>i.worldId===P.hub);}
export function validateParadiseEcology(state){
    const a=actor(state);if(!a)return;
    const f=a.facts,i=binding(state),p=state.simulation?.people?.[E.nursery];
    check(i&&a.worldId===P.hub&&p?.location===L.hub&&p.inventory==='simulation'&&state.actors.player.completed?.[E.prefix+'lease']===1,'Nursery needs its actually paid local space and rooted stools.');
    check(f['ecology.revision']===1&&nat(f['ecology.caredAt'])&&nat(f['ecology.fedUntil'])&&nat(f['ecology.cares'])&&
        typeof f['ecology.water']==='string'&&typeof f['ecology.node']==='string'&&f['ecology.caredAt']<=i.clock.elapsed&&
        (f['ecology.cares']===0?f['ecology.fedUntil']===0:f['ecology.fedUntil']===f['ecology.caredAt']+E.careMinutes),'Invalid finite nursery care.');
    if(f['ecology.cares']>0)check(nurseryWaterAssessment(f['ecology.water']).usable,'Retain the exact measured care-water history.');
    else check(f['ecology.water']==='','Unused nursery has no care-water receipt.');
    const node=savedNode(state);
    if(node){validateSourceState({schema:1,nodes:{[E.source]:node}},paradiseEcologySources);
        check(node.calendar.instanceId===i.id&&node.updatedAt<=i.clock.elapsed,'Nursery source lost its instance or local cursor.');}
    else check(f['ecology.cares']===0,'Cared nursery needs retained source availability.');
}
// This species is grown in an ORIGINAL clean drip tray. These are its chosen
// support conditions, not drinking-water certification or a universal crop law.
export function nurseryWaterAssessment(key){
    const w=readPreparationWater(key);if(!w||w.batch.volume!==1)return {usable:false,reason:'Use one actual liquid nursery-water portion.'};
    const amounts=Object.fromEntries(w.batch.constituents.map(r=>[r.id,r.amount]));
    if(amounts.grit)return {usable:false,reason:'Strain the suspended grit before filling this clean drip tray.'};
    if(amounts.salt||amounts.contaminant)return {usable:false,reason:'This nursery needs a measured low-salt, uncontaminated portion; cloth cannot remove dissolved material.'};
    return {usable:amounts.water===1000,reason:amounts.water===1000?'':'Use one complete measured solvent portion.'};
}
export function projectParadiseEcology(state){
    validateParadiseEcology(state);if(!actor(state))return null;
    const c=sourceCalendarAt(state);if(!c||c.worldId!==P.hub)return null;
    const f=facts(state);let node=savedNode(state);
    if(!node)node=nodeAt(source,null,c.at,c);
    else {
        const through=Math.min(c.at,f['ecology.fedUntil']);
        if(through>node.updatedAt)node=nodeAt(source,node,through,sourceCalendarAt(state,through));
        // Unsupported time earns no growth and destroys no retained stock.
        node={...node,updatedAt:c.at};
    }
    return {calendar:c,node,careRemaining:Math.max(0,f['ecology.fedUntil']-c.at)};
}
export function planParadiseEcologyAction(state,command,context){
    check(context.facts?.['paradiseCampaign.bench']===true&&context.facts?.['paradiseCampaign.hands']===true&&
        context.facts?.['paradiseCampaign.supported']===true&&state.actors.player.worldId===P.hub&&state.simulation.people.player.location===L.hub&&
        !context.busy&&!state.simulation.jobs.some(j=>(j.participants||[j.actorId]).includes('player'))&&!state.simulation.sessions?.player,'Return with free hands to your district bench and nursery.');
    const v=projectParadiseEcology(state);check(v,'Lease the actual local nursery first.');
    const plan={state:structuredClone(state),external:structuredClone(context.external||{}),gameplay:structuredClone(context.gameplay||{}),gameplayBefore:structuredClone(context.gameplay||{}),
        vitals:structuredClone(context.vitals||{}),equipment:structuredClone(context.equipment||{}),acquisitions:[],unlocks:[]},f=facts(plan.state);
    let node=v.node;
    if(command.operation==='care'){
        check(!v.careRemaining,'The paid water ration still supports this nursery.');
        check(node.stock<source.capacity,'Gather mature wood before spending another water ration.');
        check(nurseryWaterAssessment(command.key).usable,nurseryWaterAssessment(command.key).reason);
        check((plan.gameplay.player?.inventory[command.key]||0)>=1,'That exact owned water portion changed.');
        check(plan.vitals.player?.stamina>=1,'Nursery care needs one actual stamina.');
        applyGameplayEffect(plan.gameplay,{type:'item',key:command.key,amount:1},'player',true);plan.vitals.player.stamina--;plan.native={...plan.native,staminaToFull:plan.vitals.player.max_stamina-plan.vitals.player.stamina};
        f['ecology.caredAt']=v.calendar.at;f['ecology.fedUntil']=v.calendar.at+E.careMinutes;f['ecology.cares']++;f['ecology.water']=command.key;
    }else if(command.operation==='harvest'){
        const result=harvest(paradiseEcologySources,{root:state.rng,world:P.hub,location:L.hub,source:E.source,at:v.calendar.at,calendar:v.calendar,node});
        check(result.result.items.length,'No mature wood remains. Use paid nursery care and local time, or your existing stored/supplied timber.');
        node=result.node;applyGameplayEffect(plan.gameplay,{type:'item',key:K.log,amount:result.result.items[0].qty},'player');
    }else throw Error('Choose nursery care or a mature cut.');
    f['ecology.node']=JSON.stringify(node);plan.state.sequence++;validateParadiseEcology(plan.state);return plan;
}
export function paradiseEcologyDefinitions(h){
    const {command,timed,bench,stamina,know,purse,contact}=h;
    const station={id:E.nursery,revision:1,label:'Your district coppice nursery',worldId:P.hub,location:L.hub,inventory:'simulation',provision:false};
    return {people:[station],commands:[command('hub.ecology_lease','Lease two rooted coppice stools · 4 credits + 2 stamina · 3 min',P.hub,L.hub,{
        ...contact(P.employee),requires:{all:[bench,{fact:`paradise.support.${P.employee}`,op:'eq',value:true}]},...timed(3,bench,true),
        costs:[purse('player',-4,true),stamina('player',-2)],effects:[purse(P.employee,4,true),{type:'spawn',personId:E.nursery,definitionId:E.nursery,template:station},
            ...Object.entries({'ecology.revision':1,'ecology.water':'','ecology.node':'','ecology.caredAt':0,'ecology.fedUntil':0,'ecology.cares':0}).map(([key,value])=>({type:'fact',scope:'actor',actor:E.nursery,key,value})),
            know('ecology_lease','Paid for two rooted stools with two mature cuts in managed district space. Each cut supplies one ordinary rough log. A measured clear water ration and one stamina support two further cuts over one local day; no absent-world or wall time grows them.')],
        description:'Original controlled nursery, not a canon landmark or civil season. Harvested logs feed the existing wash, stave, drying and survey-kit work. Standing capacity is two cuts. Actual water supports one local day of regrowth; exhausted or unsupported care preserves the rooted source and earned growth.'})]};
}
export function paradiseEcologyActions(state,context,projectLegibility){
    if(!actor(state)||state.actors.player.worldId!==P.hub||state.simulation.people.player.location!==L.hub)return {actions:[],records:[]};
    const v=projectParadiseEcology(state),actions=[],can=context.facts?.['paradiseCampaign.hands']===true&&context.facts?.['paradiseCampaign.bench']===true&&!context.busy&&!state.simulation.jobs.some(j=>(j.participants||[j.actorId]).includes('player'))&&!state.simulation.sessions?.player;
    const add=(id,label,operation,args,reason,terms)=>{
        id='ecology.'+id;
        const description='Use your actually paid nursery. Its local instance clock freezes during unsupported absence; previews spend nothing.',
            reasons=[...(!can?['Return with free, supported hands.']:[]),...(reason?[reason]:[])],eligible=can&&!reason,
            costs=operation==='care'?[{id:'water',known:true,text:'1 exact '+JSON.parse(args.key).id+' portion is consumed.'},{id:'stamina',known:true,text:'1 stamina is spent.'}]:
                [{id:'standing-cut',known:true,text:'1 mature standing cut becomes 1 ordinary rough log.'}];
        const legibility=projectLegibility({id,label,description,discovered:true,preview:{visible:true,eligible},definition:{duration:0},
            disclosure:{costs,preparation:[{id:'support',known:true,text:terms}]}});
        legibility.blockers=reasons.map((text,i)=>({id:'nursery.'+i,text}));
        actions.push({id,label,description,terms,eligible,reasons,legibility,command:{type:'book_paradise_campaign',action:'ecology',operation,...args,sequence:state.sequence}});
    };
    add('harvest','Gather one mature coppice cut · receive 1 rough log','harvest',{},v.node.stock?'':'No mature wood. Tend with measured water and allow local growth, or use stored/supplied logs.','One standing mature cut; no extra time.');
    const waters=Object.keys(context.gameplay?.player?.inventory||{}).filter(k=>readPreparationWater(k)?.batch.volume===1);
    for(const [i,key]of waters.entries()){const a=nurseryWaterAssessment(key);add('care.'+i,'Tend rooted stools · '+JSON.parse(key).id,'care',{key},v.careRemaining?'Current water still supports care.':v.node.stock===2?'Gather mature wood before another ration.':!a.usable?a.reason:(context.vitals?.player?.stamina||0)<1?'One stamina is needed.':'','1 exact water portion + 1 stamina; supports one local day.');}
    return {actions,records:[{id:'ecology.stock',text:`Your nursery: ${v.node.stock}/2 mature cuts; ${v.careRemaining} supported local minutes remain. Fractional growth stays with the rooted source. Each two cuts per local day uses one finite measured water portion. No seasonal date is assumed.`}]};
}
