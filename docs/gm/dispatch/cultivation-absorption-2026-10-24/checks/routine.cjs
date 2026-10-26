const gate=require('../../cultivation-spacing-2026-10-22/browser-helper.cjs');
const routes=require('../../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
gate('routine',async h=>{
 const {p,assert,boot,load,save,played,gates,fs,roundtrip,path,out}=h;await p.setViewportSize({width:1920,height:1080});await boot();
 const raw=fs.readFileSync('/Users/weiwei/.codex/research/cultivation-absorption-2026-10-24/browser/slice1.save.txt','utf8').trim().replace(/^YAIR-UTF8-1:/,'');let s=JSON.parse(Buffer.from(raw,'base64').toString());s.inventories.person.main_character['{"id":"Stale bread"}']={count:6};await load(s,'earned-grade-ordinary-rations');
 const open=()=>p.getByRole('combobox',{name:'Other known panels'}).selectOption('pledges');await open();await p.getByRole('spinbutton',{name:'Maximum failure risk (%)'}).fill('0');await p.getByRole('spinbutton',{name:'Rations to keep untouched'}).fill('1');await p.locator('[data-trial-routine]').click();await played(1);s=await save();assert.equal(s.pledges.routine.enabled,false);assert.equal(s.inventories.person.main_character['{"id":"Stale bread"}'].count,6);
 await p.keyboard.press('Escape');await p.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();await p.locator('.action_travel[data-travel="Infested field"]').first().click();
 for(let n=0;n<100;n++){
  if(await p.evaluate(()=>simulationTestHooks.project('pledges').trial.ready))break;
  s=await save();if(s['current location']==='Village'){await played(30);await p.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();await p.locator('.action_travel[data-travel="Infested field"]').first().click();}
  await played(5);
 }
 assert.equal(await p.evaluate(()=>simulationTestHooks.project('pledges').trial.ready),true,'ordinary hunts earn next-stage readiness');await routes.leaveCombat(p);await open();await p.locator('[data-trial-routine]').click();await played(1);s=await save();assert.equal(s.pledges.trial.stage,2);assert.equal(s.pledges.routine.enabled,false);assert.equal(s.inventories.person.main_character['{"id":"Stale bread"}'].count,1);assert.equal(s.pledges.trial.last.risk,0);
 await roundtrip('bounded-earned-routine',s=>s.pledges);await open();await p.screenshot({path:path.join(out,'routine-1920.png')});gates.push('Naturally earned graded prerequisite and Combat readiness; zero-risk/reserve-limited scheduling waits without spending, then exact funded guarded attempt stops for review and persists; ordinary ration fixture only');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
