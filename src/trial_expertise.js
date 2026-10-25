// Retained lessons of a particular task, separate from current-body conditioning.
import {check,natural} from './basics.js';
const route=/^(quick|endurance|precision|blade|pole)\.[1-3]$/;
export function validateTrialExpertise(value){
 if(value===undefined)return;
 check(value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length<=15&&Object.entries(value).every(([k,n])=>route.test(k)&&natural(n)&&n>0),'Invalid task-specific trial learning.');
}
export function trialExpertise(state,kind,tier=state.trial.stage+1){return state.trial.routeLessons?.[`${kind}.${tier}`]||0;}
export const taskSteadiness=(state,kind,tier)=>Math.min(3,trialExpertise(state,kind,tier));
export function learnFailedTask(before,after,kind,passed){
 if(passed!==false)return after;
 const key=`${kind}.${before.trial.stage+1}`,count=trialExpertise(before,kind)+1;
 const routeLessons={...before.trial.routeLessons,[key]:count};validateTrialExpertise(routeLessons);
 return {...after,trial:{...after.trial,routeLessons}};
}
