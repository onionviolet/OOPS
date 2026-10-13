import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createLocalLivelihoodContent,livelihoodKey as key} from '../src/local_livelihood_content.js';
import {createExpansionState,createContentRegistry,advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign,structuredActionCosts} from '../src/structured_pack_runtime.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
const hash=v=>'sha256:'+createHash('sha256').update(JSON.stringify(v)).digest('hex');
function setup(seed=1) {
    const raw=createLocalLivelihoodContent(),registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]}),compiled=compileStructuredPack(raw,registry);mergeStructuredPack(compiled,registry);
    const d={...compiled.definition,contentHash:hash(raw),starts:raw.starts.map(b=>({...b,snapshotHash:hash(b)}))};
    const c={registry,actorId:'player',worldId:'base.frontier',facts:{location:'Village'},external:{money:102},gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:10,max_health:10,stamina:10,max_stamina:10}},nativeBody:{form:'human',lifeStage:'adult',ownerId:'player',controllerId:'player'},nativeAlive:true,nativeReady:true,busy:false};
    const selected=planStructuredSelection(createExpansionState(seed),d,c),result=beginStructuredCampaign(selected.plan.state,d,c,null,selected.selection);
    return {registry,d,c,plan:result.plan,record:result.record};
}
function context(f,p=f.plan,id) {return {...f.c,worldId:'reedbank.district',structuredNative:{...f.record,bound:true},facts:{location:p.state.simulation.people.player.location},nativeBody:p.state.simulation.people.player.body,external:p.external,gameplay:p.gameplay,vitals:p.vitals,targetId:f.d.simulation.commands.find(a=>a.id===`reedbank.${id}`)?.targetId};}
function preview(f,id,p=f.plan){return previewSimulationCommand(p.state,f.registry,`reedbank.${id}`,context(f,p,id));}
function act(f,id){f.plan=commitSimulationCommand(f.plan.state,f.registry,{id:`reedbank.${id}`},context(f,f.plan,id),f.plan.state.sequence);return f.plan;}
function finish(f,min){f.plan=advanceSimulation(f.plan.state,f.registry,min,f.plan.external,f.plan.gameplay,{player:context(f)});return f.plan;}
function first(f){act(f,'access');act(f,'take_basket');act(f,'repair_basket');finish(f,2);act(f,'deliver_basket');}
function second(f,joint=true){act(f,'take_crate');act(f,'learn');finish(f,2);act(f,joint?'joint_crate':'repair_crate');finish(f,joint?2:3);act(f,joint?'deliver_crate_joint':'deliver_crate');}

test('both supported starts naturally purchase actual access and deliver a useful first repair',()=>{
    for(const [seed,hands] of [[1,2],[0xffffffff,1]]) {
        const f=setup(seed);assert.equal(f.plan.state.simulation.people.player.body.hands,hands);
        assert(preview(f,'access').eligible);assert(preview(f,'leave').eligible);assert(!preview(f,'repair_basket').eligible);
        first(f);assert.equal(f.plan.external.money,104);assert.equal(f.plan.state.simulation.owners['reedbank.sella'][key('basket_fixed')],1);
        assert.equal(f.plan.state.simulation.owners['reedbank.sella'][key('basket_worn')]||0,0);assert.equal(f.plan.state.actors['reedbank.sella'].resources.coins,4);
        assert(!preview(f,'deliver_basket').eligible);
    }
});

test('player input quote names native coins and delivered objects without exposing NPC funds',()=>{
    const f=setup();assert.deepEqual(structuredActionCosts(preview(f,'access'),f.d),['2 coins']);first(f);
    assert.deepEqual(structuredActionCosts({eligible:true,costs:[{type:'transfer',from:'player',to:'reedbank.sella',key:key('basket_fixed'),count:1},{type:'resource',actor:'reedbank.sella',key:'coins',amount:-4}]},f.d),['1 × Sella’s repaired basket to recipient']);
});

test('learned bracing changes execution, joint work uses independent finite means, later return unlocks funded continuation',()=>{
    const f=setup();first(f);act(f,'take_crate');assert(!preview(f,'repair_crate').eligible);assert(!preview(f,'joint_crate').eligible);
    act(f,'learn');finish(f,2);assert(preview(f,'repair_crate').eligible);assert(preview(f,'joint_crate').eligible);
    act(f,'joint_crate');assert.equal(f.plan.state.actors['reedbank.mara'].resources.attention,0);assert.equal(f.plan.state.simulation.owners['reedbank.mara'][key('wood')]||0,0);finish(f,2);
    assert.equal(f.plan.state.actors.player.facts['reedbank.joint'],true);act(f,'deliver_crate_joint');assert.equal(f.plan.external.money,105);
    assert.equal(f.plan.state.actors['reedbank.mara'].resources.coins,5);assert.equal(f.plan.state.actors['reedbank.sella'].resources.coins,0);
    assert.equal(f.plan.state.simulation.owners['reedbank.sella'][key('crate_fixed')],1);assert(!preview(f,'remember').eligible);
    act(f,'leave');finish(f,1);act(f,'return');finish(f,1);act(f,'remember');assert(preview(f,'routine').eligible);
    act(f,'routine');finish(f,2);assert.equal(f.plan.external.money,107);assert.equal(f.plan.state.simulation.owners['reedbank.sella'][key('fitting')],1);
    assert(!preview(f,'remember').eligible);assert.equal(f.plan.state.simulation.jobs.length,0);
});

test('missing colleague knowledge/tool/body/contact/attention/stock cannot borrow the player means',()=>{
    const f=setup();first(f);act(f,'learn');finish(f,2);act(f,'take_crate');
    for(const mutate of [p=>delete p.state.simulation.knowledge['reedbank.mara']['reedbank.bracing'],p=>delete p.state.simulation.owners['reedbank.mara'][key('kit')],p=>p.state.simulation.people['reedbank.mara'].body.hands=0,p=>p.state.simulation.people['reedbank.mara'].location='reedbank.lane',p=>p.state.actors['reedbank.mara'].resources.attention=0,p=>delete p.state.simulation.owners['reedbank.mara'][key('wood')]]) {
        const p=structuredClone(f.plan);mutate(p);const before=structuredClone(p);assert(!preview(f,'joint_crate',p).eligible);assert.deepEqual(p,before);
    }
    assert(preview(f,'repair_crate').eligible);
});

test('cancellation and lost colleague support return actual reserved inputs without pay, method or product',()=>{
    const f=setup();first(f);act(f,'learn');const money=f.plan.external.money;
    f.plan=cancelSimulationJob(f.plan.state,f.registry,f.plan.state.simulation.jobs[0].id,context(f),f.plan.state.sequence);
    assert.equal(f.plan.external.money,money+2);assert(!f.plan.state.simulation.knowledge.player['reedbank.bracing']);
    act(f,'learn');finish(f,2);act(f,'take_crate');const before=structuredClone(f.plan);act(f,'joint_crate');
    f.plan.state.simulation.people['reedbank.mara'].body.hands=0;finish(f,2);
    assert.deepEqual(f.plan.gameplay,before.gameplay);assert.equal(f.plan.external.money,before.external.money);
    assert.equal(f.plan.state.actors['reedbank.mara'].resources.attention,1);assert.equal(f.plan.state.simulation.owners['reedbank.mara'][key('wood')],1);
    assert.equal(f.plan.gameplay.player.inventory[key('crate_fixed')]||0,0);assert(!f.plan.state.actors.player.completed['reedbank.joint_crate']);
});

test('personal second repair retains the colleague means, finite standing demand and stock stop repetition',()=>{
    const f=setup();first(f);second(f,false);assert.equal(f.plan.external.money,106);assert.equal(f.plan.state.actors['reedbank.mara'].resources.attention,1);
    act(f,'leave');finish(f,1);act(f,'return');finish(f,1);act(f,'remember');act(f,'routine');finish(f,2);
    assert(!preview(f,'routine').eligible);act(f,'buy_wood');act(f,'routine');finish(f,2);assert(!preview(f,'buy_wood').eligible);
    assert.equal(f.plan.state.actors['reedbank.sella'].resources.repeat_fund,2);
});
