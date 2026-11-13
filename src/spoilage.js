// ITM8 spoilage owner (proposal, 2026-11-10). One pure reader: what a perishable's life is, how much of it is spent,
// and what it turns into. Shape from the Factorio quality/spoilage reading (FRC42): lifetime depends on quality;
// a spoiling thing becomes its declared result, it does not vanish; spent age rides with the item (ITM3, ITM22).
// Numbers are authored proposal balance, not copied. Every dial is default / dial / in-world reason / cost.
// No state lives here (AR3): callers keep the spent age (a place clock's minutes, a made-at stamp) and storage rates.
// Time units are the caller's own minutes (TMR9: this timer "spoils"; away time is projected lazily, never stored).
const DAY=1440;
// Authored lives in the holder's own minutes at base quality, and what each becomes. Dial: per good and world.
export const PERISHABLES=Object.freeze({
    'Cooked potato':{life:DAY,result:'Spoiled food'},
    'Cooked carrot':{life:DAY,result:'Spoiled food'},
    'Cooked clam':{life:DAY/2,result:'Spoiled food'},
    'book.hp.ing.fluxweed':{life:7*DAY,result:'Wilted fluxweed'}});
// Shared-lot perishables: one deadline for the whole lot from its arrival (an opening allowance, a ration issue), not a per-portion
// age, so the caller passes time since arrival as `spent`. Default: kept as itself when spent (result null); the world's own condition
// marks it unusable and nothing vanishes (ITM22). Not shelf goods: the stilled hearth keeps per-portion ages and does not take them.
// Gu opening petal lot (RI-c0023-02): five played days; `book_gu_life.js` reads its freshness duration from here (FRC42 fold).
export const PERISHABLE_LOTS=Object.freeze({
    'book.ri.academy.petals':{life:5*DAY,result:null}});
const entryOf=id=>Object.hasOwn(PERISHABLES,id)?PERISHABLES[id]:Object.hasOwn(PERISHABLE_LOTS,id)?PERISHABLE_LOTS[id]:null;
// Default: quality 100 is the base life; better work keeps longer (x0.5 at 50, x2 at 200). Dial: per world.
export const qualityLifeFactor=q=>Number.isFinite(q)?Math.min(2,Math.max(.5,q/100)):1;
const parse=key=>{try{const k=typeof key==='string'?JSON.parse(key):key;return k&&typeof k==='object'?k:null;}catch{return null;}};
export const isPerishable=key=>{const k=parse(key);return !!k&&!!entryOf(k.id);};
export function lifeOf(key){
    const k=parse(key),e=k&&entryOf(k.id);if(!e)return null;
    return Math.max(1,Math.floor(e.life*qualityLifeFactor(k.quality)));
}
export const resultOf=key=>{const k=parse(key),e=k&&entryOf(k.id);return e?e.result:null;};
// A rate multiplies minutes a storage lets pass (stilled hearth .25; a cool cellar would be .5). Callers that already
// measure spent age in the storage's own minutes pass rate 1.
export function readSpoilage(key,spent,{rate=1}={}){
    const life=lifeOf(key);if(life===null)return null;
    const used=spent*rate,left=life-used,state=left<0?'spoiled':used>life*.5?'turning':'fresh';
    return {life,spent:used,left:Math.max(0,left),state,result:resultOf(key)};
}
// Rough, in-world words: whole days when long, hours when short. Never more precise than a person could judge.
export function wordsFor(read){
    if(!read)return '';
    if(read.state==='spoiled')return 'spoiled';
    const days=Math.round(read.left/DAY),hours=Math.round(read.left/60);
    const span=days>=1?`about ${days} day${days>1?'s':''}`:hours>=1?`about ${hours} hour${hours>1?'s':''}`:'under an hour';
    return `${read.state}, good for ${span}`;
}
// Stacks keep the oldest-first rule visible: sort rows by spent age, most spent first; the first row is used first.
export const oldestFirst=(rows,spentOf)=>[...rows].sort((a,b)=>spentOf(b)-spentOf(a));
