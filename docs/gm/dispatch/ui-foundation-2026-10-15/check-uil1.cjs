// UIL1 check (2026-10-18): the route table and LAYOUT_SPEC v3 change nothing a player sees.
// Records the navigation bar, hotkeys, More N, Back and a stored R21 placement on the populated
// fixture, so a run against the pre-UIL1 build and one against the rebuilt tree can be diffed.
// Usage: R4_URL=http://127.0.0.1:PORT PHASE=before|after node check-uil1.cjs
//        node check-uil1.cjs compare   (diffs evidence/uil1/before.json and after.json)
const T=require('./target-set.cjs');const {L}=T;const {fs,path,assert}=L;
const E=path.join(__dirname,'evidence/uil1');fs.mkdirSync(E,{recursive:true});
const PLACEMENT='yairpg.workspace.v1.desktop.proto23-parity.placement';
// A placement stored by the R21 build (spec 2): Inventory moved to the top left in idle.
const STORED_V2=JSON.stringify({version:1,spec:2,contexts:{idle:{boxes:{inventory:'player'},companions:{},swap:false},combat:{boxes:{},companions:{},swap:false}}});
const LIST=['1920x1080x1x14','1920x1080x1x21','1366x768x1x14','1366x768x1x21'];
const regionOf=(p,id)=>p.evaluate(id=>document.querySelector(`.workspace-module[data-module="${id}"]`)?.closest('.parity-region')?.dataset.region||null,id);
const navState=p=>p.evaluate(()=>({
    buttons:[...document.querySelectorAll('#workspace_navigation > button[data-panel-path]')].map(b=>({label:b.textContent,path:b.dataset.panelPath,tab:b.dataset.panelTab||null,title:b.title,keys:b.getAttribute('aria-keyshortcuts'),hidden:b.hidden,disabled:b.disabled,overflow:b.dataset.barOverflow||null,current:b.getAttribute('aria-current')})),
    pane:[...document.querySelectorAll('#workspace_pane_navigation > button[data-panel-path]')].map(b=>({label:b.textContent,path:b.dataset.panelPath,hidden:b.hidden,disabled:b.disabled})),
    more:document.querySelector('[data-control-box=game-bar-more] > .control-box-button')?.textContent||null,
    moreHidden:document.querySelector('[data-control-box=game-bar-more]')?.hidden??null,
    moreItems:[...document.querySelectorAll('#control_box_game-bar-more .game-bar-overflow-item')].map(b=>[b.textContent,b.dataset.overflowPath,b.dataset.overflowTab||null]),
    morePanels:[...document.querySelectorAll('#workspace_navigation > select option')].map(o=>[o.value,o.textContent,o.disabled]),
}));
const where=p=>p.evaluate(()=>{const nav=document.getElementById('center_mode_navigation'),back=document.getElementById('center_mode_back');
    return {mode:nav?.dataset.centerMode||'',back:back&&back.checkVisibility()?back.textContent.trim():null,
    focus:document.activeElement?.id||document.activeElement?.className||null,expanded:document.querySelector('#center_mode_content .workspace-module')?.dataset.module||null,
    heading:document.querySelector('#center_mode_content .expanded-panel-heading')?.textContent||null};});
// Hotkeys to exercise: Inventory (R13 in place), Journal tabs, Skills, Stats, Here, Crafting, Mixing.
const KEYS=['i','j','b','a','k','e','h','c','m','p','l','s'];
async function run(){
    const phase=process.env.PHASE;assert(['before','after'].includes(phase),'PHASE=before|after');
    const b=await T.launch(900),out={phase,url:process.env.R4_URL,targets:{}};
    try{for(const spec of LIST){const [w,h,dpr,font]=spec.split('x').map(Number),tag=`${w}-${font}`;console.log('target',tag);
        const {ctx,p}=await L.open(b,{w,h,dpr});if(font!==14)await L.textSize(p,font);await p.waitForTimeout(800);
        const r=out.targets[tag]={};
        r.nav=await navState(p);
        await T.shot(p,path.join(E,`${phase}-${tag}.png`));
        const bar=await p.locator('#game_bar').boundingBox();
        await p.screenshot({path:path.join(E,`${phase}-${tag}-bar.png`),clip:{x:0,y:0,width:w,height:Math.ceil(bar.height)}});
        const more=p.locator('[data-control-box=game-bar-more]');
        if(await more.isVisible()){await more.locator(':scope > .control-box-button').click();await p.waitForTimeout(200);r.moreOpen=await navState(p).then(s=>s.moreItems);await T.shot(p,path.join(E,`${phase}-${tag}-more.png`));await p.keyboard.press('Escape');await p.waitForTimeout(150);}
        r.keys={};
        for(const k of KEYS){await p.keyboard.press(`Alt+${k}`);await p.waitForTimeout(350);const at=await where(p);await p.keyboard.press('Escape');await p.waitForTimeout(300);r.keys[k]={...at,afterEsc:await where(p)};}
        // Back: open Inventory large through More panels, then Journal through the bar; Esc names the way back.
        await p.keyboard.press('Alt+j');await p.waitForTimeout(300);await p.keyboard.press('Alt+k');await p.waitForTimeout(300);
        r.backChain=[await where(p)];await p.keyboard.press('Escape');await p.waitForTimeout(300);r.backChain.push(await where(p));await p.keyboard.press('Escape');await p.waitForTimeout(300);r.backChain.push(await where(p));
        r.errors=p.errors.slice();await ctx.close();}
    // Stored placement: the spec-2 placement must load, survive reload and a save import.
    const {ctx,p}=await L.open(b,{w:1920,h:1080,storage:{[PLACEMENT]:STORED_V2}});
    const pl=out.placement={loaded:await regionOf(p,'belongings'),you:await regionOf(p,'vitals'),notice:await p.evaluate(()=>document.querySelector('.workspace-status')?.textContent||'')};
    await p.reload();await p.waitForFunction(()=>!!window.simulationTestHooks);await L.R.startFresh(p).catch(()=>{});await p.evaluate(()=>simulationTestHooks.pause());await p.waitForTimeout(800);
    pl.reloaded=await regionOf(p,'belongings');pl.stored=JSON.parse(await p.evaluate(k=>localStorage.getItem(k),PLACEMENT));
    await p.locator('#save_button').click();const dl=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=path.join(E,`${phase}-roundtrip.save.txt`);await(await dl).saveAs(file);
    const loaded=p.waitForEvent('domcontentloaded',{timeout:30000});await p.locator('#saved_file_input').setInputFiles(file);await loaded;await L.R.startFresh(p).catch(()=>{});await p.evaluate(()=>simulationTestHooks.pause());await p.waitForTimeout(800);
    pl.imported=await regionOf(p,'belongings');pl.errors=p.errors.slice();
    await T.shot(p,path.join(E,`${phase}-placement-imported-1920.png`));fs.rmSync(file);await ctx.close();
    }finally{await b.close();}
    fs.writeFileSync(path.join(E,`${phase}.json`),JSON.stringify(out,null,2));console.log('wrote',`${phase}.json`);
}
function compare(){
    const a=JSON.parse(fs.readFileSync(path.join(E,'before.json'))),z=JSON.parse(fs.readFileSync(path.join(E,'after.json')));
    const diffs=[];const walk=(x,y,at)=>{if(JSON.stringify(x)===JSON.stringify(y))return;if(x&&y&&typeof x==='object'&&typeof y==='object'){for(const k of new Set([...Object.keys(x),...Object.keys(y)]))walk(x[k],y[k],`${at}.${k}`);}else diffs.push(`${at}: ${JSON.stringify(x)} -> ${JSON.stringify(y)}`);};
    walk(a.targets,z.targets,'targets');walk({...a.placement,stored:{...a.placement.stored,spec:'*'}},{...z.placement,stored:{...z.placement.stored,spec:'*'}},'placement');
    console.log(diffs.length?diffs.join('\n'):'no behavior differences');console.log('stored spec before',a.placement.stored.spec,'after',z.placement.stored.spec);
    process.exitCode=diffs.length?1:0;
}
(process.argv[2]==='compare'?Promise.resolve(compare()):run()).catch(e=>{console.error(e.stack);process.exitCode=1;});
