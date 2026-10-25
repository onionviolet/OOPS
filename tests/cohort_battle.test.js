import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {commitSimulationCommand,simulationOccupiesActor} from '../src/simulation.js';
import {applySimulationEffects} from '../src/simulation_effects.js';
import {registerHomeWork} from '../src/home_work.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {cohortDefinitions} from '../src/cohort_battle_content.js';
import {COHORT_MEMBERS,COHORT_COACHES,COHORT_ROOM,nativeFighterOwnership} from '../src/cohort_battle_facts.js';
import {initializeCohortBattle,quoteCohortAdmission,commitCohortAction,cohortNativeAction,quoteCohortAction,cohortBattleView} from '../src/cohort_battle.js';
import {validateCohortBattle} from '../src/cohort_battle_validation.js';
if(!registry.simulation.people.has(COHORT_MEMBERS[0]))registerHomeWork(registry);
const additions=createSimulationRegistry(cohortDefinitions);for(const family of ['people','commands','encounters'])for(const [id,d]of additions[family])if(!registry.simulation[family].has(id))registry.simulation[family].set(id,d);
const ctx=p=>({...fieldContext(p,COHORT_ROOM),location:COHORT_ROOM,manorAccess:true,ready:true,paidHelpReason:'',vitals:{player:{health:30-(p.native?.hpToFull||0),max_health:30,stamina:30-(p.native?.staminaToFull||0),max_stamina:30}}});
function ready(){
 let p=joinField(createFieldFixture());p.state.simulation.people.player.location=COHORT_ROOM;p.state.simulation.people.player.body={id:'fixture.player',form:'human',hands:2,mobile:true};p.gameplay.player.inventory[JSON.stringify({id:'Prepared survey kit'})]=2;
 applySimulationEffects(p,COHORT_MEMBERS.map(id=>({type:'spawn',personId:id,definitionId:id})),{actorId:'player'},registry,'fixture:household');
 for(const id of COHORT_MEMBERS){const a=p.state.actors[id],n=p.state.simulation.people[id];n.location=COHORT_ROOM;n.vitals={health:20,max_health:20,stamina:12,max_stamina:12};n.body={...n.body,id:'fixture.'+id,form:'human',hands:2,mobile:true};a.facts['home.employed']=true;a.facts['home.leave']=false;a.facts['cohort.willing']=true;a.resources['home.energy']=60;a.resources['home.schoolRank']=1;a.resources['cohort.training']=1;}
 p=commitSimulationCommand(p.state,registry,{id:'cohort.enroll'},{...ctx(p),facts:{location:COHORT_ROOM,'cohort.manorAccess':true,'cohort.freeBody':true}},p.state.sequence);return p;
}
const begin=p=>initializeCohortBattle(p.state,registry,COHORT_MEMBERS.slice(0,2),ctx(p));
function packet(p,actorId,targetId,type='strike'){
 const s=p.state.simulation.sessions.player,b=s.nativeBattle,token={sessionId:s.id,sequence:p.state.sequence,action:b.actions,seed:b.seed};
 const bindings=Object.fromEntries(Object.keys(b.fighters).map(id=>{const v=id==='player'?ctx(p).vitals.player:p.state.simulation.people[id].vitals;return [id,{...token,ownerId:id,ownership:nativeFighterOwnership(p.state,id),snapshot:{attackPower:8,emptyStaminaMultiplier:.5,shield:0,shieldSkill:0,stats:{...v,attack_points:10000,agility:3,intuition:3,defense:0,crit_rate:0,crit_multiplier:1,attack_speed:1,attack_count:1,stamina_efficiency:1}}}];}));return {command:{...token,actorId,targetId,type},bindings};
}
const act=(p,actor,target,type='strike')=>{const x=packet(p,actor,target,type);return commitCohortAction(p.state,registry,x.command,ctx(p),x.bindings);};
test('actual cohort admission debits finite fees/effort, occupies selected real people, freezes training and leaves its input untouched',()=>{
 const p=ready(),before=structuredClone(p),n=begin(p),s=n.state.simulation.sessions.player,b=s.nativeBattle;assert.deepEqual(p,before);assert.equal(n.external.money,p.external.money-2);for(const id of COHORT_COACHES)assert.equal(n.state.actors[id].resources.coins,1);for(const id of COHORT_MEMBERS.slice(0,2)){assert.equal(n.state.actors[id].resources['home.energy'],50);assert.equal(simulationOccupiesActor(n.state,id),true);assert.equal(b.admission.training[id],1);}assert.equal(n.state.actors[COHORT_MEMBERS[2]].resources['home.energy'],60);validateCohortBattle(JSON.parse(JSON.stringify(b)),JSON.parse(JSON.stringify(s)),n.state);assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(n.state)),registry),n.state);assert.throws(()=>begin(n),/occupied|free/);
});
test('native action bindings, stale cursors and changed custody reject before any wound, effort or random draw',()=>{
 const p=begin(ready()),x=packet(p,'player',COHORT_COACHES[0]),before=structuredClone(p);x.bindings.player.ownership='different';assert.equal(quoteCohortAction(p.state,x.command,ctx(p),x.bindings).eligible,false);assert.throws(()=>commitCohortAction(p.state,registry,x.command,ctx(p),x.bindings),/custody/);assert.deepEqual(p,before);const y=packet(p,'player',COHORT_COACHES[0]),next=commitCohortAction(p.state,registry,y.command,ctx(p),y.bindings);assert.throws(()=>commitCohortAction(next.state,registry,y.command,ctx(next),y.bindings),/stale/);assert.ok(next.state.simulation.people[COHORT_COACHES[0]].vitals.health<20);
});
test('real participating members receive same-finish milestones once, withdrawal retains fees and wounds, and unsupported bodies can be released',()=>{
 let p=begin(ready());for(const id of COHORT_MEMBERS.slice(0,2))p=act(p,id,COHORT_COACHES[0]);for(let i=0;i<30&&p.state.simulation.sessions.player;i++){const b=p.state.simulation.sessions.player.nativeBattle,target=COHORT_COACHES.find(id=>b.fighters[id].status==='active');p=act(p,'player',target);}
 assert.equal(p.state.simulation.sessions.player,undefined);for(const id of ['player',...COHORT_MEMBERS.slice(0,2)]){assert.equal(p.state.actors[id].resources['cohort.wins'],1);assert.equal(p.state.actors[id].facts['cohort.lastFinish'],p.state.clock);}assert.equal(p.state.actors[COHORT_MEMBERS[2]].resources['cohort.wins'],undefined);
 let other=begin(ready()),money=other.external.money;other=act(other,COHORT_COACHES[0],'player');const wounded=other.native.hpToFull;other=act(other,'player',undefined,'withdraw');assert.equal(other.native.hpToFull,wounded);assert.equal(other.external.money,money);assert.equal(other.state.actors.player.facts['cohort.lastOutcome'],'withdrew');assert.equal(other.state.actors.player.resources['cohort.wins'],undefined);
 let body=begin(ready());body.state.simulation.people[COHORT_MEMBERS[0]].body.id='changed';const choice=cohortNativeAction(body.state,COHORT_MEMBERS[0]);assert.equal(choice.type,'release');body=act(body,COHORT_MEMBERS[0],undefined,'release');assert.equal(body.state.simulation.sessions.player.nativeBattle.fighters[COHORT_MEMBERS[0]].status,'unsupported');assert.equal(simulationOccupiesActor(body.state,COHORT_MEMBERS[0]),false);
});
test('untrained, unwilling, occupied, unpaid, vow-bound or wrong-place cohorts cannot enter',()=>{
 for(const variant of ['untrained','unwilling','wounded','occupied','funds','vow','place']){const p=ready(),id=COHORT_MEMBERS[0],c=ctx(p);if(variant==='untrained')p.state.actors[id].resources['cohort.training']=0;if(variant==='unwilling')p.state.actors[id].facts['cohort.willing']=false;if(variant==='wounded')p.state.simulation.people[id].vitals.health=1;if(variant==='occupied')p.state.simulation.sessions[id]={participants:[id]};if(variant==='funds')c.external.money=1;if(variant==='vow')c.paidHelpReason='Break the paid-help vow first.';if(variant==='place')c.location='Village';assert.equal(quoteCohortAdmission(p.state,[id],c).eligible,false,variant);}
});

test('paid instruction uses the actual job, raises supported capacity without filling it, and actual bread/rest restores the same patient',()=>{
 let p=ready();const id=COHORT_MEMBERS[0],a=p.state.actors[id],person=p.state.simulation.people[id];a.resources['cohort.training']=0;delete a.facts['cohort.willing'];delete person.vitals;p.state.actors['home.manor.steward'].resources['home.estateFunds']=20;p.gameplay.player.inventory[JSON.stringify({id:'Stale bread'})]=1;
 p=commitSimulationCommand(p.state,registry,{id:'cohort.train.'+id},{...ctx(p),actorId:id,targetId:COHORT_COACHES[0],facts:{location:COHORT_ROOM}},p.state.sequence);assert.equal(p.state.actors[id].resources['cohort.training'],0);assert.equal(p.state.actors['home.manor.steward'].resources['home.estateFunds'],16);
 const advance=n=>{const contexts=Object.fromEntries(Object.entries(p.state.simulation.people).map(([actorId,r])=>[actorId,{actorId,facts:{location:r.location},vitals:r.vitals}]));p=advanceSimulation(p.state,registry,n,p.external,p.gameplay,contexts);};advance(30);assert.equal(p.state.actors[id].resources['cohort.training'],1);assert.equal(p.state.actors[id].resources['home.wages'],2);assert.deepEqual(p.state.simulation.people[id].vitals,{health:1,max_health:20,stamina:0,max_stamina:12});assert.equal(quoteCohortAdmission(p.state,[id],ctx(p)).eligible,false);
 p=commitSimulationCommand(p.state,registry,{id:'cohort.recover.'+id},{...ctx(p),actorId:id,facts:{location:COHORT_ROOM,'cohort.recoveryReady':true}},p.state.sequence);advance(30);assert.deepEqual(p.state.simulation.people[id].vitals,{health:20,max_health:20,stamina:12,max_stamina:12});assert.equal(p.gameplay.player.inventory[JSON.stringify({id:'Stale bread'})]||0,0);assert.equal(quoteCohortAdmission(p.state,[id],ctx(p)).eligible,true);
 const larger=structuredClone(p);larger.state.simulation.people[id].vitals={health:3,max_health:40,stamina:2,max_stamina:30};applySimulationEffects(larger,[{type:'vital',actor:id,key:'health',amount:0,minimumCapacity:20},{type:'vital',actor:id,key:'stamina',amount:0,minimumCapacity:12}],{actorId:'player'},registry,'fixture:capacity');assert.deepEqual(larger.state.simulation.people[id].vitals,{health:3,max_health:40,stamina:2,max_stamina:30});
});

test('releasing a member before their first strike does not manufacture participation or a winner milestone',()=>{
 let p=begin(ready());const absent=COHORT_MEMBERS[0],other=COHORT_MEMBERS[1];p=act(p,absent,undefined,'release');p=act(p,other,COHORT_COACHES[0]);for(let i=0;i<30&&p.state.simulation.sessions.player;i++){const b=p.state.simulation.sessions.player.nativeBattle,target=COHORT_COACHES.find(id=>b.fighters[id].status==='active');p=act(p,'player',target);}assert.equal(p.state.actors[absent].completed['cohort.start'],undefined);assert.equal(p.state.actors[absent].resources['cohort.wins'],undefined);assert.equal(p.state.actors[other].resources['cohort.wins'],1);assert.equal(p.state.actors.player.facts['cohort.lastOutcome'],'won');
});

test('an explicitly willing front is frozen; legacy sessions stay player-first and release restores that ordinary target',()=>{
 const base=ready(),member=COHORT_MEMBERS[0];const legacy=begin(base);assert.equal(legacy.state.simulation.sessions.player.nativeBattle.admission.frontline,undefined);assert.equal(cohortNativeAction(legacy.state,COHORT_COACHES[0]).targetId,'player');
 let p=initializeCohortBattle(base.state,registry,[member],{...ctx(base),frontlineId:member});assert.equal(p.state.simulation.sessions.player.nativeBattle.admission.frontline,member);assert.equal(cohortNativeAction(p.state,COHORT_COACHES[0]).targetId,member);assert.equal(quoteCohortAdmission(base.state,[member],{...ctx(base),frontlineId:COHORT_MEMBERS[1]}).eligible,false);const tampered=structuredClone(p.state);tampered.simulation.sessions.player.nativeBattle.admission.frontline=COHORT_MEMBERS[1];assert.throws(()=>loadExpansionState(tampered,registry),/front participant/);p=act(p,COHORT_COACHES[0],member);assert.equal(p.state.simulation.sessions.player.nativeBattle.receipts.at(-1).target,member);p=act(p,member,undefined,'release');assert.equal(cohortNativeAction(p.state,COHORT_COACHES[0]).targetId,'player');
});

test('the native attack getter already includes empty-stamina scaling; a strike applies that factor exactly once',()=>{
 const full=begin(ready()),tired=structuredClone(full),actor=COHORT_MEMBERS[0],target=COHORT_COACHES[0];full.state.simulation.people[actor].vitals.stamina=1;tired.state.simulation.people[actor].vitals.stamina=0;
 const attack=(p,power)=>{const x=packet(p,actor,target);x.bindings[actor].snapshot.attackPower=power;return commitCohortAction(p.state,registry,x.command,ctx(p),x.bindings);};
 const drained=attack(full,8),alreadyEmpty=attack(tired,4);assert.ok(drained.state.simulation.people[target].vitals.health<20);assert.equal(alreadyEmpty.state.simulation.people[target].vitals.health,drained.state.simulation.people[target].vitals.health);assert.equal(alreadyEmpty.state.simulation.people[actor].vitals.stamina,0);
});

test('agreed guard-testing choices use the actual instructor/target bindings and shared strike transaction',()=>{
 const p=begin(ready()),target=COHORT_MEMBERS[0],coach=COHORT_COACHES[0],packetValue=packet(p,coach,target),v=cohortBattleView(p.state,registry,ctx(p),packetValue.bindings),choice=v.actions.find(a=>a.group==='guard-test'&&a.command.actorId===coach&&a.command.targetId===target);assert.ok(choice?.eligible);const next=commitCohortAction(p.state,registry,choice.command,ctx(p),packetValue.bindings);assert.equal(next.state.simulation.people[coach].vitals.stamina,p.state.simulation.people[coach].vitals.stamina-1);assert.equal(next.state.simulation.sessions.player.nativeBattle.receipts.at(-1).target,target);assert.ok(next.state.simulation.people[target].vitals.health<p.state.simulation.people[target].vitals.health);assert.throws(()=>commitCohortAction(next.state,registry,choice.command,ctx(next),packetValue.bindings),/stale/);
});
