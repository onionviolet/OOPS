// Gallery evidence for the RPX1/RPX2 fixtures: 1920x1080, effects full and off, both themes, with effect assertions.
//   npm run build:figures && node docs/representations/evidence/rituals/gallery.cjs
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=__dirname,repo=path.resolve(out,'../../../..');
const {launchChrome}=require(path.join(repo,'scripts/ui_helpers.cjs'));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.png':'image/png'};
const server=http.createServer((req,res)=>{const f=path.join(repo,decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(repo)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await launchChrome(),errors=[],result={};
 try{for(const fx of ['full','off']){const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>errors.push(e.message));
  await p.goto(`http://127.0.0.1:${server.address().port}/figure-gallery.html?effects=${fx}`);await p.waitForSelector('[data-fixture="bench-bell_5-rite"]');
  const r=await p.evaluate(()=>{const glow=document.querySelector('[data-fixture="bench-bell_5_brewing-rite"] .fig-fx--glow .fig-body'),halo=document.querySelector('[data-fixture="bench-bell_5_brewing-making"] .fig-fx--pulse > .fig-halo');
   return {fixtures:[...document.querySelectorAll('[data-fixture]')].map(n=>n.dataset.fixture),glowFilter:getComputedStyle(glow).filter,pulseAnimation:getComputedStyle(halo).animationName,
    text:[...document.querySelectorAll('[data-fixture^="bench-"] .fig-svg desc')].map(d=>d.textContent).join('\n')};});
  if(fx==='full'){assert.notEqual(r.glowFilter,'none','met conditions glow with effects full');assert.equal(r.pulseAnimation,'fig-pulse','a running brew step pulses with effects full');}
  else{assert.equal(r.glowFilter,'none','no glow with effects off');assert.equal(r.pulseAnimation,'none','no pulse with effects off');assert.equal(r.text,result.full.text,'effects off keeps every fact');}
  result[fx]=r;await p.locator('[data-fixture="bench-bell_5-rite"]').first().scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,`gallery-rite-preparing-1920x1080-effects-${fx}.png`)});
  await p.locator('[data-fixture="bench-bell_5_brewing-rite"]').first().scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,`gallery-rite-brewing-1920x1080-effects-${fx}.png`)});await p.close();}
  const summary={errors,fixtures:result.full.fixtures,full:{glowFilter:result.full.glowFilter,pulseAnimation:result.full.pulseAnimation},off:{glowFilter:result.off.glowFilter,pulseAnimation:result.off.pulseAnimation},textIdentical:true};
  fs.writeFileSync(path.join(out,'gallery-result.json'),JSON.stringify(summary,null,1));console.log(JSON.stringify(summary));if(errors.length)process.exitCode=1;
 }catch(e){console.error(e);process.exitCode=1;}finally{await b.close();server.close();}})();
