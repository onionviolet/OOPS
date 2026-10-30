import test from 'node:test';
import assert from 'node:assert/strict';
import {freshMemory, readMemories, remember, tellMemory} from '../src/person_memory.js';
import {episodeFromEffect, rememberEffect, derivedBond, reactionLine, gossipStep, memoryForPlan} from '../src/person_memory_effects.js';
const effect = {holder:'person.a',subject:'person.b',cause:'action.1',axis:'trust',amount:3,text:'Supplied the agreed materials.'};
const make = (e=effect,day=1) => rememberEffect(freshMemory(),e,day);

test('one cause becomes one episode; mirrored stored axes are counted once and fade without writes',()=>{
 const memory=make(), before=structuredClone(memory);
 assert.deepEqual(rememberEffect(memory,effect,1),memory);
 assert.equal(readMemories(memory,'person.a',1).length,1);
 assert.equal(derivedBond({memory,holder:'person.a',subject:'person.b',axis:'trust',baseline:5,day:1}),5);
 assert.ok(derivedBond({memory,holder:'person.a',subject:'person.b',axis:'trust',baseline:5,day:1000})<3);
 assert.deepEqual(memory,before);
 assert.equal(rememberEffect(memory,{...effect,amount:0},1),memory);
 assert.equal(episodeFromEffect({...effect,amount:-2,day:1}).kind,'harmed');
});
test('reaction names the episode, uses no numbers, fades and is empty without a memory',()=>{
 const args={memory:make(),holder:'person.a',subject:'person.b',day:1,root:37,baseline:{trust:3}};
 assert.match(reactionLine(args),/since you supplied the agreed materials/);
 assert.doesNotMatch(reactionLine(args),/\d/);
 assert.equal(reactionLine(args),reactionLine(args));
 assert.equal(reactionLine({...args,day:10000}),'');
 assert.equal(reactionLine({...args,memory:freshMemory()}),'');
 const harm={...effect,amount:-2,text:'Interrupted him while he was counting fittings. He asked for quiet.'};
 assert.match(reactionLine({...args,memory:make(harm),baseline:{trust:-2}}),/Wary|Cooler/);
});
test('non-player gossip copies once per day along a living co-present bond and loses certainty',()=>{
 const simulation={seed:37,people:{'person.a':{life:'alive',location:'bench'},'person.c':{life:'alive',location:'bench'}},
  relationships:{'person.a':{'person.c':{axes:{trust:2}}}},causes:{}};
 const actors={'person.a':{worldId:'world.a'},'person.c':{worldId:'world.a'}};
 const args={memory:make(),simulation,actors,day:1,root:37};
 const out=gossipStep(args), heard=readMemories(out.memory,'person.c',1)[0];
 assert.deepEqual(heard.source,{teller:'person.a'}); assert.equal(heard.certainty,80);
 assert.deepEqual(gossipStep({...args,memory:out.memory,simulation:{...simulation,causes:out.causes}}),out);
 assert.deepEqual(gossipStep({...args,simulation:{...simulation,relationships:{}}}).memory,args.memory);
 assert.deepEqual(gossipStep({...args,actors:{...actors,'person.c':{worldId:'world.b'}}}).memory,args.memory);
 assert.deepEqual(gossipStep({...args,simulation:{...simulation,people:{...simulation.people,'person.c':{life:'alive',location:'away'}}}}).memory,args.memory);
 assert.equal(derivedBond({memory:out.memory,holder:'person.c',subject:'person.b',axis:'trust',day:1}),3);
 const twice=tellMemory(heard,'person.c',1); assert.ok(twice.certainty<=heard.certainty);
 const memory=remember(out.memory,'person.d',twice,1); assert.equal(readMemories(memory,'person.d',1)[0].certainty,60);
});
test('plan preparation is detached and old absent slices yield no reactions',()=>{
 const plan={state:{clock:0,actors:{}},memoryEffects:[{...effect,clock:0}]}, before=structuredClone(plan);
 const out=memoryForPlan({plan,day:5}); assert.equal(readMemories(out.memory,'person.a',5)[0].day,5);
 assert.deepEqual(plan,before);
 assert.equal(reactionLine({holder:'person.a',subject:'person.b',day:5}),'');
});
