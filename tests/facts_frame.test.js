import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readdir,symlink,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {withFactsFrame,readFactsFrame,invalidateFactsInput} from '../src/facts_frame.js';
import {createExpansionState,createContentRegistry} from '../src/expansion_engine.js';
import {enrollSimulation} from '../src/simulation.js';
import {simulationFacts,applySimulationEffects,writeInventory} from '../src/simulation_effects.js';

const item=JSON.stringify({id:'Bread'}),missing=JSON.stringify({id:'Missing fixture item'});
function fixture() {
    const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:{
        conditions:[{id:'fixture.immune',revision:1,label:'Fixture condition',stacking:'max',immunity:{fact:'body.immune',op:'eq',value:true}}],
        commands:[{id:'fixture.noop',revision:1,label:'Wait',effects:[]}]}});
    const context={actorId:'player',facts:{location:'Village'},gameplay:{player:{inventory:{[item]:2},skills:{},reputation:{}}},external:{money:3}};
    const plan=enrollSimulation(createExpansionState(12),registry,context);
    return {registry,context:{...context,gameplay:plan.gameplay},plan};
}
test('identity inputs reuse reads, isolate results and expire at the synchronous boundary',()=>{
    const state={clock:1,sequence:2},registry={},gameplay={player:{inventory:{}}};let builds=0;
    const context=()=>({actorId:'player',facts:{location:'Village'},gameplay});
    const read=()=>readFactsFrame(state,context(),registry,()=>({build:++builds}));
    withFactsFrame(state,()=>{
        const first=read();first.build=99;assert.equal(read().build,1);
        invalidateFactsInput(gameplay);assert.equal(read().build,2);
        state.clock++;assert.equal(read().build,3);
        assert.equal(readFactsFrame({...state},context(),registry,()=>({build:++builds})).build,4);
        withFactsFrame(state,()=>assert.equal(read().build,5));
        assert.equal(read().build,3);
    });
    assert.equal(read().build,6);
    assert.throws(()=>withFactsFrame(state,()=>{throw Error('fixture');}),/fixture/);
    assert.equal(read().build,7);
});
test('a nested writer invalidates an outer frame over the same input',()=>{
    const state={clock:0,sequence:0},context={actorId:'player'},registry={};let n=0;
    const read=()=>readFactsFrame(state,context,registry,()=>({n:++n}));
    withFactsFrame(state,()=>{
        assert.equal(read().n,1);
        withFactsFrame(state,()=>{invalidateFactsInput(state);assert.equal(read().n,2);});
        assert.equal(read().n,3);
    });
});
test('predicate-specific missing inventory facts do not contaminate full facts or other predicates',()=>{
    const {registry,context,plan}=fixture();
    const predicates=[{fact:`item.${missing}`,op:'gte',value:1}];
    const plain=simulationFacts(plan.state,context,registry),required=simulationFacts(plan.state,context,registry,predicates);
    withFactsFrame(plan.state,()=>{
        assert.deepEqual(simulationFacts(plan.state,{...context},registry,predicates),required);
        assert.deepEqual(simulationFacts(plan.state,{...context},registry),plain);
        assert.equal(simulationFacts(plan.state,context,registry,predicates)[`item.${missing}`],0);
        assert.equal(simulationFacts(plan.state,context,registry)[`item.${missing}`],undefined);
    });
});
test('inventory and effect writers invalidate reads even when clock and sequence stay fixed',()=>{
    const {registry,context,plan}=fixture();
    withFactsFrame(plan.state,()=>{
        assert.equal(simulationFacts(plan.state,context,registry)[`item.${item}`],2);
        writeInventory(plan,'player',{[item]:4});
        assert.equal(simulationFacts(plan.state,context,registry)[`item.${item}`],4);
        // Prime before writing, then apply a body change followed by an immunity
        // check in the same activation. The second effect must read the change.
        applySimulationEffects(plan,[{type:'body',key:'immune',value:true},{type:'condition',id:'fixture.immune',operation:'apply'}],context,registry,'fixture.change');
        assert.equal(simulationFacts(plan.state,context,registry)['body.immune'],true);
        assert.equal(plan.state.simulation.conditions.player?.['fixture.immune'],undefined);
        applySimulationEffects(plan,[{type:'body',key:'immune',value:false},{type:'condition',id:'fixture.immune',operation:'apply'}],context,registry,'fixture.exposure');
        assert.equal(simulationFacts(plan.state,context,registry)['condition.fixture.immune'],1);
    });
});
test('changed context fields and explicit invalidation of nested inputs refresh the right read',()=>{
    const state={clock:0,sequence:0},registry={},gameplay={player:{inventory:{}}};let builds=0;
    const context={actorId:'player',facts:{location:'Village'},gameplay};
    const read=ctx=>readFactsFrame(state,ctx,registry,()=>({n:++builds}));
    withFactsFrame(state,()=>{
        assert.equal(read(context).n,1);
        assert.equal(read({...context,facts:{location:'Shack'}}).n,2);
        assert.equal(read(context).n,1);
        assert.equal(read({...context,targetId:'fixture.peer'}).n,3);
        invalidateFactsInput(registry);assert.equal(read(context).n,4);
        invalidateFactsInput(state);assert.equal(read(context).n,5);
    });
});

// Exercise the delivered integration patch in an isolated source snapshot. This
// builds the real main.js with the existing Node DOM harness; it changes neither
// the shared composition root nor player storage. Browser floor is separate.
async function candidate() {
    const root=resolve(new URL('..',import.meta.url).pathname),temp=await mkdtemp(join(tmpdir(),'yairpg-p3-test-'));
    for(const entry of await readdir(root,{withFileTypes:true})) {
        if(entry.name==='.git')continue;
        const from=join(root,entry.name),to=join(temp,entry.name);
        if(['src','scripts'].includes(entry.name))await cp(from,to,{recursive:true});
        else await symlink(from,to,entry.isDirectory()?'dir':'file');
    }
    const patch=await readFile(join(root,'docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/P3_INTEGRATION.patch'),'utf8');
    const removed=patch.split('\n').filter(s=>s.startsWith('-')&&!s.startsWith('---')).map(s=>s.slice(1)).join('\n');
    const added=patch.split('\n').filter(s=>s.startsWith('+')&&!s.startsWith('+++')).map(s=>s.slice(1)).join('\n');
    let source=await readFile(join(temp,'src/main.js'),'utf8');
    // The patch is applied in the live checkout now; accept either shape.
    assert.ok(added&&(source.includes(added)||source.includes(removed)),'integration patch matches live main input');
    source=(source.includes(added)?source:source.replace(removed,added))+"\nexport {simulationNativeContexts};\nexport {withFactsFrame,setFactsFrameEnabledForTests} from './facts_frame.js';\nexport {simulationFacts} from './simulation_effects.js';\n";
    await writeFile(join(temp,'src/main.js'),source);
    return import(pathToFileURL(join(temp,'scripts/headless/runner.mjs')).href);
}
test('fixture minutes preserve facts, contexts and create_save bytes with frame on/off',async t=>{
    const {boot,ROOT}=await candidate();
    let pack=null;
    try {pack=JSON.parse(await readFile(join(ROOT,'private_packs/lotm-cast/cast.json'),'utf8'));} catch {}
    for(const kind of ['fresh life','mid-wait','beside life with pack']) {
        await t.test(kind,async fixtureTest=>{
            if(kind!=='fresh life'&&!pack){fixtureTest.skip('Local cast pack fixture unavailable');return;}
            const outputs=[];
            for(const enabled of [false,true]) {
                const game=await boot(null,{heroName:null,seed:37});
                try {
                    const m=game.module;
                    m.setFactsFrameEnabledForTests(enabled);
                    if(kind!=='fresh life') {
                        await game.fill('[aria-label="Other known panels"]','lotm');
                        await game.click('[data-lotm="pick_beside"]');
                        await game.click('[data-lotm="enroll_beside"]');
                        assert.ok(game.internals.expansionState.lotm,'fixture enrolled');
                        assert.ok(pack.people.some(p=>game.internals.expansionState.simulation.people[p.id]),'local pack loaded into fixture');
                        if(kind==='mid-wait') {
                            // Fixture clock partway toward the first authored wait
                            // boundary. Keep the normal clock/settlement path.
                            assert.equal(game.internals.update_timer(7),7);
                            await game.settle();
                        }
                    }
                    assert.equal(game.internals.update_timer(1),1);
                    await game.settle();
                    const state=game.internals.expansionState,registry=game.internals.expeditionRegistry;
                    const contexts=m.withFactsFrame(state,()=>m.simulationNativeContexts());
                    const facts=state.simulation ? m.withFactsFrame(state,()=>Object.fromEntries(Object.entries(contexts).filter(([id])=>state.simulation.people[id]&&state.actors[id]).map(([id,ctx])=>[id,m.simulationFacts(state,{...ctx,actorId:id},registry)]))) : {unavailable:'unenrolled fresh life'};
                    if(!state.simulation)assert.throws(()=>m.simulationFacts(state,contexts.player,registry),/Enroll the living-world services first/);
                    outputs.push({contexts:JSON.stringify(contexts),facts:JSON.stringify(facts),save:JSON.stringify(game.internals.create_save())});
                    assert.equal(game.errors.length,0,'no recorded page errors');
                } finally {game.close();}
            }
            assert.equal(outputs[0].contexts,outputs[1].contexts,'byte-identical contexts');
            assert.equal(outputs[0].facts,outputs[1].facts,'byte-identical facts');
            assert.equal(outputs[0].save,outputs[1].save,'byte-identical create_save');
        });
    }
});
