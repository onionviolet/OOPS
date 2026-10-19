import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {enrollSimulation,previewSimulationCommand,commitSimulationCommand} from '../src/simulation.js';
import {skillExpansionContext} from '../src/skill_expansion_host.js';
import {SKILL_IDS} from '../src/skill_expansion_content.js';

// SLL12 (SLR34, SLR29, SLN10), 2026-10-19: plain practice is a plateau, not a
// wall. One mastery per session to four, then a smoothly smaller gain with a
// floor; the drill never refuses for mastery alone and names what teaches more.
const LOG=JSON.stringify({id:'Rough wood log'});
const ID=SKILL_IDS.timber, PLAIN='skills.timber.practice';
const base=p=>({actorId:'player',external:p.external,gameplay:p.gameplay,
    vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}},
    facts:{location:'Village','village.craftsmanMet':true,'village.craftsmanPresent':true,'village.teacherHours':true,
        'village.craftsmanBusy':false,'village.craftsmanIrritated':false,'body.handsTender':false,'world.workbench.wet':false}});
const ctx=(p,targetId)=>({...skillExpansionContext(p.state,base(p)),...(targetId?{targetId}:{})});
const advance=(p,n)=>{const c=ctx(p);const out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});return {...out,vitals:p.vitals};};
const dry=p=>{p.state.worlds['base.frontier'].facts['workbench.wet']=false;return p;};
const run=(p,id)=>advance(commitSimulationCommand(dry(p).state,registry,{id},ctx(p,registry.simulation.commands.get(id).targetId)),4);
const power=p=>p.state.simulation.powers.player[ID];

test('plain practice: one per session to four, then smaller gains with a floor, never a wall', () => {
    let p={state:initializeExpedition(createExpansionState(23)),external:{money:30},gameplay:{player:{inventory:{[LOG]:60},skills:{Woodworking:{enabled:true,xp:0}},reputation:{Village:0}}}};
    p=enrollSimulation(p.state,registry,base(p));
    p=run(p,'skills.timber.observe'); p=run(p,'skills.timber.learn');
    const gains=[];
    for(let n=0;n<30;n++){const before=power(p).mastery; p=run(p,PLAIN); gains.push(power(p).mastery-before);}
    assert.deepEqual(gains.slice(0,5),[1,1,1,1,0.75]);
    for(let n=1;n<gains.length;n++) assert.ok(gains[n]<=gains[n-1]+1e-12,'gains never rise with mastery');
    assert.ok(gains.every(g=>g>=0.125),'never below the floor, never zero');
    assert.equal(gains.at(-1),0.125,'deep practice sits on the floor');
    assert.equal(power(p).executions,30,'each session is a use of the method');
    const preview=previewSimulationCommand(dry(p).state,registry,PLAIN,ctx(p));
    assert.equal(preview.eligible,true,'no mastery wall');
    const text=registry.simulation.commands.get(PLAIN).description;
    assert.match(text,/never below an eighth/);
    assert.match(text,/corrections teach twice as much/,'names the route past the plateau');
    assert.doesNotMatch(text,/drill limit/);
});
