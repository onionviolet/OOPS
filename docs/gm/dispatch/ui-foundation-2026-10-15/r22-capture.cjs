// R22 capture: a running fight (populated-three, 5 and 8-mixed synthetic) at the R22 targets.
// Lets the fight run, then records the Reports log lines (text, kind, letters, repeat counts) and a
// screenshot. Synthetic fixtures only. Usage: R4_URL=http://127.0.0.1:19520 node r22-capture.cjs <label> [fixture,...]
const L=require('./r11-lib.cjs');const {fs,path}=L;const {chromium}=require("/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");L.launch=async()=>{const b=await chromium.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});const t=setTimeout(()=>{console.error("R22 600s bound");b.close()},600000);t.unref();b.on("disconnected",()=>clearTimeout(t));return b;};
const label=process.argv[2]||'run';const E=path.join(__dirname,'evidence/r22',label);fs.mkdirSync(E,{recursive:true});
const F=path.join(__dirname,'evidence/r20/fixtures');
const ALL={three:path.join(__dirname,'evidence/parity-r9/populated-three.save.txt'),...Object.fromEntries([1,5,8,'8-mixed'].map(n=>[`n${n}`,path.join(F,`opponents-${n}.save.txt`)]))};
const pick=(process.argv[3]||'three,n8-mixed').split(',');
const TARGETS=(process.env.R22_TARGETS||'1920x1080x14,1366x768x14,1366x768x21').split(',').map(t=>t.split('x').map(Number));
const RUN=Number(process.env.R22_RUN||9000);
const shot=async(p,name)=>{const cdp=await p.context().newCDPSession(p);try{const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});fs.writeFileSync(path.join(E,name+'.png'),Buffer.from(r.data,'base64'));}finally{await cdp.detach();}};
const readLog=p=>p.evaluate(()=>{const log=document.getElementById('message_log_div');const vis=n=>n.checkVisibility();
    return [...log.querySelectorAll('.message_combat')].filter(vis).slice(-24).map(n=>({kind:n.dataset.logKind,text:(n.querySelector('.log-compact')||n).innerText.replace(/\s+/g,' ').trim(),
        letters:[...n.querySelectorAll('.log-letter')].map(s=>s.textContent),sides:[...n.querySelectorAll('[data-side]')].map(s=>s.dataset.side),
        repeat:n.dataset.repeat||null,outcome:n.dataset.combatOutcome||null,direction:n.dataset.combatDirection||null}));});
(async()=>{const results=[];const b=await L.launch();
try{for(const fx of pick)for(const [w,h,font] of TARGETS){const tag=`${fx}-${w}x${h}-${font}`;
    try{const {ctx,p}=await L.open(b,{w,h,data:fs.readFileSync(ALL[fx],'utf8')});if(font!==14)await L.textSize(p,font);await p.evaluate(()=>simulationTestHooks.resume());await p.waitForTimeout(RUN);await p.evaluate(()=>simulationTestHooks.pause());await p.mouse.move(w-3,h-3);
        const lines=await readLog(p);const r={tag,lines,errors:p.errors,page:await p.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.scrollHeight,innerWidth,innerHeight])};await shot(p,tag);results.push(r);
        console.log(tag,'lines',lines.length,'repeats',lines.filter(l=>l.repeat).length,'letters',lines.filter(l=>l.letters.length).length,'page',r.page[1]<=r.page[3]&&r.page[0]<=r.page[2]?'ok':'OVERFLOW',r.errors.length?'ERR '+r.errors[0]:'');
        for(const l of lines.slice(-8))console.log('   ',l.kind,'|',l.text,l.repeat?`(x${l.repeat})`:'');await ctx.close();
    }catch(e){console.log('FAIL',tag,e.message.split('\n')[0]);results.push({tag,fail:e.message});}}}
finally{await b.close();}
fs.writeFileSync(path.join(E,'capture.json'),JSON.stringify(results,null,1));console.log('wrote',E);})();
