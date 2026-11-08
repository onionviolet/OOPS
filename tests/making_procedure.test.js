import test from 'node:test';
import assert from 'node:assert/strict';
import {compileProcedure,procedureStepKey} from '../src/making_procedure.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {commitSimulationCommand,previewSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
import {MAKING_TRAITS} from '../src/making_traits.js';
import {TagRegistry,tagFacts} from '../src/tag_store.js';
import {defineCatalogue,materialTags} from '../src/craft_materials.js';
import {HP_LEAD_MAKING} from '../src/hp_lead_making.js';
import {SEER_BREW_CATALOGUE} from '../src/lotm_seer_brew.js';
import {defineRitual,ritualDial,gradeRitual} from '../src/ritual_conditions.js';
const key=id=>JSON.stringify({id}), ingredient=key('procedure.fixture.leaf'),product=key('procedure.fixture.cup');
const command={id:'procedure.fixture.brew',revision:1,label:'Brew the cup',actorId:'player',worldId:I.world,group:'book_lotm',location:'fixture.room',duration:6,
 costs:[{type:'item',actor:'player',key:ingredient,amount:-1}],effects:[{type:'item',actor:'player',key:product,amount:1}]};
const spec={steps:[{id:'heat',label:'Warm the liquid',minutes:2},{id:'cool',label:'Let the liquid cool',minutes:2,condition:{fact:'actor.fixture.fireOut',op:'eq',value:true,reason:'Put the fire out first.'}},
 {id:'finish',label:'Finish the cup with a witness',minutes:2,agents:[{id:I.supervisor,role:'witness'}]}]};
const commands=compileProcedure(command,spec);
const defs=createSimulationRegistry({commands});for(const [id,d] of defs.commands)registry.simulation.commands.set(id,d);
const start=(p,i)=>({...p,...commitSimulationCommand(p.state,registry,{id:commands[i].id},ctx(p),p.state.sequence)});
const eligible=(p,i)=>previewSimulationCommand(p.state,registry,commands[i].id,ctx(p)).eligible;
function setup(){const p=fresh();p.state.simulation.people.player.location='fixture.room';p.state.simulation.people[I.supervisor].location='fixture.room';p.gameplay.player.inventory[ingredient]=2;return p;}

test('ordered work uses native time and stock, condition gates and participant support',()=>{
 let p=setup();assert.equal(eligible(p,1),false);assert.equal(eligible(p,2),false);
 p=start(p,0);assert.equal(p.gameplay.player.inventory[ingredient],1);assert.equal(p.gameplay.player.inventory[product],undefined);
 p=wait(p,1);assert.equal(eligible(p,1),false);p=wait(p,1);
 assert.equal(p.state.actors.player.facts[procedureStepKey(command.id)],1);assert.equal(eligible(p,1),false);
 p.state.actors.player.facts['fixture.fireOut']=true;p=wait(start(p,1),2);
 p.state.simulation.people[I.supervisor].location='fixture.away';assert.equal(eligible(p,2),false);assert.throws(()=>start(p,2));
 p.state.simulation.people[I.supervisor].location='fixture.room';p=wait(start(p,2),2);
 assert.equal(p.gameplay.player.inventory[product],1);assert.equal(p.state.actors.player.facts[procedureStepKey(command.id)],0);
 assert.equal(eligible(p,2),false,'final cannot be repeated without starting a new preparation');
});

test('cancel and loss of support retain completed work, refund only current reservations and retry safely after JSON reload',()=>{
 let p=setup();p=wait(start(p,0),2);p.state.actors.player.facts['fixture.fireOut']=true;
 p=start(p,1);p={...p,...cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,ctx(p),p.state.sequence)};
 assert.equal(p.state.actors.player.facts[procedureStepKey(command.id)],1);assert.equal(p.gameplay.player.inventory[ingredient],1);
 p=JSON.parse(JSON.stringify(p));assert.equal(eligible(p,1),true);
 p=start(p,1);p.state.actors.player.facts['fixture.fireOut']=false;p=wait(p,2);
 assert.equal(p.state.actors.player.facts[procedureStepKey(command.id)],1);assert.equal(p.gameplay.player.inventory[product],undefined);
 p.state.actors.player.facts['fixture.fireOut']=true;p=wait(start(p,1),2);p=start(p,2);
 p=JSON.parse(JSON.stringify(p));assert.equal(p.state.simulation.jobs[0].completionSupport.coLocated,true);
 p.state.simulation.people[I.supervisor].location='fixture.away';p=wait(p,2);
 assert.equal(p.state.actors.player.facts[procedureStepKey(command.id)],2);assert.equal(p.gameplay.player.inventory[product],undefined);
 p.state.simulation.people[I.supervisor].location='fixture.room';p=wait(start(p,2),2);assert.equal(p.gameplay.player.inventory[product],1);
});

test('restarting spends new stock and no intermediate step awards a product',()=>{
 let p=wait(start(setup(),0),2);p=wait(start(p,0),2);
 assert.equal(p.gameplay.player.inventory[ingredient],undefined);assert.equal(p.gameplay.player.inventory[product],undefined);
 assert.equal(p.state.actors.player.facts[procedureStepKey(command.id)],1);
 for(const bad of [s=>s.steps[0].minutes=1,s=>s.steps[1].id='heat',s=>s.steps[2].agents[0].role='imaginary']){const s=structuredClone(spec);bad(s);assert.throws(()=>compileProcedure(command,s));}
});

test('world catalogues share trait vocabulary while hidden functional truth needs an observer',()=>{
 const hp=defineCatalogue(HP_LEAD_MAKING.catalogue),quills=hp.materials['Porcupine quills'];
 assert.ok(materialTags(hp,quills).has('material.animal'));
 assert.ok(materialTags(SEER_BREW_CATALOGUE,SEER_BREW_CATALOGUE.materials['Star Crystal']).has('function.binding'));
 const registry=new TagRegistry(MAKING_TRAITS),entity={registry,tags:quills.tags};
 assert.equal(tagFacts(entity)['actor.tag.function.heat_reactive'],undefined);
 assert.equal(tagFacts(entity,{tags:['function.heat_reactive']})['actor.tag.function.heat_reactive'],true);
});

test('procedure conditions reuse ritual grading including substitutes, without a second rule language',()=>{
 const ritual=defineRitual({id:'fixture.rite',world:'fixture.world',formula:'fixture.formula',scale:'solitary',label:'Attend the rite',conditions:[{id:'witness',label:'A witness',principle:{id:'presence',text:'Someone sees the work.',wants:{physical:['presence']}},exact:{rule:{fact:'witness',op:'eq',value:true},text:'A witness attends.'},substitutes:[{id:'mirror',rule:{fact:'mirror',op:'eq',value:true},tags:{physical:['presence']},text:'A prepared mirror carries the view.'}]}]});
 assert.equal(gradeRitual(ritual,{mirror:true},ritualDial('fixture.world')).grade,'substituted');
});

test('a remote answerer uses its contact owner, not invented physical co-location, and contact loss interrupts',()=>{
 const remote={...command,id:'procedure.fixture.remote',duration:4};
 const rows=compileProcedure(remote,{steps:[{id:'prepare',label:'Prepare the contact',minutes:2},
  {id:'answer',label:'Wait for the answer',minutes:2,agents:[{id:I.supervisor,role:'answerer',mode:'remote',requires:{fact:'actor.fixture.remote.ready',op:'eq',value:true,reason:'Establish the contact first.'}}]}]});
 const defs=createSimulationRegistry({commands:rows});for(const [id,d]of defs.commands)registry.simulation.commands.set(id,d);
 let p=setup();p.state.simulation.people[I.supervisor].location='fixture.away';
 const commit=(p,c)=>({...p,...commitSimulationCommand(p.state,registry,{id:c.id},ctx(p),p.state.sequence)});
 p=wait(commit(p,rows[0]),2);
 assert.equal(previewSimulationCommand(p.state,registry,rows[1].id,ctx(p)).eligible,false);
 p.state.actors.player.facts['fixture.remote.ready']=true;p=commit(p,rows[1]);
 assert.ok(!(p.state.simulation.jobs[0].participants||[]).includes(I.supervisor));
 p.state.actors.player.facts['fixture.remote.ready']=false;p=wait(p,2);
 assert.equal(p.gameplay.player.inventory[product],undefined);
 p.state.actors.player.facts['fixture.remote.ready']=true;p=wait(commit(p,rows[1]),2);
 assert.equal(p.gameplay.player.inventory[product],1);
});
