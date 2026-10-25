// G27 (leftover itch.io wave, 2026-10-23): skill floor, near-miss and paths-not-taken records. Pure rules, no DOM and no hero.
// Native skill XP stays the only source of a level; rust is a derived, reversible penalty on top of it (SLR10: rust is a per-world
// dial, off by default, and hits fluency, not understanding, with a stated reason). Nothing here lowers total_xp.
import {natural as nat} from './basics.js';
export const NEAR_MISS_LIMIT=24;
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const ref=v=>typeof v==='string'&&v.length>0&&v.length<=240;
const check=ok=>{if(!ok)throw Error('Invalid skill records.');};
// Default, dial, reason. A world without a row has no rust control at all. `floor` is the share of the peak level a rusty skill
// never drops below; `grace` and `step` are idle game minutes before the first loss and between further losses; `regain` is levels
// won back per practice tick (relearning beats first learning, SLR11). Row values are proposals pending Weibao's play.
export const SKILL_DIALS=Object.freeze({
    'base.frontier':Object.freeze({grace:20160,step:10080,floor:0.6,regain:2,minPeak:5,
        reason:'Hands that stop doing a task lose their edge, but the knowing stays, so a skill never falls below three fifths of its best.'}),
});
export const dialFor=worldId=>SKILL_DIALS[worldId]??null;
// A skill that stalls this close to its next level for a day is recorded as a near miss.
export const NEAR_MISS_SHARE=0.85,NEAR_MISS_IDLE=1440;
export const freshSkillRecords=()=>({schema:1,tracked:{},rustOn:{},nearMisses:[]});
export function validateSkillRecords(r) {
    check(object(r)&&r.schema===1&&object(r.tracked)&&object(r.rustOn)&&Array.isArray(r.nearMisses)&&r.nearMisses.length<=NEAR_MISS_LIMIT&&Object.keys(r.tracked).length<=512);
    for(const [id,e] of Object.entries(r.tracked))check(ref(id)&&object(e)&&nat(e.peak)&&nat(e.level)&&e.level<=e.peak&&Number.isFinite(e.seen)&&e.seen>=0&&nat(e.idle)&&nat(e.rust)&&(e.nm==null||nat(e.nm)));
    for(const [w,on] of Object.entries(r.rustOn))check(ref(w)&&typeof on==='boolean');
    for(const n of r.nearMisses)check(object(n)&&ref(n.skill)&&nat(n.level)&&nat(n.short)&&nat(n.at)&&ref(n.cause));
    return r;
}
export const migrateSkillRecords=slice=>slice==null?freshSkillRecords():structuredClone(validateSkillRecords(slice));
export const rustCeiling=(peak,dial)=>Math.max(0,peak-Math.ceil(peak*dial.floor));
export const rustActive=(rec,worldId)=>!!dialFor(worldId)&&rec.rustOn[worldId]===true;
// rows: [{id, level, totalXp, xp, toNext}] for skills the hero has any XP in. Returns a new record (the input is not mutated).
export function observeSkills(rec,rows,minutes,{worldId,clock=0}) {
    const next=structuredClone(rec),dial=dialFor(worldId),on=rustActive(rec,worldId);
    for(const row of rows) {
        if(!(row.totalXp>0))continue;
        const e=next.tracked[row.id] ||= {peak:row.level,level:row.level,seen:row.totalXp,idle:0,rust:0,nm:null};
        const gained=row.totalXp>e.seen+1e-9;
        e.level=row.level;e.peak=Math.max(e.peak,row.level);e.seen=row.totalXp;
        if(e.nm!=null&&row.level>e.nm)e.nm=null;
        if(gained){e.idle=0;if(e.rust>0)e.rust=Math.max(0,e.rust-(dial?.regain??1));continue;}
        e.idle=Math.min(e.idle+Math.max(0,Math.round(minutes)),10**9);
        if(on&&e.peak>=dial.minPeak&&e.idle>dial.grace)e.rust=Math.max(e.rust,Math.min(rustCeiling(e.peak,dial),Math.floor((e.idle-dial.grace)/dial.step)+1));
        if(e.rust>rustCeiling(e.peak,dial??{floor:1}))e.rust=rustCeiling(e.peak,dial??{floor:1});
        if(e.nm==null&&e.idle>=NEAR_MISS_IDLE&&row.toNext>0&&row.xp/row.toNext>=NEAR_MISS_SHARE&&row.xp<row.toNext) {
            e.nm=row.level;
            next.nearMisses.push({skill:row.id,level:row.level,short:Math.max(1,Math.ceil(row.toNext-row.xp)),at:clock,cause:'stalled'});
            if(next.nearMisses.length>NEAR_MISS_LIMIT)next.nearMisses.shift();
        }
    }
    // Rust never outlives its dial: with rust off (or the world without a row), every penalty is lifted.
    if(!on)for(const e of Object.values(next.tracked))e.rust=0;
    return validateSkillRecords(next);
}
// {skillId: -levels} for the hero's bonus bucket. Only skills that are currently rusty appear.
export const rustBonuses=rec=>Object.fromEntries(Object.entries(rec.tracked).filter(([,e])=>e.rust>0).map(([id,e])=>[id,-e.rust]));
// Life summary lines. `discovered`: [{id,label,category,totalXp}] for skills the hero can see. `declined`: names of requests refused.
// Paths not taken are derived from saved facts and never stored twice.
export function lifeSummary(rec,{discovered=[],declined=[],worldId}) {
    const rusty=Object.entries(rec.tracked).filter(([,e])=>e.rust>0).map(([id,e])=>({id,from:e.peak,to:e.peak-e.rust,idle:e.idle}));
    const byCategory=new Map();
    for(const d of discovered){const row=byCategory.get(d.category)||{trained:0,idle:[]};if(d.totalXp>0)row.trained++;else row.idle.push(d.label);byCategory.set(d.category,row);}
    const untaken=[...byCategory.entries()].filter(([,r])=>r.trained===0&&r.idle.length).map(([category,r])=>({category,skills:r.idle.slice(0,4)})).sort((a,b)=>a.category<b.category?-1:1).slice(0,5);
    return {rusty,nearMisses:[...rec.nearMisses].reverse(),untaken,declined:[...new Set(declined)].slice(0,5),peaks:Object.values(rec.tracked).filter(e=>e.peak>0).length,rustAvailable:!!dialFor(worldId),rustOn:rustActive(rec,worldId),dial:dialFor(worldId)};
}
