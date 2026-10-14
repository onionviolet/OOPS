const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
(async()=>{
 const proof=path.join(process.cwd(),'docs/gm/dispatch/procgen-2026-10-13/p3');
 const earned=JSON.parse(fs.readFileSync('/private/tmp/procgen-p3-accrued.json','utf8'));
 const ctx=await chromium.launchPersistentContext('/private/tmp/procgen-p3-profile-natural-resume-'+Date.now(),{channel:'chrome',headless:true,viewport:{width:1366,height:768}});
 await ctx.addInitScript(data=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(data));},earned);
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:19330/');
 const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),buildHash=hash(fs.readFileSync('dist/bundle.js'));
 assert.equal(hash(await(await page.request.get('http://127.0.0.1:19330/dist/bundle.js')).body()),buildHash);
 await page.getByText('PLAY',{exact:true}).click();
 await page.waitForFunction(()=>Object.values(JSON.parse(localStorage.getItem('save data')).expansion.simulation.events).some(e=>e.storylet&&e.mode==='ambient'),{},{polling:250,timeout:160000});
 await page.locator('#save_button').click();const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 const cards=Object.values(after.expansion.simulation.events).filter(e=>e.storylet);assert.ok(cards.some(e=>e.mode==='ambient'));
 await page.locator('#journal_show_notebook').click();await page.locator('[data-notebook-view="people"]').click();await page.locator('#storylet_panel').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(proof,'natural-resumed-1366.png')});
 fs.writeFileSync(path.join(proof,'browser-natural-resume.json'),JSON.stringify({label:'NATURAL_RESTORED',route:'Unmodified naturally earned disposable save from browser.cjs; normal native timers, no fabricated advancement',hero:after.character.name,buildHash,start:earned.expansion.clock,end:after.expansion.clock,moneyBefore:earned.character.money,moneyAfter:after.character.money,cards:cards.map(e=>({id:e.definitionId,mode:e.mode,status:e.status,at:e.at})),errors},null,2));
 assert.deepEqual(errors,[]);console.log('natural restored',earned.expansion.clock,after.expansion.clock,cards.map(e=>e.definitionId));await ctx.close();
})().catch(e=>{console.error(e);process.exit(1);});
