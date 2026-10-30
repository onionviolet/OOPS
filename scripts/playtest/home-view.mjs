// Home at a glance evidence (HB1-HB6): fresh disposable origin, headless, 1920x1080 at 14 px and 21 px text.
// Usage: node scripts/playtest/home-view.mjs <repo root> <out dir>. Starts as a cottage owner and as a bird,
// opens the Homes panel to begin, then reads the Home at a glance panel and screenshots it.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'docs/representations/evidence/homes');await mkdir(out,{recursive:true});
const server=await serve(root),errors=[],session=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,30),opTimeout:12000,hooks:{beforeOpen:c=>c.on('pageerror',e=>errors.push(e.message))}});
let page;
const pick=async id=>{await page.getByRole('combobox',{name:'Other known panels',exact:true}).selectOption(id);await page.waitForTimeout(80);};
const act=async id=>{const b=page.locator(`[data-home-action=${JSON.stringify(id)}]`);await b.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});assert.equal(await b.isEnabled(),true,id);await b.click();await page.waitForTimeout(60);};
async function open(seed){await session.open(seed);page=session.page;await pick('homes');}
try{
    await session.start();
    for(const [profile,expect] of [['homeowner',/Hearthside cottage|Willow|cottage/i],['bird',/nest/i]]){
        for(const px of [14,21]){
            await open();await act('start:'+profile);
            if(px!==14){const seed=await session.save();seed.customization.profiles.Default.settings.typography={font:'gothic',size:px};await open(seed);}
            await pick('home-overview');
            const panel=page.locator('#home_overview_panel');await panel.waitFor();
            const text=await panel.innerText();
            assert.match(text,expect,'names the home');assert.match(text,/Fittings/);assert.match(text,/Upkeep and space/);assert.match(text,/Open Homes to change anything/);
            assert.ok(await panel.locator('[data-home-strip] svg').isVisible(),'strip drawn');
            await page.screenshot({path:join(out,`overview-${profile}-${px}px.png`)});
            const box=await panel.locator('[data-open-homes]').boundingBox();console.log(`hand-off y=${Math.round(box.y)}`);console.log(`[${profile} ${px}px]\n${text}\n`);
        }
    }
    await open();await act('start:homeowner');await pick('home-overview');
    await page.locator('[data-open-homes]').click();await page.waitForTimeout(100);
    assert.ok(await page.locator('#home_panel').isVisible(),'hand-off opens Homes');
    assert.deepEqual(errors,[]);console.log('PASS');
}finally{await session.close?.();await server.close?.();}
