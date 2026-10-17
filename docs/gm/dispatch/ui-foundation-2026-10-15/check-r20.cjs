// R20 opponent board checks on the rebuilt game (fresh loopback origins, synthetic fixtures only).
// Per target and fixture: layout band, one cell per native opponent, defeated stay identifiable,
// inspected facts in view, no page overflow; inspection, Compare and keyboard selection change no
// game state (UR35); 30 rendered ticks under a hovered row move no row (UR52, WX4).
// Usage: R4_URL=http://127.0.0.1:19480 node check-r20.cjs
const L=require('./r11-lib.cjs');const {fs,path,assert}=L;
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const launch=async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const t=setTimeout(()=>{console.error('R20 900s bound');b.close()},900000);t.unref();b.on('disconnected',()=>clearTimeout(t));return b;};
const E=path.join(__dirname,'evidence/r20');const F=path.join(E,'fixtures');
const FIX={three:[path.join(__dirname,'evidence/parity-r9/populated-three.save.txt'),3,'rows',null],n1:[path.join(F,'opponents-1.save.txt'),1,'single',null],n9:[path.join(F,'opponents-9.save.txt'),9,'dense','E'],'n8-mixed':[path.join(F,'opponents-8-mixed.save.txt'),8,'grid',null]};
const TARGETS=[[1366,768,21],[1366,768,14],[1920,1080,21]];
const rects=p=>p.evaluate(()=>[...document.querySelectorAll('#current_focus .enemy-card, #current_focus .enemy-group-label, #current_focus .enemy-card-name, #current_focus .opponent-detail dl > div')].map(n=>{const r=n.getBoundingClientRect();return [n.className,n.dataset.enemyCard||n.querySelector('dt')?.textContent||n.textContent.slice(0,12),Math.round(r.x*2)/2,Math.round(r.y*2)/2,Math.round(r.width*2)/2,Math.round(r.height*2)/2];}));
const results=[];let failed=0;
async function run(name,fn){try{await fn();results.push({name,pass:true});console.log('PASS',name);}catch(e){failed++;results.push({name,pass:false,error:e.message});console.log('FAIL',name,e.message.split('\n')[0]);}}
(async()=>{const b=await launch();
try{for(const [w,h,font] of TARGETS)for(const [fx,[file,count,layout,defeated]] of Object.entries(FIX)){const tag=`${fx} ${w}x${h} ${font}px`;
    await run(tag,async()=>{const {ctx,p}=await L.open(b,{w,h,data:fs.readFileSync(file,'utf8')});try{if(font!==14)await L.textSize(p,font);await p.waitForTimeout(400);
        const g=await p.evaluate(()=>{const body=document.querySelector('.workspace-module[data-module=focus] .workspace-module-body').getBoundingClientRect(),cards=document.querySelector('#current_focus .enemy-cards'),detail=document.querySelector('#current_focus .opponent-detail');
            return{layout:cards.dataset.layout,grouped:cards.dataset.grouped,cells:document.querySelectorAll('#current_focus .enemy-card').length,native:document.querySelectorAll('#combat_div .enemy_div').length,caption:document.querySelector('.enemy-roster-toolbar span').textContent,
                cardsBottom:cards.getBoundingClientRect().bottom,detailBottom:detail.hidden?0:detail.getBoundingClientRect().bottom,bodyBottom:body.bottom,page:[document.documentElement.scrollHeight,innerHeight],
                defeated:[...document.querySelectorAll('#current_focus .enemy-card[data-defeated=true]')].map(c=>({text:c.innerText.replace(/\s+/g,' '),visible:c.checkVisibility()}))};});
        assert.equal(g.layout,layout);assert.equal(g.cells,count);assert.equal(g.native,count);assert.match(g.caption,new RegExp(`^${count} opponents? · inspect`));
        assert(g.page[0]<=g.page[1],'page scrolls');assert(g.detailBottom<=g.bodyBottom+1,`inspected facts cut off: ${g.detailBottom} > ${g.bodyBottom}`);assert(g.cardsBottom<=g.bodyBottom+1,'board overflows its panel');
        if(defeated){assert.equal(g.defeated.length,1);assert(g.defeated[0].visible);assert.match(g.defeated[0].text,new RegExp(`^${defeated}\\b.*Defeated`));}
        // Inspection, Compare and keyboard selection are free (UR35).
        const before=await L.state(p);const last=p.locator('#current_focus .enemy-card-name').nth(count-1);
        await last.click({noWaitAfter:true});await p.waitForTimeout(350);
        assert.equal(await p.locator('#current_focus .enemy-card').nth(count-1).getAttribute('data-inspected'),'true');
        assert.equal(await p.evaluate(()=>document.activeElement?.classList.contains('enemy-card-name')),true,'focus left the inspected row');
        if(count>1){await p.locator('.combat-roster-mode').click({noWaitAfter:true});await p.waitForTimeout(350);
            assert.equal(await p.locator('#current_focus .enemy-card-facts:visible').count(),count);assert.equal(await p.locator('#current_focus .opponent-detail').isVisible(),false);
            await p.locator('.combat-roster-mode').click({noWaitAfter:true});await p.waitForTimeout(350);assert(await p.locator('#current_focus .opponent-detail').isVisible());
            await p.locator('#current_focus .enemy-card-name').first().focus();await p.keyboard.press('Enter');await p.waitForTimeout(350);
            assert.equal(await p.locator('#current_focus .enemy-card').first().getAttribute('data-inspected'),'true');}
        assert.deepEqual(await L.state(p),before,'inspection changed game state');
        // WX4/UR52: hover a row, render 30 ticks, nothing moves.
        await p.locator('#current_focus .enemy-card-name').nth(Math.min(2,count-1)).hover();const r0=await rects(p),top0=await p.evaluate(()=>document.getElementById('main_content').style.getPropertyValue('--shell-top-row'));
        // Three rendered ticks at a time, up to 30, while the same fight lasts (nine rats can kill the
        // hero within ten); at least one step must be compared. Defeats inside the fight count.
        const fight=()=>p.evaluate(()=>[...document.querySelectorAll('#combat_div .enemy_div')].map(n=>n.id).join()+'|'+!!document.querySelector('#combat_div .attacker_div'));const f0=await fight();let compared=0,defeats=0;
        for(let step=0;step<10;step++){await p.evaluate(()=>advanceTicks(3,{render:true}));await p.waitForTimeout(350);if(await fight()!==f0)break;compared++;
            assert.deepEqual(await rects(p),r0,`a row moved on ticks (step ${step+1})`);assert.equal(await p.evaluate(()=>document.getElementById('main_content').style.getPropertyValue('--shell-top-row')),top0,'top row moved on ticks');
            defeats=await p.locator('#current_focus .enemy-card[data-defeated=true]').count();}
        assert(compared>0,'fight ended before any tick step could be compared');console.log(`  ticks compared: ${compared*3}, defeated now ${defeats}`);
        assert.deepEqual(p.errors,[]);
        if(w===1366&&font===21)await p.mouse.move(w-3,h-3),await L.shot(p,'../r20/check-'+fx+'-1366x768-21');
    }finally{await ctx.close();}});}}
finally{await b.close();}
fs.writeFileSync(path.join(E,'check-r20.json'),JSON.stringify(results,null,1));console.log(`${results.length-failed}/${results.length} pass`);process.exit(failed?1:0);})();
