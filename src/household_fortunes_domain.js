import {registerDomain,domainRegistry} from './domain_registry.js';
import {STEWARD,COOK,KEEPER} from './home_work_content.js';
import {TUTOR} from './home_household_content.js';
import {HOME_PLACES as P,homeKey as k} from './home_content.js';
import {planHomeStaff} from './home_staff.js';
import {conditionOf} from './home_building_model.js';
import {FORTUNE_DIALS,roll,settleAwakening,watchList,recordDeath,causeOfDeath,easeHousehold,emptyHousehold,unlockedRoutines,routineMayRun,ROUTINES,observableScore} from './household_fortunes.js';
import {collectObligations} from './obligations_ledger.js';
import './peer_standing_domain.js';
import {createFortunesPanel} from './household_fortunes_panel.js';
import {readPort} from './ui_ports.js';
// Household fortunes wired to the manor staff (IM9 awakening, IM10 cause-charged deaths, OG16 routines).
// One authority per fact: a staff member's life is `simulation.people[id].life`, completion counts are
// `actors[id].completed`, and the obligations ledger is derived at read time. The slice below keeps only
// what nothing else owns: observed fed/tended shares, spark signs, the standing record and routine stops.
export const FORTUNES_FAMILY='household_fortunes@1';
export const FORTUNE_STAFF=[
    {id:STEWARD,name:'Rowan',role:'Family steward',age:64,lifespan:72},
    {id:COOK,name:'Iven',role:'Household cook',age:41,lifespan:74},
    {id:KEEPER,name:'Toma',role:'Estate caretaker',age:52,lifespan:72},
    {id:TUTOR,name:'Sera',role:'Reading tutor',age:35,lifespan:76},
];
// Every number is a dial with an in-world reason (AD1, AD19).
export const FORTUNE_TERMS={
    yearDays:{value:360,why:'A played year of 360 days, so staff age with the household.'},
    neglectDays:{value:40,why:'Forty days of near-empty plates after the pantry and purse run dry before someone does not recover.'},
    catchUpDays:{value:60,why:'A long journey settles in sittings; nothing is skipped.'},
    seasonDays:{value:90,why:'Grudges ease by the household season (AD19).'},
    fedSmoothing:{value:0.1,why:'Hunger and fullness build over days, not on a single meal.'},
    routineReserve:{value:4,why:'A routine never spends the last coins of the household purse; the routine holds.'},
};
const DAY=1440,STAFF_IDS=FORTUNE_STAFF.map(s=>s.id);
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const num=n=>Number.isFinite(n);
const TASK_ACTOR={cook:COOK,repair:KEEPER,dry:KEEPER};
let state=null,ports=null,panel=null;
export const fortunesState=()=>state;
export const configureFortunes=operations=>{ports=operations;};
const fresh=day=>({family:FORTUNES_FAMILY,lastDay:day,easedDay:day,members:{},household:emptyHousehold(),routines:{paused:{}}});
// Old or absent slices normalise; nothing is ever backfilled (a household starts being observed when first seen).
export function migrateFortunes(slice){
    if(!slice||typeof slice!=='object')return null;
    const base=fresh(slice.lastDay??0);
    return {...base,...slice,family:FORTUNES_FAMILY,members:{...slice.members},household:{...base.household,...slice.household},routines:{paused:{...slice.routines?.paused}}};
}
export function validateFortunes(slice,clock=Infinity){
    if(slice==null)return;
    if(slice.family!==FORTUNES_FAMILY)throw Error('Household fortunes: wrong family.');
    if(!Number.isSafeInteger(slice.lastDay)||slice.lastDay<0||slice.lastDay>Math.floor(clock/DAY))throw Error('Household fortunes: day is ahead of the played clock.');
    for(const [id,m] of Object.entries(slice.members)){
        if(!STAFF_IDS.includes(id))throw Error('Household fortunes: unknown staff member.');
        if(![m.fed,m.tended].every(n=>num(n)&&n>=0&&n<=1)||!Number.isSafeInteger(m.lack)||m.lack<0||!Number.isSafeInteger(m.signs)||m.signs<0||!Number.isSafeInteger(m.since))throw Error('Household fortunes: bad staff row.');
        if(m.awakened&&!Number.isSafeInteger(m.awakened.day))throw Error('Household fortunes: bad awakening.');
    }
    const h=slice.household;
    if(!num(h?.standing)||!num(h.resentment)||h.resentment<0||!Array.isArray(h.ledger)||h.ledger.length>64)throw Error('Household fortunes: bad household record.');
    for(const r of h.ledger)if(!STAFF_IDS.includes(r.id)||!['neglect','accident','old_age'].includes(r.cause))throw Error('Household fortunes: bad ledger row.');
    for(const [id,v] of Object.entries(slice.routines?.paused||{}))if(!ROUTINES.some(r=>r.id===id)||typeof v!=='boolean')throw Error('Household fortunes: bad routine stop.');
}
// What the household can see today, from the actual manor and staff state. `bed` is the room, `fed` the
// larder/purse, `tended` the standing agreement. Hidden talent is derived, never saved or projected.
export function observeToday(c,manor){
    const q=conditionOf(manor),bed=manor.access===false?0:clamp(q.integrity/100,0,1)*(1-clamp(q.wetness/300,0,1));
    const meat=(c.staffStock?.[COOK]?.[k('Rat meat chunks')]||0)+(c.staffStock?.[COOK]?.[k('Roasted rat meat')]||0);
    const funds=c.staffResources?.[STEWARD]?.['home.estateFunds']||0;
    return {bed,fedToday:meat>0||funds>=2?1:0,tended:id=>{const f=c.staffFacts?.[id]||{};return f['home.employed']===false?0:f['home.leave']===true?0.5:1;}};
}
const talentOf=(seed,id)=>roll(seed,id,-1);
const seedOf=id=>'household:'+id;
// Stages the household's days into the root plan. Returns nothing; commits ride the existing root commit.
export function stageFortunes(plan,c,homes,{applyEffects,stageJob,log,planStaff}){
    const manor=homes.properties.manor;
    const planOrder=planStaff||(service=>{try{const out={simEffects:[],money:0,minutes:0,message:''};planHomeStaff(homes,{type:'staff_order',service},c,out);return out.job||null;}catch{return null;}});
    if(!manor||!plan.state.simulation)return;
    const clock=plan.state.clock,today=Math.floor(clock/DAY);
    let next=state?structuredClone(state):fresh(today);
    const o=observeToday(c,manor),notes=[],effects=[];
    const days=Math.min(today-next.lastDay,FORTUNE_TERMS.catchUpDays.value);
    for(const s of FORTUNE_STAFF){
        const person=c.people?.[s.id];if(!person)continue;
        const m=next.members[s.id]||={fed:0.8,tended:1,lack:0,signs:0,since:today};
        if(person.life==='dead'){
            if(!next.household.ledger.some(r=>r.id===s.id)){
                const age=s.age+(today-m.since)/FORTUNE_TERMS.yearDays.value,cause=causeOfDeath({fed:m.fed,bed:o.bed,tended:m.tended,age,lifespan:s.lifespan});
                next.household=recordDeath(next.household,{id:s.id},cause,today);
                next.household.ledger.at(-1).note=`${s.name}: ${next.household.ledger.at(-1).note}`;
                notes.push(`${s.name} has died (${cause.replace('_',' ')}). The household remembers how they were kept.`);
            }
            continue;
        }
        if(person.life!=='alive')continue;
        for(let i=1;i<=days;i++){
            const day=next.lastDay+i;
            m.fed=clamp(m.fed*(1-FORTUNE_TERMS.fedSmoothing.value)+o.fedToday*FORTUNE_TERMS.fedSmoothing.value,0,1);
            m.tended=o.tended(s.id);
            m.lack=m.fed<0.2?m.lack+1:Math.max(0,m.lack-1);
            if(!m.awakened){
                const r=settleAwakening({id:s.id,day,bed:o.bed,fed:m.fed,tended:m.tended,talent:talentOf(seedOf(s.id),s.id)},1,seedOf(s.id));
                if(r.awakened){m.awakened={day};notes.push(`${s.name} has begun to notice what others miss. The household had kept them dry, fed and looked after.`);}
            }
        }
        const age=s.age+(today-m.since)/FORTUNE_TERMS.yearDays.value;
        const busy=c.jobs?.some(j=>(j.participants||[j.actorId]).includes(s.id));
        const cause=age>=s.lifespan?'old_age':m.lack>=FORTUNE_TERMS.neglectDays.value?'neglect':null;
        if(cause&&!busy)effects.push({type:'life',actor:s.id,status:'dead',lethal:true,reason:cause==='neglect'?'Neglected by the household':'Of old age'});
    }
    next.lastDay+=days;
    if(effects.length)applyEffects(effects);
    const seasons=Math.floor((next.lastDay-next.easedDay)/FORTUNE_TERMS.seasonDays.value);
    if(seasons>0){next.household=easeHousehold(next.household,seasons);next.easedDay+=seasons*FORTUNE_TERMS.seasonDays.value;}
    next.household.ledger=next.household.ledger.slice(-64);
    runRoutines(plan,c,manor,next,{stageJob,planOrder,notes});
    plan.nativePatch={...plan.nativePatch,household_fortunes:next};
    const previous=plan.absorbPublish;
    plan.absorbPublish=()=>{previous?.();state=next;for(const n of notes)log?.(n);};
}
// OG16 under AD16/AD19: an unlocked routine orders the same funded service the player could, and holds
// at a pending choice of the player's own, at a cost the household purse cannot bear, or when stopped.
export function routineCounts(root){
    const done=(actor,task)=>root.actors?.[actor]?.completed?.['home.staff.'+task]||0;
    return Object.fromEntries(Object.entries(TASK_ACTOR).map(([task,actor])=>[task,done(actor,task)]));
}
function routineNeed(r,c,manor){
    const q=conditionOf(manor);
    if(r.task==='cook')return (c.staffStock?.[COOK]?.[k('Roasted rat meat')]||0)<2;
    if(r.task==='repair')return q.integrity<100;
    return q.wetness>0;
}
function runRoutines(plan,c,manor,next,{stageJob,planOrder,notes}){
    for(const r of unlockedRoutines(routineCounts(plan.state))){
        if(next.routines.paused[r.id]||!routineNeed(r,c,manor))continue;
        const funds=c.staffResources?.[STEWARD]?.['home.estateFunds']||0;
        const gate=routineMayRun(r,{choicePending:!!c.jobs?.some(j=>j.actorId==='player'),lethal:r.task==='cook'&&funds-2<FORTUNE_TERMS.routineReserve.value});
        if(!gate.run)continue;
        const job=planOrder(r.task);if(!job)continue;
        const sequence=plan.state.sequence;
        try{plan.state.sequence++;stageJob(job);c.jobs=[...(c.jobs||[]),{actorId:job.actor,commandId:job.id}];notes.push(gate.why);}
        catch{plan.state.sequence=sequence;}
    }
}
export function setRoutinePaused(id,paused){
    if(!state||!ROUTINES.some(r=>r.id===id))throw Error('No such standing routine.');
    state={...state,routines:{paused:{...state.routines.paused,[id]:!!paused}}};
}
// Observer-safe read model (AR8): ranks and explains from observables; talent is never read.
export function projectFortunes(){
    const homes=domainRegistry.project('homes')||{};const manor=homes.homes?.find(h=>h.id==='manor');
    if(!manor||!state)return {visible:false,staff:[],watch:[],routines:[],household:null,parts:[],obligations:[]};
    const c=homes.context||{},o=observeToday(c,manor);
    const rows=FORTUNE_STAFF.map(s=>{const m=state.members[s.id]||{},alive=c.people?.[s.id]?.life==='alive';
        return {id:s.id,name:s.name,role:s.role,alive,bed:o.bed,fed:m.fed??0.8,tended:m.tended??1,signs:m.signs||0,awakened:m.awakened||null,dead:c.people?.[s.id]?.life==='dead'};});
    const watch=watchList(rows).map(w=>({...w,score:Math.round(w.score*100)/100}));
    const parts=[['Bed','bed',FORTUNE_DIALS.bed.why],['Fed','fed',FORTUNE_DIALS.care.why],['Tended','tended',FORTUNE_DIALS.care.why]];
    const counts=routineCounts({actors:ports?.root?.()?.actors||{}});
    return {visible:true,staff:rows.map(({id,name,role,alive,dead,awakened})=>({id,name,role,alive,dead,awakened,
        parts:parts.map(([label,key,why])=>({label,value:Math.round(rows.find(r=>r.id===id)[key]*100)/100,why}))})),
        watch,household:{standing:state.household.standing,resentment:state.household.resentment,ledger:state.household.ledger.slice().reverse()},
        routines:ROUTINES.map(r=>({id:r.id,task:r.task,why:r.why,threshold:r.threshold,count:counts[r.task]||0,paused:!!state.routines.paused[r.id]}))};
}
export {observableScore};
export const collectFortuneObligations=({career}={})=>collectObligations({household:state?.household,career});
registerDomain({id:'household_fortunes',deps:['homes'],initialState:()=>null,
    save:()=>state||undefined,
    migrate:slice=>migrateFortunes(slice),
    validate:(slice,envelope)=>validateFortunes(slice,envelope.expansion?.clock),
    load:slice=>{state=slice?structuredClone(slice):null;},
    commands:{setRoutinePaused},
    refresh:()=>panel?.render(),
    panels:[()=>{panel=createFortunesPanel({read:projectFortunes,setRoutinePaused,obligations:()=>collectFortuneObligations({career:readPort('villageCareer')}).rows});}],
    projection:projectFortunes});
