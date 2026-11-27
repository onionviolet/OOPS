// Replay the actual earned Village life on the frozen default bundle. No new acquisition claim.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {serve} from '../scripts/perf/lib.mjs';
const root=resolve('.'),out=resolve('docs/representations/evidence/glow-earned-current-a686-2026-11-25');
await assert.rejects(access(join(out,'proof.json')),'preserve completed proof');await mkdir(out,{recursive:true});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const statePath='work/glow-earned-rarity-20261125/browser-state.json',stateBytes=await readFile(statePath),storageState=JSON.parse(stateBytes);
const inputSave=storageState.origins.flatMap(origin=>origin.localStorage).find(row=>row.name==='save data').value;
const prior=JSON.parse(await readFile('docs/representations/evidence/glow-earned-rarity-2026-11-25/earned-purchase.json','utf8'));
const expected='a6863a9d600d192a9c50102a1f0762472172c9f003f747f20807e640dd43c8ca';
const errors=[],observations={},server=await serve(root);let browser;
try{
    browser=await createRequire(import.meta.url)('../scripts/ui_helpers.cjs').launchChrome();
    for(const origin of storageState.origins)origin.origin=new URL(server.url).origin;
    const context=await browser.newContext({viewport:{width:1920,height:1080},storageState});
    const page=await context.newPage();page.setDefaultTimeout(20000);page.on('pageerror',error=>errors.push(error.message));
    const bundle=page.waitForResponse(response=>new URL(response.url()).pathname==='/dist/bundle.js');await page.goto(server.url,{waitUntil:'domcontentloaded'});
    const bundleSha256=sha(await(await bundle).body());assert.equal(bundleSha256,expected);
    await page.locator('#loading_screen_play_button:not(.none_display)').click({timeout:120000});
    const row=()=>page.locator('#inventory_content_div > [data-character_item]').filter({has:page.locator('.item_name',{hasText:prior.target.name})});
    const snapshot=async()=>{
        const target=page.locator('#inventory_content_div > [data-character_item]').filter({has:page.locator('.item_name',{hasText:prior.target.name})});
        assert.equal(await target.count(),1);
        return target.evaluate(node=>({key:node.dataset.character_item,name:node.querySelector('.item_name')?.textContent,rarity:node.dataset.feelRarity,
            quality:node.querySelector('.item_quality')?.textContent,new:node.hasAttribute('data-item-new'),worn:node.hasAttribute('data-feel-worn'),
            shadow:getComputedStyle(node).boxShadow,indicator:getComputedStyle(node.querySelector('.item_name'),'::before').content,
            qualityColor:getComputedStyle(node.querySelector('[data-rarity]')).color,animation:getComputedStyle(node).animationName,
            glow:document.documentElement.dataset.feelGlow,effects:document.documentElement.dataset.effects,
            settle:getComputedStyle(document.documentElement).getPropertyValue('--ui-motion-settle').trim()}));
    };
    const back=async()=>{if(await page.locator('#center_mode_back').isVisible())await page.locator('#center_mode_back').click();};
    const effects=async()=>{await page.locator('select[aria-label="Other known panels"]').selectOption('customization-effects');const glow=page.locator('[data-display-setting="panel.feel.glow"]');if(!await glow.isVisible())await page.locator('[data-panel-settings="feel"] > summary').click();return glow;};
    assert.equal(await page.evaluate(()=>get_character_money()),25);observations.loaded=await snapshot();assert.equal(observations.loaded.key,prior.target.key);assert.equal(observations.loaded.worn,true);
    let glow=await effects();await glow.selectOption('on');await page.locator('#customization_effects_host select[aria-label="Effects"]').selectOption('full');await page.locator('#customization_effects_host').getByRole('button',{name:'Apply and save',exact:true}).click();await back();
    // A visible native equipment action, not a save edit or item grant.
    await page.locator('.shell-worn-item[data-shell-slot="cape"]').click();await page.locator('#proto23_item_detail').getByRole('button',{name:'Take off',exact:true}).click();await back();
    observations.afterTakeoff=await snapshot();await row().hover();observations.unworn=await snapshot();
    assert.equal(observations.unworn.worn,false);assert.equal(observations.unworn.rarity,'uncommon');assert.equal(observations.unworn.quality,'[113%]');assert.notEqual(observations.unworn.shadow,'none');assert.doesNotMatch(observations.unworn.indicator,/◆/);
    await page.screenshot({path:join(out,'unworn-rarity-1920.png')});
    await row().hover();await page.locator('#shell_item_preview').getByRole('button',{name:'Full item ›',exact:true}).click();await page.locator('#proto23_item_detail [data-shell-item-action="equip"]').click();await back();
    observations.worn=await snapshot();assert.equal(observations.worn.worn,true);assert.match(observations.worn.indicator,/◆/);assert.equal(observations.worn.shadow,observations.unworn.shadow);
    await page.screenshot({path:join(out,'worn-rarity-1920.png')});
    glow=await effects();await glow.selectOption('off');await back();observations.off=await snapshot();
    assert.equal(observations.off.shadow,'none');assert.doesNotMatch(observations.off.indicator,/◆/);assert.equal(observations.off.worn,true);assert.equal(observations.off.qualityColor,observations.worn.qualityColor);
    await page.screenshot({path:join(out,'glow-off-1920.png')});
    glow=await effects();await glow.selectOption('on');await page.locator('#customization_effects_host select[aria-label="Effects"]').selectOption('reduced');await page.locator('#customization_effects_host').getByRole('button',{name:'Apply and save',exact:true}).click();await back();observations.reduced=await snapshot();
    assert.equal(observations.reduced.settle,'0ms');assert.notEqual(observations.reduced.shadow,'none');assert.match(observations.reduced.indicator,/◆/);
    await page.screenshot({path:join(out,'reduced-static-rarity-1920.png')});
    await page.locator('#save_button').click();await page.reload();await page.locator('#loading_screen_play_button:not(.none_display)').click({timeout:120000});observations.reloaded=await snapshot();
    assert.equal(observations.reloaded.worn,true);assert.equal(observations.reloaded.key,prior.target.key);assert.equal(observations.reloaded.effects,'reduced');assert.equal(await page.evaluate(()=>get_character_money()),25);
    assert.deepEqual(errors,[]);assert.equal(sha(await readFile(statePath)),sha(stateBytes),'retained actual input state untouched');
    const proof={schema:'native-earned-rarity-current/1',bundleSha256,viewport:{width:1920,height:1080},
        route:'Fresh test origin importing unmodified retained ordinarily earned Village life: existing paid113% uncommon Rat pelt cape; visible Take off -> Full item/Equip; Item glow off/on; Effects reduced; Save/reload. No acquisition or wage route replay on this build.',
        setup:'Retained actual Village wage/purchase save from the earlier frozen earned-cape proof. Origin metadata remapped to an isolated ephemeral server; save bytes unchanged at input. No fixture, grants, seed override, clock hooks, runtime edits or rebuild.',
        inputSaveSha256:sha(inputSave),inputStateSha256:sha(stateBytes),ordinaryAcquisitionReceipt:'docs/gm/dispatch/play-surface-2026-11-14/GLOW_EARNED_RARITY_2026-11-25.md',
        earlierAcquisitionProof:'docs/representations/evidence/glow-earned-rarity-2026-11-25/proof.json',
        earlierAcquisitionBuild:'9a960b6694049fb0da8063c09e6245254469cebeaa20c96c8793a7f54f8e9fc1',
        boundary:'This proves persistent quality/rarity/equip/settings on a686, not new pickup or re-earning. Arrival pulse was independently observed during the earlier actual acquisition. Earned rare+ and favourite styling are not exercised. Rarity edge is an OOPS design treatment; catalogued normal YAIR stills establish quality/equipped cues, not a proven matching halo.',
        observations,cash:25,errors,status:'agent-verified, not human-reviewed'};
    await writeFile(join(out,'proof.json'),JSON.stringify(proof,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(proof));
}catch(error){await writeFile(join(out,'failure.json'),JSON.stringify({error:error.stack,observations,errors},null,2)+'\n');throw error;}
finally{try{if(browser)await browser.close();}finally{await server.close();}}
