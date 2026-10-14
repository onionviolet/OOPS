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
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true}),c=await b.newContext({viewport:{width:1366,height:768}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));try{const s=JSON.parse(fs.readFileSync(path.join(fixtureDir,'tranche2-equipped.json')));s.character.xp.total_xp=1000000000000;s.levels.person.main_character.total_xp=1000000000000;s.character.hp_to_full=0;s.availabilities.location['Sparring with the village guard (heavy)']=1;
 await p.goto(base+'style.css');await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),s);await p.goto(base);await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.waitForFunction(()=>document.getElementById('p23_living_gear_panel'));await p.evaluate(()=>window.change_location({location_id:'Sparring with the village guard (heavy)'}));await p.waitForFunction(()=>JSON.parse(localStorage.getItem('save data')).p23_living_gear.lastKill>0,{},{timeout:45000});const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.ok(Object.values(saved.p23_living_gear.copies).every(c=>c.kills===0&&c.reserve===0));assert.deepEqual(errors,[]);fs.writeFileSync(path.join(dir,'tranche2-practice-native.json'),JSON.stringify({status:'PASS',bundleSha256:crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex'),gates:['actual authored native sparring defeat advances ordered event cursor without weapon growth or cinders'],fixtureScope:'existing earned native level and native sparring availability prerequisite; actual paid gear, no new feature rewards seeded',pageErrors:errors},null,2));
}finally{await c.close();await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
