// Rebuilt native browser journeys for P2, BFA3 and BHB2; disposable fresh origins.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {launchChrome}=require('./ui_helpers.cjs');
const root=resolve(new URL('..',import.meta.url).pathname);
const server=createServer(async(req,res)=>{
    const path=resolve(root,'.'+new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));
    if(!path.startsWith(root+'/'))return res.writeHead(403).end();
    try {const data=await readFile(path);res.writeHead(200,{'content-type':({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json'})[extname(path)]||'application/octet-stream','cache-control':'no-store'}).end(data);}
    catch {res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await launchChrome(),results=[];
const url=`http://127.0.0.1:${server.address().port}/?test_hooks=1`;
async function journey(code,run){
    if(process.argv[2] && process.argv[2]!==code)return;
    const context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    try {
        await page.goto(url);await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});
        await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();
        if(await page.locator('#hero_creation_panel_confirmation').isVisible())await page.locator('#hero_creation_panel_confirmation').click();
        await page.waitForTimeout(350);
        await run(page);assert.deepEqual(errors,[]);results.push({code,result:'PASS',pageErrors:errors.length});
    } finally {await context.close();}
}
const step=(page,n)=>page.evaluate(n=>advanceTicks(n),n);
const save=page=>page.evaluate(()=>{saveProgress();return JSON.parse(localStorage.getItem('save data'));});
async function nearby(page,id){
    await page.locator(`[data-inspect-nearby="${id}"]`).click();
    await page.getByRole('button',{name:id==='homes'?'Open Homes':'Open Village common herb verge',exact:true}).click();
}
try {
    await journey('P2',async page=>{
        const before=await save(page);
        await page.locator('.choice_work').click();await page.locator('[data-activity="patrolling"]').click();
        await step(page,120);const after=await save(page);
        assert.equal(after.character.money,before.character.money+50);
        assert.equal(after['current time'].hour,10);
        await page.locator('.choice_work').click();
        assert.ok(await page.locator('[data-activity="patrolling"]').isVisible());
        assert.doesNotMatch(await page.locator('[data-activity="patrolling"] .job_tooltip').textContent(),/chance to find/);
        await step(page,1);assert.equal((await save(page)).character.money,after.character.money);
    });
    await journey('BFA3',async page=>{
        await nearby(page,'herbal-experiments');await page.locator('#crafting_gather').click();
        await page.locator('[data-craft-material]').first().check();
        const detail=page.locator('#crafting_engine_home [data-craft-detail]');
        assert.equal(await detail.locator('[data-craft-chance]').textContent(),'Unassessed');
        assert.match(await detail.textContent(),/Selected materials are used even if no preparation results/);
        assert.match(await detail.locator('[data-craft-output]').textContent(),/Possible result/);
        await detail.locator('[data-craft-commit]').click();
        assert.ok((await page.locator('#crafting_engine_home [role="status"]').textContent()).length>0);
    });
    await journey('BHB2',async page=>{
        await nearby(page,'homes');await page.locator('[data-home-beginnings] summary').click();
        await page.locator('[data-home-action="start:ducal"]').click();
        const residence=page.locator('#home_panel details').filter({has:page.locator('summary').filter({hasText:/^Residence storage/})});
        await residence.locator('summary').click();
        await page.locator('[data-home-action="deposit:manor"]').click();
        assert.match(await residence.locator('summary').textContent(),/1\/16/);
        await save(page);await page.reload();
        await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});
        await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();
        // Home module can reopen through the ordinary workspace navigation when away from Village.
        const homes=page.getByRole('button',{name:'Homes',exact:true});
        if(await homes.isVisible())await homes.click();
        await page.keyboard.press('Escape');
        const options=page.locator('.location_choice_dropdown').filter({hasText:'Options'});
        if(await options.count())await options.first().click();
        await page.locator('#open_storage_div').click();
        assert.match(await page.locator('#storage_comparison').textContent(),/separate from each home's residence storage/);
        await page.locator('#exit_storage_button').click();
        await page.getByRole('combobox',{name:'Other known panels',exact:true}).selectOption('homes');
        const restored=page.locator('#home_panel details').filter({has:page.locator('summary').filter({hasText:/^Residence storage/})});
        assert.match(await restored.locator('summary').textContent(),/1\/16/);
        await restored.locator('summary').click();
        await page.locator('[data-home-action^="withdraw:manor:"]').click();
        assert.match(await restored.locator('summary').textContent(),/0\/16/);
        await page.screenshot({path:'/tmp/c3-residence-storage.png'});
    });
    process.stdout.write(JSON.stringify({viewport:'1920x1080',bundle:'dist/bundle.js',results},null,2)+'\n');
} finally {await browser.close();await new Promise(r=>server.close(r));}
