const L=require('./lib.cjs');const fs=require('fs');const S=process.env.S;
(async()=>{await L.launch();const out={};
for(const [b,f] of [['original','orig'],['current','current']]){const {p,ctx}=await L.open(b,{width:1366,height:768,save:fs.readFileSync(`${S}/out/${f}_progressed.json`,'utf8')});
 const r=await p.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'};
  const boxes=[...document.querySelectorAll('input[type=checkbox]')].filter(vis).map(cb=>{const r=cb.getBoundingClientRect();const lab=cb.labels?.[0]||cb.closest('label');let txt=lab?lab:cb.parentElement;
    // nearest text node rect
    const range=document.createRange();let best=null;const walker=document.createTreeWalker(cb.parentElement.parentElement||document.body,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(!n.textContent.trim())continue;range.selectNodeContents(n);const t=range.getBoundingClientRect();if(!t.width)continue;const dx=Math.max(0,t.left-r.right,r.left-t.right),dy=Math.max(0,t.top-r.bottom,r.top-t.bottom);const d=Math.hypot(dx,dy);if(!best||d<best.d)best={d:Math.round(d),dy:Math.round((t.top+t.bottom)/2-(r.top+r.bottom)/2),text:n.textContent.trim().slice(0,30)}}
    return {id:cb.id,associated:!!lab,ariaLabel:cb.getAttribute('aria-label'),cb:[Math.round(r.x),Math.round(r.y)],nearest:best};});
  const log=document.getElementById('message_log_div')||document.getElementById('message_log');
  const live=[...document.querySelectorAll('[aria-live]')].map(e=>(e.id||e.className)+':'+e.getAttribute('aria-live'));
  let reduced=false;for(const ss of document.styleSheets){try{for(const rule of ss.cssRules){if(rule.media&&/prefers-reduced-motion/.test(rule.media.mediaText))reduced=true}}catch{}}
  return {boxes,live,reducedMotionRules:reduced,logId:log?.id};});
 // tooltip on keyboard focus: focus first inventory row/use control and see if a tooltip appears
 const tip=await p.evaluate(async()=>{const row=document.querySelector('.inventory_item_div,[class*=inventory_item]');if(!row)return 'no row';row.tabIndex=row.tabIndex;row.focus();await new Promise(r=>setTimeout(r,400));const tt=[...document.querySelectorAll('[class*=tooltip],.item_tooltip')].filter(e=>e.offsetParent&&getComputedStyle(e).visibility!=='hidden'&&e.getBoundingClientRect().width>0);return {focusable:row.tabIndex>=0,focused:document.activeElement===row,tooltipsVisibleOnFocus:tt.length};});
 // hover shows tooltip?
 const row=p.locator('.inventory_item_div').first();let hover=null;if(await row.count()){await row.scrollIntoViewIfNeeded();await row.hover();await p.waitForTimeout(400);hover=await p.evaluate(()=>{const tt=[...document.querySelectorAll('[class*=tooltip]')].filter(e=>e.offsetParent&&e.getBoundingClientRect().width>0&&getComputedStyle(e).visibility!=='hidden');return tt.map(e=>{const r=e.getBoundingClientRect();return {cls:e.className.slice(0,30),r:[Math.round(r.x),Math.round(r.y),Math.round(r.right),Math.round(r.bottom)],inViewport:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight}})});}
 out[b]={...r,tip,hover};await ctx.close();}
console.log(JSON.stringify(out,null,1));fs.writeFileSync(S+'/out/a11y.json',JSON.stringify(out,null,1));await L.browser.close();})();
