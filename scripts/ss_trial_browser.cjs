// Shadow Slave Second Nightmare trial: fresh origin, 1920x1080, real Save/reload/Export/Import. Evidence in argv[2].
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {launchChrome,advanceGameMinutes}=require('./ui_helpers.cjs');
const out=process.argv[2]||'docs/gm/dispatch/book-ui-wave-2026-10-30/evidence/ss';fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'..'),types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const p=path.join(root,decodeURIComponent(req.url.split('?')[0]));const f=fs.existsSync(p)&&fs.statSync(p).isDirectory()?path.join(p,'index.html'):p;
 fs.readFile(f,(e,d)=>{if(e){res.statusCode=404;res.end();}else{res.setHeader('content-type',types[path.extname(f)]||'application/octet-stream');res.end(d);}});});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 const browser=await launchChrome(),result={base,errors:[],checks:[]};const ok=(l,v)=>{assert.ok(v,l);result.checks.push(l);console.log('PASS',l);};
 const ctx=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}),page=await ctx.newPage();page.setDefaultTimeout(20000);
 page.on('pageerror',e=>result.errors.push(e.message));page.on('dialog',d=>d.dismiss());
 const boot=async()=>{await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(800);};
 const panel=()=>page.locator('#structured_pack_panel').innerText();
 const act=async n=>{await page.locator(`[data-structured-action="book.ss.trial.${n}"]`).click();await advanceGameMinutes(page,14);await page.waitForTimeout(400);};
 const save=async()=>{await page.locator('#save_button').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 try{
  await page.goto(base+'/index.html?test_hooks=1');await boot();
  await page.locator('#workspace_navigation select').first().selectOption('beginning');
  await page.locator('[data-structured-choice="life"]').selectOption('book.ss.trial');
  await page.getByRole('button',{name:'Confirm arrival',exact:true}).click();await page.waitForTimeout(500);
  ok('ladder figure drawn at Awakened',await page.locator('[data-structured-ladder]').count()===1&&/Awakened/.test(await panel()));
  await page.screenshot({path:`${out}/01-start-1920x1080.png`});
  await act('prepare');await act('enter');
  ok('route cost and risk are shown before choosing',/Costs 25 health/.test(await panel()));
  await page.screenshot({path:`${out}/02-in-realm-1920x1080.png`});
  await act('rushed');await act('settle');
  ok('settling promoted the ladder to Ascended',/Rank: Ascended/.test(await panel()));
  await page.screenshot({path:`${out}/03-ascended-1920x1080.png`});
  const s1=await save();const rank=s1.expansion.actors.player.facts['book.ss.trial.rank'];ok('saved rank is 2',rank===2);
  await page.reload();await boot();await page.locator('#workspace_navigation select').first().selectOption('beginning');
  ok('reload keeps Ascended',/Rank: Ascended/.test(await panel()));
  const [dl]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const file=`${out}/export.txt`;await dl.saveAs(file);
  await Promise.all([page.waitForEvent('load'),page.locator('#saved_file_input').setInputFiles(file)]);await boot();await page.locator('#workspace_navigation select').first().selectOption('beginning');
  ok('import keeps Ascended and the ladder',/Rank: Ascended/.test(await panel())&&await page.locator('[data-structured-ladder]').count()===1);
  await page.screenshot({path:`${out}/04-after-import-1920x1080.png`});
  ok('no page errors',result.errors.length===0);
 }finally{fs.writeFileSync(`${out}/browser-result.json`,JSON.stringify(result,null,2));await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
