// UIL4 check (2026-10-18): travel and at-a-service layout contexts. Fresh origin per target on the
// populated fixture (as check-uil1.cjs). Records which panels sit in which region, the layout
// context and the companions, before a service view opens, at the Mixing counter and Crafting, and
// after leaving. Travel has no reachable journey on the fixture (needs a simulation save), so the
// test build reads TRAVEL from document.body.dataset.testTravel (see UIL4_REPORT).
// Usage: R4_URL=http://127.0.0.1:PORT PHASE=before|after node check-uil4.cjs
const T=require('./target-set.cjs');const {L}=T;const {fs,path,assert}=L;
const E=path.join(__dirname,'evidence/uil4');fs.mkdirSync(E,{recursive:true});
const LIST=['1920x1080x1x14','1920x1080x1x21','1366x768x1x14','1366x768x1x21'];
const PLACEMENT='yairpg.workspace.v1.desktop.proto23-parity.placement';
const snap=p=>p.evaluate(()=>{const r=document.getElementById('main_content');const reg={};
    for(const x of document.querySelectorAll('.parity-region'))reg[x.dataset.region]=[...x.querySelectorAll(':scope > .workspace-module[data-module]')].filter(n=>!n.hidden&&n.checkVisibility()).map(n=>n.dataset.module);
    const j=document.querySelector('.workspace-module[data-module=records] .workspace-module-body');
    return {context:r.dataset.layoutContext||null,combat:r.dataset.parityCombat,companions:r.dataset.shellCompanions,centerTask:r.dataset.centerTask||null,regions:reg,
        detail:document.querySelector('.workspace-module[data-module=shell-detail]')?.closest('.parity-region')?.dataset.region||null,
        logRegion:document.querySelector('.workspace-module[data-module=messages]')?.closest('.parity-region')?.dataset.region,
        detailText:document.querySelector('#proto23_item_detail')?.textContent.trim().slice(0,60)||null,
        journal:(()=>{const m=document.querySelector('.workspace-module[data-module=records]');return m?{region:m.closest('.parity-region')?.dataset.region,visible:m.checkVisibility(),h:Math.round(m.getBoundingClientRect().height)}:null;})()};});
const settle=p=>p.waitForTimeout(500);
async function run(){
    const phase=process.env.PHASE;assert(['before','after'].includes(phase));
    const b=await T.launch(900),out={phase,targets:{}};
    try{for(const spec of LIST){const [w,h,dpr,font]=spec.split('x').map(Number),tag=`${w}-${font}`;console.log('target',tag);
        const {ctx,p}=await L.open(b,{w,h,dpr});if(font!==14)await L.textSize(p,font);await settle(p);const r=out.targets[tag]={};
        // Select an item so the detail panel has something to show.
        await p.locator('.workspace-module[data-module=belongings] .inventory_item_control').first().click({timeout:3000}).catch(()=>{});await settle(p);
        r.idle=await snap(p);await T.shot(p,path.join(E,`${phase}-${tag}-idle.png`));
        // Journal scroll position and selected item are the restore witnesses.
        await p.evaluate(()=>{const s=[...document.querySelectorAll('.workspace-module[data-module=records] *')].find(n=>n.scrollHeight>n.clientHeight+20);if(s)s.scrollTop=40;window.__scroll=s?(s.scrollTop):null;});
        r.selectedBefore=await p.evaluate(()=>document.querySelector('.inventory_item_control.item_selected, .inventory_item_control[aria-pressed=true], .inventory_item_control.selected')?.textContent?.slice(0,40)||null);
        for(const [key,name] of [['m','mixing'],['c','crafting']]){
            await p.keyboard.press(`Alt+${key}`);await settle(p);r[name]=await snap(p);await T.shot(p,path.join(E,`${phase}-${tag}-${name}.png`));
            await p.keyboard.press('Escape');await settle(p);r[name+'Left']=await snap(p);
            r[name+'Left'].scrollKept=await p.evaluate(()=>{const s=[...document.querySelectorAll('.workspace-module[data-module=records] *')].find(n=>n.scrollHeight>n.clientHeight+20);return s?s.scrollTop:null;});}
        if(phase==='after'){
            await p.evaluate(()=>{document.body.dataset.testTravel='1';});await p.keyboard.press('Alt+h');await settle(p);await p.keyboard.press('Escape');await settle(p);
            r.travel=await snap(p);await T.shot(p,path.join(E,`${phase}-${tag}-travel.png`));
            // Service while travelling: service wins; leaving returns to travel.
            await p.keyboard.press('Alt+m');await settle(p);r.travelMixing=await snap(p);await p.keyboard.press('Escape');await settle(p);r.travelMixingLeft=await snap(p);
            await p.evaluate(()=>{delete document.body.dataset.testTravel;});await p.keyboard.press('Alt+h');await settle(p);await p.keyboard.press('Escape');await settle(p);r.afterTravel=await snap(p);}
        r.errors=p.errors.slice();await ctx.close();}
    if(phase==='after'){
        // Per-context placement: a Journal placed beside the actions for the service context only
        // (spec 4), and a spec-3 placement from UIL1 (Inventory moved top left in idle). Each must
        // load, show only in its context, survive reload and a save export/import (UR17, UR58).
        const S4=JSON.stringify({version:1,spec:4,contexts:{idle:{boxes:{},companions:{},swap:false},combat:{boxes:{},companions:{},swap:false},travel:{boxes:{},companions:{},swap:false},service:{boxes:{},companions:{journal:'actions'},swap:false}}});
        const S3=JSON.stringify({version:1,spec:3,contexts:{idle:{boxes:{inventory:'player'},companions:{},swap:false},combat:{boxes:{},companions:{},swap:false}}});
        out.placement={};
        for(const [name,stored] of [['service-journal',S4],['spec3-idle',S3]]){const pl=out.placement[name]={};
            const {ctx,p}=await L.open(b,{w:1920,h:1080,storage:{[PLACEMENT]:stored}});await settle(p);
            const inv=()=>p.evaluate(()=>document.querySelector('.workspace-module[data-module=belongings]')?.closest('.parity-region')?.dataset.region);
            pl.loaded={idle:await snap(p),inventoryRegion:await inv(),notice:await p.evaluate(()=>document.querySelector('.workspace-status')?.textContent||'')};
            await p.keyboard.press('Alt+m');await settle(p);pl.atMixing=await snap(p);await T.shot(p,path.join(E,`after-placement-${name}-mixing-1920.png`));await p.keyboard.press('Escape');await settle(p);
            await p.reload();await p.waitForFunction(()=>!!window.simulationTestHooks);await L.R.startFresh(p).catch(()=>{});await p.evaluate(()=>simulationTestHooks.pause());await settle(p);
            pl.reloadedIdle=await snap(p);pl.reloadedInventory=await inv();await p.keyboard.press('Alt+m');await settle(p);pl.reloadedMixing=await snap(p);await p.keyboard.press('Escape');await settle(p);
            await p.locator('#save_button').click();const dl=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=path.join(E,`after-roundtrip.save.txt`);await(await dl).saveAs(file);
            const loaded=p.waitForEvent('domcontentloaded',{timeout:30000});await p.locator('#saved_file_input').setInputFiles(file);await loaded;await L.R.startFresh(p).catch(()=>{});await p.evaluate(()=>simulationTestHooks.pause());await settle(p);
            pl.importedIdle=await snap(p);pl.importedInventory=await inv();await p.keyboard.press('Alt+m');await settle(p);pl.importedMixing=await snap(p);fs.rmSync(file);
            pl.stored=JSON.parse(await p.evaluate(k=>localStorage.getItem(k),PLACEMENT));pl.errors=p.errors.slice();await ctx.close();}
    }
    if(phase==='after'){
        // Combat wins over travel and over an open service view (the fixture opens in a fight).
        const combatSave=JSON.stringify({...JSON.parse(L.save),'current location':'Infested field'});out.combat={};
        for(const [w,h,font] of [[1920,1080,14],[1366,768,21]]){const {ctx,p}=await L.open(b,{w,h,data:combatSave});if(font!==14)await L.textSize(p,font);await settle(p);const c=out.combat[`${w}-${font}`]={};
            c.fight=await snap(p);await T.shot(p,path.join(E,`after-${w}-${font}-combat.png`));
            await p.evaluate(()=>{document.body.dataset.testTravel='1';});await p.keyboard.press('Alt+m');await settle(p);c.travelAndMixingKey=await snap(p);
            await p.evaluate(()=>{window.dispatchEvent(new Event('resize'));});await settle(p);c.after=await snap(p);c.errors=p.errors.slice();await ctx.close();}
    }
    }finally{await b.close();}
    fs.writeFileSync(path.join(E,`${phase}.json`),JSON.stringify(out,null,2));console.log('wrote',`${phase}.json`);
}
run().catch(e=>{console.error(e);process.exit(1);});
