// Run from a copied candidate after npm run build. No production bridge needed:
// optional pack admission and existing panel controls consume the authored rows.
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {boot,ROOT,canonicalSave,diffSaves} from '../../../../../scripts/headless/runner.mjs';
import {createBrowserScenario} from '../../../../../scripts/headless/scenario.mjs';
import {workshop} from '../../../../../tests/fixtures/deep_engine_authoring/workshop.mjs';
import {serve} from '../../../../../scripts/perf/lib.mjs';
import {Session} from '../../../../../scripts/playtest/lib.mjs';
const evidence=resolve(process.argv[2]);await mkdir(evidence,{recursive:true});
let game,session,server,definition=workshop();
const receipt={viewport:{width:1920,height:1080},checks:[],nativeConnected:[],setup:'Original optional synthetic pack served only to a disposable origin. No personal saves or real book content.'};
try {
    game=await boot(null,{seed:11,heroName:null});const fresh=await game.save();game.close();game=null;
    fresh.character.money=100;fresh.character.stamina_to_full=10;
    server=await serve(ROOT);
    session=new Session({url:server.url+'?test_hooks=1',seed:11,wall:Date.UTC(2026,9,20,16),opTimeout:15000,
        hooks:{beforeOpen:async context=>{
            await context.route('**/private_packs/manifest.json',route=>route.fulfill({json:{schema:1,packs:definition?['author_workshop/pack.json']:[]}}));
            await context.route('**/private_packs/author_workshop/pack.json',route=>route.fulfill({json:definition}));
        }}});
    await session.start();await session.open(fresh);
    const page=()=>session.page;
    // Navigate through the existing Beginning tab, then click visible native
    // controls with their actual command/cost/persistence owner.
    const click=async selector=>{
        await page().getByText('Beginning',{exact:true}).click();
        await page().locator(selector).click();
    };
    await click('[data-structured-begin]');
    let save=await session.save();assert.equal(save.content_packs.structured.revision,1);
    await click('[data-structured-action="author_workshop.rest"]');
    save=await session.save();assert.equal(save.character.money,98);assert.equal(save.character.stamina_to_full,6);
    receipt.nativeConnected.push('author_workshop.rest');receipt.checks.push('Native existing button: two coins spent, four stamina restored through the actual character adapter');
    await click('[data-structured-action="author_workshop.paid"]');
    const pending=await session.save();assert.equal(pending.character.money,97);assert.equal(pending.expansion.simulation.jobs.length,1);
    const persistence=createBrowserScenario(session,{fixture:'author-workshop'}).persistence;
    await persistence.reload();assert.deepEqual(diffSaves(canonicalSave(await session.save()),canonicalSave(pending)),[]);
    const exported=await persistence.exportFile();const afterExport=await session.save();await persistence.importFile(exported);
    assert.deepEqual(diffSaves(canonicalSave(await session.save()),canonicalSave(afterExport)),[]);
    assert.deepEqual(afterExport.expansion.simulation.jobs,pending.expansion.simulation.jobs);
    receipt.checks.push('Current-format paid job Save/reload exact; Export/literal Import preserves complete post-export canonical envelope, including the normal export reward');
    // Edited/missing beginning is refused before execution, without deleting the
    // durable paid work. Restore exact v1 to resume the original snapshot.
    const preserved=await page().evaluate(()=>localStorage.getItem('save data'));
    for(const next of [workshop(2,7),null]) {
        definition=next;await page().reload();await page().waitForTimeout(900);
        assert.equal(await page().evaluate(()=>localStorage.getItem('save data')),preserved);
        assert.equal(await page().evaluate(()=>!!document.querySelector('#structured_recovery')),true);
    }
    receipt.checks.push('Changed and missing definition both suspend native load; original durable save bytes remain exact');
    definition=workshop();await persistence.reload();await session.step(2);
    const completed=await session.save();assert.equal(completed.character.money,100);assert.equal(completed.expansion.simulation.jobs.length,0);
    receipt.nativeConnected.push('author_workshop.paid');receipt.checks.push('Restored exact revision settles frozen v1 paid reward of three coins');
    await page().getByText('Beginning',{exact:true}).click();
    await page().screenshot({path:join(evidence,'native-workshop.png')});
    definition=workshop(2,7);await session.open(fresh);await click('[data-structured-begin]');await click('[data-structured-action="author_workshop.paid"]');
    await session.step(2);const future=await session.save();assert.equal(future.character.money,106);assert.equal(future.content_packs.structured.revision,2);
    receipt.checks.push('Future native instance selects revision two and earns seven coins; no bespoke main/display/save wiring');
    receipt.errors=session.errors.filter(e=>e.kind==='pageerror');assert.deepEqual(receipt.errors,[]);
    await writeFile(join(evidence,'native-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
    console.log(JSON.stringify(receipt));
}finally{game?.close();await session?.close();await server?.close();}
