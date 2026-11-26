import test from 'node:test';
import assert from 'node:assert/strict';
import {bindResponseLoanCommands,normalizeResponseLoanPlan,normalizeResponseLoanEnvelope,responseChoiceActs,withResponseChoiceParticipants,RESPONSE_LOAN_ID,RESPONSE_CHARM,NEIL_RESPONSE_CHARM,RESPONSE_SCALAR,RESPONSE_BORROW,RESPONSE_NEIL_USE,RESPONSE_USE,RESPONSE_HOME,RESPONSE_KEEP,RESPONSE_RELEASE,RESPONSE_REPLACE,RESPONSE_RETURN,RESPONSE_REBORROW,RESPONSE_INTENT} from '../src/lotm_charm_response.js';
import {CHARM_MENTOR_ID as neil} from '../src/lotm_charm_upkeep.js';
import {CHARM_REPLACEMENT_KEY,CHARM_LOAN_ID} from '../src/lotm_charm_loan.js';
import {defineLotmActs} from '../src/lotm_act_engine.js';
import {applySimulationEffects} from '../src/simulation_effects.js';
import {retainResponseChoiceJobs,responseCaseVisitors} from '../src/lotm_charm_response.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
const stateKey='book.lotm.kj3ba.charm-loan';
const makePlan=(a=1,b=1)=>({state:{clock:10,actors:{player:{worldId:'book.lotm.tingen',facts:{[stateKey]:a?'replace if used':'one replacement owed to Old Neil'},resources:{[RESPONSE_SCALAR]:a,money:40},completed:{[RESPONSE_BORROW]:1}},[neil]:{worldId:'book.lotm.tingen',facts:{},resources:{[RESPONSE_SCALAR]:b,money:5}}},simulation:{people:{player:{inventory:'native'},[neil]:{inventory:'simulation'}},owners:{player:{},[neil]:{}},equipment:{},jobs:[],custody:{},knowledge:{}}},gameplay:{player:{inventory:{}}},acquisitions:[]});
const apply=(plan,effects)=>applySimulationEffects(plan,effects,{actorId:'player'},{},'test.response');
test('the actual source response retains its relocated colleague bodies until the home departure',()=>{
 const p=makePlan();assert.equal(responseCaseVisitors(p.state).has(neil),false);p.state.actors.player.completed['book.lotm.kj3ba.follow-swain']=1;assert.equal(responseCaseVisitors(p.state).has(neil),true);p.state.actors.player.completed[RESPONSE_HOME]=1;assert.equal(responseCaseVisitors(p.state).has(neil),false);
});
test('source borrower binding retains the other responding colleague as a required participant',()=>{
 const command=bindResponseLoanCommands([{id:RESPONSE_BORROW,participants:['test.responding-colleague',neil],completionCoLocated:true,costs:[],effects:[]}])[0];assert.deepEqual(command.participants,['test.responding-colleague',neil]);assert.equal(command.participantsCoLocated,true);assert.equal(command.completionCoLocated,true);
});
test('exact older response stock reclassifies without acquiring, minting, or changing unrelated loans',()=>{
 const p=makePlan();p.state.simulation.custody[CHARM_LOAN_ID]={owner:neil,holder:'player',key:CHARM_REPLACEMENT_KEY,count:1};
 assert.equal(normalizeResponseLoanPlan(p),true);assert.equal(p.gameplay.player.inventory[RESPONSE_CHARM],1);assert.equal(p.state.simulation.owners[neil][NEIL_RESPONSE_CHARM],1);
 assert.equal(p.state.actors.player.resources[RESPONSE_SCALAR],0);assert.equal(p.state.actors[neil].resources[RESPONSE_SCALAR],0);assert.equal(p.acquisitions.length,0);
 assert.equal(p.state.simulation.custody[RESPONSE_LOAN_ID].equivalentKey,CHARM_REPLACEMENT_KEY);assert.ok(p.state.simulation.custody[CHARM_LOAN_ID]);
 const before=JSON.stringify(p);assert.equal(normalizeResponseLoanPlan(p),false);assert.equal(JSON.stringify(p),before);
 const unsupported=makePlan(3);const bytes=JSON.stringify(unsupported);assert.equal(normalizeResponseLoanPlan(unsupported),false);assert.equal(JSON.stringify(unsupported),bytes);
});
test('old pending consumption keeps its reserved representation until completion or cancellation',()=>{
 const p=makePlan();p.state.simulation.jobs=[{actorId:'player',effects:[{type:'resource',key:RESPONSE_SCALAR,amount:-1}]}];normalizeResponseLoanPlan(p);
 assert.equal(p.state.actors.player.resources[RESPONSE_SCALAR],1);assert.equal(p.gameplay.player.inventory[RESPONSE_CHARM],undefined);assert.equal(p.state.simulation.custody[RESPONSE_LOAN_ID],undefined);
 p.state.simulation.jobs=[];p.state.actors.player.resources[RESPONSE_SCALAR]=0;p.state.actors.player.facts[stateKey]='one replacement owed to Old Neil';normalizeResponseLoanPlan(p);
 assert.ok(p.state.simulation.custody[RESPONSE_LOAN_ID]);assert.equal(p.gameplay.player.inventory[RESPONSE_CHARM],undefined);
 const cancelled=makePlan();cancelled.state.simulation.jobs=[];normalizeResponseLoanPlan(cancelled);assert.equal(cancelled.gameplay.player.inventory[RESPONSE_CHARM],1);
});
test('completed historical home assurance releases its own debt and records intention without money or stock',()=>{
 const p=makePlan(0,0);p.state.actors.player.completed[RESPONSE_HOME]=1;
 assert.equal(normalizeResponseLoanPlan(p),true);assert.equal(p.state.actors.player.facts[stateKey],'released by Old Neil');assert.match(p.state.actors[neil].facts[RESPONSE_INTENT],/no agreement/);
 assert.equal(p.state.simulation.custody[RESPONSE_LOAN_ID],undefined);assert.equal(p.state.actors.player.resources.money,40);assert.equal(p.state.actors[neil].resources.money,5);assert.deepEqual(p.gameplay.player.inventory,{});
 assert.equal(normalizeResponseLoanPlan(p),false);
 const continued=makePlan(0,0);continued.state.actors.player.completed[RESPONSE_HOME]=1;continued.state.actors.player.facts['lotm.charm.response.choice']='continue';normalizeResponseLoanPlan(continued);assert.ok(continued.state.simulation.custody[RESPONSE_LOAN_ID]);
});
test('a mismatched preexisting response contract leaves both scalar owners and every native unit untouched',()=>{
 for(const mismatch of [{owner:'someone-else'},{key:CHARM_REPLACEMENT_KEY},{count:2},{equivalentKey:RESPONSE_CHARM}]){
  const p=makePlan(0,1);p.state.actors.player.completed[RESPONSE_HOME]=1;p.state.simulation.custody[RESPONSE_LOAN_ID]={owner:neil,holder:'player',key:RESPONSE_CHARM,count:1,...mismatch};const before=JSON.stringify(p);assert.equal(normalizeResponseLoanPlan(p),false);assert.equal(JSON.stringify(p),before);
 }
});
test('save envelope uses native count records and repeats without duplicate stock',()=>{
 const p=makePlan();const save={expansion:p.state,inventories:{person:{main_character:{}}}};
 assert.equal(normalizeResponseLoanEnvelope(save),true);assert.equal(save.inventories.person.main_character[RESPONSE_CHARM].count,1);assert.equal(normalizeResponseLoanEnvelope(save),false);
});
test('response source binding transfers actual giver stock; use reserves physical units and drops spent completion guards',()=>{
 const scalar={type:'resource',actor:'player',key:RESPONSE_SCALAR,amount:1};
 const commands=bindResponseLoanCommands([{id:RESPONSE_BORROW,costs:[],effects:[scalar,{...scalar,actor:neil}]},...[RESPONSE_NEIL_USE,RESPONSE_USE].map(id=>({id,costs:[],effects:[{...scalar,amount:-1}],requires:{fact:'target.resource.'+RESPONSE_SCALAR,op:'gte',value:1},completionRequires:{fact:'target.resource.'+RESPONSE_SCALAR,op:'gte',value:1}}))]);
 const borrow=commands[0];assert.equal(borrow.once,true);assert.deepEqual(borrow.effects.filter(e=>e.type==='item').map(e=>[e.actor,e.key,e.amount]),[[neil,NEIL_RESPONSE_CHARM,1],[neil,RESPONSE_CHARM,1]]);assert.equal(borrow.effects.find(e=>e.type==='custody').from,neil);
 const fresh=makePlan(0,0);apply(fresh,borrow.effects);assert.equal(fresh.gameplay.player.inventory[RESPONSE_CHARM],1);assert.equal(fresh.state.simulation.owners[neil][RESPONSE_CHARM]||0,0);assert.equal(fresh.state.simulation.owners[neil][NEIL_RESPONSE_CHARM],1);
 for(const c of commands.slice(1))apply(fresh,c.costs);assert.equal(fresh.gameplay.player.inventory[RESPONSE_CHARM]||0,0);assert.equal(fresh.state.simulation.owners[neil][NEIL_RESPONSE_CHARM]||0,0);assert.ok(fresh.state.simulation.custody[RESPONSE_LOAN_ID]);
 apply(fresh,[responseChoiceActs().bindings[RESPONSE_RELEASE].steps.agree.effects[0]]);assert.equal(fresh.state.simulation.custody[RESPONSE_LOAN_ID],undefined);assert.equal(fresh.state.actors.player.resources.money,40);
 for(const c of commands.slice(1)){assert.equal(c.costs.filter(e=>e.type==='item').length,1);assert.ok(!c.effects.some(e=>e.key===RESPONSE_SCALAR));assert.equal(c.completionRequires.fact,'actor.life');}
});
test('creditor release needs the exact owner and leaves all purses and stocks unchanged; replay fails',()=>{
 const p=makePlan(0,0);normalizeResponseLoanPlan(p);const effect=responseChoiceActs().bindings[RESPONSE_RELEASE].steps.agree.effects[0];
 assert.throws(()=>apply(structuredClone(p),[{...effect,actor:'player'}]),/actual creditor/);
 const owners=JSON.stringify(p.state.simulation.owners),money=JSON.stringify(Object.values(p.state.actors).map(a=>a.resources.money));
 apply(p,[effect]);assert.equal(p.state.simulation.custody[RESPONSE_LOAN_ID],undefined);assert.equal(JSON.stringify(p.state.simulation.owners),owners);assert.equal(JSON.stringify(Object.values(p.state.actors).map(a=>a.resources.money)),money);assert.throws(()=>apply(p,[effect]),/actual creditor/);
 assert.throws(()=>createSimulationRegistry({commands:[{id:'test.bad-release',revision:1,label:'Bad reserve',duration:1,costs:[effect],effects:[]}]}),/Costs must reserve/);
});
test('pending choice decode retains its public command, excluding arbitrary saved effects',()=>{
 const registry={simulation:{commands:new Map()}},state={simulation:{jobs:[{commandId:RESPONSE_RELEASE+'.agree',effects:[{type:'resource',key:'money',amount:9999}]}]}};
 assert.equal(retainResponseChoiceJobs(state,registry),true);const command=registry.simulation.commands.get(RESPONSE_RELEASE+'.agree');assert.ok(command.effects.some(e=>e.operation==='release'));assert.ok(!command.effects.some(e=>e.type==='resource'));
 assert.equal(retainResponseChoiceJobs(state,registry),false);
 assert.equal(retainResponseChoiceJobs({simulation:{jobs:[]}},{get simulation(){throw Error('Empty decode must not reach command compilation.');}}),false);
});
test('all discussion, continuation, in-kind replacement and unused return choices compile with the real lender present',()=>{
 const data=responseChoiceActs(),compiled=withResponseChoiceParticipants(defineLotmActs(data.rows,data.bindings,{worldId:'book.lotm.tingen',actorId:'player',group:'book_lotm',situationId:'book.lotm.tingen.canon_beside'}));
 assert.deepEqual(compiled.unbound,[]);assert.equal(compiled.commands.length,5);
 for(const command of compiled.commands)assert.deepEqual(command.participants,[neil]);
 const effects=data.bindings[RESPONSE_KEEP].steps.agree.effects;assert.ok(effects.every(e=>e.type==='fact'));assert.equal(effects[0].value,'replacement promised');
 assert.equal(data.bindings[RESPONSE_REPLACE].steps.agree.effects[0].replacementKey,CHARM_REPLACEMENT_KEY);
 assert.equal(data.bindings[RESPONSE_RETURN].steps.agree.effects[0].returning,true);assert.ok(!data.bindings[RESPONSE_REBORROW].steps.agree.effects.some(e=>e.type==='item'));
});
