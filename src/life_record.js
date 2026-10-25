import {validateMemoryMessage,renderMemory} from './memory_messages.js';
export {reflectionMessage} from './memory_messages.js';
// A lossy biography, never an authority for rewards, relationships or quests.
import {natural as safe} from './basics.js';
export const LIFE_RECORD_SCHEMA = 1;
export const LIFE_YEAR_MINUTES = 360 * 24 * 60;
export const LIFE_KINDS = ['beginning', 'journey', 'memory', 'birthday', 'career', 'loss', 'family', 'rumor', 'legacy'];
const object = v => v && typeof v === 'object' && !Array.isArray(v);
const world = s => typeof s === 'string' && s.length <= 96 && /^[a-zA-Z0-9_.:-]+$/.test(s);
const prose = s => typeof s === 'string' && s.length > 0 && s.length <= 240;
const check = (v, m) => {if(!v) throw new Error(`Invalid life record: ${m}.`);};
export function createLifeRecord() {
    return {schema:1,nextId:1,recent:[],years:[],earlier:{throughYear:null,count:0},observed:{worldId:null}};
}
export function validateLifeRecord(r) {
    check(object(r) && r.schema === 1 && safe(r.nextId) && r.nextId > 0,'schema');
    check(Array.isArray(r.recent) && r.recent.length <= 64 && Array.isArray(r.years) && r.years.length <= 200,'bounds');
    check(object(r.earlier) && safe(r.earlier.count) && (r.earlier.throughYear === null || safe(r.earlier.throughYear)), 'earlier years');
    check(object(r.observed) && (r.observed.worldId === null || world(r.observed.worldId)),'observations');
    if(r.observed.crossings!==undefined)check(object(r.observed.crossings)&&Object.entries(r.observed.crossings).every(([id,count])=>world(id)&&safe(count)),'observed crossings');
    let id = 0;
    for(const e of r.recent) {
        check(object(e) && safe(e.id) && e.id > id && e.id < r.nextId && safe(e.year) && safe(e.at) && Math.floor(e.at/LIFE_YEAR_MINUTES) === e.year && world(e.worldId) && LIFE_KINDS.includes(e.kind) && prose(e.text),'milestone');validateMemoryMessage(e); id = e.id;
    }
    let year = -1;
    for(const y of r.years) {
        check(object(y) && safe(y.year) && y.year > year && safe(y.count) && y.count > 0 && safe(y.first) && safe(y.last) && y.first <= y.last && Math.floor(y.first/LIFE_YEAR_MINUTES) === y.year && Math.floor(y.last/LIFE_YEAR_MINUTES) === y.year,'year'); year = y.year;
        check(Array.isArray(y.worlds) && y.worlds.length <= 8 && y.worlds.every(world) && new Set(y.worlds).size === y.worlds.length,'worlds');
        check(object(y.kinds) && Object.entries(y.kinds).every(([k,n])=>LIFE_KINDS.includes(k) && safe(n) && n>0) && Object.values(y.kinds).reduce((a,b)=>a+b,0)===y.count,'counts');
        if(y.messages!==undefined){check(Array.isArray(y.messages)&&y.messages.length===y.highlights.length,'keyed highlights');for(const m of y.messages){check(prose(m.text),'highlight fallback');validateMemoryMessage(m);}}
        check(Array.isArray(y.highlights) && y.highlights.length <= 4 && y.highlights.every(prose),'highlights');
    }
    check(r.earlier.throughYear === null ? r.earlier.count === 0 : r.earlier.count > 0 && r.years.every(y=>y.year>r.earlier.throughYear) && r.recent.every(e=>e.year>r.earlier.throughYear),'retired years');
    return r;
}
function fold(r,e) {
    if(r.earlier.throughYear !== null && e.year <= r.earlier.throughYear) {r.earlier.count++; return;}
    let y=r.years.find(y=>y.year===e.year);
    if(!y) {y={year:e.year,count:0,worlds:[],kinds:{},first:e.at,last:e.at,highlights:[]};r.years.push(y);}
    y.count++; y.first=Math.min(y.first,e.at); y.last=Math.max(y.last,e.at);
    y.kinds[e.kind]=(y.kinds[e.kind] || 0)+1;
    if(!y.worlds.includes(e.worldId) && y.worlds.length<8)y.worlds.push(e.worldId);
    if(y.highlights.length<4 && !y.highlights.includes(e.text)){if(e.key&&!y.messages)y.messages=y.highlights.map(text=>({text}));y.highlights.push(e.text);if(y.messages)y.messages.push({text:e.text,...(e.key?{key:e.key,payload:structuredClone(e.payload)}:{})});}
}
function compact(r,year) {
    const keep=[];
    for(const e of r.recent) {if(e.year < year-1) fold(r,e); else keep.push(e);}
    while(keep.length>64)fold(r,keep.shift());
    r.recent=keep;r.years.sort((a,b)=>a.year-b.year);
    while(r.years.length>200) {const old=r.years.shift();r.earlier.count+=old.count;r.earlier.throughYear=old.year;}
    return r;
}
export function compactLifeRecord(record,year) {
    validateLifeRecord(record); check(safe(year),'current year');return validateLifeRecord(compact(structuredClone(record),year));
}
export function appendLifeMilestone(record,event) {
    validateLifeRecord(record); const r=structuredClone(record);
    const e={...event,id:r.nextId++};
    check(safe(e.year) && safe(e.at) && Math.floor(e.at/LIFE_YEAR_MINUTES)===e.year && world(e.worldId) && LIFE_KINDS.includes(e.kind) && prose(e.text),'new milestone');
    check(!r.recent.length || e.at >= r.recent.at(-1).at,'backdated milestone');
    if(r.earlier.throughYear !== null && e.year <= r.earlier.throughYear)fold(r,e);else r.recent.push(e);
    return validateLifeRecord(compact(r,e.year));
}
export function lifeCalendarMinute(t) {
    const {year,month,day,hour,minute}=t;
    check(safe(year) && Number.isInteger(month) && month>=1 && month<=12 && Number.isInteger(day) && day>=1 && day<=30 && Number.isInteger(hour) && hour>=0 && hour<24 && Number.isInteger(minute) && minute>=0 && minute<60,'calendar');
    const at=year*LIFE_YEAR_MINUTES+((month-1)*30+day-1)*1440+hour*60+minute;check(safe(at),'calendar range');return at;
}
export function observeLifeSave(record,save) {
    let r=record ?? createLifeRecord();validateLifeRecord(r);
    const year=save['current time'].year,at=lifeCalendarMinute(save['current time']);
    const worldId=save.expansion?.actors?.player?.worldId || 'base.frontier';
    // A legacy record starts counting now, without reconstructing an unknown past.
    const crossings={...(r.observed.crossings||{})};crossings[worldId]??=0;
    if(r.observed.worldId!==null&&r.observed.worldId!==worldId){crossings[worldId]++;check(safe(crossings[worldId]),'crossing count overflow');}
    r={...r,observed:{...r.observed,crossings}};
    if(r.observed.worldId !== worldId) {
        r=appendLifeMilestone(r,{year,at,worldId,kind:r.observed.worldId ? 'journey':'beginning',key:r.observed.worldId?'life.journey':'life.beginning',payload:r.observed.worldId?{world:worldId}:{},text:r.observed.worldId ? `You made a new home beneath the skies of ${worldId}.` : 'Your remembered life begins here.'});
        r.observed.worldId=worldId;
    }
    return compactLifeRecord(r,year);
}
export function migrateLifeRecord(save) {
    // Old schema-11 saves gain a record at their loaded date, never a fabricated past.
    return observeLifeSave(save.life_record ?? createLifeRecord(),save);
}
export function lifeRecordView(record,locale='english') {
    validateLifeRecord(record);
    return {crossings:{...(record.observed.crossings||{})},recent:structuredClone(record.recent).reverse().map(e=>({...e,text:renderMemory(e,locale)})),years:structuredClone(record.years).reverse().map(y=>({...y,highlights:y.messages?y.messages.map(m=>renderMemory(m,locale)):y.highlights})),earlier:{...record.earlier},count:record.recent.length+record.years.reduce((n,y)=>n+y.count,0)+record.earlier.count};
}
