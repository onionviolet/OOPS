const gate=require('./browser-helper.cjs');
gate('cultivation',async h=>{
 const {p,assert,gates,boot,enroll,act,save,played,roundtrip,out,path,open}=h;
 await p.setViewportSize({width:1920,height:1080});await boot();console.log('booted');
 await p.evaluate(()=>{document.querySelector('[data-open-projects]')?.click();});
 await enroll();console.log('enrolled');await act('data-mistglass-action','enter');await act('data-mistglass-action','learn');
 await act('data-mistglass-action','method:breath');await played(17);
 let s=await save();assert.equal(s.expansion.worldAdaptation.techniques.selected,'breath');assert.ok(s.expansion.worldAdaptation.techniques.minutes.breath>=16);
 gates.push('Native circulation selection and played practice reaches first stage');
 await roundtrip('circulation-practice',s=>s.expansion.worldAdaptation.techniques);
 await act('data-mistglass-action','method:settling');await played(49);
 s=await save();assert.equal(s.expansion.worldAdaptation.techniques.minutes.settling,48);
 await act('data-mistglass-action','trade');
 await p.locator('#trader_inventory_div .item_name').getByText('Cloudseed dose',{exact:false}).locator('xpath=ancestor::*[contains(@class,"inventory_item_control")]').first().click();
 await p.locator('#accept_trade_button').click();await p.evaluate(()=>{window.exitTrade();advanceTicks(1);});
 await act('data-mistglass-action','trial');s=await save();assert.equal(s.expansion.worldAdaptation.pending.threshold,9500);const frozenRoll=s.expansion.worldAdaptation.pending.roll;
 assert.equal(await p.locator('[data-mistglass-action="method:breath"]').isEnabled(),false);
 await roundtrip('refinement-pending',s=>({techniques:s.expansion.worldAdaptation.techniques,pending:s.expansion.worldAdaptation.pending}));
 await played(12);s=await save();assert.equal(s.expansion.worldAdaptation.pending,null);assert.equal(s.expansion.worldAdaptation.last.outcome,frozenRoll<9500?'success':'failure');
 gates.push('Integrated refinement sets frozen 95 percent trial odds and settles once');
 await roundtrip('refinement-settled',s=>({techniques:s.expansion.worldAdaptation.techniques,last:s.expansion.worldAdaptation.last}));
 await open();await p.locator('#p23_mistglass_panel').waitFor({state:'visible'});
 for(const [width,height] of [[1920,1080],[1800,1040],[1536,864]])for(const size of [14,21]){
  await p.setViewportSize({width,height});await p.evaluate(size=>{const n=document.querySelector('#p23_mistglass_panel');n.style.fontSize=size+'px';n.style.fontFamily=`"OOPS Gothic Bitmap ${size}", var(--ui-font-gothic)`;n.style.setProperty('--custom-size',size+'px');},size);
  await p.locator('#p23_mistglass_panel').evaluate(n=>{n.open=true;n.scrollIntoView();});
  assert.equal(await p.locator('#p23_mistglass_panel').evaluate(n=>getComputedStyle(n).fontSize),size+'px');
  assert.match(await p.locator('#p23_mistglass_panel').innerText(),/Still-pool refinement: Integrated/);
  await p.screenshot({path:path.join(out,`methods-${width}-${size}.png`)});
 }
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
