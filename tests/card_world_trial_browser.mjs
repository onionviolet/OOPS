// Normal Atlas route, real UI choices, no game build or source corpus dependency.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const {launchChrome}=createRequire(import.meta.url)('../scripts/ui_helpers.cjs');
const out='docs/representations/evidence/card-world-trial-2026-11-25';mkdirSync(out,{recursive:true});
const env={...process.env,ATLAS_PORT:'0'};for(const key of ['ATLAS_REBUILD','ATLAS_SNAPSHOT','ATLAS_READER_ROOT','ATLAS_HANDOFFS'])delete env[key];
const server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{env,windowsHide:true,stdio:['ignore','pipe','inherit']});let browser;const errors=[];
try{
 const base=await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',c=>reject(Error('Atlas stopped '+c)));server.stdout.on('data',b=>{const m=String(b).match(/http:\/\/127\.0\.0\.1:\d+/);if(m)resolve(m[0]);});});
 browser=await launchChrome();const page=await browser.newPage({viewport:{width:1366,height:900}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.locator('header nav').getByRole('button',{name:'Workbench',exact:true}).click();await page.getByRole('button',{name:'Card-world trial',exact:true}).click();
 const ordinary=page.locator('[data-trial-start="ordinary"]'),plus=page.locator('[data-trial-start="plus"]');
 const move=(panel,id)=>panel.locator(`[data-trial-move="${id}"]`),reset=panel=>panel.getByRole('button',{name:'Reset this start',exact:true}).click();
 await ordinary.waitFor();assert.equal(await move(ordinary,'spillway').isDisabled(),true);assert.equal(await move(plus,'spillway').isEnabled(),true);
 assert.match(await move(plus,'warden').innerText(),/1000 energy/);assert.match(await move(plus,'guard').innerText(),/4 energy/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:out+'/starts-1366.png'});
 await move(plus,'spillway').click();await plus.getByText(/Guard: “The wheel/).waitFor();
 for(const id of ['search','survey','gate','spillway'])await move(ordinary,id).click();
 for(const id of ['search','gate'])await move(plus,id).click();
 assert.match(await ordinary.locator('[data-trial-stats]').innerText(),/Turn 4\/8.*Total spent 6.*Caravan crossed/);
 assert.match(await plus.locator('[data-trial-stats]').innerText(),/Turn 3\/8.*Total spent 5.*Caravan crossed/);
 await ordinary.getByText('Copper key: consumed at the side gate',{exact:true}).waitFor();await page.screenshot({path:out+'/manual-outcomes-1366.png'});
 await reset(ordinary);await ordinary.getByLabel('Order method',{exact:true}).selectOption('trade');await ordinary.getByLabel('Energy ceiling',{exact:true}).selectOption('9');await ordinary.getByRole('button',{name:'Run selected order',exact:true}).click();await ordinary.getByRole('status').filter({hasText:'Energy ceiling 9 would be exceeded'}).waitFor();
 await ordinary.getByText(/Guard: removed · Keeper: present, ward 3/).waitFor();await ordinary.getByText('Copper key: traded for two land',{exact:true}).waitFor();await ordinary.getByRole('status').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/expense-stop-1366.png'});
 await reset(ordinary);await ordinary.getByLabel('Energy ceiling',{exact:true}).selectOption('12');await ordinary.getByRole('button',{name:'Run selected order',exact:true}).click();await ordinary.getByRole('status').filter({hasText:'Caravan crossed. Order complete.'}).waitFor();assert.match(await ordinary.getByRole('status').innerText(),/6 moves settled · 10\/12/);
 await reset(plus);await plus.getByLabel('Extra start resource',{exact:true}).selectOption('energy');await move(plus,'spillway').click();assert.match(await plus.locator('[data-trial-stats]').innerText(),/Land 1 · Energy 1/);
 await reset(plus);await plus.getByLabel('Order method',{exact:true}).selectOption('repeat');await plus.getByLabel('Repeated move',{exact:true}).selectOption('warden');await plus.getByRole('button',{name:'Run selected order',exact:true}).click();await plus.getByRole('status').filter({hasText:'needs 1000 energy; 2 ready'}).waitFor();assert.match(await plus.locator('[data-trial-stats]').innerText(),/Turn 1\/8.*Total spent 0/);
 await plus.getByRole('status').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/ward-stop-1366.png'});
 await reset(plus);await plus.getByLabel('Repeated move',{exact:true}).selectOption('survey');await plus.getByLabel('Repeat count',{exact:true}).selectOption('8');await plus.getByRole('button',{name:'Run selected order',exact:true}).click();await plus.locator('[data-trial-stats]').filter({hasText:'Turn 2/8'}).waitFor();await plus.getByRole('button',{name:'Stop',exact:true}).click();const stopped=await plus.locator('[data-trial-stats]').innerText();await page.waitForTimeout(850);assert.equal(await plus.locator('[data-trial-stats]').innerText(),stopped);await plus.getByRole('status').filter({hasText:'Stopped by you'}).waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 const result={viewport:'1366x900',route:'#workbench/card-trial',moduleSha256:createHash('sha256').update(readFileSync('prototypes/world-atlas/card-world-trial.mjs')).digest('hex'),manual:{ordinary:{turn:4,spent:6},extraLand:{turn:3,spent:5},sameOpponents:true},tradeOrder:{moves:6,spent:10,budgetStopSpent:6},wardStop:{needed:1000,ready:2,spent:0},openingEnergyRefresh:1,userStopRetained:stopped,pageErrors:errors};writeFileSync(out+'/proof.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser?.close();if(server.exitCode===null){const ended=once(server,'exit');server.kill();await ended;}}
