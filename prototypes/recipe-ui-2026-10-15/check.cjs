const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
let activeBrowser;
const out=path.join(__dirname,'evidence');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=activeBrowser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce'});
 const p=await context.newPage(),errors=[],checks=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:19218');await p.getByRole('button',{name:'Full recipe ›'}).waitFor();
 const pause=()=>p.locator('#pause-work').evaluate(n=>{if(n.textContent==='Pause routine')n.click();});
 await pause();
 for(const variant of ['compact','adjacent']){
  await p.locator('#variant').selectOption(variant);
  for(const size of ['14','17.5','21']){
   await p.locator('#text-size').selectOption(size);await p.locator('#reset').click();
   const geometry=await p.evaluate(()=>{const rect=n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom,right:r.right}};const craft=document.querySelector('.actions button.primary,[data-craft-commit]');return{page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],font:getComputedStyle(document.querySelector('.recipe-row')).fontSize,craft:rect(craft),work:rect(document.querySelector('#work-progress')),player:rect(document.querySelector('.player')),regions:[...document.querySelectorAll('.region')].map(rect)};});
   assert.deepEqual(geometry.page,[1366,768]);assert.equal(parseFloat(geometry.font),Number(size));
   assert(geometry.craft.bottom<748&&geometry.craft.right<=958,'craft visible');
   assert(geometry.work.bottom<=geometry.player.bottom,'current work visible');
   if(variant==='compact')assert(await p.locator('.result-effects').evaluate(n=>n.getBoundingClientRect().bottom<=n.parentElement.getBoundingClientRect().bottom),'known result effects visible before cooking');
   await p.screenshot({path:path.join(out,`${variant}-${size}.png`)});
   checks.push({name:`${variant} at ${size}px`,geometry});
  }
  await p.locator('#text-size').selectOption('14');
  for(const [scenario,text]of [['short','Missing 1 Rat meat chunks'],['station','No cooking station'],['reserved','reserved']]){
   await p.locator('#scenario').selectOption(scenario);
   const before=await p.locator('#stock').innerText();
   await p.getByRole('button',{name:'Cook 1',exact:true}).focus();await p.keyboard.press('Enter');
   assert.equal(await p.locator('#stock').innerText(),before);
   assert((await p.locator('#task').innerText()).toLowerCase().includes(text.toLowerCase()));
   checks.push({name:`${variant} ${scenario}: no spending`});
  }
  await p.locator('#scenario').selectOption('ready');
  const row=p.locator('.recipe-row').filter({hasText:'Roasted purified rat meat'});
  await row.click();const before=await p.locator('#stock').innerText();await row.focus();
  assert.equal(await p.locator('#stock').innerText(),before,'selection does not craft');
  await p.getByRole('button',{name:'Cook 1',exact:true}).click();
  const stock=await p.locator('#stock').innerText();assert.match(stock,/Rat meat chunks\s+4/);assert.match(stock,/Belmart leaf\s+1/);assert.match(stock,/Roasted purified rat meat\s+1/);
  checks.push({name:`${variant} explicit simulated craft applies exact recipe costs`});
 }
 await p.locator('#variant').selectOption('compact');await p.locator('#scenario').selectOption('ready');
 await p.getByRole('textbox',{name:'Find known recipe'}).fill('purified');
 await p.locator('.recipe-row').click();await p.getByRole('button',{name:'Cook 1',exact:true}).click();
 const switchStock=await p.locator('#stock').innerText();
 await p.locator('#variant').selectOption('adjacent');
 assert.equal(await p.locator('#stock').innerText(),switchStock);assert.equal(await p.getByRole('textbox',{name:'Find known recipe'}).inputValue(),'purified');
 assert.equal(await p.locator('.recipe-row[aria-pressed=true] > span').innerText(),'Roasted purified rat meat');
 await p.locator('#variant').selectOption('compact');await p.locator('#reset').click();
 for(let i=0;i<3;i++)await p.getByRole('button',{name:'Cook 1',exact:true}).click();
 const depleted=await p.locator('#stock').innerText();await p.getByRole('button',{name:'Cook 1',exact:true}).focus();await p.keyboard.press('Enter');assert.equal(await p.locator('#stock').innerText(),depleted);
 checks.push({name:'Layout toggle preserves selected recipe/filter/stock; depletion revalidates every attempt without overspending'});
 await p.locator('#reset').click();
 await p.getByRole('textbox',{name:'Find known recipe'}).fill('rat');
 await p.getByRole('button',{name:'Full recipe ›'}).click();
 await p.getByRole('button',{name:'Rat meat chunks',exact:true}).click();
 await p.getByRole('button',{name:'Roasted purified rat meat',exact:true}).click();
 assert.match(await p.locator('#task').innerText(),/Belmart leaf/);
 await p.keyboard.press('Escape');assert.equal(await p.locator('#task-title').innerText(),'Reference');
 await p.keyboard.press('Escape');assert.match(await p.locator('#task').innerText(),/Slight food poisoning/);
 await p.keyboard.press('Escape');assert.equal(await p.getByRole('textbox',{name:'Find known recipe'}).inputValue(),'rat');
 assert.equal(await p.evaluate(()=>document.activeElement.textContent),'Full recipe ›');
 checks.push({name:'Ingredient → reverse use → recipe → three Back/Esc steps restore original recipe, query and focus'});
 await p.locator('#scenario').selectOption('knowledge');
 assert.equal(await p.locator('.recipe-row').count(),1);
 assert(!(await p.locator('#board').innerText()).includes('Roasted purified rat meat'));
 assert(!(await p.locator('#board').innerText()).includes('Rat meat chunks'));
 await p.getByRole('button',{name:'Full recipe ›'}).click();
 assert(!(await p.locator('#task').innerText()).includes('Rat meat chunks'));
 checks.push({name:'Limited-knowledge projection removes unknown recipe, inventory name and ingredient links'});
 await p.locator('#scenario').selectOption('ready');
 await p.getByRole('button',{name:'Cook 1',exact:true}).click();
 await p.getByRole('button',{name:'Inspect recorded attempt'}).click();
 const event=await p.locator('#task').innerText();
 await p.getByRole('button',{name:'Resume routine',exact:true}).click();
 await p.waitForFunction(()=>Number(document.querySelector('#work-progress').textContent.split(' ')[0])>=2);
 assert.equal(await p.locator('#task').innerText(),event,'historical event stable during work');
 await pause();checks.push({name:'Reference/event inspection leaves simulated work running and event snapshot unchanged'});
 await p.keyboard.press('Escape');await p.getByRole('button',{name:'Full recipe ›'}).click();
 for(const size of ['14','21']){await p.locator('#text-size').selectOption(size);assert.equal(await p.locator('#back').isVisible(),true);await p.screenshot({path:path.join(out,`full-${size}.png`)});}
 // Populate a long live stream without exposing a test mutation API.
 await p.evaluate(()=>{const log=document.querySelector('#log');for(let i=0;i<50;i++){const n=document.createElement('div');n.className='entry';n.textContent='Fixture history '+i;log.append(n);}log.scrollTop=0;});
 await p.getByRole('button',{name:'Resume routine',exact:true}).click();
 await p.waitForFunction(()=>document.querySelector('#unread').textContent.includes('unread'),null,{timeout:7000});
 assert.equal(await p.locator('#log').evaluate(n=>n.scrollTop),0);await pause();
 checks.push({name:'Scrolled report stream holds position and indicates unread activity'});
 await p.setViewportSize({width:1920,height:1080});
 await p.screenshot({path:path.join(out,'full-wide-150.png')});
 assert.deepEqual(await p.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.scrollHeight]),[1920,1080]);
 assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage)),[],'no save or preferences accessed');
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({passed:checks.length,checks,errors},null,2));
 console.log(`${checks.length} browser checks passed; no page errors; no localStorage keys.`);
 await context.close();await browser.close();
})().catch(async e=>{console.error(e);await activeBrowser?.close();process.exitCode=1;});
