// Each invocation owns a fresh browser context and a unique evidence directory.
// Committed fixtures are immutable prerequisites, never another check's output.
const __p00Fs = require('fs'), __p00Path = require('path');
if (!process.env.URL) throw new Error('Set URL to the served native build origin.');
const __p00Base = new URL(process.env.URL);
if (!/^https?:$/.test(__p00Base.protocol)) throw new Error('URL must use HTTP or HTTPS.');
const __p00URL = __p00Base.href.replace(/\/?$/, '/');
const fixtureDir = __p00Path.join(__dirname, 'fixtures');
const __p00ProofRoot = process.env.YAIRPG_PROOF_DIR || require('os').tmpdir();
__p00Fs.mkdirSync(__p00ProofRoot, {recursive: true});
const __p00OutputDir = __p00Fs.mkdtempSync(__p00Path.join(__p00ProofRoot, __p00Path.basename(__filename, '.cjs') + '-'));
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const base=__p00URL,dir=__p00OutputDir;
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true}),c=await b.newContext({viewport:{width:1366,height:768}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>{errors.push(e.message);console.log('PAGE',e.message);});p.on('console',m=>{if(m.type()==='error')console.log(m.text());});try{const fixture=JSON.parse(fs.readFileSync(path.join(fixtureDir,'tranche2-equipped.json')));
 await p.goto(base+'style.css');await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),fixture);await p.goto(base,{waitUntil:'domcontentloaded'});await p.locator('#loading_screen_play_button:not(.none_display)').click({noWaitAfter:true});await p.waitForFunction(()=>document.getElementById('systems_workshop_panel'));await p.evaluate(()=>window.start_dialogue('villageElder'));await p.locator('[data-textline="hello"]').click();await p.evaluate(()=>window.end_dialogue());await p.locator('#systems_workshop_panel > summary').click();await p.locator('#systems_workshop_panel').getByRole('button',{name:'Follow local people and work',exact:true}).click();await p.locator('#save_button').click();const enrolled=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));if(!enrolled.expansion.simulation)console.log(await p.locator('#systems_workshop_panel').innerText());assert.ok(enrolled.expansion.simulation.people.oldCraftsman);
 const key=Object.keys(enrolled.inventories.person.main_character).find(k=>JSON.parse(k).id==='Cinder keeper ring'&&JSON.parse(k).e2_instance);assert.ok(key);
 // Admitted old-save custody prerequisite uses the actually enrolled native
 // craftsman/player owners and an actual paid, allocated physical ring copy.
 // It proves refusal under this valid loan receipt, not a new lending route.
 enrolled.expansion.simulation.custody['p00.native.custody.control']={owner:'oldCraftsman',holder:'player',key,count:1,at:enrolled.expansion.clock};
 const file=path.join(dir,'tranche2-custody.save.txt');fs.writeFileSync(file,'YAIR-UTF8-1:'+Buffer.from(JSON.stringify(enrolled)).toString('base64'));await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles(file)]);await p.locator('#loading_screen_play_button:not(.none_display)').click({noWaitAfter:true});await p.waitForFunction(()=>document.getElementById('p23_living_gear_panel'));await p.locator('#save_button').click();
 const refused=await p.evaluate(key=>{const prior=localStorage.getItem('save data');window.equip_item(key);return {unchanged:prior===localStorage.getItem('save data'),text:document.getElementById('message_log_div').innerText};},key);assert.ok(refused.unchanged);assert.match(refused.text,/Return borrowed goods/);assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(dir,'tranche2-custody-native.json'),JSON.stringify({status:'PASS',bundleSha256:crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex'),gates:['actual native equip handler refuses admitted borrowed allocated ring before inventory/identity/save mutation'],fixtureScope:'borrow receipt after actual native owner enrollment; no natural lending-route claim',pageErrors:errors},null,2));
}finally{await c.close();await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
