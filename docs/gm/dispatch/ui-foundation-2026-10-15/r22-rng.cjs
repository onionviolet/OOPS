// R22 seeded-run check: the same fixture on the before and after builds must produce the same
// native combat lines (original text, in order) and the same encounter state. Text-only change.
// Usage: BEFORE=http://127.0.0.1:19521 AFTER=http://127.0.0.1:19520 node r22-rng.cjs [fixture]
const L=require('./r11-lib.cjs');const {fs,path}=L;const {chromium}=require("/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fx=process.argv[2]||path.join(__dirname,'evidence/r20/fixtures/opponents-8-mixed.save.txt');
const run=async(url)=>{process.env.R4_URL=url;delete require.cache[require.resolve('./r11-lib.cjs')];const L2=require('./r11-lib.cjs');
    const b=await chromium.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
    try{const {p}=await L2.open(b,{w:1920,h:1080,data:fs.readFileSync(fx,'utf8')});await p.evaluate(()=>simulationTestHooks.resume());await p.waitForTimeout(Number(process.env.R22_RUN||8000));await p.evaluate(()=>simulationTestHooks.pause());
        return await p.evaluate(()=>({lines:[...document.querySelectorAll('#message_log_div .message_combat')].map(n=>{const o=n.querySelector('.log-original')?.textContent.trim();return {text:o,repeat:Number(n.dataset.repeat||1)};}),
            native:simulationTestHooks.snapshot().native_encounter,errors:[]}));}finally{await b.close();}};
(async()=>{const a=await run(process.env.BEFORE),c=await run(process.env.AFTER);
    const expand=r=>r.lines.flatMap(l=>Array(l.repeat).fill(l.text)).sort();const A=expand(a),C=expand(c);
    // Same-tick swings interleave in real-timer order, which varies run to run even on one build,
    // so lines compare as a multiset; the keyed RNG fixes each fighter's outcome per turn.
    const state=x=>JSON.stringify({turns:x.native?.turns,enemies:x.native?.enemies?.map(e=>[e.key,e.full?.health,e.alive])});
    const sameLines=JSON.stringify(A)===JSON.stringify(C),sameState=state(a)===state(c);
    console.log('combat events',A.length,'vs',C.length,'(after rows',c.lines.length+')','multiset',sameLines?'SAME':'DIFF','state',sameState?'SAME':'DIFF',sameLines&&sameState?'PASS':'FAIL');
    if(!sameState)console.log(state(a),'\n',state(c));
})();
