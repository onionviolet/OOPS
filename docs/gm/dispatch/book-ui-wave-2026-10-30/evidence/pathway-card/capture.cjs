const {launchChrome} = require('/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/pathway-card-ladder-051efb/scripts/ui_helpers.cjs');
const OUT = process.argv[2]; require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser = await launchChrome(); const log=[];
 for (const [name, qs] of [['seer-0','state=0'],['seer-1','state=1'],['seer-2','state=2'],['realm','state=realm'],['seer-2-art','state=2&art=1']]) for (const size of [14,21]) {
  const ctx = await browser.newContext({viewport:{width:1920,height:1080}}); const page = await ctx.newPage(); const errs=[]; page.on('pageerror',e=>errs.push(e.message)); page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await page.goto(`http://127.0.0.1:18772/index.html?${qs}&size=${size}`); await page.waitForFunction('window.__ready===true',null,{timeout:15000}).catch(()=>errs.push('not ready'));
  await page.waitForTimeout(500);
  const info = await page.evaluate(()=>({w:document.documentElement.scrollWidth, h:document.documentElement.scrollHeight, imgs:[...document.images].map(i=>i.naturalWidth), glyph:document.querySelectorAll('.pwc-glyph').length, lines:document.querySelectorAll('.pwc-line').length, states:[...document.querySelectorAll('.pwc-line')].map(l=>l.dataset.reqState).join(',')}));
  log.push(`${name} @${size}px: ${JSON.stringify(info)} errors=${JSON.stringify(errs)}`);
  await page.screenshot({path:`${OUT}/pathway-card-${name}-${size}.png`, fullPage:true});
  await ctx.close();
 }
 console.log(log.join('\n')); await browser.close();
})();
