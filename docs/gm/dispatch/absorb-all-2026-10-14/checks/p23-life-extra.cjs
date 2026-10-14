const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const R=require('/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const URL='http://127.0.0.1:18706/';
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});let ctx,p;const out=[];
async function open(s){if(ctx)await ctx.close();ctx=await b.newContext({viewport:{width:1366,height:768}});p=await ctx.newPage();p.setDefaultTimeout(12000);p.on('pageerror',e=>out.push({error:e.message}));if(s){await p.goto(URL+'style.css');await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),s);}await p.goto(URL,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>document.querySelector('#workspace_current_work')?.textContent.includes('Saving available'),null,{timeout:12000});await R.startFresh(p);await p.locator('#local_life_panel').evaluate(e=>e.open=true);}
async function save(){await p.evaluate(()=>saveProgress());return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));}
await open();const base=await save();let s=structuredClone(base);s['current location']='Shack';s.locations.Shack.is_unlocked=true;s.absorb_local_life.lastClock=null;s.absorb_local_life.lastLocation='Shack';s.absorb_local_life.visitorPending=false;
await open(s);await p.evaluate(()=>{window.__rng=Math.random;Math.random=()=>.999;});
async function travel(to){await p.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();await p.locator(`.action_travel[data-travel="${to}"]`).first().click();await R.waitLocation(p,to);}
await travel('Village');assert.equal((await save()).absorb_local_life.visitorMet,false);await travel('Shack');await p.evaluate(()=>Math.random=()=>0);await travel('Village');await p.evaluate(()=>Math.random=window.__rng);assert.equal((await save()).absorb_local_life.visitorMet,true);
out.push({check:'actual visit roll: miss, revisit, meeting retained',result:'PASS'});
// Controlled actual native combat, using rebuilt combatants and disposable high-health fixture. No claim
// of naturally earning this high-tier route or surviving the entire encounter.
await p.evaluate(async()=>{const m=await import(document.querySelector('script[src*="dist/bundle.js"]').src);window.__main=m;m.process_rewards({rewards:{locations:[{location:'Mysterious gate'}]},source_type:'test',source_name:'disposable browser fixture'});m.change_location({location_id:'Mysterious gate',skip_travel_time:true});const stats=m.current_combat.attackers[0].getFullStats();stats.max_health=100000;stats.health=100000;window.__rng=Math.random;Math.random=()=>0;});
await p.waitForFunction(()=>window.__main.active_effects.Bleeding?.duration>0,null,{timeout:5000});
await p.waitForTimeout(1200);
await p.evaluate(()=>{const m=window.__main;Math.random=window.__rng;window.__bleed=m.active_effects.Bleeding.duration;m.change_location({location_id:'Village',skip_travel_time:true});});
assert.ok(await p.evaluate(()=>window.__bleed>=5&&window.__bleed<=15));assert.ok((await save()).active_effects.Bleeding.duration>0);await p.waitForTimeout(2200);assert.ok(Object.values((await save()).levels).flatMap(Object.values).some(l=>(l.skill_xp['Iron skin']||0)>0));out.push({check:'actual landed guardian hits stack native bleeding, exposure trains Iron skin',result:'PASS'});
await p.screenshot({path:'/tmp/p23-life-extra-desktop.png',fullPage:false});await ctx.close();await b.close();fs.writeFileSync('/tmp/p23-extra-results.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));})().catch(e=>{console.error(e);process.exit(1)});
