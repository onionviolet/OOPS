// A1-A9 desktop presentation gate. A1/A2 use fresh native play.
// A3-A9 use controlled read projections in a separate page, never a player save.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const URL=process.env.URL;if(!URL)throw Error('Set URL to the rebuilt test origin.');
const out=process.env.OUTPUT_DIR||__dirname;
const R=require('/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),ctx=await browser.newContext({viewport:{width:1366,height:768}});
 const p=await ctx.newPage(),errors=[];p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(e.message));
 const results=[];async function group(id,fn){try{await fn();results.push({id,ok:true});console.log('PASS '+id);}catch(e){results.push({id,ok:false,error:e.message});console.log('FAIL '+id+' '+e.message);}}
 const shot=async(page,id)=>{fs.mkdirSync(out,{recursive:true});await page.screenshot({path:path.join(out,id+'.png')});};
 await p.goto(URL,{waitUntil:'domcontentloaded'});await R.startFresh(p);
 await group('A1',async()=>{
  const title=p.locator('.workspace-module[data-module="belongings"] > .workspace-module-header > strong');
  await title.click();assert.equal(await title.getAttribute('aria-expanded'),'false');
  await title.press('Enter');assert.equal(await title.getAttribute('aria-expanded'),'true');
  await title.press('Space');assert.equal(await title.getAttribute('aria-expanded'),'false');
  await title.click();await shot(p,'A1');
 });
 await group('A2',async()=>{
  await R.unlockCombatRoute(p);
  await p.evaluate(()=>{const dock=document.querySelector('.workspace-module[data-module="vitals"]').parentElement;dock.scrollTop=dock.scrollHeight;});
  await R.enterCombat(p);
  const r=await p.locator('.workspace-module[data-module="vitals"]').boundingBox();
  assert(r&&r.y>=0&&r.y+r.height<=768,'health/stamina panel inside desktop viewport');
  await shot(p,'A2');
 });
 const q=await ctx.newPage();q.on('pageerror',e=>errors.push(e.message));
 await q.route('**/reach-fixture',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><script type="importmap">{"imports":{"inkjs":"/node_modules/inkjs/dist/ink.mjs"}}</script><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/styles/workspace.css"><style>#main_content:not(.workspace-active){display:block!important;width:100%;padding:16px;box-sizing:border-box}</style><main id="main_content"><div id="location_actions_div"></div><div id="location_related_div"></div><div id="fixtures"></div></main>'}));
 await q.goto(new globalThis.URL('reach-fixture',URL).href);
 await q.evaluate(async()=>{
  const base=location.origin;window.mods={};
  for(const [key,file] of Object.entries({life:'absorb_c2/local_life',panel:'absorb_c2/panel',practice:'reveal_chain',hints:'structured_reachability',pack:'structured_pack_runtime',ui:'structured_pack_ui',workshop:'systems_workshop_ui',engine:'expansion_engine',content:'expedition_content',sim:'simulation',sw:'systems_workshop_content',career:'village_career',careerUI:'village_career_ui',layout:'workspace_layout'}))mods[key]=await import(base+'/src/'+file+'.js');
  window.fixture=document.getElementById('fixtures');window.reset=()=>{fixture.replaceChildren();};
 });
 await group('A3',async()=>{
  const result=await q.evaluate(()=>{
   reset();const d={items:[{id:'cloth',label:'Known cloth'}],abilities:[{commandId:'act',control:{fact:'actor.control',op:'gte',value:3}}],expeditions:[{prepareId:'act',injuryKey:'injury'}]};
   const costs=[{type:'item',key:JSON.stringify({id:'cloth'}),amount:-2}],cmd={id:'act',costs};
   const hints=mods.hints.structuredReachabilityHints(d,cmd,{'actor.control':1,'actor.injury':1});
   const quotes=mods.pack.structuredActionCosts({eligible:false,costs},d);
   window.candidatePanel=mods.ui.createStructuredPackPanel({read:()=>({available:true,active:true,title:'Controlled known-action projection',canWrite:true,actions:[{id:'act',label:'Prepare known work',eligible:false,duration:2,reasons:hints,costs:quotes}],jobs:[]}),command:()=>{}});
   return {hints,quotes};
  });
  assert.match(result.hints.join(' '),/1 \/ 3/);assert.match(result.hints.join(' '),/Treat/);assert.match(result.hints.join(' '),/0 \/ 2/);assert.deepEqual(result.quotes,['2 × Known cloth']);assert(await q.locator('[data-structured-action="act"]').isDisabled());await shot(q,'A3');await q.evaluate(()=>candidatePanel.destroy());
 });
 await group('A4',async()=>{
  await q.evaluate(()=>{reset();window.lifeState={pamphletRead:true};window.context={worldId:'base.frontier',location:'Village',idle:true,alive:true,calendarMinute:480,clock:480,millUnlocked:false};window.lifePanel=mods.panel.createLocalLifePanel({container:fixture,read:()=>({state:lifeState,context}),act:()=>({})});lifePanel.panel.open=true;});
  const parcel=q.locator('[data-local-life-action="parcel"]');assert(await parcel.isDisabled());assert.match(await parcel.innerText(),/Cave room.*report/);
  const text=await q.evaluate(()=>mods.life.localLifeQuestView(lifeState,context).find(x=>x.id==='village.parcel').objective);assert.match(text,/Cave room.*report/);await shot(q,'A4');
 });
 await group('A5',async()=>{
  await q.evaluate(()=>{
   reset();const {expeditionRegistry:R,initializeExpedition}=mods.content,{SW}=mods.sw;
   let p={state:initializeExpedition(mods.engine.createExpansionState(17)),external:{money:5},gameplay:{player:{inventory:{},skills:{},reputation:{Village:0}},oldCraftsman:{inventory:{},skills:{},reputation:{}}}};
   const ctx=()=>({actorId:'player',external:p.external,gameplay:p.gameplay,facts:{location:'Village'}});
   p=mods.sim.enrollSimulation(p.state,R,ctx());
   const join=R.simulation.commands.get(SW+'.join');p=mods.sim.commitSimulationCommand(p.state,R,{id:join.id,targetId:join.targetId},{...ctx(),targetId:join.targetId},p.state.sequence);
   window.workshop=mods.workshop.createSystemsWorkshopPanel({parent:fixture,registry:R,read:()=>({state:p.state,context:ctx(),enabled:true}),act:()=>{}});document.getElementById('systems_workshop_panel').open=true;
  });
  assert(await q.locator('#systems_workshop_next').getByText('Accept: make a survey kit, earn 10 grant points',{exact:true}).isVisible());
  const later=q.getByText('Learning, assistance, irrigation and optional actions',{exact:true});await later.click();assert(await q.getByText('Learn permanent seam reading · 3 points',{exact:true}).isVisible());await shot(q,'A5');
 });
 await group('A6',async()=>{
  await q.evaluate(()=>{
   reset();window.practiceView={progress:{Running:{current_level:1}},run:true,reason:'',runFallback:true,search:{on:false,reason:''},recipe:false};
   window.practice=mods.practice.createPracticePanel({read:()=>practiceView,toggleRun:()=>{practiceView.run=false;practiceView.reason='Requires 2 stamina for a journey; travel falls back to walking.';},investigate:()=>{},craft:()=>{},register:()=>{},update:()=>{}});
  });
  const run=q.locator('[data-practice-action="run"]');assert(await run.isEnabled());assert.match(await q.locator('#practice_capabilities').innerText(),/falls back to walking/);await shot(q,'A6');await run.click();assert.match(await run.innerText(),/off/);assert(await run.isDisabled());
 });
 await group('A7',async()=>{
  await q.evaluate(()=>{
   reset();let state=mods.career.finishVillageShift(mods.career.beginVillageShift(mods.career.createVillageCareer()),true);
   window.careerControls=mods.careerUI.createVillageCareerControls({read:()=>({visible:true,state,canWrite:true,busy:false,study:{known:false,practiced:false,practiceMinutes:0,executable:false,nextPatrol:false}}),resolve:choice=>{state=mods.career.resolveVillageKit(state,choice);},promote:()=>{},notes:()=>{},readNotes:()=>{},practice:()=>{},mentor:()=>{},tutor:()=>{}});
   mods.layout.mountWorkspace();mods.layout.updateWorkspace();
  });
  await q.locator('#village_patrol_custody_link').click();assert(await q.locator('#village_return_kit').isVisible());await shot(q,'A7');await q.locator('#village_return_kit').click();assert(await q.locator('#village_patrol_custody_link').isHidden());
  await q.evaluate(()=>careerControls.destroy());
 });
 await group('A8',async()=>{
  const hints=await q.evaluate(()=>{
   const hints=mods.practice.knownPracticeHints({Perception:{total_xp:41.41,current_xp:41.41,current_level:0,xp_to_next_lvl:100}},{a:{item:{id:'Golmoon leaf'},count:3}});
   practiceView.progress={};practiceView.hints=hints;practice.render();return hints;
  });
  assert.match(hints.join(' '),/41.41 \/ 100/);assert.match(hints.join(' '),/3 \/ 20/);assert.doesNotMatch(hints.join(' '),/Investigate|Weak healing powder|Forest road/);await shot(q,'A8');
 });
 await group('A9',async()=>{
  await q.evaluate(()=>{reset();document.getElementById('practice_capabilities')?.remove();document.getElementById('learned_preparations')?.remove();context.calendarMinute=719;lifePanel=mods.panel.createLocalLifePanel({container:fixture,read:()=>({state:lifeState,context}),act:()=>({})});lifePanel.panel.open=false;});
  await q.getByText('Remind me about recurring bread',{exact:true}).click();assert.match(await q.locator('#local_food_reminder').innerText(),/opens in 1 minutes/);
  await q.evaluate(()=>{context.calendarMinute=720;lifePanel.render();});assert.match(await q.locator('#local_food_reminder').innerText(),/Available now/);await shot(q,'A9');
  await q.getByText('Dismiss bread reminder',{exact:true}).click();assert(await q.locator('#local_food_reminder').isHidden());
 });
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({viewport:{width:1366,height:768},results,pageErrors:errors},null,2));
 await ctx.close();await browser.close();if(results.some(r=>!r.ok))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1);});
