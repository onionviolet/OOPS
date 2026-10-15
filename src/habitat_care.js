// LP4 original proposal. The native calendar and inventory remain authoritative.
// Time is projected lazily, so rendering/reloading never grants native stock.
export const HABITAT = Object.freeze({site:'village.meadow_pen',animal:'meadow.fleece_sheep',
    location:'Village',world:'base.frontier',buildCost:18,adoptCost:12,feedCost:2,
    careMinutes:12,batchMinutes:6,yield:5});
export const HAY_KEY=JSON.stringify({id:'Meadow hay'});
export const WOOL_KEY=JSON.stringify({id:'Wool'});
const natural=n=>Number.isSafeInteger(n)&&n>=0;
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const check=(v,m)=>{if(!v)throw Error(m);};
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
    for(const [k,n] of [['fedAt','feeds'],['attendedAt','attentions']])check(s[k]===null||
        natural(s[k])&&s[k]>=s.animal?.adoptedAt&&s[k]<=s.lastMinute&&s[n]>s.collected,'Invalid saved care receipt.');
    check(s.collected<=s.feeds&&s.collected<=s.attentions,'Harvest requires finite feed and attention.');
    check(s.progress===0||s.fedAt!==null&&s.attendedAt!==null,'Production requires both care facts.');
    if(s.progress>0)check(s.progress<=s.lastMinute-s.animal.adoptedAt,'Production exceeds played time.');
    return s;
}
export function projectHabitat(owner,clock){
    validateHabitat(owner,clock);if(!owner)return null;
    check(natural(clock)&&clock>=owner.lastMinute,'The meadow clock cannot run backward.');
    const s=structuredClone(owner);
    if(s.animal&&s.fedAt!==null&&s.attendedAt!==null){
        const start=Math.max(s.lastMinute,s.fedAt,s.attendedAt),
            end=Math.min(clock,s.fedAt+HABITAT.careMinutes,s.attendedAt+HABITAT.careMinutes);
        s.progress=Math.min(HABITAT.batchMinutes,s.progress+Math.max(0,end-start));
    }
    s.lastMinute=clock;return s;
}
export function habitatFacts(owner,clock){
    const s=projectHabitat(owner,clock),fed=s?.fedAt!=null&&clock<s.fedAt+HABITAT.careMinutes,
        attended=s?.attendedAt!=null&&clock<s.attendedAt+HABITAT.careMinutes;
    return {state:s,fed:!!fed,attended:!!attended,ready:s?.progress===HABITAT.batchMinutes,
        welfare:!s?.animal?'No animal':'Safe in suitable shelter with clean water'};
}
export function planHabitatAction(owner,action,{clock,money,inventory,location,world,ready}){
    check(ready&&location===HABITAT.location&&world===HABITAT.world,'Return free and alive to your Village meadow pen.');
    check(natural(clock)&&Number.isFinite(money)&&money>=0&&object(inventory),'Invalid native care context.');
    let s=projectHabitat(owner,clock),cost=0,items=[];
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
                s.fedAt=clock;s.feeds++;items=[{key:HAY_KEY,amount:-1}];
            }else if(action==='attend'){
                check(s.progress<HABITAT.batchMinutes,'Collect the ready wool before another care cycle.');
                check(s.attendedAt===null||clock>=s.attendedAt+HABITAT.careMinutes,'Your sheep has already been brushed for this care interval.');
                s.attendedAt=clock;s.attentions++;
            }else if(action==='collect'){
                check(s.progress===HABITAT.batchMinutes,'The wool is not ready. Feed and brush, then allow six supported played minutes.');
                items=[{key:WOOL_KEY,amount:HABITAT.yield}];s.progress=0;s.collected++;s.fedAt=null;s.attendedAt=null;
            }else throw Error('Unknown meadow pen action.');
        }
    }
    check(money>=cost,`You need ${cost} coins for this meadow pen action.`);
    // Historical progress can span multiple paid care intervals. Do not infer it
    // solely from the most recent timestamps when refreshing a partial batch.
    return {state:s,money:money-cost,items};
}
