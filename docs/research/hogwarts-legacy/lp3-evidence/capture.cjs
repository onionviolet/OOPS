// Review the actual earned completed Export on the same isolated lane origin.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});try{
const text=fs.readFileSync(path.join(__dirname,'practice-complete.save.txt'),'utf8').trim(),s=JSON.parse(Buffer.from(text.split(':')[1],'base64'));
const c=await b.newContext({viewport:{width:1366,height:768}}),p=await c.newPage();
await p.goto('http://127.0.0.1:8196/style.css');await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),s);await p.clock.install({time:new Date('2026-10-14T12:00:00Z')});await p.clock.pauseAt(new Date('2026-10-14T12:00:01Z'));await p.goto('http://127.0.0.1:8196');await p.locator('#loading_screen_play_button').click();await p.locator('#notebook_tab_here').click();
await p.locator('#field_panel').evaluate(e=>{for(let n=e;n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;for(const d of e.querySelectorAll('details'))d.open=d.querySelector('summary')?.textContent.includes('Wedged timber');});
const learned=p.locator('#field_panel p').filter({hasText:'Learned from the old craftsman in Village at played minute'});await learned.scrollIntoViewIfNeeded();assert.match(await learned.innerText(),/Learned from the old craftsman/);await p.screenshot({path:path.join(__dirname,'07-learned-task.png')});
await p.locator('#save_button').click();const now=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.equal(now.expansion.actors.player.completed['field.lp1.practice'],1);assert.equal(now.inventories.person.main_character[JSON.stringify({id:'Lever practice brace'})],undefined);assert.equal(now.inventories.person.main_character[JSON.stringify({id:'Prepared survey kit'})].count,1);console.log('PASS earned completed state and learned UI screenshot');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
