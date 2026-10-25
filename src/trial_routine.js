import {check,natural} from './basics.js';
import {riskFor} from './breakthrough_trial.js';
import {trialRules} from './pledges_content.js';
export function validateTrialRoutine(r){
 if(r===undefined)return;check(r&&Object.keys(r).sort().join(',')==='enabled,last,maxRisk,maxUnits,reserve'&&typeof r.enabled==='boolean'&&['maxRisk','maxUnits','reserve'].every(k=>natural(r[k]))&&r.maxRisk<=1000&&r.maxUnits<=5&&r.reserve<=1000000,'Invalid earned trial routine.');
 if(r.last)check(natural(r.last.at)&&typeof r.last.reason==='string'&&r.last.reason.length<=240,'Invalid routine stop receipt.');
}
export function configureTrialRoutine(state,options){
 check((state.trial.quality||0)>0,'Earn a graded breakthrough before setting a trial routine.');
 const r={enabled:options.enabled,maxRisk:options.maxRisk,maxUnits:options.maxUnits,reserve:options.reserve,last:null};validateTrialRoutine(r);return {...state,routine:r};
}
export function quoteTrialRoutine(state,view,stock,c){
 const r=state.routine;validateTrialRoutine(r);
 const stop=reason=>({eligible:false,reason});
 if(!r?.enabled)return stop('Routine is off.');
 if(c.blocked)return stop(c.blocked);
 if(c.world!=='base.frontier'||c.location!=='Village')return stop('This learned routine uses the Village practice frame. Return there and resume it.');
 if(state.ordeal)return stop('Finish the deliberately chosen ordeal first.');
 if(view.done)return stop('This body has completed the current three-stage frame.');
 if(!view.ready)return stop('Practice a qualifying skill before the next stage; the guide names the missing readiness.');
 const available=Math.max(0,stock-r.reserve);
 if(r.maxRisk===0&&r.maxUnits>=5&&available>=5)return {eligible:true,guarded:true,units:5,risk:0,cost:5};
 for(let units=0;units<=r.maxUnits;units++){const cost=units*trialRules.pay.perUnit;if(cost>available)break;const risk=riskFor(trialRules,view.tier,{pressure:view.pressure,stability:view.stability,scar:view.scar,units});if(risk<=r.maxRisk)return {eligible:true,guarded:false,units,risk,cost};}
 return stop(`No attempt fits both your ${r.maxRisk/10}% risk limit and ${r.reserve}-ration reserve. Calm actual fear, acquire rations, or revise the limits; ordinary quick trials retain a 5% floor.`);
}
