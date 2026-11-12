import assert from 'node:assert/strict';
import test from 'node:test';
import {enterArtifactRefinement, quoteArtifactRefinement, refinedArtifactStrike, settleArtifactRefinement} from '../src/artifact_refining.js';
import {readMaterialLineage} from '../src/material_lineage.js';

const key = id => JSON.stringify({id});
const hardSword = {key:key('Iron sword'),kind:'mundane-workpiece',rank:2,quality:800,
    material:'iron',element:'metal',inheritedEnergy:5000,sharp:true,hard:true};
const request = {piece:hardSword,reserve:2000,manual:40,composure:30,clock:500,workspaceReady:true};
const context = {worldId:'fixture.refinement',lifeId:'player',jobId:'refine:1',outputId:'Refined sword'};
function admitted(wantsSuccess, piece=hardSword) {
    for (let root=1; root<100; root++) {
        const proposal = enterArtifactRefinement({...request,piece},{...context,stock:{[piece.key]:1},root});
        if (proposal.pending.success===wantsSuccess) return proposal;
    }
    assert.fail('The deterministic fixture did not cover the required branch.');
}

test('refining quotes actual rank, energy, support and paid work before entry', () => {
    assert.deepEqual(quoteArtifactRefinement(request),{energyCost:2000,minutes:117,chancePermille:630,due:617});
    assert.throws(()=>quoteArtifactRefinement({...request,reserve:1999}),/energy/);
    assert.throws(()=>quoteArtifactRefinement({...request,workspaceReady:false}),/workspace/);
    assert.throws(()=>enterArtifactRefinement(request,{...context,stock:{},root:1}),/stale or insufficient/);
});

test('one spent sword supports the frozen success, committed failure and interrupted branches', () => {
    const success = admitted(true), failure = admitted(false);
    assert.deepEqual(success.inputs,[{item_key:hardSword.key,count:1}]);
    assert.deepEqual(failure.inputs,success.inputs);
    assert.equal(failure.energyCost,success.energyCost);
    const imported = JSON.parse(JSON.stringify(success.pending));
    assert.throws(()=>settleArtifactRefinement(imported,616),/still in progress/);
    const finished = settleArtifactRefinement(imported,617);
    assert.deepEqual(finished.balance,{unit:'whole workpiece',input:1,output:1,loss:0});
    assert.equal(readMaterialLineage(finished.outputs[0].item_key).history.at(-1).inputs[0].item_key,hardSword.key);
    const failed = settleArtifactRefinement(failure.pending,617);
    const interrupted = settleArtifactRefinement(imported,501,{interrupted:true});
    for (const loss of [failed,interrupted]) {
        assert.deepEqual(loss.outputs,[]);
        assert.deepEqual(loss.balance,{unit:'whole workpiece',input:1,output:0,loss:1});
        assert.equal(loss.event.inputs[0].item_key,hardSword.key);
    }
});

test('the output strike reads inherited shape and material from the produced object', () => {
    const outputKey = piece => admitted(true,piece).pending.outcome.outputs[0].item_key;
    const hardKey = outputKey(hardSword);
    const hard = refinedArtifactStrike(hardKey);
    const soft = refinedArtifactStrike(outputKey({...hardSword,key:key('Bronze sword'),material:'bronze',hard:false}));
    const blunt = refinedArtifactStrike(outputKey({...hardSword,key:key('Iron rod'),sharp:false}));
    assert.equal(soft.attack,hard.attack+1);
    assert.ok(hard.recovery<soft.recovery);
    assert.equal(hard.attack,blunt.attack+3);
    assert.equal(hard.element,'metal');
    assert.equal(refinedArtifactStrike(hardSword.key),null);
    assert.throws(()=>quoteArtifactRefinement({...request,piece:{...hardSword,key:hardKey}}),/unrefined/);
});

test('the native item factory equips the refined attack and recovery with its exact stock key', async () => {
    const {loadNative}=await import('./helpers/native_loader.mjs');
    const native=await loadNative(`export {getItemFromKey} from './src/items.js';
        export {typedStrike} from './src/damage_types.js';`,{logLevel:'error'});
    const make=hard=>{
        const sword=JSON.stringify({components:{head:hard?'Steel long blade':'Iron long blade',handle:'Wooden short handle'},quality:100});
        const piece={...hardSword,key:sword,quality:100,hard};
        for(let root=1;root<100;root++){
            const {pending}=enterArtifactRefinement({...request,piece},{...context,root,
                stock:{[sword]:1},outputId:'Mist-bound sword'});
            if(pending.success)return pending.outcome.outputs[0].item_key;
        }
        assert.fail('Missing refined sword fixture');
    };
    const keys=[make(true),make(false)];
    const [hard,soft]=keys.map(native.getItemFromKey);
    assert.equal(hard.equip_slot,'weapon');
    assert.equal(hard.getInventoryKey(),keys[0]);
    assert.equal(hard.getAttack(),refinedArtifactStrike(keys[0]).attack);
    assert.equal(soft.getAttack(),hard.getAttack()+1);
    assert.ok(hard.getStats().attack_speed.multiplier>soft.getStats().attack_speed.multiplier);
    const fighter={tags:{main_character:true},getEquipment:()=>({weapon:hard})};
    assert.deepEqual(native.typedStrike({fighter,target:{}}),{multiplier:1,kind:'metal',note:''});
    const protectedStrike=native.typedStrike({fighter,target:{defense_types:{metal:0.5}}});
    assert.ok(Math.abs(protectedStrike.multiplier-0.7)<1e-10);
    assert.equal(protectedStrike.note,'resisted');
});
