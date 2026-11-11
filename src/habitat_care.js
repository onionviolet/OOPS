// LP4 original proposal. The native calendar and inventory remain authoritative.
// Time is projected lazily, so rendering/reloading never grants native stock.
import {check, natural} from './basics.js';
import {rationMinutes, readNeed} from './needs.js';
import {readFleece, fleeceDraw, careThoughts, isWoolKey} from './fleece_from_care.js';
// The sheep's hunger is the shared food need (needs.js, RCL12/LVR13): one hay ration holds careMinutes at the sheep's body rate.
// FRC56 (2026-11-10, proposal): hay gates production, as in Stardew; brushing no longer gates it but builds the keeper tie and
// the sheep's mood, which set the fleece's grade and amount (fleece_from_care.js). `lastMealAt` is the one receipt that outlives a
// collection, so the next feeding can tell how long the sheep went hungry. Optional: older saves without it read as unknown.
export const HABITAT_BODY='sheep';
export const HABITAT = Object.freeze({site:'village.meadow_pen',animal:'meadow.fleece_sheep',
    location:'Village',world:'base.frontier',buildCost:18,adoptCost:12,feedCost:2,
    careMinutes:rationMinutes(HABITAT_BODY,'food'),batchMinutes:6,yield:5});
export const HAY_KEY=JSON.stringify({id:'Meadow hay'});
export const WOOL_KEY=JSON.stringify({id:'Wool'});
// Wool carried under any grade (plain and finer stacks are separate keys).
export const carriedWool=inventory=>Object.entries(inventory||{}).reduce((n,[k,c])=>n+(isWoolKey(k)?c:0),0);
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
export function validateHabitat(s,clock=Number.MAX_SAFE_INTEGER){
    if(s==null)return null;
    check(object(s)&&s.schema===1&&s.policy==='played_care_v1'&&s.site?.id===HABITAT.site&&
        s.site.owner==='player'&&s.site.sheltered===true&&s.site.capacity===1&&
        natural(s.builtAt)&&natural(s.lastMinute)&&s.builtAt<=s.lastMinute&&s.lastMinute<=clock,
    'Invalid or unsupported meadow pen.');
    for(const k of ['feeds','attentions','collected'])check(natural(s[k]),'Invalid care history.');
    check(natural(s.progress)&&s.progress<=HABITAT.batchMinutes,'Invalid harvest progress.');
    if(s.animal==null)check(s.feeds===0&&s.attentions===0&&s.collected===0&&s.progress===0&&s.fedAt===null&&s.attendedAt===null,'Care requires an owned animal.');
    else check(s.animal.id===HABITAT.animal&&s.animal.owner==='player'&&s.animal.site===s.site.id&&s.animal.welfare==='sheltered_safe'&&
        natural(s.animal.adoptedAt)&&s.animal.adoptedAt>=s.builtAt&&s.animal.adoptedAt<=s.lastMinute,'Animal needs its suitable owned pen.');
    for(const [k,ok] of [['fedAt',s.feeds>s.collected],['attendedAt',s.attentions>0]])check(s[k]===null||
        natural(s[k])&&s[k]>=s.animal?.adoptedAt&&s[k]<=s.lastMinute&&ok,'Invalid saved care receipt.');
    check(s.lastMealAt==null||natural(s.lastMealAt)&&s.feeds>0&&s.lastMealAt>=s.animal?.adoptedAt&&s.lastMealAt<=s.lastMinute,'Invalid last meal receipt.');
    check(s.collected<=s.feeds,'Harvest requires finite feed.');
    check(s.progress===0||s.fedAt!==null,'Production requires a hay ration.');
    if(s.progress>0)check(s.progress<=s.lastMinute-s.animal.adoptedAt,'Production exceeds played time.');
    return s;
}
export function projectHabitat(owner,clock){
    validateHabitat(owner,clock);if(!owner)return null;
    check(natural(clock)&&clock>=owner.lastMinute,'The meadow clock cannot run backward.');
    const s=structuredClone(owner);
    if(s.animal&&s.fedAt!==null){
        const start=Math.max(s.lastMinute,s.fedAt),end=Math.min(clock,s.fedAt+HABITAT.careMinutes);
        s.progress=Math.min(HABITAT.batchMinutes,s.progress+Math.max(0,end-start));
    }
    s.lastMinute=clock;return s;
}
export function habitatFacts(owner,clock){
    const s=projectHabitat(owner,clock),
        need=readNeed({body:HABITAT_BODY,sinceMeal:s?.fedAt==null?null:clock-s.fedAt}),fed=s?.fedAt!=null&&need.level>0,
        attended=s?.attendedAt!=null&&clock<s.attendedAt+HABITAT.careMinutes;
    return {state:s,need,fed:!!fed,attended:!!attended,ready:s?.progress===HABITAT.batchMinutes,
        welfare:!s?.animal?'No animal':'Safe in suitable shelter with clean water'};
}
// ctx.mood is the sheep's moodOf reading (the host passes it); absent reads as even.
export function planHabitatAction(owner,action,{clock,money,inventory,location,world,ready,mood}){
    check(ready&&location===HABITAT.location&&world===HABITAT.world,'Return free and alive to your Village meadow pen.');
    check(natural(clock)&&Number.isFinite(money)&&money>=0&&object(inventory),'Invalid native care context.');
    const before=projectHabitat(owner,clock);let s=before&&structuredClone(before),cost=0,items=[],fleece=null;
    if(action==='build'){
        check(!s,'You already own the one-place meadow pen.');cost=HABITAT.buildCost;
        s={schema:1,policy:'played_care_v1',site:{id:HABITAT.site,owner:'player',sheltered:true,capacity:1},
            builtAt:clock,lastMinute:clock,animal:null,fedAt:null,attendedAt:null,progress:0,feeds:0,attentions:0,collected:0};
    }else{
        check(s?.site.owner==='player','Obtain your suitable sheltered pen first.');
        if(action==='adopt'){
            check(!s.animal,'Your one-place pen already has its sheep.');cost=HABITAT.adoptCost;
            s.animal={id:HABITAT.animal,owner:'player',site:s.site.id,adoptedAt:clock,welfare:'sheltered_safe'};
        }else if(action==='buy_feed'){
            cost=HABITAT.feedCost;items=[{key:HAY_KEY,amount:1}];
        }else{
            check(s.animal?.owner==='player'&&s.animal.site===s.site.id,'Care needs your own sheep in your own pen.');
            if(action==='feed'){
                check(s.progress<HABITAT.batchMinutes,'Collect the ready wool before another care cycle.');
                check(s.fedAt===null||clock>=s.fedAt+HABITAT.careMinutes,'The current hay ration still supports care.');
                check((inventory[HAY_KEY]||0)>=1,'Carry one actual Meadow hay bundle to feed your sheep.');
                // Begin a fresh supported interval while retaining earned progress.
                s.fedAt=clock;s.lastMealAt=clock;s.feeds++;items=[{key:HAY_KEY,amount:-1}];
            }else if(action==='attend'){
                check(s.attendedAt===null||clock>=s.attendedAt+HABITAT.careMinutes,'Your sheep has already been brushed for this care interval.');
                s.attendedAt=clock;s.attentions++;
            }else if(action==='collect'){
                check(s.progress===HABITAT.batchMinutes,'The wool is not ready. Feed the sheep, then allow six played minutes on its hay.');
                fleece=readFleece({owner:s,mood,draw:fleeceDraw(s)});items=[{key:fleece.key,amount:fleece.amount}];s.progress=0;s.collected++;s.fedAt=null;s.attendedAt=null;
            }else throw Error('Unknown meadow pen action.');
        }
    }
    check(money>=cost,`You need ${cost} coins for this meadow pen action.`);
    // Historical progress can span multiple paid care intervals. Do not infer it
    // solely from the most recent timestamps when refreshing a partial batch.
    return {state:s,money:money-cost,items,fleece,thoughts:careThoughts(before,s,action,clock,HABITAT.careMinutes)};
}
