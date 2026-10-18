import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {enrollSimulation,previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {skillExpansionContext} from '../src/skill_expansion_host.js';
import {SKILL_IDS} from '../src/skill_expansion_content.js';

// SLR6 / SLL7: the craftsman's corrections make the same timber drill teach
// two mastery instead of one; the drill limit and stops stay the same.
const LOG=JSON.stringify({id:'Rough wood log'});
const ID=SKILL_IDS.timber, PLAIN='skills.timber.practice', COACHED='skills.timber.coached_practice';
const base=p=>({actorId:'player',external:p.external,gameplay:p.gameplay,
    vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}},
    facts:{location:'Village','village.craftsmanMet':true,'village.craftsmanPresent':true,'village.teacherHours':true,
        'village.craftsmanBusy':false,'village.craftsmanIrritated':false,'body.handsTender':false,'world.workbench.wet':false}});
const ctx=(p,targetId)=>({...skillExpansionContext(p.state,base(p)),...(targetId?{targetId}:{})});
const advance=(p,n)=>{const c=ctx(p);const out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});return {...out,vitals:p.vitals};};
const mastery=p=>p.state.simulation.powers.player[ID].mastery;
// Real route: see the grain, take the paid lesson, then reach the wanted
// mastery through ordinary practice. No hand-written power or source records.
// The one-time village shower soaks the bench; keep it dry as covering would.
const dry=p=>{p.state.worlds['base.frontier'].facts['workbench.wet']=false;return p;};
const run=(p,id)=>advance(commitSimulationCommand(dry(p).state,registry,{id},ctx(p,registry.simulation.commands.get(id).targetId)),4);
function learned(level=0){
    let p={state:initializeExpedition(createExpansionState(23)),external:{money:30},gameplay:{player:{inventory:{[LOG]:12},skills:{Woodworking:{enabled:true,xp:0}},reputation:{Village:0}}}};
    p=enrollSimulation(p.state,registry,base(p));
    p=run(p,'skills.timber.observe');
    p=run(p,'skills.timber.learn');
    for(let n=0;n<level;n++)p=run(p,PLAIN);
    p.state.actors.oldCraftsman.resources.focus=3;
    assert.equal(mastery(p),level);
    return p;
}
test('coached practice teaches two mastery where the same plain drill teaches one',()=>{
    const before=learned(), plain=run(learned(),PLAIN), coached=run(learned(),COACHED);
    assert.equal(mastery(plain),1);
    assert.equal(mastery(coached),2);
    assert.equal(coached.state.actors.oldCraftsman.resources.focus,2,'spends one unit of his actual attention');
    assert.equal(coached.external.money,before.external.money-1,'charges the one-coin fee');
    assert.equal(plain.external.money,before.external.money,'plain practice is free');
});

test('coached practice stops at its limit, without his attention, and refunds on cancel',()=>{
    const limit=dry(learned(3)), why=previewSimulationCommand(limit.state,registry,COACHED,ctx(limit,'oldCraftsman'));
    assert.equal(why.eligible,false);
    assert.equal(previewSimulationCommand(limit.state,registry,PLAIN,ctx(limit)).eligible,true,'plain practice still finishes the drill');
    const tired=learned(); tired.state.actors.oldCraftsman.resources.focus=0;
    assert.equal(previewSimulationCommand(tired.state,registry,COACHED,ctx(tired,'oldCraftsman')).eligible,false);
    let p=learned(); const started=commitSimulationCommand(p.state,registry,{id:COACHED},ctx(p,'oldCraftsman'));
    const job=started.state.simulation.jobs.find(j=>j.commandId===COACHED);
    const cancelled=cancelSimulationJob(started.state,registry,job.id,ctx(started,'oldCraftsman'));
    assert.equal(mastery(cancelled),0,'cancelling teaches nothing');
    assert.equal(cancelled.state.actors.oldCraftsman.resources.focus,3,'attention refunded');
});

test('coached mastery survives a save round trip',()=>{
    const p=run(learned(),COACHED);
    const loaded=loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry);
    assert.equal(loaded.simulation.powers.player[ID].mastery,2);
});
