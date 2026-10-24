// HTP45 pilot (proposal, 2026-10-23): an owned home keeps its own clock ratio.
// Authored, not canon. Every dial is default / dial / in-world reason / cost; none is a world law.
// Home state is read-only here (AR3): the place clock and its larder live in their own slice.
import {registerDomain} from './domain_registry.js';
const DAY=1440;
// Dials. ratio: default 1 (the world's clock); stilledRatio 0.25 at the Hearthside cottage because the
// old hearthstone holds slow hours when kept fed. Cost: upkeep per world day paid up front, an
// offering to reopen, and a settling fee to release it cleanly. Lapse is the consequence of neglect.
export const PLACE_DIALS=Object.freeze({cottage:{label:'Hearthside cottage',ratio:1,stilledRatio:.25,upkeepPerDay:2,maxDays:7,releasePerOwedDay:1,reopenOffering:4,sandglassPrice:3,
    why:'The hearthstone slows the room only while it is fed; unfed, the hours it withheld come back together.'}});
// Shelf life is measured in the place's own minutes. Authored default per item id, dial per world.
export const SHELF_LIFE=Object.freeze({'Cooked potato':DAY,'Cooked carrot':DAY,'Cooked clam':DAY/2});
export const OBSERVER_ROUTES=Object.freeze({
    present:'Standing in the place: you see the larder\'s condition and whether the hearth keeps slow hours, not by how much.',
    sandglass:'Standing in the place with a timekeeping means (a sand glass against the world): the ratio, owed hours and larder ages.'});
let state=null,ports;
const fresh=()=>({schema:1,places:{}});
const cur=()=>state||fresh();
const isNat=n=>Number.isInteger(n)&&n>=0;
const newPlace=(id,clock)=>({id,status:'open',ratio:PLACE_DIALS[id].ratio,at:clock,age:0,drift:0,stilledUntil:null,larder:[]});
export function validatePlaceClocks(s){
    if(s==null)return;
    const ok=c=>{if(!c)throw Error('Place clocks: invalid slice');};
    ok(s.schema===1&&s.places&&typeof s.places==='object'&&(s.sandglass===undefined||typeof s.sandglass==='boolean'));
    for(const [id,p] of Object.entries(s.places)){
        ok(PLACE_DIALS[id]&&p.id===id&&['open','stilled','closed'].includes(p.status));
        ok(isNat(p.at)&&isNat(p.age)&&isNat(p.drift)&&p.ratio>0&&p.ratio<=1&&(p.stilledUntil===null||isNat(p.stilledUntil))&&Array.isArray(p.larder));
        ok((p.status==='stilled')===(p.stilledUntil!==null));
        for(const r of p.larder)ok(typeof r.key==='string'&&isNat(r.count)&&r.count>0&&isNat(r.born)&&r.born<=p.age);
    }
}
// Settle one place to world time `now`. Pure: returns a new place. The clock never runs backwards.
export function settlePlace(place,now){
    const p=structuredClone(place);if(now<=p.at)return p;
    if(p.status==='stilled'){
        const end=Math.min(now,p.stilledUntil),dt=end-p.at,inside=Math.floor(dt*p.ratio);
        p.age+=inside;p.drift+=dt-inside;p.at=end;
        if(now>p.stilledUntil){ // upkeep ran out: the place closes and the withheld hours come back at once
            p.age+=p.drift;p.drift=0;p.status='closed';p.ratio=1;p.stilledUntil=null;p.rushed=true;
            p.age+=now-p.at;p.at=now;
        }
    }else{p.age+=now-p.at;p.at=now;}
    return p;
}
const lifeOf=key=>{let id;try{id=JSON.parse(key).id;}catch{return null;}return SHELF_LIFE[id]??null;};
const larderRows=p=>p.larder.map(r=>({key:r.key,count:r.count,spent:p.age-r.born,life:lifeOf(r.key)})).map(r=>({...r,spoiled:r.life!==null&&r.spent>r.life}));
function plan(request){
    const c=ports.read(),dial=PLACE_DIALS[request.place],bad=m=>{throw Error(m);};
    if(!dial)bad('That place has no clock of its own.');
    if(!c.owned.includes(request.place))bad('Only an owned place keeps its own clock.');
    const s=cur(),next=structuredClone(s);
    const p=settlePlace(next.places[request.place]||newPlace(request.place,c.clock),c.clock);next.places[request.place]=p;
    const out={next,cost:{money:0,items:[]},message:''};
    switch(request.type){
    case 'still':{ // spend time: keep the hearth slow for N world days, paid up front
        const days=request.days;if(!Number.isInteger(days)||days<1||days>dial.maxDays)bad(`Feed the hearth for 1 to ${dial.maxDays} days.`);
        if(p.status==='closed')bad('The land-spirit has closed this hearth. Make the reopening offering first.');
        if(p.status==='stilled')bad('The hearth is already slow; release it before feeding it again.');
        p.status='stilled';p.ratio=dial.stilledRatio;p.stilledUntil=c.clock+days*DAY;p.at=c.clock;out.cost.money=days*dial.upkeepPerDay;
        out.message=`The hearthstone is fed for ${days} day${days>1?'s':''}. Hours inside now pass slowly.`;break;}
    case 'release':{
        if(p.status!=='stilled')bad('The hearth is not slowed.');
        const owed=Math.ceil(p.drift/DAY);out.cost.money=owed*dial.releasePerOwedDay;
        p.status='open';p.ratio=dial.ratio;p.stilledUntil=null;p.drift=0;
        out.message=owed?`You settle ${owed} owed day${owed>1?'s':''} with the hearthstone. The hours return gently.`:'The hearth returns to the world\'s pace; nothing was owed.';break;}
    case 'reopen':{
        if(p.status!=='closed')bad('The hearth is not closed.');
        p.status='open';p.rushed=false;out.cost.money=dial.reopenOffering;out.message='The land-spirit accepts the offering and lets the hearth open.';break;}
    case 'sandglass':{ // in-world way to the numeric route: buy a sand glass at the cottage, then read it against the hearth
        if(next.sandglass)bad('You already keep a sand glass here.');
        next.sandglass=true;out.cost.money=dial.sandglassPrice;out.message='You buy a small sand glass and set it on the mantel. It runs at the world\'s pace, so it can be read against the hearth.';break;}
    case 'store':{
        if(p.status==='closed')bad('The land-spirit has closed this hearth; the larder refuses new goods.');
        if(lifeOf(request.key)===null)bad('That keeps by no clock here; use ordinary storage.');
        if(!(c.inventory[request.key]>0))bad('You are not carrying that.');
        const row=p.larder.find(r=>r.key===request.key&&r.born===p.age);
        if(row)row.count++;else p.larder.push({key:request.key,count:1,born:p.age});
        out.cost.items.push({key:request.key,delta:-1});out.message='One portion is set on the hearth shelf.';break;}
    case 'take':{
        const i=p.larder.findIndex(r=>r.key===request.key);if(i<0)bad('Nothing like that is on the shelf.');
        const r=p.larder[i],spent=p.age-r.born,gone=lifeOf(r.key)!==null&&spent>lifeOf(r.key);
        if(--r.count===0)p.larder.splice(i,1);
        if(!gone)out.cost.items.push({key:request.key,delta:1});
        out.message=gone?'It has spoiled on the shelf and is thrown out.':'You take the portion back, still good.';out.spoiled=gone;break;}
    default:bad('Unknown place-clock action.');
    }
    if(c.money<out.cost.money)bad(`Needs ${out.cost.money} coins.`);
    out.request=request;out.clock=c.clock;out.money=c.money;return out;
}
export const quotePlaceClock=request=>{const q=plan(request);return {request,clock:q.clock,money:q.money,cost:q.cost,message:q.message};};
export function executePlaceClock(quote){
    const q=plan(quote.request);
    if(q.cost.money!==quote.cost.money||JSON.stringify(q.cost.items)!==JSON.stringify(quote.cost.items)||q.clock!==quote.clock)throw Error('The terms changed; ask again.');
    ports.settle({money:-q.cost.money,items:q.cost.items,state:q.next}); // atomic; throws before publication on failure
    state=q.next;ports.log?.(q.message);return q;
}
// Observer-safe projection (AR8): nothing without a route; the world clock is never shown here.
export function projectPlaceClock(placeId,route){
    const c=ports.read(),dial=PLACE_DIALS[placeId];
    if(!dial||!c.owned.includes(placeId))return {visible:false};
    if(!(route in OBSERVER_ROUTES)||c.location!==dial.label||(route==='sandglass'&&!(cur().sandglass||c.observerMeans?.includes('sandglass'))))return {visible:false,reason:'You have no way to read this place from here.'};
    const s=cur().places[placeId];if(!s)return {visible:true,route,lines:['The hearth keeps the world\'s hours.']};
    const p=settlePlace(s,c.clock),lines=[];
    lines.push(p.status==='stilled'?'The hearth keeps slow hours.':p.status==='closed'?'The hearth is closed; the land-spirit withholds it.':'The hearth keeps the world\'s hours.');
    if(p.rushed)lines.push('The withheld hours came back together; the shelf shows it.');
    if(route==='sandglass')lines.push(`Ratio ${p.ratio} to the world; ${p.drift} minutes owed.`);
    for(const r of larderRows(p))lines.push(route==='sandglass'?`${r.count} stored, ${r.spent} min old${r.spoiled?', spoiled':''}`:r.spoiled?`${r.count} stored, spoiled`:`${r.count} stored, ${r.life&&r.spent>r.life*.5?'turning':'fresh'}`);
    return {visible:true,route,lines};
}
export const placeClockState=()=>state;
let panelHook=null,refreshHook=null;
export function configurePlaceClock(operations){ports=operations;panelHook=operations.mountPanel||null;refreshHook=operations.refresh||null;}
registerDomain({id:'placeClocks',initialState:fresh,save:()=>state||undefined,
    validate:slice=>validatePlaceClocks(slice),load:slice=>{state=slice?structuredClone(slice):null;},
    commands:{quote:quotePlaceClock,execute:executePlaceClock},projection:projectPlaceClock,
    refresh:()=>{refreshHook?.();},panels:[()=>{panelHook?.();}]});
