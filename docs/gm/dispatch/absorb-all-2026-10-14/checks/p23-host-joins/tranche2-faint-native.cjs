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
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true}),c=await b.newContext({viewport:{width:1366,height:768}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));try{const raw=fs.readFileSync(path.join(fixtureDir,'tranche2-queued.save.txt'),'utf8').trim(),fixture=JSON.parse(Buffer.from(raw.replace(/^YAIR-UTF8-1:/,''),'base64').toString('utf8'));fixture.character.hp_to_full=59;fixture.options.auto_return_to_bed=false;const deaths=fixture.total_deaths||0;
 await p.goto(base+'style.css');await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),fixture);await p.goto(base);await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.waitForFunction(()=>document.getElementById('p23_combat_options_panel'));await p.locator('#p23_combat_options_panel summary').click();await p.locator('[data-combat-option="break"]').click();await p.evaluate(()=>window.change_location({location_id:'Infested field'}));
 await p.waitForFunction(deaths=>{const s=JSON.parse(localStorage.getItem('save data'));return s.total_deaths===deaths+1&&s['current location']==='Village';},deaths,{timeout:25000});const settled=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.equal(settled.native_encounter,null);assert.equal(settled.combatOptions.phase,'active');assert.ok(settled.active_effects.Recovering);await p.reload();await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.waitForTimeout(1000);assert.equal((await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')))).total_deaths,deaths+1);assert.deepEqual(errors,[]);fs.writeFileSync(path.join(dir,'tranche2-faint-native.json'),JSON.stringify({status:'PASS',bundleSha256:crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex'),gates:['actual normal-combat faint settles existing defeat count, native return and Recovering together; reload does not repeat defeat'],pageErrors:errors},null,2));
}finally{await c.close();await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
