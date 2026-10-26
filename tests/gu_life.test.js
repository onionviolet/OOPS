import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {guAcademyLife as raw, guId as id, guKey as key, GU_DAY} from '../src/world_packs/book_gu_life.js';
import {createContentRegistry, createExpansionState, advanceSimulation, loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection, beginStructuredCampaign, structuredCampaignView} from '../src/structured_pack_runtime.js';
import {commitSimulationCommand, cancelSimulationJob, previewSimulationCommand, enrollSimulation} from '../src/simulation.js';
import {validateGuEnvelope} from '../src/book_world_gu_domain.js';
import {validateStructuredEnvelope} from '../src/structured_pack_state.js';
import {writeGameplayToEnvelope} from '../src/gameplay_transactions.js';
const hash = o => 'sha256:' + createHash('sha256').update(JSON.stringify(o)).digest('hex');
function setup() {
    const registry = createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});
    const compiled = compileStructuredPack(raw, registry); mergeStructuredPack(compiled, registry);
    const d = {...compiled.definition, contentHash:hash(raw), starts:raw.starts.map(b => ({...b,snapshotHash:hash(b)}))};
    const base = createExpansionState(717), nativeBody = {id:'native.body',ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult'};
    const context = {registry,actorId:'player',worldId:'base.frontier',nativeAlive:true,nativeReady:true,nativeBody,busy:false,facts:{location:'Village'},external:{money:0},
        gameplay:{player:{inventory:{},skills:{Woodcutting:{xp:0,enabled:false}},reputation:{}}},vitals:{player:{health:100,max_health:100,stamina:100,max_stamina:100}},equipment:{player:{}}};
    const selected = planStructuredSelection(base,d,context), start = beginStructuredCampaign(selected.plan.state,d,context,null,selected.selection);
    let p = start.plan;
    const ctx = () => ({...context,worldId:d.world.id,nativeBody:p.state.simulation.people.player.body,facts:{location:id('annex')},external:p.external,gameplay:p.gameplay,vitals:p.vitals});
    const publish = out => {const vitals = p.vitals; p = {...out,vitals:out.vitals||vitals}; for(const e of out.unlocks||[])if(e.kind==='skill')p.gameplay.player.skills[e.id].enabled=true;};
    return {registry,d,record:start.record,base,context,ctx,get p(){return p;},
        start(n) {const c=d.simulation.commands.find(c=>c.id===id(n));publish(commitSimulationCommand(p.state,registry,{id:id(n)},{...ctx(),targetId:c?.targetId}));},
        quote(n) {const c=d.simulation.commands.find(c=>c.id===id(n));return previewSimulationCommand(p.state,registry,id(n),{...ctx(),targetId:c?.targetId});},
        step(n) {publish(advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...ctx(),vitals:p.vitals.player,equipment:{}}}));},
        cancel() {publish(cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,ctx()));},
        envelope() {const save={character:{money:0,equipment:{}},expansion:p.state,content_packs:{schema:1,packs:{},structured:start.record},'current location':id('annex'),inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}}};
            writeGameplayToEnvelope(save,p.gameplay,{player:{category:'person',id:'main_character'}});return save;}
    };
}
const reserve = f => f.p.state.simulation.energies.player[id('primeval')].reserve;
const gu = f => f.p.state.simulation.people[id('moonlight')];
const food = f => f.p.state.simulation.owners[id('moonlight')][key('petals')] || 0;
function valid(f) {validateStructuredEnvelope(f.envelope()); validateGuEnvelope(f.envelope());}
function refined() {const f=setup();f.start('refine');f.step(30);return f;}

test('ordinary enrollment does not create checks for unselected Gu; selected start initializes its exact deadlines once',()=>{
    const f=setup(), ordinary=enrollSimulation(f.base,f.registry,f.context);
    assert.equal(ordinary.state.simulation.people[id('moonlight')],undefined);assert.deepEqual(ordinary.state.simulation.checks,{});
    assert.equal(Object.keys(f.p.state.simulation.checks).length,4);valid(f);
    assert.throws(()=>beginStructuredCampaign(f.p.state,f.d,f.ctx(),null,f.record),/already|unoccupied|initialized/);
});
test('paid supervised refinement transfers one exact Gu title and control, cancellation/lost support refunds',()=>{
    const f=setup(), body=gu(f).body.id;f.start('refine');assert.equal(reserve(f),5);assert.equal(f.p.state.simulation.claims[id('gu_title')].owner,id('keeper'));valid(f);
    assert.equal(f.p.state.simulation.jobs[0].participants.includes(id('moonlight')),true);f.cancel();assert.equal(reserve(f),6);assert.equal(gu(f).body.controllerId,id('moonlight'));
    f.start('refine');f.p.state.simulation.faculties.player[id('aperture')].suppressed=true;f.step(30);assert.equal(reserve(f),6);assert.equal(gu(f).body.controllerId,id('moonlight'));valid(f);
    f.p.state.simulation.faculties.player[id('aperture')].suppressed=false;f.start('refine');f.step(30);
    assert.equal(gu(f).body.id,body);assert.equal(gu(f).body.ownerId,id('moonlight'));assert.equal(gu(f).body.controllerId,'player');assert.equal(f.p.state.simulation.claims[id('gu_title')].owner,'player');
    assert.equal(f.p.gameplay.player.inventory[key('gu')],1);assert.equal(f.p.state.simulation.owners[id('keeper')][key('gu')],undefined);assert.equal(f.quote('refine').eligible,false);valid(f);
});
test('meal biology continues while refinement reserves the Gu; last bowl feeds without same-boundary hunger',()=>{
    const f=setup();f.step(GU_DAY-10);f.start('refine');f.step(10);
    assert.equal(f.p.state.simulation.jobs.length,1);assert.equal(food(f),0);assert.equal(gu(f).vitals.health,4);
    assert.equal(f.p.state.simulation.checks[id('care.c_meal')].occurrences,1);assert.equal(f.p.state.simulation.checks[id('care.d_hunger')].occurrences,undefined);valid(f);
    f.step(20);f.step(GU_DAY-20);assert.equal(gu(f).vitals.health,3);assert.equal(f.p.state.simulation.checks[id('care.d_hunger')].occurrences,1);valid(f);
});
test('prepared food is real stock and never essence; Moonblade spends essence and real target, never petals',()=>{
    const f=refined();assert.equal(f.quote('cut').eligible,false);f.start('prepare_12');assert.equal(food(f),16);assert.equal(reserve(f),5);assert.equal(f.p.gameplay.player.inventory[key('petals')],undefined);
    f.start('learn');f.step(5);assert.equal(f.p.gameplay.player.skills.Woodcutting.enabled,true);assert.equal(f.quote('cut').eligible,false);
    f.start('request_bamboo');f.start('cut');assert.equal(food(f),16);assert.equal(reserve(f),4);assert.equal(f.p.gameplay.player.skills.Woodcutting.xp,1);assert.equal(f.p.gameplay.player.inventory[key('cut_bamboo')],1);
    f.start('return_bamboo');assert.equal(f.p.state.simulation.owners[id('keeper')][key('cut_bamboo')],1);f.step(GU_DAY-f.p.state.clock);assert.equal(food(f),12);assert.equal(reserve(f),4);valid(f);
    const status=structuredCampaignView(f.p.state,f.d,f.record,f.ctx()).status;assert(status.some(r=>r.value.includes('12 prepared petals')));assert(status.some(r=>r.value.includes('reserve supports 4 activations')));
});
test('late preparation cannot refresh five-day lot; expired stocked petals cannot avert death',()=>{
    const f=refined();f.step(5*GU_DAY-1-f.p.state.clock);assert.equal(gu(f).vitals.health,1);assert.equal(gu(f).life,'alive');
    f.start('prepare_4');assert.equal(food(f),4);assert.equal(f.p.state.simulation.conditions[id('moonlight')][id('fresh_petals')].expiresAt,5*GU_DAY);valid(f);
    f.step(1);assert.equal(gu(f).life,'dead');assert.equal(gu(f).vitals.health,0);assert.equal(food(f),4);assert.equal(f.quote('cut').eligible,false);assert.equal(f.quote('prepare_4').eligible,false);assert.equal(f.p.state.simulation.checks[id('care.c_meal')].occurrences,1);valid(f);
});
test('hungry living Gu can activate; wrong control, absent keeper, dead Gu or missing carrier refuses',()=>{
    const f=setup();f.p.state.simulation.people[id('keeper')].location='elsewhere';assert.equal(f.quote('refine').eligible,false);f.p.state.simulation.people[id('keeper')].location=id('annex');
    f.start('refine');f.step(30);f.start('learn');f.step(5);f.start('request_bamboo');f.step(2*GU_DAY-f.p.state.clock);assert.equal(gu(f).vitals.health,3);assert.equal(f.quote('cut').eligible,true);
    gu(f).body.controllerId=id('moonlight');assert.equal(f.quote('cut').eligible,false);gu(f).body.controllerId='player';delete f.p.gameplay.player.inventory[key('gu')];assert.equal(f.quote('cut').eligible,false);
});
test('pending costs, exact care deadlines and food survive serialized load; malformed conservation and clock refuse',()=>{
    const f=setup();f.start('refine');f.step(7);const saved=JSON.parse(JSON.stringify(f.envelope()));validateStructuredEnvelope(saved);validateGuEnvelope(saved);assert.deepEqual(loadExpansionState(saved.expansion,f.registry),f.p.state);
    assert.equal(saved.expansion.simulation.jobs[0].due-saved.expansion.clock,23);assert.equal(saved.expansion.simulation.checks[id('care.a_reset')].due,GU_DAY);
    for(const change of [s=>delete s.expansion.simulation.checks[id('care.a_reset')],s=>s.expansion.simulation.checks[id('care.a_reset')].due++,s=>s.inventories.person.main_character[key('petals')].count++,s=>s.expansion.simulation.conditions[id('moonlight')][id('fresh_petals')].expiresAt++]) {
        const bad=structuredClone(saved);change(bad);assert.throws(()=>validateGuEnvelope(bad));
    }
});
test('coarse and partitioned shared-clock advancement settle identical meals, freshness and death',()=>{
    const coarse=refined(),fine=refined();coarse.start('prepare_12');fine.start('prepare_12');coarse.step(8*GU_DAY-30);
    while(fine.p.state.clock<8*GU_DAY)fine.step(Math.min(47,8*GU_DAY-fine.p.state.clock));
    assert.deepEqual(coarse.p.state,fine.p.state);assert.equal(gu(coarse).life,'dead');valid(coarse);valid(fine);
});
