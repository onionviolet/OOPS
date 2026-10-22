import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
const root=resolve(process.argv[2]||'.'),file=process.argv[3],out=resolve(process.argv[4]||'/tmp/minecraft-fit-visual');await mkdir(out,{recursive:true});
const server=await serve(root),s=new Session({url:server.url+'?test_hooks=1',seed:71,wall:Date.UTC(2026,9,21,15),opTimeout:10000}),checks=[];
try{
    await s.start();const saved=JSON.parse(await readFile(file,'utf8'));
    for(const size of [14,21]){
        const view=structuredClone(saved);view.customization.profiles.Default.settings.typography={font:'gothic',size};await s.open(view);const p=s.page;
        await p.locator('#workspace_navigation select').first().selectOption('notebook');await p.locator('[data-notebook-view="here"]').click();
        await p.locator('#field_panel').evaluate(el=>el.open=true);await p.locator('[data-field-works]').evaluate(el=>el.open=true);
        const before=await s.save();await p.locator('[data-field-works]').scrollIntoViewIfNeeded();
        for(const selector of ['[data-works-resources]','[data-works-worker="artisan"]','[data-works-note]','[data-works-depot]'])assert.equal(await p.locator(selector).evaluate(el=>getComputedStyle(el).fontSize),`${size}px`);
        const compose=p.locator('[data-works-step="0"]');await compose.evaluate(el=>{for(let n=el.parentElement;n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;});
        await compose.focus();assert.equal(await compose.evaluate(el=>getComputedStyle(el).fontSize),`${size}px`);
        for(const selector of ['[data-works-input]','[data-works-batch]','[data-works-strength]'])assert.equal(await p.locator(selector).evaluate(el=>getComputedStyle(el).fontSize),`${size}px`);
        assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
        await p.screenshot({path:join(out,`composition-${size}.png`)});
        const after=await s.save();assert.deepEqual(after.expansion,before.expansion);assert.deepEqual(after.inventories,before.inventories);
        await compose.evaluate(el=>el.closest('.expedition_card').parentElement.open=false);await p.locator('[data-works-resources]').scrollIntoViewIfNeeded();await p.screenshot({path:join(out,`works-${size}.png`)});
        const depot=p.locator('[data-works-depot]');await depot.evaluate(el=>el.parentElement.open=true);await depot.scrollIntoViewIfNeeded();assert.equal(await p.locator('#adventure_notebook').evaluate(el=>{const header=el.closest('.expanded-panel-view').querySelector(':scope > .expanded-panel-heading'),style=getComputedStyle(header);return style.backgroundImage!=='none'||style.backgroundColor!=='rgba(0, 0, 0, 0)';}),true,'The sticky workshop title must cover scrolled content');await p.screenshot({path:join(out,`depot-${size}.png`)});
        await p.locator('#center_mode_back').click();assert.equal(await p.locator('button[data-place-tab="actions"]').isVisible(),true);
        checks.push(`1920x1080/${size}px: actual resource, worker, depot, receipt and target/batch/composition-control fonts; focus/inspection purity; no horizontal overflow; Back returns to Shack`);
    }
    assert.deepEqual(s.errors.filter(e=>e.kind==='pageerror'),[]);await writeFile(join(out,'receipt.json'),JSON.stringify({checks,errors:s.errors,fixture:'Exact generated native end-state from the functional journey; no personal save.'},null,2));console.log(JSON.stringify({checks,out}));
}finally{await s.close();await server.close();}
