// Check the actual earned matching XP as well as stock through repeated Import.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const file=path.join(__dirname,'function-complete.save.txt');
const expected=JSON.parse(Buffer.from(fs.readFileSync(file,'utf8').trim().split(':')[1],'base64').toString('utf8'));
const pick=s=>({levels:s.levels,xp:s.character.xp,money:s.character.money,inventory:s.inventories.person.main_character,completed:s.expansion.actors.player.completed});
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});try{
 const p=await b.newPage({viewport:{width:1366,height:768}});p.setDefaultTimeout(15000);p.on('dialog',d=>d.accept());
 await p.goto('http://127.0.0.1:8200/style.css');await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),expected);
 await p.clock.install({time:new Date('2026-10-14T12:00:00Z')});await p.clock.pauseAt(new Date('2026-10-14T12:00:01Z'));
 const start=async()=>{const now=await p.evaluate(()=>Date.now());await p.clock.pauseAt(new Date(now+50));await p.locator('#loading_screen_play_button').click();};
 const save=async()=>{await p.locator('#save_button').click();return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 await p.goto('http://127.0.0.1:8200',{waitUntil:'domcontentloaded'});await start();assert.deepEqual(pick(await save()),pick(expected));
 await p.reload({waitUntil:'domcontentloaded'});await start();assert.deepEqual(pick(await save()),pick(expected));
 for(let n=0;n<2;n++){const loaded=p.waitForEvent('load');await p.locator('#saved_file_input').setInputFiles(file);await loaded;await start();assert.deepEqual(pick(await save()),pick(expected));}
 const result={status:'PASS',checks:'Native skill levels/XP, character XP, money, inventory and completion counters match the earned Export after load, reload and two literal Imports',woodworking:expected.levels.person.main_character.skill_xp.Woodworking || 0};
 fs.writeFileSync(path.join(__dirname,'rewards.json'),JSON.stringify(result,null,2)+'\n');console.log('PASS native-XP-and-stock-repeated-literal-import',JSON.stringify(result));
 }finally{await b.close();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
