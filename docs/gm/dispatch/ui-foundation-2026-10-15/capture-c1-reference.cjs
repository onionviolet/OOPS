const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage();
 const response=await page.goto('http://127.0.0.1:19117/proto23.html');const hash=createHash('sha256').update(await response.body()).digest('hex');
 await page.getByText('"..."',{exact:true}).waitFor({state:'visible'});
 for(let i=0;i<4;i++){await page.locator('#ctrm_2 .chs').first().click();await page.waitForTimeout(120);}
 await page.getByText('"Normal"',{exact:true}).click();await page.getByText('You',{exact:true}).waitFor({state:'visible'});await page.waitForFunction(()=>[...document.querySelectorAll('#d1,#inv,#gmsgs')].every(n=>Number(getComputedStyle(n).opacity)>=.999));await page.waitForTimeout(400);
 const output=path.join(__dirname,'evidence/c1-proto23-reference-1366.png');await page.screenshot({path:output});
 fs.writeFileSync(path.join(__dirname,'evidence/c1-reference.json'),JSON.stringify({url:page.url(),viewport:{width:1366,height:768},sourceSha256:hash,difficulty:'Normal',route:'Fresh disposable context; four introduction choices, then visible Normal difficulty control.',savedScreenshot:'c1-proto23-reference-1366.png',reveal:await page.locator('#d1,#inv,#gmsgs').evaluateAll(ns=>ns.map(n=>({id:n.id,opacity:getComputedStyle(n).opacity}))),sourceEdited:false,debugMutation:false},null,2));console.log('Captured original Proto23 reference, Normal, 1366x768');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
