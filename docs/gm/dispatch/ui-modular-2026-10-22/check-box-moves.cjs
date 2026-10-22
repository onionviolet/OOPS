// UM9 done check (2026-10-22): a main box looks the same in any slot. For each build, move each
// main box (You, Around you, Inventory) to every main slot through the native Move to control and
// read the look of the region it lands in, compared with its home slot.
// Usage: BEFORE=http://127.0.0.1:19401 AFTER=http://127.0.0.1:19402 node check-box-moves.cjs
const L=require('../ui-foundation-2026-10-15/r11-lib.cjs');const {fs,path}=L;const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const E=path.join(__dirname,'evidence','box-moves');fs.mkdirSync(E,{recursive:true});
const BOXES={you:'vitals',around:'focus',inventory:'belongings'},SLOTS=['player','focus','inventory'];
async function look(b,base,box,slot){
    const ctx=await b.newContext({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
    await ctx.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
    const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(25000);
    await p.goto(base+'/style.css');await p.evaluate(d=>{localStorage.clear();localStorage.setItem('save data',d);},L.save);
    await p.goto(base+'/?test_hooks=1',{waitUntil:'domcontentloaded'});await L.R.startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());
    const moved=await p.evaluate(([box,slot])=>{
        if(slot){document.querySelector('[data-workspace-action=edit-layout]').click();
            const s=document.querySelector(`.shell-move-control select[data-box="${box}"]`)||[...document.querySelectorAll('.shell-move-control select')].find(x=>x.closest('[data-module]')?.dataset.module===box);
            if(!s)return 'no control';s.value=slot;s.dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('[data-workspace-action=edit-layout]').click();}
        return 'ok';},[box,slot]);
    await p.waitForTimeout(1200);
    const r=await p.evaluate(lead=>{const shell=document.querySelector(`.workspace-module[data-module="${lead}"]`),region=shell?.closest('.parity-region'),cs=region&&getComputedStyle(region);
        const binding=document.querySelector('#inventory_content_div .known-item-binding');
        const st=(n,props)=>n?props.map(k=>getComputedStyle(n)[k]).join('|'):null;
        const header=shell?.querySelector('.workspace-module-header'),title=header?.querySelector('strong'),body=shell?.querySelector('.workspace-module-body');
        const row=body&&[...body.querySelectorAll('*')].find(n=>n.children.length===0&&n.textContent.trim()&&n.getClientRects().length);
        const boxButton=header?.querySelector('.control-box-button');
        return {region:region?.dataset.region,background:cs?.backgroundImage+'|'+cs?.backgroundColor,overflowY:cs?.overflowY,binding:binding?getComputedStyle(binding).display:null,
            header:st(header,['fontSize','lineHeight','color','backgroundColor','backgroundImage']),title:st(title,['fontSize','lineHeight','fontFamily','color']),
            row:st(row,['fontSize','lineHeight','fontFamily','color']),controlBox:st(boxButton,['fontSize','lineHeight','color','backgroundColor','borderTopColor'])};},BOXES[box]);
    await ctx.close();return {...r,moved,errors};
}
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const out={};
try{for(const [build,base] of Object.entries({before:process.env.BEFORE,after:process.env.AFTER}))for(const box of Object.keys(BOXES)){
    const home=await look(b,base,box,null);
    for(const slot of SLOTS){const r=slot===home.region?home:await look(b,base,box,slot);
        const keys=['background','overflowY','header','title','row','controlBox',...(box==='inventory'?['binding']:[])],same=keys.every(k=>r[k]===home[k]),differs=keys.filter(k=>r[k]!==home[k]);
        (out[build]??=[]).push({box,slot,landed:r.region,same,home,moved:r});console.log(build,box,'->',slot,'landed',r.region,same?'SAME LOOK':'DIFFERENT LOOK '+differs.join(','),r.errors.length?r.errors:'');}}}
finally{await b.close();}
fs.writeFileSync(path.join(E,'box-moves.json'),JSON.stringify(out,null,1));
const bad=out.after.filter(r=>!r.same||r.landed!==r.slot||r.moved.errors.length);console.log(bad.length?`AFTER FAILS ${bad.length}`:`AFTER ALL SAME ${out.after.length}`);process.exit(bad.length?1:0);})();
