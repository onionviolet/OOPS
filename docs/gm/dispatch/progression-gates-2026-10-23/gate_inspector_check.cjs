const {launchChrome}=require('/Users/weiwei/code/yet-another-idle-rpg/scripts/ui_helpers.cjs'),assert=require('assert/strict');
const url='http://127.0.0.1:19907/?harvest-inspector=1',out=process.argv[2];
(async()=>{const b=await launchChrome(),errors=[];
const open=async s=>{const c=await b.newContext({viewport:{width:1920,height:1080}});if(s)await c.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s))},s);const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await p.goto(url);await p.getByText('PLAY',{exact:true}).click();if(await p.getByText('Confirm',{exact:true}).isVisible().catch(()=>false))await p.getByText('Confirm',{exact:true}).click();return{c,p}};
const save=async p=>{await p.evaluate(()=>window.saveProgress());return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')))};
try{let{c,p}=await open();const seed=await save(p);await c.close();
seed.inventories.person.main_character[JSON.stringify({id:'Golmoon leaf'})]={count:7};
({c,p}=await open(seed));const before=await save(p);
const panel=p.locator('#harvest_inspector');await panel.waitFor({state:'attached',timeout:15000});
await p.locator('button[data-place-tab="options"]').click();await p.waitForTimeout(400);await panel.locator('summary').first().click();await p.waitForTimeout(800);
const text=await panel.evaluate(n=>n.textContent);const hidden=await p.evaluate(()=>{let n=document.getElementById('harvest_inspector'),h=[];while(n){if(n.hidden||getComputedStyle(n).display==='none')h.push(n.id||n.tagName);n=n.parentElement;}return h;});
assert.match(text,/Progression gates \(GTR\)/);assert.match(text,/frontier\.herb_lesson/);assert.match(text,/waiting/);assert.match(text,/"held\.Golmoon leaf":7/);

await p.evaluate(()=>{const n=document.querySelector('details[data-chain="gates"]');n.scrollIntoView({block:'start'});});await p.waitForTimeout(300);await p.screenshot({path:out});
const after=await save(p);
const strip=s=>{const x=structuredClone(s);delete x['save time'];delete x.current_time;delete x.time;return JSON.stringify(x.inventories)+JSON.stringify(x.expansion?.actors?.player?.facts||x.availabilities)};
assert.equal(strip(after),strip(before),'inspection changed inventory or facts');
console.log(JSON.stringify({ok:true,hidden,errors,gateText:text.slice(text.indexOf('Progression gates'),text.indexOf('Progression gates')+600)},null,1));await c.close()}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
