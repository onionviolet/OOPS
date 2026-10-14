const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=process.argv[2],out=process.argv[3],origin='http://127.0.0.1:'+(30000+Math.floor(Math.random()*20000));
const types={'.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.map':'application/json','.woff2':'font/woff2','.ttf':'font/ttf','.gif':'image/gif','.jpg':'image/jpeg','.mp3':'audio/mpeg','.ogg':'audio/ogg'};
const serve=ctx=>ctx.route(origin+'/**',r=>{let p=new URL(r.request().url()).pathname;if(p.endsWith('/'))p+='index.html';const f=path.join(root,decodeURIComponent(p));if(!fs.existsSync(f)||fs.statSync(f).isDirectory())return r.fulfill({status:404,body:''});r.fulfill({status:200,body:fs.readFileSync(f),contentType:types[path.extname(f)]||'application/octet-stream'});});
const log=[];const note=(k,v)=>{log.push([k,v]);console.log(k,JSON.stringify(v));};
(async()=>{
 const {decodeSaveFile}=await import(path.join(root,'src/save_files.js'));
 const ctx=await chromium.launchPersistentContext('/private/tmp/claude-501/hv1-merge-'+Date.now(),{channel:'chrome',headless:true,viewport:{width:1366,height:768},acceptDownloads:true});await serve(ctx);
 const page=ctx.pages()[0];page.setDefaultTimeout(15000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 const save=async()=>{await page.locator('#save_button').click();return read();};
 const stock=s=>s.inventories.person.main_character;
 const proj=s=>({harvest:s.harvest,inventory:stock(s),xp:s.levels.person.main_character.skill_xp.Butchering??0});
 const lots=s=>Object.values(s.harvest.lots).reduce((n,l)=>n+l.length,0);
 try{
 // 1 fresh load, new hero, save, reload
 await page.goto(origin+'/');await page.locator('#loading_screen_play_button').click();
 await page.locator('#hero_creation_name_field').fill('TEST FIXTURE HV1 MERGE');await page.locator('#hero_creation_panel_confirmation').click();
 let s=await save();assert.equal(s.character.name,'TEST FIXTURE HV1 MERGE');
 await page.reload();await page.locator('#loading_screen_play_button').click();assert.equal((await read()).character.name,'TEST FIXTURE HV1 MERGE');note('newHeroReload',{harvestPresent:!!s.harvest});
 // 2 import HV1's earned test fixture save
 const lit='/private/tmp/hv1-natural-literal.txt',src=decodeSaveFile(fs.readFileSync(lit,'utf8'),'v0.6');
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles(lit)]);
 s=await read();assert.deepEqual(proj(s).harvest,proj(src).harvest);note('fixtureImport',{name:s.character.name,processed:s.harvest.processed});
 await page.locator('#loading_screen_play_button').click();
 // 3 earn carcasses naturally
 await page.locator('#harvest_panel summary').first().click();const auto=page.locator('[data-harvest="auto"]');if(await auto.isChecked())await auto.uncheck();await page.locator('#harvest_panel summary').first().click();
 s=await save();const before=lots(s);
 await page.getByText('Move somewhere else',{exact:false}).click();await page.locator('#location_actions_div').getByText('Enter the [Infested field]',{exact:false}).click();
 for(let i=0;i<40;i++){await page.waitForTimeout(2500);s=await save();if(lots(s)>=before+1)break;if(s['current location']==='Village')break;}
 assert.ok(lots(s)>=before+1,'kill should leave a carcass lot');note('carcass',{lots:lots(s),kills:s.enemy_killcount});
 if(s['current location']!=='Village')await page.locator('#location_actions_div').getByText('Go back to [Village]',{exact:false}).click();
 await page.locator('#harvest_panel summary').first().click();
 const pre=await save(),species=Object.keys(pre.harvest.lots).find(k=>pre.harvest.lots[k].length);
 await page.locator(`[data-harvest-species="${species}"] [data-harvest-choice="whole"]`).click();const pending=await save();assert.equal(pending.harvest.job.choice,'whole');
 await page.screenshot({path:out+'/hv1-pending-1366.png'});
 await page.reload();await page.locator('#loading_screen_play_button').waitFor();assert.deepEqual(proj(await read()),proj(pending));await page.locator('#loading_screen_play_button').click();
 for(let i=0;i<12&&!((s=await save()).harvest.job===null);i++)await page.waitForTimeout(1000);
 assert.equal(s.harvest.last.choice,'whole');assert.ok(s.harvest.last.outputs.length>=1);assert.ok(proj(s).xp>proj(pending).xp);note('processed',{species,outputs:s.harvest.last.outputs.length,xp:[proj(pending).xp,proj(s).xp]});
 await page.locator('#harvest_panel summary').first().click().catch(()=>{});await page.screenshot({path:out+'/hv1-processed-1366.png'});
 // 4 export, import into second fresh profile
 const done=await save();const dl=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const file=out+'/hv1-export.txt';await (await dl).saveAs(file);const exported=decodeSaveFile(fs.readFileSync(file,'utf8'),'v0.6');assert.deepEqual(proj(exported),proj(done));
 const ctx2=await chromium.launchPersistentContext('/private/tmp/claude-501/hv1-merge-import-'+Date.now(),{channel:'chrome',headless:true,viewport:{width:1366,height:768}});await serve(ctx2);
 const p2=ctx2.pages()[0];p2.on('pageerror',e=>errors.push('import:'+e.message));await p2.goto(origin+'/');await p2.locator('#loading_screen_play_button').click();await p2.locator('#hero_creation_name_field').fill('TEST FIXTURE HV1 IMPORT TARGET');await p2.locator('#hero_creation_panel_confirmation').click();
 await Promise.all([p2.waitForNavigation({waitUntil:'domcontentloaded'}),p2.locator('#saved_file_input').setInputFiles(file)]);
 assert.deepEqual(proj(await p2.evaluate(()=>JSON.parse(localStorage.getItem('save data')))),proj(exported));await p2.locator('#loading_screen_play_button').click();await p2.waitForTimeout(1000);await p2.screenshot({path:out+'/hv1-import-1366.png'});note('secondProfileImport','exact');await ctx2.close();
 assert.deepEqual(errors,[]);note('pageErrors',errors);note('origin',origin);
 fs.writeFileSync(out+'/hv1-browser.json',JSON.stringify(Object.fromEntries(log),null,2));
 }catch(e){await page.screenshot({path:out+'/hv1-fail.png'});console.log('ERRORS',errors);throw e;}finally{await ctx.close();}
})().catch(e=>{console.error('FAIL',e.message.split('\n')[0]);process.exit(1)});
