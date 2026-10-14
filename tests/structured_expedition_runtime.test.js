import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,createContentRegistry,loadExpansionState} from '../src/expansion_engine.js';
import {enrollSimulation,commitSimulationCommand,advanceSimulationBoundary,previewSimulationCommand} from '../src/simulation.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {compileStructuredExpeditions,validateStructuredExpeditionDefinition,previewStructuredExpeditions} from '../src/structured_expedition_runtime.js';
const eq=(fact,value)=>({fact,op:'eq',value});
const fact=(key,value)=>({type:'fact',scope:'actor',key,value});
const phase='trial.site.phase',injury='trial.site.injury';
const make=(name,from,to,effects=[],extra={})=>({id:'trial.'+name,revision:1,label:name,description:name,actorId:'player',worldId:'trial.world',location:'trial.camp',duration:1,cancellation:'refund',visibleWhen:{any:from.map(v=>eq('actor.'+phase,v))},requires:{all:[{any:from.map(v=>eq('actor.'+phase,v))},eq('native.alive',true)]},costs:[],effects:[...(to==null?[]:[fact(phase,to)]),...effects],...extra});
function definition(){
 const commands=[
  make('prepare',[0,4],1,[],{requires:{all:[{any:[eq('actor.'+phase,0),eq('actor.'+phase,4)]},eq('actor.'+injury,0),eq('native.alive',true)]},costs:[{type:'resource',key:'trial.supplies',amount:-1}]}),
  make('enter',[1],2),
  make('method',[2],3,[],{costs:[{type:'resource',key:'trial.supplies',amount:-1}],requires:{all:[eq('actor.'+phase,2),eq('faculty.trial.method.active',true),eq('native.alive',true)]}}),
  make('gear',[2],3,[fact(injury,1),{type:'vital',key:'health',amount:-2}],{costs:[{type:'resource',key:'trial.supplies',amount:-1}]}),
  make('retreat',[2,3],4),
  make('extract',[3],4,[{type:'resource',native:true,key:'money',amount:4}],{}),
  make('treat',[4],null,[fact(injury,0),{type:'vital',key:'health',amount:2}],{costs:[{type:'resource',key:'trial.supplies',amount:-1}]}),
  make('fatal',[2],5,[{type:'life',status:'dead',reason:'Chose a clearly marked lethal passage.',lethal:true}],{label:'Continue into fatal passage',description:'This passage causes true death and ends this life.'})
 ];
 return {id:'trial',world:{id:'trial.world'},locations:[{id:'trial.camp'}],simulation:{commands},expeditions:[{id:'trial.site',label:'Training site',phaseKey:phase,injuryKey:injury,knowledgeKey:'trial.site.known',locationIds:['trial.camp'],prepareId:'trial.prepare',enterId:'trial.enter',approaches:['trial.method','trial.gear'],retreatId:'trial.retreat',extractId:'trial.extract',treatmentId:'trial.treat',lethalId:'trial.fatal'}]};
}
function setup(){
 const d=definition();d.simulation.commands=compileStructuredExpeditions(d).commands;validateStructuredExpeditionDefinition(d);
 const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'},{id:'trial.world',label:'Trial'}],sources:[{id:'trial.method',revision:1,label:'Acquired workshop method',kind:'knowledge',grants:[]}],simulation:d.simulation});
 const context={actorId:'player',registry,external:{money:1},gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:10,max_health:10,stamina:10,max_stamina:10}},facts:{location:'trial.camp'},nativeAlive:true,nativeBody:{form:'human',mobile:true},busy:false};
 const p=enrollSimulation(createExpansionState(91),registry,context);p.state.actors.player.worldId='trial.world';p.state.worlds['trial.world']={facts:{},resources:{},completed:{}};
 p.state.actors.player.facts={[phase]:0,[injury]:0};p.state.actors.player.resources={'trial.supplies':10};p.state.simulation.people.player.location='trial.camp';
 p.state.simulation.knowledge.player={'trial.site.known':{stage:'seen',value:'A known place.',at:0,cause:'setup'}};
 const ctx=p=>({...context,external:p.external,gameplay:p.gameplay,vitals:p.vitals,nativeAlive:p.vitals.player.health>0&&p.state.simulation.people.player.life==='alive'});
 const start=(p,id)=>commitSimulationCommand(p.state,registry,{id:'trial.'+id},ctx(p));
 const finish=p=>{const out=structuredClone(p);out.state.clock++;advanceSimulationBoundary(out,registry,{player:ctx(p)});return out;};
 const run=(p,id)=>finish(start(p,id));
 return {d,registry,p,ctx,start,finish,run};
}

test('metadata rejects unearned reward, phase skips and implicit resurrection',()=>{
 for(const edit of [d=>{d.simulation.commands[0].requires=eq('native.alive',true);},d=>{d.simulation.commands[5].once=true;},d=>{d.simulation.commands[7].label='Keep walking';},d=>{d.simulation.commands[6].effects.push({type:'life',status:'alive',reason:'free resurrection'});}]){const d=definition();edit(d);assert.throws(()=>compileStructuredExpeditions(d));}
});
test('prepare, gear obstacle, extraction and treatment use shared durable owners',()=>{
 const f=setup();let p=f.p;
 assert.throws(()=>f.start(p,'extract'));
 p=f.run(p,'prepare');p=f.run(p,'enter');assert.throws(()=>f.start(p,'method'));
 p=f.run(p,'gear');assert.equal(p.vitals.player.health,8);assert.equal(p.state.actors.player.facts[injury],1);
 p=f.run(p,'extract');assert.equal(p.external.money,5);assert.throws(()=>f.start(p,'extract'));assert.equal(p.state.actors.player.completed['trial.extract'],1);
 assert.throws(()=>f.start(p,'prepare'));p=f.run(p,'treat');assert.equal(p.vitals.player.health,10);
 p=f.run(p,'prepare');p=f.run(p,'enter');p=f.run(p,'gear');p=f.run(p,'extract');assert.equal(p.external.money,9);assert.equal(p.state.actors.player.completed['trial.extract'],2);assert.throws(()=>f.start(p,'extract'));
 assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(p.state)),f.registry),p.state);
});
test('retreat earns no reward; lethal choice records true death and prevents more actions',()=>{
 const f=setup();let p=f.run(f.run(f.p,'prepare'),'enter');
 const retreated=f.run(p,'retreat');assert.equal(retreated.external.money,1);
 p=f.run(p,'fatal');assert.equal(p.state.simulation.people.player.life,'dead');assert.equal(p.state.actors.player.facts[phase],5);
 assert.throws(()=>f.start(p,'treat'));assert.throws(()=>f.start(p,'prepare'));
 assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(p.state)),f.registry),p.state);
});
test('unknown sites and private outcome effects are absent from actor view',()=>{
 const f=setup(),view=previewStructuredExpeditions(f.p.state,f.d,f.ctx(f.p));assert.equal(view[0].phase,'idle');
 assert.equal(JSON.stringify(view).includes('Chose a clearly marked'),false);assert.equal(JSON.stringify(view).includes('effects'),false);
 delete f.p.state.simulation.knowledge.player['trial.site.known'];assert.deepEqual(previewStructuredExpeditions(f.p.state,f.d,f.ctx(f.p)),[]);
});
test('failed durable save preserves live supplies and outcome; stored pending job reloads unchanged',()=>{
 const f=setup(),before=structuredClone(f.p),pending=f.start(f.p,'prepare');
 const save=JSON.stringify({character:{money:1},expansion:f.p.state,inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}}});
 const options={createSave:()=>save,key:'synthetic',bindings:{player:{category:'person',id:'main_character'}},storage:{setItem(){throw Error('quota');}}};
 assert.throws(()=>persistExpansionPlan(pending,options),/quota/);assert.deepEqual(f.p,before);
 let bytes;persistExpansionPlan(pending,{...options,storage:{setItem(k,v){bytes=v;}}});
 const restored=loadExpansionState(JSON.parse(bytes).expansion,f.registry);assert.deepEqual(restored,pending.state);
 const a=f.finish(pending),b=f.finish({...pending,state:restored});assert.deepEqual(a,b);assert.equal(a.state.actors.player.resources['trial.supplies'],9);
});

test('held active means resolve the obstacle without mundane injury; unconsciousness is not death',()=>{
 const f=setup();let p=f.run(f.run(f.p,'prepare'),'enter');
 p.state.actors.player.sources['trial.method']={origin:'trained',acquiredAt:0,receiptId:'setup'};
 p.state.simulation.faculties.player={'trial.method':{awakened:true,active:true,suppressed:false,development:1}};
 p=f.run(p,'method');assert.equal(p.vitals.player.health,10);assert.equal(p.state.actors.player.facts[injury],0);
 const unconscious=structuredClone(f.p);unconscious.vitals.player.health=0;
 assert.equal(unconscious.state.simulation.people.player.life,'alive');assert.throws(()=>f.start(unconscious,'prepare'));
});

test('compiled discovery gates protect the actual ordinary command list',()=>{
 const f=setup(),original=definition(),before=structuredClone(original);
 compileStructuredExpeditions(original);assert.deepEqual(original,before);
 delete f.p.state.simulation.knowledge.player['trial.site.known'];
 const quote=previewSimulationCommand(f.p.state,f.registry,'trial.prepare',f.ctx(f.p));
 assert.equal(quote.visible,false);assert.equal(quote.eligible,false);assert.throws(()=>f.start(f.p,'prepare'));
 const without=structuredClone(f.d);without.simulation.commands[0].visibleWhen=eq('actor.'+phase,0);
 assert.throws(()=>validateStructuredExpeditionDefinition(without),/discovery/);
});

test('treatment and lethal settlement require the acting player beneficiary',()=>{
 for(const role of ['trial.treat','trial.fatal']) {
  const d=definition(),c=d.simulation.commands.find(c=>c.id===role);
  const e=c.effects.find(e=>role==='trial.treat'?e.type==='vital':e.type==='life');e.actor='trial.other';
  assert.throws(()=>compileStructuredExpeditions(d));
 }
});

test('source loss during a paid method job rechecks support and refunds without settlement',()=>{
 const f=setup();let p=f.run(f.run(f.p,'prepare'),'enter');
 p.state.actors.player.sources['trial.method']={origin:'trained',acquiredAt:0,receiptId:'setup'};p.state.simulation.faculties.player={'trial.method':{awakened:true,active:true,suppressed:false,development:1}};
 const supplies=p.state.actors.player.resources['trial.supplies'];p=f.start(p,'method');assert.equal(p.state.actors.player.resources['trial.supplies'],supplies-1);delete p.state.actors.player.sources['trial.method'];delete p.state.simulation.faculties.player['trial.method'];p=f.finish(p);assert.equal(p.state.actors.player.facts[phase],2);assert.equal(p.state.actors.player.completed['trial.method'],undefined);assert.equal(p.state.actors.player.resources['trial.supplies'],supplies);
});
import {outingPack} from './fixtures/air-wider/outing_pack.js';
import {compileStructuredPack} from '../src/structured_pack_definitions.js';
test('full registry has held discovery and completion gates; lethal metadata is optional; old absent definition unchanged',()=>{
 const raw=outingPack(),before=structuredClone(raw),compiled=compileStructuredPack(raw);assert.deepEqual(raw,before);
 assert(JSON.stringify(compiled.registry.simulation.commands.get('outingproof.prepare').requires).includes('knowledge.outingproof.site.known.seen'));
 assert(JSON.stringify(compiled.registry.simulation.commands.get('outingproof.method').completionRequires).includes('faculty.outingproof.hand.active'));
 for(const edit of [d=>d.expeditions=null,d=>d.expeditions[0].unsupported=true,d=>d.simulation.commands.find(c=>c.id==='outingproof.extract').once=true]){const d=outingPack();edit(d);assert.throws(()=>compileStructuredPack(d));}
 delete raw.expeditions;delete raw.abilities;assert.equal(JSON.stringify(compileStructuredPack(raw).definition),JSON.stringify(raw));
});

test('loss of held discovery refunds a pending preparation without changing phase',()=>{const f=setup();let p=f.start(f.p,'prepare');delete p.state.simulation.knowledge.player['trial.site.known'];p=f.finish(p);assert.equal(p.state.actors.player.resources['trial.supplies'],10);assert.equal(p.state.actors.player.facts[phase],0);});
