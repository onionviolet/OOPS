// R18: inventory category tabs. Synthetic fixtures, fresh browser contexts (fresh origin storage).
// Usage: R4_URL=http://127.0.0.1:19470 node check-r18.cjs
const L=require('./r11-lib.cjs');const {fs,path,assert}=L;const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const E=path.join(__dirname,'evidence/r18');fs.mkdirSync(E,{recursive:true});
const COMBAT=fs.readFileSync(path.join(__dirname,'evidence/parity-r9/populated-three.save.txt'),'utf8');
const CASES=[['idle',1366,768,14,L.save],['idle',1366,768,21,L.save],['idle',1920,1080,21,L.save],['fight',1366,768,21,COMBAT]];
const shot=async(p,name)=>{const cdp=await p.context().newCDPSession(p);try{const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});fs.writeFileSync(path.join(E,name+'.png'),Buffer.from(r.data,'base64'));}finally{await cdp.detach();}};
// R21: at narrow columns the tabs, search and sort live in the Inventory control box; open it.
const reveal=async(p,always=false)=>{const folded=await p.evaluate(()=>document.querySelector('.parity-inventory-controls')?.dataset.categoryFolded==='true');if((folded||always)&&!await p.locator('#control_box_inventory:popover-open').count()&&!await p.locator('.control-box-inline').count()){await p.locator('[data-control-box=inventory] > .control-box-button').click();await p.waitForTimeout(150);}};
const tabs=async p=>{await reveal(p);return p.evaluate(()=>[...document.querySelectorAll('.inventory-tabs > button[data-category]')].map(b=>{const r=b.getBoundingClientRect();return{id:b.dataset.category,count:Number(b.querySelector('.inventory-tab-count').textContent),pressed:b.getAttribute('aria-pressed')==='true',box:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]};}));};
// Rows the native list shows right now (category filter and search both applied).
const visibleRows=p=>p.evaluate(()=>[...document.querySelectorAll('#inventory_content_div > .inventory_item_control')].filter(n=>getComputedStyle(n).display!=='none').length);
async function open(b,{w,h,data,storage}){const {ctx,p}=await L.open(b,{w,h,data,storage});return{ctx,p};}
(async()=>{const results=[];const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const run=async(name,fn)=>{try{const r=await fn();results.push({name,...r});console.log('PASS',name);}catch(e){results.push({name,fail:e.message.split('\n')[0]});console.log('FAIL',name,e.message.split('\n')[0]);}};
try{
for(const [kind,w,h,font,data] of CASES){const tag=`${kind}-${w}x${h}-${font}`;
    await run(`${tag}: each tab's count equals the rows the native filter shows; tabs stay put; no overflow`,async()=>{
        const {ctx,p}=await open(b,{w,h,data});if(font!==14)await L.textSize(p,font);await p.waitForTimeout(800);
        const first=await tabs(p);assert.equal(first.length,5,'five tabs');assert.ok(first.find(t=>t.id==='all').pressed,'All not selected by default');
        const seen={};
        for(const t of first){await p.locator(`.inventory-tabs > button[data-category="${t.id}"]`).click();await p.waitForTimeout(150);
            const now=await tabs(p);seen[t.id]={count:t.count,visible:await visibleRows(p),native:await p.evaluate(id=>document.getElementById(id)?.classList.contains('active_selection_button'),{all:'inventory_show_all',equipment:'inventory_show_equipment',usable:'inventory_show_consumable',other:'inventory_show_other',favorites:'inventory_show_favs'}[t.id])};
            assert.equal(seen[t.id].visible,t.count,`${t.id}: tab says ${t.count}, native filter shows ${seen[t.id].visible}`);assert.ok(seen[t.id].native,`${t.id}: native control not active`);
            assert.ok(now.find(x=>x.id===t.id).pressed,`${t.id} not pressed`);
            assert.deepEqual(now.map(x=>x.box),first.map(x=>x.box),`${t.id}: tabs moved`);
            if(t.count===0){const hint=await p.locator('#inventory_div > .ui-list-empty').textContent();assert.ok(/yet/.test(hint),`${t.id}: empty category line "${hint}"`);seen[t.id].hint=hint;}}
        const page=await p.evaluate(()=>({w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight}));assert.ok(page.w<=w&&page.h<=h,'page overflow');
        const box=first[4].box;assert.ok(box[1]+box[3]<=h&&box[0]+box[2]<=w,'tabs off screen');
        await p.locator('.inventory-tabs > button[data-category="all"]').click();await shot(p,`tabs-${tag}`);assert.deepEqual(p.errors,[]);await ctx.close();return{seen,rows:first.length};});
}
    await run('clear filter returns to All and clears the search; the empty lines tell states apart (UX13)',async()=>{
        const {ctx,p}=await open(b,{w:1366,h:768,data:L.save});
        const clear=p.locator('.inventory-tabs-clear');assert.equal(await clear.isDisabled(),true,'Clear active with nothing to clear');
        await p.locator('.inventory-tabs > button[data-category="usable"]').click();await reveal(p,true);const search=p.locator('#control_box_inventory input[type=search]');await search.fill('zzz');await p.waitForTimeout(200);
        const noMatch=await p.locator('#inventory_div > .ui-list-empty').textContent();assert.match(noMatch,/match "zzz"/);
        assert.equal(await clear.isDisabled(),false);await p.keyboard.press('Escape');const before=await tabs(p);await p.keyboard.press('Escape');await clear.click();await p.waitForTimeout(200);const after=await tabs(p);
        assert.ok(after.find(t=>t.id==='all').pressed);assert.equal(await search.inputValue(),'');assert.equal(await visibleRows(p),after.find(t=>t.id==='all').count);
        assert.deepEqual(after.map(t=>t.box),before.map(t=>t.box),'tabs moved when Clear changed state');assert.deepEqual(p.errors,[]);await ctx.close();return{noMatch};});
    await run('the chosen tab survives reload in this browser and stays out of the game save (NX2)',async()=>{
        const {ctx,p}=await open(b,{w:1366,h:768,data:L.save});await p.locator('.inventory-tabs > button[data-category="equipment"]').click();await p.waitForTimeout(200);
        const stored=await p.evaluate(()=>Object.entries(localStorage).filter(([k,v])=>v.includes('panel.belongings.category')).map(([k])=>k));assert.ok(stored.length,'preference not stored');
        await p.locator('#save_button').click().catch(()=>{});await p.waitForTimeout(300);
        const save=await p.evaluate(()=>localStorage.getItem('save data')||'');assert.ok(save.length>100,'no save written');assert.ok(!save.includes('panel.belongings'),'preference leaked into the game save');
        await p.reload({waitUntil:'domcontentloaded'});await p.waitForFunction(()=>!!window.simulationTestHooks);await L.R.startFresh(p);await p.waitForTimeout(800);
        const t=await tabs(p);assert.ok(t.find(x=>x.id==='equipment').pressed,'choice lost on reload');assert.equal(await visibleRows(p),t.find(x=>x.id==='equipment').count);
        assert.deepEqual(p.errors,[]);await ctx.close();return{stored};});
    await run('30 rendered ticks under a hovered tab move no tab and keep the selection (UR52)',async()=>{
        const {ctx,p}=await open(b,{w:1366,h:768,data:COMBAT});await L.textSize(p,21);await reveal(p);await p.locator('.inventory-tabs > button[data-category="other"]').click();await p.waitForTimeout(2600);
        await p.locator('.inventory-tabs > button[data-category="usable"]').hover();const before=await tabs(p);await p.evaluate(()=>advanceTicks(30,{render:true}));await p.waitForTimeout(500);const after=await tabs(p);
        assert.deepEqual(after.map(t=>t.box),before.map(t=>t.box));assert.ok(after.find(t=>t.id==='other').pressed);assert.deepEqual(p.errors,[]);await ctx.close();return{before:before.map(t=>t.count),after:after.map(t=>t.count)};});
    await run('value sort orders by the shown value and puts rows with no shown value last in both directions (CTL13)',async()=>{
        const {ctx,p}=await open(b,{w:1366,h:768,data:L.save});
        const real=await p.evaluate(()=>[...document.querySelectorAll('#inventory_content_div > .inventory_item_control[data-unsellable="true"]')].length);
        // If the fixture holds no unsellable item, mark one row as showing no value (synthetic, labelled).
        const marked=real?null:await p.evaluate(()=>{const n=document.querySelector('#inventory_content_div > .inventory_item_control:not(.equipped_item_control)');n.dataset.unsellable='true';n.dataset.item_value='99999';n.querySelector('.item_value').textContent='';return n.querySelector('.item_name').textContent;});
        await reveal(p,true);await p.selectOption('[aria-label="Inventory sort"]','inventory_sort_by_price');await p.waitForTimeout(200);
        // The native sort groups by type first (other, components, books, equippables), then by value.
        const order=()=>p.evaluate(()=>[...document.querySelectorAll('#inventory_content_div > .inventory_item_control:not(.equipped_item_control)')].map(n=>({name:n.querySelector('.item_name').textContent,group:[n.classList.contains('character_item_equippable'),n.querySelector('.item_category')?.textContent.trim()].join('|'),hidden:n.dataset.unsellable==='true',shown:n.querySelector('.item_value')?.textContent.trim()})));
        const asc=await order();await reveal(p,true);await p.locator('.inventory-sort-direction').click();await p.waitForTimeout(200);const desc=await order();
        for(const [label,list] of [['ascending',asc],['descending',desc]])for(const group of new Set(list.map(r=>r.group))){const rows=list.filter(r=>r.group===group),firstHidden=rows.findIndex(r=>r.hidden);
            assert.ok(firstHidden<0||rows.slice(firstHidden).every(r=>r.hidden),`${label}, group ${group}: a row with no shown value sorts among shown values`);}
        assert.equal(await p.locator('.inventory-sort-direction').textContent(),'↓');assert.deepEqual(p.errors,[]);await ctx.close();return{realUnsellable:real,marked,asc:asc.slice(-3),desc:desc.slice(-3)};});
}finally{await b.close();}
fs.writeFileSync(path.join(E,'check-r18.json'),JSON.stringify(results,null,1));
const failed=results.filter(r=>r.fail);console.log(failed.length?`FAILED ${failed.length}/${results.length}`:`ALL PASS ${results.length}/${results.length}`);process.exit(failed.length?1:0);})();
