import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {MEMORY_LIMITS, MEMORY_NUMBER_REASONS, TRAIT_TEMPERAMENTS, temperamentFromTraits, createTemperamentPort, memoryLimits} from '../src/person_temperament.js';
import {freshMemory, remember, encodeMemory, decodeMemory, vividness, recallMemory, migrateMemory, MEMORY_KINDS, readMemories} from '../src/person_memory.js';
import {rememberEffect, derivedBond, reactionLine, gossipStep, observedMemoryTraits, revengeStub} from '../src/person_memory_effects.js';
const harm={holder:'person.a',subject:'person.x',cause:'hurt',axis:'respect',amount:-1,text:'Interrupted him while he was counting fittings. He asked for quiet.'};
const repair={...harm,cause:'repair',amount:1,text:'Apologized for the interruption and supplied an actual log for later work.'};
const port=words=>createTemperamentPort(()=>({traits:words}));
const history=(holder='person.a',amends=false)=>{
 let memory=rememberEffect(freshMemory(),{...harm,holder},0);
 if(amends) memory=rememberEffect(memory,{...repair,holder},1);
 return memory;
};
function targets(limits=MEMORY_LIMITS,registry=TRAIT_TEMPERAMENTS) {
 const tune=words=>createTemperamentPort(()=>({traits:words}),registry);
 const memory=history(), fixed=history('person.a',true);
 const args={memory,holder:'person.a',subject:'person.x',axis:'respect',baseline:-1,day:180,limits};
 const a=derivedBond({...args,temperamentOf:tune(['grudging'])});
 const b=derivedBond({...args,memory:fixed,baseline:0,day:30,temperamentOf:tune(['forgiving'])});
 const helped={kind:'helped',about:'person.x',fact:'f',source:'saw',certainty:100,feeling:1,day:0,count:1};
 return {grudgeCold180:a< -limits.reactionVividness, forgivenWarm30:b>0,
  loyalHelpYears:vividness(helped,730,temperamentFromTraits(['loyal'],registry),limits)>limits.reactionVividness,
  ungratefulHelpDays:vividness(helped,30,temperamentFromTraits(['ungrateful'],registry),limits)<limits.reactionVividness};
}
test('targets: cold after 180 days; warm within 30 days of amends; gratitude years versus days, replayable for two non-player holders',()=>{
 assert.ok(Object.values(targets()).every(Boolean));
 for(const holder of ['person.a','person.b']) {
  const memory=history(holder,true), before=structuredClone(memory);
  const args={memory,holder,subject:'person.x',day:30,baseline:{respect:0},root:37};
  const grudging=reactionLine({...args,temperamentOf:port(['grudging'])});
  const forgiving=reactionLine({...args,temperamentOf:port(['forgiving'])});
  assert.notEqual(grudging,forgiving); assert.equal(forgiving,reactionLine({...args,temperamentOf:port(['forgiving'])}));
  assert.equal(readMemories(memory,holder,30).filter(e=>e.kind==='harmed').length,1);
  assert.deepEqual(memory,before);
 }
 assert.deepEqual(observedMemoryTraits({memory:history(),holder:'person.a',subject:'person.x',day:0,traits:['grudging'],temperamentOf:port(['grudging'])}),[]);
 assert.deepEqual(observedMemoryTraits({memory:history(),holder:'person.a',subject:'person.x',day:180,traits:['grudging'],temperamentOf:port(['grudging'])}),['grudging']);
 assert.deepEqual(observedMemoryTraits({memory:history('person.a',true),holder:'person.a',subject:'person.x',day:30,traits:['forgiving'],temperamentOf:port(['forgiving'])}),['forgiving']);
 assert.equal(revengeStub({memory:history(),holder:'person.a',subject:'person.x',day:180,temperamentOf:port(['grudging'])}).pending,true);
});
test('every trait has a reason and changes a consumed dial; unknown words keep defaults; recall is keyed and trait-shaped',()=>{
 const base=temperamentFromTraits();
 for(const [word,row] of Object.entries(TRAIT_TEMPERAMENTS)) {
  assert.ok(row.reason); const t=temperamentFromTraits([word]);
  assert.ok(Object.keys(row).some(key=>key!=='reason'&&t[key]!==base[key]),word);
 }
 assert.deepEqual(temperamentFromTraits(['unknown','constructor','toString']),base);
 const memory=readMemories(history(),'person.a',10)[0];
 const args={holder:'person.a',memory,cue:{id:'cue',person:true,place:false,topic:false},period:{day:10},day:10,
  drawAddress:{root:37,worldId:'fixture',lifeId:'fixture',gameTime:14400,eventId:'recall'}};
 const a=recallMemory({...args,temperament:temperamentFromTraits(['grudging'])});
 const b=recallMemory({...args,temperament:temperamentFromTraits(['forgiving'])});
 assert.notDeepEqual(a,b); assert.deepEqual(a,recallMemory({...args,temperament:temperamentFromTraits(['grudging'])}));
});
test('amends append leaves old tuples unchanged; a world override folds or forgets at the next write',()=>{
 assert.equal(MEMORY_KINDS.indexOf('impression'),5); assert.equal(MEMORY_KINDS.indexOf('amends'),6);
 const old=structuredClone(history()); delete old.tables;
 assert.deepEqual(migrateMemory(old,0),old);
 let memory=freshMemory();
 for(let i=0;i<8;i++) memory=rememberEffect(memory,{...harm,cause:'h'+i,subject:'p'+i},0);
 const limits=memoryLimits('small', {small:{id:'memory.small',revision:1,episodes:3,holders:1,bytes:10000}});
 const reduced=remember(memory,'person.a',{kind:'helped',about:'new',fact:'new',source:'saw',certainty:100,feeling:100,day:0},0,limits);
 assert.equal(decodeMemory(reduced,0,limits)['person.a'].length,3);
 assert.ok(decodeMemory(reduced,0,limits)['person.a'].some(e=>e.about==='new'));
 assert.deepEqual(reduced.tables,['memory.small@1','memory.temperament@1']);
 assert.throws(()=>decodeMemory(reduced,0),/revision/);
 const bad=structuredClone(old); bad.tables=['memory.limits@99','memory.temperament@1'];
 assert.throws(()=>migrateMemory(bad,0),/revision/);
 assert.throws(()=>memoryLimits('x',{x:{episodes:0}}));
 assert.throws(()=>memoryLimits('x',{x:{id:'memory.limits',revision:1,episodes:20}}),/new id@rev/);
});
test('gossip temperament affects telling frequency, slant, certainty and listener trust, with deterministic daily receipts',()=>{
 const people=Object.fromEntries(['person.a','person.b','person.c'].map(id=>[id,{life:'alive',location:'bench'}]));
 const simulation={people,relationships:{'person.a':{'person.b':{axes:{trust:1}},'person.c':{axes:{trust:1}}}},causes:{}};
 const actors=Object.fromEntries(Object.keys(people).map(id=>[id,{worldId:'w'}]));
 const memory=rememberEffect(freshMemory(),{...harm,amount:-4},0);
 const count=traits=>Array.from({length:30},(_,day)=>gossipStep({memory,simulation,actors,day,root:37,temperamentOf:port(traits)})).filter(out=>Object.keys(out.memory.holders).length>1).length;
 assert.ok(count(['sociable'])>count(['reserved']));
 const args={memory,simulation,actors,day:0,root:37,temperamentOf:id=>temperamentFromTraits(id==='person.a'?['unreliable']:['sceptical'])};
 const out=gossipStep(args), heard=Object.entries(decodeMemory(out.memory,0)).find(([id])=>id!=='person.a')[1][0];
 assert.equal(heard.feeling,-6); assert.equal(heard.certainty,40);
 assert.deepEqual(out,gossipStep(args));
 assert.deepEqual(gossipStep({...args,memory:out.memory,simulation:{...simulation,causes:out.causes}}),out);
});
test('each limits-table number plus or minus 25 percent: record target sensitivity',t=>{
 const results=[];
 for(const key of Object.keys(MEMORY_NUMBER_REASONS)) for(const factor of [0.75,1.25]) {
  const value=MEMORY_LIMITS[key]*factor;
  const result=targets({...MEMORY_LIMITS,[key]:value});
  results.push(`${key} ${factor}: ${Object.entries(result).filter(([,pass])=>!pass).map(([id])=>id).join(',')||'none'}`);
 }
 for(const [word,row] of Object.entries(TRAIT_TEMPERAMENTS)) for(const [key,value] of Object.entries(row)) if(key!=='reason') for(const factor of [0.75,1.25]) {
  const result=targets(MEMORY_LIMITS,{...TRAIT_TEMPERAMENTS,[word]:{...row,[key]:value*factor}});
  results.push(`${word}.${key} ${factor}: ${Object.entries(result).filter(([,pass])=>!pass).map(([id])=>id).join(',')||'none'}`);
 }
 t.diagnostic('Broken targets: '+results.join('; '));
 assert.ok(Object.values(targets()).every(Boolean));
});
test('300 holders at table caps: derive every represented bond under 50 ms (measured cold and warm)',t=>{
 const holders={};
 for(let h=0;h<MEMORY_LIMITS.holders;h++) holders['p'+h]=Array.from({length:MEMORY_LIMITS.episodes},(_,i)=>({kind:'helped',about:'p'+((h+i)%MEMORY_LIMITS.holders),fact:`fx1|trust|1|helped|x|${i}`,source:'saw',certainty:100,feeling:1,day:0,count:1}));
 const memory=encodeMemory(holders,0);
 const run=()=>{const start=performance.now(),cpu=process.cpuUsage();for(let h=0;h<MEMORY_LIMITS.holders;h++)for(let i=0;i<MEMORY_LIMITS.episodes;i++)assert.ok(derivedBond({memory,holder:'p'+h,subject:'p'+((h+i)%MEMORY_LIMITS.holders),axis:'trust',day:1})>0);const spent=process.cpuUsage(cpu); return {wall:performance.now()-start,cpu:(spent.user+spent.system)/1000};};
 const cold=run(),warm=run();
 t.diagnostic(`all ${MEMORY_LIMITS.holders*MEMORY_LIMITS.episodes} bonds: cold ${cold.wall.toFixed(2)} ms wall / ${cold.cpu.toFixed(2)} ms CPU; cached ${warm.wall.toFixed(2)} ms wall / ${warm.cpu.toFixed(2)} ms CPU; budget 50 ms CPU`);
 assert.ok(warm.cpu<50,`cached ${warm.cpu} ms CPU (${warm.wall} ms wall)`);
});

test('distinct opaque effect causes do not collapse, and pre-MR3 marker tokens retain their old read',()=>{
 let memory=rememberEffect(freshMemory(),harm,0);
 memory=rememberEffect(memory,{...harm,cause:'second'},0);
 assert.equal(readMemories(memory,'person.a',0).length,2);
 const old={kind:'harmed',about:'person.x',fact:'fx1|respect|-1|interruption|[object Object]|[object Object]',source:'saw',certainty:100,feeling:-1,day:0};
 const legacy=remember(freshMemory(),'person.a',old,0);
 assert.equal(derivedBond({memory:legacy,holder:'person.a',subject:'person.x',axis:'respect',baseline:-1,day:0}),-1);
});

test('large native calendar does not make fresh fractional-half-life harm weaker than a fresh favour',()=>{
 const day=360000;
 const e={kind:'harmed',about:'person.x',fact:'fact',source:'saw',certainty:100,feeling:-1,day,count:1};
 assert.equal(vividness(e,day,temperamentFromTraits(['forgiving'])),1);
 let memory=rememberEffect(freshMemory(),{...harm,amount:1,cause:'habits',axis:'familiarity',text:'Asked how he prefers to work.'},day);
 memory=rememberEffect(memory,harm,day);
 assert.match(reactionLine({memory,holder:'person.a',subject:'person.x',day,temperamentOf:port(['forgiving']),baseline:{familiarity:1,respect:-1}}),/Wary|Cooler/);
});
