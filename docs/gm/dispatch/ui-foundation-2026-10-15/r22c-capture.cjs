// R22c capture: 8-mixed fight and the populated idle fixture with an item selected, at the primary,
// MacBook and 1366 floor (14px). Usage: R4_URL=http://127.0.0.1:19496 node r22c-capture.cjs <label>
const T=require('./target-set.cjs');const {L}=T;const {fs,path}=L;
const label=process.argv[2]||'after',E=path.join(__dirname,'evidence/r22c',label);fs.mkdirSync(E,{recursive:true});
const fight=fs.readFileSync(path.join(__dirname,'evidence/r20/fixtures/opponents-8-mixed.save.txt'),'utf8').trim();
const list=[{name:'1920',w:1920,h:1080,dpr:1,font:14},{name:'mbp',w:1800,h:1040,dpr:2,font:14},{name:'1366',w:1366,h:768,dpr:1,font:14}];
const page=p=>p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight);
(async()=>{const b=await T.launch(600);const out={};try{
 out.fight=await T.forTargets(b,async(p,t)=>{await p.evaluate(()=>simulationTestHooks.resume());await p.waitForTimeout(7000);await p.evaluate(()=>simulationTestHooks.pause());await p.mouse.move(t.w-3,t.h-3);
   await T.shot(p,path.join(E,`fight-${T.tag(t)}.png`));
   const line=p.locator('#message_log_div .message_combat[data-combat-slot]:not([data-combat-slot="many"])').last();let linked=null;
   if(await line.count()){await line.hover();await p.waitForTimeout(200);linked=await p.evaluate(()=>document.querySelectorAll('.enemy-card[data-linked]').length);if(t.name==='1920')await T.shot(p,path.join(E,`fight-hover-${T.tag(t)}.png`));}
   const tab=await p.evaluate(()=>document.querySelector('.inventory-tabs > button[aria-pressed="true"]')?.dataset.category);
   return {page:await page(p),linked,tab,errors:p.errors.slice(0,2)};},{data:fight,list});
 out.idle=await T.forTargets(b,async(p,t)=>{await p.mouse.move(t.w-3,t.h-3);await T.shot(p,path.join(E,`idle-${T.tag(t)}.png`));
   const row=p.locator('#inventory_content_div > .inventory_item_control:visible').first();await row.click();await p.waitForTimeout(500);await p.mouse.move(t.w-3,t.h-3);
   await T.shot(p,path.join(E,`idle-item-${T.tag(t)}.png`));
   const r=await p.evaluate(()=>{const d=document.querySelector('.workspace-module[data-module="shell-detail"]');return{region:d?.closest('[data-region]')?.dataset.region,shown:!!d&&d.checkVisibility(),actions:document.querySelector('[data-module="local-actions"]')?.checkVisibility()};});
   return {...r,page:await page(p),errors:p.errors.slice(0,2)};},{list});
}finally{await b.close();}fs.writeFileSync(path.join(E,'capture.json'),JSON.stringify(out,null,1));console.log(JSON.stringify(out));})();
