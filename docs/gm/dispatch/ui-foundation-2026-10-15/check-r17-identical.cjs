// R17 (AR9 structural round): the game looks identical before and after. For each fixture and
// target, render two builds on fresh origins with seeded randomness and a fixed clock, then compare
// every region/panel box and the screenshot pixels.
// Usage: BEFORE=http://127.0.0.1:19274 AFTER=http://127.0.0.1:19271 node check-r17-identical.cjs [label]
const L=require('./r11-lib.cjs');const {fs,path,assert}=L;const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const label=process.argv[2]||'identical';const E=path.join(__dirname,'evidence/r17',label);fs.mkdirSync(E,{recursive:true});
const FIX={fresh:null,populated:L.save,combat:fs.readFileSync(path.join(__dirname,'evidence/parity-r9/populated-three.save.txt'),'utf8')};
const TARGETS=[[1366,768,14],[1366,768,21],[1920,1080,21]];
const BUILDS={before:process.env.BEFORE||'http://127.0.0.1:19274',after:process.env.AFTER||'http://127.0.0.1:19271'};
const ready=p=>p.waitForFunction(()=>!!window.simulationTestHooks&&!!document.getElementById('workspace_navigation'),null,{timeout:60000});
async function render(b,base,data,w,h,font){
    const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});
    await ctx.addInitScript(()=>{Date.now=()=>1792108800000;let n=41;Math.random=()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);crypto.getRandomValues=a=>{for(let i=0;i<a.length;i++)a[i]=12345+i;return a;};});
    await ctx.route('**/favicon.ico',r=>r.abort());await ctx.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
    const p=await ctx.newPage();p.errors=[];p.on('pageerror',e=>p.errors.push(e.message));p.setDefaultTimeout(25000);
    await p.goto(base+'/style.css');await p.evaluate(d=>{localStorage.clear();if(d)localStorage.setItem('save data',d);},data);
    await p.goto(base+'/?test_hooks=1',{waitUntil:'domcontentloaded'});await ready(p);
    if(JSON.parse(data||'{}')['current location']==='Infested field'){await p.locator('#loading_screen_play_button:not(.none_display)').click({noWaitAfter:true});await p.locator('#combat_div .fighter_div').first().waitFor({state:'attached'});}else await L.R.startFresh(p);
    await p.evaluate(()=>simulationTestHooks.pause());if(font!==14)await L.textSize(p,font);
    await p.mouse.move(0,h-1);await p.waitForTimeout(2600);
    const geo=await p.evaluate(()=>{const box=n=>{const r=n.getBoundingClientRect();return[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)];};
        const m=document.getElementById('main_content');
        return{presentation:m.dataset.presentation,parity:m.dataset.parity,companions:m.dataset.shellCompanions||'',rows:getComputedStyle(document.querySelector('.workspace-board')).gridTemplateRows,
            regions:Object.fromEntries([...document.querySelectorAll('.parity-region')].map(n=>[n.dataset.region,box(n)])),
            modules:Object.fromEntries([...document.querySelectorAll('.workspace-module[data-module]')].filter(n=>n.getClientRects().length).map(n=>[n.dataset.module,box(n)]))};});
    const cdp=await ctx.newCDPSession(p);const shot=Buffer.from((await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false})).data,'base64');
    const errors=p.errors;await ctx.close();return{geo,shot,errors};
}
(async()=>{const results=[];const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const ONLY=process.env.ONLY?new RegExp(process.env.ONLY):null;
try{for(const [fx,data] of Object.entries(FIX))for(const [w,h,font] of TARGETS){const tag=`${fx}-${w}x${h}-${font}`;if(ONLY&&!ONLY.test(tag))continue;
    let r;try{const before=await render(b,BUILDS.before,data,w,h,font),after=await render(b,BUILDS.after,data,w,h,font);
        fs.writeFileSync(path.join(E,`${tag}-before.png`),before.shot);fs.writeFileSync(path.join(E,`${tag}-after.png`),after.shot);
        const compare=async(x,y)=>{const page=await b.newPage();try{return await page.evaluate(async([a,c])=>{const load=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src='data:image/png;base64,'+s;});const[ia,ic]=await Promise.all([load(a),load(c)]);
            if(ia.width!==ic.width||ia.height!==ic.height)return{pixels:-1};const cv=new OffscreenCanvas(ia.width,ia.height),x=cv.getContext('2d');x.drawImage(ia,0,0);const da=x.getImageData(0,0,ia.width,ia.height).data;x.clearRect(0,0,ia.width,ia.height);x.drawImage(ic,0,0);const dc=x.getImageData(0,0,ia.width,ia.height).data;
            let n=0,minX=1e9,minY=1e9,maxX=-1,maxY=-1;for(let i=0;i<da.length;i+=4)if(da[i]!==dc[i]||da[i+1]!==dc[i+1]||da[i+2]!==dc[i+2]){n++;const p=i/4,px=p%ia.width,py=(p/ia.width)|0;minX=Math.min(minX,px);minY=Math.min(minY,py);maxX=Math.max(maxX,px);maxY=Math.max(maxY,py);}
            return{pixels:n,box:n?[minX,minY,maxX,maxY]:null};},[x.toString('base64'),y.toString('base64')]);}finally{await page.close();}};
        const diff=await compare(before.shot,after.shot);
        r={tag,diff,geoEqual:JSON.stringify(before.geo)===JSON.stringify(after.geo),errors:{before:before.errors,after:after.errors}};
        if(!r.geoEqual){r.geo={before:before.geo,after:after.geo};r.changed=Object.fromEntries(Object.keys({...before.geo.modules,...after.geo.modules}).filter(k=>JSON.stringify(before.geo.modules[k])!==JSON.stringify(after.geo.modules[k])).map(k=>[k,[before.geo.modules[k],after.geo.modules[k]]]));}
        assert.deepEqual(after.geo,before.geo,`${tag}: geometry differs`);assert.deepEqual(after.errors,[],`${tag}: page errors`);
        // Noise floor: if pixels differ, render the before build again. When the same build also
        // differs from itself (fresh-game content varies), the case passes on geometry alone and is
        // reported as noisy; otherwise any pixel difference fails.
        // Up to three extra before renders; noise counts only where the before build varies inside
        // the same box as the before/after difference.
        if(diff.pixels){const within=(a,c)=>a&&c&&c[0]>=a[0]-2&&c[1]>=a[1]-2&&c[2]<=a[2]+2&&c[3]<=a[3]+2;
            for(let i=2;i<=4&&!r.noisy;i++){const again=await render(b,BUILDS.before,data,w,h,font);const noise=await compare(before.shot,again.shot);
                fs.writeFileSync(path.join(E,`${tag}-before-${i}.png`),again.shot);
                if(noise.pixels&&(within(noise.box,diff.box)||within(diff.box,noise.box))){r.noise=noise;r.noisy=true;}}
            assert.ok(r.noisy,`${tag}: ${diff.pixels} pixels differ in ${JSON.stringify(diff.box)} and the before build is stable there`);}
        results.push(r);console.log('PASS',tag,r.noisy?`(content noise: before differs from itself by ${r.noise.pixels} px; after differs by ${diff.pixels} px; geometry equal)`:'(pixel-identical)');
    }catch(e){results.push({...(r||{tag}),fail:e.message.split('\n')[0]});console.log('FAIL',tag,e.message.split('\n')[0]);}}}
finally{await b.close();}
fs.writeFileSync(path.join(E,'check-r17-identical.json'),JSON.stringify(results,null,1));
const failed=results.filter(r=>r.fail);console.log(failed.length?`FAILED ${failed.length}/${results.length}`:`ALL PASS ${results.length}/${results.length}`);process.exit(failed.length?1:0);})();
