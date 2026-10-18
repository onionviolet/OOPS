// UIL2 check (2026-10-18): the UIX2 change signal and its three readers on the populated fixture.
// Per target: (A) Options "(N ready)" and the group summaries never disagree with the action list
// in any frame after a real "Look around" (the reproduced stale case) or while time runs; (B) the
// inspector shows each reader's refreshes per batch and the nav fallback poll; (C) the current-work
// chip shows only while work runs and its panel is out of view, and waits while the pointer is on
// the bar without moving anything; (D, 1920 only) save, export and import keep the readers intact.
// Usage: R4_URL=http://127.0.0.1:PORT node check-uil2.cjs [label]
const T=require('./target-set.cjs');const {L}=T;const {fs,path}=L;
const E=path.join(__dirname,'evidence/uil2');fs.mkdirSync(E,{recursive:true});
const label=process.argv[2]||'after';
const LIST=(process.env.R21_TARGETS||'1920x1080x1x14,1920x1080x1x21,1366x768x1x14,1366x768x1x21').split(',');
// Each animation frame: the Options count, and each group summary's ready count, against the list.
const SAMPLER=()=>{window.__uil2={frames:0,mismatch:[]};const groupsOf=()=>[...document.querySelectorAll('#location_actions_div > details')].filter(d=>!d.hidden&&d.style.display!=='none'&&!d.classList.contains('none_display'));
    const tick=()=>{const s=window.__uil2;if(!s.on)return;s.frames++;const groups=groupsOf(),ready=groups.filter(d=>[...d.querySelectorAll('button')].some(b=>!b.hidden&&!b.disabled)).length;
        const tab=document.querySelector('button[data-place-tab="options"]')?.textContent||'',m=tab.match(/Options · (\d+)(?: \((\d+) ready\))?/),shown=m?[+m[1],+(m[2]||0)]:[0,0];
        if(shown[0]!==groups.length||shown[1]!==ready)s.mismatch.push({frame:s.frames,tab,groups:groups.length,ready});
        for(const d of groups){const st=d.querySelector(':scope > summary [data-group-status]')?.textContent||'',btn=[...d.querySelectorAll('button')].filter(n=>!n.hidden),want=btn.length?`${btn.filter(n=>!n.disabled).length} ready / ${btn.length} actions`:'Open to review';if(st&&st!==want)s.mismatch.push({frame:s.frames,summary:st,want});}
        requestAnimationFrame(tick);};window.__uil2.on=true;requestAnimationFrame(tick);};
const inspect=p=>p.evaluate(()=>{const v=yairpgChangeSignal.inspect();return {batches:v.batches,readers:Object.fromEntries(v.readers.map(r=>[r.id,{refreshes:r.refreshes,polls:r.polls,pending:r.pending,last:r.last&&`${r.last.topic}<-${r.last.source}`}])),publishes:Object.fromEntries(Object.entries(v.topics).map(([t,e])=>[t,e.publishes]))};});
const chipState=p=>p.evaluate(()=>{const c=document.querySelector('#game_bar .game-bar-work-chip'),panel=document.getElementById('workspace_current_work');const r=panel?.getBoundingClientRect();
    return {shown:!!c&&!c.hidden&&c.checkVisibility(),text:c?.textContent||'',work:panel?.querySelector(':scope > p')?.textContent||'',panelOnScreen:!!r&&panel.checkVisibility()&&r.bottom>0&&r.top<innerHeight&&r.width>0};});
const rects=p=>p.evaluate(()=>[...document.querySelectorAll('#game_bar button, #game_bar [data-control-box] > .control-box-button')].filter(b=>b.checkVisibility()).map((b,i)=>{const r=b.getBoundingClientRect();return `${i}:${b.className||b.dataset.panelPath||b.id}@${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)}x${Math.round(r.height)}`;}));
const delta=(a,z)=>Object.fromEntries(Object.keys(z.readers).map(id=>[id,{refreshes:z.readers[id].refreshes-(a.readers[id]?.refreshes||0),polls:z.readers[id].polls-(a.readers[id]?.polls||0)}]));
async function run(){
    const b=await T.launch(900),out={label,url:process.env.R4_URL,targets:{}};
    try{for(const spec of LIST){const [w,h,dpr,font]=spec.split('x').map(Number),tag=`${w}-${font}`;console.log('target',tag);
        const {ctx,p}=await L.open(b,{w,h,dpr});if(font!==14)await L.textSize(p,font);await p.waitForTimeout(800);
        const r=out.targets[tag]={};const signal=await p.evaluate(()=>!!window.yairpgChangeSignal);r.signal=signal;
        // A. Options and the group summaries against the list, frame by frame, after a real action.
        await p.click('button[data-place-tab="options"]');await p.waitForTimeout(300);
        await p.evaluate(()=>{const b=[...document.querySelectorAll('#location_actions_div button')].find(b=>b.textContent.includes('Look around'));b.closest('details').open=true;b.scrollIntoView({block:'center'});});await p.waitForTimeout(300);
        const before=signal&&await inspect(p);r.optionsBefore=await p.locator('button[data-place-tab="options"]').textContent();
        await p.evaluate(SAMPLER);await p.locator('#location_actions_div button',{hasText:'Look around'}).first().click();await p.waitForTimeout(1500);
        r.optionsAfter=await p.locator('button[data-place-tab="options"]').textContent();
        r.lookAround=await p.evaluate(()=>({frames:__uil2.frames,mismatch:__uil2.mismatch.slice(0,6),mismatches:__uil2.mismatch.length}));
        if(signal){const after=await inspect(p);r.lookAroundSignal={delta:delta(before,after),publishes:after.publishes};}
        // Time runs: 5 s of play with the sampler still on; refresh cost per reader.
        const t0=signal&&await inspect(p);await p.evaluate(()=>{__uil2.mismatch=[];__uil2.frames=0;simulationTestHooks.resume();});await p.waitForTimeout(5000);await p.evaluate(()=>simulationTestHooks.pause());
        r.timeRuns=await p.evaluate(()=>({frames:__uil2.frames,mismatches:__uil2.mismatch.length,first:__uil2.mismatch.slice(0,3)}));
        if(signal){const t1=await inspect(p);r.timeRunsSignal={batches:t1.batches-t0.batches,delta:delta(t0,t1),publishes:Object.fromEntries(Object.keys(t1.publishes).map(k=>[k,t1.publishes[k]-t0.publishes[k]])),pending:t1.readers['workspace-navigation']?.pending};}
        await p.evaluate(()=>{__uil2.on=false;});
        // C. Current work. A real run starts the way its row does. In the R21 parity layout the
        // current-work panel stays on screen in every state reached (idle, running, every center
        // view, combat), so the out-of-view case is FORCED here: the test hides the panel's module
        // box, as a moved, clipped or covered panel would be. That is presentation only.
        const force=on=>p.evaluate(on=>{const m=document.querySelector('.workspace-module[data-module="current-work"]');if(m)m.style.display=on?'none':'';},on);
        const start=()=>p.evaluate(()=>[...document.querySelectorAll('#location_related_div [data-activity]')].find(n=>/run/i.test(n.textContent))?.click());
        await p.mouse.move(Math.round(w/2),Math.round(h*0.6));
        r.chipIdle=await chipState(p);
        await start();await p.waitForTimeout(900);r.chipWorkInView=await chipState(p);
        await force(true);await p.waitForTimeout(700);r.chipWorkOutOfView=await chipState(p);
        if(r.chipWorkOutOfView.shown){await T.shot(p,path.join(E,`${label}-chip-${tag}.png`));const bar=await p.locator('#game_bar').boundingBox();await p.screenshot({path:path.join(E,`${label}-chip-${tag}-bar.png`),clip:{x:0,y:0,width:w,height:Math.ceil(bar.height)}});}
        await force(false);await p.waitForTimeout(700);r.chipBackInView=await chipState(p);
        // UIX4 (geometry only; the held chip's own text may update in place): the pointer rests on the first bar route while work ends on its own and later
        // starts again. Nothing in the bar moves and focus stays put; the chip waits for the
        // pointer to leave.
        await force(true);await p.waitForTimeout(700);
        const first=p.locator('#workspace_navigation > button[data-panel-path]:visible').first(),box=await first.boundingBox();
        const hover=async()=>{await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.waitForTimeout(250);};
        const away=async()=>{await p.mouse.move(Math.round(w/2),Math.round(h*0.6));await p.waitForTimeout(500);};
        const held=async change=>{await hover();const focus0=await p.evaluate(()=>document.activeElement?.id||document.activeElement?.tagName),rects0=await rects(p),chip0=(await chipState(p)).shown;
            await change();await p.waitForTimeout(900);const during=await chipState(p);
            const out={chipBefore:chip0,chipDuring:during.shown,rectsSame:JSON.stringify(rects0)===JSON.stringify(await rects(p)),moved:await rects(p).then(z=>z.filter(x=>!rects0.includes(x)).concat(rects0.filter(x=>!z.includes(x)).map(x=>"was "+x))),focusSame:focus0===await p.evaluate(()=>document.activeElement?.id||document.activeElement?.tagName)};
            await away();out.chipAfterLeave=(await chipState(p)).shown;return out;};
        r.holdOnEnd=await held(()=>p.evaluate(()=>window.end_activity()));
        r.holdOnStart=await held(start);
        await p.evaluate(()=>window.end_activity());await p.waitForTimeout(700);r.chipNoWork=await chipState(p);await force(false);
        r.errors=p.errors.slice();await ctx.close();}
    // D. Save, export and import at 1920: the readers come back and agree with the list.
    const {ctx,p}=await L.open(b,{w:1920,h:1080});await p.waitForTimeout(800);
    const read=()=>p.evaluate(()=>({options:document.querySelector('button[data-place-tab="options"]')?.textContent,nav:[...document.querySelectorAll('#workspace_navigation > button[data-panel-path]')].map(b=>`${b.textContent}${b.hidden?'(h)':''}${b.disabled?'(d)':''}`).join(' '),readers:window.yairpgChangeSignal?.inspect().readers.map(r=>r.id)}));
    const rt=out.roundtrip={before:await read()};
    await p.locator('#save_button').click();const dl=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=path.join(E,`${label}-roundtrip.save.txt`);await(await dl).saveAs(file);
    await p.reload();await p.waitForFunction(()=>!!window.simulationTestHooks);await L.R.startFresh(p).catch(()=>{});await p.evaluate(()=>simulationTestHooks.pause());await p.waitForTimeout(800);rt.reloaded=await read();
    const loaded=p.waitForEvent('domcontentloaded',{timeout:30000});await p.locator('#saved_file_input').setInputFiles(file);await loaded;await L.R.startFresh(p).catch(()=>{});await p.evaluate(()=>simulationTestHooks.pause());await p.waitForTimeout(800);
    rt.imported=await read();rt.errors=p.errors.slice();fs.rmSync(file);await ctx.close();
    }finally{await b.close();}
    fs.writeFileSync(path.join(E,`${label}.json`),JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,1));
}
run().catch(e=>{console.error(e.stack);process.exitCode=1;});
