import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.argv[2] || 'http://127.0.0.1:19232/';
const out=new URL('./',import.meta.url);
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const receipt={base,checks:[],sizes:[],errors:[]};
try {
    for(const start of ['none','system-quests','surprise']) {
        const context=await browser.newContext({viewport:{width:1920,height:1080}});
        const page=await context.newPage();page.on('pageerror',e=>receipt.errors.push(e.message));
        await page.goto(base);await page.locator('#loading_screen_play_button:not(.none_display)').waitFor();
        assert.match(await page.locator('#loading_screen_author').innerText(),/onionv/);
        const before=await page.evaluate(()=>localStorage.getItem('save data'));
        await page.locator(`input[name="beginning-system"][value="${start}"]`).check();
        assert.equal(await page.locator('[data-cheat-start]').inputValue(),start);
        assert.equal(await page.evaluate(()=>localStorage.getItem('save data')),before,'selection must not start or save game');
        assert.equal(await page.locator('#loading_screen').evaluate(n=>getComputedStyle(n).visibility),'visible');
        if(start==='none') {
            const radio=page.locator('input[name="beginning-system"][value="none"]');
            await radio.focus();await radio.press('ArrowRight');
            assert.equal(await page.locator('[data-cheat-start]').inputValue(),'system-quests');
            await page.keyboard.press('ArrowLeft');
            assert.equal(await page.locator('[data-cheat-start]').inputValue(),'none');
            receipt.checks.push('Native radio arrow keys synchronize the command selection without starting play.');
        }
        if(start==='system-quests') {
            for(const [width,height] of [[1920,1080],[1800,1040],[1536,864]]) for(const size of [14,21]) {
                await page.setViewportSize({width,height});
                await page.evaluate(size=>{document.documentElement.style.setProperty('--ui-type-body',`${size}px`);document.documentElement.style.setProperty('--ui-type-title',`${size+2}px`);},size);
                const layout=await page.evaluate(()=>{
                    const box=id=>{const n=document.getElementById(id),r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom};};
                    const panel=box('new_game_beginning'),play=box('loading_screen_play_button'),screen=document.getElementById('loading_screen');
                    return {panel,play,screenScroll:screen.scrollHeight,screenHeight:screen.clientHeight,pageScroll:document.documentElement.scrollHeight,bodySize:getComputedStyle(screen).fontSize,selected:document.querySelector('input[name="beginning-system"]:checked').value};
                });
                assert(Math.abs(layout.panel.x+layout.panel.w/2-width/2)<2,'Beginning centered');
                assert(layout.play.y>=layout.panel.bottom,'PLAY after choices without overlap');
                assert(layout.play.bottom<=height,'PLAY reachable at target');
                assert(layout.panel.x>=0 && layout.panel.x+layout.panel.w<=width,'Beginning fits width');
                assert.equal(layout.screenScroll,layout.screenHeight,'one screen fits at target');
                assert.equal(layout.bodySize,`${size}px`);
                assert.equal(layout.selected,start);
                receipt.sizes.push({width,height,size,...layout});
                if(width===1920 && size===14) await page.screenshot({path:new URL('after.png',out).pathname});
                if(width===1536 && size===21) await page.screenshot({path:new URL('large-text.png',out).pathname});
            }
        }
        await page.locator('#loading_screen_play_button').focus();await page.keyboard.press(start==='surprise'?' ':'Enter');
        await page.waitForFunction(()=>getComputedStyle(document.getElementById('loading_screen')).visibility==='hidden');
        assert.equal(await page.locator('#new_game_beginning').count(),0);
        await page.locator('#save_button').click();
        const held=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')).cheats.held);
        if(start==='none') assert.equal(held['system-quests'],undefined);
        else assert.equal(held['system-quests'].card.state.awakened,false);
        await page.reload();await page.locator('#loading_screen_play_button:not(.none_display)').waitFor();
        assert.equal(await page.locator('#new_game_beginning').count(),0,'existing save must not offer new choices');
        const reloaded=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')).cheats.held);
        assert.deepEqual(reloaded,held);
        receipt.checks.push(`${start}: explicit keyboard PLAY applies the native choice, Save/reload retains it, existing launch has no fresh choices.`);
        await context.close();
    }
    assert.deepEqual(receipt.errors,[]);
    receipt.checks.push('All three desktop targets at actual 14/21px body text: centered choices, no overlap, PLAY visible, no launch overflow.');
    receipt.status='PASS';
} catch(error) {receipt.status='FAIL';receipt.failure=error.stack;process.exitCode=1;}
finally {await browser.close();await writeFile(new URL('receipt.json',out),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));}
