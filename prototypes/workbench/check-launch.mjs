import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.argv[2],out=new URL('./evidence/launch-2026-10-20/',import.meta.url);
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const receipt={base,checks:[],geometry:[],errors:[]};
try {
    const context=await browser.newContext({viewport:{width:1920,height:1080}}), page=await context.newPage();
    page.on('pageerror',e=>receipt.errors.push(e.message));
    await page.goto(base+'?study=launch');
    await page.waitForFunction(()=>document.getElementById('status').textContent.startsWith('Ready'));
    assert.equal(await page.locator('#experiment').inputValue(),'launch');
    let frame=page.frames().find(f=>f.url().includes('/built/launch/'));
    await frame.locator('input[name="background"][value="scholar"]').check();
    await frame.locator('[data-system-disclosure] > summary').click();
    await frame.locator('input[name="beginning-system"][value="system-quests"]').check();
    await page.locator('#variant').selectOption('stacked');
    await frame.waitForFunction(()=>document.getElementById('loading_screen').dataset.layout==='stacked');
    assert(await frame.locator('input[name="background"][value="scholar"]').isChecked());
    assert.equal(await frame.locator('[data-cheat-start]').inputValue(),'system-quests');
    await frame.locator('#loading_screen_play_button').click();
    await frame.locator('[data-return]').waitFor({state:'visible'});
    await frame.locator('[data-return]').press('Escape');
    assert.equal(await frame.locator('[data-return]').isVisible(),false);
    assert.equal(await frame.evaluate(()=>document.activeElement.value),'scholar');
    receipt.checks.push('Shared workbench deep-link loads launch study; layout switch preserves background/system; preview/Escape restores opener.');
    await page.locator('#compare').check();
    await page.waitForFunction(()=>document.querySelectorAll('iframe').length===2 && document.getElementById('status').textContent.startsWith('Ready'));
    const pair=page.frames().filter(f=>f.url().includes('/built/launch/'));
    await pair[0].locator('input[name="background"][value="farmhand"]').check();
    await pair[1].waitForFunction(()=>document.querySelector('input[name="background"]:checked').value==='farmhand');
    assert.equal(await pair[1].locator('[data-cheat-start]').inputValue(),'system-quests');
    await page.locator('#scenario').selectOption('long');
    await pair[1].waitForFunction(()=>document.querySelector('.background-option strong').textContent.includes('winding road'));
    receipt.checks.push('Comparison mirrors selection between alternatives; long-label scenario resets the shared fixture explicitly.');
    const direct=await context.newPage();direct.on('pageerror',e=>receipt.errors.push(e.message));
    await direct.goto(base+'built/launch/index.html');
    const command=(command,value)=>direct.evaluate(({command,value})=>new Promise(resolve=>{
        const id=crypto.randomUUID();const listener=event=>{if(event.data?.type==='mockup:reply'&&event.data.id===id){removeEventListener('message',listener);resolve(event.data);}};
        addEventListener('message',listener);postMessage({type:'mockup:command',id,command,value},location.origin);
    }),{command,value});
    await direct.locator('input[name="background"][value="scholar"]').check();
    for(const [width,height] of [[1920,1080],[1800,1040],[1536,864]]) for(const size of [14,21]) {
        await direct.setViewportSize({width,height});await command('text',size);
        for(const variant of ['columns','stacked']){
            await command('variant',variant);
            const geometry=await direct.evaluate(()=>{
                const box=id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom};};
                const section=document.getElementById('new_game_beginning');return {play:box('loading_screen_play_button'),choice:box('new_game_beginning'),summary:box('beginning_summary'),screenScroll:document.getElementById('loading_screen').scrollHeight,choiceScroll:section.scrollHeight,choiceHeight:section.clientHeight,bodySize:getComputedStyle(section).fontSize};
            });
            assert(geometry.choice.x>=0&&geometry.choice.x+geometry.choice.w<=width+1,'choice contained horizontally');
            if(variant==='columns') {assert(geometry.play.bottom<=height,'primary action always visible');assert(geometry.summary.x>=geometry.choice.x+geometry.choice.w,'summary adjacent');}
            receipt.geometry.push({width,height,size,variant,...geometry});
            if(width===1920&&size===14)await direct.screenshot({path:new URL(`${variant}.png`,out).pathname});
            if(width===1536&&size===21&&variant==='columns')await direct.screenshot({path:new URL('columns-large.png',out).pathname});
        }
    }
    assert.deepEqual(await direct.evaluate(()=>Object.keys(localStorage)),[]);
    receipt.checks.push('Both layouts inspected at three desktop sizes and 14/21px; column layout retains visible preview action and adjacent summary. No storage writes.');
    assert.deepEqual(receipt.errors,[]);receipt.status='PASS';await context.close();
} catch(error){receipt.status='FAIL';receipt.failure=error.stack;process.exitCode=1;}
finally{await browser.close();await writeFile(new URL('receipt.json',out),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));}
