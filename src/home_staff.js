import {admitHousehold,staffReadiness,planHouseholdLife} from './home_household.js';
import {HOME_PLACES as P,HOME_STARTS as S,HOME_SITE,homeKey as k} from './home_content.js';
import {BUILDER,STEWARD,COOK,KEEPER} from './home_work_content.js';
const check=(v,m)=>{if(!v)throw Error('Home: '+m);};
const resource=(actor,key,amount)=>({type:'resource',actor,key,amount});
export const HOME_STAFF=[{id:STEWARD,name:'Rowan',role:'Family steward'},{id:COOK,name:'Iven',role:'Household cook'},{id:KEEPER,name:'Toma',role:'Estate caretaker'}];
export function admitManorStaff(profile,out) {
    const p=S[profile];if(!p?.rank)return;
    for(const actor of [STEWARD,COOK,KEEPER])out.simEffects.push({type:'spawn',personId:actor,definitionId:actor},{type:'fact',scope:'actor',actor,key:'home.employed',value:true});
    admitHousehold(out);
    out.simEffects.push({type:'fact',scope:'actor',actor:'player',key:'home.rank',value:p.rank},resource(STEWARD,'home.estateFunds',p.estateFunds),resource(STEWARD,'home.allowanceRemaining',p.allowance),
        {type:'item',actor:COOK,key:k('Rat meat chunks'),amount:4},{type:'item',actor:COOK,key:k('Rough wood log'),amount:3},
        {type:'item',actor:KEEPER,key:k('Rough wood log'),amount:4},{type:'item',actor:KEEPER,key:k('Home dry grass'),amount:8});
}
export function planHomeStaff(s,r,c,out) {
    const home=s.properties.manor,atManor=home?.access&&c.location===P.manor.location&&c.body.form==='human';
    const available=id=>c.people?.[id]?.life==='alive'&&c.people[id].location===(id===BUILDER?c.location:P.manor.location);
    if(planHouseholdLife(s,r,c,out))return true;
    switch(r.type) {
    case 'hire_builder': {
        check(c.body.form==='human'&&(c.body.hands||0)>0,'agree the shared work with a supported speaking body');
        check(c.location===HOME_SITE||Object.values(s.properties).some(h=>h.owner==='player'&&P[h.id].location===c.location),'meet the builder at a supported owned home or wild work site');
        check(!c.jobs?.some(j=>(j.participants||[j.actorId]).includes(BUILDER)),'the builder is already working');
        if(!c.people?.[BUILDER])out.simEffects.push({type:'spawn',personId:BUILDER,definitionId:BUILDER});else check(c.people[BUILDER].life==='alive','the contracted builder is unavailable');
        out.simEffects.push({type:'relocate',actor:BUILDER,location:c.location});out.minutes=c.people?.[BUILDER]?.location===c.location?0:5;
        out.message='Ada agrees to paid shared contributions at this site, two coins per completed contribution. Her travel takes five played minutes when moving; wages remain hers. She can take one accepted job at a time.';return true;
    }
    case 'dismiss_builder': check(available(BUILDER)&&!c.jobs?.some(j=>(j.participants||[j.actorId]).includes(BUILDER)),'meet the idle builder before ending the visit');out.simEffects.push({type:'relocate',actor:BUILDER,location:'Village'});out.minutes=c.location==='Village'?0:5;out.message='Ada returns to Village with her earned wages. Unfinished project materials and completed work remain at their site.';return true;
    case 'allowance': {check(atManor&&available(STEWARD),'meet your family steward at the manor');const n=c.staffResources?.[STEWARD]?.['home.allowanceRemaining']||0;check(n>0&&(c.staffResources?.[STEWARD]?.['home.estateFunds']||0)>=n,'the agreed allowance is exhausted or the household cannot fund it');out.simEffects.push(resource(STEWARD,'home.estateFunds',-n),resource(STEWARD,'home.allowanceRemaining',-n));out.money+=n;out.message=`Rowan transfers your agreed ${n}-coin allowance from the retained household funds. Staff pay and the remaining treasury still belong to the household.`;return true;}
    case 'staff_order': {
        check(atManor,'request household services at your actual family home');const actor=r.service==='cook'?COOK:KEEPER;check(available(actor),'the willing staff member is not present');
        check(['cook','repair','dry'].includes(r.service),'choose a supported household service');
        check(staffReadiness(c,actor)==='willing to consider a funded request',staffReadiness(c,actor));
        if(r.service==='repair')check((home.condition?.integrity??100)<100&&!s.projects?.manor,'the roof needs damage and no competing building project');
        if(r.service==='dry')check((home.condition?.wetness||0)>0,'the room is already dry');
        out.job={id:'home.staff.'+r.service,actor};out.message='The staff member accepts one finite, funded order. Work uses the shared played clock and can continue while you are elsewhere. Supplies, wages and finished goods retain their actual owners.';return true;
    }
    case 'cancel_staff': {check(atManor,'discuss the current order at the manor');const job=c.jobs?.find(j=>j.id===r.job&&[COOK,KEEPER].includes(j.actorId)&&j.commandId.startsWith('home.staff.'));check(job,'the actual staff order changed');out.job={cancel:job.id,actor:job.actorId};out.message='The requested order is cancelled. Exact unearned wages and unused reserved supplies return to their actual household owners.';return true;}
    case 'collect_meal': check(atManor&&available(COOK)&&(c.staffStock?.[COOK]?.[k('Roasted rat meat')]||0)>0,'meet the cook when a prepared household meal is ready');out.simEffects.push({type:'transfer',from:COOK,to:'player',key:k('Roasted rat meat'),count:1});out.message='Iven offers one prepared meal under your household hospitality. Pantry ingredients remain communal.';return true;
    case 'supply_staff': {check(atManor&&[COOK,KEEPER].includes(r.actor)&&available(r.actor),'meet this staff member at the manor');const allowed=r.actor===COOK?['Rat meat chunks','Rough wood log']:['Rough wood log','Home dry grass'];check(allowed.includes(r.item)&&(c.inventory[k(r.item)]||0)>0&&!c.unspendable?.includes(k(r.item)),'offer one actual usable owned supply');out.simEffects.push({type:'transfer',from:'player',to:r.actor,key:k(r.item),count:1});out.message='One personal supply is given to the staff member’s actual household stock. This gift does not grant ownership of the estate pantry.';return true;}
    default:return false;
    }
}
