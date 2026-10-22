const gate=require('./browser-helper.cjs');
gate('log-layout',async({p,boot,gates,assert,path,out})=>{
 await p.setViewportSize({width:1920,height:1080});await boot();
 for(const [width,height] of [[1920,1080],[1800,1040],[1536,864]])for(const size of [14,21]){
  await p.setViewportSize({width,height});
  await p.evaluate(size=>{
   const log=document.getElementById('message_log_div');log.style.setProperty('--custom-size',size+'px');log.style.setProperty('--custom-font',`"OOPS Gothic Bitmap ${size}", var(--ui-font-gothic)`);log.style.setProperty('--custom-prose-font',`"OOPS Gothic Bitmap ${size}", var(--ui-font-gothic)`);
   const box=document.getElementById('message_box_div');box.replaceChildren();
   for(const [i,text] of ['Unlocked new skill: Cold resistance','Cold resistance · level 1 · new milestone','♫ Heigh ho, heigh ho, it’s off to work I go ♫','[ Home · 05/04/999, Summer, Fri ]','Night vision · level 2 · new milestone'].entries()){
    const row=document.createElement('div');row.className='message_common message_unlocks';row.dataset.fixture='spacing';
    const compact=document.createElement('span');compact.className='log-compact';compact.textContent=text;
    if(i===0){compact.textContent='Unlocked new skill: ';const button=document.createElement('button');button.className='log-subject';button.dataset.subjectKind='skill';button.textContent='Cold resistance';button.logDescription='<strong>Cold resistance</strong><p>Resistance acquired through cold exposure.</p><p>Level 1 · 0 / 10 XP</p>';compact.append(button);}
    row.append(compact);if(i===0||i===1||i===4){const open=document.createElement('button');open.className='notice-panel-link';open.textContent='Open';row.append(open);}box.append(row);
   }
  },size);
  await p.evaluate(()=>document.fonts.ready);
  const geometry=await p.locator('[data-fixture=spacing]').evaluateAll(rows=>rows.map(row=>{const c=row.querySelector('.log-compact'),r=document.createRange();r.selectNodeContents(c);const rects=[...r.getClientRects()].filter(r=>r.height>0);const top=Math.min(...rects.map(r=>r.top)),bottom=Math.max(...rects.map(r=>r.bottom));return {row:row.getBoundingClientRect().height,content:bottom-top,font:getComputedStyle(row).fontSize,line:parseFloat(getComputedStyle(row).lineHeight),padding:parseFloat(getComputedStyle(row).paddingTop)+parseFloat(getComputedStyle(row).paddingBottom)+1};}));
  for(const r of geometry)assert.ok(r.row<=Math.max(1,Math.round((r.content-parseFloat(r.font))/r.line)+1)*r.line+r.padding+2,JSON.stringify({size,width,r}));
  await p.locator('[data-fixture=spacing] .log-subject').hover();
  const preview=p.locator('.shell-context-preview:popover-open');await preview.waitFor({state:'visible'});
  assert.match(await preview.innerText(),/Resistance acquired through cold exposure/);
  assert.match(await preview.innerText(),/Level 1/);
  await p.screenshot({path:path.join(out,`log-${width}-${size}.png`)});await p.mouse.move(0,0);
 }
 gates.push('Screenshot-shaped log fixtures at all six desktop/text targets: compact row geometry and actual delegated hover retains full subject description');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
