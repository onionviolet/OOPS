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
    check(value && value.schema===1 && Object.keys(value).sort().join(',')==='minutes,schema,selected' && Object.hasOwn(cultivationMethods,value.selected),'Invalid cultivation technique schema/method.');
    check(value.minutes && Object.keys(value.minutes).sort().join(',')==='breath,settling' && Object.values(value.minutes).every(n=>natural(n)&&n<=48),'Invalid cultivation practice.');
}
export function cultivationView(value) {
    validateCultivation(value);
    const state=value||freshCultivation(),method=cultivationMethods[state.selected],minutes=state.minutes[state.selected]||0,stage=minutes>=48?2:minutes>=16?1:0;
    return {id:state.selected,label:method.label,description:method.description,minutes,stage:['Learning','Practiced','Integrated'][stage],nextAt:state.selected==='mist'||stage===2?null:stage===0?16:48,
        rate:method.rates[stage],successThreshold:method.odds[stage],workCost:method.work[stage]};
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
