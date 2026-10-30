// Gathering at a glance evidence (GS1-GS6): fresh disposable origin, headless, 1920x1080 at 14 px and 21 px text.
// Usage: node scripts/playtest/gathering-view.mjs <repo root> <out dir>. Opens the panel in the Village, gathers once
// through the existing Village experiments button, and asserts the stock words drop in the glance (reads live state).
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'docs/representations/evidence/gathering');await mkdir(out,{recursive:true});
const server=await serve(root),errors=[],session=new Session({url:server.url+'?test_hooks=1',seed:23,wall:Date.UTC(2026,9,30),opTimeout:20000,hooks:{beforeOpen:c=>c.on('pageerror',e=>errors.push(e.message))}});
let page;
const pick=async id=>{await page.getByRole('combobox',{name:'Other known panels',exact:true}).selectOption(id);await page.waitForTimeout(120);};
async function open(seed){await session.open(seed);page=session.page;}
try{
    await session.start();
    for(const px of [14,21]){
        await open();
        if(px!==14){const seed=await session.save();seed.customization.profiles.Default.settings.typography={font:'gothic',size:px};await open(seed);}
        await pick('gathering');
        const panel=page.locator('#gathering_panel');await panel.waitFor();
        const before=await panel.innerText();
        assert.match(before,/Village common/);assert.match(before,/12 of 12 left/);assert.match(before,/Weather does not change/);
        assert.doesNotMatch(before,/Spring|Summer|Autumn|Winter/,'a source with no season map shows no band');
        assert.ok(await panel.locator('[data-gather-figure] svg').isVisible(),'figure drawn');
        await page.screenshot({path:join(out,`gathering-fresh-${px}px.png`)});
        if(px===14){
            await pick('herbal-experiments');const g=page.locator('#crafting_gather');console.log('gather enabled',await g.isEnabled(),await g.getAttribute('title'));await g.click();await page.waitForTimeout(300);console.log('notice',await page.locator('#crafting_engine_home p[role=status]').innerText().catch(()=>'?'));
            await pick('gathering');
            const after=await panel.innerText();
            assert.doesNotMatch(after,/12 of 12 left/,'stock dropped after one gather');assert.match(after,/Reedherb|Riversalt/,'the yield is now named');
            await page.screenshot({path:join(out,'gathering-after-gather-14px.png')});
            console.log(`[after gather]\n${after}\n`);
            await panel.locator('[data-open-gathering]').click();await page.waitForTimeout(150);
            assert.ok(await page.locator('#crafting_engine_home').isVisible(),'hand-off opens Village experiments');
        }
        console.log(`[${px}px fresh]\n${before}\n`);
    }
    assert.deepEqual(errors,[]);console.log('PASS');
}finally{await session.close?.();await server.close?.();}
