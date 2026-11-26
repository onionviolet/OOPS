// Continue the actual earned life, never create an item or edit its game-save bytes.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {serve} from '../scripts/perf/lib.mjs';
const require=createRequire(import.meta.url),root=resolve('.'),evidence=resolve('docs/representations/evidence/glow-earned-rarity-2026-11-25');
const prior=JSON.parse(await readFile(join(evidence,'earned-purchase.json'),'utf8'));
assert.equal(prior.beforePurchaseMoney-prior.afterPurchaseMoney,prior.target.price);
assert.equal(prior.newPickup.new,true);assert.equal(prior.seen.new,false);
const storageState=JSON.parse(await readFile('work/glow-earned-rarity-20261125/browser-state.json','utf8'));
const inputSave=storageState.origins.flatMap(o=>o.localStorage).find(r=>r.name==='save data').value;
const result={viewport:'1920x1080',source:'same ordinarily earned life from earned-purchase.json; unmodified game-save bytes',
    inputSaveSHA256:createHash('sha256').update(inputSave).digest('hex'),target:prior.target,errors:[]};
const server=await serve(root),browser=await require('../scripts/ui_helpers.cjs').launchChrome();
for(const origin of storageState.origins)origin.origin=new URL(server.url).origin;
const context=await browser.newContext({viewport:{width:1920,height:1080},storageState}),page=await context.newPage();page.setDefaultTimeout(15000);
const row=async()=>{
    const rows=page.locator('#inventory_content_div > [data-character_item]'),index=await rows.evaluateAll((rows,key)=>rows.findIndex(r=>r.dataset.character_item===key),prior.target.key);
    assert(index>=0,'actual purchased variant remains present');return rows.nth(index);
};
const snapshot=async()=> (await row()).evaluate(r=>({name:r.querySelector('.item_name')?.textContent,rarity:r.dataset.feelRarity,
    quality:r.querySelector('.item_quality')?.textContent,new:r.hasAttribute('data-item-new'),worn:r.hasAttribute('data-feel-worn'),
    shadow:getComputedStyle(r).boxShadow,indicator:getComputedStyle(r.querySelector('.item_name'),'::before').content,
    qualityColor:getComputedStyle(r.querySelector('[data-rarity]')).color,animation:getComputedStyle(r).animationName,
    duration:getComputedStyle(r).animationDuration,settle:getComputedStyle(document.documentElement).getPropertyValue('--ui-motion-settle').trim(),
    glow:document.documentElement.dataset.feelGlow,effects:document.documentElement.dataset.effects}));
try {
    page.on('pageerror',e=>result.errors.push(e.message));
    page.on('response',async r=>{if(new URL(r.url()).pathname==='/dist/bundle.js')result.loadedBundleSHA256=createHash('sha256').update(await r.body()).digest('hex');});
    await page.goto(server.url,{waitUntil:'domcontentloaded'});await page.locator('#loading_screen_play_button:not(.none_display)').click({timeout:30000});
    result.cash=await page.evaluate(()=>get_character_money());assert.equal(result.cash,prior.afterPurchaseMoney);
    result.reloaded=await snapshot();await page.screenshot({path:join(evidence,'uncommon-reloaded.png')});
    await (await row()).hover();await page.locator('#shell_item_preview').getByRole('button',{name:'Full item ›',exact:true}).click();
    await page.locator('#proto23_item_detail [data-shell-item-action="equip"]').click();
    await page.locator('#center_mode_back').click();
    result.equipped=await snapshot();await page.screenshot({path:join(evidence,'uncommon-equipped.png')});
    assert.equal(result.equipped.worn,true);assert.match(result.equipped.indicator,/◆/);assert.notEqual(result.equipped.shadow,'none');
    const effectsHome=async()=>page.locator('select[aria-label="Other known panels"]').selectOption('customization-effects');
    const back=async()=>page.locator('#center_mode_back').click();
    const glow=page.locator('[data-display-setting="panel.feel.glow"]');
    const showGlow=async()=>{if(!await glow.isVisible())await page.locator('[data-panel-settings="feel"] > summary').click();};
    await effectsHome();await showGlow();await glow.selectOption('off');await back();
    result.off=await snapshot();await page.screenshot({path:join(evidence,'glow-off.png')});
    assert.equal(result.off.glow,'off');assert.equal(result.off.shadow,'none');assert.doesNotMatch(result.off.indicator,/◆/);
    assert.equal(result.off.qualityColor,result.equipped.qualityColor,'Glow does not replace the native quality text colour');
    await effectsHome();await showGlow();await glow.selectOption('on');
    await page.locator('#customization_effects_host select[aria-label="Effects"]').selectOption('reduced');
    await page.locator('#customization_effects_host').getByRole('button',{name:'Apply and save',exact:true}).click();await back();
    result.reduced=await snapshot();await page.screenshot({path:join(evidence,'effects-reduced.png')});
    assert.equal(result.reduced.effects,'reduced');assert.equal(result.reduced.settle,'0ms');assert.notEqual(result.reduced.shadow,'none');assert.match(result.reduced.indicator,/◆/);
    assert.deepEqual(result.errors,[]);result.passed=true;
}catch(error){result.failure=error.stack;process.exitCode=1;try{result.visible=(await page.locator('body').innerText()).slice(0,5000);await page.screenshot({path:join(evidence,'controls-failed.png'),timeout:3000});}catch{}}
finally{
    await context.storageState({path:'work/glow-earned-rarity-20261125/browser-state.json'});
    await writeFile(join(evidence,'controls.json'),JSON.stringify(result,null,2)+'\n');
    try{await browser.close();}finally{await server.close();}
}
console.log(JSON.stringify(result));
