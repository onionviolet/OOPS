// Crafting depth as a registered domain: the tolerance ledger and experiment log for the Village trial.
// Owns the namespaced `craftDepth` save slice {family:'craft.depth@1', dose, log}. Absent slice = fresh body, empty log.
import {registerDomain} from './domain_registry.js';
import {freshDepth,materialName} from './crafting_frontier_runtime.js';
import {frontierDoseRules as rules} from './craft_content_frontier.js';
import {validateDoseState,MINUTES_PER_DAY} from './craft_dose_rules.js';
import {validateExperimentLog,deduce} from './craft_experiment_log.js';
export const DEPTH_FAMILY='craft.depth@1';
let depth=freshDepth();
export const depthOwner=()=>depth;
export function setDepthOwner(value){depth=value??freshDepth();}
const effectName=id=>rules.names[id.split('.')[1]]??id;
// What the panel shows: remaining tolerance per effect at the given minute, and deductions from the player's own trials.
export function depthView(at,owner){
 const tolerance=Object.entries(depth.dose.levels).map(([effect,e])=>({effect:rules.names[effect]??effect,level:Math.max(0,e.level-Math.floor((at-e.at)/MINUTES_PER_DAY)*rules.tolerance[effect].decayPerDay),overdoseAt:rules.tolerance[effect].overdoseAt})).filter(t=>t.level>0);
 const deductions=deduce(depth.log).map(d=>({material:materialName(d.material,owner),effect:effectName(d.effect),status:d.status,hits:d.hits,withCount:d.withCount}));
 return {tolerance,deductions,trials:depth.log.entries.length};
}
function check(slice){if(slice==null)return null;if(slice.family!==DEPTH_FAMILY)throw Error('Unsupported crafting depth slice.');validateDoseState(rules,slice.dose);validateExperimentLog(slice.log);return slice;}
registerDomain({id:'craftDepth',deps:['crafting'],initialState:()=>null,
 save:()=>depth.log.entries.length||Object.keys(depth.dose.levels).length?{family:DEPTH_FAMILY,dose:structuredClone(depth.dose),log:structuredClone(depth.log)}:undefined,
 validate:slice=>{check(slice);},
 migrate:slice=>{if(slice==null)return freshDepth();const {dose,log}=structuredClone(check(slice));return {dose,log};},
 load:slice=>setDepthOwner(slice)});
