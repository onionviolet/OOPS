import {createRequire} from 'node:module';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url),{chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'C:/Users/wayba/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const id='b5b2c1d4625a15be468aadf746f18fc54276e1d8d43e27d32abefdee6eaeb464',base='http://127.0.0.1:4187',evidence='docs/representations/evidence/atlas-reader-visual-2026-11-25/';
const browser=await chromium.launch({headless:true,executablePath:process.env.YAIRPG_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
    const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.setDefaultTimeout(20000);page.on('pageerror',error=>errors.push(error.message));
    const response=await page.request.get(base+'/reading-output-records/mol/molc002/rules/rules'),output=await response.json();
    const record=output.records.find(row=>row.focus==='mol.other.bounded-spells');
    if(!record||output.counts.matchedRows!==19||output.counts.fileRows!==19||output.contentHash!=='sha256:b69f8296f2deaeff9c11052d7be6174d25db92f9d185f8658144efcaf291cc20')throw Error('Actual source join mismatch');
    await page.goto(base+'/#library/outputs/mol/molc002/rules/rules',{waitUntil:'domcontentloaded'});
    await page.getByRole('link',{name:'Structured magic (bounded spells)',exact:true}).click();
    await page.getByRole('heading',{name:'Structured magic (bounded spells)',exact:true}).waitFor();
    const sourceDetails=page.locator('summary').filter({hasText:/^Source and coverage references$/}).first();
    if(await sourceDetails.count())await sourceDetails.click();
    if(!(await page.locator('main').innerText()).includes('en b1 c2 p139'))throw Error('Source locator absent');
    await page.screenshot({path:evidence+'restored-mol-source-current-1920.png',fullPage:true});
    await page.goto(base+'/#workbench/handoffs/'+id,{waitUntil:'domcontentloaded'});
    await page.getByRole('heading',{name:'Structured magic (bounded spells)',exact:true}).waitFor();
    await page.getByRole('button',{name:'Check source version',exact:true}).click();
    await page.getByText('The current output matches the saved file and source lines.',{exact:true}).waitFor();
    const states=[];
    for(const [hash,text]of [['63d1fe9f73f08495158a2cb7169cfef2cb44e1ea185040ce3773780f982885f6','Tested on this exact checkout build.'],['58a6029b2fa7ad2ed84897b8a939de4e667238d434b06f7e5311d9c6670b0bbd','Tested on another build.'],['a5be4f5c093b7e2d68ce7d9dfda01191c5187dbe3121337439b60027a65051c2','Tested on another build.']]){
        const proof=page.locator('.reading-playtest-evidence').filter({has:page.locator('code[title="'+hash+'"]')});
        await proof.getByRole('button',{name:'Compare checkout build',exact:true}).click();await proof.getByText(text,{exact:true}).waitFor();states.push({hash,text});
    }
    await page.screenshot({path:evidence+'restored-mol-workbench-current-1920.png',fullPage:true});
    await page.reload();await page.getByRole('heading',{name:'Structured magic (bounded spells)',exact:true}).waitFor();
    if(await page.locator('.reading-implementation-report').count()!==1||await page.locator('.reading-playtest-evidence').count()!==3)throw Error('Attachments did not survive refresh');
    await page.getByRole('link',{name:'Open batch output',exact:true}).click();await page.getByRole('link',{name:'Structured magic (bounded spells)',exact:true}).waitFor();
    await page.goto(base+'/#world/mol/reading',{waitUntil:'domcontentloaded'});
    await page.getByText('Read, all five passes',{exact:true}).click();
    await page.getByRole('button',{name:'Show measured output readiness',exact:true}).click();
    await page.getByRole('heading',{name:'Measured output readiness',exact:true}).waitFor();
    const readiness=await (await page.request.get(base+'/reading-readiness?world=mol')).json();
    if(readiness.status!=='measured'||readiness.fileState!=='metadata-matches'||readiness.stale.length)throw Error('Readiness stale');
    const text=await page.locator('main').innerText();if(!text.includes('Measured snapshot')||!text.includes('rules / rules'))throw Error('Readiness table absent');
    await page.screenshot({path:evidence+'restored-mol-readiness-current-1920.png',fullPage:true});
    const allWorlds=JSON.parse(fs.readFileSync(evidence+'all-world-readiness-current-result.json')).summaries.map(row=>row.world),statesAll=[];
    for(const world of allWorlds){const state=await(await page.request.get(base+'/reading-readiness?world='+world)).json();statesAll.push({world,status:state.status,fileState:state.fileState,stale:state.stale});}
    if(statesAll.some(state=>state.status!=='measured'||state.stale.length))throw Error('World report stale');
    fs.writeFileSync(evidence+'all-world-readiness-current-freshness.json',JSON.stringify(statesAll,null,2)+'\n');
    const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    const result={mode:'Fresh normal default Atlas registry/snapshot/queue after adoption; no staging override',viewport:{width:1920,height:1080},proposalId:id,source:{record,counts:output.counts,contentHash:output.contentHash,method:output.readingMethod},proofComparisons:states,readiness:{status:readiness.status,fileState:readiness.fileState,outputs:readiness.report.outputs},refreshPreserved:true,openBatchAfterRefresh:true,snapshotSha256:hash('work/atlas-snapshot/snapshot.json'),digestSha256:hash('work/atlas-snapshot/readers/mol.json'),immutablePacketVerified:hash('work/atlas-reading-handoffs/'+id+'.json')===id,errors};
    if(!result.immutablePacketVerified||errors.length)throw Error('Packet changed or browser error');
    fs.writeFileSync(evidence+'restored-mol-current-result.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({proposalId:id,sourceCounts:output.counts,proofComparisons:states,errors}));
}catch(error){console.error(error);throw error;}
finally{await Promise.race([browser.close(),new Promise(resolve=>setTimeout(resolve,3000))]);}



