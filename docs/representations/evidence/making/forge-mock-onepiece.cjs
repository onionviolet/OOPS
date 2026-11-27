// One real workpiece through the forge card: selected input, cost, changed property per step, then the finished result.
const path=require('node:path'),fs=require('node:fs');const T=process.argv[2],OUT=process.argv[3];
const {serveCheckout,fixtureSave,openFixture}=require(path.join(T,'scripts/fixture_browser.cjs'));
const {runBrowser}=require(path.join(T,'scripts/ui_helpers.cjs'));
(async()=>{const srv=await serveCheckout(T);const log=[],errs=[];try{await runBrowser(async b=>{
const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>errs.push(String(e)));
const save=JSON.parse(await fixtureSave('frontier-hunt-ready'));const inv=save.inventories.person.main_character;
inv[JSON.stringify({id:'Iron sword',quality:100})]={count:1};inv[JSON.stringify({id:'Charcoal'})]={count:4};inv[JSON.stringify({id:'Lamp oil'})]={count:1}; // DEV SEEDED
await openFixture(p,{base:srv.base,name:'frontier-hunt-ready',text:JSON.stringify(save)});await p.waitForTimeout(600);
const row=p.locator('[data-station-slot="gear-workshop"]').locator('xpath=..');await row.waitFor({state:'visible',timeout:20000});
await row.locator('.forge-unfold').click();await p.waitForTimeout(300);
const card=row.locator('[data-work-frame="forge"]');
const read=async()=>card.evaluate(f=>{const t=s=>[...f.querySelectorAll(s)].map(n=>n.innerText.replace(/\n+/g,' · '));
  return {step:t('[data-work-step]')[0]||'',selected:t('[data-forge-input="selected"]'),cost:t('[data-forge-cost]'),change:t('[data-forge-change]'),result:t('[data-forge-result]'),
  stock:t('[data-forge-stock]')};});
for(let i=1;i<=4;i++){const r=await read();log.push([`before step ${i}`,r]);
  await card.screenshot({path:path.join(OUT,`onepiece_step${i}.png`)});
  await card.locator('[data-work-step] button').click();await p.waitForTimeout(300);}
const done=await read();log.push(['finished',done]);await card.screenshot({path:path.join(OUT,'onepiece_finished.png')});
log.push(['saved item',await p.evaluate(()=>Object.keys(window.simulationTestHooks.snapshot().inventories.person.main_character).filter(k=>k.includes('Iron long blade')).map(k=>JSON.parse(k).gearwork?.treatment))]);
});}finally{srv.close();}
fs.writeFileSync(path.join(OUT,'onepiece.json'),JSON.stringify({log,errs},null,1));console.log(JSON.stringify({log,errs},null,1));})().catch(e=>{console.error(e);process.exit(1);});
