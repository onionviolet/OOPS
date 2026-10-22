const fs=require('fs');
const gate=require('./browser-helper.cjs');
gate('cultivation-visual',async({p,boot,load,open,gates,assert,out,path})=>{
 await p.setViewportSize({width:1920,height:1080});await boot();
 const raw=fs.readFileSync('docs/gm/dispatch/cultivation-spacing-2026-10-22/cultivation-OMElJB/refinement-settled.save.txt','utf8');
 await load(JSON.parse(Buffer.from(raw.trim().replace(/^YAIR-UTF8-1:/,''),'base64').toString()),'settled-native-continuation');
 await open();await p.locator('#p23_mistglass_panel').waitFor({state:'visible'});
 for(const [width,height] of [[1920,1080],[1800,1040],[1536,864]])for(const size of [14,21]){
  await p.setViewportSize({width,height});await p.locator('#p23_mistglass_panel').evaluate((n,size)=>{n.open=true;n.style.fontSize=size+'px';n.style.fontFamily=`"OOPS Gothic Bitmap ${size}",var(--ui-font-gothic)`;n.style.setProperty('--custom-size',size+'px');n.scrollIntoView({block:'start'});},size);
  await p.evaluate(()=>document.fonts.ready);assert.equal(await p.locator('#p23_mistglass_panel').isVisible(),true);
  assert.match(await p.locator('#p23_mistglass_panel').innerText(),/Still-pool refinement: Integrated/);
  await p.screenshot({path:path.join(out,`methods-${width}-${size}.png`)});
  await p.locator('[data-mistglass-action="method:breath"]').scrollIntoViewIfNeeded();assert.equal(await p.locator('[data-mistglass-action="method:breath"]').isVisible(),true);
 }
 gates.push('Native settled-export continuation, Projects opened, actual visible methods and reachable controls at six desktop/text targets');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
