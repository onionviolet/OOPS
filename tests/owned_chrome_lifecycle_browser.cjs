// Explicit hidden browser proof, separate from the fast unit gate. No game/save data.
const assert=require('node:assert/strict');
const {launchChrome,chromeExecutable}=require('../scripts/ui_helpers.cjs');
const {launchOwnedChromium}=require('../scripts/owned_chrome.cjs');
const mode=process.argv[2]||'normal';
(async()=>{
    assert(['normal','assertion','timeout','startup'].includes(mode));
    if(mode==='startup') {
        await assert.rejects(launchChrome({executablePath:'C:/yairpg-absent-proof-browser.exe'}),/executable|exist|launch/i);
        console.log(JSON.stringify({mode,passed:true,proofPid:process.pid}));return;
    }
    const browser=mode==='timeout'?await launchOwnedChromium(require('./helpers/owned_chrome_hung_server.cjs').chromium,{headless:true,executablePath:chromeExecutable()}):await launchChrome();
    const original=new Error('intentional proof assertion');
    const exercise=async()=>{
        try {
            const page=await browser.newPage();await page.setContent('<title>owned lifecycle</title>');
            assert.equal(await page.title(),'owned lifecycle');
            if(mode==='assertion')throw original;
        } finally {const closing=browser.close();assert.equal(browser.close(),closing);await closing;}
    };
    if(mode==='assertion')await assert.rejects(exercise(),error=>{if(error!==original)console.error(error);return error===original;});else await exercise();
    console.log(JSON.stringify({mode,passed:true,proofPid:process.pid}));
})().catch(error=>{console.error(error);process.exitCode=1;});
