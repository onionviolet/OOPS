// COV15 gallery proof: the four bridge-fed fixtures (src/ui/preview/fixtures/bridges.js) at 1920x1080, headless.
//   npm run build:figures && node docs/representations/evidence/cov15/gallery.cjs
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=__dirname,repo=path.resolve(out,'../../../..');
const {launchChrome}=require(path.join(repo,'scripts/ui_helpers.cjs'));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.png':'image/png'};
const server=http.createServer((req,res)=>{const f=path.join(repo,decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(repo)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
const ids=['bench-lantern_5-rite','fx-chase-range','fx-chase-unseen','fx-study-bridge-ladder','fx-study-bridge-map','fx-place-history'];
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await launchChrome(),errors=[],result={};
 try{const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>errors.push(e.message));
  await p.goto(`http://127.0.0.1:${server.address().port}/figure-gallery.html`);await p.waitForSelector('[data-fixture="fx-place-history"]',{timeout:60000});
  for(const id of ids){const el=p.locator(`[data-fixture="${id}"]`).first();await el.scrollIntoViewIfNeeded();
   result[id]=await p.evaluate(id=>({desc:document.querySelector(`[data-fixture="${id}"] svg desc`)?.textContent??null}),id);assert.ok(result[id].desc,`${id} drew`);
   await el.screenshot({path:path.join(out,`gallery-${id}.png`)});}
  fs.writeFileSync(path.join(out,'gallery-result.json'),JSON.stringify({errors,result},null,1));console.log(JSON.stringify({errors,ids:Object.keys(result)}));if(errors.length)process.exitCode=1;
 }catch(e){console.error(e);process.exitCode=1;}finally{await b.close();server.close();}})();
