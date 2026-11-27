import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'C:/Users/wayba/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.YAIRPG_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
console.log('Browser launched'); const page=await browser.newPage({viewport:{width:1920,height:1080}}), errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE',e.message);});page.on('response',r=>{if(r.status()>=400)console.log('HTTP',r.status(),r.url());});
let requests=0;page.on('request',r=>{if(r.url().includes('/reading-chapter-coverage/'))requests++;});
page.setDefaultTimeout(15000);console.log('Page created');await page.goto('http://127.0.0.1:4187/#library/outputs/lotm1?chapter=127&pass=rules',{waitUntil:'domcontentloaded',timeout:10000});console.log('Navigated');
await page.getByRole('button',{name:'Check chapter coverage',exact:true}).waitFor();
if(requests)throw Error('Summary requested before click');
console.log('Output page ready'); const results=[];
for(const [chapter,matched,rows] of [[127,87,88],[128,133,134]]){
 await page.locator('input[type=number]').fill(String(chapter));
 await page.getByRole('button',{name:'Check chapter coverage',exact:true}).click();
 const section=page.locator('.chapter-coverage');
 await section.getByRole('status').filter({hasText:matched+' of '+rows+' source rows matched'}).waitFor();
 const api=await page.request.get('http://127.0.0.1:4187/reading-chapter-coverage/lotm1/lotm1c'+chapter);const coverage=await api.json();
 if(coverage.counts.noPublicMatch!==1||coverage.empty!==1||coverage.expected!==12)throw Error('Wrong coverage');
 if(!page.url().includes('pass=rules')||!page.url().includes('coverage=lotm1c'+chapter))throw Error('Lost filters');
 await page.screenshot({path:'docs/representations/evidence/atlas-reader-visual-2026-11-25/chapter-'+chapter+'-coverage-1920.png',fullPage:true});
 results.push({chapter,status:await section.getByRole('status').innerText(),url:page.url(),coverage});
}
await page.reload();await page.locator('.chapter-coverage').getByRole('status').filter({hasText:'133 of 134 source rows matched'}).waitFor();
await page.locator('.chapter-coverage').getByRole('link',{name:'rules · Rules',exact:true}).click();await page.getByRole('link',{name:'Back to reading outputs',exact:true}).waitFor();await page.getByRole('link',{name:'Back to reading outputs',exact:true}).click();await page.locator('.chapter-coverage').getByRole('status').filter({hasText:'133 of 134 source rows matched'}).waitFor();
if(!page.url().includes('pass=rules')||!page.url().includes('chapter=128'))throw Error('Lost return filters');
await page.setViewportSize({width:1366,height:768});await page.screenshot({path:'docs/representations/evidence/atlas-reader-visual-2026-11-25/chapter-128-coverage-1366.png',fullPage:true});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Horizontal overflow');
writeFileSync('docs/representations/evidence/atlas-reader-visual-2026-11-25/chapter-coverage-result.json',JSON.stringify({viewport:{width:1920,height:1080},noRequestBeforeClick:true,secondaryViewport:{width:1366,height:768,horizontalOverflow:false},sharedReload:true,backPreservesFilters:true,results,errors},null,2));if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify({results:results.map(({chapter,status})=>({chapter,status})),requests,errors}));
} catch(error){console.error(error);throw error;} finally {await Promise.race([browser.close(),new Promise(resolve=>setTimeout(resolve,3000))]);}



