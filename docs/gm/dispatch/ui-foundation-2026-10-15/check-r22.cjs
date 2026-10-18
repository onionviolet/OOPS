// R22 browser check (rebuilt bundle, fresh origin, synthetic fixtures).
// C1 multi-opponent lines carry letters, sides and direction; single fight has no letters.
// C2 ×N: a repeated line expands to one listed occurrence per event, Esc-free toggle closes it.
// C3 Clear empties the log and the next event starts a new line; Stop suppresses combat lines.
// C4 contrast of name/value tokens on the real line background (4.5:1).
// C5 fit: no page overflow; Reports column width equals the before build at each target.
// Usage: R4_URL=http://127.0.0.1:19520 BEFORE=http://127.0.0.1:19521 node check-r22.cjs
const L=require('./r11-lib.cjs');const {fs,path,assert}=L;const {chromium}=require("/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const F=path.join(__dirname,'evidence/r20/fixtures'),fx=n=>fs.readFileSync(path.join(F,`opponents-${n}.save.txt`),'utf8');
const E=path.join(__dirname,'evidence/r22');fs.mkdirSync(E,{recursive:true});
const launch=()=>chromium.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
const fight=async(p,ms)=>{await p.evaluate(()=>simulationTestHooks.resume());await p.waitForTimeout(ms);await p.evaluate(()=>simulationTestHooks.pause());};
const lines=p=>p.evaluate(()=>[...document.querySelectorAll('#message_log_div .message_combat')].map(n=>({text:n.querySelector('.log-compact')?.innerText.trim(),outcome:n.dataset.combatOutcome,direction:n.dataset.combatDirection,repeat:Number(n.dataset.repeat||0),letters:n.querySelectorAll('.log-letter').length,sides:[...n.querySelectorAll('.log-name')].map(s=>s.dataset.side)})));
const results={};
(async()=>{const b=await launch();try{
    // C1
    {const {ctx,p}=await L.open(b,{w:1920,h:1080,data:fx('8-mixed')});await fight(p,7000);const ls=await lines(p);
     assert.ok(ls.length>10,'combat lines');assert.ok(ls.every(l=>l.outcome),'every combat line carries its event');
     assert.ok(ls.filter(l=>l.outcome!=='defeat').every(l=>l.letters===1&&l.sides.length===2),'each non-defeat line names two sides, one lettered');
     assert.ok(ls.some(l=>l.direction==='dealt')&&ls.some(l=>l.direction==='taken'),'dealt and taken both present');
     assert.ok(!ls.some(l=>/Hero|evaded an attack|physical/.test(l.text)),'no native wording left in compact lines');
     results.C1={lines:ls.length,sample:ls.slice(-5).map(l=>l.text)};await ctx.close();}
    {const {ctx,p}=await L.open(b,{w:1366,h:768,data:fx(1)});let ls=[];for(let t=0;t<12;t++){await fight(p,5000);ls=await lines(p);if(ls.some(l=>l.repeat>=2))break;}
     assert.ok(ls.every(l=>l.letters===0),'single opponent: no letters');
     // C2
     const rep=ls.findIndex(l=>l.repeat>=2);assert.ok(rep>=0,'a repeated line within 60s');
     const row=p.locator('#message_log_div .message_combat').nth(rep),btn=row.locator('.log-repeat');
     await btn.scrollIntoViewIfNeeded();await btn.click();
     const opened=await row.evaluate(n=>({expanded:n.querySelector('.log-repeat').getAttribute('aria-expanded'),items:n.querySelectorAll('.log-occurrences li').length,repeat:Number(n.dataset.repeat),label:n.querySelector('.log-repeat').getAttribute('aria-label')}));
     assert.equal(opened.expanded,'true');assert.equal(opened.items,opened.repeat,'one occurrence per event');
     await btn.click();assert.equal(await row.locator('.log-occurrences').count(),0,'toggle closes');
     results.C1single={lines:ls.length};results.C2={...opened,text:ls[rep].text};
     // C3
     await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Clear');b.click();});
     assert.equal(await p.locator('#message_log_div .message_common').count(),0,'Clear empties');
     await fight(p,3000);const after=await lines(p);assert.ok(after.length>=1&&after[0].repeat>=1,'new line after Clear');
     await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Stop combat log');b.click();});
     const before=(await lines(p)).reduce((s,l)=>s+l.repeat,0);await fight(p,3000);const stopped=(await lines(p)).reduce((s,l)=>s+l.repeat,0);
     assert.equal(stopped,before,'Stop records no combat event, ×N included');
     results.C3={afterClear:after.length,eventsBeforeStop:before,eventsAfterStop:stopped};
     await ctx.close();}
    // C4
    {const {ctx,p}=await L.open(b,{w:1920,h:1080,data:fx('8-mixed')});await fight(p,7000);
     const pairs=await p.evaluate(()=>{const rgb=c=>c.match(/[\d.]+/g).slice(0,3).map(Number);const lum=c=>rgb(c).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
        const bg=n=>{for(let e=n;e;e=e.parentElement){const c=getComputedStyle(e).backgroundColor;if(c&&!/rgba\(0, 0, 0, 0\)|transparent/.test(c))return c;}return 'rgb(0,0,0)';};
        const out={};for(const n of document.querySelectorAll('#message_log_div [data-combat-outcome] :is(.log-name,.log-value), #message_log_div [data-combat-outcome]')){const key=(n.classList[0]||'line')+':'+(n.dataset.side||n.dataset.valueRole||n.dataset.combatOutcome||'');const r=ratio(getComputedStyle(n).color,bg(n));out[key]=Math.min(out[key]??99,Math.round(r*100)/100);}return out;});
     for(const [k,v] of Object.entries(pairs))assert.ok(v>=4.5,`${k} contrast ${v}`);results.C4=pairs;await ctx.close();}
    // C5
    results.C5=[];for(const [w,h,font] of [[1920,1080,14],[1366,768,14],[1366,768,21]])for(const url of [process.env.BEFORE,process.env.R4_URL]){
        process.env.R4_URL_SAVED??=process.env.R4_URL;const base=url;
        const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});const p=await ctx.newPage();
        await p.goto(base+'/style.css');await p.evaluate(d=>{localStorage.setItem('save data',d);localStorage.setItem('yairpg.presentation.proto23-parity.v1','on');},fx('8-mixed'));
        await p.goto(base+'/?test_hooks=1');await p.waitForFunction(()=>!!window.simulationTestHooks&&!!document.getElementById('workspace_navigation'),null,{timeout:60000});
        await p.locator('#loading_screen_play_button:not(.none_display)').click({noWaitAfter:true});await p.locator('#combat_div .fighter_div').first().waitFor({state:'attached'});
        if(font!==14){process.env.R4_URL=base;await L.textSize(p,font);}
        await fight(p,4000);
        const m=await p.evaluate(()=>{const r=document.querySelector('.parity-region[data-region="log"]')?.getBoundingClientRect()||document.getElementById('message_log_div').getBoundingClientRect();return{w:Math.round(r.width),x:Math.round(r.x),page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight,innerWidth,innerHeight]};});
        results.C5.push({target:`${w}x${h}x${font}`,build:url===process.env.BEFORE?'before':'after',...m});await ctx.close();}
    process.env.R4_URL=process.env.R4_URL_SAVED;
    for(let i=0;i<results.C5.length;i+=2){const [a,c]=[results.C5[i],results.C5[i+1]];assert.equal(c.w,a.w,`log width ${c.target}`);assert.ok(c.page[1]<=c.page[3]&&c.page[0]<=c.page[2],`no overflow ${c.target}`);}
    console.log('PASS C1-C5');}
catch(e){console.log('FAIL',e.message);process.exitCode=1;}
finally{await b.close();fs.writeFileSync(path.join(E,'check-r22.json'),JSON.stringify(results,null,1));console.log(JSON.stringify(results,null,1).slice(0,2500));}})();
