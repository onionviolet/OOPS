import test from 'node:test';
import assert from 'node:assert/strict';
import {readMaterialLineage} from '../src/material_lineage.js';
import {amuletTrialCommands, amuletWorkshopRecords, replayCompletedAmulet, resolveAmuletInscription,
    expectedAmuletCosts, MARKED_TRIAL_SILVER, REWORKED_AMULET_ID, reserveAmuletCosts, settledAmuletEffects,
    TINGEN_TRIAL_BLANK, TRIAL_AMULET_ID, withAmuletCrafting} from '../src/lotm_amulet_crafting.js';

const key = id => JSON.stringify({id: 'book.lotm.' + id});
const blank = key('silver_amulet_blank'), amulet = key('silver_protective_amulet'), offcut = key('silver_practice_offcut');
const request = {blankKey: blank, stock: {[blank]: 1}, clock: 23540, atDesk: true, knifeReady: true, spirituality: 1};
const first = 'engrave-first-face', second = 'engrave-second-face', complete = 'complete-inscription';

test('dated deliveries, failed pieces and rework preserve the exact paid chain',()=>{
    const commands=amuletTrialCommands('book.lotm.tingen.canon_beside');
    const command=suffix=>commands.find(row=>row.id.endsWith('.'+suffix));
    const settle=(definition,clock,id,costs=definition.costs)=>settledAmuletEffects({
        id,commandId:definition.id,effects:definition.effects,costs
    },{clock})[0];
    const oldLot=settle(command('buy'),100,'simulation:1');
    const newLot=settle(command('buy'),200,'simulation:2');
    assert.equal(oldLot.amount,2);
    assert.notEqual(oldLot.key,newLot.key);
    const early=command('early-inspect');
    const costs=reserveAmuletCosts(early.id,early.costs,{[newLot.key]:2,[oldLot.key]:1});
    assert.equal(costs[0].key,oldLot.key);
    assert.deepEqual(expectedAmuletCosts(early.id,early.costs,costs),costs);
    const marked=settle(early,205,'simulation:3',costs);
    assert.equal(readMaterialLineage(marked.key).history.at(-1).inputs[0].item_key,oldLot.key);
    const rework=command('rework');
    const reserved=reserveAmuletCosts(rework.id,rework.costs,{[marked.key]:1,[oldLot.key]:1});
    assert.equal(reserved[0].key,marked.key);
    assert.deepEqual(expectedAmuletCosts(rework.id,rework.costs,reserved),reserved);
    assert.deepEqual(expectedAmuletCosts(rework.id,rework.costs,costs),rework.costs);
    const finished=settle(rework,215,'simulation:4',reserved);
    assert.equal(readMaterialLineage(finished.key).history.at(-1).inputs[0].item_key,marked.key);
    assert.equal(reserveAmuletCosts(rework.id,rework.costs,{[MARKED_TRIAL_SILVER]:1})[0].key,MARKED_TRIAL_SILVER);
});

test('the live paid trials bind the law’s distinct success and flawed material to the native job', () => {
    const [buy, reverse, early] = amuletTrialCommands('book.lotm.tingen.canon_beside');
    assert.equal(buy.costs[0].amount,-144);
    assert.deepEqual(buy.effects[0],{type:'item',actor:'player',key:TINGEN_TRIAL_BLANK,amount:2});
    for (const command of [reverse,early]) {
        assert.deepEqual(command.costs[0],{type:'item',actor:'player',key:TINGEN_TRIAL_BLANK,amount:-1});
        assert.equal(command.costs[1].output,1);
        assert.equal(command.cancellation,'refund');
        assert.equal(command.completionCoLocated,true);
        assert.ok(command.effects.some(e=>e.type==='knowledge'&&e.key===command.making.receiptKey));
    }
    assert.equal(reverse.effects[0].key,JSON.stringify({id:TRIAL_AMULET_ID}));
    assert.equal(early.effects[0].key,offcut);
});

test('rework retains the front marks and consumes the actual unfinished silver', () => {
    const marked = resolveAmuletInscription({...request,blankKey:TINGEN_TRIAL_BLANK,
        stock:{[TINGEN_TRIAL_BLANK]:1},steps:[first,complete],keepMarkedPiece:true});
    assert.equal(marked.finished,false);
    assert.equal(marked.resultKey,MARKED_TRIAL_SILVER);
    const rework = {...request,blankKey:marked.resultKey,stock:{[marked.resultKey]:1},steps:[second,complete]};
    const result = resolveAmuletInscription(rework);
    assert.equal(result.resultKey,JSON.stringify({id:REWORKED_AMULET_ID}));
    assert.deepEqual(result.partition.inputs,[{item_key:MARKED_TRIAL_SILVER,count:1}]);
    assert.equal(result.partition.balance.loss,0);
    assert.equal(resolveAmuletInscription({...rework,steps:[complete]}).finished,false);
    assert.throws(()=>resolveAmuletInscription({...rework,stock:{[blank]:1}}),/stale or insufficient/);
    const command=amuletTrialCommands('book.lotm.tingen.canon_beside').find(c=>c.id.endsWith('.rework'));
    assert.equal(command.visibleWhen.all.at(-1).fact,'knowledge.making.book.lotm.silver-trial.early-inspect.seen');
    assert.equal(command.effects[0].key,result.resultKey);
});

test('Klein’s known method conserves silver and binds both marked faces', () => {
    const result = resolveAmuletInscription(request);
    assert.equal(result.resultKey, amulet);
    assert.equal(result.recognized, true);
    assert.equal(result.finished, true);
    assert.deepEqual(result.partition.inputs, [{item_key: blank, count: 1}]);
    assert.deepEqual(result.partition.balance, {unit: 'silver workpiece', input: 1, output: 1, loss: 0});
    const stored = JSON.parse(JSON.stringify(result.partition));
    assert.deepEqual(readMaterialLineage(stored.outputs[0].item_key).history[0].parameters.steps, [first, second, complete]);
    assert.throws(() => resolveAmuletInscription({...request, knifeReady: false}), /knife/);
    assert.throws(() => resolveAmuletInscription({...request, spirituality: undefined}), /spirituality/);
    assert.throws(() => resolveAmuletInscription({...request, stock: {}}), /stale or insufficient/);
});

test('either face may be worked first, while premature completion and an undersized offcut yield practice silver', () => {
    const reversed = resolveAmuletInscription({...request, steps: [second, first, complete]});
    assert.equal(reversed.recognized, false);
    assert.equal(reversed.finished, true);
    const early = resolveAmuletInscription({...request, steps: [first, complete, second]});
    assert.equal(early.finished, false);
    assert.equal(early.resultKey, offcut);
    assert.equal(early.partition.balance.output, 1);
    const practice = resolveAmuletInscription({...request, blankKey: offcut, stock: {[offcut]: 1}});
    assert.equal(practice.finished, false);
    assert.equal(practice.partition.event.parameters.joined, 500);
});

test('the live pack lowering uses the computed grant and preserves existing command and item keys', () => {
    const costs = [
        {type: 'item', actor: 'player', key: blank, amount: -1},
        {type: 'energy', energyId: 'book.lotm.be_spirituality', operation: 'use', output: 1, control: 1}
    ];
    const row = {id: 'book.lotm.kj3ap.carve-first', costs,
        effects: [{type: 'item', actor: 'player', key: amulet, amount: 1}]};
    const prior = {householdActs: {acts: [row]}};
    const transformed = withAmuletCrafting(prior);
    assert.deepEqual(transformed, prior, 'existing saved job and gifting terms stay byte-compatible');
    assert.notEqual(transformed.householdActs.acts[0].effects[0], row.effects[0], 'grant is computed');
    const altered = structuredClone(prior);
    altered.householdActs.acts[0].costs[1].output = 0;
    assert.throws(() => withAmuletCrafting(altered), /spirituality binding/);
});


test('saved completion observations reconstruct the workshop record without recreating cancelled work', () => {
    const commandId = 'book.lotm.kj3ap.carve-first';
    const state = {clock: 23564, actors: {player: {worldId: 'book.lotm.tingen', completed: {}}},
        simulation: {knowledge: {player: {}}}};
    const saved = () => JSON.parse(JSON.stringify(state));
    assert.deepEqual(amuletWorkshopRecords(saved()), []);
    state.actors.player.completed[commandId] = 1;
    const observation = {stage: 'seen', at: 23564, cause: 'simulation:41',
        basis: {kind: 'observation', attributedTo: 'player'}};
    state.simulation.knowledge.player[commandId + '.seen'] = observation;
    const receipt = replayCompletedAmulet(saved(), commandId);
    assert.equal(receipt.completedAt, 23564);
    assert.equal(receipt.partition.event.at, 23564);
    assert.equal(receipt.cause, 'simulation:41');
    assert.match(amuletWorkshopRecords(saved())[0].text, /1 blank became 1 amulet/);
    observation.at++;
    assert.deepEqual(amuletWorkshopRecords(saved()), []);
});
