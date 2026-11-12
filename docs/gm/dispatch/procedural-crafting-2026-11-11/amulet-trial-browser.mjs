import assert from 'node:assert/strict';
import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {Session} from '../../../../scripts/playtest/lib.mjs';
import {NativeContinuation} from '../../../../scripts/playtest/native-continuation.mjs';
import {serve} from '../../../../scripts/perf/lib.mjs';

const [root, earnedPath] = process.argv.slice(2);
const earnedBytes = await readFile(earnedPath);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const item = id => JSON.stringify({id:'book.lotm.'+id});
const trial = 'book.lotm.silver-trial.';
const server = await serve(root);
const session = await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,8),opTimeout:60000}).start();
const route = new NativeContinuation(session,{workBatchTicks:50});
const keys=(save,id)=>Object.keys(save.inventories.person.main_character).filter(key=>JSON.parse(key).id==='book.lotm.'+id);
const count=(save,id)=>keys(save,id).reduce((sum,key)=>sum+save.inventories.person.main_character[key].count,0);
const note = (save,suffix) => save.expansion.simulation.knowledge.player['making.'+trial+suffix];
const energy = save => save.expansion.simulation.energies.player['book.lotm.be_spirituality'];
const click = async id => {
    const target = session.page.locator(`[data-lotm="${id}"]`).first();
    await target.evaluate(node => {
        for (let a=node.parentElement; a; a=a.parentElement) if (a.tagName==='DETAILS') a.open=true;
    });
    assert.equal(await target.isEnabled(),true,await target.getAttribute('title'));
    await target.click();
};
const start = async id => {
    await click(id);
    const j = (await route.view()).jobs.find(j=>j.commandId===id);
    assert.ok(j,JSON.stringify(await session.page.locator('#lotm_panel [role="status"]').allTextContents()));
    return j;
};
try {
    await route.load(JSON.parse(earnedBytes));
    const initial = await route.snapshot();
    console.log('Loaded earned carving checkpoint');
    const money = initial.character.money;
    await start(trial+'buy');
    await route.settle();
    const paid = await route.snapshot();
    assert.equal(paid.character.money,money-144);
    assert.equal(count(paid,'silver_trial_blank'),2);
    const [delivered]=keys(paid,'silver_trial_blank');
    assert.equal(JSON.parse(delivered).lineage.history.at(-1).process_id,'lotm.deliver-silver');
    console.log('Paid the supplier and received two blanks');
    const recover=async ()=>{
        const {powers}=await route.view();
        const cogitation=powers.find(x=>/cogitat/i.test(x.label));
        assert.ok(cogitation?.eligible,JSON.stringify(cogitation));
        await start(cogitation.id);
        await route.settle();
    };
    for(let i=0;i<3;i++)await recover();
    console.log('Paid for the trial lot and recovered spirituality');
    const before = await route.snapshot();
    assert.ok(!(await route.view()).making.some(row=>row.id===trial+'rework'));
    const pending = await start(trial+'early-inspect');
    const reserved = await route.snapshot();
    assert.equal(count(reserved,'silver_trial_blank'),1);
    assert.equal(reserved.expansion.simulation.jobs.find(job=>job.id===pending.id).costs[0].key,delivered);
    assert.equal(energy(reserved).reserve,energy(before).reserve-1);
    await route.imported(await session.page.evaluate(()=>save_to_file()));
    assert.ok((await route.view()).jobs.some(j=>j.id===pending.id));
    await click('cancel');
    const returned = await route.snapshot();
    assert.equal(count(returned,'silver_trial_blank'),2);
    assert.deepEqual(keys(returned,'silver_trial_blank'),[delivered]);
    assert.deepEqual(energy(returned),energy(before));
    assert.equal(note(returned,'early-inspect'),undefined);

    await start(trial+'early-inspect');
    await route.settle();
    const flaw = await route.snapshot();
    assert.equal(count(flaw,'silver_trial_marked'),1);
    const [marked]=keys(flaw,'silver_trial_marked');
    assert.equal(JSON.parse(marked).lineage.history.at(-1).inputs[0].item_key,delivered);
    assert.match(note(flaw,'early-inspect').value,/marks fail to join/);
    assert.equal(note(flaw,'reverse'),undefined);
    console.log('Cancelled and retried the failed inscription with real stock');

    assert.ok((await route.view()).making.some(row=>row.id===trial+'rework'&&row.eligible));
    await start(trial+'rework');
    await route.settle();
    const reworked = await route.snapshot();
    assert.equal(count(reworked,'silver_trial_marked'),0);
    assert.equal(count(reworked,'reworked_silver_amulet'),1);
    assert.equal(count(reworked,'silver_trial_blank'),1);
    console.log('Reworked the same marked silver');

    await start(trial+'reverse');
    await route.settle();
    const success = await route.snapshot();
    assert.equal(count(success,'silver_trial_blank'),0);
    assert.equal(count(success,'silver_protective_amulet'),count(initial,'silver_protective_amulet'));
    assert.equal(count(success,'reversed_silver_amulet'),1);
    assert.match(note(success,'reverse').value,/marks join/);
    const [first]=keys(success,'reversed_silver_amulet');
    const [reworkedKey]=keys(success,'reworked_silver_amulet');
    assert.equal(JSON.parse(reworkedKey).lineage.history.at(-1).inputs[0].item_key,marked);
    await start(trial+'buy');
    await route.settle();
    assert.equal((await route.snapshot()).character.money,money-288);
    await recover();
    await start(trial+'reverse');
    await route.settle();
    const repeated=await route.snapshot();
    const newer=keys(repeated,'reversed_silver_amulet').find(key=>key!==first);
    assert.ok(newer);
    assert.equal(count(repeated,'reversed_silver_amulet'),2);
    const binding=key=>JSON.parse(key).lineage.history.at(-1);
    assert.ok(binding(newer).at>binding(first).at);
    assert.equal(note(repeated,'reverse').at,note(success,'reverse').at);
    assert.equal(note(repeated,'reverse').cause,note(success,'reverse').cause);
    console.log('Repeated paid order and binding with a distinct dated piece');
    await session.page.evaluate(key=>equip_item(key),reworkedKey);
    await route.imported(await session.page.evaluate(()=>save_to_file()));
    const restored = await route.snapshot();
    assert.equal(restored.character.equipment.amulet.inventory_key,reworkedKey);
    await session.page.getByRole('tab',{name:/^Notebook/}).click();
    for (const suffix of ['early-inspect','rework','reverse']) {
        assert.deepEqual(note(restored,suffix),note(repeated,suffix));
        await session.page.getByText(note(restored,suffix).value,{exact:true}).waitFor({state:'visible'});
    }
    assert.deepEqual(session.errors.filter(row=>row.kind==='pageerror'),[]);
    await writeFile(join(root,'trial-result.json'),JSON.stringify({status:'PASS',
        bundle:sha(await readFile(join(root,'dist/bundle.js'))),fixture:sha(earnedBytes),
        viewport:session.page.viewportSize(),costPence:288,repeatOrder:true,distinctBindings:true,reworkedSameStock:true,reworkedEquipped:true,notesImported:true
    },null,2));
    console.log('PASS native paid trials, both outcomes, wear and import');
} finally {
    await session.close();
    await server.close();
}
