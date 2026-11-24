// MKC86 mock proof: forge method on the Gear workshop row (mock) or today's selects (master), same fixture and seed.
const path=require('node:path'),fs=require('node:fs');const T=process.argv[2],OUT=process.argv[3],MODE=process.argv[4];
const {serveCheckout,fixtureSave,openFixture,openPanel}=require(path.join(T,'scripts/fixture_browser.cjs'));
const {runBrowser}=require(path.join(T,'scripts/ui_helpers.cjs'));
(async()=>{const srv=await serveCheckout(T);const log=[],errs=[];let clicks=0;
const click=async loc=>{clicks++;await loc.click();await new Promise(r=>setTimeout(r,250));};
const stages=async p=>p.evaluate(()=>Object.entries(window.simulationTestHooks.snapshot().inventories.person.main_character).filter(([k])=>k.includes('Iron long blade')).map(([k,r])=>[JSON.parse(k).gearwork?.treatment?.stage||'cold',r.count]));
try{await runBrowser(async b=>{
const save=JSON.parse(await fixtureSave('frontier-hunt-ready'));const inv=save.inventories.person.main_character;
inv[JSON.stringify({id:'Iron sword',quality:100})]={count:3};inv[JSON.stringify({id:'Charcoal'})]={count:12};inv[JSON.stringify({id:'Lamp oil'})]={count:4};inv[JSON.stringify({id:'Rough wood log'})]={count:6}; // DEV SEEDED
const open=async text=>{const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>errs.push(String(e)));
  await openFixture(p,{base:srv.base,name:'frontier-hunt-ready',text});await p.waitForTimeout(600);return p;};
let p=await open(JSON.stringify(save));
if(MODE==='master'){
  await openPanel(p,'gear-workshop');clicks++;const g=p.locator('#gear_workshop');await g.waitFor({state:'visible',timeout:20000});
  const sel=async(label,valueFn)=>{const s=g.locator(`select[aria-label="${label}"]`);const opts=await s.locator('option').evaluateAll(o=>o.map(x=>[x.value,x.textContent]));const v=valueFn(opts);clicks++;await s.selectOption(v);await p.waitForTimeout(150);};
  for(let n=0;n<3;n++){
    await sel('Carried gear',o=>o.find(x=>x[0]&&!x[0].includes('gearwork'))[0]);
    for(const a of ['heat','shape','quench','temper']){await sel('Gear process',()=>a);if(a==='quench')await sel('Process material',o=>o.find(x=>/Lamp oil/.test(x[1]))[0]);
      const run=g.locator('[data-gear-commit]');if(await run.isDisabled()){log.push(['refused',a,await g.locator('#gear-workshop-quote').innerText()]);break;}await click(run);}
    log.push([`after sword ${n+1}`,{clicks,stages:await stages(p)}]);}
  await p.screenshot({path:path.join(OUT,'master_workshop.png')});
} else {
  const row=p.locator('[data-station-slot="gear-workshop"]').locator('xpath=..');
  await row.waitFor({state:'visible',timeout:20000});
  log.push(['row before',await row.innerText()]);
  await row.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(OUT,'mock_row.png')});
  await click(row.locator('.forge-unfold'));
  const step=()=>row.locator('[data-work-step] button');
  log.push(['card step',await step().innerText()]);await p.screenshot({path:path.join(OUT,'mock_card.png')});
  await click(step());await click(step());
  log.push(['after heat+shape',{line:await row.locator('button[data-inspect-nearby] small').innerText(),step:await step().innerText(),stages:await stages(p)}]);
  // Save and reload mid-method: the step pointer comes from the item's own saved treatment stage.
  const snap=await p.evaluate(()=>JSON.stringify(window.simulationTestHooks.snapshot()));await p.close();
  p=await open(snap);const row2=p.locator('[data-station-slot="gear-workshop"]').locator('xpath=..');await row2.waitFor({state:'visible',timeout:20000});
  log.push(['after reload, row',await row2.innerText()]);
  await click(row2.locator('.forge-unfold'));const step2=()=>row2.locator('[data-work-step] button');
  log.push(['after reload, card step',await step2().innerText()]);
  await click(step2());await click(step2());
  log.push(['one sword done',{clicks,stages:await stages(p),next:await row2.locator('[data-bench-part="next"]').innerText()}]);
  await row2.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(OUT,'mock_card_done.png')});
  await click(row2.locator('[data-work-layer="save"] button'));
  log.push(['saved',await row2.locator('[data-work-notice]').innerText()]);
  await click(row2.locator('.forge-again'));
  log.push(['quick x2',{clicks,notice:await row2.locator('[data-work-notice]').innerText(),stages:await stages(p)}]);
  await row2.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(OUT,'mock_quick.png')});
  await click(row2.locator('[data-work-layer="centre"] button'));await p.waitForTimeout(400);
  log.push(['centre',{frames:await p.locator('[data-work-frame]').count(),sizes:await p.locator('[data-work-frame]').evaluateAll(n=>n.map(x=>x.dataset.workSize)),slotText:await row2.locator('[data-station-slot]').innerText()}]);
  await p.screenshot({path:path.join(OUT,'mock_centre.png')});
  const snap2=await p.evaluate(()=>JSON.stringify(window.simulationTestHooks.snapshot()));const p3=await open(snap2);
  log.push(['reload after quick',{stages:await stages(p3),row:await p3.locator('[data-station-slot="gear-workshop"]').locator('xpath=..').innerText()}]);
  await openPanel(p3,'rune-bench');const rb=p3.locator('#rune_bench_panel');await rb.waitFor({state:'visible',timeout:20000});
  await rb.locator('button[data-rune]').nth(0).click();await rb.locator('button[data-rune]').nth(1).click();await p3.waitForTimeout(300);
  log.push(['rune frame',{frames:await rb.locator('[data-work-frame]').evaluateAll(n=>n.map(x=>[x.dataset.workForm,x.dataset.workSize])),parts:await rb.locator('[data-work-frame] [data-bench-part]').evaluateAll(n=>n.map(x=>x.dataset.benchPart))}]);
  await rb.locator('[data-work-frame]').scrollIntoViewIfNeeded();await p3.screenshot({path:path.join(OUT,'mock_rune.png')});
  await rb.locator('button[data-carve]').click();await p3.waitForTimeout(300);
  log.push(['rune after carve, next',await rb.locator('[data-bench-part="next"]').innerText()]);
  const fp=await p3.evaluate(()=>{const f=document.querySelector('#rune_bench_panel [data-work-frame]');return f?[...f.children].map(c=>c.className):null;});log.push(['rune frame columns',fp]);
}});}finally{srv.close();}
fs.writeFileSync(path.join(OUT,`proof_${MODE}.json`),JSON.stringify({clicks,log,errs},null,1));console.log(JSON.stringify({clicks,log,errs},null,1));})().catch(e=>{console.error(e);process.exit(1);});
