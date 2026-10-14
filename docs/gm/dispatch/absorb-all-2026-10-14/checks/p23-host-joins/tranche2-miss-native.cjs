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
(async()=>{const {createStreams}=await import(path.resolve('src/seeded_streams.js'));const b=await chromium.launch({channel:'chrome',headless:true}),c=await b.newContext({viewport:{width:1366,height:768}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));try{let miss=false,attempts=0;const raw=fs.readFileSync(path.join(fixtureDir,'tranche2-queued.save.txt'),'utf8').trim(),source=JSON.parse(Buffer.from(raw.replace(/^YAIR-UTF8-1:/,''),'base64').toString('utf8'));
 for(const seed of [1,2,3,4,5,6,7,8,9,10,11,12]){attempts++;const fixture=structuredClone(source);fixture['current time'].hour=21;fixture['current time'].minute=0;fixture.expansion.streams=createStreams(seed);fixture.pacing_e1.hungerEnabled=false;fixture.pacing_e1.weatherEnabled=false;
 await p.goto(base+'style.css');await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),fixture);await p.goto(base,{waitUntil:'domcontentloaded'});await p.locator('#loading_screen_play_button:not(.none_display)').click({noWaitAfter:true});await p.waitForFunction(()=>document.getElementById('p23_combat_options_panel'));await p.evaluate(()=>window.change_location({location_id:'Infested field'}));await p.waitForFunction(()=>['exchange-break','encounter-break'].includes(JSON.parse(localStorage.getItem('save data')).combatOptions?.phase),{},{timeout:15000});const state=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.ok(state.combatOptions.lastEvent>fixture.combatOptions.lastEvent);const target=state.native_encounter.enemies.at(-1);miss=target.full.health===target.full.max_health;if(miss){assert.match(await p.locator('#message_log_div').innerText(),/evaded an attack/);break;}}
 assert.ok(miss);assert.deepEqual(errors,[]);fs.writeFileSync(path.join(dir,'tranche2-miss-native.json'),JSON.stringify({status:'PASS',bundleSha256:crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex'),gates:['actual paid native projectile can miss without damaging target; real event/payment still settle'],seededFixtureAttempts:attempts,pageErrors:errors},null,2));
}finally{await c.close();await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
