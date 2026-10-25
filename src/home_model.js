import {validateSchoolCircuit} from './home_school_circuit.js';
import {validateWarehouse} from './home_warehouse.js';
import {validateBrood,advanceBrood,broodWindow,broodPracticeBonus,planBrood} from './household_brood.js';
import {domainRegistry} from './domain_registry.js';
import {newHomeCondition,conditionOf,homeSupportsRest,validateHomeBuilding,settleHomeBuilding,planHomeBuilding} from './home_building_model.js';
import {admitManorStaff,planHomeStaff} from './home_staff.js';
import {validateWorkerRooms,planWorkerRoom} from './home_workers.js';
import {DOMICILE_FURNITURE as F, HOME_PLACES as P, HOME_STARTS as S, HOME_IMPROVEMENTS as I, HOME_WORLD, HOME_SUPPLIES, HOME_SITE, HOME_MATERIALS as M, HOME_BUILDINGS as B, homeKey} from './home_content.js';
import {validateHousehold, planHousehold, householdAnimalView} from './absorb_p23/household/model.js';
const check=(v,m)=>{if(!v)throw Error(`Home: ${m}`);};
const natural=n=>Number.isSafeInteger(n)&&n>=0;
const record=o=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>!['__proto__','constructor','prototype'].includes(k));
export const emptyHomes=()=>({schema:1,revision:0,start:null,primary:null,properties:{},lodger:null,beginning:false,ledger:[]});
const fixture=key=>{try{return F[JSON.parse(key).id];}catch{return null;}};
export function validateHomes(s,{clock=Number.MAX_SAFE_INTEGER,sequence=Number.MAX_SAFE_INTEGER}={}) {
    if(s==null)return;
    check(record(s)&&s.schema===1&&natural(s.revision)&&record(s.properties)&&Array.isArray(s.ledger)&&s.ledger.length<=40,'unsupported residence record');
    check(s.beginning===undefined||typeof s.beginning==='boolean','invalid beginning offer');
    check(s.start===null||record(s.start)&&S[s.start.profile]&&natural(s.start.at)&&s.start.at<=clock,'invalid beginning receipt');
    check(s.primary===null||Object.hasOwn(s.properties,s.primary),'missing primary residence');
    validateHomeBuilding(s,{clock});
    if(s.portable)validateHomes({...emptyHomes(),primary:'tent',properties:{tent:s.portable}}, {clock,sequence});
    let animals=0;
    for(const [id,h] of Object.entries(s.properties)) {
        const p=P[id];check(p&&record(h)&&h.id===id&&((h.tenure===p.tenure&&h.owner===p.owner)||(id==='shack'&&h.deed===true&&h.tenure==='owned'&&h.owner==='player')),'invalid title or residence');
        check(typeof h.name==='string'&&h.name.trim().length>0&&h.name.length<=60&&typeof h.access==='boolean'&&natural(h.acquiredAt)&&h.acquiredAt<=clock,'invalid residence access');
        check((p.period?natural(h.paidUntil)&&h.paidUntil>=h.acquiredAt:h.paidUntil===null)&&record(h.stock)&&record(h.fixtures)&&Array.isArray(h.improvements)&&new Set(h.improvements).size===h.improvements.length&&h.improvements.every(k=>I[k]),'invalid residence contents');
        check(h.tenure==='owned'||h.improvements.length===0,'unauthorized structural improvement');
        for(const [slot,row] of Object.entries(h.fixtures))check(record(row)&&fixture(row.key)?.slot===slot&&['player',p.owner].includes(row.owner),'invalid furnishing slot or owner');
        for(const [key,n] of Object.entries(h.stock)){let k;try{k=JSON.parse(key);}catch{throw Error('Home: invalid stock key');}check(record(k)&&(typeof k.id==='string'||record(k.components))&&natural(n)&&n>0,'invalid stored item');}
        if(h.construction!==undefined)check(B[id]&&record(h.construction)&&natural(h.construction.at)&&h.construction.at<=clock&&h.construction.site===HOME_SITE,'invalid construction receipt');
        if(h.warehouse!==undefined){check(id==='manor','this warehouse contract belongs at the manor');validateWarehouse(h.warehouse,clock);}
        if(h.circuit!==undefined){check(id==='manor','this forms circuit belongs at the manor');validateSchoolCircuit(h.circuit,clock);}
        if(h.brood!==undefined){check(id==='manor','this brood chamber belongs at the manor');validateBrood(h.brood,clock);}
        if(h.household){check(!p.legacy,'native household state has its existing owner');check(h.household.homeId===`${p.world||HOME_WORLD}:${p.location}`,'household endpoint mismatch');validateHousehold(h.household,{clock,sequence});if(h.household.animal)animals++;}
        check(Object.values(h.stock).reduce((a,b)=>a+b,0)<=homeCapacity(h),'local storage exceeds capacity');
    }
    if(s.lodger!=null)check(record(s.lodger)&&s.lodger.id==='home.lodger.reed'&&natural(s.lodger.coins)&&s.lodger.coins<=24&&(s.lodger.home===null||s.properties[s.lodger.home]?.improvements.includes('guestroom'))&&natural(s.lodger.paidUntil)&&s.lodger.paidUntil<=clock+1440,'invalid guest occupancy or funds');
    check(s.workers==null||record(s.workers),'invalid worker occupancy record');validateWorkerRooms(s,check);
    check(animals<=1,'a companion cannot occupy two homes');
    for(const r of s.ledger)check(record(r)&&natural(r.at)&&r.at<=clock&&typeof r.text==='string'&&r.text.length<=240,'invalid home history');
}
export const homeAt=(s,c)=>Object.values(s?.properties||{}).find(h=>(P[h.id].world||HOME_WORLD)===c.world&&P[h.id].location===c.location)||null;
export const homeRestable=(h,c)=>homeUsable(h,c)&&homeSupportsRest(h);
export const homeUsable=(h,c)=>!!h&&h.access&&(!P[h.id].legacy||c.nativeRights?.[h.id]===true)&&P[h.id].forms.includes(c.body.form)&&(h.id!=='nest'||c.body.flying===true)&&(!P[h.id].period||h.paidUntil>c.clock);
export function homeCapacity(h){return P[h.id].capacity+Object.values(h.fixtures).reduce((n,r)=>n+(fixture(r.key)?.effects.storage||0),0)+h.improvements.reduce((n,k)=>n+(I[k].capacity||0),0);}
export function homeDescription(h){return P[h.id].description.replace('a damaged side room',h.improvements.includes('restore')?'a restored side room':'a damaged side room');}
export function homeComfort(h) {
    const score=Object.values(h.fixtures).reduce((n,r)=>n+(['bed','hearth'].includes(fixture(r.key)?.slot)?2:1),0)+h.improvements.reduce((n,id)=>n+(id==='restore'?2:1),0);
    return {score,label:score>=4?'Lived-in':score>=2?'Settled':score?'Simple shelter':'Unfurnished'};
}
export function homeBenefits(s,c) {
    const h=homeAt(s,c),out={rows:[],xp:{},rest:1,storageAccess:false};if(!homeUsable(h,c))return out;
    const add=(id,name,effects,detail,comfortWeight=0)=>{out.rows.push({id,name,comfortWeight,active:true,scope:P[h.id].location,bonuses:{xp:effects.xp||{},rest:effects.rest||1},detail});out.rest*=effects.rest||1;for(const [k,v]of Object.entries(effects.xp||{}))out.xp[k]=(out.xp[k]||1)*v;};
    for(const [slot,r]of Object.entries(h.fixtures)){const f=fixture(r.key);if(f.forms.includes(c.body.form))add(`domicile.${slot}`,f.name,conditionOf(h).wetness>=500&&['bed','blanket','pillow'].includes(slot)?{...f.effects,rest:1,xp:{}}:f.effects,`${r.owner==='player'?'Your furnishing':'Household furnishing'}; installed here.`,['bed','hearth'].includes(slot)?2:1);}
    for(const k of h.improvements){const i=I[k];add(`domicile.${k}`,i.name,i,'Completed local improvement.',k==='restore'?2:1);}
    if(!P[h.id].legacy){const comfort=homeComfort(h),a=h.household?.animal,animal=a?.adopted&&a.mood==='content'&&h.household.hearth.smoke===0&&c.body.form==='human'?(a.ageMinutes>=1440?0.05:0.03):0;const smoke=(h.household?.hearth.smoke||0)>0||conditionOf(h).wetness>=500;add('domicile.comfort','Local home comfort',{rest:smoke?1:1+Math.min(6,comfort.score)*0.01+animal},`${comfort.label} · ${comfort.score} installed furnishing/room comfort. Quiet local rest and settled companionship; smoke suspends this comfort benefit.`);}
    if(h.id==='manor'&&h.fixtures.qi){const qi=domainRegistry.command('home_layout','qiAtBed')?.({home:h.id,world:c.world,fixtures:h.fixtures})||0;if(broodPracticeBonus(h,qi)>1)add('domicile.brood','Attending Cloudseed beetle',{xp:{Meditation:broodPracticeBonus(h,qi)}},'The chosen adult’s trained resonance and inherited mist sense help your real circulation practice in this actual room field.');if(qi>0)add('domicile.imported_qi','Circulation near the charged cradle',{xp:{Meditation:1+Math.min(1,qi)*0.1}},`Qi at the bed: ${qi.toFixed(2)}. Its distance from the powered cradle changes local Meditation learning; the field expires with its real packet.`);}
    out.storageAccess=true;return out;
}
export function householdHomeContext(h,c) {
    const active=homeAt({properties:{[h.id]:h}},c)?.id===h.id&&homeUsable(h,c);
    return {clock:c.clock,sequence:c.sequence,homeId:`${P[h.id].world||HOME_WORLD}:${P[h.id].location}`,homeOwned:h.access,
        atHome:active,alive:c.alive,controlled:c.body.ownerId==='player'&&c.body.controllerId==='player'&&c.body.form==='human',
        hearthOwned:!!h.fixtures.hearth,animalKnown:!!h.household?.animal||!c.animalElsewhere,
        ownedInventory:Object.fromEntries(Object.entries(c.inventory).filter(([key])=>!c.unspendable?.includes(key))),wet:c.wet,knownGift:c.knownGift,playToy:!!h.fixtures.toy};
}
export function settleHomes(raw,c,onEffects,onBuilding) {
    if(raw==null)return raw;const s=structuredClone(raw);
    for(const h of Object.values(s.properties))if(h.household&&h.household.lastClock<c.clock){const ctx=householdHomeContext(h,c);ctx.sequence=Math.max(ctx.sequence,h.household.lastSequence);const r=planHousehold(h.household,{type:'tick',clock:c.clock,sequence:ctx.sequence+1,elapsed:c.clock-h.household.lastClock},ctx);h.household=r.state;onEffects?.(h,r.effects);}
    for(const h of Object.values(s.properties))if(h.brood)advanceBrood(h.brood,c.clock,broodWindow(c,h));
    settleHomeBuilding(s,c,createProperty,onBuilding);return s;
}
function createProperty(id,clock,starting=false) {
    const p=P[id],h={id,name:p.name,owner:p.owner,tenure:p.tenure,access:true,acquiredAt:clock,paidUntil:p.period?clock+p.period:null,stock:{},fixtures:{},improvements:[]};
    const install=(id,owner)=>{h.fixtures[F[id].slot]={key:homeKey(id),owner};};
    if(!p.legacy)h.condition=newHomeCondition(clock);
    if(id==='tent')h.anchor=HOME_SITE;
    if(id==='manor'){h.condition.integrity=70;for(const f of ['Home plain bed','Home ragwork blanket','Home wooden tableware','Home fitted hearth','Home bookcase'])install(f,p.owner);}
    if(['rental','family'].includes(id))install('Home plain bed',p.owner);
    if(id==='family')install('Home wooden tableware',p.owner);
    if(['burrow','nest'].includes(id))install('Home nest lining','player');
    if(starting&&id==='cottage')for(const id of ['Home plain bed','Home ragwork blanket','Home fitted hearth'])install(id,'player');
    return h;
}
export function planHome(raw,request,c) {
    validateHomes(raw,c);check(c.alive&&(c.ready||['cancel_work','cancel_staff','cancel_household','office_cancel','cultivation_cancel','medicine_cancel','school_cancel','contacts_cancel','warehouse_stop','legacy_cancel'].includes(request.type)&&c.writable!==false),'use your living, free body and writable save');
    check(c.body.ownerId==='player'&&c.body.controllerId==='player','control your own body');
    check(c.world===HOME_WORLD||Object.entries(c.nativeRights||{}).some(([id,right])=>right&&(P[id].world||HOME_WORLD)===c.world),'visit a world with supported residence rights');
    const simEffects=[];const s=settleHomes(raw,c,null,rows=>simEffects.push(...rows))||emptyHomes(),items=[],out={simEffects,state:s,items,money:c.money,minutes:0,message:'',body:null,householdEffects:[]};
    const spend=(key,n)=>{check(natural(n)&&n>0&&(c.inventory[key]||0)>=n,'carry enough usable owned materials');check(!c.unspendable?.includes(key),'borrowed or reserved property cannot be spent');items.push({key,amount:-n});};
    const pay=n=>{check(c.money>=n,'not enough coins');out.money-=n;};
    const h=request.home?s.properties[request.home]:homeAt(s,c);
    const local=()=>{check(h&&homeAt(s,c)?.id===h.id,'return to this actual residence');check(homeUsable(h,c),'this body needs current residence access; renew a rental term if expired');return h;};
    const owner=(needsHands=true)=>{local();check(h.tenure==='owned'&&h.owner==='player','structural work needs your own home');if(needsHands)check(c.body.form==='human'&&(c.body.hands??0)>=1,'this building work needs a usable hand');};
    const receive=(key,n=1)=>items.push({key,amount:n});
    const means=form=>{check(c.body.mobile!==false,'reach and work at this site with a mobile body');check(c.body.form===form,'this construction method needs a fitting body');if(form==='human')check(c.body.hands>=1,'use a hand to gather and lash');if(form==='bird')check(c.body.flying===true&&c.body.beak===true&&c.body.feet>=1,'nest weaving here needs flight, a beak and grasping feet');if(form==='fox')check(c.body.paws>=2,'dig and gather using usable paws');};
    const site=()=>check(c.location===HOME_SITE&&c.world===HOME_WORLD,'visit the wild willow stand and its suitable unclaimed sites');
    if(!planHomeBuilding(s,request,c,out,{spend,receive,owner,local,means,site,h})&&!planHomeStaff(s,request,c,out)&&!planBrood(s,request,c,out))switch(request.type) {
    case 'institution_join': {
        check(c.world===HOME_WORLD&&c.location==='Village'&&c.body.form==='human'&&c.body.ownerId==='player'&&c.body.controllerId==='player','Meet the household recruiter in Village in your living controlled human body.');
        check(!s.properties.manor&&!c.people?.['home.manor.steward'],'This household already has a retained agreement; visit it instead of creating new funds.');
        const home=createProperty('manor',c.clock);s.properties.manor=home;s.primary='manor';s.beginning=false;admitManorStaff('worker',out);
        out.location=P.manor.location;out.message='You enter the Arlmere household as a provision worker and student, with a room by agreement. The household retains its estate, finite 32-coin treasury, pantry and staff. Study its primer and keep the ledger appointment to earn provision-office authority; no personal mastery or noble inheritance is granted.';break;
    }
    case 'start': {
        const p=S[request.profile];check(p&&c.fresh&&(!raw||s.beginning===true)&&!s.start&&Object.keys(s.properties).length===0&&!c.legacyAnimal,'choose one beginning before progressing or acquiring a home');
        const home=p.home?createProperty(p.home,c.clock,true):null;s.beginning=false;if(home){s.properties[p.home]=home;s.primary=p.home;}s.start={profile:request.profile,at:c.clock};
        out.body={id:'native.player.body',ownerId:'player',controllerId:'player',form:p.form,hands:p.form==='human'?2:0,mobile:true,...(p.form==='bird'?{flying:true,beak:true,feet:2}:p.form==='fox'?{paws:4}:{})};
        out.location=p.site||P[p.home].location;admitManorStaff(request.profile,out);
        if(p.form==='human'&&p.home){receive(homeKey('Rough wood log'),5);receive(homeKey('Linen cloth'));}
        out.message=`You begin ${home?'in '+home.name:'at '+p.site}. ${p.text}`;break;
    }
    case 'gather': {site();const m=M[request.item];check(m&&m.forms.includes(c.body.form),'gather materials suited to your body');means(c.body.form);const gathered=request.item==='Home dry grass'&&c.weatherAt?.(c.clock)?.raining?'Home damp grass':request.item;receive(homeKey(gathered));out.minutes=m.minutes;out.message=`Gathered one ${gathered==='Home damp grass'?'rain-damp shelter grass':m.name.toLowerCase()} bundle in ${m.minutes} played minutes, carried in your own custody. Fallen material needs no purchase.`;break;}
    case 'weave_lining': {check(c.location===HOME_SITE||!!homeAt(s,c),'work at your shelter or the willow gathering site');means(c.body.form);spend(homeKey('Home dry grass'),3);receive(homeKey('Home nest lining'));out.minutes=8;out.message='Wove three gathered grass bundles into a removable dry lining in eight played minutes. Carry and fit it at a suitable nest or burrow.';break;}
    case 'dismantle': {owner(false);const b=B[h.id];check(b&&h.construction,'this shelter needs an actual construction receipt');means(b.form);check(Object.keys(h.stock).length===0&&Object.keys(h.fixtures).length===0&&!h.household?.animal,'collect stored goods, pack fixtures and relocate companions before dismantling');for(const [id,n]of Object.entries(b.costs))if(Math.floor(n/2))receive(homeKey(id),Math.floor(n/2));check(!s.projects?.[h.id],'finish or abandon the structure work before dismantling');delete s.properties[h.id];if(s.primary===h.id)s.primary=Object.keys(s.properties)[0]||null;out.location=HOME_SITE;out.minutes=10;out.message='Dismantled your shelter and returned to the willow stand. Half the reusable frame and thatch materials were recovered; a dug burrow returns earth rather than portable goods.';break;}
    case 'ordinary': check(c.fresh&&!s.start&&Object.keys(s.properties).length===0,'this beginning has already been settled');s.beginning=false;out.message='You keep your ordinary beginning. Homes remain obtainable through play.';break;
    case 'register': {
        const p=P[request.home];check(p?.legacy&&c.nativeRights?.[request.home]===true&&c.location===p.location&&(p.world||HOME_WORLD)===c.world,'register actual existing home rights from this home');check(!s.properties[request.home],'this home is already registered');
        s.beginning=false;s.properties[request.home]=createProperty(request.home,c.clock);s.beginning=false;s.primary=request.home;out.message='Existing home access registered. No copied stock, fixtures or companion were granted.';break;
    }
    case 'deed': local();check(h.id==='shack'&&h.tenure==='shared'&&c.nativeRights?.shack,'purchase title for your actual accessible Shack');pay(60);h.deed=true;h.owner='player';h.tenure='owned';out.message='The Village settles the Shack deed in your name. Existing goods and workshop progress stay intact.';break;
    case 'acquire': {
        const p=P[request.home];check(p&&!p.legacy&&!s.properties[request.home]?.access,'this residence is already available');check(c.location==='Village','discuss the listed home in Village');check(p.forms.includes(c.body.form),'the offered home must fit your body');
        check(!B[request.home],'build this habitat at its actual wild site rather than settling it through a supplier');
        check(!['family','manor'].includes(request.home),'shared household access comes from its actual beginning, not an invented family');
        if(s.properties[request.home]){check(p.period,'this title is already held');const old=s.properties[request.home];pay(p.price);old.access=true;old.paidUntil=Math.max(c.clock,old.paidUntil)+p.period;}
        else{pay(p.price);s.properties[request.home]=createProperty(request.home,c.clock);}
        s.beginning=false;s.primary=request.home;out.message=`${p.name}: ${p.tenure==='rented'?'one day of lodging prepaid':'home rights settled'}.`;break;
    }
    case 'renew': check(h&&P[h.id].period&&['Village',P[h.id].location].includes(c.location),'renew with this host or from your room');pay(P[h.id].price);h.access=true;h.paidUntil=Math.max(c.clock,h.paidUntil)+P[h.id].period;out.message='One more played day of lodging is paid. No automatic charge.';break;
    case 'primary': local();s.primary=h.id;out.message=`${h.name} is your main residence. Goods stay at their actual homes.`;break;
    case 'rename': owner(false);check(typeof request.name==='string'&&request.name.trim().length>0&&request.name.trim().length<=60,'use a name of 1–60 characters');h.name=request.name.trim();out.message=`Home named ${h.name}.`;break;
    case 'buy': {check(c.location==='Village','buy furnishings from the Village home supplier');const f=F[request.item]||HOME_SUPPLIES[request.item];check(f,'unknown furnishing or supply');pay(f.price);receive(homeKey(request.item));out.message=`Bought ${f.name}; carry it to a suitable home to install.`;break;}
    case 'install': {local();const f=fixture(request.key);check(f&&f.forms.includes(c.body.form),'this furnishing needs a fitting body and room');check(!(P[h.id].legacy&&f.slot==='hearth'),'install native hearths through their existing home route');check(!h.fixtures[f.slot],'remove the current fixture in this slot first');spend(request.key,1);h.fixtures[f.slot]={key:request.key,owner:'player'};out.message=`Installed ${f.name}.`;break;}
    case 'remove': {check(h&&homeAt(s,c)?.id===h.id&&P[h.id].forms.includes(c.body.form),'return to this residence with a fitting body');const row=h.fixtures[request.slot];check(row&&row.owner==='player','communal and landlord furnishings remain with their owner');check(!(request.slot==='hearth'&&((h.household?.hearth.fuelMinutes||0)>0||(h.household?.hearth.firewood?.logs.length||0)>0)),'extinguish and empty the firewood pile before removing the hearth');delete h.fixtures[request.slot];check(Object.values(h.stock).reduce((a,b)=>a+b,0)<=homeCapacity(h),'empty enough storage before removing its capacity');receive(row.key);out.message='Removed your furnishing and returned the exact item to your pack.';break;}
    case 'deposit': local();check(Object.values(h.stock).reduce((a,b)=>a+b,0)<homeCapacity(h),'local storage is full');spend(request.key,1);h.stock[request.key]=(h.stock[request.key]||0)+1;out.message='One owned item moved into your private local storage.';break;
    case 'withdraw': check(h&&homeAt(s,c)?.id===h.id,'collect stored goods at their actual home');check((h.stock[request.key]||0)>0,'that stored item is gone');if(--h.stock[request.key]===0)delete h.stock[request.key];receive(request.key);out.message='One stored item returned to your pack. Expired lodging never destroys your belongings.';break;
    case 'improve': {owner();const i=I[request.improvement];check(i&&!h.improvements.includes(request.improvement),'choose an unfinished improvement');check(h.id==='cottage','these room plans fit the cottage');check(request.improvement==='restore'||h.improvements.includes('restore'),'restore the side room before fitting it out');pay(i.coins);spend(homeKey('Rough wood log'),i.wood);h.improvements.push(request.improvement);out.minutes=i.minutes;out.message=`${i.name} completed in ${i.minutes} played minutes.`;break;}
    case 'layout_fee': {local();check(Number.isSafeInteger(request.fee)&&request.fee>=0&&request.fee<=20&&typeof request.text==='string'&&request.text.length<=200,'use a modest hauling fee');pay(request.fee);out.minutes=5;out.message=request.text;break;}
    case 'worker_assign': {owner(false);out.message=planWorkerRoom(s,request,c,check);break;}
    case 'worker_release': {out.message=planWorkerRoom(s,request,c,check);break;}
    case 'invite': {owner();check(h.improvements.includes('guestroom'),'fit a guest room before offering lodging');check(!s.lodger?.home,'the lodger already occupies a room');check(!Object.values(s.workers||{}).some(a=>a.home===h.id),'the guest room already houses a worker');s.lodger ||= {id:'home.lodger.reed',coins:24,home:null,paidUntil:0};check(s.lodger.coins>=6,'the lodger has no funds for another prepaid stay');s.lodger.coins-=6;out.money+=6;s.lodger.home=h.id;s.lodger.paidUntil=c.clock+1440;out.message='Reed accepts the guest room and pays six coins from a 24-coin travel purse for one played day. Private storage stays yours.';break;}
    case 'guest_renew': {owner();check(s.lodger?.home===h.id&&s.lodger.paidUntil<=c.clock,'the current paid guest stay must finish first');check(s.lodger.coins>=6,'Reed has no funds for another paid day; hosting free or parting remain available');s.lodger.coins-=6;out.money+=6;s.lodger.paidUntil=c.clock+1440;out.message='Reed prepays six coins from the remaining travel purse for one more day.';break;}
    case 'guest_leave': {owner();check(s.lodger?.home===h.id,'no lodger occupies this room');s.lodger.home=null;out.message='You and Reed end the lodging arrangement. Spent rent is not replayed; the remaining travel purse is retained.';break;}
    case 'household': {local();check(!P[h.id].legacy,'use the existing household controls for this native home');check(c.body.form==='human','this household interaction uses a human body');const ctx=householdHomeContext(h,c);if(request.action==='meet')check(!c.animalElsewhere&&!c.legacyAnimal,'Moss already has a home elsewhere');const r=planHousehold(h.household,{type:request.action,clock:c.clock,sequence:c.sequence+1},ctx);h.household=r.state;for(const e of r.effects)if(e.type==='item'){if(e.amount<0)spend(e.key,-e.amount);else receive(e.key,e.amount);}else out.householdEffects.push(e);out.message=r.notices.join(' ')||'Household updated.';break;}
    case 'move_native_cat': {local();check(!P[h.id].legacy&&c.body.form==='human'&&!h.household?.animal,'use an empty supported companion home');const source=Object.entries(P).find(([id,p])=>p.legacy&&`${p.world||HOME_WORLD}:${p.location}`===c.legacyHousehold?.homeId);check(source&&c.nativeRights?.[source[0]]===true&&(source[1].world||HOME_WORLD)===c.world&&c.legacyHousehold?.animal,'your actual companion needs accessible local home rights');const ctx=householdHomeContext(h,{...c,animalElsewhere:false});h.household ||= planHousehold(undefined,{type:'meet',clock:c.clock,sequence:c.sequence+1},{...ctx,animalKnown:true}).state;h.household.animal=structuredClone(c.legacyHousehold.animal);out.removeLegacyAnimal=true;out.retrieving=true;out.minutes=2*((source[1].travelMinutes||5)+(P[h.id].travelMinutes||5));out.message=`You retrieve Moss from the previous local home and return in ${out.minutes} played minutes. Existing firewood and fixtures stay there.`;break;}
    case 'move_cat': {local();check(!P[h.id].legacy,'use an independently bound residence for relocation');check(c.body.form==='human','use a supported human companion route');const from=s.properties[request.from];check(from&&from.id!==h.id&&from.household?.animal&&from.access&&(P[from.id].world||HOME_WORLD)===c.world&&P[from.id].forms.includes(c.body.form),'the actual companion must be at an accessible home');check(!h.household?.animal,'this home already has a companion');const ctx=householdHomeContext(h,c);const initial=h.household||planHousehold(undefined,{type:'meet',clock:c.clock,sequence:c.sequence+1},{...ctx,animalKnown:true}).state;initial.animal=from.household.animal;initial.animal.mood=initial.hearth.smoke>0?'sheltering':initial.animal.adopted?'content':'curious';from.household.animal=null;h.household=initial;out.retrieving=true;out.minutes=2*((P[from.id].travelMinutes||5)+(P[h.id].travelMinutes||5));out.message=`You retrieve Moss and return in ${out.minutes} played minutes. The previous home keeps its own fire and furnishings.`;break;}
    default:throw Error('Home: unknown action');
    }
    s.revision++;s.ledger.push({at:c.clock,text:out.message.slice(0,240)});s.ledger=s.ledger.slice(-40);validateHomes(s,{...c,sequence:c.sequence+1});return out;
}
export function observedHome(h,c){const ctx=householdHomeContext(h,c);return householdAnimalView(h.household,ctx);}
