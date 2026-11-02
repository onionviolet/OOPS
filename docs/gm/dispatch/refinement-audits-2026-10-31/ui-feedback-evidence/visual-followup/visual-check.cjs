// Headless isolated audit of gallery fixtures and native Village surfaces. No player saves.
const fs=require('node:fs'),path=require('node:path'),net=require('node:net'),{spawn}=require('node:child_process'),assert=require('node:assert/strict');
const [root,out]=process.argv.slice(2),{launchChrome}=require(path.join(root,'scripts/ui_helpers.cjs'));
const portOf=()=>new Promise((r,j)=>{let s=net.createServer();s.listen(0,'127.0.0.1',()=>{let p=s.address().port;s.close(()=>r(p));});s.on('error',j);});
(async()=>{const port=await portOf(),srv=spawn('python3',['-u','-m','http.server',String(port),'--bind','127.0.0.1','--directory',path.join(root,'out')],{stdio:'ignore'}),result={viewport:'1920x1080',gallery:[],game:[],errors:[]};let browser;
 try{browser=await launchChrome();for(const size of [14,21]){
  const c=await browser.newContext({viewport:{width:1920,height:1080}}),p=await c.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>result.errors.push({size,where:'gallery',message:e.message}));
  await p.goto(`http://127.0.0.1:${port}/figure-gallery.html?only=relationship-web-ferry&size=${size}&effects=off`);await p.locator('[data-fixture="ladders-several"] [data-ladder-source="cheat"] svg').waitFor();
  const sec=p.locator('[data-fixture="ladders-several"]');await sec.screenshot({path:path.join(out,`gallery-ladders-${size}.png`)});
  const pair=await p.locator('[data-fixture="relationship-web-ferry"] .fig-gallery-cell').first();await pair.screenshot({path:path.join(out,`gallery-people-web-${size}.png`)});
  const info=await p.evaluate(()=>{const root=document.querySelector('[data-fixture="ladders-several"] [data-ladder-source="cheat"]');const labels=[...root.querySelectorAll('.fig-track .fig-step .fig-label')].map((n,i)=>{const b=n.getBoundingClientRect();return {i,text:n.textContent.trim().replace(/\s+/g,' ').slice(0,70),x:b.x,y:b.y,w:b.width,h:b.height,font:getComputedStyle(n).fontSize};});const collisions=[];for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){const a=labels[i],b=labels[j];const w=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),h=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);if(w>2&&h>2)collisions.push([a.i,b.i,Math.round(w),Math.round(h)]);}const sec=document.querySelector('[data-fixture="ladders-several"]');return {labelCount:labels.length,labels,collisions,sectionWidth:sec.getBoundingClientRect().width,sectionHeight:sec.getBoundingClientRect().height,figFont:getComputedStyle(root.querySelector('.fig-label')).fontSize,figWidth:root.querySelector('svg').getBoundingClientRect().width};});
  result.gallery.push({requestedSize:size,...info});await c.close();
  const game=await browser.newContext({viewport:{width:1920,height:1080}}),g=await game.newPage(),entry={size};result.game.push(entry);g.setDefaultTimeout(15000);g.on('pageerror',e=>result.errors.push({size,where:'game',message:e.message}));
  await g.goto(`http://127.0.0.1:${port}/`);await g.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await g.locator('#loading_screen_play_button').click();if(await g.getByText('Confirm',{exact:true}).isVisible().catch(()=>false))await g.getByText('Confirm',{exact:true}).click();
  if(size===21){await g.locator('#workspace_navigation select').first().selectOption('customization');await g.locator('[aria-label="Font size"]').fill('21');await g.locator('[aria-label="Font size"]').dispatchEvent('change');await g.getByRole('button',{name:'Apply and save',exact:true}).first().click();await g.locator('#workspace_navigation select').first().selectOption('local-actions');}
  await g.locator('#workspace_navigation select').first().selectOption('rune-bench');await g.locator('#rune_bench_panel').waitFor({state:'visible'});
  entry.runeFont=await g.locator('#rune_bench_panel').evaluate(n=>getComputedStyle(n).fontSize);await g.locator('#rune_bench_panel [data-rune="ember"]').click();await g.locator('#rune_bench_panel [data-rune="gale"]').click();
  entry.runePreview=await g.locator('[data-rune-preview]').innerText();entry.runeText=(await g.locator('#rune_bench_panel').innerText()).slice(0,1600);await g.screenshot({path:path.join(out,`game-rune-${size}.png`)});
  await g.keyboard.press('Escape');await g.locator('[data-inspect-nearby="villageElder"]').click();await g.locator('[data-focus-action="talk:villageElder"]').click();await g.locator('#talk_view_host button[data-topic-id="hello"]').click();await g.keyboard.press('Escape');
  await g.locator('[data-route-id="known-people"]').first().click();await g.locator('#known_people_panel').waitFor({state:'visible'});
  const web=g.locator('#known_people_panel > #relationship_web');if(!await web.evaluate(n=>n.open))await web.locator(':scope > summary').click();
  entry.peopleButtons=await web.locator('.fig-form-choice').allTextContents();entry.peopleDefault=await web.locator('.fig-form-choice[aria-pressed="true"]').textContent();entry.peopleFigureWidth=await web.locator('svg.fig-svg').first().evaluate(n=>n.getBoundingClientRect().width);
  await web.scrollIntoViewIfNeeded();await g.screenshot({path:path.join(out,`game-people-figure-${size}.png`)});
  await web.locator('.fig-form-choice[data-form="table"]').click();entry.tableRows=await web.locator('table.fig-table tbody tr').count();await g.screenshot({path:path.join(out,`game-people-table-${size}.png`)});
  entry.pageHeight=await g.evaluate(()=>document.documentElement.scrollHeight);await game.close();
 }
 assert.deepEqual(result.errors,[]);
 }catch(e){result.failure={message:e.message,stack:e.stack};process.exitCode=1;}
 finally{if(browser)await browser.close().catch(()=>{});srv.kill();fs.writeFileSync(path.join(out,'visual-result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));}
})();
