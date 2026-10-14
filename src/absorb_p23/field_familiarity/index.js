import {Game_Time} from '../../game_time.js';
import {calendarMinutes} from '../../world_rhythm.js';

// Original proposal inspired by Proto23 R04/R37/R59; no foreign code/assets.
// Pure plans only. P00 commits state and native inventory together.
export const FIELD_SITE = Object.freeze({id:'frontier.village-moon-bed', location:'Village',
    name:'Village moonlit herb bed', item:'Golmoon leaf', count:1,
    scoutLocation:'Village', combatLocation:'Infested field', familiarMinutes:30,
    searchMinutes:6, familiarSearchMinutes:3, closes:240});
const natural = n => Number.isSafeInteger(n) && n>=0;
const object = o => o && typeof o==='object' && !Array.isArray(o);
const keys = (o, allowed) => Object.keys(o).every(k=>allowed.includes(k));
const invalid = () => {throw new Error('Invalid field familiarity state.');};

export function validateFieldFamiliarity(raw) {
    if(raw===undefined) return true;
    if(!object(raw) || raw.schema!==1) throw new Error('Unsupported field familiarity schema or container.');
    if(!keys(raw,['schema','minutes','lastClock','lastHarvestOccurrence','pending']) ||
        !natural(raw.minutes) || !(raw.lastClock===null || natural(raw.lastClock)) ||
        !(raw.lastHarvestOccurrence===null || natural(raw.lastHarvestOccurrence))) invalid();
    if(raw.pending!==null) {
        const p=raw.pending;
        if(!object(p) || !keys(p,['occurrence','startedClock','progress','requiredMinutes']) ||
            !natural(p.occurrence) || !natural(p.startedClock) || !natural(p.progress) ||
            ![FIELD_SITE.searchMinutes,FIELD_SITE.familiarSearchMinutes].includes(p.requiredMinutes) ||
            p.progress>=p.requiredMinutes || raw.lastClock===null || p.startedClock>raw.lastClock ||
            p.progress>raw.lastClock-p.startedClock ||
            (raw.lastHarvestOccurrence!==null && p.occurrence<=raw.lastHarvestOccurrence)) invalid();
    }
    return true;
}
export function normalizeFieldFamiliarity(raw) {
    validateFieldFamiliarity(raw);
    return raw===undefined ? {schema:1,minutes:0,lastClock:null,lastHarvestOccurrence:null,pending:null}
        : {...raw,pending:raw.pending?{...raw.pending}:null};
}
function nativeCalendar(raw) {
    calendarMinutes(raw); // native date validation, not a second date system
    if(!natural(raw.day_count) || raw.day_count>Number.MAX_SAFE_INTEGER-100) throw new Error('Invalid lunar day count.');
    return new Game_Time(raw);
}
const newMoon = t => t.getMoonPhaseName(t.getMoonPhase())==='New';
const dateFields = t => Object.fromEntries(['year','month','day','hour','minute','day_count'].map(k=>[k,t[k]]));
function occurrence(t) {
    if(!newMoon(t)) return null;
    let day=t.day_count;
    while(day>0 && newMoon(new Game_Time({...t,day_count:day-1}))) day--;
    return day;
}

// P00 calls this with the incoming save's clocks during whole-envelope
// preflight, before changing any native owner or inventory.
export function validateFieldSnapshot(raw,{clock,calendar}) {
    validateFieldFamiliarity(raw);
    if(raw===undefined) return true;
    const t=nativeCalendar(calendar);
    if(!natural(clock) || (raw.lastClock!==null && raw.lastClock>clock)) invalid();
    if(raw.lastHarvestOccurrence!==null) {
        const day=raw.lastHarvestOccurrence;
        if(day>t.day_count || occurrence(new Game_Time({...calendar,day_count:day}))!==day) invalid();
    }
    if(raw.pending) {
        const w=lunarWindow(calendar,raw.lastHarvestOccurrence);
        if(!w.open || w.occurrence!==raw.pending.occurrence || raw.lastClock!==clock) invalid();
    }
    return true;
}

// A physical bed has one harvest per native New phase. Daily 00:00–04:00
// appointments within that phase remain available until picked; next phase
// replenishes it. Looking, reload and missing a window create no claims.
export function lunarWindow(calendar,lastHarvestOccurrence=null) {
    if(lastHarvestOccurrence!==null && !natural(lastHarvestOccurrence)) invalid();
    const now=nativeCalendar(calendar), current=occurrence(now);
    const claimed=current!==null && lastHarvestOccurrence!==null && current<=lastHarvestOccurrence;
    const phaseMinute=now.hour*60+now.minute;
    const open=current!==null && !claimed && phaseMinute<FIELD_SITE.closes;
    if(open) return {open:true,claimed:false,occurrence:current,remaining:FIELD_SITE.closes-phaseMinute,
        nextIn:0,next: {...dateFields(calendar),hour:0,minute:0}};
    for(let days=0;days<=60;days++) {
        const candidate=new Game_Time({...calendar,hour:0,minute:0});candidate.goUp(days*1440);
        const id=occurrence(candidate);
        if(id!==null && (lastHarvestOccurrence===null || id>lastHarvestOccurrence) &&
            (days>0 || phaseMinute===0)) {
            return {open:false,claimed,occurrence:current,remaining:0,
                nextIn:days*1440-phaseMinute,next:{year:candidate.year,month:candidate.month,day:candidate.day,
                    hour:0,minute:0,day_count:candidate.day_count}};
        }
    }
    // A future imported claim must never quietly manufacture a new occurrence.
    return {open:false,claimed,occurrence:current,remaining:0,nextIn:null,next:null};
}
const applicable = c => c.worldId==='base.frontier' && c.alive===true;
const ready = c => applicable(c) && c.location===FIELD_SITE.location && c.idle===true && c.knownSite===true;
const plan = state => ({state,native:{items:[],skillXp:{},money:0},messages:[]});

export function fieldAction(raw,c,id) {
    const s=normalizeFieldFamiliarity(raw),p=plan(s);
    const fail=message=>({...p,ok:false,messages:[message]});
    if(!natural(c.clock)) throw new Error('Invalid played clock.');
    if(id==='stop') {s.pending=null;return {...p,ok:true};}
    if(id!=='gather' && id!=='familiar-search') return fail('Unknown field action.');
    if(!ready(c)) return fail('Visit the known herb bed while free to gather.');
    if(s.pending) return fail('A field search is already in progress.');
    if(s.lastClock!==null && c.clock<s.lastClock) return fail('The played clock is behind the saved field record.');
    if(id==='familiar-search' && s.minutes<FIELD_SITE.familiarMinutes) return fail('Learn the area through scouting or combat first.');
    const window=lunarWindow(c.calendar,s.lastHarvestOccurrence);
    if(!window.open) return fail(window.claimed?'This bed is picked. It replenishes at the next New phase.':'The bed opens during New phase, 00:00–04:00.');
    const duration=id==='familiar-search'?FIELD_SITE.familiarSearchMinutes:FIELD_SITE.searchMinutes;
    if(window.remaining<=duration) return fail('There is not enough time to finish before 04:00.');
    s.lastClock=c.clock;s.pending={occurrence:window.occurrence,startedClock:c.clock,progress:0,requiredMinutes:duration};
    p.messages.push(`Search the known bed for ${duration} played minutes.`);
    return {...p,ok:true};
}

// c describes the START of one legitimate native played interval; calendar is
// its END. Never call this from load/render/offline reconciliation. fromClock
// must join the saved cursor exactly; gaps rebase without awarding missed work.
export function advanceFieldFamiliarity(raw,c) {
    const s=normalizeFieldFamiliarity(raw),p=plan(s);
    if(!natural(c.clock) || !natural(c.fromClock) || c.fromClock>c.clock) throw new Error('Invalid played interval.');
    nativeCalendar(c.calendar);
    if(s.lastClock!==null && c.clock<=s.lastClock) return p;
    const joined=s.lastClock!==null && c.fromClock===s.lastClock;
    const delta=joined?c.clock-c.fromClock:0;
    s.lastClock=c.clock;
    const learns=applicable(c) && ((c.activity==='scouting' && c.location===FIELD_SITE.scoutLocation) ||
        (c.activity==='combat' && c.location===FIELD_SITE.combatLocation));
    if(learns && delta>0) {
        const minutes=s.minutes+delta;
        if(!natural(minutes)) throw new Error('Field familiarity numeric range exceeded.');
        s.minutes=minutes; // continues learning after the first useful threshold
    }
    if(s.pending) {
        const window=lunarWindow(c.calendar,s.lastHarvestOccurrence);
        if(!joined || !applicable(c) || c.knownSite!==true || c.location!==FIELD_SITE.location ||
            c.activity!=='lunar_gathering' || !window.open || window.occurrence!==s.pending.occurrence) {
            s.pending=null;p.messages.push('The search stops; the unpicked bed remains reachable in a future window.');
        } else {
            s.pending.progress+=delta;
            if(s.pending.progress>=s.pending.requiredMinutes) {
                s.lastHarvestOccurrence=s.pending.occurrence;s.pending=null;
                p.native.items.push({item_id:FIELD_SITE.item,count:FIELD_SITE.count});
                p.messages.push('You gather one Golmoon leaf. The bed replenishes at the next New phase.');
            }
        }
    }
    return p;
}

export function fieldView(raw,c) {
    const s=normalizeFieldFamiliarity(raw);
    if(c.worldId!=='base.frontier' || c.knownSite!==true || c.location!==FIELD_SITE.location) return {visible:false};
    const window=lunarWindow(c.calendar,s.lastHarvestOccurrence),familiar=s.minutes>=FIELD_SITE.familiarMinutes;
    const disabled=!ready(c) || !window.open || !!s.pending;
    return {visible:true,title:FIELD_SITE.name,minutes:s.minutes,familiar,window,
        summary:window.open?'New phase: open until 04:00.':window.next?
            `Next window: ${new Game_Time(window.next).toString()} (in ${window.nextIn} minutes).`:'No reachable window on this calendar record.',
        stock:window.claimed?0:1,pending:s.pending?{...s.pending}:null,
        rows:[{id:'gather',label:'Search herb bed (6 minutes)',disabled:disabled||window.remaining<=6},
            ...(familiar?[{id:'familiar-search',label:'Search familiar growth (3 minutes)',disabled:disabled||window.remaining<=3}]:[]),
            ...(s.pending?[{id:'stop',label:'Stop searching',disabled:false}]:[])]};
}
