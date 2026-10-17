// R20 capture: combat fixtures (populated-three plus 1/5/8/9 synthetic) at the three targets.
// Records the top row, focus region, opponent board and inventory rows, and a screenshot.
// Usage: R4_URL=http://127.0.0.1:19480 node r20-capture.cjs <label> [fixture,...]
const L=require('./r11-lib.cjs');const {fs,path}=L;const {chromium}=require("/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");L.launch=async()=>{const b=await chromium.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});const t=setTimeout(()=>{console.error("R20 600s bound");b.close()},600000);t.unref();b.on("disconnected",()=>clearTimeout(t));return b;};
const label=process.argv[2]||'run';const E=path.join(__dirname,'evidence/r20',label);fs.mkdirSync(E,{recursive:true});
const F=path.join(__dirname,'evidence/r20/fixtures');
const ALL={three:path.join(__dirname,'evidence/parity-r9/populated-three.save.txt'),...Object.fromEntries([1,5,8,9,'8-mixed'].map(n=>[`n${n}`,path.join(F,`opponents-${n}.save.txt`)]))};
const pick=(process.argv[3]||Object.keys(ALL).join(',')).split(',');
const TARGETS=(process.env.R20_TARGETS||'1366x768x14,1366x768x21,1920x1080x21').split(',').map(t=>t.split('x').map(Number));
const shot=async(p,name)=>{const cdp=await p.context().newCDPSession(p);try{const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});fs.writeFileSync(path.join(E,name+'.png'),Buffer.from(r.data,'base64'));}finally{await cdp.detach();}};
const measure=p=>p.evaluate(()=>{
    const box=n=>{if(!n)return null;const r=n.getBoundingClientRect();return{y:Math.round(r.y),h:Math.round(r.height),w:Math.round(r.width),client:n.clientHeight,content:n.scrollHeight};};
    const reg=id=>document.querySelector(`.parity-region[data-region="${id}"]`);
    const inv=document.getElementById('inventory_content_div'),ir=inv?.getBoundingClientRect();
    const invRows=inv?[...inv.querySelectorAll(':scope > [data-character_item]')].filter(n=>{const b=n.getBoundingClientRect();return n.checkVisibility()&&b.top>=ir.top-1&&b.bottom<=ir.bottom+1;}).length:0;
    const root=document.getElementById('main_content');
    const board=document.querySelector('#current_focus .opponent-board')||document.querySelector('#current_focus .enemy-cards');
    const cards=[...document.querySelectorAll('#current_focus [data-enemy-card]')].filter(n=>n.checkVisibility()).map(n=>({id:n.dataset.enemyCard,h:Math.round(n.getBoundingClientRect().height),text:n.innerText.replace(/\s+/g,' ').slice(0,90),defeated:n.dataset.defeated||null}));
    const focusBody=document.querySelector('.workspace-module[data-module=focus] .workspace-module-body');
    return{topRow:root.style.getPropertyValue('--shell-top-row'),font:getComputedStyle(document.getElementById('current_focus')).fontSize,
        player:box(reg('player')),focus:box(reg('focus')),focusBody:box(focusBody),board:box(board),layout:board?.dataset.layout||null,cards,nativeFighters:document.querySelectorAll('#combat_div .enemy_div').length,
        invRows,page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight,innerWidth,innerHeight]};});
(async()=>{const results=[];const b=await L.launch();
try{for(const fx of pick)for(const [w,h,font] of TARGETS){const tag=`${fx}-${w}x${h}-${font}`;
    try{const {ctx,p}=await L.open(b,{w,h,data:fs.readFileSync(ALL[fx],'utf8')});if(font!==14)await L.textSize(p,font);await p.waitForTimeout(400);await p.mouse.move(w-3,h-3);
        const r={tag,...await measure(p),errors:p.errors};await shot(p,tag);results.push(r);
        console.log(tag,'top',r.topRow,'focus',r.focus?.h,'board',r.board?.h,'/',r.board?.content,'layout',r.layout,'cards',r.cards.length,'native',r.nativeFighters,'inv',r.invRows,'page',r.page[1]<=r.page[3]?'ok':'OVERFLOW',r.errors.length?'ERR '+r.errors[0]:'');await ctx.close();
    }catch(e){console.log('FAIL',tag,e.message.split('\n')[0]);results.push({tag,fail:e.message});}}}
finally{await b.close();}
fs.writeFileSync(path.join(E,'capture.json'),JSON.stringify(results,null,1));console.log('wrote',E);})();
