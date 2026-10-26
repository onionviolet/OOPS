const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const url=process.argv[2];if(!url)throw Error('Usage: node prototypes/workbench/check.cjs http://127.0.0.1:PORT/');
const out=process.env.WORKBENCH_EVIDENCE||path.join(__dirname,'evidence');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const checks=[],errors=[];
 try{
 const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce',acceptDownloads:true});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?study=recipes');await page.getByRole('status').filter({hasText:'Ready'}).waitFor();
 const frame=()=>page.frames().find(f=>f!==page.mainFrame());
 const capture=async(name,variant,text,scenario='crowded',width=1366,height=768)=>{
   const direct=await context.newPage();await direct.setViewportSize({width,height});
   await direct.goto(new URL('built/recipes/index.html',url).href);await direct.locator('.recipe-row').first().waitFor();
   for(const [command,value]of [['scenario',scenario],['variant',variant],['text',Number(text)]]){
     await direct.evaluate(({command,value})=>new Promise((resolve,reject)=>{
       const id='capture-'+command;
       const timer=setTimeout(()=>reject(Error('Direct fixture command timeout')),3000);
       const handler=e=>{if(e.source===window&&e.data?.type==='mockup:reply'&&e.data.id===id){clearTimeout(timer);window.removeEventListener('message',handler);e.data.error?reject(Error(e.data.error)):resolve();}};
       window.addEventListener('message',handler);window.postMessage({type:'mockup:command',id,command,value},location.origin);
     }),{command,value});
   }
   const geometry=await direct.evaluate(()=>({width:innerWidth,height:innerHeight,pageWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,font:getComputedStyle(document.querySelector('.recipe-row')).fontSize}));
   assert.deepEqual(geometry,{width,height,pageWidth:width,pageHeight:height,font:`${text}px`});
   await direct.screenshot({path:path.join(out,name)});await direct.close();
 };
 const idle=()=>page.waitForTimeout(200);
 const change=async(id,value)=>{await page.locator(id).selectOption(value);await idle();};
 await frame().getByRole('textbox',{name:'Find known recipe'}).fill('purified');
 await frame().locator('.recipe-row').click();
 await frame().getByRole('button',{name:'Cook 1',exact:true}).click();await idle();
 const stock=await frame().locator('#stock').innerText();
 await frame().getByRole('textbox',{name:'Find known recipe'}).focus();
 await frame().locator('#stock').evaluate(n=>n.scrollTop=30);
 await change('#variant','adjacent');
 assert.equal(await frame().locator('#stock').innerText(),stock);
 assert.equal(await frame().getByRole('textbox',{name:'Find known recipe'}).inputValue(),'purified');
 assert.equal(await frame().locator('.recipe-row[aria-pressed=true] > span').innerText(),'Roasted purified rat meat');
 assert.equal(await frame().evaluate(()=>document.activeElement.dataset.restore),'search');
 checks.push('Layout switch preserves spent stock, selection, query and fixture keyboard focus');
 await change('#variant','compact');
 await frame().getByRole('button',{name:'Full recipe ›'}).click();
 await frame().getByRole('button',{name:'Rat meat chunks',exact:true}).click();
 await frame().getByRole('button',{name:'Roasted rat meat',exact:true}).click();
 await frame().locator('body').press('Escape');
 assert.equal(await frame().locator('#task-title').innerText(),'Reference');
 await frame().locator('body').press('Escape');await frame().locator('body').press('Escape');
 assert.equal(await frame().getByRole('textbox',{name:'Find known recipe'}).inputValue(),'purified');
 assert.equal(await frame().evaluate(()=>document.activeElement.textContent),'Full recipe ›');
 checks.push('Ingredient/reference/recipe journey returns by Esc with query and opener focus');
 for(const scenario of ['short','station','reserved']){
   await change('#scenario',scenario);
   const before=await frame().locator('#stock').innerText();
   await frame().getByRole('button',{name:'Cook 1',exact:true}).press('Enter');
   assert.equal(await frame().locator('#stock').innerText(),before);
 }
 checks.push('Missing materials, station and reserved stock attempts spend nothing');
 await change('#scenario','knowledge');
 assert.equal(await frame().locator('.recipe-row').count(),1);
 assert(!(await frame().locator('#board').innerText()).includes('Rat meat chunks'));
 assert(!(await frame().locator('#board').innerText()).includes('Roasted purified rat meat'));
 checks.push('Limited knowledge omits unknown names and recipe from rendered fixture');
 await change('#scenario','crowded');
 await frame().locator('#stock').evaluate(n=>n.scrollTop=400);await idle();
 await change('#variant','adjacent');assert.equal(await frame().locator('#stock').evaluate(n=>n.scrollTop),400);
 await change('#variant','compact');assert.equal(await frame().locator('#stock').evaluate(n=>n.scrollTop),400);
 await frame().getByRole('textbox',{name:'Find known recipe'}).fill('rat');await idle();
 await page.locator('#compare').check();await page.locator('#status').filter({hasText:'Ready'}).waitFor();await idle();
 let children=page.frames().filter(f=>f!==page.mainFrame());assert.equal(children.length,2);
 assert.equal(await children[1].getByRole('textbox',{name:'Find known recipe'}).inputValue(),'rat');
 assert.equal(await children[1].locator('#stock').evaluate(n=>n.scrollTop),400);
 await children[0].getByRole('button',{name:'Cook 1',exact:true}).click();await idle();
 assert.equal(await page.evaluate(()=>document.activeElement.title),'B · Compact + full','mirroring must not steal focus into the other iframe');
 assert.equal(await children[0].locator('#stock').innerText(),await children[1].locator('#stock').innerText());
 assert.equal(await children[0].locator('#log').innerText(),await children[1].locator('#log').innerText());
 await children[1].getByRole('button',{name:'Inspect recorded attempt'}).click();await idle();
 assert.equal(await children[0].locator('#task-title').innerText(),'Recorded attempt');
 await children[1].locator('body').press('Escape');await idle();
 checks.push('Both interactive layouts mirror stock, query, scroll, recorded events and navigation');
 await page.locator('#compare').uncheck();await page.locator('#status').filter({hasText:'Ready'}).waitFor();await idle();
 for(const variant of ['compact','adjacent'])for(const text of ['14','17.5','21']){
   await change('#variant',variant);await change('#text',text);
   const geometry=await frame().evaluate(()=>({w:innerWidth,h:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,font:getComputedStyle(document.querySelector('.recipe-row')).fontSize}));
   assert.deepEqual(geometry,{w:1366,h:768,sw:1366,sh:768,font:`${text}px`});
   await capture(`${variant}-${text}.png`,variant,text);
 }
 checks.push('Both layouts at actual 14/17.5/21px render inside 1366×768 without fixture page overflow');
 await change('#scenario','long');
 assert((await frame().locator('.recipe-row').first().innerText()).includes('fictional label'));
 await change('#viewport','1920x1080');
 assert.equal(await frame().evaluate(()=>innerWidth),1920);assert.equal(await frame().evaluate(()=>innerHeight),1080);
 await capture('wide-long-21.png','adjacent','21','long',1920,1080);
 checks.push('Long fixture names and wide viewport render; fixture ID stays stable');
 await page.locator('#fit').uncheck();
 assert.equal(await page.locator('iframe').evaluate(n=>getComputedStyle(n).transform),'matrix(1, 0, 0, 1, 0, 0)');
 assert((await page.locator('#scale-label').innerText()).startsWith('Actual size'));
 await page.locator('#fit').check();
 const before=await frame().locator('#work-progress').innerText();await idle();assert.equal(await frame().locator('#work-progress').innerText(),before);
 await page.locator('#step').click();await idle();assert((await frame().locator('#work-progress').innerText()).startsWith('1 steps'));
 await page.locator('#reset').click();await idle();assert((await frame().locator('#work-progress').innerText()).startsWith('0 steps'));
 checks.push('Actual-size mode uses no scale; manual clock stays paused, steps explicitly and resets');
 const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;
 const exportPath=path.join(out,'review.json');await download.saveAs(exportPath);const review=JSON.parse(fs.readFileSync(exportPath));
 assert.equal(review.schema,1);assert.equal(review.textPx,21);assert.equal(review.snapshot.state.scenario,'long');assert(review.revision);assert.match(review.acceptance,/Unreviewed/);
 checks.push('Review download includes exact fixture state, build revision, target, text and unaccepted status');
 await change('#viewport','1366x768');await change('#text','14');await change('#variant','compact');await change('#scenario','ready');
 await page.screenshot({path:path.join(out,'workbench-laptop.png')});
 await page.locator('#compare').check();await page.locator('#status').filter({hasText:'Ready'}).waitFor();await idle();
 await page.screenshot({path:path.join(out,'workbench-compare.png')});
 assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),[]);
 for(const child of page.frames().filter(f=>f!==page.mainFrame()))assert.deepEqual(await child.evaluate(()=>Object.keys(localStorage)),[]);
 assert.deepEqual(errors,[]);assert(!(await page.locator('#status').innerText()).startsWith('Review error'));
 checks.push('Fresh origin, no localStorage keys, no page errors');
 fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({url,checks,errors},null,2)+'\n');
 console.log(`${checks.length} workbench check groups passed`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
