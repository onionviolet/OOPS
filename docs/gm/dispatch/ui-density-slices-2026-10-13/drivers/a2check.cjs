const L=require('./lib.cjs');const fs=require('fs');const S=process.env.S;const TAG=process.env.TAG||'a2';
(async()=>{await L.launch();const {p}=await L.open({w:1366,h:768});const out={};
 out.chrome=await p.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden';};
  const q=s=>[...document.querySelectorAll(s)];
  return {entries:q('.workspace-toolbar > *').filter(vis).map(e=>(e.querySelector(':scope > summary')||e).textContent.trim()),
   grips:q('.workspace-drag-handle,.workspace-resize-grip,.workspace-divider').filter(vis).length,
   focusableHandles:q('.workspace-drag-handle,.workspace-resize-grip,.workspace-divider').filter(e=>{e.focus();return document.activeElement===e;}).length};});
 await p.evaluate(()=>document.activeElement?.blur());
 // A real Tab walk from page start.
 await p.evaluate(()=>{window.scrollTo(0,0);document.body.focus();});
 const seq=[];let firstNative=-1;
 for(let i=1;i<=60;i++){await p.keyboard.press('Tab');const d=await p.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return {t:'(body)'};const r=e.getBoundingClientRect();return {t:(e.getAttribute('aria-label')||e.innerText||e.value||e.tagName).replace(/\s+/g,' ').trim().slice(0,36),native:!!e.closest('#location_actions_div')&&e.matches('[data-native-choice],[data-native-choice] *,[data-native-keyboard]')&&!!e.closest('[data-native-choice]'),handle:e.matches('.workspace-drag-handle,.workspace-resize-grip,.workspace-divider'),y:[Math.round(r.top),Math.round(r.bottom)]};});seq.push(d);if(d.native&&firstNative<0){firstNative=i;break;}}
 out.tab={firstNative,handlesInWalk:seq.filter(s=>s.handle).length,seq:seq.map(s=>s.t)};
 out.coords=await p.evaluate(()=>{const r=e=>{const b=e.getBoundingClientRect();return [Math.round(b.top),Math.round(b.bottom)];};return {layout:r(document.querySelector('.workspace-layout-menu > summary')),firstAction:r(document.querySelector('#location_actions_div > [data-native-choice]')),viewport:innerHeight};});
 out.firstActionVisible=await L.vis(p.locator('#location_actions_div > [data-native-choice]').first());
 await p.screenshot({path:`${S}/shots/T1_1366x768_${TAG}.png`});
 await p.locator('.workspace-layout-menu > summary').click();await p.waitForTimeout(200);
 out.afterOneClick=await p.evaluate(()=>[...document.querySelectorAll('.workspace-layout-tools > *')].filter(e=>e.getBoundingClientRect().height>0).map(e=>(e.querySelector(':scope > summary')||e).textContent.trim().slice(0,30)));
 await p.screenshot({path:`${S}/shots/T1_menu_1366x768_${TAG}.png`});
 await p.locator('[data-workspace-action=edit-layout]').click();await p.waitForTimeout(200);
 out.editing=await p.evaluate(()=>({grips:[...document.querySelectorAll('.workspace-drag-handle')].filter(e=>e.getBoundingClientRect().width>0).length,summary:document.querySelector('.workspace-layout-menu > summary').textContent}));
 await p.screenshot({path:`${S}/shots/T1_editing_1366x768_${TAG}.png`});
 console.log(JSON.stringify(out,null,1));console.log('errs',p.errs);await L.browser.close();})();
