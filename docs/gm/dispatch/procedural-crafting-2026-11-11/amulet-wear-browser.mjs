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
const key = '{"id":"book.lotm.silver_protective_amulet"}';
const count = save => save.inventories.person.main_character[key]?.count ?? 0;
const server = await serve(root);
const session = await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,8),opTimeout:60000}).start();
const route = new NativeContinuation(session);
try {
    const earned = JSON.parse(earnedBytes);
    assert.equal(count(earned),2);
    earned.equipment_durability = {...earned.equipment_durability,enabled:true};
    await route.load(earned);
    await session.page.evaluate(key => equip_item(key),key);
    const verify = async () => {
        const saved = await session.save();
        assert.equal(saved.character.equipment.amulet.inventory_key,key);
        assert.equal(count(saved),1);
    };
    await verify();
    const encoded = await session.page.evaluate(()=>save_to_file());
    await route.imported(encoded);
    await verify();
    await session.page.evaluate(()=>unequip_item('amulet'));
    const returned = await session.save();
    assert.equal(returned.character.equipment.amulet,null);
    assert.equal(count(returned),2,'the stock key used by both gift jobs returns unchanged');
    assert.deepEqual(session.errors.filter(row=>row.kind==='pageerror'),[]);
    await writeFile(join(root,'wear-result.json'),JSON.stringify({
        status:'PASS',bundle:sha(await readFile(join(root,'dist/bundle.js'))),
        fixture:sha(earnedBytes),viewport:session.page.viewportSize(),wornFileImport:true,returnedExactStock:true
    },null,2));
    console.log('PASS native wear, file import and return to original gift stock');
} finally {
    await session.close();
    await server.close();
}
