import {createServer} from 'node:http';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {createRequire} from 'node:module';
const require = createRequire('/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/youthful-visvesvaraya-379d2a/scripts/x.cjs');
const {launchChrome} = require('./ui_helpers.cjs');
const root = process.argv[2], out = process.argv[3];
await mkdir(out, {recursive: true});
const types = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
const server = createServer(async (req,res)=>{const p=resolve(root,'.'+new URL(req.url,'http://l').pathname.replace(/\/$/,'/index.html'));let b;try{b=await readFile(p);}catch{res.writeHead(404).end();return;}res.writeHead(200,{'content-type':types[extname(p)]||'application/octet-stream'}).end(b);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await launchChrome();
const log={};
try{
 const page=await (await browser.newContext({viewport:{width:1920,height:1080}})).newPage();
 const errs=[];page.on('pageerror',e=>errs.push(e.message));
 await page.goto(`${base}/?test_hooks=1`);
 await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});
 await page.locator('#loading_screen_play_button').click();
 if(await page.locator('#hero_creation_panel_confirmation').isVisible()) await page.locator('#hero_creation_panel_confirmation').click();
 await page.waitForTimeout(900);
 const door=()=>page.evaluate(()=>{const d=document.querySelector('[data-lotm-door]');return d?{inDom:true,visible:d.getBoundingClientRect().width>0,text:d.innerText}:{inDom:false}});
 log.probe=await page.evaluate(()=>({attr:document.getElementById('main_content').dataset.firstHourStep,nextStep:!!document.getElementById('next_step'),hidden:document.getElementById('next_step')?.hidden,disp:getComputedStyle(document.querySelector('[data-lotm-door]')).display,withAttr:[...document.querySelectorAll('[data-first-hour-step]')].map(n=>n.id||n.tagName)}));console.log(JSON.stringify(log.probe));
 log.doorMinuteZero=await door();
 log.actionsMinuteZero=(await page.locator('#location_actions_div').innerText()).replace(/\n/g,' | ');
 await page.screenshot({path:out+'/minute-zero.png'});
 // known places
 await page.keyboard.press('Control+k');await page.waitForTimeout(300);
 await page.keyboard.type('Place ·');await page.waitForTimeout(400);
 log.knownPlaces=await page.evaluate(()=>[...document.querySelectorAll('#command_palette_list li[role=option]')].map(li=>li.textContent.trim()));
 await page.screenshot({path:out+'/palette-places.png'});
 await page.keyboard.press('Escape');await page.keyboard.press('Escape');await page.waitForTimeout(300);await writeFile(out+'/log3.json',JSON.stringify(log,null,1));
 // meet the elder
 const actions=page.locator('#location_actions_div');
 await actions.getByText('Talk to someone',{exact:false}).first().click();await page.waitForTimeout(300);
 await actions.getByText('Talk to village elder',{exact:false}).first().click();await page.waitForTimeout(300);
 const hello=actions.locator('.dialogue_textline[data-textline="hello"]');await hello.waitFor({state:'visible'});await hello.evaluate(n=>n.click());await hello.waitFor({state:'detached'});
 {const w=actions.locator('.dialogue_textline[data-textline="what happened"]');await w.waitFor({state:'visible',timeout:5000}).catch(()=>{});if(await w.count()){await w.evaluate(n=>n.click());await page.waitForTimeout(300);}}
 await page.evaluate(()=>end_dialogue());await page.evaluate(()=>advanceTicks(3));await page.waitForTimeout(1500);
 log.doorAfterElder=await door();log.afterProbe=await page.evaluate(()=>({attr:document.getElementById('main_content').dataset.firstHourStep||null,next:document.getElementById('next_step')?.innerText}));
 await page.screenshot({path:out+'/after-elder.png'});
 await actions.getByText('Cross to another world',{exact:false}).first().click();await page.waitForTimeout(600);await page.screenshot({path:out+'/entry-compare.png'});log.compare=await page.evaluate(()=>document.querySelector('[data-start-compare]')?.innerText||null);
 log.errs=errs;
 await writeFile(out+'/log3.json',JSON.stringify(log,null,1));
 console.log(JSON.stringify(log,null,1));
}finally{await browser.close();server.close();}
