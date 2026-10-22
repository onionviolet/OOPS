const fs=require('fs'),path=require('path');const ROOT=__dirname;
const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
const records=[['repairer','w1-materials-wvouhU','w1-earned-fitting-and-products','#gear_workshop','gear-workshop','[data-mender-action="fine:oiled"]'],['institution','w2-institution-edrd1E','w2-successor-settled-delivery','#home_panel','homes','[data-home-action="office_close"]'],['history-paths','w4-paths-TdE0xu','w4-compatible-expenditure-products','#p23_mistglass_panel','projects','[data-mistglass-action="method:path:prepare"]']];
gate('w-desktop',async h=>{
 const {p,boot,load,assert,gates,out}=h;await boot();const cases=[];
 for(const [name,dir,saveFile,selector,panel,target]of records){
  const raw=fs.readFileSync(path.join(ROOT,'evidence',dir,saveFile+'.save.txt'),'utf8');await load(JSON.parse(Buffer.from(raw.trim().replace(/^YAIR-UTF8-1:/,''),'base64').toString()),name+'-native-export');
  await p.evaluate(panel=>{const button=document.querySelector(`[data-panel-path="${panel}"]`);if(button)button.click();else{const n=document.querySelector('[aria-label="Other known panels"]');n.value=panel;n.dispatchEvent(new Event('change',{bubbles:true}));}document.querySelectorAll('details').forEach(d=>d.open=true);},panel);
  await p.locator(selector).waitFor({state:'visible'});
  if(name==='repairer')await p.locator('#gear_workshop [aria-label="Maker"]').selectOption('player');
  for(const [width,height]of [[1920,1080],[1800,1040],[1536,864]])for(const size of [14,21]){
   await p.setViewportSize({width,height});await p.evaluate(({selector,size})=>{const r=document.documentElement;for(const key of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size'])r.style.setProperty(key,size+'px');r.style.setProperty('--ui-font',`"OOPS Gothic Bitmap ${size}",var(--ui-font-gothic)`);const n=document.querySelector(selector);n.style.fontSize=size+'px';n.style.setProperty('--custom-size',size+'px');n.style.setProperty('--custom-font',`"OOPS Gothic Bitmap ${size}",var(--ui-font-gothic)`);n.style.fontFamily=`"OOPS Gothic Bitmap ${size}",var(--ui-font-gothic)`;if(n.tagName==='DETAILS')n.open=true;}, {selector,size});
   await p.evaluate(()=>document.fonts.ready);await p.locator(target).scrollIntoViewIfNeeded();
   const geometry=await p.locator(selector).evaluate((n,size)=>{const visible=[...n.querySelectorAll('button')].filter(b=>b.getClientRects().length&&getComputedStyle(b).visibility!=='hidden');return {font:getComputedStyle(n).fontSize,family:getComputedStyle(n).fontFamily,buttons:visible.map(b=>({text:b.textContent,left:b.getBoundingClientRect().left,right:b.getBoundingClientRect().right})),viewport:innerWidth};},size);
   assert.equal(geometry.font,size+'px');for(const b of geometry.buttons)assert.ok(b.left>=-1&&b.right<=width+1,`${name} ${width}/${size}: ${b.text}`);
   assert.equal(await p.locator(target).isVisible(),true);assert.equal(await p.locator('#center_mode_back').isVisible(),true);
   await p.screenshot({path:path.join(out,`${name}-${width}-${size}.png`)});cases.push({surface:name,width,height,size,...geometry});
  }
 }
 fs.writeFileSync(path.join(out,'geometry.json'),JSON.stringify(cases,null,2));gates.push('Three native surfaces across all six desktop/text cases: actual loaded font sizes, horizontally bounded buttons, scroll-reachable work and pinned Back');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
