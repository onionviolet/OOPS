// Token migration evidence at 1920x1080 (docs/representations/evidence/tokens): the figure gallery's style guide and the
// character sheet section, headless. Usage: npm run build:figures && node scripts/token_style_guide_browser.cjs
const root=require('node:path').resolve(__dirname,'..');
const {launchChrome}=require('./ui_helpers.cjs');
const {spawn}=require('node:child_process'),fs=require('node:fs');
const out=process.env.YAIRPG_PROOF_DIR||root+'/docs/representations/evidence/tokens';fs.mkdirSync(out,{recursive:true});
const port=Number(process.env.YAIRPG_PROOF_PORT)||18541,server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
(async()=>{await new Promise(r=>setTimeout(r,800));const browser=await launchChrome(),errors=[];try{
 const page=await (await browser.newContext({viewport:{width:1920,height:1080}})).newPage();page.setDefaultTimeout(15000);
 page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto(`http://localhost:${port}/figure-gallery.html`);await page.waitForSelector('[data-fixture="style-guide"]');await page.waitForSelector('[data-fixture="character-sheet"]');
 const guide=page.locator('[data-fixture="style-guide"]');
 await guide.screenshot({path:`${out}/style-guide-1920.png`});
 await page.locator('[data-fixture="character-sheet"]').screenshot({path:`${out}/character-sheet-1920.png`});
 const sections=await guide.locator('h3').allTextContents();
 const literals=await page.evaluate(()=>[...document.querySelectorAll('[data-fixture="style-guide"] *')].filter(n=>n.getBoundingClientRect().width>document.documentElement.clientWidth).length);
 console.log(JSON.stringify({sections,overflowing:literals,errors}));
 if(errors.length)process.exitCode=1;
}finally{await browser.close();server.kill();}})();
