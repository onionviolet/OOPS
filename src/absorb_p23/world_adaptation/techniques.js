import {forkWeights,forkAllocation} from '../../vessel_forks.js';
import {rootRateBonus} from '../../cultivation_root.js';
import {validateAway} from './away.js';
// Original Mistglass proposals inspired by the saved distinction between
// absorption, circulation/control and staged practice. No imported canon ladder.
import {validateDiscipline,disciplineView,advanceDiscipline} from './discipline.js';
import {check, natural} from '../../basics.js';
export const cultivationMethods = Object.freeze({
    mist: {label:'Open-mist absorption', description:'Receive ambient mist without a deliberate circulation drill. Keeps the original rate and 75% purification chance.', rates:[125,125,125], odds:[7500,7500,7500], work:[2000,2000,2000]},
    breath: {label:'Threaded-breath circulation', description:'Practice circulation while in the mist, even with a full reserve. Begins slowly; practiced control increases condensate throughput. Purification remains 75%; practiced flow spends a little less on sluice work.', rates:[100,175,250], odds:[7500,7500,7500], work:[2000,1800,1600]},
    settling: {label:'Still-pool refinement', description:'Practice settling the mist, even with a full reserve. Lower throughput buys steadier purification; this does not guarantee success. Practiced control halves condensate spent clearing the sluice.', rates:[75,100,125], odds:[8500,9000,9500], work:[2000,1500,1000]},
});
export const freshCultivation = () => ({schema:1,selected:'mist',minutes:{breath:0,settling:0}});
export function validateCultivation(value) {
    if(value===undefined)return;
    check(value && value.schema===1 && Object.keys(value).filter(k=>k!=='insight'&&k!=='discipline'&&k!=='away').sort().join(',')==='minutes,schema,selected' && Object.hasOwn(cultivationMethods,value.selected),'Invalid cultivation technique schema/method.');
    validateAway(value.away);
    validateDiscipline(value.discipline);
    if(value.insight!==undefined){const i=value.insight,keys=['carry','lost','minutes'];
        check(i&&Object.keys(i).filter(k=>k!=='last').sort().join(',')===keys.join(',')&&keys.every(k=>Number.isFinite(i[k])&&i[k]>=0)&&(i.last===undefined||i.last&&['excess','lost','minutes'].every(k=>Number.isFinite(i.last[k])&&i.last[k]>=0)),'Invalid cultivation insight record.');}
    check(value.minutes && Object.keys(value.minutes).sort().join(',')==='breath,settling' && Object.values(value.minutes).every(n=>natural(n)&&n<=48),'Invalid cultivation practice.');
}
export function cultivationView(value,stream=false,root=null) {
    validateCultivation(value);
    const state=value||freshCultivation(),v=disciplineView(state.discipline),method=cultivationMethods[state.selected],minutes=state.minutes[state.selected]||0,stage=minutes>=48?2:minutes>=16?1:0;
    const rootRate=(id,stage)=>Math.floor(Math.floor(cultivationMethods[id].rates[stage]*v.ratePermille/1000)*(1000+rootRateBonus(root,id))/1000);
    const forks=state.discipline?.forks,weights=forks?forkWeights(forks):null;
    const forkRate=forks&&!stream&&weights.slice(1).some(w=>w>0)?Math.floor((weights[0]*rootRate(state.selected,stage)+forks.slots.reduce((n,s,i)=>n+weights[i+1]*rootRate(s.task,s.minutes[s.task]>=48?2:s.minutes[s.task]>=16?1:0),0))/100):null;
    return {id:state.selected,label:method.label,description:method.description,minutes,stage:['Learning','Practiced','Integrated'][stage],nextAt:state.selected==='mist'||stage===2?null:stage===0?16:48,
        drills:{...state.minutes},rate:forkRate!==null?forkRate:state.discipline?.paired&&!stream?Math.floor((['breath','settling'].reduce((sum,id)=>{const m=state.minutes[id];return sum+rootRate(id,m>=48?2:m>=16?1:0);},0))/2):rootRate(state.selected,stage),successThreshold:Math.max(500,Math.min(9900,method.odds[stage]+v.oddsBonus)),workCost:Math.ceil(method.work[stage]*v.workPermille/1000),vessel:state.discipline?v:null,away:state.away?structuredClone(state.away):null,insight:state.insight?structuredClone(state.insight):null};
}
// Split at practice thresholds so one large advance equals many small ones.
export function advanceCultivation(value,minutes,root=null) {
    validateCultivation(value);check(natural(minutes),'Invalid cultivation interval.');
    const next=structuredClone(value),selected=next.selected;
    let earned=0n,left=minutes;
    // New vessel states split at actual minute boundaries. The old unbounded
    // clock route stays O(stages) for legacy imports with very large clocks.
    while(left>0){
        const d=next.discipline;
        if(d?.forks&&forkWeights(d.forks).some((w,i)=>i>0&&w>0)){
            const f=d.forks,weights=forkWeights(f),rateFor=i=>i===0?cultivationView(next,true,root).rate:cultivationView({...next,selected:f.slots[i-1].task,minutes:f.slots[i-1].minutes},true,root).rate;
            const integrated=(!weights[0]||next.selected==='mist'||next.minutes[next.selected]===48)&&f.slots.every((s,i)=>!weights[i+1]||s.minutes[s.task]===48)&&d.bodyMinutes===120;
            const step=integrated?left:1,allocation=forkAllocation(f,step);for(let i=0;i<allocation.counts.length;i++)earned+=BigInt(allocation.counts[i])*BigInt(rateFor(i));
            if(!integrated){const i=allocation.counts.findIndex(n=>n>0);if(i===0){if(next.selected!=='mist')next.minutes[next.selected]=Math.min(48,next.minutes[next.selected]+1);}else{const s=f.slots[i-1];s.minutes[s.task]=Math.min(48,s.minutes[s.task]+1);}}
            f.phase=allocation.phase;next.discipline=advanceDiscipline(d,step);left-=step;continue;
        }
        if(d?.paired)next.selected=d.phase===0?'breath':'settling';
        const v=cultivationView(next,true,root);
        if(d?.paired&&next.minutes.breath===48&&next.minutes.settling===48&&d.bodyMinutes===120){
            const first=Math.ceil(left/2),second=Math.floor(left/2),other={...next,selected:next.selected==='breath'?'settling':'breath'};
            earned+=BigInt(first)*BigInt(v.rate)+BigInt(second)*BigInt(cultivationView(other,true,root).rate);
            next.discipline=advanceDiscipline(d,left);next.discipline.phase=(d.phase+left%2)%2;left=0;break;
        }
        const step=d?(d.paired?1:Math.min(left,v.nextAt===null?left:v.nextAt-v.minutes,d.bodyMinutes<120?30-d.bodyMinutes%30:left)):v.nextAt===null?left:Math.min(left,v.nextAt-v.minutes);
        earned+=BigInt(step)*BigInt(v.rate);left-=step;
        if(next.selected!=='mist')next.minutes[next.selected]=Math.min(48,next.minutes[next.selected]+step);
        if(d){next.discipline=advanceDiscipline(d,step);
            if(d.paired)next.discipline.phase=1-d.phase;}
    }
    next.selected=selected;return {next,earned};
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
