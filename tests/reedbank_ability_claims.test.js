// QR2 native consumers: Reedbank's braced-joinery fitting (A1 charges, refit-when-empty,
// lasting price) and its two held claims (A2 dependent staling, hypothesis test).
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createLocalLivelihoodContent} from '../src/local_livelihood_content.js';
import {createExpansionState,createContentRegistry,advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign,structuredCampaignView,structuredActionCosts} from '../src/structured_pack_runtime.js';
import {previewSimulationCommand,commitSimulationCommand} from '../src/simulation.js';
const hash=v=>'sha256:'+createHash('sha256').update(JSON.stringify(v)).digest('hex');
function setup(seed=1) {
    const raw=createLocalLivelihoodContent(),registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]}),compiled=compileStructuredPack(raw,registry);mergeStructuredPack(compiled,registry);
    const d={...compiled.definition,contentHash:hash(raw),starts:raw.starts.map(b=>({...b,snapshotHash:hash(b)}))};
    const c={registry,actorId:'player',worldId:'base.frontier',facts:{location:'Village'},external:{money:102},gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:10,max_health:10,stamina:10,max_stamina:10}},nativeBody:{form:'human',lifeStage:'adult',ownerId:'player',controllerId:'player'},nativeAlive:true,nativeReady:true,busy:false};
    const selected=planStructuredSelection(createExpansionState(seed),d,c),result=beginStructuredCampaign(selected.plan.state,d,c,null,selected.selection);
    return {registry,d,c,plan:result.plan,record:result.record};
}
const ctx=(f,p=f.plan,id)=>({...f.c,worldId:'reedbank.district',structuredNative:{...f.record,bound:true},facts:{location:p.state.simulation.people.player.location},nativeBody:p.state.simulation.people.player.body,external:p.external,gameplay:p.gameplay,vitals:p.vitals,targetId:f.d.simulation.commands.find(a=>a.id===`reedbank.${id}`)?.targetId});
const preview=(f,id)=>previewSimulationCommand(f.plan.state,f.registry,`reedbank.${id}`,ctx(f,f.plan,id));
const act=(f,id)=>f.plan=commitSimulationCommand(f.plan.state,f.registry,{id:`reedbank.${id}`},ctx(f,f.plan,id),f.plan.state.sequence);
const finish=(f,min)=>f.plan=advanceSimulation(f.plan.state,f.registry,min,f.plan.external,f.plan.gameplay,{player:ctx(f)});
const view=f=>structuredCampaignView(f.plan.state,f.d,f.record,ctx(f));
const reload=f=>{f.plan={...f.plan,state:JSON.parse(JSON.stringify(f.plan.state))};return f;};
const beliefs=f=>view(f).status.filter(r=>/belie/.test(r.label));
function toLaterWork(f,joint) {
    act(f,'access');act(f,'take_basket');act(f,'repair_basket');finish(f,2);act(f,'deliver_basket');
    act(f,'take_crate');act(f,'learn');finish(f,2);
    act(f,joint?'joint_crate':'repair_crate');finish(f,joint?2:3);act(f,joint?'deliver_crate_joint':'deliver_crate');
    act(f,'leave');finish(f,1);act(f,'return');finish(f,1);act(f,'remember');
}
const charges=f=>f.plan.state.actors.player.resources['reedbank.brace_pegs.charges'];

test('A1: learned joinery spends finite pegs, refits only once empty, and leaves a price that outlives the refit',()=>{
    const f=setup();assert.equal(charges(f),2);
    toLaterWork(f,false);assert.equal(f.plan.state.simulation.faculties.player['reedbank.joinery'].active,true);
    assert.deepEqual(structuredActionCosts(preview(f,'routine'),f.d).includes('1 charge'),true);
    assert(!preview(f,'brace_pegs.recharge').eligible,'a full set cannot be refit');
    act(f,'routine');finish(f,2);assert.equal(charges(f),1);assert(!preview(f,'brace_pegs.recharge').eligible,'a partly spent set waits until empty');
    assert.equal(f.plan.state.actors.player.facts['reedbank.pegs_sore'],true);
    reload(f);assert.equal(charges(f),1);
    act(f,'buy_wood');act(f,'routine');finish(f,2);assert.equal(charges(f),0);assert(!preview(f,'routine').eligible,'no pegs, no fitting');
    assert(preview(f,'brace_pegs.recharge').eligible);act(f,'brace_pegs.recharge');
    assert.equal(charges(f),2);assert.equal(f.plan.state.actors.player.facts['reedbank.pegs_sore'],true,'refit does not undo the price');
});

test('A1: without the learned method the fitting is closed even with pegs; no-condition commands are unchanged',()=>{
    const f=setup();toLaterWork(f,false);
    delete f.plan.state.actors.player.sources['reedbank.joinery'];delete f.plan.state.simulation.faculties.player['reedbank.joinery'];
    assert(!preview(f,'routine').eligible);
    assert.equal(f.d.simulation.commands.find(c=>c.id==='reedbank.access').costs.length,2);
});

test('A2: choosing joint work stales only the claim that depended on it; a test corrects the other without revealing the truth',()=>{
    const f=setup();
    act(f,'access');act(f,'take_basket');act(f,'repair_basket');finish(f,2);act(f,'deliver_basket');act(f,'take_crate');
    assert.deepEqual(beliefs(f).map(r=>r.label),['What you believe']);
    act(f,'learn');finish(f,2);act(f,'joint_crate');finish(f,2);
    const rows=beliefs(f);assert.equal(rows.length,1);assert.equal(rows[0].label,'A belief that may be out of date');
    reload(f);assert.equal(beliefs(f)[0].label,'A belief that may be out of date');
    act(f,'deliver_crate_joint');act(f,'leave');finish(f,1);act(f,'return');finish(f,1);act(f,'remember');
    const labels=beliefs(f).map(r=>r.label).sort();assert.deepEqual(labels,['A belief that may be out of date','What you believe']);
    assert(preview(f,'offer_open_ended.test').eligible);act(f,'offer_open_ended.test');
    const after=beliefs(f);assert(after.some(r=>r.label==='A belief you corrected'&&/finite/.test(r.value)));
    assert(!JSON.stringify(view(f)).includes('offer_is_finite'),'hidden truth stays out of the projection');
    assert(!preview(f,'offer_open_ended.test').eligible,'one test per hypothesis');
    reload(f);assert(beliefs(f).some(r=>r.label==='A belief you corrected'));
});

test('A2: a personal crate repair leaves the pay claim fresh',()=>{
    const f=setup();toLaterWork(f,false);
    assert(beliefs(f).every(r=>r.label==='What you believe'));
});
