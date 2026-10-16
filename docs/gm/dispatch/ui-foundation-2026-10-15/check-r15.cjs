// R15: native place types in the shell place header during a fight. Synthetic fixture only.
// Usage: R4_URL=http://127.0.0.1:19261 node check-r15.cjs
const L=require('./r11-lib.cjs');const {fs,path,assert}=L;
const E=path.join(__dirname,'evidence/r15');fs.mkdirSync(E,{recursive:true});
const FIX=fs.readFileSync(path.join(__dirname,'evidence/parity-r9/populated-three.save.txt'),'utf8');
const shot=async(p,name)=>{const cdp=await p.context().newCDPSession(p);try{const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});fs.writeFileSync(path.join(E,name+'.png'),Buffer.from(r.data,'base64'));}finally{await cdp.detach();}};
const popover=p=>p.evaluate(()=>{const n=document.getElementById('shell_context_preview');return{open:!!n?.matches(':popover-open'),text:n?.textContent||''};});
// NX19: every style rule written in ui_tokens.css must survive parsing.
const parseCheck=p=>p.evaluate(async()=>{
    const sheet=[...document.styleSheets].find(s=>s.href?.includes('ui_tokens.css'));
    const source=await (await fetch(sheet.href)).text();
    const text=source.replace(/\/\*[\s\S]*?\*\//g,'');let depth=0,written=0,stack=[],start=0;
    for(let i=0;i<text.length;i++){const c=text[i];if(c==='{'){const head=text.slice(start,i).trim();stack.push(head);if(!head.startsWith('@'))written++;depth++;start=i+1;}else if(c==='}'){stack.pop();depth--;start=i+1;}else if(c===';'&&!stack.length)start=i+1;}
    let parsed=0;const walk=rules=>{for(const r of rules){if(r.type===1)parsed++;if(r.cssRules)walk(r.cssRules);}};walk(sheet.cssRules);
    return{written,parsed,balanced:depth===0};});
(async()=>{const results=[];
for(const [w,h,font] of [[1366,768,14],[1366,768,17.5],[1366,768,21],[1920,1080,21]]){
    const b=await L.launch();const tag=`${w}x${h}-${font}`;
    try{const {ctx,p}=await L.open(b,{w,h,data:FIX});if(font!==14)await L.textSize(p,font);
        const r={tag};
        r.combat=await p.evaluate(()=>document.getElementById('main_content').dataset.parityCombat);
        const native=await p.evaluate(()=>[...document.querySelectorAll('#location_types_div .location_type_div')].map(n=>({label:n.firstChild?.textContent.trim(),tip:n.querySelector('.location_type_tooltip')?.innerText.replace(/\s+/g,' ').trim()})));
        const tags=p.locator('.scene-place-tags .shell-place-tag');r.native=native;r.tags=await tags.allTextContents();
        assert.equal(r.combat,'true',`${tag}: fixture is not in combat`);
        assert.ok(native.length>0,`${tag}: fixture place has no native types`);
        assert.deepEqual(r.tags,native.map(n=>n.label),`${tag}: shell tags differ from native`);
        const first=tags.first();r.box=await first.boundingBox();
        assert.ok(r.box&&r.box.y>=0&&r.box.y+r.box.height<=h&&r.box.x+r.box.width<=w,`${tag}: tag off screen`);
        await shot(p,`combat-${tag}`);
        // Focus shows the same native facts; Esc closes and keeps focus; Enter reopens.
        await first.focus();await p.waitForTimeout(150);let pop=await popover(p);r.focusOpen=pop.open;
        const facts=native[0].tip.split(/(?<=\d)(?=[A-Z])|\s(?=[A-Z][a-z]+ x)/)[0];
        assert.ok(pop.open&&pop.text.replace(/\s+/g,' ').includes(native[0].tip.split(' x')[0].split(/\s+/).slice(0,4).join(' ')),`${tag}: focus popover lacks native description`);
        r.popoverText=pop.text;await shot(p,`tag-focus-${tag}`);
        await p.keyboard.press('Escape');await p.waitForTimeout(100);pop=await popover(p);r.escClosed=!pop.open;
        r.focusKept=await p.evaluate(()=>document.activeElement?.classList.contains('shell-place-tag'));
        assert.ok(r.escClosed&&r.focusKept,`${tag}: Esc did not close or lost focus`);
        await p.keyboard.press('Enter');await p.waitForTimeout(150);r.enterOpen=(await popover(p)).open;assert.ok(r.enterOpen,`${tag}: Enter did not reopen`);
        await p.keyboard.press('Escape');
        // Hover parity.
        await p.mouse.move(0,0);await p.waitForTimeout(300);await first.hover();await p.waitForTimeout(200);r.hoverOpen=(await popover(p)).open;assert.ok(r.hoverOpen,`${tag}: hover did not open`);
        await p.mouse.move(0,0);await p.waitForTimeout(300);
        // Ticks keep focus on the tag (UR52).
        await first.focus();await p.evaluate(()=>advanceTicks(30,{render:true}));await p.waitForTimeout(400);
        r.focusAfterTicks=await p.evaluate(()=>document.activeElement?.classList.contains('shell-place-tag'));assert.ok(r.focusAfterTicks,`${tag}: ticks moved focus`);
        r.page=await p.evaluate(()=>({scrollW:document.documentElement.scrollWidth,scrollH:document.documentElement.scrollHeight,w:innerWidth,h:innerHeight}));
        assert.ok(r.page.scrollW<=r.page.w&&r.page.scrollH<=r.page.h,`${tag}: page overflow`);
        r.parse=await parseCheck(p);assert.ok(r.parse.balanced&&r.parse.parsed>=r.parse.written,`${tag}: dropped CSS rules ${JSON.stringify(r.parse)}`);
        // NX4: modules the shell hides in combat, listed for the sweep; location must now have a route.
        r.hiddenModules=await p.evaluate(()=>[...document.querySelectorAll('.workspace-module[data-module]')].filter(n=>getComputedStyle(n).display==='none').map(n=>n.dataset.module));
        r.errors=p.errors;assert.deepEqual(p.errors,[],`${tag}: page errors`);
        results.push(r);console.log('PASS',tag,JSON.stringify({tags:r.tags,parse:r.parse}));await ctx.close();
    }catch(e){console.log('FAIL',tag,e.message);results.push({tag,fail:e.message});}
    finally{await b.close();}
}
fs.writeFileSync(path.join(E,'check-r15.json'),JSON.stringify(results,null,1));
const failed=results.filter(r=>r.fail);console.log(failed.length?`FAILED ${failed.length}/${results.length}`:`ALL PASS ${results.length}/${results.length}`);process.exit(failed.length?1:0);})();
