import test from 'node:test';
import assert from 'node:assert/strict';
import {intentEvidence,intentEffects,intentView,stageIntent,validateIntents} from '../src/cultivation_intents.js';
import {fresh,trialView,attempt,beginOrdeal,stepOrdeal,ordealView} from '../src/pledges.js';
const root=()=>({clock:10,sequence:1,actors:{player:{worldId:'base.frontier',facts:{}}},worlds:{'base.frontier':{facts:{}}},simulation:{people:{player:{life:'alive'}},knowledge:{player:{}}}});
const c={clock:10,world:'base.frontier',alive:true,ready:true,ordeal:false};
test('only actual known work opens an intent; reflection costs joined time and retains knowledge when another habit is selected',()=>{
 const s=root();assert.deepEqual(intentView(s).choices,[]);assert.throws(()=>stageIntent({state:s},'patient',c),/dossier/);
 s.worlds['base.frontier'].facts['drainage.remaining']=0;s.simulation.knowledge.player['drainage.flowLesson']={stage:'understood'};assert.equal(intentEvidence(s).patient,true);
 s.clock=25;stageIntent({state:s},'patient',c);validateIntents(s);assert.equal(intentEffects(s).stability,2);assert.throws(()=>stageIntent({state:s},'patient',{...c,ordeal:true}),/ordeal/);
 s.worldAdaptation={techniques:{discipline:{depth:{flow:1,still:0}}},pathWork:{completed:1}};assert.equal(intentEvidence(s).committed,true);s.clock=40;stageIntent({state:s},'committed',{...c,clock:25});assert.equal(intentEffects(s).pressScore,1);assert.equal(intentView(s).choices.every(x=>x.learned),true);
 s.clock=45;stageIntent({state:s},'patient',{...c,clock:40});assert.equal(intentView(s).selected,'patient');s.actors.player.worldId='other';assert.equal(intentEffects(s).stability,0);
});
test('one selected habit drives the identical native trial preview and attempt, and the alternate changes actual press cost and score',()=>{
 const s=fresh(),skills={combat:1,equilibrium:0,persistence:0},patient={...skills,intent:{stability:2,pressScore:0,pressCost:0}};
 const before=trialView(s,skills),after=trialView(s,patient);assert.equal(after.stability,before.stability+2);assert.ok(after.risk<before.risk);const resolved=attempt(s,{roll:999,units:0,skills:patient});assert.equal(resolved.state.trial.last.risk,after.risk);
 const a=beginOrdeal(s,{kind:'endurance',units:0,skills,at:0}),committed={...skills,intent:{pressScore:1,pressCost:1}};assert.equal(ordealView(a,committed).pressCost,ordealView(a,skills).pressCost+1);const x=stepOrdeal(a,'press',skills,1),y=stepOrdeal(a,'press',committed,1);assert.equal(y.ordeal.score,x.ordeal.score+1);assert.equal(y.ordeal.integrity,x.ordeal.integrity-1);
});
