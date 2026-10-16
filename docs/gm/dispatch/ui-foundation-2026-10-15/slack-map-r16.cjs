// R16 slack map (WX13): per shell region and module, frame height against content extent,
// plus control heights and visible list rows, on fresh, populated and combat fixtures.
// Usage: R4_URL=http://127.0.0.1:19271 node slack-map-r16.cjs <label>
// Synthetic fixtures only; each case runs on a fresh browser context (fresh origin storage).
const L=require('./r11-lib.cjs');const {fs,path}=L;
const label=process.argv[2]||'run';const E=path.join(__dirname,'evidence/r16',label);fs.mkdirSync(E,{recursive:true});
const FIX={fresh:null,populated:L.save,combat:fs.readFileSync(path.join(__dirname,'evidence/parity-r9/populated-three.save.txt'),'utf8')};
const TARGETS=[[1366,768,14],[1366,768,21],[1920,1080,21]];
const shot=async(p,name)=>{const cdp=await p.context().newCDPSession(p);try{const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});fs.writeFileSync(path.join(E,name+'.png'),Buffer.from(r.data,'base64'));}finally{await cdp.detach();}};
const measure=p=>p.evaluate(()=>{
    const vis=n=>{const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden')return false;const r=n.getBoundingClientRect();return r.width>0&&r.height>0;};
    const leafy=n=>/^(BUTTON|SELECT|INPUT|TEXTAREA|IMG|SVG|CANVAS|PROGRESS)$/i.test(n.tagName)||[...n.childNodes].some(c=>c.nodeType===3&&c.textContent.trim())||!n.children.length&&getComputedStyle(n).backgroundImage!=='none';
    const used=frame=>{const f=frame.getBoundingClientRect();let bottom=f.top;for(const n of frame.querySelectorAll('*')){if(!vis(n)||!leafy(n))continue;const r=n.getBoundingClientRect();if(r.top>=f.bottom)continue;bottom=Math.max(bottom,Math.min(r.bottom,f.bottom));}return Math.round(bottom-f.top);};
    const regions={};
    for(const region of document.querySelectorAll('.parity-region')){if(!vis(region))continue;const rr=region.getBoundingClientRect();const mods=[];
        for(const m of region.querySelectorAll(':scope > .workspace-module')){if(!vis(m))continue;const r=m.getBoundingClientRect();const u=used(m);let overflow=0;for(const n of m.querySelectorAll('*'))if(vis(n)&&n.scrollHeight>n.clientHeight+2&&/(auto|scroll)/.test(getComputedStyle(n).overflowY))overflow=Math.max(overflow,n.scrollHeight-n.clientHeight);
            mods.push({id:m.dataset.module,h:Math.round(r.height),w:Math.round(r.width),used:u,slack:Math.round(r.height)-u,overflow});}
        const total=Math.round(rr.height),slack=mods.reduce((a,v)=>a+v.slack,0)+Math.max(0,total-mods.reduce((a,v)=>a+v.h,0));
        regions[region.dataset.region]={x:Math.round(rr.x),y:Math.round(rr.y),w:Math.round(rr.width),h:total,slack,slackShare:+(slack/total).toFixed(2),modules:mods};}
    const lh=parseFloat(getComputedStyle(document.body).fontSize);
    const controls=[...document.querySelectorAll('.workspace-board button, .workspace-board select, .workspace-board [role=tab]')].filter(vis).map(n=>{const r=n.getBoundingClientRect();return{t:(n.textContent||n.value||'').trim().slice(0,24),h:Math.round(r.height),w:Math.round(r.width)};});
    const tall=controls.filter(c=>c.h>lh*2.1).sort((a,b)=>b.h-a.h).slice(0,12);
    const inv=document.querySelector('#inventory_content_div');const invRows=inv?[...inv.children].filter(n=>{if(!vis(n))return false;const r=n.getBoundingClientRect(),f=inv.getBoundingClientRect();return r.top>=f.top-1&&r.bottom<=f.bottom+1;}).length:0;
    const log=document.querySelector('[data-region=log]')?.getBoundingClientRect();
    const page={scrollW:document.documentElement.scrollWidth,scrollH:document.documentElement.scrollHeight,w:innerWidth,h:innerHeight};
    return{presentation:document.getElementById('main_content')?.dataset.presentation,combat:document.getElementById('main_content')?.dataset.parityCombat,font:lh,regions,controlCount:controls.length,tallControls:tall,invRows,logW:log?Math.round(log.width):null,page};});
(async()=>{const results=[];const b=await L.launch();
try{for(const [fx,data] of Object.entries(FIX))for(const [w,h,font] of TARGETS){const tag=`${fx}-${w}x${h}-${font}`;
    try{const {ctx,p}=await L.open(b,{w,h,data});if(font!==14)await L.textSize(p,font);await p.waitForTimeout(300);
        const r={tag,...await measure(p)};r.errors=p.errors;await shot(p,tag);results.push(r);
        console.log(tag,Object.entries(r.regions).map(([k,v])=>`${k}:${v.slackShare}`).join(' '),'inv',r.invRows,'tall',r.tallControls.length,'log',r.logW,'page',r.page.scrollH<=r.page.h?'ok':'OVERFLOW');await ctx.close();
    }catch(e){console.log('FAIL',tag,e.message);results.push({tag,fail:e.message});}}}
finally{await b.close();}
fs.writeFileSync(path.join(E,'slack-map.json'),JSON.stringify(results,null,1));
// Markdown table: one row per case and region.
const rows=['| Case | Region | Frame h | Slack px | Slack share | Modules (h/used/slack/overflow) |','| --- | --- | --- | --- | --- | --- |'];
for(const r of results){if(r.fail){rows.push(`| ${r.tag} | FAIL | | | | ${r.fail} |`);continue;}for(const [k,v] of Object.entries(r.regions))rows.push(`| ${r.tag} | ${k} | ${v.h} | ${v.slack} | ${v.slackShare} | ${v.modules.map(m=>`${m.id} ${m.h}/${m.used}/${m.slack}/${m.overflow}`).join('; ')} |`);
    rows.push(`| ${r.tag} | other | | | | inventory rows ${r.invRows}; log width ${r.logW}; controls ${r.controlCount}, taller than 2.1 lines: ${r.tallControls.map(c=>`${c.t||'?'} ${c.h}`).join(', ')||'none'}; page ${r.page.scrollW}x${r.page.scrollH} |`);}
fs.writeFileSync(path.join(E,'slack-map.md'),rows.join('\n')+'\n');console.log('wrote',E);})();
