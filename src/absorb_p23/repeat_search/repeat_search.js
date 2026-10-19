// Original proposal. Proto23 informed finite search/stop feedback only; no
// foreign code/assets. The host commits these plans with native resource diffs.
import {natural} from '../../basics.js';
export const REPEAT_SEARCH = Object.freeze({location:'Village',worldId:'base.frontier',minutes:5,item:'Linen cloth'});
const record = value => value && typeof value === 'object' && !Array.isArray(value);
export function normalizeRepeatSearch(raw) {
    if(raw === undefined) return {schema:1,departure:0,remaining:0,claims:0,looking:false,progress:0,lastClock:null};
    if(!record(raw) || raw.schema !== 1) throw new Error('Unsupported repeat-search save schema.');
    if(!natural(raw.departure) || ![0,1].includes(raw.remaining) || !natural(raw.claims) ||
        raw.claims + raw.remaining > raw.departure || (raw.departure === 0 && raw.remaining !== 0) ||
        typeof raw.looking !== 'boolean' || !Number.isFinite(raw.progress) || raw.progress < 0 || raw.progress >= REPEAT_SEARCH.minutes ||
        (raw.lastClock !== null && !natural(raw.lastClock)) ||
        (raw.looking && (raw.remaining !== 1 || raw.lastClock === null)) || (!raw.looking && raw.progress !== 0))
        throw new Error('Invalid repeat-search save record.');
    return {schema:1,departure:raw.departure,remaining:raw.remaining,claims:raw.claims,
        looking:raw.looking,progress:raw.progress,lastClock:raw.lastClock};
}
const plan = state => ({state,native:{money:0,items:[],skillXp:{}},messages:[]});
const here = c => c.worldId === REPEAT_SEARCH.worldId && c.location === REPEAT_SEARCH.location;
const ready = c => here(c) && c.alive === true && c.idle === true && natural(c.clock);
const empty = 'No offered linen scraps remain. Looking stops. The next supply runner departure in Village offers one fresh offcut; missed offers do not accumulate.';

// Called only in the host's real help/decline settlement, never on render,
// load, calendar catch-up or a synthesized timer. ordinal = helped + declined
// AFTER the native C2 departure; event and this receipt must commit together.
export function replenishRepeatSearch(raw,context,event) {
    const s=normalizeRepeatSearch(raw),p=plan(s);
    if(!record(event) || event.kind !== 'village-runner-departed' || !natural(event.ordinal) || event.ordinal === 0 || !natural(event.clock))
        throw new Error('Invalid runner departure event.');
    if(!here(context) || context.alive !== true || context.clock !== event.clock ||
        (s.lastClock !== null && event.clock < s.lastClock) || event.ordinal <= s.departure) return p;
    s.departure=event.ordinal;s.remaining=1;s.looking=false;s.progress=0;s.lastClock=event.clock;
    p.messages.push('The departing supply runner offers one clean linen offcut by the Village well. Search for five idle played minutes to collect it. Unclaimed scraps do not stack.');
    return p;
}
export function repeatSearchAction(raw,c) {
    const s=normalizeRepeatSearch(raw),p=plan(s);
    if(!ready(c)) return {...p,ok:false,messages:['Finish your current action in Village first.']};
    if(s.lastClock !== null && c.clock < s.lastClock) return {...p,ok:false,messages:['The played clock has not reached this offer yet.']};
    if(!s.remaining) return {...p,ok:false,messages:[empty]};
    s.looking=!s.looking;s.progress=0;s.lastClock=c.clock;
    p.messages.push(s.looking?'Looking for the offered offcut: five idle played minutes. Stop or leave at any time.':'You stop looking for the offered offcut.');
    return {...p,ok:true};
}
export function advanceRepeatSearch(raw,c) {
    const s=normalizeRepeatSearch(raw),p=plan(s);
    if(!natural(c.clock)) return p;
    if(!ready(c)) {
        s.looking=false;s.progress=0;
        if(s.lastClock === null || c.clock>s.lastClock)s.lastClock=c.clock;
        return p;
    }
    if(s.lastClock !== null && c.clock <= s.lastClock) return p;
    const delta=s.lastClock === null?0:c.clock-s.lastClock;s.lastClock=c.clock;
    if(!s.looking) return p;
    s.progress+=delta;
    if(s.progress >= REPEAT_SEARCH.minutes) {
        s.remaining=0;s.looking=false;s.progress=0;s.claims++;
        p.native.items.push({item_id:REPEAT_SEARCH.item,count:1});
        p.messages.push(`You collect one offered linen offcut. ${empty}`);
    }
    return p;
}
export function repeatSearchView(raw,c) {
    const s=normalizeRepeatSearch(raw);
    return {visible:here(c),title:'Runner offcuts',summary:s.remaining?
        'One offered linen offcut remains. Five idle played minutes to collect it.':empty,
        rows:[{id:'runner_offcut',label:s.looking?`Stop looking (${s.progress}/5 minutes)`:'Look for offered offcut',
            disabled:!ready(c)||!s.remaining||(s.lastClock !== null && c.clock<s.lastClock)}]};
}
