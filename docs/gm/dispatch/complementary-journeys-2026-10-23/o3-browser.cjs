const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('o3-reviewed-absence',async h=>{
 const {p,boot,enroll,save,load,roundtrip,assert,gates}=h;
 await p.setViewportSize({width:1920,height:1080});let s=await boot();
 s.inventories.person.main_character['{"id":"Rough wood log"}']={count:6};s.character.money=10;
 await load(s,'ordinary-prepaid-supplies');await enroll();const initial=await save();
 const open=async()=>{
  await p.evaluate(()=>{const n=document.querySelector('[aria-label="Other known panels"]');n.value='notebook';n.dispatchEvent(new Event('change',{bubbles:true}));});
  await p.locator('[data-notebook-view="here"]').click();
  await p.evaluate(()=>document.querySelectorAll('#backlog_expansion_panel details,#backlog_expansion_panel').forEach(d=>d.open=true));
 };
 const click=async id=>{await open();const b=p.locator(`#backlog_expansion_panel [data-backlog-action="backlog.offline.${id}"]`);assert.equal(await b.isEnabled(),true,await b.locator('..').innerText());await b.press('Enter');console.log('packing',id);};
 await click('arm');const armed=await save(),clock=armed.expansion.clock;
 assert.equal(armed.character.money,7);assert.equal(armed.inventories.person.main_character['{"id":"Rough wood log"}'].count,3);
 // The game document is absent during real wall time. No elapsed fixtures or grants.
 await p.goto('about:blank');await p.waitForTimeout(7000);await p.goto(process.env.URL+'?test_hooks=1');
 await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.evaluate(()=>simulationTestHooks.pause());
 s=await save();assert.equal(s.expansion.clock,clock,'ordinary game time remains paused before review');assert.equal(s.expansion.backlog.offline.packed,0);
 await click('request');s=await save();assert.equal(s.expansion.clock,clock+6);assert.equal(s.expansion.backlog.offline.status,'completed');
 assert.equal(s.expansion.backlog.offline.packed,3);assert.deepEqual(s.expansion.backlog.offline.escrow,{logs:0,coins:0});
 const kit='{"id":"Prepared survey kit"}',before=initial.inventories.person.main_character[kit]?.count||0;
 assert.equal(s.inventories.person.main_character[kit].count,before+3);assert.equal(s.character.money,7);
 assert.match(await p.locator('#backlog_expansion_panel').innerText(),/6 credited/);
 await roundtrip('completed-prepaid-return',s=>({packing:s.expansion.backlog.offline,stock:s.inventories.person.main_character,money:s.character.money}));
 await open();assert.equal(await p.locator('#backlog_expansion_panel [data-backlog-action="backlog.offline.request"]').isEnabled(),false);
 // Independent interruption branch from the same pre-arm save, not another grant.
 await load(initial,'packing-cancel-branch');await click('arm');await click('pause');
 s=await save();assert.equal(s.expansion.backlog.offline.status,'paused');assert.equal(s.expansion.backlog.offline.packed,0);
 await roundtrip('paused-prepaid-return',s=>({packing:s.expansion.backlog.offline,stock:s.inventories.person.main_character,money:s.character.money}));
 await click('resume');await click('cancel');s=await save();assert.equal(s.expansion.backlog.offline.status,'cancelled');
 assert.equal(s.character.money,10);assert.equal(s.inventories.person.main_character['{"id":"Rough wood log"}'].count,6);
 await open();assert.equal(await p.locator('#backlog_expansion_panel [data-backlog-action="backlog.offline.cancel"]').isEnabled(),false);
 await roundtrip('cancelled-prepaid-return',s=>({packing:s.expansion.backlog.offline,stock:s.inventories.person.main_character,money:s.character.money}));
 gates.push('Game document absent for actual wall interval; no automatic reward; reviewed finite prepaid output advances shared time once; pause/resume/cancel refunds unused inputs once; all three persistence boundaries. This is the existing original packing policy, not general offline automation.');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
