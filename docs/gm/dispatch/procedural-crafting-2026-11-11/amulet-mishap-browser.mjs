import assert from 'node:assert/strict';
import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {Session} from '../../../../scripts/playtest/lib.mjs';
import {NativeContinuation} from '../../../../scripts/playtest/native-continuation.mjs';
import {serve} from '../../../../scripts/perf/lib.mjs';
import {blackthornDepartureMishap} from '../../../../src/lotm_amulet_protection.js';

const [root, earnedPath] = process.argv.slice(2);
const earnedBytes = await readFile(earnedPath);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const amulet = '{"id":"book.lotm.silver_protective_amulet"}';
const server = await serve(root);
const session = await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,8),opTimeout:60000}).start();
const route = new NativeContinuation(session);
try {
    await route.load(JSON.parse(earnedBytes));
    console.log('Loaded earned Blackthorn checkpoint');
    let baseline, parcel;
    for (let minute = 0; minute < 60; minute++) {
        baseline = await route.snapshot();
        parcel = blackthornDepartureMishap(baseline.expansion,{});
        assert.ok(parcel);
        if ([9,10].includes(parcel.receipt.result.raw)) break;
        await session.page.evaluate(() => {
            const clock = () => simulationTestHooks.clock();
            const before = clock();
            for (let tick=0; tick<60 && clock()===before; tick++) advanceTicks(1);
            if (clock()===before) throw Error('Native clock did not advance');
        });
    }
    assert.ok([9,10].includes(parcel.receipt.result.raw),'expected marginal native clock');
    const noteId = parcel.receipt.check.id;
    const readNote = save => save.expansion.simulation.knowledge.player[noteId];
    const view = await route.view();
    const moves = view.moves.filter(m=>m.eligible);
    assert.ok(moves.length,JSON.stringify(view.moves));
    let move;
    for (const option of moves) {
        const control = session.page.locator(`[data-lotm="${option.id}"]`).first();
        if (await control.isVisible() && await control.isEnabled()) {
            move = option;
            break;
        }
    }
    assert.ok(move,'a native walk button is visible');
    console.log('Selected visible walk at marginal clock',baseline.expansion.clock);
    const depart = async () => {
        await session.page.locator(`[data-lotm="${move.id}"]`).first().click();
        const saved = await session.save();
        assert.equal(saved.expansion.simulation.people.player.location,move.to,
            await session.page.locator('#lotm_panel [role="status"]').allTextContents());
        return saved;
    };
    const bare = await depart();
    assert.match(readNote(bare).value,/catching your footing/);
    assert.equal(bare.character.stamina_to_full,baseline.character.stamina_to_full+2);
    console.log('Bare departure spent stamina');

    await route.load(baseline);
    await session.page.evaluate(key=>equip_item(key),amulet);
    const wornBefore = await route.snapshot();
    assert.equal(wornBefore.expansion.clock,baseline.expansion.clock);
    assert.equal(wornBefore.expansion.rng,baseline.expansion.rng);
    const protectedSave = await depart();
    const note = readNote(protectedSave);
    assert.match(note.value,/amulet feels briefly warm/);
    assert.equal(protectedSave.character.stamina_to_full,wornBefore.character.stamina_to_full);
    console.log('Worn departure avoided the cost');
    await route.imported(await session.page.evaluate(()=>save_to_file()));
    assert.deepEqual(readNote(await session.save()),note);
    const record = session.page.getByText(note.value,{exact:true});
    assert.ok(await record.count(),'the observed note is rendered in the Tingen panel');
    assert.deepEqual(session.errors.filter(row=>row.kind==='pageerror'),[]);
    await writeFile(join(root,'mishap-result.json'),JSON.stringify({
        status:'PASS',bundle:sha(await readFile(join(root,'dist/bundle.js'))),
        fixture:sha(earnedBytes),viewport:session.page.viewportSize(),roll:parcel.receipt.result.raw,
        bareStaminaCost:bare.character.stamina_to_full-baseline.character.stamina_to_full,
        wornStaminaCost:protectedSave.character.stamina_to_full-wornBefore.character.stamina_to_full,
        importedObservation:note.at
    },null,2));
    console.log('PASS same Blackthorn departure with and without worn silver, and imported note');
} finally {
    await session.close();
    await server.close();
}
