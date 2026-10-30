// Gallery proof for the named fixture time-return-digest: npm run build:figures && node docs/representations/evidence/time/gallery.cjs
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=__dirname,repo=path.resolve(out,'../../../..');
const {launchChrome}=require(path.join(repo,'scripts/ui_helpers.cjs'));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.map':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]),f=path.join(repo,u);
 if(!f.startsWith(repo)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}
 res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await launchChrome(),errors=[];
 try{const page=await (await browser.newContext({viewport:{width:1920,height:1080}})).newPage();page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${server.address().port}/figure-gallery.html`);const s=page.locator('[data-fixture="time-return-digest"]');await s.waitFor();
  await s.scrollIntoViewIfNeeded();await page.waitForTimeout(300);await page.screenshot({path:path.join(out,'gallery-return-digest-1920x1080.png')});
  const text=await s.innerText();assert.match(text,/Mara Venn/);assert.match(text,/ferry left without you/);
  fs.writeFileSync(path.join(out,'gallery-result.json'),JSON.stringify({fixture:'time-return-digest',viewport:'1920x1080',errors,textForm:text.slice(0,2000)},null,1));console.log('gallery ok',errors);
 }finally{await browser.close();server.close();}})();
