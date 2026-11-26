// Ordinary fresh-origin rarity proof. No fixture, seed override, item grant or time hook.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {serve} from '../scripts/perf/lib.mjs';
const require=createRequire(import.meta.url),root=resolve('.');
const evidence=resolve('docs/representations/evidence/glow-earned-rarity-2026-11-25');
await mkdir(evidence,{recursive:true});
const scratch=resolve('work/glow-earned-rarity-20261125');await mkdir(scratch,{recursive:true});
const server=await serve(root),browser=await require('../scripts/ui_helpers.cjs').launchChrome();
const result={viewport:'1920x1080',setup:'fresh default game; no fixture, seed override, grants or time hooks',route:[],errors:[],
    bundleSHA256:createHash('sha256').update(await readFile(join(root,'dist/bundle.js'))).digest('hex'),
    runnerSHA256:createHash('sha256').update(await readFile(new URL(import.meta.url))).digest('hex')};
let page;
try {
    let storageState,previousRecord,savedWork;
    if(process.argv.includes('--resume')) {
        try{previousRecord=JSON.parse(await readFile(join(evidence,'result.json'),'utf8'));}catch{}
        storageState=JSON.parse(await readFile(join(scratch,'browser-state.json'),'utf8'));
        const actualSave=storageState.origins.flatMap(o=>o.localStorage).find(row=>row.name==='save data');
        savedWork=actualSave&&JSON.parse(actualSave.value).current_activity;
        result.inputSaveSHA256=actualSave&&createHash('sha256').update(actualSave.value).digest('hex');
        for(const origin of storageState.origins)origin.origin=new URL(server.url).origin;
        result.resume='Unmodified localStorage from this proof\'s actual ordinary life; origin metadata moved to the new isolated server.';
        result.setup='continuation of this proof\'s actual ordinary life; no fixture, seed override, grants or time hooks';
    }
    const context=await browser.newContext({viewport:{width:1920,height:1080},storageState});page=await context.newPage();page.setDefaultTimeout(15000);
    const openGroup=async selector=>{const group=page.locator(selector);if(!await group.evaluate(node=>node.classList.contains('location_choice_dropdown_expanded')))await group.click();};
    const stopWork=async()=>{const stop=page.locator('#action_end_div');if(await stop.isVisible())await stop.click();else await page.locator('#center_mode_back').click();};
    page.on('response',async response=>{if(new URL(response.url()).pathname==='/dist/bundle.js')result.loadedBundleSHA256=createHash('sha256').update(await response.body()).digest('hex');});
    page.on('pageerror',error=>result.errors.push(error.message));
    await page.goto(server.url,{waitUntil:'domcontentloaded'});
    await page.locator('#loading_screen_play_button:not(.none_display)').click({timeout:30000});
    if(process.argv.includes('--finish-nearby')&&savedWork?.activity_id==='fieldwork'&&previousRecord?.target) {
        // Coordinator-authorized few-minute continuation of an already earned, saved round.
        // The original wall-time ceiling and this extra interval remain separately recorded.
        result.carriedWork={saved:{...savedWork},startClock:await page.locator('#time_div').innerText(),wallStart:new Date().toISOString()};
        await page.waitForFunction(price=>{
            const node=document.getElementById('action_end_earnings'),units={W:1,C:10,S:1000,G:100000};
            const accrued=[...(node?.textContent||'').matchAll(/(\d+)\s*([WCSG])/g)].reduce((s,m)=>s+Number(m[1])*units[m[2]],0);
            return !!node&&get_character_money()+accrued>=price;
        },previousRecord.target.price,{timeout:300000,polling:1000});
        result.carriedWork.stopQuote=await page.locator('#action_end_earnings').innerText();
        await stopWork();
        Object.assign(result.carriedWork,{endMoney:await page.evaluate(()=>get_character_money()),endClock:await page.locator('#time_div').innerText(),wallEnd:new Date().toISOString()});
    }
    if(!storageState) {
    await page.locator('[data-nearby-verb="talk:villageElder"]').click();
    for(const key of ['hello','where am i','ask to leave 1','need to','starting gear']) {
        const row=page.locator(`[data-topic-id="${key}"]:visible`);
        if(await row.count()) {result.route.push({topic:key,label:await row.innerText()});await row.click();}
        else result.route.push({missing:key,shown:await page.locator('[data-topic-id]:visible').evaluateAll(rows=>rows.map(r=>({id:r.dataset.topicId,label:r.textContent.trim()})))});
    }
    await page.locator('[data-textline="sword"]:visible').click();result.route.push({branch:'sword',source:'ordinary elder gift at50quality'});
    await page.locator('[data-topic-id="equipment"]:visible').click();
    await page.locator('[data-topic-id="money"]:visible').click();
    await page.locator('#center_mode_back').click();
    result.route.push({topic:'equipment',effect:'ordinary village market unlocked'});
    }
    await openGroup('.choice_trade');
    await page.locator('[data-trader="villageTrader"]:visible').click();
    const offers=await page.locator('#trader_inventory_div > [data-trader_item]').evaluateAll(rows=>rows.filter(r=>r.querySelector('.item_quality [data-rarity="uncommon"]')).map(r=>{
        const shown=r.querySelector('.item_value')?.textContent||'',units={W:1,C:10,S:1000,G:100000};
        return {key:r.dataset.trader_item,name:r.querySelector('.item_name')?.textContent,quality:Number(r.dataset.item_quality),
            shownPrice:shown,price:[...shown.matchAll(/(\d+)\s*([WCSG])/g)].reduce((s,m)=>s+Number(m[1])*units[m[2]],0)};
    }).sort((a,b)=>a.price-b.price));
    result.stock=offers;result.initialMoney=await page.evaluate(()=>get_character_money());
    result.initialClock=await page.locator('#time_div').innerText();
    await page.screenshot({path:join(evidence,'market-before.png')});
    const sales=await page.locator('#inventory_content_div > [data-character_item]').evaluateAll(rows=>rows.map(r=>{
        const shown=r.querySelector('.item_value')?.textContent||'',units={W:1,C:10,S:1000,G:100000};
        return {key:r.dataset.character_item,name:r.querySelector('.item_name')?.textContent,count:Number(r.dataset.item_count),shownPrice:shown,
            price:[...shown.matchAll(/(\d+)\s*([WCSG])/g)].reduce((s,m)=>s+Number(m[1])*units[m[2]],0)};
    }));
    result.saleOffers=sales;
    const target=previousRecord?.target?offers.find(row=>row.key===previousRecord.target.key):offers[0],funds=result.initialMoney+sales.reduce((s,r)=>s+r.price*r.count,0);
    if(previousRecord?.target)assert(target,'the retained exact target remains on the shelf');
    if(!target||target.price>funds+15*14) {
        result.stage='bounded-stop';result.reason='No uncommon offer within real starting goods plus fourteen ordinary two-hour fieldwork payouts (under30wallminutes).';
    } else {
        result.target=target;
        const byKey=async(selector,attr,key)=>{
            const rows=page.locator(selector),index=await rows.evaluateAll((rows,[attr,key])=>rows.findIndex(r=>r.getAttribute(attr)===key),[attr,key]);
            assert(index>=0,'exact item row remains present');return rows.nth(index);
        };
        const keep=await byKey('#trader_inventory_div > [data-trader_item]','data-trader_item',target.key);
        const keepButton=keep.locator('[data-shop-lock-key]');
        const beforeKeep=await page.evaluate(()=>get_character_money());
        if(await keepButton.getAttribute('aria-pressed')!=='true')await keepButton.click();
        result.keepPlan={key:target.key,description:await keepButton.getAttribute('title'),paid:beforeKeep-await page.evaluate(()=>get_character_money())};
        assert.equal(result.keepPlan.paid,0,'native stock hold charges no money');
        for(const sale of sales) {
            const row=await byKey('#inventory_content_div > [data-character_item]','data-character_item',sale.key);
            await row.locator('[data-trade_ammount="Infinity"]').click({timeout:30000});
        }
        result.saleSettlementQuote=await page.locator('#trade_price_value').innerText();
        await page.locator('#accept_trade_button').click({timeout:30000});
        result.afterSalesMoney=await page.evaluate(()=>get_character_money());
        result.actualSaleProceeds=result.afterSalesMoney-result.initialMoney;
        await page.locator('#center_mode_back').click();
        if(result.afterSalesMoney<target.price) {
            result.work={startMoney:result.afterSalesMoney,startClock:await page.locator('#time_div').innerText(),wallStart:new Date().toISOString()};
            result.work.samples=[];
            console.log(JSON.stringify({stage:'ordinary-fieldwork',target,cash:result.afterSalesMoney}));
            let originalStart=result.work.wallStart;
            if(storageState)originalStart=previousRecord?.work?.originalWallStart||previousRecord?.work?.wallStart||originalStart;
            result.work.originalWallStart=originalStart;
            const deadline=Date.parse(originalStart)+1800000;
            const progress=()=>page.evaluate(()=>{
                const node=document.getElementById('action_end_earnings'),text=node?.textContent||'',units={W:1,C:10,S:1000,G:100000};
                return {cash:get_character_money(),accrued:[...text.matchAll(/(\d+)\s*([WCSG])/g)].reduce((s,m)=>s+Number(m[1])*units[m[2]],0),
                    active:!!node,clock:document.getElementById('time_div').textContent.trim()};
            });
            while(await page.evaluate(()=>get_character_money())<target.price) {
                assert(Date.now()<deadline,'ordinary work stayed within30wallminutes');
                let p=await progress();
                if(!p.active) {
                    // Observe the actual opening window; no clock step or artificial sleep.
                    await page.waitForFunction(()=>{const m=document.getElementById('time_div').textContent.match(/(\d\d):(\d\d)/);return m&&Number(m[1])>=6&&Number(m[1])<=18;},null,{timeout:deadline-Date.now(),polling:1000});
                    await openGroup('.choice_work');await page.locator('[data-activity="fieldwork"]:visible').click();
                    await page.locator('#action_end_earnings').waitFor({state:'attached'});p=await progress();
                }
                const previous=p;
                await page.waitForFunction(({previous,price})=>{
                    const node=document.getElementById('action_end_earnings');if(!node)return true;
                    const units={W:1,C:10,S:1000,G:100000},accrued=[...node.textContent.matchAll(/(\d+)\s*([WCSG])/g)].reduce((s,m)=>s+Number(m[1])*units[m[2]],0);
                    return accrued!==previous.accrued||get_character_money()+accrued>=price;
                },{previous,price:target.price},{timeout:deadline-Date.now(),polling:1000});
                p=await progress();result.work.samples.push(p);console.log(JSON.stringify({stage:'earned-pay',...p}));
                if(p.active&&p.cash+p.accrued>=target.price)await stopWork();
            }
            Object.assign(result.work,{endMoney:await page.evaluate(()=>get_character_money()),endClock:await page.locator('#time_div').innerText(),wallEnd:new Date().toISOString()});
        }
        await openGroup('.choice_trade');await page.locator('[data-trader="villageTrader"]:visible').click();
        const buy=await byKey('#trader_inventory_div > [data-trader_item]','data-trader_item',target.key);
        result.beforePurchaseMoney=await page.evaluate(()=>get_character_money());
        await buy.locator('.item_name').click();await page.locator('#accept_trade_button').click();
        result.afterPurchaseMoney=await page.evaluate(()=>get_character_money());
        assert.equal(result.beforePurchaseMoney-result.afterPurchaseMoney,target.price,'actual observed purchase price');
        await page.locator('#center_mode_back').click();
        const owned=()=>byKey('#inventory_content_div > [data-character_item]','data-character_item',target.key);
        const snapshot=async()=> (await owned()).evaluate(row=>({name:row.querySelector('.item_name')?.textContent,rarity:row.dataset.feelRarity,
            quality:row.querySelector('.item_quality')?.textContent,new:row.hasAttribute('data-item-new'),worn:row.hasAttribute('data-feel-worn'),
            shadow:getComputedStyle(row).boxShadow,animation:getComputedStyle(row).animationName,duration:getComputedStyle(row).animationDuration,
            indicator:getComputedStyle(row.querySelector('.item_name'),'::before').content,glow:document.documentElement.dataset.feelGlow,effects:document.documentElement.dataset.effects}));
        result.newPickup=await snapshot();await page.screenshot({path:join(evidence,'uncommon-new.png')});
        assert.equal(result.newPickup.new,true,'a genuinely acquired variant receives the new pickup marker');
        const row=await owned();await row.hover();await page.waitForTimeout(500);
        result.seen=await snapshot();await page.screenshot({path:join(evidence,'uncommon-seen.png')});
        await page.locator('#shell_item_preview').getByRole('button',{name:'Full item ›',exact:true}).click();
        await page.locator('#proto23_item_detail [data-shell-item-action="equip"]').click();
        await page.locator('#center_mode_back').click();
        result.equipped=await snapshot();await page.screenshot({path:join(evidence,'uncommon-equipped.png')});
        result.stage='earned-equipped';
        assert.equal(result.equipped.rarity,'uncommon');assert.equal(result.equipped.worn,true);
        assert.equal(result.seen.new,false);assert.notEqual(result.seen.shadow,'none');assert.match(result.equipped.indicator,/◆/);
        const panels=page.locator('select[aria-label="Other known panels"]');
        const effectsHome=async()=>{await panels.selectOption('customization-effects');};
        const home=async()=>{await page.locator('#center_mode_back').click();};
        await effectsHome();
        const glow=page.locator('[data-display-setting="panel.feel.glow"]');
        const disclosure=page.locator('[data-panel-settings="feel"]');
        if(!await glow.isVisible())await disclosure.locator('summary').click();
        await glow.selectOption('off');await home();
        result.glowOff=await snapshot();await page.screenshot({path:join(evidence,'glow-off.png')});
        assert.equal(result.glowOff.glow,'off');assert.equal(result.glowOff.shadow,'none');assert.doesNotMatch(result.glowOff.indicator,/◆/);
        await effectsHome();await glow.selectOption('on');
        const effects=page.locator('#customization_effects_host select[aria-label="Effects"]');
        await effects.selectOption('reduced');await page.locator('#customization_effects_host').getByRole('button',{name:'Apply and save',exact:true}).click();
        await home();result.reduced=await snapshot();await page.screenshot({path:join(evidence,'effects-reduced.png')});
        assert.equal(result.reduced.effects,'reduced');assert.notEqual(result.reduced.shadow,'none');assert.equal(result.reduced.duration,'0s');assert.match(result.reduced.indicator,/◆/);
        await page.emulateMedia({reducedMotion:'reduce'});result.osReduced=await snapshot();
        result.stage='passed';
    }
    assert.deepEqual(result.errors,[]);
} catch(error) {
    result.failure=error.stack;process.exitCode=1;
    if(page)try{result.failureVisible=(await page.locator('body').innerText({timeout:3000})).slice(0,7000);await page.screenshot({path:join(evidence,'failed.png'),timeout:3000});}catch{}
}
finally {
    if(page)try{let timer;try{await Promise.race([page.context().storageState({path:join(scratch,'browser-state.json')}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Actual life capture timed out')),7000);})]);}finally{clearTimeout(timer);}result.actualLifeState=join(scratch,'browser-state.json');}catch(error){result.stateCaptureFailure=error.message;}
    await writeFile(join(evidence,'result.json'),JSON.stringify(result,null,2)+'\n');
    try {await browser.close();}finally{await server.close();}
}
console.log(JSON.stringify(result));
