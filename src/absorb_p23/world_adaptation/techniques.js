// Original Mistglass proposals inspired by the saved distinction between
// absorption, circulation/control and staged practice. No imported canon ladder.
import {check, natural} from '../../basics.js';
export const cultivationMethods = Object.freeze({
    mist: {label:'Open-mist absorption', description:'Receive ambient mist without a deliberate circulation drill. Keeps the original rate and 75% purification chance.', rates:[125,125,125], odds:[7500,7500,7500], work:[2000,2000,2000]},
    breath: {label:'Threaded-breath circulation', description:'Practice circulation while in the mist, even with a full reserve. Begins slowly; practiced control increases condensate throughput. Purification remains 75%; practiced flow spends a little less on sluice work.', rates:[100,175,250], odds:[7500,7500,7500], work:[2000,1800,1600]},
    settling: {label:'Still-pool refinement', description:'Practice settling the mist, even with a full reserve. Lower throughput buys steadier purification; this does not guarantee success. Practiced control halves condensate spent clearing the sluice.', rates:[75,100,125], odds:[8500,9000,9500], work:[2000,1500,1000]},
});
export const freshCultivation = () => ({schema:1,selected:'mist',minutes:{breath:0,settling:0}});
export function validateCultivation(value) {
    if(value===undefined)return;
    check(value && value.schema===1 && Object.keys(value).filter(k=>k!=='insight').sort().join(',')==='minutes,schema,selected' && Object.hasOwn(cultivationMethods,value.selected),'Invalid cultivation technique schema/method.');
    if(value.insight!==undefined){const i=value.insight,keys=['carry','lost','minutes'];
        check(i&&Object.keys(i).filter(k=>k!=='last').sort().join(',')===keys.join(',')&&keys.every(k=>Number.isFinite(i[k])&&i[k]>=0)&&(i.last===undefined||i.last&&['excess','lost','minutes'].every(k=>Number.isFinite(i.last[k])&&i.last[k]>=0)),'Invalid cultivation insight record.');}
    check(value.minutes && Object.keys(value.minutes).sort().join(',')==='breath,settling' && Object.values(value.minutes).every(n=>natural(n)&&n<=48),'Invalid cultivation practice.');
}
export function cultivationView(value) {
    validateCultivation(value);
    const state=value||freshCultivation(),method=cultivationMethods[state.selected],minutes=state.minutes[state.selected]||0,stage=minutes>=48?2:minutes>=16?1:0;
    return {id:state.selected,label:method.label,description:method.description,minutes,stage:['Learning','Practiced','Integrated'][stage],nextAt:state.selected==='mist'||stage===2?null:stage===0?16:48,
        rate:method.rates[stage],successThreshold:method.odds[stage],workCost:method.work[stage],insight:state.insight?structuredClone(state.insight):null};
}
// Split at practice thresholds so one large advance equals many small ones.
export function advanceCultivation(value,minutes) {
    const next=structuredClone(value),id=next.selected;
    let earned=0n,left=minutes;
    while(left>0){const v=cultivationView(next),step=v.nextAt===null?left:Math.min(left,v.nextAt-v.minutes);
        earned+=BigInt(step)*BigInt(v.rate);left-=step;
        if(id!=='mist')next.minutes[id]=Math.min(48,next.minutes[id]+step);
    }
    return {next,earned:BigInt(earned)};
}

// D3 proposal (2026-10-23): Meditation insight past one sitting's cap settles into the
// selected drill's practice minutes at row.xpPerMinute (remainder carried); what cannot
// settle (open-mist method, drill already Integrated) is lost and said so.
// In: excess + carry. Out: minutes * xpPerMinute + new carry + lost. Hundredths throughout.
const hundredths=n=>Math.round(n*100)/100;
export function settleInsight(value,excess,row) {
    validateCultivation(value);
    if(!(excess>0)||!value)return {next:value,minutes:0,lost:0,carry:value?.insight?.carry??0};
    const next=structuredClone(value),id=next.selected,i=next.insight||={carry:0,lost:0,minutes:0};
    const room=id==='mist'?0:48-next.minutes[id],pool=hundredths(excess+i.carry),want=Math.floor(pool/row.xpPerMinute+1e-9),minutes=Math.min(room,want);
    const rest=hundredths(pool-minutes*row.xpPerMinute),lost=room>want?0:rest;
    if(id!=='mist')next.minutes[id]+=minutes;
    i.minutes+=minutes;i.lost=hundredths(i.lost+(room>want?0:rest));i.carry=room>want?rest:0;
    i.last={excess:hundredths(excess),minutes,lost};
    return {next,minutes,lost,carry:i.carry};
}
