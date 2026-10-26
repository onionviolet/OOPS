import test from 'node:test';
import assert from 'node:assert/strict';
import {createAcquisitionLesson, heldLesson, knownPracticeHints, stageRevealKnowledge} from '../../../../src/reveal_chain.js';
import {projectChains} from '../../../../src/chain_inspector.js';
import {prepareNativeUnlocks} from '../../../../src/native_unlock_transaction.js';
import {settleCappedSkillGain, bankedSkillXP} from '../../../../src/skill_overflow_domain.js';
import {domainRegistry} from '../../../../src/domain_registry.js';
import {freshCultivation, advanceCultivation, cultivationView} from '../../../../src/absorb_p23/world_adaptation/techniques.js';
import {mistglassPathView} from '../../../../src/ascension_paths_mistglass.js';
const key=JSON.stringify({id:'Golmoon leaf'});
const inventory=n=>({[key]:{item:{id:'Golmoon leaf'},count:n}});
const inspect=(n,learned)=>projectChains({inventory:inventory(n),expansion:{actors:{player:{facts:{'reveal.herbLesson':learned}}}}},{developer:true}).find(c=>c.id==='gates').rows.at(-1);

test('R3-F1: native acquisition grants a persistent lesson, inspector still calls it waiting',()=>{
 const facts={}, unlocks=[], messages=[];
 const acquire=createAcquisitionLesson({canWrite:()=>true,read:()=>({facts,worldId:'base.frontier',known:()=>false}),unlock:xs=>unlocks.push(...xs),notify:m=>messages.push(m),refresh:()=>{}});
 assert.match(knownPracticeHints({},inventory(19)).join(' '),/19 \/ 20/);
 acquire(inventory(19),[]); assert.equal(facts['reveal.herbLesson'],undefined);
 assert.match(inspect(19,false).detail,/waiting/);
 assert.equal(heldLesson(inventory(20),false),true);
 assert.match(inspect(20,false).detail,/open/);
 const stock=inventory(20), before=JSON.stringify(stock);
 acquire(stock,[]);
 assert.equal(facts['reveal.herbLesson'],true);
 assert.ok(unlocks.some(x=>x.recipe_id==='Weak healing powder'));
 assert.equal(JSON.stringify(stock),before,'learning does not consume leaves');
 assert.equal(messages.length,1);
 const after=inspect(20,true);
 assert.match(after.detail,/waiting/,'reproduces the misleading completed-state label');
 assert.match(after.why,/Not yet learned/);
 const count=unlocks.length;acquire(inventory(25),[]);
 assert.equal(unlocks.length,count,'extra leaves do not replay the grant');
 assert.deepEqual(knownPracticeHints({},inventory(25),true),[]);
 console.log(JSON.stringify({finding:'R3-F1',shownRequirement:'19 / 20',atThreshold:inspect(20,false),afterGrant:after,recipe:unlocks,remainingLeaves:25}));
});

test('R3 journey: staged acquisition also grants the recipe once and serializes its availability',()=>{
 const plan={state:{actors:{player:{worldId:'base.frontier',facts:{}}}},gameplay:{player:{inventory:{[key]:20}}}};
 stageRevealKnowledge(plan,{[key]:19},0);
 assert.equal(plan.state.actors.player.facts['reveal.herbLesson'],true);
 assert.ok(plan.unlocks.some(x=>x.kind==='recipe'&&x.id==='Weak healing powder'));
 let granted=false;
 const txn=prepareNativeUnlocks(plan.unlocks,{availabilities:{recipe:{'Weak healing powder':{setStatus:s=>{granted=s.is_unlocked;}}}},flags:{}});
 const envelope={availabilities:{recipe:{'Weak healing powder':0}}};
 txn.write(envelope);assert.equal(envelope.availabilities.recipe['Weak healing powder'],1);
 assert.equal(granted,false);txn.publish();assert.equal(granted,true);
 const next={state:structuredClone(plan.state),gameplay:{player:{inventory:{[key]:25}}}};
 stageRevealKnowledge(next,{[key]:20},0);assert.equal(next.revealLesson,undefined);
 assert.equal(next.gameplay.player.inventory[key],25);
});

test('R3 bounded overflow control: frontier gain keeps awarded plus held XP; later practice drains once',()=>{
 domainRegistry.load({});
 const base={worldId:'base.frontier',skillId:'Herbalism',cap:10,xpToNext:100};
 const awarded=settleCappedSkillGain({...base,xp:35});
 assert.equal(awarded,10);assert.equal(bankedSkillXP('Herbalism','base.frontier'),25);
 assert.equal(awarded+bankedSkillXP('Herbalism','base.frontier'),35);
 const next=settleCappedSkillGain({...base,xp:4});
 assert.equal(next,8);assert.equal(awarded+next+bankedSkillXP('Herbalism','base.frontier'),39);
 domainRegistry.load({});
});

test('R3 ascension control: existing Mistglass path thresholds agree with actual practice settlement',()=>{
 const s=freshCultivation();s.selected='breath';
 for(const minutes of [15,16,47,48,60]){
  const {next}=advanceCultivation(s,minutes), actual=cultivationView(next), path=mistglassPathView(next);
  assert.equal(path.position,['Learning','Practiced','Integrated'].indexOf(actual.stage));
  assert.equal(actual.minutes,Math.min(48,minutes));
  assert.equal(path.ready,false,'automatic threshold settlement has already advanced the position');
 }
});
