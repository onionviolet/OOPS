// MB7 target-set helper (R21, 2026-10-17). One place for the viewport targets in UI_RULES:
// 1920×1080 primary, Weibao's MacBook (~1800×1040 CSS px at DPR 2), floors 1536×864 and
// 1366×768, each at 14px and 21px text. Checks call forTargets() instead of keeping their own list.
// R21_TARGETS="1920x1080x1x21,1366x768x1x14" narrows a run (w x h x dpr x text px).
const L=require('./r11-lib.cjs');const {fs,path}=L;
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const VIEWPORTS=[
    {name:'1920',w:1920,h:1080,dpr:1,role:'primary'},
    {name:'mbp',w:1800,h:1040,dpr:2,role:'Weibao MacBook Pro 14"'},
    {name:'1536',w:1536,h:864,dpr:1,role:'floor (1920 at 125%)'},
    {name:'1366',w:1366,h:768,dpr:1,role:'floor'},
];
const TEXT=[14,21];
function targets(){
    if(process.env.R21_TARGETS)return process.env.R21_TARGETS.split(',').map(t=>{const [w,h,dpr,font]=t.split('x').map(Number);const v=VIEWPORTS.find(v=>v.w===w&&v.h===h&&v.dpr===dpr);return{name:v?.name||`${w}x${h}`,w,h,dpr,font,role:v?.role||'custom'};});
    return VIEWPORTS.flatMap(v=>TEXT.map(font=>({...v,font})));
}
const tag=t=>`${t.name}-${t.font}`;
// A browser bound long enough for the full set (r11-lib's 120 s cuts it short).
async function launch(seconds=900){const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const t=setTimeout(()=>b.close(),seconds*1000);t.unref();b.on('disconnected',()=>clearTimeout(t));return b;}
// Opens a fresh context per target (fresh origin storage), applies the text size, runs fn.
async function forTargets(b,fn,{data=L.save,storage={},list=targets(),settle=400}={}){
    const out=[];
    for(const t of list){
        let ctx;
        try{const o=await L.open(b,{w:t.w,h:t.h,dpr:t.dpr,data,storage});ctx=o.ctx;if(t.font!==14)await L.textSize(o.p,t.font);await o.p.waitForTimeout(settle);
            out.push({target:tag(t),...await fn(o.p,t)});}
        catch(e){out.push({target:tag(t),fail:e.message.split('\n')[0]});console.log('FAIL',tag(t),e.message.split('\n')[0]);}
        finally{await ctx?.close();}
    }
    return out;
}
// Screenshot at the context's device pixel ratio (DPR 2 gives a 3600×2080 image for mbp).
async function shot(p,file){const cdp=await p.context().newCDPSession(p);try{const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,Buffer.from(r.data,'base64'));}finally{await cdp.detach();}}
module.exports={VIEWPORTS,TEXT,targets,tag,launch,forTargets,shot,L};
