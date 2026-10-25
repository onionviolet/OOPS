// Explicit Mistglass absence contract. Time is banked, then spent through the
// existing joined clock. No second simulation, resource award or save writer.
import {check,natural} from '../../basics.js';
export const AWAY_CAP=120,AWAY_MS_PER_MINUTE=1000;
export function validateAway(a){
 if(a===undefined)return;
 check(a&&Object.keys(a).sort().join(',')==='armed,bank,clock,last,lastSeen,remainder,schema'&&a.schema===1&&typeof a.armed==='boolean'&&['bank','clock','lastSeen','remainder'].every(k=>natural(a[k]))&&a.bank<=AWAY_CAP&&a.remainder<AWAY_MS_PER_MINUTE,'Invalid cultivation absence ledger.');
 if(a.last)check(['kind','minutes','dropped','condensate'].every(k=>Object.hasOwn(a.last,k))&&['arm','bank','spend','stop'].includes(a.last.kind)&&['minutes','dropped'].every(k=>natural(a.last[k]))&&Number.isSafeInteger(a.last.condensate),'Invalid cultivation return recap.');
}
export function armAway(previous,clock,now){
 validateAway(previous);check(natural(clock)&&natural(now),'Invalid cultivation departure.');
 const a={schema:1,armed:true,bank:previous?.bank??0,clock,lastSeen:now,remainder:previous?.remainder??0,last:{kind:'arm',minutes:0,dropped:0,condensate:0}};validateAway(a);return a;
}
export function bankAway(previous,clock,now){
 validateAway(previous);check(previous?.armed,'Choose the absence practice policy before leaving.');check(natural(clock)&&clock>=previous.clock&&natural(now)&&now>=previous.lastSeen,'The played or wall clock moved backwards.');
 const elapsed=BigInt(now-previous.lastSeen)+BigInt(previous.remainder),wallMinutes=Number(elapsed/BigInt(AWAY_MS_PER_MINUTE)),online=clock-previous.clock,available=Math.max(0,wallMinutes-online),credited=Math.min(AWAY_CAP-previous.bank,available);
 const a={...previous,bank:previous.bank+credited,clock,lastSeen:now,remainder:Number(elapsed%BigInt(AWAY_MS_PER_MINUTE)),last:{kind:'bank',minutes:credited,dropped:available-credited,condensate:0}};validateAway(a);return a;
}
