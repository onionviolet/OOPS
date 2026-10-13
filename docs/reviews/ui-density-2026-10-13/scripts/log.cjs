const L=require('./lib.cjs');const fs=require('fs');const S=process.env.S;const out=[];
(async()=>{await L.launch();for(const [w,h] of [[1366,768],[1920,1080]])for(const [b,f] of [['original','orig'],['current','current']]){const {p,ctx}=await L.open(b,{width:w,height:h,save:fs.readFileSync(`${S}/out/${f}_progressed.json`,'utf8')});
await p.locator('#location_related_div').getByText('Move somewhere else').first().click();await p.waitForTimeout(300);await p.locator('#location_related_div .location_choice_dropdown_expanded').getByText('Infested field').first().click();await p.waitForTimeout(15000);
const m=await p.evaluate(()=>{const log=document.getElementById('message_log_div');const lr=log.getBoundingClientRect();const bar=document.getElementById('bottom_panel_div').getBoundingClientRect().top;
 // visible region = intersection of log rect, viewport and every clipping ancestor
 let top=Math.max(lr.top,0),bot=Math.min(lr.bottom,bar),left=Math.max(lr.left,0),right=Math.min(lr.right,innerWidth);for(let n=log.parentElement;n;n=n.parentElement){const s=getComputedStyle(n);if(/(auto|scroll|hidden)/.test(s.overflowY)){const r=n.getBoundingClientRect();top=Math.max(top,r.top);bot=Math.min(bot,r.bottom);}}
 const rows=[...log.querySelectorAll('div,p')].filter(e=>e.children.length===0&&e.innerText.trim()&&e.offsetParent);const vis=rows.filter(e=>{const r=e.getBoundingClientRect();return r.top>=top-1&&r.bottom<=bot+1&&r.left>=left-1&&r.left<right});
 const texts=rows.map(e=>e.innerText.trim());const rep=texts.length-new Set(texts).size;
 return {logBox:[Math.round(lr.left),Math.round(lr.top),Math.round(lr.width),Math.round(lr.height)],visibleBand:[Math.round(top),Math.round(bot),Math.round(left),Math.round(right)],rows:rows.length,visibleRows:vis.length,duplicateRows:rep,horizontallyVisible:right-left>50};});
await p.screenshot({path:`${S}/ev/T3_combat_15s_${w}x${h}_${b}.png`});out.push({build:b,vp:`${w}x${h}`,...m});console.log(b,w,JSON.stringify(m));await ctx.close();}
fs.writeFileSync(S+'/out/log.json',JSON.stringify(out,null,1));await L.browser.close();})();
