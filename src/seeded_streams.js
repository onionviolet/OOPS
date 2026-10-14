// Per-save decisions. Legacy expansion/simulation/duel generators remain owners
// of their own cursors. No cheat policies are applied here; receipts are the seam.
export const STREAMS = Object.freeze({encounter:'encounter', combat:'encounter:core', loot:'loot', market:'market',
    craft:'craft', gather:'gather', reward:'reward', localLife:'world.events:local_life'});
const families = new Set(['world.events','world.people','people','deck','director','fate','interaction','encounter',
    'loot','market','craft','gather','reward','discovery','text','legacy.action','legacy.outcome']);
const object = v => v && typeof v === 'object' && !Array.isArray(v);
const natural = v => Number.isSafeInteger(v) && v >= 0;
const uint = v => Number.isInteger(v) && v >= 0 && v <= 0xffffffff;
function requireStream(name) {
    if(typeof name !== 'string' || !families.has(name.split('@')[0].split(':')[0]) || name.length > 240)
        throw Error('Unknown random stream.');
}
export function hashStreamSeed(seed, id) {
    let n=seed; for(const ch of id) n=Math.imul(n ^ ch.charCodeAt(0),16777619) >>> 0;
    return n || 1;
}
export function mix32(n) {
    n=Math.imul(n ^ (n >>> 16),0x85ebca6b);
    n=Math.imul(n ^ (n >>> 13),0xc2b2ae35);
    return (n ^ (n >>> 16)) >>> 0;
}
export function createStreams(seed) {
    if(!uint(seed)) throw Error('Invalid stream seed.');
    return {schema:1,root:hashStreamSeed(seed,'streams.root'),cells:{},log:[]};
}
export function validateStreams(s) {
    if(!object(s) || s.schema !== 1 || !uint(s.root) || !object(s.cells) || !Array.isArray(s.log) || s.log.length>256)
        throw Error('This save needs a compatible seeded-stream reader.');
    for(const [name,c] of Object.entries(s.cells)) {
        // Preserve unknown future stream names on import, but never draw them.
        if(!name || name.length>240 || !object(c) || !natural(c.n) || !uint(c.salt)) throw Error('Invalid saved stream cell.');
    }
    for(const r of s.log) if(!object(r) || typeof r.s!=='string' || typeof r.k!=='string' || !natural(r.n) || !uint(r.salt) ||
        !Number.isFinite(r.u) || r.u<0 || r.u>=1) throw Error('Invalid saved stream receipt.');
    return s;
}
export function ensureStreams(state, legacySeed = state.rng) {
    if(state.streams == null) state.streams=createStreams(legacySeed);
    return validateStreams(state.streams);
}
export function scopedStream(name, world='base.frontier') {
    requireStream(name);
    return name===STREAMS.craft ? name : `${name}@${world}`;
}
// Pure evaluation: planners can branch/inspect without advancing a live cursor.
export function unitDecision(s, stream, key, n=0, salt=0) {
    requireStream(stream);
    if(typeof key!=='string' || !natural(n) || !uint(salt)) throw Error('Invalid random decision.');
    const u=mix32(hashStreamSeed(s.root,JSON.stringify([stream,key,salt,n]))) / 0x100000000;
    return {value:u,receipt:{id:JSON.stringify([stream,key,n,salt]),s:stream,k:key,n,salt,u,via:null,orig:null}};
}
// Pure one-time generator seed from the saved stream root. No cursor advance and
// no receipt: generators that save their own resolved truth (P2 mixtures, P4
// travelers) take this once; reload reads their saved state, never this seed.
export function streamSeed(state, stream, key) {
    return Math.floor(unitDecision(ensureStreams(state),stream,key).value*0x100000000)>>>0;
}
function remember(s,r) {
    s.log.push(r);
    let excess=s.log.reduce((n,x)=>n+Number(x.s===r.s),0)-32;
    s.log=s.log.filter(x=>x.s!==r.s || excess--<=0).slice(-256);
}
export function nextOrdinal(state,stream) {
    requireStream(stream);
    const s=ensureStreams(state),c=s.cells[stream] ||= {n:0,salt:0};
    if(c.n===Number.MAX_SAFE_INTEGER) throw Error('Random stream counter exhausted.');
    return ++c.n;
}
export function drawUnit(state,stream,key) {
    const n=nextOrdinal(state,stream),s=state.streams;
    const result=unitDecision(s,stream,key,n,s.cells[stream].salt);
    remember(s,result.receipt);return result.value;
}
export function keyedUnit(state,stream,key,n=0) {
    const s=ensureStreams(state),result=unitDecision(s,stream,key,n,s.cells[stream]?.salt||0);
    remember(s,result.receipt);return result.value;
}
export function rollChance(s,stream,key,p,n=0) {
    if(!Number.isFinite(p)||p<0||p>1)throw Error('Invalid chance.');
    const r=unitDecision(s,stream,key,n);return {hit:r.value<p,receipt:{...r.receipt,decided:r.value<p}};
}
export function rollInt(s,stream,key,lo,hi,{dist='legacyRound',n=0}={}) {
    if(!Number.isSafeInteger(lo)||!Number.isSafeInteger(hi)||hi<lo||!['uniform','legacyRound'].includes(dist))throw Error('Invalid integer range.');
    const r=unitDecision(s,stream,key,n),value=dist==='uniform'?lo+Math.floor(r.value*(hi-lo+1)):Math.round(lo+r.value*(hi-lo));
    return {value,receipt:{...r.receipt,decided:value}};
}
export function rollTable(s,stream,key,weights,n=0) {
    if(!Array.isArray(weights)||!weights.length||weights.some(x=>!Number.isFinite(x)||x<0)||!Number.isFinite(weights.reduce((a,b)=>a+b,0))||weights.every(x=>x===0))throw Error('Invalid weighted table.');
    const r=unitDecision(s,stream,key,n);let remaining=r.value*weights.reduce((a,b)=>a+b,0),index=0;
    for(;index<weights.length-1;index++){remaining-=weights[index];if(remaining<0)break;}
    return {index,receipt:{...r.receipt,decided:index}};
}
let readState;
export function bindGameStreams(provider) {readState=provider;}
function live() {if(!readState)throw Error('Per-save random streams are not bound.');return readState();}
export function gameStream(name) {const state=live();return scopedStream(name,state.actors?.player?.worldId||'base.frontier');}
export function gameRandom(name,key='native') {return drawUnit(live(),gameStream(name),key);}
export function gameOrdinal(name) {return nextOrdinal(live(),gameStream(name));}
export function gameKeyedRandom(name,key) {return keyedUnit(live(),gameStream(name),key);}
export function gameRandomRange(name,key,min,max) {return Math.round(gameRandom(name,key)*(max-min)+min);}
// A synchronous commit-only recipe view. Its private-field methods remain bound
// to the original; getResult resolves its quality through this view. Previews
// still use the untouched original recipe and never consume saved draws.
export function seededRecipe(recipe,random) {
    let view;
    const quality=(...args)=>{const [lo,hi]=recipe.get_quality_range(...args);return Math.round(Math.round(lo+random()*(hi-lo))/recipe.quality_precision)*recipe.quality_precision;};
    view=new Proxy(recipe,{get(target,key){if(key==='roll_quality')return quality;
        const v=Reflect.get(target,key,target);return typeof v==='function'?v.bind(key==='getResult'?view:target):v;}});
    return view;
}

export function validateNativeEncounter(s,locationId) {
    if(s==null)return;
    const fail=()=>{throw Error('Invalid saved native encounter.');};
    if(!object(s)||s.schema!==1||s.locationId!==locationId||typeof s.key!=='string'||!s.key||
        !object(s.turns)||!object(s.loops)||!Array.isArray(s.enemies)||!s.enemies.length||s.enemies.length>1000)fail();
    for(const side of ['attackers','defenders']) {
        const length=side==='attackers'?1:s.enemies.length;
        if(!Array.isArray(s.turns[side])||s.turns[side].length!==length||s.turns[side].some(n=>!natural(n)))fail();
    }
    for(const e of s.enemies) {
        if(!object(e)||typeof e.template!=='string'||typeof e.key!=='string'||!object(e.stats)||!object(e.full)||typeof e.alive!=='boolean')fail();
        for(const stats of [e.stats,e.full])for(const v of Object.values(stats))if(!Number.isFinite(v)||v<0)fail();
        if(!(e.full.max_health>0)||e.full.health>e.full.max_health||e.alive!==(e.full.health>0))fail();
    }
    for(const [key,p] of Object.entries(s.loops)) {
        const [side,index]=key.split(':');
        if(!['attackers','defenders'].includes(side)||!natural(Number(index))||Number(index)>=s.turns[side].length||!object(p)||
            !natural(p.count)||p.count>=60||!Array.isArray(p.targets)||!p.targets.length||
            p.targets.some(i=>!natural(i)||i>=(side==='attackers'?s.enemies.length:1))||
            !Number.isFinite(p.base_cooldown)||p.base_cooldown<=0||!Number.isFinite(p.actual_cooldown)||p.actual_cooldown<=0||
            !Number.isFinite(p.attack_power)||p.attack_power<0)fail();
    }
}
