import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {enrollSimulation,commitSimulationCommand} from '../src/simulation.js';
import {skillExpansionContext,skillExpansionPresentation} from '../src/skill_expansion_host.js';
import {SKILL_IDS} from '../src/skill_expansion_content.js';

// RC8 (PIR9, SLR29), 2026-10-19: a disabled practice button names the requirement that failed when
// its author wrote player text for it. Private causes (the craftsman's attention) keep the generic line.
const LOG=JSON.stringify({id:'Rough wood log'}), GENERIC='Current preparation, access or agreed attention does not support this action.';
const facts={location:'Village','village.craftsmanMet':true,'village.craftsmanPresent':true,'village.teacherHours':true,
    'village.craftsmanBusy':false,'village.craftsmanIrritated':false,'body.handsTender':false,'world.workbench.wet':false};
const base=(p,extra={})=>({actorId:'player',external:p.external,gameplay:p.gameplay,
    vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}},facts:{...facts,...extra}});
const ctx=(p,targetId)=>({...skillExpansionContext(p.state,base(p)),...(targetId?{targetId}:{})});
const advance=(p,n)=>{const c=ctx(p);const out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});return {...out,vitals:p.vitals};};
const dry=p=>{p.state.worlds['base.frontier'].facts['workbench.wet']=false;return p;};
const run=(p,id)=>advance(commitSimulationCommand(dry(p).state,registry,{id},ctx(p,registry.simulation.commands.get(id).targetId)),4);
const reasonFor=(p,id,extra)=>{const view=skillExpansionPresentation(p.state,registry,skillExpansionContext(p.state,base(p,extra)));
    const row=view.families.flatMap(f=>f.actions).find(a=>a.id===id).row;return {enabled:row.control.enabled,text:row.reasons.join(' ')};};

test('disabled practice names the failed authored requirement, not a generic line', () => {
    let p={state:initializeExpedition(createExpansionState(23)),external:{money:30},gameplay:{player:{inventory:{[LOG]:60},skills:{Woodworking:{enabled:true,xp:0}},reputation:{Village:0}}}};
    p=enrollSimulation(p.state,registry,base(p));
    p=run(p,'skills.timber.observe'); p=run(p,'skills.timber.learn');
    dry(p);
    assert.deepEqual(reasonFor(p,'skills.timber.practice'),{enabled:true,text:''});
    p.state.worlds['base.frontier'].facts['workbench.wet']=true;
    assert.deepEqual(reasonFor(p,'skills.timber.practice'),{enabled:false,text:'Use a dry bench for material practice.'});
    assert.deepEqual(reasonFor(p,'skills.timber.coached_practice',{'village.teacherHours':false}),
        {enabled:false,text:'He teaches between 08:00 and 18:00. Use a dry bench for material practice.'},'every failed authored requirement, in rule order');
});

test('a cost the player cannot see keeps the generic line', () => {
    let p={state:initializeExpedition(createExpansionState(23)),external:{money:30},gameplay:{player:{inventory:{[LOG]:60},skills:{Woodworking:{enabled:true,xp:0}},reputation:{Village:0}}}};
    p=enrollSimulation(p.state,registry,base(p));
    p=run(p,'skills.timber.observe'); p=run(p,'skills.timber.learn');
    dry(p);
    p.gameplay.player.inventory={};
    const r=reasonFor(p,'skills.timber.practice');
    assert.equal(r.enabled,false);
    assert.equal(r.text,GENERIC);
});
