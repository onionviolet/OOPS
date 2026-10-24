// A3 (warmhand), A5 (lanternloan: borrowed power), O1 (slakebench: reagent -> heat -> press). Usage: node a_powers.cjs <warmhand|lanternloan|slakebench>
// Entry: localhost ?structured_candidate=<id> (existing local authoring-preview switch), nav "Beginning" panel, "Begin", then the pack's own action buttons.
// Hooks: ?test_hooks=1 dev-stepped minutes only. Buttons are activated with focus + Enter because the shell resize handle intercepts mouse clicks on them at 1920x1080 (reported as a layout defect).
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {run,out}=require('./lib.cjs');
const {advanceGameMinutes}=require('../../../../../scripts/ui_helpers.cjs');
const id=process.argv[2];
const plans={
 warmhand:['warmhand.warm','warmhand.practice','warmhand.practice','warmhand.warm_batch'],
 lanternloan:['lanternloan.see'],
 slakebench:['slakebench.slake','slakebench.bake'],
};
run('a-'+id,'structured_candidate='+id,async({page,url,shot,say})=>{
 const play=async()=>{await page.getByText('PLAY',{exact:true}).click();await page.waitForTimeout(1500);};
 const openBeginning=async()=>{if(!await page.locator('#structured_pack_panel').isVisible()){await page.locator('button:text-is("Beginning")').first().click();await page.waitForTimeout(600);}};
 const press=async loc=>{await loc.focus();await page.keyboard.press('Enter');await page.waitForTimeout(500);};
 const txt=async()=>{await openBeginning();return page.locator('#structured_pack_panel').innerText();};
 const settle=async()=>{for(let i=0;i<12;i++){if(!await page.locator('[data-structured-cancel]:visible').count())return;await advanceGameMinutes(page,1);await page.waitForTimeout(200);}};
 await page.goto(url);await play();await openBeginning();await shot('1-offer');say('OFFER',await txt());
 await press(page.locator('[data-structured-begin]'));await page.waitForTimeout(1000);await shot('2-begun');const t0=await txt();say('BEGUN',t0);
 say('buttons',await page.locator('#structured_pack_panel button').evaluateAll(b=>b.map(x=>(x.dataset.structuredAction||x.dataset.structuredRepeat||x.textContent)+(x.disabled?'(dis)':''))));
 let n=3;const log=[];
 for(const a of plans[id]){
  await advanceGameMinutes(page,22);await page.waitForTimeout(300);
  const b=page.locator(`[data-structured-action="${a}"]`);
  if(await b.isDisabled().catch(()=>true)){log.push(a+': DISABLED '+(await b.locator('xpath=ancestor::*[1]').innerText().catch(()=>'')).slice(-160));continue;}
  await press(b);await settle();log.push(a+': pressed');await shot(`${n++}-${a.split('.').pop()}`);say(a,(await txt()).slice(0,1400));
 }
 say('action log',log);
 // persistence
 await page.evaluate(()=>window.saveProgress());const s1=await txt();
 await page.reload();await play();const s2=await txt();const norm=t=>t.replace(/\d+ game minutes/g,'N game minutes');say('after reload equal (cooldown minute counter normalised)',norm(s1)===norm(s2));await shot(`${n++}-after-reload`);
 const encoded=await page.evaluate(()=>window.save_to_file());
 await Promise.all([page.waitForNavigation(),page.locator('#saved_file_input').setInputFiles({name:`generated-${id}.txt`,mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
 await play();const s3=await txt();say('after import equal (normalised)',norm(s1)===norm(s3));await shot(`${n++}-after-import`);
 fs.writeFileSync(path.join(out,`a-${id}-results.json`),JSON.stringify({log,t0,s1,s2,s3},null,1));
 assert.ok(!log.some(l=>l.includes('DISABLED'))||id==='warmhand','an action was disabled');
});
