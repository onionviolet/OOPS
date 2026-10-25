// Household fortunes (IM9, IM10, OG16; AD16, AD19, AD33, AD38). Pure, non-spatial rules over plain
// serializable rows; the household fortunes domain stages their live changes in the root save. Named members are rows;
// a group row ({group:true,count}) is aggregate. Every number is a dial with an in-world reason.
export const FORTUNE_DIALS={
 base:{value:0.01,why:'Awakening is rare for anyone; a lean life still has the odd spark.'},
 bed:{value:0.05,why:'Sound sleep in a dry, warm bed lets a body keep what it takes in.'},
 qi:{value:0.04,why:'A currently powered bed field helps a rested body notice its circulation at the daily assessment.'},
 age:{peak:30,span:60,floor:0.35,why:'This household curriculum is easiest near early adulthood; older people can still awaken with a lower ordinary response.'},
 care:{value:0.05,why:'Being fed and tended leaves a person with attention to spare for the odd thing they notice.'},
 hidden:{value:[0.5,1.5],why:'Some people are simply nearer to awakening; the household cannot see why.'},
 resentmentEase:{value:1,why:'Grudges fade by about a point per season of decent treatment (AD19: recovery is forgiving).'},
};
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
// Deterministic roll in [0,1): same seed, member and day always give the same answer.
export function roll(seed,id,day){let h=2166136261;for(const ch of `${seed}|${id}|${day}`){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}h^=h>>>13;h=Math.imul(h,0x5bd1e995);h^=h>>>15;return (h>>>0)/4294967296;}
// Observable circumstances: bed 0..1 (dry, warm, own), fed and tended are 0..1 shares of recent days.
export const observableScore=m=>clamp(m.bed??0,0,1)*0.5+clamp(m.fed??0,0,1)*0.3+clamp(m.tended??0,0,1)*0.2;
export function awakeningChance(m,d=FORTUNE_DIALS){
 const care=(clamp(m.fed??0,0,1)+clamp(m.tended??0,0,1))/2,[lo,hi]=d.hidden.value;
 const hidden=lo+(hi-lo)*clamp(m.talent??0.5,0,1);
 const age=Number.isFinite(m.age)?Math.max(d.age?.floor??0.35,1-Math.abs(m.age-(d.age?.peak??30))/(d.age?.span??60)):1;
 return clamp((d.base.value+d.bed.value*clamp(m.bed??0,0,1)+d.care.value*care+(d.qi?.value??0)*clamp(m.qi??0,0,1))*hidden*age,0,0.5);
}
// Advances one named member by `days`; returns the member with `awakened` set on the first success.
export function settleAwakening(m,days,seed){
 if(m.awakened||m.dead)return m;
 const p=awakeningChance(m);
 for(let i=0;i<days;i++){const day=(m.day||0)+i;if(roll(seed,m.id,day)<p)return {...m,day:day+1,awakened:{day}};}
 return {...m,day:(m.day||0)+days};
}
// AD33: a group is one aggregate row; heads awaken as a count, not as named people.
export function settleGroup(g,days,seed){
 const p=awakeningChance(g);let n=0;for(let h=0;h<g.count;h++)for(let i=0;i<days;i++)if(roll(seed,`${g.id}#${h}`,(g.day||0)+i)<p){n++;break;}
 return {...g,day:(g.day||0)+days,sparks:(g.sparks||0)+n};
}
// Observable-only watch list: ranks on what the household can see, never reads or returns `talent`.
export function watchList(members){
 return members.filter(m=>!m.dead&&!m.awakened&&!m.group).map(m=>({id:m.id,name:m.name,score:observableScore(m),signs:m.signs||0}))
  .sort((a,b)=>b.signs-a.signs||b.score-a.score||a.id.localeCompare(b.id));
}
// IM10: a cause carries its own charge. Neglect is an act of the household; age is not.
export const DEATH_CAUSES={
 neglect:{standing:-2,resentment:3,why:'Staff and neighbours saw the person go unfed, unhoused or untended.'},
 accident:{standing:0,resentment:1,why:'A bad day at work; people want to know it was not avoidable.'},
 old_age:{standing:0,resentment:0,why:'A long life ending is not a grievance.'},
};
export const causeOfDeath=m=>m.fed<0.2||m.bed<0.2&&m.tended<0.2?'neglect':m.age>=m.lifespan?'old_age':'accident';
export const emptyHousehold=()=>({standing:0,resentment:0,ledger:[]});
export function recordDeath(h,m,cause=causeOfDeath(m),at=0){
 const c=DEATH_CAUSES[cause];if(!c)throw Error('Household: unknown cause of death');
 const witnesses=m.group?0:1;
 return {...h,standing:h.standing+c.standing,resentment:h.resentment+c.resentment*witnesses,ledger:[...h.ledger,{at,id:m.id,cause,note:c.why}]};
}
// AD19: grudges and lost standing recover with decent treatment; nothing locks.
export const easeHousehold=(h,seasons,d=FORTUNE_DIALS)=>({...h,resentment:Math.max(0,h.resentment-d.resentmentEase.value*seasons),standing:Math.min(0,h.standing+seasons*0.5)});
// OG16: completions of a task build a standing routine. Counts persist across lives (the household
// remembers how the work is done); a routine still stops at choices and at a lethal cost (AD16).
export const ROUTINES=[
 {id:'daily_meals',task:'cook',threshold:5,why:'After enough meals Iven no longer needs asking.'},
 {id:'roof_checks',task:'repair',threshold:3,why:'Toma learns where the roof gives first.'},
 {id:'airing_rooms',task:'dry',threshold:4,why:'Drying out damp rooms becomes a habit.'},
];
export const emptyCompletions=()=>({});
export const recordCompletion=(c,task)=>({...c,[task]:(c[task]||0)+1});
export const unlockedRoutines=(c,table=ROUTINES)=>table.filter(r=>(c[r.task]||0)>=r.threshold);
export function routineMayRun(routine,{choicePending=false,lethal=false}={}){
 if(choicePending)return {run:false,why:'A real choice is waiting; routines stop there.'};
 if(lethal)return {run:false,why:'The cost would kill; the routine holds.'};
 return {run:true,why:routine.why};
}
