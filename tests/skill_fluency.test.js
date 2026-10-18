import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {enrollSimulation,previewSimulationCommand,commitSimulationCommand} from '../src/simulation.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {fluencyDuration} from '../src/power_models.js';
import {skillExpansionContext} from '../src/skill_expansion_host.js';
import {SKILL_IDS} from '../src/skill_expansion_content.js';

// SLR5 / SLR34 / SLL11: repeating the timber method makes real cutting faster
// on a falling curve with a floor. Repetitions are the power's executions.
const LOG=JSON.stringify({id:'Rough wood log'}), ID=SKILL_IDS.timber, PACK='skills.timber.pack';
const base=p=>({actorId:'player',external:p.external,gameplay:p.gameplay,
    vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}},
    facts:{location:'Village','village.craftsmanMet':true,'village.craftsmanPresent':true,'village.teacherHours':true,
        'village.craftsmanBusy':false,'village.craftsmanIrritated':false,'body.handsTender':false,'world.workbench.wet':false}});
const ctx=(p,targetId)=>({...skillExpansionContext(p.state,base(p)),...(targetId?{targetId}:{})});
const dry=p=>{p.state.worlds['base.frontier'].facts['workbench.wet']=false;return p;};
const advance=(p,n)=>{const c=ctx(p);return advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});};
const start=(p,id)=>commitSimulationCommand(dry(p).state,registry,{id},ctx(p,registry.simulation.commands.get(id).targetId));
const run=(p,id)=>advance(start(p,id),4);
const power=p=>p.state.simulation.powers.player[ID];
const minutes=p=>previewSimulationCommand(dry(p).state,registry,PACK,ctx(p)).duration;
function learned(){
    let p={state:initializeExpedition(createExpansionState(29)),external:{money:200},gameplay:{player:{inventory:{[LOG]:200},skills:{Woodworking:{enabled:true,xp:0}},reputation:{Village:0}}}};
    p=enrollSimulation(p.state,registry,base(p));
    p=run(p,'skills.timber.observe');p=run(p,'skills.timber.learn');
    return p;
}

test('the curve falls with repetition, never below its floor or above its base',()=>{
    const f={floor:1,halfAt:20}, at=e=>fluencyDuration(3,f,e);
    assert.deepEqual([0,6,7,60,61,10000].map(at),[3,3,2,2,1,1]);
    for(let e=0;e<500;e++)assert.ok(at(e+1)<=at(e),'never slower after more practice');
    assert.equal(fluencyDuration(3,undefined,999),3,'commands without a curve keep their duration');
});

test('real cuts and drills both count, and the job uses the practiced time',()=>{
    let p=learned();
    assert.equal(power(p).executions,0);assert.equal(minutes(p),3);
    for(let n=0;n<4;n++)p=run(p,'skills.timber.practice');
    for(let n=0;n<3;n++)p=run(p,PACK);
    assert.equal(power(p).executions,7,'drills and real cuts are repetitions of one method');
    assert.equal(minutes(p),2);
    const kits=p.gameplay.player.inventory[JSON.stringify({id:'Prepared survey kit'})];
    const started=start(p,PACK), job=started.state.simulation.jobs.find(j=>j.commandId===PACK);
    assert.equal(job.due-started.state.clock,2,'the accepted job finishes in the practiced time');
    const done=advance(started,2);
    assert.equal(done.gameplay.player.inventory[JSON.stringify({id:'Prepared survey kit'})],kits+1,'the faster cut still makes a real kit');
    const loaded={...done,state:loadExpansionState(JSON.parse(JSON.stringify(done.state)),registry)};
    assert.equal(minutes(loaded),2,'practice survives a save round trip');
});

test('long practice reaches the floor; the contract rejects a malformed curve',()=>{
    const p=learned();power(p).executions=61;
    assert.equal(minutes(p),1);
    const pack=structuredClone(registry.simulation.commands.get(PACK)), definitions=fluency=>({
        powers:[structuredClone(registry.simulation.powers.get(ID))],sites:[structuredClone(registry.simulation.sites.get('village.workbench'))],commands:[{...pack,fluency}]});
    assert.doesNotThrow(()=>createSimulationRegistry(definitions({floor:1,halfAt:20})));
    for(const fluency of [{floor:0,halfAt:20},{floor:4,halfAt:20},{floor:1,halfAt:0},{floor:1,halfAt:20,extra:1}])
        assert.throws(()=>createSimulationRegistry(definitions(fluency)),/Invalid command fluency/);
});
