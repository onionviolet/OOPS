// Bounded rerun after correcting the font-test setup. Gameplay source stays frozen.
const {server,fixture,dir,sha,captureMatrix}=require('./browser.cjs');const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{await new Promise(r=>server.listen(5111,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const r=JSON.parse(fs.readFileSync(dir+'/result.json'));assert.equal(sha(fs.readFileSync('dist/bundle.js')),r.bundleSha256);
 const input=fs.readFileSync('/tmp/lotm-e1-after-exam.json','utf8'),s=JSON.parse(input);assert.equal(s.expansion.actors.player.facts['book.lotm.sv.examined'],true);
 const f=await fixture(browser),encoded='YAIR-UTF8-1:'+Buffer.from(input,'utf8').toString('base64');await f.importLiteral(encoded);await f.click('book.lotm.ingest_archaeologist');
 assert.match(await f.p.locator('#lotm_panel').innerText(),/Sequence 8 · Archaeologist/);r.matrix=await captureMatrix(f);
 r.matrixInput={path:'/tmp/lotm-e1-after-exam.json',sha256:sha(input),provenance:'native post-exam snapshot from the passing fresh-origin journey on this same bundle, literal Import then native promotion'};
 assert.deepEqual(f.errors,[]);fs.writeFileSync(dir+'/result.json',JSON.stringify(r,null,2)+'\n');console.log('font matrix PASS',JSON.stringify(r.matrix.map(x=>({width:x.width,height:x.height,requested:x.px,panel:x.actualFont,paragraph:x.paragraphFont}))));
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
