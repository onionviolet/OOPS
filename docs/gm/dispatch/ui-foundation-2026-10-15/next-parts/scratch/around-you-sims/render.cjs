const { chromium } = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const out = [];
  try {
    for (const [width, height, size] of [[1366,768,14],[1366,768,21],[1920,1080,21]]) {
      for (const style of ['scene','graph','atlas']) {
        const page = await browser.newPage({ viewport: {width,height} });
        const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
        await page.goto('file://' + path.join(__dirname,'index.html') + `?style=${style}&size=${size}`);
        await page.screenshot({path:path.join(__dirname,`${style}-${width}-${size}.png`)});
        const geometry=await page.evaluate(()=>{
          const log=document.querySelector('.reports').getBoundingClientRect();
          const map=document.querySelector('#map').getBoundingClientRect();
          const nodes=[...document.querySelectorAll('.node')].map(n=>{const r=n.getBoundingClientRect();return {text:n.textContent,insideMap:r.left>=map.left&&r.right<=map.right&&r.top>=map.top&&r.bottom<=map.bottom,fitText:n.scrollWidth<=n.clientWidth};});
          return {horizontalOverflow:document.documentElement.scrollWidth>innerWidth,logWidth:log.width,logHeight:log.height,nodes};
        });
        out.push({style,width,height,size,errors,...geometry});
        await page.close();
      }
    }
    fs.writeFileSync(path.join(__dirname,'mockup-checks.json'),JSON.stringify(out,null,2)+'\n');
    console.log(JSON.stringify(out.map(x=>({style:x.style,width:x.width,size:x.size,overflow:x.horizontalOverflow,logWidth:x.logWidth,nodesFit:x.nodes.every(n=>n.insideMap&&n.fitText),errors:x.errors}))));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
