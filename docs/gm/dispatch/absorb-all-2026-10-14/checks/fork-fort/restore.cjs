// Targeted completion of literal-file import/reload gates against the route's actual export.
global.fetch=undefined;
const fs=require('fs'),assert=require('assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const URL=process.env.YAIRPG_PROOF_URL || 'http://127.0.0.1:18704/',out=process.env.YAIRPG_PROOF_DIR || __dirname,errors=[],results=[];
const pass=(id,detail)=>{results.push({id,detail});console.log('PASS',id,detail)};
const count=s=>Object.entries(s.inventories.person.main_character).filter(([k])=>JSON.parse(k).id==='Frontier fort keeper journal').reduce((n,[,v])=>n+v.count,0);
async function play(p){await p.locator('#loading_screen_play_button:not(.none_display)').click();const c=p.locator('#hero_creation_panel_confirmation');if(await c.isVisible())await c.click();await p.locator('#location_name_span').filter({hasText:/Village|Fort/}).waitFor({state:'visible'});}
(async()=>{const encoded=fs.readFileSync(out+'/completed.save.txt','utf8');const bytes=Buffer.from(encoded.slice('YAIR-UTF8-1:'.length),'base64');const original=JSON.parse(bytes.toString('utf8'));const b=await chromium.launch({headless:true,channel:'chrome'});const ctx=await b.newContext({viewport:{width:1366,height:768}});const p=await ctx.newPage();p.setDefaultTimeout(30000);p.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.stack)});
try{await p.goto(URL,{waitUntil:'domcontentloaded'});await play(p);
 const nav=p.waitForEvent('framenavigated',{predicate:f=>f===p.mainFrame(),timeout:65000});
 await p.locator('#saved_file_input').setInputFiles({name:'Fort-test-save.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)});
 await nav;await play(p);await p.evaluate(()=>saveProgress());let s=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 assert.equal(s.quests['frontier.fort.quest'].is_finished,true);assert.equal(count(s),1);assert.equal(s.locations['Fort dungeon'].enemy_groups_killed,original.locations['Fort dungeon'].enemy_groups_killed);assert.equal(s.locations['Fort dungeon'].enemy_groups_killed,8);
 pass('literal_file_import','actual route export restored: finished quest, one journal, eight dungeon groups');
 await p.reload({waitUntil:'domcontentloaded'});await play(p);await p.evaluate(()=>saveProgress());s=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.equal(s.quests['frontier.fort.quest'].is_finished,true);assert.equal(count(s),1);assert.equal(s.locations['Fort dungeon'].enemy_groups_killed,8);pass('completed_reload_no_replay','quest, journal and second-clear count remain exact');
 assert.deepEqual(errors,[]);pass('page_errors','zero runtime page errors across import/reload');fs.writeFileSync(out+'/restore-results.json',JSON.stringify({viewport:[1366,768],results},null,2));
}catch(e){console.error('RESTORE FAILURE',e);console.log((await p.locator('body').innerText()).split('\n').filter(t=>/Import|reject|incompatible|kept|load/i.test(t)).join('\n'));throw e;}finally{await ctx.close();await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
