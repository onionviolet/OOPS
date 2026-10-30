// RPX1/RPX2 browser proof: the rite-and-brew figure in the Tingen brewing bench, reached from a fresh life through the Village door.
//   npm run build && node docs/representations/evidence/rituals/browser.cjs      (headless Chrome, own static server, fresh origin, 1920x1080)
// Helpers follow docs/gm/dispatch/master-reconciliation-2026-10-25/ritual-browser.cjs; no save is funded or edited.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const out=__dirname,repo=path.resolve(out,'../../../..');
const {launchChrome,advanceGameMinutes}=require(path.join(repo,'scripts/ui_helpers.cjs'));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.map':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]),f=path.join(repo,u==='/'?'index.html':u);
 if(!f.startsWith(repo)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}
 res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
const sel=t=>`#lotm_panel [data-lotm="${t}"]`;
async function click(page,t){await page.waitForFunction(s=>document.querySelector(s),sel(t),{polling:200});assert.equal(await page.evaluate(s=>document.querySelector(s).disabled,sel(t)),false,`${t} is disabled`);await page.evaluate(s=>document.querySelector(s).click(),sel(t));}
const go=async(page,key)=>{await click(page,`lotm.move.${key}`);await advanceGameMinutes(page,36);};
const pick=async(page,id)=>{await page.waitForFunction(()=>document.querySelector('#lotm_panel [data-lotm="bench_select"]'),null,{polling:200});await page.evaluate(id=>{const b=document.querySelector('#lotm_panel [data-lotm-bench]');b.open=true;const s=b.querySelector('select');s.value=id;s.dispatchEvent(new Event('change',{bubbles:true}));},id);await page.waitForTimeout(300);};
const figureOf=(page,suffix)=>page.evaluate(suffix=>{const f=document.querySelector(`#lotm_panel [data-lotm-figure$="-${suffix}"]`);if(!f)return null;const svg=f.querySelector('svg'),r=svg.getBoundingClientRect(),cs=getComputedStyle(f.querySelector('.fig-body'));
 return {id:f.dataset.lotmFigure,desc:svg.querySelector('desc').textContent,width:Math.round(r.width),height:Math.round(r.height),styled:cs.stroke!=='none'&&cs.stroke!=='',
  glow:[...f.querySelectorAll('.fig-fx--glow')].length,legend:[...f.querySelectorAll('.fig-legend-item')].map(n=>n.textContent),pageOverflow:document.documentElement.scrollWidth>innerWidth+1};},suffix);
const ledgerOf=page=>page.evaluate(()=>{const l=document.querySelector('#lotm_panel [data-lotm-ledger]');if(!l)return null;const ps=[...l.querySelectorAll(':scope > p')];
 return {grade:l.dataset.lotmLedger,headline:ps[0]?.textContent,advice:ps[1]?.textContent,rows:[...l.querySelectorAll('.fig-ledger-row')].map(r=>({text:r.querySelector('strong').textContent,meter:r.querySelector('meter')?.value}))};});
const figure=async page=>{const rite=await figureOf(page,'rite');if(!rite)return null;return {...rite,ledger:await ledgerOf(page),making:await figureOf(page,'making')};};
// Label boxes inside each figure; any two that intersect by more than 1 px in both axes count as an overlap.
const labelOverlaps=page=>page.evaluate(()=>{const res={};for(const f of document.querySelectorAll('#lotm_panel [data-lotm-figure]')){
 const boxes=[...f.querySelectorAll('.fig-label')].filter(n=>n.getBoundingClientRect().width>0).map(n=>{const r=n.getBoundingClientRect();return {t:n.textContent.trim().slice(0,40),l:r.left,r:r.right,tp:r.top,b:r.bottom};}),hits=[];
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j],w=Math.min(a.r,b.r)-Math.max(a.l,b.l),h=Math.min(a.b,b.b)-Math.max(a.tp,b.tp);if(w>1&&h>1)hits.push([a.t,b.t,Math.round(w),Math.round(h)]);}
 res[f.dataset.lotmFigure]={labels:boxes.length,overlaps:hits};}
 return {figures:res,pageOverflow:document.documentElement.scrollWidth>innerWidth+1,scrollWidth:document.documentElement.scrollWidth,innerWidth,fontPx:parseFloat(getComputedStyle(document.querySelector('#lotm_panel')).fontSize)};});
async function plainShot(page,name){await page.evaluate(()=>{document.querySelector('#lotm_panel [data-lotm-figure]').scrollIntoView({block:'start'});});await page.waitForTimeout(250);await page.screenshot({path:path.join(out,`${name}.png`)});}
// Settings the real way: open the module, set the control, "Apply and save", and read what main.js mirrored onto <html>.
async function setSetting(page,module,label,value){await page.locator('#workspace_navigation select').first().selectOption(module);await page.waitForTimeout(400);
 const c=page.locator(`[aria-label="${label}"]`).first();await c.waitFor({state:'visible'});const prev=await c.inputValue();
 if(await c.evaluate(n=>n.tagName)==='SELECT')await c.selectOption(value);else{await c.fill(String(value));await c.dispatchEvent('change');}
 await page.getByRole('button',{name:'Apply and save',exact:true}).first().click();await page.waitForTimeout(400);return prev;}
async function backToBench(page,id){await page.locator('#workspace_navigation select').first().selectOption('lotm');await page.waitForFunction(()=>document.querySelector('#lotm_panel [data-lotm-bench]'),null,{polling:200});await pick(page,id);}
async function shot(page,name,effects){await page.evaluate(e=>{document.documentElement.dataset.effects=e;},effects);await page.waitForTimeout(200);
 await page.evaluate(()=>{const f=document.querySelector('#lotm_panel [data-lotm-figure]');f.scrollIntoView({block:'center'});});await page.waitForTimeout(200);
 await page.screenshot({path:path.join(out,`${name}-1920x1080-effects-${effects}.png`)});
 const filter=await page.evaluate(()=>getComputedStyle(document.querySelector('#lotm_panel .fig-fx--glow .fig-body')||document.body).filter);return filter;}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port,url=`http://127.0.0.1:${port}/?test_hooks=1`;
 const bundle=crypto.createHash('sha256').update(fs.readFileSync(path.join(repo,'dist/bundle.js'))).digest('hex').slice(0,16);
 const browser=await launchChrome(),errors=[],log=[],figures={};
 try{const context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.stack||String(e)));
  await page.goto(url);await page.getByText('PLAY',{exact:true}).click();
  await page.waitForFunction(()=>{const d=document.querySelector('[data-lotm-door]');return d&&!d.hidden&&d.isConnected;},null,{polling:250,timeout:60000});
  await page.evaluate(()=>document.querySelector('[data-lotm-door]').click());log.push('fresh life: Village place action "Cross to another world: Tingen" opened the panel (no probe parameter)');
  await click(page,'pick_probationer');await click(page,'enroll');await page.waitForFunction(()=>document.querySelector('#lotm_panel [data-lotm="book.lotm.report_in"]'),null,{polling:250,timeout:30000});
  await click(page,'book.lotm.report_in');log.push('probationer enrolled and reported in');
  await go(page,'docks');await pick(page,'sun_5');figures.absent=await figure(page);assert.ok(figures.absent,'rite figure drawn');assert.match(figures.absent.desc,/\(empty\)/);
  assert.ok(figures.absent.ledger,'risk ledger drawn');assert.match(figures.absent.ledger.advice,/^Fix first:/);
  assert.ok(figures.absent.making,'making figure drawn');assert.match(figures.absent.making.desc,/Formula \(current\)/);assert.match(figures.absent.making.desc,/Materials/);
  assert.equal(figures.absent.styled,true,'figure.css applies in the game');assert.equal(figures.absent.pageOverflow,false);
  log.push(`Sequence 5 formula with a rite: both conditions empty, odds at the centre, ledger beside it, materials track and brew track at Formula; rite ${figures.absent.width}x${figures.absent.height} px`);
  figures.absentFilterFull=await shot(page,'rite-absent','full');
  await click(page,'book.lotm.rit_buy_ice');await go(page,'lodging');await pick(page,'sun_5');figures.substituted=await figure(page);
  assert.match(figures.substituted.desc,/\(strained\)/);assert.match(figures.substituted.desc,/stand-in/);
  assert.ok(figures.substituted.ledger,'ledger exists in the substituted state');assert.match(figures.substituted.ledger.advice,/^Fix first:/,'substituted advice starts "Fix first:"');
  assert.ok(figures.substituted.ledger.rows.length>=1&&figures.substituted.ledger.rows.every(r=>typeof r.meter==='number'),'ledger rows carry a meter');
  assert.match(figures.substituted.making.desc,/Materials/);assert.match(figures.substituted.making.desc,/of 6 held/);
  log.push('bought ordinary ice (2 soli from the fresh purse), walked to the lodging: both conditions are stand-ins (strained), odds note names each; ledger advice starts "Fix first:"; making desc names Materials "of 6 held"');
  figures.subFilterFull=await shot(page,'rite-substituted','full');figures.subFilterOff=await shot(page,'rite-substituted','off');
  const offFig=await figure(page);assert.equal(offFig.desc,figures.substituted.desc,'effects off (attribute) keeps every rite fact');assert.equal(offFig.making.desc,figures.substituted.making.desc);log.push('effects off by attribute: same text form, figures still drawn');
  await page.evaluate(()=>{document.documentElement.dataset.effects='full';});
  // 21 px text at 1920x1080, through Settings > Font size > Apply and save.
  const prevSize=await setSetting(page,'customization','Font size',21);await backToBench(page,'sun_5');await page.waitForTimeout(300);
  figures.font21=await labelOverlaps(page);figures.font21.prevSize=prevSize;assert.equal(figures.font21.fontPx,21,'font size 21 applied');
  await plainShot(page,'rite-substituted-1920x1080-font21');log.push(`21 px text: ${JSON.stringify(figures.font21.figures)}; page overflow ${figures.font21.pageOverflow}`);
  await setSetting(page,'customization','Font size',prevSize||14);
  // Effects off the real way (Settings > Effects > Apply and save), compared with effects full.
  const prevFx=await setSetting(page,'customization-effects','Effects','full');assert.equal(await page.evaluate(()=>document.documentElement.dataset.effects),'full');
  await backToBench(page,'sun_5');const fullFig=await figure(page);await plainShot(page,'rite-substituted-1920x1080-effects-full-setting');
  await setSetting(page,'customization-effects','Effects','off');assert.equal(await page.evaluate(()=>document.documentElement.dataset.effects),'off','main.js mirrors the saved setting');
  await backToBench(page,'sun_5');const realOff=await figure(page);assert.equal(realOff.desc,fullFig.desc,'effects off (setting) keeps rite desc');assert.equal(realOff.making.desc,fullFig.making.desc,'effects off (setting) keeps making desc');
  figures.realOff={riteGlow:realOff.glow,descSame:true,prevEffects:prevFx};await plainShot(page,'rite-substituted-1920x1080-effects-off-setting');
  log.push(`effects off via Settings: <html data-effects> mirrored "off"; rite and making desc identical to effects full (setting before this run: ${prevFx})`);
  await setSetting(page,'customization-effects','Effects',prevFx||'full');
  // Brewing: try earned steps from the starting purse only.
  await go(page,'docks');figures.brewing={reached:false};
  for(const id of ['fool_9','sun_9','visionary_9']){
   await backToBench(page,id);
   const st=await page.evaluate(id=>{const q=t=>document.querySelector(`#lotm_panel [data-lotm="${t}"]`),f=q(`book.lotm.bf_buy_${id}`);
    return {formulaBuy:f?{disabled:f.disabled,title:f.title,text:f.textContent}:null,slots:[...document.querySelectorAll('#lotm_panel [data-lotm-slots] li')].map(li=>({text:li.firstChild.textContent,buy:li.querySelector('button')?{disabled:li.querySelector('button').disabled,title:li.querySelector('button').title,text:li.querySelector('button').textContent}:null}))};},id);
   (figures.brewing.tried??=[]).push({id,...st});
   if(!st.formulaBuy||st.formulaBuy.disabled)continue;
   await click(page,`book.lotm.bf_buy_${id}`);await page.waitForTimeout(300);await backToBench(page,id);
   let stuck=false;
   for(let n=0;n<12&&!stuck;n++){const s2=await page.evaluate(()=>{const li=[...document.querySelectorAll('#lotm_panel [data-lotm-slots] li')].find(li=>li.textContent.startsWith('○')&&li.querySelector('button'));
     return li?{id:li.querySelector('button').dataset.lotm,disabled:li.querySelector('button').disabled,title:li.querySelector('button').title}:null;});
    if(!s2)break;if(s2.disabled){stuck=s2;break;}await click(page,s2.id);await page.waitForTimeout(250);await backToBench(page,id);}
   if(stuck){figures.brewing.tried.at(-1).stuck=stuck;continue;}
   const start=await page.evaluate(id=>{const b=document.querySelector(`#lotm_panel [data-lotm="book.lotm.bf_start_${id}"]`);return b?{disabled:b.disabled,title:b.title}:null;},id);figures.brewing.tried.at(-1).start=start;
   if(!start||start.disabled)continue;
   await click(page,`book.lotm.bf_start_${id}`);await page.waitForTimeout(300);await backToBench(page,id);
   const fig=await figure(page);figures.brewing={...figures.brewing,reached:true,id,making:fig.making,rite:fig.id?fig:null};
   assert.match(fig.making.desc,/Brew/);assert.match(fig.making.desc,/Brew[^\n]*\(current\)/,'Brew step is current');
   await plainShot(page,'brewing-1920x1080-full');log.push(`brewing reached with ${id}: making figure shows Brew current`);break;}
  if(!figures.brewing.reached)log.push('brewing NOT reached: the starting purse or place did not allow formula, materials and start (see figures.brewing.tried)');
  const r={bundle,port,viewport:'1920x1080',route:'fresh life, Village door, earned steps; no save edits',errors,log,figures};fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(r,null,1));console.log(JSON.stringify(r,null,1));if(errors.length)process.exitCode=1;
 }catch(e){console.error(e);console.log(JSON.stringify({log,errors},null,1));process.exitCode=1;}finally{await browser.close().catch(()=>{});server.close();}
})();
