import {registerDomain} from './domain_registry.js';
import {computeAway} from './away_ledger.js';
// OD4/TBANK/AD18 time bank. Real time between the last save and this load is banked as game
// minutes at the native awake cadence (one per tick, like the Patient Furnace). Nothing is applied
// on return: the player spends the bank through the native clock, so every cost, body need and
// choice stop applies and no time-free reward is granted (AD16, AD38).
// Dials (proposals, not accepted numbers): capacity 7 days, drop beyond it, 60 minutes per spend.
// Capacity is the AD18 improvement hook: ports.capacity() may return a larger value.
// Compatibility: a save without the slice starts at an empty bank with lastSeen = now, so old
// saves never receive a retroactive bank. Every save rewrites lastSeen, so played time never banks.
// Patient Furnace rule: while its routine is assigned it accrues the same wall time itself, so
// this ledger only rebases and does not also credit it.
export const AWAY_BANK_DEFAULTS=Object.freeze({capacity:7*24*60,spendMinutes:60,minReport:1});
const natural=n=>Number.isSafeInteger(n)&&n>=0;
let ports=null,state=null,pending=null,busy=false,lastSpend='';
export function configureAwayBank(operations){ports=operations;}
const now=()=>ports?.now?.()??Date.now();
const capacity=()=>Math.max(AWAY_BANK_DEFAULTS.capacity,ports?.capacity?.()??0);
export function validateAwayBank(slice){
    if(slice==null)return slice;
    if(typeof slice!=='object'||Array.isArray(slice)||Object.keys(slice).sort().join(',')!=='bankedMinutes,lastSeen,remainderMs,schema'||slice.schema!==1||
        !Number.isFinite(slice.lastSeen)||slice.lastSeen<0||!natural(slice.bankedMinutes)||!natural(slice.remainderMs)||slice.remainderMs>=60000)throw new Error('Invalid away bank.');
    return slice;
}
// Credits the wall time since the load once the other domains (cheats) exist. Idempotent.
function settle(){
    if(!pending||!state)return;
    const {lastSeen,at}=pending;pending=null;
    if(ports?.furnaceAssigned?.()){state.lastSeen=at;state.remainderMs=0;return;}
    const r=computeAway({lastSeen,now:at,capMinutes:0,overflow:'bank',bankedMinutes:state.bankedMinutes,remainderMs:state.remainderMs});
    const banked=Math.min(capacity(),r.bankedMinutes),gained=Math.max(0,banked-state.bankedMinutes);
    state.bankedMinutes=banked;state.remainderMs=r.stoppedBy==='clock-back'?0:r.remainderMs;state.lastSeen=at;
    if(r.overflowMinutes>=AWAY_BANK_DEFAULTS.minReport)state.lastReturn={minutes:r.overflowMinutes,banked:gained,dropped:r.overflowMinutes-gained};
}
export async function spendAwayBank(minutes=AWAY_BANK_DEFAULTS.spendMinutes){
    settle();
    if(!ports||!state)throw new Error('The game is still loading.');
    if(busy)throw new Error('Banked time is already being spent.');
    if(ports.writable?.()===false)throw new Error('Saving is unavailable, so banked time cannot be spent.');
    const n=Math.min(Math.floor(minutes),state.bankedMinutes);
    if(!(n>=1))throw new Error('No time is banked.');
    const root=ports.root(),before=root.clock;
    busy=true;
    try{await ports.fastForward(n);}finally{busy=false;}
    const consumed=Math.max(0,ports.root().clock-before);
    state.bankedMinutes=Math.max(0,state.bankedMinutes-consumed);
    lastSpend=consumed<n?`Stopped after ${consumed} of ${n} minutes at a waiting choice or boundary; the rest stays banked.`:`Spent ${consumed} banked minutes.`;
    ports.persist(()=>{});
    return {requested:n,consumed};
}
export const awayBankDomain=registerDomain({id:'awayBank',initialState:()=>null,
    save:()=>{if(!state)return undefined;settle();return {schema:1,lastSeen:now(),bankedMinutes:state.bankedMinutes,remainderMs:state.remainderMs};},
    validate:slice=>{validateAwayBank(slice);},
    load:slice=>{
        validateAwayBank(slice);const at=now();
        state={lastSeen:slice?.lastSeen??at,bankedMinutes:slice?.bankedMinutes??0,remainderMs:slice?.remainderMs??0,lastReturn:null};
        pending=slice?{lastSeen:slice.lastSeen,at}:null;lastSpend='';
    },
    projection:()=>{
        if(!state)return null;settle();
        return {bankedMinutes:state.bankedMinutes,capacity:capacity(),lastReturn:state.lastReturn,lastSpend,spendMinutes:Math.min(AWAY_BANK_DEFAULTS.spendMinutes,state.bankedMinutes),
            busy,writable:ports?.writable?.()!==false};
    },
    commands:{spend:spendAwayBank}});
