const gate=require('../../cultivation-spacing-2026-10-22/browser-helper.cjs');
const routes=require('../../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
gate('trial-variants',async h=>{
 const {p,assert,boot,load,save,roundtrip,gates,fs}=h;
 await p.setViewportSize({width:1920,height:1080});await boot();
 const earned=JSON.parse(fs.readFileSync('/Users/weiwei/.codex/research/cultivation-absorption-2026-10-24/browser/earned-readiness.json','utf8'));
 await load(earned,'earned-natural-combat-readiness');await routes.leaveCombat(p);const start=await save();
 const open=()=>p.getByRole('combobox',{name:'Other known panels'}).selectOption('pledges');await open();
 await p.locator('[data-ordeal-begin="pole"][data-ordeal-rations="0"]').click();
 for(let i=0;i<12;i++){const s=await save();if(!s.pledges.ordeal)break;await p.locator('[data-ordeal-step="press"]').click();}
 let s=await save();assert.equal(s.pledges.trial.stage,0);assert.ok(s.pledges.trial.learning>0);const learning=s.pledges.trial.learning;
 for(let i=0;i<2;i++)await p.locator('[data-calm]').click();s=await save();assert.equal(s.pledges.trial.pressure,0);assert.equal(s.pledges.trial.learning,learning);
 await roundtrip('weapon-failure-learning',s=>s.pledges);
 // Independent disposable branch from the same naturally earned prefix.
 await load(start,'earned-readiness-guarded-branch');await open();const before=await save();await p.locator('[data-guarded-tempering]').click();s=await save();assert.equal(s.pledges.trial.stage,1);assert.equal(s.pledges.trial.last.risk,0);assert.equal(s.pledges.trial.quality??0,0);
 const bread=x=>x.inventories.person.main_character['{"id":"Stale bread"}']?.count??0;assert.equal(bread(before)-bread(s),5);await roundtrip('guarded-preparation',s=>s.pledges);
 gates.push('Actual equipped-spear trial collapse, retained failure learning after calming, and separate exact five-ration guaranteed route; naturally earned prerequisite prefix, no new progression grants');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
